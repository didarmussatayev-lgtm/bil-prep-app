import json,sys
from PIL import Image
slug,sub,ans=sys.argv[1],sys.argv[2],json.loads(open(sys.argv[3]).read())
M='/home/user/bil-prep-app/data/exams/math/manifest.json'
m=json.load(open(M)); p=[x for x in m['papers'] if x['slug']==slug][0]
R=f'/home/user/bil-prep-app/public/exams/math/{sub}/'
for q in p['questions']:
    n=q['n']
    if str(n) in ans and q['answer']!=ans[str(n)]: print('DIFF',n,'book',q['answer'],'mine',ans[str(n)])
    for L,suf in (('ru',''),('kk','.kk')):
        im=Image.open(f'out_{L}/q{n:02d}.png').convert('RGB')
        if im.size[0]>720: im=im.resize((720,int(im.size[1]*720/im.size[0])),Image.LANCZOS)
        im.save(f'{R}q{n:02d}{suf}.webp',quality=86)
    if str(n) in ans: q['answer']=ans[str(n)]
    q['image']=f'/exams/math/{sub}/q{n:02d}.webp'; q['imageKk']=f'/exams/math/{sub}/q{n:02d}.kk.webp'
json.dump(m,open(M,'w'),ensure_ascii=False,indent=1)
