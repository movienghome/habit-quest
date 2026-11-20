# t112 (v10.9): 루틴 오늘은 건너뛰기 — 카드 머리줄 · 실행 화면 그만 창
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
J=lambda pg,x:pg.evaluate(x)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
def notoast(pg):
    J(pg,"(()=>{const t=document.getElementById('toast');if(t){t.classList.remove('on');t.style.pointerEvents=''}})()")
def mk(pg,name):
    J(pg,"""(()=>{const r=rtNew61('%s',[{name:'세수',min:2},{name:'스트레칭',min:3}]);setRt60(r,[0,1,2,3,4,5,6]);syncDailies(C);save('config');render();window.__rid=r.id})()"""%name)
    pg.wait_for_timeout(500);notoast(pg)
def st(pg):return J(pg,"JSON.stringify((()=>{const t=rtT(C.routines.find(x=>x.id===window.__rid));return t?{due:t.due,skip:t.skip61||[],td:dateKey()}:null})())")
with sync_playwright() as pw:
  for W,H in [(390,800),(1200,800)]:
    # ① 카드 머리줄 단추
    b,pg=run(pw,W=W,H=H);notoast(pg);mk(pg,'T아침루틴')
    J(pg,"openRt61(window.__rid)");pg.wait_for_timeout(400)
    ok(J(pg,"!!document.querySelector('#sheetC .sh [data-sk108]')"),f'[{W}] 루틴 카드 머리줄에 ⏭ 오늘 건너뛰기')
    top=J(pg,"(()=>{const e=document.querySelector('#sheetC [data-sk108]');const r=e.getBoundingClientRect();return [r.top,r.bottom,innerHeight,r.right,innerWidth]})()")
    ok(0<=top[0] and top[1]<=top[2] and top[3]<=top[4],f'[{W}] 단추가 스크롤 없이 화면 안에 보임',top)
    pg.screenshot(path=f'/tmp/t112_card_{W}.png')
    pg.click('#sheetC [data-sk108]');pg.wait_for_timeout(500)
    s=json.loads(st(pg));ok(s['skip']==[s['td']] and s['due']>s['td'],f'[{W}] 누르면 오늘 건너뜀 · due 내일',s)
    ok(not J(pg,"[...document.querySelectorAll('.trow')].some(e=>/T아침루틴/.test(e.innerText))") or W>760,f'[{W}] 오늘 목록에서 빠짐')
    ok(not J(pg,"!!document.getElementById('sheetC')&&document.getElementById('sheetC').offsetParent!==null&&!!document.querySelector('#sheetC [data-sk108]')"),f'[{W}] 카드 닫힘')
    # 되돌리기
    J(pg,"document.querySelector('#toast button')&&document.querySelector('#toast button').click()");pg.wait_for_timeout(400)
    s=json.loads(st(pg));ok(s['skip']==[] and s['due']==s['td'],f'[{W}] 되돌리기',s)
    # 이미 건너뛴 날엔 단추 없음
    J(pg,"skipToday61(rtT(C.routines.find(x=>x.id===window.__rid)))");pg.wait_for_timeout(300);notoast(pg)
    J(pg,"openRt61(window.__rid)");pg.wait_for_timeout(300)
    ok(not J(pg,"!!document.querySelector('#sheetC [data-sk108]')"),f'[{W}] 이미 건너뛴 루틴엔 머리줄 단추 없음')
    ok(errs==[],f'[{W}] 오류 없음',errs[:3]);errs.clear();b.close()
    # ② 실행 화면 그만 창
    b,pg=run(pw,W=W,H=H);notoast(pg);mk(pg,'T저녁루틴')
    J(pg,"startRun({routine:C.routines.find(x=>x.id===window.__rid)})");pg.wait_for_timeout(500)
    pg.click('[data-hunt=quit]');pg.wait_for_timeout(300)
    ok(J(pg,"!!document.querySelector('#hunt .q62 [data-sk108]')"),f'[{W}] 그만 창에 ⏭ 오늘은 건너뛰기(끝낸 단계 없음)')
    pg.screenshot(path=f'/tmp/t112_quit_{W}.png')
    pg.click('#hunt .q62 [data-sk108]');pg.wait_for_timeout(500)
    s=json.loads(st(pg));ok(s['skip']==[s['td']] and s['due']>s['td'],f'[{W}] 실행 화면에서 건너뜀',s)
    ok(J(pg,"!RUN&&document.getElementById('hunt').hidden"),f'[{W}] 실행 화면 닫힘')
    ok(errs==[],f'[{W}] 오류 없음',errs[:3]);errs.clear();b.close()
    # ③ 한 단계 끝낸 뒤엔 그만 창에 건너뛰기 없음
    b,pg=run(pw,W=W,H=H);notoast(pg);mk(pg,'T점심루틴')
    J(pg,"startRun({routine:C.routines.find(x=>x.id===window.__rid)})");pg.wait_for_timeout(400)
    J(pg,"huntDo('done')");pg.wait_for_timeout(500)
    if J(pg,"!!RUN"):
        pg.click('[data-hunt=quit]');pg.wait_for_timeout(300)
        ok(not J(pg,"!!document.querySelector('#hunt .q62 [data-sk108]')"),f'[{W}] 단계를 끝낸 뒤엔 그만 창에 건너뛰기 없음')
    b.close()
print('FAILS',len(FAILS),FAILS)
