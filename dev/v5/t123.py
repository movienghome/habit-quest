# t123 (v12.0): 할 일 상세 루틴 칸의 프리셋 줄 · 프리셋별 단계 분 · 며칠짜리 일정에 루틴 상황
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
J=lambda pg,x:pg.evaluate(x)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
def notoast(pg):J(pg,"(()=>{const t=document.getElementById('toast');if(t){t.classList.remove('on');t.style.pointerEvents=''}})()")
def mk(pg):
    J(pg,"""(()=>{const r=rtNew61('테스트 아침',[{name:'산책',min:10},{name:'명상',min:5},{name:'세수',min:2}]);setRt60(r,[0,1,2,3,4,5,6]);syncDailies(C);save('config');render();window.__rid=r.id})()""")
    pg.wait_for_timeout(700);notoast(pg)
    J(pg,"(()=>{const r=C.routines.find(x=>x.id===window.__rid);sync62(r);save('config');render()})()");pg.wait_for_timeout(500)
R="C.routines.find(x=>x.id===window.__rid)"
NM="(r=>effSteps117(r,gk76()).map(s=>stName61(s)).join('>'))("+R+")"
MN="(r=>effSteps117(r,gk76()).map(s=>s.min).join(','))("+R+")"
with sync_playwright() as pw:
  for W,H in [(1200,800),(390,800)]:
    b,pg=run(pw,W=W,H=H);closepops(pg);notoast(pg);mk(pg)
    # ① 목록 → 루틴 할 일 상세(사용자가 실제로 여는 길)에 프리셋 줄
    J(pg,"location.hash='tasks';render()");pg.wait_for_timeout(600);notoast(pg)
    J(pg,f"openTaskSheet(rtT({R}).id)");pg.wait_for_timeout(700);notoast(pg)
    ok(J(pg,"!!document.querySelector('#sheetC .rt64p')"),f'[{W}] 할 일 상세에 루틴 칸이 있음')
    ok(J(pg,"document.querySelectorAll('#sheetC .pr114row').length")==1,f'[{W}] 상세 루틴 칸에 프리셋 줄(오늘) 1개')
    ok(J(pg,"!!document.querySelector('#sheetC details.pe117')"),f'[{W}] 상세 루틴 칸에 🧭 상황 프리셋 편집·추가')
    ok(J(pg,"(()=>{const d=document.querySelector('#sheetC .pr114row'),s=document.querySelector('#sheetC .sum62');return !!d&&!!s&&(d.compareDocumentPosition(s)&4)>0})()"),f'[{W}] 프리셋 줄이 합계 줄 위')
    J(pg,"document.querySelector('#sheetC details.pe117 summary').click()");pg.wait_for_timeout(300)
    pg.locator('#sheetC [data-pn117]').click();pg.wait_for_timeout(600);notoast(pg)
    ok(J(pg,f"{R}.ps117.length")==2 and J(pg,"!!document.querySelector('#sheetC .rt64p details.pe117[open]')"),f'[{W}] 상세 안에서 ＋ 새 프리셋 → 2개, 편집 칸이 열린 채 다시 그려짐')
    pg.locator('#sheetC input.pe117n').fill('촬영');pg.locator('#sheetC input.pe117n').press('Enter');pg.wait_for_timeout(600);notoast(pg)
    ok(J(pg,f"{R}.ps117[1].n")=='촬영',f'[{W}] 상세에서 이름 바꾸기')
    ok(J(pg,"document.querySelectorAll('#sheetC .pr117').length")>=2,f'[{W}] 상세 프리셋 칩 2개 이상')
    # ② 프리셋별 분: 촬영에서 명상 5→15, 산책 빼기
    sid=J(pg,f"{R}.steps[1].id")
    pg.locator(f'#sheetC [data-pmin118$="|{sid}"]').fill('15');pg.locator(f'#sheetC [data-pmin118$="|{sid}"]').press('Enter');pg.wait_for_timeout(600);notoast(pg)
    ok(J(pg,f"{R}.ps117[1].m['{sid}']")==15 and J(pg,f"{R}.steps[1].min")==5,f'[{W}] 촬영의 명상만 15분(공통 5분은 그대로)')
    ok(J(pg,f"effSteps117({R},gk76()).map(s=>s.min).join(',')")=='10,5,2',f'[{W}] 일반은 공통 분 그대로 10,5,2')
    J(pg,f"(()=>{{const r={R};r.pd117=r.pd117||{{}};r.pd117[gk76()]=r.ps117[1].id;save('config');render()}})()");pg.wait_for_timeout(500)
    ok(J(pg,MN)=='10,15,2',f'[{W}] 촬영으로 고르면 분 10,15,2',J(pg,MN))
    ok(J(pg,f"rtSum62({R}).min")==27,f'[{W}] 합계 27분',J(pg,f"rtSum62({R}).min"))
    ok(J(pg,f"view83(rtT({R}),gk76()).dur")==27,f'[{W}] 캘린더 길이 27분')
    J(pg,"closeSheet()");pg.wait_for_timeout(300)
    J(pg,f"startRun({{routine:{R}}})");pg.wait_for_timeout(700)
    ok(J(pg,"!!RUN && RUN.kind==='routine'") and J(pg,"RUN.steps.map(s=>s.min).join(',')")=='10,15,2',f'[{W}] ⏱ 시작도 프리셋 분(10,15,2)',J(pg,"RUN&&RUN.steps.map(s=>s.min).join(',')"))
    J(pg,"(()=>{try{RUN=null;closeSheet();render()}catch(e){}})()");pg.wait_for_timeout(300)
    # 분을 공통과 같게 되돌리면 덮어쓰기 제거
    J(pg,f"openTaskSheet(rtT({R}).id)");pg.wait_for_timeout(600);notoast(pg)
    J(pg,"(()=>{const d=document.querySelector('#sheetC details.pe117');if(d&&!d.open)d.open=true})()");pg.wait_for_timeout(200)
    J(pg,f"(()=>{{const r={R};r.pd117[gk76()]=r.ps117[1].id}})()")
    J(pg,"closeSheet()")
    # ③ 며칠짜리 일정 + 루틴 상황
    J(pg,"""(()=>{const t=newTask({title:'장편 영화 촬영',due:addDays(gk76(),2)});t.end71=addDays(gk76(),4);saveTask(t);window.__sid=t.id;render()})()""");pg.wait_for_timeout(500)
    J(pg,f"(()=>{{const r={R};r.pd117={{}};save('config');render()}})()")
    J(pg,"openTaskSheet(window.__sid)");pg.wait_for_timeout(700);notoast(pg)
    ok(J(pg,"!!document.querySelector('#sheetC [data-rs118c]')"),f'[{W}] 일정 상세에 🧭 루틴 상황 칩')
    ok(J(pg,"(()=>{const e=document.querySelector('#sheetC [data-rs118c]');if(!e)return false;const b=e.getBoundingClientRect();return b.width>0&&b.height>0&&!e.hidden&&getComputedStyle(e).display!=='none'})()"),f'[{W}] 여러 날 일정이라 칩이 바로 보임(＋ 더 안 눌러도)')
    pg.locator('#sheetC [data-rs118c]').first.click();pg.wait_for_timeout(500)
    ok(J(pg,"document.querySelectorAll('#sheetC [data-rs118]').length")>=2,f'[{W}] 눌러서 상황 고르기 창(일반·촬영)',J(pg,"[...document.querySelectorAll('#sheetC [data-rs118]')].map(b=>b.dataset.nm).join(',')"))
    pg.locator("#sheetC [data-rs118][data-nm='촬영']").click();pg.wait_for_timeout(800);notoast(pg)
    ok(J(pg,"TASKS[window.__sid].rsit118")=='촬영',f'[{W}] 일정에 촬영 저장')
    d2,d3,d4,d5,d1=[J(pg,f"addDays(gk76(),{i})") for i in (2,3,4,5,1)]
    ok(all(J(pg,f"pset117({R},'{d}').n")=='촬영' for d in (d2,d3,d4)),f'[{W}] 일정 3일은 모두 촬영')
    ok(J(pg,f"pset117({R},'{d1}').n")=='일반' and J(pg,f"pset117({R},'{d5}').n")=='일반',f'[{W}] 전날·다음날은 일반')
    ok(J(pg,f"effSteps117({R},'{d3}').map(s=>s.min).join(',')")=='10,15,2',f'[{W}] 일정 날도 촬영 분')
    J(pg,f"(()=>{{const r={R};r.pd117=r.pd117||{{}};r.pd117['{d3}']=r.ps117[0].id}})()")
    ok(J(pg,f"pset117({R},'{d3}').n")=='일반' and J(pg,f"pset117({R},'{d2}').n")=='촬영',f'[{W}] 그날 직접 고른 프리셋이 일정보다 먼저')
    ok(J(pg,"/촬영/.test((document.querySelector('#sheetC [data-rs118c]')||{}).innerText||'')"),f'[{W}] 고른 뒤 일정 상세가 다시 열림·칩 글자 촬영',J(pg,"(document.querySelector('#sheetC [data-rs118c]')||{}).innerText"))
    # ⋯ 메뉴
    J(pg,"(()=>{const b=document.querySelector('#sheetC [data-m78=\"more\"]');if(b)b.click()})()");pg.wait_for_timeout(400)
    ok(J(pg,"[...document.querySelectorAll('#m61 *')].some(x=>/루틴 상황/.test(x.innerText||''))"),f'[{W}] ⋯ 메뉴에 🧭 루틴 상황')
    J(pg,"document.body.click();closeSheet()");pg.wait_for_timeout(300)
    # 목록 루틴 줄(그 날짜)에서 일정이 정한 상황이 보임
    J(pg,f"(()=>{{const r={R};r.pd117={{}};save('config')}})()")
    ok(J(pg,f"(()=>{{CTX117=null;const t=Object.assign({{}},rtT({R}),{{due:'{d3}'}});const h=taskRow(t,{{}});return /촬영/.test(h)}})()"),f'[{W}] 일정 날의 루틴 줄에 촬영 표시')
    J(pg,f"openRt61(window.__rid)");pg.wait_for_timeout(500)
    ok(J(pg,"document.querySelectorAll('#sheetC .pr114row').length")==1,f'[{W}] 루틴 카드(이름 누르기)에는 줄이 여전히 1개(중복 없음)')
    ok(J(pg,"document.documentElement.scrollWidth<=window.innerWidth+1"),f'[{W}] 가로로 넘치지 않음')
    b.close()
print('ERRS',[e for e in errs if 'favicon' not in e][:6])
print('FAILS',len(FAILS),FAILS)
