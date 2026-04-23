"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/#sirket", label: "Şirket" },
  { href: "/#projeler", label: "Projeler" },
  { href: "/#sektorler", label: "Sektörler" },
  { href: "/#referanslar", label: "Referanslar" },
  { href: "/blog", label: "Blog" },
  { href: "/#kariyer", label: "Kariyer" },
  { href: "/iletisim", label: "İletişim" },
];

function Logo({
  siteName,
  logoUrl,
  className,
}: {
  siteName: string;
  logoUrl?: string | null;
  className?: string;
}) {
  if (logoUrl) {
    return (
      <span
        className={cn(
          "relative block h-10 w-[130px] shrink-0 overflow-hidden",
          className
        )}
      >
        <Image
          src={logoUrl}
          alt={`${siteName} logo`}
          fill
          sizes="130px"
          unoptimized
          className="object-contain"
        />
      </span>
    );
  }

  return (
    <div
      className={cn(
        "logo-box relative rounded-[8px] w-7 h-7 shrink-0",
        className
      )}
    >
      <span className="absolute left-[10px] top-[6px] w-[4px] h-[12px] rounded-[2px] bg-[#F7F5F0]" />
      <span className="absolute left-[17px] top-[13px] w-[4px] h-[5px] rounded-[2px] bg-[#F7F5F0]" />
    </div>
  );
}

export function Header({
  siteName,
  logoUrl,
}: {
  siteName: string;
  logoUrl?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background,backdrop-filter,border-color,padding] duration-250",
        scrolled
          ? "bg-[rgba(247,245,240,0.88)] backdrop-blur-[14px] border-b border-rule"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="container-site flex items-center justify-between py-[18px]">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <Logo siteName={siteName} logoUrl={logoUrl} />
          {!logoUrl ? (
            <span className="text-[17px] font-bold tracking-[-0.02em] text-ink">
              {siteName}
            </span>
          ) : null}
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink2 hover:text-ink transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/iletisim"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium px-[18px] py-[10px] rounded-full bg-ink text-[#F7F5F0] hover:opacity-90 transition-opacity"
          >
            İletişime geç <span className="text-base leading-none">→</span>
          </Link>
          <button
            className="lg:hidden h-10 w-10 flex items-center justify-center text-ink"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menü"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="lg:hidden border-t border-rule bg-bg">
          <div className="container-site py-3 flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-2 py-2 text-sm text-ink2 hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/iletisim"
              onClick={() => setOpen(false)}
              className="mt-2 text-center text-sm font-medium px-[18px] py-[12px] rounded-full bg-ink text-[#F7F5F0]"
            >
              İletişime geç →
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
