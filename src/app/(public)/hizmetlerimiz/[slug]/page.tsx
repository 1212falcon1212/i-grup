import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Container } from "@/components/shared/Container";
import { ProjectCard } from "@/components/public/ProjectCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const revalidate = 3600;

export async function generateStaticParams() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service) return {};
  return {
    title: service.seoTitle ?? service.title,
    description: service.seoDescription ?? service.shortDesc,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service || !service.isActive) notFound();

  const related = await prisma.project.findMany({
    where: { category: service.title },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <header className="border-b border-border bg-muted/30">
        {service.coverImage ? (
          <div className="relative h-64 md:h-96">
            <Image
              src={service.coverImage}
              alt={service.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <Container className="absolute inset-x-0 bottom-6 text-white">
              <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
                {service.title}
              </h1>
              <p className="mt-2 max-w-2xl text-white/90 text-base md:text-lg">
                {service.shortDesc}
              </p>
            </Container>
          </div>
        ) : (
          <Container className="py-12 md:py-16">
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
              {service.title}
            </h1>
            <p className="mt-3 text-muted-foreground text-base md:text-lg max-w-2xl">
              {service.shortDesc}
            </p>
          </Container>
        )}
      </header>

      <Container className="py-10 md:py-14">
        <article
          className="prose-content max-w-3xl"
          dangerouslySetInnerHTML={{ __html: service.content }}
        />
      </Container>

      {related.length > 0 ? (
        <section className="bg-muted/30 border-y border-border py-12 md:py-16">
          <Container>
            <div className="flex items-center justify-between gap-3 mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Bu alandaki projelerimiz
              </h2>
              <Link
                href="/projelerimiz"
                className="text-sm text-primary font-medium inline-flex items-center gap-1"
              >
                Tüm projeler <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((p) => (
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
        </section>
      ) : null}

      <Container className="py-12 md:py-16">
        <div className="bg-primary text-primary-foreground rounded-xl p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <h2 className="text-xl md:text-3xl font-semibold tracking-tight">
              Benzer bir proje planınız var mı?
            </h2>
            <p className="mt-2 text-primary-foreground/80 max-w-xl text-sm md:text-base">
              {service.title} alanında deneyimli ekibimizle süreci birlikte
              planlayalım.
            </p>
          </div>
          <Button asChild variant="secondary" size="lg" className="w-fit">
            <Link href="/iletisim">
              İletişime Geç <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </Container>
    </>
  );
}
