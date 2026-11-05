import json,sys,time,datetime
from playwright.sync_api import sync_playwright
SP='/tmp/claude-0/-home-claude/57fdb68d-e178-5526-84b7-bc52896b8430/scratchpad/'
URL='http://127.0.0.1:8765/beta/'
def dk(off=0):
    d=datetime.datetime.now()-datetime.timedelta(hours=4)+datetime.timedelta(days=off);return d.strftime('%Y-%m-%d')
seed={
 'game/config':{'v':4,'actions':[{'id':'g1','name':'운동','type':'good','area':'body','cond':8,'gold':3,'xp':15,'marble':'done:fit'},{'id':'g5','name':'일기쓰기','type':'good','area':'mind','cond':5,'gold':2,'xp':8,'marble':''},{'id':'g13','name':'가계부 기록','type':'good','area':'life','cond':4,'gold':5,'xp':6,'marble':''},{'id':'x1','name':'어항 정리','type':'good','area':'life','cond':4,'gold':2,'xp':10,'marble':'','once':'1'},{'id':'b1','name':'과음','type':'bad','area':'body','cond':-30,'gold':-40,'xp':0},{'id':'b4','name':'피드·쇼츠 1시간 넘게','type':'bad','area':'mind','cond':-14,'gold':0,'xp':0},{'id':'b7','name':'충동구매','type':'bad','area':'life','cond':-10,'gold':-60,'xp':0}],
   'courage':[{'id':'k1','name':'지원서·이력서를 냈다','xp':90,'gold':30,'pts':3,'area':'life','cond':6,'marble':'try:courage'},{'id':'k9','name':'면접 보기','xp':90,'gold':30,'pts':3,'area':'life','cond':6,'marble':'try:courage','once':'1'}],
   'ui':{'skin':'forest','mode':'light','list':{'filter':'good','group':'area','sort':'manual'},'nav':['home','log','jars','stats'],'home':[['profile',1],['brave',1],['quick',1],['sugg',1],['quests',1],['alerts',1],['todaylog',1]],'collapsed':{}},'tourSeen':True},
 'game/progress':{'xp':520,'gold':300,'courage':3,'marbles':{'done':['fit','fit']},'badges':{}},
 'days/'+dk(-2):{'date':dk(-2),'energy':3,'food':{},'weight':None,'entries':[{'id':'e1','t':'23:10','kind':'act','aid':'b1','type':'bad','name':'과음','area':'body','cond':-30,'gold':-40,'xp':0}]},
 'days/'+dk(-1):{'date':dk(-1),'energy':3,'food':{},'weight':72.4,'entries':[{'id':'e2','t':'10:10','kind':'act','aid':'g1','type':'good','name':'운동','area':'body','cond':8,'gold':3,'xp':15,'jar':'done','mt':'fit'}]},
}
errs=[]
def run(pw,w,h,name):
    b=pw.chromium.launch()
    ctx=b.new_context(viewport={'width':w,'height':h},device_scale_factor=1,has_touch=w<600)
    pg=ctx.new_page()
    pg.on('console',lambda m: errs.append(f'[{name}] {m.type}: {m.text}') if m.type in ('error','warning') else None)
    pg.on('pageerror',lambda e: errs.append(f'[{name}] PAGEERROR {e}'))
    ctx.route('**/*',lambda r: r.abort() if ('gstatic' in r.request.url or 'googleapis' in r.request.url) else r.continue_())
    pg.add_init_script(path=SP+'mockdb.js')
    pg.goto(URL)
    pg.wait_for_timeout(300)
    pg.evaluate("s=>{__seed(s);__hqResolve(__mockApi);document.getElementById('gate').hidden=true}",seed)
    pg.wait_for_timeout(1200)
    return b,pg
with sync_playwright() as pw:
    b,pg=run(pw,390,844,'m')
    # 팝업 닫기
    pops=[]
    for i in range(6):
        if pg.is_visible('#levelup'):
            pops.append(pg.inner_text('#levelup .card')[:80].replace('\n',' '));pg.click('#luOk');pg.wait_for_timeout(250)
    print('popups:',pops)
    st=pg.evaluate("()=>({v:C.v,nav:C.ui.nav,home:C.ui.home.map(h=>h[0]).join(','),areas:C.areas.map(a=>a.id),acts:C.actions.map(a=>a.name+(a.opts?'['+a.opts.length+']':'')),cour:C.courage.map(k=>k.name),tasks:Object.values(TASKS).map(t=>t.title+(t.brave?'⚡':'')+':'+t.due),xp:P.xp,gold:P.gold,today:today().entries.map(e=>e.kind+':'+e.name+':'+e.xp)})")
    print(json.dumps(st,ensure_ascii=False,indent=0))
    pg.screenshot(path=SP+'m_home.png',full_page=True)
    # 할 일 빠른 추가
    pg.goto(URL+'#tasks');pg.wait_for_timeout(500)
    pg.fill('#tAdd','내일 3시 씨네스트 30분 #퀵 !! 매주 화')
    pg.wait_for_timeout(100);print('parse:',pg.inner_text('#tParse').replace('\n',' | '))
    pg.press('#tAdd','Enter');pg.wait_for_timeout(300)
    t=pg.evaluate("()=>Object.values(TASKS).find(t=>t.title==='씨네스트')")
    print('task:',json.dumps(t,ensure_ascii=False))
    for q in ['오늘 저녁 7시 반 장보기','모레 오전 10시 병원 1시간','11/20 수지 신협 ^Fixed','주 3회 운동하기','매월 10일 건강보험료 납부','다음주 금요일 ⚡ 지원서 내기 !!!','5일 뒤 머리 자르기','매일 밤 11시 일기','격주 토요일 이불 세탁','3일마다 환수 #어항']:
        print('  ',q,'=>',json.dumps(pg.evaluate("q=>{const p=parseQuick(q);return [p.title,p.due,p.time,p.dur,p.rep&&repLabel(p.rep),p.prio,p.tags.join(','),p.brave,p.list||p.listName]}",q),ensure_ascii=False))
    # 틱틱 가져오기
    pg.goto(URL+'#more');pg.wait_for_timeout(400)
    pg.set_input_files('#ttFile','/mnt/user-data/attachments/57fdb68d-e178-5526-84b7-bc52896b8430/fe175b1f-TickTick-backup-2026-11-02.csv')
    pg.wait_for_timeout(800)
    print('import box:',pg.inner_text('#ttBox')[:300].replace('\n',' '))
    pg.screenshot(path=SP+'m_import.png',full_page=False)
    pg.click('#ttGo');pg.wait_for_timeout(1500)
    info=pg.evaluate("()=>{const ts=Object.values(TASKS);return{n:ts.length,open:ts.filter(t=>t.status===0).length,lists:C.lists.length,rep:ts.filter(t=>t.rep).map(t=>t.title+' ['+repLabel(t.rep)+'] '+t.due).slice(0,30),subs:ts.filter(t=>t.subs&&t.subs.length).map(t=>t.title+':'+t.subs.length).slice(0,10),timed:ts.filter(t=>t.time).map(t=>t.title+' '+t.due+' '+t.time+' '+t.dur),hist:ts.filter(t=>t.hist).map(t=>t.title+':'+t.hist.n).slice(0,12),store:[...__store.keys()].filter(k=>k.includes('/tasks/')).length}}")
    print(json.dumps(info,ensure_ascii=False,indent=0))
    pg.screenshot(path=SP+'m_tasks.png',full_page=False)
    pg.screenshot(path=SP+'m_tasks_full.png',full_page=True)
    open(SP+'state.json','w').write(json.dumps({'errs':errs},ensure_ascii=False))
    # 할 일 완료
    x0=pg.evaluate('P.xp')
    pg.locator('#tList .trow .tchk').first.click();pg.wait_for_timeout(400)
    print('after done xp',x0,'->',pg.evaluate('P.xp'),'snack:',pg.inner_text('#snack') if pg.is_visible('#snack') else None)
    pg.click('#snack [data-snack="n3"]');pg.wait_for_timeout(400)
    print('after x3 :',pg.evaluate("()=>{const e=today().entries.find(e=>e.tid);return e&&[e.name,e.n,e.xp,e.gold]}"),'xp',pg.evaluate('P.xp'))
    # 샤워 (세부 옵션)
    pg.goto(URL+'#log');pg.wait_for_timeout(400)
    sh=pg.evaluate("C.actions.find(a=>a.name==='샤워').id")
    pg.click(f'[data-act="{sh}"]');pg.wait_for_timeout(300)
    print('sheet visible',pg.is_visible('#sheet'),pg.inner_text('#sheetC')[:200].replace('\n',' | '))
    pg.screenshot(path=SP+'m_sheet.png')
    pg.click('[data-sopt="v1"]');pg.click('[data-sn="1"]');pg.wait_for_timeout(100)
    pg.click('[data-sheet="ok"]');pg.wait_for_timeout(300)
    print('shower entry:',pg.evaluate("()=>{const e=today().entries[0];return [e.name,e.n,e.xp,e.cond,e.jar]}"))
    # 술 두 번
    pg.click('[data-lfilter="bad"]');pg.wait_for_timeout(200)
    for i in range(2):
        pg.click('[data-act="b1"]');pg.wait_for_timeout(250);pg.click('[data-sopt="v2"]');pg.wait_for_timeout(100)
        print(' drink preview',pg.inner_text('#sxPrev').replace('\n',' '));pg.click('[data-sheet="ok"]');pg.wait_for_timeout(300)
    print('drinks:',pg.evaluate("()=>today().entries.filter(e=>e.aid==='b1').map(e=>[e.name,e.cond,e.gold,e.mult])"))
    # 기록 고치기
    pg.locator('#log li[data-entry]').first.click();pg.wait_for_timeout(300)
    print('edit sheet:',pg.inner_text('#sheetC')[:160].replace('\n',' | '))
    pg.click('[data-sopt="v1"]');pg.wait_for_timeout(100);pg.click('[data-sheet="save"]');pg.wait_for_timeout(300)
    print('after edit:',pg.evaluate("()=>today().entries.filter(e=>e.aid==='b1').map(e=>[e.name,e.cond,e.gold,e.mult])"))
    pg.screenshot(path=SP+'m_log.png',full_page=True)
    # 캘린더
    pg.goto(URL+'#cal');pg.wait_for_timeout(500);pg.click('[data-calmode="month"]');pg.wait_for_timeout(300);pg.screenshot(path=SP+'m_cal.png',full_page=True)
    pg.click('[data-calmode="week"]');pg.wait_for_timeout(400);pg.screenshot(path=SP+'m_week.png',full_page=False)
    # 가챠
    pg.goto(URL+'#gacha');pg.wait_for_timeout(400)
    pg.click('#gDraw');pg.wait_for_timeout(400);pg.click('[data-gflipall]');pg.wait_for_timeout(700)
    pg.screenshot(path=SP+'m_gacha.png',full_page=True)
    pg.locator('[data-gpick]').first.click();pg.wait_for_timeout(300)
    if pg.is_visible('#levelup'):pg.click('#luOk')
    q=pg.evaluate('C.gacha.quest');print('quest',q)
    x0=pg.evaluate('P.xp');pg.click('#gQuest [data-qgo="timer"]');pg.wait_for_timeout(2200)
    pg.screenshot(path=SP+'m_hunt.png')
    pg.click('[data-hunt="done"]');pg.wait_for_timeout(500)
    if pg.is_visible('#sheet'):pg.click('[data-sheet="ok"]');pg.wait_for_timeout(300)
    for i in range(4):
        if pg.is_visible('#levelup'):print(' pop:',pg.inner_text('#levelup .card').replace('\n',' ')[:100]);pg.click('#luOk');pg.wait_for_timeout(250)
    print('quest after',pg.evaluate('C.gacha.quest'),'xp',x0,'->',pg.evaluate('P.xp'),pg.evaluate("()=>{const e=today().entries[0];return [e.kind,e.name,e.xp,e.spd,e.gq,e.dur]}"))
    # 루틴
    pg.click('#gRoutines [data-rrun="r-morning"]');pg.wait_for_timeout(300)
    pg.fill('#huntW','72.1')
    for i in range(8):
        pg.click('[data-hunt="done"]' if i%3!=2 else '[data-hunt="skip"]');pg.wait_for_timeout(150)
    for i in range(4):
        if pg.is_visible('#levelup'):print(' pop:',pg.inner_text('#levelup .card').replace('\n',' ')[:140]);pg.click('#luOk');pg.wait_for_timeout(250)
    print('routine entry',pg.evaluate("()=>today().entries.filter(e=>e.kind==='routine').map(e=>[e.name,e.xp,e.note])"),'weight',pg.evaluate('today().weight'))
    pg.goto(URL+'#home');pg.wait_for_timeout(400);pg.screenshot(path=SP+'m_home2.png',full_page=True)
    b.close()
    # ---- PC: 끌어다 놓기 ----
    b,pg=run(pw,1280,900,'pc')
    for i in range(6):
        if pg.is_visible('#levelup'):pg.click('#luOk');pg.wait_for_timeout(200)
    pg.goto(URL+'#more');pg.wait_for_timeout(300)
    pg.set_input_files('#ttFile','/mnt/user-data/attachments/57fdb68d-e178-5526-84b7-bc52896b8430/fe175b1f-TickTick-backup-2026-11-02.csv');pg.wait_for_timeout(600);pg.click('#ttGo');pg.wait_for_timeout(1200)
    pg.goto(URL+'#cal');pg.wait_for_timeout(500);pg.click('[data-calmode="month"]');pg.wait_for_timeout(300)
    pg.screenshot(path=SP+'pc_month.png')
    it=pg.locator('#calTray .titem').first;name=it.inner_text().split('\n')[0]
    bb=it.bounding_box();cell=pg.locator('.mc[data-calday]').nth(17).bounding_box();tday=pg.locator('.mc[data-calday]').nth(17).get_attribute('data-calday')
    pg.mouse.move(bb['x']+20,bb['y']+10);pg.mouse.down();pg.mouse.move(bb['x']+40,bb['y']+30,steps=4);pg.mouse.move(cell['x']+30,cell['y']+40,steps=12);pg.wait_for_timeout(100);pg.mouse.up();pg.wait_for_timeout(400)
    print('drag tray->month',name,'->',tday,pg.evaluate("n=>{const t=Object.values(TASKS).find(t=>t.title.startsWith(n.trim()));return t&&[t.title,t.due,t.time]}",name))
    pg.click('[data-calmode="week"]');pg.wait_for_timeout(400)
    pg.click('[data-traytab="habit"]');pg.wait_for_timeout(200)
    it=pg.locator('#calTray .titem').first;bb=it.bounding_box();col=pg.locator('.tgcol').nth(3).bounding_box()
    sc=pg.evaluate("$('tgScroll').scrollTop")
    pg.mouse.move(bb['x']+20,bb['y']+10);pg.mouse.down();pg.mouse.move(bb['x']+40,bb['y']+30,steps=4);pg.mouse.move(col['x']+30,col['y']+sc+200,steps=14);pg.wait_for_timeout(100)
    pg.screenshot(path=SP+'pc_dragging.png');pg.mouse.up();pg.wait_for_timeout(400)
    print('drag habit->week',pg.evaluate("()=>Object.values(TASKS).filter(t=>t.aid&&t.time).map(t=>[t.title,t.due,t.time,t.dur])"))
    blk=pg.locator('.blk[data-ctask]').filter(has_text='운동').first;bb=blk.bounding_box();tid=blk.get_attribute('data-ctask')
    pg.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']-3);pg.mouse.down();pg.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']+60,steps=8);pg.mouse.up();pg.wait_for_timeout(300)
    print('resize',pg.evaluate("id=>[TASKS[id].title,TASKS[id].time,TASKS[id].dur]",tid))
    blk=pg.locator(f'.blk[data-ctask="{tid}"]');bb=blk.bounding_box();col=pg.locator('.tgcol').nth(5).bounding_box()
    pg.mouse.move(bb['x']+10,bb['y']+6);pg.mouse.down();pg.mouse.move(bb['x']+20,bb['y']+20,steps=3);pg.mouse.move(col['x']+20,bb['y']+100,steps=10);pg.mouse.up();pg.wait_for_timeout(300)
    print('move block',pg.evaluate("id=>[TASKS[id].title,TASKS[id].due,TASKS[id].time,TASKS[id].dur]",tid))
    pg.screenshot(path=SP+'pc_week.png')
    pg.goto(URL+'#tasks');pg.wait_for_timeout(400);pg.screenshot(path=SP+'pc_tasks.png')
    pg.locator('#tList .trow').first.click();pg.wait_for_timeout(300);pg.screenshot(path=SP+'pc_tasksheet.png')
    pg.click('[data-tsrep="x"]');pg.wait_for_timeout(200);print('rep x',pg.evaluate("()=>{const t=TASKS[sheetCtx.task];return [t.title,t.due,JSON.stringify(t.rep)]}"))
    pg.click('[data-sheet="close"]')
    pg.goto(URL+'#edit');pg.wait_for_timeout(200);pg.click('[data-etab="actions"]');pg.wait_for_timeout(300)
    h=pg.locator('.erow2 .hand').nth(0).bounding_box();t3=pg.locator('.erow2').nth(3).bounding_box()
    before=pg.evaluate("C.actions.map(a=>a.name).slice(0,5)")
    pg.mouse.move(h['x']+5,h['y']+5);pg.mouse.down();pg.mouse.move(h['x']+5,t3['y']+t3['height']-2,steps=10);pg.mouse.up();pg.wait_for_timeout(300)
    print('reorder',before,'->',pg.evaluate("C.actions.map(a=>a.name).slice(0,5)"))
    pg.screenshot(path=SP+'pc_edit.png')
    pg.fill('#aeQ','샤');pg.wait_for_timeout(400);print('search',pg.locator('.erow2').count(),pg.evaluate('document.activeElement.id'))
    pg.goto(URL+'#home');pg.wait_for_timeout(300);pg.screenshot(path=SP+'pc_home.png',full_page=True)
    open(SP+'state.json','w').write(json.dumps({'errs':errs},ensure_ascii=False))
    b.close()
print('\n'.join(errs[:40]))
