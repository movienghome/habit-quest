# v9.0 시험 — 폰 머리줄: 골드 칩·XP 막대가 보이고 높이가 얇게 유지
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra) if extra!='' else ''))
    if not c:FAILS.append(msg)
with sync_playwright() as pw:
    for W,H in ((390,844),(360,740),(1400,900)):
        b,pg=run(pw,W,H);closepops(pg)
        pg.evaluate("()=>{C.ui=C.ui||{};render()}");pg.wait_for_timeout(500)
        r=pg.evaluate("""()=>{const q=s=>document.querySelector(s),R=e=>{if(!e)return null;const b=e.getBoundingClientRect();return {w:Math.round(b.width),h:Math.round(b.height),l:Math.round(b.left),r:Math.round(b.right),vis:getComputedStyle(e).display!=='none'&&b.width>0}};
          const bars=[...document.querySelectorAll('.hud-bars .mbar')].map(R);
          return {hud:R(q('#hud')),gold:R(q('#hudGold')),brave:R(q('#hudBrave')),lv:R(q('#hudLv')),bars,tools:R(q('.hud-tools')),sw:document.documentElement.scrollWidth,iw:innerWidth}}""")
        print(W,r)
        ok(r['gold']['vis'],f'[{W}] 골드 칩 보임')
        ok(all(x['vis'] for x in r['bars']) and len(r['bars'])==2,f'[{W}] HP·XP 막대 둘 다 보임')
        ok(all(x['w']>=50 for x in r['bars']),f'[{W}] 막대 폭 50px 이상',[x['w'] for x in r['bars']])
        ok(r['hud']['h']<=60,f'[{W}] 머리줄 높이 60px 이하',r['hud']['h'])
        ok(r['sw']<=r['iw'],f'[{W}] 가로로 넘치지 않음')
        ok(r['bars'][1]['r']<=r['tools']['l']+1,f'[{W}] 막대가 오른쪽 단추와 안 겹침')
        pg.screenshot(path=f'/tmp/hud{W}.png',clip={'x':0,'y':0,'width':W,'height':120})
        pg.click('#hudAv');pg.wait_for_timeout(500)
        ok('edit' in pg.evaluate('location.hash'),f'[{W}] 아바타 누르면 꾸미기',pg.evaluate('location.hash'))
        b.close()
print('FAILS',len(FAILS),FAILS)
