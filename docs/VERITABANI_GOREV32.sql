-- VERITABANI_GOREV32.sql — Dış takvim eşitleme (iCal), 10 dk ayırma, çakışma alarmı
-- UYGULANDI: 2026-11-20 (Zeyd onayıyla). Claude Code ÇALIŞTIRMAZ, sadece adları kullanır.
-- Tarih kuralı: baslangic = giriş günü, bitis = çıkış günü (o gece dahil değil). iCal DTEND ile aynı.
-- Çakışma: a.baslangic < b.bitis and b.baslangic < a.bitis

-------------------------------------------------------------------------------
-- 1) Bağlı dış takvimler (Airbnb, Booking, Villasepeti, …)
-------------------------------------------------------------------------------
create table if not exists public.dis_takvimler (
  id uuid primary key default gen_random_uuid(),
  villa_id uuid not null references public.villalar(id) on delete cascade,
  kaynak text not null check (kaynak in ('airbnb','booking','vrbo','villasepeti','diger')),
  ad text not null check (length(ad) between 1 and 40),
  adres text not null check (adres ~ '^https://' and length(adres) <= 1000),
  aktif boolean not null default true,
  son_deneme timestamptz,
  son_basari timestamptz,
  son_hata text,
  hata_sayisi int not null default 0,
  etag text,
  son_degisim text,
  olusturan uuid default auth.uid(),
  olusturma timestamptz not null default now(),
  unique (villa_id, adres)
);
create index if not exists dis_takvimler_villa on public.dis_takvimler (villa_id);
alter table public.dis_takvimler enable row level security;
revoke all on public.dis_takvimler from anon, authenticated;
grant select, insert, update, delete on public.dis_takvimler to authenticated;
-- Adres gizli bilgidir (linki bilen takvimi okur): sadece villa sahibi ve yönetici görür/değiştirir.
create policy p_dis_takvim on public.dis_takvimler for all to authenticated
  using (sahip_mi(villa_id) or yonetici_mi())
  with check (sahip_mi(villa_id) or yonetici_mi());

-- Bakıcı vb. için adres OLMADAN durum bilgisi
create or replace function public.takvim_durumlari(p_villa uuid)
returns table(id uuid, kaynak text, ad text, aktif boolean, son_basari timestamptz, son_deneme timestamptz, son_hata text, hata_sayisi int)
language sql stable security definer set search_path = public as $$
  select t.id, t.kaynak, t.ad, t.aktif, t.son_basari, t.son_deneme, t.son_hata, t.hata_sayisi
  from dis_takvimler t where t.villa_id = p_villa and erisim_var(p_villa) order by t.olusturma;
$$;

-------------------------------------------------------------------------------
-- 2) Dış takvimlerden okunan dolu günler (sadece sunucu yazar)
--    tur: 'rezervasyon' = gerçek satış (ör. Airbnb "Reserved")
--         'kapali'      = sahibin kapattığı / platform ayarıyla kapalı (ör. "Airbnb (Not available)")
--         'bilinmiyor'  = kaynak ayırt etmiyor (ör. Booking "CLOSED - Not available") → satış gibi davranılır
--    Misafir adı vb. SAKLANMAZ (KVKK). Sadece tarih + tür + iCal UID.
-------------------------------------------------------------------------------
create table if not exists public.dis_bloklar (
  id bigserial primary key,
  takvim_id uuid not null references public.dis_takvimler(id) on delete cascade,
  villa_id uuid not null references public.villalar(id) on delete cascade,
  baslangic date not null,
  bitis date not null check (bitis > baslangic),
  tur text not null check (tur in ('rezervasyon','kapali','bilinmiyor')),
  uid text not null,
  ilk_gorulme timestamptz not null default now(),
  son_gorulme timestamptz not null default now(),
  bagli_rezervasyon uuid references public.rezervasyonlar(id) on delete set null,  -- "bu Airbnb satışı = bizim şu rezervasyonumuz"
  unique (takvim_id, uid, baslangic)
);
create index if not exists dis_bloklar_villa_tarih on public.dis_bloklar (villa_id, baslangic, bitis);
alter table public.dis_bloklar enable row level security;
revoke all on public.dis_bloklar from anon, authenticated;
grant select on public.dis_bloklar to authenticated;
create policy p_dis_blok_oku on public.dis_bloklar for select to authenticated using (erisim_var(villa_id));

-- Sahip bir dış satışı kendi rezervasyonuyla eşleştirir (misafir bilgisi eklemek için)
create or replace function public.blok_eslestir(p_blok bigint, p_rez uuid) returns void
language plpgsql security definer set search_path = public as $$
declare b dis_bloklar;
begin
  select * into b from dis_bloklar where id = p_blok;
  if b.id is null or not erisim_var(b.villa_id) then raise exception 'Yetkiniz yok'; end if;
  if p_rez is not null and not exists (select 1 from rezervasyonlar r where r.id = p_rez and r.villa_id = b.villa_id) then
    raise exception 'Rezervasyon bu villaya ait değil';
  end if;
  update dis_bloklar set bagli_rezervasyon = p_rez where id = p_blok;
  update cakismalar set durum = 'ayni_rez', cozum_zamani = now(), cozen = auth.uid()
   where blok_id = p_blok and rezervasyon_id = p_rez and durum = 'acik';
end $$;

-------------------------------------------------------------------------------
-- 3) Bizim dışarı verdiğimiz iCal linki (villa başına gizli anahtar)
-------------------------------------------------------------------------------
create table if not exists public.villa_ical (
  villa_id uuid primary key references public.villalar(id) on delete cascade,
  anahtar text not null unique default encode(extensions.gen_random_bytes(18), 'hex'),
  olusturma timestamptz not null default now()
);
alter table public.villa_ical enable row level security;
revoke all on public.villa_ical from anon, authenticated;
grant select on public.villa_ical to authenticated;
create policy p_villa_ical on public.villa_ical for select to authenticated using (sahip_mi(villa_id) or yonetici_mi());

-- Linki al (yoksa oluştur) / yenile (eski link çalışmaz olur)
create or replace function public.ical_anahtarim(p_villa uuid, p_yenile boolean default false) returns text
language plpgsql security definer set search_path = public as $$
declare a text;
begin
  if not (sahip_mi(p_villa) or yonetici_mi()) then raise exception 'Yetkiniz yok'; end if;
  if p_yenile then delete from villa_ical where villa_id = p_villa; end if;
  insert into villa_ical (villa_id) values (p_villa) on conflict (villa_id) do nothing;
  select anahtar into a from villa_ical where villa_id = p_villa;
  return a;
end $$;

-------------------------------------------------------------------------------
-- 4) 10 dakikalık ayırma (rezervasyon girilirken tarihleri tutar)
-------------------------------------------------------------------------------
create table if not exists public.rez_tutmalar (
  id uuid primary key default gen_random_uuid(),
  villa_id uuid not null references public.villalar(id) on delete cascade,
  baslangic date not null,
  bitis date not null check (bitis > baslangic),
  kullanici uuid not null default auth.uid(),
  son timestamptz not null default now() + interval '10 minutes'
);
create index if not exists rez_tutmalar_villa on public.rez_tutmalar (villa_id, son);
alter table public.rez_tutmalar enable row level security;
revoke all on public.rez_tutmalar from anon, authenticated;
grant select on public.rez_tutmalar to authenticated;
create policy p_tutma_oku on public.rez_tutmalar for select to authenticated using (erisim_var(villa_id));

-- Ayır: başka birinin geçerli ayırması ya da rezervasyon/dış satış varsa hata. Aynı kişinin eski ayırması yenilenir.
create or replace function public.tutma_al(p_villa uuid, p_bas date, p_bit date) returns jsonb
language plpgsql security definer set search_path = public as $$
declare t rez_tutmalar; c record;
begin
  if not erisim_var(p_villa) then raise exception 'Yetkiniz yok'; end if;
  if p_bit <= p_bas then raise exception 'Tarih hatalı'; end if;
  delete from rez_tutmalar where son < now();
  select x.kullanici, x.son into c from rez_tutmalar x
   where x.villa_id = p_villa and x.kullanici <> auth.uid() and x.baslangic < p_bit and p_bas < x.bitis limit 1;
  if found then
    return jsonb_build_object('ok', false, 'neden', 'baska_tutma', 'bitis', c.son);
  end if;
  delete from rez_tutmalar where villa_id = p_villa and kullanici = auth.uid();
  insert into rez_tutmalar (villa_id, baslangic, bitis) values (p_villa, p_bas, p_bit) returning * into t;
  return jsonb_build_object('ok', true, 'id', t.id, 'son', t.son);
end $$;

create or replace function public.tutma_birak(p_id uuid) returns void
language sql security definer set search_path = public as $$
  delete from rez_tutmalar where id = p_id and kullanici = auth.uid();
$$;

-------------------------------------------------------------------------------
-- 5) Rezervasyonun dış kontrol durumu
--    'tamam'     = bütün dış takvimler kayıt anında okundu, boştu
--    'bekliyor'  = bir takvime ulaşılamadı; sunucu kontrol edip bildirim gönderecek
--    'cakisma'   = sonradan çakışma bulundu (çözülene kadar alarm)
-------------------------------------------------------------------------------
alter table public.rezervasyonlar add column if not exists dis_kontrol text not null default 'tamam'
  check (dis_kontrol in ('tamam','bekliyor','cakisma'));
alter table public.rezervasyonlar add column if not exists dis_kontrol_zamani timestamptz;
-- Yansıma tespiti için oluşturma anı (güncelleme her düzenlemede değişir, ona güvenilmez)
alter table public.rezervasyonlar add column if not exists olusturma timestamptz not null default now();

-- SUNUCU GÜVENCESİ: eski bir uygulama sürümü bile gerçek bir dış satışın üstüne rezervasyon yazamaz.
-- (Kullanıcının kendi dış satışını eşleştirmesi blok_eslestir ile yapılır; o blok artık engellemez.)
create or replace function public.rez_dis_engel() returns trigger
language plpgsql security definer set search_path = public as $$
declare b record; eski rezervasyonlar;
begin
  -- Uygulama kaydederken "upsert" kullanıyor: BEFORE INSERT tetiklenir ama satır zaten var olabilir.
  -- Var olan bir rezervasyonun tarihleri değişmiyorsa (not, telefon vb. düzenleme) asla engelleme.
  select * into eski from rezervasyonlar where id = new.id;
  if found and eski.baslangic = new.baslangic and eski.bitis = new.bitis then return new; end if;
  if coalesce(current_setting('vt.dis_engel_atla', true), '') = 'evet' then return new; end if;

  select d.baslangic, d.bitis, t.ad into b
    from dis_bloklar d join dis_takvimler t on t.id = d.takvim_id
   where d.villa_id = new.villa_id and t.aktif
     and d.tur in ('rezervasyon','bilinmiyor')
     and (d.bagli_rezervasyon is null or d.bagli_rezervasyon <> new.id)
     and d.baslangic < new.bitis and new.baslangic < d.bitis
     -- tarih değişikliğinde: eski tarihlerin yansıması olan 'bilinmiyor' blok engellemesin
     and not (eski.id is not null and d.tur = 'bilinmiyor' and d.baslangic = eski.baslangic and d.bitis = eski.bitis
              and d.ilk_gorulme >= eski.olusturma)
   limit 1;
  if found then
    raise exception 'DIS_CAKISMA: % % - %', b.ad, b.baslangic, b.bitis using errcode = 'P0001';
  end if;
  if exists (select 1 from rez_tutmalar x where x.villa_id = new.villa_id and x.son > now()
              and x.kullanici <> auth.uid() and x.baslangic < new.bitis and new.baslangic < x.bitis) then
    raise exception 'TUTMA_VAR: Bu tarihler şu an başka biri tarafından ayrılmış' using errcode = 'P0001';
  end if;
  return new;
end $$;
drop trigger if exists tr_rez_dis_engel on public.rezervasyonlar;
create trigger tr_rez_dis_engel before insert or update on public.rezervasyonlar
  for each row execute function public.rez_dis_engel();

-------------------------------------------------------------------------------
-- 6) Çakışmalar (alarm, çözülene kadar)
-------------------------------------------------------------------------------
create table if not exists public.cakismalar (
  id uuid primary key default gen_random_uuid(),
  villa_id uuid not null references public.villalar(id) on delete cascade,
  rezervasyon_id uuid references public.rezervasyonlar(id) on delete cascade,
  blok_id bigint references public.dis_bloklar(id) on delete set null,
  takvim_ad text,
  baslangic date not null,
  bitis date not null,
  durum text not null default 'acik' check (durum in ('acik','ayni_rez','cozuldu')),
  cozum_notu text check (cozum_notu is null or length(cozum_notu) <= 300),
  olusturma timestamptz not null default now(),
  cozum_zamani timestamptz,
  cozen uuid,
  son_bildirim timestamptz,
  bildirim_sayisi int not null default 0,
  unique (rezervasyon_id, blok_id)
);
create index if not exists cakismalar_acik on public.cakismalar (villa_id) where durum = 'acik';
alter table public.cakismalar enable row level security;
revoke all on public.cakismalar from anon, authenticated;
grant select on public.cakismalar to authenticated;
create policy p_cakisma_oku on public.cakismalar for select to authenticated using (erisim_var(villa_id));

-- Tarama: her eşitlemeden sonra sunucu çağırır. Yeni çakışmaları açar, kaybolanları kapatmaz (insan çözer).
-- Yansıma koruması: tur 'kapali' hiç alarm üretmez (platformlar bizim gönderdiğimiz günleri "kapalı" diye geri yansıtabilir).
-- 'bilinmiyor' bir blok, bizim rezervasyonumuzla BİREBİR aynı tarihlerde ve rezervasyonumuzdan SONRA ilk kez görüldüyse
-- büyük ihtimalle bizim gönderdiğimiz günün yansımasıdır → alarm yok.
create or replace function public.cakisma_tara(p_villa uuid default null) returns int
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  insert into cakismalar (villa_id, rezervasyon_id, blok_id, takvim_ad, baslangic, bitis)
  select r.villa_id, r.id, d.id, t.ad, greatest(r.baslangic, d.baslangic), least(r.bitis, d.bitis)
    from rezervasyonlar r
    join dis_bloklar d on d.villa_id = r.villa_id and d.baslangic < r.bitis and r.baslangic < d.bitis
    join dis_takvimler t on t.id = d.takvim_id and t.aktif
   where (p_villa is null or r.villa_id = p_villa)
     and r.bitis >= current_date
     and d.tur in ('rezervasyon','bilinmiyor')
     and (d.bagli_rezervasyon is null or d.bagli_rezervasyon <> r.id)
     and not (d.tur = 'bilinmiyor' and d.baslangic = r.baslangic and d.bitis = r.bitis
              and d.ilk_gorulme >= r.olusturma)
  on conflict (rezervasyon_id, blok_id) do nothing;
  get diagnostics n = row_count;
  update rezervasyonlar r set dis_kontrol = 'cakisma'
   where exists (select 1 from cakismalar c where c.rezervasyon_id = r.id and c.durum = 'acik')
     and (p_villa is null or r.villa_id = p_villa);
  return n;
end $$;

-- Sahip çakışmayı kapatır: 'ayni_rez' (aynı rezervasyon, eşleştir) ya da 'cozuldu' (not zorunlu)
create or replace function public.cakisma_coz(p_id uuid, p_durum text, p_not text default null) returns void
language plpgsql security definer set search_path = public as $$
declare c cakismalar;
begin
  select * into c from cakismalar where id = p_id;
  if c.id is null or not (sahip_mi(c.villa_id) or yonetici_mi()) then raise exception 'Yetkiniz yok'; end if;
  if p_durum not in ('ayni_rez','cozuldu') then raise exception 'Geçersiz durum'; end if;
  if p_durum = 'cozuldu' and length(coalesce(trim(p_not),'')) < 3 then raise exception 'Nasıl çözüldüğünü kısaca yazın'; end if;
  if p_durum = 'ayni_rez' and c.blok_id is not null then
    update dis_bloklar set bagli_rezervasyon = c.rezervasyon_id where id = c.blok_id;
  end if;
  update cakismalar set durum = p_durum, cozum_notu = p_not, cozum_zamani = now(), cozen = auth.uid() where id = p_id;
  update rezervasyonlar r set dis_kontrol = 'tamam'
   where r.id = c.rezervasyon_id and not exists (select 1 from cakismalar x where x.rezervasyon_id = r.id and x.durum = 'acik');
end $$;

-- Takvimdeki bir dış satışa dokunup "Misafir bilgisi ekle": o bloğa bağlı bir rezervasyon oluşturur ve id döner.
-- Uygulama ardından bu rezervasyonu normal düzenleme formunda açar (tarih aynı kaldığı sürece engel yok).
create or replace function public.blok_rez_olustur(p_blok bigint, p_misafir text default null) returns uuid
language plpgsql security definer set search_path = public as $$
declare b dis_bloklar; t dis_takvimler; yeni uuid;
begin
  select * into b from dis_bloklar where id = p_blok;
  if b.id is null or not sahip_mi(b.villa_id) and not yonetici_mi() then raise exception 'Yetkiniz yok'; end if;
  if b.bagli_rezervasyon is not null then return b.bagli_rezervasyon; end if;
  select * into t from dis_takvimler where id = b.takvim_id;
  perform set_config('vt.dis_engel_atla', 'evet', true);
  insert into rezervasyonlar (villa_id, baslangic, bitis, misafir, aciklama)
  values (b.villa_id, b.baslangic, b.bitis, coalesce(nullif(trim(p_misafir),''), t.ad || ' misafiri'), t.ad || ' üzerinden')
  returning id into yeni;
  perform set_config('vt.dis_engel_atla', '', true);
  update dis_bloklar set bagli_rezervasyon = yeni where id = p_blok;
  update cakismalar set durum = 'ayni_rez', cozum_zamani = now(), cozen = auth.uid() where blok_id = p_blok and durum = 'acik';
  return yeni;
end $$;

-------------------------------------------------------------------------------
-- 7) Yetkiler
-------------------------------------------------------------------------------
revoke execute on function public.takvim_durumlari(uuid), public.blok_eslestir(bigint, uuid), public.ical_anahtarim(uuid, boolean),
  public.tutma_al(uuid, date, date), public.tutma_birak(uuid), public.cakisma_coz(uuid, text, text), public.blok_rez_olustur(bigint, text) from public, anon;
grant execute on function public.takvim_durumlari(uuid), public.blok_eslestir(bigint, uuid), public.ical_anahtarim(uuid, boolean),
  public.tutma_al(uuid, date, date), public.tutma_birak(uuid), public.cakisma_coz(uuid, text, text), public.blok_rez_olustur(bigint, text) to authenticated;
revoke execute on function public.cakisma_tara(uuid), public.rez_dis_engel() from public, anon, authenticated;

-- Süresi geçen ayırmaları temizle
select cron.unschedule(jobid) from cron.job where jobname = 'tutma_temizle';
select cron.schedule('tutma_temizle', '*/5 * * * *', $$delete from public.rez_tutmalar where son < now() - interval '1 minute'$$);

-- NOT: 10 dakikada bir eşitleme cron'u, Edge Function "takvim-esitle" deploy edildikten sonra
-- ürün yöneticisi tarafından ayrıca kurulur (pg_net ile fonksiyon çağrısı).
