import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/site";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, products] = await Promise.all([
    getSiteSettings(),
    prisma.project.findMany({
      select: { slug: true, title: true },
      orderBy: { order: "asc" },
      take: 5,
    }),
  ]);
  return (
    <>
      <Header siteName={settings.siteName} logoUrl={settings.logoUrl} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} products={products} />
    </>
  );
}
