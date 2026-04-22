import Link from "next/link";
import { prisma } from "@/lib/db";
import { Container } from "@/components/shared/Container";
import { ProjectCard } from "@/components/public/ProjectCard";
import { cn } from "@/lib/utils";

export const revalidate = 3600;

export const metadata = {
  title: "Projelerimiz",
  description:
    "15+ kurumsal proje: pazaryeri, e-ticaret, kozmetik, kurye operasyonu ve B2B platformları.",
};

export default async function ProjectsListPage({
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
      <Container className="py-12 md:py-20">
        <header className="max-w-3xl mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            Projelerimiz
          </h1>
          <p className="text-muted-foreground mt-3 text-base md:text-lg">
            Farklı dikeylerde kurumsal ölçekte geliştirdiğimiz projelerden bir
            seçki.
          </p>
        </header>

        <div className="flex flex-wrap items-center gap-2 mb-8">
          <FilterChip
            href="/projelerimiz"
            active={!params.kategori}
            label="Tümü"
          />
          {categories.map((c) => (
            <FilterChip
              key={c}
              href={`/projelerimiz?kategori=${encodeURIComponent(c)}`}
              active={params.kategori === c}
              label={c}
            />
          ))}
        </div>

        {projects.length === 0 ? (
          <p className="text-muted-foreground py-12">Proje bulunamadı.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
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
        "text-sm px-3.5 py-1.5 rounded-full border transition-colors",
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "border-border bg-background hover:bg-muted"
      )}
    >
      {label}
    </Link>
  );
}
