"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProjectGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(
    () => setActive((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );
  const prev = useCallback(
    () =>
      setActive((i) =>
        i === null ? null : (i - 1 + images.length) % images.length
      ),
    [images.length]
  );

  useEffect(() => {
    if (active === null) return;
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [active, close, next, prev]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((url, i) => (
          <button
            key={url}
            type="button"
            onClick={() => setActive(i)}
            className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted group"
          >
            <Image
              src={url}
              alt=""
              fill
              sizes="(min-width: 1024px) 400px, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {active !== null ? (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={close}
        >
          <button
            type="button"
            aria-label="Kapat"
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
          >
            <X className="h-5 w-5" />
          </button>
          {images.length > 1 ? (
            <button
              type="button"
              aria-label="Önceki"
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          ) : null}
          <div
            className="relative w-[92vw] h-[80vh] max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[active]}
              alt=""
              fill
              sizes="92vw"
              className={cn("object-contain")}
              priority
            />
          </div>
          {images.length > 1 ? (
            <button
              type="button"
              aria-label="Sonraki"
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
