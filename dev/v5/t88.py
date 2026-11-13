# v8.9 시험 — 주 인식/캘린더 첫 칸 · 마감 칩 · 건너뛰기 · 끝낸 일 열기 · 뽀모도로
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
J=lambda pg,x:pg.evaluate(x)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra) if extra!='' else ''))
    if not c:FAILS.append(msg)
def run_week(pg,W):
    r=J(pg,"""(()=>{C.wk71=0;delete C.calw71;delete C.mig88wk;
      const a=C.actions.find(x=>!(x.opts&&x.opts.length));
      const s=newTask({title:'시나리오마감'});s.rep={f:'x',n:5};const sun=weekStart(dateKey());C.wk71=0;const ws0=weekStart(dateKey());
      s.due=addDays(ws0,6);saveTask(s);C.wk71=0;render();
      return {id:s.id,wk:C.wk71,cal:C.calw71,due:TASKS[s.id].due,sat:addDays(ws0,6),mig:C.mig88wk,ws:weekStart(dateKey()),dow:dowOf(TASKS[s.id].due)}})()""");pg.wait_for_timeout(600)
    ok(r['wk']==1 and r['cal']==0 and r['mig'],f'[{W}] 일요일 시작이던 설정 → 주 인식 월 · 캘린더 첫 칸 일 (이주 한 번)',r)
    ok(r['dow']==0 and r['due']==J(pg,"addDays('%s',1)"%r['sat']),f'[{W}] 토요일 마감 → 일요일로',r)
    J(pg,"(()=>{C.ui.cal=C.ui.cal||{};C.ui.cal.mode='month';ui.calAnchor=dateKey();save('config');location.hash='cal';render()})()");pg.wait_for_timeout(1200)
    h=J(pg,"[...document.querySelectorAll('#calMain .wh')].map(x=>x.textContent).join('')")
    ok(h.startswith('일월화'),f'[{W}] 월 보기 머리는 일요일부터',h)
    m=J(pg,"[...document.querySelectorAll('[data-calday]')].filter(c=>c.textContent.includes('시나리오마감')).map(c=>c.dataset.calday)")
    ok(len(m)==1 and J(pg,"dowOf('%s')"%m[0])==0,f'[{W}] 마감 칩은 일요일 칸에',m)
    J(pg,"(()=>{C.calw71=1;save('config');render()})()");pg.wait_for_timeout(800)
    h=J(pg,"[...document.querySelectorAll('#calMain .wh')].map(x=>x.textContent).join('')")
    ok(h.startswith('월화수'),f'[{W}] 캘린더 첫 칸을 월로 바꾸면 따라옴',h)
    J(pg,"(()=>{C.calw71=0;save('config');render()})()")
def run_slots(pg,W):
    r=J(pg,"""(()=>{const td=midKey68();const ws=weekStart(addDays(td,-14));
      const s=newTask({title:'자리지난주'});s.rep={f:'x',n:5};s.due=addDays(ws,6);
      s.sl91={};s.sl91[addDays(ws,1)]='10:00';s.sl91[addDays(ws,4)]='';saveTask(s);
      const mk=d=>{DAYS[d]=DAYS[d]||{date:d,entries:[]};DAYS[d].entries=DAYS[d].entries||[];DAYS[d].entries.push({kind:'task',type:'good',name:'x',area:'',cond:0,xp:0,gold:0,tid:s.id,id:'e'+d})};
      mk(addDays(ws,1));mk(addDays(ws,4));
      const T=TASKS[s.id];
      const on=tasksOn(T.due).filter(x=>x.id===s.id).map(x=>x.title);
      const days=spanDays71(T);
      return {on,days,due:T.due,cnt:wkCnt91(T,ws)}})()""")
    ok(r['cnt']==2 and r['on'] and '마감 2/5' in r['on'][0],f'[{W}] 자리가 다 지나고 2/5면 마감일에 마감 칩',r)
    ok(r['due'] in r['days'],f'[{W}] 월 칸 날짜에도 마감일이 들어감',r)
    r2=J(pg,"""(()=>{const td=midKey68();const ws=weekStart(td);
      const s=newTask({title:'자리남음'});s.rep={f:'x',n:5};s.due=addDays(ws,6);s.sl91={};s.sl91[addDays(td,1)]='';saveTask(s);
      return tasksOn(s.due).filter(x=>x.id===s.id&&x.dl91).length})()""")
    ok(r2==0,f'[{W}] 앞으로 남은 자리가 있으면 마감 칩 안 뜸(자리 날에만)',r2)
def run_skip(pg,W):
    r=J(pg,"""(()=>{const t=newTask({title:'건너뛰기시험'});t.rep={f:'d',i:1};t.due=dateKey();saveTask(t);location.hash='tasks';render();return t.id})()""");pg.wait_for_timeout(900);J(pg,"openTaskSheet('%s')"%r);pg.wait_for_timeout(700)
    pg.click('#sheetC [data-m78="more"]');pg.wait_for_timeout(300)
    txt=J(pg,"document.getElementById('m61')?document.getElementById('m61').innerText:''")
    ok('오늘은 건너뛰기' in txt,f'[{W}] 상세 ⋯ 메뉴에 건너뛰기',txt.replace('\n',' | ')[:120])
    pg.click('#m61 >> text=오늘은 건너뛰기');pg.wait_for_timeout(500)
    s=J(pg,"(()=>{const t=TASKS['%s'];return {skip:t.skip61,due:t.due,td:midKey68(),skull:t.skull||0}})()"%r)
    ok(s['skip'] and s['td'] in s['skip'] and s['due']>s['td'] and not s['skull'],f'[{W}] 건너뛰면 오늘 표시 · 다음 차례 · ☠ 없음',s)
    ok(J(pg,"$('sheet').hidden"),f'[{W}] 건너뛴 뒤 상세 닫힘')
    # 반복 아닌 할 일엔 안 보임
    J(pg,"(()=>{const t=newTask({title:'한번짜리'});saveTask(t);window.__t1=t.id;openTaskSheet(t.id)})()");pg.wait_for_timeout(500)
    pg.click('#sheetC [data-m78="more"]');pg.wait_for_timeout(300)
    txt=J(pg,"document.getElementById('m61')?document.getElementById('m61').innerText:''")
    ok('건너뛰기' not in txt,f'[{W}] 반복 아닌 할 일 ⋯에는 건너뛰기 없음')
    J(pg,"closeMenu61();closeSheet()")
def run_done(pg,W):
    J(pg,"""(()=>{const t=newTask({title:'끝낸반복'});t.rep={f:'d',i:1};t.due=dateKey();t.time='09:00';saveTask(t);window.__rd=t.id;completeTask(TASKS[t.id],{direct:true});
      const u=newTask({title:'끝낸한번'});u.time='10:00';u.due=dateKey();saveTask(u);window.__od=u.id;completeTask(TASKS[u.id],{direct:true});
      C.ui.cal=C.ui.cal||{};C.ui.cal.mode='month';ui.calAnchor=dateKey();save('config');location.hash='cal';render()})()""");pg.wait_for_timeout(1500)
    n=J(pg,"[...document.querySelectorAll('#calMain .cchip.done')].map(x=>[x.textContent.trim(),x.dataset.ctask||''])")
    ok(all(x[1] for x in n) and len(n)>=1,f'[{W}] 월 칸 끝낸 칩은 모두 눌러 열 수 있음(data-ctask)',n)
    for nm in ['끝낸반복','끝낸한번']:
        el=pg.query_selector(f'#calMain .cchip.done:has-text("{nm}")')
        if not el: ok(False,f'[{W}] {nm} 칩 없음');continue
        el.click();pg.wait_for_timeout(500)
        c=J(pg,"sheetCtx&&sheetCtx.task?TASKS[sheetCtx.task].title:''")
        ok(c==nm,f'[{W}] {nm} 칩 누르면 상세가 열림',c)
        J(pg,"closeSheet()")
    # 1일 보기 끝낸 블록
    J(pg,"(()=>{C.ui.cal.mode='1day';ui.calAnchor=dateKey();ui.calSel=dateKey();save('config');render()})()");pg.wait_for_timeout(1000)
    bl=J(pg,"[...document.querySelectorAll('#calPane .blk.done')].map(x=>x.dataset.ctask||'')")
    ok(len(bl)>=1 and all(bl),f'[{W}] 1일 보기 끝낸 블록도 data-ctask',bl)
def run_pomo(pg,W):
    J(pg,"(()=>{C.ui.cal=C.ui.cal||{};location.hash='home';render()})()");pg.wait_for_timeout(900)
    pg.click('#pomoBtn88');pg.wait_for_timeout(400)
    ok(J(pg,"!!(sheetCtx&&sheetCtx.pomo88)"),f'[{W}] 🍅 단추로 패널 열림')
    # 병 이어 두기 + 시작
    J(pg,"(()=>{const c=pset88();c.kinds[0].jar=C.jars[0].id;c.kinds[0].mt=C.jars[0].types[0].id;save('config');pOpen88(true)})()");pg.wait_for_timeout(300)
    pg.click('[data-p88="start"]');pg.wait_for_timeout(500)
    ok(J(pg,"!!PM88&&PM88.run&&PM88.phase==='work'"),f'[{W}] 시작하면 집중 중')
    t0=J(pg,"$('p88time').textContent");ok(t0 in ('25:00','24:59'),f'[{W}] 25분 카운트다운',t0)
    pg.click('[data-p88="pause"]');pg.wait_for_timeout(300)
    a=J(pg,"pEl88()");pg.wait_for_timeout(900);b=J(pg,"pEl88()")
    ok(abs(a-b)<50 and J(pg,"!PM88.run"),f'[{W}] 일시정지하면 시간이 안 감',(a,b))
    pg.click('[data-p88="resume"]');pg.wait_for_timeout(300)
    # 17분 경과 → 그만두기 → 기록 안 함
    J(pg,"PM88.t0-=17*60000;pSave88()");pg.wait_for_timeout(700)
    pg.click('[data-p88="stop"]');pg.wait_for_timeout(300)
    tx=J(pg,"$('sheetC').innerText")
    ok('기록하고 그만두기' in tx and '기록 안 하고 그만두기' in tx and '17분' in tx,f'[{W}] 그만두기 → 기록 / 기록 안 함 둘 다 + 17분',tx[:100].replace('\n',' '))
    n0=J(pg,"pget88().log.length")
    pg.click('[data-p88="norec"]');pg.wait_for_timeout(300)
    ok(J(pg,"pget88().log.length")==n0 and J(pg,"!PM88"),f'[{W}] 기록 안 함 → 통계에 안 들어감')
    # 다시 시작해 17분 → 여기까지 기록
    pg.click('[data-p88="start"]');pg.wait_for_timeout(400)
    J(pg,"PM88.t0-=17*60000;pSave88()");pg.wait_for_timeout(700)
    pg.click('[data-p88="stop"]');pg.wait_for_timeout(300);pg.click('[data-p88="rec"]');pg.wait_for_timeout(400)
    L=J(pg,"pget88().log");ok(len(L)==n0+1 and L[-1]['f']==0 and 1010<=L[-1]['s']<=1040 and not L[-1]['m'],f'[{W}] 여기까지 기록 → 17분 중간 기록, 구슬 없음',L[-1:] )
    # 25분 채우기 → 팝업 + 구슬
    m0=J(pg,"(curDay().entries||[]).filter(e=>e.kind==='jar').length")
    pg.click('[data-p88="start"]');pg.wait_for_timeout(400)
    J(pg,"PM88.t0-=25*60000+1000;pSave88()");pg.wait_for_timeout(900)
    ok(J(pg,"PM88.hold")=='workdone',f'[{W}] 25분 채우면 끝 상태')
    ok(J(pg,"!$('pomoPop88').hidden"),f'[{W}] 팝업이 뜸')
    m1=J(pg,"(curDay().entries||[]).filter(e=>e.kind==='jar').length")
    ok(m1==m0+1,f'[{W}] 구슬 하나',(m0,m1))
    L=J(pg,"pget88().log");ok(L[-1]['f']==1 and L[-1]['m']==1,f'[{W}] 꽉 채운 기록 + 구슬 표시',L[-1])
    pg.screenshot(path='/tmp/t88_pop_%s.png'%W)
    pg.click('#pomoPop88 [data-p88="brk"]');pg.wait_for_timeout(500)
    ok(J(pg,"PM88.phase==='break'&&PM88.run&&PM88.dur===5*60000"),f'[{W}] 쉬는 5분이 시작됨')
    ok(J(pg,"$('pomoPop88').hidden"),f'[{W}] 팝업 닫힘')
    J(pg,"PM88.t0-=5*60000+1000;pSave88()");pg.wait_for_timeout(900)
    ok(J(pg,"PM88.hold")=='breakdone' and J(pg,"!$('pomoPop88').hidden"),f'[{W}] 쉬는 시간 끝 팝업')
    pg.click('#pomoPop88 [data-p88="end"]');pg.wait_for_timeout(300)
    ok(J(pg,"!PM88"),f'[{W}] 여기까지 → 끝')
    # 캘린더 화면(머리 숨김)에선 돌고 있을 때 떠 있는 단추
    J(pg,"(()=>{const k=pget88().kinds[1];pStart88(k,'work');location.hash='cal';render()})()");pg.wait_for_timeout(1000)
    ok(J(pg,"!$('pomoFab88').hidden"),f'[{W}] 캘린더 화면: 돌고 있으면 떠 있는 🍅 단추')
    pg.click('#pomoFab88');pg.wait_for_timeout(400)
    ok(J(pg,"!!(sheetCtx&&sheetCtx.pomo88)"),f'[{W}] 떠 있는 단추로 패널 열림')
    J(pg,"closeSheet();pStop88(false);location.hash='home';render()");pg.wait_for_timeout(800)
    ok(J(pg,"$('pomoFab88').hidden"),f'[{W}] 끝나면 떠 있는 단추 사라짐')
    # 통계
    pg.click('#pomoBtn88');pg.wait_for_timeout(400)
    st=J(pg,"$('sheetC').querySelector('.p88sum').innerText")
    ok('오늘 1번' in st and '이번 주 1번' in st,f'[{W}] 통계: 채운 건 1번만 셈',st.replace('\n',' '))
    J(pg,"document.querySelector('.p88d').open=true");pg.screenshot(path='/tmp/t88_panel_%s.png'%W)
    # 새로고침 뒤에도 진행 상태 유지(localStorage)
    J(pg,"closeSheet()")
    # 설정 보존
    J(pg,"(()=>{const c=pset88();c.w=30;save('config')})()")
    k=J(pg,"(()=>{const n=normConfig?normConfig(JSON.parse(JSON.stringify(C))):null;return n&&n.pomo88?[n.pomo88.w,n.pomo88.log.length,n.calw71,n.mig88wk]:null})()")
    ok(k is not None and k[0]==30 and k[1]>=2,f'[{W}] normConfig가 pomo88·calw71을 보존',k)
with sync_playwright() as p:
    for W,H,pre in [(1400,900,''),(400,820,"window.__coarse75=1;")]:
        b,pg=run(p,W,H,pre=pre)
        for f in (run_week,run_slots,run_skip,run_done,run_pomo):
            try:f(pg,W)
            except Exception as e:
                ok(False,f'[{W}] {f.__name__} 예외',str(e)[:300]);pg.screenshot(path='/tmp/t88_err_%s_%s.png'%(f.__name__,W))
        b.close()
print('ERRS',[e for e in errs if 'favicon' not in e][:8])
print('FAILS',len(FAILS),FAILS)
