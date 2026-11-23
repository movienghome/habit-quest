# t132 (v12.7): 루틴 상세 군더더기 걷어내기(R5) · 🛏 어젯밤 창 야식·술 → 어제 기록
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
R="C.routines.find(x=>x.id===window.__rid)"
with sync_playwright() as pw:
  for W,H in [(1200,1000),(390,900)]:
    b,pg=run(pw,W=W,H=H);closepops(pg);notoast(pg)
    J(pg,"""(()=>{const r=rtNew61('테스트 아침',[{name:'산책',min:10},{name:'명상',min:5},{name:'세수',min:2}]);setRt60(r,[0,1,2,3,4,5,6]);syncDailies(C);save('config');render();window.__rid=r.id})()""")
    pg.wait_for_timeout(700);notoast(pg)
    J(pg,"location.hash='tasks';render()");pg.wait_for_timeout(500);notoast(pg)
    J(pg,"(()=>{const r=C.routines.find(x=>x.id===window.__rid);const t=Object.values(TASKS).find(t=>t.rid===r.id&&!t.parent);window.__tid=t.id;openTaskSheet(t.id)})()");pg.wait_for_timeout(700);notoast(pg)
    # ① 중복 칩 숨김
    vis=J(pg,"[...document.querySelectorAll('#sheetC .tchips > .tch')].filter(e=>e.offsetParent!==null).map(e=>e.dataset.k79||'more')")
    ok(not any(k in vis for k in ['when','list','card','size']),f'[{W}] ① 루틴 상세 위 칩에서 날짜·목록·카드·크기가 숨음',vis)
    ok('prio' in vis and 'area' in vis,f'[{W}] ① 중요도·영역 칩은 그대로',vis)
    # ② 단계 한 줄
    hs=J(pg,"[...document.querySelectorAll('#sheetC .st62s .st62')].map(e=>Math.round(e.getBoundingClientRect().height))")
    ok(len(hs)==3 and max(hs)<=50,f'[{W}] ② 단계 한 줄 높이(≤50px)',hs)
    ok(J(pg,"[...document.querySelectorAll('#sheetC .st62s .st62 .x125')].every(e=>e.offsetParent===null)"),f'[{W}] ② 처음엔 ⋯ 줄이 접혀 있음')
    J(pg,"document.querySelector('#sheetC .st62 .mo125').click()");pg.wait_for_timeout(200)
    ok(J(pg,"(()=>{const x=document.querySelector('#sheetC .st62 .x125');return x.offsetParent!==null&&!!x.querySelector('.fl70')&&!!x.querySelector('.pt62')&&!!x.querySelector('[data-r62op^=\"del:\"]')&&!!x.querySelector('.why')})()"),f'[{W}] ② ⋯를 누르면 점수·🌊·×·카드 잇기가 펴짐')
    # ↓로 순서 바꾸기·분 고치기가 그대로 됨
    J(pg,"document.querySelector('#sheetC .st62s .st62 [data-r62op^=\"dn:\"]').click()");pg.wait_for_timeout(600);notoast(pg)
    names=J(pg,"[...document.querySelectorAll('#sheetC .st62s .st62 .st62n b')].map(e=>e.textContent)")
    ok(names[:2]==['명상','산책'],f'[{W}] ② ↓가 한 줄 모양에서도 먹힘',names)
    pg.fill("#sheetC .st62s .st62 [data-r62min]",'7');pg.keyboard.press('Tab');pg.wait_for_timeout(500)
    ok(J(pg,f"{R}.steps.some(s=>s.min===7)"),f'[{W}] ② 분 칸 고치면 저장됨')
    # 📅 언제 상자 · 아래 접힘
    ok(J(pg,"!!document.querySelector('#sheetC .when124 .lb125')"),f'[{W}] ② 목록 단추가 시각 줄에 있음')
    ok(J(pg,"!document.querySelector('#sheetC .when124 .when123 > .tiny.muted, #sheetC .when124 .when71 > .tiny.muted')"),f'[{W}] ② 시각 줄 안내 글 없음(title로)')
    ok(J(pg,"!!document.querySelector('#sheetC details.more125')")and J(pg,"document.querySelector('#sheetC details.more125').open")==False,f'[{W}] ② ⋯ 더 보기가 접혀 있음')
    J(pg,"document.querySelector('#sheetC details.more125 > summary').click()");pg.wait_for_timeout(200)
    ok(J(pg,"!!document.querySelector('#sheetC details.more125 [data-r61all]')&&!!document.querySelector('#sheetC details.more125 [data-r62op^=\"rdel:\"]')"),f'[{W}] ② 펴면 모든 루틴·루틴 지우기')
    ok(J(pg,"!document.querySelector('#sheetC .sum62').textContent.includes('완주 보너스')"),f'[{W}] ② 합계 줄에서 완주 보너스 중복 뺌')
    ok(J(pg,"!!document.querySelector('#sheetC [data-rrun]')&&!!document.querySelector('#sheetC [data-rt64done]')"),f'[{W}] ② 시작·체크로 기록 단추는 그대로')
    # 일반 할 일 상세는 칩이 그대로
    J(pg,"(()=>{const t=addTaskFrom('일반 할 일 오늘 12시 1시간 매일');window.__t2=t.id;openTaskSheet(t.id)})()");pg.wait_for_timeout(600);notoast(pg)
    vis2=J(pg,"[...document.querySelectorAll('#sheetC .tchips > .tch')].filter(e=>e.offsetParent!==null).map(e=>e.dataset.k79||'more')")
    ok('when' in vis2 and 'list' in vis2,f'[{W}] 일반 할 일은 칩 그대로',vis2)
    # ③ 야식·술 → 어제 기록
    J(pg,"""(()=>{if(!C.actions.some(a=>/야식/.test(a.name)))C.actions.push({id:'bnight',name:'야식 먹음',type:'bad',area:'body',cond:-6,gold:0,xp:0});save('config');render()})()""");pg.wait_for_timeout(400);notoast(pg)
    J(pg,"closeSheet()")
    yk=J(pg,"addDays(gk76(),-1)")
    cnt=lambda pat:J(pg,f"((DAYS['{yk}']||{{}}).entries||[]).filter(e=>e.type==='bad'&&/{pat}/.test(e.name)).length")
    J(pg,"slSheet102()");pg.wait_for_timeout(400)
    J(pg,"document.querySelector('[data-sl102t=\"ln\"]').click()");pg.wait_for_timeout(100)
    J(pg,"document.querySelector('[data-sl102ok]').click()");pg.wait_for_timeout(900);notoast(pg)
    ok(cnt('야식')==1,f'[{W}] ③ 야식 켜고 저장 → 어제 기록에 야식 먹음 1개',cnt('야식'))
    ok(J(pg,f"((DAYS['{yk}']||{{}}).entries||[]).some(e=>e.sl125==='ln')"),f'[{W}] ③ 이 창이 넣은 표시(sl125)가 붙음')
    ok(J(pg,"((today()||{}).entries||[]).filter(e=>/야식/.test(e.name||'')).length")==0,f'[{W}] ③ 오늘 기록에는 안 들어감')
    # 다시 저장해도 겹쳐 안 넣음
    J(pg,"slSheet102()");pg.wait_for_timeout(300);J(pg,"document.querySelector('[data-sl102ok]').click()");pg.wait_for_timeout(900);notoast(pg)
    ok(cnt('야식')==1,f'[{W}] ③ 다시 저장해도 1개 그대로',cnt('야식'))
    # 끄고 저장 → 지움
    J(pg,"slSheet102()");pg.wait_for_timeout(300)
    J(pg,"document.querySelector('[data-sl102t=\"ln\"]').click()");pg.wait_for_timeout(100)
    J(pg,"document.querySelector('[data-sl102ok]').click()");pg.wait_for_timeout(900);notoast(pg)
    ok(cnt('야식')==0,f'[{W}] ③ 야식 끄고 저장 → 이 창이 넣은 기록만 지움',cnt('야식'))
    # 사용자가 직접 넣은 야식은 끄고 저장해도 그대로
    J(pg,f"""(()=>{{const a=C.actions.find(x=>/야식/.test(x.name));withDay69('{yk}',()=>doAction(a,{{direct:true}}))}})()""");pg.wait_for_timeout(500);notoast(pg)
    ok(cnt('야식')==1,f'[{W}] ③ (준비) 직접 넣은 야식 1개',cnt('야식'))
    J(pg,"(()=>{const d=DAYS[gk76()];if(d)delete d.sl102})()")
    J(pg,"slSheet102()");pg.wait_for_timeout(300)
    ok(J(pg,"document.querySelector('[data-sl102t=\"ln\"]').getAttribute('aria-pressed')")=='true',f'[{W}] ③ 직접 넣은 야식이 창에 켜져 보임(기존 힌트)')
    J(pg,"document.querySelector('[data-sl102t=\"ln\"]').click()");pg.wait_for_timeout(100)
    J(pg,"document.querySelector('[data-sl102ok]').click()");pg.wait_for_timeout(900);notoast(pg)
    ok(cnt('야식')==1,f'[{W}] ③ 직접 넣은 기록은 끄고 저장해도 그대로',cnt('야식'))
    b.close()
  print('ERRS',[e for e in errs if 'favicon' not in e][:5])
print('FAILS',len(FAILS),FAILS)
