import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const url = process.env.DATABASE_URL ?? "file:./dev.db";
const filePath = url.startsWith("file:") ? url.slice("file:".length) : url;
const adapter = new PrismaBetterSqlite3({ url: filePath });
const prisma = new PrismaClient({ adapter });

// Unsplash helper (handoff spec)
const U = (id: string, w = 1600, h = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const IMG = {
  heroOffice: U("photo-1497366216548-37526070297c", 1200, 1500),
  aboutOffice: U("photo-1497215842964-222b430dc094", 1400, 900),
  aboutTeam: U("photo-1522071820081-009f0129c71c", 1000, 1000),
  officeFloor: U("photo-1604328698692-f76ea9498e76", 1000, 1000),
  careersOffice: U("photo-1600880292203-757bb62b4baf", 1400, 1050),
  newsProduct: U("photo-1555421689-491a97ff2040", 1400, 800),
  newsSector: U("photo-1587854692152-cbe660dbde88", 1400, 800),
  newsCulture: U("photo-1529070538774-1843cb3265df", 1400, 800),
  newsInci: U("photo-1556228720-195a672e8a03", 1400, 800),
};

const PROJECT_IMG: Record<string, string> = {
  "i-eczane": U("photo-1587854692152-cbe660dbde88", 1400, 900),
  "i-depo": U("photo-1631549916768-4119b2e5f926", 1400, 900),
  "i-kozmo": U("photo-1522337360788-8b13dee7a37e", 1400, 900),
  istanbulvitamin: U("photo-1571781926291-c477ebfd024b", 1400, 900),
  specialwhey: U("photo-1579722821273-0f6c1b5a9b39", 1400, 900),
  "i-hesap": U("photo-1554224155-6726b3ff858f", 1400, 900),
  "i-hirdavat": U("photo-1581783898377-1c85bf937427", 1400, 900),
  "i-bijuteri": U("photo-1611591437281-460bfbe1220a", 1400, 900),
  "i-kirtasiye": U("photo-1513542789411-b6a5d4f31634", 1400, 900),
  "i-nalbur": U("photo-1581092160607-ee22621dd758", 1400, 900),
  "i-zeruj": U("photo-1488459716781-31db52582fe9", 1400, 900),
  memnuniyetimvar: U("photo-1556761175-5973dc0f32e7", 1400, 900),
  "i-kira": U("photo-1560520653-9e0e4c89eb11", 1400, 900),
};

const blogContent = (title: string, excerpt: string) => `
<p>${excerpt}</p>
<h2>${title} — detaylı bakış</h2>
<p>i-Grup olarak geliştirdiğimiz ürünler ve üzerinde çalıştığımız sektörlerden önemli notları burada paylaşıyoruz. Her yazı; saha gözlemlerimizden, veri analizlerimizden ve ekip kültürümüzden beslenir.</p>
<h3>Neden önemli?</h3>
<ul>
  <li>Müşterilerimizin ihtiyaçlarının arkasındaki sebepleri anlamak</li>
  <li>Ürün-pazar uyumunu dinamik olarak ölçmek</li>
  <li>Ekip içi bilgi paylaşımı ve süreç iyileştirmesi</li>
</ul>
<p>Bu yazı serisiyle birlikte, hem teknik ekibimizin hem de ürün yöneticilerimizin gündelik deneyimlerini aktarmaya devam edeceğiz.</p>
`.trim();

const projectContent = (name: string, desc: string, sector: string) => `
<h2>${name}</h2>
<p>${desc}</p>
<h3>Ne yapıyor?</h3>
<p><strong>${sector}</strong> sektöründe faaliyet gösteren bu ürün, kullanıcılarına uçtan uca dijital deneyim sağlar. Stratejik planlamadan lansman sonrası sürdürme süreçlerine kadar her aşamada i-Grup ekibi devrededir.</p>
<h3>Öne çıkan özellikler</h3>
<ul>
  <li>Modüler mimari — hızlı iterasyon ve genişleme</li>
  <li>Kurumsal ölçek performans ve güvenlik</li>
  <li>Veri odaklı karar destek ekranları</li>
  <li>Uçtan uca operasyonel izleme</li>
</ul>
`.trim();

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL ?? "admin@i-grup.com.tr";
  const password = process.env.ADMIN_PASSWORD ?? "admin123";
  const name = process.env.ADMIN_NAME ?? "Admin";
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name },
    create: { email, name, passwordHash, role: "admin" },
  });
  console.log(`✓ Admin: ${email}`);
}

async function seedSettings() {
  const data = {
    siteName: "i-Grup",
      tagline:
        "İstanbul merkezli ürün stüdyosu. Pazaryerleri, B2B tedarik, mobil uygulamalar, ERP ve tüketici platformları geliştiriyoruz.",
      email: "merhaba@i-grup.com.tr",
      phone: "+90 212 000 00 00",
      whatsapp: "+905000000000",
      address: "Maslak No.1 Plaza, Sarıyer / İstanbul",
      linkedinUrl: "https://www.linkedin.com/company/i-Grup",
      instagramUrl: "https://www.instagram.com/i-Grup",
      xUrl: "https://x.com/igroup",
      footerText:
        "İstanbul merkezli ürün stüdyosu. Eczane, kozmetik, B2B ve kurumsal yazılım için uçtan uca ürün geliştirir ve işletir.",
      defaultSeoTitle:
        "i-Grup — Eczane, kozmetik ve B2B için ürün geliştiriyoruz",
      defaultSeoDesc:
        "Pazaryerleri, B2B tedarik ağları, mobil uygulamalar, kurumsal muhasebe yazılımı ve tüketici platformlarında uçtan uca ürün üretir ve işletir.",
      statProjects: 13,
      statSectors: 6,
      statYears: 10,
      statEndUsers: "120K",
      teamSize: 38,
      foundedYear: 2014,
      heroHeading: "Eczane, kozmetik ve B2B için ürün geliştiriyoruz.",
      heroHighlight: "ürün geliştiriyoruz.",
      heroSubtitle:
        "i-Grup; pazaryerleri, B2B tedarik ağları, mobil uygulamalar, kurumsal muhasebe yazılımı ve tüketici platformlarında uçtan uca ürün üretir ve işletir.",
      heroStatusText: "İstanbul merkezli ürün stüdyosu · 2014'ten beri",
      heroImageUrl: IMG.heroOffice,
      aboutHeading: "Bir yazılım stüdyosu; fikirden canlı ürüne.",
      aboutLead:
        "2014'te İstanbul'da üç kişilik bir ekiple kuruldu. Bugün 38 kişilik ekibimizle 13 aktif ürünü yayınlıyor, işletiyor ve büyütüyoruz. Ürünü kurmak kadar, ayakta tutmak ve ölçeklendirmek de işimizin bir parçası.",
      aboutImage1: IMG.aboutOffice,
      aboutImage2: IMG.aboutTeam,
      aboutImage3: IMG.officeFloor,
      careersHeading: "Ekibimize katılın.",
      careersLead:
        "Uzak ya da İstanbul, tercih sizin. Uçtan uca ürün geliştirdiğimiz 13 ürüne doğrudan dokunacaksınız.",
      careersImage: IMG.careersOffice,
      contactHeading: "Bir proje mi düşünüyorsunuz?",
      contactHighlight: "proje",
      contactLead:
        "Kısa bir brief bırakın; 24 saat içinde size özel geri dönelim. Her talep ekibimizde doğrudan bir ürün yöneticisine gider.",
    officeHours: "Pazartesi – Cuma · 09:30 – 18:30",
  };
  await prisma.siteSetting.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });
  console.log("✓ SiteSetting");
}

async function seedPages() {
  const pages = [
    {
      slug: "hakkimizda",
      title: "Hakkımızda",
      subtitle: "2014'ten beri ürün üreten ekibimiz.",
    },
    {
      slug: "misyonumuz",
      title: "Misyonumuz",
      subtitle: "Kurduğumuz ürünleri ayakta tutmak ve büyütmek.",
    },
    {
      slug: "kvkk",
      title: "KVKK Aydınlatma Metni",
      subtitle: "Kişisel verilerin korunması.",
    },
    {
      slug: "gizlilik-politikasi",
      title: "Gizlilik Politikası",
      subtitle: "Çerezler ve veri işleme politikaları.",
    },
  ];
  for (const p of pages) {
    await prisma.page.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...p,
        content: `<p>${p.subtitle}</p><p>Bu sayfanın içeriği admin panelinden yönetilebilir. Detayları buradan düzenleyebilirsiniz.</p>`,
        seoTitle: p.title,
        seoDescription: p.subtitle,
      },
    });
  }
  console.log(`✓ Pages (${pages.length})`);
}

async function seedProjects() {
  // Clear existing if count mismatch
  const existing = await prisma.project.count();
  if (existing > 0) {
    await prisma.project.deleteMany();
  }

  const projects = [
    { id: "i-eczane", name: "i-Eczane", tag: "Pazaryeri", sector: "Eczane", desc: "Dermokozmetik eczane pazaryeri. Eczacılar ve markalar arası doğrudan stok ve sipariş akışı.", status: "Yayında", year: 2023, hue: 264 },
    { id: "i-depo", name: "i-Depo", tag: "B2B", sector: "Eczane", desc: "B2B kapalı dermokozmetik pazaryeri. Distribütör-eczane arasında davetli tedarik ağı.", status: "Yayında", year: 2023, hue: 272 },
    { id: "i-kozmo", name: "i-Kozmo", tag: "Mobil", sector: "Kozmetik", desc: "Kozmetik ürün tanıtım ve yorumlama mobil uygulaması. INCI okuma, topluluk ve rutin takibi.", status: "Yayında", year: 2024, hue: 296 },
    { id: "istanbulvitamin", name: "İstanbulVitamin", tag: "E-ticaret", sector: "Kozmetik", desc: "Kişisel kozmetik e-ticaret sitesi. Cilt tipine göre kürasyon ve abonelik.", status: "Yayında", year: 2022, hue: 310 },
    { id: "specialwhey", name: "SpecialWhey", tag: "E-ticaret", sector: "Kozmetik", desc: "Kişiye özel protein mix. Hedef/diyete göre formülasyon ve tekrar-siparişli abonelik.", status: "Yayında", year: 2024, hue: 320 },
    { id: "i-hesap", name: "i-Hesap", tag: "ERP", sector: "Kurumsal", desc: "Muhasebe ERP programı. KOBİ odaklı, e-belge entegre, çoklu şirket.", status: "Yayında", year: 2021, hue: 252 },
    { id: "i-hirdavat", name: "i-Hırdavat", tag: "B2B", sector: "Hırdavat", desc: "B2B hırdavat pazaryeri. Toptancı-bayi arası kalem bazlı sipariş ve cari.", status: "Yayında", year: 2024, hue: 240 },
    { id: "i-bijuteri", name: "i-Bijuteri", tag: "B2B", sector: "Aksesuar", desc: "B2B bijuteri pazaryeri. Üretici-perakendeci arası koli bazlı sipariş akışı.", status: "Yayında", year: 2024, hue: 304 },
    { id: "i-kirtasiye", name: "i-Kırtasiye", tag: "B2B", sector: "Kırtasiye", desc: "B2B kırtasiye pazaryeri. Okul/ofis tedarik kanalı, kampanya ve liste siparişi.", status: "Yayında", year: 2024, hue: 228 },
    { id: "i-nalbur", name: "i-Nalbur", tag: "B2B", sector: "Yapı", desc: "B2B nalbur pazaryeri. Yapı-hırdavat ihtiyaçlarında bölgesel tedarik.", status: "Beta", year: 2025, hue: 216 },
    { id: "i-zeruj", name: "i-Zeruj", tag: "B2B", sector: "Gıda", desc: "B2B zerzevat pazaryeri. Hal-restoran arası günlük sipariş.", status: "Beta", year: 2025, hue: 148 },
    { id: "memnuniyetimvar", name: "MemnuniyetimVar", tag: "Platform", sector: "Tüketici", desc: "Şikayet platformlarının aksine memnuniyet odaklı. Markalara olumlu deneyim akışı.", status: "Yakında", year: 2026, hue: 288 },
    { id: "i-kira", name: "i-Kira", tag: "Uygulama", sector: "Emlak", desc: "Kiracı ve ev sahibi anlaşma uygulaması. Sözleşme, ödeme, demirbaş ve teslim akışı.", status: "Yakında", year: 2026, hue: 200 },
  ];

  let i = 0;
  for (const p of projects) {
    await prisma.project.create({
      data: {
        slug: p.id,
        title: p.name,
        client: null,
        category: p.tag,
        sector: p.sector,
        status: p.status,
        hue: p.hue,
        shortDesc: p.desc,
        content: projectContent(p.name, p.desc, p.sector),
        coverImage: PROJECT_IMG[p.id],
        liveUrl: null,
        year: p.year,
        isFeatured: i % 5 === 0,
        order: i,
        seoTitle: p.name,
        seoDescription: p.desc,
      },
    });
    i++;
  }
  console.log(`✓ Projects (${projects.length})`);
}

async function seedSectors() {
  const existing = await prisma.sector.count();
  if (existing > 0) await prisma.sector.deleteMany();

  const sectors = [
    {
      slug: "ecza",
      name: "Eczane & Dermokozmetik",
      detail:
        "Türkiye'nin önde gelen eczane zincirleri ve dermokozmetik markaları için çok-satıcılı pazaryerleri ve kapalı B2B tedarik platformları geliştiriyoruz. Ürün tanıtımından sipariş akışına, stok yönetiminden bayi ilişkilerine kadar sektöre özel mevzuatla uyumlu, uçtan uca dijital çözümler.",
    },
    {
      slug: "kozmetik",
      name: "Kozmetik & Kişisel Bakım",
      detail:
        "Kozmetik ve kişisel bakım markalarının son kullanıcıya ulaşmasını kolaylaştıran mobil uygulamalar, e-ticaret siteleri ve cilt tipine göre kürasyon platformları üretiyoruz. INCI bileşen analizi, topluluk etkileşimi ve kişiye özel abonelik modelleriyle dönüşüm odaklı deneyimler tasarlıyoruz.",
    },
    {
      slug: "b2b",
      name: "B2B Pazaryerleri",
      detail:
        "Hırdavat, nalbur, zerzevat, bijuteri ve kırtasiye dikeylerinde toptancı–bayi arasında kapalı B2B pazaryeri çözümleri kurguluyoruz. Davetli ağ yapısı, kategori bazlı fiyat yönetimi, koli/kalem sipariş akışı ve cari takibini tek platformda bir araya getiren kurumsal sistemler.",
    },
    {
      slug: "erp",
      name: "Kurumsal Yazılım / ERP",
      detail:
        "KOBİ ve orta ölçekli işletmeler için e-belge entegre, çoklu şirket destekli muhasebe ERP çözümü üretiyoruz. Muhasebe kaydından finansal raporlamaya, bordro süreçlerinden bütçe planlamasına kadar işletmenin tüm finansal akışını tek panelden yönetilebilir hale getiriyoruz.",
    },
    {
      slug: "tuketici",
      name: "Tüketici Platformları",
      detail:
        "Günlük hayatı kolaylaştıran tüketici odaklı platformlar geliştiriyoruz — marka memnuniyet bildirim sistemleri ve kiracı–ev sahibi anlaşma uygulamaları gibi. Sözleşme yönetimi, dijital ödeme takibi ve sürtünmesiz kullanıcı deneyimini merkeze alan ürünler.",
    },
  ];

  for (let i = 0; i < sectors.length; i++) {
    await prisma.sector.create({ data: { ...sectors[i], order: i } });
  }
  console.log(`✓ Sectors (${sectors.length})`);
}

async function seedAboutValues() {
  const existing = await prisma.aboutValue.count();
  if (existing > 0) await prisma.aboutValue.deleteMany();

  const values = [
    {
      eyebrow: "Odak",
      title: "Uçtan uca ürün geliştirme",
      description:
        "Strateji, tasarım, mühendislik, operasyon — tek ekip, tek takvim.",
    },
    {
      eyebrow: "Yaklaşım",
      title: "Sahaya bakar, üretir, ölçer",
      description: "Eczacıyla sahada, markayla rafta, tüketiciyle uygulamada.",
    },
    {
      eyebrow: "Altyapı",
      title: "Paylaşımlı ve ölçekli",
      description: "Bir üründe çözdüğümüzü diğer ürünlere taşıyoruz.",
    },
    {
      eyebrow: "Destek",
      title: "Lansman sonrası devam",
      description:
        "Ürünü yayımlamak başlangıçtır; sürdürme sözleşmeleri ile yanında kalırız.",
    },
    {
      eyebrow: "Ekip",
      title: "Çoklu disiplin, tek takım",
      description:
        "Ürün, tasarım, mühendislik ve operasyon aynı ofiste — 38 kişi, tek çatı.",
    },
  ];

  for (let i = 0; i < values.length; i++) {
    await prisma.aboutValue.create({
      data: { ...values[i], order: i, isActive: true },
    });
  }
  console.log(`✓ AboutValues (${values.length})`);
}

async function seedPosts() {
  const existing = await prisma.post.count();
  if (existing > 0) await prisma.post.deleteMany();

  const posts = [
    {
      slug: "i-kira-ozel-beta-erisimi",
      tag: "Ürün",
      title: "i-Kira özel beta erişimi başladı",
      excerpt:
        "Kiracı ve ev sahipleri için dijital sözleşme ve ödeme takibi; ilk 500 kullanıcıya özel.",
      date: "2026-04-12",
      cover: IMG.newsProduct,
    },
    {
      slug: "dermokozmetikte-kapali-pazaryeri",
      tag: "Sektör",
      title: "Dermokozmetikte kapalı pazaryeri neden önemli?",
      excerpt:
        "i-Depo deneyiminden hareketle: davetli tedarik, fiyat dengesi ve marka koruma üzerine not.",
      date: "2026-04-04",
      cover: IMG.newsSector,
    },
    {
      slug: "ekipce-calisma-ritmimiz",
      tag: "Kültür",
      title: "Ekipçe çalışma ritmimiz: 4+1 hafta",
      excerpt:
        "Dört hafta ürün, bir hafta bakım ve yenilenme — neden işe yarıyor, hangi istisnalar var.",
      date: "2026-03-21",
      cover: IMG.newsCulture,
    },
    {
      slug: "i-kozmo-inci-2",
      tag: "Ürün",
      title: "i-Kozmo için INCI 2.0 yayında",
      excerpt:
        "Bileşen listelerini fotoğraftan okuyan yeni motor; cilt tipi uyumluluğu %37 daha doğru.",
      date: "2026-03-02",
      cover: IMG.newsInci,
    },
  ];

  for (const p of posts) {
    await prisma.post.create({
      data: {
        slug: p.slug,
        tag: p.tag,
        title: p.title,
        excerpt: p.excerpt,
        content: blogContent(p.title, p.excerpt),
        coverImage: p.cover,
        publishedAt: new Date(p.date),
        isPublished: true,
        seoTitle: p.title,
        seoDescription: p.excerpt,
      },
    });
  }
  console.log(`✓ Posts (${posts.length})`);
}

async function seedClients() {
  const existing = await prisma.client.count();
  if (existing > 0) await prisma.client.deleteMany();

  const clients = [
    "Dermopharma",
    "VitaLab",
    "KozmoPlus",
    "MavenHealth",
    "Nöropa",
    "Tekno Ecza",
    "Harmoni Group",
    "Kentpark",
    "Örnek AVM",
    "Fatih Kimya",
  ];

  for (let i = 0; i < clients.length; i++) {
    await prisma.client.create({
      data: { name: clients[i], order: i, isActive: true },
    });
  }
  console.log(`✓ Clients (${clients.length})`);
}

async function seedCareers() {
  const existing = await prisma.career.count();
  if (existing > 0) await prisma.career.deleteMany();

  const careers = [
    {
      slug: "kidemli-frontend-muhendisi",
      title: "Kıdemli Frontend Mühendisi",
      department: "i-Eczane",
      location: "İstanbul / Uzaktan",
      type: "Tam Zamanlı",
      shortDesc:
        "i-Eczane ürününde React/Next.js tabanlı ön-yüz çalışmaları; ölçek ve performans odaklı mimari kararlar.",
    },
    {
      slug: "urun-tasarimcisi",
      title: "Ürün Tasarımcısı",
      department: "i-Kozmo",
      location: "İstanbul",
      type: "Tam Zamanlı",
      shortDesc:
        "i-Kozmo mobil uygulamasında kullanıcı araştırmasından prototiplemeye kadar tüm süreç.",
    },
    {
      slug: "backend-muhendisi-go",
      title: "Backend Mühendisi (Go)",
      department: "i-Hesap",
      location: "Uzaktan",
      type: "Tam Zamanlı",
      shortDesc:
        "i-Hesap ERP ekibinde Go tabanlı servis mimarisi, çoklu şirket ve yüksek hacimli veri işleme.",
    },
    {
      slug: "buyume-pazarlama-uzmani",
      title: "Büyüme Pazarlama Uzmanı",
      department: "Merkez",
      location: "İstanbul",
      type: "Tam Zamanlı",
      shortDesc:
        "Tüm ürün portföyümüz genelinde kanal testi, içerik ve performans takibi.",
    },
  ];

  for (const c of careers) {
    await prisma.career.create({
      data: {
        ...c,
        content: `<p>${c.shortDesc}</p><h2>Beklentiler</h2><ul><li>Benzer pozisyonda 3+ yıl deneyim</li><li>Ekip içi işbirliği ve etkili iletişim</li><li>Ürün mindset'i ve analitik düşünce</li></ul><h2>Sunduklarımız</h2><ul><li>Uzak ve hibrit çalışma seçenekleri</li><li>Yıllık profesyonel gelişim bütçesi</li><li>İstanbul'da modern merkez ofis</li></ul>`,
        isActive: true,
      },
    });
  }
  console.log(`✓ Careers (${careers.length})`);
}

async function seedBanners() {
  // Mevcut yapıda Banner tablosunu yalnızca hero background için kullanıyorduk.
  // Tek-sayfa design'ında hero DB alanlarından (heroImageUrl, heroHeading) besleniyor.
  // Banner'ı boş bırak (veya admin'de gerekirse yönet).
  await prisma.banner.deleteMany();
  console.log("✓ Banners (0 — hero artık SiteSetting'den)");
}

async function main() {
  console.log("→ Seeding i-Grup database…");
  await seedAdmin();
  await seedSettings();
  await seedPages();
  await seedProjects();
  await seedSectors();
  await seedAboutValues();
  await seedPosts();
  await seedClients();
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
