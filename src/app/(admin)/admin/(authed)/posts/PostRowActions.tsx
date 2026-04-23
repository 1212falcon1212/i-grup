"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deletePost, togglePostPublished } from "@/actions/posts";

export function PostRowActions({
  id,
  isPublished,
}: {
  id: string;
  isPublished: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        disabled={isPending}
        title={isPublished ? "Taslağa çek" : "Yayına al"}
        onClick={() =>
          startTransition(async () => {
            await togglePostPublished(id, !isPublished);
            toast.success(isPublished ? "Taslağa çekildi" : "Yayına alındı");
          })
        }
      >
        {isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
      <Button
        size="icon"
        variant="ghost"
        disabled={isPending}
        className="text-destructive hover:text-destructive"
        onClick={() => {
          if (!confirm("Bu yazıyı silmek istediğinizden emin misiniz?")) return;
          startTransition(async () => {
            try {
              await deletePost(id);
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
