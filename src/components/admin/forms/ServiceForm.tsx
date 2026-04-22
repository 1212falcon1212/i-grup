"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { IconPicker } from "@/components/admin/IconPicker";
import { saveService, type ServiceInput } from "@/actions/services";
import { slugify } from "@/lib/slug";

type FormVals = ServiceInput & { slugLocked?: boolean };

export function ServiceForm({ initial }: { initial?: Partial<ServiceInput> & { id?: string } }) {
  const router = useRouter();
  const [v, setV] = useState<FormVals>({
    id: initial?.id,
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    shortDesc: initial?.shortDesc ?? "",
    icon: initial?.icon ?? "",
    coverImage: initial?.coverImage ?? "",
    content: initial?.content ?? "",
    order: initial?.order ?? 0,
    isActive: initial?.isActive ?? true,
    seoTitle: initial?.seoTitle ?? "",
    seoDescription: initial?.seoDescription ?? "",
    slugLocked: !!initial?.slug,
  });
  const [isPending, startTransition] = useTransition();

  function set<K extends keyof FormVals>(k: K, val: FormVals[K]) {
    setV((prev) => ({ ...prev, [k]: val }));
  }

  function handleTitle(t: string) {
    set("title", t);
    if (!v.slugLocked) set("slug", slugify(t));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await saveService({
          id: v.id,
          title: v.title,
          slug: v.slug,
          shortDesc: v.shortDesc,
          icon: v.icon || undefined,
          coverImage: v.coverImage || undefined,
          content: v.content,
          order: v.order,
          isActive: v.isActive,
          seoTitle: v.seoTitle || undefined,
          seoDescription: v.seoDescription || undefined,
        });
        toast.success(v.id ? "Güncellendi" : "Oluşturuldu");
        router.push("/admin/services");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Kaydedilemedi");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Başlık</Label>
          <Input value={v.title} onChange={(e) => handleTitle(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input
            value={v.slug}
            onChange={(e) => setV((p) => ({ ...p, slug: e.target.value, slugLocked: true }))}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Kısa açıklama (max 280)</Label>
        <Textarea
          value={v.shortDesc}
          onChange={(e) => set("shortDesc", e.target.value)}
          rows={2}
          maxLength={280}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>İkon</Label>
        <IconPicker value={v.icon} onChange={(name) => set("icon", name)} />
      </div>
      <div className="space-y-2">
        <Label>Kapak görseli</Label>
        <MediaPicker
          value={v.coverImage ?? ""}
          onChange={(url) => set("coverImage", url ?? "")}
        />
      </div>
      <div className="space-y-2">
        <Label>İçerik</Label>
        <RichTextEditor value={v.content} onChange={(html) => set("content", html)} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>SEO Başlık</Label>
          <Input
            value={v.seoTitle ?? ""}
            onChange={(e) => set("seoTitle", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>SEO Açıklama</Label>
          <Input
            value={v.seoDescription ?? ""}
            onChange={(e) => set("seoDescription", e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={v.isActive} onCheckedChange={(on) => set("isActive", on)} />
        <Label>Aktif</Label>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          İptal
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>
    </form>
  );
}
