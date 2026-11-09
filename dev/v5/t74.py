# v7.4 시험: 루틴 단계 되돌리기 · 목록별 묶기 = 옆 목록 순서 · 캘린더 종일 칸 ↔ 시간표 — 사용자가 실제로 누르는 경로로
exec(open('h61.py').read())
J=lambda pg,x:pg.evaluate(x)
SP='/tmp/claude-0/sp/'
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra) if extra!='' else ''))
    if not c:FAILS.append(msg)
def vis(pg,sel):return pg.locator(sel).locator('visible=true').first
def cnt(pg,sel):return pg.locator(sel).locator('visible=true').count()
SETUP="""(()=>{const r=C.routines.find(x=>x.id==='r-morning');const h=rtH62(r,true);h.due=dateKey();h.rep={f:'d',i:1};saveTask(h);
  r.steps.forEach(s=>{const t=TASKS[s.tid];if(t){t.last=null;saveTask(t)}});C.ui.tfold[h.id]='o';location.hash='tasks';C.ui.tasks.sel='today';render();return h.id})()"""
ST="JSON.stringify(C.routines.find(x=>x.id==='r-morning').steps.map(s=>s.tid))"
with sync_playwright() as pw:
    # ================= 1) 루틴 단계 되돌리기 =================
    b,pg=run(pw,W=1400,H=900);closepops(pg);pg.wait_for_timeout(300)
    hid=J(pg,SETUP);pg.wait_for_timeout(500)
    st=json.loads(J(pg,ST));td=J(pg,"dateKey()")
    xp0=J(pg,"P.xp")
    if not cnt(pg,f'.trow[data-task="{st[1]}"]'):
        vis(pg,f'.trow[data-task="{hid}"] .tfold').click();pg.wait_for_timeout(300)
    for i in (1,3):
        vis(pg,f'.trow[data-task="{st[i]}"] [data-tdone]').click();pg.wait_for_timeout(500);closepops(pg)
    xp1=J(pg,"P.xp")
    ok(xp1>xp0,'단계 2개 체크 → XP 들어감',[xp0,xp1])
    ok(cnt(pg,f'.trow[data-task="{hid}"] .u74h')==1,'목록 루틴 머리에 "오늘 n개 ↶"',vis(pg,f'.trow[data-task="{hid}"] .u74h').inner_text() if cnt(pg,f'.trow[data-task="{hid}"] .u74h') else '')
    pg.screenshot(path=SP+'t74_head.png')
    # ① 머리 '오늘 n개 ↶' → 체크 창 → 단계 ↶
    vis(pg,f'.trow[data-task="{hid}"] .u74h').click();pg.wait_for_timeout(500)
    ok(cnt(pg,'#sheetC .u74')==2,'체크 창: 한 단계마다 ↶ 되돌리기 (2개)',cnt(pg,'#sheetC .u74'))
    pg.screenshot(path=SP+'t74_sheet.png')
    vis(pg,f'#sheetC .u74[data-u74="{st[3]}"]').click();pg.wait_for_timeout(600);closepops(pg)
    r=json.loads(J(pg,f"JSON.stringify({{last:TASKS['{st[3]}'].last,n:(DAYS[dateKey()].entries||[]).filter(e=>e.tid==='{st[3]}').length,xp:P.xp}})"))
    ok(r['last'] is None and r['n']==0,'단계 하나 되돌림(기록 지워짐·오늘 함 풀림)',r)
    ok(0<r['xp']<xp1,'그 단계 XP만 빠짐',[xp1,r['xp']])
    ok(cnt(pg,'#sheetC .u74')==1 and J(pg,f"!document.querySelector('#sheetC [data-d64=\"{st[3]}\"]').disabled"),'체크 창이 바로 새로 그려짐(그 단계는 다시 체크 가능)')
    pg.click('#sheetC [data-sheet="close"]');pg.wait_for_timeout(300)
    ok(cnt(pg,f'.trow[data-task="{st[3]}"]')==1,'되돌린 단계가 목록에 다시 보임')
    # ② 오늘 한 일 줄: 🌅 루틴 이름 + ×
    J(pg,"location.hash='log'");pg.wait_for_timeout(600)
    rowc=pg.locator('[data-view="log"] .log li:has(.rt74)').locator('visible=true')
    ok(rowc.count()>=1,'오늘 한 일 줄에 루틴 이름',rowc.first.inner_text() if rowc.count() else '')
    pg.screenshot(path=SP+'t74_log.png')
    rowc.first.locator('button.x').click();pg.wait_for_timeout(600);closepops(pg)
    ok(J(pg,f"TASKS['{st[1]}'].last")is None,'오늘 한 일 ×로 지워도 단계 오늘 함이 풀림')
    ok(J(pg,"!(DAYS[dateKey()].entries||[]).some(e=>e.tid)"),'단계 기록 0개')
    ok(J(pg,f"TASKS['{hid}'].due")==td,'단계가 하나도 없으면 루틴은 오늘 그대로',J(pg,f"TASKS['{hid}'].due"))
    b.close()

    # ---------- 완주(보너스) 뒤 되돌리기 · 머리 오늘로 ----------
    b,pg=run(pw,W=1400,H=900);closepops(pg);pg.wait_for_timeout(300)
    hid=J(pg,SETUP);pg.wait_for_timeout(500)
    st=json.loads(J(pg,ST));td=J(pg,"dateKey()")
    J(pg,"(()=>{const r=C.routines.find(x=>x.id==='r-morning');rtDone64(r)})()");pg.wait_for_timeout(500)
    # 몸무게 칸이 있으면 채움
    if cnt(pg,'#sheetC .w64'):vis(pg,'#sheetC .w64').fill('71.2')
    vis(pg,'#sheetC [data-d64go]').click();pg.wait_for_timeout(900);closepops(pg)
    full=lambda:J(pg,"(DAYS[dateKey()].entries||[]).filter(e=>e.kind==='routine'&&e.full).length")
    ok(full()==1,'완주 보너스 들어감',full())
    ok(J(pg,f"TASKS['{hid}'].due")!=td,'완주 → 머리는 다음 회차로',J(pg,f"TASKS['{hid}'].due"))
    xpF=J(pg,"P.xp");bonus=J(pg,"(DAYS[dateKey()].entries.find(e=>e.kind==='routine'&&e.full)||{}).xp||0")
    J(pg,"(()=>{const r=C.routines.find(x=>x.id==='r-morning');RD69=null;rtDone64(r)})()");pg.wait_for_timeout(500)
    n8=cnt(pg,'#sheetC .u74')
    ok(n8==8,'체크 창: 8단계 모두 ↶',n8)
    vis(pg,f'#sheetC .u74[data-u74="{st[2]}"]').click();pg.wait_for_timeout(700);closepops(pg)
    ok(full()==0,'단계 하나 되돌리니 완주 보너스도 빠짐')
    ok(J(pg,"P.xp")<=xpF-bonus,'XP도 보너스만큼 이상 빠짐',[xpF,J(pg,"P.xp"),bonus])
    ok(J(pg,f"TASKS['{st[2]}'].last") is None,'그 단계 오늘 함 풀림')
    # 나머지도 모두 되돌리기 → 루틴 다시 오늘
    for i in [0,1,3,4,5,6,7]:
        J(pg,"(()=>{const r=C.routines.find(x=>x.id==='r-morning');RD69=null;rtDone64(r)})()");pg.wait_for_timeout(250)
        if cnt(pg,f'#sheetC .u74[data-u74="{st[i]}"]'):
            vis(pg,f'#sheetC .u74[data-u74="{st[i]}"]').click();pg.wait_for_timeout(500);closepops(pg)
    pg.wait_for_timeout(500)
    ok(J(pg,"!!(DAYS[dateKey()].weight)")==False,'몸무게 단계 되돌림 → 몸무게 기록도 지워짐')
    ok(J(pg,f"TASKS['{st[0]}'].last") is None,'몸무게 단계 오늘 함 풀림')
    ok(J(pg,f"TASKS['{hid}'].due")==td,'단계 0개 → 루틴 다시 오늘',J(pg,f"TASKS['{hid}'].due"))
    J(pg,"location.hash='tasks';C.ui.tasks.sel='today';render()");pg.wait_for_timeout(500)
    ok(cnt(pg,f'.trow[data-task="{hid}"]')==1,'오늘 목록에 루틴 머리 다시 보임')
    b.close()

    # ---------- 🏁 여기까지 뒤 되돌리기 ----------
    b,pg=run(pw,W=1400,H=900);closepops(pg);pg.wait_for_timeout(300)
    hid=J(pg,SETUP);pg.wait_for_timeout(500)
    st=json.loads(J(pg,ST));td=J(pg,"dateKey()")
    if not cnt(pg,f'.trow[data-task="{st[1]}"]'):
        vis(pg,f'.trow[data-task="{hid}"] .tfold').click();pg.wait_for_timeout(300)
    vis(pg,f'.trow[data-task="{st[1]}"] [data-tdone]').click();pg.wait_for_timeout(500);closepops(pg)
    if cnt(pg,'#snack [data-snack73]'):pg.click('#snack [data-snack73]');pg.wait_for_timeout(600);closepops(pg)
    ok(J(pg,f"TASKS['{hid}'].due")!=td,'🏁 → 루틴 다음 회차로',J(pg,f"TASKS['{hid}'].due"))
    J(pg,"(()=>{const r=C.routines.find(x=>x.id==='r-morning');RD69=null;rtDone64(r)})()");pg.wait_for_timeout(500)
    vis(pg,f'#sheetC .u74[data-u74="{st[1]}"]').click();pg.wait_for_timeout(700);closepops(pg)
    ok(J(pg,f"TASKS['{hid}'].due")==td,'🏁 뒤 단계를 되돌려 0개 → 루틴 다시 오늘',J(pg,f"TASKS['{hid}'].due"))
    b.close()

    # ================= 2) 목록별 묶기 = 옆 목록 순서 =================
    b,pg=run(pw,W=1400,H=900);closepops(pg);pg.wait_for_timeout(300)
    J(pg,"""(()=>{location.hash='tasks';C.ui.tasks.sel='all';C.ui.tasks.group='list';C.ui.tasks.sort='due';
      // 옆 목록 끝 쪽 목록부터 먼저 만들어서(날짜도 더 이르게) 예전 방식이면 순서가 뒤집히게
      const ids=C.lists.filter(l=>l.id!=='inbox').map(l=>l.id);
      ids.slice().reverse().forEach((id,i)=>{const t=newTask({title:'묶음 '+id,list:id,due:addDays(dateKey(),3+ids.length-i)});saveTask(t)});
      const t0=newTask({title:'묶음 inbox',list:'inbox',due:addDays(dateKey(),40)});saveTask(t0);render()})()""")
    pg.wait_for_timeout(600)
    heads=lambda:json.loads(J(pg,"JSON.stringify([...document.querySelectorAll('#tList>.tgroup>.ghead[data-tgcollapse^=\"l\"]')].map(h=>h.dataset.tgcollapse.slice(1)))"))
    want=lambda:json.loads(J(pg,"JSON.stringify(['inbox',...[...document.querySelectorAll('#tSide [data-tsel^=\"l:\"]')].map(b=>b.dataset.tsel.slice(2))])"))   # 실제 옆 목록(DOM) 순서
    h=heads();w=want();ok(len(h)>=5,'목록별 묶음 여러 개',h)
    ok(h==[x for x in w if x in h],'묶음이 옆 목록 순서',[h,w])
    pg.screenshot(path=SP+'t74_group.png')
    # 옆 목록 순서를 바꾸면 묶음도 따라감 (실제 끌기와 같은 reorder)
    J(pg,"""(()=>{const ls=C.lists.filter(l=>l.id!=='inbox');const it=ls[ls.length-1];C.lists=[C.lists.find(l=>l.id==='inbox'),it,...C.lists.filter(l=>l!==it&&l.id!=='inbox')].filter(Boolean);save('config');render()})()""")
    pg.wait_for_timeout(500)
    h=heads();w=want();ok(h==[x for x in w if x in h] and len(h)>1 and h[1]==w[1],'목록 순서 바꾼 뒤에도 같은 순서(끝 목록이 맨 앞으로)',[h[:3],w[:3]])
    # 📁 폴더: 같은 폴더 목록은 첫 목록 자리에 모임
    J(pg,"""(()=>{const ls=C.lists.filter(l=>l.id!=='inbox');ls[0].folder='F74';ls[ls.length-1].folder='F74';C.lists=[C.lists.find(l=>l.id==='inbox'),...ls];save('config');render()})()""")
    pg.wait_for_timeout(500)
    h=heads();w=want();ok(h==[x for x in w if x in h],'📁 폴더 묶어도 옆 목록 순서',[h,w])
    ok(w.index(J(pg,"C.lists.filter(l=>l.id!=='inbox').slice(-1)[0].id"))==2,'폴더 목록이 첫 목록 바로 뒤로 모임',w[:4])
    b.close()
    # 캘린더 서랍(폭 1100 = 분할 아님, 캘린더 화면 서랍)
    b,pg=run(pw,W=1100,H=900);closepops(pg);pg.wait_for_timeout(300)
    J(pg,"""(()=>{const ids=C.lists.filter(l=>l.id!=='inbox').map(l=>l.id);
      ids.slice().reverse().forEach((id,i)=>{const t=newTask({title:'서랍 '+id,list:id});saveTask(t)});
      const T=T66();T.g.task='list';C.ui.cal.tray=1;ui.trayTab='nodate';location.hash='cal';render()})()""")
    pg.wait_for_timeout(700)
    th=json.loads(J(pg,"JSON.stringify([...document.querySelectorAll('#calTray .trayl .tgh66 span:first-child')].map(x=>x.textContent))"))
    exp=json.loads(J(pg,"JSON.stringify(['inbox',...C.lists.filter(l=>l.id!=='inbox').map(l=>l.id)].map(listName))"))
    ok(len(th)>=4,'서랍 묶음 여러 개',th)
    ok(th==[x for x in exp if x in th],'서랍 묶음도 옆 목록 순서',[th,exp])
    b.close()

    # ================= 3) 캘린더 상단(종일 칸) ↔ 시간표 =================
    b,pg=run(pw,W=1500,H=950);closepops(pg);pg.wait_for_timeout(300)
    J(pg,"""(()=>{location.hash='tasks';C.ui.tasks.sel='today';
      const mk=(title,extra)=>{const t=newTask(Object.assign({title,list:'inbox'},extra));saveTask(t);return t.id};
      window.__a=mk('A 종일',{due:dateKey()});window.__b=mk('B 종일',{due:dateKey()});window.__c=mk('C 종일',{due:dateKey()});
      window.__d=mk('D 종일',{due:dateKey()});window.__e=mk('E 종일',{due:dateKey()});window.__f=mk('F 종일',{due:dateKey()});
      C.ui.cal.mode='1day';ui.calAnchor=dateKey();delete C.ui.cal.allH;ui.allOpen=false;render();})()""")
    pg.wait_for_timeout(700)
    aid=J(pg,"window.__a");eid=J(pg,"window.__e");td=J(pg,"dateKey()")
    ok(cnt(pg,'.tgall [data-ctask]')>=6,'종일 칸에 안 놓은 할 일이 다 보임(접힌 채로 6줄)',cnt(pg,'.tgall [data-ctask]'))
    nv=lambda:vis(pg,'.alltog .n74').inner_text()
    n0=int(nv());ok(n0>=6,'종일 이름 밑에 안 놓은 개수',n0)
    pg.screenshot(path=SP+'t74_cal0.png')
    gridy=lambda hh:J(pg,f"(()=>{{const c=document.querySelector('.tgcol').getBoundingClientRect();return c.top+yOf({hh}*60)}})()")
    col=pg.locator('.tgcol').first.bounding_box()
    chip=pg.locator(f'.tgall [data-ctask="{aid}"]').first
    drag(pg,ctr(chip.bounding_box()),(col['x']+col['width']/2,gridy(17)),steps=20)
    r=json.loads(J(pg,f"JSON.stringify([TASKS['{aid}'].due,TASKS['{aid}'].time])"))
    ok(r[0]==td and r[1] and r[1].startswith('16:') or r[1]=='17:00','종일 칸 → 시간표에 놓음 (시각 생김)',r)
    ok(pg.locator(f'.tgall [data-ctask="{aid}"]').count()==0,'시간표에 놓으면 종일 칸에서 빠짐')
    ok(pg.locator(f'.tgcol [data-ctask="{aid}"]').count()==1,'시간표에 블록으로 보임')
    ok(int(nv())==n0-1,'안 놓은 개수 1 줄어듦',[n0,nv()])
    # 시간표 블록 → 같은 날 종일 칸
    blk=pg.locator(f'.tgcol [data-ctask="{aid}"]').first.bounding_box()
    top=pg.locator('.tgall > div[data-drop^="allday:"]').first.bounding_box()
    drag(pg,ctr(blk),(top['x']+top['width']/2,top['y']+top['height']/2),steps=20)
    ok(J(pg,f"TASKS['{aid}'].time") is None,'종일 칸에 올리면 시각이 지워짐')
    ok(pg.locator(f'.tgcol [data-ctask="{aid}"]').count()==0 and pg.locator(f'.tgall [data-ctask="{aid}"]').count()==1,'시간표에서 사라지고 종일 칸에 다시 보임')
    ok(int(nv())==n0,'안 놓은 개수 원래대로',[n0,nv()])
    # 다른 날 종일 칸 (3일 보기): 시각이 시간표에 남지 않아야 함
    J(pg,"(()=>{C.ui.cal.mode='3day';ui.calAnchor=dateKey();ui.allOpen=true;render()})()");pg.wait_for_timeout(500)
    col=pg.locator('.tgcol').first.bounding_box();chip=pg.locator(f'.tgall [data-ctask="{eid}"]').first
    drag(pg,ctr(chip.bounding_box()),(col['x']+col['width']/2,gridy(14)),steps=20)
    ok(J(pg,f"!!TASKS['{eid}'].time"),'3일 보기: 시간표에 놓음')
    blk=pg.locator(f'.tgcol [data-ctask="{eid}"]').first.bounding_box()
    cells=pg.locator('.tgall > div[data-drop^="allday:"]');c2=cells.nth(1).bounding_box()
    drag(pg,ctr(blk),(c2['x']+c2['width']/2,c2['y']+c2['height']/2),steps=20)
    r=json.loads(J(pg,f"JSON.stringify([TASKS['{eid}'].due,TASKS['{eid}'].time||null])"))
    ok(r[0]==J(pg,"addDays(dateKey(),1)") and r[1] is None,'다른 날 종일 칸에 올려도 시각 지워짐(시간표에 안 남음)',r)
    ok(pg.locator(f'.tgcol [data-ctask="{eid}"]').count()==0 and pg.locator(f'.tgall [data-ctask="{eid}"]').count()==1,'그날 종일 칸에 보임, 시간표엔 없음')
    # 알림 '되돌리기'
    pg.wait_for_timeout(300)
    tx=J(pg,"document.getElementById('toast').innerText")
    ok('시간표에서 뺐어요' in tx and '되돌리기' in tx,'알림: 시간표에서 뺐어요 · 되돌리기',tx[:60])
    pg.screenshot(path=SP+'t74_cal1.png')
    J(pg,"(()=>{const b=document.querySelector('#toast button');b&&b.click()})()");pg.wait_for_timeout(500)
    r=json.loads(J(pg,f"JSON.stringify([TASKS['{eid}'].due,TASKS['{eid}'].time||null])"))
    ok(r[0]==td and r[1]=='14:00' or (r[0]==td and r[1]),'되돌리기 → 원래 날·시각',r)
    b.close()
    print('ERRS',errs)
    print('FAILS',len(FAILS),FAILS)
