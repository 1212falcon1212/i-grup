import { prisma } from "@/lib/db";
import { Container } from "@/components/shared/Container";
import { ServiceCard } from "@/components/public/ServiceCard";
import { Reveal, RevealStagger, RevealItem } from "@/components/motion/Reveal";
import { GridBackground } from "@/components/motion/GridBackground";

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
    <>
      <section className="relative border-b border-border bg-muted/30 overflow-hidden">
        <GridBackground />
        <Container className="relative py-16 md:py-24">
          <Reveal>
            <div className="eyebrow mb-4">
              <span className="num-badge">01</span> Neler yapıyoruz?
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-[-0.02em] leading-[1.05] max-w-3xl">
              {intro?.title ?? "Hizmetlerimiz"}{" "}
              {intro?.subtitle ? (
                <span className="serif-accent text-gradient block mt-2">
                  {intro.subtitle}
                </span>
              ) : null}
            </h1>
            {intro?.content ? (
              <article
                className="prose-content mt-6 max-w-2xl"
                dangerouslySetInnerHTML={{ __html: intro.content }}
              />
            ) : null}
          </Reveal>
        </Container>
      </section>

      <Container className="py-16 md:py-24">
        {services.length === 0 ? (
          <p className="text-muted-foreground">Henüz yayınlanmış hizmet yok.</p>
        ) : (
          <RevealStagger
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            stagger={0.06}
          >
            {services.map((s, i) => (
              <RevealItem key={s.id}>
                <ServiceCard
                  slug={s.slug}
                  title={s.title}
                  shortDesc={s.shortDesc}
                  icon={s.icon}
                  index={i}
                />
              </RevealItem>
            ))}
          </RevealStagger>
        )}
      </Container>
    </>
  );
}
