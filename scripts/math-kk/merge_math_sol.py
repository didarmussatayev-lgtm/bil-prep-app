import json,sys,re
# usage: merge_math_sol.py <slug> <file.txt> <ans.json>; строки "n|цепочка"; добавляется «Ответ: X)»
slug,fn,ansf=sys.argv[1:4]
M='/home/user/bil-prep-app/data/exams/math/manifest.json'
m=json.load(open(M)); ans=json.load(open(ansf))
p=[x for x in m['papers'] if x['slug']==slug][0]
sol={}
for l in open(fn).read().split('\n'):
    if '|' in l: n,t=l.split('|',1); sol[int(n)]=t.strip()
miss=[q['n'] for q in p['questions'] if q['n'] not in sol]
for q in p['questions']:
    if q['n'] in sol:
        t=sol[q['n']]; L=q['answer']
        q['solution']=f"{t}. Ответ: {L}."; q['solutionKk']=f"{t}. Жауап: {L}."
json.dump(m,open(M,'w'),ensure_ascii=False,indent=1); print(slug,'solved',len(sol),'missing',miss)
