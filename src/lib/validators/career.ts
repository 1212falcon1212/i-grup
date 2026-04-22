import { z } from "zod";
import { slugSchema } from "./common";

export const careerCreateSchema = z.object({
  title: z.string().trim().min(2, "Başlık en az 2 karakter"),
  slug: slugSchema,
  department: z.string().trim().min(2, "Departman zorunlu"),
  location: z.string().trim().min(2, "Lokasyon zorunlu"),
  type: z.string().trim().min(2, "İstihdam tipi zorunlu"),
  shortDesc: z
    .string()
    .trim()
    .min(10, "Kısa açıklama en az 10 karakter")
    .max(280, "Kısa açıklama en fazla 280 karakter"),
  content: z.string().min(1, "İçerik zorunlu"),
  isActive: z.coerce.boolean().default(true),
});

export const careerUpdateSchema = careerCreateSchema.partial();

export type CareerFormValues = z.input<typeof careerCreateSchema>;

export const careerApplicationSchema = z.object({
  name: z.string().trim().min(2, "Ad soyad zorunlu"),
  email: z.string().trim().email("Geçerli bir e-posta girin"),
  phone: z.string().trim().min(6, "Telefon zorunlu"),
  linkedinUrl: z.string().trim().url("Geçerli bir LinkedIn URL'i girin").optional().or(z.literal("")),
  coverLetter: z.string().trim().optional().or(z.literal("")),
});
