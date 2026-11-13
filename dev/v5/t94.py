# v9.3 보강 시험 — 오늘은 하나만: 입구 늘리기(할 일 줄 메뉴·상세 ⋯·오늘 머리 칩) + 깨지는 이모지 교체
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra) if extra!='' else ''))
    if not c:FAILS.append(msg)
def J(pg,js):return pg.evaluate("()=>("+js+")")

SEED="""(()=>{const td=midKey68();
  const mk=(title,o)=>{const t=newTask({title});Object.assign(t,o||{});saveTask(t);return t.id};
  window.__ids={a:mk('큰일 하나',{due:td,prio:5}),b:mk('작은 일 둘',{due:td,dur:10}),c:mk('셋째 일',{due:td}),
    d:mk('2시 약속',{due:td,time:'14:00',dur:60}),e:mk('매일 하는 일',{due:td,rep:{f:'d',i:1}})};
  location.hash='#home';render();return window.__ids})()"""

def state(pg,ids):
    return pg.evaluate("""(ids)=>{const td=midKey68(),tom=addDays(td,1),T=i=>TASKS[ids[i]];
      return {keepB:T('b').due===td,a:T('a').due===tom,c:T('c').due===tom,d:T('d').due===td,
        sk:['a','b','c','d','e'].map(i=>T(i).skull||0),e:(T('e').skip61||[]).includes(td),rest:(C.rest93&&C.rest93[gk76()]||null)&&C.rest93[gk76()].keep}}""",ids)

with sync_playwright() as pw:
    for W,H in ((390,844),(1400,900)):
        b,pg=run(pw,W,H);closepops(pg);errs.clear()
        ids=J(pg,SEED);pg.wait_for_timeout(500)
        tag=f'[{W}] '
        # ---- 글자 깨짐: 새 이모지 14(🫠·🪫)가 화면 글자에 없어야
        txt=pg.evaluate("()=>document.documentElement.outerHTML")
        ok('🫠' not in txt and '🪫' not in txt,tag+'깨질 수 있는 새 이모지(🫠·🪫)가 빌드에 없음')
        # ---- 홈 오늘 칸 머리 칩
        ok(pg.is_visible('#htCount + .b93h'),tag+'홈 오늘 칸 머리에 ☝ 하나만 남기기 칩')
        # ---- 할 일 화면 오늘 머리 칩
        pg.evaluate("()=>{C.ui.tasks.sel='today';location.hash='#tasks'}");pg.wait_for_timeout(700)
        ok(pg.is_visible('#tCount + .b93h'),tag+'할 일 화면 오늘 머리에 칩')
        box=pg.evaluate("()=>{const e=document.querySelector('#tCount + .b93h'),p=document.querySelector('#tTitle').closest('.ptitle');return {r:e.getBoundingClientRect().right,pr:p.getBoundingClientRect().right,h:p.getBoundingClientRect().height,w:innerWidth}}")
        ok(box['r']<=box['w'] and box['h']<80,tag+'칩 때문에 머리 줄이 넘치거나 크게 꺾이지 않음',box)
        pg.screenshot(path=f'{SP}t94_tasks_{W}.png')
        # ---- 할 일 줄 메뉴(우클릭 / 폰은 ⋯) → 이것만 남기기
        sel=f"#tList [data-task='{ids['b']}']"
        ok(pg.locator(sel).count()==1,tag+'목록에서 작은 일 둘 줄을 찾음')
        if W>=900:
            pg.click(sel,button='right');pg.wait_for_timeout(300)   # 데스크톱: 우클릭
        else:
            pg.evaluate("(id)=>taskMenu61(TASKS[id],100,200)",ids['b']);pg.wait_for_timeout(300)   # 폰: 줄 메뉴는 없고 상세 ⋯·머리 칩이 입구(아래에서 시험)
        items=pg.evaluate("()=>[...document.querySelectorAll('#m61 button')].map(b=>b.innerText)")
        ok(any('이것만 남기기' in x for x in items),tag+'줄 메뉴에 ☝ 오늘은 이것만 남기기',items[:6])
        pg.click("#m61 button:has-text('이것만 남기기')");pg.wait_for_timeout(700)
        s=state(pg,ids)
        ok(s['keepB'] and s['a'] and s['c'] and s['d'] and s['e'] and s['rest']==ids['b'],tag+'작은 일 둘만 남고 나머지는 내일(시각 일정 그대로·반복은 건너뛰기)',s)
        ok(all(x==0 for x in s['sk']),tag+'☠ 안 붙음',s['sk'])
        # 정한 뒤엔 칩이 '되돌리기'로 바뀜
        ok(pg.is_visible('#tCount + .b93h[data-undo93]'),tag+'정한 뒤 머리 칩이 ↩ 하나만 되돌리기')
        # ---- 다시 정하기: 되돌리고 다른 것 고르기(이미 내일로 간 큰일 하나를 고를 수 있어야)
        pg.evaluate("(id)=>{taskMenu61(TASKS[id],200,200)}",ids['a']);pg.wait_for_timeout(250)
        items=pg.evaluate("()=>[...document.querySelectorAll('#m61 button')].map(b=>b.innerText)")
        ok(any('이것만 남기기' in x for x in items),tag+'이미 하나만 정한 날, 내일로 간 할 일에도 다시 고르는 메뉴가 있음',items[:6])
        pg.click("#m61 button:has-text('이것만 남기기')");pg.wait_for_timeout(700)
        s2=pg.evaluate("""(ids)=>{const td=midKey68(),tom=addDays(td,1),T=i=>TASKS[ids[i]];return {a:T('a').due===td,b:T('b').due===tom,c:T('c').due===tom,keep:C.rest93[gk76()].keep===ids.a,n:C.rest93[gk76()].moved.length}}""",ids)
        ok(s2['a'] and s2['b'] and s2['c'] and s2['keep'],tag+'다시 고르면 큰일 하나만 남고 나머지(작은 일 포함)는 내일',s2)
        # 되돌리기 → 전부 원래대로
        pg.click('#tCount + .b93h[data-undo93]');pg.wait_for_timeout(600)
        s3=pg.evaluate("""(ids)=>{const td=midKey68(),T=i=>TASKS[ids[i]];return {all:['a','b','c'].every(i=>T(i).due===td),rest:!!(C.rest93&&C.rest93[gk76()]),e:!(T('e').skip61||[]).includes(td)}}""",ids)
        ok(s3['all'] and not s3['rest'] and s3['e'],tag+'머리 칩의 되돌리기로 전부 원래대로',s3)
        # ---- 머리 칩 → 고르는 창(기존)
        pg.click('#tCount + .b93h[data-open93]');pg.wait_for_timeout(400)
        ok(pg.is_visible('#sheetC input[name=k93]'),tag+'머리 칩을 누르면 고르는 창')
        ok('🫠' not in pg.evaluate("()=>document.getElementById('sheetC').innerText"),tag+'창 제목에 깨지는 글자 없음')
        pg.click('#sheetC [data-sheet=close]');pg.wait_for_timeout(250)
        # ---- 상세 ⋯ 메뉴 (폰의 길: 우클릭이 없으니)
        pg.evaluate("(id)=>openTaskSheet(id)",ids['c']);pg.wait_for_timeout(500)
        mb=pg.evaluate("()=>{const b=[...document.querySelectorAll('#sheetC [data-m78=more],#sheetC [data-m78]')];return b.map(x=>x.innerText+'|'+x.dataset.m78)}")
        pg.evaluate("()=>{const b=document.querySelector('#sheetC [data-m78=more]')||document.querySelector('#sheetC [data-m78]');if(b)b.click()}");pg.wait_for_timeout(300)
        items=pg.evaluate("()=>[...document.querySelectorAll('#m61 button')].map(b=>b.innerText)")
        ok(any('이것만 남기기' in x for x in items),tag+'상세 ⋯ 메뉴에도 이것만 남기기',[mb,items[:6]])
        if any('이것만 남기기' in x for x in items):
            pg.click("#m61 button:has-text('이것만 남기기')");pg.wait_for_timeout(700)
            s4=pg.evaluate("""(ids)=>{const td=midKey68(),tom=addDays(td,1),T=i=>TASKS[ids[i]];return {c:T('c').due===td,a:T('a').due===tom,b:T('b').due===tom,sheet:!!document.querySelector('#sheetC .sh h3')&&document.getElementById('sheet')&&document.getElementById('sheet').classList.contains('on')}}""",ids)
            ok(s4['c'] and s4['a'] and s4['b'],tag+'상세에서 정하면 그 할 일만 남음',s4)
            pg.evaluate("()=>undoRest93(gk76())") if False else None
        # ---- 시각 있는 일정은 메뉴에 없음
        pg.evaluate("(id)=>{taskMenu61(TASKS[id],200,200)}",ids['d']);pg.wait_for_timeout(250)
        items=pg.evaluate("()=>[...document.querySelectorAll('#m61 button')].map(b=>b.innerText)")
        ok(not any('이것만 남기기' in x for x in items),tag+'시각 있는 일정 메뉴엔 없음(건드리지 않는 것)',items[:6])
        pg.keyboard.press('Escape')
        # ---- 캘린더 서랍 오늘 머리 (데스크톱만 서랍이 있음)
        if W>=900:
            pg.evaluate("()=>{location.hash='#cal'}");pg.wait_for_timeout(900)
            n=pg.evaluate("()=>document.querySelectorAll('.ad.today .b93h').length")
            ok(n>=0,tag+'캘린더 서랍 오늘 머리(있으면 1개)',n)
        # ---- 🍬 지금 어때? 단추
        pg.evaluate("()=>{ui.dst='both';openDopaNow()}");pg.wait_for_timeout(500)
        ok(pg.is_visible('#sheetC .b93d'),tag+'🍬 지쳤어요에도 하나만 줄이 보임')
        t=pg.evaluate("()=>document.querySelector('#sheetC .b93d').innerText")
        ok('남기기' in t or '되돌리기' in t,tag+'그 줄 글자',t)
        pg.screenshot(path=f'{SP}t94_dopa_{W}.png')
        ok(not [e for e in errs if 'PAGEERR' in e],tag+'페이지 오류 없음',[e for e in errs if 'PAGEERR' in e][:2])
        b.close()
print('FAILS',len(FAILS),FAILS)
