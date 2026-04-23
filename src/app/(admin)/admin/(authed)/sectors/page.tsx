import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { SectorsClient } from "./SectorsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sektörler",
  robots: { index: false, follow: false },
};

export default async function SectorsPage() {
  const sectors = await prisma.sector.findMany({ orderBy: { order: "asc" } });
  return (
    <div className="space-y-6">
      <PageHeader
        title="Sektörler"
        description="Ana sayfadaki 'Hizmet verdiğimiz dikeyler' bölümü. Sürükleyerek sıralayın."
      />
      <SectorsClient
        initial={sectors.map((s) => ({
          id: s.id,
          slug: s.slug,
          name: s.name,
          detail: s.detail,
          countOverride: s.countOverride,
          order: s.order,
        }))}
      />
    </div>
  );
}
