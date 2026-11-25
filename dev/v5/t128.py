import os,json
os.environ.setdefault('HQURL','file:///home/claude/habit-quest/beta/index.html')
exec(open('/home/claude/habit-quest/dev/v5/h61.py').read())
ok=[]
def chk(n,c):
    ok.append(bool(c));print(('PASS ' if c else 'FAIL ')+n)
with sync_playwright() as pw:
    # ---- ① 경고는 최소 기준 ----
    b,pg=run(pw,W=1400,H=900);closepops(pg)
    J=lambda x:pg.evaluate(x)
    J("""(()=>{const a=newTask({title:'시나리오 쓰기'});a.rep={f:'x',n:5};a.due=midKey68();a.dur=30;saveTask(a);window.__a=a.id;C.mig120=1;C.mig121=1;location.hash='cal';render()})()""");pg.wait_for_timeout(900)
    r=J("""(()=>{const t=TASKS[window.__a],ws=weekStart(midKey68()),fri=addDays(ws,4);
      const o={};delete t.min119;o.goal=slack99(t,fri,5);t.min119=3;o.min3=slack99(t,fri,5);t.min119=2;o.min2=slack99(t,fri,5);delete t.min119;return JSON.stringify(o)})()""")
    r=json.loads(r);print(r)
    chk('최소 없으면 목표 기준(5번 필요·하루 두 번)',r['goal']['need']==5 and r['goal']['slack']<0)
    chk('최소 3이면 3번 기준·쉬는 날 없이(slack 0)',r['min3']['need']==3 and r['min3']['slack']==0 and r['min3']['min']==3)
    chk('최소 2면 경고 없음(slack>0)',r['min2']['need']==2 and r['min2']['slack']>0)
    # 최소 채움 → 경고 없음 + 상태 문구
    J("""(()=>{const t=TASKS[window.__a];t.min119=3;saveTask(t);const k=dateKey();for(let i=0;i<3;i++){completeTask(TASKS[window.__a])}window.__n=wkCnt91(TASKS[window.__a],weekStart(midKey68()))})()""");pg.wait_for_timeout(600);closepops(pg)
    n=J("wkCnt91(TASKS[window.__a],weekStart(midKey68()))");print('n',n)
    # ---- ⑤ 칩 상세 화면 ----
    J("(()=>{C.ui.cal.mode='week';ui.calAnchor=midKey68();ui.calSel=midKey68();save('config');renderCal()})()");pg.wait_for_timeout(800)
    chk('칩이 보임',pg.locator('.wk91 .c91.k105[data-wk105="%s"]'%J("window.__a")).count()==1)
    pg.locator('.wk91 .c91.k105[data-wk105="%s"]'%J("window.__a")).click();pg.wait_for_timeout(600)
    chk('새 상세 화면',pg.locator('.w121c').count()==1 and pg.locator('.w121c .n121').count()==1)
    chk('큰 숫자 = 한 횟수',pg.locator('.w121c .n121').inner_text().strip()==str(n))
    chk('요일 7칸',pg.locator('.w121c .wd121').count()==7)
    chk('막대+최소 표시',pg.locator('.w121c .bar121 .m121').count()==1 and '최소 3' in pg.locator('.w121c .lg121').inner_text())
    if n>=3:chk('최소 달성 문구',('최소 3회는 채웠어요' in pg.locator('.w121c .st121').inner_text()) or n>=5)
    # 목표 − ＋ , 최소 − ＋
    pg.locator('[data-wk105n$=":-1"]').click();pg.wait_for_timeout(500)
    chk('이상 목표 줄이기(5→4)',J("TASKS[window.__a].rep.n")==4 and pg.locator('.w121c').count()==1)
    pg.locator('[data-min120$=":-1"]').click();pg.wait_for_timeout(500)
    chk('최소 줄이기(3→2)',J("TASKS[window.__a].min119")==2 and pg.locator('.w121c').count()==1)
    for i in range(4):
        if pg.locator('[data-wk105n$=":-1"]').count():pg.locator('[data-wk105n$=":-1"]').click();pg.wait_for_timeout(250)
    chk('목표를 줄이면 최소가 목표보다 작게 유지',J("(()=>{const t=TASKS[window.__a];return !t.min119||t.min119<t.rep.n})()"))
    chk('열린 상세 줄에 기록 접힘',pg.locator('details.rec121').count()==1 and not pg.locator('details.rec121').get_attribute('open'))
    # 모양 크기
    J("closeSheet()");pg.wait_for_timeout(300)
    J("(()=>{const t=TASKS[window.__a];t.rep.n=5;t.min119=3;const k=addDays(midKey68(),1);t.sl91={};t.sl91[k]='10:00';saveTask(t);render()})()");pg.wait_for_timeout(700)
    sz=J("""(()=>{const o={};['s-done','s-tr','s-miss','s-plan','s-fut'].forEach(c=>{const e=document.querySelector('.wk91 .d99.'+c);if(!e){o[c]=null;return}const r=e.getBoundingClientRect(),b=getComputedStyle(e,'::before');o[c]={w:r.width,h:r.height,bw:b.width,bh:b.height,txt:e.textContent}});return JSON.stringify(o)})()""")
    sz=json.loads(sz);print(sz)
    chk('점 5종 모양 있음(앞으로·정한 날 포함)',sz.get('s-fut') and sz.get('s-plan') and sz.get('s-done'))
    chk('점 글자 없음(모양으로)',all(len((v or {}).get('txt',''))<=1 for v in sz.values()))
    chk('앞으로 점이 6px 이상',sz['s-fut'] and float(sz['s-fut']['bw'][:-2])>=6)
    chk('틀 크기 모두 같음',len({(v['w'],v['h']) for v in sz.values() if v})==1)
    b.close()
    # ---- ③ 하나 그리고 둘: 이름·필터 ----
    for name,flt in [('반복만 보이기',"{lists:[],areas:[],tags:[],kinds:['rep'],inv:0}"),('목록 고르기',"{lists:['inbox'],areas:[],tags:[],kinds:[],inv:0,known:['inbox']}")]:
        b,pg=run(pw,W=1400,H=900);closepops(pg)
        J=lambda x:pg.evaluate(x)
        J("""(()=>{const a=newTask({title:'시나리오 쓰기'});a.rep={f:'x',n:5};a.min119=3;a.due=midKey68();a.dur=30;saveTask(a);window.__a=a.id;C.mig120=1;C.mig121=1;C.mig77f=1;C.calf77=%s;location.hash='cal';render()})()"""%flt);pg.wait_for_timeout(900)
        J("(()=>{C.ui.cal.mode='week';ui.calAnchor=midKey68();ui.calSel=midKey68();save('config');renderCal()})()");pg.wait_for_timeout(700)
        J("""(()=>{const t=TASKS[window.__a];const k=addDays(midKey68(),1);t.sl91={};t.sl91[k]='10:00';saveTask(t);window.__k=k;ui.calAnchor=k;ui.calSel=k;renderCal();render()})()""");pg.wait_for_timeout(800)
        chk(name+': 시나리오 쓰기 칸 보임',pg.locator('.blk[data-ctask="%s"]'%J("window.__a")).count()>=1)
        J("daySheet120(window.__a,window.__k)");pg.wait_for_timeout(500)
        pg.locator('[data-d120="hg"]').click();pg.wait_for_timeout(900)
        hid=J("(()=>{const h=Object.values(TASKS).find(t=>t.hg119===window.__a);return h&&h.id})()")
        chk(name+': 이름 하나 그리고 둘 · 정해진 일정(fixed)',J("(()=>{const h=TASKS['%s'];return !!h&&h.title==='하나 그리고 둘'&&h.list===fixId122()&&h.list!=='fixed'&&h.time==='10:00'})()"%hid))
        chk(name+': 캘린더(시간표)에 남음',pg.locator('.blk[data-ctask="%s"]'%hid).count()>=1)
        chk(name+': 시나리오 쓰기 칸은 빠짐',pg.locator('.blk[data-ctask="%s"]'%J("window.__a")).count()==0)
        if name=='반복만 보이기':
            # 끝내면 월 보기에서도 남음
            J("(()=>{const h=TASKS['%s'];h.due=midKey68();saveTask(h);completeTask(h)})()"%hid);pg.wait_for_timeout(800);closepops(pg)
            J("(()=>{C.ui.cal.mode='month';ui.calAnchor=midKey68();renderCal()})()");pg.wait_for_timeout(800)
            chk(name+': 끝낸 뒤에도 월 칸에 보임',pg.locator('.mgrid .cchip.done[data-ctask="%s"]'%hid).count()>=1)
        b.close()
    # 옛 이름 이주
    b,pg=run(pw,W=1400,H=900);closepops(pg)
    J=lambda x:pg.evaluate(x)
    J("""(()=>{const a=newTask({title:'시나리오 쓰기'});a.rep={f:'x',n:5};saveTask(a);const h=newTask({title:'하그둘'});h.list='fixed';h.due=midKey68();h.hg119=a.id;saveTask(h);window.__h=h.id;C.mig121=0;render()})()""");pg.wait_for_timeout(1200)
    chk('옛 하그둘 이름 이주',J("TASKS[window.__h].title")=='하나 그리고 둘')
    # ---- ② 상세 반복 칸 최소 ----
    J("openTaskSheet(Object.values(TASKS).find(t=>t.title==='시나리오 쓰기').id)");pg.wait_for_timeout(700)
    J("(()=>{const el=document.querySelector('#sheetC [data-x56panel=\"when\"]');if(el)el.click()})()");pg.wait_for_timeout(500)
    chk('상세에 최소 입력칸',pg.locator('#tsRepMin').count()==1)
    if pg.locator('#tsRepMin').count():
        pg.fill('#tsRepMin','3');pg.locator('#tsRepMin').blur();pg.wait_for_timeout(500)
        J("tsRead();saveTask(TASKS[sheetCtx.task])")
        chk('최소 3 저장',J("Object.values(TASKS).find(t=>t.title==='시나리오 쓰기').min119")==3)
        chk('한 주에 칸 이상 목표 글자',('이상 목표' in J("document.getElementById('sheetC').innerText")))
    b.close()
    # ---- ⑥ 막대 크기 ----
    M="""(()=>{const out={};const g=document.querySelector('.mgrid');const pick=(k,s)=>{const e=g.querySelector(s);out[k]=e?+e.getBoundingClientRect().height.toFixed(2):null};
      pick('undone','.mc .cchip:not(.done):not(.bar83)');pick('done','.mc .cchip.done.d84');pick('bar','.bar83:not(.d119)');pick('barDone','.bar83.d119');return JSON.stringify(out)})()"""
    for W in (1400,420):
        b,pg=run(pw,W=W,H=900);closepops(pg)
        J=lambda x:pg.evaluate(x)
        J("""(()=>{const td=midKey68();const mk=(ti,o)=>{const t=newTask({title:ti});Object.assign(t,o);saveTask(t);return t};
          mk('안한할일',{due:addDays(td,1)});const d1=mk('한할일',{due:addDays(td,1)});mk('안한며칠',{due:addDays(td,3),end71:addDays(td,5)});const d3=mk('한며칠',{due:addDays(td,3),end71:addDays(td,5)});
          window.__d=[d1.id,d3.id];C.ui.cal.mode='month';ui.calAnchor=td;location.hash='cal';save('config');render()})()""");pg.wait_for_timeout(1000)
        J("window.__d.forEach(id=>completeTask(TASKS[id]))");pg.wait_for_timeout(1000);closepops(pg)
        J("(()=>{C.ui.cal.mode='month';ui.calAnchor=midKey68();renderCal()})()");pg.wait_for_timeout(1000)
        s=json.loads(J(M));print(W,s)
        u=s['undone']
        chk('%d 안 한 칩 높이 있음'%W,u and u>10)
        chk('%d 끝낸 칩 = 안 한 칩 높이'%W,s['done'] and abs(s['done']-u)<0.6)
        chk('%d 열린 막대 = 안 한 칩 높이'%W,s['bar'] and abs(s['bar']-u)<0.6)
        chk('%d 끝낸 막대 = 안 한 칩 높이'%W,s['barDone'] and abs(s['barDone']-u)<0.6)
        # 막대와 아래 칩이 겹치지 않는지(막대 아래 끝 ≤ 같은 칸 다음 칩 위)
        ov=J("""(()=>{const g=document.querySelector('.mgrid');const bars=[...g.querySelectorAll('.bar83')].map(b=>b.getBoundingClientRect());let bad=0;
          g.querySelectorAll('.mc .cchip').forEach(c=>{const r=c.getBoundingClientRect();if(r.height<2)return;bars.forEach(b=>{if(r.left<b.right-1&&r.right>b.left+1&&r.top<b.bottom-0.5&&r.bottom>b.top+0.5)bad++})});return bad})()""")
        chk('%d 막대와 칩이 겹치지 않음'%W,ov==0)
        if W==1400:pg.screenshot(path='/tmp/work/t128_month.png')
        b.close()
    errs_page=[e for e in errs if e.startswith('PAGEERR')]
    chk('페이지 오류 없음',len(errs_page)==0)
    if errs_page:print(errs_page[:3])
import sys;sys.exit(0 if all(ok) else 1)
