"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { pageUpdateSchema } from "@/lib/validators/page";
import { requireAdmin } from "./_helpers";

function revalidatePage(slug: string) {
  revalidatePath("/admin/pages");
  revalidatePath("/");
  const pathMap: Record<string, string> = {
    hakkimizda: "/hakkimizda",
    misyonumuz: "/misyonumuz",
    hizmetlerimiz: "/hizmetlerimiz",
    kariyer: "/kariyer",
    kvkk: "/kvkk",
    "gizlilik-politikasi": "/gizlilik-politikasi",
  };
  const publicPath = pathMap[slug];
  if (publicPath) revalidatePath(publicPath);
}

export async function updatePage(id: string, input: unknown) {
  await requireAdmin();
  const parsed = pageUpdateSchema.parse(input);
  const existing = await prisma.page.findUnique({ where: { id } });
  if (!existing) throw new Error("Sayfa bulunamadı");

  await prisma.page.update({
    where: { id },
    data: {
      title: parsed.title,
      subtitle: parsed.subtitle || null,
      heroImageUrl: parsed.heroImageUrl || null,
      content: parsed.content,
      seoTitle: parsed.seoTitle || null,
      seoDescription: parsed.seoDescription || null,
    },
  });

  revalidatePage(existing.slug);
  return { ok: true };
}
