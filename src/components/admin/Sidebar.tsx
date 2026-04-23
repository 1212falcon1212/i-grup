"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Image as ImageIcon,
  FileText,
  Layers,
  FolderKanban,
  Briefcase,
  Mail,
  Files,
  Settings,
  LogOut,
  GalleryVerticalEnd,
  Building,
  Users,
  Newspaper,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/actions/auth";

const navItems = [
  { href: "/admin", label: "Gösterge Paneli", icon: LayoutDashboard, exact: true },
  { href: "/admin/banners", label: "Banner'lar", icon: ImageIcon },
  { href: "/admin/pages", label: "Sayfalar", icon: FileText },
  { href: "/admin/about-values", label: "Hakkımızda Kartları", icon: GalleryVerticalEnd },
  { href: "/admin/services", label: "Hizmetler", icon: Layers },
  { href: "/admin/projects", label: "Projeler", icon: FolderKanban },
  { href: "/admin/sectors", label: "Sektörler", icon: Building },
  { href: "/admin/clients", label: "Referanslar", icon: Users },
  { href: "/admin/posts", label: "Blog", icon: Newspaper },
  { href: "/admin/careers", label: "Kariyer", icon: Briefcase },
  { href: "/admin/messages", label: "Mesajlar", icon: Mail },
  { href: "/admin/media", label: "Medya", icon: Files },
  { href: "/admin/settings", label: "Ayarlar", icon: Settings },
];

export function AdminSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-sidebar text-sidebar-foreground flex flex-col h-screen sticky top-0">
      <div className="px-6 py-5 border-b border-sidebar-border">
        <Link href="/admin" className="text-lg font-semibold tracking-tight">
          i-grup <span className="text-sidebar-primary">admin</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-sidebar-border space-y-2">
        <div className="px-3 text-xs text-sidebar-foreground/60">
          Oturum: <span className="font-medium text-sidebar-foreground">{userName}</span>
        </div>
        <form action={signOutAction}>
          <Button type="submit" variant="ghost" className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" />
            Çıkış yap
          </Button>
        </form>
      </div>
    </aside>
  );
}
