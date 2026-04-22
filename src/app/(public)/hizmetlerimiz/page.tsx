import { prisma } from "@/lib/db";
import { Container } from "@/components/shared/Container";
import { ServiceCard } from "@/components/public/ServiceCard";

export const revalidate = 3600;

export async function generateMetadata() {
  const page = await prisma.page.findUnique({ where: { slug: "hizmetlerimiz" } });
  return {
    title: page?.seoTitle ?? "Hizmetlerimiz",
    description: page?.seoDescription ?? page?.subtitle ?? undefined,
  };
}

export default async function ServicesListPage() {
  const [intro, services] = await Promise.all([
    prisma.page.findUnique({ where: { slug: "hizmetlerimiz" } }),
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <Container className="py-12 md:py-20">
      <header className="max-w-3xl mb-10 md:mb-14">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
          {intro?.title ?? "Hizmetlerimiz"}
        </h1>
        {intro?.subtitle ? (
          <p className="text-muted-foreground mt-3 text-base md:text-lg">
            {intro.subtitle}
          </p>
        ) : null}
        {intro?.content ? (
          <article
            className="prose-content mt-6"
            dangerouslySetInnerHTML={{ __html: intro.content }}
          />
        ) : null}
      </header>
      {services.length === 0 ? (
        <p className="text-muted-foreground">Henüz yayınlanmış hizmet yok.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <ServiceCard
              key={s.id}
              slug={s.slug}
              title={s.title}
              shortDesc={s.shortDesc}
              icon={s.icon}
            />
          ))}
        </div>
      )}
    </Container>
  );
}
