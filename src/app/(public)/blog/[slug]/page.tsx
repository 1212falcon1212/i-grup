import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Shot } from "@/components/public/home/Shot";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { isPublished: true },
    select: { slug: true },
  });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) return {};
  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    openGraph: post.coverImage ? { images: [post.coverImage] } : undefined,
  };
}

const dateStr = (d: Date) => format(d, "d MMMM yyyy", { locale: tr });

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post || !post.isPublished) notFound();

  const related = await prisma.post.findMany({
    where: {
      isPublished: true,
      slug: { not: post.slug },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return (
    <>
      <article>
        <header className="bg-bg2" style={{ padding: "72px 0 56px" }}>
          <div className="container-site max-w-[860px]">
            <Link
              href="/blog"
              className="text-[13px] text-ink2 hover:text-ink inline-flex items-center gap-1.5"
            >
              <span>←</span> Tüm yazılar
            </Link>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span
                className="inline-flex text-xs font-semibold text-indigo rounded-full uppercase tracking-[0.04em]"
                style={{ padding: "5px 11px", background: "var(--bg)" }}
              >
                {post.tag}
              </span>
              <span className="text-[13px] text-mute">
                {dateStr(post.publishedAt)}
              </span>
            </div>
            <h1
              className="h-display mt-5"
              style={{
                fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                lineHeight: 1.08,
                letterSpacing: "-0.025em",
              }}
            >
              {post.title}
            </h1>
            <p className="text-ink2 text-[18px] leading-[1.55] mt-5 max-w-[700px]">
              {post.excerpt}
            </p>
          </div>
        </header>

        {post.coverImage ? (
          <div className="container-site" style={{ padding: "0 40px" }}>
            <div className="max-w-[1040px] mx-auto" style={{ marginTop: -40 }}>
              <Shot
                src={post.coverImage}
                aspect="16/9"
                radius={16}
                label={post.tag}
                priority
                sizes="(min-width: 1040px) 1040px, 100vw"
              />
            </div>
          </div>
        ) : null}

        <div
          className="container-site max-w-[760px]"
          style={{ padding: "72px 40px 96px" }}
        >
          <article
            className="prose-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      {related.length > 0 ? (
        <section
          className="bg-bg2"
          style={{ padding: "72px 0", borderTop: "1px solid var(--rule)" }}
        >
          <div className="container-site">
            <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
              <h2
                className="h-display"
                style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
              >
                Diğer yazılar
              </h2>
              <Link
                href="/blog"
                className="text-[14px] font-semibold text-ink arrow-shift"
              >
                Tümü <span className="arrow">→</span>
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((r) => (
                <article
                  key={r.slug}
                  className="card-lift bg-bg rounded-[14px] overflow-hidden"
                  style={{ border: "1px solid var(--rule)" }}
                >
                  <Link href={`/blog/${r.slug}`} className="block">
                    <Shot
                      src={r.coverImage}
                      aspect="16/10"
                      radius={0}
                      label={r.tag}
                      sizes="(min-width: 1024px) 400px, 50vw"
                    />
                    <div style={{ padding: "22px 24px 26px" }}>
                      <span
                        className="inline-flex text-xs font-semibold text-indigo rounded-full uppercase tracking-[0.04em]"
                        style={{ padding: "4px 10px", background: "var(--bg2)" }}
                      >
                        {r.tag}
                      </span>
                      <h3
                        className="font-bold text-ink tracking-[-0.02em] mt-2.5 text-[18px]"
                        style={{ lineHeight: 1.25 }}
                      >
                        {r.title}
                      </h3>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[12.5px] text-mute">
                          {dateStr(r.publishedAt)}
                        </span>
                        <span className="text-[13px] font-semibold text-ink arrow-shift">
                          Oku <span className="arrow">→</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
