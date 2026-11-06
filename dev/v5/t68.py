exec(open('h61.py').read())
import json,os,datetime
J=lambda pg,x:pg.evaluate(x)
SP=os.environ.get('SP','/tmp/claude-0/sp/')
def run68(pw,W=1300,H=950,at=None):
    b=pw.chromium.launch();ctx=b.new_context(viewport={'width':W,'height':H},timezone_id='Asia/Seoul')
    ctx.add_init_script(MOCK+"\ntry{localStorage.clear()}catch(e){}\n")
    ctx.route('**/backend.js',lambda r:r.fulfill(body="window.__hqResolve(window.__mockApi)",content_type='application/javascript'))
    ctx.route('**/config.js',lambda r:r.fulfill(body="",content_type='application/javascript'))
    ctx.route('**/sw.js',lambda r:r.fulfill(body="",content_type='application/javascript'))
    ctx.route('**/gstatic.com/**',lambda r:r.abort())
    pg=ctx.new_page();pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e)+' '+(e.stack or '')[:500]));pg.on('console',lambda m:errs.append('CON '+m.text) if m.type=='error' else None)
    if at:pg.clock.install(time=at)
    pg.goto(URL);pg.wait_for_timeout(1500)
    if at:pg.clock.run_for(8000)
    return b,pg
with sync_playwright() as pw:
    # ---- A. 새벽 1:30 (토) — 할 일 오늘은 토, 점수 날짜는 금 ----
    at=datetime.datetime(2026,11,7,1,30,tzinfo=datetime.timezone(datetime.timedelta(hours=9)))
    b,pg=run68(pw,at=at);closepops(pg)
    print('keys',J(pg,"[dateKey(),midKey68(),C.dayStart,dawn68()]"))
    J(pg,"""(()=>{const a=newTask({title:'토요일 할 일',due:'2026-11-07'});saveTask(a);const b=newTask({title:'금요일 할 일',due:'2026-11-06'});saveTask(b);
      const h=newTask({title:'습관 반복',due:'2026-11-06'});h.hab=1;saveTask(h);window._ids=[a.id,b.id,h.id];render()})()""")
    print('bucket',J(pg,"_ids.map(i=>dateBucket(TASKS[i])[1])"),'today',J(pg,"_ids.map(i=>taskMatches(TASKS[i],'today'))"))
    J(pg,"location.hash='tasks'");pg.wait_for_timeout(600);print('dawnbar',J(pg,"($('dawn68')||{}).innerText"))
    pg.screenshot(path=SP+'t68_dawn.png')
    J(pg,"completeTask(TASKS[_ids[0]])");pg.wait_for_timeout(300);closepops(pg)
    print('entry day',J(pg,"Object.keys(DAYS).filter(k=>(DAYS[k].entries||[]).some(e=>e.tid===_ids[0]))"))
    J(pg,"location.hash='log'");pg.wait_for_timeout(600);print('moon',J(pg,"document.querySelectorAll('.dawn68').length"))
    # 자정 넘김 다시 그림 (5시가 되면 점수 날짜도 토)
    pg.clock.run_for(4*3600*1000);pg.wait_for_timeout(300);print('after5',J(pg,"[dateKey(),midKey68(),dawn68()]"))
    b.close()
    # ---- B. 낮: 목록 색·숫자 풀이·장비·보스 ----
    b,pg=run68(pw,W=1300)
    closepops(pg);pg.wait_for_timeout(500)
    print('lists',J(pg,"JSON.stringify(C.lists.map(l=>[l.id,l.name,l.color]))"),J(pg,"calBase68().color"))
    J(pg,"""(()=>{const ls=C.lists;ls.slice(0,3).forEach((l,i)=>{const t=newTask({title:'색 시험 '+i,due:dateKey(),list:l.id,time:'1'+i+':00',dur:30});saveTask(t)});render()})()""")
    J(pg,"C.ui.tasks.sel='today';location.hash='tasks'");pg.wait_for_timeout(900)
    print('lists2',J(pg,"JSON.stringify(C.lists.filter(l=>/L(rt|habit)/.test(l.id)).map(l=>[l.id,l.color]))"));print('split',J(pg,"splitOn()"),'cal color',J(pg,"C.ui.cal.color"),J(pg,"[...document.querySelectorAll('#calPane [data-ctask]')].slice(0,4).map(e=>e.style.borderLeft)"))
    print('rows',J(pg,"[...document.querySelectorAll('.trow.lc68')].length"))
    pg.screenshot(path=SP+'t68_tasks.png')
    J(pg,"(()=>{const a=C.actions.find(x=>x.type==='good');doAction(a,{direct:1});doAction(a,{direct:1})})()");closepops(pg);J(pg,"location.hash='log'");pg.wait_for_timeout(500);pg.click('[data-ds67]');pg.wait_for_timeout(300)
    print('ds',J(pg,"document.querySelector('.brk68').innerText"));pg.screenshot(path=SP+'t68_ds.png');J(pg,"closeSheet()")
    # 장비: 기준점 → 성장 영역 XP 올려 Lv.5
    J(pg,"T67=Date.now()-10000;aMile67.t=0;aMile67()");pg.wait_for_timeout(300);closepops(pg)
    print('base',J(pg,"JSON.stringify(C.amile67)"),'retro own',J(pg,"gearSt60().own.filter(x=>x.startsWith('am68')).join(',')"))
    J(pg,"(()=>{const d=today();for(let i=0;i<6;i++){d.entries.push({id:uid(),kind:'act',type:'good',name:'공부',area:'grow',xp:60,gold:0,cond:0,t:'10:00'})}save(d.date);aMile67.t=0;aMile67()})()")
    pg.wait_for_timeout(300);print('popup',J(pg,"!$('levelup').hidden && $('luTxt').innerText.slice(0,80)"));pg.screenshot(path=SP+'t68_mile.png');closepops(pg)
    print('own',J(pg,"gearSt60().own.filter(x=>x.startsWith('am68')).join(',')"),J(pg,"JSON.stringify(today().entries.filter(e=>e.kind==='amile67').map(e=>[e.name,e.gold,e.gear68]))"))
    J(pg,"location.hash='shop'");pg.wait_for_timeout(600);pg.screenshot(path=SP+'t68_shop.png',full_page=True)
    print('lockedtxt',J(pg,"[...document.querySelectorAll('#gear60 p.tiny')].map(p=>p.innerText).join(' | ').slice(0,300)"))
    J(pg,"aJourney67('grow')");pg.wait_for_timeout(300);print('aj',J(pg,"[...document.querySelectorAll('#sheetC ol.aj67 li .num.small')].map(x=>x.textContent).join(',')"));J(pg,"closeSheet()")
    # 보스 약점
    print('boss',J(pg,"(()=>{const s=weekState(dateKey());return JSON.stringify([bossOf(dateKey()).name,s.dmg,s.weak||0,s.weakN||0])})()"))
    J(pg,"location.hash='home'");pg.wait_for_timeout(500);J(pg,"bossSheet65()");pg.wait_for_timeout(300);print('bsheet',J(pg,"document.getElementById('sheetC').innerText.slice(0,500)"));pg.screenshot(path=SP+'t68_boss.png')
    J(pg,"document.querySelector('[data-br68=bossHp]').value='300';document.querySelector('[data-br68=bossHp]').dispatchEvent(new Event('change',{bubbles:true}))");print('hp',J(pg,"C.weekly.bossHp"));J(pg,"closeSheet()")
    # 처치 연출
    J(pg,"popup('보스 처치','👾','<b>시험</b>','이번 주')");pg.wait_for_timeout(1000);pg.screenshot(path=SP+'t68_kill1.png');print('kill',J(pg,"!!document.querySelector('.kill68')"))
    pg.wait_for_timeout(1600);print('after',J(pg,"[!!document.querySelector('.kill68'),!$('levelup').hidden]"));pg.screenshot(path=SP+'t68_kill2.png');closepops(pg)
    # 우클릭: 홈 칸
    hb=pg.query_selector('.hblock[data-hid]:not([hidden])');bb=hb.bounding_box();pg.mouse.click(bb['x']+bb['width']-30,bb['y']+bb['height']-10,button='right');pg.wait_for_timeout(200)
    print('homemenu',J(pg,"($('m61')||{}).innerText"));J(pg,"closeMenu61()")
    # 캘린더 날짜·빈 시간
    J(pg,"location.hash='cal'");pg.wait_for_timeout(700);c=pg.query_selector('.mc[data-calday]');bb=c.bounding_box();pg.mouse.click(bb['x']+bb['width']/2,bb['y']+bb['height']-6,button='right');pg.wait_for_timeout(200)
    print('daymenu',J(pg,"($('m61')||{}).innerText"));J(pg,"closeMenu61()")
    J(pg,"C.ui.cal.mode='week';renderCal()");pg.wait_for_timeout(500);c=pg.query_selector('.tgcol');bb=c.bounding_box();pg.mouse.click(bb['x']+bb['width']*0.4,bb['y']+300,button='right');pg.wait_for_timeout(200)
    print('slotmenu',J(pg,"($('m61')||{}).innerText"));pg.screenshot(path=SP+'t68_slot.png');J(pg,"closeMenu61();C.ui.cal.mode='month';renderCal()")
    # 도파민
    J(pg,"openDopaNow('low')");pg.wait_for_timeout(300);print('dm',J(pg,"document.querySelectorAll('[data-dm68]').length"),J(pg,"document.querySelectorAll('[data-dadd68]').length"))
    J(pg,"document.querySelector('#sheetC details').open=true");i=pg.query_selector('[data-dadd68]');i.fill('창밖 보기 3분');i.press('Enter');pg.wait_for_timeout(300)
    print('dadd',J(pg,"JSON.stringify(C.actions.filter(a=>a.name==='창밖 보기 3분').map(a=>[a.dopa,a.dopaOnly]))"));pg.screenshot(path=SP+'t68_dopa.png');J(pg,"closeSheet()")
    # 카드 고르기
    J(pg,"(()=>{const t=newTask({title:'카드 시험',due:dateKey()});saveTask(t);openTaskSheet(t.id);window._ct=t.id})()");pg.wait_for_timeout(400)
    print('aidpk',J(pg,"!!$('aidPk68')"))
    if J(pg,"!!$('aidPk68')"):
        J(pg,"(()=>{const s=$('tsAid');let el=s;while(el&&el.tagName!=='DETAILS')el=el.parentElement;if(el)el.open=true})()")
        J(pg,"$('aidPk68').click()");pg.wait_for_timeout(200);J(pg,"document.querySelector('#pk61 [data-pk61]').click()");pg.wait_for_timeout(300);print('aid',J(pg,"TASKS[_ct].aid"))
    print('ERR',[e for e in errs][:12])
    b.close()
