import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { PostRowActions } from "./PostRowActions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog",
  robots: { index: false, follow: false },
};

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; status?: string }>;
}) {
  const params = await searchParams;
  const where = {
    ...(params.tag ? { tag: params.tag } : {}),
    ...(params.status === "published" ? { isPublished: true } : {}),
    ...(params.status === "draft" ? { isPublished: false } : {}),
  };
  const [posts, tagsRaw] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
    }),
    prisma.post.findMany({ select: { tag: true }, distinct: ["tag"] }),
  ]);
  const tags = tagsRaw.map((t) => t.tag);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog & Haberler"
        description="Yayın yönetimi — tag filtresi, yayında/taslak durumu."
        actions={
          <Button asChild>
            <Link href="/admin/posts/new">
              <Plus className="h-4 w-4 mr-1" /> Yeni Yazı
            </Link>
          </Button>
        }
      />

      <div className="flex items-center gap-2 flex-wrap">
        <FilterChip href="/admin/posts" active={!params.tag && !params.status} label="Tümü" />
        <FilterChip
          href="/admin/posts?status=published"
          active={params.status === "published"}
          label="Yayında"
        />
        <FilterChip
          href="/admin/posts?status=draft"
          active={params.status === "draft"}
          label="Taslak"
        />
        {tags.map((t) => (
          <FilterChip
            key={t}
            href={`/admin/posts?tag=${encodeURIComponent(t)}`}
            active={params.tag === t}
            label={t}
          />
        ))}
      </div>

      <div className="border border-border rounded-lg bg-background overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16" />
              <TableHead>Başlık</TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-muted-foreground"
                >
                  Yazı bulunamadı.
                </TableCell>
              </TableRow>
            ) : (
              posts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="relative h-10 w-16 bg-muted rounded overflow-hidden">
                      {p.coverImage ? (
                        <Image
                          src={p.coverImage}
                          alt={p.title}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{p.title}</div>
                    <div className="text-xs text-muted-foreground">
                      /{p.slug}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{p.tag}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(p.publishedAt, "dd.MM.yyyy", { locale: tr })}
                  </TableCell>
                  <TableCell>
                    {p.isPublished ? (
                      <Badge variant="secondary">yayında</Badge>
                    ) : (
                      <Badge variant="outline">taslak</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button asChild size="icon" variant="ghost">
                        <Link href={`/admin/posts/${p.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <PostRowActions
                        id={p.id}
                        isPublished={p.isPublished}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function FilterChip({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`text-xs px-3 py-1.5 rounded-md border ${
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "border-border bg-background hover:bg-muted"
      }`}
    >
      {label}
    </Link>
  );
}
