import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/site";
import { Container } from "@/components/shared/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Briefcase } from "lucide-react";

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
    <Container className="py-12 md:py-20">
      <header className="max-w-3xl mb-10 md:mb-14">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
          {intro?.title ?? "Kariyer"}
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

      {careers.length === 0 ? (
        <div className="border border-border bg-muted/30 rounded-xl p-8 md:p-12 text-center max-w-2xl">
          <Briefcase className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <h2 className="text-lg md:text-xl font-semibold">
            Şu an aktif ilanımız bulunmuyor
          </h2>
          <p className="text-muted-foreground mt-2">
            Ancak CV&apos;nizi{" "}
            {settings.email ? (
              <a
                href={`mailto:${settings.email}`}
                className="text-primary underline"
              >
                {settings.email}
              </a>
            ) : (
              "kariyer@i-grup.com"
            )}{" "}
            adresine gönderebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {careers.map((c) => (
            <Link
              key={c.id}
              href={`/kariyer/${c.slug}`}
              className="block bg-background border border-border rounded-xl p-5 md:p-6 hover:border-primary/40 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Badge variant="secondary">{c.department}</Badge>
                    <Badge variant="outline">{c.type}</Badge>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold">{c.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {c.shortDesc}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                    <MapPin className="h-3.5 w-3.5" /> {c.location}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Detay <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
