-- VERITABANI_GOREV33.sql — Rezervasyon kaynağı (kanal), yeni siteler, "Bağlamayı bize bırakın" talepleri
-- Ürün yöneticisi Zeyd'in onayıyla uygular. Claude Code ÇALIŞTIRMAZ, sadece adları kullanır.

-- 1) Kanal listesi (rezervasyon nereden geldi)
--    direkt = WhatsApp / telefon / kendi müşterisi, tavsiye = tanıdık tavsiyesi
alter table public.rezervasyonlar add column if not exists kaynak text
  check (kaynak is null or kaynak in ('direkt','airbnb','booking','vrbo','villasepeti','tatilsepeti','kalkanvilla',
                                      'villapaketi','tatilkentim','tavsiye','diger'));

-- 2) Dış takvim kaynaklarına yerel siteler
alter table public.dis_takvimler drop constraint if exists dis_takvimler_kaynak_check;
alter table public.dis_takvimler add constraint dis_takvimler_kaynak_check
  check (kaynak in ('airbnb','booking','vrbo','villasepeti','tatilsepeti','kalkanvilla','villapaketi','tatilkentim','diger'));

-- 3) Dış satıştan rezervasyon: kaynağı da yazılır. Misafir adı ZORUNLU (boş geçilirse oluşturulmaz).
create or replace function public.blok_rez_olustur(p_blok bigint, p_misafir text default null) returns uuid
language plpgsql security definer set search_path = public as $$
declare b dis_bloklar; t dis_takvimler; yeni uuid;
begin
  select * into b from dis_bloklar where id = p_blok;
  if b.id is null or not sahip_mi(b.villa_id) and not yonetici_mi() then raise exception 'Yetkiniz yok'; end if;
  if b.bagli_rezervasyon is not null then return b.bagli_rezervasyon; end if;
  if length(coalesce(trim(p_misafir), '')) < 2 then raise exception 'Misafirin adını yazın'; end if;
  select * into t from dis_takvimler where id = b.takvim_id;
  perform set_config('vt.dis_engel_atla', 'evet', true);
  insert into rezervasyonlar (villa_id, baslangic, bitis, misafir, kaynak)
  values (b.villa_id, b.baslangic, b.bitis, trim(p_misafir), t.kaynak)
  returning id into yeni;
  perform set_config('vt.dis_engel_atla', '', true);
  update dis_bloklar set bagli_rezervasyon = yeni where id = p_blok;
  update cakismalar set durum = 'ayni_rez', cozum_zamani = now(), cozen = auth.uid() where blok_id = p_blok and durum = 'acik';
  return yeni;
end $$;

-- 4) "Bağlamayı bize bırakın": villa sahibi sadece sitedeki villa sayfasının linkini verir; yöneticiler bağlar.
create table if not exists public.baglanti_talepleri (
  id uuid primary key default gen_random_uuid(),
  villa_id uuid not null references public.villalar(id) on delete cascade,
  kullanici uuid not null default auth.uid(),
  site text not null check (site in ('airbnb','booking','vrbo','villasepeti','tatilsepeti','kalkanvilla','villapaketi','tatilkentim','diger')),
  sayfa_linki text check (sayfa_linki is null or (sayfa_linki ~ '^https?://' and length(sayfa_linki) <= 1000)),
  notu text check (notu is null or length(notu) <= 500),
  durum text not null default 'bekliyor' check (durum in ('bekliyor','calisiliyor','baglandi','olmadi')),
  yonetici_notu text check (yonetici_notu is null or length(yonetici_notu) <= 500),
  olusturma timestamptz not null default now(),
  guncelleme timestamptz not null default now()
);
create index if not exists baglanti_talepleri_durum on public.baglanti_talepleri (durum, olusturma);
alter table public.baglanti_talepleri enable row level security;
revoke all on public.baglanti_talepleri from anon, authenticated;
grant select, insert on public.baglanti_talepleri to authenticated;
create policy p_talep_oku on public.baglanti_talepleri for select to authenticated
  using (sahip_mi(villa_id) or yonetici_mi());
create policy p_talep_ekle on public.baglanti_talepleri for insert to authenticated
  with check (kullanici = auth.uid() and sahip_mi(villa_id) and durum = 'bekliyor' and yonetici_notu is null);

-- Yönetici: talebin durumunu değiştirir (bağlantının kendisi dis_takvimler'e yönetici olarak eklenir; politika izin veriyor)
create or replace function public.talep_guncelle(p_id uuid, p_durum text, p_not text default null) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not yonetici_mi() then raise exception 'Yetkiniz yok'; end if;
  if p_durum not in ('bekliyor','calisiliyor','baglandi','olmadi') then raise exception 'Geçersiz durum'; end if;
  update baglanti_talepleri set durum = p_durum, yonetici_notu = coalesce(p_not, yonetici_notu), guncelleme = now() where id = p_id;
  insert into destek_kayitlari (yonetici, villa_id, hedef_kullanici, islem)
    select auth.uid(), villa_id, kullanici, 'talep_' || p_durum from baglanti_talepleri where id = p_id;
end $$;

-- Yönetici: bütün talepler (villa adı ve sahibin e-postasıyla)
create or replace function public.tum_talepler() returns table(id uuid, villa_id uuid, villa_ad text, sahip_eposta text, sahip_telefon text,
  site text, sayfa_linki text, notu text, durum text, yonetici_notu text, olusturma timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  if not yonetici_mi() then raise exception 'Yetkiniz yok'; end if;
  return query select b.id, b.villa_id, v.ad, p.eposta, p.telefon, b.site, b.sayfa_linki, b.notu, b.durum, b.yonetici_notu, b.olusturma
    from baglanti_talepleri b join villalar v on v.id = b.villa_id left join profiller p on p.id = b.kullanici
    order by (b.durum in ('bekliyor','calisiliyor')) desc, b.olusturma desc;
end $$;

revoke execute on function public.talep_guncelle(uuid, text, text), public.tum_talepler() from public, anon;
grant execute on function public.talep_guncelle(uuid, text, text), public.tum_talepler() to authenticated;

-- Yeni talep gelince yöneticilere bildirim: mevcut saatlik bildirim kuyruğu yerine takvim-esitle "tam" turu gönderir
-- (Claude Code: takvim-esitle'ye "yeni talepler" adımı ekler; ürün yöneticisi deploy eder).
