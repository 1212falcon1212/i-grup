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
  statClients: number;
  statYears: number;
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

  const Field = ({
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

  return (
    <form onSubmit={submit} className="space-y-8 max-w-3xl">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Genel
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Site adı" k="siteName" />
          <Field label="Tagline" k="tagline" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Logo</Label>
            <MediaPicker
              value={v.logoUrl}
              onChange={(url) => set("logoUrl", url ?? "")}
            />
          </div>
          <div className="space-y-2">
            <Label>Favicon</Label>
            <MediaPicker
              value={v.faviconUrl}
              onChange={(url) => set("faviconUrl", url ?? "")}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          İletişim
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="E-posta" k="email" type="email" />
          <Field label="Telefon" k="phone" />
          <Field label="WhatsApp" k="whatsapp" />
          <Field label="Adres" k="address" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Sosyal Medya
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="LinkedIn URL" k="linkedinUrl" />
          <Field label="Instagram URL" k="instagramUrl" />
          <Field label="X (Twitter) URL" k="xUrl" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          İstatistik Rakamları
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Proje sayısı" k="statProjects" type="number" />
          <Field label="Müşteri sayısı" k="statClients" type="number" />
          <Field label="Yıl tecrübe" k="statYears" type="number" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          SEO & Analytics
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Varsayılan SEO başlık" k="defaultSeoTitle" />
          <Field label="Varsayılan SEO açıklama" k="defaultSeoDesc" />
        </div>
        <Field label="GTM ID (Google Tag Manager)" k="gtmId" />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Footer
        </h2>
        <Field label="Footer metni" k="footerText" textarea rows={3} />
      </section>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>
    </form>
  );
}
