import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/site";
import { JsonLd, organizationSchema } from "@/components/shared/SeoJsonLd";
import { Hero } from "@/components/public/home/Hero";
import { Projects } from "@/components/public/home/Projects";
import { Sectors } from "@/components/public/home/Sectors";
import { Blog } from "@/components/public/home/Blog";
import { Careers } from "@/components/public/home/Careers";
import { Contact } from "@/components/public/home/Contact";

export const revalidate = 3600;

export async function generateMetadata() {
  const s = await getSiteSettings();
  return {
    title:
      s.defaultSeoTitle ??
      `${s.siteName} — Şirketler topluluğu`,
    description:
      s.defaultSeoDesc ??
      s.tagline ??
      "i-Grup Şirketler Topluluğu çatısı altında faaliyet gösteren dijital markalar, pazaryerleri ve platformlar.",
  };
}

export default async function HomePage() {
  const [settings, projects, sectorsRaw, posts, jobs] =
    await Promise.all([
      getSiteSettings(),
      prisma.project.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] }),
      prisma.sector.findMany({ orderBy: { order: "asc" } }),
      prisma.post.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: "desc" },
        take: 4,
      }),
      prisma.career.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);

  // Group brands by sector name for sector display
  const projectsBySectorName = new Map<
    string,
    { slug: string; title: string }[]
  >();
  for (const p of projects) {
    if (!p.sector) continue;
    const arr = projectsBySectorName.get(p.sector) ?? [];
    arr.push({ slug: p.slug, title: p.title });
    projectsBySectorName.set(p.sector, arr);
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
    const sectorProjects = matched.flatMap(
      (name) => projectsBySectorName.get(name) ?? []
    );
    return {
      slug: s.slug,
      name: s.name,
      detail: s.detail,
      count: s.countOverride ?? sectorProjects.length,
      projects: sectorProjects,
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
          `i-Grup Şirketler Topluluğu · ${settings.foundedYear}'ten beri`
        }
        heading={
          settings.heroHeading ??
          "i-Grup"
        }
        highlight={settings.heroHighlight ?? "i-Grup"}
        subtitle={
          settings.heroSubtitle ??
          settings.tagline ??
          "Farklı sektörlerde faaliyet gösteren dijital markaları çatısı altında buluşturan şirketler topluluğu."
        }
        heroImageUrl={settings.heroImageUrl}
        stats={[
          {
            value: String(settings.statProjects),
            label: settings.heroStatProjectsLabel ?? "aktif marka",
          },
          {
            value: String(settings.statSectors),
            label: settings.heroStatSectorsLabel ?? "sektör",
          },
          {
            value: `${settings.statEndUsers}+`,
            label: settings.heroStatUsersLabel ?? "son kullanıcı",
          },
        ]}
        teamSize={settings.teamSize}
        ctaPrimaryLabel={settings.heroCtaPrimaryLabel}
        ctaPrimaryUrl={settings.heroCtaPrimaryUrl}
        ctaSecondaryLabel={settings.heroCtaSecondaryLabel}
        ctaSecondaryUrl={settings.heroCtaSecondaryUrl}
        overlayLabel={settings.heroOverlayLabel}
        overlayTitle={settings.heroOverlayTitle}
        overlayDescription={settings.heroOverlayDescription}
        imageLabel={settings.heroImageLabel}
      />

      <Projects
        eyebrow={settings.projectsEyebrow}
        title={settings.projectsTitle}
        lead={settings.projectsLead}
        filterAllLabel={settings.brandsFilterAllLabel}
        countSingular={settings.brandsCountSingular}
        countPlural={settings.brandsCountPlural}
        cardCtaLabel={settings.brandCardCtaLabel}
        cardExternalLabel={settings.brandCardExternalLabel}
        cardMetaPrefix={settings.brandCardMetaPrefix}
        cardPendingLabel={settings.brandCardPendingLabel}
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

      <Sectors
        sectors={sectors}
        eyebrow={settings.sectorsEyebrow}
        title={settings.sectorsTitle}
        lead={settings.sectorsLead}
      />

      <Blog
        eyebrow={settings.blogEyebrow}
        title={settings.blogTitle}
        lead={settings.blogLead}
        readFullLabel={settings.blogReadFullLabel}
        readLabel={settings.blogReadLabel}
        allPostsLabel={settings.blogAllPostsLabel}
        featuredImageLabel={settings.blogFeaturedImageLabel}
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
        emptyTitle={settings.careersEmptyTitle}
        emptyText={settings.careersEmptyText}
        applyLabel={settings.careersApplyLabel}
        eyebrow={settings.careersEyebrow}
        openPositionsLabel={settings.careersOpenPositionsLabel}
        imageLabel={settings.careersImageLabel}
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
        eyebrow={settings.contactEyebrow}
        emailLabel={settings.contactEmailLabel}
        phoneLabel={settings.contactPhoneLabel}
        officeLabel={settings.contactOfficeLabel}
        hoursLabel={settings.contactHoursLabel}
        formTitle={settings.contactFormTitle}
        nameLabel={settings.contactNameLabel}
        namePlaceholder={settings.contactNamePlaceholder}
        emailFieldLabel={settings.contactEmailFieldLabel}
        emailPlaceholder={settings.contactEmailPlaceholder}
        companyLabel={settings.contactCompanyLabel}
        companyPlaceholder={settings.contactCompanyPlaceholder}
        messageLabel={settings.contactMessageLabel}
        messagePlaceholder={settings.contactMessagePlaceholder}
        submitLabel={settings.contactSubmitLabel}
        sendingLabel={settings.contactSendingLabel}
        successLabel={settings.contactSuccessLabel}
        privacyText={settings.contactPrivacyText}
        subject={settings.contactSubject}
      />
    </>
  );
}
