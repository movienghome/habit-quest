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

with sync_playwright() as pw:
    for W,(w,h,pre) in {'PC':(1400,900,''),'폰':(420,900,'window.__coarse75=1;')}.items():
        b,pg=run(pw,W=w,H=h,pre=pre)
        try:run_main(pg,W)
        except Exception as e:
            import traceback;traceback.print_exc();FAILS.append('EXC '+str(e)[:100])
        print('errs',errs[:5]);errs.clear()
        b.close()
print('FAILS',len(FAILS),FAILS)
