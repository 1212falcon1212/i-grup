import { getSiteSettings } from "@/lib/site";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  return (
    <>
      <Header siteName={settings.siteName} logoUrl={settings.logoUrl} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
