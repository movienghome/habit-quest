/* ---- v12.0 (w118.js): 루틴 프리셋을 '할 일 상세의 루틴 칸'에서도 · 며칠짜리 일정에 루틴 상황 걸기 · 프리셋마다 단계 분 (사용자 11/23: 상세 화면에서 프리셋을 못 찾겠음 · '장편 영화 촬영' 3일 일정이면 그 날들은 루틴도 촬영 상황으로 한번에) ----
   · 할 일 상세(루틴 머리)의 루틴 칸 = `rtPanel62`가 `rtCard62(r,true)`를 그대로 씀 → w114는 `rtCard61`만 감싸서 상세에는 프리셋 줄이 없었음. 여기서 `rtCard62`도 감싸 같은 `blk114(r)`을 넣음(이미 있으면 안 넣음).
   · 일정 상황: `t.rsit118`=프리셋 **이름**(예 '촬영'). 일정(한 번짜리·`t.due`~`t.end71`)이 덮는 날에는 모든 루틴이 **이름이 같은 프리셋**으로 돌아감(그 이름 프리셋이 없는 루틴은 기본대로).
     우선순위: 그날 직접 고른 프리셋(`r.pd117[날짜]`) > 일정 상황 > 루틴 기본(`r.pf117`). 읽기는 `sit118(날짜)`(w117 `pset117`이 부름). 겹치면 기간이 짧은(더 구체적인) 일정이 이김.
     입구: 일정 상세 칩 `🧭 루틴 상황`(여러 날이면 칩 줄 앞쪽에 보임 · 아니면 `＋ 더` 안) · ⋯ 메뉴 `🧭 루틴 상황` · 고르기 창 `sitSheet118`.
   · 프리셋별 분: `p.m={단계 id:분}`(없으면 공통 분). 읽기는 `effSteps117`이 분을 덮어쓴 복사본을 돌려줌(`pmin118(p,s)`) — 시작·체크·합계·캘린더 길이가 모두 따름. */
var IDX118=null;
function elig118(t){return !!(t&&t.due&&!t.rid&&!t.rstep&&!t.hab&&!t.cb76&&!(t.rep&&t.rep.f))}
function idx118(){const n=Date.now();if(IDX118&&n-IDX118.at<1500)return IDX118.m;const m=[];try{Object.values(TASKS).forEach(t=>{if(t&&t.rsit118&&elig118(t))m.push(t)})}catch(e){}IDX118={at:n,m};return m}
function sit118(d){if(!d)return null;const c=idx118().filter(t=>t.due<=d&&d<=(t.end71&&t.end71>t.due?t.end71:t.due));if(!c.length)return null;
  const len=t=>t.end71&&t.end71>t.due?Math.abs(diffDays(t.end71,t.due)):0;c.sort((a,b)=>len(a)-len(b)||(a.id<b.id?-1:1));return {t:c[0],name:c[0].rsit118}}
function srcNote118(r,d){const L=ensure117(r);if((r.pd117||{})[d]&&L.some(p=>p.id===r.pd117[d]))return '';const q=sit118(d);if(!q)return '';const hit=L.find(p=>String(p.n).trim().toLowerCase()===String(q.name).trim().toLowerCase());
  return hit?` <b>일정 '${esc(q.t.title)}'</b>가 이 날을 ${esc(preN117(hit))}로 정해 뒀어요.`:''}
function srcChip118(r,d){const L=ensure117(r);if((r.pd117||{})[d]&&L.some(p=>p.id===r.pd117[d]))return '';const q=sit118(d);if(!q)return '';const hit=L.find(p=>String(p.n).trim().toLowerCase()===String(q.name).trim().toLowerCase());
  return hit?`<button type="button" class="chipbtn src118" data-rs118c="${q.t.id}" title="이 날은 일정이 정해 둔 상황이에요 · 눌러서 일정의 상황을 바꿔요">📅 ${esc(q.t.title.length>10?q.t.title.slice(0,10)+'…':q.t.title)}</button>`:''}
saveTask=(function(prev){return function(){IDX118=null;return prev.apply(this,arguments)}})(saveTask);
// ---- 1) 할 일 상세의 루틴 칸에도 프리셋 줄 ----
rtCard62=(function(prev){return function(r,inSheet){let h=prev.apply(this,arguments);
  try{if(typeof h==='string'&&h.indexOf('pr114row')<0){const m='<div class="sum62">',i=h.indexOf(m);if(i>=0)h=h.slice(0,i)+blk114(r)+h.slice(i)}}catch(e){console.error(e)}return h}})(rtCard62);
// ---- 2) 일정에 루틴 상황 걸기 ----
function names118(){const m=new Map();(C.routines||[]).forEach(r=>ensure117(r).forEach(p=>{const n=String(p.n||'').trim();if(!n)return;const k=n.toLowerCase(),o=m.get(k)||{n,ic:p.ic||'🧩',c:0};o.c++;m.set(k,o)}));return [...m.values()]}
function rng118(t){const a=t.due,b=t.end71&&t.end71>t.due?t.end71:t.due,f=x=>x.slice(5).replace('-','/');return a===b?f(a):f(a)+'~'+f(b)}
function sitSheet118(id){const t=TASKS[id];if(!t)return;const L=names118(),cur=String(t.rsit118||'').trim().toLowerCase();
  openSheet(`<div class="sh"><h3>🧭 루틴 상황 · ${esc(t.title)}</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <p class="help" style="margin:0 0 8px">${esc(rng118(t))} 동안 모든 루틴을 아래 이름의 상황 프리셋으로 해요. 그 이름의 프리셋이 없는 루틴은 평소대로 해요. 그 날 루틴에서 직접 고른 프리셋이 있으면 그게 먼저예요.</p>
    <div class="sit116 sit117 sit118" role="group" aria-label="루틴 상황">${L.map(o=>`<button type="button" class="btn s116 s117 ${String(o.n).toLowerCase()===cur?'':'ghost'}" data-rs118="${esc(t.id)}" data-nm="${esc(o.n)}" aria-pressed="${String(o.n).toLowerCase()===cur}"><b>${esc((o.ic||'')+' '+o.n)}${String(o.n).toLowerCase()===cur?' ✓':''}</b><span class="tiny muted">루틴 ${o.c}개에 있어요</span></button>`).join('')||'<p class="tiny muted">아직 프리셋이 없어요 · 루틴 카드에서 ＋ 새 프리셋을 만들어요</p>'}</div>
    <div class="row" style="gap:6px;margin-top:10px;flex-wrap:wrap"><input id="rs118n" placeholder="새 이름 (예: 촬영)" maxlength="12" autocomplete="off" aria-label="상황 이름" style="flex:1;min-width:7em"><button type="button" class="btn sm" data-rs118new="${esc(t.id)}">이 이름으로</button>${t.rsit118?`<button type="button" class="btn sm ghost" data-rs118="${esc(t.id)}" data-nm="">상황 빼기</button>`:''}</div>
    <p class="tiny muted" style="margin:8px 0 0">새 이름은 같은 이름의 프리셋을 루틴 카드의 🧭 상황 프리셋 편집에서 만들어야 루틴에 적용돼요.</p>`)}
function setSit118(id,nm){const t=TASKS[id];if(!t)return;nm=String(nm||'').trim();if(nm)t.rsit118=nm;else delete t.rsit118;IDX118=null;saveTask(t);closeSheet();
  setTimeout(()=>{try{openTaskSheet(id)}catch(e){}render()},30);
  toast(nm?`🧭 ${t.title} · ${rng118(t)} · 루틴은 '${nm}' 상황으로 해요`:`🧭 ${t.title} · 루틴 상황을 뺐어요`)}
addEventListener('click',e=>{let b=e.target.closest&&e.target.closest('[data-rs118c]');if(b){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();sitSheet118(b.dataset.rs118c);return}
  b=e.target.closest&&e.target.closest('[data-rs118]');if(b){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();setSit118(b.dataset.rs118,b.dataset.nm);return}
  b=e.target.closest&&e.target.closest('[data-rs118new]');if(b){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();const v=($('rs118n')||{}).value;if(!String(v||'').trim()){toast('이름을 적어요');return}setSit118(b.dataset.rs118new,v)}},true);
addEventListener('keydown',e=>{const i=e.target;if(i&&i.id==='rs118n'&&e.key==='Enter'&&!e.isComposing&&e.keyCode!==229){e.preventDefault();e.stopPropagation();const b=document.querySelector('[data-rs118new]');if(b)b.click()}},true);
if(typeof CH79D!=='undefined'&&CH79D.indexOf('rsit118')<0)CH79D.push('rsit118');
drawTaskSheet=(function(prev){return function(){const x=prev.apply(this,arguments);try{const sc=$('sheetC'),t=TASKS[(sheetCtx||{}).task];
  if(sc&&t&&$('tsTitle')&&elig118(t)){const ch=sc.querySelector('.tchips');if(ch&&!ch.querySelector('[data-rs118c]')){
    const on=!!t.rsit118;ch.insertAdjacentHTML('beforeend',`<button type="button" class="tch ${on?'':'off'}" data-k79="rsit118" data-rs118c="${esc(t.id)}" title="이 일정이 있는 날엔 루틴을 이 상황 프리셋으로 해요">🧭 ${on?esc(t.rsit118):'루틴 상황'}</button>`);
    const e=ch.querySelector('[data-rs118c]'),more=ch.querySelector('.more79'),dv=ch.querySelector('.div79');
    if(more)more.before(e);if(dv&&span71(t))dv.before(e);
    try{vis79(sc,t)}catch(_){}}}}catch(e){console.error(e)}return x}})(drawTaskSheet);
menu61=(function(prev){return function(x,y,title,items){try{const t=TASKS[(sheetCtx||{}).task];if(Array.isArray(items)&&t&&elig118(t)&&!items.some(it=>it&&/루틴 상황/.test(it.l||''))){
  const i=items.findIndex(it=>it&&/삭제/.test(it.l||''));if(i>=0)items.splice(i,0,{l:'🧭 루틴 상황'+(t.rsit118?' · '+t.rsit118:'')+'…',f:()=>{const id=t.id;try{tsRead()}catch(_){}closeSheet();setTimeout(()=>sitSheet118(id),30)}})}}catch(e){console.error(e)}return prev.apply(this,arguments)}})(menu61);
F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['📅 일정에 루틴 상황 걸기','할 일(일정) 상세 → 칩 줄의 🧭 루틴 상황 (안 보이면 ＋ 더) · ⋯ 메뉴','며칠짜리 일정(예: 장편 영화 촬영 3일)에 상황 이름(촬영)을 걸어 두면 그 날들은 모든 루틴이 같은 이름의 프리셋으로 돌아가요. 그 날 루틴에서 직접 고른 게 있으면 그게 먼저예요',()=>{location.hash='tasks'},'일정 루틴 상황 프리셋 촬영 출근 외근 며칠 연속']])}})(F67);
