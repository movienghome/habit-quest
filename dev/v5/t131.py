# t131 (v12.6): 루틴 카드 통합·미니멀 R1~R4 · 끝낸 며칠짜리 막대가 목록 색을 따름
import os,json
os.environ.setdefault('HQURL','file:///home/claude/habit-quest/beta/index.html')
exec(open('/home/claude/habit-quest/dev/v5/h61.py').read())
URL=os.environ.get('HQURL',URL)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
J=lambda pg,x:pg.evaluate(x)
def notoast(pg):J(pg,"(()=>{const t=document.getElementById('toast');if(t){t.classList.remove('on');t.style.pointerEvents=''}})()")
def mk(pg):
    J(pg,"""(()=>{const r=rtNew61('테스트 아침',[{name:'산책',min:10},{name:'명상',min:5},{name:'세수',min:2}]);setRt60(r,[0,1,2,3,4,5,6]);syncDailies(C);save('config');render();window.__rid=r.id})()""")
    pg.wait_for_timeout(700);notoast(pg)
    J(pg,"(()=>{const r=C.routines.find(x=>x.id===window.__rid);sync62(r);save('config');render()})()");pg.wait_for_timeout(500)
R="C.routines.find(x=>x.id===window.__rid)"
with sync_playwright() as pw:
  for W,H in [(1200,800),(390,800)]:
    b,pg=run(pw,W=W,H=H);closepops(pg);notoast(pg);mk(pg)
    J(pg,"location.hash='tasks';render()");pg.wait_for_timeout(600);notoast(pg)
    J(pg,f"openRt61(window.__rid)");pg.wait_for_timeout(500)
    # ---- R1 ----
    ok(J(pg,"!!document.querySelector('#sheetC .hd124 .sc124')"),f'[{W}] R1 머리 한 줄(.hd124)')
    ok(not J(pg,"document.querySelector('#sheetC .sc124').open"),f'[{W}] R1 점수 접힘이 닫혀 있음')
    ok('✨15' in J(pg,"document.querySelector('#sheetC .sc124 summary').textContent"),f'[{W}] R1 요약에 ✨15',J(pg,"document.querySelector('#sheetC .sc124 summary').textContent"))
    hv=J(pg,"(()=>{const e=document.querySelector('#sheetC .hd124');return e.getBoundingClientRect().height})()")
    ok(hv<60,f'[{W}] R1 머리가 한 줄 높이',hv)
    J(pg,"document.querySelector('#sheetC .sc124 summary').click()");pg.wait_for_timeout(300)
    ok(J(pg,"document.querySelector('#sheetC .sc124').open")and J(pg,"document.querySelectorAll('#sheetC .sc124 [data-r61f]').length")==3,f'[{W}] R1 눌러 펴면 값 칸 3개')
    pg.fill("#sheetC .sc124 [data-r61f$=':xp']",'20');pg.keyboard.press('Tab');pg.wait_for_timeout(500)
    ok(J(pg,f"{R}.xp")==20 or J(pg,f"{R}.bonus")==20 or '✨20' in J(pg,"document.querySelector('#sheetC .sc124 summary').textContent"),f'[{W}] R1 값 칸 고치면 저장·요약 바뀜',J(pg,"document.querySelector('#sheetC .sc124 summary').textContent"))
    ok(J(pg,"document.querySelector('#sheetC .sc124').open"),f'[{W}] R1 고친 뒤에도 펼침 유지')
    # ---- R2 하나일 때 ----
    ok(J(pg,"document.querySelectorAll('#sheetC details.pe117').length")==0,f'[{W}] R2 편집 접힘이 없음(프리셋 하나)')
    ok(J(pg,"!!document.querySelector('#sheetC .pbar119.one [data-pn117]')"),f'[{W}] R2 하나면 바로 만들기 단추')
    J(pg,"document.querySelector('#sheetC .pbar119.one [data-pn117]').click()");pg.wait_for_timeout(600);notoast(pg)
    ok(J(pg,f"{R}.ps117.length")==2,f'[{W}] R2 단추로 프리셋 생김')
    ok(J(pg,"!!document.querySelector('#sheetC .pt124')"),f'[{W}] R2 둘 이상이면 탭 줄')
    ok(J(pg,"document.querySelectorAll('#sheetC details.pe117').length")==0,f'[{W}] R2 접힘 없음(둘 이상)')
    ok(J(pg,"document.querySelectorAll('#sheetC .st62s .st62 .pc124').length")==3,f'[{W}] R2 단계 목록에 체크 3개')
    names=J(pg,"[...document.querySelectorAll('#sheetC .st62s .st62 .st62n b')].map(e=>e.textContent)")
    ok(names==['산책','명상','세수'],f'[{W}] R2 단계 순서',names)
    # 편집 대상 = 새 프리셋. ↓ 눌러 순서 바꾸기 → 새 프리셋만 바뀜
    J(pg,"document.querySelector('#sheetC .st62s .st62 [data-pm117$=\"|dn\"]').click()");pg.wait_for_timeout(600);notoast(pg)
    names=J(pg,"[...document.querySelectorAll('#sheetC .st62s .st62 .st62n b')].map(e=>e.textContent)")
    ok(names[:2]==['명상','산책'],f'[{W}] R2 ↓로 이 프리셋 순서가 바뀜',names)
    ok(J(pg,f"(()=>{{const r={R};const a=r.ps117[0].s,b=r.ps117[1].s;return a.join()!==b.join()}})()"),f'[{W}] R2 다른 프리셋 순서는 그대로')
    # 체크 빼기 → 아래로 흐리게
    J(pg,"document.querySelector('#sheetC .st62s .st62 .pc124').click()");pg.wait_for_timeout(600);notoast(pg)
    ok(J(pg,"document.querySelectorAll('#sheetC .st62.off124').length")==1,f'[{W}] R2 체크 빼면 안 하는 단계로 내려감')
    ok(J(pg,f"{R}.ps117[1].s.length")==2,f'[{W}] R2 프리셋 단계 2개')
    # 분(이 프리셋만)
    J(pg,"document.querySelector('#sheetC .st62s .st62 [data-pmin118]').scrollIntoView()")
    pg.fill("#sheetC .st62s .st62 [data-pmin118]",'7');pg.keyboard.press('Tab');pg.wait_for_timeout(600);notoast(pg)
    ok(J(pg,f"Object.values({R}.ps117[1].m||{{}}).includes(7)"),f'[{W}] R2 분은 이 프리셋만')
    # 이름·복제·삭제 접힘
    ok(J(pg,"!!document.querySelector('#sheetC .pm124 [data-pf117$=\"|n\"]')"),f'[{W}] R2 이름 칸이 작은 접힘에 있음')
    # ---- R3 ----
    ok(J(pg,"!!document.querySelector('#sheetC .when124 .when60')&&!!document.querySelector('#sheetC .when124 .when123')"),f'[{W}] R3 📅 언제 한 상자')
    ok(J(pg,"document.querySelectorAll('#sheetC [data-bt124]').length")==1,f'[{W}] R3 기본 시각 칸')
    # 기본 08:00, 새 프리셋 13:00 → 머리 시각이 그 날짜 프리셋 따라감
    J(pg,f"(()=>{{const r={R},h=rtT(r);r.bt124='08:00';r.ps117[1].tm='13:00';delete r.ps117[0].tm;delete r.pd117;r.pd117={{}};r.pd117[h.due]=r.ps117[1].id;save('config');render()}})()");pg.wait_for_timeout(700)
    ok(J(pg,f"rtT({R}).time")=='13:00',f'[{W}] R3 프리셋 시각이 머리 시각(목록·홈·알림용)',J(pg,f"rtT({R}).time"))
    J(pg,f"(()=>{{const r={R},h=rtT(r);r.pd117[h.due]=r.ps117[0].id;save('config');render()}})()");pg.wait_for_timeout(700)
    ok(J(pg,f"rtT({R}).time")=='08:00',f'[{W}] R3 프리셋 시각이 없으면 기본 시각',J(pg,f"rtT({R}).time"))
    # 기본 시각 칸으로 바꾸기
    J(pg,"closeSheet()");pg.wait_for_timeout(300);J(pg,f"openRt61(window.__rid)");pg.wait_for_timeout(500)
    J(pg,"(()=>{const i=document.querySelector('#sheetC [data-bt124]');i.value='09:30';i.dispatchEvent(new Event('change',{bubbles:true}))})()");pg.wait_for_timeout(700)
    ok(J(pg,f"{R}.bt124")=='09:30' and J(pg,f"rtT({R}).time")=='09:30',f'[{W}] R3 기본 시각 칸 → 머리 시각',J(pg,f"rtT({R}).time"))
    # 프리셋을 하나로 줄이면 기본 시각이 머리 시각으로 돌아가고 bt124 지움
    J(pg,f"(()=>{{const r={R};r.ps117=[r.ps117[0]];save('config');render()}})()");pg.wait_for_timeout(700)
    ok(J(pg,f"{R}.bt124")is None and J(pg,f"rtT({R}).time")=='09:30',f'[{W}] R3 하나로 줄면 기본 시각을 그대로 둠')
    ok(J(pg,"document.documentElement.scrollWidth<=innerWidth+1"),f'[{W}] 가로로 안 넘침')
    J(pg,"closeSheet()");pg.wait_for_timeout(300)
    # ---- 카드 높이(폰) ----
    J(pg,f"openRt61(window.__rid)");pg.wait_for_timeout(500)
    pg.screenshot(path=f'/tmp/t131_card_{W}.png')
    J(pg,"closeSheet()");pg.wait_for_timeout(300)
    # ---- R4 ----
    J(pg,f"(()=>{{const r={R};ensure117(r);r.ps117.push({{id:'w',ic:'🚗',n:'출근',s:r.ps117[0].s.slice()}});save('config');render()}})()");pg.wait_for_timeout(400)
    J(pg,"localStorage.setItem('hq_sv124','0')")
    J(pg,f"startRun({{routine:{R}}})");pg.wait_for_timeout(900)
    if J(pg,"!!RUN&&RUN.kind==='routine'"):
        names=J(pg,"RUN.steps.map(s=>s.name)")
        J(pg,"hMenu75(1)");pg.wait_for_timeout(300)
        ok(J(pg,"!!document.querySelector('#hunt .m75 [data-sv124]')"),f'[{W}] R4 단계 창에 프리셋 저장 체크')
        before=J(pg,f"{R}.ps117[0].s.join()")
        J(pg,"document.querySelector('#hunt .m75 [data-m123^=dn]').click()");pg.wait_for_timeout(400)
        ok(J(pg,f"{R}.ps117[0].s.join()")==before,f'[{W}] R4 꺼 두면 프리셋은 그대로(오늘만)')
        J(pg,"hMenu75(1)");pg.wait_for_timeout(300)
        pg.evaluate("(()=>{const c=document.querySelector('#hunt .m75 [data-sv124]');c.checked=true;c.dispatchEvent(new Event('change',{bubbles:true}))})()")
        ok(J(pg,"localStorage.getItem('hq_sv124')")=='1',f'[{W}] R4 체크하면 기기에 기억')
        o0=J(pg,"RUN.steps.map(s=>s.name)")
        J(pg,"document.querySelector('#hunt .m75 [data-m123^=dn]').click()");pg.wait_for_timeout(400)
        o1=J(pg,"RUN.steps.map(s=>s.name)")
        ok(o0!=o1,f'[{W}] R4 오늘 순서가 바뀜',(o0,o1))
        after=J(pg,f"{R}.ps117[0].s.join()")
        ok(after!=before,f'[{W}] R4 켜 두면 프리셋 순서도 바뀜')
    else:
        ok(False,f'[{W}] R4 실행 화면이 안 열림')
    b.close()
  # ---- 며칠짜리 끝낸 막대가 목록 색을 따라감 ----
  for W in (1400,420):
    b,pg=run(pw,W=W,H=900);closepops(pg);notoast(pg)
    J(pg,"""(()=>{const td=midKey68();C.lists=C.lists||[];C.lists.push({id:'Lc131',name:'색시험',folder:'',color:'#e8590c'});
      const mk=(ti,o)=>{const t=newTask({title:ti});Object.assign(t,o);saveTask(t);return t};
      const d=mk('끝낸며칠',{due:addDays(td,2),end71:addDays(td,4),list:'Lc131'});
      window.__d=d.id;C.ui.cal.mode='month';ui.calAnchor=td;location.hash='cal';save('config');render()})()""");pg.wait_for_timeout(1000)
    open_bg=J(pg,"(()=>{const b=document.querySelector('.mgrid .bar83[data-ctask=\"'+window.__d+'\"]');return b?getComputedStyle(b).backgroundColor:null})()")
    J(pg,"completeTask(TASKS[window.__d])");pg.wait_for_timeout(1000);closepops(pg)
    J(pg,"(()=>{C.ui.cal.mode='month';ui.calAnchor=midKey68();renderCal()})()");pg.wait_for_timeout(1000)
    r=json.loads(J(pg,"""(()=>{const g=document.querySelector('.mgrid'),o={};const b=g.querySelector('.bar83.d119');
      o.found=!!b;if(b){o.lc=b.classList.contains('lc70');o.bg=getComputedStyle(b).backgroundColor;o.line=getComputedStyle(b).outlineStyle;o.deco=getComputedStyle(b).textDecorationLine}return JSON.stringify(o)})()"""))
    print(W,open_bg,r)
    ok(r['found'],f'[{W}] 끝낸 며칠짜리 막대가 있음')
    if r['found']:
        import re
        c=[float(x) for x in re.findall(r'[\d.]+',r['bg'])[:3]]
        ok(r['lc'],f'[{W}] 끝낸 막대에 목록 색 표시(lc70)')
        ok(c[0]>c[2]+0.05,f'[{W}] 끝낸 막대 배경이 목록 색(주황) 쪽',r['bg'])
        ok(r['line']=='dashed' and 'line-through' in r['deco'],f'[{W}] 점선·취소선은 그대로(색만으로 구분 안 함)',(r['line'],r['deco']))
    b.close()
print('FAILS',len(FAILS),FAILS)
