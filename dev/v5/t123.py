# t123 (v12.1): 루틴 상황 줄 맨 위 · 실행 화면 프리셋 · 쉬는 날 프리셋
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
R2="C.routines.find(x=>x.id===window.__rid2)"
def addp(pg):
    J(pg,f"(()=>{{const r={R};ensure117(r);r.ps117.push({{id:'w',ic:'🚗',n:'출근',s:r.ps117[0].s.slice(1)}});r.ps117.push({{id:'z',ic:'🎬',n:'일/일정',s:[],z119:1}});save('config');render()}})()");pg.wait_for_timeout(400)
with sync_playwright() as pw:
  for W,H in [(1200,800),(390,800)]:
    b,pg=run(pw,W=W,H=H);closepops(pg);notoast(pg);mk(pg)
    J(pg,"location.hash='tasks';render()");pg.wait_for_timeout(600);notoast(pg)
    # 프리셋 하나일 땐 작은 단추만
    J(pg,f"openRt61(window.__rid)");pg.wait_for_timeout(500)
    ok(J(pg,"!!document.querySelector('#sheetC .pbar119.one [data-pe119]')"),f'[{W}] 프리셋 하나면 작은 🧭 단추 하나')
    J(pg,"closeSheet()");pg.wait_for_timeout(300)
    addp(pg)
    J(pg,f"openRt61(window.__rid)");pg.wait_for_timeout(500)
    ok(J(pg,"(()=>{const c=document.querySelector('#sheetC .jarcard');const f=c&&c.firstElementChild;return !!f&&f.classList.contains('pbar119')&&!f.classList.contains('one')})()"),f'[{W}] 카드 맨 위(이름 칸 앞)에 상황 줄')
    ok(J(pg,"document.querySelectorAll('#sheetC .pbar119 .c119').length")>=3,f'[{W}] 칩 3개')
    ok(J(pg,"document.querySelectorAll('#sheetC .pr114row').length")==0,f'[{W}] 예전 아래쪽 줄은 없음')
    ok(J(pg,"!!document.querySelector('#sheetC details.pe117')"),f'[{W}] 편집 접힘은 그대로')
    y=J(pg,"(()=>{const e=document.querySelector('#sheetC .pbar119');const s=document.getElementById('sheetC');return e.getBoundingClientRect().top-s.getBoundingClientRect().top})()")
    ok(y<140,f'[{W}] 카드 상황 줄이 위쪽(시트 맨 위에서 {y:.0f}px)')
    ok(J(pg,"document.documentElement.scrollWidth<=innerWidth+1"),f'[{W}] 가로로 안 넘침')
    pg.screenshot(path=f'/tmp/t123_card_{W}.png')
    # ✎ 단추 = 편집 접힘 펴기
    J(pg,"document.querySelector('#sheetC [data-pe119]').click()");pg.wait_for_timeout(500)
    ok(J(pg,"document.querySelector('#sheetC details.pe117').open"),f'[{W}] ✎ 누르면 편집 칸이 펴짐')
    J(pg,"closeSheet()");pg.wait_for_timeout(300)
    # 할 일 상세
    J(pg,f"openTaskSheet(rtT({R}).id)");pg.wait_for_timeout(700)
    ok(J(pg,"(()=>{const b=document.querySelector('#sheetC .pbar119.mv');const h=document.getElementById('tsTitle').closest('.sh');return !!b&&h.nextElementSibling===b})()"),f'[{W}] 할 일 상세: 머리줄 바로 아래에 상황 줄')
    ok(J(pg,"document.querySelectorAll('#sheetC .pbar119').length")==1,f'[{W}] 상세에 상황 줄 하나만')
    pg.screenshot(path=f'/tmp/t123_detail_{W}.png')
    # 상세에서 고르면 반영
    J(pg,"document.querySelector('#sheetC .pbar119 [data-pk117$=\"|w\"]').click()");pg.wait_for_timeout(500);notoast(pg)
    ok(J(pg,f"pset117({R},gk76()).id")=='w',f'[{W}] 상세 줄에서 출근 고르기')
    ok(J(pg,"!!document.querySelector('#sheetC .pbar119.mv [aria-pressed=true][data-pk117$=\"|w\"]')"),f'[{W}] 다시 그려도 줄 하나·출근 ✓')
    J(pg,"closeSheet()");pg.wait_for_timeout(300)
    # 실행 화면 칩
    J(pg,f"{R}.pd117={{}};save('config')")
    J(pg,f"startRun({{routine:{R}}})");pg.wait_for_timeout(700)
    ok(J(pg,"RUN.steps.length")==3 and J(pg,"document.querySelectorAll('#hunt .pbar119.run .c119').length")==3,f'[{W}] 실행 화면에 프리셋 칩 3개(일반 3단계)')
    ok(J(pg,"document.documentElement.scrollWidth<=innerWidth+1"),f'[{W}] 실행 화면 가로로 안 넘침')
    pg.screenshot(path=f'/tmp/t123_run_{W}.png')
    # 첫 단계(산책) 끝내고 출근(명상>세수)으로 → 산책은 그대로 로그, 남은 2단계
    J(pg,"huntDo('done')");pg.wait_for_timeout(500)
    J(pg,"document.querySelector('#hunt [data-hp119=\"w\"]').click()");pg.wait_for_timeout(600);notoast(pg)
    ok(J(pg,"RUN.steps.map(s=>stName61(s)).join('>')")=='산책>명상>세수' and J(pg,"RUN.si")==1 and J(pg,"RUN.log.length")==1,f'[{W}] 끝낸 산책은 그대로·남은 명상>세수',J(pg,"RUN.steps.map(s=>stName61(s)).join('>')+' si'+RUN.si"))
    # 일반으로 되돌리면: 산책은 이미 끝냈으니 안 돌아옴
    J(pg,"document.querySelector('#hunt [data-hp119=\"n\"]').click()");pg.wait_for_timeout(600);notoast(pg)
    ok(J(pg,"RUN.steps.map(s=>stName61(s)).join('>')")=='산책>명상>세수',f'[{W}] 일반으로 바꿔도 끝낸 산책은 다시 안 함')
    # 순서가 다른 프리셋: 세수>명상
    J(pg,f"(()=>{{const r={R};const w=r.ps117.find(p=>p.id==='w');w.s=[r.steps[2].id,r.steps[1].id];save('config')}})()")
    J(pg,"document.querySelector('#hunt [data-hp119=\"w\"]').click()");pg.wait_for_timeout(600);notoast(pg)
    ok(J(pg,"RUN.steps.map(s=>stName61(s)).join('>')")=='산책>명상>세수' and J(pg,"stName61(RUN.steps[RUN.si])")=='명상',f'[{W}] 하던 명상은 맨 앞에 두고 나머지만 새 순서',J(pg,"RUN.steps.map(s=>stName61(s)).join('>')+' cur:'+stName61(RUN.steps[RUN.si])"))
    J(pg,f"(()=>{{const r={R};r.ps117.push({{id:'x',ic:'🧼',n:'세수만',s:[r.steps[2].id]}});save('config');render()}})()");pg.wait_for_timeout(300)
    J(pg,"RUN.steps[RUN.si].el75=0;RUN.stepStart=Date.now()-65000;runSave()")
    J(pg,"drawHunt(true)");pg.wait_for_timeout(200)
    J(pg,"document.querySelector('#hunt [data-hp119=\"x\"]').click()");pg.wait_for_timeout(600);notoast(pg)
    ok(J(pg,"RUN.steps.map(s=>stName61(s)).join('>')")=='산책>세수' and J(pg,"stName61(RUN.steps[RUN.si])")=='세수',f'[{W}] 하던 단계가 새 프리셋에 없으면 새 첫 단계부터',J(pg,"RUN.steps.map(s=>stName61(s)).join('>')"))
    J(pg,"document.querySelector('#hunt [data-hp119=\"w\"]').click()");pg.wait_for_timeout(600);notoast(pg)
    ok(J(pg,"stepElapsed()")<5,f'[{W}] (새로 시작한 단계는 시간 0부터)',J(pg,"stepElapsed()"))
    J(pg,"RUN.stepStart=Date.now()-65000;runSave()");pg.wait_for_timeout(100)
    J(pg,"document.querySelector('#hunt [data-hp119=\"n\"]').click()");pg.wait_for_timeout(600);notoast(pg)
    ok(J(pg,"stepElapsed()")>60,f'[{W}] 같은 단계가 남는 프리셋으로 바꾸면 쓴 시간 이어서',J(pg,"stepElapsed()"))
    ok(J(pg,f"(({R}).pd117||{{}})[gk76()]")=='n',f'[{W}] 고른 프리셋을 오늘 기록으로 저장')
    # 쉬는 날 프리셋: 이미 한 단계가 있으면 막음
    J(pg,"document.querySelector('#hunt [data-hp119=\"z\"]').click()");pg.wait_for_timeout(500);notoast(pg)
    ok(J(pg,"!!RUN")==True and J(pg,f"pset117({R},gk76()).id")=='n',f'[{W}] 끝낸 단계가 있으면 쉬는 날로 못 바꿈')
    J(pg,"endRun(true)")
    J(pg,"""(()=>{const r=rtNew61('테스트 저녁',[{name:'스트레칭',min:5},{name:'일기',min:5}]);setRt60(r,[0,1,2,3,4,5,6]);syncDailies(C);save('config');render();window.__rid2=r.id})()""");pg.wait_for_timeout(700);notoast(pg)
    J(pg,"(()=>{const r=C.routines.find(x=>x.id===window.__rid2);sync62(r);ensure117(r);r.ps117.push({id:'z',ic:'🎬',n:'일/일정',s:[],z119:1});save('config');render()})()");pg.wait_for_timeout(500)
    J(pg,f"startRun({{routine:{R2}}})");pg.wait_for_timeout(600)
    J(pg,"document.querySelector('#hunt [data-hp119=\"z\"]').click()");pg.wait_for_timeout(900);notoast(pg)
    ok(J(pg,"!RUN"),f'[{W}] 시작 전 쉬는 날 칩 → 실행 닫힘')
    h=J(pg,f"(()=>{{const h=rtT({R2});return {{due:h.due,sk:h.skip61||[],skull:!!h.skull,td:midKey68()}}}})()")
    ok(h['due']>h['td'] and h['td'] in h['sk'] and not h['skull'],f'[{W}] 오늘 건너뜀(skip61에 기록·다음 차례로·☠ 없음)',h)
    # 목록 줄 글자
    J(pg,f"(()=>{{const r={R2};const h=rtT(r);h.due=midKey68();delete h.skip61;r.pd117={{[midKey68()]:'z'}};saveTask(h);save('config')}})()")
    J(pg,"location.hash='tasks';render()");pg.wait_for_timeout(500)
    ok(J(pg,f"rtT({R2}).due>midKey68()"),f'[{W}] 쉬는 날 프리셋을 고른 오늘은 render에서 저절로 건너뜀')
    # 앞날은 건드리지 않음: 내일 프리셋을 쉬는 날로 해도 지금은 그대로
    J(pg,f"(()=>{{const r={R2};const h=rtT(r);r.pd117={{[h.due]:'z'}};save('config');render()}})()");pg.wait_for_timeout(400)
    ok(J(pg,f"rtT({R2}).due>midKey68()"),f'[{W}] 앞날(내일)은 건드리지 않음')
    # 편집: 마지막 단계도 뺄 수 있음 + 새 단계가 생겨도 안 붙음
    J(pg,f"(()=>{{const r={R};r.ps117.push({{id:'q',ic:'🛌',n:'쉼',s:[r.steps[0].id]}});save('config')}})()")
    J(pg,f"O117[{R}.id]='q';openRt61(window.__rid)");pg.wait_for_timeout(500)
    J(pg,"document.querySelector('#sheetC details.pe117').open=true")
    pg.locator('#sheetC [data-pcs117$=\"|'+J(pg,f"{R}.steps[0].id")+'\"]').nth(0).uncheck();pg.wait_for_timeout(500);notoast(pg)
    ok(J(pg,f"{R}.ps117.find(p=>p.id==='q').s.length")==0 and J(pg,f"{R}.ps117.find(p=>p.id==='q').z119")==1,f'[{W}] 마지막 단계도 빼면 쉬는 날 프리셋')
    J(pg,f"(()=>{{const r={R};const t=newTask?0:0}})()")
    print(W,errs[-3:])
    b.close()
print('ERRS',[e for e in errs if 'favicon' not in e][:6])
print('FAILS',len(FAILS),FAILS)
