"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteCareer, toggleCareerActive } from "@/actions/careers";

export function CareerRowActions({ id, isActive }: { id: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        disabled={isPending}
        title={isActive ? "Pasif yap" : "Aktif yap"}
        onClick={() =>
          startTransition(async () => {
            await toggleCareerActive(id, !isActive);
            toast.success(isActive ? "Pasif yapıldı" : "Aktif yapıldı");
          })
        }
      >
        {isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
      <Button
        size="icon"
        variant="ghost"
        disabled={isPending}
        className="text-destructive hover:text-destructive"
        onClick={() => {
          if (!confirm("Bu ilanı silmek istediğinizden emin misiniz?")) return;
          startTransition(async () => {
            try {
              await deleteCareer(id);
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
