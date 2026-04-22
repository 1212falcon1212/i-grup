import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface Props {
  slug: string;
  title: string;
  category: string;
  coverImage: string;
  year?: number | null;
}

export function ProjectCard({ slug, title, category, coverImage, year }: Props) {
  return (
    <Link
      href={`/projelerimiz/${slug}`}
      className="group block bg-background border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-sm transition-all"
    >
      <div className="relative aspect-[16/10] bg-muted overflow-hidden">
        <Image
          src={coverImage}
          alt={title}
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-3 left-3">
          <Badge className="bg-background/90 text-foreground hover:bg-background/90">
            {category}
          </Badge>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-base md:text-lg font-semibold tracking-tight line-clamp-1">
          {title}
        </h3>
        {year ? (
          <p className="text-sm text-muted-foreground mt-1">{year}</p>
        ) : null}
      </div>
    </Link>
  );
}
