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
import { Plus, Star, Pencil } from "lucide-react";
import { ProjectRowActions } from "./ProjectRowActions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Projeler", robots: { index: false } };

export default async function ProjectsListPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; featured?: string }>;
}) {
  const params = await searchParams;
  const where = {
    ...(params.kategori ? { category: params.kategori } : {}),
    ...(params.featured === "1" ? { isFeatured: true } : {}),
  };
  const [projects, allCategories] = await Promise.all([
    prisma.project.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    }),
    prisma.project.findMany({ select: { category: true }, distinct: ["category"] }),
  ]);
  const categories = allCategories.map((c) => c.category);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projeler"
        description="15 portföy projesini yönetin. Kategori ve öne çıkan filtreleri kullanabilirsiniz."
        actions={
          <Button asChild>
            <Link href="/admin/projects/new">
              <Plus className="h-4 w-4 mr-1" /> Yeni Proje
            </Link>
          </Button>
        }
      />
      <div className="flex items-center gap-2 flex-wrap">
        <Link
          href="/admin/projects"
          className={`text-xs px-3 py-1.5 rounded-md border ${
            !params.kategori && !params.featured
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border bg-background hover:bg-muted"
          }`}
        >
          Tümü
        </Link>
        <Link
          href="/admin/projects?featured=1"
          className={`text-xs px-3 py-1.5 rounded-md border ${
            params.featured === "1"
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border bg-background hover:bg-muted"
          }`}
        >
          <Star className="h-3 w-3 inline -mt-0.5" /> Öne çıkan
        </Link>
        {categories.map((c) => (
          <Link
            key={c}
            href={`/admin/projects?kategori=${encodeURIComponent(c)}`}
            className={`text-xs px-3 py-1.5 rounded-md border ${
              params.kategori === c
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border bg-background hover:bg-muted"
            }`}
          >
            {c}
          </Link>
        ))}
      </div>
      <div className="border border-border rounded-lg bg-background overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16" />
              <TableHead>Başlık</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Yıl</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="w-32" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                  Proje bulunamadı.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="relative h-10 w-16 bg-muted rounded overflow-hidden">
                      <Image
                        src={p.coverImage}
                        alt={p.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{p.title}</div>
                    <div className="text-xs text-muted-foreground">/{p.slug}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{p.category}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.year ?? "—"}</TableCell>
                  <TableCell>
                    {p.isFeatured ? (
                      <Badge variant="secondary">
                        <Star className="h-3 w-3 mr-1" />
                        öne çıkan
                      </Badge>
                    ) : (
                      <Badge variant="outline">standart</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button asChild size="icon" variant="ghost">
                        <Link href={`/admin/projects/${p.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <ProjectRowActions id={p.id} isFeatured={p.isFeatured} />
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
