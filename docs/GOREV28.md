# Görev 28 — Müsaitlik arama düzeltmeleri

_Hazırlayan: Claude (ürün yöneticisi), 17 Kasım 2026. Zeyd'in Görev 27 denemesi: "Güzel çalışıyor ama iki sorun var."_

## Önce oku
- Netlify yok; commit + push. Testler `docs/qa/gorev28/`.

---

- [x] **28.1 Ana ekrandaki arama butonu kalksın.** Villalarım başlık satırına eklenen `search` butonu (Görev 27.5) başlık satırını bozdu (öğeler sağa sola kaymış). Bu butonu kaldır; başlık satırı Görev 18.15'teki hâline dönsün ("Villalarım" + sağda dolu/boş etiketleri, altında "+ Villa ekle"). Müsaitlik arama **sadece Takvim sekmesinin en üstünde** kalsın (orada çok iyi duruyor). 360/390/430'da başlık satırının ekran görüntüsünü al, taşma/kayma olmadığını doğrula.

- [x] **28.2 HATA: Rehber açıkken eski seçim takılı kalıyor.** Senaryo: Müsaitlik aramayı rehberle (Yardımlı mod) bir kez yap → ana ekrana git → tekrar Takvim → "Hangi villam boş?" → önceki tarihler hâlâ seçili; rehber "giriş gününe dokunun" adımında; günlere dokununca seçim değişmiyor, panel açılmıyor, ekran takılıyor.
  - Önce yeniden üret ve sebebini `docs/qa/gorev28/sebep.md`'ye yaz (muhtemelen: seçim durumu panel kapanınca sıfırlanmıyor; rehber "başlangıç seçildi" olayını beklerken mevcut aralık seçili olduğu için 18.1 kuralı ilk dokunuşta seçimi temizliyor ve olay hiç gelmiyor — rehber ile seçim durumu çakışıyor).
  - Düzeltme:
    1. Müsaitlik arama paneli her **açılışta temiz başlasın**: seçim boş, kişi sayısı varsayılan. (İsteğe bağlı küçük kolaylık: altta "Son arama: 17–21 Kasım · tekrar ara" bağlantısı; dokununca o tarihler seçili gelir ve doğrudan sonuçlar açılır. Rehber bu bağlantıyı vurgulamaz.)
    2. Rehber adımları seçim durumuna göre başlasın: seçim yoksa "giriş gününe dokunun"; sadece başlangıç varsa "çıkış gününe dokunun"; aralık varsa doğrudan "Boş villaları göster"e geçsin. Rehber hiçbir durumda dokunuşları yutup kullanıcıyı kilitlememeli.
    3. Rehberin beklediği olay gelmese de kullanıcı her zaman günleri değiştirebilmeli; seçim değiştikçe rehber metni güncel duruma göre kendini ayarlasın ("Giriş: 17 Kasım · şimdi çıkış gününe dokunun").
    4. Aynı kontrolü villa ekranındaki takvim seçimi + rehber için de yap (aynı hata orada da olabilir).
  - Test: rehberli arama → panel kapat → ana ekran → Takvim → tekrar aç: seçim boş, rehber 1. adımda, günler seçilebiliyor; iki kez üst üste farklı tarihlerle arama; rehber ortasında ✕ ile kapatıp tekrar açma.

---

## Bitince
1. sw.js SURUM'u artır, commit, push. **Netlify yok.**
2. `docs/PROJE_DURUMU.md`'yi güncelle.
3. Mesajının en altına kısa özet + https://zeydusht.github.io/villa-takvimim/ + "önce şunu dene: rehberle bir arama yap, ana ekrana dön, Takvim → Hangi villam boş?'u tekrar aç; seçim boş gelmeli ve günler seçilebilmeli".
