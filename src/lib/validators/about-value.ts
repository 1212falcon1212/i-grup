import { z } from "zod";

export const aboutValueCreateSchema = z.object({
  eyebrow: z.string().trim().min(2, "Etiket en az 2 karakter"),
  title: z.string().trim().min(2, "Başlık en az 2 karakter"),
  description: z.string().trim().min(5, "Açıklama en az 5 karakter"),
  order: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(true),
});

export const aboutValueUpdateSchema = aboutValueCreateSchema.partial();

export type AboutValueFormValues = z.input<typeof aboutValueCreateSchema>;
