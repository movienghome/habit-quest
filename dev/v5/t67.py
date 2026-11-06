exec(open('h61.py').read())
import json,os
J=lambda pg,x:pg.evaluate(x)
SP=os.environ.get('SP','/tmp/claude-0/sp/')
SEED="""(()=>{for(let i=1;i<=20;i++){const k=dateKey(-i);const d=dayOf(k);d.energy=1+(i%5);['운동','30분 이상 걷기','스트레칭','일기쓰기','가계부 기록'].forEach((n,j)=>{const x=C.actions.find(y=>y.name===n);if(x&&(i+j)%3){const e=actEntry(x,{});e.id=uid();e.t='09:0'+(i%9);d.entries.push(e);P.xp+=e.xp}});
  const bad=C.actions.find(y=>y.type==='bad');if(bad&&i%4===0){const e=actEntry(bad,{});e.id=uid();e.t='23:10';d.entries.push(e)}
  const sv=C.actions.find(y=>y.name==='충동구매 참았다');if(sv&&i%3===0){const e=actEntry(sv,{amt:15000});e.id=uid();e.t='18:00';d.entries.push(e)}
  d.food={veg:i%4,bad:i%5===0?1:0,protein:i%2};if(i%2)d.weight=+(80-i*0.1).toFixed(1);
  if(i%3===0)d.j65={m:{m:'g',txt:'옛 슬롯 일기 '+i,t:'08:10'}};save(k)}save('progress');render()})()"""
with sync_playwright() as pw:
    b,pg=run(pw,W=1300,H=1000);closepops(pg);pg.wait_for_timeout(1500)
    J(pg,SEED);pg.wait_for_timeout(500)
    print('mig',J(pg,"JSON.stringify({ds:C.dayStart,k:C.mig67k,mn:C.jarMn67,brave:C.actions.filter(a=>a.brave).map(a=>a.name+':'+a.brave+':'+a.xp),cm:C.courage.filter(k=>k.m67).length,nav:NAV_ITEMS.find(n=>n[0]==='log')[1]})"))
    # 기록하기
    J(pg,"location.hash='log'");pg.wait_for_timeout(700)
    print('sum',J(pg,"document.getElementById('logDaySum').textContent"))
    pg.click('[data-ds67]');pg.wait_for_timeout(300);print('dsheet',J(pg,"document.getElementById('sheetC').innerText.slice(0,200)"));J(pg,"closeSheet()")
    J(pg,"goBrave()");pg.wait_for_timeout(600)
    print('braveActs',J(pg,"[...document.querySelectorAll('#braveActs .act .n')].map(x=>x.textContent)"))
    x0=J(pg,"P.xp");pg.click('#braveActs .chk');pg.wait_for_timeout(500);closepops(pg)
    print('brave rec',J(pg,"P.xp")-x0,J(pg,"JSON.stringify(today().entries.slice(-1).map(e=>[e.kind,e.brave,e.pts,e.mn,e.jar]))"))
    J(pg,"document.getElementById('addCourage').value='먼저 연락하기'");pg.press('#addCourage','Enter');pg.wait_for_timeout(400)
    print('newcard',J(pg,"JSON.stringify(C.actions.filter(a=>a.name==='먼저 연락하기').map(a=>[a.brave,a.xp,a.type]))"),J(pg,"C.courage.length"))
    # 한 줄
    J(pg,"document.getElementById('j67T').value='오늘 비가 와서 집에 있었다'");pg.click('[data-jm67="o"]');pg.click('#j67F button[type=submit]');pg.wait_for_timeout(400)
    print('j67',J(pg,"JSON.stringify(today().j67)"),J(pg,"document.getElementById('j67L').innerText.slice(-60)"))
    pg.screenshot(path=SP+'t_log.png',full_page=True)
    # 행동 구슬 개수
    r=J(pg,"(()=>{const a=C.actions.find(x=>x.name==='시나리오 25분 집필');a.marble=C.jars[0].id+':'+C.jars[0].types[0].id;doAction(a,{direct:1});return today().entries.filter(e=>e.aid===a.id).map(e=>[e.kind,e.xp,e.mn,e.jar])})()")
    print('mn',r);closepops(pg)
    # 돌아보기
    J(pg,"location.hash='review'");pg.wait_for_timeout(900);closepops(pg)
    print('l67',J(pg,"document.querySelectorAll('#review59 .l67row').length"),J(pg,"[...document.querySelectorAll('#review59 [data-lk67]')].map(e=>e.dataset.lk67)"))
    pg.screenshot(path=SP+'t_review.png',full_page=True)
    pg.click('[data-hp67="body"]');pg.wait_for_timeout(300);pg.click('[data-hp67="₩"]');pg.wait_for_timeout(300)
    el=pg.query_selector('.hps66');el.scroll_into_view_if_needed();pg.screenshot(path=SP+'t_money.png')
    pg.click('[data-aj67="body"]');pg.wait_for_timeout(300);pg.screenshot(path=SP+'t_aj.png');J(pg,"closeSheet()")
    # 배치
    pg.click('[data-l67open="review"]');pg.wait_for_timeout(300);pg.screenshot(path=SP+'t_map.png')
    k=J(pg,"document.querySelector('[data-lm67]').dataset.lm67")
    pg.click(f'[data-lm67op="hide|{k}"]');pg.wait_for_timeout(300)
    print('hidden?',J(pg,f"document.querySelector('#review59 [data-lk67=\"{k}\"]').hidden"),J(pg,"JSON.stringify(C.lay67.review.slice(0,3))"))
    pg.click(f'[data-lm67op="hide|{k}"]');pg.click(f'[data-lm67op="col|{k}"]');pg.wait_for_timeout(200);J(pg,"closeSheet()")
    J(pg,"render()");pg.wait_for_timeout(300)
    print('after render key col',J(pg,"JSON.stringify(C.lay67.review.find(x=>x[0]===%s))"%json.dumps(k)))
    # 다른 화면들 배치
    for v in ['jars','stats','journey','body','shop','gacha','more']:
        J(pg,f"location.hash='{v}'");pg.wait_for_timeout(600);closepops(pg)
        print(v,J(pg,f"document.querySelectorAll('.view[data-view=\"{v}\"] [data-lk67]').length"),J(pg,f"!!document.querySelector('[data-l67open=\"{v}\"]')"))
        pg.screenshot(path=SP+f't_{v}.png',full_page=True)
    J(pg,"location.hash='jars'");pg.wait_for_timeout(500);pg.click('[data-ro67open]');pg.wait_for_timeout(300);pg.screenshot(path=SP+'t_ro.png')
    j1=J(pg,"C.jars.map(j=>j.id).join(',')");pg.click('[data-ro67m^="jars|"][data-ro67m$="|1"]');pg.wait_for_timeout(300);print('jar order',j1,'->',J(pg,"C.jars.map(j=>j.id).join(',')"));J(pg,"closeSheet()")
    # 검색
    pg.click('#searchBtn');pg.wait_for_timeout(200);pg.fill('#searchIn','서랍');pg.wait_for_timeout(300);print('search',J(pg,"document.getElementById('searchBox').innerText.slice(0,200)"))
    pg.keyboard.press('Escape')
    J(pg,"fmap67()");pg.wait_for_timeout(300);pg.screenshot(path=SP+'t_fmap.png');J(pg,"closeSheet()")
    J(pg,"ai67()");pg.wait_for_timeout(300);pg.screenshot(path=SP+'t_ai.png');print('ai len',J(pg,"aiPrompt67().length"),J(pg,"aiPrompt67().slice(0,600)"));J(pg,"closeSheet()")
    J(pg,"openInfo('hp')");pg.wait_for_timeout(300);print('hpinfo',J(pg,"(document.querySelector('.tr67')||{}).innerText"));
    J(pg,"openInfo('lv')");pg.wait_for_timeout(300);print('lvinfo',J(pg,"[...document.querySelectorAll('.tr67')].map(x=>x.innerText).join('|')"))
    # 마일스톤
    J(pg,"aMile67.t=0;T67=Date.now()-10000;render()");pg.wait_for_timeout(300)
    print('amile base',J(pg,"JSON.stringify(C.amile67)"))
    J(pg,"(()=>{const d=today();for(let i=0;i<30;i++)d.entries.push({id:uid(),kind:'act',type:'good',area:'grow',xp:20,name:'x',t:'10:00'});save(d.date)})();aMile67.t=0;render()");pg.wait_for_timeout(500)
    print('amile after',J(pg,"JSON.stringify(C.amile67)"),J(pg,"JSON.stringify(today().entries.filter(e=>e.kind==='amile67').map(e=>[e.name,e.gold]))"));closepops(pg)
    # 폰
    pg.set_viewport_size({'width':390,'height':844});J(pg,"location.hash='review'");pg.wait_for_timeout(700);pg.screenshot(path=SP+'t_review_m.png',full_page=True)
    J(pg,"location.hash='body'");pg.wait_for_timeout(700);pg.screenshot(path=SP+'t_body_m.png',full_page=True)
    print('ERR',[e for e in errs if 'ERR_TUNNEL' not in e][:8])
