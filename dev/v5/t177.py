# v13.35: 기록하기 '모두'·'↻ 습관'·'⚔ 용기' 보기에서 숨은(합친 옛·끝낸 한 번) 카드 빼기 · 합치기 미리 보기 옵션 이름 앞 이름 뺀 모양
from h61 import *
import json
F=[]
def ok(c,m,x=None):print(('PASS ' if c else 'FAIL ')+m+(' · '+str(x) if x is not None else ''));(None if c else F.append(m))
J=lambda pg,js:json.loads(pg.evaluate(js))
for W,H in((1400,900),(390,844)):
  print('=== ',W)
  with sync_playwright() as pw:
    b,pg=run(pw,W,H);pg.wait_for_timeout(600);closepops(pg)
    pg.evaluate("""()=>{[['pr1','프로젝트 리허설'],['pr2','프로젝트 미팅']].forEach(([id,name])=>C.actions.push({id,name,type:'good',area:'grow',cond:3,gold:1,xp:5,marble:''}));
      C.actions.push({id:'on1',name:'한 번 끝낸 카드',type:'good',area:'grow',cond:1,gold:0,xp:1,marble:'',once:1,doneAt:'2026-11-01'});save('config');render()}""")
    # ① 미리 보기: 이름 칸을 '프로젝트'로 고치면 옵션 줄이 리허설·미팅
    pg.evaluate("()=>mgSheet151('pr1','pr2')");pg.wait_for_timeout(400)
    pg.fill('#sheetC [data-mgn151]','프로젝트');pg.wait_for_timeout(100)
    r=J(pg,"()=>JSON.stringify([...document.querySelectorAll('#sheetC [data-on155]')].map(x=>x.textContent))")
    ok(r==['리허설','미팅'],'미리 보기 옵션: 리허설·미팅',r)
    pg.fill('#sheetC [data-mgn151]','회의');pg.wait_for_timeout(100)
    r=J(pg,"()=>JSON.stringify([...document.querySelectorAll('#sheetC [data-on155]')].map(x=>x.textContent))")
    ok(r==['프로젝트 리허설','프로젝트 미팅'],'다른 이름이면 그대로',r)
    pg.fill('#sheetC [data-mgn151]','프로젝트');pg.click('#sheetC [data-mggo151]');pg.wait_for_timeout(500)
    r=J(pg,"()=>{const T=C.actions.find(a=>a.mg151&&a.mg151.src.includes('pr1'));return JSON.stringify(T.opts.map(o=>o.name))}")
    ok(r==['리허설','미팅'],'합친 뒤 옵션 이름',r)
    pg.evaluate("()=>{const t=document.getElementById('toast');t&&t.classList.remove('on');closeSheet()}")
    # ② 기록하기 '모두' 보기에서 숨은 카드 안 보임
    for f in ('all','habit','brave','good'):
      pg.evaluate("()=>{C.ui.list.filter='%s';ui.aq141='';location.hash='#log';render()}"%f);pg.wait_for_timeout(500)
      r=J(pg,"()=>JSON.stringify([...document.querySelectorAll('#actGroups .act[data-info^=\"act:\"]')].map(r=>r.dataset.info.slice(4)).filter(id=>{const a=C.actions.find(x=>x.id===id);return a&&a.doneAt}))")
      ok(r==[],'기록하기 %s: 숨은 카드 없음'%f,r)
    pg.evaluate("()=>{C.ui.list.filter='all';render()}");pg.wait_for_timeout(300)
    r=J(pg,"()=>{const ids=[...document.querySelectorAll('#actGroups .act[data-info^=\"act:\"]')].map(r=>r.dataset.info.slice(4));const T=C.actions.find(a=>a.mg151&&a.mg151.src.includes('pr1'));return JSON.stringify([ids.includes(T.id),ids.includes('pr1'),ids.includes('on1')])}")
    ok(r==[True,False,False],'모두: 합친 카드만 · 옛 카드·끝낸 한 번 카드 없음',r)
    # 개수 칩: 모두 n = 숨기지 않은 카드 수
    r=J(pg,"()=>JSON.stringify([C.actions.filter(a=>!a.doneAt).length,C.actions.filter(a=>flt61(a,'all')).length])")
    ok(r[0]==r[1],'모두 개수 = 숨기지 않은 카드',r)
    # 찾기 중 끝낸 한 번 카드는 아래 칸에(↩ 되살리기 그대로)
    pg.evaluate("()=>{ui.aq141='한 번 끝낸';render()}");pg.wait_for_timeout(300)
    ok(pg.locator('[data-rev141="on1"]').count()==1,'찾기: 끝낸 한 번 카드 ↩ 그대로')
    errs=pg.evaluate("()=>window.__errs||[]");ok(not errs,'오류 없음',errs)
    b.close()
print('FAILS',len(F),F)
