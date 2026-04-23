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
  statProjects: z.coerce.number().int().min(0).default(13),
  statSectors: z.coerce.number().int().min(0).default(6),
  statYears: z.coerce.number().int().min(0).default(10),
  statEndUsers: optionalString,
  teamSize: z.coerce.number().int().min(0).default(38),
  foundedYear: z.coerce.number().int().min(1900).default(2014),
  heroHeading: optionalString,
  heroHighlight: optionalString,
  heroSubtitle: optionalString,
  heroStatusText: optionalString,
  heroImageUrl: optionalString,
  aboutHeading: optionalString,
  aboutLead: optionalString,
  aboutImage1: optionalString,
  aboutImage2: optionalString,
  aboutImage3: optionalString,
  careersHeading: optionalString,
  careersLead: optionalString,
  careersImage: optionalString,
  contactHeading: optionalString,
  contactHighlight: optionalString,
  contactLead: optionalString,
  officeHours: optionalString,
  // Hero CTAs
  heroCtaPrimaryLabel: optionalString,
  heroCtaPrimaryUrl: optionalString,
  heroCtaSecondaryLabel: optionalString,
  heroCtaSecondaryUrl: optionalString,
  // Hero overlay card
  heroOverlayLabel: optionalString,
  heroOverlayTitle: optionalString,
  heroOverlayDescription: optionalString,
  // Careers empty state
  careersEmptyTitle: optionalString,
  careersEmptyText: optionalString,
  careersApplyLabel: optionalString,
  // Projects section meta
  projectsEyebrow: optionalString,
  projectsTitle: optionalString,
  projectsLead: optionalString,
  // Sectors section meta
  sectorsEyebrow: optionalString,
  sectorsTitle: optionalString,
  sectorsLead: optionalString,
  // Clients section meta
  clientsEyebrow: optionalString,
  clientsTitle: optionalString,
  clientsLead: optionalString,
  // Blog section meta
  blogEyebrow: optionalString,
  blogTitle: optionalString,
  blogLead: optionalString,
});

export type SettingsFormValues = z.input<typeof settingsUpdateSchema>;
