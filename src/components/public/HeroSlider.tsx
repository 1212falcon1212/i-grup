"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  ctaText: string | null;
  ctaUrl: string | null;
}

export function HeroSlider({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);
  const total = banners.length;

  useEffect(() => {
    if (total < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % total), 8000);
    return () => clearInterval(t);
  }, [total]);

  if (total === 0) return null;
  const banner = banners[index];

  return (
    <section className="relative w-full aspect-[21/9] md:aspect-[21/8] min-h-[360px] md:min-h-[480px] overflow-hidden bg-muted">
      <AnimatePresence mode="wait">
        <motion.div
          key={banner.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <Image
            src={banner.imageUrl}
            alt={banner.title}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl w-full mx-auto px-4 md:px-6 lg:px-8">
              <div className="max-w-2xl text-white">
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight"
                >
                  {banner.title}
                </motion.h1>
                {banner.subtitle ? (
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                    className="mt-4 text-base md:text-xl text-white/85 max-w-xl"
                  >
                    {banner.subtitle}
                  </motion.p>
                ) : null}
                {banner.ctaText && banner.ctaUrl ? (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.35, duration: 0.5 }}
                    className="mt-6"
                  >
                    <Button asChild size="lg">
                      <Link href={banner.ctaUrl}>{banner.ctaText}</Link>
                    </Button>
                  </motion.div>
                ) : null}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {total > 1 ? (
        <>
          <button
            type="button"
            aria-label="Önceki"
            onClick={() => setIndex((i) => (i - 1 + total) % total)}
            className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Sonraki"
            onClick={() => setIndex((i) => (i + 1) % total)}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {banners.map((b, i) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Slayt ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-8 bg-white" : "w-1.5 bg-white/50"
                )}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
