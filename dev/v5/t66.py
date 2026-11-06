exec(open('h61.py').read())
import json
J=lambda pg,x:pg.evaluate(x)
SP='/tmp/claude-0/sp/'
with sync_playwright() as pw:
    b,pg=run(pw);closepops(pg);pg.wait_for_timeout(1500)
    # 지난 기록 조금 만들기 (보스·할 일 컨디션 점검용)
    J(pg,"""(()=>{const a=C.actions.find(x=>x.name==='시나리오 25분 집필');for(let i=1;i<=24;i++){const k=dateKey(-i);const d=dayOf(k);d.energy=3;['운동','30분 이상 걷기','스트레칭','일기쓰기'].forEach(n=>{const x=C.actions.find(y=>y.name===n);if(x){const e=actEntry(x,{});e.id=uid();e.t='09:0'+(i%9);d.entries.push(e);P.xp+=e.xp}});
      for(let j=0;j<5;j++)d.entries.push({id:uid(),t:'10:00',kind:'task',type:'good',name:'시험 할 일 '+j,area:'life',xp:10,gold:3,cond:4});
      d.entries.push({id:uid(),t:'11:00',kind:'act',aid:a.id,type:'good',name:a.name,area:'make',xp:25,gold:12,cond:2});
      d.j65={m:{m:'g',txt:'아침에 일찍 일어나서 운동',t:'08:10'},n:{m:'t',txt:'피곤했지만 시나리오 한 장',t:'22:30'}};save(k)}
      const t=dateKey();today().j65={m:{m:'o',txt:'오늘은 비가 와서 실내 운동',t:'09:00'}};save(t);save('progress');render()})()""")
    pg.wait_for_timeout(600)
    # 가챠 ×N
    print('gq', J(pg,"(()=>{const a=C.actions.find(x=>x.name==='시나리오 25분 집필');G().quest={src:'act',id:a.id,name:a.name};const e=actEntry(a,{n:6});finishCtx(e,{},{src:'act',id:a.id});return [e.xp,e.n,e.gq]})()"))
    J(pg,"G().quest=null;save('config')")
    # 홈 뽑기 칸
    J(pg,"location.hash='home'");pg.wait_for_timeout(500);J(pg,"render()");pg.wait_for_timeout(300)
    print('hg',J(pg,"[...document.querySelectorAll('#hGacha .btn')].map(b=>b.textContent)"),J(pg,"!!document.querySelector('[data-hg66e]')"))
    pg.click('[data-hg66e]');pg.wait_for_timeout(300)
    pg.click('[data-hg66t="g5"]');pg.wait_for_timeout(200)
    rr=J(pg,"(C.routines[0]||{}).id")
    if rr: pg.click(f'[data-hg66t="r:{rr}"]');pg.wait_for_timeout(200)
    pg.click('[data-hg66m="q5|-1"]');pg.wait_for_timeout(200)
    pg.screenshot(path=SP+'hg.png')
    J(pg,"closeSheet()");print('hg2',J(pg,"[...document.querySelectorAll('#hGacha .btn')].map(b=>b.textContent)"),J(pg,"C.hg66"))
    # 팁
    pg.click('#tipBox [data-tip66r]');pg.wait_for_timeout(300);pg.screenshot(path=SP+'tip.png');J(pg,"closeSheet()")
    # 행동/습관 구슬 칸
    J(pg,"location.hash='log'");pg.wait_for_timeout(800)
    print('jarP',J(pg,"!!document.getElementById('jar66P')&&!document.getElementById('jar66P').hidden"),J(pg,"JSON.stringify(C.logLay59)"))
    g0=J(pg,"P.xp")
    pg.click('#j66B [data-j66t]:last-child');pg.wait_for_timeout(100)
    J(pg,"document.getElementById('j66N').value='시험 구슬'");pg.click('#j66F button');pg.wait_for_timeout(500);closepops(pg)
    print('marble xp',J(pg,"P.xp")-g0,J(pg,"(()=>{const e=today().entries.find(x=>x.kind==='jar');return e&&[e.xp,e.mt,e.note]})()"))
    pg.set_viewport_size({'width':1400,'height':1100});pg.wait_for_timeout(300);pg.screenshot(path=SP+'log.png')
    # 병 가득 보너스
    J(pg,"(()=>{const j=C.jars[0];j.cap66=20;save('config')})()")
    r=J(pg,"(()=>{const j=C.jars[0];const g0=P.gold;for(let i=0;i<40;i++){applyEntry(today(),{kind:'jar',type:'good',jar:j.id,mt:j.types[0].id,name:'x',xp:1,gold:0})}return [P.gold-g0,jarLayout(j).full,today().entries.filter(e=>e.jf66).length]})()")
    print('full bonus',r);closepops(pg)
    # 아날로그
    J(pg,"location.hash='jars'");pg.wait_for_timeout(700)
    print('tabs',J(pg,"[...document.querySelectorAll('[data-view=jars] .rvtabs59 a')].map(a=>a.textContent)"))
    pg.click('[data-an66open]');pg.wait_for_timeout(300)
    J(pg,"document.querySelector('[data-an66]').value='17'");pg.click('[data-an66go]');pg.wait_for_timeout(500);closepops(pg)
    print('analog',J(pg,"(()=>{const e=today().entries.find(x=>x.an66);return e&&[e.mn,e.xp,e.gold]})()"))
    J(pg,"(()=>{const j=C.jars[1];j.look66='round';j.lid66='c3';j.tint66='amber';C.jars[2].look66='mason';C.jars[3].look66='tall';save('config');render();renderJars()})()");pg.wait_for_timeout(400)
    pg.screenshot(path=SP+'jars.png')
    closepops(pg);pg.click('[data-dec66]');pg.wait_for_timeout(300);pg.screenshot(path=SP+'dec.png');J(pg,"closeSheet()")
    # 돌아보기
    J(pg,"location.hash='review'");pg.wait_for_timeout(900);J(pg,"renderReview59()");pg.wait_for_timeout(300)
    el=pg.query_selector('.jw66')
    if el: el.scroll_into_view_if_needed();pg.wait_for_timeout(200)
    pg.screenshot(path=SP+'review.png',full_page=True)
    print('sc',J(pg,"scoreCheck66().map(x=>x.t+(x.ok?'':' [!]'))"))
    for k in ['tcond','step','boss']:
        if J(pg,f"!!document.querySelector('[data-sc66=\"{k}\"]')"):
            pg.click(f'[data-sc66="{k}"]');pg.wait_for_timeout(300)
    print('applied',J(pg,"[C.taskCond66,C.step66,C.weekly.bossHp]"))
    # 서랍
    J(pg,"location.hash='cal'");pg.wait_for_timeout(700);J(pg,"C.ui.cal.tray=true;save('config');render()");pg.wait_for_timeout(500)
    J(pg,"(()=>{for(let i=0;i<5;i++){const t=newTask({title:'서랍 '+i,list:'inbox',prio:i%3?3:0,dur:i*10+5});saveTask(t)}render()})()");pg.wait_for_timeout(500)
    pg.select_option('[data-t66g="task"]','prio');pg.wait_for_timeout(300)
    closepops(pg);pg.click('[data-t66open]');pg.wait_for_timeout(300)
    print('tray',J(pg,"[document.querySelectorAll('#calTray .titem').length,document.querySelectorAll('#calTray .tgh66').length,JSON.stringify(C.tray66)]"))
    pg.screenshot(path=SP+'tray.png')
    # 전투 기록 골라 지우기
    J(pg,"location.hash='journey'");pg.wait_for_timeout(800)
    closepops(pg);pg.click('[data-b66m="1"]');pg.wait_for_timeout(300)
    n0=J(pg,"today().entries.length");x0=J(pg,"P.xp")
    cbs=pg.query_selector_all('.b66c');print('cbs',len(cbs))
    cbs[0].check();cbs[1].check();pg.wait_for_timeout(200)
    pg.screenshot(path=SP+'blog.png')
    pg.click('[data-b66del]');pg.wait_for_timeout(300);pg.click('[data-b66go]');pg.wait_for_timeout(800);closepops(pg)
    print('deleted',n0-J(pg,"today().entries.length"),'xp',x0-J(pg,"P.xp"))
    # 폰
    pg.set_viewport_size({'width':390,'height':844});J(pg,"location.hash='review'");pg.wait_for_timeout(800)
    pg.screenshot(path=SP+'review_m.png',full_page=True)
    J(pg,"location.hash='home'");pg.wait_for_timeout(600);pg.screenshot(path=SP+'home_m.png',full_page=True)
    for _ in range(7): pg.click('.hero2');pg.wait_for_timeout(60)
    print('egg',J(pg,"!!document.querySelector('.spin66')"))
    b.close()
print('\n'.join(errs[:30]))
