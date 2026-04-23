import Link from "next/link";
import { prisma } from "@/lib/db";
import { Shot } from "@/components/public/home/Shot";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export const revalidate = 3600;

export const metadata = {
  title: "Blog & Haberler",
  description:
    "i-Grup blog — ürünlerimiz, sektörlerimiz ve ekibimizden notlar.",
};

const dateStr = (d: Date) => format(d, "d MMM yyyy", { locale: tr });

export default async function BlogListPage() {
  const posts = await prisma.post.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <section className="bg-bg2" style={{ padding: "96px 0 72px" }}>
        <div className="container-site">
          <div className="eyebrow">Blog & Haberler</div>
          <h1
            className="h-display mt-3 max-w-[700px]"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            Ürünlerimizden, sektörlerimizden ve{" "}
            <span className="text-indigo">ekibimizden</span> notlar.
          </h1>
          <p className="text-ink2 mt-5 text-[17px] max-w-[620px] leading-[1.55]">
            Yaptığımız işten, sektörlerin nabzından ve ekip kültürümüzden
            yazıyoruz.
          </p>
        </div>
      </section>

      <section className="container-site" style={{ padding: "72px 40px 96px" }}>
        {posts.length === 0 ? (
          <p className="text-ink2">Henüz yayınlanmış yazı yok.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => (
              <article
                key={p.slug}
                className="card-lift rounded-[14px] overflow-hidden bg-bg"
                style={{ border: "1px solid var(--rule)" }}
              >
                <Link href={`/blog/${p.slug}`} className="block">
                  <Shot
                    src={p.coverImage}
                    aspect="16/10"
                    radius={0}
                    label={p.tag}
                    sizes="(min-width: 1024px) 400px, 50vw"
                  />
                  <div style={{ padding: "24px 26px 28px" }}>
                    <span
                      className="inline-flex text-xs font-semibold text-indigo rounded-full uppercase tracking-[0.04em]"
                      style={{ padding: "5px 10px", background: "var(--bg2)" }}
                    >
                      {p.tag}
                    </span>
                    <h2
                      className="font-bold text-ink tracking-[-0.02em] mt-3 text-[22px]"
                      style={{ lineHeight: 1.2 }}
                    >
                      {p.title}
                    </h2>
                    <p className="text-ink2 mt-2 text-[14px] leading-[1.55] line-clamp-3">
                      {p.excerpt}
                    </p>
                    <div className="flex justify-between items-center mt-5">
                      <span className="text-[13px] text-mute">
                        {dateStr(p.publishedAt)}
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
        )}
      </section>
    </>
  );
}
