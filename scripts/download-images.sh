#!/bin/bash
set -e
BASE="https://gianglangthang.vn/assets"
ROOT="/Users/nguyentientrien/Desktop/Frelancer/gianglangthang/public/images"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
REF="https://gianglangthang.vn/"

dl() {
  local url="$1"
  local out="$2"
  mkdir -p "$(dirname "$out")"
  if [ ! -s "$out" ]; then
    curl -sL -A "$UA" -e "$REF" -o "$out" "$url"
  fi
}

# logo + hero
dl "$BASE/logo.png" "$ROOT/logo.png"
dl "$BASE/anh-dep.jpg" "$ROOT/hero.jpg"

# tours
SLUGS="ngu-chi-son fansipan nam-kang-ho-tao can-chu can-chu-mieu nui-muoi ta-chi-nhu lao-than ta-chi-nhu-nam-nghiep lung-cung phu-sa-phin samu nhiu-co-san ta-lien-son ky-quan-san putaleng2d putaleng quang-binh cua-tu ham-lon ham-lon-suoi da-giang na-hang ba-vi"
for s in $SLUGS; do
  dl "$BASE/tours/$s/1.jpg" "$ROOT/tours/$s/1.jpg"
  for i in 1 2 3 4; do
    dl "$BASE/tours/$s/anh-dep/$i.jpg" "$ROOT/tours/$s/anh-dep/$i.jpg"
  done
done

# charity kickoff (tu-thien)
for i in 1 3 4 5; do
  dl "$BASE/tu-thien/$i.png" "$ROOT/tu-thien/$i.png"
done

# htyt events 1-6, ext varies (jpg for 6, png otherwise) - try both
for e in 1 2 3 4 5 6; do
  for i in 1 2 3 4; do
    if [ "$e" = "6" ]; then
      dl "$BASE/htyt/$e/$i.jpg" "$ROOT/htyt/$e/$i.jpg"
    else
      dl "$BASE/htyt/$e/$i.png" "$ROOT/htyt/$e/$i.png"
    fi
  done
done

# gallery moments 1-29
for i in $(seq 1 29); do
  dl "$BASE/htyt/other/$i.png" "$ROOT/htyt/other/$i.png"
done

echo "DONE"
