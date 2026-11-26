# t156 (v13.19): 칩 보이기·숨기기 · 숨는 할 일 슬롯 · 내일 목록에 놓은 칩 · 루틴 미리 보기 블록 · 오늘 한 단계 줄 없음 · 홈 끝냄 칩
import os,json
os.environ.setdefault('HQURL','file:///home/claude/habit-quest/beta/index.html')
exec(open('/home/claude/habit-quest/dev/v5/h61.py').read())
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
J=lambda pg,x:pg.evaluate(x)
TXT="(sel,re)=>[...document.querySelectorAll(sel)].some(e=>new RegExp(re).test(e.textContent))"
with sync_playwright() as pw:
    b,pg=run(pw);closepops(pg)
    J(pg,"""(()=>{const K1=addDays(midKey68(),1);window.K1=K1;
      const a=newTask({title:'운동156'});a.rep={f:'x',n:2};a.list='Lhabit';a.care76=1;a.dur=40;a.sl91={[K1]:'19:30'};saveTask(a);window.A=a.id;
      const b=newTask({title:'시나리오156'});b.rep={f:'x',n:5};b.list='Latelier';b.dur=60;b.sl91={[K1]:'09:00'};saveTask(b);window.B=b.id;const c=newTask({title:'일반156',due:K1});c.list='Lpersonal';c.time='11:00';saveTask(c);window.Cc=c.id;
      C.mig77f=1;C.calf77={lists:['Lfixed'],areas:[],tags:[],kinds:[],inv:0};C.calf77t={lists:['Lfixed'],areas:[],tags:[],kinds:[],inv:0};delete C.mig144;save('config');
      C.ui.cal=Object.assign(C.ui.cal||{},{mode:'week'});ui.calAnchor=K1;location.hash='calendar';render()})()""");pg.wait_for_timeout(1200)
    ok(J(pg,"hid76(TASKS[A])"),'운동156은 숨는 할 일(hid76)')
    ok(J(pg,"C.mig144===1&&C.calf77.kinds.includes('wk')&&C.calf77t.kinds.includes('wk')"),'기존 고른 것 보이기 설정에 칩 항목이 한 번 들어감',J(pg,"JSON.stringify(C.calf77)"))
    ok(J(pg,"!!document.querySelector('#calPane .blk[data-ctask=\"'+A+'\"]')"),'숨는 할 일(운동)도 날짜에 놓은 칩 블록이 시간표에 보임')
    ok(J(pg,"!!document.querySelector('#calPane .blk[data-ctask=\"'+B+'\"]')"),'시나리오 칩 블록 보임(목록 거르기와 상관없이)')
    ok(J(pg,"!document.body.classList.contains('nochip144')"),'칩 줄 보임')
    # 칩 항목 빼면 숨음
    J(pg,"C.calf77.kinds=[];C.calf77t.kinds=[];save('config');render()");pg.wait_for_timeout(700)
    ok(J(pg,"!document.querySelector('#calPane .blk[data-ctask=\"'+A+'\"]')&&!document.querySelector('#calPane .blk[data-ctask=\"'+B+'\"]')"),'보이기 모드에서 칩 항목을 빼면 칩 블록이 숨음')
    ok(J(pg,"document.body.classList.contains('nochip144')"),'칩 줄도 숨음')
    # 숨기기 모드
    J(pg,"C.calf77={lists:[],areas:[],tags:[],kinds:['wk'],inv:1};C.calf77t=clone(C.calf77);save('config');render()");pg.wait_for_timeout(700)
    ok(J(pg,"!document.querySelector('#calPane .blk[data-ctask=\"'+B+'\"]')"),'숨기기 모드에서 칩을 고르면 칩이 숨음')
    ok(J(pg,"tasksOn(K1).some(t=>t.id===Cc)"),'숨기기 모드에서 다른 일은 그대로')
    J(pg,"C.calf77={lists:['Lfixed'],areas:[],tags:[],kinds:['wk'],inv:0};C.calf77t=clone(C.calf77);save('config');render()");pg.wait_for_timeout(700)
    ok(J(pg,"tasksOn(K1).every(t=>t.rep&&t.rep.f==='x'||t.list==='Lfixed')"),'보이기 모드 칩+Fixed: 칩과 Fixed만',J(pg,"JSON.stringify(tasksOn(K1).map(t=>[t.title,t.list]))"))
    # 메뉴에 칩 항목
    ok(J(pg,"KIND77.some(x=>x[0]==='wk')"),'보이기·숨기기 종류에 칩 항목')
    # 내일 목록
    J(pg,"C.ui.tasks.sel='tomorrow';location.hash='tasks';render()");pg.wait_for_timeout(900)
    ok(J(pg,"(%s)('#tList .trow, #tList [data-task], #tasksMain .trow','시나리오156')"%TXT),'내일 목록에 놓은 칩(시나리오) 보임')
    ok(J(pg,"(%s)('#tList .trow, #tList [data-task], #tasksMain .trow','운동156')"%TXT),'내일 목록에 놓은 칩(운동) 보임')
    ok(J(pg,"(%s)('.trow','내일 09:00')"%TXT),'줄의 날짜·시각이 놓은 자리(내일 09:00)')
    # 루틴 미리 보기
    J(pg,"""(()=>{const r=rtNew61('테스트 레테',[{name:'양치',min:10},{name:'일기',min:5}]);setRt60(r,[0,1,2,3,4,5,6]);syncDailies(C);save('config');render();window.__rid=r.id;
      const rr=C.routines.find(x=>x.id===window.__rid);sync62(rr);save('config');render()})()""");pg.wait_for_timeout(900)
    rid=J(pg,"(()=>{const t=Object.values(TASKS).find(t=>t.status===0&&t.rid===window.__rid&&t.rep&&t.rep.f);return t?t.id:null})()")
    print('routine head',rid,J(pg,"(()=>{const t=Object.values(TASKS).find(t=>t.rid);return t?JSON.stringify([t.title,t.rep,t.due,t.time]):null})()"))
    if rid:
        J(pg,"(()=>{const t=TASKS[%s];t.due=midKey68();t.time=t.time||'21:00';saveTask(t);C.calf77={lists:[],areas:[],tags:[],kinds:[],inv:0};C.calf77t=clone(C.calf77);save('config');ui.calAnchor=midKey68();location.hash='calendar';render()})()"%json.dumps(rid));pg.wait_for_timeout(900)
        K2=J(pg,"addDays(midKey68(),2)")
        ok(J(pg,"tasksOn(%s).some(t=>t.id===%s)"%(json.dumps(K2),json.dumps(rid))),'루틴이 모레에도 보임(오늘 안 했어도)')
        ok(J(pg,"(()=>{const el=document.querySelector('#calPane [data-drop=\"col:%s\"] [data-ctask=\"%s\"]')||document.querySelector('#calPane [data-drop=\"allday:%s\"] [data-ctask=\"%s\"]');return !!el&&el.classList.contains('gh144')&&!el.hasAttribute('data-drag')&&!el.querySelector('[data-tdone]')})()"%(K2,rid,K2,rid)),'미리 보기 블록: 끌기·○ 없음')
        ok(J(pg,"(()=>{const el=document.querySelector('#calPane [data-drop=\"col:'+midKey68()+'\"] [data-ctask=\"%s\"]');return !!el&&!el.classList.contains('gh144')})()"%rid),'오늘 블록은 진짜 블록')
        J(pg,"C.ui.cal.mode='month';render()");pg.wait_for_timeout(600)
        ok(J(pg,"!document.querySelector('.mgrid [data-ctask=\"%s\"].gh144, .mgrid [data-drop=\"day:%s\"] [data-ctask=\"%s\"]')"%(rid,K2,rid)),'월 보기엔 미리 보기 안 그림(칸이 꽉 차지 않게)')
        # 오늘 한 단계 줄
        J(pg,"(()=>{const r=rtOfT62(TASKS[%s]);const s=(r.steps||[])[0];if(s&&TASKS[s.tid]){completeTask(TASKS[s.tid])}})()"%json.dumps(rid));pg.wait_for_timeout(800)
        J(pg,"C.ui.tasks.sel='today';location.hash='tasks';render()");pg.wait_for_timeout(800)
        ok(J(pg,"!document.querySelector('.d106,.dn75')"),'목록에 오늘 한 단계 줄 없음')
    # 홈 끝냄 칩
    J(pg,"(()=>{const t=newTask({title:'끝낼 일156',due:midKey68()});saveTask(t);completeTask(TASKS[t.id]);location.hash='home';render()})()");pg.wait_for_timeout(900)
    ok(J(pg,"!!document.querySelector('#htList .hd144')&&!(%s)('#htList .tiny','끝낸 것:')"%TXT),'홈 오늘: 끝낸 것 글줄 대신 끝냄 칩',J(pg,"(document.getElementById('htList')||{}).innerText"))
    J(pg,"document.querySelector('#htList .hd144 summary').click()");pg.wait_for_timeout(300)
    ok(J(pg,"(%s)('#htList .hd144i','끝낼 일156')"%TXT),'펼치면 끝낸 항목')
    ok(J(pg,"!document.querySelector('#htList .d106')"),'홈에도 오늘 한 단계 줄 없음')
print('ERRS',[e for e in errs if 'PAGEERR' in e][:5])
print('FAILS',len(FAILS),FAILS)
