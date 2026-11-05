/* ================= v5.6: 홈 좌우 배치 · 할 일 묶음 · 타이머 방식 · 상세 화면 간단히 ================= */

/* ---- 홈: 왼쪽·오른쪽 칸을 직접 정하기 (폰은 순서만) ---- */
function homeTwo(){const g=$('homeGrid');if(!g)return false;const w=g.clientWidth||(innerWidth>=960?innerWidth-260:innerWidth-32);return w>=760}
function homeCols(){
  const h=C.ui.home;if(h.some(x=>x[2]!=='L'&&x[2]!=='R')){const n=h.length;h.forEach((x,i)=>{if(x[2]!=='L'&&x[2]!=='R')x[2]=i<Math.ceil(n/2)?'L':'R'})}
}
function applyHome(){
  const g=$('homeGrid');if(!g)return;homeCols();
  const two=homeTwo();g.classList.toggle('two',two);
  let L=$('hcolL'),R=$('hcolR');
  if(!L){L=document.createElement('div');L.id='hcolL';L.className='hcol';L.dataset.grp='L';R=document.createElement('div');R.id='hcolR';R.className='hcol';R.dataset.grp='R'}
  if(two){g.appendChild(L);g.appendChild(R)}
  C.ui.home.forEach(([id,on,col])=>{const el=g.querySelector(`[data-hid="${id}"]`);if(!el)return;el.hidden=!on;el.classList.toggle('collapsed',!!C.ui.collapsed[id]);(two?(col==='R'?R:L):g).appendChild(el)});
  if(!two){L.remove();R.remove()}
}
function applyHomeEdit(){
  const two=homeTwo();
  document.querySelectorAll('#homeGrid .hblock').forEach(el=>{const id=el.dataset.hid;el.dataset.rowid=id;
    let h=el.querySelector(':scope>.hedit');if(ui.homeEdit){if(!h){h=document.createElement('div');h.className='hedit';el.prepend(h)}
      const it=C.ui.home.find(x=>x[0]===id)||[0,1,'L'];const on=it[1];
      h.innerHTML=`<span class="hand" data-drag="row:${id}" data-dragmode="now" aria-label="끌어서 옮기기">⋮⋮</span><b>${esc(HOME_BLOCKS[id]||id)}</b>${two?`<button class="x" data-x56hcol="${id}" title="${it[2]==='R'?'왼쪽 칸으로':'오른쪽 칸으로'}" aria-label="다른 칸으로">${it[2]==='R'?'⇠':'⇢'}</button>`:''}<button class="x" data-hvis="${id}" aria-label="보이기·숨기기">${on?'👁':'🚫'}</button>`;el.hidden=false;el.classList.toggle('hoff',!on)}
    else{if(h)h.remove();el.classList.remove('hoff')}});
  const g=$('homeGrid');
  ['hcolL','hcolR'].forEach(k=>{const c=$(k);if(c)c.dataset.drop=ui.homeEdit&&two?'reorder:home':''});
  g.dataset.drop=ui.homeEdit&&!two?'reorder:home':'';
  const hb=$('homeEditBtn');if(hb)hb.textContent=ui.homeEdit?'✓ 배치 끝':'✎ 홈 배치';
}
// 끌어서 놓은 칸(왼쪽/오른쪽)으로 옮기기
function homeDrop(id,drop){
  if(drop.grp!=='L'&&drop.grp!=='R')return false;
  const arr=C.ui.home,it=arr.find(h=>h[0]===id);if(!it)return true;it[2]=drop.grp;
  const rest=arr.filter(h=>h!==it);let i;
  if(drop.before)i=rest.findIndex(h=>h[0]===drop.before);
  else{i=-1;rest.forEach((h,k)=>{if(h[2]===drop.grp)i=k});i=i<0?rest.length:i+1}
  if(i<0)i=rest.length;rest.splice(i,0,it);C.ui.home=rest;save('config');render();return true;
}
{let lastTwo=null;addEventListener('resize',()=>{const t=homeTwo();if(t!==lastTwo){lastTwo=t;if(curView()==='home'){applyHome();if(ui.homeEdit)applyHomeEdit()}}})}

/* ---- 할 일 묶음: 각자 따로인 할 일을 한 묶음으로 (하나만 해도 보상) ---- */
function kidsOf(id){return Object.values(TASKS).filter(k=>k.parent===id&&k.status!==-1)}
function nestRows(arr,opt,whole){
  const inList=new Set((whole||arr).map(t=>t.id));
  return arr.filter(t=>!(t.parent&&inList.has(t.parent)&&TASKS[t.parent]&&TASKS[t.parent].status===0)).map(t=>{
    const kids=kidsOf(t.id).filter(k=>k.status===0);let h=taskRow(t,opt);
    if(!kids.length||t.status!==0)return h;
    const shut=(C.ui.tfold||{})[t.id];
    return h+(shut?'':`<div class="tkids">${kids.sort(taskSorter('due')).map(k=>taskRow(k,{...opt,nested:1})).join('')}</div>`);
  }).join('');
}
{const _tr=taskRow;taskRow=function(t,o={}){
  let h=_tr(t,o);
  const ks=kidsOf(t.id);
  if(ks.length&&t.status===0){const open=ks.filter(k=>k.status===0).length,done=ks.filter(k=>k.status===2).length,shut=(C.ui.tfold||{})[t.id];
    h=h.replace('<span class="tt">',`<span class="tt"><button class="tfold" data-x56fold="${t.id}" aria-label="묶음 ${shut?'펴기':'접기'}" title="묶음 ${shut?'펴기':'접기'}">${shut?'▸':'▾'}</button>📦 `)
       .replace(/(<span class="tm">)/,`$1<span class="kcount" title="묶인 할 일">📦 ${done}/${open+done}</span>`);
    if(!/class="tm"/.test(h))h=h.replace(/(<span class="tt">[\s\S]*?<\/span>)(<\/span>)/,`$1<span class="tm"><span class="kcount">📦 ${done}/${open+done}</span></span>$2`);
    h=h.replace('class="trow ','class="trow tparent ')}
  if(t.parent&&!o.nested&&TASKS[t.parent]){const p=TASKS[t.parent];h=h.replace(/(<span class="tm">)/,`$1<span class="kpar" title="묶음">📦 ${esc(p.title)}</span>`);if(!/class="tm"/.test(h))h=h.replace(/(<span class="tt">[\s\S]*?<\/span>)(<\/span>)/,`$1<span class="tm"><span class="kpar">📦 ${esc(p.title)}</span></span>$2`)}
  if(o.nested)h=h.replace('class="trow ','class="trow tkid ');
  return h}}
{const _dt=deleteTask;deleteTask=function(id){Object.values(TASKS).filter(k=>k.parent===id).forEach(k=>{delete k.parent;saveTask(k)});_dt(id)}}
function nestUnder(head,ids){
  ids.forEach(id=>{const k=TASKS[id];if(!k||k.id===head.id)return;
    kidsOf(k.id).forEach(g=>{g.parent=head.id;saveTask(g)});k.parent=head.id;saveTask(k)});
  delete head.parent;saveTask(head);C.ui.tfold=C.ui.tfold||{};delete C.ui.tfold[head.id];save('config');
}
// 여러 개 고르기 막대에 '📦 묶기'
{const _dm=drawMsel;drawMsel=function(){_dm();const bar=$('mselBar');if(!bar||!ui.msel||ui.msel.size<2||bar.querySelector('[data-x56group]'))return;
  const b=document.createElement('button');b.className='btn ghost sm';b.dataset.x56group='1';b.textContent='📦 묶기';const ref=bar.querySelector('[data-mb="done"]');ref?bar.insertBefore(b,ref):bar.appendChild(b)}}
function openGroupSheet(){
  const ids=mselIds().filter(id=>TASKS[id]&&TASKS[id].status===0);if(ids.length<2){toast('두 개 넘게 골라요');return}
  sheetCtx={grp:ids};
  openSheet(`<div class="sh"><h3>📦 묶기 · ${ids.length}개</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <p class="small muted" style="margin:0">묶어도 각자 따로인 할 일이에요. 하나만 끝내도 그 할 일 점수를 받아요. 목록에서 접고 펼 수 있어요.</p>
    <div class="small"><b>어느 할 일을 묶음 머리로?</b></div>
    <div class="col56">${ids.map(id=>`<button class="btn ghost" data-x56head="${id}" style="justify-content:flex-start">📦 ${esc(TASKS[id].title)}</button>`).join('')}</div>
    <form class="row" data-x56newhead="1" style="gap:6px"><input id="x56HeadName" placeholder="또는 새 묶음 이름 (예: 집 청소)" enterkeyhint="done"><button class="btn">새 묶음</button></form>`);
}

/* ---- 할 일 상세: 칩 한 줄 + 펼치는 칸 (간단하게) ---- */
function tsChipsHTML(t){
  const P=ui.tsPanel||'',ar=C.areas.find(x=>x.id===areaOfTask(t)),card=t.aid&&C.actions.find(x=>x.id===t.aid);
  const pr=PRIOS.find(x=>x[0]===(t.prio||0))||PRIOS[0],ef=EFFORTS.find(x=>x[0]===effortOf(t))||EFFORTS[1];
  const ch=(k,txt,on,tip)=>`<button class="tch ${on?'':'off'}" data-x56panel="${k}" aria-pressed="${P===k}" title="${esc(tip)}">${txt}</button>`;
  return `<div class="tchips">
    ${ch('when',`📅 ${t.due?esc(dueLabel(t.due)):'날짜'}${t.time?' '+esc(ampm(t.time)):''}${t.rep?' · 🔁 '+esc(repLabel(t.rep)):''}${t.deadline?' · ⏳ '+esc(dueLabel(t.deadline)):''}`,t.due||t.rep||t.deadline,'날짜 · 시간 · 반복 · 마감 · 점검일')}
    ${ch('card',`🃏 ${card?esc(card.name):'행동 카드'}`,card,'행동 카드 연결 (점수가 카드에서 나와요)')}
    ${ch('tags',(t.tags||[]).length?t.tags.map(x=>'#'+esc(x)).join(' '):'# 태그',(t.tags||[]).length,'태그')}
    ${ch('area',`🧭 ${ar?esc(ar.name):'영역'}${t.area?'':' <small>(자동)</small>'}`,ar,'컨디션 영역 · 구슬')}
    ${ch('list',`📂 ${esc(listName(t.list||'inbox'))}`,t.list&&t.list!=='inbox','목록')}
    ${ch('prio',`⚑ ${pr[2]||'중요도'}`,t.prio,'중요도')}
    ${ch('size',`${esc(ef[1])}${t.brave?' · ⚡ 용기':''}`,true,'크기(보상) · 용기')}
    ${ch('timer',`⏱ ${t.dur?durTxt(t.dur):'타이머'} · ${t.tmode==='speed'?'빠를수록':'시간 안에'}`,t.dur,'타이머 목표·방식')}
    ${ch('more','⋯',t.reframe,'하기 싫을 때 문구 · 칸 · 기록')}
  </div><div class="tpanels"></div>`;
}
function tsRestyle(){
  const sc=$('sheetC'),t=TASKS[sheetCtx&&sheetCtx.task];if(!t||!$('tsTitle'))return;
  const q=s=>sc.querySelector(s),lab=id=>{const e=$(id);return e?e.closest('label'):null},up=(e,s)=>e?e.closest(s):null;
  sc.classList.add('ts56');
  // 반복·중요도 줄 쪼개기
  const prRow=up(q('.flags'),'.row');let repWrap=null,prWrap=null;
  if(prRow){prWrap=document.createElement('div');prWrap.className='row';prWrap.style.gap='8px';prWrap.innerHTML='<span class="small muted">중요도</span>';prWrap.appendChild(q('.flags'));
    repWrap=document.createElement('div');repWrap.className='row';repWrap.style.gap='8px';repWrap.innerHTML='<span class="small muted">🔁 반복</span>';repWrap.appendChild($('tsRepSel'));prRow.remove()}
  const sizeBox=up(q('[data-tseff]'),'.seg');const sizeWrap=sizeBox?sizeBox.parentElement:null;
  const aidL=lab('tsAid'),cardNote=aidL&&aidL.nextElementSibling&&aidL.nextElementSibling.querySelector('.mcs')?aidL.nextElementSibling:null;
  const moreDet=up($('tsTags'),'details'),moreTail=moreDet?[...moreDet.children].filter(c=>c.tagName==='P'):[];
  const rfDet=up($('tsReframe'),'details'),explain=q('.sh + p.tiny');
  const timerWrap=document.createElement('div');timerWrap.className='row';timerWrap.style.gap='8px';
  timerWrap.innerHTML=`<label class="row small" style="gap:6px">목표<input id="x56Dur" type="number" min="1" max="600" step="5" value="${t.dur||''}" placeholder="${({quick:10,mid:25,heavy:50})[effortOf(t)]||25}" style="width:80px">분</label><span class="seg">${[['','⏱ 시간 안에','목표 시간 안에 끝내면 보너스'],['speed','⚡ 빠를수록','빨리 끝낼수록 보너스가 커요']].map(([k,l,d])=>`<button data-x56tmode="${k}" aria-pressed="${(t.tmode||'')===k}" title="${d}">${l}</button>`).join('')}</span><span class="tiny muted">시작할 때 그때그때 바꿀 수도 있어요</span>`;
  const tagWrap=document.createElement('div');const all={};Object.values(TASKS).forEach(x=>(x.tags||[]).forEach(g=>all[g]=(all[g]||0)+1));
  tagWrap.innerHTML=`<div class="row" style="gap:4px;flex-wrap:wrap">${Object.entries(all).sort((a,b)=>b[1]-a[1]).slice(0,24).map(([g])=>`<button class="chipbtn" data-x56tag="${esc(g)}" aria-pressed="${(t.tags||[]).includes(g)}">#${esc(g)}</button>`).join('')||'<span class="tiny muted">아직 태그가 없어요</span>'}</div>`;
  const panels={
    when:[lab('tsDue'),lab('tsDl'),up($('tsTime'),'.f'),up(q('[data-tsdue]'),'.row'),repWrap,q('.repbox'),q('.cks')],
    card:[aidL,cardNote],tags:[lab('tsTags'),tagWrap],area:[lab('tsArea'),lab('tsMarble')],list:[lab('tsList')],prio:[prWrap],
    size:[sizeWrap,explain],timer:[timerWrap],more:[rfDet,lab('tsSec'),...moreTail]};
  const box=document.createElement('div');box.innerHTML=tsChipsHTML(t);const chips=box.firstElementChild,pan=box.lastElementChild;
  $('tsTitle').after(chips);chips.after(pan);
  const P=ui.tsPanel||'';
  for(const k in panels){const d=document.createElement('div');d.className='tpanel';d.dataset.p=k;d.hidden=P!==k;panels[k].filter(Boolean).forEach(e=>d.appendChild(e));pan.appendChild(d)}
  if(rfDet)rfDet.open=true;
  if(moreDet)moreDet.remove();
  const f2=q('.f2');if(f2&&!f2.children.length)f2.remove();
  // 메모는 칩 아래로
  const note=$('tsNote');if(note){note.rows=Math.min(6,Math.max(1,(t.note||'').split('\n').length));pan.after(note)}
  // 묶음 · 체크리스트
  const subsBox=up(q('.subs'),'div:not(.subs)');
  if(subsBox){const hd=subsBox.firstElementChild;if(hd&&/하위 할 일/.test(hd.textContent))hd.textContent=hd.textContent.replace('하위 할 일','☑ 체크리스트 (점수 없음)');
    subsBox.querySelectorAll('.sr input[data-tssubt]').forEach(inp=>{const i=inp.dataset.tssubt;const b=document.createElement('button');b.className='x';b.dataset.x56promote=i;b.title='묶인 할 일로 (점수 따로)';b.textContent='↗';inp.after(b)});
    subsBox.insertAdjacentHTML('beforebegin',kidsBoxHTML(t))}
  // 끝 버튼 이름
  const db=q('[data-tsdone2]');if(db)db.textContent='닫기';
}
function kidsBoxHTML(t){
  if(t.parent&&TASKS[t.parent]){const p=TASKS[t.parent];
    return `<div class="kids56"><span class="small muted">📦 묶음</span> <button class="chipbtn" data-x56open="${p.id}">${esc(p.title)}</button> <button class="btn ghost sm" data-x56unnest="${t.id}">묶음에서 빼기</button></div>`}
  const ks=kidsOf(t.id).sort((a,b)=>(a.status-b.status)||taskSorter('due')(a,b));
  const cand=openTasks().filter(x=>x.id!==t.id&&x.parent!==t.id&&!kidsOf(x.id).length).sort((a,b)=>a.title.localeCompare(b.title)).slice(0,200);
  return `<div class="kids56"><div class="small muted">📦 묶인 할 일 ${ks.length?`${ks.filter(k=>k.status===2).length}/${ks.length}`:''} <span class="tiny">— 각자 따로인 할 일 · 하나만 해도 보상</span></div>
    ${ks.map(k=>`<div class="krow ${k.status===2?'on':''}"><button class="tchk" data-tdone="${k.id}" aria-label="${esc(k.title)} 완료">${k.status===2?'✓':''}</button><button class="kt" data-x56open="${k.id}">${esc(k.title)}${k.due?` <span class="tiny muted">${esc(dueLabel(k.due))}</span>`:''}</button><span class="tiny muted">+${taskBase(k).xp}</span><button class="x" data-x56unnest="${k.id}" title="묶음에서 빼기" aria-label="묶음에서 빼기">×</button></div>`).join('')}
    <form class="krow" data-x56kadd="1"><span class="muted" style="text-align:center">＋</span><input id="x56KNew" placeholder="묶음에 할 일 추가 (예: 욕실 청소 #청소)" enterkeyhint="done" autocomplete="off"><span></span><span></span></form>
    ${cand.length?`<select id="x56KPick" aria-label="있는 할 일 넣기"><option value="">있는 할 일을 묶음에 넣기…</option>${cand.map(x=>`<option value="${x.id}">${esc(x.title)}${x.due?' · '+esc(dueLabel(x.due)):''}</option>`).join('')}</select>`:''}</div>`;
}
{const _os=openSheet;openSheet=function(h,c){$('sheetC').classList.remove('ts56');_os(h,c)}}
{const _dts=drawTaskSheet;drawTaskSheet=function(){_dts();try{tsRestyle()}catch(e){console.error(e)}}}
function tsRedraw(){const y=$('sheetC').scrollTop;drawTaskSheet();$('sheetC').scrollTop=y}

/* ---- 타이머: 시간 안에 / 빠를수록 · 목표는 그때그때 ---- */
function speedOf(elapsed,targetMin,baseXP,mode){const tgt=Math.max(1,targetMin)*60,r=elapsed/tgt;
  if(mode!=='speed')return r<=1?{tier:'시간 안에 처치',bonus:Math.max(1,Math.round(baseXP*.25)),r}:{tier:'처치',bonus:0,r};
  if(r<=.5)return{tier:'번개 처치',bonus:Math.max(2,Math.round(baseXP*.6)),r};if(r<=.8)return{tier:'빠른 처치',bonus:Math.max(1,Math.round(baseXP*.35)),r};if(r<=1)return{tier:'제시간 처치',bonus:Math.max(1,Math.round(baseXP*.15)),r};return{tier:'처치',bonus:0,r}}
var HUNT_LOCK=120; // 시작하고 2분 안에만 목표·방식 바꾸기
{const _sr=startRun;startRun=function(o){_sr(o);if(RUN&&!RUN.mode){const t=o.task,a=o.act||(t&&t.aid&&C.actions.find(x=>x.id===t.aid));RUN.mode=(t&&t.tmode)||(a&&a.tmode)||'within';runSave();drawHunt(true)}}}
{const _dh=drawHunt;drawHunt=function(full){_dh(full);if(!RUN||RUN.kind==='routine')return;
  const el=runElapsed(),locked=el>HUNT_LOCK;let box=$('huntSet');
  if(full||!box){if(box)box.remove();box=document.createElement('div');box.id='huntSet';box.className='huntset';const ctl=$('hunt').querySelector('.ctl');ctl?ctl.before(box):$('hunt').appendChild(box)}
  const key=RUN.target+'|'+RUN.mode+'|'+locked;if(box.dataset.k===key)return;box.dataset.k=key;
  box.innerHTML=locked?`<span class="tiny">목표 ${RUN.target}분 · ${RUN.mode==='speed'?'⚡ 빠를수록 보너스':'⏱ 시간 안에 끝내면 보너스'}</span>`
    :`<span class="row" style="gap:4px"><button class="btn ghost sm" data-x56tgt="-5">−5</button><b>${RUN.target}분</b><button class="btn ghost sm" data-x56tgt="5">+5</button></span>
      <span class="seg"><button data-x56rmode="within" aria-pressed="${RUN.mode!=='speed'}">⏱ 시간 안에</button><button data-x56rmode="speed" aria-pressed="${RUN.mode==='speed'}">⚡ 빠를수록</button></span>
      <span class="tiny">시작 2분 안에만 바꿀 수 있어요 · ${mmss(HUNT_LOCK-el)} 남음</span>`}}

/* ---- 이벤트 ---- */
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-x56fold],[data-x56open],[data-x56hcol],[data-x56panel],[data-x56tag],[data-x56tmode],[data-x56unnest],[data-x56promote],[data-x56group],[data-x56head],[data-x56tgt],[data-x56rmode]');if(!b)return;const d=b.dataset;
  e.preventDefault();e.stopPropagation();
  if(d.x56fold){C.ui.tfold=C.ui.tfold||{};if(C.ui.tfold[d.x56fold])delete C.ui.tfold[d.x56fold];else C.ui.tfold[d.x56fold]=1;save('config');render();return}
  if(d.x56open){tsFlush();openTaskSheet(d.x56open);return}
  if(d.x56hcol){const it=C.ui.home.find(x=>x[0]===d.x56hcol);if(!it)return;homeDrop(it[0],{grp:it[2]==='R'?'L':'R',before:null});applyHome();applyHomeEdit();return}
  if(d.x56panel!=null){ui.tsPanel=ui.tsPanel===d.x56panel?'':d.x56panel;
    document.querySelectorAll('#sheetC .tpanel').forEach(p=>p.hidden=p.dataset.p!==ui.tsPanel);document.querySelectorAll('#sheetC .tch').forEach(c=>c.setAttribute('aria-pressed',String(c.dataset.x56panel===ui.tsPanel)));return}
  if(d.x56tag){const t=tsRead();if(!t)return;const g=d.x56tag;t.tags=(t.tags||[]).includes(g)?t.tags.filter(x=>x!==g):[...(t.tags||[]),g];tsCommit(true,false);return}
  if(d.x56tmode!=null){const t=tsRead();if(!t)return;if(d.x56tmode)t.tmode=d.x56tmode;else delete t.tmode;tsCommit(true,false);return}
  if(d.x56unnest){tsFlush();const k=TASKS[d.x56unnest];if(k){delete k.parent;saveTask(k)}render();if(sheetCtx&&sheetCtx.task)tsRedraw();toast('묶음에서 뺐어요');return}
  if(d.x56promote!=null){const t=tsRead();if(!t)return;const s=(t.subs||[])[+d.x56promote];if(!s)return;t.subs.splice(+d.x56promote,1);
    const k=newTask({title:s.t,list:t.list,tags:[...(t.tags||[])]});k.parent=t.id;if(s.done){k.status=2;k.doneAt=dateKey()}saveTask(k);tsCommit(true,false);toast(`'${s.t}'를 묶인 할 일로 바꿨어요`);return}
  if(d.x56group){openGroupSheet();return}
  if(d.x56head){const ids=(sheetCtx||{}).grp||[];const h=TASKS[d.x56head];if(!h)return;nestUnder(h,ids);closeSheet();mselClear();render();toast(`'${h.title}' 묶음으로 ${ids.length-1}개를 묶었어요`);return}
  if(d.x56tgt){if(!RUN||runElapsed()>HUNT_LOCK)return;RUN.target=clamp((+RUN.target||25)+(+d.x56tgt),1,600);runSave();drawHunt(false);return}
  if(d.x56rmode){if(!RUN||runElapsed()>HUNT_LOCK)return;RUN.mode=d.x56rmode;runSave();drawHunt(false);return}
},true);
document.addEventListener('submit',e=>{
  const f=e.target;
  if(f.dataset.x56kadd){e.preventDefault();e.stopPropagation();const v=$('x56KNew').value.trim();if(!v)return;const t=tsRead();if(!t)return;
    const p=parseQuick(v);if(!p.list)p.list=t.list||'inbox';if(!(p.tags||[]).length)p.tags=[...(t.tags||[])];
    const a=C.actions.find(x=>x.name===p.title&&x.type==='good');if(a)p.aid=a.id;
    const k=newTask(p);k.parent=t.id;saveTask(k);saveTask(t);tsRedraw();render();setTimeout(()=>$('x56KNew')&&$('x56KNew').focus(),30);toast(`'${k.title}'를 묶음에 넣었어요`);return}
  if(f.dataset.x56newhead){e.preventDefault();e.stopPropagation();const v=$('x56HeadName').value.trim();if(!v){$('x56HeadName').focus();return}
    const ids=(sheetCtx||{}).grp||[];const first=TASKS[ids[0]]||{};const h=newTask({title:v,list:first.list||'inbox',due:first.due||null});saveTask(h);nestUnder(h,ids);closeSheet();mselClear();render();toast(`'${v}' 묶음을 만들었어요`);return}
},true);
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.id==='x56KNew'||t.id==='x56HeadName'){e.stopPropagation();return}
  if(t.id==='x56KPick'&&t.value){e.stopPropagation();const p=tsRead();if(!p)return;const k=TASKS[t.value];if(!k)return;k.parent=p.id;saveTask(k);saveTask(p);tsRedraw();render();toast(`'${k.title}'를 묶음에 넣었어요`);return}
  if(t.id==='x56Dur'){e.stopPropagation();const k=tsRead();if(!k)return;const v=parseInt(t.value);k.dur=v>0?v:null;saveTask(k);tsRedraw();render();return}
},true);
// 묶인 할 일을 상세 안에서 끝내면 상세도 새로
document.addEventListener('click',e=>{const b=e.target.closest('#sheetC .kids56 [data-tdone]');if(b)setTimeout(()=>{if(sheetCtx&&sheetCtx.task&&$('tsTitle'))tsRedraw()},80)});
