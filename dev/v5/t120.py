# t120 (v11.7→v11.8): 점수 칸 정리 + 목록 루틴 줄에 상황 칸 없음
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
J=lambda pg,x:pg.evaluate(x)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
def notoast(pg):J(pg,"(()=>{const t=document.getElementById('toast');if(t){t.classList.remove('on');t.style.pointerEvents=''}})()")
def mk(pg):
    J(pg,"""(()=>{const r=rtNew61('테스트 아침',[{name:'산책',min:10},{name:'명상',min:5},{name:'세수',min:2}]);setRt60(r,[0,1,2,3,4,5,6]);syncDailies(C);save('config');render();window.__rid=r.id})()""")
    pg.wait_for_timeout(700);notoast(pg)
    J(pg,"(()=>{const r=C.routines.find(x=>x.id===window.__rid);sync62(r);save('config');render()})()");pg.wait_for_timeout(500)
R="C.routines.find(x=>x.id===window.__rid)"
V=".view:not([hidden]) "
with sync_playwright() as pw:
  for W,H in [(1200,800),(390,800)]:
    b,pg=run(pw,W=W,H=H);closepops(pg);notoast(pg);mk(pg)
    J(pg,"location.hash='tasks';render()");pg.wait_for_timeout(600);notoast(pg)
    ok(J(pg,f"document.querySelectorAll('{V}.sit115').length")==0,f'[{W}] (v11.8) 목록 루틴 줄에는 상황 칸이 없음')
    J(pg,"location.hash='tasks';render()");pg.wait_for_timeout(500)
    # 점수 칸: 한 줄·오른쪽 정렬
    J(pg,"location.hash='tasks';render()");pg.wait_for_timeout(500)
    info=json.loads(J(pg,f"JSON.stringify([...document.querySelectorAll('{V}.trow')].filter(r=>r.querySelector(':scope>.tx')&&r.querySelector(':scope>.trun')).map(r=>{{const x=r.querySelector(':scope>.tx').getBoundingClientRect();return {{r:Math.round(x.right*10)/10,h:Math.round(x.height),rt:r.classList.contains('rt115')}}}}))"))
    rights=set(i['r'] for i in info)
    ok(len(info)>=1 and max(rights)-min(rights)<=1.5,f'[{W}] 점수 칸 오른쪽 끝이 줄마다 같음',sorted(rights))
    ok(all(i['h']<=22 for i in info if not i['rt']),f'[{W}] 보통 줄 점수는 한 줄',[i['h'] for i in info if not i['rt']])
    ok(all(i['h']<=34 for i in info if i['rt']),f'[{W}] 루틴 머리 점수는 두 줄 이하',[i['h'] for i in info if i['rt']])
    ok(J(pg,f"!!document.querySelector('{V}.trow.rt115 .tx.s115 .a115') && !!document.querySelector('{V}.trow.rt115 .tx.s115 .b115')"),f'[{W}] 루틴 머리 점수 = 단계 합 / 완주 보너스 두 칸')
    ok(J(pg,"document.documentElement.scrollWidth<=window.innerWidth+1"),f'[{W}] 가로로 넘치지 않음')
    b.close()
print('ERRS',[e for e in errs if 'favicon' not in e][:6])
print('FAILS',len(FAILS),FAILS)
