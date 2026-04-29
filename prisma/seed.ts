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
  "eczane-pazaryeri-yazilimi-rehberi": `
<p>Türkiye'de dermokozmetik ürün satan eczacıların yüzlerce markayla çalışması, her birinin farklı stok, iade, kampanya ve iskonto süreçlerine sahip olması sektörün en büyük operasyonel yüklerinden biri. Bu yazıda <strong>eczane pazaryeri yazılımı</strong> nedir, hangi sorunları çözer ve doğru çözümü seçerken nelere dikkat edilmelidir; i-Eczane deneyiminden hareketle detaylı olarak anlatıyoruz.</p>

<h2>Eczane pazaryeri yazılımı nedir?</h2>
<p><strong>Eczane pazaryeri yazılımı</strong>; eczacıların dermokozmetik, takviye edici gıda ve kişisel bakım ürünlerini tek bir dijital platformdan sipariş etmesini, markaların ürünlerini doğrudan eczacılarla buluşturmasını ve distribütörlerin tedarik ağını şeffaf yönetmesini sağlayan <em>çok satıcılı (multi-vendor)</em> dijital altyapıdır. Geleneksel e-ticaret sitelerinden farklı olarak;</p>
<ul>
  <li>Eczacıya özel <strong>KDV ve iskonto yapıları</strong> desteklenir.</li>
  <li>Dermokozmetik ürünler için <strong>cilt tipi, endikasyon, INCI bileşenleri</strong> gibi sektörel filtreler yerleşiktir.</li>
  <li>Marka ve distribütör kendi mağazasını, fiyat politikasını ve kampanyalarını bağımsız yönetir.</li>
  <li>İade süreçleri <strong>barkod doğrulamalı</strong>, mutabakat otomatikleştirilmiştir.</li>
</ul>

<h2>Eczacının günlük operasyonundaki sorunlar</h2>
<p>Saha verilerinden bildiğimiz üzere bağımsız bir eczane günde 30 ila 70 dermokozmetik siparişi yönetir. Her siparişin arkasında;</p>
<ul>
  <li>Marka ile telefon veya WhatsApp trafiği,</li>
  <li>Farklı iskonto oranları için kafada tutulan bilgi,</li>
  <li>Teslim geciktiğinde tedarikçi–distribütör arasındaki takip,</li>
  <li>İade sürecinde belge yığını,</li>
</ul>
<p>yer alır. i-Eczane gibi bir <strong>dermokozmetik pazaryeri yazılımı</strong>, bu dağınık iletişimi tek bir panelde toplar; sipariş, iade, iskonto, kampanya ve cari hesap aynı ekranda görünür hale gelir.</p>

<h2>Marka tarafında ne değişir?</h2>
<p>Dermokozmetik markası için pazaryeri sadece "bir satış kanalı daha" değildir — aynı zamanda <strong>doğrudan eczacı erişimi</strong> demektir. Pazaryeri yazılımı markaya şunları sağlar:</p>
<ul>
  <li><strong>Kendi mağazası, kendi stoku:</strong> Marka kataloğu doğrudan kendi envanterine bağlanır.</li>
  <li><strong>Kampanya merkezi:</strong> Sezon indirimleri, kombo ürünler ve eczacıya özel kampanyalar merkezi panelden yönetilir.</li>
  <li><strong>Sipariş verisi:</strong> Hangi bölgede, hangi ürünün, hangi eczacı tarafından ne kadar satıldığı anında görünür.</li>
  <li><strong>Fiyat disiplini:</strong> MSRP ihlali yapan kanallara karşı görünürlük.</li>
</ul>

<h2>Distribütör için şeffaflık</h2>
<p>Dermokozmetik distribütörü için en kritik kaygı fiyat erozyonudur. Aynı ürünün farklı kanallarda farklı fiyatlarla görünmesi hem eczacı güvenini sarsar hem de markaya zarar verir. Doğru kurgulanmış bir eczane pazaryeri yazılımı distribütörün tedarik ağını <strong>davetli model</strong> ile kontrol altında tutmasına izin verir — bu konuyu i-Depo yazımızda derinlemesine ele aldık.</p>

<h2>Doğru yazılımı seçerken nelere dikkat edilmeli?</h2>

<h3>Sektöre özel tasarım</h3>
<p>Genel e-ticaret motorları dermokozmetik dikeyine uyarlanamaz. Eczacı iskontoları, İTS/ETS entegrasyonu, INCI filtreleme ve eczaneye özel KDV gibi özellikler yazılımın çekirdeğinde olmalı, bir eklenti olarak değil.</p>

<h3>Çok satıcılı mimari</h3>
<p>Pazaryeri tek bir marka değil, onlarca markanın aynı anda yönettiği bir platformdur. Satıcı bağımsızlığı, yetkilendirme ve ürün onay akışı güçlü olmalıdır.</p>

<h3>Ölçeklenebilir altyapı</h3>
<p>Sezon başı kampanyaları, Black Friday trafiği ve bölgesel stok yoğunluğu durumunda yazılımın sorun yaşamayacağı bir altyapıda koşması şart. Dermokozmetik pazaryerleri anlık <strong>eş zamanlı kullanıcı sayısını</strong> hafife alamaz.</p>

<h3>Mutabakat ve muhasebe entegrasyonu</h3>
<p>Eczacı ay sonunda binlerce satırlık cari hesap ekstresiyle muhatap olmak istemez. Otomatik mutabakat, dekont eşleme ve e-Fatura entegrasyonu vazgeçilmez.</p>

<h2>i-Eczane yaklaşımı</h2>
<p>i-Eczane'de yukarıdaki gereksinimlerin tümü ürünün çekirdek modüllerinde yer alıyor. Çok satıcılı mimari, dermokozmetik odaklı filtreler, eczacıya özel iskonto motoru, barkod doğrulamalı iade akışı ve otomatik mutabakat modülü standart olarak geliyor. Platformu hayata geçirmek isteyen marka ve distribütörler için demo talep edebilir, entegrasyon için iletişim sayfasından bize ulaşabilirsiniz.</p>
`.trim(),

  "dermokozmetikte-kapali-pazaryeri": `
<p>Dermokozmetik sektörü Türkiye'de son beş yılda iki haneli büyüme gördü. Ancak büyümeyle birlikte <strong>fiyat erozyonu, yetkisiz satış kanalları ve marka değer kaybı</strong> gibi sektörün temellerini sarsan sorunlar gündeme geldi. Bu yazıda i-Depo ile kurguladığımız <strong>kapalı B2B dermokozmetik tedarik ağı</strong> modelinin bu sorunlara verdiği yanıtı, teknik yaklaşımı ve sektörün kapalı pazaryerinden nasıl yararlandığını detaylı şekilde paylaşıyoruz.</p>

<h2>Açık pazaryerlerinin dermokozmetikte yarattığı sorunlar</h2>
<p>Açık platformlar — genel pazaryerleri veya sınırsız satıcıya açık e-ticaret siteleri — dermokozmetik gibi dikey ve düzenlemelere tabi ürün gruplarında ciddi riskler üretir:</p>
<ul>
  <li><strong>Fiyat yıpranması:</strong> Aynı ürün farklı satıcılarda farklı fiyatla görünür, marka MSRP politikası aşınır.</li>
  <li><strong>Yetkisiz satıcı:</strong> Distribütör ağının dışından gelen ürünler iade ve garanti süreçlerini zorlaştırır, müşteri güveni zayıflar.</li>
  <li><strong>Paralel ithalat:</strong> Markanın onaylamadığı kanallardan gelen ürünler marka konumlandırmasını bozar.</li>
  <li><strong>Veri görünürlüğü yokluğu:</strong> Marka, son tüketiciye hangi kanaldan ulaştığını göremez.</li>
</ul>
<p>Tüm bu sorunların ortak paydası; dermokozmetik ürününün "herkesin satabileceği" bir ürün gibi değil, <em>onaylı bir tedarik kanalından akması gereken</em> bir ürün olarak konumlandırılması gerektiğidir.</p>

<h2>Kapalı pazaryeri nedir?</h2>
<p>Kapalı B2B pazaryeri; yalnızca <strong>davetli ve onaylı kullanıcıların</strong> erişebildiği, sipariş verebildiği ve alışveriş yapabildiği dijital tedarik platformudur. Açık pazaryerinden temel farkları:</p>
<ul>
  <li>Dışarıdan kimse katalog ve fiyatları göremez.</li>
  <li>Her distribütör kendi eczacı ağını yönetir; tedarik ilişkisi birebir kurulur.</li>
  <li>Fiyat grupları merkezi olarak tanımlanır; eczacı sınıfı, cari durumu ve bölgesine göre otomatik fiyatlama çalışır.</li>
  <li>Kampanyalar ağ içindeki belirli eczacı gruplarına özel yayınlanabilir.</li>
</ul>

<h2>i-Depo'nun teknik yaklaşımı</h2>
<p>i-Depo, dermokozmetik distribütörleri için tasarlanmış kapalı B2B pazaryeri yazılımıdır. Mimarinin özü <strong>distribütör–eczacı ilişkisinin birebir modellenmesi</strong> üzerine kuruludur:</p>

<h3>Davetli tedarik ağı</h3>
<p>Her distribütör kendi eczacı portföyünü panelden yönetir; davet eder, onaylar, askıya alır. Eczacı yalnızca bağlı olduğu distribütörün katalog ve fiyatlarını görür. Bir eczane birden fazla distribütöre bağlı olabilir; her bağlantı için ayrı fiyat grubu çalışır.</p>

<h3>Fiyat grupları ve iskonto motoru</h3>
<p>Dermokozmetikte fiyatlama çok katmanlıdır: liste fiyatı, eczacı iskontosu, hacim iskontosu, kampanya iskontosu, sezonluk indirim. i-Depo'nun fiyat motoru tüm bu katmanları kural bazlı çalıştırır; sipariş anında nihai fiyat şeffaf şekilde hesaplanır.</p>

<h3>Koli ve kalem bazlı sipariş</h3>
<p>Dermokozmetik distribütörleri çoğunlukla koli bazlı çalışır; ancak bazı eczacılar birim bazlı sipariş vermek ister. i-Depo her iki modu da destekler; distribütör bunu ürün bazlı tanımlayabilir.</p>

<h3>Cari hesap ve mutabakat</h3>
<p>Vadeli satış dermokozmetikte standart. Sistem otomatik olarak cari bakiye, vade takibi, dekont eşleme ve e-Fatura akışını yönetir. Eczacının ay sonu mutabakat yükü büyük ölçüde ortadan kalkar.</p>

<h3>Kampanya yönetimi</h3>
<p>Distribütör bir kampanyayı belirli eczacı gruplarına, belirli bölgelere veya belirli ürün kategorilerine özel olarak yayınlayabilir. Kampanya analitiği panelden takip edilir.</p>

<h2>Kapalı pazaryerinin markaya sağladığı faydalar</h2>
<ul>
  <li><strong>Fiyat disiplini:</strong> MSRP ihlali yapan satıcı ortadan kalkar; marka değeri korunur.</li>
  <li><strong>Tedarik zinciri şeffaflığı:</strong> Ürünün hangi eczacıya gittiği uçtan uca izlenebilir.</li>
  <li><strong>Eczacı ilişkisi güçlenir:</strong> Onaylı ağın içinde olan eczacılar için sipariş deneyimi modernleşir.</li>
  <li><strong>Veri odaklı karar:</strong> Hangi bölgede, hangi ürünün, hangi eczacı tarafından ne zaman sipariş edildiği ölçülebilir.</li>
</ul>

<h2>Hangi sektörler kapalı pazaryerinden yararlanır?</h2>
<p>Kapalı pazaryeri modeli dermokozmetik dışında da çalışır ancak özellikle <strong>düzenlemelere tabi, marka hassasiyeti yüksek ve fiyat politikası kritik</strong> sektörlerde yüksek değer üretir: OTC ve reçetesiz ilaç, medikal cihaz, tıbbi beslenme, profesyonel saç–cilt bakım ürünleri ve veteriner ürünleri. Bu sektörlerin hepsinde i-Depo mimarisi uyarlanabilir durumda.</p>

<h2>Özet</h2>
<p>Dermokozmetik distribütörü için kapalı B2B pazaryeri artık lüks değil, sektörel zorunluluktur. Fiyat politikasını koruyamayan, yetkisiz satıcıyı engelleyemeyen ve eczacı ağını şeffaf yönetemeyen bir distribütör uzun vadede marka ilişkisini de eczacı güvenini de kaybeder. i-Depo bu üç konuda da saha-test edilmiş, üretimde çalışan bir çözüm sunar. Demo talebi için iletişim sayfamızdan bize ulaşabilirsiniz.</p>
`.trim(),

  "inci-okuyucu-mobil-uygulama": `
<p>Kozmetik ürün ambalajlarının arkasındaki küçük punto INCI listesi, tüketicinin ürünün içeriğini anlaması için en kritik bilgidir — ama aynı zamanda çözülmesi en zor bilgi. Bu yazıda <strong>INCI okuyucu mobil uygulama</strong> nedir, cilt tipi uyumluluk nasıl hesaplanır, neden dermokozmetik dikeyi için kritik bir ürün kategorisidir ve i-Kozmo ile bu alanda nasıl bir çözüm ürettiğimizi detaylı paylaşıyoruz.</p>

<h2>INCI nedir?</h2>
<p><strong>INCI (International Nomenclature of Cosmetic Ingredients)</strong>, kozmetik ve kişisel bakım ürünlerindeki bileşenlerin uluslararası standart isimlendirmesidir. Dünyada satılan her kozmetik ürünün ambalajında aynı standartla yazılmış bir INCI listesi bulunur. Ancak kullanıcı için problem:</p>
<ul>
  <li>Bileşen isimleri Latince ve kimya terimi,</li>
  <li>50+ bileşen bir ürünün arkasında sıralı,</li>
  <li>Hangi bileşen hangi işleve sahip belirsiz,</li>
  <li>Hangi bileşen hangi cilt tipi için riskli bilinmez.</li>
</ul>
<p>Bu boşluğu dolduran ürün kategorisi <strong>INCI okuyucu mobil uygulamalarıdır</strong>. i-Kozmo bu kategoride Türkçe içerik, yerel kozmetik ürün veritabanı ve cilt tipine özel öneri üzerine kurulu bir çözümdür.</p>

<h2>INCI okuyucu uygulamasının teknik mimarisi</h2>

<h3>OCR — Etiket okuma</h3>
<p>Kullanıcı ürünün arka yüzünün fotoğrafını çeker; uygulama ambalajdaki INCI metnini optik karakter tanıma (OCR) ile çıkarır. Burada iki büyük teknik zorluk vardır:</p>
<ul>
  <li><strong>Yansıma ve parıldama:</strong> Parlak kozmetik ambalajları flaş yansımasıyla okumayı zorlaştırır.</li>
  <li><strong>Kıvrımlı yüzey:</strong> Tüp ürünlerde metin kıvrılmış olarak görünür, karakter tanıma güçleşir.</li>
</ul>
<p>i-Kozmo'da <strong>INCI 2.0 motoru</strong> bu iki problem için özel olarak eğitilmiş bir model kullanır; yansıma ve kıvrım etkilerini tolere eder.</p>

<h3>Bileşen veritabanı</h3>
<p>Çıkarılan INCI listesi, kurumsal bileşen veritabanıyla karşılaştırılır. Veritabanı her bileşen için:</p>
<ul>
  <li>İşlevi (emollient, surfactant, antioxidant, vb.),</li>
  <li>Cilt tipi etkileri (kuru, yağlı, hassas),</li>
  <li>Bilinen alerjen/irritan risk seviyesi,</li>
  <li>Doğal / sentetik kaynağı,</li>
  <li>Hamilelik ve bebek kullanımına uygunluk,</li>
</ul>
<p>gibi çok boyutlu etiketler tutar.</p>

<h3>Cilt tipi eşleştirme modeli</h3>
<p>Kullanıcı ilk girişte cilt tipi, hassasiyetler, endişeler (akne, kızarıklık, kuruluk, yaşlanma karşıtı vb.) ve tercihleri (vegan, parfümsüz, hayvan deneyi karşıtı) ile profilini oluşturur. i-Kozmo motor bu profili her ürünün INCI değerlendirmesiyle karşılaştırır ve 0–100 arası bir <strong>uyum skoru</strong> üretir.</p>

<h3>Alternatif ürün önerisi</h3>
<p>Bir ürün kullanıcı profiline uygun değilse, uygulama aynı kategoride daha yüksek skorlu alternatifleri listeler. Bu özellik tüketiciyi <em>ürünü geri koymakla almak</em> arasında değil, <em>doğru ürüne yönlendirmek</em> konumuna taşır.</p>

<h2>INCI okuyucunun dermokozmetik dikeyindeki rolü</h2>
<p>Kozmetik markaları için şeffaflık artık opsiyonel değil. Tüketici bir ürünü satın almadan önce bileşenlerini öğrenmek istiyor; özellikle dermokozmetik segmentinde marka sadakati daha bilinçli bir tabanda şekilleniyor. INCI okuyucu uygulamaları bu dönüşümde <strong>tarafsız bir değerlendirme kaynağı</strong> olarak öne çıkıyor.</p>
<p>Dermokozmetik markaları açısından bu bir tehdit değil, aksine bir fırsat. Ürünün formülünden emin olan marka için INCI okuyucudaki yüksek uyum skoru güçlü bir pazarlama argümanı haline geliyor.</p>

<h2>i-Kozmo'daki ek özellikler</h2>
<ul>
  <li><strong>Rutin takibi:</strong> Sabah ve akşam bakım rutinlerinin yapılandırılması, hatırlatıcılar.</li>
  <li><strong>Karşılaştırma:</strong> İki farklı ürünün INCI farklarını yan yana görebilme.</li>
  <li><strong>Topluluk yorumları:</strong> Aynı cilt tipine sahip kullanıcıların ürün deneyimleri.</li>
  <li><strong>Veri gizliliği:</strong> Çekilen fotoğraflar cihazda işlenir, sunucuya yalnızca metin gönderilir.</li>
</ul>

<h2>Markalar için i-Kozmo entegrasyonu</h2>
<p>Dermokozmetik markaları ürünlerini i-Kozmo veritabanına eklemek, ürün sayfalarını zenginleştirmek ve cilt tipine özel pazarlama kampanyaları yürütmek için bizimle iletişime geçebilir. Şeffaflık ve cilt tipi uyumluluğu, markanıza bilinçli tüketici segmentinde güçlü bir konumlandırma sunar.</p>
`.trim(),

  "kisisel-kozmetik-abonelik-modeli": `
<p>Kozmetik alışverişinde tüketicinin karşılaştığı en büyük sorun ürün çeşitliliği değil — <strong>kendisine hangi ürünün uygun olduğunu bilmemesidir</strong>. Cilt tipi, hassasiyetler, mevsim, yaş, genetik özellikler ve öncelikler her tüketici için farklı; bu yüzden aynı raftaki ürünler aynı cilde aynı sonucu vermez. Bu yazıda <strong>kişisel kozmetik abonelik modeli</strong> nedir, kürasyon motoru nasıl çalışır, dermokozmetik dikeyinde bu modeli neden önemsediğimizi ve İstanbulVitamin deneyimini paylaşıyoruz.</p>

<h2>Kozmetik alışverişinde karar yorgunluğu</h2>
<p>Bir tüketici cilt bakım ürünü ararken ortalama 40+ markayı, her markanın 10+ ürününü incelemek durumunda. Online yorumlar çelişkili, reklamlar abartılı, dermatolog önerileri farklı. Sonuç: <strong>karar yorgunluğu</strong>. Kullanıcı ya rastgele bir ürün satın alır ya da alışverişi erteler.</p>
<p>Kişisel kürasyon modeli bu sorunun üstüne oturur: tüketici yerine karar veren bir <em>akıllı küratör</em> devreye girer.</p>

<h2>Kürasyon motoru nasıl çalışır?</h2>

<h3>1. Profil oluşturma</h3>
<p>Kullanıcı ilk girişte kısa bir form doldurur. Tipik sorular:</p>
<ul>
  <li>Cilt tipi (kuru, yağlı, karma, hassas, normal)</li>
  <li>Endişeler (akne, kızarıklık, pigmentasyon, yaşlanma belirtileri, kuruluk)</li>
  <li>Alerjiler ve hassasiyetler</li>
  <li>Rutininin olgunluğu (başlangıç, orta, ileri)</li>
  <li>Tercihler (vegan, parfümsüz, kokusuz, fiyat aralığı)</li>
  <li>Mevcut ürünler</li>
</ul>

<h3>2. Ürün eşleştirme</h3>
<p>Kürasyon motoru profili katalogdaki her ürünün etiketleriyle eşleştirir. İstanbulVitamin'de her ürün; cilt tipi, bileşen listesi, endikasyon, rutin aşaması (temizleyici, tonik, serum, nemlendirici, güneş koruyucu) ve deneyim seviyesi etiketleriyle tanımlıdır. Eşleşme skoru kullanıcıya kutu içinde 4–6 ürün olarak dönüşür.</p>

<h3>3. Kutu hazırlama ve gönderim</h3>
<p>Kullanıcıya özel hazırlanan kutu aylık olarak sevk edilir. İlk kutuyu aldıktan sonra geri bildirim formu sunulur: beğenildi / beğenilmedi / alerji oldu / tekrar gelsin. Bu geri bildirim bir sonraki kutunun kürasyonunu iyileştirir — motor öğrenir.</p>

<h3>4. Profil güncellemesi</h3>
<p>Cilt tipi sabit değildir; mevsim, yaş, hormonal değişim, iklim gibi faktörlerle değişir. Kullanıcı istediğinde profilini güncelleyebilir; bir sonraki kutu yeni profile göre hazırlanır.</p>

<h2>Abonelik modelinin kozmetik için avantajları</h2>
<ul>
  <li><strong>Karar yorgunluğundan kurtulma:</strong> Kullanıcı artık hangi ürünü seçeceğini düşünmez.</li>
  <li><strong>Düzenli rutin:</strong> Aylık kutu, cilt bakım rutininin sürdürülebilir olmasını sağlar.</li>
  <li><strong>Markaya ulaşmakta zorlanan ürünlerin keşfi:</strong> Niş markalar kürasyon modelinde öne çıkabilir.</li>
  <li><strong>Bilinçli iade:</strong> Beğenilmeyen ürünler bir sonraki kutuda değiştirilir; kürasyon sürekli iyileşir.</li>
</ul>

<h2>Markalar için kürasyon kanalı</h2>
<p>Kişisel kozmetik abonelik platformları, markalar için <strong>akıllı bir dağıtım kanalı</strong> oluşturur. Açık pazaryerlerinden farklı olarak burada ürün doğru kullanıcıya gider; yanlış eşleşmeden doğan iade ve olumsuz yorum oranı çok düşüktür. Dermokozmetik markaları için bu:</p>
<ul>
  <li>Doğru tüketici segmentine ulaşma,</li>
  <li>Düşük iade oranıyla lojistik verimliliği,</li>
  <li>Denenmemiş ürünü test etme fırsatı,</li>
</ul>
<p>anlamına gelir.</p>

<h2>İstanbulVitamin yaklaşımı</h2>
<p>İstanbulVitamin, Türkiye'de dermokozmetik ve kişisel bakım segmentinde kürasyon motoruyla çalışan kozmetik abonelik platformudur. Kullanıcı profili, ürün etiketleme, eşleşme skoru ve kutu oluşturma süreçleri baştan sektörel ihtiyaçlara göre tasarlandı. Markalar ile birlikte çalışıyor; kataloğumuza ürün eklemek isteyen dermokozmetik markaları için iletişim kanallarımız açık.</p>

<h2>Gelecek</h2>
<p>Kişiselleştirme sadece cilt tipiyle sınırlı değil. İleride iklim, hava kalitesi, stres düzeyi ve uyku verisi gibi sinyaller de kürasyon motoruna girebilir. Kozmetikte kişiselleştirme geldiği noktanın çok daha ilerisine gidecek; i-Grup olarak bu gelişimi hem İstanbulVitamin hem i-Kozmo ürünlerimizle destekliyoruz.</p>
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
      "Farklı sektörlerde faaliyet gösteren dijital markaları ve platformları çatısı altında buluşturan şirketler topluluğu.",
    email: "merhaba@i-grup.com.tr",
    phone: "+90 212 000 00 00",
    whatsapp: "+905000000000",
    address: "İstanbul",
    linkedinUrl: "https://www.linkedin.com/company/i-Grup",
    instagramUrl: "https://www.instagram.com/i-Grup",
    xUrl: "https://x.com/igroup",
    footerText:
      "Farklı sektörlerde faaliyet gösteren dijital markaları aynı çatı altında buluşturan şirketler topluluğu.",
    defaultSeoTitle:
      "i-Grup — Şirketler Topluluğu | Dijital Markalar ve Platformlar",
    defaultSeoDesc:
      "i-Grup Şirketler Topluluğu çatısı altında faaliyet gösteren eczane pazaryeri, B2B tedarik platformları, kozmetik ve kişisel bakım markaları, finansal çözümler ve tüketici platformları.",
    statProjects: 13,
    statSectors: 6,
    statYears: 8,
    statEndUsers: "120K",
    teamSize: 2,
    foundedYear: 2018,
    heroHeading:
      "i-Grup Şirketler Topluluğu markaları aynı çatı altında buluşturur.",
    heroHighlight: "markaları",
    heroSubtitle:
      "i-Grup; eczane pazaryeri, B2B tedarik platformları, kozmetik ve kişisel bakım markaları, finansal çözümler ve tüketici platformlarından oluşan marka portföyünü aynı çatı altında buluşturur.",
    heroStatusText: "Şirketler topluluğu · 2018'den beri",
    heroImageUrl: IMG.heroOffice,
    heroCtaPrimaryLabel: "Tüm Markalar",
    heroCtaPrimaryUrl: "#markalar",
    heroCtaSecondaryLabel: "İletişime Geçin",
    heroCtaSecondaryUrl: "/iletisim",
    heroOverlayLabel: "PORTFÖY",
    heroOverlayTitle: "Farklı sektörlerde dijital markalar",
    heroOverlayDescription:
      "Her marka kendi alanında uzmanlaşır; i-Grup ortak büyüme çatısını sağlar.",
    aboutHeading: "Farklı sektörlerde büyüyen markaları aynı çatı altında buluşturan grup.",
    aboutLead:
      "i-Grup, her biri kendi alanında uzmanlaşan dijital markaları stratejik, operasyonel ve dijital büyüme disipliniyle destekleyen bir şirketler topluluğudur.",
    aboutImage1: IMG.aboutOffice,
    aboutImage2: IMG.aboutTeam,
    aboutImage3: IMG.officeFloor,
    careersHeading: "i-Grup Şirketler Topluluğu ekibine katılın.",
    careersLead:
      "Farklı sektörlerde faaliyet gösteren markalarımızın ürün, operasyon, büyüme ve teknoloji ekiplerinde birlikte çalışmak için portföyünüzü bekliyoruz.",
    careersImage: IMG.careersOffice,
    careersEmptyTitle: "Şu an aktif ilan yok",
    careersEmptyText:
      "Markalarımızla ilgili freelance, proje bazlı veya tam zamanlı iş birlikleri için portföyünüzü gönderebilirsiniz; değerlendirmek için hepsini inceliyoruz.",
    careersApplyLabel: "Portföy Gönder →",
    contactHeading: "i-Grup Şirketler Topluluğu hakkında konuşalım.",
    contactHighlight: "markaları",
    contactLead:
      "Markalarımız, grup yapımız, iş birlikleri veya iletişim talepleriniz için formu doldurun. 48 saat içinde geri dönüyoruz.",
    officeHours: "Pazartesi – Cuma · 09:30 – 18:30",
    projectsEyebrow: "Markalarımız",
    projectsTitle: "i-Grup Şirketler Topluluğu markaları.",
    projectsLead:
      "Eczane pazaryerinden B2B tedarik platformlarına, kozmetik ve kişisel bakım markalarından tüketici uygulamalarına kadar farklı alanlarda faaliyet gösteren dijital markalarımız.",
    sectorsEyebrow: "Sektörler",
    sectorsTitle: "i-Grup Şirketler Topluluğu faaliyet alanları.",
    sectorsLead:
      "Her marka kendi sektöründe uzmanlaşır; i-Grup Şirketler Topluluğu bu markaların ortak deneyimini ve büyüme disipliniyle bir araya getirir.",
    clientsEyebrow: "Birlikte çalıştıklarımız",
    clientsTitle: "Dermokozmetik markaları ve tedarikçileri.",
    clientsLead:
      "i-Eczane ve i-Depo platformları üzerinden dermokozmetik dağıtımı yapan distribütörler, kozmetik markaları, zincir eczaneler ve bölgesel tedarikçiler.",
    blogEyebrow: "Günlük",
    blogTitle: "Dermokozmetik sektöründen ürün ve teknoloji notları.",
    blogLead:
      "Kapalı B2B pazaryeri modeli, INCI standartları, eczane tedarik akışları ve kozmetik dijital dönüşümü üzerine yazılar.",
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
      subtitle: "Dermokozmetik sektörüne özel yazılım çözümleri üreten grup.",
      content: `
<p>i-Grup, Türkiye'de <strong>farklı sektörlerde faaliyet gösteren dijital markaları</strong> aynı çatı altında buluşturan bir şirketler topluluğudur. 2018'den bu yana eczacılar, dermokozmetik distribütörleri, kozmetik markaları, B2B tedarik kanalları ve son kullanıcılar için markalar geliştiriyor ve işletiyoruz.</p>

<h2>Dermokozmetik dikeyindeki ürünlerimiz</h2>
<p>Portföyümüzün omurgasını dermokozmetik ürünleri oluşturuyor. Eczacıdan distribütöre, marka üreticisinden son kullanıcıya kadar değer zincirinin her halkasında özel bir çözümümüz yer alıyor.</p>
<ul>
  <li><strong>i-Eczane — Çok satıcılı eczane pazaryeri:</strong> Dermokozmetik markalarının ürünlerini doğrudan eczacılarla buluşturan multi-vendor pazaryeri. Stok, sipariş, iade, kampanya ve cari hesap akışı tek panelde.</li>
  <li><strong>i-Depo — Kapalı B2B dermokozmetik tedarik ağı:</strong> Distribütör–eczane arasında davetli tedarik modeli. Fiyat disiplini, marka güvenliği ve yetkisiz satıcı önlemi sağlayan kurumsal B2B platformu.</li>
  <li><strong>i-Kozmo — INCI okuyucu mobil uygulama:</strong> Kozmetik ambalajlarının bileşen listesini fotoğraftan okuyan, cilt tipine göre uyumluluk skoru üreten ve kişisel rutin öneren uygulama.</li>
  <li><strong>İstanbulVitamin — Kişisel kozmetik abonelik platformu:</strong> Cilt tipine göre kürasyon yapan kozmetik e-ticaret ve aylık abonelik sitesi.</li>
  <li><strong>SpecialWhey — Kişiye özel besin takviyesi:</strong> Hedef ve diyete göre formüle edilen protein karışımı ve tekrar-siparişli abonelik platformu.</li>
</ul>

<h2>Diğer dikeylerdeki ürünlerimiz</h2>
<p>Ana odağımız dermokozmetik olsa da paylaşımlı altyapımızı farklı dikeylerde de çalıştırıyoruz. B2B pazaryerleri, kurumsal yazılım ve tüketici uygulamaları alanlarında yayındaki çözümlerimiz:</p>
<ul>
  <li><strong>i-Hesap:</strong> KOBİ ve orta ölçekli işletmeler için e-Fatura, e-Arşiv ve e-SMM entegre muhasebe ERP yazılımı.</li>
  <li><strong>i-Hırdavat, i-Bijuteri, i-Kırtasiye, i-Nalbur:</strong> Sektöre özel B2B pazaryerleri (hırdavat, bijuteri, kırtasiye, nalbur).</li>
  <li><strong>i-Zeruj:</strong> Hal esnafı ile restoranlar arasında günlük zerzevat sipariş akışı (beta).</li>
  <li><strong>MemnuniyetimVar:</strong> Pozitif müşteri geri bildirimine odaklı tüketici platformu.</li>
  <li><strong>i-Kira:</strong> Kiracı ve ev sahibi arasında dijital kira anlaşma uygulaması.</li>
</ul>

<h2>Neden dermokozmetik?</h2>
<p>Dermokozmetik dikeyi Türkiye'de son beş yılda hızlı büyüdü; ancak büyümeyle birlikte <strong>fiyat erozyonu, yetkisiz satış kanalları ve marka güvenliği</strong> gibi kritik sorunlar gündeme geldi. Eczacılar yüzlerce markanın stok, iade ve kampanya süreçlerini farklı kanallardan takip etmek zorundaydı; distribütörler fiyat politikalarını koruyamıyor, son kullanıcılar ise ambalaj üstündeki INCI listesini anlayamıyordu.</p>
<p>i-Grup bu sorunlara <strong>sektörün iç dinamiklerine uygun, birbirini besleyen yazılım çözümleri</strong> ile yanıt veriyor. Eczacının kullandığı pazaryerinden distribütörün yönettiği kapalı ağa, markanın tüketicilere ulaştığı INCI uygulamasından abonelik kutusuna kadar her nokta tek bir ekosistemde çalışıyor.</p>

<h2>Çalışma yaklaşımımız</h2>
<p>Her ürünümüz, kendi gördüğümüz bir sektör problemini çözmek üzere tasarlandı. Müşteri adaylarıyla erken aşamada konuşuyor, gerçek kullanım verileriyle iteratif ilerliyoruz. Kimlik doğrulama, ödeme, bildirim, cari hesap, kampanya ve raporlama gibi tekrar eden ihtiyaçlar <strong>paylaşımlı modüller</strong> olarak tanımlandığı için yeni bir sektör ihtiyacı 3–4 ayda canlıya alınabiliyor.</p>

<h3>Değer verdiğimiz ilkeler</h3>
<ul>
  <li><strong>Sektör uzmanlığı:</strong> Dermokozmetik mevzuatı, INCI standartları, eczacı–distribütör ilişkileri — ürünlerimizi sektörün içinden tanıyarak tasarlıyoruz.</li>
  <li><strong>Süreklilik:</strong> Ürünü yayımlamak başlangıç, yıllarca aktif tutmak esas iş. Lansman tarihinden çok ürünün 5 yıl sonra nerede olacağına bakıyoruz.</li>
  <li><strong>Gerçek saha testi:</strong> Eczacıyla sahada, markayla rafta, tüketiciyle uygulamada test ediyoruz.</li>
  <li><strong>Paylaşımlı altyapı:</strong> Bir üründe çözdüğümüz sorunu diğerinde de kullanıyoruz — zaman da maliyet de yerinde harcanıyor.</li>
</ul>

<h2>İletişim</h2>
<p>i-Grup Şirketler Topluluğu, eczane pazaryeri, kapalı B2B tedarik platformları veya grup yapımız hakkında bilgi almak için iletişim sayfasından bize yazabilirsiniz. Kısa bir not yeterli; 48 saat içinde geri dönüyoruz.</p>
`.trim(),
    },
    {
      slug: "misyonumuz",
      title: "Misyonumuz",
      subtitle: "Dermokozmetik dikeyinde sürdürülebilir yazılım çözümleri.",
      content: `
<p>i-Grup'un misyonu, <strong>dermokozmetik ve eczacılık sektörüne değer katan yazılım çözümlerini kısa sürede lansmandan çıkarıp yıllarca ayakta tutmaktır</strong>. Eczacı pazaryerinden distribütör tedarik ağına, kozmetik mobil uygulamadan kişisel kozmetik abonelik platformuna kadar ürünlerimizi birer kampanya değil birer altyapı olarak tasarlıyoruz.</p>

<h2>Odağımız: dermokozmetik dikeyi</h2>
<p>Dermokozmetik, düzenlemelere tabi ve bilgi yoğun bir sektör. Eczacı davranışı, distribütör ağ yapısı, INCI bileşen standartları ve marka fiyat politikaları birbirine bağlı sistemler. Bu sistemleri yüzeysel değil, iç dinamikleriyle öğrenerek çözüm üretiyoruz:</p>
<ul>
  <li>Eczacının günlük sipariş, iade ve kampanya akışında yaşadığı sürtünmeler.</li>
  <li>Distribütörün fiyat politikasını koruma ve yetkisiz satıcıyı kontrol etme ihtiyacı.</li>
  <li>Kozmetik markalarının INCI bileşen şeffaflığı ve müşteri güveni beklentisi.</li>
  <li>Son kullanıcının ürün seçerken yaşadığı karar yorgunluğu ve kişiselleştirme talebi.</li>
</ul>

<h2>Üç temel prensip</h2>

<h3>1. Sektöre özel çözümler, genel amaçlı şablonlar değil</h3>
<p>Dermokozmetik dikeyinde çalışan yazılımlar çoğu zaman genel e-ticaret veya genel ERP şablonlarından türetiliyor; bu yüzden mevzuat, fiyat disiplini ve kanal yapısı gibi kritik ihtiyaçlara cevap veremiyor. Biz ürünlerimizi baştan sektöre göre tasarlıyoruz: eczacı KDV ve iskontoları, bölgesel stok, INCI etiketi, davetli tedarik ağı gibi özellikler bir eklenti değil, ürünün temel alanları.</p>

<h3>2. Sürdürülebilir büyüme, hızlı lansman değil</h3>
<p>Bir ürünün yayımlanması onun olgunluğa erişmesi değildir — asıl iş lansmandan sonra başlar. Ürünün kendi kendini finanse etmesi, kullanıcı tabanının yavaşça genişlemesi, müşteri desteğinin makul seviyede kalması ve ürünün beş yıl sonra hâlâ aktif olması bizim için başarı kriteri.</p>

<h3>3. Paylaşımlı altyapı ile ölçeklenme</h3>
<p>Her ürüne ayrı bir altyapı yazmak sürdürülebilir değil. Kimlik doğrulama, ödeme, bildirim, cari hesap, kampanya, raporlama gibi tekrar eden ihtiyaçlar <strong>paylaşımlı modüller</strong> olarak çıkarıldı. Bu sayede yeni bir sektör ihtiyacı 3–4 ayda canlıya alınabiliyor; bir modülü iyileştirdiğimizde tüm ürünler bundan yararlanıyor.</p>

<h2>Uzun vadeli niyet</h2>
<p>On yıl sonra dermokozmetik dikeyinde Türkiye'nin en yaygın <strong>eczacı pazaryeri</strong>, en güvenilir <strong>kapalı B2B tedarik ağı</strong> ve en çok kullanılan <strong>INCI okuyucu uygulamasının</strong> i-Grup Şirketler Topluluğu çatısı altında çalışıyor olmasını hedefliyoruz. Hızlı büyümek yerine sürdürülebilir büyümeyi, geniş vaatler yerine ölçülebilir sonuçları ve müşteriyle dolaylı değil doğrudan ilişkiyi tercih ediyoruz.</p>

<h2>Kiminle çalışıyoruz?</h2>
<p>Ürünlerimiz dermokozmetik sektörünün tüm halkalarına hitap ediyor:</p>
<ul>
  <li><strong>Eczacılar:</strong> Tek bir pazaryerinden yüzlerce marka ile çalışmak isteyen bağımsız eczacılar ve zincir eczaneler.</li>
  <li><strong>Distribütörler:</strong> Fiyat politikasını korumak ve eczane ağını şeffaf yönetmek isteyen dermokozmetik distribütörleri.</li>
  <li><strong>Kozmetik markaları:</strong> Ürünlerini hem B2B hem son kullanıcıya şeffaf şekilde sunmak isteyen markalar.</li>
  <li><strong>Son kullanıcılar:</strong> Bilinçli ürün seçimi yapmak ve kişiselleştirilmiş bakım deneyimi isteyen tüketiciler.</li>
</ul>
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
    const data = {
      title: p.title,
      subtitle: p.subtitle,
      content: p.content,
      seoTitle: p.title,
      seoDescription: p.subtitle,
    };
    await prisma.page.upsert({
      where: { slug: p.slug },
      update: data,
      create: {
        slug: p.slug,
        ...data,
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
      title: "Dermokozmetik dikeyi",
      description:
        "Eczane pazaryerinden kapalı B2B tedarik ağına, INCI okuyucu mobil uygulamadan cilt tipine özel kürasyona kadar dermokozmetik sektörüne uçtan uca dijital çözümler üretiyoruz.",
    },
    {
      eyebrow: "Uzmanlık",
      title: "Sektörün iç dinamikleri",
      description:
        "Eczacı KDV ve iskonto yapısı, distribütör ağ disiplini, INCI bileşen standartları ve marka fiyat politikaları — ürünlerimizi sektörü dışarıdan değil, içinden tasarlıyoruz.",
    },
    {
      eyebrow: "Yaklaşım",
      title: "Sahada test edilmiş",
      description:
        "Eczacıyla tezgahta, distribütörle depoda, kozmetik markasıyla rafta, son kullanıcıyla uygulamada — ürünlerimiz gerçek sektör geri bildirimiyle iteratif büyüyor.",
    },
    {
      eyebrow: "Altyapı",
      title: "Paylaşımlı modüller",
      description:
        "Kimlik doğrulama, ödeme, bildirim, cari hesap ve kampanya altyapısı tüm ürünlerde ortak. Bir üründe çözülen problem tüm portföyde hızla kullanılıyor.",
    },
    {
      eyebrow: "Süreklilik",
      title: "Lansman başlangıç, sürdürme asıl iş",
      description:
        "Ürünün 5 yıl sonra nerede olacağına bakıyoruz. Hızlı büyüme yerine kendi ayakları üstünde duran, sürdürülebilir yazılım çözümleri hedefliyoruz.",
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
      slug: "eczane-pazaryeri-yazilimi-rehberi",
      tag: "Rehber",
      title: "Eczane Pazaryeri Yazılımı Nedir? Kapsamlı Rehber",
      excerpt:
        "Dermokozmetik satan eczacılar için çok satıcılı pazaryeri yazılımı nedir, hangi sorunları çözer ve doğru çözümü seçerken nelere dikkat edilmeli? i-Eczane deneyiminden detaylı rehber.",
      date: "2026-04-18",
      cover: IMG.newsSector,
      seoTitle:
        "Eczane Pazaryeri Yazılımı Nedir? | Dermokozmetik Tedarik Rehberi",
      seoDescription:
        "Eczane pazaryeri yazılımı nedir, dermokozmetik tedarikinde hangi sorunları çözer, çok satıcılı mimari, eczacı iskonto motoru ve INCI filtreleri. Markalar ve distribütörler için doğru yazılımı seçerken dikkat edilecekler.",
    },
    {
      slug: "dermokozmetikte-kapali-pazaryeri",
      tag: "Sektör",
      title: "Dermokozmetikte Kapalı B2B Pazaryeri Neden Kritik?",
      excerpt:
        "Fiyat erozyonu, yetkisiz satıcı ve marka değer kaybı sorunlarına kapalı B2B dermokozmetik tedarik ağının verdiği yanıt — i-Depo mimarisi ve saha notları.",
      date: "2026-04-04",
      cover: IMG.newsSector,
      seoTitle:
        "Dermokozmetikte Kapalı B2B Pazaryeri | Marka Güvenliği ve Fiyat Disiplini",
      seoDescription:
        "Dermokozmetik sektöründe fiyat erozyonu ve yetkisiz satış kanalı sorunlarına kapalı B2B pazaryeri nasıl çözüm üretiyor? Davetli tedarik ağı, fiyat grupları ve i-Depo mimarisi üzerine detaylı yazı.",
    },
    {
      slug: "inci-okuyucu-mobil-uygulama",
      tag: "Kozmetik",
      title: "INCI Okuyucu Mobil Uygulama Nasıl Çalışır?",
      excerpt:
        "Kozmetik ambalajlarının INCI bileşen listesini fotoğraftan okuyan uygulamaların teknik mimarisi, cilt tipi eşleştirme motoru ve dermokozmetik markaları için anlamı — i-Kozmo üzerinden derinlemesine inceleme.",
      date: "2026-03-21",
      cover: IMG.newsInci,
      seoTitle:
        "INCI Okuyucu Mobil Uygulama Nasıl Çalışır? | Kozmetik Bileşen Analizi",
      seoDescription:
        "INCI okuyucu mobil uygulamalar kozmetik ürün bileşenlerini nasıl analiz eder? OCR motoru, bileşen veritabanı, cilt tipi eşleştirme ve dermokozmetik markaları için pazarlama değeri üzerine kapsamlı rehber.",
    },
    {
      slug: "kisisel-kozmetik-abonelik-modeli",
      tag: "Kozmetik",
      title: "Kişisel Kozmetik Abonelik Modeli ve Kürasyon Motoru",
      excerpt:
        "Cilt tipine göre kürasyon yapan aylık kozmetik abonelik platformları nasıl çalışır? Kürasyon motorunun aşamaları, markalar için faydası ve İstanbulVitamin yaklaşımı.",
      date: "2026-03-07",
      cover: IMG.newsProduct,
      seoTitle:
        "Kişisel Kozmetik Abonelik Modeli | Cilt Tipine Göre Kürasyon",
      seoDescription:
        "Kozmetik abonelik platformlarındaki kürasyon motoru nasıl çalışır? Cilt tipi profili, ürün etiketleme, eşleşme skoru ve aylık kutu hazırlama — İstanbulVitamin üzerinden kapsamlı inceleme.",
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
