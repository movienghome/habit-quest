# v13.23: X2-① 왜 이 상태? — 홈 오늘 한 일 카드 한 줄(접힘 기본) + HP 설명 창 맨 위(같은 부품)
from h61 import *
F=[]
def ok(c,m,x=None):print(('PASS ' if c else 'FAIL ')+m+(' · '+str(x) if x is not None else ''));(None if c else F.append(m))
SEED="""(()=>{const d=today();
  const bad=(n,c)=>applyEntry(d,{kind:'act',type:'bad',name:n,cond:c,xp:0,area:'body'});
  bad('늦게 잠',-18);bad('야식',-8);bad('야식',-6);bad('6시간 미만 잤다',-12);bad('폭음',-9);bad('짜증',-7);bad('미룸',-5);
  applyEntry(d,{kind:'act',type:'good',name:'운동',cond:10,xp:5,area:'body'});
  applyEntry(d,{kind:'act',type:'good',name:'산책',cond:6,xp:3,area:'body'});
  location.hash='#home';render();return JSON.stringify({on:on101(),n101:new101(d),hp:overallOf(d)})})()"""
with sync_playwright() as pw:
    for W,H in ((1400,900),(390,844)):
        b,pg=run(pw,W=W,H=H);tag=f'[{W}] '
        info=pg.evaluate("()=>"+SEED);pg.wait_for_timeout(600);print(tag,info)
        C_=lambda sel:pg.locator(sel).count()
        ok(C_('details.wy146')==1,tag+'홈 오늘 한 일 카드에 한 줄')
        ok(not pg.evaluate("()=>document.querySelector('details.wy146').open"),tag+'기본은 접힘')
        sm=pg.inner_text('details.wy146>summary').replace('\n',' ');print(tag,sm)
        ok(sm.startswith('HP ') and '늦게 잠 −18' in sm and '폭음 −9' not in sm.split('·')[0] ,tag+'접힌 줄에 가장 큰 감점 2개',sm)
        ok(C_('#homeLog')==1 and pg.evaluate("()=>document.documentElement.scrollWidth<=innerWidth+1"),tag+'가로로 안 넘침')
        h=pg.evaluate("()=>document.querySelector('details.wy146>summary').getBoundingClientRect().height");ok(h<30,tag+'접힌 줄은 한 줄 높이',h)
        pg.click('details.wy146>summary');pg.wait_for_timeout(300)
        t=pg.inner_text('details.wy146 .wb146');print(t)
        ok('시작' in t and '지금' in t,tag+'시작 → 지금')
        ok('늦게 잠 −18' in t and '야식 ×2 −14' in t and '6시간 미만 잤다 −12' in t,tag+'감점 TOP3(같은 이름 합침: 야식 ×2 −14)')
        ok(C_('details.wy146 details.wm146')==1 and '그 밖에 3건 −21' in pg.inner_text('details.wm146>summary'),tag+'그 밖에 3건 −21(폭음 −9·짜증 −7·미룸 −5)',pg.inner_text('details.wm146>summary'))
        ok('▲ 운동 +10 · 산책 +6' in t,tag+'오른 것 ▲')
        pg.click('details.wm146>summary');pg.wait_for_timeout(200)
        ok('폭음 −9' in pg.inner_text('details.wm146'),tag+'더 보기를 누르면 나머지 이름')
        pg.evaluate("()=>render()");pg.wait_for_timeout(400)
        ok(pg.evaluate("()=>document.querySelector('details.wy146').open&&document.querySelector('details.wm146').open"),tag+'다시 그려도 펼침 유지')
        ok(C_('details.wy146')==1,tag+'다시 그려도 한 줄만')
        pg.click('[data-hl142="1"]');pg.wait_for_timeout(300)
        ok(C_('details.wy146')==0,tag+'어제(기록 없음)엔 줄이 없음')
        pg.click('[data-hl142="0"]');pg.wait_for_timeout(300)
        ok(C_('details.wy146')==1,tag+'오늘로 돌아오면 다시 있음')
        pg.evaluate("()=>{lastPt={x:200,y:300};openInfo('hp')}");pg.wait_for_timeout(300)
        pt=pg.inner_text('#pop');print(pt[:400])
        ok(C_('#pop .pop146 .wb146')==1 and '왜 이 상태?' in pt,tag+'HP 설명 창 맨 위에 같은 부품')
        ok('늦게 잠 −18' in pt and '날짜' in pt,tag+'아래엔 기존 날짜별 비교도 그대로')
        err=pg.evaluate("()=>window.__errs||[]")
        b.close()
print('FAILS',len(F),F)
