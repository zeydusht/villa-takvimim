-- VERITABANI_GOREV35.sql — Misafir sayfası canlı doluluk
-- Ürün yöneticisi Zeyd'in onayıyla uygular. Claude Code ÇALIŞTIRMAZ, sadece adı kullanır.
--
-- Sorun: misafir sayfası (g.html) doluluğu, sahibin uygulaması açıkken yüklenen <ad>.json'dan okuyor.
--   · bakıcının girdiği rezervasyon, sahip uygulamayı açana kadar sayfaya geçmiyor;
--   · Airbnb / Booking'den gelen dış satışlar (dis_bloklar) sayfada HİÇ görünmüyor → misafir satılmış günü boş görüyor.
-- Çözüm: sayfa doluluğu her açılışta ve açıkken her 60 sn'de bu fonksiyondan okur. Yalnız tarihler döner;
-- misafir adı, telefon, fiyat, not, kaynak sitesi YOK. Bağlantının adını (paylasim.ad) bilen zaten sayfayı görebiliyor.

create or replace function public.villa_doluluk(p_ad text) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare v villalar; bugun date := (now() at time zone 'Europe/Istanbul')::date; son date;
begin
  if p_ad is null or p_ad !~ '^[a-z0-9-]{3,80}$' then return null; end if;
  select * into v from villalar where paylasim->>'ad' = p_ad and silindi_tarih is null limit 1;
  if v.id is null then return null; end if;
  son := bugun + 400;
  return jsonb_build_object(
    'zaman', now(),
    -- [bas, bit): bas = giriş günü, bit = çıkış günü (o gece dahil değil)
    'dolu', coalesce((select jsonb_agg(jsonb_build_array(x.bas, x.bit) order by x.bas) from (
        select r.baslangic bas, r.bitis bit from rezervasyonlar r
         where r.villa_id = v.id and r.bitis >= bugun and r.baslangic <= son
        union all
        select d.baslangic, d.bitis from dis_bloklar d join dis_takvimler t on t.id = d.takvim_id and t.aktif
         where d.villa_id = v.id and d.bagli_rezervasyon is null and d.bitis >= bugun and d.baslangic <= son
        union all
        select x2.baslangic, x2.bitis from rez_tutmalar x2 where x2.villa_id = v.id and x2.son > now()
      ) x), '[]'::jsonb),
    'opsiyon', coalesce((select jsonb_agg(jsonb_build_object('b', o->>'start', 's', o->>'end', 'son', o->>'son'))
        from jsonb_array_elements(case when jsonb_typeof(v.bilgi->'opsiyonlar') = 'array' then v.bilgi->'opsiyonlar' else '[]'::jsonb end) o
        where (o->>'son') >= bugun::text and (o->>'end') >= bugun::text), '[]'::jsonb)
  );
end $$;
revoke execute on function public.villa_doluluk(text) from public;
grant execute on function public.villa_doluluk(text) to anon, authenticated;
