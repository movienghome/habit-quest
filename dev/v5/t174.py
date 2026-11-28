# v13.32: F5-④ 📏 양 기준 + 🛏 수면 시간 카드 하나로 · 합칠까요? 같은 뜻 낱말 · 편집 ⇄ 합칠 만한 카드 n쌍 · 🛏 이번 주 23시 전/자정 넘김
from h61 import *
import json
F=[]
def ok(c,m,x=None):print(('PASS ' if c else 'FAIL ')+m+(' · '+str(x) if x is not None else ''));(None if c else F.append(m))
J=lambda pg,js:json.loads(pg.evaluate(js))
for W,H in((1400,900),(390,844)):
  print('=== ',W)
  with sync_playwright() as pw:
    b,pg=run(pw,W,H);pg.wait_for_timeout(2200);closepops(pg)
    # ---------- ② 수면 카드 합치기(한 번짜리) ----------
    r=J(pg,"""()=>{const T=C.actions.find(a=>a.sl152);const g=C.actions.find(a=>a.id==='g3'),bd=C.actions.find(a=>a.sl141b);
      return JSON.stringify({mig:C.mig152sl,T:T&&{id:T.id,name:T.name,u:T.unit152,o:T.opts.map(o=>[o.id,o.tp,o.cond,o.q.lo,o.q.hi]),src:T.mg151.src},g:[g.mg,!!g.doneAt],b:bd&&[bd.mg,!!bd.doneAt],
        vis:[...document.querySelectorAll('#actGroups .act[data-info]')].length})}""")
    T=r['T'];print(T)
    ok(r['mig']==1 and T and T['name']=='수면 시간' and T['u']=='시간','수면 시간 카드 생김')
    ok(T and [o[1] for o in T['o']]==['bad','bad','bad','bad','mid','good','good','good'],'판정 ▼▼▼▼○▲▲▲',T and [o[1] for o in T['o']])
    ok(T and T['o'][3][2]==4 and T['o'][4][2]==0 and T['o'][6][2]==8 and T['o'][5][2]==3 and T['o'][7][2]==3,'점수(약간 나쁨 4 · 중립 0 · 좋음 8 · 약간 좋음 3)',T and [o[2] for o in T['o']])
    ok(r['g'][0]==T['id'] and r['g'][1] and r['b'] and r['b'][0]==T['id'],'옛 카드 둘 숨김',r)
    tid=T['id']
    # ---------- 🛏 어젯밤 창 → 자동 기록 ----------
    def sleep(b0,w0):
      pg.evaluate("()=>{try{closeSheet()}catch(e){}slSheet102()}");pg.wait_for_timeout(250)
      pg.fill('#sheetC [data-sl102b]',b0);pg.fill('#sheetC [data-sl102w]',w0);pg.click('#sheetC [data-sl102ok]');pg.wait_for_timeout(600)
      return J(pg,"()=>JSON.stringify(today().entries.filter(e=>e.aid==='%s'||e.aid==='g3'||(C.actions.find(a=>a.id===e.aid)||{}).sl141b).map(e=>({aid:e.aid,vid:e.vid,q:e.q152,sl:e.sl141,cond:e.cond,tp:e.tp149})))"%tid)
    e=sleep('23:30','06:40');print(e)
    ok(len(e)==1 and e[0]['aid']==tid and e[0]['vid']=='q5' and abs(e[0]['q']-7.17)<0.01 and e[0]['sl']=='q152','7시간 10분 → ▲ 7~7.5 한 줄(q152=7.17)',e)
    e=sleep('01:00','07:00');print(e)
    ok(len(e)==1 and e[0]['vid']=='q3' and e[0]['cond']<0,'6시간 → ▼ 6~6.5 약간 나쁨, 옛 줄 바뀜',e)
    e=sleep('00:30','07:00')
    ok(len(e)==1 and e[0]['vid']=='q4' and e[0]['cond']==0,'6시간 30분 → ○ 중립 0점',e)
    pg.evaluate("()=>{try{closeSheet()}catch(e){}slSheet102()}");pg.wait_for_timeout(250)
    t=pg.inner_text('#sheetC .bw152') if pg.locator('#sheetC .bw152').count() else ''
    ok('자정 넘김 1일' in t and '23시 전 0일' in t,'어젯밤 창: 이번 주 23시 전·자정 넘김',t)
    pg.evaluate("()=>closeSheet()")
    # ---------- ① 기록 창 📏 얼마나? (실제 누르는 길) ----------
    pg.evaluate("()=>{location.hash='#log'}");pg.wait_for_timeout(600)
    pg.evaluate("()=>{const r=document.querySelector('#actGroups .act[data-info=\"act:%s\"] [data-act]');r&&r.scrollIntoView({block:'center'})}"%tid);pg.wait_for_timeout(200)
    pg.click('#actGroups .act[data-info="act:%s"] [data-act]'%tid);pg.wait_for_timeout(400)
    ok(pg.locator('#sheetC .q152r [data-q152]').count()==1,'기록 창 📏 얼마나? 칸')
    sel=pg.evaluate("()=>[...document.querySelectorAll('#sheetC [data-sopt][aria-pressed=\"true\"]')].map(b=>b.dataset.sopt)");ok(sel==[],'숫자 없으면 미리 안 고름',sel)
    pg.click('#sheetC [data-sheet="ok"]');pg.wait_for_timeout(300)
    ok(pg.is_visible('#sheetC [data-q152]') and '얼마나' in pg.inner_text('#toast'),'아무것도 안 고르고 기록 → 물음')
    pg.click('#sheetC [data-q152]');pg.keyboard.type('7:45');pg.wait_for_timeout(800)
    sel=pg.evaluate("()=>[...document.querySelectorAll('#sheetC [data-sopt][aria-pressed=\"true\"]')].map(b=>b.dataset.sopt)");ok(sel==['q6'],'7:45 → ▲ 7.5~8 골라짐',sel)
    v=pg.input_value('#sheetC [data-q152]');ok(v=='7:45','적은 글자 그대로(포커스 뒤 다시 그려도)',v)
    fo=pg.evaluate("()=>document.activeElement&&document.activeElement.dataset.q152");ok(fo=='1','입력 칸 포커스 유지',fo)
    t=pg.inner_text('#sheetC');ok('📏 7:45시간라서' in t or '📏 7:45시간' in t,'이유 한 줄',None)
    ok('7.5~8' in pg.inner_text('#sheetC .q152h'),'칸 옆 → 옵션 이름')
    pg.click('#sheetC [data-sheet="ok"]');pg.wait_for_timeout(500)
    e=J(pg,"()=>JSON.stringify(today().entries.filter(e=>e.aid==='%s'&&!e.sl141).map(e=>({id:e.id,vid:e.vid,q:e.q152,cond:e.cond})))"%tid);print(e)
    ok(len(e)==1 and e[0]['vid']=='q6' and e[0]['q']==7.75 and e[0]['cond']==8,'기록: q6 · q152 7.75 · 컨디션 +8',e)
    # 고치기 창: 숫자 그대로 → 바꾸면 옵션도
    pg.evaluate("()=>openDoneSheet({edit:{date:today().date,id:'%s'}})"%e[0]['id']);pg.wait_for_timeout(300)
    ok(pg.input_value('#sheetC [data-q152]')=='7.75','고치기 창에 숫자',pg.input_value('#sheetC [data-q152]'))
    pg.fill('#sheetC [data-q152]','5.5');pg.press('#sheetC [data-q152]','Enter');pg.wait_for_timeout(300);pg.click('#sheetC [data-sheet="save"]');pg.wait_for_timeout(400)
    e2=J(pg,"()=>JSON.stringify(today().entries.filter(e=>e.id==='%s').map(e=>({vid:e.vid,q:e.q152,cond:e.cond})))"%e[0]['id']);ok(e2 and e2[0]['vid']=='q2' and e2[0]['q']==5.5 and e2[0]['cond']<0,'고치기: 5.5 → ▼ 5~6',e2)
    # 📊
    s=pg.evaluate("()=>infoFor('act:%s').b"%tid);ok('이 달 양 📏' in s and '평균' in s,'📊 이 달 양 평균·합')
    # ---------- 편집: 기준 📏 양 ----------
    pg.evaluate("()=>{location.hash='#edit'}");pg.wait_for_timeout(500)
    pg.evaluate("()=>openActionEditor('%s')"%tid);pg.wait_for_timeout(400)
    if pg.locator('#sheetC [data-ae]').count():
      pass
    lb=pg.evaluate("()=>[...document.querySelectorAll('#sheetC [data-cr150]')].map(b=>b.textContent)");print(lb)
    ok(len(lb)==8 and lb[0]=='📏~4' and lb[7]=='📏8~','옵션 표 기준 칸 📏 범위',lb)
    # 다른 카드(g22 충동구매 참았다)에 옵션 둘 만들고 📏 양 걸기
    pg.evaluate("()=>{const a=C.actions.find(x=>x.id==='g1');a.opts=[{id:'w1',name:'짧게',cond:1},{id:'w2',name:'길게',cond:4}];save('config');try{closeSheet()}catch(e){}openActionEditor('g1')}");pg.wait_for_timeout(400)
    if not pg.locator('#sheetC [data-cr150="1"]').first.is_visible():
      pg.click('#sheetC [data-t95="opts"]');pg.wait_for_timeout(200)
    pg.click('#sheetC [data-cr150="1"]');pg.wait_for_timeout(200)
    pg.click('#sheetC [data-cr150m="1:q"]');pg.wait_for_timeout(200)
    pg.fill('#sheetC [data-cr150f="1:lo"]','30');pg.press('#sheetC [data-cr150f="1:lo"]','Tab');pg.wait_for_timeout(200)
    pg.fill('#sheetC [data-cr150f="1:u"]','분');pg.press('#sheetC [data-cr150f="1:u"]','Tab');pg.wait_for_timeout(200)
    q=J(pg,"()=>JSON.stringify((a=>({q:a.opts[1].q,u:a.unit152,lb:document.querySelector('#sheetC [data-cr150=\"1\"]').textContent}))(C.actions.find(x=>x.id==='g1')))");print(q)
    ok(q['q']=={'lo':30,'hi':None} and q['u']=='분' and q['lb']=='📏30~','📏 30분 이상 저장·단추 글자',q)
    pg.click('#sheetC [data-cr150m="1:"]');pg.wait_for_timeout(200)
    ok(J(pg,"()=>JSON.stringify(!C.actions.find(x=>x.id==='g1').opts[1].q)"),'직접 고름으로 되돌리면 범위 지움')
    pg.evaluate("()=>{try{closeSheet()}catch(e){}}")
    ov=pg.evaluate("()=>document.documentElement.scrollWidth<=innerWidth+2");ok(ov,'가로 안 넘침')
    # ---------- 합칠까요? 같은 뜻 낱말 · 편집 n쌍 ----------
    pg.evaluate("()=>{const a=newAction('qrep1','빠른 답장','good','life','');C.actions.push(a);save('config');render()}")
    p=J(pg,"()=>JSON.stringify(pairs151(C.actions.find(a=>a.id==='b8')).map(b=>b.id))");ok('qrep1' in p,'연락·마감 회피 ↔ 빠른 답장 짝(같은 뜻 낱말)',p)
    pg.evaluate("()=>{ui.edit='actions';location.hash='#edit';renderEdit()}");pg.wait_for_timeout(400)
    ok(pg.locator('#editBody > .sg152').count()==1,'편집 → 행동/습관 맨 위 ⇄ 합칠 만한 카드 줄')
    n0=int(pg.inner_text('#editBody > .sg152 summary .num'));print('pairs',n0)
    ok(not pg.evaluate("()=>document.querySelector('#editBody > .sg152').open"),'기본 접힘')
    pg.click('#editBody > .sg152 summary');pg.wait_for_timeout(200)
    btn=pg.locator('#editBody .sg152 [data-mgp152*="qrep1"]')
    ok(btn.count()==1,'짝 칩에 연락·마감 회피 + 빠른 답장')
    k=btn.first.get_attribute('data-mgp152')
    pg.click('#editBody .sg152 [data-mgx152="%s"]'%('|'.join(sorted(k.split('|')))));pg.wait_for_timeout(300)
    ok(pg.locator('#editBody .sg152 [data-mgp152*="qrep1"]').count()==0 and 'b8|qrep1' in J(pg,"()=>JSON.stringify(C.sgx152)") ,'× 누르면 그 짝 사라지고 저장')
    pg.evaluate("()=>{C.sgx152=[];save('config');renderEdit()}");pg.wait_for_timeout(300)
    if not pg.evaluate("()=>document.querySelector('#editBody > .sg152').open"):pg.click('#editBody > .sg152 summary');pg.wait_for_timeout(200)
    pg.click('#editBody .sg152 [data-mgp152*="qrep1"]');pg.wait_for_timeout(400)
    ok(pg.locator('#sheetC [data-mggo151]').count()==1,'짝 누르면 합치기 미리 보기')
    pg.evaluate("()=>closeSheet()")
    # 수면 시간 카드는 합치기 대상 아님
    ok(J(pg,"()=>JSON.stringify(why151(C.actions.find(a=>a.sl152)))").startswith('🛏'),'수면 시간 카드는 다른 카드와 합치기 제외')
    # ---------- 풀기(되돌리기) → 옛 카드로 자동 기록 ----------
    r=J(pg,"""()=>{unmerge151('%s',true);sleepSync141(today().date);const g=C.actions.find(a=>a.id==='g3');const T=C.actions.find(a=>a.id==='%s');
      return JSON.stringify({g:!!g.doneAt,T:T&&!!T.doneAt,e:today().entries.filter(e=>e.sl141).map(e=>[e.aid,e.sl141,e.vid])})}"""%(tid,tid));print(r)
    ok(not r['g'] and (r['T'] is None or r['T']) and not any(x[1]=='q152' for x in r['e']) and any(x[0]=='g3' and x[1]=='h7' for x in r['e']),'풀면 옛 카드로 돌아가고 자동 기록도 옛 카드로',r)
    print('errs',[x for x in errs if 'favicon' not in x][:5])
    b.close()
print('FAILS',len(F),F)
