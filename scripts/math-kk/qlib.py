import json
from fractions import Fraction as F
Q=[];ANS={};SOL={}
def cmpv(a,b): return 'C' if a==b else ('A' if a>b else 'B')
def qt(n,ra,ka,rb,kb,va=None,vb=None,ans=None,common=None,fig=None):
    """common=(ru,kk) text or dict(ru=,kk=,raw=,fig=)"""
    d={'n':n,'quant':{'A':{'ru':ra,'kk':ka},'B':{'ru':rb,'kk':kb}}}
    if common:
        c=common if isinstance(common,dict) else {'ru':common[0],'kk':common[1]}
        d['quant']['common']=c
    if fig: d['quant'].setdefault('common',{'ru':'','kk':''})['fig']=fig
    a=ans or cmpv(va,vb); ANS[str(n)]=a
    def f(v):
        if v is None: return None
        try: x=float(v); return (str(round(x,4)).rstrip('0').rstrip('.')) if x!=int(x) else str(int(x))
        except Exception: return str(v)
    N={'A':('в колонке A больше','A бағанында үлкен'),'B':('в колонке B больше','B бағанында үлкен'),'C':('значения равны','мәндер тең'),'D':('данных недостаточно','деректер жеткіліксіз')}
    if va is not None and vb is not None and not ans: ru=f"A = {f(va)}, B = {f(vb)}. {N[a][0][0].upper()+N[a][0][1:]} — ответ {a}."; kk=f"A = {f(va)}, B = {f(vb)}. {N[a][1]} — жауап {a}."
    elif a=='D': ru="Значения зависят от неизвестных величин, поэтому однозначно сравнить нельзя — ответ D."; kk="Мәндер белгісіз шамаларға тәуелді, сондықтан нақты салыстыруға болмайды — жауап D."
    else: ru=f"Сравнение по условию (с учётом ограничений): ответ {a}."; kk=f"Шарт бойынша салыстыру (шектеулерді ескере отырып): жауап {a}."
    SOL[str(n)]=(ru,kk); Q.append(d)
def table(head,rows):
    h='<table class="t"><tr>'+''.join(f'<th>{x}</th>' for x in head)+'</tr>'
    return h+''.join('<tr>'+''.join(f'<td>{x}</td>' for x in r)+'</tr>' for r in rows)+'</table>'
def save(name):
    json.dump(Q,open(name+'.json','w'),ensure_ascii=False);json.dump(ANS,open(name+'_ans.json','w'));json.dump(SOL,open(name+'_sol.json','w'),ensure_ascii=False)
    print(len(Q),''.join(ANS[str(i)] for i in range(1,len(Q)+1)))
