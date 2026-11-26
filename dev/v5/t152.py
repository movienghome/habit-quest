# t152 (v13.16): 식사 블록 personal 목록 · ○ 체크
import os,json
os.environ.setdefault('HQURL','file:///home/claude/habit-quest/beta/index.html')
exec(open('/home/claude/habit-quest/dev/v5/h61.py').read())
URL=os.environ.get('HQURL',URL)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
J=lambda pg,x:pg.evaluate(x)
with sync_playwright() as pw:
    for W,H,nm in ((1200,900,'PC'),(390,800,'폰')):
        b0,pg=run(pw,W=W,H=H);closepops(pg)
        J(pg,"(()=>{C.meal80=1;const c=ml80cfg();c.on=1;save('config');render()})()");pg.wait_for_timeout(600)
        J(pg,"render()");pg.wait_for_timeout(500)
        r=J(pg,"""(()=>{const pid=(C.lists||[]).find(x=>/personal|개인/i.test(x.name));const m=Object.values(TASKS).filter(t=>t.ml80);return {pid:pid&&pid.id,n:m.length,lists:[...new Set(m.map(t=>t.list))],names:(C.lists||[]).map(x=>x.name)}})()""")
        print(r)
        ok(r['n']>0,nm+' 식사 블록이 만들어짐',r)
        ok(r['pid'] and r['lists']==[r['pid']],nm+' 식사 블록이 personal 목록',r)
        J(pg,"location.hash='cal'");pg.wait_for_timeout(900)
        pg.evaluate("""()=>{const b=[...document.querySelectorAll('button,.seg button,[data-calv]')].find(x=>x.textContent.trim()==='주');if(b)b.click()}""");pg.wait_for_timeout(600)
        J(pg,"(()=>{const td=midKey68();const t=Object.values(TASKS).find(t=>t.ml80&&t.status===0&&t.due>=td);window.__mt=t&&t.id;return 1})()")
        mt=J(pg,"window.__mt")
        n=J(pg,"""(id)=>{renderCal&&renderCal();return [...document.querySelectorAll('[data-ctask="'+id+'"] > .ck128')].length}""") if False else pg.evaluate("""(id)=>{renderCal();const els=[...document.querySelectorAll('[data-ctask="'+id+'"]')];return {els:els.length,ck:els.filter(e=>e.querySelector(':scope > .ck128')).length,w:els.map(e=>e.offsetWidth)}}""",mt)
        print(nm,n)
        if W>400: ok(n['els']>0 and n['ck']>0,nm+' 식사 블록에 ○ 단추',n)
        else: print('폰: 좁은 칸은 ○ 생략 가능',n)
        if n['ck']>0:
            pg.evaluate("""(id)=>{document.querySelector('[data-ctask="'+id+'"] > .ck128').click()}""",mt);pg.wait_for_timeout(400)
            ok(J(pg,"(id)=>TASKS[id].status")==2 if False else pg.evaluate("(id)=>TASKS[id].status",mt)==2,nm+' ○ 누르면 먹었어요(status 2)')
    print('FAILS',len(FAILS),FAILS)
