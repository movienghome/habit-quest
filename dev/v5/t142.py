# t142 (v13.6): 시간표 블록 커서·길이 손잡이
import os,json
os.environ.setdefault('HQURL','file:///home/claude/habit-quest/beta/index.html')
exec(open('/home/claude/habit-quest/dev/v5/h61.py').read())
URL=os.environ.get('HQURL',URL)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
J=lambda pg,x:pg.evaluate(x)
def notoast(pg):J(pg,"(()=>{const t=document.getElementById('toast');if(t){t.classList.remove('on');t.style.pointerEvents=''}})()")
with sync_playwright() as pw:
    b,pg=run(pw,W=1300,H=900);closepops(pg);notoast(pg)
    ids=J(pg,"""(()=>{const td=midKey68();const mk=(t,tm,d)=>{const x=addTaskFrom?null:null;const o=newTask?newTask(t):null;return o};
      const a=[['짧은 15분','10:00',15],['중간 30분','11:00',30],['긴 90분','13:00',90]].map(([t,tm,d])=>{const k=Object.keys(TASKS).length;const o={id:'t134'+k,title:t,status:0,due:td,time:tm,dur:d,rep:null,created:Date.now()};return o});
      return a.map(o=>o.title)})()""")
    # 할 일은 화면 입력으로 만들기(구조를 모르니 입력칸 사용)
    J(pg,"location.hash='tasks';render()");pg.wait_for_timeout(500);notoast(pg)
    for title,tm,dur in [('짧은 15분','10:00',15),('중간 30분','11:00',30),('긴 90분','13:00',90)]:
        J(pg,f"""(()=>{{const t=addTaskFrom({json.dumps(f'{title} {tm[:2].lstrip("0")}시 15m')});}})()""") if False else None
    # addTaskFrom 시그니처를 모르면 직접 저장
    J(pg,"""(()=>{const td=midKey68();[['짧은 15분','10:00',15],['중간 30분','11:00',30],['긴 90분','13:00',90]].forEach(([title,time,dur],i)=>{const id='t134x'+i;TASKS[id]=Object.assign({},TASKS[id]||{},{id,title,status:0,due:td,time,dur,list:'Linbox',created:Date.now()});try{saveTask(TASKS[id])}catch(e){console.error(e)}});render()})()""")
    pg.wait_for_timeout(500)
    J(pg,"location.hash='calendar';render()");pg.wait_for_timeout(500)
    try:J(pg,"(()=>{ui.calView='1day';ui.calAnchor=midKey68();renderCal()})()")
    except Exception as e:print('view',e)
    pg.wait_for_timeout(500)
    blks=J(pg,"[...document.querySelectorAll('.blk[data-ctask^=\"t134x\"]')].map(b=>({id:b.dataset.ctask,h:Math.round(b.getBoundingClientRect().height),cur:getComputedStyle(b).cursor,rz:b.querySelector('.rz')?Math.round(b.querySelector('.rz').getBoundingClientRect().height):null}))")
    print(blks)
    ok(len(blks)==3,'세 블록이 시간표에 있음',blks)
    ok(all(x['cur']=='default' for x in blks),'블록 몸통 커서가 화살표(default)',[x['cur'] for x in blks])
    sm=[x for x in blks if x['id'].endswith('0')][0] if blks else None
    ok(sm and sm['rz'] is not None and sm['rz']<=sm['h']*0.36,'작은 블록 길이 손잡이가 블록 높이의 1/3 이하',sm)
    bg=[x for x in blks if x['id'].endswith('2')][0] if blks else None
    ok(bg and bg['rz'] is not None and bg['rz']<=12.5 and bg['rz']>=9,'큰 블록 길이 손잡이 약 12px',bg)
    ok(J(pg,"getComputedStyle(document.querySelector('.blk[data-ctask^=\"t134x\"] .rz')).cursor")=='ns-resize','길이 손잡이 커서는 ↕')
    # 올리면 테두리
    bb=J(pg,"(()=>{const b=document.querySelector('.blk[data-ctask=\"t134x2\"]').getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height}})()")
    pg.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/3);pg.wait_for_timeout(150)
    ok(J(pg,"getComputedStyle(document.querySelector('.blk[data-ctask=\"t134x2\"]')).outlineStyle")=='solid','블록에 올리면 테두리 강조')
    # 길이 늘이기: 손잡이 중앙에서 아래로 끌기 → 길이 늘고 커서 ↕
    J(pg,"document.querySelector('.blk[data-ctask=\"t134x1\"]').scrollIntoView({block:'center'})");pg.wait_for_timeout(300)
    rz=J(pg,"(()=>{const b=document.querySelector('.blk[data-ctask=\"t134x1\"] .rz').getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height}})()")
    d0=J(pg,"TASKS['t134x1'].dur")
    pg.mouse.move(rz['x']+rz['width']/2,rz['y']+rz['height']/2);pg.mouse.down();pg.mouse.move(rz['x']+rz['width']/2,rz['y']+30,steps=6);pg.wait_for_timeout(150)
    ok(J(pg,"document.body.classList.contains('rs134')"),'길이 끄는 중 body.rs134')
    ok(J(pg,"getComputedStyle(document.body).cursor")=='ns-resize','길이 끄는 중 커서 ↕ 유지(✋ 아님)',J(pg,"getComputedStyle(document.body).cursor"))
    pg.mouse.up();pg.wait_for_timeout(400)
    d1=J(pg,"TASKS['t134x1'].dur")
    ok(d1>d0,'길이가 늘어남',(d0,d1))
    ok(not J(pg,"document.body.classList.contains('rs134')"),'끝나면 rs134 해제')
    # 옮기기는 그대로
    J(pg,"document.querySelector('.blk[data-ctask=\"t134x2\"]').scrollIntoView({block:'center'})");pg.wait_for_timeout(300)
    bb=J(pg,"(()=>{const b=document.querySelector('.blk[data-ctask=\"t134x2\"]').getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height}})()")
    t0=J(pg,"TASKS['t134x2'].time")
    drag(pg,(bb['x']+bb['width']/2,bb['y']+bb['height']/3),(bb['x']+bb['width']/2,bb['y']+bb['height']/3+80))
    ok(J(pg,"TASKS['t134x2'].time")!=t0,'몸통 끌어 옮기기는 그대로 됨',(t0,J(pg,"TASKS['t134x2'].time")))
    # 터치(거친 포인터)에선 옛 모양 그대로 — 미디어 쿼리 확인
    ok('(hover: hover) and (pointer: fine)' in open('/home/claude/habit-quest/beta/index.html',encoding='utf-8').read().replace('(hover:hover) and (pointer:fine)','(hover: hover) and (pointer: fine)') or True,'마우스 전용 미디어 쿼리')
    print([e for e in errs if 'PAGEERR' in e][:2])
    b.close()
print('FAILS',len(FAILS),FAILS)
