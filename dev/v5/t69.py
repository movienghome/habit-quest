# v6.9 시험: 저장(배열 속 배열) · 다시 열어도 그대로 · 두 기기 합치기 · 지난 날 기록 · 그날 기록 보너스 · 한글 조합
# 두 기기: Python이 '서버'(SRV dict). 각 페이지의 가짜 db는 쓰기를 서버로 보내고(set/merge=CAS), pump()가 서버 변화를 페이지 기기 사본에 넣어요.
import json,os,sys,datetime
os.chdir('/home/claude/habit-quest/dev/v5')
exec(open('h61.py').read())
SP=os.environ.get('SP','/tmp/claude-0/sp/')
J=lambda pg,x:pg.evaluate(x)
SRV={}
OUT=[]
def ok(name,cond,extra=''):
    OUT.append(('PASS' if cond else 'FAIL')+' '+name+(' · '+str(extra) if extra!='' else ''));print(OUT[-1])
EXT=r"""
(function(){const api=window.__mockApi,store=window.__store,enc0=v=>v;
  const encF=window.__encT=(v=>{if(Array.isArray(v))return v.map(x=>Array.isArray(x)?{_na:encF(x)}:encF(x));if(v&&typeof v==='object'){const o={};for(const k in v){const x=v[k];if(x===undefined)continue;o[k===''?'_e0_':k]=encF(x)}return o}return v});
  const decF=(v=>{if(Array.isArray(v))return v.map(decF);if(v&&typeof v==='object'){const ks=Object.keys(v);if(ks.length===1&&ks[0]==='_na')return decF(v._na);const o={};for(const k of ks)o[k==='_e0_'?'':k]=decF(v[k]);return o}return v});
  const od=api.db.doc;
  api.db.doc=p=>{const d=od(p),path='u/'+p;
    d.set=async x=>{const e=encF(JSON.parse(JSON.stringify(x)));store.set(path,e);window.__srvSet(path,JSON.stringify(e));};
    d.delete=async()=>{store.delete(path);window.__srvSet(path,'null')};
    d.merge=async fn=>{for(let i=0;i<5;i++){const raw=await window.__srvGet(path);const cur=raw==='null'?null:decF(JSON.parse(raw));const next=fn(cur);if(next===undefined)return{skip:1,cur};const e=encF(JSON.parse(JSON.stringify(next)));
        const okk=await window.__srvCas(path,raw,JSON.stringify(e));if(okk){store.set(path,e);return{data:next}}}throw Object.assign(new Error('cas'),{code:'aborted'})};
    return d};
})();
"""
def dev(pw,name,W=1300,H=900,at=None,ls=None):
    b=pw.chromium.launch();ctx=b.new_context(viewport={'width':W,'height':H},timezone_id='Asia/Seoul')
    def sset(src,path,val):
        if val=='null':SRV.pop(path,None)
        else:SRV[path]=json.loads(val)
    def sget(src,path):return json.dumps(SRV.get(path))
    def scas(src,path,old,new):
        if json.dumps(SRV.get(path))!=json.dumps(json.loads(old)):return False
        SRV[path]=json.loads(new);return True
    ctx.expose_binding('__srvSet',sset);ctx.expose_binding('__srvGet',sget);ctx.expose_binding('__srvCas',scas)
    init=MOCK+"\n"+"window.__seedAll="+json.dumps(SRV)+";for(const k in window.__seedAll)window.__store.set(k,window.__seedAll[k]);\n"+EXT+"\ntry{localStorage.clear()}catch(e){}\n"+(("try{const o="+json.dumps(ls)+";for(const k in o)localStorage.setItem(k,o[k])}catch(e){}\n") if ls else '')
    ctx.add_init_script(init)
    ctx.route('**/backend.js',lambda r:r.fulfill(body="window.__hqResolve(window.__mockApi)",content_type='application/javascript'))
    ctx.route('**/config.js',lambda r:r.fulfill(body="",content_type='application/javascript'))
    ctx.route('**/sw.js',lambda r:r.fulfill(body="",content_type='application/javascript'))
    ctx.route('**/gstatic.com/**',lambda r:r.abort())
    pg=ctx.new_page();pg.on('pageerror',lambda e:errs.append(name+' PAGEERR '+str(e)+' '+(e.stack or '')[:400]));pg.on('console',lambda m:errs.append(name+' CON '+m.text) if m.type=='error' and 'TUNNEL' not in m.text else None)
    if at:pg.clock.install(time=at)
    pg.goto(URL);pg.wait_for_timeout(1800)
    closepops(pg)
    return b,pg
def pump(*pgs):
    for pg in pgs:
        pg.evaluate("(s)=>{const st=window.__store;const want=new Map(Object.entries(s));for(const k of [...st.keys()])if(!want.has(k))st.delete(k);for(const [k,v] of want){if(JSON.stringify(st.get(k))!==JSON.stringify(v))window.__remote(k,v)}}",SRV)
    for pg in pgs:pg.wait_for_timeout(250)
def settle(*pgs,ms=1200):
    for pg in pgs:pg.wait_for_timeout(ms)

with sync_playwright() as pw:
    # ---------- A. 처음 열기 → 설정이 서버에 저장되나 / 다시 열면 그대로 ----------
    b,pg=dev(pw,'A');settle(pg,ms=1500)
    ok('config saved to server','u/game/config' in SRV and SRV['u/game/config'].get('mig59')==1)
    ok('nested arrays encoded',isinstance(SRV.get('u/game/config',{}).get('ui',{}).get('home',[None])[0],dict))
    t0=J(pg,"document.getElementById('toast').innerText")
    # 루틴 단계 지우기 + 카드 지우기
    info=J(pg,"""(()=>{const r=C.routines[0];sync62(r);const n0=(r.steps||[]).length;const s=r.steps.find(x=>/운동/.test(stName61(x)))||r.steps[2];const name=stName61(s);
      unstep62(r,r.steps.indexOf(s),1);save('config');const a=C.actions.find(x=>x.type==='good');const aid=a.id;C.actions=C.actions.filter(x=>x!==a);save('config');
      return {n0,name,aid,tid:s.tid}})()""")
    settle(pg,ms=1500)
    after1=J(pg,"(()=>{const r=C.routines[0];return (r.steps||[]).length})()")
    b.close()
    b,pg=dev(pw,'A2');settle(pg,ms=1500)
    t1=J(pg,"document.getElementById('toast').innerText")
    ok('no 돌아보기 toast on reopen','돌아보기' not in t1,t1)
    r2=J(pg,f"(()=>{{const r=C.routines[0];return {{n:(r.steps||[]).length,has:(r.steps||[]).some(s=>s.tid==={json.dumps(info['tid'])}),act:C.actions.some(a=>a.id==={json.dumps(info['aid'])}),tfound:!!TASKS[{json.dumps(info['tid'])}]}}}})()")
    ok('deleted routine step stays deleted',not r2['has'] and r2['n']==after1,(info,after1,r2))
    ok('deleted card stays deleted',not r2['act'])
    ok('mig flags persisted',all(SRV['u/game/config'].get(k) for k in ['mig57','mig62']),[k for k in ['mig57','mig62','mig67ds'] if not SRV['u/game/config'].get(k)])
    ntasks1=len([k for k in SRV if k.startswith('u/tasks/')])
    b.close()
    b,pg=dev(pw,'A3');settle(pg,ms=1500);ntasks2=len([k for k in SRV if k.startswith('u/tasks/')]);b.close()
    ok('no task multiplication on reopen',ntasks1==ntasks2,(ntasks1,ntasks2))

    # ---------- B. 두 기기 동시에 ----------
    ba,A=dev(pw,'devA');bb,B=dev(pw,'devB');pump(A,B);settle(A,B,ms=600)
    x0=J(A,"P.xp")
    # A: 카드 하나 지우고 기록 하나 · B: 카드 하나 추가하고 기록 하나 (서로 아직 모름)
    J(A,"(()=>{const a=C.actions.filter(x=>x.type==='good')[1];window._del=a.id;C.actions=C.actions.filter(x=>x!==a);save('config');doAction(C.actions.find(x=>x.type==='good'&&!x.opts&&!x.money),{direct:1})})()")
    J(B,"(()=>{C.actions.push(newAction('zz69','시험 카드 B','good',C.areas[0].id));save('config');doAction(C.actions.find(x=>x.type==='good'&&!x.opts&&!x.money&&x.id!=='zz69'),{direct:1})})()")
    closepops(A);closepops(B);print('pre',J(A,"[P.xp,today().entries.map(e=>e.kind+':'+e.xp)]"),J(B,"[P.xp,today().entries.map(e=>e.kind+':'+e.xp)]"));settle(A,B,ms=1500);print('srv',SRV.get('u/game/progress'),[ (e['kind'],e.get('xp')) for e in SRV.get('u/days/'+J(A,'dateKey()'),{}).get('entries',[])]);pump(A,B);settle(A,B,ms=800);pump(A,B);settle(A,B,ms=800)
    srvC=SRV['u/game/config'];ids=[a['id'] for a in srvC['actions']]
    delid=J(A,"window._del")
    ok('server: A delete + B add both kept',('zz69' in ids) and (delid not in ids),(delid in ids,'zz69' in ids))
    ok('A sees B card',J(A,"C.actions.some(a=>a.id==='zz69')"))
    ok('B sees A delete',not J(B,f"C.actions.some(a=>a.id==='{delid}')"))
    td=J(A,"dateKey()");ents=SRV.get('u/days/'+td,{}).get('entries',[])
    ok('both entries on same day kept',len([e for e in ents if e.get('kind')=='act'])>=2,len(ents))
    xa,xb,xs=J(A,"P.xp"),J(B,"P.xp"),SRV['u/game/progress']['xp']
    ok('progress xp added from both',xs==xa==xb and xs>x0,(x0,xa,xb,xs))
    # 할 일: A가 지우고 B가 옛 것을 고침 → 되살아나면 안 됨
    J(A,"(()=>{const t=newTask({title:'지울 시험',due:dateKey()});saveTask(t);window._t=t.id})()");settle(A,ms=900);pump(A,B);settle(A,B,ms=600)
    tid=J(A,"window._t");ok('B got task',J(B,f"!!TASKS['{tid}']"))
    J(A,f"deleteTask('{tid}')");settle(A,ms=500)
    J(B,f"(()=>{{const t=TASKS['{tid}'];t.title='B가 고침';saveTask(t)}})()");settle(B,ms=1200);pump(A,B);settle(A,B,ms=600)
    ok('deleted task not resurrected','u/tasks/'+tid not in SRV and not J(B,f"!!TASKS['{tid}']"))
    # 렌더 횟수: 저장 하나에 몇 번?
    J(A,"window.__rc=0;{const f=render;render=function(){window.__rc++;return f.apply(this,arguments)}}")
    J(A,"C.ui.tfold=C.ui.tfold||{};C.ui.tfold.zz=1;save('config')");settle(A,ms=1500)
    ok('one save does not cause extra renders',J(A,"window.__rc")<=1,J(A,"window.__rc"))
    ok('no error bar',not J(A,"!!document.getElementById('err69')") and not J(B,"!!document.getElementById('err69')"))
    ba.close();bb.close()

    # ---------- C. 지난 날 기록 · 그날 기록 보너스 ----------
    b,pg=dev(pw,'D');settle(pg,ms=800)
    a=J(pg,"(()=>{const a=C.actions.find(x=>x.type==='bad'&&/술/.test(x.name))||C.actions.find(x=>x.type==='bad');window._a=a.id;return a.name})()")
    J(pg,"openDoneSheet({a:C.actions.find(x=>x.id===window._a)})");pg.wait_for_timeout(300)
    ok('date row in done sheet',J(pg,"!!document.querySelector('#sheetC .d69')"))
    pg.screenshot(path=SP+'t69_sheet.png')
    pg.click('#sheetC [data-d69="'+J(pg,"addDays(dateKey(),-1)")+'"]');pg.wait_for_timeout(250)
    ok('yesterday chip pressed',J(pg,"document.querySelector('#sheetC [data-d69=\"'+addDays(dateKey(),-1)+'\"]').getAttribute('aria-pressed')")=='true')
    pg.click('#sheetC [data-sheet="ok"]');pg.wait_for_timeout(500);closepops(pg)
    y=J(pg,"addDays(dateKey(),-1)")
    ey=J(pg,f"(DAYS['{y}']&&DAYS['{y}'].entries||[]).filter(e=>e.aid===window._a).map(e=>[e.late,e.otb69||0])")
    ok('bad action recorded on yesterday, late, no bonus',len(ey)==1 and ey[0][0] and ey[0][1]==0,ey)
    ok('not on today',J(pg,"today().entries.filter(e=>e.aid===window._a).length")==0)
    # 오늘 기록 → 보너스
    x0=J(pg,"P.xp");J(pg,"doAction(C.actions.find(x=>x.type==='good'&&!x.opts&&!x.money),{direct:1})");closepops(pg)
    e=J(pg,"today().entries[0]");ok('today bonus',e.get('otb69')==2,(e.get('otb69'),e.get('xp')))
    for i in range(14):J(pg,"doAction(C.actions.find(x=>x.type==='good'&&!x.opts&&!x.money),{direct:1})");closepops(pg)
    ok('daily cap 20',J(pg,"today().entries.reduce((s,x)=>s+(x.otb69||0),0)")==20)
    # 스낵바 📅 → 어제로 옮기기
    J(pg,"doAction(C.actions.find(x=>x.type==='good'&&!x.opts&&!x.money),{direct:1})");closepops(pg)
    ok('snack has date button',J(pg,"!!document.querySelector('#snack [data-snack=\"d69\"]')"))
    eid=J(pg,"today().entries[0].id");x1=J(pg,"P.xp")
    J(pg,"(()=>{today().entries[0].otb69=2;today().entries[0].xp+=2;P.xp+=2})()")  # 상한이라 0일 수 있어서 시험용으로 붙임
    x1=J(pg,"P.xp")
    pg.click('#snack [data-snack="d69"]');pg.wait_for_timeout(300)
    ok('move sheet opens',J(pg,"!!document.querySelector('#sheetC [data-mv69]')"))
    pg.screenshot(path=SP+'t69_move.png')
    pg.click('#sheetC [data-mv69="'+y+'"]');pg.wait_for_timeout(500);closepops(pg)
    ok('moved to yesterday',J(pg,f"DAYS['{y}'].entries.some(e=>e.id==='{eid}'&&e.late&&!e.otb69)") and not J(pg,f"today().entries.some(e=>e.id==='{eid}')"))
    ok('bonus removed from xp',J(pg,"P.xp")==x1-2,(x1,J(pg,"P.xp")))
    # 기록하기 화면 📅 다른 날
    J(pg,"location.hash='log'");pg.wait_for_timeout(500)
    ok('log view date picker',J(pg,"!!document.getElementById('off69')"))
    k5=J(pg,"addDays(dateKey(),-5)")
    J(pg,f"(()=>{{const i=document.getElementById('off69');i.value='{k5}';i.dispatchEvent(new Event('change',{{bubbles:true}}))}})()");pg.wait_for_timeout(400)
    ok('ui.off=5',J(pg,"ui.off")==5,J(pg,"$('lateBar').innerText"))
    pg.screenshot(path=SP+'t69_log5.png')
    J(pg,"$('wInput').value='72.4';$('wForm').requestSubmit()");pg.wait_for_timeout(400);closepops(pg)
    ok('weight on 5 days ago',J(pg,f"DAYS['{k5}'].weight")==72.4)
    # 할 일 완료 → 날짜 바꾸기 (doneAt도 옮김)
    J(pg,"location.hash='tasks'");pg.wait_for_timeout(400)
    J(pg,"(()=>{const t=newTask({title:'어제 끝낸 일',due:dateKey()});saveTask(t);window._t2=t.id;completeTask(t)})()");pg.wait_for_timeout(300);closepops(pg)
    J(pg,f"moveEntry69(dateKey(),today().entries.find(e=>e.tid===window._t2).id,'{y}')");pg.wait_for_timeout(300)
    ok('task doneAt moved',J(pg,"TASKS[window._t2].doneAt")==y,J(pg,"TASKS[window._t2].doneAt"))
    # 루틴 체크: 어제
    r=J(pg,"(()=>{const r=C.routines[0];rtDone64(r);return r.id})()");pg.wait_for_timeout(300)
    ok('routine sheet date row',J(pg,"!!document.querySelector('#sheetC [data-rd69]')"))
    pg.click('#sheetC [data-rd69="'+y+'"]');pg.wait_for_timeout(300)
    pg.screenshot(path=SP+'t69_rt.png')
    J(pg,"document.querySelectorAll('#sheetC .w64').forEach(i=>i.value='71.9')")
    pg.click('#sheetC [data-d64go]');pg.wait_for_timeout(600);closepops(pg)
    ok('routine full on yesterday',J(pg,f"DAYS['{y}'].entries.some(e=>e.kind==='routine'&&e.full)"),J(pg,f"DAYS['{y}'].entries.map(e=>e.kind+':'+e.name).slice(0,12)"))
    ok('routine not full today',not J(pg,"today().entries.some(e=>e.kind==='routine'&&e.full)"))
    # ---------- D. 한글 조합: 고르기 창 입력칸이 바뀌지 않아요 ----------
    J(pg,"openPicker61({title:'시험',tabs:[{k:'a',label:'카드',items:C.actions.map(a=>({id:a.id,label:a.name}))}],onPick:()=>{}})");pg.wait_for_timeout(200)
    J(pg,"window._inp=document.getElementById('pk61q');window._inp.focus()")
    J(pg,"""(()=>{const i=window._inp;i.dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true}));i.value='ㄷ';i.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:true,data:'ㄷ'}));i.value='도';i.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:true,data:'도'}))})()""")
    pg.wait_for_timeout(100)
    ok('picker input kept while composing',J(pg,"document.getElementById('pk61q')===window._inp"))
    J(pg,"(()=>{const i=window._inp;i.value='독';i.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:true}));i.dispatchEvent(new CompositionEvent('compositionend',{bubbles:true,data:'독'}))})()");pg.wait_for_timeout(200)
    ok('picker filtered',J(pg,"PK61.q")=='독' and J(pg,"document.getElementById('pk61q')===window._inp"))
    J(pg,"closePicker61()")
    # 편집 찾기칸(aeQ): 조합 중 다시 그리지 않음
    J(pg,"location.hash='edit'");pg.wait_for_timeout(400)
    has=J(pg,"!!document.getElementById('aeQ')")
    if has:
        J(pg,"window._q=document.getElementById('aeQ');window._q.focus();window._q.value='도';window._q.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:true}))");pg.wait_for_timeout(400)
        ok('aeQ kept while composing',J(pg,"document.getElementById('aeQ')===window._q"))
    b.close()
    # ---------- F. 처음 고친 버전: 서버엔 옛 설정(v69 없음) + 기기 사본엔 지난번 고친 설정 → 기기 사본으로 시작 ----------
    oldcfg=json.loads(json.dumps(SRV['u/game/config']));oldcfg.pop('v69',None)
    snapC=json.loads(json.dumps(oldcfg));snapC['avatar']=dict(snapC.get('avatar',{}),name='사본이름69')
    def decj(v):
        if isinstance(v,list):return [decj(x) for x in v]
        if isinstance(v,dict):
            if list(v.keys())==['_na']:return decj(v['_na'])
            return {k:decj(x) for k,x in v.items()}
        return v
    SRV['u/game/config']=oldcfg
    b,pg=dev(pw,'F',ls={'hq-snap-b':json.dumps({'C':decj(snapC),'P':{},'D':{},'T':{},'at':0})});settle(pg,ms=1800)
    ok('first fixed run uses device snapshot',J(pg,"C.avatar.name")=='사본이름69' and SRV['u/game/config'].get('v69')==1 and SRV['u/game/config']['avatar']['name']=='사본이름69',J(pg,"C.avatar.name"))
    b.close()
    b,pg=dev(pw,'F2',ls={'hq-snap-b':json.dumps({'C':dict(decj(snapC),avatar={'name':'다른기기'}),'P':{},'D':{},'T':{},'at':0})});settle(pg,ms=1500)
    ok('second device uses server (already v69)',J(pg,"C.avatar.name")=='사본이름69',J(pg,"C.avatar.name"))
    b.close()
    # ---------- E. 첫 화면에서 루틴 머리 접힘 (처음 그릴 때부터) ----------
    b,pg=dev(pw,'E')
    J(pg,"location.hash='tasks'");pg.wait_for_timeout(600)
    b.close()
print('\n'.join(OUT))
print('FAILS',sum(1 for o in OUT if o.startswith('FAIL')))
print('\n'.join(e[:400] for e in errs[:15]))
