# v7.8 시험: 할 일 상세 줄이기(머리=제목 · 날짜 칸 ＋ · 목록/중요도 메뉴 · 묶인 할 일/체크리스트 ＋ · 아래 줄 메뉴) · Shift+Enter · 안내 글
# 사용자가 실제로 누르는 경로로. 옛 빌드와 비교: HQURL=http://localhost:8766/beta/index.html python3 t78.py (옛 빌드에서는 많이 떨어져야 정상)
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
J=lambda pg,x:pg.evaluate(x)
SP='/tmp/claude-0/sp/';os.makedirs(SP,exist_ok=True)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra) if extra!='' else ''))
    if not c:FAILS.append(msg)
def vis(pg,sel):return pg.locator(sel).locator('visible=true').first
def cnt(pg,sel):return pg.locator(sel).locator('visible=true').count()
def clk(pg,sel,w=450):
    if not cnt(pg,sel):return False
    vis(pg,sel).click();pg.wait_for_timeout(w);closepops(pg);return True
def notoast(pg):J(pg,"(()=>{const t=document.getElementById('toast');if(t){t.classList.remove('on');t.style.pointerEvents=''}})()")
def safe(f,msg):
    try:f()
    except Exception as e:ok(False,msg+' (예외)',str(e)[:200])
def menu(pg,txt,w=500):
    m=pg.locator('#m61 [role=menuitem]',has_text=txt)
    if not m.count():return False
    m.first.click();pg.wait_for_timeout(w);return True
MK="""(()=>{const mk=(title,o)=>{const t=newTask({title,list:(o||{}).list});Object.assign(t,o||{});saveTask(t);return t.id};
  const r={a:mk('시나리오 3막 고치기',{list:'Latelier',due:midKey68()}),b:mk('마감 있는 일',{list:'Lproject',due:midKey68(),deadline:addDays(midKey68(),3),time:'15:00',dur:60})};
  location.hash='tasks';C.ui.tasks.sel='all';save('config');render();return r})()"""
def body(pg,phone=False):
    T='폰: ' if phone else ''
    ids=J(pg,MK);pg.wait_for_timeout(700);closepops(pg);notoast(pg)
    A,B=ids['a'],ids['b']
    # 목록에서 눌러 열기
    if not clk(pg,f'#tList .trow[data-task="{A}"] .tt',600):J(pg,f"openTaskSheet('{A}')");pg.wait_for_timeout(600)
    ok(cnt(pg,'#sheetC #tsTitle')==1,T+'상세 열림')
    ok(J(pg,"(()=>{const s=document.querySelector('#sheetC .sh');return !!s&&s.contains(document.getElementById('tsTitle'))&&!s.querySelector('h3')})()"),T+"머리 = 제목('할 일' 글자 없음)")
    ok(cnt(pg,'#sheetC [data-t71="focus"]')==0 and cnt(pg,'#sheetC [data-t71="copy"]')==0,T+'집중·복사 줄 없음')
    ok(cnt(pg,'#sheetC .sec71')==0 and cnt(pg,'#sheetC #tsNote')==1,T+"'메모' 머리 없음, 메모 칸은 있음")
    ok(cnt(pg,'#sheetC .kids56.box71')==0 and cnt(pg,'#sheetC .box71.ck71')==0 and cnt(pg,'#sheetC [data-a78]')==2,T+'묶인 할 일·체크리스트 = ＋ 칩 둘')
    ok(cnt(pg,'#sheetC .foot71 [data-tsact="del"]')==0 and cnt(pg,'#sheetC .av65row')==0 and cnt(pg,'#sheetC [data-m78]')==2,T+'아래 줄: 막힐 때 · ⋯')
    fh=J(pg,"(()=>{const f=document.querySelector('#sheetC .foot71');return f.getBoundingClientRect().height})()")
    ok(fh<110,T+'아래 줄 높이(두 줄 이하)',fh)
    # 제목 고치기
    vis(pg,'#sheetC #tsTitle').fill('시나리오 3막 다시');vis(pg,'#sheetC #tsTitle').press('Tab');pg.wait_for_timeout(400)
    ok(J(pg,f"TASKS['{A}'].title")=='시나리오 3막 다시',T+'머리의 제목 고치면 저장')
    # 날짜 칸
    clk(pg,'#sheetC .tchips [data-x56panel="when"]',400)
    ok(cnt(pg,'#sheetC #tsDue')==1 and cnt(pg,'#sheetC [data-tsdue]')>=3,T+'날짜 칸: 날짜 + 빠른 날짜')
    ok(all(cnt(pg,s)==0 for s in ['#sheetC #tsTime','#sheetC #tsDl','#sheetC #tsRepSel','#sheetC [data-t71end]','#sheetC [data-tsck]']),T+'날짜 칸: 시간·마감·반복·여러 날·점검 숨김')
    ok(cnt(pg,'#sheetC [data-p78]')==5,T+'날짜 칸: ＋ 칩 다섯',cnt(pg,'#sheetC [data-p78]'))
    clk(pg,'#sheetC [data-p78="time"]',300)
    ok(cnt(pg,'#sheetC #tsTime')==1 and cnt(pg,'#sheetC [data-p78]')==4,T+'＋ 시간 → 시간 줄이 펴지고 칩은 빠짐')
    vis(pg,'#sheetC #tsTime').fill('14:00');vis(pg,'#sheetC #tsTime').dispatch_event('change');pg.wait_for_timeout(500)
    ok(J(pg,f"TASKS['{A}'].time")=='14:00' and cnt(pg,'#sheetC #tsTime')==1,T+'시간 넣으면 저장되고 줄은 그대로 보임',J(pg,f"TASKS['{A}'].time"))
    clk(pg,'#sheetC [data-p78="rep"]',300)
    safe(lambda:(vis(pg,'#sheetC #tsRepSel').select_option('wd'),pg.wait_for_timeout(500)),T+'반복 고르기')
    ok(J(pg,f"!!(TASKS['{A}'].rep&&TASKS['{A}'].rep.f)") and cnt(pg,'#sheetC #tsRepSel')==1,T+'＋ 반복 → 평일 → 저장, 줄 보임')
    clk(pg,'#sheetC [data-p78="dl"]',300)
    ok(cnt(pg,'#sheetC #tsDl')==1,T+'＋ 마감일 → 마감 칸')
    clk(pg,'#sheetC [data-p78="ck"]',400)
    ok(cnt(pg,'#sheetC .cks')==1,T+'＋ 점검일 → 점검 칸')
    pg.screenshot(path=SP+('t78_when_p.png' if phone else 't78_when.png'))
    # 목록 칩 = 메뉴
    clk(pg,'#sheetC .tchips [data-x56panel="list"]',400)
    ok(cnt(pg,'#m61 [role=menuitem]')>=5 and cnt(pg,'#sheetC .tpanel[data-p="list"]')==0,T+'목록 칩 → 메뉴(펼침 칸 없음)',cnt(pg,'#m61 [role=menuitem]'))
    menu(pg,'Limen')
    ok(J(pg,f"TASKS['{A}'].list")=='Llimen' and 'Limen' in J(pg,"document.querySelector('#sheetC .tchips [data-x56panel=\"list\"]').textContent"),T+'메뉴에서 Limen → 목록 바뀜, 칩 글자도')
    ok(J(pg,f"TASKS['{A}'].time")=='14:00' and J(pg,f"TASKS['{A}'].title")=='시나리오 3막 다시',T+'목록 바꿔도 시간·제목 그대로')
    clk(pg,'#sheetC .tchips [data-x56panel="prio"]',400);menu(pg,'높음')
    ok(J(pg,f"TASKS['{A}'].prio")==5,T+'중요도 칩 → 메뉴 → 높음')
    clk(pg,'#sheetC .tchips [data-x56panel="prio"]',400);menu(pg,'없음')
    ok(not J(pg,f"TASKS['{A}'].prio"),T+'중요도 없음으로')
    # 묶인 할 일 ＋
    clk(pg,'#sheetC [data-a78="kids"]',300)
    ok(cnt(pg,'#sheetC #x56KNew')==1,T+'＋ 묶인 할 일 → 입력칸')
    vis(pg,'#sheetC #x56KNew').fill('자료 읽기');vis(pg,'#sheetC #x56KNew').press('Enter');pg.wait_for_timeout(600);notoast(pg)
    ok(J(pg,f"kidsOf('{A}').length")==1 and cnt(pg,'#sheetC .kids56 .krow:not(form)')==1,T+'묶인 할 일 추가 → 펴진 채로 보임')
    clk(pg,'#sheetC [data-a78="ck"]',300)
    vis(pg,'#sheetC #tsSubNew').fill('체크 하나');vis(pg,'#sheetC #tsSubNew').press('Enter');pg.wait_for_timeout(500)
    ok(J(pg,f"(TASKS['{A}'].subs||[]).length")==1 and cnt(pg,'#sheetC .box71.ck71')==1,T+'＋ 체크리스트 → 추가')
    # 닫았다 다시 열면: 묶인 할 일 접힘, 체크리스트는 보임, 날짜 칸은 값 있는 줄만
    J(pg,"closeSheet()");pg.wait_for_timeout(300);J(pg,f"openTaskSheet('{B}')");pg.wait_for_timeout(400);J(pg,f"openTaskSheet('{A}')");pg.wait_for_timeout(600)
    ok(cnt(pg,'#sheetC .kids56.fold78 [data-k78]')==1 and cnt(pg,'#sheetC .kids56 .krow:not(form)')==0,T+'다시 열면 묶인 할 일 접힘(0/1)',J(pg,"(document.querySelector('#sheetC [data-k78]')||{}).textContent||''"))
    ok(cnt(pg,'#sheetC .box71.ck71')==1 and cnt(pg,'#sheetC [data-a78]')==0,T+'체크리스트는 그대로, ＋ 칩 줄 없음')
    clk(pg,'#sheetC [data-k78]',400)
    ok(cnt(pg,'#sheetC .kids56 .krow:not(form)')==1,T+'묶인 할 일 누르면 펴짐')
    J(pg,"ui.tsPanel='when';drawTaskSheet()");pg.wait_for_timeout(300)
    ok(cnt(pg,'#sheetC #tsTime')==1 and cnt(pg,'#sheetC #tsRepSel')==1 and cnt(pg,'#sheetC #tsDl')==0,T+'값 있는 줄(시간·반복)만 보임, 마감은 ＋로')
    J(pg,f"openTaskSheet('{B}')");pg.wait_for_timeout(500)
    ok(cnt(pg,'#sheetC #tsDl')==1 and cnt(pg,'#sheetC #tsTime')==1 and cnt(pg,'#sheetC [data-p78="dl"]')==0,T+'마감 있는 일: 마감·시간 줄이 처음부터 보임')
    # 아래 줄 메뉴
    J(pg,f"ui.tsPanel='';openTaskSheet('{A}')");pg.wait_for_timeout(500)
    clk(pg,'#sheetC [data-m78="stuck"]',400)
    ok(cnt(pg,'#m61 [role=menuitem]')==3,T+'😶 막힐 때 메뉴 셋',cnt(pg,'#m61 [role=menuitem]'))
    ok(J(pg,"(()=>{const m=document.getElementById('m61').getBoundingClientRect();return m.top>=0&&m.bottom<=innerHeight&&m.left>=0&&m.right<=innerWidth})()"),T+'메뉴가 화면 안')
    menu(pg,'첫 조각')
    ok(cnt(pg,'#sheetC #sp78i')==1,T+'✂ 첫 조각 → 입력칸')
    vis(pg,'#sheetC #sp78i').fill('파일만 열기');vis(pg,'#sheetC #sp78i').press('Enter');pg.wait_for_timeout(700);notoast(pg)
    ok(J(pg,f"kidsOf('{A}').some(k=>k.title==='파일만 열기'&&k.due===midKey68())"),T+'첫 조각이 오늘 할 일로, 묶음에')
    J(pg,f"openTaskSheet('{A}')");pg.wait_for_timeout(500)
    n0=J(pg,"Object.keys(TASKS).length")
    clk(pg,'#sheetC [data-m78="more"]',400)
    ok(cnt(pg,'#m61 [role=menuitem]')==4,T+'⋯ 메뉴: 집중·복사·안 하기·삭제',cnt(pg,'#m61 [role=menuitem]'))
    menu(pg,'복사',700);notoast(pg)
    ok(J(pg,"Object.keys(TASKS).length")>n0,T+'⋯ → 복사')
    J(pg,f"openTaskSheet('{A}')");pg.wait_for_timeout(500)
    clk(pg,'#sheetC [data-m78="more"]',400);menu(pg,'집중에',500)
    ok(J(pg,f"(TASKS['{A}'].tags||[]).includes('집중')"),T+'⋯ → 집중에 넣기(#집중 태그)')
    J(pg,f"openTaskSheet('{B}')");pg.wait_for_timeout(500)
    clk(pg,'#sheetC [data-m78="more"]',400);menu(pg,'삭제',400)
    ok(J(pg,f"!!TASKS['{B}']") and cnt(pg,'#m61 [role=menuitem]')>=1 and '한 번 더' in J(pg,"document.getElementById('m61').textContent"),T+'⋯ → 삭제 한 번: 아직 안 지워지고 메뉴에 한 번 더')
    menu(pg,'한 번 더',700)
    ok(J(pg,f"!TASKS['{B}']||TASKS['{B}'].status!==0") and cnt(pg,'#m61 [role=menuitem]')==0,T+'⋯ → 삭제 두 번: 지워지고 메뉴 닫힘')
    notoast(pg);J(pg,"closeSheet()");pg.wait_for_timeout(300)

with sync_playwright() as pw:
    b,pg=run(pw);closepops(pg);pg.wait_for_timeout(300)
    safe(lambda:body(pg),'PC 상세')
    # Shift+Enter = 자세히 · 안내 글
    J(pg,"closeSheet();location.hash='tasks'");pg.wait_for_timeout(500);notoast(pg)
    ok('%관리' in J(pg,"document.getElementById('tAdd').placeholder") and '@영역' in J(pg,"document.getElementById('tAdd').placeholder"),'입력칸 안내 글에 기호',J(pg,"document.getElementById('tAdd').placeholder"))
    n0=J(pg,"Object.keys(TASKS).length")
    vis(pg,'#tAdd').fill('쉬프트 엔터 할 일');vis(pg,'#tAdd').press('Shift+Enter');pg.wait_for_timeout(900)
    ok(J(pg,"Object.keys(TASKS).length")==n0+1 and J(pg,"(document.getElementById('tsTitle')||{}).value")=='쉬프트 엔터 할 일','Shift+Enter → 추가하면서 상세 열림',J(pg,"(document.getElementById('tsTitle')||{}).value"))
    J(pg,"closeSheet()");pg.wait_for_timeout(300);notoast(pg)
    n0=J(pg,"Object.keys(TASKS).length")
    vis(pg,'#tAdd').fill('그냥 엔터 할 일');vis(pg,'#tAdd').press('Enter');pg.wait_for_timeout(700)
    ok(J(pg,"Object.keys(TASKS).length")==n0+1 and not J(pg,"!!document.getElementById('tsTitle')&&document.getElementById('tsTitle').value==='그냥 엔터 할 일'"),'그냥 Enter는 추가만(상세 안 열림)')
    # 3단: 제목 줄 도구 한 줄
    tid=J(pg,"Object.values(TASKS).find(t=>t.title==='그냥 엔터 할 일').id")
    J(pg,"C.ui.tasks.sel='all';render()");pg.wait_for_timeout(300);J(pg,f"openTaskSheet('{tid}')");pg.wait_for_timeout(600)
    ok(J(pg,"(()=>{const r=document.querySelector('[data-view=\"tasks\"] .ptitle');return r.getBoundingClientRect().height})()")<80,'3단 화면: 제목 줄이 두 줄 이하(제목 · 도구)',J(pg,"document.querySelector('[data-view=\"tasks\"] .ptitle').getBoundingClientRect().height"))
    pg.screenshot(path=SP+'t78_pc.png')
    # 루틴 머리·단계·끝낸 일 상세도 열림(오류 없음)
    safe(lambda:(J(pg,"(()=>{const r=C.routines[0],h=rtH62(r,true);openTaskSheet(h.id)})()"),pg.wait_for_timeout(500),ok(cnt(pg,'#sheetC #tsTitle')==1,'루틴 머리 상세 열림'),
      J(pg,"(()=>{const r=C.routines[0];openTaskSheet(r.steps[0].tid)})()"),pg.wait_for_timeout(500),ok(cnt(pg,'#sheetC #tsTitle')==1,'루틴 단계 상세 열림')),'루틴 상세')
    safe(lambda:(J(pg,f"(()=>{{const t=TASKS['{tid}'];completeTask(t);openTaskSheet(t.id)}})()"),pg.wait_for_timeout(600),closepops(pg),ok(cnt(pg,'#sheetC #tsTitle')==1 or cnt(pg,'#sheetC .sh')==1,'끝낸 일 상세 열림')),'끝낸 일 상세')
    b.close()
    # 폰
    b,pg=run(pw,W=390,H=800,pre="window.__coarse75=1;");closepops(pg);pg.wait_for_timeout(300)
    safe(lambda:body(pg,True),'폰 상세')
    pg.screenshot(path=SP+'t78_phone.png')
    b.close()
print('ERRS',errs[:8]);print('FAILS',len(FAILS),FAILS)
