// Villa Takvimim — dış takvim linkini güvenli indirme (SSRF koruması, Görev 32.1)
//
//  · yalnız https://
//  · IP adresi ya da localhost / özel ağ adresi reddedilir (10.x, 172.16–31.x, 192.168.x, 169.254.x, 127.x, 0.x, 100.64/10,
//    ::1, ::, fc00::/7, fe80::/10, IPv4'e eşlenmiş IPv6); ad çözümlenince çıkan adresler de aynı kontrolden geçer
//  · en fazla 3 yönlendirme, her yönlendirmede aynı kontrol
//  · cevap en fazla 2 MB, süre sınırı 8 sn (toplam)
// Hata metinleri kısa ve sade Türkçe (dis_takvimler.son_hata'ya yazılır, sahibe gösterilir).

export const SURE_SINIRI = 8000;
export const BOYUT_SINIRI = 2 * 1024 * 1024;
export const YONLENDIRME_SINIRI = 3;

export class TakvimHatasi extends Error {
  kod: string;
  constructor(kod: string, mesaj: string) { super(mesaj); this.kod = kod; }
}

// IPv4 / IPv6 metni mi?
export function ipMi(host: string): boolean {
  const h = String(host || "").replace(/^\[|\]$/g, "");
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(h) || h.includes(":") || /^\d+$/.test(h) || /^0x[0-9a-f]+$/i.test(h);
}

// Özel / yerel / ayrılmış adres mi?
export function ozelIpMi(ip: string): boolean {
  let h = String(ip || "").trim().toLowerCase().replace(/^\[|\]$/g, "");
  const esle = /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/.exec(h);
  if (esle) h = esle[1];
  const v4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(h);
  if (v4) {
    const [a, b] = [+v4[1], +v4[2]];
    if ([+v4[1], +v4[2], +v4[3], +v4[4]].some((x) => x > 255)) return true;
    return a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) || (a === 192 && b === 0) || (a === 198 && (b === 18 || b === 19)) ||
      a >= 224;
  }
  if (h.includes(":")) {
    if (h === "::1" || h === "::") return true;
    const ilk = h.split(":")[0];
    if (/^f[cd]/.test(ilk)) return true;                 // fc00::/7
    if (/^fe[89ab]/.test(ilk)) return true;              // fe80::/10
    if (/^ff/.test(ilk)) return true;                    // çoklu yayın
    if (h.startsWith("::ffff:") || h.startsWith("64:ff9b::")) return true;
    return false;
  }
  return true;   // tanınmayan biçim: güvenli tarafta kal
}

// Adres biçim kontrolü (ad çözümlemeden önce)
export function adresKontrol(adres: string): URL {
  let u: URL;
  try { u = new URL(String(adres || "").trim()); } catch { throw new TakvimHatasi("adres", "Bu bir takvim linki gibi görünmüyor."); }
  if (u.protocol !== "https:") throw new TakvimHatasi("https", "Link https:// ile başlamalı.");
  if (u.username || u.password) throw new TakvimHatasi("adres", "Bu bir takvim linki gibi görünmüyor.");
  const host = u.hostname.toLowerCase();
  if (!host || ipMi(host)) throw new TakvimHatasi("ip", "IP adresiyle verilen linkler kabul edilmiyor. Sitenin verdiği linki yapıştırın.");
  if (host === "localhost" || /\.(localhost|local|internal|lan|home|intranet|corp)$/.test(host) || !host.includes(".")) {
    throw new TakvimHatasi("yerel", "Bu link internetteki bir siteye ait değil.");
  }
  if (u.port && u.port !== "443") throw new TakvimHatasi("port", "Bu link standart dışı bir bağlantı noktası kullanıyor.");
  return u;
}

export type Cozumleyici = (host: string) => Promise<string[]>;

// Deno'da DNS çözümleme (A + AAAA). Çözülemezse hata.
export const denoCozumle: Cozumleyici = async (host) => {
  // deno-lint-ignore no-explicit-any
  const D = (globalThis as any).Deno;
  if (!D || !D.resolveDns) return [];
  const l: string[] = [];
  for (const t of ["A", "AAAA"]) { try { l.push(...(await D.resolveDns(host, t))); } catch { /* yoksa geç */ } }
  if (!l.length) throw new TakvimHatasi("dns", "Sitenin adresi bulunamadı. Linki kontrol edin.");
  return l;
};

export interface Sonuc { durum: number; metin: string; etag: string | null; sonDegisim: string | null; son: string }

// Güvenli indirme. basliklar: If-None-Match / If-Modified-Since. 304 → metin "".
export async function guvenliGetir(adres: string, o: {
  basliklar?: Record<string, string>; cozumle?: Cozumleyici; getir?: typeof fetch; sure?: number;
} = {}): Promise<Sonuc> {
  const getir = o.getir || fetch, cozumle = o.cozumle || denoCozumle;
  const kontrol = new AbortController();
  const zaman = setTimeout(() => kontrol.abort(), o.sure ?? SURE_SINIRI);
  try {
    let u = adresKontrol(adres);
    for (let y = 0; ; y++) {
      for (const ip of await cozumle(u.hostname)) {
        if (ozelIpMi(ip)) throw new TakvimHatasi("ozel", "Bu link internetteki bir siteye ait değil.");
      }
      let r: Response;
      try {
        r = await getir(u.toString(), {
          redirect: "manual", signal: kontrol.signal,
          headers: { "User-Agent": "VillaTakvimim-Takvim/1.0", Accept: "text/calendar, text/plain;q=0.8, */*;q=0.1", ...(o.basliklar || {}) },
        });
      } catch (e) {
        if (kontrol.signal.aborted) throw new TakvimHatasi("sure", "Site 8 saniyede cevap vermedi.");
        throw new TakvimHatasi("baglanti", "Siteye bağlanılamadı.");
      }
      if (r.status >= 300 && r.status < 400 && r.status !== 304) {
        const yer = r.headers.get("location");
        try { await r.body?.cancel(); } catch { /* */ }
        if (!yer) throw new TakvimHatasi("yonlendirme", "Site geçersiz bir yönlendirme gönderdi.");
        if (y >= YONLENDIRME_SINIRI) throw new TakvimHatasi("yonlendirme", "Link çok fazla yönlendiriliyor.");
        u = adresKontrol(new URL(yer, u).toString());
        continue;
      }
      if (r.status === 304) {
        try { await r.body?.cancel(); } catch { /* */ }
        return { durum: 304, metin: "", etag: r.headers.get("etag"), sonDegisim: r.headers.get("last-modified"), son: u.toString() };
      }
      if (r.status === 404 || r.status === 410) throw new TakvimHatasi("yok", "Bu link artık çalışmıyor. Siteden yeni linki alın.");
      if (r.status === 401 || r.status === 403) throw new TakvimHatasi("izin", "Site bu linke izin vermiyor. Siteden yeni linki alın.");
      if (r.status >= 500) throw new TakvimHatasi("sunucu", "Site şu an cevap vermiyor.");
      if (!r.ok) throw new TakvimHatasi("durum", "Takvim okunamadı (" + r.status + ").");
      const uzunluk = +(r.headers.get("content-length") || 0);
      if (uzunluk > BOYUT_SINIRI) throw new TakvimHatasi("buyuk", "Takvim dosyası çok büyük.");
      const metin = await sinirliOku(r, BOYUT_SINIRI, kontrol.signal);
      if (!/BEGIN:VCALENDAR/i.test(metin.slice(0, 4096))) throw new TakvimHatasi("bicim", "Bu link bir takvim dosyası değil. Sitenin iCal (.ics) linkini yapıştırın.");
      return { durum: r.status, metin, etag: r.headers.get("etag"), sonDegisim: r.headers.get("last-modified"), son: u.toString() };
    }
  } finally {
    clearTimeout(zaman);
  }
}

async function sinirliOku(r: Response, sinir: number, sinyal: AbortSignal): Promise<string> {
  if (!r.body) return "";
  const okuyucu = r.body.getReader(), parca: Uint8Array[] = [];
  let toplam = 0;
  try {
    for (;;) {
      const { done, value } = await okuyucu.read();
      if (done) break;
      toplam += value.length;
      if (toplam > sinir) { try { await okuyucu.cancel(); } catch { /* */ } throw new TakvimHatasi("buyuk", "Takvim dosyası çok büyük."); }
      parca.push(value);
    }
  } catch (e) {
    if (e instanceof TakvimHatasi) throw e;
    if (sinyal.aborted) throw new TakvimHatasi("sure", "Site 8 saniyede cevap vermedi.");
    throw new TakvimHatasi("baglanti", "Takvim okunurken bağlantı koptu.");
  }
  const tum = new Uint8Array(toplam); let i = 0;
  for (const p of parca) { tum.set(p, i); i += p.length; }
  return new TextDecoder("utf-8").decode(tum);
}
