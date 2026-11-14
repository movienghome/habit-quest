# t103 (v10.0): K2 시나리오 주간 — 10분만도 1회 · 여유 일수 · 점 7개 · 내일 짜기 경보 · 하그둘 꼬리표
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
J=lambda pg,x:pg.evaluate(x)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra) if extra!='' else ''))
    if not c:FAILS.append(msg)
def notoast(pg):
    J(pg,"(()=>{const t=document.getElementById('toast');if(t){t.classList.remove('on');t.style.pointerEvents=''}})()")
def run_t(pg,W):
    pg.wait_for_timeout(500)
    J(pg,"""(()=>{window.__mk=(n)=>{const t=newTask({title:'시나리오 쓰기',rep:{f:'x',n:n},due:null});t.rep={f:'x',n:n};t.due=addDays(weekStart(dateKey()),6);t.aid=C.actions[0].id;saveTask(t);return t.id};
      window.__fake=(k,tid,extra)=>{DAYS[k]=DAYS[k]||{date:k,entries:[]};DAYS[k].entries=DAYS[k].entries||[];DAYS[k].entries.push(Object.assign({id:'f'+Math.random().toString(36).slice(2),tid:tid,aid:C.actions[0].id,name:'x',type:'good',kind:'task',xp:1,gold:0,cond:0},extra||{}));}})()""")
    # 1) 10분만 = 1회, 같은 날 정식 기록이 있으면 두 번 안 셈
    r=J(pg,"""(()=>{const id=__mk(5),T=TASKS[id],ws=weekStart(dateKey()),k0=addDays(ws,0),k1=addDays(ws,1),k2=addDays(ws,2);
      const c0=wkCnt91(T,ws);
      __fake(k0,null,{kind:'start65',tid:undefined,aid:undefined,t65:id});
      const c1=wkCnt91(T,ws);
      __fake(k0,id);const c2=wkCnt91(T,ws);        // 같은 날 정식 기록 → 그날은 1 그대로
      __fake(k1,id);__fake(k1,id);const c3=wkCnt91(T,ws); // 같은 날 정식 둘 → 2
      __fake(k2,null,{kind:'start65',tid:undefined,aid:undefined,t65:id});const c4=wkCnt91(T,ws); // 수요일 10분만만 → +1
      return {id,c0,c1,c2,c3,c4}})()""")
    ok(r['c0']==0,f'[{W}] 처음 0',r)
    ok(r['c1']==1,f'[{W}] 🌱 10분만 기록 = 1회',r)
    ok(r['c2']==1,f'[{W}] 같은 날 정식 기록이 있으면 10분만은 따로 안 셈',r)
    ok(r['c3']==3,f'[{W}] 정식 기록은 그대로 셈(월 1 + 화 2)',r)
    ok(r['c4']==4,f'[{W}] 정식 기록 없는 날의 10분만은 +1',r)
    # 2) 여유 일수
    s=J(pg,"""(()=>{const T=TASKS['%s'],ws=weekStart(dateKey());
      return {mon:slack99(T,ws),fri:slack99(T,addDays(ws,4)),sun:slack99(T,addDays(ws,6))}})()"""%r['id'])
    
    ok(s['mon']['need']==1 and s['mon']['days']==7 and s['mon']['slack']==6,f'[{W}] 월요일부터면 여유 5일',s['mon'])
    ok(s['fri']['slack']==2,f'[{W}] 금요일부터 3일 − 1번 = 2일',s['fri'])
    ok(s['sun']['slack']==0,f'[{W}] 일요일에 1번 남으면 0일',s['sun'])
    # 3) 점 7개 + 위 줄
    J(pg,"location.hash='cal'");pg.wait_for_timeout(1500);notoast(pg)
    w=J(pg,"""(()=>{const e=document.querySelector('.wk91 .k105[data-wk105]:not(.all)');if(!e)return null;return {n:e.querySelectorAll('.d99').length,txt:e.textContent,aria:(e.querySelector('.dd99')||{}).getAttribute&&e.querySelector('.dd99').getAttribute('aria-label')}})()""")
    ok(w is not None,f'[{W}] 위 줄에 주 N회 칩(k99)이 있음')
    if w:
        ok(w['n']==7,f'[{W}] 점이 7개',w['n'])
        ok('4/5' in w['txt'],f'[{W}] n/N 그대로 보임',w['txt'])
        J(pg,"document.querySelector('.wk91 .k105[data-wk105]:not(.all)').click()");pg.wait_for_timeout(400)
        st=J(pg,"(document.querySelector('.w105c')||{}).innerText||''")
        ok('남은' in st and '쉬어도' in st or '쉬는 날 없이' in st,f'[{W}] 칩을 누르면 남은 횟수·쉬는 날이 글자로 보임(색만 X)',st[:120]);J(pg,"closeSheet()")
        ok('●' in w['txt'] and '◐' in w['txt'],f'[{W}] ● 한 날 · ◐ 10분만 한 날이 글자로 구분됨',w['txt'])
        ok(w['aria'] and '10분만' in w['aria'],f'[{W}] 점 줄에 읽어 주는 설명(aria-label)',w['aria'])
    # 4) 내일 짜기 맨 위 줄 경보(여유 0일)
    J(pg,"""(()=>{const id='%s',T=TASKS[id],k=addDays(midKey68(),1),ws=weekStart(k);
      // 그 주 기록을 비우고 N = 남은 날 수로 → 여유 0
      for(let i=0;i<7;i++){const d=DAYS[addDays(ws,i)];if(d)d.entries=(d.entries||[]).filter(e=>e.tid!==id&&e.kind!=='start65')}
      const days=slack99(T,k).days;T.rep.n=days;saveTask(T)})()"""%r['id'])
    J(pg,"planSheet80()");pg.wait_for_timeout(600)
    a=J(pg,"(()=>{const e=document.querySelector('#sheetC .al99');return e?e.textContent:null})()")
    ok(a is not None and '매일 한 번씩' in a,f'[{W}] 내일 짜기 맨 위에 경보',a)
    tt=J(pg,"(()=>{const e=document.querySelector('#sheetC .al99');return e?e.title:''})()")
    ok('안 깎여요' in tt,f'[{W}] 점수 안 깎인다고 알림(마우스 올리면)',tt)
    first=J(pg,"(()=>{const sc=document.getElementById('sheetC'),sh=sc.querySelector('.sh');return !!(sh&&sh.nextElementSibling&&sh.nextElementSibling.classList.contains('al99'))})()")
    ok(first,f'[{W}] 머리 바로 아래(첫 줄)에 있음')
    # 여유가 있으면 경보 없음
    J(pg,"""(()=>{const T=TASKS['%s'];T.rep.n=1;saveTask(T);__fake(midKey68(),'%s');closeSheet();planSheet80()})()"""%(r['id'],r['id']));pg.wait_for_timeout(500)
    a2=J(pg,"!!document.querySelector('#sheetC .al99')")
    ok(not a2,f'[{W}] 여유 있으면 경보 없음')
    J(pg,"closeSheet()")
    # 5) 하그둘 꼬리표
    h=J(pg,"""(()=>{const id=__mk(5),T=TASKS[id];T.hg99=1;saveTask(T);
      const ok1=hgOn99({tid:id});
      const before=hgCnt99(T,weekStart(dateKey()));
      completeTask(T);return {id,ok1,before}})()""");pg.wait_for_timeout(400)
    ok(h['ok1'] and h['before']==0,f'[{W}] 꼬리표 켠 할 일',h)
    btn=J(pg,"!!document.querySelector('#snack [data-snack99]')")
    ok(btn,f'[{W}] 끝낸 뒤 아래 알림에 🤝 단추')
    J(pg,"document.querySelector('#snack [data-snack99]').click()");pg.wait_for_timeout(400)
    c=J(pg,"""(()=>{const T=TASKS['%s'];return hgCnt99(T,weekStart(dateKey()))})()"""%h['id'])
    ok(c==1,f'[{W}] 🤝 누르면 이번 주 하그둘 1회',c)
    # 같은 카드 정해진 일정 끝내면 저절로
    c2=J(pg,"""(()=>{const t=newTask({title:'하그둘 만남',list:'fixed',due:midKey68()});t.list='fixed';t.aid=TASKS['%s'].aid;saveTask(t);completeTask(TASKS[t.id]);
      return hgCnt99(TASKS['%s'],weekStart(dateKey()))})()"""%(h['id'],h['id']));pg.wait_for_timeout(300)
    ok(c2==2,f'[{W}] 같은 카드 정해진 일정(하그둘 만남)을 끝내면 저절로 표시',c2)
    # 꼬리표 안 켠 할 일은 🤝 없음
    nb=J(pg,"""(()=>{const id=__mk(5);completeTask(TASKS[id]);return !!document.querySelector('#snack [data-snack99]')})()""");pg.wait_for_timeout(200)
    ok(not nb,f'[{W}] 꼬리표 안 켠 할 일엔 🤝 없음')
    # 위 줄 🤝 n회
    J(pg,"location.hash='tasks'");pg.wait_for_timeout(300);J(pg,"location.hash='cal'");pg.wait_for_timeout(1300)
    hw=J(pg,"(()=>{return [...document.querySelectorAll('.wk91 .k105[data-wk105]:not(.all)')].map(e=>e.textContent).join('|')})()")
    ok('🤝' in hw,f'[{W}] 위 줄에 🤝 n회',hw)
    # 같은 카드로 이은 주 N회 할 일은 위 줄에 한 칩으로 합쳐짐
    g=J(pg,"""(()=>{const a=TASKS[__mk(5)],b=newTask({title:"'하나 그리고 둘'",rep:{f:'x',n:3},due:null});b.rep={f:'x',n:3};b.aid=a.aid;b.due=a.due;saveTask(b);a.title='시나리오 쓰기 합침시험';saveTask(a);render();return 1})()""");pg.wait_for_timeout(900)
    g2=J(pg,"""(()=>{const c=[...document.querySelectorAll('.wk91 .k105[data-wk105]:not(.all)')];return {n:c.length,txt:c.map(e=>e.title+e.textContent).join('|')}})()""")
    ok(g2['n']==1,f'[{W}] 같은 카드(시나리오 쓰기·하나 그리고 둘)는 위 줄에 한 칩',g2)
    ok("합침시험" in g2['txt'] and "하나 그리고 둘" in g2['txt'] and ' + ' in g2['txt'],f'[{W}] 칩 이름이 두 할 일을 + 로 같이 보여 줌',g2['txt'])
    # 메뉴 항목
    m=J(pg,"""(()=>{const id=__mk(5);sheetCtx={task:id};let got=null;const _m=menu61;
      try{menu61(10,10,'t',[{l:'🗑 삭제',keep:1,f(){}}])}catch(e){return 'ERR '+e}
      return [...document.querySelectorAll('[role=menuitem]')].map(b=>b.textContent).join('|')})()""")
    ok('하그둘 꼬리표' in m,f'[{W}] 상세 ⋯ 메뉴에 하그둘 꼬리표 항목',m)

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
