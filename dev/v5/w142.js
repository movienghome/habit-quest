/* v13.16 (w142): 11/26 밤 요청 묶음
   ① 식사 블록(t.ml80)은 자동으로 personal 목록에 넣음(기존 블록도 한 번 옮김 — 사용자가 목록을 바꾼 뒤엔 `t.pl142`로 다시 안 건드림)
   ② 식사 블록에도 시간표 ○ 체크 단추(ckAll이 t.ml80을 빼고 있었음) — 누르면 completeTask(ml80 분기)가 '먹었어요'로
*/
(function(){
/* ---------- ① personal 목록 ---------- */
function persList142(){try{const p=(C.lists||[]).find(x=>/personal|개인/i.test(x.name||''));return p?p.id:null}catch(e){return null}}
mealEnsure80=(function(prev){return function(){
  const r=prev.apply(this,arguments);
  try{const pid=persList142();if(pid&&typeof tOK64==='function'&&tOK64()){
    Object.values(TASKS).forEach(t=>{if(!t||!t.ml80||t.pl142||t.list===pid)return;t.list=pid;t.pl142=1;AUTO80=1;try{saveTask(t)}finally{AUTO80=0}})}}catch(e){console.error(e)}
  return r}})(mealEnsure80);

/* ---------- ② 식사 블록 ○ ---------- */
// w129 ckAll은 `t.ml80`이면 건너뜀 → 식사만 따로 ○를 붙임(열린 끼니만. 끝낸 끼니는 식사 창 '↶ 안 먹었어요')
function mealCk142(){
  document.querySelectorAll('#calPane [data-ctask], #tt84slot [data-ctask]').forEach(el=>{
    if(el.classList.contains('bar83')||el.closest('.mgrid')||el.querySelector(':scope > .ck128'))return;
    if(!el.matches('.blk,.cchip'))return;
    const t=TASKS[el.dataset.ctask];if(!t||!t.ml80||t.status!==0)return;
    if(el.offsetWidth&&el.offsetWidth<54)return;
    const b=document.createElement('button');b.type='button';b.className='ck128';b.setAttribute('data-tdone',t.id);b.textContent='○';
    b.setAttribute('aria-label',(t.title||'')+' 먹었어요 (체크)');b.title='먹었어요';
    el.classList.add('has128');el.appendChild(b)})}
render=(function(prev){return function(){const r=prev.apply(this,arguments);try{mealCk142()}catch(e){console.error(e)}return r}})(render);
renderCal=(function(prev){return function(){const r=prev.apply(this,arguments);try{mealCk142()}catch(e){console.error(e)}return r}})(renderCal);
})();
