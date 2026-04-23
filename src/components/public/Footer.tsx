import Link from "next/link";
import type { SiteSettings } from "@/lib/site";

function LogoBox() {
  return (
    <div
      className="w-7 h-7 rounded-[8px] shrink-0"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.62 0.18 278), oklch(0.5 0.22 310))",
      }}
    />
  );
}

export function Footer({
  settings,
  products,
}: {
  settings: SiteSettings;
  products: { slug: string; title: string }[];
}) {
  return (
    <footer
      className="bg-[#0A0A10] text-[#F7F5F0]"
      style={{ padding: "56px 0 36px" }}
    >
      <div className="container-site">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 pb-9"
          style={{ borderBottom: "1px solid rgba(247,245,240,0.12)" }}
        >
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <LogoBox />
              <div className="text-[20px] font-bold tracking-[-0.02em]">
                {settings.siteName}
              </div>
            </div>
            <p
              className="mt-3.5 text-sm leading-[1.55] max-w-[380px]"
              style={{ color: "rgba(247,245,240,0.65)" }}
            >
              {settings.footerText ??
                "İstanbul merkezli ürün stüdyosu. Eczane, kozmetik, B2B ve kurumsal yazılım için uçtan uca ürün geliştirir ve işletir."}
            </p>
          </div>

          <div>
            <div
              className="text-[12.5px] font-semibold uppercase tracking-[0.06em]"
              style={{ color: "rgba(247,245,240,0.5)" }}
            >
              Şirket
            </div>
            <ul
              className="mt-4 text-sm leading-[2]"
              style={{ color: "rgba(247,245,240,0.88)" }}
            >
              <li><Link href="/#sirket" className="hover:text-white transition-colors">Hakkımızda</Link></li>
              <li><Link href="/#kariyer" className="hover:text-white transition-colors">Kariyer</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/#referanslar" className="hover:text-white transition-colors">Referanslar</Link></li>
              <li><Link href="/iletisim" className="hover:text-white transition-colors">İletişim</Link></li>
            </ul>
          </div>

          <div>
            <div
              className="text-[12.5px] font-semibold uppercase tracking-[0.06em]"
              style={{ color: "rgba(247,245,240,0.5)" }}
            >
              Ürünler
            </div>
            <ul
              className="mt-4 text-sm leading-[2]"
              style={{ color: "rgba(247,245,240,0.88)" }}
            >
              {products.slice(0, 5).map((p) => (
                <li key={p.slug}>
                  <Link href={`/projelerimiz/${p.slug}`} className="hover:text-white transition-colors">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div
              className="text-[12.5px] font-semibold uppercase tracking-[0.06em]"
              style={{ color: "rgba(247,245,240,0.5)" }}
            >
              İletişim
            </div>
            <ul
              className="mt-4 text-sm leading-[2]"
              style={{ color: "rgba(247,245,240,0.88)" }}
            >
              {settings.email ? (
                <li>
                  <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                    {settings.email}
                  </a>
                </li>
              ) : null}
              {settings.phone ? (
                <li>
                  <a
                    href={`tel:${settings.phone.replace(/\s/g, "")}`}
                    className="hover:text-white transition-colors"
                  >
                    {settings.phone}
                  </a>
                </li>
              ) : null}
              {settings.address ? <li>{settings.address}</li> : null}
              {settings.linkedinUrl ? (
                <li>
                  <a
                    href={settings.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
        <div
          className="mt-6 flex items-center justify-between flex-wrap gap-2 text-[12.5px]"
          style={{ color: "rgba(247,245,240,0.5)" }}
        >
          <span>
            © {new Date().getFullYear()} {settings.siteName} Yazılım A.Ş.
          </span>
          <span className="flex items-center gap-2">
            <Link href="/kvkk" className="hover:text-white transition-colors">KVKK</Link>
            <span>·</span>
            <Link href="/gizlilik-politikasi" className="hover:text-white transition-colors">Gizlilik</Link>
            <span>·</span>
            <Link href="/gizlilik-politikasi" className="hover:text-white transition-colors">Çerezler</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
