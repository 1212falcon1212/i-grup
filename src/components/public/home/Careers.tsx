import Link from "next/link";
import { Shot } from "./Shot";

export interface JobItem {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
}

interface Props {
  heading: string;
  lead: string;
  image: string | null;
  jobs: JobItem[];
  applyEmail?: string | null;
  emptyTitle?: string | null;
  emptyText?: string | null;
  applyLabel?: string | null;
}

export function Careers({
  heading,
  lead,
  image,
  jobs,
  applyEmail,
  emptyTitle,
  emptyText,
  applyLabel,
}: Props) {
  return (
    <section
      id="kariyer"
      className="container-site"
      style={{ padding: "96px 40px" }}
    >
      <div className="grid md:grid-cols-[1fr_1.4fr] gap-10 md:gap-14 items-start">
        <div className="md:sticky md:top-[100px]">
          <div className="eyebrow">Kariyer</div>
          <h2
            className="h-display mt-3"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              lineHeight: 1.05,
            }}
          >
            {heading}
          </h2>
          <p className="text-ink2 mt-5 text-[16px] leading-[1.6]">
            {lead}
          </p>
          <div className="mt-6">
            <Shot src={image} aspect="4/3" radius={12} label="ofis" />
          </div>
        </div>

        <div>
          <div className="text-[13px] font-medium text-mute mb-3.5">
            {jobs.length} açık pozisyon
          </div>
          <div
            className="rounded-[14px] overflow-hidden bg-bg"
            style={{ border: "1px solid var(--rule)" }}
          >
            {jobs.map((j, i) => (
              <Link
                key={j.slug}
                href={`/kariyer/${j.slug}`}
                className="grid grid-cols-[1.8fr_1fr_1fr_40px] gap-5 items-center transition-colors hover:bg-bg2"
                style={{
                  padding: "22px 26px",
                  borderBottom:
                    i < jobs.length - 1 ? "1px solid var(--rule)" : undefined,
                }}
              >
                <div>
                  <div className="text-ink font-semibold tracking-[-0.02em] text-[19px]">
                    {j.title}
                  </div>
                  <div className="text-[13px] text-mute mt-1">{j.type}</div>
                </div>
                <div className="text-[13px] font-semibold text-indigo">
                  {j.department}
                </div>
                <div className="text-[13.5px] text-ink2">{j.location}</div>
                <div className="text-[20px] text-ink2 text-right">→</div>
              </Link>
            ))}
          </div>

          <div
            className="mt-6 rounded-[14px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
            style={{ padding: "22px 26px", background: "var(--bg2)" }}
          >
            <div>
              <div className="text-ink font-semibold text-[15px]">
                {emptyTitle || "Listede yok mu?"}
              </div>
              <div className="text-ink2 text-[13.5px] mt-0.5">
                {emptyText || "Yine de özgeçmişinizi gönderin — sizinle tanışırız."}
              </div>
            </div>
            <a
              href={applyEmail ? `mailto:${applyEmail}` : "/iletisim"}
              className="text-[13.5px] font-semibold text-ink rounded-full transition-colors hover:bg-bg"
              style={{
                padding: "10px 18px",
                background: "var(--bg)",
                border: "1px solid var(--rule)",
              }}
            >
              {applyLabel || "Başvur →"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
