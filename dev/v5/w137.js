/* v13.9 🍅 캘린더 주 N회 칩 창·할 일 상세 ⋯에서 바로 뽀모도로 시작 (w137) — IDEAS 11/25 v13.8 '뽀모도로 시작을 캘린더·할 일 줄에서' (TODO K3 남은 것)
   - 입구 둘: ① 캘린더 위 주 N회 칩(예: 시나리오 쓰기)을 눌러 뜨는 창 아래 `🍅 25분 시작` ② 할 일 상세 ⋯ 메뉴 맨 위 `🍅 25분 시작`.
   - 둘 다 `go137(할 일)` 하나: 이름에 맞는 뽀모도로 종류를 찾아(없으면 그 이름으로 종류를 만들어) `pStart88(종류,'work')`.
   - 이미 🍅가 돌고 있으면 덮어쓰지 않고 뽀모도로 창만 열어 줌. 기록·구슬은 기존 PM88 길(pComplete88) 그대로 — 새 저장 키 없음. */
const GN137=t=>String(t&&t.title||'').replace(/\s/g,'');
function kind137(t){ // 할 일 이름에 맞는 뽀모도로 종류: 같은 이름 > 서로 포함 > 앞 세 글자 같음 > 새로 만듦
  const g=pget88(),n=GN137(t);if(!n)return g.kinds[0];
  const nm=k=>String(k.name||'').replace(/\s/g,'');
  let k=g.kinds.find(z=>nm(z)===n)||g.kinds.find(z=>nm(z).length>=2&&n.length>=2&&(n.includes(nm(z))||nm(z).includes(n)))
    ||g.kinds.find(z=>nm(z).length>=3&&n.length>=3&&nm(z).slice(0,3)===n.slice(0,3));
  if(k)return k;
  const c=pset88();k={id:'k'+Date.now().toString(36),name:String(t.title).trim().slice(0,14)};c.kinds.push(k);save('config');return k}
function go137(t){
  if(!t)return;
  if(PM88){closeSheet();toast('🍅 이미 돌고 있어서 뽀모도로 창을 열었어요');setTimeout(()=>{try{pOpen88()}catch(e){console.error(e)}},60);return}
  const k=kind137(t),g=pget88();
  try{pAudioUnlock88()}catch(e){}
  pStart88(k,'work');
  toast('🍅 '+k.name+' '+g.w+'분 시작 · 끝나면 알려 드려요')}
/* ① 캘린더 주 N회 칩 창 */
card121=(function(prev){return function(g){const h=prev.apply(this,arguments);
  try{const t=g&&g.t;if(!t||t.status!==0)return h;const w=pget88().w;
    return String(h).replace(/(<div class="row" style="gap:6px;margin-top:8px;flex-wrap:wrap">)(<button[^>]*data-wk105open)/,
      `$1<button type="button" class="btn sm go" data-pm137="${esc(t.id)}" title="이 할 일 이름으로 뽀모도로를 바로 시작해요">🍅 ${w}분 시작</button>$2`)}catch(e){console.error(e);return h}}})(card121);
/* ② 할 일 상세 ⋯ 메뉴(삭제 항목이 있는 메뉴) 맨 위 */
menu61=(function(prev){return function(x,y,title,items){
  try{const t=sheetCtx&&sheetCtx.task&&TASKS[sheetCtx.task];
    if(t&&t.status===0&&Array.isArray(items)&&items.some(i=>i&&i.keep&&i.l==='🗑 삭제')&&!items.some(i=>i&&i.pm137)){
      items=[{pm137:1,l:`🍅 ${pget88().w}분 시작 <small class="muted">이 할 일로 뽀모도로</small>`,f:()=>{try{tsRead()}catch(e){}const id=t.id;closeSheet();go137(TASKS[id]||t)}},'-'].concat(items)}}catch(e){console.error(e)}
  return prev.call(this,x,y,title,items)}})(menu61);
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-pm137]');if(!b)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  const t=TASKS[b.dataset.pm137];closeSheet();go137(t)},true);
F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['🍅 바로 뽀모도로 시작','캘린더 위 주 N회 칩(예: 시나리오 쓰기) → 창 맨 아래 `🍅 25분 시작` · 할 일 상세 → ⋯ → `🍅 25분 시작`','할 일 이름에 맞는 종류로 뽀모도로를 바로 시작해요(없으면 그 이름으로 종류를 만들어요). 이미 돌고 있으면 뽀모도로 창만 열려요',()=>{location.hash='calendar'},'뽀모도로 시작 타이머 집중 25분 시나리오 쓰기 캘린더 칩 상세']])}})(F67);
