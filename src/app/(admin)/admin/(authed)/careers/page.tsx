import Link from "next/link";
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
import { CareerRowActions } from "./CareerRowActions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kariyer", robots: { index: false } };

export default async function CareersPage() {
  const careers = await prisma.career.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-6">
      <PageHeader
        title="Kariyer İlanları"
        description="Açık pozisyonları ekleyin, pasif yapın veya silin."
        actions={
          <Button asChild>
            <Link href="/admin/careers/new">
              <Plus className="h-4 w-4 mr-1" /> Yeni İlan
            </Link>
          </Button>
        }
      />
      <div className="border border-border rounded-lg bg-background overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pozisyon</TableHead>
              <TableHead>Departman</TableHead>
              <TableHead>Lokasyon</TableHead>
              <TableHead>Tip</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="w-32" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {careers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                  Henüz ilan yok.
                </TableCell>
              </TableRow>
            ) : (
              careers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="font-medium">{c.title}</div>
                    <div className="text-xs text-muted-foreground">/{c.slug}</div>
                  </TableCell>
                  <TableCell>{c.department}</TableCell>
                  <TableCell>{c.location}</TableCell>
                  <TableCell>{c.type}</TableCell>
                  <TableCell>
                    {c.isActive ? (
                      <Badge variant="secondary">aktif</Badge>
                    ) : (
                      <Badge variant="outline">pasif</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button asChild size="icon" variant="ghost">
                        <Link href={`/admin/careers/${c.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <CareerRowActions id={c.id} isActive={c.isActive} />
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
