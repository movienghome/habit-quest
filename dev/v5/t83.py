# v8.3 시험 — C묶음(캘린더). C1: 월 보기 여러 날 막대
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
J=lambda pg,x:pg.evaluate(x)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra) if extra!='' else ''))
    if not c:FAILS.append(msg)
def notoast(pg):J(pg,"(()=>{const t=document.getElementById('toast');if(t){t.classList.remove('on');t.style.pointerEvents=''}})()")
def mk(pg,title,o=None):
    return J(pg,"((title,o)=>{const t=newTask({title,list:(o||{}).list});Object.assign(t,o||{});saveTask(t);return t.id})("+json.dumps(title)+","+json.dumps(o or {})+")")
def safe(f,msg):
    try:f()
    except Exception as e:ok(False,msg+' (예외)',str(e)[:200])
def gocal(pg,mode='month'):
    J(pg,"(()=>{C.ui.cal=C.ui.cal||{};C.ui.cal.mode='%s';save('config');location.hash='cal'})()"%mode);pg.wait_for_timeout(900);closepops(pg);notoast(pg)
    J(pg,"renderCal()");pg.wait_for_timeout(300)

def t_c1(pg,W):
    td=J(pg,"midKey68()")
    ids=J(pg,"""(()=>{const td=midKey68();const m=td.slice(0,8);const mon=weekStart(td);
      const a=newTask({title:'촬영긴'});a.due=addDays(mon,-2);a.end71=addDays(mon,9);saveTask(a);
      const b=newTask({title:'여행둘'});b.due=addDays(mon,1);b.end71=addDays(mon,2);saveTask(b);
      const c=newTask({title:'일반일'});c.due=addDays(mon,1);saveTask(c);
      return {a:a.id,b:b.id,c:c.id,mon}})()""")
    gocal(pg)
    r=J(pg,"""(()=>{const g=document.querySelector('#calMain .mgrid');const bars=[...g.querySelectorAll('.bar83')];
      const chipsSpan=[...g.querySelectorAll('.mc .cchip')].filter(x=>/촬영긴|여행둘/.test(x.textContent)).length;
      return {n:bars.length,txt:bars.map(b=>b.textContent),chipsSpan,
        w:bars.map(b=>Math.round(b.getBoundingClientRect().width))}})()""")
    ok(r['n']>=3,f'[{W}] 막대 조각들이 그려짐(긴 일정 2~3주 줄 + 둘째)',r)
    ok(r['chipsSpan']==0,f'[{W}] 여러 날 일정이 칸 칩으로는 안 남음')
    ok(any('‹' in t for t in r['txt']) or any('›' in t for t in r['txt']),f'[{W}] 이어지는 쪽 ‹ › 표시')
    ov=J(pg,"""(()=>{const g=document.querySelector('#calMain .mgrid');const bars=[...g.querySelectorAll('.bar83')].map(b=>b.getBoundingClientRect());
      let o=0;for(let i=0;i<bars.length;i++)for(let j=i+1;j<bars.length;j++){const a=bars[i],b=bars[j];if(a.left<b.right-1&&b.left<a.right-1&&a.top<b.bottom-1&&b.top<a.bottom-1)o++}
      const cc=[...g.querySelectorAll('.mc .cchip:not([hidden])')].map(c=>c.getBoundingClientRect());let o2=0;
      bars.forEach(a=>cc.forEach(b=>{if(a.left<b.right-1&&b.left<a.right-1&&a.top<b.bottom-1&&b.top<a.bottom-1)o2++}));return [o,o2]})()""")
    ok(ov[0]==0,f'[{W}] 막대끼리 안 겹침',ov)
    ok(ov[1]==0,f'[{W}] 막대와 칸 칩이 안 겹침',ov)
    # 눌러서 열기
    pg.evaluate("document.querySelector('#calMain .bar83').scrollIntoView({block:'center'})");pg.wait_for_timeout(200)
    bb=pg.locator('#calMain .bar83').first.bounding_box()
    pg.mouse.click(bb['x']+bb['width']/2,bb['y']+bb['height']/2);pg.wait_for_timeout(600)
    ok(J(pg,"!!document.getElementById('tsTitle')"),f'[{W}] 막대 누르면 할 일 상세가 열림')
    J(pg,"(()=>{try{closeSheet()}catch(e){}})()");pg.wait_for_timeout(300)
    # 끌어서 옮기기: 둘째 일정(여행둘)을 +2일 칸으로 (잡은 날=첫날)
    before=J(pg,"(id=>[TASKS[id].due,TASKS[id].end71])(%s)"%json.dumps(ids['b']))
    src=J(pg,"""(id=>{const b=[...document.querySelectorAll('#calMain .bar83')].find(x=>x.dataset.ctask===id);b.scrollIntoView({block:'center'});const r=b.getBoundingClientRect();return [r.x,r.y,r.width,r.height]})(%s)"""%json.dumps(ids['b']))
    k0=before[0];k2=J(pg,"(k=>addDays(k,2))(%s)"%json.dumps(k0))
    dst=J(pg,"""(k=>{const c=document.querySelector('#calMain .mc[data-calday="'+k+'"]');if(!c)return null;const r=c.getBoundingClientRect();return [r.x,r.y,r.width,r.height]})(%s)"""%json.dumps(k2))
    if dst:
        pg.mouse.move(src[0]+6,src[1]+src[3]/2);pg.mouse.down();pg.wait_for_timeout(520)
        pg.mouse.move(src[0]+14,src[1]+src[3]/2+4,steps=3);pg.mouse.move(dst[0]+dst[2]/2,dst[1]+dst[3]*0.7,steps=12);pg.wait_for_timeout(120);pg.mouse.up();pg.wait_for_timeout(600)
        after=J(pg,"(id=>[TASKS[id].due,TASKS[id].end71])(%s)"%json.dumps(ids['b']))
        ok(after[0]==k2 and after[1]==J(pg,"(k=>addDays(k,3))(%s)"%json.dumps(k0)),f'[{W}] 막대를 끌어 놓으면 길이 그대로 옮겨짐',(before,after))
    else:ok(False,f'[{W}] 끌어 놓을 칸을 못 찾음')
    # 다시 그린 뒤에도 막대 위치가 칸에 맞음
    pos=J(pg,"""(()=>{const g=document.querySelector('#calMain .mgrid');const gr=g.getBoundingClientRect();return [...g.querySelectorAll('.bar83')].every(b=>{const r=b.getBoundingClientRect();return r.left>=gr.left-1&&r.right<=gr.right+1&&r.top>=gr.top-1&&r.bottom<=gr.bottom+1})})()""")
    ok(pos,f'[{W}] 막대가 달력 칸 안에 있음')
    # 날짜 눌러 아래 목록 열어도(칸 높이 바뀜) 막대가 따라감
    c=J(pg,"""(()=>{const c=document.querySelector('#calMain .mc[data-calday]:not(.other) .dn');const r=c.getBoundingClientRect();return [r.x+4,r.y+4]})()""")
    pg.mouse.click(*c);pg.wait_for_timeout(700)
    al=J(pg,"""(()=>{const g=document.querySelector('#calMain .mgrid');const mcs=[...g.querySelectorAll('.mc[data-calday]')];return [...g.querySelectorAll('.bar83')].every(b=>{const [a,z]=b.dataset.c83.split('-').map(Number);const ra=mcs[a].getBoundingClientRect(),rb=b.getBoundingClientRect(),sp=mcs[a].querySelector('.sp83').getBoundingClientRect();return Math.abs(rb.left-ra.left-1)<2&&rb.top>=sp.top-1&&rb.bottom<=sp.bottom+16})})()""")
    ok(al,f'[{W}] 날짜 목록을 열어도 막대가 칸을 따라감')

def t_c2(pg,W):
    for mode in ('3day','1day'):
        gocal(pg,mode)
        J(pg,"(()=>{ui.calAnchor=midKey68();renderCal()})()");pg.wait_for_timeout(300)
        a0=J(pg,"ui.calAnchor");vw=pg.viewport_size
        pg.mouse.move(vw['width']*0.6,vw['height']*0.6)
        ok(J(pg,"!!document.elementFromPoint(%d,%d).closest('#calMain .tgwrap')"%(vw['width']*0.6,vw['height']*0.6)),f'[{W}] {mode} 시험 위치가 시간표 위')
        pg.mouse.wheel(120,0);pg.wait_for_timeout(500)
        a1=J(pg,"ui.calAnchor")
        ok(a1==J(pg,"(k=>addDays(k,1))(%s)"%json.dumps(a0)),f'[{W}] {mode} 옆으로 휠 → 하루 뒤',(a0,a1))
        pg.mouse.wheel(-120,0);pg.wait_for_timeout(500)
        a2=J(pg,"ui.calAnchor");ok(a2==a0,f'[{W}] {mode} 반대로 휠 → 하루 앞',(a0,a2))
        pg.mouse.wheel(0,300);pg.wait_for_timeout(400)
        ok(J(pg,"ui.calAnchor")==a0,f'[{W}] {mode} 세로 휠은 날짜를 안 바꿈(세로 스크롤)')
        pg.keyboard.down('Shift');pg.mouse.wheel(0,120);pg.keyboard.up('Shift');pg.wait_for_timeout(500)
        ok(J(pg,"ui.calAnchor")!=a0,f'[{W}] {mode} Shift+휠 → 이동',J(pg,"ui.calAnchor"))
        J(pg,"(k=>{ui.calAnchor=k;renderCal()})(%s)"%json.dumps(a0));pg.wait_for_timeout(300)
        # 폰 밀기 흉내
        sw="""(([dx,dy])=>{const el=document.querySelector('#calMain .tgbody');const r=el.getBoundingClientRect();const x=r.x+r.width/2,y=r.y+160;
          const mk=(t,cx,cy)=>new Touch({identifier:1,target:el,clientX:cx,clientY:cy});
          el.dispatchEvent(new TouchEvent('touchstart',{bubbles:true,cancelable:true,touches:[mk(0,x,y)],changedTouches:[mk(0,x,y)]}));
          el.dispatchEvent(new TouchEvent('touchend',{bubbles:true,cancelable:true,touches:[],changedTouches:[mk(0,x+dx,y+dy)]}))})"""
        J(pg,sw+"([-90,5])");pg.wait_for_timeout(400)
        b1=J(pg,"ui.calAnchor");ok(b1==J(pg,"(k=>addDays(k,1))(%s)"%json.dumps(a0)),f'[{W}] {mode} 왼쪽으로 밀기 → 하루 뒤',(a0,b1))
        J(pg,sw+"([90,5])");pg.wait_for_timeout(400)
        ok(J(pg,"ui.calAnchor")==a0,f'[{W}] {mode} 오른쪽으로 밀기 → 하루 앞')
        J(pg,sw+"([20,90])");pg.wait_for_timeout(300)
        ok(J(pg,"ui.calAnchor")==a0,f'[{W}] {mode} 세로로 밀면 안 움직임')
        J(pg,sw+"([-90,50])");pg.wait_for_timeout(300)
        ok(J(pg,"ui.calAnchor")==a0,f'[{W}] {mode} 비스듬히 밀어도 안 움직임')

def t_c3(pg,W):
    gocal(pg,'month')
    td=J(pg,"midKey68()")
    # 날짜 눌러 패널 열기
    c=J(pg,"""(k=>{const c=document.querySelector('#calMain .mc[data-calday="'+k+'"] .dn');const r=c.getBoundingClientRect();return [r.x+4,r.y+4]})(%s)"""%json.dumps(td))
    pg.mouse.click(*c);pg.wait_for_timeout(250)
    # 단일 클릭이 팝업(280ms 뒤)을 띄우므로 닫고 시작
    pg.wait_for_timeout(500);J(pg,"(()=>{try{closeSheet()}catch(e){}})()");pg.wait_for_timeout(300)
    J(pg,"(k=>{ui.cal63=true;ui.calSel=k;renderCal()})(%s)"%json.dumps(td));pg.wait_for_timeout(500)
    ok(J(pg,"!!document.querySelector('#calMain .add83')"),f'[{W}] 날짜 패널에 작은 ＋ 추가가 있음')
    ok(J(pg,"(()=>{const i=document.getElementById('calAdd');return !i||i.offsetParent===null||getComputedStyle(i.closest('form')).display==='none'})()"),f'[{W}] 아래 큰 입력칸은 접힘')
    btn=pg.locator('#calMain .add83').first
    btn.scroll_into_view_if_needed();btn.click();pg.wait_for_timeout(500)
    ok(J(pg,"!!document.getElementById('cal58Add')"),f'[{W}] ＋ 추가 → 추가 팝업이 뜸')
    pg.fill('#cal58Add','팝업으로 추가');pg.press('#cal58Add','Enter');pg.wait_for_timeout(600)
    r=J(pg,"(k=>{const t=Object.values(TASKS).find(x=>x.title==='팝업으로 추가');return t?t.due:null})(%s)"%json.dumps(td))
    ok(r==td,f'[{W}] 팝업에서 적은 일이 그 날짜로 들어감',r)
    J(pg,"(()=>{try{closeSheet()}catch(e){}})()")
    # N 키
    J(pg,"document.activeElement&&document.activeElement.blur()");pg.keyboard.press('n');pg.wait_for_timeout(500)
    ok(J(pg,"!!document.getElementById('cal58Add')"),f'[{W}] N 키 → 추가 팝업')
    J(pg,"(()=>{try{closeSheet()}catch(e){}})()");pg.wait_for_timeout(300)
    # 시간표 빈 곳
    gocal(pg,'3day');vw=pg.viewport_size
    if W>800:
        x,y=vw['width']*0.5,vw['height']*0.55
        pg.mouse.move(x-3,y-3);pg.mouse.move(x,y);pg.wait_for_timeout(200)
        ok(J(pg,"(()=>{const p=document.querySelector('.plus83');return !!p&&!p.hidden})()"),f'[{W}] 시간표 빈 곳에 마우스를 올리면 ＋ 힌트')
        pg.mouse.click(x,y);pg.wait_for_timeout(600)
        ok(J(pg,"!!document.getElementById('cal57Add')"),f'[{W}] 시간표 빈 곳 누르면 추가 팝업')
        J(pg,"(()=>{try{closeSheet()}catch(e){}})()");pg.wait_for_timeout(300)
        # 블록 위에선 힌트 없음
    errs_before=len(errs)

def t_c4(pg,W):
    td=J(pg,"midKey68()")
    info=J(pg,"""(()=>{const r=C.routines.find(x=>x.id==='r-morning');const h=rtH62(r,true);h.due=midKey68();h.rep={f:'d',i:1};h.time='07:30';delete h.dur;saveTask(h);
      return {id:h.id,tot:rtMin83(r),n:r.steps.length}})()""")
    ok(info['tot']>0,f'[{W}] 루틴 단계 분 합이 셈',info)
    gocal(pg,'1day')
    J(pg,"(()=>{ui.calAnchor=midKey68();renderCal()})()");pg.wait_for_timeout(300)
    r=J(pg,"""(id=>{const b=document.querySelector('.blk[data-ctask="'+id+'"]');if(!b)return null;const m=b.querySelector('.bm').textContent;return {h:Math.round(b.getBoundingClientRect().height),txt:m,rz:!!b.querySelector('.rz'),title:b.querySelector('.bt').textContent}})(%s)"""%json.dumps(info['id']))
    ok(r is not None and ('시간' in r['txt'] or '분' in r['txt']) and str(info['tot']) in r['txt'].replace('시간 ','').replace('시간','')+str(info['tot']) ,f'[{W}] 루틴 블록이 단계 합 길이로 그려짐',r)
    ok(r is not None and not r['rz'],f'[{W}] 루틴 블록엔 길이 손잡이가 없음')
    ok(J(pg,"TASKS[%s].dur==null"%json.dumps(info['id'])),f'[{W}] 할 일 자체 dur은 안 바뀜')
    # 시각 옮기기 → 창
    def dragblk(dy):
        src=J(pg,"""(id=>{const b=document.querySelector('.blk[data-ctask="'+id+'"]');b.scrollIntoView({block:'center'});const r=b.getBoundingClientRect();return [r.x,r.y,r.width,r.height]})(%s)"""%json.dumps(info['id']))
        pg.mouse.move(src[0]+src[2]/2,src[1]+6);pg.mouse.down();pg.wait_for_timeout(520)
        pg.mouse.move(src[0]+src[2]/2+4,src[1]+12,steps=3);pg.mouse.move(src[0]+src[2]/2,src[1]+6+dy,steps=10);pg.wait_for_timeout(150);pg.mouse.up();pg.wait_for_timeout(500)
    dragblk(120)
    ok(J(pg,"!!document.querySelector('[data-m83=\"day\"]')"),f'[{W}] 시각을 옮기면 이 날만/앞으로 창')
    ok(J(pg,"TASKS[%s].time==='07:30'"%json.dumps(info['id'])),f'[{W}] 창을 고르기 전엔 시작 시각이 그대로')
    pg.locator('[data-m83="day"]').first.click();pg.wait_for_timeout(500)
    t=J(pg,"(id=>({time:TASKS[id].time,tx:TASKS[id].tx83||null,due:TASKS[id].due}))(%s)"%json.dumps(info['id']))
    ok(t['time']=='07:30' and t['tx'] and t['tx']['m']!='07:30' and t['tx']['d']==td,f'[{W}] 이 날만 → 루틴 시각은 그대로, 그날 블록만',t)
    bm=J(pg,"""(id=>document.querySelector('.blk[data-ctask="'+id+'"] .bm').textContent)(%s)"""%json.dumps(info['id']))
    ok(t['tx'] and t['tx']['m'] in bm,f'[{W}] 블록이 옮긴 시각으로 보임',bm)
    ok(J(pg,"rtH62(C.routines.find(x=>x.id==='r-morning'),false).time==='07:30'"),f'[{W}] 루틴 ⏰ 몇 시쯤 값은 07:30 그대로')
    dragblk(-60)
    pg.locator('[data-m83="fwd"]').first.click();pg.wait_for_timeout(500)
    t=J(pg,"(id=>({time:TASKS[id].time,tx:TASKS[id].tx83||null}))(%s)"%json.dumps(info['id']))
    ok(t['time']!='07:30' and not t['tx'],f'[{W}] 앞으로 이 시간 → 머리 시각이 바뀌고 이 날만 표시는 지워짐',t)
    # 취소
    before=J(pg,"TASKS[%s].time"%json.dumps(info['id']))
    dragblk(90)
    pg.locator('.sh [data-sheet="close"]').last.click();pg.wait_for_timeout(400)
    ok(J(pg,"TASKS[%s].time"%json.dumps(info['id']))==before,f'[{W}] 취소하면 그대로')

with sync_playwright() as pw:
    for W,H in ((1400,900),(390,780)):
        b,pg=run(pw,W,H)
        safe(lambda:t_c1(pg,W),f'C1 {W}')
        safe(lambda:t_c2(pg,W),f'C2 {W}')
        safe(lambda:t_c3(pg,W),f'C3 {W}')
        safe(lambda:t_c4(pg,W),f'C4 {W}')
        b.close()
print('ERRS',[e for e in errs if 'favicon' not in e][:6])
print('FAILS',len(FAILS),FAILS)
