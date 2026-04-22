import { cn } from "@/lib/utils";

/**
 * Decorative blueprint grid. Parent must be positioned (relative).
 */
export function GridBackground({
  className,
  variant = "small",
}: {
  className?: string;
  variant?: "small" | "large";
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 pointer-events-none",
        variant === "small" ? "bg-grid-small" : "bg-grid",
        "bg-grid-fade",
        className
      )}
    />
  );
}

/**
 * Thin crosshair markers at corners — decorative.
 */
export function Crosshairs({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={cn("absolute h-4 w-4 text-primary/40", className)}
    >
      <line x1="12" y1="0" x2="12" y2="24" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="12" x2="24" y2="12" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
