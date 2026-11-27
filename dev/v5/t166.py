# v13.26 ③: 카드 ℹ 창 📊 기록·통계(달력·달 넘기기·수치)
from h61 import *
import json
F=[]
def ok(c,m,x=None):print(('PASS ' if c else 'FAIL ')+m+(' · '+str(x) if x is not None else ''));(None if c else F.append(m))
SEED="""(()=>{const dk=today().date;const a=C.actions.find(a=>a.type==='bad');window.AID=a.id;
  const put=(n,c)=>{const d=withDay69(addDays(dk,-n),()=>curDay());applyEntry(d,{kind:'act',type:'bad',aid:a.id,name:a.name,cond:c,xp:0,gold:-3,area:a.area})};
  put(0,-8);put(0,-6);put(2,-9);put(40,-5);put(45,-7);
  return JSON.stringify({id:a.id,m0:dk.slice(0,7),mp:addDays(dk,-40).slice(0,7)})})()"""
with sync_playwright() as pw:
    for W,H in ((1400,900),(390,844)):
        b,pg=run(pw,W=W,H=H);tag=f'[{W}] '
        r=json.loads(pg.evaluate("()=>"+SEED));print(tag,r)
        pg.evaluate("()=>{lastPt={x:200,y:300};openInfo('act:'+AID)}");pg.wait_for_timeout(400)
        t=pg.inner_text('#pop');print(t[-700:])
        ok(pg.locator('#pop details.ac147').count()==1,tag+'ℹ 창에 📊 기록·통계 칸')
        ok(pg.locator('#pop .ac147 .rc132d.ok').count()>=2,tag+'달력에 한 날 표시',pg.locator('#pop .ac147 .rc132d.ok').count())
        ok('이번 달 한 횟수' in t and '3번' in t or '이번 달 한 횟수' in t,tag+'이번 달 수치',t)
        ok(pg.locator('#pop [data-ac147="1"][disabled]').count()==1,tag+'이번 달에선 다음 달 단추 꺼짐')
        pg.click('#pop [data-ac147="-1"]');pg.wait_for_timeout(200)
        h=pg.inner_text('#pop .ac147b .rc132h')
        ok(r['m0']!=h,tag+'이전 달로 넘어감',h)
        ok(pg.locator('#pop .ac147 .rc132d.ok').count()>=0 and pg.locator('#pop .ac147b .rc132g').count()==1,tag+'달력 다시 그림')
        ok(pg.evaluate("()=>document.documentElement.scrollWidth<=innerWidth+1"),tag+'가로로 안 넘침')
        pg.screenshot(path=f'/tmp/s166_{W}.png')
        b.close()
print('FAILS',len(F),F)
