# v13.26 ①: 방치 경보 — 묶음 머리(집 청소)는 하위 할 일을 한 날 한 걸로
from h61 import *
import json
F=[]
def ok(c,m,x=None):print(('PASS ' if c else 'FAIL ')+m+(' · '+str(x) if x is not None else ''));(None if c else F.append(m))
SEED="""(()=>{const d=today(),dk=d.date;C.f1from101=addDays(dk,-12);C.f2from102=addDays(dk,-12);
  const k=n=>withDay69(addDays(dk,-n),()=>curDay());
  const H=newTask({title:'집 청소'});careOn77(H,7);saveTask(H);
  const A=newTask({title:'욕실 청소'});A.parent=H.id;careOn77(A,7);saveTask(A);
  const B=newTask({title:'바닥 청소'});B.parent=H.id;careOn77(B,7);saveTask(B);
  C.watches=[{id:'wh',action:'@t:'+H.id,days:3,penalty:5}];
  applyEntry(k(8),{kind:'act',type:'good',name:'산책',cond:2,xp:1,area:'body'});   // 첫 기록(8일 전)
  applyEntry(d,{kind:'act',type:'good',name:'산책',cond:2,xp:1,area:'body'});
  window.__H=H.id;window.__A=A.id;window.__B=B.id;window.__k=k;
  const n0=neglectList(dk).map(n=>[n.t.name,n.since,n.pen]);
  return JSON.stringify({head:H.id,n0})})()"""
with sync_playwright() as pw:
    for W,H in ((1400,900),(390,844)):
        b,pg=run(pw,W=W,H=H);tag=f'[{W}] '
        r=json.loads(pg.evaluate("()=>"+SEED));print(tag,r)
        ok(len(r['n0'])==1 and r['n0'][0][0]=='집 청소' and r['n0'][0][2]>0,tag+'하위를 안 한 동안은 머리가 방치로 잡힘',r['n0'])
        # 하위(바닥 청소)를 2일 전에 함 → 머리도 2일 전에 한 것
        r2=json.loads(pg.evaluate("""()=>{const dk=today().date;const day=__k(2);applyEntry(day,{kind:'task',type:'good',name:'바닥 청소',tid:__B,xp:2,area:'life'});
          NLC69&&NLC69.clear&&NLC69.clear();DSC69&&DSC69.clear&&DSC69.clear();
          return JSON.stringify({n:neglectList(dk).map(n=>[n.t.name,n.since,n.pen]),s:daysSince('@t:'+__H,dk)})}"""))
        print(tag,r2)
        ok(r2['s']==2 and r2['n']==[],tag+'하위 하나를 2일 전에 하면 머리는 2일째(기준 3일 안 넘어 방치 아님)',r2)
        # 오래 전 하위 기록(5일 전)만 있으면 5일째 → 방치
        r3=json.loads(pg.evaluate("""()=>{const dk=today().date;const day=__k(2);const e=day.entries.find(x=>x.tid===__B);removeEntry(day.date,e.id);
          applyEntry(__k(5),{kind:'task',type:'good',name:'욕실 청소',tid:__A,xp:2,area:'life'});
          NLC69&&NLC69.clear&&NLC69.clear();DSC69&&DSC69.clear&&DSC69.clear();
          return JSON.stringify({n:neglectList(dk).map(n=>[n.t.name,n.since,n.pen]),s:daysSince('@t:'+__H,dk)})}"""))
        print(tag,r3)
        ok(r3['s']==5 and len(r3['n'])==1 and r3['n'][0][2]==10,tag+'5일 전 하위 기록만 있으면 5일째·벌점 5×2',r3)
        # HP: 방치가 하위 기록 있을 때 안 깎임
        r4=json.loads(pg.evaluate("""()=>{const dk=today().date,d=today();const ar=C.areas.find(a=>akOf101(a.id)==='c');TASKS[__H].area=ar.id;saveTask(TASKS[__H]);
          NLC69&&NLC69.clear&&NLC69.clear();DSC69&&DSC69.clear&&DSC69.clear();const a=overallOf(d);
          applyEntry(__k(1),{kind:'task',type:'good',name:'바닥 청소',tid:__B,xp:2,area:'life'});
          NLC69&&NLC69.clear&&NLC69.clear();DSC69&&DSC69.clear&&DSC69.clear();const b=overallOf(d);return JSON.stringify({a,b})}"""))
        print(tag,r4);ok(r4['b']>r4['a'],tag+'하위를 어제 하면 오늘 HP 방치 벌점이 사라져 오름',r4)
        b.close()
print('FAILS',len(F),F)
