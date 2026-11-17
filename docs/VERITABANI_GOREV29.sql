-- VERITABANI_GOREV29.sql
-- Güvenlik sıkılaştırma + kullanım ölçümü (olaylar) + yönetici istatistikleri
-- Bu dosyayı Claude (ürün yöneticisi) Zeyd'in onayıyla Supabase'e uygular.
-- Claude Code bu dosyayı ÇALIŞTIRMAZ, sadece okur.

-------------------------------------------------------------------------------
-- A) GÜVENLİK SIKILAŞTIRMA
-------------------------------------------------------------------------------

-- A1. Gereksiz tablo yetkilerini kaldır (TRUNCATE RLS'i atlar; API kullanmıyor ama kapalı olsun)
revoke truncate, trigger, references on all tables in schema public from anon, authenticated;

-- A2. Misafir (anon) hiçbir tabloya doğrudan erişemesin. Misafir sayfası sadece
--     teklif_getir RPC'sini ve galeri'deki herkese açık dosyaları kullanır.
revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;

-- A3. Yeni tablolar varsayılan olarak anon'a açılmasın
alter default privileges in schema public revoke all on tables from anon;
alter default privileges in schema public revoke all on sequences from anon;
alter default privileges in schema public revoke execute on functions from anon, public;
alter default privileges in schema public revoke truncate, trigger, references on tables from authenticated;

-- A4. Fonksiyonlar: PUBLIC'ten çalıştırma yetkisini al, sadece gerekenlere ver
revoke execute on all functions in schema public from public, anon;
grant execute on function public.teklif_getir(text) to anon, authenticated;

-- A5. bildirim_gonderim: kullanıcılar hiç göremez (sadece sunucu işi yazar). Açık "hayır" kuralı.
revoke all on public.bildirim_gonderim from authenticated;
create policy p_bildirim_yok on public.bildirim_gonderim for all to authenticated using (false) with check (false);

-- A6. Galeri listesi: onaylı her kullanıcı TÜM villaların dosyalarını listeleyebiliyordu.
--     Artık sadece erişimi olduğu villaların dosyalarını listeleyebilir.
--     (Herkese açık fotoğraf/paylaşım linkleri aynen çalışır; liste ≠ açık link.)
drop policy if exists "galeri liste" on storage.objects;
create policy "galeri liste" on storage.objects for select to authenticated
  using (bucket_id = 'galeri' and exists (
    select 1 from public.galeri_villalari(name) g(vid) where public.erisim_var(g.vid)));
grant execute on function public.galeri_villalari(text) to authenticated;

-------------------------------------------------------------------------------
-- B) KULLANIM ÖLÇÜMÜ (olaylar)
--    Kural: isim, telefon, e-posta, fiyat, misafir bilgisi ASLA yazılmaz.
--    Sadece "ne yapıldı" + sayılar/evet-hayır.
-------------------------------------------------------------------------------

create table if not exists public.olaylar (
  id bigserial primary key,
  kullanici uuid not null default auth.uid() references auth.users(id) on delete cascade,
  ad text not null check (ad ~ '^[a-z][a-z0-9_]{1,39}$'),
  ekran text check (ekran is null or ekran ~ '^[a-z][a-z0-9_]{0,29}$'),
  veri jsonb not null default '{}'::jsonb check (pg_column_size(veri) <= 1024 and jsonb_typeof(veri) = 'object'),
  platform text check (platform in ('ios','android','web')),
  surum text check (surum is null or length(surum) <= 20),
  oturum uuid,
  zaman timestamptz not null default now()
);
create index if not exists olaylar_kullanici_zaman on public.olaylar (kullanici, zaman desc);
create index if not exists olaylar_ad_zaman on public.olaylar (ad, zaman desc);

alter table public.olaylar enable row level security;
revoke all on public.olaylar from anon, authenticated;
grant insert on public.olaylar to authenticated;
grant usage on sequence public.olaylar_id_seq to authenticated;

-- Kullanıcı sadece KENDİ adına ekleyebilir, okuyamaz/silemez/değiştiremez
create policy p_olay_ekle on public.olaylar for insert to authenticated
  with check (kullanici = auth.uid());

-- Kötüye kullanım freni: kullanıcı başına saatte en fazla 600 olay
create or replace function public.olay_frenle() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from olaylar where kullanici = new.kullanici
        and zaman > now() - interval '1 hour') >= 600 then
    return null; -- sessizce at
  end if;
  new.zaman := now();          -- istemci saati değiştiremesin
  return new;
end $$;
revoke execute on function public.olay_frenle() from public, anon, authenticated;
drop trigger if exists tr_olay_fren on public.olaylar;
create trigger tr_olay_fren before insert on public.olaylar
  for each row execute function public.olay_frenle();

-- Saklama süresi: 13 aydan eski olaylar her gece silinir (KVKK: gereğinden uzun saklama yok)
select cron.unschedule(jobid) from cron.job where jobname = 'olay_temizle';
select cron.schedule('olay_temizle', '17 3 * * *',
  $$delete from public.olaylar where zaman < now() - interval '13 months'$$);

-------------------------------------------------------------------------------
-- C) YÖNETİCİ İSTATİSTİKLERİ (sadece yonetici = true olanlar; diğerlerine boş/hata)
-------------------------------------------------------------------------------

create or replace function public.istatistik_ozet()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare s jsonb;
begin
  if not yonetici_mi() then raise exception 'Yetkiniz yok'; end if;
  select jsonb_build_object(
    'kullanici_toplam', (select count(*) from profiller),
    'kullanici_onayli', (select count(*) from profiller where onay and not askida),
    'onay_bekleyen',    (select count(*) from profiller where not onay and not askida),
    'aktif_1g',  (select count(distinct kullanici) from olaylar where zaman > now() - interval '1 day'),
    'aktif_7g',  (select count(distinct kullanici) from olaylar where zaman > now() - interval '7 days'),
    'aktif_30g', (select count(distinct kullanici) from olaylar where zaman > now() - interval '30 days'),
    'villa_toplam', (select count(*) from villalar where silindi_tarih is null),
    'rez_toplam',   (select count(*) from rezervasyonlar),
    'rez_30g',      (select count(*) from olaylar where ad = 'rez_ekle' and zaman > now() - interval '30 days'),
    'teklif_toplam',(select count(*) from teklifler),
    'villa_dagilim', (select coalesce(jsonb_object_agg(k, n), '{}'::jsonb) from (
        select case when c >= 4 then '4+' else c::text end k, count(*) n from (
          select p.id, (select count(*) from villa_erisim e join villalar v on v.id = e.villa_id
                        where e.kullanici = p.id and e.rol = 'sahip' and v.silindi_tarih is null) c
          from profiller p where p.onay) x group by 1) y),
    'haftalik_kayit', (select coalesce(jsonb_agg(jsonb_build_object('hafta', h, 'n', n) order by h), '[]'::jsonb) from (
        select to_char(date_trunc('week', kayit), 'YYYY-MM-DD') h, count(*) n from profiller
        where kayit > now() - interval '12 weeks' group by 1) z),
    'en_cok_olay_30g', (select coalesce(jsonb_agg(jsonb_build_object('ad', ad, 'n', n) order by n desc), '[]'::jsonb) from (
        select ad, count(*) n from olaylar where zaman > now() - interval '30 days'
        group by ad order by 2 desc limit 15) w),
    'platform_30g', (select coalesce(jsonb_object_agg(coalesce(platform,'?'), n), '{}'::jsonb) from (
        select platform, count(distinct kullanici) n from olaylar
        where zaman > now() - interval '30 days' group by 1) q),
    'huni', jsonb_build_object(
        'kayit',      (select count(*) from profiller),
        'onay',       (select count(*) from profiller where onay),
        'ilk_villa',  (select count(distinct e.kullanici) from villa_erisim e where e.rol = 'sahip'),
        'ilk_rez',    (select count(distinct e.kullanici) from villa_erisim e
                        join rezervasyonlar r on r.villa_id = e.villa_id where e.rol = 'sahip'))
  ) into s;
  return s;
end $$;
revoke execute on function public.istatistik_ozet() from public, anon;
grant execute on function public.istatistik_ozet() to authenticated;

-- Tek kullanıcının son etkinliği (destek / hata ayıklama için). Bu erişim kayda geçer.
create or replace function public.kullanici_etkinlik(p_id uuid)
returns table(zaman timestamptz, ad text, ekran text, veri jsonb, platform text, surum text)
language plpgsql stable security definer set search_path = public as $$
begin
  if not yonetici_mi() then raise exception 'Yetkiniz yok'; end if;
  return query select o.zaman, o.ad, o.ekran, o.veri, o.platform, o.surum
    from olaylar o where o.kullanici = p_id order by o.zaman desc limit 200;
end $$;
-- Destek kaydı artık bir kullanıcıya bakmayı da kaydedebilsin
alter table public.destek_kayitlari alter column villa_id drop not null;
alter table public.destek_kayitlari add column if not exists hedef_kullanici uuid;
alter table public.destek_kayitlari add column if not exists islem text;

-- STABLE fonksiyon insert yapamaz; erişim kaydı için ayrı volatile sarmalayıcı:
create or replace function public.kullanici_etkinlik_gor(p_id uuid)
returns table(zaman timestamptz, ad text, ekran text, veri jsonb, platform text, surum text)
language plpgsql security definer set search_path = public as $$
begin
  if not yonetici_mi() then raise exception 'Yetkiniz yok'; end if;
  insert into destek_kayitlari (yonetici, villa_id, hedef_kullanici, islem)
    values (auth.uid(), null, p_id, 'etkinlik');
  return query select * from kullanici_etkinlik(p_id);
end $$;
revoke execute on function public.kullanici_etkinlik(uuid) from public, anon, authenticated;
revoke execute on function public.kullanici_etkinlik_gor(uuid) from public, anon;
grant execute on function public.kullanici_etkinlik_gor(uuid) to authenticated;

-- Son görülme (yönetici listesinde göstermek için)
create or replace function public.son_gorulmeler()
returns table(kullanici uuid, son timestamptz, platform text, surum text)
language plpgsql stable security definer set search_path = public as $$
begin
  if not yonetici_mi() then raise exception 'Yetkiniz yok'; end if;
  return query select distinct on (o.kullanici) o.kullanici, o.zaman, o.platform, o.surum
    from olaylar o order by o.kullanici, o.zaman desc;
end $$;
revoke execute on function public.son_gorulmeler() from public, anon;
grant execute on function public.son_gorulmeler() to authenticated;
