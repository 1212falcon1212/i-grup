"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState, type MouseEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  slug: string;
  title: string;
  category: string;
  coverImage: string;
  year?: number | null;
}

export function ProjectCard({ slug, title, category, coverImage, year }: Props) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  function handleMove(e: MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width;
    const py = y / rect.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    const rx = (0.5 - py) * 3;
    const ry = (px - 0.5) * 3;
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
  }

  return (
    <Link
      ref={ref}
      href={`/projelerimiz/${slug}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="glow-card group relative block bg-card border border-border rounded-2xl overflow-hidden transition-[border-color,box-shadow] duration-300 hover:border-primary/30 will-change-transform"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="relative aspect-[16/10] bg-muted overflow-hidden">
        <Image
          src={coverImage}
          alt={title}
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          className={cn(
            "object-cover transition-all duration-700",
            loaded ? "scale-100 blur-0" : "scale-105 blur-md",
            "group-hover:scale-105"
          )}
          onLoad={() => setLoaded(true)}
        />

        {/* Hover overlay with radial highlight */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Category chip */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider bg-background/90 backdrop-blur px-2.5 py-1 rounded-full border border-border">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {category}
          </span>
        </div>

        {/* Year corner */}
        {year ? (
          <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-[11px] font-mono text-white/90 bg-black/40 backdrop-blur px-2 py-1 rounded-full">
              {year}
            </span>
          </div>
        ) : null}

        {/* Bottom-right arrow badge appears on hover */}
        <div className="absolute bottom-3 right-3 z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>

      <div className="p-5 md:p-6">
        <h3 className="text-base md:text-lg font-semibold tracking-tight line-clamp-1">
          {title}
        </h3>
        <p className="text-xs md:text-sm text-muted-foreground mt-1 font-mono">
          {category}
          {year ? ` · ${year}` : ""}
        </p>
      </div>
    </Link>
  );
}
