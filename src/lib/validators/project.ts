import { z } from "zod";
import { slugSchema } from "./common";

export const projectCreateSchema = z.object({
  title: z.string().trim().min(2, "Başlık en az 2 karakter"),
  slug: slugSchema,
  client: z.string().trim().optional().or(z.literal("")),
  category: z.string().trim().min(2, "Kategori zorunlu"),
  shortDesc: z
    .string()
    .trim()
    .min(10, "Kısa açıklama en az 10 karakter")
    .max(280, "Kısa açıklama en fazla 280 karakter"),
  content: z.string().min(1, "İçerik zorunlu"),
  coverImage: z.string().trim().min(1, "Kapak görseli zorunlu"),
  gallery: z.array(z.string().trim()).default([]),
  techStack: z.array(z.string().trim()).default([]),
  liveUrl: z.string().trim().optional().or(z.literal("")),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
  isFeatured: z.coerce.boolean().default(false),
  order: z.coerce.number().int().default(0),
  seoTitle: z.string().trim().optional().or(z.literal("")),
  seoDescription: z.string().trim().optional().or(z.literal("")),
});

export const projectUpdateSchema = projectCreateSchema.partial();

export type ProjectFormValues = z.input<typeof projectCreateSchema>;
