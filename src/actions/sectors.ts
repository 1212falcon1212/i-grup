"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  sectorCreateSchema,
  sectorUpdateSchema,
} from "@/lib/validators/sector";
import { requireAdmin } from "./_helpers";

function revalidateAll() {
  revalidatePath("/admin/sectors");
  revalidatePath("/");
}

export type SectorInput = {
  id?: string;
  slug: string;
  name: string;
  detail: string;
  countOverride?: number | null;
  order?: number;
};

export async function saveSector(input: SectorInput) {
  await requireAdmin();

  if (input.id) {
    const parsed = sectorUpdateSchema.parse(input);
    await prisma.sector.update({
      where: { id: input.id },
      data: {
        slug: parsed.slug!,
        name: parsed.name!,
        detail: parsed.detail!,
        countOverride:
          parsed.countOverride === null || parsed.countOverride === undefined
            ? null
            : parsed.countOverride,
        order: parsed.order ?? 0,
      },
    });
  } else {
    const parsed = sectorCreateSchema.parse(input);
    const max = await prisma.sector.aggregate({ _max: { order: true } });
    await prisma.sector.create({
      data: {
        slug: parsed.slug,
        name: parsed.name,
        detail: parsed.detail,
        countOverride: parsed.countOverride ?? null,
        order: parsed.order ?? (max._max.order ?? -1) + 1,
      },
    });
  }
  revalidateAll();
  return { ok: true };
}

export async function deleteSector(id: string) {
  await requireAdmin();
  await prisma.sector.delete({ where: { id } });
  revalidateAll();
  return { ok: true };
}

export async function reorderSectors(ids: string[]) {
  await requireAdmin();
  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.sector.update({ where: { id }, data: { order: index } })
    )
  );
  revalidateAll();
  return { ok: true };
}
