# v13.20c: 홈 전투 카드의 HP 숫자·HP 막대를 눌러도 HP 설명 창(7일 비교·0점 기록)이 열림
from h61 import *
F=[]
def ok(c,m):print(('PASS ' if c else 'FAIL ')+m);(None if c else F.append(m))
with sync_playwright() as pw:
    for W,H in ((1400,900),(390,844)):
        b,pg=run(pw,W=W,H=H);tag=f'[{W}] '
        pg.evaluate("location.hash='#home'");pg.wait_for_timeout(600)
        for sel,name in (('.ml90 span[data-info="hp"]','HP 숫자'),('.hp90[data-info="hp"]','HP 막대')):
            ok(pg.locator(sel).count()==1,tag+name+'에 설명 연결')
            pg.evaluate("()=>{try{closeInfo()}catch(e){}}");pg.wait_for_timeout(150)
            pg.locator(sel).first.click();pg.wait_for_timeout(400)
            t=pg.evaluate("()=>(document.querySelector('#pop')||{}).innerText||''")
            ok('HP' in t and ('옛 규칙' in t or '하루 시작값' in t or '아침 에너지' in t),tag+name+' 누르면 HP 설명 창: '+t[:40].replace('\n',' '))
        b.close()
print('FAILS',len(F),F)
