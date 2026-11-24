/* ---- v13.1 (w129.js): 관리 할 일 = 일반 할 일처럼 · ○ 체크 고침 · 끝낸 자리 지키기 · 관리 창 띄워 두고 시간표에 끌어 놓기 ----
   ① 끝낸 블록 시각: w106이 doneBlk77·allday84를 다시 선언하면서 기록의 '보이는 시각'(e.ct105, w105)을 버렸음 → 끝낸 일을 시간표로
      끌어 옮겨도(수질 점검) 종일 칸에 남았음. 여기서 다시 선언: 시각 = e.ct105(있으면, ''=종일) > tm106(t.time·정한 날·놓은 관리).
   ② 놓은 관리를 끝내면 놓은 자리(t.cs126)가 지워져 끝낸 블록이 종일 칸으로 갔음 → 끝낼 때 그 기록에 ct105=놓은 시각.
   ③ 체크를 풀면(removeEntry) t.last가 그대로 남던 것 → 그 날 기록이 더 없으면 남은 기록 중 가장 늦은 날로(없으면 지움).
   ④ ○/✓ 한 줄 규칙: 시간표 블록·종일 칩(월 칸 제외)엔 열린 일 ○(data-tdone) · 끝낸 일 ✓(data-un129 = 그 날 기록 지우기).
      관리 창 줄도 같음: 오늘 한 관리는 '✓ 오늘 한 관리' 칸에 ✓로 남고 누르면 체크가 풀림. 주 N회는 '이번 주 n/N'.
   ⑤ 관리 창(careSheet76)·관리 놓기 시트(deck128) 줄을 꾹 눌러(PC는 그냥) 시간표로 끌면 그 자리에 놓임(w126 dndEnd가 place126).
      끄는 동안 창이 투명해지고 아래 시간표가 받음(body.dg129). 창 머리를 끌면 '띄운 창'(body.fl129)이 되어 시간표를 가리지 않는 곳에
      둘 수 있음(위치·크기 localStorage hq_fl129). 📌 단추 = 띄우기/붙이기(캘린더가 안 보이는 화면이면 캘린더로 감).
   ⑥ 관리 창에서 연 다른 창(할 일 상세·📅 놓기 …)을 닫으면 관리 창으로 돌아옴(FL.ret). */
/* ---------- ① 끝낸 블록 시각(ct105) ---------- */
const ctW129=(t,e,k)=>e&&e.ct105!==undefined&&e.ct105!==null?e.ct105:tm106(t,k);
function doneBlk77(k){const out=[],seen=new Set(),p=CAL77;CAL77=1;let es=[];try{es=doneOn(k)}finally{CAL77=p}
  es.forEach(e=>{const t=TASKS[e.tid];if(!t||seen.has(t.id)||t.cb76||isStep62(t))return;const tm=ctW129(t,e,k);if(!tm)return;
    const once=t.status===2&&t.doneAt===k,rep=repDone106(t,k);if(!once&&!rep)return;seen.add(t.id);out.push({t:tm===t.time?t:Object.assign({},t,{time:tm}),e,once})});
  return out}
function allday84(){const pane=$('calPane');if(!pane||!calShown())return;
  let most=0;
  pane.querySelectorAll('.tgall [data-drop^="allday:"]').forEach(c=>{const k=c.dataset.drop.slice(7);c.querySelectorAll('.dd84').forEach(x=>x.remove());
    const ds=doneTasks84(k).list.filter(({t,e})=>!ctW129(t,e,k));
    if(ds.length)c.insertAdjacentHTML('beforeend',ds.map(({t,once})=>chip84(t,once,'dd84').replace('<div class="cchip','<div data-drag="done105:'+t.id+'" data-dragmode="hold" class="cchip')).join(''));
    most=Math.max(most,c.querySelectorAll('.cchip').length)});
  const tg=pane.querySelector('.alltog');if(tg&&most>3&&!/[▾▴]/.test(tg.textContent))tg.textContent='종일 '+(ui.allOpen?'▴':'▾')}

{
const gK=()=>gk76(),mK=()=>midKey68();
const isCareCtx=()=>!!(sheetCtx&&(sheetCtx.c76||sheetCtx.d128));
const entToday=(t,k)=>{const d=DAYS[k||gK()];return d&&(d.entries||[]).filter(e=>e.tid===t.id).pop()||null};

/* ---------- ② 놓은 관리를 끝내면 그 자리에 ✓ ---------- */
completeTask=(function(prev){return function(t){const cs=t&&t.status===0&&t.cs126&&t.cs126.m&&t.cs126.d===mK()?t.cs126.m:null,csO=cs?clone(t.cs126):null;
  let day=null,before=null;if(cs){try{day=curDay();before=new Set(day.entries||[])}catch(x){}}
  const r=prev.apply(this,arguments);
  if(cs&&day){try{const e=(day.entries||[]).filter(x=>!before.has(x)&&x.tid===t.id).pop();if(e&&e.ct105===undefined){const n=clone(e);n.ct105=cs;n.cs129=csO;replaceEntry(day.date,e,n);render()}}catch(x){console.error(x)}}
  return r}})(completeTask);

/* ---------- ③ 체크 풀면 t.last도 ---------- */
removeEntry=(function(prev){return function(date,id){const d=DAYS[date],e=d&&(d.entries||[]).find(x=>x.id===id),tid=e&&e.tid,cs=e&&e.cs129;
  const r=prev.apply(this,arguments);
  try{const t=tid&&TASKS[tid];if(t&&cs&&!t.cs126&&t.status===0&&t.due===cs.d){t.cs126=clone(cs);saveTask(t);render()}}catch(x){console.error(x)}   // 놓은 관리 체크를 풀면 놓은 자리도 되살림
  try{const t=tid&&TASKS[tid];if(t&&t.last===date&&!t.rid&&!isStep62(t)&&!((DAYS[date]||{}).entries||[]).some(x=>x.tid===tid)){
    let best=null;Object.values(DAYS).forEach(dd=>{if(dd&&dd.date&&dd.date!==date&&(dd.entries||[]).some(x=>x.tid===tid)&&(!best||dd.date>best))best=dd.date});
    if(best)t.last=best;else delete t.last;saveTask(t)}}catch(x){console.error(x)}
  return r}})(removeEntry);
function unDone129(tid,k){const t=TASKS[tid];if(!t)return;k=k||gK();let e=entToday(t,k);
  if(!e){const p=CAL77;CAL77=1;try{e=doneOn(k).filter(x=>x.tid===tid).pop()||null}finally{CAL77=p}}
  if(!e){toast('지울 기록을 못 찾았어요');return}
  const date=Object.values(DAYS).find(d=>(d.entries||[]).includes(e)).date;removeEntry(date,e.id);toast(`'${t.title}' 체크를 풀었어요`)}
window.unDone129=unDone129;

/* ---------- ④ 시간표 블록 ○ / ✓ ---------- */
function ckAll(){
  document.querySelectorAll('#calPane [data-ctask], #tt84slot [data-ctask]').forEach(el=>{
    if(el.classList.contains('bar83')||el.closest('.mgrid')||el.querySelector(':scope > .ck128'))return;
    if(!el.matches('.blk,.cchip'))return;
    const t=TASKS[el.dataset.ctask];if(!t||t.cb76||t.ml80||isStep62(t))return;
    if(el.offsetWidth&&el.offsetWidth<54)return;   // 폰 주 보기처럼 아주 좁은 칸은 제목이 먼저
    const b=document.createElement('button');b.type='button';b.className='ck128';
    if(el.classList.contains('done')){const k=d105(el);if(!k)return;b.classList.add('on129');b.setAttribute('data-un129',t.id+'|'+k);b.textContent='✓';
      b.setAttribute('aria-label',(t.title||'')+' 체크 풀기');b.title='체크 풀기 (이 날 기록 지우기)'}
    else{if(t.status!==0)return;b.setAttribute('data-tdone',t.id);b.textContent='○';b.setAttribute('aria-label',(t.title||'')+' 끝냈어요 (체크)');b.title='끝냈어요'}
    el.classList.add('has128');el.appendChild(b)})}
render=(function(prev){return function(){const r=prev.apply(this,arguments);try{ckAll()}catch(e){console.error(e)}return r}})(render);
renderCal=(function(prev){return function(){const r=prev.apply(this,arguments);try{ckAll()}catch(e){console.error(e)}return r}})(renderCal);
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-un129]');if(!b)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  if(!guard())return;const [id,k]=b.dataset.un129.split('|');lastPt={x:e.clientX,y:e.clientY};unDone129(id,k)},true);

/* ---------- ⑤-1 관리 창 줄: ✓ 오늘 한 관리 · 주 N회 n/N · 끌기 ---------- */
function wkTxt(t){if(!(t.rep&&t.rep.f==='x'))return '';const n=wkCnt91(t,weekStart(mK())),N=+t.rep.n||3;return `이번 주 ${n}/${N}`}
function decoCare(){const sc=$('sheetC');if(!sc||!(sheetCtx&&sheetCtx.c76)||sc.querySelector('.dn129w'))return;
  const k=gK(),done=careAll76().filter(t=>entToday(t,k)).concat(Object.values(TASKS).filter(t=>t.status===2&&t.care76&&t.doneAt===k&&entToday(t,k)));
  const ids=new Set(done.map(t=>t.id));
  sc.querySelectorAll('.c76r').forEach(r=>{const c=r.querySelector('[data-tdone]');const t=c&&TASKS[c.dataset.tdone];if(!t)return;
    if(isCare76(t)&&!r.hasAttribute('data-drag')){r.setAttribute('data-drag','task:'+t.id);r.setAttribute('data-dragmode','hold');r.classList.add('dg129')}
    const w=wkTxt(t),sm=r.querySelector('.c76t small');if(w&&sm&&!sm.dataset.w129){sm.dataset.w129=1;sm.textContent=w+' · '+sm.textContent}
    if(ids.has(t.id)&&r.closest('details.c76d')&&!(t.rep&&t.rep.f==='x'))r.remove()});   // 오늘 한 건 아래 '✓ 오늘 한 관리'에만
  const w=document.createElement('div');w.className='dn129w';
  if(done.length){w.innerHTML=`<div class="c76g">✓ 오늘 한 관리 ${done.length}개 <small class="muted">· ✓를 누르면 체크가 풀려요</small></div><div class="c76l">${done.map(t=>{const e=entToday(t,k),nx=t.status===0?when76(t,mK()):'';
      return `<div class="c76r dn129"><button type="button" class="tchk on129" data-un129="${esc(t.id)}|${k}" aria-label="${esc(t.title)} 체크 풀기">✓</button><span class="c76t" data-ctask="${esc(t.id)}" role="button" tabindex="0"><b>${esc(t.title)}</b><small>✓ ${esc((e&&(e.ct105||e.t))||'')}${wkTxt(t)?' · '+wkTxt(t):''}${nx?' · 다음 '+esc(nx):''}</small></span></div>`}).join('')}</div>`}
  const after=sc.querySelector(':scope > .c76l, :scope > .empty');if(after)after.after(w);else sc.appendChild(w)}
/* 관리 놓기 시트(deck128) 줄: ○ · 이름 누르면 상세 · 끌기 */
function decoDeck(){const sc=$('sheetC');if(!sc||!(sheetCtx&&sheetCtx.d128))return;
  sc.querySelectorAll('.d128r[data-d128r]').forEach(r=>{if(r.dataset.k129)return;r.dataset.k129=1;const t=TASKS[r.dataset.d128r];if(!t)return;
    r.setAttribute('data-drag','task:'+t.id);r.setAttribute('data-dragmode','hold');r.classList.add('dg129');
    const ti=r.querySelector('.d128t');if(ti){ti.setAttribute('data-ctask',t.id);ti.setAttribute('role','button');ti.tabIndex=0;ti.style.cursor='pointer'}
    const w=wkTxt(t),sm=r.querySelector('.d128t small');if(w&&sm)sm.textContent=w+' · '+sm.textContent;
    const c=document.createElement('button');c.type='button';c.className='tchk';c.setAttribute('data-tdone',t.id);c.setAttribute('aria-label',(t.title||'')+' 했어요');
    const lab=r.querySelector('.d128c');if(lab)lab.after(c);else r.prepend(c)})}
/* 머리줄: 📌 띄우기 단추 + 끌기 손잡이 표시 */
function decoHead(){const sc=$('sheetC');if(!sc||!isCareCtx())return;const h=sc.querySelector(':scope > .sh');if(!h||h.querySelector('[data-fl129]'))return;
  h.classList.add('mv129');const b=document.createElement('button');b.type='button';b.className='ib fl129b';b.setAttribute('data-fl129','1');
  b.textContent=FL.on?'📌 붙이기':'📌 띄우기';b.title=FL.on?'가운데 창으로 되돌리기':'창을 띄워 시간표를 보며 끌어 놓기 (머리를 끌어 옮겨요)';
  const x=h.querySelector('.x');if(x)h.insertBefore(b,x);else h.appendChild(b);
  if(!sc.querySelector('.hint129')){const p=document.createElement('p');p.className='hint129 tiny muted';p.textContent=FL.on?'줄을 꾹 눌러(PC는 그냥) 시간표로 끌면 그 자리에 놓여요 · 창 머리를 끌어 옮겨요':'줄을 꾹 눌러(PC는 그냥) 캘린더 시간표로 끌어 놓을 수 있어요 · 📌 띄우기 = 시간표를 보며 놓기';h.after(p)}}
function deco(){try{decoCare()}catch(e){console.error(e)}try{decoDeck()}catch(e){console.error(e)}try{decoHead()}catch(e){console.error(e)}}
window.deco129=deco;

/* ---------- ⑤-2 띄운 창 ---------- */
const FL={on:false,pos:null,ret:null,cur:null,jc:null};
try{const v=JSON.parse(localStorage.getItem('hq_fl129')||'null');if(v){FL.on=!!v.on;FL.pos=v.pos||null}}catch(e){}
function flSave(){try{localStorage.setItem('hq_fl129',JSON.stringify({on:FL.on,pos:FL.pos}))}catch(e){}}
function defPos(){const W=innerWidth,H=innerHeight;if(W<760)return {x:6,y:Math.round(H*.5),w:W-12,h:Math.round(H*.48)};
  return {x:Math.max(8,W-460),y:70,w:440,h:Math.min(640,H-90)}}
function fit(p){const W=innerWidth,H=innerHeight,w=Math.min(Math.max(260,p.w||420),W-8),h=Math.min(Math.max(180,p.h||420),H-8);
  return {x:clamp(p.x,4-w+80,W-80),y:clamp(p.y,4,H-44),w,h}}
function flApply(){const sc=$('sheetC'),open=!$('sheet').hidden&&isCareCtx();
  const on=FL.on&&open;document.body.classList.toggle('fl129',on);
  if(!sc)return;if(on){const p=fit(FL.pos||defPos());FL.pos=p;sc.style.left=p.x+'px';sc.style.top=p.y+'px';sc.style.width=p.w+'px';sc.style.height=p.h+'px';document.body.style.overflow=''}
  else if(sc.style.left||sc.style.top){sc.style.left=sc.style.top=sc.style.width=sc.style.height=''}}
function flSet(on){FL.on=on;flSave();
  if(on&&!calShown()){const c=sheetCtx&&sheetCtx.c76,d=sheetCtx&&sheetCtx.d128;closeSheet();location.hash='cal';setTimeout(()=>{if(d&&window.deck128)window.deck128();else careSheet76(c)},350);return}
  const sc=$('sheetC');if(sc){const h=sc.querySelector('[data-fl129]');if(h)h.remove();const p=sc.querySelector('.hint129');if(p)p.remove()}
  flApply();deco()}
window.fl129=flSet;
openSheet=(function(prev){return function(){const was=!$('sheet').hidden&&FL.cur?FL.cur:FL.jc;   // sheetCtx는 여는 쪽이 먼저 바꿔 둠 → 지금 열린 창은 FL.cur로
  const r=prev.apply(this,arguments);
  try{if(isCareCtx()){FL.ret=null;FL.cur={c76:sheetCtx.c76,d128:sheetCtx.d128}}else{FL.cur=null;if(was)FL.ret=was}flApply();deco()}catch(e){console.error(e)}return r}})(openSheet);
closeSheet=(function(prev){return function(){const wasCare=isCareCtx(),ret=!wasCare?FL.ret:null,jc=wasCare&&!$('sheet').hidden?{c76:sheetCtx.c76,d128:sheetCtx.d128}:null;FL.cur=null;const r=prev.apply(this,arguments);
  try{document.body.classList.remove('fl129');const sc=$('sheetC');if(sc&&!isCareCtx()){sc.style.left=sc.style.top=sc.style.width=sc.style.height=''}
    if(wasCare){FL.ret=null;FL.jc=jc;setTimeout(()=>{FL.jc=null},0)}   // 같은 순간에 다른 창이 열리면(상세 열기 = 닫고 열기) 관리 창에서 연 것
    if(ret){FL.ret=null;setTimeout(()=>{if(!$('sheet').hidden||document.body.classList.contains('docked'))return;if(ret.d128&&window.deck128)window.deck128();else careSheet76(ret.c76)},30)}}catch(e){console.error(e)}
  return r}})(closeSheet);
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-fl129]');if(!b)return;e.preventDefault();e.stopPropagation();flSet(!FL.on)},true);
// 머리 끌기 = 창 옮기기
let MV=null;
addEventListener('pointerdown',e=>{if(e.button>0||$('sheet').hidden||!isCareCtx())return;const h=e.target.closest&&e.target.closest('#sheetC > .sh, #sheetC > .grab');
  if(!h||e.target.closest('button,input,select,a,label,textarea'))return;const sc=$('sheetC');MV={x:e.clientX,y:e.clientY,on:false,r:sc.getBoundingClientRect()}},true);
addEventListener('pointermove',e=>{if(!MV)return;const dx=e.clientX-MV.x,dy=e.clientY-MV.y;
  if(!MV.on){if(Math.hypot(dx,dy)<6)return;MV.on=true;if(!FL.on){FL.on=true;FL.pos={x:MV.r.left,y:MV.r.top,w:MV.r.width,h:Math.min(MV.r.height,innerHeight*.7)};flSave();flApply();
      const sc=$('sheetC'),b=sc&&sc.querySelector('[data-fl129]');if(b){b.textContent='📌 붙이기';b.title='가운데 창으로 되돌리기'}}}
  e.preventDefault();const p=FL.pos||defPos();FL.pos=fit({x:MV.r.left+dx,y:MV.r.top+dy,w:p.w,h:p.h});const sc=$('sheetC');if(sc){sc.style.left=FL.pos.x+'px';sc.style.top=FL.pos.y+'px'}},{capture:true,passive:false});
addEventListener('pointerup',e=>{if(!MV)return;const on=MV.on;MV=null;if(on){flSave();const s=ev=>{ev.stopPropagation();ev.preventDefault()};addEventListener('click',s,{capture:true,once:true});setTimeout(()=>removeEventListener('click',s,true),80)}},true);
addEventListener('pointercancel',()=>{MV=null},true);
// 크기 바꾼 것 기억(PC: 오른쪽 아래 모서리)
try{new ResizeObserver(()=>{if(!document.body.classList.contains('fl129')||MV)return;const sc=$('sheetC');if(!sc)return;const r=sc.getBoundingClientRect();
  if(FL.pos&&(Math.abs(r.width-FL.pos.w)>2||Math.abs(r.height-FL.pos.h)>2)){FL.pos.w=Math.round(r.width);FL.pos.h=Math.round(r.height);flSave()}}).observe($('sheetC'))}catch(e){}
addEventListener('resize',()=>{if(document.body.classList.contains('fl129'))flApply()});
// 줄 끌기: 끄는 동안 창을 비켜 줌(아래 시간표가 받게)
document.addEventListener('pointerdown',e=>{const r=e.target.closest&&e.target.closest('#sheetC [data-drag].dg129');if(r)document.body.classList.add('dg129')},true);
const dgOff=()=>setTimeout(()=>{if(!(typeof DND!=='undefined'&&DND.on))document.body.classList.remove('dg129')},0);
document.addEventListener('pointerup',dgOff,true);document.addEventListener('pointercancel',dgOff,true);
// 다시 그릴 때마다(찾기·정렬로 목록만 바뀔 때도) 줄 꾸미기
try{new MutationObserver(()=>{if(!$('sheet').hidden&&isCareCtx())deco()}).observe($('sheetC'),{childList:true,subtree:true})}catch(e){}

/* F67 기능 지도 */
F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['📌 관리 창 띄워 두고 시간표에 끌어 놓기','홈·할 일 🧽 관리 줄 → 관리 창 머리 끌기(또는 📌 띄우기)','관리 창을 시간표를 가리지 않는 곳에 띄워 두고, 줄을 꾹 눌러(PC는 그냥) 시간표로 끌면 그 날·그 시각에 놓여요. 창 안에서 연 상세를 닫으면 관리 창으로 돌아와요',()=>{careSheet76()},'관리 창 띄우기 끌기 팝업 옮기기 시간표 놓기 배치'],
  ['○ 시간표에서 바로 체크','캘린더 1일·3일·주 시간표 블록·종일 칩 오른쪽 위 ○','눌러서 바로 끝내요(상세 안 열림). 끝낸 블록의 ✓를 누르면 체크가 풀려요. 관리 창에서도 오늘 한 관리는 ✓로 남아요',()=>{location.hash='cal'},'체크 완료 동그라미 시간표 블록 끝냄 되돌리기']])}})(F67);
}
