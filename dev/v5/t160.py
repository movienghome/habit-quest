# v13.21: 상점 📒 골드 장부 — 접힘 기본 · 번 것/쓴 것 거르기 · 정렬 · 더 보기 · 폰 폭
from h61 import *
F=[]
def ok(c,m,x=None):print(('PASS ' if c else 'FAIL ')+m+(' · '+str(x) if x is not None else ''));(None if c else F.append(m))
SEED="""(()=>{const d=today();
  for(let i=0;i<34;i++)applyEntry(d,{kind:'act',type:'good',name:'벌이 '+i,gold:10+i,xp:0});
  applyEntry(d,{kind:'buy',type:'buy',name:'치킨 사 먹기',gold:-250,xp:0});
  applyEntry(d,{kind:'buy',type:'buy',name:'커피',gold:-40,xp:0});
  location.hash='#shop';render();return P.gold})()"""
with sync_playwright() as pw:
    for W,H in ((1400,900),(390,844)):
        b,pg=run(pw,W=W,H=H);tag=f'[{W}] '
        g=pg.evaluate("()=>"+SEED);pg.wait_for_timeout(600)
        ok(pg.locator('#gl145').count()==1,tag+'상점에 골드 장부 칸')
        ok(not pg.evaluate("()=>document.getElementById('gl145').open"),tag+'기본은 접힘')
        sm=pg.inner_text('#gl145>summary')
        ok('▲' in sm and '▼' in sm,tag+'머리글에 이번 달 번 것·쓴 것: '+sm.replace('\n',' '))
        pg.click('#gl145>summary');pg.wait_for_timeout(300)
        ok(pg.locator('.gr145').count()==30,tag+'처음 30건',pg.locator('.gr145').count())
        t=pg.inner_text('#gl145b')
        ok('치킨 사 먹기' in t or '더 보기' in t,tag+'본문 표시')
        pg.click('[data-gl145="f:out"]');pg.wait_for_timeout(200)
        r=pg.locator('.gr145').all_inner_texts()
        ok(len(r)==2 and all('▼' in x for x in r),tag+'쓴 것만(▼ 2건)',r)
        pg.click('[data-gl145="s:big"]');pg.wait_for_timeout(200)
        ok('치킨' in pg.locator('.gr145').first.inner_text(),tag+'큰 금액 순: 치킨이 먼저')
        pg.click('[data-gl145="s:small"]');pg.wait_for_timeout(200)
        ok('커피' in pg.locator('.gr145').first.inner_text(),tag+'작은 금액 순: 커피가 먼저')
        pg.click('[data-gl145="f:in"]');pg.wait_for_timeout(200)
        pg.click('[data-gl145="s:new"]');pg.wait_for_timeout(200)
        ok(pg.locator('.gr145').count()==30 and pg.locator('[data-gl145="more:1"]').count()==1,tag+'번 것 34건 중 30건 + 더 보기')
        pg.click('[data-gl145="more:1"]');pg.wait_for_timeout(200)
        ok(pg.locator('.gr145').count()==34,tag+'더 보기 → 34건')
        bb=pg.locator('#gl145').bounding_box();ok(bb and bb['x']+bb['width']<=W+2,tag+'화면 폭 안',bb)
        pg.evaluate("()=>{render()}");pg.wait_for_timeout(300)
        ok(pg.evaluate("()=>document.getElementById('gl145').open"),tag+'다시 그려도 펼침 유지')
        ok(pg.evaluate("()=>P.gold")==g,tag+'장부는 읽기만(골드 그대로)')
        b.close()
print('FAILS',len(F),F)
