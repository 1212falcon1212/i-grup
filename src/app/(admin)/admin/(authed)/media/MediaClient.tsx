"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Copy, Trash2, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteMedia, updateMediaAlt } from "@/actions/media";

interface MediaItem {
  id: string;
  path: string;
  filename: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  size: number;
  createdAt: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function MediaClient({ initialItems }: { initialItems: MediaItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Yükleme başarısız");
      toast.success("Görsel yüklendi");
      // Prepend new item — the route is dynamic so next revalidation will refresh too
      setItems((prev) => [
        {
          id: data.id,
          path: data.url,
          filename: "",
          alt: null,
          width: data.width ?? null,
          height: data.height ?? null,
          size: 0,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Yükleme başarısız");
    } finally {
      setUploading(false);
    }
  }

  function handleDelete(id: string) {
    if (!confirm("Bu görseli silmek istediğinizden emin misiniz?")) return;
    startTransition(async () => {
      const res = await deleteMedia(id);
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        toast.success("Silindi");
      } else {
        toast.error(res.error ?? "Silinemedi");
      }
    });
  }

  function handleAltSave(id: string, alt: string) {
    startTransition(async () => {
      await updateMediaAlt(id, alt);
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, alt: alt || null } : i))
      );
      toast.success("Alt metin güncellendi");
    });
  }

  function handleCopy(url: string) {
    navigator.clipboard.writeText(url);
    toast.success("URL kopyalandı");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label className="inline-flex items-center gap-2 text-sm border border-border rounded-md px-4 py-2 cursor-pointer hover:bg-muted bg-background">
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading ? "Yükleniyor..." : "Yeni görsel yükle"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUpload(f);
              e.target.value = "";
            }}
          />
        </label>
        <span className="text-sm text-muted-foreground">
          {items.length} görsel
        </span>
      </div>

      {items.length === 0 ? (
        <div className="border border-dashed rounded-lg py-16 text-center text-sm text-muted-foreground">
          Henüz yüklenmiş görsel yok.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((m) => (
            <div
              key={m.id}
              className="border border-border rounded-lg overflow-hidden bg-card flex flex-col"
            >
              <div className="relative aspect-square bg-muted">
                <Image
                  src={m.path}
                  alt={m.alt ?? ""}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </div>
              <div className="p-3 space-y-2 text-xs">
                <div className="flex items-center gap-1">
                  <Input
                    defaultValue={m.alt ?? ""}
                    placeholder="Alt metin"
                    className="h-7 text-xs"
                    onBlur={(e) => {
                      const v = e.target.value.trim();
                      if (v !== (m.alt ?? "")) handleAltSave(m.id, v);
                    }}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => handleCopy(m.path)}
                    title="URL kopyala"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(m.id)}
                    disabled={isPending}
                    title="Sil"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  <span className="ml-auto text-muted-foreground">
                    {m.size > 0 ? formatBytes(m.size) : ""}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
