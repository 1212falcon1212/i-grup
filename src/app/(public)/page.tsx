import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/site";
import { JsonLd, organizationSchema } from "@/components/shared/SeoJsonLd";
import { Hero } from "@/components/public/home/Hero";
import { About } from "@/components/public/home/About";
import { Projects } from "@/components/public/home/Projects";
import { Sectors } from "@/components/public/home/Sectors";
import { Clients } from "@/components/public/home/Clients";
import { Blog } from "@/components/public/home/Blog";
import { Careers } from "@/components/public/home/Careers";
import { Contact } from "@/components/public/home/Contact";

export const revalidate = 3600;

export async function generateMetadata() {
  const s = await getSiteSettings();
  return {
    title:
      s.defaultSeoTitle ??
      `${s.siteName} — Eczane, kozmetik ve B2B için ürün geliştiriyoruz`,
    description:
      s.defaultSeoDesc ??
      s.tagline ??
      "İstanbul merkezli ürün stüdyosu. Pazaryerleri, B2B, mobil ve kurumsal yazılım.",
  };
}

export default async function HomePage() {
  const [settings, projects, sectorsRaw, aboutValues, posts, clients, jobs] =
    await Promise.all([
      getSiteSettings(),
      prisma.project.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] }),
      prisma.sector.findMany({ orderBy: { order: "asc" } }),
      prisma.aboutValue.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      prisma.post.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: "desc" },
        take: 4,
      }),
      prisma.client.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
        take: 10,
      }),
      prisma.career.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);

  // Derive sector counts from projects; allow override.
  const projectCountBySectorName = new Map<string, number>();
  for (const p of projects) {
    if (!p.sector) continue;
    projectCountBySectorName.set(
      p.sector,
      (projectCountBySectorName.get(p.sector) ?? 0) + 1
    );
  }
  const SECTOR_TO_PROJECT_SECTORS: Record<string, string[]> = {
    ecza: ["Eczane"],
    kozmetik: ["Kozmetik"],
    b2b: ["Hırdavat", "Aksesuar", "Kırtasiye", "Yapı", "Gıda"],
    erp: ["Kurumsal"],
    tuketici: ["Tüketici", "Emlak"],
  };
  const sectors = sectorsRaw.map((s) => {
    const matched = SECTOR_TO_PROJECT_SECTORS[s.slug] ?? [];
    const derived = matched.reduce(
      (sum, name) => sum + (projectCountBySectorName.get(name) ?? 0),
      0
    );
    return {
      slug: s.slug,
      name: s.name,
      detail: s.detail,
      count: s.countOverride ?? derived,
    };
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const orgSchema = organizationSchema({
    name: settings.siteName,
    url: siteUrl,
    logo: settings.logoUrl ? `${siteUrl}${settings.logoUrl}` : null,
    email: settings.email,
    phone: settings.phone,
    address: settings.address,
    sameAs: [settings.linkedinUrl, settings.instagramUrl, settings.xUrl].filter(
      (u): u is string => !!u
    ),
  });

  return (
    <>
      <JsonLd data={orgSchema} />

      <Hero
        statusText={
          settings.heroStatusText ??
          `İstanbul merkezli ürün stüdyosu · ${settings.foundedYear}'ten beri`
        }
        heading={
          settings.heroHeading ??
          "Eczane, kozmetik ve B2B için ürün geliştiriyoruz."
        }
        highlight={settings.heroHighlight ?? "ürün geliştiriyoruz."}
        subtitle={
          settings.heroSubtitle ??
          settings.tagline ??
          "İstanbul merkezli ürün stüdyosu."
        }
        heroImageUrl={settings.heroImageUrl}
        stats={[
          { value: String(settings.statProjects), label: "aktif proje" },
          { value: String(settings.statSectors), label: "sektör" },
          { value: `${settings.statEndUsers}+`, label: "son kullanıcı" },
        ]}
        teamSize={settings.teamSize}
      />

      <About
        heading={
          settings.aboutHeading ?? "Bir yazılım stüdyosu; fikirden canlı ürüne."
        }
        lead={
          settings.aboutLead ??
          "2014'te İstanbul'da üç kişilik bir ekiple kuruldu. Bugün ekibimizle aktif ürünleri yayınlıyor, işletiyor ve büyütüyoruz."
        }
        image1={settings.aboutImage1}
        image2={settings.aboutImage2}
        image3={settings.aboutImage3}
        values={aboutValues.map((v) => ({
          id: v.id,
          eyebrow: v.eyebrow,
          title: v.title,
          description: v.description,
        }))}
      />

      <Projects
        projects={projects.map((p) => ({
          slug: p.slug,
          title: p.title,
          category: p.category,
          sector: p.sector,
          status: p.status,
          desc: p.shortDesc,
          coverImage: p.coverImage,
          year: p.year,
          hue: p.hue,
          liveUrl: p.liveUrl,
        }))}
      />

      <Sectors sectors={sectors} />

      <Clients
        clients={clients.map((c) => ({ id: c.id, name: c.name }))}
      />

      <Blog
        posts={posts.map((p) => ({
          slug: p.slug,
          tag: p.tag,
          title: p.title,
          excerpt: p.excerpt,
          coverImage: p.coverImage,
          publishedAt: p.publishedAt,
        }))}
      />

      <Careers
        heading={settings.careersHeading ?? "Ekibimize katılın."}
        lead={
          settings.careersLead ??
          "Uzak ya da İstanbul, tercih sizin. Ürünlerimize doğrudan dokunacaksınız."
        }
        image={settings.careersImage}
        applyEmail={settings.email}
        jobs={jobs.map((j) => ({
          slug: j.slug,
          title: j.title,
          department: j.department,
          location: j.location,
          type: j.type,
        }))}
      />

      <Contact
        heading={settings.contactHeading ?? "Bir proje mi düşünüyorsunuz?"}
        highlight={settings.contactHighlight ?? "proje"}
        lead={
          settings.contactLead ??
          "Kısa bir brief bırakın; 24 saat içinde size özel geri dönelim."
        }
        email={settings.email}
        phone={settings.phone}
        address={settings.address}
        officeHours={settings.officeHours}
      />
    </>
  );
}
