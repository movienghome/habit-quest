# v7.3 시험: A′ 묶음 — 사용자가 실제로 누르는 경로로 (루틴 일부 · 몸무게 칸 · 겹친 기록 · 여기까지 기록 · 늦게 잠 · 한글 찾기)
exec(open('h61.py').read())
J=lambda pg,x:pg.evaluate(x)
SP='/tmp/claude-0/sp/'
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra) if extra!='' else ''))
    if not c:FAILS.append(msg)
def vis(pg,sel):return pg.locator(sel).locator('visible=true').first
SETUP="""(()=>{const r=C.routines.find(x=>x.id==='r-morning');const h=rtH62(r,true);h.due=dateKey();h.rep={f:'d',i:1};saveTask(h);
  r.steps.forEach(s=>{const t=TASKS[s.tid];if(t){t.last=null;saveTask(t)}});C.ui.tfold[h.id]='o';location.hash='tasks';C.ui.tasks.sel='today';render();return h.id})()"""
with sync_playwright() as pw:
    # ---------- A′1: 목록에서 단계 2개 체크 → 루틴은 오늘 함 ----------
    b,pg=run(pw,W=1300,H=900);closepops(pg);pg.wait_for_timeout(300)
    hid=J(pg,SETUP);pg.wait_for_timeout(500)
    st=json.loads(J(pg,"JSON.stringify(C.routines.find(x=>x.id==='r-morning').steps.map(s=>s.tid))"))
    if not pg.locator(f'.trow[data-task="{st[1]}"]').locator('visible=true').count():
        vis(pg,f'.trow[data-task="{hid}"] .tfold').click();pg.wait_for_timeout(300)
    ok(pg.locator(f'.trow[data-task="{st[1]}"]').locator('visible=true').count()>0,'단계 줄 보임')
    vis(pg,f'.trow[data-task="{st[1]}"] [data-tdone]').click();pg.wait_for_timeout(500);closepops(pg)
    ok(pg.locator(f'.trow[data-task="{st[3]}"]').locator('visible=true').count()>0,'단계 하나 체크 뒤에도 이어서 할 수 있음')
    vis(pg,f'.trow[data-task="{st[3]}"] [data-tdone]').click();pg.wait_for_timeout(600);closepops(pg)
    td=J(pg,"dateKey()")
    ok(J(pg,f"TASKS['{hid}'].due")==td,'20분 안엔 루틴 그대로')
    sn=J(pg,"(document.querySelector('#snack [data-snack73]')||{}).textContent||''")
    ok('2/8' in sn,'스낵바 🏁 여기까지 (2/8)',sn)
    pg.screenshot(path=SP+'t73_snack.png')
    J(pg,"(()=>{window.__ta=[];const o=toastAct;toastAct=function(m,l,f){if(l==='남은 단계'){__ta.push(m);window.__taf=f}return o.apply(this,arguments)}})()")
    pg.click('#snack [data-snack73]');pg.wait_for_timeout(600);closepops(pg)
    h=json.loads(J(pg,f"JSON.stringify(TASKS['{hid}'])"))
    ok(h['due']==J(pg,"addDays(dateKey(),1)") and h.get('pd73',{}).get('d')==td,'🏁 → 루틴 다음 회차로',[h['due'],h.get('pd73')])
    ok(pg.locator(f'.trow[data-task="{hid}"]').locator('visible=true').count()==0,'오늘 목록에서 루틴 빠짐')
    ok(pg.locator(f'.trow[data-task="{st[5]}"]').locator('visible=true').count()==0,'남은 단계도 빠짐')
    ok(J(pg,"!(DAYS[dateKey()].entries||[]).some(e=>e.kind==='routine'&&e.full)"),'완주 보너스 없음')
    tt=J(pg,"window.__ta.join('|')")
    ok('2/8' in tt,'알림 남은 단계',tt[:80])
    pg.screenshot(path=SP+'t73_rt.png')
    # 알림 '남은 단계' → 체크 창에서 나머지 모두 → 완주 보너스
    J(pg,"window.__taf&&window.__taf()");pg.wait_for_timeout(400)
    ok(J(pg,"!!document.querySelector('#sheetC [data-d64go]')"),'루틴 체크 창 열림')
    J(pg,"document.querySelectorAll('#sheetC .w64').forEach(i=>i.value='71.2')")
    pg.click('#sheetC [data-d64go]');pg.wait_for_timeout(600);closepops(pg)
    ok(J(pg,"(DAYS[dateKey()].entries||[]).some(e=>e.kind==='routine'&&e.full)"),'남은 단계까지 하면 완주 보너스')
    ok(J(pg,f"TASKS['{hid}'].due")==J(pg,"addDays(dateKey(),1)"),'완주 뒤에도 다음 날 하나만',J(pg,f"TASKS['{hid}'].due"))
    b.close()
    # 되돌리기: 단계 하나 하고 그 기록을 지우면 루틴 다시 오늘로
    b,pg=run(pw,W=1300,H=900);closepops(pg);pg.wait_for_timeout(300)
    hid=J(pg,SETUP);pg.wait_for_timeout(400)
    st=json.loads(J(pg,"JSON.stringify(C.routines.find(x=>x.id==='r-morning').steps.map(s=>s.tid))"))
    if not pg.locator(f'.trow[data-task="{st[2]}"]').locator('visible=true').count():
        vis(pg,f'.trow[data-task="{hid}"] .tfold').click();pg.wait_for_timeout(300)
    vis(pg,f'.trow[data-task="{st[2]}"] [data-tdone]').click();pg.wait_for_timeout(500);closepops(pg)
    ok(J(pg,f"TASKS['{hid}'].due")==J(pg,"dateKey()"),'단계 1개 → 20분 안엔 그대로')
    J(pg,f"(()=>{{TASKS['{hid}'].pt73=Date.now()-21*60e3;render()}})()");pg.wait_for_timeout(300)
    ok(J(pg,f"TASKS['{hid}'].due")!=J(pg,"dateKey()"),'20분 지나면 저절로 넘어감')
    eid=J(pg,f"(DAYS[dateKey()].entries.find(e=>e.tid==='{st[2]}')||{{}}).id")
    J(pg,f"removeEntry(dateKey(),'{eid}')");pg.wait_for_timeout(400)
    ok(J(pg,f"TASKS['{hid}'].due")==J(pg,"dateKey()"),'단계 기록 지우면 루틴 다시 오늘',J(pg,f"TASKS['{hid}'].due"))
    J(pg,f"""(()=>{{const h=TASKS['{hid}'];const y=addDays(dateKey(),-1);delete h.pd73;h.due=y;h.pt73=Date.now();saveTask(h);
      const s=TASKS['{st[4]}'];dayOf(y).entries.push({{id:'ey73',kind:'task',type:'good',name:s.title,xp:2,gold:0,cond:0,tid:s.id,prevDue:null,prevStatus:0,prevCnt:0}});save(y);render()}})()""");pg.wait_for_timeout(300)
    ok(J(pg,f"TASKS['{hid}'].due")==J(pg,"dateKey()") and not J(pg,f"TASKS['{hid}'].skull"),'어제 일부만 함 → 오늘 회차(지난 것 아님)',J(pg,f"TASKS['{hid}'].due"))
    J(pg,"(()=>{const d=dayOf(addDays(dateKey(),-1));d.entries=d.entries.filter(e=>e.id!=='ey73')})()")
    # 기록하기에서 몸무게만 적으면 루틴은 그대로
    J(pg,"wSave63('70.4')");J(pg,"render()");pg.wait_for_timeout(300)
    ok(J(pg,f"TASKS['{hid}'].due")==J(pg,"dateKey()"),'몸무게만 적은 건 루틴 안 넘김')
    b.close()

    # ---------- A′2: 몸무게 칸 (PC 편집 화면 · 상세 · 목록 체크) + 폰 ----------
    for W,H,nm in [(1300,900,'pc'),(390,844,'phone')]:
        b,pg=run(pw,W=W,H=H);closepops(pg);pg.wait_for_timeout(300)
        hid=J(pg,SETUP);pg.wait_for_timeout(300)
        # 편집 → 루틴
        J(pg,"location.hash='edit'");pg.wait_for_timeout(400)
        tab=pg.locator('[data-etab="routines"],[data-etab="routine"]').locator('visible=true')
        if tab.count():tab.first.click()
        else:J(pg,"(()=>{ui.etab='routines';ui.editTab='routines';renderEdit()})()")
        pg.wait_for_timeout(400)
        n=pg.locator('[data-w73]').locator('visible=true').count()
        if not n:
            J(pg,f"openRt61('r-morning')");pg.wait_for_timeout(400);n=pg.locator('[data-w73]').locator('visible=true').count()
        ok(n>0,f'[{nm}] 루틴 편집 줄에 kg 칸')
        ok(J(pg,"!document.body.innerText.includes('몸무게 칸에 적어요')"),f'[{nm}] 옛 안내 없음')
        pg.screenshot(path=SP+f't73_w_{nm}.png')
        i=pg.locator('[data-w73]').locator('visible=true').first;i.fill('72.4');i.press('Enter');pg.wait_for_timeout(400)
        ok(J(pg,"today().weight")==72.4,f'[{nm}] Enter로 몸무게 기록',J(pg,"today().weight"))
        wt=J(pg,"C.routines.find(x=>x.id==='r-morning').steps.find(s=>s.aid==='@weigh').tid")
        ok(J(pg,f"TASKS['{wt}'].last")==J(pg,"dateKey()"),f'[{nm}] 몸무게 단계 오늘 함')
        b.close()
    # 할 일 상세 루틴 칸 + 목록에서 몸무게 단계 체크 → 작은 창
    b,pg=run(pw,W=1300,H=900);closepops(pg);pg.wait_for_timeout(300)
    hid=J(pg,SETUP);pg.wait_for_timeout(300)
    J(pg,f"openTaskSheet('{hid}')");pg.wait_for_timeout(400)
    ok(pg.locator('#sheetC [data-w73]').count()>0,'할 일 상세 루틴 단계에 kg 칸')
    i=pg.locator('#sheetC [data-w73]').first;i.fill('69.9');pg.locator('#sheetC [data-w73go]').first.click();pg.wait_for_timeout(400)
    ok(J(pg,"today().weight")==69.9 and J(pg,"!!$('tsTitle')"),'상세에서 기록 · 상세 그대로',J(pg,"today().weight"))
    J(pg,"closeSheet()");b.close()
    b,pg=run(pw,W=390,H=844);closepops(pg);pg.wait_for_timeout(300)
    hid=J(pg,SETUP);pg.wait_for_timeout(300)
    wt=J(pg,"C.routines.find(x=>x.id==='r-morning').steps.find(s=>s.aid==='@weigh').tid")
    if not pg.locator(f'.trow[data-task="{wt}"]').locator('visible=true').count():
        vis(pg,f'.trow[data-task="{hid}"] .tfold').click();pg.wait_for_timeout(300)
    vis(pg,f'.trow[data-task="{wt}"] [data-tdone]').click();pg.wait_for_timeout(400)
    ok(J(pg,"!!$('w63In')") and J(pg,"location.hash")!='#log','[phone] 목록 몸무게 단계 → 작은 창(v6.3, 화면 안 옮김)')
    pg.fill('#w63In','73.1');pg.press('#w63In','Enter');pg.wait_for_timeout(500);closepops(pg)
    ok(J(pg,"today().weight")==73.1 and J(pg,f"TASKS['{wt}'].last")==J(pg,"dateKey()"),'[phone] 작은 창 기록 · 단계 체크')
    b.close()
    # '몸무게 재기' 일퀘 할 일도 (새 창: 오늘 몸무게 아직 없음)
    b,pg=run(pw,W=390,H=844);closepops(pg);pg.wait_for_timeout(300)
    J(pg,"(()=>{location.hash='tasks';C.ui.tasks.sel='today';render()})()");pg.wait_for_timeout(400)
    qt=J(pg,"(Object.values(TASKS).find(t=>t.title==='몸무게 재기'&&t.status===0)||{}).id")
    if qt and pg.locator(f'.trow[data-task="{qt}"]').locator('visible=true').count():
        vis(pg,f'.trow[data-task="{qt}"] [data-tdone]').click();pg.wait_for_timeout(400)
        ok(J(pg,"!!$('w73in')") and J(pg,"location.hash")=='#tasks','몸무게 재기 일퀘 → 작은 창(화면 안 옮김)')
        pg.screenshot(path=SP+'t73_wsheet.png')
        pg.fill('#w73in','70.8');pg.press('#w73in','Enter');pg.wait_for_timeout(500);closepops(pg)
        ok(J(pg,"today().weight")==70.8 and J(pg,f"TASKS['{qt}'].due")!=J(pg,"dateKey()"),'일퀘 작은 창 기록 → 일퀘 체크',J(pg,f"TASKS['{qt}'].due"))
    else: ok(False,'몸무게 재기 일퀘 줄 없음',qt)
    b.close()

    # ---------- A′3: 겹친 기록 하나 지우기 → 할 일은 한 번 한 상태 ----------
    b,pg=run(pw,W=1300,H=900);closepops(pg);pg.wait_for_timeout(300)
    r=json.loads(J(pg,"""(()=>{const td=dateKey(),y=addDays(td,-2);
      const t=newTask({title:'손톱깎기 73',due:y,rep:{f:'d',i:7}});saveTask(t);
      // 두 기기가 같은 상태(옛 화면)에서 각자 체크 → 기록 두 개, prevDue 같음
      const d=dayOf(y);const mk=(id,tt)=>({id,kind:'task',type:'good',name:t.title,xp:5,gold:0,cond:0,t:tt,tid:t.id,prevDue:y,prevStatus:0,prevCnt:0});
      d.entries.push(mk('e73a','10:00'),mk('e73b','10:01'));t.due=addDays(y,7);t.last=y;t.cnt=1;saveTask(t);save(y);
      // 비반복 할 일: 두 번째는 첫 번째 뒤 상태(prevStatus 2)에서 들어감
      const u=newTask({title:'택배 73',due:y});saveTask(u);d.entries.push({id:'e73c',kind:'task',type:'good',name:u.title,xp:3,gold:0,cond:0,t:'11:00',tid:u.id,prevDue:y,prevStatus:0,prevCnt:0},{id:'e73d',kind:'task',type:'good',name:u.title,xp:3,gold:0,cond:0,t:'11:02',tid:u.id,prevDue:y,prevStatus:2,prevCnt:1});
      u.status=2;u.doneAt=y;saveTask(u);save(y);
      return JSON.stringify({t:t.id,u:u.id,y})})()"""))
    J(pg,"dupSheet72()");pg.wait_for_timeout(400)
    btn=pg.locator('#sheetC [data-dp73]')
    ok(btn.count()==2,'겹친 기록 2쌍',btn.count())
    btn.first.click();pg.wait_for_timeout(400);pg.locator('#sheetC [data-dp73]').first.click();pg.wait_for_timeout(400)
    t=json.loads(J(pg,f"JSON.stringify(TASKS['{r['t']}'])"));u=json.loads(J(pg,f"JSON.stringify(TASKS['{r['u']}'])"))
    ok(t['status']==0 and t['due']==J(pg,f"addDays('{r['y']}',7)"),'반복 할 일 다시 안 열림',[t['status'],t['due']])
    ok(u['status']==2,'비반복 할 일 끝낸 그대로',u['status'])
    ok(J(pg,f"DAYS['{r['y']}'].entries.filter(e=>e.tid==='{r['t']}').length")==1,'기록 하나만 남음')
    # v7.2 때 다시 열린 것 → '끝낸 상태로'
    J(pg,f"(()=>{{const t=TASKS['{r['t']}'];t.due='{r['y']}';saveTask(t);dupSheet72()}})()");pg.wait_for_timeout(300)
    ok(pg.locator('#sheetC [data-ro73]').count()==1,'다시 열린 할 일 보임')
    pg.screenshot(path=SP+'t73_dup.png')
    pg.locator('#sheetC [data-ro73]').first.click();pg.wait_for_timeout(300)
    ok(J(pg,f"TASKS['{r['t']}'].due")==J(pg,f"addDays('{r['y']}',7)"),'끝낸 상태로 돌림')
    J(pg,"closeSheet()");b.close()

    # ---------- A′4: 타이머 바로 그만 → 여기까지 기록 (할 일 ⏱ 단추로 시작) ----------
    b,pg=run(pw,W=390,H=844);closepops(pg);pg.wait_for_timeout(300)
    tid=J(pg,"(()=>{const t=newTask({title:'시나리오 73',due:dateKey(),tmode:'flow',dur:25});saveTask(t);location.hash='tasks';C.ui.tasks.sel='today';render();return t.id})()");pg.wait_for_timeout(400)
    vis(pg,f'.trow[data-task="{tid}"] [data-trun]').click();pg.wait_for_timeout(600)
    pg.click('[data-hunt="quit"]');pg.wait_for_timeout(300)
    ok(J(pg,"!!document.querySelector('#hunt [data-q72]')"),'5초 만에 그만 → 여기까지 기록 단추')
    pg.screenshot(path=SP+'t73_quit.png')
    pg.click('#hunt [data-q72]');pg.wait_for_timeout(400)
    ok(J(pg,f"(DAYS[dateKey()].entries||[]).some(e=>e.part72&&e.ptid72==='{tid}')"),'여기까지 기록 들어감')
    ok(J(pg,f"TASKS['{tid}'].status")==0,'할 일은 남음')
    b.close()

    # ---------- A′5: '새벽 3시 넘어 잠' (v7.2가 못 찾은 카드) ----------
    b,pg=run(pw,W=1300,H=900);closepops(pg);pg.wait_for_timeout(300)
    J(pg,"""(()=>{hr72=()=>9;C.actions=C.actions.filter(a=>!/잠/.test(a.name)||a.type!=='bad');C.actions.push({id:'b2',name:'새벽 3시 넘어 잠',type:'bad',area:'body',cond:-18,gold:0,xp:0});C.mig72sleep=1;delete C.mig73sleep;render()})()""");pg.wait_for_timeout(600)
    pg.wait_for_timeout(2200)
    a=json.loads(J(pg,"JSON.stringify(C.actions.find(a=>a.id==='b2'))"))
    ok(a['name']=='🌙 늦게 잠' and len(a.get('opts',[]))==5 and a.get('morn72')==1,'새벽 3시 넘어 잠 → 🌙 늦게 잠',a['name'])
    snack=J(pg,"(document.querySelector('#toast')||{}).innerText||''")
    ok('되돌리기' in snack,'되돌리기 알림',snack[:60])
    # 이미 '늦게 잠'으로 고쳐진 카드는 그대로
    J(pg,"(()=>{delete C.mig73sleep;render()})()");pg.wait_for_timeout(300)
    ok(J(pg,"C.actions.find(a=>a.id==='b2').name")=='🌙 늦게 잠','두 번 안 바꿈')
    b.close()

    # ---------- A′6: 편집 → 행동/습관 찾기 한글 조합 ----------
    b,pg=run(pw,W=1300,H=900);closepops(pg);pg.wait_for_timeout(300)
    J(pg,"location.hash='edit'");pg.wait_for_timeout(500)
    q=pg.locator('#aeQ').locator('visible=true')
    if not q.count():
        J(pg,"(()=>{const b=document.querySelector('[data-etab=\"actions\"]');b&&b.click()})()");pg.wait_for_timeout(400)
    q=pg.locator('#aeQ').locator('visible=true').first
    q.click()
    cdp=pg.context.new_cdp_session(pg)
    # 실제 한글 입력: 한 글자 끝나자마자(조합 끝 → input) 다음 글자 조합이 바로 시작돼요. 예전엔 0.18초 뒤 그 조합 중에 칸을 새로 그려 깨졌어요.
    cdp.send('Input.imeSetComposition',{'text':'사','selectionStart':1,'selectionEnd':1});pg.wait_for_timeout(60)
    cdp.send('Input.insertText',{'text':'산'});J(pg,"document.getElementById('aeQ').__k73=1")
    cdp.send('Input.imeSetComposition',{'text':'ㅊ','selectionStart':1,'selectionEnd':1});pg.wait_for_timeout(120)
    cdp.send('Input.imeSetComposition',{'text':'채','selectionStart':1,'selectionEnd':1});pg.wait_for_timeout(500)
    st=J(pg,"(()=>{const i=document.getElementById('aeQ');return {same:!!(i&&i.__k73),focus:document.activeElement===i,v:i&&i.value}})()")
    ok(st['same'] and st['focus'] and st['v']=='산채','다음 글자 조합 중엔 입력칸을 새로 안 그림',st)
    cdp.send('Input.insertText',{'text':'책'});pg.wait_for_timeout(600)
    st=J(pg,"(()=>{const i=document.getElementById('aeQ');return {focus:document.activeElement===i,v:i&&i.value,q:ui.ae.q}})()")
    ok(st['v']=='산책' and st['q']=='산책' and st['focus'],'조합 끝 → 거르기 · 칸 그대로',st)
    ok(J(pg,"[...document.querySelectorAll('[data-view=edit] .bchip, [data-view=edit] [data-aedit]')].filter(x=>x.offsetParent).every(x=>x.textContent.includes('산책'))"),'산책만 보임')
    b.close()
print('ERRS',[e for e in errs if 'ERR_TUNNEL' not in e and 'fonts' not in e][:8])
print('FAILS',len(FAILS),FAILS)
