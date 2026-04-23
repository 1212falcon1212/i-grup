"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Props {
  src?: string | null;
  hue?: number;
  label?: string;
  aspect?: "16/10" | "16/9" | "16/11" | "4/3" | "4/5" | "1/1" | "3/2";
  radius?: number;
  dark?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
  fit?: "cover" | "contain";
}

const aspectClass = {
  "16/10": "aspect-[16/10]",
  "16/9": "aspect-video",
  "16/11": "aspect-[16/11]",
  "4/3": "aspect-[4/3]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
  "3/2": "aspect-[3/2]",
} as const;

export function Shot({
  src,
  hue = 260,
  label = "",
  aspect = "16/10",
  radius = 12,
  dark = false,
  sizes = "(min-width: 1024px) 800px, 100vw",
  priority = false,
  className,
  fit = "cover",
}: Props) {
  const [failed, setFailed] = useState(!src);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        aspectClass[aspect],
        className
      )}
      style={{
        borderRadius: radius,
        background: dark ? "#111" : "var(--bg2)",
      }}
    >
      {src && !failed ? (
        <Image
          src={src}
          alt={label}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setFailed(true)}
          className={fit === "contain" ? "object-contain" : "object-cover"}
        />
      ) : (
        <>
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(160deg, oklch(0.88 0.06 ${hue}) 0%, oklch(0.62 0.16 ${hue}) 100%)`,
            }}
          />
          <div className="absolute inset-0 bg-stripes" />
          <div
            className="absolute left-4 bottom-3 right-4 text-[11px] tracking-[0.1em] uppercase font-mono"
            style={{ color: "rgba(17,17,24,0.72)" }}
          >
            {label || "görsel"}
          </div>
        </>
      )}
    </div>
  );
}
