/* ================= v6.1: 루틴 단계 = 카드·할 일 그대로 · 요일별 일퀘 · 어디서나 우클릭 · 뒤로 가기 · 같은 목록 · 화면 배치 · 도감 =================
   주의: 맨 끝 모듈. 최상위 값은 var/function. 다른 모듈이 감싸는 함수는 여기서 '다시 대입'으로만 바꿔요(선언하면 호이스팅돼 앞 모듈의 감싸기가 꼬임).
   ⚡ 문자는 patch13이 빌드 전체에서 ⚔로 바꿔요 → 여기서 번개는 '⚡'로만 써요. */

/* ---- 0) 말·아이콘: 짧게 → ⚡ 번개 ---- */
(function(){const e=EFFORTS.find(x=>x[0]==='quick');if(e){e[1]='⚡ 번개';e[2]='10분 안'}})();
{const _eo61=effortOf;effortOf=function(t){if(!t.effort){const tg=(t.tags||[]).join(' ');if(/번개|퀵/.test(tg))return 'quick'}return _eo61(t)}}

/* ---- 1) 새로고침하면 되돌아가던 설정 지키기 (목록 순서·접힘·메뉴·보이는 칸) ---- */
var UIKEEP61=['smart','tfold','navAll','aeShow'];
{const _nc61=normConfig;normConfig=function(raw){
  const u=raw&&raw.ui&&typeof raw.ui==='object'?raw.ui:{},keep={};UIKEEP61.forEach(k=>{if(u[k]!=null)keep[k]=JSON.parse(JSON.stringify(u[k]))});
  const c=_nc61(raw);try{if(c&&c.ui)UIKEEP61.forEach(k=>{if(keep[k]!=null&&c.ui[k]==null)c.ui[k]=keep[k]})}catch(e){console.error(e)}return c}}

/* ---- 2) 일퀘 = 반복 할 일의 ☑ · 그 할 일이 뜨는 날에만 (요일마다 다른 일퀘) ---- */
function qOn61(t,dk){
  const r=t&&t.rep;if(!r||!r.f)return false;if((t.skip61||[]).includes(dk))return false;const i=+r.i||1;
  if(r.f==='d'&&i===1)return true;
  if(r.f==='w'&&i===1&&(r.wd||[]).length)return r.wd.includes(dowOf(dk));
  return t.due===dk||t.last===dk;
}
function qTasks61(){return Object.values(TASKS).filter(t=>t&&t.quest&&t.status===0&&t.rep&&t.rep.f)}
syncDailies=(function(prev){return function(c){
  if(!c||!c.mig57)return prev(c);if(!tasksReady)return;
  const td=dateKey(),out=[];
  qTasks61().filter(t=>qOn61(t,td)).sort((x,y)=>(x.order||0)-(y.order||0)).forEach(t=>{
    if(t.hab&&t.aid){const a=(c.actions||[]).find(x=>x.id===t.aid);if(!a||a.type!=='good'||(a.once&&a.doneAt))return;out.push({id:t.qid||('q'+t.id),name:a.name,action:a.link||a.id,xp:0,gold:0,tid:t.id});return}
    const r=t.rid&&(c.routines||[]).find(x=>x.id===t.rid);out.push({id:t.qid||('q'+t.id),name:r?r.name:t.title,action:'@t:'+t.id,xp:0,gold:0,tid:t.id})});
  c.dailies=out}})(syncDailies);
function qName61(t){const a=t.aid&&C.actions.find(x=>x.id===t.aid),r=t.rid&&(C.routines||[]).find(x=>x.id===t.rid);return r?'⏱ '+r.name:a?a.name:t.title}
function qKind61(t){return t.rid?'⏱ 루틴':t.hab&&t.aid?'🃏 습관':'📋 할 일'}
// 요일 하나 켜고 끄기 (매일 → 요일로 바뀜)
function qToggleWd61(t,w){
  let wd=t.rep.f==='d'&&(+t.rep.i||1)===1?[0,1,2,3,4,5,6]:t.rep.f==='w'?(t.rep.wd||[]).slice():null;if(!wd)return false;
  wd=wd.includes(w)?wd.filter(x=>x!==w):[...wd,w];if(!wd.length){toast('하루는 남겨야 해요 · 일퀘를 빼려면 ☑를 꺼요');return false}
  const r=t.rid&&(C.routines||[]).find(x=>x.id===t.rid);
  if(r){setRt60(r,wd);return true}
  t.rep=wd.length===7?{f:'d',i:1}:{f:'w',i:1,wd:wd.sort()};const td=dateKey();let d=firstDue(t.rep,td);if(d===td&&(DAYS[td]||{entries:[]}).entries.some(e=>e.tid===t.id))d=nextDue(t.rep,td)||d;t.due=d;delete t.skull;saveTask(t);syncDailies(C);save('config');return true}
dailiesEditHTML=(function(prev){return function(){
  if(!C.mig57||!tasksReady)return prev();
  const qs=qTasks61().sort((x,y)=>(x.order||0)-(y.order||0)),td=dateKey(),order=[1,2,3,4,5,6,0];
  const per=order.map(w=>{let n=0;qs.forEach(t=>{const k=t.rep;if(k.f==='d'&&(+k.i||1)===1)n++;else if(k.f==='w'&&(+k.i||1)===1&&(k.wd||[]).includes(w))n++});return n});
  const row=t=>{const k=t.rep,fixed=k.f==='d'&&(+k.i||1)===1?'d':k.f==='w'&&(+k.i||1)===1?'w':'x',a=t.aid&&C.actions.find(x=>x.id===t.aid);
    return `<div class="qw61r"><button class="nm" data-x60task="${t.id}" title="할 일 열기"><b>${esc(qName61(t))}</b><span class="tiny muted">${qKind61(t)}${a&&a.link?' · 🔗 '+esc(linkName(a.link)):''}${qOn61(t,td)?' · 오늘 있음':''}</span></button>
      ${order.map(w=>{const on=fixed==='d'||(fixed==='w'&&(k.wd||[]).includes(w));return fixed==='x'?`<span class="qw61c x" title="${esc(repLabel(k))}">·</span>`:`<button class="qw61c ${on?'on':''}" data-x61qd="${t.id}:${w}" aria-pressed="${on}" aria-label="${WDK[w]}요일 ${on?'빼기':'넣기'}">${on?'☑':'·'}</button>`}).join('')}
      <button class="x" data-x61qoff="${t.id}" title="일퀘에서 빼기 (반복은 그대로)" aria-label="일퀘에서 빼기">×</button></div>`};
  return `<p class="help">일퀘 = <b>반복하는 일 중 ☑ 표시한 것</b>이에요. 행동 카드 습관·⏱ 루틴·그냥 반복 할 일 모두 돼요. 그 일이 뜨는 요일에만 그날 일퀘가 돼서 <b>월요일 일퀘와 토요일 일퀘를 다르게</b> 둘 수 있어요. 칸을 누르면 그 요일을 켜고 꺼요. 그날 일퀘를 다 끝내면 상자를 열어요 (하루 3~5개가 적당해요).</p>
  <div class="qw61"><div class="qw61r head"><span>일퀘</span>${order.map((w,i)=>`<span class="qw61c h ${dowOf(td)===w?'td':''}">${WDK[w]}<small>${per[i]}</small></span>`).join('')}<span></span></div>
  ${qs.map(row).join('')||'<div class="empty">아직 없어요. 아래 ＋로 추가해요.</div>'}</div>
  <div class="row" style="gap:6px;margin-top:10px;flex-wrap:wrap"><button class="btn sm" data-x61qadd="1">＋ 일퀘 추가 (카드·루틴·반복 할 일에서)</button><input id="dlyName" maxlength="40" placeholder="새 매일 습관 (예: 물 2L 마시기)" style="flex:1;min-width:160px"><button class="btn sm ghost" data-dlyadd="1">＋ 새 카드로</button></div>
  <p class="tiny muted">칸 숫자 = 그 요일 일퀘 개수. '·'만 있는 줄은 매월·격주 같은 다른 반복이라 할 일에서 바꿔요.</p>
  <div class="kv" style="margin-top:14px"><label>다 끝낸 날 상자: XP<input id="r-dbxp" data-rule="dailyBonus.xp" type="number" min="0" value="${C.dailyBonus.xp}"></label><label>다 끝낸 날 상자: 골드<input id="r-dbgold" data-rule="dailyBonus.gold" type="number" min="0" value="${C.dailyBonus.gold}"></label></div>`}})(dailiesEditHTML);
function qAddPick61(){
  const td=dateKey();
  openPicker61({title:'＋ 일퀘로 둘 것 고르기',multi:true,tabs:[
    {k:'card',label:'🃏 행동 카드',items:C.actions.filter(a=>a.type==='good'&&!a.doneAt&&!(habT(a)&&habT(a).quest)).map(a=>({id:a.id,label:a.name,sub:habT(a)?'↻ '+rhythmText(habT(a)).replace(/^\S+\s/,''):'반복 없음 → 매일로',grp:(C.areas.find(x=>x.id===a.area)||{}).name||'',score:stUse61(a.id)}))},
    {k:'rt',label:'⏱ 루틴',items:(C.routines||[]).map(r=>{const t=rtT(r);return {id:r.id,label:r.name,sub:t?'↻ '+repLabel(t.rep):'언제 없음 → 매일로',grp:'루틴'}})},
    {k:'task',label:'📋 반복 할 일',items:Object.values(TASKS).filter(t=>t.status===0&&t.rep&&t.rep.f&&!t.quest&&!t.hab&&!t.rid).map(t=>({id:t.id,label:t.title,sub:repLabel(t.rep),grp:listName(t.list||'inbox')}))}],
    onPick:sel=>{let n=0;sel.forEach(({tab,id})=>{
      if(tab==='card'){const a=C.actions.find(x=>x.id===id);if(!a)return;const t=habT(a);if(t){t.quest=1;saveTask(t)}else setRhythm(a,{f:'d',i:1},{quest:1});n++}
      if(tab==='rt'){const r=(C.routines||[]).find(x=>x.id===id);if(!r)return;const t=rtT(r);if(t)setRt60(r,rtWd60(t).length?rtWd60(t):[0,1,2,3,4,5,6],true);else setRt60(r,[0,1,2,3,4,5,6],true);n++}
      if(tab==='task'){const t=TASKS[id];if(t){t.quest=1;saveTask(t);n++}}});
      syncDailies(C);save('config');reEdit();render();toast(`☑ ${n}개를 일퀘로 했어요 · 요일 칸에서 날을 골라요`)}});
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-x61qd],[data-x61qoff],[data-x61qadd]');if(!b)return;e.preventDefault();e.stopPropagation();const d=b.dataset;
  if(d.x61qadd){qAddPick61();return}
  if(d.x61qoff){const t=TASKS[d.x61qoff];if(!t)return;delete t.quest;saveTask(t);syncDailies(C);save('config');reEdit();render();toastAct(`'${qName61(t)}' 일퀘에서 뺐어요 (반복은 그대로)`,'되돌리기',()=>{t.quest=1;saveTask(t);syncDailies(C);save('config');reEdit();render()});return}
  if(d.x61qd){const [id,w]=d.x61qd.split(':'),t=TASKS[id];if(!t)return;if(qToggleWd61(t,+w)){reEdit();render()}}},true);

/* ---- 3) 행동/습관: 기록 화면과 편집 화면이 같은 거르기·같은 개수 ---- */
function FLT61f(){return [['all','모두'],['good','▲ 좋은'],['bad','▼ 나쁜'],['dopa','🍬 도파민'],['habit','↻ 습관'],['brave','⚔ 용기']]}
function flt61(a,k){
  if(!a)return false;
  if(k==='good')return a.type==='good'&&!a.dopaOnly&&!a.doneAt;
  if(k==='bad')return a.type==='bad'&&!a.doneAt;
  if(k==='dopa')return !!a.dopa&&!a.doneAt;
  if(k==='habit')return isHabit(a);
  if(k==='brave')return !!a.brave;
  return true}
function fltBar61(attr,cur){
  const A=(C&&C.actions)||[],n=k=>A.filter(a=>flt61(a,k)).length,dOnly=A.filter(a=>a.dopaOnly&&!a.doneAt).length;
  return `<span class="seg3 flt61">${FLT61f().map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${cur===v}">${l} <small>${n(v)}</small></button>`).join('')}</span>${cur==='good'&&dOnly?`<span class="tiny muted flt61n">· 🍬 도파민 전용 ${dOnly}개는 🍬에</span>`:''}`}
// 편집 화면의 거르기 = 기록 화면의 거르기 (하나를 바꾸면 둘 다 바뀜)
(function(){const E=ui.ae||(ui.ae={q:'',area:'',sort:'manual'});delete E.type;
  Object.defineProperty(E,'type',{get(){const f=C&&C.ui&&C.ui.list&&C.ui.list.filter;return FLT61f().some(x=>x[0]===f)?f:'good'},set(v){if(C&&C.ui&&C.ui.list){C.ui.list.filter=v;save('config')}},enumerable:true,configurable:true})})();

/* ---- 4) 행동/습관 화면 배치: 홈처럼 작은 지도에서 끌기 · 폰은 순서 하나로 ---- */
function wide61(){return innerWidth>=900}
applyLog59=(function(prev){return function(){
  prev();try{
    const v=document.querySelector('[data-view="log"]');if(!v)return;const st=v.querySelectorAll(':scope>.grid2>.stack');if(st.length<2)return;
    const P=logPanels59(),L=lay59();
    if(!wide61()){const want=L.map(x=>P[x[0]]).filter(Boolean);const have=[...st[0].children].filter(c=>want.includes(c));if(have.length!==want.length||want.some((el,i)=>have[i]!==el))want.forEach(el=>st[0].appendChild(el))}
    const lb=$('lay59Btn');if(lb)lb.textContent='▦ 화면 배치';
    v.querySelectorAll('.lay59').forEach(x=>x.remove());const hl=$('lay59Help');if(hl)hl.remove();
  }catch(e){console.error(e)}}})(applyLog59);
addEventListener('resize',()=>{clearTimeout(window.__lr61);window.__lr61=setTimeout(()=>{try{if(curView()==='log')applyLog59()}catch(e){}},200)});
var LAYP61=[['base','기본',[['brave','L',1,0],['acts','L',0,0],['food','R',0,0],['log','R',0,0]]],['rec','📋 기록 먼저',[['acts','L',0,0],['log','R',0,0],['food','R',0,0],['brave','L',1,0]]],['body','🥗 몸 먼저',[['food','L',0,0],['acts','L',0,0],['log','R',0,0],['brave','R',1,0]]],['simple','🌿 간단히',[['acts','L',0,0],['food','R',0,0],['log','R',1,0],['brave','R',1,1]]]];
function layMap61(){
  const L=lay59(),w=wide61();
  const blk=x=>`<div class="lm61b ${x[3]?'off':''}" data-lm61="${x[0]}"><span class="hand" aria-hidden="true">⋮⋮</span><b>${esc(LAY59_NAME[x[0]])}</b>${x[2]?'<span class="tiny muted">접힘</span>':''}<span style="flex:1"></span>
    <button class="ib" data-lm61op="up:${x[0]}" aria-label="위로">↑</button><button class="ib" data-lm61op="dn:${x[0]}" aria-label="아래로">↓</button>${w?`<button class="ib" data-lm61op="col:${x[0]}" title="왼쪽·오른쪽 칸 바꾸기" aria-label="칸 바꾸기">${x[1]==='L'?'⇢':'⇠'}</button>`:''}<button class="ib" data-lm61op="fold:${x[0]}" aria-label="접기">${x[2]?'▸':'▾'}</button><button class="ib" data-lm61op="hide:${x[0]}" aria-label="숨기기" title="${x[3]?'숨김 · 누르면 보이기':'보임 · 누르면 숨기기'}">${x[3]?'🚫':'👁'}</button></div>`;
  return `<div class="sh"><h3>▦ 행동/습관 화면 배치</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <div class="row" style="gap:6px;flex-wrap:wrap">${LAYP61.map(p=>`<button class="chipbtn" data-lm61p="${p[0]}">${p[1]}</button>`).join('')}</div>
    <p class="tiny muted" style="margin:6px 0">${w?'칸을 끌어서 순서·왼쪽/오른쪽을 바꿔요. 바로 적용돼요.':'폰에서는 한 줄이에요. 끌거나 ↑↓로 순서를 바꿔요.'} 👁 숨기기 · ▾ 접기.</p>
    <div class="lm61 ${w?'two':''}">${w?['L','R'].map(c=>`<div class="lm61c" data-lm61col="${c}"><span class="tiny muted">${c==='L'?'왼쪽 칸':'오른쪽 칸'}</span>${L.filter(x=>x[1]===c).map(blk).join('')}</div>`).join(''):`<div class="lm61c" data-lm61col="*">${L.map(blk).join('')}</div>`}</div>
    <div class="row" style="margin-top:10px"><span style="flex:1"></span><button class="btn sm" data-sheet="close">다 했어요</button></div>`}
function openLay61(){sheetCtx={lay61:1};openSheet(layMap61())}
function redrawLay61(){if(sheetCtx&&sheetCtx.lay61){const y=$('sheetC').scrollTop;openSheet(layMap61());$('sheetC').scrollTop=y}applyLog59()}
function layMove61(id,col,before){const L=lay59(),it=L.find(x=>x[0]===id);if(!it)return;let rest=L.filter(x=>x!==it);if(col&&col!=='*')it[1]=col;
  let i=before?rest.findIndex(x=>x[0]===before):-1;if(i<0){if(col&&col!=='*'){let j=-1;rest.forEach((x,k)=>{if(x[1]===col)j=k});i=j+1}else i=rest.length}rest.splice(i,0,it);C.logLay59=rest;save('config')}
addEventListener('click',e=>{
  const b=e.target.closest('#lay59Btn,[data-lm61op],[data-lm61p]');if(!b)return;e.preventDefault();e.stopPropagation();
  if(b.id==='lay59Btn'){ui.lay59=false;openLay61();return}
  if(b.dataset.lm61p){const p=LAYP61.find(x=>x[0]===b.dataset.lm61p);if(p){C.logLay59=JSON.parse(JSON.stringify(p[2]));save('config');redrawLay61();toast(`'${p[1]}' 배치`)}return}
  const [op,id]=b.dataset.lm61op.split(':'),L=lay59(),it=L.find(x=>x[0]===id);if(!it)return;
  if(op==='hide')it[3]=it[3]?0:1;else if(op==='fold')it[2]=it[2]?0:1;
  else if(op==='col'){it[1]=it[1]==='L'?'R':'L';const rest=L.filter(x=>x!==it);rest.push(it);C.logLay59=rest}
  else{const same=wide61()?L.filter(x=>x[1]===it[1]):L,i=same.indexOf(it),j=op==='up'?i-1:i+1;if(j<0||j>=same.length)return;const o=same[j],a=L.indexOf(it),c=L.indexOf(o);L[a]=o;L[c]=it;if(!wide61())it[1]=o[1]===it[1]?it[1]:it[1]}
  save('config');redrawLay61()},true);
// 작은 지도에서 끌기
(function(){let drag=null;
  document.addEventListener('pointerdown',e=>{const h=e.target.closest('.lm61b');if(!h||e.target.closest('button')||e.button>0)return;drag={id:h.dataset.lm61,el:h,x:e.clientX,y:e.clientY,on:false};},true);
  document.addEventListener('pointermove',e=>{if(!drag)return;if(!drag.on){if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<6)return;drag.on=true;drag.el.classList.add('drag61');try{drag.el.setPointerCapture(e.pointerId)}catch(x){}}
    e.preventDefault();drag.el.style.transform=`translate(${e.clientX-drag.x}px,${e.clientY-drag.y}px)`;
    document.querySelectorAll('.lm61b.tgt,.lm61c.tgt').forEach(x=>x.classList.remove('tgt'));drag.el.style.pointerEvents='none';const u=document.elementFromPoint(e.clientX,e.clientY);drag.el.style.pointerEvents='';
    const tb=u&&u.closest('.lm61b'),tc=u&&u.closest('.lm61c');if(tb&&tb!==drag.el)tb.classList.add('tgt');else if(tc)tc.classList.add('tgt')},{passive:false});
  document.addEventListener('pointerup',e=>{if(!drag)return;const d=drag;drag=null;if(!d.on)return;d.el.style.transform='';d.el.classList.remove('drag61');
    d.el.style.pointerEvents='none';const u=document.elementFromPoint(e.clientX,e.clientY);d.el.style.pointerEvents='';
    document.querySelectorAll('.tgt').forEach(x=>x.classList.remove('tgt'));
    const tb=u&&u.closest('.lm61b'),tc=u&&u.closest('.lm61c');if(!tb&&!tc)return;
    const col=(tb?tb.closest('.lm61c'):tc).dataset.lm61col;
    let before=null;if(tb&&tb!==d.el){const r=tb.getBoundingClientRect();before=e.clientY<r.top+r.height/2?tb.dataset.lm61:(tb.nextElementSibling&&tb.nextElementSibling.dataset.lm61)||null}
    layMove61(d.id,col,before);redrawLay61()});
})();

/* ---- 5) 고르기 창 (공용): 찾기 · 탭 · 묶어서 · 자주 쓰는 것 먼저 · 여러 개 ---- */
var PK61=null;
function stUse61(aid){let n=0;const k0=addDays(dateKey(),-30);for(const k in DAYS){if(k<k0)continue;(DAYS[k].entries||[]).forEach(e=>{if(e.aid===aid)n++})}return n}
function openPicker61(o){PK61={...o,tab:o.tab||o.tabs[0].k,q:'',sel:[]};let el=$('pk61');if(!el){el=document.createElement('div');el.id='pk61';document.body.appendChild(el)}el.hidden=false;drawPk61(true)}
function closePicker61(){PK61=null;const el=$('pk61');if(el){el.hidden=true;el.innerHTML=''}}
function drawPk61(focus){
  const P=PK61,el=$('pk61');if(!P||!el)return;const T=P.tabs.find(x=>x.k===P.tab)||P.tabs[0];const q=normN(P.q||'');
  let its=(T.items||[]).filter(x=>!q||normN(x.label+' '+(x.sub||'')+' '+(x.grp||'')).includes(q));
  const top=!q?its.filter(x=>(x.score||0)>0).sort((a,b)=>b.score-a.score).slice(0,6):[];
  const groups=[];if(top.length)groups.push(['⭐ 자주 쓰는 것',top]);
  const gm=new Map();its.forEach(x=>{const g=x.grp||'';if(!gm.has(g))gm.set(g,[]);gm.get(g).push(x)});gm.forEach((v,k)=>groups.push([k,v]));
  const isSel=id=>P.sel.some(s=>s.tab===T.k&&s.id===id);
  const item=x=>`<button type="button" class="pk61i ${isSel(x.id)?'on':''}" data-pk61="${esc(x.id)}">${P.multi?`<span class="ck">${isSel(x.id)?'☑':'☐'}</span>`:''}<span class="tx"><b>${esc(x.label)}</b>${x.sub?`<small>${esc(x.sub)}</small>`:''}</span></button>`;
  el.innerHTML=`<div class="pk61box" role="dialog" aria-label="${esc(P.title)}"><div class="spread"><b>${esc(P.title)}</b><button class="x" data-pk61x="1" aria-label="닫기">×</button></div>
    <input id="pk61q" type="search" placeholder="🔍 찾기" value="${esc(P.q)}" autocomplete="off">
    ${P.tabs.length>1?`<div class="seg pk61t">${P.tabs.map(t=>`<button data-pk61tab="${t.k}" aria-pressed="${t.k===T.k}">${t.label} <small>${(t.items||[]).length}</small></button>`).join('')}</div>`:''}
    <div class="pk61l">${groups.map(([g,v])=>`${g?`<div class="pk61g">${esc(g)} <small>${v.length}</small></div>`:''}${v.map(item).join('')}`).join('')||`<div class="empty">${q?'찾는 게 없어요':'고를 게 없어요'}</div>`}</div>
    <div class="row pk61f">${T.newLabel&&P.q.trim()?`<button class="btn ghost sm" data-pk61new="1">＋ '${esc(P.q.trim())}' ${esc(T.newLabel)}</button>`:T.newLabel?`<span class="tiny muted">찾는 게 없으면 이름을 적고 '${esc(T.newLabel)}'</span>`:''}<span style="flex:1"></span>${P.multi?`<button class="btn sm" data-pk61go="1" ${P.sel.length?'':'disabled'}>넣기 ${P.sel.length||''}</button>`:''}</div></div>`;
  if(focus)setTimeout(()=>{const i=$('pk61q');if(i){i.focus();i.setSelectionRange(i.value.length,i.value.length)}},20);
}
addEventListener('click',e=>{const el=$('pk61');if(!PK61||!el||el.hidden)return;if(!el.contains(e.target))return;
  const b=e.target.closest('[data-pk61],[data-pk61x],[data-pk61tab],[data-pk61go],[data-pk61new]');if(e.target===el){e.stopPropagation();closePicker61();return}if(!b)return;e.preventDefault();e.stopPropagation();const P=PK61,d=b.dataset;
  if(d.pk61x){closePicker61();return}
  if(d.pk61tab){P.tab=d.pk61tab;drawPk61();return}
  if(d.pk61new){const T=P.tabs.find(x=>x.k===P.tab);const v=P.q.trim();closePicker61();if(T&&T.onNew)T.onNew(v);return}
  if(d.pk61go){const s=P.sel.slice();closePicker61();P.onPick(s);return}
  if(d.pk61!=null){const it={tab:P.tab,id:d.pk61};if(!P.multi){closePicker61();P.onPick([it]);return}const i=P.sel.findIndex(s=>s.tab===it.tab&&s.id===it.id);if(i>=0)P.sel.splice(i,1);else P.sel.push(it);const y=el.querySelector('.pk61l').scrollTop;drawPk61();el.querySelector('.pk61l').scrollTop=y}},true);
addEventListener('input',e=>{if(e.target&&e.target.id==='pk61q'&&PK61){PK61.q=e.target.value;drawPk61();const i=$('pk61q');i.focus();i.setSelectionRange(i.value.length,i.value.length)}},true);
addEventListener('keydown',e=>{if(!PK61)return;if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();closePicker61();return}
  if(e.key==='Enter'&&e.target.id==='pk61q'){e.preventDefault();e.stopImmediatePropagation();const f=$('pk61').querySelector('[data-pk61]');if(f)f.click();else{const n=$('pk61').querySelector('[data-pk61new]');if(n)n.click()}}},true);
addEventListener('change',e=>{if(e.target&&e.target.id==='pk61q')e.stopPropagation()},true);

/* ---- 6) 루틴: 단계 = 행동 카드·할 일 그대로 (따로 만드는 '단계' 없이) ---- */
function stName61(s){if(s.aid==='@weigh')return '⚖ 몸무게 기록';const a=s.aid&&C.actions.find(x=>x.id===s.aid);if(a)return a.name;const t=s.tid&&TASKS[s.tid];if(t)return t.title;return s.name||'단계'}
function stKind61(s){return s.aid==='@weigh'?'⚖':s.aid?'🃏':s.tid?'📋':'✎'}
function stLive61(s){if(s.tid){const t=TASKS[s.tid];return !!t&&(t.status===0)}if(s.aid&&s.aid!=='@weigh')return !!C.actions.find(x=>x.id===s.aid);return true}
function rtOf61(kind,id){const out=[];(C.routines||[]).forEach(r=>(r.steps||[]).forEach((s,i)=>{if((kind==='a'&&s.aid===id)||(kind==='t'&&s.tid===id))out.push({r,i})}));return out}
function rtAdd61(r,step,pos){const s={id:uid(),min:5,...step};if(s.aid&&s.aid!=='@weigh'){const a=C.actions.find(x=>x.id===s.aid);if(a&&a.dur)s.min=a.dur}if(s.tid){const t=TASKS[s.tid];if(t&&t.dur)s.min=t.dur}
  if(s.aid||s.tid)delete s.name;r.steps=r.steps||[];if(pos==null||pos>r.steps.length)pos=r.steps.length;r.steps.splice(pos,0,s);save('config');return s}
function rtNew61(name,steps){const r={id:'r'+uid(),name:name||'새 루틴',xp:15,gold:0,area:'life',steps:[]};(steps||[]).forEach(s=>rtAdd61(r,s));if(!r.steps.length)r.steps.push({id:uid(),name:'첫 단계',min:5});(C.routines=C.routines||[]).push(r);save('config');return r}
function stepPick61(r,pos){
  const tasks=Object.values(TASKS).filter(t=>t.status===0&&!t.rid&&!(r.steps||[]).some(s=>s.tid===t.id));
  openPicker61({title:`⏱ '${r.name}'에 단계 넣기`,multi:true,tabs:[
    {k:'card',label:'🃏 행동 카드',newLabel:'새 카드로',onNew:v=>{const a=newAction(uid(),v,'good',C.areas[0].id,'');const at=C.actions.findIndex(x=>x.type==='bad');C.actions.splice(at<0?C.actions.length:at,0,a);rtAdd61(r,{aid:a.id},pos);redrawRt61();toast(`'${v}' 카드를 만들어 넣었어요 · 점수는 카드에서`)},
      items:[{id:'@weigh',label:'⚖ 몸무게 기록',grp:'기록'},...C.actions.filter(a=>a.type==='good'&&!a.doneAt).map(a=>({id:a.id,label:a.name,sub:[(r.steps||[]).some(s=>s.aid===a.id)?'이미 이 루틴에 있음':'',a.xp?'✨'+a.xp:'',a.dur?a.dur+'분':'',isHabit(a)?'↻ 습관':'',a.dopa?'🍬':''].filter(Boolean).join(' · '),grp:(C.areas.find(x=>x.id===a.area)||{}).name||'',score:stUse61(a.id)}))]},
    {k:'task',label:'📋 할 일',newLabel:'새 할 일로',onNew:v=>{const p=parseQuick(v);const t=newTask({...p,list:p.list||'inbox'});saveTask(t);rtAdd61(r,{tid:t.id},pos);redrawRt61();render()},
      items:tasks.map(t=>({id:t.id,label:t.title,sub:[t.due?dueLabel(t.due):'',t.rep?'↻ '+repLabel(t.rep):'',kidsOf(t.id).length?'📦 '+kidsOf(t.id).length:''].filter(Boolean).join(' · '),grp:'📂 '+listName(t.list||'inbox'),score:t.rep?2:t.due&&t.due<=dateKey()?1:0}))},
    {k:'plain',label:'✎ 이름만',newLabel:'단계로',onNew:v=>{rtAdd61(r,{name:v},pos);redrawRt61()},items:[]}],
    onPick:sel=>{let p=pos;sel.forEach(({tab,id})=>{rtAdd61(r,tab==='card'?{aid:id}:{tid:id},p);if(p!=null)p++});redrawRt61();toast(`${sel.length}개를 단계로 넣었어요`)}});
}
function rtCard61(r,inSheet){
  const t=rtT(r),wd=rtWd60(t),odd=t&&!isDailyRep(t.rep)&&t.rep.f!=='w',tot=(r.steps||[]).reduce((s,x)=>s+(+x.min||0),0);
  const step=(s,i)=>{const live=stLive61(s),a=s.aid&&s.aid!=='@weigh'&&C.actions.find(x=>x.id===s.aid),tk=s.tid&&TASKS[s.tid],ht=a&&habT(a);
    const nm=s.aid||s.tid?`<button class="st61n" ${a?`data-aedit="${a.id}"`:tk?`data-x60task="${tk.id}"`:''} title="열어서 고치기">${stKind61(s)} <b>${esc(stName61(s))}</b>${!live?' <span class="tiny" style="color:var(--bad)">(끝났거나 지워짐 · 건너뜀)</span>':''}</button>`
      :`<span class="st61n"><span>✎</span><input data-r61s="${r.id}:${i}:name" value="${esc(s.name||'')}" aria-label="단계 이름"></span>`;
    const why=a?`↳ 끝내면 ✨${a.xp||0} 기록${ht?` · ${ht.quest?'☑ 일퀘':'↻ 습관'}도 체크`:''}`:tk?`↳ 끝내면 이 할 일 완료 (+${taskBase(tk).xp})${tk.rep?' · 반복이면 다음 날로':''}`:s.aid==='@weigh'?'↳ 몸무게를 적어요':'↳ 체크만 (점수 없음) · 카드로 바꾸면 점수가 붙어요';
    return `<div class="st61 ${live?'':'dead'}"><span class="no">${i+1}</span>${nm}<label class="mn"><input type="number" min="0" max="240" data-r61s="${r.id}:${i}:min" value="${s.min||0}" aria-label="분">분</label>
      <span class="ops"><button class="ib" data-r61op="up:${r.id}:${i}" ${i?'':'disabled'} aria-label="위로">↑</button><button class="ib" data-r61op="dn:${r.id}:${i}" ${i<r.steps.length-1?'':'disabled'} aria-label="아래로">↓</button>${i<r.steps.length-1?`<button class="ib" data-r61op="ins:${r.id}:${i+1}" title="여기 뒤에 넣기" aria-label="뒤에 넣기">＋</button>`:''}${!s.aid&&!s.tid?`<button class="ib" data-r61op="card:${r.id}:${i}" title="이 단계를 행동 카드로 (점수)" aria-label="카드로">🃏</button>`:''}<button class="ib" data-r61op="del:${r.id}:${i}" aria-label="단계 빼기">×</button></span>
      <span class="why tiny muted">${why}</span></div>`};
  return `<div class="jarcard rt61" id="rt60-${r.id}">
    <div class="kv"><label>루틴 이름<input data-r61f="${r.id}:name" value="${esc(r.name)}"></label><label>완주 XP<input data-r61f="${r.id}:xp" type="number" min="0" value="${r.xp||0}"></label><label>완주 골드<input data-r61f="${r.id}:gold" type="number" min="0" value="${r.gold||0}"></label><label>영역<select data-r61f="${r.id}:area">${C.areas.map(a=>`<option value="${a.id}" ${(r.area||'life')===a.id?'selected':''}>${esc(a.name)}</option>`).join('')}</select></label></div>
    <div class="when60"><b class="small">📅 언제</b>${odd?`<span class="small">${esc(repLabel(t.rep))}</span><button class="chipbtn" data-x60task="${t.id}">할 일에서 바꾸기</button>`:
      `${[1,2,3,4,5,6,0].map(w=>`<button type="button" class="chipbtn wd60" data-x60rwd="${r.id}:${w}" aria-pressed="${wd.includes(w)}">${WDK[w]}</button>`).join('')}<button type="button" class="chipbtn" data-x60rwd="${r.id}:all" aria-pressed="${wd.length===7}">매일</button>${wd.length?`<button type="button" class="chipbtn" data-x60rwd="${r.id}:none">안 정함</button>`:''}`}
      <label class="row small" style="gap:4px;margin-left:6px"><input type="checkbox" data-x60rq="${r.id}" ${t&&t.quest?'checked':''} ${t?'':'disabled'} style="width:auto">☑ 일퀘${t?(isDailyRep(t.rep)?'':' (고른 요일에만)'):' (언제를 정하면)'}</label>
      ${t?`<span class="tiny muted">다음: ${esc(dueLabel(t.due))} · 📂 ${esc(listName(t.list||'inbox'))}</span>`:'<span class="tiny muted">안 정하면 ⏱ 사냥·목록에서 직접 시작해요</span>'}</div>
    <div class="st61s">${(r.steps||[]).map(step).join('')}</div>
    <div class="row" style="gap:6px;flex-wrap:wrap"><button class="btn sm ghost" data-r61op="ins:${r.id}:${(r.steps||[]).length}">＋ 단계 (카드·할 일·이름)</button><span class="tiny muted">총 ${tot}분 · 단계마다 분을 정하면 사냥 때 단계별 타이머가 돼요</span><span style="flex:1"></span><button class="btn sm" data-rrun="${r.id}">⏱ 시작</button>${inSheet?`<button class="btn ghost sm" data-r61all="1">모든 루틴</button>`:''}<button class="btn ghost sm" data-r61op="rdel:${r.id}:0">루틴 지우기</button></div></div>`;
}
routinesEditHTML=function(){
  const rs=C.routines||[];
  return `<p class="help">루틴 = <b>행동 카드나 할 일을 순서대로 놓은 것</b>이에요. 단계는 그 카드·할 일 그대로라서, 단계를 끝내면 카드 점수가 들어가고(↻ 습관·☑ 일퀘도 체크) 할 일은 완료돼요. 이름만 있는 단계는 체크만 해요. 루틴 자체는 <b>다 끝냈을 때 완주 보너스</b>만 줘요. 반대로 카드 편집·할 일 상세에서도 '⏱ 루틴에 넣기'로 몇 번째 단계인지 정할 수 있어요.</p><div class="stack">`+rs.map(r=>rtCard61(r,false)).join('')+`</div><div class="row" style="margin-top:10px"><button class="btn sm" data-r61new="1">＋ 새 루틴</button></div>`};
function openRt61(rid){const r=(C.routines||[]).find(x=>x.id===rid);if(!r){toast('루틴을 찾지 못했어요');return}
  sheetCtx={rt61:rid};openSheet(`<div class="sh"><h3>⏱ ${esc(r.name)}</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>${rtCard61(r,true)}`)}
function redrawRt61(){
  if(sheetCtx&&sheetCtx.rt61){const r=(C.routines||[]).find(x=>x.id===sheetCtx.rt61);if(!r){closeSheet();return}const sc=$('sheetC'),y=sc.scrollTop;openSheet(`<div class="sh"><h3>⏱ ${esc(r.name)}</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>${rtCard61(r,true)}`);sc.scrollTop=y}
  if(curView()==='edit')reEdit()}
// 루틴 편집 동작 (편집 화면·루틴 창 같은 것)
addEventListener('click',e=>{const b=e.target.closest('[data-r61op],[data-r61new],[data-r61all]');if(!b)return;e.preventDefault();e.stopPropagation();
  if(b.dataset.r61new){const r=rtNew61('새 루틴');openRt61(r.id);return}
  if(b.dataset.r61all){closeSheet();goEdit('routines');return}
  const [op,rid,si]=b.dataset.r61op.split(':'),r=(C.routines||[]).find(x=>x.id===rid),i=+si;if(!r)return;
  if(op==='ins'){stepPick61(r,i);return}
  if(op==='rdel'){const snap=clone(C.routines),t=rtT(r);C.routines=C.routines.filter(x=>x!==r);if(t){delete t.rid;deleteTask(t.id)}save('config');syncDailies(C);if(sheetCtx&&sheetCtx.rt61)closeSheet();if(curView()==='edit')reEdit();render();toastAct(`'${r.name}' 루틴을 지웠어요`,'되돌리기',()=>{C.routines=snap;save('config');reEdit();render()});return}
  const S=r.steps;
  if(op==='del'){if(S.length<=1){toast('단계는 하나 이상 있어야 해요');return}const s=S.splice(i,1)[0];save('config');redrawRt61();toastAct(`'${stName61(s)}' 단계를 뺐어요`,'되돌리기',()=>{S.splice(i,0,s);save('config');redrawRt61()});return}
  if(op==='up'||op==='dn'){const j=op==='up'?i-1:i+1;if(j<0||j>=S.length)return;[S[i],S[j]]=[S[j],S[i]];save('config');redrawRt61();return}
  if(op==='card'){const s=S[i];let a=C.actions.find(x=>x.name===s.name&&x.type==='good');if(!a){a=newAction(uid(),s.name||'새 행동','good',r.area||C.areas[0].id,'');a.dur=s.min||undefined;const at=C.actions.findIndex(x=>x.type==='bad');C.actions.splice(at<0?C.actions.length:at,0,a)}s.aid=a.id;delete s.name;save('config');redrawRt61();toast(`'${a.name}' 카드로 이었어요 · 점수는 카드에서 정해요`);return}
},true);
addEventListener('change',e=>{const i=e.target;if(!i.dataset)return;
  if(i.dataset.r61f){e.stopPropagation();const [rid,f]=i.dataset.r61f.split(':'),r=(C.routines||[]).find(x=>x.id===rid);if(!r)return;let v=i.value;if(f==='xp'||f==='gold')v=Math.max(0,parseInt(v)||0);if(f==='name'){v=v.trim();if(!v)return;const t=rtT(r);if(t){t.title=v;saveTask(t)}}r[f]=v;save('config');syncDailies(C);redrawRt61();render();return}
  if(i.dataset.r61s){e.stopPropagation();const [rid,si,f]=i.dataset.r61s.split(':'),r=(C.routines||[]).find(x=>x.id===rid),s=r&&r.steps[+si];if(!s)return;if(f==='min')s.min=Math.max(0,parseInt(i.value)||0);else{const v=i.value.trim();if(!v)return;s.name=v}save('config');redrawRt61();return}},true);
// 루틴 창 안의 📅·☑ (원래 편집 화면만 다시 그렸음) → 창도 다시
document.addEventListener('click',e=>{if(sheetCtx&&sheetCtx.rt61&&e.target.closest('#sheetC [data-x60rwd]'))setTimeout(redrawRt61,0)});
document.addEventListener('change',e=>{if(sheetCtx&&sheetCtx.rt61&&e.target.closest('#sheetC [data-x60rq]'))setTimeout(redrawRt61,0)});
// 사냥: 단계 이름은 카드·할 일에서, 끝난 할 일 단계는 건너뜀, 할 일 단계를 끝내면 그 할 일도 완료
startRun=(function(prev){return function(o){
  if(o&&o.routine){const r=o.routine,st=(r.steps||[]).filter(stLive61).map(s=>({...s,name:stName61(s)}));if(!st.length){toast('할 단계가 없어요 · 루틴 편집에서 넣어요');return}o={...o,routine:{...r,steps:st}}}
  return prev(o)}})(startRun);
huntDo=(function(prev){return function(k){
  try{if(RUN&&RUN.kind==='routine'&&k==='done'){const s=RUN.steps[RUN.si];const t=s&&s.tid&&TASKS[s.tid];if(t&&t.status===0){ui.off=0;completeTask(t,{direct:true})}}}catch(e){console.error(e)}
  return prev(k)}})(huntDo);
// 루틴으로 만들기 (할 일 · 카드)
function promoteTask61(t){
  if(t.rid){openRt61(t.rid);return}
  const steps=[];if(t.aid){steps.push({aid:t.aid})}
  kidsOf(t.id).filter(k=>k.status===0).sort((a,b)=>(a.order||0)-(b.order||0)).forEach(k=>steps.push({tid:k.id}));
  (t.checks||t.subs||[]).forEach(s=>{const n=(s&&(s.t||s.n||s.name))||'';if(n&&!s.done)steps.push({name:n,min:5})});
  if(!steps.length)steps.push({name:t.title,min:t.dur||10});
  const r=rtNew61(t.title,steps);r.area=areaOfTask(t)||'life';t.rid=r.id;delete t.aid;saveTask(t);save('config');syncDailies(C);render();
  openRt61(r.id);toast(`'${t.title}'를 루틴으로 만들었어요 · 이 할 일을 누르면 루틴이 시작돼요`,5000)}
function promoteCard61(a){const r=rtNew61(a.name+' 루틴',[{aid:a.id}]);r.area=a.area||'life';save('config');openRt61(r.id);toast(`'${a.name}'으로 시작하는 루틴을 만들었어요 · ＋로 단계를 더해요`)}
function rtJoin61(kind,id){
  const rs=C.routines||[];const nm=kind==='a'?(C.actions.find(x=>x.id===id)||{}).name:(TASKS[id]||{}).title;
  openPicker61({title:`⏱ '${nm||''}' 넣을 루틴`,tabs:[{k:'rt',label:'루틴',newLabel:'새 루틴으로',onNew:v=>{const r=rtNew61(v,[kind==='a'?{aid:id}:{tid:id}]);openRt61(r.id)},items:rs.map(r=>({id:r.id,label:r.name,sub:(r.steps||[]).map(stName61).join(' → '),grp:''}))}],
    onPick:([s])=>{const r=rs.find(x=>x.id===s.id);if(!r)return;
      const opts=(r.steps||[]).map((x,i)=>`<button class="chipbtn" data-x61pos="${r.id}:${i}">${i+1}. ${esc(stName61(x))} 앞</button>`).join('')+`<button class="chipbtn" data-x61pos="${r.id}:${(r.steps||[]).length}">맨 끝 (${(r.steps||[]).length+1}단계)</button>`;
      JOIN61={kind,id};menu61At(lastPt.x,lastPt.y,`<div class="m61h">'${esc(r.name)}' 몇 번째 단계로?</div><div class="m61w">${opts}</div>`)}});
}
var JOIN61=null;
addEventListener('click',e=>{const b=e.target.closest('[data-x61pos]');if(!b||!JOIN61)return;e.preventDefault();e.stopPropagation();const [rid,p]=b.dataset.x61pos.split(':'),r=(C.routines||[]).find(x=>x.id===rid);closeMenu61();if(!r)return;
  rtAdd61(r,JOIN61.kind==='a'?{aid:JOIN61.id}:{tid:JOIN61.id},+p);JOIN61=null;toast(`'${r.name}' ${+p+1}단계로 넣었어요`);refresh61()},true);
function refresh61(){try{if(sheetCtx&&sheetCtx.task&&$('tsTitle'))tsRedraw();else if(sheetCtx&&sheetCtx.aedit)openActionEditor(sheetCtx.aedit);else if(sheetCtx&&sheetCtx.rt61)redrawRt61()}catch(e){console.error(e)}if(curView()==='edit')reEdit();render()}

/* ---- 7) 이어진 곳 칩: 누르면 가고, ×로 바로 끊기 (어느 쪽에서든) ---- */
function cx61(chip,un,tip){return `<span class="cx61">${chip}<button type="button" class="cxx" data-x61un="${un}" title="${esc(tip||'연결 끊기')}" aria-label="${esc(tip||'연결 끊기')}">×</button></span>`}
connCard60=function(a,skip){
  if(!a)return [];const out=[],ht=habT(a);
  if(ht&&skip!=='task:'+ht.id)out.push(cx61(chip60(`${ht.quest?'☑':'↻'} ${esc(rhythmText(ht).replace(/^\S+\s/,''))}`,`data-x60task="${ht.id}"`,'반복 할 일 열기 (언제 뜨는지·일퀘)'),'rep:'+a.id,'반복 끄기'));
  else if(!ht&&a.type==='good'&&!a.link)out.push(chip60('＋ 반복',`data-x60rep="${a.id}"`,'매일·요일을 정하면 ↻ 습관이 돼요'));
  rtOf61('a',a.id).forEach(({r,i})=>{if(skip!=='rt:'+r.id)out.push(cx61(chip60(`⏱ ${esc(r.name.replace(/^\S+\s/,''))} ${i+1}단계`,`data-x60rt="${r.id}"`,'루틴 열기'),`step:${r.id}:${i}`,'이 루틴에서 빼기'))});
  if(a.type==='good')out.push(chip60('＋ 루틴에',`data-x61join="a:${a.id}"`,'루틴의 몇 번째 단계로 넣기'));
  if(a.dopa){const c=dopaC().find(x=>x[0]===a.dopa);if(c)out.push(cx61(chip60(`🍬 ${esc(c[1])}`,`data-goedit="dopa"`,'도파민 메뉴 편집'),'dopa:'+a.id,'도파민 메뉴에서 빼기'))}
  if(a.brave){const z=braveSize(a);out.push(cx61(chip60(`⚔ 용기${z?' '+esc(z.name):''}`,`data-aedit="${a.id}"`),'brave:'+a.id,'용기 표시 끄기'))}
  if(a.link)out.push(`<span class="mx">🔗 ${esc(linkName(a.link))}</span>`);
  Object.values(TASKS).filter(t=>t.status===0&&t.aid===a.id&&!t.hab&&skip!=='task:'+t.id).slice(0,3).forEach(t=>out.push(cx61(chip60(`📋 ${esc(t.title.length>14?t.title.slice(0,14)+'…':t.title)}${t.due?' · '+esc(dueLabel(t.due)):''}`,`data-x60task="${t.id}"`,'이 카드와 연결된 할 일'),'taid:'+t.id,'할 일과 카드 연결 끊기')));
  return out};
connRt60=function(r,skip){
  if(!r)return [];const out=[],t=rtT(r);
  if(t&&skip!=='task:'+t.id)out.push(chip60(`${t.quest?'☑ ':'↻ '}${esc(repLabel(t.rep))}`,`data-x60task="${t.id}"`,'이 루틴의 반복 할 일'));
  (r.steps||[]).forEach((s,i)=>{if(skip==='task:'+s.tid)return;const a=s.aid&&s.aid!=='@weigh'&&C.actions.find(x=>x.id===s.aid),tk=s.tid&&TASKS[s.tid];
    if(a)out.push(cx61(chip60(`${i+1}. 🃏 ${esc(a.name)}`,`data-aedit="${a.id}"`,'카드 열기'),`step:${r.id}:${i}`,'루틴에서 빼기'));
    else if(tk)out.push(cx61(chip60(`${i+1}. 📋 ${esc(tk.title)}`,`data-x60task="${tk.id}"`,'할 일 열기'),`step:${r.id}:${i}`,'루틴에서 빼기'))});
  out.push(chip60('✎ 루틴',`data-x60rt="${r.id}"`,'루틴 열기'));
  return out};
function connTask61(t){const out=[];rtOf61('t',t.id).forEach(({r,i})=>out.push(cx61(chip60(`⏱ ${esc(r.name)} ${i+1}단계`,`data-x60rt="${r.id}"`,'루틴 열기'),`step:${r.id}:${i}`,'이 루틴에서 빼기')));return out}
// 루틴 칩은 편집 화면으로 가지 않고 그 자리에서 루틴 창 · ＋ 루틴에 · × 끊기
addEventListener('click',e=>{const b=e.target.closest('[data-x60rt],[data-x61join],[data-x61un],[data-x61promote]');if(!b)return;
  if(b.closest('#pk61'))return;e.preventDefault();e.stopPropagation();const d=b.dataset;
  if(d.x60rt){if(typeof closeInfo==='function'&&b.closest('#pop'))closeInfo();openRt61(d.x60rt);return}
  if(d.x61join){const [k,id]=d.x61join.split(':');lastPt={x:e.clientX,y:e.clientY};rtJoin61(k,id);return}
  if(d.x61promote){const [k,id]=d.x61promote.split(':');if(k==='t'){const t=TASKS[id];if(t){tsFlush();promoteTask61(t)}}else{const a=C.actions.find(x=>x.id===id);if(a)promoteCard61(a)}return}
  const [k,id,si]=d.x61un.split(':');
  if(k==='step'){const r=(C.routines||[]).find(x=>x.id===id);if(!r)return;if(r.steps.length<=1){toast('루틴에 단계가 하나뿐이에요 · 루틴을 지우려면 루틴 창에서');return}const s=r.steps.splice(+si,1)[0];save('config');refresh61();toastAct(`'${r.name}'에서 '${stName61(s)}' 뺐어요`,'되돌리기',()=>{r.steps.splice(+si,0,s);save('config');refresh61()});return}
  if(k==='rep'){const a=C.actions.find(x=>x.id===id),t=a&&habT(a);if(!t)return;const rep=clone(t.rep),q=!!t.quest;setRhythm(a,null);refresh61();toastAct(`'${a.name}' 반복을 껐어요`,'되돌리기',()=>{setRhythm(a,rep,{quest:q?1:0});refresh61()});return}
  if(k==='dopa'){const a=C.actions.find(x=>x.id===id);if(!a)return;const o=a.dopa,oo=a.dopaOnly;delete a.dopa;delete a.dopaOnly;save('config');refresh61();toastAct(`'${a.name}' 도파민 메뉴에서 뺐어요`,'되돌리기',()=>{a.dopa=o;if(oo)a.dopaOnly=oo;save('config');refresh61()});return}
  if(k==='brave'){const a=C.actions.find(x=>x.id===id);if(!a)return;const o=a.brave;delete a.brave;save('config');refresh61();toastAct(`'${a.name}' 용기 표시를 껐어요`,'되돌리기',()=>{a.brave=o;save('config');refresh61()});return}
  if(k==='taid'){const t=TASKS[id];if(!t)return;const o=t.aid;delete t.aid;saveTask(t);refresh61();toastAct(`'${t.title}' 카드 연결을 끊었어요`,'되돌리기',()=>{t.aid=o;saveTask(t);refresh61()});return}
},true);
// 할 일 상세 🃏 칸: 루틴 단계로 넣기 · 루틴으로 만들기
drawTaskSheet=(function(prev){return function(){const x=prev.apply(this,arguments);try{
  const t=sheetCtx&&sheetCtx.task&&TASKS[sheetCtx.task];const box=t&&document.querySelector('#sheetC .tpanel[data-p="card"] .ln60');
  if(box&&!box.querySelector('.rj61')){const d=document.createElement('div');d.className='rj61';
    const mem=connTask61(t);
    d.innerHTML=`<div class="conn60"><span class="tiny muted">⏱ 루틴 단계</span>${mem.join('')}${t.status===0?chip60('＋ 루틴에 넣기',`data-x61join="t:${t.id}"`,'다른 루틴의 몇 번째 단계로'):''}</div>
      ${t.rid?'':`<button class="btn ghost sm" data-x61promote="t:${t.id}" title="${kidsOf(t.id).length?'묶인 할 일이 단계가 돼요':'체크리스트가 단계가 돼요'}">⏱ 이 할 일을 루틴으로 만들기${kidsOf(t.id).length?` (묶인 ${kidsOf(t.id).length}개 → 단계)`:''}</button>`}`;
    box.appendChild(d)}
  // 묶음: '있는 할 일 넣기' = 고르기 창
  const sel=$('x56KPick');if(sel&&t){const b=document.createElement('button');b.type='button';b.className='btn ghost sm';b.dataset.x61kpick=t.id;b.textContent='＋ 있는 할 일 넣기… (찾기·여러 개)';sel.replaceWith(b)}
}catch(e){console.error(e)}return x}})(drawTaskSheet);
function kidPick61(head){
  const cand=openTasks().filter(x=>x.id!==head.id&&x.parent!==head.id&&!kidsOf(x.id).length&&!x.hab),td=dateKey();
  const grpOf=x=>x.list===head.list?'📂 같은 목록 · '+listName(x.list||'inbox'):'📂 '+listName(x.list||'inbox');
  openPicker61({title:`📦 '${head.title}' 묶음에 넣기`,multi:true,tabs:[
    {k:'all',label:'모두',items:cand.map(x=>({id:x.id,label:x.title,sub:[x.due?dueLabel(x.due):'날짜 없음',(x.tags||[]).map(g=>'#'+g).join(' ')].filter(Boolean).join(' · '),grp:grpOf(x),score:x.list===head.list?3:0}))},
    {k:'soon',label:'📅 이번 주',items:cand.filter(x=>x.due&&x.due<=addDays(td,7)).map(x=>({id:x.id,label:x.title,sub:dueLabel(x.due),grp:x.due<=td?'오늘·지난 것':'7일 안'}))},
    {k:'nod',label:'날짜 없음',items:cand.filter(x=>!x.due).map(x=>({id:x.id,label:x.title,sub:(x.tags||[]).map(g=>'#'+g).join(' '),grp:grpOf(x)}))}],
    onPick:sel=>{sel.forEach(({id})=>{const k=TASKS[id];if(k){k.parent=head.id;saveTask(k)}});saveTask(head);refresh61();toast(`${sel.length}개를 묶음에 넣었어요`)}})}
addEventListener('click',e=>{const b=e.target.closest('[data-x61kpick]');if(!b)return;e.preventDefault();e.stopPropagation();tsFlush();const h=TASKS[b.dataset.x61kpick];if(h)kidPick61(h)},true);

/* ---- 8) 우클릭(폰은 꾹) 메뉴: 화면을 바꾸지 않고 그 자리에서 ---- */
var M61=null,lastPT61='mouse';
addEventListener('pointerdown',e=>{lastPT61=e.pointerType||'mouse';const m=$('m61');if(M61&&m&&!m.contains(e.target))closeMenu61()},true);
function closeMenu61(){M61=null;const m=$('m61');if(m){m.hidden=true;m.innerHTML=''}}
function menu61At(x,y,html){let m=$('m61');if(!m){m=document.createElement('div');m.id='m61';m.className='ctxmenu';m.setAttribute('role','menu');document.body.appendChild(m)}
  m.innerHTML=html;m.hidden=false;M61=M61||{};const r=m.getBoundingClientRect();m.style.left=clamp(x,8,innerWidth-r.width-8)+'px';m.style.top=clamp(y,8,innerHeight-r.height-8)+'px'}
function menu61(x,y,title,items){M61={items};menu61At(x,y,`${title?`<div class="m61h">${title}</div>`:''}${items.map((it,i)=>it==='-'?'<hr>':it.html?it.html:`<button type="button" role="menuitem" data-m61="${i}" ${it.dis?'disabled':''} class="${it.bad?'bad':''}">${it.l}</button>`).join('')}`);M61={items}}
addEventListener('click',e=>{const m=$('m61');if(!M61||!m||!m.contains(e.target))return;const b=e.target.closest('[data-m61]');if(!b)return;e.preventDefault();e.stopPropagation();const it=M61.items[+b.dataset.m61];if(!it)return;if(it.keep){it.f(b);return}closeMenu61();try{it.f()}catch(x){console.error(x)}},true);
addEventListener('keydown',e=>{if(e.key==='Escape'&&M61){e.preventDefault();e.stopImmediatePropagation();closeMenu61()}},true);
var LCOL61=[['','색 없음'],['#d64545','빨강'],['#e07a10','주황'],['#c9a227','노랑'],['#3f9a4a','초록'],['#8a5cc7','보라'],['#d14f92','분홍'],['#8a6a4a','갈색'],['#7d8594','회색']];
function listMenu61(l,x,y){
  const i=C.lists.indexOf(l),inbox=l.id==='inbox';
  const nm=`<div class="m61f"><input id="m61name" value="${esc(l.name)}" ${inbox?'disabled':''} aria-label="목록 이름" maxlength="40"><button class="btn sm" data-m61="1">바꾸기</button></div>`;
  const cols=`<div class="m61w">${LCOL61.map(([c,n])=>`<button type="button" class="chipbtn lc61" data-m61col="${c}" aria-pressed="${(l.color||'')===c}" title="${n}"><i style="background:${c||'transparent'}"></i>${n}</button>`).join('')}</div>`;
  menu61(x,y,`📂 ${esc(l.name)}`,[
    {html:nm,f:()=>{}},{l:'✎ 이름 바꾸기',keep:1,dis:inbox,f:()=>{const v=($('m61name')||{}).value;if(!v||!v.trim())return;l.name=v.trim();save('config');closeMenu61();render();toast('이름을 바꿨어요')}},
    {html:`<div class="m61h">🎨 색 (목록 왼쪽 띠 · 캘린더)</div>${cols}`,f:()=>{}},
    {l:'📁 폴더…',keep:1,f:()=>{const f=prompt('폴더 이름 (비우면 폴더 없이)',l.folder||'');if(f==null)return;l.folder=f.trim();save('config');closeMenu61();render()}},
    {l:'📝 설명…',keep:1,f:()=>{const f=prompt('어떤 목록인가요?',l.desc||'');if(f==null)return;l.desc=f.trim();save('config');closeMenu61();render()}},
    '-',
    {l:'↑ 위로',dis:i<=1,f:()=>{const j=i-1;[C.lists[i],C.lists[j]]=[C.lists[j],C.lists[i]];save('config');render()}},
    {l:'↓ 아래로',dis:i>=C.lists.length-1,f:()=>{const j=i+1;[C.lists[i],C.lists[j]]=[C.lists[j],C.lists[i]];save('config');render()}},
    {l:'＋ 이 목록에 할 일',f:()=>{C.ui.tasks.sel='l:'+l.id;save('config');location.hash='tasks';render();setTimeout(()=>{const a=$('tAdd');if(a)a.focus()},120)}},
    {l:'🗑 목록 지우기 (할 일은 기본함으로)',bad:1,dis:inbox,f:()=>{const snap=clone(C.lists),moved=Object.values(TASKS).filter(t=>t.list===l.id);moved.forEach(t=>{t.list='inbox';saveTask(t)});C.lists=C.lists.filter(x=>x!==l);save('config');render();toastAct(`'${l.name}' 목록을 지웠어요`,'되돌리기',()=>{C.lists=snap;moved.forEach(t=>{t.list=l.id;saveTask(t)});save('config');render()})}}]);M61.list=l;
  setTimeout(()=>{const n=$('m61name');if(n&&!inbox)n.select()},20)}
addEventListener('click',e=>{const b=e.target.closest('[data-m61col]');if(!b||!M61)return;e.preventDefault();e.stopPropagation();const l=M61.list;if(!l)return;
  if(b.dataset.m61col)l.color=b.dataset.m61col;else delete l.color;save('config');closeMenu61();render()},true);
addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target&&e.target.id==='m61name'){e.preventDefault();e.stopPropagation();const b=document.querySelector('#m61 [data-m61="1"]');if(b)b.click()}},true);
function skipToday61(t){const td=dateKey();if(t.rep&&t.rep.f){t.skip61=[...new Set([...(t.skip61||[]).filter(d=>d>=addDays(td,-14)),td])];if(t.due&&t.due<=td){const nd=nextDue(t.rep,td);if(nd)t.due=nd}delete t.skull;saveTask(t);syncDailies(C);save('config');render();toastAct(`'${t.title}' 오늘은 건너뛰어요 (☠ 없이)`,'되돌리기',()=>{t.skip61=(t.skip61||[]).filter(d=>d!==td);t.due=td;saveTask(t);syncDailies(C);save('config');render()});return}
  t.status=-1;t.doneAt=td;saveTask(t);render();toastAct(`'${t.title}' 안 하기로 했어요`,'되돌리기',()=>{t.status=0;delete t.doneAt;saveTask(t);render()})}
function taskMenu61(t,x,y){
  const td=dateKey(),rep=!!(t.rep&&t.rep.f),open=t.status===0;
  menu61(x,y,`📋 ${esc(t.title.length>24?t.title.slice(0,24)+'…':t.title)}`,[
    {l:'✎ 열기',f:()=>openTaskSheet(t.id)},
    {l:t.rid?'⏱ 루틴 시작':'✓ 끝내기',dis:!open,f:()=>{const r=t.rid&&(C.routines||[]).find(z=>z.id===t.rid);if(r)startRun({routine:r});else completeTask(t)}},
    '-',
    {l:'📅 오늘로',dis:!open||t.due===td,f:()=>{t.due=td;saveTask(t);render();toast('오늘로 옮겼어요')}},
    {l:rep?'⏭ 오늘은 건너뛰기':'⏩ 내일로 미루기',dis:!open,f:()=>{if(rep)skipToday61(t);else postpone(t,addDays(td,1))}},
    {l:'⏩ 다음 주 월요일로',dis:!open||rep,f:()=>postpone(t,addDays(weekStart(td),7))},
    {l:rep?'🚫 반복 그만두기':'🚫 안 하기',dis:!open,f:()=>{if(rep){t.status=-1;t.doneAt=td;saveTask(t);render();toastAct(`'${t.title}' 반복을 그만뒀어요`,'되돌리기',()=>{t.status=0;delete t.doneAt;saveTask(t);render()})}else skipToday61(t)}},
    '-',
    {l:t.quest?'☑ 일퀘에서 빼기':'☑ 일퀘로 (반복하는 날에)',dis:!rep||!!(t.hab&&t.aid&&!rep),f:()=>{if(t.quest)delete t.quest;else t.quest=1;saveTask(t);syncDailies(C);save('config');render();toast(t.quest?'☑ 일퀘가 됐어요':'일퀘에서 뺐어요')}},
    {l:'⏱ 루틴에 넣기…',dis:!open,f:()=>{lastPt={x,y};rtJoin61('t',t.id)}},
    {l:t.rid?'⏱ 루틴 열기':'⏱ 이 할 일을 루틴으로',dis:!open,f:()=>promoteTask61(t)},
    {l:'📦 묶음에 넣기…',dis:!open||!!kidsOf(t.id).length,f:()=>{const hs=openTasks().filter(h=>h.id!==t.id&&!h.parent&&!h.hab);openPicker61({title:`📦 '${t.title}'를 넣을 묶음`,tabs:[{k:'h',label:'묶음 머리',newLabel:'새 묶음으로',onNew:v=>{const h=newTask({title:v,list:t.list||'inbox'});saveTask(h);t.parent=h.id;saveTask(t);render();toast(`'${v}' 묶음을 만들었어요`)},items:hs.map(h=>({id:h.id,label:h.title,sub:kidsOf(h.id).length?'📦 '+kidsOf(h.id).length+'개':'',grp:'📂 '+listName(h.list||'inbox'),score:kidsOf(h.id).length?5:0}))}],onPick:([s])=>{t.parent=s.id;saveTask(t);render();toast('묶음에 넣었어요')}})}},
    {l:'🗑 지우기',bad:1,f:()=>{const snap=clone(t);deleteTask(t.id);render();toastAct(`'${t.title}' 지웠어요`,'되돌리기',()=>{saveTask(snap);render()})}}])}
function questMenu61(q,x,y){
  const t=q.tid&&TASKS[q.tid],a=C.actions.find(z=>z.id===q.action),day=curDay(),dn=questDone(day,q);
  menu61(x,y,`☑ ${esc(q.name)}`,[
    {l:dn?'↩ 체크 풀기':'✓ 체크',f:()=>toggleQuest(q)},
    {l:'✎ 할 일 열기 (반복·요일)',dis:!t,f:()=>openTaskSheet(t.id)},
    {l:'🃏 카드 편집',dis:!a,f:()=>openActionEditor(a.id)},
    '-',
    {l:'⏭ 오늘은 건너뛰기 (☠ 없이)',dis:!t||dn,f:()=>skipToday61(t)},
    {l:'☑ 일퀘에서 빼기 (반복은 그대로)',dis:!t,f:()=>{delete t.quest;saveTask(t);syncDailies(C);save('config');render();toastAct('일퀘에서 뺐어요','되돌리기',()=>{t.quest=1;saveTask(t);syncDailies(C);save('config');render()})}},
    {l:'📅 요일 바꾸기 (일퀘 편집)',f:()=>goEdit('dailies')}])}
function actMenu61(a,x,y){
  const ht=habT(a),good=a.type==='good';
  menu61(x,y,`${good?'▲':'▼'} ${esc(a.name)}`,[
    {l:'✓ 했어요 기록',dis:!!a.doneAt,f:()=>doAction(a)},
    {l:'✎ 편집',f:()=>openActionEditor(a.id)},
    {l:'ℹ 설명·이어진 곳',f:()=>{lastPt={x,y};openInfo('act:'+a.id)}},
    '-',
    {l:ht?'↻ 반복 할 일 열기':'↻ 매일 반복으로',dis:!good,f:()=>{if(ht)openTaskSheet(ht.id);else{const t=setRhythm(a,{f:'d',i:1});render();if(t)openTaskSheet(t.id)}}},
    {l:ht&&ht.quest?'☑ 일퀘 끄기':'☑ 일퀘로',dis:!good,f:()=>{if(ht){if(ht.quest)delete ht.quest;else ht.quest=1;saveTask(ht);syncDailies(C);save('config')}else setRhythm(a,{f:'d',i:1},{quest:1});render();toast(habT(a)&&habT(a).quest?'☑ 일퀘가 됐어요':'일퀘를 껐어요')}},
    {l:'⏱ 루틴에 넣기…',dis:!good,f:()=>{lastPt={x,y};rtJoin61('a',a.id)}},
    {l:'⏱ 이 카드로 루틴 만들기',dis:!good,f:()=>promoteCard61(a)},
    {l:a.brave?'⚔ 용기 표시 끄기':'⚔ 용기 표시 (보통)',dis:!good,f:()=>{if(a.brave)delete a.brave;else a.brave='m';save('config');render();toast(a.brave?'⚔ 용기 카드가 됐어요 · 보스에게 치명타':'용기 표시를 껐어요')}},
    {html:good?`<div class="m61h">🍬 도파민 코스</div><div class="m61w">${dopaC().map(c=>`<button type="button" class="chipbtn" data-m61dopa="${a.id}:${c[0]}" aria-pressed="${a.dopa===c[0]}">${esc(c[1])}</button>`).join('')}${a.dopa?`<button type="button" class="chipbtn" data-m61dopa="${a.id}:">빼기</button>`:''}</div>`:'',f:()=>{}},
    '-',
    {l:'🗑 지우기',bad:1,f:()=>delActs([a.id])}])}
addEventListener('click',e=>{const b=e.target.closest('[data-m61dopa]');if(!b)return;e.preventDefault();e.stopPropagation();const [id,co]=b.dataset.m61dopa.split(':'),a=C.actions.find(x=>x.id===id);closeMenu61();if(!a)return;if(co)a.dopa=co;else{delete a.dopa;delete a.dopaOnly}save('config');render();toast(co?`🍬 ${(dopaC().find(c=>c[0]===co)||['',''])[1]}에 넣었어요`:'도파민 메뉴에서 뺐어요')},true);
function chipMenu61(b,x,y){const un=b.parentElement&&b.parentElement.classList.contains('cx61')?b.parentElement.querySelector('[data-x61un]'):null;
  menu61(x,y,esc(b.textContent.trim()),[{l:'↗ 열기',f:()=>b.click()},{l:'✂ 연결 끊기',dis:!un,bad:1,f:()=>un&&un.click()}])}
addEventListener('contextmenu',e=>{
  if(e.target.closest('input,textarea,select,#pk61'))return;
  const touch=lastPT61==='touch',x=e.clientX,y=e.clientY;let done=false;const go=f=>{e.preventDefault();e.stopPropagation();lastPt={x,y};f();done=true};
  const hold=e.target.closest('[data-dragmode="hold"]');
  const li=e.target.closest('#tSide [data-tsel^="l:"]');if(li&&!touch){const l=C.lists.find(z=>'l:'+z.id===li.dataset.tsel);if(l)go(()=>listMenu61(l,x,y));return}
  const tr=e.target.closest('.trow[data-task],[data-ctask],.mini[data-ctask]');if(tr&&!(touch&&hold)){const t=TASKS[tr.dataset.task||tr.dataset.ctask];if(t)go(()=>taskMenu61(t,x,y));if(done)return}
  const qr=e.target.closest('.quest[data-info^="quest:"],.trow.hab');if(qr){const qb=qr.querySelector('[data-quest]');const q=qb&&(C.dailies||[]).find(z=>z.id===qb.dataset.quest);if(q){go(()=>questMenu61(q,x,y));return}}
  const ar=e.target.closest('.act[data-info^="act:"],.erow3[data-rowid],[data-drag^="act:"],[data-aeditchip],.ditem[data-dopa],.ditem[data-x57ddo]');if(ar&&!(touch&&ar.matches('[data-dragmode="hold"]'))){const id=ar.dataset.info?ar.dataset.info.slice(4):ar.dataset.rowid||(ar.dataset.drag||'').replace(/^act:/,'')||ar.dataset.aeditchip||ar.dataset.dopa||ar.dataset.x57ddo;const a=C.actions.find(z=>z.id===id);if(a){go(()=>actMenu61(a,x,y));return}}
  const ch=e.target.closest('.x60c');if(ch){go(()=>chipMenu61(ch,x,y));return}
},true);

/* ---- 9) 뒤로 가기: 창에서 다른 창으로 넘어가면 '← 뒤로' ---- */
var NAV61=[],NAVGO61=0,PRE61=null;
function sheetOpen61(){return !$('sheet').hidden||document.body.classList.contains('docked')}
function cur61(){
  if(sheetOpen61()&&sheetCtx){if(sheetCtx.task&&TASKS[sheetCtx.task])return{k:'task',id:sheetCtx.task,n:TASKS[sheetCtx.task].title};if(sheetCtx.aedit){const a=C.actions.find(x=>x.id===sheetCtx.aedit);return{k:'ae',id:sheetCtx.aedit,n:a?a.name:'카드'}}
    if(sheetCtx.rt61){const r=(C.routines||[]).find(x=>x.id===sheetCtx.rt61);return{k:'rt',id:sheetCtx.rt61,n:r?r.name:'루틴'}}}
  if(infoKey&&!$('pop').hidden)return{k:'info',id:infoKey,n:($('pop').querySelector('h3')||{}).textContent||'설명',pt:{...lastPt}};
  return null}
addEventListener('pointerdown',e=>{PRE61={c:cur61(),at:Date.now()}},true);
function navPush61(target){if(NAVGO61)return;const c=PRE61&&Date.now()-PRE61.at<1500?PRE61.c:cur61();if(!c){NAV61=[];hidePill61();return}if((c.k===target.k&&c.id===target.id))return;const top=NAV61[NAV61.length-1];if(top&&top.k===c.k&&top.id===c.id)return;NAV61.push(c);if(NAV61.length>12)NAV61.shift()}
openTaskSheet=(function(prev){return function(id){navPush61({k:'task',id});return prev.apply(this,arguments)}})(openTaskSheet);
openActionEditor=(function(prev){return function(id){navPush61({k:'ae',id});return prev.apply(this,arguments)}})(openActionEditor);
var _openRt61=openRt61;openRt61=function(id){navPush61({k:'rt',id});return _openRt61(id)};
closeSheet=(function(prev){return function(){if(PK61){closePicker61();return}if(M61){closeMenu61();return}const r=prev.apply(this,arguments);if(!NAVGO61)setTimeout(()=>{if(!sheetOpen61()&&!NAVGO61)backPill61()},0);return r}})(closeSheet);
openSheet=(function(prev){return function(h,c){const r=prev(h,c);try{hidePill61();backBtn61()}catch(e){console.error(e)}return r}})(openSheet);
function backBtn61(){const sc=$('sheetC');if(!sc)return;const old=sc.querySelector(':scope>.back61');if(old)old.remove();const top=NAV61[NAV61.length-1];if(!top||!sheetCtx||!(sheetCtx.task||sheetCtx.aedit||sheetCtx.rt61))return;
  const b=document.createElement('button');b.type='button';b.className='back61';b.dataset.back61='1';b.innerHTML=`← 뒤로 <span class="tiny muted">${esc(String(top.n||'').slice(0,26))}</span>`;const g=sc.querySelector(':scope>.grab');if(g)g.after(b);else sc.prepend(b)}
function goBack61(){const top=NAV61.pop();if(!top)return;NAVGO61=1;try{
  if(top.k==='task'&&TASKS[top.id])openTaskSheet(top.id);
  else if(top.k==='ae'&&C.actions.find(x=>x.id===top.id))openActionEditor(top.id);
  else if(top.k==='rt')openRt61(top.id);
  else if(top.k==='info'){if(sheetOpen61())closeSheet();lastPt=top.pt||lastPt;openInfo(top.id)}}finally{NAVGO61=0}
  hidePill61();try{backBtn61()}catch(e){}}
function backPill61(){const top=NAV61[NAV61.length-1];if(!top){return}let p=$('back61p');if(!p){p=document.createElement('button');p.id='back61p';p.type='button';p.dataset.back61='1';document.body.appendChild(p)}
  p.innerHTML=`← '${esc(String(top.n||'').slice(0,20))}'로 돌아가기`;p.hidden=false;clearTimeout(window.__bp61);window.__bp61=setTimeout(()=>{hidePill61();NAV61=[]},9000)}
function hidePill61(){const p=$('back61p');if(p)p.hidden=true}
addEventListener('click',e=>{const b=e.target.closest('[data-back61]');if(!b)return;e.preventDefault();e.stopPropagation();goBack61()},true);
addEventListener('hashchange',()=>{if(!sheetOpen61())setTimeout(()=>{if(NAV61.length&&!sheetOpen61())backPill61()},50)});

/* ---- 10) 📖 보스·쫄따구 도감 ---- */
var LORE61={'미루기 괴물':['"나중에"를 먹고 커져요. 오늘 할 일이 미뤄질수록 단단해져요.','작은 일 하나라도 오늘 끝내면 아파해요. ⚡ 번개(10분 안) 할 일이 잘 들어요.'],
  '망설임의 안개':['시작하기 전 머뭇거리는 순간에 피어나요.','⏳ 딱 5분만, 첫 동작만. ⚔ 용기 기록이 안개를 걷어요.'],
  '완벽주의 골렘':['"제대로 할 수 있을 때"를 기다리게 만들어요.','완성 말고 초안. 끝낸 횟수가 데미지예요.'],
  '무기력 늪지기':['몸이 무거운 날 발목을 잡아요.','몸을 깨우는 짧은 것(🍬 처짐 코스)·🥗 식사·🔋 컨디션 행동이 잘 들어요.'],
  '불안 안개':['머릿속 걱정을 부풀려요.','브레인 덤핑·적어두기·⚔ 무서운 것 하나 해보기.'],
  '회피 박쥐':['불편한 연락·처리를 피해 날아다녀요.','미뤄둔 연락 하나. ⚔ 용기 할 일은 치명타예요.']};
var MOB61=[['task','📋','보통 쫄따구','그냥 오늘 할 일. 끝내면 처치, 얻은 XP는 보스 데미지.'],['rep','↻','매일 오는 쫄따구','반복 할 일·습관. 쓰러뜨려도 다음 날 다시 와요(☠ 없이).'],['skull','☠','고집 쫄따구','미룬 할 일(☠). 세 번 미루면 삼진아웃 — 쪼개거나 버려요.'],['late','⏰','지각 쫄따구','마감이 지난 할 일.'],['brave','⚔','겁주는 쫄따구','⚔ 용기 할 일. 처치하면 보스에게 치명타.'],['pack','📦','무리','📦 묶음 머리. 묶인 할 일을 하나씩 해치워요.'],['rt','⏱','줄 선 무리','⏱ 루틴. 단계마다 한 마리씩.']];
function mobKind61(t){if(!t)return 'task';if(t.rid)return 'rt';if(kidsOf(t.id).length)return 'pack';if(t.brave||((C.actions.find(a=>a.id===t.aid)||{}).brave))return 'brave';if(t.deadline&&t.deadline<dateKey())return 'late';if(t.skull)return 'skull';if(t.rep&&t.rep.f)return 'rep';return 'task'}
function dexHTML61(){
  const td=dateKey(),cur=bossOf(td).name,kills={};for(const k in DAYS)(DAYS[k].entries||[]).forEach(e=>{if(e.kind==='boss'){let n=String(e.name||'').replace(/^주간 보스 처치:\s*/,'');n=(typeof BOSS_OLD60!=='undefined'&&BOSS_OLD60[n])||n;kills[n]=(kills[n]||0)+1}});
  const next=n=>{for(let w=0;w<BOSSES.length+1;w++){const k=addDays(weekStart(td),7*w);if(bossOf(k).name===n)return w===0?'이번 주':w===1?'다음 주':`${w}주 뒤`}return ''};
  const ws=weekState(td),open=openTasks().filter(t=>t.due&&t.due<=td),cnt={};open.forEach(t=>{const k=mobKind61(t);cnt[k]=(cnt[k]||0)+1});
  return `<div class="sh"><h3>📖 보스·쫄따구 도감</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
  <p class="tiny muted" style="margin:0 0 8px">보스는 한 주에 한 마리씩 돌아가며 나와요(HP ${ws.hp}). 그 주에 얻은 XP가 데미지, 나쁜 행동은 회복, ⚔ 용기는 치명타. 쓰러뜨리면 그 보스의 장비가 떨어져요. 이름은 일부러 '나쁜 습관'이 아니라 마음의 장애물로 지었어요.</p>
  <div class="dex61">${BOSSES.map(([n,c])=>{const g=(typeof GEAR60!=='undefined'?GEAR60:[]).find(x=>x.drop===n),L=LORE61[n]||['',''];
    return `<div class="dx61 ${n===cur?'now':''}"><div class="pic">${bossSVG(c,false)}</div><div><b>${esc(n)}</b> ${n===cur?'<span class="qtag">이번 주</span>':`<span class="tiny muted">${next(n)}</span>`}<p class="small" style="margin:2px 0">${esc(L[0])}</p><p class="tiny" style="margin:2px 0">💡 ${esc(L[1])}</p><span class="tiny muted">처치 ${kills[n]||0}번${g?` · 전리품 🛡 ${esc(g.name)}${kills[n]?' (얻음)':''}`:''}</span></div></div>`}).join('')}</div>
  <h3 style="margin:14px 0 6px;font-size:15px">쫄따구 (오늘 할 일)</h3>
  <div class="dex61 mob">${MOB61.map(([k,ic,n,d],i)=>`<div class="dx61"><div class="pic">${minionSVG(MINI_COL[i%MINI_COL.length],false)}<span class="mb61">${ic}</span></div><div><b>${ic} ${n}</b> <span class="tiny muted">오늘 ${cnt[k]||0}마리</span><p class="tiny" style="margin:2px 0">${d}</p></div></div>`).join('')}</div>
  <p class="tiny muted">약점에 실제 점수 효과를 붙일지는 아직 안 정했어요 (지금은 설명만).</p>`}
function openDex61(){sheetCtx={dex61:1};openSheet(dexHTML61())}
renderBattle=(function(prev){return function(){prev.apply(this,arguments);try{const box=$('battleBox');if(!box)return;
  box.querySelectorAll('.mini[data-ctask]').forEach(m=>{const t=TASKS[m.dataset.ctask],k=mobKind61(t),M=MOB61.find(x=>x[0]===k);if(M&&!m.querySelector('.mb61')){const s=document.createElement('span');s.className='mb61';s.textContent=M[1];m.appendChild(s);m.title=(m.title||'')+' · '+M[2]}});
  if(!box.querySelector('[data-x61dex]'))box.insertAdjacentHTML('beforeend','<button class="btn ghost sm" data-x61dex="1" style="margin-top:6px">📖 보스·쫄따구 도감</button>')}catch(e){console.error(e)}}})(renderBattle);
addEventListener('click',e=>{const b=e.target.closest('[data-x61dex]');if(!b)return;e.preventDefault();e.stopPropagation();if(b.closest('#pop'))closeInfo();openDex61()},true);
infoFor=(function(prev){return function(k){const r=prev(k);try{if(r&&k==='boss')r.b+='<p><button class="btn ghost sm" data-x61dex="1">📖 도감 보기</button></p>'}catch(e){}return r}})(infoFor);

/* ---- 11) 목록 색 · 오래된 이름 · 뒤처리 ---- */
function listColors61(){try{document.querySelectorAll('#tSide [data-tsel^="l:"]').forEach(b=>{const l=C.lists.find(x=>'l:'+x.id===b.dataset.tsel);const c=l&&l.color;b.style.boxShadow=c?`inset 4px 0 0 ${c}`:'';b.title=(l&&l.desc)||(c?'':b.title)})}catch(e){}}
function mig61(){if(C.mig61||!ready)return;try{(C.gacha&&C.gacha.presets||[]).forEach(p=>{if(p.name==='🍃 짧은 일 3장')p.name='⚡ 번개 3장'})}catch(e){}C.mig61=1;save('config')}
render=(function(prev){return function(){try{mig61()}catch(e){console.error(e)}const r=prev.apply(this,arguments);try{listColors61();if(sheetCtx&&sheetCtx.task&&!$('sheetC').querySelector(':scope>.back61')&&NAV61.length)backBtn61()}catch(e){console.error(e)}return r}})(render);
