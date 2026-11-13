# v8.6 시험 — B9 묶인 할 일은 머리의 영역을 따라감
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
J=lambda pg,x:pg.evaluate(x)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra) if extra!='' else ''))
    if not c:FAILS.append(msg)
def run_t(pg,W):
    r=J(pg,"""(()=>{
      const ar=C.areas.map(a=>a.id);const A=ar[0],B=ar[1];
      const h=newTask({title:'머리'});h.area=A;saveTask(h);
      const k1=newTask({title:'자식1'});k1.parent=h.id;saveTask(k1);
      const k2=newTask({title:'자식2'});k2.parent=h.id;k2.area=B;saveTask(k2);
      const g=newTask({title:'손자'});g.parent=k1.id;saveTask(g);
      const h0=newTask({title:'영역없는머리'});saveTask(h0);
      const k0=newTask({title:'영역없는자식'});k0.parent=h0.id;saveTask(k0);
      const cyc=newTask({title:'순환'});cyc.parent=cyc.id;saveTask(cyc);
      return {A,B,k1:areaOfTask(TASKS[k1.id]),k2:areaOfTask(TASKS[k2.id]),g:areaOfTask(TASKS[g.id]),k0:areaOfTask(TASKS[k0.id]),h:areaOfTask(TASKS[h.id]),cyc:areaOfTask(TASKS[cyc.id]),id:k1.id}})()""")
    ok(r['k1']==r['A'],f'[{W}] 자식은 머리 영역을 따라감',r)
    ok(r['k2']==r['B'],f'[{W}] 자식이 따로 정한 영역이 우선')
    ok(r['g']==r['A'],f'[{W}] 손자도 머리까지 거슬러 올라감')
    ok(r['k0'] is None and r['cyc'] is None,f'[{W}] 영역 없으면 null · 순환도 멈춤')
    # 끝내면 기록의 영역이 머리 영역
    J(pg,"completeTask(TASKS['%s'])"%r['id']);pg.wait_for_timeout(300)
    e=J(pg,"(()=>{const d=DAYS[dateKey()]||{};const es=(d.entries||d.log||[]);return es.filter(x=>x.name==='자식1').map(x=>x.area)})()")
    ok(e and e[-1]==r['A'],f'[{W}] 자식 끝낸 기록의 영역 = 머리 영역',e)
with sync_playwright() as p:
    b,pg=run(p,1400,900)
    run_t(pg,'pc')
    b.close()
    b,pg=run(p,390,800)
    run_t(pg,'phone')
    b.close()
print('ERRS',[e for e in errs if 'favicon' not in e][:5])
print('FAILS',len(FAILS),FAILS)
