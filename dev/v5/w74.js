/* ================= v7.4: 루틴 단계 되돌리기 · 목록별 묶기 = 옆 목록 순서 · 캘린더 종일 칸 ↔ 시간표 ================= */

/* ---- 1) 루틴: 잘못 체크한 단계 되돌리기 ----
   예전엔 '오늘 한 일'의 ×(기록 지우기)밖에 길이 없었고, 루틴 체크 창에선 한 단계가 체크 고정(disabled)이라 못 풀었어요.
   이제: ① 루틴 체크 창의 한 단계 줄마다 '↶ 되돌리기' ② 오늘 한 일 줄에 '🌅 루틴 이름' 표시 + ↶ ③ 목록 루틴 머리 '오늘 n개 ↶' → 체크 창
   ④ 단계 줄의 '✓ 오늘' 누르기. 어느 길이든 removeEntry를 거치고, 그 뒤처리(완주 보너스 빼기 · 몸무게 단계 풀기 · 머리 할 일 오늘로)는
   removeEntry 감싸개(stAfter74)가 한곳에서 해요. */
function stRt74(t){const h=t&&t.parent&&TASKS[t.parent];return h&&h.rid?rtOfT62(h):null}
function wStepsOf74(r){return (r.steps||[]).filter(s=>s.aid==='@weigh'&&TASKS[s.tid])}
function stAfter74(r,D){
  const td=dateKey(),day=DAYS[D];if(!r||!day)return;const h=rtH62(r,false);let lost=0,ch=false;
  // 몸무게를 지웠으면 몸무게 단계의 '오늘 함'도 풀기 (몸무게 단계는 기록 날 t.last로 오늘 함을 셈)
  if(!day.weight&&D===td)wStepsOf74(r).forEach(s=>{const t=TASKS[s.tid];if(t&&t.last===D){t.last=null;t.cnt=Math.max(0,(t.cnt||1)-1);saveTask(t);ch=true}});
  // 완주 보너스: 이제 완주가 아니면 같이 뺌
  const fulls=(day.entries||[]).filter(e=>e.kind==='routine'&&e.rid===r.id&&e.full);
  if(fulls.length&&!rtNeed71(r,stIsDone71(r,D)).ok){
    fulls.forEach(e=>{lost+=+e.xp||0;removeEntry(D,e.id)});
    if(h){h.cnt=Math.max(0,(h.cnt||0)-fulls.length);saveTask(h)}ch=true}
  // 오늘 한 단계가 하나도 없으면 반복 루틴은 다시 오늘 몫
  if(h&&h.status===0&&h.rep&&h.rep.f&&D===td&&!rtDoneN73(r,D,true)){
    if(h.pd73&&h.pd73.d===D&&h.pd73.from){h.due=h.pd73.from;delete h.pd73;delete h.pt73;saveTask(h);ch=true}
    else if(h.due&&h.due>D&&h.last===D){h.due=D;delete h.pt73;saveTask(h);ch=true}}
  if(lost)toast(`↶ 단계를 되돌렸어요 · 완주 보너스 −${lost} XP도 뺐어요`);
  if(ch)render()}
removeEntry=(function(prev){return function(date,id){const rts=[];
  try{if(!(typeof DUP73!=='undefined'&&DUP73&&DUP73.skip)){const d=DAYS[date],e=d&&(d.entries||[]).find(x=>x.id===id);
    if(e){const t=e.tid&&TASKS[e.tid];if(t&&isStep62(t)){const r=stRt74(t);if(r)rts.push(r)}
      if(e.kind==='weigh')(C.routines||[]).forEach(r=>{if(wStepsOf74(r).length)rts.push(r)})}}}catch(x){console.error(x)}
  const res=prev.apply(this,arguments);
  try{rts.forEach(r=>stAfter74(r,date))}catch(x){console.error(x)}return res}})(removeEntry);
function stUndo74(rid,tid,D){
  const r=(C.routines||[]).find(x=>x.id===rid),t=TASKS[tid],s=r&&(r.steps||[]).find(x=>x.tid===tid);if(!r||!t||!s||!guard())return false;
  D=D||dateKey();const day=DAYS[D];if(!day)return false;
  const es=(day.entries||[]).filter(e=>s.aid==='@weigh'?e.kind==='weigh':e.tid===tid);
  if(es.length){es.forEach(e=>removeEntry(D,e.id));return true}   // removeEntry 감싸개가 뒤처리
  if(D===dateKey()&&t.last===D){t.last=null;t.cnt=Math.max(0,(t.cnt||1)-1);saveTask(t);
    if(s.aid==='@weigh'&&day.weight)commit(()=>{day.weight=null},[D]);
    stAfter74(r,D);render();toast('↶ 되돌렸어요');return true}
  return false}
function rtUndoBtns74(r){const box=$('sheetC');if(!box||!r)return;const D=RD69||dateKey();
  box.querySelectorAll('label.d64r.ok').forEach(l=>{const i=l.querySelector('[data-d64]');if(!i||l.querySelector('.u74'))return;
    l.insertAdjacentHTML('beforeend',`<button type="button" class="chipbtn u74" data-u74="${i.dataset.d64}" data-u74r="${r.id}" data-u74d="${D}" title="잘못 체크했으면 이 단계 기록을 되돌려요">↶ 되돌리기</button>`)})}
rtDone64=(function(prev){return function(r,k){const x=prev.apply(this,arguments);try{rtUndoBtns74(r)}catch(e){console.error(e)}return x}})(rtDone64);
addEventListener('click',e=>{const b=e.target.closest('[data-u74]');if(!b)return;e.preventDefault();e.stopPropagation();
  const rid=b.dataset.u74r,r=(C.routines||[]).find(x=>x.id===rid);if(!stUndo74(rid,b.dataset.u74,b.dataset.u74d)||!r)return;
  if(sheetCtx&&sheetCtx.rt64===rid)rtDone64(r,true)},true);
// 목록: 루틴 머리의 '오늘 n개' → 체크 창(거기서 되돌리기) · 단계 줄 '✓ 오늘' 누르면 되돌리기
taskRow=(function(prev){return function(t,o){let h=prev.apply(this,arguments);
  try{const r=t&&t.status===0&&rtOfT62(t);
    if(r&&C.mig62){const dn=(r.steps||[]).filter(s=>stDone62(TASKS[s.tid])).length;
      if(dn)h=h.replace(`· 오늘 ${dn}개`,`· <button type="button" class="u74h" data-u74h="${r.id}" title="오늘 한 단계 보기 · 잘못 체크한 건 되돌리기">오늘 ${dn}개 ↶</button>`)}
    else if(t&&t.status===0&&isStep62(t)&&t.last===dateKey()){const r2=stRt74(t);
      if(r2)h=h.replace('<span class="sd62">✓ 오늘</span>',`<button type="button" class="sd62 u74s" data-u74s="${t.id}" data-u74r="${r2.id}" title="눌러서 오늘 체크 되돌리기">✓ 오늘 ↶</button>`)}
  }catch(e){console.error(e)}return h}})(taskRow);
addEventListener('click',e=>{const b=e.target.closest('[data-u74h],[data-u74s]');if(!b)return;e.preventDefault();e.stopPropagation();
  if(b.dataset.u74h){const r=(C.routines||[]).find(x=>x.id===b.dataset.u74h);if(r){RD69=null;rtDone64(r)}return}
  if(stUndo74(b.dataset.u74r,b.dataset.u74s,dateKey()))return},true);
// 오늘 한 일 줄: 루틴 단계면 어느 루틴인지 + ×의 뜻
logRow=(function(prev){return function(date,e){let h=prev.apply(this,arguments);
  try{const t=e&&e.tid&&TASKS[e.tid];if(t&&isStep62(t)){const r=stRt74(t);
    if(r){h=h.replace('</span><span class="num muted tiny">',` <span class="rt74" title="루틴 단계 · 되돌리면 단계가 다시 열려요">${esc(r.name)}</span></span><span class="num muted tiny">`);
      h=h.replace(/(<button class="x" data-rm="[^"]*" data-date="[^"]*")/,'$1 title="이 단계 되돌리기"')}}}catch(x){}return h}})(logRow);

/* ---- 2) 목록별 묶기 = 옆 목록(사이드바) 순서 ----
   예전엔 할 일이 나오는 순서(날짜 정렬 결과)대로 묶여서, 옆 목록을 끌어 정한 순서와 달랐어요.
   옆 목록은 '받은함 → 목록(📁 폴더는 첫 목록 자리에 모아서)' 순서 — 같은 순서로 묶음 머리를 놓아요(묶음 안은 그대로 정렬 기준). */
function listOrder74(){const o=['inbox'],seen=new Set();
  C.lists.filter(l=>l.id!=='inbox').forEach(l=>{if(!l.folder){o.push(l.id);return}if(seen.has(l.folder))return;seen.add(l.folder);C.lists.filter(x=>x.folder===l.folder).forEach(x=>o.push(x.id))});
  return o}
function listIdx74(id,o){o=o||listOrder74();const i=o.indexOf(id||'inbox');return i<0?0:i}
function grp74(){const T=(C.ui&&C.ui.tasks)||{};if(T.group!=='list'||curView()!=='tasks')return;const L=$('tList');if(!L)return;
  const gs=[...L.children].filter(n=>n.classList&&n.classList.contains('tgroup')&&!n.classList.contains('tcomp')&&n.querySelector(':scope>.ghead[data-tgcollapse^="l"]'));
  if(gs.length<2)return;const o=listOrder74();
  const idx=g=>listIdx74(g.querySelector(':scope>.ghead').dataset.tgcollapse.slice(1),o);
  const sorted=gs.slice().sort((a,b)=>idx(a)-idx(b));if(sorted.every((g,i)=>g===gs[i]))return;
  const ph=gs.map(g=>{const c=document.createComment('');g.before(c);return c});
  gs.forEach(g=>g.remove());sorted.forEach((g,i)=>ph[i].replaceWith(g))}
renderTasks=(function(prev){return function(){const x=prev.apply(this,arguments);try{grp74()}catch(e){console.error(e)}return x}})(renderTasks);
// 캘린더 서랍도 같은 순서
function tray74(){const el=$('calTray');if(!el||el.hidden)return;const T=T66();if(ui.trayTab==='habit'||ui.trayTab==='routine'||T.g.task!=='list')return;
  const box=el.querySelector('.trayl');if(!box)return;const kids=[...box.children];if(kids.filter(n=>n.classList.contains('tgh66')).length<2)return;
  const o=listOrder74(),ni={};[{id:'inbox'},...C.lists.filter(l=>l.id!=='inbox')].forEach(l=>{const n=listName(l.id);if(!(n in ni))ni[n]=listIdx74(l.id,o)});
  const gs=[];let cur=null;kids.forEach(n=>{if(n.classList.contains('tgh66')){const nm=(n.firstElementChild||{}).textContent||'';cur={n:[n],i:nm in ni?ni[nm]:999};gs.push(cur)}else if(cur)cur.n.push(n)});
  const sorted=gs.slice().sort((a,b)=>a.i-b.i);if(sorted.every((g,i)=>g===gs[i]))return;
  box.innerHTML='';sorted.forEach(g=>g.n.forEach(n=>box.appendChild(n)))}
renderTray=(function(prev){return function(){const x=prev.apply(this,arguments);try{tray74()}catch(e){console.error(e)}return x}})(renderTray);

/* ---- 3) 캘린더 상단(종일 칸) = 시간표에 아직 안 놓은 할 일 ----
   종일 칸에 있는 건 '날짜는 있고 시각은 없는' 할 일. 끌어서 시간표(아래 칸)에 놓으면 시각이 생겨 종일 칸에서 빠지고,
   시간표의 블록을 종일 칸에 올려 놓으면 시각이 지워져 시간표에서 빠져요(다른 날 종일 칸이어도 — v7.2는 시각을 되살려서 시간표에 남았음).
   · 종일 칸 이름 밑에 안 놓은 할 일 수 · 칸 기본 높이를 6줄 정도로(예전엔 4줄이라 다섯 번째부터 안 보였어요) · 빼면 알림 '되돌리기' */
dndEnd=(function(prev){return function(x,y){let b=null;
  try{const kind=DND.kind,id=DND.id,drop=DND.drop,t=TASKS[id];
    if((kind==='task'||kind==='block')&&drop&&drop.type==='allday'&&t&&t.time)b={id,due:t.due||null,time:t.time,dur:t.dur||null,to:drop.date}}catch(e){console.error(e)}
  const r=prev.apply(this,arguments);
  try{if(b){const t=TASKS[b.id];if(t&&!t.time){const id=b.id;
    setTimeout(()=>toastAct(`'${t.title}' 시간표에서 뺐어요 (종일로 · ${b.to?dueLabel(b.to):''})`,'되돌리기',()=>{const z=TASKS[id];if(!z)return;z.due=b.due;z.time=b.time;if(b.dur)z.dur=b.dur;saveTask(z);ui.calKeepScroll=true;render();toast('시간표로 되돌렸어요')},5200),30)}}}catch(e){console.error(e)}
  return r}})(dndEnd);
function cal74(){const pane=$('calPane');if(!pane)return;const tog=pane.querySelector('.alltog');if(!tog)return;
  const n=Math.max(0,...[...pane.querySelectorAll('.tgall > div[data-drop^="allday:"]')].map(c=>c.querySelectorAll('[data-ctask]').length));
  const arrow=(tog.textContent.replace('종일','').replace(/\s*\d+\s*$/,'')).trim();
  tog.innerHTML='종일'+(n?`<span class="n74" title="시간표에 아직 안 놓은 할 일">${n}</span>`:'')+(arrow?` ${arrow}`:'')}
renderCal=(function(prev){return function(){const x=prev.apply(this,arguments);try{cal74()}catch(e){console.error(e)}return x}})(renderCal);

/* ---- 4) 안내 ---- */
F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['↶ 루틴 단계 되돌리기','루틴 체크 창 단계 줄 · 오늘 한 일 · 목록 루틴 머리 "오늘 n개"','잘못 체크한 단계를 되돌려요(완주 보너스를 받았으면 같이 빼고, 한 단계도 없으면 루틴이 다시 오늘로)',()=>{location.hash='tasks'},'루틴 단계 되돌리기 취소 잘못 체크'],
  ['📋 목록별 묶기 = 옆 목록 순서','할 일 → 묶기: 목록별 · 캘린더 서랍 묶기','묶음이 옆 목록(받은함 → 목록·📁 폴더) 순서대로 나와요',()=>{location.hash='tasks'},'묶기 목록 정렬 순서'],
  ['🗓 캘린더 상단(종일) ↔ 시간표','할 일 옆 캘린더 맨 위 종일 칸','시간표에 놓으면 종일 칸에서 빠지고, 종일 칸에 올리면 시간표에서 빠져요 · 안 놓은 개수 표시',()=>{location.hash='tasks'},'시간표 배치 종일 캘린더 상단']])}})(F67);
