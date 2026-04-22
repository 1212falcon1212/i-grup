"use client";

import { useState, useTransition, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Paperclip } from "lucide-react";

export function CareerApplicationForm({ careerSlug }: { careerSlug: string }) {
  const [isPending, startTransition] = useTransition();
  const [fileName, setFileName] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.append("careerSlug", careerSlug);
    startTransition(async () => {
      const res = await fetch("/api/careers/apply", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Gönderilemedi");
        return;
      }
      toast.success("Başvurunuz alındı. Kısa sürede değerlendirilecek.");
      form.reset();
      setFileName(null);
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="bg-background border border-border rounded-xl p-6 md:p-8 space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
        Başvuru Formu
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Ad Soyad</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-posta</Label>
          <Input id="email" name="email" type="email" required />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon</Label>
          <Input id="phone" name="phone" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedinUrl">LinkedIn</Label>
          <Input id="linkedinUrl" name="linkedinUrl" placeholder="https://linkedin.com/in/..." />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="coverLetter">Kısa ön yazı</Label>
        <Textarea id="coverLetter" name="coverLetter" rows={4} />
      </div>
      <div className="space-y-2">
        <Label>CV (PDF, max 5MB)</Label>
        <label className="flex items-center gap-2 border border-dashed border-border rounded-md px-4 py-3 cursor-pointer hover:bg-muted text-sm">
          <Paperclip className="h-4 w-4 text-muted-foreground" />
          <span className={fileName ? "" : "text-muted-foreground"}>
            {fileName ?? "CV yüklemek için seçin..."}
          </span>
          <input
            type="file"
            name="cv"
            accept="application/pdf"
            required
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          />
        </label>
      </div>
      <Button type="submit" disabled={isPending} className="w-full md:w-auto">
        {isPending ? "Gönderiliyor..." : "Başvuruyu Gönder"}
      </Button>
    </form>
  );
}
