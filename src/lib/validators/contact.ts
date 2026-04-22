import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Ad soyad zorunlu"),
  email: z.string().trim().email("Geçerli bir e-posta girin"),
  phone: z.string().trim().optional().or(z.literal("")),
  company: z.string().trim().optional().or(z.literal("")),
  subject: z.string().trim().min(2, "Konu zorunlu"),
  message: z.string().trim().min(10, "Mesaj en az 10 karakter olmalı"),
  kvkkConsent: z.literal(true, { message: "KVKK onayı gereklidir" }),
});

export type ContactFormValues = z.input<typeof contactSchema>;

export const miniContactSchema = z.object({
  name: z.string().trim().min(2, "Ad soyad zorunlu"),
  email: z.string().trim().email("Geçerli bir e-posta girin"),
  message: z.string().trim().min(5, "Mesaj en az 5 karakter olmalı"),
});

export type MiniContactValues = z.input<typeof miniContactSchema>;
