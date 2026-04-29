import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectForm } from "@/components/admin/forms/ProjectForm";

export const metadata = { title: "Yeni Marka", robots: { index: false } };

export default async function NewProjectPage() {
  const cats = await prisma.project.findMany({
    select: { category: true },
    distinct: ["category"],
  });
  return (
    <div className="space-y-6">
      <PageHeader title="Yeni Marka" description="Portföye yeni marka ekleyin." />
      <ProjectForm categories={cats.map((c) => c.category)} />
    </div>
  );
}
