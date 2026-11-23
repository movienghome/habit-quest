exec(open('/home/claude/habit-quest/dev/v5/h61.py').read())
ok=[]
def chk(n,c):
    ok.append(bool(c));print(('PASS ' if c else 'FAIL ')+n)
def drag_to(pg,sel,tsel,dy=0):
    el=pg.locator(sel).first;tg=pg.locator(tsel).first
    bx=el.bounding_box();tb=tg.bounding_box()
    pg.mouse.move(bx['x']+bx['width']/2,bx['y']+bx['height']/2);pg.mouse.down();pg.mouse.move(bx['x']+bx['width']/2+8,bx['y']+bx['height']/2+8,steps=3)
    pg.mouse.move(tb['x']+tb['width']/2,tb['y']+min(tb['height']/2,60)+dy,steps=14);pg.wait_for_timeout(100);pg.mouse.up();pg.wait_for_timeout(800)
with sync_playwright() as pw:
    # ---- ① 끝낸 칩 끌기: 월 · 주 ----
    for mode in ['month','week']:
        b,pg=run(pw,W=1400,H=900);closepops(pg)
        J=lambda x:pg.evaluate(x)
        J("""(()=>{const t=newTask({title:'끝낸테스트'});t.due=midKey68();saveTask(t);window.__id=t.id;completeTask(t)})()""");pg.wait_for_timeout(600);closepops(pg)
        J("location.hash='cal'");pg.wait_for_timeout(700)
        J("(()=>{C.ui.cal.mode='%s';ui.calAnchor=midKey68();ui.calSel=midKey68();save('config');renderCal()})()"%mode);pg.wait_for_timeout(900)
        chk(mode+' 보기 모드',J("C.ui.cal.mode")==mode)
        chk(mode+' 끝낸 칩에 끌기 붙음',J("(()=>{const c=document.querySelector('.cchip.done.d84[data-ctask=\"'+window.__id+'\"]');return !!c&&/done105/.test(c.dataset.drag||'')})()"))
        if mode=='week':
            J("(()=>{const e=(DAYS[dateKey()].entries||[]).find(x=>x.tid===window.__id);moveEntry69(dateKey(),e.id,addDays(dateKey(),-1));ui.calAnchor=addDays(midKey68(),-1);renderCal()})()");pg.wait_for_timeout(900)
            yk=J("addDays(midKey68(),-2)");exp=yk
        else:
            yk=J("addDays(midKey68(),-1)");exp=yk
        try:
            drag_to(pg,'.cchip.done.d84[data-ctask]',('[data-drop="day:%s"]' if mode=='month' else '[data-drop="allday:%s"]')%yk)
        except Exception as e:
            print('drag err',e)
        chk(mode+' 다른 날로 옮겨짐',J("TASKS[window.__id].doneAt==='%s'"%exp))
        b.close()
    # ---- ② 끝낸 막대 크기 ----
    b,pg=run(pw,W=1100,H=900);closepops(pg)
    J=lambda x:pg.evaluate(x)
    J("""(()=>{const t=newTask({title:'며칠짜리 촬영'});t.due=midKey68();t.end71=addDays(midKey68(),3);saveTask(t);window.__id=t.id;C.ui=C.ui||{};C.ui.cal=Object.assign(C.ui.cal||{},{mode:'month'});ui.calAnchor=midKey68();location.hash='cal';save('config');render()})()""");pg.wait_for_timeout(900)
    M="""(()=>{const b=document.querySelector('.bar83');if(!b)return null;const r=b.getBoundingClientRect(),cs=getComputedStyle(b);return {h:r.height,w:r.width,bt:cs.borderTopWidth,bl:cs.borderLeftWidth,op:cs.opacity}})()"""
    o=J(M);J("completeTask(TASKS[window.__id])");pg.wait_for_timeout(900);closepops(pg);d=J(M)
    print(o,d)
    chk('끝낸 막대 높이 같음',o and d and abs(o['h']-d['h'])<0.6 and abs(o['w']-d['w'])<1.5)
    chk('끝낸 막대 위 테두리 없음·왼쪽 4px (v12.3: 안 한 칩과 같은 크기)',d and d['bt']=='0px' and d['bl']=='4px')
    chk('끝낸 막대 불투명',d and float(d['op'])>=0.95)
    b.close()
    # ---- ③ 칩 제목 · ④ 그 날 창 · ⑤ 하그둘 · 최소 ----
    b,pg=run(pw,W=1400,H=900);closepops(pg)
    J=lambda x:pg.evaluate(x)
    J("""(()=>{const a=newTask({title:'시나리오 쓰기'});a.rep={f:'x',n:3};a.due=midKey68();a.dur=30;a.aid='aidx';saveTask(a);window.__a=a.id;
      const h=newTask({title:'하그둘 만남'});h.rep={f:'x',n:1};h.due=midKey68();h.aid='aidx';saveTask(h);window.__h=h.id;
      C.mig120=0;location.hash='cal';render()})()""");pg.wait_for_timeout(1000)
    J("(()=>{C.ui.cal.mode='week';ui.calAnchor=midKey68();ui.calSel=midKey68();save('config');renderCal()})()");pg.wait_for_timeout(800)
    chk('이주: 목표 5·최소 3',J("TASKS[window.__a].rep.n===5&&TASKS[window.__a].min119===3"))
    txt=J("[...document.querySelectorAll('.wk91 .c91.k105[data-wk105]')].map(c=>c.textContent).join(' | ')")
    print(txt)
    chk('칩 제목에 하그둘 안 붙음',('시나리오 쓰기' in txt) and ('+' not in txt))
    chk('최소 표시',('최소3' in txt))
    chk('최소 표시 가로 칩 n/5',('/5' in txt))
    J("""(()=>{const t=TASKS[window.__a];const k=addDays(midKey68(),1);t.sl91={};t.sl91[k]='10:00';t.keep105=undefined;saveTask(t);window.__k=k;ui.calAnchor=k;ui.calSel=k;renderCal();render()})()""");pg.wait_for_timeout(900)
    chk('칸이 그려짐',pg.locator('.blk[data-ctask="%s"]'%J("window.__a")).count()>=1)
    pg.locator('.blk[data-ctask="%s"]'%J("window.__a")).first.click();pg.wait_for_timeout(600)
    chk('그 날 창 열림',pg.locator('#d120t').count()==1)
    pg.fill('#d120t','14:30');pg.fill('#d120l','75');pg.locator('[data-d120="save"]').click();pg.wait_for_timeout(700)
    chk('시각 저장',J("TASKS[window.__a].sl91[window.__k]==='14:30'"))
    chk('길이 저장',J("(TASKS[window.__a].sd119||{})[window.__k]===75"))
    chk('그 날 복사본 길이',J("(()=>{const x=tasksOn(window.__k).find(t=>t.id===window.__a);return !!x&&x.dur===75&&x.time==='14:30'})()"))
    # 다른 날 따로
    J("""(()=>{const t=TASKS[window.__a];const k2=addDays(window.__k,1);t.sl91[k2]='09:00';saveTask(t);window.__k2=k2;render()})()""")
    chk('다른 날 길이는 공통',J("(()=>{const x=tasksOn(window.__k2).find(t=>t.id===window.__a);return !!x&&x.dur===30})()"))
    # 하그둘
    J("daySheet120(window.__a,window.__k)");pg.wait_for_timeout(500)
    pg.locator('[data-d120="hg"]').click();pg.wait_for_timeout(900)
    chk('날 정함 빠짐',J("!(TASKS[window.__a].sl91&&TASKS[window.__a].sl91[window.__k]!==undefined)"))
    hid=J("Object.values(TASKS).find(t=>t.hg119===window.__a)&&Object.values(TASKS).find(t=>t.hg119===window.__a).id")
    chk('하그둘 고정 일정 생김',bool(hid) and J("(()=>{const h=Object.values(TASKS).find(t=>t.hg119===window.__a);return h.title==='하나 그리고 둘'&&h.list==='fixed'&&h.due===window.__k&&h.time==='14:30'&&h.dur===75})()"))
    chk('캘린더에 하그둘',J("document.body.innerText.includes('하나 그리고 둘')"))
    # 되돌리기
    J("hgBack120(Object.values(TASKS).find(t=>t.hg119===window.__a).id)");pg.wait_for_timeout(700)
    chk('되돌림: 날 정함 복귀',J("TASKS[window.__a].sl91&&TASKS[window.__a].sl91[window.__k]==='14:30'&&(TASKS[window.__a].sd119||{})[window.__k]===75"))
    chk('되돌림: 하그둘 없어짐',J("!Object.values(TASKS).some(t=>t.hg119===window.__a&&t.status===0)"))
    # 하그둘 끝내면 횟수 1
    J("hgMake120(window.__a,window.__k)");pg.wait_for_timeout(700)
    J("(()=>{const h=Object.values(TASKS).find(t=>t.hg119===window.__a&&t.status===0);h.due=midKey68();saveTask(h);completeTask(h)})()");pg.wait_for_timeout(800);closepops(pg)
    chk('하그둘 끝내면 주 횟수 1',J("wkCnt91(TASKS[window.__a],weekStart(midKey68()))>=1"))
    chk('하그둘 기록 만남 표시',J("(DAYS[dateKey()].entries||[]).some(e=>e.hg99)"))
    # 주 N회 창: 최소 ＋
    J("wkSheet105(window.__a)");pg.wait_for_timeout(500)
    chk('창에 최소 줄',pg.locator('[data-min120]').count()==2)
    pg.locator('[data-min120$=":-1"]').first.click();pg.wait_for_timeout(500)
    chk('최소 줄이기',J("TASKS[window.__a].min119===2"))
    b.close()
    errs_page=[e for e in errs if e.startswith('PAGEERR')]
    chk('페이지 오류 없음',len(errs_page)==0)
    if errs_page:print(errs_page[:3])
import sys;sys.exit(0 if all(ok) else 1)
