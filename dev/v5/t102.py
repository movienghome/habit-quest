# t102 (v9.9): 지운 카드 되살아남 막기(묘비) · D8 경보판 연쇄 창 · D9 용기 고르기 · D10 홈 오늘 타임라인
import sys,json
sys.path.insert(0,'/home/claude/habit-quest/dev/v5')
from h61 import *
fails=[]
def ok(name,cond,extra=''):
    print(('PASS' if cond else 'FAIL'),name,('· '+str(extra)) if extra!='' else '')
    if not cond: fails.append(name)
def ev(pg,js,*a):return pg.evaluate(js,*a)

with sync_playwright() as pw:
    b,pg=run(pw,W=1400,H=900)
    pg.wait_for_timeout(1500)

    # ---- 1) 한 번짜리 정리: 안 쓰기로 한 기본 카드 4개 ----
    names=ev(pg,"()=>C.actions.map(a=>a.name)")
    ids=ev(pg,"()=>C.actions.map(a=>a.id)")
    for n in ['영화 리뷰·인터뷰 영상 한 편만','시트콤·예능 한 편 (끝나면 끄기)','화면 없이 천천히 먹기','소리 끄고 창밖 보기']:
        ok('정리됨: '+n, n not in names)
    ok('팟캐스트·라디오 틀고 먹기는 그대로(안 지움)', '팟캐스트·라디오 틀고 먹기' in names)
    ok('다른 기본 카드는 그대로(찬물 세수)', '찬물 세수' in names)
    ok('mig98 표시', ev(pg,"()=>C.mig98===1"))
    ok('묘비 기록', ev(pg,"()=>(C.delA||[]).length")>=4, ev(pg,"()=>JSON.stringify((C.delA||[]).map(t=>t.id))"))
    # 설정 정리(normConfig)를 거쳐도 묘비·표시가 남음
    ok('normConfig가 delA·mig98 보존', ev(pg,"()=>{const c=normConfig(JSON.parse(JSON.stringify(C)));return (c.delA||[]).length===(C.delA||[]).length&&c.mig98===1}"))

    # ---- 2) 되살아남 막기 ----
    # (a) 합치기로 묘비 있는 카드가 다시 들어와도 렌더 때 지워짐
    ev(pg,"()=>{C.actions.push({id:'dm77b',name:'영화 리뷰·인터뷰 영상 한 편만',type:'good',area:'mind',cond:1,gold:0,xp:2,dopa:'meal',dopaOnly:1});render()}")
    pg.wait_for_timeout(300)
    ok('옛 사본이 되살린 카드(dm77b)가 다시 지워짐', 'dm77b' not in ev(pg,"()=>C.actions.map(a=>a.id)"))
    # (b) 같은 이름의 기본 카드가 다른 id로 다시 생겨도(dq…) 지워짐
    ev(pg,"()=>{C.actions.push({id:'dqzz9999',name:'소리 끄고 창밖 보기',type:'good',area:'mind',cond:1,gold:0,xp:2,dopa:'rest',dopaOnly:1});render()}")
    pg.wait_for_timeout(300)
    ok('같은 이름 기본 카드(dq…)가 다시 생겨도 지워짐', '소리 끄고 창밖 보기' not in ev(pg,"()=>C.actions.map(a=>a.name)"))
    # (c) 내가 만든 같은 이름 카드는 안 건드림
    ev(pg,"()=>{C.actions.push({id:'mine_1',name:'소리 끄고 창밖 보기',type:'good',area:'mind',cond:1,gold:0,xp:2});render()}")
    pg.wait_for_timeout(300)
    ok('직접 만든 같은 이름 카드는 남음', 'mine_1' in ev(pg,"()=>C.actions.map(a=>a.id)"))
    ev(pg,"()=>{C.actions=C.actions.filter(a=>a.id!=='mine_1');render()}")
    # (d) 식사 친구 코스가 없어진 뒤 '다시 추천'이 돌아도 지운 카드를 안 넣음
    added=ev(pg,"()=>{C.dopaCourses=(C.dopaCourses||[]).filter(c=>c.id!=='meal');const a=mealEnsure77();render();return a}")
    ok('다시 추천(mealEnsure77)이 지운 카드를 안 넣음', len(added)==0, added)
    ok('코스 다시 추천 뒤에도 4개 없음', not any(n in ev(pg,"()=>C.actions.map(a=>a.name)") for n in ['영화 리뷰·인터뷰 영상 한 편만','시트콤·예능 한 편 (끝나면 끄기)','화면 없이 천천히 먹기']))
    # (e) 화면에서 지우면 묘비가 생기고, 되돌리면 묘비도 사라짐
    ev(pg,"()=>{window.__a=C.actions.find(a=>a.id==='g1')||C.actions.find(a=>a.type==='good'&&!/^(dq|dm77)/.test(a.id));window.__id=window.__a.id;delActs([window.__id])}")
    ok('지우면 묘비', ev(pg,"()=>C.delA.some(t=>t.id===window.__id)"))
    ok('지운 카드 없음', ev(pg,"()=>!C.actions.some(a=>a.id===window.__id)"))
    pg.evaluate("()=>{const b=[...document.querySelectorAll('#toast button')].find(x=>/되돌리기/.test(x.innerText));if(b)b.click()}")
    pg.wait_for_timeout(300)
    ok('되돌리면 카드가 돌아오고 묘비도 사라짐', ev(pg,"()=>C.actions.some(a=>a.id===window.__id)&&!C.delA.some(t=>t.id===window.__id)"))
    # (f) 되돌린 카드는 렌더 뒤에도 남음
    ev(pg,"()=>render()");pg.wait_for_timeout(200)
    ok('되돌린 카드가 다시 지워지지 않음', ev(pg,"()=>C.actions.some(a=>a.id===window.__id)"))

    # ---- 3) D8 경보판 ⛓ ----
    pg.evaluate("()=>{location.hash='home'}");pg.wait_for_timeout(500)
    ev(pg,"""()=>{const t=dateKey();for(let i=1;i<=3;i++){const k=addDays(t,-i),d=dayOf(k);d.entries=(d.entries||[]).concat([{id:'bad'+i,kind:'act',type:'bad',name:'야식 '+i,area:'body',cond:-3,xp:0,gold:0,t:'23:1'+i,aid:'zz'}])}render()}""")
    pg.wait_for_timeout(500)
    li=ev(pg,"()=>{const l=[...document.querySelectorAll('#alerts li.a98')];return l.map(x=>x.innerText.replace(/\\s+/g,' '))}")
    ok('경보판 ⛓ 줄이 눌러지는 줄이 됨', len(li)==1, li)
    ok('줄 글에 보상이 보임', len(li)==1 and 'XP' in li[0] and '3일째' in li[0], li)
    pg.click('#alerts li.a98');pg.wait_for_timeout(400)
    sh=ev(pg,"()=>(document.getElementById('sheetC')||{}).innerText||''")
    ok('창 제목', '나쁜 날 3일째' in sh)
    ok('왜 나쁜 날: 날짜별 나쁜 행동', '야식 1' in sh and '야식 2' in sh and '야식 3' in sh, sh[:200].replace('\n',' '))
    ok('페널티 배수가 보임', '페널티' in sh and '×' in sh)
    ok('보상이 보임', '흐름 끊기' in sh and 'XP' in sh)
    n0=ev(pg,"()=>(today().entries||[]).length")
    ok('창 안에 바로 할 것이 있음', ev(pg,"()=>document.querySelectorAll('#sheetC .c98k').length")>=1)
    pg.evaluate("()=>document.querySelector('#sheetC .c98k').click()");pg.wait_for_timeout(600)
    pg.evaluate("()=>{const t=document.getElementById('luOk');if(t&&t.offsetParent)t.click()}")
    ok('창에서 눌러 바로 기록됨', ev(pg,"()=>(today().entries||[]).length")>n0, ev(pg,"()=>(today().entries||[]).length"))

    # ---- 4) D9 용기 고르기 ----
    ev(pg,"""()=>{const a=C.actions.find(x=>x.type==='good'&&!x.brave&&!/^(dq|dm77)/.test(x.id)&&!(x.opts&&x.opts.length));window.__bc=a.id;a.brave='m';
      window.__bt=newTask({title:'용기 낼 전화 한 통',brave:1,bsz71:'m'});window.__btid=window.__bt.id;TASKS[window.__bt.id]=window.__bt;save('t:'+window.__bt.id);render()}""")
    pg.wait_for_timeout(500)
    go=ev(pg,"()=>[...document.querySelectorAll('#sugg [data-sugbrave] .go')].map(x=>x.textContent)")
    ok("'용기 칸 열기'가 '용기 고르기'로 바뀜", go==['용기 고르기'], go)
    pg.click('#sugg [data-sugbrave]');pg.wait_for_timeout(400)
    sh=ev(pg,"()=>(document.getElementById('sheetC')||{}).innerText||''")
    ok('용기 고르기 창이 열림', '용기 고르기' in sh)
    ok('용기 붙은 할 일이 보임', '용기 낼 전화 한 통' in sh, sh[:160].replace('\n',' '))
    ok('용기 카드가 보임', ev(pg,"()=>C.actions.find(a=>a.id===window.__bc).name") in sh)
    ok('용기 안 붙은 카드는 안 보임', '채소 한 번 먹기' not in sh)
    pg.evaluate("()=>document.querySelector('#sheetC [data-c98t]').click()");pg.wait_for_timeout(600)
    pg.evaluate("()=>{const t=document.getElementById('luOk');if(t&&t.offsetParent)t.click()}")
    ok('할 일을 골라 끝냄', ev(pg,"()=>TASKS[window.__btid].status!==0"), ev(pg,"()=>TASKS[window.__btid].status"))
    pg.click('#sugg [data-sugbrave]');pg.wait_for_timeout(300)
    n1=ev(pg,"()=>(today().entries||[]).length")
    pg.evaluate("()=>document.querySelector('#sheetC [data-c98a]').click()");pg.wait_for_timeout(600)
    pg.evaluate("()=>{const t=document.getElementById('luOk');if(t&&t.offsetParent)t.click()}")
    ok('용기 카드를 골라 기록', ev(pg,"()=>(today().entries||[]).length")>n1, ev(pg,"()=>(today().entries||[]).length"))
    pg.evaluate("()=>closeSheet()")

    # ---- 5) D10 홈 오늘 타임라인 ----
    fid=ev(pg,"()=>{const f=C.food.find(x=>x.kind==='counter'&&x.points>0);return f&&f.id}")
    fname=ev(pg,"()=>{const f=C.food.find(x=>x.kind==='counter'&&x.points>0);return f&&f.name}")
    print('식사 항목',fid,fname)
    for i in range(3):
        pg.evaluate("(id)=>document.querySelector('[data-food=\"'+id+'\"][data-d=\"1\"]').click()",fid);pg.wait_for_timeout(250)
    pg.evaluate("()=>{location.hash='home'}");pg.wait_for_timeout(500)
    ok('식사 칸 3번 → 시각 기록 3개', ev(pg,"()=>(curDay().ft98||[]).length")==3)
    ev(pg,"()=>{LOGALL98=true;homeLog98()}")
    rows=ev(pg,"(n)=>[...document.querySelectorAll('#homeLog li.ft98')].filter(l=>l.innerText.includes(n)).map(l=>l.innerText.replace(/\\s+/g,' '))",fname)
    ok('같은 식사 항목이 세 줄(두 번째부터도)', len(rows)==3, rows)
    ok('n번째 표시', any('3번째' in r for r in rows) and any('2번째' in r for r in rows), rows)
    pg.evaluate("(id)=>document.querySelector('[data-food=\"'+id+'\"][data-d=\"-1\"]').click()",fid);pg.wait_for_timeout(300)
    rows_after=rows
    ev(pg,"()=>{LOGALL98=false;homeLog98()}")
    ok('−를 누르면 마지막 줄이 빠짐', ev(pg,"()=>(curDay().ft98||[]).length")==2)
    # 개수 제한 + 더 보기
    tot=ev(pg,"()=>document.querySelectorAll('#homeLog li').length")
    ok('8줄까지 + 더 보기', ev(pg,"()=>document.querySelectorAll('#homeLog li:not(.more98)').length")<=8, tot)
    ok('같은 분 안에서도 3→2→1번째 순서', [int(r.split('번째')[0].split()[-1]) for r in rows_after] ==sorted([int(r.split('번째')[0].split()[-1]) for r in rows_after],reverse=True), rows_after)
    ev(pg,"()=>{const d=curDay();for(let i=0;i<10;i++)d.entries.push({id:'ft'+i,kind:'free',type:'good',name:'테스트 기록 '+i,xp:1,gold:0,cond:0,t:'07:'+String(10+i)});render()}")
    pg.wait_for_timeout(300)
    ok('줄이 많으면 8줄 + 더 보기', ev(pg,"()=>document.querySelectorAll('#homeLog li:not(.more98)').length")==8 and ev(pg,"()=>!!document.querySelector('#homeLog li.more98')"))
    closepops(pg);pg.click('#homeLog [data-c98more]');pg.wait_for_timeout(250)
    ok('더 보기를 누르면 전부 보임', ev(pg,"()=>document.querySelectorAll('#homeLog li:not(.more98)').length")>=12, ev(pg,"()=>document.querySelectorAll('#homeLog li:not(.more98)').length"))
    closepops(pg);pg.click('#homeLog [data-c98more]');pg.wait_for_timeout(250)
    ok('접기를 누르면 다시 8줄', ev(pg,"()=>document.querySelectorAll('#homeLog li:not(.more98)').length")==8)
    # 새로고침(저장 경로)을 거쳐도 시각 기록이 남음
    ok('normDay가 ft98 보존', ev(pg,"()=>{const d=normDay(curDay().date,JSON.parse(JSON.stringify(curDay())));return (d.ft98||[]).length===(curDay().ft98||[]).length}"))
    # 편집·삭제 같은 기록이 타임라인에 끼지 않음(항상 진짜 기록만)
    ok('홈 타임라인에 편집 글자 없음', not ev(pg,"()=>/삭제했|추가했|편집/.test(document.getElementById('homeLog').innerText)"))

    ok('콘솔 오류 없음', len(errs)==0, errs[:3])
    b.close()
print('FAILS',len(fails),fails)
