import { z } from "zod";
import { slugSchema } from "./common";

export const pageUpdateSchema = z.object({
  slug: slugSchema.optional(),
  title: z.string().trim().min(2, "Başlık en az 2 karakter"),
  subtitle: z.string().trim().optional().or(z.literal("")),
  heroImageUrl: z.string().trim().optional().or(z.literal("")),
  content: z.string().min(1, "İçerik zorunlu"),
  seoTitle: z.string().trim().optional().or(z.literal("")),
  seoDescription: z.string().trim().optional().or(z.literal("")),
});

export type PageFormValues = z.input<typeof pageUpdateSchema>;
