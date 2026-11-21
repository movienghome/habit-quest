# t118 (v11.5): 상점 맨 위 '이번 달 n / 상한원' 한 줄 + 상한 넘겨 산 구매 표시(기록만)·돌아보기
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
J=lambda pg,x:pg.evaluate(x)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
def notoast(pg):J(pg,"(()=>{const t=document.getElementById('toast');if(t){t.classList.remove('on');t.style.pointerEvents=''}})()")
def vis(pg,sel):return pg.locator(sel).locator('visible=true').first
def shop(pg):
    J(pg,"location.hash='shop';render()");pg.wait_for_timeout(500);notoast(pg)
def addItem(pg,id='cpt',name='테스트 간식',price=100):
    J(pg,f"(()=>{{C.shop.push({{id:'{id}',name:'{name}',price:{price},at:'2000-01-01'}});P.gold=9000;render()}})()");pg.wait_for_timeout(400);notoast(pg)
def buy(pg,id='cpt'):
    J(pg,"P.gold=9000;render()");pg.wait_for_timeout(300);notoast(pg)
    vis(pg,f'[data-info="shop:{id}"] [data-buy]').click();pg.wait_for_timeout(350)
def go(pg):
    pg.click('#sheetC [data-cap112go]');pg.wait_for_timeout(500);closepops(pg);notoast(pg)
def setm(pg,v):
    J(pg,"document.querySelector('#wt111p').open=true");pg.fill('#wt111p [data-cpm112]',str(v));pg.press('#wt111p [data-cpm112]','Tab');pg.wait_for_timeout(300);notoast(pg)
def setcap(pg,id,per,n):
    vis(pg,f'[data-cp112="{id}"]').click();pg.wait_for_timeout(300)
    pg.select_option('#cp112P',per);pg.fill('#cp112N',str(n));pg.click('#sheetC [data-cp112s]');pg.wait_for_timeout(300);notoast(pg)
def buys(pg):return json.loads(J(pg,"JSON.stringify((today().entries||[]).filter(e=>e.kind==='buy'))"))
with sync_playwright() as pw:
  # ---------- A. 아무것도 없으면 한 줄도 없음(공간 아낌) ----------
  for W,H in [(1200,800),(390,800)]:
    b,pg=run(pw,W=W,H=H);closepops(pg);notoast(pg);shop(pg);addItem(pg)
    ok(J(pg,"!document.getElementById('mo112')"),f'[{W}] 상한도 쓴 돈도 없으면 한 줄이 안 그려짐')
    b.close()
  # ---------- B. 한 달 상한 → 위 한 줄 · 넘겨 사면 표시 ----------
  for W,H in [(1200,800),(390,800)]:
    b,pg=run(pw,W=W,H=H);closepops(pg);notoast(pg);shop(pg);addItem(pg,'cpa','큰 보상',300)
    setm(pg,20000)
    t=J(pg,"(document.getElementById('mo112')||{}).innerText||''")
    ok('이번 달 0 / 20,000원' in t,f'[{W}] 상한만 있어도 위 한 줄에 이번 달 0 / 20,000원',t)
    ok(J(pg,"(()=>{const m=document.getElementById('mo112');return !!m&&m.previousElementSibling&&m.previousElementSibling.classList.contains('help')&&!!(m.compareDocumentPosition(document.getElementById('wt111p'))&4)&&!!(m.compareDocumentPosition(document.getElementById('shopList'))&4)})()"),f'[{W}] 한 줄은 안내 문장 바로 아래 — 대기기간 칸·물건 목록보다 위(맨 위)')
    ok(J(pg,"!document.getElementById('ov112d')"),f'[{W}] 넘겨 산 구매가 없으면 돌아보기 칸 없음')
    buy(pg,'cpa');go(pg)
    e=buys(pg)
    ok(len(e)==1 and e[0].get('ov112')=='m',f'[{W}] 한 달 상한을 넘겨 산 구매엔 e.ov112="m"',e)
    ok(e[0].get('xp',0)==0 and e[0].get('gold')==-300 and not [x for x in json.loads(J(pg,"JSON.stringify(today().entries)")) if x.get('type')=='bad'],f'[{W}] 표시는 기록만 — 점수 0·골드는 값만·나쁜 기록 없음')
    t=J(pg,"document.getElementById('mo112').innerText")
    ok('이번 달 30,000 / 20,000원' in t and '150%' in t and '넘었어요' in t,f'[{W}] 한 줄: 30,000 / 20,000원 · 150% · ⚠ 넘었어요(글자로도 알림)',t)
    ok(J(pg,"document.getElementById('mo112').classList.contains('over')"),f'[{W}] 넘으면 줄무늬 막대 클래스')
    ok('이번 달 1번' in t and '최근 60일 1번' in t,f'[{W}] 접힘 칸 제목: 이번 달 1번 (최근 60일 1번)',t)
    ok(J(pg,"!document.getElementById('ov112d').open"),f'[{W}] 돌아보기 칸은 기본 접힘')
    J(pg,"document.getElementById('ov112d').open=true;render()");pg.wait_for_timeout(300)
    ok(J(pg,"document.getElementById('ov112d').open"),f'[{W}] 다시 그려도 펼침 상태 유지')
    t=J(pg,"document.getElementById('ov112d').innerText")
    ok('큰 보상' in t and '한 달 상한 넘김' in t and '30,000원' in t and '점수·골드는 그대로' in t,f'[{W}] 목록: 날짜·이름·이유·금액·점수 그대로 안내',t)
    ok('상한 넘김' in J(pg,"logRow(dateKey(),today().entries.find(e=>e.kind==='buy'))"),f'[{W}] 기록 줄에 🧾 상한 넘김 표시')
    ok(J(pg,"(()=>{const r=logRow(dateKey(),today().entries.find(e=>e.kind==='buy'));return r.indexOf('큰 보상')<r.indexOf('상한 넘김')&&r.indexOf('상한 넘김')<r.indexOf('class=\"num muted tiny\"')})()"),f'[{W}] 표시는 이름 뒤·점수 칸 앞')
    if W==390:
        ok(J(pg,"(()=>{const r=document.getElementById('mo112');return r.scrollWidth<=r.clientWidth+1})()"),'[390] 폰에서 한 줄 칸이 옆으로 넘치지 않음')
    # 되돌리면 표시도 사라짐
    J(pg,"removeEntry(dateKey(),today().entries.filter(e=>e.kind==='buy').pop().id)");pg.wait_for_timeout(400)
    ok(J(pg,"!document.getElementById('ov112d')")and 'Math' and J(pg,"Math.round(spent112())")==0,f'[{W}] 구매를 되돌리면 돌아보기 목록·쓴 돈도 같이 빠짐')
    b.close()
  # ---------- C. 물건별 상한 · 둘 다 · 상한 안 ----------
  b,pg=run(pw,W=1200,H=800);closepops(pg);notoast(pg);shop(pg);addItem(pg,'cpt','테스트 간식',100)
  setcap(pg,'cpt','w',1)
  buy(pg);closepops(pg)
  ok(buys(pg)[0].get('ov112') is None and J(pg,"!document.getElementById('ov112d')"),'상한 안에서 산 구매엔 표시가 없음')
  buy(pg);go(pg)
  e=buys(pg)
  ok(len(e)==2 and e[0].get('ov112')=='i' and e[1].get('ov112') is None,'물건 상한을 넘긴 두 번째(새 기록은 맨 앞) 구매만 ov112="i"',e)
  ok('물건 상한 넘김' in J(pg,"document.getElementById('ov112d').textContent"),'목록 이유: 물건 상한')
  ok('이번 달' in J(pg,"document.getElementById('mo112').innerText") and '/' not in J(pg,"document.getElementById('mo112').querySelector('b').innerText"),'한 달 상한 없이 쓴 돈만 있으면 `이번 달 n원`만(슬래시 없음)',J(pg,"document.getElementById('mo112').innerText"))
  setm(pg,1000)
  buy(pg);go(pg)
  e=buys(pg)
  ok(e[0].get('ov112')=='im','물건·한 달 상한 둘 다 넘기면 ov112="im"',e[0])
  ok('둘 다' in J(pg,"document.getElementById('ov112d').textContent"),'목록 이유: 둘 다')
  # 안 살래요 → 표시도 구매도 없음
  n0=len(buys(pg));buy(pg);pg.click('#sheetC [data-sheet=close]');pg.wait_for_timeout(250);closepops(pg)
  ok(len(buys(pg))==n0,'안 살래요 → 안 사짐(표시도 없음)')
  # 저장·읽기 보존
  ok(J(pg,"JSON.stringify(normDay('x',JSON.parse(JSON.stringify({entries:[{id:'e1',kind:'buy',type:'buy',name:'x 구매',gold:-1,sid112:'cps',ov112:'im'}]}))).entries[0].ov112)")=='"im"','normDay가 e.ov112를 보존')
  ok(J(pg,"F67().some(r=>r[0]==='🧾 이번 달 쓴 돈·상한 넘긴 구매')"),'기능 지도 F67에 추가됨')
  b.close()
bad=[e for e in errs if e.startswith('PAGEERR')]
ok(len(bad)==0,'페이지 오류 없음',bad[:3])
print('FAILS',len(FAILS),FAILS)
