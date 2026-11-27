# v13.29: F5-① 기준형 카드(옵션 판정 ▲○▼) + 경제 칩 🛒 쓴 것 / ▼ 깎인 것 / 참음 n/m
from h61 import *
import json
F=[]
def ok(c,m,x=None):print(('PASS ' if c else 'FAIL ')+m+(' · '+str(x) if x is not None else ''));(None if c else F.append(m))
J=lambda pg,js:json.loads(pg.evaluate(js))
for W,H in((1400,900),(390,844)):
  print('=== ',W)
  with sync_playwright() as pw:
    b,pg=run(pw,W,H);pg.wait_for_timeout(500);closepops(pg)
    # ---------- 경제 칩 ----------
    pg.evaluate("""()=>{location.hash='#home';render()}""");pg.wait_for_timeout(300)
    e0=J(pg,"()=>JSON.stringify(econ148())")
    pg.evaluate("""()=>{const d=today();applyEntry(d,{kind:'act',type:'good',aid:'x',name:'일',xp:5,gold:120,cond:0});applyEntry(d,{kind:'buy',type:'bad',name:'상점 구매: 테무',xp:0,gold:-40,cond:0});
      applyEntry(d,{kind:'act',type:'bad',aid:'y',name:'감점 행동',xp:0,gold:-15,cond:-3});
      d.imp110=d.imp110||[];d.imp110.push({id:'u1',k:'f',n:'야식',t:'22:00',s:'p'},{id:'u2',k:'b',n:'옷',t:'13:00',s:'p'},{id:'u3',k:'f',n:'과자',t:'14:00',s:'p'},{id:'u4',k:'b',n:'잡화',t:'15:00',s:'p'});save(d.date);
      hold110('u1');swap110('u2',1);gave110('u3');render()}""");pg.wait_for_timeout(500)
    e1=J(pg,"()=>JSON.stringify(econ148())");print(e0,e1)
    ok(e1['buy']-e0['buy']==40,'🛒 쓴 것 = 상점 구매 40만',(e1['buy']-e0['buy']))
    ok(e1['cut']-e0['cut']>=15,'▼ 깎인 것에 감점 15',(e1['cut']-e0['cut']))
    ok(e1['h']-e0['h']==2 and e1['sw']-e0['sw']==1,'참음 2(참음+바꿈), 바꿈 1',e1)
    ok(e1['g']-e0['g']==1 and e1['n']-e0['n']==3,'참지 못함 1 · 확정 3(열린 것 안 셈)',e1)
    c=J(pg,"""()=>{const x=document.querySelector('#areaBars .pc101.ec148');return JSON.stringify({t:x&&x.textContent,tt:x&&x.title,ow:$('areaBars').scrollWidth<=$('areaBars').clientWidth+1})}""");print(c)
    ok(c['t'] and ('참음 %d/%d'%(e1['h'],e1['n'])) in c['t'] and '🛒' in c['t'] and '▼' in c['t'] and '▲' in c['t'],'칩: ▲ 🛒 ▼ 참음 n/m',c['t'])
    ok('참지 못함' in c['tt'] and '깎인 것' in c['tt'] and '바꿈' in c['tt'],'칩 설명에 다 글자로',c['tt'])
    ok(c['ow'],'칩 줄 가로 안 넘침')
    pg.click('#areaBars .ec148');pg.wait_for_timeout(900)
    pg.click('[data-gl145="f:buy"]');pg.wait_for_timeout(200)
    r=J(pg,"()=>JSON.stringify([...document.querySelectorAll('#gl145b .gr145 .gn145')].map(x=>x.textContent))")
    ok(len(r)>0 and all('🛒' in x for x in r),'골드 장부 🛒 쓴 것 = 구매만',r[:3])
    pg.click('[data-gl145="f:cut"]');pg.wait_for_timeout(200)
    r=J(pg,"()=>JSON.stringify([...document.querySelectorAll('#gl145b .gr145 .gn145')].map(x=>x.textContent))")
    ok(len(r)>0 and not any('🛒' in x for x in r) and any('감점 행동' in x for x in r),'골드 장부 ▼ 깎인 것 = 구매 아닌 감점',r[:3])
    # ---------- F5-① 카드 편집: 판정 단추 ----------
    pg.evaluate("""()=>{C.actions.push({id:'t149',name:'연락/답장',type:'good',area:'mind',cond:4,gold:0,xp:8,opts:[{id:'o1',name:'빠른 답장'},{id:'o2',name:'하루 안에'},{id:'o3',name:'회피',cond:6}]});save('config');
      location.hash='edit';render()}""");pg.wait_for_timeout(500);pg.evaluate("()=>openActionEditor('t149')");pg.wait_for_timeout(400)
    n=pg.evaluate("()=>document.querySelectorAll('#sheetC [data-tp149]').length");ok(n==3,'옵션 줄마다 판정 단추',n)
    def tap(i,k):
      for _ in range(k):
        bt=pg.locator('#sheetC [data-tp149="%d"]'%i)
        if not bt.is_visible():
          pg.click('#sheetC [data-t95="opts"]');pg.wait_for_timeout(200)
        bt.click();pg.wait_for_timeout(120)
    tap(1,2);tap(2,3)
    tp=J(pg,"()=>JSON.stringify(C.actions.find(a=>a.id==='t149').opts.map(o=>o.tp||null))");ok(tp==[None,'mid','bad'],'판정 저장 o.tp',tp)
    t=pg.evaluate("()=>[...document.querySelectorAll('#sheetC [data-tp149]')].map(b=>b.textContent).join('')");ok(t=='▲○▼','단추 글자 ▲○▼',t)
    ok(pg.evaluate("()=>mixed149(C.actions.find(a=>a.id==='t149'))"),'⇄ 기준형 카드')
    ov=pg.evaluate("()=>{const r=document.querySelector('#sheetC .vtable .vrow:not(.head)');return r.scrollWidth<=r.clientWidth+2}");ok(ov,'옵션 줄 가로 안 넘침')
    pg.click('#sheetC [data-aedone]');pg.wait_for_timeout(300)
    mc=pg.evaluate("()=>metaChips(C.actions.find(a=>a.id==='t149'))");ok('⇄' in mc,'카드 목록 칩 ⇄')
    # ---------- 점수 ----------
    E=J(pg,"""()=>{const a=C.actions.find(x=>x.id==='t149');return JSON.stringify(['o1','o2','o3'].map(v=>actEntry(a,{vid:v})).concat([actEntry(a,{})]))}""");print(E)
    ok(E[0]['type']=='good' and E[0]['xp']==8 and E[0]['cond']==4,'▲ = 좋은 점수',E[0])
    ok(E[1]['type']=='good' and E[1]['xp']==0 and E[1]['cond']==0 and E[1]['gold']==0 and E[1]['tp149']=='mid','○ = 점수 0',E[1])
    ok(E[2]['type']=='bad' and E[2]['xp']==0 and E[2]['cond']<=-6 and E[2]['tp149']=='bad','▼ = 감점(옵션 컨디션 6)',E[2])
    ok(E[3].get('vid')=='o1','옵션 안 고르면 카드 종류와 같은 첫 옵션',E[3].get('vid'))
    # ---------- 기록 창 (실제 누르는 길) ----------
    pg.evaluate("()=>{location.hash='#home';render()}");pg.wait_for_timeout(500);pg.evaluate("()=>doAction(C.actions.find(a=>a.id==='t149'))");pg.wait_for_timeout(400)
    s=J(pg,"""()=>JSON.stringify({b:[...document.querySelectorAll('#sheetC [data-sopt]')].map(b=>b.textContent.trim()),sel:(document.querySelector('#sheetC [data-sopt][aria-pressed="true"]')||{}).dataset,ok:document.querySelector('#sheetC [data-sheet="ok"]').textContent})""");print(s)
    ok(s['b'][0].startswith('▲') and s['b'][1].startswith('○') and s['b'][2].startswith('▼'),'옵션마다 ▲○▼',s['b'])
    ok('점수 0' in s['b'][1],'○ 옵션 점수 글자',s['b'][1])
    ok(s['sel'] and s['sel'].get('sopt')=='o1' and s['ok']=='✓ 했어요','미리 고른 옵션 ▲ · 단추 ✓ 했어요',s)
    pg.click('#sheetC [data-sopt="o3"]');pg.wait_for_timeout(200)
    k=J(pg,"()=>{const b=document.querySelector('#sheetC [data-sheet=\"ok\"]');return JSON.stringify({t:b.textContent,bad:b.classList.contains('bad'),p:document.getElementById('sxPrev').textContent})}")
    ok(k['t']=='▼ 기록' and k['bad'],'▼ 고르면 ▼ 기록',k)
    n0=pg.evaluate("()=>today().entries.length")
    pg.click('#sheetC [data-sheet="ok"]');pg.wait_for_timeout(500);closepops(pg)
    e=J(pg,"()=>JSON.stringify(today().entries.filter(e=>e.aid==='t149').slice(-1)[0]||null)");ok(e and e['type']=='bad' and e['tp149']=='bad' and e.get('vid')=='o3','기록 = ▼ 나쁨',e)
    pg.evaluate("()=>doAction(C.actions.find(a=>a.id==='t149'))");pg.wait_for_timeout(300)
    pg.click('#sheetC [data-sopt="o2"]');pg.wait_for_timeout(150)
    ok(pg.evaluate("()=>document.querySelector('#sheetC [data-sheet=\"ok\"]').textContent")=='○ 기록','○ 고르면 ○ 기록')
    pg.click('#sheetC [data-sheet="ok"]');pg.wait_for_timeout(500);closepops(pg)
    e=J(pg,"()=>JSON.stringify(today().entries.filter(e=>e.aid==='t149'&&e.tp149==='mid'&&e.id)[0]||null)");ok(e and e['tp149']=='mid' and e['xp']==(e.get('otb69') or 0) and e['cond']==0 and e['gold']==0,'기록 = ○ 중립 0점(✍ 그날 기록 보너스만)',e)
    # ---------- 누적 배수: 나쁨 기록만 ----------
    pg.evaluate("()=>{const a=C.actions.find(x=>x.id==='t149');for(let i=0;i<3;i++)applyEntry(today(),actEntry(a,{vid:'o1'}))}")
    m=J(pg,"()=>JSON.stringify(badMult(C.actions.find(x=>x.id==='t149'),today().date))");ok(m['same']==1,'같은 카드 나쁨 기록만 셈(좋음·중립 4번은 안 셈)',m)
    # ---------- 방치(가) ----------
    nl=J(pg,"""()=>{C.actions.push({id:'t150',name:'설거지',type:'good',area:'body',cond:3,gold:0,xp:5,opts:[{id:'p1',name:'바로 함'},{id:'p2',name:'미룸',tp:'bad',cond:4}]});
      C.watches.push({action:'t150',days:2,penalty:5});save('config');const a=C.actions.find(x=>x.id==='t150'),td=today().date,y=addDays(td,-1),old=addDays(td,-6);
      const mk=k=>DAYS[k]||(DAYS[k]=normDay(k,{entries:[]}));applyEntry(mk(old),Object.assign(actEntry(a,{vid:'p1',date:old})));applyEntry(mk(y),actEntry(a,{vid:'p2',date:y}));nlClear69();
      const f=k=>{const n=neglectList(k).find(n=>n.w.action==='t150');return n?{s:n.since,p:n.pen,b:!!n.bad149}:null};
      return JSON.stringify({y:f(y),y2:f(addDays(td,-2)),done:watchTarget('t150').done(DAYS[y])})}""");print(nl)
    ok(nl['y'] and nl['y']['s']==5 and nl['y']['p']==0 and nl['y']['b'],'▼만 적은 날 = 안 한 날(5일째) · 그날 감점 0',nl['y'])
    ok(nl['y2'] and nl['y2']['p']>0,'다른 날 방치 감점은 그대로',nl['y2'])
    ok(nl['done']==False,'▼ 기록만 있는 날은 한 날 아님')
    # ---------- 📊 ----------
    pg.evaluate("()=>{closeSheet();openInfo('act:t149')}");pg.wait_for_timeout(400)
    st=pg.evaluate("()=>{const x=document.querySelector('.ac147');return x?x.textContent:''}");ok('이번 달 판정' in st and '▼ 1' in st and '○ 1' in st,'📊 이번 달 ▲○▼',st[:200])
    cell=pg.evaluate("()=>{const x=document.querySelector('.ac147 .rc132d.td i');return x?x.textContent:''}");ok('▲' in cell and '▼' in cell and '○' in cell,'오늘 달력 칸 ▲○▼ 모양',cell)
    print('\n'.join([x for x in errs if 'favicon' not in x][:8]));errs.clear()
    b.close()
print('FAILS',len(F),F)
