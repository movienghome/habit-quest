# t136 (v13.1): ○ 체크 고침(정한 날 칸) · 끝낸 자리(ct105·놓은 관리) · 체크 풀기 t.last · 관리 창 ✓ 오늘 한 관리·주 N회 n/N · 모든 블록 ○/✓ · 관리 창 띄우기·끌어 놓기·돌아오기
import os,json
os.environ.setdefault('HQURL','file:///home/claude/habit-quest/beta/index.html')
exec(open('/home/claude/habit-quest/dev/v5/h61.py').read())
URL=os.environ.get('HQURL',URL)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
J=lambda pg,x:pg.evaluate(x)
def notoast(pg):J(pg,"(()=>{const t=document.getElementById('toast');if(t){t.classList.remove('on');t.style.pointerEvents=''}})()")
def run2(pw,W,H,touch=False):
    b=pw.chromium.launch();kw=dict(viewport={'width':W,'height':H})
    if touch:kw.update(has_touch=True,is_mobile=True)
    ctx=b.new_context(**kw);ctx.add_init_script(MOCK+"\ntry{localStorage.clear()}catch(e){}\n"+("window.__coarse75=1;" if touch else ""))
    ctx.route('**/backend.js',lambda r:r.fulfill(body="window.__hqResolve(window.__mockApi)",content_type='application/javascript'))
    ctx.route('**/config.js',lambda r:r.fulfill(body="",content_type='application/javascript'))
    ctx.route('**/sw.js',lambda r:r.fulfill(body="",content_type='application/javascript'))
    pg=ctx.new_page();pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e)));pg.on('console',lambda m:errs.append('CON '+m.text) if m.type=='error' else None)
    pg.goto(URL);pg.wait_for_timeout(2300);closepops(pg);notoast(pg);return b,pg
def tap(pg,loc,touch):
    loc.scroll_into_view_if_needed();bb=loc.bounding_box()
    if touch:pg.touchscreen.tap(*ctr(bb))
    else:pg.mouse.click(*ctr(bb))
def calday(pg,off=0):
    J(pg,"location.hash='cal'");pg.wait_for_timeout(600)
    J(pg,f"(()=>{{C.ui.cal.mode='1day';ui.calAnchor=addDays(midKey68(),{off});save('config');renderCal()}})()");pg.wait_for_timeout(700);notoast(pg)
def T(pg,id):return json.loads(J(pg,f"JSON.stringify(TASKS[{json.dumps(id)}])"))
LAUNDRY="""(()=>{const td=midKey68();const t=addTaskFrom('빨래');Object.assign(t,{rep:{n:2,f:'x'},due:addDays(td,1),last:addDays(td,-1),cnt:2,wc:{n:1,w:'2026-11-09'},sl91:{[td]:'08:00',[addDays(td,1)]:''},dur:30,care76:1,cs126:{m:'08:00',pd:addDays(td,-2),d:addDays(td,1)},area:'life'});saveTask(t);return t.id})()"""
with sync_playwright() as pw:
  # ---------- ① 정한 날 칸(주 N회) 블록 ○ ----------
  for W,H,touch in [(1200,1000,False),(390,860,True)]:
    b,pg=run2(pw,W,H,touch);lid=J(pg,LAUNDRY);J(pg,"render()")
    calday(pg,1)
    loc=pg.locator('#calPane .blk .ck128').first
    ok(loc.count()==1,f'[{W}] ① 놓은 빨래(주 2회·정한 날) 블록에 ○')
    tap(pg,loc,touch);pg.wait_for_timeout(1000)
    t=T(pg,lid);ok(t.get('last')==J(pg,"midKey68()") and t['wc']['n']==1,f'[{W}] ① ○ = 바로 체크(이 날 창이 안 뜸)',t.get('wc'))
    ok(J(pg,"$('sheet').hidden"),f'[{W}] ① 날짜 창이 안 열림')
    ok(not errs,f'[{W}] ① 오류 없음',errs[:3]);errs.clear();b.close()
  # ---------- ② 놓은 관리 끝내면 그 자리 ✓ · ✓ 누르면 풀림 · t.last ----------
  for W,H,touch in [(1200,1000,False),(390,860,True)]:
    b,pg=run2(pw,W,H,touch)
    wid=J(pg,"(()=>{const t=addTaskFrom('주방 수건 세탁 %4');t.dur=30;t.due=addDays(midKey68(),-3);saveTask(t);place126(t,midKey68(),'08:00');saveTask(t);render();return t.id})()")
    calday(pg,0)
    tap(pg,pg.locator(f'#calPane .blk[data-ctask="{wid}"] .ck128').first,touch);pg.wait_for_timeout(1000)
    top=J(pg,f"(()=>{{const b=document.querySelector('#calPane .blk.done[data-ctask=\"{wid}\"]');return b?Math.round(parseFloat(b.style.top)):null}})()")
    exp=J(pg,"Math.round(yOf(toMin('08:00')))")
    ok(top==exp,f'[{W}] ② 끝낸 관리가 놓은 08:00 자리에 ✓ 블록으로 남음(종일 칸 아님)',(top,exp))
    ok(J(pg,f"!document.querySelector('#calPane .tgall .cchip[data-ctask=\"{wid}\"]')"),f'[{W}] ② 종일 칸엔 없음')
    un=pg.locator(f'#calPane .blk.done[data-ctask="{wid}"] [data-un129]').first
    ok(un.count()==1,f'[{W}] ② 끝낸 블록에 ✓ 단추')
    tap(pg,un,touch);pg.wait_for_timeout(1000)
    t=T(pg,wid);ok(t.get('last') is None and t['due']==J(pg,"midKey68()") and (t.get('cs126') or {}).get('m')=='08:00',f'[{W}] ② ✓ = 체크 풀기 · 마지막 한 날 지워지고 놓은 자리 되살아남',(t.get('last'),t['due'],t.get('cs126')))
    ok(J(pg,f"!!document.querySelector('#calPane .blk:not(.done)[data-ctask=\"{wid}\"] .ck128[data-tdone]')"),f'[{W}] ② 다시 ○ 블록으로')
    ok(J(pg,"$('sheet').hidden"),f'[{W}] ② 메뉴 없이 바로 풀림')
    ok(not errs,f'[{W}] ② 오류 없음',errs[:3]);errs.clear();b.close()
  # ---------- ③ 끝낸 일 끌어 옮기기(ct105)가 시간표에 보임 + 일반 블록 ○ ----------
  b,pg=run2(pw,1200,1000)
  qid=J(pg,"(()=>{const t=addTaskFrom('수질 점검');Object.assign(t,{rep:{i:1,f:'w',wd:[0]},due:addDays(midKey68(),-2)});saveTask(t);careOn77(t,t.rep);saveTask(t);ui.off=0;completeTask(t);return t.id})()")
  J(pg,"(()=>{const t=addTaskFrom('보고서 쓰기');t.due=midKey68();t.time='15:00';t.dur=60;saveTask(t);window.__r=t.id})()")
  calday(pg,0)
  ch=pg.locator(f'#calPane .tgall .cchip[data-ctask="{qid}"]').first
  ok(ch.count()==1,'③ 끝낸 관리(시각 없음)는 종일 칸 ✓ 칩')
  hy=J(pg,"(()=>{const c=document.querySelector('#calPane .tgcol');const r=c.getBoundingClientRect();return r.top+yOf(toMin('12:00'))})()")
  ch.scroll_into_view_if_needed();bb=ch.bounding_box();drag(pg,ctr(bb),(bb['x']+bb['width']/2,hy+4),steps=20);pg.wait_for_timeout(800)
  ok(J(pg,f"!!document.querySelector('#calPane .tgcol .blk.done[data-ctask=\"{qid}\"]')"),'③ 끌어 옮긴 끝낸 관리가 시간표 블록으로 보임(종일 칸으로 안 돌아감)')
  J(pg,"renderCal()");pg.wait_for_timeout(400)
  ok(J(pg,f"!!document.querySelector('#calPane .tgcol .blk.done[data-ctask=\"{qid}\"]')"),'③ 다시 그려도 그 자리')
  ok(J(pg,"!!document.querySelector(`#calPane .blk[data-ctask=\"${window.__r}\"] .ck128[data-tdone]`)"),'③ 일반 할 일 블록에도 ○')
  J(pg,"document.querySelector(`#calPane .blk[data-ctask=\"${window.__r}\"] .ck128`).click()");pg.wait_for_timeout(800)
  ok(J(pg,"TASKS[window.__r].status")==2,'③ 일반 블록 ○ = 끝냄')
  ok(J(pg,"$('sheet').hidden"),'③ 상세는 안 열림')
  J(pg,"location.hash='cal';C.ui.cal.mode='month';renderCal()");pg.wait_for_timeout(600)
  ok(J(pg,"!document.querySelector('#calPane .mgrid .ck128')"),'③ 월 칸엔 ○ 없음')
  ok(not errs,'③ 오류 없음',errs[:3]);errs.clear();b.close()
  # ---------- ④ 관리 창: ✓ 오늘 한 관리 · 주 N회 n/N · 체크 풀기 ----------
  for W,H,touch in [(1200,1000,False),(390,860,True)]:
    b,pg=run2(pw,W,H,touch);lid=J(pg,LAUNDRY)
    oid=J(pg,"(()=>{const t=addTaskFrom('옷장 정리 %7');t.due=addDays(midKey68(),-10);saveTask(t);location.hash='home';render();return t.id})()")
    pg.wait_for_timeout(500);J(pg,"careSheet76()");pg.wait_for_timeout(500)
    tap(pg,pg.locator('#sheetC .c76r',has_text='옷장').locator('.tchk').first,touch);pg.wait_for_timeout(900)
    ok(J(pg,"!$('sheet').hidden&&!!sheetCtx.c76"),f'[{W}] ④ 체크해도 관리 창은 그대로')
    ok(J(pg,"[...document.querySelectorAll('#sheetC .dn129 b')].some(b=>/옷장/.test(b.textContent))"),f'[{W}] ④ ✓ 오늘 한 관리 칸에 옷장 정리')
    J(pg,"document.querySelectorAll('#sheetC details').forEach(d=>d.open=true)")
    tap(pg,pg.locator('#sheetC .c76r:not(.dn129)',has_text='빨래').locator('.tchk').first,touch);pg.wait_for_timeout(900)
    ok(J(pg,"[...document.querySelectorAll('#sheetC .c76r:not(.dn129)')].some(r=>/빨래/.test(r.textContent)&&/이번 주 1\\/2/.test(r.textContent))"),f'[{W}] ④ 주 N회 줄에 이번 주 1/2',J(pg,"[...document.querySelectorAll('#sheetC .c76r')].map(r=>r.innerText.replace(/\\n/g,' ')).join(' // ')"))
    ok(J(pg,"[...document.querySelectorAll('#sheetC .dn129 b')].some(b=>/빨래/.test(b.textContent))"),f'[{W}] ④ 빨래도 오늘 한 관리에')
    tap(pg,pg.locator('#sheetC .dn129',has_text='옷장').locator('[data-un129]').first,touch);pg.wait_for_timeout(900)
    t=T(pg,oid);ok(t['due']==J(pg,"addDays(midKey68(),-10)") and t.get('last') is None,f'[{W}] ④ ✓ 누르면 체크 풀림(차례·마지막 한 날 되돌림)',(t['due'],t.get('last')))
    ok(J(pg,"![...document.querySelectorAll('#sheetC .dn129 b')].some(b=>/옷장/.test(b.textContent))"),f'[{W}] ④ 오늘 한 관리에서 빠짐')
    ok(not errs,f'[{W}] ④ 오류 없음',errs[:3]);errs.clear();b.close()
  # ---------- ⑤ 관리 창 띄우기·끌어 놓기·돌아오기 ----------
  for W,H,touch in [(1200,900,False),(390,860,True)]:
    b,pg=run2(pw,W,H,touch)
    oid=J(pg,"(()=>{const t=addTaskFrom('옷장 정리 %7');t.due=addDays(midKey68(),-10);t.dur=30;saveTask(t);location.hash='home';render();return t.id})()")
    pg.wait_for_timeout(500);J(pg,"careSheet76()");pg.wait_for_timeout(500)
    ok(J(pg,"!!document.querySelector('#sheetC [data-fl129]')"),f'[{W}] ⑤ 머리에 📌 띄우기')
    tap(pg,pg.locator('#sheetC [data-fl129]'),touch);pg.wait_for_timeout(1200)
    ok(J(pg,"location.hash")=='#cal',f'[{W}] ⑤ 캘린더로 감')
    ok(J(pg,"document.body.classList.contains('fl129')&&!$('sheet').hidden&&!!sheetCtx.c76"),f'[{W}] ⑤ 관리 창이 띄운 창으로 다시 열림')
    J(pg,"C.ui.cal.mode='1day';ui.calAnchor=midKey68();renderCal()");pg.wait_for_timeout(700);notoast(pg)
    ok(J(pg,"document.body.classList.contains('fl129')"),f'[{W}] ⑤ 다시 그려도 띄운 채')
    # 머리 끌기로 옮기기
    h=pg.locator('#sheetC > .sh h3');hb=h.bounding_box();sc0=J(pg,"(()=>{const r=$('sheetC').getBoundingClientRect();return [r.left,r.top]})()")
    if touch:
        J(pg,"window.scrollTo(0,0)")
    pg.mouse.move(*ctr(hb));pg.mouse.down();pg.mouse.move(hb['x']+10,hb['y']+20,steps=3);pg.mouse.move(hb['x']+10,hb['y']-120,steps=8);pg.mouse.up();pg.wait_for_timeout(300)
    sc1=J(pg,"(()=>{const r=$('sheetC').getBoundingClientRect();return [r.left,r.top]})()")
    ok(sc1[1]<sc0[1]-60,f'[{W}] ⑤ 머리를 끌면 창이 옮겨짐',(sc0,sc1))
    ok(J(pg,"!$('sheet').hidden"),f'[{W}] ⑤ 끌어도 안 닫힘')
    # 시간표가 띄운 창 밖에서 눌림(바깥 눌러도 안 닫힘) — 창을 아래로 다시 옮겨 시간표 자리 확보
    J(pg,"(()=>{const sc=$('sheetC');sc.style.top=(innerHeight-260)+'px';sc.style.height='250px'})()");pg.wait_for_timeout(200)
    J(pg,"(()=>{const s=document.getElementById('tgScroll');if(s)s.scrollTop=yOf(toMin('09:00'))})()");pg.wait_for_timeout(200)
    row=pg.locator('#sheetC .c76r',has_text='옷장').first;row.scroll_into_view_if_needed();rb=row.locator('.c76t').bounding_box()
    col=J(pg,"(()=>{const c=document.querySelector('#calPane .tgcol');const r=c.getBoundingClientRect();return [r.left+r.width/2,r.top+yOf(toMin('10:00'))+4,r.top,r.bottom]})()")
    a=ctr(rb)
    if touch:
        cdp=pg.context.new_cdp_session(pg)
        def tch(tp,x,y):cdp.send('Input.dispatchTouchEvent',{'type':tp,'touchPoints':[{'x':x,'y':y}] if tp!='touchEnd' else []})
        tch('touchStart',*a);pg.wait_for_timeout(650);steps=14
        for i in range(1,steps+1):tch('touchMove',a[0]+(col[0]-a[0])*i/steps,a[1]+(col[1]-a[1])*i/steps);pg.wait_for_timeout(25)
        pg.wait_for_timeout(150);tch('touchEnd',0,0)
    else:
        drag(pg,a,(col[0],col[1]),steps=20)
    pg.wait_for_timeout(900)
    t=T(pg,oid);ok((t.get('cs126') or {}).get('d')==J(pg,"midKey68()") and abs(int((t.get('cs126') or {}).get('m','0:0').split(':')[0])*60+int((t.get('cs126') or {}).get('m','0:0').split(':')[1])-600)<=60,f'[{W}] ⑤ 관리 창 줄을 시간표로 끌면 그 시각에 놓임',(t.get('cs126'),col))
    ok(J(pg,"!$('sheet').hidden&&!!(sheetCtx&&sheetCtx.c76)"),f'[{W}] ⑤ 놓은 뒤에도 관리 창 열림')
    ok(J(pg,"!document.body.classList.contains('dg129')"),f'[{W}] ⑤ 끌기 뒤 창 투명 풀림')
    # 줄 이름 → 상세 → 닫으면 관리 창으로
    J(pg,"document.querySelector('#sheetC .c76r .c76t[data-ctask]').click()");pg.wait_for_timeout(700)
    ok(J(pg,"!!(sheetCtx&&sheetCtx.task)"),f'[{W}] ⑤ 줄 이름 → 할 일 상세')
    ok(J(pg,"!!document.querySelector('#sheetC .tchips .pl129[data-pl126]')"),f'[{W}] ⑤ 관리 상세에 📌 이번 차례 놓기 칩',J(pg,"(document.querySelector('#sheetC .pl129')||{}).textContent"))
    J(pg,"closeSheet()");pg.wait_for_timeout(400)
    ok(J(pg,"!$('sheet').hidden&&!!(sheetCtx&&sheetCtx.c76)"),f'[{W}] ⑤ 상세 닫으면 관리 창으로 돌아옴')
    tap(pg,pg.locator('#sheetC [data-fl129]'),touch);pg.wait_for_timeout(400)
    ok(J(pg,"!document.body.classList.contains('fl129')&&!$('sheetC').style.left"),f'[{W}] ⑤ 📌 붙이기 = 가운데 창으로')
    J(pg,"closeSheet()");pg.wait_for_timeout(300)
    ok(J(pg,"$('sheet').hidden"),f'[{W}] ⑤ 관리 창 닫기는 그냥 닫힘')
    ok(not errs,f'[{W}] ⑤ 오류 없음',errs[:3]);errs.clear();b.close()
  # ---------- ⑥ 관리 놓기 시트: ○ · 이름=상세 · 끌기 속성 ----------
  b,pg=run2(pw,390,860,True)
  J(pg,"(()=>{['가가 %1','나나 %7'].forEach(s=>{const t=addTaskFrom(s);t.due=midKey68();saveTask(t)});location.hash='cal';render()})()");pg.wait_for_timeout(600)
  J(pg,"window.deck128()");pg.wait_for_timeout(500)
  ok(J(pg,"document.querySelectorAll('#sheetC .d128r .tchk[data-tdone]').length")==2,'⑥ 시트 줄마다 ○')
  ok(J(pg,"document.querySelectorAll('#sheetC .d128r[data-drag^=\"task:\"]').length")==2,'⑥ 시트 줄 끌기')
  J(pg,"document.querySelector('#sheetC .d128r .tchk').click()");pg.wait_for_timeout(700)
  ok(J(pg,"Object.values(TASKS).some(t=>/가가|나나/.test(t.title)&&t.last===midKey68())"),'⑥ 시트 ○ = 체크')
  ok(J(pg,"!!(sheetCtx&&sheetCtx.d128)"),'⑥ 시트는 그대로')
  J(pg,"(()=>{const i=document.getElementById('d128q');i.value='나';i.dispatchEvent(new Event('input',{bubbles:true}))})()");pg.wait_for_timeout(400)
  ok(J(pg,"document.querySelectorAll('#sheetC .d128r .tchk').length")==J(pg,"document.querySelectorAll('#sheetC .d128r').length"),'⑥ 찾기로 다시 그려도 ○')
  ok(not errs,'⑥ 오류 없음',errs[:3]);errs.clear();b.close()
  # ---------- ⑦ 예전 꼬인 '마지막 한 날' 바로잡기(한 번) ----------
  b,pg=run2(pw,1200,900)
  r=J(pg,"""(()=>{const t=addTaskFrom('거울 닦기 %7');t.last=midKey68();saveTask(t);const u=addTaskFrom('일반 반복 할 일');u.rep={f:'d',i:1};u.last=midKey68();saveTask(u);C.mig129=0;render();return JSON.stringify([t.last||null,u.last||null,C.mig129])})()""")
  r=json.loads(r);ok(r[0] is None and r[1] is not None and r[2]==1,'⑦ 관리만 기록 없는 마지막 한 날을 지움(일반 할 일은 그대로)',r)
  ok(not errs,'⑦ 오류 없음',errs[:3]);errs.clear();b.close()
print('FAILS',len(FAILS),FAILS)
