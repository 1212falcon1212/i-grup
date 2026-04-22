"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/misyonumuz", label: "Misyonumuz" },
  { href: "/hizmetlerimiz", label: "Hizmetlerimiz" },
  { href: "/projelerimiz", label: "Projelerimiz" },
  { href: "/kariyer", label: "Kariyer" },
  { href: "/iletisim", label: "İletişim" },
];

export function Header({
  siteName,
  logoUrl,
}: {
  siteName: string;
  logoUrl: string | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border">
      <Container className="flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={siteName}
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
          ) : (
            <span className="h-8 w-8 rounded-md bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm">
              i
            </span>
          )}
          <span className="text-lg font-semibold tracking-tight">{siteName}</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-2 text-sm rounded-md transition-colors",
                isActive(item.href)
                  ? "text-primary font-medium"
                  : "text-foreground/70 hover:text-foreground hover:bg-muted"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild className="hidden sm:flex">
            <Link href="/iletisim">Teklif Al</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menü"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </Container>

      {open ? (
        <div className="lg:hidden border-t border-border bg-background">
          <Container className="py-3 space-y-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-3 py-2 text-sm rounded-md",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground/80 hover:bg-muted"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Button asChild className="w-full mt-2">
              <Link href="/iletisim">Teklif Al</Link>
            </Button>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
