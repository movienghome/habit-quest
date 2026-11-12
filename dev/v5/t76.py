# v7.6 시험: 관리 나누기 · 관리 블록 · 하루 예산 · 루틴 배우기 · 폰 할 일 ↔ 캘린더
# 사용자가 실제로 누르는 경로로. 옛 빌드와 비교: HQURL=http://localhost:8766/beta/index.html python3 t76.py
# 자정~새벽 5시엔 '하루'가 둘로 갈려서(할 일 = 자정, 점수 = 5시) 낮 시간대로 돌릴 것: TZ=America/New_York python3 t76.py
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
def clk(pg,sel,w=500):
    if not cnt(pg,sel):return False
    vis(pg,sel).click();pg.wait_for_timeout(w);closepops(pg);return True
MK="""(()=>{const td=midKey68(),gk=dateKey(),mk=(title,o)=>{const t=newTask({title,list:'inbox'});Object.assign(t,o);saveTask(t);return t.id};
  const ids={clean:mk('청소기 돌리기',{rep:{f:'d',i:7},due:addDays(td,-3),time:'10:00',dur:30}),dish:mk('설거지하기',{rep:{f:'d',i:1},due:addDays(td,-1)}),
    tank:mk('어항 환수하기',{rep:{f:'d',i:14},due:addDays(td,3)}),walk:mk('삼십분 걷기',{rep:{f:'d',i:1},due:gk,quest:1}),plan:mk('기획안 쓰기',{due:td})};
  syncDailies(C);save('config');location.hash='tasks';C.ui.tasks.sel='today';render();return ids})()"""
ROW=lambda i:f'#tList .trow[data-task="{i}"]'
with sync_playwright() as pw:
    # ================= 1) 관리 나누기 (PC) =================
    b,pg=run(pw,W=1400,H=900);closepops(pg);pg.wait_for_timeout(300)
    ids=J(pg,MK);pg.wait_for_timeout(600)
    td=J(pg,"dateKey()")
    ok(cnt(pg,ROW(ids['plan']))==1,'보통 할 일은 오늘 목록에 그대로')
    ok(cnt(pg,ROW(ids['walk']))==0 and cnt(pg,f'#tList .care76 .c76c.q [data-tdone="{ids["walk"]}"]')==1,'일퀘 할 일은 목록 줄 대신 관리 줄 칩으로')
    ok(cnt(pg,ROW(ids['dish']))==1,'표시 전: 반복 할 일은 아직 목록에')
    pg.screenshot(path=SP+'t76_before.png')
    # 홈 안내 → 고르기
    J(pg,"location.hash='home'");pg.wait_for_timeout(500)
    ok(cnt(pg,'#htList .care76 [data-c76open]')==1,'홈 오늘 칸에 관리 줄(일퀘 칩이 있으니 줄이 뜸)')
    clk(pg,'#htList .care76 [data-c76open]',500)
    ok(cnt(pg,'#sheetC [data-c76pick]')==1,'관리 창이 열림')
    clk(pg,'#sheetC [data-c76pick]',500)
    ok(cnt(pg,'#pk61 .pk61i')==4,'고르기 창: 4개(반복 3 + 반복 없는 보통 할 일 1 — v7.7부터, 일퀘 빼고)',cnt(pg,'#pk61 .pk61i'))
    for k in ['clean','dish','tank']:clk(pg,f'#pk61 [data-pk61="{ids[k]}"]',150)
    clk(pg,'#pk61 [data-pk61go]',700)
    ok(J(pg,f"['{ids['clean']}','{ids['dish']}','{ids['tank']}'].every(i=>TASKS[i].care76===1)"),'세 개가 관리로 표시됨')
    ok(J(pg,f"TASKS['{ids['clean']}'].time")is None and J(pg,f"TASKS['{ids['clean']}'].ct76")=='10:00','관리로 옮기면 시각이 빠짐(되돌릴 값은 남김)')
    J(pg,"closeSheet()");pg.wait_for_timeout(300)
    ok(cnt(pg,f'#htList .trow[data-task="{ids["dish"]}"]')==0 and cnt(pg,f'#htList .trow[data-task="{ids["clean"]}"]')==0,'홈 오늘 목록에서 관리가 빠짐')
    ok(cnt(pg,f'#htList .care76 [data-tdone="{ids["dish"]}"]')==1 and cnt(pg,f'#htList .care76 [data-tdone="{ids["clean"]}"]')==1,'홈 관리 줄에 차례인 칩 둘')
    ok(cnt(pg,f'#htList .care76 [data-tdone="{ids["tank"]}"]')==0,'아직 차례 아닌 것(3일 뒤)은 칩 없음')
    ok('⏳' in vis(pg,'#htList .care76').inner_text(),'늦은 건 ⏳ 때 지남 표시',vis(pg,'#htList .care76').inner_text().replace('\n',' '))
    pg.screenshot(path=SP+'t76_home.png')
    # 칩 ○ → 기록 + 다음 차례
    clk(pg,f'#htList .care76 [data-tdone="{ids["dish"]}"]',900)
    ok(J(pg,f"(DAYS[dateKey()].entries||[]).some(e=>e.tid==='{ids['dish']}')"),'칩 ○ → 기록됨')
    ok(J(pg,f"TASKS['{ids['dish']}'].due")==J(pg,"addDays(midKey68(),1)"),'매일 관리 → 내일로',J(pg,f"TASKS['{ids['dish']}'].due"))
    clk(pg,f'#htList .care76 [data-tdone="{ids["clean"]}"]',900)
    ok(J(pg,f"TASKS['{ids['clean']}'].due")==J(pg,"addDays(midKey68(),7)"),'7일마다(3일 늦게 함) → 한 날부터 7일 뒤',J(pg,f"TASKS['{ids['clean']}'].due"))
    # 되돌리기(기록 지우기)하면 차례도 돌아오나
    J(pg,f"(()=>{{const d=Object.keys(DAYS).find(k=>(DAYS[k].entries||[]).some(x=>x.tid==='{ids['clean']}')),e=DAYS[d].entries.find(x=>x.tid==='{ids['clean']}');removeEntry(d,e.id)}})()");pg.wait_for_timeout(500)
    ok(J(pg,f"TASKS['{ids['clean']}'].due")==J(pg,"addDays(midKey68(),-3)"),'기록을 지우면 차례가 원래대로',J(pg,f"TASKS['{ids['clean']}'].due"))
    # ☠ 없음
    J(pg,f"postpone(TASKS['{ids['clean']}'],addDays(midKey68(),1))");pg.wait_for_timeout(300)
    ok(not J(pg,f"TASKS['{ids['clean']}'].skull"),'관리는 미뤄도 ☠ 없음')
    J(pg,f"(()=>{{const t=TASKS['{ids['clean']}'];t.due=addDays(midKey68(),-3);saveTask(t);render()}})()");pg.wait_for_timeout(300)
    # 할 일 화면
    J(pg,"location.hash='tasks'");pg.wait_for_timeout(500)
    ok(cnt(pg,ROW(ids['clean']))==0 and cnt(pg,ROW(ids['plan']))==1,'할 일 오늘 목록: 관리는 줄 없음, 보통 할 일은 있음')
    ok(cnt(pg,f'#tList .care76 [data-tdone="{ids["clean"]}"]')==1,'할 일 오늘 목록 아래 관리 줄')
    clk(pg,'#tSide [data-tsel="all"]',400)
    ok(cnt(pg,ROW(ids['clean'])+' .c77m')==1 and cnt(pg,ROW(ids['tank'])+' .c77m')==1,'전체 목록에는 🧽 표시와 함께 뜸(v7.7부터 — 오늘·7일·홈·캘린더에서만 빠짐)')
    clk(pg,'#tSide [data-tsel="tomorrow"]',300);clk(pg,'#tSide [data-tsel="week"]',400)
    ok(cnt(pg,ROW(ids['clean']))==0 and cnt(pg,ROW(ids['tank']))==0,'다음 7일 목록에는 관리가 안 뜸')
    ok(cnt(pg,'#tSide [data-tsel="care"]')==1,'옆 목록에 🧽 관리')
    clk(pg,'#tSide [data-tsel="care"]',500)
    ok(all(cnt(pg,ROW(ids[k]))==1 for k in ['clean','dish','tank','walk']),'🧽 관리 목록엔 관리 셋 + 일퀘 할 일')
    ok(cnt(pg,ROW(ids['plan']))==0,'🧽 관리 목록에 보통 할 일은 없음')
    pg.screenshot(path=SP+'t76_carelist.png')
    # 캘린더 종일 칸
    J(pg,"location.hash='cal'");pg.wait_for_timeout(600)
    if not cnt(pg,'[data-calmode="3day"]'):pg.locator('button',has_text='▾').locator('visible=true').first.click();pg.wait_for_timeout(300)
    clk(pg,'[data-calmode="3day"]',700)
    ok(cnt(pg,f'#calPane [data-ctask="{ids["plan"]}"]')>=1,'캘린더: 보통 할 일은 종일 칸에')
    ok(cnt(pg,f'#calPane [data-ctask="{ids["tank"]}"]')==0 and cnt(pg,f'#calPane [data-ctask="{ids["walk"]}"]')==0,'캘린더: 관리·일퀘 할 일은 종일 칸에 없음')
    ok(J(pg,"cfg76().blk")==30 and J(pg,"Object.values(TASKS).filter(t=>t.cb76).length")==3,'처음 관리로 옮기면 블록 30분이 기본으로 켜짐(차례 있는 오늘·내일·모레)',J(pg,"Object.values(TASKS).filter(t=>t.cb76).map(t=>t.due).join()"))
    J(pg,"careSheet76()");pg.wait_for_timeout(400);clk(pg,'#sheetC [data-c76blk="0"]',700);J(pg,"closeSheet()");pg.wait_for_timeout(300)
    ok(J(pg,"Object.values(TASKS).filter(t=>t.cb76).length")==0 and cnt(pg,'#calPane [data-ctask^="cb76_"]')==0,'블록 없음을 고르면 다 지워짐')
    # 서랍
    if cnt(pg,'#calTray')==0:clk(pg,'#calTrayBtn',400)
    clk(pg,'#calTray [data-traytab="open"]',400)
    ok(cnt(pg,f'#calTray [data-ctask="{ids["plan"]}"]')==1 and cnt(pg,f'#calTray [data-ctask="{ids["clean"]}"]')==0,'서랍 모든 할 일: 관리는 없음')
    # 관리 블록 켜기
    J(pg,"careSheet76()");pg.wait_for_timeout(400)
    clk(pg,'#sheetC [data-c76blk="30"]',700)
    bid='cb76_'+J(pg,"midKey68()")
    ok(J(pg,f"!!TASKS['{bid}']&&TASKS['{bid}'].dur===30"),'블록 30분 → 오늘 관리 블록 생김')
    ok(J(pg,"Object.values(TASKS).filter(t=>t.cb76).length")==3,'오늘·내일·모레 블록(차례 있는 날)',J(pg,"Object.values(TASKS).filter(t=>t.cb76).map(t=>t.due).join()"))
    J(pg,"closeSheet()");pg.wait_for_timeout(400)
    ok(cnt(pg,f'#calPane [data-drop^="allday"] [data-ctask="{bid}"]')==1,'캘린더 종일 칸에 🧽 관리 블록 하나')
    ok(cnt(pg,f'#calPane [data-ctask="{bid}"] .n76')==1 and vis(pg,f'#calPane [data-ctask="{bid}"] .n76').inner_text().strip()=='1','블록에 차례 개수',vis(pg,f'#calPane [data-ctask="{bid}"]').inner_text())
    pg.screenshot(path=SP+'t76_cal.png')
    # 블록을 시간표에 끌어다 놓기
    src=vis(pg,f'#calPane [data-drop^="allday"] [data-ctask="{bid}"]').bounding_box()
    col=vis(pg,f'#calPane [data-drop="col:{J(pg,"midKey68()")}"]')
    cb=col.bounding_box() if col.count() else None
    if cb:
        gy=J(pg,"(()=>{const c=document.querySelector('.tgcol').getBoundingClientRect();return c.top+yOf(17*60)})()")
        drag(pg,ctr(src),(cb['x']+cb['width']/2,gy),steps=20);pg.wait_for_timeout(500)
        ok(J(pg,f"!!TASKS['{bid}'].time"),'블록을 시간표에 끌어다 놓으면 시각이 생김',J(pg,f"TASKS['{bid}'].time"))
        ok(cnt(pg,f'#calPane .blk[data-ctask="{bid}"]')==1,'시간표에 관리 블록')
    else:ok(False,'시간표 칸을 못 찾음')
    # 블록 누르기 → 관리 창
    el=vis(pg,f'#calPane [data-ctask="{bid}"] .bt') if cnt(pg,f'#calPane .blk[data-ctask="{bid}"]') else vis(pg,f'#calPane [data-ctask="{bid}"]')
    el.click();pg.wait_for_timeout(500)
    ok(cnt(pg,'#sheetC .c76l')>=1 and '관리' in vis(pg,'#sheetC h3').inner_text(),'블록을 누르면 관리 창(할 일 상세 아님)',vis(pg,'#sheetC h3').inner_text() if cnt(pg,'#sheetC h3') else '')
    ok(cnt(pg,f'#sheetC .c76r [data-tdone="{ids["clean"]}"]')==1,'관리 창에 오늘 차례')
    # 할 일 목록 어디에도 블록 없음
    ok(J(pg,f"!['today','all','week','inbox','care'].some(s=>taskMatches(TASKS['{bid}'],s))&&!openTasks().some(t=>t.cb76)"),'블록은 할 일 목록·openTasks에 안 나옴')
    # 관리 창에서 ○ → 차례 끝 → 오늘 블록 지워짐
    clk(pg,f'#sheetC .c76r [data-tdone="{ids["clean"]}"]',900)
    ok(J(pg,f"!TASKS['{bid}']"),'오늘 차례를 다 하면 오늘 블록이 지워짐')
    ok(cnt(pg,'#sheetC .c76l')>=1 or cnt(pg,'#sheetC .empty')>=1,'관리 창은 그대로 열려 있음(다시 그림)')
    # ⋯ → 관리에서 빼기
    J(pg,"closeSheet();careSheet76()");pg.wait_for_timeout(400)
    if cnt(pg,'#sheetC .c76d')and not cnt(pg,f'#sheetC [data-c76m="{ids["tank"]}"]'):vis(pg,'#sheetC .c76d summary').click();pg.wait_for_timeout(200)
    clk(pg,f'#sheetC [data-c76m="{ids["tank"]}"]',400)
    pg.locator('#m61 [role=menuitem]',has_text='관리에서 빼기').first.click();pg.wait_for_timeout(600)
    ok(not J(pg,f"TASKS['{ids['tank']}'].care76"),'⋯ → 관리에서 빼기')
    # 우클릭 메뉴로 다시 관리로
    J(pg,"closeSheet();location.hash='tasks';C.ui.tasks.sel='all';render()");pg.wait_for_timeout(500)
    ok(cnt(pg,ROW(ids['tank']))==1,'뺀 것은 다시 할 일 목록에')
    vis(pg,ROW(ids['tank'])+' .tt').click(button='right');pg.wait_for_timeout(400)
    mi=pg.locator('#m61 [role=menuitem]',has_text='관리로')
    ok(mi.count()==1,'우클릭 메뉴에 🧽 관리로')
    if mi.count():mi.first.click();pg.wait_for_timeout(600)
    ok(J(pg,f"TASKS['{ids['tank']}'].care76")==1 and cnt(pg,ROW(ids['tank'])+' .c77m')==1,'우클릭 → 관리로 → 전체 목록에서는 🧽 표시')
    J(pg,"C.ui.tasks.sel='week';render()");pg.wait_for_timeout(400)
    ok(cnt(pg,ROW(ids['tank']))==0,'우클릭 → 관리로 → 다음 7일 목록에서 빠짐')
    # 일퀘 스위치 끄기 → 다시 목록에
    J(pg,"careSheet76()");pg.wait_for_timeout(300)
    vis(pg,'#sheetC [data-c76q]').click();pg.wait_for_timeout(500)
    J(pg,"closeSheet();C.ui.tasks.sel='today';render()");pg.wait_for_timeout(400)
    ok(cnt(pg,ROW(ids['walk']))==1,'일퀘 스위치를 끄면 일퀘 할 일이 다시 목록 줄로')
    # 저장: 설정 키가 normConfig를 지나도 남나 · 서버 저장이 거절되지 않나
    ok(J(pg,"(()=>{const c=normConfig(JSON.parse(JSON.stringify(C)));return !!(c.care76&&c.care76.blk===30&&c.care76.q===0)})()"),'C.care76가 normConfig 뒤에도 남음')
    pg.wait_for_timeout(1500)
    d=dict(json.loads(dump(pg)));tk=[v for k,v in d.items() if ids['tank'] in k]
    ok(any('care76' in json.dumps(v) for v in tk),'할 일 문서에 care76 저장됨')
    ok(cnt(pg,'#err69')==0,'저장 오류 띠 없음')
    b.close()
    ok(not [e for e in errs if 'PAGEERR' in e],'관리: 페이지 오류 없음',[e for e in errs if 'PAGEERR' in e][:2])

    # ================= 2) 하루 예산 =================
    b,pg=run(pw,W=1400,H=900);closepops(pg);pg.wait_for_timeout(300)
    J(pg,"""(()=>{const td=midKey68(),mk=(title,o)=>{const t=newTask({title,list:'inbox'});Object.assign(t,o);saveTask(t)};
      mk('촬영 준비',{due:td,time:'10:00',dur:300});mk('편집 강의',{due:td,time:'16:00',dur:240});mk('장보기',{due:td,dur:60});mk('내일 일',{due:addDays(td,1),time:'09:00',dur:120});
      location.hash='cal';render()})()""");pg.wait_for_timeout(600)
    if not cnt(pg,'[data-calmode="3day"]'):pg.locator('button',has_text='▾').locator('visible=true').first.click();pg.wait_for_timeout(300)
    clk(pg,'[data-calmode="3day"]',700)
    tdk=J(pg,"midKey68()")
    bt=vis(pg,f'#calPane .bud76[data-bud76="{tdk}"]')
    ok(bt.count()==1 and '9h' in bt.inner_text() and '⚠' in bt.inner_text(),'오늘 머리: 9h/8h ⚠(글자로도 표시)',bt.inner_text() if bt.count() else '')
    ok('over' in (bt.get_attribute('class') or ''),'넘침 표시 클래스')
    t2=vis(pg,f'#calPane .bud76[data-bud76="{J(pg,"addDays(midKey68(),1)")}"]')
    ok(t2.count()==1 and '⚠' not in t2.inner_text() and '2h' in t2.inner_text(),'내일 머리: 2h, 넘침 아님',t2.inner_text() if t2.count() else '')
    ok(cnt(pg,f'#calPane .bud76[data-bud76="{J(pg,"addDays(midKey68(),2)")}"]')==0,'아무것도 안 놓은 날은 표시 없음(공간)')
    pg.screenshot(path=SP+'t76_bud.png')
    bt.click();pg.wait_for_timeout(400)
    tx=vis(pg,'#sheetC').inner_text()
    ok('9시간' in tx and '1시간 넘쳐요' in tx and '안 놓은 것 1개' in tx,'예산 창: 놓은 시간·넘침·안 놓은 것',tx[:120].replace('\n',' '))
    clk(pg,'#sheetC [data-b76="d:0.5"]',300);clk(pg,'#sheetC [data-b76="d:0.5"]',400)
    ok(J(pg,f"C.bud76.d['{tdk}']")==9,'이 날만 9시간으로')
    ok(cnt(pg,'#sheetC [data-b76="d:x"]')==1,'예산 창이 그대로 열린 채 다시 그려짐(기본으로 단추)')
    J(pg,"closeSheet()");pg.wait_for_timeout(300)
    bt=vis(pg,f'#calPane .bud76[data-bud76="{tdk}"]')
    ok(bt.count()==1 and '⚠' not in bt.inner_text(),'9시간으로 늘리면 ⚠ 사라짐',bt.inner_text() if bt.count() else '')
    ok(J(pg,"(()=>{const c=normConfig(JSON.parse(JSON.stringify(C)));return !!(c.bud76&&c.bud76.h===8&&Object.keys(c.bud76.d).length===1)})()"),'C.bud76가 normConfig 뒤에도 남음')
    # 날짜 머리를 누르면 원래대로 그날 1일 보기(예산 단추가 가로채지 않음)
    vis(pg,f'#calPane .dh[data-calday="{tdk}"] b').click();pg.wait_for_timeout(500)
    ok(J(pg,"C.ui.cal.mode")=='1day','날짜 숫자를 누르면 예전처럼 1일 보기')
    b.close()

    # ================= 3) 루틴이 스스로 배우기 =================
    b,pg=run(pw,W=400,H=820);closepops(pg);pg.wait_for_timeout(300)
    info=J(pg,"""(()=>{const r=C.routines.find(x=>x.id==='r-morning');const h=rtH62(r,true);h.due=dateKey();h.rep={f:'d',i:1};saveTask(h);
      r.steps.forEach(s=>{const t=TASKS[s.tid];if(t){t.last=null;saveTask(t)}});
      const st=r.steps.filter(s=>s.aid!=='@weigh'&&TASKS[s.tid]);st[0].h76=[0,0,0,0];st[1].min=15;TASKS[st[1].tid].dur=15;saveTask(TASKS[st[1].tid]);st[1].h76=[540,560,520,540];save('config');
      location.hash='tasks';C.ui.tasks.sel='today';render();return {n:r.steps.length,a:st[0].id||st[0].tid,b:st[1].id||st[1].tid,an:stName61(st[0]),bn:stName61(st[1]),w:r.steps[0].aid==='@weigh'}})()""")
    pg.wait_for_timeout(400)
    J(pg,"startRun({routine:C.routines.find(x=>x.id==='r-morning'),p71:1})");pg.wait_for_timeout(700)
    g=0
    while J(pg,"!!RUN") and g<20:
        g+=1;nm=J(pg,"RUN.steps[RUN.si].name")
        if cnt(pg,'#huntW'):pg.fill('#huntW','71.5')
        if nm==info['an']:clk(pg,'#hunt [data-hunt="skip"]',700)
        else:clk(pg,'#hunt [data-hunt="done"]',700)
    ok(not J(pg,"!!RUN"),'루틴 끝까지 돎',g)
    hs=J(pg,"JSON.stringify(C.routines.find(x=>x.id==='r-morning').steps.map(s=>s.h76||null))")
    ok(json.loads(hs).count(None)<=1,'단계마다 실행 기록(h76)이 쌓임',hs)
    for i in range(4):
        if pg.is_visible('#levelup'):pg.click('#luOk');pg.wait_for_timeout(450)
    ok(cnt(pg,'#sheetC [data-l76]')>=2,'끝난 뒤 🧠 맞출까요 창',vis(pg,'#sheetC').inner_text()[:200].replace('\n',' ') if cnt(pg,'#sheetC') else '')
    tx=vis(pg,'#sheetC').inner_text() if cnt(pg,'#sheetC') else ''
    ok(info['an'] in tx and '건너뜀' in tx and '선택 단계' in tx,'자주 건너뛴 단계 → 선택 단계 제안')
    ok(info['bn'] in tx and '목표 15분' in tx and '평균 9분' in tx,'목표 15분 · 실제 평균 9분 제안(20초 안 된 이번 기록은 평균에서 뺌)',tx.replace('\n',' ')[:260])
    pg.screenshot(path=SP+'t76_learn.png')
    clk(pg,'#sheetC [data-l76^="o:"][data-l76$=":1"]',500)
    ok(J(pg,"C.routines.find(x=>x.id==='r-morning').steps.filter(s=>s.opt71).length")==1,'바꾸기 → ◌ 선택 단계')
    clk(pg,'#sheetC [data-l76^="m:"]:not([data-l76$=":0"])',500)
    ok(J(pg,"C.routines.find(x=>x.id==='r-morning').steps.some(s=>s.min===9&&TASKS[s.tid]&&TASKS[s.tid].dur===9)"),'맞추기 → 단계 9분(할 일 소요도)')
    ok(cnt(pg,'#sheetC [data-l76]')==0,'다 답하면 창이 닫힘')
    ok(J(pg,"(()=>{const c=normConfig(JSON.parse(JSON.stringify(C)));return c.routines.find(x=>x.id==='r-morning').steps.some(s=>Array.isArray(s.h76)&&s.h76.length)})()"),'h76이 normConfig 뒤에도 남음')
    pg.wait_for_timeout(1200);ok(cnt(pg,'#err69')==0,'저장 오류 띠 없음(배열 속 배열 아님)')
    # ================= 4) 폰: 할 일 ↔ 캘린더 =================
    J(pg,"closeSheet&&closeSheet();location.hash='tasks'");pg.wait_for_timeout(500)
    ok(cnt(pg,'#t76cal')==1,'폰 할 일 화면 제목 줄에 📅')
    ok(J(pg,"$('t76cal').parentElement.id")=='tChips','📅는 가로로 밀리는 칩 줄에(제목 줄을 안 늘림)')
    clk(pg,'#t76cal',600)
    ok(J(pg,"curView()")=='cal','📅 → 캘린더')
    ok(cnt(pg,'#c76tasks')==1,'폰 캘린더에 📋 할 일')
    pg.screenshot(path=SP+'t76_phonecal.png')
    clk(pg,'#c76tasks',600)
    ok(J(pg,"curView()")=='tasks','📋 → 할 일')
    # 폰 관리 줄
    J(pg,"""(()=>{const td=dateKey();['분리수거','손톱깎기','가계부 쓰기'].forEach((n,i)=>{const t=newTask({title:n,list:'inbox'});t.rep={f:'d',i:3+i};t.due=addDays(td,-i);t.care76=1;saveTask(t)});location.hash='home';render()})()""");pg.wait_for_timeout(600)
    ok(cnt(pg,'#htList .care76 .c76c:not(.q)')==3 and cnt(pg,'#htList .care76 .c76c')==5,'폰 홈 관리 줄: 관리 칩 3개 먼저, 모두 5개까지',cnt(pg,'#htList .care76 .c76c'))
    vis(pg,'#htList .care76').scroll_into_view_if_needed();pg.screenshot(path=SP+'t76_phonehome.png')
    bb=vis(pg,'#htList .care76').bounding_box();ok(bb and bb['height']<110,'폰 관리 줄 높이(세 줄 안쪽)',bb and bb['height'])
    clk(pg,'#htList .care76 [data-c76open]',500);ok(cnt(pg,'#sheetC .c76g')==1 and cnt(pg,'#sheetC .c76r [data-tdone]')>=7,'관리 창에 일퀘 할 일도(칩에서 넘친 것 체크할 곳)',cnt(pg,'#sheetC .c76r [data-tdone]'));J(pg,'closeSheet()')
    b.close()
    b,pg=run(pw,W=1400,H=900);closepops(pg);J(pg,"location.hash='tasks'");pg.wait_for_timeout(500)
    ok(cnt(pg,'#t76cal')==0,'PC(나란히 보기)에선 📅 없음')
    b.close()
    pe=[e for e in errs if 'PAGEERR' in e]
    ok(not pe,'페이지 오류 없음',pe[:3])
print('ERRS',errs[:6]);print('FAILS',len(FAILS),FAILS)
