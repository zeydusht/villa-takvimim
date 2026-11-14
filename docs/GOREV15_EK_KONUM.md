# Görev 15 eki: Harita neden çıkmıyor (konum bulma düzeltmesi)

_Hazırlayan: Claude (ürün yöneticisi), 14 Kasım 2026 akşam._

## Sorun (veritabanında doğrulandı)
Misafir sayfasındaki harita (15.1) yalnız `bilgi.konumKoord` doluysa çıkıyor. Şu an **hiçbir villada `konumKoord` yok**. Sayfa yenileme sorunu değil, konum hiç bulunamamış. İki neden var:

1. **Villa Salta:** bağlantı Apple Haritalar (`https://maps.apple/p/…`). `konum-coz` yalnız Google bağlantılarını kabul ediyor ve "Lütfen Google Haritalar bağlantısı yapıştırın" deyip reddediyor. Kullanıcılarımızın çoğu iPhone'lu; "Paylaş"a bastıklarında Apple Haritalar bağlantısı geliyor.
2. **Villa Grand Emora 1:** kutuya Google'ın paylaş metninin tamamı yapıştırılmış: `Grand Emora Villaları https://maps.google.com/?q=36.259457,2…`. `IZINLI` düzenli ifadesi metnin başından aradığı için reddediyor.

## Yapılacaklar
- [x] **E.1 Metnin içinden bağlantıyı ayıkla.** Hem uygulamada (`b-harita` kutusu, "Konumu bul" basılınca) hem `konum-coz`'da:
  - yapıştırılan metindeki ilk `https?://…` adresini al;
  - adres yoksa ve metin `36.25, 29.41` biçimindeyse koordinat olarak kullan.
  - Kutuda yalnız bağlantı kalsın.
- [x] **E.2 Apple Haritalar desteği** (`supabase/functions/konum-coz/index.ts`):
  - İzinli adresler: `maps.apple.com`, `maps.apple`, `maps.apple/p/…` (kısa bağlantı).
  - Koordinat desenleri: `ll=`, `coordinate=`, `sll=`, `q=lat,lng`, `center=`.
  - Kısa bağlantı yönlendirmeyle açılıyorsa izle. Yönlendirme yoksa sayfa gövdesinde ara: `"latitude":…,"longitude":…`, `<meta property="place:location:latitude">` ve benzerleri.
  - Yer adı: `name=` / `q=` / sayfa başlığı.
  - Hata mesajı: "Google veya Apple Haritalar bağlantısı yapıştırın."
- [x] **E.3 Kaydetmede otomatik dene.** Kullanıcı "Konumu bul"a basmadan "Kaydet"e basarsa, bağlantı varken `konumKoord` yoksa kaydetmeden önce `konum-coz` bir kez çalışsın. Bulamazsa kayıt yine yapılsın, altta kısa uyarı çıksın: "Harita için konum bulunamadı."
- [x] **E.4 Kutunun altındaki yardım yazısı:** "Google veya Apple Haritalar'da evi açın → Paylaş → bağlantıyı kopyalayıp buraya yapıştırın."
- [x] **E.5 Bilgi sayfası güncellemesi.** Konum yeni bulunduysa ve villa sayfası yayındaysa, kaydedince sayfa da yenilensin. Şu an başka bilgilerde nasıl yenileniyorsa aynı yol (`icerikImza` / `yayinla`).
- [x] **E.6 Test.**
  - Şu üç girdi koordinat döndürsün:
    - `https://maps.apple/p/Ip8R4JD1M06Ha3`
    - `Grand Emora Villaları https://maps.google.com/?q=36.259457,29.4…` (tam hâli veritabanında)
    - `https://maps.app.goo.gl/…` (herhangi bir gerçek kısa bağlantı)
  - Misafir sayfasında harita görünsün.

## Bitince
- `konum-coz` fonksiyonunu Supabase'e yükle: `npx supabase functions deploy konum-coz --project-ref qmfyqixilkvcvidigngt`. Yetkin yoksa dur ve Zeyd'e söyle; sohbetteki Claude onun onayıyla yükler.
- Netlify'a yayınla, `sw.js` sürümünü artır, commit + push.
- `PROJE_DURUMU.md`'ye tek satır.
