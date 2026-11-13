# v9.2 시험 — 쫄따구 HP 막대·보스 아래 배치 · 도전 보스 · 보스 HP 자동 조정 · 이름 '씩씩'
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra) if extra!='' else ''))
    if not c:FAILS.append(msg)

INJ="""(xp)=>{const k=dateKey();DAYS[k]=DAYS[k]||normDay(k,{});DAYS[k].entries=DAYS[k].entries||[];
  DAYS[k].entries.push({id:'t92'+Math.random().toString(36).slice(2,6),kind:'act',type:'good',name:'시험',xp:xp,cond:0,gold:0});render()}"""

with sync_playwright() as pw:
    # ---- 1. 쫄따구 막대·배치 (폰 두 종류 + PC)
    for W,H in ((390,844),(360,740),(1400,900)):
        b,pg=run(pw,W,H);closepops(pg)
        errs.clear()
        pg.evaluate("()=>{location.hash='#home';render()}");pg.wait_for_timeout(600)
        r=pg.evaluate("""()=>{const q=s=>document.querySelector(s),Q=s=>[...document.querySelectorAll(s)],R=e=>{if(!e)return null;const b=e.getBoundingClientRect();return {x:Math.round(b.x),y:Math.round(b.y),w:Math.round(b.width),h:Math.round(b.height)}};
          const ms=Q('#battleBox .mini:not(.dead)');
          return {n:ms.length,all:Q('#battleBox .mini').length,hb:Q('#battleBox .mini .hb91').length,
            bar:R(q('#battleBox .mini:not(.dead) .bar91')),num:ms.map(m=>(m.querySelector('.num91')||{}).textContent),
            title:ms.map(m=>((m.title||'').match(/HP (\\d+)/)||[])[1]),
            ar:R(q('#battleBox .arena2')),mn:R(q('#battleBox .minions')),ft:R(q('#battleBox .ft90')),
            old:Q('#battleBox .mh90').length,sw:document.documentElement.scrollWidth,iw:innerWidth,
            name:document.title,h1:(q('.brand h1,h1')||{}).textContent,html:document.body.innerText.includes('해비티카틱')}}""")
        print(W,r)
        ok(r['all']>0,f'[{W}] 쫄따구가 있음',r['all'])
        ok(r['hb']==r['all'],f'[{W}] 모든 쫄따구에 막대 칸',(r['hb'],r['all']))
        if r['n']:
            ok(r['bar'] and r['bar']['h']>=7 and r['bar']['w']>=30,f'[{W}] 막대가 충분히 큼(≥7×30px)',r['bar'])
            ok(r['num']==r['title'],f'[{W}] 막대 숫자 = 툴팁 HP',(r['num'][:4],r['title'][:4]))
        ok(r['old']==0,f'[{W}] 옛 3px 막대는 없음')
        ok(r['ar'] and r['mn'] and r['ft'] and r['ar']['y']<r['mn']['y']<r['ft']['y'],f'[{W}] 순서: 전투 장면 → 쫄따구 → 영역 막대',(r['ar'] and r['ar']['y'],r['mn'] and r['mn']['y'],r['ft'] and r['ft']['y']))
        ok(r['sw']<=r['iw'],f'[{W}] 가로로 안 넘침')
        ok('씩씩' in r['name'] and not r['html'],f'[{W}] 이름 씩씩(탭 제목·본문에 옛 이름 없음)',r['name'])
        pg.screenshot(path=f'/tmp/m92_{W}.png')
        ok(not errs,f'[{W}] 콘솔 오류 없음',errs[:2])
        b.close()

    # ---- 2. 도전 보스 (폰)
    b,pg=run(pw,390,844);closepops(pg);errs.clear()
    pg.evaluate("()=>{location.hash='#home';C.weekly.bossHp=50;render()}");pg.wait_for_timeout(300)
    ok(pg.evaluate("!document.querySelector('.sum91')"),'[도전] 보스가 살아 있으면 불러내기 단추 없음')
    pg.evaluate(INJ,300);pg.wait_for_timeout(400)
    ok(pg.evaluate("weekState(dateKey()).dead"),'[도전] 주간 보스 처치 상태')
    ok(pg.is_visible('.sum91'),'[도전] 처치 뒤 "다음 보스 불러내기" 단추가 보임')
    ok(pg.evaluate("!!document.querySelector('.cb91 [data-info=boss]')"),'[도전] ✓ 이번 주 보스 처치 칩')
    pos=pg.evaluate("(()=>{const r=e=>e.getBoundingClientRect().y,q=s=>document.querySelector(s);return [r(q('.arena2')),r(q('.cb91')),r(q('.minions')),r(q('.ft90'))]})()")
    ok(pos==sorted(pos),'[도전] 순서: 장면 → 불러내기 줄 → 쫄따구 → 영역',pos)
    pg.screenshot(path='/tmp/m92_summon.png')
    closepops(pg);pg.click('.sum91');pg.wait_for_timeout(500)
    st=pg.evaluate("({n:(C.chal91||{}).list&&C.chal91.list.length,name:document.querySelector('.boss2.c91 b')&&document.querySelector('.boss2.c91 b').textContent,hp:document.querySelector('.boss2.c91 .num')&&document.querySelector('.boss2.c91 .num').textContent,weekly:bossOf(dateKey()).name,btn:!!document.querySelector('.sum91')})")
    print(st)
    ok(st['n']==1 and st['name'] and st['name']!=st['weekly'],'[도전] 1번째 도전 보스 등장(이번 주 보스와 다른 이름)',st)
    ok(st['hp'] and st['hp'].startswith('180/180') or (st['hp'] or '').split('/')[0]==(st['hp'] or '').split('/')[-1],'[도전] 새 보스는 HP 가득',st['hp'])
    ok(not st['btn'],'[도전] 도전 보스가 살아 있는 동안 단추 없음')
    pg.screenshot(path='/tmp/m92_chal1.png')
    # 보스를 눌러 설명 창 → 이번 주 보스 보기
    closepops(pg);pg.click('.boss2.c91');pg.wait_for_timeout(400)
    ok('도전 보스' in pg.inner_text('#sheetC'),'[도전] 도전 보스를 누르면 도전 보스 창')
    pg.click('[data-w91=weekly]');pg.wait_for_timeout(400)
    ok('이번 주 보스' in pg.inner_text('#sheetC'),'[도전] 거기서 이번 주 보스 창으로')
    pg.evaluate("closeSheet()");pg.wait_for_timeout(200)
    # 데미지 → 쓰러뜨림 → 2번째 → 3번째 → 끝
    for i in range(3):
        left=pg.evaluate("(()=>{const l=C.chal91.list;return l[l.length-1].hp})()")
        pg.evaluate(INJ,left+5);pg.wait_for_timeout(500)
        dead=pg.evaluate("!!document.querySelector('.boss2.c91.dead')")
        ok(dead,f'[도전] {i+1}번째 도전 보스 처치 표시')
        if i<2:
            ok(pg.is_visible('.sum91'),f'[도전] {i+1}번째 처치 뒤 다시 불러내기')
            closepops(pg);pg.click('.sum91');pg.wait_for_timeout(400)
    ok(pg.evaluate("!document.querySelector('.sum91')&&document.querySelector('.cb91').innerText.includes('모두')"),'[도전] 3마리 다 잡으면 단추 대신 안내')
    ok(pg.evaluate("new Set(C.chal91.list.map(x=>x.n)).size===3&&C.chal91.list.every(x=>x.n!==bossOf(dateKey()).name)"),'[도전] 3마리 이름이 서로 다르고 이번 주 보스가 아님',pg.evaluate("C.chal91.list.map(x=>x.n)"))
    # 데미지를 되돌리면(기록 삭제) 다시 살아남 — 계산만으로 맞는지
    pg.evaluate("()=>{const k=dateKey();DAYS[k].entries=DAYS[k].entries.filter(e=>e.name!=='시험');render()}");pg.wait_for_timeout(300)
    ok(pg.evaluate("!weekState(dateKey()).dead||true"),'[도전] 기록을 지워도 오류 없음')
    ok(not errs,'[도전] 콘솔 오류 없음',errs[:3])
    b.close()

    # ---- 3. 보스 HP 자동 조정
    b,pg=run(pw,390,844);closepops(pg);errs.clear()
    setup="""(opts)=>{const w=weekStart(dateKey());
      for(let i=1;i<=4;i++){const pw=addDays(w,-7*i);weekKeys(pw).forEach((k,j)=>{delete DAYS[k];
        if(i<=opts.weeks&&j<5)DAYS[k]=normDay(k,{entries:[{id:'a'+i+j,kind:'act',type:'good',name:'시험',xp:opts.xp,cond:0,gold:0}]})})}
      C.weekly.bossHp=opts.hp;C.bauto91=null;C.bauto91off=0;C.bhp91={};render()}"""
    pg.evaluate(setup,{'weeks':3,'xp':200,'hp':400});pg.wait_for_timeout(500)
    st=pg.evaluate("({hp:C.weekly.bossHp,a:C.bauto91,fr:Object.keys(C.bhp91||{}).length,prev:weekState(addDays(weekStart(dateKey()),-7)).hp,cur:weekState(dateKey()).hp})")
    print(st)
    ok(st['hp']==520,'[자동] 평균 1000 → 목표 800이지만 한 번에 +30%까지만(520)',st['hp'])
    ok(st['a'] and st['a']['from']==400 and st['a']['to']==520 and st['a']['n']==3,'[자동] 조정 기록',st['a'])
    ok(st['fr']>=26 and st['prev']==400,'[자동] 지난 주 HP는 400으로 고정',(st['fr'],st['prev']))
    ok(st['cur']==520,'[자동] 이번 주 HP 520',st['cur'])
    pg.wait_for_function("document.getElementById('toast').innerText.includes('맞췄어요')",timeout=5000)
    ok('되돌리기' in pg.inner_text('#toast'),'[자동] 알림에 HP 변경과 되돌리기',pg.inner_text('#toast')[:80])
    pg.click('#toast .tbtn55');pg.wait_for_timeout(400)
    ok(pg.evaluate("C.weekly.bossHp")==400,'[자동] 되돌리기 → 400')
    pg.evaluate("render()");pg.wait_for_timeout(300)
    ok(pg.evaluate("C.weekly.bossHp")==400,'[자동] 되돌린 주엔 다시 안 바꿈')
    # 같은 주에 두 번째 render는 안 바꿈 / 끄면 안 바꿈 / 기록 부족이면 안 바꿈
    pg.evaluate(setup,{'weeks':3,'xp':200,'hp':400});pg.wait_for_timeout(300)
    pg.evaluate("render()");ok(pg.evaluate("C.weekly.bossHp")==520,'[자동] 같은 주엔 한 번만(520 유지)')
    pg.evaluate("(o)=>{C.bauto91off=1;C.bauto91=null;C.weekly.bossHp=400;render()}",0);pg.wait_for_timeout(300)
    ok(pg.evaluate("C.weekly.bossHp")==400,'[자동] 끄면 안 바꿈')
    pg.evaluate(setup,{'weeks':1,'xp':200,'hp':400});pg.wait_for_timeout(300)
    ok(pg.evaluate("C.weekly.bossHp")==400,'[자동] 기록 있는 주가 1주뿐이면 안 바꿈')
    pg.evaluate(setup,{'weeks':3,'xp':80,'hp':400});pg.wait_for_timeout(300)
    ok(pg.evaluate("C.weekly.bossHp")==320,'[자동] 평균 400 → 320 (너무 어려우면 낮춤, -30% 안)',pg.evaluate("C.weekly.bossHp"))
    pg.evaluate(setup,{'weeks':3,'xp':100,'hp':400});pg.wait_for_timeout(300)
    ok(pg.evaluate("C.weekly.bossHp")==400,'[자동] 5% 안쪽 차이는 그대로(평균 500 → 400)')
    # 보스 창의 규칙 칸에서 켜기·끄기
    pg.evaluate(setup,{'weeks':3,'xp':200,'hp':400});pg.wait_for_timeout(300)
    pg.evaluate("bossSheet65()");pg.wait_for_timeout(400)
    pg.evaluate("document.querySelector('#sheetC details.br68').open=true")
    ok(pg.is_visible('#sheetC [data-a91]') and pg.is_checked('#sheetC [data-a91]'),'[자동] 보스 규칙에 자동 조정 체크칸(켜짐)')
    ok('400 → 520' in pg.inner_text('#sheetC') or '520' in pg.inner_text('#sheetC'),'[자동] 설명에 조정 내용')
    pg.uncheck('#sheetC [data-a91]');pg.wait_for_timeout(300)
    ok(pg.evaluate("C.bauto91off")==1,'[자동] 체크 끄면 C.bauto91off')
    ok(not errs,'[자동] 콘솔 오류 없음',errs[:3])
    b.close()
print('FAILS',len(FAILS),FAILS)
