"use client";

import type { ReactNode, MouseEvent } from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  className?: string;
  strength?: number;
  asChild?: boolean;
}

/**
 * Wrapper that produces a subtle magnetic pull toward the cursor.
 * Place a single <Button> or <a> inside.
 */
export function Magnetic({ children, className, strength = 0.25 }: Props) {
  const wrapRef = useRef<HTMLSpanElement | null>(null);
  const raf = useRef<number | null>(null);

  function handleMove(e: MouseEvent<HTMLSpanElement>) {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });
  }

  function handleLeave() {
    const el = wrapRef.current;
    if (!el) return;
    if (raf.current) cancelAnimationFrame(raf.current);
    el.style.transform = "translate(0, 0)";
  }

  return (
    <span
      ref={wrapRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn("inline-block transition-transform duration-300 ease-out will-change-transform", className)}
    >
      {children}
    </span>
  );
}
