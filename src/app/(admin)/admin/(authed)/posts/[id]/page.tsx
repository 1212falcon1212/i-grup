import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { PostForm } from "@/components/admin/forms/PostForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Yazı Düzenle", robots: { index: false } };

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await prisma.post.findUnique({ where: { id } });
  if (!p) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title={p.title} description="Yazı içeriğini düzenleyin." />
      <PostForm
        initial={{
          id: p.id,
          slug: p.slug,
          tag: p.tag,
          title: p.title,
          excerpt: p.excerpt,
          content: p.content,
          coverImage: p.coverImage ?? undefined,
          publishedAt: p.publishedAt.toISOString(),
          isPublished: p.isPublished,
          seoTitle: p.seoTitle ?? undefined,
          seoDescription: p.seoDescription ?? undefined,
        }}
      />
    </div>
  );
}
