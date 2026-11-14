# t107 (v10.4): 😴 잠 칩 · 몸 최대 설명 · HP 비교(들어간 기록·0점 기록) · 카드 체크 = 기록 창 · 카드 빈 곳 메뉴 · 보조 영역 · 영역 칸 테두리
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
J=lambda pg,x:pg.evaluate(x)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
def notoast(pg):
    J(pg,"(()=>{const t=document.getElementById('toast');if(t){t.classList.remove('on');t.style.pointerEvents=''}})()")
PUT="""window.put107=(k,e)=>{DAYS[k]=DAYS[k]||blankDay(k);DAYS[k].entries=DAYS[k].entries||[];DAYS[k].entries.push(Object.assign({id:'z'+Math.random().toString(36).slice(2),type:'good',xp:0,gold:0,t:'10:00'},e))};
window.clr107=()=>{const td=gk76();[0,1,2].forEach(i=>{const k=addDays(td,-i);if(DAYS[k]){DAYS[k].entries=[];DAYS[k].food={};delete DAYS[k].sl102}})};"""
def run_t(pg,W):
    pg.wait_for_timeout(700);notoast(pg);J(pg,PUT)
    J(pg,"clr107();location.hash='home';render()");pg.wait_for_timeout(500);notoast(pg)
    c=J(pg,"(document.querySelector('#battleBox .sl102')||{}).textContent||''")
    ok('😴' in c and '어젯밤 잠?' in c,f'[{W}] 안 적었으면 😴 어젯밤 잠? 칩',c)
    J(pg,"dayOf(gk76()).sl102={b:'01:30',w:'07:00',dr:1,ln:0};render()");pg.wait_for_timeout(300)
    c=J(pg,"(document.querySelector('#battleBox .sl102')||{}).textContent||''")
    ok('잠 5h30' in c and '🍺술' in c and '몸 최대 76' in c,f'[{W}] 적은 뒤 칩 글자(잠 5h30 · 🍺술 · 몸 최대 76)',c)
    # 몸 최대 설명: 빗금 누르기
    t=J(pg,"(document.querySelector('#areaBars .cap102')||{}).title||''")
    ok('오늘 몸 최대 76' in t and '벗어나기' in t,f'[{W}] 빗금에 마우스 올리면 요약',t)
    pg.click('#areaBars .cap102',force=True);pg.wait_for_timeout(450)
    t=J(pg,"(()=>{const p=document.getElementById('pop');return p&&!p.hidden?p.innerText:''})()")
    ok('오늘 몸 최대 76' in t and '왜' in t and '지금' in t and '벗어나기' in t and '술' in t,f'[{W}] 빗금 누르면 몸 최대 설명(왜·지금·벗어나기)',t[:200])
    J(pg,"closeInfo()")
    # HP 비교: 들어간 기록·0점 기록
    J(pg,"clr107();const y=addDays(gk76(),-1);put107(y,{kind:'act',type:'bad',aid:'b1',name:'술 · 혼술',area:'body',cond:-30});put107(y,{kind:'act',name:'걷기',area:'body',cond:5});put107(y,{kind:'act',name:'시나리오 25분',area:'make',cond:40,xp:20});const t=newTask({title:'명상 단계'});saveTask(t);put107(y,{kind:'task',tid:t.id,name:'명상 단계',cond:0,area:''});window.__t107=t.id;render()")
    J(pg,"openInfo('hp')");pg.wait_for_timeout(400)
    J(pg,"(()=>{const d=[...document.querySelectorAll('#pop .cw102')];const k=fmtD(addDays(gk76(),-1));const x=d.find(z=>z.querySelector('summary').textContent.includes(k));if(x)x.open=true})()")
    w=J(pg,"(()=>{const d=[...document.querySelectorAll('#pop .cw102')].find(x=>x.open);return d?d.innerText:''})()")
    ok('HP에 들어간 기록' in w and '술 · 혼술 −30' in w and '걷기 +5' in w,f'[{W}] 펼치면 들어간 기록(술 −30 · 걷기 +5)',w[:300])
    ok('점수 0인 기록' in w and '명상 단계' in w and '덮었' in w,f'[{W}] 0점 기록 이름 · 옛 규칙은 진척 기록이 감점을 덮었다는 설명',w[:400])
    pg.click('#pop [data-z103]');pg.wait_for_timeout(500)
    ok(J(pg,"(sheetCtx||{}).task===window.__t107||((document.getElementById('sheetC')||{}).textContent||'').includes('명상 단계')"),f'[{W}] 0점 칩 누르면 할 일 상세')
    J(pg,"closeSheet();closeInfo()")
    # 카드 체크 = 기록 창
    J(pg,"clr107();C.sh103=undefined;location.hash='log';render()");pg.wait_for_timeout(600);notoast(pg)
    aid=J(pg,"(()=>{const r=[...document.querySelectorAll('#actGroups .acts:not(.now96) .act.good[data-info^=\"act:\"]')].find(x=>{const a=C.actions.find(z=>z.id===x.dataset.info.slice(4));return a&&!(a.opts&&a.opts.length)&&!a.money&&!a.once});return r?r.dataset.info.slice(4):null})()")
    n0=J(pg,"today().entries.length")
    pg.click(f'#actGroups .acts:not(.now96) .act[data-info="act:{aid}"] .chk');pg.wait_for_timeout(450)
    s=J(pg,"(()=>{const s=document.getElementById('sheet');return {open:!s.hidden,when:!!document.querySelector('#sheetC .w70'),n:today().entries.length}})()")
    ok(s['open'] and s['when'] and s['n']==n0,f'[{W}] □ 누르면 기록 창(📅 언제?)이 뜨고 아직 기록 안 됨',s)
    pg.click('#sheetC [data-w70=y1]');pg.wait_for_timeout(250);pg.click('#sheetC [data-sheet=ok]');pg.wait_for_timeout(500);notoast(pg)
    y=J(pg,f"(DAYS[addDays(gk76(),-1)]||{{entries:[]}}).entries.filter(e=>e.aid==='{aid}').length")
    ok(y==1 and J(pg,"today().entries.length")==n0,f'[{W}] 어제 고르고 했어요 → 어제 날에 기록',y)
    J(pg,"C.sh103=0;render()");pg.wait_for_timeout(300)
    pg.click(f'#actGroups .acts:not(.now96) .act[data-info="act:{aid}"] .chk');pg.wait_for_timeout(450)
    ok(J(pg,f"today().entries.filter(e=>e.aid==='{aid}').length")==1 and J(pg,"document.getElementById('sheet').hidden"),f'[{W}] 끄면(C.sh103=0) 예전처럼 바로 기록')
    J(pg,"C.sh103=1;(document.querySelector('#snack')||{}).hidden=true;render()");pg.wait_for_timeout(300);notoast(pg)
    # 카드 빈 곳 → 메뉴
    box=J(pg,f"(()=>{{const r=document.querySelector('#actGroups .acts:not(.now96) .act[data-info=\"act:{aid}\"]').getBoundingClientRect();return [r.right-6,r.bottom-6]}})()")
    pg.mouse.click(box[0],box[1]);pg.wait_for_timeout(400)
    m=J(pg,"(()=>{const m=document.getElementById('m61');return m&&!m.hidden&&m.getBoundingClientRect().height>0?m.innerText:''})()")
    ok('기록하기' in m and '편집 목록에서 보기' in m and '설명' in m and '지우기' in m and '7일' in m,f'[{W}] 카드 빈 곳 누르면 메뉴(기록하기·설명·편집·목록에서 보기·지우기)',m[:200])
    ok(J(pg,"document.getElementById('pop').hidden"),f'[{W}] 설명 창은 안 뜸(메뉴만)')
    pg.click('#m61 button:has-text("편집 목록에서 보기")');pg.wait_for_timeout(900)
    ok(J(pg,"location.hash")=='#edit' and J(pg,f"!!document.querySelector('#editBody .fl103')"),f'[{W}] 편집 목록에서 그 카드에 표시')
    # 보조 영역
    J(pg,"location.hash='home';clr107();render()");pg.wait_for_timeout(400)
    r=J(pg,f"""(()=>{{const a=C.actions.find(z=>z.id==='{aid}');a.cond=10;a.area='body';a.ar2='mind';a.r2=40;const av0=areaValues(today()),h0=overallOf(today());
      doAction(a,{{direct:true}});const e=today().entries.find(x=>x.aid===a.id),av=areaValues(today()),h=overallOf(today());
      return {{e:[e.ar2,e.r2,e.cond,e.area],db:av.body-av0.body,dm:av.mind-av0.mind,dh:h-h0}}}})()""")
    ok(r['e']==['mind',40,10,'body'] and r['db']==6 and r['dm']==4 and r['dh']==10,f'[{W}] 보조 영역: 몸 +6 · 마음 +4 · HP +10(합 그대로)',r)
    J(pg,f"(()=>{{const a=C.actions.find(z=>z.id==='{aid}');a.ar2='';}})()")
    ok(J(pg,"(()=>{const e=today().entries[0];return e.ar2==='mind'&&areaValues(today()).mind>=64})()"),f'[{W}] 카드에서 빼도 지난 기록은 그대로 나뉨')
    J(pg,f"openActionEditor('{aid}')");pg.wait_for_timeout(400)
    ed=J(pg,"(()=>{const s=document.querySelector('#sheetC select.ar103'),r=document.querySelector('#sheetC select.r103');return s?{v:s.value,rh:r.classList.contains('hid78')}:null})()")
    ok(ed and ed['v']=='' and ed['rh'],f'[{W}] 카드 편집 칩 줄에 ＋ 보조 영역(없으면 몫 칩 숨김)',ed)
    pg.select_option('#sheetC select.ar103','mind');pg.wait_for_timeout(250)
    ed=J(pg,f"(()=>{{const a=C.actions.find(z=>z.id==='{aid}');return {{a:a.ar2,rh:document.querySelector('#sheetC select.r103').classList.contains('hid78')}}}})()")
    ok(ed['a']=='mind' and not ed['rh'],f'[{W}] 고르면 저장되고 몫 칩이 보임',ed)
    J(pg,"closeSheet()")
    # 영역 칸 테두리
    J(pg,"location.hash='log';render()");pg.wait_for_timeout(500)
    bw=J(pg,"(()=>{const h=document.querySelector('#actGroups>.ghead[data-gcollapse^=\"a:\"]'),a=h&&h.nextElementSibling;return h?[getComputedStyle(h).borderTopWidth,a?getComputedStyle(a).borderBottomWidth:'']:null})()")
    ok(bw and bw[0]!='0px' and bw[1]!='0px',f'[{W}] 기록하기 영역 칸 테두리',bw)
    ov=J(pg,"(()=>{const b=document.getElementById('actGroups');return b.scrollWidth-b.clientWidth})()")
    ok(ov<=1,f'[{W}] 기록하기 가로 안 넘침',ov)

with sync_playwright() as pw:
    for W,H in [(1400,900),(390,800)]:
        b,pg=run(pw,W=W,H=H)
        try:run_t(pg,W)
        except Exception as e:
            ok(False,f'[{W}] 예외 {e}')
        b.close()
real=[e for e in errs if 'favicon' not in e and 'net::' not in e and 'Failed to load' not in e]
ok(not real,'콘솔 오류 없음',real[:3])
print('FAILS',len(FAILS),FAILS)
