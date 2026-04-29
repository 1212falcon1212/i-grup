import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Container } from "@/components/shared/Container";
import { ProjectCard } from "@/components/public/ProjectCard";
import { ProjectGallery } from "@/components/public/ProjectGallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight } from "lucide-react";
import { parseArray } from "@/lib/json-array";

export const revalidate = 3600;

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({ select: { slug: true } });
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await prisma.project.findUnique({ where: { slug } });
  if (!p) return {};
  return {
    title: p.seoTitle ?? p.title,
    description: p.seoDescription ?? p.shortDesc,
    openGraph: {
      images: [p.coverImage],
    },
  };
}

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) notFound();

  const [others] = await Promise.all([
    prisma.project.findMany({
      where: { id: { not: project.id } },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const gallery = parseArray(project.gallery);
  const capabilities = parseArray(project.techStack);

  return (
    <>
      <header className="border-b border-border bg-muted/20">
        <Container className="pt-12 md:pt-16 pb-8 md:pb-10">
          <div className="max-w-3xl">
            <Badge variant="outline" className="rounded-full">
              {project.category}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mt-4">
              {project.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-muted-foreground text-sm">
              {project.sector ? (
                <span>Faaliyet alanı: {project.sector}</span>
              ) : null}
              <span>Durum: {project.status}</span>
              {project.year ? (
                <span>Kuruluş/Lansman: {project.year}</span>
              ) : null}
            </div>
          </div>
        </Container>
      </header>

      <Container className="py-10 md:py-16 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <figure className="mb-8 md:mb-10">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted border border-border">
              <Image
                src={project.coverImage}
                alt={project.title}
                fill
                priority
                sizes="(min-width: 1024px) 760px, 100vw"
                className="object-cover"
              />
            </div>
          </figure>
          <p className="text-lg text-foreground/80 mb-6">{project.shortDesc}</p>
          <article
            className="prose-content"
            dangerouslySetInnerHTML={{ __html: project.content }}
          />
        </div>
        <aside className="space-y-6">
          {capabilities.length > 0 ? (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Öne çıkan kabiliyetler
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {capabilities.map((t) => (
                  <Badge key={t} variant="outline" className="rounded-full">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
          {project.liveUrl ? (
            <Button asChild className="w-full">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Markanın Sitesini Ziyaret Et{" "}
                <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            </Button>
          ) : null}
          <div className="border border-border rounded-xl p-5 bg-muted/30">
            <h3 className="font-semibold text-sm">
              i-Grup Şirketler Topluluğu çatısı altında
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Markalarımız ve grup yapımız hakkında bilgi almak için bizimle
              iletişime geçin.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-3 w-full">
              <Link href="/iletisim">
                İletişime geç <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </div>
        </aside>
      </Container>

      {gallery.length > 0 ? (
        <section className="bg-muted/30 border-y border-border py-12 md:py-16">
          <Container>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-8">
              Galeri
            </h2>
            <ProjectGallery images={gallery} />
          </Container>
        </section>
      ) : null}

      {others.length > 0 ? (
        <Container className="py-12 md:py-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Diğer Markalar
            </h2>
            <Link
              href="/markalarimiz"
              className="text-sm text-primary font-medium inline-flex items-center gap-1"
            >
              Tümü <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {others.map((p) => (
              <ProjectCard
                key={p.id}
                slug={p.slug}
                title={p.title}
                category={p.category}
                coverImage={p.coverImage}
                year={p.year}
              />
            ))}
          </div>
        </Container>
      ) : null}
    </>
  );
}
