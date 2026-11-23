/* ---- v11.9 (w117.js): 루틴 상황 프리셋 n개 — 프리셋마다 단계 구성·순서가 다름, 날짜별로 미리 골라 두기 (사용자 11/23: 한 루틴을 상황별 프리셋 n개로 나누고 편집·추가·수정, 목록의 날짜별 루틴 줄에서 고르면 그대로 수행. 시작 전에 묻지는 말 것) ----
   · 데이터(루틴 r): `r.ps117=[{id,ic,n,s:[단계 id 순서대로]}]`(프리셋 — 단계 풀은 그대로 r.steps, 프리셋은 그 중 무엇을 어떤 순서로 하는지)
     `r.pd117={날짜:프리셋 id}`(그날 고른 프리셋 · 오래된 날짜는 저절로 지움) · `r.pf117`=아무것도 안 골랐을 때 쓰는 기본 프리셋 id(없으면 첫째) · `r.sk117`=이미 아는 단계 id(새 단계는 모든 프리셋 맨 뒤에 붙음).
     처음 읽을 때(`ensure117`) 옛 v11.6~11.8 설정(`r.pre114` 꺼 둔 단계, `r.pk114` 오늘 고른 것)을 프리셋으로 옮김: 🌿 일반(전부) + 쉬는 단계를 정해 둔 🚗 출근·🎬 외근만.
   · 읽기는 `pset117(r,날짜)`(그날 프리셋)·`effSteps117(r,날짜)`(그날 할 단계, 프리셋 순서대로)만 — **'오늘 할 단계'를 세는 새 코드는 r.steps 말고 effSteps117을 거칠 것.**
     날짜 = 점수 날짜 `gk76()`(실행·체크는 항상 오늘) · 목록 줄은 `dateOf117(할 일)`(마감이 앞날이면 그 날, 아니면 오늘).
   · 옛 함수 재선언(마지막 선언이 이김): `pk114`·`pOff114`·`offTid114`·`hasPre114`·`pChips114`·`blk114`(루틴 카드 맨 위 줄 + 편집 접힘)·`needSit116`(=false, 시작 전에 안 물음)·`kidSort62`·`rtMin83`·`view83`.
     `rtSum62`는 감쌈(목록 줄은 CTX117 날짜 기준). 시작 `startRun`(v5s)·체크 창·완주 판단(`rtNeed71`, w71)은 effSteps117을 씀.
   · 목록 루틴 줄: `⏱ n단계 · m분` 글자(.kcount)가 단추(`.pc117`)가 됨 — 줄은 안 늘어남. 누르면 그 날짜의 프리셋 고르기 창(`pickSheet117`), 한 번 누르면 고르고 닫힘. 프리셋이 둘 이상이면 `⏱ 🚗 출근 · 2단계 · 12분`.
   · 새 입구는 `data-pk117="루틴|날짜|프리셋"`만 쓰면 됨(클릭 처리 한 곳). */
var O117={};
var T117=null,CTX117=null;
function sched117(){if(T117)return;T117=setTimeout(()=>{T117=null;try{if(ready)save('config')}catch(e){console.error(e)}},60)}
function ensure117(r){
  if(!r)return [];let dirty=0;const st=r.steps||[];
  st.forEach(s=>{if(!s.id){s.id=uid();dirty=1}});
  if(!Array.isArray(r.ps117)||!r.ps117.length){
    const ids=st.map(s=>s.id),pre=r.pre114||{};
    r.ps117=[{id:'n',ic:'🌿',n:'일반',s:ids.slice()}];
    [['w','🚗','출근'],['o','🎬','외근']].forEach(([k,ic,n])=>{const off=pre[k]||[];if(off.length)r.ps117.push({id:k,ic,n,s:ids.filter(x=>off.indexOf(x)<0)})});
    r.pd117=r.pd117||{};const k=r.pk114;if(k&&k.d&&r.ps117.some(p=>p.id===k.p)&&k.p!=='n')r.pd117[k.d]=k.p;
    r.sk117=ids.slice();dirty=1}
  const known=new Set(r.sk117||[]);let add=0;
  st.forEach(s=>{if(!known.has(s.id)){known.add(s.id);r.ps117.forEach(p=>{if(p.s.indexOf(s.id)<0&&!p.z119)p.s.push(s.id)});add=1}});
  if(add){r.sk117=[...known];dirty=1}
  if(dirty)sched117();
  return r.ps117}
function schedP117(d,L){const q=typeof sit118==='function'?sit118(d):null;if(!q||!q.name)return null;const k=String(q.name).trim().toLowerCase();return L.find(p=>String(p.n).trim().toLowerCase()===k)||null}
function pset117(r,d){const L=ensure117(r);if(!L.length)return null;d=d||gk76();const id=(r.pd117||{})[d];return L.find(p=>p.id===id)||schedP117(d,L)||L.find(p=>p.id===r.pf117)||L[0]}
function pmin118(p,s){const m=p&&p.m&&p.m[s.id];return m!=null&&m!==''?(+m||0):(+s.min||0)}
function effSteps117(r,d){if(!r)return [];const p=pset117(r,d);const st=r.steps||[];if(!p)return st.slice();
  const by={};st.forEach(s=>{by[s.id]=s});return p.s.map(i=>{const s=by[i];if(!s)return null;const m=p.m&&p.m[i];return m!=null&&m!==''&&(+m||0)!==(+s.min||0)?Object.assign({},s,{min:+m||0}):s}).filter(Boolean)}
function dateOf117(t){const d=t&&t.due;return d&&d>midKey68()?d:gk76()}
function sumMin117(L){return L.reduce((a,s)=>a+(+s.min||0),0)}
// ---- 옛 상황 함수를 프리셋으로 다시 선언 ----
function pk114(r){const p=pset117(r);return p?p.id:'n'}
function pOff114(r,s){if(!r||!s||!s.id)return false;const p=pset117(r);return !!(p&&p.s.indexOf(s.id)<0)}
function offTid114(tid){if(!tid)return false;const rs=C.routines||[];for(let i=0;i<rs.length;i++){const r=rs[i],ss=r.steps||[];for(let j=0;j<ss.length;j++)if(ss[j].tid===tid)return (ensure117(r).length>1||(pset117(r)||{s:[]}).s.length<ss.length)&&pOff114(r,ss[j])}return false}
function hasPre114(r){return ensure117(r).length>1}
function needSit116(){return false}
function preN117(p){return p?`${p.ic||'🧩'} ${p.n}`:''}
function chip117(r,d,p,on){return `<button type="button" class="chipbtn pr114 pr117" data-pk117="${r.id}|${d}|${p.id}" aria-pressed="${on}">${esc(preN117(p))}${on?' ✓':''}</button>`}
function pChips114(r){const d=gk76(),on=pset117(r,d);return ensure117(r).map(p=>chip117(r,d,p,p===on)).join('')}
function kidSort62(h){const r=rtOfT62(h);if(!r)return taskSorter('due');const ix={},d=dateOf117(h);effSteps117(r,d).forEach((s,i)=>ix[s.tid]=i);(r.steps||[]).forEach((s,i)=>{if(ix[s.tid]==null)ix[s.tid]=1000+i});return (a,b)=>(ix[a.id]??999)-(ix[b.id]??999)}
function rtMin83(r,k){if(!r||!r.steps)return 0;const g={};let n=0;
  effSteps117(r,k||gk76()).forEach(s=>{const m=+s.min||0;if(s.g71)g[s.g71]=Math.max(g[s.g71]||0,m);else n+=m});
  return n+Object.values(g).reduce((a,b)=>a+b,0)}
function view83(t,k){if(!t||!t.rid)return t;const r=(C.routines||[]).find(x=>x.id===t.rid),tot=rtMin83(r,k),x=t.tx83&&t.tx83.d===k&&t.due===k?t.tx83.m:null;
  if(!tot&&!x)return t;if(t.dur===tot&&!x)return t;const c=Object.assign({},t);if(tot)c.dur=tot;if(x)c.time=x;return c}
rtSum62=(function(prev){return function(r){const d=CTX117||gk76();return prev.call(this,r&&r.steps?{...r,steps:effSteps117(r,d)}:r)}})(rtSum62);
// ---- 목록 줄: ⏱ n단계 · m분 글자가 프리셋 단추 ----
taskRow=(function(prev){return function(t,o){
  const r=t&&t.status===0&&C.mig62&&typeof rtOfT62==='function'?rtOfT62(t):null;const d=r?dateOf117(t):null;
  CTX117=d;let h;try{h=prev.apply(this,arguments)}finally{CTX117=null}
  try{if(r&&typeof h==='string'){const p=pset117(r,d),L=effSteps117(r,d).filter(s=>TASKS[s.tid]),many=ensure117(r).length>1;
    h=h.replace(/(<span class="kcount" title="묶인 할 일">)⏱ \d+단계 · \d+분/,(m,a)=>`${a}<button type="button" class="pc117" data-pc117="${r.id}|${d}" title="이 날 어떤 상황으로 할지 고르기">⏱ ${many?esc(preN117(p))+' · ':''}${p&&!p.s.length?'쉬는 날 · 건너뜀':`${L.length}단계 · ${sumMin117(L)}분`} ▾</button>`)}}catch(e){console.error(e)}
  return h}})(taskRow);
// ---- 날짜별로 고르기 창 ----
function lbl117(d){return d===gk76()?'오늘':(typeof dueLabel==='function'?dueLabel(d):d)}
function pickSheet117(rid,d){const r=(C.routines||[]).find(x=>x.id===rid);if(!r)return;const L=ensure117(r),on=pset117(r,d);
  openSheet(`<div class="sh"><h3>⏱ ${esc(r.name)} · ${esc(lbl117(d))}</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div><p class="help" style="margin:0 0 8px">이 날은 어떤 상황으로 할까요? 누르면 골라지고 그 프리셋의 단계·순서대로 해요.${typeof srcNote118==='function'?srcNote118(r,d):''}</p>
    <div class="sit116 sit117" role="group" aria-label="상황 프리셋">${L.map(p=>{const ss=p.s.map(i=>(r.steps||[]).find(s=>s.id===i)).filter(s=>s&&TASKS[s.tid]);
      return `<button type="button" class="btn s116 s117 ${p===on?'':'ghost'}" data-pk117="${r.id}|${d}|${p.id}" data-close117="1" aria-pressed="${p===on}"><b>${esc(preN117(p))}${p===on?' ✓':''}${L.length>1&&p.id===(r.pf117||L[0].id)?' <small class="muted">기본</small>':''}</b><span class="tiny muted">${p.s.length?`${ss.length}단계 · ${sumMin117(ss.map(s=>({min:pmin118(p,s)})))}분`:'쉬는 날 · 루틴을 건너뛰어요'}</span></button>`}).join('')}</div>
    <div class="row" style="margin-top:10px"><button type="button" class="btn ghost sm" data-ed117="${r.id}">✎ 프리셋 편집·추가</button></div>`)}
function redraw117(r){try{if(sheetCtx&&sheetCtx.rt64===r.id)rtDone64(r,true);else if(sheetCtx&&sheetCtx.rt61===r.id)redrawRt61();else if(sheetCtx&&sheetCtx.task&&$('tsTitle'))tsRedraw();else if(curView()==='edit')reEdit()}catch(e){console.error(e)}}
function prune117(r){const t=gk76();Object.keys(r.pd117||{}).forEach(k=>{if(diffDays(k,t)<-7)delete r.pd117[k]})}
addEventListener('click',e=>{const b=e.target.closest('[data-pc117]');if(!b)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  const [rid,d]=b.dataset.pc117.split('|');pickSheet117(rid,d)},true);
addEventListener('click',e=>{const b=e.target.closest('[data-pk117]');if(!b)return;e.preventDefault();e.stopPropagation();
  const [rid,d,pid]=b.dataset.pk117.split('|'),r=(C.routines||[]).find(x=>x.id===rid);if(!r)return;const p=ensure117(r).find(x=>x.id===pid);if(!p)return;
  r.pd117=r.pd117||{};r.pd117[d]=pid;prune117(r);save('config');
  if(b.dataset.close117)closeSheet();
  toast(`${lbl117(d)} · ${preN117(p)} · ${p.s.length}단계`);
  redraw117(r);render()},true);
addEventListener('click',e=>{const b=e.target.closest('[data-ed117]');if(!b)return;e.preventDefault();e.stopPropagation();
  const r=(C.routines||[]).find(x=>x.id===b.dataset.ed117);if(!r)return;O117['o'+r.id]=1;closeSheet();setTimeout(()=>openRt61(r.id),30)},true);
// ---- 루틴 카드: 맨 위 '오늘/내일' 줄 + 프리셋 편집 접힘 ----
function blk114(r){
  const L=ensure117(r),e=(O117[r.id]&&L.find(p=>p.id===O117[r.id]))||pset117(r),td=gk76(),h=rtT(r),nx=h&&h.due&&h.due>td?h.due:null,dfl=r.pf117||L[0].id;
  const rowOf=(d,lab)=>{const on=pset117(r,d);return `<div class="row pr114row pt116 pt117" style="gap:6px;flex-wrap:wrap"><span class="tiny muted pd117">${esc(lab)}</span>${L.map(p=>chip117(r,d,p,p===on)).join('')}${typeof srcChip118==='function'?srcChip118(r,d):''}</div>`};
  const live=(r.steps||[]).filter(s=>TASKS[s.tid]),by={};live.forEach(s=>{by[s.id]=s});
  const inc=e.s.map(i=>by[i]).filter(Boolean),exc=live.filter(s=>e.s.indexOf(s.id)<0);
  const stRow=(s,i,on)=>`<div class="pe117r ${on?'':'off'}"><label><input type="checkbox" data-pcs117="${r.id}|${e.id}|${s.id}" ${on?'checked':''}> <span class="nm">${on?`<span class="no">${i+1}</span> `:''}${esc(stName61(s))}</span> ${on?`<label class="mn118" title="이 프리셋에서 이 단계에 쓰는 분 (비우면 공통 ${s.min||0}분)"><input type="number" min="0" max="240" inputmode="numeric" data-pmin118="${r.id}|${e.id}|${s.id}" value="${pmin118(e,s)}" class="${e.m&&e.m[s.id]!=null?'ov':''}" aria-label="${esc(stName61(s))} 분">분</label>`:`<span class="tiny muted">${s.min||0}분</span>`}</label>${on?`<span class="ops"><button type="button" class="ib" data-pm117="${r.id}|${e.id}|${s.id}|up" ${i?'':'disabled'} aria-label="위로">↑</button><button type="button" class="ib" data-pm117="${r.id}|${e.id}|${s.id}|dn" ${i<inc.length-1?'':'disabled'} aria-label="아래로">↓</button></span>`:''}</div>`;
  const sum=L.length>1?`${L.length}개 · 오늘은 ${preN117(pset117(r,td))}`:'지금은 하나(일반) — ＋로 출근·외근처럼 늘려요';
  return rowOf(td,'오늘')+(nx?rowOf(nx,lbl117(nx)):'')+`<details class="pe117" data-r="${r.id}" ${O117['o'+r.id]?'open':''}><summary class="small"><b>🧭 상황 프리셋 편집·추가</b> <span class="tiny muted">${esc(sum)}</span></summary>
    <div class="row" style="gap:6px;flex-wrap:wrap;margin-top:6px">${L.map(p=>`<button type="button" class="chipbtn" data-pt117="${r.id}|${p.id}" aria-pressed="${p===e}">${esc(preN117(p))}${p===e?' ✎':''}${L.length>1&&p.id===dfl?' ·기본':''}</button>`).join('')}<button type="button" class="chipbtn" data-pn117="${r.id}|${e.id}">＋ 새 프리셋</button></div>
    <div class="row pe117h" style="gap:6px;flex-wrap:wrap;margin-top:8px"><input class="pe117i" data-pf117="${r.id}|${e.id}|ic" value="${esc(e.ic||'')}" maxlength="4" aria-label="아이콘" style="width:3.2em;text-align:center"><input class="pe117n" data-pf117="${r.id}|${e.id}|n" value="${esc(e.n)}" maxlength="12" aria-label="프리셋 이름" style="flex:1;min-width:6em">
      <button type="button" class="btn sm ghost" data-pdef117="${r.id}|${e.id}" ${L.length>1&&e.id!==dfl?'':'disabled'}>기본으로</button><button type="button" class="btn sm ghost" data-pdup117="${r.id}|${e.id}">복제</button><button type="button" class="btn sm ghost" data-pdel117="${r.id}|${e.id}" ${L.length>1?'':'disabled'}>삭제</button></div>
    <p class="tiny muted" style="margin:6px 0 2px"><b>${esc(preN117(e))}</b>에서 할 단계 · ${inc.length}단계 ${sumMin117(inc.map(s=>({min:pmin118(e,s)})))}분 <span>(체크 = 함, ↑↓ = 순서, 분 = 이 프리셋만)</span></p>
    <div class="pe117l">${inc.map((s,i)=>stRow(s,i,true)).join('')||'<span class="tiny muted">단계가 없어요</span>'}${exc.length?`<div class="tiny muted" style="margin:6px 0 2px">이 프리셋에서 안 하는 단계</div>${exc.map(s=>stRow(s,0,false)).join('')}`:''}</div>
    <p class="tiny muted" style="margin:4px 0 0">단계 이름·점수는 위 단계 목록에서 고쳐요(모든 프리셋 공통). 분은 여기서 프리셋마다 따로 정할 수 있고, 안 바꾼 단계는 공통 분이에요. 새로 넣은 단계는 모든 프리셋 맨 뒤에 붙어요. 아무것도 안 골랐으면 '기본' 프리셋으로 해요. 고른 건 날짜별로 기억해요.</p></details>`}
// ---- 프리셋 편집 동작 ----
function pOf117(s){const [rid,pid,...x]=s.split('|'),r=(C.routines||[]).find(z=>z.id===rid);return {r,p:r&&ensure117(r).find(z=>z.id===pid),x}}
function done117(r,keep){save('config');if(keep)O117['o'+r.id]=1;redraw117(r);render()}
addEventListener('click',e=>{const b=e.target.closest('[data-pt117],[data-pn117],[data-pdef117],[data-pdup117],[data-pdel117],[data-pm117]');if(!b)return;e.preventDefault();e.stopPropagation();
  const k=['pt117','pn117','pdef117','pdup117','pdel117','pm117'].find(x=>b.dataset[x]);const {r,p,x}=pOf117(b.dataset[k]);if(!r||!p)return;const L=r.ps117;
  if(k==='pt117'){O117[r.id]=p.id;done117(r,1);return}
  if(k==='pn117'||k==='pdup117'){const q={id:'p'+uid(),ic:k==='pdup117'?p.ic:'🧩',n:k==='pdup117'?p.n+' 복사':'새 프리셋',s:p.s.slice(),m:Object.assign({},p.m||{})};L.splice(L.indexOf(p)+1,0,q);O117[r.id]=q.id;done117(r,1);toast(`${preN117(q)} 만들었어요 · 이름과 단계를 고쳐요`);return}
  if(k==='pdef117'){r.pf117=p.id;done117(r,1);toast(`${preN117(p)}이(가) 기본이에요 · 안 고른 날은 이걸로 해요`);return}
  if(k==='pdel117'){if(L.length<=1){toast('프리셋은 하나 이상 있어야 해요');return}const snap=clone({ps:r.ps117,pd:r.pd117||{},pf:r.pf117,o:O117[r.id]});
    r.ps117=L.filter(z=>z!==p);Object.keys(r.pd117||{}).forEach(d=>{if(r.pd117[d]===p.id)delete r.pd117[d]});if(r.pf117===p.id)delete r.pf117;delete O117[r.id];done117(r,1);
    toastAct(`'${p.n}' 프리셋을 지웠어요`,'되돌리기',()=>{r.ps117=snap.ps;r.pd117=snap.pd;if(snap.pf)r.pf117=snap.pf;else delete r.pf117;if(snap.o)O117[r.id]=snap.o;done117(r,1)});return}
  if(k==='pm117'){const [sid,dir]=x,i=p.s.indexOf(sid),j=dir==='up'?i-1:i+1;if(i<0||j<0||j>=p.s.length)return;[p.s[i],p.s[j]]=[p.s[j],p.s[i]];done117(r,1)}
},true);
addEventListener('change',e=>{const i=e.target;if(!i||!i.dataset)return;
  if(i.dataset.pcs117){e.stopPropagation();const {r,p,x}=pOf117(i.dataset.pcs117);if(!r||!p)return;const sid=x[0];
    if(i.checked){if(p.s.indexOf(sid)<0)p.s.push(sid);delete p.z119}else{p.s=p.s.filter(z=>z!==sid);if(!p.s.length){p.z119=1;toast(`${preN117(p)} · 단계를 다 뺐어요 → 이 상황인 날은 쉬는 날이라 루틴을 건너뛰어요`)}}
    done117(r,1);return}
  if(i.dataset.pmin118){e.stopPropagation();const {r,p,x}=pOf117(i.dataset.pmin118);if(!r||!p)return;const sid=x[0],st=(r.steps||[]).find(z=>z.id===sid);if(!st)return;
    p.m=p.m||{};const v=i.value.trim();if(v===''||(Math.max(0,Math.min(240,parseInt(v)||0))===(+st.min||0))){delete p.m[sid]}else p.m[sid]=Math.max(0,Math.min(240,parseInt(v)||0));if(!Object.keys(p.m).length)delete p.m;done117(r,1);return}
  if(i.dataset.pf117){e.stopPropagation();const {r,p,x}=pOf117(i.dataset.pf117);if(!r||!p)return;const f=x[0],v=i.value.trim();
    if(f==='n'){if(!v){i.value=p.n;return}p.n=v}else p.ic=v||'🧩';done117(r,1)}},true);
// 한글 조합 중 Enter 방지: 이름 칸 Enter = 저장
addEventListener('keydown',e=>{const i=e.target;if(i&&i.dataset&&(i.dataset.pf117||i.dataset.pmin118)&&e.key==='Enter'&&!e.isComposing&&e.keyCode!==229){e.preventDefault();i.blur()}},true);
addEventListener('toggle',e=>{const d=e.target;if(d&&d.classList&&d.classList.contains('pe117')&&d.dataset.r)O117['o'+d.dataset.r]=d.open?1:0},true);
F67=(function(prev){return function(){return prev.apply(this,arguments).filter(x=>!/^(🚗 루틴 상황별|🧭 오늘 상황 고르기)/.test(x[0])).concat([
  ['🧭 루틴 상황 프리셋','할 일 → 루틴 줄의 ⏱ n단계 · m분 글자 누르기 · 루틴 카드 맨 위 줄','한 루틴을 일반·출근·외근처럼 프리셋 여러 개로 나눠요(프리셋마다 하는 단계와 순서가 달라요, 추가·이름 바꾸기·복제·삭제 가능). 목록의 오늘·내일 루틴 줄에서 날짜별로 골라 두면 그대로 해요. 안 골랐으면 기본 프리셋으로 바로 시작해요',()=>{location.hash='tasks'},'루틴 프리셋 상황 출근 외근 일반 아침 루틴 단계 순서 모텔 새벽 날짜별']])}})(F67);
