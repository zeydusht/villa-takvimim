# Açılış animasyonu — doğrulama (daire–logo buluşması, %49,5 logo, herkese açılış)

_Claude Code, 15 Kasım 2026. Uygulama: `www/acilis.js` (+ `index.html`, `veri.js`, `dil.js`; native açılış görselleri). Şartname: `docs/ACILIS_OLCUMLER.md` → "Villa Takvimim sürümü … daire–logo buluşması"._

_Ortam: Windows 11 ve Chrome. Chrome'u Playwright (`playwright-core` 1.49.1) ve Puppeteer sürdü; başsız mod, ekran kartı açık. 390×844 görünüm, iPhone kullanıcı aracısı, sahte sunucu. iPhone Safari'de ve gerçek cihazda ölçülmedi. Önceki turların ölçümleri git geçmişinde._

## Bu turda yapılanlar
1. **Logo konumu:** logonun ortası tam ekran yüksekliğinin %49,5'inde (önceden %50).
   - `assets/splash.png` ve `splash-dark.png`'de sembol 13 px yukarı kaydırıldı. 2732'lik karede ortası 1352,5'te, yani %49,506.
   - iOS ve Android açılış görselleri `npx capacitor-assets generate --ios --android` ile yeniden üretildi; aracın satır sonlarını değiştirdiği `AndroidManifest.xml` geri alındı.
   - Web logosu aynı oranda: `top: calc(50% − 13,5/2732 × max(100vw, 100vh))`.
   - Android 12+ sistem açılış ekranı simgeyi hep ekranın ortasına koyuyor. Bu yüzden `splash_sembol.png` içinde sembol 4 dp yukarı kaydırıldı (yaygın telefon boylarında ~%49,5); web'de Android logosu da 4 px yukarıda.
   - Logo boyu değişmedi.
2. **Animasyon herkes için:** girişsiz kullanıcıda da oynuyor (web'de oturum başına bir kez, uygulamada her soğuk açılışta). Perde açılınca:
   - oturum varsa ana ekran;
   - bu cihazda daha önce giriş yapılmışsa "Giriş yap";
   - hiç yapılmamışsa "Kayıt ol" (altında "Zaten hesabın var mı? Giriş yap" bağlantısı).
   - "Daha önce giriş" bilgisi cihazda tutuluyor (oturum her kaydedildiğinde işaretlenir).
3. **Daire–logo buluşması:**
   - D = logo genişliği × 1,42 (iPhone 390×844'te 167,6 px).
   - **2a:** daire logonun arkasında, konum ve çap aynı eğriyle ilerliyor. Limon halka ve gövde de aynı oranda genişliyor (gövde hiçbir an halkadan, dolayısıyla daireden dar değil).
   - **2b:** daire yerinde; çap yumuşak yayla D → D × 1,04 → D (yükseliş %35'te, sinüs²).
   - **2c:** logo ve daire tek parça yükseliyor, birlikte 1 → 0,7 küçülüyor.
   - Logo 2c'ye kadar hiç değişmiyor. Dairede ayrıca ikon yok; logonun pencereleri saydam, daire arkasına gelince pencerelerde daire görünüyor.
   - Daire ve halka en büyük boylarında çiziliyor ve hep küçültülüyor; büyütülüp bulanıklaşmıyor.
4. Yalnızca `transform` ile `opacity` kullanılıyor; tek zaman çizelgesi (önceki turlarla aynı yapı).

## 0. Logo yeri ve ilk kareler
**Web ile native açılış ekranı:**
- Web ilk karesinde logo ortası (195, 417,83) px. Bu, 390×844 ekranın %49,506'sı (piksel kutusundan ölçülen 418,0).
- iOS açılış görseli ekranı kaplayacak şekilde ölçeklendiğinde sembol ortası 1352,5 × 844 / 2732 = 417,83 px. İkisi aynı yerde.
- Üretilen `Default@3x` ve Android `splash.png` görsellerinde sembol ortası yüksekliğin %49,51'i.

**İlk 20 kare (sayfa açılmadan başlatılan kayıt):**
- Logo dışında açık piksel 0.
- Zemin ilk kareden #10180D.
- Logo ilk göründüğü karede tam parlaklıkta (232/232).
- Android görünümünde de (logo 120 px) logo dışında açık piksel 0.

## 1. Kare kare ölçüm (Playwright; animasyon durdurulup her ana gidildi)
**Ölçülen anlar:** Wise zamanıyla her 20 ms, aşama sınırları ve 2b'de her 10 ms.

**İki ayrı çekim:**
- Geometri, logo gizli.
- Yalnızca logo.

**Daire nasıl ölçüldü:** Üst yarısının kenarına çember uyduruldu. Kenar pikselleri yarım örtme oranıyla sayıldı; dışında temiz limon halka var. Böylece merkez ve çap alt piksel duyarlılıkla bulundu.

**Beklenen değerler:** Şartnameden ayrı bir Python modeliyle hesaplandı.

**En büyük sapmalar:**
- Baş tepesi 0,11, daire tepesi 0,11, gövde 0,49 puan.
- Daire çapı 0,94 px.
- Logo ortası 0,54 px, logo ölçeği 0,009.

| t (ms) | Wise t | baş tepesi % beklenen → ölçülen | daire tepesi % | daire çapı (px) | gövde genişliği % | logo ortası y (px) | logo ölçeği |
|---|---|---|---|---|---|---|---|
| 0 | 0 | 0.0 → 0.00 (+0.00) | – | – | – | 417.8 → 418.0 | 1.000 → 1.000 |
| 23 | 20 | 1.6 → 1.66 (+0.06) | – | – | – | 417.8 → 418.0 | 1.000 → 1.000 |
| 46 | 40 | 3.2 → 3.20 (-0.00) | – | – | – | 417.8 → 418.0 | 1.000 → 1.000 |
| 69 | 60 | 4.6 → 4.62 (+0.06) | – | – | – | 417.8 → 418.0 | 1.000 → 1.000 |
| 92 | 80 | 5.7 → 5.69 (+0.01) | – | – | – | 417.8 → 418.0 | 1.000 → 1.000 |
| 115 | 100 | 6.8 → 6.87 (+0.07) | – | – | – | 417.8 → 418.0 | 1.000 → 1.000 |
| 138 | 120 | 7.6 → 7.70 (+0.06) | – | – | – | 417.8 → 418.0 | 1.000 → 1.000 |
| 161 | 140 | 8.5 → 8.53 (+0.05) | – | – | – | 417.8 → 418.0 | 1.000 → 1.000 |
| 184 | 160 | 9.2 → 9.24 (+0.02) | 2.5 → 2.49 (-0.01) | – | – | 417.8 → 418.0 | 1.000 → 1.000 |
| 207 | 180 | 9.9 → 9.95 (+0.09) | 4.5 → 4.50 (+0.00) | – | – | 417.8 → 418.0 | 1.000 → 1.000 |
| 230 | 200 | 10.5 → 10.55 (+0.05) | 6.5 → 6.40 (-0.10) | – | – | 417.8 → 418.0 | 1.000 → 1.000 |
| 253 | 220 | 10.9 → 11.02 (+0.08) | 7.9 → 7.82 (-0.08) | – | – | 417.8 → 418.0 | 1.000 → 1.000 |
| 276 | 240 | 11.4 → 11.37 (-0.01) | 9.3 → 9.24 (-0.06) | – | – | 417.8 → 418.0 | 1.000 → 1.000 |
| 299 | 260 | 11.8 → 11.85 (+0.09) | 10.4 → 10.31 (-0.09) | – | – | 417.8 → 418.0 | 1.000 → 1.000 |
| 322 | 280 | 12.1 → 12.09 (+0.01) | 11.2 → 11.14 (-0.06) | – | – | 417.8 → 418.0 | 1.000 → 1.000 |
| 345 | 300 | 12.4 → 12.44 (+0.04) | 12.0 → 11.97 (-0.03) | – | 29.0 → 28.97 (-0.03) | 417.8 → 418.0 | 1.000 → 1.000 |
| 368 | 320 | 23.5 → 23.58 (+0.10) | 23.0 → 22.99 (-0.04) | 118.5 → 118.27 (-0.25) | 33.0 → 33.33 (+0.30) | 417.8 → 418.0 | 1.000 → 1.000 |
| 391 | 340 | 33.2 → 33.29 (+0.06) | 32.7 → 32.70 (-0.02) | 131.2 → 131.08 (-0.16) | 36.6 → 36.92 (+0.34) | 417.8 → 418.0 | 1.000 → 1.000 |
| 414 | 360 | 40.9 → 41.00 (+0.09) | 40.4 → 40.28 (-0.08) | 141.3 → 141.03 (-0.23) | 39.4 → 39.49 (+0.12) | 417.8 → 418.0 | 1.000 → 1.000 |
| 437 | 380 | 46.6 → 46.56 (+0.01) | 46.0 → 45.97 (-0.01) | 148.6 → 148.35 (-0.29) | 41.4 → 41.54 (+0.11) | 417.8 → 418.0 | 1.000 → 1.000 |
| 460 | 400 | 50.6 → 50.71 (+0.06) | 50.1 → 50.00 (-0.06) | 154.0 → 153.85 (-0.13) | 42.9 → 43.08 (+0.16) | 417.8 → 418.0 | 1.000 → 1.000 |
| 483 | 420 | 53.6 → 53.67 (+0.05) | 53.0 → 52.96 (-0.06) | 157.9 → 157.76 (-0.11) | 44.0 → 44.10 (+0.10) | 417.8 → 418.0 | 1.000 → 1.000 |
| 506 | 440 | 55.8 → 55.81 (-0.01) | 55.2 → 55.09 (-0.10) | 160.7 → 160.36 (-0.36) | 44.8 → 45.13 (+0.33) | 417.8 → 418.0 | 1.000 → 1.000 |
| 529 | 460 | 57.4 → 57.46 (+0.03) | 56.8 → 56.75 (-0.05) | 162.8 → 162.49 (-0.34) | 45.4 → 45.64 (+0.26) | 417.8 → 418.0 | 1.000 → 1.000 |
| 552 | 480 | 58.6 → 58.65 (+0.02) | 58.0 → 57.94 (-0.06) | 164.4 → 164.23 (-0.17) | 45.8 → 46.15 (+0.33) | 417.8 → 418.0 | 1.000 → 1.000 |
| 575 | 500 | 59.5 → 59.60 (+0.08) | 58.9 → 58.77 (-0.11) | 165.6 → 165.30 (-0.25) | 46.1 → 46.15 (+0.01) | 417.8 → 418.0 | 1.000 → 1.000 |
| 598 | 520 | 60.1 → 60.19 (+0.04) | 59.5 → 59.48 (-0.03) | 166.4 → 166.20 (-0.18) | 46.4 → 46.67 (+0.30) | 417.8 → 418.0 | 1.000 → 1.000 |
| 621 | 540 | 60.6 → 60.66 (+0.08) | 59.9 → 59.83 (-0.11) | 166.9 → 166.40 (-0.55) | 46.5 → 46.67 (+0.14) | 417.8 → 418.0 | 1.000 → 1.000 |
| 644 | 560 | 60.9 → 60.90 (+0.03) | 60.2 → 60.19 (-0.03) | 167.3 → 166.92 (-0.39) | 46.6 → 46.67 (+0.03) | 417.8 → 418.0 | 1.000 → 1.000 |
| 667 | 580 | 61.0 → 61.02 (-0.00) | 60.4 → 60.31 (-0.07) | 167.5 → 167.22 (-0.29) | 46.7 → 47.18 (+0.49) | 417.8 → 418.0 | 1.000 → 1.000 |
| 690 | 600 | 61.1 → 61.14 (+0.07) | 60.4 → 60.31 (-0.11) | 167.6 → 167.18 (-0.40) | 46.7 → 47.18 (+0.47) | 417.8 → 418.0 | 1.000 → 1.000 |
| 701.5 | 610 | 61.1 → 61.14 (+0.06) | 60.4 → 60.43 (-0.01) | 167.8 → 167.57 (-0.20) | 46.8 → 47.18 (+0.42) | 417.8 → 418.0 | 1.000 → 1.000 |
| 713 | 620 | 61.1 → 61.14 (+0.02) | 60.5 → 60.43 (-0.04) | 168.3 → 168.27 (-0.08) | 46.9 → 47.18 (+0.26) | 417.8 → 418.0 | 1.000 → 1.000 |
| 724.5 | 630 | 61.2 → 61.26 (+0.09) | 60.5 → 60.43 (-0.09) | 169.2 → 168.72 (-0.50) | 47.2 → 47.18 (+0.02) | 417.8 → 418.0 | 1.000 → 1.000 |
| 736 | 640 | 61.2 → 61.26 (+0.02) | 60.6 → 60.55 (-0.04) | 170.3 → 170.38 (+0.09) | 47.5 → 47.69 (+0.23) | 417.8 → 418.0 | 1.000 → 1.000 |
| 747.5 | 650 | 61.3 → 61.37 (+0.06) | 60.7 → 60.55 (-0.11) | 171.4 → 170.53 (-0.92) | 47.8 → 48.21 (+0.42) | 417.8 → 418.0 | 1.000 → 1.000 |
| 759 | 660 | 61.4 → 61.37 (-0.00) | 60.7 → 60.66 (-0.05) | 172.5 → 172.69 (+0.15) | 48.1 → 48.21 (+0.12) | 417.8 → 418.0 | 1.000 → 1.000 |
| 770.5 | 670 | 61.4 → 61.49 (+0.06) | 60.8 → 60.66 (-0.11) | 173.4 → 172.84 (-0.60) | 48.3 → 48.72 (+0.38) | 417.8 → 418.0 | 1.000 → 1.000 |
| 782 | 680 | 61.5 → 61.49 (+0.02) | 60.8 → 60.78 (-0.02) | 174.0 → 173.42 (-0.62) | 48.5 → 48.72 (+0.21) | 417.8 → 418.0 | 1.000 → 1.000 |
| 793.5 | 690 | 61.5 → 61.49 (+0.00) | 60.8 → 60.78 (-0.04) | 174.3 → 174.48 (+0.21) | 48.6 → 48.72 (+0.15) | 417.8 → 418.0 | 1.000 → 1.000 |
| 805 | 700 | 61.5 → 61.49 (+0.01) | 60.8 → 60.78 (-0.03) | 174.2 → 174.43 (+0.20) | 48.6 → 48.72 (+0.15) | 417.8 → 418.0 | 1.000 → 1.000 |
| 816.5 | 710 | 61.5 → 61.49 (+0.02) | 60.8 → 60.78 (-0.02) | 174.1 → 173.58 (-0.49) | 48.6 → 48.72 (+0.15) | 417.8 → 418.0 | 1.000 → 1.000 |
| 828 | 720 | 61.5 → 61.49 (+0.03) | 60.8 → 60.78 (-0.01) | 173.8 → 172.86 (-0.94) | 48.6 → 48.72 (+0.15) | 417.8 → 418.0 | 1.000 → 1.000 |
| 839.5 | 730 | 61.4 → 61.49 (+0.06) | 60.8 → 60.66 (-0.11) | 173.4 → 172.84 (-0.60) | 48.6 → 48.72 (+0.15) | 417.8 → 418.0 | 1.000 → 1.000 |
| 851 | 740 | 61.4 → 61.49 (+0.09) | 60.7 → 60.66 (-0.08) | 173.0 → 172.96 (-0.02) | 48.6 → 48.72 (+0.15) | 417.8 → 418.0 | 1.000 → 1.000 |
| 862.5 | 750 | 61.4 → 61.37 (+0.00) | 60.7 → 60.66 (-0.05) | 172.5 → 172.67 (+0.21) | 48.6 → 48.72 (+0.15) | 417.8 → 418.0 | 1.000 → 1.000 |
| 874 | 760 | 61.3 → 61.37 (+0.04) | 60.7 → 60.66 (-0.01) | 171.9 → 171.65 (-0.23) | 48.6 → 48.72 (+0.15) | 417.8 → 418.0 | 1.000 → 1.000 |
| 885.5 | 770 | 61.3 → 61.37 (+0.08) | 60.6 → 60.55 (-0.10) | 171.3 → 170.62 (-0.65) | 48.6 → 48.72 (+0.15) | 417.8 → 418.0 | 1.000 → 1.000 |
| 897 | 780 | 61.3 → 61.26 (-0.00) | 60.6 → 60.55 (-0.06) | 170.6 → 170.54 (-0.11) | 48.6 → 48.72 (+0.15) | 417.8 → 418.0 | 1.000 → 1.000 |
| 908.5 | 790 | 61.2 → 61.26 (+0.03) | 60.6 → 60.55 (-0.02) | 170.0 → 170.25 (+0.21) | 48.6 → 48.72 (+0.15) | 417.8 → 418.0 | 1.000 → 1.000 |
| 920 | 800 | 61.2 → 61.26 (+0.07) | 60.5 → 60.43 (-0.11) | 169.5 → 168.79 (-0.66) | 48.6 → 48.72 (+0.15) | 417.8 → 418.0 | 1.000 → 1.000 |
| 931.5 | 810 | 61.2 → 61.26 (+0.11) | 60.5 → 60.43 (-0.07) | 168.9 → 168.50 (-0.42) | 48.6 → 48.72 (+0.15) | 417.8 → 418.0 | 1.000 → 1.000 |
| 943 | 820 | 61.1 → 61.14 (+0.02) | 60.5 → 60.43 (-0.05) | 168.5 → 168.29 (-0.17) | 48.6 → 48.72 (+0.15) | 417.8 → 418.0 | 1.000 → 1.000 |
| 954.5 | 830 | 61.1 → 61.14 (+0.04) | 60.5 → 60.43 (-0.03) | 168.1 → 168.17 (+0.09) | 48.6 → 48.72 (+0.15) | 417.8 → 418.0 | 1.000 → 1.000 |
| 966 | 840 | 61.1 → 61.14 (+0.06) | 60.4 → 60.43 (-0.01) | 167.8 → 167.73 (-0.08) | 48.6 → 48.72 (+0.15) | 417.8 → 418.0 | 1.000 → 1.000 |
| 977.5 | 850 | 61.1 → 61.14 (+0.07) | 60.4 → 60.43 (+0.00) | 167.6 → 167.26 (-0.37) | 48.6 → 48.72 (+0.15) | 417.8 → 418.0 | 1.000 → 1.000 |
| 989 | 860 | 61.1 → 61.14 (+0.07) | 60.4 → 60.31 (-0.11) | 167.6 → 167.18 (-0.40) | 48.6 → 48.72 (+0.15) | 417.8 → 418.0 | 1.000 → 1.000 |
| 1012 | 880 | 61.1 → 61.14 (+0.03) | 60.5 → 60.43 (-0.03) | 167.5 → 167.14 (-0.39) | 48.6 → 48.72 (+0.15) | 417.5 → 417.5 | 1.000 → 1.000 |
| 1035 | 900 | 61.2 → 61.26 (+0.04) | 60.6 → 60.55 (-0.03) | 167.4 → 167.01 (-0.37) | 48.6 → 48.72 (+0.15) | 416.4 → 416.5 | 0.999 → 1.000 |
| 1058 | 920 | 61.4 → 61.49 (+0.07) | 60.8 → 60.66 (-0.11) | 167.1 → 166.58 (-0.54) | 48.6 → 48.72 (+0.15) | 414.6 → 414.5 | 0.997 → 1.000 |
| 1081 | 940 | 61.7 → 61.73 (+0.02) | 61.1 → 61.02 (-0.05) | 166.7 → 166.43 (-0.32) | 48.6 → 48.72 (+0.15) | 412.0 → 412.0 | 0.995 → 1.000 |
| 1104 | 960 | 62.1 → 62.09 (-0.00) | 61.5 → 61.37 (-0.08) | 166.3 → 166.14 (-0.12) | 48.6 → 48.72 (+0.15) | 408.5 → 409.0 | 0.992 → 0.983 |
| 1127 | 980 | 62.6 → 62.68 (+0.10) | 61.9 → 61.85 (-0.09) | 165.6 → 165.47 (-0.16) | 48.6 → 48.72 (+0.15) | 404.0 → 404.0 | 0.988 → 0.983 |
| 1150 | 1000 | 63.2 → 63.27 (+0.09) | 62.5 → 62.44 (-0.10) | 164.9 → 164.34 (-0.52) | 48.6 → 48.72 (+0.15) | 398.6 → 398.5 | 0.984 → 0.983 |
| 1173 | 1020 | 63.9 → 63.98 (+0.09) | 63.3 → 63.15 (-0.11) | 163.9 → 163.91 (-0.01) | 48.6 → 48.72 (+0.15) | 392.0 → 392.0 | 0.978 → 0.983 |
| 1196 | 1040 | 64.7 → 64.81 (+0.06) | 64.1 → 64.10 (-0.02) | 162.8 → 162.47 (-0.35) | 48.6 → 48.72 (+0.15) | 384.2 → 384.5 | 0.972 → 0.966 |
| 1219 | 1060 | 65.7 → 65.76 (+0.01) | 65.1 → 65.05 (-0.08) | 161.5 → 161.27 (-0.26) | 48.6 → 48.72 (+0.15) | 375.1 → 375.5 | 0.964 → 0.966 |
| 1242 | 1080 | 66.9 → 66.94 (+0.03) | 66.3 → 66.23 (-0.07) | 160.0 → 159.98 (-0.05) | 48.6 → 48.72 (+0.15) | 364.4 → 364.5 | 0.955 → 0.949 |
| 1265 | 1100 | 68.3 → 68.36 (+0.10) | 67.7 → 67.65 (-0.00) | 158.3 → 158.08 (-0.20) | 48.6 → 48.72 (+0.15) | 352.1 → 352.5 | 0.945 → 0.949 |
| 1288 | 1120 | 69.8 → 69.91 (+0.08) | 69.2 → 69.19 (-0.03) | 156.3 → 156.08 (-0.19) | 48.6 → 48.72 (+0.15) | 337.9 → 338.0 | 0.933 → 0.932 |
| 1311 | 1140 | 71.6 → 71.68 (+0.06) | 71.0 → 70.97 (-0.06) | 153.9 → 153.85 (-0.09) | 48.6 → 48.72 (+0.15) | 321.4 → 321.5 | 0.919 → 0.915 |
| 1334 | 1160 | 73.7 → 73.82 (+0.10) | 73.1 → 73.10 (-0.03) | 151.2 → 150.94 (-0.30) | 48.6 → 48.72 (+0.15) | 302.4 → 302.5 | 0.903 → 0.898 |
| 1357 | 1180 | 76.2 → 76.18 (+0.03) | 75.6 → 75.47 (-0.11) | 148.1 → 147.91 (-0.18) | 48.6 → 48.72 (+0.15) | 280.1 → 280.5 | 0.884 → 0.881 |
| 1380 | 1200 | 79.0 → 79.03 (+0.01) | 78.5 → 78.44 (-0.03) | 144.4 → 144.15 (-0.24) | 48.6 → 48.72 (+0.15) | 254.0 → 254.5 | 0.862 → 0.864 |
| 1403 | 1220 | 82.4 → 82.46 (+0.02) | 81.9 → 81.87 (-0.04) | 140.0 → 139.81 (-0.16) | 48.6 → 48.72 (+0.15) | 222.7 → 223.0 | 0.835 → 0.831 |
| 1426 | 1240 | 86.7 → 86.73 (+0.07) | 86.1 → 86.14 (-0.01) | 134.5 → 134.33 (-0.19) | 48.8 → 49.23 (+0.45) | 184.2 → 184.0 | 0.803 → 0.797 |
| 1449 | 1260 | 92.1 → 92.18 (+0.07) | 91.6 → 91.59 (-0.03) | 127.5 → 127.40 (-0.10) | 49.2 → 49.23 (+0.00) | 134.5 → 134.5 | 0.761 → 0.763 |
| 1472 | 1280 | – | – | – | 49.7 → 49.74 (+0.04) | – | – |
| 1495 | 1300 | – | – | – | 51.4 → 51.79 (+0.39) | – | – |
| 1518 | 1320 | – | – | – | 54.4 → 54.87 (+0.48) | – | – |
| 1541 | 1340 | – | – | – | 58.4 → 58.46 (+0.04) | – | – |
| 1564 | 1360 | – | – | – | 63.7 → 64.10 (+0.36) | – | – |
| 1587 | 1380 | – | – | – | 70.2 → 70.26 (+0.09) | – | – |
| 1610 | 1400 | – | – | – | 78.5 → 78.97 (+0.47) | – | – |
| 1633 | 1420 | – | – | – | 87.5 → 87.69 (+0.20) | – | – |
| 1656 | 1440 | – | – | – | 96.8 → 96.92 (+0.07) | – | – |
| 1664 | 1447 | – | – | – | 100.0 → 100.00 (+0.02) | – | – |

## 2. Daire–logo hizası (ölçütler)
| Ölçüt | Sınır | Ölçülen |
|---|---|---|
| 2a sonunda (690 ms) daire merkezi − logo merkezi | ≤ 1 pt | x 0,0 px, y +0,1 px |
| 2a sonunda daire çapı | D ± 2 pt (167,6 ± 2) | 167,2 px |
| 2b–2c boyunca logo merkezi − daire merkezi (kare kare, 50 an) | ± 1 pt | en çok x 0,03 px, y 0,69 px |
| 2b–2c boyunca, gerçek zamanlı kayıtta (46 kare, aynı karede ikisi birden) | ± 1 pt | en çok x 0,02 px, y 0,57 px |

Gerçek zamanlı hiza kaydında yalnızca daire ve logo görünür bırakıldı (kapsül ve gövde gizli). Daireye bütün kenarından çember uyduruldu, logo kutusunun ortası alındı. Aynı karede ölçüldüğü için ekran gecikmesinden etkilenmez.

```
kare: 46 | en büyük |dx|: 0.02 |dy|: 0.57 px
  t   699 (Wise  608): dx +0.00 dy +0.15 çap 167.4
  t   749 (Wise  651): dx +0.00 dy -0.28 çap 168.3
  t   799 (Wise  695): dx -0.00 dy -0.35 çap 172.9
  t   849 (Wise  738): dx -0.00 dy -0.23 çap 173.9
  t   899 (Wise  782): dx +0.00 dy -0.26 çap 172.0
  t   949 (Wise  825): dx +0.00 dy -0.26 çap 169.5
  t   999 (Wise  869): dx +0.00 dy -0.30 çap 167.6
  t  1049 (Wise  912): dx +0.00 dy -0.24 çap 167.4
  t  1099 (Wise  956): dx +0.01 dy -0.30 çap 166.8
  t  1149 (Wise  999): dx +0.01 dy -0.30 çap 165.8
  t  1199 (Wise 1043): dx +0.00 dy -0.47 çap 164.0
  t  1249 (Wise 1086): dx +0.00 dy -0.16 çap 161.6
  t  1299 (Wise 1130): dx +0.01 dy -0.48 çap 158.0
  t  1350 (Wise 1173): dx +0.01 dy +0.18 çap 153.3
  t  1399 (Wise 1217): dx +0.02 dy -0.42 çap 146.6
  t  1449 (Wise 1260): dx +0.02 dy -0.57 çap 137.0
```

## 3. Gerçek zamanlı 60 fps ekran kaydı (Playwright, CDP screencast; logo gizli)
- 179 satır: baş tepesi, daire tepesi, gövde. Ölçüt: ±1,5 puan ya da ±17 ms. Gecikme her kayda ayrıca uyduruldu.
- **1x, 3 kayıt:** uyduruldukça 179/179 satır geçti.
  - Uydurulan gecikme 19 / 37,5 / 38 ms; en büyük sapma 5,6 / 2,3 / 2,3 puan (bu satırlar zaman ölçütüyle geçti).
  - Ham zaman damgasıyla 10 / 63 / 63 satır ölçütün dışında (çizim hattı gecikmesi).
- **4x, 1 kayıt:** 33,3 ms düzeltmeyle 178/179 satır geçti. Bir satırda (1265 ms, baş tepesi) sapma tam −1,50 puan, zaman sapması 38,9 ms. Bu kayıtta 1266 ms'de 50 ms'lik bir kare boşluğu vardı; ölçüm iki kare arasından tahmin edildi.
- **Kare boşlukları:** Bu turdaki kayıtlarda, önceki turdan farklı olarak 33–150 ms'lik boşluklar görüldü (0–1700 ms arasında 92–100 kare).
  - Karşılaştırma için önceki sürüm de aynı anda kaydedildi: o da 80–93 kare ve 50–183 ms boşluklar verdi. Aynı gün daha önce 102 kare ve boşluksuz kaydediliyordu.
  - Yani bu ölçüm sırasında makinenin durumu kayıtları bozuyordu. Boşlukların bir kısmı kayıt aracının kendi yükü olabilir.
- **Solma:** 1683,6 ms'de başlıyor.

## 4. Kare düşmesi (Chrome DevTools performans izi, Puppeteer, 390×844, 3x piksel yoğunluğu)
**Sayım yöntemi (önceki turlarla aynı):**
- Her ekran yenilemesinde sayfadan yeni kare gelip gelmediğine bakıldı.
- Ekranın hiç çizmediği yenilemeler (iki çizim arası > 1,5 yenileme) düşme sayıldı.

**Pencereler:** hareket 1000–2664 ms, bekleme + solma 2664–2952 ms (sayfa zamanı, logo dahil).

**Karşılaştırma yöntemi:** Makinenin durumu ölçüm boyunca değiştiği için en sağlıklı karşılaştırma dönüşümlüydü. Yeni sürüm ve önceki sürüm (88dd5b8, ayrı sunucuda) sırayla, her denemede bir yeni bir eski koşturuldu.

| CPU | Sürüm | deneme | hareket boyunca düşen kare | solma |
|---|---|---|---|---|
| 1x | yeni | 8 | 4 denemede sıfır; 4 denemede toplam 5 kare (hepsi 2532 ms'de, birinde ayrıca 1249) | 0 |
| 1x | önceki | 8 | 0 (8/8) | 0 |
| 4x | yeni | 5 | 2 denemede sıfır; 3 denemede 2'şer kare (1516 ve 2532 ms) | 0 |
| 4x | önceki | 5 | 2 denemede sıfır; 3 denemede 3–9 kare (rastgele yerlerde) | 1 |

**Dönüşümlü olmayan seriler** (makine durumu değişirken; yalnız fikir verir):
- Yeni sürüm 1x: 12 denemede 17 kare; 8 denemede 9 kare.
- Önceki sürüm 1x: 12 denemede 4 kare.

**Nedeni (izden):**
- Düşen kareler sabit iki ana denk geliyor: sayfa zamanı ~1516 ve ~2532 ms, yani animasyon başladıktan 500 ve 1500 ms sonra.
- O anlarda tarayıcının GPU sürecinde tek bir çizim (`FinishPaintRenderPass`) 14–40 ms sürüyor; içinde başka iş görünmüyor, sürücü düzeyinde bekleme.
- Sayfanın ana iş parçacığı o anlarda boş, yeniden çizim (raster) yok. Sayfanın kompozitörü her kareyi 0,3–0,5 ms'de üretiyor.
- Aynı saniyelik beklemeler önceki sürümde de var. Önceki sürümde 2532 civarındaki bekleme çoğunlukla 6–10 ms (bazen 24–29), yenide 23–40 ms; bu yüzden yenide bir yenileme kaçıyor.

**Denenenler, hiçbiri beklemeyi kaldırmadı:**
- limon kapsülü daha kısa çizmek;
- daire/kapsül ölçeklemesini kapatmak;
- logo ölçeklemesini kapatmak;
- ekrandan çıkan başı saydam yapmak;
- logodaki gereksiz `z-index`'i kaldırmak.

Kısa kapsül kaldı, `z-index` kaldırıldı; diğerleri geri alındı.

**Sonuç:** "Kare düşmesi olmasın" ölçütü bu ortamda TAM karşılanmadı. Yeni sürüm 1x'te denemelerin yarısında, animasyonun aynı anında 1 kare (16 ms) kaçırıyor. 4x'te önceki sürümden daha az kare düştü. Bu bekleme, Windows'ta başsız Chrome'un GPU sürecine özgü olabilir; iPhone'da ayrıca bakılmalı.

## 5. Giriş / kayıt ekranı
| Durum | Perde oynadı mı | Perde açılınca |
|---|---|---|
| Bu cihazda hiç giriş yapılmamış | evet | "Kayıt ol" görünümü: ad soyad + gizlilik onayı, düğme "Hesap oluştur", altında "Zaten hesabın var mı? Giriş yap" bağlantısı. "Hesabım yok" düğmesi ve "Şifremi unuttum" gizli |
| Daha önce giriş yapılmış, oturum yok | evet | "Giriş yap" görünümü: "Hesabım yok, oluştur" ve "Şifremi unuttum" görünür |
| Oturum var | evet | ana ekran (değişmedi) |

- Bağlantıya dokununca "Giriş yap" görünümüne geçiliyor.
- Bağlantı yazısı normal kalınlıkta.
- İngilizcesi `dil.js`'te: "Already have an account? Sign in".
- Açılış bitince `theme-color` #0B5B57, sayfa zemini beyaz.

## 6. Diğer kontroller
- **Dokununca:** perde anında kalkıyor.
- **Hareketi azalt:** logo ~400 ms, sonra 200 ms solma.
- **Yavaş veri (6 sn):** desen 300 ms bekliyor, iskelet ekran geliyor, veri gelince liste yerini alıyor.
- **Eski testler geçti:** kilit/Face ID, giriş (davetli giriş dahil), hap, yenileme, detay, ipucu.

## Bilinen sınırlar
- iPhone Safari'de ve gerçek cihazda ölçülmedi.
- Android 12+ sistem açılış ekranında sembol ekran boyundan bağımsız olarak ortanın 4 dp üstünde. Ekran boyu çok farklı telefonlarda %49,5'ten birkaç onda bir puan sapabilir; web logosu aynı 4 px ile eşlendiği için ikisi yine üst üste.
- Daha önce hiç giriş yapmamış görünen ama bu güncellemeden önce çıkış yapmış kullanıcılar, ilk açılışta "Kayıt ol" görünümünü görür ("daha önce giriş" işareti bu sürümle başladı); tek dokunuşla "Giriş yap"a geçerler.
