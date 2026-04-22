import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { CareerForm } from "@/components/admin/forms/CareerForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "İlan Düzenle", robots: { index: false } };

export default async function EditCareerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = await prisma.career.findUnique({ where: { id } });
  if (!c) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title={c.title} description="İlan bilgilerini düzenleyin." />
      <CareerForm
        initial={{
          id: c.id,
          title: c.title,
          slug: c.slug,
          department: c.department,
          location: c.location,
          type: c.type,
          shortDesc: c.shortDesc,
          content: c.content,
          isActive: c.isActive,
        }}
      />
    </div>
  );
}
