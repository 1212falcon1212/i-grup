# i-grup.com — Kurumsal Tanıtım Sitesi

Next.js 16 + Prisma + NextAuth v5 + Tailwind v4 + shadcn/ui ile geliştirilmiş, admin panelden yönetilebilen kurumsal tanıtım sitesi.

## Özellikler

- **Tüm içerik admin panelden yönetilebilir:** Banner'lar, sayfalar, hizmetler, projeler, kariyer ilanları, mesajlar, medya ve site ayarları.
- **Tek yönetici hesabı** (NextAuth v5 Credentials + bcrypt).
- **Medya yönetimi:** Drag-drop upload, Sharp ile webp dönüşümü, MediaPicker ile tekrar kullanım.
- **TipTap rich text editörü** TR/EN karakter destekli, görsel ve bağlantı ekleme ile.
- **Dinamik SEO:** Sayfa bazlı metadata, sitemap.xml, robots.txt, JSON-LD (Organization, JobPosting).
- **ISR + revalidatePath:** Admin değişiklikleri anında yayına yansır.
- **Türkçe arayüz**, mobile-first, Lighthouse ≥ 90 hedefli.

## Teknik Stack

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 16 (App Router, Server Components, Server Actions) |
| Dil | TypeScript 5 (strict) |
| DB | SQLite (dev) / PostgreSQL (prod) via Prisma 7 |
| Auth | NextAuth v5 Credentials |
| UI | Tailwind CSS v4 + shadcn/ui (new-york, neutral base) |
| Form | React Hook Form + Zod |
| Editor | TipTap (StarterKit + Underline + Image + Link) |
| Upload | Local FS + Sharp (webp, max 1920w) |
| Animasyon | Framer Motion (sadece hero slider) |
| Icons | Lucide React (+ inline SVG brand ikonları) |
| Email | Resend / Nodemailer SMTP / dev console fallback |

## Kurulum (Lokal)

Gereksinimler: **Node 20+** ve **pnpm 9+**.

```bash
# 1. Bağımlılıkları yükle
pnpm install

# 2. Ortam değişkenlerini ayarla
cp .env.example .env
# .env içindeki DATABASE_URL, NEXTAUTH_SECRET, ADMIN_EMAIL/PASSWORD vs. değerleri doldur

# 3. Veritabanı migrasyonları + seed
pnpm prisma migrate dev
pnpm db:seed

# 4. Dev server'ı başlat
pnpm dev
```

Tarayıcıda `http://localhost:3000` açılır. Admin girişi:

- URL: `http://localhost:3000/admin/login`
- Varsayılan e-posta: `admin@i-grup.com` (değiştirmek için `ADMIN_EMAIL` env)
- Varsayılan şifre: `admin123` (değiştirmek için `ADMIN_PASSWORD` env)

> ⚠️ Production'a deploy etmeden önce mutlaka admin şifresini ve `NEXTAUTH_SECRET` değerini değiştirin.

## Ortam Değişkenleri

`.env.example` dosyasında tüm değişkenler listelidir. Özet:

| Değişken | Açıklama |
|---|---|
| `DATABASE_URL` | SQLite için `file:./dev.db`; Postgres için `postgresql://...` |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` ile üretin |
| `NEXTAUTH_URL` | Production URL'i (ör: `https://i-grup.com`) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` | Seed sırasında oluşturulacak admin hesabı |
| `RESEND_API_KEY` | Resend ile mail göndermek için (opsiyonel) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Alternatif SMTP fallback'i |
| `UPLOAD_DIR`, `MAX_UPLOAD_SIZE_MB` | Yükleme dizini ve boyut limiti |
| `NEXT_PUBLIC_SITE_URL` | Metadata ve JSON-LD için tam URL |

## Scriptler

```bash
pnpm dev          # Dev server (Turbopack)
pnpm build        # Production build
pnpm start        # Production server
pnpm lint         # ESLint
pnpm db:migrate   # prisma migrate dev
pnpm db:deploy    # prisma migrate deploy (production)
pnpm db:push      # Schema'yı migrasyon yapmadan senkronla
pnpm db:seed      # Seed scriptini çalıştır
pnpm db:studio    # Prisma Studio (tabloları GUI'de aç)
pnpm db:reset     # DB'yi sıfırla + migrasyonları + seed'i yeniden çalıştır
```

## Proje Yapısı

```
src/
├── app/
│   ├── (public)/        # Public sayfalar (Header/Footer içeren layout)
│   ├── (admin)/admin/   # Yönetici paneli (auth + sidebar)
│   │   ├── (authed)/    # Auth zorunlu rotalar
│   │   └── login/       # Login (auth dışı)
│   ├── api/             # auth, upload, contact, careers/apply
│   ├── sitemap.ts       # Dinamik sitemap
│   ├── robots.ts
│   ├── not-found.tsx    # 404 (TR)
│   └── error.tsx
├── actions/             # Server Actions (admin CRUD)
├── components/
│   ├── ui/              # shadcn componentları
│   ├── public/          # Public UI: HeroSlider, ProjectCard, Footer...
│   ├── admin/           # Admin UI: MediaPicker, RichTextEditor, Sidebar...
│   └── shared/          # Shared: Container, SeoJsonLd, icons
├── lib/
│   ├── auth.ts          # NextAuth config
│   ├── db.ts            # Prisma client singleton (+ SQLite adapter)
│   ├── uploads.ts       # Sharp wrapper + saveRawFile
│   ├── mailer.ts        # Resend/SMTP wrapper
│   ├── rate-limit.ts    # In-memory bucket limiter
│   ├── slug.ts          # Türkçe slugify
│   ├── json-array.ts    # SQLite JSON-string array helper
│   └── validators/      # Zod şemaları (shared client/server)
├── proxy.ts             # Next.js 16 proxy (eski middleware) — /admin guard
└── auth.config.ts       # Edge-safe auth config
```

## Production Deploy (Hostinger VPS + CloudPanel)

### 1. VPS hazırlığı

```bash
# Node.js 20+ kur (nvm veya nodesource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm i -g pnpm pm2

# PostgreSQL oluştur (CloudPanel veya apt)
# CloudPanel → Databases → Add PostgreSQL DB
```

### 2. Prisma PostgreSQL geçişi

Prod için `prisma/schema.prisma` dosyasında provider'ı `postgresql` yapın ve array alanları için helper'ları kaldırıp native `String[]` kullanın:

```prisma
datasource db {
  provider = "postgresql"
}

model Project {
  // ...
  gallery   String[] // artık native Postgres array
  techStack String[]
}
```

> Mevcut helper'lar SQLite için tasarlandı; Postgres'e geçerken `parseArray/stringifyArray` çağrılarını kaldırın ve action/form dosyalarında direkt array kullanın.

### 3. Uygulama kurulumu

```bash
# Repo'yu klonla
cd /home/igrup/htdocs/
git clone <repo-url> i-grup
cd i-grup

# .env üret
cp .env.example .env
# Postgres URL, secret, admin bilgileri vb. doldur

# Bağımlılıklar + build
pnpm install --frozen-lockfile
pnpm prisma migrate deploy
pnpm db:seed
pnpm build

# Persistent uploads dizini (build/deploy'da silinmesin)
mkdir -p /home/igrup/persistent-uploads
rm -rf public/uploads
ln -s /home/igrup/persistent-uploads public/uploads
```

### 4. CloudPanel "Node.js App"

- App root: `/home/igrup/htdocs/i-grup`
- Start command: `pnpm start`
- Port: `3000`
- Node version: 20 LTS
- Force HTTPS: enable

CloudPanel reverse proxy'yi otomatik halleder.

### 5. Güncelleme akışı

```bash
git pull
pnpm install --frozen-lockfile
pnpm prisma migrate deploy
pnpm build
# CloudPanel → Node.js App → Restart
```

## Admin Panel Kullanımı

- **/admin/banners:** Ana sayfa hero slider'ı — drag-drop ile sırala, aktif/pasif.
- **/admin/pages:** 6 seed edilmiş sayfayı düzenle (yeni ekleme yok).
- **/admin/services:** 5 hizmet — sırala, aktif/pasif, ikon seç, TipTap içerik.
- **/admin/projects:** 15 proje — kategori ve featured filtreleri, galeri multi-upload, techStack chips.
- **/admin/careers:** Kariyer ilanları — aktif/pasif toggle.
- **/admin/messages:** Form gönderimleri inbox'ı — filtre, detay, sil.
- **/admin/media:** Galeri — upload, alt text, URL kopyala, sil.
- **/admin/settings:** Logo, iletişim, sosyal medya, SEO defaults, istatistik rakamları.

## Definition of Done — Son Kontrol

- [x] `pnpm build` hatasız
- [x] `pnpm prisma migrate dev` + `pnpm db:seed` temiz çalışır
- [x] `/admin/login` üzerinden giriş yapılabiliyor
- [x] Her admin modülünde kayıt oluşturup silinebiliyor
- [x] Banner eklendiğinde ana sayfa hero'da çıkıyor
- [x] Proje eklendiğinde `/projelerimiz` ve `/projelerimiz/[slug]` erişilebilir
- [x] Tüm menü linkleri 200; bilinmeyen URL 404
- [x] İletişim formu gönderildiğinde DB'ye kayıt + admin mesajlar'da görünür
- [x] Kariyer başvuru formu PDF yüklüyor ve email gönderiyor
- [x] Görsel yüklendiğinde webp'e dönüşüyor
- [x] `sitemap.xml` ve `robots.txt` erişilebilir, doğru içerikli
- [x] Admin değişikliği `revalidatePath` ile public'te hemen yansıyor
- [x] `.env.example` güncel, hiçbir secret commit edilmemiş
- [ ] Lighthouse audit (production build ile ayrıca çalıştırılmalı)

## Lisans

Özel — i-grup.com
