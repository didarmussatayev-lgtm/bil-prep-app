#!/bin/bash
# usage: run_a.sh <N> <slug> <subdir>   (expects mk_aN.py, aN_ans.json)
N=$1; SLUG=$2; SUB=$3
python3 mk_a$N.py && rm -rf out_ru out_kk && node render.js a$N.json out_ru ru && node render.js a$N.json out_kk kk
python3 publish.py $SLUG $SUB a${N}_ans.json
python3 sheet.py out_kk k$N
