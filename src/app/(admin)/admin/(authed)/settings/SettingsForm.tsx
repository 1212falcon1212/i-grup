"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { updateSettings } from "@/actions/settings";
import type { SettingsFormValues } from "@/lib/validators/settings";

type Values = {
  siteName: string;
  logoUrl: string;
  faviconUrl: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  whatsapp: string;
  linkedinUrl: string;
  instagramUrl: string;
  xUrl: string;
  footerText: string;
  defaultSeoTitle: string;
  defaultSeoDesc: string;
  gtmId: string;
  statProjects: number;
  statSectors: number;
  statYears: number;
  statEndUsers: string;
  teamSize: number;
  foundedYear: number;
  heroHeading: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroStatusText: string;
  heroImageUrl: string;
  aboutHeading: string;
  aboutLead: string;
  aboutImage1: string;
  aboutImage2: string;
  aboutImage3: string;
  careersHeading: string;
  careersLead: string;
  careersImage: string;
  contactHeading: string;
  contactHighlight: string;
  contactLead: string;
  officeHours: string;
  heroCtaPrimaryLabel: string;
  heroCtaPrimaryUrl: string;
  heroCtaSecondaryLabel: string;
  heroCtaSecondaryUrl: string;
  heroOverlayLabel: string;
  heroOverlayTitle: string;
  heroOverlayDescription: string;
  careersEmptyTitle: string;
  careersEmptyText: string;
  careersApplyLabel: string;
  projectsEyebrow: string;
  projectsTitle: string;
  projectsLead: string;
  sectorsEyebrow: string;
  sectorsTitle: string;
  sectorsLead: string;
  clientsEyebrow: string;
  clientsTitle: string;
  clientsLead: string;
  blogEyebrow: string;
  blogTitle: string;
  blogLead: string;
};

export function SettingsForm({ initial }: { initial: Values }) {
  const router = useRouter();
  const [v, setV] = useState<Values>(initial);
  const [isPending, startTransition] = useTransition();

  function set<K extends keyof Values>(k: K, val: Values[K]) {
    setV((p) => ({ ...p, [k]: val }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await updateSettings(v as SettingsFormValues);
        toast.success("Ayarlar kaydedildi");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Kaydedilemedi");
      }
    });
  }

  const TextField = ({
    label,
    k,
    type = "text",
    textarea,
    rows,
  }: {
    label: string;
    k: keyof Values;
    type?: string;
    textarea?: boolean;
    rows?: number;
  }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      {textarea ? (
        <Textarea
          rows={rows ?? 2}
          value={String(v[k] ?? "")}
          onChange={(e) => set(k, e.target.value as Values[typeof k])}
        />
      ) : (
        <Input
          type={type}
          value={String(v[k] ?? "")}
          onChange={(e) => {
            const raw = e.target.value;
            const parsed =
              type === "number" ? (raw === "" ? 0 : Number(raw)) : raw;
            set(k, parsed as Values[typeof k]);
          }}
        />
      )}
    </div>
  );

  const ImageField = ({ label, k }: { label: string; k: keyof Values }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <MediaPicker
        value={String(v[k] ?? "")}
        onChange={(url) => set(k, (url ?? "") as Values[typeof k])}
      />
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-8 max-w-3xl">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Genel
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <TextField label="Site adı" k="siteName" />
          <TextField label="Tagline" k="tagline" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <ImageField label="Logo" k="logoUrl" />
          <ImageField label="Favicon" k="faviconUrl" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          İletişim
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <TextField label="E-posta" k="email" type="email" />
          <TextField label="Telefon" k="phone" />
          <TextField label="WhatsApp" k="whatsapp" />
          <TextField label="Adres" k="address" />
          <TextField label="Çalışma saatleri" k="officeHours" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Sosyal Medya
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <TextField label="LinkedIn URL" k="linkedinUrl" />
          <TextField label="Instagram URL" k="instagramUrl" />
          <TextField label="X (Twitter) URL" k="xUrl" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Hero Bölümü
        </h2>
        <div className="grid gap-4">
          <TextField label="Status metni (hero üst rozet)" k="heroStatusText" />
          <TextField label="Hero başlığı" k="heroHeading" textarea rows={2} />
          <TextField
            label="Vurgu (başlığın içinden tam kelime/cümle)"
            k="heroHighlight"
          />
          <TextField label="Hero altı paragraf" k="heroSubtitle" textarea rows={3} />
          <ImageField label="Hero görseli (sağ portrait)" k="heroImageUrl" />
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          <TextField label="Stat: proje" k="statProjects" type="number" />
          <TextField label="Stat: sektör" k="statSectors" type="number" />
          <TextField label="Stat: yıl" k="statYears" type="number" />
          <TextField label="Stat: son kullanıcı" k="statEndUsers" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <TextField label="Ekip büyüklüğü" k="teamSize" type="number" />
          <TextField label="Kuruluş yılı" k="foundedYear" type="number" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <TextField
            label="Birincil CTA metni (dolu buton)"
            k="heroCtaPrimaryLabel"
          />
          <TextField
            label="Birincil CTA linki"
            k="heroCtaPrimaryUrl"
          />
          <TextField
            label="İkincil CTA metni (outline buton)"
            k="heroCtaSecondaryLabel"
          />
          <TextField
            label="İkincil CTA linki"
            k="heroCtaSecondaryUrl"
          />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <TextField label="Overlay rozet (EKİP vb.)" k="heroOverlayLabel" />
          <TextField label="Overlay başlık" k="heroOverlayTitle" />
          <TextField
            label="Overlay açıklama"
            k="heroOverlayDescription"
            textarea
            rows={2}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Hakkımızda
        </h2>
        <div className="grid gap-4">
          <TextField label="Başlık" k="aboutHeading" textarea rows={2} />
          <TextField label="Lead paragraf" k="aboutLead" textarea rows={3} />
          <div className="grid md:grid-cols-3 gap-4">
            <ImageField label="Görsel 1 (geniş)" k="aboutImage1" />
            <ImageField label="Görsel 2 (kare)" k="aboutImage2" />
            <ImageField label="Görsel 3 (kare)" k="aboutImage3" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Kariyer & İletişim
        </h2>
        <div className="grid gap-4">
          <TextField label="Kariyer başlığı" k="careersHeading" />
          <TextField label="Kariyer lead" k="careersLead" textarea rows={2} />
          <ImageField label="Kariyer görseli" k="careersImage" />
          <TextField
            label="Boş ilan başlığı (açık pozisyon yokken)"
            k="careersEmptyTitle"
          />
          <TextField
            label="Boş ilan metni"
            k="careersEmptyText"
            textarea
            rows={2}
          />
          <TextField label="Spontan başvuru buton metni" k="careersApplyLabel" />
          <TextField label="İletişim başlığı" k="contactHeading" textarea rows={2} />
          <TextField label="İletişim vurgu (başlık içinden)" k="contactHighlight" />
          <TextField label="İletişim lead" k="contactLead" textarea rows={3} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Ana Sayfa Bölüm Başlıkları
        </h2>
        <p className="text-xs text-muted-foreground -mt-2">
          Projeler / Sektörler / Referanslar / Blog bölümlerinin üst yazıları.
          Boş bırakılırsa kod içindeki varsayılan metin gösterilir.
        </p>

        <div className="space-y-6">
          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-2">PROJELER</div>
            <div className="grid md:grid-cols-[1fr_2fr] gap-3">
              <TextField label="Eyebrow" k="projectsEyebrow" />
              <TextField label="Başlık" k="projectsTitle" />
            </div>
            <div className="mt-3">
              <TextField label="Lead paragraf" k="projectsLead" textarea rows={2} />
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-2">SEKTÖRLER</div>
            <div className="grid md:grid-cols-[1fr_2fr] gap-3">
              <TextField label="Eyebrow" k="sectorsEyebrow" />
              <TextField label="Başlık" k="sectorsTitle" />
            </div>
            <div className="mt-3">
              <TextField label="Lead paragraf" k="sectorsLead" textarea rows={2} />
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-2">REFERANSLAR</div>
            <div className="grid md:grid-cols-[1fr_2fr] gap-3">
              <TextField label="Eyebrow" k="clientsEyebrow" />
              <TextField label="Başlık" k="clientsTitle" />
            </div>
            <div className="mt-3">
              <TextField label="Lead paragraf" k="clientsLead" textarea rows={2} />
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-2">BLOG</div>
            <div className="grid md:grid-cols-[1fr_2fr] gap-3">
              <TextField label="Eyebrow" k="blogEyebrow" />
              <TextField label="Başlık" k="blogTitle" />
            </div>
            <div className="mt-3">
              <TextField label="Lead paragraf" k="blogLead" textarea rows={2} />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          SEO & Analytics
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <TextField label="Varsayılan SEO başlık" k="defaultSeoTitle" />
          <TextField label="Varsayılan SEO açıklama" k="defaultSeoDesc" />
        </div>
        <TextField label="GTM ID (Google Tag Manager)" k="gtmId" />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Footer
        </h2>
        <TextField label="Footer metni" k="footerText" textarea rows={3} />
      </section>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>
    </form>
  );
}
