"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

interface Props {
  heading: string;
  highlight?: string | null;
  lead: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  officeHours: string | null;
  eyebrow?: string | null;
  emailLabel?: string | null;
  phoneLabel?: string | null;
  officeLabel?: string | null;
  hoursLabel?: string | null;
  formTitle?: string | null;
  nameLabel?: string | null;
  namePlaceholder?: string | null;
  emailFieldLabel?: string | null;
  emailPlaceholder?: string | null;
  companyLabel?: string | null;
  companyPlaceholder?: string | null;
  messageLabel?: string | null;
  messagePlaceholder?: string | null;
  submitLabel?: string | null;
  sendingLabel?: string | null;
  successLabel?: string | null;
  privacyText?: string | null;
  subject?: string | null;
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
  eyebrow,
  emailLabel,
  phoneLabel,
  officeLabel,
  hoursLabel,
  formTitle,
  nameLabel,
  namePlaceholder,
  emailFieldLabel,
  emailPlaceholder,
  companyLabel,
  companyPlaceholder,
  messageLabel,
  messagePlaceholder,
  submitLabel,
  sendingLabel,
  successLabel,
  privacyText,
  subject,
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
      subject: subject || "İletişim formu - i-Grup",
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

  const cleanHighlight = highlight?.trim() ?? "";
  const parts = cleanHighlight ? heading.split(cleanHighlight) : [heading];
  const before = parts[0] ?? heading;
  const after = cleanHighlight && parts.length > 1 ? parts.slice(1).join(cleanHighlight) : "";

  return (
    <section
      id="iletisim"
      className="bg-ink text-bg"
      style={{ padding: "96px 0" }}
    >
      <div className="container-site grid md:grid-cols-2 gap-10 md:gap-[72px] items-start">
        <div>
          <div className="eyebrow text-indigo-soft">{eyebrow || "İletişim"}</div>
          <h2
            className="h-display mt-3.5 text-[#F7F5F0]"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
            }}
          >
            {before}
            {cleanHighlight ? (
              <span className="text-indigo-soft">{cleanHighlight}</span>
            ) : null}
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
            <InfoRow label={emailLabel || "E-posta"} value={email} />
            <InfoRow label={phoneLabel || "Telefon"} value={phone} />
            <InfoRow label={officeLabel || "Ofis"} value={address} />
            <InfoRow label={hoursLabel || "Çalışma saatleri"} value={officeHours} />
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
            {formTitle || "İletişim formu"}
          </div>
          <Field
            label={nameLabel || "Ad soyad"}
            value={f.name}
            onChange={(v) => setField("name", v)}
            placeholder={namePlaceholder || "Ayşe Demir"}
            required
          />
          <Field
            label={emailFieldLabel || "E-posta"}
            type="email"
            value={f.email}
            onChange={(v) => setField("email", v)}
            placeholder={emailPlaceholder || "ayse@sirket.com"}
            required
          />
          <Field
            label={companyLabel || "Şirket"}
            value={f.company}
            onChange={(v) => setField("company", v)}
            placeholder={companyPlaceholder || "Şirket / marka adı"}
          />
          <label className="block mb-5">
            <div
              className="text-xs font-semibold mb-1.5 tracking-[0.02em]"
              style={{ color: "rgba(247,245,240,0.7)" }}
            >
              {messageLabel || "Mesajınız"}
            </div>
            <textarea
              value={f.brief}
              onChange={(e) => setField("brief", e.target.value)}
              placeholder={
                messagePlaceholder ||
                "i-Grup Şirketler Topluluğu ile ilgili mesajınızı yazın."
              }
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
              ? successLabel || "Mesajınızı aldık. En kısa sürede döneceğiz."
              : isPending
                ? sendingLabel || "Gönderiliyor..."
                : submitLabel || "Gönder →"}
          </button>
          <div
            className="text-[12px] mt-3.5 text-center"
            style={{ color: "rgba(247,245,240,0.55)" }}
          >
            {privacyText || "Paylaştığınız bilgiler yalnızca bu talep için kullanılır."}
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
