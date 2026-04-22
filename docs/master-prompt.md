# i-grup.com — Kurumsal Tanıtım Sitesi
## Claude Code Master Prompt (Next.js 15 + Custom Admin)

> **Amaç:** i-grup.com domaininde yayınlanacak, yaklaşık 15 projeyi kurumsal ölçekte tanıtan, tüm içeriği admin panelden yönetilebilen, 2-3 saatlik bir sprint'te tamamlanacak bir kurumsal web sitesi. Hiçbir sayfa 404 vermemeli, tüm içerikler veritabanından beslenmelidir.

> **Şirket profili:** Pazaryeri yazılımı, e-ticaret siteleri, kozmetik/dermo e-ticaret uygulamaları, kurye/saha operasyonları uygulamaları, B2B kapalı pazaryeri platformları geliştiren yazılım grubu. Hedef: potansiyel kurumsal müşterilere güven veren, portföy ağırlıklı, sade ve modern bir kurumsal kimlik sitesi.

---

## 1. Teknik Stack (kesin, değiştirme)

| Katman | Seçim | Sebep |
|---|---|---|
| Framework | **Next.js 15** (App Router, Server Components) | SSR/ISR + Server Actions admin için ideal |
| Dil | **TypeScript (strict)** | Tip güvenliği şart |
| DB | **PostgreSQL** (prod) / **SQLite** (dev fallback) | Hostinger VPS ile uyumlu |
| ORM | **Prisma** | Migrate + seed + tip çıkarımı |
| Auth | **NextAuth v5 (Auth.js)** — Credentials provider | Tek admin kullanıcı yeterli |
| UI | **Tailwind CSS v4 + shadcn/ui** | Hızlı, tutarlı |
| Form | **React Hook Form + Zod** | Client + server validation paylaşımı |
| Rich Text | **TipTap** (StarterKit + Image + Link) | Sayfa ve proje içerikleri için |
| Upload | **Local filesystem** → `public/uploads/` + Sharp ile otomatik webp | S3 overkill |
| Icon | **Lucide React** | shadcn/ui ile uyumlu |
| Animasyon | **Framer Motion** (sadece hero ve kart hover) | Abartma |
| Email (iletişim formu) | **Resend** ya da SMTP (Nodemailer) — `.env` üzerinden seçilebilir | |
| SEO | next-sitemap + native metadata API | |
| State (admin) | **Server Actions + revalidatePath** | Redux/Zustand yok |
| Güvenlik | CSRF (NextAuth), rate limit (upstash/ratelimit veya in-memory), helmet-equivalent headers | |

---

## 2. Klasör Yapısı

```
i-grup/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   ├── uploads/              # kullanıcı yüklemeleri (gitignore)
│   ├── logo.svg
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── layout.tsx              # Public header + footer
│   │   │   ├── page.tsx                # Ana sayfa
│   │   │   ├── hakkimizda/page.tsx
│   │   │   ├── misyonumuz/page.tsx
│   │   │   ├── hizmetlerimiz/
│   │   │   │   ├── page.tsx            # Hizmet listesi
│   │   │   │   └── [slug]/page.tsx     # Hizmet detayı
│   │   │   ├── projelerimiz/
│   │   │   │   ├── page.tsx            # 15 proje grid
│   │   │   │   └── [slug]/page.tsx     # Proje detayı (galeri, tech stack)
│   │   │   ├── kariyer/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx     # İş ilanı detayı + başvuru formu
│   │   │   └── iletisim/page.tsx
│   │   ├── (admin)/
│   │   │   └── admin/
│   │   │       ├── layout.tsx          # Auth guard + sidebar
│   │   │       ├── page.tsx            # Dashboard (sayaçlar)
│   │   │       ├── login/page.tsx
│   │   │       ├── banners/
│   │   │       ├── pages/              # Statik sayfalar (hakkımızda vb.)
│   │   │       ├── services/
│   │   │       ├── projects/
│   │   │       ├── careers/
│   │   │       ├── messages/           # İletişim formu mesajları
│   │   │       ├── media/              # Upload galerisi
│   │   │       └── settings/           # Logo, SEO, footer, iletişim bilgileri
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── upload/route.ts         # File upload endpoint
│   │   │   └── contact/route.ts        # İletişim formu
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── layout.tsx                  # Root layout
│   ├── components/
│   │   ├── ui/                         # shadcn/ui
│   │   ├── public/                     # HeroSlider, ServiceCard, ProjectCard, Footer...
│   │   ├── admin/                      # DataTable, MediaPicker, RichTextEditor, ImageUploader
│   │   └── shared/
│   ├── lib/
│   │   ├── auth.ts                     # NextAuth config
│   │   ├── db.ts                       # Prisma client singleton
│   │   ├── uploads.ts                  # Sharp resize + webp dönüşüm
│   │   ├── slug.ts                     # Türkçe karakter destekli slugify
│   │   ├── mailer.ts                   # Resend/Nodemailer wrapper
│   │   └── validators/                 # Zod şemaları (paylaşımlı)
│   ├── actions/                        # Server Actions (admin CRUD)
│   └── types/
├── .env.example
├── next.config.ts
├── tailwind.config.ts
└── README.md
```

---

## 3. Prisma Şeması (tam şema — olduğu gibi kullan)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String
  role         String   @default("admin")
  createdAt    DateTime @default(now())
}

model Banner {
  id          String   @id @default(cuid())
  title       String
  subtitle    String?
  imageUrl    String
  ctaText     String?
  ctaUrl      String?
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Page {
  id            String   @id @default(cuid())
  slug          String   @unique          // "hakkimizda", "misyonumuz"
  title         String
  subtitle      String?
  heroImageUrl  String?
  content       String   @db.Text         // TipTap HTML
  seoTitle      String?
  seoDescription String?
  updatedAt     DateTime @updatedAt
}

model Service {
  id            String   @id @default(cuid())
  slug          String   @unique
  title         String
  shortDesc     String                   // kart üzerinde görünen 1-2 cümle
  icon          String?                  // Lucide icon name
  coverImage    String?
  content       String   @db.Text
  order         Int      @default(0)
  isActive      Boolean  @default(true)
  seoTitle      String?
  seoDescription String?
  createdAt     DateTime @default(now())
}

model Project {
  id            String   @id @default(cuid())
  slug          String   @unique
  title         String
  client        String?                  // "Özel sektör müşterisi" de olabilir
  category      String                   // "E-ticaret", "Pazaryeri", "B2B", "Mobil"...
  shortDesc     String
  content       String   @db.Text
  coverImage    String
  gallery       String[]                 // JSON array of urls
  techStack     String[]                 // ["Laravel", "Next.js", "PostgreSQL"]
  liveUrl       String?
  year          Int?
  isFeatured    Boolean  @default(false)
  order         Int      @default(0)
  seoTitle      String?
  seoDescription String?
  createdAt     DateTime @default(now())
}

model Career {
  id            String   @id @default(cuid())
  slug          String   @unique
  title         String
  department    String                   // "Yazılım", "Tasarım", "Operasyon"
  location      String                   // "İstanbul / Uzaktan"
  type          String                   // "Tam Zamanlı", "Yarı Zamanlı"
  shortDesc     String
  content       String   @db.Text
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
}

model ContactMessage {
  id        String   @id @default(cuid())
  name      String
  email     String
  phone     String?
  subject   String
  message   String   @db.Text
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
}

model Media {
  id         String   @id @default(cuid())
  filename   String
  path       String                      // /uploads/2026/04/foo.webp
  mimeType   String
  size       Int
  width      Int?
  height     Int?
  alt        String?
  createdAt  DateTime @default(now())
}

model SiteSetting {
  id              String  @id @default("singleton")
  siteName        String  @default("i-grup")
  logoUrl         String?
  faviconUrl      String?
  tagline         String?
  email           String?
  phone           String?
  address         String?
  whatsapp        String?
  linkedinUrl     String?
  instagramUrl    String?
  xUrl            String?
  footerText      String?
  defaultSeoTitle String?
  defaultSeoDesc  String?
  gtmId           String?
  updatedAt       DateTime @updatedAt
}
```

---

## 4. Public Sayfa Yapısı — İçerik Blokları

### 4.1 `/` Ana Sayfa
1. **Hero Slider** — `Banner` tablosundan beslenen, 3-5 slide, autoplay (8s), sol/sağ ok + dot navigation, mobilde swipeable.
2. **Kısa değer önermesi** — `SiteSetting.tagline` + 3 rakam (Proje sayısı, Müşteri sayısı, Yıl tecrübesi) — rakamlar `SiteSetting`'den gelsin.
3. **Hizmetlerimiz bölümü** — `Service` tablosundan `isActive=true` olanların ilk 6 tanesi, grid (desktop 3 kolon, tablet 2, mobile 1), "Tümünü Gör" CTA.
4. **Öne Çıkan Projeler** — `Project.isFeatured=true` olanların en fazla 6 tanesi, masonry veya 3 kolon grid, hover'da overlay + proje adı + kategori.
5. **Çözüm kategorileri banner'ı** — Pazaryeri / E-Ticaret / Kozmetik / Kurye / B2B — ikon + başlık + kısa açıklama + ilgili hizmet sayfasına link. Tek satır veya 2x3 grid.
6. **Müşteri referans logoları** (opsiyonel, varsa `SiteSetting`'de bir json field eklenebilir; şimdilik skip).
7. **CTA band** — "Projenizi birlikte planlayalım" → İletişim sayfasına.
8. **Mini iletişim formu** — Footer üstünde, ad / email / kısa mesaj.

### 4.2 `/hakkimizda`, `/misyonumuz`
Tek bir generic `DynamicPage` component'ı bu iki route'u da renderlasın. Veri kaynağı: `Page` modeli, slug'a göre. Fields:
- Hero image (full width, 400-500px)
- Başlık + subtitle
- TipTap ile yönetilen prose içerik (max-width container)
- Altında opsiyonel CTA

### 4.3 `/hizmetlerimiz`
- Üstte kısa intro (içerik: `Page` modelinde `slug='hizmetlerimiz'` bir kayıt)
- Grid: `Service` listesi (ikon + başlık + shortDesc + "Detay" linki)

### 4.4 `/hizmetlerimiz/[slug]`
- Hero (coverImage + title + shortDesc)
- TipTap içerik
- "Bu alanda yaptığımız projeler" — aynı kategorideki 3-4 Project kartı
- İletişim CTA

### 4.5 `/projelerimiz`
- Kategori filtre chip'leri (URL query: `?kategori=e-ticaret`) — kategori listesi distinct `Project.category`'den türetilsin.
- Grid: cover + title + category + yıl
- Her kart tıklanınca detaya

### 4.6 `/projelerimiz/[slug]`
- Full-width cover
- Başlık, müşteri, yıl, kategori meta bilgisi
- Tech stack chip'leri
- TipTap içerik (challenge / çözüm / sonuç)
- Galeri (lightbox ile — basit bir dialog yeterli, yalnızca `Project.gallery` arrayinden)
- Live URL varsa "Siteyi Ziyaret Et" butonu
- Altta "Diğer Projeler" — 3 random/sıralı proje

### 4.7 `/kariyer`
- Intro (içerik: `Page` `slug='kariyer'`)
- Aktif iş ilanları listesi (`Career.isActive=true`): başlık + departman + lokasyon + tip + "Detay"
- Aktif ilan yoksa: "Şu an aktif ilanımız yok ancak CV'nizi `kariyer@i-grup.com` adresine gönderebilirsiniz" mesajı

### 4.8 `/kariyer/[slug]`
- İlan detayı (TipTap)
- Basit başvuru formu: ad, email, telefon, LinkedIn, kısa ön yazı, CV upload (PDF, max 5MB)
- Başvuru → email olarak `SiteSetting.email`'e gönderilsin + DB'ye kaydedilsin (opsiyonel `Application` modeli ekleyebilirsin ama scope out tutmak için sadece email yeterli)

### 4.9 `/iletisim`
- İletişim bilgileri (adres + harita iframe + telefon + email + WhatsApp)
- Form: ad, email, telefon, konu, mesaj → `ContactMessage` tablosuna kaydet + admin'e email
- KVKK onay checkbox'ı (zorunlu)

### 4.10 Global
- **Header:** Logo + menü (Ana Sayfa, Hakkımızda, Misyonumuz, Hizmetlerimiz, Projelerimiz, Kariyer, İletişim) + sağda "Teklif Al" CTA butonu. Mobilde hamburger.
- **Footer:** Logo + tagline + hızlı linkler + iletişim + sosyal medya ikonları + copyright + KVKK/Gizlilik Politikası linkleri (bu 2 sayfa `Page` modelinde hazır olarak seed edilsin: `slug='kvkk'`, `slug='gizlilik-politikasi'`).

---

## 5. Admin Panel

### 5.1 Genel Davranış
- `/admin` altındaki tüm route'lar NextAuth middleware ile korunur. Oturum yoksa `/admin/login`'e redirect.
- Layout: Sol sidebar (Dashboard, Banner'lar, Sayfalar, Hizmetler, Projeler, Kariyer, Mesajlar, Medya, Ayarlar) + üstte user dropdown (çıkış yap).
- Tüm CRUD işlemleri **Server Actions** ile; mutation sonrası `revalidatePath` veya `revalidateTag` ile public cache invalidate edilsin.
- Form validation: Zod şemaları `src/lib/validators/` altında paylaşımlı (hem client hem server action aynı şemayı kullansın).
- Toast bildirimleri: `sonner` (shadcn ile uyumlu).

### 5.2 Ekranlar (minimum)

| Route | İçerik |
|---|---|
| `/admin` | Dashboard: toplam proje/hizmet/mesaj/banner sayıları + okunmamış mesaj badge'i + son 5 iletişim mesajı |
| `/admin/banners` | Liste (drag-drop sıralama) + Ekle/Düzenle dialog: başlık, subtitle, görsel (MediaPicker), CTA text, CTA URL, aktif switch |
| `/admin/pages` | Önceden seed edilmiş sayfaların (Hakkımızda, Misyonumuz, Hizmetlerimiz intro, Kariyer intro, KVKK, Gizlilik) düzenleme listesi. Yeni sayfa ekleme kapalı — sadece düzenle. Form: başlık, subtitle, hero image, TipTap içerik, SEO başlık/açıklama |
| `/admin/services` | CRUD: liste + ekle/düzenle/sil. Alanlar: title, slug (otomatik, override edilebilir), shortDesc, icon (Lucide picker — basit bir dropdown), coverImage, TipTap content, order, isActive |
| `/admin/projects` | CRUD: liste (filter: category, isFeatured) + ekle/düzenle. Alanlar: title, slug, client, category (dropdown — mevcut kategorilerden + "yeni kategori" option), shortDesc, cover, gallery (multi-upload), techStack (tag input), liveUrl, year, isFeatured, TipTap content |
| `/admin/careers` | CRUD: liste + ekle/düzenle. Alanlar: title, slug, department, location, type, shortDesc, TipTap content, isActive |
| `/admin/messages` | Gelen iletişim mesajları listesi. Detay dialog. Okundu işaretle. Silme. Filtre: okundu/okunmadı |
| `/admin/media` | Yüklenen tüm görsellerin grid view'ı. Sil. MediaPicker bu tabloyu kullanır. Upload direkt bu sayfadan da yapılabilir |
| `/admin/settings` | Tek kayıtlı `SiteSetting` formu — logo, favicon, tagline, email, phone, address, whatsapp, sosyal linkler, footer text, default SEO, GTM ID |

### 5.3 Kritik Component'lar (admin/)

**`<MediaPicker />`** — Bir input'un yanında "Görsel Seç" butonu. Tıklanınca dialog açılır: sol tarafta yüklü medyalar grid, üstte upload butonu, seçince url ve alt text parent'a döner. Her yerde bu component kullanılsın.

**`<RichTextEditor />`** — TipTap wrapper. Toolbar: bold, italic, underline, h2, h3, bullet list, ordered list, link, image (MediaPicker ile), undo, redo. Output: HTML string.

**`<ImageUploader />`** — Tek dosya upload. Drag-drop + click to upload. Backend'e multipart POST `/api/upload`. Backend Sharp ile max 1920px genişliğe küçültsün ve webp'e çevirsin. `Media` tablosuna kayıt açsın. Response: `{ url, id }`.

**`<SortableList />`** — Banner ve Service için. `@dnd-kit/core` ile. Sürükle-bırak sonrası server action ile `order` alanları güncellensin.

**`<DataTable />`** — shadcn/ui DataTable. Pagination + search + sort. Projects, Services, Careers listelerinde.

### 5.4 Seed / İlk Kullanıcı
`prisma/seed.ts`:
- Bir admin user yarat: email `.env`'den (`ADMIN_EMAIL`, `ADMIN_PASSWORD`). Şifre bcrypt ile hash'lensin.
- `SiteSetting` singleton kaydı oluştur (boş default'larla).
- `Page` kayıtları: `hakkimizda`, `misyonumuz`, `hizmetlerimiz`, `kariyer`, `kvkk`, `gizlilik-politikasi` — hepsi placeholder Lorem içerikle.
- 5 örnek `Service` kaydı: "Pazaryeri Geliştirme", "E-Ticaret Siteleri", "Kozmetik & Dermokozmetik Platformları", "B2B Kapalı Pazaryeri", "Kurye & Saha Operasyonu Uygulamaları".
- 15 örnek `Project` kaydı (placeholder başlık/kategori/görsel — unsplash URL'i olabilir). Kategorileri yukarıdaki 5 hizmete dağıt. 6 tanesi `isFeatured=true` olsun.
- 3 örnek `Career` ilanı.
- 3 örnek `Banner` kaydı.

---

## 6. Tasarım Sistemi

**Stil yönü:** Sade, kurumsal, teknoloji odaklı. Trendyol/Hepsiburada'nın aksine — daha B2B, daha Linear/Vercel/Stripe-esque. Portföy sunumu ağırlıklı.

**Renk paleti (CSS değişkeni olarak `globals.css`):**
- `--bg`: `#0A0A0B` (koyu tema koyusu — kullanılmayabilir)
- `--primary`: `#1E40AF` (kurumsal lacivert) — ya da daha modern bir `#2563EB` (indigo-600)
- `--accent`: `#0EA5E9` (sky-500)
- `--foreground`: `#0F172A`
- `--muted`: `#F1F5F9`
- `--muted-foreground`: `#64748B`
- `--border`: `#E2E8F0`

**Tipografi:**
- Başlıklar: **Inter** (variable) — `font-semibold` / `font-bold`
- Gövde: **Inter** — 16px base
- Türkçe karakter desteği için Google Fonts üzerinden `latin-ext` subset dahil edilsin

**Container:** max-width `1280px` (`max-w-7xl`), yatay padding `px-4 md:px-6 lg:px-8`.

**Kart tasarımı:** beyaz bg, `border border-border`, `rounded-xl`, hover'da hafif shadow + çerçeve rengi koyulaşır. Agresif gölge **yok**.

**Animasyonlar:** Sadece (a) hero slide geçişi, (b) kart hover scale 1.02, (c) fade-in on scroll (IntersectionObserver + Tailwind). Başka yerde animasyon ekleme.

**Breakpoint'ler:** Tailwind default. Mobil öncelikli yaz (< 640px → sm → md → lg → xl).

**Accessibility:** Alt text tüm görsellerde (Media modelinden), semantic HTML, form label'ları, contrast AA.

---

## 7. Lokalizasyon & Türkçe Detaylar

- Tüm arayüz metni Türkçe. `t()` fonksiyonu kullanma, hardcoded Türkçe yeterli.
- **Slug üretimi:** Özel bir `slugify` fonksiyonu yaz (ç→c, ğ→g, ı→i, ö→o, ş→s, ü→u). `src/lib/slug.ts`.
- **Tarih formatı:** `dd.MM.yyyy`. `date-fns` + `tr` locale.
- **Para birimi:** Şu anki scope'ta geçmiyor.
- **SEO:** Türkçe başlık ve description. OG görselleri 1200x630.
- Form hata mesajları Türkçe: "Bu alan zorunludur", "Geçersiz e-posta adresi", vb.

---

## 8. SEO & Performans

- Her sayfa için `generateMetadata` — DB'deki SEO field'larından beslensin, yoksa SiteSetting default'larına fallback.
- **OpenGraph + Twitter Card** — cover image SEO image olarak kullanılsın.
- **Structured data (JSON-LD):** `Organization` (ana sayfa), `BreadcrumbList` (iç sayfalar), `JobPosting` (kariyer detayları).
- **sitemap.xml** — dinamik, tüm Page + Service + Project + Career kayıtlarını içersin (slug bazlı).
- **robots.txt** — `/admin` ve `/api` disallow.
- **Image optimization** — `next/image` zorunlu, `sizes` prop'u doğru kullanılsın.
- **ISR:** Public sayfalar için `revalidate = 3600` (1 saat). Admin CRUD'da manuel `revalidatePath` trigger'ı.
- **Lighthouse hedef:** Performance 90+, SEO 100, Accessibility 95+.

---

## 9. Ortam Değişkenleri (`.env.example`)

```bash
DATABASE_URL="postgresql://user:pass@localhost:5432/igrup"
NEXTAUTH_SECRET="<openssl rand -base64 32>"
NEXTAUTH_URL="http://localhost:3000"

ADMIN_EMAIL="admin@i-grup.com"
ADMIN_PASSWORD="<seed sırasında kullanılacak, bir kere>"

# Mail (biri seçilsin)
RESEND_API_KEY=""
# ya da
SMTP_HOST=""
SMTP_PORT=587
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM="no-reply@i-grup.com"

# Upload path override (opsiyonel, default public/uploads)
UPLOAD_DIR="./public/uploads"
MAX_UPLOAD_SIZE_MB=5

NEXT_PUBLIC_SITE_URL="https://i-grup.com"
```

---

## 10. Deployment Notları (VPS + CloudPanel)

1. Node 20 LTS + pnpm.
2. `pnpm build` sonrası `pnpm start` — port `3000`.
3. CloudPanel → "Node.js App" — domain: `i-grup.com`, app root: `/home/igrup/htdocs/i-grup`.
4. Reverse proxy CloudPanel otomatik halleder. Force HTTPS enable.
5. PostgreSQL DB CloudPanel'de oluştur, DATABASE_URL'e ekle.
6. PM2 yerine CloudPanel Node app manager'ı kullan (restart on boot yapıyor).
7. `public/uploads` klasörünü symbolic link ile `.next` build dışına taşı (build'de wipe olmaması için): `/home/igrup/persistent-uploads` → symlink `public/uploads`.
8. Cron: gece yarısı `next-sitemap` regenerate (opsiyonel, dinamik sitemap kullanıldığı için gereksiz).
9. İlk deploy sonrası `pnpm prisma migrate deploy` + `pnpm prisma db seed`.

---

## 11. Uygulama Planı (Phase-Based — Claude Code için sırayla çalış)

> Her phase'i ayrı bir commit olarak işle. Phase tamamlanmadan sonrakine geçme. Her phase sonunda bana özet ver.

### Phase 0 — Kurulum (15 dk)
- `pnpm create next-app` (TS, Tailwind, App Router, src dir, import alias `@/*`)
- shadcn/ui init + şu componentlar: button, card, input, textarea, label, select, dialog, dropdown-menu, table, tabs, sheet, toast (sonner), switch, checkbox, badge, avatar, separator, skeleton
- Prisma init + PostgreSQL schema + migrate
- NextAuth v5 kurulum
- ESLint + Prettier + husky (opsiyonel)
- `.env.example` + README

### Phase 1 — Data Layer & Seed (25 dk)
- Tüm Prisma modelleri yaz
- `prisma/seed.ts` — placeholder 15 proje, 5 hizmet, 3 kariyer, 3 banner, 6 page, SiteSetting, admin user
- `src/lib/db.ts` singleton
- `src/lib/validators/` — Zod şemaları (her model için create/update)
- `src/lib/slug.ts` (Türkçe karakter destekli)

### Phase 2 — Auth & Admin Shell (20 dk)
- NextAuth config (Credentials + bcrypt)
- `/admin/login` sayfası
- Admin layout + sidebar + protected route middleware
- Dashboard placeholder (sayaç kartları)

### Phase 3 — Upload & Media (20 dk)
- `/api/upload` — multipart handler, Sharp ile webp dönüşüm, Media kaydı
- `<MediaPicker />` component
- `<ImageUploader />` component
- `/admin/media` sayfası (grid + sil + upload)

### Phase 4 — Rich Text Editor (15 dk)
- `<RichTextEditor />` — TipTap + toolbar + MediaPicker entegrasyonu
- Admin formlarında kullanılmaya hazır

### Phase 5 — Admin CRUD'lar (40 dk)
- `/admin/banners` — CRUD + sortable
- `/admin/pages` — edit only
- `/admin/services` — CRUD + sortable + active toggle
- `/admin/projects` — CRUD + gallery multi-upload + tech stack tag input + isFeatured
- `/admin/careers` — CRUD + active toggle
- `/admin/messages` — list + detail + mark read + delete
- `/admin/settings` — singleton form

### Phase 6 — Public Sayfalar (40 dk)
- Public layout: Header + Footer + container
- `/` — HeroSlider (Framer Motion), Services grid, Featured Projects, Kategori banner, CTA band, Mini contact
- `/hakkimizda`, `/misyonumuz` — DynamicPage
- `/hizmetlerimiz` + `/hizmetlerimiz/[slug]`
- `/projelerimiz` + filter + `/projelerimiz/[slug]` + galeri lightbox
- `/kariyer` + `/kariyer/[slug]` + başvuru formu
- `/iletisim` + form + `/api/contact` endpoint

### Phase 7 — SEO & Polish (15 dk)
- `sitemap.ts`, `robots.ts`
- `generateMetadata` her route için
- JSON-LD structured data
- 404 ve error page'ler (Türkçe, güzel tasarlanmış)
- Lighthouse audit ve düzeltmeler
- Son kontrol: tüm linkler çalışıyor mu, hiçbir sayfa 404 vermiyor mu

### Phase 8 — Production Hazırlığı (10 dk)
- `pnpm build` temiz geçmeli
- README.md — kurulum, seed, deploy adımları
- `.env.production.example`
- Git commit + push

**Toplam tahmini süre: ~3 saat** (Claude Code paralel çalışabilir, 2 saatte de bitebilir)

---

## 12. Definition of Done (teslim öncesi kontrol listesi)

- [ ] `pnpm build` hatasız geçiyor
- [ ] `pnpm lint` temiz
- [ ] Prisma migrate + seed temiz çalışıyor
- [ ] `/admin/login` ile giriş yapılabiliyor
- [ ] Admin panelde her modül için en az 1 kayıt oluşturup silebiliyorum
- [ ] Banner eklediğimde ana sayfa hero'da çıkıyor
- [ ] Proje eklediğimde `/projelerimiz` ve `/projelerimiz/[slug]` erişilebilir
- [ ] Tüm menü linkleri çalışıyor, hiçbir sayfa 404 vermiyor
- [ ] İletişim formu gönderildiğinde DB'ye kaydediliyor ve admin mesajlar sekmesinde görünüyor
- [ ] Kariyer başvuru formu PDF yüklüyor ve email gönderiyor
- [ ] Görsel yüklediğimde webp'e dönüşüyor ve boyut optimize
- [ ] Mobilde tüm sayfalar düzgün görünüyor (375px, 768px, 1280px test et)
- [ ] Lighthouse Performance ≥ 90, SEO = 100, Accessibility ≥ 95
- [ ] `sitemap.xml` ve `robots.txt` erişilebilir ve doğru içerikte
- [ ] Admin panelde yaptığım değişiklik public tarafta max 1 dakika içinde görünüyor (veya revalidate çalışıyor)
- [ ] `.env.example` güncel, hiçbir secret repo'ya commit edilmemiş
- [ ] README deploy adımlarını içeriyor

---

## 13. Yapmayacaklarımız (scope guard — sapma)

- ❌ Multi-language (şu an sadece TR)
- ❌ Blog / haber modülü
- ❌ Çoklu admin / rol yönetimi
- ❌ Stripe / ödeme
- ❌ Analytics dashboard (GTM ID setting yeterli)
- ❌ Live chat widget
- ❌ Dark mode (istenirse sonra eklenir)
- ❌ Versiyonlama / draft-publish workflow
- ❌ S3 / CDN (şimdilik local uploads yeterli)
- ❌ Redis cache (Next.js native cache yeterli)

Scope dışı bir özellik ihtiyacı doğduğunda **bana sor**, kendi kararınla ekleme.

---

## 14. Başlangıç Talimatı (Claude Code'a)

> Bu dokümanı baştan sona oku. Soru varsa **şimdi** sor — sprint başladıktan sonra değil. Belirsiz noktalarda kendi kararını verip devam et, ancak mimari etkisi olan kararlar için (örn: tercih edilmeyen bir library seçimi) önce onay iste. Phase 0'dan başla, her phase sonunda kısa bir özet ver ve bir sonrakine geçeceğini bildir. `todo.md` dosyası tut, ilerlemeyi işaretle.
