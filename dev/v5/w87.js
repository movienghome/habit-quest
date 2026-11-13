/* ---- v8.8 (w87.js): J8 남은 둘 — 주 N회 합친 횟수가 차면 다음 주로 · 월 칸에 자리 그리기 ----
   ① 합친 횟수(wkCnt91: 그 주 기록 중 이 할 일 또는 같은 카드 aid) ≥ N 이면 그 주의 주 N회 할 일 due를 다음 주(ws+13)로 넘김.
      → completeTask 감쌈(roll91). 끝낸 할 일 자신은 completeTask가 제 wc로 이미 하고, 여기선 '합쳐서 찼는데 제 wc는 모자란' 경우와
        같은 카드의 다른 주 N회 할 일(하나 그리고 둘 → 시나리오)을 맞춤. 남의 할 일을 넘긴 건 e.roll91=[{id,pd,pw,to}]에 적어 두고
        기록을 지우면 undoTaskFrom 감쌈이 되돌림(그 사이 due가 바뀌었으면 안 건드림).
   ② 월 칸: spanDays71 감쌈 — 슬롯(t.sl91)이 있는 주는 기본 자리(일요일) 대신 슬롯 날에 칩(tasksOn w86과 같은 규칙: 지난 날·이미 한 날·N 채운 주는 안 그림). */
function roll91(e,date,t){
  const ws=weekStart(date),nx=addDays(ws,13),rolls=[];
  Object.values(TASKS).forEach(x=>{
    if(!wx91(x)||!(x.id===t.id||(t.aid&&x.aid===t.aid)))return;
    if(!x.due||x.due>=addDays(ws,7))return;
    if(wkCnt91(x,ws)<(+x.rep.n||3))return;
    const pd=x.due,pw=x.wc?clone(x.wc):null;
    x.due=nx;x.wc={w:addDays(ws,7),n:0};saveTask(x);
    if(x.id!==t.id)rolls.push({id:x.id,pd,pw,to:nx})});
  if(rolls.length){e.roll91=rolls;save(date)}}
let CT91=0;   // completeTask 안에서 render가 돌 때 heal91이 먼저 넘기면 되돌릴 기록(e.roll91)이 안 남으므로 그동안은 쉼
completeTask=(function(prev){return function(t,ctx){
  let day=null,before=null;
  try{day=curDay();before=new Set(day.entries||[])}catch(x){}
  let r;CT91++;try{r=prev.apply(this,arguments)}finally{CT91--}
  try{if(day&&t){const e=(day.entries||[]).find(z=>!before.has(z)&&z.tid===t.id);if(e)roll91(e,day.date,t)}}catch(x){console.error(x)}
  return r}})(completeTask);
undoTaskFrom=(function(prev){return function(e){
  const skip=typeof DUP73!=='undefined'&&DUP73&&DUP73.skip;
  const r=prev.apply(this,arguments);
  try{if(!skip&&e&&e.roll91)e.roll91.forEach(z=>{const x=TASKS[z.id];if(!x||x.due!==z.to)return;
    x.due=z.pd;if(z.pw)x.wc=z.pw;else delete x.wc;saveTask(x)})}catch(x){console.error(x)}
  return r}})(undoTaskFrom);

spanDays71=(function(prev){return function(t){
  const r=prev.apply(this,arguments);
  try{if(!wx91(t)||!t.sl91||span71(t))return r;
    const sk=Object.keys(t.sl91);if(!sk.length)return r;
    const wks=new Set(sk.map(weekStart)),td=midKey68(),N=+t.rep.n||3;
    const out=r.filter(k=>!wks.has(weekStart(k)));
    sk.sort().forEach(k=>{if(k<td||slotDoneOn91(t,k)||wkCnt91(t,weekStart(k))>=N)return;out.push(k)});
    return out}catch(x){console.error(x);return r}}})(spanDays71);

/* ③ 이미 합쳐서 찼는데 due가 이번 주에 남은 주 N회 할 일(v8.7 이전에 끝낸 것) 고쳐 주기 — 렌더 앞, 서버 확인 뒤. 값이 같게 나오는 일이라 기기마다 해도 안전(한 번 넘기면 조건이 거짓). */
let HEAL91=0;
function heal91(){if(HEAL91||CT91)return;if(typeof ready==='undefined'||!ready||typeof tasksReady==='undefined'||!tasksReady||!tOK64())return;
  HEAL91=1;try{const ws=weekStart(midKey68()),nx=addDays(ws,13);
    Object.values(TASKS).forEach(x=>{if(!wx91(x)||!x.due||x.due>=addDays(ws,7)||x.due<ws)return;
      if(wkCnt91(x,ws)<(+x.rep.n||3))return;
      x.due=nx;x.wc={w:addDays(ws,7),n:0};saveTask(x)})}catch(e){console.error(e)}finally{HEAL91=0}}
render=(function(prev){return function(){try{heal91()}catch(e){console.error(e)}return prev.apply(this,arguments)}})(render);

/* ④ 요일을 안 정한 주 N회 할 일의 마감 칩은 '· 마감 n/N'으로 — 일요일(주 시작이 일요일이면 토요일)에 뜨는 게 마감 표시임을 알림 */
function dl91(t,k){try{if(!wx91(t)||t.due!==k||t.dl91||(t.sl91&&(t.sl91[k]!==undefined||slotKeys91(t,weekStart(k)).length)))return t;
  return Object.assign({},t,{title:t.title+' · 마감 '+wkCnt91(t,weekStart(k))+'/'+(+t.rep.n||3),dl91:1})}catch(e){return t}}
tasksOn=(function(prev){return function(k){return prev.apply(this,arguments).map(t=>dl91(t,k))}})(tasksOn);
cchip=(function(prev){return function(t,k){return prev.call(this,dl91(t,k),k)}})(cchip);

F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['🔁 주 N회 다음 주로','할 일 목록·캘린더','같은 카드로 이은 할 일(예: 하나 그리고 둘)까지 합쳐서 이번 주 횟수가 N에 닿으면, 주 N회 할 일도 다음 주로 넘어가요. 월 보기에도 정해 둔 날에 칩이 떠요.']])}})(F67);
