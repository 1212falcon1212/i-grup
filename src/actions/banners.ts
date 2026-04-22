"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { bannerCreateSchema, bannerUpdateSchema } from "@/lib/validators/banner";
import { requireAdmin } from "./_helpers";

function revalidateBanners() {
  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export type BannerInput = {
  id?: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  ctaText?: string;
  ctaUrl?: string;
  order?: number;
  isActive?: boolean;
};

export async function saveBanner(input: BannerInput) {
  await requireAdmin();

  if (input.id) {
    const parsed = bannerUpdateSchema.parse(input);
    await prisma.banner.update({
      where: { id: input.id },
      data: {
        title: parsed.title,
        subtitle: parsed.subtitle || null,
        imageUrl: parsed.imageUrl!,
        ctaText: parsed.ctaText || null,
        ctaUrl: parsed.ctaUrl || null,
        order: parsed.order ?? 0,
        isActive: parsed.isActive ?? true,
      },
    });
  } else {
    const parsed = bannerCreateSchema.parse(input);
    const max = await prisma.banner.aggregate({ _max: { order: true } });
    await prisma.banner.create({
      data: {
        title: parsed.title,
        subtitle: parsed.subtitle || null,
        imageUrl: parsed.imageUrl,
        ctaText: parsed.ctaText || null,
        ctaUrl: parsed.ctaUrl || null,
        order: parsed.order ?? (max._max.order ?? -1) + 1,
        isActive: parsed.isActive,
      },
    });
  }
  revalidateBanners();
  return { ok: true };
}

export async function deleteBanner(id: string) {
  await requireAdmin();
  await prisma.banner.delete({ where: { id } });
  revalidateBanners();
  return { ok: true };
}

export async function reorderBanners(ids: string[]) {
  await requireAdmin();
  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.banner.update({ where: { id }, data: { order: index } })
    )
  );
  revalidateBanners();
  return { ok: true };
}

export async function toggleBannerActive(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.banner.update({ where: { id }, data: { isActive } });
  revalidateBanners();
  return { ok: true };
}
