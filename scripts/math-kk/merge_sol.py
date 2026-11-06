import json,sys
M='/home/user/bil-prep-app/data/exams/math/manifest.json'
m=json.load(open(M))
pairs={'qa1':'math-quant-a-01','qa2':'math-quant-a-02','qa3':'math-quant-a-03','qb1':'math-quant-b-01','qb2':'math-quant-b-02','qb3':'math-quant-b-03','qb4':'math-quant-b-04','qb5':'math-quant-b-05'}
bad=0
for k,slug in pairs.items():
    sol=json.load(open(f'{k}_sol.json')); ans=json.load(open(f'{k}_ans.json'))
    p=[x for x in m['papers'] if x['slug']==slug][0]
    for q in p['questions']:
        n=str(q['n'])
        if q['answer']!=ans[n]: bad+=1; print('MISMATCH',slug,n,q['answer'],ans[n])
        q['solution'],q['solutionKk']=sol[n]
json.dump(m,open(M,'w'),ensure_ascii=False,indent=1);print('mismatch',bad)
