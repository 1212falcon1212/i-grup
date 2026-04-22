"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function MiniContactForm() {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: "Hızlı iletişim formu",
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
      kvkkConsent: true,
    };
    startTransition(async () => {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Gönderilemedi");
        return;
      }
      toast.success("Mesajınız iletildi. Kısa sürede döneceğiz.");
      form.reset();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-background border border-border rounded-xl p-6 md:p-8 grid md:grid-cols-2 gap-4"
    >
      <div className="md:col-span-2">
        <h3 className="text-xl md:text-2xl font-semibold tracking-tight">
          Bizimle iletişime geçin
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Projeniz hakkında kısa bir mesaj bırakın; sizi arayalım.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="mini-name">Ad Soyad</Label>
        <Input id="mini-name" name="name" required placeholder="Adınız Soyadınız" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="mini-email">E-posta</Label>
        <Input id="mini-email" name="email" type="email" required placeholder="ornek@firma.com" />
      </div>
      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="mini-msg">Mesaj</Label>
        <Textarea
          id="mini-msg"
          name="message"
          required
          rows={3}
          placeholder="Proje hakkında kısa bilgi..."
        />
      </div>
      <div className="md:col-span-2 flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Gönderiliyor..." : "Gönder"}
        </Button>
      </div>
    </form>
  );
}
