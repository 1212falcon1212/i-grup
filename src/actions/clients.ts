"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  clientCreateSchema,
  clientUpdateSchema,
} from "@/lib/validators/client";
import { requireAdmin } from "./_helpers";

function revalidateAll() {
  revalidatePath("/admin/clients");
  revalidatePath("/");
}

export type ClientInput = {
  id?: string;
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
  order?: number;
  isActive?: boolean;
};

export async function saveClient(input: ClientInput) {
  await requireAdmin();

  if (input.id) {
    const parsed = clientUpdateSchema.parse(input);
    await prisma.client.update({
      where: { id: input.id },
      data: {
        name: parsed.name!,
        logoUrl: parsed.logoUrl || null,
        websiteUrl: parsed.websiteUrl || null,
        order: parsed.order ?? 0,
        isActive: parsed.isActive ?? true,
      },
    });
  } else {
    const parsed = clientCreateSchema.parse(input);
    const max = await prisma.client.aggregate({ _max: { order: true } });
    await prisma.client.create({
      data: {
        name: parsed.name,
        logoUrl: parsed.logoUrl || null,
        websiteUrl: parsed.websiteUrl || null,
        order: parsed.order ?? (max._max.order ?? -1) + 1,
        isActive: parsed.isActive,
      },
    });
  }
  revalidateAll();
  return { ok: true };
}

export async function deleteClient(id: string) {
  await requireAdmin();
  await prisma.client.delete({ where: { id } });
  revalidateAll();
  return { ok: true };
}

export async function reorderClients(ids: string[]) {
  await requireAdmin();
  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.client.update({ where: { id }, data: { order: index } })
    )
  );
  revalidateAll();
  return { ok: true };
}

export async function toggleClientActive(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.client.update({ where: { id }, data: { isActive } });
  revalidateAll();
  return { ok: true };
}
