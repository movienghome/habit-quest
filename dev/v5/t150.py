# t150 (v13.15): 카드 찾기 · 영역별 새 카드 · 그냥 한 일→카드 · 주 N회 건너뛰기 · 수면 동기화 · 홈 식사 칸 · 저장 보관·복원
import os,json
os.environ.setdefault('HQURL','file:///home/claude/habit-quest/beta/index.html')
exec(open('/home/claude/habit-quest/dev/v5/h61.py').read())
URL=os.environ.get('HQURL',URL)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
J=lambda pg,x:pg.evaluate(x)
VIS="""[...document.querySelectorAll('#actGroups .act[data-info^="act:"]')].filter(r=>r.offsetParent&&r.style.display!=='none'&&!r.hidden).map(r=>r.querySelector('.n').innerText.trim())"""
with sync_playwright() as pw:
    for W,H,nm in ((1200,900,'PC'),(390,800,'폰')):
        b0,pg=run(pw,W=W,H=H);closepops(pg)
        J(pg,"location.hash='log'");pg.wait_for_timeout(700)
        has=J(pg,"!!document.getElementById('aqb141')")
        ok(has,nm+' 행동/습관 제목줄에 🔍 단추')
        base=J(pg,VIS)
        pg.click('#aqb141');pg.wait_for_timeout(200)
        ok(J(pg,"!document.getElementById('aq141').hidden"),nm+' 🔍 누르면 찾기 줄')
        pg.keyboard.type('걷');pg.wait_for_timeout(500)
        v=J(pg,VIS)
        ok(len(v)>=1 and all('걷' in x or '몸' in x or True for x in v) and len(v)<len(base),nm+' 찾으면 줄어듦',v)
        ok(J(pg,"document.activeElement&&document.activeElement.id")=='aq141i',nm+' 칠 때 입력칸 포커스 유지')
        # 나쁜 카드는 '좋은' 거르기에서도 찾음
        J(pg,"(()=>{ui.aq141='술';renderLog()})()");pg.wait_for_timeout(200)
        v2=J(pg,VIS);print(v2)
        ok(any('술' in x for x in v2),nm+" '좋은' 거르기 중에도 나쁜 카드('술')를 찾음",v2)
        J(pg,"(()=>{ui.aq141='';ui.aq141open=false;renderLog()})()");pg.wait_for_timeout(150)
        ok(len(J(pg,VIS))==len(base),nm+' 닫으면 원래대로',(len(J(pg,VIS)),len(base)))
        # 영역별 ＋
        n_t=J(pg,"document.querySelectorAll('#actGroups .add141t').length")
        ok(n_t>=3,nm+' 영역마다 ＋ 새 카드 타일',n_t)
        ar=J(pg,"document.querySelectorAll('#actGroups .add141t')[1].dataset.add141")
        pg.click('#actGroups .add141t >> nth=1');pg.wait_for_timeout(250)
        ok(J(pg,"!!document.querySelector('#actGroups .add141f')"),nm+' 타일을 누르면 입력 줄')
        pg.fill('#actGroups .add141f input','테스트 카드 150');pg.click('#actGroups .add141f button[type=submit]');pg.wait_for_timeout(400)
        c=J(pg,"C.actions.find(a=>a.name==='테스트 카드 150')")
        ok(bool(c) and c['area']==ar and c['type']=='good',nm+' 그 영역에 새 카드가 생김',c)
        ok('테스트 카드 150' in J(pg,VIS),nm+' 목록에 바로 보임')
        # 그냥 한 일 → 카드로 만들기
        J(pg,"doFree('빠른 답장 150','m',C.areas[0].id)");pg.wait_for_timeout(300)
        t=J(pg,"document.getElementById('toast').innerText")
        ok('카드로 만들기' in t,nm+' 그냥 한 일 알림에 카드로 만들기',t)
        pg.click('#toast .tbtn55');pg.wait_for_timeout(300)
        ok(J(pg,"C.actions.some(a=>a.name==='빠른 답장 150'&&!a.once)"),nm+' 눌렀더니 반복 카드가 생김')
        # 옛 '한 번' 카드(끝낸 것)는 목록에서 빠져 있음 → 찾기 줄에서 되살림
        J(pg,"(()=>{const a=newAction(uid(),'한번카드150','good',C.areas[0].id,'1');a.doneAt=dateKey();C.actions.push(a);save('config');render()})()");pg.wait_for_timeout(300)
        ok('한번카드150' not in J(pg,VIS),nm+' 끝낸 한 번 카드는 목록에서 빠져 있음')
        J(pg,"(()=>{ui.aq141open=true;renderLog()})()");pg.wait_for_timeout(200)
        ok(J(pg,"!!document.querySelector('[data-rev141]')"),nm+' 찾기 줄에 끝낸 한 번 카드 되살리기')
        pg.click('[data-rev141]');pg.wait_for_timeout(300)
        J(pg,"(()=>{ui.aq141open=false;renderLog()})()")
        ok('한번카드150' in J(pg,VIS),nm+' 되살리니 목록에 다시 보임')
        # 주 N회 건너뛰기
        r=J(pg,"""(()=>{const td=midKey68();const t=newTask({title:'주3 시험150'});t.rep={f:'x',n:3};t.due=addDays(weekStart(td),6);t.sl91={[td]:'10:00'};saveTask(t);render();
          const before=tasksOn(td).some(x=>x.id===t.id);skipToday61(t);render();const after=tasksOn(td).some(x=>x.id===t.id);return {before,after,sl:t.sl91,skip:t.skip61,id:t.id}})()""")
        print(r)
        ok(r['before'] and not r['after'] and not r['sl'],nm+' 주 N회 오늘 자리 건너뛰기 → 캘린더에서 사라짐',r)
        J(pg,"document.querySelector('#toast .tbtn55')&&document.querySelector('#toast .tbtn55').click()");pg.wait_for_timeout(250)
        ok(J(pg,"!!(TASKS['%s'].sl91&&TASKS['%s'].sl91[midKey68()])"%(r['id'],r['id'])),nm+' 되돌리기로 자리 복구')
        # 수면 동기화
        J(pg,"render()");pg.wait_for_timeout(300)
        J(pg,"""(()=>{const k=gk76(),yk=addDays(k,-1),c7=C.actions.find(a=>(a.name||'').includes('7시간 이상')),cl=sleepCard73();[[k,c7],[yk,cl]].forEach(([d,c])=>{dayOf(d).entries=(dayOf(d).entries||[]).filter(e=>e.aid!==c.id)})})()""")
        r=J(pg,"""(()=>{const k=gk76(),yk=addDays(k,-1);dayOf(k).sl102={b:'01:30',w:'09:00',dr:0,ln:0};sleepSync141(k);
          const c7=C.actions.find(a=>/7\\s*시간\\s*이상/.test(a.name)),cl=sleepCard73();
          const e7=(dayOf(k).entries||[]).filter(e=>e.aid===c7.id),el=(dayOf(yk).entries||[]).filter(e=>e.aid===cl.id);
          return {c7:!!c7,cl:cl&&cl.name,opts:cl&&cl.opts&&cl.opts.length,e7:e7.length,e7f:e7[0]&&e7[0].sl141,el:el.length,elf:el[0]&&el[0].sl141,vid:el[0]&&el[0].vid}})()""")
        print(r, J(pg,"(()=>{const k=gk76();return JSON.stringify((dayOf(k).entries||[]).map(e=>[e.aid,e.name,e.sl141,e.note]))})()"))
        ok(r['e7']==1 and r['e7f']=='h7',nm+' 7시간 이상 잤다 자동 기록',r)
        ok(r['el']==1 and r['elf']=='late' and r['vid']=='s1',nm+' 늦게 잠: 01:30 → 1~2시 옵션(s1)',r)
        r=J(pg,"""(()=>{const k=gk76(),yk=addDays(k,-1);dayOf(k).sl102={b:'03:10',w:'09:00',dr:0,ln:0};sleepSync141(k);
          const c7=C.actions.find(a=>/7\\s*시간\\s*이상/.test(a.name)),cl=sleepCard73();
          return {e7:(dayOf(k).entries||[]).filter(e=>e.aid===c7.id).length,el:(dayOf(yk).entries||[]).filter(e=>e.aid===cl.id).map(e=>e.vid)}})()""")
        ok(r['e7']==0 and r['el']==['s3'],nm+' 03:10 → 3~4시(s3)로 고침 · 겹쳐 안 쌓임 · 5h50이라 7시간 기록은 지워짐',r)
        r=J(pg,"""(()=>{const k=gk76(),yk=addDays(k,-1);dayOf(k).sl102={b:'23:30',w:'05:00',dr:0,ln:0};sleepSync141(k);
          const c7=C.actions.find(a=>/7\\s*시간\\s*이상/.test(a.name)),cl=sleepCard73();
          return {e7:(dayOf(k).entries||[]).filter(e=>e.aid===c7.id).length,el:(dayOf(yk).entries||[]).filter(e=>e.aid===cl.id).length}})()""")
        ok(r['e7']==0 and r['el']==0,nm+' 23:30→05:00(5.5h): 둘 다 지움',r)
        # 직접 적은 늦게 잠은 안 건드림
        r=J(pg,"""(()=>{const k=gk76(),yk=addDays(k,-1),cl=sleepCard73();withDay69(yk,()=>doAction(cl,{direct:true,at:'03:00',vid:'s3'}));
          dayOf(k).sl102={b:'01:30',w:'09:00',dr:0,ln:0};sleepSync141(k);
          return (dayOf(yk).entries||[]).filter(e=>e.aid===cl.id).map(e=>[e.vid,e.sl141||''])})()""")
        ok(len(r)==1 and r[0][1]=='',nm+' 직접 적은 늦게 잠은 그대로(중복 없음)',r)
        # 홈 식사 칸
        J(pg,"location.hash='home'");pg.wait_for_timeout(600)
        ok(J(pg,"!!document.getElementById('meal141')&&document.getElementById('meal141').offsetParent!==null"),nm+' 홈에 식사 칸')
        fid=J(pg,"C.food.find(f=>f.kind!=='check').id")
        pg.click('#meal141 [data-food="%s"][data-d="1"]'%fid);pg.wait_for_timeout(300)
        ok(J(pg,"(today().food||{})['%s']"%fid)==1,nm+' 홈에서 + 누르면 오늘 식사 횟수 1')
        J(pg,"(()=>{C.pin133=[C.actions.find(a=>a.type==='good'&&!a.doneAt).id];render()})()");pg.wait_for_timeout(300)
        n0=J(pg,"today().entries.length")
        pg.click('#meal141 [data-p141]');pg.wait_for_timeout(300)
        ok(J(pg,"today().entries.length")==n0+1,nm+' 📌 고정 행동을 홈에서 바로 기록')
        # 저장 보관
        J(pg,"""(()=>{window.__quota=1;const _d=db.doc.bind(db);db.doc=p=>{const r=_d(p);const m=r.merge;r.merge=async f=>{if(window.__quota)throw Object.assign(new Error('Quota exceeded'),{code:'resource-exhausted'});return m(f)};return r}})()""")
        J(pg,"(()=>{C.test141=1;save('config')})()");pg.wait_for_timeout(1800)
        pend=J(pg,"JSON.parse(localStorage.getItem('hq-pend-b')||'{}')")
        ok('config' in pend and 'test141' in pend['config']['m'],nm+' 저장 실패(한도) → 기기에 보관',list(pend.keys()))
        ok(J(pg,"!!document.getElementById('err69')"),nm+' 빨간 띠 표시')
        J(pg,"(()=>{delete C.test141;dirty.clear();pendRestore141()})()");pg.wait_for_timeout(200)
        ok(J(pg,"C.test141")==1 and J(pg,"dirty.has('config')"),nm+' 새로 열었을 때 보관본이 서버 것과 합쳐져 되살아남')
        J(pg,"window.__quota=0");
        ok(not [e for e in errs if 'PAGEERR' in e],nm+' 페이지 오류 없음',[e for e in errs if 'PAGEERR' in e][:2])
        b0.close()
print('FAILS',len(FAILS),FAILS)
