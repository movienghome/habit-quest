# t179 (v13.36): 관리 미리 함 · 묶음 머리 카드 경보 없음 · 오늘 한 일 전체 보기 숨김 · 첫 그리기 뒤 보이기 · 🛟 단계 사본 · 주 N회 같은 옵션만 · 피드 📏
import os,json
os.environ.setdefault('HQURL','file:///home/claude/habit-quest/beta/index.html')
exec(open('/home/claude/habit-quest/dev/v5/h61.py').read())
URL=os.environ.get('HQURL',URL)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
J=lambda pg,x:pg.evaluate(x)
def notoast(pg):J(pg,"(()=>{const t=document.getElementById('toast');if(t){t.classList.remove('on');t.style.pointerEvents=''}})()")
with sync_playwright() as pw:
  for W,H in [(1200,1000),(390,800)]:
    b,pg=run(pw,W=W,H=H);closepops(pg);notoast(pg)
    ok(J(pg,"document.documentElement.classList.contains('ok156')"),f'[{W}] 첫 그리기 뒤 html.ok156')
    # ① 관리: 지난주 차례를 놓치고(밀림) 이번 차례 전날 끝냄 → 다음 차례는 다음 주
    r=J(pg,"""(()=>{const td=midKey68(),tm=addDays(td,1),wd=dowOf(tm);
      const t=newTask({title:'베개 빨래 시험',list:'inbox'});t.rep={f:'w',i:1,wd:[wd]};t.due=addDays(tm,-7);t.care76=1;saveTask(t);
      completeTask(t,{direct:1});const T=TASKS[t.id];return {due:T.due,want:addDays(tm,7),last:T.last}})()""")
    ok(r['due']==r['want'],f'[{W}] 미리 끝낸 요일 관리 → 다음 주 차례',r)
    # 2주마다: 제 차례에 하면 그대로 2주 뒤
    r=J(pg,"""(()=>{const td=midKey68(),wd=dowOf(td);
      const t=newTask({title:'이불 빨래 시험',list:'inbox'});t.rep={f:'w',i:2,wd:[wd]};t.due=td;t.care76=1;saveTask(t);
      completeTask(t,{direct:1});return {due:TASKS[t.id].due,want:addDays(td,14)}})()""")
    ok(r['due']==r['want'],f'[{W}] 2주마다 제 차례 → 2주 뒤 그대로',r)
    # n일마다는 안 건드림
    r=J(pg,"""(()=>{const td=midKey68();const t=newTask({title:'7일 관리',list:'inbox'});t.rep={f:'d',i:7};t.due=td;t.care76=1;saveTask(t);completeTask(t,{direct:1});return {due:TASKS[t.id].due,want:addDays(td,7)}})()""")
    ok(r['due']==r['want'],f'[{W}] n일마다 관리는 그대로',r)
    # 이미 어긋난 것 한 번 바로잡기
    r=J(pg,"""(()=>{const td=midKey68(),wd=dowOf(td);const t=newTask({title:'어긋난 관리',list:'inbox'});t.rep={f:'w',i:1,wd:[wd]};t.due=td;t.last=addDays(td,-1);t.care76=1;saveTask(t);
      delete C.mig156c;render();return {due:TASKS[t.id].due,want:addDays(td,7)}})()""")
    pg.wait_for_timeout(300)
    ok(r['due']==r['want'],f'[{W}] 이미 어긋난 관리 한 번 바로잡기',r)
    notoast(pg)
    # ② 묶음 머리 카드 경보 없음
    r=J(pg,"""(()=>{const a=newAction(uid(),'집 청소 시험','good',C.areas[0].id,'');C.actions.push(a);C.watches.push({action:a.id,days:3,penalty:20});
      const h=newTask({title:'집 청소 시험',list:'inbox'});h.aid=a.id;h.rep={f:'d',i:7};h.due=midKey68();h.care76=1;saveTask(h);
      const k=newTask({title:'키보드 시험',list:'inbox'});k.parent=h.id;k.rep={f:'d',i:30};k.due=addDays(midKey68(),5);k.care76=1;saveTask(k);
      const b2=newAction(uid(),'운동 시험','good',C.areas[0].id,'');C.actions.push(b2);C.watches.push({action:b2.id,days:3,penalty:20});
      const od=addDays(gk76(),-10),D=dayOf(od);D.entries=D.entries||[];[a,b2].forEach(x=>D.entries.push({id:uid(),kind:'act',aid:x.id,name:x.name,type:'good',t:'09:00',xp:1}));nlClear69();
      save('config');render();const L=neglectList(dateKey()).map(x=>x.w.action);return {fold:L.includes(a.id),other:L.includes(b2.id),hab:todayHabits().some(x=>x.a&&x.a.id===a.id)}})()""")
    ok(not r['fold'],f'[{W}] 관리 묶음 머리 카드 방치 경보 없음',r)
    ok(r['other'],f'[{W}] 다른 카드 경보는 그대로',r)
    ok(not r['hab'],f'[{W}] 할 일 경보 칸에도 없음',r)
    # ③ 오늘 한 일 '전체 보기' 숨김
    J(pg,"location.hash='home'");pg.wait_for_timeout(500)
    r=J(pg,"(()=>{const a=document.querySelector('.hblock[data-hid=\"todaylog\"] .ptitle a[href=\"#log\"]');return a?getComputedStyle(a).display:'none'})()")
    ok(r=='none',f'[{W}] 오늘 한 일 전체 보기 링크 숨김',r)
    r=J(pg,"""(async()=>{const day=curDay();day.entries=day.entries||[];for(let i=0;i<11;i++){const a=C.actions.find(x=>x.type==='good');day.entries.push({id:uid(),kind:'act',aid:a.id,name:a.name+i,type:'good',t:'1'+(i%10)+':00',xp:1})}homeLog98();await new Promise(r=>setTimeout(r,300));render();await new Promise(r=>setTimeout(r,200));
      const n1=document.querySelectorAll('#homeLog>li:not(.more98)').length;document.querySelector('[data-c98more]').click();await new Promise(r=>setTimeout(r,200));
      return {n1,n2:document.querySelectorAll('#homeLog>li:not(.more98)').length,hash:location.hash}})()""")
    ok(r['n2']>r['n1'] and 'home' in r['hash'],f'[{W}] 그 자리에서 펼침',r)
    notoast(pg);J(pg,"closeSheet&&closeSheet()")
    # ⑤ 루틴 단계 지우면 사본 → 🛟에서 되살리기
    r=J(pg,"""(()=>{const rr=rtNew61('Vesper 시험',[{name:'문 밖으로',min:10},{name:'걷기',min:20},{name:'한 줄 정리',min:5}]);setRt60(rr,[0,1,2,3,4,5,6]);sync62(rr);
      const s=rr.steps[0],tid=s.tid;unstep62(rr,0,true);const g=JSON.parse(localStorage.getItem('hq-gone156-b')||localStorage.getItem('hq-gone156')||'[]');window.__r=rr.id;window.__tid=tid;
      return {gone:!TASKS[tid],log:g.some(x=>x.t&&x.t.id===tid),n:rr.steps.length}})()""")
    ok(r['gone'] and r['log'],f'[{W}] 지운 단계 사본 남음',r)
    J(pg,"lastPt={x:200,y:200};openInfo('rescue147')");pg.wait_for_timeout(300)
    ok(J(pg,"!!document.querySelector('[data-rs156]')"),f'[{W}] 🛟에 지워진 단계 줄')
    J(pg,"document.querySelector('[data-rs156]').click()");pg.wait_for_timeout(400)
    r=J(pg,"({back:!!TASKS[window.__tid],inR:C.routines.find(x=>x.id===window.__r).steps.some(s=>s.tid===window.__tid)})")
    ok(r['back'] and r['inR'],f'[{W}] 🛟 되살리기 → 루틴 단계로 돌아옴',r)
    J(pg,"closeInfo&&closeInfo()");notoast(pg)
    # 🛟: 같은 이름 루틴이 있으면 옛 프리셋 안 내밂
    r=J(pg,"""(()=>{const x=rtNew61('🌅 Eos',[{name:'몸무게',min:1}]);C.routines=C.routines.filter(r=>r.id!=='r-vesper'&&!/Vesper/.test(r.name));const b2=infoFor('rescue147').b;return {eos:/data-id="r-eos"/.test(b2),ves:/data-id="r-vesper"/.test(b2)}})()""")
    ok((not r['eos']) and r['ves'],f'[{W}] 🛟 이미 있는 Eos 옛 프리셋은 안 보임',r)
    # ⑥ 주 N회: 같은 카드 다른 할 일은 같은 옵션만
    r=J(pg,"""(()=>{const a=newAction(uid(),'빨래 시험','good',C.areas[0].id,'');a.opts=[{id:'o1',name:'옷 빨래',cond:3,xp:4,gold:1},{id:'o2',name:'이불 빨래',cond:5,xp:10,gold:2}];C.actions.push(a);save('config');
      const w=newTask({title:'빨래 주2',list:'inbox'});w.aid=a.id;w.av151='o1';w.rep={f:'x',n:2};w.due=midKey68();saveTask(w);
      const c=newTask({title:'이불 빨래 관리',list:'inbox'});c.aid=a.id;c.av151='o2';c.rep={f:'d',i:14};c.due=midKey68();c.care76=1;saveTask(c);
      completeTask(c,{direct:1});const k=gk76();const n1=dayCnt99(w,k).n;
      const c2=newTask({title:'옷 빨래 다른 할 일',list:'inbox'});c2.aid=a.id;c2.av151='o1';c2.due=midKey68();saveTask(c2);completeTask(c2,{direct:1});
      return {n1,n2:dayCnt99(w,k).n,vid:(curDay().entries||[]).filter(e=>e.tid===c.id).map(e=>e.vid)}})()""")
    pg.wait_for_timeout(300)
    ok(r['n1']==0,f'[{W}] 이불 빨래(다른 옵션)는 주 2회에 안 셈',r)
    ok(r['n2']==1,f'[{W}] 같은 옵션 다른 할 일은 셈',r)
    notoast(pg);J(pg,"closeSheet&&closeSheet()")
    # ⑦ 피드·쇼츠 📏
    r=J(pg,"""(()=>{let a=C.actions.find(x=>/피드/.test(x.name)&&/쇼츠/.test(x.name));if(!a){a=newAction('b4','피드·쇼츠 1시간 넘게','bad',C.areas[0].id,'');a.cond=-12;C.actions.push(a)}else{a.name='피드·쇼츠 1시간 넘게';a.cond=-12;delete a.opts;delete a.unit152}
      delete C.mig156f;render();return {name:a.name,unit:a.unit152,opts:(a.opts||[]).map(o=>o.name+':'+o.cond+':'+JSON.stringify(o.q)),pick:typeof qPick152==='function'?(qPick152(a,90)||{}).name:null}})()""")
    ok(r['name']=='피드·쇼츠' and r['unit']=='분' and len(r['opts'])==5,f'[{W}] 피드·쇼츠 시간 옵션 5개·분',r)
    ok(r['pick']=='1~2시간',f'[{W}] 90분 → 1~2시간',r)
    b.close()
E=[e for e in errs if 'PAGEERR' in e]
print('ERRS',len(E),E[:3])
print('FAILS',len(FAILS),FAILS)
