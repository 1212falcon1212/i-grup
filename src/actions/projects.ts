"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { projectCreateSchema } from "@/lib/validators/project";
import { stringifyArray } from "@/lib/json-array";
import { requireAdmin } from "./_helpers";

function revalidateProjects() {
  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath("/projelerimiz");
}

export type ProjectInput = {
  id?: string;
  title: string;
  slug: string;
  client?: string;
  category: string;
  shortDesc: string;
  content: string;
  coverImage: string;
  gallery: string[];
  techStack: string[];
  liveUrl?: string;
  year?: number;
  isFeatured?: boolean;
  order?: number;
  seoTitle?: string;
  seoDescription?: string;
};

export async function saveProject(input: ProjectInput) {
  await requireAdmin();
  const parsed = projectCreateSchema.parse(input);
  const data = {
    title: parsed.title,
    slug: parsed.slug,
    client: parsed.client || null,
    category: parsed.category,
    shortDesc: parsed.shortDesc,
    content: parsed.content,
    coverImage: parsed.coverImage,
    gallery: stringifyArray(parsed.gallery ?? []),
    techStack: stringifyArray(parsed.techStack ?? []),
    liveUrl: parsed.liveUrl || null,
    year: parsed.year ?? null,
    isFeatured: parsed.isFeatured,
    order: parsed.order ?? 0,
    seoTitle: parsed.seoTitle || null,
    seoDescription: parsed.seoDescription || null,
  };

  if (input.id) {
    await prisma.project.update({ where: { id: input.id }, data });
    revalidatePath(`/projelerimiz/${parsed.slug}`);
  } else {
    await prisma.project.create({ data });
  }
  revalidateProjects();
  return { ok: true };
}

export async function deleteProject(id: string) {
  await requireAdmin();
  const existing = await prisma.project.findUnique({ where: { id } });
  await prisma.project.delete({ where: { id } });
  if (existing) revalidatePath(`/projelerimiz/${existing.slug}`);
  revalidateProjects();
  return { ok: true };
}

export async function toggleProjectFeatured(id: string, isFeatured: boolean) {
  await requireAdmin();
  await prisma.project.update({ where: { id }, data: { isFeatured } });
  revalidateProjects();
  return { ok: true };
}
