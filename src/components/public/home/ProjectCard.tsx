"use client";

import Image from "next/image";
import Link from "next/link";

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
  const detailHref = `/markalarimiz/${p.slug}`;
  const externalHref = p.liveUrl ?? detailHref;
  const externalLabel = hasLive ? "Siteyi görüntüle" : "Markayı incele";

  return (
    <article
      className="card-lift group rounded-[14px] overflow-hidden flex flex-col bg-bg"
      style={{
        border: "1px solid var(--rule)",
        boxShadow: "0 1px 2px rgba(17,17,24,0.04)",
      }}
    >
      <Link
        href={detailHref}
        className="relative block overflow-hidden bg-bg2"
        aria-label={`${p.title} markasını incele`}
      >
        <div className="relative aspect-[16/9]">
          <Image
            src={p.coverImage}
            alt={`${p.title} banner`}
            fill
            sizes="(min-width: 1280px) 300px, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="text-[24px] font-bold tracking-[-0.04em] text-white">
              {p.title}
            </h3>
          </div>
        </div>
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
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.04em] text-indigo">
            {p.status}
          </span>
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
            {p.year ? `Grup markası · ${p.year}` : "Yakında"}
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
