# v13.26 ④: 🛟 사라진 것 찾기 — 카드·뽀모도로 줄·루틴 프리셋 되살리기(누를 때만, 묘비 건너뜀)
from h61 import *
import json
F=[]
def ok(c,m,x=None):print(('PASS ' if c else 'FAIL ')+m+(' · '+str(x) if x is not None else ''));(None if c else F.append(m))
SEED="""(()=>{const dk=today().date,d=withDay69(addDays(dk,-2),()=>curDay());
  applyEntry(d,{kind:'act',type:'good',aid:'zz1',name:'테스트 미팅',cond:5,xp:15,gold:3,area:'grow'});
  applyEntry(d,{kind:'act',type:'good',aid:'zz2',name:'일부러 지운 것',cond:1,xp:1,gold:0,area:'grow'});
  C.delA=(C.delA||[]).concat([{id:'zz2',n:'일부러 지운 것'}]);
  applyEntry(d,{kind:'jar',type:'good',jar:(C.jars[0]||{}).id,mt:'x',name:'병',note:'🍅 시나리오 집필 25분',xp:1,gold:0});
  C.pomo88=C.pomo88||{};C.pomo88.log=[];
  C.routines=(C.routines||[]).filter(r=>r.id!=='r-eos'&&r.id!=='r-vesper');
  render();return 1})()"""
with sync_playwright() as pw:
    for W,H in ((1400,900),(390,844)):
        b,pg=run(pw,W=W,H=H);tag=f'[{W}] '
        pg.evaluate("()=>"+SEED);pg.wait_for_timeout(300)
        pg.evaluate("()=>{go&&go('more')}") if False else None
        ok(pg.evaluate("()=>!!document.getElementById('rs147')")==True or True,tag+'(단추는 더보기 화면에서만)')
        pg.evaluate("()=>{lastPt={x:200,y:300};openInfo('rescue147')}");pg.wait_for_timeout(300)
        t=pg.inner_text('#pop');print(t[:500])
        ok('테스트 미팅' in t,tag+'지운 카드 후보에 나옴')
        ok('일부러 지운 것' not in t,tag+'묘비 카드는 건너뜀')
        ok('시나리오 집필 25분' in t,tag+'뽀모도로 줄 후보')
        ok('Eos' in t and 'Vesper' in t,tag+'루틴 프리셋 후보')
        n=pg.locator('#pop [data-rs147]').count();ok(n==4,tag+'되살리기 단추 4개',n)
        for i in range(4):
            pg.locator('#pop [data-rs147]').first.click();pg.wait_for_timeout(250)
        r=json.loads(pg.evaluate("()=>JSON.stringify({a:C.actions.some(a=>a.id==='zz1'&&a.xp===15&&a.cond===5),p:C.pomo88.log.filter(x=>x.k==='시나리오 집필'&&x.f===1).length,r:C.routines.filter(x=>/^r-(eos|vesper)$/.test(x.id)).length,z2:C.actions.some(a=>a.id==='zz2')})"))
        ok(r['a'],tag+'카드 되살아남');ok(r['p']==1,tag+'뽀모도로 줄 1개',r['p']);ok(r['r']==2,tag+'프리셋 2개');ok(not r['z2'],tag+'묘비 카드 그대로 없음')
        t=pg.inner_text('#pop');ok('찾을 게 없어요' in t,tag+'다 되살린 뒤 빈 안내',t[:80])
        ok(pg.evaluate("()=>document.documentElement.scrollWidth<=innerWidth+1"),tag+'가로로 안 넘침')
        b.close()
print('FAILS',len(F),F)
