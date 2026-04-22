"use client";

import { cn } from "@/lib/utils";
import { ICONS } from "@/components/shared/icons";

export { iconByName } from "@/components/shared/icons";

export function IconPicker({
  value,
  onChange,
}: {
  value?: string | null;
  onChange: (name: string) => void;
}) {
  return (
    <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 border border-border rounded-md p-2">
      {ICONS.map(({ name, Icon }) => (
        <button
          key={name}
          type="button"
          onClick={() => onChange(name)}
          className={cn(
            "h-10 w-10 flex items-center justify-center rounded-md border transition-colors",
            value === name
              ? "border-primary bg-primary/10 text-primary"
              : "border-transparent hover:bg-muted"
          )}
          title={name}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
