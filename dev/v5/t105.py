# t105 (v10.2): F1 조각 1 — 막대 구조 분리(🔋 컨디션 / 📈 진척 / 💰 경제) + 아침 에너지 빼기
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
J=lambda pg,x:pg.evaluate(x)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra) if extra!='' else ''))
    if not c:FAILS.append(msg)
def notoast(pg):
    J(pg,"(()=>{const t=document.getElementById('toast');if(t){t.classList.remove('on');t.style.pointerEvents=''}})()")
PUT="""window.put105=(k,e)=>{DAYS[k]=DAYS[k]||blankDay(k);DAYS[k].entries=DAYS[k].entries||[];DAYS[k].entries.push(Object.assign({id:'z'+Math.random().toString(36).slice(2),type:'good',xp:0,gold:0,t:'10:00'},e))};"""
def run_t(pg,W):
    pg.wait_for_timeout(600);notoast(pg)
    J(pg,PUT)
    J(pg,"C.bs102off=1")   # v10.3: 조각 1 규칙만 보는 시험 — 몸 출발점(이월·최대)은 t106
    st=J(pg,"({f:C.f1from101,td:gk76(),ak:C.ak101,hpb:C.hpb101,cls:document.body.classList.contains('f101'),en:getComputedStyle(document.getElementById('energy')).display})")
    ok(st['f']==st['td'],f'[{W}] 처음 켜질 때 오늘(게임 날)부터 새 규칙',st)
    ok(st['ak']=={'body':'c','mind':'c','make':'p','grow':'p','life':'c','money':'m'},f'[{W}] 영역 종류 짐작(몸·마음·생활=🔋, 작품·성장=📈, 경제=💰)',st['ak'])
    ok(st['cls'] and st['en']=='none',f'[{W}] 아침 에너지 단추 숨김')
    ok(st['hpb']==60,f'[{W}] 하루 시작값 = 옛 보통 값 60',st['hpb'])
    # 홈 막대
    J(pg,"location.hash='home'");pg.wait_for_timeout(600)
    h=J(pg,"(()=>{const b=document.getElementById('areaBars');return {n:b.querySelectorAll('.area').length,names:[...b.querySelectorAll('.area b')].map(x=>x.textContent),pc:[...b.querySelectorAll('.pc101')].map(x=>x.textContent)}})()")
    ok(h['n']==3 and h['names']==['몸','마음','생활'],f'[{W}] 홈 막대는 🔋 영역 셋만',h)
    ok(len(h['pc'])==3 and h['pc'][0].startswith('📈 작품') and 'Lv' in h['pc'][0] and h['pc'][2].startswith('💰 경제'),f'[{W}] 작품·성장은 📈, 경제는 💰 칩(레벨·아이콘+글자)',h['pc'])
    # HP 계산
    base=J(pg,"overallOf(today())")
    ok(base==60,f'[{W}] 기록 없는 오늘 HP = 60',base)
    J(pg,"""(()=>{const td=gk76(),mk=C.actions.find(a=>a.area==='make'&&a.type==='good')||{id:'mk'};window.MK105=mk.id;
      put105(td,{kind:'act',aid:mk.id,name:'창작 일',area:'make',cond:10,xp:20});
      put105(td,{kind:'act',name:'몸 일',area:'body',cond:7,xp:5});render()})()""")
    v=J(pg,"overallOf(today())")
    ok(v==67,f'[{W}] 창작 +10은 HP에 안 들어감, 몸 +7만 → 67',v)
    J(pg,"put105(gk76(),{kind:'courage',name:'용기',area:'make',cond:4,xp:8});render()")
    v=J(pg,"overallOf(today())")
    ok(v==71,f'[{W}] ⚔ 용기 기록은 영역(창작)과 관계없이 들어감 → 71',v)
    J(pg,"(()=>{const a=C.actions.find(x=>x.id===MK105);if(a){a.hk101='c'}render()})()")
    v=J(pg,"overallOf(today())")
    ok(v==81,f'[{W}] 카드 예외 HP에 넣기 → 창작 카드 +10도 들어감 → 81',v)
    J(pg,"(()=>{const a=C.actions.find(x=>x.id===MK105);if(a)delete a.hk101;render()})()")
    # 지난 날은 옛 규칙
    old=J(pg,"""(()=>{const y=addDays(gk76(),-1);DAYS[y]=blankDay(y);DAYS[y].energy=5;put105(y,{kind:'act',name:'창작 어제',area:'make',cond:10,xp:10});put105(y,{kind:'act',name:'몸 어제',area:'body',cond:-6,xp:0,type:'bad'});render();
      return {now:overallOf(DAYS[y]),old:ovOld101(DAYS[y]),neu:ovNew101(DAYS[y]),base:hpBase101(DAYS[y])}})()""")
    ok(old['now']==80 and old['old']==80,f'[{W}] 어제 HP는 옛 규칙(아침 쌩쌩 76 + 창작 10 − 몸 6 = 80) 그대로',old)
    ok(old['neu']==54,f'[{W}] 비교용 새 규칙(60 − 6) = 54',old)
    ok(old['base']==76,f'[{W}] 어제 시작점은 아침 에너지 값(76)',old)
    # HP 설명 창
    J(pg,"openInfo('hp')");pg.wait_for_timeout(400)
    t=J(pg,"(document.getElementById('pop')||{}).textContent||''")
    ok('새 규칙' in t and '하루 시작값' in t,f'[{W}] HP 창에 새 규칙 설명',t[:150])
    ok('옛 규칙' in t and '80' in t and '54' in t,f'[{W}] HP 창에 어제 옛 80 → 새 54 비교',t[-260:])
    pg.click('#popClose');pg.wait_for_timeout(200)
    # 영역 창의 종류 칩 → 몸을 📈로
    J(pg,"openInfo('area:body')");pg.wait_for_timeout(400)
    n=J(pg,"document.querySelectorAll('#pop [data-ak101^=\"body:\"]').length")
    ok(n==3,f'[{W}] 몸 영역 창에 종류 칩 셋',n)
    if n==3:
        pg.click('#pop [data-ak101="body:p"]');pg.wait_for_timeout(400)
        v=J(pg,"({ak:C.ak101.body,hp:overallOf(today())})")
        ok(v['ak']=='p' and v['hp']==64,f'[{W}] 몸 → 📈 진척이면 몸 +7도 빠짐(60+4) → 64',v)
        pg.click('#pop [data-ak101="body:c"]');pg.wait_for_timeout(300)
    pg.click('#popClose');pg.wait_for_timeout(200)
    # 편집 → 컨디션 영역 칸
    J(pg,"location.hash='edit'");pg.wait_for_timeout(600);pg.click('[data-etab="areas"]');pg.wait_for_timeout(500)
    e=J(pg,"(()=>{const p=document.querySelector('.ak101p');return p?{t:p.textContent,rows:p.querySelectorAll('.ak101r').length,cards:p.querySelectorAll('[data-hk101]').length}:null})()")
    ok(e is not None and e['rows']==6,f'[{W}] 편집 → 컨디션 영역에 종류 칸(영역 6줄)',e and e['rows'])
    if e:
        ok('하루 시작 HP' in e['t'] and '멈춤 표시' in e['t'],f'[{W}] 시작값·멈춤 일수 칸')
        hk=J(pg,"(()=>{const b=document.querySelector('.ak101p [data-hk101=\"'+MK105+'\"]');return b?b.textContent:null})()")
        ok(hk is not None and '뺌' in hk,f'[{W}] 창작 카드가 컨디션 점수 카드 목록에 ○ 뺌으로',hk)
        if hk:
            J(pg,"document.querySelector('.ak101p details[data-cd101=\"make\"]').open=true");pg.wait_for_timeout(100)
            pg.click('.ak101p [data-hk101="'+J(pg,'MK105')+'"]');pg.wait_for_timeout(400)
            v=J(pg,"({h:(C.actions.find(x=>x.id===MK105)||{}).hk101,hp:overallOf(today())})")
            ok(v['h']=='c' and v['hp']==81,f'[{W}] 눌러서 HP에 넣음 → 81',v)
            ok(J(pg,"document.querySelector('.ak101p details[data-cd101=\"make\"]').open"),f'[{W}] 다시 그려도 펼친 채')
            pg.click('.ak101p [data-hk101="'+J(pg,'MK105')+'"]');pg.wait_for_timeout(400)
            v=J(pg,"({h:(C.actions.find(x=>x.id===MK105)||{}).hk101,hp:overallOf(today())})")
            ok(not v['h'] and v['hp']==71,f'[{W}] 다시 눌러 뺌 → 71',v)
        # 시작값 바꾸기
        pg.fill('.ak101p [data-f101="hpb101"]','50');pg.press('.ak101p [data-f101="hpb101"]','Tab');pg.wait_for_timeout(400)
        v=J(pg,"({b:C.hpb101,hp:overallOf(today()),y:overallOf(DAYS[addDays(gk76(),-1)])})")
        ok(v['b']==50 and v['hp']==61 and v['y']==80,f'[{W}] 시작값 50 → 오늘 61, 어제는 그대로 80',v)
        J(pg,"C.hpb101=60;render()")
        # 옛 규칙으로 돌아가기
        pg.click('.ak101p [data-f101off]');pg.wait_for_timeout(400)
        v=J(pg,"({off:C.f101off,hp:overallOf(today()),cls:document.body.classList.contains('f101')})")
        ok(v['off']==1 and v['hp']==81 and not v['cls'],f'[{W}] 옛 규칙으로 → 보통 60 + 모든 영역(10+7+4) = 81, 에너지 단추 다시',v)
        J(pg,"(()=>{const b=document.querySelector('.ak101p [data-f101off]');b&&b.click()})()");pg.wait_for_timeout(400)
        ok(J(pg,"on101()&&overallOf(today())===71"),f'[{W}] 새 규칙 다시 켜기 → 71')
    # 카드 편집 칩
    J(pg,"openActionEditor(MK105)");pg.wait_for_timeout(500)
    c=J(pg,"(()=>{const s=document.querySelector('#sheetC .r95 select.hk101');return s?{v:s.value,t:s.options[s.selectedIndex].textContent,prev:(s.previousElementSibling||{}).dataset?s.previousElementSibling.dataset.ae:''}:null})()")
    ok(c is not None and c['v']=='' and '안 넣음' in c['t'] and c['prev']=='area',f'[{W}] 카드 편집 칩 줄 영역 칩 옆에 🔋 칩(영역 따라 · 안 넣음)',c)
    if c:
        pg.select_option('#sheetC .r95 select.hk101','c');pg.wait_for_timeout(300)
        ok(J(pg,"(C.actions.find(x=>x.id===MK105)||{}).hk101")=='c',f'[{W}] 칩으로 HP에 넣기 저장')
        J(pg,"(()=>{delete C.actions.find(x=>x.id===MK105).hk101})()")
    J(pg,"closeSheet()");pg.wait_for_timeout(200)
    # 멈춤 표시: 창작 기록이 10일 전이 마지막이면 ⏸ 10일째
    J(pg,"""(()=>{const td=gk76();for(const k in DAYS)(DAYS[k].entries||[]).forEach(e=>{if(e.area==='make')e.area='life'});put105(addDays(td,-10),{kind:'act',name:'옛 창작',area:'make',cond:0,xp:9});location.hash='home';render()})()""")
    pg.wait_for_timeout(600)
    pc=J(pg,"(()=>{const b=document.querySelector('#areaBars .pc101');return b?{t:b.textContent,st:b.classList.contains('st101')}:null})()")
    ok(pc and pc['st'] and '⏸10일' in pc['t'],f'[{W}] 10일 멈춘 진척 영역에 ⏸ 10일째(점선 + 글자)',pc)
    # 가로 넘침
    ovf=J(pg,"(()=>{const b=document.getElementById('battleBox');return b?b.scrollWidth-b.clientWidth:-1})()")
    ok(ovf<=1,f'[{W}] 전투 카드 가로 안 넘침',ovf)
    # 진척 칩 누르면 영역 여정
    pg.click('#areaBars .pc101');pg.wait_for_timeout(400)
    ok('영역 여정' in J(pg,"(document.getElementById('sheetC')||{}).textContent||''"),f'[{W}] 진척 칩 → 영역 여정 창')
    J(pg,"closeSheet()")

with sync_playwright() as pw:
    for W,H in [(1400,900),(390,800)]:
        b,pg=run(pw,W=W,H=H)
        try:run_t(pg,W)
        except Exception as e:
            ok(False,f'[{W}] 예외 {e}')
        b.close()
real=[e for e in errs if 'favicon' not in e and 'net::' not in e and 'Failed to load' not in e]
ok(not real,'콘솔 오류 없음',real[:3])
print('FAILS',len(FAILS),FAILS)
