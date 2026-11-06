exec(open('h61.py').read())
import json
J=lambda pg,x:pg.evaluate(x)
with sync_playwright() as pw:
    b,pg=run(pw);closepops(pg);pg.wait_for_timeout(1500)
    print('r1',J(pg,"C.routines.map(r=>r.name+':'+r.steps.length)"),'tasks',J(pg,"Object.keys(TASKS).length"))
    st=json.loads(dump(pg));store={k:v for k,v in st}
    hide=J(pg,"Object.values(TASKS).filter(t=>t.rstep||t.hab||t.rid).map(t=>t.id)")
    b.close()
    for rnd in range(3):
        b,pg=run(pw,store=store,pre="window.__staleT={hide:%s,ms:900};"%json.dumps(hide));closepops(pg);pg.wait_for_timeout(2500)
        print('r%d'%(rnd+2),J(pg,"C.routines.map(r=>r.name+':'+r.steps.length)"),'tasks',J(pg,"Object.keys(TASKS).length"),'heads',J(pg,"C.routines.map(r=>Object.values(TASKS).filter(t=>t.rid===r.id&&t.status===0).length)"),'hab',J(pg,"Object.values(TASKS).filter(t=>t.hab&&t.status===0).length"))
        st=json.loads(dump(pg));store={k:v for k,v in st}
        b.close()
    for e in errs[:8]:print(e[:300])
