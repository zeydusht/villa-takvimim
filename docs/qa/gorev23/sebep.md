# Görev 23: hataların sebebi

_Claude Code, 16 Kasım 2026._

## Nasıl yeniden üretildi

Hatalar düzeltmeden önce eski kodla (Görev 21 sürümü) yeniden üretildi. Ortam:
- Playwright, iPhone 14 görünümü (390×664), sahte sunucu;
- dokunuşlar gerçek dokunma olayı;
- konsol hataları ve uyarıları kaydedildi.

Görev 21'in testlerinde klavye **tek seferde** açılıyordu ve her alanda **aynı boydaydı** (336). Bu hataları gizledi. Bu kez klavye iPhone'a daha yakın taklit edildi:
- **Alan türüne göre farklı yükseklik:** metin 336, telefon 380 (tuş takımı + "Otomatik doldur" çubuğu), sayı 300.
- **Kademeli açılış:** 250 ms sürüyor, her karede görünen alan biraz daha küçülüyor (iOS'un resize olayları gibi).
- **Geç gelen çubuk:** isteğe bağlı olarak "Otomatik doldur" çubuğu 400 ms sonra eklendi (+30 ya da +44).
- **Uygulama modu:** önce Capacitor'un `keyboardWillShow` yüksekliği bildiriliyor, sonra görünen alan küçülüyor.

Betik: `qa23.js` (yardımcı: `qa23ortak.js`). İlk görseller `yeniden-uretim/` klasöründe.

## 23.1 Telefon alanı klavyenin altında kalıyor

### Ölçüm (eski kod)

Mesafe = klavyenin üst kenarı − alanın alt kenarı. Doğrusu 12 ± 2; eksi değer, alanın o kadarının klavyenin altında kaldığı anlamına geliyor.

| Durum | Ad soyad | Telefon | Not |
|---|---|---|---|
| Klavye tek seferde, her alanda 336 | 12 ✓ | 12 ✓ | 12 ✓ |
| Telefonda "Otomatik doldur" çubuğu sonradan geliyor (+30) | 12 ✓ | **−18** | 12 ✓ |
| Uygulama: telefonda çubuk sonradan (+44), kademeli | 12 ✓ | **−32** | 12 ✓ |
| Uygulama: bildirilen yükseklik önceki klavyeninki | 12 ✓ | **−32** | 56 |
| Kademeli açılan klavye (250 ms) | **−150** | — | — |

Zeyd'in gördüğü durum ikinci ve üçüncü satırla birebir: ad soyad doğru, telefon alanının yarısı klavyenin altında. Konsolda hata yoktu; bu bir hesap hatasıydı, çökme değil.

### Sebep

1. **40 px eşiği ve her karede güncellenen referans.** Rehber, görünen alanın alt kenarını her karede önceki kareyle karşılaştırıyordu. Yalnız 40 px'ten büyük bir sıçramada yeniden hizalıyordu ve karşılaştırma değerini her karede yeniliyordu. Bu yüzden:
   - klavye kademeli açılınca her kare birkaç piksel değişti ve hiçbiri 40'ı geçmedi; hiç hizalanmadı;
   - "Otomatik doldur" çubuğu (30–44 pt) sonradan gelince ya fark edilmedi ya da kademeli büyüdüğü için kaçırıldı.

   Ad soyad alanında sorun çıkmamasının nedeni: uygulamada `keyboardWillShow` yüksekliği tek seferde geliyor ve büyük bir sıçrama oluyor. Telefonda ise asıl artış, çubuk geldiğinde sonradan ve küçük adımlarla oluyordu.
2. **Uygulamada saklanan klavye yüksekliği.** Uygulamada klavye yüksekliği `keyboardWillShow`'dan alınıp saklanıyordu. Şunları kullanılıyordu:
   - panelin alt kenarı (`--klavye`);
   - rehberin hesabı (görünen alanla birlikte).

   Görünen alan değiştiğinde (klavye tipi, çubuk) bu yükseklik güncellenmiyordu. Görünen alana bakan kod da uygulamada bilerek kapatılmıştı (`if(KLAVYE.native) return`).

### Düzeltme

- Odak hattı **her seferinde güncel `visualViewport`'tan** (height + offsetTop) hesaplanıyor. Uygulamanın bildirdiği yükseklik yalnız görünen alan klavyeyi henüz göstermiyorsa yedek olarak kullanılıyor.
- Rehber, son hizalamada kullandığı görünen alanı saklıyor ve **her** değişimde yeniden hizalıyor. Değişim şunlardan gelebilir: resize ya da scroll olayı (klavye animasyonu boyunca art arda), klavye tipinin değişmesi, aksesuar çubuğu.
  - Büyük sıçrama: 250 ms'de.
  - Küçük adımlar (animasyonun kareleri, çubuk): aynı karede; pencere klavyeyle birlikte hareket ediyor.
- Panelin alt kenarı (`--klavye`) da görünen alana göre belirleniyor; uygulamada da öyle.
- Hat, panelin görünen alt kenarının dışına çıkmıyor.
- Capacitor'un `keyboardDidShow` olayı da dinleniyor ve son yüksekliği doğrulamak için kullanılıyor. Karar yine görünen alana göre veriliyor.

## 23.2 "Kapora aldım"a basıp İleri deyince rehber "patlıyor"

### Konsol

Hiçbir denemede konsolda hata ya da uyarı çıkmadı: kapora açık, aç-kapa-aç, alanın kendi "Tamam"ı, kademeli klavye. "Patlama" bir JavaScript hatası değil, iki ayrı sorunun görüntüsüydü.

### Sebep 1: düğmeyi tekrar kapatmak isteyen parmak "Yardımı kapat"a basıyordu

Kapora adımında hedef iki parçaydı: düğme satırı ve altında açılan tutar alanı. Düğme açılınca alan açılıyor ve klavye çıkıyordu. Klavye açıkken rehber deliği yalnız odaktaki yazı alanına daraltır (19B.4). Baloncuk de alanın hemen üstüne gelir. Bu durumda:
- baloncuk, "Kapora aldım" düğme satırının tam üstüne oturuyordu;
- baloncuğun sağ üstündeki "Yardımı kapat" düğmesi, kapora düğmesinin tam üstünde kalıyordu.

Ölçüm (iPhone 14): kapora düğmesi 322–366 × 142–168, "Yardımı kapat" 255–364 × 116–164. Düğmenin ortasındaki öğe `rhKapat` çıktı.

Kullanıcı düğmeyi kapatmak ya da yeniden açmak için dokununca rehber kapanıyordu. Üstelik Görev 20.3'teki kurala göre Yardımlı mod da tamamen kapanıyordu. Kanıt: `yeniden-uretim/kapora-anahtar-baloncuk-altinda.png`. Dokunuştan sonra rehber yok, tercih `{"acik":false}`.

Görev 22'nin konusu olan "yanlışlıkla Yardımı kapat'a bastım" durumu da büyük olasılıkla buradan çıktı.

### Sebep 2: klavye kapanıp açılırken pencere yerinde kalmıyordu

İleri'ye basınca klavye kapanır, sonraki adımda (Not) yeniden açılır. Klavye kademeli kapanıp açılırken 23.1'deki eşik sorunu yüzünden pencere hedefi izlemiyordu. Bu yüzden:
- hedef klavyenin altında kalıyordu ya da yanlış yerde görünüyordu;
- sonraki dokunuşlar yanlış yere düşüyordu.

Kademeli klavyeyle yapılan denemede akış ilk alanda bozuldu ve rezervasyon kaydedilemedi.

### Düzeltme

- **Kapora iki adım oldu.**
  - (a) "Kapora aldıysanız düğmeyi açın." Hedef yalnız düğme satırı. Düğme açılınca rehber kendiliğinden (b)'ye geçer; açılmazsa "İleri" ile (b) atlanır.
  - (b) "Alınan kapora tutarını yazın." Hedef tutar alanı. Alan odaklanır (`focus({preventScroll:true})`, düğmeye dokunuşun içinde, böylece iOS klavyeyi açar) ve alan odak hattına gelir. Tutar yazılınca "Tamam" çıkar. Alanın kendi "Tamam"ı da sonraki adıma geçirir.
  - Düğmeyi kapatmak için (b)'de "Geri" ile (a)'ya dönülür.
- **Baloncuktaki kapatma artık zararsız (Görev 22):** ✕ yalnız o anki rehberi kapatır, Yardımlı mod değişmez.
- **Genel kurallar (tüm rehberler):**
  - Hedef her karede seçiciyle yeniden bulunuyor; eski DOM referansı tutulmuyor.
  - Hedeflerin ve panelin boyu `ResizeObserver` ile izleniyor. İçerik kayınca (üstte bir alan açılıp kapandı) yeniden hizalanıyor.
  - Hedef 300 ms içinde bulunamazsa adım atlanıyor ve konsola uyarı yazılıyor. Daha önce isteğe bağlı olmayan adımda rehber kapanıyordu. Eksik adım atlanarak sona gelinirse "kaydedildi" kartı gösterilmiyor.
  - Rehberde yakalanmamış bir hata olursa rehber sessizce kapanıyor, form açık ve kullanılabilir kalıyor; hata konsola yazılıyor. Bu, döngüyü, dokunuşları ve uygulamadan gelen olayları kapsıyor.

## Denenemeyen

Gerçek iPhone. Emülasyonda klavyenin yüksekliği, animasyonu ve "Otomatik doldur" çubuğu taklit edildi. iOS'un gerçekte hangi sırayla ve kaç kez resize olayı gönderdiği gerçek cihazda görülmeli. Bu kod her sıraya göre hizalanacak şekilde yazıldı.
