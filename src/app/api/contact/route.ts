import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { contactSchema } from "@/lib/validators/contact";
import { sendMail, getAdminEmail } from "@/lib/mailer";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "anon";

  const limit = rateLimit(`contact:${ip}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Çok fazla deneme, lütfen biraz bekleyin." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Geçersiz veri";
    return NextResponse.json({ error: first }, { status: 400 });
  }

  const data = parsed.data;

  const saved = await prisma.contactMessage.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject,
      message: data.message,
    },
  });

  const adminEmail = await getAdminEmail();
  await sendMail({
    to: adminEmail,
    replyTo: data.email,
    subject: `[i-grup] Yeni iletişim: ${data.subject}`,
    html: `
      <h2>Yeni iletişim mesajı</h2>
      <p><strong>Ad Soyad:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>E-posta:</strong> ${escapeHtml(data.email)}</p>
      ${data.phone ? `<p><strong>Telefon:</strong> ${escapeHtml(data.phone)}</p>` : ""}
      <p><strong>Konu:</strong> ${escapeHtml(data.subject)}</p>
      <p><strong>Mesaj:</strong></p>
      <p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>
    `,
  });

  return NextResponse.json({ ok: true, id: saved.id });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
