#!/bin/bash
# usage: run_q.sh <name> <slug> <subdir>   (expects mk_<name>.py producing <name>.json and <name>_ans.json)
N=$1; SLUG=$2; SUB=$3
python3 mk_$N.py && rm -rf out_ru out_kk && node render.js $N.json out_ru ru && node render.js $N.json out_kk kk && python3 publish.py $SLUG $SUB ${N}_ans.json | grep -c DIFF
python3 sheet.py out_kk k$N
