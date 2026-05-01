import Link from "next/link";
import { Shot } from "./Shot";

interface Props {
  statusText: string;
  heading: string;
  highlight: string;
  subtitle: string;
  heroImageUrl: string | null;
  stats: { value: string; label: string }[];
  teamSize: number;
  ctaPrimaryLabel?: string | null;
  ctaPrimaryUrl?: string | null;
  ctaSecondaryLabel?: string | null;
  ctaSecondaryUrl?: string | null;
  overlayLabel?: string | null;
  overlayTitle?: string | null;
  overlayDescription?: string | null;
  imageLabel?: string | null;
}

export function Hero({
  statusText,
  heading,
  highlight,
  subtitle,
  heroImageUrl,
  stats,
  teamSize,
  ctaPrimaryLabel,
  ctaPrimaryUrl,
  ctaSecondaryLabel,
  ctaSecondaryUrl,
  overlayLabel,
  overlayTitle,
  overlayDescription,
  imageLabel,
}: Props) {
  const parts = highlight ? heading.split(highlight) : [heading];
  const leading = parts[0] ?? heading;
  const tail = highlight && parts.length > 1 ? highlight : "";

  const primaryLabel = ctaPrimaryLabel || "Markalarımız";
  const primaryUrl = ctaPrimaryUrl || "#markalar";
  const secondaryLabel = ctaSecondaryLabel || "Birlikte çalışalım";
  const secondaryUrl = ctaSecondaryUrl || "#iletisim";

  const ovLabel = overlayLabel || "EKİP";
  const ovTitle = overlayTitle || `${teamSize} kişi, tek çatı`;
  const ovDesc =
    overlayDescription ||
    "Ürün, tasarım, mühendislik ve operasyon aynı ofiste.";

  return (
    <section
      className="container-site"
      style={{ padding: "72px 40px 96px" }}
    >
      <div className="grid md:grid-cols-[1.2fr_1fr] gap-10 md:gap-16 items-center">
        <div>
          <span className="pill">
            <span
              className="dot"
              style={{
                background: "var(--success)",
                boxShadow: "0 0 8px rgba(22,163,74,0.5)",
              }}
            />
            <span className="text-ink2 font-medium">{statusText}</span>
          </span>

          <h1
            className="h-display mt-6"
            style={{
              fontSize: "clamp(2.75rem, 6vw, 4.75rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.035em",
            }}
          >
            {leading}
            {tail ? <span className="text-indigo">{tail}</span> : null}
          </h1>

          <p
            className="text-ink2 mt-7 max-w-[560px]"
            style={{ fontSize: 19, lineHeight: 1.55 }}
          >
            {subtitle}
          </p>

          <div className="flex flex-wrap gap-3.5 mt-9">
            <Link
              href={primaryUrl}
              className="inline-flex items-center gap-2.5 text-[15px] font-medium px-6 py-3.5 rounded-full bg-ink text-[#F7F5F0] hover:opacity-90 transition-opacity arrow-shift"
            >
              {primaryLabel}{" "}
              <span className="arrow text-lg leading-none">→</span>
            </Link>
            <Link
              href={secondaryUrl}
              className="inline-flex items-center text-[15px] font-medium px-6 py-3.5 rounded-full text-ink hover:bg-bg2 transition-colors"
              style={{ border: "1px solid rgba(17,17,24,0.22)" }}
            >
              {secondaryLabel}
            </Link>
          </div>

          <div className="flex flex-wrap gap-10 mt-14">
            {stats.map((s) => (
              <div key={s.label}>
                <div
                  className="h-display"
                  style={{
                    fontSize: 34,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div className="text-xs text-mute mt-1.5 font-medium">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <Shot
            src={heroImageUrl}
            aspect="4/5"
            radius={12}
            label={imageLabel || "i-Grup merkez ofis"}
            priority
            sizes="(min-width: 768px) 40vw, 100vw"
          />
          <div
            className="absolute max-w-[260px] bg-bg rounded-xl z-10"
            style={{
              left: -24,
              bottom: 32,
              padding: "16px 18px",
              boxShadow: "0 12px 28px rgba(17,17,24,0.12)",
            }}
          >
            <div className="text-xs font-semibold text-mute tracking-wide uppercase">
              {ovLabel}
            </div>
            <div className="text-[18px] font-semibold text-ink mt-1">
              {ovTitle}
            </div>
            <div className="text-[13px] text-ink2 mt-1.5 leading-[1.45]">
              {ovDesc}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
