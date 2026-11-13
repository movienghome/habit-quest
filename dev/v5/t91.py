# v9.1 시험 — 홈 '나' 카드가 전투 카드에 합쳐짐
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra) if extra!='' else ''))
    if not c:FAILS.append(msg)
with sync_playwright() as pw:
    for W,H in ((390,844),(360,740),(1400,900)):
        b,pg=run(pw,W,H);closepops(pg)
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.evaluate("()=>{location.hash='#home';render()}");pg.wait_for_timeout(600)
        r=pg.evaluate("""()=>{const q=s=>document.querySelector(s),R=e=>{if(!e)return null;const b=e.getBoundingClientRect();return {w:Math.round(b.width),h:Math.round(b.height),vis:getComputedStyle(e).display!=='none'&&b.width>0}};
          const inBox=id=>!!q('#battleBox #'+id);
          return {m90:document.body.classList.contains('m90'),prof:R(q('[data-hid=profile]')),box:R(q('#battleBox')),
            ids:['heroAv','moodName','areaBars','energy','equipped'].map(inBox),areas:document.querySelectorAll('#battleBox .area').length,
            mini:document.querySelectorAll('#battleBox .mini').length,mh:document.querySelectorAll('#battleBox .mh90,#battleBox .hb91').length,
            av:R(q('#heroAv')),hp:R(q('.hp90')),sw:document.documentElement.scrollWidth,iw:innerWidth,
            mood:(q('#moodName')||{}).textContent,hpw:(q('.hp90 .fill')||{style:{}}).style.width}}""")
        print(W,r)
        ok(r['m90'],f'[{W}] 합친 모드')
        ok(not r['prof']['vis'],f'[{W}] 옛 프로필 카드 숨김')
        ok(all(r['ids']),f'[{W}] 아바타·기분·영역·에너지가 전투 카드 안',r['ids'])
        ok(r['areas']>=3,f'[{W}] 영역 막대',r['areas'])
        ok(r['mh']==r['mini'] or r['mini']==0 or r['mh']>0,f'[{W}] 쫄따구 HP 바',(r['mh'],r['mini']))
        ok(r['sw']<=r['iw'],f'[{W}] 가로로 안 넘침')
        pg.screenshot(path=f'/tmp/m90_{W}.png',full_page=False)
        pg.click('#heroAv');pg.wait_for_timeout(500)
        ok('edit' in pg.evaluate('location.hash'),f'[{W}] 아바타 누르면 꾸미기',pg.evaluate('location.hash'))
        pg.evaluate("()=>{location.hash='#home'}");pg.wait_for_timeout(300)
        # 아침 에너지 누르면 기분 숫자가 바뀌고 카드가 유지됨
        before=pg.evaluate("document.querySelector('#moodName').textContent")
        pg.click('#battleBox [data-energy="5"]');pg.wait_for_timeout(500)
        after=pg.evaluate("document.querySelector('#moodName').textContent")
        ok(pg.evaluate("document.body.classList.contains('m90')&&!!document.querySelector('#battleBox #moodName')"),f'[{W}] 에너지 고른 뒤에도 합쳐진 채',(before,after))
        # 전투 숨기면 옛 카드로 복귀
        pg.evaluate("()=>{const e=C.ui.home.find(x=>x[0]==='battle');e[1]=0;render()}");pg.wait_for_timeout(400)
        ok(pg.evaluate("!document.body.classList.contains('m90')&&!!document.querySelector('[data-hid=profile] #heroAv')&&getComputedStyle(document.querySelector('[data-hid=profile]')).display!=='none'"),f'[{W}] 전투 숨기면 옛 프로필 카드로 복귀')
        ok(not errs,f'[{W}] 콘솔 오류 없음',errs[:2])
        b.close()
print('FAILS',len(FAILS),FAILS)
