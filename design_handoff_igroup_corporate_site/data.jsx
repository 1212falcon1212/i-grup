// Ortak veri — tüm yönler aynı içerikten besleniyor.

// Not: `img` alanı — proje site ekran görüntüsü için dosya yolu.
// Dosyaları `assets/projects/<id>.jpg` (veya .png) olarak projeye bırakın;
// yoksa otomatik olarak renkli placeholder gösterilir.
const IG_PROJECTS = [
  { id: 'i-eczane',        name: 'i-eczane',        tag: 'Pazaryeri',        sector: 'Eczane',     desc: 'Dermokozmetik eczane pazaryeri. Eczacılar ve markalar arası doğrudan stok ve sipariş akışı.', status: 'Yayında', year: 2023, hue: 264, img: 'assets/projects/i-eczane.jpg' },
  { id: 'i-depo',          name: 'i-depo',          tag: 'B2B',              sector: 'Eczane',     desc: 'B2B kapalı dermokozmetik pazaryeri. Distribütör–eczane arasında davetli tedarik ağı.',       status: 'Yayında', year: 2023, hue: 272, img: 'assets/projects/i-depo.jpg' },
  { id: 'i-kozmo',         name: 'i-kozmo',         tag: 'Mobil',            sector: 'Kozmetik',   desc: 'Kozmetik ürün tanıtım ve yorumlama mobil uygulaması. INCI okuma, topluluk ve rutin takibi.',  status: 'Yayında', year: 2024, hue: 296, img: 'assets/projects/i-kozmo.jpg' },
  { id: 'istanbulvitamin', name: 'istanbulvitamin', tag: 'E-ticaret',        sector: 'Kozmetik',   desc: 'Kişisel kozmetik e-ticaret sitesi. Cilt tipine göre kürasyon ve abonelik.',                  status: 'Yayında', year: 2022, hue: 310, img: 'assets/projects/istanbulvitamin.jpg' },
  { id: 'specialwhey',     name: 'specialwhey',     tag: 'E-ticaret',        sector: 'Kozmetik',   desc: 'Kişiye özel protein mix. Hedef/diyete göre formülasyon ve tekrar-siparişli abonelik.',       status: 'Yayında', year: 2024, hue: 320, img: 'assets/projects/specialwhey.jpg' },
  { id: 'i-hesap',         name: 'i-hesap',         tag: 'ERP',              sector: 'Kurumsal',   desc: 'Muhasebe ERP programı. KOBİ odaklı, e-belge entegre, çoklu şirket.',                          status: 'Yayında', year: 2021, hue: 252, img: 'assets/projects/i-hesap.jpg' },
  { id: 'i-hirdavat',      name: 'i-hırdavat',      tag: 'B2B',              sector: 'Hırdavat',   desc: 'B2B hırdavat pazaryeri. Toptancı–bayi arası kalem bazlı sipariş ve cari.',                   status: 'Yayında', year: 2024, hue: 240, img: 'assets/projects/i-hirdavat.jpg' },
  { id: 'i-bijuteri',      name: 'i-bijuteri',      tag: 'B2B',              sector: 'Aksesuar',   desc: 'B2B bijuteri pazaryeri. Üretici–perakendeci arası koli bazlı sipariş akışı.',                status: 'Yayında', year: 2024, hue: 304, img: 'assets/projects/i-bijuteri.jpg' },
  { id: 'i-kirtasiye',     name: 'i-kırtasiye',     tag: 'B2B',              sector: 'Kırtasiye',  desc: 'B2B kırtasiye pazaryeri. Okul/ofis tedarik kanalı, kampanya ve liste siparişi.',             status: 'Yayında', year: 2024, hue: 228, img: 'assets/projects/i-kirtasiye.jpg' },
  { id: 'i-nalbur',        name: 'i-nalbur',        tag: 'B2B',              sector: 'Yapı',       desc: 'B2B nalbur pazaryeri. Yapı–hırdavat ihtiyaçlarında bölgesel tedarik.',                       status: 'Beta',    year: 2025, hue: 216, img: 'assets/projects/i-nalbur.jpg' },
  { id: 'i-zeruj',         name: 'i-zeruj',         tag: 'B2B',              sector: 'Gıda',       desc: 'B2B zerzevat pazaryeri. Hal–restoran arası günlük sipariş.',                                  status: 'Beta',    year: 2025, hue: 148, img: 'assets/projects/i-zeruj.jpg' },
  { id: 'memnuniyetimvar', name: 'memnuniyetimvar', tag: 'Platform',         sector: 'Tüketici',   desc: 'Şikayetim var benzeri platform; ancak memnuniyet odaklı. Markalara olumlu deneyim akışı.',   status: 'Yakında', year: 2026, hue: 288, img: 'assets/projects/memnuniyetimvar.jpg' },
  { id: 'i-kira',          name: 'i-kira',          tag: 'Uygulama',         sector: 'Emlak',      desc: 'Kiracı ve ev sahibi anlaşma uygulaması. Sözleşme, ödeme, demirbaş ve teslim akışı.',          status: 'Yakında', year: 2026, hue: 200, img: 'assets/projects/i-kira.jpg' },
];

const IG_SECTORS = [
  { id: 'ecza',     name: 'Eczane & Dermokozmetik', count: 2, detail: 'Pazaryeri ve B2B tedarik' },
  { id: 'kozmetik', name: 'Kozmetik & Kişisel Bakım', count: 3, detail: 'Mobil, e-ticaret, kürasyon' },
  { id: 'b2b',      name: 'B2B Pazaryerleri',         count: 5, detail: 'Hırdavat · Nalbur · Zerzevat · Bijuteri · Kırtasiye' },
  { id: 'erp',      name: 'Kurumsal Yazılım / ERP',   count: 1, detail: 'Muhasebe, e-belge, çoklu şirket' },
  { id: 'tuketici', name: 'Tüketici Platformları',    count: 2, detail: 'Memnuniyet, kira anlaşması' },
];

const IG_STATS = [
  { k: '13', v: 'aktif proje' },
  { k: '6', v: 'sektör' },
  { k: '10+', v: 'yıllık tecrübe' },
  { k: '120K', v: 'son kullanıcı' },
];

const IG_NEWS = [
  { tag: 'Ürün',     date: '12 Nis 2026', title: 'i-kira özel beta erişimi başladı',                    excerpt: 'Kiracı ve ev sahipleri için dijital sözleşme ve ödeme takibi; ilk 500 kullanıcıya özel.' },
  { tag: 'Sektör',   date: '04 Nis 2026', title: 'Dermokozmetikte kapalı pazaryeri neden önemli?',      excerpt: 'i-depo deneyiminden hareketle: davetli tedarik, fiyat dengesi ve marka koruma üzerine not.' },
  { tag: 'Kültür',   date: '21 Mar 2026', title: 'Ekipçe çalışma ritmimiz: 4+1 hafta',                  excerpt: 'Dört hafta ürün, bir hafta bakım ve yenilenme — neden işe yarıyor, hangi istisnalar var.' },
  { tag: 'Ürün',     date: '02 Mar 2026', title: 'i-kozmo için INCI 2.0 yayında',                       excerpt: 'Bileşen listelerini fotoğraftan okuyan yeni motor; cilt tipi uyumluluğu %37 daha doğru.' },
];

const IG_CLIENTS = [
  'Dermopharma', 'VitaLab', 'KozmoPlus', 'MavenHealth', 'Nöropa', 'Tekno Ecza', 'Harmoni Group', 'Kentpark', 'Örnek AVM', 'Fatih Kimya',
];

const IG_JOBS = [
  { role: 'Kıdemli Frontend Mühendisi',          team: 'i-eczane',    loc: 'İstanbul / Uzaktan' },
  { role: 'Ürün Tasarımcısı',                    team: 'i-kozmo',     loc: 'İstanbul' },
  { role: 'Backend Mühendisi (Go)',              team: 'i-hesap',     loc: 'Uzaktan' },
  { role: 'Büyüme Pazarlama Uzmanı',             team: 'merkez',      loc: 'İstanbul' },
];

Object.assign(window, { IG_PROJECTS, IG_SECTORS, IG_STATS, IG_NEWS, IG_CLIENTS, IG_JOBS });
