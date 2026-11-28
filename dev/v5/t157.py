# t157 (v13.19): 빠른 기록 묶기 · 관리 ⋯ 📊 통계(할 일 기준) · 충동 → 카드 기록·메모 · 식사 채소 → 채소 한 번 먹기
import os,json
os.environ.setdefault('HQURL','file:///home/claude/habit-quest/beta/index.html')
exec(open('/home/claude/habit-quest/dev/v5/h61.py').read())
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
J=lambda pg,x:pg.evaluate(x)
with sync_playwright() as pw:
    b,pg=run(pw);closepops(pg)
    # 빠른 기록 묶기
    J(pg,"""(()=>{const g=C.actions.filter(a=>a.type==='good'&&!(a.opts||[]).length&&!a.doneAt).slice(0,2).map(a=>a.id),bd=C.actions.filter(a=>a.type==='bad').slice(0,1).map(a=>a.id);C.pin133=[...g,...bd];save('config');location.hash='home';render()})()""");pg.wait_for_timeout(900)
    ok(J(pg,"!!document.querySelector('#pin141 [data-g144]')"),'빠른 기록 끝에 묶기 칩')
    J(pg,"document.querySelector('#pin141 [data-g144]').click()");pg.wait_for_timeout(600)
    ok(J(pg,"C.pg144==='type'&&document.querySelectorAll('#pin141 .m141p.g144').length===2"),'좋음·나쁨으로 두 묶음',J(pg,"[C.pg144,document.querySelectorAll('#pin141 .m141p.g144').length]"))
    ok(J(pg,"[...document.querySelectorAll('#pin141 .g144l')].map(x=>x.textContent).join('|')").find('좋음')>=0,'묶음 이름 좋음/나쁨')
    J(pg,"document.querySelector('#pin141 [data-g144]').click()");pg.wait_for_timeout(600)
    ok(J(pg,"C.pg144==='area'&&document.querySelectorAll('#pin141 .m141p.g144').length>=1"),'영역별 묶기')
    J(pg,"document.querySelector('#pin141 [data-g144]').click()");pg.wait_for_timeout(600)
    ok(J(pg,"C.pg144==='both'&&[...document.querySelectorAll('#pin141 .g144l')].some(x=>/✚.+\\S/.test(x.textContent))"),'좋음·나쁨 × 영역 합친 묶기',J(pg,"[...document.querySelectorAll('#pin141 .g144l')].map(x=>x.textContent)"))
    J(pg,"document.querySelector('#pin141 [data-g144]').click()");pg.wait_for_timeout(600)
    ok(J(pg,"!C.pg144&&!document.querySelector('#pin141 .g144l')"),'다시 안 묶음')
    # 기록 버튼은 그대로 동작
    J(pg,"C.pg144='type';save('config');render()");pg.wait_for_timeout(600)
    n0=J(pg,"(today().entries||[]).length")
    J(pg,"document.querySelector('#pin141 [data-p141]').click()");pg.wait_for_timeout(900)
    closepops(pg)
    ok(J(pg,"(today().entries||[]).length")>n0,'묶은 상태에서도 칩 누르면 기록')
    # 관리 통계: 같은 카드 할 일 둘
    J(pg,"""(()=>{const a=C.actions.find(a=>a.type==='good');window.AID=a.id;
      const t1=newTask({title:'전자레인지 청소157'});t1.aid=a.id;careOn77(t1,7);t1.due=midKey68();saveTask(t1);
      const t2=newTask({title:'창틀 청소157'});t2.aid=a.id;careOn77(t2,7);t2.due=addDays(midKey68(),3);saveTask(t2);window.T1=t1.id;window.T2=t2.id;
      // t2만 사흘 전에 함
      const k=addDays(gk76(),-3);withDay69(k,()=>completeTask(TASKS[t2.id],{direct:true}));render()})()""");pg.wait_for_timeout(900)
    closepops(pg)
    k3=J(pg,"addDays(gk76(),-3)")
    ok(J(pg,"did144(TASKS[T2],'%s')&&!did144(TASKS[T1],'%s')"%(k3,k3)),'기록 달력: 다른 할 일로 한 날은 이 할 일에 안 셈')
    J(pg,"careMenu76(TASKS[T1],200,200)");pg.wait_for_timeout(400)
    ok(J(pg,"[...document.querySelectorAll('#m61 *')].some(e=>/언제 했나 · 통계/.test(e.textContent))"),'관리 ⋯ 메뉴에 📊 언제 했나 · 통계')
    J(pg,"[...document.querySelectorAll('#m61 button,#m61 [role=menuitem],#m61 .mi')].find(e=>/언제 했나 · 통계/.test(e.textContent)).click()");pg.wait_for_timeout(500)
    ok(J(pg,"!!document.querySelector('#m61 .rc132')&&/최근 30일/.test(document.querySelector('#m61 .rc132').innerText)"),'통계 달력이 열림',J(pg,"(document.querySelector('#m61')||{}).innerText"))
    J(pg,"closeMenu61()")
    # 충동: 참음 → 참았다 카드 + 메모 · 못 참음 → 충동구매 카드
    J(pg,"""(()=>{if(!C.actions.some(a=>a.name==='충동구매 참았다'))C.actions.push({id:'g22t',name:'충동구매 참았다',type:'good',area:C.areas[0].id,xp:8,gold:5,cond:0});
      if(!C.actions.some(a=>a.name==='충동구매'))C.actions.push({id:'b7t',name:'충동구매',type:'bad',area:C.areas[0].id,xp:0,gold:-5,cond:-3});save('config');
      const x=add110('b','운동화',89000);window.X=x.id;const y=add110('b','키보드',120000);window.Y=y.id;render()})()""");pg.wait_for_timeout(700)
    J(pg,"hold110(X)");pg.wait_for_timeout(700)
    ok(J(pg,"(today().entries||[]).some(e=>e.name==='충동구매 참았다'&&/운동화/.test(e.note||'')&&/89,000/.test(e.note||''))"),'안 샀어요 → 충동구매 참았다 카드 기록 + 메모(이름·금액)',J(pg,"JSON.stringify((today().entries||[]).filter(e=>/충동/.test(e.name)).map(e=>[e.name,e.note]))"))
    J(pg,"(()=>{const f=find110(X);const e=today().entries.find(z=>z.id===f.x.eid);delete e.n144;e.note='옛 메모';f.x.m='새 메모';save(f.k);render()})()");pg.wait_for_timeout(600)
    ok(J(pg,"(()=>{const f=find110(X);return today().entries.find(z=>z.id===f.x.eid).note})()")=='옛 메모','옛 기록·직접 고친 메모는 안 건드림')
    J(pg,"gave110(Y)");pg.wait_for_timeout(700)
    ok(J(pg,"(today().entries||[]).some(e=>e.name==='충동구매'&&e.type==='bad'&&/키보드/.test(e.note||''))"),'샀어요 → 충동구매(나쁜 카드) 기록')
    J(pg,"(()=>{const f=find110(Y);f.x.sit=['피곤'];f.x.m='할인이라서';save(f.k);render()})()");pg.wait_for_timeout(600)
    ok(J(pg,"(today().entries||[]).some(e=>e.name==='충동구매'&&/피곤/.test(e.note||'')&&/할인이라서/.test(e.note||''))"),'나중에 적은 상황·메모가 기록 메모에 따라감')
    J(pg,"undo110(Y)");pg.wait_for_timeout(600)
    ok(J(pg,"!(today().entries||[]).some(e=>e.name==='충동구매'&&/키보드/.test(e.note||''))"),'되돌리면 충동구매 기록도 지움')
    # 채소
    vt=J(pg,"(()=>{const a=C.actions.find(a=>/채소/.test(a.name)&&/먹/.test(a.name));const t=a&&Object.values(TASKS).find(t=>t.status===0&&t.aid===a.id&&t.rep);return [a&&a.name,t&&t.id,t&&t.due]})()")
    print('veg',vt)
    if not vt[1]:
        J(pg,"(()=>{let a=C.actions.find(a=>/채소/.test(a.name)&&/먹/.test(a.name));if(!a){a={id:'dq2t',name:'채소 한 번 먹기',type:'good',area:C.areas[0].id,xp:5,gold:0,cond:2};C.actions.push(a);save('config')}const t=newTask({title:'채소 한 번 먹기'});t.aid=a.id;t.rep={f:'d',i:1};t.due=midKey68();saveTask(t);render()})()");pg.wait_for_timeout(700)
        vt=J(pg,"(()=>{const a=C.actions.find(a=>/채소/.test(a.name)&&/먹/.test(a.name));const t=Object.values(TASKS).find(t=>t.status===0&&t.aid===a.id&&t.rep);return [a.name,t.id,t.due]})()")
    J(pg,"(()=>{const t=TASKS[%s];t.due=midKey68();saveTask(t);location.hash='home';render()})()"%json.dumps(vt[1]));pg.wait_for_timeout(700)
    xp0=J(pg,"P.xp")
    J(pg,"(()=>{const b=document.querySelector('#meal141 [data-food=\"veg\"][data-d=\"1\"]')||document.querySelector('[data-food=\"veg\"][data-d=\"1\"]');b.click()})()");pg.wait_for_timeout(1200)
    closepops(pg)
    ok(J(pg,"(today().entries||[]).some(e=>e.tid===%s&&(e.au144==='veg'||e.kind==='quest')&&!(+e.xp||0))"%json.dumps(vt[1])),'채소 +1 → 채소 한 번 먹기 할 일 끝남(0점 자동 기록)',J(pg,"JSON.stringify((today().entries||[]).filter(e=>/채소/.test(e.name)).map(e=>[e.kind,e.name,e.tid,e.xp,e.au144]))"))
    ok(J(pg,"(today().entries||[]).filter(e=>e.kind==='quest'&&/채소/.test(e.name)).length<=1"),'일퀘가 두 번 들어가지 않음')
    J(pg,"(()=>{const b=document.querySelector('[data-food=\"veg\"][data-d=\"-1\"]');b.click()})()");pg.wait_for_timeout(1200)
    ok(J(pg,"!(today().entries||[]).some(e=>e.tid===%s&&(e.au144==='veg'||e.kind==='quest'))"%json.dumps(vt[1])),'채소를 0으로 되돌리면 자동 기록만 지움')
print('ERRS',[e for e in errs if 'PAGEERR' in e][:5])
print('FAILS',len(FAILS),FAILS)
