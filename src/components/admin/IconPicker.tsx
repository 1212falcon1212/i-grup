"use client";

import {
  Store,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Building2,
  Truck,
  Package,
  Boxes,
  Users,
  Briefcase,
  Layers,
  Zap,
  Rocket,
  Cpu,
  Database,
  Code2,
  Globe,
  Smartphone,
  Target,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = [
  { name: "Store", Icon: Store },
  { name: "ShoppingBag", Icon: ShoppingBag },
  { name: "ShoppingCart", Icon: ShoppingCart },
  { name: "Sparkles", Icon: Sparkles },
  { name: "Building2", Icon: Building2 },
  { name: "Truck", Icon: Truck },
  { name: "Package", Icon: Package },
  { name: "Boxes", Icon: Boxes },
  { name: "Users", Icon: Users },
  { name: "Briefcase", Icon: Briefcase },
  { name: "Layers", Icon: Layers },
  { name: "Zap", Icon: Zap },
  { name: "Rocket", Icon: Rocket },
  { name: "Cpu", Icon: Cpu },
  { name: "Database", Icon: Database },
  { name: "Code2", Icon: Code2 },
  { name: "Globe", Icon: Globe },
  { name: "Smartphone", Icon: Smartphone },
  { name: "Target", Icon: Target },
  { name: "BarChart3", Icon: BarChart3 },
];

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

export function iconByName(name?: string | null) {
  if (!name) return null;
  const match = ICONS.find((i) => i.name === name);
  return match?.Icon ?? null;
}
