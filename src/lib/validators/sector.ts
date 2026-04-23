import { z } from "zod";
import { slugSchema } from "./common";

export const sectorCreateSchema = z.object({
  slug: slugSchema,
  name: z.string().trim().min(2, "İsim en az 2 karakter"),
  detail: z.string().trim().min(10, "Açıklama en az 10 karakter"),
  countOverride: z.coerce.number().int().min(0).optional().nullable(),
  order: z.coerce.number().int().default(0),
});

export const sectorUpdateSchema = sectorCreateSchema.partial();

export type SectorFormValues = z.input<typeof sectorCreateSchema>;
