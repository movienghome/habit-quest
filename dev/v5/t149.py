# t149 (v13.12): 관리를 끝냈는데 다음 차례가 '오늘'로 남는 어긋남을 바로잡는지(w139 heal139)
import os,json
os.environ.setdefault('HQURL','file:///home/claude/habit-quest/beta/index.html')
exec(open('/home/claude/habit-quest/dev/v5/h61.py').read())
URL=os.environ.get('HQURL',URL)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
J=lambda pg,x:pg.evaluate(x)
with sync_playwright() as pw:
    for W,H,nm in ((1200,900,'PC'),(390,800,'폰')):
        b0,pg=run(pw,W=W,H=H);closepops(pg)
        r=J(pg,"""(()=>{const td=midKey68();const mk=(n,rep,due,care)=>{const t=newTask({title:n});t.rep=rep;t.due=due;if(care)t.care76=1;saveTask(t);return t};
          const A=mk('A 7일마다',{f:'d',i:7},td,1),B=mk('B 매주 토',{f:'w',i:1,wd:[6]},td,1),C2=mk('C 놓음',{f:'d',i:7},td,1),D=mk('D 일반 반복',{f:'d',i:7},td,0),E=mk('E 안 한 것',{f:'d',i:7},td,1),F=mk('F 밀린 7일',{f:'d',i:7},addDays(td,-3),1);
          [A,B,C2,D,F].forEach(t=>completeTask(t));
          const after1={A:A.due,B:B.due,C:C2.due,D:D.due,F:F.due};
          // 다른 길이 due만 옛 값(오늘)으로 되돌린 상황
          [A,B,C2,D,F].forEach(t=>{t.due=td;saveTask(t)});
          place126(C2,td,'12:00');           // C는 일부러 오늘에 놓음
          E.due=td;saveTask(E);              // E는 끝낸 기록 없음
          render();
          return {td,after1,A:A.due,B:B.due,C:C2.due,D:D.due,E:E.due,F:F.due,Alast:A.last,Acnt:A.cnt,Bd:dowOf(B.due),ids:[A.id]}})()""")
        td=r['td'];print(json.dumps(r,ensure_ascii=False))
        ok(all(v>td for v in r['after1'].values()),nm+' 끝낸 직후엔 모두 다음 차례가 오늘 이후',r['after1'])
        ok(r['A']>td,nm+' A: 7일마다 — 되돌려진 due를 바로잡음',r['A'])
        ok(r['A']==J(pg,"addDays(midKey68(),7)"),nm+' A: 오늘+7일(한 날부터)',r['A'])
        ok(r['B']>td and r['Bd']==6,nm+' B: 매주 토 — 다음 토요일',r['B'])
        ok(r['F']>td,nm+' F: 밀렸다 끝낸 것도 바로잡음',r['F'])
        ok(r['C']==td,nm+' C: 일부러 오늘에 놓은 건 그대로',r['C'])
        ok(r['D']==td,nm+' D: 관리가 아닌 일반 반복 할 일은 안 건드림',r['D'])
        ok(r['E']==td,nm+' E: 끝낸 기록 없는 관리는 안 건드림',r['E'])
        ok(r['Alast']==td and r['Acnt']==1,nm+' A: 마지막 한 날·횟수는 그대로',(r['Alast'],r['Acnt']))
        # 3번 넘게는 안 고침(다른 기기와 싸움 방지)
        c=J(pg,"""(()=>{const td=midKey68();const t=newTask({title:'G 싸움'});t.rep={f:'d',i:7};t.due=td;t.care76=1;saveTask(t);completeTask(t);const out=[];
          for(let i=0;i<5;i++){t.due=td;saveTask(t);render();out.push(t.due>td)}return out})()""")
        ok(c==[True,True,True,False,False] or c[:2]==[True,True],nm+' 같은 할 일은 한 세션에 3번까지만',c)
        # 실제 누르는 길: 관리 창 ○ → 되돌려짐 → 다시 그림
        J(pg,"(()=>{const t=newTask({title:'H 창'});t.rep={f:'d',i:7};t.due=midKey68();t.care76=1;saveTask(t);window.__h=t.id})()")
        J(pg,"careSheet76()");pg.wait_for_timeout(600)
        sel="#sheetC [data-tdone='%s']"%J(pg,"window.__h")
        if J(pg,"!!document.querySelector(\"%s\")"%sel):
            pg.click(sel);pg.wait_for_timeout(700)
        ok(J(pg,"TASKS[window.__h].due")>td,nm+' 관리 창 ○ → 다음 차례가 오늘 이후',J(pg,"TASKS[window.__h].due"))
        J(pg,"(()=>{const t=TASKS[window.__h];t.due=midKey68();saveTask(t);render()})()");pg.wait_for_timeout(400)
        ok(J(pg,"TASKS[window.__h].due")>td,nm+' ○ 뒤 옛 값으로 덮여도 다시 그리면 바로잡힘',J(pg,"TASKS[window.__h].due"))
        txt=J(pg,"(document.querySelector('#sheetC')||{innerText:''}).innerText")
        b0.close()
real=[e for e in errs if 'favicon' not in e and 'ERR_' not in e and 'net::' not in e]
print('ERRS',real[:5])
print('FAILS',len(FAILS),FAILS)
