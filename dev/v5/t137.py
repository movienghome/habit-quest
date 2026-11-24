# t137 (v13.2): 관리 창 하나로 · 관리 ⋯ 건너뛰기·다른 날짜로 · 할 일 미루기(같은 날짜 부품) · 내일 짜기 관리 정렬·건너뛰기 · 주 N회 칩 순서 · ○ 크기
import os,json
os.environ.setdefault('HQURL','file:///home/claude/habit-quest/beta/index.html')
exec(open('/home/claude/habit-quest/dev/v5/h61.py').read())
URL=os.environ.get('HQURL',URL)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
J=lambda pg,x:pg.evaluate(x)
def notoast(pg):J(pg,"(()=>{const t=document.getElementById('toast');if(t){t.classList.remove('on');t.style.pointerEvents=''}})()")
def run2(pw,W,H,touch=False):
    b=pw.chromium.launch();kw=dict(viewport={'width':W,'height':H})
    if touch:kw.update(has_touch=True,is_mobile=True)
    ctx=b.new_context(**kw);ctx.add_init_script(MOCK+"\ntry{localStorage.clear()}catch(e){}\n"+("window.__coarse75=1;" if touch else ""))
    ctx.route('**/backend.js',lambda r:r.fulfill(body="window.__hqResolve(window.__mockApi)",content_type='application/javascript'))
    ctx.route('**/config.js',lambda r:r.fulfill(body="",content_type='application/javascript'))
    ctx.route('**/sw.js',lambda r:r.fulfill(body="",content_type='application/javascript'))
    pg=ctx.new_page();pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e)));pg.on('console',lambda m:errs.append('CON '+m.text) if m.type=='error' else None)
    pg.goto(URL);pg.wait_for_timeout(2300);closepops(pg);notoast(pg);return b,pg
def tap(pg,loc,touch):
    loc.scroll_into_view_if_needed();bb=loc.bounding_box()
    if touch:pg.touchscreen.tap(*ctr(bb))
    else:pg.mouse.click(*ctr(bb))
def T(pg,id):return json.loads(J(pg,f"JSON.stringify(TASKS[{json.dumps(id)}])"))
SEED="""(()=>{const td=midKey68();const mk=(n,d,dur)=>{const t=addTaskFrom(n);t.due=addDays(td,d);if(dur)t.dur=dur;saveTask(t);return t.id};
  const r={a:mk('빨래 %3',-5,30),b:mk('거울 닦기 %7',2,20),c:mk('설거지 %1',0,15),d:mk('가계부 기록 %4',-1,45)};render();return r})()"""
def mitem(pg,txt):return pg.locator('#m61 [data-m61]',has_text=txt).first
with sync_playwright() as pw:
  # ---------- ① 관리 창 하나로 ----------
  for W,H,touch in [(1200,950,False),(390,860,True)]:
    b,pg=run2(pw,W,H,touch);ids=J(pg,SEED);td=J(pg,"midKey68()")
    J(pg,"location.hash='home'");pg.wait_for_timeout(500)
    tap(pg,pg.locator('#htList .care76 [data-c76open]').first,touch);pg.wait_for_timeout(500)
    ctx=json.loads(J(pg,"JSON.stringify(sheetCtx)"))
    ok(ctx.get('d128')==1 and ctx.get('c76')==td,f'[{W}] ① 홈 관리 줄 → 하나로 합친 관리 창(놓기 시트와 같음)',ctx)
    ok(J(pg,"!!document.querySelector('#sheetC [data-d128sort]')&&!!document.querySelector('#sheetC [data-d128f]')&&!!document.querySelector('#sheetC #d128q')"),f'[{W}] ① 정렬·거르기·찾기가 관리 창에')
    ok(J(pg,"!document.querySelector('#sheetC [data-d128s]')"),f'[{W}] ① 여러 개 고르기 칸은 기본으로 숨김')
    ok(J(pg,"!!document.querySelector('#sheetC [data-fl129]')"),f'[{W}] ① 📌 띄우기 단추 그대로')
    rows=J(pg,"[...document.querySelectorAll('#sheetC .d128r .d128t b')].map(x=>x.textContent)")
    ok(rows[:3]==['빨래','가계부 기록','설거지'] and rows[3]=='거울 닦기',f'[{W}] ① 기본 = 차례 빠른 순 · 차례/다음 차례 묶음',rows)
    ok(J(pg,"[...document.querySelectorAll('#sheetC .g130')].length")==2,f'[{W}] ① 차례·다음 차례 머리 2개')
    # 정렬: 오래 밀린 순 · 이름순
    J(pg,"(()=>{const s=document.querySelector('#sheetC [data-d128sort]');s.value='name';s.dispatchEvent(new Event('change',{bubbles:true}))})()");pg.wait_for_timeout(300)
    rows=J(pg,"[...document.querySelectorAll('#sheetC .d128r .d128t b')].map(x=>x.textContent)")
    ok(rows==sorted(rows),f'[{W}] ① 이름순 정렬',rows)
    J(pg,"(()=>{const s=document.querySelector('#sheetC [data-d128sort]');s.value='due';s.dispatchEvent(new Event('change',{bubbles:true}))})()");pg.wait_for_timeout(300)
    # ○ = 했어요 → ✓ 오늘 한 관리
    tap(pg,pg.locator(f'#sheetC .d128r[data-d128r="{ids["c"]}"] .tchk').first,touch);pg.wait_for_timeout(1300)
    ok(J(pg,f"!!document.querySelector('#sheetC .dn129w [data-un129^=\"{ids['c']}|\"]')"),f'[{W}] ① ○ → 창 안 ✓ 오늘 한 관리에 남음')
    ok(not J(pg,"$('sheet').hidden") and J(pg,"!!(sheetCtx&&sheetCtx.d128)"),f'[{W}] ① 창이 그대로 열려 있음')
    tap(pg,pg.locator(f'#sheetC .dn129w [data-un129^="{ids["c"]}|"]').first,touch);pg.wait_for_timeout(900)
    ok(T(pg,ids['c'])['due']==td and J(pg,f"!document.querySelector('#sheetC .dn129w [data-un129^=\"{ids['c']}|\"]')"),f'[{W}] ① ✓ 누르면 체크 풀리고 차례로 돌아옴',T(pg,ids['c']).get('due'))
    # 오늘로 놓기
    tap(pg,pg.locator(f'#sheetC [data-d128q="{ids["a"]}|0"]').first,touch);pg.wait_for_timeout(600)
    t=T(pg,ids['a']);ok(t.get('cs126',{}).get('d')==td,f'[{W}] ① 오늘 단추 = 시간표(종일)에 놓기',t.get('cs126'))
    # 여러 개 고르기
    tap(pg,pg.locator('#sheetC [data-d130m]').first,touch);pg.wait_for_timeout(300)
    ok(J(pg,"document.querySelectorAll('#sheetC [data-d128s]').length")==4,f'[{W}] ① ☑ 여러 개 → 고르기 칸 보임')
    tap(pg,pg.locator('#sheetC [data-d128all="due"]').first,touch);pg.wait_for_timeout(300)
    ok('3개 고름' in J(pg,"$('d128bar').innerText"),f'[{W}] ① 차례인 것 모두 고르기',J(pg,"$('d128bar').innerText")[:60])
    tap(pg,pg.locator('#sheetC [data-d130m]').first,touch);pg.wait_for_timeout(300)
    ok(J(pg,"document.querySelectorAll('#sheetC [data-d128s]').length")==0,f'[{W}] ① 다시 누르면 숨김·해제')
    # 캘린더 🧽 단추도 같은 창
    J(pg,"closeSheet();location.hash='cal'");pg.wait_for_timeout(700)
    btn=pg.locator('[data-deck127]').first
    if btn.count():
      tap(pg,btn,touch);pg.wait_for_timeout(500)
      ok(J(pg,"!!(sheetCtx&&sheetCtx.d128&&sheetCtx.c76)") and J(pg,"!!document.querySelector('#sheetC .dn129w')"),f'[{W}] ① 캘린더 🧽 단추 = 같은 관리 창')
    else: ok(False,f'[{W}] ① 캘린더 🧽 단추 있음')
    ok(not errs,f'[{W}] ① 오류 없음',errs[:3]);errs.clear();b.close()

  # ---------- ② 관리 ⋯: 이번 차례 건너뛰기 · 다른 날짜로 ----------
  for W,H,touch in [(1200,950,False),(390,860,True)]:
    b,pg=run2(pw,W,H,touch);ids=J(pg,SEED);td=J(pg,"midKey68()")
    J(pg,"careSheet76()");pg.wait_for_timeout(500)
    tap(pg,pg.locator(f'#sheetC [data-c76m="{ids["a"]}"]').first,touch);pg.wait_for_timeout(300)
    ok(mitem(pg,'이번 차례 건너뛰기').count()==1 and mitem(pg,'다른 날짜로 지정하기').count()==1,f'[{W}] ② ⋯ 메뉴에 건너뛰기·다른 날짜로')
    tap(pg,mitem(pg,'이번 차례 건너뛰기'),touch);pg.wait_for_timeout(600)
    t=T(pg,ids['a']);ok(t['due']==J(pg,"addDays(midKey68(),3)") and td in (t.get('skip61') or [J(pg,'dateKey()')]),f'[{W}] ② 지난 차례 건너뛰기 → 오늘부터 3일 뒤',t['due'])
    ok(not J(pg,"$('sheet').hidden") and J(pg,"!!(sheetCtx&&sheetCtx.d128)"),f'[{W}] ② 건너뛰어도 관리 창 그대로')
    # 앞날 차례(거울 닦기 2일 뒤 · 7일마다) 건너뛰기 → 9일 뒤
    tap(pg,pg.locator(f'#sheetC [data-c76m="{ids["b"]}"]').first,touch);pg.wait_for_timeout(300)
    tap(pg,mitem(pg,'이번 차례 건너뛰기'),touch);pg.wait_for_timeout(600)
    ok(T(pg,ids['b'])['due']==J(pg,"addDays(midKey68(),9)"),f'[{W}] ② 아직 안 된 차례도 건너뛰기 → 다음 차례',T(pg,ids['b'])['due'])
    # 다른 날짜로 → 모레
    tap(pg,pg.locator(f'#sheetC [data-c76m="{ids["d"]}"]').first,touch);pg.wait_for_timeout(300)
    tap(pg,mitem(pg,'다른 날짜로 지정하기'),touch);pg.wait_for_timeout(300)
    ok(J(pg,"!$('m61').hidden&&!!document.querySelector('#m61 #dm130')"),f'[{W}] ② 날짜 고르기 메뉴(내일·모레·주말·다음 주·날짜)')
    tap(pg,mitem(pg,'모레'),touch);pg.wait_for_timeout(600)
    ok(T(pg,ids['d'])['due']==J(pg,"addDays(midKey68(),2)") and T(pg,ids['d'])['rep']['i']==4,f'[{W}] ② 다른 날짜로 = 이 차례만 모레(주기 그대로)',T(pg,ids['d'])['due'])
    # 날짜 고르기 입력
    tap(pg,pg.locator(f'#sheetC [data-c76m="{ids["d"]}"]').first,touch);pg.wait_for_timeout(300)
    tap(pg,mitem(pg,'다른 날짜로 지정하기'),touch);pg.wait_for_timeout(300)
    nd=J(pg,"addDays(midKey68(),10)");pg.fill('#dm130',nd);tap(pg,pg.locator('#m61 .dm130 [data-m61]'),touch);pg.wait_for_timeout(600)
    ok(T(pg,ids['d'])['due']==nd,f'[{W}] ② 날짜 칸으로 고르기',T(pg,ids['d'])['due'])
    # 놓은 관리는 다른 날짜로 옮기면 놓은 자리 지움
    J(pg,f"(()=>{{const t=TASKS['{ids['c']}'];place126(t,midKey68(),'09:00');saveTask(t);render()}})()")
    J(pg,f"(()=>{{window.move130(TASKS['{ids['c']}'],addDays(midKey68(),1))}})()");pg.wait_for_timeout(300)
    t=T(pg,ids['c']);ok(not t.get('cs126') and t['due']==J(pg,"addDays(midKey68(),1)"),f'[{W}] ② 놓은 관리를 다른 날로 → 놓은 자리 빠짐',t.get('cs126'))
    ok(not errs,f'[{W}] ② 오류 없음',errs[:3]);errs.clear();b.close()

  # ---------- ③ 할 일 우클릭 ⏩ 미루기… · 관리 블록 우클릭 = 관리 메뉴 ----------
  b,pg=run2(pw,1200,950);td=J(pg,"midKey68()")
  tid=J(pg,"(()=>{const t=addTaskFrom('서류 정리');t.due=midKey68();saveTask(t);render();return t.id})()")
  J(pg,"C.ui.tasks.sel='today';location.hash='tasks';render()");pg.wait_for_timeout(600)
  row=pg.locator(f'.trow[data-task="{tid}"]:visible').first;bb=row.bounding_box();pg.mouse.click(bb['x']+bb['width']*.5,bb['y']+bb['height']/2,button='right');pg.wait_for_timeout(300)
  labels=J(pg,"[...document.querySelectorAll('#m61 [data-m61]')].map(x=>x.textContent)")
  ok(any(l.startswith('⏩ 미루기') for l in labels) and not any('다음 주 월요일로' in l for l in labels) and not any('내일로 미루기' in l for l in labels),'③ 할 일 우클릭 → ⏩ 미루기… 하나로',labels)
  mitem(pg,'⏩ 미루기').click();pg.wait_for_timeout(300)
  ok(J(pg,"!!document.querySelector('#m61 #dm130')"),'③ 미루기 → 같은 날짜 고르기 메뉴')
  mitem(pg,'다음 주').click();pg.wait_for_timeout(500)
  ok(T(pg,tid)['due']==J(pg,"addDays(weekStart(midKey68()),7)"),'③ 다음 주로 미룸',T(pg,tid)['due'])
  rid=J(pg,"(()=>{const t=addTaskFrom('스트레칭 매일');t.due=midKey68();saveTask(t);render();return t.id})()")
  J(pg,f"taskMenu61(TASKS['{rid}'],200,200)");pg.wait_for_timeout(200)
  labels=J(pg,"[...document.querySelectorAll('#m61 [data-m61]')].map(x=>x.textContent)")
  ok(any('오늘은 건너뛰기' in l for l in labels) and any('이번 차례 미루기' in l for l in labels),'③ 반복 할 일: 건너뛰기 + 이번 차례 미루기…',labels)
  J(pg,"closeMenu61()")
  cid=J(pg,"(()=>{const t=addTaskFrom('창틀 닦기 %10');t.due=midKey68();saveTask(t);render();return t.id})()")
  J(pg,f"taskMenu61(TASKS['{cid}'],200,200)");pg.wait_for_timeout(200)
  ok(J(pg,"document.querySelector('#m61 .m61h').textContent").startswith('🧽'),'③ 관리 할 일 우클릭 = 관리 메뉴(창과 같음)')
  J(pg,"closeMenu61()")
  ok(not errs,'③ 오류 없음',errs[:3]);errs.clear();b.close()

  # ---------- ④ 내일 짜기 관리 단계: 정렬 · 건너뛰기 · 다른 날로 ----------
  for W,H,touch in [(1200,950,False),(390,860,True)]:
    b,pg=run2(pw,W,H,touch);ids=J(pg,SEED)
    J(pg,"planSheet80()");pg.wait_for_timeout(700)
    go=pg.locator('#sheetC [data-w93go]',has_text='관리').first
    ok(go.count()==1,f'[{W}] ④ 내일 짜기에 🧽 관리 단계')
    tap(pg,go,touch);pg.wait_for_timeout(500)
    ok(J(pg,"!!document.querySelector('#sheetC [data-w93cs]')"),f'[{W}] ④ 관리 단계 머리에 정렬')
    J(pg,"(()=>{const s=document.querySelector('#sheetC [data-w93cs]');s.value='name';s.dispatchEvent(new Event('change',{bubbles:true}))})()");pg.wait_for_timeout(400)
    ch=J(pg,"[...document.querySelectorAll('#sheetC .tray93:not(details .tray93) [data-w93s]')].map(x=>TASKS[x.dataset.w93s].title)")
    ok(ch==sorted(ch) and len(ch)>=3,f'[{W}] ④ 이름순으로 칩 정렬',ch)
    ok(J(pg,"C.care128.s")=='name',f'[{W}] ④ 관리 창과 같은 정렬 설정')
    tap(pg,pg.locator(f'#sheetC [data-w93s="{ids["a"]}"]').first,touch);pg.wait_for_timeout(400)
    ok(J(pg,"!!document.querySelector('#sheetC [data-w93skip]')&&!!document.querySelector('#sheetC [data-w93mv]')"),f'[{W}] ④ 고른 관리 칸에 ⏭ 건너뛰기·📆 다른 날로')
    tap(pg,pg.locator('#sheetC [data-w93skip]').first,touch);pg.wait_for_timeout(500)
    t=T(pg,ids['a']);k=J(pg,"addDays(midKey68(),1)")
    ok(t['due']==J(pg,f"addDays('{k}',3)"),f'[{W}] ④ 건너뛰기 → 내일부터 3일 뒤',t['due'])
    ok(J(pg,"!!document.querySelector('#sheetC [data-w93u]')"),f'[{W}] ④ 되돌리기 단추')
    tap(pg,pg.locator(f'#sheetC [data-w93s="{ids["d"]}"]').first,touch);pg.wait_for_timeout(400)
    tap(pg,pg.locator('#sheetC [data-w93mv]').first,touch);pg.wait_for_timeout(300)
    tap(pg,mitem(pg,'+1주'),touch);pg.wait_for_timeout(500)
    ok(T(pg,ids['d'])['due']==J(pg,f"addDays('{k}',7)"),f'[{W}] ④ 📆 다른 날로 → +1주',T(pg,ids['d'])['due'])
    ok(not errs,f'[{W}] ④ 오류 없음',errs[:3]);errs.clear();b.close()

  # ---------- ⑤ 주 N회 칩 끌어 순서 바꾸기 ----------
  b,pg=run2(pw,1200,950)
  J(pg,"(()=>{['운동 주3','영어 주2','독서 주4'].forEach((n,i)=>{const t=addTaskFrom(n.split(' ')[0]);t.rep={f:'x',n:+n.slice(-1)};t.due=addDays(weekStart(midKey68()),6);saveTask(t)});render()})()")
  J(pg,"location.hash='cal'");pg.wait_for_timeout(700)
  J(pg,"C.ui.cal.mode='week';save('config');renderCal()");pg.wait_for_timeout(600)
  names=lambda:J(pg,"[...document.querySelectorAll('.wk91 > .c91[data-wko130]')].map(c=>TASKS[c.dataset.wko130].title)")
  n0=names();ok(len(n0)>=3,'⑤ 주 N회 칩 3개 이상',n0)
  a=pg.locator('.wk91 > .c91[data-wko130]').nth(len(n0)-1).bounding_box();z=pg.locator('.wk91 > .c91[data-wko130]').nth(0).bounding_box()
  drag(pg,ctr(a),(z['x']+4,z['y']+z['height']/2))
  n1=names();ok(n1[0]==n0[-1] and set(n1)==set(n0),'⑤ 마지막 칩을 맨 앞으로 끌기',(n0,n1))
  ok(isinstance(J(pg,"C.wko130"),list) and len(J(pg,"C.wko130"))>=3,'⑤ 순서 저장(C.wko130)')
  J(pg,"render()");pg.wait_for_timeout(400)
  ok(names()==n1,'⑤ 다시 그려도 순서 그대로')
  wc=J(pg,"Object.values(TASKS).filter(t=>t.rep&&t.rep.f==='x').map(t=>JSON.stringify(t.sl91||{})).join('')")
  ok('2026' not in wc,'⑤ 칩 줄 안에 놓으면 날 정함(sl91)이 안 생김',wc)
  ok(not errs,'⑤ 오류 없음',errs[:3]);errs.clear();b.close()

  # ---------- ⑥ ○ 크기 — PC 절반·마우스 올릴 때만 / 폰 작게 늘 ----------
  for W,H,touch in [(1200,950,False),(390,860,True)]:
    b,pg=run2(pw,W,H,touch)
    tid=J(pg,"(()=>{const t=addTaskFrom('회의 준비');t.due=midKey68();t.time='10:00';t.dur=60;saveTask(t);render();return t.id})()")
    J(pg,"location.hash='cal'");pg.wait_for_timeout(600)
    J(pg,"C.ui.cal.mode='1day';ui.calAnchor=midKey68();save('config');renderCal()");pg.wait_for_timeout(600);notoast(pg)
    ck=pg.locator(f'#calPane .blk[data-ctask="{tid}"] .ck128').first
    ok(ck.count()==1,f'[{W}] ⑥ 블록에 ○')
    sz=J(pg,f"(()=>{{const c=document.querySelector('#calPane .blk[data-ctask=\"{tid}\"] .ck128');const s=getComputedStyle(c);return [c.getBoundingClientRect().width,s.opacity]}})()")
    if touch:
      ok(17<=sz[0]<=19 and float(sz[1])==1,f'[{W}] ⑥ 폰: 18px 늘 보임',sz)
      tap(pg,ck,True);pg.wait_for_timeout(900)
      ok(T(pg,tid)['status']==2,f'[{W}] ⑥ 폰: 작은 ○ 눌러 끝냄')
    else:
      ok(11<=sz[0]<=13 and float(sz[1])==0,f'[{W}] ⑥ PC: 12px · 평소엔 안 보임',sz)
      blk=pg.locator(f'#calPane .blk[data-ctask="{tid}"]').first;blk.scroll_into_view_if_needed();bb=blk.bounding_box();pg.mouse.move(bb['x']+20,bb['y']+20);pg.wait_for_timeout(300)
      ok(float(J(pg,f"getComputedStyle(document.querySelector('#calPane .blk[data-ctask=\"{tid}\"] .ck128')).opacity"))==1,f'[{W}] ⑥ PC: 마우스 올리면 보임')
      cb=ck.bounding_box();pg.mouse.move(*ctr(cb));pg.mouse.click(*ctr(cb));pg.wait_for_timeout(900)
      ok(T(pg,tid)['status']==2,f'[{W}] ⑥ PC: ○ 눌러 끝냄')
    ok(not errs,f'[{W}] ⑥ 오류 없음',errs[:3]);errs.clear();b.close()

print('FAILS',len(FAILS),FAILS)
