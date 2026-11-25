# t140 (v13.5): W1 오늘 칩 미니멀 · W2 모두 내일로 길게 누르기 · W3 관리 묶음 1~2개 · W4 그날 했어요 · W5 스와이프 · W6 행동 📌 고정 · W7 오늘 한 일 날짜 · W8 주 N회 요일 칸
import os,json,sys
os.environ.setdefault('HQURL','file:///home/claude/habit-quest/beta/index.html')
exec(open('/home/claude/habit-quest/dev/v5/h61.py').read())
URL=os.environ.get('HQURL',URL)
ONLY=sys.argv[1:]
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
J=lambda pg,x:pg.evaluate(x)
def notoast(pg):J(pg,"(()=>{const t=document.getElementById('toast');if(t){t.classList.remove('on');t.style.pointerEvents=''}const s=document.getElementById('snack');if(s)s.hidden=true})()")
def run2(pw,W,H,touch=False):
    b=pw.chromium.launch();kw=dict(viewport={'width':W,'height':H})
    if touch:kw.update(has_touch=True,is_mobile=True)
    ctx=b.new_context(**kw);ctx.add_init_script(MOCK+"\ntry{localStorage.clear()}catch(e){}\n"+("window.__coarse75=1;" if touch else ""))
    ctx.route('**/backend.js',lambda r:r.fulfill(body="window.__hqResolve(window.__mockApi)",content_type='application/javascript'))
    ctx.route('**/config.js',lambda r:r.fulfill(body="",content_type='application/javascript'))
    ctx.route('**/sw.js',lambda r:r.fulfill(body="",content_type='application/javascript'))
    pg=ctx.new_page();pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e)));pg.on('console',lambda m:errs.append('CON '+m.text) if m.type=='error' else None)
    pg.goto(URL);pg.wait_for_timeout(2300);closepops(pg);notoast(pg);return b,pg,ctx
def noerr(tag):
    e=[x for x in errs if 'favicon' not in x];ok(not e,tag+' 오류 없음',e[:3]);errs.clear()
def goto(pg,h):
    J(pg,f"location.hash='{h}'");pg.wait_for_timeout(500)
SEED="""(()=>{const td=midKey68();const mk=(n,d)=>{const t=newTask({title:n,due:d==null?null:addDays(td,d)});saveTask(t);return t};
 [1,2,3,4,5].forEach(i=>mk('밀린'+i,-i));mk('오늘A',0);mk('오늘B',0);
 const p=newTask({title:'집 청소'});careOn77(p,7);p.due=addDays(td,-7);saveTask(p);
 [['전자레인지 청소',-12],['옷장 정리',-11],['선풍기 청소',-3],['방바닥 닦기',0],['창틀 닦기',0]].forEach(([n,o])=>{const k=newTask({title:n});k.parent=p.id;careOn77(k,14);k.due=addDays(td,o);saveTask(k)});
 const c=newTask({title:'빨래'});careOn77(c,3);c.due=td;saveTask(c);
 C.ui.tasks=C.ui.tasks||{};C.ui.tasks.sel='today';C.ui.tasks.group='date';render()})()"""
with sync_playwright() as pw:
  for W,H,touch in [(1200,800,False),(390,780,True)]:
    b,pg,ctx=run2(pw,W,H,touch)
    J(pg,SEED);goto(pg,'tasks');pg.wait_for_timeout(500)
    # W1 칩 미니멀
    pg.locator('[data-tc131="late"]').first.click();pg.wait_for_timeout(400)
    o=J(pg,"(()=>{const b=document.querySelector('[data-tc131=\"late\"]'),r=b.getBoundingClientRect(),cs=getComputedStyle(b),l=document.querySelector('.lt132');return {h:Math.round(r.height),bg:cs.backgroundColor,on:b.classList.contains('on'),lt:l?l.textContent.trim():null,lth:l?Math.round(l.getBoundingClientRect().height):0}})()")
    ok(o['on'] and o['h']<=24,f'[{W}] W1 펼친 칩 높이 작음',o)
    ok(o['bg'] in ('rgba(0, 0, 0, 0)','transparent'),f'[{W}] W1 펼친 칩이 검정으로 안 채워짐',o['bg'])
    ok(o['lt']=='📆 모두 내일로' and o['lth']<=24,f'[{W}] W1 모두 내일로 칩 작고 짧음',o)
    # W2 길게 누르기 → 메뉴 → 주말/다음 주
    notoast(pg);bb=pg.locator('.lt132').first.bounding_box()
    if touch:
        cdp=ctx.new_cdp_session(pg);cx,cy=bb['x']+bb['width']/2,bb['y']+bb['height']/2
        cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':cx,'y':cy}]});pg.wait_for_timeout(700)
        cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});pg.wait_for_timeout(300)
    else:
        pg.mouse.move(bb['x']+8,bb['y']+8);pg.mouse.down();pg.wait_for_timeout(700);pg.mouse.up();pg.wait_for_timeout(300)
    ok(J(pg,"!!document.querySelector('#m61:not([hidden]) .dm130, #m61:not([hidden]) [role=menuitem]')"),f'[{W}] W2 길게 누르면 날짜 메뉴')
    before=J(pg,"late132().length")
    ok(before==5,f'[{W}] W2 길게 눌러도 바로 안 옮겨짐(밀린 5)',before)
    pg.locator('#m61 [role=menuitem]',has_text='다음 주').first.click();pg.wait_for_timeout(500)
    ns=J(pg,"(()=>{const w=addDays(weekStart(midKey68()),7);return Object.values(TASKS).filter(t=>/^밀린/.test(t.title)).map(t=>t.due===w)})()")
    ok(all(ns) and len(ns)==5,f'[{W}] W2 다음 주로 5개 이동',ns)
    J(pg,"(()=>{Object.values(TASKS).filter(t=>/^밀린/.test(t.title)).forEach((t,i)=>{t.due=addDays(midKey68(),-1-i);saveTask(t)});render()})()");notoast(pg);pg.wait_for_timeout(300)
    # W3 관리 묶음 칩 1~2개
    cn=J(pg,"(()=>{const r=document.querySelector('.care76');if(!r)return null;return {chips:[...r.querySelectorAll('.c76c:not(.q) .c76n')].map(x=>x.textContent.trim().replace(/\\s+/g,' ')),tail:[...r.querySelectorAll('.f133')].map(x=>x.textContent.trim())}})()")
    print('  care',cn)
    if cn is None:
        J(pg,"(()=>{C.ui.tc131=C.ui.tc131||{};C.tc131=C.tc131||{};C.tc131.care=1;render()})()");pg.wait_for_timeout(400)
        cn=J(pg,"(()=>{const r=document.querySelector('.care76');if(!r)return null;return {chips:[...r.querySelectorAll('.c76c:not(.q) .c76n')].map(x=>x.textContent.trim().replace(/\\s+/g,' ')),tail:[...r.querySelectorAll('.f133')].map(x=>x.textContent.trim())}})()")
        print('  care2',cn)
    kids=[x for x in (cn or {'chips':[]})['chips'] if any(n in x for n in ['전자레인지','옷장','선풍기','방바닥','창틀'])]
    ok(cn is not None and len(kids)==2 and '전자레인지' in ' '.join(kids) and '옷장' in ' '.join(kids),f'[{W}] W3 집 청소는 가장 오래 밀린 2개만',kids)
    ok(cn is not None and any('+3' in x for x in cn['tail']),f'[{W}] W3 나머지 📦 +3',cn and cn['tail'])
    ok(cn is not None and any('빨래' in x for x in cn['chips']),f'[{W}] W3 다른 관리는 그대로',cn and cn['chips'])
    noerr(f'[{W}] W1~3')
    # W4 그날 했어요
    tid=J(pg,"(()=>{const t=newTask({title:'가계부 정리',aid:'g13',rep:{f:'d',i:3},due:addDays(midKey68(),-6)});saveTask(t);render();return t.id})()")
    J(pg,f"recCal132('{tid}',100,100)");pg.wait_for_timeout(300)
    nb=J(pg,"document.querySelectorAll('#m61 [data-rc133]').length")
    ok(nb>=1,f'[{W}] W4 안 한 날이 누르는 칸',nb)
    day=J(pg,"addDays(gk76(),-3)")
    pg.locator(f'#m61 [data-rc133="{tid}|{day}"]').first.click();pg.wait_for_timeout(500)
    ent=J(pg,f"((DAYS['{day}']||{{}}).entries||[]).filter(e=>e.tid==='{tid}').length")
    ok(ent==1,f'[{W}] W4 그날 기록 1개',ent)
    ok(J(pg,"!!document.querySelector('#toast.on')"),f'[{W}] W4 되돌리기 알림')
    last=J(pg,f"TASKS['{tid}'].last")
    ok(last==day,f'[{W}] W4 마지막 한 날 = 그 날',last)
    noerr(f'[{W}] W4')
    # W5 스와이프(터치)
    if touch:
        J(pg,"closeMenu61()");notoast(pg);goto(pg,'tasks');J(pg,"C.ui.tasks.sel='today';render()");pg.wait_for_timeout(400)
        r=pg.locator('#tList .trow[data-task]',has_text='오늘A').first;r.scroll_into_view_if_needed();bb=r.bounding_box()
        cdp=ctx.new_cdp_session(pg);y=bb['y']+bb['height']/2;x0=bb['x']+bb['width']*0.7
        cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x0,'y':y}]})
        for i in range(1,9):
            cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x0-i*14,'y':y}]});pg.wait_for_timeout(20)
        cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});pg.wait_for_timeout(400)
        ok(J(pg,"!!document.querySelector('#m61:not([hidden])')"),'[390] W5 왼쪽 스와이프 → 메뉴')
        txt=J(pg,"document.querySelector('#m61').innerText")
        ok('내일로 미루기' in txt and '날짜 바꾸기' in txt,'[390] W5 메뉴에 미루기·날짜 바꾸기',txt[:80])
        pg.locator('#m61 [role=menuitem]',has_text='내일로 미루기').first.click();pg.wait_for_timeout(400)
        due=J(pg,"(()=>{const t=Object.values(TASKS).find(x=>x.title==='오늘A');return t.due===addDays(midKey68(),1)})()")
        ok(due,'[390] W5 내일로 미룸')
        # 세로 스크롤은 메뉴 안 뜸
        notoast(pg);r=pg.locator('#tList .trow[data-task]').first;bb=r.bounding_box();y=bb['y']+bb['height']/2;x0=bb['x']+bb['width']/2
        cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x0,'y':y}]})
        for i in range(1,6):
            cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x0-3,'y':y+i*8}]});pg.wait_for_timeout(20)
        cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});pg.wait_for_timeout(300)
        ok(not J(pg,"!!document.querySelector('#m61:not([hidden])')"),'[390] W5 세로 움직임은 메뉴 없음')
        noerr('[390] W5')
    # W6 행동 📌 고정
    goto(pg,'log');pg.wait_for_timeout(500)
    a=J(pg,"(()=>{const x=C.actions.find(a=>a.type==='good'&&!a.doneAt);return {id:x.id,name:x.name}})()")
    J(pg,f"actMenu61(C.actions.find(a=>a.id==='{a['id']}'),200,200)");pg.wait_for_timeout(250)
    ok(J(pg,"!!([...document.querySelectorAll('#m61 [role=menuitem]')].find(b=>/고정/.test(b.textContent)))"),f'[{W}] W6 메뉴에 📌 고정')
    pg.locator('#m61 [role=menuitem]',has_text='고정').first.click();pg.wait_for_timeout(400)
    top=J(pg,"(()=>{const g=document.querySelector('#actGroups>.pin133');return g?[...g.querySelectorAll('.act')].map(x=>x.dataset.info):null})()")
    ok(top==['act:'+a['id']],f'[{W}] W6 행동 칸 맨 위 📌 칸',top)
    dup=J(pg,f"document.querySelectorAll('#actGroups .act[data-info=\"act:{a['id']}\"]').length")
    ok(dup==1,f'[{W}] W6 중복 없이 한 줄',dup)
    first=J(pg,"document.querySelector('#actGroups').firstElementChild.className")
    ok('pin133' in first,f'[{W}] W6 📌 칸이 맨 처음',first)
    # 접힌 묶음 안 카드도 보임
    J(pg,"(()=>{C.ui.collapsed=C.ui.collapsed||{};document.querySelectorAll('#actGroups [data-gcollapse]').forEach(h=>{C.ui.collapsed['g'+h.dataset.gcollapse]=true});render()})()");pg.wait_for_timeout(300)
    ok(J(pg,f"document.querySelectorAll('#actGroups>.pin133 .act[data-info=\"act:{a['id']}\"]').length")==1,f'[{W}] W6 묶음이 접혀도 📌은 보임')
    J(pg,"(()=>{C.ui.collapsed={};render()})()")
    pg.locator('#actGroups>.pin133 .chk').first.click();pg.wait_for_timeout(500)
    ok(J(pg,f"curDay().entries.filter(e=>e.aid==='{a['id']}').length")>=1 or J(pg,"!!document.querySelector('#sheet:not([hidden]) #sheetC')&&document.getElementById('sheet').classList.contains('on')||!!document.querySelector('#sheetC .sh')"),f'[{W}] W6 📌 칸에서도 기록(또는 기록 창)')
    J(pg,"try{closeSheet()}catch(e){}");pg.wait_for_timeout(300)
    noerr(f'[{W}] W6')
    # W7 오늘 한 일 날짜
    ok(J(pg,"document.querySelectorAll('#log').length&&!!document.querySelector('.panel>.dc133')"),f'[{W}] W7 오늘 한 일 칸에 날짜 줄')
    pg.locator('.dc133 [data-off="1"]').first.click();pg.wait_for_timeout(400)
    ok(J(pg,"document.getElementById('logTitle').textContent")=='어제 한 일',f'[{W}] W7 어제 한 일')
    ok(J(pg,"document.querySelector('.dc133 [data-off=\"1\"]').getAttribute('aria-pressed')")=='true',f'[{W}] W7 어제 눌림 표시')
    J(pg,"(()=>{const i=document.getElementById('off133');i.value=addDays(dateKey(),-5);i.dispatchEvent(new Event('change',{bubbles:true}))})()");pg.wait_for_timeout(400)
    ok(J(pg,"ui.off")==5,f'[{W}] W7 날짜 고르기 5일 전',J(pg,"ui.off"))
    ok('한 일' in J(pg,"document.getElementById('logTitle').textContent"),f'[{W}] W7 제목 바뀜',J(pg,"document.getElementById('logTitle').textContent"))
    pg.locator('.dc133 [data-off="0"]').first.click();pg.wait_for_timeout(300)
    ok(J(pg,"ui.off")==0,f'[{W}] W7 오늘로')
    noerr(f'[{W}] W7')
    # W8 주 N회 칩 요일 칸
    nid=J(pg,"(()=>{const t=newTask({title:'시나리오',aid:'g1',rep:{f:'x',n:3},due:midKey68()});saveTask(t);render();return t.id})()")
    goto(pg,'cal');pg.wait_for_timeout(600)
    d=J(pg,"(()=>{const w=document.querySelector('.wk91 .dd99');if(!w)return null;const c=[...w.querySelectorAll('.d99')];return {n:c.length,t:c.map(x=>x.textContent).join(''),cls:c.map(x=>x.className.replace('d99 w133 ','')).join(','),h:Math.round(w.getBoundingClientRect().height),w:Math.round(w.getBoundingClientRect().width)}})()")
    ok(d and d['n']==7 and d['t'] in ('월화수목금토일','일월화수목금토'),f'[{W}] W8 요일 글자 칸 7개',d)
    ok(d and d['h']<=20,f'[{W}] W8 칸 높이 작음',d)
    pg.screenshot(path=f'/tmp/t140_{W}_cal.png')
    noerr(f'[{W}] W8')
    b.close()
print('\nFAILS',len(FAILS),FAILS)
