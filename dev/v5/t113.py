# t113 (v11.0): 캘린더·홈 묶음 — 🥐 아침·🍪 간식 칸(N18) · 일정 보기 끝낸 줄 목록 이름·색(N16) · 홈 2단 굳음 방지(N17)
# 사용자가 실제로 누르는 경로로(식단표 ⚙ 체크 → 시간표 블록 → 메뉴 적기 → 끝내기 → 끄기). 폰(390)·PC(1200) 둘 다.
# 옛 빌드와 비교: HQURL=http://localhost:8766/beta/index.html python3 t113.py (옛 빌드에선 N18·N16 시험이 떨어져야 정상)
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
J=lambda pg,x:pg.evaluate(x)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
def notoast(pg):J(pg,"(()=>{const t=document.getElementById('toast');if(t){t.classList.remove('on');t.style.pointerEvents=''}})()")
def meals(pg):
    return json.loads(J(pg,"JSON.stringify(Object.values(TASKS).filter(t=>t.ml80).map(t=>({id:t.id,s:t.ms80,d:t.md80,title:t.title,time:t.time,dur:t.dur,st:t.status})).sort((a,b)=>a.id<b.id?-1:1))"))
def cfg(pg):return json.loads(J(pg,"JSON.stringify(C.meal80)"))
def inputs(pg):return json.loads(J(pg,"JSON.stringify([...document.querySelectorAll('#sheetC .m80r')].map(r=>r.querySelectorAll('input[data-m80]').length))"))
with sync_playwright() as pw:
  for W,H in [(390,800),(1200,800)]:
    # ================= N18 아침·간식 =================
    b,pg=run(pw,W=W,H=H);notoast(pg)
    J(pg,"mealSheet80(midKey68());render()");pg.wait_for_timeout(600);notoast(pg)
    ms=meals(pg);ok(len(ms)>=12 and all(m['s'] in ('l','d') for m in ms),f'[{W}] 기본은 점심·저녁 블록만(아침·간식 없음)',len(ms))
    c=cfg(pg);ok((c.get('b') or {}).get('on')==0 and (c.get('s') or {}).get('on')==0,f'[{W}] 아침·간식은 기본 꺼짐',{k:c.get(k) for k in 'bs'})
    ok(set(inputs(pg))=={2},f'[{W}] 식단표 칸은 한 줄에 점심·저녁 둘',inputs(pg))
    J(pg,"document.querySelector('#sheetC .m80s').open=true")
    ok(J(pg,"!!document.querySelector('#sheetC [data-m80c=\"b:on\"]')&&!!document.querySelector('#sheetC [data-m80c=\"s:on\"]')"),f'[{W}] ⚙에 🥐 아침·🍪 간식 넣기 체크칸')
    ok(not J(pg,"!!document.querySelector('#sheetC [data-m80c=\"bt\"]')"),f'[{W}] 꺼져 있으면 시간·길이 칸은 안 보임(공간)')
    # 아침 켜기
    pg.click('#sheetC [data-m80c="b:on"]',timeout=3000) if J(pg,"!!document.querySelector('#sheetC [data-m80c=\"b:on\"]')") else None;pg.wait_for_timeout(700);notoast(pg)
    bs=[m for m in meals(pg) if m['s']=='b']
    ok(len(bs)>=6 and all(m['time']=='08:00' and m['dur']==20 and m['title'].startswith('🥐 아침') for m in bs),f'[{W}] 아침 블록이 7일치(오늘 시간 지났으면 내일부터) 08:00 20분',(len(bs),bs[:1]))
    ok(J(pg,"!!document.querySelector('#sheetC .m80s[open]')"),f'[{W}] 켠 뒤에도 ⚙가 열려 있음(다시 안 눌러도 됨)')
    ok(set(inputs(pg))=={3} and J(pg,"document.querySelector('#sheetC .m80r').classList.contains('nx')"),f'[{W}] 식단표 칸이 아침·점심·저녁 셋',inputs(pg))
    ok(J(pg,"!!document.querySelector('#sheetC [data-m80c=\"bt\"]')&&!!document.querySelector('#sheetC [data-m80c=\"bm\"]')"),f'[{W}] 켜면 시간·길이 칸이 나옴')
    # 간식 켜기
    pg.click('#sheetC [data-m80c="s:on"]');pg.wait_for_timeout(700);notoast(pg)
    ss=[m for m in meals(pg) if m['s']=='s']
    ok(len(ss)>=6 and all(m['time']=='16:00' and m['dur']==15 and m['title'].startswith('🍪 간식') for m in ss),f'[{W}] 간식 블록 16:00 15분',(len(ss),ss[:1]))
    ok(set(inputs(pg))=={4},f'[{W}] 식단표 칸이 네 개(아침·점심·간식·저녁)',inputs(pg))
    # 줄이 폰 폭에서 가로로 넘치지 않음
    ov=J(pg,"(()=>{const s=document.getElementById('sheetC');return [s.scrollWidth,s.clientWidth]})()")
    ok(ov[0]<=ov[1]+1,f'[{W}] 식단표 창이 가로로 안 넘침',ov)
    pg.screenshot(path=f'/tmp/t113_meal_{W}.png')
    # 아침 시간 바꾸기 → 안 끝낸 아침 블록 시각이 따라 바뀜
    J(pg,"(()=>{const i=document.querySelector('#sheetC [data-m80c=\"bt\"]');i.value='07:30';i.dispatchEvent(new Event('change',{bubbles:true}))})()");pg.wait_for_timeout(500);notoast(pg)
    bs=[m for m in meals(pg) if m['s']=='b'];ok(all(m['time']=='07:30' for m in bs),f'[{W}] 아침 시간을 바꾸면 블록이 따라감',bs[:1])
    # 메뉴 적기 → 블록 이름
    J(pg,"(()=>{const i=[...document.querySelectorAll('#sheetC [data-m80$=\"|b\"]')].find(x=>!x.closest('.m80r.past')&&x.dataset.m80.split('|')[0]>midKey68())||document.querySelector('#sheetC [data-m80$=\"|b\"]');window.__mk=i.dataset.m80;i.value='토스트';i.dispatchEvent(new Event('change',{bubbles:true}))})()");pg.wait_for_timeout(500);notoast(pg)
    k=J(pg,"window.__mk").split('|')[0];t=[m for m in meals(pg) if m['s']=='b' and m['d']==k]
    ok(t and t[0]['title']=='🥐 아침 · 토스트',f'[{W}] 메뉴를 적으면 블록 이름에 붙음',t[:1])
    # 캘린더·내일 짜기에 보임
    J(pg,"closeSheet();location.hash='cal';render()");pg.wait_for_timeout(500);J(pg,"(()=>{const k=addDays(midKey68(),1);ui.calAnchor=k;C.ui.cal.mode='1day';save('config');renderCal()})()");pg.wait_for_timeout(700);notoast(pg)
    ok(J(pg,"[...document.querySelectorAll('#calMain .blk')].some(x=>/🥐 아침/.test(x.textContent))"),f'[{W}] 캘린더(1일)에 🥐 아침 블록')
    ok(J(pg,"[...document.querySelectorAll('#calMain .blk')].some(x=>/🍪 간식/.test(x.textContent))"),f'[{W}] 캘린더(1일)에 🍪 간식 블록')
    J(pg,"planSheet80(addDays(midKey68(),1))");pg.wait_for_timeout(500)
    ok(J(pg,"document.querySelectorAll('#sheetC .p80f.ml').length")>=4,f'[{W}] 시간표 짜기 \'정해진 것\'에 네 끼니',J(pg,"document.querySelectorAll('#sheetC .p80f.ml').length"))
    J(pg,"closeSheet();planSheet80()");pg.wait_for_timeout(700)
    ok(J(pg,"/아침/.test(document.getElementById('sheetC').innerText)||/아침/.test(document.body.innerText)"),f'[{W}] 내일 짜기 화면에도 아침 블록이 정해진 일정으로 보임')
    J(pg,"closeSheet()");notoast(pg)
    # 끝내기 → 먹었어요
    J(pg,"(()=>{const k=addDays(midKey68(),1);completeTask(TASKS['ml80_'+k+'_b'])})()");pg.wait_for_timeout(400)
    ok(J(pg,"(()=>{const t=document.getElementById('toast');return /🥐 아침 먹었어요/.test(t?t.innerText:'')})()"),f'[{W}] 끝내면 \'🥐 아침 먹었어요\' 알림')
    ok(J(pg,"TASKS['ml80_'+addDays(midKey68(),1)+'_b'].status")==2,f'[{W}] 아침 블록 끝남(점수 없음)')
    # 끄기 → 안 끝낸 아침 블록은 지워지고 끝낸 건 남음, 다시 안 만들어지고 건너뛴 목록(no)도 안 더럽힘
    J(pg,"mealSheet80(midKey68(),1)");pg.wait_for_timeout(300)
    pg.click('#sheetC [data-m80c="b:on"]');pg.wait_for_timeout(700);notoast(pg)
    bs=[m for m in meals(pg) if m['s']=='b'];c=cfg(pg)
    ok(len(bs)==1 and bs[0]['st']==2,f'[{W}] 끄면 안 한 아침 블록은 지워지고 끝낸 것만 남음',[(m['d'],m['st']) for m in bs])
    ok(not any('_b' in x for x in c['no']),f'[{W}] 끄기가 건너뛴 끼니 목록(no)을 더럽히지 않음',c['no'])
    J(pg,"render()");pg.wait_for_timeout(300)
    ok(len([m for m in meals(pg) if m['s']=='b'])==1,f'[{W}] 다시 그려도 아침 블록이 다시 안 생김')
    ok(len([m for m in meals(pg) if m['s']=='s'])>=6,f'[{W}] 간식은 그대로 켜짐')
    # 사용자가 간식 블록 하나를 지우면 그 끼니만 다시 안 만듦
    J(pg,"(()=>{const k=addDays(midKey68(),2);deleteTask('ml80_'+k+'_s');render()})()");pg.wait_for_timeout(400)
    ok(not J(pg,"!!TASKS['ml80_'+addDays(midKey68(),2)+'_s']") and any('_s' in x for x in cfg(pg)['no']),f'[{W}] 간식 블록을 지우면 그 끼니만 다시 안 만듦')
    ok(errs==[],f'[{W}] 오류 없음(N18)',errs[:3]);errs.clear();b.close()

    # ---- 옛 설정(아침·간식 키 없음)도 그대로 ----
    b,pg=run(pw,W=W,H=H,pre="window.__old=1;")
    J(pg,"C.meal80={on:1,l:{t:'12:00',m:30},d:{t:'19:00',m:60},menu:{},no:[]};save('config');render()");pg.wait_for_timeout(600);notoast(pg)
    ms=meals(pg);c=cfg(pg)
    ok(all(m['s'] in ('l','d') for m in ms) and any(m['time']=='12:00' and m['dur']==30 for m in ms) and any(m['time']=='19:00' and m['dur']==60 for m in ms),f'[{W}] 옛 설정(점심 12:00·저녁 19:00)이 그대로 유지',ms[:2])
    ok((c.get('b') or {}).get('on')==0 and (c.get('s') or {}).get('on')==0 and c['l']['t']=='12:00',f'[{W}] 옛 설정에 아침·간식 칸만 꺼진 채 보충',{k:c.get(k) for k in 'bsl'})
    ok(errs==[],f'[{W}] 오류 없음(옛 설정)',errs[:3]);errs.clear();b.close()

    # ================= N16 일정 보기 끝낸 줄 =================
    b,pg=run(pw,W=W,H=H);notoast(pg)
    J(pg,"""(()=>{const td=midKey68(),mk=(title,o)=>{const t=newTask({title,list:o.list});Object.assign(t,o);saveTask(t);return t};
      const a=mk('끝낸 리멘',{list:'Llimen',due:td}),c=mk('끝낸 아틀리에',{list:'Latelier',due:td}),d=mk('열린 일',{list:'Llimen',due:td});
      completeTask(TASKS[a.id]);completeTask(TASKS[c.id]);window.__ids=[a.id,c.id];location.hash='cal';render()})()""")
    pg.wait_for_timeout(600);J(pg,"C.ui.cal.mode='agenda';save('config');renderCal()");pg.wait_for_timeout(700);notoast(pg)
    nd=J(pg,"(()=>{const q=CAL77;CAL77=1;try{return doneOn(midKey68()).length}finally{CAL77=q}})()")
    if not nd:ok(True,f'[{W}] (새벽 0~5시: 오늘 끝낸 기록이 어제 점수 날짜라 일정 보기에 안 나옴 — 기존 동작, N16 시험 건너뜀)')
    else:
        rows=json.loads(J(pg,"JSON.stringify([...document.querySelectorAll('#calMain .agenda .trow.done')].map(r=>({c:r.className,t:r.querySelector('.tt').textContent.trim(),m:(r.querySelector('.tm')||{innerText:''}).innerText,id:r.dataset.ctask||'',bl:getComputedStyle(r).borderLeftWidth,dec:getComputedStyle(r.querySelector('.tt')).textDecorationLine,op:getComputedStyle(r).opacity})))"))
        ok(len(rows)==2 and all('d109' in r['c'] for r in rows),f'[{W}] 일정 보기: 오늘 끝낸 줄 둘이 목록 표시를 받음',rows)
        ok(any('Limen' in r['m'] for r in rows) and any('Atelier' in r['m'] for r in rows),f'[{W}] 줄 아래에 목록 이름(색에만 기대지 않음)',[r['m'] for r in rows])
        ok(all(r['bl']=='4px' and r['dec']=='line-through' and r['op']=='1' for r in rows),f'[{W}] 목록 색 띠 · 취소선 · 흐리지 않음',[(r['bl'],r['dec'],r['op']) for r in rows])
        ok(rows and rows[0]['id'] in J(pg,"window.__ids"),f'[{W}] 줄이 할 일에 이어져 있음(누르면 열림)',rows[0]['id'] if rows else '')
        pw_=J(pg,"(()=>{const a=document.querySelector('#calMain .agenda').getBoundingClientRect();return [Math.round(a.right),innerWidth]})()")
        ok(pw_[0]<=pw_[1],f'[{W}] 일정 보기가 화면 폭 안에 들어옴(오른쪽 +XP가 안 잘림)',pw_)
        pg.screenshot(path=f'/tmp/t113_agenda_{W}.png')
        pg.click(f'#calMain .agenda .trow.done[data-ctask="{rows[0]["id"]}"] .tb');pg.wait_for_timeout(500)
        ok(J(pg,"!!document.getElementById('sheetC')&&document.getElementById('sheetC').offsetParent!==null&&document.getElementById('sheetC').innerText.length>10"),f'[{W}] 끝낸 줄을 누르면 할 일 창이 열림')
        J(pg,"closeSheet()");notoast(pg)
        # 거르기 적용: Limen만 → 아틀리에 끝낸 줄 사라짐
        J(pg,"C.calf77={lists:['Llimen'],areas:[],tags:[],kinds:[],inv:0,known:['inbox',...C.lists.map(l=>l.id)]};save('config');render()");pg.wait_for_timeout(600)
        rows=json.loads(J(pg,"JSON.stringify([...document.querySelectorAll('#calMain .agenda .trow.done')].map(r=>r.querySelector('.tt').textContent.trim()))"))
        ok(rows==['끝낸 리멘'],f'[{W}] 일정 보기에서도 보이기·숨기기가 끝낸 줄에 적용',rows)
    ok(errs==[],f'[{W}] 오류 없음(N16)',errs[:3]);errs.clear();b.close()

    # ================= N17 홈 2단 굳음 방지 =================
    b,pg=run(pw,W=W,H=H);notoast(pg)
    r=json.loads(J(pg,"""JSON.stringify((()=>{const g=$('homeGrid'),r={};g.classList.add('two');HW77=690;r.a=homeTwo();HW77=670;r.b=homeTwo();g.classList.remove('two');HW77=690;r.c=homeTwo();HW77=705;r.d=homeTwo();g.classList.remove('two');HW77=0;return r})())"""))
    ok(r=={'a':True,'b':False,'c':False,'d':True},f'[{W}] 경계 판단: 2단이면 680까지 버팀 · 1단이면 700 넘어야 2단',r)
    ok(errs==[],f'[{W}] 오류 없음(N17)',errs[:3]);errs.clear();b.close()
  # 창 크기를 줄였다 늘렸다 해도 1단/2단이 맞게 따라옴(PC)
  b,pg=run(pw,W=1400,H=900);notoast(pg)
  J(pg,"location.hash='home';render()");pg.wait_for_timeout(500)
  two=lambda:J(pg,"$('homeGrid').classList.contains('two')")
  ok(two(),'창 1400: 홈 2단')
  pg.set_viewport_size({'width':390,'height':800});pg.wait_for_timeout(700);ok(not two(),'창 390으로 줄이면 1단')
  pg.set_viewport_size({'width':1400,'height':900});pg.wait_for_timeout(700);ok(two(),'다시 1400으로 늘리면 2단')
  pg.set_viewport_size({'width':700,'height':900});pg.wait_for_timeout(700);ok(not two(),'창 700이면 1단(기존 동작 유지)')
  ok(errs==[],'오류 없음(창 크기)',errs[:3]);errs.clear();b.close()
print('FAILS',len(FAILS),FAILS)
