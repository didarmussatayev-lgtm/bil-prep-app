import json,sys
from PIL import Image
# usage: rerender.py <slug> <n> [answer]  — перекладывает картинки вопроса из out_ru/out_kk и (опц.) меняет ответ
slug,n=sys.argv[1],int(sys.argv[2])
M='/home/user/bil-prep-app/data/exams/math/manifest.json'
m=json.load(open(M)); p=[x for x in m['papers'] if x['slug']==slug][0]
q=[x for x in p['questions'] if x['n']==n][0]
base='/home/user/bil-prep-app/public'+q['image']
for src,dst in ((f'out_ru/q{n:02d}.png',base),(f'out_kk/q{n:02d}.png',base.replace('.webp','.kk.webp'))):
    im=Image.open(src).convert('RGB')
    if im.size[0]>720: im=im.resize((720,int(im.size[1]*720/im.size[0])),Image.LANCZOS)
    im.save(dst,quality=86)
if len(sys.argv)>3: q['answer']=sys.argv[3]
json.dump(m,open(M,'w'),ensure_ascii=False,indent=1);print('ok',slug,n,q['answer'])
