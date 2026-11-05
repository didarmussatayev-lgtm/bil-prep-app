import math
# Q17 rays
def ray(extra,w=330,h=70):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" font-family="DejaVu Serif,serif" font-size="17" font-style="italic"><rect width="{w}" height="{h}" fill="#fff"/><defs><pattern id="h" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#000" stroke-width="1.5"/></pattern></defs><line x1="10" y1="42" x2="300" y2="42" stroke="#000" stroke-width="2"/><path d="M290,35 L302,42 L290,49" fill="none" stroke="#000" stroke-width="2"/><text x="312" y="48">x</text>{extra}</svg>'
def pt(x,lab): return f'<circle cx="{x}" cy="42" r="5" fill="#fff" stroke="#000" stroke-width="2"/><text x="{x}" y="66" text-anchor="middle">{lab}</text>'
def hat(x1,x2): return f'<rect x="{x1}" y="24" width="{x2-x1}" height="14" fill="url(#h)" stroke="#000"/>'
open('figs/a6_r17a.svg','w').write(ray(hat(10,200)+pt(200,'0,84')))
open('figs/a6_r17b.svg','w').write(ray(hat(10,130)+pt(130,'−0,84')))
open('figs/a6_r17c.svg','w').write(ray(hat(130,290)+pt(130,'−0,84')))
open('figs/a6_r17d.svg','w').write(ray(hat(200,290)+pt(200,'0,84')))
# pie
def pie(lang):
    L={'ru':{'w':'Вода','f':'Жир','s':'Сахар','p':'Белок'},'kk':{'w':'Су','f':'Май','s':'Қант','p':'Ақуыз'}}[lang]
    cx,cy,r=170,115,80
    segs=[('w',8,f"{L['w']}, 8%"),('f',22,f"{L['f']}, 22%"),('p',29,f"{L['p']}: ?"),('s',41,f"{L['s']}, 41%")]
    a=0;out=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 230" width="340" height="230" font-family="DejaVu Serif,serif" font-size="15"><rect width="340" height="230" fill="#fff"/>']
    for k,p,t in segs:
        a2=a+p*3.6
        x1=cx+r*math.sin(math.radians(a));y1=cy-r*math.cos(math.radians(a));x2=cx+r*math.sin(math.radians(a2));y2=cy-r*math.cos(math.radians(a2))
        out.append(f'<path d="M{cx},{cy} L{x1:.1f},{y1:.1f} A{r},{r} 0 {1 if a2-a>180 else 0} 1 {x2:.1f},{y2:.1f} Z" fill="{"#d9d9d9" if k=="f" else "#fff"}" stroke="#000" stroke-width="2"/>')
        m=math.radians((a+a2)/2); lx=cx+(r+10)*math.sin(m); ly=cy-(r+10)*math.cos(m)
        anch='start' if math.sin(m)>0.15 else ('end' if math.sin(m)<-0.15 else 'middle')
        dy=-4 if math.cos(m)>0.3 else (14 if math.cos(m)<-0.3 else 5)
        out.append(f'<text x="{lx:.1f}" y="{ly+dy:.1f}" text-anchor="{anch}">{t}</text>'); a=a2
    out.append('</svg>'); open(f'figs/a6_pie_{lang}.svg','w').write(''.join(out))
pie('ru');pie('kk')
# Q23 gauge sector, 8 divisions, needle at 5
cx,cy,R,r0=150,200,170,110
s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150" width="300" height="150" font-family="DejaVu Serif,serif" font-size="18" font-weight="bold"><rect width="300" height="150" fill="#fff"/>'
def P(a,rad): return cx+rad*math.cos(math.radians(a)),cy-rad*math.sin(math.radians(a))
a0,a1=125,55
x1,y1=P(a0,R);x2,y2=P(a1,R);x3,y3=P(a1,r0);x4,y4=P(a0,r0)
s+=f'<path d="M{x1:.1f},{y1:.1f} A{R},{R} 0 0 1 {x2:.1f},{y2:.1f} L{x3:.1f},{y3:.1f} A{r0},{r0} 0 0 0 {x4:.1f},{y4:.1f} Z" fill="#fff" stroke="#000" stroke-width="2"/>'
for i in range(1,8):
    a=a0-(a0-a1)/8*i; xa,ya=P(a,R);xb,yb=P(a,r0); s+=f'<line x1="{xa:.1f}" y1="{ya:.1f}" x2="{xb:.1f}" y2="{yb:.1f}" stroke="#000" stroke-width="2"/>'
xz,yz=P(a0,R+4); s+=f'<text x="{xz-16:.1f}" y="{yz+4:.1f}">0</text>'
an=a0-(a0-a1)/8*5; xn,yn=P(an,R-18); xc,yc=P(an,r0-18)
s+=f'<line x1="{xc:.1f}" y1="{yc+8:.1f}" x2="{xn:.1f}" y2="{yn:.1f}" stroke="#c00" stroke-width="3"/>'
open('figs/a6_gauge.svg','w').write(s+'</svg>')
# Q31 roads: A-B 4, B-C 3, A-D 2, D-C 2
W,H=340,190;A=(30,80);B=(160,80);C=(300,80);D=(165,170)
s=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="DejaVu Sans,sans-serif" font-size="20" font-weight="bold"><rect width="{W}" height="{H}" fill="#fff"/>'
def arc(p,q,off,sw=2): 
    mx,my=(p[0]+q[0])/2,(p[1]+q[1])/2+off; return f'<path d="M{p[0]},{p[1]} Q{mx},{my} {q[0]},{q[1]}" fill="none" stroke="#000" stroke-width="{sw}"/>'
for off in (-90,-45,0+14,60): s+=arc(A,B,off*1.0)
for off in (-70,-8,56): s+=arc(B,C,off)
for off in (40,110): s+=arc((A[0],A[1]),D,off if False else 0) if False else ''
# A-D two roads
s+=f'<path d="M{A[0]},{A[1]} Q{A[0]+10},{D[1]+25} {D[0]},{D[1]}" fill="none" stroke="#000" stroke-width="2"/><path d="M{A[0]},{A[1]} Q{A[0]+60},{D[1]-5} {D[0]},{D[1]}" fill="none" stroke="#000" stroke-width="2"/>'
s+=f'<path d="M{D[0]},{D[1]} Q{C[0]-30},{D[1]+20} {C[0]},{C[1]}" fill="none" stroke="#000" stroke-width="2"/><path d="M{D[0]},{D[1]} Q{C[0]-85},{D[1]-30} {C[0]},{C[1]}" fill="none" stroke="#000" stroke-width="2"/>'
for (x,y),l,dx,dy in ((A,'A',-22,6),(B,'B',-4,-12),(C,'C',10,6),(D,'D',-6,22)):
    s+=f'<circle cx="{x}" cy="{y}" r="3.5"/><text x="{x+dx}" y="{y+dy}">{l}</text>'
open('figs/a6_roads.svg','w').write(s+'</svg>')
