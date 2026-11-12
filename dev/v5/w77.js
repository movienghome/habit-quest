/* ================= v7.7: 11/12 써 보고 느낀 점 — 캘린더 거르기 하나로 · 끝낸 블록에 목록 색 · 짧은 블록 제목 · 관리 다듬기 · 홈 2단 · 도파민 코스 다시 추천 · 찾기·추가 줄 줄이기 =================
   맨 끝 모듈(w76 뒤, route();boot(); 앞).
   1) 캘린더 거르기 = C.calf77 하나(캘린더 화면·할 일 옆 캘린더가 같이 씀). 끝낸 일·지난 날에도 적용. 종류(루틴·일퀘·반복·한 번·관리)·'고른 것 숨기기'.
   2) 끝낸 블록 = 목록 색·이모지 그대로 + ✓ (반복 할 일도 한 날에 남음). 짧은 블록 = 아이콘·제목 한 줄.
   3) 관리: 제 목록·전체에서는 보임(🧽 표시) · 반복 없는 할 일도 옮김(주기 물음) · 입력 '%' · 상세 칩 · 고르기 창 찾기(한글).
   4) 홈 2단: 폭을 ResizeObserver로(.wrap 폭이 내용 따라 줄던 것도 고침).
   5) 도파민: 🍽 식사 친구 코스 · 상태 셋(몸이 지쳤어요·심신이 지쳤어요·밥 먹어요) · 코스 다시 추천(되돌리기).
   6) 할 일 찾기 = 제목 줄 돋보기 · 추가 단추는 입력칸과 같은 줄. */

/* ---- 1) 캘린더 거르기 ---- */
var CAL77=0,NEED77=0,SHOW77=0;
var KIND77=[['rt','⏱ 루틴'],['q','☑ 일퀘'],['rep','↻ 반복 할 일'],['once','한 번 하는 일'],['care','🧽 관리']];
function flt77(){
  if(!C.mig77f){const f={lists:[],areas:[],tags:[],kinds:[],inv:0};
    try{const bs=calBases72(),src=[bs[1],bs[0]].find(c=>c&&c.filter&&['lists','areas','tags'].some(k=>(c.filter[k]||[]).length));
      if(src){['lists','areas','tags'].forEach(k=>{f[k]=(src.filter[k]||[]).slice()});if(Array.isArray(src.filter.known72))f.known=src.filter.known72.slice()}
      bs.forEach(c=>{if(c)c.filter={lists:[],areas:[],tags:[]}})}catch(e){console.error(e)}
    C.calf77=f;C.mig77f=1;NEED77=1}
  let f=C.calf77;if(!f||typeof f!=='object'||Array.isArray(f))f=C.calf77={};
  ['lists','areas','tags','kinds'].forEach(k=>{if(!Array.isArray(f[k]))f[k]=[]});return f}
function fOn77(f){f=f||flt77();return f.lists.length+f.areas.length+f.tags.length+f.kinds.length}
function kinds77(t){const a=[],rt=!!(t.rid||isStep62(t)),rep=!!(t.rep&&t.rep.f);if(rt)a.push('rt');if(t.quest)a.push('q');if(t.cb76||t.care76)a.push('care');if(rep&&!rt)a.push('rep');if(!rep&&!rt&&!t.cb76)a.push('once');return a}
function calPass(t){const f=flt77();if(!t||!fOn77(f))return true;const L=listOk(t.list)?t.list:'inbox',m={};
  if(f.lists.length)m.lists=f.lists.includes(L);
  if(f.areas.length)m.areas=f.areas.includes(areaOfTask(t));
  if(f.tags.length)m.tags=(t.tags||[]).some(x=>f.tags.some(g=>x===g||String(x).startsWith(g+'/')));
  if(f.kinds.length){const ks=kinds77(t);m.kinds=ks.some(k=>f.kinds.includes(k))}
  if(f.inv)return !Object.values(m).some(Boolean);            // 고른 것 숨기기: 하나라도 맞으면 숨김
  if(m.lists===false&&Array.isArray(f.known)&&!f.known.includes(L))m.lists=true;   // 거르기를 정한 뒤 생긴 목록은 안 거름(v7.2)
  return Object.values(m).every(Boolean)}                     // 고른 것만: 줄끼리는 '그리고', 줄 안은 '또는'
function calFilterN(){return fOn77()}
function passWith72(cfg,t){return calPass(t)}
function calUnhide72(t){const f=flt77();if(calPass(t))return 0;const L=listOk(t.list)?t.list:'inbox',ar=areaOfTask(t),ks=kinds77(t);let n=0;
  if(f.inv){const a=f.lists.length;f.lists=f.lists.filter(x=>x!==L);f.areas=f.areas.filter(x=>x!==ar);f.tags=f.tags.filter(g=>!(t.tags||[]).some(x=>x===g||String(x).startsWith(g+'/')));f.kinds=f.kinds.filter(k=>!ks.includes(k));n=1}
  else{if(f.lists.length&&!f.lists.includes(L)){f.lists.push(L);n++}
    if(f.areas.length&&!f.areas.includes(ar)){if(ar)f.areas.push(ar);else f.areas=[];n++}
    if(f.tags.length&&!(t.tags||[]).some(x=>f.tags.includes(x))){f.tags=[];n++}
    if(f.kinds.length&&!ks.some(k=>f.kinds.includes(k))){if(ks[0])f.kinds.push(ks[0]);else f.kinds=[];n++}}
  save('config');return n}
function calFilterSheet(){const f=flt77(),tags={};Object.values(TASKS).forEach(t=>(t.tags||[]).forEach(x=>{tags[x]=1}));f.tags.forEach(x=>{tags[x]=1});
  const ch=(k,v,l,c)=>{const on=f[k].includes(v);return `<button type="button" class="chipbtn f77c" data-f77="${k}" data-v="${esc(v)}" aria-pressed="${on}"${c?` style="box-shadow:inset 3px 0 0 ${c}"`:''}>${on?'✓ ':''}${l}</button>`};
  const dated=openTasks().filter(t=>t.due&&!t.cb76),hid=dated.filter(t=>!calPass(t)).length,on=fOn77(f);
  const sec=(t,h)=>`<div class="f77s"><span class="small muted">${t}</span><div class="row" style="gap:4px">${h}</div></div>`;
  sheetCtx={cff:1};
  openSheet(`<div class="sh"><h3>캘린더 보일 것 / 숨길 것</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <div class="row" style="gap:6px"><span class="seg3 sm"><button type="button" data-f77m="0" aria-pressed="${!f.inv}">고른 것만 보임</button><button type="button" data-f77m="1" aria-pressed="${!!f.inv}">고른 것은 숨김</button></span>
      <span class="small ${on&&hid?'':'muted'}" id="f77n">${on?`날짜 있는 할 일 ${dated.length}개 중 <b>${dated.length-hid}개 보임</b>${hid?` · 🙈 ${hid}개 숨김`:''}`:'아무것도 안 골라서 전부 보여요'}</span></div>
    ${sec('종류',KIND77.map(([k,l])=>ch('kinds',k,l)).join(''))}
    ${sec('목록',[{id:'inbox',name:listName('inbox')},...C.lists.filter(l=>l.id!=='inbox')].map(l=>ch('lists',l.id,esc(l.name),l.color)).join(''))}
    ${sec('영역',C.areas.map(a=>ch('areas',a.id,esc(a.name))).join(''))}
    ${Object.keys(tags).length?sec('태그',Object.keys(tags).sort().map(t=>ch('tags',t,'#'+esc(t))).join('')):''}
    <p class="help" style="margin:4px 0 0">${f.inv?'고른 것 중 <b>하나라도</b> 맞으면 숨겨요.':'같은 줄에서는 <b>하나라도</b>, 다른 줄끼리는 <b>둘 다</b> 맞아야 보여요 (목록 Limen + 종류 루틴 = Limen의 루틴만).'} 캘린더 화면·할 일 옆 캘린더가 같이 쓰고, <b>끝낸 일·지난 날</b>에도 똑같이 적용돼요.</p>
    <div class="row" style="justify-content:space-between"><button type="button" class="btn ghost sm" data-f77x="1"${on?'':' disabled'}>모두 풀기</button><button class="btn" data-sheet="close">닫기</button></div>`)}
function fApply77(){save('config');calFilterSheet();ui.calKeepScroll=true;try{if(calShown())renderCal()}catch(e){console.error(e)}}
addEventListener('click',e=>{const T=e.target;if(!T||!T.closest)return;let b;
  if((b=T.closest('[data-f77]'))){e.preventDefault();e.stopPropagation();const f=flt77(),k=b.dataset.f77,v=b.dataset.v;if(!Array.isArray(f[k]))return;
    f[k]=f[k].includes(v)?f[k].filter(x=>x!==v):[...f[k],v];if(k==='lists')f.known=['inbox',...C.lists.map(l=>l.id)];fApply77();return}
  if((b=T.closest('[data-f77m]'))){e.preventDefault();e.stopPropagation();flt77().inv=+b.dataset.f77m?1:0;fApply77();return}
  if((b=T.closest('[data-f77x]'))){e.preventDefault();e.stopPropagation();C.calf77={lists:[],areas:[],tags:[],kinds:[],inv:flt77().inv?1:0};fApply77();return}
},true);
// 끝낸 일(기록)도 같은 거르기로 — 캘린더를 그리는 동안만
doneOn=(function(prev){return function(k){const a=prev.apply(this,arguments);if(!CAL77||!fOn77())return a;const inv=!!flt77().inv;return a.filter(e=>{const t=TASKS[e.tid];return t?calPass(t):inv})}})(doneOn);

/* ---- 2) 끝낸 블록: 목록 색 그대로 + ✓ · 짧은 블록: 아이콘·제목 한 줄 ---- */
function doneBlk77(k){const out=[],seen=new Set(),p=CAL77;CAL77=1;let es=[];try{es=doneOn(k)}finally{CAL77=p}
  es.forEach(e=>{const t=TASKS[e.tid];if(!t||seen.has(t.id)||!t.time||t.cb76||isStep62(t))return;
    const once=t.status===2&&t.doneAt===k,rep=t.status===0&&t.rep&&t.rep.f&&t.due!==k;if(!once&&!rep)return;seen.add(t.id);out.push({t,e,once})});
  return out}
function calAfter77(){const pane=$('calPane');if(!pane||!calShown())return;const cs=C.ui.cal||{},byList=cs.color==='list',W=cs.actual!==false?82:100;
  pane.querySelectorAll('.tgcol[data-drop^="col:"]').forEach(col=>{const k=col.dataset.drop.slice(4);
    col.querySelectorAll('.blk.done').forEach(x=>x.remove());
    const h=doneBlk77(k).map(({t,e,once})=>{const s=toMin(t.time),l=byList?lcOf70(t):null;
      const em=byList?(listEmoji(t.list)||listName(listOk(t.list)?t.list:'inbox').replace(/^[^\p{L}\p{N}]+/u,'').slice(0,2)):'';
      return `<div class="blk done d77${l?' lc70':''}" style="top:${yOf(s)}px;height:${Math.max(14,yOf(s+(t.dur||30))-yOf(s)-2)}px;left:1px;width:calc(${W}% - 3px);${l?`--lc70:${l.color};border-left:4px solid ${l.color};background:color-mix(in srgb,${l.color} 13%,var(--panel))`:''}"${once?` data-ctask="${t.id}"`:''} title="✓ 끝냄${e.t?' '+esc(e.t):''} · ${esc(t.title)}${l?' · '+esc(l.name||''):''}">${em?`<span class="ck58">${esc(em)}</span>`:''}<span class="bt">✓ ${esc(t.title)}</span></div>`}).join('');
    if(h){const first=col.querySelector('.blk,.act-lane,.nowl');if(first)first.insertAdjacentHTML('beforebegin',h);else col.insertAdjacentHTML('beforeend',h)}
    col.querySelectorAll('.blk').forEach(b=>{const ht=parseFloat(b.style.height)||0;b.classList.toggle('sm77',ht<30);b.classList.toggle('xs77',ht<18);
      if(ht>=44)b.style.setProperty('--tl77',Math.min(4,Math.max(1,Math.floor((ht-18)/14))));else b.style.removeProperty('--tl77')})});
  // 아주 좁은 블록(여럿이 겹친 주 보기): 아이콘을 빼고 제목에 자리를 줌 — 폭은 한 번에 재고 그다음에 표시
  const bs=[...pane.querySelectorAll('.tgcol .blk')],ws=bs.map(b=>b.offsetWidth);bs.forEach((b,i)=>b.classList.toggle('nw77',ws[i]>0&&ws[i]<76))}
renderCal=(function(prev){return function(){const p=CAL77;CAL77=1;let x;try{x=prev.apply(this,arguments)}finally{CAL77=p}try{calAfter77()}catch(e){console.error(e)}return x}})(renderCal);

/* ---- 3) 관리 다듬기 ---- */
var LP77=null;menu61=(function(prev){return function(x,y){LP77={x,y};return prev.apply(this,arguments)}})(menu61);   // 우클릭 메뉴 자리 = 이어서 뜨는 '며칠마다?' 메뉴 자리
// 제 목록(목록 하나·기본함·전체)에서는 관리·일퀘 할 일도 보임. 오늘·내일·캘린더·홈은 그대로 숨김.
function hid76(t){return !SHOW77&&!!(t&&t.status===0&&(isCare76(t)||qHide76(t)))}
function own77(sel){return /^l:/.test(sel||'')||sel==='inbox'||sel==='all'}
function q77(){return !!(ui.tq71&&ui.tq71.trim()&&curView()==='tasks')}   // 찾는 중이면 관리도 찾음
taskMatches=(function(prev){return function(t,sel){if((own77(sel)||q77())&&t&&!t.cb76){const p=SHOW77;SHOW77=1;try{return prev.apply(this,arguments)}finally{SHOW77=p}}return prev.apply(this,arguments)}})(taskMatches);
function careMark77(){if(curView()!=='tasks')return;const L=$('tList');if(!L)return;const sel=(C.ui.tasks||{}).sel||'today';if(!own77(sel)&&!q77())return;
  L.querySelectorAll('.trow[data-task]').forEach(el=>{const t=TASKS[el.dataset.task];if(!t||t.status!==0||el.querySelector('.c77m'))return;const c=isCare76(t),q=!c&&qHide76(t);if(!c&&!q)return;
    const m=el.querySelector('.tm')||el.querySelector('.tb');if(m)m.insertAdjacentHTML('beforeend',`<span class="c77m" title="${c?'관리 — 오늘·내일 목록과 캘린더 종일 칸에는 안 뜨고 관리 줄에 떠요':'일퀘 할 일 — 오늘 목록 대신 관리 줄에 칩으로 떠요'}">${c?'🧽 관리':'☑ 일퀘'}</span>`)})}
// 주기 어림(이름으로) — 반복 없는 할 일을 관리로 옮길 때 처음 값
function guess77(title){const n=String(title||'');const R=[[/설거지|환기|물 주기|물주기/,1],[/빨래|세탁/,4],[/이불|침구|시트/,14],[/손톱|발톱/,10],[/환수|어항/,14],[/냉장고|필터|배수구|세탁조/,30],[/가계부|분리수거|쓰레기|청소|변기|화장실|욕실|걸레|정리/,7]];
  const m=R.find(([re])=>re.test(n));return m?m[1]:7}
function careOn77(t,n){if(!t)return;if(n>0)t.rep={f:'d',i:n};else if(!(t.rep&&t.rep.f))t.rep={f:'d',i:guess77(t.title)};if(!t.due)t.due=midKey68();setCare76(t,true);const c=cfg76();c.seen=1;if(c.blk==null)c.blk=30}
function cycleMenu77(t,x,y,after){const cur=t.rep&&t.rep.f==='d'?(+t.rep.i||1):0,g=guess77(t.title);
  const opts=[[1,'매일'],[2,'2일마다'],[3,'3일마다'],[7,'7일마다 (매주)'],[10,'10일마다'],[14,'14일마다 (2주)'],[30,'30일마다 (한 달)']];
  menu61(x,y,`↻ '${esc(t.title.length>16?t.title.slice(0,16)+'…':t.title)}' 며칠마다?`,[...opts.map(([n,l])=>({l:(cur===n?'● ':'○ ')+l+(!cur&&n===g?' ← 어림':''),f:()=>after(n)})),'-',
    {l:'✎ 요일·날짜로 정하기 (상세 열기)',f:()=>openTaskSheet(t.id)}])}
function careToggle76(t){if(!t)return;const on=!t.care76,pt=(typeof lastPt==='object'&&lastPt)||{x:innerWidth/2,y:innerHeight/2};
  const go=n=>{const bak=on?{rep:t.rep?clone(t.rep):null,due:t.due||null}:null;
    if(on)careOn77(t,n);else setCare76(t,false);save('config');render();
    toastAct(on?`🧽 '${t.title}' 관리로 (${repLabel(t.rep)}) · 오늘 목록·캘린더 종일 칸에서 빠져요`:`'${t.title}' 관리에서 뺐어요 · 다시 할 일 목록에`,'되돌리기',()=>{if(on){setCare76(t,false);t.rep=bak.rep;t.due=bak.due;saveTask(t)}else setCare76(t,true);render()})};
  if(on&&!(t.rep&&t.rep.f)){cycleMenu77(t,pt.x,pt.y,go);return}
  go(0)}
function carePick76(){const ok=t=>t.status===0&&!t.care76&&!t.rid&&!t.cb76&&!isStep62(t)&&!(t.quest&&t.rep&&t.rep.f);
  const c=Object.values(TASKS).filter(ok);if(!c.length){toast('옮길 할 일이 없어요');return}
  const ord=(typeof listOrder74==='function'?listOrder74():[]),li=t=>{const i=ord.indexOf(t.list||'inbox');return i<0?999:i};
  openPicker61({title:'🧽 관리로 옮길 것 (집안일·몸 돌봄처럼 때 되면 하는 것)',multi:true,tabs:[{k:'task',label:'📋 할 일',
    items:c.sort((a,b)=>li(a)-li(b)||(!!(b.rep&&b.rep.f)-!!(a.rep&&a.rep.f))||String(a.title).localeCompare(String(b.title),'ko')).map(t=>({id:t.id,label:t.title,
      sub:(t.rep&&t.rep.f)?repLabel(t.rep):`반복 없음 → ${guess77(t.title)}일마다로 (옮긴 뒤 바꿔요)`,grp:listName(t.list||'inbox')}))}],
    onPick:sel=>{let n=0,g=0;sel.forEach(({id})=>{const t=TASKS[id];if(!t||!ok(t))return;if(!(t.rep&&t.rep.f))g++;careOn77(t,0);n++});save('config');render();
      if(n)toastAct(`🧽 ${n}개를 관리로 옮겼어요${g?` · 반복이 없던 ${g}개는 주기를 어림으로 정했어요`:''}`,g?'주기 보기':'관리 창',()=>careSheet76(),7000)}})}
function careMenu76(t,x,y){menu61(x,y,`🧽 ${esc(t.title.length>22?t.title.slice(0,22)+'…':t.title)}`,[
  {l:'✎ 열기 (반복·점수 고치기)',f:()=>openTaskSheet(t.id)},
  {l:`↻ 주기 바꾸기 (지금 ${esc(repLabel(t.rep))})`,f:()=>cycleMenu77(t,x,y,n=>{t.rep={f:'d',i:n};saveTask(t);render();toast(`'${t.title}' ${repLabel(t.rep)}`)})},
  {l:'⏭ 이번엔 건너뛰기 (다음 차례로)',dis:!(t.due&&t.due<=midKey68()),f:()=>skipToday61(t)},
  '-',{l:'🧽 관리에서 빼기 (할 일 목록으로)',f:()=>careToggle76(t)}])}
// 입력: '변기청소 %14' = 관리 · 14일마다 / '%' = 관리(주기는 반복 말이 있으면 그것, 없으면 어림) / 🧽 관리 목록에서 적으면 늘 관리
parseQuick=(function(prev){return function(raw,o){let care=null;const s=String(raw||'').replace(/(^|\s)%(\d{0,3})(?=\s|$)/,(m,a,n)=>{care=n?Math.max(1,+n):true;return a});
  const out=prev.call(this,care==null?raw:s.trim(),o);if(care!=null&&out)out.care77=care;return out}})(parseQuick);
parseChips=(function(prev){return function(p){let h=prev.apply(this,arguments);try{if(p&&p.care77)h+=`<span>🧽 관리 · ${typeof p.care77==='number'?p.care77+'일마다':p.rep?esc(repLabel(p.rep)):guess77(p.title)+'일마다'}</span>`}catch(e){}return h}})(parseChips);
newTask=(function(prev){return function(p){const t=prev.apply(this,arguments);try{if(p&&p.care77&&t&&!t.rid){
    if(typeof p.care77==='number')t.rep={f:'d',i:p.care77};else if(!(t.rep&&t.rep.f))t.rep={f:'d',i:guess77(t.title)};
    if(!t.due)t.due=midKey68();t.care76=1;if(t.time){t.ct76=t.time;t.time=null}const c=cfg76();c.seen=1;if(c.blk==null)c.blk=30}}catch(e){console.error(e)}return t}})(newTask);
addTaskFrom=(function(prev){return function(raw,o){try{const ae=document.activeElement;
  if(curView()==='tasks'&&(C.ui.tasks||{}).sel==='care'&&ae&&ae.id==='tAdd'&&!/(^|\s)%\d{0,3}(\s|$)/.test(raw))raw=String(raw)+' %'}catch(e){}
  return prev.call(this,raw,o)}})(addTaskFrom);
// 할 일 상세: 칩 줄에 🧽 관리
drawTaskSheet=(function(prev){return function(){const r=prev.apply(this,arguments);try{
  const sc=$('sheetC'),t=TASKS[(sheetCtx||{}).task];if(!sc||!t||t.status!==0||t.rid||t.cb76||isStep62(t)||sc.querySelector('[data-c77t]'))return r;
  const ch=sc.querySelector('.tchips');if(ch)ch.insertAdjacentHTML('beforeend',`<button type="button" class="chipbtn c77t" data-c77t="${t.id}" aria-pressed="${!!t.care76}" title="${t.care76?'관리에서 빼기 (다시 오늘 목록·캘린더에)':'관리로 — 때 되면 하는 것. 오늘 목록·캘린더 종일 칸에서 빠지고 관리 줄에 떠요'}">🧽 관리${t.care76?' ✓':''}</button>`)
  }catch(e){console.error(e)}return r}})(drawTaskSheet);
addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('[data-c77t]');if(!b)return;e.preventDefault();e.stopPropagation();const t=TASKS[b.dataset.c77t];if(!t)return;
  try{if($('tsTitle')){tsRead();tsCommit(true,false)}}catch(x){}lastPt={x:e.clientX,y:e.clientY};careToggle76(t)},true);
renderTasks=(function(prev){return function(){const x=prev.apply(this,arguments);try{careMark77();tasksBar77()}catch(e){console.error(e)}return x}})(renderTasks);

/* ---- 3b) 고르기 창: 찾는 동안 입력칸을 다시 만들지 않기(한글 조합이 깨져서 찾기가 안 됐음) ---- */
function drawPk61(focus){
  const P=PK61,el=$('pk61');if(!P||!el)return;const T=P.tabs.find(x=>x.k===P.tab)||P.tabs[0];const q=normN(P.q||'');
  let its=(T.items||[]).filter(x=>!q||normN(x.label+' '+(x.sub||'')+' '+(x.grp||'')).includes(q));
  const top=!q?its.filter(x=>(x.score||0)>0).sort((a,b)=>b.score-a.score).slice(0,6):[];
  const groups=[];if(top.length)groups.push(['⭐ 자주 쓰는 것',top]);
  const gm=new Map();its.forEach(x=>{const g=x.grp||'';if(!gm.has(g))gm.set(g,[]);gm.get(g).push(x)});gm.forEach((v,k)=>groups.push([k,v]));
  const isSel=id=>P.sel.some(s=>s.tab===T.k&&s.id===id);
  const item=x=>`<button type="button" class="pk61i ${isSel(x.id)?'on':''}" data-pk61="${esc(x.id)}">${P.multi?`<span class="ck">${isSel(x.id)?'☑':'☐'}</span>`:''}<span class="tx"><b>${esc(x.label)}</b>${x.sub?`<small>${esc(x.sub)}</small>`:''}</span></button>`;
  const tabs=P.tabs.length>1?P.tabs.map(t=>`<button data-pk61tab="${t.k}" aria-pressed="${t.k===T.k}">${t.label} <small>${(t.items||[]).length}</small></button>`).join(''):'';
  const list=groups.map(([g,v])=>`${g?`<div class="pk61g">${esc(g)} <small>${v.length}</small></div>`:''}${v.map(item).join('')}`).join('')||`<div class="empty">${q?'찾는 게 없어요':'고를 게 없어요'}</div>`;
  const foot=`${T.newLabel&&P.q.trim()?`<button class="btn ghost sm" data-pk61new="1">＋ '${esc(P.q.trim())}' ${esc(T.newLabel)}</button>`:T.newLabel?`<span class="tiny muted">찾는 게 없으면 이름을 적고 '${esc(T.newLabel)}'</span>`:''}<span style="flex:1"></span>${P.multi?`<button class="btn sm" data-pk61go="1" ${P.sel.length?'':'disabled'}>넣기 ${P.sel.length||''}</button>`:''}`;
  const inp=$('pk61q'),box=el.querySelector('.pk61box');
  if(box&&inp&&!focus&&box.dataset.t77===P.title){   // 같은 창: 목록·탭·아래 줄만 바꿈
    const tb=box.querySelector('.pk61t');if(tb)tb.innerHTML=tabs;box.querySelector('.pk61l').innerHTML=list;box.querySelector('.pk61f').innerHTML=foot;if(inp.value!==P.q&&document.activeElement!==inp)inp.value=P.q;return}
  el.innerHTML=`<div class="pk61box" role="dialog" aria-label="${esc(P.title)}"><div class="spread"><b>${esc(P.title)}</b><button class="x" data-pk61x="1" aria-label="닫기">×</button></div>
    <input id="pk61q" type="search" placeholder="🔍 찾기" value="${esc(P.q)}" autocomplete="off">
    ${tabs?`<div class="seg pk61t">${tabs}</div>`:''}
    <div class="pk61l">${list}</div>
    <div class="row pk61f">${foot}</div></div>`;
  el.querySelector('.pk61box').dataset.t77=P.title;
  if(focus)setTimeout(()=>{const i=$('pk61q');if(i){i.focus();i.setSelectionRange(i.value.length,i.value.length)}},20);
}
// 조합 중인 글자도 바로 찾기(조합이 끝나야 input이 오는 브라우저)
addEventListener('compositionupdate',e=>{const i=e.target;if(!i||i.id!=='pk61q'||!PK61)return;setTimeout(()=>{if(PK61&&$('pk61q')===i&&PK61.q!==i.value){PK61.q=i.value;drawPk61()}},0)},true);

/* ---- 4) 홈 2단: 폭은 ResizeObserver가 알려 준 값으로(숨은 화면·그리는 순서에 따라 1단으로 굳던 것) ---- */
var HW77=0,RO77=null,TW77=700;
function homeTwo(){const g=$('homeGrid');if(!g)return false;
  if(!RO77&&typeof ResizeObserver!=='undefined'){RO77=new ResizeObserver(es=>{try{const w=Math.round(es[es.length-1].contentRect.width);if(!w)return;HW77=w;
      if((w>=TW77)!==g.classList.contains('two')&&curView()==='home'){applyHome();if(ui.homeEdit)applyHomeEdit()}}catch(e){console.error(e)}});RO77.observe(g)}
  if(HW77)return HW77>=TW77;
  const w=innerWidth>=960?Math.min(innerWidth,1340)-228:innerWidth-28;return Math.min(w,1072)>=TW77}
// 화면을 옮기면 바로 3단·넓은 화면 표시를 맞춤(예전엔 다음에 다시 그릴 때까지 앞 화면 폭이 남아 홈이 넓었다 좁아졌다 했음)
addEventListener('hashchange',()=>setTimeout(()=>{try{const on=splitOn(),B=document.body.classList;if(B.contains('split')!==on||B.contains('wideview')!==(on||curView()==='cal'))placeCal();const g=$('homeGrid');if(g&&curView()==='home'&&HW77&&(HW77>=TW77)!==g.classList.contains('two')){applyHome();if(ui.homeEdit)applyHomeEdit()}}catch(e){}},0));

/* ---- 5) 도파민: 🍽 식사 친구 · 상태 셋 · 코스 다시 추천 ---- */
var MEAL77=[['팟캐스트·라디오 틀고 먹기',20],['영화 리뷰·인터뷰 영상 한 편만',20],['시트콤·예능 한 편 (끝나면 끄기)',25],['화면 없이 천천히 먹기',15]];
var STD77=['app','side','rest','main','meal','dessert','special'];
(function(){try{const has=k=>DSTATE.some(x=>x[0]===k),at=(k,row)=>{const i=DSTATE.findIndex(x=>x[0]===k);DSTATE.splice(i<0?DSTATE.length:i,0,row)};
  if(!has('body'))at('stuck',['body','🥱 몸이 지쳤어요','몸을 쉬게 하거나 살살 푸는 것 하나',['rest','app'],'몸이 지친 건 의지 문제가 아니에요. 눕기·스트레칭·따뜻한 물처럼 회복이 먼저예요. 카페인·쇼츠는 피로를 가릴 뿐이에요.',
    a=>a.dopa==='rest'?.3:/스트레칭|폼롤러|샤워|물 한 컵|햇빛|기지개|세수/.test(a.name)?.2:-.3]);
  if(!has('both'))at('stuck',['both','🫠 심신이 지쳤어요','오늘은 최소한만 · 쉼표 하나',['rest'],'몸도 마음도 바닥이면 목표를 줄이는 게 맞아요. 쉼표 하나 하고, 오늘 꼭 해야 할 것 하나만 남겨요. 나머지는 내일로 옮겨도 미룬 게 아니에요.',
    a=>/눕|눈 감|차 한 잔|창밖|낮잠|반신욕/.test(a.name)?.25:0]);
  if(!has('meal'))at('ok',['meal','🍽 밥 먹어요','먹으면서 곁들일 것 · 끝이 있는 한 편',['meal'],'밥 먹을 때 쇼츠·피드는 끝이 없어서 식사가 끝나도 이어져요. 한 편으로 끝나는 걸 먹기 전에 골라 둬요.'])}catch(e){console.error(e)}})();
function dopaPicks(st,shift){
  const S=DSTATE.find(x=>x[0]===st);if(!S)return [];const recent=new Set();const d=DAYS[dateKey()];
  (d&&d.entries||[]).forEach(e=>{if(e.kind==='act'&&e.aid&&e.t&&toMin(stamp())-toMin(e.t)<90)recent.add(e.aid)});
  const pool=C.actions.filter(a=>a.type==='good'&&!a.doneAt&&S[3].includes(a.dopa)&&!recent.has(a.id));
  const seed=dateKey()+st;const h=x=>{let v=0;for(const c of x+seed)v=(v*31+c.charCodeAt(0))|0;return (v>>>0)%1000/1000};
  const bo=a=>{try{return typeof S[5]==='function'?(+S[5](a)||0):0}catch(e){return 0}};
  const sc=a=>dopaScore(a,st)+h(a.id)*.08+bo(a);
  const sorted=pool.sort((x,y)=>sc(y)-sc(x));
  if(!sorted.length)return [];const n=Math.min(3,sorted.length),k=((shift||0)*n)%sorted.length;
  const out=[...sorted.slice(k),...sorted.slice(0,k)].slice(0,n);return out.sort((x,y)=>(x.dopa==='dessert'||x.dopa==='special'?1:0)-(y.dopa==='dessert'||y.dopa==='special'?1:0));
}
function dopaRec77(a){if(!a||a.type!=='good'||a.doneAt)return null;const n=String(a.name||''),d=+a.dur||0;
  if(/잠들기|자기 전|취침|기상|일어나/.test(n)&&!a.dopa)return null;   // 때가 정해진 습관은 메뉴에 새로 넣지 않음
  const R=[['special',/마사지|세신|스파|찜질|공연|전시|극장|영화관|콘서트|페스티벌|여행|당일치기|몰아보기|호캉스|외식|맛집/],
    ['meal',/먹으며|먹으면서|먹을 때|밥 친구|식사 친구|틀고 먹기|한 편만|천천히 먹기|끝나면 끄기/],
    ['dessert',/웹툰|만화|닌텐도|스위치|플스|게임|유튜브|넷플|왓챠|티빙|디즈니|예능|드라마|시트콤|쇼츠|릴스|인스타|커뮤니티|간식|디저트|아이스크림|과자|케이크|배달|야식|맥주|하이볼|와인/],
    ['side',/플레이리스트|노래 틀|음악 틀|들으며 하기|들으면서 하기|캠스터디|타이머.*걸고|공간 바꾸|카페에서|도서관에서|같이 하기|바디더블|백색소음|발목운동/],
    ['rest',/눕기|누워|눈 감|명상|호흡|차 한 잔|창밖|멍 ?때|쉬기|쉼표|낮잠|반신욕|족욕|폰 두고|소리 끄|산책|한 바퀴/],
    ['app',/세수|물 한 컵|물 마시|기지개|환기|햇빛|스트레칭|폼롤러|이부자리|책상 정리|방바닥|샤워|양치|몸 흔들|춤추|스쿼트|푸시업|줄넘기|제자리/],
    ['main',/독서|책 읽|공부|필사|홈트|운동|런데이|러닝|달리기|헬스|요가|필라테스|요리|밀프렙|글쓰기|시나리오|집필|연습|기타 치|피아노|그림|드로잉|등산|자전거|수영|걷기|괄사|피부 관리/]];
  let hit=null;for(const [c,re] of R){if(re.test(n)){hit=c;break}}
  let why=hit?'이름':'';
  if(hit==='app'&&d>20){hit='main';why=d+'분이라'}
  if(hit==='main'&&d&&d<=10){hit='app';why=d+'분이라'}
  if(!hit&&a.dopa==='app'&&d>=30){hit='main';why=d+'분이라'}
  if(!hit&&a.dopa==='main'&&d&&d<=10){hit='app';why=d+'분이라'}
  return hit?{c:hit,why}:null}
function mealEnsure77(){if(!Array.isArray(C.dopaCourses)||!C.dopaCourses.length)C.dopaCourses=dopaC().map(([id,name,desc])=>({id,name,desc}));
  if(C.dopaCourses.some(c=>c.id==='meal'))return [];
  const i=C.dopaCourses.findIndex(c=>c.id==='dessert');C.dopaCourses.splice(i<0?C.dopaCourses.length:i,0,{id:'meal',name:'🍽 식사 친구',desc:'밥 먹을 때 곁들이는 것 · 끝이 있는 한 편'});
  const added=[],at=C.actions.findIndex(a=>a.type==='bad');let k=at<0?C.actions.length:at;const ar=C.areas.some(x=>x.id==='mind')?'mind':(C.areas[0]||{}).id;
  MEAL77.forEach(([n,min],j)=>{const id='dm77'+'abcd'[j];if(C.actions.some(a=>a.name===n||a.id===id))return;   // 정해진 id: 두 기기가 같이 돌아도 두 배가 안 됨
    C.actions.splice(k++,0,{id,name:n,type:'good',area:ar,cond:1,gold:0,xp:2,marble:'',dur:min,dopa:'meal',dopaOnly:1,effort:'quick'});added.push(id)});
  return added}
// 다시 추천해서 반영(백업 C.dopaBak77 → 되돌리기). 사용자가 만든 코스에 넣어 둔 카드는 안 건드림.
function dopaReapply77(){const added=mealEnsure77(),cs=new Set(dopaC().map(c=>c[0])),m={},ch=[];
  C.actions.forEach(a=>{if(a.type!=='good'||a.doneAt||added.includes(a.id))return;if(a.dopa&&!STD77.includes(a.dopa))return;const r=dopaRec77(a);if(!r||!cs.has(r.c)||r.c===(a.dopa||''))return;
    m[a.id]=a.dopa||'';ch.push({id:a.id,from:a.dopa||'',to:r.c,why:r.why});a.dopa=r.c});
  C.dopaBak77={at:Date.now(),m,added,ch};C.dopa77=1;save('config');return ch}
function dopaUndo77(){const B=C.dopaBak77;if(!B)return;C.actions.forEach(a=>{if(a.id in (B.m||{})){if(B.m[a.id])a.dopa=B.m[a.id];else{delete a.dopa;delete a.dopaOnly}}});
  const used=new Set();for(const k in DAYS)(DAYS[k].entries||[]).forEach(e=>{if(e.aid)used.add(e.aid)});
  C.actions=C.actions.filter(a=>!((B.added||[]).includes(a.id)&&!used.has(a.id)));
  if(!C.actions.some(a=>a.dopa==='meal'))C.dopaCourses=(C.dopaCourses||[]).filter(c=>c.id!=='meal');
  delete C.dopaBak77;save('config');render();if(curView()==='edit')try{reEdit()}catch(e){}toast('도파민 코스를 예전대로 돌렸어요')}
function dopaRecSheet77(){const B=C.dopaBak77,cs=dopaC(),nm=k=>k?((cs.find(c=>c[0]===k)||['',k])[1]):'메뉴 밖';
  const rows=((B&&B.ch)||[]).map(x=>{const a=C.actions.find(z=>z.id===x.id);if(!a)return '';
    return `<div class="d77r"><span class="d77n"><b>${esc(a.name)}</b><small>${esc(nm(x.from))} → <b>${esc(nm(x.to))}</b>${x.why&&x.why!=='이름'?' · '+esc(x.why):''}${a.dur?' · '+a.dur+'분':''}</small></span><select data-d77set="${a.id}" aria-label="${esc(a.name)} 코스"><option value="">메뉴 밖</option>${cs.map(([k,l])=>`<option value="${k}" ${a.dopa===k?'selected':''}>${esc(l)}</option>`).join('')}</select></div>`}).join('');
  const meal=((B&&B.added)||[]).map(id=>C.actions.find(a=>a.id===id)).filter(Boolean);
  sheetCtx={d77:1};
  openSheet(`<div class="sh"><h3>🪄 도파민 코스 다시 추천</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <p class="small" style="margin:0">기준: <b>🥗 애피타이저</b> 짧게 몸·감각을 깨우는 것 · <b>🍟 사이드</b> 할 일에 곁들이는 것 · <b>🛋 쉼표</b> 자극을 줄이는 것 · <b>🍝 메인</b> 30분 넘게 몰입 · <b>🍽 식사 친구</b> 먹으며 한 편 · <b>🍰 디저트</b> 끝이 없는 것(끝 시간 정하고) · <b>🎉 스페셜</b> 가끔.</p>
    ${rows?`<div class="c76g">바꾼 것 ${B.ch.length}개 <small class="muted">· 마음에 안 들면 오른쪽에서 바로 고쳐요</small></div><div class="d77l">${rows}</div>`:`<div class="empty">${B?'지금 코스가 추천과 같아서 바꾼 게 없어요.':'아직 다시 추천한 적이 없어요.'}</div>`}
    ${meal.length?`<div class="c76g">🍽 식사 친구 코스에 넣은 새 항목 ${meal.length}개</div><p class="small muted" style="margin:0">${meal.map(a=>esc(a.name)).join(' · ')} — 편집 → 도파민에서 이름을 내 것으로 바꿔요.</p>`:''}
    <div class="row" style="justify-content:space-between;margin-top:8px"><span class="row" style="gap:6px"><button type="button" class="btn ghost sm" data-d77undo="1"${B?'':' disabled'}>↶ 모두 되돌리기</button><button type="button" class="btn ghost sm" data-d77rec="1">🪄 지금 다시 추천</button></span><a class="btn sm" href="#edit" data-goedit="dopa" data-sheet="close">메뉴 편집</a></div>`)}
function dopaMig77(){if(C.dopa77||!ready72())return;try{if(typeof dopaMig==='function'&&!C.dopa57)dopaMig()}catch(e){console.error(e)}const ch=dopaReapply77(),B=C.dopaBak77||{};
  setTimeout(()=>{try{toastAct(`🍬 도파민 코스를 다시 추천해 반영했어요 · ${ch.length}개 옮김${(B.added||[]).length?' · 🍽 식사 친구 코스':''}`,'보기·되돌리기',()=>dopaRecSheet77(),12000)}catch(e){}},1200)}
addEventListener('click',e=>{const T=e.target;if(!T||!T.closest)return;let b;
  if((b=T.closest('[data-d77rec]'))){e.preventDefault();e.stopPropagation();const prev=C.dopaBak77,ch=dopaReapply77();
    if(prev&&!ch.length&&!(C.dopaBak77.added||[]).length){C.dopaBak77=prev;save('config')}   // 바뀐 게 없으면 지난 백업 그대로
    render();if(curView()==='edit')try{reEdit()}catch(x){}dopaRecSheet77();toast(ch.length?`🪄 ${ch.length}개를 추천 코스로 옮겼어요`:'지금 코스가 추천과 같아요');return}
  if((b=T.closest('[data-d77undo]'))){e.preventDefault();e.stopPropagation();closeSheet();dopaUndo77();return}
},true);
addEventListener('change',e=>{const s=e.target&&e.target.closest&&e.target.closest('[data-d77set]');if(!s)return;e.stopPropagation();const a=C.actions.find(x=>x.id===s.dataset.d77set);if(!a)return;
  if(s.value)a.dopa=s.value;else{delete a.dopa;delete a.dopaOnly}save('config');render();toast(`'${a.name}' → ${s.value?(dopaC().find(c=>c[0]===s.value)||['',''])[1]:'메뉴 밖'}`)},true);
try{dopaEditHTML=(function(prev){return function(){let h=prev.apply(this,arguments);try{h=h.replace('<details class="aeshow">',`<button type="button" class="chipbtn" data-d77rec="1" title="카드 이름·시간을 보고 코스를 다시 추천해 옮겨요(되돌리기 있음)">🪄 코스 다시 추천</button><details class="aeshow">`)}catch(e){}return h}})(dopaEditHTML)}catch(e){console.error(e)}

/* ---- 6) 할 일 찾기 = 제목 줄 돋보기 · 🧽 관리 목록 입력 안내 ---- */
function tasksBar77(){if(curView()!=='tasks')return;const box=$('ts71'),g=$('tGroup'),row=g&&g.parentElement;
  if(box&&row&&box.parentElement!==row){row.insertBefore(box,row.firstChild);box.classList.add('c77')}
  const i=$('tq71');if(i&&!i.dataset.p77){i.dataset.p77=1;i.placeholder='찾기 (이름·메모·#태그·목록)';i.title='할 일 찾기 (Ctrl+F)'}
  const ta=$('tAdd'),care=(C.ui.tasks||{}).sel==='care';
  if(ta){if(care&&!ta.dataset.ph77){ta.dataset.ph77=ta.placeholder;ta.placeholder='🧽 새 관리 · 변기청소 %14 (= 14일마다) · 숫자 없으면 어림'}else if(!care&&ta.dataset.ph77){ta.placeholder=ta.dataset.ph77;delete ta.dataset.ph77}}}

/* ---- 7) 한 번 하는 것들 · 안내 ---- */
// 새벽(0시~하루 시작): 단계의 t.last는 점수 날짜인데 목록은 자정 날짜로 견줘서, 새벽에 한 루틴 단계가 목록에 남았음 → 점수 날짜로
function stDoneHide72(k){return !!(k&&isRtKid71(k)&&k.status===0&&k.last===gk76())}
render=(function(prev){return function(){try{dopaMig77();flt77()}catch(e){console.error(e)}const x=prev.apply(this,arguments);
  try{if(NEED77&&ready72()){NEED77=0;save('config')}}catch(e){console.error(e)}return x}})(render);
F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['⚲ 캘린더 보일 것 / 숨길 것','캘린더 위 깔때기 단추','목록·영역·태그·종류(루틴·일퀘·반복·한 번·관리)로 고른 것만 보기 / 고른 것 숨기기. 두 캘린더가 같이 쓰고 끝낸 일·지난 날에도 적용',()=>{calFilterSheet()},'캘린더 거르기 필터 목록 루틴 일퀘 태그 숨기기 보일 것'],
  ['✓ 끝낸 블록에 목록 색','캘린더 시간표','끝낸 할 일이 목록 색·이모지 그대로 ✓와 함께 남아요(반복 할 일도 한 날에). 짧은 블록도 제목이 보여요',()=>{location.hash='cal'},'캘린더 끝낸 완료 체크 목록 색 짧은 블록 제목'],
  ['🧽 관리로 등록하기','입력칸에 % · 할 일 상세 칩 줄 🧽 · 우클릭 → 관리로 · 🧽 관리 목록에서 적기','변기청소 %14 = 14일마다 관리. 반복 없는 할 일도 옮길 수 있고(주기를 물어요), 관리는 제 목록에서도 🧽 표시로 보여요',()=>{C.ui.tasks.sel='care';save('config');location.hash='tasks';render()},'관리 등록 추가 주기 며칠마다 청소 변기'],
  ['🪄 도파민 코스 다시 추천','편집 → 도파민 → 🪄 코스 다시 추천','카드 이름·시간으로 코스를 다시 나눠요. 바꾼 것 보기·하나씩 고치기·모두 되돌리기',()=>{dopaRecSheet77()},'도파민 코스 추천 다시 세팅 식사 친구'],
  ['🍽 식사 친구 · 🥱 몸이 지쳤어요 · 🫠 심신이 지쳤어요','🍬 지금 어때?','밥 먹을 때 곁들일 것, 지쳤을 때 회복부터 고르는 상태가 생겼어요',()=>{openDopaNow()},'도파민 식사 밥 지쳤어요 심신 몸 상태']])}})(F67);
