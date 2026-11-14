-- Villa Takvimim — Görev 13: özel teklifler (14 Kasım 2026)
create table if not exists public.teklifler (
  kod text primary key check (kod ~ '^[A-Z2-9]{8}$'),
  villa_id uuid not null references public.villalar(id) on delete cascade,
  giris date not null,
  cikis date not null check (cikis > giris),
  konaklama bigint not null check (konaklama >= 0),
  normal bigint,
  depozito bigint default 0,
  misafir_ad text,
  mesaj text,
  son_gecerlilik date,
  durum text not null default 'acik' check (durum in ('acik','kabul','iptal')),
  olusturan uuid default auth.uid(),
  olusturma timestamptz not null default now()
);
alter table public.teklifler enable row level security;
drop policy if exists p_teklif on public.teklifler;
create policy p_teklif on public.teklifler for all
  using (sahip_mi(villa_id) or yonetici_mi())
  with check (sahip_mi(villa_id) or yonetici_mi());
create index if not exists teklifler_villa on public.teklifler(villa_id);

create or replace function public.teklif_getir(p_kod text)
returns table(kod text, giris date, cikis date, konaklama bigint, normal bigint, depozito bigint,
              misafir_ad text, son_gecerlilik date, durum text, paylasim_ad text)
language sql stable security definer set search_path to 'public'
as $function$
  select t.kod, t.giris, t.cikis, t.konaklama, t.normal, t.depozito,
         split_part(coalesce(t.misafir_ad,''),' ',1), t.son_gecerlilik, t.durum, v.paylasim->>'ad'
  from teklifler t join villalar v on v.id = t.villa_id
  where t.kod = upper(trim(p_kod)) and v.silindi_tarih is null and t.durum <> 'iptal'
  limit 1;
$function$;
revoke all on function public.teklif_getir(text) from public;
grant execute on function public.teklif_getir(text) to anon, authenticated;
