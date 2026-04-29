# i-Grup Markalarimiz Konumlandirma Tasarimi

## Amac

i-Grup sitesi mevcut "yazilim sirketi / proje portfoyu" anlatimindan cikarilip "sirketler toplulugu / markalar portfoyu" anlatimina tasinacak.

Yeni ana mesaj:

> i-Grup, farkli sektorlerde faaliyet gosteren dijital markalari ve platformlari catisi altinda bulusturan bir sirketler toplulugudur.

Site artik i-Grup'u bir yazilim hizmeti saglayicisi olarak degil, kendi markalari ve platformlari olan bir grup yapi olarak tanitacak. Ana hedef, i-Grup'a bagli markalari one cikarmak ve her markayi detayli sekilde anlatmak.

## Referans Yon

Referans olarak iLab yapisi esas alinacak:

- Ana kurum, markalar icin cati kimlik olarak konumlanir.
- "Markalarimiz" sitenin ana vitrini olur.
- Markalar sektor/kategori bazinda gruplanir.
- Her marka kendi hedef kitlesi, deger onerisi ve faaliyet alaniyla anlatilir.
- Cati kurumun markalara sagladigi stratejik, operasyonel ve dijital buyume destegi vurgulanir.

## Bilgi Mimarisi

Ana menu onerisi:

- Hakkimizda
- Markalarimiz
- Sektorler
- Insan & Kultur veya Kariyer
- Blog / Haberler
- Iletisim

Ana sayfa sirasi:

1. Hero: i-Grup sirketler toplulugu mesaji
2. Kisa hakkinda: grup yapisi ve marka portfoyu
3. Markalarimiz: ana vitrin
4. Sektorler: markalarin faaliyet alanlari
5. Grup yaklasimi: i-Grup markalara ne saglar
6. Haberler / Blog
7. Kariyer veya Insan & Kultur
8. Iletisim

## Marka Kategorileri

Mevcut `Project` kayitlari kullaniciya proje olarak degil, i-Grup'a bagli marka/platform olarak gosterilecek.

Kategori yapisi:

- Eczane Pazaryeri
  - i-Eczane
- B2B Pazaryerleri
  - i-Depo
  - i-Hirdavat
  - i-Bijuteri
  - i-Kirtasiye
  - i-Nalbur
  - i-Zeruj
- Kozmetik & Kisisel Bakim
  - i-Kozmo
  - IstanbulVitamin
  - SpecialWhey
- Finans & Kurumsal Cozumler
  - i-Hesap
- Tuketici Platformlari
  - MemnuniyetimVar
  - i-Kira

## Markalarimiz Bolumu

Ana sayfadaki mevcut "Projeler" bolumu "Markalarimiz" olarak degisecek.

Marka kartlarinda gosterilecek bilgiler:

- Marka adi
- Kategori
- Kisa aciklama
- Durum: Yayinda / Beta / Yakinda
- Yil
- "Markayi Incele" CTA
- Varsa dis site linki

Filtreler kategori odakli kalabilir, fakat metinler proje yerine marka dili kullanir.

## Marka Detay Sayfasi

Yeni gorunur route:

- `/markalarimiz`
- `/markalarimiz/[slug]`

Detay sayfasi proje detayi gibi degil, marka tanitim sayfasi gibi tasarlanacak.

Icerik yapisi:

- Buyuk marka basligi
- "i-Grup markasi" veya kategori etiketi
- Kisa deger onerisi
- Marka ne yapar?
- Hangi kitleye hizmet eder?
- Sektorde hangi problemi cozer?
- One cikan kabiliyetler / urun ozellikleri
- Galeri veya gorsel alan
- Varsa web sitesi linki
- Diger ilgili markalar

Eski `/projelerimiz` route'lari uyumluluk icin korunabilir veya yeni `/markalarimiz` route'larina yonlendirilebilir.

## Degisecek Gorunur Dil

Degisecek alanlar:

- Header: "Projeler" yerine "Markalarimiz"
- Ana sayfa hero: yazilim cozumu gelistirme dili yerine sirketler toplulugu dili
- About bolumu: hizmet ureten yazilim sirketi yerine marka portfoyu yoneten grup dili
- Projects bolumu: "Projeler" yerine "Markalarimiz"
- ProjectCard: "Siteyi goruntule" ve proje ifadeleri yerine marka odakli CTA'lar
- Sectors bolumu: hizmet verilen sektorler yerine markalarin faaliyet alanlari
- Footer: "Urunler" yerine "Markalar"
- Blog: gerekirse "i-Grup'tan Haberler" veya "Grup Gündemi" tonu
- SEO: sirketler toplulugu, markalar ve dijital platformlar odagi

## Hizmetler Bolumu

"Hizmetlerimiz" ana amac degil. i-Grup bir yazilim hizmeti veren sirket gibi konumlanmayacak.

Bu nedenle:

- Ana menude "Hizmetlerimiz" one cikarilmayacak.
- Hizmet sayfalari teknik olarak kalabilir, ancak ana akis markalar uzerinden kurulacak.
- Hizmet metinlerindeki "pazaryeri gelistirme hizmeti", "dijital donusum projeleri" gibi ajans/hizmet dili azaltilecek.

## Admin ve Veri Modeli

Ilk fazda Prisma modeli degismeyecek.

- `Project` modeli teknik olarak korunacak.
- Kullaniciya gorunen her yerde "Project/Proje" dili "Brand/Marka" diline cevrilecek.
- Admin panelde teknik model korunabilir; gorunen basliklar "Markalar" olarak degistirilebilir.
- Buyuk migration, model yeniden adlandirma veya veri tasima bu fazin kapsamina alinmayacak.

Bu yaklasim, gorunur site amacini hizli ve dusuk riskle degistirir.

## Basari Kriterleri

- Ziyaretci siteye girdiginde i-Grup'u yazilim ajansi olarak degil, sirketler toplulugu olarak algilar.
- Ana sayfada en baskin bolum "Markalarimiz" olur.
- i-Eczane, i-Depo ve diger markalar proje degil, grup markasi/platformu olarak anlatilir.
- `/markalarimiz` ve marka detay sayfalari calisir.
- Eski proje dili header, footer, ana sayfa, detay sayfasi ve SEO metinlerinden temizlenir.
- Teknik veri modeli degismeden build ve lint temiz kalir.

## Kapsam Disi

- Prisma `Project` modelini `Brand` olarak yeniden adlandirma.
- Yeni marka logolari veya gorsel uretimi.
- Cok dilli yapi.
- Admin panelin bastan tasarlanmasi.
- Yeni blog/haber CMS modeli.
