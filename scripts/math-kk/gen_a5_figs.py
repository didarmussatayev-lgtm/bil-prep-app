def line(extra,w=330,h=70):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" font-family="DejaVu Serif,serif" font-size="16" font-style="italic"><rect width="{w}" height="{h}" fill="#fff"/><defs><pattern id="h" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#000" stroke-width="1.5"/></pattern></defs><line x1="10" y1="40" x2="300" y2="40" stroke="#000" stroke-width="2"/><path d="M290,33 L302,40 L290,47" fill="none" stroke="#000" stroke-width="2"/><text x="312" y="46">x</text>{extra}</svg>'
def dot(x,lab): return f'<circle cx="{x}" cy="40" r="5"/><text x="{x}" y="64" text-anchor="middle" font-style="normal" font-weight="bold">{lab}</text>'
def hatch(x1,x2): return f'<rect x="{x1}" y="22" width="{x2-x1}" height="14" fill="url(#h)" stroke="#000" stroke-width="1"/>'
X={-4:90,0:155,4:220}
opts={
 'a':hatch(10,200)+dot(90,'-4')+dot(155,'0')+dot(220,'4'),   # placeholder replaced below
}
# A: x<=4 ray (hatch left of 4)
A=hatch(10,220)+dot(155,'0')+dot(220,'4')
# B: segment [-4,4]
B=hatch(90,220)+dot(90,'-4')+dot(155,'0')+dot(220,'4')
# C: |x|>=4 : both sides
C=hatch(10,90)+hatch(220,290)+dot(90,'-4')+dot(155,'0')+dot(220,'4')
# D: [0,4]
D=hatch(155,220)+dot(155,'0')+dot(220,'4')
for n,e in zip('abcd',(A,B,C,D)): open(f'figs/a5_s36{n}.svg','w').write(line(e))
# Q28 points P=2, Q=10, R=16, S=20 (scale 18px/unit from x=54)
W,H=480,90
x=lambda v:54+(v-0)*18
s=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="DejaVu Serif,serif" font-size="22" font-style="italic"><rect width="{W}" height="{H}" fill="#fff"/><line x1="20" y1="50" x2="445" y2="50" stroke="#000" stroke-width="3"/><path d="M430,38 L446,50 L430,62" fill="none" stroke="#000" stroke-width="3"/>'
for v,l,lab in ((2,'P','2'),(10,'Q','10'),(16,'R',''),(20,'S','')):
    s+=f'<line x1="{x(v)}" y1="40" x2="{x(v)}" y2="60" stroke="#000" stroke-width="3"/><text x="{x(v)}" y="32" text-anchor="middle">{l}</text>'
    if lab: s+=f'<text x="{x(v)}" y="84" text-anchor="middle" font-style="normal">{lab}</text>'
open('figs/a5_nl28.svg','w').write(s+'</svg>')
