# t150 (v13.13): 홈 내일 짜기 — ① 9시 이전(0~24시) 시각도 고르기 ② 관리를 놓으면 시간표에 블록이 보임(캘린더 보이기·숨기기가 켜져 있어도) ③ 관리 칩을 누르면 상세 팝업 · 뒤로 → 내일 짜기
import os,json
os.environ.setdefault('HQURL','file:///home/claude/habit-quest/beta/index.html')
exec(open('/home/claude/habit-quest/dev/v5/h61.py').read())
URL=os.environ.get('HQURL',URL)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
J=lambda pg,x:pg.evaluate(x)
def go_care(pg):
    J(pg,"""(()=>{const sq=[...document.querySelectorAll('#sheetC [data-w93go]')];const i=sq.findIndex(b=>/관리/.test(b.textContent));if(i>=0)sq[i].click()})()""");pg.wait_for_timeout(400)
def blk(pg,id):return J(pg,"!!document.querySelector(\"#sheetC .b93[data-w93b='%s']\")"%id)
def grid(pg,hour):   # 시간표를 hour 근처로 스크롤하고 그 시각의 화면 좌표를 돌려줌
    return J(pg,"""(h=>{const g=document.querySelector('#sheetC [data-w93g]'),sc=g.closest('.tt93s'),s0=+g.dataset.s0;sc.scrollTop=Math.max(0,h*60-s0-90);
      const r=g.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+(h*60-s0)+3}})(%d)"""%hour)
with sync_playwright() as pw:
  for W,H,nm in ((1200,900,'PC'),(390,800,'폰')):
    b0,pg=run(pw,W=W,H=H);closepops(pg)
    J(pg,"""(()=>{const a=addTaskFrom('책상 정리 %7');window.__care=a.id;const y=addDays(midKey68(),1);
      const b=addTaskFrom('이른일');b.due=y;saveTask(b);window.__todo=b.id;render()})()""")
    pg.wait_for_timeout(400)
    J(pg,"open93()");pg.wait_for_timeout(500)
    # ① 0~24시
    s0=J(pg,"+document.querySelector('#sheetC [data-w93g]').dataset.s0");hh=J(pg,"document.querySelector('#sheetC [data-w93g]').offsetHeight")
    ok(s0==0 and hh==1440,nm+' ① 시간표가 0시~24시 전부',(s0,hh))
    ok(J(pg,"document.querySelector('#sheetC .tt93s').scrollTop>0"),nm+' ① 처음엔 하루 시작(9시) 근처가 보임(맨 위 0시가 아님)',J(pg,"document.querySelector('#sheetC .tt93s').scrollTop"))
    # 이른일을 고르고 시간표 6시·3시 누르기(주 N회·종일 칸·정해진 일정 중 아무 단계의 칩)
    sel="#sheetC [data-w93s='%s']"%J(pg,"window.__todo")
    for i in range(5):
        if J(pg,"!!document.querySelector(\"%s\")"%sel):break
        J(pg,"(()=>{const n=document.querySelector('#sheetC [data-w93nav=\"1\"]');if(n)n.click()})()");pg.wait_for_timeout(300)
    pg.click(sel);pg.wait_for_timeout(300)
    c=grid(pg,6);pg.wait_for_timeout(150);pg.mouse.click(c['x'],c['y']);pg.wait_for_timeout(500)
    tm=J(pg,"TASKS[window.__todo].time")
    ok(tm=='06:00',nm+' ① 시간표 6시를 눌러 06:00에 놓임',tm)
    ok(blk(pg,J(pg,"window.__todo")),nm+' ① 06:00 블록이 보임')
    c=grid(pg,3);pg.wait_for_timeout(150);pg.mouse.click(c['x'],c['y']);pg.wait_for_timeout(500)
    ok(J(pg,"TASKS[window.__todo].time")=='03:00',nm+' ① 새벽 03:00도 놓임',J(pg,"TASKS[window.__todo].time"))
    # ③ 관리 칩 → 상세 팝업
    go_care(pg)
    chip="#sheetC [data-w93s='%s']"%J(pg,"window.__care")
    ok(J(pg,"!!document.querySelector(\"%s\")"%chip),nm+' ③ 관리 칩이 보임')
    pg.click(chip);pg.wait_for_timeout(700)
    txt=J(pg,"(document.querySelector('#sheetC')||{innerText:''}).innerText")
    ok(not J(pg,"!!document.querySelector('#sheetC .sel93')||!!document.querySelector('#sheetC [data-w93g]')"),nm+' ③ 관리 칩을 누르면 선택 줄·시간표 대신 상세 창이 뜸')
    ok('책상 정리' in txt and '시간표에 놓기' in txt,nm+' ③ 상세 창에 이 관리가 열림 · 📌 이번 차례 시간표에 놓기')
    ok(J(pg,"!!document.querySelector('#sheetC .back61')"),nm+' ③ ← 뒤로(내일 짜기) 단추가 있음')
    pg.click('#sheetC .back61');pg.wait_for_timeout(700)
    ok(J(pg,"!!document.querySelector('#sheetC [data-w93g]')&&!!document.querySelector(\"#sheetC [data-w93s='\"+window.__care+\"']\")"),nm+' ③ 뒤로 → 내일 짜기 관리 단계로 돌아옴')
    # ② 놓기: PC=칩 끌어 놓기 · 폰=알아서 넣기
    if nm=='PC':
        c=grid(pg,10);pg.wait_for_timeout(250)
        bb=J(pg,"(()=>{const r=document.querySelector(\"#sheetC [data-w93s='%s']\").getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()"%J(pg,"window.__care"))
        drag(pg,(bb['x'],bb['y']),(c['x'],c['y']))
    else:
        pg.click("#sheetC [data-w93auto]");pg.wait_for_timeout(600)
    cs=J(pg,"JSON.stringify(TASKS[window.__care].cs126||null)")
    ok('"m":"' in cs and '"m":""' not in cs,nm+' ② 관리가 시간표에 놓임(cs126)',cs)
    ok(blk(pg,J(pg,"window.__care")),nm+' ② 놓은 관리가 시간표 블록으로 나타남')
    b0.close()
  # ---- 캘린더 화면 보이기·숨기기(관리 숨기기)가 켜져 있어도 내일 짜기 시간표엔 다 보여야 함 ----
  for W,H,nm in ((1200,900,'PC'),(390,800,'폰')):
    b0,pg=run(pw,W=W,H=H);closepops(pg)
    J(pg,"""(()=>{const a=addTaskFrom('책상 정리 %7');window.__care=a.id;
      C.calf77={lists:[],areas:[],tags:[],kinds:['care'],inv:1};C.calf77t={lists:[],areas:[],tags:[],kinds:[],inv:0};save('config');location.hash='home';render()})()""")
    pg.wait_for_timeout(500)
    J(pg,"place126(TASKS[window.__care],addDays(midKey68(),1),'07:30');render()")
    J(pg,"open93()");pg.wait_for_timeout(500)
    ok(blk(pg,J(pg,"window.__care")),nm+' F① 관리 숨기기가 켜진 홈에서도 놓은 관리(07:30) 블록이 보임')
    ok(J(pg,"(()=>{const f=flt77();return f.inv===1&&f.kinds.includes('care')})()"),nm+' F② 캘린더 보이기·숨기기 설정은 그대로')
    J(pg,"closeSheet()");pg.wait_for_timeout(300)
    ok(J(pg,"!tasksOn(addDays(midKey68(),1)).some(t=>t.id===window.__care)"),nm+' F③ 내일 짜기를 닫으면 캘린더는 다시 관리를 숨김(거르기가 새지 않음)')
    b0.close()
real=[e for e in errs if 'favicon' not in e and 'ERR_' not in e and 'net::' not in e]
print('ERRS',real[:5])
print('FAILS',len(FAILS),FAILS)
