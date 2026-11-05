# Общий генератор файлов M-задач: T=[(ru,kk,opts,ok,letter,sr,sk)]
def a(T,ru,kk,o,L,sr,sk=None,ok=None): T.append((ru,kk,o,ok,L,sr,sk or sr))
def e(s): return "`"+s.replace("\\","\\\\").replace("`","\\`")+"`"
def write(T,const,fname,title,n=40):
    assert len(T)==n,len(T)
    out=['import { M } from "./kit";','',f'/** {title} (40). Переписано: числа изменены, ответы пересчитаны, разбор ru/kk. */',f'export const {const} = [']
    for i,(ru,kk,o,ok,L,sr,sk) in enumerate(T,1):
        oo="["+", ".join(e(x) for x in o)+"]"
        ko=", ["+", ".join(e(x) for x in ok)+"]" if ok else ""
        out.append(f'  M("{i}", {e(ru)}, {e(kk)}, {oo}, "{L}", {e(sr)}, {e(sk)}{ko}),')
    out.append('];'); open(fname,'w').write("\n".join(out)+"\n"); print(''.join(t[4] for t in T))
