import { getSiteSettings } from "@/lib/site";
import { PageHeader } from "@/components/admin/PageHeader";
import { SettingsForm } from "./SettingsForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ayarlar", robots: { index: false } };

export default async function SettingsPage() {
  const settings = await getSiteSettings();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Site Ayarları"
        description="Logo, iletişim bilgileri, sosyal medya, SEO varsayılanları."
      />
      <SettingsForm
        initial={{
          siteName: settings.siteName,
          logoUrl: settings.logoUrl ?? "",
          faviconUrl: settings.faviconUrl ?? "",
          tagline: settings.tagline ?? "",
          email: settings.email ?? "",
          phone: settings.phone ?? "",
          address: settings.address ?? "",
          whatsapp: settings.whatsapp ?? "",
          linkedinUrl: settings.linkedinUrl ?? "",
          instagramUrl: settings.instagramUrl ?? "",
          xUrl: settings.xUrl ?? "",
          footerText: settings.footerText ?? "",
          defaultSeoTitle: settings.defaultSeoTitle ?? "",
          defaultSeoDesc: settings.defaultSeoDesc ?? "",
          gtmId: settings.gtmId ?? "",
          statProjects: settings.statProjects,
          statClients: settings.statClients,
          statYears: settings.statYears,
        }}
      />
    </div>
  );
}
