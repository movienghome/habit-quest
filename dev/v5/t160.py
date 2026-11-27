# v13.21~22: 상점 📒 골드 장부 — 접힘 기본 · 기간(주·달·30일·전체·직접) · 내역/이름별/카테고리별 · 번 것/쓴 것 · 정렬 · 더 보기 · 폰 폭
from h61 import *
F=[]
def ok(c,m,x=None):print(('PASS ' if c else 'FAIL ')+m+(' · '+str(x) if x is not None else ''));(None if c else F.append(m))
SEED="""(()=>{const d=today();
  for(let i=0;i<34;i++)applyEntry(d,{kind:'act',type:'good',name:'벌이 '+i,gold:10+i,xp:0});
  applyEntry(d,{kind:'act',type:'good',name:'운동 벌이',gold:20,xp:0,area:'body'});
  applyEntry(d,{kind:'buy',type:'buy',name:'치킨 사 먹기',gold:-250,xp:0});
  applyEntry(d,{kind:'buy',type:'buy',name:'커피',gold:-40,xp:0});
  applyEntry(d,{kind:'buy',type:'buy',name:'커피',gold:-30,xp:0});
  applyEntry(d,{kind:'buy',type:'buy',name:'장비: 모자',gold:-60,xp:0});
  applyEntry(dayOf(addDays(dateKey(),-60)),{kind:'act',type:'good',name:'옛 벌이',gold:77,xp:0});
  location.hash='#shop';render();return P.gold})()"""
with sync_playwright() as pw:
    for W,H in ((1400,900),(390,844)):
        b,pg=run(pw,W=W,H=H);tag=f'[{W}] '
        g=pg.evaluate("()=>"+SEED);pg.wait_for_timeout(600)
        C_=lambda sel:pg.locator(sel).count()
        click=lambda k:(pg.click(f'[data-gl145="{k}"]'),pg.wait_for_timeout(200))
        ok(C_('#gl145')==1,tag+'상점에 골드 장부 칸')
        ok(not pg.evaluate("()=>document.getElementById('gl145').open"),tag+'기본은 접힘')
        sm=pg.inner_text('#gl145>summary')
        ok('▲' in sm and '▼' in sm,tag+'머리글에 이번 달 번 것·쓴 것: '+sm.replace('\n',' '))
        pg.click('#gl145>summary');pg.wait_for_timeout(300)
        ok(C_('.gr145')==30,tag+'처음 30건(기본 이번 달)',C_('.gr145'))
        ok('옛 벌이' not in pg.inner_text('#gl145b'),tag+'이번 달에는 60일 전 기록 없음')
        click('f:out')
        r=pg.locator('.gr145').all_inner_texts()
        ok(len(r)==4 and all('▼' in x for x in r),tag+'쓴 것만(▼ 4건)',len(r))
        click('s:big');ok('치킨' in pg.locator('.gr145').first.inner_text(),tag+'큰 금액 순: 치킨이 먼저')
        click('s:small');ok('커피' in pg.locator('.gr145').first.inner_text(),tag+'작은 금액 순: 커피가 먼저')
        click('v:name');t=pg.locator('.gr145').all_inner_texts()
        ok(any('커피' in x and '2번' in x and '−70' in x for x in t),tag+'이름별: 커피 2번 ▼ −70',t)
        click('v:cat');t=pg.locator('.gr145').all_inner_texts()
        ok(any('🛒 상점 구매' in x and '−320' in x for x in t) and any('🛡 장비' in x and '−60' in x for x in t),tag+'카테고리별(쓴 것): 상점 구매 −320 · 장비 −60',t)
        click('f:in');t=pg.locator('.gr145').all_inner_texts()
        ok(any('▲ 몸' in x and '+20' in x for x in t) and any('영역 없음' in x for x in t),tag+'카테고리별(번 것): 몸 +20 · 영역 없음',t)
        click('v:list');click('s:new')
        ok(C_('.gr145')==30 and C_('[data-gl145="more:1"]')==1,tag+'번 것 35건 중 30건 + 더 보기')
        click('more:1');ok(C_('.gr145')==35,tag+'더 보기 → 35건')
        click('p:all');ok('옛 벌이' in pg.inner_text('#gl145b') or C_('[data-gl145="more:1"]')==1,tag+'전체 기간: 60일 전 기록 포함 가능')
        click('p:custom');ok(C_('[data-gl145d="from"]')==1 and C_('[data-gl145d="to"]')==1,tag+'직접: 시작·끝 날짜 칸')
        old=pg.evaluate("()=>addDays(dateKey(),-60)")
        pg.fill('[data-gl145d="from"]',old);pg.dispatch_event('[data-gl145d="from"]','change');pg.wait_for_timeout(200)
        pg.fill('[data-gl145d="to"]',old);pg.dispatch_event('[data-gl145d="to"]','change');pg.wait_for_timeout(200)
        t=pg.locator('.gr145').all_inner_texts()
        ok(len(t)==1 and '옛 벌이' in t[0],tag+'직접 기간 = 60일 전 하루만 → 옛 벌이 1건',t)
        bb=pg.locator('#gl145').bounding_box();ok(bb and bb['x']+bb['width']<=W+2,tag+'화면 폭 안',bb)
        pg.evaluate("()=>{render()}");pg.wait_for_timeout(300)
        ok(pg.evaluate("()=>document.getElementById('gl145').open"),tag+'다시 그려도 펼침 유지')
        ok(pg.evaluate("()=>P.gold")==g,tag+'장부는 읽기만(골드 그대로)')
        b.close()
print('FAILS',len(F),F)
