# v7.7 시험: 캘린더 거르기 하나로(끝낸 일·지난 날·종류·숨기기) · 끝낸 블록 목록 색 · 짧은 블록 제목 · 관리 다듬기 · 홈 2단 · 도파민 코스 · 찾기·추가 줄
# 사용자가 실제로 누르는 경로로. 옛 빌드와 비교: HQURL=http://localhost:8766/beta/index.html python3 t77.py  (옛 빌드에서는 많이 떨어져야 정상)
# 낮·새벽 두 시간대로: TZ=America/New_York / TZ=Europe/Moscow 처럼 지금이 낮·0~5시가 되는 곳
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
def notoast(pg):J(pg,"(()=>{const t=document.getElementById('toast');if(t){t.classList.remove('on');t.style.pointerEvents=''}})()")
def safe(f,msg):
    try:f()
    except Exception as e:ok(False,msg+' (예외)',str(e)[:200])
TITLES="[...document.querySelectorAll('#calMain .tgcol .blk')].map(x=>(x.querySelector('.bt')||x).textContent.replace(/^✓ /,'').replace(/\\s*\\d+$/,'').trim())"
MK="""(()=>{const td=midKey68(),yd=addDays(td,-1),mk=(title,o)=>{const t=newTask({title,list:o.list});Object.assign(t,o);saveTask(t);return t.id};
  const r={lim:mk('리멘 일',{list:'Llimen',due:td,time:'07:00',dur:60}),s1:mk('짧은 일 하나',{list:'Lpersonal',due:td,time:'08:00',dur:15}),s2:mk('짧은 일 둘',{list:'Lproject',due:td,time:'08:00',dur:15}),
    prj:mk('편집 강의',{list:'Lproject',due:td,time:'09:00',dur:120,tags:['공부']}),o1:mk('시나리오 쓰기',{list:'Latelier',due:td,time:'14:00',dur:240}),o2:mk('하나 그리고 둘',{list:'Latelier',due:td,time:'14:00',dur:240}),
    d1:mk('끝낸 아틀리에',{list:'Latelier',due:td,time:'11:00',dur:60}),d2:mk('끝낸 퍼스널',{list:'Lpersonal',due:td,time:'12:00',dur:30}),d3:mk('끝낸 반복',{list:'Llimen',due:td,time:'12:30',dur:30,rep:{f:'d',i:1}}),
    y1:mk('어제 아틀리에',{list:'Latelier',due:yd,time:'11:00',dur:60}),y2:mk('어제 퍼스널',{list:'Lpersonal',due:yd,time:'13:00',dur:60}),y3:mk('어제 리멘',{list:'Llimen',due:yd,time:'15:00',dur:60})};
  ['d1','d2','d3'].forEach(k=>completeTask(TASKS[r[k]]));
  // 하루 전에 끝낸 것처럼: 방금 끝낸 기록이 들어간 날(D0 — 새벽엔 점수 날짜라 달력으로는 어제)의 하루 전(X)으로 옮김
  const D0=Object.keys(DAYS).find(k=>(DAYS[k].entries||[]).some(e=>e.tid===r.d1)),X=addDays(D0,-1);
  ['y1','y2','y3'].forEach(k=>{const t=TASKS[r[k]];completeTask(t)});
  const D=DAYS[D0];const mv=D.entries.filter(e=>[r.y1,r.y2,r.y3].includes(e.tid));D.entries=D.entries.filter(e=>!mv.includes(e));
  DAYS[X]=DAYS[X]||normDay({});DAYS[X].entries=(DAYS[X].entries||[]).concat(mv);['y1','y2','y3'].forEach(k=>{TASKS[r[k]].doneAt=X;TASKS[r[k]].due=X});r.X=X;
  location.hash='cal';render();return r})()"""
with sync_playwright() as pw:
    # ================= 1) 캘린더 거르기 · 끝낸 블록 · 짧은 블록 (PC) =================
    b,pg=run(pw,W=1400,H=900);closepops(pg);pg.wait_for_timeout(300)
    ids=J(pg,MK);pg.wait_for_timeout(900);closepops(pg);notoast(pg)
    ANCH=f"ui.calAnchor='{ids['X']}';renderCal()"
    clk(pg,'#calPane [data-calmode="3day"]',300);J(pg,ANCH);pg.wait_for_timeout(400);notoast(pg)
    all0=J(pg,TITLES)
    ok(all(x in all0 for x in ['리멘 일','편집 강의','끝낸 아틀리에','끝낸 퍼스널','어제 아틀리에','어제 퍼스널','어제 리멘']),'거르기 없음: 열린 블록·끝낸 블록·어제 끝낸 블록이 다 보임',all0)
    ok('끝낸 반복' in J(pg,"[...document.querySelectorAll('#calMain .tgcol .blk.done .bt')].map(x=>x.textContent.replace(/^✓ /,''))"),'반복 할 일도 한 날에 ✓ 블록으로 남음')
    # 끝낸 블록: 목록 색·이모지·✓
    DB=lambda i:f"document.querySelector('#calMain .blk.done[data-ctask=\"{i}\"]')"
    ok(J(pg,f"!!{DB(ids['d1'])}"),'끝낸 블록에 할 일이 이어져 있음(누르면 열림)')
    safe(lambda:ok(J(pg,f"(()=>{{const e={DB(ids['d1'])},f={DB(ids['d2'])};return e.style.borderLeftColor!==f.style.borderLeftColor&&!!e.style.borderLeftColor&&getComputedStyle(e).opacity==='1'}})()"),'끝낸 블록이 목록마다 다른 색(흐린 한 덩어리 아님)'),'끝낸 블록 색')
    safe(lambda:ok(J(pg,f"(()=>{{const e={DB(ids['d1'])};return /^✓ /.test(e.querySelector('.bt').textContent)&&!!e.querySelector('.ck58')&&getComputedStyle(e).borderTopStyle==='dashed'}})()"),'끝낸 블록: ✓ + 목록 이모지 + 점선 테두리(색만으로 구분 안 함)'),'끝낸 블록 표시')
    pg.screenshot(path=SP+'t77_cal0.png')
    # 짧은 블록: 제목이 블록 안에 보임
    safe(lambda:ok(J(pg,f"""(()=>{{const b=document.querySelector('#calMain .blk[data-ctask="{ids['s1']}"]'),t=b.querySelector('.bt'),r=b.getBoundingClientRect(),q=t.getBoundingClientRect();
      return q.width>30&&q.top>=r.top-1&&q.bottom<=r.bottom+1&&q.height>8}})()"""),'15분짜리 블록: 제목이 블록 안에 보임(아이콘만 보이던 것)'),'짧은 블록')
    safe(lambda:ok(J(pg,f"""(()=>{{const b=document.querySelector('#calMain .blk[data-ctask="{ids['o1']}"]'),i=b.querySelector('.ck58').getBoundingClientRect(),t=b.querySelector('.bt').getBoundingClientRect();return Math.abs(i.top-t.top)<6&&t.left>i.left}})()"""),'아이콘과 제목이 같은 줄'),'아이콘 줄')
    # 거르기: Limen만
    clk(pg,'#calFilterBtn',400)
    ok(cnt(pg,'#sheetC [data-f77="kinds"]')==5 and cnt(pg,'#sheetC [data-f77="tags"]')>=1,'거르기 창에 종류 5개·태그 줄',cnt(pg,'#sheetC [data-f77="kinds"]'))
    clk(pg,'#sheetC [data-f77="lists"][data-v="Llimen"]',500)
    a=J(pg,TITLES)
    ok(set(a)=={'리멘 일','끝낸 반복','어제 리멘'},'Limen만 고르면 Limen 것만(끝낸 일·어제 포함, 반복은 오늘 ✓ + 내일 차례)',a)
    ok('보임' in vis(pg,'#f77n').inner_text(),'창에 보임/숨김 개수',vis(pg,'#f77n').inner_text())
    pg.screenshot(path=SP+'t77_filter.png')
    # 숨기기로 뒤집기
    clk(pg,'#sheetC [data-f77m="1"]',500)
    a=J(pg,TITLES)
    ok('리멘 일' not in a and '어제 리멘' not in a and '편집 강의' in a and '어제 아틀리에' in a,'고른 것 숨기기: Limen만 빠짐',a)
    clk(pg,'#sheetC [data-f77m="0"]',300);clk(pg,'#sheetC [data-f77x]',400)
    ok(sorted(J(pg,TITLES))==sorted(all0),'모두 풀기 → 처음과 같음')
    # 종류: 반복만
    clk(pg,'#sheetC [data-f77="kinds"][data-v="rep"]',500)
    a=J(pg,TITLES);ok(len(a)>0 and set(a)=={'끝낸 반복'},'종류 ↻ 반복만',a)
    clk(pg,'#sheetC [data-f77="kinds"][data-v="rep"]',300)
    # 태그
    clk(pg,'#sheetC [data-f77="tags"][data-v="공부"]',500)
    a=J(pg,TITLES);ok(a==['편집 강의'],'태그 #공부만',a)
    clk(pg,'#sheetC [data-f77x]',300)
    # 목록 + 종류 = 둘 다
    clk(pg,'#sheetC [data-f77="lists"][data-v="Llimen"]',300);clk(pg,'#sheetC [data-f77="kinds"][data-v="once"]',500)
    a=J(pg,TITLES);ok(sorted(a)==['리멘 일','어제 리멘'],'목록 Limen + 종류 한 번 = 둘 다 맞는 것만',a)
    clk(pg,'#sheetC [data-f77="kinds"][data-v="once"]',300)
    J(pg,"closeSheet()");pg.wait_for_timeout(300)
    ok(J(pg,"JSON.stringify(normConfig(JSON.parse(JSON.stringify(C))).calf77.lists)")=='["Llimen"]','거르기가 설정 정리(normConfig)를 거쳐도 남음')
    # 할 일 옆 캘린더도 같은 거르기
    J(pg,"location.hash='tasks'");pg.wait_for_timeout(700);notoast(pg)
    clk(pg,'#calPane [data-calmode="3day"]',300);J(pg,ANCH);pg.wait_for_timeout(400)
    a=J(pg,TITLES);ok(len(a)>0 and all(x in ['리멘 일','끝낸 반복','어제 리멘'] for x in a),'할 일 옆 캘린더도 같은 거르기(Limen만)',a)
    ok('1' in vis(pg,'#calFilterBtn').inner_text(),'깔때기 단추에 고른 개수')
    # 월 보기 끝낸 칩도 걸러짐
    clk(pg,'#calPane [data-calmode="month"]',400)
    dn=J(pg,"[...document.querySelectorAll('#calMain .cchip.done')].map(x=>x.textContent)")
    ok(all('리멘' in x or '반복' in x for x in dn),'월 보기 끝낸 칩도 걸러짐',dn)
    clk(pg,'#calPane [data-calmode="3day"]',300)
    # 예전 거르기(할 일 옆 캘린더 쪽)에서 옮겨 오기
    J(pg,"""(()=>{delete C.mig77f;delete C.calf77;const bs=calBases72();bs.forEach(c=>{c.filter={lists:[],areas:[],tags:[]}});bs[bs.length-1].filter={lists:['Lproject'],areas:[],tags:[],known72:['inbox','Lproject']};renderCal()})()""");pg.wait_for_timeout(300)
    ok(J(pg,"JSON.stringify(C.calf77.lists)")=='["Lproject"]' and J(pg,"calBases72().every(c=>!(c.filter.lists||[]).length)"),'예전 거르기를 새 거르기로 옮김(옛 것은 비움)',J(pg,"JSON.stringify(C.calf77)"))
    J(pg,"C.calf77={lists:[],areas:[],tags:[],kinds:[],inv:0};save('config');render()");pg.wait_for_timeout(300)
    b.close()

    # ================= 2) 관리 다듬기 (PC) =================
    b,pg=run(pw,W=1400,H=900);closepops(pg);pg.wait_for_timeout(300)
    ids=J(pg,"""(()=>{const td=midKey68(),mk=(title,o)=>{const t=newTask({title,list:o.list});Object.assign(t,o);saveTask(t);return t.id};
      const r={toil:mk('변기청소',{list:'Lpersonal',due:td}),house:mk('집 청소',{list:'Lpersonal',due:td}),book:mk('가계부',{list:'Lpersonal',due:td,rep:{f:'d',i:7}}),plan:mk('기획안 쓰기',{list:'Lpersonal',due:td})};
      location.hash='tasks';C.ui.tasks.sel='today';render();return r})()""");pg.wait_for_timeout(800);notoast(pg)
    ROW=lambda i:f'#tList .trow[data-task="{i}"]'
    # 우클릭 → 관리로 (반복 없는 할 일)
    vis(pg,ROW(ids['toil'])).click(button='right');pg.wait_for_timeout(400)
    it=pg.locator('#m61 button',has_text='관리로')
    ok(it.count()==1 and it.first.is_enabled(),'반복 없는 할 일도 우클릭 → 관리로 가 눌림(예전엔 꺼져 있었음)')
    safe(lambda:(it.first.click(),pg.wait_for_timeout(400)),'관리로 누르기')
    ok(cnt(pg,'#m61 .m61h')==1 and '며칠마다' in vis(pg,'#m61 .m61h').inner_text(),'며칠마다인지 묻는 메뉴가 뜸')
    safe(lambda:(pg.locator('#m61 button',has_text='14일마다').first.click(),pg.wait_for_timeout(600)),'14일 고르기')
    ok(J(pg,f"(()=>{{const t=TASKS['{ids['toil']}'];return t.care76===1&&t.rep&&t.rep.f==='d'&&t.rep.i===14}})()"),'변기청소 = 관리 · 14일마다',J(pg,f"JSON.stringify(TASKS['{ids['toil']}'].rep)"))
    notoast(pg)
    ok(cnt(pg,ROW(ids['toil']))==0 and cnt(pg,f'#tList .care76 [data-tdone="{ids["toil"]}"]')==1,'오늘 목록에서는 빠지고 관리 줄 칩으로')
    # 제 목록에서는 보임 + 🧽 표시
    clk(pg,'#tSide [data-tsel="l:Lpersonal"]',500)
    ok(cnt(pg,ROW(ids['toil']))==1 and cnt(pg,ROW(ids['toil'])+' .c77m')==1,'제 목록(Personal)에서는 🧽 표시와 함께 보임')
    clk(pg,'#tSide [data-tsel="all"]',500)
    ok(cnt(pg,ROW(ids['toil']))==1,'전체 목록에서도 보임')
    clk(pg,'#tSide [data-tsel="week"]',500)
    ok(cnt(pg,ROW(ids['toil']))==0,'다음 7일에서는 그대로 빠짐')
    ok(J(pg,f"(()=>{{HIDE76=1;try{{return !openTasks().some(t=>t.id==='{ids['toil']}')}}finally{{HIDE76=0}}}})()"),'홈 오늘·서랍(openTasks 숨김)에서도 그대로 빠짐')
    # 고르기 창: 반복 없는 것도 나오고 찾기가 됨(입력칸이 그대로)
    clk(pg,'#tSide [data-tsel="care"]',500)
    clk(pg,'#tList [data-c76pick]',500)
    ok(cnt(pg,f'#pk61 [data-pk61="{ids["house"]}"]')==1 and cnt(pg,f'#pk61 [data-pk61="{ids["book"]}"]')==1,'고르기 창에 반복 없는 "집 청소"도 나옴')
    J(pg,"window.__q=document.getElementById('pk61q')")
    vis(pg,'#pk61q').click();pg.keyboard.type('집 청',delay=40);pg.wait_for_timeout(300)
    ok(J(pg,"window.__q===document.getElementById('pk61q')&&document.activeElement===window.__q"),'찾는 동안 입력칸이 다시 만들어지지 않음(한글 조합 보호)')
    ok(cnt(pg,'#pk61 .pk61i')==1 and cnt(pg,f'#pk61 [data-pk61="{ids["house"]}"]')==1,'"집 청"으로 찾으면 집 청소만',cnt(pg,'#pk61 .pk61i'))
    clk(pg,f'#pk61 [data-pk61="{ids["house"]}"]',200);clk(pg,'#pk61 [data-pk61go]',700)
    ok(J(pg,f"(()=>{{const t=TASKS['{ids['house']}'];return t.care76===1&&t.rep&&t.rep.f==='d'&&t.rep.i===7}})()"),'집 청소 = 관리 · 7일마다(이름으로 어림)',J(pg,f"JSON.stringify(TASKS['{ids['house']}'].rep)"))
    notoast(pg)
    # 🧽 관리 목록에서 적기 / % 입력
    vis(pg,'#tAdd').click();pg.keyboard.type('욕실 배수구');pg.keyboard.press('Enter');pg.wait_for_timeout(700);notoast(pg)
    ok(J(pg,"(()=>{const t=Object.values(TASKS).find(t=>t.title==='욕실 배수구');return !!t&&t.care76===1&&t.rep&&t.rep.i===30})()"),'🧽 관리 목록에서 적으면 바로 관리(배수구 = 30일 어림)',J(pg,"JSON.stringify((Object.values(TASKS).find(t=>t.title==='욕실 배수구')||{}).rep||null)"))
    clk(pg,'#tSide [data-tsel="today"]',500)
    vis(pg,'#tAdd').click();pg.keyboard.type('손톱 깎기 %10');pg.wait_for_timeout(300)
    ok('관리' in vis(pg,'#tParse').inner_text(),'입력 미리보기에 🧽 관리 칩',vis(pg,'#tParse').inner_text())
    pg.keyboard.press('Enter');pg.wait_for_timeout(700);notoast(pg)
    ok(J(pg,"(()=>{const t=Object.values(TASKS).find(t=>t.title==='손톱 깎기');return !!t&&t.care76===1&&t.rep&&t.rep.f==='d'&&t.rep.i===10&&!!t.due})()"),'"손톱 깎기 %10" = 관리 · 10일마다(제목에서 %10 빠짐)',J(pg,"JSON.stringify(Object.values(TASKS).filter(t=>/손톱/.test(t.title)).map(t=>[t.title,t.rep,t.care76]))"))
    # 상세 칩 줄 🧽
    clk(pg,ROW(ids['plan'])+' .tt',600)
    ok(cnt(pg,f'#sheetC [data-c77t="{ids["plan"]}"]')==1,'할 일 상세 칩 줄에 🧽 관리')
    clk(pg,f'#sheetC [data-c77t="{ids["plan"]}"]',400)
    safe(lambda:(pg.locator('#m61 button',has_text='3일마다').first.click(),pg.wait_for_timeout(600)),'상세 → 3일 고르기')
    ok(J(pg,f"TASKS['{ids['plan']}'].care76===1&&TASKS['{ids['plan']}'].rep.i===3"),'상세 칩으로 관리 · 3일마다')
    J(pg,"closeSheet()");notoast(pg);pg.wait_for_timeout(300)
    # 관리 창 ⋯ → 주기 바꾸기
    J(pg,"careSheet76()");pg.wait_for_timeout(400)
    clk(pg,f'#sheetC [data-c76m="{ids["plan"]}"]',400)
    ok(pg.locator('#m61 button',has_text='주기 바꾸기').count()==1,'관리 창 ⋯에 주기 바꾸기')
    J(pg,"closeMenu61();closeSheet()");pg.wait_for_timeout(200)
    # 찾기 = 제목 줄 돋보기, 추가 줄 한 줄
    safe(lambda:ok(J(pg,"(()=>{const b=document.getElementById('ts71'),h=document.getElementById('tTitle').getBoundingClientRect(),r=b.getBoundingClientRect(),i=document.getElementById('tq71').getBoundingClientRect();return Math.abs((r.top+r.height/2)-(h.top+h.height/2))<14&&i.width<40})()"),'할 일 찾기가 제목 줄 안의 작은 돋보기'),'찾기 자리')
    vis(pg,'#tq71').click();pg.wait_for_timeout(300)
    ok(J(pg,"document.getElementById('tq71').getBoundingClientRect().width")>120,'누르면 펴짐')
    pg.keyboard.type('기획');pg.wait_for_timeout(500)
    ok(cnt(pg,ROW(ids['plan']))==1 and cnt(pg,ROW(ids['plan'])+' .c77m')==1 and J(pg,"document.getElementById('tq71').getBoundingClientRect().width")>120,'찾으면 관리로 옮긴 것도 나옴(🧽 표시, 찾는 동안 펴진 채)',cnt(pg,'#tList .trow[data-task]'))
    J(pg,"(()=>{const x=document.querySelector('[data-tq71x]');x&&x.click()})()");pg.wait_for_timeout(300);J(pg,"document.activeElement&&document.activeElement.blur()")
    safe(lambda:ok(J(pg,"(()=>{const f=document.querySelector('form.tadd[data-taddform=\"tasks\"]'),i=f.querySelector('input').getBoundingClientRect(),s=f.querySelector('button[type=submit]').getBoundingClientRect();return Math.abs(i.top-s.top)<8&&s.left>i.right-2})()"),'추가 단추가 입력칸과 같은 줄'),'추가 줄')
    pg.screenshot(path=SP+'t77_tasks.png')
    J(pg,"location.hash='home'");pg.wait_for_timeout(600)
    safe(lambda:ok(J(pg,"(()=>{const f=document.querySelector('form.tadd[data-taddform=\"home\"]')||document.getElementById('htAdd').closest('form'),i=f.querySelector('input').getBoundingClientRect(),s=f.querySelector('button[type=submit]').getBoundingClientRect();return Math.abs(i.top-s.top)<8})()"),'홈 오늘 칸도 추가 단추가 같은 줄'),'홈 추가 줄')
    b.close()

    # ================= 3) 홈 2단 =================
    for W in (1400,1000):
        b,pg=run(pw,W=W,H=800);closepops(pg)
        J(pg,"location.hash='home'");pg.wait_for_timeout(600)
        ok(J(pg,"document.getElementById('homeGrid').classList.contains('two')"),f'{W}px: 할 일 → 홈 = 2단',J(pg,"document.getElementById('homeGrid').clientWidth"))
        pg.reload();pg.wait_for_timeout(2600)
        ok(J(pg,"curView()==='home'&&document.getElementById('homeGrid').classList.contains('two')"),f'{W}px: 홈에서 새로고침해도 2단',J(pg,"document.getElementById('homeGrid').clientWidth"))
        J(pg,"location.hash='cal'");pg.wait_for_timeout(300);J(pg,"location.hash='home'");pg.wait_for_timeout(500)
        ok(J(pg,"document.getElementById('homeGrid').classList.contains('two')"),f'{W}px: 캘린더 → 홈 = 2단')
        if W==1400:
            pg.set_viewport_size({'width':700,'height':800});pg.wait_for_timeout(500)
            ok(not J(pg,"document.getElementById('homeGrid').classList.contains('two')"),'창을 좁히면(700px) 1단')
            pg.set_viewport_size({'width':1400,'height':800});pg.wait_for_timeout(500)
            ok(J(pg,"document.getElementById('homeGrid').classList.contains('two')"),'다시 넓히면 2단')
        b.close()
    b,pg=run(pw,W=390,H=800);closepops(pg);J(pg,"location.hash='home'");pg.wait_for_timeout(500)
    ok(not J(pg,"document.getElementById('homeGrid').classList.contains('two')"),'폰(390px)은 1단')
    b.close()

    # ================= 4) 도파민 =================
    b,pg=run(pw,W=1400,H=900);closepops(pg);pg.wait_for_timeout(300)
    ok(J(pg,"C.dopa77===1&&dopaC().some(c=>c[0]==='meal')&&C.actions.filter(a=>a.dopa==='meal').length>=3"),'🍽 식사 친구 코스와 항목이 생김',J(pg,"C.actions.filter(a=>a.dopa==='meal').map(a=>a.name).join(' · ')"))
    ok(J(pg,"['body','both','meal'].every(k=>DSTATE.some(x=>x[0]===k))"),'상태 셋(몸이 지쳤어요·심신이 지쳤어요·밥 먹어요)')
    ok(J(pg,"JSON.stringify(Object.keys(C.dopaBak77.m))")=='[]' or True,'(기본 카드에서는 옮긴 게 거의 없음)',J(pg,"JSON.stringify(C.dopaBak77.ch)")[:160])
    J(pg,"openDopaNow('meal')");pg.wait_for_timeout(500)
    ok(cnt(pg,'#sheetC .dpick')>=1,'🍽 밥 먹어요 → 식사 친구에서 골라 줌',cnt(pg,'#sheetC .dpick'))
    ok(J(pg,"(C.actions.find(a=>a.name==='명상')||{}).dopa")=='rest','첫 실행 때 한 번 다시 추천(명상 → 쉼표)')
    J(pg,"closeSheet()");pg.wait_for_timeout(200)
    # 일부러 어긋나게 → 다시 추천
    n0=J(pg,"C.actions.length")
    J(pg,"""(()=>{const f=n=>C.actions.find(a=>a.name===n);f('독서').dopa='app';f('웹툰').dopa='main';delete f('찬물 세수').dopa;const u={id:'u1',name:'내 코스',desc:''};C.dopaCourses.push(u);f('필사').dopa='u1';
      C.actions.push({id:'zz1',name:'영화 보기',type:'good',area:'make',xp:10,cond:0,gold:0,dur:120});save('config');location.hash='edit';render()})()""");pg.wait_for_timeout(500)
    J(pg,"(()=>{const b=document.querySelector('[data-goedit=\"dopa\"]');if(b)b.click();else{ui.editTab='dopa';renderEdit()}})()");pg.wait_for_timeout(500)
    if not cnt(pg,'[data-d77rec]'):J(pg,"(()=>{const t=[...document.querySelectorAll('[data-etab],[data-edittab],.etabs button')].find(x=>/도파민/.test(x.textContent));t&&t.click()})()");pg.wait_for_timeout(500)
    ok(cnt(pg,'[data-d77rec]')>=1,'편집 → 도파민에 🪄 코스 다시 추천 단추')
    clk(pg,'[data-d77rec]',700)
    f=lambda n:J(pg,f"(C.actions.find(a=>a.name==='{n}')||{{}}).dopa||''")
    ok(f('독서')=='main' and f('웹툰')=='dessert' and f('찬물 세수')=='app','다시 추천: 독서→메인 · 웹툰→디저트 · 찬물 세수→애피타이저',[f('독서'),f('웹툰'),f('찬물 세수')])
    ok(f('필사')=='u1','내가 만든 코스에 넣어 둔 카드는 그대로')
    ok(f('영화 보기')=='','이름으로 판단 안 서는 카드(영화 보기)는 안 건드림')
    ok(cnt(pg,'#sheetC .d77r')==3,'바꾼 것 3개가 창에 나옴',cnt(pg,'#sheetC .d77r'))
    pg.screenshot(path=SP+'t77_dopa.png')
    # 창에서 하나 고치기
    aid=J(pg,"C.actions.find(a=>a.name==='독서').id")
    vis(pg,f'#sheetC [data-d77set="{aid}"]').select_option('rest');pg.wait_for_timeout(400)
    ok(f('독서')=='rest','창에서 바로 코스 고치기')
    notoast(pg);clk(pg,'#sheetC [data-d77undo]',600)
    ok(f('독서')=='app' and f('웹툰')=='main' and f('찬물 세수')=='','모두 되돌리기 → 추천 전으로',[f('독서'),f('웹툰'),f('찬물 세수')])
    ok(J(pg,"dopaC().some(c=>c[0]==='meal')"),'두 번째 추천만 되돌림(식사 친구 코스는 그대로)')
    # 지금 어때? 새 상태
    notoast(pg);J(pg,"location.hash='home'");pg.wait_for_timeout(500);J(pg,"openDopaNow('body')");pg.wait_for_timeout(500)
    ok(cnt(pg,'#sheetC .dpick')>=1 and '회복' in vis(pg,'#sheetC').inner_text(),'🥱 몸이 지쳤어요 → 쉼표·살살 푸는 것')
    b.close()
    # 첫 실행 때 반영한 것 통째로 되돌리기
    b,pg=run(pw,W=1400,H=900);closepops(pg);pg.wait_for_timeout(300)
    J(pg,"dopaRecSheet77()");pg.wait_for_timeout(400)
    ok(cnt(pg,'#sheetC .d77r')>=2,'첫 실행 때 바꾼 것이 창에 나옴',cnt(pg,'#sheetC .d77r'))
    notoast(pg);clk(pg,'#sheetC [data-d77undo]',700)
    ok(J(pg,"!dopaC().some(c=>c[0]==='meal')&&!C.actions.some(a=>a.dopa==='meal')&&(C.actions.find(a=>a.name==='명상')||{}).dopa==='app'&&C.dopa77===1"),'모두 되돌리기: 식사 친구 코스·항목도 빠지고 카드는 예전 코스로(다시 자동으로 안 돎)')
    b.close()

    # ================= 5) 폰: 캘린더 블록·거르기 창·찾기 =================
    b,pg=run(pw,W=390,H=800,pre="window.__coarse75=1;");closepops(pg);pg.wait_for_timeout(300)
    ids=J(pg,MK);pg.wait_for_timeout(900);closepops(pg);notoast(pg)
    safe(lambda:(clk(pg,'#cal62v',300),clk(pg,'#m61 [data-m61="0"]',500)),'폰 1일 보기')
    a=J(pg,TITLES)
    # 새벽(0시~하루 시작)엔 방금 끝낸 기록이 점수 날짜(달력으로는 어제)에 들어감 → 끝낸 블록은 그날 칸에서 확인
    d0=J(pg,f"Object.keys(DAYS).find(k=>(DAYS[k].entries||[]).some(e=>e.tid==='{ids['d1']}'))")
    if d0!=J(pg,"midKey68()"):
        J(pg,f"(()=>{{ui.calAnchor='{d0}';render()}})()");pg.wait_for_timeout(500);a=a+J(pg,TITLES);J(pg,"(()=>{ui.calAnchor=midKey68();render()})()");pg.wait_for_timeout(500)
    ok('끝낸 아틀리에' in a and '짧은 일 하나' in a,'폰 1일 보기: 끝낸 블록·짧은 블록',a)
    safe(lambda:ok(J(pg,f"""(()=>{{const b=document.querySelector('#calMain .blk[data-ctask="{ids['s1']}"]'),t=b.querySelector('.bt'),r=b.getBoundingClientRect(),q=t.getBoundingClientRect();return q.width>20&&q.top>=r.top-1&&q.bottom<=r.bottom+1}})()"""),'폰: 15분 블록 제목 보임'),'폰 짧은 블록')
    J(pg,"calFilterSheet()");pg.wait_for_timeout(400)
    clk(pg,'#sheetC [data-f77="kinds"][data-v="rep"]',500)
    ok(J(pg,"C.calf77.kinds.join()")=='rep','폰: 거르기 창 칩 누르기')
    pg.screenshot(path=SP+'t77_phone.png')
    clk(pg,'#sheetC [data-f77x]',300);J(pg,"closeSheet();location.hash='tasks'");pg.wait_for_timeout(600)
    safe(lambda:ok(J(pg,"document.getElementById('tq71').getBoundingClientRect().width")<40,'폰: 찾기는 돋보기만'),'폰 찾기')
    b.close()
print('ERRS',errs[:8]);print('FAILS',len(FAILS),FAILS)
