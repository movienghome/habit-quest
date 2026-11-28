# v13.33: 같은 이름 카드 같이 합치기 · 수면 카드 두 장 바로잡기 · 모음 목록 겹침 · 술·걷기 📏 · 최근 숫자 칩 · 이번 주 평균 · X2-③ 올리려면
from h61 import *
import json
F=[]
def ok(c,m,x=None):print(('PASS ' if c else 'FAIL ')+m+(' · '+str(x) if x is not None else ''));(None if c else F.append(m))
J=lambda pg,js:json.loads(pg.evaluate(js))
for W,H in((1400,900),(390,844)):
  print('=== ',W)
  with sync_playwright() as pw:
    b,pg=run(pw,W,H);pg.wait_for_timeout(600);closepops(pg)
    pg.evaluate("()=>{const t=document.getElementById('toast');t&&t.classList.remove('on')}")
    # ---------- ① 같은 이름 카드 셋 ----------
    pg.evaluate("""()=>{const ar=C.actions.find(a=>a.id==='b8').area;['gq1','gq2','gq3'].forEach((id,i)=>C.actions.push({id,name:'빠른 답장',type:'good',area:i?'mind':ar,cond:3+i,gold:1,xp:4,marble:''}));
      const td=today().date,mk=k=>DAYS[k]||(DAYS[k]=normDay(k,{entries:[]}));const y=addDays(td,-2);applyEntry(mk(y),actEntry(C.actions.find(a=>a.id==='gq2'),{date:y}));save('config');render()}""")
    pg.evaluate("()=>mgSheet151('b8','gq1')");pg.wait_for_timeout(400)
    t=pg.inner_text('#sheetC');print(t[:700])
    ok('같은 이름 카드 2장도 같이' in t,'미리 보기: 같은 이름 카드 2장도 같이')
    ok('같은 이름 3장 → 한 옵션' in t,'옵션 줄: 같은 이름 3장 → 한 옵션')
    L=pg.evaluate("()=>[...document.querySelectorAll('#sheetC .ol151 li')].length");ok(L==2,'옵션 2개(빠른 답장 하나 + 회피)',L)
    pg.click('#sheetC [data-mggo151]');pg.wait_for_timeout(500)
    r=J(pg,"""()=>{const T=C.actions.find(a=>a.mg151&&a.mg151.src.includes('b8'));return JSON.stringify({T:T&&T.id,opts:T&&T.opts.map(o=>o.name),src:T&&T.mg151.src,
      hid:['gq1','gq2','gq3'].map(id=>{const a=C.actions.find(x=>x.id===id);return [a.mg,!!a.doneAt,a.mgo&&a.mgo['']]}),ids:T?[...mgIds151(T)]:[],
      vis:['gq1','gq2','gq3','b8'].filter(id=>document.querySelector('#actGroups .act[data-info="act:'+id+'"]'))})}""");print(r)
    T=r['T'];oid=J(pg,"()=>JSON.stringify(C.actions.find(a=>a.id==='%s').opts.find(o=>o.tp==='good').id)"%T)
    ok(r['opts'] and len(r['opts'])==2,'합친 카드 옵션 2개',r['opts'])
    ok(all(h[0]==T and h[1] and h[2]==oid for h in r['hid']),'빠른 답장 셋 다 숨김·같은 ▲ 옵션으로',r['hid'])
    ok(set(['gq1','gq2','gq3','b8'])<=set(r['ids']),'통계에 넷 다 같이 셈',r['ids'])
    # 옛 카드로 들어오는 기록 → 합친 카드 ▲ 옵션
    e=J(pg,"()=>{const e=actEntry(C.actions.find(a=>a.id==='gq3'),{});return JSON.stringify([e.aid,e.vid])}");ok(e==[T,oid],'옛 같은 이름 카드 기록 → 합친 카드',e)
    # ---------- ① 남은 같은 이름 카드(더 합치기) ----------
    pg.evaluate("""()=>{C.actions.push({id:'gq4',name:'빠른 답장',type:'good',area:'mind',cond:2,gold:0,xp:2,marble:''});save('config');render()}""")
    pg.evaluate("()=>mgSheet151('%s')"%T);pg.wait_for_timeout(400)
    ok(pg.locator('#sheetC .sg151 [data-mgsg151="gq4"]').count()==1,'합친 카드 창 합칠까요?에 남은 같은 이름 카드')
    pg.click('#sheetC .sg151 [data-mgsg151="gq4"]');pg.wait_for_timeout(300)
    pg.click('#sheetC [data-mggo151]');pg.wait_for_timeout(500)
    r=J(pg,"()=>{const T=C.actions.find(a=>a.id==='%s'),g=C.actions.find(a=>a.id==='gq4');return JSON.stringify([T.opts.length,g.mg,g.mgo['']])}"%T)
    ok(r==[2,T,oid],'더 합치기: 새 옵션 없이 같은 옵션으로',r)
    pg.evaluate("()=>{const t=document.getElementById('toast');t&&t.classList.remove('on')}")
    # 편집 → 합칠 만한 카드에도 뜸
    pg.evaluate("""()=>{C.actions.push({id:'gq5',name:'빠른 답장',type:'good',area:'mind',cond:2,gold:0,xp:2,marble:''});save('config');ui.edit='actions';location.hash='#edit';renderEdit()}""");pg.wait_for_timeout(400)
    ok(pg.locator('#editBody .sg152 [data-mgp152*="gq5"]').count()>=1,'편집 ⇄ 합칠 만한 카드에 합친 카드 + 남은 같은 이름')
    # ---------- ③ 모음 목록 겹침 ----------
    r=J(pg,"()=>{const c=normConfig(Object.assign(clone(C),{pin133:['g1','b4','g1','g2','b4']}));return JSON.stringify(c.pin133)}");ok(r==['g1','b4','g2'],'📌 목록 겹침 지움(순서 유지)',r)
    # ---------- ② 수면 시간 두 장 ----------
    pg.evaluate("""()=>{const q=sleepQ152();const td=gk76();const d=clone(q);d.id='zzdup1';delete d.mg151;C.actions.push(d);if(!Array.isArray(C.pin133))C.pin133=[];C.pin133.push(q.id,'zzdup1');
      const day=DAYS[td]||(DAYS[td]=normDay(td,{entries:[]}));applyEntry(day,Object.assign(actEntry(d,{vid:'q6'}),{sl141:'q152'}));save('config');render()}""");pg.wait_for_timeout(900)
    r=J(pg,"()=>{const v=C.actions.filter(a=>a.sl152&&!a.doneAt&&!a.mg).map(a=>a.id);const td=gk76();return JSON.stringify({v,dup:!!C.actions.find(a=>a.id==='zzdup1'),e:(DAYS[td].entries||[]).filter(e=>e.aid==='zzdup1').length,pin:C.pin133.filter(x=>x==='zzdup1').length})}");print(r)
    ok(len(r['v'])==1 and not r['dup'] and r['e']==0 and r['pin']==0,'수면 시간 두 장 → 한 장(자동 기록·📌 정리)',r)
    # ---------- ④ 술·걷기 📏 ----------
    pg.evaluate("""()=>{const d=C.actions.find(a=>a.id==='b1');d.name='술';d.opts=[{id:'v1',name:'사교용 한 잔',cond:5,gold:10},{id:'v2',name:'혼술',cond:15,gold:30},{id:'v3',name:'과음',cond:30,gold:50},{id:'v4',name:'사교용 본격',cond:20,gold:20}];
      const w=C.actions.find(a=>a.id==='g2');delete w.opts;delete C.mig153q;save('config');render()}""");pg.wait_for_timeout(700)
    r=J(pg,"()=>{const d=C.actions.find(a=>a.id==='b1'),w=C.actions.find(a=>a.id==='g2');return JSON.stringify({du:d.unit152,dq:d.opts.map(o=>[o.name,o.q]),wu:w.unit152,wq:(w.opts||[]).map(o=>[o.id,o.tp,o.cond,o.q]),mig:C.mig153q})}");print(r)
    ok(r['du']=='잔' and r['dq'][0][1]=={'lo':None,'hi':2} and r['dq'][1][1] is None and r['dq'][2][1]=={'lo':5,'hi':None} and r['dq'][3][1]=={'lo':2,'hi':5},'술: 잔 · 한 잔<2 · 본격 2~5 · 과음 5~ · 혼술은 직접',r['dq'])
    ok(r['wu']=='분' and [x[0] for x in r['wq']]==['w0','w1','w2','w3'] and r['wq'][0][1]=='mid' and r['wq'][2][2]==5,'걷기: 분 · 10분 미만 ○ · 10~30 · 30~60(원래 점수) · 1시간 이상',r['wq'])
    pg.evaluate("()=>{const t=document.getElementById('toast');t&&t.classList.remove('on')}")
    # 기록 창: 1:20 → 80분 → w3 · 최근 숫자 칩
    pg.evaluate("()=>{location.hash='#log'}");pg.wait_for_timeout(500)
    pg.evaluate("()=>openDoneSheet({a:C.actions.find(a=>a.id==='g2')})");pg.wait_for_timeout(300)
    pg.click('#sheetC [data-q152]');pg.keyboard.type('1:20');pg.wait_for_timeout(800)
    sel=pg.evaluate("()=>[...document.querySelectorAll('#sheetC [data-sopt][aria-pressed=\"true\"]')].map(b=>b.dataset.sopt)");ok(sel==['w3'],'1:20 → 80분 → 1시간 이상',sel)
    pg.click('#sheetC [data-sheet="ok"]');pg.wait_for_timeout(500)
    q=J(pg,"()=>{const e=today().entries.filter(e=>e.aid==='g2').slice(-1)[0];return JSON.stringify(e&&[e.vid,e.q152])}");ok(q==['w3',80],'기록 80분',q)
    pg.evaluate("()=>{const e=actEntry(C.actions.find(a=>a.id==='g2'),{q152:25});applyEntry(today(),e);save('day')}")
    pg.evaluate("()=>openDoneSheet({a:C.actions.find(a=>a.id==='g2')})");pg.wait_for_timeout(300)
    ch=pg.evaluate("()=>[...document.querySelectorAll('#sheetC [data-rq153]')].map(b=>b.dataset.rq153)");ok(sorted(ch[:2])==['25','80'],'최근 숫자 칩',ch)
    pg.click('#sheetC [data-rq153="25"]');pg.wait_for_timeout(400)
    sel=pg.evaluate("()=>[...document.querySelectorAll('#sheetC [data-sopt][aria-pressed=\"true\"]')].map(b=>b.dataset.sopt)");ok(sel==['w1'],'칩 누르면 채워지고 10~30 골라짐',sel)
    ov=pg.evaluate("()=>{const s=document.getElementById('sheetC');return s.scrollWidth<=s.clientWidth+2}");ok(ov,'기록 창 가로 안 넘침')
    pg.evaluate("()=>closeSheet()")
    # ---------- 🛏 이번 주 평균 ----------
    pg.evaluate("()=>{const k=gk76();const d=DAYS[k]||(DAYS[k]=normDay(k,{entries:[]}));d.sl102={b:'23:30',w:'07:00'};slSheet102()}");pg.wait_for_timeout(300)
    t=pg.inner_text('#sheetC .bw152') if pg.locator('#sheetC .bw152').count() else '';print(t);ok('평균' in t and '시간' in t,'어젯밤 창 이번 주 평균 잔 시간',t)
    pg.evaluate("()=>closeSheet()")
    # ---------- X2-③ 올리려면 ----------
    pg.evaluate("()=>{location.hash='#home';WY146.open=true;render()}");pg.wait_for_timeout(700)
    t=pg.inner_text('.wy146') if pg.locator('.wy146').count() else '';
    ok('올리려면' in t,'홈 왜 이 상태? 안 ⬆ 올리려면')
    n=pg.locator('.wy146 [data-up153]').count();ok(1<=n<=3,'추천 3개 이하',n)
    r=J(pg,"()=>{const D=data146(curDay());return JSON.stringify(D.up.L.slice(0,3).map(x=>[x.a.name,x.v,akOf101(x.a.area),x.cap]))}");print(r)
    ok(all(x[2]=='c' for x in r),'HP에 들어가는 영역만',r)
    dn=J(pg,"()=>{const D=data146(curDay());const s=new Set(today().entries.map(e=>e.aid));return JSON.stringify(D.up.L.filter(x=>s.has(x.a.id)).length)}");ok(dn==0,'오늘 한 카드는 빠짐')
    pg.click('.wy146 [data-q5153]');pg.wait_for_timeout(300)
    ok(pg.locator('.wy146 [data-q5153][aria-pressed="true"]').count()==1,'⏱ 5분 거르기 켜짐')
    pg.click('.wy146 [data-q5153]');pg.wait_for_timeout(300)
    nm=pg.locator('.wy146 [data-up153]').first.get_attribute('data-up153')
    pg.locator('.wy146 [data-up153]').first.click();pg.wait_for_timeout(500)
    ok(pg.is_visible('#sheetC') and pg.locator('#sheetC [data-sheet="ok"]').count()==1,'누르면 기록 창')
    pg.evaluate("()=>closeSheet()")
    s=pg.evaluate("()=>infoFor('hp').b");ok('올리려면' in s,'HP 설명 창에도 올리려면')
    ov=pg.evaluate("()=>document.documentElement.scrollWidth<=innerWidth+2");ok(ov,'홈 가로 안 넘침')
    E=[x for x in errs if 'PAGEERR' in x];ok(not E,'페이지 오류 없음',E[:3])
    if W==390:pg.screenshot(path='/tmp/t175_home.png',full_page=False)
    b.close()
print('FAILS',len(F),F)
