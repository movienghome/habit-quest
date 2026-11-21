# t119 (v11.6): N21 루틴 상황별 프리셋 — 일반/출근/외근
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
J=lambda pg,x:pg.evaluate(x)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
def notoast(pg):J(pg,"(()=>{const t=document.getElementById('toast');if(t){t.classList.remove('on');t.style.pointerEvents=''}})()")
def mk(pg):
    J(pg,"""(()=>{const r=rtNew61('테스트 아침',[{name:'산책',min:10},{name:'명상',min:5},{name:'세수',min:2}]);setRt60(r,[0,1,2,3,4,5,6]);syncDailies(C);save('config');render();window.__rid=r.id})()""")
    pg.wait_for_timeout(700);notoast(pg)
    J(pg,"(()=>{const r=C.routines.find(x=>x.id===window.__rid);sync62(r);save('config');render()})()");pg.wait_for_timeout(500)
R="C.routines.find(x=>x.id===window.__rid)"
with sync_playwright() as pw:
  for W,H in [(1200,800),(390,800)]:
    b,pg=run(pw,W=W,H=H);closepops(pg);notoast(pg);mk(pg)
    ok(J(pg,f"{R}.steps.length")==3 and J(pg,f"{R}.steps.every(s=>s.tid&&TASKS[s.tid])"),f'[{W}] 루틴 단계 3개가 할 일로 생김')
    ok(J(pg,f"pk114({R})")=='n' and not J(pg,f"hasPre114({R})"),f'[{W}] 처음엔 일반 · 상황 없음')
    # 카드 열기 → 🧭 상황별 접힘 칸
    J(pg,f"openRt61(window.__rid)");pg.wait_for_timeout(400)
    ok(J(pg,"!!document.querySelector('#sheetC details.pe114')"),f'[{W}] 루틴 카드에 🧭 상황별 칸')
    ok(J(pg,"!document.querySelector('#sheetC details.pe114').open"),f'[{W}] 기본 접힘')
    J(pg,"document.querySelector('#sheetC details.pe114').open=true");pg.wait_for_timeout(200)
    # 출근 편집: 명상·세수 끄기
    pg.click('#sheetC [data-pe114$="|w"]');pg.wait_for_timeout(300)
    ok(J(pg,"document.querySelector('#sheetC details.pe114').open"),f'[{W}] 편집 탭을 눌러도 펼침 유지')
    for nm in ['명상','세수']:
        pg.locator('#sheetC .pe114r',has_text=nm).locator('input').uncheck();pg.wait_for_timeout(250)
    off=J(pg,f"JSON.stringify({R}.pre114)")
    ok(len(json.loads(off).get('w',[]))==2 and J(pg,f"offCnt114({R},'w')")==2,f'[{W}] 출근에서 명상·세수가 꺼짐',off)
    ok(J(pg,f"pk114({R})")=='n',f'[{W}] 편집만으론 오늘 상황은 안 바뀜(일반)')
    # 오늘 출근 고르기
    pg.click('#sheetC [data-pk114$="|w"]');pg.wait_for_timeout(400);notoast(pg)
    ok(J(pg,f"pk114({R})")=='w',f'[{W}] 오늘 🚗 출근 선택')
    ok('2단계 쉬어요' in J(pg,"document.querySelector('#sheetC details.pe114 summary').innerText"),f'[{W}] 칸 제목에 오늘 상황·쉬는 단계 수',J(pg,"document.querySelector('#sheetC details.pe114 summary').innerText"))
    # 효과: 완주 판정·타이머·목록 숨김
    ok(J(pg,f"(()=>{{const r={R};return rtNeed71(r,()=>false).st.length}})()")==1,f'[{W}] 완주 단계 목록 = 켜진 1개')
    ok(J(pg,f"(()=>{{const r={R};const s=r.steps[0];return rtNeed71(r,x=>x===s).ok}})()"),f'[{W}] 켜진 단계(산책)만 해도 완주')
    ok(J(pg,f"stDoneHide72(TASKS[{R}.steps[1].tid])")and not J(pg,f"stDoneHide72(TASKS[{R}.steps[0].tid])"),f'[{W}] 꺼진 단계는 목록에서 숨김 · 켜진 건 보임')
    J(pg,"closeSheet()");pg.wait_for_timeout(200)
    J(pg,f"RUN=null;startRun({{routine:{R}}})");pg.wait_for_timeout(500)
    rs=json.loads(J(pg,"JSON.stringify(RUN&&{n:RUN.steps.length,t:RUN.target,nm:RUN.steps.map(s=>s.name)})"))
    ok(rs and rs['n']==1 and rs['t']==10,f'[{W}] 타이머는 켜진 단계만(1개·10분)',rs)
    J(pg,"RUN=null;runSave();location.hash='tasks';render()");pg.wait_for_timeout(300)
    # 체크 창
    J(pg,f"rtDone64({R})");pg.wait_for_timeout(400)
    ok(J(pg,"document.querySelectorAll('#sheetC .d64r').length")==1,f'[{W}] 체크 창에도 켜진 1단계만')
    ok(J(pg,"!!document.querySelector('#sheetC .pr114row')"),f'[{W}] 체크 창 위에 상황 칩 줄(상황을 정한 루틴)')
    pg.click('#sheetC [data-pk114$="|n"]');pg.wait_for_timeout(400);notoast(pg)
    ok(J(pg,f"pk114({R})")=='n' and J(pg,"document.querySelectorAll('#sheetC .d64r').length")==3,f'[{W}] 체크 창에서 일반으로 바꾸면 3단계 다시')
    J(pg,"closeSheet()")
    # 날이 바뀌면 일반
    J(pg,f"(()=>{{const r={R};r.pk114={{d:addDays(gk76(),-1),p:'w'}}}})()")
    ok(J(pg,f"pk114({R})")=='n',f'[{W}] 어제 고른 상황은 오늘 일반')
    # 저장·다시 읽기에서 보존
    J(pg,f"(()=>{{const r={R};r.pk114={{d:gk76(),p:'o'}};save('config')}})()");pg.wait_for_timeout(300)
    ok(J(pg,f"JSON.stringify(C.routines.find(x=>x.id===window.__rid).pk114)")!='undefined',f'[{W}] 상황 값이 설정에 남음')
    # 목록 줄 칩: 오늘 차례 루틴 머리
    J(pg,"location.hash='tasks';render()");pg.wait_for_timeout(500)
    n=J(pg,"document.querySelectorAll('.pr114row .pr114').length")
    ok(n>=3 and n%3==0,f'[{W}] 목록 루틴 줄에 상황 칩(3개씩)',n)
    if W==390:
        ok(J(pg,"document.documentElement.scrollWidth<=window.innerWidth+1"),'[390] 폰에서 가로로 넘치지 않음')
    b.close()
print('ERRS',[e for e in errs if 'favicon' not in e][:6])
print('FAILS',len(FAILS),FAILS)
