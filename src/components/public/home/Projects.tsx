"use client";

import { useMemo, useState } from "react";
import { SectionHeader } from "./SectionHeader";
import { ProjectCard, type ProjectCardData } from "./ProjectCard";
import { cn } from "@/lib/utils";

interface Props {
  projects: Omit<ProjectCardData, "featured">[];
  eyebrow?: string | null;
  title?: string | null;
  lead?: string | null;
}

export function Projects({ projects, eyebrow, title, lead }: Props) {
  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const p of projects) set.add(p.category);
    return ["Tümü", ...Array.from(set)];
  }, [projects]);

  const [filter, setFilter] = useState("Tümü");

  const filtered = useMemo(() => {
    return filter === "Tümü"
      ? projects
      : projects.filter((p) => p.category === filter);
  }, [filter, projects]);

  const countFor = (tag: string) =>
    tag === "Tümü"
      ? projects.length
      : projects.filter((p) => p.category === tag).length;

  return (
    <section
      id="markalar"
      className="container-site"
      style={{ padding: "96px 40px" }}
    >
      <SectionHeader
        eyebrow={eyebrow || "Markalarımız"}
        title={title || "i-Grup çatısı altında büyüyen markalar."}
        lead={
          lead ||
          "Eczane pazaryerinden B2B tedarik platformlarına, kozmetik ve kişisel bakım markalarından tüketici uygulamalarına kadar farklı alanlarda faaliyet gösteren dijital markalarımız."
        }
      />
      <div className="flex flex-wrap gap-2 mb-8">
        {allTags.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilter(t)}
            className={cn(
              "text-[13px] font-medium px-4 py-2.5 rounded-full transition-all",
              filter === t
                ? "bg-ink text-[#F7F5F0] border border-ink"
                : "border bg-transparent text-ink2 hover:text-ink hover:bg-bg2"
            )}
            style={filter !== t ? { borderColor: "var(--rule)" } : undefined}
          >
            {t}{" "}
            <span
              className="ml-1.5"
              style={{ opacity: filter === t ? 0.75 : 0.6 }}
            >
              {countFor(t)}
            </span>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <ProjectCard key={p.slug} p={{ ...p, featured: false }} />
        ))}
      </div>
    </section>
  );
}
