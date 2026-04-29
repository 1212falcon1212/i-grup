import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectForm } from "@/components/admin/forms/ProjectForm";
import { parseArray } from "@/lib/json-array";

export const dynamic = "force-dynamic";
export const metadata = { title: "Marka Düzenle", robots: { index: false } };

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, cats] = await Promise.all([
    prisma.project.findUnique({ where: { id } }),
    prisma.project.findMany({ select: { category: true }, distinct: ["category"] }),
  ]);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title={project.title} description="Marka kaydını düzenleyin." />
      <ProjectForm
        categories={cats.map((c) => c.category)}
        initial={{
          id: project.id,
          title: project.title,
          slug: project.slug,
          client: project.client ?? undefined,
          category: project.category,
          shortDesc: project.shortDesc,
          content: project.content,
          coverImage: project.coverImage,
          gallery: parseArray(project.gallery),
          techStack: parseArray(project.techStack),
          liveUrl: project.liveUrl ?? undefined,
          year: project.year ?? undefined,
          isFeatured: project.isFeatured,
          order: project.order,
          seoTitle: project.seoTitle ?? undefined,
          seoDescription: project.seoDescription ?? undefined,
        }}
      />
    </div>
  );
}
