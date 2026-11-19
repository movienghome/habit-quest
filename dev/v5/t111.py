# t111 (v10.8): N20 마음 막대 — 영역 종류가 경제로 저장돼 있어도 한 번 🔋로 바로잡아 홈 막대가 나옴
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
J=lambda pg,x:pg.evaluate(x)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
def run_main(pg,W):
    pg.wait_for_timeout(500)
    J(pg,"location.hash='home'");pg.wait_for_timeout(300)
    nm=J(pg,"(C.areas.find(a=>a.id==='mind')||{}).name")
    ok(nm=='마음',f'[{W}] 목업 영역 mind = 마음',nm)
    # 잘못 저장된 상태 흉내: 마음 = 💰 경제, 이주 표시 없음
    J(pg,"(()=>{C.ak101=Object.assign({},C.ak101||{},{mind:'m'});delete C.mig107;save('config');render()})()");pg.wait_for_timeout(700)
    ok(J(pg,"akOf101('mind')==='c'"),f'[{W}] 마음이 🔋 컨디션으로 돌아옴',J(pg,"akOf101('mind')"))
    ok(J(pg,"[...document.querySelectorAll('#areaBars .area b')].some(b=>b.textContent.trim()==='마음')"),f'[{W}] 홈 영역 막대에 마음이 있음',J(pg,"[...document.querySelectorAll('#areaBars .area b')].map(b=>b.textContent).join(',')"))
    ok(not J(pg,"[...document.querySelectorAll('.pg101 *')].some(x=>/^마음/.test(x.textContent.trim())&&x.children.length===0)"),f'[{W}] 마음이 진척·경제 칩 줄에서는 빠짐')
    ok(J(pg,"!!C.mig107&&C.mig107.fix.includes('마음')"),f'[{W}] 이주 기록 C.mig107',J(pg,"JSON.stringify(C.mig107)"))
    # 한 번짜리: 사용자가 다시 경제로 바꾸면 그대로 둠
    J(pg,"(()=>{C.ak101=Object.assign({},C.ak101,{mind:'m'});save('config');render()})()");pg.wait_for_timeout(500)
    ok(J(pg,"akOf101('mind')==='m'"),f'[{W}] 한 번짜리라 다시 바꾼 건 그대로',J(pg,"akOf101('mind')"))
    # 몸·생활은 영향 없음, 작품·경제 같은 영역은 안 건드림
    J(pg,"(()=>{C.ak101=Object.assign({},C.ak101,{mind:'c',make:'p'});delete C.mig107;save('config');render()})()");pg.wait_for_timeout(500)
    ok(J(pg,"akOf101('make')==='p'&&akOf101('body')==='c'&&akOf101('life')==='c'"),f'[{W}] 다른 영역 종류는 그대로')
with sync_playwright() as pw:
    for W in (1400,420):
        b,pg=run(pw,W,900)
        run_main(pg,W)
        b.close()
print('ERRS',[e for e in errs if 'PAGEERR' in e][:5])
print('FAILS',len(FAILS),FAILS)
