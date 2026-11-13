# v8.8 시험 — J8 남은 둘: 합친 횟수 다음 주 넘김 · 월 칸 자리
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
J=lambda pg,x:pg.evaluate(x)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra) if extra!='' else ''))
    if not c:FAILS.append(msg)
def run_roll(pg,W):
    r=J(pg,"""(()=>{
      const a=C.actions.find(x=>!(x.opts&&x.opts.length));const ws=weekStart(dateKey());
      const s=newTask({title:'시나리오쓰기'});s.rep={f:'x',n:5};s.due=addDays(ws,6);s.aid=a.id;saveTask(s);
      const h=newTask({title:'하그둘'});h.rep={f:'d',i:1};h.due=dateKey();h.aid=a.id;saveTask(h);
      const S=()=>TASKS[s.id],H=()=>TASKS[h.id];
      completeTask(S(),{direct:true});completeTask(S(),{direct:true});
      const o={ws,d0:S().due,c0:wkCnt91(S(),ws)};
      completeTask(H(),{direct:true});completeTask(H(),{direct:true});
      o.d1=S().due;o.c1=wkCnt91(S(),ws);
      completeTask(H(),{direct:true});
      o.d2=S().due;o.c2=wkCnt91(S(),ws);o.wc2=JSON.stringify(S().wc);
      const day=curDay();const e=day.entries.find(z=>z.tid===h.id);o.roll=JSON.stringify(e&&e.roll91);
      o.sid=s.id;o.hid=h.id;o.date=day.date;o.eid=e&&e.id;return o})()""")
    ok(r['c0']==2 and r['d0']==r['ws'][:0]+J(pg,"addDays('%s',6)"%r['ws']),f'[{W}] 시나리오 2번 → 아직 이번 주',r)
    ok(r['c1']==4 and r['d1']==r['d0'],f'[{W}] 합쳐 4/5면 안 넘어감',r['d1'])
    nxt=J(pg,"addDays('%s',13)"%r['ws'])
    ok(r['c2']==5 and r['d2']==nxt,f'[{W}] 합쳐 5/5면 다음 주로 넘어감',(r['d2'],nxt))
    ok(r['roll'] and 'pd' in r['roll'],f'[{W}] 남의 할 일 넘김이 기록에 적힘',r['roll'])
    u=J(pg,"""(()=>{const e=curDay().entries.find(z=>z.tid==='%s');removeEntry('%s',e.id);
      const T=TASKS['%s'];return {due:T.due,wc:JSON.stringify(T.wc)}})()"""%(r['hid'],r['date'],r['sid']))
    ok(u['due']==r['d0'],f'[{W}] 마지막 기록을 지우면 시나리오 due 되돌아옴',u)
def run_month(pg,W):
    r=J(pg,"""(()=>{
      const t=newTask({title:'월칸시험'});t.rep={f:'x',n:3};const ws=weekStart(dateKey()),nw=addDays(ws,7);t.due=addDays(ws,6);saveTask(t);
      const wed=addDays(nw,2),fri=addDays(nw,4),mon=nw,sun=addDays(nw,6);
      const put=(d,min,type)=>{DND.kind='task';DND.id=t.id;DND.el=null;DND.drop=type==='time'?{type:'time',date:d,min}:{type:'allday',date:d};dndEnd(0,0)};
      put(wed,14*60,'time');put(fri,0,'allday');put(mon,20*60,'time');
      const days=spanDays71(TASKS[t.id]);
      C.ui.cal=C.ui.cal||{};C.ui.cal.mode='month';ui.calAnchor=nw;save('config');location.hash='cal';render();
      return {days,mon,wed,fri,sun,tsun:addDays(ws,6),id:t.id}})()""");pg.wait_for_timeout(1200)
    ok(set(r['days'])=={r['tsun'],r['mon'],r['wed'],r['fri']},f'[{W}] 월 칸 날짜 = 이번 주 기본 자리 + 다음 주 슬롯 날 셋(다음 주 일요일 없음)',r['days'])
    m=J(pg,"""(k=>[...document.querySelectorAll('[data-calday]')].filter(c=>c.textContent.includes('월칸시험')).map(c=>c.dataset.calday))()""")
    ok(set(m)=={r['tsun'],r['mon'],r['wed'],r['fri']} and r['sun'] not in m,f'[{W}] 월 보기 화면: 슬롯 있는 주는 슬롯 날에만 칩',m)
    pg.screenshot(path='/tmp/t87_month_%s.png'%W)
with sync_playwright() as p:
    for W,w,h in (('pc',1400,900),('phone',390,800)):
        b,pg=run(p,w,h);run_roll(pg,W);b.close()
        b,pg=run(p,w,h);run_month(pg,W);b.close()
print('ERRS',[e for e in errs if 'favicon' not in e][:5])
print('FAILS',len(FAILS),FAILS)
