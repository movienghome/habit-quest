# v13.28: 생활 = 🧺 관리 상태 막대(HP 밖) — 제때 관리 비율 · 진척 칩에서 빠짐 · 설명 창 · 관리 창 열기
from h61 import *
import json
F=[]
def ok(c,m,x=None):print(('PASS ' if c else 'FAIL ')+m+(' · '+str(x) if x is not None else ''));(None if c else F.append(m))
for W,H in((1400,900),(390,844)):
  with sync_playwright() as pw:
    b,pg=run(pw,W,H);pg.wait_for_timeout(500)
    r=json.loads(pg.evaluate("""()=>JSON.stringify({k:akOf101('life'),m4:C.f4mig147,m5:C.f5mig148,body:akOf101('body'),mind:akOf101('mind')})"""))
    ok(r['k']=='k','생활 → 🧺 관리',r);ok(r['m5']==1,'한 번짜리 표시');ok(r['body']=='c' and r['mind']=='c','몸·마음 컨디션 그대로')
    pg.evaluate("""()=>{const td=midKey68(),y=addDays(td,-3);
      const H=newTask({title:'집 청소'});careOn77(H,7);saveTask(H);
      const A=newTask({title:'욕실 청소'});A.parent=H.id;careOn77(A,7);A.due=y;saveTask(A);
      const B=newTask({title:'바닥 청소'});B.parent=H.id;careOn77(B,7);B.due=td;saveTask(B);
      const D=newTask({title:'분리수거'});careOn77(D,3);D.due=addDays(td,2);saveTask(D);
      const E=newTask({title:'어항 환수'});careOn77(E,7);E.due=addDays(td,-1);saveTask(E);
      location.hash='#home';render()}""");pg.wait_for_timeout(600)
    c=json.loads(pg.evaluate("()=>{const c=care148();return JSON.stringify({n:c.n,ok:c.ok,v:c.v,late:c.late.map(t=>t.title)})}"))
    print(c)
    ok(c['n']==4,'묶음 머리 빼고 4개',c['n']);ok(c['ok']==2 and c['v']==50,'제때 2/4 = 50(오늘 차례는 제때)',c);ok(c['late']==['욕실 청소','어항 환수'],'밀린 것 순서',c['late'])
    h=json.loads(pg.evaluate("""()=>{const el=$('areaBars'),k=el&&el.querySelector('.area.k148');const pc=[...el.querySelectorAll('.pc101')].map(x=>x.dataset.aj67);
      const bars=[...el.querySelectorAll('.area')].map(x=>x.querySelector('b').textContent);return JSON.stringify({k:!!k,num:k&&k.querySelector('.num').textContent,w:k&&k.querySelector('.fill').style.width,pc,bars,ow:el.scrollWidth<=el.clientWidth+1})}"""))
    print(h)
    ok(h['k'] and h['num']=='50' and h['w']=='50%','홈 영역 막대 줄에 관리 막대 50',h);ok('life' not in h['pc'],'진척 칩에서 생활 빠짐',h['pc']);ok(h['bars'][:2]==['몸','마음'] and '생활' in h['bars'],'몸·마음 막대 그대로',h['bars']);ok(h['ow'],'가로 안 넘침')
    g=json.loads(pg.evaluate("""()=>{const k=document.querySelector('#areaBars .area.k148'),bb=k.querySelector('b'),tr=k.querySelector('.track');const r1=bb.getBoundingClientRect(),r2=tr.getBoundingClientRect();return JSON.stringify({sw:bb.scrollWidth,cw:bb.clientWidth,gap:r2.left-r1.right})}"""))
    ok(g['sw']<=g['cw']+1 and g['gap']>=0,'이름이 막대와 안 겹침',g)
    y=json.loads(pg.evaluate("""()=>JSON.stringify([...document.querySelectorAll('#areaBars > .area')].map(x=>{const r=x.getBoundingClientRect(),t=x.querySelector('.track').getBoundingClientRect();return [Math.round(r.top),Math.round(t.width),x.querySelector('b').textContent]}))"""))
    print(y);ok(len({r[0] for r in y[:3]})==1,'몸·마음·생활 한 줄',y);ok(all(r[1]>=40 for r in y[:3]),'막대 너비 40px 이상',y);ok(all('🧺' not in r[2] for r in y),'이름에 아이콘 없음')
    v=json.loads(pg.evaluate("""()=>{const d=curDay(),b0=hpParts101(d);applyEntry(d,{kind:'act',type:'bad',aid:'x',name:'생활 나쁜 일',cond:-30,xp:0,gold:0,area:'life'});const b1=hpParts101(d);return JSON.stringify({a:b0.inn,b:b1.inn})}"""))
    ok(v['a']==v['b'],'생활 점수는 HP에 안 들어감',v)
    pg.evaluate("()=>render()");pg.wait_for_timeout(300)
    pg.click('#areaBars .area.k148');pg.wait_for_timeout(400)
    t=pg.evaluate("()=>{const p=$('pop');return p&&!p.hidden?p.innerText:''}")
    ok('관리 상태 50' in t and '밀림 2' in t and '욕실 청소' in t and '3일 밀림' in t,'설명 창 관리 상태·밀린 것',t[:200])
    ok('이 영역은' in t,'종류 바꾸기 칩 그대로')
    pg.click('[data-c148]');pg.wait_for_timeout(600)
    s=pg.evaluate("()=>{const s=$('sheet');return s&&!s.hidden?s.innerText.slice(0,80):(document.body.classList.contains('docked')?'docked':'')}")
    ok(bool(s),'🧽 관리 창 열림',s)
    b.close()
print('FAILS',len(F),F)
