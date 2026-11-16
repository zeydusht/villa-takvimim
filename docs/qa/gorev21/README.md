# Görev 21: test raporu

_Claude Code, 16 Kasım 2026._

Ayrıntılı ölçümler `olcum.md` dosyasında (21.6): her adımın sayıları ve her geçişin kare kare kaydı. Ekran görüntüleri:
- `adimlar/`: son çalışan tur;
- `regresyon/` ve `regresyon-g20/`: Görev 19 ve 20 testleri yeni yerleşimle.

## Özet

**Ekran boyutları:** iPhone 14 (390×664), 390×844 ve 360×740.

**Klavyeli turda** her alana dokunuldu; klavye açıldı ve kapandı:
- Klavye açıkken klavyenin üst kenarı ile hedefin alt kenarı arası her adımda 12 px.
- Baloncuk ile hedef arası 7,6–8,2 px.
- Geçişlerde hedef hiç üst %20'ye çıkmadı. Uzun takvim hedefi dinlenirken de üst %20'ye uzanıyor; geçiş sırasında son yerinin üstüne çıkmadı.

**Klavyesiz turda:** her geçişte pencerenin alt kenarı en fazla 1 px oynadı (her boyutta 6 geçişin 6'sı).

**21.5 Elle kaydırma:**
- Hedef 120–147 px kaydırıldı. Pencere ile hedef arasındaki fark her karede sabit kaldı (4 px, pencerenin kenar payı).
- "İleri"den sonra hedef yeniden tam odak hattına geldi.

## Testte bulunup düzeltilenler

1. **Önce yukarı, sonra geri.** Form açılırken panel kendi animasyonuyla yukarı çıkıyordu; rehber önce panelin oturmasını bekleyip sonra içeriği geri kaydırıyordu. Artık hedefin panel oturduğunda varacağı yer baştan hesaplanıyor; panel alttan gelip hedefi doğrudan odak hattına bırakıyor.
2. **Küçük ekranda takvim.** iPhone 14'te takvim, alttaki seçim paneli ve sekmelerle birlikte sığmıyordu; 19 Kasım panelin altında kalıyordu. Tarih adımlarında bu ikisi artık gizli. Yalnız "Geri" düğmesi olan baloncukta "Geri" üst satıra geçiyor, baloncuk kısalıyor.
3. **Sayfa daralıyordu.** Sayfaya eklenen geçici boşluk öğesi, sayfanın yatay esnek düzeni yüzünden sayfayı daraltıyordu (Fiyatlar ekranında görüldü). Artık sayfanın kendi dolgusu kullanılıyor.
4. **iOS görünen alanı da kaydırınca.** Görünen yükseklik yaklaşık 200 px'e iniyor; o zaman hedef klavyenin arkasında kalıyordu. Klavye açıkken hedef artık her zaman klavyenin 12 px üstünde. Yer yetmezse baloncuk hedefin hemen üstünde tek satırlık kısa biçime geçiyor (en üste yapışmadan).
5. **Kaydırma sınırında birkaç px sapma.** Klavye kapanırken kaydırma sınırına takılınca hedef 6 px sapıyordu. Geçişten sonra bir kez denetim yapılıyor, gerekirse küçük bir düzeltme uygulanıyor.

## Regresyon

- **Görev 19 akışları:** iki boyutta geçti. Kapsanan akışlar: rezervasyon (13 adım), teklif, opsiyon, fiyat, paylaş, ödeme al ve yerleştir, alınan ödemeyi gir, gider, bakıcı, Drive, rehbersiz açılış, sihirbaz, uygulama turu, "Nasıl yapılır?", villa sürükleme.
- **Görev 20 testleri:** üç boyutta geçti.
  - Klavye açıkken baloncuğun yazı kutusuyla kesişimi 0. Bu, görünen alanın 120, 160 ve 200 px kaydığı dar durumlarda da geçerli.
  - Karartılmış yerden kaydırma çalışıyor; karartılmış yere dokunuş engelleniyor.
  - "Tamam" çalışıyor; seçim paneli ve toplam doğru.
  - Klavye kapanınca panel yerinde kalıyor.

## Denenemeyenler

Gerçek iPhone. iOS klavye animasyonuyla eşzamanlılık ve iOS'un kendi kaydırması emülasyonda birebir yok.
