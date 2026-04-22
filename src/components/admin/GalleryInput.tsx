"use client";

import Image from "next/image";
import { X, Plus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MediaPicker } from "./MediaPicker";

interface Props {
  value: string[];
  onChange: (next: string[]) => void;
}

export function GalleryInput({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {value.map((url) => (
          <div
            key={url}
            className="relative aspect-square border border-border rounded-md overflow-hidden bg-muted"
          >
            <Image
              src={url}
              alt=""
              fill
              sizes="200px"
              className="object-cover"
            />
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="absolute top-1 right-1 h-7 w-7"
              onClick={() => onChange(value.filter((u) => u !== url))}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="aspect-square border-2 border-dashed border-border rounded-md flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Galeriye Görsel Ekle</DialogTitle>
          </DialogHeader>
          <MediaPicker
            onChange={(url) => {
              if (url && !value.includes(url)) onChange([...value, url]);
              setOpen(false);
            }}
            triggerLabel="Seç"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
