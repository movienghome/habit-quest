# t151 (v13.17): 홈 배치 새로고침 유지 · 끝낸 식사 블록 시간표에 남기기 · 주 N회 칩이 보이기 거르기에 안 걸림 · 칩 창 같은 이름 구분
import os,json
os.environ.setdefault('HQURL','file:///home/claude/habit-quest/beta/index.html')
exec(open('/home/claude/habit-quest/dev/v5/h61.py').read())
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
J=lambda pg,x:pg.evaluate(x)
with sync_playwright() as pw:
    # ① 홈 배치
    b0,pg=run(pw,W=1400,H=900);closepops(pg)
    J(pg,"location.hash='home'");pg.wait_for_timeout(700)
    J(pg,"homeEditOn(true)");pg.wait_for_timeout(300)
    J(pg,"document.querySelector('[data-x56hcol=\"today\"]').click()");pg.wait_for_timeout(300)
    J(pg,"homeEditOn(false)");pg.wait_for_timeout(700)
    after=J(pg,"JSON.stringify(C.ui.home)");st={k:v for k,v in json.loads(dump(pg))}
    b1,pg2=run(pw,W=1400,H=900,store=st);closepops(pg2)
    J(pg2,"location.hash='home'");pg2.wait_for_timeout(700)
    ok(J(pg2,"JSON.stringify(C.ui.home)")==after,'홈 배치(식사·빠른 기록 칸 포함)가 새로고침 뒤에도 그대로')
    # ② 끝낸 식사 블록
    b2,pg=run(pw,W=1400,H=900);closepops(pg)
    J(pg,"(()=>{C.ui=C.ui||{};C.ui.cal=Object.assign(C.ui.cal||{},{mode:'week'});location.hash='calendar';render()})()");pg.wait_for_timeout(900)
    J(pg,"(()=>{ml80cfg().on=1;save('config');mealEnsure80();render()})()");pg.wait_for_timeout(600)
    tid=J(pg,"(()=>{const k=midKey68();const t=Object.values(TASKS).find(t=>t.ml80&&t.status===0&&t.time);return t?t.id:null})()")
    ok(bool(tid),'식사 블록이 있음',tid)
    J(pg,"(()=>{const id=%s;const t=TASKS[id];ui.calAnchor=t.due;renderCal()})()"%json.dumps(tid));pg.wait_for_timeout(400)
    n0=J(pg,"document.querySelectorAll('#calPane .blk[data-ctask=\"%s\"]').length"%tid)
    J(pg,"completeTask(TASKS[%s])"%json.dumps(tid));pg.wait_for_timeout(600)
    J(pg,"renderCal()");pg.wait_for_timeout(300)
    ok(J(pg,"TASKS[%s].status"%json.dumps(tid))==2,'식사 완료 처리됨')
    n1=J(pg,"document.querySelectorAll('#calPane .blk.done[data-ctask=\"%s\"]').length"%tid)
    ok(n1>=1,'끝낸 식사가 시간표에 ✓ 블록으로 남음',(n0,n1))
    # ③ 주 N회 칩이 거르기에 안 걸림
    J(pg,"""(()=>{const t=newTask({title:'칩 시험 빨래'});t.rep={f:'x',n:2};t.list='inbox';t.aid=C.actions.find(a=>a.type==='good').id;saveTask(t);
      C.mig77f=1;C.calf77={lists:['Lfixed'],areas:[],tags:[],kinds:[],inv:0};C.calf77t={lists:['Lfixed'],areas:[],tags:[],kinds:[],inv:0};save('config');render()})()""");pg.wait_for_timeout(700)
    J(pg,"renderCal()");pg.wait_for_timeout(300)
    print('DBG',J(pg,"[side131(),fOn77(),location.hash,curView(),JSON.stringify(C.calf77)]"))
    ok(J(pg,"!![...document.querySelectorAll('.wk91 .c91')].find(b=>/칩 시험 빨래/.test(b.innerText))"),'목록 거르기(고정 목록만)에도 주 N회 칩은 칩 줄에 보임',J(pg,"[...document.querySelectorAll('.wk91 .c91')].map(b=>b.innerText.trim())"))
    # 같은 이름 둘 → 칩 창 구분
    J(pg,"""(()=>{const t=newTask({title:'칩 시험 빨래'});t.rep={f:'x',n:2};t.list='inbox';t.dur=30;t.aid=C.actions.find(a=>a.type==='good').id;saveTask(t);render()})()""");pg.wait_for_timeout(500)
    J(pg,"wkSheet121(Object.values(TASKS).find(t=>t.title==='칩 시험 빨래').id)");pg.wait_for_timeout(400)
    txt=J(pg,"document.querySelector('.sheet')?document.querySelector('.sheet').innerText:''")
    print('SHEET',txt[:600]);ok('같은 카드를 쓰는' in txt and '할 일 열기' in txt,'칩 창에 같은 이름 구분 문구',txt[-200:])
    J(pg,"""(()=>{const t=Object.values(TASKS).find(t=>t.title==='칩 시험 빨래');const k=addDays(midKey68(),1);t.sl91={[k]:'10:00'};saveTask(t);ui.calAnchor=midKey68();renderCal()})()""");pg.wait_for_timeout(500)
    ok(J(pg,"[...document.querySelectorAll('#calPane [data-ctask]')].some(e=>/칩 시험 빨래/.test(e.innerText))"),'칩을 날짜에 배치하면 거르기 중에도 다른 할 일과 같은 블록으로 보임')
    print('ERRS',[e for e in errs if 'favicon' not in e][:5])
    print('FAILS',FAILS)
