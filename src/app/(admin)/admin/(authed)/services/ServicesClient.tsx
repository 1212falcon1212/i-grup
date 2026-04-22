"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
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
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  deleteService,
  reorderServices,
  toggleServiceActive,
} from "@/actions/services";
import { iconByName } from "@/components/shared/icons";

interface Svc {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  icon: string | null;
  isActive: boolean;
  order: number;
}

function Row({
  s,
  onDelete,
  onToggle,
}: {
  s: Svc;
  onDelete: () => void;
  onToggle: (v: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: s.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  const Icon = iconByName(s.icon);
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 bg-background border border-border rounded-lg p-3"
    >
      <button
        {...attributes}
        {...listeners}
        className="text-muted-foreground cursor-grab touch-none"
        type="button"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
        {Icon ? <Icon className="h-4 w-4" /> : null}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium truncate">{s.title}</p>
          {s.isActive ? (
            <Badge variant="secondary" className="text-[10px]">aktif</Badge>
          ) : (
            <Badge variant="outline" className="text-[10px]">pasif</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">/{s.slug}</p>
      </div>
      <Switch checked={s.isActive} onCheckedChange={onToggle} />
      <Button asChild variant="ghost" size="icon">
        <Link href={`/admin/services/${s.id}`}>
          <Pencil className="h-4 w-4" />
        </Link>
      </Button>
      <Button
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

export function ServicesClient({ initial }: { initial: Svc[] }) {
  const [items, setItems] = useState(initial);
  const [, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd(e: DragEndEvent) {
    if (!e.over || e.active.id === e.over.id) return;
    const oldIndex = items.findIndex((i) => i.id === e.active.id);
    const newIndex = items.findIndex((i) => i.id === e.over!.id);
    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    startTransition(async () => {
      await reorderServices(next.map((n) => n.id));
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Bu hizmeti silmek istediğinizden emin misiniz?")) return;
    startTransition(async () => {
      try {
        await deleteService(id);
        setItems((p) => p.filter((i) => i.id !== id));
        toast.success("Silindi");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Silinemedi");
      }
    });
  }

  function handleToggle(id: string, v: boolean) {
    startTransition(async () => {
      await toggleServiceActive(id, v);
      setItems((p) => p.map((i) => (i.id === id ? { ...i, isActive: v } : i)));
    });
  }

  if (items.length === 0) {
    return (
      <div className="border border-dashed rounded-lg py-16 text-center text-sm text-muted-foreground">
        Henüz hizmet eklenmemiş.
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map((s) => (
            <Row
              key={s.id}
              s={s}
              onDelete={() => handleDelete(s.id)}
              onToggle={(v) => handleToggle(s.id, v)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
