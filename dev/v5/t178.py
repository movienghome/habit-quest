# t178 (v13.35): 루틴 편집 한 줄씩·누른 것만 펼침 · 단계 × 바로 · 저절로 다시 그려도 ⋯ 열린 채 · strip126 저장 안 함
import os,json
os.environ.setdefault('HQURL','file:///home/claude/habit-quest/beta/index.html')
exec(open('/home/claude/habit-quest/dev/v5/h61.py').read())
URL=os.environ.get('HQURL',URL)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
J=lambda pg,x:pg.evaluate(x)
def notoast(pg):J(pg,"(()=>{const t=document.getElementById('toast');if(t){t.classList.remove('on');t.style.pointerEvents=''}})()")
with sync_playwright() as pw:
  for W,H in [(1200,1000),(390,800)]:
    b,pg=run(pw,W=W,H=H);closepops(pg);notoast(pg)
    J(pg,"""(()=>{const a=rtNew61('Eos',[{name:'산책',min:10},{name:'명상',min:5},{name:'세수',min:2}]);const c=rtNew61('Vesper',[{name:'일기',min:10},{name:'스트레칭',min:5}]);
      [a,c].forEach(r=>{setRt60(r,[0,1,2,3,4,5,6]);sync62(r);ensure117(r)});syncDailies(C);save('config');window.__a=a.id;window.__c=c.id;render()})()""")
    pg.wait_for_timeout(600);notoast(pg)
    J(pg,"goEdit('routines')");pg.wait_for_timeout(700);notoast(pg)
    n=J(pg,"document.querySelectorAll('[data-rt155]').length");nr=J(pg,"C.routines.length")
    ok(n==nr and nr>=2,f'[{W}] 루틴마다 한 줄',(n,nr))
    ok(J(pg,"[...document.querySelectorAll('.rt155s>.jarcard')].every(c=>getComputedStyle(c).display==='none')"),f'[{W}] 처음엔 카드 모두 접힘')
    txt=J(pg,"document.querySelector('[data-rt155=\"'+window.__a+'\"]').textContent")
    ok('Eos' in txt and '3단계' in txt and '17분' in txt,f'[{W}] 요약: 이름·단계·분',txt)
    pg.click(f"[data-rt155=\"{J(pg,'window.__a')}\"]");pg.wait_for_timeout(300)
    ok(J(pg,"getComputedStyle(document.getElementById('rt60-'+window.__a)).display!=='none'&&getComputedStyle(document.getElementById('rt60-'+window.__c)).display==='none'"),f'[{W}] 누른 루틴만 펼침')
    pg.click(f"[data-rt155=\"{J(pg,'window.__c')}\"]");pg.wait_for_timeout(300)
    ok(J(pg,"getComputedStyle(document.getElementById('rt60-'+window.__a)).display==='none'&&getComputedStyle(document.getElementById('rt60-'+window.__c)).display!=='none'"),f'[{W}] 다른 루틴 누르면 그것만')
    J(pg,"render()");pg.wait_for_timeout(300)
    ok(J(pg,"getComputedStyle(document.getElementById('rt60-'+window.__c)).display!=='none'"),f'[{W}] 다시 그려도 펼친 채')
    # 단계 × 바로 (⋯ 안 펼침)
    x=f"#rt60-{J(pg,'window.__c')} .st62 > .del155"
    ok(J(pg,f"document.querySelectorAll('{x}').length")==2,f'[{W}] 단계 줄에 × 바로')
    vis=J(pg,f"(()=>{{const b=document.querySelector('{x}').getBoundingClientRect();return b.width>0&&b.right<=innerWidth+1}})()")
    ok(vis,f'[{W}] × 화면 안')
    pg.click(x);pg.wait_for_timeout(500)
    ok(J(pg,"C.routines.find(r=>r.id===window.__c).steps.length")==1,f'[{W}] × 한 번에 단계 빠짐')
    ok('되돌리기' in J(pg,"document.getElementById('toast').textContent"),f'[{W}] 되돌리기 알림')
    notoast(pg)
    # ⋯ 단계 펼침 → 저절로 다시 그림(입력 없이) → 열린 채
    pg.click(f"#rt60-{J(pg,'window.__c')} .st62 [data-mo125]");pg.wait_for_timeout(900)
    J(pg,"render()");pg.wait_for_timeout(200)
    ok(J(pg,"!!document.querySelector('#rt60-'+window.__c+' .st62.open125')"),f'[{W}] 저절로 다시 그려도 단계 ⋯ 열린 채')
    # 프리셋 ⋯ 메뉴: 프리셋 둘 만들고 ⋯ 열기 → 저절로 render → 열린 채 → 삭제 누름
    J(pg,"document.querySelector('#rt60-'+window.__c+' [data-pn117]').click()");pg.wait_for_timeout(500);notoast(pg)
    pg.click(f"#rt60-{J(pg,'window.__c')} details.pm135 > summary");pg.wait_for_timeout(900)
    J(pg,"render()");pg.wait_for_timeout(200)
    ok(J(pg,"!!document.querySelector('#rt60-'+window.__c+' details.pm135[open]')"),f'[{W}] 저절로 다시 그려도 프리셋 ⋯ 열린 채')
    n0=J(pg,"C.routines.find(r=>r.id===window.__c).ps117.length")
    pg.click(f"#rt60-{J(pg,'window.__c')} details.pm135[open] [data-pdel117]");pg.wait_for_timeout(500)
    ok(J(pg,"C.routines.find(r=>r.id===window.__c).ps117.length")==n0-1,f'[{W}] 프리셋 삭제됨')
    ok(J(pg,"!document.querySelector('details.pm135[open]')"),f'[{W}] 삭제 뒤 메뉴 닫힘(사용자가 누른 직후는 되살리지 않음)')
    notoast(pg)
    # 새 루틴 → 펼침
    J(pg,"document.querySelector('[data-r61new]').click()");pg.wait_for_timeout(600);notoast(pg);J(pg,"closeSheet();goEdit('routines')");pg.wait_for_timeout(500)
    ok(J(pg,"window.RT155===C.routines[C.routines.length-1].id"),f'[{W}] 새 루틴(창 닫은 뒤)은 목록에서 펼친 채')
    # strip126: 저장 안 함
    r=J(pg,"(()=>{let n=0;const o=save;save=function(){n++;return o.apply(this,arguments)};C.ui.home.push(['week',1,'L']);render();save=o;return [n,C.ui.home.some(x=>x[0]==='week')]})()")
    ok(r==[0,False],f'[{W}] 옛 이번 주 칸: 메모리에서만 빼고 저장 안 함',r)
    errs=J(pg,"window.__errs||[]");ok(not errs,f'[{W}] 오류 없음',errs)
    b.close()
print('FAILS',len(FAILS),FAILS)
