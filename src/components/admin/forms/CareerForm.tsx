"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { saveCareer, type CareerInput } from "@/actions/careers";
import { slugify } from "@/lib/slug";

const TYPES = ["Tam Zamanlı", "Yarı Zamanlı", "Sözleşmeli", "Staj"];

export function CareerForm({ initial }: { initial?: Partial<CareerInput> & { id?: string } }) {
  const router = useRouter();
  const [v, setV] = useState<CareerInput & { slugLocked?: boolean }>({
    id: initial?.id,
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    department: initial?.department ?? "",
    location: initial?.location ?? "",
    type: initial?.type ?? TYPES[0],
    shortDesc: initial?.shortDesc ?? "",
    content: initial?.content ?? "",
    isActive: initial?.isActive ?? true,
    slugLocked: !!initial?.slug,
  });
  const [isPending, startTransition] = useTransition();

  function set<K extends keyof typeof v>(k: K, val: (typeof v)[K]) {
    setV((p) => ({ ...p, [k]: val }));
  }

  function handleTitle(t: string) {
    set("title", t);
    if (!v.slugLocked) set("slug", slugify(t));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await saveCareer({
          id: v.id,
          title: v.title,
          slug: v.slug,
          department: v.department,
          location: v.location,
          type: v.type,
          shortDesc: v.shortDesc,
          content: v.content,
          isActive: v.isActive,
        });
        toast.success(v.id ? "Güncellendi" : "Oluşturuldu");
        router.push("/admin/careers");
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
          <Label>Pozisyon</Label>
          <Input value={v.title} onChange={(e) => handleTitle(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input
            value={v.slug}
            onChange={(e) =>
              setV((p) => ({ ...p, slug: e.target.value, slugLocked: true }))
            }
            required
          />
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Departman</Label>
          <Input
            value={v.department}
            onChange={(e) => set("department", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Lokasyon</Label>
          <Input
            value={v.location}
            onChange={(e) => set("location", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Tip</Label>
          <select
            value={v.type}
            onChange={(e) => set("type", e.target.value)}
            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm w-full"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Kısa açıklama</Label>
        <Textarea
          value={v.shortDesc}
          onChange={(e) => set("shortDesc", e.target.value)}
          rows={2}
          maxLength={280}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>İçerik</Label>
        <RichTextEditor value={v.content} onChange={(html) => set("content", html)} />
      </div>
      <div className="flex items-center gap-2">
        <Switch
          checked={v.isActive ?? true}
          onCheckedChange={(on) => set("isActive", on)}
        />
        <Label>Aktif ilan olarak yayınla</Label>
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
