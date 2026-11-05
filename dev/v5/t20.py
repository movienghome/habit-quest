exec(open('t12.py').read().split("with sync_playwright() as pw:")[0])
J=lambda pg,x:pg.evaluate(x)
with sync_playwright() as pw:
    b,pg=run(pw,1600,950,'pc');closepops(pg)
    print('v',J(pg,"C.v"),'areas',J(pg,"C.areas.map(a=>a.id+':'+a.name).join(',')"))
    print('lists',J(pg,"C.lists.map(l=>l.name+(l.desc?'*':'')).join(',')"),'routines',J(pg,"C.routines.map(r=>r.name+'/'+(r.list||'')).join(' | ')"))
    imp(pg);closepops(pg)
    print('lists after import',J(pg,"C.lists.map(l=>l.name).join(',')"))
    pg.evaluate("location.hash='tasks'");pg.wait_for_timeout(500)
    # 습관 데이터 준비
    J(pg,"(()=>{C.actions.push({id:'g20',name:'샤워',type:'good',area:'body',cond:6,gold:2,xp:10,opts:[{id:'v1',name:'기상 직후',xp:14,from:5,to:10},{id:'v4',name:'저녁',xp:5,from:18,to:22}]});C.actions.find(a=>a.id==='g5').pin=1;C.dailies=[{id:'q1',name:'몸무게 재기',action:'@weigh',xp:5,gold:5},{id:'q3',name:'운동하기',action:'g1',xp:10,gold:10}];save('config');render()})()")
    pg.wait_for_timeout(300)
    print("habits",pg.locator("#tList .habg .trow").all_inner_texts())
    pg.screenshot(path=SP+'v53_today.png')
    # 습관 체크
    pg.click('#tList .habg [data-act="g5"]');pg.wait_for_timeout(400);print('after hab check done rows',pg.locator("#tList .habg .trow.done").count())
    # 여러 개 고르기
    rows=pg.locator('#tList .trow[data-task]')
    ids=[rows.nth(i).get_attribute('data-task') for i in range(3)]
    rows.nth(0).locator('.tt').click(modifiers=['Control']);rows.nth(2).locator('.tt').click(modifiers=['Shift']);pg.wait_for_timeout(200)
    print('msel',J(pg,"ui.msel.size"),'bar',pg.is_visible('#mselBar'))
    pg.click('[data-mb="tomorrow"]');pg.wait_for_timeout(300)
    print('dues',[J(pg,f"TASKS['{i}'].due") for i in ids])
    # 다시 고르고 하지 않음
    pg.evaluate("location.hash='tasks'");pg.click('[data-tsel="tomorrow"]');pg.wait_for_timeout(300)
    pg.click('#tSelBtn');pg.locator('#tList .trow[data-task]').nth(0).click();pg.wait_for_timeout(100);pg.click('[data-mb="wont"]');pg.wait_for_timeout(300)
    print('wont section',pg.locator('.twont').count(),pg.locator('.twont .ghead').inner_text() if pg.locator('.twont').count() else '')
    pg.click('[data-tsel="today"]');pg.wait_for_timeout(300)
    # 사이드바: 끌어서 목록 순서
    print('side lists0',J(pg,"[...document.querySelectorAll('#tSide [data-drop=\"reorder:lists\"] [data-rowid]')].slice(0,5).map(x=>x.textContent).join('|')"))
    sl=pg.locator('#tSide [data-drop="reorder:lists"] [data-rowid]')
    drag(pg,ctr(sl.nth(0).bounding_box()),ctr(sl.nth(3).bounding_box(),.5,.9))
    print('side lists1',J(pg,"[...document.querySelectorAll('#tSide [data-drop=\"reorder:lists\"] [data-rowid]')].slice(0,5).map(x=>x.textContent).join('|')"))
    # 할 일을 목록으로 끌기
    r=pg.locator('#tList .trow[data-task]').first;tid=r.get_attribute('data-task');tgt=pg.locator('#tSide [data-drop^="tolist:"]').nth(2)
    tl=tgt.get_attribute('data-drop');drag(pg,ctr(r.bounding_box(),.4),ctr(tgt.bounding_box()));print('task->list',J(pg,f"TASKS['{tid}'].list"),tl)
    b.close()
print('\n'.join([e for e in errs if 'ERR_FAILED' not in e and 'gstatic' not in e][:20]))
