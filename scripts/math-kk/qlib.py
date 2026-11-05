import json
from fractions import Fraction as F
Q=[];ANS={}
def cmpv(a,b): return 'C' if a==b else ('A' if a>b else 'B')
def qt(n,ra,ka,rb,kb,va=None,vb=None,ans=None,common=None,fig=None):
    """common=(ru,kk) text or dict(ru=,kk=,raw=,fig=)"""
    d={'n':n,'quant':{'A':{'ru':ra,'kk':ka},'B':{'ru':rb,'kk':kb}}}
    if common:
        c=common if isinstance(common,dict) else {'ru':common[0],'kk':common[1]}
        d['quant']['common']=c
    if fig: d['quant'].setdefault('common',{'ru':'','kk':''})['fig']=fig
    ANS[str(n)]=ans or cmpv(va,vb); Q.append(d)
def table(head,rows):
    h='<table class="t"><tr>'+''.join(f'<th>{x}</th>' for x in head)+'</tr>'
    return h+''.join('<tr>'+''.join(f'<td>{x}</td>' for x in r)+'</tr>' for r in rows)+'</table>'
def save(name):
    json.dump(Q,open(name+'.json','w'),ensure_ascii=False);json.dump(ANS,open(name+'_ans.json','w'))
    print(len(Q),''.join(ANS[str(i)] for i in range(1,len(Q)+1)))
