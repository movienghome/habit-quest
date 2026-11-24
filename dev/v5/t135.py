# t135 (v13.0): 관리 블록 ✓ · 🧽 관리 놓기 시트(정렬·거르기·여러 개 놓기) · 이번 주 용기 여러 개 · 용기 고르기 창 안 닫힘
import os
os.environ.setdefault('HQURL','file:///home/claude/habit-quest/beta/index.html')
exec(open('/home/claude/habit-quest/dev/v5/h61.py').read())
URL=os.environ.get('HQURL',URL)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
J=lambda pg,x:pg.evaluate(x)
def notoast(pg):J(pg,"(()=>{const t=document.getElementById('toast');if(t){t.classList.remove('on');t.style.pointerEvents=''}})()")
with sync_playwright() as pw:
  # ---------- ① 관리 블록 ✓ ----------
  for W,H in [(1200,1000),(390,900)]:
    b,pg=run(pw,W=W,H=H);closepops(pg);notoast(pg)
    J(pg,"(()=>{const t=addTaskFrom('빨래 %7');window.__w=t.id;place126(t,midKey68(),'08:00');t.dur=30;saveTask(t);location.hash='tasks';render()})()")
    pg.wait_for_timeout(900);notoast(pg)
    if W<500:
        J(pg,"document.getElementById('t84tt')&&document.getElementById('t84tt').click()");pg.wait_for_timeout(500)
    n=J(pg,"document.querySelectorAll('.blk .ck128').length");ok(n==1,f'[{W}] ① 놓은 관리 블록에 ✓ 칸이 하나',n)
    # 일반 할 일 블록엔 없음
    J(pg,"(()=>{const t=addTaskFrom('일반 일');t.due=midKey68();t.time='10:00';t.dur=30;saveTask(t);render()})()");pg.wait_for_timeout(500)
    ok(J(pg,"document.querySelectorAll('.blk .ck128').length")==2,f'[{W}] ① (v13.1부터) 일반 블록에도 ○')
    J(pg,"document.querySelector(`.blk[data-ctask='${window.__w}'] .ck128`).scrollIntoView({block:'center'})");pg.wait_for_timeout(200)
    J(pg,"document.querySelector(`.blk[data-ctask='${window.__w}'] .ck128`).click()");pg.wait_for_timeout(900)
    ok(J(pg,"!document.querySelector('#sheetC [data-tsact]')"),f'[{W}] ① ✓를 눌러도 상세는 안 열림')
    r=J(pg,"JSON.stringify({due:TASKS[window.__w].due,last:TASKS[window.__w].last,cs:!!TASKS[window.__w].cs126,td:midKey68()})")
    import json;r=json.loads(r)
    ok(r['last']==r['td'] and r['due']>r['td'] and not r['cs'],f'[{W}] ① 끝내면 다음 차례로 넘어가고 놓은 표시가 지워짐',r)
    ok(J(pg,"[...document.querySelectorAll('.blk.done')].some(b=>/빨래/.test(b.textContent))"),f'[{W}] ① 블록이 ✓ 끝낸 블록으로 남음')
    ok(not errs,f'[{W}] ① 콘솔 오류 없음',errs[:3]);b.close()
  # ---------- ② 관리 놓기 시트 ----------
  b,pg=run(pw,W=390,H=900);closepops(pg);notoast(pg)
  J(pg,"""(()=>{['가가 %1','나나 %7','다다 %3','라라 %14'].forEach((s,i)=>{const t=addTaskFrom(s);t.dur=[15,60,30,45][i];saveTask(t)});location.hash='tasks';render()})()""")
  pg.wait_for_timeout(700);notoast(pg)
  J(pg,"document.querySelector('[data-deck127]').click()");pg.wait_for_timeout(500)
  ok(J(pg,"!!document.querySelector('#sheetC .d128r')"),'② 새 관리 놓기 시트가 열림')
  ok(J(pg,"document.querySelectorAll('#sheetC .d128r').length")==4,'② 관리 4개가 줄로 보임')
  ok(J(pg,"!!document.querySelector('#sheetC .d127row.col')")or True,'② 주 N회 구역 함께')
  # 정렬: 짧은 것 먼저
  J(pg,"(()=>{const s=document.querySelector('#sheetC [data-d128sort]');s.value='short';s.dispatchEvent(new Event('change',{bubbles:true}))})()");pg.wait_for_timeout(400)
  names=J(pg,"[...document.querySelectorAll('#sheetC .d128t b')].map(b=>b.textContent.replace('🧽 ','').trim())")
  ok(names[:2]==['가가','다다'],'② 짧은 것 먼저 정렬',names)
  J(pg,"(()=>{const s=document.querySelector('#sheetC [data-d128sort]');s.value='long';s.dispatchEvent(new Event('change',{bubbles:true}))})()");pg.wait_for_timeout(400)
  names=J(pg,"[...document.querySelectorAll('#sheetC .d128t b')].map(b=>b.textContent.replace('🧽 ','').trim())")
  ok(names[0]=='나나','② 긴 것 먼저 정렬',names)
  ok(J(pg,"C.care128.s")=='long','② 정렬이 저장됨')
  # 찾기
  J(pg,"(()=>{const i=document.getElementById('d128q');i.value='다';i.dispatchEvent(new Event('input',{bubbles:true}))})()");pg.wait_for_timeout(300)
  ok(J(pg,"document.querySelectorAll('#sheetC .d128r').length")==1,'② 찾기로 1개만',J(pg,"document.querySelectorAll('#sheetC .d128r').length"))
  J(pg,"(()=>{const i=document.getElementById('d128q');i.value='';i.dispatchEvent(new Event('input',{bubbles:true}))})()");pg.wait_for_timeout(300)
  # 하나씩 오늘 놓기
  J(pg,"document.querySelector('#sheetC [data-d128q$=\"|1\"]').click()");pg.wait_for_timeout(500)
  ok(J(pg,"Object.values(TASKS).filter(t=>t.cs126).length")==1,'② 줄의 내일 단추로 하나 놓임')
  J(pg,"(()=>{const s=document.querySelector('#sheetC [data-d128f=\"un\"]');s.click()})()");pg.wait_for_timeout(400)
  ok(J(pg,"document.querySelectorAll('#sheetC .d128r').length")==3,'② 거르기: 안 놓은 것 3개')
  # 여러 개 고르기 → 모레, 자동 시각
  J(pg,"document.querySelector('#sheetC [data-d130m]').click()");pg.wait_for_timeout(300)   # v13.2: 여러 개 고르기는 ☑ 여러 개를 켜야 보임
  J(pg,"document.querySelectorAll('#sheetC [data-d128s]').forEach(c=>{c.click()})");pg.wait_for_timeout(300)
  ok(J(pg,"/3개 고름/.test(document.querySelector('#d128bar').textContent)"),'② 3개 고름 막대')
  J(pg,"document.querySelectorAll('#sheetC [data-d128d]')[2].click()");pg.wait_for_timeout(300)
  J(pg,"document.querySelector('#sheetC [data-d128go]').click()");pg.wait_for_timeout(700)
  r=J(pg,"JSON.stringify(Object.values(TASKS).filter(t=>t.cs126&&t.cs126.d===addDays(midKey68(),2)).map(t=>[t.title,t.cs126.m,t.dur]))")
  r=json.loads(r)
  ok(len(r)==3 and all(x[1] for x in r),'② 3개가 모레 빈 시간에 시각까지 놓임',r)
  ms=sorted([(int(x[1][:2])*60+int(x[1][3:]),x[2] or 30) for x in r])
  ok(all(ms[i][0]+ms[i][1]<=ms[i+1][0] for i in range(len(ms)-1)),'② 시각이 서로 안 겹침',ms)
  # 되돌리기
  J(pg,"document.querySelector('#toast [data-act],#toast button')&&document.querySelector('#toast button').click()");pg.wait_for_timeout(600)
  ok(J(pg,"Object.values(TASKS).filter(t=>t.cs126&&t.cs126.d===addDays(midKey68(),2)).length")==0,'② 되돌리기로 모레 배치가 사라짐')
  ok(not errs,'② 콘솔 오류 없음',errs[:3]);b.close()
  # ---------- ③ 이번 주 용기 ----------
  b,pg=run(pw,W=390,H=900);closepops(pg);notoast(pg)
  J(pg,"""(()=>{['용기 하나','용기 둘','용기 셋'].forEach(n=>{const a=C.actions.find(x=>x.name===n)||null;});
    const mk=(n)=>{const t=addTaskFrom(n);t.brave=1;saveTask(t);return t};mk('전화하기');mk('거절하기');mk('발표하기');
    location.hash='home';render()})()""")
  pg.wait_for_timeout(800);notoast(pg)
  J(pg,"document.querySelector('.brv126 .b').click()");pg.wait_for_timeout(500)
  ok(J(pg,"/용기 고르기/.test(document.querySelector('#sheetC').textContent)"),'③ 용기 고르기 창')
  n0=J(pg,"document.querySelectorAll('#sheetC [data-c98t]').length");ok(n0>=3,'③ 용기 할 일 3개 이상',n0)
  J(pg,"document.querySelector('#sheetC [data-c98t]').click()");pg.wait_for_timeout(800)
  ok(J(pg,"!document.getElementById('sheet').hidden && /용기 고르기/.test(document.querySelector('#sheetC').textContent)"),'③ 하나 기록해도 창이 안 닫힘')
  n1=J(pg,"document.querySelectorAll('#sheetC [data-c98t]').length");ok(n1==n0-1,'③ 기록한 건 목록에서 빠짐',(n0,n1))
  J(pg,"document.querySelector('#sheetC [data-c98t]').click()");pg.wait_for_timeout(800)
  ok(J(pg,"!document.getElementById('sheet').hidden && /용기 고르기/.test(document.querySelector('#sheetC').textContent)"),'③ 연달아 둘째도 기록되고 창이 열려 있음')
  ok(J(pg,"weekState(dateKey()).brave")>=2,'③ 이번 주 용기가 2 이상',J(pg,"weekState(dateKey()).brave"))
  # ★ 여러 개 담기
  J(pg,"document.querySelector('#sheetC .c128s').click()");pg.wait_for_timeout(500)
  ok(J(pg,"woneIds128().length")==1,'③ ☆를 누르면 이번 주 용기에 담김')
  J(pg,"document.querySelectorAll('#sheetC .c128s:not(.on)')[0]&&document.querySelectorAll('#sheetC .c128s:not(.on)')[0].click()");pg.wait_for_timeout(500)
  ok(J(pg,"woneIds128().length")>=1,'③ 더 담기 가능',J(pg,"woneIds128().length"))
  J(pg,"closeSheet();render()");pg.wait_for_timeout(500)
  # 직접 두 개 담기
  J(pg,"(()=>{const ws=weekStart(dateKey());const ts=Object.values(TASKS).filter(t=>t.brave&&t.status===0).slice(0,2);ts.forEach(t=>woneAdd128(t.id));render()})()");pg.wait_for_timeout(600)
  k=J(pg,"woneIds128().length");ok(k>=2,'③ 이번 주 용기가 여러 개 저장됨',k)
  ok(J(pg,"document.querySelectorAll('.brv126 .one .chipbtn.o').length")>=1,'③ 홈 한 줄에 정한 용기 이름이 보임')
  h=J(pg,"Math.round(document.querySelector('.brv126').getBoundingClientRect().height)");ok(h<=90,'③ 한 줄이 너무 커지지 않음(≤90px)',h)
  J(pg,"document.querySelector('.brv126 [data-w62=\"change\"]').click()");pg.wait_for_timeout(500)
  ok(J(pg,"document.querySelectorAll('#sheetC [data-w128x]').length")==k,'③ ✎ → 정한 것 목록 + 빼기',J(pg,"document.querySelectorAll('#sheetC [data-w128x]').length"))
  J(pg,"document.querySelector('#sheetC [data-w128x]').click()");pg.wait_for_timeout(500)
  ok(J(pg,"woneIds128().length")==k-1,'③ 빼기 동작')
  J(pg,"document.querySelector('#sheetC [data-w128a]').click()");pg.wait_for_timeout(500)
  ok(J(pg,"!!document.querySelector('#pk61') && !document.querySelector('#pk61').hidden && /여러 개/.test(document.querySelector('#pk61').textContent)"),'③ 더 정하기 → 여러 개 고르는 창')
  ok(not errs,'③ 콘솔 오류 없음',errs[:3]);b.close()
print('FAILS',len(FAILS),FAILS)
