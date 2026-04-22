"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { motion } from "framer-motion";

interface Props {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function Counter({ value, suffix = "+", duration = 1.6, className }: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 90, damping: 22, mass: 0.9 });
  const formatted = useTransform(spring, (n) => Math.floor(n).toLocaleString("tr-TR"));
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (inView) {
      const start = performance.now();
      const animate = (now: number) => {
        const elapsed = (now - start) / 1000;
        if (elapsed >= duration) {
          mv.set(value);
          return;
        }
        const t = elapsed / duration;
        const eased = 1 - Math.pow(1 - t, 3);
        mv.set(value * eased);
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [inView, value, duration, mv]);

  useEffect(() => {
    const unsub = formatted.on("change", (v) => setDisplay(v));
    return () => unsub();
  }, [formatted]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      <motion.span>{display}</motion.span>
      {suffix ? <span className="text-primary">{suffix}</span> : null}
    </span>
  );
}
