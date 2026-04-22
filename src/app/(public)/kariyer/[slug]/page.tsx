import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Container } from "@/components/shared/Container";
import { Badge } from "@/components/ui/badge";
import { CareerApplicationForm } from "@/components/public/CareerApplicationForm";
import { MapPin, Briefcase } from "lucide-react";

export const revalidate = 3600;

export async function generateStaticParams() {
  const careers = await prisma.career.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return careers.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = await prisma.career.findUnique({ where: { slug } });
  if (!c) return {};
  return {
    title: c.title,
    description: c.shortDesc,
  };
}

export default async function CareerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = await prisma.career.findUnique({ where: { slug } });
  if (!c || !c.isActive) notFound();

  return (
    <Container className="py-12 md:py-16 max-w-4xl">
      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="secondary">{c.department}</Badge>
          <Badge variant="outline">{c.type}</Badge>
        </div>
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
          {c.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-muted-foreground text-sm mt-3">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" /> {c.location}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase className="h-4 w-4" /> {c.type}
          </span>
        </div>
        <p className="text-lg text-foreground/80 mt-4 max-w-3xl">{c.shortDesc}</p>
      </header>

      <article
        className="prose-content mb-12"
        dangerouslySetInnerHTML={{ __html: c.content }}
      />

      <CareerApplicationForm careerSlug={c.slug} />
    </Container>
  );
}
