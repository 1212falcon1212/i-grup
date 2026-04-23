"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { postCreateSchema } from "@/lib/validators/post";
import { requireAdmin } from "./_helpers";

function revalidatePost(slug?: string) {
  revalidatePath("/admin/posts");
  revalidatePath("/");
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}

export type PostInput = {
  id?: string;
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  publishedAt?: Date | string;
  isPublished?: boolean;
  seoTitle?: string;
  seoDescription?: string;
};

export async function savePost(input: PostInput) {
  await requireAdmin();
  const parsed = postCreateSchema.parse(input);
  const data = {
    slug: parsed.slug,
    tag: parsed.tag,
    title: parsed.title,
    excerpt: parsed.excerpt,
    content: parsed.content,
    coverImage: parsed.coverImage || null,
    publishedAt: parsed.publishedAt,
    isPublished: parsed.isPublished,
    seoTitle: parsed.seoTitle || null,
    seoDescription: parsed.seoDescription || null,
  };

  if (input.id) {
    await prisma.post.update({ where: { id: input.id }, data });
  } else {
    await prisma.post.create({ data });
  }
  revalidatePost(parsed.slug);
  return { ok: true };
}

export async function deletePost(id: string) {
  await requireAdmin();
  const existing = await prisma.post.findUnique({ where: { id } });
  await prisma.post.delete({ where: { id } });
  revalidatePost(existing?.slug);
  return { ok: true };
}

export async function togglePostPublished(id: string, isPublished: boolean) {
  await requireAdmin();
  const existing = await prisma.post.findUnique({ where: { id } });
  await prisma.post.update({ where: { id }, data: { isPublished } });
  revalidatePost(existing?.slug);
  return { ok: true };
}
