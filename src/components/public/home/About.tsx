import { Shot } from "./Shot";
import { SectionHeader } from "./SectionHeader";

interface Props {
  heading: string;
  lead: string;
  image1: string | null;
  image2: string | null;
  image3: string | null;
}

const VALUES = [
  {
    k: "Odak",
    v: "Uçtan uca ürün geliştirme",
    d: "Strateji, tasarım, mühendislik, operasyon — tek ekip, tek takvim.",
  },
  {
    k: "Yaklaşım",
    v: "Sahaya bakar, üretir, ölçer",
    d: "Eczacıyla sahada, markayla rafta, tüketiciyle uygulamada.",
  },
  {
    k: "Altyapı",
    v: "Paylaşımlı ve ölçekli",
    d: "Bir üründe çözdüğümüzü diğer ürünlere taşıyoruz.",
  },
  {
    k: "Destek",
    v: "Lansman sonrası devam",
    d: "Ürünü yayımlamak başlangıçtır; sürdürme sözleşmeleri ile yanında kalırız.",
  },
];

export function About({ heading, lead, image1, image2, image3 }: Props) {
  return (
    <section
      id="sirket"
      className="container-site"
      style={{ padding: "96px 40px" }}
    >
      <SectionHeader eyebrow="Hakkımızda" title={heading} lead={lead} />
      <div className="grid md:grid-cols-[1.1fr_1fr] gap-8">
        <div className="grid gap-4">
          <Shot src={image1} aspect="16/11" radius={12} label="ofis · çalışma alanı" />
          <div className="grid grid-cols-2 gap-4">
            <Shot src={image2} aspect="1/1" radius={12} label="ekip" />
            <Shot src={image3} aspect="1/1" radius={12} label="ofis" />
          </div>
        </div>
        <div className="grid gap-4 content-start">
          {VALUES.map((x) => (
            <div
              key={x.k}
              className="rounded-xl bg-bg p-[22px]"
              style={{ border: "1px solid var(--rule)" }}
            >
              <div className="eyebrow text-[12px]">{x.k}</div>
              <div className="text-ink font-semibold mt-1.5 text-[20px] tracking-[-0.015em]">
                {x.v}
              </div>
              <div className="text-ink2 mt-2 text-sm leading-[1.55]">
                {x.d}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
