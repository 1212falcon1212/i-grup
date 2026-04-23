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
import { savePost, type PostInput } from "@/actions/posts";
import { slugify } from "@/lib/slug";

const DEFAULT_TAGS = ["Ürün", "Sektör", "Kültür", "Duyuru", "Teknoloji"];

export function PostForm({ initial }: { initial?: Partial<PostInput> & { id?: string } }) {
  const router = useRouter();
  const [v, setV] = useState<PostInput & { slugLocked?: boolean }>({
    id: initial?.id,
    slug: initial?.slug ?? "",
    tag: initial?.tag ?? DEFAULT_TAGS[0],
    title: initial?.title ?? "",
    excerpt: initial?.excerpt ?? "",
    content: initial?.content ?? "",
    coverImage: initial?.coverImage ?? "",
    publishedAt: initial?.publishedAt
      ? new Date(initial.publishedAt).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    isPublished: initial?.isPublished ?? true,
    seoTitle: initial?.seoTitle ?? "",
    seoDescription: initial?.seoDescription ?? "",
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
        await savePost({
          id: v.id,
          slug: v.slug,
          tag: v.tag,
          title: v.title,
          excerpt: v.excerpt,
          content: v.content,
          coverImage: v.coverImage || undefined,
          publishedAt: v.publishedAt
            ? new Date(v.publishedAt as string)
            : new Date(),
          isPublished: v.isPublished,
          seoTitle: v.seoTitle || undefined,
          seoDescription: v.seoDescription || undefined,
        });
        toast.success(v.id ? "Güncellendi" : "Yayınlandı");
        router.push("/admin/posts");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Kaydedilemedi");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
      <div className="grid md:grid-cols-[2fr_1fr_1fr] gap-4">
        <div className="space-y-2">
          <Label>Başlık</Label>
          <Input
            value={v.title}
            onChange={(e) => handleTitle(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Tag</Label>
          <select
            value={v.tag}
            onChange={(e) => set("tag", e.target.value)}
            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm w-full"
          >
            {DEFAULT_TAGS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label>Yayın tarihi</Label>
          <Input
            type="date"
            value={v.publishedAt as string}
            onChange={(e) => set("publishedAt", e.target.value)}
          />
        </div>
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
      <div className="space-y-2">
        <Label>Kısa özet (max 280 karakter)</Label>
        <Textarea
          value={v.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
          rows={2}
          maxLength={280}
          required
        />
        <p className="text-[11px] text-muted-foreground">
          {v.excerpt.length}/280 karakter
        </p>
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
        <Switch
          checked={v.isPublished ?? true}
          onCheckedChange={(on) => set("isPublished", on)}
        />
        <Label>Yayında</Label>
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
