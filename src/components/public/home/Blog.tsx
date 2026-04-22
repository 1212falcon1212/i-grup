import Link from "next/link";
import { Shot } from "./Shot";
import { SectionHeader } from "./SectionHeader";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export interface PostItem {
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: Date;
}

export function Blog({ posts }: { posts: PostItem[] }) {
  if (posts.length === 0) return null;
  const [lead, ...rest] = posts;
  const dateStr = (d: Date) => format(d, "d MMM yyyy", { locale: tr });

  return (
    <section
      id="blog"
      className="bg-bg2"
      style={{ padding: "96px 0" }}
    >
      <div className="container-site">
        <SectionHeader
          eyebrow="Blog & Haberler"
          title="Ürünlerimizden, sektörlerimizden ve ekibimizden notlar."
          lead="Yaptığımız işten, sektörlerin nabzından ve ekip kültürümüzden yazıyoruz."
        />
        <div className="grid md:grid-cols-[1.4fr_1fr] gap-6">
          {/* Lead article */}
          <article
            className="bg-bg rounded-[14px] overflow-hidden card-lift group"
            style={{ border: "1px solid var(--rule)" }}
          >
            <Link href={`/blog/${lead.slug}`} className="block">
              <Shot
                src={lead.coverImage}
                aspect="16/10"
                radius={0}
                label="öne çıkan yazı"
                sizes="(min-width: 768px) 60vw, 100vw"
              />
              <div style={{ padding: "32px 34px 36px" }}>
                <span
                  className="inline-flex text-xs font-semibold text-indigo rounded-full"
                  style={{ padding: "5px 10px", background: "var(--bg2)" }}
                >
                  {lead.tag}
                </span>
                <h3
                  className="font-bold text-ink tracking-[-0.025em] mt-3.5"
                  style={{ fontSize: 34, lineHeight: 1.15 }}
                >
                  {lead.title}
                </h3>
                <p className="text-ink2 mt-2.5 text-[16px] leading-[1.55]">
                  {lead.excerpt}
                </p>
                <div className="flex justify-between items-center mt-5.5">
                  <span className="text-[13px] text-mute">
                    {dateStr(lead.publishedAt)}
                  </span>
                  <span className="text-sm font-semibold text-ink arrow-shift">
                    Yazının tamamı <span className="arrow">→</span>
                  </span>
                </div>
              </div>
            </Link>
          </article>

          {/* Secondary */}
          <div className="grid gap-4">
            {rest.slice(0, 3).map((n) => (
              <article
                key={n.slug}
                className="bg-bg rounded-[14px] overflow-hidden card-lift group grid grid-cols-[1fr_1.4fr]"
                style={{ border: "1px solid var(--rule)" }}
              >
                <Link
                  href={`/blog/${n.slug}`}
                  className="contents"
                >
                  <div className="relative">
                    <Shot
                      src={n.coverImage}
                      aspect="4/3"
                      radius={0}
                      label={n.tag}
                      sizes="(min-width: 768px) 180px, 40vw"
                    />
                  </div>
                  <div
                    className="flex flex-col justify-between"
                    style={{ padding: "18px 22px" }}
                  >
                    <div>
                      <div className="text-[11.5px] font-semibold text-indigo tracking-[0.04em] uppercase">
                        {n.tag} · {dateStr(n.publishedAt)}
                      </div>
                      <div className="font-bold text-ink tracking-[-0.02em] mt-1.5 text-[18px] leading-[1.2]">
                        {n.title}
                      </div>
                      <div className="text-ink2 mt-2 text-[13.5px] leading-[1.5] line-clamp-2">
                        {n.excerpt}
                      </div>
                    </div>
                    <div className="text-[13px] font-semibold text-ink mt-2.5 arrow-shift">
                      Oku <span className="arrow">→</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
