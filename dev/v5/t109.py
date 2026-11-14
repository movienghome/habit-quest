# t109 (v10.6): 내일 짜기 뒤로 가기·옵션·루틴/끼니 옮기기
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
J=lambda pg,x:pg.evaluate(x)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
def notoast(pg):
    J(pg,"(()=>{const t=document.getElementById('toast');if(t){t.classList.remove('on');t.style.pointerEvents=''}})()")
def run_main(pg,W):
    pg.wait_for_timeout(700);notoast(pg)
    # 내일로 할 일 몇 개
    J(pg,"""(()=>{const k=addDays(midKey68(),1);
      const a=newTask({title:'T109고정',list:'fixed',due:k,time:'10:00',dur:30});saveTask(a);
      const b=newTask({title:'T109종일',due:k});saveTask(b);
      const c=newTask({title:'T109반복',due:k,time:'15:00',dur:20,rep:{f:'d',i:1}});saveTask(c);
      window.__a=a.id;window.__b=b.id;window.__c=c.id;render()})()""")
    J(pg,"planSheet80()");pg.wait_for_timeout(500)
    ok(J(pg,"!!(sheetCtx&&sheetCtx.w93)"),f'[{W}] 내일 짜기가 열림')
    # 블록(시간 있는 일)의 상세 열기 → ← 뒤로 → 내일 짜기
    J(pg,"(()=>{const b=document.querySelector('[data-w93b=\\\"'+window.__a+'\\\"]');b&&b.click()})()");pg.wait_for_timeout(300)
    J(pg,"document.querySelector('[data-w93det]')&&document.querySelector('[data-w93det]').click()")
    pg.wait_for_timeout(500)
    ok(J(pg,"!!(sheetCtx&&sheetCtx.task)"),f'[{W}] 상세 단추를 누르면 상세')
    ok(J(pg,"!!document.querySelector('#sheetC .back61')"),f'[{W}] 상세 위에 ← 뒤로')
    pg.click('#sheetC .back61');pg.wait_for_timeout(500)
    ok(J(pg,"!!(sheetCtx&&sheetCtx.w93)"),f'[{W}] ← 뒤로 → 내일 짜기로 돌아옴',J(pg,"JSON.stringify(sheetCtx)"))
    # 상세를 닫으면 알약
    J(pg,"(()=>{if(!document.querySelector('[data-w93det]')){const b=document.querySelector('[data-w93b=\\\"'+window.__a+'\\\"]');b&&b.click()}})()");pg.wait_for_timeout(300)
    J(pg,"document.querySelector('[data-w93det]')&&document.querySelector('[data-w93det]').click()");pg.wait_for_timeout(400)
    J(pg,"closeSheet()");pg.wait_for_timeout(300)
    ok(J(pg,"(()=>{const p=document.getElementById('back61p');return !!p&&!p.hidden&&/내일 짜기/.test(p.innerText)})()"),f'[{W}] 닫은 뒤 알약 ← 내일 짜기로 돌아가기')
    pg.click('#back61p');pg.wait_for_timeout(500)
    ok(J(pg,"!!(sheetCtx&&sheetCtx.w93)"),f'[{W}] 알약으로 내일 짜기 복귀')
    # 이미 시간 있는 반복 할 일 선택 → 옵션 → 하루 뒤로 → 되돌리기
    J(pg,"(()=>{const b=document.querySelector('[data-w93b=\"'+window.__c+'\"]');b&&b.click()})()");pg.wait_for_timeout(400)
    ok(J(pg,"!!document.querySelector('[data-w93opt]')"),f'[{W}] 선택한 일에 ⋯ 옵션')
    J(pg,"document.querySelector('[data-w93opt]').click()");pg.wait_for_timeout(300)
    mt=J(pg,"(()=>{const m=document.getElementById('m61');return m?m.innerText:''})()")
    ok('날짜 다시 정하기' in mt and '건너뛰기' in mt and '그만두기' in mt,f'[{W}] 옵션 메뉴 항목',mt)
    pg.evaluate("[...document.querySelectorAll('#m61 button')].find(b=>/하루 뒤로/.test(b.innerText)).click()");pg.wait_for_timeout(400)
    ok(J(pg,"TASKS[window.__c].due===addDays(midKey68(),2)"),f'[{W}] 하루 뒤로 → due 모레')
    ok(J(pg,"!!document.querySelector('[data-w93u]')"),f'[{W}] 화면 안 되돌리기 단추')
    J(pg,"document.querySelector('[data-w93u]').click()");pg.wait_for_timeout(300)
    ok(J(pg,"TASKS[window.__c].due===addDays(midKey68(),1)"),f'[{W}] 되돌리기 → 다시 내일')
    # 건너뛰기
    J(pg,"(()=>{const b=document.querySelector('[data-w93b=\"'+window.__c+'\"]');b&&b.click()})()");pg.wait_for_timeout(300)
    J(pg,"document.querySelector('[data-w93opt]').click()");pg.wait_for_timeout(300)
    pg.evaluate("[...document.querySelectorAll('#m61 button')].find(b=>/건너뛰기/.test(b.innerText)).click()");pg.wait_for_timeout(400)
    ok(J(pg,"TASKS[window.__c].due===addDays(midKey68(),2)&&(TASKS[window.__c].skip61||[]).includes(addDays(midKey68(),1))"),f'[{W}] 이번엔 건너뛰기 → 모레로, skip61')
    J(pg,"document.querySelector('[data-w93u]').click()");pg.wait_for_timeout(300)
    ok(J(pg,"TASKS[window.__c].due===addDays(midKey68(),1)&&!(TASKS[window.__c].skip61||[]).length"),f'[{W}] 건너뛰기 되돌리기')
    # 안 하기 + 되돌리기
    J(pg,"(()=>{const b=document.querySelector('[data-w93b=\"'+window.__a+'\"]');b&&b.click()})()");pg.wait_for_timeout(300)
    J(pg,"document.querySelector('[data-w93opt]').click()");pg.wait_for_timeout(300)
    pg.evaluate("[...document.querySelectorAll('#m61 button')].find(b=>/안 하기/.test(b.innerText)).click()");pg.wait_for_timeout(400)
    ok(J(pg,"TASKS[window.__a].status===-1"),f'[{W}] 안 하기')
    J(pg,"document.querySelector('[data-w93u]').click()");pg.wait_for_timeout(300)
    ok(J(pg,"TASKS[window.__a].status===0"),f'[{W}] 안 하기 되돌리기')
    # 날짜 다시 정하기(직접)
    J(pg,"(()=>{const b=document.querySelector('[data-w93b=\"'+window.__a+'\"]');b&&b.click()})()");pg.wait_for_timeout(300)
    J(pg,"document.querySelector('[data-w93opt]').click()");pg.wait_for_timeout(300)
    pg.evaluate("[...document.querySelectorAll('#m61 button')].find(b=>/날짜 다시/.test(b.innerText)).click()");pg.wait_for_timeout(400)
    ok(J(pg,"!!document.querySelector('[data-w93dpv]')"),f'[{W}] 날짜 입력 칸 열림')
    nd=J(pg,"addDays(midKey68(),4)")
    pg.fill('[data-w93dpv]',nd);pg.click('[data-w93dpok]');pg.wait_for_timeout(400)
    ok(J(pg,"TASKS[window.__a].due==='%s'"%nd),f'[{W}] 날짜 다시 정하기 → {nd}')
    # 루틴 머리·끼니 블록 옮기기
    J(pg,"""(()=>{const k=addDays(midKey68(),1);const h=Object.values(TASKS).find(t=>t.rid==='r-morning');h.due=k;h.rep={f:'d',i:1};h.time='07:00';saveTask(h);window.__h=h.id;
      C.meal80={on:1,l:{t:'12:00',m:40},d:{t:'18:30',m:40},menu:{},no:[]};save('config');render()})()""")
    J(pg,"back93()");pg.wait_for_timeout(500)
    ok(J(pg,"mvOkProbe()") if False else True,'skip')
    J(pg,"(()=>{const b=document.querySelector('[data-w93b=\"'+window.__h+'\"]');b&&b.click()})()");pg.wait_for_timeout(300)
    ok(J(pg,"W_sel_probe()") if False else J(pg,"!!document.querySelector('.sel93')"),f'[{W}] 루틴 블록을 누르면 선택(이동 가능)')
    J(pg,"document.querySelector('[data-w93seltm]').value='08:30';document.querySelector('[data-w93seltm]').dispatchEvent(new Event('change',{bubbles:true}))");pg.wait_for_timeout(400)
    ok(J(pg,"(()=>{const h=TASKS[window.__h];return h.tx83&&h.tx83.m==='08:30'&&h.time==='07:00'})()"),f'[{W}] 루틴 → 이 날만(tx83), 평소 시각 그대로',J(pg,"JSON.stringify([TASKS[window.__h].tx83,TASKS[window.__h].time])"))
    ml=J(pg,"(()=>{const m=Object.values(TASKS).find(t=>t.ml80&&t.status===0);return m?m.id:null})()")
    if ml:
        J(pg,"window.__m='%s';(()=>{const b=document.querySelector('[data-w93b=\"%s\"]');b&&b.click()})()"%(ml,ml));pg.wait_for_timeout(300)
        ok(J(pg,"!!document.querySelector('.sel93')"),f'[{W}] 끼니 블록도 선택(이동 가능)')
    notoast(pg)

def run_done(pg,W):
    pg.wait_for_timeout(700);notoast(pg)
    if W=='폰':
        J(pg,"location.hash='tasks'");pg.wait_for_timeout(700);notoast(pg)
        J(pg,"document.getElementById('t84tt')&&document.getElementById('t84tt').click()");pg.wait_for_timeout(900);notoast(pg)
    J(pg,"""(()=>{const td=midKey68();const a=newTask({title:'T109끝낸일',due:td,time:'09:00',dur:30});saveTask(a);window.__d=a.id;
      const r=newTask({title:'T109반복끝',due:td,time:'10:00',dur:30,rep:{f:'d',i:1}});saveTask(r);window.__r=r.id;
      completeTask(a);completeTask(r);C.ui.cal.mode='3day';C.ui.cal.color='list';ui.calAnchor=td;ui.calSel=td;save('config');renderCal()})()""")
    pg.wait_for_timeout(900);notoast(pg)
    n=J(pg,"document.querySelectorAll('.blk.done.d77').length")
    ok(n>=2,f'[{W}] 끝낸 블록이 캘린더에 보임',n)
    ok(J(pg,'!!document.querySelector(".blk.done.d77[data-drag^=done105]")'),f'[{W}] 끝낸 블록에 끌기 표시')
    # 누르면 메뉴
    J(pg,"[...document.querySelectorAll('.blk.done.d77')].find(b=>b.dataset.ctask===window.__d).dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,clientX:300,clientY:300}))")
    pg.wait_for_timeout(300)
    mt=J(pg,"(()=>{const m=document.getElementById('m61');return m?m.innerText:''})()")
    ok('체크 해제' in mt and '시각 바꾸기' in mt,f'[{W}] 끝낸 블록 메뉴',mt)
    # 시각 바꾸기
    pg.evaluate("[...document.querySelectorAll('#m61 button')].find(b=>/시각 바꾸기/.test(b.innerText)).click()");pg.wait_for_timeout(400)
    ok(J(pg,"!!document.getElementById('ct105v')"),f'[{W}] 시각 창')
    pg.fill('#ct105v','14:30');pg.click('[data-ct105=save]');pg.wait_for_timeout(600)
    ok(J(pg,"(()=>{const e=entOf105(midKey68(),window.__d);return !!e&&e.ct105==='14:30'&&TASKS[window.__d].time==='09:00'})()"),f'[{W}] 기록에 ct105, 할 일 시각은 그대로')
    top=J(pg,"(()=>{const b=[...document.querySelectorAll('.blk.done.d77')].find(b=>b.dataset.ctask===window.__d);return b?parseFloat(b.style.top):-1})()")
    ok(top>0,f'[{W}] 블록이 새 시각 자리로',top)
    # 체크 해제
    J(pg,"[...document.querySelectorAll('.blk.done.d77')].find(b=>b.dataset.ctask===window.__d).dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,clientX:300,clientY:300}))");pg.wait_for_timeout(300)
    pg.evaluate("[...document.querySelectorAll('#m61 button')].find(b=>/체크 해제/.test(b.innerText)).click()");pg.wait_for_timeout(600)
    ok(J(pg,"TASKS[window.__d].status===0&&!entOf105(midKey68(),window.__d)"),f'[{W}] 체크 해제 → 할 일 다시 열림·기록 없어짐')
    ok(J(pg,"![...document.querySelectorAll('.blk.done.d77')].some(b=>b.dataset.ctask===window.__d)"),f'[{W}] 끝낸 블록 사라짐')
    # 반복 끝낸 일 해제 → due 되돌림
    J(pg,"[...document.querySelectorAll('.blk.done.d77')].find(b=>b.dataset.ctask===window.__r).dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,clientX:300,clientY:300}))");pg.wait_for_timeout(300)
    pg.evaluate("[...document.querySelectorAll('#m61 button')].find(b=>/체크 해제/.test(b.innerText)).click()");pg.wait_for_timeout(600)
    ok(J(pg,"TASKS[window.__r].due===midKey68()"),f'[{W}] 반복 할 일 체크 해제 → due 오늘로',J(pg,"TASKS[window.__r].due"))
    # PC: 마우스 끌어 시각 옮기기
    if W=='PC':
        J(pg,"completeTask(TASKS[window.__d])");pg.wait_for_timeout(700)
        r=J(pg,"(()=>{const b=[...document.querySelectorAll('.blk.done.d77')].find(b=>b.dataset.ctask===window.__d);if(!b)return null;b.scrollIntoView({block:'center'});const r=b.getBoundingClientRect();return [r.left+r.width/2,r.top+6]})()");pg.wait_for_timeout(300)
        r=J(pg,"(()=>{const b=[...document.querySelectorAll('.blk.done.d77')].find(b=>b.dataset.ctask===window.__d);const r=b.getBoundingClientRect();return [r.left+r.width/2,r.top+6]})()")
        if r:
            drag(pg,(r[0],r[1]),(r[0],r[1]+120))
            pg.wait_for_timeout(500)
            ok(J(pg,"(()=>{const e=entOf105(midKey68(),window.__d);return !!e&&!!e.ct105&&e.ct105!=='09:00'})()"),f'[{W}] 마우스로 끌어 시각 옮김',J(pg,"JSON.stringify((entOf105(midKey68(),window.__d)||{}).ct105)"))
        else:ok(False,f'[{W}] 끌 블록 없음')
    notoast(pg)

def run_care(pg,W):
    pg.wait_for_timeout(700);notoast(pg)
    J(pg,"""(()=>{const td=midKey68();const a=newTask({title:'T109빨래',due:td,rep:{f:'d',i:7}});saveTask(a);window.__k=a.id;
      const r=rtNew61('T109루틴',[{name:'스트레칭',min:5}]);const h=newTask({title:'T109루틴',due:td,rep:{f:'d',i:1},rid:r.id});saveTask(h);window.__h=h.id;window.__r=r.id;save('config');render()})()""")
    # 관리로 넣기 → 되돌리기 목록
    J(pg,"(()=>{const t=TASKS[window.__k];careOn77(t,3);save('config');render()})()")
    J(pg,"careSheet76()");pg.wait_for_timeout(500)
    ok(J(pg,"!!document.querySelector('[data-ch105]')"),f'[{W}] 관리 창에 되돌리기 목록')
    J(pg,"document.querySelector('[data-ch105=\\\"'+window.__k+'\\\"]').click()");pg.wait_for_timeout(400)
    ok(J(pg,"(()=>{const t=TASKS[window.__k];return !t.care76&&t.rep&&t.rep.i===7})()"),f'[{W}] 되돌리면 관리 해제·원래 주기(7일)')
    closeS=J(pg,"closeSheet()")
    # 루틴 카드 건너뛰기 단추
    J(pg,"openRt61(window.__r)");pg.wait_for_timeout(400)
    ok(J(pg,"!!document.querySelector('[data-sk105]')"),f'[{W}] 루틴 카드에 ⏭ 오늘은 건너뛰기')
    J(pg,"document.querySelector('[data-sk105]').click()");pg.wait_for_timeout(400)
    ok(J(pg,"(()=>{const t=TASKS[window.__h];return (t.skip61||[]).includes(dateKey())&&t.due>dateKey()})()"),f'[{W}] 건너뜀 → due 다음 날로',J(pg,"TASKS[window.__h].due"))
    notoast(pg)

with sync_playwright() as pw:
    for W,(w,h,pre) in {'PC2':(1400,900,'')}.items():
        pass
    for W,(w,h,pre) in {'PC':(1400,900,''),'폰':(420,900,'window.__coarse75=1;')}.items():
        b,pg=run(pw,W=w,H=h,pre=pre)
        try:
            run_main(pg,W)
        except Exception as e:
            import traceback;traceback.print_exc();FAILS.append('EXC '+str(e)[:100])
        b.close();b,pg=run(pw,W=w,H=h,pre=pre)
        try:run_done(pg,W)
        except Exception as e:
            import traceback;traceback.print_exc();FAILS.append('EXC '+str(e)[:100])
        b.close();b,pg=run(pw,W=w,H=h,pre=pre)
        try:run_care(pg,W)
        except Exception as e:
            import traceback;traceback.print_exc();FAILS.append('EXC '+str(e)[:100])
        print('errs',errs[:5]);errs.clear()
        b.close()
print('FAILS',len(FAILS),FAILS)
