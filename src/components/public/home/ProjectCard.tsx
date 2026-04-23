"use client";

import Link from "next/link";
import { Shot } from "./Shot";

export interface ProjectCardData {
  slug: string;
  title: string;
  category: string;
  sector: string | null;
  status: string;
  desc: string;
  coverImage: string;
  year: number | null;
  hue: number | null;
  liveUrl: string | null;
  featured: boolean;
}

export function ProjectCard({ p }: { p: ProjectCardData }) {
  const hasLive = !!p.liveUrl;
  const externalHref = p.liveUrl ?? `/projelerimiz/${p.slug}`;
  const externalLabel = hasLive ? "Siteyi görüntüle" : "Detay";

  return (
    <article
      className="card-lift group rounded-[14px] overflow-hidden flex flex-col bg-bg"
      style={{
        border: "1px solid var(--rule)",
        boxShadow: "0 1px 2px rgba(17,17,24,0.04)",
      }}
    >
      <Link
        href={`/projelerimiz/${p.slug}`}
        className="relative block"
        aria-label={`${p.title} — detay`}
      >
        <Shot
          src={p.coverImage}
          hue={p.hue ?? 260}
          aspect="16/10"
          radius={0}
          fit="cover"
          label={`${p.title} · ekran görüntüsü`}
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
        />
        {/* Category chip */}
        <div
          className="absolute top-3.5 right-3.5 inline-flex text-[11.5px] font-medium rounded-full px-[11px] py-[5px] backdrop-blur"
          style={{
            background: "rgba(17,17,24,0.72)",
            color: "var(--bg)",
          }}
        >
          {p.category}
        </div>
      </Link>
      <div
        className="flex-1 flex flex-col gap-3"
        style={{ padding: "20px 22px 22px" }}
      >
        <div className="flex justify-between items-baseline gap-3">
          <h3
            className="font-bold text-ink tracking-[-0.025em]"
            style={{ fontSize: 22, lineHeight: 1.1 }}
          >
            {p.title}
          </h3>
          <span className="text-[12.5px] font-medium text-mute whitespace-nowrap">
            {p.sector}
          </span>
        </div>
        <p
          className="text-ink2 flex-1"
          style={{
            fontSize: 13.5,
            lineHeight: 1.55,
            margin: 0,
          }}
        >
          {p.desc}
        </p>
        <div
          className="flex justify-between items-center pt-3.5 mt-2"
          style={{ borderTop: "1px solid var(--rule)" }}
        >
          <span className="text-[13px] text-mute">
            {p.year ? `Lansman · ${p.year}` : "Yakında"}
          </span>
          {hasLive ? (
            <a
              href={externalHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-semibold text-ink arrow-shift"
            >
              {externalLabel} <span className="arrow">→</span>
            </a>
          ) : (
            <Link
              href={externalHref}
              className="text-[13px] font-semibold text-ink arrow-shift"
            >
              {externalLabel} <span className="arrow">→</span>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
