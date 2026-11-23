/* ---- v12.6 (w124.js): 루틴 카드 통합·미니멀 R1~R4 + 며칠짜리 끝낸 막대가 목록 색을 따라감 (사용자 11/23 밤: R1~R4 모두 진행) ----
   카드 마크업은 w71·w105·w114·w117·w118·w119·w123이 겹겹이 덧댄 것이라, **맨 바깥에서 완성된 HTML을 DOM으로 한 번 정리**한다(rtCard61/62 감쌈 — 못 찾으면 그냥 지나감).
   · R1 머리 한 줄: 이름 칸 + `✨15 · 💰0 · 생활 ▾`(.sc124 접힘, 누르면 완주 ✨·💰·영역 칸이 펴짐. 값 칸 `data-r61f`는 그대로 접힘 안에).
   · R2 프리셋 = 단계 편집기: `🧭 상황 프리셋 편집·추가` 접힘(details.pe117)을 없앰.
       프리셋 하나 = 이름 줄 `🧭 상황 프리셋 ＋`이 `data-pn117`(바로 새 프리셋 만들기) · 둘 이상 = 단계 목록 위 `.pt124` 탭(data-pt117 = 지금 편집할 프리셋, 오늘 쓰는 프리셋과 별개) +
       단계 목록(.st62s)이 곧 그 프리셋의 목록: 체크(data-pcs117=함) · ↑↓(data-pm117=이 프리셋 순서) · 분(data-pmin118=이 프리셋만. **기본 프리셋은 따로 안 바꾼 단계의 분이 공통 분 = 풀 분(data-r62min)**) ·
       안 하는 단계는 아래 흐리게(체크하면 넣음). 점수·이름·🃏·🔀·◌·🌊·× 는 단계 풀 공통이라 그대로. 이름·아이콘·기본으로·복제·삭제는 `.pm124` 작은 접힘.
       (단계 행이 `.st62`만 직접 자식이 아니거나 행↔단계를 못 이으면 **옛 모양 그대로 둠** — 접힘도 유지.)
   · R3 📅 언제 한 칸: `.when60`(요일·일퀘·건너뛰기·할 일)과 `.when123`(⏰ 기본 시각·프리셋별 시각·요일)을 `.when124` 한 상자로.
       **프리셋 시각을 목록 정렬·홈 추천·알림에도**: 머리 할 일 `t.time`을 그 날짜의 프리셋 시각으로 맞춤(`sync124`, render 앞). 프리셋이 둘 이상이면 머리 시각 = 프리셋 `p.tm` 또는 없으면 **기본 시각 `r.bt124`**
       (기본 시각 칸은 `data-bt124` — w71의 `data-r71time`은 머리 시각을 직접 써서 안 맞으므로 이 칸에서만). 프리셋이 하나로 줄면 `r.bt124`를 머리 시각으로 돌려놓고 지움.
   · R4 실행 화면 순서: 단계 창 `↑ 한 칸 앞/↓ 한 칸 뒤` 아래에 `앞으로도 이 순서로(프리셋에 저장)` 체크(기기 설정 localStorage `hq_sv124`, 기본 꺼짐=오늘만). 켜고 옮기면 오늘 프리셋의 `p.s`에서 두 단계 자리도 바꿈.
   · 며칠짜리 끝낸 막대(.bar83.d119)는 v12.4에서 배경을 회색으로 덮었는데, **목록 라벨 색(--lc70)을 따라가도록**(끝낸 칩과 같은 13%) — v124.css. 점선·취소선·✓는 그대로.
   시험 t131. */

var O124={};
function esc124(s){return typeof esc==='function'?esc(s):String(s==null?'':s)}
function rOf124(id){return (C.routines||[]).find(x=>x.id===id)||null}
function SV124(){try{return localStorage.getItem('hq_sv124')==='1'}catch(e){return false}}

/* ---- R1 머리 한 줄 ---- */
function head124(root,r){
  const kv=root.querySelector('.kv');if(!kv||kv.classList.contains('hd124')||kv.closest('.hd124'))return;
  const labs=[...kv.querySelectorAll(':scope > label')];
  const f=k=>labs.find(l=>l.querySelector(`[data-r61f$=":${k}"]`));
  const nameL=f('name'),xpL=f('xp'),goldL=f('gold'),areaL=f('area');if(!nameL||!xpL||!goldL||!areaL)return;
  const nameI=nameL.querySelector('input'),xp=xpL.querySelector('input').value,gold=goldL.querySelector('input').value,sel=areaL.querySelector('select');
  const an=sel&&sel.options[sel.selectedIndex]?sel.options[sel.selectedIndex].textContent:'';
  nameI.setAttribute('aria-label','루틴 이름');nameI.setAttribute('placeholder','루틴 이름');
  const box=document.createElement('div');box.className='hd124';
  const det=document.createElement('details');det.className='sc124';det.dataset.r=r.id;if(O124['s'+r.id])det.open=true;
  det.innerHTML=`<summary title="완주 보너스·영역 고치기" aria-label="완주 보너스와 영역 펴기">✨${esc124(xp)} · 💰${esc124(gold)} · ${esc124(an)}</summary>`;
  const inner=document.createElement('div');inner.className='kv';
  [xpL,goldL,areaL].forEach(l=>{const t=l.firstChild;if(t&&t.nodeType===3){t.textContent=t.textContent.replace(/\s+$/,'')}inner.appendChild(l)});
  det.appendChild(inner);box.append(nameI,det);kv.replaceWith(box)}

/* ---- R2 프리셋 = 단계 편집기 ---- */
function tabs124(r,e,L,dfl,inc){
  const mins=inc.reduce((a,x)=>a+pmin118(e,x.s),0);
  const chips=L.map(p=>`<button type="button" class="chipbtn" data-pt117="${r.id}|${p.id}" aria-pressed="${p===e}">${esc124(preN117(p))}${p.id===dfl?' ·기본':''}</button>`).join('');
  return `<div class="pt124" data-r="${r.id}"><div class="row" style="gap:6px;flex-wrap:wrap;align-items:center"><span class="tiny muted">✎ 단계 편집</span>${chips}<button type="button" class="chipbtn" data-pn117="${r.id}|${e.id}">＋ 새</button></div>
    <div class="row tiny muted ph124" style="gap:8px;flex-wrap:wrap;align-items:center"><b>${esc124(preN117(e))}</b><span>${inc.length}단계 · ${mins}분</span><span>체크=함 · ↑↓=이 프리셋 순서 · 분=이 프리셋만</span>
      <details class="pm124" data-r="${r.id}"${O124['m'+r.id]?' open':''}><summary>⋯ 이름·기본·복제·삭제</summary>
        <div class="row pe117h" style="gap:6px;flex-wrap:wrap;margin-top:6px"><input class="pe117i" data-pf117="${r.id}|${e.id}|ic" value="${esc124(e.ic||'')}" maxlength="4" aria-label="아이콘" style="width:3.2em;text-align:center"><input class="pe117n" data-pf117="${r.id}|${e.id}|n" value="${esc124(e.n)}" maxlength="12" aria-label="프리셋 이름" style="flex:1;min-width:6em">
          <button type="button" class="btn sm ghost" data-pdef117="${r.id}|${e.id}" ${e.id!==dfl?'':'disabled'}>기본으로</button><button type="button" class="btn sm ghost" data-pdup117="${r.id}|${e.id}">복제</button><button type="button" class="btn sm ghost" data-pdel117="${r.id}|${e.id}">삭제</button></div></details></div></div>`}
function steps124(root,r){
  const L=ensure117(r),pe=root.querySelector('details.pe117'),bar=root.querySelector('.pbar119');
  if(L.length<2){   // 하나뿐: 접힘 대신 바로 새 프리셋
    const b=bar&&bar.querySelector('[data-pe119]');if(b){b.setAttribute('data-pn117',`${r.id}|${L[0].id}`);b.removeAttribute('data-pe119')}
    if(pe)pe.remove();return}
  const wrap=root.querySelector('.st62s');if(!wrap)return;
  const rows=[...wrap.children];if(!rows.length||!rows.every(c=>c.classList.contains('st62')))return;
  const by={};
  rows.forEach(row=>{const m=row.querySelector('[data-r62min]');if(!m)return;const i=+m.dataset.r62min.split(':')[1],s=(r.steps||[])[i];if(s&&s.id)by[s.id]={row,s}});
  if(Object.keys(by).length!==rows.length)return;
  const e=(O117[r.id]&&L.find(p=>p.id===O117[r.id]))||pset117(r),dfl=r.pf117||L[0].id;
  const inc=e.s.map(id=>by[id]).filter(Boolean),exc=Object.keys(by).filter(id=>e.s.indexOf(id)<0).map(id=>by[id]);
  const mk=(x,on,i)=>{const {row,s}=x,key=`${r.id}|${e.id}|${s.id}`;
    const ck=document.createElement('input');ck.type='checkbox';ck.className='pc124';ck.setAttribute('data-pcs117',key);if(on)ck.setAttribute('checked','');ck.setAttribute('aria-label',`${stName61(s)} — 이 프리셋에서 함`);
    const no=row.querySelector('.no');if(no){no.textContent=on?String(i+1):'–';no.parentNode.insertBefore(ck,no)}else row.insertBefore(ck,row.firstChild);
    if(on){
      const m=row.querySelector('[data-r62min]'),ov=e.m&&e.m[s.id]!=null;
      if(m&&(e.id!==dfl||ov)){m.removeAttribute('data-r62min');m.setAttribute('data-pmin118',key);m.setAttribute('value',String(pmin118(e,s)));m.title=`이 프리셋에서 쓰는 분 (비우면 공통 ${s.min||0}분)`;if(ov)m.classList.add('ov')}
      else if(m)m.title='기본 프리셋의 분 = 공통 분 (다른 프리셋에서 따로 안 정했으면 같이 바뀌어요)';
      const up=row.querySelector('[data-r62op^="up:"]'),dn=row.querySelector('[data-r62op^="dn:"]');
      if(up){up.removeAttribute('data-r62op');up.setAttribute('data-pm117',key+'|up');up.disabled=i===0;up.setAttribute('aria-label','이 프리셋에서 위로')}
      if(dn){dn.removeAttribute('data-r62op');dn.setAttribute('data-pm117',key+'|dn');dn.disabled=i===inc.length-1;dn.setAttribute('aria-label','이 프리셋에서 아래로')}
    }else row.classList.add('off124');
    return row};
  const frag=document.createDocumentFragment();
  inc.forEach((x,i)=>frag.appendChild(mk(x,true,i)));
  if(exc.length){const d=document.createElement('div');d.className='tiny muted ex124';d.textContent='이 프리셋에서 안 하는 단계 (체크하면 넣어요)';frag.appendChild(d);exc.forEach(x=>frag.appendChild(mk(x,false,0)))}
  wrap.replaceChildren(frag);
  wrap.insertAdjacentHTML('beforebegin',tabs124(r,e,L,dfl,inc));
  if(pe)pe.remove();
  if(bar)bar.querySelectorAll('.e119[data-pe119]').forEach(b=>b.remove())}

/* ---- R3 📅 언제 한 칸 ---- */
function when124(root,r){
  const w=root.querySelector('.when60'),t=root.querySelector('.when123')||root.querySelector('.when71');
  if(!w||!t||(w.parentElement&&w.parentElement.classList.contains('when124')))return;
  const box=document.createElement('div');box.className='when124';w.parentNode.insertBefore(box,w);box.append(w,t);const pw=root.querySelector('.pwrap123');if(pw)box.append(pw);
  const multi=ensure117(r).length>1;
  const hint=t.querySelector(':scope > .tiny.muted');
  if(multi){
    const i=t.querySelector('[data-r71time]');
    if(i){i.removeAttribute('data-r71time');i.setAttribute('data-bt124',r.id);i.setAttribute('value',r.bt124||'');i.setAttribute('aria-label','루틴 기본 시각')}
    t.querySelectorAll('[data-r71notime]').forEach(b=>b.remove());
    if(r.bt124&&i)i.insertAdjacentHTML('afterend',`<button type="button" class="ib" data-btx124="${r.id}" aria-label="기본 시각 지우기">✕</button>`);
    if(hint)hint.textContent='프리셋 시각이 없으면 이 시각 · 목록·캘린더·홈 추천·알림에 써요'}
  else if(hint)hint.textContent='정하면 할 일 목록·캘린더에서 시간 순서로 서고, 홈 추천은 그 시각 가까이에만 떠요'}

function card124(h,r){
  try{
    if(typeof h!=='string'||!r||h.indexOf('hd124')>=0||h.indexOf('class="jarcard')<0&&h.indexOf('rt62p')<0)return h;
    ensure117(r);
    if(r.ps117.length>1&&r.bt124===undefined){const hh=rtT(r);r.bt124=(hh&&hh.time)||'';sched117()}
    const t=document.createElement('template');t.innerHTML=h;const root=t.content;
    try{head124(root,r)}catch(e){console.error(e)}
    try{steps124(root,r)}catch(e){console.error(e)}
    try{when124(root,r)}catch(e){console.error(e)}
    return t.innerHTML
  }catch(e){console.error(e)}return h}
rtCard62=(function(prev){return function(r){return card124(prev.apply(this,arguments),r)}})(rtCard62);
rtCard61=(function(prev){return function(r){return card124(prev.apply(this,arguments),r)}})(rtCard61);

/* 할 일 상세: w123 mvBack123이 `.when60` 앞에 프리셋 줄을 끼워 넣는데, 이제 `.when60`은 `.when124` 안 → 줄이 상자 안에 들어가므로 상자 앞으로 꺼냄 */
function pbOut124(){const sc=$('sheetC');if(!sc)return;sc.querySelectorAll('.when124 > .pbar119').forEach(b=>{const w=b.parentElement;w.parentNode.insertBefore(b,w)})}
drawTaskSheet=(function(prev){return function(){const x=prev.apply(this,arguments);try{pbOut124()}catch(e){console.error(e)}return x}})(drawTaskSheet);

/* 접힘 열림 기억(카드가 다시 그려져도 유지) */
addEventListener('toggle',e=>{const d=e.target;if(!d||!d.classList||!d.dataset||!d.dataset.r)return;
  if(d.classList.contains('sc124'))O124['s'+d.dataset.r]=d.open?1:0;else if(d.classList.contains('pm124'))O124['m'+d.dataset.r]=d.open?1:0},true);

/* ---- R3 기본 시각 + 머리 할 일 시각 맞추기 ---- */
function redo124(r){try{if(sheetCtx&&sheetCtx.rt64===r.id)rtDone64(r,true);else if(sheetCtx&&sheetCtx.rt61===r.id)redrawRt61();else if(sheetCtx&&sheetCtx.task&&$('tsTitle'))tsRedraw();else if(curView()==='edit')reEdit()}catch(e){console.error(e)}}
addEventListener('change',e=>{const i=e.target;if(!i||!i.dataset||!i.dataset.bt124)return;e.stopPropagation();e.stopImmediatePropagation();
  const r=rOf124(i.dataset.bt124);if(!r)return;r.bt124=i.value||'';save('config');render();redo124(r)},true);
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-btx124]');if(!b)return;e.preventDefault();e.stopPropagation();
  const r=rOf124(b.dataset.btx124);if(!r)return;r.bt124='';save('config');render();redo124(r)},true);
var SYN124=0;
function sync124(){
  if(SYN124||typeof ready==='undefined'||!ready||typeof tasksReady==='undefined'||!tasksReady||!tOK64())return;
  SYN124=1;
  try{(C.routines||[]).forEach(r=>{const L=ensure117(r),h=rtT(r);if(!h)return;
    if(L.length<2){if(r.bt124!==undefined){if((h.time||'')!==r.bt124){h.time=r.bt124||null;saveTask(h)}delete r.bt124;sched117()}return}
    if(r.bt124===undefined){r.bt124=h.time||'';sched117()}
    const p=pset117(r,h.due||gk76()),tm=(p&&p.tm)||r.bt124||'';
    if((h.time||'')!==tm){h.time=tm||null;saveTask(h)}})}
  catch(e){console.error(e)}finally{SYN124=0}}
render=(function(prev){return function(){try{sync124()}catch(e){console.error(e)}return prev.apply(this,arguments)}})(render);

/* ---- R4 실행 화면: 순서 바꾸기를 프리셋에도 저장 ---- */
hMove123=(function(prev){return function(j,dir){
  let sa=null,sb=null,on=false;
  try{on=SV124();if(on&&RUN&&RUN.kind==='routine'){sa=RUN.steps[+j];sb=RUN.steps[+j+dir]}}catch(e){}
  const x=prev.apply(this,arguments);
  try{if(on&&sa&&sb&&RUN.steps[+j]===sb&&RUN.steps[+j+dir]===sa){
    const r=rt75(),ia=rsOf75(r,sa),ib=rsOf75(r,sb);
    if(r&&ia>=0&&ib>=0){const p=pset117(r,gk76()),ida=r.steps[ia].id,idb=r.steps[ib].id;
      if(p&&Array.isArray(p.s)){const a=p.s.indexOf(ida),b=p.s.indexOf(idb);if(a>=0&&b>=0){p.s[a]=idb;p.s[b]=ida;save('config')}}}}}
  catch(e){console.error(e)}
  return x}})(hMove123);
hMenu75=(function(prev){return function(j){const x=prev.apply(this,arguments);try{
  const box=$('hunt'),m=box&&box.querySelector('.m75 .stack'),mv=m&&m.querySelector('.mv123');
  if(!mv||m.querySelector('.sv124'))return x;
  const on=SV124();
  mv.insertAdjacentHTML('afterend',`<label class="row small sv124" style="gap:6px;margin:4px 0"><input type="checkbox" data-sv124 ${on?'checked':''}> 앞으로도 이 순서로 <span class="tiny muted">프리셋에 저장</span></label>`);
  const sp=mv.querySelector(':scope > span.tiny');if(sp)sp.textContent=on?'오늘+프리셋':'오늘만'
}catch(e){console.error(e)}return x}})(hMenu75);
addEventListener('change',e=>{const i=e.target;if(!i||!i.dataset||i.dataset.sv124===undefined)return;e.stopPropagation();
  try{localStorage.setItem('hq_sv124',i.checked?'1':'0')}catch(x){}
  const sp=document.querySelector('#hunt .m75 .mv123 > span.tiny');if(sp)sp.textContent=i.checked?'오늘+프리셋':'오늘만'},true);
