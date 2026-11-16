# Görev 23 — Rehber hataları: telefon alanı klavye altında, kapora adımında çökme

_Hazırlayan: Claude (ürün yöneticisi), 16 Kasım 2026. Zeyd'in iPhone denemesi (Görev 21 sonrası). GOREV22'den sonra (ya da onunla birlikte) yap._

## Önce oku
- Netlify yok; commit + push. Testler `docs/qa/gorev23/`.
- Her iki hatayı önce **yeniden üret** (Playwright, iPhone 14 emülasyonu) ve konsol hatalarını kaydet; sebebi `docs/qa/gorev23/sebep.md`'ye yaz, sonra düzelt.

---

- [x] **23.1 HATA: Telefon alanı klavyenin altında kalıyor.** "Ad soyad"da odak hattı doğru (alan klavyenin hemen üstünde); "Telefon"da alan yarısı klavyenin altında kalacak kadar aşağı iniyor.
  - Muhtemel sebep: telefon alanında farklı klavye (sayı/telefon tuş takımı) ve iOS'un "Otomatik doldur" aksesuar çubuğu açılıyor; klavye yüksekliği değişiyor ama odak hattı önceki (harf klavyesi) yüksekliğiyle ya da aksesuar çubuğu hesaba katılmadan hesaplanıyor.
  - Düzeltme: odak hattını **her seferinde güncel `visualViewport`** (height + offsetTop) üzerinden hesapla; klavye tipi değişince ve `visualViewport` resize olayının **her** tetiklenişinde (klavye animasyonu bitene kadar art arda gelir) pencereyi ve içeriği yeniden hizala. Sabit/önbellekteki klavye yüksekliği kullanma. Capacitor'da `keyboardDidShow` yüksekliğini de doğrulama için kullan, ama karar `visualViewport`'a göre olsun.
  - Kural (21.1): klavye hangi tipte olursa olsun hedefin alt kenarı görünür alanın alt kenarının (aksesuar çubuğu dahil klavyenin üstü) 12 pt üstünde.
  - Test: ad soyad (metin), telefon (`inputmode="tel"`), kapora tutarı (`inputmode="numeric"`), not (metin) alanları için ayrı ayrı ölç; farklı klavye yükseklikleri simüle et (ör. 300, 336, 380 pt).

- [x] **23.2 HATA: "Kapora aldım"a basıp İleri deyince rehber çöküyor.** Kapora adımında düğme açılınca altında tutar alanı açılıyor; İleri'ye basınca rehber "patlıyor" (hedef kayboluyor/yanlış yere gidiyor).
  - Önce konsoldaki hatayı bul ve düzelt.
  - Kapora adımını ikiye böl: (a) "Kapora aldıysanız düğmeyi açın" → hedef düğme satırı; düğme açılınca otomatik olarak (b) adımına geç: "Alınan kapora tutarını yazın" → hedef tutar alanı, odakla (`focus({preventScroll:true})`), klavye açılır, alan odak hattına gelir. Düğme kapalı kalırsa (b) atlanır.
  - Genel kural (tüm rehberler): bir adımın hedefi DOM'da yeniden oluşturulursa ya da formun boyu değişirse (alan açılıp kapanınca), rehber hedefi her seferinde **seçiciyle yeniden bulsun** (eski DOM referansını tutmasın) ve `ResizeObserver` ile kap boyutu değişince yeniden hizalasın. Hedef bulunamazsa çökmesin: 300 ms bekleyip bir kez daha dener, yine yoksa o adımı atlar ve konsola uyarı yazar.
  - Rehber içinde yakalanmamış bir hata olursa rehber sessizce kapansın, form açık ve kullanılabilir kalsın (kullanıcı asla kilitli/bozuk ekranda kalmasın); hata konsola yazılsın.

- [x] **23.3 Test senaryoları (Playwright):** (1) rehberle tam rezervasyon: kapora düğmesi kapalı; (2) kapora düğmesi açık + tutar; (3) kapora düğmesi aç-kapa-aç; (4) telefon adımında klavye yüksekliği değişimi. Her senaryoda: konsol hatası 0, her adımda hedef–klavye mesafesi 12 ± 2 pt, rehber sonuna kadar gidiyor ve rezervasyon kaydediliyor.

---

## Bitince
1. sw.js SURUM'u artır, commit, push. **Netlify yok.**
2. `docs/PROJE_DURUMU.md`'yi güncelle.
3. Mesajının en altına kısa özet + https://zeydusht.github.io/villa-takvimim/ + "önce şunu dene: rehberle rezervasyon girerken telefonu yaz (alan klavyenin hemen üstünde olmalı), sonra Kapora aldım'ı aç ve tutarı yaz".
