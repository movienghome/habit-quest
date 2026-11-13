# v9.3c 시험 — 이것만 남기기 메뉴: 날짜 없는·시각 있는·미래 할 일에도 뜸
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra) if extra!='' else ''))
    if not c:FAILS.append(msg)
SEED="""(()=>{const td=midKey68();
  const mk=(title,o)=>{const t=newTask({title});Object.assign(t,o||{});saveTask(t);return t.id};
  window.__ids={n:mk('날짜 없는 일',{}),f:mk('다음 주 일',{due:addDays(td,5)}),t:mk('2시 약속',{due:td,time:'14:00',dur:60}),o:mk('오늘 일',{due:td}),p:mk('또 오늘 일',{due:td})};
  location.hash='#home';render();return window.__ids})()"""
with sync_playwright() as pw:
    for W,H in ((390,844),(1400,900)):
        b,pg=run(pw,W,H);closepops(pg);errs.clear()
        ids=pg.evaluate("()=>"+SEED);pg.wait_for_timeout(500);tag=f'[{W}] '
        for k in 'nft':
            pg.evaluate("(id)=>taskMenu61(TASKS[id],100,200)",ids[k]);pg.wait_for_timeout(300)
            items=pg.evaluate("()=>[...document.querySelectorAll('#m61 button')].map(b=>b.innerText)")
            ok(any('이것만 남기기' in x for x in items),tag+f'줄 메뉴({k})에 이것만 남기기',items[:5])
            pg.keyboard.press('Escape');pg.evaluate("()=>{const m=document.getElementById('m61');if(m)m.remove()}")
        # 날짜 없는 일 고르기 → 오늘로 오고, 나머지 오늘 일은 내일로
        pg.evaluate("(id)=>taskMenu61(TASKS[id],100,200)",ids['n']);pg.wait_for_timeout(300)
        pg.click("#m61 button:has-text('이것만 남기기')");pg.wait_for_timeout(800)
        st=pg.evaluate("(ids)=>{const td=midKey68(),tom=addDays(td,1),T=i=>TASKS[ids[i]];return {n:T('n').due===td,o:T('o').due===tom,p:T('p').due===tom,t:T('t').due===td,sk:['n','o','p'].map(i=>T(i).skull||0)}}",ids)
        ok(st['n'] and st['o'] and st['p'] and st['t'] and not any(st['sk']),tag+'날짜 없는 일이 오늘로 오고 나머지는 내일로(☠ 없음, 시각 일정 그대로)',st)
        ok(not [e for e in errs if 'k93' in str(e) or '93' in str(e)],tag+'오류 없음',errs[:2])
        b.close()
print('FAILS',len(FAILS))
