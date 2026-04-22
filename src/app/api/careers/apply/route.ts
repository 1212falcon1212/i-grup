import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { careerApplicationSchema } from "@/lib/validators/career";
import { saveRawFile } from "@/lib/uploads";
import { sendMail, getAdminEmail } from "@/lib/mailer";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_CV_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "anon";
  const limit = rateLimit(`apply:${ip}`, 3, 5 * 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Çok fazla deneme, lütfen biraz bekleyin." },
      { status: 429 }
    );
  }

  const ct = request.headers.get("content-type") ?? "";
  if (!ct.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "multipart/form-data gerekli" },
      { status: 400 }
    );
  }

  const fd = await request.formData();
  const careerSlug = String(fd.get("careerSlug") ?? "");
  if (!careerSlug) {
    return NextResponse.json({ error: "Geçersiz ilan" }, { status: 400 });
  }

  const career = await prisma.career.findUnique({
    where: { slug: careerSlug },
  });
  if (!career) {
    return NextResponse.json({ error: "İlan bulunamadı" }, { status: 404 });
  }

  const parsed = careerApplicationSchema.safeParse({
    name: fd.get("name"),
    email: fd.get("email"),
    phone: fd.get("phone"),
    linkedinUrl: fd.get("linkedinUrl"),
    coverLetter: fd.get("coverLetter"),
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Geçersiz veri";
    return NextResponse.json({ error: first }, { status: 400 });
  }

  const file = fd.get("cv");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "CV zorunlu" }, { status: 400 });
  }
  if (file.type !== "application/pdf") {
    return NextResponse.json(
      { error: "CV yalnızca PDF olabilir" },
      { status: 400 }
    );
  }
  if (file.size > MAX_CV_BYTES) {
    return NextResponse.json(
      { error: "CV max 5MB olabilir" },
      { status: 400 }
    );
  }

  const saved = await saveRawFile(file, "cv");
  const data = parsed.data;

  const adminEmail = await getAdminEmail();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  await sendMail({
    to: adminEmail,
    replyTo: data.email,
    subject: `[i-grup] Kariyer başvurusu — ${career.title}`,
    html: `
      <h2>Yeni başvuru: ${escapeHtml(career.title)}</h2>
      <p><strong>Ad Soyad:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>E-posta:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Telefon:</strong> ${escapeHtml(data.phone)}</p>
      ${
        data.linkedinUrl
          ? `<p><strong>LinkedIn:</strong> <a href="${escapeHtml(
              data.linkedinUrl
            )}">${escapeHtml(data.linkedinUrl)}</a></p>`
          : ""
      }
      ${
        data.coverLetter
          ? `<p><strong>Ön yazı:</strong></p><p>${escapeHtml(data.coverLetter).replace(
              /\n/g,
              "<br>"
            )}</p>`
          : ""
      }
      <p><strong>CV:</strong> <a href="${siteUrl}${saved.relativePath}">${saved.filename}</a></p>
    `,
  });

  return NextResponse.json({ ok: true });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
