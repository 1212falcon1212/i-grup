"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [consent, setConsent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent) {
      toast.error("KVKK onayı gereklidir");
      return;
    }
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      subject: String(fd.get("subject") ?? ""),
      message: String(fd.get("message") ?? ""),
      kvkkConsent: true as const,
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
      toast.success("Mesajınız iletildi. En kısa sürede döneceğiz.");
      form.reset();
      setConsent(false);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-background border border-border rounded-xl p-6 md:p-8 space-y-4"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="c-name">Ad Soyad</Label>
          <Input id="c-name" name="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="c-email">E-posta</Label>
          <Input id="c-email" name="email" type="email" required />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="c-phone">Telefon (opsiyonel)</Label>
          <Input id="c-phone" name="phone" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="c-subject">Konu</Label>
          <Input id="c-subject" name="subject" required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="c-message">Mesaj</Label>
        <Textarea id="c-message" name="message" rows={5} required />
      </div>
      <div className="flex items-start gap-2">
        <Checkbox
          id="consent"
          checked={consent}
          onCheckedChange={(c) => setConsent(!!c)}
        />
        <Label htmlFor="consent" className="text-sm leading-relaxed">
          Kişisel verilerimin KVKK kapsamında işlenmesini onaylıyorum.
        </Label>
      </div>
      <Button type="submit" disabled={isPending} className="w-full md:w-auto">
        {isPending ? "Gönderiliyor..." : "Mesajı Gönder"}
      </Button>
    </form>
  );
}
