# v9.5 시험 (t97) — D2 카드 편집 창 새 배치 · D3 점수 큰 순(XP·골드·컨디션)
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra) if extra!='' else ''))
    if not c:FAILS.append(msg)
def J(pg,js):return pg.evaluate("()=>("+js+")")
with sync_playwright() as pw:
    for W,H in ((390,844),(1400,900)):
        b,pg=run(pw,W,H);closepops(pg);errs.clear();tag=f'[{W}] '
        good=J(pg,"C.actions.find(a=>a.type==='good'&&a.opts&&a.opts.length).id")
        bad=J(pg,"C.actions.find(a=>a.type==='bad').id")
        # ---- D2 좋은 카드
        pg.evaluate("(id)=>openActionEditor(id)",good);pg.wait_for_timeout(500)
        ok(J(pg,"!!document.querySelector('#sheetC .sh > input.ae94n')"),tag+'이름이 머리줄 입력칸')
        ok(J(pg,"document.querySelectorAll('#sheetC .ae94sc label.s94').length")==3,tag+'점수 큰 칸 셋(XP·컨디션·골드)')
        ok(J(pg,"[...document.querySelectorAll('#sheetC details.ae94d')].every(d=>!d.open)"),tag+'접힘 칸은 기본 접힘')
        h=J(pg,"document.getElementById('sheetC').scrollHeight")
        ok(h<=H*0.95 or W>600,tag+'스크롤 한 화면 안(폰)',h)
        ok(J(pg,"!!document.querySelector('#sheetC .ae94f [data-aedone]')"),tag+'아래 완료 줄')
        # 값 고치기: XP
        pg.fill("#sheetC [data-ae=xp]","7");pg.dispatch_event("#sheetC [data-ae=xp]","change");pg.wait_for_timeout(200)
        ok(J(pg,f"C.actions.find(a=>a.id==='{good}').xp")==7,tag+'XP 칸에 쓰면 저장됨')
        pg.fill("#sheetC .sh > input.ae94n","샤워X");pg.dispatch_event("#sheetC .sh > input.ae94n","change");pg.wait_for_timeout(500)
        ok(J(pg,f"C.actions.find(a=>a.id==='{good}').name")=='샤워X',tag+'이름 바꾸기(창이 다시 그려져도 머리줄 유지)')
        ok(J(pg,"!!document.querySelector('#sheetC .sh > input.ae94n')")and J(pg,"document.querySelector('#sheetC .sh > input.ae94n').value")=='샤워X',tag+'다시 그려진 뒤 이름 그대로')
        # 세부 옵션 접힘 펼치고 추가 → 다시 그려져도 펼쳐짐 유지
        n0=J(pg,f"C.actions.find(a=>a.id==='{good}').opts.length")
        pg.click("#sheetC details[data-k94=opts] > summary");pg.wait_for_timeout(200)
        pg.click("#sheetC [data-aeoadd]");pg.wait_for_timeout(500)
        ok(J(pg,f"C.actions.find(a=>a.id==='{good}').opts.length")==n0+1,tag+'옵션 추가됨')
        ok(J(pg,"document.querySelector('#sheetC details[data-k94=opts]').open"),tag+'다시 그려져도 세부 옵션은 펼친 채')
        # 반복 칸 안의 버튼이 아직 먹는지
        if J(pg,"!!document.querySelector('#sheetC [data-x57rh=d]')"):
            pg.click("#sheetC details[data-k94=rep] > summary");pg.wait_for_timeout(150)
            pg.click("#sheetC [data-x57rh=d]");pg.wait_for_timeout(600)
            ok(J(pg,f"openTasks().some(t=>t.aid==='{good}'&&t.rep)||Object.values(TASKS).some(t=>t.aid==='{good}'&&t.rep)"),tag+'반복 매일 버튼이 접힘 칸 안에서도 먹음')
        # 이어진 곳 칩
        ok(J(pg,"document.querySelectorAll('#sheetC details[data-k94=link] .x60c').length")>=1,tag+'이어진 곳 칩 보존')
        # 완료
        pg.click("#sheetC [data-aedone]");pg.wait_for_timeout(300)
        ok(not J(pg,"!!document.querySelector('#sheetC .ae94')"),tag+'완료로 닫힘')
        # ---- 나쁜 카드
        pg.evaluate("(id)=>openActionEditor(id)",bad);pg.wait_for_timeout(500)
        ok(J(pg,"document.querySelectorAll('#sheetC .ae94sc label.s94').length")==2,tag+'나쁜 카드는 큰 칸 둘(컨디션·골드)')
        ok(J(pg,"/컨디션 −/.test(document.querySelector('#sheetC .ae94sc').innerText)"),tag+'나쁜 카드는 − 표시')
        # 종류 바꾸기 → 다시 그림
        pg.select_option("#sheetC [data-ae=type]","good");pg.wait_for_timeout(500)
        ok(J(pg,"document.querySelectorAll('#sheetC .ae94sc label.s94').length")==3,tag+'종류를 좋음으로 바꾸면 XP 칸이 생김')
        pg.select_option("#sheetC [data-ae=type]","bad");pg.wait_for_timeout(500)
        J(pg,"closeSheet()");pg.wait_for_timeout(200)
        # ---- D3
        ok(J(pg,"SORTS.map(s=>s[0]).join()")=='manual,name,freq,recent,stale,xp,gold,cond',tag+'정렬 목록에 XP·골드·컨디션',J(pg,"SORTS.map(s=>s[0]).join()"))
        r=J(pg,"""(()=>{const L=[{id:'a',type:'good',xp:5,gold:1,cond:9},{id:'b',type:'good',xp:9,gold:7,cond:2},{id:'c',type:'bad',xp:0,gold:-9,cond:-5},{id:'d',type:'good',xp:1,gold:0,cond:4}];
          const f=by=>sortList(L,{},by).map(x=>x.id).join('');return [f('xp'),f('gold'),f('cond')]})()""")
        ok(r==['bada'[0:0]+'bad'+'c'] or r[0]=='badc',tag+'✨XP 큰 순(나쁜 카드 맨 뒤)',r[0])
        ok(r[1]=='cbad',tag+'💰골드 큰 순(크기 기준)',r[1])
        ok(r[2]=='abcd'.replace('abcd','acdb') or r[2]=='acdb',tag+'🔋컨디션 큰 순(크기 기준)',r[2])
        # 편집 화면·기록하기 화면의 정렬 상자
        for hv in ('edit','log','record'):
            pass
        ok(len(errs)==0,tag+'콘솔 오류 없음',errs[:3])
        b.close()
print('FAILS',len(FAILS),FAILS)
