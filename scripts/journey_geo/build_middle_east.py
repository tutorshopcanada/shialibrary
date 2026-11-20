import json,math,sys
topo=json.load(open('dl/world50.json'))
sc=topo['transform']['scale'];tr=topo['transform']['translate']
arcs=[]
for a in topo['arcs']:
    x=y=0;pts=[]
    for dx,dy in a:
        x+=dx;y+=dy;pts.append((x*sc[0]+tr[0],y*sc[1]+tr[1]))
    arcs.append(pts)
def arc(i): return arcs[i] if i>=0 else arcs[~i][::-1]
def ring(idx):
    out=[]
    for i in idx:
        p=arc(i)
        out.extend(p if not out else p[1:])
    return out
LON0,LON1,LAT0,LAT1=32,66,10,42
U=100
def M(lat): return math.degrees(math.log(math.tan(math.pi/4+math.radians(lat)/2)))
MT=M(LAT1)
def proj(lon,lat): return ((lon-LON0)*U,(MT-M(lat))*U)
W=(LON1-LON0)*U;H=(MT-M(LAT0))*U
WANT={'Saudi Arabia':1,'Iraq':1,'Iran':1,'Kuwait':0,'Jordan':0,'Syria':0,'Lebanon':0,'Israel':0,'Palestine':0,'Turkey':0,'Yemen':0,'Oman':0,'United Arab Emirates':0,'Qatar':0,'Bahrain':0,'Egypt':0,'Afghanistan':0,'Pakistan':0,'Turkmenistan':0,'Uzbekistan':0,'Azerbaijan':0,'Armenia':0,'Georgia':0,'Cyprus':0,'Sudan':0,'Eritrea':0,'Djibouti':0,'Ethiopia':0,'Tajikistan':0,'N. Cyprus':0}
def rdp(pts,eps):
    if len(pts)<3: return pts
    keep=[False]*len(pts);keep[0]=keep[-1]=True;st=[(0,len(pts)-1)]
    while st:
        a,b=st.pop();ax,ay=pts[a];bx,by=pts[b];dx,dy=bx-ax,by-ay;L=math.hypot(dx,dy) or 1e-9
        md=0;mi=-1
        for i in range(a+1,b):
            d=abs(dy*(pts[i][0]-ax)-dx*(pts[i][1]-ay))/L
            if d>md: md=d;mi=i
        if md>eps: keep[mi]=True;st.append((a,mi));st.append((mi,b))
    return [p for p,k in zip(pts,keep) if k]
cs=[];names=[]
for g in topo['objects']['countries']['geometries']:
    n=g['properties']['name'];names.append(n)
    if n not in WANT: continue
    polys=g['arcs'] if g['type']=='MultiPolygon' else [g['arcs']]
    rings=[]
    for poly in polys:
        for r in poly:
            pts=[proj(*p) for p in ring(r)]
            xs=[p[0] for p in pts];ys=[p[1] for p in pts]
            if max(xs)<-200 or min(xs)>W+200 or max(ys)<-200 or min(ys)>H+200: continue
            e=float(sys.argv[1]) if len(sys.argv)>1 else 1.6
            k=max(range(len(pts)),key=lambda i:(pts[i][0]-pts[0][0])**2+(pts[i][1]-pts[0][1])**2)
            s=rdp(pts[:k+1],e)[:-1]+rdp(pts[k:],e)
            if len(s)<4: continue
            rings.append(s)
    cs.append((n,WANT[n],rings))
print('missing:',[k for k in WANT if k not in names])
# dot runs
STEP=26
def runs_for(rings_list,STEP=STEP):
    rows={}
    for j in range(int(H//STEP)+1):
        y=j*STEP+0.01;xs=[]
        for rings in rings_list:
            ints=[]
            for r in rings:
                for k in range(len(r)-1):
                    (x1,y1),(x2,y2)=r[k],r[k+1]
                    if (y1<=y<y2) or (y2<=y<y1):
                        ints.append(x1+(y-y1)*(x2-x1)/(y2-y1))
            ints.sort()
            for a,b in zip(ints[0::2],ints[1::2]):
                i0=math.ceil(a/STEP);i1=math.floor(b/STEP)
                if i1>=i0: xs.append((i0,i1))
        if xs:
            xs.sort();m=[list(xs[0])]
            for a,b in xs[1:]:
                if a<=m[-1][1]+1: m[-1][1]=max(m[-1][1],b)
                else: m.append([a,b])
            rows[j]=[v for ab in m for v in ab]
    return rows
hi=runs_for([r for n,h,r in cs if h]);lo=runs_for([r for n,h,r in cs if not h])
hiF=runs_for([r for n,h,r in cs if h],13);loF=runs_for([r for n,h,r in cs if not h],13)
for j in list(lo): 
    pass
cities={'mecca':(39.8262,21.4225),'medina':(39.6111,24.4672),'najaf':(44.3149,31.9961),'karbala':(44.0339,32.6163),'kadhimiya':(44.3394,33.3797),'mashhad':(59.6168,36.2880),'qom':(50.8764,34.6393),'samarra':(43.8729,34.1987)}
out={'W':W,'H':H,'U':U,'LON0':LON0,'MT':MT,'step':STEP,
 'c':[{'n':n,'hi':h,'r':[[round(v,1) for p in r for v in p] for r in rings]} for n,h,rings in cs],
 'hi':[[j,v] for j,v in sorted(hi.items())],'lo':[[j,v] for j,v in sorted(lo.items())],'stepF':13,'hiF':[[j,v] for j,v in sorted(hiF.items())],'loF':[[j,v] for j,v in sorted(loF.items())],
 'cities':{k:[round(v,1) for v in proj(*ll)] for k,ll in cities.items()}}
s=json.dumps(out,separators=(',',':'));open('map/geo.json','w').write(s)
tot=sum(len(r)//2 for c in out['c'] for r in c['r']);ndots=sum(sum((v[i+1]-v[i]+1) for i in range(0,len(v),2)) for _,v in out['hi']+out['lo'])
print('bytes',len(s),'points',tot,'dots',ndots,'W,H',W,round(H));print(out['cities'])
