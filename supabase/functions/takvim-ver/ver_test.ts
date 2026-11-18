// deno test supabase/functions/takvim-ver/ver_test.ts
import { anahtarAl, olaylar } from "./ver.ts";
import { icsYaz, ayristir } from "../_shared/ical.ts";
import { esit, dogru } from "../_shared/test_yardim.ts";

Deno.test("adres: yalnız <anahtar>.ics", () => {
  esit(anahtarAl("/functions/v1/takvim-ver/0a1b2c3d4e5f60718293a4b5c6d7e8f9abcd.ics"), "0a1b2c3d4e5f60718293a4b5c6d7e8f9abcd");
  esit(anahtarAl("/takvim-ver/0A1B2C3D4E5F6071.ics"), "0a1b2c3d4e5f6071");
  esit(anahtarAl("/functions/v1/takvim-ver/0a1b2c3d4e5f6071"), null);
  esit(anahtarAl("/functions/v1/takvim-ver/0a1b2c3d4e5f6071.ics.html"), null);
  esit(anahtarAl("/functions/v1/takvim-ver/../villalar.ics"), null);
  esit(anahtarAl("/functions/v1/takvim-ver/kisa.ics"), null);
});

Deno.test("çıktı: rezervasyon 'Dolu', ayırma 'Opsiyon', kalıcı UID; misafir bilgisi yok", () => {
  // veritabanı satırı ne içerirse içersin yalnız id ve tarih kullanılır
  const rez = [{ id: "11111111-1111-4111-8111-111111111111", baslangic: "2026-11-17", bitis: "2026-11-21", misafir: "Ahmet Yılmaz", telefon: "05320000000", tutar: 24000, aciklama: "kapora alındı" }];
  const tut = [{ id: "22222222-2222-4222-8222-222222222222", baslangic: "2026-12-01", bitis: "2026-12-03", kullanici: "x" }];
  const s = icsYaz(olaylar(rez, tut), new Date("2026-11-16T10:00:00Z"));
  dogru(!/Ahmet|Yılmaz|0532|24000|kapora/.test(s), "misafir bilgisi çıkmamalı");
  dogru(/UID:rez-11111111-1111-4111-8111-111111111111@villatakvim/.test(s) && /UID:tutma-22222222-2222-4222-8222-222222222222@villatakvim/.test(s), "UID");
  dogru(/SUMMARY:Dolu/.test(s) && /SUMMARY:Opsiyon/.test(s), "SUMMARY");
  esit(ayristir(s, "diger", "2026-11-16").map((b) => [b.bas, b.bit]), [["2026-11-17", "2026-11-21"], ["2026-12-01", "2026-12-03"]]);
});
