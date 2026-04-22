"use client";

import Link from "next/link";
import { useRef, type MouseEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { iconByName } from "@/components/shared/icons";
import { cn } from "@/lib/utils";

interface Props {
  slug: string;
  title: string;
  shortDesc: string;
  icon: string | null;
  index?: number;
}

export function ServiceCard({ slug, title, shortDesc, icon, index }: Props) {
  const Icon = iconByName(icon);
  const ref = useRef<HTMLAnchorElement | null>(null);

  function handleMove(e: MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }

  return (
    <Link
      ref={ref}
      href={`/hizmetlerimiz/${slug}`}
      onMouseMove={handleMove}
      className={cn(
        "glow-card group relative bg-card border border-border rounded-2xl p-6 md:p-7 flex flex-col h-full transition-colors duration-300 hover:border-primary/30",
        "overflow-hidden"
      )}
    >
      <span
        aria-hidden
        className="absolute top-4 right-4 num-badge opacity-40 group-hover:opacity-100 transition-opacity"
      >
        {typeof index === "number" ? String(index + 1).padStart(2, "0") : ""}
      </span>

      {Icon ? (
        <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
          <Icon className="h-5 w-5 transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110" />
        </div>
      ) : null}

      <h3 className="text-lg md:text-xl font-semibold tracking-tight">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mt-2.5 flex-1 leading-relaxed">
        {shortDesc}
      </p>
      <span className="inline-flex items-center gap-1 text-sm text-primary mt-5 font-medium">
        Detay
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  );
}
