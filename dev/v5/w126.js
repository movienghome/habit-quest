/* ---- v12.8 (w126.js, v126.css): 단계 제목 펼치기 · 홈 '이번 주 용기' 합치기(S1) · 🧽 관리를 하나씩 놓기(내일 짜기·캘린더·관리 창) ----
   ① 루틴 단계 줄 ⋯를 누르면 점수·🌊·🔀·◌·×·🃏 줄과 함께 **제목이 줄임표 없이 전부** 보임(v126.css, 같은 `.open125` 상태).
   ② 홈: 이번 주 용기는 한 곳만 — '오늘의 일퀘' 카드 맨 위 얇은 한 줄 `.brv126`(⚔ 이번 주 용기 ●○ n/N · 보상 · 한 가지 정하기).
      '지금 하면 좋은 것'의 이번 주 용기 줄과 '이번 주' 카드는 뺌(이번 주 칸은 CSS로 숨기고 홈 배치 목록에서도 뜯음). 용기는 주 단위, 일퀘는 하루 단위 → 진행·보상은 따로 세고 한 목록에 섞지 않음.
   ③ 관리 하나씩 놓기: `t.cs126={d:날짜,m:'HH:MM'|'',pd:원래 차례}` = 이 차례만 그 날(·시각)로 옮김. 관리는 다음 차례가 하나뿐이라 `due`를 그 날로 옮기고(주기는 그대로, 끝내면 한 날부터 다시 셈),
      `plOn126(t)`(cs126.d===due && 오늘 이후)일 때만 캘린더에 보임: openTasks(HIDE76===2)에 끼워 넣고 tasksOn·cchip이 🧽 제목·시각 사본으로 바꿈.
      입구: 내일 짜기 🧽 관리 단계(칩 → 시간표) · 캘린더 서랍 🧽 관리 탭(끌기·누르기) · 관리 창 줄의 📅 · 관리 줄 ⋯ 메뉴. 놓기·빼기는 모두 place126/unplace126(되돌리기 snap126/restore126). */

/* ---- ① 홈 ---- */
suggestions=(function(prev){return function(){const out=prev.apply(this,arguments);try{return out.filter(s=>!(s&&s.key==='brave'&&s.label==='이번 주 용기'))}catch(e){return out}}})(suggestions);
try{delete HOME_BLOCKS.week}catch(e){}
function strip126(){try{const h=C.ui&&C.ui.home;if(Array.isArray(h)&&h.some(x=>x&&x[0]==='week')){C.ui.home=h.filter(x=>!(x&&x[0]==='week'));if(typeof ready!=='undefined'&&ready)save('config')}}catch(e){console.error(e)}}
function brave126(){
  const host=document.querySelector('.hblock[data-hid="quests"] .panel');if(!host)return;
  host.querySelectorAll('.brv126').forEach(x=>x.remove());
  let ws;try{ws=weekState(dateKey())}catch(e){return}
  if(!ws||!ws.goal)return;
  const ok=ws.brave>=ws.goal,w=wone62(),t=w&&w.t,N=Math.max(ws.goal,ws.brave);
  const dots=N<=7?`<span class="dt" aria-hidden="true">${Array.from({length:N},(_,i)=>i<ws.brave?'●':'○').join('')}</span>`:'';
  const one=!t?`<button type="button" class="chipbtn o" data-w62="set" title="하고 싶다면 하나만 · 안 정해도 괜찮아요">한 가지 정하기</button>`
    :`<span class="one"><button type="button" class="chipbtn o${t.status===2?' ok':''}" data-x60task="${t.id}" title="이번 주 한 가지">${t.status===2?'✓ ':''}${esc(t.title)}</button>${t.status===2?'':'<button type="button" class="ib" data-w62="change" title="바꾸기" aria-label="이번 주 한 가지 바꾸기">✎</button>'}</span>`;
  const h=`<div class="brv126${ok?' done':''}"><button type="button" class="b" data-sugbrave="1" title="용기 카드를 골라 바로 기록해요${ok?'':' · 채우면 +'+(+C.weekly.courageGold||0)+'골드'}"><span aria-hidden="true">⚔</span><b>이번 주 용기</b>${dots}<span class="n num">${ws.brave}/${ws.goal}${ok?' ✓':''}</span>${ok?'':`<small class="muted">· 채우면 +💰${+C.weekly.courageGold||0}</small>`}</button>${one}</div>`;
  const tt=host.querySelector(':scope > .ptitle');
  if(tt)tt.insertAdjacentHTML('afterend',h);else host.insertAdjacentHTML('afterbegin',h)}
renderHome=(function(prev){return function(){const r=prev.apply(this,arguments);try{strip126();brave126()}catch(e){console.error(e)}return r}})(renderHome);
render=(function(prev){return function(){try{strip126()}catch(e){}return prev.apply(this,arguments)}})(render);

/* ---- ③ 🧽 관리 하나씩 놓기 ---- */
const tdK126=()=>midKey68();
function plOn126(t){return !!(t&&t.status===0&&typeof isCare76==='function'&&isCare76(t)&&t.cs126&&t.cs126.d&&t.cs126.d===t.due&&t.due>=tdK126())}
function plAny126(){for(const id in TASKS){const t=TASKS[id];if(t&&t.cs126&&t.status===0)return true}return false}
function mk126(t,k){try{if(t&&t.care76&&!t.cs126k&&t.cs126&&t.cs126.d===k&&plOn126(t))return Object.assign({},t,{title:'🧽 '+t.title,time:t.cs126.m||null,cs126k:1})}catch(e){}return t}
function careRest126(k){return careDue76(k).filter(t=>!(t.cs126&&t.cs126.d===k&&t.due===k))}   // 캘린더 관리 블록은 따로 놓지 않은 차례만 셈
function pb126(t){if(!plOn126(t))return '';const k=t.cs126.d,td=tdK126();return ` <small class="pb126">📅 ${k===td?'오늘':k===addDays(td,1)?'내일':fmtD(k)}${t.cs126.m?' '+t.cs126.m:''}</small>`}
function snap126(t){return {due:t.due||null,cs:t.cs126?clone(t.cs126):null,dur:t.dur===undefined?undefined:t.dur}}
function restore126(t,s){if(!t||!s)return;t.due=s.due;if(s.cs)t.cs126=s.cs;else delete t.cs126;if(s.dur===undefined)delete t.dur;else t.dur=s.dur;saveTask(t)}
function place126(t,d,m){const was=plOn126(t),pd=was?(t.cs126.pd||null):(t.due||null);
  t.cs126={d,m:m||'',pd};t.due=d;t.dset72=Date.now();if(m&&!t.dur)t.dur=30;delete t.skull;saveTask(t)}
function unplace126(t){if(!t||!t.cs126)return;const c=t.cs126;if(c.d===t.due&&c.pd)t.due=c.pd;delete t.cs126;t.dset72=Date.now();saveTask(t)}   // 빼면 놓기 전 차례로

openTasks=(function(prev){return function(){const a=prev.apply(this,arguments);
  if(HIDE76!==2||!plAny126())return a;
  try{const have=new Set(a.map(t=>t.id)),p=HIDE76;HIDE76=0;let all;try{all=prev.apply(this,arguments)}finally{HIDE76=p}
    const ex=all.filter(t=>!have.has(t.id)&&plOn126(t));return ex.length?a.concat(ex):a}catch(e){console.error(e);return a}}})(openTasks);
tasksOn=(function(prev){return function(k){const a=prev.apply(this,arguments);try{return plAny126()?a.map(t=>mk126(t,k)):a}catch(e){return a}}})(tasksOn);
cchip=(function(prev){return function(t,k){return prev.call(this,mk126(t,k),k)}})(cchip);

/* 캘린더에서 끌어 놓기: 관리는 날짜를 옮기는 게 아니라 '이 차례를 이 날(·시각)로' */
dndEnd=(function(prev){return function(x,y){
  try{const kind=DND.kind,id=DND.id,drop=DND.drop,t=TASKS[id];
    if((kind==='task'||kind==='block')&&t&&isCare76(t)&&drop&&['time','allday','day','tray'].includes(drop.type)&&!(ui.msel&&ui.msel.size>1)){
      const has=plOn126(t);
      DND.drop=null;const r=prev.apply(this,arguments);
      if(drop.type==='tray'){if(has){const s=snap126(t);unplace126(t);toastAct(`🧽 ${t.title} · 놓은 자리를 뺐어요`,'되돌리기',()=>{restore126(t,s);render()});render()}return r}
      const nd=drop.date;if(!nd)return r;
      if(nd<tdK126()){toast('지난 날에는 놓을 수 없어요');return r}
      const tm=drop.type==='time'?hm(drop.min):'',s=snap126(t);
      place126(t,nd,tm);ui.calSel=nd;ui.calKeepScroll=true;
      toastAct(`🧽 ${t.title} → ${dueLabel(nd)}${tm?' '+tm:''} · 이 차례만 옮겼어요`,'되돌리기',()=>{restore126(t,s);render()});render();return r}}catch(e){console.error(e)}
  return prev.apply(this,arguments)}})(dndEnd);

/* ---- 놓기 창: 날짜(오늘·내일·모레·다른 날) · 시각(없어도 됨) · 길이 ---- */
let PL126=null;
function plSheet126(id,o){const t=TASKS[id];if(!t)return;o=o||{};const td=tdK126(),cur=plOn126(t)?t.cs126:null;
  if(!(PL126&&PL126.id===id&&o.keep))PL126={id,d:o.d||(cur?cur.d:(t.due&&t.due>td?t.due:td)),m:cur?cur.m:'',back:o.back||null,bk:o.bk||null};
  if(PL126.d<td)PL126.d=td;
  const P=PL126,dn=[['오늘',0],['내일',1],['모레',2]].map(([l,i])=>{const k=addDays(td,i);return `<button type="button" class="chipbtn" data-pl126d="${k}" aria-pressed="${P.d===k}">${l} <small>${esc(wdOf(k))}</small></button>`}).join('');
  const lens=[10,15,20,30,45,60,90,120],v=+t.dur||0;if(v&&!lens.includes(v)){lens.push(v);lens.sort((a,b)=>a-b)}
  sheetCtx={pl126:id};
  openSheet(`<div class="sh"><h3>📅 ${esc(t.title)}</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <p class="small muted" style="margin:0 0 8px">🧽 관리 · ${esc(repLabel(t.rep))} · ${esc(when76(t,td))} — 이 차례만 옮겨요</p>
    <div class="row pl126r" style="gap:6px;flex-wrap:wrap">${dn}<input type="date" data-pl126dv="1" value="${esc(P.d)}" min="${esc(td)}" aria-label="다른 날"></div>
    <div class="row pl126r" style="gap:6px;flex-wrap:wrap;margin-top:8px"><label class="small">시각 <input type="time" data-pl126t="1" value="${esc(P.m)}" aria-label="시각"></label>
      <button type="button" class="chipbtn" data-pl126t0="1" aria-pressed="${!P.m}">시각 없이 이 날</button>
      ${P.m?`<select data-pl126len="1" aria-label="길이">${v?'':'<option value="" selected>길이?</option>'}${lens.map(m=>`<option value="${m}"${m===v?' selected':''}>${m>=60&&m%60===0?m/60+'시간':m+'분'}</option>`).join('')}</select>`:''}</div>
    <div class="row pl126r" style="gap:8px;margin-top:12px"><button type="button" class="btn" data-pl126ok="1">${cur?'바꾸기':'놓기'}</button>${cur?'<button type="button" class="btn ghost" data-pl126off="1">배치 빼기</button>':''}</div>
    <p class="help" style="margin:8px 0 0">주기(${esc(repLabel(t.rep))})는 그대로예요. 하고 나면 그날부터 다시 세요. 빼면 원래 차례로 돌아가요.</p>`)}
function plBack126(){const b=PL126&&PL126.back,k=PL126&&PL126.bk;PL126=null;if(b==='care')careSheet76(k);else closeSheet()}
addEventListener('click',e=>{const T=e.target;if(!T||!T.closest)return;let b;
  if((b=T.closest('[data-pl126]'))){e.preventDefault();e.stopPropagation();const id=b.dataset.pl126,t=TASKS[id];if(!t)return;
    const bk=sheetCtx&&sheetCtx.c76;lastPt={x:e.clientX,y:e.clientY};plSheet126(id,bk?{back:'care',bk}:{});return}
  if(!(sheetCtx&&sheetCtx.pl126&&PL126))return;
  const stop=()=>{e.preventDefault();e.stopPropagation()},t=TASKS[PL126.id];
  if((b=T.closest('[data-pl126d]'))){stop();const tv=document.querySelector('#sheetC [data-pl126t]');if(tv)PL126.m=tv.value;PL126.d=b.dataset.pl126d;plSheet126(PL126.id,{keep:1});return}
  if((b=T.closest('[data-pl126t0]'))){stop();PL126.m='';plSheet126(PL126.id,{keep:1});return}
  if((b=T.closest('[data-pl126ok]'))){stop();if(!t)return;const tv=document.querySelector('#sheetC [data-pl126t]'),m=tv&&hm80(tv.value)!=null?tv.value:'',d=PL126.d,s=snap126(t);
    place126(t,d,m);const bk=PL126.back,k=PL126.bk;PL126=null;render();
    toastAct(`🧽 ${t.title} → ${dueLabel(d)}${m?' '+m:''}`,'되돌리기',()=>{restore126(t,s);render()});if(bk==='care')careSheet76(k);else closeSheet();return}
  if((b=T.closest('[data-pl126off]'))){stop();if(!t)return;const s=snap126(t);unplace126(t);const bk=PL126.back,k=PL126.bk;PL126=null;render();
    toastAct(`🧽 ${t.title} · 원래 차례로 돌렸어요`,'되돌리기',()=>{restore126(t,s);render()});if(bk==='care')careSheet76(k);else closeSheet();return}
},true);
addEventListener('change',e=>{const T=e.target;if(!T||!T.matches||!(sheetCtx&&sheetCtx.pl126&&PL126))return;
  if(T.matches('[data-pl126dv]')){e.stopPropagation();if(/^\d{4}-\d\d-\d\d$/.test(T.value)&&T.value>=tdK126()){const tv=document.querySelector('#sheetC [data-pl126t]');if(tv)PL126.m=tv.value;PL126.d=T.value;plSheet126(PL126.id,{keep:1})}return}
  if(T.matches('[data-pl126t]')){e.stopPropagation();PL126.m=hm80(T.value)!=null?T.value:'';plSheet126(PL126.id,{keep:1});return}
  if(T.matches('[data-pl126len]')){e.stopPropagation();const t=TASKS[PL126.id],v=+T.value;if(t&&v){t.dur=v;saveTask(t)}return}
},true);

/* ---- 관리 창: 줄마다 📅 · 설정은 접힘으로 ---- */
function slimCare126(){
  const sc=$('sheetC');if(!sc||!sc.querySelector('.c76l,.c76o'))return;
  sc.querySelectorAll('.c76r').forEach(r=>{const chk=r.querySelector('[data-tdone]');if(!chk||r.querySelector('[data-pl126]'))return;
    const t=TASKS[chk.dataset.tdone];if(!t||!isCare76(t))return;const on=plOn126(t),td=tdK126();
    const b=document.createElement('button');b.type='button';b.className='ib pl126'+(on?' on':'');b.setAttribute('data-pl126',t.id);
    b.textContent=on?'📅 '+(t.cs126.d===td?'오늘':t.cs126.d===addDays(td,1)?'내일':fmtD(t.cs126.d))+(t.cs126.m?' '+t.cs126.m:''):'📅';
    b.title=on?'놓은 자리 바꾸기·빼기':'날짜·시각 정하기 (이 차례만 옮겨요)';b.setAttribute('aria-label',(t.title||'')+' 날짜·시각 정하기');
    const mb=r.querySelector('[data-c76m]');if(mb)r.insertBefore(b,mb);else r.appendChild(b)});
  if(sc.querySelector('.set126'))return;
  const rows=[...sc.querySelectorAll('.c76o')],blk=rows.find(x=>x.querySelector('[data-c76blk]')),q=rows.find(x=>x.querySelector('[data-c76q]')),help=[...sc.querySelectorAll('p.help')].pop();
  if(!(blk||q||help))return;
  const d=document.createElement('details');d.className='set126';const s=document.createElement('summary');s.textContent='⚙ 캘린더 블록 · 일퀘 · 도움말';d.appendChild(s);
  [blk,q,help].forEach(x=>{if(x){x.removeAttribute('style');d.appendChild(x)}});
  const last=rows.filter(x=>x!==blk&&x!==q).pop();if(last)last.insertAdjacentElement('afterend',d);else sc.appendChild(d)}
careSheet76=(function(prev){return function(k){const r=prev.apply(this,arguments);try{slimCare126()}catch(e){console.error(e)}return r}})(careSheet76);

/* ⋯ 메뉴에 📅 */
function careMenu76(t,x,y){menu61(x,y,`🧽 ${esc(t.title.length>22?t.title.slice(0,22)+'…':t.title)}`,[
  {l:plOn126(t)?'📅 놓은 자리 바꾸기·빼기…':'📅 날짜·시각 정해 놓기…',f:()=>plSheet126(t.id,{back:sheetCtx&&sheetCtx.c76?'care':null,bk:sheetCtx&&sheetCtx.c76})},
  {l:'✎ 열기 (반복·점수 고치기)',f:()=>openTaskSheet(t.id)},
  {l:`↻ 주기 바꾸기 (지금 ${esc(repLabel(t.rep))})`,f:()=>cycleMenu77(t,x,y,n=>{t.rep=(n&&typeof n==='object')?clone(n):{f:'d',i:n};saveTask(t);render();toast(`'${t.title}' ${repLabel(t.rep)}`)})},
  {l:'⏭ 이번엔 건너뛰기 (다음 차례로)',dis:!(t.due&&t.due<=midKey68()),f:()=>skipToday61(t)},
  '-',{l:'🧽 관리에서 빼기 (할 일 목록으로)',f:()=>careToggle76(t)}])}

/* ---- 캘린더 서랍: 🧽 관리 탭 (끌어다 놓거나 눌러서 날짜·시각) ---- */
function tray126(){
  const el=$('calTray');if(!el||el.hidden)return;const tabs=[...el.querySelectorAll('[data-traytab]')];if(!tabs.length)return;
  if(!el.querySelector('[data-traytab="care"]')){const b=document.createElement('button');b.className='chipbtn';b.type='button';b.setAttribute('data-traytab','care');b.textContent='🧽 관리';tabs[tabs.length-1].after(b)}
  const cur=ui.trayTab||'nodate';el.querySelectorAll('[data-traytab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.traytab===cur)));
  if(cur!=='care')return;
  const q=(ui.trayQ||'').toLowerCase(),td=tdK126(),all=careAll76().filter(t=>!q||String(t.title).toLowerCase().includes(q))
    .sort((a,b)=>String(a.due||'9').localeCompare(String(b.due||'9'))||(a.order||0)-(b.order||0));
  const due=all.filter(t=>t.due&&t.due<=td),nx=all.filter(t=>!t.due||t.due>td);
  const row=t=>`<div class="titem care126" data-drag="task:${t.id}" data-dragmode="hold" data-pl126="${t.id}" role="button" tabindex="0" title="누르면 날짜·시각 정하기 · 끌어서 놓기"><span class="n">🧽 ${esc(t.title)}</span><span class="h">${t.dur?'⏱'+t.dur+'분 ':''}${plOn126(t)?esc(pb126(t).replace(/<[^>]+>/g,'').trim()):esc(when76(t,td))}</span></div>`;
  const head=(l,n)=>`<div class="tgh66"><span>${l}</span><span class="tiny muted">${n}</span></div>`;
  const box=el.querySelector('.trayl');if(!box)return;
  box.innerHTML=(all.length?(due.length?head('차례 · 오늘까지',due.length)+due.map(row).join(''):'')+(nx.length?head('다음 차례 · 미리 해도 돼요',nx.length)+nx.slice(0,60).map(row).join(''):''):`<div class="empty tiny">${careAll76().length?'찾는 관리가 없어요.':'아직 관리로 옮긴 게 없어요.'}</div>`);
  const ctl=el.querySelector('.tctl66');if(ctl)ctl.hidden=true;const tf=el.querySelector('.tf66');if(tf)tf.hidden=true;
  const cnt=[...el.children].find(n=>n.classList&&n.classList.contains('tiny')&&n.classList.contains('muted'));if(cnt)cnt.textContent=`${all.length}개 · 끌어서 시간표·날짜에 놓아요`}
renderTray=(function(prev){return function(){const x=prev.apply(this,arguments);try{tray126()}catch(e){console.error(e)}return x}})(renderTray);
addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target&&e.target.matches&&e.target.matches('.titem.care126')){e.preventDefault();e.target.click()}});

F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['🧽 관리 하나씩 놓기','내일 짜기 · 캘린더 서랍 🧽 관리 탭 · 관리 창','관리는 평소엔 목록·캘린더에서 빠져 있지만, 내일 짜기 🧽 관리 단계에서 칩을 골라 시간표에 놓거나, 캘린더 서랍 🧽 관리 탭에서 끌어다 놓거나, 관리 창 줄의 📅로 날짜·시각을 정하면 그 차례만 그 날로 옮겨져요. 주기는 그대로예요. 빼면 원래 차례로 돌아가요.'],
  ['⚔ 이번 주 용기 한 줄','홈 → 오늘의 일퀘 카드 맨 위','이번 주 용기 n/N과 보상, 이번 주 한 가지가 한 줄로 합쳐졌어요. 줄을 누르면 용기 카드를 골라 기록해요. 일퀘(하루)와 따로 세요.']])}})(F67);

/* 끝내면(또는 건너뛰면) 놓은 자리 표시는 지움 — due가 다음 차례로 넘어가 이미 효력이 없음 */
completeTask=(function(prev){return function(t){const had=!!(t&&t.cs126);const r=prev.apply(this,arguments);try{if(had&&t.cs126&&t.cs126.d!==t.due){delete t.cs126;saveTask(t)}}catch(e){}return r}})(completeTask);
