import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Container } from "@/components/shared/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { ArrowRight } from "lucide-react";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { isPublished: true },
    select: { slug: true },
  });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) return {};
  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    openGraph: post.coverImage ? { images: [post.coverImage] } : undefined,
  };
}

const dateStr = (d: Date) => format(d, "d MMMM yyyy", { locale: tr });

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post || !post.isPublished) notFound();

  const related = await prisma.post.findMany({
    where: {
      isPublished: true,
      slug: { not: post.slug },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return (
    <>
      <header className="border-b border-border bg-muted/20">
        <Container className="pt-12 md:pt-16 pb-8 md:pb-10">
          <div className="max-w-3xl">
            <Badge variant="outline" className="rounded-full">
              {post.tag}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mt-4">
              {post.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-muted-foreground text-sm">
              <span>Yayın tarihi: {dateStr(post.publishedAt)}</span>
            </div>
          </div>
        </Container>
      </header>

      <Container className="py-10 md:py-16 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
        {post.coverImage ? (
          <figure className="mb-8 md:mb-10">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted border border-border">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                priority
                sizes="(min-width: 1024px) 760px, 100vw"
                className="object-cover"
              />
            </div>
          </figure>
        ) : null}
          <p className="text-lg text-foreground/80 mb-6">{post.excerpt}</p>
          <article
            className="prose-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
        <aside className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Yazı Bilgileri
            </h3>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className="rounded-full">
                {post.tag}
              </Badge>
              <Badge variant="outline" className="rounded-full">
                {dateStr(post.publishedAt)}
              </Badge>
            </div>
          </div>
          <div className="border border-border rounded-xl p-5 bg-muted/30">
            <h3 className="font-semibold text-sm">Bu konuda konuşalım mı?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Dermokozmetik yazılımı, eczane pazaryeri veya B2B tedarik
              altyapısı için bize ulaşın.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-3 w-full">
              <Link href="/iletisim">
                İletişime geç <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </div>
          <Button asChild className="w-full">
            <Link href="/blog">
              Tüm Yazılar <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </aside>
      </Container>

      {related.length > 0 ? (
        <Container className="py-12 md:py-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Diğer Yazılar
            </h2>
            <Link
              href="/blog"
              className="text-sm text-primary font-medium inline-flex items-center gap-1"
            >
              Tümü <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map((r) => (
              <article
                key={r.slug}
                className="rounded-xl overflow-hidden bg-card text-card-foreground border border-border hover:shadow-md transition-shadow"
              >
                <Link href={`/blog/${r.slug}`} className="block">
                  {r.coverImage ? (
                    <div className="relative aspect-[16/10] bg-muted">
                      <Image
                        src={r.coverImage}
                        alt={r.title}
                        fill
                        sizes="(min-width: 1024px) 400px, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="p-4">
                    <Badge variant="outline" className="rounded-full">
                      {r.tag}
                    </Badge>
                    <h3 className="font-semibold tracking-tight mt-3 line-clamp-2">
                      {r.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {r.excerpt}
                    </p>
                    <div className="text-xs text-muted-foreground mt-4">
                      {dateStr(r.publishedAt)}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </Container>
      ) : null}
    </>
  );
}
