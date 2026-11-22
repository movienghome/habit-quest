/* ---- v11.8 (w116.js): 루틴 상황 고르기를 목록 줄에서 빼고 '상세 화면 맨 위 줄 + ⏱ 시작 전'으로 (사용자 11/22: 목록 루틴 줄 맨 아래 상황 칸이 공간을 너무 차지함 — 상세나 실행할 때 먼저 정하고 싶음) ----
   · 목록·홈 루틴 줄: 상황 칸(.sit115) 없음(w115에서 뺌). 루틴 카드: '오늘은 [🌿 일반][🚗 출근][🎬 외근]' 줄이 접힘 밖 맨 위에 보임(w114 blk114, `.pt116`), 쉬는 단계 고르기는 접힘 안.
   · ⏱ 시작(startRun)할 때: 끈 단계가 있는 루틴(hasPre114)이고 오늘 아직 상황을 안 골랐으면 작은 창 `sitSheet116`이 먼저 뜸 → 하나 누르면 상황을 정하고(`r.pk114`) 바로 시작.
     오늘 이미 골랐으면(카드에서든 여기서든) 묻지 않고 바로 시작 — 바꾸려면 루틴 카드 맨 위 줄. 끈 단계가 하나도 없는 루틴은 상황이 의미 없어 묻지 않음.
   · 이 감쌈은 w71(🔀◌ 고르기)·w114(꺼진 단계 빼기)보다 바깥 — 상황 → 선택 단계 → 시작 순서. 다시 부를 땐 상황이 정해졌으니 다시 안 물음(`needSit116`). */
function needSit116(r){const k=r&&r.pk114;return !!(r&&hasPre114(r)&&!(k&&k.d===gk76()&&PRE114.some(a=>a[0]===k.p)))}
var SP116=null;
function sitSheet116(r,o){SP116={r,o};
  const sub=id=>id==='n'?'모든 단계':(offCnt114(r,id)?`${offCnt114(r,id)}단계 쉬어요`:'쉬는 단계 없음');
  openSheet(`<div class="sh"><h3>⏱ ${esc(r.name)}</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div><p class="help" style="margin:0 0 8px">오늘은 어떤 날이에요? 고르면 바로 시작해요.</p><div class="sit116" role="group" aria-label="오늘 상황">${PRE114.map(([id,ic,n])=>`<button type="button" class="btn s116" data-sp116="${id}"><b>${ic} ${n}</b><span class="tiny muted">${esc(sub(id))}</span></button>`).join('')}</div>`)}
startRun=(function(prev){return function(o){
  try{const r=o&&o.routine&&(C.routines||[]).find(x=>x.id===o.routine.id);if(r&&needSit116(r)){sitSheet116(r,o);return}}catch(e){console.error(e)}
  return prev.apply(this,arguments)}})(startRun);
addEventListener('click',e=>{const b=e.target.closest('[data-sp116]');if(!b||!SP116)return;e.preventDefault();e.stopPropagation();
  const {r,o}=SP116,p=b.dataset.sp116;SP116=null;r.pk114={d:gk76(),p};save('config');closeSheet();render();
  if(p!=='n'&&!offCnt114(r,p))toast(`${preN114(p)} · 쉬는 단계가 아직 없어요 · 루틴 카드에서 정해요`);
  startRun(o)},true);
F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['🧭 오늘 상황 고르기(루틴)','루틴 카드(할 일 → 루틴 이름 누르기) 맨 위 \'오늘은\' 줄 · ⏱ 시작할 때 처음 한 번 묻는 창','루틴 이름을 눌러 열면 맨 위 줄에서 오늘 상황(일반·출근·외근)을 바로 바꿔요. ⏱ 시작할 때 오늘 아직 안 골랐으면 먼저 물어봐요. 하루 지나면 일반으로 돌아와요',()=>{location.hash='tasks'},'루틴 상황 출근 외근 일반 선택 시작 전 오늘 상황']])}})(F67);
