"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { markMessageRead, deleteMessage } from "@/actions/messages";

interface Msg {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export function MessagesClient({
  items,
  activeFilter,
}: {
  items: Msg[];
  activeFilter: string;
}) {
  const [rows, setRows] = useState(items);
  const [open, setOpen] = useState<Msg | null>(null);
  const [, startTransition] = useTransition();

  function onOpen(m: Msg) {
    setOpen(m);
    if (!m.isRead) {
      startTransition(async () => {
        await markMessageRead(m.id, true);
        setRows((p) => p.map((r) => (r.id === m.id ? { ...r, isRead: true } : r)));
      });
    }
  }

  function onDelete(id: string) {
    if (!confirm("Bu mesajı silmek istediğinizden emin misiniz?")) return;
    startTransition(async () => {
      await deleteMessage(id);
      setRows((p) => p.filter((r) => r.id !== id));
      setOpen(null);
      toast.success("Silindi");
    });
  }

  function onToggleRead(id: string, next: boolean) {
    startTransition(async () => {
      await markMessageRead(id, next);
      setRows((p) => p.map((r) => (r.id === id ? { ...r, isRead: next } : r)));
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link
          href="/admin/messages"
          className={`text-xs px-3 py-1.5 rounded-md border ${
            activeFilter === "all"
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border bg-background hover:bg-muted"
          }`}
        >
          Tümü
        </Link>
        <Link
          href="/admin/messages?filter=unread"
          className={`text-xs px-3 py-1.5 rounded-md border ${
            activeFilter === "unread"
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border bg-background hover:bg-muted"
          }`}
        >
          Okunmamış
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="border border-dashed rounded-lg py-16 text-center text-sm text-muted-foreground">
          Mesaj yok.
        </div>
      ) : (
        <div className="border border-border rounded-lg bg-background divide-y divide-border">
          {rows.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onOpen(m)}
              className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-muted/50 transition-colors"
            >
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                  m.isRead ? "bg-muted" : "bg-primary/10 text-primary"
                }`}
              >
                {m.isRead ? (
                  <MailOpen className="h-4 w-4" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{m.name}</span>
                  <span className="text-xs text-muted-foreground">{m.email}</span>
                  {!m.isRead ? (
                    <Badge variant="destructive" className="text-[10px]">
                      yeni
                    </Badge>
                  ) : null}
                </div>
                <p className="text-sm font-medium mt-0.5 truncate">
                  {m.subject}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {m.message}
                </p>
              </div>
              <time className="text-xs text-muted-foreground whitespace-nowrap pt-1">
                {format(new Date(m.createdAt), "dd.MM.yy HH:mm", { locale: tr })}
              </time>
            </button>
          ))}
        </div>
      )}

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-lg">
          {open ? (
            <>
              <DialogHeader>
                <DialogTitle>{open.subject}</DialogTitle>
                <DialogDescription>
                  {open.name} · {open.email}
                  {open.phone ? ` · ${open.phone}` : null} ·{" "}
                  {format(new Date(open.createdAt), "dd.MM.yyyy HH:mm", { locale: tr })}
                </DialogDescription>
              </DialogHeader>
              <div className="text-sm whitespace-pre-line py-2 border-t border-border pt-3">
                {open.message}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <Button
                  variant="ghost"
                  onClick={() => onToggleRead(open.id, !open.isRead)}
                >
                  {open.isRead ? "Okunmadı işaretle" : "Okundu işaretle"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => onDelete(open.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Sil
                </Button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
