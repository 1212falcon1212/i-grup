"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ImagePlus, X, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { listMedia } from "@/actions/media";

interface MediaItem {
  id: string;
  path: string;
  alt: string | null;
  width: number | null;
  height: number | null;
}

interface Props {
  value?: string | null;
  onChange: (url: string | null) => void;
  triggerLabel?: string;
  className?: string;
}

export function MediaPicker({
  value,
  onChange,
  triggerLabel = "Görsel Seç",
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);

  async function load() {
    setLoading(true);
    try {
      const data = await listMedia();
      setItems(
        data.map((m) => ({
          id: m.id,
          path: m.path,
          alt: m.alt,
          width: m.width,
          height: m.height,
        }))
      );
    } catch {
      toast.error("Medya listesi yüklenemedi");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) load();
  }, [open]);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Yükleme başarısız");
      toast.success("Yüklendi");
      await load();
      onChange(data.url);
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Yükleme başarısız");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {value ? (
        <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border border-border">
          <Image src={value} alt="Seçili görsel" fill sizes="400px" className="object-cover" />
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={(e) => {
              e.preventDefault();
              onChange(null);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="sm" className="w-full">
            <ImagePlus className="h-4 w-4 mr-2" />
            {value ? "Değiştir" : triggerLabel}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Medya Seç</DialogTitle>
            <DialogDescription>
              Mevcut medyadan birini seçin veya yeni bir görsel yükleyin.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-2 text-sm border border-border rounded-md px-3 py-2 cursor-pointer hover:bg-muted">
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {uploading ? "Yükleniyor..." : "Yeni yükle"}
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
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : items.length === 0 ? (
              <p className="text-sm text-muted-foreground py-10 text-center">
                Henüz medya yok. İlk görseli yükleyin.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {items.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      onChange(m.path);
                      setOpen(false);
                    }}
                    className={cn(
                      "relative aspect-square rounded-md overflow-hidden border transition-all hover:border-primary hover:shadow-sm",
                      value === m.path
                        ? "border-primary ring-2 ring-primary"
                        : "border-border"
                    )}
                  >
                    <Image
                      src={m.path}
                      alt={m.alt ?? ""}
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
