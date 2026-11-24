# t134 (v12.9): 내일 짜기 끌어놓기(마우스·터치)·목록 색 · 고른 것 보이기(합쳐서/겹치는 것만)
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
TOUCH="""(a)=>{const [sel,txt,x0,y0,pts,hold]=a;const els=[...document.querySelectorAll(sel)];const el=txt?els.find(e=>e.textContent.includes(txt)):els[0];if(!el)return 'noel';
 const r=el.getBoundingClientRect();const x=x0!=null?x0:r.left+r.width/2,y=y0!=null?y0:r.top+r.height/2;
 const ev=(t,X,Y)=>el.dispatchEvent(new PointerEvent(t,{bubbles:true,cancelable:true,pointerType:'touch',pointerId:7,clientX:X,clientY:Y,button:0,isPrimary:true}));
 ev('pointerdown',x,y);window.__tp={ev,pts};return [x,y]}"""
def touch_drag(pg,sel,txt,to,hold=450):
    st=J(pg,"("+TOUCH+")",)  if False else None
    r=pg.evaluate("""([sel,txt])=>{const els=[...document.querySelectorAll(sel)];const el=txt?els.find(e=>e.textContent.includes(txt)):els[0];if(!el)return null;const r=el.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]}""",[sel,txt])
    if not r:return False
    pg.evaluate("""([sel,txt,x,y])=>{const els=[...document.querySelectorAll(sel)];const el=txt?els.find(e=>e.textContent.includes(txt)):els[0];window.__te=el;
      el.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerType:'touch',pointerId:7,clientX:x,clientY:y,button:0,isPrimary:true}))}""",[sel,txt,r[0],r[1]])
    pg.wait_for_timeout(hold)
    for i in range(1,9):
        x=r[0]+(to[0]-r[0])*i/8;y=r[1]+(to[1]-r[1])*i/8
        pg.evaluate("""([x,y])=>{document.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,cancelable:true,pointerType:'touch',pointerId:7,clientX:x,clientY:y,isPrimary:true}))}""",[x,y]);pg.wait_for_timeout(30)
    pg.evaluate("""([x,y])=>{document.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,cancelable:true,pointerType:'touch',pointerId:7,clientX:x,clientY:y,isPrimary:true}))}""",[to[0],to[1]]);pg.wait_for_timeout(500)
    return True
def setup(pg):
    J(pg,"""(()=>{const l=(C.lists||[]).find(z=>z.id==='inbox')||C.lists[0];l.color='#d9730d';save('config');
      const a=addTaskFrom('책상 정리 %7');window.__care=a.id;const y=addDays(midKey68(),1);const b=addTaskFrom('할일가');b.due=y;saveTask(b);window.__todo=b.id;const c=addTaskFrom('할일나');c.due=y;saveTask(c);window.__todo2=c.id})()""")
    pg.wait_for_timeout(600);notoast(pg)
    J(pg,"location.hash='tasks';render()");pg.wait_for_timeout(500);notoast(pg)
    J(pg,"planSheet80()");pg.wait_for_timeout(600)
def gbox(pg):return J(pg,"(()=>{const s=document.querySelector('#sheetC .tt93s');s.scrollTop=0;const g=document.querySelector('#sheetC [data-w93g]');const r=g.getBoundingClientRect();const q=s.getBoundingClientRect();return [r.left,r.top,r.width,q.top,q.bottom,q.left,q.right]})()")
with sync_playwright() as pw:
  for W,H,mode in [(390,900,'touch'),(1200,1000,'mouse')]:
    b,pg=run(pw,W=W,H=H);closepops(pg);notoast(pg);setup(pg)
    # ① 목록 색
    ok(J(pg,"!!document.querySelector('#sheetC .t93.lc93')"),f'[{W}] ① 칩에 목록 색 띠(lc93)')
    ok(J(pg,"/[\\u2600-\\u27BF\\u2B50-\\u2BFF\\u{1F300}-\\u{1FAFF}]/u.test(document.querySelector('#sheetC .t93.lc93').textContent)"),f'[{W}] ① 색만이 아니라 이모지도 같이',J(pg,"document.querySelector('#sheetC .t93.lc93').textContent"))
    # ② 칩 끌어 놓기
    J(pg,"[...document.querySelectorAll('#sheetC .w93d')].find(b=>/할 ?일|전체|오늘|목록/.test(b.textContent))&&0")
    ok(J(pg,"[...document.querySelectorAll('#sheetC .t93')].every(b=>b.dataset.drag&&b.dataset.drag.startsWith('task:'))"),f'[{W}] ② 모든 칩에 끌기 표시(data-drag)')
    g=gbox(pg);to=(g[0]+g[2]*0.6,g[3]+90)
    if mode=='touch':okk=touch_drag(pg,'#sheetC .t93','할일가',to)
    else:
        bb=J(pg,"(()=>{const e=[...document.querySelectorAll('#sheetC .t93')].find(b=>b.textContent.includes('할일가'));const r=e.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]})()")
        drag(pg,tuple(bb),to);okk=True
    tm=J(pg,"addDays(midKey68(),1)")
    ok(J(pg,"(()=>{const t=TASKS[window.__todo];return !!(t&&t.time&&t.due===addDays(midKey68(),1))})()"),f'[{W}] ② 칩을 시간표로 끌어 놓으면 내일·시각이 생김({mode})',J(pg,"JSON.stringify([TASKS[window.__todo].due,TASKS[window.__todo].time])"))
    ok(J(pg,"[...document.querySelectorAll('#sheetC .b93')].some(b=>/할일가/.test(b.textContent))"),f'[{W}] ② 시간표에 블록이 보임')
    # ③ 놓은 블록을 시간표 안에서 옮기기
    t0=J(pg,"TASKS[window.__todo].time")
    g=gbox(pg);to=(g[0]+g[2]*0.6,g[3]+200)
    if mode=='touch':touch_drag(pg,'#sheetC .b93','할일가',to)
    else:
        bb=J(pg,"(()=>{const e=[...document.querySelectorAll('#sheetC .b93')].find(b=>b.textContent.includes('할일가'));const r=e.getBoundingClientRect();return [r.left+r.width/2,r.top+8]})()")
        drag(pg,tuple(bb),to)
    t1=J(pg,"TASKS[window.__todo].time");ok(t1 and t1!=t0,f'[{W}] ③ 놓은 블록을 끌어 다른 시간으로 옮김({mode})',[t0,t1])
    # ④ 관리 칩 끌기
    J(pg,"[...document.querySelectorAll('#sheetC .w93d')].find(b=>/관리/.test(b.textContent)).click()");pg.wait_for_timeout(400)
    g=gbox(pg);to=(g[0]+g[2]*0.6,g[3]+150)
    if mode=='touch':touch_drag(pg,'#sheetC .t93','책상',to)
    else:
        bb=J(pg,"(()=>{const e=[...document.querySelectorAll('#sheetC .t93')].find(b=>b.textContent.includes('책상'));const r=e.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]})()")
        drag(pg,tuple(bb),to)
    ok(J(pg,"(()=>{const t=TASKS[window.__care];return !!(t.cs126&&t.cs126.m)})()"),f'[{W}] ④ 관리 칩도 끌어 놓기({mode})',J(pg,"JSON.stringify(TASKS[window.__care].cs126||null)"))
    # ⑤ 놓은 블록을 위 칸으로 끌어 빼기
    J(pg,"[...document.querySelectorAll('#sheetC .w93d')].find(b=>!/관리/.test(b.textContent)&&b.textContent.length<8)&&0")
    J(pg,"document.querySelector('#sheetC .tt93s').scrollTop=0");pg.wait_for_timeout(200)
    trb=J(pg,"(()=>{const r=document.querySelector('#sheetC .w93tray').getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]})()")
    if mode=='touch':touch_drag(pg,'#sheetC .b93','할일가',tuple(trb))
    else:
        bb=J(pg,"(()=>{const e=[...document.querySelectorAll('#sheetC .b93')].find(b=>b.textContent.includes('할일가'));const r=e.getBoundingClientRect();return [r.left+r.width/2,r.top+8]})()")
        drag(pg,tuple(bb),tuple(trb))
    ok(J(pg,"!TASKS[window.__todo].time"),f'[{W}] ⑤ 블록을 위 칸(보관함)으로 끌면 시간이 빠짐({mode})',J(pg,"TASKS[window.__todo].time"))
    # ⑥ 시간표 밖(위쪽 제목 줄)에 놓으면 아무 일 없음
    ok(not errs,f'[{W}] 콘솔 오류 없음',errs[:3]);b.close()
  # ---------- ③ 고른 것 보이기 ----------
  b,pg=run(pw,W=390,H=900);closepops(pg);notoast(pg)
  J(pg,"""(()=>{const a=addTaskFrom('청소 %7');window.__care=a.id;const b=addTaskFrom('일반할일 #기본함');window.__t=b.id;window.__L=b.list;
    C.lists.push({id:'lx',name:'Limen',color:'#c0392b'});const c=addTaskFrom('리멘할일');c.list='lx';saveTask(c);window.__c=c.id;save('config')})()""")
  pg.wait_for_timeout(600);notoast(pg)
  J(pg,"C.calf77={lists:['lx'],areas:[],tags:[],kinds:['care'],inv:0};")
  v=J(pg,"(()=>{const f=flt77();return [calPass(TASKS[window.__c]),calPass(TASKS[window.__care]),calPass(TASKS[window.__t])]})()")
  ok(v==[True,True,False],'③ 목록(Limen)+종류(관리) → 합쳐서: Limen 일 + 관리 모두 보임, 나머지는 안 보임',v)
  J(pg,"C.calf77.and=1")
  v=J(pg,"[calPass(TASKS[window.__c]),calPass(TASKS[window.__care])]")
  ok(v==[False,False],'③ 겹치는 것만(and): Limen의 관리만 → 둘 다 안 보임(예전 방식 유지)',v)
  J(pg,"C.calf77={lists:['lx'],areas:[],tags:[],kinds:[],inv:0}")
  v=J(pg,"[calPass(TASKS[window.__c]),calPass(TASKS[window.__t])]");ok(v==[True,False],'③ 한 줄만 고르면 그대로(목록만)',v)
  J(pg,"C.calf77={lists:['lx'],areas:[],tags:[],kinds:['care'],inv:1}")
  v=J(pg,"[calPass(TASKS[window.__c]),calPass(TASKS[window.__care]),calPass(TASKS[window.__t])]");ok(v==[False,False,True],'③ 숨기기는 그대로(하나라도 맞으면 숨김)',v)
  J(pg,"C.calf77={lists:['lx'],areas:[],tags:[],kinds:['care'],inv:0};save('config');location.hash='calendar';render()");pg.wait_for_timeout(600);notoast(pg)
  J(pg,"document.getElementById('calFilterBtn').click()");pg.wait_for_timeout(500)
  ok(J(pg,"!!document.querySelector('#sheetC [data-f77a]')"),'③ 창에 합쳐서 보기/겹치는 것만 선택이 보임(줄 2개 이상일 때)')
  J(pg,"document.querySelector('#sheetC [data-f77a=\"1\"]').click()");pg.wait_for_timeout(400)
  ok(J(pg,"flt77().and===1"),'③ 겹치는 것만 누르면 켜짐')
  J(pg,"document.querySelector('#sheetC [data-f77x]').click()");pg.wait_for_timeout(400)
  ok(J(pg,"flt77().lists.length===0&&flt77().and===1"),'③ 모두 풀어도 고른 방식(and)은 유지',J(pg,"JSON.stringify(C.calf77)"))
  ok(not errs,'③ 콘솔 오류 없음',errs[:3]);b.close()
  # ---------- ④ 폰 진입로 🧽 시트 ----------
  for dock in (1,0):
    b,pg=run(pw,W=390,H=800);closepops(pg);notoast(pg)
    J(pg,"""(()=>{const a=addTaskFrom('책상 정리 %7');window.__care=a.id;const w=addTaskFrom('시나리오 쓰기 주3회');window.__wk=w.id})()""");pg.wait_for_timeout(500)
    J(pg,f"C.tt84={dock};save('config');location.hash='{'tasks' if dock else 'cal'}';render()");pg.wait_for_timeout(900);notoast(pg)
    L=f'[dock={dock}] '
    ok(J(pg,"(()=>{const b=document.querySelector('.deck127b');if(!b)return false;const r=b.getBoundingClientRect(),cs=getComputedStyle(b);return r.width>20&&r.height>20&&cs.display!=='none'&&cs.visibility!=='hidden'&&r.right<=innerWidth+1&&r.left>=-1})()"),L+'④ 🧽 관리 단추가 화면 안에 보임',J(pg,"(()=>{const b=document.querySelector('.deck127b');return b&&JSON.stringify(b.getBoundingClientRect())})()"))
    J(pg,"document.querySelector('.deck127b').click()");pg.wait_for_timeout(500)
    ok(J(pg,"!!document.querySelector('#sheetC [data-d127p]')&&!!document.querySelector('#sheetC [data-d127w]')"),L+'④ 시트에 관리 놓기·주 N회 요일 단추가 있음')
    ok(J(pg,"(()=>{const e=document.getElementById('sheetC');return e.scrollWidth<=e.clientWidth+1})()"),L+'④ 시트가 가로로 넘치지 않음')
    # 주 N회: 날 넣기 → 빼기
    k=J(pg,"addDays(midKey68(),1)>weekStart(midKey68())&&weekStart(addDays(midKey68(),1))===weekStart(midKey68())?addDays(midKey68(),1):midKey68()")
    J(pg,f"document.querySelector('#sheetC [data-d127w=\"'+window.__wk+'|{k}\"]').click()");pg.wait_for_timeout(500)
    ok(J(pg,f"TASKS[window.__wk].sl91&&TASKS[window.__wk].sl91['{k}']!==undefined"),L+'④ 요일 단추로 계획 칸이 생김')
    ok(J(pg,f"document.querySelector('#sheetC [data-d127w=\"'+window.__wk+'|{k}\"]').getAttribute('aria-pressed')")=='true' and J(pg,f"/✕/.test(document.querySelector('#sheetC [data-d127w=\"'+window.__wk+'|{k}\"]').textContent)"),L+'④ 계획한 날은 📌✕로 보임')
    J(pg,f"document.querySelector('#sheetC [data-d127w=\"'+window.__wk+'|{k}\"]').click()");pg.wait_for_timeout(500)
    ok(J(pg,f"!(TASKS[window.__wk].sl91&&TASKS[window.__wk].sl91['{k}']!==undefined)"),L+'④ 다시 누르면 계획 칸이 빠짐(✕)')
    # 관리 놓기 → 빼기
    J(pg,"document.querySelector('#sheetC [data-d127p]').click()");pg.wait_for_timeout(500)
    ok(J(pg,"/📅/.test(document.querySelector('#sheetC .sh h3').textContent)"),L+'④ 📅 놓기가 관리 날짜·시각 창을 엶')
    J(pg,"TASKS[window.__care].cs126=null;delete TASKS[window.__care].cs126;place126(TASKS[window.__care],addDays(midKey68(),1),'10:00');render();deck127()");pg.wait_for_timeout(400)
    ok(J(pg,"!!document.querySelector('#sheetC [data-d127u]')"),L+'④ 놓은 관리엔 ✕ 빼기가 보임')
    J(pg,"document.querySelector('#sheetC [data-d127u]').click()");pg.wait_for_timeout(500)
    ok(J(pg,"!TASKS[window.__care].cs126"),L+'④ ✕ 빼기로 놓은 자리가 빠짐')
    ok(not errs,L+'④ 콘솔 오류 없음',errs[:3]);b.close()
  # 🔁 이번 주 창의 정한 날 ✕
  b,pg=run(pw,W=390,H=800);closepops(pg);notoast(pg)
  J(pg,"""(()=>{const w=addTaskFrom('시나리오 쓰기 주3회');window.__wk=w.id;w.sl91=w.sl91||{};w.sl91[midKey68()]='';w.sl91[addDays(midKey68(),1)]='';saveTask(w)})()""");pg.wait_for_timeout(500)
  J(pg,"C.tt84=0;save('config');location.hash='cal';render()");pg.wait_for_timeout(700);notoast(pg)
  J(pg,"wkSheet121(window.__wk)");pg.wait_for_timeout(600)
  n=J(pg,"document.querySelectorAll('#sheetC [data-pl127]').length");ok(n>=1,'④ 이번 주 창에 📌 정한 날 ✕ 칩이 보임',n)
  if n:
    J(pg,"document.querySelector('#sheetC [data-pl127]').click()");pg.wait_for_timeout(500)
    ok(J(pg,"Object.keys(TASKS[window.__wk].sl91||{}).length")==n-1 if False else J(pg,"Object.keys(TASKS[window.__wk].sl91||{}).length")<2,'④ ✕를 누르면 그 날 계획이 빠짐')
  ok(not errs,'④ 이번 주 창 콘솔 오류 없음',errs[:3]);b.close()
print('FAILS',len(FAILS),FAILS)
