import json,sys
sys.path.insert(0,'/tmp/claude-0/-home-claude/57fdb68d-e178-5526-84b7-bc52896b8430/scratchpad')
from playwright.sync_api import sync_playwright
exec(open('/tmp/claude-0/-home-claude/57fdb68d-e178-5526-84b7-bc52896b8430/scratchpad/t1.py').read().split("with sync_playwright() as pw:")[0])
def closepops(pg):
    for i in range(6):
        if pg.is_visible('#levelup'):pg.click('#luOk');pg.wait_for_timeout(200)
def imp(pg):
    pg.goto(URL+'#more');pg.wait_for_timeout(300)
    pg.set_input_files('#ttFile','/mnt/user-data/attachments/57fdb68d-e178-5526-84b7-bc52896b8430/fe175b1f-TickTick-backup-2026-11-02.csv')
    pg.wait_for_timeout(600);pg.click('#ttGo');pg.wait_for_timeout(1200)
W=int(sys.argv[1]) if len(sys.argv)>1 else 390
H=844 if W<600 else 900
with sync_playwright() as pw:
    b,pg=run(pw,W,H,'x');closepops(pg);imp(pg);closepops(pg)
    for v in ['home','tasks','cal','gacha','log','edit','more','stats']:
        pg.goto(URL+'#'+v);pg.wait_for_timeout(400)
        sw=pg.evaluate('document.documentElement.scrollWidth')
        wide=pg.evaluate("""()=>[...document.querySelectorAll('section:not([hidden]) *')].filter(e=>{const r=e.getBoundingClientRect();return r.right>innerWidth+1&&r.width>0}).slice(0,5).map(e=>e.tagName+'.'+e.className+' '+Math.round(e.getBoundingClientRect().right))""")
        print(v,sw,wide)
    pg.goto(URL+'#gacha');pg.wait_for_timeout(300);pg.click('#gDraw');pg.wait_for_timeout(500)
    print(pg.evaluate("()=>{const b=document.querySelector('[data-gflipall]');const r=b.getBoundingClientRect();return [r.x,r.y,r.width,r.height,innerWidth,innerHeight,scrollY,document.body.style.overflow]}"))
    pg.screenshot(path=SP+'dbg_gacha.png',full_page=True)
    for c in ['m_week']: pass
    pg.goto(URL+'#cal');pg.wait_for_timeout(300);pg.click('[data-calmode="week"]');pg.wait_for_timeout(400);pg.screenshot(path=SP+f'w{W}_week.png')
    pg.click('[data-calmode="month"]');pg.wait_for_timeout(300);pg.screenshot(path=SP+f'w{W}_month.png',full_page=True)
    pg.goto(URL+'#tasks');pg.wait_for_timeout(300);pg.screenshot(path=SP+f'w{W}_tasks.png')
    pg.goto(URL+'#home');pg.wait_for_timeout(300);pg.screenshot(path=SP+f'w{W}_home.png',full_page=True)
    b.close()
print('\n'.join(errs[:30]))
