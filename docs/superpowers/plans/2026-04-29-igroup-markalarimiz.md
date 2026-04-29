# i-Grup Markalarimiz Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition the public site from a software-company/project portfolio into an i-Grup company group site centered on its brands.

**Architecture:** Keep the existing Prisma `Project` model and admin CRUD plumbing, but present those records publicly as brands. Add `/markalarimiz` routes that reuse the current project data, keep legacy `/projelerimiz` compatibility through redirects, and update visible copy/SEO/navigation to group-company language.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Prisma 7, Tailwind CSS v4, shadcn/ui, Server Components, Server Actions.

---

## File Map

- `node_modules/next/dist/docs/`: Read relevant Next 16 App Router docs before code changes involving metadata, redirects, dynamic routes, or sitemap.
- `src/app/(public)/markalarimiz/page.tsx`: Create the public brand listing route.
- `src/app/(public)/markalarimiz/[slug]/page.tsx`: Create the public brand detail route.
- `src/app/(public)/projelerimiz/page.tsx`: Replace the old listing page with a redirect to `/markalarimiz`.
- `src/app/(public)/projelerimiz/[slug]/page.tsx`: Replace the old detail page with a redirect to `/markalarimiz/[slug]`.
- `src/components/public/home/Projects.tsx`: Convert the home section from "Projects" to "Markalarimiz" and change anchor to `markalar`.
- `src/components/public/home/ProjectCard.tsx`: Change links and CTAs to brand language.
- `src/components/public/ProjectCard.tsx`: Change list-page cards to link to brand routes.
- `src/components/public/Header.tsx`: Change nav label/link from projects to brands.
- `src/components/public/Footer.tsx`: Change "Ürünler" to "Markalar" and link to brand routes.
- `src/components/public/home/Hero.tsx`: No structural rewrite expected; copy comes from settings.
- `src/components/public/home/About.tsx`: No structural rewrite expected; copy comes from settings.
- `src/components/public/home/Sectors.tsx`: Change anchor target from `#projeler` to `#markalar` and default copy to brand activity language.
- `src/app/(public)/page.tsx`: Update fallback copy and sector-to-brand naming.
- `src/app/sitemap.ts`: Add `/markalarimiz` and brand detail URLs; remove public `/projelerimiz` entries from preferred sitemap.
- `src/app/(admin)/admin/(authed)/projects/page.tsx` and related project admin files: Change visible labels from Projeler to Markalar without changing route/model.
- `src/components/admin/Sidebar.tsx`: Change admin sidebar label from Projeler to Markalar.
- `prisma/seed.ts`: Update seeded settings/pages/project copy to group-company and brand language.

## Task 1: Read Next 16 Docs For Affected APIs

**Files:**
- Read: `node_modules/next/dist/docs/`

- [ ] **Step 1: Locate docs**

Run:

```bash
find node_modules/next/dist/docs -type f | rg '(redirect|metadata|sitemap|dynamic|app-router|routing)' | head -40
```

Expected: a list of relevant Next 16 docs files.

- [ ] **Step 2: Read the relevant docs**

Run targeted reads for the files found in Step 1. At minimum, read docs covering:

```bash
sed -n '1,220p' <metadata-doc-file>
sed -n '1,220p' <redirect-doc-file>
sed -n '1,220p' <sitemap-doc-file>
```

Expected: confirm current app patterns remain valid for `generateMetadata`, `redirect`, `generateStaticParams`, and `MetadataRoute.Sitemap`.

## Task 2: Add Brand Listing Route

**Files:**
- Create: `src/app/(public)/markalarimiz/page.tsx`
- Modify: `src/components/public/ProjectCard.tsx`

- [ ] **Step 1: Create `/markalarimiz` listing page**

Use the current `src/app/(public)/projelerimiz/page.tsx` as the source, but change public language and hrefs:

```tsx
export const metadata = {
  title: "Markalarımız",
  description:
    "i-Grup çatısı altında faaliyet gösteren dijital markalar, pazaryerleri ve platformlar.",
};
```

The page should:

- Read `searchParams` as `Promise<{ kategori?: string }>` like the existing Next 16 pattern.
- Query `prisma.project.findMany`.
- Use `/markalarimiz` and `/markalarimiz?kategori=...` filter hrefs.
- Use hero copy:

```tsx
<div className="eyebrow mb-4">
  <span className="num-badge">01</span> Markalarımız
</div>
<h1 className="text-4xl md:text-6xl font-semibold tracking-[-0.02em] leading-[1.05] max-w-3xl">
  i-Grup çatısı altında büyüyen{" "}
  <span className="serif-accent text-gradient">dijital markalar.</span>
</h1>
<p className="text-muted-foreground mt-5 text-base md:text-lg max-w-2xl">
  Toplam <span className="font-mono text-foreground">{projects.length}</span> marka
  {params.kategori ? (
    <>{" "}— <span className="font-mono text-foreground">{params.kategori}</span> kategorisinde</>
  ) : null}
  .
</p>
```

- Empty state:

```tsx
<p className="text-muted-foreground py-12">Marka bulunamadı.</p>
```

- [ ] **Step 2: Update public list card href**

In `src/components/public/ProjectCard.tsx`, change:

```tsx
href={`/projelerimiz/${slug}`}
```

to:

```tsx
href={`/markalarimiz/${slug}`}
```

No prop rename is required in this phase.

- [ ] **Step 3: Verify listing route**

Run:

```bash
curl -I http://localhost:3000/markalarimiz
```

Expected: `HTTP/1.1 200 OK`.

## Task 3: Add Brand Detail Route And Legacy Redirects

**Files:**
- Create: `src/app/(public)/markalarimiz/[slug]/page.tsx`
- Modify: `src/app/(public)/projelerimiz/page.tsx`
- Modify: `src/app/(public)/projelerimiz/[slug]/page.tsx`

- [ ] **Step 1: Create brand detail page**

Use the current project detail page as the source, but change public language:

- Badge remains `{project.category}`.
- Metadata remains data-driven from `seoTitle`, `seoDescription`, `shortDesc`.
- Replace "Müşteri" metadata with sector/status language:

```tsx
<div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-muted-foreground text-sm">
  {project.sector ? <span>Faaliyet alanı: {project.sector}</span> : null}
  <span>Durum: {project.status}</span>
  {project.year ? <span>Kuruluş/Lansman: {project.year}</span> : null}
</div>
```

- Replace "Teknolojiler" with:

```tsx
<h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
  Öne çıkan kabiliyetler
</h3>
```

- Replace live URL button text with:

```tsx
Markanın Sitesini Ziyaret Et <ExternalLink className="h-4 w-4 ml-1" />
```

- Replace contact card with group language:

```tsx
<h3 className="font-semibold text-sm">i-Grup çatısı altında</h3>
<p className="text-sm text-muted-foreground mt-1">
  Markalarımız ve grup yapımız hakkında bilgi almak için bizimle iletişime geçin.
</p>
```

- Replace related section:

```tsx
<h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
  Diğer Markalar
</h2>
<Link href="/markalarimiz" ...>
  Tümü <ArrowRight className="h-4 w-4" />
</Link>
```

- [ ] **Step 2: Redirect legacy listing route**

Replace `src/app/(public)/projelerimiz/page.tsx` with:

```tsx
import { redirect } from "next/navigation";

export default function ProjectsListRedirect() {
  redirect("/markalarimiz");
}
```

- [ ] **Step 3: Redirect legacy detail route**

Replace `src/app/(public)/projelerimiz/[slug]/page.tsx` with:

```tsx
import { redirect } from "next/navigation";

export default async function ProjectDetailRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/markalarimiz/${slug}`);
}
```

- [ ] **Step 4: Verify redirects**

Run:

```bash
curl -I http://localhost:3000/projelerimiz
curl -I http://localhost:3000/projelerimiz/i-eczane
```

Expected: both return a redirect status and `Location` pointing to `/markalarimiz` or `/markalarimiz/i-eczane`.

## Task 4: Update Public Navigation, Home Brand Section, Footer

**Files:**
- Modify: `src/components/public/Header.tsx`
- Modify: `src/components/public/home/Projects.tsx`
- Modify: `src/components/public/home/ProjectCard.tsx`
- Modify: `src/components/public/Footer.tsx`
- Modify: `src/components/public/home/Sectors.tsx`

- [ ] **Step 1: Header nav**

In `Header.tsx`, change:

```ts
{ href: "/#projeler", label: "Projeler" },
```

to:

```ts
{ href: "/#markalar", label: "Markalarımız" },
```

- [ ] **Step 2: Home section id and copy**

In `Projects.tsx`, change section id:

```tsx
id="markalar"
```

Change defaults:

```tsx
eyebrow={eyebrow || "Markalarımız"}
title={title || "i-Grup çatısı altında büyüyen markalar."}
lead={
  lead ||
  "Eczane pazaryerinden B2B tedarik platformlarına, kozmetik ve kişisel bakım markalarından tüketici uygulamalarına kadar farklı alanlarda faaliyet gösteren dijital markalarımız."
}
```

- [ ] **Step 3: Home card links and CTA**

In `src/components/public/home/ProjectCard.tsx`, change:

```ts
const externalHref = p.liveUrl ?? `/projelerimiz/${p.slug}`;
const externalLabel = hasLive ? "Siteyi görüntüle" : "Detay";
```

to:

```ts
const detailHref = `/markalarimiz/${p.slug}`;
const externalHref = p.liveUrl ?? detailHref;
const externalLabel = hasLive ? "Siteyi görüntüle" : "Markayı incele";
```

Change the main image link href from `/projelerimiz/${p.slug}` to `detailHref`, and change `aria-label` to:

```tsx
aria-label={`${p.title} markasını incele`}
```

Change image label from `ekran görüntüsü` to `marka görseli`.

- [ ] **Step 4: Footer labels and links**

In `Footer.tsx`, change heading:

```tsx
Markalar
```

Change product links from:

```tsx
href={`/projelerimiz/${p.slug}`}
```

to:

```tsx
href={`/markalarimiz/${p.slug}`}
```

- [ ] **Step 5: Sectors link and copy**

In `Sectors.tsx`, change default title and lead:

```tsx
title={title || "Markalarımızın faaliyet gösterdiği alanlar."}
lead={
  lead ||
  "Her marka kendi sektöründe uzmanlaşır; i-Grup çatısı bu markaların ortak deneyimini ve büyüme disiplinini bir araya getirir."
}
```

Change sector item link:

```tsx
href="#markalar"
```

## Task 5: Update Home Fallback Copy And SEO Defaults

**Files:**
- Modify: `src/app/(public)/page.tsx`
- Modify: `prisma/seed.ts`

- [ ] **Step 1: Update home metadata fallback**

In `src/app/(public)/page.tsx`, change fallback title and description:

```ts
`${s.siteName} — Şirketler topluluğu`
```

and:

```ts
"i-Grup çatısı altında faaliyet gösteren dijital markalar, pazaryerleri ve platformlar."
```

- [ ] **Step 2: Update hero/about fallback copy**

Change fallback hero/about strings to:

```tsx
heading={settings.heroHeading ?? "i-Grup"}
highlight={settings.heroHighlight ?? "i-Grup"}
subtitle={
  settings.heroSubtitle ??
  settings.tagline ??
  "Farklı sektörlerde faaliyet gösteren dijital markaları çatısı altında buluşturan şirketler topluluğu."
}
```

About fallback:

```tsx
settings.aboutHeading ??
"Farklı sektörlerde büyüyen markaları aynı çatı altında buluşturan grup."
```

```tsx
settings.aboutLead ??
"i-Grup; eczane pazaryeri, B2B tedarik platformları, kozmetik ve kişisel bakım markaları, finansal çözümler ve tüketici platformlarından oluşan marka portföyünü aynı stratejik çatı altında yönetir."
```

- [ ] **Step 3: Rename internal sector map comments only**

Change comment:

```ts
// Group projects by sector name for "related products" display
```

to:

```ts
// Group brands by sector name for sector display
```

Keep variable names if changing them would create unnecessary churn.

- [ ] **Step 4: Update seed settings**

In `prisma/seed.ts`, update seeded `SiteSetting` copy:

```ts
tagline:
  "Farklı sektörlerde faaliyet gösteren dijital markaları ve platformları çatısı altında buluşturan şirketler topluluğu.",
heroSubtitle:
  "i-Grup; eczane pazaryeri, B2B tedarik platformları, kozmetik ve kişisel bakım markaları, finansal çözümler ve tüketici platformlarından oluşan marka portföyünü aynı çatı altında buluşturur.",
aboutHeading:
  "Farklı sektörlerde büyüyen markaları aynı çatı altında buluşturan grup.",
aboutLead:
  "i-Grup, her biri kendi alanında uzmanlaşan dijital markaları stratejik, operasyonel ve dijital büyüme disipliniyle destekleyen bir şirketler topluluğudur.",
defaultSeoTitle:
  "i-Grup — Şirketler Topluluğu | Dijital Markalar ve Platformlar",
defaultSeoDesc:
  "i-Grup çatısı altında faaliyet gösteren eczane pazaryeri, B2B tedarik platformları, kozmetik ve kişisel bakım markaları, finansal çözümler ve tüketici platformları.",
footerText:
  "Farklı sektörlerde faaliyet gösteren dijital markaları aynı çatı altında buluşturan şirketler topluluğu.",
projectsEyebrow: "Markalarımız",
projectsTitle: "i-Grup çatısı altında büyüyen markalar.",
projectsLead:
  "Eczane pazaryerinden B2B tedarik platformlarına, kozmetik ve kişisel bakım markalarından tüketici uygulamalarına kadar farklı alanlarda faaliyet gösteren dijital markalarımız.",
sectorsTitle: "Markalarımızın faaliyet gösterdiği alanlar.",
sectorsLead:
  "Her marka kendi sektöründe uzmanlaşır; i-Grup çatısı bu markaların ortak deneyimini ve büyüme disipliniyle bir araya getirir.",
```

## Task 6: Update Sitemap

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Add preferred brand listing route**

In `staticRoutes`, replace:

```ts
"/projelerimiz",
```

with:

```ts
"/markalarimiz",
```

- [ ] **Step 2: Change project URLs to brand URLs**

Change:

```ts
url: `${base}/projelerimiz/${p.slug}`,
```

to:

```ts
url: `${base}/markalarimiz/${p.slug}`,
```

Expected: sitemap exposes brand URLs as canonical preferred URLs.

## Task 7: Update Admin Visible Labels

**Files:**
- Modify: `src/components/admin/Sidebar.tsx`
- Modify: `src/app/(admin)/admin/(authed)/projects/page.tsx`
- Modify: `src/app/(admin)/admin/(authed)/projects/[id]/page.tsx`
- Modify: `src/app/(admin)/admin/(authed)/projects/new/page.tsx`
- Modify: `src/components/admin/forms/ProjectForm.tsx`
- Modify: `src/app/(admin)/admin/(authed)/projects/ProjectRowActions.tsx`

- [ ] **Step 1: Sidebar label**

Change:

```ts
{ href: "/admin/projects", label: "Projeler", icon: FolderKanban },
```

to:

```ts
{ href: "/admin/projects", label: "Markalar", icon: FolderKanban },
```

- [ ] **Step 2: Search project admin labels**

Run:

```bash
rg 'Proje|Projeler|proje|projeler' 'src/app/(admin)/admin/(authed)/projects' src/components/admin/forms/ProjectForm.tsx
```

Expected: list of visible strings to change.

- [ ] **Step 3: Replace visible strings only**

Replace UI text as follows:

- `Projeler` -> `Markalar`
- `Yeni Proje` -> `Yeni Marka`
- `Proje bulunamadı` -> `Marka bulunamadı`
- `Proje adı` -> `Marka adı`
- `Proje açıklaması` -> `Marka açıklaması`
- `Proje görseli` -> `Marka görseli`
- `Projeyi sil` -> `Markayı sil`

Do not rename files, functions, actions, routes, or Prisma fields in this task.

## Task 8: Verification

**Files:**
- No edits expected.

- [ ] **Step 1: Lint**

Run:

```bash
pnpm lint
```

Expected: exits `0`.

- [ ] **Step 2: Build**

Run:

```bash
pnpm build
```

Expected: exits `0`, and route list includes `/markalarimiz` and `/markalarimiz/[slug]`.

- [ ] **Step 3: HTTP smoke tests**

With local dev server running, run:

```bash
curl -I http://localhost:3000/
curl -I http://localhost:3000/markalarimiz
curl -I http://localhost:3000/markalarimiz/i-eczane
curl -I http://localhost:3000/projelerimiz
curl -I http://localhost:3000/projelerimiz/i-eczane
```

Expected:

- `/`, `/markalarimiz`, `/markalarimiz/i-eczane` return `200 OK`.
- `/projelerimiz` and `/projelerimiz/i-eczane` redirect to brand URLs.

- [ ] **Step 4: Text scan**

Run:

```bash
rg 'Projelerimiz|Projeler|proje portföy|yazılım şirketi|hizmet verdiğimiz sektörler|Siteyi Ziyaret Et|Benzer bir proje' src/app src/components prisma/seed.ts
```

Expected: no public-facing stale copy remains, except technical identifiers or admin route/function names that intentionally still use `Project`.
