# t139 (v13.4): V1 오늘 순서·모두 내일로 · V2 날짜 없음(루틴 단계) · V3 🧽 입력 단추·머리줄 맞추기·⋯ 메뉴 · V4 경보도 끄기 · V5 기록 달력
#              · V6 관리 묶음 폴더 · V7 3일 하루씩·🙈 칩 없음 · V8 종일 칸
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
    pg.goto(URL);pg.wait_for_timeout(2300);closepops(pg);notoast(pg);return b,pg
def tap(pg,loc,touch):
    loc.wait_for(state='attached',timeout=8000);loc.evaluate("e=>e.scrollIntoView({block:'center'})");pg.wait_for_timeout(120);bb=loc.bounding_box()
    if touch:pg.touchscreen.tap(*ctr(bb))
    else:pg.mouse.click(*ctr(bb))
def T(pg,id):return json.loads(J(pg,f"JSON.stringify(TASKS[{json.dumps(id)}]||null)"))
def want(u):return not ONLY or u in ONLY
def noerr(tag):
    e=[x for x in errs if 'favicon' not in x];ok(not e,tag+' 오류 없음',e[:3]);errs.clear()
SIZES=[(1200,950,False),(390,860,True)]
SEED1="""(()=>{const td=midKey68();const mk=(n,d)=>{const t=newTask({title:n,due:d==null?null:addDays(td,d)});saveTask(t);return t};
  const L=[1,2,3,4,5].map(i=>mk('밀린'+i,-i).id);mk('오늘A',0);const nd=mk('마감만',null);nd.deadline=td;saveTask(nd);
  const c=newTask({title:'빨래'});careOn77(c,3);c.due=td;saveTask(c);
  const dn=mk('끝낸 일',-9);dn.status=2;dn.doneAt=td;saveTask(dn);const D=DAYS[td]=DAYS[td]||{date:td,entries:[]};D.entries=D.entries||[];
  D.entries.push({id:'e139',kind:'task',tid:dn.id,name:'끝낸 일',xp:0,gold:0,cond:0,t:Date.now()});
  delete C.tc131;render();return {late:L,care:c.id}})()"""
with sync_playwright() as pw:
  # ---------- V1 오늘 순서 · 모두 내일로 ----------
  if want('V1'):
   for W,H,touch in SIZES:
    b,pg=run2(pw,W,H,touch);ids=J(pg,SEED1)
    J(pg,"location.hash='tasks'");pg.wait_for_timeout(700);notoast(pg)
    kids=J(pg,"[...document.querySelectorAll('#tList > *')].map(x=>x.classList.contains('tc131')?'bar:'+[...x.querySelectorAll('[data-tc131]')].map(b=>b.dataset.tc131).join(','):x.classList.contains('q131')?'quest':x.classList.contains('tgroup')?'g:'+((x.querySelector(':scope>.ghead')||{}).dataset||{}).tgcollapse:x.className)")
    ok(kids[0]=='bar:late',f'[{W}] V1 ⏳ 밀린 칩은 맨 위(오늘보다 위)',kids)
    ok('g:d1' in kids and kids.index('g:d1')==1,f'[{W}] V1 그 밑에 오늘',kids)
    ok(kids[-1]=='bar:care,nd,done',f'[{W}] V1 🧽 관리·📥·✓ 끝냄 칩은 맨 아래, 끝냄이 마지막',kids)
    ok('quest' in kids and kids.index('quest')==kids.index('g:d1')+1,f'[{W}] V1 일퀘 줄은 오늘 바로 밑',kids)
    # 관리·끝냄 펼치면 맨 아래, 끝냄이 마지막
    tap(pg,pg.locator('#tList [data-tc131="done"]').first,touch);pg.wait_for_timeout(400)
    tap(pg,pg.locator('#tList [data-tc131="care"]').first,touch);pg.wait_for_timeout(400)
    order=J(pg,"[...document.querySelectorAll('#tList > .tp131')].map(x=>x.dataset.tp131)")
    last=J(pg,"(()=>{const L=document.getElementById('tList');const l=L.lastElementChild;return l&&l.dataset.tp131})()")
    ok(order==['care','done'] and last=='done',f'[{W}] V1 펼친 관리 → 끝냄 순, 끝냄이 목록 맨 끝',(order,last))
    # 밀린 펼치기 → 모두 내일로
    tap(pg,pg.locator('#tList [data-tc131="late"]').first,touch);pg.wait_for_timeout(400)
    ok(J(pg,"(()=>{const b=document.querySelector('#tList > .tc131.top132'),p=b&&b.nextElementSibling;return !!(p&&p.dataset.tp131==='late'&&p.querySelectorAll('.trow[data-task]').length===5)})()"),f'[{W}] V1 밀린 펼침은 칩 바로 밑(오늘 위)')
    ok(J(pg,"!!document.querySelector('#tList > .tc131.top132 [data-lt132]')"),f'[{W}] V1 펼친 밀린 칸 머리(칩 줄)에 📆 모두 내일로')
    tap(pg,pg.locator('#tList [data-lt132]').first,touch);pg.wait_for_timeout(600)
    tm=J(pg,"addDays(midKey68(),1)")
    ds=[T(pg,i) for i in ids['late']]
    ok(all(d['due']==tm and not d.get('skull') for d in ds),f'[{W}] V1 밀린 5개 → 내일, ☠ 없음',[(d['due'],d.get('skull')) for d in ds])
    ok('☠ 안 셈' in J(pg,"document.getElementById('toast').textContent"),f'[{W}] V1 알림 ☠ 안 셈')
    ok(J(pg,"!document.querySelector('#tList [data-tc131=\"late\"]')"),f'[{W}] V1 옮긴 뒤 밀린 칩 없음')
    J(pg,"(()=>{const b=document.querySelector('#toast .tbtn55');b&&b.click()})()");pg.wait_for_timeout(500)
    td=J(pg,"midKey68()")
    ok([T(pg,i)['due'] for i in ids['late']]==[J(pg,f"addDays(midKey68(),-{k})") for k in range(1,6)],f'[{W}] V1 되돌리기 → 원래 날짜')
    # ≤3 → 지난 할 일 묶음 맨 위 + 머리에 단추
    J(pg,f"(()=>{{{json.dumps(ids['late'])}.slice(0,2).forEach(id=>{{const t=TASKS[id];t.due=midKey68();saveTask(t)}});render()}})()");pg.wait_for_timeout(500)
    ok(J(pg,"(()=>{const g=document.querySelector('#tList > .tgroup');return !!(g&&g.querySelector(':scope>.ghead').dataset.tgcollapse==='d0'&&g.querySelector(':scope>[data-lt132]'))})()"),f'[{W}] V1 밀린 ≤3 → 맨 위 묶음 머리에 모두 내일로')
    tap(pg,pg.locator('#tList .tgroup.l132 [data-lt132]').first,touch);pg.wait_for_timeout(500)
    ok(all(T(pg,i)['due']==tm for i in ids['late'][2:]),f'[{W}] V1 ≤3 단추도 내일로')
    noerr(f'[{W}] V1');b.close()
  # ---------- V2 날짜 없음 빈 칸(루틴 단계) ----------
  if want('V2'):
   for W,H,touch in SIZES[:1]:
    b,pg=run2(pw,W,H,touch)
    J(pg,"(()=>{const td=midKey68();Object.values(TASKS).filter(t=>t.rid).forEach(t=>{t.due=td;t.rep={f:'d',i:1};saveTask(t)});C.ui.tasks.group='date';C.ui.tasks.sel='today';render()})()")
    J(pg,"location.hash='tasks'");pg.wait_for_timeout(700)
    gs=J(pg,"[...document.querySelectorAll('#tList .ghead[data-tgcollapse]')].map(x=>x.dataset.tgcollapse+':'+x.textContent.trim())")
    ok(not any(g.startswith('d9') for g in gs),f'[{W}] V2 오늘 화면에 빈 날짜 없음 묶음 없음(루틴 단계)',gs)
    ok(J(pg,"(()=>{const r=document.querySelector('#tList .trow.rt115');return !!r})()"),f'[{W}] V2 루틴 머리는 그대로')
    n=J(pg,"parseInt(document.getElementById('tCount').textContent)");rows=J(pg,"document.querySelectorAll('#tList .tgroup .trow[data-task]').length")
    ok(n==rows,f'[{W}] V2 개수 = 보이는 줄 수(단계 안 셈)',(n,rows))
    ok(J(pg,"(()=>{const r=document.querySelector('#tList .trow.rt115 [data-x56fold],#tList .trow.rt115 .tt');return !!r})()"),f'[{W}] V2 루틴 머리 줄 그대로')
    noerr(f'[{W}] V2');b.close()
  # ---------- V3 🧽 입력 단추 · 머리줄 · ⋯ ----------
  if want('V3'):
   for W,H,touch in [(1900,870,False),(1300,870,False),(1100,870,False),(390,860,True)]:
    b,pg=run2(pw,W,H,touch);J(pg,"location.hash='tasks'");pg.wait_for_timeout(700)
    r=J(pg,"(()=>{const i=document.getElementById('tAdd'),c=document.querySelector('form[data-taddform=tasks] .c106b');if(!i||!c)return null;const a=i.getBoundingClientRect(),b=c.getBoundingClientRect();return [Math.abs(a.top-b.top)<6,b.width<60,Math.round(b.width)]})()")
    ok(r and r[0] and r[1],f'[{W}] V3 🧽 단추는 입력칸과 같은 줄, 작게',r)
    o=J(pg,"(()=>{const p=document.getElementById('tTitle').parentElement,m=document.getElementById('tMenu');return [Math.round(m.getBoundingClientRect().right),Math.round(p.getBoundingClientRect().right),p.className]})()")
    ok(o[0]<=o[1]+1,f'[{W}] V3 머리줄 ⋯가 할 일 칸 밖으로 안 나감',o)
    sw=J(pg,"(()=>{const s=document.getElementById('tGroup');return s.offsetParent?Math.round(s.getBoundingClientRect().width):-1})()")
    ok(sw==-1 or sw>=50,f'[{W}] V3 묶기 칸은 다 보이거나 숨김(찌그러지지 않음)',sw)
    tap(pg,pg.locator('#tMenu'),touch);pg.wait_for_timeout(300)
    ok(J(pg,"!document.getElementById('m61').hidden && !!document.querySelector('#m61 [data-m132^=\"g|\"]')"),f'[{W}] V3 ⋯ 누르면 메뉴(묶기·정렬)')
    tap(pg,pg.locator('#m61 [data-m132="g|list"]'),touch);pg.wait_for_timeout(400)
    ok(J(pg,"C.ui.tasks.group")=='list' and J(pg,"document.getElementById('m61').hidden"),f'[{W}] V3 메뉴에서 목록별 → 묶기 바뀜',J(pg,"C.ui.tasks.group"))
    tap(pg,pg.locator('#tMenu'),touch);pg.wait_for_timeout(300)
    tap(pg,pg.locator('#m61 [data-m61]',has_text='여러 개 고르기').first,touch);pg.wait_for_timeout(400)
    ok(J(pg,"document.getElementById('tSelBtn').getAttribute('aria-pressed')")=='true' or J(pg,"!!(ui.msel&&ui.mselOn)||document.body.classList.contains('msel')||!!document.getElementById('mselBar')"),f'[{W}] V3 메뉴 → 여러 개 고르기 켜짐')
    noerr(f'[{W}] V3');b.close()
  # ---------- V4 경보도 끄기 ----------
  if want('V4'):
   for W,H,touch in SIZES:
    b,pg=run2(pw,W,H,touch)
    J(pg,"(()=>{const old=addDays(gk76(),-12);DAYS[old]={date:old,entries:[{id:'x1',kind:'act',aid:'zz',name:'아무거나',xp:1,gold:0,cond:0,t:Date.now()}]};C.dailies=C.dailies.filter(q=>!['g16'].includes(q.action));syncDailies&&syncDailies(C);nlClear69();render()})()")
    J(pg,"location.hash='tasks'");pg.wait_for_timeout(700);notoast(pg)
    tap(pg,pg.locator('#tList [data-c131="g16"]').first,touch);pg.wait_for_timeout(500)
    ok(J(pg,"!!document.querySelector('#toast.on .ab132')"),f'[{W}] V4 관리로 옮기기 알림에 🔕 경보도 끄기')
    J(pg,"document.querySelector('#toast .ab132').click()");pg.wait_for_timeout(500)
    ok(J(pg,"!C.watches.some(w=>w.action==='g16')"),f'[{W}] V4 누르면 그 경보 꺼짐')
    J(pg,"(()=>{const b=document.querySelector('#toast .tbtn55');b&&b.click()})()");pg.wait_for_timeout(400)
    ok(J(pg,"C.watches.some(w=>w.action==='g16')"),f'[{W}] V4 되돌리기 → 경보 다시')
    # 상세·메뉴의 관리로(careToggle76) 길
    nid=J(pg,"(()=>{const t=newTask({title:'가계부 정리',aid:'g13',rep:{f:'d',i:7},due:midKey68()});saveTask(t);render();return t.id})()")
    J(pg,f"careToggle76(TASKS['{nid}'])");pg.wait_for_timeout(400)
    ok(J(pg,"!!document.querySelector('#toast.on .ab132')"),f'[{W}] V4 careToggle76 길에도 🔕 단추')
    nid2=J(pg,"(()=>{const t=newTask({title:'아무 일'});saveTask(t);render();return t.id})()");notoast(pg)
    J(pg,f"careToggle76(TASKS['{nid2}'])");pg.wait_for_timeout(300)
    if J(pg,"!document.getElementById('m61').hidden"):
      tap(pg,pg.locator('#m61 [data-m61]').first,touch);pg.wait_for_timeout(300)
    ok(J(pg,"!document.querySelector('#toast .ab132')"),f'[{W}] V4 경보 없는 카드엔 단추 없음')
    noerr(f'[{W}] V4');b.close()
  # ---------- V5 ⚠ n일째 → 기록 달력 ----------
  if want('V5'):
   for W,H,touch in SIZES:
    b,pg=run2(pw,W,H,touch)
    hid=J(pg,"""(()=>{const k=gk76();[-12,-20,-40].forEach(o=>{const d=addDays(k,o);DAYS[d]={date:d,entries:[{id:'w'+o,kind:'act',aid:'g1',name:'운동',xp:1,gold:0,cond:0,t:Date.now()}]}});
      C.dailies=C.dailies.filter(q=>q.action!=='g1');syncDailies&&syncDailies(C);const h=newTask({title:'운동',aid:'g1',rep:{f:'w',i:1,wd:[0,1,2,3,4,5,6]},due:midKey68()});saveTask(h);nlClear69();render();return h.id})()""")
    J(pg,"location.hash='tasks'");pg.wait_for_timeout(800);notoast(pg)
    tg=pg.locator(f'#tList .trow[data-task="{hid}"] .a131').first
    ok(tg.count()>0 and '일째' in tg.text_content(),f'[{W}] V5 운동 줄 ⚠ 꼬리표')
    tap(pg,tg,touch);pg.wait_for_timeout(400)
    ok(J(pg,"!document.getElementById('m61').hidden && !!document.querySelector('#m61 .rc132')"),f'[{W}] V5 꼬리표 → 기록 달력')
    ok(not J(pg,"!!(sheetCtx&&sheetCtx.task)&&!document.getElementById('sheet').hidden"),f'[{W}] V5 상세는 안 열림')
    d12=J(pg,"addDays(gk76(),-12)")
    ok(J(pg,f"(()=>{{const c=[...document.querySelectorAll('#m61 .rc132d.ok')].map(x=>x.title);return c.some(t=>t.startsWith(fmtD('{d12}')))}})()") or d12[:7]!=J(pg,"gk76().slice(0,7)"),f'[{W}] V5 한 날 ✓ 표시')
    ok('12일 전' in J(pg,"document.querySelector('#m61 .rc132s').textContent"),f'[{W}] V5 마지막 n일 전',J(pg,"document.querySelector('#m61 .rc132s').textContent"))
    m0=J(pg,"document.querySelector('#m61 .rc132h b').textContent")
    tap(pg,pg.locator('#m61 [data-rc132="-1"]'),touch);pg.wait_for_timeout(300)
    ok(J(pg,"document.querySelector('#m61 .rc132h b').textContent")!=m0,f'[{W}] V5 ‹ 지난 달')
    noerr(f'[{W}] V5');b.close()
  # ---------- V6 관리 묶음 폴더 ----------
  if want('V6'):
   SEED6="""(()=>{const td=midKey68();const p=newTask({title:'집 청소'});careOn77(p,7);p.due=addDays(td,-7);saveTask(p);const ks=[];
     [['전자레인지 청소',0],['옷장 정리',-11],['선풍기 청소',-3],['방바닥 닦기',2]].forEach(([n,o])=>{const k=newTask({title:n});k.parent=p.id;careOn77(k,14);k.due=addDays(td,o);saveTask(k);ks.push(k.id)});
     render();return {p:p.id,k:ks}})()"""
   for W,H,touch in SIZES:
    b,pg=run2(pw,W,H,touch);ids=J(pg,SEED6)
    ok(J(pg,f"!careAll76().some(t=>t.id==='{ids['p']}') && !careDue76().some(t=>t.id==='{ids['p']}')"),f'[{W}] V6 묶음 머리는 관리 목록·차례에서 빠짐')
    ok(J(pg,f"careDue76().filter(t=>{json.dumps(ids['k'])}.includes(t.id)).length")==3,f'[{W}] V6 하위는 각자 차례(오늘·밀린 3개)')
    J(pg,"C.ui.tasks.sel='all';location.hash='tasks'");pg.wait_for_timeout(700);notoast(pg)
    row=J(pg,f"(()=>{{const r=document.querySelector('#tList .trow[data-task=\"{ids['p']}\"]');return r?r.querySelector('.tm').textContent:''}})()")
    ok('📦 4개' in row and '밀린 2' in row and '오늘 1' in row and '지남' not in row,f'[{W}] V6 목록 줄 = 📦 4개 · 밀린 2 · 오늘 1 (자기 밀림 없음)',row)
    tap(pg,pg.locator(f'#tList .trow[data-task="{ids["p"]}"] [data-f132]').first,touch);pg.wait_for_timeout(500)
    ok(T(pg,ids['p'])['due']==J(pg,"addDays(midKey68(),-7)") and '묶음' in J(pg,"document.getElementById('toast').textContent"),f'[{W}] V6 머리 ○는 끝내지 않고 안내')
    J(pg,"careSheet76()");pg.wait_for_timeout(600)
    ok(J(pg,f"!document.querySelector('#sheetC .d128r[data-d128r=\"{ids['p']}\"]')"),f'[{W}] V6 관리 창에 머리 줄 없음')
    ok('📦 집 청소' in J(pg,f"(document.querySelector('#sheetC .d128r[data-d128r=\"{ids['k'][1]}\"] small')||{{}}).textContent||''"),f'[{W}] V6 하위 줄에 📦 묶음 이름')
    tap(pg,pg.locator(f'#sheetC [data-f132c="{ids["p"]}"]'),touch);pg.wait_for_timeout(500)
    ok(J(pg,f"document.querySelectorAll('#sheetC .d128r[data-d128r]').length")==J(pg,f"careAll76().length")-4 and J(pg,f"C.care128.fh['{ids['p']}']===1"),f'[{W}] V6 📦 칩 → 하위 접힘')
    tap(pg,pg.locator(f'#sheetC [data-f132c="{ids["p"]}"]'),touch);pg.wait_for_timeout(500)
    ok(J(pg,f"!!document.querySelector('#sheetC .d128r[data-d128r=\"{ids['k'][1]}\"]')"),f'[{W}] V6 다시 → 펴짐')
    J(pg,"closeSheet()")
    # 하위를 다 빼면 원래 관리로
    J(pg,f"(()=>{{{json.dumps(ids['k'])}.forEach(id=>{{delete TASKS[id].parent;saveTask(TASKS[id])}});render()}})()")
    ok(J(pg,f"careAll76().some(t=>t.id==='{ids['p']}')"),f'[{W}] V6 하위가 없으면 다시 보통 관리')
    noerr(f'[{W}] V6');b.close()
  # ---------- V7 3일 하루씩 · 🙈 칩 없음 ----------
  if want('V7'):
   for W,H,touch in [(1900,870,False),(1300,870,False)]:
    b,pg=run2(pw,W,H,touch)
    for hs in ['cal','tasks']:
      J(pg,f"location.hash='{hs}'");pg.wait_for_timeout(700);J(pg,"C.ui.cal.mode='3day';ui.calAnchor=midKey68();renderCal()");pg.wait_for_timeout(300)
      a0=J(pg,"ui.calAnchor");t0=J(pg,"document.getElementById('calTitle').textContent")
      pg.locator('#calPane [data-calnav="1"]').first.click();pg.wait_for_timeout(300)
      ok(J(pg,"ui.calAnchor")==J(pg,f"addDays('{a0}',1)"),f'[{W}/{hs}] V7 3일 › = 하루 뒤',(t0,J(pg,"document.getElementById('calTitle').textContent")))
      pg.locator('#calPane [data-calnav="-1"]').first.click();pg.wait_for_timeout(200);pg.locator('#calPane [data-calnav="-1"]').first.click();pg.wait_for_timeout(300)
      ok(J(pg,"ui.calAnchor")==J(pg,f"addDays('{a0}',-1)"),f'[{W}/{hs}] V7 3일 ‹ = 하루 앞')
    J(pg,"C.ui.cal.mode='week';renderCal()");a0=J(pg,"ui.calAnchor");pg.locator('#calPane [data-calnav="1"]').first.click();pg.wait_for_timeout(300)
    ok(J(pg,"ui.calAnchor")==J(pg,f"addDays('{a0}',7)"),f'[{W}] V7 주 보기는 그대로 7일')
    J(pg,"(()=>{const t=newTask({title:'숨길 일',due:midKey68(),list:'inbox'});saveTask(t);const f=flt77();f.lists=['inbox'];f.inv=1;save('config');C.ui.cal.mode='3day';renderCal()})()");pg.wait_for_timeout(300)
    ok(J(pg,"(()=>{const b=document.querySelector('#calPane .h72');return !b||!b.offsetParent})()"),f'[{W}] V7 🙈 n개 숨김 칩 안 보임')
    noerr(f'[{W}] V7');b.close()
  # ---------- V8 종일 칸 ----------
  if want('V8'):
   for W,H,touch in [(1900,870,False),(1300,870,False)]:
    b,pg=run2(pw,W,H,touch)
    J(pg,"(()=>{const td=midKey68();for(let i=0;i<9;i++){const t=newTask({title:'종일'+i,due:td});saveTask(t)}C.ui.cal.mode='3day';ui.calAnchor=td;delete C.ui.cal.allH;render()})()")
    J(pg,"location.hash='tasks'");pg.wait_for_timeout(800)
    Hh="(()=>{const a=document.querySelector('#calPane .tgall');return Math.round(a.getBoundingClientRect().height)})()"
    h0=J(pg,Hh);ok('▾' in J(pg,"document.querySelector('#calPane .alltog').textContent"),f'[{W}] V8 넘치면 ▾ 표시',h0)
    pg.locator('#calPane .alltog').click();pg.wait_for_timeout(300);h1=J(pg,Hh)
    ok(h1>h0+20 and '▴' in J(pg,"document.querySelector('#calPane .alltog').textContent"),f'[{W}] V8 누르면 다 펴짐',(h0,h1))
    pg.locator('#calPane .alltog').click();pg.wait_for_timeout(300)
    ok(abs(J(pg,Hh)-h0)<3,f'[{W}] V8 다시 누르면 접힘',J(pg,Hh))
    def dragrz(dy):
      bb=pg.locator('#calPane .allrz').bounding_box();x,y=bb['x']+bb['width']/2,bb['y']+bb['height']/2
      pg.mouse.move(x,y);pg.mouse.down();pg.mouse.move(x,y+dy/2,steps=4);pg.mouse.move(x,y+dy,steps=4);pg.mouse.up();pg.wait_for_timeout(350)
    dragrz(-50);h2=J(pg,Hh);ok(h2<h0-30,f'[{W}] V8 손잡이 끌어 줄이기',(h0,h2))
    dragrz(70);h3=J(pg,Hh);ok(h3>h2+40,f'[{W}] V8 한 번 더 끌어 늘리기(두 번째도 됨)',(h2,h3))
    dragrz(-40);h4=J(pg,Hh);ok(h4<h3-25,f'[{W}] V8 세 번째도 됨',(h3,h4))
    ok(abs(J(pg,"C.ui.cal.allH")-h4)<4,f'[{W}] V8 높이 저장',(J(pg,"C.ui.cal.allH"),h4))
    J(pg,"render()");pg.wait_for_timeout(300);ok(abs(J(pg,Hh)-h4)<4,f'[{W}] V8 다시 그려도 그 높이')
    pg.locator('#calPane .alltog').click();pg.wait_for_timeout(300);ok(J(pg,Hh)>h4+20,f'[{W}] V8 줄인 뒤에도 ▾로 다 펴짐')
    noerr(f'[{W}] V8');b.close()
print('\nFAILS',len(FAILS));[print(' -',f) for f in FAILS]
