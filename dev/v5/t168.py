# v13.27: HP는 몸·마음만 — 생활은 진척 종류로 따로(마이그레이션 1회·HP 불변)
from h61 import *
import json
F=[]
def ok(c,m,x=None):print(('PASS ' if c else 'FAIL ')+m+(' · '+str(x) if x is not None else ''));(None if c else F.append(m))
with sync_playwright() as pw:
    b,pg=run(pw);pg.wait_for_timeout(500)
    r=json.loads(pg.evaluate("""()=>{const a=C.areas.find(x=>x.id==='life'||x.name==='생활');return JSON.stringify({has:!!a,id:a&&a.id,k:a&&akOf101(a.id),mig:C.f4mig147,body:akOf101('body'),mind:akOf101('mind')})}"""))
    print(r)
    ok(r['has'],'생활 영역 있음');ok(r['k'] in('p','k'),'생활 → HP 밖(진척, v13.28부터 🧺 관리)',r['k']);ok(r['mig']==1,'이전 표시');ok(r['body']=='c' and r['mind']=='c','몸·마음은 컨디션 그대로')
    v=pg.evaluate("""()=>{const d=curDay(),a=C.areas.find(x=>x.id==='life'),b0=hpParts101(d);
      applyEntry(d,{kind:'act',type:'bad',aid:'x',name:'생활 나쁜 일',cond:-30,xp:0,gold:0,area:a.id});
      const b1=hpParts101(d);return JSON.stringify({a:b0.inn,b:b1.inn,o:b1.out-b0.out})}""")
    print(v);j=json.loads(v);ok(j['a']==j['b'] and j['o']==-30,'생활 −30은 HP에 안 들어감',v)
    # 사용자가 컨디션으로 되돌려 둔 값 보존
    pg.evaluate("()=>{C.ak101.life='c';render()}");pg.wait_for_timeout(200)
    ok(pg.evaluate("()=>akOf101('life')")=='c','사용자가 정한 값은 안 덮어씀')
    b.close()
print('FAILS',len(F),F)
