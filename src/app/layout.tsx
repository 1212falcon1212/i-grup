import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { getSiteSettings } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["300", "400", "500"],
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  return {
    title: {
      default:
        s.defaultSeoTitle ??
        `${s.siteName} — Eczane, kozmetik ve B2B için ürün geliştiriyoruz`,
      template: `%s | ${s.siteName}`,
    },
    description:
      s.defaultSeoDesc ??
      s.tagline ??
      "İstanbul merkezli ürün stüdyosu. Pazaryeri, B2B tedarik, mobil uygulamalar, kurumsal muhasebe ve tüketici platformlarında uçtan uca ürün üretir.",
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
    ),
    icons: s.faviconUrl ? { icon: s.faviconUrl } : undefined,
    openGraph: {
      type: "website",
      locale: "tr_TR",
      siteName: s.siteName,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-ink selection:bg-indigo/20">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
