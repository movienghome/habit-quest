# v8.3 시험 — C묶음(캘린더). C1: 월 보기 여러 날 막대
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
J=lambda pg,x:pg.evaluate(x)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra) if extra!='' else ''))
    if not c:FAILS.append(msg)
def notoast(pg):J(pg,"(()=>{const t=document.getElementById('toast');if(t){t.classList.remove('on');t.style.pointerEvents=''}})()")
def mk(pg,title,o=None):
    return J(pg,"((title,o)=>{const t=newTask({title,list:(o||{}).list});Object.assign(t,o||{});saveTask(t);return t.id})("+json.dumps(title)+","+json.dumps(o or {})+")")
def safe(f,msg):
    try:f()
    except Exception as e:ok(False,msg+' (예외)',str(e)[:200])
def gocal(pg,mode='month'):
    J(pg,"(()=>{C.ui.cal=C.ui.cal||{};C.ui.cal.mode='%s';save('config');location.hash='cal'})()"%mode);pg.wait_for_timeout(900);closepops(pg);notoast(pg)
    J(pg,"renderCal()");pg.wait_for_timeout(300)

def t_c1(pg,W):
    td=J(pg,"midKey68()")
    ids=J(pg,"""(()=>{const td=midKey68();const m=td.slice(0,8);const mon=weekStart(td);
      const a=newTask({title:'촬영긴'});a.due=addDays(mon,-2);a.end71=addDays(mon,9);saveTask(a);
      const b=newTask({title:'여행둘'});b.due=addDays(mon,1);b.end71=addDays(mon,2);saveTask(b);
      const c=newTask({title:'일반일'});c.due=addDays(mon,1);saveTask(c);
      return {a:a.id,b:b.id,c:c.id,mon}})()""")
    gocal(pg)
    r=J(pg,"""(()=>{const g=document.querySelector('#calMain .mgrid');const bars=[...g.querySelectorAll('.bar83')];
      const chipsSpan=[...g.querySelectorAll('.mc .cchip')].filter(x=>/촬영긴|여행둘/.test(x.textContent)).length;
      return {n:bars.length,txt:bars.map(b=>b.textContent),chipsSpan,
        w:bars.map(b=>Math.round(b.getBoundingClientRect().width))}})()""")
    ok(r['n']>=3,f'[{W}] 막대 조각들이 그려짐(긴 일정 2~3주 줄 + 둘째)',r)
    ok(r['chipsSpan']==0,f'[{W}] 여러 날 일정이 칸 칩으로는 안 남음')
    ok(any('‹' in t for t in r['txt']) or any('›' in t for t in r['txt']),f'[{W}] 이어지는 쪽 ‹ › 표시')
    ov=J(pg,"""(()=>{const g=document.querySelector('#calMain .mgrid');const bars=[...g.querySelectorAll('.bar83')].map(b=>b.getBoundingClientRect());
      let o=0;for(let i=0;i<bars.length;i++)for(let j=i+1;j<bars.length;j++){const a=bars[i],b=bars[j];if(a.left<b.right-1&&b.left<a.right-1&&a.top<b.bottom-1&&b.top<a.bottom-1)o++}
      const cc=[...g.querySelectorAll('.mc .cchip:not([hidden])')].map(c=>c.getBoundingClientRect());let o2=0;
      bars.forEach(a=>cc.forEach(b=>{if(a.left<b.right-1&&b.left<a.right-1&&a.top<b.bottom-1&&b.top<a.bottom-1)o2++}));return [o,o2]})()""")
    ok(ov[0]==0,f'[{W}] 막대끼리 안 겹침',ov)
    ok(ov[1]==0,f'[{W}] 막대와 칸 칩이 안 겹침',ov)
    # 눌러서 열기
    pg.evaluate("document.querySelector('#calMain .bar83').scrollIntoView({block:'center'})");pg.wait_for_timeout(200)
    bb=pg.locator('#calMain .bar83').first.bounding_box()
    pg.mouse.click(bb['x']+bb['width']/2,bb['y']+bb['height']/2);pg.wait_for_timeout(600)
    ok(J(pg,"!!document.getElementById('tsTitle')"),f'[{W}] 막대 누르면 할 일 상세가 열림')
    J(pg,"(()=>{try{closeSheet()}catch(e){}})()");pg.wait_for_timeout(300)
    # 끌어서 옮기기: 둘째 일정(여행둘)을 +2일 칸으로 (잡은 날=첫날)
    before=J(pg,"(id=>[TASKS[id].due,TASKS[id].end71])(%s)"%json.dumps(ids['b']))
    src=J(pg,"""(id=>{const b=[...document.querySelectorAll('#calMain .bar83')].find(x=>x.dataset.ctask===id);b.scrollIntoView({block:'center'});const r=b.getBoundingClientRect();return [r.x,r.y,r.width,r.height]})(%s)"""%json.dumps(ids['b']))
    k0=before[0];k2=J(pg,"(k=>addDays(k,2))(%s)"%json.dumps(k0))
    dst=J(pg,"""(k=>{const c=document.querySelector('#calMain .mc[data-calday="'+k+'"]');if(!c)return null;const r=c.getBoundingClientRect();return [r.x,r.y,r.width,r.height]})(%s)"""%json.dumps(k2))
    if dst:
        pg.mouse.move(src[0]+6,src[1]+src[3]/2);pg.mouse.down();pg.wait_for_timeout(520)
        pg.mouse.move(src[0]+14,src[1]+src[3]/2+4,steps=3);pg.mouse.move(dst[0]+dst[2]/2,dst[1]+dst[3]*0.7,steps=12);pg.wait_for_timeout(120);pg.mouse.up();pg.wait_for_timeout(600)
        after=J(pg,"(id=>[TASKS[id].due,TASKS[id].end71])(%s)"%json.dumps(ids['b']))
        ok(after[0]==k2 and after[1]==J(pg,"(k=>addDays(k,3))(%s)"%json.dumps(k0)),f'[{W}] 막대를 끌어 놓으면 길이 그대로 옮겨짐',(before,after))
    else:ok(False,f'[{W}] 끌어 놓을 칸을 못 찾음')
    # 다시 그린 뒤에도 막대 위치가 칸에 맞음
    pos=J(pg,"""(()=>{const g=document.querySelector('#calMain .mgrid');const gr=g.getBoundingClientRect();return [...g.querySelectorAll('.bar83')].every(b=>{const r=b.getBoundingClientRect();return r.left>=gr.left-1&&r.right<=gr.right+1&&r.top>=gr.top-1&&r.bottom<=gr.bottom+1})})()""")
    ok(pos,f'[{W}] 막대가 달력 칸 안에 있음')
    # 날짜 눌러 아래 목록 열어도(칸 높이 바뀜) 막대가 따라감
    c=J(pg,"""(()=>{const c=document.querySelector('#calMain .mc[data-calday]:not(.other) .dn');const r=c.getBoundingClientRect();return [r.x+4,r.y+4]})()""")
    pg.mouse.click(*c);pg.wait_for_timeout(700)
    al=J(pg,"""(()=>{const g=document.querySelector('#calMain .mgrid');const mcs=[...g.querySelectorAll('.mc[data-calday]')];return [...g.querySelectorAll('.bar83')].every(b=>{const [a,z]=b.dataset.c83.split('-').map(Number);const ra=mcs[a].getBoundingClientRect(),rb=b.getBoundingClientRect(),sp=mcs[a].querySelector('.sp83').getBoundingClientRect();return Math.abs(rb.left-ra.left-1)<2&&rb.top>=sp.top-1&&rb.bottom<=sp.bottom+16})})()""")
    ok(al,f'[{W}] 날짜 목록을 열어도 막대가 칸을 따라감')

with sync_playwright() as pw:
    for W,H in ((1400,900),(390,780)):
        b,pg=run(pw,W,H)
        safe(lambda:t_c1(pg,W),f'C1 {W}')
        b.close()
print('ERRS',[e for e in errs if 'favicon' not in e][:6])
print('FAILS',len(FAILS),FAILS)
