import { z } from "zod";

const optionalString = z.string().trim().optional().or(z.literal(""));

export const settingsUpdateSchema = z.object({
  siteName: z.string().trim().min(1, "Site adı zorunlu"),
  logoUrl: optionalString,
  faviconUrl: optionalString,
  tagline: optionalString,
  email: optionalString,
  phone: optionalString,
  address: optionalString,
  whatsapp: optionalString,
  linkedinUrl: optionalString,
  instagramUrl: optionalString,
  xUrl: optionalString,
  footerText: optionalString,
  defaultSeoTitle: optionalString,
  defaultSeoDesc: optionalString,
  gtmId: optionalString,
  statProjects: z.coerce.number().int().min(0).default(15),
  statClients: z.coerce.number().int().min(0).default(40),
  statYears: z.coerce.number().int().min(0).default(8),
});

export type SettingsFormValues = z.input<typeof settingsUpdateSchema>;
