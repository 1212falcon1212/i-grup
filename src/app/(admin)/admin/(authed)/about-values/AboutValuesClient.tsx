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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  saveAboutValue,
  deleteAboutValue,
  reorderAboutValues,
  toggleAboutValueActive,
} from "@/actions/about-values";

interface Value {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  order: number;
  isActive: boolean;
}

function Row({
  v,
  onEdit,
  onDelete,
  onToggle,
}: {
  v: Value;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: (next: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: v.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 bg-background border border-border rounded-lg p-4"
    >
      <button
        {...attributes}
        {...listeners}
        className="text-muted-foreground hover:text-foreground cursor-grab touch-none"
        type="button"
        aria-label="Sürükle"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="w-24 shrink-0">
        <Badge variant="secondary" className="uppercase tracking-widest text-[10px]">
          {v.eyebrow}
        </Badge>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium truncate">{v.title}</p>
          {v.isActive ? (
            <Badge variant="secondary" className="text-[10px]">
              aktif
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px]">
              pasif
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">{v.description}</p>
      </div>
      <Switch checked={v.isActive} onCheckedChange={onToggle} />
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
  );
}

export function AboutValuesClient({ initial }: { initial: Value[] }) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<Value | null>(null);
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor));

  function openNew() {
    setEditing({
      id: "",
      eyebrow: "",
      title: "",
      description: "",
      order: items.length,
      isActive: true,
    });
    setOpen(true);
  }

  function openEdit(v: Value) {
    setEditing(v);
    setOpen(true);
  }

  function handleDragEnd(e: DragEndEvent) {
    if (!e.over || e.active.id === e.over.id) return;
    const oldIdx = items.findIndex((i) => i.id === e.active.id);
    const newIdx = items.findIndex((i) => i.id === e.over!.id);
    const next = arrayMove(items, oldIdx, newIdx);
    setItems(next);
    startTransition(async () => {
      await reorderAboutValues(next.map((n) => n.id));
    });
  }

  async function handleSave(formData: FormData) {
    if (!editing) return;
    const input = {
      id: editing.id || undefined,
      eyebrow: String(formData.get("eyebrow") ?? ""),
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      order: Number(formData.get("order") ?? 0),
      isActive: formData.get("isActive") === "on",
    };
    try {
      await saveAboutValue(input);
      toast.success(editing.id ? "Güncellendi" : "Oluşturuldu");
      setOpen(false);
      window.location.reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kaydedilemedi");
    }
  }

  function handleDelete(id: string) {
    if (!confirm("Bu kartı silmek istediğinizden emin misiniz?")) return;
    startTransition(async () => {
      await deleteAboutValue(id);
      setItems((p) => p.filter((i) => i.id !== id));
      toast.success("Silindi");
    });
  }

  function handleToggle(id: string, next: boolean) {
    startTransition(async () => {
      await toggleAboutValueActive(id, next);
      setItems((p) =>
        p.map((i) => (i.id === id ? { ...i, isActive: next } : i))
      );
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Sıralama soldaki tutamaktan sürüklenerek değiştirilebilir.
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}>
              <Plus className="h-4 w-4 mr-1" /> Yeni Kart
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>
                {editing?.id ? "Kartı Düzenle" : "Yeni Kart"}
              </DialogTitle>
            </DialogHeader>
            {editing ? (
              <form action={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="eyebrow">Etiket (ODAK, YAKLAŞIM vb.)</Label>
                  <Input
                    id="eyebrow"
                    name="eyebrow"
                    defaultValue={editing.eyebrow}
                    placeholder="Ekip"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Başlık</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editing.title}
                    placeholder="Çoklu disiplin, tek takım"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Açıklama</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={editing.description}
                    rows={3}
                    placeholder="Kısa bir cümle ile kart içeriği."
                    required
                  />
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
          Henüz kart eklenmemiş.
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
              {items.map((v) => (
                <Row
                  key={v.id}
                  v={v}
                  onEdit={() => openEdit(v)}
                  onDelete={() => handleDelete(v.id)}
                  onToggle={(next) => handleToggle(v.id, next)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
