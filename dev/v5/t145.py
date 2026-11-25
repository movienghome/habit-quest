# t145 (v13.9): 캘린더 주 N회 칩 창·할 일 상세 ⋯에서 바로 🍅 뽀모도로 시작
import os,json
os.environ.setdefault('HQURL','file:///home/claude/habit-quest/beta/index.html')
exec(open('/home/claude/habit-quest/dev/v5/h61.py').read())
URL=os.environ.get('HQURL',URL)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
J=lambda pg,x:pg.evaluate(x)
def mk(pg):
    return J(pg,"""(()=>{const a=addTaskFrom('시나리오 쓰기');a.rep={f:'x',n:5};a.due=midKey68();saveTask(a);const b=addTaskFrom('청소 정리');saveTask(b);render();return [a.id,b.id]})()""")
with sync_playwright() as pw:
    for W,H,nm in ((1200,900,'PC'),(390,800,'폰')):
        b0,pg=run(pw,W=W,H=H);closepops(pg)
        ids=mk(pg);ok(len(ids)==2,nm+' 시험 할 일 만듦',ids)
        # ① 주 N회 칩 창
        J(pg,"wkSheet121('%s')"%ids[0]);pg.wait_for_timeout(400)
        ok(J(pg,"!!document.querySelector('#sheetC [data-pm137]')"),nm+' 칩 창에 🍅 시작 단추',J(pg,"(document.querySelector('#sheetC [data-pm137]')||{}).textContent"))
        ok('25분' in (J(pg,"(document.querySelector('#sheetC [data-pm137]')||{}).textContent") or ''),nm+' 단추에 설정 시간(25분)')
        pg.click('#sheetC [data-pm137]');pg.wait_for_timeout(500)
        ok(J(pg,"!!PM88&&PM88.run===true&&PM88.phase==='work'"),nm+' 칩 창에서 시작 → 타이머 돎',J(pg,"JSON.stringify(PM88)"))
        ok(J(pg,"PM88&&PM88.kid==='sc'&&PM88.kind==='시나리오 집필'"),nm+' 이름에 맞는 기존 종류(시나리오 집필)로 시작',J(pg,"PM88&&PM88.kind"))
        ok(J(pg,"(C.pomo88&&C.pomo88.kinds||pget88().kinds).length")==2,nm+' 종류가 새로 늘지 않음')
        ok(J(pg,"$('sheet').hidden"),nm+' 시작하면 창이 닫힘')
        # 이미 돌고 있을 때 또 누르면 덮어쓰지 않고 창만
        t0=J(pg,"PM88.t0")
        J(pg,"wkSheet121('%s')"%ids[0]);pg.wait_for_timeout(300);pg.click('#sheetC [data-pm137]');pg.wait_for_timeout(600)
        ok(J(pg,"PM88.t0")==t0,nm+' 돌고 있을 땐 덮어쓰지 않음')
        ok(J(pg,"!!(sheetCtx&&sheetCtx.pomo88)"),nm+' 대신 뽀모도로 창이 열림')
        J(pg,"pStop88(false)");pg.wait_for_timeout(200)
        # ② 상세 ⋯ 메뉴
        J(pg,"openTaskSheet('%s')"%ids[1]);pg.wait_for_timeout(500)
        pg.click('#sheetC [data-m78="more"]');pg.wait_for_timeout(300)
        its=J(pg,"[...document.querySelectorAll('#m61 button, #m61 .mi, #m61 [role=menuitem]')].map(x=>x.textContent.trim())")
        ok(any('🍅' in x for x in its),nm+' 상세 ⋯ 메뉴에 🍅 항목',its)
        ok(any('🍅' in x for x in its[:2]),nm+' 메뉴 위쪽(둘째 안)에 있음')
        pg.click('#m61 >> text=🍅');pg.wait_for_timeout(600)
        ok(J(pg,"!!PM88&&PM88.run===true"),nm+' ⋯에서 시작 → 타이머 돎')
        ok(J(pg,"PM88.kind==='청소 정리'"),nm+' 맞는 종류가 없으면 그 이름으로 새 종류',J(pg,"PM88&&PM88.kind"))
        ok(J(pg,"pget88().kinds.some(k=>k.name==='청소 정리')")and J(pg,"C.pomo88.kinds.some(k=>k.name==='청소 정리')"),nm+' 새 종류가 설정에 저장됨')
        ok(J(pg,"$('sheet').hidden")and J(pg,"!!document.querySelector('#pomoBtn88.on88')"),nm+' 머리 🍅 단추가 켜짐')
        # 끝난 할 일 상세 ⋯엔 안 나옴
        J(pg,"pStop88(false);(()=>{const t=TASKS['%s'];t.status=1;saveTask(t)})()"%ids[1]);
        J(pg,"openTaskSheet('%s')"%ids[1]);pg.wait_for_timeout(400)
        has=J(pg,"!!document.querySelector('#sheetC [data-m78=\"more\"]')")
        if has:
            pg.click('#sheetC [data-m78="more"]');pg.wait_for_timeout(250)
            ok(not any('🍅' in x for x in J(pg,"[...document.querySelectorAll('#m61 button, #m61 .mi, #m61 [role=menuitem]')].map(x=>x.textContent.trim())")),nm+' 끝난 할 일엔 🍅 항목 없음')
        b0.close()
real=[e for e in errs if 'favicon' not in e and 'ERR_' not in e and 'net::' not in e]
print('ERRS',real[:5])
print('FAILS',len(FAILS),FAILS)
