/* ---- v11.6 (w114.js): N21 루틴 상황별 프리셋 — 🌿 일반 / 🚗 출근 / 🎬 외근 (사용자 11/21: 새벽 출근·외부 숙박 촬영이면 산책·명상·몸무게 재기를 못 함) ----
   · 데이터: 루틴 `r.pre114={w:[꺼 둘 단계 id…], o:[…]}`(일반 'n'은 늘 모든 단계 — 저장 안 함) · 오늘 고른 상황 `r.pk114={d:점수 날짜 gk76(), p:'n'|'w'|'o'}`.
     **하루만 유효**: d가 오늘이 아니면 `pk114()`가 'n'(일반)을 돌려줌 → 다음 날은 저절로 일반. 단계 id는 `s.id`(없던 옛 단계는 편집 때 채움).
   · 끄는 길 = 기존 '오늘은 건너뛰기'(skip75)처럼 **그날만 빠지게**: ① `pOff114(r,s)` — 지금 고른 상황에서 꺼진 단계인가 ② rtNeed71·rtDone64(w71.js)의 단계 목록에서 빼서
     **완주 = 켜진 단계 다 함**(완주 보너스는 그대로) · 체크 창에서도 안 보임 ③ `startRun` 감쌈이 타이머 단계에서 뺌(목표 시간도 켜진 단계 합) — RUN.steps에 안 들어가니 루틴 배우기(h76)엔 '건너뜀'이 안 쌓임
     ④ `stDoneHide72`를 다시 선언(오늘 한 단계 + 꺼진 단계는 목록에서 숨김). `rtPart73`(일부 = 오늘 함)은 '한 단계 수'만 보니 그대로.
   · 몸무게 단계(@weigh)도 그냥 단계라서 외근에서 끌 수 있음(끄면 체크 창·완주에서 빠짐. 몸무게는 기록하기에서 언제든 적으면 단계가 체크됨 — 기존 wSync63).
   · 고르는 곳: ① 루틴 카드 `🧭 상황별` 접힘 칸(오늘 칩 + 상황별 단계 체크칸) ② 루틴 체크 창 위 한 줄(단계를 끈 루틴에만) ③ ⏱ 시작 전 선택창(w116, 오늘 아직 안 골랐고 끈 단계가 있는 루틴만). v11.8: 목록 줄에는 안 둠(공간).
   · 새 단계를 끄고 켜는 새 길은 `r.pre114`만 바꾸고 `save('config')` 뒤 `redrawRt61()`·`render()`. 단계를 읽는 새 코드가 '오늘 해야 할 단계'를 셀 땐 `pOff114`를 거칠 것. */
var PRE114=[['n','🌿','일반'],['w','🚗','출근'],['o','🎬','외근']],O114={};
function preN114(p){const x=PRE114.find(a=>a[0]===p);return x?x[1]+' '+x[2]:''}
function pk114(r){const k=r&&r.pk114;return k&&k.d===gk76()&&PRE114.some(a=>a[0]===k.p)?k.p:'n'}
function pOff114(r,s){if(!r||!s||!s.id)return false;const p=pk114(r);if(p==='n')return false;const L=r.pre114&&r.pre114[p];return !!(L&&L.indexOf(s.id)>=0)}
function offTid114(tid){if(!tid)return false;const rs=C.routines||[];for(let i=0;i<rs.length;i++){const r=rs[i];if(!r.pre114||pk114(r)==='n')continue;const ss=r.steps||[];for(let j=0;j<ss.length;j++)if(ss[j].tid===tid)return pOff114(r,ss[j])}return false}
function hasPre114(r){return !!(r&&r.pre114&&Object.keys(r.pre114).some(k=>(r.pre114[k]||[]).length))}
function offCnt114(r,p){const L=(r.pre114&&r.pre114[p])||[];return (r.steps||[]).filter(s=>s.id&&L.indexOf(s.id)>=0&&TASKS[s.tid]).length}
function pChips114(r){const p=pk114(r);return PRE114.map(([id,ic,n])=>`<button type="button" class="chipbtn pr114" data-pk114="${r.id}|${id}" aria-pressed="${p===id}">${ic} ${n}${p===id?' ✓':''}</button>`).join('')}
function blk114(r){
  const e=O114[r.id]||'w',on=pk114(r),live=(r.steps||[]).filter(s=>TASKS[s.tid]);live.forEach(s=>{if(!s.id)s.id=uid()});
  const off=(r.pre114&&r.pre114[e])||[],sum=on==='n'?'오늘은 🌿 일반 · 모든 단계':`오늘은 ${preN114(on)} · ${offCnt114(r,on)}단계 쉬어요`;
  return `<div class="row pr114row pt116" style="gap:6px;flex-wrap:wrap"><span class="tiny muted">오늘은</span>${pChips114(r)}</div><details class="pe114" data-r="${r.id}" ${O114['o'+r.id]?'open':''}><summary class="small"><b>🧭 상황별 쉬는 단계 정하기</b> <span class="tiny muted">${esc(sum)}</span></summary>
    <div class="row" style="gap:6px;flex-wrap:wrap;margin-top:6px"><span class="tiny muted">하는 단계 고르기</span>${PRE114.slice(1).map(([id,ic,n])=>`<button type="button" class="chipbtn" data-pe114="${r.id}|${id}" aria-pressed="${e===id}">${ic} ${n}${e===id?' ✓':''}</button>`).join('')}</div>
    <div class="pe114l">${live.map(s=>`<label class="pe114r"><input type="checkbox" data-pc114="${r.id}|${s.id}|${e}" ${off.indexOf(s.id)>=0?'':'checked'}> <span>${esc(stName61(s))}</span></label>`).join('')||'<span class="tiny muted">단계가 없어요</span>'}</div>
    <p class="tiny muted" style="margin:4px 0 0">체크를 끈 단계는 ${esc(preN114(e))}인 날 목록·타이머·체크 창에서 빠지고, 완주는 켜진 단계로 따져요(완주 보너스는 그대로). 🌿 일반은 늘 모든 단계예요. 하루가 지나면 일반으로 돌아와요.</p></details>`}
// 루틴 카드: 단계 목록·추가 줄 아래, 합계 줄 위에 접힘 한 칸
(function(prev){rtCard61=function(r){let h=prev.apply(this,arguments);try{const m='<div class="sum62">',i=h.indexOf(m);if(i>=0)h=h.slice(0,i)+blk114(r)+h.slice(i)}catch(x){console.error(x)}return h}})(rtCard61);
// 루틴 체크 창: 상황을 정한 루틴이면 위에 한 줄
(function(prev){rtDone64=function(r,k){const x=prev.apply(this,arguments);try{const box=$('sheetC'),d=box&&box.querySelector('.d64s');
  if(r&&hasPre114(r)&&d&&!box.querySelector('.pr114row'))d.insertAdjacentHTML('beforebegin',`<div class="row pr114row" style="gap:6px;flex-wrap:wrap;margin:0 0 6px"><span class="tiny muted">오늘은</span>${pChips114(r)}</div>`)}catch(e){console.error(e)}return x}})(rtDone64);
// (v11.8) 목록 루틴 줄에는 상황 칸을 안 둠(공간) — 카드 맨 위 줄·시작 전 창(w116)에서 고름
// 타이머: 꺼진 단계는 빼고 시작
(function(prev){startRun=function(o){try{if(o&&o.routine){const r=(C.routines||[]).find(x=>x.id===o.routine.id),ss=o.routine.steps||[],st=r?ss.filter(s=>!pOff114(r,s)):ss;
  if(st.length!==ss.length){if(!st.length){toast('오늘 상황에선 할 단계가 없어요 · 🧭 상황별에서 바꿔요');return}o={...o,routine:{...o.routine,steps:st}}}}}catch(e){console.error(e)}return prev.call(this,o)}})(startRun);
// 오늘 한 단계 + 꺼진 단계는 목록에서 숨김 (w77 것을 다시 선언)
function stDoneHide72(k){return !!(k&&isRtKid71(k)&&k.status===0&&(k.last===gk76()||offTid114(k.id)))}
// 오늘 상황 고르기
addEventListener('click',e=>{const b=e.target.closest('[data-pk114]');if(!b)return;e.preventDefault();e.stopPropagation();
  const [rid,p]=b.dataset.pk114.split('|'),r=(C.routines||[]).find(x=>x.id===rid);if(!r)return;
  r.pk114={d:gk76(),p};save('config');
  toast(p==='n'?'🌿 일반 · 모든 단계를 해요':offCnt114(r,p)?`${preN114(p)} · ${offCnt114(r,p)}단계는 오늘 쉬어요`:`${preN114(p)} · 쉬는 단계가 아직 없어요 · ⚙에서 정해요`);
  if(sheetCtx&&sheetCtx.rt64===r.id)rtDone64(r,true);else if(sheetCtx&&sheetCtx.rt61===r.id)redrawRt61();
  render()},true);
// 어느 상황의 단계를 고칠지
addEventListener('click',e=>{const b=e.target.closest('[data-pe114]');if(!b)return;e.preventDefault();e.stopPropagation();
  const [rid,p]=b.dataset.pe114.split('|');O114[rid]=p;O114['o'+rid]=1;if(sheetCtx&&sheetCtx.rt61)redrawRt61();else if(curView()==='edit')reEdit()},true);
// 단계 켜고 끄기 (체크 = 그 상황에서 함)
addEventListener('change',e=>{const i=e.target;if(!i||!i.dataset||!i.dataset.pc114)return;e.stopPropagation();
  const [rid,sid,p]=i.dataset.pc114.split('|'),r=(C.routines||[]).find(x=>x.id===rid);if(!r)return;
  r.pre114=r.pre114||{};const L=(r.pre114[p]||[]).filter(x=>x!==sid);if(!i.checked)L.push(sid);r.pre114[p]=L;O114['o'+rid]=1;
  save('config');if(sheetCtx&&sheetCtx.rt61)redrawRt61();else if(curView()==='edit')reEdit();render()},true);
// 접힘 칸 펼침 기억 (다시 그려도 유지)
addEventListener('toggle',e=>{const d=e.target;if(d&&d.classList&&d.classList.contains('pe114')&&d.dataset.r)O114['o'+d.dataset.r]=d.open?1:0},true);
F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['🚗 루틴 상황별(출근·외근)','루틴 카드 맨 위 오늘은 줄 · ⏱ 시작 전 · 루틴 체크 창','새벽 출근·외부 촬영처럼 아침 루틴을 다 못 하는 날, 그날만 🌿 일반 / 🚗 출근 / 🎬 외근을 골라요. 꺼 둔 단계는 그날 목록·타이머·체크 창에서 빠지고 완주는 켜진 단계로 따져요. 하루 지나면 일반으로',()=>{location.hash='edit'},'루틴 프리셋 상황 출근 외근 일반 아침 루틴 단계 끄기 모텔 새벽']])}})(F67);
