import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FolderKanban,
  Layers,
  Mail,
  Image as ImageIcon,
  Briefcase,
} from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gösterge Paneli",
  robots: { index: false, follow: false },
};

async function getStats() {
  const [projects, services, banners, careers, totalMessages, unreadMessages] =
    await Promise.all([
      prisma.project.count(),
      prisma.service.count(),
      prisma.banner.count(),
      prisma.career.count({ where: { isActive: true } }),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
    ]);
  return { projects, services, banners, careers, totalMessages, unreadMessages };
}

async function getRecentMessages() {
  return prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });
}

export default async function AdminDashboardPage() {
  const [stats, recent] = await Promise.all([getStats(), getRecentMessages()]);

  const cards = [
    { label: "Projeler", value: stats.projects, icon: FolderKanban, href: "/admin/projects" },
    { label: "Hizmetler", value: stats.services, icon: Layers, href: "/admin/services" },
    { label: "Banner'lar", value: stats.banners, icon: ImageIcon, href: "/admin/banners" },
    { label: "Aktif İlan", value: stats.careers, icon: Briefcase, href: "/admin/careers" },
  ];

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Gösterge Paneli</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sitenin genel durumu ve son mesajlar.
          </p>
        </div>
        <Link
          href="/admin/messages"
          className="inline-flex items-center gap-2 text-sm"
        >
          <Mail className="h-4 w-4" />
          Mesajlar
          {stats.unreadMessages > 0 ? (
            <Badge variant="destructive">{stats.unreadMessages} okunmamış</Badge>
          ) : (
            <Badge variant="secondary">{stats.totalMessages} toplam</Badge>
          )}
        </Link>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.label} href={c.href}>
              <Card className="hover:border-primary/40 transition-colors">
                <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {c.label}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold">{c.value}</div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Son Mesajlar</CardTitle>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">Henüz mesaj yok.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((m) => (
                <li key={m.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{m.name}</span>
                      {!m.isRead ? (
                        <Badge variant="destructive" className="text-[10px]">
                          yeni
                        </Badge>
                      ) : null}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {m.subject} — {m.email}
                    </p>
                  </div>
                  <time className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(m.createdAt, "dd.MM.yyyy HH:mm", { locale: tr })}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
