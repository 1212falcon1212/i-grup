import { getSiteSettings } from "@/lib/site";

interface MailInput {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendMail(input: MailInput) {
  const from = process.env.SMTP_FROM ?? "no-reply@i-grup.com";

  // Resend öncelikli
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend");
      const client = new Resend(process.env.RESEND_API_KEY);
      const { error } = await client.emails.send({
        from,
        to: input.to,
        subject: input.subject,
        html: input.html,
        replyTo: input.replyTo,
      });
      if (error) throw new Error(error.message);
      return { ok: true };
    } catch (err) {
      console.error("[mailer] Resend error:", err);
      return { ok: false };
    }
  }

  // SMTP fallback
  if (process.env.SMTP_HOST) {
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.default.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: Number(process.env.SMTP_PORT ?? 587) === 465,
        auth:
          process.env.SMTP_USER && process.env.SMTP_PASS
            ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            : undefined,
      });
      await transporter.sendMail({
        from,
        to: input.to,
        subject: input.subject,
        html: input.html,
        replyTo: input.replyTo,
      });
      return { ok: true };
    } catch (err) {
      console.error("[mailer] SMTP error:", err);
      return { ok: false };
    }
  }

  // Dev: hiçbir provider ayarlı değilse console'a yaz
  console.log("\n[mailer] (dev, no provider configured)");
  console.log(`  to: ${input.to}`);
  console.log(`  subject: ${input.subject}`);
  if (input.replyTo) console.log(`  replyTo: ${input.replyTo}`);
  console.log(`  html: ${input.html.slice(0, 300)}...`);
  return { ok: true, dev: true };
}

export async function getAdminEmail() {
  const settings = await getSiteSettings();
  return settings.email ?? process.env.ADMIN_EMAIL ?? "admin@i-grup.com";
}
