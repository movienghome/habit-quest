# v13.26 ②: HP 규칙 B — 방치 하루 상한·누적 배수 상한·설명
from h61 import *
import json
F=[]
def ok(c,m,x=None):print(('PASS ' if c else 'FAIL ')+m+(' · '+str(x) if x is not None else ''));(None if c else F.append(m))
SEED="""(()=>{const d=today(),dk=d.date;C.f1from101=addDays(dk,-12);C.f2from102=addDays(dk,-12);C.f3from147=dk;
  const ar=C.areas.filter(a=>akOf101(a.id)==='c').map(a=>a.id);
  const mk=(t,days,pen)=>{const x=newTask({title:t});careOn77(x,7);x.area=ar[0];saveTask(x);return {id:'w'+t,action:'@t:'+x.id,days,penalty:pen}};
  C.watches=[mk('A',1,12),mk('B',1,12),mk('C',1,12)];
  applyEntry(withDay69(addDays(dk,-9),()=>curDay()),{kind:'act',type:'good',name:'산책',cond:2,xp:1,area:'body'});
  applyEntry(d,{kind:'act',type:'good',name:'산책',cond:2,xp:1,area:'body'});
  nlClear69();
  const L=neglectList(dk);
  const old=neglectList(addDays(dk,-1));
  return JSON.stringify({pens:L.map(n=>n.pen),raws:L.map(n=>n.raw147),oldSum:old.reduce((t,n)=>t+n.pen,0),oldRaw:old.reduce((t,n)=>t+n.raw147,0)})})()"""
with sync_playwright() as pw:
    for W,H in ((1400,900),(390,844)):
        b,pg=run(pw,W=W,H=H);tag=f'[{W}] '
        r=json.loads(pg.evaluate("()=>"+SEED));print(tag,r)
        ok(sum(r['pens'])==20 and sum(r['raws'])>20,tag+'오늘 방치 합이 상한 20으로',r)
        ok(r['oldSum']==r['oldRaw'],tag+'어제(규칙 시작 전)는 옛 규칙 그대로',r)
        m=json.loads(pg.evaluate("""()=>{const a=C.actions.find(a=>a.type==='bad');const dk=today().date;C.penalty={...C.penalty,max:3,same:0.5,chain:0.25};
          for(let i=0;i<6;i++)applyEntry(today(),{kind:'act',type:'bad',aid:a.id,name:'x',cond:-1,xp:0,area:'body'});
          const od=withDay69(addDays(dk,-3),()=>curDay());for(let i=0;i<6;i++)applyEntry(od,{kind:'act',type:'bad',aid:a.id,name:'x',cond:-1,xp:0,area:'body'});
          const mt=badMult(a,dk).mult;const mo=badMult(a,addDays(dk,-3)).mult;return JSON.stringify({mt,mo})}"""))
        ok(m['mt']==2 and m['mo']>2,tag+'오늘부터 배수 최대 ×2, 규칙 전 날은 ×3까지',m)
        pg.evaluate("()=>{lastPt={x:200,y:300};openInfo('hp')}");pg.wait_for_timeout(400)
        t=pg.inner_text('#pop');print(t[:1200])
        ok('방치 하루 상한' in t and '−20' in t and '누적 데미지' in t and '×2' in t,tag+'HP 창에 상한·누적 데미지 설명')
        ok(pg.locator('#pop .how146').count()>=2,tag+'세 줄 규칙과 같은 모양')
        ok(pg.evaluate("()=>document.documentElement.scrollWidth<=innerWidth+1"),tag+'가로로 안 넘침')
        pg.screenshot(path=f'/tmp/s165_{W}.png')
        b.close()
print('FAILS',len(F),F)
