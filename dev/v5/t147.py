# t147 (v13.11): e.key 없는 keydown(자동완성·가상 키보드)에서 toLowerCase 오류가 안 나는지
import os
os.environ.setdefault('HQURL','file:///home/claude/habit-quest/beta/index.html')
exec(open('/home/claude/habit-quest/dev/v5/h61.py').read())
URL=os.environ.get('HQURL',URL)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
with sync_playwright() as pw:
    b0,pg=run(pw);closepops(pg)
    errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    # key가 없는 keydown: 일반 · Ctrl · 할 일 화면 · 캘린더 화면
    for view in ('tasks','calendar','home'):
        pg.evaluate("v=>{location.hash=v}",view);pg.wait_for_timeout(400)
        pg.evaluate("""()=>{for(const o of [{},{ctrlKey:true},{metaKey:true},{altKey:true},{ctrlKey:true,shiftKey:true}]){
          for(const t of [document,window]){const e=new Event('keydown',{bubbles:true});Object.assign(e,o);t.dispatchEvent(e)}}}""")
        pg.wait_for_timeout(200)
    bad=[e for e in errs if 'toLowerCase' in e]
    ok(not bad,'e.key 없는 keydown에서 toLowerCase 오류 없음',bad)
    # 정상 키는 그대로: 할 일 화면 Ctrl+F → 찾기 칸 포커스, 캘린더 N 단축키는 동작 유지
    pg.evaluate("()=>{location.hash='tasks'}");pg.wait_for_timeout(500)
    pg.keyboard.press('Control+f');pg.wait_for_timeout(200)
    ok(pg.evaluate("document.activeElement&&document.activeElement.id")=='tq71','Ctrl+F → 할 일 찾기 칸 포커스(그대로)')
    b0.close()
print('FAILS',len(FAILS))
