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
import { GripVertical, Pencil, Trash2, Plus, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { MediaPicker } from "@/components/admin/MediaPicker";
import {
  saveClient,
  deleteClient,
  reorderClients,
  toggleClientActive,
} from "@/actions/clients";

interface Client {
  id: string;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  order: number;
  isActive: boolean;
}

function Row({
  c,
  onEdit,
  onDelete,
  onToggle,
}: {
  c: Client;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: (v: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: c.id });
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
      <div className="relative h-12 w-20 rounded bg-muted overflow-hidden shrink-0 flex items-center justify-center">
        {c.logoUrl ? (
          <Image
            src={c.logoUrl}
            alt={c.name}
            fill
            sizes="80px"
            className="object-contain p-1"
          />
        ) : (
          <span className="text-xs font-semibold text-muted-foreground">
            {c.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium truncate">{c.name}</p>
          {c.isActive ? (
            <Badge variant="secondary" className="text-[10px]">
              aktif
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px]">
              pasif
            </Badge>
          )}
        </div>
        {c.websiteUrl ? (
          <a
            href={c.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mt-0.5"
          >
            {c.websiteUrl} <ExternalLink className="h-3 w-3" />
          </a>
        ) : null}
      </div>
      <Switch checked={c.isActive} onCheckedChange={onToggle} />
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

export function ClientsClient({ initial }: { initial: Client[] }) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<Client | null>(null);
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor));

  function openNew() {
    setEditing({
      id: "",
      name: "",
      logoUrl: null,
      websiteUrl: null,
      order: items.length,
      isActive: true,
    });
    setOpen(true);
  }

  function openEdit(c: Client) {
    setEditing(c);
    setOpen(true);
  }

  function handleDragEnd(e: DragEndEvent) {
    if (!e.over || e.active.id === e.over.id) return;
    const oldIdx = items.findIndex((i) => i.id === e.active.id);
    const newIdx = items.findIndex((i) => i.id === e.over!.id);
    const next = arrayMove(items, oldIdx, newIdx);
    setItems(next);
    startTransition(async () => {
      await reorderClients(next.map((n) => n.id));
    });
  }

  async function handleSave(formData: FormData) {
    if (!editing) return;
    const input = {
      id: editing.id || undefined,
      name: String(formData.get("name") ?? ""),
      logoUrl: editing.logoUrl ?? "",
      websiteUrl: String(formData.get("websiteUrl") ?? ""),
      order: Number(formData.get("order") ?? 0),
      isActive: formData.get("isActive") === "on",
    };
    try {
      await saveClient(input);
      toast.success(editing.id ? "Güncellendi" : "Oluşturuldu");
      setOpen(false);
      window.location.reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kaydedilemedi");
    }
  }

  function handleDelete(id: string) {
    if (!confirm("Bu markayı silmek istediğinizden emin misiniz?")) return;
    startTransition(async () => {
      await deleteClient(id);
      setItems((p) => p.filter((i) => i.id !== id));
      toast.success("Silindi");
    });
  }

  function handleToggle(id: string, v: boolean) {
    startTransition(async () => {
      await toggleClientActive(id, v);
      setItems((p) => p.map((i) => (i.id === id ? { ...i, isActive: v } : i)));
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          İlk 10 aktif marka ana sayfada 5×2 grid olarak render edilir.
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}>
              <Plus className="h-4 w-4 mr-1" /> Yeni Marka
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editing?.id ? "Markayı Düzenle" : "Yeni Marka"}
              </DialogTitle>
            </DialogHeader>
            {editing ? (
              <form action={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Marka adı</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editing.name}
                    placeholder="Dermopharma"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Logo (opsiyonel)</Label>
                  <MediaPicker
                    value={editing.logoUrl ?? undefined}
                    onChange={(url) =>
                      setEditing((e) => (e ? { ...e, logoUrl: url } : e))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">Website (opsiyonel)</Label>
                  <Input
                    id="websiteUrl"
                    name="websiteUrl"
                    defaultValue={editing.websiteUrl ?? ""}
                    placeholder="https://..."
                    type="url"
                  />
                </div>
                <input type="hidden" name="order" value={editing.order} />
                <div className="flex items-center gap-2">
                  <Switch
                    id="isActive"
                    name="isActive"
                    defaultChecked={editing.isActive}
                  />
                  <Label htmlFor="isActive">Aktif (ana sayfada göster)</Label>
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
          Henüz marka eklenmemiş.
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
              {items.map((c) => (
                <Row
                  key={c.id}
                  c={c}
                  onEdit={() => openEdit(c)}
                  onDelete={() => handleDelete(c.id)}
                  onToggle={(v) => handleToggle(c.id, v)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
