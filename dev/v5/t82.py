# v8.2 시험 — 사후 용기(카드 이은 할 일 용기 칩 · 끝낸 뒤 고르면 기록에 · 스낵바 ⚔️) · 캘린더 보이기·숨기기 이름. 옛 빌드: HQURL=http://localhost:8766/beta/index.html python3 t82.py
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
J=lambda pg,x:pg.evaluate(x)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra) if extra!='' else ''))
    if not c:FAILS.append(msg)
def vis(pg,sel):return pg.locator(sel).locator('visible=true').first
def cnt(pg,sel):return pg.locator(sel).locator('visible=true').count()
def clk(pg,sel,w=450):
    if not cnt(pg,sel):return False
    vis(pg,sel).click();pg.wait_for_timeout(w);closepops(pg);return True
def notoast(pg):J(pg,"(()=>{const t=document.getElementById('toast');if(t){t.classList.remove('on');t.style.pointerEvents=''}})()")
def safe(f,msg):
    try:f()
    except Exception as e:ok(False,msg+' (예외)',str(e)[:200])
def mk(pg,title,o=None):
    return J(pg,"((title,o)=>{const t=newTask({title,list:(o||{}).list});Object.assign(t,o||{});saveTask(t);return t.id})("+json.dumps(title)+","+json.dumps(o or {})+")")
def closesheet(pg):J(pg,"(()=>{try{closeSheet()}catch(e){}})()");pg.wait_for_timeout(300)
def gotasks(pg):
    J(pg,"(()=>{location.hash='tasks';C.ui.tasks.sel='all';save('config');render()})()");pg.wait_for_timeout(700);closepops(pg);notoast(pg)
def opensheet(pg,tid):
    if not clk(pg,f'#tList .trow[data-task="{tid}"] .tt',600):J(pg,f"openTaskSheet('{tid}')");pg.wait_for_timeout(600)
def vkeys(pg):return J(pg,"[...document.querySelectorAll('#sheetC .tchips [data-k79]')].filter(e=>!e.classList.contains('hid78')).map(e=>e.dataset.k79)")
def box(pg,sel):return J(pg,"(()=>{const r=document.querySelector('"+sel+"').getBoundingClientRect();return [r.x,r.y,r.width,r.height]})()")
def dragchip(pg,key,tosel,dx=0.85):
    a=box(pg,f'#sheetC .tchips [data-k79="{key}"]');z=box(pg,tosel)
    pg.mouse.move(a[0]+a[2]/2,a[1]+a[3]/2);pg.mouse.down();pg.mouse.move(a[0]+a[2]/2+8,a[1]+a[3]/2+3,steps=3)
    pg.mouse.move(z[0]+z[2]*dx,z[1]+z[3]/2,steps=10);pg.wait_for_timeout(100);pg.mouse.up();pg.wait_for_timeout(450)


def cardNo(pg):
    return J(pg,"(()=>{let a=C.actions.find(x=>x.type==='good'&&!x.dopaOnly&&!x.doneAt&&!x.brave&&!(x.opts&&x.opts.length)&&!x.money);return a.id})()")
def lastE(pg,tid):
    return J(pg,"(id=>{for(const d of [gk76(),midKey68()]){const e=((DAYS[d]||{}).entries||[]).find(x=>x.tid===id);if(e)return {brave:!!e.brave,xp:e.xp,bz:e.bz82||null,bv:e.bv82||null,kind:e.kind}}return null})('"+tid+"')")

def t_name(pg,T=''):
    mk(pg,'이름 일',{'due':J(pg,"midKey68()")})
    J(pg,"location.hash='cal'");pg.wait_for_timeout(800);closepops(pg);notoast(pg)
    ttl=J(pg,"document.getElementById('calFilterBtn').title")
    ok('보이기·숨기기' in ttl and '거르기' not in ttl,T+'⚲ 단추 설명 = 보이기·숨기기',ttl)
    clk(pg,'#calFilterBtn',500)
    h=vis(pg,'#sheetC h3').inner_text() if cnt(pg,'#sheetC h3') else ''
    ok('보이기·숨기기' in h and '거르기' not in h,T+'창 제목',h)
    m=J(pg,"[...document.querySelectorAll('#sheetC [data-f77m]')].map(b=>b.textContent)")
    ok(m==['고른 것 보이기','고른 것 숨기기'],T+'모드 글자',m)
    sh=J(pg,"document.getElementById('sheetC').innerText")
    ok('거르기' not in sh,T+'창 안에 거르기 글자 없음')
    closesheet(pg)

def t_chip(pg,T=''):
    closesheet(pg);d=J(pg,"midKey68()");aid=cardNo(pg)
    K=mk(pg,'용기 K2',{'due':d,'aid':aid})
    gotasks(pg);opensheet(pg,K)
    n=J(pg,"document.querySelectorAll('#sheetC .tchips [data-t71=\"brave\"]').length")
    ok(n==1,T+'용기 없는 카드에 이은 할 일에도 ⚔️ 용기 칩',n)
    clk(pg,'#sheetC .more79',300)
    clk(pg,'#sheetC .tchips [data-t71="brave"]',400)
    ok(cnt(pg,'#m61 [data-t71bz="m"]')==1,T+'칩 누르면 용기 크기 메뉴')
    clk(pg,'#m61 [data-t71bz="m"]',500)
    ok(J(pg,f"TASKS['{K}'].brave==1"),T+'고르면 할 일에 용기')
    b=J(pg,f"(()=>{{const t=TASKS['{K}'];return [taskBase(t).xp,(C.courageSizes.find(z=>z.id==='m')||{{}}).xp,(C.actions.find(a=>a.id===t.aid)||{{}}).xp]}})()")
    ok(b[0]==max(b[1],b[2]),T+'카드 할 일 점수 = 카드·용기 중 큰 쪽',b)
    closesheet(pg)
    # 미리 정해 둔 용기 → 끝내면 기록에 용기
    J(pg,f"completeTask(TASKS['{K}'],{{direct:1}})");pg.wait_for_timeout(500)
    e=lastE(pg,K);ok(e and e['brave'] and e['bz']=='m',T+'미리 정한 카드 할 일 끝냄 → 기록에 용기',e)

def t_after(pg,T=''):
    closesheet(pg);d=J(pg,"midKey68()");aid=cardNo(pg)
    K=mk(pg,'사후 K3',{'due':d,'aid':aid})
    J(pg,f"completeTask(TASKS['{K}'],{{direct:1}})");pg.wait_for_timeout(500)
    e0=lastE(pg,K);ok(e0 and not e0['brave'],T+'끝낸 기록(용기 없음)',e0)
    gotasks(pg);J(pg,f"openTaskSheet('{K}')");pg.wait_for_timeout(600)
    clk(pg,'#sheetC .more79',300)
    ok(cnt(pg,'#sheetC .tchips [data-t71="brave"]')==1,T+'끝낸 할 일 상세에도 용기 칩')
    clk(pg,'#sheetC .tchips [data-t71="brave"]',400);clk(pg,'#m61 [data-t71bz="l"]',600)
    e=lastE(pg,K);L=J(pg,"(C.courageSizes.find(z=>z.id==='l')||{}).xp")
    ok(e and e['brave'] and e['bz']=='l' and e['xp']==max(L,e0['xp']),T+'끝낸 뒤 고른 용기가 방금 기록에 붙음',e)
    SUM="Object.values(DAYS).reduce((s,d)=>s+(d.entries||[]).filter(e=>e.kind!=='wbrave').reduce((a,e)=>a+(+e.xp||0),0),0)"
    hp=[J(pg,"P.xp"),J(pg,SUM)]
    J(pg,f"openTaskSheet('{K}')");pg.wait_for_timeout(500);clk(pg,'#sheetC .more79',300)
    clk(pg,'#sheetC .tchips [data-t71="brave"]',400);clk(pg,'#m61 [data-t71bz=""]',600)
    e2=lastE(pg,K);ok(e2 and not e2['brave'] and e2['xp']==e0['xp'] and not e2['bv'],T+'용기 끄면 기록도 원래대로',e2)
    now=[J(pg,"P.xp"),J(pg,SUM)]
    ok(now[0]<=hp[0]-(e['xp']-e0['xp']) and now[1]==hp[1]-(e['xp']-e0['xp']),T+'내 XP도 같이 되돌아감',[hp,now])
    closesheet(pg)

def t_snack(pg,T=''):
    closesheet(pg);d=J(pg,"midKey68()")
    Q=mk(pg,'스낵 Q',{'due':d})
    gotasks(pg);J(pg,f"completeTask(TASKS['{Q}'],{{direct:1}})");pg.wait_for_timeout(500)
    ok(cnt(pg,'#snack [data-snack82]')==1,T+'기록 알림에 ⚔️ 단추')
    closepops(pg)
    clk(pg,'#snack [data-snack82]',400)
    ok(cnt(pg,'#m61 [data-b82z="s"]')==1,T+'⚔️ 누르면 크기 메뉴')
    clk(pg,'#m61 [data-b82z="s"]',600)
    e=lastE(pg,Q);ok(e and e['brave'] and e['bz']=='s',T+'알림 ⚔️ → 그 기록에 용기',e)
    ok(not J(pg,f"!!TASKS['{Q}'].brave"),T+'할 일 자체는 안 바뀜')
    ok(J(pg,"isBrave(((DAYS[gk76()]||{}).entries||[]).concat(((DAYS[midKey68()]||{}).entries||[])).find(x=>x.tid==='"+Q+"'))"),T+'isBrave(용기 집계)에 잡힘')

def closepops(pg):
    for i in range(6):
        if pg.is_visible('#levelup'):J(pg,"document.getElementById('luOk').click()");pg.wait_for_timeout(150)
def body(pg,phone=False):
    T='폰: ' if phone else ''
    for f in (t_name,t_chip,t_after,t_snack):
        safe(lambda f=f:f(pg,T),T+f.__name__)

with sync_playwright() as pw:
    b,pg=run(pw,1400,900);body(pg);b.close()
    b,pg=run(pw,390,800);body(pg,True);b.close()
print('ERRS',errs[:5]);print('FAILS',len(FAILS),FAILS)
