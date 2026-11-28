# 화면 순회 점검(smoke): 모든 화면을 PC·폰 크기로 열어 보고 — 오류 없음 · 화면이 비지 않음 · 폰에서 가로로 넘치지 않음.
# 새 기능을 만든 뒤 "어디가 깨졌나"를 사람이 눌러 보지 않아도 되게 하는 시험(릴리스마다 돌리기).
from h61 import *
import json
F=[]
def ok(c,m,x=None):print(('PASS ' if c else 'FAIL ')+m+(' · '+str(x) if x is not None else ''));(None if c else F.append(m))
# 알려진 소음(환경 때문에 생기는 것)은 걸러냄: 목업엔 서비스워커·외부 글꼴이 없음
NOISE=('favicon','Failed to load resource','net::ERR','gstatic','ServiceWorker')
def newerrs(start):
    return [e for e in errs[start:] if not any(n in e for n in NOISE)]
for W,H in((1400,900),(390,844)):
  print('=== ',W)
  with sync_playwright() as pw:
    b,pg=run(pw,W,H,pre=os.environ.get("HQPRE",""));pg.wait_for_timeout(600);closepops(pg)
    views=pg.evaluate("()=>VIEWS.slice()")
    ok(len(views)>=10,'화면 목록을 읽음',views)
    for v in views:
      s=len(errs)
      pg.evaluate("(v)=>{location.hash='#'+v}",v);pg.wait_for_timeout(700);closepops(pg)
      cur=pg.evaluate("()=>typeof curView==='function'?curView():null")
      info=pg.evaluate("""()=>{const el=document.querySelector('.view.on,.view:not([hidden])')||document.body;
        const vis=[...document.querySelectorAll('.view')].filter(e=>e.offsetParent!==null);
        return JSON.stringify({txt:(vis[0]?vis[0].innerText:document.body.innerText).trim().length,n:vis.length,
          sw:document.documentElement.scrollWidth,iw:window.innerWidth})}""")
      i=json.loads(info)
      e=newerrs(s)
      ok(not e,f'[{W}] {v}: 오류 없음',e[:2] if e else None)
      ok(i['txt']>20,f'[{W}] {v}: 화면에 내용이 있음',i['txt'])
      # 화면 글자에 깨진 값(undefined·NaN·[object Object])이 보이면 안 됨 — 계산·표시 버그의 가장 흔한 흔적
      bad=pg.evaluate("()=>{const t=document.body.innerText;const m=t.match(/.{0,18}(undefined|NaN|\\[object Object\\]|Infinity).{0,18}/g);return m?m.slice(0,3):[]}")
      ok(not bad,f'[{W}] {v}: 깨진 값(undefined·NaN) 글자 없음',bad or None)
      if W<500:ok(i['sw']<=i['iw']+2,f'[{W}] {v}: 폰에서 가로로 안 넘침',(i['sw'],i['iw']))
    # 카드 메뉴(좋은·나쁜 카드): 단추 글자가 비거나 undefined면 안 됨
    pg.evaluate("()=>{location.hash='#log'}");pg.wait_for_timeout(800);closepops(pg)
    for ty in('good','bad'):
      pg.evaluate("(ty)=>{const m=document.getElementById('m61');m&&(m.innerHTML='');actMenu61(C.actions.find(a=>a.type===ty&&!a.doneAt),200,300)}",ty);pg.wait_for_timeout(350)
      labs=pg.evaluate("()=>[...document.querySelectorAll('#m61 button')].map(b=>b.innerText.trim())")
      ok(len(labs)>=6 and all(l and 'undefined' not in l for l in labs),f'[{W}] {ty} 카드 메뉴 단추 글자 정상',[l for l in labs if (not l) or 'undefined' in l] or None)
      pg.keyboard.press('Escape');pg.evaluate("()=>{const m=document.getElementById('m61');m&&m.remove()}")
    # 편집 화면의 탭을 하나씩
    s=len(errs)
    tabs=pg.evaluate("()=>(typeof TABS!=='undefined'?TABS.map(t=>t[0]):[])")
    for t in tabs:
      pg.evaluate("(t)=>{try{ui.edit=t;location.hash='#edit';renderEdit()}catch(e){window.__te=String(e)}}",t);pg.wait_for_timeout(350)
    ok(not newerrs(s),f'[{W}] 편집 탭 {len(tabs)}개 오류 없음',newerrs(s)[:2] or None)
    # 새로고침 뒤에도 같은 화면에서 오류 없음(저장된 설정을 읽는 길)
    s=len(errs);pg.reload();pg.wait_for_timeout(2300);closepops(pg)
    ok(not newerrs(s),f'[{W}] 새로고침 뒤 오류 없음',newerrs(s)[:2] or None)
    b.close()
print('FAILS',len(F));[print(' -',m) for m in F]
