# v8.7 시험 — J8 주 N회 자리 · 카운터
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
J=lambda pg,x:pg.evaluate(x)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra) if extra!='' else ''))
    if not c:FAILS.append(msg)
def run_t(pg,W):
    r=J(pg,"""(()=>{
      const t=newTask({title:'시나리오쓰기',rep:{f:'x',n:5},due:null});t.rep={f:'x',n:5};t.due=addDays(weekStart(dateKey()),6);saveTask(t);
      const ws=weekStart(dateKey());const nw=addDays(ws,7);const mon=nw,wed=addDays(nw,2),fri=addDays(nw,4),sun=addDays(nw,6);
      const base=[ws,wed,addDays(ws,6)].map(k=>tasksOn(k).filter(x=>x.id===t.id).length);
      // 시간표에 끌어 놓기 흉내
      const put=(d,min,type)=>{DND.kind='task';DND.id=t.id;DND.el=null;DND.drop=type==='time'?{type:'time',date:d,min}:{type:'allday',date:d};dndEnd(0,0)};
      put(wed,14*60,'time');put(fri,0,'allday');put(mon,20*60,'time');
      const T=TASKS[t.id];
      const after=[mon,wed,fri,sun].map(k=>tasksOn(k).filter(x=>x.id===t.id).map(x=>x.time||'-'));
      return {base,sl:T.sl91,after,due:T.due,cnt:wkCnt91(T,weekStart(dateKey())),id:t.id,ws}})()""")
    ok(r['base']==[0,0,1],f'[{W}] 처음엔 일요일에만 뜸',r['base'])
    ok(r['sl'] and len(r['sl'])==3,f'[{W}] 끌어 놓으면 슬롯 3개(날짜 안 옮김)',r['sl'])
    ok(r['after']==[['20:00'],['14:00'],['-'],[]],f'[{W}] 슬롯 날에만 날마다 다른 시각으로 뜨고 일요일 기본 자리는 빠짐',r['after'])
    ok(r['cnt']==0,f'[{W}] 처음 횟수 0',r['cnt'])
    # 한 번 끝내면 횟수 +1, 같은 카드(aid) 다른 할 일도 셈
    r2=J(pg,"""(()=>{const T=TASKS['%s'],ws=weekStart(dateKey());
      completeTask(T);const c1=wkCnt91(TASKS['%s'],ws);
      // 슬롯 빼기: 서랍으로
      const wed=addDays(ws,2);DND.kind='task';DND.id=T.id;DND.el=null;
      return {c1,sl:Object.keys(TASKS['%s'].sl91||{}).length}})()"""%(r['id'],r['id'],r['id']));pg.wait_for_timeout(300)
    ok(r2['c1']==1,f'[{W}] 끝내면 이번 주 1',r2)
    row=J(pg,"taskRow(TASKS['%s'])"%r['id'])
    ok('1/5' in row,f'[{W}] 목록 줄에 1/5')
    # 캘린더 위 줄
    J(pg,"location.hash='cal'");pg.wait_for_timeout(1200)
    w=J(pg,"(()=>{const e=document.querySelector('.wk91');return e?e.textContent:''})()")
    ok('1/5' in w,f'[{W}] 캘린더 위 줄 n/N',w)
with sync_playwright() as p:
    b,pg=run(p,1400,900)
    run_t(pg,'pc')
    b.close()
    b,pg=run(p,390,800)
    run_t(pg,'phone')
    b.close()
print('ERRS',[e for e in errs if 'favicon' not in e][:5])
print('FAILS',len(FAILS),FAILS)
