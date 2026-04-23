"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

interface Props {
  heading: string;
  highlight: string;
  lead: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  officeHours: string | null;
}

interface FormValues {
  name: string;
  email: string;
  company: string;
  brief: string;
}

export function Contact({
  heading,
  highlight,
  lead,
  email,
  phone,
  address,
  officeHours,
}: Props) {
  const [f, setF] = useState<FormValues>({
    name: "",
    email: "",
    company: "",
    brief: "",
  });
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  function setField<K extends keyof FormValues>(k: K, v: FormValues[K]) {
    setF((p) => ({ ...p, [k]: v }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload = {
      name: f.name,
      email: f.email,
      company: f.company,
      subject: "Proje brief — i-Grup",
      message: f.brief,
      kvkkConsent: true as const,
    };
    startTransition(async () => {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Gönderilemedi");
        return;
      }
      setSent(true);
      setF({ name: "", email: "", company: "", brief: "" });
    });
  }

  // Split heading around highlight
  const parts = highlight ? heading.split(highlight) : [heading];
  const before = parts[0] ?? heading;
  const after = parts[1] ?? "";

  return (
    <section
      id="iletisim"
      className="bg-ink text-bg"
      style={{ padding: "96px 0" }}
    >
      <div className="container-site grid md:grid-cols-2 gap-10 md:gap-[72px] items-start">
        <div>
          <div className="eyebrow text-indigo-soft">İletişim</div>
          <h2
            className="h-display mt-3.5 text-[#F7F5F0]"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
            }}
          >
            {before}
            {highlight ? <span className="text-indigo-soft">{highlight}</span> : null}
            {after}
          </h2>
          <p
            className="mt-5 max-w-[460px]"
            style={{
              fontSize: 17,
              lineHeight: 1.55,
              color: "rgba(247,245,240,0.75)",
            }}
          >
            {lead}
          </p>
          <div className="grid gap-6 mt-8">
            <InfoRow label="E-posta" value={email} />
            <InfoRow label="Telefon" value={phone} />
            <InfoRow label="Ofis" value={address} />
            <InfoRow label="Çalışma saatleri" value={officeHours} />
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl"
          style={{
            background: "rgba(247,245,240,0.06)",
            border: "1px solid rgba(247,245,240,0.14)",
            padding: 32,
          }}
        >
          <div className="text-[21px] font-semibold text-[#F7F5F0] tracking-[-0.02em] mb-5">
            Proje briefi
          </div>
          <Field
            label="Ad soyad"
            value={f.name}
            onChange={(v) => setField("name", v)}
            placeholder="Ayşe Demir"
            required
          />
          <Field
            label="E-posta"
            type="email"
            value={f.email}
            onChange={(v) => setField("email", v)}
            placeholder="ayse@sirket.com"
            required
          />
          <Field
            label="Şirket"
            value={f.company}
            onChange={(v) => setField("company", v)}
            placeholder="Şirket / marka adı"
          />
          <label className="block mb-5">
            <div
              className="text-xs font-semibold mb-1.5 tracking-[0.02em]"
              style={{ color: "rgba(247,245,240,0.7)" }}
            >
              Kısaca projeniz
            </div>
            <textarea
              value={f.brief}
              onChange={(e) => setField("brief", e.target.value)}
              placeholder="Nasıl bir şey kurmak istersiniz? Hangi sektöre hitap ediyor?"
              rows={5}
              className="w-full text-[15px] focus:outline-none focus:ring-2 focus:ring-indigo-soft/60"
              style={{
                padding: "14px 16px",
                background: "rgba(17,17,24,0.4)",
                border: "1px solid rgba(247,245,240,0.14)",
                borderRadius: 10,
                color: "#F7F5F0",
                resize: "none",
              }}
              required
              minLength={10}
            />
          </label>
          <button
            type="submit"
            disabled={sent || isPending}
            className="w-full text-[15px] font-semibold transition-all"
            style={{
              padding: "16px 20px",
              background: sent
                ? "var(--success)"
                : "linear-gradient(135deg, oklch(0.62 0.18 278), oklch(0.5 0.22 310))",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              cursor: sent || isPending ? "default" : "pointer",
              opacity: isPending ? 0.7 : 1,
              letterSpacing: "0.01em",
            }}
          >
            {sent
              ? "✓ Briefinizi aldık — 24 saat içinde döneceğiz"
              : isPending
                ? "Gönderiliyor..."
                : "Briefi gönder →"}
          </button>
          <div
            className="text-[12px] mt-3.5 text-center"
            style={{ color: "rgba(247,245,240,0.55)" }}
          >
            Paylaştığınız bilgiler yalnızca bu talep için kullanılır.
          </div>
        </form>
      </div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <div className="eyebrow text-indigo-soft">{label}</div>
      <div
        className="font-medium mt-1 text-[#F7F5F0]"
        style={{ fontSize: 19 }}
      >
        {value}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block mb-4">
      <div
        className="text-xs font-semibold mb-1.5 tracking-[0.02em]"
        style={{ color: "rgba(247,245,240,0.7)" }}
      >
        {label}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full text-[15px] focus:outline-none focus:ring-2 focus:ring-indigo-soft/60"
        style={{
          padding: "14px 16px",
          background: "rgba(17,17,24,0.4)",
          border: "1px solid rgba(247,245,240,0.14)",
          borderRadius: 10,
          color: "#F7F5F0",
        }}
      />
    </label>
  );
}
