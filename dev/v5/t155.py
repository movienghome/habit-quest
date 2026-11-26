# t155 (v13.18): 저장 동기화 — 오프라인/연결 불안정 때 이 기기 사본으로 서버를 통째 덮어쓰지 않음 · 지운 카드가 되살아나지 않음 · 보관본이 지운 할 일을 되살리지 않음
import os,json
os.environ.setdefault('HQURL','file:///home/claude/habit-quest/beta/index.html')
exec(open('/home/claude/habit-quest/dev/v5/h61.py').read())
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
J=lambda pg,x:pg.evaluate(x)
CFG="(()=>{for(const [k,v] of window.__store)if(/game\\/config$/.test(k))return k})()"
with sync_playwright() as pw:
    b,pg=run(pw);closepops(pg)
    # 준비: 카드 X·Y를 만들어 저장
    J(pg,"(()=>{C.actions.push({id:'tx155',name:'지울 카드 155',type:'good',area:C.areas[0].id,xp:1,gold:0,cond:0});C.actions.push({id:'ty155',name:'남길 카드 155',type:'good',area:C.areas[0].id,xp:1,gold:0,cond:0});save('config')})()")
    pg.wait_for_timeout(1500)
    path=J(pg,CFG);ok(bool(path),'설정 문서 경로',path)
    # 이 기기: 오프라인 — 스냅샷은 받지 못한 상태로, 남아 있던 X를 조금 고치고 설정 저장 (오래된 사본)
    J(pg,"window.__offline=true")
    # 스냅샷이 오기 전에 dirty로 만들어 스냅샷을 무시하게
    J(pg,"(()=>{const a=C.actions.find(a=>a.id==='tx155');if(a)a.memo='고침';const y=C.actions.find(a=>a.id==='ty155');y.memo='이 기기에서 고침';save('config')})()")
    # 다른 기기: 카드 X 지우고 새 프리셋 대신 새 카드 Z 추가 (서버에 직접)
    J(pg,"""(()=>{const p=%s;const raw=JSON.parse(JSON.stringify(window.__store.get(p)));raw.actions=raw.actions.filter(a=>a.id!=='tx155');raw.actions.push({id:'tz155',name:'다른 기기 새 카드',type:'good',area:raw.actions[0].area,xp:1,gold:0,cond:0});window.__remote(p,raw)})()"""%json.dumps(path))
    pg.wait_for_timeout(9000)   # 예전 코드: 실패 두 번 뒤 set(mine)으로 통째 덮어씀
    raw=json.loads(J(pg,"JSON.stringify(window.__store.get(%s))"%json.dumps(path)))
    ids=[a['id'] for a in raw.get('actions',[])]
    ok('tz155' in ids,'오프라인 동안 다른 기기에서 만든 카드가 서버에서 안 사라짐',ids[-4:])
    ok('tx155' not in ids,'오프라인 동안 다른 기기에서 지운 카드가 서버에 되살아나지 않음')
    ok(J(pg,"Object.keys(JSON.parse(localStorage.getItem('hq-pend-b')||localStorage.getItem('hq-pend')||'{}')).includes('config')"),'저장 못 한 변경이 보관본에 있음')
    # 다시 연결 → 합쳐서 저장
    J(pg,"window.__offline=false;dispatchEvent(new Event('online'))");pg.wait_for_timeout(4000)
    raw=json.loads(J(pg,"JSON.stringify(window.__store.get(%s))"%json.dumps(path)))
    ac={a['id']:a for a in raw.get('actions',[])}
    ok('tz155' in ac,'연결 뒤: 다른 기기 새 카드 유지')
    ok('tx155' not in ac,'연결 뒤: 다른 기기에서 지운 카드는 (이 기기에서 고쳤어도) 지운 쪽이 이김')
    ok(ac.get('ty155',{}).get('memo')=='이 기기에서 고침','연결 뒤: 이 기기에서 고친 것 반영')
    ok(J(pg,"!C.actions.some(a=>a.id==='tx155')&&C.actions.some(a=>a.id==='tz155')"),'화면 사본도 서버와 같아짐')
    # 보관본이 다른 기기에서 지운 할 일을 되살리지 않음
    st={k:v for k,v in json.loads(dump(pg))}
    tid=J(pg,"(()=>{const t=newTask({title:'보관 시험 155'});saveTask(t);return t.id})()");pg.wait_for_timeout(1500)
    tp=J(pg,"(()=>{for(const [k] of window.__store)if(k.endsWith('/tasks/'+%s))return k})()"%json.dumps(tid))
    st={k:v for k,v in json.loads(dump(pg))}
    tbody=st[tp];del st[tp]   # 다른 기기에서 지움
    pend={('t:'+tid):{'m':dict(tbody,title='보관 시험 155 고침'),'b':tbody,'at':int(__import__('time').time()*1000)}}
    b2,pg2=run(pw,store=st,pre="localStorage.setItem('hq-pend-b',%s);localStorage.setItem('hq-pend',%s);"%(json.dumps(json.dumps(pend)),json.dumps(json.dumps(pend))))
    pg2.wait_for_timeout(3000)
    ok(not J(pg2,"!!TASKS[%s]"%json.dumps(tid)),'보관본이 다른 기기에서 지운 할 일을 되살리지 않음')
    ok(not J(pg2,"[...window.__store.keys()].some(k=>k.endsWith('/tasks/'+%s))"%json.dumps(tid)),'서버에도 다시 안 생김')
    # 진짜 새 할 일(보관할 때 서버에 없던 것)은 보관본에서 되살림
    pend2={'t:new155':{'m':{'title':'오프라인 새 할 일 155','status':0,'due':J(pg2,'midKey68()'),'list':'inbox','created':J(pg2,'midKey68()')},'b':None,'at':int(__import__('time').time()*1000)}}
    b3,pg3=run(pw,store=st,pre="localStorage.setItem('hq-pend-b',%s);localStorage.setItem('hq-pend',%s);"%(json.dumps(json.dumps(pend2)),json.dumps(json.dumps(pend2))))
    pg3.wait_for_timeout(3000)
    ok(J(pg3,"!!TASKS['new155']"),'오프라인에서 새로 만든 할 일은 보관본에서 되살림')
print('ERRS',[e for e in errs if 'PAGEERR' in e][:5])
print('FAILS',len(FAILS),FAILS)
