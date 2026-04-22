"use server";

import { unlink } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Yetkisiz erişim");
  }
}

export async function listMedia() {
  await requireAdmin();
  return prisma.media.findMany({ orderBy: { createdAt: "desc" } });
}

export async function deleteMedia(id: string) {
  await requireAdmin();
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return { ok: false, error: "Medya bulunamadı" };

  try {
    const absolute = path.join(process.cwd(), "public", media.path.replace(/^\//, ""));
    await unlink(absolute);
  } catch {
    // Dosya zaten yoksa sessizce devam et
  }

  await prisma.media.delete({ where: { id } });
  revalidatePath("/admin/media");
  return { ok: true };
}

export async function updateMediaAlt(id: string, alt: string) {
  await requireAdmin();
  await prisma.media.update({ where: { id }, data: { alt: alt || null } });
  revalidatePath("/admin/media");
  return { ok: true };
}
