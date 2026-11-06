exec(open('h61.py').read())
import json
J=lambda pg,x:pg.evaluate(x)
CNT="C.routines.map(r=>r.name+':'+r.steps.length+'/heads'+Object.values(TASKS).filter(t=>t.rid===r.id&&t.status===0).length+'/kids'+Object.values(TASKS).filter(t=>t.rstep&&t.status===0).length)"
with sync_playwright() as pw:
    b,pg=run(pw);closepops(pg);pg.wait_for_timeout(1500)
    print('base',J(pg,CNT))
    # 겹친 상태 만들기: 머리 둘(둘 다 반복) + 단계 3배 + 습관 반복 겹침
    J(pg,"""(()=>{heal65=function(){};const r=C.routines[0];const h=rtH62(r,true);
      const h2=newTask({title:r.name,rid:r.id,list:h.list,rep:{f:'d',i:1}});h2.due=dateKey();saveTask(h2);
      if(!h.rep){h.rep={f:'d',i:1};h.due=dateKey();saveTask(h)}
      kidsOf(h.id).forEach(k=>{for(let i=0;i<2;i++){const c=newTask({title:k.title,list:k.list,dur:k.dur});c.parent=(i?h2.id:h.id);c.rstep=1;if(k.aid)c.aid=k.aid;saveTask(c)}});
      const ht=Object.values(TASKS).find(t=>t.hab&&t.aid&&t.rep&&t.status===0);if(ht){const d=clone(ht);d.id='tdup'+uid();delete d.quest;saveTask(d)}
      save('config')})()""")
    pg.wait_for_timeout(2500)
    print('made',J(pg,CNT))
    store={k:v for k,v in json.loads(dump(pg))};b.close()
    for rnd in range(3):
        b,pg=run(pw,store=store);closepops(pg);pg.wait_for_timeout(2500)
        print('load%d'%rnd,J(pg,CNT),'hab',J(pg,"Object.values(TASKS).filter(t=>t.hab&&t.status===0).length"),'bak',J(pg,"(C.bak65||{tasks:[]}).tasks.length"))
        # 머리 고르기가 할 일 순서와 상관없나
        print(' head-stable',J(pg,"(()=>{const r=C.routines[0],a=rtH62(r).id;const ks=Object.keys(TASKS).reverse(),o={};ks.forEach(k=>o[k]=TASKS[k]);const keep=TASKS;TASKS=o;const b2=rtH62(r).id;TASKS=keep;return a===b2})()"))
        store={k:v for k,v in json.loads(dump(pg))}
        if rnd<2:b.close()
    # 되돌리기 → 자동 정리 꺼짐
    J(pg,"undo65()");pg.wait_for_timeout(600);print('undo',J(pg,CNT),'noHeal',J(pg,"C.noHeal65"))
    J(pg,"delete C.noHeal65;heal65.told=0;render()");pg.wait_for_timeout(600);print('reheal',J(pg,CNT))
    # 일부러 같은 단계 두 번 → 정리 안 함
    J(pg,"(()=>{const r=C.routines[0];const k=TASKS[r.steps[0].tid];rtAdd61(r,{name:k.title});render()})()");pg.wait_for_timeout(500)
    print('dupok',J(pg,CNT),J(pg,"Object.values(TASKS).filter(t=>t.dupok65).length"))
    # 루틴 줄 점수
    J(pg,"location.hash='tasks';C.ui.tasks.sel='routine';render()");pg.wait_for_timeout(700)
    print('row',J(pg,"(document.querySelector('.tx65')||{}).textContent"))
    # 캘린더: 주 보기로 바꿔도 다시 열면 월
    J(pg,"location.hash='cal'");pg.wait_for_timeout(700);J(pg,"calState().mode='week';renderCal()");J(pg,"location.hash='home'");pg.wait_for_timeout(500);J(pg,"location.hash='cal'");pg.wait_for_timeout(800)
    print('calmode',J(pg,"calState().mode"))
    J(pg,"ui.cal63=true;ui.calSel=dateKey();renderCal()");pg.wait_for_timeout(300);J(pg,"document.getElementById('calAdd').value='메모 중';document.getElementById('calAdd').focus();render()");pg.wait_for_timeout(300)
    print('card',J(pg,"[!!document.querySelector('.dp64c.still65'),document.getElementById('calAdd').value,document.activeElement&&document.activeElement.id]"))
    pg.screenshot(path=SP+'t65cal.png')
    # 쫄따구·보스 누르기
    J(pg,"(()=>{const t=newTask({title:'세금 서류',due:dateKey()});saveTask(t);t.skull=2;saveTask(t);window.__T=t.id;render()})()")
    J(pg,"location.hash='home'");pg.wait_for_timeout(800)
    n=J(pg,"document.querySelectorAll('#battleBox .mini').length");print('minis',n,'badges visible',J(pg,"[...document.querySelectorAll('#battleBox .mb61')].filter(x=>x.offsetParent).length"))
    pg.locator('#battleBox .mini').first.click();pg.wait_for_timeout(400);print('mobsheet',J(pg,"!!document.querySelector('#sheetC .mob65')"),J(pg,"document.querySelector('#sheetC h3').textContent"))
    pg.screenshot(path=SP+'t65mob.png');J(pg,"closeSheet()")
    pg.locator('#battleBox .boss2').click();pg.wait_for_timeout(400);print('bosssheet',J(pg,"document.querySelector('#sheetC h3').textContent"));J(pg,"closeSheet()")
    # 삼진아웃
    J(pg,"(()=>{const t=TASKS[__T];t.due=dateKey();postpone(t,addDays(dateKey(),1))})()");pg.wait_for_timeout(700)
    print('strike',J(pg,"document.querySelector('#sheetC h3')&&document.querySelector('#sheetC h3').textContent"))
    pg.click('[data-s65="split"]');pg.fill('#s65in','파일만 열기');pg.click('[data-s65="mk"]');pg.wait_for_timeout(400)
    print('split',J(pg,"kidsOf(__T).map(k=>k.title+'/'+k.due)"),J(pg,"TASKS[__T].skull"))
    # 피하고 있어요
    J(pg,"avoid65(__T)");pg.wait_for_timeout(300);pg.click('[data-av65why="fear"]');pg.wait_for_timeout(150);print('kind',J(pg,"document.querySelector('.av65kind').textContent.slice(0,20)"))
    pg.click('[data-av65="next"]');pg.click('[data-av65="must"]');pg.fill('#av65why','빨리 하고 쉬자');pg.locator('.st65sp [data-av65="next"]').click();pg.wait_for_timeout(200)
    print('step3',J(pg,"ui.av65.step"),J(pg,"TASKS[__T].reframe"))
    pg.click('[data-av65="taste"]');pg.wait_for_timeout(500);print('run',J(pg,"RUN&&[RUN.taste65,RUN.target]"),J(pg,"TASKS[__T].brave"))
    J(pg,"RUN.start-=11*60*1000;runSave();drawHunt(true)");pg.wait_for_timeout(700)
    print('taste box',J(pg,"document.getElementById('taste65')&&document.getElementById('taste65').dataset.st"))
    pg.screenshot(path=SP+'t65hunt.png')
    pg.click('[data-t65="stop"]');pg.wait_for_timeout(500);closepops(pg)
    print('start entry',J(pg,"today().entries.filter(e=>e.kind==='start65').map(e=>e.name+' '+e.xp)"))
    # 한 줄 일기 + 대기 모드
    J(pg,"(()=>{const t=newTask({title:'4시 약속',due:dateKey(),time:'23:59'});saveTask(t);render()})()");pg.wait_for_timeout(300)
    print('wait',J(pg,"!!document.querySelector('#sugg .w65')"),'j65',J(pg,"document.querySelectorAll('#sugg .j65b').length"))
    pg.locator('#sugg .j65b.now').click();pg.wait_for_timeout(300);pg.click('[data-j65m="t"]');pg.fill('#j65txt','서류 피했음. 무서워서');pg.click('[data-j65save]');pg.wait_for_timeout(1500)
    print('saved',J(pg,"JSON.stringify(today().j65)"))
    pg.screenshot(path=SP+'t65home.png')
    store={k:v for k,v in json.loads(dump(pg))};b.close()
    b,pg=run(pw,store=store);closepops(pg);pg.wait_for_timeout(1500)
    print('j65 after reload',J(pg,"JSON.stringify(today().j65||null)"))
    J(pg,"location.hash='review'");pg.wait_for_timeout(800);print('review',J(pg,"document.body.innerText.includes('나눠 쓴 한 줄 일기')"))
    # 우클릭 메뉴
    J(pg,"location.hash='tasks'");pg.wait_for_timeout(600)
    J(pg,"(()=>{const t=Object.values(TASKS).find(x=>x.status===0&&!x.rid&&!x.rstep&&!x.hab);taskMenu61(t,100,100)})()");pg.wait_for_timeout(200)
    print('menu',J(pg,"[...document.querySelectorAll('#m61 button')].map(b=>b.textContent).slice(0,5)"))
    b.close()
    for e in errs[:12]:print(e[:400])
