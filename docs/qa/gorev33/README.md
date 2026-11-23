# Görev 33: dış satış düzeltmeleri, rezervasyon kaynağı, kanal raporu, misafirler, "Bağlamayı bize bırakın" — test raporu

_Claude Code, 23 Kasım 2026._

Veritabanı değişmedi (`VERITABANI_GOREV33.sql`'i ürün yöneticisi uyguladı). Edge Function deploy edilmedi, Netlify'a yüklenmedi.
Testler Görev 34'ün (ürün yöneticisinin buluttan gönderdiği) kodu üstünde de çalıştırıldı.

## Ürün yöneticisi için: açmadan önce

- `takvim-esitle` yeniden deploy edilmeli (33.8): "tam" turu yeni talepte yöneticilere, bağlanınca villa sahibine push gönderir
  (talep başına bir kez); deneme moduna Tatilsepeti, Kalkan Villa, Villa Paketi, Tatilkentim eklendi.

## Ortam

Playwright + sahte Supabase, sabit saat 16 Kasım 2026, sahte iCal sunucusu (Görev 32 ile aynı). Sahte `blok_rez_olustur` Görev 33
kuralıyla (ad zorunlu, kaynak sitenin kendisi); sahte `baglanti_talepleri`, `tum_talepler`, `talep_guncelle`.

## Görev 33 senaryoları

| # | Senaryo | Sonuç |
|---|---|---|
| 33.1 | Airbnb 1–5 Aralık: 1'inde akşam yarısı, 2–4 tam, 5'inde sabah yarısı; 5–8 seçilebilir; 4–6 seçilemez (6'dan geriye 4 de olmaz); 5'e dokununca yeni seçim başlar; 3'e dokununca panel; giriş günü yeni seçimin sonu olabilir; bizim çıkışımız + dış girişi aynı günde iki yarı | ✓ (390, SE) |
| 33.2 | "Misafir bilgisi ekle": hiçbir şey kaydedilmeden form; ad boş / tek harf → "Misafirin adını yazın", kırmızı alan, RPC yok; yazılanlar varken çıkış sorusu; boşken soru yok; adla → tek RPC, bağlı rezervasyon, kaynak `airbnb`, telefon ve not yazıldı | ✓ (390, SE) |
| 33.3 | Dış satıştan açılan form normal formla yan yana (SE, iPhone 15 × Normal, Büyük): düğmeler, tutarlar, ₺: **fark 0** | ✓ (`form-karsilastirma/README.md`) |
| 33.4 | Dış blokta kanal renginde kısa etiket, ilk günde sığarsa tam ad; bizim rezervasyonda köşe etiketi (direkt değilse); göstergede yalnız o ayın kanalları; detayda "Villasepeti'nden"; bakıcıda da | ✓ (390, SE, SE Büyük, bakıcı) |
| 33.5 | Varsayılan Direkt, sık kullanılan başta; dış satışta site kilitli; opsiyondan kaynak taşınır; eski rezervasyonda seçili yok, seçilir; komisyon (Airbnb 15, Booking 17,5, Villasepeti 20; %150 reddedilir); bakıcıda komisyon satırı yok | ✓ |
| 33.6 | 3 kanal + Belirtilmemiş + 1 bilgisi girilmemiş dış satış; sıralama ciroya göre; Airbnb 20.000, komisyon %15 3.000, **net 17.000**; Villasepeti %20, **net 12.000**; çubuk %37; dokununca liste → "Misafir bilgisi ekle" → kaydedince satır kalkar; Ay seçimi; Büyük yazıda üst üste binme yok; bakıcıda bölüm yok | ✓ (390, SE, SE Büyük, iPhone 15 Büyük) |
| 33.7 | "0532 111 22 33" ve "+905321112233" tek misafir (2 kez geldi); adla birleşme harf / boşluk duyarsız; arama, sıralama; detay (Ara, WhatsApp, konaklamalar, notlar); formda "Daha önce 2 kez geldi" → detay formun üstünde; rezervasyon detayında "2. gelişi"; **bakıcıda para yok**; ölçümler | ✓ (390, SE Büyük, bakıcı) |
| 33.8 | Site → iki seçim kartı (ekibe bırak üstte, önerilen; İleri seçimsiz pasif) → talep (https:// eklenir) → "Talebiniz alındı…" → satırda "Bekliyor" → yönetimde rozet 1 → talep detayı (WhatsApp, sayfa linki, not) → durum → iCal linkini ekle (deneme + dis_takvimler + baglandi) → **sahipte "Bağlandı ✓"**; "Olmadı: <not>"; yönetici olmayanda satır yok | ✓ (390, SE) |

Sunucu testleri:
- `node --no-warnings docs/qa/gorev33/talep-sunucu-testi.mjs`: **7 geçti** (yeni talep → yöneticilere bir kez, "dakika" turunda yok,
  bağlandı → sahibe bir kez, ertesi gün tekrar yok, 7 günden eski taranmaz, tablo yoksa tur hatasız, yeni yerel siteler).
- Görev 32'ninkiler: `deno-testleri.mjs` **19 geçti**, `sunucu-testi.mjs` **11 geçti**.

## Testlerin bulduğu ve düzeltilen

- Yardımlı mod açıkken "Hangi villam boş?"da rehber "Ara" adımındayken "Ne zaman" özetine dokunulamıyordu (34.1 akordeonundan sonra;
  Görev 28'in "rehber kilitlemez" kuralına aykırı). Özetler rehberin serbest alanlarına eklendi.

## Mevcut testler (son kodla, Görev 34 dahil)

| Test | Sonuç |
|---|---|
| Görev 32 (32.1–32.9) | 32.3 ekran, 32.4–32.8 akışlar hatasız; farklar Görev 33'ün bilinçli değişiklikleri (yarım gün, AB / BK etiketleri, "Misafir bilgisi ekle"nin önce formu açması, yeni yerel siteler) |
| Görev 31 (`qa31a`–`qa31k`, tur: SE / iPhone 15 × 3 yazı boyutu × hareketi azalt) | 12 durumda taşma, hata, konsol 0; hareketi azaltta kayan öğe 0. 31.8 boş hâllerde artık 3D görsel (10 / 10) |
| Görev 30 | 32 ile aynı |
| Görev 29 | fark yok (yalnız yönetimde yeni "Bağlantı talepleri" satırı) |
| Görev 28 | 60/60 · Çok büyük 60/60 · villa testi hatasız |
| Görev 27 | 86/86 |
| Görev 25 · 24 · 23 · 22 | 4/4 · klavye 32/32 + ücret kartı 3/3 · 6/6 · 21/21 |
| Görev 21 | klavye 4/4; baloncuk 12/13 ve 10/11 (Görev 31'den bilinen sapma: iPhone 14'te ücret kartı adımında baloncuk karta bitişik) |
| Görev 19 | hatasız |

Testlerin güncellenen yerleri (uygulama bilinçli değiştiği için): Görev 28 testi akordeonda takvime dönmek için "Ne zaman" özetine
dokunur ve küçük ekranda takvime kaydırır; 32.3 testi site seçiminden sonra "Linki kendim bağlayacağım" kartını ve İleri'yi seçer;
31.8 testi boş hâlde ikon ya da 3D görsel arar.

Görev 23'ün 6 durumu aynı anda iki tarayıcıyla çalışınca villa listesi geç yüklendiği için 5'i düştü; sırayla çalıştırılınca 6/6.

Bilinen, önceki görevlerden kalan: form açılır açılmaz alttaki sabit "Rezervasyonu kaydet" çubuğunun arkasında kalan alanlar
(kaydırınca görünür) taşma denetiminde "üst üste" diye geçer.

## Denenemeyen

- Gerçek push bildirimi ve takvim-esitle'nin Supabase'de çalışması (deploy edilmedi).
- Gerçek Airbnb / Booking hesabıyla iCal bağlama.
