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

  const grouped = useMemo(() => {
    const groups = new Map<string, Omit<ProjectCardData, "featured">[]>();
    for (const p of filtered) {
      const group = groups.get(p.category) ?? [];
      group.push(p);
      groups.set(p.category, group);
    }
    return Array.from(groups.entries());
  }, [filtered]);

  return (
    <section
      id="markalar"
      className="container-site"
      style={{ padding: "96px 40px 112px" }}
    >
      <div className="grid lg:grid-cols-[0.76fr_1.24fr] gap-10 lg:gap-16 items-start">
        <div className="lg:sticky lg:top-28">
          <SectionHeader
            eyebrow={eyebrow || "Markalarımız"}
            title={title || "i-Grup Şirketler Topluluğu markaları."}
            lead={
              lead ||
              "Eczane pazaryeri, B2B tedarik platformları, kozmetik ve kişisel bakım girişimleri, finansal çözümler ve tüketici platformları aynı grup çatısı altında konumlanır."
            }
          />
          <div className="flex flex-wrap gap-2 mt-8">
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
        </div>

        <div className="grid gap-10">
          {grouped.map(([category, items]) => (
            <div key={category}>
              <div
                className="mb-4 flex items-center justify-between gap-4"
                style={{ borderBottom: "1px solid var(--rule)" }}
              >
                <h3 className="pb-3 text-[22px] font-semibold tracking-[-0.02em] text-ink">
                  {category}
                </h3>
                <span className="pb-3 text-[13px] font-medium text-mute">
                  {items.length} marka
                </span>
              </div>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {items.map((p) => (
                  <ProjectCard key={p.slug} p={{ ...p, featured: false }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
