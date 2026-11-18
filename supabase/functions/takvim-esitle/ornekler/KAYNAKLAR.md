# Örnek iCal dosyaları

Biçimler internetteki gerçek dışa aktarımlardan ve kanal yöneticisi belgelerinden alındı (18 Kasım 2026). Tarihler, UID'ler ve
misafir bilgileri uydurmadır. Platformlar biçimi duyurmadan değiştirebilir; tür belirleme bu yüzden `bilinmiyor`u varsayılan tutar
(bilinmeyen = satış gibi davranılır).

| Dosya | Biçim | Kaynak |
|---|---|---|
| `airbnb.ics` | `SUMMARY:Reserved` + açıklamada rezervasyon adresi ve telefonun son 4 hanesi; kapalı günler `SUMMARY:Airbnb (Not available)`; `DTSTART;VALUE=DATE`, DTEND çıkış günü (dahil değil) | MotoPress forumu "Airbnb iCal ICS sync issue"; Airbnb topluluğu "No Guest Names on iCal", "Calendar export hold wrong information" |
| `booking.ics` | `PRODID:-//admin.booking.com\, b.v.//NONSGML v1.0//EN`; her olay `SUMMARY:CLOSED - Not available` (satış ile kapatma ayırt edilmez); DTSTAMP yok | MotoPress forumu "Import 'closed' dates from booking.com"; Airbnb topluluğu "iCAL Calendar Import Issue from Booking.com" |
| `vrbo.ics` | `PRODID:-//HomeAway.com\, Inc.//EN`; `SUMMARY:Reserved - <ad>`, kapalı `SUMMARY:Blocked` | iPRO "Guide to Importing iCal Data from Airbnb, Booking.com, and VRBO"; Hostaway "Vrbo Connect via iCal" |
| `diger.ics` | Yerel site örneği: tarih-saatli DTSTART/DTEND, DTEND'siz olay (1 gün), STATUS:CANCELLED, SUMMARY'de misafir adı, DESCRIPTION'da telefon ve tutar (okuyucu bunları SAKLAMAZ) | RFC 5545 |

Bağlantılar:
- https://motopress.com/forums/topic/airbnb-ical-ics-sync-issue/
- https://motopress.com/forums/topic/import-closed-dates-from-booking-com/
- https://community.withairbnb.com/t5/Help/No-Guest-Names-on-ICal-seriously/m-p/1189415
- https://community.withairbnb.com/t5/Help-with-your-business/iCAL-Calendar-Import-Issue-from-Booking-com/m-p/360608
- https://iprosoftware.freshdesk.com/support/solutions/articles/4000207739-guide-to-importing-ical-data-from-airbnb-booking-com-and-vrbo-into-ipro
- https://support.hostaway.com/hc/en-us/articles/360002562114-Vrbo-Connect-via-iCal
