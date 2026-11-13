# v9.5 시험 (t98) — 내일 짜기 시간표: 고르고 → 놓기/옮기기 · 길이 · 되돌리기 · 정해진 일정 시각 바꾸기
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra) if extra!='' else ''))
    if not c:FAILS.append(msg)
def J(pg,js):return pg.evaluate("()=>("+js+")")
SEED="""(()=>{const tom=addDays(midKey68(),1);
 const mk=(title,o)=>{const t=newTask({title});Object.assign(t,o||{});saveTask(t);return t.id};
 window.__ids={a:mk('동훈 미팅',{due:tom,list:'fixed',time:'14:00',dur:60}),b:mk('하그둘 만남',{due:tom,list:'fixed'}),
   c:mk('편집 강의 듣기',{due:tom,dur:45}),d:mk('밀프렙하기',{due:tom,dur:60}),e:mk('영상 정리',{due:tom,time:'15:00',dur:90}),
   w:mk('시나리오 쓰기',{rep:{f:'x',n:5},dur:25})};
 render();return window.__ids})()"""
def clickMin(pg,m):
    r=pg.evaluate("()=>{const g=document.querySelector('#sheetC [data-w93g]');const b=g.getBoundingClientRect();return {t:b.top,l:b.left,w:b.width,s0:+g.dataset.s0,h:b.height}}")
    sc=pg.evaluate("()=>{const s=document.querySelector('#sheetC .tt93s').getBoundingClientRect();return [s.top,s.bottom]}")
    y=r['t']+(m-r['s0'])+2
    if y<sc[0]+4 or y>sc[1]-4:
        pg.evaluate(f"()=>{{const s=document.querySelector('#sheetC .tt93s');s.scrollTop+= {y}-({sc[0]}+{sc[1]})/2}}");pg.wait_for_timeout(100)
        r=pg.evaluate("()=>{const g=document.querySelector('#sheetC [data-w93g]');const b=g.getBoundingClientRect();return {t:b.top,l:b.left,w:b.width,s0:+g.dataset.s0}}")
        y=r['t']+(m-r['s0'])+2
    pg.mouse.click(r['l']+r['w']-12,y);pg.wait_for_timeout(700)
with sync_playwright() as pw:
    for W,H in ((390,844),(1400,900)):
        b,pg=run(pw,W,H);closepops(pg);errs.clear();tag=f'[{W}] '
        ids=J(pg,SEED);pg.wait_for_timeout(300)
        pg.evaluate("()=>planSheet80()");pg.wait_for_timeout(600)
        ok(J(pg,"!!document.querySelector('#sheetC .tt93g')"),tag+'첫 단계에 시간표가 보임')
        ok(J(pg,f"!!document.querySelector('#sheetC .b93.cur[data-w93b=\"{ids['a']}\"]')"),tag+'정해진 일정 블록(14:00)이 강조로 보임')
        ok(J(pg,f"!!document.querySelector('#sheetC .b93:not(.cur)[data-w93b=\"{ids['e']}\"]')"),tag+'다른 시각 일정은 연하게')
        # 1. 시각 없는 정해진 일정 → 고르고 → 시간표 눌러 놓기
        pg.click(f"#sheetC [data-w93s='{ids['b']}']");pg.wait_for_timeout(300)
        ok(J(pg,"!!document.querySelector('#sheetC .sel93')"),tag+'고르면 선택 줄이 뜸')
        clickMin(pg,18*60)
        ok(J(pg,f"TASKS['{ids['b']}'].time")=='18:00',tag+'시간표 18시를 눌러 놓음',J(pg,f"TASKS['{ids['b']}'].time"))
        ok(J(pg,f"TASKS['{ids['b']}'].dur")==30,tag+'길이 없으면 30분')
        # 2. 이미 정해진 일정 시각 바꾸기: 블록 눌러 선택 → 다른 곳 눌러 옮기기
        pg.click(f"#sheetC .b93[data-w93b='{ids['a']}']");pg.wait_for_timeout(300)
        ok(J(pg,f"document.querySelector('#sheetC .sel93 b').innerText")=='동훈 미팅',tag+'놓인 블록을 누르면 선택됨')
        clickMin(pg,11*60)
        ok(J(pg,f"TASKS['{ids['a']}'].time")=='11:00',tag+'이미 정해진 일정 14:00→11:00으로 옮김',J(pg,f"TASKS['{ids['a']}'].time"))
        # 3. 길이 +15, 되돌리기
        pg.click("#sheetC [data-w93len='15']");pg.wait_for_timeout(600)
        ok(J(pg,f"TASKS['{ids['a']}'].dur")==75,tag+'길이 +15분',J(pg,f"TASKS['{ids['a']}'].dur"))
        pg.click("#sheetC [data-w93u]");pg.wait_for_timeout(600)
        ok(J(pg,f"TASKS['{ids['a']}'].dur")==60,tag+'되돌리기(길이)')
        # 4. 시각 입력으로 정확히
        if not J(pg,"!!document.querySelector('#sheetC .sel93')"):
            pg.click(f"#sheetC .b93[data-w93b='{ids['a']}']");pg.wait_for_timeout(300)
        pg.fill("#sheetC [data-w93seltm]","10:20");pg.dispatch_event("#sheetC [data-w93seltm]","change");pg.wait_for_timeout(600)
        ok(J(pg,f"TASKS['{ids['a']}'].time")=='10:20',tag+'시각 입력으로 정확히 바꿈')
        # 5. 시간 빼기 → 시각 없는 일정으로 돌아옴(트레이)
        pg.click("#sheetC [data-w93off]");pg.wait_for_timeout(600)
        ok(J(pg,f"TASKS['{ids['a']}'].time")==None,tag+'시간 빼기')
        ok(J(pg,f"!!document.querySelector('#sheetC [data-w93s=\"{ids['a']}\"]')"),tag+'트레이로 돌아옴')
        # 6. 다음 단계(주 N회): 고르고 놓기 → 자리 생김
        pg.click("#sheetC [data-w93nav='1']");pg.wait_for_timeout(500)
        step=J(pg,"W93step")if False else None
        txt=J(pg,"document.getElementById('sheetC').innerText")
        ok('시나리오 쓰기' in txt,tag+'주 N회 단계에 시나리오가 트레이에 있음')
        pg.click(f"#sheetC [data-w93s='{ids['w']}']");pg.wait_for_timeout(300)
        clickMin(pg,9*60+30)
        tom=J(pg,"addDays(midKey68(),1)")
        ok(J(pg,f"(TASKS['{ids['w']}'].sl91||{{}})['{tom}']")=='09:30',tag+'주 N회 자리 9:30',J(pg,f"JSON.stringify(TASKS['{ids['w']}'].sl91)"))
        ok(J(pg,f"!!document.querySelector('#sheetC .b93.cur[data-w93b=\"{ids['w']}\"]')"),tag+'자리 블록이 시간표에 강조로 보임')
        # 7. 종일 칸 단계: 고르고 놓기, 알아서 넣기
        pg.click("#sheetC [data-w93nav='1']");pg.wait_for_timeout(500)
        pg.click(f"#sheetC [data-w93s='{ids['c']}']");pg.wait_for_timeout(300)
        clickMin(pg,13*60)
        ok(J(pg,f"TASKS['{ids['c']}'].time")=='13:00',tag+'종일 칸 일을 13시에 놓음',J(pg,f"TASKS['{ids['c']}'].time"))
        pg.click("#sheetC [data-w93q]") if J(pg,"!!document.querySelector('#sheetC [data-w93q]')") else None
        # 겹침 나란히
        pg.click(f"#sheetC [data-w93s='{ids['d']}']");pg.wait_for_timeout(300)
        clickMin(pg,13*60+15)
        o=J(pg,f"[...document.querySelectorAll('#sheetC .b93')].filter(x=>['{ids['c']}','{ids['d']}'].includes(x.dataset.w93b)).map(x=>x.style.width)")
        ok(len(o)==2 and o[0]==o[1] and '50%' in o[0],tag+'겹치면 나란히',o)
        ok(len(errs)==0,tag+'콘솔 오류 없음',errs[:3])
        pg.screenshot(path=f'/tmp/work/t98_{W}.png')
        b.close()
print('FAILS',len(FAILS),FAILS)
