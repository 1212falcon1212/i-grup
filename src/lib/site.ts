import { cache } from "react";
import { prisma } from "@/lib/db";

export type SiteSettings = Awaited<ReturnType<typeof getSiteSettings>>;

export const getSiteSettings = cache(async () => {
  const setting = await prisma.siteSetting.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
  return setting;
});
