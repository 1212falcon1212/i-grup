import { z } from "zod";

export const bannerCreateSchema = z.object({
  title: z.string().trim().min(2, "Başlık en az 2 karakter"),
  subtitle: z.string().trim().optional().or(z.literal("")),
  imageUrl: z.string().trim().min(1, "Görsel zorunlu"),
  ctaText: z.string().trim().optional().or(z.literal("")),
  ctaUrl: z.string().trim().optional().or(z.literal("")),
  order: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(true),
});

export const bannerUpdateSchema = bannerCreateSchema.partial();

export type BannerFormValues = z.input<typeof bannerCreateSchema>;
