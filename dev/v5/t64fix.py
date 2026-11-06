# 이미 불어난 데이터(v6.3 버그로 생긴 것) → v6.4가 정리하는지 + 되돌리기
exec(open('h61.py').read())
import json
J=lambda pg,x:pg.evaluate(x)
with sync_playwright() as pw:
    b,pg=run(pw);closepops(pg);pg.wait_for_timeout(1200)
    # 버그 흉내: 단계 복제(같은 이름 새 할 일) + 머리 하나 더 + 습관 반복 할 일 복제
    J(pg,"""(()=>{const r=C.routines.find(r=>r.name.includes('Lethe'));const h=rtH62(r);
      const ks=kidsOf(h.id);for(let n=0;n<3;n++)ks.forEach(k=>{const c=newTask({title:k.title,list:h.list});c.parent=h.id;c.rstep=1;if(k.aid)c.aid=k.aid;saveTask(c);r.steps.push({id:uid(),tid:c.id,min:5})});
      const h2=newTask({title:h.title,rid:r.id,list:h.list});saveTask(h2);
      const a=C.actions.find(a=>habT(a));const t=habT(a);const d=newTask({title:t.title,aid:t.aid,list:t.list,rep:t.rep});d.hab=1;d.quest=t.quest;saveTask(d);
      C.mig64=1;save('config')})()""")
    pg.wait_for_timeout(600)
    pg.wait_for_timeout(1500);st=json.loads(dump(pg));store={k:v for k,v in st}
    store['u/game/config'].pop('mig64',None);print('before',[len(r['steps']) for r in store['u/game/config']['routines']])
    b.close()
    b,pg=run(pw,store=store);closepops(pg);pg.wait_for_timeout(2000)
    print('after fix',J(pg,"C.routines.map(r=>r.name.slice(0,8)+':'+r.steps.length)"),'heads',J(pg,"C.routines.map(r=>Object.values(TASKS).filter(t=>t.rid===r.id&&t.status===0).length)"),'habdup',J(pg,"(()=>{const m={};Object.values(TASKS).filter(t=>t.hab&&t.status===0).forEach(t=>m[t.aid]=(m[t.aid]||0)+1);return Math.max(...Object.values(m))})()"),'bak',J(pg,"!!C.bak64"),'toast',J(pg,"(document.querySelector('#toast')||{}).textContent"))
    print('lethe kids',J(pg,"(()=>{const r=C.routines.find(r=>r.name.includes('Lethe'));return kidsOf(rtH62(r).id).length})()"))
    J(pg,"undo64()");pg.wait_for_timeout(500)
    print('after undo',J(pg,"C.routines.map(r=>r.name.slice(0,8)+':'+r.steps.length)"),'mig64',J(pg,"C.mig64"))
    for e in errs[:8]:
        if 'Failed to load' not in e:print(e[:300])
