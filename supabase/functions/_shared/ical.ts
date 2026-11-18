// Villa Takvimim — iCal okuma / yazma (Görev 32)
//
// Tarih kuralı (veritabanıyla aynı): bas = giriş günü, bit = çıkış günü (o gece dahil değil). iCal DTEND ile aynı.
// KVKK: misafir adı, telefon, SUMMARY ya da DESCRIPTION metni SAKLANMAZ. Bu dosyadan yalnız tarih, tür ve UID çıkar.
// Saf TypeScript (Deno ve Node'da aynı çalışır; birim testleri: takvim-esitle/ical_test.ts).

export type Tur = "rezervasyon" | "kapali" | "bilinmiyor";
export type Kaynak = "airbnb" | "booking" | "vrbo" | "villasepeti" | "diger";
export interface Blok { uid: string; bas: string; bit: string; tur: Tur }

// Satır katlamasını aç: devam satırı boşluk ya da sekmeyle başlar (RFC 5545 3.1)
export function satirlariAc(metin: string): string[] {
  return String(metin || "")
    .replace(/^﻿/, "")
    .replace(/\r\n[ \t]/g, "").replace(/\n[ \t]/g, "")
    .split(/\r?\n/)
    .map((s) => s.replace(/\r$/, ""))
    .filter((s) => s.length > 0);
}

// "DTSTART;VALUE=DATE:20240405" → { ad:"DTSTART", param:{VALUE:"DATE"}, deger:"20240405" }
// Değer ":" içerebilir (adresler); parametre değeri tırnak içinde ":" içerebilir.
export function satirAyir(satir: string): { ad: string; param: Record<string, string>; deger: string } | null {
  let tirnak = false, i = 0;
  for (; i < satir.length; i++) {
    const c = satir[i];
    if (c === '"') tirnak = !tirnak;
    else if (c === ":" && !tirnak) break;
  }
  if (i >= satir.length) return null;
  const sol = satir.slice(0, i), deger = satir.slice(i + 1);
  const parca = sol.split(";");
  const param: Record<string, string> = {};
  for (const p of parca.slice(1)) {
    const e = p.indexOf("=");
    if (e > 0) param[p.slice(0, e).toUpperCase()] = p.slice(e + 1).replace(/^"|"$/g, "");
  }
  return { ad: parca[0].toUpperCase(), param, deger };
}

// Metin değerindeki kaçışları çöz (\n, \, , \; , \\)
export function metinCoz(v: string): string {
  return String(v || "").replace(/\\([nN,;\\])/g, (_m, c) => (c === "n" || c === "N" ? "\n" : c));
}

function ikiHane(n: number): string { return n < 10 ? "0" + n : String(n); }
function gunYaz(d: Date): string { return d.getUTCFullYear() + "-" + ikiHane(d.getUTCMonth() + 1) + "-" + ikiHane(d.getUTCDate()); }
export function gunEkle(gun: string, n: number): string {
  const d = new Date(gun + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return gunYaz(d);
}

// Tarih ya da tarih-saat → "YYYY-MM-DD".
//  · 20240405                       → 2024-04-05
//  · 20240405T140000                → 2024-04-05 (yerel saat; tarih kısmı)
//  · 20240405T220000Z               → Türkiye saatine (UTC+3) göre gün: 2024-04-06
//  · TZID=…;20240405T140000         → tarih kısmı
export function tarihOku(deger: string): string | null {
  const m = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?$/.exec(String(deger || "").trim());
  if (!m) return null;
  const y = +m[1], ay = +m[2], g = +m[3];
  if (ay < 1 || ay > 12 || g < 1 || g > 31) return null;
  if (m[4] && m[7]) {
    const t = Date.UTC(y, ay - 1, g, +m[4], +m[5], +(m[6] || 0)) + 3 * 3600 * 1000;   // Türkiye: UTC+3 (yaz saati yok)
    return gunYaz(new Date(t));
  }
  return m[1] + "-" + m[2] + "-" + m[3];
}

// Tür belirleme (SUMMARY ve DESCRIPTION, büyük/küçük harf duyarsız)
//  Airbnb  "Reserved" → rezervasyon · "Not available" / "Blocked" → kapali
//  Booking "CLOSED - Not available" → bilinmiyor (satış mı kapatma mı ayırt etmez; satış gibi davranılır)
//  Vrbo    "Reserved", "Booked" → rezervasyon · "Blocked" → kapali
//  Diğer   → bilinmiyor
export function turBelirle(kaynak: string, ozet: string, aciklama: string): Tur {
  const s = String(ozet || "").toLowerCase(), a = String(aciklama || "").toLowerCase(), h = s + "\n" + a;
  if (kaynak === "airbnb") {
    if (/not available|blocked/.test(s)) return "kapali";
    if (/reserved/.test(s)) return "rezervasyon";
    if (/not available|blocked/.test(a)) return "kapali";
    if (/reserved|reservation url/.test(a)) return "rezervasyon";
    return "bilinmiyor";
  }
  if (kaynak === "vrbo") {
    if (/reserved|booked/.test(h)) return "rezervasyon";
    if (/blocked/.test(h)) return "kapali";
    return "bilinmiyor";
  }
  return "bilinmiyor";   // booking, villasepeti, diger
}

// Kısa kimlik (UID yoksa): tarih aralığından
function sabitUid(bas: string, bit: string): string { return "tarih-" + bas + "-" + bit; }

// iCal metni → bloklar. bugun "YYYY-MM-DD".
// Geçmişte kalan (bitiş < bugün − 1) ve 2 yıldan uzak bloklar atlanır. İptal edilmiş (STATUS:CANCELLED) olaylar atlanır.
// DTEND yoksa 1 gün sayılır; DTEND ≤ DTSTART ise de 1 gün.
export function ayristir(metin: string, kaynak: string, bugun: string): Blok[] {
  const satirlar = satirlariAc(metin);
  const sonuc: Blok[] = [];
  const enEski = gunEkle(bugun, -1), enUzak = gunEkle(bugun, 731);
  let ev: Record<string, { param: Record<string, string>; deger: string }> | null = null;
  for (const s of satirlar) {
    const u = s.toUpperCase();
    if (u === "BEGIN:VEVENT") { ev = {}; continue; }
    if (u === "END:VEVENT") {
      if (ev) {
        const b = olaydanBlok(ev, kaynak);
        if (b && b.bit >= enEski && b.bas <= enUzak) sonuc.push(b);
      }
      ev = null; continue;
    }
    if (!ev) continue;
    const p = satirAyir(s);
    if (p && !(p.ad in ev)) ev[p.ad] = { param: p.param, deger: p.deger };
  }
  // aynı UID + aynı başlangıç iki kez gelirse bir kez say
  const gor = new Set<string>();
  return sonuc.filter((b) => { const k = b.uid + "|" + b.bas; if (gor.has(k)) return false; gor.add(k); return true; });
}

function olaydanBlok(ev: Record<string, { param: Record<string, string>; deger: string }>, kaynak: string): Blok | null {
  if (ev.STATUS && /cancel/i.test(ev.STATUS.deger)) return null;
  const bas = ev.DTSTART ? tarihOku(ev.DTSTART.deger) : null;
  if (!bas) return null;
  let bit = ev.DTEND ? tarihOku(ev.DTEND.deger) : null;
  if (!bit || bit <= bas) bit = gunEkle(bas, 1);
  const ozet = ev.SUMMARY ? metinCoz(ev.SUMMARY.deger) : "";
  const aciklama = ev.DESCRIPTION ? metinCoz(ev.DESCRIPTION.deger) : "";
  const uid = ev.UID && ev.UID.deger.trim() ? ev.UID.deger.trim().slice(0, 300) : sabitUid(bas, bit);
  return { uid, bas, bit, tur: turBelirle(kaynak, ozet, aciklama) };
}

// Dolu gün sayısı: [bas, bit) aralığında blokların kapladığı farklı gecelerin sayısı
export function doluGunSay(bloklar: Blok[], bas: string, bit: string): number {
  const g = new Set<string>();
  for (const b of bloklar) {
    for (let d = b.bas > bas ? b.bas : bas; d < b.bit && d < bit; d = gunEkle(d, 1)) g.add(d);
  }
  return g.size;
}

// ---------------- yazma (takvim-ver) ----------------
export interface CikanOlay { uid: string; bas: string; bit: string; ozet: "Dolu" | "Opsiyon" }

function icsTarih(gun: string): string { return gun.replace(/-/g, ""); }
function damga(d: Date): string { return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }

// 75 oktetten uzun satırlar katlanır (UID'ler kısa; yine de kural gereği)
function katla(s: string): string {
  const parca: string[] = [];
  let k = s;
  while (new TextEncoder().encode(k).length > 75) {
    let n = 74;
    while (new TextEncoder().encode(k.slice(0, n)).length > 74) n--;
    parca.push(k.slice(0, n)); k = " " + k.slice(n);
  }
  parca.push(k);
  return parca.join("\r\n");
}

// Yalnız tarih ve sabit başlık ("Dolu" / "Opsiyon"). Misafir adı, telefon, fiyat, not KESİNLİKLE yazılmaz.
export function icsYaz(olaylar: CikanOlay[], simdi: Date = new Date()): string {
  const L = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Villa Takvimim//Takvim//TR", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "X-WR-CALNAME:Villa Takvimim",
  ];
  const st = damga(simdi);
  for (const o of olaylar) {
    L.push("BEGIN:VEVENT", "UID:" + o.uid, "DTSTAMP:" + st, "DTSTART;VALUE=DATE:" + icsTarih(o.bas),
      "DTEND;VALUE=DATE:" + icsTarih(o.bit), "SUMMARY:" + o.ozet, "TRANSP:OPAQUE", "END:VEVENT");
  }
  L.push("END:VCALENDAR");
  return L.map(katla).join("\r\n") + "\r\n";
}
