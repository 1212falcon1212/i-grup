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

// Her proje için özel SEO zengin detay içeriği. Anahtar kelimeler doğal
// olarak yerleştirildi; H2/H3 yapısı, liste elemanları ve "Kimler için?" /
// "Öne çıkan özellikler" bölümleriyle tarama motoru dostu.
const PROJECT_CONTENT: Record<string, string> = {
  "i-eczane": `
<p>i-Eczane, eczacıların dermokozmetik ürün tedarikini tek bir platformdan yönettiği <strong>çok satıcılı eczane pazaryeridir</strong>. Markaların ürünlerini doğrudan eczacılarla buluşturur; aracı sayısını azaltır, fiyat dengesini korur.</p>
<h2>i-Eczane neden var?</h2>
<p>Türkiye'de eczacılar yüzlerce markanın stok, iade ve kampanya süreçlerini farklı kanallardan takip etmek zorundaydı. i-Eczane bu dağınıklığı tek bir arayüze indirir: sipariş, cari hesap, iade ve kampanya ekranları tek yerden çalışır.</p>
<h3>Temel işlevler</h3>
<ul>
  <li><strong>Multi-vendor pazaryeri:</strong> Onaylı markalar doğrudan kendi mağazalarını yönetir.</li>
  <li><strong>Eczacıya özel fiyatlandırma:</strong> Eczacı KDV, iskonto, kampanya görünümleri.</li>
  <li><strong>Dermokozmetik odaklı filtreler:</strong> Cilt tipi, endikasyon, INCI listesi ile arama.</li>
  <li><strong>Sipariş ve iade akışı:</strong> Barkod doğrulamalı hızlı iade, otomatik mutabakat.</li>
  <li><strong>Kampanya merkezi:</strong> Markaların gönderdiği promosyonlar tek panelden yönetilir.</li>
</ul>
<h3>Kimler için?</h3>
<p>Dermokozmetik ürün satan eczacılar ve bu eczacılara ulaşmak isteyen kozmetik/dermokozmetik markaları için uygun. Eczane zinciri olan işletmeler için çoklu şube desteği de bulunur.</p>
<h3>Mimari notlar</h3>
<p>Türkiye'nin farklı bölgelerine hizmet veren sistemin veri modeli; bölgesel stok, marka mağazası, eczacı cari ve mutabakat süreçlerini ayrı servisler olarak işler. Sipariş hacmi ve eş zamanlı kullanıcı artışında ölçeklenebilir yapı korunur.</p>
`.trim(),

  "i-depo": `
<p>i-Depo, <strong>dermokozmetik distribütörleri ile eczacılar arasında kurgulanmış kapalı bir B2B pazaryeridir</strong>. Davetli tedarikçi ağı yapısıyla fiyat şeffaflığını korur ve marka güvenliğini artırır.</p>
<h2>Neden kapalı bir pazaryeri?</h2>
<p>Açık pazaryerlerinde dermokozmetik markalarının fiyat politikaları çoğu zaman erozyona uğrar. i-Depo bu soruna davetli ağ modeliyle çözüm üretir: distribütörler yalnızca onaylı eczacılara satış yapar, fiyat grupları ve koşulları merkezi olarak tanımlanır.</p>
<h3>Temel işlevler</h3>
<ul>
  <li><strong>Davetli tedarik ağı:</strong> Her distribütör kendi eczacı portföyünü yönetir.</li>
  <li><strong>Koli ve kalem bazlı sipariş:</strong> Ürün grubu mantığıyla toplu sipariş.</li>
  <li><strong>Cari ve ödeme takibi:</strong> Vadeli bakiye, dekont eşleme, ekstre.</li>
  <li><strong>Fiyat grupları:</strong> Müşteri sınıfına göre otomatik fiyat motoru.</li>
  <li><strong>Kampanya ve iade yönetimi:</strong> Markayla distribütör arasında şeffaf akış.</li>
</ul>
<h3>Kimler için?</h3>
<p>Dermokozmetik ve ilaç dışı ürünlerin B2B satışını yöneten distribütörler, bu distribütörlerden tedarik alan bağımsız eczacılar ve bölgesel zincirler için tasarlandı.</p>
`.trim(),

  "i-kozmo": `
<p>i-Kozmo, <strong>kozmetik ürün bileşenlerini okuyan ve kişiye özel rutin öneren bir mobil uygulamadır</strong>. INCI listesini fotoğraftan okur, cilt tipi ve hassasiyetlere göre ürünleri değerlendirir.</p>
<h2>Kozmetikte şeffaflık için</h2>
<p>Ambalaj üzerindeki küçük punto INCI listesini kullanıcılar için anlaşılır hale getirmek uygulamanın çıkış noktası. i-Kozmo; bileşen veritabanı, cilt tipi eşleştirme ve kişiselleştirilmiş ürün önerisi üzerine kurulu.</p>
<h3>Öne çıkan özellikler</h3>
<ul>
  <li><strong>INCI fotoğraf okuma (OCR):</strong> Etiketten bileşen listesini çıkarır.</li>
  <li><strong>Cilt tipi profili:</strong> Kuru, karma, yağlı, hassas ciltlere özel uyarılar.</li>
  <li><strong>Rutin takibi:</strong> Sabah/akşam bakım akışı, hatırlatıcılar.</li>
  <li><strong>Topluluk yorumları:</strong> Gerçek kullanıcı deneyimleri ve cilt tipi eşleşmesi.</li>
  <li><strong>Ürün karşılaştırma:</strong> İki ürünün INCI farklarını yan yana gör.</li>
</ul>
<h3>Kimler için?</h3>
<p>Bilinçli kozmetik tüketicileri, hassas cilde sahip kullanıcılar, dermokozmetik yatırımı yapan ve ürün seçiminde şeffaflık arayan herkes için.</p>
`.trim(),

  istanbulvitamin: `
<p>İstanbulVitamin, <strong>cilt tipine göre kürasyon yapan kişisel kozmetik e-ticaret sitesidir</strong>. Kullanıcı kısa bir profil tanımlıyor, sistem ona uygun kozmetik ürünleri küratör olarak seçiyor ve aylık abonelik modeliyle gönderiyor.</p>
<h2>Kürasyon nasıl çalışır?</h2>
<p>Kullanıcı ilk girişte cilt tipi, hassasiyet, öncelik ve tercih sorularını yanıtlar. Öneri motoru bu girdilerle ürün kataloğunu daraltır, kullanıcıya özel bir kutu hazırlanır. Abonelik düzenli yenileme ve cilt tipi değişiklikleri için esnektir.</p>
<h3>Öne çıkan özellikler</h3>
<ul>
  <li><strong>Cilt tipi kürasyon motoru:</strong> Kişisel profile göre ürün önerisi.</li>
  <li><strong>Abonelik ve tek seferlik alışveriş:</strong> Aylık kutu veya istenilen ürün.</li>
  <li><strong>Profil güncelleme:</strong> Mevsim veya cilt değişikliklerine göre tekrar kürasyon.</li>
  <li><strong>İade garantisi:</strong> Beğenilmeyen ürünler için şeffaf iade.</li>
</ul>
<h3>Kimler için?</h3>
<p>Kozmetik alışverişinde karar yorgunluğu yaşayan, cilt tipine özel kürasyon isteyen ve tekrar sipariş kolaylığı arayan kullanıcılar için.</p>
`.trim(),

  specialwhey: `
<p>SpecialWhey, <strong>kişiye özel formüle edilen protein mix ve tekrar-siparişli abonelik platformudur</strong>. Hedef, diyet ve beslenme tercihlerine göre protein karışımı tasarlanır; aylık otomatik teslimatla son kullanıcıya ulaşır.</p>
<h2>Kişiye özel formülasyon</h2>
<p>Kullanıcı spor hedefini, diyet kısıtlarını ve tat tercihlerini girer. Sistem bu girdilerle whey, izolat, aroma ve tatlandırıcı oranını tasarlar. Her kutu müşterinin adına hazırlanır, etikette formülasyon detayı yer alır.</p>
<h3>Öne çıkan özellikler</h3>
<ul>
  <li><strong>Kişisel formülasyon:</strong> Kas gelişimi, kilo yönetimi veya rejim uyumu hedefine göre.</li>
  <li><strong>Aylık abonelik:</strong> Otomatik hazırlık, kargo ve fatura akışı.</li>
  <li><strong>Formül güncelleme:</strong> Antrenman programı değiştiğinde karışım yeniden hesaplanır.</li>
  <li><strong>Türkçe içerik etiketi:</strong> Her bileşenin işlevi açıklanır.</li>
</ul>
<h3>Kimler için?</h3>
<p>Düzenli protein takviyesi kullanan sporcular, diyet kısıtı olan kullanıcılar ve süpermarket formülleri yerine kişiselleştirilmiş çözüm isteyenler için.</p>
`.trim(),

  "i-hesap": `
<p>i-Hesap, <strong>KOBİ ve orta ölçekli işletmeler için geliştirdiğimiz e-belge entegre muhasebe ERP yazılımıdır</strong>. Çoklu şirket desteği, e-Fatura, e-Arşiv ve e-SMM entegrasyonlarıyla muhasebe süreçlerini tek panelden yönetir.</p>
<h2>Neden bu çözüm?</h2>
<p>KOBİ'ler için piyasadaki muhasebe yazılımları ya çok basit ya da aşırı karmaşık. i-Hesap; günlük kullanımda sadeliği korurken e-belge akışları, maaş bordrosu, stok ve cari takibini tek bir yerde çalıştırır.</p>
<h3>Öne çıkan özellikler</h3>
<ul>
  <li><strong>e-Fatura, e-Arşiv, e-SMM:</strong> GİB entegrasyonu yerleşik.</li>
  <li><strong>Çoklu şirket:</strong> Tek hesap üzerinden birden fazla şirket yönetimi.</li>
  <li><strong>Stok ve depo:</strong> Çok depolu stok, seri/lot takibi, barkod üretimi.</li>
  <li><strong>Cari ve banka:</strong> Mutabakat, ekstre, kur farkı otomatik kayıtları.</li>
  <li><strong>Bordro ve SGK:</strong> Maaş bordroları, ek ödeme, SGK bildirimleri.</li>
  <li><strong>Finansal raporlar:</strong> Gelir-gider, bilanço, KDV beyannamesi.</li>
</ul>
<h3>Kimler için?</h3>
<p>1–200 kullanıcılı KOBİ'ler, aile şirketleri, mali müşavirler ve hızlı büyüyen e-ticaret operasyonları için.</p>
`.trim(),

  "i-hirdavat": `
<p>i-Hırdavat, <strong>hırdavatçılık sektöründe toptancı–bayi arasında kapalı B2B pazaryeri çözümüdür</strong>. Yüzlerce farklı kalem arasında hızlı sipariş, cari takibi ve kampanya yönetimini tek platformda yapar.</p>
<h2>Sektörün ihtiyacı neydi?</h2>
<p>Hırdavat sektöründe ürün çeşitliliği binlerce kalem bazında çalışır. Manuel sipariş alım-verim süreçleri hem zaman alır hem hataya açıktır. i-Hırdavat bu süreci dijitalleştirir: bayi kendi fiyat grubundan kalem bazlı sipariş verir, toptancı sistemsel onay akışıyla sevk hazırlar.</p>
<h3>Öne çıkan özellikler</h3>
<ul>
  <li><strong>Kalem bazlı hızlı sipariş:</strong> Ürün kodu veya barkod ile direkt ekleme.</li>
  <li><strong>Fiyat grupları ve özel iskonto:</strong> Her bayiye özel fiyat.</li>
  <li><strong>Cari bakiye takibi:</strong> Vadeli satış, çek/senet, ödeme hatırlatmaları.</li>
  <li><strong>Kampanya yönetimi:</strong> Grup bazlı indirim ve promosyon.</li>
  <li><strong>Sevkiyat takibi:</strong> Koli, irsaliye, gerçek zamanlı durum.</li>
</ul>
<h3>Kimler için?</h3>
<p>Hırdavatçılık, el aleti, inşaat malzemesi dağıtımı yapan toptancılar ve bu toptancılardan tedarik alan perakende bayileri için.</p>
`.trim(),

  "i-bijuteri": `
<p>i-Bijuteri, <strong>bijuteri üreticileri ve perakendeciler arasında koli bazlı sipariş akışı kuran B2B pazaryeridir</strong>. Moda takı dikeyinin hızlı sezon döngülerine göre tasarlandı.</p>
<h2>Bijuteri sektörüne özel</h2>
<p>Takı ve aksesuar sektörü kısa döngülü, görselden satan bir pazar. i-Bijuteri üreticinin yeni sezon kolleksiyonunu perakendeciyle hızlıca buluşturur; koli bazlı sipariş kolaylığı sayesinde toplu alım kararları hızlanır.</p>
<h3>Öne çıkan özellikler</h3>
<ul>
  <li><strong>Koli bazlı sipariş:</strong> Model karışık koli veya tek model koli seçimleri.</li>
  <li><strong>Koleksiyon sunumu:</strong> Yüksek çözünürlüklü ürün galerisi.</li>
  <li><strong>Sezon kategori yönetimi:</strong> Yaz/kış kolleksiyon geçişleri.</li>
  <li><strong>Cari hesap ve ödeme:</strong> Vadeli satış ve havuz hesabı.</li>
</ul>
<h3>Kimler için?</h3>
<p>Bijuteri üreticileri, ithalatçılar ve butik perakendeciler için.</p>
`.trim(),

  "i-kirtasiye": `
<p>i-Kırtasiye, <strong>okul ve ofis tedarik kanalında B2B kırtasiye pazaryeri</strong> olarak tasarlandı. Toptancılar liste bazlı kampanyalarını yayınlar, perakendeciler ve kurumlar okul dönemine uygun toplu siparişler verir.</p>
<h2>Liste bazlı sipariş kolaylığı</h2>
<p>Kırtasiye sektörünün kritik dönemi okul başlangıcı; tedarikçi, kampanya ve ürün listeleri aynı anda hareketlenir. i-Kırtasiye; sezonluk liste yönetimi, kampanya toplamalı fiyatlama ve toplu sipariş akışıyla bu süreci kolaylaştırır.</p>
<h3>Öne çıkan özellikler</h3>
<ul>
  <li><strong>Okul listesi import:</strong> Excel/CSV'den liste yükle, direkt siparişe dönüştür.</li>
  <li><strong>Sezon kampanyası:</strong> Dönemsel indirim ve paket ürünler.</li>
  <li><strong>Grup sipariş:</strong> Okul veya şirket grupları için konsolide sipariş.</li>
  <li><strong>Ürün kategorileri:</strong> Okul, ofis, sanat malzemeleri filtreleri.</li>
</ul>
<h3>Kimler için?</h3>
<p>Kırtasiye toptancıları, okul–ofis tedariki yapan distribütörler, kurumsal alım yapan firmalar ve zincir kırtasiye perakendecileri için.</p>
`.trim(),

  "i-nalbur": `
<p>i-Nalbur, <strong>yapı–hırdavat ihtiyaçlarında bölgesel tedarik süreçlerini dijitalleştiren B2B nalbur pazaryeridir</strong>. Şu an özel beta aşamasında; seçili bölgelerdeki tedarikçi ve bayilerle birlikte geliştiriyoruz.</p>
<h2>Neden bölgesel tedarik?</h2>
<p>Yapı sektöründe lojistik maliyeti ürünün fiyatından büyük. i-Nalbur bu sorunu bölgesel toptancı–bayi eşleştirmesiyle çözer: en yakın stoktan sevkiyat, daha hızlı teslim.</p>
<h3>Öne çıkan özellikler (beta)</h3>
<ul>
  <li><strong>Bölgesel stok haritası:</strong> Konum bazlı tedarikçi eşleştirme.</li>
  <li><strong>Yapı–hırdavat katalog:</strong> Elektrik, su, inşaat kategorileri.</li>
  <li><strong>Proje bazlı sipariş:</strong> İnşaat siteleri için liste sipariş.</li>
  <li><strong>Teslimat takibi:</strong> Kamyon sevki ve saha teslimatı.</li>
</ul>
<h3>Kimler için?</h3>
<p>İnşaat firmaları, yapı malzemeleri bayileri, proje yöneticileri ve bölgesel nalbur toptancıları için.</p>
`.trim(),

  "i-zeruj": `
<p>i-Zeruj, <strong>hal ile restoran arasındaki günlük zerzevat sipariş akışını dijitalleştiren B2B platformudur</strong>. Şu an beta sürecinde; İstanbul'da seçili hal esnafı ve restoranlarla canlıya alındı.</p>
<h2>Günlük sipariş ritmi</h2>
<p>Restoranların zerzevat alımı çoğunlukla sabaha karşı telefonla yapılıyor; fiyat değişkenliği, sipariş doğruluğu ve sevkiyat takibi zorlaşıyor. i-Zeruj bu akışı şeffaflaştırır: restoran halin fiyat tablosunu görür, sipariş verir, sevkiyat takip eder.</p>
<h3>Öne çıkan özellikler (beta)</h3>
<ul>
  <li><strong>Günlük fiyat tablosu:</strong> Hal fiyatları gerçek zamanlı.</li>
  <li><strong>Gece sipariş alımı:</strong> Restoran sabah menüsüne göre akşamdan sipariş.</li>
  <li><strong>Sevkiyat takibi:</strong> Araç ve teslim saati bildirimi.</li>
  <li><strong>Vadeli satış:</strong> Restoran cari takibi ve ödeme vadeleri.</li>
</ul>
<h3>Kimler için?</h3>
<p>Hal esnafı, toptan zerzevat tedarikçileri, restoranlar, catering firmaları ve otel mutfakları için.</p>
`.trim(),

  memnuniyetimvar: `
<p>MemnuniyetimVar, <strong>markalara ve hizmet sağlayıcılarına müşterilerinden olumlu deneyim akışı kazandıran tüketici platformudur</strong>. Şikayet odaklı platformların aksine; memnuniyet bildirimi, teşekkür ve öneri üzerine kurulu. Yakında yayında.</p>
<h2>Neden pozitif odaklı?</h2>
<p>Markalar olumsuz geri bildirimleri kolayca takip edebiliyor ama olumlu deneyimlerin görünürlüğü sınırlı. MemnuniyetimVar; müşterinin marka, çalışan veya hizmet için bıraktığı olumlu notları yapılandırılmış veri olarak markaya ulaştırır.</p>
<h3>Platform özellikleri</h3>
<ul>
  <li><strong>Memnuniyet bildirimi:</strong> Kullanıcı kısa formla marka/çalışan taglı.</li>
  <li><strong>Marka paneli:</strong> Gelen olumlu geri bildirimler, trend raporları.</li>
  <li><strong>Çalışan tanıma:</strong> Hizmet personeline özel övgü akışı.</li>
  <li><strong>SEO dostu paylaşım:</strong> Markanın rozeti, kullanıcı sayfası.</li>
</ul>
<h3>Kimler için?</h3>
<p>Perakende, hizmet sektörü, restoran, otel, finans ve sağlık gibi müşteri deneyiminin kritik olduğu markalar için.</p>
`.trim(),

  "i-kira": `
<p>i-Kira, <strong>kiracı ve ev sahibi arasındaki süreci dijitalleştiren bir mobil uygulamadır</strong>. Sözleşme, ödeme, demirbaş ve teslim aşamalarını şeffaf bir şekilde yönetir. Yakında özel beta erişimiyle yayında olacak.</p>
<h2>Kira sürecinin tam dijitalleşmesi</h2>
<p>Kira sürecinde en büyük sürtünmeler sözleşme imzası, depozito, demirbaş teslimi ve aylık ödeme takibinde yaşanıyor. i-Kira bu adımları uygulama içinden imzalanabilir sözleşme, dijital ödeme ve fotoğraflı demirbaş listesiyle tek akışa indirir.</p>
<h3>Öne çıkan özellikler</h3>
<ul>
  <li><strong>Dijital kira sözleşmesi:</strong> Noter onaylı, iki tarafın sayısal imzasıyla.</li>
  <li><strong>Otomatik ödeme:</strong> Kart, havale veya direkt tahsilat; otomatik makbuz.</li>
  <li><strong>Demirbaş envanteri:</strong> Fotoğraflı teslim listesi, hasar bildirimi.</li>
  <li><strong>Çıkış prosedürü:</strong> Depozito iadesi, son dönem hesabı.</li>
  <li><strong>Bildirim merkezi:</strong> Zam, yenileme, ödeme hatırlatmaları.</li>
</ul>
<h3>Kimler için?</h3>
<p>Bireysel ev sahipleri, kiracılar, küçük ölçekli gayrimenkul portföyü yöneten yatırımcılar ve kısa dönem kiralık işletenler için.</p>
`.trim(),
};

// Her blog yazısı için özel SEO içeriği
const POST_CONTENT: Record<string, string> = {
  "i-kira-ozel-beta-erisimi": `
<p>Uzun süredir üzerinde çalıştığımız <strong>i-Kira uygulaması</strong> bugün ilk 500 kullanıcıya özel beta erişimi ile yayında. Kiracı ve ev sahibi arasındaki süreci baştan sona dijitalleştiren bir uygulama üzerinde çalışıyoruz — bu yazıda nereye odaklandığımızı ve bundan sonra ne gelecek paylaşıyoruz.</p>
<h2>Neden bu ürün?</h2>
<p>Kira sözleşmesi, depozito, demirbaş teslimi, aylık ödeme, çıkış prosedürü — her aşamada ayrı bir form, ayrı bir belge, ayrı bir muhatap. İki arkadaş olarak kendi kira deneyimlerimizi dijitalleştirme fikriyle başladık; son iki yıldır bu fikri bireysel ev sahipleri ve kiracılarla test ettik.</p>
<h2>Beta sürümünde neler var?</h2>
<ul>
  <li><strong>Dijital kira sözleşmesi:</strong> İki tarafın onayıyla, saklı ve paylaşılabilir.</li>
  <li><strong>Otomatik aylık tahsilat:</strong> Makbuz kaydı otomatik oluşur.</li>
  <li><strong>Fotoğraflı demirbaş listesi:</strong> Teslim sırasındaki durum bir dokunuşla arşivlenir.</li>
  <li><strong>Bildirim merkezi:</strong> Yenileme, zam, ödeme günü hatırlatmaları.</li>
</ul>
<h2>Neleri daha sonraya bıraktık?</h2>
<p>İlk 500 kullanıcıya özel olarak; noter entegrasyonu, çıkış prosedürü ve zam pazarlığı akışları beta ikinci fazda geliyor. Bu sürümü test eden kullanıcılardan gelen gerçek kullanım verisi sonraki özelliklerin önceliğini belirleyecek.</p>
<h2>Katılmak için</h2>
<p>Erişim davet kodu ile veriliyor. Siz de katılmak istiyorsanız iletişim formundan bize yazın; uygun kullanıcılarımıza bir sonraki parti ile davet gönderiyoruz.</p>
`.trim(),

  "dermokozmetikte-kapali-pazaryeri": `
<p>Dermokozmetik sektörü son beş yılda Türkiye'de hızlı büyüdü; ancak büyüme beraberinde fiyat erozyonu, marka korunması ve yetkisiz satış kanalları gibi ciddi sorunları getirdi. Bu yazıda <strong>i-Depo ile geliştirdiğimiz kapalı B2B pazaryeri modelinin</strong> bu sorunlara verdiği yanıtı paylaşıyoruz.</p>
<h2>Neden "kapalı" pazaryeri?</h2>
<p>Açık platformlar — pazaryerleri veya genel e-ticaret siteleri — dermokozmetik gibi dikey ürün gruplarında iki büyük soruna yol açıyor:</p>
<ul>
  <li><strong>Fiyat yıpranması:</strong> Aynı ürün farklı satıcılarda farklı fiyatla görünüyor, marka değeri düşüyor.</li>
  <li><strong>Yetkisiz satıcı:</strong> Distribütör ağının dışından gelen ürünler garanti/iade süreçlerinde zorluk yaratıyor.</li>
</ul>
<p>Kapalı pazaryeri, distribütörün onayladığı eczacı veya perakendeci ağına özel erişim açar. Dışarıdan kimse göremez, sipariş veremez. Bu model hem fiyat dengesini korur hem de ürünün gerçek kaynağını garanti eder.</p>
<h2>i-Depo'nun yaklaşımı</h2>
<p>i-Depo'da her distribütör kendi eczacı portföyünü yönetiyor. Fiyat grupları merkezi olarak tanımlanıyor; bir eczacı yalnızca bağlı olduğu distribütörün katalog ve fiyatlarını görüyor. Bu ayrışım sayesinde:</p>
<ul>
  <li>Marka fiyat politikası korunuyor.</li>
  <li>Eczacı, güvenilir bir kanaldan tedarik alıyor.</li>
  <li>Distribütör, sahada kimin ne satın aldığını veriyle görüyor.</li>
</ul>
<h2>Çıkarılacak ders</h2>
<p>Dermokozmetik, eczacı, medikal gibi düzenlemelere tabi sektörler; açık platform yerine kapalı ağ modellerinden çok daha fazla fayda görüyor. Marka güvenliği ve fiyat disiplini isteyen üretici/distribütörler için kapalı pazaryeri ciddi bir alternatif.</p>
`.trim(),

  "ekipce-calisma-ritmimiz": `
<p>İki kişi olarak 13 aktif ürünü nasıl yönetiyoruz? En çok sorulan soru bu. Cevap kısa: <strong>disiplinli bir haftalık ritim ve paylaşımlı altyapı</strong>. Bu yazıda haftalık takvimimizi, ürünler arası önceliklendirmeyi ve dört yıldır uyguladığımız "4+1 hafta" modelini anlatıyoruz.</p>
<h2>4+1 hafta modeli</h2>
<p>Her ay beş haftaya bölünüyor: dört hafta yeni geliştirme, bir hafta bakım ve dinlenme. Bu basit kural sayesinde;</p>
<ul>
  <li>Aktif geliştirme haftalarında rutin işler sekteye uğramıyor.</li>
  <li>Bakım haftasında müşteri destek ve hata ayıklama rahat biriktiriliyor.</li>
  <li>Birikmiş teknik borç "bir hafta dinlenme" tampon zamanında temizleniyor.</li>
</ul>
<h2>Ürünler arası önceliklendirme</h2>
<p>13 ürünü aynı anda geliştiremiyoruz. Her çeyrek başında hangi ürünün hangi aşamada olacağına birlikte karar veriyoruz. Yayındaki ürünler minimum bakım yüküyle çalışır; beta olanlar hızlı iterasyona ihtiyaç duyar; yakında olanlar ise odak haftalarının çoğunu alır.</p>
<h2>Paylaşımlı altyapı</h2>
<p>Farklı ürünlerde tekrar eden ihtiyaçlar (kimlik doğrulama, bildirim, ödeme, cari hesap) paylaşımlı modüller haline getirildi. i-Eczane ve i-Depo aynı kimlik sistemini kullanıyor; i-Hesap'taki fatura motoru diğer pazaryerlerinde de çalışıyor. Bu yaklaşım 13 ürünü 2 kişiyle yönetmeyi mümkün kılan tek şey.</p>
<h2>İstisnalar ve öğrendiklerimiz</h2>
<p>Plan her zaman tutmuyor — bir ürün krizi veya beklenmedik özellik talebi geldiğinde modeli bozuyoruz. Önemli olan iki hafta sonra ritmi yeniden kurabilmek. Dört yıllık deneyimle en büyük öğrendiğimiz: <em>sprint yapmaktan çok sürdürülebilir hız çok daha önemli</em>.</p>
`.trim(),

  "i-kozmo-inci-2": `
<p><strong>i-Kozmo için yeni INCI 2.0 motoru bugün yayında.</strong> Kozmetik ürün etiketlerindeki bileşen listesini fotoğraftan okuyan motorumuzu tamamen yeniledik; cilt tipi uyumluluğunu %37 daha doğru hesaplıyor.</p>
<h2>Neyi geliştirdik?</h2>
<p>INCI 1.0 versiyonu temel OCR ve bileşen veritabanı karşılaştırmasına dayanıyordu. 2.0'da üç ana yenilik var:</p>
<ul>
  <li><strong>Geliştirilmiş OCR:</strong> Işık, çekim açısı ve ambalaj yansıması daha dayanıklı tanıma.</li>
  <li><strong>Cilt tipi eşleştirme modeli:</strong> Bileşen bazlı risk değerlendirmesi, cilt tipi profiliyle karşılaştırma.</li>
  <li><strong>Yakında ürünler veritabanı:</strong> 12.000+ kozmetik ürünü önceden taranmış olarak geliyor.</li>
</ul>
<h2>Ne anlama geliyor?</h2>
<p>Eski sürümde bir ürünün hassas cildinize uygun olup olmadığını söylemek %60 doğrulukla sınırlıydı. 2.0 ile bu oran %97'ye çıktı. Yani fotoğrafı çektiğinizde; sadece bileşen listesini değil, cilt tipinize özel risk seviyesini ve alternatif ürün önerilerini görüyorsunuz.</p>
<h2>Veri gizliliği</h2>
<p>Çektiğiniz fotoğraflar cihazda işleniyor; yalnızca bileşen listesi metni sunucuya gönderiliyor. Fotoğraflar bizde saklanmıyor.</p>
<h2>Ne zaman?</h2>
<p>Güncelleme otomatik olarak App Store ve Google Play'de yayında. Kullanıcıların %95'ine ulaşmasını önümüzdeki hafta içinde bekliyoruz.</p>
`.trim(),
};

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
      "İki ortağın kendi inisiyatifiyle yayınladığı 13 aktif ürünün portföy sitesi.",
    email: "merhaba@i-grup.com.tr",
    phone: "+90 212 000 00 00",
    whatsapp: "+905000000000",
    address: "İstanbul",
    linkedinUrl: "https://www.linkedin.com/company/i-Grup",
    instagramUrl: "https://www.instagram.com/i-Grup",
    xUrl: "https://x.com/igroup",
    footerText:
      "İki ortağın bağımsız olarak yayınladığı ürün portföyü. i-Eczane, i-Depo, i-Kozmo, İstanbulVitamin, SpecialWhey, i-Hesap, i-Hırdavat, i-Bijuteri, i-Kırtasiye, i-Nalbur, i-Zeruj, MemnuniyetimVar, i-Kira — hepsi kendi fikrimiz, kendi bakımımız altında.",
    defaultSeoTitle:
      "i-Grup — Eczane, kozmetik ve B2B alanlarında 13 aktif ürün",
    defaultSeoDesc:
      "İki ortağın yayınladığı 13 aktif ürün: eczane pazaryeri, B2B dermokozmetik tedariki, kozmetik mobil uygulaması, muhasebe ERP, B2B hırdavat-bijuteri-kırtasiye platformları ve tüketici uygulamaları. Bağımsız olarak fikirden yayına kadar geliştirilen ürün portföyümüz.",
    statProjects: 13,
    statSectors: 6,
    statYears: 8,
    statEndUsers: "120K",
    teamSize: 2,
    foundedYear: 2018,
    heroHeading:
      "Eczane, kozmetik, B2B ve tüketici için 13 aktif ürün geliştirdik.",
    heroHighlight: "13 aktif ürün geliştirdik.",
    heroSubtitle:
      "2018'den beri iki arkadaş olarak kendi fikirlerimizi ürüne dönüştürüyoruz. Eczane pazaryerinden B2B tedarik ağlarına, kozmetik mobil uygulamadan kurumsal muhasebe yazılımına kadar uzanan 13 aktif ürün — hepsi kendi sermayemiz, kendi bakımımız altında.",
    heroStatusText: "İki ortağın ürün portföyü · 2018'den beri",
    heroImageUrl: IMG.heroOffice,
    heroCtaPrimaryLabel: "Ürünlerimiz",
    heroCtaPrimaryUrl: "#projeler",
    heroCtaSecondaryLabel: "İletişime geç",
    heroCtaSecondaryUrl: "#iletisim",
    heroOverlayLabel: "YAPI",
    heroOverlayTitle: "2 ortak, 13 ürün",
    heroOverlayDescription:
      "Ürün yönetimi, tasarım ve mühendisliği birlikte yürüten iki kişilik bağımsız yapı.",
    aboutHeading: "İki arkadaş; fikirden canlı ürüne.",
    aboutLead:
      "2018'de iki arkadaş olarak kendi ürünlerimizi yayınlamaya başladık. Bugün 13 aktif ürünümüz var — hepsi kendi fikrimiz, kendi sermayemiz ve kendi bakımımız altında. Başkasına proje yapmıyoruz; kendi ürünlerimizi üretiyor, işletiyor ve büyütüyoruz. Eczane pazaryerlerinden B2B tedarik ağlarına, kozmetik mobil uygulamalardan kurumsal muhasebe yazılımına kadar tüm ürünler paylaşımlı bir altyapı üzerinde koşuyor.",
    aboutImage1: IMG.aboutOffice,
    aboutImage2: IMG.aboutTeam,
    aboutImage3: IMG.officeFloor,
    careersHeading: "Sabit ekip yerine doğru freelance ortaklar.",
    careersLead:
      "İki ortaklı bir yapıyız; sabit kadro büyütmüyoruz. Freelance veya proje bazlı işbirliği için kapımız her zaman açık — özellikle React/Next.js ön yüz, Go backend ve ürün tasarımı alanlarında.",
    careersImage: IMG.careersOffice,
    careersEmptyTitle: "Şu an sabit pozisyon aramıyoruz",
    careersEmptyText:
      "Ancak freelance veya proje bazlı işbirliği için portföyünüzü gönderin — değerlendirmek için hepsini okuyoruz.",
    careersApplyLabel: "Portföy Gönder →",
    contactHeading: "Ürünlerimiz hakkında konuşalım.",
    contactHighlight: "Ürünlerimiz",
    contactLead:
      "Demo talep ediyor, entegrasyon hakkında soru sormak veya işbirliği konuşmak istiyorsanız kısa bir form yeterli. 48 saat içinde ikimizden biri dönüyor.",
    officeHours: "Pazartesi – Cuma · 09:30 – 18:30",
    projectsEyebrow: "Ürünler",
    projectsTitle: "Kendi inisiyatifimizle yayınladığımız 13 aktif ürün.",
    projectsLead:
      "Eczane pazaryerinden B2B tedarike, kozmetik mobil uygulamadan kurumsal muhasebe yazılımına kadar birbirini besleyen ürün portföyümüz. Her biri kendi fikrimiz; paylaşımlı altyapıyla koşuyor.",
    sectorsEyebrow: "Sektörler",
    sectorsTitle: "Odaklandığımız beş dikey.",
    sectorsLead:
      "13 ürünü yayınlarken sektörü anlamak kadar içinde uzun zaman geçirmek de önemli. Her sektörde öğrendiğimizi diğerine taşıyoruz.",
    clientsEyebrow: "Birlikte çalıştıklarımız",
    clientsTitle: "Ürünlerimizi kullanan markalar ve tedarikçiler.",
    clientsLead:
      "i-Eczane ve i-Depo üzerinden dermokozmetik dağıtımı yapan distribütörler, kozmetik markaları ve zincir perakendeciler.",
    blogEyebrow: "Günlük",
    blogTitle: "Ürünlerimizin arka planı ve sektör notları.",
    blogLead:
      "13 ürünü 2 kişiyle yönetirken öğrendiklerimiz, ürün lansmanları ve sektörün gündemi — doğrudan iki ortağın kalemi.",
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
      subtitle: "İki ortağın bağımsız ürün portföyü.",
      content: `
<p>i-Grup, iki arkadaşın 2018'den beri kendi fikirleri ile yayınladığı ürünlerin ortak çatısıdır. Yazılım stüdyosu değiliz — başkasına proje yapmıyor, kendi ürünlerimizi geliştirip işletiyoruz.</p>
<h2>Kendi ürünlerimiz</h2>
<p>Bugün 13 aktif ürünümüz var: eczane pazaryeri (i-Eczane), B2B dermokozmetik tedarik platformu (i-Depo), kozmetik mobil uygulaması (i-Kozmo), kişiye özel kozmetik e-ticareti (İstanbulVitamin), protein abonelik platformu (SpecialWhey), KOBİ muhasebe yazılımı (i-Hesap), dört farklı B2B pazaryeri (i-Hırdavat, i-Bijuteri, i-Kırtasiye, i-Nalbur), günlük zerzevat pazaryeri (i-Zeruj), tüketici memnuniyet platformu (MemnuniyetimVar) ve kira anlaşma uygulaması (i-Kira).</p>
<h2>Yapımız</h2>
<p>İki kişiyiz: ürün ve mühendislik bir arada. Sabit kadromuz yok; gerektiğinde freelance ortaklarla çalışıyoruz. Tüm ürünlerimiz paylaşımlı bir altyapı üzerinde koşuyor — kimlik doğrulama, bildirim, ödeme ve cari modülleri tek bir yerde, sonra da farklı ürünlere yayılıyor. Bu yaklaşım 13 ürünü 2 kişiyle yönetmeyi mümkün kılan tek şey.</p>
<h2>Neye değer veriyoruz?</h2>
<ul>
  <li><strong>Süreklilik:</strong> Ürünü yayımlamak başlangıç, ayakta tutmak asıl iş.</li>
  <li><strong>Özerklik:</strong> Başkasına iş yapmıyoruz; öncelikleri kendimiz belirliyoruz.</li>
  <li><strong>Doğrudan müşteri:</strong> Kullanıcı geri bildirimini ilk elden topluyoruz.</li>
  <li><strong>Paylaşımlı altyapı:</strong> Bir üründe çözdüğümüz sorunu diğerinde de çözmek.</li>
</ul>
<p>Herhangi bir ürünümüz hakkında demo, entegrasyon veya ortaklık konuşmak için iletişim sayfasından bize yazabilirsiniz.</p>
`.trim(),
    },
    {
      slug: "misyonumuz",
      title: "Misyonumuz",
      subtitle: "Kurduğumuz ürünleri yıllarca ayakta tutmak.",
      content: `
<p>i-Grup'un tek bir misyonu var: <strong>kurduğumuz ürünleri kısa sürede lansman değil, yıllarca sürdürülebilir hale getirmek</strong>. İki ortaklı bir yapı için 13 aktif ürünü aynı anda koşturmak disiplin ister; bu disiplini üç prensibe dayandırıyoruz.</p>
<h2>1. Kendi inisiyatifimiz</h2>
<p>Başkasının fikrine proje yapmıyoruz. Her ürün kendi gördüğümüz bir problemden doğar; ihtiyacı hem kullanıcı olarak hem de saha verisi olarak kontrol ederiz. Bu yaklaşım önceliklerimizin dış ajandalardan etkilenmesini engeller.</p>
<h2>2. Ürünlerin kendi ayakları üstünde durması</h2>
<p>Bir ürünün yayımlanması onun olgunluğa erişmesi değildir — asıl iş lansmandan sonra başlar. Ürünün kendi kendini finanse etmesi, kullanıcı tabanının yavaşça genişlemesi ve bakım yükünün makul seviyede kalması bizim için başarı kriteri.</p>
<h2>3. Paylaşımlı altyapı ile ölçeklenmek</h2>
<p>13 farklı ürünü her birine ayrı bir alt yapı yazarak yönetemeyiz. Kimlik doğrulama, bildirim, ödeme, cari, raporlama gibi ortak ihtiyaçlar <strong>paylaşımlı modüller</strong> olarak çıkarıldı. Bu sayede yeni bir pazaryeri projemiz üç-dört ayda canlıya alınıyor.</p>
<h2>Uzun vadeli niyet</h2>
<p>Bundan on yıl sonra ürünlerimizin hâlâ aktif ve büyüyor olmasını hedefliyoruz. Hızlı büyümek yerine sürdürülebilir büyümek; 50 kişiye ulaşmak yerine iki kişi ile 20 ürün yönetmek. İşimiz bu.</p>
`.trim(),
    },
    {
      slug: "kvkk",
      title: "KVKK Aydınlatma Metni",
      subtitle: "Kişisel verilerin korunması.",
      content: `
<p>i-Grup olarak, <strong>6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK)</strong> kapsamında veri sorumlusu sıfatıyla kişisel verilerinizi aşağıdaki ilkeler doğrultusunda işleriz.</p>
<h2>Toplanan veriler</h2>
<ul>
  <li><strong>İletişim formu:</strong> Ad soyad, e-posta, şirket, mesaj.</li>
  <li><strong>Kariyer başvurusu:</strong> Ad soyad, e-posta, telefon, LinkedIn profili, özgeçmiş (PDF).</li>
  <li><strong>Analitik:</strong> Tarayıcı bilgileri, IP adresi (anonim), ziyaret süresi.</li>
</ul>
<h2>İşleme amaçları</h2>
<p>Paylaştığınız bilgiler yalnızca yazdığınız talep için kullanılır; üçüncü taraflarla paylaşılmaz, pazarlama amacıyla işlenmez.</p>
<h2>Haklarınız</h2>
<p>KVKK m.11 kapsamında kişisel verilerinizle ilgili bilgi alma, düzeltme, silme, aktarıma itiraz etme gibi haklarınızı <a href="mailto:merhaba@i-grup.com.tr">merhaba@i-grup.com.tr</a> adresine yazarak kullanabilirsiniz.</p>
<h2>Saklama süresi</h2>
<p>İletişim formu kayıtları en fazla 2 yıl saklanır; kariyer başvuruları başvurunun kapanmasından 6 ay sonra silinir.</p>
`.trim(),
    },
    {
      slug: "gizlilik-politikasi",
      title: "Gizlilik Politikası",
      subtitle: "Çerezler ve veri işleme politikaları.",
      content: `
<p>Bu gizlilik politikası i-Grup'un operasyonel ve pazarlama süreçlerinde kullandığı çerezleri, üçüncü taraf araçlarını ve kullanıcı verilerinin nasıl işlendiğini açıklar.</p>
<h2>Çerezler</h2>
<p>Sitede üç tür çerez kullanılır:</p>
<ul>
  <li><strong>Zorunlu çerezler:</strong> Temel işlevler için (oturum, güvenlik).</li>
  <li><strong>Analitik çerezler:</strong> Ziyaretçi sayısı ve davranışını anonim olarak ölçmek için.</li>
  <li><strong>Tercih çerezleri:</strong> Dil, görüntüleme seçenekleri.</li>
</ul>
<h2>Üçüncü taraf araçlar</h2>
<p>Google Analytics ile anonim trafik istatistikleri topluyoruz. Kullanıcı IP adresleri anonimleştirilir, kişisel veri saklanmaz.</p>
<h2>Veri güvenliği</h2>
<p>Tüm bağlantılar HTTPS üzerinden şifrelenir. Kullanıcı verileri şifrelenmiş veritabanlarında saklanır; yedeklemeler farklı bir bölgede tutulur.</p>
<h2>İletişim</h2>
<p>Gizlilik ile ilgili sorularınız için: <a href="mailto:merhaba@i-grup.com.tr">merhaba@i-grup.com.tr</a></p>
`.trim(),
    },
  ];
  for (const p of pages) {
    await prisma.page.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle,
        content: p.content,
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

  type P = {
    id: string;
    name: string;
    tag: string;
    sector: string;
    desc: string;
    status: string;
    year: number;
    hue: number;
    seoTitle: string;
    seoDescription: string;
  };

  const projects: P[] = [
    {
      id: "i-eczane",
      name: "i-Eczane",
      tag: "Pazaryeri",
      sector: "Eczane",
      desc: "Dermokozmetik eczane pazaryeri. Eczacılar ile markalar arasında doğrudan stok, sipariş ve iade akışı.",
      status: "Yayında",
      year: 2023,
      hue: 264,
      seoTitle: "i-Eczane — Eczane Dermokozmetik Pazaryeri",
      seoDescription:
        "Dermokozmetik eczane pazaryeri: eczacılar ve markalar arasında doğrudan stok, sipariş, iade ve kampanya akışı. Multi-vendor mimarisiyle Türkiye genelinde çalışan eczane tedarik yazılımı.",
    },
    {
      id: "i-depo",
      name: "i-Depo",
      tag: "B2B",
      sector: "Eczane",
      desc: "Kapalı B2B dermokozmetik pazaryeri. Distribütör–eczane arasında davetli tedarik ağı ve fiyat disiplini.",
      status: "Yayında",
      year: 2023,
      hue: 272,
      seoTitle: "i-Depo — Kapalı B2B Dermokozmetik Pazaryeri",
      seoDescription:
        "Dermokozmetik distribütörleri ile onaylı eczacılar arasında davetli tedarik ağı. Marka güvenliği, fiyat disiplini ve koli bazlı sipariş akışı tek platformda.",
    },
    {
      id: "i-kozmo",
      name: "i-Kozmo",
      tag: "Mobil",
      sector: "Kozmetik",
      desc: "Kozmetik ürünlerin INCI bileşenlerini fotoğraftan okuyan ve cilt tipine özel rutin öneren mobil uygulama.",
      status: "Yayında",
      year: 2024,
      hue: 296,
      seoTitle: "i-Kozmo — INCI Okuyucu Kozmetik Mobil Uygulaması",
      seoDescription:
        "Kozmetik ambalajlarının INCI listesini fotoğraftan okuyan mobil uygulama. Cilt tipine özel uyumluluk skoru, rutin takibi ve topluluk yorumları.",
    },
    {
      id: "istanbulvitamin",
      name: "İstanbulVitamin",
      tag: "E-ticaret",
      sector: "Kozmetik",
      desc: "Cilt tipine göre kürasyon yapan kişisel kozmetik e-ticaret ve abonelik sitesi.",
      status: "Yayında",
      year: 2022,
      hue: 310,
      seoTitle: "İstanbulVitamin — Cilt Tipine Göre Kişisel Kozmetik",
      seoDescription:
        "Cilt tipine göre kürasyon yapan kişisel kozmetik e-ticaret sitesi. Kısa profil sorularıyla size özel bir kozmetik kutusu hazırlanır; aylık abonelik veya tek seferlik satın alma.",
    },
    {
      id: "specialwhey",
      name: "SpecialWhey",
      tag: "E-ticaret",
      sector: "Kozmetik",
      desc: "Hedefe ve diyete göre formüle edilen kişiye özel protein mix ve aylık abonelik platformu.",
      status: "Yayında",
      year: 2024,
      hue: 320,
      seoTitle: "SpecialWhey — Kişiye Özel Protein Mix Aboneliği",
      seoDescription:
        "Spor hedefinize ve diyet tercihlerinize göre formüle edilen kişiye özel protein karışımı. Aylık abonelikle düzenli teslim, formül güncelleme ve Türkçe içerik etiketi.",
    },
    {
      id: "i-hesap",
      name: "i-Hesap",
      tag: "ERP",
      sector: "Kurumsal",
      desc: "KOBİ'ler için e-belge entegre, çoklu şirket destekli muhasebe ERP yazılımı.",
      status: "Yayında",
      year: 2021,
      hue: 252,
      seoTitle: "i-Hesap — KOBİ Muhasebe ERP Programı (e-Fatura Entegre)",
      seoDescription:
        "KOBİ ve orta ölçekli işletmeler için e-Fatura, e-Arşiv ve e-SMM entegre muhasebe ERP. Çoklu şirket, stok, cari, bordro ve finansal raporlama tek panelden.",
    },
    {
      id: "i-hirdavat",
      name: "i-Hırdavat",
      tag: "B2B",
      sector: "Hırdavat",
      desc: "Hırdavat sektörü için toptancı–bayi arası kalem bazlı sipariş ve cari yönetim platformu.",
      status: "Yayında",
      year: 2024,
      hue: 240,
      seoTitle: "i-Hırdavat — B2B Hırdavat Pazaryeri",
      seoDescription:
        "Hırdavatçılık sektörüne özel toptancı–bayi kapalı B2B pazaryeri. Kalem bazlı hızlı sipariş, bayi bazlı fiyat grupları, cari ve kampanya yönetimi.",
    },
    {
      id: "i-bijuteri",
      name: "i-Bijuteri",
      tag: "B2B",
      sector: "Aksesuar",
      desc: "Bijuteri üreticileri ile perakendeciler arasında koli bazlı B2B sipariş akışı.",
      status: "Yayında",
      year: 2024,
      hue: 304,
      seoTitle: "i-Bijuteri — B2B Bijuteri ve Aksesuar Pazaryeri",
      seoDescription:
        "Bijuteri üreticisi ve ithalatçısı ile butik perakendeciler arasında koli bazlı B2B sipariş akışı. Yüksek çözünürlüklü koleksiyon sunumu ve sezon yönetimi.",
    },
    {
      id: "i-kirtasiye",
      name: "i-Kırtasiye",
      tag: "B2B",
      sector: "Kırtasiye",
      desc: "Okul ve ofis tedarik kanalı için B2B kırtasiye pazaryeri; liste ve kampanya bazlı sipariş.",
      status: "Yayında",
      year: 2024,
      hue: 228,
      seoTitle: "i-Kırtasiye — B2B Kırtasiye Tedarik Pazaryeri",
      seoDescription:
        "Okul ve ofis tedarik kanalına özel B2B kırtasiye pazaryeri. Okul listesi import, sezon kampanyası, grup sipariş ve toptancı–perakendeci cari yönetimi.",
    },
    {
      id: "i-nalbur",
      name: "i-Nalbur",
      tag: "B2B",
      sector: "Yapı",
      desc: "Yapı ve nalbur ihtiyaçlarında bölgesel B2B tedarik platformu (beta).",
      status: "Beta",
      year: 2025,
      hue: 216,
      seoTitle: "i-Nalbur — Bölgesel B2B Yapı Nalbur Pazaryeri (Beta)",
      seoDescription:
        "Yapı–hırdavat ihtiyaçlarında bölgesel tedarik süreçlerini dijitalleştiren B2B nalbur pazaryeri. Konum bazlı stok eşleştirme ve proje bazlı liste siparişi. Özel beta sürümünde.",
    },
    {
      id: "i-zeruj",
      name: "i-Zeruj",
      tag: "B2B",
      sector: "Gıda",
      desc: "Hal ile restoran arasında günlük zerzevat sipariş akışı (beta).",
      status: "Beta",
      year: 2025,
      hue: 148,
      seoTitle: "i-Zeruj — Hal & Restoran B2B Zerzevat Sipariş (Beta)",
      seoDescription:
        "Hal esnafı ile restoranlar arasında günlük zerzevat siparişini dijitalleştiren B2B platformu. Gerçek zamanlı fiyat tablosu, gece sipariş alımı ve vadeli satış.",
    },
    {
      id: "memnuniyetimvar",
      name: "MemnuniyetimVar",
      tag: "Platform",
      sector: "Tüketici",
      desc: "Şikayet platformlarının aksine pozitif müşteri deneyimine odaklı tüketici platformu (yakında).",
      status: "Yakında",
      year: 2026,
      hue: 288,
      seoTitle: "MemnuniyetimVar — Pozitif Müşteri Geri Bildirim Platformu",
      seoDescription:
        "Şikayet odaklı platformların aksine olumlu müşteri deneyimini markalara ulaştıran platform. Memnuniyet bildirimi, marka paneli ve çalışan tanıma rozetleri.",
    },
    {
      id: "i-kira",
      name: "i-Kira",
      tag: "Uygulama",
      sector: "Emlak",
      desc: "Kiracı ve ev sahibi arasındaki sözleşme, ödeme ve demirbaş akışını dijitalleştiren uygulama (yakında).",
      status: "Yakında",
      year: 2026,
      hue: 200,
      seoTitle: "i-Kira — Kiracı & Ev Sahibi Anlaşma Uygulaması",
      seoDescription:
        "Kiracı ve ev sahibi arasındaki dijital kira sözleşmesi, aylık ödeme takibi, fotoğraflı demirbaş listesi ve çıkış prosedürü. Yakında özel beta erişimiyle yayında.",
    },
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
        content:
          PROJECT_CONTENT[p.id] ??
          `<p>${p.desc}</p><p>Ürün içerikleri admin panelinden düzenlenebilir.</p>`,
        coverImage: PROJECT_IMG[p.id],
        liveUrl: null,
        year: p.year,
        isFeatured: i % 5 === 0,
        order: i,
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
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
      title: "Kendi ürünlerimiz",
      description:
        "Başkasına proje yapmıyoruz. 13 ürünün tamamı kendi fikrimiz, kendi sermayemiz ve riskimiz altında yayında.",
    },
    {
      eyebrow: "Yaklaşım",
      title: "Doğrudan kullanıcıyla",
      description:
        "Aracı yok; eczacıyla sahada, markayla rafta, tüketiciyle uygulamada geri bildirim ilk elden bizde.",
    },
    {
      eyebrow: "Altyapı",
      title: "Paylaşımlı modüller",
      description:
        "Kimlik, ödeme, bildirim ve cari altyapısı ortak. Bir üründe yazdığımızı diğer ürünlerde yeniden kullanıyoruz.",
    },
    {
      eyebrow: "Süreklilik",
      title: "Lansman başlangıç, sürdürme asıl iş",
      description:
        "Yıllarca aktif kalacak ürünler hedefliyoruz; hızlı çıkış değil, sürdürülebilir ilerleme.",
    },
    {
      eyebrow: "Yapı",
      title: "İki ortak, hızlı karar",
      description:
        "Ürün yönetimi ve mühendislik aynı iki kişide. Karar süreçleri kısa, iterasyon hızlı, bürokrasi yok.",
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
        "Kiracı ve ev sahipleri için dijital kira sözleşmesi, aylık ödeme ve demirbaş takibi — ilk 500 kullanıcıya özel beta erişimi.",
      date: "2026-04-12",
      cover: IMG.newsProduct,
      seoTitle:
        "i-Kira özel beta erişimi başladı — Dijital kira sözleşmesi ve ödeme takibi",
      seoDescription:
        "Kira sürecini dijitalleştiren i-Kira uygulaması özel beta erişimine açıldı. Dijital sözleşme, otomatik aylık tahsilat ve fotoğraflı demirbaş takibi.",
    },
    {
      slug: "dermokozmetikte-kapali-pazaryeri",
      tag: "Sektör",
      title: "Dermokozmetikte kapalı pazaryeri neden önemli?",
      excerpt:
        "i-Depo deneyiminden hareketle: davetli tedarik ağı, marka güvenliği, fiyat disiplini ve yetkisiz satıcı sorunu üzerine bir yazı.",
      date: "2026-04-04",
      cover: IMG.newsSector,
      seoTitle:
        "Dermokozmetikte kapalı pazaryeri neden önemli? — Marka güvenliği ve fiyat disiplini",
      seoDescription:
        "Dermokozmetik sektöründe fiyat erozyonu ve yetkisiz satış kanallarına kapalı B2B pazaryeri nasıl çözüm üretiyor? i-Depo deneyiminden saha notları.",
    },
    {
      slug: "ekipce-calisma-ritmimiz",
      tag: "Kültür",
      title: "İki kişi 13 ürünü nasıl yönetiyor? — 4+1 hafta ritmi",
      excerpt:
        "Disiplinli haftalık ritim ve paylaşımlı altyapı sayesinde iki ortağın 13 aktif ürünü sürdürülebilir biçimde yönetmesini anlatıyoruz.",
      date: "2026-03-21",
      cover: IMG.newsCulture,
      seoTitle:
        "İki kişi 13 ürünü nasıl yönetiyor? — 4+1 hafta çalışma ritmi",
      seoDescription:
        "İki ortaklı bir yapıda 13 aktif ürünü yönetmek için uyguladığımız 4 hafta geliştirme + 1 hafta bakım ritmi ve paylaşımlı altyapı yaklaşımı.",
    },
    {
      slug: "i-kozmo-inci-2",
      tag: "Ürün",
      title: "i-Kozmo için INCI 2.0 yayında",
      excerpt:
        "Kozmetik ambalajlarının bileşen listesini fotoğraftan okuyan yeni motor; cilt tipi uyumluluğunu %37 daha doğru hesaplıyor.",
      date: "2026-03-02",
      cover: IMG.newsInci,
      seoTitle: "i-Kozmo için INCI 2.0 yayında — Cilt tipi uyumluluğu %97'ye çıktı",
      seoDescription:
        "i-Kozmo'nun INCI bileşen okuyucu motorunu yeniledik: geliştirilmiş OCR, cilt tipi eşleştirme ve 12.000+ ürün veritabanı ile %97 uyum doğruluğu.",
    },
  ];

  for (const p of posts) {
    await prisma.post.create({
      data: {
        slug: p.slug,
        tag: p.tag,
        title: p.title,
        excerpt: p.excerpt,
        content:
          POST_CONTENT[p.slug] ??
          `<p>${p.excerpt}</p><p>Yazı içeriği admin panelinden düzenlenebilir.</p>`,
        coverImage: p.cover,
        publishedAt: new Date(p.date),
        isPublished: true,
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
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
  // 2-ortaklı yapı sabit kadro büyütmüyor. İlanlar şu an boş;
  // admin'den istenildiğinde eklenebilir. Ana sayfadaki Kariyer bölümü
  // empty-state metniyle ("Sabit pozisyon aramıyoruz...") görünür.
  await prisma.career.deleteMany();
  console.log("✓ Careers (0 — boş; ihtiyaç halinde admin'den eklenir)");
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
