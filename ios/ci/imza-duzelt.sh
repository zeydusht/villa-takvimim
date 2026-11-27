#!/bin/bash
# IOS_YAYIN_DERSLERI §1: Sertifika adındaki "İ" (TEKİN) imza kuralında (designated requirement)
# "I + üst nokta" (49cc87) diye bölünüyor, Apple imzayı geçersiz sayıyor. Bu betik:
#   1) .ipa içindeki her imzalı paketin kuralına bakar,
#   2) bozuksa önce Frameworks/*, en son .app'i kural 49cc87 -> c4b0 düzeltilerek yeniden imzalar,
#   3) codesign --verify ile doğrular ve .ipa'yı yeniden paketler.
# Kullanım (Mac): bash ios/ci/imza-duzelt.sh build/export/App.ipa
set -euo pipefail

IPA="${1:?Kullanım: bash ios/ci/imza-duzelt.sh <App.ipa>}"
IPA="$(cd "$(dirname "$IPA")" && pwd)/$(basename "$IPA")"
ACIK="$(mktemp -d)"   # .ipa'nın açıldığı yer
SERT="$(mktemp -d)"   # imzadan çıkarılan sertifikalar
trap 'rm -rf "$ACIK" "$SERT"' EXIT

ditto -x -k "$IPA" "$ACIK"
APP="$(ls -d "$ACIK"/Payload/*.app | head -1)"
[ -d "$APP" ] || { echo "::error::.ipa içinde uygulama bulunamadı."; exit 1; }

# Sıra önemli: önce içteki paketler, en son .app (dıştaki imza içtekilerin özetini taşır)
PAKETLER=()
for d in "$APP"/Frameworks/* "$APP"/PlugIns/*; do [ -e "$d" ] && PAKETLER+=("$d"); done
PAKETLER+=("$APP")

kural() { codesign -d -r- "$1" 2>&1 | sed -n 's/^designated => //p'; }
bozuk_mu() { LC_ALL=C grep -q -e '49cc87' -e $'I\xcc\x87'; }
duzelt() { LC_ALL=C sed -e 's/49cc87/c4b0/g' -e $'s/I\xcc\x87/\xc4\xb0/g'; }

BOZUK=0
for P in "${PAKETLER[@]}"; do
  if kural "$P" | bozuk_mu; then echo "Bozuk imza kuralı: ${P#$ACIK/}"; BOZUK=1; fi
done

if [ "$BOZUK" = 0 ]; then
  echo "İmza kuralı doğru, düzeltme gerekmedi."
  codesign --verify --deep --strict -v "$APP"
  exit 0
fi

# Aynı sertifikayla yeniden imzalanmalı: SHA-1'i .app'in kendi imzasından alınır
( cd "$SERT" && codesign -d --extract-certificates="$SERT/c" "$APP" >/dev/null 2>&1 )
SHA="$(openssl x509 -inform DER -in "$SERT/c0" -noout -fingerprint -sha1 | cut -d= -f2 | tr -d ':')"
if ! security find-identity -v -p codesigning | grep -qi "$SHA"; then
  echo "::error::İmza kuralı bozuk (İ harfi) ama sertifika bu makinede yok, düzeltilemedi. PM'e haber ver: dağıtım sertifikası (.p12) GitHub Secrets'a eklenmeli."
  exit 1
fi

for P in "${PAKETLER[@]}"; do
  R="$(kural "$P" | duzelt)"
  codesign -f -s "$SHA" --preserve-metadata=identifier,entitlements,flags \
    --requirements "=designated => $R" "$P"
done

for P in "${PAKETLER[@]}"; do
  if kural "$P" | bozuk_mu; then echo "::error::Düzeltmeden sonra da bozuk: ${P#$ACIK/}"; exit 1; fi
done
SONUC="$(codesign --verify --deep --strict -v "$APP" 2>&1)" || { echo "$SONUC"; echo "::error::Yeniden imzalanan uygulama doğrulanamadı."; exit 1; }
echo "$SONUC"
echo "$SONUC" | grep -q "satisfies its Designated Requirement" || { echo "::error::İmza kuralı hâlâ tutmuyor."; exit 1; }

# .ipa'yı yeniden paketle (Payload, SwiftSupport, Symbols ne varsa)
YENI="$IPA.yeni"
( cd "$ACIK" && zip -qry "$YENI" . )
mv -f "$YENI" "$IPA"
echo "İmza düzeltildi (İ harfi), .ipa yeniden paketlendi."
