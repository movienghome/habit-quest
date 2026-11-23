exec(open('/home/claude/habit-quest/dev/v5/h61.py').read())
ok=[]
def chk(n,c):
    ok.append(bool(c));print(('PASS ' if c else 'FAIL ')+n)
with sync_playwright() as pw:
    b,pg=run(pw,W=1100,H=900);closepops(pg)
    J=lambda x:pg.evaluate(x)
    J("""(()=>{const t=newTask({title:'글쓰기x'});t.rep={f:'x',n:3};t.due=midKey68();saveTask(t);window.__id=t.id;C.ui=C.ui||{};C.ui.cal=Object.assign(C.ui.cal||{},{mode:'week'});location.hash='cal';render()})()""");pg.wait_for_timeout(900)
    chk('chip draggable',pg.locator('.wk91 .c91.k105.dr119').count()==1)
    chk('no sl yet',J("!TASKS[window.__id].sl91"))
    J("C.ui.cal.mode='week';ui.calAnchor=midKey68();ui.calSel=midKey68();save('config');renderCal()");pg.wait_for_timeout(600)
    J("""(()=>{const k=addDays(midKey68(),1);const t=TASKS[window.__id];t.sl91={};t.sl91[k]='10:00';saveTask(t);render()})()""");pg.wait_for_timeout(500)
    chk('계획 text','📌1' in J("document.querySelector('.wk91').textContent"))
    
    # simulate drag by synthetic pointer
    box=pg.locator('.wk91 .c91.k105.dr119').bounding_box()
    tgt=pg.locator('[data-drop^="col:"]').nth(3).bounding_box()
    print(J("[...document.querySelectorAll('[data-drop]')].slice(0,12).map(e=>e.dataset.drop).join(',')"))
    pg.mouse.move(box['x']+10,box['y']+8);pg.mouse.down();pg.mouse.move(box['x']+18,box['y']+12,steps=3)
    pg.mouse.move(tgt['x']+tgt['width']/2,max(tgt['y'],200)+150,steps=12);print('mid',J("JSON.stringify([DND.on,DND.kind,DND.drop])"));pg.wait_for_timeout(120);pg.mouse.up();pg.wait_for_timeout(700)
    print(J("JSON.stringify([TASKS[window.__id].sl91,document.querySelector('.toast,#toast')&&document.querySelector('.toast,#toast').textContent])"))
    chk('dropped adds slot',J("Object.keys(TASKS[window.__id].sl91||{}).length>=2"))
    b.close()
import sys;sys.exit(0 if all(ok) else 1)
