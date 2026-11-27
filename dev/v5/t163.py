# v13.25: 왜 이 상태? 표 구조(계산식 칩·영역별 변화·방치 항목별·누적 ×n) + 접히는 7일 흐름 + 막대 눌러 날짜 바꾸기 + HP 창 정리 + 진단 복사 점수 점검
from h61 import *
import sys
F=[]
def ok(c,m,x=None):print(('PASS ' if c else 'FAIL ')+m+(' · '+str(x) if x is not None else ''));(None if c else F.append(m))
SEED="""(()=>{const d=today(),dk=d.date;C.f1from101=addDays(dk,-10);C.f2from102=addDays(dk,-10);
  const k=n=>withDay69(addDays(dk,-n),()=>curDay());
  const bad=(dd,n,c,a,m)=>applyEntry(dd,{kind:'act',type:'bad',name:n,cond:c,xp:0,area:a||'body',mult:m});
  const good=(dd,n,c,a)=>applyEntry(dd,{kind:'act',type:'good',name:n,cond:c,xp:3,area:a||'body'});
  C.watches=[{id:'wx',action:'g1',days:1,penalty:5},{id:'wy',action:'g5',days:1,penalty:4}];
  bad(d,'피드·쇼츠 1시간 넘게',-30,'mind',2.5);bad(d,'야식',-8,'body');bad(d,'야식',-6,'body');good(d,'산책',6,'body');good(d,'베개 빨래',2,'life');
  bad(k(1),'야식',-8,'body');good(k(1),'운동',10,'body');
  bad(k(2),'야식',-8,'body');
  good(k(4),'일기쓰기',5,'mind');
  location.hash='#home';render();return JSON.stringify({hp:[0,1,2,3,4].map(n=>{const x=DAYS[addDays(dk,-n)];return x&&hasData(x)?overallOf(x):null}),w:neglectList(dk).map(n=>[n.t.name,n.since,n.pen])})})()"""
with sync_playwright() as pw:
    for W,H in ((1400,900),(390,844)):
        b,pg=run(pw,W=W,H=H);tag=f'[{W}] '
        info=pg.evaluate("()=>"+SEED);pg.wait_for_timeout(600);print(tag,info)
        C_=lambda sel:pg.locator(sel).count()
        pg.click('details.wy146>summary');pg.wait_for_timeout(300)
        t=pg.inner_text('details.wy146 .wb146').replace('\n',' | ');print(tag,t)
        ok(C_('details.wy146 .eq146 .q146')>=3 and C_('details.wy146 .q146.hp146')==1,tag+'계산식 칩(시작 ＋ 영역 ＝ HP)')
        eq=pg.inner_text('details.wy146 .eq146').replace('\n',' ');print(tag,eq)
        ok('시작' in eq and '몸' in eq and '마음' in eq,tag+'영역별 변화가 식에 있음',eq)
        ok('평균이 아니라' in t,tag+'평균이 아니라 합이라는 설명')
        ok(C_('details.wy146 .r146')>=4 and C_('details.wy146 .r146 .ar146')>=3,tag+'표 줄(이름·영역·점수)')
        ok('누적 ×2.5' in t,tag+'누적 배수 표시')
        ok(C_('details.wy146 .r146.sub146')>=1 and '일째 안 함' in t,tag+'방치 경보 항목별 하위 줄',t)
        ok('야식 ×2' in t and '(3일째)' in t,tag+'야식 3일째')
        ok(not pg.evaluate("()=>document.querySelector('details.wy146 details.fw146').open"),tag+'7일 흐름은 접힘 기본')
        sm=pg.inner_text('details.wy146 details.fw146>summary');ok('평균' in sm and '최근 7일' in sm,tag+'접힌 흐름 한 줄',sm)
        ok(pg.evaluate("()=>document.documentElement.scrollWidth<=innerWidth+1"),tag+'가로로 안 넘침')
        pg.click('details.fw146>summary');pg.wait_for_timeout(300)
        ok(C_('details.wy146 .fc146')==7 and C_('details.wy146 button.fc146')>=3,tag+'펼치면 막대 7칸(눌러지는 칸 있음)')
        h=pg.evaluate("()=>document.querySelector('details.wy146 .fl146').getBoundingClientRect().height");ok(h>=90,tag+'막대 영역이 넉넉함',h)
        pg.screenshot(path=f'/tmp/s163_{W}.png')
        # 막대 누르면 그 날로
        pg.evaluate("()=>{const bs=[...document.querySelectorAll('details.wy146 button.fc146')];window.__y=bs.find(b=>b.dataset.fk146===addDays(today().date,-1))}")
        pg.evaluate("()=>window.__y.click()");pg.wait_for_timeout(400)
        ok(pg.evaluate("()=>ui.hl142===1")and pg.locator('[data-hl142="1"][aria-pressed="true"]').count()==1,tag+'막대(어제)를 누르면 날짜 칩이 어제로')
        t1=pg.inner_text('details.wy146 .wb146');ok('야식' in t1 and '피드' not in t1,tag+'그 날 이유로 바뀜')
        pg.click('[data-hl142="0"]');pg.wait_for_timeout(300)
        ok(pg.evaluate("()=>document.querySelector('details.wy146').open&&document.querySelector('details.fw146').open"),tag+'날짜를 바꿔도 펼침 유지')
        # HP 창
        pg.evaluate("()=>{lastPt={x:200,y:300};openInfo('hp')}");pg.wait_for_timeout(300)
        pt=pg.inner_text('#pop');print(pt[:900])
        ok(C_('#pop .pop146 .eq146')==1 and C_('#pop .how146')>=1,tag+'HP 창: 계산식 + 규칙 세 줄')
        ok('오늘 몸·마음 상태(0~100)' not in pt and '들어간 변화' not in pt,tag+'HP 창: 옛 줄글 정리')
        ok(C_('#pop button.fc146')==0 and C_('#pop .fc146')==7,tag+'HP 창 막대는 눌리지 않음(홈에서만)')
        ok(C_('#pop [data-sl102]')>=1 and '날짜' in pt,tag+'HP 창: 몸 출발점·날짜별 비교는 그대로')
        pg.screenshot(path=f'/tmp/p163_{W}.png')
        pg.evaluate("()=>closeInfo()")
        # 진단 복사
        d=pg.evaluate("()=>diagText141()");print(d[-1400:])
        ok('점수 점검(최근 21일' in d and '요약: 새 규칙' in d and '방치' in d,tag+'진단 복사에 점수 점검')
        b.close()
print('FAILS',len(F),F)
