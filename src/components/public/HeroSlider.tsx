"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/MagneticButton";
import { RotatingWords } from "@/components/motion/RotatingWords";
import { cn } from "@/lib/utils";

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  ctaText: string | null;
  ctaUrl: string | null;
}

const ROTATING_WORDS = [
  "pazaryerleri",
  "e-ticaret",
  "B2B portallar",
  "kurye app'leri",
  "dermokozmetik",
];

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
    <section className="relative w-full overflow-hidden bg-aurora bg-noise text-white">
      {/* Grid overlay */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 75%)",
        }}
      />

      {/* Slow-spinning conic glow — decorative */}
      <div
        aria-hidden
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-25 blur-3xl spin-slow bg-conic"
      />

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-20 md:pt-28 pb-16 md:pb-24 min-h-[560px] md:min-h-[620px] flex flex-col justify-between gap-12">
          {/* Eyebrow + rotating text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            className="flex flex-col gap-8 max-w-4xl"
          >
            <div className="inline-flex items-center gap-3 text-xs font-mono tracking-[0.2em] uppercase text-white/70">
              <span className="inline-block h-px w-10 bg-white/40" />
              Yazılım grubu · İstanbul
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-[-0.02em] leading-[0.95]">
              Kurumsal ölçekte
              <br />
              <span className="text-gradient">
                <RotatingWords words={ROTATING_WORDS} interval={2600} />
              </span>
              <br />
              <span className="serif-accent text-white/85">geliştiriyoruz.</span>
            </h1>

            <p className="max-w-xl text-base md:text-lg text-white/70 leading-relaxed">
              Pazaryeri, e-ticaret, dermokozmetik, kurye operasyonları ve B2B
              platformlarında — uçtan uca ürün geliştirme, mimari danışmanlık ve
              sürdürülebilir destek.
            </p>

            <div className="flex items-center gap-3">
              <Magnetic strength={0.2}>
                <Button asChild size="lg" className="rounded-full h-12 px-6 group">
                  <Link href="/iletisim" className="gap-1.5">
                    Projenizi konuşalım
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </Button>
              </Magnetic>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="rounded-full h-12 px-6 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/markalarimiz">Markalarımız</Link>
              </Button>
            </div>
          </motion.div>

          {/* Banner thumbnail row */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={banner.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                className="grid md:grid-cols-5 gap-6 items-end"
              >
                <div className="md:col-span-3 space-y-2 max-w-lg">
                  <div className="text-xs font-mono tracking-widest uppercase text-white/50">
                    {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                  </div>
                  <h2 className="text-xl md:text-2xl font-semibold">
                    {banner.title}
                  </h2>
                  {banner.subtitle ? (
                    <p className="text-sm md:text-base text-white/65 max-w-md">
                      {banner.subtitle}
                    </p>
                  ) : null}
                  {banner.ctaText && banner.ctaUrl ? (
                    <Link
                      href={banner.ctaUrl}
                      className="inline-flex items-center gap-1 text-sm font-medium text-white mt-2 ul-reveal"
                    >
                      {banner.ctaText}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  ) : null}
                </div>

                <div className="md:col-span-2 relative aspect-[16/10] rounded-xl overflow-hidden border border-white/10 bg-white/5">
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title}
                    fill
                    priority={index === 0}
                    sizes="(min-width: 768px) 40vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl" />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Nav + dots */}
            {total > 1 ? (
              <div className="mt-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Önceki"
                    onClick={() => setIndex((i) => (i - 1 + total) % total)}
                    className="h-9 w-9 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Sonraki"
                    onClick={() => setIndex((i) => (i + 1) % total)}
                    className="h-9 w-9 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Progress bars */}
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  {banners.map((b, i) => (
                    <button
                      key={b.id}
                      type="button"
                      aria-label={`Slayt ${i + 1}`}
                      onClick={() => setIndex(i)}
                      className="flex-1 h-px relative group"
                    >
                      <span className="absolute inset-0 bg-white/20 rounded-full" />
                      <span
                        className={cn(
                          "absolute inset-y-0 left-0 bg-white rounded-full transition-all",
                          i < index ? "w-full" : i === index ? "w-0 animate-[progress_8s_linear_forwards]" : "w-0"
                        )}
                        style={{
                          animationPlayState: i === index ? "running" : "paused",
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Bottom hairline with eyebrow */}
        <div className="relative border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between text-[11px] font-mono tracking-[0.22em] uppercase text-white/50">
            <span>Est. 2017 — İstanbul</span>
            <span className="hidden md:inline">Kayarak ilerleyin ↓</span>
          </div>
        </div>
      </div>

      {/* Progress keyframe */}
      <style jsx>{`
        @keyframes progress {
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
