/* v13.0 (w128): ① 시간표·캘린더 위 🧽 관리 블록에 바로 누르는 ✓(완료) ② 🧽 관리 놓기 시트 강화 — 정렬·거르기·찾기·여러 개 골라 한꺼번에 놓기(빈 시간 자동)·빼기·끝냄
   ③ 홈 '이번 주 용기': 한 가지가 아니라 여러 개 정하기 · 용기 고르기 창은 연달아 여러 개 기록해도 안 닫힘(★로 이번 주 용기에 담기)
   설정 `C.care128={s:정렬,f:거르기,auto:0|1}`(C 최상위), 이번 주 용기 추가분 `C.wext128={주시작:[할 일 id]}`(첫 번째는 예전대로 C.wone62). */

/* ---------- ③ 이번 주 용기 여러 개 (함수 선언은 맨 바깥 — 뒤에 있는 게 이김) ---------- */
function woneIds128(ws){ws=ws||weekStart(dateKey());const a=[],p=(C.wone62||{})[ws],x=(C.wext128||{})[ws]||[];
  [p].concat(x).forEach(id=>{if(id&&TASKS[id]&&!a.includes(id))a.push(id)});return a}
function woneSave128(ws,ids){C.wone62=C.wone62||{};C.wext128=C.wext128||{};
  if(ids[0])C.wone62[ws]=ids[0];else delete C.wone62[ws];
  if(ids.length>1)C.wext128[ws]=ids.slice(1);else delete C.wext128[ws];
  Object.keys(C.wext128).forEach(k=>{if(k<addDays(ws,-63))delete C.wext128[k]});save('config')}
function woneAdd128(id){const ws=weekStart(dateKey()),a=woneIds128(ws);if(!a.includes(id)){a.push(id);woneSave128(ws,a)}}
function woneDel128(id){const ws=weekStart(dateKey());woneSave128(ws,woneIds128(ws).filter(x=>x!==id))}
function woneMake128(p){const end=addDays(weekStart(dateKey()),6);const x=newTask({title:p.title,aid:p.aid,brave:p.aid?undefined:1,due:end,list:'inbox'});saveTask(x);return x}
function woneSet62(){const ws=weekStart(dateKey()),end=addDays(ws,6),have=new Set(woneIds128(ws));
  const cards=C.actions.filter(a=>a.brave&&a.type==='good'&&!a.doneAt),
    tasks=openTasks().filter(x=>(x.brave||((C.actions.find(a=>a.id===x.aid)||{}).brave))&&!have.has(x.id));
  openPicker61({title:'⚔️ 이번 주 용기 정하기 (여러 개 가능)',multi:true,tabs:[
      {k:'new',label:'✎ 새로 적기',newLabel:'이걸로',onNew:v=>{if(!v)return;const x=woneMake128({title:v});woneAdd128(x.id);render();toast(`이번 주 용기에 담았어요: '${x.title}'`,3500)},items:[]},
      {k:'task',label:'⚔️ 용기 할 일',items:tasks.map(x=>({id:x.id,label:x.title,sub:x.due?dueLabel(x.due):'날짜 없음'}))},
      {k:'card',label:'⚔️ 용기 카드',items:cards.map(a=>({id:a.id,label:a.name,sub:'카드 점수로 기록'}))}],
    onPick:list=>{let n=0;list.forEach(s=>{let x=null;
        if(s.tab==='task'){x=TASKS[s.id];if(x&&(!x.due||x.due>end)){x.due=end;saveTask(x)}}
        else if(s.tab==='card'){const a=C.actions.find(z=>z.id===s.id);if(a)x=woneMake128({title:a.name,aid:a.id})}
        if(x){woneAdd128(x.id);n++}});
      render();if(n)toast(`이번 주 용기 ${n}개를 담았어요 · 일요일까지, 안 돼도 괜찮아요`,4000)}})}
/* ✎ 바꾸기 = 정한 것 빼기·더 정하기 */
function woneManage128(){const ws=weekStart(dateKey()),ids=woneIds128(ws);
  sheetCtx={w128:1};
  openSheet(`<div class="sh"><h3>⚔️ 이번 주 용기</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <p class="small muted" style="margin:0 0 6px">하고 싶은 만큼 여러 개 정해도 돼요. 안 정해도, 안 돼도 괜찮아요.</p>
    ${ids.length?ids.map(id=>{const t=TASKS[id];return `<div class="c98r"><span class="c98t"><b>${t.status===2?'✓ ':''}${esc(t.title)}</b><small>${esc(t.due?dueLabel(t.due):'날짜 없음')}</small></span><span style="flex:1"></span><button type="button" class="chipbtn" data-w128o="${esc(id)}">열기</button><button type="button" class="chipbtn" data-w128x="${esc(id)}" aria-label="${esc(t.title)} 이번 주 용기에서 빼기">✕ 빼기</button></div>`}).join(''):'<div class="empty tiny">아직 정한 게 없어요.</div>'}
    <div class="row" style="margin-top:10px;gap:8px"><button type="button" class="btn" data-w128a="1">＋ 더 정하기</button><button type="button" class="btn ghost" data-w128p="1">⚔️ 용기 고르기 창</button></div>`)}
addEventListener('click',e=>{const T=e.target;if(!T||!T.closest)return;let b;
  if((b=T.closest('[data-w62="change"]'))){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();woneManage128();return}
  if(!(sheetCtx&&sheetCtx.w128))return;
  if((b=T.closest('[data-w128x]'))){e.preventDefault();e.stopPropagation();const id=b.dataset.w128x,t=TASKS[id];woneDel128(id);render();woneManage128();if(t)toast(`'${t.title}'을(를) 이번 주 용기에서 뺐어요`,2500);return}
  if((b=T.closest('[data-w128o]'))){e.preventDefault();e.stopPropagation();closeSheet();openTaskSheet(b.dataset.w128o);return}
  if((b=T.closest('[data-w128a]'))){e.preventDefault();e.stopPropagation();closeSheet();woneSet62();return}
  if((b=T.closest('[data-w128p]'))){e.preventDefault();e.stopPropagation();closeSheet();bravePick98();return}
},true);
/* 홈 한 줄: 정한 용기를 여러 개(최대 2개 이름 + ＋n) */
function brave126(){
  const host=document.querySelector('.hblock[data-hid="quests"] .panel');if(!host)return;
  host.querySelectorAll('.brv126').forEach(x=>x.remove());
  let ws;try{ws=weekState(dateKey())}catch(e){return}
  if(!ws||!ws.goal)return;
  const ok=ws.brave>=ws.goal,N=Math.max(ws.goal,ws.brave),ids=woneIds128(),ts=ids.map(id=>TASKS[id]);
  const dots=N<=7?`<span class="dt" aria-hidden="true">${Array.from({length:N},(_,i)=>i<ws.brave?'●':'○').join('')}</span>`:'';
  const chip=t=>`<button type="button" class="chipbtn o${t.status===2?' ok':''}" data-x60task="${t.id}" title="이번 주 용기">${t.status===2?'✓ ':''}${esc(t.title)}</button>`;
  const one=!ts.length?`<button type="button" class="chipbtn o" data-w62="set" title="하고 싶은 만큼 정해요 · 안 정해도 괜찮아요">용기 정하기</button>`
    :`<span class="one">${ts.slice(0,2).map(chip).join('')}${ts.length>2?`<button type="button" class="chipbtn o" data-w62="change" title="정한 용기 모두 보기">＋${ts.length-2}</button>`:''}<button type="button" class="ib" data-w62="set" title="더 정하기" aria-label="이번 주 용기 더 정하기">＋</button><button type="button" class="ib" data-w62="change" title="빼기·바꾸기" aria-label="이번 주 용기 빼기·바꾸기">✎</button></span>`;
  const h=`<div class="brv126${ok?' done':''}"><button type="button" class="b" data-sugbrave="1" title="용기 카드를 골라 바로 기록해요${ok?'':' · 채우면 +'+(+C.weekly.courageGold||0)+'골드'}"><span aria-hidden="true">⚔</span><b>이번 주 용기</b>${dots}<span class="n num">${ws.brave}/${ws.goal}${ok?' ✓':''}</span>${ok?'':`<small class="muted">· 채우면 +💰${+C.weekly.courageGold||0}</small>`}</button>${one}</div>`;
  const tt=host.querySelector(':scope > .ptitle');
  if(tt)tt.insertAdjacentHTML('afterend',h);else host.insertAdjacentHTML('afterbegin',h)}
/* 돌아보기 용기 칸(woneHTML62)도 같은 모양으로 */
function woneHTML62(){const ts=woneIds128().map(id=>TASKS[id]);
  if(!ts.length)return `<div class="wone62"><button type="button" class="chipbtn" data-w62="set" title="하고 싶은 만큼 정해요 · 안 정해도 괜찮아요">⚔️ 이번 주 용기 정하기 <span class="tiny muted">(선택 · 여러 개 가능)</span></button></div>`;
  const all=ts.every(t=>t.status===2);
  return `<div class="wone62 ${all?'ok':''}"><span class="tiny muted">⚔️ 이번 주 용기</span> ${ts.map(t=>`<button type="button" class="chipbtn" data-x60task="${t.id}">${t.status===2?'✓ ':''}${esc(t.title)}</button>`).join(' ')} <button type="button" class="chipbtn" data-w62="set" title="더 정하기">＋</button> <button type="button" class="chipbtn" data-w62="change" title="빼기·바꾸기">✎</button></div>`}

/* ---------- ③ 용기 고르기 창: 열어 둔 채 연달아 기록 · ★ 이번 주 용기에 담기 ---------- */
bravePick98=function(){
  try{if(!$('pop').hidden)closeInfo()}catch(e){}
  const md=midKey68(),day=today(),ws=weekState(dateKey()),tk=[],wk=weekStart(dateKey()),picks=new Set(woneIds128(wk));
  Object.values(TASKS).forEach(t=>{if(!t||t.status!==0||t.rid||t.rstep||t.cb76||t.ml80||hid76(t))return;
    const a=t.aid&&C.actions.find(x=>x.id===t.aid),sz=t.brave?(C.courageSizes.find(z=>z.id===t.bsz71)||null):(a&&a.brave?braveSize(a):null);
    if(!t.brave&&!(a&&a.brave))return;
    const d=t.due||'',rank=!d?2:d<md?0:d===md?1:3;tk.push({t,rank,d,sz,pk:picks.has(t.id)?0:1})});
  tk.sort((x,y)=>x.pk-y.pk||x.rank-y.rank||String(x.d).localeCompare(String(y.d)));
  const due=x=>x.rank===0?'지남':x.rank===1?'오늘':x.d?dayName68(x.d):'';
  const star=(on,k,id,nm)=>`<button type="button" class="c128s${on?' on':''}" data-c128w="${k}|${esc(id)}" aria-pressed="${on}" aria-label="${esc(nm)} 이번 주 용기에 ${on?'뺌':'담기'}" title="${on?'이번 주 용기에서 빼기':'이번 주 용기에 담기'}">${on?'★':'☆'}</button>`;
  const trows=tk.slice(0,12).map(x=>`<div class="c98r"><button type="button" class="c98k br" data-c98t="${esc(x.t.id)}" aria-label="${esc(x.t.title)} 했어요"></button><span class="c98t"><b>⚔️${x.sz?' <small>'+esc(x.sz.name)+'</small>':''} ${esc(x.t.title)}</b><small>${esc([due(x),x.pk===0?'이번 주 용기':'',x.t.aid?'🃏 카드 이은 할 일':''].filter(Boolean).join(' · '))}</small></span>${star(x.pk===0,'t',x.t.id,x.t.title)}</div>`).join('');
  const cards=C.actions.filter(a=>a.type==='good'&&a.brave&&!a.doneAt).map(a=>({a,n:(day.entries||[]).filter(e=>e.kind==='act'&&e.aid===a.id).length,pk:Object.values(TASKS).some(t=>t.status!==2&&t.aid===a.id&&picks.has(t.id))?0:1}));
  cards.sort((x,y)=>(x.n?1:0)-(y.n?1:0)||x.pk-y.pk);
  const crows=cards.slice(0,14).map(({a,n,pk})=>{const z=braveSize(a);return `<div class="c98r"><button type="button" class="c98k br${n?' on':''}" data-c98a="${esc(a.id)}" aria-label="${esc(a.name)} 했어요 기록">${n?(n>1?n:'✓'):''}</button><span class="c98t"><b>⚔️${z?' <small>'+esc(z.name)+'</small>':''} ${esc(a.name)}</b><small>${esc((C.areas.find(x=>x.id===a.area)||{}).name||'')}${n?' · 오늘 '+n+'번':''}${pk===0?' · 이번 주 용기':''}</small></span>${pk===0?'':star(false,'a',a.id,a.name)}</div>`}).join('');
  const old=(C.courage||[]).map(k=>`<div class="c98r"><button type="button" class="c98k br" data-c98a="${esc(k.id)}" aria-label="${esc(k.name)} 기록"></button><span class="c98t"><b>⚡ ${esc(k.name)}</b><small>용기 버튼</small></span></div>`).join('');
  const left=ws.goal?Math.max(0,ws.goal-ws.brave):0;
  sheetCtx={c98:1,b128:1};
  openSheet(`<div class="sh"><h3>⚔️ 용기 고르기</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <p class="small muted" style="margin:0">${ws.goal?`이번 주 ⚡ <b>${ws.brave}/${ws.goal}</b>${left?` · ${left}번 남았어요`:' · 채웠어요 ✓'} · `:''}원 안을 누르면 바로 기록돼요 <b>(창은 안 닫혀요 — 여러 개 연달아 해도 돼요)</b>. ☆는 이번 주 용기에 담아 두는 표시예요.</p>
    ${trows?`<div class="c76g">⚔️ 용기 붙은 할 일 <small class="muted">${tk.length}개</small></div>${trows}`:''}
    ${crows?`<div class="c76g">⚔️ 용기 카드 <small class="muted">${cards.length}개</small></div>${crows}`:''}
    ${old?`<div class="c76g">용기 버튼</div>${old}`:''}
    ${!trows&&!crows&&!old?'<div class="empty">용기 표시가 붙은 게 아직 없어요. 할 일 상세의 ⚔️ 칩이나 카드 편집의 ⚔ 칩으로 붙여요.</div>':''}
    <div class="row" style="margin-top:8px;gap:8px"><button type="button" class="btn ghost sm" data-w128a="1">⚔️ 이번 주 용기 정하기</button><button type="button" class="btn ghost sm" data-c98go="1">기록하기의 ⚔️ 용기 칸 ›</button><button type="button" class="btn sm" data-sheet="close">다 했어요</button></div>`);
  const sc=$('sheetC');if(sc&&bravePick98.y)sc.scrollTop=bravePick98.y;bravePick98.y=0}
/* w98 클릭 처리에서 부름: 용기 고르기 창이 열려 있으면 안 닫고 기록 → 같은 자리에 다시 그림 */
window.bk128=function(kind,id){
  if(!(sheetCtx&&sheetCtx.b128))return false;
  const sc0=$('sheetC'),y=sc0?sc0.scrollTop:0,ctx=sheetCtx;
  try{ui.off=0;
    if(kind==='t'){const t=TASKS[id];if(t)completeTask(t)}
    else{const x=C.actions.find(z=>z.id===id),k=(C.courage||[]).find(z=>z.id===id);if(x)doAction(x);else if(k)doBrave(k)}
  }catch(e){console.error(e)}
  setTimeout(()=>{if(sheetCtx!==ctx&&!(sheetCtx&&sheetCtx.b128))return;   // 다른 창(기록 창 등)이 열렸으면 그대로 둠
    bravePick98.y=y;bravePick98()},60);
  return true};
addEventListener('click',e=>{const T=e.target;if(!T||!T.closest)return;let b;
  if(!(sheetCtx&&sheetCtx.b128))return;
  if((b=T.closest('[data-c128w]'))){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();const [k,id]=b.dataset.c128w.split('|');
    const sc=$('sheetC'),y=sc?sc.scrollTop:0;
    if(k==='t'){if(woneIds128().includes(id))woneDel128(id);else woneAdd128(id)}
    else{const a=C.actions.find(z=>z.id===id);if(a){const x=woneMake128({title:a.name,aid:a.id});woneAdd128(x.id);toast(`이번 주 용기에 담았어요: '${a.name}'`,2500)}}
    render();bravePick98.y=y;bravePick98();return}
},true);

/* ---------- ① 관리 블록 ✓ + ② 관리 놓기 시트 ---------- */
{
const tdK=()=>midKey68();
function ckDecor(){
  document.querySelectorAll('#calPane [data-ctask], #tt84slot [data-ctask]').forEach(el=>{
    if(el.classList.contains('done')||el.classList.contains('bar83')||el.querySelector(':scope > .ck128'))return;
    if(el.closest('.mgrid'))return;   // 월 칸은 칩이 작아서 제외
    const t=TASKS[el.dataset.ctask];if(!t||t.status!==0||!isCare76(t)||!plOn126(t))return;
    const b=document.createElement('button');b.type='button';b.className='ck128';b.setAttribute('data-tdone',t.id);
    b.setAttribute('aria-label',(t.title||'')+' 끝냈어요 (체크)');b.title='끝냈어요';b.textContent='○';
    el.classList.add('has128');el.appendChild(b)})}
render=(function(prev){return function(){const r=prev.apply(this,arguments);try{ckDecor()}catch(e){console.error(e)}return r}})(render);
try{if(typeof renderCal==='function')renderCal=(function(prev){return function(){const r=prev.apply(this,arguments);try{ckDecor()}catch(e){console.error(e)}return r}})(renderCal)}catch(e){}

const C128=()=>{let c=C.care128;if(!c||typeof c!=='object'||Array.isArray(c))c=C.care128={};if(!c.s)c.s='due';if(!c.f)c.f='all';return c};
const SORTS=[['due','차례 빠른 순'],['late','오래 밀린 순'],['short','짧은 것 먼저'],['long','긴 것 먼저'],['name','이름순'],['list','목록별']];
const FILT=[['all','전체'],['due','차례인 것'],['un','안 놓은 것'],['pl','놓은 것']];
const D={sel:new Set(),q:'',bd:null};
const dL=m=>m>=60&&m%60===0?m/60+'시간':m+'분';
function lname(t){const l=C.lists.find(z=>z.id===(t.list||'inbox'));return l?l.name:''}
function listOf(){const c=C128(),td=tdK(),q=D.q.trim().toLowerCase();
  let a=careAll76().filter(t=>!q||String(t.title).toLowerCase().includes(q));
  if(c.f==='due')a=a.filter(t=>t.due&&t.due<=td);else if(c.f==='un')a=a.filter(t=>!plOn126(t));else if(c.f==='pl')a=a.filter(t=>plOn126(t));
  const due=t=>String(t.due||'9999'),late=t=>t.due?diffDays(t.due,td):-999;
  const by={due:(x,y)=>due(x).localeCompare(due(y))||(x.order||0)-(y.order||0),
    late:(x,y)=>late(x)-late(y)||(x.order||0)-(y.order||0),
    short:(x,y)=>(+x.dur||30)-(+y.dur||30)||due(x).localeCompare(due(y)),
    long:(x,y)=>(+y.dur||30)-(+x.dur||30)||due(x).localeCompare(due(y)),
    name:(x,y)=>String(x.title).localeCompare(String(y.title),'ko'),
    list:(x,y)=>lname(x).localeCompare(lname(y),'ko')||due(x).localeCompare(due(y))};
  return a.sort(by[c.s]||by.due)}
const sumMin=ts=>ts.reduce((s,t)=>s+(+t.dur||30),0);
function rowH(t,c,prevL){const td=tdK(),on=plOn126(t),sel=D.sel.has(t.id),dueNow=t.due&&t.due<=td;
  const head=c.s==='list'&&lname(t)!==prevL?`<div class="tgh66"><span>📂 ${esc(lname(t)||'목록 없음')}</span></div>`:'';
  const sub=[on?'📅 '+(t.cs126.d===td?'오늘':t.cs126.d===addDays(td,1)?'내일':fmtD(t.cs126.d))+(t.cs126.m?' '+t.cs126.m:'')+' 에 놓음':(when76(t,td)||'날짜 없음'),t.dur?'⏱'+dL(+t.dur):'',repLabel(t.rep)].filter(Boolean).join(' · ');
  return head+`<div class="d128r${sel?' sel':''}${dueNow&&!on?' due':''}" data-d128r="${esc(t.id)}"><label class="d128c"><input type="checkbox" data-d128s="${esc(t.id)}"${sel?' checked':''} aria-label="${esc(t.title)} 고르기"></label>
    <div class="d128t"><b>🧽 ${esc(t.title)}</b><small class="muted">${esc(sub)}</small></div>
    <div class="d128b"><button type="button" class="chipbtn" data-d128q="${esc(t.id)}|0" aria-label="${esc(t.title)} 오늘로 놓기">오늘</button><button type="button" class="chipbtn" data-d128q="${esc(t.id)}|1" aria-label="${esc(t.title)} 내일로 놓기">내일</button><button type="button" class="chipbtn" data-d127p="${esc(t.id)}" aria-label="${esc(t.title)} 날짜·시각 정하기">📅</button>${on?`<button type="button" class="chipbtn" data-d127u="${esc(t.id)}" aria-label="${esc(t.title)} 놓은 자리 빼기">✕</button>`:''}</div></div>`}
function listH(){const c=C128(),L=listOf();let pl=null;
  const rows=L.map(t=>{const h=rowH(t,c,pl);pl=lname(t);return h}).join('');
  return rows||`<div class="empty tiny">${careAll76().length?'조건에 맞는 관리가 없어요.':'아직 관리로 옮긴 할 일이 없어요.'}</div>`}
function barH(){const td=tdK(),c=C128(),ids=[...D.sel].filter(id=>TASKS[id]&&isCare76(TASKS[id])),ts=ids.map(id=>TASKS[id]);
  if(!ts.length)return `<div class="d128bar off">아래에서 여러 개를 고르면 한꺼번에 놓을 수 있어요</div>`;
  const dn=[['오늘',0],['내일',1],['모레',2]].map(([l,i])=>{const k=addDays(td,i);return `<button type="button" class="chipbtn" data-d128d="${k}" aria-pressed="${D.bd===k}">${l}</button>`}).join('');
  const hasPl=ts.some(plOn126);
  return `<div class="d128bar"><div class="d128n"><b>${ts.length}개 고름</b> <small class="muted">⏱ ${esc(hmK76(sumMin(ts)))}</small></div>
    <div class="row" style="gap:6px;flex-wrap:wrap;align-items:center">${dn}<input type="date" data-d128dv="1" value="${esc(D.bd||'')}" min="${esc(td)}" aria-label="다른 날"></div>
    <label class="small d128a"><input type="checkbox" data-d128auto="1"${c.auto===0?'':' checked'}> 시각도 빈 시간에 알아서 넣기</label>
    <div class="row" style="gap:6px;flex-wrap:wrap"><button type="button" class="btn sm" data-d128go="1"${D.bd?'':' disabled'}>${D.bd?esc(dueLabel(D.bd))+'에 놓기':'날짜를 골라요'}</button>${hasPl?'<button type="button" class="btn sm ghost" data-d128off="1">놓은 것 빼기</button>':''}<button type="button" class="btn sm ghost" data-d128done="1">✓ 끝냄</button></div></div>`}
function sheetH(){const c=C128(),td=tdK(),all=careAll76(),pl=all.filter(plOn126).length,dn=all.filter(t=>t.due&&t.due<=td).length;
  return `<div class="sh"><h3>🧽 관리 놓기</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <p class="small muted" style="margin:0 0 6px">전체 ${all.length}개 · 차례 ${dn}개 · 놓음 ${pl}개 — 하나씩은 <b>오늘·내일·📅</b>, 여러 개는 칸을 골라 한꺼번에 놓아요. 시각은 시간표에서 꾹 눌러 끌어도 돼요.</p>
    <div class="row d128f" style="gap:6px;flex-wrap:wrap"><label class="small">정렬 <select data-d128sort="1" aria-label="정렬">${SORTS.map(([k,l])=>`<option value="${k}"${c.s===k?' selected':''}>${l}</option>`).join('')}</select></label>
      ${FILT.map(([k,l])=>`<button type="button" class="chipbtn" data-d128f="${k}" aria-pressed="${c.f===k}">${l}</button>`).join('')}</div>
    <div class="row d128f" style="gap:6px;align-items:center;margin-top:6px"><input type="search" id="d128q" placeholder="관리 찾기" value="${esc(D.q)}" aria-label="관리 찾기" style="flex:1;min-width:0"><button type="button" class="chipbtn" data-d128all="due">차례인 것 모두</button><button type="button" class="chipbtn" data-d128all="vis">보이는 것 모두</button><button type="button" class="chipbtn" data-d128all="none">해제</button></div>
    <div id="d128bar">${barH()}</div>
    <div id="d128list">${listH()}</div>
    ${typeof wkSection127==='function'?wkSection127():''}`}
function open128(){sheetCtx={deck127:1,d128:1};D.sel=new Set([...D.sel].filter(id=>TASKS[id]&&isCare76(TASKS[id])));openSheet(sheetH())}
window.deck128=function(){const sc=$('sheetC'),keep=sheetCtx&&sheetCtx.d128&&sc?sc.scrollTop:0;open128();const s2=$('sheetC');if(s2&&keep)s2.scrollTop=keep};
function refresh(){const l=$('d128list'),b=$('d128bar');if(l)l.innerHTML=listH();if(b)b.innerHTML=barH()}
/* 놓기 */
function busy(k,skip){const out=[];try{tasksOn(k).forEach(t=>{if(!t||t.status!==0||skip.has(t.id)||!t.time||hm80(t.time)==null)return;const s=hm80(t.time);out.push([s,s+Math.max(10,+t.dur||30)])})}catch(e){console.error(e)}return out}
function slot(k,d,bz,from){const p=pcfg80();let s=hm80(p.s),e=hm80(p.e);
  if(k===tdK()){const n=new Date(),nm=Math.ceil((n.getHours()*60+n.getMinutes())/15)*15;if(nm>s)s=nm}
  let pos=Math.ceil(Math.max(s,from||0)/5)*5;
  while(pos+d<=e){const hit=bz.find(b=>b[0]<pos+d&&b[1]>pos);if(!hit)return pos;pos=Math.ceil(hit[1]/5)*5}
  return null}
function bulkPlace(ts,k,auto){const sn=ts.map(t=>({t,s:snap126(t)})),skip=new Set(ts.map(t=>t.id)),bz=busy(k,skip);let n=0,miss=0;
  ts.forEach(t=>{let m='';if(auto){const d=Math.max(10,+t.dur||30),p=slot(k,d,bz);if(p==null){miss++}else{m=fmt80(p);bz.push([p,p+d+5])}}
    place126(t,k,m);n++});
  return {sn,n,miss}}
function undoer(sn,msg){toastAct(msg,'되돌리기',()=>{sn.forEach(x=>{try{restore126(x.t,x.s)}catch(_){}});render();if(sheetCtx&&sheetCtx.d128)window.deck128()})}
function done(){return {y:(()=>{const sc=$('sheetC');return sc?sc.scrollTop:0})()}}
addEventListener('click',e=>{const T=e.target;if(!T||!T.closest)return;let b;
  if(!(sheetCtx&&sheetCtx.d128))return;
  const stop=()=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation()};
  if((b=T.closest('[data-d128q]'))){stop();const [id,i]=b.dataset.d128q.split('|'),t=TASKS[id];if(!t)return;const k=addDays(tdK(),+i),sn=snap126(t);
    place126(t,k,'');render();window.deck128();toastAct(`🧽 ${t.title} → ${dueLabel(k)}`,'되돌리기',()=>{restore126(t,sn);render();if(sheetCtx&&sheetCtx.d128)window.deck128()});return}
  if((b=T.closest('[data-d128f]'))){stop();C128().f=b.dataset.d128f;save('config');window.deck128();return}
  if((b=T.closest('[data-d128all]'))){stop();const w=b.dataset.d128all;
    if(w==='none')D.sel.clear();else{const td=tdK();(w==='due'?careAll76().filter(t=>t.due&&t.due<=td):listOf()).forEach(t=>D.sel.add(t.id))}
    window.deck128();return}
  if((b=T.closest('[data-d128d]'))){stop();D.bd=b.dataset.d128d;const bar=$('d128bar');if(bar)bar.innerHTML=barH();return}
  if((b=T.closest('[data-d128go]'))){stop();const k=D.bd;if(!k||k<tdK())return;const ts=[...D.sel].map(id=>TASKS[id]).filter(t=>t&&isCare76(t)).sort((x,y)=>listOf().indexOf(x)-listOf().indexOf(y)),auto=C128().auto!==0;
    const r=bulkPlace(ts,k,auto);D.sel.clear();render();window.deck128();
    undoer(r.sn,`🧽 ${r.n}개 → ${dueLabel(k)}${auto?' (빈 시간에 넣음)':''}${r.miss?` · ${r.miss}개는 빈 시간이 없어 시각 없이 놓음`:''}`);return}
  if((b=T.closest('[data-d128off]'))){stop();const ts=[...D.sel].map(id=>TASKS[id]).filter(t=>t&&plOn126(t));if(!ts.length)return;const sn=ts.map(t=>({t,s:snap126(t)}));
    ts.forEach(t=>unplace126(t));D.sel.clear();render();window.deck128();undoer(sn,`🧽 ${ts.length}개 놓은 자리를 뺐어요`);return}
  if((b=T.closest('[data-d128done]'))){stop();const ts=[...D.sel].map(id=>TASKS[id]).filter(t=>t&&t.status===0&&isCare76(t));if(!ts.length)return;
    ts.forEach(t=>{try{completeTask(t)}catch(err){console.error(err)}});D.sel.clear();window.deck128();toast(`🧽 ${ts.length}개를 끝냈어요 · 다음 차례로 넘어갔어요`,3500);return}
},true);
addEventListener('change',e=>{const T=e.target;if(!T||!T.matches||!(sheetCtx&&sheetCtx.d128))return;
  if(T.matches('[data-d128s]')){e.stopPropagation();e.stopImmediatePropagation();if(T.checked)D.sel.add(T.dataset.d128s);else D.sel.delete(T.dataset.d128s);const r=T.closest('.d128r');if(r)r.classList.toggle('sel',T.checked);const bar=$('d128bar');if(bar)bar.innerHTML=barH();return}
  if(T.matches('[data-d128sort]')){e.stopPropagation();e.stopImmediatePropagation();C128().s=T.value;save('config');window.deck128();return}
  if(T.matches('[data-d128dv]')){e.stopPropagation();e.stopImmediatePropagation();if(/^\d{4}-\d\d-\d\d$/.test(T.value)&&T.value>=tdK()){D.bd=T.value;const bar=$('d128bar');if(bar)bar.innerHTML=barH()}return}
  if(T.matches('[data-d128auto]')){e.stopPropagation();e.stopImmediatePropagation();C128().auto=T.checked?1:0;save('config');return}
},true);
/* 찾기: 칠 때마다 목록만 다시 그림(입력칸은 그대로 — 한글 조합 보호) */
let comp=false;
addEventListener('compositionstart',e=>{if(e.target&&e.target.id==='d128q')comp=true},true);
addEventListener('compositionend',e=>{if(e.target&&e.target.id==='d128q'){comp=false;D.q=e.target.value;const l=$('d128list');if(l)l.innerHTML=listH()}},true);
addEventListener('input',e=>{const T=e.target;if(!T||T.id!=='d128q')return;e.stopPropagation();e.stopImmediatePropagation();if(comp||e.isComposing)return;D.q=T.value;const l=$('d128list');if(l)l.innerHTML=listH()},true);
addEventListener('keydown',e=>{if(e.target&&e.target.id==='d128q'&&e.key==='Enter')e.preventDefault()},true);
F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['✓ 관리 블록 바로 끝내기','캘린더·폰 시간표(독)에 놓은 🧽 관리 블록 오른쪽 위 ○','시간표에 놓은 관리 블록(🧽)의 ○를 누르면 상세를 열지 않고 바로 끝내요. 끝내면 다음 차례로 넘어가고 블록은 ✓ 취소선으로 남아요.'],
  ['🧽 관리 놓기 시트 (정렬·여러 개)','캘린더·시간표 위쪽 🧽 관리 단추','정렬(차례·오래 밀린·짧은·긴·이름·목록별)·거르기(차례인 것·안 놓은 것·놓은 것)·찾기가 있고, 칸을 여러 개 골라 날짜 하나에 한꺼번에 놓아요(시각은 빈 시간에 알아서 넣거나 시각 없이). 한꺼번에 빼기·끝내기도 돼요.'],
  ['⚔ 이번 주 용기 여러 개','홈 → 오늘의 일퀘 카드 맨 위 줄','이번 주 용기를 하고 싶은 만큼 여러 개 정해요(＋). ✎로 빼요. ⚔️ 용기 고르기 창은 연달아 여러 개 기록해도 안 닫히고, ☆를 누르면 이번 주 용기에 담겨요.']])}})(F67);
}
