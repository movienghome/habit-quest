# t141 (v13.6): 루틴 단계 끌어서 순서 바꾸기
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
R="C.routines.find(x=>x.id===window.__rid)"
POOL=f"{R}.steps.map(s=>stName61(s))"
RUNO=f"effSteps117({R}).map(s=>stName61(s))"
def hc(pg,i):
    bb=J(pg,f"(()=>{{const b=document.querySelectorAll('#sheetC .st62s .dg134')[{i}].getBoundingClientRect();return {{x:b.x,y:b.y,width:b.width,height:b.height}}}})()")
    return ctr(bb)
def rowc(pg,i):
    bb=J(pg,f"(()=>{{const b=document.querySelectorAll('#sheetC .st62s > .st62')[{i}].getBoundingClientRect();return {{x:b.x,y:b.y,width:b.width,height:b.height}}}})()")
    return ctr(bb,0.5,0.5)
with sync_playwright() as pw:
  for W,H in [(1200,800),(390,800)]:
    b,pg=run(pw,W=W,H=H);closepops(pg);notoast(pg)
    J(pg,"""(()=>{const r=rtNew61('테스트 아침',[{name:'산책',min:10},{name:'명상',min:5},{name:'세수',min:2}]);setRt60(r,[0,1,2,3,4,5,6]);syncDailies(C);save('config');render();window.__rid=r.id})()""")
    pg.wait_for_timeout(700);notoast(pg)
    J(pg,f"(()=>{{const r={R};sync62(r);save('config');render()}})()");pg.wait_for_timeout(500)
    J(pg,"location.hash='tasks';render()");pg.wait_for_timeout(600);notoast(pg)
    J(pg,"openRt61(window.__rid)");pg.wait_for_timeout(500)
    # ---- 프리셋 하나 ----
    ok(J(pg,"document.querySelectorAll('#sheetC .st62s .dg134').length")==3,f'[{W}] 단계 줄마다 ⠿ 손잡이 3개')
    ok(J(pg,"[...document.querySelectorAll('#sheetC .st62s [data-r62op^=\"up:\"]')].every(e=>e.offsetParent===null)"),f'[{W}] ↑↓ 숨김')
    J(pg,"document.querySelector('#sheetC .dg134').scrollIntoView({block:'center'})");pg.wait_for_timeout(200)
    drag(pg,hc(pg,0),rowc(pg,2));notoast(pg)
    ok(J(pg,POOL)==['명상','세수','산책'],f'[{W}] 끌어서 산책이 맨 뒤로(화면 순서)',J(pg,POOL))
    ok(J(pg,RUNO)==['명상','세수','산책'],f'[{W}] 실제 실행 순서도 같음(effSteps117)',J(pg,RUNO))
    ok(J(pg,"[...document.querySelectorAll('#sheetC .st62s .st62n b')].map(e=>e.textContent)")==['명상','세수','산책'],f'[{W}] 다시 그린 화면 순서')
    # 키보드
    J(pg,"document.querySelectorAll('#sheetC .st62s .dg134')[2].focus()");pg.keyboard.press('ArrowUp');pg.wait_for_timeout(500);notoast(pg)
    ok(J(pg,RUNO)==['명상','산책','세수'],f'[{W}] 키보드 ↑로 한 칸 위',J(pg,RUNO))
    ok(J(pg,"document.activeElement&&document.activeElement.classList.contains('dg134')"),f'[{W}] 키보드 뒤 손잡이에 포커스 유지')
    # 아주 조금만 움직이면 그대로
    before=J(pg,RUNO);a=hc(pg,1);drag(pg,a,(a[0],a[1]+2),steps=2);notoast(pg)
    ok(J(pg,RUNO)==before,f'[{W}] 제자리에 놓으면 안 바뀜')
    # ---- 프리셋 둘 ----
    J(pg,"document.querySelector('#sheetC [data-pn117]').click()");pg.wait_for_timeout(500);notoast(pg)
    ok(J(pg,"document.querySelectorAll('#sheetC .st62s .dg134').length")==3,f'[{W}] 프리셋 둘이어도 손잡이 3개')
    J(pg,"document.querySelector('#sheetC .st62s .pc124:last-of-type, #sheetC .st62s .st62:last-child .pc124').click()");pg.wait_for_timeout(500);notoast(pg)   # 마지막 줄 체크 빼기 → 안 하는 단계
    nh=J(pg,"document.querySelectorAll('#sheetC .st62s .dg134').length")
    ok(nh==2,f'[{W}] 안 하는 단계 줄엔 손잡이 없음',nh)
    pool=J(pg,POOL);ps0=J(pg,f"{R}.ps117.map(p=>p.s.join())")
    J(pg,"document.querySelector('#sheetC .dg134').scrollIntoView({block:'center'})");pg.wait_for_timeout(200)
    drag(pg,hc(pg,0),rowc(pg,1));notoast(pg)
    ps1=J(pg,f"{R}.ps117.map(p=>p.s.join())")
    ok(ps1[0]==ps0[0] and ps1[1]!=ps0[1],f'[{W}] 편집 중인 새 프리셋 순서만 바뀜(기본 프리셋은 그대로)',(ps0,ps1))
    ok(J(pg,POOL)==pool,f'[{W}] 단계 풀 순서는 그대로')
    ok(J(pg,"document.querySelectorAll('#sheetC .st62s .st62.off124').length")==1,f'[{W}] 안 하는 단계는 그대로 아래')
    ok(not [e for e in errs if 'PAGEERR' in e],f'[{W}] 페이지 오류 없음',[e for e in errs if 'PAGEERR' in e][:2])
    b.close()
print('FAILS',len(FAILS),FAILS)
