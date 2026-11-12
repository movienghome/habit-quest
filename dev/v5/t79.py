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

def body(pg,phone=False):
    T='폰: ' if phone else ''
    for f in (t_j10,t_b18,t_b19):
        safe(lambda f=f:f(pg,T),T+f.__name__)

with sync_playwright() as pw:
    b,pg=run(pw,1400,900);body(pg);b.close()
    b,pg=run(pw,390,800);body(pg,True);b.close()
print('ERRS',errs[:5]);print('FAILS',len(FAILS),FAILS)
