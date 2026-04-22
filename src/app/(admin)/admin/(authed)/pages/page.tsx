import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export const dynamic = "force-dynamic";

export const metadata = { title: "Sayfalar", robots: { index: false } };

export default async function PagesListPage() {
  const pages = await prisma.page.findMany({ orderBy: { slug: "asc" } });
  return (
    <div className="space-y-6">
      <PageHeader
        title="Sayfalar"
        description="Statik sayfa içeriklerini (Hakkımızda, KVKK vb.) düzenleyin."
      />
      <div className="border border-border rounded-lg bg-background overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Başlık</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Son güncelleme</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.title}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  /{p.slug}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {format(p.updatedAt, "dd.MM.yyyy HH:mm", { locale: tr })}
                </TableCell>
                <TableCell>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/pages/${p.id}`}>Düzenle</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
