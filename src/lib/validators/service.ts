import { z } from "zod";
import { slugSchema } from "./common";

export const serviceCreateSchema = z.object({
  title: z.string().trim().min(2, "Başlık en az 2 karakter"),
  slug: slugSchema,
  shortDesc: z
    .string()
    .trim()
    .min(10, "Kısa açıklama en az 10 karakter")
    .max(280, "Kısa açıklama en fazla 280 karakter"),
  icon: z.string().trim().optional().or(z.literal("")),
  coverImage: z.string().trim().optional().or(z.literal("")),
  content: z.string().min(1, "İçerik zorunlu"),
  order: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(true),
  seoTitle: z.string().trim().optional().or(z.literal("")),
  seoDescription: z.string().trim().optional().or(z.literal("")),
});

export const serviceUpdateSchema = serviceCreateSchema.partial();

export type ServiceFormValues = z.input<typeof serviceCreateSchema>;
