# Handoff: i-group Kurumsal Web Sitesi

## Overview
i-group (İstanbul merkezli ürün stüdyosu) için kurumsal web sitesi. 13 aktif ürünü (eczane & kozmetik pazaryerleri, B2B platformlar, mobil uygulamalar, muhasebe ERP, tüketici platformları) tanıtan, şirket bilgilerini, sektörleri, referansları, blog yazılarını, kariyer pozisyonlarını ve iletişim formunu içeren tek sayfalık (one-page) kurumsal site.

Hedef hissiyat: **sıcak kurumsal** (krem/off-white arka plan) + **teknoloji çağrışımlı accent** (indigo/mor). Tonlama sade ve güven veren; ürün çeşitliliğini öne çıkaran, fakat "ajans/portfolyo" hissiyatına düşmeyen bir kurumsal kimlik.

## About the Design Files
Bu pakettekiler **HTML içinde hazırlanmış tasarım referanslarıdır** — prototip niteliğindedir, doğrudan kopyalanıp üretime alınacak son kod değillerdir. HTML + React-in-browser (Babel standalone) kullanılarak hızlı prototipleme amacıyla yazıldılar.

Görev, bu HTML tasarımları hedef kod tabanının (Next.js, Remix, Astro, Nuxt, SvelteKit vb.) yerleşik kalıplarıyla **yeniden üretmektir**. Henüz seçilmiş bir framework yoksa: **Next.js 14 + App Router + Tailwind CSS + TypeScript** tercih edilmeli (SEO ve kurumsal kurulum için en uygun kombinasyon). Görseller Unsplash CDN üzerinden çekiliyor — üretim için kendi görsellerinizle değiştirin ve `next/image` (veya muadili) üzerinden optimize edin.

## Fidelity
**High-fidelity (hifi).** Dosyalarda verilen renkler, tipografi, boşluk ve etkileşimler son hedef görünümdür. Pixel-perfect şekilde yeniden üretilmelidir; layout ve ölçüler birebir hedef değerdir.

## Teknik Yaklaşım (Önerilen)
- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS; design token'ları `tailwind.config.ts` içinde tanımlanır
- **Typography:** `next/font/google` ile `Inter` + `JetBrains Mono`
- **Images:** `next/image`; Unsplash yerine ürün ekran görüntüleri + profesyonel çekim görseller
- **Forms:** `react-hook-form` + `zod`; iletişim formu için `app/api/contact/route.ts` (Resend / Postmark)
- **CMS (opsiyonel):** Projeler, blog ve kariyer için Sanity veya Contentful — statik alanlar çok (13 ürün, ~4 blog yazısı, ~4 ilan) olduğu için MVP için TS dosyalarında tutmak yeterli
- **SEO:** `metadata`, `generateMetadata`, `sitemap.ts`, `robots.ts`, OG image template
- **i18n:** Şu an yalnızca **Türkçe**. Gelecekte EN için `next-intl` önerilir

---

## Sayfa Yapısı (Tek Sayfa, 9 Bölüm)

Sayfa aşağıdan yukarı şu sıradadır — tümü aynı route'ta (`/`), bölümler anchor (`#id`) ile bağlanır:

1. **Sticky Navigation** (`<Nav>`)
2. **Hero** (`<Hero>`)
3. **About / Şirket** (`#sirket`)
4. **Projects / Projeler** (`#projeler`) — filtrelenebilir
5. **Sectors / Sektörler** (`#sektorler`)
6. **Clients / Referanslar** (`#referanslar`)
7. **Blog & Haberler** (`#blog`)
8. **Careers / Kariyer** (`#kariyer`)
9. **Contact / İletişim** (`#iletisim`)
10. **Footer**

Ana sayfa container genişliği: `max-width: 1280px`, yatay padding `40px`.

---

## Design Tokens

### Colors
```ts
const palette = {
  // Zemin (warm off-white)
  bg:          '#F7F5F0',  // primary background
  bg2:         '#EDEAE2',  // secondary (alt band, input fields, hover fills)
  bg3:         '#E2DDD2',  // tertiary

  // Metin
  ink:         '#111118',  // primary text, CTAs, dark panels
  ink2:        '#3A3A46',  // secondary text
  mute:        '#6E6E78',  // tertiary / metadata

  // Çizgiler
  rule:        'rgba(17,17,24,0.12)',
  ruleStrong:  'rgba(17,17,24,0.22)',

  // Accent (indigo/violet — oklch)
  indigo:      'oklch(0.42 0.2 278)',
  indigoSoft:  'oklch(0.62 0.18 278)',
  violet:      'oklch(0.5 0.22 310)',

  // Status
  success:     '#16a34a',   // 'Yayında' state
};
```

Ters zemin (Contact + Footer): `ink` + `bg` ve `rgba(247,245,240,0.xx)` tonları.

### Typography
- **Display / Body:** `Inter`, weights: 300 / 400 / 500 / 600 / 700 / 800
- **Mono:** `JetBrains Mono`, weights: 300 / 400 / 500 (yalnızca image slot placeholder ve teknik etiketler için)

Tipografi skalası (kullanıldığı yerler):
| Rol | Size | Weight | Letter-spacing | Line-height |
|---|---|---|---|---|
| Hero H1 | 76px | 700 | -0.035em | 1.02 |
| Section H2 | 52px | 700 | -0.03em | 1.05 |
| Contact H2 | 60px | 700 | -0.03em | 1.02 |
| Featured project title | 32px | 700 | -0.025em | 1.1 |
| Lead article title | 34px | 700 | -0.025em | 1.15 |
| Job role | 19px | 600 | -0.02em | 1.2 |
| Project title | 22px | 700 | -0.025em | 1.1 |
| Body lg | 19px | 400 | — | 1.55 |
| Body | 16px | 400 | — | 1.55–1.6 |
| Body sm | 14px | 400–500 | — | 1.5 |
| Eyebrow / tag | 12–13px | 600 | 0.04–0.06em + UPPERCASE | — |
| Meta / mute | 12.5–13.5px | 500 | — | — |
| Stat number | 34–56px | 700 | -0.03/-0.04em | 1 |

### Spacing
- Section dikey padding: `96px` (hero: `72px 40px 96px`)
- Section header altı boşluk: `48px`
- Grid gap'leri: **12 kolonlu proje gridi** `24px`, diğer grid'ler `16–32px`
- Yatay container padding: `40px`

### Radius
- Cards: `14px`
- Inputs / buttons rect: `10–12px`
- Pills (tag, CTA yuvarlak, filtre düğmeleri): `999px`
- Image slots: `12px` (featured proje kartı görseli: `0` çünkü kartın üstündedir)

### Shadows
- Hover card lift: `0 20px 40px rgba(17,17,24,0.12)`
- Resting card: `0 1px 2px rgba(17,17,24,0.04)`
- Floating overlay kart (Hero): `0 12px 28px rgba(17,17,24,0.12)`

### Grid
- Proje ızgarası: `grid-template-columns: repeat(12, 1fr); gap: 24px;`
  - **Featured kart:** `grid-column: span 8` + aspect `16/9`
  - **Normal kart:** `grid-column: span 4` + aspect `4/3`
  - Featured her 5. kartta (`i % 5 === 0`) — düzenli ritim
- Sektör ızgarası: `grid-template-columns: repeat(6,1fr)`; ilk iki `span 3`, geri kalan `span 2`
- Referanslar: `repeat(5, 1fr)`, 2 satır (10 marka)
- Blog: `1.4fr 1fr` — soldaki lead makale, sağ stack
- Careers: `1fr 1.4fr`, sol kolon `position: sticky; top: 100px`
- Contact: `1fr 1fr`, ters zemin

---

## Components (Detay)

### 1. `<Nav>` — Sticky top bar
- **Davranış:** `scrollY > 24` olduğunda arka plan `rgba(247,245,240,0.88)` + `backdrop-filter: blur(14px)` + alt sınır `rule`
- **Sol:** Logo (28×28 rounded-8 kutu, `linear-gradient(135deg, indigo, violet)` — içinde iki küçük beyaz dikdörtgen "i" harfini temsil eder) + kelime markası "i-group"
- **Orta:** 6 link — Şirket, Projeler, Sektörler, Referanslar, Blog, Kariyer (`fontSize: 14; fontWeight: 500; color: ink2`)
- **Sağ:** "İletişime geç →" pill CTA (`bg: ink; color: bg; padding: 10px 18px; radius: 999px`)
- **Yükseklik:** padding `18px 40px`

### 2. `<Hero>`
- **Layout:** `grid-template-columns: 1.2fr 1fr; gap: 64px; align-items: center`; padding `72px 40px 96px`
- **Sol:**
  - Status pill: yeşil nokta + "İstanbul merkezli ürün stüdyosu · 2014'ten beri" (`bg: bg2; fontSize: 12.5; padding: 7px 14px`)
  - H1: "Eczane, kozmetik ve B2B için **ürün geliştiriyoruz.**" — ikinci cümle `color: indigo`
  - Paragraf 19/1.55, `max-width: 560px`
  - İki CTA: dolu (siyah pill) "Projelerimiz →" + outline "Birlikte çalışalım"
  - Stat satırı: **13** aktif proje · **6** sektör · **120K+** son kullanıcı (gap `40px`)
- **Sağ:**
  - Portrait görsel (`aspect: 4/5`, `radius: 12`)
  - Overlay kart sol-alt `-24px` dışarı: "EKİP / 38 kişi, tek çatı" (beyaz card + shadow `0 12px 28px`)

### 3. `<About>` — #sirket
- Standart section header (eyebrow "Hakkımızda" + H2 + lead paragraf 2 kolonda)
- İki kolonlu alt grid `1.1fr 1fr; gap: 32px`
  - Sol: üstte `16/11` görsel + altında `1fr 1fr` iki kare görsel (`aspect: 1/1`)
  - Sağ: 4 değer kartı dikey stack (`padding: 22px; border: 1px rule; radius: 12px`):
    - Odak — "Uçtan uca ürün geliştirme"
    - Yaklaşım — "Sahaya bakar, üretir, ölçer"
    - Altyapı — "Paylaşımlı ve ölçekli"
    - Destek — "Lansman sonrası devam"
  - Kart başlığı eyebrow 12/600/indigo, value 20/600/ink, açıklama 14/ink2

### 4. `<Projects>` — #projeler
- Section header + filtre satırı (tag pills)
- **Filtre:** Tümü + `IG_PROJECTS` üzerinden türetilen benzersiz `tag`'ler (Pazaryeri, B2B, Mobil, E-ticaret, ERP, Platform, Uygulama)
  - Aktif pill: `bg: ink; color: bg`
  - Pasif: border `rule`, transparent background
  - Sağda sayacıkla: `Tümü 13`, `B2B 6`, vb.
- **Kartlar:** 12 kolonlu grid; `i % 5 === 0` olanlar featured (span 8), diğerleri span 4
- **ProjectCard:**
  - Üstte görsel + iki badge:
    - Sol üst: Status pill (beyaz `rgba(255,255,255,0.92)` + blur), solunda renkli nokta (`Yayında`: `#16a34a`, `Beta`: indigo, `Yakında`: violet)
    - Sağ üst: Tag pill (koyu `rgba(17,17,24,0.72)` + blur + bg text)
  - Altta padding `20–28px`:
    - Başlık (sol) + `sector` metni (sağ, mute)
    - Paragraf (desc, ink2)
    - Alt border ayırıcı + "Lansman · 2023" (sol) + "Siteyi görüntüle →" (sağ, hover'da ok sağa 4px kayar)
  - **Hover:** `translateY(-4px)` + shadow `0 20px 40px rgba(17,17,24,0.12)`
  - Transition: `.3s cubic-bezier(.2,.7,.3,1)`

### 5. `<Sectors>` — #sektorler
- Zemin `bg2`
- 6 kolon grid (5 sektör): ilk iki kart `span 3`, diğerleri `span 2`
- **İkinci kart** ters zeminli (`bg: ink; color: bg`) — vurgu
- Her kart:
  - Üstte büyük sayı `56/700/-0.04em` (accent indigo veya indigoSoft — ters kartta)
  - "ürün" küçük etiket (18/500, mute)
  - Alta sektör adı (19/600) + detay (13.5)
  - Min yükseklik `200px`, `justify-content: space-between`

### 6. `<Clients>` — #referanslar
- Tek bir kutu `radius: 14; border: 1px rule; background: bg`, içinde 5×2 marka grid
- Her hücre: `padding: 34px 18px; center; fontSize: 22; fontWeight: 700; color: ink2`
- Sınırlar: sağ kenarlar (son kolon hariç) `rule`, alt kenar yalnızca ilk satır
- **Hover:** `color: ink; background: bg2`

### 7. `<Blog>` — #blog
- Zemin `bg2`
- `1.4fr 1fr` grid
- **Lead article (sol):** üstte 16/10 görsel, altta padding `32px 34px 36px`
  - Tag pill (bg2 + indigo text) → H3 34px → paragraf → alt satır: tarih (mute) + "Yazının tamamı →"
- **Secondary stack (sağ):** 3 kart, her biri `1fr 1.4fr` grid (görsel solda `4/3`, içerik sağda)
  - Eyebrow: "Ürün · 12 Nis 2026" (indigo uppercase)
  - Başlık 18/700, özet 13.5, "Oku →"

### 8. `<Careers>` — #kariyer
- `1fr 1.4fr` grid
- **Sol sticky:**
  - Eyebrow "Kariyer"
  - H2 48px "Ekibimize katılın."
  - Lead paragraf
  - Ofis görseli (`4/3`)
- **Sağ:** açık pozisyon sayısı eyebrow → tablo-görünümlü liste kartı:
  - Her satır `1.8fr 1fr 1fr 40px` grid, padding `22px 26px`
  - Rol (19/600) + altında "Tam zamanlı" (13/mute)
  - Ekip (13/600/indigo)
  - Konum (13.5/ink2)
  - Ok `→`
  - **Row hover:** `background: bg2`
  - Satır arası `border-bottom: 1px rule`
- Altta "Listede yok mu?" kutusu (bg2 + başvur pill)

### 9. `<Contact>` — #iletisim
- **Zemin:** `bg: ink; color: bg` (koyu panel)
- `1fr 1fr; gap: 72px`
- **Sol:**
  - Eyebrow (indigoSoft)
  - H2 60px: "Bir **proje** mi düşünüyorsunuz?" (proje = indigoSoft)
  - Lead paragraf (opacity 0.75)
  - 4 info bloğu: E-posta / Telefon / Ofis / Çalışma saatleri (eyebrow indigoSoft + değer 19/500/bg)
- **Sağ form kartı:**
  - `bg: rgba(247,245,240,0.06); border: 1px rgba(247,245,240,0.14); radius: 16; padding: 32px`
  - Başlık "Proje briefi"
  - 3 input: Ad soyad / E-posta / Şirket
  - 1 textarea: Kısaca projeniz (rows=5)
  - Submit: gradient `linear-gradient(135deg, indigoSoft, violet)`, submit sonrası yeşil "✓ Briefinizi aldık — 24 saat içinde döneceğiz"
  - Input stili: `bg: rgba(17,17,24,0.4); border: 1px rgba(247,245,240,0.14); radius: 10; padding: 14px 16px; color: bg`
  - KVKK notu altta center

### 10. `<Footer>`
- Zemin `#0A0A10` (ink'ten bir ton daha koyu), text `bg`
- `2fr 1fr 1fr 1fr` grid, gap `40px`, padding alt sınıra kadar
- Sol kolon: logo + kelime markası + 380px genişlikte açıklama
- 3 kolon liste: Şirket / Ürünler / İletişim
- Alt satır: © 2026 i-group Yazılım A.Ş. (sol) + "KVKK · Gizlilik · Çerezler" (sağ)

---

## Interactions & Behavior

- **Nav scroll state:** `scrollY > 24` → blur backdrop + border bottom
- **Section anchor nav:** Smooth-scroll `scroll-behavior: smooth` (global CSS)
- **Card hover:** `translateY(-4px) + shadow`, `.3s cubic-bezier(.2,.7,.3,1)`
- **Arrow icons:** Card hover sırasında ok 4px sağa kayar
- **Tag filter:** State `filter === 'Tümü' | tag`; `IG_PROJECTS.filter(p => p.tag === filter)`
- **Client row hover:** color ve background değişimi (inline JS handler, production'da `:hover` CSS yeterli)
- **Careers row hover:** aynı şekilde `bg2` background
- **Contact form submit:** `preventDefault`; `sent = true`; button metni ve rengi değişir. **Backend bağlantısı:** Next.js route (`app/api/contact/route.ts`) ile Resend/Postmark.

## State Management
Global state gerekmiyor. Her component kendi local state'ini kullanır:
- `Nav`: `scrolled: boolean`
- `Projects`: `filter: string`
- `ProjectCard`: `hover: boolean` (alternatif: saf CSS `:hover`)
- `Contact`: form field'ları + `sent: boolean`

Tasarımda animation library yok — yalnızca CSS transition'lar. Scroll-triggered animation'lar (fade-in, parallax) **eklenebilir** (Framer Motion veya `intersection-observer`) ancak current design bunları zorunlu kılmıyor.

---

## Data

`data.jsx` içinde üç ana koleksiyon + 2 yardımcı:

- `IG_PROJECTS` — 13 proje: `id, name, tag, sector, desc, status, year, hue, img`
- `IG_SECTORS` — 5 sektör kartı: `id, name, count, detail`
- `IG_STATS` — 4 istatistik
- `IG_NEWS` — 4 blog yazısı: `tag, date, title, excerpt`
- `IG_CLIENTS` — 10 marka ismi (referans wall için)
- `IG_JOBS` — 4 açık pozisyon: `role, team, loc`

Next.js taşımasında bunu `data/projects.ts`, `data/sectors.ts` vb. olarak TS modülleriyle tutun. Veya Sanity/Contentful şemalarına çevirin.

## Assets / Images

Tüm görseller **Unsplash CDN**'den `https://images.unsplash.com/<id>?auto=format&fit=crop&w=...&h=...&q=80` formatında çekiliyor. Prototip amaçlı — üretim için **kendi görsellerinizle** değiştirin:

### Şirket ve sayfa görselleri (`direction-c-swiss.jsx` → `IMG` objesi)
- `heroOffice` — sıcak ofis atmosferi (4:5 portrait, hero)
- `aboutOffice` — ekip toplantısı (16:11)
- `aboutTeam` — ekip işbirliği (1:1)
- `officeFloor` — ofis iç mimarisi (1:1)
- `newsProduct`, `newsSector`, `newsCulture`, `newsInci` — blog thumbnail
- `careersOffice` — kariyer bölümü ofis görseli

### Proje ekran görüntüleri (`PROJECT_IMG_DEFAULTS`)
Her 13 projeye sektöre uygun placeholder atandı. Üretimde bu alana **kendi ürünlerinizin gerçek ekran görüntülerini** koyun (tercihen 16:9 veya 4:3, 1400px genişlik).

Önerilen dizin yapısı (Next.js):
```
public/
  images/
    hero-office.jpg
    about-office.jpg
    about-team.jpg
    office-floor.jpg
    blog/
      i-kira-beta.jpg
      dermokozmetik.jpg
      calisma-ritmi.jpg
      inci-2.jpg
    projects/
      i-eczane.jpg
      i-depo.jpg
      i-kozmo.jpg
      ... (13 tane)
```

## Logo
Şu an placeholder: 28×28 rounded-8 indigo→violet gradient kutu, içinde iki küçük beyaz dikdörtgen ("i" noktalama). **Üretim için gerçek logo dosyası** (SVG) gerekli. Tasarımı yapılacaksa: "i" + "g" monogramı, indigo/mor paletiyle uyumlu, minimum 16×16 bound içinde okunabilir.

---

## Files

Bu paket içinde:

| Dosya | Açıklama |
|---|---|
| `i-group Web Sitesi.html` | Ana HTML giriş dosyası — script tag'leri, font import'ları, React/Babel kurulumu |
| `data.jsx` | Tüm içerik verisi (projeler, sektörler, blog, referanslar, kariyer) |
| `direction-c-swiss.jsx` | Ana React bileşeni — `SwissSite` ve tüm alt component'ler (Nav, Hero, About, Projects, Sectors, Clients, Blog, Careers, Contact, Footer) |

### Prototipi lokalde açma
1. Dosyaları bir klasöre koyun
2. Basit bir HTTP server ile servis edin:
   ```
   cd design_handoff_igroup_corporate_site
   python3 -m http.server 8000
   ```
3. `http://localhost:8000/i-group Web Sitesi.html` adresini açın

### Üretime taşıma akışı (öneri)
1. Next.js 14 projesi oluştur (`create-next-app` + TypeScript + Tailwind)
2. `data.jsx` içeriğini `data/*.ts` TS dosyalarına taşı (tipleri ekleyerek)
3. `direction-c-swiss.jsx` içindeki her component'i `components/` altında ayrı `.tsx` dosyalarına böl
4. Inline style'ları Tailwind utility class'larına çevir (design token'larını `tailwind.config.ts`'e ekle)
5. Font'ları `next/font/google` ile çek
6. Tüm görselleri `next/image`'e taşı, kendi asset'lerinizle değiştir
7. Contact form için API route + email provider (Resend) bağla
8. SEO metadata, sitemap, robots.txt ekle
9. Analytics (Vercel Analytics veya Plausible) bağla
10. Deploy (Vercel önerilir)

---

## Kabul Kriterleri (Acceptance)

- [ ] Tüm 9 bölüm sırasıyla render ediyor, anchor linkler çalışıyor
- [ ] Nav scroll'da blur/border kazanıyor
- [ ] Hero H1 ve "proje" kelimesi indigo
- [ ] 13 proje render oluyor, featured kartlar span-8 + 16:9
- [ ] Tag filtresi doğru çalışıyor; "Tümü" seçili başlangıçta
- [ ] Status badge rengi (Yayında/Beta/Yakında) doğru
- [ ] Card hover lift çalışıyor (transform + shadow)
- [ ] Client grid 5×2; hover'da background ve text color değişiyor
- [ ] Blog lead + 3 secondary doğru layout
- [ ] Careers listesi row hover'da `bg2`
- [ ] Contact form submit → onay state
- [ ] Footer 4 kolon + alt barda © + KVKK linkleri
- [ ] Responsive: <900px desktop-only yeterli (MVP); 1280px+ target
- [ ] Lighthouse 90+ Performance & SEO
- [ ] Yalnızca Türkçe (TR)
