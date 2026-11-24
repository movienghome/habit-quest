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
def T(pg,id):return json.loads(J(pg,f"JSON.stringify(TASKS[{json.dumps(id)}]||null)"))
def want(u):return not ONLY or u in ONLY
SIZES=[(1200,950,False),(390,860,True)]
# 기본 경보: g1 운동 4일 · g9 시나리오 3일 · g16 집 정리 7일 · g13 가계부 7일. 12일 전에 아무 기록 하나 → 모두 12일째쯤
SEED3="""(()=>{const old=addDays(gk76(),-12);DAYS[old]={date:old,entries:[{id:'x1',kind:'act',aid:'zz',name:'아무거나',xp:1,gold:0,cond:0,t:Date.now()}]};
  C.dailies=C.dailies.filter(q=>!['g1','g9','g13','g16'].includes(q.action));syncDailies&&syncDailies(C);
  const h=newTask({title:'운동',aid:'g1',rep:{f:'w',i:1,wd:[0,1,2,3,4,5,6]},due:midKey68()});saveTask(h);
  const c=newTask({title:'가계부 정리',aid:'g13'});careOn77(c,7);c.due=midKey68();saveTask(c);
  nlClear69();render();return {h:h.id,c:c.id}})()"""
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
print('FAILS',len(FAILS),FAILS)
