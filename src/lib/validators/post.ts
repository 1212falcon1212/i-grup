import { z } from "zod";
import { slugSchema } from "./common";

const optionalString = z.string().trim().optional().or(z.literal(""));

export const postCreateSchema = z.object({
  slug: slugSchema,
  tag: z.string().trim().min(1, "Tag zorunlu"),
  title: z.string().trim().min(2, "Başlık en az 2 karakter"),
  excerpt: z.string().trim().min(10, "Özet en az 10 karakter").max(280),
  content: z.string().min(10, "İçerik zorunlu"),
  coverImage: optionalString,
  publishedAt: z.coerce.date().default(() => new Date()),
  isPublished: z.coerce.boolean().default(true),
  seoTitle: optionalString,
  seoDescription: optionalString,
});

export const postUpdateSchema = postCreateSchema.partial();

export type PostFormValues = z.input<typeof postCreateSchema>;
