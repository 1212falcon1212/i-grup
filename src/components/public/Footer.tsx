import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { Container } from "@/components/shared/Container";
import type { SiteSettings } from "@/lib/site";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.37-1.852 3.602 0 4.266 2.37 4.266 5.455v6.288zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.543C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.311.975.975 1.249 2.242 1.311 3.608.058 1.266.069 1.646.069 4.849 0 3.205-.012 3.584-.069 4.849-.062 1.366-.336 2.633-1.311 3.608-.975.975-2.242 1.249-3.608 1.311-1.266.058-1.645.07-4.85.07-3.204 0-3.584-.012-4.849-.07-1.366-.062-2.633-.336-3.608-1.311-.975-.975-1.249-2.242-1.311-3.608C2.175 15.647 2.163 15.268 2.163 12c0-3.204.012-3.583.07-4.849.062-1.366.336-2.633 1.311-3.608.975-.975 2.242-1.249 3.608-1.311C8.417 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.773.13 4.548.41 3.515 1.443 2.482 2.476 2.202 3.7 2.144 4.98 2.085 6.26 2.072 6.669 2.072 12c0 5.331.013 5.74.072 7.02.058 1.28.338 2.504 1.371 3.537 1.033 1.033 2.257 1.313 3.537 1.371 1.28.059 1.689.072 7.02.072s5.74-.013 7.02-.072c1.28-.058 2.504-.338 3.537-1.371 1.033-1.033 1.313-2.257 1.371-3.537.059-1.28.072-1.689.072-7.02s-.013-5.74-.072-7.02c-.058-1.28-.338-2.504-1.371-3.537C19.452.41 18.227.13 16.948.072 15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-24 border-t border-border bg-muted/30">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-3">
              {settings.logoUrl ? (
                <Image
                  src={settings.logoUrl}
                  alt={settings.siteName}
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain"
                />
              ) : (
                <span className="h-8 w-8 rounded-md bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm">
                  i
                </span>
              )}
              <span className="text-lg font-semibold">{settings.siteName}</span>
            </Link>
            {settings.footerText ? (
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                {settings.footerText}
              </p>
            ) : null}
            <div className="flex items-center gap-3 mt-4">
              {settings.linkedinUrl ? (
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon className="h-5 w-5" />
                </a>
              ) : null}
              {settings.instagramUrl ? (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="h-5 w-5" />
                </a>
              ) : null}
              {settings.xUrl ? (
                <a
                  href={settings.xUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                  aria-label="X"
                >
                  <XIcon className="h-5 w-5" />
                </a>
              ) : null}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Kurumsal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/hakkimizda" className="hover:text-foreground">Hakkımızda</Link></li>
              <li><Link href="/misyonumuz" className="hover:text-foreground">Misyonumuz</Link></li>
              <li><Link href="/kariyer" className="hover:text-foreground">Kariyer</Link></li>
              <li><Link href="/iletisim" className="hover:text-foreground">İletişim</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Çözümler</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/hizmetlerimiz" className="hover:text-foreground">Hizmetlerimiz</Link></li>
              <li><Link href="/projelerimiz" className="hover:text-foreground">Projelerimiz</Link></li>
              <li><Link href="/kvkk" className="hover:text-foreground">KVKK</Link></li>
              <li><Link href="/gizlilik-politikasi" className="hover:text-foreground">Gizlilik</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center text-sm text-muted-foreground">
          {settings.email ? (
            <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:text-foreground">
              <Mail className="h-4 w-4" /> {settings.email}
            </a>
          ) : null}
          {settings.phone ? (
            <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-foreground">
              <Phone className="h-4 w-4" /> {settings.phone}
            </a>
          ) : null}
          {settings.address ? (
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="line-clamp-1">{settings.address}</span>
            </span>
          ) : null}
          <span className="md:ml-auto">
            © {new Date().getFullYear()} {settings.siteName}. Tüm hakları saklıdır.
          </span>
        </div>
      </Container>
    </footer>
  );
}
