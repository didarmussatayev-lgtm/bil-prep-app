#!/bin/bash
# usage: run_variant.sh <N> <slug> <subdir>   (expects mk_bN.py, bkeys.json)
N=$1; SLUG=$2; SUB=$3
python3 mk_b$N.py && rm -rf out_ru out_kk && node render.js b$N.json out_ru ru && node render.js b$N.json out_kk kk
python3 - <<PY
import json
k=json.load(open('bkeys.json'))
json.dump({str(n):a for n,a in k['$N'].items()},open('ans_b$N.json','w'))
PY
python3 publish.py $SLUG $SUB ans_b$N.json
python3 sheet.py out_kk k$N
