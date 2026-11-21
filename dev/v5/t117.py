# t117 (v11.4): 보상함 상한 — 물건별 주기 상한 · 한 달 전체 상한 · 사기 전 한 번 더 확인 · 변경 규칙(낮춤 즉시/높임 다음 날) · 주 월요일 시작
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
def addItem(pg,id='cpt',name='테스트 간식',price=100,at='2000-01-01'):
    J(pg,f"(()=>{{C.shop.push({{id:'{id}',name:'{name}',price:{price},at:'{at}'}});P.gold=5000;render()}})()");pg.wait_for_timeout(400);notoast(pg)
def nbuy(pg,sid=None):
    return J(pg,"(today().entries||[]).filter(e=>e.kind==='buy'"+(f"&&e.sid112==='{sid}'" if sid else '')+").length")
def setcap(pg,per,n):
    vis(pg,'[data-cp112="cpt"]').click();pg.wait_for_timeout(300)
    pg.select_option('#cp112P',per);pg.fill('#cp112N',str(n));pg.click('#sheetC [data-cp112s]');pg.wait_for_timeout(300);notoast(pg)
def buy(pg,id='cpt'):
    J(pg,"P.gold=5000;render()");pg.wait_for_timeout(300);notoast(pg)
    vis(pg,f'[data-info="shop:{id}"] [data-buy]').click();pg.wait_for_timeout(350)
with sync_playwright() as pw:
  # ---------- A. 물건별 주 상한 → 두 번째부터 확인 창 (폰·PC) ----------
  for W,H in [(1200,800),(390,800)]:
    b,pg=run(pw,W=W,H=H);closepops(pg);notoast(pg);shop(pg);addItem(pg)
    ok(J(pg,"!!document.querySelector('[data-info=\"shop:cpt\"] [data-cp112]')"),f'[{W}] 물건 줄에 상한 설정 단추')
    ok(J(pg,"!!document.querySelector('#wt111p .cp112m')"),f'[{W}] 대기기간 칸 안에 한 달 상한 입력')
    setcap(pg,'w',1)
    ok(J(pg,"JSON.stringify(C.shop.find(s=>s.id==='cpt').lm)")=='{"n":1,"p":"w"}',f'[{W}] 새로 정한 상한은 바로 적용',J(pg,"JSON.stringify(C.shop.find(s=>s.id==='cpt').lm)"))
    buy(pg);closepops(pg)
    ok(nbuy(pg,'cpt')==1,f'[{W}] 첫 번째는 확인 없이 삼(0/1)',nbuy(pg))
    ok(J(pg,"(today().entries.find(e=>e.kind==='buy')||{}).sid112")=='cpt',f'[{W}] 구매 기록에 물건 id(sid112)가 남음')
    ok(J(pg,"!document.querySelector('#sheetC .cp112o')"),f'[{W}] 첫 구매엔 확인 창 없음')
    ok('1/1' in J(pg,"document.querySelector('[data-info=\"shop:cpt\"]').innerText") and '다 찼어요' in J(pg,"document.querySelector('[data-info=\"shop:cpt\"]').innerText"),f'[{W}] 줄에 이번 주 1/1 (다 찼어요)',J(pg,"document.querySelector('[data-info=\"shop:cpt\"]').innerText"))
    buy(pg)
    t=J(pg,"document.getElementById('sheetC').innerText")
    ok('한 번 더 확인' in t and '이번 주' in t and '주 1번' in t,f'[{W}] 두 번째는 확인 창(이번 주 이미 1번 · 상한 주 1번)',t)
    ok(nbuy(pg,'cpt')==1,f'[{W}] 확인 창이 떠 있는 동안은 안 사짐')
    pg.click('#sheetC [data-sheet=close]');pg.wait_for_timeout(250);closepops(pg)
    ok(nbuy(pg,'cpt')==1,f'[{W}] 안 살래요 → 안 사짐')
    buy(pg);pg.click('#sheetC [data-cap112go]');pg.wait_for_timeout(500);closepops(pg)
    ok(nbuy(pg,'cpt')==2,f'[{W}] 그래도 살게요 → 삼(막지는 않음)',nbuy(pg))
    e=json.loads(J(pg,"JSON.stringify(today().entries.filter(e=>e.kind==='buy').pop())"))
    ok(e.get('xp',0)==0 and e.get('gold')==-100 and e.get('sid112')=='cpt',f'[{W}] 상한을 넘겨도 점수 안 깎고 골드는 값만',e)
    ok(len([x for x in json.loads(J(pg,"JSON.stringify(today().entries)")) if x.get('type')=='bad'])==0,f'[{W}] 나쁜 기록(페널티)이 생기지 않음')
    # 구매 취소하면 횟수 줄어듦
    J(pg,"removeEntry(dateKey(),today().entries.filter(e=>e.kind==='buy').pop().id)");pg.wait_for_timeout(300)
    ok(J(pg,"used112(C.shop.find(s=>s.id==='cpt'))")==1,f'[{W}] 구매 취소하면 이번 주 횟수도 줄어듦',J(pg,"used112(C.shop.find(s=>s.id==='cpt'))"))
    if W==390:
        ok(J(pg,"(()=>{const r=document.querySelector('[data-info=\"shop:cpt\"]');return r.scrollWidth<=r.clientWidth+1})()"),'[390] 폰에서 물건 줄이 옆으로 넘치지 않음')
    b.close()
  # ---------- B. 변경 규칙: 낮춤/새로 정함 즉시 · 높임/없앰 다음 날 ----------
  b,pg=run(pw,W=1200,H=800);closepops(pg);notoast(pg);shop(pg);addItem(pg)
  setcap(pg,'w',2)
  setcap(pg,'w',5)
  it=json.loads(J(pg,"JSON.stringify(C.shop.find(s=>s.id==='cpt'))"))
  ok(it['lm']['n']==2 and it.get('lw') and it['lw']['v']['n']==5,'상한을 높이는 건 예약만(내일부터)',it)
  ok(it['lw']['from']==J(pg,"addDays(gk76(),1)"),'예약은 내일 날짜',it['lw'])
  setcap(pg,'w',2)
  ok(not json.loads(J(pg,"JSON.stringify(C.shop.find(s=>s.id==='cpt'))")).get('lw'),'현재와 같게 다시 저장하면 예약이 지워짐')
  setcap(pg,'m',1)
  it=json.loads(J(pg,"JSON.stringify(C.shop.find(s=>s.id==='cpt'))"))
  ok(it['lm']=={'n':1,'p':'m'} and not it.get('lw'),'주 2번 → 월 1번(더 엄함)은 바로',it)
  setcap(pg,'','1')
  it=json.loads(J(pg,"JSON.stringify(C.shop.find(s=>s.id==='cpt'))"))
  ok(it['lm']['p']=='m' and it.get('lw') and it['lw']['v'] is None,'상한 없애기는 다음 날부터(예약)',it)
  J(pg,"(()=>{const it=C.shop.find(s=>s.id==='cpt');it.lw.from=addDays(gk76(),-1);render()})()");pg.wait_for_timeout(400)
  it=json.loads(J(pg,"JSON.stringify(C.shop.find(s=>s.id==='cpt'))"))
  ok('lm' not in it and 'lw' not in it,'예약한 날이 되면 적용됨(상한 없어짐)',it)
  ok(J(pg,"over112(C.shop.find(s=>s.id==='cpt')).length")==0,'상한이 없으면 확인도 없음')
  # 주 시작 = 월요일: 지난 일요일은 이번 주가 아니고 이번 월요일은 이번 주
  setcap(pg,'w',9)
  r=json.loads(J(pg,"""(()=>{const td=gk76(),ws=weekStart(td),it=C.shop.find(s=>s.id==='cpt');const out={ws,dow:new Date(ws+'T12:00:00').getDay()};
    const mk=k=>{DAYS[k]=DAYS[k]||{entries:[]};DAYS[k].entries=DAYS[k].entries||[];DAYS[k].entries.push({id:'t'+k,kind:'buy',type:'buy',name:'테스트 간식 구매',gold:-100,sid112:'cpt'})};
    const a=addDays(ws,-1);mk(a);out.sun=used112(it,td);mk(ws);out.mon=used112(it,td);
    delete DAYS[a];if(ws!==td)delete DAYS[ws];else DAYS[ws].entries=DAYS[ws].entries.filter(e=>e.id!=='t'+ws);return JSON.stringify(out)})()"""))
  ok(r['dow']==1,'주 시작은 월요일',r)
  ok(r['sun']==0 and r['mon']==1,'지난 일요일 구매는 이번 주에 안 세고, 월요일 구매는 셈',r)
  # 옛 기록(sid 없음)도 이름으로 맞춤
  ok(J(pg,"(()=>{const it=C.shop.find(s=>s.id==='cpt'),td=gk76(),k=td;DAYS[k]=DAYS[k]||{entries:[]};DAYS[k].entries.push({id:'old1',kind:'buy',type:'buy',name:'테스트 간식 구매',gold:-100});const n=used112(it,td);DAYS[k].entries=DAYS[k].entries.filter(e=>e.id!=='old1');return n})()")>=1,'sid 없는 옛 구매 기록도 이름으로 셈')
  b.close()
  # ---------- C. 한 달 전체 상한 ----------
  b,pg=run(pw,W=1200,H=800);closepops(pg);notoast(pg);shop(pg);addItem(pg,'cpa','큰 보상',300)   # 3만 원
  J(pg,"document.querySelector('#wt111p').open=true");
  pg.fill('#wt111p [data-cpm112]','20000');pg.press('#wt111p [data-cpm112]','Tab');pg.wait_for_timeout(300);notoast(pg)
  ok(J(pg,"C.cap112.m")==20000,'한 달 상한을 새로 정하면 바로',J(pg,"JSON.stringify(C.cap112)"))
  ok(J(pg,"document.querySelector('#wt111p [data-cpm112]').value")=='20,000','입력은 콤마로 보임')
  buy(pg,'cpa')
  t=J(pg,"document.getElementById('sheetC').innerText")
  ok('이번 달' in t and '상한 20,000원' in t,'한 달 상한을 넘기게 되면 확인 창',t)
  pg.click('#sheetC [data-sheet=close]');pg.wait_for_timeout(250)
  ok(nbuy(pg)==0,'안 살래요 → 안 사짐')
  J(pg,"document.querySelector('#wt111p').open=true");
  pg.fill('#wt111p [data-cpm112]','90000');pg.press('#wt111p [data-cpm112]','Tab');pg.wait_for_timeout(300);notoast(pg)
  ok(J(pg,"C.cap112.m")==20000 and J(pg,"!!C.cap112.pm and C.cap112.pm.v==90000".replace(' and ','&&')),'한 달 상한을 높이는 건 예약만(내일부터)',J(pg,"JSON.stringify(C.cap112)"))
  buy(pg,'cpa')
  ok('이번 달' in J(pg,"document.getElementById('sheetC').innerText"),'높이는 예약 중엔 아직 옛 상한으로 확인')
  pg.click('#sheetC [data-sheet=close]');pg.wait_for_timeout(250)
  J(pg,"document.querySelector('#wt111p').open=true");
  pg.fill('#wt111p [data-cpm112]','10000');pg.press('#wt111p [data-cpm112]','Tab');pg.wait_for_timeout(300);notoast(pg)
  ok(J(pg,"C.cap112.m")==10000 and J(pg,"!C.cap112.pm"),'낮추는 건 바로 · 높이기 예약은 지워짐',J(pg,"JSON.stringify(C.cap112)"))
  # 날짜가 되면 예약 적용
  J(pg,"(()=>{C.cap112.pm={v:90000,from:addDays(gk76(),-1)};render()})()");pg.wait_for_timeout(400)
  ok(J(pg,"C.cap112.m")==90000,'예약한 날이 되면 높인 상한 적용',J(pg,"JSON.stringify(C.cap112)"))
  buy(pg,'cpa');closepops(pg)
  ok(nbuy(pg,'cpa')==1 and J(pg,"document.getElementById('sheet').hidden"),'상한 안이면 확인 창 없이 바로 삼')
  ok(J(pg,"Math.round(spent112())")==30000,'이번 달 쓴 돈 = 골드×원',J(pg,"spent112()"))
  # 지운 상한(없음)
  J(pg,"document.querySelector('#wt111p').open=true");pg.fill('#wt111p [data-cpm112]','1000');pg.press('#wt111p [data-cpm112]','Tab');pg.wait_for_timeout(300);notoast(pg)
  J(pg,"document.querySelector('#wt111p').open=true");pg.fill('#wt111p [data-cpm112]','');pg.press('#wt111p [data-cpm112]','Tab');pg.wait_for_timeout(300);notoast(pg)
  ok(J(pg,"C.cap112.m")==1000 and J(pg,"!!C.cap112.pm&&C.cap112.pm.v===0"),'상한 없애기는 다음 날부터(예약)',J(pg,"JSON.stringify(C.cap112)"))
  b.close()
  # ---------- D. 대기기간이 먼저, 저장 보존 ----------
  b,pg=run(pw,W=1200,H=800);closepops(pg);notoast(pg);shop(pg)
  J(pg,"(()=>{C.shop.push({id:'cpw',name:'기다릴 물건',price:300,lm:{n:1,p:'w'}});P.gold=5000;render()})()");pg.wait_for_timeout(400);notoast(pg)
  vis(pg,'[data-info="shop:cpw"] [data-buy]').click(force=True);pg.wait_for_timeout(300)
  ok(J(pg,"!document.querySelector('#sheetC .cp112o')")and nbuy(pg)==0,'대기 중이면 대기가 먼저 막고 상한 확인 창은 안 뜸')
  J(pg,"C.shop.push({id:'cps',name:'보존 시험',price:100,at:'2000-01-01',lm:{n:2,p:'m'},lw:{v:null,from:addDays(gk76(),1)}});C.cap112={m:12345,pm:{v:0,from:addDays(gk76(),1)}}")
  n=json.loads(J(pg,"JSON.stringify(normConfig(JSON.parse(JSON.stringify(C))))"))
  s=[x for x in n['shop'] if x['id']=='cps'][0]
  ok(s.get('lm')=={'n':2,'p':'m'} and s.get('lw') and n.get('cap112',{}).get('m')==12345 and n['cap112'].get('pm'),'normConfig가 상한·예약을 보존',{'shop':s,'cap':n.get('cap112')})
  ok(J(pg,"JSON.stringify(normDay('x',JSON.parse(JSON.stringify({entries:[{id:'e1',kind:'buy',type:'buy',name:'x 구매',gold:-1,sid112:'cps'}]}))).entries[0].sid112)")=='"cps"','normDay가 구매 기록 sid112를 보존')
  ok(J(pg,"F67().some(r=>r[0]==='🧾 보상함 상한')"),'기능 지도 F67에 추가됨')
  b.close()
bad=[e for e in errs if e.startswith('PAGEERR')]
ok(len(bad)==0,'페이지 오류 없음',bad[:3])
print('FAILS',len(FAILS),FAILS)
