"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  aboutValueCreateSchema,
  aboutValueUpdateSchema,
} from "@/lib/validators/about-value";
import { requireAdmin } from "./_helpers";

function revalidateAll() {
  revalidatePath("/admin/about-values");
  revalidatePath("/");
}

export type AboutValueInput = {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  order?: number;
  isActive?: boolean;
};

export async function saveAboutValue(input: AboutValueInput) {
  await requireAdmin();

  if (input.id) {
    const parsed = aboutValueUpdateSchema.parse(input);
    await prisma.aboutValue.update({
      where: { id: input.id },
      data: {
        eyebrow: parsed.eyebrow!,
        title: parsed.title!,
        description: parsed.description!,
        order: parsed.order ?? 0,
        isActive: parsed.isActive ?? true,
      },
    });
  } else {
    const parsed = aboutValueCreateSchema.parse(input);
    const max = await prisma.aboutValue.aggregate({ _max: { order: true } });
    await prisma.aboutValue.create({
      data: {
        eyebrow: parsed.eyebrow,
        title: parsed.title,
        description: parsed.description,
        order: parsed.order ?? (max._max.order ?? -1) + 1,
        isActive: parsed.isActive,
      },
    });
  }
  revalidateAll();
  return { ok: true };
}

export async function deleteAboutValue(id: string) {
  await requireAdmin();
  await prisma.aboutValue.delete({ where: { id } });
  revalidateAll();
  return { ok: true };
}

export async function reorderAboutValues(ids: string[]) {
  await requireAdmin();
  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.aboutValue.update({ where: { id }, data: { order: index } })
    )
  );
  revalidateAll();
  return { ok: true };
}

export async function toggleAboutValueActive(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.aboutValue.update({ where: { id }, data: { isActive } });
  revalidateAll();
  return { ok: true };
}
