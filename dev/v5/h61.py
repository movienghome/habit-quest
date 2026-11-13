import json,sys,os
from playwright.sync_api import sync_playwright
SP='/tmp/'
URL=os.environ.get('HQURL','http://localhost:8765/beta/index.html')
MOCK=open('/home/claude/habit-quest/dev/v5/mockdb.js').read()
errs=[]
def run(pw,W=1400,H=900,seed=None,store=None,pre=''):
    b=pw.chromium.launch()
    ctx=b.new_context(viewport={'width':W,'height':H})
    init=MOCK+"\n"
    if store: init+="window.__seedAll="+json.dumps(store)+";for(const k in window.__seedAll)window.__store.set(k,window.__seedAll[k]);\n"
    if seed: init+="window.__seed("+json.dumps(seed)+");\n"
    init+="try{localStorage.clear()}catch(e){}\n"+pre
    ctx.add_init_script(init)
    ctx.route('**/backend.js',lambda r:r.fulfill(body="window.__hqResolve(window.__mockApi)",content_type='application/javascript'))
    ctx.route('**/config.js',lambda r:r.fulfill(body="",content_type='application/javascript'))
    ctx.route('**/sw.js',lambda r:r.fulfill(body="",content_type='application/javascript'))
    ctx.route('**/gstatic.com/**',lambda r:r.abort())
    pg=ctx.new_page()
    pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e)+' '+(e.stack or '')[:600]))
    pg.on('console',lambda m:errs.append('CON '+m.text) if m.type=='error' else None)
    pg.goto(URL);pg.wait_for_timeout(2300)
    # v7.3: 목업엔 기본 카드 '새벽 3시 넘어 잠'이 있어서 시작 2초 뒤 '늦게 잠' 고침 알림이 10초 떠요 → 시험이 가리지 않게 닫기
    pg.evaluate("()=>{const t=document.getElementById('toast');if(t&&/늦게 잠|도파민 코스를 다시/.test(t.innerText)){t.classList.remove('on');t.style.pointerEvents=''}}")
    return b,pg
def closepops(pg):
    for i in range(6):
        if pg.is_visible('#levelup'):pg.click('#luOk');pg.wait_for_timeout(150)
def drag(pg,a,b,steps=12):
    pg.mouse.move(*a);pg.mouse.down();pg.mouse.move(a[0]+8,a[1]+8,steps=3);pg.mouse.move(*b,steps=steps);pg.wait_for_timeout(80);pg.mouse.up();pg.wait_for_timeout(350)
def ctr(bb,dx=0.5,dy=0.5):return (bb['x']+bb['width']*dx,bb['y']+bb['height']*dy)
def dump(pg):
    return pg.evaluate("JSON.stringify([...window.__store.entries()])")
