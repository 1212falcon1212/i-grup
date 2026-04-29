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
import { TagInput } from "@/components/admin/TagInput";
import { GalleryInput } from "@/components/admin/GalleryInput";
import { saveProject, type ProjectInput } from "@/actions/projects";
import { slugify } from "@/lib/slug";

export function ProjectForm({
  initial,
  categories,
}: {
  initial?: Partial<ProjectInput> & { id?: string };
  categories: string[];
}) {
  const router = useRouter();
  const [v, setV] = useState<ProjectInput & { slugLocked?: boolean }>({
    id: initial?.id,
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    client: initial?.client ?? "",
    category: initial?.category ?? (categories[0] ?? ""),
    shortDesc: initial?.shortDesc ?? "",
    content: initial?.content ?? "",
    coverImage: initial?.coverImage ?? "",
    gallery: initial?.gallery ?? [],
    techStack: initial?.techStack ?? [],
    liveUrl: initial?.liveUrl ?? "",
    year: initial?.year,
    isFeatured: initial?.isFeatured ?? false,
    order: initial?.order ?? 0,
    seoTitle: initial?.seoTitle ?? "",
    seoDescription: initial?.seoDescription ?? "",
    slugLocked: !!initial?.slug,
  });
  const [newCategory, setNewCategory] = useState("");
  const [isPending, startTransition] = useTransition();

  function set<K extends keyof typeof v>(k: K, val: (typeof v)[K]) {
    setV((p) => ({ ...p, [k]: val }));
  }

  function handleTitle(t: string) {
    set("title", t);
    if (!v.slugLocked) set("slug", slugify(t));
  }

  function addCategory() {
    const c = newCategory.trim();
    if (c && !categories.includes(c)) {
      categories.push(c);
      set("category", c);
      setNewCategory("");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await saveProject({
          id: v.id,
          title: v.title,
          slug: v.slug,
          client: v.client || undefined,
          category: v.category,
          shortDesc: v.shortDesc,
          content: v.content,
          coverImage: v.coverImage,
          gallery: v.gallery,
          techStack: v.techStack,
          liveUrl: v.liveUrl || undefined,
          year: v.year,
          isFeatured: v.isFeatured,
          order: v.order,
          seoTitle: v.seoTitle || undefined,
          seoDescription: v.seoDescription || undefined,
        });
        toast.success(v.id ? "Güncellendi" : "Oluşturuldu");
        router.push("/admin/projects");
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
          <Input
            value={v.title}
            onChange={(e) => handleTitle(e.target.value)}
            required
          />
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
          <Label>Bağlı şirket / hedef kitle</Label>
          <Input
            value={v.client ?? ""}
            onChange={(e) => set("client", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Yıl</Label>
          <Input
            type="number"
            value={v.year ?? ""}
            onChange={(e) =>
              set("year", e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Kategori</Label>
          <div className="flex gap-1">
            <select
              value={v.category}
              onChange={(e) => set("category", e.target.value)}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm flex-1"
              required
            >
              <option value="">Seç...</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-1">
            <Input
              placeholder="Yeni kategori..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="h-8 text-xs"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addCategory}
              className="h-8"
            >
              Ekle
            </Button>
          </div>
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
        <Label>Kapak görseli</Label>
        <MediaPicker
          value={v.coverImage}
          onChange={(url) => set("coverImage", url ?? "")}
        />
      </div>
      <div className="space-y-2">
        <Label>Galeri</Label>
        <GalleryInput value={v.gallery} onChange={(next) => set("gallery", next)} />
      </div>
      <div className="space-y-2">
        <Label>Öne çıkan kabiliyetler</Label>
        <TagInput
          value={v.techStack}
          onChange={(next) => set("techStack", next)}
          placeholder="Örn: Next.js, PostgreSQL..."
        />
      </div>
      <div className="space-y-2">
        <Label>Canlı URL</Label>
        <Input
          value={v.liveUrl ?? ""}
          onChange={(e) => set("liveUrl", e.target.value)}
          placeholder="https://..."
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
        <Switch
          checked={v.isFeatured ?? false}
          onCheckedChange={(on) => set("isFeatured", on)}
        />
        <Label>Öne çıkan (ana sayfada göster)</Label>
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
