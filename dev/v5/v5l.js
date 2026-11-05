/* ================= v5.5: 1단계 마무리 — 행동/습관 편집 · 저장 방식 · 스마트 목록 ================= */
var APP_V='v5.5';
// 행동 카드 목록에 보일 칸 (켜고 끄기)
function aeShowAll(){return [['area','영역'],['xp','⭐ XP'],['gold','🪙 골드'],['cond','❤ 컨디션'],['rhythm','🔁 리듬'],['brave','⚔ 용기'],['opts','옵션 수'],['dur','⏱ 목표 시간'],['n30','30일 횟수']]}
function aeShow(){const s=C.ui&&C.ui.aeShow;return Array.isArray(s)?s:['area','xp','gold','cond','rhythm','brave','n30']}
// 습관 = 리듬(매일·요일·고정)이 있는 행동
function isHabit(a){return !!(a&&(a.daily||(a.wd||[]).length||a.pin))}
function rhythmOf(a){if(a.daily)return '☑ 매일';if((a.wd||[]).length)return '📅 '+[1,2,3,4,5,6,0].filter(w=>a.wd.includes(w)).map(w=>WDK[w]).join('');if(a.pin)return '📌 고정';return ''}
function metaChips(a,st,show){
  show=show||aeShow();const ar=C.areas.find(x=>x.id===a.area),good=a.type==='good',out=[];
  const c=(k,cls,txt,tip)=>{if(show.includes(k)&&txt)out.push(`<span class="mx ${cls}" title="${esc(tip||'')}">${txt}</span>`)};
  c('area','ar',ar?esc(ar.name):'','영역');
  if(a.link)out.push(`<span class="mx ln" title="연결 카드">🔗 ${esc(linkName(a.link))}</span>`);
  else{c('xp','xp',good&&a.xp?'⭐ '+a.xp:'','XP (성장)');
    c('gold','gd',a.gold?'🪙 '+(a.gold>0?'+':'−')+Math.abs(a.gold):'','골드 (돈·자원)');
    c('cond',a.cond<0?'cd neg':'cd',a.cond?'❤ '+(a.cond>0?'+':'−')+Math.abs(a.cond):'','컨디션 (몸과 마음)')}
  c('rhythm','rh',rhythmOf(a),'리듬');c('brave','bv',a.brave?'⚔ 용기':'','용기 표시');
  c('opts','op',a.opts&&a.opts.length?'옵션 '+a.opts.length:'','세부 옵션');c('dur','du',a.dur?'⏱ '+a.dur+'분':'','목표 시간');
  if(st)c('n30','n',`30일 ${st.n30||0}번`,'최근 30일에 한 횟수');
  return out.join('');
}

/* ---- 편집 → 행동/습관 목록 ---- */
function actionsEditHTML(){
  const E=ui.ae||(ui.ae={q:'',type:'all',area:'',sort:'manual'});
  const okType=a=>E.type==='all'?true:E.type==='good'||E.type==='bad'?a.type===E.type:E.type==='habit'?isHabit(a):E.type==='loose'?!isHabit(a):E.type==='brave'?!!a.brave:true;
  let list=C.actions.filter(a=>okType(a)&&(!E.area||a.area===E.area)&&(!E.q||a.name.toLowerCase().includes(E.q.toLowerCase())));
  const st=listStats();
  if(E.sort!=='manual')list=sortList(list,st,E.sort);
  const selOn=!!E.selOn,sel=new Set((E.sel||[]).filter(id=>C.actions.some(a=>a.id===id)));E.sel=[...sel];
  const drag=E.sort==='manual'&&!E.q&&!selOn;const show=aeShow();
  const nH=C.actions.filter(isHabit).length;
  const bulk=selOn?`<div class="bulk55"><b>${sel.size}개 골랐어요</b>
      <button class="btn ghost sm" data-x55="selall">${sel.size===list.length&&list.length?'모두 풀기':'보이는 것 모두'}</button>
      <span style="flex:1"></span>
      <select id="x55area" aria-label="영역 바꾸기" ${sel.size?'':'disabled'}><option value="">영역 바꾸기…</option>${C.areas.map(a=>`<option value="${a.id}">→ ${esc(a.name)}</option>`).join('')}</select>
      <button class="btn ghost sm" data-x55="daily1" ${sel.size?'':'disabled'}>☑ 매일 켜기</button><button class="btn ghost sm" data-x55="daily0" ${sel.size?'':'disabled'}>매일 끄기</button>
      <button class="btn ghost sm bad" data-x55="delsel" ${sel.size?'':'disabled'}>🗑 지우기</button>
      <button class="btn sm" data-x55="selmode">다 했어요</button></div>`:'';
  return `<p class="help" style="border-left:3px solid var(--accent);padding-left:8px">${SCORE_MEANING}</p>
    <p class="help"><b>행동 카드</b> 목록이에요. 점수는 여기에만 있어요. 그중 리듬(☑ 매일 · 요일 · 📌)이 있는 카드가 <b>🔁 습관</b>이에요 (지금 ${nH}개). 이름을 누르면 전체 편집, 오른쪽 ☑·🗑로 바로 바꾸거나 지워요. ${drag?'왼쪽 ⋮⋮를 끌어서 순서를 바꿔요.':selOn?'':'순서를 바꾸려면 정렬을 "기본 순서", 검색을 비워요.'}</p>
    <div class="toolbar"><input id="aeQ" type="search" placeholder="🔍 행동 찾기" value="${esc(E.q)}" style="max-width:200px;padding:5px 10px;border-radius:999px;font-size:13px" autocomplete="off">
      <span class="seg3">${[['all','모두'],['good','▲ 좋은'],['bad','▼ 나쁜'],['habit','🔁 습관'],['brave','⚔ 용기']].map(([v,l])=>`<button data-aetype="${v}" aria-pressed="${E.type===v}">${l}</button>`).join('')}</span>
      <select id="aeArea" aria-label="영역"><option value="">모든 영역</option>${C.areas.map(a=>`<option value="${a.id}" ${E.area===a.id?'selected':''}>${esc(a.name)}</option>`).join('')}</select>
      <select id="aeSort" aria-label="정렬">${SORTS.map(([v,l])=>`<option value="${v}" ${E.sort===v?'selected':''}>${l}</option>`).join('')}</select>
      <button class="chipbtn" data-x55="selmode" aria-pressed="${selOn}">☐ 여러 개 고르기</button>
      <details class="aeshow"><summary class="chipbtn">👁 보이는 칸</summary><div class="pop55">${aeShowAll().map(([k,l])=>`<label class="row tiny" style="gap:6px;flex-wrap:nowrap"><input type="checkbox" data-x55show="${k}" ${show.includes(k)?'checked':''} style="width:auto">${l}</label>`).join('')}</div></details>
      <span class="tiny muted">${list.length}개</span></div>
    ${bulk}
    <div class="elist" data-drop="reorder:actions">${list.map(a=>{const good=a.type==='good',on=sel.has(a.id);
      return `<div class="erow3 ${on?'on':''}" data-rowid="${a.id}">${selOn?`<input type="checkbox" data-x55sel="${a.id}" ${on?'checked':''} style="width:auto;margin:0 auto" aria-label="${esc(a.name)} 고르기">`:`<span class="hand" ${drag?`data-drag="row:${a.id}" data-dragmode="now"`:''} aria-label="끌어서 순서 바꾸기">${drag?'⋮⋮':''}</span>`}<span class="mk ${a.type}">${good?'▲':'▼'}</span>
        <button class="nm" ${selOn?`data-x55sel="${a.id}"`:`data-aedit="${a.id}"`}><b>${esc(a.name)}</b><span class="mcs">${metaChips(a,st[a.id]||{},show)}</span></button>
        <span class="qa">${selOn?'':`${good&&!(a.once)?`<button class="ib" data-x55daily="${a.id}" aria-pressed="${!!a.daily}" title="${a.daily?'매일(일퀘) 끄기':'매일(일퀘)로 켜기'}" aria-label="${esc(a.name)} 매일 켜고 끄기">☑</button>`:''}<button class="ib" data-x55del="${a.id}" title="지우기" aria-label="${esc(a.name)} 지우기">🗑</button><button class="btn ghost sm hidem" data-aedit="${a.id}">편집</button>`}</span></div>`}).join('')||'<div class="empty">없어요.</div>'}</div>
    <div class="row" style="margin-top:10px"><button class="btn sm" data-addrow="actions" data-type="good">＋ 좋은 행동</button><button class="btn sm ghost" data-addrow="actions" data-type="bad">＋ 나쁜 행동</button></div>
    <h3 style="margin-top:18px">누적 페널티</h3><p class="help">나쁜 행동이 쌓이거나 이어지면 더 많이 깎여요. 그래서 흐름을 끊는 게 이득이에요.</p>
    <div class="kv"><label>같은 행동 7일 안에 한 번마다 +<input id="r-pensame" data-rule="penalty.same" type="number" step="0.05" min="0" max="2" value="${C.penalty.same}"></label><label>나쁜 날이 이어진 하루마다 +<input id="r-penchain" data-rule="penalty.chain" type="number" step="0.05" min="0" max="2" value="${C.penalty.chain}"></label><label>최대 배수<input id="r-penmax" data-rule="penalty.max" type="number" step="0.5" min="1" max="6" value="${C.penalty.max}"></label><label>흐름 끊기 보상 XP (연쇄 하루당)<input id="r-chxp" data-rule="chain.xp" type="number" min="0" value="${C.chain.xp}"></label><label>흐름 끊기 보상 골드 (하루당)<input id="r-chg" data-rule="chain.gold" type="number" min="0" value="${C.chain.gold}"></label></div>`+presetsEditHTML()+scoreBakHTML();
}
// 지우기 (되돌리기 가능)
function delActs(ids){
  ids=new Set(ids);if(!ids.size)return;
  const snap={actions:clone(C.actions),watches:clone(C.watches),dailies:clone(C.dailies)};
  const names=C.actions.filter(a=>ids.has(a.id)).map(a=>a.name);
  C.actions=C.actions.filter(a=>!ids.has(a.id));
  const left=new Set([...C.actions.map(x=>x.id),...C.courage.map(x=>x.id)]);
  C.watches=C.watches.filter(w=>w.action==='@courage'||left.has(w.action));
  syncDailies(C);if(ui.ae&&ui.ae.sel)ui.ae.sel=ui.ae.sel.filter(id=>!ids.has(id));
  save('config');render();
  toastAct(names.length===1?`'${names[0]}' 지웠어요`:`${names.length}개 지웠어요`,'되돌리기',()=>{Object.assign(C,snap);syncDailies(C);save('config');render();toast('되돌렸어요')});
}
// 버튼이 달린 알림
function toastAct(m,label,fn,ms=5200){
  const t=$('toast');t.innerHTML='';const s=document.createElement('span');s.textContent=m+' ';t.appendChild(s);
  const b=document.createElement('button');b.className='tbtn55';b.textContent=label;b.onclick=e=>{e.stopPropagation();t.classList.remove('on');t.style.pointerEvents='';fn()};t.appendChild(b);
  t.style.pointerEvents='auto';t.classList.add('on');clearTimeout(toast._t);toast._t=setTimeout(()=>{t.classList.remove('on');t.style.pointerEvents=''},ms);
}

/* ---- 저장 방식: 할 일 상세 = 자동 저장, 행동 카드 편집 = '완료'를 눌러야 저장 ---- */
var AE55=null; // {id, snap(편집 전 카드), commit}
function tsFlush(){if(sheetCtx&&sheetCtx.task&&$('tsTitle')){const t=tsRead();if(t)saveTask(t)}}
function aeSettle(){
  if(!AE55)return;const A=AE55;AE55=null;if(A.commit)return;
  const i=C.actions.findIndex(x=>x.id===A.id);if(i<0)return;
  const cur=C.actions[i];if(JSON.stringify(cur)===JSON.stringify(A.snap))return;
  const edited=clone(cur);C.actions[i]=clone(A.snap);syncDailies(C);save('config');
  toastAct('바꾼 내용은 저장하지 않았어요 (완료를 눌러야 저장)','되살리기',()=>{const j=C.actions.findIndex(x=>x.id===A.id);if(j<0)return;C.actions[j]=edited;syncDailies(C);save('config');render();toast('되살렸어요')},6500);
}
{const _oae=openActionEditor;openActionEditor=function(id){
  tsFlush();
  if(!(AE55&&AE55.id===id)){if(AE55)AE55.commit=true;const a=C.actions.find(x=>x.id===id);AE55=a?{id,snap:clone(a),commit:false}:null}
  _oae(id)}}
{const _ots=openTaskSheet;openTaskSheet=function(id){tsFlush();if(AE55){AE55.commit=true;AE55=null}_ots(id)}}
{const _cs=closeSheet;closeSheet=function(){
  try{tsFlush()}catch(e){console.error(e)}
  const wasAE=sheetCtx&&sheetCtx.aedit;
  _cs();
  if(wasAE)aeSettle();else if(AE55){AE55.commit=true;AE55=null}
  if(curView()==='tasks'||curView()==='cal')render();
}}
// PC에서 오른쪽에 붙은 할 일 상세: 바깥을 누르면 저장하고 닫기
document.addEventListener('pointerdown',e=>{
  if(!document.body.classList.contains('docked')||e.button>0)return;
  if(e.target.closest('#tDetail,.trow,[data-task],[data-ctask],#toast,#pop,#sheet,#acBox,#levelup,#hunt,#huntPill,#searchBox,#search,dialog,.betabar,.ctxmenu,.menu'))return;
  closeSheet();
});

/* ---- 이벤트 ---- */
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-x55],[data-x55sel],[data-x55daily],[data-x55del],[data-aedone]');if(!b)return;const d=b.dataset;
  if(d.aedone){if(AE55)AE55.commit=true;closeSheet();toast('저장했어요');return}
  if(d.x55sel!=null&&b.tagName!=='INPUT'){e.preventDefault();const E=ui.ae;const s=new Set(E.sel||[]);s.has(d.x55sel)?s.delete(d.x55sel):s.add(d.x55sel);E.sel=[...s];reEdit();return}
  if(d.x55daily){const a=C.actions.find(x=>x.id===d.x55daily);if(!a)return;if(a.daily)delete a.daily;else a.daily=1;syncDailies(C);save('config');reEdit();toast(a.daily?`'${a.name}' 매일(일퀘)로 켰어요`:`'${a.name}' 매일에서 뺐어요`);return}
  if(d.x55del){delActs([d.x55del]);return}
  const k=d.x55,E=ui.ae||(ui.ae={q:'',type:'all',area:'',sort:'manual'});
  if(k==='selmode'){E.selOn=!E.selOn;if(!E.selOn)E.sel=[];reEdit();return}
  if(k==='selall'){const vis=[...document.querySelectorAll('.erow3[data-rowid]')].map(r=>r.dataset.rowid);E.sel=(E.sel||[]).length===vis.length?[]:vis;reEdit();return}
  if(k==='delsel'){const ids=E.sel||[];if(!ids.length)return;delActs(ids);E.sel=[];reEdit();return}
  if(k==='daily1'||k==='daily0'){let n=0;C.actions.forEach(a=>{if(!(E.sel||[]).includes(a.id))return;if(k==='daily1'){if(a.type==='good'&&!a.once&&!a.daily){a.daily=1;n++}}else if(a.daily){delete a.daily;n++}});syncDailies(C);save('config');reEdit();toast(k==='daily1'?`${n}개를 매일로 켰어요`:`${n}개를 매일에서 뺐어요`);return}
});
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.dataset.x55sel!=null&&t.tagName==='INPUT'){const E=ui.ae;const s=new Set(E.sel||[]);t.checked?s.add(t.dataset.x55sel):s.delete(t.dataset.x55sel);E.sel=[...s];reEdit();return}
  if(t.dataset.x55show){const k=t.dataset.x55show;let s=[...aeShow()];s=t.checked?[...new Set([...s,k])]:s.filter(x=>x!==k);C.ui.aeShow=aeShowAll().map(z=>z[0]).filter(x=>s.includes(x));save('config');
    const det=t.closest('details');reEdit();setTimeout(()=>{const d2=document.querySelector('.aeshow');if(d2&&det)d2.open=true},0);return}
  if(t.id==='x55area'&&t.value){const ids=(ui.ae.sel||[]);C.actions.forEach(a=>{if(ids.includes(a.id))a.area=t.value});save('config');const nm=(C.areas.find(x=>x.id===t.value)||{}).name;reEdit();toast(`${ids.length}개를 '${nm}' 영역으로 옮겼어요`);return}
});
// 보이는 칸 창: 바깥 누르면 닫기
document.addEventListener('pointerdown',e=>{const d=document.querySelector('.aeshow[open]');if(d&&!d.contains(e.target))d.open=false});

/* ---- 할 일: 습관 연결 카드 표시 ---- */
function taskCardNote(t){
  const a=t.aid&&C.actions.find(x=>x.id===t.aid);if(!a)return '';
  return `<div class="f" style="grid-column:1/-1"><span class="small muted">연결된 행동 카드 · 점수는 이 카드에서 나와요</span><div class="row" style="gap:6px;flex-wrap:wrap"><span class="mcs">${metaChips(a,null,aeShowAll().map(z=>z[0]))}</span><button class="btn ghost sm" data-aedit="${a.id}">✎ 카드 편집</button></div></div>`;
}
function todayTaskAids(){const td=dateKey();return new Set(openTasks().filter(t=>t.aid&&t.due&&t.due<=td).map(t=>t.aid))}
