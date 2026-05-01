"use client";

import { createContext, useContext, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  blogEyebrow: string;
  blogTitle: string;
  blogLead: string;
  navBrandsLabel: string;
  navSectorsLabel: string;
  navBlogLabel: string;
  navCareersLabel: string;
  navContactLabel: string;
  headerCtaLabel: string;
  heroImageLabel: string;
  heroStatProjectsLabel: string;
  heroStatSectorsLabel: string;
  heroStatUsersLabel: string;
  brandsFilterAllLabel: string;
  brandsCountSingular: string;
  brandsCountPlural: string;
  brandCardCtaLabel: string;
  brandCardExternalLabel: string;
  brandCardMetaPrefix: string;
  brandCardPendingLabel: string;
  blogReadFullLabel: string;
  blogReadLabel: string;
  blogAllPostsLabel: string;
  blogFeaturedImageLabel: string;
  careersEyebrow: string;
  careersOpenPositionsLabel: string;
  careersImageLabel: string;
  contactEyebrow: string;
  contactEmailLabel: string;
  contactPhoneLabel: string;
  contactOfficeLabel: string;
  contactHoursLabel: string;
  contactFormTitle: string;
  contactNameLabel: string;
  contactNamePlaceholder: string;
  contactEmailFieldLabel: string;
  contactEmailPlaceholder: string;
  contactCompanyLabel: string;
  contactCompanyPlaceholder: string;
  contactMessageLabel: string;
  contactMessagePlaceholder: string;
  contactSubmitLabel: string;
  contactSendingLabel: string;
  contactSuccessLabel: string;
  contactPrivacyText: string;
  contactSubject: string;
  footerCompanyHeading: string;
  footerBrandsHeading: string;
  footerContactHeading: string;
  footerAboutLabel: string;
  footerCopyrightSuffix: string;
  footerKvkkLabel: string;
  footerPrivacyLabel: string;
  footerCookiesLabel: string;
};

type SettingsFormContextValue = {
  values: Values;
  setValue: <K extends keyof Values>(k: K, val: Values[K]) => void;
};

const SettingsFormContext = createContext<SettingsFormContextValue | null>(
  null
);

function useSettingsForm() {
  const ctx = useContext(SettingsFormContext);
  if (!ctx) {
    throw new Error("Settings fields must be used inside SettingsForm");
  }
  return ctx;
}

function TextField({
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
}) {
  const { values, setValue } = useSettingsForm();

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {textarea ? (
        <Textarea
          rows={rows ?? 2}
          value={String(values[k] ?? "")}
          onChange={(e) => setValue(k, e.target.value as Values[typeof k])}
        />
      ) : (
        <Input
          type={type}
          value={String(values[k] ?? "")}
          onChange={(e) => {
            const raw = e.target.value;
            const parsed =
              type === "number" ? (raw === "" ? 0 : Number(raw)) : raw;
            setValue(k, parsed as Values[typeof k]);
          }}
        />
      )}
    </div>
  );
}

function ImageField({
  label,
  k,
}: {
  label: string;
  k: keyof Values;
}) {
  const { values, setValue } = useSettingsForm();

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <MediaPicker
        value={String(values[k] ?? "")}
        onChange={(url) => setValue(k, (url ?? "") as Values[typeof k])}
      />
    </div>
  );
}

function SettingsPanel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-card p-5 md:p-6 space-y-5">
      <div>
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function FieldGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </div>
      {children}
    </div>
  );
}

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

  return (
    <SettingsFormContext.Provider value={{ values: v, setValue: set }}>
      <form onSubmit={submit} className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <div className="sticky top-0 z-10 -mx-1 bg-background/95 px-1 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <TabsList className="h-auto w-full flex-wrap justify-start">
              <TabsTrigger value="general">Genel</TabsTrigger>
              <TabsTrigger value="homepage">Ana Sayfa</TabsTrigger>
              <TabsTrigger value="brands">Markalar</TabsTrigger>
              <TabsTrigger value="contact">İletişim</TabsTrigger>
              <TabsTrigger value="footer">Footer</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="general" className="mt-6 space-y-6">
            <SettingsPanel
              title="Kimlik"
              description="Site adı, kısa açıklama ve ana görseller."
            >
              <div className="grid md:grid-cols-2 gap-4">
                <TextField label="Site adı" k="siteName" />
                <TextField label="Tagline" k="tagline" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <ImageField label="Logo" k="logoUrl" />
                <ImageField label="Favicon" k="faviconUrl" />
              </div>
            </SettingsPanel>

            <SettingsPanel
              title="Menü"
              description="Public header içinde görünen bağlantı ve buton metinleri."
            >
              <div className="grid md:grid-cols-3 gap-4">
                <TextField label="Markalar linki" k="navBrandsLabel" />
                <TextField label="Sektörler linki" k="navSectorsLabel" />
                <TextField label="Blog linki" k="navBlogLabel" />
                <TextField label="Kariyer linki" k="navCareersLabel" />
                <TextField label="İletişim linki" k="navContactLabel" />
                <TextField label="Header CTA" k="headerCtaLabel" />
              </div>
            </SettingsPanel>

            <SettingsPanel title="Sosyal Medya">
              <div className="grid md:grid-cols-3 gap-4">
                <TextField label="LinkedIn URL" k="linkedinUrl" />
                <TextField label="Instagram URL" k="instagramUrl" />
                <TextField label="X (Twitter) URL" k="xUrl" />
              </div>
            </SettingsPanel>
          </TabsContent>

          <TabsContent value="homepage" className="mt-6 space-y-6">
            <SettingsPanel
              title="Hero"
              description="Ana sayfanın ilk ekranındaki başlık, açıklama, görsel ve CTA alanları."
            >
              <div className="grid gap-4">
                <TextField label="Status metni" k="heroStatusText" />
                <TextField label="Hero başlığı" k="heroHeading" textarea rows={2} />
                <TextField
                  label="Vurgu (başlığın içinden tam kelime/cümle)"
                  k="heroHighlight"
                />
                <TextField label="Hero alt paragraf" k="heroSubtitle" textarea rows={3} />
                <ImageField label="Hero görseli" k="heroImageUrl" />
              </div>

              <FieldGroup title="CTA">
                <div className="grid md:grid-cols-2 gap-4">
                  <TextField label="Birincil CTA metni" k="heroCtaPrimaryLabel" />
                  <TextField label="Birincil CTA linki" k="heroCtaPrimaryUrl" />
                  <TextField label="İkincil CTA metni" k="heroCtaSecondaryLabel" />
                  <TextField label="İkincil CTA linki" k="heroCtaSecondaryUrl" />
                </div>
              </FieldGroup>

              <FieldGroup title="Sayaçlar">
                <div className="grid md:grid-cols-4 gap-4">
                  <TextField label="Marka sayısı" k="statProjects" type="number" />
                  <TextField label="Sektör sayısı" k="statSectors" type="number" />
                  <TextField label="Yıl sayısı" k="statYears" type="number" />
                  <TextField label="Son kullanıcı" k="statEndUsers" />
                  <TextField label="Stat 1 etiketi" k="heroStatProjectsLabel" />
                  <TextField label="Stat 2 etiketi" k="heroStatSectorsLabel" />
                  <TextField label="Stat 3 etiketi" k="heroStatUsersLabel" />
                  <TextField label="Hero görsel etiketi" k="heroImageLabel" />
                </div>
              </FieldGroup>

              <FieldGroup title="Overlay Kart">
                <div className="grid md:grid-cols-3 gap-4">
                  <TextField label="Overlay rozet" k="heroOverlayLabel" />
                  <TextField label="Overlay başlık" k="heroOverlayTitle" />
                  <TextField label="Overlay açıklama" k="heroOverlayDescription" textarea rows={2} />
                </div>
              </FieldGroup>

              <FieldGroup title="Grup Bilgisi">
                <div className="grid md:grid-cols-2 gap-4">
                  <TextField label="Ekip büyüklüğü" k="teamSize" type="number" />
                  <TextField label="Kuruluş yılı" k="foundedYear" type="number" />
                </div>
              </FieldGroup>
            </SettingsPanel>

            <SettingsPanel
              title="Ana Sayfa Bölüm Başlıkları"
              description="Markalar, sektörler ve blog bölümlerinin üst yazıları."
            >
              <div className="space-y-6">
                <FieldGroup title="Markalar">
                  <div className="grid md:grid-cols-[1fr_2fr] gap-4">
                    <TextField label="Eyebrow" k="projectsEyebrow" />
                    <TextField label="Başlık" k="projectsTitle" />
                  </div>
                  <div className="mt-4">
                    <TextField label="Lead paragraf" k="projectsLead" textarea rows={2} />
                  </div>
                </FieldGroup>

                <FieldGroup title="Sektörler">
                  <div className="grid md:grid-cols-[1fr_2fr] gap-4">
                    <TextField label="Eyebrow" k="sectorsEyebrow" />
                    <TextField label="Başlık" k="sectorsTitle" />
                  </div>
                  <div className="mt-4">
                    <TextField label="Lead paragraf" k="sectorsLead" textarea rows={2} />
                  </div>
                </FieldGroup>

                <FieldGroup title="Blog">
                  <div className="grid md:grid-cols-[1fr_2fr] gap-4">
                    <TextField label="Eyebrow" k="blogEyebrow" />
                    <TextField label="Başlık" k="blogTitle" />
                  </div>
                  <div className="mt-4">
                    <TextField label="Lead paragraf" k="blogLead" textarea rows={2} />
                  </div>
                </FieldGroup>
              </div>
            </SettingsPanel>
          </TabsContent>

          <TabsContent value="brands" className="mt-6 space-y-6">
            <SettingsPanel
              title="Markalar Mikro Metinleri"
              description="Ana sayfa ve /markalarimiz sayfasındaki filtre, kart ve sayaç metinleri."
            >
              <div className="grid md:grid-cols-3 gap-4">
                <TextField label="Tümü filtresi" k="brandsFilterAllLabel" />
                <TextField label="Tekil sayaç kelimesi" k="brandsCountSingular" />
                <TextField label="Çoğul sayaç kelimesi" k="brandsCountPlural" />
                <TextField label="Kart CTA" k="brandCardCtaLabel" />
                <TextField label="Dış site CTA" k="brandCardExternalLabel" />
                <TextField label="Kart meta ön eki" k="brandCardMetaPrefix" />
                <TextField label="Yıl yoksa kart meta metni" k="brandCardPendingLabel" />
              </div>
            </SettingsPanel>
          </TabsContent>

          <TabsContent value="contact" className="mt-6 space-y-6">
            <SettingsPanel
              title="İletişim Bilgileri"
              description="Footer, iletişim sayfası ve ana sayfa iletişim alanında kullanılan bilgiler."
            >
              <div className="grid md:grid-cols-2 gap-4">
                <TextField label="E-posta" k="email" type="email" />
                <TextField label="Telefon" k="phone" />
                <TextField label="WhatsApp" k="whatsapp" />
                <TextField label="Adres" k="address" />
                <TextField label="Çalışma saatleri" k="officeHours" />
              </div>
            </SettingsPanel>

            <SettingsPanel title="Ana Sayfa İletişim Bölümü">
              <div className="grid gap-4">
                <TextField label="İletişim başlığı" k="contactHeading" textarea rows={2} />
                <TextField label="İletişim vurgu (başlık içinden)" k="contactHighlight" />
                <TextField label="İletişim lead" k="contactLead" textarea rows={3} />
              </div>
            </SettingsPanel>

            <SettingsPanel title="İletişim Formu Mikro Metinleri">
              <div className="grid md:grid-cols-2 gap-4">
                <TextField label="İletişim eyebrow" k="contactEyebrow" />
                <TextField label="E-posta bilgi etiketi" k="contactEmailLabel" />
                <TextField label="Telefon bilgi etiketi" k="contactPhoneLabel" />
                <TextField label="Ofis bilgi etiketi" k="contactOfficeLabel" />
                <TextField label="Çalışma saati etiketi" k="contactHoursLabel" />
                <TextField label="Form başlığı" k="contactFormTitle" />
                <TextField label="Ad soyad etiketi" k="contactNameLabel" />
                <TextField label="Ad soyad placeholder" k="contactNamePlaceholder" />
                <TextField label="E-posta alan etiketi" k="contactEmailFieldLabel" />
                <TextField label="E-posta placeholder" k="contactEmailPlaceholder" />
                <TextField label="Şirket etiketi" k="contactCompanyLabel" />
                <TextField label="Şirket placeholder" k="contactCompanyPlaceholder" />
                <TextField label="Mesaj etiketi" k="contactMessageLabel" />
                <TextField label="Mesaj placeholder" k="contactMessagePlaceholder" />
                <TextField label="Gönder butonu" k="contactSubmitLabel" />
                <TextField label="Gönderiliyor metni" k="contactSendingLabel" />
                <TextField label="Başarı metni" k="contactSuccessLabel" />
                <TextField label="Gizlilik alt metni" k="contactPrivacyText" />
                <TextField label="Mesaj konusu" k="contactSubject" />
              </div>
            </SettingsPanel>

            <SettingsPanel title="Kariyer Bölümü">
              <div className="grid gap-4">
                <TextField label="Kariyer başlığı" k="careersHeading" />
                <TextField label="Kariyer lead" k="careersLead" textarea rows={2} />
                <ImageField label="Kariyer görseli" k="careersImage" />
                <TextField label="Boş ilan başlığı" k="careersEmptyTitle" />
                <TextField label="Boş ilan metni" k="careersEmptyText" textarea rows={2} />
                <TextField label="Spontan başvuru buton metni" k="careersApplyLabel" />
                <TextField label="Kariyer eyebrow" k="careersEyebrow" />
                <TextField label="Açık pozisyon etiketi" k="careersOpenPositionsLabel" />
                <TextField label="Kariyer görsel fallback etiketi" k="careersImageLabel" />
              </div>
            </SettingsPanel>
          </TabsContent>

          <TabsContent value="footer" className="mt-6 space-y-6">
            <SettingsPanel
              title="Footer"
              description="Footer açıklaması, kolon başlıkları ve yasal link metinleri."
            >
              <TextField label="Footer metni" k="footerText" textarea rows={3} />
              <div className="grid md:grid-cols-2 gap-4">
                <TextField label="Şirket kolon başlığı" k="footerCompanyHeading" />
                <TextField label="Markalar kolon başlığı" k="footerBrandsHeading" />
                <TextField label="İletişim kolon başlığı" k="footerContactHeading" />
                <TextField label="Hakkımızda link metni" k="footerAboutLabel" />
                <TextField label="Copyright eki" k="footerCopyrightSuffix" />
                <TextField label="KVKK link metni" k="footerKvkkLabel" />
                <TextField label="Gizlilik link metni" k="footerPrivacyLabel" />
                <TextField label="Çerezler link metni" k="footerCookiesLabel" />
              </div>
            </SettingsPanel>
          </TabsContent>

          <TabsContent value="seo" className="mt-6 space-y-6">
            <SettingsPanel title="SEO & Analytics">
              <div className="grid md:grid-cols-2 gap-4">
                <TextField label="Varsayılan SEO başlık" k="defaultSeoTitle" />
                <TextField label="Varsayılan SEO açıklama" k="defaultSeoDesc" />
              </div>
              <TextField label="GTM ID (Google Tag Manager)" k="gtmId" />
            </SettingsPanel>

            <SettingsPanel title="Blog Mikro Metinleri">
              <div className="grid md:grid-cols-2 gap-4">
                <TextField label="Öne çıkan yazı CTA" k="blogReadFullLabel" />
                <TextField label="Küçük yazı CTA" k="blogReadLabel" />
                <TextField label="Tüm yazılar CTA" k="blogAllPostsLabel" />
                <TextField label="Blog görsel fallback etiketi" k="blogFeaturedImageLabel" />
              </div>
            </SettingsPanel>
          </TabsContent>
        </Tabs>

        <div className="sticky bottom-0 flex justify-end border-t bg-background/95 py-4 backdrop-blur">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </form>
    </SettingsFormContext.Provider>
  );
}
