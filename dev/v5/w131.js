/* v13.3 (w131): U3 방치 경보 정리 · U4 할 일 '오늘' 칩 한 줄 · U5 ⏩ 미루기 ☠ 칸 · U6 보이기·숨기기 둘로 */

/* ---------- U3 방치 경보: 이어진 습관·관리 줄에 꼬리표, 이어진 게 없는 것만 칸에(🧽 관리로 옮기기) ---------- */
// 지금 울리는 경보 — {키: {s:며칠째, d:경보 날수, over:넘었나}} (키 = 카드 id 또는 '@t:할 일 id'). 하루는 점수 날짜 gk76(새벽 5시) — 할 일 화면(자정 날짜)에서도 칸·꼬리표가 같은 날수
function al131(){const k=gk76(),y=addDays(k,-1),m={};
  (C.watches||[]).forEach(w=>{if(!w||!w.days||!w.action||w.action==='@courage')return;
    if(!w.action.startsWith('@t:')){const a=C.actions.find(x=>x.id===w.action);if(!a||a.type!=='good'||(a.once&&a.doneAt))return}
    const s=daysSince(w.action,y)+1;if(s>=w.days)m[w.action]={s,d:+w.days,over:s>w.days}});
  return m}
// 이 카드에 이어진 습관(반복 할 일)·관리가 있나 — 관리는 openTasks()에서 빠지므로 TASKS를 직접 봄(hid76 아님, cb76·ml80·루틴 단계는 뺌)
function link131(aid){return Object.values(TASKS).some(t=>t&&t.status===0&&t.aid===aid&&t.rep&&t.rep.f&&!t.cb76&&!t.ml80&&!t.rid&&!isStep62(t))}
function alOf131(t,m){if(!t||t.status!==0)return null;return (t.aid&&m[t.aid])||m['@t:'+t.id]||null}
function alTxt131(x){return x.over?`⚠ ${x.s}일째`:`⏳ ${x.s}일째`}
function alTip131(x){return x.over?`이 카드를 ${x.s}일째 안 했어요 (방치 경보 ${x.d}일)`:`이 카드를 ${x.s}일째 안 했어요 · 오늘이 경보 기한(${x.d}일)`}
// '⚠ 오래 안 한 행동' 칸: 이어진 습관·관리가 있는 경보는 빼고(그 줄에 꼬리표), 남은 줄마다 🧽 관리로 옮기기
{const _th=todayHabits;todayHabits=function(){const r=_th();try{return r.filter(x=>!(x&&x.a&&link131(x.a.id)))}catch(e){console.error(e);return r}}}
{const _thh=todayHabitsHTML;todayHabitsHTML=function(){const p=MODE68;MODE68='game';let h;try{h=_thh()}finally{MODE68=p}if(!h)return h;
  try{const tp=document.createElement('template');tp.innerHTML=h;let n=0;
    tp.content.querySelectorAll('.trow.hab[data-hab]').forEach(r=>{const id=r.dataset.hab,w=(C.watches||[]).find(x=>x.action===id);if(!w)return;n++;
      const tm=r.querySelector('.tm')||r.querySelector('.tb');if(!tm)return;
      tm.insertAdjacentHTML('beforeend',`<button type="button" class="rfbtn c131" data-c131="${esc(id)}" title="이 경보를 🧽 관리(${+w.days}일마다)로 옮겨요 — 관리 창·캘린더에 차례로 나오고, 이 칸에서는 빠져요">🧽 관리로 옮기기</button>`)});
    if(!tp.content.querySelector('.trow.hab'))return '';
    return [...tp.content.childNodes].map(x=>x.outerHTML!=null?x.outerHTML:x.textContent).join('')}catch(e){console.error(e);return h}}}
function toCare131(aid){const a=C.actions.find(x=>x.id===aid),w=(C.watches||[]).find(x=>x.action===aid);if(!a||!w)return;
  if(link131(aid)){toast(`'${a.name}'에는 벌써 이어진 습관·관리가 있어요`);render();return}
  const t=newTask({title:a.name,aid:a.id});careOn77(t,+w.days||7);t.due=midKey68();saveTask(t);render();
  toastAct(`🧽 '${a.name}' → 관리(${+w.days}일마다) · 오늘 차례로 넣었어요`,'되돌리기',()=>{deleteTask(t.id);render()},7000)}
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-c131]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();toCare131(b.dataset.c131)},true);
// 꼬리표 붙이기: 할 일 줄(.trow) · 관리 칩(.c76c) · 관리 창 줄(.d128r). 다시 그려지면 새로 붙임
function tag131(){if(!document.querySelector('.trow[data-task]:not([data-a131]),.c76c [data-ctask]:not([data-a131]),.d128r .d128t:not([data-a131])'))return;
  const m=al131();
  document.querySelectorAll('.trow[data-task]:not([data-a131])').forEach(el=>{el.dataset.a131=1;const x=alOf131(TASKS[el.dataset.task],m);if(!x)return;
    const tm=el.querySelector('.tm')||el.querySelector('.tb');if(tm)tm.insertAdjacentHTML('beforeend',`<span class="${x.over?'late':'tday'} a131" title="${esc(alTip131(x))}">${alTxt131(x)}</span>`)});
  document.querySelectorAll('.c76c [data-ctask]:not([data-a131])').forEach(el=>{el.dataset.a131=1;const x=alOf131(TASKS[el.dataset.ctask],m);if(!x)return;
    const sm=el.querySelector('small:not(.a131)');if(sm&&/⏳/.test(sm.textContent))sm.remove();   // 칩은 좁아서 '때 지남' 대신 경보 하나만
    el.insertAdjacentHTML('beforeend',` <small class="a131${x.over?' o':''}" title="${esc(alTip131(x))}">${alTxt131(x)}</small>`);el.closest('.c76c').classList.add('late')});
  document.querySelectorAll('.d128r[data-d128r] .d128t:not([data-a131])').forEach(el=>{el.dataset.a131=1;const x=alOf131(TASKS[el.dataset.ctask],m);if(!x)return;
    const sm=el.querySelector('small');if(sm)sm.insertAdjacentHTML('beforeend',` · <span class="a131${x.over?' o':''}" title="${esc(alTip131(x))}">${alTxt131(x)}</span>`)})}
{let q=0;const go=()=>{q=0;try{tag131()}catch(e){console.error(e)}};
  new MutationObserver(()=>{if(!q)q=requestAnimationFrame(go)}).observe(document.body,{childList:true,subtree:true})}

/* ---------- U4 할 일 '오늘': 오늘만 펼치고 나머지는 칩 한 줄 [⏳ 밀린][🧽 관리][📥 날짜 없음][✓ 끝냄] ---------- */
// 펼침 기억 C.tc131={late,care,nd,done}(C 최상위 — normConfig가 안 버림). 밀린 것 ≤3이면 칩 없이 오늘 맨 위에 펼친 채
const TC131=()=>{let c=C.tc131;if(!c||typeof c!=='object'||Array.isArray(c))c=C.tc131={};return c};
const LATEMAX131=3;
function tcOn131(){const T=(C.ui&&C.ui.tasks)||{};return curView()==='tasks'&&(T.sel||'today')==='today'&&!(ui.tq71&&ui.tq71.trim())}
renderTasks=(function(prev){return function(){
  if(!tcOn131())return prev.apply(this,arguments);
  // 칩 속으로 들어갈 묶음은 접힘과 상관없이 줄을 다 그려 둠(접힘은 칩이 맡음) — 끝나면 원래 값으로
  const cl=C.ui.collapsed||(C.ui.collapsed={}),K=['tgd0','tgd9','tcompl','twont'],keep={};K.forEach(k=>keep[k]=cl[k]);const cf=cfg76(),fk=cf.fold;
  K.forEach(k=>cl[k]=false);cf.fold=0;let x;
  try{x=prev.apply(this,arguments)}finally{K.forEach(k=>{if(keep[k]===undefined)delete cl[k];else cl[k]=keep[k]});if(fk===undefined)delete cf.fold;else cf.fold=fk}
  try{tcBuild131(keep)}catch(e){console.error(e)}return x}})(renderTasks);
function tcBuild131(keep){const L=$('tList');if(!L)return;const c=TC131();
  const grp=k=>{const h=L.querySelector(`:scope>.tgroup>.ghead[data-tgcollapse="${k}"]`);return h?h.parentElement:null};
  const rows=g=>g?g.querySelectorAll('.trow[data-task]').length:0;
  const g0=grp('d0'),g1=grp('d1'),g9=grp('d9'),care=L.querySelector(':scope>.care76:not(.hint):not(.bar)'),
    comp=L.querySelector(':scope>.tgroup.tcomp:not(.twont)'),wont=L.querySelector(':scope>.tgroup.twont');
  const n0=rows(g0),n9=rows(g9),nd=comp?comp.querySelectorAll('.trow.done').length:0,nw=wont?wont.querySelectorAll('.trow').length:0;
  let nc=0;if(care){const b=care.querySelector('.c76h[data-c76open] b');nc=b?+b.textContent||0:0}
  // 관리 줄 속 일퀘 칩(☑)은 '오늘' 것 → 관리 칩으로 접지 않고 오늘 바로 밑 한 줄 .q131로(칩은 그대로라 ○ 체크·열기 같음. .care76 이름은 안 씀 — 관리 줄을 찾는 코드가 헷갈림)
  let qrow=null;if(care){const qs=[...care.querySelectorAll(':scope>.c76c.q')];if(qs.length){qrow=document.createElement('div');qrow.className='q131';
    qrow.innerHTML='<span class="c76h q131h" title="오늘의 일퀘">☑ 일퀘</span>';qs.forEach(x=>qrow.appendChild(x))}}
  // 밀린 것 ≤3: 오늘 맨 위에 펼친 채(원래 접어 둔 사람은 접힌 채)
  const inl=g0&&n0<=LATEMAX131;
  if(inl){L.prepend(g0);if(keep.tgd0){const h=g0.querySelector(':scope>.ghead');h.classList.add('shut');[...g0.children].forEach(x=>{if(x!==h)x.remove()})}}
  const items=[
    !inl&&g0&&{k:'late',l:`⏳ 밀린 ${n0}`,t:'날짜가 지난 할 일',els:[g0]},
    care&&{k:'care',l:`🧽 관리${nc?' '+nc:''}`,t:'때 되면 하는 관리 — 펼친 줄의 「🧽 관리」를 누르면 관리 창',els:[care]},
    g9&&n9&&{k:'nd',l:`📥 날짜 없음 ${n9}`,t:'날짜 없이 마감만 있는 할 일',els:[g9]},
    (nd||nw)&&{k:'done',l:`✓ 끝냄 ${nd}${nw?` <small>· ✕${nw}</small>`:''}`,t:'오늘 끝낸 할 일'+(nw?' · ✕ 하지 않기로 한 것':''),els:[comp,wont].filter(Boolean)}
  ].filter(Boolean);
  if(!items.length){if(qrow&&care)care.before(qrow);return}
  const bar=document.createElement('div');bar.className='tc131';bar.setAttribute('role','group');bar.setAttribute('aria-label','오늘 말고 나머지');
  bar.innerHTML=items.map(it=>`<button type="button" class="chipbtn tc131b${c[it.k]?' on':''}" data-tc131="${it.k}" aria-pressed="${!!c[it.k]}" aria-expanded="${!!c[it.k]}" title="${esc(it.t)} · 눌러서 ${c[it.k]?'접기':'펼치기'}">${it.l}<span class="ar131" aria-hidden="true">${c[it.k]?'▾':'▸'}</span></button>`).join('');
  // 줄 자리: 오늘 묶음(없으면 맨 위 묶음·빈 안내) 바로 뒤
  const anchor=g1||(inl?g0:null)||L.querySelector(':scope>.empty');
  if(anchor)anchor.after(bar);else L.prepend(bar);
  if(qrow)bar.before(qrow);
  let at=bar;
  items.forEach(it=>{const box=document.createElement('div');box.className='tp131';box.dataset.tp131=it.k;
    it.els.forEach(el=>{el.remove();if(c[it.k])box.appendChild(el)});
    if(c[it.k]&&box.childNodes.length){at.after(box);at=box}});
  // 칩 속 묶음 머리 접기 단추는 숨김(칩이 대신) · 관리 줄 접기 ▾ 도
  bar.parentElement.querySelectorAll('.tp131 > .tgroup > .ghead[data-tgcollapse],.tp131 .c76h.f106').forEach(h=>h.classList.add('hid131'));
  bar.parentElement.querySelectorAll('.tp131 > .tgroup.tcomp .ghead[data-tcompl],.tp131 > .tgroup.twont .ghead[data-twont]').forEach(h=>h.classList.add('hid131'))}
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-tc131]');if(!b)return;e.preventDefault();e.stopPropagation();
  const c=TC131(),k=b.dataset.tc131;if(c[k])delete c[k];else c[k]=1;save('config');renderTasks()},true);

/* ---------- U5 (v13.14에서 뒤집음) 미루기·날짜 변경은 기본으로 ☠ 미룸에 셈 ----------
   postpone()는 v5c 원래대로(날짜가 지났거나 오늘인 걸 뒤로 옮기면 ☠+1) — 센 뒤 w72 saveTask 감쌈이 알림에
   '단순 날짜 변경으로 바꾸기' 단추를 띄움(누르면 ☠ −1, unskull72). 옛 '☠ 미룸으로 기록' 칸(sk131·sk131p)과 기본 중립은 없앰.
   (방금 정한 날짜를 고친 것·여러 날 일정은 w72가 원래부터 안 셈. '📆 모두 내일로'(w132)는 한꺼번에라 그대로 ☠ 안 셈.) */

/* ---------- U6 보이기·숨기기 둘로: 캘린더 화면 = C.calf77, 할 일 화면 시간표(PC 3단 옆·폰 독) = C.calf77t ---------- */
// v7.7(J1)이 둘을 C.calf77 하나로 합친 것을 되돌리되, v7.7이 고친 것(끝낸 블록 doneOn·지난 날·kinds·inv·and)은 그대로 —
// flt77()만 '지금 어느 쪽인가'를 보고 고름. 할 일 쪽 캘린더는 늘 curView()==='tasks'일 때만 보임(splitOn·tt84On) → 그걸로 구분(폰도 독이 할 일 화면에만 있음)
// C.calf77t는 C 최상위(normConfig 보존), 처음엔 그때의 C.calf77 복사본(지금 보이는 모습 유지)
function side131(){try{return curView()==='tasks'?'t':'c'}catch(e){return 'c'}}
var REF131=null;   // 마지막으로 본 C.calf77 객체 — '모두 풀기'(w77)가 할 일 쪽에서 C.calf77을 새 객체로 갈아 끼우면 fApply77에서 되돌림
flt77=(function(prev){return function(){const f=prev.apply(this,arguments);REF131=f;   // 원래 것: mig77f 이주·C.calf77 다듬기(지우지 말 것)
  let t=C.calf77t;if(!t||typeof t!=='object'||Array.isArray(t))t=C.calf77t=JSON.parse(JSON.stringify(f));
  ['lists','areas','tags','kinds'].forEach(k=>{if(!Array.isArray(t[k]))t[k]=[]});
  return side131()==='t'?t:f}})(flt77);
// '모두 풀기'(w77 [data-f77x])는 C.calf77을 바로 새 값으로 바꿈 → 할 일 쪽이면 캘린더 화면 것을 되돌리고 할 일 쪽만 비움 · 제목에 어느 쪽인지
fApply77=(function(prev){return function(){try{if(side131()==='t'&&REF131&&C.calf77!==REF131){C.calf77=REF131;const t=C.calf77t;if(t)['lists','areas','tags','kinds'].forEach(k=>{t[k]=[]})}}catch(e){console.error(e)}
  return prev.apply(this,arguments)}})(fApply77);
calFilterSheet=(function(prev){return function(){const r=prev.apply(this,arguments);try{const sc=$('sheetC');if(!sc)return r;
  const h=sc.querySelector('.sh h3');if(h&&!h.querySelector('.sd131')){const T=side131()==='t';
    h.innerHTML=(T?'할 일 시간표 보이기·숨기기':'캘린더 보이기·숨기기')+`<small class="sd131 muted"> · ${T?'캘린더 화면과 따로':'할 일 화면 시간표와 따로'}</small>`}}catch(e){console.error(e)}return r}})(calFilterSheet);
