/* ---- v10.6 (w105.js): 11/14 밤 피드백 묶음 ----
   ① 내일 짜기(w93.js 안에서 직접 고침): ← 뒤로 · 루틴·끼니 옮기기 · ⋯ 옵션.
   ② 지난 날 끝낸 일(캘린더): 끝낸 블록·종일 칩을 누르면 메뉴(✎ 열기 · ↩ 체크 해제 · 🕒 시각 바꾸기) · 길게 눌러(PC는 끌어) 같은 날 안에서 시각 옮기기.
      기록(e)에 e.ct105 = 'HH:MM'(그 기록을 캘린더에 그릴 시각) 또는 ''(종일) — 할 일 자체의 시각(t.time)은 안 건드림(반복 할 일의 평소 시각이 바뀌면 안 되므로). 없으면 t.time.
      doneBlk77·calAfter77·allday84는 여기서 다시 선언(마지막 선언이 이김) — 끝낸 블록을 또 고치면 이쪽을 고칠 것. 체크 해제 = removeEntry(날짜,기록 id) 한 길(할 일 되돌리기·점수 빼기는 거기서).
   ③ 관리로 넣기 되돌리기: C.careHist105=[{id,at,rep,due,time}] — careOn77 감싸개가 넣기 직전 값을 적고, 🧽 관리 창에 '↶ 최근에 관리로 넣은 것' 칸(할 일로 되돌리기).
   ④ 루틴 카드(openRt61) '📅 언제' 줄에 눈에 보이는 '⏭ 오늘은 건너뛰기' 단추.
   ⑤ 주 N회: 캘린더 위 줄을 한 줄 칩으로 · 칩을 누르면 창(세는 기록·정한 날·목표 고치기·할 일 열기) · 같은 이름 겹침 정리. */

/* ================= ② 지난 날 끝낸 일 ================= */
const ctOf105=(t,e)=>e&&e.ct105!==undefined?e.ct105:(t.time||'');
function doneBlk77(k){const out=[],seen=new Set(),p=CAL77;CAL77=1;let es=[];try{es=doneOn(k)}finally{CAL77=p}
  es.forEach(e=>{const t=TASKS[e.tid];if(!t||seen.has(t.id)||!ctOf105(t,e)||t.cb76||isStep62(t))return;
    const once=t.status===2&&t.doneAt===k,rep=t.status===0&&t.rep&&t.rep.f&&t.due!==k;if(!once&&!rep)return;seen.add(t.id);out.push({t,e,once})});
  return out}
function calAfter77(){const pane=$('calPane');if(!pane||!calShown())return;const cs=C.ui.cal||{},byList=cs.color==='list',W=cs.actual!==false?82:100;
  pane.querySelectorAll('.tgcol[data-drop^="col:"]').forEach(col=>{const k=col.dataset.drop.slice(4);
    col.querySelectorAll('.blk.done').forEach(x=>x.remove());
    const h=doneBlk77(k).map(({t,e,once})=>{const s=toMin(ctOf105(t,e)),l=byList?lcOf70(t):null;
      const em=byList?(listEmoji(t.list)||listName(listOk(t.list)?t.list:'inbox').replace(/^[^\p{L}\p{N}]+/u,'').slice(0,2)):'';
      return `<div class="blk done d77${l?' lc70':''}" data-drag="done105:${t.id}" data-dragmode="hold" style="top:${yOf(s)}px;height:${Math.max(14,yOf(s+(t.dur||30))-yOf(s)-2)}px;left:1px;width:calc(${W}% - 3px);${l?`--lc70:${l.color};border-left:4px solid ${l.color};background:color-mix(in srgb,${l.color} 13%,var(--panel))`:''}" data-ctask="${t.id}" title="✓ 끝냄${e.t?' '+esc(e.t):''} · ${esc(t.title)} · 누르면 메뉴(체크 해제·시각 바꾸기)${l?' · '+esc(l.name||''):''}">${em?`<span class="ck58">${esc(em)}</span>`:''}<span class="bt">✓ ${esc(t.title)}</span></div>`}).join('');
    if(h){const first=col.querySelector('.blk,.act-lane,.nowl');if(first)first.insertAdjacentHTML('beforebegin',h);else col.insertAdjacentHTML('beforeend',h)}
    col.querySelectorAll('.blk').forEach(b=>{const ht=parseFloat(b.style.height)||0;b.classList.toggle('sm77',ht<30);b.classList.toggle('xs77',ht<18);
      if(ht>=44)b.style.setProperty('--tl77',Math.min(4,Math.max(1,Math.floor((ht-18)/14))));else b.style.removeProperty('--tl77')})});
  const bs=[...pane.querySelectorAll('.tgcol .blk')],ws=bs.map(b=>b.offsetWidth);bs.forEach((b,i)=>b.classList.toggle('nw77',ws[i]>0&&ws[i]<76))}
function allday84(){const pane=$('calPane');if(!pane||!calShown())return;
  let most=0;
  pane.querySelectorAll('.tgall [data-drop^="allday:"]').forEach(c=>{const k=c.dataset.drop.slice(7);c.querySelectorAll('.dd84').forEach(x=>x.remove());
    const ds=doneTasks84(k).list.filter(({t,e})=>!ctOf105(t,e));
    if(ds.length)c.insertAdjacentHTML('beforeend',ds.map(({t,once})=>chip84(t,once,'dd84').replace('<div class="cchip','<div data-drag="done105:'+t.id+'" data-dragmode="hold" class="cchip')).join(''));
    most=Math.max(most,c.querySelectorAll('.cchip').length)});
  const tg=pane.querySelector('.alltog');if(tg&&most>3&&!/[▾▴]/.test(tg.textContent))tg.textContent='종일 '+(ui.allOpen?'▴':'▾')}
// 끝낸 블록·칩이 놓인 날(열) 찾기
function d105(el){const c=el&&el.closest&&el.closest('[data-drop]');const dv=c&&c.dataset.drop;if(!dv)return null;const k=dv.slice(dv.indexOf(':')+1);return /^\d{4}-\d\d-\d\d$/.test(k)?k:null}
function entOf105(k,tid){const p=CAL77;CAL77=1;try{return doneOn(k).find(e=>e.tid===tid)||null}finally{CAL77=p}}
function setCt105(k,tid,v){const e=entOf105(k,tid);if(!e)return false;const n=clone(e);n.ct105=v;replaceEntry(k,e,n);return true}
function ctSheet105(k,tid){const t=TASKS[tid],e=entOf105(k,tid);if(!t||!e)return;sheetCtx={ct105:{k,tid}};
  openSheet(`<div class="sh"><h3>🕒 ${esc(t.title)} · 캘린더에 그리는 시각</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <p class="small" style="margin:4px 0 8px">${esc(fmtD(k))} 끝낸 기록을 캘린더에서 몇 시에 보일지만 바꿔요. 점수·기록 시각은 그대로고, 할 일의 평소 시각도 안 바뀌어요.</p>
    <div class="row" style="gap:8px;flex-wrap:wrap"><input type="time" id="ct105v" value="${esc(ctOf105(t,e)||e.t||'')}" aria-label="시각"><button type="button" class="btn" data-ct105="save">이 시각으로</button><button type="button" class="btn ghost" data-ct105="allday">종일 칸으로</button><button type="button" class="btn ghost" data-sheet="close">취소</button></div>`)}
function doneMenu105(el,x,y){const tid=el.dataset.ctask,k=d105(el),t=TASKS[tid];if(!t||!k)return false;const e=entOf105(k,tid);if(!e)return false;
  menu61(x,y,`✓ ${esc(t.title.length>20?t.title.slice(0,20)+'…':t.title)} · ${esc(fmtD(k))}`,[
    {l:'✎ 할 일 열기',f:()=>openTaskSheet(tid)},
    {l:'↩ 체크 해제 (이 기록 지우기)',bad:1,f:()=>{removeEntry(k,e.id);toast(`'${t.title}' 체크를 풀었어요`)}},
    {l:'🕒 캘린더에 보이는 시각 바꾸기…',f:()=>ctSheet105(k,tid)}]);return true}
addEventListener('click',e=>{const el=e.target.closest&&e.target.closest('.blk.done.d77[data-ctask],.cchip.done.d84[data-ctask]');if(!el)return;
  if(typeof lpFired!=='undefined'&&lpFired)return;if(typeof DND!=='undefined'&&DND.on)return;
  if(doneMenu105(el,e.clientX,e.clientY)){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation()}},true);
addEventListener('contextmenu',e=>{const el=e.target.closest&&e.target.closest('.blk.done.d77[data-ctask],.cchip.done.d84[data-ctask]');if(!el)return;
  if(doneMenu105(el,e.clientX,e.clientY)){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation()}},true);
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-ct105]');if(!b)return;e.preventDefault();e.stopPropagation();
  const c=(sheetCtx||{}).ct105;if(!c){closeSheet();return}
  if(b.dataset.ct105==='allday'){setCt105(c.k,c.tid,'');closeSheet();return}
  const v=($('ct105v')||{}).value;if(!v||hm80(v)==null){toast('시각을 골라 주세요');return}
  setCt105(c.k,c.tid,v);closeSheet();toast(`${fmtD(c.k)} · ${v}에 보여요`)},true);
// 끌어 옮기기(PC 마우스 끌기 / 폰 꾹): 같은 날 안에서만
dndStart=(function(prev){return function(e){const r=prev.apply(this,arguments);try{if(DND.kind==='done105'&&DND.ghost){const t=TASKS[DND.id];DND.ghost.textContent='✓ '+(t?t.title:'')}}catch(x){}return r}})(dndStart);
dndEnd=(function(prev){return function(x,y){
  if(DND.kind==='done105'){const id=DND.id,drop=DND.drop,k0=d105(DND.el);dndAbort();if(!drop||!k0||!TASKS[id])return;
    if(drop.date!==k0){toast('끝낸 기록은 그날 안에서만 옮겨요 (날짜가 어긋나면 통계가 틀려져요)');return}
    if(drop.type==='time'){if(setCt105(k0,id,hm(drop.min)))toast(`${TASKS[id].title} · 캘린더에 ${hm(drop.min)}로 보여요`)}
    else if(drop.type==='allday'){if(setCt105(k0,id,''))toast(`${TASKS[id].title} · 종일 칸으로`)}
    return}
  return prev.apply(this,arguments)}})(dndEnd);

/* ===== v10.6 ② 관리로 넣기 되돌리기 목록 + 루틴 '오늘은 건너뛰기' 단추 ===== */
(function(){
  const hist=()=>{C.careHist105=(C.careHist105||[]).filter(h=>TASKS[h.id]&&TASKS[h.id].care76&&Date.now()-h.at<30*864e5).slice(-10);return C.careHist105};
  (function(prev){careOn77=function(t,n){try{if(t&&t.id&&!t.care76){C.careHist105=(C.careHist105||[]).filter(h=>h.id!==t.id);C.careHist105.push({id:t.id,at:Date.now(),rep:t.rep?clone(t.rep):null,due:t.due||null,time:t.time||null})}}catch(x){}return prev.apply(this,arguments)}})(careOn77);
  (function(prev){careSheet76=function(k){prev.apply(this,arguments);try{
    const hs=hist().slice().reverse();if(!hs.length)return;const sc=$('sheetC'),anchor=sc&&sc.querySelector('.c76o');if(!anchor)return;
    const d=document.createElement('details');d.className='c76d';
    d.innerHTML=`<summary>↶ 최근에 관리로 넣은 것 ${hs.length}개 <small class="muted">· 잘못 넣었으면 되돌리기</small></summary><div class="c76l">${hs.map(h=>{const t=TASKS[h.id];return `<div class="c76r"><span class="c76t"><b>${esc(t.title)}</b><small>${esc(repLabel(t.rep))}로 바뀌었어요</small></span><button type="button" class="btn sm ghost" data-ch105="${h.id}">↶ 되돌리기</button></div>`}).join('')}</div>`;
    anchor.parentNode.insertBefore(d,anchor)}catch(x){}}})(careSheet76);
  document.addEventListener('click',e=>{const b=e.target.closest('[data-ch105]');if(!b)return;e.preventDefault();e.stopPropagation();
    const id=b.dataset.ch105,h=(C.careHist105||[]).find(x=>x.id===id),t=TASKS[id];if(!h||!t){toast('이미 바뀌었어요');return}
    const k=sheetCtx&&sheetCtx.c76;setCare76(t,false);t.rep=h.rep;t.due=h.due;if(h.time)t.time=h.time;saveTask(t);C.careHist105=C.careHist105.filter(x=>x.id!==id);save('config');render();
    toast(`'${t.title}'을 관리에서 빼고 원래 반복(${t.rep?repLabel(t.rep):'없음'})으로 돌렸어요`);careSheet76(k)},true);
  // 루틴 카드: 오늘 차례면 '⏭ 오늘은 건너뛰기' (폰엔 우클릭이 없어서 눈에 보이는 단추)
  (function(prev){rtCard61=function(r){let h=prev.apply(this,arguments);try{const t=rtT(r),td=dateKey();
    if(t&&t.due&&t.due<=td&&!(t.skip61||[]).includes(td)){const btn=`<button type="button" class="chipbtn" data-sk105="${t.id}">⏭ 오늘은 건너뛰기</button>`;let i=h.indexOf('<span class="tiny muted">다음:');if(i<0)i=h.indexOf('data-x60task="'+t.id+'"');if(i>=0){if(h[i]!=='<')i=h.lastIndexOf('<button',i);h=h.slice(0,i)+btn+h.slice(i)}}}catch(x){}return h}})(rtCard61);
  document.addEventListener('click',e=>{const b=e.target.closest('[data-sk105]');if(!b)return;e.preventDefault();e.stopPropagation();
    const t=TASKS[b.dataset.sk105];if(!t)return;closeSheet();skipToday61(t)},true);
})();
