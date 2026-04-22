"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  words: string[];
  interval?: number;
  className?: string;
}

export function RotatingWords({ words, interval = 2400, className }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      interval
    );
    return () => clearInterval(id);
  }, [words.length, interval]);

  // Match widest word so layout doesn't shift
  const longest = words.reduce((a, b) => (a.length >= b.length ? a : b), "");

  return (
    <span className={cn("relative inline-grid align-baseline", className)}>
      <span className="col-start-1 row-start-1 invisible" aria-hidden>
        {longest}
      </span>
      <span className="col-start-1 row-start-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={words[index]}
            initial={{ y: "110%", opacity: 0, filter: "blur(6px)" }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
            exit={{ y: "-110%", opacity: 0, filter: "blur(6px)" }}
            transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
            className="inline-block serif-accent"
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
