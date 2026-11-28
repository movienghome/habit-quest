# v13.31: F5-③ 카드 합치기·풀기 + 짝 제안 · 🔢 다음 ▼ · 자주 당기는 충동 · 🌙 잠든 시각 ▲ 옵션·일어난 날로
from h61 import *
import json
F=[]
def ok(c,m,x=None):print(('PASS ' if c else 'FAIL ')+m+(' · '+str(x) if x is not None else ''));(None if c else F.append(m))
J=lambda pg,js:json.loads(pg.evaluate(js))
for W,H in((1400,900),(390,844)):
  print('=== ',W)
  with sync_playwright() as pw:
    b,pg=run(pw,W,H);pg.wait_for_timeout(600);closepops(pg)
    # ---------- 짝 제안 ----------
    p=J(pg,"()=>JSON.stringify({a:pairs151(C.actions.find(a=>a.id==='g22')).map(b=>b.id),b:pairs151(C.actions.find(a=>a.id==='b8')).map(b=>b.id)})");print(p)
    ok('b7' in p['a'],'충동구매 참았다 ↔ 충동구매 짝',p['a'])
    ok('kck6' in p['b'],'연락·마감 회피 ↔ 미뤄 온 연락을 했다 짝(같은 영역·같은 낱말)',p['b'])
    # ---------- 연결 준비: 습관 할 일 · 📌 · 방치 경보 · 옛 기록 ----------
    pre=J(pg,"""()=>{const td=today().date;const t=newTask({title:'연락 답장하기'});t.aid='kck6';t.rep={f:'d',i:1};t.due=midKey68();saveTask(t);
      C.pin133=['b8','g1'];C.watches=(C.watches||[]).filter(w=>w.action!=='kck6');C.watches.push({action:'kck6',days:3,penalty:5});save('config');
      const mk=k=>DAYS[k]||(DAYS[k]=normDay(k,{entries:[]}));const y=addDays(td,-1),y2=addDays(td,-2);
      applyEntry(mk(y),actEntry(C.actions.find(a=>a.id==='kck6'),{date:y}));applyEntry(mk(y2),actEntry(C.actions.find(a=>a.id==='b8'),{date:y2}));applyEntry(mk(y2),actEntry(C.actions.find(a=>a.id==='b8'),{date:y2}));
      render();return JSON.stringify({tid:t.id,idx:C.actions.findIndex(a=>a.id==='b8')})}""")
    # ---------- 실제 누르는 길: 기록하기 → 카드 빈 곳 → ⇄ 합치기 ----------
    pg.evaluate("()=>{location.hash='#log'}");pg.wait_for_timeout(700)
    row=pg.locator('#actGroups .act[data-info="act:b8"]').first
    if not row.is_visible():
      pg.evaluate("()=>{const r=document.querySelector('#actGroups .act[data-info=\"act:b8\"]');r&&r.scrollIntoView()}");pg.wait_for_timeout(200)
    pg.evaluate("()=>{document.querySelectorAll('.toast').forEach(t=>{t.classList.remove('on');t.style.pointerEvents='none'})}");pg.wait_for_timeout(200)
    bb=row.bounding_box();pg.mouse.click(bb['x']+bb['width']*0.6,bb['y']+bb['height']/2);pg.wait_for_timeout(300)
    mi=pg.locator('#m61 [data-m61]',has_text='다른 카드와 합치기')
    ok(mi.count()==1,'카드 메뉴에 ⇄ 다른 카드와 합치기')
    mi.first.click();pg.wait_for_timeout(400)
    ok(pg.locator('#sheetC .sg151 [data-mgsg151="kck6"]').count()==1,'고르기 창 맨 위 합칠까요? 짝 카드')
    ok(pg.locator('#sheetC [data-mp151="g3"]').get_attribute('disabled') is not None if pg.locator('#sheetC [data-mp151="g3"]').count() else True,'수면 자동 카드는 못 고름')
    # 찾기 → 고르기 → 미리 보기
    pg.fill('#sheetC [data-mq151]','미뤄');pg.wait_for_timeout(400)
    vis=pg.evaluate("()=>[...document.querySelectorAll('#sheetC .pk151 [data-mp151]')].map(b=>b.dataset.mp151)");ok(vis==['kck6'],'찾기',vis)
    pg.click('#sheetC .pk151 [data-mp151="kck6"]');pg.wait_for_timeout(200)
    ok('1' in pg.inner_text('#sheetC .mf151'),'1개 고름 표시')
    pg.click('#sheetC [data-mgnext151]');pg.wait_for_timeout(300)
    t=pg.inner_text('#sheetC');print(t[:600])
    ok('옮길 연결' in t and '연락 답장하기' in t and '빠른 기록' in t and '방치 경보' in t,'미리 보기: 옮길 연결 목록')
    ok('옛 기록 3개' in t,'옛 기록 수',None)
    L=pg.evaluate("()=>[...document.querySelectorAll('#sheetC .ol151 li')].map(x=>x.textContent.trim())");print(L)
    ok(len(L)==2 and L[0].startswith('▲') and L[1].startswith('▼'),'옵션 ▲ 먼저 ▼ 다음',L)
    ov=pg.evaluate("()=>{const s=document.getElementById('sheetC');return s.scrollWidth<=s.clientWidth+2}");ok(ov,'창 가로 안 넘침')
    pg.fill('#sheetC [data-mgn151]','연락/답장');pg.click('#sheetC [data-mggo151]');pg.wait_for_timeout(500)
    r=J(pg,"""()=>{const T=C.actions.find(a=>a.name==='연락/답장');const s1=C.actions.find(a=>a.id==='b8'),s2=C.actions.find(a=>a.id==='kck6');const t=Object.values(TASKS).find(x=>x.title==='연락 답장하기');
      return JSON.stringify({T:T&&{id:T.id,type:T.type,area:T.area,opts:T.opts.map(o=>[o.name,o.tp,o.cond,o.xp]),mg:T.mg151&&T.mg151.src},idx:C.actions.indexOf(T),s1:[s1.mg,!!s1.doneAt,s1.mgo],s2:[s2.mg,!!s2.doneAt],
        task:[t.aid,t.av151],pin:C.pin133,w:C.watches.filter(w=>w.action===(T&&T.id)).length,wOld:C.watches.filter(w=>w.action==='kck6').length,
        vis:!!document.querySelector('#actGroups .act[data-info="act:b8"]'),visT:!!document.querySelector('#actGroups .act[data-info="act:'+(T&&T.id)+'"]')})}""");print(r)
    T=r['T'];ok(T and T['type']=='bad' and T['area']=='life','합친 카드(종류=연 카드·영역)',T)
    ok(T and [o[1] for o in T['opts']]==['good','bad'] and T['opts'][1][2]>0,'옵션 판정·점수 옛 카드 그대로',T and T['opts'])
    ok(r['idx']==pre['idx'],'목록에서 연 카드 자리에',r['idx'])
    ok(r['s1'][0]==T['id'] and r['s1'][1] and r['s2'][1],'옛 카드 숨김(mg·doneAt)',r['s1'])
    ok(r['task'][0]==T['id'] and r['task'][1]==J(pg,"()=>JSON.stringify(C.actions.find(a=>a.id==='%s').opts[0].id)"%T['id']),'습관 할 일 → 합친 카드 ▲ 옵션',r['task'])
    ok(T['id'] in r['pin'] and 'b8' not in r['pin'],'📌 옮김',r['pin'])
    ok(r['w']==1 and r['wOld']==0,'방치 경보 옮김',r)
    ok(not r['vis'] and r['visT'],'기록하기에서 옛 카드 사라지고 합친 카드 보임',r)
    tid=T['id']
    # 습관 할 일 끝내면 그 옵션(▲)으로
    e=J(pg,"""()=>{const t=Object.values(TASKS).find(x=>x.title==='연락 답장하기');completeTask(t,{direct:true});const d=today();const e=d.entries.filter(x=>x.aid==='%s').slice(-1)[0];return JSON.stringify(e&&{vid:e.vid,type:e.type,tp:e.tp149})}"""%tid);print(e)
    T2=J(pg,"()=>JSON.stringify(C.actions.find(a=>a.id==='%s').opts.map(o=>o.id))"%tid)
    ok(e and e['vid']==T2[0] and e['type']=='good','습관 할 일 완료 → ▲ 옵션',e)
    # 기록 창으로 여는 길(옵션 미리 고름)
    pg.evaluate("()=>{const t=Object.values(TASKS).find(x=>x.title==='연락 답장하기');openDoneSheet({t,a:C.actions.find(a=>a.id===t.aid)})}");pg.wait_for_timeout(300)
    sel=pg.evaluate("()=>(document.querySelector('#sheetC [data-sopt][aria-pressed=\"true\"]')||{dataset:{}}).dataset.sopt");ok(sel==T2[0],'할 일 기록 창은 그 옵션 미리 고름',sel)
    pg.evaluate("()=>closeSheet()");pg.wait_for_timeout(200)
    # 옛 카드로 들어오는 기록 → 합친 카드
    e=J(pg,"""()=>{const seen=new Set(today().entries.map(x=>x.id));doAction(C.actions.find(a=>a.id==='b8'),{direct:true});const e=today().entries.find(x=>!seen.has(x.id));return JSON.stringify({aid:e.aid,vid:e.vid,type:e.type,mult:e.mult||1,cond:e.cond})}""");print(e)
    ok(e['aid']==tid and e['vid']==T2[1] and e['type']=='bad','옛 카드 기록 → 합친 카드 ▼',e)
    ok(e['mult']>1,'누적 배수: 옛 카드 나쁨 기록까지 셈',e)
    # 같이 세기: 📊 · 방치 · 7일
    s=J(pg,"""()=>{const T=C.actions.find(a=>a.id==='%s');const w=watchTarget(T.id),y=DAYS[addDays(today().date,-1)],y2=DAYS[addDays(today().date,-2)];
      const info=infoFor('act:'+T.id);return JSON.stringify({wy:w.done(y),wy2:w.done(y2),st:st7_103(T.id),i:/이번 달 한 횟수/.test(info.b),txt:(info.b.match(/옵션별[^<]*/)||[''])[0]})}"""%tid);print(s)
    ok(s['wy'] and not s['wy2'],'방치: 옛 ▲ 기록 = 한 날 · 옛 ▼ 기록만 = 안 한 날',s)
    ok(s['st']['w']>=5,'메뉴 7일 횟수에 옛 기록',s['st'])
    ok('미뤄 온 연락을 했다' in s['txt'] and '연락·마감 회피' in s['txt'],'📊 옵션별에 옛 기록도',s['txt'])
    # 편집 창 ⇄ 합치기·풀기 단추 → 풀기
    pg.evaluate("()=>{location.hash='#edit';ui.edit='actions'}");pg.wait_for_timeout(500);pg.evaluate("()=>openActionEditor('%s')"%tid);pg.wait_for_timeout(400)
    ok(pg.locator('#sheetC [data-mg151]').count()==1,'카드 편집 창에 ⇄ 합치기·풀기')
    pg.click('#sheetC [data-mg151]');pg.wait_for_timeout(400)
    ok(pg.locator('#sheetC [data-mgun151]').count()==1,'합친 카드 창 맨 위 풀기 단추')
    pg.click('#sheetC [data-mgun151]');pg.wait_for_timeout(500)
    r=J(pg,"""()=>{const T=C.actions.find(a=>a.id==='%s'),s1=C.actions.find(a=>a.id==='b8'),s2=C.actions.find(a=>a.id==='kck6'),t=Object.values(TASKS).find(x=>x.title==='연락 답장하기');
      return JSON.stringify({T:T?[!!T.doneAt,!!T.mg151]:null,s1:[s1.mg||null,s1.doneAt||null],s2:[s2.mg||null,s2.doneAt||null],task:[t.aid,t.av151||null],pin:C.pin133,w:C.watches.filter(w=>w.action==='kck6').length})}"""%tid);print(r)
    ok(r['T']==[True,False],'풀기: 새 기록 있는 합친 카드는 숨김',r['T'])
    ok(r['s1']==[None,None] and r['s2']==[None,None],'풀기: 옛 카드 되살림',r)
    ok(r['task']==['kck6',None] and r['pin'][0]=='b8' and r['w']==1,'풀기: 연결 되돌림',r)
    # 기록 없는 합치기 → 되돌리기 = 카드 지움 · 합친 카드 지우기 = 옛 카드 되살림
    r=J(pg,"""()=>{const n0=C.actions.length;mgSheet151('g22','b7');document.querySelector('#sheetC [data-mggo151]').click();const T=C.actions.find(a=>a.mg151&&a.mg151.src.includes('b7'));
      const mid=C.actions.length;unmerge151(T.id);const after=C.actions.length;
      mgSheet151('g22','b7');document.querySelector('#sheetC [data-mggo151]').click();const T2=C.actions.find(a=>a.mg151&&a.mg151.src.includes('b7')&&!a.doneAt);
      DEL104.ok=1;delActs([T2.id]);return JSON.stringify({n0,mid,after,gone:!C.actions.some(a=>a.id===T2.id),b7:!C.actions.find(a=>a.id==='b7').doneAt,g22:!C.actions.find(a=>a.id==='g22').doneAt})}""");print(r)
    ok(r['mid']==r['n0']+1 and r['after']==r['n0'],'기록 없는 합친 카드는 풀면 지움',r)
    ok(r['gone'] and r['b7'] and r['g22'],'합친 카드를 지우면 옛 카드 되살림',r)
    closepops(pg)
    # ---------- 🔢 다음 ▼ ----------
    r=J(pg,"""()=>{C.actions.push({id:'c151',name:'외식151',type:'good',area:'body',cond:2,gold:0,xp:3,opts:[{id:'q1',name:'외식',tp:'mid'},{id:'q2',name:'외식 많이',tp:'bad',cn:{p:'w',n:2}}]});save('config');
      const a=C.actions.find(x=>x.id==='c151');applyEntry(today(),actEntry(a,{}));location.hash='#log';render();return JSON.stringify(1)}""");pg.wait_for_timeout(500)
    t1=pg.evaluate("()=>{const n=document.querySelector('#actGroups .act[data-info=\"act:c151\"] .nx151');return n?n.textContent:''}")
    pg.evaluate("()=>{applyEntry(today(),actEntry(C.actions.find(x=>x.id==='c151'),{}));render()}");pg.wait_for_timeout(300)
    t2=pg.evaluate("()=>{const n=document.querySelector('#actGroups .act[data-info=\"act:c151\"] .nx151');return n?n.textContent:''}")
    ok(t1=='' and t2=='다음 ▼','다음 기록이 ▼면 꼬리표',[t1,t2])
    # ---------- 자주 당기는 것 ----------
    pg.evaluate("""()=>{const d=today();d.imp110=d.imp110||[];d.imp110.push({id:'v1',k:'f',n:'야식',t:'22:00',s:'p'},{id:'v2',k:'f',n:'야식',t:'23:00',s:'p'},{id:'v3',k:'b',n:'옷',t:'13:00',s:'p'});save(d.date);hold110('v1');gave110('v2');gave110('v3')}""");pg.wait_for_timeout(200)
    t=pg.evaluate("()=>infoFor('imp150').b");ok('자주 당기는 것' in t and '야식' in t and '2번' in t and '(참음 1)' in t and '옷 ' not in t.split('자주 당기는 것')[1].split('</p>')[0],'자주 당기는 것 줄(2번 이상만)',t[:300])
    # ---------- 🌙 잠든 시각 ----------
    r=J(pg,"""()=>{const a=sleepCard73();return JSON.stringify({ids:a.opts.map(o=>o.id),tp:a.opts.slice(0,2).map(o=>o.tp),morn:!!a.morn72,bt:!!a.bt151,mig:C.mig151bt})}""");print(r)
    ok(r['ids'][:2]==['e0','e1'] and r['tp']==['good','good'] and not r['morn'] and r['bt'],'늦게 잠 카드에 ▲ 23시 전·자정 전 · 아침 어제 기록 끔',r)
    def slp(bt):
      return J(pg,"""()=>{const k=gk76(),yk=addDays(k,-1),cl=sleepCard73();dayOf(k).sl102={b:'%s',w:'08:00',dr:0,ln:0};sleepSync141(k);
        return JSON.stringify({k:(dayOf(k).entries||[]).filter(e=>e.aid===cl.id).map(e=>[e.vid,e.type,e.sl141,e.cond]),y:(dayOf(yk).entries||[]).filter(e=>e.aid===cl.id).map(e=>e.vid)})}"""%bt)
    r=slp('22:30');ok(r['k'] and r['k'][0][0]=='e0' and r['k'][0][1]=='good' and r['k'][0][3]>0 and r['y']==[],'22:30 → 오늘 ▲ 23시 전',r)
    r=slp('23:40');ok(len(r['k'])==1 and r['k'][0][0]=='e1','23:40 → ▲ 자정 전(하나만)',r)
    r=slp('01:30');ok(len(r['k'])==1 and r['k'][0][0]=='s1' and r['k'][0][1]=='bad' and r['k'][0][2]=='bt151','01:30 → 오늘 ▼ 1~2시',r)
    r=slp('04:30');ok(r['k'][0][0]=='s4' and r['k'][0][3]<-20,'04:30 → ▼ 4시 넘어(가장 나쁨)',r)
    # 예전 방식(어제 'late') 기록은 다시 저장하면 오늘로 옮김
    r=J(pg,"""()=>{const k=gk76(),yk=addDays(k,-1),cl=sleepCard73();dayOf(k).entries=dayOf(k).entries.filter(e=>e.aid!==cl.id);
      withDay69(yk,()=>doAction(cl,{direct:true,vid:'s2'}));const e=dayOf(yk).entries.filter(e=>e.aid===cl.id).slice(-1)[0];e.sl141='late';
      dayOf(k).sl102={b:'02:20',w:'09:00'};sleepSync141(k);return JSON.stringify({y:dayOf(yk).entries.filter(e=>e.aid===cl.id).length,k:dayOf(k).entries.filter(e=>e.aid===cl.id).map(e=>e.vid)})}""")
    ok(r['y']==0 and r['k']==['s2'],'옛 어제 자동 기록 → 오늘로 옮김',r)
    # 이름 바꿔도 찾음 · 몸 시작 따로 기록 판정
    r=J(pg,"""()=>{const cl=sleepCard73();cl.name='잠든 시각';save('config');const f=sleepCard73();return JSON.stringify({same:f&&f.id===cl.id,sl:sep104(gk76()).sl})}""")
    ok(r['same'] and r['sl']==1,'이름을 바꿔도 카드·몸 시작 판정 그대로',r)
    # 어젯밤 창 글자
    pg.evaluate("()=>{const k=gk76(),cl=sleepCard73();dayOf(k).entries=dayOf(k).entries.filter(e=>e.aid!==cl.id);location.hash='#home';render();slSheet102()}");pg.wait_for_timeout(300)
    t=pg.inner_text('#sheetC');ok('어제로' not in t and '카드도 기록하기' in t,'어젯밤 창 문구(어제로 → 오늘)',t[-160:])
    pg.evaluate("()=>closeSheet()")
    # 아침에 직접 적어도 오늘
    r=J(pg,"""()=>{doAction(sleepCard73());const S=sheetCtx;return JSON.stringify({d:S.d69||null,td:dateKey()})}""")
    ok(r['d'] in (None,r['td']),'아침에 직접 적어도 오늘이 골라짐',r)
    pg.evaluate("()=>closeSheet()")
    b.close()
print('ERRS',[e for e in errs if 'favicon' not in e][:8])
print('FAILS',len(F),F)
