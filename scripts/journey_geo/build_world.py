import json,math,sys
LON0=32;U=100
def merc(lat): return math.degrees(math.log(math.tan(math.pi/4+math.radians(lat)/2)))
MT=merc(42)
def proj(lon,lat):
    lat=max(-82,min(82,lat)); return ((lon-LON0)*U,(MT-merc(lat))*U)
def load_topo(p):
    t=json.load(open(p));sc=t['transform']['scale'];tr=t['transform']['translate'];arcs=[]
    for a in t['arcs']:
        x=y=0;pts=[]
        for dx,dy in a:
            x+=dx;y+=dy;pts.append((x*sc[0]+tr[0],y*sc[1]+tr[1]))
        arcs.append(pts)
    def arc(i): return arcs[i] if i>=0 else arcs[~i][::-1]
    def ring(idx):
        out=[]
        for i in idx:
            p=arc(i);out.extend(p if not out else p[1:])
        return out
    res={}
    for g in t['objects']['countries']['geometries']:
        polys=g['arcs'] if g['type']=='MultiPolygon' else [g['arcs']]
        res[g['properties']['name']]=[[ring(r) for r in poly] for poly in polys]
    return res
def rdp(pts,eps):
    if len(pts)<3: return pts
    keep=[False]*len(pts);keep[0]=keep[-1]=True;st=[(0,len(pts)-1)]
    while st:
        a,b=st.pop();ax,ay=pts[a];bx,by=pts[b];dx,dy=bx-ax,by-ay;L=math.hypot(dx,dy) or 1e-9;md=0;mi=-1
        for i in range(a+1,b):
            d=abs(dy*(pts[i][0]-ax)-dx*(pts[i][1]-ay))/L
            if d>md: md=d;mi=i
        if md>eps: keep[mi]=True;st.append((a,mi));st.append((mi,b))
    return [p for p,k in zip(pts,keep) if k]
def simp(pts,eps):
    if len(pts)<5: return pts
    k=max(range(len(pts)),key=lambda i:(pts[i][0]-pts[0][0])**2+(pts[i][1]-pts[0][1])**2)
    return rdp(pts[:k+1],eps)[:-1]+rdp(pts[k:],eps)
def inbox(ring,box):  # ring in lon/lat, box lon0,lon1,lat0,lat1 : does bbox intersect
    xs=[p[0] for p in ring];ys=[p[1] for p in ring]
    return not(max(xs)<box[0] or min(xs)>box[1] or max(ys)<box[2] or min(ys)>box[3])
def runs(rings_proj,step,xmin,xmax,ymin,ymax):
    rows={}
    for j in range(math.floor(ymin/step),math.ceil(ymax/step)+1):
        y=j*step+0.01;ivs=[]
        for rings in rings_proj:   # one "polygon group" (even-odd inside group)
            ints=[]
            for r in rings:
                for k in range(len(r)-1):
                    (x1,y1),(x2,y2)=r[k],r[k+1]
                    if (y1<=y<y2) or (y2<=y<y1): ints.append(x1+(y-y1)*(x2-x1)/(y2-y1))
            ints.sort()
            for a,b in zip(ints[0::2],ints[1::2]):
                i0=math.ceil(max(a,xmin)/step);i1=math.floor(min(b,xmax)/step)
                if i1>=i0: ivs.append((i0,i1))
        if ivs: rows[j]=merge(ivs)
    return rows
def merge(ivs):
    ivs=sorted(ivs);m=[list(ivs[0])]
    for a,b in ivs[1:]:
        if a<=m[-1][1]+1: m[-1][1]=max(m[-1][1],b)
        else: m.append([a,b])
    return m
def subtract(land,lake):
    out={}
    for j,iv in land.items():
        cur=[list(x) for x in iv]
        for a,b in lake.get(j,[]):
            nxt=[]
            for c,d in cur:
                if b<c or a>d: nxt.append([c,d]);continue
                if c<a: nxt.append([c,a-1])
                if d>b: nxt.append([b+1,d])
            cur=nxt
        if cur: out[j]=cur
    return out
def flat(rows): return [[j,[v for ab in m for v in ab]] for j,m in sorted(rows.items())]
ME=json.load(open('map/geo.me.json'))
w110=load_topo('dl/world110.json');w50=load_topo('dl/world50.json')
WANT=set(c['n'] for c in ME['c'])
# 1 world outlines (110m)
wout=[]
for n,polys in w110.items():
    if n=='Antarctica': continue
    rings=[]
    for poly in polys:
        for r in poly:
            if len(r)<4: continue
            s=simp([proj(*p) for p in r],8)
            if len(s)>=4: rings.append([round(v,1) for p in s for v in p])
    if rings: wout.append({'n':n,'skip':1 if n in WANT else 0,'r':rings})
# 2 world dots coarse
WSTEP=110
groups=[]
for n,polys in w110.items():
    if n=='Antarctica': continue
    for poly in polys: groups.append([[proj(*p) for p in r] for r in poly])
allx=[p[0] for g in groups for r in g for p in r];ally=[p[1] for g in groups for r in g for p in r]
wd=runs(groups,WSTEP,min(allx),max(allx),min(ally),max(ally))
# 3 North America detail outlines + lakes
NAWIN=(-93,-60,36,54)
na=[]
for n in ('United States of America','Canada'):
    rings=[]
    for poly in w50[n]:
        for r in poly:
            if inbox(r,NAWIN):
                s=simp([proj(*p) for p in r],2.2)
                if len(s)>=4: rings.append([round(v,1) for p in s for v in p])
    na.append({'n':n,'r':rings})
lakes=json.load(open('dl/lakes50.json'))
lk=[];lakegroups=[]
for f in lakes['features']:
    g=f['geometry'];polys=g['coordinates'] if g['type']=='MultiPolygon' else [g['coordinates']]
    for poly in polys:
        outer=poly[0]
        if not inbox(outer,(-93,-60,40,50)): continue
        xs=[p[0] for p in outer];ys=[p[1] for p in outer]
        if (max(xs)-min(xs))*(max(ys)-min(ys))<.8: continue
        pr=simp([proj(*p) for p in outer],1.4)
        if len(pr)>=4: lk.append([round(v,1) for p in pr for v in p]);lakegroups.append([pr])
print('lakes kept',len(lk))
# 4 NA dots (land minus lakes)
def land_groups(names,box):
    gs=[]
    for n in names:
        for poly in w50[n]:
            if any(inbox(r,box) for r in poly): gs.append([[proj(*p) for p in r] for r in poly])
    return gs
def na_runs(step,box):
    x0,y0=proj(box[0],box[3]);x1,y1=proj(box[1],box[2])
    land=runs(land_groups(('United States of America','Canada'),box),step,x0,x1,y0,y1)
    lake=runs(lakegroups,step,x0,x1,y0,y1)
    return subtract(land,lake)
nam=na_runs(36,(-100,-60,30,56));naf=na_runs(13,(-82.8,-74.2,42.0,45.8))
cities=ME['cities'];cities['toronto']=[round(v,1) for v in proj(-79.3832,43.6532)]
tx,ty=cities['toronto'];print('toronto',cities['toronto'])
# sanity: is Lake Ontario centre land in nam?
lx,ly=proj(-77.9,43.65);j=round(ly/36);print('lake centre row',j,'runs',nam.get(j))
ME.update({'w110':wout,'wstep':WSTEP,'wd':flat(wd),'na':na,'lk':lk,'nastep':36,'nam':flat(nam),'nafstep':13,'naf':flat(naf),'cities':cities})
s=json.dumps(ME,separators=(',',':'));open('map/geo.json','w').write(s)
print('bytes',len(s),'w110 pts',sum(len(r)//2 for c in wout for r in c['r']),'na pts',sum(len(r)//2 for c in na for r in c['r']),'lk pts',sum(len(r)//2 for r in lk))
cnt=lambda rows:sum(sum(b-a+1 for a,b in m) for m in rows.values())
print('dots world',cnt(wd),'nam',cnt(nam),'naf',cnt(naf))
