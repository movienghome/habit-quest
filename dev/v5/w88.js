/* ---- v8.9 (w88.js): 주 인식(월)·캘린더 첫 칸(일) 분리 · 자리 다 지난 주의 마감 칩 · 모바일 건너뛰기 · 🍅 뽀모도로 ----
   ① 한 주 = 월요일부터 세는 게 사용자의 실제 인식(마감 칩·주 N회 횟수·주간 보스·돌아보기) → C.wk71=1.
      캘린더 첫 칸만 따로 `C.calw71`(0=일, 1=월, 없으면 C.wk71 따라감) — 월 격자·주 보기·요일 머리만 weekStartD/WKH71을 씀(patch41이 v5d 두 곳을 바꿈).
      일회성 이주 mig88: 예전 C.wk71===0이면 calw71=0 · wk71=1, 토요일 마감(주 시작 일요일+6)인 주 N회 due를 하루 뒤로, 이번 주 메모·한 가지 키를 월요일 키로도 복사. C.mig88wk로 한 번만.
   ② 주 N회 자리(t.sl91)를 놓은 주가 다 지났는데 횟수가 모자라면 마감일에 `· 마감 n/N` 칩(전엔 슬롯 있는 주는 기본 자리가 통째로 빠져서 칩이 아예 없었음).
   ③ 상세 ⋯ 메뉴에 '⏭ 오늘은 건너뛰기'(반복 할 일·루틴) — 폰은 길게 누르면 끌기라 우클릭 메뉴가 없어 건너뛰기 길이 없었음.
   ④ 캘린더 끝낸 일(반복 할 일 포함)도 눌러서 상세 열기(w77·w84의 data-ctask).
   ⑤ 🍅 뽀모도로: C.pomo88={w,b,snd,kinds:[{id,name,jar,mt}],log:[{id,d,k,s,f,m}]} · 실행 중 상태는 기기마다 localStorage(PK88). */
function wkSD88(){return (C.calw71===0||C.calw71===1)?C.calw71:wkS71()}
function weekStartD(k){const d=new Date(toUTC(k)).getUTCDay(),s=wkSD88();return addDays(k,-((d-s+7)%7))}
WKH71=function(){return wkSD88()===0?['일','월','화','수','목','금','토']:['월','화','수','목','금','토','일']};

let MIG88=0;
function mig88(){
  if(MIG88||C.mig88wk)return;
  if(typeof ready==='undefined'||!ready||typeof tasksReady==='undefined'||!tasksReady||!tOK64())return;
  MIG88=1;
  try{
    if(C.wk71===0){
      if(C.calw71==null)C.calw71=0;
      C.wk71=1;
      Object.values(TASKS).forEach(x=>{if(wx91(x)&&x.due&&dowOf(x.due)===6){x.due=addDays(x.due,1);saveTask(x)}});
      ['wone62','wnote59'].forEach(n=>{const o=C[n];if(!o)return;Object.keys(o).forEach(k=>{if(dowOf(k)===0&&o[addDays(k,1)]==null)o[addDays(k,1)]=o[k]})});
    }
    C.mig88wk=1;save('config');
  }catch(e){console.error(e)}finally{MIG88=0}}
render=(function(prev){return function(){try{mig88()}catch(e){console.error(e)}return prev.apply(this,arguments)}})(render);

rules70HTML=(function(prev){return function(){const h=prev.apply(this,arguments),i=h.lastIndexOf('</div></div>');if(i<0)return h;
  const add=`<label>🗓 캘린더 첫 칸<select data-r71="calw"><option value="0" ${wkSD88()===0?'selected':''}>일요일</option><option value="1" ${wkSD88()===1?'selected':''}>월요일</option></select><span class="tiny muted">보기만 바뀌어요 · 마감·횟수는 위 '한 주의 시작'(월요일)대로</span></label>`;
  return h.slice(0,i)+add+h.slice(i)}})(rules70HTML);
addEventListener('change',e=>{const i=e.target;if(!i||!i.dataset||i.dataset.r71!=='calw')return;C.calw71=+i.value;save('config');render();if(curView()==='edit')renderEdit();toast(`캘린더는 ${+i.value===0?'일요일':'월요일'}부터 보여요`)},true);

/* ② 자리를 놓은 주가 다 지났는데 횟수가 모자라면 마감일에 마감 칩 */
function slotsLeft88(t,ws){const td=midKey68();return slotKeys91(t,ws).some(k=>k>=td&&!slotDoneOn91(t,k))}
function dlNeed88(t,k){if(!wx91(t)||t.due!==k||!t.sl91)return false;const ws=weekStart(k);
  if(!slotKeys91(t,ws).length||slotsLeft88(t,ws))return false;return wkCnt91(t,ws)<(+t.rep.n||3)}
function dlCopy88(t,k){return Object.assign({},t,{title:t.title+' · 마감 '+wkCnt91(t,weekStart(k))+'/'+(+t.rep.n||3),dl91:1})}
tasksOn=(function(prev){return function(k){const a=prev.apply(this,arguments);
  try{const add=[];openTasks().forEach(t=>{if(!dlNeed88(t,k)||!calPass(t)||a.some(x=>x.id===t.id))return;add.push(dlCopy88(t,k))});if(add.length)return a.concat(add)}catch(e){console.error(e)}
  return a}})(tasksOn);
spanDays71=(function(prev){return function(t){const r=prev.apply(this,arguments);
  try{if(wx91(t)&&t.sl91&&t.due&&!span71(t)&&dlNeed88(t,t.due)&&!r.includes(t.due))return r.concat([t.due])}catch(e){console.error(e)}return r}})(spanDays71);
cchip=(function(prev){return function(t,k){try{if(t&&!t.dl91&&dlNeed88(t,k))t=dlCopy88(t,k)}catch(e){}return prev.call(this,t,k)}})(cchip);

/* ③ 상세 ⋯ 메뉴: 오늘은 건너뛰기 (반복 할 일·루틴) */
menu61=(function(prev){return function(x,y,title,items){
  try{const t=sheetCtx&&sheetCtx.task&&TASKS[sheetCtx.task];
    if(t&&t.status===0&&t.rep&&t.rep.f&&Array.isArray(items)&&items.some(i=>i&&i.keep&&i.l==='🗑 삭제')&&!items.some(i=>i&&/건너뛰기/.test(i.l||''))){
      items=[{l:'⏭ 오늘은 건너뛰기 <small class="muted">미룸·☠ 없이 다음 차례로</small>',f:()=>{try{tsRead()}catch(x){}closeSheet();skipToday61(TASKS[t.id]||t)}},'-'].concat(items)}}catch(e){console.error(e)}
  return prev.call(this,x,y,title,items)}})(menu61);

/* ⑤ 🍅 뽀모도로 ------------------------------------------------------------ */
const PK88='hq_pomo88_run';
let PM88=null,AC88=null,PSTOP88=0,PTITLE88=null;
try{PM88=JSON.parse(localStorage.getItem(PK88)||'null')}catch(e){}
function pSave88(){try{PM88?localStorage.setItem(PK88,JSON.stringify(PM88)):localStorage.removeItem(PK88)}catch(e){}}
function pget88(){const c=C.pomo88||{};return {w:c.w||25,b:c.b==null?5:c.b,snd:c.snd!==false,kinds:(c.kinds&&c.kinds.length)?c.kinds:[{id:'sc',name:'시나리오 집필'},{id:'wl',name:'작업일지 쓰기'}],log:c.log||[]}}
function pset88(){const c=C.pomo88=C.pomo88||{};const g=pget88();c.w=g.w;c.b=g.b;c.kinds=g.kinds;c.log=c.log||[];return c}
function pJar88(k){ // 종류에 이어진 병·구슬 {jar,mt} 또는 null (k.jar===''이면 일부러 없음, 없으면 이름으로 짐작)
  const J=C.jars||[];if(k.jar===''||k.jar===null)return null;
  if(k.jar){const j=J.find(x=>x.id===k.jar);if(j)return {jar:j.id,mt:(j.types.find(t=>t.id===k.mt)||j.types[0]||{}).id}}
  if(k.jar!==undefined)return null;
  const key=(k.name||'').replace(/\s/g,'').slice(0,2);if(!key)return null;
  const j=J.find(x=>String(x.name||'').replace(/\s/g,'').includes(key));return j&&j.types&&j.types[0]?{jar:j.id,mt:j.types[0].id}:null}
function pEl88(){return PM88?(PM88.acc||0)+(PM88.run?Date.now()-PM88.t0:0):0}
function pFmt88(ms){ms=Math.max(0,Math.ceil(ms/1000));return Math.floor(ms/60)+':'+('0'+(ms%60)).slice(-2)}
function pLog88(row){const c=pset88();row.id='p'+Date.now().toString(36)+Math.random().toString(36).slice(2,5);row.d=gk76();
  c.log.push(row);const lim=addDays(gk76(),-400);c.log=c.log.filter(r=>r.d>=lim);save('config')}
function pStart88(kind,phase){const g=pget88();
  if(!phase||phase==='work'){const jm=pJar88(kind);
    PM88={kid:kind.id,kind:kind.name,phase:'work',dur:g.w*60000,acc:0,run:true,t0:Date.now(),n:(PM88&&PM88.kid===kind.id?PM88.n:0)||0,jar:jm&&jm.jar||'',mt:jm&&jm.mt||''}}
  else PM88=Object.assign({},PM88,{phase:'break',dur:g.b*60000,acc:0,run:true,t0:Date.now(),hold:null});
  PM88.hold=null;PSTOP88=0;pSave88();pAfter88()}
function pAudioUnlock88(){try{AC88=AC88||new (window.AudioContext||window.webkitAudioContext)();if(AC88.state==='suspended')AC88.resume()}catch(e){}
  try{if('Notification' in window&&Notification.permission==='default')Notification.requestPermission()}catch(e){}}
function pRing88(title,body){
  if(pget88().snd){try{const ac=AC88||(AC88=new (window.AudioContext||window.webkitAudioContext)());if(ac.state==='suspended')ac.resume();const t0=ac.currentTime;
    for(let i=0;i<6;i++){const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=i%2?660:880;
      g.gain.setValueAtTime(0.0001,t0+i*0.35);g.gain.exponentialRampToValueAtTime(0.4,t0+i*0.35+0.03);g.gain.exponentialRampToValueAtTime(0.0001,t0+i*0.35+0.3);
      o.connect(g);g.connect(ac.destination);o.start(t0+i*0.35);o.stop(t0+i*0.35+0.32)}}catch(e){}}
  try{navigator.vibrate&&navigator.vibrate([300,150,300,150,300])}catch(e){}
  try{if('Notification' in window&&Notification.permission==='granted'){
    try{new Notification(title,{body,tag:'hq-pomo88',requireInteraction:true})}
    catch(x){navigator.serviceWorker&&navigator.serviceWorker.ready.then(r=>r.showNotification(title,{body,tag:'hq-pomo88',requireInteraction:true}))}}}catch(e){}}
function pComplete88(){
  if(!PM88||PM88.hold)return;
  PM88.run=false;PM88.acc=PM88.dur;
  if(PM88.phase==='work'){
    PM88.n=(PM88.n||0)+1;PM88.hold='workdone';pSave88();
    const g=pget88();let m=0;
    try{if(PM88.jar&&(C.jars||[]).find(j=>j.id===PM88.jar)){addMarble66(PM88.jar,PM88.mt,'🍅 '+PM88.kind+' '+g.w+'분');m=1}}catch(e){console.error(e)}
    pLog88({k:PM88.kind,s:g.w*60,f:1,m});
    pRing88('🍅 '+g.w+'분 끝!',PM88.kind+(m?' · 구슬 하나':'')+' · '+g.b+'분 쉬어요');
  }else{PM88.hold='breakdone';pSave88();pRing88('☕ 쉬는 시간 끝','다음 '+pget88().w+'분을 시작할까요?')}
  pAfter88(true)}
function pStop88(rec){ // rec: true=여기까지 기록 / false=기록 안 함
  if(!PM88)return;const el=pEl88();
  if(PM88.phase==='work'&&!PM88.hold&&rec&&el>=60000){const mins=Math.round(el/60000);pLog88({k:PM88.kind,s:Math.round(el/1000),f:0,m:0});
    toast(`🍅 ${mins}분 기록했어요 · 구슬은 ${pget88().w}분을 채워야 들어가요`)}
  else if(PM88.phase==='work'&&!PM88.hold&&!rec)toast('기록하지 않고 끝냈어요');
  PM88=null;PSTOP88=0;pSave88();pAfter88()}
function pAct88(a){
  if(!PM88)return;
  if(a==='pause'){PM88.acc=pEl88();PM88.run=false;pSave88()}
  else if(a==='resume'){PM88.t0=Date.now();PM88.run=true;pSave88()}
  else if(a==='stop'){if(PM88.hold||PM88.phase==='break'){pStop88(false);return}if(pEl88()<60000){pStop88(false);toast('1분이 안 돼서 기록 없이 끝냈어요');return}
    if(PM88.run){PM88.acc=pEl88();PM88.run=false;PM88.autop=1;pSave88()}PSTOP88=1}
  else if(a==='cancelstop'){PSTOP88=0;if(PM88.autop){delete PM88.autop;PM88.t0=Date.now();PM88.run=true;pSave88()}}
  else if(a==='rec'){pStop88(true);return}
  else if(a==='norec'){pStop88(false);return}
  else if(a==='brk'){pStart88({id:PM88.kid,name:PM88.kind},'break');return}
  else if(a==='next'){const k=pget88().kinds.find(z=>z.id===PM88.kid)||{id:PM88.kid,name:PM88.kind};pStart88(k,'work');return}
  else if(a==='end'){pStop88(false);return}
  pAfter88()}
function pAfter88(ringed){pBtn88();pTick88(true);try{pDraw88()}catch(e){}try{pPop88(ringed)}catch(e){}}

/* 머리 단추 · 탭 제목 */
function pBtn88(){const tools=document.querySelector('.hud-tools');if(!tools)return;let b=$('pomoBtn88');
  if(!b){b=document.createElement('button');b.type='button';b.className='hbtn';b.id='pomoBtn88';b.setAttribute('aria-label','뽀모도로');b.innerHTML='<span class="pi88">🍅</span><span class="pt88"></span>';tools.insertBefore(b,tools.firstChild)}
  const t=b.querySelector('.pt88'),i=b.querySelector('.pi88');
  let ic='🍅',tx='',ti='뽀모도로';
  if(PM88){if(PM88.hold){ic=PM88.phase==='work'?'🍅':'☕';tx='끝!';ti='끝났어요'}
    else{ic=!PM88.run?'⏸':PM88.phase==='work'?'🍅':'☕';tx=pFmt88(PM88.dur-pEl88());ti=(PM88.phase==='work'?PM88.kind:'쉬는 시간')+(PM88.run?'':' · 일시정지')}}
  i.textContent=ic;t.textContent=tx;b.title=ti;b.classList.toggle('on88',!!PM88);
  // 캘린더 화면은 머리(#hud)가 숨겨져서 — 돌고 있을 때만 떠 있는 작은 단추
  const hv=$('hud')&&getComputedStyle($('hud')).display!=='none';let f=$('pomoFab88');
  if(PM88&&!hv){if(!f){f=document.createElement('button');f.type='button';f.id='pomoFab88';f.className='fab88';document.body.appendChild(f)}f.hidden=false;f.textContent=ic+' '+tx;f.title=ti}
  else if(f)f.hidden=true}
function pTitle88(){if(PM88&&!PM88.hold){if(PTITLE88==null)PTITLE88=document.title;document.title=(PM88.run?(PM88.phase==='work'?'🍅 ':'☕ '):'⏸ ')+pFmt88(PM88.dur-pEl88())+' · '+(PM88.phase==='work'?PM88.kind:'쉬는 시간')}
  else if(PM88&&PM88.hold){if(PTITLE88==null)PTITLE88=document.title;document.title='🔔 끝났어요 · 해비티카틱'}
  else if(PTITLE88!=null){document.title=PTITLE88;PTITLE88=null}}
function pTick88(force){
  if(PM88&&PM88.run&&!PM88.hold&&pEl88()>=PM88.dur){pComplete88();return}
  if(!PM88&&!force&&PTITLE88==null)return;
  pBtn88();pTitle88();
  const tm=$('p88time');if(tm&&PM88){tm.textContent=pFmt88(PM88.dur-pEl88());const bar=$('p88bar');if(bar)bar.style.width=Math.min(100,pEl88()/PM88.dur*100)+'%';const el=$('p88el');if(el)el.textContent=pFmt88(pEl88())}}
setInterval(pTick88,500);
addEventListener('visibilitychange',()=>{if(!document.hidden)pTick88(true)});
addEventListener('storage',e=>{if(e.key!==PK88)return;try{PM88=e.newValue?JSON.parse(e.newValue):null}catch(x){PM88=null}pBtn88();pTitle88();try{pDraw88();pPop88()}catch(x){}});

/* 끝났을 때 팝업 (어느 화면에서든 뜸) */
function pPop88(ringed){let p=$('pomoPop88');
  if(!PM88||!PM88.hold){if(p)p.hidden=true;return}
  if(!p){p=document.createElement('div');p.id='pomoPop88';p.setAttribute('role','alertdialog');p.setAttribute('aria-modal','true');p.setAttribute('aria-labelledby','pp88t');document.body.appendChild(p)}
  const g=pget88(),w=PM88.phase==='work',n=PM88.n||0;
  p.innerHTML=`<div class="pp88"><div class="pp88e">${w?'🍅':'☕'}</div><h3 id="pp88t">${w?`${g.w}분 끝났어요`:'쉬는 시간 끝'}</h3>
    <p>${w?`${esc(PM88.kind)} · 오늘 ${n}번째${PM88.jar?' · 구슬이 하나 들어갔어요':''}`:`${esc(PM88.kind)} 다음 ${g.w}분을 할까요?`}</p>
    <div class="pp88b">${w?`<button type="button" class="btn go" data-p88="brk">☕ 쉬는 ${g.b}분</button><button type="button" class="btn ghost" data-p88="next">바로 다음 ${g.w}분</button>`:`<button type="button" class="btn go" data-p88="next">▶ 다음 ${g.w}분</button>`}
    <button type="button" class="btn ghost" data-p88="end">여기까지</button></div></div>`;
  p.hidden=false;const f=p.querySelector('.btn.go');if(f)f.focus()}

/* 패널(시트) */
function pStats88(){const g=pget88(),td=gk76(),ws=weekStart(td),L=g.log;
  const day=d=>{const r=L.filter(x=>x.d===d);return {n:r.filter(x=>x.f).length,min:Math.round(r.reduce((a,x)=>a+x.s,0)/60),m:r.reduce((a,x)=>a+(x.m||0),0)}};
  const t=day(td),days=[...Array(7)].map((_,i)=>addDays(td,i-6)).map(d=>Object.assign({d},day(d)));
  const wk=L.filter(x=>x.d>=ws&&x.d<=addDays(ws,6)),wn=wk.filter(x=>x.f).length,wmin=Math.round(wk.reduce((a,x)=>a+x.s,0)/60),wm=wk.reduce((a,x)=>a+(x.m||0),0);
  const bk={};wk.forEach(x=>{const o=bk[x.k]=bk[x.k]||{n:0,min:0};if(x.f)o.n++;o.min+=x.s/60});
  const mx=Math.max(1,...days.map(x=>x.min));
  return {t,days,wn,wmin,wm,bk,mx}}
function pDraw88(){if(!(sheetCtx&&sheetCtx.pomo88)||$('sheet').hidden)return;const y=$('sheetC').scrollTop;pOpen88(true);$('sheetC').scrollTop=y}
function pOpen88(redraw){
  if(!redraw)sheetCtx={pomo88:1};
  const g=pget88(),S=pStats88();let body='';
  if(PM88){
    const w=PM88.phase==='work',rem=PM88.dur-pEl88();
    if(PM88.hold)body=`<div class="p88run"><div class="p88big">${w?'🍅 끝!':'☕ 끝!'}</div><p class="small muted">${esc(PM88.kind)} · 오늘 ${PM88.n||0}번째</p>
      <div class="row p88act">${w?`<button type="button" class="btn go" data-p88="brk">☕ 쉬는 ${g.b}분</button><button type="button" class="btn ghost" data-p88="next">바로 다음 ${g.w}분</button>`:`<button type="button" class="btn go" data-p88="next">▶ 다음 ${g.w}분</button>`}<button type="button" class="btn ghost" data-p88="end">여기까지</button></div></div>`;
    else if(PSTOP88){const el=pEl88(),mins=Math.round(el/60000);
      body=`<div class="p88run"><div class="p88big small">지금까지 ${mins}분</div><p class="small muted">${g.w}분을 못 채우고 그만둬요. 어떻게 할까요?</p>
        <div class="stack p88act"><button type="button" class="btn go" data-p88="rec">✓ ${mins}분 기록하고 그만두기</button><button type="button" class="btn ghost" data-p88="norec">🗑 기록 안 하고 그만두기</button><button type="button" class="btn ghost" data-p88="cancelstop">← 계속하기</button></div>
        <p class="tiny muted">기록하면 통계에 시간만 들어가요 (구슬은 ${g.w}분을 채울 때만).</p></div>`}
    else body=`<div class="p88run"><div class="p88lab">${w?'🍅 '+esc(PM88.kind):'☕ 쉬는 시간'}${PM88.run?'':' · ⏸ 일시정지'}</div><div class="p88big" id="p88time" aria-live="off">${pFmt88(rem)}</div>
      <div class="p88barw"><div class="p88bar" id="p88bar" style="width:${Math.min(100,pEl88()/PM88.dur*100)}%"></div></div><p class="tiny muted">지난 시간 <span id="p88el">${pFmt88(pEl88())}</span> · 오늘 ${PM88.n||0}번 채움</p>
      <div class="row p88act">${PM88.run?'<button type="button" class="btn" data-p88="pause">⏸ 일시정지</button>':'<button type="button" class="btn go" data-p88="resume">▶ 계속</button>'}
      ${w?'<button type="button" class="btn ghost" data-p88="stop">■ 그만두기</button>':'<button type="button" class="btn ghost" data-p88="next">쉬기 건너뛰고 다음 '+g.w+'분</button><button type="button" class="btn ghost" data-p88="end">끝내기</button>'}</div></div>`;
  }else{
    const kid=(sheetCtx&&sheetCtx.p88k)||g.kinds[0].id,k=g.kinds.find(z=>z.id===kid)||g.kinds[0],jm=pJar88(k);
    if(sheetCtx)sheetCtx.p88k=k.id;
    const opts=(C.jars||[]).flatMap(j=>(j.types||[]).map(t=>`<option value="${j.id}|${t.id}" ${jm&&jm.jar===j.id&&jm.mt===t.id?'selected':''}>${esc(j.name)} · ${esc(t.name)}</option>`)).join('');
    body=`<div class="p88set"><div class="p88kinds" role="group" aria-label="무엇을 할까요">${g.kinds.map((z,i)=>`<span class="p88k"><button type="button" class="chipbtn" data-p88k="${z.id}" aria-pressed="${z.id===k.id}">${esc(z.name)}</button>${i>1?`<button type="button" class="p88kx" data-p88="delkind:${z.id}" aria-label="${esc(z.name)} 종류 지우기">×</button>`:''}</span>`).join('')}
      <form class="p88add" data-p88form="1"><input maxlength="14" placeholder="＋ 종류" aria-label="새 종류 이름" data-p88new="1"><button type="submit" class="btn ghost sm">추가</button></form></div>
      <label class="small p88jar">🔮 구슬 <select data-p88jar="${k.id}"><option value="" ${jm?'':'selected'}>구슬 없음 (시간만 기록)</option>${opts}</select></label>
      <p class="tiny muted" style="margin:0">${g.w}분을 채울 때마다 구슬 하나 · 끝나면 ${g.b}분 쉬어요${jm?'':' · 이 종류는 병이 안 이어져 있어요(병 편집에서 병을 만들 수 있어요)'}</p>
      <button type="button" class="btn go p88start" data-p88="start">▶ ${esc(k.name)} 시작</button></div>`;
  }
  const rows=[...g.log].reverse().slice(0,6).map(r=>`<li><span>${r.d.slice(5).replace('-','/')} · ${esc(r.k)} ${Math.round(r.s/60)}분${r.f?' ✓':' (중간까지)'}${r.m?' 🔮':''}</span><button type="button" class="p88kx" data-p88="dellog:${r.id}" aria-label="이 기록 지우기">×</button></li>`).join('');
  const bks=Object.keys(S.bk).map(k=>`<li><span>${esc(k)}</span><b>${S.bk[k].n}번 · ${Math.round(S.bk[k].min)}분</b></li>`).join('');
  const stats=`<div class="p88sum"><span>오늘 <b>${S.t.n}</b>번 · ${S.t.min}분</span><span>이번 주 <b>${S.wn}</b>번 · ${S.wmin}분${S.wm?` · 🔮${S.wm}`:''}</span></div>
    <details class="p88d"><summary>📊 통계 · 기록</summary>
      <div class="p88days" role="img" aria-label="최근 7일 분">${S.days.map(x=>`<div class="p88dc"><span class="p88n">${x.min||''}</span><div class="p88col"><i style="height:${Math.round(x.min/S.mx*100)}%"></i></div><span class="p88w">${'일월화수목금토'[dowOf(x.d)]}</span></div>`).join('')}</div>
      ${bks?`<p class="tiny muted" style="margin:6px 0 2px">이번 주 종류별</p><ul class="p88ul">${bks}</ul>`:''}
      ${rows?`<p class="tiny muted" style="margin:6px 0 2px">최근 기록 (잘못 든 건 ×로 지워요)</p><ul class="p88ul">${rows}</ul>`:'<p class="tiny muted">아직 기록이 없어요.</p>'}
    </details>
    <details class="p88d"><summary>⚙ 설정</summary><div class="p88cfg">
      <label>집중 <select data-p88cfg="w">${[15,20,25,30,40,50].map(v=>`<option ${v===g.w?'selected':''} value="${v}">${v}분</option>`).join('')}</select></label>
      <label>쉬기 <select data-p88cfg="b">${[3,5,10,15].map(v=>`<option ${v===g.b?'selected':''} value="${v}">${v}분</option>`).join('')}</select></label>
      <label class="row" style="gap:6px"><input type="checkbox" data-p88cfg="snd" ${g.snd?'checked':''} style="width:auto"> 소리·진동 알람</label>
      <p class="tiny muted" style="margin:0">알림 팝업은 어느 화면에서든 떠요. 브라우저 알림을 허용하면 다른 탭에 있을 때도 알려 줘요${('Notification' in window)?` (지금: ${Notification.permission==='granted'?'허용':Notification.permission==='denied'?'차단됨':'아직 안 물어봄 — 시작을 누르면 물어봐요'})`:''}.</p></div></details>`;
  openSheet(`<div class="sh"><h3>🍅 뽀모도로</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>${body}${stats}`)}
addEventListener('click',e=>{
  const T=e.target;let b;
  if((b=T.closest('#pomoBtn88,#pomoFab88'))){e.preventDefault();e.stopPropagation();pOpen88();return}
  if((b=T.closest('[data-p88k]'))){e.preventDefault();e.stopPropagation();sheetCtx.p88k=b.dataset.p88k;pOpen88(true);return}
  if((b=T.closest('[data-p88]'))){e.preventDefault();e.stopPropagation();const a=b.dataset.p88;
    if(a==='start'){const g=pget88(),k=g.kinds.find(z=>z.id===(sheetCtx&&sheetCtx.p88k))||g.kinds[0];pAudioUnlock88();pStart88(k,'work');return}
    if(a.startsWith('delkind:')){const c=pset88(),id=a.slice(8);c.kinds=c.kinds.filter(z=>z.id!==id);if(sheetCtx&&sheetCtx.p88k===id)sheetCtx.p88k=c.kinds[0].id;save('config');pOpen88(true);return}
    if(a.startsWith('dellog:')){const c=pset88(),id=a.slice(7);c.log=c.log.filter(r=>r.id!==id);save('config');pOpen88(true);return}
    pAudioUnlock88();pAct88(a);return}
},true);
addEventListener('submit',e=>{const f=e.target.closest&&e.target.closest('[data-p88form]');if(!f)return;e.preventDefault();e.stopPropagation();
  const i=f.querySelector('[data-p88new]'),v=(i.value||'').trim();if(!v)return;const c=pset88();
  if(!c.kinds.some(z=>z.name===v))c.kinds.push({id:'k'+Date.now().toString(36),name:v});
  sheetCtx.p88k=c.kinds.find(z=>z.name===v).id;save('config');pOpen88(true)},true);
addEventListener('change',e=>{const s=e.target;if(!s||!s.dataset)return;
  if(s.dataset.p88jar!=null){e.stopPropagation();const c=pset88(),k=c.kinds.find(z=>z.id===s.dataset.p88jar);if(!k)return;
    if(!s.value){k.jar='';delete k.mt}else{const[j,t]=s.value.split('|');k.jar=j;k.mt=t}save('config');pOpen88(true);return}
  if(s.dataset.p88cfg){e.stopPropagation();const c=pset88(),n=s.dataset.p88cfg;
    if(n==='snd')c.snd=s.checked;else c[n]=+s.value;save('config');pOpen88(true)}},true);
addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target&&e.target.dataset&&e.target.dataset.p88new){e.preventDefault();e.stopPropagation();const f=e.target.closest('form');if(f&&!e.isComposing&&f.requestSubmit)f.requestSubmit()}},true);
try{pBtn88();pTick88(true);if(PM88&&PM88.hold)pPop88()}catch(e){console.error(e)}

F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['🍅 뽀모도로','맨 위 🍅 단추','집중 시간(기본 25분)을 재고 끝나면 소리·팝업·알림으로 알려요. 일시정지, 쉬는 5분, 그만두기(여기까지 기록 / 기록 안 함)가 있고 채울 때마다 구슬이 들어가요. 통계는 패널 아래 📊.'],
  ['🗓 캘린더 첫 칸','설정 → 규칙','캘린더 첫 칸(일/월)은 보기만 바꿔요. 마감·주 N회 횟수·주간 보스는 한 주의 시작(월요일) 기준이에요.']])}})(F67);
