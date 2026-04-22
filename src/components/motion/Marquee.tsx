import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  duration?: number;
  className?: string;
  pauseOnHover?: boolean;
  fade?: boolean;
}

export function Marquee({
  children,
  duration = 40,
  className,
  pauseOnHover = true,
  fade = true,
}: Props) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        pauseOnHover && "marquee-paused",
        className
      )}
      style={{ ["--marquee-duration" as string]: `${duration}s` }}
    >
      {fade ? (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-background to-transparent" />
        </>
      ) : null}
      <div className="flex w-max marquee">
        <div className="flex items-center gap-12 pr-12">{children}</div>
        <div className="flex items-center gap-12 pr-12" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
