import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/site";
import { cn } from "@/lib/utils";

export const revalidate = 3600;

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: settings.projectsTitle ?? "Markalarımız",
    description:
      settings.projectsLead ??
      "i-Grup Şirketler Topluluğu çatısı altında faaliyet gösteren dijital markalar, pazaryerleri ve platformlar.",
  };
}

export default async function BrandsListPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const params = await searchParams;
  const settings = await getSiteSettings();
  const allProjects = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  const categories = Array.from(
    allProjects.reduce((set, project) => set.add(project.category), new Set<string>())
  );
  const selectedCategory = params.kategori;
  const projects = selectedCategory
    ? allProjects.filter((project) => project.category === selectedCategory)
    : allProjects;
  const featured = projects[0] ?? allProjects[0] ?? null;
  const rest = featured
    ? projects.filter((project) => project.id !== featured.id)
    : projects;

  const totalLabel = settings.brandsCountPlural || "marka";
  const allLabel = settings.brandsFilterAllLabel || "Tümü";
  const cardCta = settings.brandCardCtaLabel || "Markayı incele";
  const externalCta = settings.brandCardExternalLabel || "Siteyi görüntüle";
  const metaPrefix = settings.brandCardMetaPrefix || "Grup markası";
  const pendingLabel = settings.brandCardPendingLabel || "Yakında";

  return (
    <>
      <section className="relative overflow-hidden border-b border-rule bg-bg">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.32]"
          style={{
            background:
              "linear-gradient(110deg, rgba(226,221,210,0.9), rgba(247,245,240,0.35) 42%, rgba(237,234,226,0.8)), radial-gradient(circle at 84% 18%, rgba(17,17,24,0.08), transparent 34%)",
          }}
        />
        <div className="container-site relative py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.86fr] lg:items-end">
            <div>
              <div className="eyebrow">
                {settings.projectsEyebrow || "Markalarımız"}
              </div>
              <h1
                className="mt-4 max-w-[820px] font-bold tracking-[-0.055em] text-ink"
                style={{
                  fontSize: "clamp(3.4rem, 8vw, 7.5rem)",
                  lineHeight: 0.9,
                }}
              >
                {settings.projectsTitle || "i-Grup Şirketler Topluluğu"}
              </h1>
            </div>
            <div className="max-w-[560px] lg:justify-self-end">
              <p className="text-[18px] leading-[1.65] text-ink2 md:text-[20px]">
                {settings.projectsLead ||
                  "Eczane pazaryerinden B2B tedarik platformlarına, kozmetik ve kişisel bakım girişimlerinden tüketici uygulamalarına kadar farklı alanlarda faaliyet gösteren dijital markalar."}
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <StatBox value={allProjects.length} label={totalLabel} />
                <StatBox value={categories.length} label="kategori" />
                <StatBox value="1" label="çatı" />
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            <FilterChip href="/markalarimiz" active={!selectedCategory}>
              {allLabel} <span>{allProjects.length}</span>
            </FilterChip>
            {categories.map((category) => (
              <FilterChip
                key={category}
                href={`/markalarimiz?kategori=${encodeURIComponent(category)}`}
                active={selectedCategory === category}
              >
                {category}{" "}
                <span>
                  {allProjects.filter((project) => project.category === category).length}
                </span>
              </FilterChip>
            ))}
          </div>
        </div>
      </section>

      {featured ? (
        <section className="bg-bg2 py-8 md:py-12">
          <div className="container-site">
            <Link
              href={`/markalarimiz/${featured.slug}`}
              className="group grid overflow-hidden rounded-[14px] border border-rule bg-bg md:grid-cols-[1.08fr_0.92fr]"
            >
              <div className="relative min-h-[300px] overflow-hidden md:min-h-[420px]">
                <Image
                  src={featured.coverImage}
                  alt={featured.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 640px, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/18 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="inline-flex rounded-full bg-white/16 px-3 py-1 text-[12px] font-semibold backdrop-blur">
                    {featured.category}
                  </div>
                  <h2 className="mt-4 text-[42px] font-bold leading-[0.96] tracking-[-0.055em] md:text-[64px]">
                    {featured.title}
                  </h2>
                </div>
              </div>
              <div className="flex flex-col justify-between gap-10 p-7 md:p-10">
                <div>
                  <div className="flex flex-wrap gap-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-indigo">
                    <span>{featured.status}</span>
                    {featured.sector ? <span>{featured.sector}</span> : null}
                    {featured.year ? <span>{featured.year}</span> : null}
                  </div>
                  <p className="mt-6 max-w-[560px] text-[18px] leading-[1.65] text-ink2">
                    {featured.shortDesc}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-rule pt-5">
                  <span className="text-[13px] text-mute">
                    {featured.year
                      ? `${metaPrefix} · ${featured.year}`
                      : pendingLabel}
                  </span>
                  <span className="arrow-shift text-[14px] font-semibold text-ink">
                    {cardCta} <span className="arrow">→</span>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      ) : null}

      <section className="bg-bg py-14 md:py-20">
        <div className="container-site">
          {projects.length === 0 ? (
            <div className="rounded-[14px] border border-rule bg-bg2 p-8 text-ink2">
              Marka bulunamadı.
            </div>
          ) : (
            <div className="grid gap-14">
              {categories
                .filter((category) => !selectedCategory || category === selectedCategory)
                .map((category) => {
                  const items = rest.filter((project) => project.category === category);
                  if (items.length === 0) return null;

                  return (
                    <div key={category}>
                      <div className="mb-6 flex items-end justify-between gap-4 border-b border-rule">
                        <h2 className="pb-4 text-[28px] font-semibold tracking-[-0.035em] text-ink">
                          {category}
                        </h2>
                        <span className="pb-4 text-[13px] font-medium text-mute">
                          {items.length}{" "}
                          {items.length === 1
                            ? settings.brandsCountSingular || "marka"
                            : totalLabel}
                        </span>
                      </div>
                      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {items.map((project) => (
                          <BrandTile
                            key={project.id}
                            slug={project.slug}
                            title={project.title}
                            category={project.category}
                            sector={project.sector}
                            status={project.status}
                            desc={project.shortDesc}
                            coverImage={project.coverImage}
                            liveUrl={project.liveUrl}
                            year={project.year}
                            ctaLabel={cardCta}
                            externalLabel={externalCta}
                            metaPrefix={metaPrefix}
                            pendingLabel={pendingLabel}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function StatBox({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-[12px] border border-rule bg-bg/70 px-4 py-3">
      <div className="text-[28px] font-bold leading-none tracking-[-0.04em] text-ink">
        {value}
      </div>
      <div className="mt-1 text-[12px] font-medium text-mute">{label}</div>
    </div>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] font-medium transition-all",
        active
          ? "border border-ink bg-ink text-[#F7F5F0]"
          : "border border-rule bg-bg/70 text-ink2 hover:bg-bg2 hover:text-ink"
      )}
    >
      {children}
    </Link>
  );
}

function BrandTile({
  slug,
  title,
  category,
  sector,
  status,
  desc,
  coverImage,
  liveUrl,
  year,
  ctaLabel,
  externalLabel,
  metaPrefix,
  pendingLabel,
}: {
  slug: string;
  title: string;
  category: string;
  sector: string | null;
  status: string;
  desc: string;
  coverImage: string;
  liveUrl: string | null;
  year: number | null;
  ctaLabel: string;
  externalLabel: string;
  metaPrefix: string;
  pendingLabel: string;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[14px] border border-rule bg-bg transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(17,17,24,0.12)]">
      <Link href={`/markalarimiz/${slug}`} className="relative block overflow-hidden">
        <div className="relative aspect-[16/8.5] bg-bg2">
          <Image
            src={coverImage}
            alt={`${title} banner`}
            fill
            sizes="(min-width: 1280px) 360px, (min-width: 768px) 45vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/74 via-black/14 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-[28px] font-bold leading-none tracking-[-0.045em] text-white">
              {title}
            </h3>
          </div>
          <span className="absolute right-3 top-3 rounded-full bg-ink/74 px-3 py-1 text-[11.5px] font-medium text-bg backdrop-blur">
            {category}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-indigo">
            {status}
          </span>
          {sector ? (
            <span className="text-[12.5px] font-medium text-mute">{sector}</span>
          ) : null}
        </div>
        <p className="flex-1 text-[14px] leading-[1.62] text-ink2">{desc}</p>
        <div className="mt-2 flex items-center justify-between gap-4 border-t border-rule pt-4">
          <span className="text-[13px] text-mute">
            {year ? `${metaPrefix} · ${year}` : pendingLabel}
          </span>
          <div className="flex items-center gap-3">
            {liveUrl ? (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[13px] font-semibold text-ink"
              >
                {externalLabel} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : null}
            <Link
              href={`/markalarimiz/${slug}`}
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-ink"
            >
              {ctaLabel} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
