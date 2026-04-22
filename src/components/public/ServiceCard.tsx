import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { iconByName } from "@/components/shared/icons";

interface Props {
  slug: string;
  title: string;
  shortDesc: string;
  icon: string | null;
}

export function ServiceCard({ slug, title, shortDesc, icon }: Props) {
  const Icon = iconByName(icon);
  return (
    <Link
      href={`/hizmetlerimiz/${slug}`}
      className="group bg-background border border-border rounded-xl p-6 hover:border-primary/40 hover:shadow-sm transition-all flex flex-col h-full"
    >
      {Icon ? (
        <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-4">
          <Icon className="h-5 w-5" />
        </div>
      ) : null}
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 flex-1">{shortDesc}</p>
      <span className="inline-flex items-center gap-1 text-sm text-primary mt-4 font-medium">
        Detay <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
      </span>
    </Link>
  );
}
