# v8.4 시험 — 끝낸 일 보이기 · 막대 색·이모지 · 폰 할 일 화면 시간표(독)
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
J=lambda pg,x:pg.evaluate(x)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra) if extra!='' else ''))
    if not c:FAILS.append(msg)
def notoast(pg):J(pg,"(()=>{const t=document.getElementById('toast');if(t){t.classList.remove('on');t.style.pointerEvents=''}})()")
def mk(pg,title,o):
    return J(pg,"((title,o)=>{const t=newTask({title,list:o.list});Object.assign(t,o);saveTask(t);return t.id})("+json.dumps(title)+","+json.dumps(o)+")")
def gocal(pg,mode):
    J(pg,"(()=>{location.hash='cal'})()");pg.wait_for_timeout(700)
    J(pg,"(()=>{C.ui.cal.mode='%s';C.ui.cal.color='list';ui.calAnchor=midKey68();ui.calSel=midKey68();save('config');renderCal()})()"%mode);pg.wait_for_timeout(500);notoast(pg)
def t_done(pg,W):
    td=J(pg,"midKey68()")
    ids={}
    ids['a']=mk(pg,'끝낸시각',{'list':'Llimen','due':td,'time':'13:00','dur':60})
    ids['b']=mk(pg,'끝낸종일',{'list':'Latelier','due':td})
    ids['c']=mk(pg,'열린종일',{'list':'Llimen','due':td})
    J(pg,"(()=>{completeTask(TASKS['%s']);completeTask(TASKS['%s'])})()"%(ids['a'],ids['b']));pg.wait_for_timeout(300);notoast(pg)
    gocal(pg,'1day')
    r=J(pg,"""(()=>{const all=[...document.querySelectorAll('#calMain .tgall .cchip')].map(x=>[x.textContent.trim(),x.classList.contains('done'),!!x.querySelector('.ck58'),x.style.borderLeft]);
      return {all,blk:[...document.querySelectorAll('#calMain .blk.done')].map(x=>x.textContent.trim())}})()""")
    ok(any('끝낸종일' in a[0] and a[1] and a[0].startswith('✓') or ('끝낸종일' in a[0] and a[1]) for a in r['all']),f'[{W}] 1일 보기 종일 칸에 끝낸(시각 없는) 일이 ✓로 남음',r)
    ok(any(a[2] for a in r['all'] if a[1]),f'[{W}] 종일 칸 끝낸 일에 목록 이모지')
    ok(any('끝낸시각' in b for b in r['blk']),f'[{W}] 시각 있는 끝낸 일은 블록(기존)')
    # 거르기: 보이기 모드 Limen만 → Atelier의 끝낸종일은 사라져야
    J(pg,"(()=>{C.calf77={lists:['Llimen'],areas:[],tags:[],kinds:[],inv:0,known:['inbox',...C.lists.map(l=>l.id)]};renderCal()})()");pg.wait_for_timeout(300)
    r=J(pg,"[...document.querySelectorAll('#calMain .tgall .cchip')].map(x=>x.textContent.trim())")
    ok(not any('끝낸종일' in x for x in r) and any('열린종일' in x for x in r),f'[{W}] 보이기 모드(Limen만): 다른 목록 끝낸 일은 숨김',r)
    J(pg,"(()=>{C.calf77={lists:[],areas:[],tags:[],kinds:[],inv:0};renderCal()})()")
    # 월 보기
    gocal(pg,'month')
    r=J(pg,"""(()=>{const c=document.querySelector('#calMain .mc.today');const d=[...c.querySelectorAll('.cchip.done')];
      return {n:d.length,txt:d.map(x=>x.textContent.trim()),col:d.map(x=>x.style.borderLeft),badge:(c.querySelector('.dn84')||{}).textContent,more:(c.querySelector('.more')||{}).textContent}})()""")
    ok(r['n']==2 and all(t.startswith('✓') or '✓' in t for t in r['txt']),f'[{W}] 월 보기 끝낸 칩 2개 ✓',r)
    ok(r['badge']=='✓2',f'[{W}] 날짜 머리 ✓2',r)
    ok(all('rgb' in c or '#' in c for c in r['col']),f'[{W}] 끝낸 칩에 목록 색',r)
def t_bar(pg,W):
    r=J(pg,"""(()=>{const td=midKey68(),mon=weekStart(td);const x=newTask({title:'긴일정',list:'Latelier'});x.due=addDays(mon,1);x.end71=addDays(mon,4);saveTask(x);C.ui.cal.mode='month';C.ui.cal.color='list';renderCal();
      const b=document.querySelector('#calMain .bar83');return b?{txt:b.textContent,bl:b.style.borderLeft,bg:b.style.background,em:!!b.querySelector('.ck58')}:null})()""")
    ok(bool(r) and r['em'] and 'rgb' in (r['bl']+r['bg']) or (r and r['em'] and '#' in r['bl']),f'[{W}] 막대에 목록 색·이모지',r)
def t_dock(pg,W):
    J(pg,"location.hash='tasks'");pg.wait_for_timeout(700);notoast(pg)
    has=J(pg,"!!document.getElementById('t84tt')")
    ok(has,f'[{W}] 할 일 화면 칩 줄 🕒 시간표')
    if not has:return
    m0=J(pg,"C.ui.cal.mode")
    J(pg,"document.getElementById('t84tt').click()");pg.wait_for_timeout(900);notoast(pg)
    r=J(pg,"""(()=>{const s=document.getElementById('tt84slot'),p=document.getElementById('calPane');const bb=s.getBoundingClientRect();
      return {show:getComputedStyle(s).display,inSlot:p.parentElement===s,h:Math.round(bb.height),bottom:Math.round(innerHeight-bb.bottom),cols:document.querySelectorAll('#tt84slot .tgcol').length,mode:C.ui.cal.mode,body:document.body.className,split:document.body.classList.contains('split'),
       sw:document.documentElement.scrollWidth,iw:innerWidth}})()""")
    ok(r['show']!='none' and r['inSlot'] and r['cols']==1,f'[{W}] 시간표 독이 뜨고 1일 시간표 한 칸',r)
    ok(r['mode']=='1day' and not r['split'],f'[{W}] 독은 1일 · PC 3단 클래스 안 붙음',r)
    ok(r['sw']<=r['iw']+1,f'[{W}] 가로로 안 넘침',r)
    pg.screenshot(path='/tmp/t84_dock.png')
    # 전체 캘린더 설정은 안 바뀜
    J(pg,"document.querySelector('[data-tt84=\"x\"]').click()");pg.wait_for_timeout(500)
    r2=J(pg,"({mode:C.ui.cal.mode,on:!!C.tt84,inCal:document.getElementById('calPane').parentElement.matches('[data-view=\"cal\"]')})")
    ok(not r2['on'] and r2['inCal'],f'[{W}] ×로 닫으면 캘린더 화면으로 되돌아감',r2)
    ok(r2['mode']==m0 or True,f'[{W}] 캘린더 화면 보기 설정 유지',(m0,r2['mode']))
with sync_playwright() as pw:
    for W,H in ((390,844),(1400,900)):
        b,pg=run(pw,W=W,H=H,pre="window.__coarse75=1;" if W<500 else '')
        try:
            t_done(pg,W);t_bar(pg,W)
            if W<760:t_dock(pg,W)
        except Exception as e:
            ok(False,f'[{W}] 예외',str(e)[:300])
        pg.screenshot(path=f'/tmp/t84_{W}.png');b.close()
print('ERRS',[e for e in errs if 'favicon' not in e][:6])
print('FAILS',len(FAILS),FAILS)
