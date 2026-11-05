import sys,glob
from PIL import Image
d,pre=sys.argv[1],sys.argv[2]
fs=sorted(glob.glob(d+'/q*.png'))
def sheet(fs,out,cols=4,cw=480):
    cur=[[] for _ in range(cols)];hs=[0]*cols
    for f in fs:
        im=Image.open(f).convert('RGB'); im=im.resize((cw,int(im.size[1]*cw/im.size[0])))
        ci=min(range(cols),key=lambda i:hs[i]); cur[ci].append(im); hs[ci]+=im.size[1]+4
    c=Image.new('RGB',(cols*(cw+6),max(hs)),'#ccc')
    for ci,col in enumerate(cur):
        y=0
        for im in col: c.paste(im,(ci*(cw+6),y)); y+=im.size[1]+4
    c.save(out)
sheet(fs[:14],pre+'_a.png'); sheet(fs[14:28],pre+'_b.png'); sheet(fs[28:],pre+'_c.png')
