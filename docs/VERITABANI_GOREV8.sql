-- Villa Takvimim — Görev 8 veritabanı değişiklikleri (8 Kasım 2026)
-- Supabase → SQL Editor → New query → bu dosyanın tamamını yapıştır → Run
-- Hiçbir kayıt silinmez. Tekrar çalıştırılması zarar vermez.

-- 1) Depozito iadesi kalıcı olsun (şu an sadece telefonda saklanıyor)
alter table public.rezervasyon_mali
  add column if not exists depozito_durum text check (depozito_durum in ('iade','kesildi','tutuldu')),
  add column if not exists depozito_kesilen bigint not null default 0,
  add column if not exists depozito_not text,
  add column if not exists depozito_islem_tarih date;

-- 2) Eski "depozito alındı" kayıtlarının taşınması: GEREK YOK (kontrol edildi, 0 kayıt)

-- 3) Bakıcının gördüğü kalan ödeme: yeni kural
--    kalan = konaklama (tutar + kısa konaklama) + depozito − alınan ödemeler
create or replace function public.bakici_kalanlar(p_villa uuid)
returns table(rezervasyon_id uuid, kalan bigint, depozito bigint)
language sql stable security definer set search_path to 'public'
as $function$
  with t as (
    select r.id,
      coalesce(m.tutar,0) + coalesce(m.ek_ucret,0) ara,
      coalesce(od.top,0) odenen,
      coalesce(m.depozito_tutar,
        coalesce(nullif(regexp_replace(coalesce(v.bilgi->>'depozito',''),'[^0-9]','','g'),'')::bigint,0)) dep
    from rezervasyonlar r
    join villalar v on v.id = r.villa_id
    left join rezervasyon_mali m on m.rezervasyon_id = r.id
    left join (select o.rezervasyon_id, sum(o.tutar) top from odemeler o group by 1) od on od.rezervasyon_id = r.id
    where r.villa_id = p_villa and erisim_var(p_villa)
  )
  select id,
    greatest(0, ara + dep - odenen)::bigint,
    least(dep, greatest(0, ara + dep - odenen))::bigint
  from t;
$function$;

-- 4) Destek modu: yönetici gelirleri ve fiyatları da düzenleyebilsin
drop policy if exists p_gelir on public.gelirler;
create policy p_gelir on public.gelirler for all
  using (sahip_mi(villa_id) or yonetici_mi())
  with check (sahip_mi(villa_id) or yonetici_mi());

drop policy if exists p_fiyat_yaz on public.fiyatlar;
create policy p_fiyat_yaz on public.fiyatlar for insert
  with check (sahip_mi(villa_id) or yonetici_mi());
drop policy if exists p_fiyat_guncelle on public.fiyatlar;
create policy p_fiyat_guncelle on public.fiyatlar for update
  using (sahip_mi(villa_id) or yonetici_mi())
  with check (sahip_mi(villa_id) or yonetici_mi());
drop policy if exists p_fiyat_sil on public.fiyatlar;
create policy p_fiyat_sil on public.fiyatlar for delete
  using (sahip_mi(villa_id) or yonetici_mi());
