# Görev 48 — test raporu (28 Kasım 2026)

Ortam: Playwright **webkit** (WebKit 27.2, Windows), iPhone boyutu (390 × 844; 320 + Çok büyük). Veri:
`docs/appstore/demo-yedek.json` (Hesap → Gelişmiş → Geri yükle ile; veritabanına dokunulmadı). Yayın yapılmadı.

Çalıştırma (playwright-core gerekir):
```
node docs/qa/gorev48/kare.js http://127.0.0.1:8765/ docs/appstore/demo-yedek.json cikti.json 3 webkit 3
node docs/qa/gorev48/rehber-test.js http://127.0.0.1:8765/ docs/appstore/demo-yedek.json docs/qa/gorev48
node docs/qa/gorev48/titresim-test.js http://127.0.0.1:8765/ docs/appstore/demo-yedek.json
```

## 48.1 Kare süreleri
`performans.md`. Özet:
- WebKit'te CPU yavaşlatma yok; Windows sınırlaması düzgün yavaşlatmıyor.
- Bu yüzden ölçüm WebKit 1x + WebKit 3x + Chromium 4x olarak yapıldı.
- Asıl doğrulama telefonda, Akıcılık göstergesiyle yapılacak.

## 48.3 Mevcut rehber (değişiklikten önce)
- **Yardımlı mod:** varsayılan açık, cihazda (`vt-yardim`).
- **İşlem rehberleri her açılışta baştan başlıyordu:** rezervasyon, teklif, opsiyon, fiyat, ödeme, gider, gelir, fotoğraf, paylaş, bakıcı, PDF, dış takvim, "Hangi villam boş". 10. kullanımda da aynı ipuçları çıkıyordu. "Bir kez" kaydı yoktu.
- **Tanıtım (`tur`):** 5 adım, kurulum bitince bir kez (`vt-tur`).
  - Sıradaki kartı.
  - **Giriş gününe dokunun:** kullanıcıyı bekliyor.
  - **Çıkış gününe dokunun:** kullanıcıyı bekliyor.
  - Seçim paneli.
  - Sekmeler.
  - 2. ve 3. adım tarih seçilmeden geçilmiyordu ("hemen rezervasyon girin" şikâyeti).
- **Kullanıcıyı bekleten adımlar:**
  - Yazı adımlarında (misafir adı, kapora tutarı…) "Tamam" ancak yazınca çıkıyordu.
  - Ücret kartında düzenleme açıkken "İleri" pasifti. Fiyatı girilmemiş tarihte bu adım fiyat yazmadan geçilemiyordu.
  - Hedef dışındaki her dokunuş engelleniyordu (baloncuk sallanıyordu).
- **Kapatma:**
  - Sağ üstte küçük ✕ "Kapat". Yalnız o rehberi kapatıyordu.
  - Kalıcı kapatma yalnız Hesap → Yardım → Yardımlı mod ile mümkündü.

## 48.3 Rehber akış testi (`rehber-test.js`): 20 kontrol, 0 hata
    ✓ tanıtım en fazla 4 adım  (4 adım: Bütün villalarınız Villalar sekmesinde. | Rezervasyon için takvimde giriş ve çıkış gününe dokunursunuz. | Açılan pencerede misafiri yazıp Kaydet'e dokunursunuz. | Villa sayfanızı buradan misafirlerinize gönderirsiniz.)
    ✓ tanıtımda her adımda 'Rehberi kapat' ve 'İleri/Bitir'
    ✓ iki düğme aynı büyüklükte
    ✓ hedefli adımda ok var, lime renk (kırmızı değil)
    ✓ tanıtımda tarih seçtiren / yazı bekleyen adım yok
    ✓ tanıtım bitince başka rehber başlamıyor
    ✓ sayfa hatası yok
    ✓ rezervasyon rehberi açıldı ve yazı adımına gelindi  (Misafirin adını yazın.)
    ✓ yazı adımında 'Bu adımı geç' ve 'Rehberi kapat'
    ✓ yazı adımı başka alana dokunmayı engellemiyor
    ✓ 'Bu adımı geç' sonraki adıma geçiyor  (Kaç kişi gelecek? − ve + ile ayarlayın.)
    ✓ aynı ipucu ikinci girişte çıkmıyor  ({"gosterilen":["rez"],"yapilan":[],"kapatma":1,"sus":false})
    ✓ sayfa hatası yok
    ✓ iki kapatmadan sonra otomatik ipuçları kapalı  ({"gosterilen":[],"yapilan":[],"kapatma":2,"sus":true})
    ✓ susunca rezervasyon formunda otomatik rehber çıkmıyor
    ✓ 'Nasıl?' düğmesi duruyor
    ✓ 'Nasıl?' ile rehber yine açılıyor
    ✓ sayfa hatası yok
    ✓ 320 + Çok büyük: tanıtım metinleri en fazla 4 satır  (en çok 3 satır, 4 adım)
    ✓ sayfa hatası yok
    hepsi geçti

## 48.2 Titreşim testi (`titresim-test.js`): 15 kontrol, 0 hata
Sahte `Capacitor` (iOS) + sahte `Haptics`. Her olayda çağrılan titreşim kaydedildi.
    ✓ uygulama sınıfı (html.native) var
    ✓ alt sekme değişimi → impact LIGHT  (impact LIGHT)
    ✓ segment → selection  (selection)
    ✓ ana düğmeye basınca (touchstart) → impact LIGHT  (impact LIGHT)
    ✓ 80 ms içinde iki basış → tek titreşim  (impact LIGHT)
    ✓ 80 ms sonra yeni basış → yine titreşir  (impact LIGHT)
    ✓ kaydırırken (30 px) titreşim yok
    ✓ sayfa kayarken dokunuş → titreşim yok
    ✓ karta dokununca → impact LIGHT  (impact LIGHT)
    ✓ alttan pencere açılınca → impact LIGHT  (impact LIGHT)
    ✓ pencere çekme eşiği geçilince → impact MEDIUM, bir kez  (impact MEDIUM)
    ✓ kenardan geri eşiği → impact LIGHT, bir kez  (impact LIGHT)
    ✓ sayfa hatası yok
    ✓ titreşim ayarı kapalıyken hiç titreşim yok
    ✓ sitede html.native yok, hata yok
    hepsi geçti

Not: ana düğmede titreşim, görev gereği parmak **basınca** (touchstart) çalar. Parmak düğmenin üstünden kaydırmaya başlarsa
o "tık" zaten çalmış olur. Liste ve kartlarda titreşim parmak kalkınca çalar, kaydırınca hiç çalmaz.

## Ekran görüntüleri
- `483-tanitim-1-390.png`, `483-tanitim-2-ok-390.png`: yeni balon, iki düğme, lime ok (390).
- `483-tanitim-2-ok-320-cokbuyuk.png`: 320 + Çok büyük; metin 3 satır.
- `483-yazi-adimi-390.png`: yazı adımında "Bu adımı geç".
- `481-rehber-perde.png`: 48.1 perdesi (eski tanıtım adımıyla).
- `481-akicilik-gostergesi.png`: akıcılık göstergesi.

## Yan bulgu
`docs/appstore/demo-yedek.json` dosyasındaki rezervasyonlarda renk yoktu, takvimde dolu günler boş görünüyordu.
Her rezervasyona villanın rengi eklendi.
