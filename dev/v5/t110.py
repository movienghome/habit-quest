# t110 (v10.7): 관리 옮기기·주기 옵션·주 N회 중복 셈·뽀모도로 연결·끝낸 자리·접힘
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
J=lambda pg,x:pg.evaluate(x)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
def notoast(pg):
    J(pg,"(()=>{const t=document.getElementById('toast');if(t){t.classList.remove('on');t.style.pointerEvents=''}})()")
def run_main(pg,W):
    pg.wait_for_timeout(700);notoast(pg)
    # ---- 주 N회 같은 날 중복 ----
    r=J(pg,"""(()=>{const a=C.actions.find(x=>x.type==='good')||C.actions[0];window.__aid=a.id;
      const A=newTask({title:'T빨래A',rep:{f:'x',n:2},aid:a.id,due:midKey68()});saveTask(A);
      const B=newTask({title:'T빨래B',rep:{f:'d',i:3},aid:a.id,due:midKey68()});saveTask(B);
      window.__A=A.id;window.__B=B.id;
      completeTask(TASKS[A.id],{direct:1});completeTask(TASKS[B.id],{direct:1});
      return wkCnt91(TASKS[A.id],weekStart(midKey68()))})()""")
    ok(r==1,f'[{W}] 같은 날 같은 카드 두 할 일 기록 = 1번',r)
    r=J(pg,"""(()=>{const k=addDays(midKey68(),-1);const A=TASKS[window.__A];const d=DAYS[k]||(DAYS[k]={date:k,entries:[]});
      d.entries=d.entries||[];d.entries.push({kind:'task',type:'good',name:'T빨래A',tid:A.id,aid:A.aid,xp:5});return wkCnt91(A,weekStart(midKey68()))})()""")
    ok(r==2 or weekStart(J(pg,"midKey68()"))>J(pg,"addDays(midKey68(),-1)"),f'[{W}] 다른 날은 따로 셈',r)
    # 주 N회 창에 중복 표시
    J(pg,"wkSheet105('*')");pg.wait_for_timeout(300)
    ok(J(pg,"!!document.querySelector('#sheetC .l105 li.dup106')"),f'[{W}] 주 N회 창에서 겹친 기록에 ↩ 표시')
    J(pg,"closeSheet()")
    # ---- 관리로 옮기기: 일퀘 할 일 포함 ----
    J(pg,"""(()=>{const q=newTask({title:'T변기청소Q',rep:{f:'d',i:7},due:midKey68(),list:'inbox'});q.quest=1;saveTask(q);window.__Q=q.id;render()})()""")
    J(pg,"carePick76()");pg.wait_for_timeout(400)
    ok(J(pg,"/T변기청소Q/.test((document.getElementById('pk61')||{}).innerText||'')"),f'[{W}] 관리 옮김 목록에 일퀘 할 일이 나옴')
    J(pg,"(()=>{const x=document.getElementById('pk61');x&&x.querySelector('[data-pk61x],[data-pkclose],.x')&&x.querySelector('[data-pk61x],[data-pkclose],.x').click()})()")
    J(pg,"(()=>{try{closePicker61&&closePicker61()}catch(e){}})()")
    ok(J(pg,"own77('f:abc')&&own77('#태그')&&own77('l:x')&&!own77('today')"),f'[{W}] 폴더·태그·목록에선 관리 할 일이 보임')
    # ---- 주기 메뉴: 반복 옵션 ----
    J(pg,"""(()=>{const t=newTask({title:'T운동X',due:midKey68()});saveTask(t);window.__X=t.id;lastPt={x:300,y:300};careToggle76(TASKS[t.id])})()""")
    pg.wait_for_timeout(300)
    mt=J(pg,"(()=>{const m=document.getElementById('m61');return m?m.innerText:''})()")
    ok('주 2회' in mt and '평일마다' in mt and '자세히' in mt,f'[{W}] 주기 메뉴에 주 N회·평일·자세히',mt)
    pg.evaluate("[...document.querySelectorAll('#m61 button')].find(b=>/^\\s*○\\s*주 2회/.test(b.innerText)).click()");pg.wait_for_timeout(400)
    ok(J(pg,"TASKS[window.__X].care76&&TASKS[window.__X].rep.f==='x'&&TASKS[window.__X].rep.n===2"),f'[{W}] 주 2회로 관리 등록',J(pg,"JSON.stringify(TASKS[window.__X].rep)"))
    # 이미 열린 상세에서 '자세히'
    J(pg,"""(()=>{const t=newTask({title:'T운동Y',due:midKey68()});saveTask(t);window.__Y=t.id;openTaskSheet(t.id)})()""");pg.wait_for_timeout(500)
    J(pg,"(()=>{lastPt={x:300,y:300};careToggle76(TASKS[window.__Y])})()");pg.wait_for_timeout(300)
    pg.evaluate("[...document.querySelectorAll('#m61 button')].find(b=>/자세히/.test(b.innerText)).click()");pg.wait_for_timeout(900)
    ok(J(pg,"!!(sheetCtx&&sheetCtx.task===window.__Y)&&TASKS[window.__Y].care76"),f'[{W}] 자세히 → 관리로 되고 상세가 열려 있음')
    J(pg,"closeSheet()")
    # ---- 관리 줄 접기 ----
    J(pg,"location.hash='home';render()");pg.wait_for_timeout(500)
    ok(J(pg,"!!document.querySelector('#htList .care76 .f106')"),f'[{W}] 홈 관리 줄에 접기 ▾')
    n0=J(pg,"document.querySelectorAll('#htList .care76 .c76c').length")
    J(pg,"document.querySelector('#htList .care76 .f106').click()");pg.wait_for_timeout(400)
    ok(J(pg,"cfg76().fold===1&&document.querySelectorAll('#htList .care76 .c76c').length===0")and n0>=0,f'[{W}] 접으면 칩이 빠짐 (전 {n0}개)')
    J(pg,"document.querySelector('#htList .care76 .f106').click()");pg.wait_for_timeout(300)
    # ---- 입력칸 옆 🧽 ----
    J(pg,"location.hash='tasks';render()");pg.wait_for_timeout(500)
    ok(J(pg,"!!document.querySelector('form[data-taddform=tasks] .c106b')"),f'[{W}] 할 일 입력줄 옆 🧽')
    J(pg,"document.querySelector('form[data-taddform=tasks] .c106b').click()");pg.wait_for_timeout(200)
    ok(J(pg,"/%/.test(document.getElementById('tAdd').value)"),f'[{W}] 🧽 → 입력에 % 붙음')
    J(pg,"document.getElementById('tAdd').value=''")
    # ---- 오늘 한 반복 할 일 ✓ ----
    J(pg,"(()=>{C.ui.tasks=C.ui.tasks||{};C.ui.tasks.sel='all';save('config');render()})()");pg.wait_for_timeout(500)
    ok(J(pg,"!!document.querySelector('#tList .trow.dtd106 .c106ok')"),f'[{W}] 오늘 한 반복 할 일에 ✓ 오늘 함')
    # ---- 뽀모도로 연결 ----
    J(pg,"""(()=>{const t=newTask({title:'T시나리오 쓰기',rep:{f:'x',n:5},due:midKey68()});saveTask(t);window.__S=t.id;
      const c=pset88();c.kinds=[{id:'sc',name:'T시나리오 집필'},{id:'wl',name:'작업일지 쓰기'}];pLog88({k:'T시나리오 집필',s:1500,f:1,m:0});})()""");pg.wait_for_timeout(400)
    ok(J(pg,"(curDay().entries||[]).some(e=>e.tid===window.__S)"),f'[{W}] 뽀모도로 25분 → 같은 이름 반복 할 일이 오늘 한 걸로')
    n=J(pg,"curDay().entries.filter(e=>e.tid===window.__S).length")
    J(pg,"pLog88({k:'T시나리오 집필',s:1500,f:1,m:0})");pg.wait_for_timeout(300)
    ok(J(pg,"curDay().entries.filter(e=>e.tid===window.__S).length")==n,f'[{W}] 두 번째 뽀모도로는 또 기록하지 않음(하루 한 번)')
    # 연결 안 함
    J(pg,"""(()=>{const t=newTask({title:'T작업일지 쓰기',rep:{f:'d',i:1},due:midKey68()});saveTask(t);window.__W=t.id;
      const k=pset88().kinds.find(z=>z.id==='wl');k.tid106='-';pLog88({k:'작업일지 쓰기',s:1500,f:1,m:0})})()""");pg.wait_for_timeout(300)
    ok(J(pg,"!(curDay().entries||[]).some(e=>e.tid===window.__W)"),f'[{W}] 연결 안 함이면 기록 안 함')
    # 쉬는 시간 자동 시작
    J(pg,"""(()=>{PM88={kid:'sc',kind:'T시나리오 집필',phase:'work',dur:1000,acc:0,run:true,t0:Date.now()-5000,n:0,jar:'',mt:''};pSave88();pComplete88()})()""");pg.wait_for_timeout(300)
    ok(J(pg,"!!PM88&&PM88.phase==='break'&&PM88.run===true&&!PM88.hold"),f'[{W}] 작업이 끝나면 쉬는 시간이 저절로 시작',J(pg,"JSON.stringify(PM88)"))
    J(pg,"(()=>{PM88.t0=Date.now()-PM88.dur-1000;pComplete88()})()");pg.wait_for_timeout(300)
    ok(J(pg,"!!PM88&&PM88.phase==='break'&&PM88.hold==='breakdone'"),f'[{W}] 쉬는 시간이 끝나면 멈춤(작업은 눌러야 시작)')
    J(pg,"(()=>{PM88=null;pSave88();pAfter88()})()")
    # ---- 캘린더: 주 N회 자리 끝내면 ✓ 블록 ----
    J(pg,"""(()=>{const k=midKey68();const t=newTask({title:'T자리주N',rep:{f:'x',n:4},due:addDays(weekStart(k),6)});t.sl91={};t.sl91[k]='14:00';t.dur=30;saveTask(t);window.__P=t.id;
      C.ui.cal=C.ui.cal||{};C.ui.cal.mode='week';save('config');location.hash='calendar';render()})()""");pg.wait_for_timeout(600)
    J(pg,"completeTask(TASKS[window.__P],{direct:1})");pg.wait_for_timeout(600)
    ok(J(pg,"doneBlk77(midKey68()).some(x=>x.t.title==='T자리주N'&&x.t.time==='14:00')")and((W<700) or J(pg,"[...document.querySelectorAll('.blk.done')].some(b=>/T자리주N/.test(b.innerText))")),f'[{W}] 끝낸 주 N회 자리가 그 시각 ✓ 블록으로 남음')
    # ---- 상세 이어진 곳 접힘 ----
    J(pg,"""(()=>{const a=C.actions.find(x=>x.id===window.__aid);const t=newTask({title:'T집청소연결',due:midKey68()});t.aid=a.id;saveTask(t);window.__K=t.id;openTaskSheet(t.id)})()""");pg.wait_for_timeout(600)
    J(pg,"document.querySelector('#sheetC [data-x56panel=card]')&&document.querySelector('#sheetC [data-x56panel=card]').click()");pg.wait_for_timeout(300)
    d=J(pg,"!!document.querySelector('#sheetC .conn106')||!document.querySelector('#sheetC .ln60 .conn60')")
    ok(d,f'[{W}] 상세 이어진 곳은 접힘 또는 없음')
    J(pg,"closeSheet()")
with sync_playwright() as pw:
    for W in (1400,420):
        b,pg=run(pw,W,900)
        run_main(pg,W)
        b.close()
print('ERRS',[e for e in errs if 'PAGEERR' in e][:5])
print('FAILS',len(FAILS),FAILS)
