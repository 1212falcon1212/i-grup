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

export default async function ProjectDetailPage({
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
  const techStack = parseArray(project.techStack);

  return (
    <>
      <header className="border-b border-border bg-muted/20">
        <div className="relative h-72 md:h-[28rem]">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <Container className="absolute inset-x-0 bottom-8 text-white">
            <Badge className="bg-white/15 text-white backdrop-blur">
              {project.category}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mt-3">
              {project.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-white/85 text-sm">
              {project.client ? <span>Müşteri: {project.client}</span> : null}
              {project.year ? <span>Yıl: {project.year}</span> : null}
            </div>
          </Container>
        </div>
      </header>

      <Container className="py-10 md:py-16 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <p className="text-lg text-foreground/80 mb-6">{project.shortDesc}</p>
          <article
            className="prose-content"
            dangerouslySetInnerHTML={{ __html: project.content }}
          />
        </div>
        <aside className="space-y-6">
          {techStack.length > 0 ? (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Teknolojiler
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {techStack.map((t) => (
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
                Siteyi Ziyaret Et <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            </Button>
          ) : null}
          <div className="border border-border rounded-xl p-5 bg-muted/30">
            <h3 className="font-semibold text-sm">Benzer bir proje mi?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Benzer ihtiyacınızı konuşalım.
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
              Diğer Projeler
            </h2>
            <Link
              href="/projelerimiz"
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
