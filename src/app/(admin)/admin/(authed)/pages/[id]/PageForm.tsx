"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { updatePage } from "@/actions/pages";

interface PageInitial {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  heroImageUrl: string | null;
  content: string;
  seoTitle: string | null;
  seoDescription: string | null;
}

export function PageForm({ initial }: { initial: PageInitial }) {
  const router = useRouter();
  const [values, setValues] = useState({
    title: initial.title,
    subtitle: initial.subtitle ?? "",
    heroImageUrl: initial.heroImageUrl ?? "",
    content: initial.content,
    seoTitle: initial.seoTitle ?? "",
    seoDescription: initial.seoDescription ?? "",
  });
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await updatePage(initial.id, values);
        toast.success("Sayfa güncellendi");
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
          <Label htmlFor="title">Başlık</Label>
          <Input
            id="title"
            value={values.title}
            onChange={(e) =>
              setValues((v) => ({ ...v, title: e.target.value }))
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input value={initial.slug} disabled />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="subtitle">Alt başlık</Label>
        <Textarea
          id="subtitle"
          value={values.subtitle}
          onChange={(e) =>
            setValues((v) => ({ ...v, subtitle: e.target.value }))
          }
          rows={2}
        />
      </div>
      <div className="space-y-2">
        <Label>Hero görseli</Label>
        <MediaPicker
          value={values.heroImageUrl}
          onChange={(url) =>
            setValues((v) => ({ ...v, heroImageUrl: url ?? "" }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label>İçerik</Label>
        <RichTextEditor
          value={values.content}
          onChange={(html) => setValues((v) => ({ ...v, content: html }))}
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="seoTitle">SEO Başlık</Label>
          <Input
            id="seoTitle"
            value={values.seoTitle}
            onChange={(e) =>
              setValues((v) => ({ ...v, seoTitle: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seoDescription">SEO Açıklama</Label>
          <Input
            id="seoDescription"
            value={values.seoDescription}
            onChange={(e) =>
              setValues((v) => ({ ...v, seoDescription: e.target.value }))
            }
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>
    </form>
  );
}
