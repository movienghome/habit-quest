# v8.1 시험 — A″1 칩 줄 설정이 다른 할 일에도 · A″2 카드 연결 할 일의 용기 칩 · A″3 거르기 이름. 옛 빌드: HQURL=http://localhost:8766/beta/index.html python3 t81.py
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

def t_a3(pg,T=''):
    mk(pg,'거르기 일',{'due':J(pg,"midKey68()")})
    J(pg,"location.hash='cal'");pg.wait_for_timeout(800);closepops(pg);notoast(pg)
    ttl=J(pg,"document.getElementById('calFilterBtn').title")
    ok('거르기' in ttl and '보일 것' not in ttl and '숨길 것' not in ttl,T+'⚲ 단추 설명 = 거르기',ttl)
    clk(pg,'#calFilterBtn',500)
    h=vis(pg,'#sheetC h3').inner_text() if cnt(pg,'#sheetC h3') else ''
    ok('거르기' in h and '보일 것' not in h,T+'거르기 창 제목',h)
    closesheet(pg)
    # 빌드 안 모든 글자에 '보일 것 / 숨길 것'이 남지 않았나(도움말 이전 버전 카드 제외)
    left=J(pg,"(()=>{const s=document.documentElement.outerHTML;const m=s.match(/.{20}(보일 것 ?\\/ ?숨길 것).{20}/g)||[];return m.filter(x=>!/이름만 바꿨어요|거르기가 하나로|라고 부르던 걸|J10[)]/.test(x)).slice(0,5)})()")
    ok(not left,T+'화면 글자에 보일 것/숨길 것이 남지 않음',left)

def t_a1(pg,T=''):
    # 일반 할 일 P에서 태그 칩을 구분선 앞으로 끌어 고정 → 다른 할 일(일반·카드 연결)에서도 보여야
    J(pg,"(()=>{delete C.chipOrd79;save('config')})()")
    closesheet(pg);d=J(pg,"midKey68()")
    P=mk(pg,'칩 P',{'due':d});aid=J(pg,"C.actions.find(a=>!a.dopaOnly&&!a.doneAt).id")
    J(pg,f"(()=>{{const a=C.actions.find(x=>x.id==='{aid}');a.brave=(C.courageSizes[1]||C.courageSizes[0]).id;save('config')}})()")
    K=mk(pg,'칩 K 카드',{'due':d,'aid':aid})
    Q=mk(pg,'칩 Q',{'due':d})
    gotasks(pg);opensheet(pg,P)
    clk(pg,'#sheetC .more79',300)
    dragchip(pg,'tags','#sheetC .tchips [data-k79="area"]')
    o=J(pg,"C.chipOrd79");ok(o and o.index('tags')<o.index('|'),T+'P에서 태그 칩 고정',o)
    closesheet(pg);gotasks(pg);opensheet(pg,Q)
    ok('tags' in vkeys(pg),T+'다른 일반 할 일 Q에서도 태그 칩 보임',vkeys(pg))
    closesheet(pg);gotasks(pg);opensheet(pg,K)
    ok('tags' in vkeys(pg),T+'카드 연결 할 일 K에서도 태그 칩 보임',vkeys(pg))
    # A″2: K에는 용기 칩이 떠야(카드에 용기가 있으므로) — 값이 있으니 숨김 구역이어도 보임
    ok('brave' in vkeys(pg),T+'카드 연결 할 일에도 ⚔️ 용기 칩',vkeys(pg))
    # 카드 용기 칩에서 순서를 바꿔 저장해도 K에 없는 칩이 순서에서 빠지지 않음: 일반 할 일 P에서 용기를 고정 → K에서 크기 칩을 끌어 저장 → 용기 자리 그대로
    closesheet(pg);gotasks(pg);opensheet(pg,P)
    clk(pg,'#sheetC .more79',300)
    dragchip(pg,'brave','#sheetC .tchips [data-k79="area"]')
    o1=J(pg,"C.chipOrd79");ok(o1.index('brave')<o1.index('|'),T+'P에서 용기 고정',o1)
    # 이번엔 용기 칩이 없는 할 일(루틴 단계처럼 칩이 적은 상황)을 흉내: 칩 줄에서 용기 칩을 DOM에서 빼고 저장
    r=J(pg,"""(()=>{const ch=document.querySelector('#sheetC .tchips');const b=ch.querySelector('[data-k79="brave"]');b.remove();chSave79(ch);return C.chipOrd79})()""")
    ok(r.index('brave')<r.index('|') if 'brave' in r else False,T+'칩이 없는 할 일에서 저장해도 용기 칩 자리 보존',r)
    # 새로고침 뒤에도 유지(저장 경로)
    J(pg,"save('config')")

def t_a2click(pg,T=''):
    closesheet(pg);gotasks(pg)
    K=J(pg,"Object.values(TASKS).find(t=>t.title==='칩 K 카드').id");opensheet(pg,K)
    ok(cnt(pg,'#sheetC .tchips [data-k79="brave"]')==1,T+'카드 용기 칩 하나',cnt(pg,'#sheetC .tchips [data-k79="brave"]'))
    clk(pg,'#sheetC .tchips [data-k79="brave"]',500)
    ok(J(pg,"!!(sheetCtx&&sheetCtx.aedit)"),T+'누르면 카드 편집 창',J(pg,"JSON.stringify(sheetCtx||{})")[:80])
    closesheet(pg)

def body(pg,phone=False):
    T='폰: ' if phone else ''
    for f in (t_a3,t_a1,t_a2click):
        safe(lambda f=f:f(pg,T),T+f.__name__)

with sync_playwright() as pw:
    b,pg=run(pw,1400,900);body(pg);b.close()
    b,pg=run(pw,390,800);body(pg,True);b.close()
print('ERRS',errs[:5]);print('FAILS',len(FAILS),FAILS)
