# t138 (v13.3): U3 방치 경보 정리 · U4 할 일 오늘 칩 한 줄 · U5 ⏩ 미루기 ☠ 칸 · U6 보이기·숨기기 둘로
import os,json,sys
os.environ.setdefault('HQURL','file:///home/claude/habit-quest/beta/index.html')
exec(open('/home/claude/habit-quest/dev/v5/h61.py').read())
URL=os.environ.get('HQURL',URL)
ONLY=sys.argv[1:]  # 예: python3 t138.py U3 U5
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
SIZES=[(1200,950,False),(390,860,True)]
# 기본 경보: g1 운동 4일 · g9 시나리오 3일 · g16 집 정리 7일 · g13 가계부 7일. 12일 전에 아무 기록 하나 → 모두 12일째쯤
SEED3="""(()=>{const old=addDays(gk76(),-12);DAYS[old]={date:old,entries:[{id:'x1',kind:'act',aid:'zz',name:'아무거나',xp:1,gold:0,cond:0,t:Date.now()}]};
  C.dailies=C.dailies.filter(q=>!['g1','g9','g13','g16'].includes(q.action));syncDailies&&syncDailies(C);
  const h=newTask({title:'운동',aid:'g1',rep:{f:'w',i:1,wd:[0,1,2,3,4,5,6]},due:midKey68()});saveTask(h);
  const c=newTask({title:'가계부 정리',aid:'g13'});careOn77(c,7);c.due=midKey68();saveTask(c);
  C.tc131={care:1};nlClear69();render();return {h:h.id,c:c.id}})()"""
with sync_playwright() as pw:
  # ---------- U3 ----------
  if want('U3'):
   for W,H,touch in SIZES:
    b,pg=run2(pw,W,H,touch);ids=J(pg,SEED3)
    J(pg,"location.hash='tasks'");pg.wait_for_timeout(700);notoast(pg)
    sec=J(pg,"[...document.querySelectorAll('#tList .trow.hab[data-hab]')].map(x=>x.dataset.hab)")
    ok('g1' not in sec and 'g13' not in sec,f'[{W}] U3 이어진 습관(운동)·관리(가계부)는 경보 칸에서 빠짐',sec)
    ok('g16' in sec,f'[{W}] U3 이어진 게 없는 집 정리는 경보 칸에 남음',sec)
    ok(J(pg,"!!document.querySelector('#tList .trow.hab[data-hab=\"g16\"] [data-c131=\"g16\"]')"),f'[{W}] U3 남은 줄에 🧽 관리로 옮기기')
    tg=J(pg,f"(document.querySelector('#tList .trow[data-task=\"{ids['h']}\"] .a131')||{{}}).textContent||''")
    ok(tg.startswith('⚠') and '일째' in tg,f'[{W}] U3 운동 습관 줄에 ⚠ n일째 꼬리표',tg)
    sec_n=J(pg,"(()=>{const r=document.querySelector('#tList .trow.hab[data-hab=\"g16\"] .tm');return r?r.textContent:''})()")
    tgc=J(pg,f"(document.querySelector('#tList .c76c [data-ctask=\"{ids['c']}\"] .a131')||{{}}).textContent||''")
    ok('일째' in tgc,f'[{W}] U3 관리 칩(가계부 정리)에 경보 꼬리표',tgc)
    import re
    n1=re.findall(r'(\d+)일째',tg);n2=re.findall(r'(\d+)일째',sec_n)
    ok(n1 and n2 and n1[0]==n2[0],f'[{W}] U3 꼬리표와 경보 칸 날수가 같음(새벽에도)',(n1,n2))
    # 관리로 옮기기
    tap(pg,pg.locator('#tList [data-c131="g16"]').first,touch);pg.wait_for_timeout(700)
    nt=J(pg,"JSON.stringify(Object.values(TASKS).filter(t=>t.aid==='g16'&&t.status===0))");nt=json.loads(nt)
    ok(len(nt)==1 and nt[0].get('care76') and nt[0]['rep']=={'f':'d','i':7} and nt[0]['due']==J(pg,"midKey68()"),f'[{W}] U3 관리로 옮기기 → 7일마다 관리, 오늘 차례',nt[:1])
    ok(J(pg,"!document.querySelector('#tList .trow.hab[data-hab=\"g16\"]')"),f'[{W}] U3 옮긴 뒤 경보 칸에서 빠짐')
    nid=nt[0]['id'] if nt else ''
    pg.wait_for_timeout(200)
    ok('일째' in J(pg,f"(document.querySelector('#tList .c76c [data-ctask=\"{nid}\"] .a131')||{{}}).textContent||''"),f'[{W}] U3 새 관리 칩에 경보 꼬리표')
    ok(J(pg,"JSON.stringify(C.watches.map(w=>w.action))")==J(pg,"JSON.stringify(['g1','g9','g16','g13','@courage'])") and J(pg,"C.actions.find(a=>a.id==='g16').name")=='집 정리 15분',f'[{W}] U3 경보·카드는 그대로(자동 변경 없음)')
    # 되돌리기
    J(pg,"(()=>{const b=document.querySelector('#toast .tbtn55');b&&b.click()})()");pg.wait_for_timeout(500)
    ok(not T(pg,nid) and J(pg,"!!document.querySelector('#tList .trow.hab[data-hab=\"g16\"]')"),f'[{W}] U3 되돌리기 → 관리 지우고 경보 칸에 다시')
    # 홈도 같게
    J(pg,"location.hash='home'");pg.wait_for_timeout(700)
    hs=J(pg,"[...document.querySelectorAll('#htList .trow.hab[data-hab]')].map(x=>x.dataset.hab)")
    ok('g1' not in hs and 'g16' in hs and J(pg,"!!document.querySelector('#htList [data-c131=\"g16\"]')"),f'[{W}] U3 홈 오늘 칸도 같은 규칙',hs)
    # 관리 창 줄 꼬리표
    J(pg,f"careSheet76()");pg.wait_for_timeout(600)
    ok('일째' in J(pg,f"(document.querySelector('#sheetC .d128r[data-d128r=\"{ids['c']}\"] .a131')||{{}}).textContent||''"),f'[{W}] U3 관리 창 줄에 경보 꼬리표')
    J(pg,"closeSheet()")
    e=[x for x in errs if 'favicon' not in x];ok(not e,f'[{W}] U3 오류 없음',e[:3]);errs.clear()
    b.close()
  # ---------- U4 ----------
  if want('U4'):
   SEED4="""(()=>{const td=midKey68();const mk=(n,d)=>{const t=newTask({title:n,due:d==null?null:addDays(td,d)});saveTask(t);return t};
     const L=[1,2,3,4,5].map(i=>mk('밀린'+i,-i).id);mk('오늘A',0);mk('오늘B',0);const nd=mk('마감만',null);nd.deadline=td;saveTask(nd);
     const c=newTask({title:'빨래'});careOn77(c,3);c.due=td;saveTask(c);
     const dn=mk('끝낸 일',-9);dn.status=2;dn.doneAt=td;saveTask(dn);const D=DAYS[td]=DAYS[td]||{date:td,entries:[]};D.entries=D.entries||[];
     D.entries.push({id:'e131',kind:'task',tid:dn.id,name:'끝낸 일',xp:0,gold:0,cond:0,t:Date.now()});
     delete C.tc131;render();return {late:L,care:c.id}})()"""
   for W,H,touch in SIZES:
    b,pg=run2(pw,W,H,touch);ids=J(pg,SEED4)
    J(pg,"location.hash='tasks'");pg.wait_for_timeout(700);notoast(pg)
    chips=J(pg,"[...document.querySelectorAll('#tList .tc131 [data-tc131]')].map(x=>x.dataset.tc131+':'+x.textContent.replace(/[▸▾]/g,'').trim())")
    ok([c.split(':')[0] for c in chips]==['late','care','nd','done'],f'[{W}] U4 칩 한 줄 순서 ⏳·🧽·📥·✓',chips)
    ok('밀린 5' in chips[0] and '날짜 없음 1' in chips[2] and '끝냄 1' in chips[3],f'[{W}] U4 칩 숫자',chips)
    ok(J(pg,"document.querySelectorAll('#tList .tc131').length")==1 and J(pg,"document.querySelectorAll('#tList .tc131 button').length")==4,f'[{W}] U4 칩은 한 줄만')
    vis=J(pg,"[...document.querySelectorAll('#tList .trow[data-task]')].map(x=>x.querySelector('.tt')?x.querySelector('.tt').textContent.trim():'')")
    ok(not any('밀린' in v or '마감만' in v for v in vis) and any('오늘A' in v for v in vis),f'[{W}] U4 기본은 오늘만 펼침',vis)
    ok(J(pg,"!document.querySelector('#tList > .care76') && !document.querySelector('#tList .tcomp')"),f'[{W}] U4 관리 줄·끝냄도 기본은 접힘')
    q=J(pg,"(()=>{const r=document.querySelector('#tList > .q131'),b=document.querySelector('#tList .tc131');return [!!r,r?r.querySelectorAll('.c76c.q [data-tdone]').length:0,!!(r&&b&&r.nextElementSibling===b),r?!!r.querySelector('.c76c:not(.q)'):1]})()")
    ok(q[0] and q[1]>0 and q[2] and not q[3],f'[{W}] U4 일퀘 칩(☑)은 접지 않고 오늘 바로 밑 한 줄(관리 칩 없이)',q)
    bb=J(pg,"(()=>{const r=document.querySelector('#tList .tc131').getBoundingClientRect();return [r.height,document.querySelector('#tList .tc131').scrollWidth<=document.querySelector('#tList .tc131').clientWidth+1]})()")
    ok(bb[0]<48,f'[{W}] U4 칩 줄 높이 한 줄',bb)
    # ⏳ 펼치기
    tap(pg,pg.locator('#tList [data-tc131="late"]').first,touch);pg.wait_for_timeout(500)
    ok(J(pg,"document.querySelectorAll('#tList .tp131[data-tp131=\"late\"] .trow[data-task]').length")==5,f'[{W}] U4 ⏳ 누르면 그 자리에서 밀린 5개 펼침')
    ok(J(pg,"(()=>{const b=document.querySelector('#tList .tc131'),p=document.querySelector('#tList .tp131');return !!(b&&p&&b.nextElementSibling===p)})()"),f'[{W}] U4 펼친 칸은 칩 줄 바로 밑')
    ok(J(pg,"C.tc131&&C.tc131.late===1&&normConfig(JSON.parse(JSON.stringify(C))).tc131.late===1"),f'[{W}] U4 펼침 상태 저장(normConfig가 보존)')
    J(pg,"render()");pg.wait_for_timeout(400)
    ok(J(pg,"document.querySelectorAll('#tList .tp131[data-tp131=\"late\"] .trow[data-task]').length")==5,f'[{W}] U4 다시 그려도 펼친 채')
    # 펼친 밀린 줄 체크 → 끝냄 숫자 +1
    tap(pg,pg.locator(f'#tList .tp131 .trow[data-task="{ids["late"][0]}"] .tchk').first,touch);pg.wait_for_timeout(1900);notoast(pg)
    ok(J(pg,f"TASKS['{ids['late'][0]}'].status")!=0 or J(pg,"(document.querySelector('#tList [data-tc131=\"late\"]')||{}).textContent||''").find('밀린 4')>=0,f'[{W}] U4 펼친 칸에서 체크 됨')
    # 🧽 펼치기 → 관리 칩, 머리 누르면 관리 창
    tap(pg,pg.locator('#tList [data-tc131="care"]').first,touch);pg.wait_for_timeout(500)
    ok(J(pg,f"!!document.querySelector('#tList .tp131[data-tp131=\"care\"] .c76c [data-ctask=\"{ids['care']}\"]')"),f'[{W}] U4 🧽 펼치면 관리 줄(○로 바로 체크)')
    notoast(pg);tap(pg,pg.locator('#tList .tp131 .c76h[data-c76open]:not(.hid131)').first,touch);pg.wait_for_timeout(600)
    ok(J(pg,"!!(sheetCtx&&sheetCtx.d128)"),f'[{W}] U4 펼친 관리 줄 머리 → 하나로 합친 관리 창')
    J(pg,"closeSheet()");pg.wait_for_timeout(300)
    # 📥·✓
    tap(pg,pg.locator('#tList [data-tc131="nd"]').first,touch);pg.wait_for_timeout(400)
    tap(pg,pg.locator('#tList [data-tc131="done"]').first,touch);pg.wait_for_timeout(400)
    ok(J(pg,"!!document.querySelector('#tList .tp131[data-tp131=\"nd\"] .trow[data-task]') && !!document.querySelector('#tList .tp131[data-tp131=\"done\"] .trow.done')"),f'[{W}] U4 📥·✓ 펼침')
    order=J(pg,"[...document.querySelectorAll('#tList .tp131')].map(x=>x.dataset.tp131)")
    ok(order==['late','care','nd','done'],f'[{W}] U4 펼친 칸 순서 = 칩 순서',order)
    # 접기
    tap(pg,pg.locator('#tList [data-tc131="late"]').first,touch);pg.wait_for_timeout(400)
    ok(J(pg,"!document.querySelector('#tList .tp131[data-tp131=\"late\"]') && !C.tc131.late"),f'[{W}] U4 다시 누르면 접힘')
    # 밀린 ≤3 → 칩 없이 오늘 맨 위
    J(pg,f"(()=>{{{json.dumps(ids['late'])}.slice(1,3).forEach(id=>{{const t=TASKS[id];t.due=midKey68();saveTask(t)}});render()}})()");pg.wait_for_timeout(500)
    first=J(pg,"(()=>{const g=document.querySelector('#tList > .tgroup');return g?g.querySelector('.ghead').dataset.tgcollapse:''})()")
    ok(first=='d0' and J(pg,"!document.querySelector('#tList [data-tc131=\"late\"]')"),f'[{W}] U4 밀린 3개 이하 → 칩 없이 오늘 맨 위',first)
    # 다른 목록은 그대로
    J(pg,"C.ui.tasks.sel='overdue';render()");pg.wait_for_timeout(400)
    ok(J(pg,"!document.querySelector('#tList .tc131')"),f'[{W}] U4 다른 목록(지난 것)엔 칩 줄 없음')
    J(pg,"C.ui.tasks.sel='today';render()")
    e=[x for x in errs if 'favicon' not in x];ok(not e,f'[{W}] U4 오류 없음',e[:3]);errs.clear()
    b.close()
  # ---------- U5 ----------
  if want('U5'):
   SEED5="""(()=>{const td=midKey68();const mk=(n,d)=>{const t=newTask({title:n,due:addDays(td,d)});t.order=1;t.created=addDays(td,-20);saveTask(t);return t.id};
     return {a:mk('미룰 일 가',-2),b:mk('미룰 일 나',-1),c:mk('나중 일',3),d:mk('상세 미루기',0),e:mk('상세 미루기 둘',-3)}})()"""
   def ppmenu(pg,id,touch):
     J(pg,f"(()=>{{const r=document.querySelector('#tList .trow[data-task=\"{id}\"]');r.scrollIntoView({{block:'center'}});const b=r.getBoundingClientRect();taskMenu61(TASKS['{id}'],b.left+60,b.top+10)}})()");pg.wait_for_timeout(300)
     tap(pg,pg.locator('#m61 [data-m61]',has_text='미루기').first,touch);pg.wait_for_timeout(350)
   for W,H,touch in SIZES:
    b,pg=run2(pw,W,H,touch);ids=J(pg,SEED5);td=J(pg,"midKey68()");tm=J(pg,"addDays(midKey68(),1)")
    J(pg,"C.tc131={late:1};location.hash='tasks'");pg.wait_for_timeout(700);notoast(pg)
    ppmenu(pg,ids['a'],touch)
    ok(J(pg,"!!document.querySelector('#m61 #sk131') && !document.querySelector('#m61 #sk131').checked"),f'[{W}] U5 ⏩ 미루기 창 맨 아래 ☠ 칸(기본 꺼짐)')
    ok(J(pg,"(()=>{const m=document.querySelector('#m61'),l=m.querySelector('.sk131');return l===m.lastElementChild&&l.getBoundingClientRect().height<40})()"),f'[{W}] U5 ☠ 칸은 맨 아래 한 줄')
    tap(pg,pg.locator('#m61 [data-m61]',has_text='내일').first,touch);pg.wait_for_timeout(500)
    t=T(pg,ids['a']);ok(t['due']==tm and not t.get('skull'),f'[{W}] U5 칸 꺼짐 → 날짜만 옮김(☠ 안 셈)',(t['due'],t.get('skull')))
    ok('☠ 안 셈' in J(pg,"$('toast').innerText") and J(pg,"!!document.querySelector('#toast .tbtn55')"),f'[{W}] U5 알림에 ☠ 미룸으로 단추',J(pg,"$('toast').innerText"))
    J(pg,"document.querySelector('#toast .tbtn55').click()");pg.wait_for_timeout(400)
    ok(T(pg,ids['a']).get('skull')==1,f'[{W}] U5 알림 ☠ 미룸으로 → 나중에 셈')
    # 켜고 미루기
    ppmenu(pg,ids['b'],touch)
    tap(pg,pg.locator('#m61 .sk131').first,touch);pg.wait_for_timeout(200)
    ok(J(pg,"!$('m61').hidden && document.querySelector('#m61 #sk131').checked"),f'[{W}] U5 ☠ 칸 눌러도 창은 그대로·켜짐')
    tap(pg,pg.locator('#m61 [data-m61]',has_text='내일').first,touch);pg.wait_for_timeout(500)
    t=T(pg,ids['b']);ok(t['due']==tm and t.get('skull')==1,f'[{W}] U5 칸 켬 → 미룸(☠ 1)',(t['due'],t.get('skull')))
    # 다시 열면 꺼져 있음 · 미래 할 일엔 칸 없음
    J(pg,"C.ui.tasks.sel='all';C.ui.collapsed={};render()");pg.wait_for_timeout(400)
    ppmenu(pg,ids['b'],touch)
    ok(not J(pg,"!!document.querySelector('#m61 #sk131')"),f'[{W}] U5 앞으로 날짜인 할 일(원래 ☠ 없음)엔 칸 없음')
    J(pg,"closeMenu61()")
    ppmenu(pg,ids['e'],touch)
    ok(J(pg,"!!document.querySelector('#m61 #sk131') && !document.querySelector('#m61 #sk131').checked"),f'[{W}] U5 다시 열면 칸은 꺼진 채')
    J(pg,"closeMenu61()")
    # 상세 미루기 칸
    J(pg,f"openTaskSheet('{ids['d']}')");pg.wait_for_timeout(500)
    J(pg,"(()=>{const b=document.querySelector('#sheetC [data-x57pp=\"open\"]');if(b&&document.querySelector('#sheetC .pp57').hidden)b.click()})()");pg.wait_for_timeout(300)
    ok(J(pg,"!!document.querySelector('#sheetC .pp57 #sk131p')"),f'[{W}] U5 상세 미루기 칸에도 ☠ 칸')
    J(pg,"document.querySelector('#sheetC .pp57 #sk131p').click()");pg.wait_for_timeout(100)
    J(pg,"document.querySelector('#sheetC .pp57 [data-x57pp]:not([data-x57pp=\"open\"])').click()");pg.wait_for_timeout(500)
    ok(T(pg,ids['d']).get('skull')==1,f'[{W}] U5 상세에서 켜고 미루기 → ☠ 1')
    J(pg,f"openTaskSheet('{ids['e']}')");pg.wait_for_timeout(500)
    J(pg,"(()=>{const b=document.querySelector('#sheetC [data-x57pp=\"open\"]');if(b&&document.querySelector('#sheetC .pp57').hidden)b.click()})()");pg.wait_for_timeout(300)
    J(pg,"document.querySelector('#sheetC .pp57 [data-x57pp]:not([data-x57pp=\"open\"])').click()");pg.wait_for_timeout(500)
    ok(not T(pg,ids['e']).get('skull') and T(pg,ids['e'])['due']>td,f'[{W}] U5 상세에서 그냥 미루기 → ☠ 안 셈')
    e=[x for x in errs if 'favicon' not in x];ok(not e,f'[{W}] U5 오류 없음',e[:3]);errs.clear()
    b.close()
  # ---------- U6 ----------
  if want('U6'):
   SEED6="""(()=>{const td=midKey68();if(!C.lists.some(l=>l.id==='l131'))C.lists.push({id:'l131',name:'다른목록'});
     const a=newTask({title:'받은편지 일',due:td,time:'10:00',dur:30});saveTask(a);const b=newTask({title:'다른목록 일',due:td,time:'11:00',dur:30,list:'l131'});saveTask(b);
     C.calf77={lists:[],areas:[],tags:['옛거르기'],kinds:[],inv:1};delete C.calf77t;C.mig77f=1;C.tt84=1;C.ui.calMode='day';ui.calAnchor=td;render();return {a:a.id,b:b.id}})()"""
   def vis(pg,id):return J(pg,f"!!document.querySelector('#calPane [data-ctask=\"{id}\"]')")
   def go(pg,h):J(pg,f"location.hash='{h}'");pg.wait_for_timeout(700);notoast(pg)
   for W,H,touch in [(1400,950,False),(390,860,True)]:
    b,pg=run2(pw,W,H,touch);ids=J(pg,SEED6)
    t0=json.loads(J(pg,"JSON.stringify(C.calf77t||null)"))
    ok(t0 and t0.get('tags')==['옛거르기'] and t0.get('inv')==1,f'[{W}] U6 처음엔 C.calf77 복사본',t0)
    go(pg,'tasks')
    where=J(pg,"(()=>{const p=$('calPane');return p?(p.closest('#tt84slot')?'dock':p.closest('.view')?p.closest('.view').id:'?'):'none'})()")
    ok(J(pg,"curView()")=='tasks' and J(pg,"calShown()"),f'[{W}] U6 할 일 화면에 시간표 보임',where)
    ok(vis(pg,ids['a']) and vis(pg,ids['b']),f'[{W}] U6 처음엔 둘 다 보임')
    # 할 일 쪽에서 '받은편지만 보이기'
    tap(pg,pg.locator('#calFilterBtn').first,touch);pg.wait_for_timeout(500)
    h3=J(pg,"(document.querySelector('#sheetC .sh h3')||{}).textContent||''")
    ok('할 일 시간표' in h3 and '따로' in h3,f'[{W}] U6 거르기 창 제목에 어느 쪽인지',h3)
    J(pg,"document.querySelector('#sheetC [data-f77m=\"0\"]').click()");pg.wait_for_timeout(200)
    J(pg,"document.querySelector('#sheetC [data-f77=\"tags\"][data-v=\"옛거르기\"]').click()");pg.wait_for_timeout(200)
    J(pg,"document.querySelector('#sheetC [data-f77=\"lists\"][data-v=\"inbox\"]').click()");pg.wait_for_timeout(300)
    J(pg,"closeSheet()");pg.wait_for_timeout(300)
    ok(vis(pg,ids['a']) and not vis(pg,ids['b']),f'[{W}] U6 할 일 쪽 거르기 적용(다른목록 숨김)')
    c=json.loads(J(pg,"JSON.stringify(C.calf77)"));ok(c['lists']==[] and c['tags']==['옛거르기'] and c.get('inv')==1,f'[{W}] U6 캘린더 화면 설정은 그대로',c)
    go(pg,'cal')
    ok(J(pg,"curView()")=='cal' and vis(pg,ids['a']) and vis(pg,ids['b']),f'[{W}] U6 캘린더 화면은 안 변함(둘 다 보임)')
    # 캘린더 화면에서 '다른목록 숨기기'
    tap(pg,pg.locator('#calFilterBtn').first,touch);pg.wait_for_timeout(500)
    h3=J(pg,"(document.querySelector('#sheetC .sh h3')||{}).textContent||''");ok(h3.startswith('캘린더'),f'[{W}] U6 캘린더 화면 창 제목',h3)
    J(pg,"document.querySelector('#sheetC [data-f77=\"tags\"][data-v=\"옛거르기\"]').click()");pg.wait_for_timeout(200)
    J(pg,"document.querySelector('#sheetC [data-f77=\"lists\"][data-v=\"inbox\"]').click()");pg.wait_for_timeout(300)
    J(pg,"closeSheet()");pg.wait_for_timeout(300)
    ok(not vis(pg,ids['a']) and vis(pg,ids['b']),f'[{W}] U6 캘린더 화면 거르기 적용(받은편지 숨김)')
    tt=json.loads(J(pg,"JSON.stringify(C.calf77t)"));ok(tt['lists']==['inbox'] and not tt.get('inv'),f'[{W}] U6 할 일 쪽 설정은 그대로',tt)
    go(pg,'tasks')
    ok(vis(pg,ids['a']) and not vis(pg,ids['b']),f'[{W}] U6 할 일 화면으로 돌아오면 할 일 쪽 거르기 그대로')
    # 모두 풀기는 지금 쪽만
    tap(pg,pg.locator('#calFilterBtn').first,touch);pg.wait_for_timeout(500)
    J(pg,"document.querySelector('#sheetC [data-f77x]').click()");pg.wait_for_timeout(300);J(pg,"closeSheet()");pg.wait_for_timeout(300)
    ok(vis(pg,ids['a']) and vis(pg,ids['b']) and J(pg,"C.calf77.lists.join()")=='inbox' and J(pg,"C.calf77.inv")==1,f'[{W}] U6 모두 풀기 → 할 일 쪽만 풀림')
    ok(J(pg,"normConfig(JSON.parse(JSON.stringify(C))).calf77t.lists.length===0 && normConfig(JSON.parse(JSON.stringify(C))).calf77.lists[0]==='inbox'"),f'[{W}] U6 두 설정 다 저장됨(normConfig 보존)')
    e=[x for x in errs if 'favicon' not in x];ok(not e,f'[{W}] U6 오류 없음',e[:3]);errs.clear()
    b.close()
print('FAILS',len(FAILS),FAILS)
