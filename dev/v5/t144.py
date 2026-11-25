# t144 (v13.8): 뽀모도로 기기 간 동기화 — 두 기기를 두 페이지로 흉내(설정 스냅샷 = C.pomoRun88 문자열을 그대로 건네줌)
import os,json
os.environ.setdefault('HQURL','file:///home/claude/habit-quest/beta/index.html')
exec(open('/home/claude/habit-quest/dev/v5/h61.py').read())
URL=os.environ.get('HQURL',URL)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
J=lambda pg,x:pg.evaluate(x)
PRE="window.__vib=0;navigator.vibrate=()=>{window.__vib++;return true};"
def feed(src,dst):  # 설정 스냅샷이 오는 것과 같게: 한쪽 C.pomoRun88을 다른 쪽 C에 넣음
    s=J(src,"C.pomoRun88||''");J(dst,"C.pomoRun88="+json.dumps(s));return s
with sync_playwright() as pw:
    a,A=run(pw,W=1200,H=900,pre=PRE);b2,B=run(pw,W=390,H=800,pre=PRE)
    for pg in (A,B):closepops(pg)
    ok(J(A,"typeof C.pomoRun88")=='undefined' and J(B,"typeof C.pomoRun88")=='undefined','처음엔 두 기기 모두 진행 상태 없음')
    # 1) A에서 시작 → 문자열로 저장됨
    J(A,"pStart88({id:'sc',name:'시나리오 집필'})");A.wait_for_timeout(300)
    s=J(A,"C.pomoRun88")
    ok(isinstance(s,str) and json.loads(s).get('kid')=='sc' and json.loads(s).get('run') is True,'A 시작 → C.pomoRun88에 진행 상태 문자열',s)
    ok(bool(json.loads(s).get('dev')) and bool(json.loads(s).get('at')),'시작한 기기(dev)·쓴 시각(at)이 들어감')
    # 2) B가 받아 옴
    feed(A,B);B.wait_for_timeout(1500)
    ok(J(B,"!!PM88&&PM88.kid==='sc'&&PM88.run===true"),'B가 A의 타이머를 이어받음',J(B,"JSON.stringify(PM88)"))
    ok(J(B,"document.getElementById('pomoBtn88').classList.contains('on88')"),'B 머리 🍅 단추가 켜짐')
    ok(J(B,"pEl88()<5000&&pEl88()>=0"),'B 지난 시간이 A와 같은 기준(몇 초 안)',J(B,"pEl88()"))
    sB=J(B,"C.pomoRun88");ok(json.loads(sB)['at']==json.loads(s)['at'],'받기만 하고 B가 다시 쓰지 않음(되돌아 쓰기 없음)')
    # 3) B에서 일시정지 → A가 따라감
    J(B,"pAct88('pause')");B.wait_for_timeout(300)
    s2=J(B,"C.pomoRun88");ok(json.loads(s2)['run'] is False and json.loads(s2)['at']>=json.loads(s)['at'],'B 일시정지가 문자열에 반영')
    feed(B,A);A.wait_for_timeout(1500)
    ok(J(A,"PM88&&PM88.run===false"),'A도 일시정지로 바뀜')
    # 4) A에서 계속 → 끝나게 만들기 → A만 기록·구슬, B는 중복 기록 없음 + B 알림(진동)
    J(A,"pAct88('resume')");J(A,"PM88.acc=PM88.dur-500;PM88.t0=Date.now()-2000;pSave88()");A.wait_for_timeout(1500)
    ok(J(A,"(C.pomo88.log||[]).length")==1 and J(A,"C.pomo88.log[0].f")==1,'A에서 끝 → 기록 1건',J(A,"JSON.stringify(C.pomo88.log)"))
    ok(J(A,"PM88&&PM88.n===1"),'A 진행 상태 n=1(쉬는 시간 자동 시작 포함)',J(A,"JSON.stringify(PM88)"))
    feed(A,B);B.wait_for_timeout(1500)
    ok(J(B,"(C.pomo88&&C.pomo88.log||[]).length")==0,'B는 끝 기록을 따로 만들지 않음(중복 방지)')
    ok(J(B,"PM88&&PM88.n===1"),'B도 n=1을 받음')
    ok(J(B,"window.__vib")>=1,'화면이 켜진 B에서 알림(진동)이 울림',J(B,"window.__vib"))
    # 5) 같은 상태를 A가 다시 끝내려 해도 B가 이미 끝낸 상태면 안 함(hold 확인)
    J(B,"PM88.hold='breakdone';PM88.run=false;pSave88()");B.wait_for_timeout(300)
    feed(B,A);A.wait_for_timeout(1500)
    ok(J(A,"PM88&&PM88.hold==='breakdone'"),'A가 B의 hold를 받음')
    ok(J(A,"(C.pomo88.log||[]).length")==1,'기록은 여전히 1건')
    # 6) B에서 그만두기 → A도 꺼짐
    J(B,"pStop88(false)");B.wait_for_timeout(300)
    ok(json.loads(J(B,"C.pomoRun88")).get('off')==1,'그만두면 {off:1} 문자열')
    feed(B,A);A.wait_for_timeout(1500)
    ok(J(A,"PM88===null"),'A도 타이머 없음')
    ok(J(A,"!document.getElementById('pomoBtn88').classList.contains('on88')"),'A 🍅 단추 꺼짐')
    # 7) 옛(at이 더 오래된) 상태는 무시
    J(A,"pStart88({id:'wl',name:'작업일지 쓰기'})");A.wait_for_timeout(300)
    J(A,"C.pomoRun88=JSON.stringify({kid:'sc',kind:'시나리오 집필',phase:'work',dur:1500000,acc:0,run:true,t0:Date.now(),at:1000,dev:'zz'})");A.wait_for_timeout(1500)
    ok(J(A,"PM88&&PM88.kid==='wl'"),'더 오래된 원격 상태는 무시하고 내 것 유지',J(A,"PM88&&PM88.kid"))
    ok(json.loads(J(A,"C.pomoRun88"))['kid']=='wl','내 새 상태를 다시 올림')
    # 8) 새로고침 뒤에도 localStorage로 이어짐 + 설정 키 보존(normConfig)
    ok(J(A,"normConfig(JSON.parse(JSON.stringify(C))).pomoRun88===C.pomoRun88"),'normConfig가 C.pomoRun88을 버리지 않음')
    # 9) 숨은 기기·시작한 기기가 아니면 안 울림
    J(B,"window.__vib=0;document.__vs=Object.getOwnPropertyDescriptor(Document.prototype,'visibilityState');Object.defineProperty(document,'visibilityState',{get:()=>'hidden',configurable:true});PM88={kid:'sc',kind:'x',phase:'work',dur:1000,acc:0,run:true,t0:Date.now(),dev:'other',at:Date.now()};pRing88('t','b')")
    ok(J(B,"window.__vib")==0,'숨은 기기(시작한 기기 아님)는 알람 안 울림')
    J(B,"PM88.dev=DEV136;pRing88('t','b')")
    ok(J(B,"window.__vib")>=1,'숨은 기기라도 시작한 기기면 울림(기기 하나뿐일 때 예전처럼)')
    a.close();b2.close()
print('FAILS',len(FAILS))
for f in FAILS:print(' -',f)
