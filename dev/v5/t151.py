# t151 (v13.14): ① 충동 적기 '💪 그냥 꾹 참기' 대응 ② 미루기·날짜 변경은 기본 ☠ 셈 + '단순 날짜 변경으로 바꾸기' 단추
import os,json,sys
os.environ.setdefault('HQURL','file:///home/claude/habit-quest/beta/index.html')
exec(open('/home/claude/habit-quest/dev/v5/h61.py').read())
URL=os.environ.get('HQURL',URL)
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
SIZES=[(1200,950,False),(390,860,True)]
SEED="""(()=>{const td=midKey68();const mk=(n,d)=>{const t=newTask({title:n,due:addDays(td,d)});t.order=1;t.created=addDays(td,-20);saveTask(t);return t.id};
  return {a:mk('미룰 일 가',-2),b:mk('나중 일',3)}})()"""
with sync_playwright() as pw:
  for W,H,touch in SIZES:
    b,pg=run2(pw,W,H,touch);ids=J(pg,SEED);tm=J(pg,"addDays(midKey68(),1)")
    # ---------- ② 미루기 ----------
    J(pg,"C.tc131={late:1};location.hash='tasks'");pg.wait_for_timeout(700);notoast(pg)
    J(pg,f"(()=>{{const r=document.querySelector('#tList .trow[data-task=\"{ids['a']}\"]');r.scrollIntoView({{block:'center'}});const q=r.getBoundingClientRect();taskMenu61(TASKS['{ids['a']}'],q.left+60,q.top+10)}})()");pg.wait_for_timeout(300)
    tap(pg,pg.locator('#m61 [data-m61]',has_text='미루기').first,touch);pg.wait_for_timeout(350)
    ok(not J(pg,"!!document.querySelector('#m61 #sk131')"),f'[{W}] ② 옛 ☠ 미룸으로 기록 칸이 없어짐')
    tap(pg,pg.locator('#m61 [data-m61]',has_text='내일').first,touch);pg.wait_for_timeout(600)
    t=T(pg,ids['a']);ok(t['due']==tm and t.get('skull')==1,f'[{W}] ② 미루기 → 기본으로 ☠ 1 셈',(t['due'],t.get('skull')))
    tx=J(pg,"$('toast').innerText");ok('미룬 것으로 셌어요' in tx and '☠ 안 셈' not in tx,f'[{W}] ② 알림에 \'미룬 것으로 셌어요\'(안 셈 아님)',tx)
    ok('단순 날짜 변경으로 바꾸기' in tx and J(pg,"!!document.querySelector('#toast .tbtn55')"),f'[{W}] ② 알림에 단순 날짜 변경으로 바꾸기 단추',tx)
    J(pg,"document.querySelector('#toast .tbtn55').click()");pg.wait_for_timeout(400)
    t=T(pg,ids['a']);ok(t['due']==tm and not t.get('skull'),f'[{W}] ② 단추 → ☠ 빠지고 날짜는 그대로',(t['due'],t.get('skull')))
    # 앞으로 날짜인 할 일은 원래 ☠ 없음
    J(pg,f"postpone(TASKS['{ids['b']}'],addDays(midKey68(),5))");pg.wait_for_timeout(400)
    ok(not T(pg,ids['b']).get('skull'),f'[{W}] ② 아직 날짜 전인 할 일을 옮기면 ☠ 없음')
    # ---------- ① 충동 대응 ----------
    J(pg,"sheet110('f')");pg.wait_for_timeout(500)
    iid=J(pg,"(()=>{const x=add110('f','치킨',0);IM110.plan=x.id;redraw110();return x.id})()");pg.wait_for_timeout(300)
    ok(J(pg,f"!!document.querySelector('#sheetC [data-imtg110=\"{iid}\"]')"),f'[{W}] ① ① 단계에 💪 그냥 꾹 참기 단추')
    ok(J(pg,f"document.querySelector('#sheetC [data-imtg110=\"{iid}\"]').textContent.includes('그냥 꾹 참기')"),f'[{W}] ① 단추 글자')
    tap(pg,pg.locator(f'#sheetC [data-imtg110="{iid}"]'),touch);pg.wait_for_timeout(500)
    st=J(pg,f"(()=>{{const f=find110('{iid}');return JSON.stringify({{fl:f.x.fl,w:f.x.w>Date.now()}})}})()")
    ok(json.loads(st)=={'fl':'그냥 꾹 참기','w':True},f'[{W}] ① 누르면 대응 기록 + 기다리기 시작',st)
    tx=J(pg,"document.querySelector('#sheetC .im110p').innerText")
    ok('그냥 꾹 참기' in tx and '기다리는 중' in tx and '먹었어요' not in tx,f'[{W}] ① 기다리는 중 줄에 💪 그냥 꾹 참기(먹었어요 아님)',tx)
    J(pg,f"skip110('{iid}');redraw110()");pg.wait_for_timeout(200)
    J(pg,f"hold110('{iid}');redraw110()");pg.wait_for_timeout(500)
    ok(J(pg,f"find110('{iid}').x.s")=='h',f'[{W}] ① 그다음 ✓ 안 먹었어요로 확정됨')
    ok('대응: 💪 그냥 꾹 참기' in J(pg,"(()=>{const x=find110('%s').x;return ftxt110(x)})()"%iid),f'[{W}] ① 기록 줄에 대응이 남음')
    e=[x for x in errs if 'favicon' not in x];ok(not e,f'[{W}] 오류 없음',e[:3]);errs.clear()
    b.close()
print('FAILS',len(FAILS),FAILS)
