// deno test --allow-read supabase/functions/takvim-esitle/ical_test.ts
import { ayristir, satirlariAc, satirAyir, tarihOku, turBelirle, doluGunSay, icsYaz, metinCoz } from "../_shared/ical.ts";
import { esit, dogru } from "../_shared/test_yardim.ts";

const BUGUN = "2026-11-16";
const oku = (ad: string) => Deno.readTextFile(new URL("./ornekler/" + ad, import.meta.url));

Deno.test("satır katlaması açılır, CRLF ve LF", () => {
  esit(satirlariAc("A:1\r\nDESCRIPTION:abc\r\n def\r\n\tghi\r\nB:2"), ["A:1", "DESCRIPTION:abcdefghi", "B:2"]);
  esit(satirlariAc("A:1\nB:x\n y"), ["A:1", "B:xy"]);
});

Deno.test("satır ayırma: parametre, değerde iki nokta, tırnaklı parametre", () => {
  esit(satirAyir("DTSTART;VALUE=DATE:20261117"), { ad: "DTSTART", param: { VALUE: "DATE" }, deger: "20261117" });
  esit(satirAyir("DESCRIPTION:Reservation URL: https://x.com/a"), { ad: "DESCRIPTION", param: {}, deger: "Reservation URL: https://x.com/a" });
  esit(satirAyir('DTSTART;TZID="Europe/Istanbul:x":20261117T140000')!.deger, "20261117T140000");
  esit(metinCoz("a\\, b\\; c\\nd\\\\e"), "a, b; c\nd\\e");
});

Deno.test("tarih ve tarih-saat okunur (UTC → Türkiye günü)", () => {
  esit(tarihOku("20261117"), "2026-11-17");
  esit(tarihOku("20261117T140000"), "2026-11-17");
  esit(tarihOku("20261231T220000Z"), "2027-01-01");
  esit(tarihOku("20261231T200000Z"), "2026-12-31");
  esit(tarihOku("2026-11-17"), null);
  esit(tarihOku("20261340"), null);
});

Deno.test("tür belirleme tablosu", () => {
  esit(turBelirle("airbnb", "Reserved", "Reservation URL: …"), "rezervasyon");
  esit(turBelirle("airbnb", "Airbnb (Not available)", ""), "kapali");
  esit(turBelirle("airbnb", "Not available", ""), "kapali");
  esit(turBelirle("airbnb", "BLOCKED", ""), "kapali");
  esit(turBelirle("airbnb", "", ""), "bilinmiyor");
  esit(turBelirle("booking", "CLOSED - Not available", ""), "bilinmiyor");
  esit(turBelirle("vrbo", "Reserved - Ayse Y", ""), "rezervasyon");
  esit(turBelirle("vrbo", "Booked", ""), "rezervasyon");
  esit(turBelirle("vrbo", "Blocked", ""), "kapali");
  esit(turBelirle("villasepeti", "Reserved", ""), "bilinmiyor");
  esit(turBelirle("diger", "Dolu", ""), "bilinmiyor");
});

Deno.test("Airbnb örneği: satış, kapalı; geçmiş atlanır; misafir bilgisi yok", async () => {
  const b = ayristir(await oku("airbnb.ics"), "airbnb", BUGUN);
  esit(b.map((x) => [x.bas, x.bit, x.tur]), [["2026-11-17", "2026-11-21", "rezervasyon"], ["2026-12-02", "2026-12-06", "rezervasyon"], ["2026-12-24", "2026-12-26", "kapali"]]);
  const j = JSON.stringify(b);
  dogru(!/1234|5678|Reserv|HMABC|Phone/i.test(j), "misafir / açıklama bilgisi saklanmamalı: " + j);
  esit(Object.keys(b[0]).sort(), ["bas", "bit", "tur", "uid"]);
});

Deno.test("Booking örneği: hepsi bilinmiyor", async () => {
  const b = ayristir(await oku("booking.ics"), "booking", BUGUN);
  esit(b.map((x) => [x.bas, x.bit, x.tur]), [["2026-11-25", "2026-11-28", "bilinmiyor"], ["2027-01-05", "2027-01-10", "bilinmiyor"]]);
});

Deno.test("Vrbo örneği: Reserved ve Blocked", async () => {
  const b = ayristir(await oku("vrbo.ics"), "vrbo", BUGUN);
  esit(b.map((x) => [x.bas, x.bit, x.tur]), [["2026-12-10", "2026-12-14", "rezervasyon"], ["2026-12-18", "2026-12-20", "kapali"]]);
  dogru(!/Ayse/.test(JSON.stringify(b)), "misafir adı saklanmamalı");
});

Deno.test("Diğer site: tarih-saat, DTEND yok (1 gün), iptal atlanır, ad/telefon/tutar yok", async () => {
  const b = ayristir(await oku("diger.ics"), "diger", BUGUN);
  esit(b.map((x) => [x.bas, x.bit, x.tur]), [["2026-11-29", "2026-12-03", "bilinmiyor"], ["2026-12-19", "2026-12-20", "bilinmiyor"]]);
  dogru(!/Mehmet|0532|24\.000|Kaya/.test(JSON.stringify(b)), "kişisel bilgi saklanmamalı");
});

Deno.test("2 yıldan uzak ve dünden önce biten bloklar atlanır; UID yoksa tarihten", () => {
  const ics = "BEGIN:VCALENDAR\nBEGIN:VEVENT\nDTSTART;VALUE=DATE:20290101\nDTEND;VALUE=DATE:20290103\nUID:u1\nEND:VEVENT\n" +
    "BEGIN:VEVENT\nDTSTART;VALUE=DATE:20261110\nDTEND;VALUE=DATE:20261114\nUID:u2\nEND:VEVENT\n" +
    "BEGIN:VEVENT\nDTSTART;VALUE=DATE:20261113\nDTEND;VALUE=DATE:20261116\nUID:u3\nEND:VEVENT\n" +
    "BEGIN:VEVENT\nDTSTART;VALUE=DATE:20261201\nDTEND;VALUE=DATE:20261201\nEND:VEVENT\nEND:VCALENDAR";
  esit(ayristir(ics, "diger", BUGUN).map((x) => [x.uid, x.bas, x.bit]), [["u3", "2026-11-13", "2026-11-16"], ["tarih-2026-12-01-2026-12-02", "2026-12-01", "2026-12-02"]]);
});

Deno.test("dolu gün sayısı (üst üste binen bloklar bir kez)", () => {
  esit(doluGunSay([{ uid: "a", bas: "2026-11-17", bit: "2026-11-21", tur: "rezervasyon" }, { uid: "b", bas: "2026-11-20", bit: "2026-11-22", tur: "kapali" }],
    "2026-11-16", "2027-11-16"), 5);
});

Deno.test("takvim-ver çıktısı: geçerli iCal, yalnız tarih ve 'Dolu' / 'Opsiyon'", () => {
  const s = icsYaz([{ uid: "rez-11111111-1111-4111-8111-111111111111@villatakvim", bas: "2026-11-17", bit: "2026-11-21", ozet: "Dolu" },
    { uid: "tutma-22222222-2222-4222-8222-222222222222@villatakvim", bas: "2026-12-01", bit: "2026-12-03", ozet: "Opsiyon" }], new Date("2026-11-16T10:00:00Z"));
  dogru(s.startsWith("BEGIN:VCALENDAR\r\nVERSION:2.0\r\n") && s.endsWith("END:VCALENDAR\r\n"), "çerçeve");
  dogru(s.split("\r\n").every((l) => new TextEncoder().encode(l).length <= 75), "satır uzunluğu ≤ 75");
  const geri = ayristir(s, "diger", "2026-11-16");
  esit(geri.map((x) => [x.bas, x.bit]), [["2026-11-17", "2026-11-21"], ["2026-12-01", "2026-12-03"]]);
  dogru(/SUMMARY:Dolu/.test(s) && /SUMMARY:Opsiyon/.test(s) && /DTSTART;VALUE=DATE:20261117/.test(s), "içerik");
});
