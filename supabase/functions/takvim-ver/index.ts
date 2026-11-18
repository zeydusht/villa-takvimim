// Villa Takvimim — villanın takvimini dışarıya iCal olarak verir (Görev 32.2)
//
// DEPLOY EDİLMEDİ. Ürün yöneticisi kontrol edip deploy eder (herkese açık, Airbnb / Booking oturum açmadan okur):
//   supabase functions deploy takvim-ver --no-verify-jwt
//
// Adres: /functions/v1/takvim-ver/<anahtar>.ics   (sonu .ics olmalı; Airbnb başka türlüsünü kabul etmiyor)
//   · Anahtar villa_ical tablosunda yoksa 404, hiçbir bilgi verilmez.
//   · İçerik: villanın bugünden sonraki (bugün dahil devam eden) bütün rezervasyonları ve süresi geçmemiş ayırmaları
//     (rez_tutmalar). Her biri bir VEVENT: SUMMARY:Dolu (ayırmada SUMMARY:Opsiyon), DTSTART/DTEND;VALUE=DATE,
//     kalıcı UID rez-<id>@villatakvim (ayırmada tutma-<id>@villatakvim).
//   · Misafir adı, telefon, fiyat ve not KESİNLİKLE yok: veritabanından yalnız id ve tarihler okunur.
//   · Dış takvimlerden gelen bloklar (dis_bloklar) geri yayınlanmaz (döngü olur): o tablo hiç okunmaz.

import { createClient } from "jsr:@supabase/supabase-js@2";
import { icsYaz } from "../_shared/ical.ts";
import { anahtarAl, olaylar } from "./ver.ts";
import { bugunTr } from "../_shared/push.ts";

const BASLIK = {
  "Content-Type": "text/calendar; charset=utf-8",
  "Cache-Control": "max-age=60",
  "X-Robots-Tag": "noindex",
  "Access-Control-Allow-Origin": "*",
};
const YOK = () => new Response("Not found", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex" } });

// deno-lint-ignore no-explicit-any
const D = (globalThis as any).Deno;
if (D && D.serve) D.serve(async (req: Request) => {
  if (req.method !== "GET" && req.method !== "HEAD") return new Response("Method not allowed", { status: 405 });
  const anahtar = anahtarAl(new URL(req.url).pathname);
  if (!anahtar) return YOK();
  const db = createClient(D.env.get("SUPABASE_URL")!, D.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const { data: v } = await db.from("villa_ical").select("villa_id").eq("anahtar", anahtar).maybeSingle();
  if (!v) return YOK();
  const bugun = bugunTr();
  const [r, t] = await Promise.all([
    db.from("rezervasyonlar").select("id, baslangic, bitis").eq("villa_id", v.villa_id).gt("bitis", bugun),
    db.from("rez_tutmalar").select("id, baslangic, bitis").eq("villa_id", v.villa_id).gt("son", new Date().toISOString()),
  ]);
  if (r.error) return new Response("Takvim şu an hazırlanamadı.", { status: 503, headers: { "Retry-After": "120" } });
  const govde = icsYaz(olaylar(r.data || [], t.data || []));
  return new Response(req.method === "HEAD" ? null : govde, { headers: BASLIK });
});
