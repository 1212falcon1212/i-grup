import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { PageForm } from "./PageForm";

export const dynamic = "force-dynamic";

export default async function PageEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${page.title} sayfası`}
        description={`/${page.slug} adresinde yayınlanıyor.`}
      />
      <PageForm
        initial={{
          id: page.id,
          slug: page.slug,
          title: page.title,
          subtitle: page.subtitle,
          heroImageUrl: page.heroImageUrl,
          content: page.content,
          seoTitle: page.seoTitle,
          seoDescription: page.seoDescription,
        }}
      />
    </div>
  );
}
