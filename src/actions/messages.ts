"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./_helpers";

function revalidateMessages() {
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function markMessageRead(id: string, isRead: boolean) {
  await requireAdmin();
  await prisma.contactMessage.update({ where: { id }, data: { isRead } });
  revalidateMessages();
  return { ok: true };
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id } });
  revalidateMessages();
  return { ok: true };
}
