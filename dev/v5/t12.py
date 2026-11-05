exec(open('t2.py').read().split("W=int")[0])
def drag(pg,a,b,steps=12):
    pg.mouse.move(*a);pg.mouse.down();pg.mouse.move(a[0]+8,a[1]+8,steps=3);pg.mouse.move(*b,steps=steps);pg.wait_for_timeout(80);pg.mouse.up();pg.wait_for_timeout(350)
def ctr(bb,dx=0.5,dy=0.5):return (bb['x']+bb['width']*dx,bb['y']+bb['height']*dy)
with sync_playwright() as pw:
    b,pg=run(pw,1600,950,'pc')
    print('startup popup visible:',pg.is_visible('#levelup'))
    closepops(pg);imp(pg);closepops(pg)
    pg.evaluate("location.hash='tasks'");pg.wait_for_timeout(500)
    print('title',pg.title(),'| tray hidden',pg.evaluate("$('calTray').hidden"))
    # 상세 4단
    pg.locator('#tList .trow .tt').nth(1).click();pg.wait_for_timeout(300)
    print('docked',pg.evaluate("document.body.classList.contains('docked')"),'sheet overlay hidden',pg.evaluate("$('sheet').hidden"))
    tid=pg.evaluate("sheetCtx.task")
    pg.click('[data-tsck="add"]');pg.wait_for_timeout(150);pg.fill('[data-ck="0"][data-f="n"]','초안 점검');pg.press('[data-ck="0"][data-f="n"]','Tab');pg.wait_for_timeout(150)
    pg.fill('#tsDl','2026-11-20');pg.press('#tsDl','Tab');pg.wait_for_timeout(200)
    pg.screenshot(path=SP+'v52_docked.png')
    print('task',pg.evaluate("id=>{const t=TASKS[id];return [t.title,t.due,t.time,t.deadline,JSON.stringify(t.checks)]}",tid))
    if pg.locator('[data-tsclr="due"]').count():pg.click('[data-tsclr="due"]');pg.wait_for_timeout(150);print('due cleared',pg.evaluate("id=>TASKS[id].due",tid))
    pg.click('[data-tsdone2]');pg.wait_for_timeout(200);print('closed',not pg.evaluate("document.body.classList.contains('docked')"))
    # 완료·되돌리기
    pg.locator('#tList .trow .tchk').first.click();pg.wait_for_timeout(400)
    print('completed section',pg.locator('.tcomp').count(),pg.inner_text('.tcomp .ghead') if pg.locator('.tcomp').count() else '')
    n0=pg.evaluate("today().entries.length");pg.mouse.click(5,500);pg.keyboard.press('Control+z');pg.wait_for_timeout(400);print('undo entries',n0,'->',pg.evaluate("today().entries.length"))
    # 자동 완성
    pg.fill('#tAdd','');pg.click('#tAdd');pg.keyboard.type('장보기 ^Err');pg.wait_for_timeout(200);print('ac',pg.locator('#acBox .aci').all_inner_texts()[:3])
    pg.keyboard.press('Tab');pg.wait_for_timeout(100);print('after tab',pg.input_value('#tAdd'))
    pg.keyboard.type('#');pg.wait_for_timeout(150);print('tags',pg.locator('#acBox .aci').all_inner_texts()[:4]);pg.keyboard.press('Escape')
    pg.fill('#tAdd','');pg.keyboard.type('씨네');pg.wait_for_timeout(200);print('freq',pg.locator('#acBox .aci').all_inner_texts()[:4]);pg.keyboard.press('Escape');pg.fill('#tAdd','')
    # Ctrl+Shift+R
    r=pg.locator('#tList .trow').first;tid2=r.get_attribute('data-task');r.hover();pg.mouse.move(*ctr(r.bounding_box(),.3));d0=pg.evaluate("id=>TASKS[id].due",tid2);pg.keyboard.press('Alt+r');pg.wait_for_timeout(300);print('postpone',d0,'->',pg.evaluate("id=>[TASKS[id].due,TASKS[id].skull]",tid2))
    # 캘린더: 블록 → 종일, 종일 → 시간
    pg.evaluate("location.hash='cal'");pg.wait_for_timeout(400);pg.click('[data-calmode="3day"]');pg.wait_for_timeout(300)
    pg.evaluate("$('tgScroll').scrollTop=0");pg.wait_for_timeout(100)
    blk=pg.locator('.blk[data-ctask]').first
    if blk.count():
        bid=blk.get_attribute('data-ctask');pg.wait_for_timeout(300);blk=pg.locator(f'.blk[data-ctask="{bid}"]');blk.scroll_into_view_if_needed();ad=pg.locator('.tgall [data-drop^="allday:"]').nth(1).bounding_box()
        drag(pg,ctr(blk.bounding_box(),.5,.3),ctr(ad));print('block->allday',pg.evaluate("id=>[TASKS[id].due,TASKS[id].time]",bid))
        ch=pg.locator(f'.tgall .cchip[data-ctask="{bid}"]').bounding_box(timeout=3000) if pg.locator(f'.tgall .cchip[data-ctask="{bid}"]').count() else None
        if not ch:
            ch=pg.locator('.tgall .cchip[data-drag]').first.bounding_box();bid=pg.locator('.tgall .cchip[data-drag]').first.get_attribute('data-ctask')
        col=pg.locator('.tgcol').nth(2).bounding_box();sc=pg.locator('#tgScroll').bounding_box()
        drag(pg,ctr(ch),(col['x']+40,sc['y']+150));print('allday->time',pg.evaluate("id=>[TASKS[id].due,TASKS[id].time,TASKS[id].dur]",bid))
    print('fold',pg.evaluate("foldH()"));pg.click('.foldtog');pg.wait_for_timeout(200);print('after unfold',pg.evaluate("foldH()"));pg.click('.foldtog');pg.wait_for_timeout(200);print('refold',pg.evaluate("foldH()"))
    pg.screenshot(path=SP+'v52_cal3.png')
    pg.click('[data-calmode="month"]');pg.wait_for_timeout(300);pg.screenshot(path=SP+'v52_month.png');pg.locator('.mc[data-calday]').nth(10).click(position={'x':8,'y':8});pg.wait_for_timeout(300);print('month click ->',pg.evaluate("[C.ui.cal.mode,ui.calAnchor]"))
    pg.click('#calTrayBtn');pg.wait_for_timeout(200);print('tray shown',not pg.evaluate("$('calTray').hidden"));pg.click('#calTrayBtn')
    # 가챠 치우기
    pg.evaluate("location.hash='gacha'");pg.wait_for_timeout(300);pg.click('#gDraw');pg.wait_for_timeout(300);pg.click('[data-gclear]');pg.wait_for_timeout(200);print('pending after clear',pg.evaluate("C.gacha.pending"))
    # 도파민 편집
    pg.evaluate("location.hash='edit'");pg.wait_for_timeout(200);pg.click('[data-etab="dopa"]');pg.wait_for_timeout(300)
    chip=pg.locator('.dcol.pool .dchip').first;nm=chip.inner_text().split('\n')[0].replace('☐ ','').strip();tgt=pg.locator('.dcol[data-drop="dopa:main"]').bounding_box()
    drag(pg,ctr(chip.bounding_box()),ctr(tgt,.5,.3));print('dopa drag',nm,'->',pg.evaluate("n=>(C.actions.find(a=>a.name===n)||{}).dopa",nm))
    pg.screenshot(path=SP+'v52_dopa.png',full_page=True)
    # 홈 배치
    pg.evaluate("location.hash='home'");pg.wait_for_timeout(300);pg.click('#homeEditBtn');pg.wait_for_timeout(300)
    pg.screenshot(path=SP+'v52_homeedit.png')
    h0=pg.evaluate("C.ui.home.map(h=>h[0]).slice(0,4)");hd=pg.locator('.hedit .hand').nth(0).bounding_box();t2=pg.locator('#homeGrid>.hblock').nth(3).bounding_box()
    drag(pg,ctr(hd),(t2['x']+40,t2['y']+t2['height']-8));print('home drag',h0,'->',pg.evaluate("C.ui.home.map(h=>h[0]).slice(0,4)"))
    pg.click('#homeEditBtn');pg.wait_for_timeout(200)
    pg.evaluate("location.hash='tasks'");pg.wait_for_timeout(300);pg.hover('#side a[href="#cal"]');pg.wait_for_timeout(200);pg.screenshot(path=SP+'v52_tip.png',clip={'x':0,'y':100,'width':500,'height':300})
    b.close()
    b,pg=run(pw,390,844,'m');closepops(pg);imp(pg);closepops(pg)
    pg.evaluate("location.hash='tasks'");pg.wait_for_timeout(300);pg.locator('#tList .trow .tt').first.click();pg.wait_for_timeout(300);print('mobile sheet',pg.is_visible('#sheet'));pg.screenshot(path=SP+'v52_msheet.png');pg.click('[data-tsdone2]')
    pg.evaluate("location.hash='cal'");pg.wait_for_timeout(300);pg.screenshot(path=SP+'v52_mcal.png')
    b.close()
print('\n'.join(e for e in errs if 'ERR_FAILED' not in e and 'gstatic' not in e))
