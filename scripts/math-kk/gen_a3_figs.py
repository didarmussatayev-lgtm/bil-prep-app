import math
def gauge(lang):
    L={'ru':('Пустой','Полный'),'kk':('Бос','Толы')}[lang]
    cx,cy,r=150,150,130
    s=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 190" width="300" height="190" font-family="DejaVu Serif,serif" font-size="16" font-weight="bold"><rect width="300" height="190" fill="#fff"/>'
    s+=f'<path d="M20,150 A130,130 0 0 1 280,150 Z" fill="#fff" stroke="#000" stroke-width="2"/>'
    for i in range(1,16):
        a=math.radians(11.25*i); x1=cx-r*math.cos(a);y1=cy-r*math.sin(a);x2=cx-(r-14)*math.cos(a);y2=cy-(r-14)*math.sin(a)
        s+=f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="#000" stroke-width="2"/>'
    a=math.radians(11.25*9); s+=f'<text x="{cx-(r+6)*math.cos(a):.1f}" y="{cy-(r+6)*math.sin(a)-4:.1f}" text-anchor="middle">18</text>'
    a=math.radians(11.25*11); nx=cx-(r-30)*math.cos(a);ny=cy-(r-30)*math.sin(a)
    s+=f'<line x1="{cx}" y1="{cy}" x2="{nx:.1f}" y2="{ny:.1f}" stroke="#000" stroke-width="3"/><circle cx="{cx}" cy="{cy}" r="5"/>'
    s+=f'<text x="22" y="176">{L[0]}</text><text x="280" y="176" text-anchor="end">{L[1]}</text></svg>'
    open(f'figs/a3_gauge_{lang}.svg','w').write(s)
gauge('ru');gauge('kk')
def nl(name,ticks,above=None):
    # ticks: list of (x,label_below, label_above)
    W,H=440,90
    s=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="DejaVu Serif,serif" font-size="22" font-style="italic" font-weight="bold"><rect width="{W}" height="{H}" fill="#fff"/><line x1="20" y1="50" x2="415" y2="50" stroke="#000" stroke-width="2"/><path d="M402,38 L416,50 L402,62" fill="none" stroke="#000" stroke-width="2"/>'
    for x,b,a in ticks:
        s+=f'<line x1="{x}" y1="40" x2="{x}" y2="60" stroke="#000" stroke-width="2.5"/>'
        if b: s+=f'<text x="{x}" y="84" text-anchor="middle">{b}</text>'
        if a: s+=f'<text x="{x}" y="30" text-anchor="middle" font-style="normal">{a}</text>'
    open(f'figs/{name}.svg','w').write(s+'</svg>')
nl('a3_nl37',[(90,'p',''),(190,'s',''),(290,'t','')])
nl('a3_nl39',[(70,'E',''),(106,'F','4'),(160,'H','10'),(232,'M','')])
