# t116 (v11.3): 루틴 바로 넘기기 · 충동 칩(콤마·내 기준·보상함 환산·못 참은 기록·폭식/폭음) · 보상함 대기기간
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
J=lambda pg,x:pg.evaluate(x)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
def notoast(pg):J(pg,"(()=>{const t=document.getElementById('toast');if(t){t.classList.remove('on');t.style.pointerEvents=''}})()")
def vis(pg,sel):return pg.locator(sel).locator('visible=true').first
SETUP="""(()=>{const r=C.routines.find(x=>x.id==='r-morning');const h=rtH62(r,true);h.due=dateKey();h.rep={f:'d',i:1};saveTask(h);
  r.steps.forEach(s=>{const t=TASKS[s.tid];if(t){t.last=null;saveTask(t)}});C.ui.tfold[h.id]='o';location.hash='tasks';C.ui.tasks.sel='today';render();return h.id})()"""
with sync_playwright() as pw:
  # ---------- A. 루틴: 단계 하나만 체크해도 바로(몇 초 안에) 오늘 목록에서 빠짐 ----------
  for W,H in [(390,800),(1300,900)]:
    b,pg=run(pw,W=W,H=H);closepops(pg);pg.wait_for_timeout(300)
    hid=J(pg,SETUP);pg.wait_for_timeout(500)
    st=json.loads(J(pg,"JSON.stringify(C.routines.find(x=>x.id==='r-morning').steps.map(s=>s.tid))"))
    if not pg.locator(f'.trow[data-task="{st[1]}"]').locator('visible=true').count():
        vis(pg,f'.trow[data-task="{hid}"] .tfold').click();pg.wait_for_timeout(300)
    vis(pg,f'.trow[data-task="{st[1]}"] [data-tdone]').click();pg.wait_for_timeout(3200);closepops(pg)
    td=J(pg,"dateKey()")
    ok(J(pg,f"TASKS['{hid}'].due")!=td,f'[{W}] 단계 1개만 체크해도 몇 초 안에 루틴이 다음 차례로',J(pg,f"TASKS['{hid}'].due"))
    ok(pg.locator(f'.trow[data-task="{hid}"]').locator('visible=true').count()==0,f'[{W}] 오늘 목록에서 루틴이 빠짐')
    ok(pg.locator(f'.trow[data-task="{st[4]}"]').locator('visible=true').count()==0,f'[{W}] 남은 단계도 빠짐')
    b.close()
  # ---------- B. 충동 칩 ----------
  for W,H in [(390,800),(1200,800)]:
    b,pg=run(pw,W=W,H=H);notoast(pg)
    J(pg,"location.hash='home';render()");pg.wait_for_timeout(600);notoast(pg)
    pg.click('#battleBox .im110',timeout=3000);pg.wait_for_timeout(400)
    pg.click('#imp110A');pg.keyboard.type('30000');pg.wait_for_timeout(100)
    ok(J(pg,"document.getElementById('imp110A').value")=='30,000',f'[{W}] 금액 입력은 치는 대로 콤마',J(pg,"document.getElementById('imp110A').value"))
    pg.keyboard.type('0');ok(J(pg,"document.getElementById('imp110A').value")=='300,000',f'[{W}] 한 자리 더 쳐도 콤마가 맞음')
    pg.fill('#imp110A','');pg.click('#imp110A');pg.keyboard.type('42000');pg.fill('#imp110N','마라탕')
    pg.wait_for_timeout(120)
    t=J(pg,"document.getElementById('imp110C').innerText")
    ok('이 한 번 =' in t and ('국밥' in t or '책 한 권' in t or '옷 한 벌' in t),f'[{W}] 내 기준 여러 단위로 환산',t)
    ok('아끼면' in t or '값이에요' in t,f'[{W}] 보상함 환산 줄',t)
    pg.press('#imp110N','Enter');pg.wait_for_timeout(300);notoast(pg)
    it=json.loads(J(pg,"JSON.stringify((today().imp110||[]).map(x=>({n:x.n,a:x.a,s:st110(x)})))"))
    ok(len(it)==1 and it[0]['a']==42000,f'[{W}] 콤마 입력도 금액 숫자로 저장됨',it)
    # 먹었어요 → 상황 칸이 바로 열림
    pg.click('#sheetC [data-img110]',timeout=3000);pg.wait_for_timeout(300);notoast(pg)
    ok(J(pg,"!!document.querySelector('#sheetC .im110e')"),f'[{W}] 먹었어요 누르면 상황 적는 칸이 열림')
    pg.click('#sheetC [data-imsit110^="'+J(pg,"today().imp110[0].id")+':스트레스"]');pg.wait_for_timeout(200)
    pg.fill('#sheetC [data-imm110]','야근하고 와서 배달앱을 열었다');pg.press('#sheetC [data-imm110]','Tab');pg.wait_for_timeout(250);notoast(pg)
    pg.fill('#sheetC [data-imtm110]','22:40');pg.wait_for_timeout(250);notoast(pg)
    x=json.loads(J(pg,"JSON.stringify(today().imp110[0])"))
    ok(x.get('sit')==['스트레스'] and x.get('m','').startswith('야근') and x.get('gt')=='22:40',f'[{W}] 상황·메모·시각이 저장됨',x)
    ok(J(pg,"document.querySelector('#sheetC .im110r.done').innerText").count('스트레스')>=1,f'[{W}] 오늘 결과 줄에 상황이 보임')
    ok(J(pg,"!!document.querySelector('#sheetC .im110hs')"),f'[{W}] 못 참았던 때 돌아보기 칸')
    J(pg,"document.querySelector('#sheetC .im110hs').open=true");pg.wait_for_timeout(100)
    # 다시 같은 걸 적으면 지난번 힌트
    pg.fill('#imp110N','마라탕');pg.press('#imp110N','Enter');pg.wait_for_timeout(300);notoast(pg)
    ok('지난번' in J(pg,"document.querySelector('#sheetC .im110p')?document.querySelector('#sheetC .im110p').innerText:''"),f'[{W}] 같은 걸 또 적으면 지난번 상황 힌트',J(pg,"document.querySelector('#sheetC .im110p')?document.querySelector('#sheetC .im110p').innerText:''"))
    # 새로 저장한 뒤 새로고침 없이도 normDay가 상황을 지키는지
    ok(J(pg,"JSON.stringify(normDay('x',JSON.parse(JSON.stringify({imp110:today().imp110}))).imp110[0].sit)")=='["스트레스"]',f'[{W}] normDay가 상황을 보존')
    # 대신할 것 보기 → 폭식·폭음
    pg.click('#sheetC [data-imdopa110]');pg.wait_for_timeout(500)
    ok(J(pg,"ui.dst")=='binge' and '폭식' in J(pg,"document.getElementById('sheetC').innerText"),f'[{W}] 🍰 → 폭식·폭음하고 싶어요 상태로 열림',J(pg,"ui.dst"))
    ok(J(pg,"!!document.querySelector('#sheetC .im110d')"),f'[{W}] 그 창에서도 충동 적기로 돌아가는 단추')
    ok(J(pg,"DSTATE.map(x=>x[0]).join()").find('urge,binge')>=0,f'[{W}] 상태 순서 urge 다음 binge')
    b.close()
  # ---------- C. 보상함 대기기간 ----------
  b,pg=run(pw,W=1200,H=800);notoast(pg)
  J(pg,"location.hash='shop';render()");pg.wait_for_timeout(500)
  ok(J(pg,"C.shop.filter(s=>s.price>0).every(s=>s.at==='2000-01-01')"),'처음부터 있던 물건은 대기 없이(이주)')
  ok(J(pg,"!document.querySelector('#shopList [data-buy]:disabled')||[...document.querySelectorAll('#shopList [data-buy]')].every(x=>!/⏳/.test(x.textContent))"),'기존 물건 단추에 ⏳ 없음')
  J(pg,"(()=>{C.shop.push({id:'wtt',name:'테스트 이어폰',price:300});P.gold=1000;render()})()");pg.wait_for_timeout(400)
  ok(J(pg,"C.shop.find(s=>s.id==='wtt').at")==J(pg,"gk76()"),'새 물건은 처음 보인 날부터 셈')
  bt=J(pg,"(document.querySelector('[data-info=\"shop:wtt\"] [data-buy]')||{}).textContent")
  ok('⏳' in (bt or '') and '3일' in bt,'3만 원짜리는 3일 대기 → 사기 단추가 ⏳ 3일 뒤',bt)
  ok(J(pg,"!!document.querySelector('#wt111p')"),'상점 위에 ⏳ 대기기간 기준 칸')
  g0=J(pg,"P.gold");J(pg,"document.querySelector('[data-info=\"shop:wtt\"] [data-buy]').disabled=false;document.querySelector('[data-info=\"shop:wtt\"] [data-buy]').click()");pg.wait_for_timeout(300)
  ok(J(pg,"P.gold")==g0,'대기 중엔 억지로 눌러도 안 사짐')
  # 직접 대기 줄이기는 내일부터, 늘리기는 바로
  vis(pg,'[data-wt111="wtt"]').click();pg.wait_for_timeout(300)
  pg.fill('#wt111D','0');pg.click('#sheetC [data-wt111s]');pg.wait_for_timeout(300);notoast(pg)
  it=json.loads(J(pg,"JSON.stringify(C.shop.find(s=>s.id==='wtt'))"))
  ok(it.get('wp') and it['wp']['wd']==0 and it.get('wd') is None,'대기를 줄이는 건 내일부터(예약만)',it)
  vis(pg,'[data-wt111="wtt"]').click();pg.wait_for_timeout(300)
  pg.fill('#wt111D','10');pg.click('#sheetC [data-wt111s]');pg.wait_for_timeout(300);notoast(pg)
  it=json.loads(J(pg,"JSON.stringify(C.shop.find(s=>s.id==='wtt'))"))
  ok(it.get('wd')==10 and not it.get('wp'),'대기를 늘리는 건 바로 · 예약은 지워짐',it)
  # 날짜가 지나면(예약 날짜 도달) 줄이기가 적용됨
  J(pg,"(()=>{const it=C.shop.find(s=>s.id==='wtt');it.wd=10;it.wp={wd:0,nd:false,from:addDays(gk76(),-1)};it.at=addDays(gk76(),-1);render()})()");pg.wait_for_timeout(400)
  it=json.loads(J(pg,"JSON.stringify(C.shop.find(s=>s.id==='wtt'))"))
  ok(it.get('wd')==0 and not it.get('wp'),'예약한 날이 되면 줄인 대기가 적용됨',it)
  bt=J(pg,"(document.querySelector('[data-info=\"shop:wtt\"] [data-buy]')||{}).textContent")
  ok('⏳' not in (bt or ''),'대기 0일이면 바로 살 수 있음',bt)
  # 기준 일수(가격 구간) 줄이기도 내일부터
  pg.click('#wt111p summary');pg.fill('[data-wt111d="3"]','3');pg.press('[data-wt111d="3"]','Tab');pg.wait_for_timeout(300);notoast(pg)
  ok(J(pg,"C.wt111.d[3]")==7 and J(pg,"!!C.wt111.pd[3]"),'구간 기준 줄이기는 예약',J(pg,"JSON.stringify(C.wt111)"))
  pg.fill('[data-wt111d="3"]','9');pg.press('[data-wt111d="3"]','Tab');pg.wait_for_timeout(300);notoast(pg)
  ok(J(pg,"C.wt111.d[3]")==9 and J(pg,"!C.wt111.pd[3]"),'구간 기준 늘리기는 바로',J(pg,"JSON.stringify(C.wt111)"))
  pg.fill('[data-wtb111]','500000');pg.press('[data-wtb111]','Tab');pg.wait_for_timeout(300);notoast(pg)
  ok(J(pg,"C.imp110.budget")==500000 and '%' in J(pg,"document.getElementById('shopList').innerText"),'이번 달 쓸 돈을 적으면 가격의 %가 보임',J(pg,"document.getElementById('shopList').innerText").replace('\n',' ')[:200])
  b.close()
print('ERRS',[e for e in errs if 'favicon' not in e][:5])
print('FAILS',len(FAILS),FAILS)
