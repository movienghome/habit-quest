exec(open('/home/claude/habit-quest/dev/v5/h61.py').read())
ok=[]
def chk(n,c):
    ok.append(bool(c));print(('PASS ' if c else 'FAIL ')+n)
with sync_playwright() as pw:
    b,pg=run(pw,W=390,H=844);closepops(pg)
    J=lambda x:pg.evaluate(x)
    J("""(()=>{const t=newTask({title:'영화 리뷰 쓰기'});t.due=midKey68();saveTask(t);window.__id=t.id;completeTask(t)})()""");pg.wait_for_timeout(600);closepops(pg)
    J("openTaskSheet(window.__id)");pg.wait_for_timeout(700)
    chk('chip text',J("document.querySelector('[data-mv119]')&&document.querySelector('[data-mv119]').textContent").startswith('✓'))
    J("document.querySelector('[data-mv119]').click()");pg.wait_for_timeout(500)
    chk('mv sheet',pg.locator('[data-mv69]').count()>=2)
    pg.locator('[data-mv69]').nth(1).click();pg.wait_for_timeout(700)
    chk('doneAt yesterday',J("TASKS[window.__id].doneAt===addDays(dateKey(),-1)"))
    chk('entry moved',J("(DAYS[addDays(dateKey(),-1)].entries||[]).some(e=>e.tid===window.__id)"))
    b.close()
import sys;sys.exit(0 if all(ok) else 1)
