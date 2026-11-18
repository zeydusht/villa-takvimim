-- VERITABANI_GOREV30.sql — Abonelik altyapısı
-- UYGULANDI: 2026-11-18 (Zeyd onayıyla). Claude Code ÇALIŞTIRMAZ, sadece adları kullanır.
-- Sınır uygulaması başlangıçta KAPALI (sinir_acik = false): kimse etkilenmez.

create table if not exists public.plan_ayarlari (
  anahtar text primary key,
  deger jsonb not null
);
insert into public.plan_ayarlari values
  ('ucretsiz_villa', '3'),       -- ücretsiz planda en fazla villa
  ('deneme_gun', '30'),          -- ilk ay ücretsiz (mağaza deneme süresi)
  ('sinir_acik', 'false'),       -- true olunca 4. villa için abonelik gerekir
  ('urun_aylik', '"villatakvim_pro_aylik"')
on conflict (anahtar) do nothing;
alter table public.plan_ayarlari enable row level security;
revoke all on public.plan_ayarlari from anon, authenticated;
grant select on public.plan_ayarlari to authenticated;
create policy p_plan_oku on public.plan_ayarlari for select to authenticated using (true);

create table if not exists public.abonelikler (
  kullanici uuid primary key references auth.users(id) on delete cascade,
  durum text not null check (durum in ('deneme','aktif','iptal_edildi','suresi_doldu','manuel')),
  kaynak text not null check (kaynak in ('apple','google','manuel')),
  urun text,
  bitis timestamptz,
  musteri_kimlik text,            -- RevenueCat app_user_id (= kullanıcı uuid)
  notu text,
  guncelleme timestamptz not null default now()
);
alter table public.abonelikler enable row level security;
revoke all on public.abonelikler from anon, authenticated;
grant select on public.abonelikler to authenticated;
create policy p_abonelik_oku on public.abonelikler for select to authenticated
  using (kullanici = auth.uid() or yonetici_mi());
-- Yazma: sadece sunucu (webhook, service_role) ve yönetici RPC'leri.

create or replace function public.abone_mi(p uuid default auth.uid()) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from abonelikler a where a.kullanici = p
     and a.durum in ('deneme','aktif','manuel','iptal_edildi')
     and (a.bitis is null or a.bitis > now()));
$$;

create or replace function public.villa_ekleyebilir() returns boolean
language sql stable security definer set search_path = public as $$
  select not coalesce((select (deger)::text::boolean from plan_ayarlari where anahtar = 'sinir_acik'), false)
      or abone_mi()
      or (select count(*) from villalar where sahip = auth.uid() and silindi_tarih is null)
         < coalesce((select (deger)::text::int from plan_ayarlari where anahtar = 'ucretsiz_villa'), 3);
$$;

create or replace function public.abonelik_durumum() returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'abone', abone_mi(),
    'durum', (select durum from abonelikler where kullanici = auth.uid()),
    'kaynak', (select kaynak from abonelikler where kullanici = auth.uid()),
    'bitis', (select bitis from abonelikler where kullanici = auth.uid()),
    'villa_sayisi', (select count(*) from villalar where sahip = auth.uid() and silindi_tarih is null),
    'ucretsiz_villa', coalesce((select (deger)::text::int from plan_ayarlari where anahtar = 'ucretsiz_villa'), 3),
    'sinir_acik', coalesce((select (deger)::text::boolean from plan_ayarlari where anahtar = 'sinir_acik'), false),
    'villa_ekleyebilir', villa_ekleyebilir());
$$;

-- Yönetici: elle üyelik ver / kaldır (kayda geçer)
create or replace function public.abonelik_ver(p_id uuid, p_gun int, p_not text default null) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not yonetici_mi() then raise exception 'Yetkiniz yok'; end if;
  insert into abonelikler (kullanici, durum, kaynak, bitis, notu, guncelleme)
  values (p_id, 'manuel', 'manuel', case when p_gun is null then null else now() + make_interval(days => p_gun) end, p_not, now())
  on conflict (kullanici) do update set durum = 'manuel', kaynak = 'manuel',
    bitis = excluded.bitis, notu = excluded.notu, guncelleme = now();
  insert into destek_kayitlari (yonetici, villa_id, hedef_kullanici, islem) values (auth.uid(), null, p_id, 'abonelik_ver');
end $$;

create or replace function public.abonelik_kaldir(p_id uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not yonetici_mi() then raise exception 'Yetkiniz yok'; end if;
  update abonelikler set durum = 'suresi_doldu', bitis = now(), guncelleme = now() where kullanici = p_id and kaynak = 'manuel';
  insert into destek_kayitlari (yonetici, villa_id, hedef_kullanici, islem) values (auth.uid(), null, p_id, 'abonelik_kaldir');
end $$;

create or replace function public.tum_abonelikler() returns setof public.abonelikler
language plpgsql stable security definer set search_path = public as $$
begin
  if not yonetici_mi() then raise exception 'Yetkiniz yok'; end if;
  return query select * from abonelikler;
end $$;

revoke execute on function public.abone_mi(uuid), public.villa_ekleyebilir(), public.abonelik_durumum(),
  public.abonelik_ver(uuid,int,text), public.abonelik_kaldir(uuid), public.tum_abonelikler() from public, anon;
grant execute on function public.abone_mi(uuid), public.villa_ekleyebilir(), public.abonelik_durumum(),
  public.abonelik_ver(uuid,int,text), public.abonelik_kaldir(uuid), public.tum_abonelikler() to authenticated;

-- Villa ekleme kuralına sınır kontrolü (sinir_acik=false iken etkisi yok)
alter policy p_villa_ekle on public.villalar
  with check (sahip = auth.uid() and onayli() and villa_ekleyebilir());

-- Mağaza bildirimleri: Edge Function "abonelik-webhook" (RevenueCat) service_role ile abonelikler'e yazar.
