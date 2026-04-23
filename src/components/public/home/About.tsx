import { Shot } from "./Shot";
import { SectionHeader } from "./SectionHeader";

export interface AboutValueItem {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
}

interface Props {
  heading: string;
  lead: string;
  image1: string | null;
  image2: string | null;
  image3: string | null;
  values: AboutValueItem[];
}

export function About({
  heading,
  lead,
  image1,
  image2,
  image3,
  values,
}: Props) {
  return (
    <section
      id="sirket"
      className="container-site"
      style={{ padding: "96px 40px" }}
    >
      <SectionHeader eyebrow="Hakkımızda" title={heading} lead={lead} />
      <div className="grid md:grid-cols-[1.1fr_1fr] gap-8 items-start">
        <div className="grid gap-4">
          <Shot src={image1} aspect="16/11" radius={12} label="ofis · çalışma alanı" />
          <div className="grid grid-cols-2 gap-4">
            <Shot src={image2} aspect="1/1" radius={12} label="ekip" />
            <Shot src={image3} aspect="1/1" radius={12} label="ofis" />
          </div>
        </div>
        <div className="grid gap-3.5 content-start">
          {values.map((x) => (
            <div
              key={x.id}
              className="rounded-xl bg-bg p-[22px]"
              style={{ border: "1px solid var(--rule)" }}
            >
              <div className="eyebrow text-[12px]">{x.eyebrow}</div>
              <div className="text-ink font-semibold mt-1.5 text-[20px] tracking-[-0.015em]">
                {x.title}
              </div>
              <div className="text-ink2 mt-2 text-sm leading-[1.55]">
                {x.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
