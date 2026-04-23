import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { ClientsClient } from "./ClientsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Referanslar",
  robots: { index: false, follow: false },
};

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({ orderBy: { order: "asc" } });
  return (
    <div className="space-y-6">
      <PageHeader
        title="Referans Markalar"
        description="Ana sayfadaki referans wall (5×2). Sürükleyerek sıralayın. Logo opsiyonel — boşsa isim text olarak gösterilir."
      />
      <ClientsClient
        initial={clients.map((c) => ({
          id: c.id,
          name: c.name,
          logoUrl: c.logoUrl,
          websiteUrl: c.websiteUrl,
          order: c.order,
          isActive: c.isActive,
        }))}
      />
    </div>
  );
}
