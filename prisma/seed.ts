import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const url = process.env.DATABASE_URL ?? "file:./dev.db";
const filePath = url.startsWith("file:") ? url.slice("file:".length) : url;
const adapter = new PrismaBetterSqlite3({ url: filePath });
const prisma = new PrismaClient({ adapter });

const lorem = (title: string) => `
<h2>${title}</h2>
<p>i-grup, kurumsal ölçekte dijital dönüşüm projeleri geliştiren bir yazılım grubudur. Pazaryeri, e-ticaret, kozmetik, kurye operasyonları ve B2B platformları alanlarında uzmanlaşmış ekibiyle müşterilerine uçtan uca çözümler sunmaktadır.</p>
<p>Yaklaşımımızın temelinde; teknolojiyi iş süreçleriyle birleştirerek ölçülebilir değer yaratmak vardır. Ürün geliştirme, mimari danışmanlık, DevOps ve destek hizmetlerini tek çatı altında sunuyoruz.</p>
<h3>Neden i-grup?</h3>
<ul>
  <li>Kurumsal ölçekte deneyim ve referanslar</li>
  <li>Uçtan uca teslim: tasarım, geliştirme, devreye alma</li>
  <li>Bakım ve büyüme süreçlerinde sürekli destek</li>
</ul>
<p>Projenizi birlikte planlamak için ekibimizle iletişime geçebilirsiniz.</p>
`.trim();

async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL ?? "admin@i-grup.com";
  const password = process.env.ADMIN_PASSWORD ?? "admin123";
  const name = process.env.ADMIN_NAME ?? "Admin";
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name },
    create: { email, name, passwordHash, role: "admin" },
  });
  console.log(`✓ Admin user: ${user.email}`);
}

async function seedSiteSettings() {
  const setting = await prisma.siteSetting.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      siteName: "i-grup",
      tagline: "Kurumsal ölçekte dijital dönüşüm çözümleri",
      email: "info@i-grup.com",
      phone: "+90 212 000 00 00",
      whatsapp: "+905000000000",
      address: "Maslak Mah. Büyükdere Cd. No:000, Sarıyer / İstanbul",
      linkedinUrl: "https://www.linkedin.com/company/i-grup",
      instagramUrl: "https://www.instagram.com/igrup",
      xUrl: "https://x.com/igrup",
      footerText:
        "i-grup, pazaryeri ve e-ticaret yazılımı alanında uzmanlaşmış bir teknoloji grubudur.",
      defaultSeoTitle:
        "i-grup — Pazaryeri, e-ticaret ve B2B yazılım çözümleri",
      defaultSeoDesc:
        "Kurumsal ölçekte pazaryeri, e-ticaret, kozmetik, kurye ve B2B platformları geliştiren yazılım grubu.",
      statProjects: 15,
      statClients: 42,
      statYears: 8,
    },
  });
  console.log(`✓ SiteSetting: ${setting.siteName}`);
}

async function seedPages() {
  const pages = [
    { slug: "hakkimizda", title: "Hakkımızda", subtitle: "Kurumsal yazılım deneyimi" },
    { slug: "misyonumuz", title: "Misyonumuz", subtitle: "Teknolojiyle değer yaratmak" },
    {
      slug: "hizmetlerimiz",
      title: "Hizmetlerimiz",
      subtitle: "Uçtan uca dijital çözümler",
    },
    {
      slug: "kariyer",
      title: "Kariyer",
      subtitle: "Ekibimize katılmak ister misin?",
    },
    {
      slug: "kvkk",
      title: "KVKK Aydınlatma Metni",
      subtitle: "Kişisel verilerin korunması",
    },
    {
      slug: "gizlilik-politikasi",
      title: "Gizlilik Politikası",
      subtitle: "Çerezler ve veri işleme",
    },
  ];

  for (const p of pages) {
    await prisma.page.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...p,
        content: lorem(p.title),
        seoTitle: `${p.title} | i-grup`,
        seoDescription: p.subtitle ?? null,
      },
    });
  }
  console.log(`✓ Pages: ${pages.length}`);
}

async function seedServices() {
  const services = [
    {
      slug: "pazaryeri-gelistirme",
      title: "Pazaryeri Geliştirme",
      shortDesc:
        "Multi-vendor pazaryeri platformlarını sıfırdan kurgular, büyütür ve ölçekleriz.",
      icon: "Store",
      order: 1,
    },
    {
      slug: "e-ticaret-siteleri",
      title: "E-Ticaret Siteleri",
      shortDesc:
        "Yüksek dönüşüm odaklı, entegrasyonları hazır e-ticaret sitelerini hayata geçiririz.",
      icon: "ShoppingBag",
      order: 2,
    },
    {
      slug: "kozmetik-dermokozmetik-platformlari",
      title: "Kozmetik & Dermokozmetik Platformları",
      shortDesc:
        "Eczane, marka ve distribütör iş modellerine uygun dermokozmetik platformları.",
      icon: "Sparkles",
      order: 3,
    },
    {
      slug: "b2b-kapali-pazaryeri",
      title: "B2B Kapalı Pazaryeri",
      shortDesc:
        "Bayi, distribütör ve tedarikçi ağları için kapalı B2B pazaryeri çözümleri.",
      icon: "Building2",
      order: 4,
    },
    {
      slug: "kurye-saha-operasyonu",
      title: "Kurye & Saha Operasyonu Uygulamaları",
      shortDesc:
        "Son-kilometre teslimat ve saha ekipleri için mobil takip uygulamaları.",
      icon: "Truck",
      order: 5,
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        ...s,
        coverImage: `https://picsum.photos/seed/${s.slug}/1200/800`,
        content: lorem(s.title),
        isActive: true,
        seoTitle: `${s.title} | i-grup`,
        seoDescription: s.shortDesc,
      },
    });
  }
  console.log(`✓ Services: ${services.length}`);
}

async function seedProjects() {
  const categories: Record<string, string> = {
    pazaryeri: "Pazaryeri",
    eticaret: "E-Ticaret",
    kozmetik: "Kozmetik",
    b2b: "B2B",
    kurye: "Kurye & Saha",
  };

  const projects = [
    { slug: "omni-pazaryeri", title: "OmniPazar — Kurumsal Multi-Vendor", cat: "pazaryeri", year: 2025, featured: true },
    { slug: "eczane-plus", title: "Eczane+ Dermokozmetik Pazaryeri", cat: "kozmetik", year: 2025, featured: true },
    { slug: "b2b-tedarik", title: "B2B Tedarik Portalı", cat: "b2b", year: 2024, featured: true },
    { slug: "kargom-lite", title: "Kargom Lite Son-Kilometre", cat: "kurye", year: 2024, featured: true },
    { slug: "fashion-hub", title: "Fashion Hub Moda E-Ticaret", cat: "eticaret", year: 2024, featured: true },
    { slug: "fresh-market", title: "Fresh Market Hızlı Market", cat: "eticaret", year: 2023, featured: true },
    { slug: "bayipanel", title: "BayiPanel B2B Portal", cat: "b2b", year: 2023, featured: false },
    { slug: "kozmetik-ithalat", title: "KozmetikIthalat Distribütör Paneli", cat: "kozmetik", year: 2023, featured: false },
    { slug: "servis-atolyesi", title: "Servis Atölyesi Saha Uygulaması", cat: "kurye", year: 2023, featured: false },
    { slug: "emlak-vitrin", title: "Emlak Vitrin Çok Kullanıcılı Site", cat: "pazaryeri", year: 2022, featured: false },
    { slug: "market-express", title: "Market Express Hızlı Teslimat", cat: "eticaret", year: 2022, featured: false },
    { slug: "saglik-asistan", title: "Sağlık Asistan Dermokozmetik", cat: "kozmetik", year: 2022, featured: false },
    { slug: "lojistik-takip", title: "Lojistik Takip Saha Uygulaması", cat: "kurye", year: 2022, featured: false },
    { slug: "endustriyel-b2b", title: "Endüstriyel B2B Satış Portalı", cat: "b2b", year: 2022, featured: false },
    { slug: "ikinci-el-pazari", title: "İkinciEl Pazarı C2C Platform", cat: "pazaryeri", year: 2021, featured: false },
  ];

  const techStacks: Record<string, string[]> = {
    pazaryeri: ["Next.js", "PostgreSQL", "Redis", "Elasticsearch", "AWS"],
    eticaret: ["Next.js", "Stripe", "PostgreSQL", "Tailwind", "Vercel"],
    kozmetik: ["Laravel", "MySQL", "Vue.js", "Redis", "S3"],
    b2b: ["Next.js", "Prisma", "PostgreSQL", "NextAuth", "SendGrid"],
    kurye: ["React Native", "Expo", "Node.js", "PostgreSQL", "Firebase"],
  };

  let i = 0;
  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        title: p.title,
        client: i % 3 === 0 ? "Özel sektör müşterisi" : `Kurumsal Müşteri ${i + 1}`,
        category: categories[p.cat],
        shortDesc: `${p.title} için geliştirdiğimiz, uçtan uca dijital dönüşüm projesi.`,
        content: lorem(p.title),
        coverImage: `https://picsum.photos/seed/${p.slug}/1600/900`,
        gallery: JSON.stringify([
          `https://picsum.photos/seed/${p.slug}-1/1600/900`,
          `https://picsum.photos/seed/${p.slug}-2/1600/900`,
          `https://picsum.photos/seed/${p.slug}-3/1600/900`,
        ]),
        techStack: JSON.stringify(techStacks[p.cat]),
        liveUrl: null,
        year: p.year,
        isFeatured: p.featured,
        order: i,
        seoTitle: `${p.title} | i-grup`,
        seoDescription: `${p.title} — ${categories[p.cat]} kategorisinde ${p.year} yılında geliştirilmiş proje.`,
      },
    });
    i++;
  }
  console.log(`✓ Projects: ${projects.length}`);
}

async function seedCareers() {
  const careers = [
    {
      slug: "senior-fullstack-developer",
      title: "Senior Full-Stack Developer",
      department: "Yazılım",
      location: "İstanbul / Uzaktan",
      type: "Tam Zamanlı",
      shortDesc:
        "Next.js ve PostgreSQL tabanlı kurumsal projelerde tasarımdan üretime kadar sorumluluk alacak senior geliştiriciler arıyoruz.",
    },
    {
      slug: "product-designer",
      title: "Product Designer",
      department: "Tasarım",
      location: "İstanbul",
      type: "Tam Zamanlı",
      shortDesc:
        "Kullanıcı araştırmalarından prototiplemeye tüm tasarım sürecini yönetecek ürün tasarımcısı arıyoruz.",
    },
    {
      slug: "devops-engineer",
      title: "DevOps Engineer",
      department: "Altyapı",
      location: "Uzaktan",
      type: "Tam Zamanlı",
      shortDesc:
        "Kurumsal projelerin CI/CD, izleme ve güvenlik süreçlerini kurgulayacak DevOps mühendisi arıyoruz.",
    },
  ];

  for (const c of careers) {
    await prisma.career.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        ...c,
        content: lorem(c.title),
        isActive: true,
      },
    });
  }
  console.log(`✓ Careers: ${careers.length}`);
}

async function seedBanners() {
  const banners = [
    {
      id: "banner-1",
      title: "Kurumsal Pazaryeri Çözümleri",
      subtitle: "15+ projeyi canlıya aldık, şimdi sırada sizin işiniz var.",
      imageUrl: "https://picsum.photos/seed/banner-1/1920/900",
      ctaText: "Teklif Al",
      ctaUrl: "/iletisim",
      order: 0,
    },
    {
      id: "banner-2",
      title: "Eczane & Dermokozmetik",
      subtitle: "Niche iş modellerine özel, yasal uyumlu e-ticaret platformları.",
      imageUrl: "https://picsum.photos/seed/banner-2/1920/900",
      ctaText: "Projelerimiz",
      ctaUrl: "/projelerimiz",
      order: 1,
    },
    {
      id: "banner-3",
      title: "Kurye & Saha Operasyonu",
      subtitle: "Son-kilometre teslimatta mobil çözümlerimizle kazanın.",
      imageUrl: "https://picsum.photos/seed/banner-3/1920/900",
      ctaText: "Hizmetlerimiz",
      ctaUrl: "/hizmetlerimiz",
      order: 2,
    },
  ];

  for (const b of banners) {
    await prisma.banner.upsert({
      where: { id: b.id },
      update: {},
      create: { ...b, isActive: true },
    });
  }
  console.log(`✓ Banners: ${banners.length}`);
}

async function main() {
  console.log("→ Seeding database...");
  await seedAdminUser();
  await seedSiteSettings();
  await seedPages();
  await seedServices();
  await seedProjects();
  await seedCareers();
  await seedBanners();
  console.log("✔ Seed complete.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
