import { z } from "zod";

const optionalString = z.string().trim().optional().or(z.literal(""));

export const clientCreateSchema = z.object({
  name: z.string().trim().min(2, "İsim en az 2 karakter"),
  logoUrl: optionalString,
  websiteUrl: optionalString,
  order: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(true),
});

export const clientUpdateSchema = clientCreateSchema.partial();

export type ClientFormValues = z.input<typeof clientCreateSchema>;
