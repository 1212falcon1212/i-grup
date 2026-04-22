"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
  y?: number;
  once?: boolean;
  amount?: number;
  className?: string;
  as?: "div" | "section" | "header" | "article" | "span" | "li" | "h1" | "h2" | "h3" | "p";
}

const base: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: (d: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      delay: d,
      ease: [0.2, 0.8, 0.2, 1],
    },
  }),
};

export function Reveal({
  children,
  delay = 0,
  y = 24,
  once = true,
  amount = 0.2,
  className,
  as = "div",
}: Props) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={{
        hidden: { opacity: 0, y, filter: "blur(6px)" },
        show: base.show,
      }}
      custom={delay}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealStagger({
  children,
  stagger = 0.08,
  className,
  once = true,
  amount = 0.2,
}: {
  children: ReactNode;
  stagger?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: 0.05 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  y = 20,
  className,
}: {
  children: ReactNode;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y, filter: "blur(4px)" },
        show: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
