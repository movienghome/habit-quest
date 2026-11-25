# t146 (v13.10): 시간표 블록(날짜 창)에도 🍅 시작 · 25분 채우면 주 N회 하루 한 번(v10.7 연결) 확인
import os,json
os.environ.setdefault('HQURL','file:///home/claude/habit-quest/beta/index.html')
exec(open('/home/claude/habit-quest/dev/v5/h61.py').read())
URL=os.environ.get('HQURL',URL)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
J=lambda pg,x:pg.evaluate(x)
def finish(pg):
    J(pg,"PM88.acc=PM88.dur-500;PM88.t0=Date.now()-2000;pSave88()");pg.wait_for_timeout(1800)
with sync_playwright() as pw:
    for W,H,nm in ((1200,900,'PC'),(390,800,'폰')):
        b0,pg=run(pw,W=W,H=H);closepops(pg)
        ids=J(pg,"""(()=>{const td=midKey68();const a=newTask({title:'시나리오 쓰기'});a.rep={f:'x',n:5};a.due=td;a.dur=30;a.sl91={[td]:'10:00'};C.mig120=1;C.mig121=1;saveTask(a);
          const b=addTaskFrom('청소 정리');saveTask(b);C.ui=C.ui||{};C.ui.cal=Object.assign(C.ui.cal||{},{mode:'week'});location.hash='calendar';render();return [a.id,b.id]})()""");pg.wait_for_timeout(900)
        wk="wkCnt91(TASKS['%s'],weekStart(midKey68()))"%ids[0]
        ok(J(pg,wk)==0,nm+' 처음 횟수 0')
        # ① 시간표 블록을 눌러 날짜 창
        sel=".blk[data-ctask='%s']"%ids[0]
        shown=J(pg,"!!document.querySelector(\"%s\")"%sel)
        if shown:
            pg.click(sel);pg.wait_for_timeout(500)
        else:
            J(pg,"daySheet120('%s',midKey68())"%ids[0]);pg.wait_for_timeout(400)
        ok(J(pg,"!!document.querySelector('#sheetC [data-d120=\"open\"]')"),nm+' 날짜 창이 뜸'+(' (블록 클릭)' if shown else ' (함수)'))
        ok(J(pg,"!!document.querySelector('#sheetC [data-pm137]')"),nm+' 날짜 창에 🍅 시작 단추')
        pg.click('#sheetC [data-pm137]');pg.wait_for_timeout(500)
        ok(J(pg,"!!PM88&&PM88.run===true&&PM88.kid==='sc'"),nm+' 시작 → 타이머(시나리오 집필)',J(pg,"JSON.stringify(PM88)"))
        ok(J(pg,"$('sheet').hidden"),nm+' 시작하면 창이 닫힘')
        finish(pg)
        ok(J(pg,wk)==1,nm+' 25분 채움 → 주 횟수 1(v10.7 연결이 셈)',J(pg,wk))
        ok(J(pg,"(C.pomo88.log||[]).length")==1,nm+' 뽀모도로 기록 1건')
        J(pg,"pAct88('next')");pg.wait_for_timeout(300);finish(pg)
        ok(J(pg,wk)==1 and J(pg,"(C.pomo88.log||[]).length")==2,nm+' 같은 날 두 번째 25분은 횟수 그대로(하루 한 번)',J(pg,wk))
        # 이미 돌고 있을 때 블록 창의 🍅는 덮어쓰지 않음
        t0=J(pg,"PM88.t0");J(pg,"daySheet120('%s',midKey68())"%ids[0]);pg.wait_for_timeout(300)
        pg.click('#sheetC [data-pm137]');pg.wait_for_timeout(500)
        ok(J(pg,"PM88.t0")==t0,nm+' 돌고 있을 땐 덮어쓰지 않음')
        J(pg,"pStop88(false)")
        # 끝낸 할 일 날짜 창엔 단추 없음은 데이터상 날짜 창 자체가 안 열림 → 생략
        b0.close()
real=[e for e in errs if 'favicon' not in e and 'ERR_' not in e and 'net::' not in e]
print('ERRS',real[:5])
print('FAILS',len(FAILS),FAILS)
