import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { ServiceForm } from "@/components/admin/forms/ServiceForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Hizmet Düzenle", robots: { index: false } };

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const s = await prisma.service.findUnique({ where: { id } });
  if (!s) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title={s.title} description="Hizmet kaydını düzenleyin." />
      <ServiceForm
        initial={{
          id: s.id,
          title: s.title,
          slug: s.slug,
          shortDesc: s.shortDesc,
          icon: s.icon ?? undefined,
          coverImage: s.coverImage ?? undefined,
          content: s.content,
          order: s.order,
          isActive: s.isActive,
          seoTitle: s.seoTitle ?? undefined,
          seoDescription: s.seoDescription ?? undefined,
        }}
      />
    </div>
  );
}
