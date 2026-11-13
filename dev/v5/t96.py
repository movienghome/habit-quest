# v9.4 시험 — 내일 짜기(K1)
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra) if extra!='' else ''))
    if not c:FAILS.append(msg)
SEED="""(()=>{const td=midKey68(),tom=addDays(td,1);
  const mk=(title,o)=>{const t=newTask({title});Object.assign(t,o||{});saveTask(t);return t.id};
  window.__ids={fx:mk('하그둘 만남',{due:tom,list:'fixed'}),fxt:mk('치과',{due:tom,list:'fixed',time:'10:00',dur:60}),
    wk:mk('시나리오 쓰기',{due:addDays(td,6),rep:{f:'x',n:5,i:1},dur:25}),
    ad:mk('은행 가기',{due:tom,dur:30}),ad2:mk('메일 정리',{due:tom,dur:20}),
    care:mk('욕실 청소',{due:td,rep:{f:'d',i:7},care76:1,dur:30})};
  window.__reset=1;render();return window.__ids})()"""
with sync_playwright() as pw:
    for W,H in ((390,844),(1400,900)):
        b,pg=run(pw,W,H);closepops(pg);errs.clear()
        ids=pg.evaluate("()=>"+SEED);pg.wait_for_timeout(500);tag=f'[{W}] '
        pg.evaluate("()=>{location.hash='#home';render()}");pg.wait_for_timeout(500)
        ok(pg.locator('.n93').count()>=1,tag+'밤 시각 이후 홈 오늘 칸에 내일 짜기 줄',pg.evaluate("()=>new Date().toString().slice(16,24)"))
        pg.evaluate("()=>planSheet80()");pg.wait_for_timeout(400)
        ok(pg.locator('#sheetC .w93dots').count()==1,tag+'planSheet80() → 내일 짜기 화면')
        txt=pg.inner_text('#sheetC')
        ok('하그둘 만남' in txt and '치과' in txt,tag+'정해진 일정 단계: 시각 없는 fixed + 깔린 일정',txt[:160].replace('\n',' | '))
        # 시각 정하기
        pg.fill("#sheetC input[data-w93tm]",'15:00');pg.wait_for_timeout(500)
        st=pg.evaluate("(i)=>{const t=TASKS[i.fx];return [t.time,t.dur]}",ids)
        ok(st[0]=='15:00',tag+'정해진 일정에 시각 적용',st)
        # 다음 단계(주 N회)
        pg.click("#sheetC [data-w93nav='1']");pg.wait_for_timeout(300)
        ok('시나리오 쓰기' in pg.inner_text('#sheetC'),tag+'주 N회 단계에 시나리오')
        pg.click("#sheetC [data-w93add]");pg.wait_for_timeout(500)
        sl=pg.evaluate("(i)=>{const k=addDays(midKey68(),1);return TASKS[i.wk].sl91&&TASKS[i.wk].sl91[k]}",ids)
        ok(bool(sl),tag+'내일 자리가 빈 시간에 놓임',sl)
        ok(sl not in ('10:00','15:00'),tag+'정해진 일정과 안 겹침',sl)
        pg.click("#sheetC [data-w93nav='1']");pg.wait_for_timeout(300)
        ok('은행 가기' in pg.inner_text('#sheetC'),tag+'종일 칸 단계')
        pg.click("#sheetC [data-w93auto]");pg.wait_for_timeout(500)
        tm=pg.evaluate("(i)=>[TASKS[i.ad].time,TASKS[i.ad2].time]",ids)
        ok(all(tm) and tm[0]!=tm[1],tag+'알아서 넣기: 둘 다 시각, 겹치지 않음',tm)
        pg.click("#sheetC [data-w93u]");pg.wait_for_timeout(400)
        ok(pg.evaluate("(i)=>!TASKS[i.ad].time&&!TASKS[i.ad2].time",ids),tag+'되돌리기')
        pg.click("#sheetC [data-w93auto]");pg.wait_for_timeout(400)
        pg.click("#sheetC [data-w93nav='1']");pg.wait_for_timeout(300)
        ok('욕실 청소' in pg.inner_text('#sheetC'),tag+'관리 단계')
        pg.click("#sheetC [data-w93nav='1']");pg.wait_for_timeout(300)
        ok('하루 예산' in pg.inner_text('#sheetC') and pg.locator('[data-w93fin]').count()==1,tag+'마무리: 놓은 시간/하루 예산 + 끝 단추')
        pg.click("[data-w93fin]");pg.wait_for_timeout(600)
        ok(pg.evaluate("()=>!!C.tm93done[addDays(midKey68(),1)]"),tag+'내일 짜기 끝 기록')
        pg.evaluate("()=>{location.hash='#home';render()}");pg.wait_for_timeout(400)
        ok(pg.locator('.n93').count()==0,tag+'끝낸 밤엔 홈 줄 없음')
        ok(pg.evaluate("()=>planSheet80(addDays(midKey68(),1))||true") and pg.locator('#sheetC .p80b').count()>=1 and pg.locator('#sheetC .w93dots').count()==0,tag+'날짜를 주면 예전 시간표 짜기 화면')
        ok(not [e for e in errs if '93' in str(e) or 'PAGEERR' in str(e)],tag+'오류 없음',errs[:2])
        b.close()
print('FAILS',len(FAILS))
