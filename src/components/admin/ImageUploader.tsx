"use client";

import { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Props {
  value?: string | null;
  onChange: (url: string | null) => void;
  className?: string;
  label?: string;
}

export function ImageUploader({ value, onChange, className, label = "Görsel" }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  async function uploadFile(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Yükleme başarısız");
      onChange(data.url);
      toast.success("Görsel yüklendi");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Yükleme başarısız";
      toast.error(message);
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-lg border-2 border-dashed border-border bg-muted/40 hover:bg-muted/60 transition-colors min-h-40 flex items-center justify-center overflow-hidden",
          dragOver && "border-primary bg-primary/5"
        )}
      >
        {value ? (
          <div className="relative w-full aspect-[16/9]">
            <Image src={value} alt={label} fill sizes="400px" className="object-cover" />
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
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center gap-2 p-6 text-sm text-muted-foreground cursor-pointer"
          >
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Upload className="h-6 w-6" />
            )}
            <span>
              {uploading ? "Yükleniyor..." : "Görsel yüklemek için tıkla veya sürükle"}
            </span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
