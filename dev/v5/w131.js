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
