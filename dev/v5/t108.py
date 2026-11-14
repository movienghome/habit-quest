# t108 (v10.5): 빗금 진하게 · 폰 시간표 꾹 눌러야 옮김/길이 · 잠·술 몸 시작에도 · mig104(카드 잇기·보조 영역) · 카드 지울 때 이어진 일 · 기록하기 하루 요약
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
J=lambda pg,x:pg.evaluate(x)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
def notoast(pg):
    J(pg,"(()=>{const t=document.getElementById('toast');if(t){t.classList.remove('on');t.style.pointerEvents=''}})()")
PD="""window.pd108=(sel,type,dx,dy)=>{const el=document.querySelector(sel);if(!el)return 'none';const r=el.getBoundingClientRect(),x=r.left+r.width/2+(dx||0),y=r.top+Math.min(8,r.height/2)+(dy||0);
  el.dispatchEvent(new PointerEvent(type,{bubbles:true,cancelable:true,pointerId:7,pointerType:'touch',clientX:x,clientY:y,isPrimary:true}));return 'ok'};"""

def run_main(pg,W):
    pg.wait_for_timeout(700);notoast(pg)
    # ② 잠·술 → 몸 시작
    r=J(pg,"""(()=>{const k=gk76(),d=dayOf(k);DAYS[addDays(k,-1)]&&(DAYS[addDays(k,-1)].entries=[]);d.entries=[];d.sl102={b:'01:30',w:'07:00',dr:1,ln:0};
      C.bs102=Object.assign({},C.bs102||{},{sp:0});const a=st102(d);C.bs102.sp=50;const b=st102(d);
      put=(e)=>{const y=dayOf(addDays(k,-1));y.entries=y.entries||[];y.entries.push(Object.assign({id:'z1',type:'bad',kind:'act',aid:'b1',name:'술 · 혼술',area:'body',cond:-20,xp:0,gold:0,t:'23:00'},e))};put({});const c=st102(d);DAYS[addDays(k,-1)].entries=[];
      return {cap:b.cap,a:a.start,b:b.start,c:c.start,sp:b.sp,cs:c.sp,txt:spTxt104(c)}})()""")
    ok(r['cap']==76 and r['a']-r['b']==13 and r['sp']==13,f'[{W}] 잠 5h30·술 → 몸 시작도 −13(50%: 잠 −5 · 술 −8)',r)
    ok(r['cs']==5 and '따로 기록' in r['txt'],f'[{W}] 술 카드를 따로 기록한 날은 술 몫은 시작값에서 안 뺌',r)
    J(pg,"render()");pg.wait_for_timeout(300)
    hp=J(pg,"[overallOf(today()),st102(today()).start]")
    ok(hp[0]==hp[1],f'[{W}] HP 시작 = 몸 시작(깎인 값)',hp)
    J(pg,"location.hash='home';render()");pg.wait_for_timeout(400);notoast(pg)
    pg.click('#areaBars .cap102',force=True);pg.wait_for_timeout(400)
    t=J(pg,"(()=>{const p=document.getElementById('pop');return p&&!p.hidden?p.innerText:''})()")
    ok('시작값' in t and '몸 시작도 −13' in t,f'[{W}] 몸 막대 설명에 시작값 줄',t[:300])
    J(pg,"closeInfo()")
    # ① 빗금 진하게
    st=J(pg,"(()=>{const c=document.querySelector('#areaBars .cap102');const s=c&&getComputedStyle(c);return s?[s.opacity,s.backgroundImage.slice(0,60)]:null})()")
    ok(st and st[0]=='1' and 'repeating-linear-gradient' in st[1],f'[{W}] 빗금 불투명도 1',st)
    # 몸 출발점 칸에 % 입력
    J(pg,"location.hash='edit';ui.edit='areas';render()");pg.wait_for_timeout(500)
    ok(J(pg,"!!document.querySelector('#editBody [data-f104=sp]')"),f'[{W}] 편집 → 컨디션 영역에 \'잠·술을 몸 시작에도 %\' 칸')
    pg.fill('#editBody [data-f104=sp]','0');pg.dispatch_event('#editBody [data-f104=sp]','change');pg.wait_for_timeout(300)
    ok(J(pg,"C.bs102.sp===0&&st102(today()).sp===0"),f'[{W}] 0으로 바꾸면 시작값에서 안 뺌')
    J(pg,"C.bs102.sp=50;delete today().sl102;render()")
    # ③ mig104
    r=J(pg,"""(()=>{const mk=(id,title,aid)=>{const t=newTask({title,list:'inbox'});delete TASKS[t.id];t.id=id;if(aid)t.aid=aid;else delete t.aid;TASKS[id]=t;saveTask(t);return t};
      if(!C.actions.some(a=>a.id==='dp5eh8'))C.actions.push({id:'dp5eh8',name:'폼롤러·스트레칭',type:'good',area:'body',cond:4,xp:2,gold:0,marble:''});
      if(!C.actions.some(a=>a.id==='9oi9xl7'))C.actions.push({id:'9oi9xl7',name:'산책',type:'good',area:'mind',cond:10,xp:5,gold:0,marble:''});
      const g6=C.actions.find(a=>a.id==='g6')||(C.actions.push({id:'g6',name:'명상',type:'good',area:'mind',cond:15,xp:20,gold:0,marble:''}),C.actions.find(a=>a.id==='g6'));
      g6.ar2='life';g6.r2=70;   // 사용자가 이미 정한 것 → 안 건드림
      C.actions=C.actions.filter(a=>a.id!=='g4');mk('tyf41846k5l','명상',null);mk('tlmyoxvtki6','스트레칭','g4');mk('thhdi4c91vb','스트레칭','g4');
      delete C.mig104;render();
      const a=id=>C.actions.find(x=>x.id===id);
      return {l:[TASKS.tyf41846k5l.aid,TASKS.tlmyoxvtki6.aid,TASKS.thhdi4c91vb.aid],walk:[a('9oi9xl7').ar2,a('9oi9xl7').r2],g6:[g6.ar2,g6.r2],m:C.mig104}})()""")
    ok(r['l']==['g6','dp5eh8','dp5eh8'],f'[{W}] mig104: Lethe 명상 → 명상 카드 · 지워진 스트레칭 → 폼롤러·스트레칭',r)
    ok(r['walk']==['body',50] and r['g6']==['life',70],f'[{W}] mig104: 산책에 보조 영역 몸 50% · 이미 정한 카드(명상)는 그대로',r)
    r=J(pg,"(()=>{TASKS.tyf41846k5l.aid='';const m=C.mig104;render();return [TASKS.tyf41846k5l.aid,C.mig104===m]})()")
    ok(r==['',True],f'[{W}] mig104는 한 번만',r)
    # ④ 카드 지울 때 이어진 일
    J(pg,"closeSheet&&closeSheet();location.hash='log';render()");pg.wait_for_timeout(300)
    r=J(pg,"""(()=>{C.actions.push({id:'x108',name:'지울 카드',type:'good',area:'body',cond:3,xp:2,gold:0,marble:''});
      const t=newTask({title:'이은 일',list:'inbox'});t.aid='x108';saveTask(t);window.__t108=t.id;C.routines=C.routines||[];
      delActs(['x108']);const s=document.getElementById('sheet');return {open:!s.hidden,txt:document.getElementById('sheetC').innerText,still:C.actions.some(a=>a.id==='x108')}})()""")
    ok(r['open'] and '이은 일' in r['txt'] and '0점' in r['txt'] and r['still'],f'[{W}] 이어진 할 일이 있으면 지우기 전에 창(아직 안 지움)',r)
    pg.select_option('#sheetC [data-d104sel]','dp5eh8');pg.wait_for_timeout(150)
    bt=J(pg,"document.querySelector('[data-d104=go]').textContent")
    ok('폼롤러' in bt,f'[{W}] 카드 고르면 단추가 \'…로 옮기고 지우기\'',bt)
    pg.click('#sheetC [data-d104=go]');pg.wait_for_timeout(400)
    r=J(pg,"[TASKS[window.__t108].aid,C.actions.some(a=>a.id==='x108'),document.getElementById('sheet').hidden]")
    ok(r==['dp5eh8',False,True],f'[{W}] 옮기고 지움',r)
    r=J(pg,"(()=>{C.actions.push({id:'y108',name:'혼자 카드',type:'good',area:'body',cond:3,xp:2,gold:0,marble:''});delActs(['y108']);return [C.actions.some(a=>a.id==='y108'),document.getElementById('sheet').hidden]})()")
    ok(r==[False,True],f'[{W}] 이어진 일이 없으면 바로 지움(창 없음)',r)
    r=J(pg,"""(()=>{C.actions.push({id:'z108',name:'풀 카드',type:'good',area:'body',cond:3,xp:2,gold:0,marble:''});const t=newTask({title:'풀 일',list:'inbox'});t.aid='z108';saveTask(t);
      delActs(['z108']);document.querySelector('[data-d104=go]').click();return [('aid' in TASKS[t.id]),C.actions.some(a=>a.id==='z108')]})()""")
    ok(r==[False,False],f'[{W}] 연결 풀고 지우기',r)
    r=J(pg,"(()=>{C.actions.push({id:'w108',name:'취소 카드',type:'good',area:'body',cond:3,xp:2,gold:0,marble:''});const t=newTask({title:'남는 일',list:'inbox'});t.aid='w108';saveTask(t);delActs(['w108']);document.querySelector('[data-d104=cancel]').click();return [TASKS[t.id].aid,C.actions.some(a=>a.id==='w108')]})()")
    ok(r==['w108',True],f'[{W}] 취소하면 그대로',r)
    J(pg,"closeSheet()")
    # ⑤ 하루 요약
    J(pg,"""(()=>{const d=today();d.entries=[];const g=C.actions.find(a=>a.type==='good'&&!a.opts);doAction(g,{direct:true});doAction(g,{direct:true});ui.off=0;location.hash='log';render()})()""");pg.wait_for_timeout(500);notoast(pg)
    s=J(pg,"(()=>{const b=document.querySelector('#log').parentElement.querySelector('.ds104');return b?b.innerText:''})()")
    xs=J(pg,"today().entries.reduce((s,e)=>s+(+e.xp||0),0)")
    ok('HP' in s and f'+{xs}' in s and '용기' in s and '기록 2개' in s and '🔋' in s,f'[{W}] 오늘 한 일 칸 맨 위 요약(HP·XP·용기·기록·영역)',s)
    ok(J(pg,"!!document.querySelector('.ds104 svg')"),f'[{W}] 요약에 아바타')
    J(pg,"ui.off=1;render()");pg.wait_for_timeout(300)
    s2=J(pg,"(document.querySelector('.ds104')||{}).innerText||''")
    ok('기록 ' in s2 and s2!=s,f'[{W}] 어제로 바꾸면 어제 요약',s2[:80])
    J(pg,"ui.off=0;render()")
    ov=J(pg,"(()=>{const b=document.querySelector('.ds104');return b?b.scrollWidth-b.clientWidth:0})()")
    ok(ov<=1,f'[{W}] 요약 가로 안 넘침',ov)

def run_touch(pg,W):
    pg.wait_for_timeout(500);notoast(pg);J(pg,PD)
    tid=J(pg,"(()=>{const t=newTask({title:'블록 시험',list:'inbox'});t.due=midKey68();t.time='10:00';t.dur=60;saveTask(t);C.tt84=1;location.hash='tasks';return t.id})()");pg.wait_for_timeout(900)
    J(pg,"C.ui.cal.mode='1day';render()");pg.wait_for_timeout(400)
    J(pg,f"(()=>{{const b=document.querySelector('.blk[data-ctask=\"{tid}\"]');if(b)b.scrollIntoView({{block:'center'}})}})()");pg.wait_for_timeout(300)
    blk=f'#calPane .blk[data-ctask="{tid}"]';rz=f'#calPane .rz75[data-drag="resize:{tid}"]'
    ok(J(pg,f"!!document.querySelector('{blk}')"),f'[{W}] 폰 시간표 독 1일 보기에 블록',J(pg,"C.ui.cal.mode"))
    ok(J(pg,f"(document.querySelector('{rz}')||{{dataset:{{}}}}).dataset.dragmode")=='hold',f'[{W}] 터치: 길이 손잡이 = 꾹 눌러야(hold)')
    # 손잡이: 닿자마자 시작 안 함
    J(pg,f"pd108('{rz}','pointerdown')");pg.wait_for_timeout(80)
    ok(not J(pg,"DND.on"),f'[{W}] 손잡이에 닿자마자 길이 바뀌지 않음')
    J(pg,f"pd108('{rz}','pointermove',0,9)");pg.wait_for_timeout(450)
    ok(not J(pg,"DND.on"),f'[{W}] 손잡이에서 바로 밀면(스크롤) 취소')
    J(pg,f"pd108('{rz}','pointerup')");pg.wait_for_timeout(100)
    J(pg,f"pd108('{rz}','pointerdown')");pg.wait_for_timeout(450)
    ok(J(pg,"DND.on&&DND.kind==='resize'"),f'[{W}] 손잡이 꾹(0.4초) → 길이 바꾸기 시작')
    J(pg,"dndAbort();dndCancel();DND.src=null");pg.wait_for_timeout(100)
    # 블록: 0.35초엔 아직(옛 0.3초) · 0.5초 뒤 시작
    J(pg,f"pd108('{blk}','pointerdown')");pg.wait_for_timeout(350)
    ok(not J(pg,"DND.on"),f'[{W}] 블록 0.35초 눌러도 아직 안 옮김(옛 0.3초)')
    pg.wait_for_timeout(250)
    ok(J(pg,"DND.on&&DND.kind==='block'"),f'[{W}] 블록 0.5초 꾹 → 옮기기 시작')
    J(pg,"dndAbort();dndCancel();DND.src=null");pg.wait_for_timeout(100)
    J(pg,f"pd108('{blk}','pointerdown')");pg.wait_for_timeout(100);J(pg,f"pd108('{blk}','pointermove',0,7)");pg.wait_for_timeout(600)
    ok(not J(pg,"DND.on"),f'[{W}] 블록 누르고 7px 움직이면 취소(스크롤)')
    J(pg,f"pd108('{blk}','pointerup')")
    ok(J(pg,f"TASKS['{tid}'].time==='10:00'&&TASKS['{tid}'].dur===60"),f'[{W}] 시각·길이 그대로',J(pg,f"[TASKS['{tid}'].time,TASKS['{tid}'].dur]"))

with sync_playwright() as pw:
    for W,H in [(1400,900),(390,800)]:
        b,pg=run(pw,W=W,H=H)
        try:run_main(pg,W)
        except Exception as e:
            ok(False,f'[{W}] 예외 {e}')
        b.close()
    b,pg=run(pw,W=390,H=800,pre="window.__coarse75=1;")
    try:run_touch(pg,'touch')
    except Exception as e:ok(False,f'[touch] 예외 {e}')
    b.close()
real=[e for e in errs if 'favicon' not in e and 'net::' not in e and 'Failed to load' not in e]
ok(not real,'콘솔 오류 없음',real[:3])
print('FAILS',len(FAILS),FAILS)
