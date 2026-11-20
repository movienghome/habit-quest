# t114 (v11.1): F1 ⑤-1 충동 적기 → 확정 — 칩·창·적기(작은 보상, 하루 3번까지)·확정(카드 점수/기본 점수)·먹었음(기록만)·되돌리기·기록 지우면 열림으로 복귀·🍬 당김 입구
# 사용자가 실제로 누르는 경로로(칩 누르기 → 입력 → 적기/Enter → ✓ 안 먹음). 폰(390)·PC(1200).
# 옛 빌드와 비교: HQURL=http://localhost:8766/beta/index.html python3 t114.py (옛 빌드에선 전부 떨어져야 정상)
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
J=lambda pg,x:pg.evaluate(x)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
def notoast(pg):J(pg,"(()=>{const t=document.getElementById('toast');if(t){t.classList.remove('on');t.style.pointerEvents=''}})()")
def items(pg):return json.loads(J(pg,"JSON.stringify((today().imp110||[]).map(x=>({n:x.n,k:x.k,s:st110(x),rid:!!x.rid,eid:!!x.eid})))"))
def ents(pg):return json.loads(J(pg,"JSON.stringify(today().entries.filter(e=>e.imp110||e.kind==='imp110').map(e=>({kind:e.kind,aid:e.aid||'',xp:e.xp,gold:e.gold,name:e.name})))"))
def add(pg,txt):
    pg.fill('#imp110N',txt);pg.press('#imp110N','Enter');pg.wait_for_timeout(250);notoast(pg)
with sync_playwright() as pw:
  for W,H in [(390,800),(1200,800)]:
    b,pg=run(pw,W=W,H=H);notoast(pg)
    J(pg,"location.hash='home';render()");pg.wait_for_timeout(600);notoast(pg)
    ok(J(pg,"!!document.querySelector('#battleBox .im110')"),f'[{W}] 전투 카드 기분 줄에 🍰 칩')
    ok('충동' in J(pg,"document.querySelector('#battleBox .im110').innerText"),f'[{W}] 열린 게 없으면 짧은 글자(공간)')
    xp0=J(pg,"P.xp")
    pg.click('#battleBox .im110',timeout=3000);pg.wait_for_timeout(400)
    ok(J(pg,"!!document.getElementById('imp110N')&&document.getElementById('sheetC').offsetParent!==null"),f'[{W}] 칩을 누르면 창이 열림')
    # --- 먹고 싶음 적기 (Enter) ---
    add(pg,'치킨')
    it=items(pg);ok(len(it)==1 and it[0]['n']=='치킨' and it[0]['k']=='f' and it[0]['s']=='p' and it[0]['rid'],f'[{W}] 적으면 열린 항목 1개 + 적기 기록',it)
    ok(J(pg,"P.xp")==xp0+1,f'[{W}] 적기 보상은 XP 1(작게)',J(pg,"P.xp")-xp0)
    ok(J(pg,"document.getElementById('imp110N').value")=='' ,f'[{W}] 적은 뒤 입력칸이 비워짐')
    ok('참는 중' in J(pg,"document.querySelector('#battleBox .im110')?document.querySelector('#battleBox .im110').innerText:''") or '결과 정하기' in J(pg,"document.querySelector('#battleBox .im110').innerText"),f'[{W}] 칩이 참는 중/확정 n으로 바뀜',J(pg,"document.querySelector('#battleBox .im110').innerText"))
    # --- 확정: 안 먹음 (야식 카드 없으면 기본 점수) ---
    xp1=J(pg,"P.xp");nm=J(pg,"card110('f')&&card110('f').name")
    pg.click('#sheetC [data-imh110]',timeout=3000);pg.wait_for_timeout(300);notoast(pg)
    it=items(pg);ok(it[0]['s']=='h' and it[0]['eid'],f'[{W}] ✓ 안 먹음 → 참음 상태',it)
    ok(J(pg,"P.xp")>xp1,f'[{W}] 확정 보상이 적기보다 큼',J(pg,"P.xp")-xp1)
    e=ents(pg);ok(any(x['xp']>1 for x in e),f'[{W}] 확정 기록이 생김',e)
    ok('오늘 결과' in J(pg,"document.getElementById('sheetC').innerText"),f'[{W}] 창에 오늘 결과 칸')
    # --- 되돌리기 → 확정 기록 사라지고 열림 ---
    pg.click('#sheetC [data-imu110]',timeout=3000);pg.wait_for_timeout(400);notoast(pg)
    it=items(pg);ok(it[0]['s']=='p' and not it[0]['eid'],f'[{W}] 되돌리기 → 다시 열림',it)
    ok(not any(x['xp']>1 for x in ents(pg)),f'[{W}] 확정 기록이 지워짐',ents(pg))
    # --- 확정 후 기록하기에서 그 기록을 지우면 열림으로 복귀 ---
    pg.click('#sheetC [data-imh110]',timeout=3000);pg.wait_for_timeout(300);notoast(pg)
    J(pg,"(()=>{const x=today().imp110[0];removeEntry(x.hk,x.eid)})()");pg.wait_for_timeout(300);notoast(pg)
    it=items(pg);ok(it[0]['s']=='p',f'[{W}] 기록을 지우면 참음이 저절로 열림으로',it)
    # --- 사고 싶음 + 먹었음/샀음 = 기록만 ---
    pg.click('#sheetC [data-imk110="b"]');pg.wait_for_timeout(150)
    add(pg,'새 이어폰')
    xp2=J(pg,"P.xp");g2=J(pg,"P.gold");n2=J(pg,"today().entries.length")
    J(pg,"document.querySelectorAll('#sheetC [data-img110]')[1].click()");pg.wait_for_timeout(300);notoast(pg)
    it=items(pg);ok(it[1]['s']=='g',f'[{W}] 샀음 → 기록만 상태',it)
    ok(J(pg,"P.xp")==xp2 and J(pg,"P.gold")==g2 and J(pg,"today().entries.length")==n2,f'[{W}] 샀음은 점수·기록이 안 늘고 안 깎임')
    # --- 사고 싶음 확정은 충동구매 참았다 카드 점수 ---
    pg.click('#sheetC [data-imu110]',timeout=3000);pg.wait_for_timeout(300);notoast(pg)
    J(pg,"document.querySelectorAll('#sheetC [data-imh110]')[1].click()");pg.wait_for_timeout(300);notoast(pg)
    e=[x for x in ents(pg) if x['aid']]
    ok(len(e)==1 and e[0]['xp']>=8,f'[{W}] 🛍 안 샀음 = 충동구매 참았다 카드 그대로',e)
    # --- 하루 보상 3번까지 ---
    add(pg,'케이크');add(pg,'빵');add(pg,'과자')
    reg=[x for x in ents(pg) if x['kind']=='imp110' and x['xp']==1]
    ok(len(reg)==3,f'[{W}] 적기 보상은 하루 3번까지(많이 적어서 점수 얻기 막기)',len(reg))
    ok(len(items(pg))==5,f'[{W}] 항목은 계속 적을 수 있음',len(items(pg)))
    # --- 지우기 ---
    J(pg,"document.querySelector('#sheetC [data-imd110]').click()");pg.wait_for_timeout(250);notoast(pg)
    ok(len(items(pg))==4,f'[{W}] × 로 항목 지우기')
    # --- 저장 보존(normDay) ---
    raw=json.dumps(json.loads(J(pg,"JSON.stringify(today().imp110)")))
    kept=J(pg,"normDay(today().date,{imp110:"+raw+"}).imp110.length")
    ok(kept==4,f'[{W}] 저장 때 imp110이 안 버려짐(normDay)',kept)
    J(pg,"closeSheet()");notoast(pg)
    # --- 🍬 지금 어때? 당김 입구 ---
    J(pg,"ui.dst='urge';openDopaNow('urge')");pg.wait_for_timeout(500)
    ok(J(pg,"!!document.querySelector('#sheetC .im110d [data-imopen110]')"),f'[{W}] 🍬 당김 창에 🍰 적어 두기 단추')
    pg.click('#sheetC [data-imopen110]',timeout=3000);pg.wait_for_timeout(400)
    ok(J(pg,"!!document.getElementById('imp110N')"),f'[{W}] 그 단추로 적기 창이 열림')
    pg.click('#sheetC [data-imdopa110]',timeout=3000);pg.wait_for_timeout(600)
    ok(J(pg,"!!document.querySelector('#sheetC .im110d')"),f'[{W}] 적기 창에서 🍬 대신할 것으로 돌아갈 수 있음')
    J(pg,"closeSheet()");notoast(pg)
    # --- 폰 폭: 칩이 기분 줄을 가로로 넘치지 않음 ---
    ov=J(pg,"(()=>{const m=document.querySelector('#battleBox .mm90');return m?m.scrollWidth-m.clientWidth:0})()")
    ok(ov<=1,f'[{W}] 기분 줄이 가로로 넘치지 않음',ov)
    pg.screenshot(path=f'/tmp/t114_{W}.png')
    ok(errs==[],f'[{W}] 오류 없음',errs[:3]);errs.clear();b.close()
print('FAILS',len(FAILS),FAILS)
