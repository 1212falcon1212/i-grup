import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ServicesClient } from "./ServicesClient";

export const dynamic = "force-dynamic";

export const metadata = { title: "Hizmetler", robots: { index: false } };

export default async function ServicesListPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  return (
    <div className="space-y-6">
      <PageHeader
        title="Hizmetler"
        description="Sitede gösterilen hizmet kategorilerini yönetin."
        actions={
          <Button asChild>
            <Link href="/admin/services/new">
              <Plus className="h-4 w-4 mr-1" /> Yeni Hizmet
            </Link>
          </Button>
        }
      />
      <ServicesClient
        initial={services.map((s) => ({
          id: s.id,
          title: s.title,
          slug: s.slug,
          shortDesc: s.shortDesc,
          icon: s.icon,
          isActive: s.isActive,
          order: s.order,
        }))}
      />
    </div>
  );
}
