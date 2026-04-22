import { SectionHeader } from "./SectionHeader";
import { cn } from "@/lib/utils";

export interface SectorItem {
  slug: string;
  name: string;
  detail: string;
  count: number;
}

export function Sectors({ sectors }: { sectors: SectorItem[] }) {
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
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {sectors.map((s, i) => {
            const inverted = i === 1;
            const spanClass = i === 0 || i === 1 ? "md:col-span-3" : "md:col-span-2";
            return (
              <div
                key={s.slug}
                className={cn(
                  "p-[26px] rounded-[14px] flex flex-col justify-between min-h-[200px] col-span-2",
                  spanClass
                )}
                style={{
                  background: inverted ? "var(--ink)" : "var(--bg)",
                  color: inverted ? "var(--bg)" : "var(--ink)",
                  border: `1px solid ${inverted ? "var(--ink)" : "var(--rule)"}`,
                }}
              >
                <div
                  className="font-bold leading-none"
                  style={{
                    fontSize: 56,
                    letterSpacing: "-0.04em",
                    color: inverted ? "var(--indigo-soft)" : "var(--indigo)",
                  }}
                >
                  {s.count}
                  <span
                    className="font-medium ml-1.5"
                    style={{
                      fontSize: 18,
                      color: inverted ? "rgba(247,245,240,0.6)" : "var(--mute)",
                    }}
                  >
                    ürün
                  </span>
                </div>
                <div>
                  <div
                    className="font-semibold tracking-[-0.015em]"
                    style={{ fontSize: 19, lineHeight: 1.25 }}
                  >
                    {s.name}
                  </div>
                  <div
                    className="mt-2 text-[13.5px] leading-[1.5]"
                    style={{ opacity: inverted ? 0.75 : 0.7 }}
                  >
                    {s.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
