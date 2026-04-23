"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { settingsUpdateSchema } from "@/lib/validators/settings";
import { requireAdmin } from "./_helpers";

export async function updateSettings(input: unknown) {
  await requireAdmin();
  const parsed = settingsUpdateSchema.parse(input);

  const data = {
    siteName: parsed.siteName,
    logoUrl: parsed.logoUrl || null,
    faviconUrl: parsed.faviconUrl || null,
    tagline: parsed.tagline || null,
    email: parsed.email || null,
    phone: parsed.phone || null,
    address: parsed.address || null,
    whatsapp: parsed.whatsapp || null,
    linkedinUrl: parsed.linkedinUrl || null,
    instagramUrl: parsed.instagramUrl || null,
    xUrl: parsed.xUrl || null,
    footerText: parsed.footerText || null,
    defaultSeoTitle: parsed.defaultSeoTitle || null,
    defaultSeoDesc: parsed.defaultSeoDesc || null,
    gtmId: parsed.gtmId || null,
    statProjects: parsed.statProjects ?? 13,
    statSectors: parsed.statSectors ?? 6,
    statYears: parsed.statYears ?? 10,
    statEndUsers: parsed.statEndUsers || "120K",
    teamSize: parsed.teamSize ?? 38,
    foundedYear: parsed.foundedYear ?? 2014,
    heroHeading: parsed.heroHeading || null,
    heroHighlight: parsed.heroHighlight || null,
    heroSubtitle: parsed.heroSubtitle || null,
    heroStatusText: parsed.heroStatusText || null,
    heroImageUrl: parsed.heroImageUrl || null,
    aboutHeading: parsed.aboutHeading || null,
    aboutLead: parsed.aboutLead || null,
    aboutImage1: parsed.aboutImage1 || null,
    aboutImage2: parsed.aboutImage2 || null,
    aboutImage3: parsed.aboutImage3 || null,
    careersHeading: parsed.careersHeading || null,
    careersLead: parsed.careersLead || null,
    careersImage: parsed.careersImage || null,
    contactHeading: parsed.contactHeading || null,
    contactHighlight: parsed.contactHighlight || null,
    contactLead: parsed.contactLead || null,
    officeHours: parsed.officeHours || null,
    heroCtaPrimaryLabel: parsed.heroCtaPrimaryLabel || null,
    heroCtaPrimaryUrl: parsed.heroCtaPrimaryUrl || null,
    heroCtaSecondaryLabel: parsed.heroCtaSecondaryLabel || null,
    heroCtaSecondaryUrl: parsed.heroCtaSecondaryUrl || null,
    heroOverlayLabel: parsed.heroOverlayLabel || null,
    heroOverlayTitle: parsed.heroOverlayTitle || null,
    heroOverlayDescription: parsed.heroOverlayDescription || null,
    careersEmptyTitle: parsed.careersEmptyTitle || null,
    careersEmptyText: parsed.careersEmptyText || null,
    careersApplyLabel: parsed.careersApplyLabel || null,
    projectsEyebrow: parsed.projectsEyebrow || null,
    projectsTitle: parsed.projectsTitle || null,
    projectsLead: parsed.projectsLead || null,
    sectorsEyebrow: parsed.sectorsEyebrow || null,
    sectorsTitle: parsed.sectorsTitle || null,
    sectorsLead: parsed.sectorsLead || null,
    clientsEyebrow: parsed.clientsEyebrow || null,
    clientsTitle: parsed.clientsTitle || null,
    clientsLead: parsed.clientsLead || null,
    blogEyebrow: parsed.blogEyebrow || null,
    blogTitle: parsed.blogTitle || null,
    blogLead: parsed.blogLead || null,
  };

  await prisma.siteSetting.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { ok: true };
}
