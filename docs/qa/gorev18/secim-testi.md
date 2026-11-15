# Görev 18.1–18.3 — tarih seçimi testi

_Claude Code, 2026-11-15. Playwright (Chrome, başsız), sahte sunucu, saat 16 Kasım 2026 10:00 (Türkiye). Uygulama: 390×844 ve 360×740; misafir sayfası (g.html): 390×844._

**Sonuç: 40 / 40 senaryo geçti.**

Kural: hiçbir şey seçili değilken dokunulan gün başlangıç; sadece başlangıç S varken Y > S aralık (arada dolu gece varsa Y yeni başlangıç + "Bu tarihler arasında dolu gün var."), Y < S yeni başlangıç, Y = S seçim kalkar; aralık seçiliyken herhangi bir dokunuş seçimi kaldırır (yeni seçim başlamaz).

Uygulamadaki dolu geceler: 20–23 Kasım (Hasan Demir), 25–27 Kasım (Ayşe Yılmaz). Misafir sayfasında: 11–12 Aralık dolu, 10 Aralık akşamı ve 13 Aralık sabahı dolu.

| # | Yer | Senaryo | Dokunuşlar | Beklenen | Sonuç | |
|---|---|---|---|---|---|---|
| 1 | uygulama | Örnek sıra: 28. güne dokun | 28 → {"bas":"12-28","aralik":null} | `{"bas":"12-28","aralik":null}` | `{"bas":"12-28","aralik":null}` | geçti |
| 2 | uygulama | Örnek sıra: 23. güne dokun | 28 → {"bas":"12-28","aralik":null} / 23 → {"bas":"12-23","aralik":null} | `{"bas":"12-23","aralik":null}` | `{"bas":"12-23","aralik":null}` | geçti |
| 3 | uygulama | Örnek sıra: 21. güne dokun | 28 → {"bas":"12-28","aralik":null} / 23 → {"bas":"12-23","aralik":null} / 21 → {"bas":"12-21","aralik":null} | `{"bas":"12-21","aralik":null}` | `{"bas":"12-21","aralik":null}` | geçti |
| 4 | uygulama | Örnek sıra: 27. güne dokun | 28 → {"bas":"12-28","aralik":null} / 23 → {"bas":"12-23","aralik":null} / 21 → {"bas":"12-21","aralik":null} / 27 → {"bas":null,"aralik":"12-21–12-27"} | `{"bas":null,"aralik":"12-21–12-27"}` | `{"bas":null,"aralik":"12-21–12-27"}` | geçti |
| 5 | uygulama | Örnek sıra: 13. güne dokun | 28 → {"bas":"12-28","aralik":null} / 23 → {"bas":"12-23","aralik":null} / 21 → {"bas":"12-21","aralik":null} / 27 → {"bas":null,"aralik":"12-21–12-27"} / 13 → {"bas":null,"aralik":null} | `{"bas":null,"aralik":null}` | `{"bas":null,"aralik":null}` | geçti |
| 6 | uygulama | Başlangıca tekrar dokun (Y = S) | 10 → 10 | `{"bas":null,"aralik":null}` | `{"bas":null,"aralik":null}` | geçti |
| 7 | uygulama | Başlangıçtan önceki güne dokun (Y < S) | 15 → 12 | `{"bas":"12-12","aralik":null}` | `{"bas":"12-12","aralik":null}` | geçti |
| 8 | uygulama | Aralık seçiliyken içindeki güne dokun | 5 → 9 → 7 | `{"bas":null,"aralik":null}` | `{"bas":null,"aralik":null}` | geçti |
| 9 | uygulama | Temizlendikten sonraki dokunuş yeni başlangıç | (boş) → 12 | `{"bas":"12-12","aralik":null}` | `{"bas":"12-12","aralik":null}` | geçti |
| 10 | uygulama | Aralık seçiliyken başlangıç gününe dokun | 5 → 9 → 5 | `{"bas":null,"aralik":null}` | `{"bas":null,"aralik":null}` | geçti |
| 11 | uygulama | Aralık seçiliyken çıkış gününe dokun | 5 → 9 → 9 | `{"bas":null,"aralik":null}` | `{"bas":null,"aralik":null}` | geçti |
| 12 | uygulama | Aralık seçiliyken dışarıdaki güne dokun (yeni seçim başlamaz) | 5 → 9 → 20 | `{"bas":null,"aralik":null}` | `{"bas":null,"aralik":null}` | geçti |
| 13 | uygulama | Arada dolu gece var: Y yeni başlangıç + uyarı | 18 → 24 (20–23 dolu) | `{"bas":"11-24","aralik":null,"uyari":true}` | `{"bas":"11-24","aralik":null,"uyari":true}` | geçti |
| 14 | uygulama | Dolu güne (akşamı dolu) çıkış denemesi: başlangıç kalır + uyarı | 18 → 21 | `{"bas":"11-18","aralik":null,"uyari":true}` | `{"bas":"11-18","aralik":null,"uyari":true}` | geçti |
| 15 | uygulama | Çıkış günü başkasının giriş günü olabilir | 18 → 20 | `{"bas":null,"aralik":"11-18–11-20"}` | `{"bas":null,"aralik":"11-18–11-20"}` | geçti |
| 16 | uygulama | Başkasının çıkış gününden giriş gününe | 23 → 25 | `{"bas":null,"aralik":"11-23–11-25"}` | `{"bas":null,"aralik":"11-23–11-25"}` | geçti |
| 17 | uygulama | Seçim yokken dolu güne dokun: rezervasyon açılır | 21 | `{"detay":"Hasan Demir","secim":{"bas":null,"aralik":null}}` | `{"detay":"Hasan Demir","secim":{"bas":null,"aralik":null}}` | geçti |
| 18 | uygulama 390 | Panel (başlangıç) | 24 | `"Giriş: 24 Aralık Şimdi çıkış gününe dokunun"` | `"Giriş: 24 Aralık Şimdi çıkış gününe dokunun"` | geçti |
| 19 | uygulama 390 | Panel (aralık) | 24 → 27 | `true` | `true` | geçti |
| 20 | uygulama 390 | 3 buton eşit genişlik, yazı tek satır, taşma yok | [{"w":114,"tasma":false,"tek":true},{"w":114,"tasma":false,"tek":true},{"w":114,"tasma":false,"tek":true}] | `true` | `true` | geçti |
| 21 | uygulama 390 | En alta kaydırınca takvimin son satırı panelin üstünde kalıyor |  | `true` | `true` | geçti |
| 22 | uygulama 390 | Ekran denetimi (taşma / kesik / üst üste) |  | `[]` | `[]` | geçti |
| 23 | uygulama 390 | Rezervasyon butonu formu bu tarihlerle açar |  | `true` | `true` | geçti |
| 24 | uygulama 390 | Form açılınca seçim paneli kapanır |  | `true` | `true` | geçti |
| 25 | uygulama 360 | Panel (başlangıç) | 24 | `"Giriş: 24 Aralık Şimdi çıkış gününe dokunun"` | `"Giriş: 24 Aralık Şimdi çıkış gününe dokunun"` | geçti |
| 26 | uygulama 360 | Panel (aralık) | 24 → 27 | `true` | `true` | geçti |
| 27 | uygulama 360 | 3 buton eşit genişlik, yazı tek satır, taşma yok | [{"w":104,"tasma":false,"tek":true},{"w":104,"tasma":false,"tek":true},{"w":104,"tasma":false,"tek":true}] | `true` | `true` | geçti |
| 28 | uygulama 360 | En alta kaydırınca takvimin son satırı panelin üstünde kalıyor |  | `true` | `true` | geçti |
| 29 | uygulama 360 | Ekran denetimi (taşma / kesik / üst üste) |  | `[]` | `[]` | geçti |
| 30 | uygulama 360 | Rezervasyon butonu formu bu tarihlerle açar |  | `true` | `true` | geçti |
| 31 | uygulama 360 | Form açılınca seçim paneli kapanır |  | `true` | `true` | geçti |
| 32 | misafir sayfası | Örnek sıra: 28. güne dokun | 28 → [12-28] | `"12-28"` | `"12-28"` | geçti |
| 33 | misafir sayfası | Örnek sıra: 23. güne dokun | 28 → [12-28] / 23 → [12-23] | `"12-23"` | `"12-23"` | geçti |
| 34 | misafir sayfası | Örnek sıra: 21. güne dokun | 28 → [12-28] / 23 → [12-23] / 21 → [12-21] | `"12-21"` | `"12-21"` | geçti |
| 35 | misafir sayfası | Örnek sıra: 27. güne dokun | 28 → [12-28] / 23 → [12-23] / 21 → [12-21] / 27 → [12-21,12-27] | `"12-21,12-27"` | `"12-21,12-27"` | geçti |
| 36 | misafir sayfası | Örnek sıra: 15. güne dokun | 28 → [12-28] / 23 → [12-23] / 21 → [12-21] / 27 → [12-21,12-27] / 15 → [] | `""` | `""` | geçti |
| 37 | misafir sayfası | Başlangıca tekrar dokun (Y = S) | 5 → 5 | `""` | `""` | geçti |
| 38 | misafir sayfası | Aralık seçiliyken dışarıya dokun (yeni seçim başlamaz) | 5 → 8 → 20 | `""` | `""` | geçti |
| 39 | misafir sayfası | Arada dolu gece var: Y yeni başlangıç + uyarı | 8 → 15 (11–12 dolu) | `{"sec":"12-15","uyari":true}` | `{"sec":"12-15","uyari":true}` | geçti |
| 40 | misafir sayfası | Çıkış günü başkasının giriş günü olabilir | 8 → 10 | `"12-08,12-10"` | `"12-08,12-10"` | geçti |
