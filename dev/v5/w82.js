/* ---- v8.2 (w82.js): 용기는 해 보고 나서 생기기도 함(11/13 사용자) ----
   1) 할 일 상세 ⚔️ 용기 칩: 카드로 이어진 할 일도 카드에 용기가 없으면 일반 칩(w71 drawTaskSheet 조건만 고침).
      카드에 용기가 있으면 v8.1의 읽기 칩(누르면 카드 편집) 그대로.
   2) 사후 용기: 칩으로 용기를 고르면 오늘(또는 끝낸 한 번짜리 할 일의) 기록에도 바로 붙음. 끄면 그 기록에서도 뺌.
      스낵바(방금 기록) ⚔️ 단추 = 이 기록에만 용기(할 일·카드는 안 바꿈).
   기록 바꾸기: brvSet82/brvOff82 → replaceEntry. 원래 값은 e.bv82={xp,gold,pts}, 크기 e.bz82.
   점수 = 용기 크기 점수와 원래 점수 중 큰 쪽(일반 용기 할 일이 크기 점수 대신 용기 점수를 받는 것과 같은 규칙, 겹쳐 더하지 않음). */
function bz82(id){const L=C.courageSizes||[];return L.find(z=>z.id===id)||L[1]||L[0]||null}
function brvOk82(e){return !!(e&&e.type==='good'&&['act','task','free'].includes(e.kind)&&(!e.brave||e.bv82))}
function brvSet82(e,s){const n=clone(e);if(!n.bv82)n.bv82={xp:+e.xp||0,gold:+e.gold||0,pts:e.pts==null?null:e.pts};
  n.xp=Math.max(+n.bv82.xp||0,+s.xp||0);n.gold=Math.max(+n.bv82.gold||0,+s.gold||0);n.brave=1;n.pts=+s.pts||1;n.bz82=s.id;return n}
function brvOff82(e){if(!e||!e.bv82)return null;const n=clone(e);n.xp=e.bv82.xp;n.gold=e.bv82.gold;if(e.bv82.pts==null)delete n.pts;else n.pts=e.bv82.pts;delete n.brave;delete n.bz82;delete n.bv82;return n}
// 이 할 일의 '방금 기록': 오늘(점수 날짜·자정 날짜) 또는 끝낸 한 번짜리 할 일이면 끝낸 날
function lastE82(t){const ds=[gk76(),midKey68()];if(t.status===2&&t.doneAt)ds.push(t.doneAt);
  for(const d of [...new Set(ds)]){const e=((DAYS[d]||{}).entries||[]).find(x=>x.tid===t.id);if(e)return{date:d,e}}return null}
function brvSync82(t){const L=lastE82(t);if(!L||!['act','task','free'].includes(L.e.kind)||L.e.type!=='good')return;const e=L.e;
  if(t.brave){if(e.brave&&!e.bv82)return;const s=bz82(t.bsz71||'m');if(!s||(e.bz82===s.id))return;
    replaceEntry(L.date,e,brvSet82(e,s));toast(`방금 한 기록에도 ⚔️ ${s.name}을 붙였어요 · ✨${Math.max(+((e.bv82||e).xp)||0,+s.xp||0)}`)}
  else if(e.bv82){const n=brvOff82(e);replaceEntry(L.date,e,n);toast('방금 한 기록에서도 용기를 뺐어요')}}
// w71의 고르기 메뉴(data-t71bz)가 t.brave를 바꾼 뒤에 돎(같은 window capture, 나중에 등록)
addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('[data-t71bz]');if(!b)return;
  const t=TASKS[(MB71||{}).id]||TASKS[(sheetCtx||{}).task];if(!t||t.rid)return;try{brvSync82(t)}catch(x){console.error(x)}},true);
// 카드 이은 할 일에 미리 용기를 정해 두면 끝낼 때 기록에 붙음
applyEntry=(function(prev){return function(day,e){try{if(e&&e.tid&&e.aid&&e.type==='good'&&!e.brave&&!e.bv82){const t=TASKS[e.tid];
  if(t&&t.brave&&!t.rid){const m=+t.mul71||1;if(m!==1&&!e.mul71){e.xp=Math.round((+e.xp||0)*m);e.gold=Math.round((+e.gold||0)*m);e.cond=Math.round((+e.cond||0)*m);e.mul71=m}
    const s=bz82(t.bsz71||'m');if(s)Object.assign(e,brvSet82(e,s))}}}catch(x){console.error(x)}return prev.apply(this,arguments)}})(applyEntry);
taskBase=(function(prev){return function(t){const b=prev.apply(this,arguments);try{if(t&&b&&t.aid&&t.brave&&!t.rid&&!t.px){const s=bz82(t.bsz71||'m');
  if(s)return{...b,xp:Math.max(+b.xp||0,+s.xp||0),gold:Math.max(+b.gold||0,+s.gold||0),brave:s}}}catch(x){}return b}})(taskBase);
// 스낵바 ⚔️: 이 기록에만
var B82=null;
snack=(function(prev){return function(e,date){const r=prev.apply(this,arguments);try{const s=$('snack');if(s&&e&&brvOk82(e)&&!s.querySelector('[data-snack82]')){
  const u=s.querySelector('[data-snack="undo"]');const h=`<button data-snack82="1" title="해 보니 용기가 들었다면 · 이 기록에만 ⚔️ 용기 점수">${e.brave?'⚔️✓':'⚔️'}</button>`;
  if(u)u.insertAdjacentHTML('beforebegin',h);else s.insertAdjacentHTML('beforeend',h)}}catch(x){console.error(x)}return r}})(snack);
addEventListener('click',ev=>{const T=ev.target;if(!T||!T.closest)return;let b;
  if((b=T.closest('[data-snack82]'))){ev.preventDefault();ev.stopPropagation();if(!snackRef)return;const{date,id}=snackRef,e=((DAYS[date]||{}).entries||[]).find(x=>x.id===id);if(!e)return;
    clearTimeout(snackT);B82={date,id};const r=b.getBoundingClientRect(),cur=e.brave?(e.bz82||''):'';
    menu61At(r.left,r.top-8,`<div class="m61h">⚔️ 해 보니 용기가 들었나요? <small class="muted">이 기록에만</small></div>${[['','용기 아님'],...C.courageSizes.map(z=>[z.id,`${z.name} · ✨${z.xp}${z.gold?' 💰'+z.gold:''}`])].map(([k,l])=>`<button type="button" role="menuitem" data-b82z="${k}" aria-pressed="${cur===k}">${esc(l)}</button>`).join('')}`);
    $('snack').hidden=true;return}
  if((b=T.closest('[data-b82z]'))){ev.preventDefault();ev.stopPropagation();closeMenu61();if(!B82)return;const{date,id}=B82;B82=null;const e=((DAYS[date]||{}).entries||[]).find(x=>x.id===id);if(!e)return;
    const k=b.dataset.b82z;
    if(!k){const n=brvOff82(e);if(n){replaceEntry(date,e,n);toast('이 기록에서 용기를 뺐어요')}return}
    if(e.brave&&!e.bv82){toast('이미 용기 기록이에요');return}
    const s=bz82(k);if(!s)return;replaceEntry(date,e,brvSet82(e,s));toast(`⚔️ ${s.name} — 해냈네요 · ✨${Math.max(+((e.bv82||e).xp)||0,+s.xp||0)}`)}
},true);
F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['⚔️ 해 보니 용기였어요','할 일 상세 ⚔️ 칩 · 기록 뒤 아래 알림 ⚔️','카드로 이은 할 일도 용기 칩이 늘 있어요. 끝낸 뒤 골라도 방금 기록에 용기 점수가 붙어요(알림의 ⚔️는 그 기록에만)',()=>{location.hash='tasks'},'용기 사후 brave 나중에']])}})(F67);
