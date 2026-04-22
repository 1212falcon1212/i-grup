import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/site";
import { Container } from "@/components/shared/Container";
import { Badge } from "@/components/ui/badge";
import { Reveal, RevealStagger, RevealItem } from "@/components/motion/Reveal";
import { GridBackground } from "@/components/motion/GridBackground";
import { ArrowUpRight, MapPin, Briefcase } from "lucide-react";

export const revalidate = 3600;

export async function generateMetadata() {
  const page = await prisma.page.findUnique({ where: { slug: "kariyer" } });
  return {
    title: page?.seoTitle ?? "Kariyer",
    description: page?.seoDescription ?? page?.subtitle ?? undefined,
  };
}

export default async function CareerListPage() {
  const [intro, careers, settings] = await Promise.all([
    prisma.page.findUnique({ where: { slug: "kariyer" } }),
    prisma.career.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    }),
    getSiteSettings(),
  ]);

  return (
    <>
      <section className="relative border-b border-border bg-muted/30 overflow-hidden">
        <GridBackground />
        <Container className="relative py-16 md:py-24">
          <Reveal>
            <div className="eyebrow mb-4">
              <span className="num-badge">01</span> Kariyer
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-[-0.02em] leading-[1.05] max-w-3xl">
              {intro?.title ?? "Kariyer"}{" "}
              <span className="serif-accent text-gradient block mt-2">
                {intro?.subtitle ?? "Ekibimize katılın."}
              </span>
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
        {careers.length === 0 ? (
          <Reveal>
            <div className="relative border border-dashed border-border bg-card rounded-2xl p-10 md:p-14 text-center max-w-2xl mx-auto">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5">
                <Briefcase className="h-5 w-5" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                Şu an aktif ilanımız bulunmuyor
              </h2>
              <p className="text-muted-foreground mt-3">
                Ancak CV&apos;nizi{" "}
                {settings.email ? (
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-primary ul-reveal inline-flex"
                  >
                    {settings.email}
                  </a>
                ) : (
                  "kariyer@i-grup.com"
                )}{" "}
                adresine gönderebilirsiniz.
              </p>
            </div>
          </Reveal>
        ) : (
          <RevealStagger className="space-y-3" stagger={0.06}>
            {careers.map((c, i) => (
              <RevealItem key={c.id}>
                <Link
                  href={`/kariyer/${c.slug}`}
                  className="glow-card group relative block bg-card border border-border rounded-2xl p-6 md:p-7 hover:border-primary/40 transition-all overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="num-badge text-xs">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <Badge variant="secondary" className="rounded-full">
                          {c.department}
                        </Badge>
                        <Badge variant="outline" className="rounded-full">
                          {c.type}
                        </Badge>
                      </div>
                      <h3 className="text-xl md:text-2xl font-semibold tracking-tight">
                        {c.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2 max-w-2xl">
                        {c.shortDesc}
                      </p>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-3 font-mono">
                        <MapPin className="h-3.5 w-3.5" /> {c.location}
                      </div>
                    </div>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealStagger>
        )}
      </Container>
    </>
  );
}
