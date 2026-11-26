#!/bin/sh
# Görev 45.6: WhatsApp önizleme testi (wrangler pages dev + sahte Supabase).
# Hazırlık: node docs/qa/gorev45/sahte-supabase.js &
#           npx wrangler pages dev www --port 8788 --binding SUPABASE_URL=http://127.0.0.1:8790 &
B=${B:-http://127.0.0.1:8788}
UA="WhatsApp/2.23.20.0 A"
for p in /villa-salta-k7m2 "/villa-salta-k7m2?teklif=ab12cd34" /villa-kacis-x1y2z3 /villa-fotosuz-a1b2c3 /villa-kapakli-a1b2c3 /villa-yok-a1b2c3 /villa-yavas-a1b2c3; do
  echo "=== $p"
  curl -s -A "$UA" -o $TEMP/onz.html -w "durum %{http_code} | süre %{time_total} sn | " -D $TEMP/onz.h "$B$p"
  grep -i "^cache-control" $TEMP/onz.h | tr -d '\r'
  sed -n '/og:basla/,/og:bitir/p' $TEMP/onz.html | grep -E "<title>|og:title|og:image|og:url"
  grep -c 'id="kok"\|<script src="config.js">' $TEMP/onz.html | sed 's/^/g.html gövdesi var (eşleşme sayısı): /'
done
