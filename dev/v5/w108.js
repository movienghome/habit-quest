/* ---- v10.9 (w108.js): 루틴 '오늘은 건너뛰기'를 폰에서 바로 닿게 ----
   원래 있던 길: ① PC 우클릭 메뉴 ② 루틴 카드 안 '📅 언제' 줄 단추(w105, 카드를 한참 내려야 보임).
   폰은 길게 누르기=끌기라 우클릭이 없고, 줄을 누르면 루틴 카드가 열리는데 단추가 카드 중간쯤(스크롤 300px 아래)이라 못 찾음.
   더한 길: ① 루틴 카드 머리줄(× 옆)에 '⏭ 오늘 건너뛰기' ② 루틴 실행 화면 '그만' 창에(끝낸 단계가 없을 때만) '⏭ 오늘은 건너뛰기'.
   동작은 모두 기존 skipToday61(☠ 없이 다음 차례로, 되돌리기 알림) 그대로 — 새 규칙 없음. 오늘 차례가 아니거나 이미 건너뛴 루틴엔 안 보임. */
function rtSkipOk108(r){const t=r&&rtT(r),td=dateKey();return !!(t&&t.due&&t.due<=td&&!(t.skip61||[]).includes(td))}
function hdr108(){try{
  if(!(sheetCtx&&sheetCtx.rt61))return;
  const r=(C.routines||[]).find(x=>x.id===sheetCtx.rt61),sc=$('sheetC');
  if(!sc||!rtSkipOk108(r))return;
  const h=sc.querySelector('.sh');if(!h||h.querySelector('[data-sk108]'))return;
  const b=document.createElement('button');b.type='button';b.className='btn ghost sm sk108';b.dataset.sk108=rtT(r).id;b.textContent='⏭ 오늘 건너뛰기';
  h.insertBefore(b,h.querySelector('.x'))}catch(e){console.error(e)}}
openRt61=(function(prev){return function(){const r=prev.apply(this,arguments);hdr108();return r}})(openRt61);
redrawRt61=(function(prev){return function(){const r=prev.apply(this,arguments);hdr108();return r}})(redrawRt61);
// 실행 화면 '그만' 창: 아직 끝낸 단계가 없으면 '오늘은 건너뛰기'(기록 없이 그만두기 바로 위)
quitAsk62=(function(prev){return function(){const r=prev.apply(this,arguments);try{
  if(!RUN||RUN.kind!=='routine'||RUN.log.some(x=>!x.skip))return r;
  const rt=(C.routines||[]).find(x=>x.id===RUN.id);if(!rtSkipOk108(rt))return r;
  const q=document.querySelector('#hunt .q62 [data-q62="quit"]');if(!q||q.parentNode.querySelector('[data-sk108]'))return r;
  const b=document.createElement('button');b.type='button';b.className='btn ghost';b.dataset.sk108=rtT(rt).id;b.textContent='⏭ 오늘은 건너뛰기 (다음 차례로)';
  q.parentNode.insertBefore(b,q)}catch(e){console.error(e)}return r}})(quitAsk62);
document.addEventListener('click',e=>{const b=e.target.closest('[data-sk108]');if(!b)return;e.preventDefault();e.stopPropagation();
  const t=TASKS[b.dataset.sk108];if(!t)return;
  const q=b.closest('.q62');
  if(q){q.remove();endRun(true)}else closeSheet();
  skipToday61(t)},true);
F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['⏭ 루틴 오늘은 건너뛰기','루틴 카드 머리줄 · 루틴 실행 → 그만','오늘 차례인 루틴을 ☠ 없이 다음 차례로(되돌리기 알림). 루틴 카드 맨 위 × 옆, 실행 중엔 그만 → 오늘은 건너뛰기']])}})(F67);
