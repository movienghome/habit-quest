/* ===== v13.35 (w155): 기록하기 '모두'·'↻ 습관'·'⚔ 용기' 보기에서 숨은 카드가 다시 보이던 것 =====
   원인: flt61(v5r)은 '▲ 좋은'·'▼ 나쁜'·'🍬'만 `!a.doneAt`을 봄 → 거르기가 '모두'이면 합쳐서 숨은 옛 카드(a.mg+a.doneAt)·끝낸 '한 번' 카드가
   기록하기 목록에 그대로 나옴(사용자 11/28 '빠른 답장 등 카드가 여전히 남아 있음 — 공간이 전혀 안 줄었음'). 옛 v5k 원본은 '모두'도 숨긴 카드를 뺐음.
   고침: 어느 보기든 숨긴 카드(doneAt)는 뺌 — 마지막 선언이 이김. 개수 칩(fltBar61)도 같이 맞음. */
function flt61(a,k){
  if(!a||a.doneAt)return false;
  if(k==='good')return a.type==='good'&&!a.dopaOnly;
  if(k==='bad')return a.type==='bad';
  if(k==='dopa')return !!a.dopa;
  if(k==='habit')return isHabit(a);
  if(k==='brave')return !!a.brave;
  return true}

/* ===== v13.35 ②: 루틴 편집 화면 — 모든 루틴을 쭉 펼치지 말고 한 줄씩, 누른 루틴만 펼침 (사용자 11/28) =====
   routinesEditHTML 맨 바깥 감쌈: `.stack` 안 루틴 카드(`#rt60-id`) 앞에 요약 줄 `.rt155r`(이름 · ⏰ 시각 · n단계 · n분 · 프리셋 n)을 넣고
   고른 루틴(`window.RT155`, 저장 안 함 — 세션만) 카드만 보임. 다시 누르면 접힘. 새 루틴을 만들면 그 루틴을 펼침.
   다른 화면에서 루틴으로 가는 길(`data-x60rt` — 카드 → 루틴 칩)은 그 루틴을 펼친 채로 감. 카드 마크업은 안 건드림. */
window.RT155=window.RT155||'';let RTN155=-1;
function rtSum155(r){const d=typeof gk76==='function'?gk76():dateKey();let st=[];try{st=effSteps117(r,d)}catch(e){st=r.steps||[]}
  let tm='';try{tm=ptime123(r,d)}catch(e){}
  let np=0;try{np=(ensure117(r)||[]).length}catch(e){}
  const mn=st.reduce((a,s)=>a+(+s.min||0),0);
  return [tm?`⏰ ${tm}`:'',`${st.length}단계`,mn?`${mn}분`:'',np>1?`🧩 프리셋 ${np}`:''].filter(Boolean).join(' · ')}
routinesEditHTML=(function(prev){return function(){const h=prev.apply(this,arguments);try{
  const rs=C.routines||[];if(!rs.length)return h;
  if(RTN155>=0&&rs.length>RTN155){window.RT155=rs[rs.length-1].id}RTN155=rs.length;   // 새 루틴 → 펼침
  if(window.RT155&&!rs.some(r=>r.id===window.RT155))window.RT155='';
  const t=document.createElement('template');t.innerHTML=h;let n=0;
  rs.forEach(r=>{const card=t.content.getElementById('rt60-'+r.id);if(!card)return;n++;const on=window.RT155===r.id;
    const b=document.createElement('button');b.type='button';b.className='rt155r'+(on?' on':'');b.dataset.rt155=r.id;b.setAttribute('aria-expanded',String(on));
    b.innerHTML=`<span class="ch155" aria-hidden="true">${on?'▾':'▸'}</span><b>${esc(r.name||'(이름 없음)')}</b><span class="tiny muted">${esc(rtSum155(r))}</span>`;
    card.parentNode.insertBefore(b,card);if(!on)card.classList.add('hid155')});
  if(!n)return h;
  const st=t.content.querySelector('.stack');if(st)st.classList.add('rt155s');
  const tmp=document.createElement('div');tmp.appendChild(t.content.cloneNode(true));return tmp.innerHTML}catch(e){console.error(e);return h}}})(routinesEditHTML);
addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('[data-rt155]');if(!b)return;e.preventDefault();e.stopPropagation();
  const id=b.dataset.rt155;window.RT155=window.RT155===id?'':id;
  const st=b.closest('.rt155s');if(st)st.querySelectorAll('[data-rt155]').forEach(x=>{const on=x.dataset.rt155===window.RT155;x.classList.toggle('on',on);x.setAttribute('aria-expanded',String(on));const c=x.querySelector('.ch155');if(c)c.textContent=on?'▾':'▸';const card=document.getElementById('rt60-'+x.dataset.rt155);if(card)card.classList.toggle('hid155',!on)});
  if(window.RT155)setTimeout(()=>{try{b.scrollIntoView({block:'nearest'})}catch(e){}},30)},true);
// 다른 화면 → 이 루틴으로: 펼친 채로 가기(v5q x60rt 처리보다 먼저)
addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('[data-x60rt]');if(b)window.RT155=b.dataset.x60rt},true);

/* ===== v13.35 ③: 루틴 프리셋 ⋯ 메뉴·단계 ⋯가 저절로 닫히던 것 =====
   원인: 다른 기기 저장·스냅샷이 올 때마다 render가 루틴 카드를 새로 그림 → 펼친 ⋯(`details.pm135`·`.once135`)·단계 `.open125`가 닫혀 🗑 삭제·×를 못 누름
   (사용자 11/28: '팝업이 너무 빨리 사라져서 삭제가 안 돼', '펼친 게 갑자기 접히면서 x를 못 누름'). 고침: 사용자가 0.7초 안에 누르거나 친 게 없는데
   다시 그려지면(=저절로 다시 그림) 그리기 전에 열려 있던 것을 그린 뒤 다시 엶. 사용자가 누른 직후의 다시 그리기는 그대로 닫힘(메뉴 항목을 누른 뒤 등). */
let UIN155=0;['pointerdown','keydown'].forEach(k=>addEventListener(k,()=>{UIN155=Date.now()},true));
function keep155(){const o=[];
  document.querySelectorAll('details.pm135[open],details.once135[open]').forEach(d=>{const c=d.closest('[id^="rt60-"]');o.push(['d',(c&&c.id)||'',d.classList.contains('pm135')?'pm135':'once135'])});
  document.querySelectorAll('.st62.open125').forEach(r=>{const c=r.closest('[id^="rt60-"]'),k=r.querySelector('[data-r62op^="del:"]');if(k)o.push(['s',(c&&c.id)||'',k.dataset.r62op])});
  return o}
function back155(o){o.forEach(([k,cid,x])=>{const c=cid?document.getElementById(cid):document;if(!c)return;
  if(k==='d'){const d=c.querySelector('details.'+x);if(d)d.open=true}
  else{const b=c.querySelector(`[data-r62op="${CSS.escape(x)}"]`),r=b&&b.closest('.st62');if(r){r.classList.add('open125');const m=r.querySelector('[data-mo125]');if(m)m.setAttribute('aria-expanded','true')}}})}
render=(function(prev){return function(){const auto=Date.now()-UIN155>700;let o=[];if(auto){try{o=keep155()}catch(e){}}
  const r=prev.apply(this,arguments);if(o.length){try{back155(o)}catch(e){console.error(e)}}return r}})(render);

/* ===== v13.35 ④: 단계 × 빼기를 한 번에 — ⋯ 펼치지 않고 줄에 바로 (되돌리기 알림은 그대로 `unstep62`) =====
   stepRow125가 × 를 ⋯ 안(.x125)으로 옮기던 것을 줄(⋯ 바로 앞)로 되돌림. */
{const _s=stepRow125;stepRow125=function(row){const r=_s.apply(this,arguments);try{const x=row.querySelector(':scope > .x125 [data-r62op^="del:"]'),mo=row.querySelector(':scope > [data-mo125]');
  if(x&&mo){x.classList.add('del155');mo.parentNode.insertBefore(x,mo)}}catch(e){console.error(e)}return r}}

/* ===== v13.35 ⑤: 저장 되풀이 막기 — strip126(옛 홈 '이번 주' 칸 지우기)이 render마다 save('config')를 불러,
   'week'가 다시 섞여 들어오면 저장 → 스냅샷 → render → 저장이 되풀이됨(11/28 본 앱에서 8초에 6번 저장·7번 다시 그림 관찰).
   'week' 칸은 HOME_BLOCKS에서 이미 빠져 그려지지 않으니 메모리에서만 빼고 저장하지 않음(다른 저장 때 같이 빠짐). */
function strip126(){try{const h=C.ui&&C.ui.home;if(Array.isArray(h)&&h.some(x=>x&&x[0]==='week'))C.ui.home=h.filter(x=>!(x&&x[0]==='week'))}catch(e){console.error(e)}}
F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['⏱ 루틴 편집 한 줄씩','설정(편집) → ⏱ 루틴 탭','루틴마다 한 줄(이름 · ⏰ 시각 · n단계 · n분 · 프리셋 n)만 보이고, 누른 루틴만 펼쳐서 보고 고쳐요. 다시 누르면 접혀요. 단계 ×는 ⋯를 펼치지 않고 줄에서 바로(되돌리기 알림)',()=>{goEdit('routines')},'루틴 편집 목록 접기 펼치기 한 줄 단계 빼기 삭제']])}})(F67);
