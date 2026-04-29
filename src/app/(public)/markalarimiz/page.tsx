import Link from "next/link";
import { prisma } from "@/lib/db";
import { Container } from "@/components/shared/Container";
import { ProjectCard } from "@/components/public/ProjectCard";
import { Reveal, RevealStagger, RevealItem } from "@/components/motion/Reveal";
import { GridBackground } from "@/components/motion/GridBackground";
import { cn } from "@/lib/utils";

export const revalidate = 3600;

export const metadata = {
  title: "Markalarımız",
  description:
    "i-Grup çatısı altında faaliyet gösteren dijital markalar, pazaryerleri ve platformlar.",
};

export default async function BrandsListPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const params = await searchParams;
  const [projects, allCategories] = await Promise.all([
    prisma.project.findMany({
      where: params.kategori ? { category: params.kategori } : undefined,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    }),
    prisma.project.findMany({ select: { category: true }, distinct: ["category"] }),
  ]);
  const categories = allCategories.map((c) => c.category).sort();

  return (
    <>
      <section className="relative border-b border-border bg-muted/30 overflow-hidden">
        <GridBackground />
        <Container className="relative py-16 md:py-24">
          <Reveal>
            <div className="eyebrow mb-4">
              <span className="num-badge">01</span> Markalarımız
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-[-0.02em] leading-[1.05] max-w-3xl">
              i-Grup çatısı altında büyüyen{" "}
              <span className="serif-accent text-gradient">
                dijital markalar.
              </span>
            </h1>
            <p className="text-muted-foreground mt-5 text-base md:text-lg max-w-2xl">
              Toplam{" "}
              <span className="font-mono text-foreground">
                {projects.length}
              </span>{" "}
              marka
              {params.kategori ? (
                <>
                  {" "}
                  —{" "}
                  <span className="font-mono text-foreground">
                    {params.kategori}
                  </span>{" "}
                  kategorisinde
                </>
              ) : null}
              .
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-wrap items-center gap-2 mt-10">
              <FilterChip href="/markalarimiz" active={!params.kategori} label="Tümü" />
              {categories.map((c) => (
                <FilterChip
                  key={c}
                  href={`/markalarimiz?kategori=${encodeURIComponent(c)}`}
                  active={params.kategori === c}
                  label={c}
                />
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      <Container className="py-16 md:py-24">
        {projects.length === 0 ? (
          <p className="text-muted-foreground py-12">Marka bulunamadı.</p>
        ) : (
          <RevealStagger
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            stagger={0.05}
          >
            {projects.map((p) => (
              <RevealItem key={p.id}>
                <ProjectCard
                  slug={p.slug}
                  title={p.title}
                  category={p.category}
                  coverImage={p.coverImage}
                  year={p.year}
                />
              </RevealItem>
            ))}
          </RevealStagger>
        )}
      </Container>
    </>
  );
}

function FilterChip({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm px-4 py-1.5 rounded-full border transition-all duration-200",
        active
          ? "bg-foreground text-background border-foreground"
          : "border-border bg-background hover:border-foreground/40 hover:bg-muted"
      )}
    >
      {label}
    </Link>
  );
}
