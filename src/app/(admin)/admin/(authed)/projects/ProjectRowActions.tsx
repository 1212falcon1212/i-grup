"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProject, toggleProjectFeatured } from "@/actions/projects";

export function ProjectRowActions({ id, isFeatured }: { id: string; isFeatured: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await toggleProjectFeatured(id, !isFeatured);
            toast.success(isFeatured ? "Öne çıkarmaktan kaldırıldı" : "Öne çıkarıldı");
          })
        }
        title={isFeatured ? "Öne çıkarmayı kaldır" : "Öne çıkar"}
      >
        <Star className={`h-4 w-4 ${isFeatured ? "fill-yellow-500 text-yellow-500" : ""}`} />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        disabled={isPending}
        className="text-destructive hover:text-destructive"
        onClick={() => {
          if (!confirm("Bu projeyi silmek istediğinizden emin misiniz?")) return;
          startTransition(async () => {
            try {
              await deleteProject(id);
              toast.success("Silindi");
              window.location.reload();
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Silinemedi");
            }
          });
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </>
  );
}
