# t115 (v11.2): 충동 대응(든든한 것→기다리기→대신하기)·금액·환산·아낀 돈 골드·보상함 넣기·설정
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
J=lambda pg,x:pg.evaluate(x)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
def notoast(pg):J(pg,"(()=>{const t=document.getElementById('toast');if(t){t.classList.remove('on');t.style.pointerEvents=''}})()")
def items(pg):return json.loads(J(pg,"JSON.stringify((today().imp110||[]).map(x=>({n:x.n,k:x.k,s:st110(x),a:x.a||0,w:!!x.w,fl:x.fl||'',alt:x.alt||''})))"))
def add(pg,txt,amt=''):
    pg.fill('#imp110N',txt)
    if amt!='':pg.fill('#imp110A',str(amt))
    pg.press('#imp110N','Enter');pg.wait_for_timeout(250);notoast(pg)
with sync_playwright() as pw:
  for W,H in [(390,800),(1200,800)]:
    b,pg=run(pw,W=W,H=H);notoast(pg)
    J(pg,"location.hash='home';render()");pg.wait_for_timeout(600);notoast(pg)
    pg.click('#battleBox .im110',timeout=3000);pg.wait_for_timeout(400)
    # 금액 입력 + 환산 줄
    pg.fill('#imp110N','마라탕');pg.fill('#imp110A','30000');pg.wait_for_timeout(100)
    ok('한 달 약' in J(pg,"document.getElementById('imp110C').innerText"),f'[{W}] 금액을 적으면 월·연 환산 줄',J(pg,"document.getElementById('imp110C').innerText"))
    pg.press('#imp110N','Enter');pg.wait_for_timeout(250);notoast(pg)
    it=items(pg);ok(len(it)==1 and it[0]['a']==30000,f'[{W}] 항목에 금액이 저장됨',it)
    ok(J(pg,"!!document.querySelector('#sheetC .im110p')"),f'[{W}] 적으면 🧭 대응 순서가 바로 열림')
    ok('먼저 든든하게' in J(pg,"document.querySelector('#sheetC .im110p').innerText"),f'[{W}] ① 든든하게 안내')
    ok(J(pg,"document.querySelectorAll('#sheetC [data-imfl110]').length")>=3,f'[{W}] 든든한 것 칩(두유·달걀·닭가슴살)')
    # ① 든든한 것 → 타이머
    pg.click('#sheetC [data-imfl110]',timeout=3000);pg.wait_for_timeout(300);notoast(pg)
    it=items(pg);ok(it[0]['w'] and it[0]['fl']=='두유',f'[{W}] 먹었어요 → 기다리기 시작',it)
    ok('기다리는 중' in J(pg,"document.querySelector('#sheetC .im110p').innerText"),f'[{W}] ② 기다리는 중 표시')
    ok('⏳' in J(pg,"document.querySelector('#battleBox .im110').innerText"),f'[{W}] 칩에 남은 시간',J(pg,"document.querySelector('#battleBox .im110').innerText"))
    # 기다림이 끝났다고 치고(바로 정할래요) → ③ 대신할 것
    pg.click('#sheetC [data-imsk110]',timeout=3000);pg.wait_for_timeout(300);notoast(pg)
    ok('지금 당김은' in J(pg,"document.querySelector('#sheetC .im110p').innerText"),f'[{W}] ③ 지금 당김은?')
    ok('지금은?' in J(pg,"document.querySelector('#battleBox .im110').innerText"),f'[{W}] 칩이 지금은? 으로')
    xp0=J(pg,"P.xp")
    pg.click('#sheetC [data-imal110]',timeout=3000);pg.wait_for_timeout(300);notoast(pg)
    it=items(pg);ok(it[0]['s']=='w' and it[0]['alt']=='라면 하나',f'[{W}] 라면 하나로 끝내기 → 대신 상태',it)
    ok(J(pg,"P.xp")==xp0+3,f'[{W}] 대신하기 XP +3',J(pg,"P.xp")-xp0)
    ok(any(x.startswith('🔁') for x in json.loads(J(pg,"JSON.stringify(today().entries.map(e=>e.name||''))"))),f'[{W}] 대신 기록이 생김')
    ok('로 대신' in J(pg,"document.getElementById('sheetC').innerText"),f'[{W}] 오늘 결과 칸에 대신 표시')
    # 되돌리기 → 대신 기록 사라짐
    pg.click('#sheetC [data-imu110]',timeout=3000);pg.wait_for_timeout(300);notoast(pg)
    it=items(pg);ok(it[0]['s']=='p' and not it[0]['w'] and not it[0]['alt'],f'[{W}] 대신 되돌리기 → 열림·타이머 초기화',it)
    ok(not any(x.startswith('🔁') for x in json.loads(J(pg,"JSON.stringify(today().entries.map(e=>e.name||''))"))),f'[{W}] 대신 기록이 지워짐')
    # 참음 + 금액 → 아낀 돈 골드
    g0=J(pg,"P.gold");pg.click('#sheetC [data-imh110]',timeout=3000);pg.wait_for_timeout(300);notoast(pg)
    ok(J(pg,"P.gold")-g0>=50,f'[{W}] 3만 원 참음 → 아낀 돈 골드(100원 단위 아님, 300원당 1G 최대 50)',J(pg,"P.gold")-g0)
    ok('아낀 약' in J(pg,"document.getElementById('sheetC').innerText"),f'[{W}] 이번 주 한눈에에 아낀 돈')
    # 먹었어요 + 나중에 금액 → 자잘한 소비 합계
    add(pg,'과자');add(pg,'젤리')
    for _ in range(2):
        J(pg,"document.querySelector('#sheetC [data-img110]').click()");pg.wait_for_timeout(250);notoast(pg)
    for i in range(2):
        el=pg.query_selector_all('#sheetC .im110r.done .ima110[value=""]')[0] if pg.query_selector_all('#sheetC .im110r.done .ima110[value=""]') else None
        if el is None:el=[e for e in pg.query_selector_all('#sheetC .im110r.done .ima110') if not e.input_value()][0]
        el.fill('2500');el.dispatch_event('change');pg.wait_for_timeout(250);notoast(pg)
    it=items(pg);ok(sum(1 for x in it if x['s']=='g' and x['a']==2500)==2,f'[{W}] 먹은 뒤 금액 적기',it)
    ok('만 원 미만 2건' in J(pg,"document.getElementById('sheetC').innerText"),f'[{W}] 자잘한 소비 합계')
    # 🛍 → 보상함에 적고 오늘은 끝
    pg.click('#sheetC [data-imk110="b"]');pg.wait_for_timeout(150)
    add(pg,'새 이어폰')
    pg.click('#sheetC [data-imal110$=":0"]',timeout=3000);pg.wait_for_timeout(300);notoast(pg)
    ok(J(pg,"C.shop.some(z=>z.name==='새 이어폰'&&!(z.price>0))"),f'[{W}] 보상함(가격 없음)에 올라감')
    ok(any(x['n']=='새 이어폰' and x['s']=='h' for x in items(pg)),f'[{W}] 안 샀음으로 확정됨',items(pg))
    # 설정
    J(pg,"document.querySelector('#sheetC .im110s').open=true")
    pg.fill('#sheetC [data-imc110="wait"]','10');pg.dispatch_event('#sheetC [data-imc110="wait"]','change');pg.wait_for_timeout(150);notoast(pg)
    ok(J(pg,"cfg110().wait")==10,f'[{W}] 기다리는 시간 설정')
    pg.fill('#sheetC [data-imt110="fill"]','바나나, 요거트');pg.dispatch_event('#sheetC [data-imt110="fill"]','change');pg.wait_for_timeout(150);notoast(pg)
    ok(J(pg,"cfg110().fill.join('|')")=='바나나|요거트',f'[{W}] 든든한 것 목록 설정')
    pg.fill('#sheetC [data-imt110="altf"]','라면 하나 3000\n김밥 한 줄 4500');pg.dispatch_event('#sheetC [data-imt110="altf"]','change');pg.wait_for_timeout(150);notoast(pg)
    ok(J(pg,"JSON.stringify(cfg110().alts.f)")=='[{"n":"라면 하나","c":3000},{"n":"김밥 한 줄","c":4500}]',f'[{W}] 대신할 것(금액 포함) 설정',J(pg,"JSON.stringify(cfg110().alts.f)"))
    # normDay 보존
    kept=J(pg,"(()=>{const r=normDay(today().date,{imp110:[{id:'z',k:'f',n:'x',t:'1',s:'w',a:5000,w:123,fl:'두유',alt:'라면',ac:3000}]}).imp110[0];return r.a+'|'+r.w+'|'+r.fl+'|'+r.alt+'|'+r.ac+'|'+r.s})()")
    ok(kept=='5000|123|두유|라면|3000|w',f'[{W}] normDay가 새 필드를 보존',kept)
    ov=J(pg,"(()=>{const m=document.querySelector('#battleBox .mm90');return m?m.scrollWidth-m.clientWidth:0})()")
    ok(ov<=1,f'[{W}] 기분 줄이 가로로 넘치지 않음',ov)
    sw=J(pg,"document.getElementById('sheetC').scrollWidth-document.getElementById('sheetC').clientWidth")
    ok(sw<=1,f'[{W}] 창이 가로로 넘치지 않음',sw)
    pg.screenshot(path=f'/tmp/t115_{W}.png')
    ok(errs==[],f'[{W}] 오류 없음',errs[:3]);errs.clear();b.close()
print('FAILS',len(FAILS),FAILS)
