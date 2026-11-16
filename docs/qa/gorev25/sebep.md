# Görev 25: 24.3'teki kaydırma neden çalışmadı

_Claude Code, 17 Kasım 2026._

## Kısa cevap

Kaydırma kodu çağrılıyordu ama ilk birkaç karede kendini durduruyordu.

24.3'teki kaydırma (`yumusakKaydir`), kullanıcının parmakla kaydırdığını anlamak için her karede şunu yapıyordu:
- kendi yazdığı kaydırma konumunu geri okuyordu (`window.scrollY`);
- 2 px'ten fazla fark görünce "kullanıcı kaydırdı" sayıp animasyonu bırakıyordu.

iPhone'da sayfanın (pencerenin) kaydırma konumu, yazıldıktan sonra geç bildiriliyor: WebKit'te sayfa kaydırmasını UIKit'in kaydırma görünümü yapıyor ve konum sayfaya sonradan dönüyor. Bu yüzden ilk karelerde okunan konum, yazılandan farklı çıkıyordu ve animasyon 3–5 px kaydıktan sonra duruyordu.

Kararma (`takvimOdak`) ve alttaki panel ondan bağımsız açıldığı için Zeyd'in gördüğü tam olarak şuydu: etraf kararıyor, sayfa kaymıyor, takvimin alt satırları panelin arkasında.

## Neden testlerde görünmedi

1. **Masaüstü Chrome'da kaydırma konumu aynı anda güncelleniyor.** Geri okunan değer hep yazılanla aynı, animasyon hiç durmuyor.
2. **Görev 24 testi "sayfa en üstteyken" durumunu aslında denememişti.**
   - Test yardımcısı (`dokun`), dokunulacak gün ekranda görünmüyorsa önce onu ekranın ortasına kaydırıyordu.
   - Dokununca uygulamanın yaptığı kaydırma yalnız 14 px'lik bir düzeltmeydi.
   - Büyük ve gerçek kaydırma hiç ölçülmemişti.

## Nasıl yeniden üretildi

Playwright, 390×844 ve 360×740. Sahte sunucu, gerçek dokunma olayı.
- Sayfa, son satırlardan birindeki 23 Kasım alt menünün hemen üstünde görünecek kadar kaydırıldı.
- 23'e kaydırmadan dokunuldu (Zeyd'in videosu).
- iPhone gibi davranış için `window.scrollY` her karenin sonunda güncellendi: kaydırma konumu bir kare geç bildirildi.

| Durum | Önce (sayfa konumu) | Sonra | Izgaranın altı | Panelin üstü | Sonuç |
|---|---|---|---|---|---|
| 390, Chrome (konum anında) | 182 | 379 | 640 | 700 | kaydı |
| 390, konum bir kare geç (iPhone gibi) | 182 | 187 | 832 | 700 | **5 px kaydı, durdu; 2 satır panelin arkasında** |
| 360, konum bir kare geç | 286 | 296 | 723 | 596 | **10 px kaydı, durdu** |

Her kare kaydedildi. Geç bildirimde konum 182 → 183 → 187'de kalıyor. Görseller `yeniden-uretim/` klasöründe:
- `eski-chrome-390.png`;
- `eski-ios-gecikmeli-390.png`, `eski-ios-gecikmeli-360.png`.

## Görevdeki diğer olasılıklar (denendi, sebep değil)

- **Yanlış kaydırma kabı:** değil.
  - Villa ekranında kaydırılan şey sayfanın kendisi (`document.scrollingElement` = `html`).
  - Kaydırma doğru kaba yazılıyordu; Chrome'da da kaydı.
- **Panel yüksekliği animasyon bitmeden ölçülüyor:** sonucu değiştirmiyordu.
  - Panel `transform` ile kayıyor; `offsetHeight` animasyondan etkilenmez, ölçülen yükseklik zaten son değerdi (390'da "Çıkış gününü seçin" paneli 144 px).
  - Yine de yeni kod ölçümü panelin animasyonu bitince yapıyor (25.1).
- **Kararma katmanı kaydırmayı engelliyor:** değil.
  - Katman `pointer-events:none`; programla yapılan kaydırmayı etkilemez.
  - Chrome'da kararma açıkken de kaydırma tamamlandı.

## Düzeltme

- **Yeni konumlama (`takvimKonumla`) kaydırma konumunu geri okumuyor.**
  - Başlangıç konumu ve hedef bir kez hesaplanıyor.
  - Her karede `başlangıç + mesafe × eğri` yazılıyor; tam sayıya yuvarlanıyor.
- **Kullanıcının elle kaydırması parmak ya da tekerlek olayından anlaşılıyor** (`touchstart`, `wheel`). O anda animasyon bırakılıyor ve kullanıcıyla çekişmiyor (25.3).
- **Kararma katmanının yeri** artık sayfanın geç bildirilen kaydırma konumundan değil, takvimle aynı yerleşimden hesaplanıyor. Kaydırırken takvimden kaymıyor.
- **Görev 24'ün klavye kodu (`yumusakKaydir`) değiştirilmedi.**
  - O, panelin kendi kaydırmasında (sayfanın değil) kullanılıyor.
  - Zeyd orada sorun görmedi (Görev 24 onaylandı).

Aynı gecikme taklidiyle yeni kod iki aşamada da hedefe tam gidiyor (`test.md`).

## Denenemeyen

Gerçek iPhone. Konumun "bir kare geç" bildirilmesi bir taklit; iOS'ta gecikmenin gerçek süresi farklı olabilir. Yeni kod konumu hiç geri okumadığı için gecikmenin süresinden etkilenmiyor.
