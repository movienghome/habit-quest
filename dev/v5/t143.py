# t143 (v13.7): 루틴 프리셋 폴더 탭(V1) · 하나 그리고 둘 🤝(V3)
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
R="C.routines.find(x=>x.id===window.__rid)"
def C_(sel):return f"document.querySelector('{sel}')"
with sync_playwright() as pw:
  for W,H,mode in [(1200,1000,'edit'),(390,800,'sheet')]:
    b,pg=run(pw,W=W,H=H);closepops(pg);notoast(pg)
    J(pg,"""(()=>{const r=rtNew61('Eos',[{name:'산책',min:10},{name:'명상',min:5},{name:'세수',min:2}]);setRt60(r,[0,1,2,3,4,5,6]);syncDailies(C);save('config');render();window.__rid=r.id;sync62(r);ensure117(r);save('config');render()})()""")
    pg.wait_for_timeout(600);notoast(pg)
    if mode=='edit':
        J(pg,"goEdit('routines')");pg.wait_for_timeout(700);SC=f"#rt60-'+window.__rid+'"
        S=lambda q:f"document.getElementById('rt60-'+window.__rid).querySelector('{q}')"
        SA=lambda q:f"document.getElementById('rt60-'+window.__rid).querySelectorAll('{q}')"
    else:
        J(pg,"location.hash='tasks';render()");pg.wait_for_timeout(500);J(pg,"openRt61(window.__rid)");pg.wait_for_timeout(500)
        S=lambda q:f"document.getElementById('sheetC').querySelector('{q}')"
        SA=lambda q:f"document.getElementById('sheetC').querySelectorAll('{q}')"
    notoast(pg)
    ok(J(pg,f"!{S('.pk135')}"),f'[{W}] 프리셋 하나면 탭 없음(옛 모양)')
    # 새 프리셋
    J(pg,f"{S('[data-pn117]')}.click()");pg.wait_for_timeout(500);notoast(pg)
    ok(J(pg,f"!!{S('.pk135')}"),f'[{W}] 프리셋 둘 → 폴더 탭')
    ok(J(pg,f"{SA('.tl135 .tab135:not(.add135)')}.length")==2,f'[{W}] 탭 2개')
    ok(J(pg,f"!{S('.pt124')}&&!{S('.pwrap123')}&&!{S('.pm124')}"),f'[{W}] 옛 단계 편집 탭·프리셋별 시각 줄·이름 접힘 없음')
    ok(J(pg,f"!!{S('.pc135 > .st62s')}&&!!{S('.pc135 [data-ptm123]')}&&{SA('.pc135 [data-pwd123]')}.length===7"),f'[{W}] 카드 안에 시각·요일·단계')
    ok(J(pg,f"!!{S('.once135 .pbar119 [data-pk117]')}&&!{S('.when124 + .pbar119, .hd124 + .pbar119')}"),f'[{W}] 오늘/내일 줄은 이번만 팝오버 안')
    # 열린 탭(새 프리셋) 다시 누르기 → 이름 칸
    J(pg,f"{S('.tab135.on')}.click()");pg.wait_for_timeout(200)
    ok(J(pg,"document.activeElement&&document.activeElement.classList.contains('nm135')"),f'[{W}] 열린 탭 다시 누르면 이름 칸에 포커스')
    pg.keyboard.press('Control+a');pg.keyboard.type('출근');pg.keyboard.press('Enter');pg.wait_for_timeout(500);notoast(pg)
    ok(J(pg,f"{R}.ps117.some(p=>p.n==='출근')"),f'[{W}] Enter로 이름 저장',J(pg,f"{R}.ps117.map(p=>p.n)"))
    ok(J(pg,f"!!{S('.tab135.on')}&&/출근/.test({S('.tab135.on')}.textContent)&&!{S('.rn135')}"),f'[{W}] 다시 탭으로 돌아옴')
    # Esc 취소
    J(pg,f"{S('.tab135.on')}.click()");pg.wait_for_timeout(200);pg.keyboard.type('XX');pg.keyboard.press('Escape');pg.wait_for_timeout(300)
    ok(J(pg,f"{R}.ps117.every(p=>p.n!=='XX')&&!{S('.rn135')}"),f'[{W}] Esc면 그대로')
    # 다른 탭 누르면 그 프리셋 열림
    J(pg,f"{S('.tl135 .tab135:not(.on):not(.add135)')}.click()");pg.wait_for_timeout(400)
    ok(J(pg,f"/일반/.test({S('.tab135.on')}.textContent)"),f'[{W}] 다른 탭 열기')
    # ⋯ 메뉴 → 복제
    J(pg,f"{S('.pm135 > summary')}.click()");pg.wait_for_timeout(150)
    ok(J(pg,f"{S('.pm135')}.open&&{S('.mn135')}.offsetParent!==null"),f'[{W}] ⋯ 메뉴 열림')
    J(pg,f"{S('.mn135 [data-pdup117]')}.click()");pg.wait_for_timeout(500);notoast(pg)
    ok(J(pg,f"{R}.ps117.length")==3 and J(pg,f"!{S('.pm135')}.open"),f'[{W}] 복제 → 3개, 메뉴 닫힘')
    # ⋯ → 이름 바꾸기
    J(pg,f"{S('.pm135 > summary')}.click()");pg.wait_for_timeout(100);J(pg,f"{S('.mn135 [data-rn135]')}.click()");pg.wait_for_timeout(200)
    ok(J(pg,"document.activeElement&&document.activeElement.classList.contains('nm135')"),f'[{W}] ⋯ → 이름 바꾸기도 그 자리 칸')
    pg.keyboard.press('Escape');pg.wait_for_timeout(300)
    # 삭제
    J(pg,f"{S('.pm135 > summary')}.click()");pg.wait_for_timeout(100);J(pg,f"{S('.mn135 [data-pdel117]')}.click()");pg.wait_for_timeout(500);notoast(pg)
    ok(J(pg,f"{R}.ps117.length")==2,f'[{W}] 삭제')
    # 시각·요일 (w123 처리 그대로)
    J(pg,f"(()=>{{const i={S('.pc135 [data-ptm123]')};i.value='07:30';i.dispatchEvent(new Event('change',{{bubbles:true}}))}})()");pg.wait_for_timeout(400)
    ok(J(pg,f"{R}.ps117.some(p=>p.tm==='07:30')")and J(pg,f"/07:30/.test({S('.tab135.on')}.textContent)"),f'[{W}] 시각 저장 · 탭에 시각 표시')
    J(pg,f"{SA('.pc135 [data-pwd123]')}[2].click()");pg.wait_for_timeout(400);notoast(pg)
    ok(J(pg,f"{R}.ps117.some(p=>(p.wd||[]).indexOf(3)>=0)")and J(pg,f"{SA('.pc135 [data-pwd123]')}[2].getAttribute('aria-pressed')")=='true',f'[{W}] 자동 요일 저장')
    # 이번만 팝오버 → 오늘 다른 프리셋
    J(pg,f"{S('.once135 > summary')}.click()");pg.wait_for_timeout(150)
    ok(J(pg,f"{S('.once135 .pop135')}.offsetParent!==null"),f'[{W}] 이번만 팝오버 보임')
    oth=J(pg,f"[...{SA('.once135 [data-pk117]')}].find(b=>b.getAttribute('aria-pressed')!=='true').dataset.pk117")
    J(pg,f"[...{SA('.once135 [data-pk117]')}].find(b=>b.getAttribute('aria-pressed')!=='true').click()");pg.wait_for_timeout(500);notoast(pg)
    ok(J(pg,f"({R}.pd117||{{}})[gk76()]")==oth.split('|')[2],f'[{W}] 오늘만 바꾸기 저장',oth)
    ok(J(pg,f"/이번만/.test({S('.once135 > summary')}.textContent)"),f'[{W}] 요약에 이번만 표시')
    # 끌기 여전히
    ok(J(pg,f"{SA('.pc135 .st62s .dg134')}.length")==3,f'[{W}] ⠿ 손잡이 그대로')
    # 폭 넘침 없음
    ow=J(pg,f"(()=>{{const c={S('.pk135')};return c.scrollWidth-c.clientWidth}})()")
    ok(ow<=1,f'[{W}] 카드 가로 넘침 없음',ow)
    pg.screenshot(path=f'/tmp/w/t143_{W}.png',full_page=False)
    ok(not [e for e in errs if 'PAGEERR' in e],f'[{W}] 페이지 오류 없음',[e for e in errs if 'PAGEERR' in e][:2])
    b.close()
  # ---- V3 🤝 ----
  b,pg=run(pw,W=1200,H=900);closepops(pg);notoast(pg)
  r=J(pg,"""(()=>{const ws=weekStart(gk76());const t=newTask?null:null;
    const k=addDays(ws,2);const sc=Object.values(TASKS).find(x=>x.rep&&x.rep.type==='weekly');
    const T={id:'tsc',title:'시나리오 쓰기',status:0,rep:{type:'wk',n:5},due:gk76(),list:'inbox'};
    const h={id:'thg',title:'하나 그리고 둘',status:0,due:k,hg119:'tsc',list:fixId122(),time:'14:00'};
    return [typeof dots99,ws,k]})()""")
  html=J(pg,"""(()=>{const ws=weekStart(gk76()),k=addDays(ws,2);TASKS['thg']={id:'thg',title:'하나 그리고 둘',status:0,due:k,hg119:'tsc',list:fixId122(),time:'14:00'};
    const t={id:'tsc',title:'시나리오 쓰기'};return dots99(t,ws,gk76())})()""")
  ok(sum(x.count('🤝') for x in html.split('<i ')[1:])==1 and 'hg135' in html,'V3 만나기로 한 날 요일 칸에 🤝 하나',html[:400])
  html2=J(pg,"""(()=>{const ws=weekStart(gk76());TASKS['thg'].status=1;return dots99({id:'tsc',title:'시나리오 쓰기'},ws,gk76())})()""")
  ok('s-hgd hg135' in html2,'V3 끝낸 만남 날 = 채움 🤝',html2[:300])
  b.close()
print('FAILS',len(FAILS),FAILS)
