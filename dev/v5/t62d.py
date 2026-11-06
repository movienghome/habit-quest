exec(open('h61.py').read())
J=lambda pg,x:pg.evaluate(x)
with sync_playwright() as pw:
    b,pg=run(pw,W=412,H=860);closepops(pg)
    for v in ['home','tasks','log']:
        pg.evaluate(f"location.hash='{v}'");pg.wait_for_timeout(500);pg.screenshot(path=SP+f'a_{v}.png',full_page=True)
    J(pg,"ui.tsel='l:Lrt';render()") 
    pg.evaluate("location.hash='tasks'");pg.wait_for_timeout(300)
    J(pg,"document.querySelector('#tSide [data-tsel=\"l:Lrt\"]').click()");pg.wait_for_timeout(300)
    J(pg,"(document.querySelector('[data-x56fold]')||{click(){}}).click()");pg.wait_for_timeout(300)
    pg.screenshot(path=SP+'a_rtlist.png')
    for e in errs[:12]:print(e[:400])
