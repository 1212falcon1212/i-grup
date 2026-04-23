import Link from "next/link";
import { SectionHeader } from "./SectionHeader";

export interface SectorItem {
  slug: string;
  name: string;
  detail: string;
  count: number;
  projects: { slug: string; title: string }[];
}

export function Sectors({ sectors }: { sectors: SectorItem[] }) {
  const totalProducts = sectors.reduce((s, x) => s + x.count, 0);

  return (
    <section
      id="sektorler"
      className="bg-bg2"
      style={{ padding: "96px 0" }}
    >
      <div className="container-site">
        <SectionHeader
          eyebrow="Sektörler"
          title="Hizmet verdiğimiz dikeyler."
          lead="Farklı pazarlar, aynı üretim disiplini. Bir sektörde öğrendiğimiz diğerini besliyor."
        />

        <ul
          className="mt-4"
          style={{ borderTop: "1px solid var(--rule)" }}
        >
          {sectors.map((s, i) => (
            <li
              key={s.slug}
              className="group relative transition-colors hover:bg-bg3/60"
              style={{ borderBottom: "1px solid var(--rule)" }}
            >
              {/* Indigo left accent bar, reveals on hover */}
              <span
                aria-hidden
                className="absolute left-0 top-0 bottom-0 w-[3px] bg-indigo origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300"
              />
              <Link
                href="#projeler"
                className="grid grid-cols-[44px_1fr_auto] md:grid-cols-[56px_1fr_auto_60px] gap-x-6 md:gap-x-10 items-start py-7 md:py-9 px-2 md:px-4"
              >
                {/* Index — mono */}
                <div className="font-mono text-[13px] tracking-widest text-mute pt-1.5">
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Name + detail + project chips */}
                <div className="min-w-0">
                  <h3
                    className="font-semibold text-ink tracking-[-0.025em]"
                    style={{
                      fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                      lineHeight: 1.15,
                    }}
                  >
                    {s.name}
                  </h3>
                  <p className="text-ink2 mt-1.5 text-[14.5px] leading-[1.55]">
                    {s.detail}
                  </p>
                  {s.projects.length > 0 ? (
                    <ul className="mt-4 flex flex-wrap gap-x-2 gap-y-1.5">
                      {s.projects.map((p) => (
                        <li key={p.slug}>
                          <span
                            className="inline-flex items-center gap-1.5 font-mono text-[11.5px] tracking-[0.02em] text-ink2 rounded-full px-2.5 py-1"
                            style={{
                              background: "var(--bg)",
                              border: "1px solid var(--rule)",
                            }}
                          >
                            <span
                              className="dot"
                              style={{ background: "var(--indigo-soft)" }}
                            />
                            {p.title}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                {/* Count — prominent */}
                <div className="flex flex-col items-end justify-start pt-0.5">
                  <span
                    className="font-semibold text-indigo leading-none"
                    style={{
                      fontSize: "clamp(2rem, 3vw, 2.75rem)",
                      letterSpacing: "-0.04em",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {String(s.count).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute mt-2">
                    ürün
                  </span>
                </div>

                {/* Arrow on the right (desktop only) */}
                <div className="hidden md:flex items-center justify-end self-center">
                  <span
                    className="h-10 w-10 rounded-full flex items-center justify-center text-ink transition-all duration-300 group-hover:bg-ink group-hover:text-bg group-hover:border-ink"
                    style={{
                      border: "1px solid var(--rule)",
                      background: "var(--bg)",
                    }}
                  >
                    <svg
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden
                    >
                      <path d="M7 17L17 7M7 7h10v10" strokeLinecap="round" />
                    </svg>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex items-center justify-between flex-wrap gap-3">
          <div className="font-mono text-[12.5px] tracking-wide text-mute">
            Toplam{" "}
            <span className="text-ink font-medium">{totalProducts}</span>{" "}
            aktif ürün · {sectors.length} dikey
          </div>
          <Link
            href="#projeler"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink group"
          >
            Projelere gözat
            <svg
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M5 12h14m0 0l-6-6m6 6l-6 6" strokeLinecap="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
