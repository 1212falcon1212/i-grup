"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { careerCreateSchema } from "@/lib/validators/career";
import { requireAdmin } from "./_helpers";

function revalidateCareers() {
  revalidatePath("/admin/careers");
  revalidatePath("/kariyer");
}

export type CareerInput = {
  id?: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: string;
  shortDesc: string;
  content: string;
  isActive?: boolean;
};

export async function saveCareer(input: CareerInput) {
  await requireAdmin();
  const parsed = careerCreateSchema.parse(input);
  const data = {
    title: parsed.title,
    slug: parsed.slug,
    department: parsed.department,
    location: parsed.location,
    type: parsed.type,
    shortDesc: parsed.shortDesc,
    content: parsed.content,
    isActive: parsed.isActive,
  };

  if (input.id) {
    await prisma.career.update({ where: { id: input.id }, data });
    revalidatePath(`/kariyer/${parsed.slug}`);
  } else {
    await prisma.career.create({ data });
  }
  revalidateCareers();
  return { ok: true };
}

export async function deleteCareer(id: string) {
  await requireAdmin();
  const existing = await prisma.career.findUnique({ where: { id } });
  await prisma.career.delete({ where: { id } });
  if (existing) revalidatePath(`/kariyer/${existing.slug}`);
  revalidateCareers();
  return { ok: true };
}

export async function toggleCareerActive(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.career.update({ where: { id }, data: { isActive } });
  revalidateCareers();
  return { ok: true };
}
