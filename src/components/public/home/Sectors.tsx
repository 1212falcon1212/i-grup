import Link from "next/link";
import { SectionHeader } from "./SectionHeader";

export interface SectorItem {
  slug: string;
  name: string;
  detail: string;
  count: number;
  projects: { slug: string; title: string }[];
}

export function Sectors({
  sectors,
  eyebrow,
  title,
  lead,
}: {
  sectors: SectorItem[];
  eyebrow?: string | null;
  title?: string | null;
  lead?: string | null;
}) {
  return (
    <section
      id="sektorler"
      className="bg-bg2"
      style={{ padding: "96px 0" }}
    >
      <div className="container-site">
        <SectionHeader
          eyebrow={eyebrow || "Sektörler"}
          title={title || "Hizmet verdiğimiz sektörler."}
          lead={
            lead ||
            "Farklı pazarlar, aynı üretim disiplini. Bir sektörde öğrendiğimiz diğerini besliyor."
          }
        />

        <ul
          className="mt-4"
          style={{ borderTop: "1px solid var(--rule)" }}
        >
          {sectors.map((s) => (
            <li
              key={s.slug}
              className="group relative transition-colors hover:bg-bg3/60"
              style={{ borderBottom: "1px solid var(--rule)" }}
            >
              {/* Indigo left accent bar — reveals on hover */}
              <span
                aria-hidden
                className="absolute left-0 top-0 bottom-0 w-[3px] bg-indigo origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300"
              />
              <Link
                href="#projeler"
                className="grid grid-cols-[1fr_auto] gap-x-6 md:gap-x-10 items-start py-8 md:py-10 px-2 md:px-6"
              >
                <div className="min-w-0">
                  <h3
                    className="font-semibold text-ink tracking-[-0.025em]"
                    style={{
                      fontSize: "clamp(1.5rem, 2.75vw, 2.25rem)",
                      lineHeight: 1.15,
                    }}
                  >
                    {s.name}
                  </h3>
                  <p
                    className="text-ink2 mt-3 max-w-[820px]"
                    style={{ fontSize: "15.5px", lineHeight: 1.65 }}
                  >
                    {s.detail}
                  </p>
                </div>

                <div className="flex items-center self-center pt-1">
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
      </div>
    </section>
  );
}
