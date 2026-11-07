exec(open('h61.py').read())
import datetime
SP='/tmp/claude-0/sp/'
J=lambda pg,x:pg.evaluate(x)
with sync_playwright() as pw:
    b=pw.chromium.launch();ctx=b.new_context(viewport={'width':1300,'height':900},timezone_id='Asia/Seoul')
    ctx.add_init_script(MOCK+"\ntry{localStorage.clear()}catch(e){}\n")
    ctx.route('**/backend.js',lambda r:r.fulfill(body="window.__hqResolve(window.__mockApi)",content_type='application/javascript'))
    ctx.route('**/config.js',lambda r:r.fulfill(body="",content_type='application/javascript'))
    ctx.route('**/sw.js',lambda r:r.fulfill(body="",content_type='application/javascript'))
    ctx.route('**/gstatic.com/**',lambda r:r.abort())
    pg=ctx.new_page();pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e)+' '+(e.stack or '')[:500]))
    pg.clock.install(time=datetime.datetime(2026,11,7,21,0,tzinfo=datetime.timezone(datetime.timedelta(hours=9))))
    pg.goto(URL);pg.wait_for_timeout(1500);pg.clock.run_for(9000);closepops(pg)
    # 단일 할 일 몰입
    J(pg,"(()=>{const t=newTask({title:'영화 책 읽기',due:dateKey(),dur:30});t.tmode='flow';saveTask(t);window._t=t;render();startRun({task:t})})()");pg.wait_for_timeout(300)
    print('mode',J(pg,"RUN.mode"),J(pg,"document.querySelector('#hunt .arena > .small.muted').innerText"))
    pg.clock.run_for(25*60*1000);pg.wait_for_timeout(300);print('25m',J(pg,"[$('huntSub').innerText,$('hunt').classList.contains('over')]"))
    pg.clock.run_for(28*60*1000);pg.wait_for_timeout(300);print('53m',J(pg,"[$('huntSub').innerText,$('hunt').classList.contains('over'),RUN.chime70]"));pg.screenshot(path=SP+'t70_flow.png')
    base=J(pg,"taskBase(_t).xp");J(pg,"huntDo('done')");pg.wait_for_timeout(600);closepops(pg)
    print('base',base,'entry',J(pg,"JSON.stringify(today().entries.filter(e=>e.tid===_t.id).map(e=>[e.xp,e.spd,e.dur]))"))
    # 빠를수록도 이제 먹는지
    J(pg,"(()=>{const t=newTask({title:'빨래 개기',due:dateKey(),dur:20});t.tmode='speed';saveTask(t);window._s=t;startRun({task:t})})()");pg.clock.run_for(5*60*1000);J(pg,"huntDo('done')");pg.wait_for_timeout(500);closepops(pg)
    print('speed',J(pg,"JSON.stringify(today().entries.filter(e=>e.tid===_s.id).map(e=>[e.xp,e.spd]))"),J(pg,"taskBase(_s).xp"))
    # 루틴: 독서 단계 → 몰입 마이그레이션
    rs=J(pg,"JSON.stringify((C.routines||[]).map(r=>[r.id,r.name,(r.steps||[]).map(s=>[(TASKS[s.tid]||{}).title,s.min,(TASKS[s.tid]||{}).tmode])]))");print('routines',rs[:900]);print('mig',J(pg,"C.mig70flow"))
    J(pg,"""(()=>{let r=(C.routines||[]).find(r=>(r.steps||[]).some(s=>(TASKS[s.tid]||{}).tmode==='flow'));if(!r){r=C.routines[0];const st=r.steps[0];TASKS[st.tid].tmode='flow';}window._r=r;startRun({routine:r})})()""");pg.wait_for_timeout(300)
    # flow 단계까지 진행
    for i in range(10):
        if J(pg,"flowOn70()"):break
        J(pg,"huntDo('done')");pg.wait_for_timeout(200)
    print('at flow step',J(pg,"[RUN&&RUN.si,RUN&&RUN.steps[RUN.si].name,RUN&&RUN.steps[RUN.si].min]"))
    pg.clock.run_for(60*60*1000);pg.wait_for_timeout(300);print('hunt',J(pg,"[$('huntSub').innerText,$('hunt').classList.contains('over')]"));pg.screenshot(path=SP+'t70_flowR.png')
    J(pg,"huntDo('done')");pg.wait_for_timeout(300);print('flowX',J(pg,"RUN&&RUN.flowX70"))
    for i in range(10):
        if not J(pg,"!!RUN"):break
        J(pg,"huntDo('done')");pg.wait_for_timeout(200)
    closepops(pg);print('rt entries',J(pg,"JSON.stringify(today().entries.slice(0,8).map(e=>[e.kind,e.name,e.xp,e.spd||'']))"))
    # 규칙 창 · 우클릭 단계
    J(pg,"infoForOpen=1;editSheet70('rules','⚙ 규칙')");pg.wait_for_timeout(300);print('r70',J(pg,"!!document.querySelector('#es70 .r70')"));pg.screenshot(path=SP+'t70_rules.png')
    J(pg,"(()=>{const i=document.querySelector('[data-r70=\"otb.xp\"]');i.value='3';i.dispatchEvent(new Event('change',{bubbles:true}))})()");print('otb',J(pg,"JSON.stringify(C.otb69)"))
    J(pg,"closeSheet()");pg.wait_for_timeout(200);print('eb back',J(pg,"$('editBody').closest('#edit,#view-edit,section')?.id||$('editBody').parentNode.id"))
    J(pg,"location.hash='edit';ui.edit='routines';renderEdit()");pg.wait_for_timeout(500)
    bb=pg.query_selector('.st62');print('st62',bool(bb))
    if bb:
        bb.click(button='right');pg.wait_for_timeout(200);print('menu',J(pg,"$('m61')&&$('m61').innerText.replace(/\\n/g,' | ')"));pg.screenshot(path=SP+'t70_ctx.png')
        pg.keyboard.press('Escape')
        print('fl btn',J(pg,"document.querySelectorAll('.st62 [data-fl70]').length"))
    b.close()
    print('\n'.join(e for e in errs if 'TUNNEL' not in e)[:3000])
