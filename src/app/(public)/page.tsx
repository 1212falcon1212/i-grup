import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/site";
import { HeroSlider } from "@/components/public/HeroSlider";
import { ServiceCard } from "@/components/public/ServiceCard";
import { ProjectCard } from "@/components/public/ProjectCard";
import { MiniContactForm } from "@/components/public/MiniContactForm";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { ArrowRight, Store, Sparkles, Building2, Truck, ShoppingBag } from "lucide-react";

export const revalidate = 3600;

const CATEGORY_BANNERS = [
  {
    icon: Store,
    title: "Pazaryeri",
    desc: "Multi-vendor marketplace platformları.",
    href: "/hizmetlerimiz/pazaryeri-gelistirme",
  },
  {
    icon: ShoppingBag,
    title: "E-Ticaret",
    desc: "Yüksek dönüşüm odaklı mağazalar.",
    href: "/hizmetlerimiz/e-ticaret-siteleri",
  },
  {
    icon: Sparkles,
    title: "Kozmetik",
    desc: "Dermokozmetik & eczane platformları.",
    href: "/hizmetlerimiz/kozmetik-dermokozmetik-platformlari",
  },
  {
    icon: Building2,
    title: "B2B",
    desc: "Kapalı pazaryeri & bayi portalı.",
    href: "/hizmetlerimiz/b2b-kapali-pazaryeri",
  },
  {
    icon: Truck,
    title: "Kurye & Saha",
    desc: "Son-kilometre & saha uygulamaları.",
    href: "/hizmetlerimiz/kurye-saha-operasyonu",
  },
];

export default async function HomePage() {
  const [banners, services, featured, settings] = await Promise.all([
    prisma.banner.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 6,
    }),
    prisma.project.findMany({
      where: { isFeatured: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    getSiteSettings(),
  ]);

  return (
    <>
      <HeroSlider
        banners={banners.map((b) => ({
          id: b.id,
          title: b.title,
          subtitle: b.subtitle,
          imageUrl: b.imageUrl,
          ctaText: b.ctaText,
          ctaUrl: b.ctaUrl,
        }))}
      />

      <Container className="py-14 md:py-20">
        <div className="grid md:grid-cols-5 gap-10 items-center">
          <div className="md:col-span-3">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              {settings.tagline ?? "Kurumsal ölçekte dijital dönüşüm çözümleri"}
            </h2>
            <p className="text-muted-foreground mt-4 text-base md:text-lg max-w-xl">
              Pazaryeri, e-ticaret, kozmetik, kurye operasyonları ve B2B
              platformlarında uzmanlaşmış ekibimizle müşterilerimize uçtan uca
              çözümler sunuyoruz.
            </p>
          </div>
          <div className="md:col-span-2 grid grid-cols-3 gap-4">
            <Stat value={settings.statProjects} label="Proje" />
            <Stat value={settings.statClients} label="Müşteri" />
            <Stat value={settings.statYears} label="Yıl Tecrübe" />
          </div>
        </div>
      </Container>

      <section className="bg-muted/30 py-14 md:py-20 border-y border-border">
        <Container>
          <SectionHeader
            title="Hizmetlerimiz"
            description="Kurumsal ölçekte sunduğumuz çözüm alanları."
            cta={{ href: "/hizmetlerimiz", label: "Tümü" }}
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
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
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container>
          <SectionHeader
            title="Öne Çıkan Projeler"
            description="Son dönemde hayata geçirdiğimiz seçki."
            cta={{ href: "/projelerimiz", label: "Tümü" }}
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            {featured.map((p) => (
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

      <section className="bg-muted/30 border-y border-border py-14 md:py-20">
        <Container>
          <SectionHeader
            title="Çözüm Kategorilerimiz"
            description="Hangi dikeylerde çalışıyoruz?"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-10">
            {CATEGORY_BANNERS.map((c) => (
              <Link
                key={c.title}
                href={c.href}
                className="group bg-background border border-border rounded-xl p-5 hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <c.icon className="h-4 w-4" />
                </div>
                <h3 className="font-semibold text-sm">{c.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {c.desc}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14 md:py-20 bg-primary text-primary-foreground">
        <Container className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-4xl font-semibold tracking-tight">
              Projenizi birlikte planlayalım
            </h2>
            <p className="mt-2 text-primary-foreground/80 max-w-xl">
              Ekibimizle 30 dakikalık bir toplantı ayarlayın; ihtiyacınıza özel
              bir yol haritası çıkaralım.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="w-fit md:self-center"
          >
            <Link href="/iletisim">
              İletişime Geç <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </Container>
      </section>

      <Container className="py-14 md:py-20">
        <MiniContactForm />
      </Container>
    </>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center md:text-left">
      <div className="text-3xl md:text-4xl font-bold text-primary">
        {value}+
      </div>
      <div className="text-xs md:text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function SectionHeader({
  title,
  description,
  cta,
}: {
  title: string;
  description?: string;
  cta?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
      <div>
        <h2 className="text-2xl md:text-4xl font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="text-muted-foreground mt-2 max-w-xl">{description}</p>
        ) : null}
      </div>
      {cta ? (
        <Link
          href={cta.href}
          className="text-sm text-primary font-medium inline-flex items-center gap-1 self-start md:self-auto"
        >
          {cta.label} <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}
