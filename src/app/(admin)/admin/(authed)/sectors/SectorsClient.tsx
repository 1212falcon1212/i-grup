"use client";

import { useState, useTransition } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { saveSector, deleteSector, reorderSectors } from "@/actions/sectors";
import { slugify } from "@/lib/slug";

interface Sector {
  id: string;
  slug: string;
  name: string;
  detail: string;
  countOverride: number | null;
  order: number;
}

function Row({
  s,
  onEdit,
  onDelete,
}: {
  s: Sector;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: s.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-3 bg-background border border-border rounded-lg p-4"
    >
      <button
        {...attributes}
        {...listeners}
        className="text-muted-foreground hover:text-foreground cursor-grab touch-none mt-1"
        type="button"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium">{s.name}</p>
          <Badge variant="outline" className="text-[10px] font-mono">
            /{s.slug}
          </Badge>
          {s.countOverride !== null ? (
            <Badge variant="secondary" className="text-[10px]">
              override: {s.countOverride}
            </Badge>
          ) : null}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{s.detail}</p>
      </div>
      <div className="flex items-center gap-1">
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

export function SectorsClient({ initial }: { initial: Sector[] }) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<Sector | null>(null);
  const [open, setOpen] = useState(false);
  const [slugLocked, setSlugLocked] = useState(false);
  const [, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor));

  function openNew() {
    setEditing({
      id: "",
      slug: "",
      name: "",
      detail: "",
      countOverride: null,
      order: items.length,
    });
    setSlugLocked(false);
    setOpen(true);
  }

  function openEdit(s: Sector) {
    setEditing(s);
    setSlugLocked(true);
    setOpen(true);
  }

  function handleDragEnd(e: DragEndEvent) {
    if (!e.over || e.active.id === e.over.id) return;
    const oldIdx = items.findIndex((i) => i.id === e.active.id);
    const newIdx = items.findIndex((i) => i.id === e.over!.id);
    const next = arrayMove(items, oldIdx, newIdx);
    setItems(next);
    startTransition(async () => {
      await reorderSectors(next.map((n) => n.id));
    });
  }

  async function handleSave(formData: FormData) {
    if (!editing) return;
    const countRaw = String(formData.get("countOverride") ?? "").trim();
    const input = {
      id: editing.id || undefined,
      slug: String(formData.get("slug") ?? ""),
      name: String(formData.get("name") ?? ""),
      detail: String(formData.get("detail") ?? ""),
      countOverride: countRaw === "" ? null : Number(countRaw),
      order: Number(formData.get("order") ?? 0),
    };
    try {
      await saveSector(input);
      toast.success(editing.id ? "Güncellendi" : "Oluşturuldu");
      setOpen(false);
      window.location.reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kaydedilemedi");
    }
  }

  function handleDelete(id: string) {
    if (!confirm("Bu sektörü silmek istediğinizden emin misiniz?")) return;
    startTransition(async () => {
      await deleteSector(id);
      setItems((p) => p.filter((i) => i.id !== id));
      toast.success("Silindi");
    });
  }

  function handleName(v: string) {
    setEditing((p) =>
      p ? { ...p, name: v, slug: slugLocked ? p.slug : slugify(v) } : p
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Her satır ana sayfada bir bölüm olarak render edilir. Açıklama
          metinleri SEO için önemli — 250+ karakter öneririz.
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}>
              <Plus className="h-4 w-4 mr-1" /> Yeni Sektör
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>
                {editing?.id ? "Sektörü Düzenle" : "Yeni Sektör"}
              </DialogTitle>
            </DialogHeader>
            {editing ? (
              <form action={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="name">İsim</Label>
                    <Input
                      id="name"
                      name="name"
                      value={editing.name}
                      onChange={(e) => handleName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      name="slug"
                      value={editing.slug}
                      onChange={(e) => {
                        setSlugLocked(true);
                        setEditing((p) =>
                          p ? { ...p, slug: e.target.value } : p
                        );
                      }}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="detail">SEO Açıklaması</Label>
                  <Textarea
                    id="detail"
                    name="detail"
                    value={editing.detail}
                    onChange={(e) =>
                      setEditing((p) =>
                        p ? { ...p, detail: e.target.value } : p
                      )
                    }
                    rows={5}
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">
                    {editing.detail.length} karakter — ana sayfada görünür.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="countOverride">
                    Ürün sayısı override (opsiyonel, boş bırakılırsa
                    projelerden hesaplanır)
                  </Label>
                  <Input
                    id="countOverride"
                    name="countOverride"
                    type="number"
                    min="0"
                    value={editing.countOverride ?? ""}
                    onChange={(e) =>
                      setEditing((p) =>
                        p
                          ? {
                              ...p,
                              countOverride:
                                e.target.value === ""
                                  ? null
                                  : Number(e.target.value),
                            }
                          : p
                      )
                    }
                  />
                </div>
                <input type="hidden" name="order" value={editing.order} />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpen(false)}
                  >
                    İptal
                  </Button>
                  <Button type="submit">Kaydet</Button>
                </DialogFooter>
              </form>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 ? (
        <div className="border border-dashed rounded-lg py-16 text-center text-sm text-muted-foreground">
          Henüz sektör eklenmemiş.
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
              {items.map((s) => (
                <Row
                  key={s.id}
                  s={s}
                  onEdit={() => openEdit(s)}
                  onDelete={() => handleDelete(s.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
