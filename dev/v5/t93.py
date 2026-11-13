# v9.3 시험 — 다시 씩씩해지기: 오늘은 하나만 · 복귀 표시 · 다시 오르는 길 · 🍬 지쳤어요 단추
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra) if extra!='' else ''))
    if not c:FAILS.append(msg)
def J(pg,js):return pg.evaluate("()=>("+js+")")

SEED="""(()=>{const td=midKey68(),g=dateKey();
  const mk=(title,o)=>{const t=newTask({title});Object.assign(t,o||{});saveTask(t);return t.id};
  window.__ids={a:mk('큰일 하나',{due:td,prio:5}),b:mk('작은 일 둘',{due:td,dur:10}),c:mk('셋째 일',{due:td}),
    d:mk('2시 약속',{due:td,time:'14:00',dur:60}),e:mk('매일 하는 일',{due:td,rep:{f:'d',i:1}})};
  // 3일 전에만 기록이 있고 어제는 비어 있음 → 어제는 '비운 날'
  const k3=addDays(g,-3);DAYS[k3]=DAYS[k3]||normDay(k3,{});DAYS[k3].entries=[{id:'t93seed',kind:'act',type:'good',name:'옛 기록',xp:5,cond:0,gold:0,t:'10:00'}];
  location.hash='#home';render();return window.__ids})()"""

with sync_playwright() as pw:
    for W,H in ((390,844),(1400,900)):
        b,pg=run(pw,W,H);closepops(pg);errs.clear()
        ids=J(pg,SEED);pg.wait_for_timeout(500)
        tag=f'[{W}] '
        # ---- 1. 다시 오르는 길 줄 (어제 비움)
        t=pg.evaluate("()=>{const r=document.querySelector('#alerts .b93');return r?r.innerText:null}")
        ok(t and '다시 오르는 길' in t and '비운 날' in t,tag+'경보판 맨 위에 다시 오르는 길(어제 비운 날)',t)
        ok(J(pg,"document.querySelector('#alerts li:first-child').classList.contains('b93')"),tag+'그 줄이 맨 위')
        # ---- 2. 오늘은 하나만: 실제 단추 → 창 → 고르기 → 정하기
        pg.click('#alerts .b93 [data-open93]');pg.wait_for_timeout(400)
        rd=pg.evaluate("()=>[...document.querySelectorAll('#sheetC input[name=k93]')].map(r=>({v:r.value,c:r.checked}))")
        vs=[r['v'] for r in rd]
        ok(all(ids[i] in vs for i in 'abce') and ids['d'] not in vs and '' in vs,tag+'후보에 한 번짜리·반복이 있고 시각 있는 일정은 빠지고 하나도 안 남기기가 있음',len(rd))
        ok(rd and rd[0]['v']==ids['a'] and rd[0]['c'],tag+'추천(중요도 높은 것)이 먼저·기본 선택')
        ok('2시 약속' in J(pg,"document.getElementById('sheetC').innerText"),tag+'시각 있는 일정은 그대로라고 안내')
        pg.click(f"#sheetC input[name=k93][value='{ids['b']}']");pg.wait_for_timeout(150)
        ok(J(pg,"document.querySelector('#sheetC input[name=k93]:checked').value")==ids['b'],tag+'다른 걸 고를 수 있음')
        pg.click('#sheetC [data-go93]');pg.wait_for_timeout(700)
        s=pg.evaluate("""(ids)=>{const td=midKey68(),tom=addDays(td,1),T=i=>TASKS[ids[i]];
          return {a:T('a').due===tom,c:T('c').due===tom,b:T('b').due===td,d:T('d').due===td,
            sk:['a','b','c','d','e'].map(i=>T(i).skull||0),mv:[T('a').moved72||0,T('c').moved72||0,T('b').moved72||0],
            e:{skip:(T('e').skip61||[]).includes(td),due:T('e').due>td},rec:!!(C.rest93&&C.rest93[dateKey()]),
            keep:C.rest93&&C.rest93[dateKey()]&&C.rest93[dateKey()].keep===ids.b}}""",ids)
        ok(s['a'] and s['c'],tag+'나머지 한 번짜리는 내일로',s)
        ok(s['b'] and s['d'],tag+'고른 것·시각 있는 일정은 오늘 그대로')
        ok(s['sk']==[0,0,0,0,0],tag+'☠ 하나도 안 붙음',s['sk'])
        ok(s['mv']==[1,1,0],tag+'사정상 옮김으로 셈(moved72)',s['mv'])
        ok(s['e']['skip'] and s['e']['due'],tag+'반복 할 일은 오늘 건너뛰기(다음 차례로)')
        ok(s['rec'] and s['keep'],tag+'오늘 기록 C.rest93 저장')
        t=pg.evaluate("()=>{const r=document.querySelector('#alerts .b93');return r?r.innerText:null}")
        ok(t and '큰일' not in t and '작은 일 둘' in t and '하나만' in t,tag+'경보판이 오늘은 하나만 줄로 바뀜',t)
        # ---- 3. 되돌리기 (경보판 단추)
        pg.click('#alerts .b93 [data-undo93]');pg.wait_for_timeout(600)
        s=pg.evaluate("""(ids)=>{const td=midKey68(),T=i=>TASKS[ids[i]];
          return {a:T('a').due===td,c:T('c').due===td,mv:[T('a').moved72||0,T('c').moved72||0],e:(T('e').skip61||[]).length,edue:T('e').due,rec:!!(C.rest93&&C.rest93[dateKey()])}}""",ids)
        ok(s['a'] and s['c'] and s['mv']==[0,0] and s['e']==0 and not s['rec'],tag+'되돌리면 날짜·건너뛰기·기록 모두 원래대로',s)
        t=pg.evaluate("()=>{const r=document.querySelector('#alerts .b93');return r?r.innerText:null}")
        ok(t and '다시 오르는 길' in t,tag+'되돌린 뒤 다시 오르는 길 줄로 돌아옴')
        # ---- 4. 복귀: 오늘 첫 좋은 기록
        pg.evaluate("(ids)=>{const t=TASKS[ids.b];completeTask(t);render()}",ids);pg.wait_for_timeout(900)
        bk=J(pg,"C.back93&&C.back93[dateKey()]")
        ok(bk and bk['n']==2 and bk['from']=='gap',tag+'첫 걸음 → 복귀 표시(2일 비운 뒤)',bk)
        t=pg.evaluate("()=>{const r=document.querySelector('#alerts .b93');return r?r.innerText:null}")
        ok(t and '다시 씩씩해졌어요' in t and '2일 만에' in t and '복귀 1번째' in t,tag+'경보판이 복귀 줄로 바뀜',t)
        ok(J(pg,"(DAYS[dateKey()].entries||[]).some(e=>e.back93===2)"),tag+'기록에 복귀 표시(back93)')
        # 두 번째 기록은 복귀를 또 만들지 않음
        n0=J(pg,"Object.keys(C.back93).length")
        pg.evaluate("(ids)=>{completeTask(TASKS[ids.c]);render()}",ids);pg.wait_for_timeout(400)
        ok(J(pg,"Object.keys(C.back93).length")==n0,tag+'둘째 기록은 복귀를 또 만들지 않음')
        # 첫 기록을 지우면 복귀 표시도 지워짐
        pg.evaluate("()=>{const d=DAYS[dateKey()],e=d.entries.find(x=>x.back93);removeEntry(d.date,e.id)}");pg.wait_for_timeout(500)
        ok(not J(pg,"C.back93&&C.back93[dateKey()]"),tag+'그 기록을 되돌리면 복귀 표시도 사라짐')
        # ---- 5. 힘든 날(low)·쉬는 날 다음 날 — 복귀 보너스 확장
        r=pg.evaluate("""()=>{const g=dateKey(),y=addDays(g,-1);const had=!!DAYS[y];
          const before=recoveryActive();C.rest93=C.rest93||{};C.rest93[y]={keep:null,moved:[],at:1,td:y,tom:g};const after=recoveryActive();delete C.rest93[y];
          return {before,after}}""")
        ok(r['before'] is False and r['after'] is True,tag+'쉬어 간 다음 날은 복귀 보너스 켜짐(원래는 꺼짐)',r)
        pg.evaluate("()=>{const y=addDays(dateKey(),-1);DAYS[y]=normDay(y,{});DAYS[y].entries=[{id:'t93y',kind:'act',type:'good',name:'어제',xp:5,cond:0,gold:0,t:'09:00'}];C.recovery=C.recovery||{};C.__thr=C.recovery.threshold;C.recovery.threshold=999;delete C.back93[dateKey()];location.hash='#home';render()}")
        pg.wait_for_timeout(500)
        t=pg.evaluate("()=>{const r=document.querySelector('#alerts .b93');return r?r.innerText:null}")
        ok(t and '힘든 날' in t and '복귀하면 경험치' in t,tag+'컨디션 낮았던 다음 날: 힘든 날 + 복귀 보너스 안내',t)
        pg.evaluate("()=>{C.recovery.threshold=C.__thr;delete C.__thr}")
        # ---- 6. 🍬 지쳤어요에서 같은 단추
        pg.evaluate("()=>{location.hash='#home';render();openDopaNow('both')}");pg.wait_for_timeout(600)
        ok(pg.is_visible('#sheetC .b93d [data-open93]'),tag+'😞 심신이 지쳤어요에 오늘은 하나만 단추')
        pg.click('#sheetC .b93d [data-open93]');pg.wait_for_timeout(400)
        ok(pg.evaluate("()=>document.querySelectorAll('#sheetC input[name=k93]').length")>=1,tag+'단추를 누르면 고르는 창이 열림')
        pg.click('#sheetC [data-sheet=close]');pg.wait_for_timeout(300)
        # ---- 7. 화면
        ok(J(pg,"document.documentElement.scrollWidth<=innerWidth"),tag+'가로로 안 넘침')
        pg.screenshot(path=f'/tmp/m93_{W}.png')
        ok(not errs,tag+'콘솔 오류 없음',errs[:3])
        b.close()

print('FAILS',len(FAILS),FAILS)
