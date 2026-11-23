# t122 (v11.9): 루틴 상황 프리셋 n개 — 프리셋마다 단계·순서, 날짜별 고르기, 시작 전에 안 묻기
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
V=".view:not([hidden]) "
NM="(r=>effSteps117(r,gk76()).map(s=>stName61(s)).join('>'))("+R+")"
with sync_playwright() as pw:
  for W,H in [(1200,800),(390,800)]:
    b,pg=run(pw,W=W,H=H);closepops(pg);notoast(pg);mk(pg)
    J(pg,"location.hash='tasks';render()");pg.wait_for_timeout(700);notoast(pg)
    rowq=f"{V}.trow[data-task='\"+(rtT({R})||{{}}).id+\"'] .pc117"
    ok(J(pg,f"document.querySelectorAll('{V}.pc117').length")>=1,f'[{W}] 목록 루틴 줄에 단계·분 글자 단추(.pc117)')
    ok(J(pg,f"(()=>{{const b=[...document.querySelectorAll('{V}.pc117')].find(x=>x.dataset.pc117.startsWith(window.__rid));return !!b&&/3단계/.test(b.innerText)&&!/일반/.test(b.innerText)}})()"),f'[{W}] 프리셋 하나일 땐 원래 글자 그대로')
    ok(J(pg,f"ensure117({R}).length")==1 and J(pg,NM)=='산책>명상>세수',f'[{W}] 처음엔 일반 하나(전체 단계)')
    # 카드에서 프리셋 만들기
    J(pg,f"openRt61(window.__rid)");pg.wait_for_timeout(500)
    ok(J(pg,"!!document.querySelector('#sheetC .pt117') && !document.querySelector('#sheetC details.pe117').open"),f'[{W}] 카드 맨 위에 오늘 줄, 편집 칸은 접힘')
    J(pg,"document.querySelector('#sheetC details.pe117 summary').click()");pg.wait_for_timeout(300)
    pg.locator('#sheetC [data-pn117]').click();pg.wait_for_timeout(500);notoast(pg)
    ok(J(pg,f"{R}.ps117.length")==2,f'[{W}] ＋ 새 프리셋 → 2개')
    pg.locator('#sheetC input.pe117n').fill('출근');pg.locator('#sheetC input.pe117n').press('Enter');pg.wait_for_timeout(500);notoast(pg)
    ok(J(pg,f"{R}.ps117[1].n")=='출근',f'[{W}] 이름 바꾸기')
    pg.locator('#sheetC [data-pcs117$="|'+J(pg,f"{R}.steps[0].id")+'"]').uncheck();pg.wait_for_timeout(400);notoast(pg)
    ok(J(pg,f"{R}.ps117[1].s.length")==2 and J(pg,f"{R}.ps117[0].s.length")==3,f'[{W}] 출근에서 산책 빼기(일반은 그대로)')
    pg.locator('#sheetC [data-pm117$="|up"]').nth(1).click();pg.wait_for_timeout(400);notoast(pg)
    ok(J(pg,f"{R}.ps117[1].s.map(i=>stName61({R}.steps.find(s=>s.id===i))).join('>')")=='세수>명상',f'[{W}] ↑↓로 순서 바꾸기 → 세수>명상')
    J(pg,"closeSheet()");pg.wait_for_timeout(300)
    # 안 골랐으면 기본(일반)으로 묻지 않고 시작
    J(pg,f"startRun({{routine:{R}}})");pg.wait_for_timeout(600)
    ok(J(pg,"document.getElementById('sheet').hidden || !document.querySelector('#sheetC .sit116,#sheetC .sit117')") and J(pg,"!!RUN && RUN.kind==='routine'") and J(pg,"RUN.steps.length")==3,f'[{W}] 안 골랐으면 묻지 않고 일반(3단계)으로 시작')
    J(pg,"(()=>{try{RUN=null;closeSheet();render()}catch(e){}})()");pg.wait_for_timeout(300)
    J(pg,"location.hash='tasks';render()");pg.wait_for_timeout(700);notoast(pg)
    # 목록 줄에서 고르기
    pg.evaluate(f"(()=>{{const b=[...document.querySelectorAll('{V}.pc117')].find(x=>x.dataset.pc117.startsWith(window.__rid));b.scrollIntoView({{block:'center'}})}})()")
    pg.locator(f"{V}.pc117[data-pc117^='"+J(pg,"window.__rid")+"']").first.click();pg.wait_for_timeout(500)
    ok(J(pg,"document.querySelectorAll('#sheetC [data-pk117]').length")==2,f'[{W}] 목록 단추 → 프리셋 고르기 창(2칸)')
    ok(J(pg,"[...document.querySelectorAll('#sheetC .s117')].every(b=>b.getBoundingClientRect().height>=44)"),f'[{W}] 누르기 쉬운 높이')
    pg.locator('#sheetC [data-pk117$="|'+J(pg,f"{R}.ps117[1].id")+'"]').click();pg.wait_for_timeout(600);notoast(pg)
    ok(J(pg,"document.getElementById('sheet').hidden"),f'[{W}] 한 번 누르면 닫힘')
    ok(J(pg,NM)=='세수>명상' and J(pg,f"pk114({R})")==J(pg,f"{R}.ps117[1].id"),f'[{W}] 오늘 프리셋 = 출근')
    ok(J(pg,f"(()=>{{const b=[...document.querySelectorAll('{V}.pc117')].find(x=>x.dataset.pc117.startsWith(window.__rid));return !!b&&/출근/.test(b.innerText)&&/2단계/.test(b.innerText)}})()"),f'[{W}] 줄 글자가 출근 · 2단계로 바뀜')
    ok(J(pg,f"document.querySelectorAll('{V}.sit115,{V}.sit116').length")==0,f'[{W}] 목록에 따로 늘어난 줄 없음')
    ok(J(pg,f"(()=>{{const r={R},t=TASKS[r.steps[0].tid],u=TASKS[r.steps[1].tid];return stDoneHide72(t)===true&&stDoneHide72(u)===false}})()"),f'[{W}] 쉬는 단계(산책)는 목록에서 숨고 하는 단계(명상)는 보임')
    # 실행: 고른 프리셋대로(순서 포함)
    J(pg,f"startRun({{routine:{R}}})");pg.wait_for_timeout(700)
    ok(J(pg,"!!RUN && RUN.kind==='routine'") and J(pg,"RUN.steps.map(s=>s.name).join('>')")=='세수>명상',f'[{W}] ⏱ 시작 = 고른 프리셋 순서대로 세수>명상',J(pg,"RUN&&RUN.steps.map(s=>s.name).join('>')"))
    J(pg,"(()=>{try{RUN=null;closeSheet();render()}catch(e){}})()");pg.wait_for_timeout(300)
    # 체크 창: 고른 프리셋 단계만·순서대로
    J(pg,f"rtDone64({R})");pg.wait_for_timeout(500)
    ok(J(pg,"[...document.querySelectorAll('#sheetC .d64r .nm')].map(x=>x.innerText.trim()).join('>')")=='세수>명상',f'[{W}] 체크 창도 세수>명상')
    ok(J(pg,"document.querySelectorAll('#sheetC .pr117').length")==2,f'[{W}] 체크 창 위에 프리셋 칩 줄')
    J(pg,"closeSheet()");pg.wait_for_timeout(300)
    # 완주 = 고른 프리셋 단계 다 함
    ok(J(pg,f"rtNeed71({R},()=>false).st.length")==2,f'[{W}] 완주 판단 단계 = 2개')
    J(pg,f"(()=>{{const r={R};effSteps117(r,gk76()).forEach(s=>{{const t=TASKS[s.tid];completeTask(t,{{direct:true}})}});}})()");pg.wait_for_timeout(700);closepops(pg)
    ok(J(pg,f"rtNeed71({R},stIsDone71({R},dateKey())).ok"),f'[{W}] 출근 2단계만 해도 완주 인정')
    # 다음 차례(내일) 날짜별 고르기
    J(pg,"location.hash='tasks';render()");pg.wait_for_timeout(700);notoast(pg)
    J(pg,"document.querySelector(\"[data-tsel='tomorrow']\").click()");pg.wait_for_timeout(700);notoast(pg)
    nxt=J(pg,f"(()=>{{const h=rtT({R});return h&&h.due}})()")
    ok(bool(nxt) and nxt>J(pg,"gk76()"),f'[{W}] 오늘 한 뒤 다음 차례는 앞날',nxt)
    pg.evaluate(f"(()=>{{const b=[...document.querySelectorAll('{V}.pc117')].find(x=>x.dataset.pc117.startsWith(window.__rid));if(b)b.scrollIntoView({{block:'center'}})}})()")
    if J(pg,f"!![...document.querySelectorAll('{V}.pc117')].find(x=>x.dataset.pc117.startsWith(window.__rid))"):
        pg.locator(f"{V}.pc117[data-pc117^='"+J(pg,"window.__rid")+"']").first.click();pg.wait_for_timeout(500)
        ok(J(pg,"document.querySelector('#sheetC h3').innerText.includes('내일')"),f'[{W}] 내일 목록 줄에서도 고르기 창(제목에 내일)')
        pg.locator('#sheetC [data-pk117$="|'+J(pg,f"{R}.ps117[0].id")+'"]').click();pg.wait_for_timeout(500);notoast(pg)
        ok(J(pg,f"(({R}).pd117||{{}})['{nxt}']")==J(pg,f"{R}.ps117[0].id"),f'[{W}] 내일은 일반으로 미리 골라 둠')
        ok(J(pg,f"effSteps117({R},'{nxt}').length")==3 and J(pg,f"effSteps117({R},gk76()).length")==2,f'[{W}] 날짜마다 따로(오늘 출근 2·내일 일반 3)')
    else:
        ok(False,f'[{W}] 다음 차례 줄이 목록에 없음')
    ok(J(pg,"document.documentElement.scrollWidth<=window.innerWidth+1"),f'[{W}] 가로로 넘치지 않음')
    # 프리셋 삭제·되돌리기
    J(pg,f"openRt61(window.__rid)");pg.wait_for_timeout(500)
    J(pg,"document.querySelector('#sheetC details.pe117').open=true");pg.wait_for_timeout(300)
    pg.locator('#sheetC [data-pdel117]').click();pg.wait_for_timeout(500)
    ok(J(pg,f"{R}.ps117.length")==1,f'[{W}] 프리셋 삭제')
    b.close()
  # 옛 설정 옮기기
  b,pg=run(pw,W=1200,H=800);closepops(pg);notoast(pg);mk(pg)
  J(pg,"(()=>{const r=C.routines.find(x=>x.id===window.__rid);r.steps.forEach(s=>{if(!s.id)s.id=uid()});r.pre114={w:[r.steps[0].id],o:[r.steps[0].id,r.steps[1].id]};r.pk114={d:gk76(),p:'o'};delete r.ps117;save('config');render()})()")
  ok(J(pg,f"ensure117({R}).map(p=>p.n).join(',')")=='일반,출근,외근' and J(pg,f"pk114({R})")=='o',f'옛 일반·출근·외근 설정과 오늘 외근 선택을 프리셋으로 옮김')
  ok(J(pg,NM)=='세수',f'외근 = 세수 하나')
  b.close()
print('ERRS',[e for e in errs if 'favicon' not in e][:6])
print('FAILS',len(FAILS),FAILS)
