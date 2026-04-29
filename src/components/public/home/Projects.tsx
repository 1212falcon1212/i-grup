"use client";

import { useMemo, useState } from "react";
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
      className="bg-[#0A0A10] text-[#F7F5F0]"
      style={{ padding: "104px 0 120px" }}
    >
      <div className="container-site">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-16 items-end">
          <div>
            <div className="text-[12.5px] font-semibold uppercase tracking-[0.18em] text-[#E7B500]">
              {eyebrow || "Markalarımız"}
            </div>
            <h2
              className="mt-4 font-bold tracking-[-0.045em] text-white"
              style={{
                fontSize: "clamp(3rem, 6vw, 5.4rem)",
                lineHeight: 0.94,
              }}
            >
              {title || "i-Grup Şirketler Topluluğu"}
            </h2>
          </div>
          <p
            className="max-w-[620px] text-[#F7F5F0]/68"
            style={{ fontSize: 20, lineHeight: 1.6 }}
          >
            {lead ||
              "Eczane pazaryeri, B2B tedarik platformları, kozmetik ve kişisel bakım girişimleri, finansal çözümler ve tüketici platformları aynı grup çatısı altında konumlanır."}
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
            {allTags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilter(t)}
                className={cn(
                  "text-[13px] font-medium px-4 py-2.5 rounded-full transition-all",
                  filter === t
                    ? "bg-[#F7F5F0] text-[#0A0A10] border border-[#F7F5F0]"
                    : "border border-white/14 bg-white/[0.03] text-[#F7F5F0]/72 hover:text-white hover:bg-white/[0.08]"
                )}
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

        <div className="mt-16 grid gap-16">
          {grouped.map(([category, items]) => (
            <div key={category}>
              <div
                className="mb-6 flex items-end justify-between gap-4"
                style={{ borderBottom: "1px solid rgba(247,245,240,0.14)" }}
              >
                <h3 className="pb-4 text-[28px] font-semibold tracking-[-0.035em] text-white">
                  {category}
                </h3>
                <span className="pb-4 text-[13px] font-medium text-[#F7F5F0]/50">
                  {items.length} marka
                </span>
              </div>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
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
