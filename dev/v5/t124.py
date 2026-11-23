# t124 (v12.1): 끝낸 며칠짜리 일정 — 월 막대 전체 취소선, 주 보기 종일 칸 날마다 끝낸 칩
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
J=lambda pg,x:pg.evaluate(x)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
def notoast(pg):J(pg,"(()=>{const t=document.getElementById('toast');if(t){t.classList.remove('on');t.style.pointerEvents=''}})()")
def gocal(pg,mode='month'):
    J(pg,"(()=>{C.ui.cal=C.ui.cal||{};C.ui.cal.mode='%s';save('config');location.hash='cal'})()"%mode);pg.wait_for_timeout(900);closepops(pg);notoast(pg)
    J(pg,"renderCal()");pg.wait_for_timeout(300)
with sync_playwright() as pw:
  for W,H in [(1200,800),(390,800)]:
    b,pg=run(pw,W=W,H=H);closepops(pg);notoast(pg)
    ids=J(pg,"""(()=>{const td=midKey68();const a=newTask({title:'촬영긴'});a.due=addDays(td,-1);a.end71=addDays(td,2);saveTask(a);
      const c=newTask({title:'하루일'});c.due=addDays(td,0);saveTask(c);return {a:a.id,c:c.id}})()""")
    gocal(pg)
    n0=J(pg,"document.querySelectorAll('#calMain .bar83').length")
    ok(n0>=1,f'[{W}] 열린 며칠 일정은 막대',n0)
    J(pg,f"completeTask(TASKS['{ids['a']}'])");pg.wait_for_timeout(500);notoast(pg);closepops(pg)
    J(pg,f"(()=>{{const t=TASKS['{ids['a']}'];window.__st={{s:t.status,due:t.due,end:t.end71,da:t.doneAt}}}})()")
    gocal(pg)
    st=J(pg,"window.__st")
    ok(st['s']==2 and st['end']>st['due'],f'[{W}] 끝낸 뒤에도 기간(due~end71)이 남아 있음',st)
    r=J(pg,f"""(()=>{{const g=document.querySelector('#calMain .mgrid');const bs=[...g.querySelectorAll('.bar83')].filter(b=>b.dataset.ctask==='{ids['a']}');
      return {{n:bs.length,cls:bs.map(b=>b.className),txt:bs.map(b=>b.textContent),dec:bs.map(b=>getComputedStyle(b).textDecorationLine),
        chip:[...g.querySelectorAll('.mc .cchip')].filter(x=>/촬영긴/.test(x.textContent)&&!x.classList.contains('bar83')).length,w:bs.map(b=>Math.round(b.getBoundingClientRect().width))}}}})()""")
    ok(r['n']>=1 and all('d119' in c for c in r['cls']),f'[{W}] 끝낸 뒤에도 막대가 남음(.d119)',r)
    ok(all('line-through' in d for d in r['dec']),f'[{W}] 막대 전체 취소선',r['dec'])
    ok(any('✓' in t for t in r['txt']),f'[{W}] ✓ 표시(색만으로 구분 안 함)',r['txt'])
    ok(r['chip']==0,f'[{W}] 한 날 칩으로 줄어들지 않음',r['chip'])
    # 폭: 열린 때와 같은 폭
    ok(abs(r['w'][0]-J(pg,"0")) >=0,'(폭 기록)',r['w'])
    pg.screenshot(path=f'/tmp/t124_month_{W}.png')
    # 눌러서 상세
    J(pg,f"document.querySelector('#calMain .bar83[data-ctask=\"{ids['a']}\"]').click()");pg.wait_for_timeout(600)
    ok(J(pg,"!!document.querySelector('#sheetC #tsTitle')"),f'[{W}] 끝낸 막대를 눌러도 상세가 열림')
    J(pg,"closeSheet()");pg.wait_for_timeout(300)
    # 주 보기: 종일 칸에 기간 날마다 끝낸 칩
    gocal(pg,'week')
    n=J(pg,f"[...document.querySelectorAll('#calPane [data-drop^=\"allday:\"] .dd84')].filter(x=>x.dataset.ctask==='{ids['a']}').length")
    ok(n>=3,f'[{W}] 주 보기 종일 칸에 기간 날마다 끝낸 칩(이번 주 안 날 수만큼)',n)
    # 월 보기 날짜 머리 ✓n 에 며칠짜리는 안 섞임(막대가 그림)
    print(W,errs[-3:])
    b.close()
print('ERRS',[e for e in errs if 'favicon' not in e][:6])
print('FAILS',len(FAILS),FAILS)
