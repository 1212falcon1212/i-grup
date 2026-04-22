import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { BannersClient } from "./BannersClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Banner'lar",
  robots: { index: false, follow: false },
};

export default async function BannersPage() {
  const banners = await prisma.banner.findMany({ orderBy: { order: "asc" } });
  return (
    <div className="space-y-6">
      <PageHeader
        title="Banner'lar"
        description="Ana sayfadaki hero slider banner'larını yönetin."
      />
      <BannersClient
        initial={banners.map((b) => ({
          id: b.id,
          title: b.title,
          subtitle: b.subtitle,
          imageUrl: b.imageUrl,
          ctaText: b.ctaText,
          ctaUrl: b.ctaUrl,
          order: b.order,
          isActive: b.isActive,
        }))}
      />
    </div>
  );
}
