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
  type LucideIcon,
} from "lucide-react";

export const ICONS: { name: string; Icon: LucideIcon }[] = [
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

export function iconByName(name?: string | null): LucideIcon | null {
  if (!name) return null;
  const match = ICONS.find((i) => i.name === name);
  return match?.Icon ?? null;
}
