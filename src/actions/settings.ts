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
    statProjects: parsed.statProjects ?? 15,
    statClients: parsed.statClients ?? 40,
    statYears: parsed.statYears ?? 8,
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
