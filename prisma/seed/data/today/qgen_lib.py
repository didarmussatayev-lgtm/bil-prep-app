import sys,math
from fractions import Fraction as F
items=[]
def q(ra,ka,rb,kb,va=None,vb=None,ans=None,common=None,shown=None):
    items.append((ra,ka,rb,kb,va,vb,ans,common,shown))
def cm(a,b): return 'C' if a==b else ('A' if a>b else 'B')
def esc(s): return "`"+s.replace("\\","\\\\").replace("`","\\`")+"`"
NAMES={'A':('в колонке A значение больше','A бағанындағы мән үлкен'),'B':('в колонке B значение больше','B бағанындағы мән үлкен'),'C':('значения равны','мәндер тең'),'D':('информации недостаточно','ақпарат жеткіліксіз')}
def fmt(v): return v if isinstance(v,str) else str(round(float(v),4)).rstrip('0').rstrip('.')
def sol(ans,va,vb,shown):
    n=NAMES[ans]
    if shown: return (f"A: {shown[0]}; B: {shown[1]}. Ответ {ans}: {n[0]}.",f"A: {shown[0]}; B: {shown[1]}. Жауап {ans}: {n[1]}.")
    if ans=='D': return ("Значения зависят от неизвестных величин, поэтому однозначно сравнить нельзя. Ответ D.","Мәндер белгісіз шамаларға тәуелді, сондықтан нақты салыстыруға болмайды. Жауап D.")
    return (f"A = {fmt(va)}, B = {fmt(vb)}. Ответ {ans}: {n[0]}.",f"A = {fmt(va)}, B = {fmt(vb)}. Жауап {ans}: {n[1]}.")
def emit(const,title):
    assert len(items)==60,len(items)
    out=['import { QT } from "./kit";','',f'/** {title} (60). Переписано: числа изменены, ответы вычислены кодом, разбор ru/kk. */',f'export const {const} = [']
    for i,(ra,ka,rb,kb,va,vb,ans,common,shown) in enumerate(items,1):
        a=ans or cm(va,vb); sr,sk=sol(a,va,vb,shown)
        c=f"{esc(common[0])}, {esc(common[1])}" if common else "undefined, undefined"
        out.append(f"  QT({i}, {esc(ra)}, {esc(ka)}, {esc(rb)}, {esc(kb)}, \"{a}\", {esc(sr)}, {esc(sk)}, {c}),")
    out.append('];'); print("\n".join(out))
    sys.stderr.write(''.join((a[6] or cm(a[4],a[5])) for a in items)+"\n")
