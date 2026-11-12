# v7.9 시험 — B 둘째 조각 + J10. 사용자가 실제로 누르는 경로로. 옛 빌드 비교: HQURL=http://localhost:8766/beta/index.html python3 t79.py
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
J=lambda pg,x:pg.evaluate(x)
SP='/tmp/claude-0/sp/';os.makedirs(SP,exist_ok=True)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra) if extra!='' else ''))
    if not c:FAILS.append(msg)
def vis(pg,sel):return pg.locator(sel).locator('visible=true').first
def cnt(pg,sel):return pg.locator(sel).locator('visible=true').count()
def clk(pg,sel,w=450):
    if not cnt(pg,sel):return False
    vis(pg,sel).click();pg.wait_for_timeout(w);closepops(pg);return True
def notoast(pg):J(pg,"(()=>{const t=document.getElementById('toast');if(t){t.classList.remove('on');t.style.pointerEvents=''}})()")
def safe(f,msg):
    try:f()
    except Exception as e:ok(False,msg+' (예외)',str(e)[:200])
def menu(pg,txt,w=500):
    m=pg.locator('#m61 [role=menuitem]',has_text=txt)
    if not m.count():return False
    m.first.click();pg.wait_for_timeout(w);return True
def mk(pg,title,o=None):
    return J(pg,"((title,o)=>{const t=newTask({title,list:(o||{}).list});Object.assign(t,o||{});saveTask(t);return t.id})("+json.dumps(title)+","+json.dumps(o or {})+")")
def closesheet(pg):J(pg,"(()=>{try{closeSheet()}catch(e){}})()");pg.wait_for_timeout(300)
def gotasks(pg):
    J(pg,"(()=>{location.hash='tasks';C.ui.tasks.sel='all';save('config');render()})()");pg.wait_for_timeout(700);closepops(pg);notoast(pg)
def opensheet(pg,tid):
    if not clk(pg,f'#tList .trow[data-task="{tid}"] .tt',600):J(pg,f"openTaskSheet('{tid}')");pg.wait_for_timeout(600)

def t_j10(pg,T=''):
    mk(pg,'위생 일',{'due':J(pg,"midKey68()")})
    gotasks(pg)
    if T:
        J(pg,"location.hash='cal'");pg.wait_for_timeout(800);closepops(pg);notoast(pg)
    clk(pg,'#calFilterBtn',500)
    ok(cnt(pg,'#sheetC h3')>=1 and '보일 것 / 숨길 것' in vis(pg,'#sheetC h3').inner_text(),T+'거르기 창 이름 = 보일 것 / 숨길 것',vis(pg,'#sheetC h3').inner_text() if cnt(pg,'#sheetC h3') else '')
    ok('고른 것만 보임' in J(pg,"document.querySelector('#sheetC').innerText") and '고른 것은 숨김' in J(pg,"document.querySelector('#sheetC').innerText"),T+'두 모드 이름')
    ok('아무것도 안 골라서' in J(pg,"document.getElementById('f77n').innerText"),T+'안 골랐으면 전부 보임')
    lid=J(pg,"(()=>{const l=C.lists.find(x=>x.id!=='inbox');return l&&l.id})()")
    clk(pg,f'#sheetC [data-f77="lists"][data-v="{lid}"]',400)
    n=J(pg,"document.getElementById('f77n').innerText")
    ok('만 보는 중' in n,T+'고르면 "○○만 보는 중" 글자',n)
    tt=J(pg,"document.getElementById('calFilterBtn').title")
    ok('만 보는 중' in tt,T+'단추 설명에도 모드',tt)
    clk(pg,'#sheetC [data-f77m="1"]',400)
    n=J(pg,"document.getElementById('f77n').innerText")
    ok('숨기는 중' in n and '숨기는 중' in J(pg,"document.getElementById('calFilterBtn').title"),T+'숨김 모드 → "○○ 숨기는 중"',n)
    clk(pg,'#sheetC [data-f77x]',400);clk(pg,'#sheetC [data-sheet="close"]',300)
    ok(J(pg,"fOn77()")==0 and '보일 것 / 숨길 것' in J(pg,"document.getElementById('calFilterBtn').title"),T+'모두 풀기 → 설명 원래대로')
    ok('거르기' not in J(pg,"document.getElementById('calFilterBtn').title"),T+"단추 설명에 '거르기' 글자 없음")

def t_b18(pg,T=''):
    mk(pg,'예산 시험',{'due':J(pg,"midKey68()"),'time':'10:00','dur':120})
    gotasks(pg)
    if T:
        J(pg,"location.hash='cal'");pg.wait_for_timeout(800);closepops(pg);notoast(pg)
        clk(pg,'#cal62v',400);menu(pg,'3일',600)
    hs=J(pg,"[...document.querySelectorAll('.tghead .dh[data-calday]')].filter(h=>h.offsetParent).map(h=>Math.round(h.getBoundingClientRect().height))")
    ok(len(hs)>0 and max(hs)<=30,T+'날짜 칸 높이 한 줄(≤30px)',hs[:4])
    ok(J(pg,"!!document.querySelector('.tghead .dh .bud76')"),T+'하루 예산 표시는 그대로')
    pg.screenshot(path=SP+('t79_b18_p.png' if T else 't79_b18.png'))

def t_b19(pg,T=''):
    tid=mk(pg,'접기 시험',{'due':J(pg,"midKey68()")});gotasks(pg);opensheet(pg,tid)
    clk(pg,'#sheetC [data-a78="kids"]',300)
    ok(cnt(pg,'#sheetC .kids56.box71')==1 and cnt(pg,'#sheetC [data-c79="kids"]')==1,T+'＋ 묶인 할 일 → 열린 칸에 접기 단추')
    clk(pg,'#sheetC [data-c79="kids"]',400)
    ok(cnt(pg,'#sheetC .kids56.box71')==0 and cnt(pg,'#sheetC [data-a78="kids"]')==1,T+'접으면 다시 ＋ 칩')
    clk(pg,'#sheetC [data-a78="ck"]',300)
    ok(cnt(pg,'#sheetC .box71.ck71')==1 and cnt(pg,'#sheetC [data-c79="ck"]')==1,T+'＋ 체크리스트 → 접기 단추')
    clk(pg,'#sheetC [data-c79="ck"]',400)
    ok(cnt(pg,'#sheetC .box71.ck71')==0 and cnt(pg,'#sheetC [data-a78="ck"]')==1,T+'접으면 다시 ＋ 칩')
    # 항목이 있는 체크리스트 = 한 줄 접기
    clk(pg,'#sheetC [data-a78="ck"]',300)
    vis(pg,'#sheetC #tsSubNew').fill('가');vis(pg,'#sheetC #tsSubNew').press('Enter');pg.wait_for_timeout(500)
    ok(cnt(pg,'#sheetC [data-tssubt]')==1 and cnt(pg,'#sheetC [data-c79="ckt"]')==1,T+'항목 있는 체크리스트: 머리가 접기 토글')
    clk(pg,'#sheetC [data-c79="ckt"]',400)
    ok(cnt(pg,'#sheetC [data-tssubt]')==0 and cnt(pg,'#sheetC [data-c79="ckt"]')==1,T+'접으면 한 줄만')
    clk(pg,'#sheetC [data-c79="ckt"]',400)
    ok(cnt(pg,'#sheetC [data-tssubt]')==1,T+'다시 펴면 항목 보임')
    ok(J(pg,f"(TASKS['{tid}'].subs||[]).length")==1,T+'접어도 항목은 그대로')
    # 묶인 할 일 하나 넣고 접힘 토글 (v7.8 그대로)
    clk(pg,'#sheetC [data-a78="kids"]',300)
    vis(pg,'#sheetC #x56KNew').fill('묶음 하나');vis(pg,'#sheetC #x56KNew').press('Enter');pg.wait_for_timeout(600)
    ok(cnt(pg,'#sheetC [data-k78]')==1,T+'묶인 할 일 있으면 v7.8 접힘 토글 그대로')
    ok(cnt(pg,'#sheetC [data-c79="kids"]')==0,T+'…이때는 접기 단추 중복 없음')

def vkeys(pg):return J(pg,"[...document.querySelectorAll('#sheetC .tchips [data-k79]')].filter(e=>!e.classList.contains('hid78')).map(e=>e.dataset.k79)")
def t_b17(pg,T=''):
    closesheet(pg);tid=mk(pg,'칩 시험',{'due':J(pg,"midKey68()")});gotasks(pg);opensheet(pg,tid)
    k=vkeys(pg)
    ok(k==['when','list','prio','area'],T+'새 할 일: 날짜·목록·중요도·영역만 보임',k)
    ok(cnt(pg,'#sheetC .more79')==1 and '＋ 더' in vis(pg,'#sheetC .more79').inner_text(),T+'＋ 더 단추',vis(pg,'#sheetC .more79').inner_text() if cnt(pg,'#sheetC .more79') else '')
    ok(J(pg,"(()=>{const c=document.querySelector('#sheetC .tchips');return c.scrollWidth<=c.clientWidth+2})()"),T+'접힌 칩 줄은 옆으로 안 넘침')
    clk(pg,'#sheetC .more79',300)
    k=vkeys(pg);ok(len(k)>=9 and cnt(pg,'#sheetC .div79')==1,T+'＋ 더 → 전부 + 구분선',k)
    ok('－ 접기' in vis(pg,'#sheetC .more79').inner_text(),T+'단추가 접기로')
    # 태그 칩을 구분선 앞(영역 칩 뒤)으로 끌기 = 고정
    def box(sel):return J(pg,"(()=>{const r=document.querySelector('"+sel+"').getBoundingClientRect();return [r.x,r.y,r.width,r.height]})()")
    a=box('#sheetC .tchips [data-k79="tags"]');z=box('#sheetC .tchips [data-k79="area"]')
    pg.mouse.move(a[0]+a[2]/2,a[1]+a[3]/2);pg.mouse.down();pg.mouse.move(a[0]+a[2]/2+8,a[1]+a[3]/2+3,steps=3)
    pg.mouse.move(z[0]+z[2]*0.85,z[1]+z[3]/2,steps=10);pg.wait_for_timeout(100);pg.mouse.up();pg.wait_for_timeout(450)
    o=J(pg,"C.chipOrd79")
    ok(o and o.index('tags')<o.index('|'),T+'태그 칩을 구분선 앞으로 끌면 고정(저장)',o)
    ok(cnt(pg,'#sheetC .tpanel[data-p="tags"]:not([hidden])')==0,T+'끈 뒤 태그 칸이 열리지 않음(클릭 막힘)')
    clk(pg,'#sheetC .more79',300)
    ok('tags' in vkeys(pg) and 'card' not in vkeys(pg),T+'접으면 고정한 태그는 보이고 카드는 숨음',vkeys(pg))
    # 다른 새 할 일에서도 그대로
    closesheet(pg);tid2=mk(pg,'칩 시험 둘',{'due':J(pg,"midKey68()")});gotasks(pg);opensheet(pg,tid2)
    ok('tags' in vkeys(pg),T+'다른 할 일 상세에서도 태그 칩 고정')
    # 값이 있으면 숨김 구역이어도 보임: 타이머 목표 넣기
    closesheet(pg);J(pg,f"(()=>{{const t=TASKS['{tid2}'];t.dur=30;saveTask(t);render()}})()");pg.wait_for_timeout(400);opensheet(pg,tid2)
    ok('timer' in vkeys(pg),T+'값이 있는 칩(타이머)은 숨김 구역이어도 보임',vkeys(pg))
    # 다시 숨김 구역으로
    clk(pg,'#sheetC .more79',300)
    a=box('#sheetC .tchips [data-k79="tags"]');z=box('#sheetC .tchips .div79')
    pg.mouse.move(a[0]+a[2]/2,a[1]+a[3]/2);pg.mouse.down();pg.mouse.move(a[0]+a[2]/2+8,a[1]+a[3]/2+3,steps=3)
    pg.mouse.move(z[0]+z[2]*0.8,z[1]+z[3]/2,steps=10);pg.wait_for_timeout(100);pg.mouse.up();pg.wait_for_timeout(450)
    o=J(pg,"C.chipOrd79");ok(o and o.index('tags')>o.index('|'),T+'구분선 뒤로 끌면 다시 숨김 구역',o)
    # 칩 눌러 칸 열기는 그대로 (날짜)
    clk(pg,'#sheetC .more79',300)
    clk(pg,'#sheetC .tchips [data-x56panel="when"]',300)
    ok(cnt(pg,'#sheetC #tsDue')==1,T+'날짜 칩 눌러 칸 열기 그대로')

def body(pg,phone=False):
    T='폰: ' if phone else ''
    for f in (t_j10,t_b18,t_b19,t_b17):
        safe(lambda f=f:f(pg,T),T+f.__name__)

with sync_playwright() as pw:
    b,pg=run(pw,1400,900);body(pg);b.close()
    b,pg=run(pw,390,800);body(pg,True);b.close()
print('ERRS',errs[:5]);print('FAILS',len(FAILS),FAILS)
