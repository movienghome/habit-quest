/* ================= v7.6: 관리 나누기(F11·F7) · 시간표 = 하루 예산 · 루틴이 스스로 배우기 · 폰 할 일 ↔ 캘린더(I1) =================
   맨 끝 모듈(w75 뒤, route();boot(); 앞).
   1) 관리 = 반복 할 일에 t.care76 표시. 할 일 목록·홈 오늘·캘린더 종일 칸·서랍에서 빠지고, 홈/오늘 목록의 '관리 줄'(칩)과 🧽 관리 목록에만.
      늦어도 ☠ 없음('때 지남 n일'). n일마다 반복은 '한 날부터 n일 뒤'로 다음 차례.
      일퀘 할 일(t.quest, 루틴 머리 제외)도 같이 빠지고 같은 줄에 칩으로(C.care76.q===0이면 예전처럼 목록에).
   2) 관리 블록 = 날마다 하나씩 있는 진짜 할 일(id 'cb76_날짜', t.cb76). 캘린더에서만 보이고, 누르면 그날 차례인 관리. 차례가 다 끝나면 지워짐.
   3) 하루 예산 = 캘린더 날짜 머리에 '놓은 시간/쓸 수 있는 시간'(C.bud76 = {h:기본, d:{날짜:시간}}).
   4) 루틴 배우기 = 타이머로 돈 단계의 실제 시간·건너뜀을 r.steps[i].h76(최근 6번)에 모아, 끝난 뒤 한 번 물음. */

/* ---- 0) 공통 ---- */
var HIDE76=0,CB76=0,AUTO76=0;
function cfg76(){if(!C.care76||typeof C.care76!=='object'||Array.isArray(C.care76))C.care76={};return C.care76}
function gk76(){const p=MODE68;MODE68='game';try{return dateKey()}finally{MODE68=p}}
function isCare76(t){return !!(t&&t.care76&&t.rep&&t.rep.f&&!t.rid&&!t.cb76&&!isStep62(t))}
function qHide76(t){return !!(t&&t.quest&&!t.care76&&t.rep&&t.rep.f&&!t.rid&&!isStep62(t)&&cfg76().q!==0)}
function hid76(t){return !!(t&&t.status===0&&(isCare76(t)||qHide76(t)))}
function careAll76(){return Object.values(TASKS).filter(t=>t.status===0&&isCare76(t))}
function careDue76(k){k=k||midKey68();return careAll76().filter(t=>t.due&&t.due<=k).sort((a,b)=>String(a.due).localeCompare(String(b.due))||(a.order||0)-(b.order||0))}
function questDue76(){const k=gk76();return Object.values(TASKS).filter(t=>t.status===0&&qHide76(t)&&t.due&&t.due<=k).sort((a,b)=>(a.order||0)-(b.order||0))}
function careCand76(){return Object.values(TASKS).filter(t=>t.status===0&&t.rep&&t.rep.f&&!t.care76&&!t.quest&&!t.rid&&!t.cb76&&!isStep62(t))}
function late76(t,k){const n=t.due?diffDays(k||midKey68(),t.due):0;return n>0?n:0}
function when76(t,k){k=k||midKey68();if(!t.due)return '';const n=diffDays(t.due,k);return n<0?`때 지남 ${-n}일`:n===0?'오늘':n===1?'내일':`${n}일 뒤`}

/* ---- 1) 관리로 표시·빼기 ---- */
function setCare76(t,on){if(!t)return;
  if(on){t.care76=1;if(t.time){t.ct76=t.time;t.time=null}delete t.skull}
  else{delete t.care76;if(t.ct76){if(!t.time)t.time=t.ct76;delete t.ct76}}
  saveTask(t)}
function careToggle76(t){if(!t)return;const on=!t.care76;
  if(on&&!(t.rep&&t.rep.f)){toast('관리는 반복 할 일만 돼요 · 먼저 반복(며칠마다)을 정해요');return}
  setCare76(t,on);cfg76().seen=1;if(on&&cfg76().blk==null)cfg76().blk=30;save('config');render();
  toastAct(on?`🧽 '${t.title}' 관리로 옮겼어요 · 할 일 목록·캘린더 종일 칸에서 빠져요`:`'${t.title}' 관리에서 뺐어요 · 다시 할 일 목록에`,'되돌리기',()=>{setCare76(t,!on);render()})}
function carePick76(){const c=careCand76();if(!c.length){toast('옮길 반복 할 일이 없어요 · 할 일에 반복(며칠마다)을 먼저 정해요');return}
  openPicker61({title:'🧽 관리로 옮길 것 (집안일·몸 돌봄처럼 때 되면 하는 것)',multi:true,tabs:[{k:'task',label:'📋 반복 할 일',
    items:c.sort((a,b)=>String(a.title).localeCompare(String(b.title),'ko')).map(t=>({id:t.id,label:t.title,sub:repLabel(t.rep)+(t.time?' · '+t.time:''),grp:listName(t.list||'inbox')}))}],
    onPick:sel=>{let n=0;sel.forEach(({id})=>{const t=TASKS[id];if(t&&t.rep&&t.rep.f){setCare76(t,true);n++}});cfg76().seen=1;if(n&&cfg76().blk==null)cfg76().blk=30;save('config');render();
      if(n)toast(`🧽 ${n}개를 관리로 옮겼어요 · 홈 '오늘' 칸 맨 아래 관리 줄에서 체크해요`)}})}
// 우클릭 메뉴
menu61=(function(prev){return function(x,y,title,items){try{const t=MT65;if(t&&t.status===0&&!t.rid&&!t.cb76&&!isStep62(t)&&Array.isArray(items)){items=items.slice();
    const i=items.findIndex(it=>it&&typeof it.l==='string'&&/^☑ 일퀘/.test(it.l));
    items.splice(i<0?items.length:i+1,0,{l:t.care76?'🧽 관리에서 빼기 (할 일 목록으로)':'🧽 관리로 (오늘 목록·캘린더에서 빼기)',f:(ev)=>{try{if(typeof LP77==='object'&&LP77)lastPt=LP77}catch(e){}careToggle76(t)}})}}catch(e){console.error(e)}
  return prev.call(this,x,y,title,items)}})(menu61);

/* ---- 2) 거르기: 목록 · 홈 오늘 · 서랍 · 캘린더 ---- */
try{if(!SMART.some(x=>x[0]==='care'))SMART.push(['care','🧽 관리'])}catch(e){}
taskMatches=(function(prev){return function(t,sel){
  if(t&&t.cb76)return false;
  if(sel==='care')return !!(t&&t.status===0&&(isCare76(t)||qHide76(t)));
  if(sel!=='done'&&hid76(t))return false;
  return prev.apply(this,arguments)}})(taskMatches);
// openTasks: 관리 블록은 캘린더(tasksOn) 말고는 어디에도 안 보임. HIDE76=1 숨김 전부 빼기 · 2 시각 없는 것만 빼기(시간표에 놓은 건 그대로)
openTasks=(function(prev){return function(){let a=prev.apply(this,arguments);
  if(!CB76)a=a.filter(t=>!t.cb76);
  if(HIDE76)a=a.filter(t=>!hid76(t)||(HIDE76===2&&!!t.time));
  return a}})(openTasks);
function scope76(fn,h,cb){return function(){const ph=HIDE76,pc=CB76;if(h)HIDE76=h;if(cb)CB76=1;try{return fn.apply(this,arguments)}finally{HIDE76=ph;CB76=pc}}}
tasksOn=scope76(tasksOn,2,1);
renderTray=scope76(renderTray,1,0);
renderHomeV5=(function(prev){const f=scope76(prev,1,0);return function(){const x=f.apply(this,arguments);try{careHome76()}catch(e){console.error(e)}return x}})(renderHomeV5);
renderCal=(function(prev){const f=scope76(prev,2,0);return function(){const x=f.apply(this,arguments);try{calAfter76()}catch(e){console.error(e)}return x}})(renderCal);
renderTasks=(function(prev){return function(){const x=prev.apply(this,arguments);try{careTasks76()}catch(e){console.error(e)}return x}})(renderTasks);

// ☠ 없음 · n일마다 = 한 날부터 n일 뒤
saveTask=(function(prev){return function(t){try{if(t&&t.care76&&t.skull)delete t.skull}catch(e){}return prev.apply(this,arguments)}})(saveTask);
completeTask=(function(prev){return function(t,ctx){
  if(t&&t.cb76){careSheet76(t.due);return}
  const fl=isCare76(t)&&t.status===0,pre=fl?t.due:null;
  const x=prev.apply(this,arguments);
  // 관리 = '한 날'부터 다시 셈. 새벽(점수 날짜는 어제)에 해도 오늘 한 것으로.
  try{if(fl&&t.status===0&&t.last&&t.due!==pre){const base=t.last===gk76()?midKey68():t.last;let nd=t.due;
    if(t.rep.f==='d')nd=addDays(base,+t.rep.i||1);else{let g=0;while(nd&&nd<=base&&g++<60)nd=nextDue(t.rep,nd)}
    if(nd&&nd!==t.due&&(!t.rep.until||nd<=t.rep.until)){t.due=nd;saveTask(t)}}}catch(e){console.error(e)}
  return x}})(completeTask);
// 고침: 일퀘·루틴 할 일을 '놓친 날 → 오늘'로 넘기는 처리는 늘 점수 날짜(새벽 5시)로. 새벽에 캘린더에서 끌어 놓으면 자정 날짜로 계산돼 일퀘 할 일이 내일로 넘어가던 것.
try{rollQ60=(function(prev){return function(){const p=MODE68;MODE68='game';try{return prev.apply(this,arguments)}finally{MODE68=p}}})(rollQ60)}catch(e){}
// 고침: 루틴 머리 밑 '✓ 오늘 한 단계' 칩도 점수 날짜로(새벽엔 방금 한 단계가 칩으로 안 남던 것).
try{dn75=(function(prev){return function(){const p=MODE68;MODE68='game';try{return prev.apply(this,arguments)}finally{MODE68=p}}})(dn75)}catch(e){}
openTaskSheet=(function(prev){return function(id){const t=TASKS[id];if(t&&t.cb76){careSheet76(t.due);return}return prev.apply(this,arguments)}})(openTaskSheet);

/* ---- 3) 관리 줄(칩) ---- */
function chip76(t,k,q){const n=q?0:late76(t,k);
  return `<span class="c76c ${n?'late':''} ${q?'q':''}"><button type="button" class="tchk" data-tdone="${t.id}" aria-label="${esc(t.title)} 했어요"></button><span class="c76n" data-ctask="${t.id}" role="button" tabindex="0" title="${esc(t.title)} · ${q?'일퀘':esc(repLabel(t.rep))+(n?' · 때 지남 '+n+'일':'')} (눌러서 열기)">${q?'☑ ':''}${esc(t.title)}${n?` <small>⏳${n}일</small>`:''}</span></span>`}
function careRow76(){const k=midKey68(),all=careAll76(),due=careDue76(k),qs=questDue76(),c=cfg76();
  if(!all.length&&!qs.length){const n=careCand76().length;if(c.seen||!n||!tasksReady)return '';
    return `<div class="care76 hint"><span>🧽 반복 할 일 ${n}개 — 집안일·몸 돌봄 같은 <b>관리</b>는 따로 두면 목록·캘린더가 가벼워져요</span><button type="button" class="btn sm" data-c76pick="1">고르기</button><button type="button" class="x" data-c76x="1" aria-label="이 안내 닫기">×</button></div>`}
  const MAX=innerWidth<600?5:8,chips=[...due.map(t=>chip76(t,k,0)),...qs.map(t=>chip76(t,k,1))],more=chips.length-MAX;
  let nx='';if(!due.length&&all.length){const t=all.filter(x=>x.due).sort((a,b)=>String(a.due).localeCompare(String(b.due)))[0];nx=t?` <small class="muted">· 다음 ${esc(t.title)} ${when76(t,k)}</small>`:''}
  return `<div class="care76"><button type="button" class="c76h" data-c76open="1" title="관리 자세히 · 옮기기 · 캘린더 블록">🧽 관리${due.length?` <b>${due.length}</b>`:all.length?' ✓':''}${nx}</button>${chips.slice(0,MAX).join('')}${more>0?`<button type="button" class="c76h" data-c76open="1">+${more}</button>`:''}</div>`}
function careHome76(){const L=$('htList');if(!L)return;L.querySelectorAll('.care76').forEach(e=>e.remove());const h=careRow76();if(!h)return;
  const em=L.querySelector('.empty');if(em&&(careDue76().length||questDue76().length))em.remove();
  L.insertAdjacentHTML('beforeend',h)}
function careTasks76(){if(curView()!=='tasks')return;const L=$('tList');if(!L)return;L.querySelectorAll('.care76').forEach(e=>e.remove());const sel=(C.ui.tasks||{}).sel||'today';
  if(sel==='today'){const h=careRow76();if(!h)return;const hab=L.querySelector('.habg');if(hab)hab.insertAdjacentHTML('beforebegin',h);else{const c=[...L.children].find(e=>e.matches('details,.tdone,.cmp,.done-wrap'));if(c)c.insertAdjacentHTML('beforebegin',h);else L.insertAdjacentHTML('beforeend',h)}}
  if(sel==='care')L.insertAdjacentHTML('afterbegin',`<div class="care76 bar"><span class="small muted">때 되면 하는 것. 여기와 홈 '오늘' 칸 관리 줄에만 보여요(늦어도 ☠ 없음).</span><button type="button" class="btn sm" data-c76pick="1">＋ 관리로 옮기기</button><button type="button" class="btn ghost sm" data-c76open="1">⚙ 블록·일퀘</button></div>`)}

/* ---- 4) 관리 창 ---- */
function careSheet76(k){const td=midKey68();k=(k&&k>=td)?k:td;const c=cfg76(),due=careDue76(k),all=careAll76(),nx=all.filter(t=>!t.due||t.due>k).sort((a,b)=>String(a.due||'9').localeCompare(String(b.due||'9')));
  const row=(t,soon)=>`<div class="c76r ${late76(t,k)?'late':''}"><button type="button" class="tchk" data-tdone="${t.id}" aria-label="${esc(t.title)} 했어요"></button><span class="c76t" data-ctask="${t.id}" role="button" tabindex="0"><b>${esc(t.title)}</b><small>${esc(repLabel(t.rep))} · ${soon?when76(t,td):(late76(t,k)?'⏳ 때 지남 '+late76(t,k)+'일':k===td?'오늘 차례':dayName68(k)+' 차례')}</small></span><button type="button" class="ib" data-c76m="${t.id}" aria-label="${esc(t.title)} 더 보기" title="건너뛰기 · 관리에서 빼기">⋯</button></div>`;
  const cand=careCand76().length,qs=k===td?questDue76():[];
  sheetCtx={c76:k};
  openSheet(`<div class="sh"><h3>🧽 관리${k!==td?' · '+dayName68(k):''} · 차례 ${due.length}개</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    ${due.length?`<div class="c76l">${due.map(t=>row(t,0)).join('')}</div>`:`<div class="empty">${all.length?'차례인 관리가 없어요 ✓':'아직 관리로 옮긴 게 없어요.'}</div>`}
    ${qs.length?`<div class="c76g">☑ 일퀘 할 일 ${qs.length}개</div><div class="c76l">${qs.map(t=>`<div class="c76r"><button type="button" class="tchk" data-tdone="${t.id}" aria-label="${esc(t.title)} 했어요"></button><span class="c76t" data-ctask="${t.id}" role="button" tabindex="0"><b>${esc(t.title)}</b><small>${esc(repLabel(t.rep))} · 일퀘</small></span></div>`).join('')}</div>`:''}
    ${nx.length?`<details class="c76d"${due.length?'':' open'}><summary>다음 차례 ${nx.length}개 <small class="muted">· 미리 해도 돼요</small></summary><div class="c76l">${nx.slice(0,30).map(t=>row(t,1)).join('')}</div></details>`:''}
    <div class="row c76o"><button type="button" class="btn sm" data-c76pick="1"${cand?'':' disabled'}>＋ 관리로 옮기기${cand?` (반복 할 일 ${cand}개)`:''}</button><button type="button" class="btn ghost sm" data-c76list="1">📋 전체 목록</button></div>
    <div class="row c76o"><span class="small">🗓 캘린더 관리 블록</span><span class="seg3 sm">${[[0,'없음'],[30,'30분'],[60,'1시간']].map(([v,l])=>`<button type="button" data-c76blk="${v}" aria-pressed="${(+c.blk||0)===v}">${l}</button>`).join('')}</span></div>
    <label class="row small c76o"><input type="checkbox" data-c76q="1" ${c.q!==0?'checked':''} style="width:auto"> ☑ 일퀘 할 일도 목록·종일 칸에서 빼고 관리 줄에 칩으로</label>
    <p class="help" style="margin:6px 0 0">관리 = 반복 할 일 중 🧽 표시한 것. 할 일 목록·캘린더 종일 칸에 안 뜨고, 늦어도 ☠ 없이 '때 지남'으로만 보여요. 'n일마다'는 한 날부터 다시 세요. 블록을 켜면 차례가 있는 날 종일 칸에 <b>🧽 관리</b> 하나가 생겨요 — 시간표에 끌어다 놓으면 그 시간이 관리 시간.</p>`)}
function careMenu76(t,x,y){menu61(x,y,`🧽 ${esc(t.title.length>22?t.title.slice(0,22)+'…':t.title)}`,[
  {l:'✎ 열기 (반복·점수 고치기)',f:()=>openTaskSheet(t.id)},
  {l:'⏭ 이번엔 건너뛰기 (다음 차례로)',dis:!(t.due&&t.due<=midKey68()),f:()=>skipToday61(t)},
  '-',{l:'🧽 관리에서 빼기 (할 일 목록으로)',f:()=>careToggle76(t)}])}
addEventListener('click',e=>{const T=e.target;if(!T||!T.closest)return;let b;
  if((b=T.closest('[data-c76open]'))){e.preventDefault();e.stopPropagation();lastPt={x:e.clientX,y:e.clientY};careSheet76();return}
  if((b=T.closest('[data-c76pick]'))){e.preventDefault();e.stopPropagation();carePick76();return}
  if((b=T.closest('[data-c76x]'))){e.preventDefault();e.stopPropagation();cfg76().seen=1;save('config');render();return}
  if((b=T.closest('[data-c76list]'))){e.preventDefault();e.stopPropagation();closeSheet();C.ui.tasks.sel='care';save('config');if(curView()!=='tasks')location.hash='tasks';else render();return}
  if((b=T.closest('[data-c76m]'))){e.preventDefault();e.stopPropagation();const t=TASKS[b.dataset.c76m];if(t)careMenu76(t,e.clientX,e.clientY);return}
  if((b=T.closest('[data-c76blk]'))){e.preventDefault();e.stopPropagation();const v=+b.dataset.c76blk||0,c=cfg76();c.blk=v;if(v){c.no=[];Object.values(TASKS).forEach(t=>{if(t.cb76&&t.status===0&&(+t.dur||0)!==v&&!t.time){t.dur=v;saveTask(t)}})}else blkClear76();save('config');render();
    toast(v?`🗓 관리 블록 ${v===60?'1시간':'30분'} · 차례가 있는 날 종일 칸에 생겨요(시간표에 끌어다 놓기)`:'관리 블록을 껐어요');return}
},true);
addEventListener('change',e=>{const b=e.target&&e.target.closest&&e.target.closest('[data-c76q]');if(!b)return;e.stopPropagation();cfg76().q=b.checked?1:0;save('config');render();toast(b.checked?'☑ 일퀘 할 일은 관리 줄에 칩으로만':'☑ 일퀘 할 일을 다시 할 일 목록에 보여요')},true);
addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target&&e.target.matches&&e.target.matches('.c76n,.c76t')){e.preventDefault();openTaskSheet(e.target.dataset.ctask)}});

/* ---- 5) 캘린더 관리 블록 ---- */
function blkClear76(){AUTO76=1;try{Object.values(TASKS).forEach(t=>{if(t.cb76)deleteTask(t.id)})}finally{AUTO76=0}}
function blkEnsure76(){const c=C.care76;if(!c||typeof ready==='undefined'||!ready||!ready72()||typeof tasksReady==='undefined'||!tasksReady||!tOK64())return;
  const td=midKey68();let any=false;AUTO76=1;
  try{
    Object.values(TASKS).forEach(t=>{if(!t.cb76)return;any=true;
      if(!c.blk||!t.due||t.due<td||t.status!==0||(t.due===td&&!careDue76(td).length))deleteTask(t.id)});   // 지난 날 · 끔 · 오늘 차례를 다 끝냄
    if(!c.blk)return;
    if(Array.isArray(c.no)&&c.no.some(k=>k<td)){c.no=c.no.filter(k=>k>=td);save('config')}
    for(let i=0;i<3;i++){const k=addDays(td,i),id='cb76_'+k;if(TASKS[id]||(c.no||[]).includes(k)||!careDue76(k).length)continue;
      const t=newTask({title:'🧽 관리',due:k,dur:+c.blk||30});t.id=id;t.cb76=1;t.dupok65=1;saveTask(t)}
  }finally{AUTO76=0}}
deleteTask=(function(prev){return function(id){try{const t=TASKS[id];if(t&&t.cb76&&!AUTO76&&t.due){const c=cfg76();c.no=[...new Set([...(c.no||[]),t.due])];save('config')}}catch(e){}return prev.apply(this,arguments)}})(deleteTask);
render=(function(prev){return function(){try{blkEnsure76()}catch(e){console.error(e)}const x=prev.apply(this,arguments);
  try{if(sheetCtx&&sheetCtx.c76&&!$('sheet').hidden)careSheet76(sheetCtx.c76);if(sheetCtx&&sheetCtx.b76&&!$('sheet').hidden)budSheet76(sheetCtx.b76);nav76()}catch(e){console.error(e)}return x}})(render);

/* ---- 6) 시간표 = 하루 예산 ---- */
function bud76(){if(!C.bud76||typeof C.bud76!=='object'||Array.isArray(C.bud76))C.bud76={h:8,d:{}};if(!C.bud76.d||typeof C.bud76.d!=='object')C.bud76.d={};if(!(+C.bud76.h>0))C.bud76.h=8;return C.bud76}
function budOf76(k){const b=bud76();return b.d[k]!=null?+b.d[k]:+b.h}
function placed76(k){let m=0;tasksOn(k).forEach(t=>{if(t.time&&t.status===0)m+=(+t.dur||30)});return m}
function loose76(k){const a=tasksOn(k).filter(t=>!t.time&&t.status===0&&!t.cb76);return {n:a.length,m:a.reduce((s,t)=>s+(+t.dur||0),0),nd:a.filter(t=>!t.dur).length}}
function hm76(m){const h=Math.floor(m/60),r=m%60;return h?(r?`${h}:${String(r).padStart(2,'0')}`:`${h}h`):`${r}분`}
function hmK76(m){const h=Math.floor(m/60),r=m%60;return (h?h+'시간':'')+(r?(h?' ':'')+r+'분':'')||'0분'}
function calAfter76(){const pane=$('calPane');if(!pane)return;const td=midKey68();
  if(bud76().off!==1)pane.querySelectorAll('.dh[data-calday]').forEach(h=>{const k=h.dataset.calday;if(k<td||h.querySelector('.bud76'))return;const m=placed76(k);if(!m)return;const B=budOf76(k)*60,over=m>B;
    h.insertAdjacentHTML('beforeend',`<button type="button" class="bud76 ${over?'over':''}" data-bud76="${k}" title="놓은 시간 ${hmK76(m)} / 쓸 수 있는 시간 ${hmK76(B)}${over?' — '+hmK76(m-B)+' 넘침':''} · 눌러서 바꾸기" aria-label="${dayName68(k)} 놓은 시간 ${hmK76(m)}, 쓸 수 있는 시간 ${hmK76(B)}${over?', 넘침':''}">${over?'⚠':''}${hm76(m)}<small>/${+(B/60).toFixed(1)}h</small></button>`)});
  // 관리 블록에 그날 차례 개수
  pane.querySelectorAll('[data-ctask^="cb76_"]').forEach(el=>{const t=TASKS[el.dataset.ctask];if(!t||el.querySelector('.n76'))return;const n=careDue76(t.due>td?t.due:td).length;el.classList.add('cb76');
    if(el.classList.contains('cchip'))el.innerHTML=`🧽 <b class="n76">${n}</b><span class="t76"> 관리</span>`;else (el.querySelector('.bt')||el).insertAdjacentHTML('beforeend',` <b class="n76">${n}</b>`)});
  // I1: 좁은 화면 캘린더 → 할 일
  const bar=pane.querySelector('.calbar2');if(bar){let b=$('c76tasks');if(!b){b=document.createElement('button');b.id='c76tasks';b.type='button';b.className='ib';b.textContent='📋';b.title='할 일 목록으로';b.setAttribute('aria-label','할 일 목록으로');bar.insertBefore(b,bar.firstChild)}b.hidden=splitOn()||innerWidth>=1200}}
function budSheet76(k){const b=bud76(),m=placed76(k),B=budOf76(k),L=loose76(k),own=b.d[k]!=null,over=m>B*60;
  sheetCtx={b76:k};
  const st=(key,v)=>`<span class="st76"><button type="button" class="ib" data-b76="${key}:-0.5" aria-label="30분 줄이기">−</button><b>${+v}시간</b><button type="button" class="ib" data-b76="${key}:0.5" aria-label="30분 늘리기">＋</button></span>`;
  openSheet(`<div class="sh"><h3>⏱ ${dayName68(k)} 하루 예산</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <p style="margin:0 0 6px"><b>${over?'⚠ ':''}놓은 시간 ${hmK76(m)}</b> / 쓸 수 있는 시간 ${hmK76(B*60)}${over?` — <b>${hmK76(m-B*60)} 넘쳐요</b>`:m?` · ${hmK76(B*60-m)} 남음`:''}</p>
    <div class="track"><div class="fill ${over?'bad':'gold'}" style="width:${Math.min(100,B?m/(B*60)*100:100)}%"></div></div>
    ${L.n?`<p class="small muted" style="margin:6px 0 0">아직 안 놓은 것 ${L.n}개${L.m?` (약 ${hmK76(L.m)}${L.nd?' + 시간 안 정한 '+L.nd+'개':''})`:''}${L.m&&m+L.m>B*60?` — 다 놓으면 ${hmK76(m+L.m-B*60)} 넘쳐요. 핵심만 놓고 나머지는 다른 날로.`:''}</p>`:''}
    <div class="row c76o"><span class="small">이 날만</span>${st('d',B)}${own?'<button type="button" class="linkbtn" data-b76="d:x">기본으로</button>':''}</div>
    <div class="row c76o"><span class="small">매일 기본</span>${st('h',b.h)}</div>
    <p class="help" style="margin:6px 0 0">시간표에 놓은 블록의 길이를 다 더한 값이에요(시간 안 정한 블록은 30분). '쓸 수 있는 시간'은 일정·이동·식사를 빼고 실제로 할 일에 쓸 수 있는 시간으로 잡아요. 넘치면 ⚠ — 다 못 할 양이라는 뜻이에요. <button type="button" class="linkbtn" data-b76="off">이 표시 끄기</button></p>`)}
addEventListener('click',e=>{const T=e.target;if(!T||!T.closest)return;let b;
  if((b=T.closest('[data-bud76]'))){e.preventDefault();e.stopPropagation();lastPt={x:e.clientX,y:e.clientY};budSheet76(b.dataset.bud76);return}
  if((b=T.closest('#c76tasks'))){e.preventDefault();e.stopPropagation();location.hash='tasks';return}
  if((b=T.closest('#t76cal'))){e.preventDefault();e.stopPropagation();location.hash='cal';return}
  if((b=T.closest('[data-b76]'))){e.preventDefault();e.stopPropagation();const k=(sheetCtx||{}).b76,B=bud76(),[key,v]=b.dataset.b76.split(':');
    if(key==='off'){B.off=1;save('config');closeSheet();ui.calKeepScroll=true;render();toastAct('하루 예산 표시를 껐어요','되돌리기',()=>{delete B.off;save('config');render()});return}
    if(!k)return;const cl=x=>Math.max(.5,Math.min(18,Math.round(x*2)/2));
    if(key==='d'){if(v==='x')delete B.d[k];else B.d[k]=cl(budOf76(k)+(+v))}
    if(key==='h')B.h=cl(+B.h+(+v));
    const td=midKey68();Object.keys(B.d).forEach(x=>{if(x<td)delete B.d[x]});
    save('config');ui.calKeepScroll=true;render();return}
},true);

/* ---- 7) I1: 폰 할 일 화면 → 캘린더 ---- */
function nav76(){const old=$('t76cal');if(splitOn()){if(old)old.remove();return}const ch=$('tChips');if(!ch||old)return;
  ch.insertAdjacentHTML('afterbegin','<button type="button" class="chipbtn" id="t76cal" title="캘린더로 (시간표 짜기)" aria-label="캘린더로">📅 캘린더</button>')}
addEventListener('resize',()=>{try{nav76();const c=$('c76tasks');if(c)c.hidden=splitOn()||innerWidth>=1200}catch(e){}});

/* ---- 8) 루틴이 스스로 배우기 ---- */
function learn76(R){const r=(C.routines||[]).find(x=>x.id===R.id);if(!r||!Array.isArray(R.log))return;let ch=false;
  R.log.forEach((l,i)=>{const s=(l.tid&&R.steps.find(x=>x.tid===l.tid))||R.steps[i];if(!s||s.tmp75)return;const j=rsOf75(r,s);if(j<0)return;const rs=r.steps[j];if(rs.aid==='@weigh')return;
    const h=Array.isArray(rs.h76)?rs.h76.slice():[];h.push(l.skip?0:Math.max(1,Math.round(+l.sec||0)));rs.h76=h.slice(-6);ch=true});
  if(!ch)return;save('config');if(tips76(r).length)later(()=>learnSheet76(r.id))}
function tips76(r){const out=[];(r.steps||[]).forEach((s,j)=>{const h=(Array.isArray(s.h76)?s.h76:[]).slice(-5);if(h.length<5)return;
    const sk=h.filter(v=>!v).length;
    if(sk>=4){if(!s.opt71&&!s.g71&&!s.no76o)out.push({k:'o',j,sk,n:h.length});return}
    const ts=h.filter(v=>v>=20);if(ts.length<4)return;const avg=Math.max(1,Math.round(ts.reduce((a,b)=>a+b,0)/ts.length/60)),min=+s.min||5;
    if(Math.abs(avg-min)>=Math.max(2,min*.3)&&!(s.no76m&&Math.abs(+s.no76m-avg)<2))out.push({k:'m',j,avg,min,n:ts.length})});
  return out.slice(0,3)}
function learnSheet76(rid){const r=(C.routines||[]).find(x=>x.id===rid);if(!r)return;const tips=tips76(r);if(!tips.length){if(sheetCtx&&sheetCtx.l76)closeSheet();return}
  sheetCtx={l76:rid};
  openSheet(`<div class="sh"><h3>🧠 '${esc(r.name)}' 실제에 맞출까요?</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <div class="c76l">${tips.map(t=>{const s=r.steps[t.j],nm=esc(stName61(s));
      return t.k==='o'?`<div class="c76r"><span class="c76t"><b>${nm}</b><small>최근 ${t.n}번 중 ${t.sk}번 건너뜀 → ◌ 선택 단계로 (빼도 완주)</small></span><button type="button" class="btn sm" data-l76="o:${t.j}:1">바꾸기</button><button type="button" class="btn ghost sm" data-l76="o:${t.j}:0">그대로</button></div>`
        :`<div class="c76r"><span class="c76t"><b>${nm}</b><small>목표 ${t.min}분, 실제 평균 ${t.avg}분 (최근 ${t.n}번) → ${t.avg}분으로</small></span><button type="button" class="btn sm" data-l76="m:${t.j}:${t.avg}">맞추기</button><button type="button" class="btn ghost sm" data-l76="m:${t.j}:0">그대로</button></div>`}).join('')}</div>
    <p class="help" style="margin:6px 0 0">타이머로 돈 기록(최근 5번)을 보고 물어요. '그대로'를 고르면 같은 건 다시 안 물어요.</p>`)}
addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('[data-l76]');if(!b)return;e.preventDefault();e.stopPropagation();
  const rid=(sheetCtx||{}).l76,r=(C.routines||[]).find(x=>x.id===rid);if(!r)return;const [k,j,v]=b.dataset.l76.split(':'),s=r.steps[+j];if(!s)return;
  if(k==='o'){if(+v){s.opt71=1;delete s.g71;toast(`◌ '${stName61(s)}' 선택 단계로 바꿨어요`)}else s.no76o=1}
  if(k==='m'){if(+v){const t=TASKS[s.tid];s.min=+v;delete s.no76m;if(t){t.dur=+v;saveTask(t)}toast(`'${stName61(s)}' 목표 ${+v}분으로 맞췄어요`)}else{const tp=tips76(r).find(x=>x.k==='m'&&x.j===+j);s.no76m=tp?tp.avg:(+s.min||5)}}
  save('config');learnSheet76(rid);if(!(sheetCtx&&sheetCtx.l76&&tips76(r).length))render()},true);
finishRoutine=(function(prev){return function(){const R=RUN;const x=prev.apply(this,arguments);
  try{if(R&&R.kind==='routine'&&R.id)learn76(R)}catch(e){console.error(e)}return x}})(finishRoutine);

/* ---- 9) 안내 ---- */
F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['🧽 관리 (할 일과 나누기)','할 일 우클릭 → 관리로 · 홈 오늘 칸 맨 아래 관리 줄 · 할 일 → 🧽 관리 목록','집안일·몸 돌봄처럼 때 되면 하는 반복 할 일을 목록·캘린더 종일 칸에서 빼고 칩 한 줄로. 늦어도 ☠ 없이 "때 지남". 일퀘 할 일도 같은 줄에',()=>{careSheet76()},'관리 집안일 청소 설거지 분리수거 반복 압도 일퀘 목록에서 빼기'],
  ['🗓 캘린더 관리 블록','관리 창 → 캘린더 관리 블록 30분·1시간','차례가 있는 날 종일 칸에 🧽 관리 블록 하나. 시간표에 끌어다 놓고, 누르면 그날 차례',()=>{careSheet76()},'관리 블록 캘린더 시간표'],
  ['⏱ 하루 예산','캘린더(1일·3일·주) 날짜 밑 숫자','시간표에 놓은 시간 / 쓸 수 있는 시간. 넘치면 ⚠. 눌러서 그날만·매일 기본 바꾸기',()=>{location.hash='cal'},'하루 예산 시간표 놓은 시간 넘침 압도'],
  ['🧠 루틴이 스스로 배우기','루틴을 타이머로 끝낸 뒤','최근 5번 기록으로 자주 건너뛴 단계 → ◌ 선택 단계, 목표와 실제 시간이 다르면 → 분 맞추기를 물어요',()=>{location.hash='tasks'},'루틴 배우기 건너뜀 실제 시간 목표 맞추기'],
  ['📅 폰: 할 일 ↔ 캘린더','할 일 화면 제목 줄 📅 · 캘린더 맨 왼쪽 📋 할 일','좁은 화면에서 할 일과 캘린더를 한 번에 오가요',()=>{location.hash='tasks'},'폰 캘린더 할 일 보기 바꾸기']])}})(F67);
