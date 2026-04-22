import { cn } from "@/lib/utils";

interface Props {
  eyebrow: string;
  title: string;
  lead?: string;
  id?: string;
  className?: string;
}

export function SectionHeader({ eyebrow, title, lead, id, className }: Props) {
  return (
    <div
      id={id}
      className={cn(
        "grid md:grid-cols-2 gap-8 md:gap-12 items-end mb-12",
        className
      )}
    >
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2
          className="h-display mt-3"
          style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", maxWidth: 600 }}
        >
          {title}
        </h2>
      </div>
      {lead ? (
        <p className="text-base md:text-[17px] leading-[1.6] text-ink2 max-w-prose">
          {lead}
        </p>
      ) : (
        <span />
      )}
    </div>
  );
}
