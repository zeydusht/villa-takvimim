-- Görev 40 (veritabanı) — giriş bildirimleri yeniden düzenlendi
-- Bu dosyayı PM (Claude sohbeti) uygular, Zeyd'in "onay"ından sonra. Claude Code bu dosyayı ÇALIŞTIRMAZ.
--
-- Değişiklikler:
--  1) 17:00'deki otomatik "X giriş yaptı" bildirimi KALDIRILDI (misafir daha erken/geç gelebilir, para alınmadan "girdi" demesin)
--  2) 15:00 "Bir saat sonra giriş" sadeleşti: "16:00'da X gelecek (4 kişi) · 1 saat kaldı". Para yazmaz. Zaten yerleştirildiyse gitmez.
--  3) Misafir "yerleştirildi" olarak işaretlenince ANINDA bildirim (işaretleyen kişiye gitmez):
--       sahibe: "X yerleştirildi · ödemesi tam alındı (13.000 TL)" / "· ödeme eksik: 12.000 TL alındı, 1.000 TL kaldı" /
--               "X ödeme alınmadan yerleştirildi · 13.000 TL alınacak"
--       bakıcıya: "X yerleştirildi" (tutar yazmaz)
--  4) 18:00: giriş günü hâlâ işaretlenmediyse hatırlatma: "X yerleştirildi mi? Geldiyse uygulamada 'Misafiri yerleştir'e dokunun."

-- ---------- 3) anlık bildirim kuyruğu ----------
create table if not exists public.bildirim_anlik (
  id          bigserial primary key,
  kullanici   uuid not null,
  baslik      text not null,
  metin       text not null,
  anahtar     text not null,
  olusturma   timestamptz not null default now(),
  gonderildi  timestamptz
);
alter table public.bildirim_anlik enable row level security;   -- politika yok: istemci hiç okuyamaz/yazamaz
revoke all on public.bildirim_anlik from anon, authenticated;
create index if not exists bildirim_anlik_bekleyen on public.bildirim_anlik (gonderildi) where gonderildi is null;

create or replace function public.tl_yaz(x bigint) returns text
language sql immutable as $$ select replace(to_char(coalesce(x,0),'FM999G999G999'), ',', '.') || ' TL' $$;

create or replace function public.yerlesme_bildir() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_ad text; ara bigint; dep bigint; od bigint; kalan bigint; m_sahip text; m_bakici text;
begin
  if new.giris_onay is null or old.giris_onay is not null then return new; end if;

  select v.ad,
         coalesce(mm.tutar,0) + coalesce(mm.ek_ucret,0),
         coalesce(mm.depozito_tutar,
           coalesce(nullif(regexp_replace(coalesce(v.bilgi->>'depozito',''),'[^0-9]','','g'),'')::bigint,0))
    into v_ad, ara, dep
    from villalar v left join rezervasyon_mali mm on mm.rezervasyon_id = new.id
   where v.id = new.villa_id;
  select coalesce(sum(tutar),0) into od from odemeler where rezervasyon_id = new.id;
  kalan := greatest(0, ara + dep - od);

  m_bakici := new.misafir || ' yerleştirildi';
  if ara + dep = 0 then
    m_sahip := m_bakici;
  elsif kalan = 0 then
    m_sahip := new.misafir || ' yerleştirildi · ödemesi tam alındı (' || tl_yaz(od) || ')';
  elsif od > 0 then
    m_sahip := new.misafir || ' yerleştirildi · ödeme eksik: ' || tl_yaz(od) || ' alındı, ' || tl_yaz(kalan) || ' kaldı';
  else
    m_sahip := new.misafir || ' ödeme alınmadan yerleştirildi · ' || tl_yaz(kalan) || ' alınacak';
  end if;

  insert into bildirim_anlik (kullanici, baslik, metin, anahtar)
  select e.kullanici, v_ad, case when e.rol = 'sahip' then m_sahip else m_bakici end, 'yer-' || new.id
    from villa_erisim e
   where e.villa_id = new.villa_id
     and e.kullanici is distinct from auth.uid();     -- işaretleyen kişiye gitmez

  if found then perform public.bildirim_tetikle(); end if;   -- pg_net: istek commit sonrası gider
  return new;
end $$;
revoke all on function public.yerlesme_bildir() from public, anon, authenticated;

-- (tetikleyici yeni; önce silmeye gerek yok)
create trigger tr_yerlesme_bildir after update of giris_onay on public.rezervasyonlar
  for each row execute function public.yerlesme_bildir();

-- ---------- 1, 2, 4) saatlik kuyruk ----------
create or replace function public.bildirim_kuyrugu()
returns table(kullanici uuid, baslik text, metin text, anahtar text, adres text, p256dh text, auth text)
language plpgsql security definer set search_path = public as $$
declare
  simdi timestamptz := timezone('Europe/Istanbul', now());
  bugun date := simdi::date;
  saat int := extract(hour from simdi)::int;
  gunNo int := extract(day from simdi)::int;
begin
  create temporary table if not exists _kuyruk (
    kullanici uuid, baslik text, metin text, anahtar text) on commit drop;
  delete from _kuyruk where true;

  if saat = 9 then
    insert into _kuyruk (kullanici, baslik, metin, anahtar)
    select e.kullanici, v.ad,
      case
        when r.baslangic = bugun then 'Bugün 16:00 giriş · ' || r.misafir ||
          coalesce(' (' || r.kisi || ' kişi)','')
        when r.baslangic = bugun + 1 then 'Yarın 16:00 giriş · ' || r.misafir ||
          coalesce(' (' || r.kisi || ' kişi)','')
        when r.bitis = bugun then 'Bugün 10:00 çıkış · ' || r.misafir
        else 'Yarın 10:00 çıkış · ' || r.misafir
      end,
      'rez-' || r.id || '-' ||
        case when r.baslangic = bugun then 'g0' when r.baslangic = bugun + 1 then 'g1'
             when r.bitis = bugun then 'c0' else 'c1' end
    from rezervasyonlar r
    join villalar v on v.id = r.villa_id
    join villa_erisim e on e.villa_id = r.villa_id
    where r.baslangic in (bugun, bugun + 1) or r.bitis in (bugun, bugun + 1);

    insert into _kuyruk (kullanici, baslik, metin, anahtar)
    select e.kullanici, v.ad,
      'Bir saat sonra çıkış · ' || r.misafir ||
      case when coalesce(m.depozito_tutar,0) > 0
           then ' · iade edilecek depozito ' ||
                replace(to_char(m.depozito_tutar,'FM999G999G999'), ',', '.') || ' TL'
           else '' end,
      'cikis1-' || r.id
    from rezervasyonlar r
    join villalar v on v.id = r.villa_id
    join villa_erisim e on e.villa_id = r.villa_id
    left join rezervasyon_mali m on m.rezervasyon_id = r.id
    where r.bitis = bugun;
  end if;

  -- 2) 15:00: sade "1 saat kaldı"; zaten yerleştirildiyse gitmez
  if saat = 15 then
    insert into _kuyruk (kullanici, baslik, metin, anahtar)
    select e.kullanici, v.ad,
      '16:00''da ' || r.misafir || ' gelecek' || coalesce(' (' || r.kisi || ' kişi)','') || ' · 1 saat kaldı',
      'giris1-' || r.id
    from rezervasyonlar r
    join villalar v on v.id = r.villa_id
    join villa_erisim e on e.villa_id = r.villa_id
    where r.baslangic = bugun and r.giris_onay is null;
  end if;

  -- 1) 17:00 "giriş yaptı" kaldırıldı.
  -- 4) 18:00: giriş günü hâlâ işaretlenmediyse hatırlatma
  if saat = 18 then
    insert into _kuyruk (kullanici, baslik, metin, anahtar)
    select e.kullanici, v.ad,
      r.misafir || ' yerleştirildi mi? Geldiyse uygulamada "Misafiri yerleştir"e dokunun.',
      'giris3-' || r.id
    from rezervasyonlar r
    join villalar v on v.id = r.villa_id
    join villa_erisim e on e.villa_id = r.villa_id
    where r.baslangic = bugun and r.giris_onay is null;
  end if;

  if saat = 11 then
    insert into _kuyruk (kullanici, baslik, metin, anahtar)
    select e.kullanici, v.ad, r.misafir || ' çıkış yaptı · villa hazırlığı',
      'cikis2-' || r.id
    from rezervasyonlar r
    join villalar v on v.id = r.villa_id
    join villa_erisim e on e.villa_id = r.villa_id
    where r.bitis = bugun;
  end if;

  if gunNo = 1 and saat = 10 then
    insert into _kuyruk (kullanici, baslik, metin, anahtar)
    select e.kullanici, v.ad,
      'Geçen ayın gelir gider raporunu indirmeyi unutmayın. Gelir & gider ekranından PDF alabilirsiniz.',
      'rapor-' || to_char(bugun,'YYYY-MM')
    from villalar v
    join villa_erisim e on e.villa_id = v.id and e.rol = 'sahip';
  end if;

  insert into _kuyruk (kullanici, baslik, metin, anahtar)
  select y.id, 'Villa Takvimim',
    'Yeni kayıt onay bekliyor: ' || coalesce(p.eposta,'(e-posta yok)'),
    'onay-' || p.id
  from profiller p
  cross join profiller y
  where p.onay = false and p.askida = false
    and (y.yonetici = true or y.onayci = true)
    and y.onay = true and y.askida = false;

  -- 3) anlık bildirimler (yerleştirme)
  insert into _kuyruk (kullanici, baslik, metin, anahtar)
  select b.kullanici, b.baslik, b.metin, b.anahtar
    from bildirim_anlik b
   where b.gonderildi is null and b.olusturma > now() - interval '1 day';
  update bildirim_anlik set gonderildi = now() where gonderildi is null;

  delete from _kuyruk k using bildirim_gonderim b
   where b.kullanici = k.kullanici and b.anahtar = k.anahtar and b.gun = bugun;

  insert into bildirim_gonderim (kullanici, anahtar, gun)
  select distinct k.kullanici, k.anahtar, bugun from _kuyruk k
  on conflict do nothing;

  return query
    select k.kullanici, k.baslik, k.metin, k.anahtar, a.adres, a.p256dh, a.auth
    from _kuyruk k
    join push_abonelik a on a.kullanici = k.kullanici
    join profiller p2 on p2.id = k.kullanici and p2.onay = true;
end $$;
