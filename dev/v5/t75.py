# v7.5 시험: H 묶음 — 루틴 실행 중 되돌리기·단계 고치기 · 미니 창 단계 시간 · 목록 '오늘 한 단계' 칩 · 일부 = 일퀘 · 이번 기록 점수 직접 · 폰 캘린더 손잡이
# 사용자가 실제로 누르는 경로로. 옛 빌드와 비교: HQURL=http://localhost:8766/beta/index.html python3 t75.py
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
J=lambda pg,x:pg.evaluate(x)
SP='/tmp/claude-0/sp/'
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra) if extra!='' else ''))
    if not c:FAILS.append(msg)
def vis(pg,sel):return pg.locator(sel).locator('visible=true').first
def cnt(pg,sel):return pg.locator(sel).locator('visible=true').count()
def clk(pg,sel,w=500):
    if not cnt(pg,sel):return False
    vis(pg,sel).click();pg.wait_for_timeout(w);closepops(pg);return True
SETUP="""(()=>{const r=C.routines.find(x=>x.id==='r-morning');const h=rtH62(r,true);h.due=dateKey();h.rep={f:'d',i:1};saveTask(h);
  r.steps.forEach(s=>{const t=TASKS[s.tid];if(t){t.last=null;saveTask(t)}});C.ui.tfold[h.id]='o';location.hash='tasks';C.ui.tasks.sel='today';render();return h.id})()"""
ST="JSON.stringify(C.routines.find(x=>x.id==='r-morning').steps.map(s=>s.tid))"
NM="RUN.steps.map(s=>s.name).join('|')"
ENT="JSON.stringify((DAYS[dateKey()].entries||[]).filter(e=>e.tid).map(e=>e.tid))"
START="startRun({routine:C.routines.find(x=>x.id==='r-morning'),p71:1})"
with sync_playwright() as pw:
    # ================= 1) 루틴 실행 화면 (폰 크기) =================
    b,pg=run(pw,W=400,H=820);closepops(pg);pg.wait_for_timeout(300)
    hid=J(pg,SETUP);pg.wait_for_timeout(500);st=json.loads(J(pg,ST))
    J(pg,START);pg.wait_for_timeout(700)
    ok(cnt(pg,'#hunt [data-h75="back"]')==0,'첫 단계엔 ↶ 이전 없음')
    names0=J(pg,NM)
    pg.fill('#huntW','71.5');clk(pg,'[data-hunt="done"]',900)
    pg.wait_for_timeout(2200)                       # 2단계에서 2초 넘게
    clk(pg,'[data-hunt="done"]',900)
    ok(J(pg,"RUN.si")==2 and st[1] in J(pg,ENT),'두 단계 끝냄(2단계 기록 있음)')
    ok(cnt(pg,'#hunt [data-h75="back"]')==1,'실행 화면에 ↶ 이전 단추')
    bb=vis(pg,'#hunt .ctl').bounding_box();ok(bb and bb['height']<80,'폰: 아래 단추가 한 줄',bb and bb['height'])
    pg.screenshot(path=SP+'t75_hunt.png')
    clk(pg,'#hunt [data-h75="back"]',900)
    ok(J(pg,"RUN.si")==1 and J(pg,NM)==names0,'↶ 이전 → 2단계로 돌아감(순서 그대로)',J(pg,"RUN.si"))
    ok(st[1] not in J(pg,ENT) and J(pg,f"TASKS['{st[1]}'].last") is None,'그 단계 기록·오늘 함이 되돌려짐')
    ok(J(pg,"stepElapsed()")>=2,'시간은 이어서(2초 넘게 한 데서)',J(pg,"Math.round(stepElapsed())"))
    ok(J(pg,"RUN.log.length")==1,'로그도 한 칸 뒤로')
    clk(pg,'[data-hunt="done"]',900)
    ok(st[1] in J(pg,ENT) and J(pg,"RUN.si")==2,'다시 끝내면 다시 기록')
    # 단계 이름 누르기: 끝낸 단계 되돌리기(맨 끝이 아닌 것)
    clk(pg,'[data-hunt="done"]',900)                # 3단계(운동) 끝 → si 3
    clk(pg,'#hunt .steps [data-hs75="1"]',300)
    ok(cnt(pg,'#hunt .m75 [data-m75="redo:1"]')==1,'끝낸 단계 이름 → 되돌리고 다시 하기')
    pg.screenshot(path=SP+'t75_menu_past.png')
    clk(pg,'#hunt .m75 [data-m75="redo:1"]',900)
    nm=J(pg,NM).split('|')
    ok(J(pg,"RUN.si")==2 and J(pg,"RUN.steps[RUN.si].tid")==st[1],'가운데 단계 되돌리기 → 그 단계가 지금 단계',[J(pg,"RUN.si"),nm[:4]])
    ok(st[1] not in J(pg,ENT) and st[2] in J(pg,ENT),'그 단계 기록만 빠지고 다른 단계는 그대로')
    ok(J(pg,"RUN.steps[RUN.si+1].tid")==st[3],'하던 단계는 바로 다음 차례')
    clk(pg,'[data-hunt="done"]',900)
    # 아직 안 한 단계: 먼저 하기 · 오늘은 건너뛰기
    si=J(pg,"RUN.si");j=si+2;tj=J(pg,f"RUN.steps[{j}].tid")
    clk(pg,f'#hunt .steps [data-hs75="{j}"]',300)
    pg.screenshot(path=SP+'t75_menu_next.png')
    ok(cnt(pg,f'#hunt .m75 [data-m75="first:{j}"]')==1 and cnt(pg,f'#hunt .m75 [data-m75="skip:{j}"]')==1 and cnt(pg,f'#hunt .m75 [data-m75="del:{j}"]')==1,'아직 안 한 단계: 먼저 하기·오늘은 건너뛰기·빼기')
    clk(pg,f'#hunt .m75 [data-m75="first:{j}"]',600)
    ok(J(pg,"RUN.steps[RUN.si].tid")==tj and J(pg,"RUN.si")==si,'▶ 지금 이 단계 먼저')
    nxt=J(pg,"RUN.steps[RUN.si+1].tid")
    clk(pg,f'#hunt .steps [data-hs75="{si+1}"]',300);clk(pg,f'#hunt .m75 [data-m75="skip:{si+1}"]',400)
    ok(J(pg,f"!!RUN.steps[{si+1}].skip75"),'오늘은 건너뛰기 표시')
    clk(pg,'[data-hunt="done"]',900)
    ok(J(pg,"RUN.si")==si+2 and J(pg,"RUN.log[RUN.log.length-1].skip")==1 and nxt not in J(pg,ENT),'표시한 단계는 저절로 건너뜀(기록 없음)',J(pg,"RUN.si"))
    # 분 바꾸기
    si=J(pg,"RUN.si");tc=J(pg,"RUN.steps[RUN.si].tid");m0=J(pg,"+RUN.steps[RUN.si].min")
    clk(pg,f'#hunt .steps [data-hs75="{si}"]',300);clk(pg,f'#hunt .m75 [data-m75="min:{si}:5"]',400)
    r=json.loads(J(pg,f"JSON.stringify({{run:+RUN.steps[RUN.si].min,rt:+C.routines.find(x=>x.id==='r-morning').steps.find(s=>s.tid==='{tc}').min,t:+TASKS['{tc}'].dur}})"))
    ok(r['run']==m0+5 and r['rt']==m0+5 and r['t']==m0+5,'분 +5 → 실행·루틴·단계 할 일 다 바뀜',r)
    ok(cnt(pg,'#hunt .m75')==1,'분 바꾼 뒤 창은 그대로(이어서 누르기)')
    clk(pg,'#hunt .m75 [data-m75="x"]',200)
    # 단계 넣기: 앞으로도 / 오늘만
    n0=J(pg,"C.routines.find(x=>x.id==='r-morning').steps.length");l0=J(pg,"RUN.steps.length")
    clk(pg,'#hunt .steps [data-hs75="+"]',300)
    pg.screenshot(path=SP+'t75_add.png')
    pg.fill('#hAdd75','물 한 잔 3분');pg.keyboard.press('Enter');pg.wait_for_timeout(700)
    r=json.loads(J(pg,"JSON.stringify((()=>{const r=C.routines.find(x=>x.id==='r-morning'),s=RUN.steps[RUN.si+1],rs=r.steps.find(x=>x.id===s.id),t=rs&&TASKS[rs.tid];return{n:r.steps.length,l:RUN.steps.length,nm:s.name,min:s.min,t:t&&t.title,par:t&&t.parent,pos:r.steps.indexOf(rs)-r.steps.findIndex(x=>x.tid===RUN.steps[RUN.si].tid)}})())"))
    ok(r['n']==n0+1 and r['l']==l0+1 and r['t'] and '물 한 잔' in r['t'] and r['par']==hid and r['pos']==1,'＋ 앞으로도: 루틴에 단계(할 일)로 생기고 지금 단계 다음',r)
    ok(int(r['min'])==3,'이름의 "3분" = 단계 시간',r['min'])
    clk(pg,'#hunt .steps [data-hs75="+"]',300);pg.fill('#hAdd75','창문 닫기');pg.uncheck('#hKeep75');clk(pg,'#hunt .m75 [data-m75="add"]',600)
    ok(J(pg,"C.routines.find(x=>x.id==='r-morning').steps.length")==n0+1 and J(pg,"RUN.steps[RUN.si+1].name")=='창문 닫기' and J(pg,"!!RUN.steps[RUN.si+1].tmp75"),'＋ 오늘만: 루틴엔 안 들어감')
    # 루틴에서 빼기(앞으로도) + 되돌리기
    j=J(pg,"RUN.si")+2;tdel=J(pg,f"RUN.steps[{j}].tid");n1=J(pg,"C.routines.find(x=>x.id==='r-morning').steps.length");l1=J(pg,"RUN.steps.length")
    clk(pg,f'#hunt .steps [data-hs75="{j}"]',300);clk(pg,f'#hunt .m75 [data-m75="del:{j}"]',500)
    ok(J(pg,"C.routines.find(x=>x.id==='r-morning').steps.length")==n1-1 and J(pg,"RUN.steps.length")==l1-1,'× 루틴에서 빼기(앞으로도)')
    pg.wait_for_timeout(200)
    tb=pg.locator('#toast button').locator('visible=true')
    ok(tb.count()>=1,'빼기 알림에 되돌리기')
    if tb.count():tb.first.click();pg.wait_for_timeout(600)
    ok(J(pg,"C.routines.find(x=>x.id==='r-morning').steps.length")==n1 and J(pg,"RUN.steps.length")==l1 and J(pg,f"!!TASKS['{tdel}']&&TASKS['{tdel}'].status===0"),'되돌리기 → 루틴·실행 목록에 다시')
    # 미니 창 = 지금 단계 시간
    tot=J(pg,"runElapsed()");clk(pg,'[data-hunt="done"]',900);pg.wait_for_timeout(1200)
    clk(pg,'[data-hunt="min"]',1300)
    pill=J(pg,"document.getElementById('huntPill').innerText")
    import re
    m=re.search(r'(\d+):(\d\d) / (\d+):(\d\d)',pill)
    sec=int(m.group(1))*60+int(m.group(2)) if m else -1
    ok(m is not None and 0<=sec<=6 and J(pg,"runElapsed()")>8,'미니 창 = 지금 단계 시간 / 목표 (전체 시간 아님)',[pill,round(J(pg,"runElapsed()"))])
    ok(J(pg,"RUN.steps[RUN.si].name") in pill and re.search(r'\(\d+/\d+\)',pill) is not None,'미니 창에 단계 이름·몇 번째')
    ok(re.match(r'🏹 0:0\d · ',J(pg,"document.title")) is not None,'탭 제목도 단계 시간',J(pg,"document.title"))
    pg.screenshot(path=SP+'t75_pill.png')
    # 지금 단계를 빼면 다음 단계로
    J(pg,"openHunt()");pg.wait_for_timeout(400)
    si=J(pg,"RUN.si");nx=J(pg,"RUN.steps[RUN.si+1].name")
    clk(pg,f'#hunt .steps [data-hs75="{si}"]',300);clk(pg,f'#hunt .m75 [data-m75="del:{si}"]',600)
    ok(J(pg,"RUN&&RUN.steps[RUN.si].name")==nx and J(pg,"RUN.si")==si,'지금 단계 빼기 → 다음 단계가 지금 단계')
    ok(len(errs)==0,'실행 화면 오류 없음',errs[:3])
    b.close()

    # ================= 2) 목록 '✓ 오늘 한 단계' 칩 =================
    b,pg=run(pw,W=1400,H=900);closepops(pg);pg.wait_for_timeout(300)
    hid=J(pg,SETUP);pg.wait_for_timeout(500);st=json.loads(J(pg,ST))
    if not cnt(pg,f'.trow[data-task="{st[1]}"]'):
        vis(pg,f'.trow[data-task="{hid}"] .tfold').click();pg.wait_for_timeout(300)
    vis(pg,f'.trow[data-task="{st[1]}"] [data-tdone]').click();pg.wait_for_timeout(600);closepops(pg)
    ok(cnt(pg,f'.trow[data-task="{st[1]}"]')==0,'체크한 단계는 목록 줄에서 빠짐(v7.2 그대로)')
    ok(cnt(pg,f'.dn75 [data-u74s="{st[1]}"]')==1,'루틴 머리 밑에 ✓ 오늘 한 단계 칩',vis(pg,'.dn75').inner_text() if cnt(pg,'.dn75') else '')
    pg.screenshot(path=SP+'t75_chips.png')
    y1=vis(pg,f'.trow[data-task="{hid}"]').bounding_box();y2=vis(pg,'.dn75').bounding_box() if cnt(pg,'.dn75') else None
    ok(y2 is not None and 0<=y2['y']-(y1['y']+y1['height'])<12,'칩 줄은 머리 바로 밑')
    if cnt(pg,f'.dn75 [data-u74s="{st[1]}"]'):vis(pg,f'.dn75 [data-u74s="{st[1]}"]').click();pg.wait_for_timeout(700);closepops(pg)
    ok(st[1] not in J(pg,ENT) and cnt(pg,f'.trow[data-task="{st[1]}"]')==1 and cnt(pg,'.dn75')==0,'칩 누르면 되돌려짐(단계 줄이 다시 보임·칩 없어짐)')
    # 접힌 머리여도 칩은 보임
    vis(pg,f'.trow[data-task="{st[2]}"] [data-tdone]').click();pg.wait_for_timeout(600);closepops(pg)
    J(pg,"document.getElementById('snack').hidden=true")
    vis(pg,f'.trow[data-task="{hid}"] .tfold').click();pg.wait_for_timeout(400)
    ok(cnt(pg,f'.trow[data-task="{st[3]}"]')==0 and cnt(pg,f'.dn75 [data-u74s="{st[2]}"]')==1,'머리를 접어도 한 단계 칩은 보임')
    ok(len(errs)==0,'목록 오류 없음',errs[:3])
    b.close()

    # ================= 3) 루틴 일부만 해도 일퀘 =================
    b,pg=run(pw,W=1400,H=900);closepops(pg);pg.wait_for_timeout(300)
    hid=J(pg,SETUP);pg.wait_for_timeout(300);st=json.loads(J(pg,ST))
    J(pg,f"(()=>{{const h=TASKS['{hid}'];h.quest=1;saveTask(h);syncDailies(C);render()}})()");pg.wait_for_timeout(500)
    Q=f"(()=>{{const q=C.dailies.find(x=>x.action==='@t:{hid}');return q?!!questCondMet(curDay(),q):null}})()"
    ok(J(pg,Q) is False,'루틴 일퀘가 있고 아직 안 함',J(pg,Q))
    # 몸무게만 적은 건 아님
    J(pg,"wSave63(70.4)");pg.wait_for_timeout(500);closepops(pg)
    ok(J(pg,Q) is False,'몸무게만 적어선 루틴 일퀘 아님')
    if not cnt(pg,f'.trow[data-task="{st[1]}"]'):
        vis(pg,f'.trow[data-task="{hid}"] .tfold').click();pg.wait_for_timeout(300)
    vis(pg,f'.trow[data-task="{st[1]}"] [data-tdone]').click();pg.wait_for_timeout(700);closepops(pg)
    ok(J(pg,Q) is True,'단계 하나 체크 → 루틴 일퀘 ☑')
    J(pg,"location.hash='home'");pg.wait_for_timeout(700)
    qd=J(pg,f"(()=>{{const q=C.dailies.find(x=>x.action==='@t:{hid}');const d=curDay();return !!(d.quests&&d.quests[q.id])||(d.entries||[]).some(e=>e.kind==='quest'&&(e.qid===q.id||/아침 루틴/.test(e.name||'')))}})()")
    ok(qd,'홈: 그날 일퀘 기록에도 반영')
    pg.screenshot(path=SP+'t75_quest.png')
    # 되돌리면 풀림
    J(pg,f"stUndo74('r-morning','{st[1]}',dateKey())");pg.wait_for_timeout(700);closepops(pg)
    ok(J(pg,Q) is False,'그 단계를 되돌리면 일퀘도 풀림')
    ok(len(errs)==0,'일퀘 오류 없음',errs[:3])
    b.close()

    # ================= 4) 이번 기록 점수 직접 =================
    b,pg=run(pw,W=1400,H=900);closepops(pg);pg.wait_for_timeout(300)
    r=json.loads(J(pg,"""JSON.stringify((()=>{const a=C.actions.find(x=>x.type==='good'&&!(x.opts&&x.opts.length)&&+x.xp>0&&!x.link);
      const t=newTask({title:'카드 이은 할 일',list:'inbox'});t.aid=a.id;t.due=dateKey();saveTask(t);
      const t2=newTask({title:'카드 이은 할 일 둘',list:'inbox'});t2.aid=a.id;t2.due=dateKey();saveTask(t2);
      const t3=newTask({title:'용기 할 일',list:'inbox'});t3.brave=1;t3.due=dateKey();saveTask(t3);
      location.hash='tasks';C.ui.tasks.sel='today';render();return{a:a.id,xp:+a.xp,t:t.id,t2:t2.id,t3:t3.id}})())"""));pg.wait_for_timeout(500)
    E=lambda tid:json.loads(J(pg,f"JSON.stringify((DAYS[dateKey()].entries||[]).find(e=>e.tid==='{tid}')||null)"))
    # (가) 체크 → 알림 '구슬·편집' → ✎ 점수 고치기
    xp0=J(pg,"P.xp")
    vis(pg,f'.trow[data-task="{r["t"]}"] [data-tdone]').click();pg.wait_for_timeout(600);closepops(pg)
    e=E(r['t']);ok(e and e['kind']=='act' and e['aid']==r['a'],'카드 이은 할 일 체크 → 카드 기록',e and [e['kind'],e['xp']])
    ex=e['xp']
    vis(pg,'#snack [data-snack="edit"]').click();pg.wait_for_timeout(500)
    ok(cnt(pg,'#sxPrev [data-px75on]')==1,'기록 창 미리보기 줄에 ✎ 점수 고치기')
    pg.screenshot(path=SP+'t75_px1.png')
    clk(pg,'#sxPrev [data-px75on]',400)
    ok(cnt(pg,'#sxPrev [data-px75="xp"]')==1 and int(vis(pg,'#sxPrev [data-px75="xp"]').input_value())==ex,'누르면 ✨💰🔋 칸(지금 점수로 채워짐)')
    vis(pg,'#sxPrev [data-px75="xp"]').fill('55');vis(pg,'#sxPrev [data-px75="gold"]').fill('7')
    pg.screenshot(path=SP+'t75_px2.png')
    clk(pg,'#sheetC [data-sheet="save"]',700)
    e=E(r['t']);ok(e and e['xp']==55 and e['gold']==7 and e.get('px75')==1 and e['aid']==r['a'] and e['kind']=='act','저장 → 이번 기록만 55 XP·7골드, 카드 연결 그대로',e and [e['xp'],e['gold'],e.get('aid')])
    ok(J(pg,"P.xp")-xp0>=55-ex and J(pg,"P.xp")!=xp0+ex,'내 XP에도 반영',[xp0,J(pg,"P.xp")])
    ok(J(pg,f"+C.actions.find(x=>x.id==='{r['a']}').xp")==r['xp'],'카드 점수는 안 바뀜')
    # 고친 기록을 다시 열면 직접 값 그대로
    J(pg,f"openDoneSheet({{edit:{{date:dateKey(),id:'{e['id']}'}}}})");pg.wait_for_timeout(400)
    ok(cnt(pg,'#sxPrev [data-px75="xp"]')==1 and vis(pg,'#sxPrev [data-px75="xp"]').input_value()=='55','다시 열면 직접 정한 값이 보임')
    clk(pg,'#sheetC [data-sheet="save"]',600)
    ok(E(r['t'])['xp']==55,'그냥 저장해도 값 유지')
    # (나) 할 일 상세: 카드 이은 할 일도 '이 할 일만 직접 정하기'
    J(pg,f"openTaskSheet('{r['t2']}')");pg.wait_for_timeout(600)
    if not cnt(pg,'#sheetC [data-px59on]'):
        pn=J(pg,"(document.querySelector('#sheetC .px59').closest('.tpanel')||{dataset:{}}).dataset.p||''")
        clk(pg,f'#sheetC .tch[data-x56panel="{pn}"]',400)
    ok(cnt(pg,'#sheetC [data-px59on]')==1,'상세 크기 칸: 카드 이은 할 일에도 직접 정하기 단추',J(pg,"(document.querySelector('#sheetC .px59')||{}).innerText||'px59 없음'"))
    pg.screenshot(path=SP+'t75_px3.png')
    clk(pg,'#sheetC [data-px59on]',500)
    if cnt(pg,'#sheetC [data-px59="xp"]'):
        vis(pg,'#sheetC [data-px59="xp"]').fill('40');vis(pg,'#sheetC [data-px59="xp"]').press('Tab');pg.wait_for_timeout(400)
    ok(J(pg,f"(TASKS['{r['t2']}'].px||{{}}).xp")==40 and J(pg,f"taskBase(TASKS['{r['t2']}']).xp")==40,'직접 정한 점수가 그 할 일 점수로',J(pg,f"JSON.stringify(TASKS['{r['t2']}'].px||null)"))
    J(pg,"closeSheet()");pg.wait_for_timeout(300)
    vis(pg,f'.trow[data-task="{r["t2"]}"] [data-tdone]').click();pg.wait_for_timeout(700);closepops(pg)
    e2=E(r['t2']);ok(e2 and e2['kind']=='act' and e2['aid']==r['a'] and e2['xp']>=40 and e2['xp']-40==ex-r['xp'] and e2.get('px75')==1,'체크 → 카드 기록 그대로 + 점수는 직접 정한 값(보너스는 그대로 얹힘)',e2 and [e2['xp'],ex,r['xp']])
    # (다) 용기 할 일
    J(pg,"document.getElementById('snack').hidden=true")
    vis(pg,f'.trow[data-task="{r["t3"]}"] [data-tdone]').click();pg.wait_for_timeout(700);closepops(pg)
    e3=E(r['t3']);ok(e3 and e3['kind']=='courage','용기 할 일 체크 → 용기 기록',e3 and e3['kind'])
    vis(pg,'#snack [data-snack="edit"]').click();pg.wait_for_timeout(500)
    ok(cnt(pg,'#sxPrev [data-px75on]')==1,'용기 기록에도 ✎ 점수 고치기')
    clk(pg,'#sxPrev [data-px75on]',400);vis(pg,'#sxPrev [data-px75="xp"]').fill('77');clk(pg,'#sheetC [data-sheet="save"]',700)
    e3=E(r['t3']);ok(e3 and e3['xp']==77 and e3['kind']=='courage' and e3.get('pts'),'용기 표시는 그대로 두고 점수만 77',e3 and [e3['xp'],e3['kind'],e3.get('pts')])
    # (라) 새 기록 창(선택지 있는 카드)에서 바로 점수 고치기
    aid=J(pg,"(()=>{const a=C.actions.find(x=>x.type==='good'&&x.opts&&x.opts.length&&!x.link);if(a)openDoneSheet({a});return a&&a.id})()");pg.wait_for_timeout(500)
    if aid:
        n0=J(pg,"(DAYS[dateKey()].entries||[]).length")
        clk(pg,'#sxPrev [data-px75on]',400);vis(pg,'#sxPrev [data-px75="xp"]').fill('33');clk(pg,'#sheetC [data-sheet="ok"]',800)
        e4=json.loads(J(pg,f"JSON.stringify((DAYS[dateKey()].entries||[]).find(e=>e.aid==='{aid}'&&e.px75)||null)"))
        ok(e4 and e4['xp']==33 and e4['kind']=='act','새 기록 창에서 ✎ → 했어요 = 33 XP로 기록(카드 기록 그대로)',e4 and e4['xp'])
        ok('33' in J(pg,"document.getElementById('snack').innerText"),'알림 글자도 고친 점수',J(pg,"document.getElementById('snack').innerText")[:40])
    else:ok(False,'선택지 있는 좋은 카드가 목업에 없음')
    J(pg,"document.getElementById('snack').hidden=true")
    # 나쁜 행동 기록엔 안 보임
    J(pg,"(()=>{const a=C.actions.find(x=>x.type==='bad');openDoneSheet({a})})()");pg.wait_for_timeout(400)
    ok(cnt(pg,'#sxPrev')==1 and cnt(pg,'#sxPrev [data-px75on]')==0,'나쁜 행동 기록 창엔 없음')
    J(pg,"closeSheet()")
    ok(len(errs)==0,'점수 오류 없음',errs[:3])
    b.close()

    # ================= 5) 폰 캘린더 길이 손잡이 =================
    b,pg=run(pw,W=400,H=820,pre="window.__coarse75=1;");closepops(pg);pg.wait_for_timeout(300)
    tid=J(pg,"(()=>{const t=newTask({title:'블록 시험',list:'inbox'});t.due=dateKey();t.time='10:00';t.dur=60;saveTask(t);location.hash='cal';render();return t.id})()");pg.wait_for_timeout(700)
    if not cnt(pg,'[data-calmode="1day"]'):pg.locator('button',has_text='▾').locator('visible=true').first.click();pg.wait_for_timeout(300)
    clk(pg,'[data-calmode="1day"]',800) or clk(pg,'#m61 [data-m61="0"],[role=menuitem][data-m61="0"]',800)
    J(pg,f"(()=>{{const b=document.querySelector('.blk[data-ctask=\"{tid}\"]');if(b)b.scrollIntoView({{block:'center'}})}})()");pg.wait_for_timeout(300)
    h=pg.locator(f'.rz75[data-drag="resize:{tid}"]').locator('visible=true')
    ok(h.count()==1,'터치 화면: 블록 밑에 큰 손잡이',h.count())
    if h.count():
        hb=h.first.bounding_box();bb=vis(pg,f'.blk[data-ctask="{tid}"]').bounding_box()
        ok(hb['height']>=20 and hb['y']+hb['height']>bb['y']+bb['height']+10,'손잡이가 블록 아래로 삐져나옴(높이 20px 이상)',[round(hb['height']),round(hb['y']+hb['height']-bb['y']-bb['height'])])
        pg.screenshot(path=SP+'t75_rz.png')
        # 블록 '바로 아래 빈 곳'을 잡고 끌어도 길이가 바뀜
        x=hb['x']+hb['width']/2;y=bb['y']+bb['height']+8
        pg.mouse.move(x,y);pg.mouse.down();pg.mouse.move(x,y+10,steps=3);pg.mouse.move(x,y+40,steps=6);pg.wait_for_timeout(100);pg.mouse.up();pg.wait_for_timeout(600)
        ok(J(pg,f"TASKS['{tid}'].dur")>60,'블록 바로 아래를 잡고 끌면 길어짐',J(pg,f"TASKS['{tid}'].dur"))
        ok(J(pg,"Object.values(TASKS).filter(t=>t.status===0&&t.title==='새 할 일').length")==0 and cnt(pg,'#sheet:not([hidden]) #tsTitle')==0,'빈 곳 누르기(할 일 추가)로 새지 않음')
    ok(len(errs)==0,'캘린더 오류 없음',errs[:3])
    b.close()
print('ERRS',errs)
print('FAILS',len(FAILS),FAILS)
