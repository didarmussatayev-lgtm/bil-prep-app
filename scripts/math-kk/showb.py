import json,sys
m=json.load(open('/home/user/bil-prep-app/data/exams/math/manifest.json'))
N=int(sys.argv[1]); p=[x for x in m['papers'] if x['slug']==f'math-collection-b-{N:02d}'][0]
q=json.load(open(f'b{N}.json')); A={x['n']:x['answer'] for x in p['questions']}
for d in q:
    n=d['n']; o=d['ru'].get('opts') or []; i='ABCDE'.index(A[n])
    t=d['ru']['q'].replace('\n',' ')
    print(n,A[n],(o[i] if i<len(o) else '(fig)'),'||',t[:170])
