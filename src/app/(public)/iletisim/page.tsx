import { getSiteSettings } from "@/lib/site";
import { Container } from "@/components/shared/Container";
import { ContactForm } from "@/components/public/ContactForm";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export const revalidate = 3600;

export const metadata = {
  title: "İletişim",
  description:
    "i-grup ile iletişime geçin: adres, telefon, e-posta ve iletişim formu.",
};

export default async function IletisimPage() {
  const s = await getSiteSettings();
  const mapQuery = s.address ? encodeURIComponent(s.address) : "Istanbul";
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=28.8,40.9,29.2,41.1&layer=mapnik&marker=41.08,29.02`;

  return (
    <Container className="py-12 md:py-20">
      <header className="max-w-3xl mb-10 md:mb-14">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">İletişim</h1>
        <p className="text-muted-foreground mt-3 text-base md:text-lg">
          Projeniz hakkında konuşmak için aşağıdaki kanallardan bize ulaşın.
        </p>
      </header>

      <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-6">
          <ul className="space-y-4">
            {s.email ? (
              <li className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">E-posta</p>
                  <a
                    href={`mailto:${s.email}`}
                    className="font-medium hover:text-primary"
                  >
                    {s.email}
                  </a>
                </div>
              </li>
            ) : null}
            {s.phone ? (
              <li className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefon</p>
                  <a
                    href={`tel:${s.phone.replace(/\s/g, "")}`}
                    className="font-medium hover:text-primary"
                  >
                    {s.phone}
                  </a>
                </div>
              </li>
            ) : null}
            {s.whatsapp ? (
              <li className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp</p>
                  <a
                    href={`https://wa.me/${s.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:text-primary"
                  >
                    {s.whatsapp}
                  </a>
                </div>
              </li>
            ) : null}
            {s.address ? (
              <li className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Adres</p>
                  <p className="font-medium">{s.address}</p>
                </div>
              </li>
            ) : null}
          </ul>
          {s.address ? (
            <div className="rounded-xl overflow-hidden border border-border">
              <iframe
                src={mapUrl}
                className="w-full h-64"
                loading="lazy"
                title={`${s.siteName} harita`}
              />
              <a
                href={`https://www.openstreetmap.org/search?query=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-center py-2 text-muted-foreground hover:bg-muted"
              >
                Haritada büyük gör
              </a>
            </div>
          ) : null}
        </div>
        <div className="lg:col-span-3">
          <ContactForm />
        </div>
      </div>
    </Container>
  );
}
