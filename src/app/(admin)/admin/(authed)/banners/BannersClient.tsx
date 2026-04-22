"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MediaPicker } from "@/components/admin/MediaPicker";
import {
  saveBanner,
  deleteBanner,
  reorderBanners,
  toggleBannerActive,
} from "@/actions/banners";

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  ctaText: string | null;
  ctaUrl: string | null;
  order: number;
  isActive: boolean;
}

function SortableRow({
  banner,
  onEdit,
  onDelete,
  onToggle,
}: {
  banner: Banner;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: (v: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: banner.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 bg-background border border-border rounded-lg p-3"
    >
      <button
        {...attributes}
        {...listeners}
        className="text-muted-foreground hover:text-foreground cursor-grab touch-none"
        type="button"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="relative h-14 w-24 rounded overflow-hidden bg-muted shrink-0">
        <Image
          src={banner.imageUrl}
          alt={banner.title}
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium truncate">{banner.title}</p>
          {banner.isActive ? (
            <Badge variant="secondary" className="text-[10px]">aktif</Badge>
          ) : (
            <Badge variant="outline" className="text-[10px]">pasif</Badge>
          )}
        </div>
        {banner.subtitle ? (
          <p className="text-sm text-muted-foreground truncate">{banner.subtitle}</p>
        ) : null}
      </div>
      <div className="flex items-center gap-1">
        <Switch checked={banner.isActive} onCheckedChange={onToggle} />
        <Button type="button" variant="ghost" size="icon" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function BannersClient({ initial }: { initial: Banner[] }) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor));

  function openNew() {
    setEditing({
      id: "",
      title: "",
      subtitle: "",
      imageUrl: "",
      ctaText: "",
      ctaUrl: "",
      order: items.length,
      isActive: true,
    });
    setOpen(true);
  }

  function openEdit(b: Banner) {
    setEditing(b);
    setOpen(true);
  }

  function handleDragEnd(e: DragEndEvent) {
    if (!e.over || e.active.id === e.over.id) return;
    const oldIndex = items.findIndex((i) => i.id === e.active.id);
    const newIndex = items.findIndex((i) => i.id === e.over!.id);
    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    startTransition(async () => {
      await reorderBanners(next.map((n) => n.id));
    });
  }

  async function handleSave(formData: FormData) {
    if (!editing) return;
    const input = {
      id: editing.id || undefined,
      title: String(formData.get("title") ?? ""),
      subtitle: String(formData.get("subtitle") ?? ""),
      imageUrl: String(formData.get("imageUrl") ?? ""),
      ctaText: String(formData.get("ctaText") ?? ""),
      ctaUrl: String(formData.get("ctaUrl") ?? ""),
      order: Number(formData.get("order") ?? 0),
      isActive: formData.get("isActive") === "on",
    };
    try {
      await saveBanner(input);
      toast.success(editing.id ? "Güncellendi" : "Oluşturuldu");
      setOpen(false);
      // Reload page data via router refresh trick
      window.location.reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kaydedilemedi");
    }
  }

  function handleDelete(id: string) {
    if (!confirm("Bu banner'ı silmek istediğinizden emin misiniz?")) return;
    startTransition(async () => {
      await deleteBanner(id);
      setItems((p) => p.filter((i) => i.id !== id));
      toast.success("Silindi");
    });
  }

  function handleToggle(id: string, v: boolean) {
    startTransition(async () => {
      await toggleBannerActive(id, v);
      setItems((p) => p.map((i) => (i.id === id ? { ...i, isActive: v } : i)));
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Sıralama sol taraftaki tutamaktan sürüklenerek değiştirilebilir.
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}>
              <Plus className="h-4 w-4 mr-1" /> Yeni Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>
                {editing?.id ? "Banner Düzenle" : "Yeni Banner"}
              </DialogTitle>
            </DialogHeader>
            {editing ? (
              <form action={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label>Görsel</Label>
                  <MediaPicker
                    value={editing.imageUrl}
                    onChange={(url) =>
                      setEditing((e) => (e ? { ...e, imageUrl: url ?? "" } : e))
                    }
                  />
                  <input
                    type="hidden"
                    name="imageUrl"
                    value={editing.imageUrl}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Başlık</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editing.title}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Alt başlık</Label>
                  <Textarea
                    id="subtitle"
                    name="subtitle"
                    defaultValue={editing.subtitle ?? ""}
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="ctaText">CTA Metni</Label>
                    <Input
                      id="ctaText"
                      name="ctaText"
                      defaultValue={editing.ctaText ?? ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ctaUrl">CTA URL</Label>
                    <Input
                      id="ctaUrl"
                      name="ctaUrl"
                      defaultValue={editing.ctaUrl ?? ""}
                    />
                  </div>
                </div>
                <input type="hidden" name="order" value={editing.order} />
                <div className="flex items-center gap-2">
                  <Switch
                    id="isActive"
                    name="isActive"
                    defaultChecked={editing.isActive}
                  />
                  <Label htmlFor="isActive">Aktif</Label>
                </div>
                <DialogFooter>
                  <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                    İptal
                  </Button>
                  <Button type="submit" disabled={!editing.imageUrl}>
                    Kaydet
                  </Button>
                </DialogFooter>
              </form>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 ? (
        <div className="border border-dashed rounded-lg py-16 text-center text-sm text-muted-foreground">
          Henüz banner eklenmemiş.
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {items.map((b) => (
                <SortableRow
                  key={b.id}
                  banner={b}
                  onEdit={() => openEdit(b)}
                  onDelete={() => handleDelete(b.id)}
                  onToggle={(v) => handleToggle(b.id, v)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
