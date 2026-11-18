// takvim-ver'in saf parçaları (Deno ve Node'da test edilir)
import type { CikanOlay } from "../_shared/ical.ts";

// "/functions/v1/takvim-ver/<anahtar>.ics" ya da "/takvim-ver/<anahtar>.ics" → anahtar
export function anahtarAl(yol: string): string | null {
  const m = /\/takvim-ver\/([0-9a-f]{16,128})\.ics$/i.exec(String(yol || ""));
  return m ? m[1].toLowerCase() : null;
}

// Rezervasyon ve ayırma satırlarından olaylar (yalnız id ve tarih kullanılır)
export function olaylar(rez: { id: string; baslangic: string; bitis: string }[], tutma: { id: string; baslangic: string; bitis: string }[]): CikanOlay[] {
  const l: CikanOlay[] = [];
  for (const r of rez) if (r.bitis > r.baslangic) l.push({ uid: "rez-" + r.id + "@villatakvim", bas: r.baslangic, bit: r.bitis, ozet: "Dolu" });
  for (const t of tutma) if (t.bitis > t.baslangic) l.push({ uid: "tutma-" + t.id + "@villatakvim", bas: t.baslangic, bit: t.bitis, ozet: "Opsiyon" });
  return l.sort((a, b) => (a.bas < b.bas ? -1 : a.bas > b.bas ? 1 : 0));
}

