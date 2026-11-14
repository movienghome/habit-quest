# t104 (v10.1): M1 복귀 모아 보기 + 용기 기록 모아 보기 — 돌아보기 '🌱 다시 일어난 증거'
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
J=lambda pg,x:pg.evaluate(x)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra) if extra!='' else ''))
    if not c:FAILS.append(msg)
def notoast(pg):
    J(pg,"(()=>{const t=document.getElementById('toast');if(t){t.classList.remove('on');t.style.pointerEvents=''}})()")
def run_t(pg,W):
    pg.wait_for_timeout(500)
    # 1) 자료가 없을 때: 칸은 있고 빈 안내가 보임
    J(pg,"location.hash='review'");pg.wait_for_timeout(900);notoast(pg)
    e=J(pg,"(()=>{const p=document.querySelector('.pf100');return p?p.textContent:null})()")
    ok(e is not None,f'[{W}] 돌아보기에 🌱 다시 일어난 증거 칸이 있음')
    if e is not None:
        ok('0번' in e and '아직 없어요' in e,f'[{W}] 복귀 없음 → 0번·안내 글',e[:120])
        ok('용기 기록이 아직 없어요' in e,f'[{W}] 용기 없음 → 안내 글')
    # 2) 자료 넣기: 복귀 3번(쉼 2일 / 힘든 날 1일 / 비운 날 3일) + 이번 주 용기 둘(하나는 나중에 붙임) + 지난주 용기 하나
    J(pg,"""(()=>{const td=dateKey(),ws=weekStart(td);
      C.back93={};C.back93[addDays(td,-40)]={n:2,from:'rest',e:'a'};C.back93[addDays(td,-20)]={n:1,from:'low',e:'b'};C.back93[td]={n:3,from:'gap',e:'c'};
      const put=(k,e)=>{DAYS[k]=DAYS[k]||{date:k,entries:[]};DAYS[k].entries=DAYS[k].entries||[];DAYS[k].entries.push(Object.assign({id:'z'+Math.random().toString(36).slice(2),type:'good',xp:7,gold:0,t:'10:00'},e))};
      put(ws,{kind:'courage',name:'전화 걸기'});
      put(ws,{kind:'task',name:'병원 예약',brave:1,bz82:'m',bv82:{xp:3,gold:0,pts:null}});
      put(addDays(ws,-3),{kind:'courage',name:'지난주 용기'});
      put(ws,{kind:'act',name:'용기 아닌 것'});
      render();renderReview59()})()""")
    pg.wait_for_timeout(500)
    t=J(pg,"(()=>{const p=document.querySelector('.pf100');return p?p.textContent:''})()")
    ok('3번' in t,f'[{W}] 복귀 3번',t[:160])
    ok('2일' in t,f'[{W}] 평균 2일(2+1+3 → 2)',t[:160])
    ok('이 주 1번' in t,f'[{W}] 이 주 복귀 1번(오늘)')
    ok('3일 만에 돌아옴' in t and '2일 만에 돌아옴' in t and '하루 쉬고 돌아옴' in t,f'[{W}] 최근 복귀 줄(며칠 만에)')
    ok('😴 쉼' in t and '🪫 힘든 날' in t and '📭 비운 날' in t,f'[{W}] 어디서 돌아왔나가 아이콘+글자(색만 X)')
    ok('용기 낸 일 · 2번' in t,f'[{W}] 이번 주 용기 2번(용기 아닌 기록·지난주 제외)',t[160:400])
    ok('전화 걸기' in t and '병원 예약' in t and '용기 아닌 것' not in t and '지난주 용기' not in t,f'[{W}] 목록 이름이 맞음')
    ok('나중에 붙임' in t and t.count('나중에 붙임')==1,f'[{W}] 사후로 붙인 것만 🕘 표시')
    ok('지금까지 3번' in t,f'[{W}] 지금까지 용기 3번')
    # 3) 한 주 전으로 가면 지난주 용기가 보임
    J(pg,"ui.rv59=1;renderReview59()");pg.wait_for_timeout(300)
    t2=J(pg,"(()=>{const p=document.querySelector('.pf100');return p?p.textContent:''})()")
    ok('지난주 용기 낸 일 · 1번' in t2 and '지난주 용기' in t2 and '전화 걸기' not in t2,f'[{W}] 한 주 전 보기 → 지난주 용기만',t2[160:330])
    J(pg,"ui.rv59=0;renderReview59()")
    # 4) 12줄 넘으면 …외 n번
    J(pg,"""(()=>{const ws=weekStart(dateKey());DAYS[ws]=DAYS[ws]||{date:ws,entries:[]};for(let i=0;i<12;i++)DAYS[ws].entries.push({id:'m'+i,type:'good',kind:'courage',name:'용기'+i,xp:1,t:'09:'+String(10+i)});renderReview59()})()""")
    pg.wait_for_timeout(300)
    t3=J(pg,"(()=>{const p=document.querySelector('.pf100');return p?p.textContent:''})()")
    ok('…외 2번' in t3,f'[{W}] 14번 중 12줄만 보이고 …외 2번',t3[-80:])
    # 5) 칸 위치: '왼쪽 메뉴' 칸 바로 앞
    pos=J(pg,"""(()=>{const a=document.querySelector('.pf100'),ps=[...document.querySelectorAll('#review59 .panel')];const i=ps.indexOf(a);return {i,n:ps.length,next:(ps[i+1]||{}).textContent?ps[i+1].textContent.slice(0,6):''}})()""")
    ok(pos['i']>=0 and pos['next'].startswith('왼쪽 메뉴'),f'[{W}] 왼쪽 메뉴 칸 바로 앞에 있음',pos)
    # 6) 폰에서 가로 넘침 없음
    ov=J(pg,"""(()=>{const p=document.querySelector('.pf100');return p?p.scrollWidth-p.clientWidth:-1})()""")
    ok(ov<=1,f'[{W}] 칸이 가로로 안 넘침',ov)

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
