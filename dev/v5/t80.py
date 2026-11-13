# v8.0 시험 — 식단표 + 내일 짜기. 사용자가 실제로 누르는 경로로. 옛 빌드 비교: HQURL=http://localhost:8766/beta/index.html python3 t80.py
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
def mk(pg,title,o=None):
    return J(pg,"((title,o)=>{const t=newTask({title,list:(o||{}).list});Object.assign(t,o||{});saveTask(t);return t.id})("+json.dumps(title)+","+json.dumps(o or {})+")")
def closesheet(pg):J(pg,"(()=>{try{closeSheet()}catch(e){}})()");pg.wait_for_timeout(300)
def gocal(pg):
    J(pg,"location.hash='cal'");pg.wait_for_timeout(900);closepops(pg);notoast(pg)
def ml(pg):return J(pg,"Object.values(TASKS).filter(t=>t.ml80).map(t=>t.id).sort()")
def tom(pg):return J(pg,"addDays(midKey68(),1)")

def t_meal(pg,T=''):
    # 0) 쓰지 않는 사람은 아무 영향 없음
    ok(J(pg,"!C.meal80")==True and len(ml(pg))==0,T+'식단표를 안 연 사람은 블록이 안 생김',len(ml(pg)))
    # 1) 캘린더 ⋯ 설정 메뉴에서 열기
    gocal(pg)
    if T:
        clk(pg,'#cal62m',400)
        ok(menu(pg,'식단표',700),T+'캘린더 ⋯ 설정에 🍱 식단표')
    else:
        ok(cnt(pg,'#calMealBtn')==1,T+'캘린더 줄에 🍱 단추(데스크톱)')
        clk(pg,'#calMealBtn',700)
    ok(cnt(pg,'#sheetC h3')>=1 and '식단표' in vis(pg,'#sheetC h3').inner_text(),T+'식단표 창이 열림')
    ok(cnt(pg,'#sheetC [data-m80]')==14,T+'7일 × 점심·저녁 = 14칸',cnt(pg,'#sheetC [data-m80]'))
    ok(J(pg,"C.meal80&&C.meal80.on===1"),T+'처음 열면 켜짐')
    k1=tom(pg)
    # 2) 내일 점심 메뉴 적기 (한글) → change
    inp=pg.locator(f'#sheetC [data-m80="{k1}|l"]').first
    inp.click();inp.fill('김치볶음밥 · 달걀국');inp.press('Tab');pg.wait_for_timeout(500)
    ok(J(pg,f"menuOf80('{k1}','l')")=='김치볶음밥 · 달걀국',T+'메뉴가 설정에 저장됨',J(pg,f"menuOf80('{k1}','l')"))
    ok(cnt(pg,'#sheetC [data-m80]')==14 and cnt(pg,'#sheetC h3')>=1,T+'적어도 창이 닫히거나 다시 그려지지 않음')
    ok(J(pg,f"document.activeElement&&document.activeElement.dataset.m80")==f'{k1}|d',T+'Tab → 같은 날 저녁 칸으로',J(pg,"document.activeElement&&document.activeElement.dataset.m80"))
    ids=ml(pg)
    ok(len(ids)>=12 and len(ids)<=14,T+'오늘부터 7일치 블록이 생김(오늘 지난 끼니는 빠짐)',len(ids))
    t=J(pg,f"(()=>{{const t=TASKS['ml80_{k1}_l'];return t&&{{title:t.title,time:t.time,dur:t.dur,due:t.due,status:t.status}}}})()")
    ok(t and t['title']=='🍱 점심 · 김치볶음밥 · 달걀국' and t['time']=='12:30' and t['dur']==40 and t['due']==k1,T+'내일 점심 블록: 이름에 메뉴 · 12:30 · 40분',t)
    # 3) 어디에 보이고 어디에 안 보이나
    ok(J(pg,f"openTasks().every(t=>!t.ml80)"),T+'목록·홈·서랍(openTasks)에는 안 보임')
    ok(J(pg,f"tasksOn('{k1}').filter(t=>t.ml80).length")==2,T+'캘린더(tasksOn)에는 둘 다 보임')
    ok(J(pg,"Object.values(TASKS).filter(t=>t.ml80).every(t=>!taskMatches(t,'all')&&!taskMatches(t,'today'))"),T+'할 일 화면 어느 보기에도 안 뜸')
    ok(J(pg,f"placed76('{k1}')")==0,T+'하루 예산(놓은 시간)에서 빠짐',J(pg,f"placed76('{k1}')"))
    # 4) 블록 누르면 끼니 창
    closesheet(pg);gocal(pg)
    J(pg,"(()=>{const b=document.querySelector('[data-calmode=\"week\"]');b&&b.click()})()");pg.wait_for_timeout(600)
    n=cnt(pg,'[data-ctask^="ml80_"]')
    ok(n>=2,T+'캘린더 화면에 🍱 블록이 그려짐',n)
    J(pg,f"openTaskSheet('ml80_{k1}_l')");pg.wait_for_timeout(500)
    ok('점심' in vis(pg,'#sheetC h3').inner_text() and cnt(pg,'#m80mi')==1,T+'블록을 열면 끼니 창(할 일 상세 아님)',vis(pg,'#sheetC h3').inner_text())
    ok(J(pg,"document.getElementById('m80mi').value")=='김치볶음밥 · 달걀국',T+'끼니 창에 메뉴')
    pg.locator('#m80mi').fill('비빔밥');pg.locator('#m80mi').press('Enter');pg.wait_for_timeout(500)
    ok(J(pg,f"TASKS['ml80_{k1}_l'].title")=='🍱 점심 · 비빔밥' and J(pg,f"menuOf80('{k1}','l')")=='비빔밥',T+'끼니 창에서 메뉴를 고치면 식단표·블록 이름도 바뀜')
    # 5) 먹었어요: 점수 없음
    xp0=J(pg,"JSON.stringify(P?{xp:P.xp,g:P.gold}:null)") if J(pg,"typeof P!=='undefined'") else ''
    ne0=J(pg,"curDay().entries.length")
    clk(pg,'#sheetC [data-m80i="done"]',500)
    ok(J(pg,f"TASKS['ml80_{k1}_l'].status")==2,T+'✓ 먹었어요 → 끝남')
    ok(J(pg,"curDay().entries.length")==ne0,T+'기록(점수)은 안 생김')
    J(pg,f"openTaskSheet('ml80_{k1}_l')");pg.wait_for_timeout(400)
    clk(pg,'#sheetC [data-m80i="done"]',400)
    ok(J(pg,f"TASKS['ml80_{k1}_l'].status")==0,T+'↶ 안 먹었어요 → 되돌아옴')
    # 6) 날마다 옮기기: 저녁을 19:30으로 → 다시 맞춰도 안 되돌림. 평소 시간 바꾸면 안 옮긴 것만 따라감
    J(pg,f"(()=>{{const t=TASKS['ml80_{k1}_d'];t.time='19:30';saveTask(t);render()}})()");pg.wait_for_timeout(400)
    ok(J(pg,f"TASKS['ml80_{k1}_d'].time")=='19:30',T+'옮긴 시각은 render 뒤에도 그대로')
    J(pg,"mealSheet80(midKey68())");pg.wait_for_timeout(400)
    pg.locator('#sheetC details.m80s summary').click();pg.wait_for_timeout(200)
    dt=pg.locator('#sheetC [data-m80c="dt"]').first;dt.fill('18:00');dt.press('Tab');pg.wait_for_timeout(500)
    k2=J(pg,"addDays(midKey68(),2)")
    ok(J(pg,f"TASKS['ml80_{k2}_d'].time")=='18:00',T+'평소 저녁 시각을 바꾸면 안 옮긴 날은 따라감',J(pg,f"TASKS['ml80_{k2}_d'].time"))
    ok(J(pg,f"TASKS['ml80_{k1}_d'].time")=='19:30',T+'직접 옮긴 날은 그대로')
    # 7) 지우면 다시 안 만듦
    J(pg,f"deleteTask('ml80_{k2}_l')");J(pg,"render()");pg.wait_for_timeout(400)
    ok(J(pg,f"!TASKS['ml80_{k2}_l']"),T+'지운 끼니는 다시 안 생김')
    ok(J(pg,f"C.meal80.no.includes('ml80_{k2}_l')"),T+'건너뜀 목록에 기록')
    # 8) 지난주 가져오기 · 비우기 되돌리기
    kp=J(pg,"addDays(weekStart(midKey68()),-7)")
    J(pg,f"setMenu80('{kp}','l','지난주 카레')");J(pg,"mealSheet80(midKey68())");pg.wait_for_timeout(300)
    kw=J(pg,"weekStart(midKey68())")
    J(pg,f"(()=>{{delete C.meal80.menu['{kw}']}})()")
    clk(pg,'#sheetC [data-m80copy]',500)
    ok(J(pg,f"menuOf80('{kw}','l')")=='지난주 카레',T+'지난주 메뉴 가져오기(빈 칸에만)',J(pg,f"menuOf80('{kw}','l')"))
    clk(pg,'#sheetC [data-m80clr]',500)
    ok(J(pg,f"menuOf80('{kw}','l')")=='지난주 카레',T+'이 주 비우기는 한 번 더 눌러야 비움(되돌리기 대신)')
    clk(pg,'#sheetC [data-m80clr]',500)
    ok(J(pg,f"menuOf80('{kw}','l')")=='',T+'두 번 누르면 비움')
    # 9) 밀프렙 할 일 상세에 식단표 단추
    pid=mk(pg,'일요일 밀프렙',{'due':J(pg,"midKey68()")})
    closesheet(pg);J(pg,"location.hash='tasks';C.ui.tasks.sel='all';save('config');render()");pg.wait_for_timeout(700);closepops(pg);notoast(pg)
    J(pg,f"openTaskSheet('{pid}')");pg.wait_for_timeout(700)
    ok(cnt(pg,'#sheetC .m80b2')==1,T+"'밀프렙' 할 일 상세에 🍱 식단표 단추")
    clk(pg,'#sheetC .m80b2',600)
    ok(cnt(pg,'#sheetC [data-m80]')==14,T+'그 단추 → 식단표 창')
    # 10) 끄면 블록 치움 · 다시 켜면 건너뛴 것 빼고 다시
    pg.locator('#sheetC details.m80s summary').click() if not J(pg,"document.querySelector('#sheetC details.m80s').open") else None
    pg.wait_for_timeout(200)
    clk(pg,'#sheetC [data-m80c="on"]',600)
    ok(J(pg,"C.meal80.on")==0 and len(ml(pg))==0,T+'끄면 블록을 다 치움',len(ml(pg)))
    clk(pg,'#sheetC [data-m80c="on"]',600)
    ok(J(pg,"C.meal80.on")==1 and len(ml(pg))>=10,T+'다시 켜면 생김',len(ml(pg)))
    ok(J(pg,f"!TASKS['ml80_{k2}_l']"),T+'건너뛴 끼니는 켜도 안 생김')

def t_plan(pg,T=''):
    k=tom(pg)
    J(pg,"(()=>{C.meal80=null;Object.values(TASKS).filter(t=>t.ml80).forEach(t=>deleteTask(t.id))})()")
    fx=mk(pg,'촬영',{'due':k,'time':'10:00','dur':180})
    A=mk(pg,'대본 정리',{'due':k,'prio':5,'dur':60})
    B=mk(pg,'장보기',{'due':k,'dur':30})
    Cc=mk(pg,'엄마 연락',{'due':k})
    R=mk(pg,'스트레칭 반복',{'due':k,'rep':{'f':'d','i':1}})
    gocal(pg)
    if T:
        clk(pg,'#cal62m',400)
        ok(menu(pg,'시간표 짜기',700),T+'캘린더 ⋯ 설정에 🌙 시간표 짜기')
    else:
        ok(cnt(pg,'#calPlanBtn')==1,T+'캘린더 줄에 🌙 단추(데스크톱)')
        clk(pg,'#calPlanBtn',700)
    ok('내일 짜기' in vis(pg,'#sheetC h3').inner_text(),T+'진입점은 v9.4부터 내일 짜기 화면',vis(pg,'#sheetC h3').inner_text())
    J(pg,"planSheet80(addDays(midKey68(),1))");pg.wait_for_timeout(400)   # v9.4: 예전 화면은 날짜를 주고 열기
    ok('시간표 짜기' in vis(pg,'#sheetC h3').inner_text(),T+'창이 열림(기본 내일)',vis(pg,'#sheetC h3').inner_text())
    ok(cnt(pg,'#sheetC .p80f')==1 and cnt(pg,'#sheetC .p80l')==4,T+'정해진 것 1 · 시간 안 정한 일 4',(cnt(pg,'#sheetC .p80f'),cnt(pg,'#sheetC .p80l')))
    ok(cnt(pg,'#sheetC .p80l .p80n')==1 and cnt(pg,'#sheetC .p80l input[type=checkbox]')==3,T+'반복 할 일은 자동 배치에서 빠짐(↻ 표시)')
    clk(pg,'#sheetC [data-p80pv]',500)
    ok(cnt(pg,'#sheetC .p80l.pv')==3 and cnt(pg,'#sheetC [data-p80go]')==1,T+'미리보기: 3개에 시각이 붙음',cnt(pg,'#sheetC .p80l.pv'))
    pv=J(pg,"P80.plan.items.map(x=>[TASKS[x.id].title,fmt80(x.time)])")
    ok(pv[0]==['대본 정리','09:00'],T+'중요도 높은 것이 가장 먼저(촬영 전 빈 1시간)',pv)
    bad=J(pg,"P80.plan.items.some(x=>x.time<780&&x.time+x.dur>600&&TASKS[x.id].title!=='대본 정리')")
    ok(not bad,T+'촬영 10:00–13:00과 겹치는 게 없음',pv)
    ok(J(pg,f"!TASKS['{A}'].time"),T+'미리보기만으로는 아직 안 바뀜')
    ne0=J(pg,"curDay().entries.length")
    clk(pg,'#sheetC [data-p80go]',600)
    ok(J(pg,f"TASKS['{A}'].time")=='09:00' and J(pg,f"TASKS['{A}'].dur")==60,T+'이대로 넣기 → 시각·길이 저장')
    ok(J(pg,f"TASKS['{Cc}'].dur")==30 and J(pg,f"!!TASKS['{Cc}'].time"),T+'길이 안 적은 건 30분으로 넣음')
    ok(J(pg,f"!TASKS['{R}'].time"),T+'반복 할 일은 그대로')
    ok(J(pg,"curDay().entries.length")==ne0,T+'점수 기록은 안 생김')
    ok(cnt(pg,'#sheetC [data-p80u]')==1,T+'창 안에 ↶ 되돌리기 단추(폰은 알림이 창에 가려져서)')
    clk(pg,'#sheetC [data-p80u]',500)
    ok(J(pg,f"!TASKS['{A}'].time && !TASKS['{B}'].time"),T+'되돌리기 → 시각 원래대로(없음)')
    # 시간 모자람
    pg.locator('#sheetC details.m80s summary').click();pg.wait_for_timeout(150)
    e=pg.locator('#sheetC [data-p80s="e"]').first;e.fill('10:30');e.press('Tab');pg.wait_for_timeout(500)
    clk(pg,'#sheetC [data-p80pv]',500)
    ok('못 넣은 것' in J(pg,"document.getElementById('sheetC').innerText"),T+'시간이 모자라면 ⚠ 못 넣은 것을 알려 줌')
    clk(pg,'#sheetC [data-p80x]',400)
    pg.locator('#sheetC details.m80s summary').click();pg.wait_for_timeout(150)
    e=pg.locator('#sheetC [data-p80s="e"]').first;e.fill('22:00');e.press('Tab');pg.wait_for_timeout(400)
    # 체크 끄면 빠짐
    pg.locator(f'#sheetC [data-p80c="{B}"]').uncheck();pg.wait_for_timeout(400)
    clk(pg,'#sheetC [data-p80pv]',500)
    ok(J(pg,f"!P80.plan.items.some(x=>x.id==='{B}')"),T+'체크를 끈 일은 안 넣음')
    clk(pg,'#sheetC [data-p80x]',300)
    # 길이 고르기
    pg.locator(f'#sheetC [data-p80d="{B}"]').select_option('45');pg.wait_for_timeout(400)
    ok(J(pg,f"TASKS['{B}'].dur")==45,T+'줄에서 길이 고르면 바로 저장')
    # 다음 날로
    clk(pg,f'#sheetC [data-p80mv="{B}"]',500)
    ok(J(pg,f"TASKS['{B}'].due")==J(pg,f"addDays('{k}',1)"),T+'⇥ 다음 날로 옮김')
    clk(pg,'#sheetC [data-p80u]',500)
    ok(J(pg,f"TASKS['{B}'].due")==k,T+'⇥ 되돌리기')
    # 날 넘기기 · 정해진 것에 🍱
    J(pg,"C.meal80={on:1};ml80cfg();mealEnsure80();render()");pg.wait_for_timeout(300)
    J(pg,f"planSheet80('{k}')");pg.wait_for_timeout(400)
    ok(cnt(pg,'#sheetC .p80f.ml')==2,T+'식단표를 켜 두면 정해진 것에 🍱 점심·저녁이 같이 보임',cnt(pg,'#sheetC .p80f.ml'))
    ok(cnt(pg,'#sheetC .p80l')==4,T+'🍱는 시간 안 정한 일에 안 섞임')
    clk(pg,'#sheetC [data-p80pv]',500)
    ok(J(pg,"P80.plan.items.every(x=>{const b=ml80cfg();return !((x.time<hm80(b.l.t)+b.l.m&&x.time+x.dur>hm80(b.l.t))||(x.time<hm80(b.d.t)+b.d.m&&x.time+x.dur>hm80(b.d.t)))})"),T+'넣어 보기가 식사 시간을 피함')
    clk(pg,'#sheetC [data-p80nav="1"]',400)
    ok(J(pg,"P80.k")==J(pg,f"addDays('{k}',1)"),T+'› 다음 날로 넘어감')
    # 오늘: 지금 이후
    J(pg,"planSheet80(midKey68())");pg.wait_for_timeout(300)
    J(pg,"(()=>{const t=newTask({title:'오늘 일',due:midKey68(),dur:15});saveTask(t);window.__tdy=t.id})()")
    r=J(pg,"(()=>{const n=new Date(),nm=n.getHours()*60+n.getMinutes();const p=fit80(midKey68(),loose80(midKey68()).filter(autoOk80));return p.items.every(x=>x.time>=nm)||p.items.length===0})()")
    ok(r,T+'오늘은 지금 이후에만 넣음')

def body(pg,phone=False):
    T='폰: ' if phone else ''
    for f in (t_meal,t_plan):
        safe(lambda f=f:f(pg,T),T+f.__name__)

with sync_playwright() as pw:
    b,pg=run(pw,1400,900);body(pg);b.close()
    b,pg=run(pw,390,800);body(pg,True);b.close()
print('ERRS',errs[:5]);print('FAILS',len(FAILS),FAILS)
