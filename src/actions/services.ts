"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { serviceCreateSchema } from "@/lib/validators/service";
import { requireAdmin } from "./_helpers";

function revalidateServices() {
  revalidatePath("/admin/services");
  revalidatePath("/");
  revalidatePath("/hizmetlerimiz");
}

export type ServiceInput = {
  id?: string;
  title: string;
  slug: string;
  shortDesc: string;
  icon?: string;
  coverImage?: string;
  content: string;
  order?: number;
  isActive?: boolean;
  seoTitle?: string;
  seoDescription?: string;
};

export async function saveService(input: ServiceInput) {
  await requireAdmin();
  const parsed = serviceCreateSchema.parse(input);
  const data = {
    title: parsed.title,
    slug: parsed.slug,
    shortDesc: parsed.shortDesc,
    icon: parsed.icon || null,
    coverImage: parsed.coverImage || null,
    content: parsed.content,
    order: parsed.order ?? 0,
    isActive: parsed.isActive,
    seoTitle: parsed.seoTitle || null,
    seoDescription: parsed.seoDescription || null,
  };

  if (input.id) {
    await prisma.service.update({ where: { id: input.id }, data });
    revalidatePath(`/hizmetlerimiz/${parsed.slug}`);
  } else {
    const max = await prisma.service.aggregate({ _max: { order: true } });
    await prisma.service.create({
      data: { ...data, order: (max._max.order ?? -1) + 1 },
    });
  }
  revalidateServices();
  return { ok: true };
}

export async function deleteService(id: string) {
  await requireAdmin();
  const existing = await prisma.service.findUnique({ where: { id } });
  await prisma.service.delete({ where: { id } });
  if (existing) revalidatePath(`/hizmetlerimiz/${existing.slug}`);
  revalidateServices();
  return { ok: true };
}

export async function reorderServices(ids: string[]) {
  await requireAdmin();
  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.service.update({ where: { id }, data: { order: index } })
    )
  );
  revalidateServices();
  return { ok: true };
}

export async function toggleServiceActive(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.service.update({ where: { id }, data: { isActive } });
  revalidateServices();
  return { ok: true };
}
