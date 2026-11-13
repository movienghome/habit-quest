/* ================= v9.9: 지운 카드 되살아남 막기(묘비 C.delA) · D8 경보판 연쇄 창 · D9 용기 고르기 · D10 홈 오늘 타임라인 =================
   1) 지운 카드가 되살아나는 길은 둘이었어요 — ① 기본 카드를 심는 코드(dopaMig·mealEnsure77: 이름·id로 '없으면 다시 넣기') ② 합치기(mergeIds69: 내 기기 사본이 기준과 다르면 '내가 고친 것'으로 보고 살림).
      둘 다 '지웠다는 기록'이 없어서 막을 수 없었음 → 카드를 지울 때 묘비 `C.delA=[{id,n?,at}]`(n=기본 카드 이름)를 남기고,
      렌더 앞뒤로 purge98이 묘비 있는 카드를 다시 지움(어느 길로 되살아나든 한 번에 막음 · 묘비는 기기끼리 합쳐져 번지고 · 되돌리기는 묘비도 되돌림).
      mealEnsure77은 묘비 있는 기본 카드를 다시 안 넣음. 한 번짜리 정리 `C.mig98` = 사용자가 안 쓰기로 한 기본 카드 4개(영화 리뷰·시트콤·화면 없이 먹기·소리 끄고 창밖 보기).
   2) D8 경보판 '나쁜 날 n일째' → 눌러서 창: 어느 날 어떤 나쁜 행동 · 지금 붙는 페널티 · 흐름 끊기 보상 · 바로 할 것.
   3) D9 '지금 하면 좋은 것'의 '용기 칸 열기' → '용기 고르기'(⚔️ 붙은 할 일·카드를 그 자리에서 골라 기록).
   4) D10 홈 '오늘 한 일' = 오늘 타임라인: 식사 칸(채소 등) 횟수를 누를 때마다 시각을 남겨(day.ft98) 두 번째부터도 줄로 보임 + 5개 제한 대신 8개+더 보기. */

/* ---- 1) 지운 카드 묘비 ---- */
var SEED98=/^(dq|dm77)/,
  ONCE98=[['dm77b','영화 리뷰·인터뷰 영상 한 편만'],['dm77c','시트콤·예능 한 편 (끝나면 끄기)'],['dm77d','화면 없이 천천히 먹기'],['','소리 끄고 창밖 보기']];
function tombs98(){return Array.isArray(C.delA)?C.delA:[]}
function tombHas98(id,n){return tombs98().some(t=>t&&(t.id===id||(n&&t.n===n)))}
function tombAdd98(list){
  if(!Array.isArray(C.delA))C.delA=[];const have=new Set(C.delA.map(t=>t&&t.id));
  list.forEach(([id,n])=>{if(!id||have.has(id))return;have.add(id);const t={id,at:Date.now()};if(n)t.n=n;C.delA.push(t)});
  if(C.delA.length>300)C.delA=C.delA.slice(-300)}
// 카드 지우기(되돌리기 가능) — v5l 것을 다시 선언: 묘비를 남기고, 되돌리면 묘비도 되돌림
function delActs(ids){
  ids=new Set(ids);if(!ids.size)return;
  const snap={actions:clone(C.actions),watches:clone(C.watches),dailies:clone(C.dailies),delA:clone(C.delA||[])};
  const gone=C.actions.filter(a=>ids.has(a.id)),names=gone.map(a=>a.name);
  tombAdd98(gone.map(a=>[a.id,SEED98.test(String(a.id))?a.name:'']));
  C.actions=C.actions.filter(a=>!ids.has(a.id));
  const left=new Set([...C.actions.map(x=>x.id),...C.courage.map(x=>x.id)]);
  C.watches=C.watches.filter(w=>w.action==='@courage'||left.has(w.action));
  syncDailies(C);if(ui.ae&&ui.ae.sel)ui.ae.sel=ui.ae.sel.filter(id=>!ids.has(id));
  save('config');render();
  toastAct(names.length===1?`'${names[0]}' 지웠어요`:`${names.length}개 지웠어요`,'되돌리기',()=>{Object.assign(C,snap);syncDailies(C);save('config');render();toast('되돌렸어요')});
}
// 🍽 식사 친구 기본 카드 심기 — w77 것을 다시 선언: 묘비 있는 카드는 다시 안 넣음
function mealEnsure77(){if(!Array.isArray(C.dopaCourses)||!C.dopaCourses.length)C.dopaCourses=dopaC().map(([id,name,desc])=>({id,name,desc}));
  if(C.dopaCourses.some(c=>c.id==='meal'))return [];
  const i=C.dopaCourses.findIndex(c=>c.id==='dessert');C.dopaCourses.splice(i<0?C.dopaCourses.length:i,0,{id:'meal',name:'🍽 식사 친구',desc:'밥 먹을 때 곁들이는 것 · 끝이 있는 한 편'});
  const added=[],at=C.actions.findIndex(a=>a.type==='bad');let k=at<0?C.actions.length:at;const ar=C.areas.some(x=>x.id==='mind')?'mind':(C.areas[0]||{}).id;
  MEAL77.forEach(([n,min],j)=>{const id='dm77'+'abcd'[j];if(C.actions.some(a=>a.name===n||a.id===id)||tombHas98(id,n))return;   // 정해진 id: 두 기기가 같이 돌아도 두 배가 안 됨 · 지운 건 안 넣음
    C.actions.splice(k++,0,{id,name:n,type:'good',area:ar,cond:1,gold:0,xp:2,marble:'',dur:min,dopa:'meal',dopaOnly:1,effort:'quick'});added.push(id)});
  return added}
// 묘비 있는 카드 지우기 + 한 번짜리 정리. 지운 게 있으면 개수를 돌려줌
function purge98(){
  if(!ready72()||!Array.isArray(C.actions))return 0;
  let dirty=false,first=false;
  if(!C.mig98){C.mig98=1;first=true;dirty=true;tombAdd98(ONCE98.map(([id,n])=>[id||('nm98:'+n),n]))}
  const T=tombs98();let n=0;
  if(T.length){const ids=new Set(T.map(t=>t&&t.id)),nms=new Set(T.filter(t=>t&&t.n).map(t=>t.n));
    const gone=C.actions.filter(a=>a&&(ids.has(a.id)||(SEED98.test(String(a.id))&&nms.has(a.name))));
    if(gone.length){const g=new Set(gone.map(a=>a.id));C.actions=C.actions.filter(a=>!g.has(a.id));
      const left=new Set([...C.actions.map(x=>x.id),...(C.courage||[]).map(x=>x.id)]);
      C.watches=(C.watches||[]).filter(w=>w.action==='@courage'||left.has(w.action));syncDailies(C);n=gone.length;dirty=true}}
  if(dirty)save('config');
  if(first&&n)setTimeout(()=>{try{toast(`안 쓰기로 한 기본 카드 ${n}개를 정리했어요 · 다시 안 생겨요`)}catch(e){}},900);
  return n}
// 기본 카드 심기(5.7 도파민 메뉴)가 돈 직후에도 묘비 확인
try{dopaMig=(function(prev){return function(){const r=prev.apply(this,arguments);try{purge98()}catch(e){console.error(e)}return r}})(dopaMig)}catch(e){console.error(e)}

/* ---- 2) D8 경보판 '나쁜 날 n일째' ---- */
function chainInfo98(){
  const t=dateKey(),P0=C.penalty||{},ch=C.chain||{xp:15,gold:10},L=badChainNow(),days=[];
  for(let i=0;i<=14;i++){const k=addDays(t,-i);if(badDay(k))days.push(k);else if(i>0)break}
  let before=0;for(let i=1;i<=14;i++){if(badDay(addDays(t,-i)))before++;else break}
  const k=Math.min(L,7);
  return {t,L,days,todayBad:badDay(t),before,P0,ch,k,xp:(+ch.xp||0)*k,gold:(+ch.gold||0)*k,mult0:Math.min(+P0.max||3,1+(+P0.chain||0)*before)}}
// 추천이 모자랄 때(오늘 이미 다 했거나 없을 때) 빨리 끝나는 좋은 카드로 채움 — 창에서 바로 고르게
function fill98(have,n){if(n<=0)return [];const day=today(),ids=new Set(have.map(s=>s.act));
  return C.actions.filter(a=>a.type==='good'&&!a.once&&!a.doneAt&&!a.dopaOnly&&!a.brave&&!ids.has(a.id)&&!actionDoneOn(day,a.id)&&!needsSheet(a))
    .sort((x,y)=>(((+x.dur||99)<=10?0:1)-((+y.dur||99)<=10?0:1))||(Math.abs(+y.cond||0)-Math.abs(+x.cond||0)))
    .slice(0,n).map(a=>({act:a.id,label:a.name,why:`+${a.xp||0} XP${a.dur?' · '+a.dur+'분':''}`}))}
function chainSheet98(){
  const I=chainInfo98();
  if(I.L<1){toast('지금은 이어지는 나쁜 날이 없어요');return}
  const fx=e=>{const ar=C.areas.find(a=>a.id===e.area);return [e.t||'',e.cond?(ar?ar.name+' ':'')+(e.cond>0?'+':'−')+Math.abs(e.cond):'',e.mult?'×'+e.mult:''].filter(Boolean).join(' · ')};
  const why=I.days.map(k=>{const es=((DAYS[k]&&DAYS[k].entries)||[]).filter(e=>e.kind==='act'&&e.type==='bad');
    return `<div class="c98d"><b>${esc(dayName68(k))}${k===I.t?' · 오늘':''}</b>${es.map(e=>`<span class="c98e"><span>▼ ${esc(e.name)}</span><small>${esc(fx(e))}</small></span>`).join('')}</div>`}).join('');
  const sg0=(typeof suggestions==='function'?suggestions():[]).filter(s=>s.act).slice(0,3),sg=sg0.concat(fill98(sg0,3-sg0.length));
  const rows=sg.map(s=>`<div class="c98r"><button type="button" class="c98k" data-c98a="${esc(s.act)}" aria-label="${esc(s.label)} 했어요 기록"></button><span class="c98t"><b>${esc(s.label)}</b><small>${esc(s.why)}</small></span></div>`).join('');
  const when=I.todayBad?'오늘은 이미 나쁜 날로 셌어요. <b>내일</b> 깨끗하게 보내면 <b>모레</b>':'<b>오늘</b> 깨끗하게 보내면 <b>내일</b>';
  sheetCtx={c98:1};
  openSheet(`<div class="sh"><h3>⛓ 나쁜 날 ${I.L}일째</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <div class="c76g">왜 나쁜 날인가요?</div>
    <p class="small muted" style="margin:0">나쁜 행동(▼) 기록이 하나라도 있으면 그날은 나쁜 날이에요. 이어진 날들:</p>${why}
    <div class="c76g">붙는 페널티</div>
    <p class="small" style="margin:0">지금 나쁜 행동을 또 기록하면 점수가 <b>×${I.mult0}</b>로 깎여요.<br><span class="muted">나쁜 날 이어진 하루마다 +${+I.P0.chain||0} · 같은 행동을 7일 안에 또 하면 한 번마다 +${+I.P0.same||0} · 최대 ×${+I.P0.max||3}</span></p>
    <div class="c76g">끊으면 받는 보상</div>
    <p class="small" style="margin:0">${when} <b>'흐름 끊기'</b>로 <b>+${I.xp} XP · ${gtx(I.gold)}</b>(연쇄 ${I.k}일치)와 이겨냈다 구슬이 와요.<br><span class="muted">깨끗한 날 = 나쁜 행동 기록도, 식사 칸의 나쁜 항목(−)도 없고 기록이 하나라도 있는 날</span></p>
    <div class="c76g">지금 할 수 있는 것 <small class="muted">· 하나만 기록해도 깨끗한 날에 가까워져요</small></div>
    ${rows||'<p class="small muted" style="margin:0">추천할 게 지금은 없어요.</p>'}
    <div class="row" style="gap:6px;margin-top:8px"><button type="button" class="btn sm" data-c98brave="1">⚔️ 용기 고르기</button><a class="btn ghost sm" href="#tasks" data-sheet="close">📋 오늘 할 일</a></div>`)}
function deco98a(){
  const ul=$('alerts');if(!ul)return;
  ul.querySelectorAll('li').forEach(li=>{const ic=li.querySelector('.ic');if(!ic||!/⛓/.test(ic.textContent)||li.dataset.chain98)return;
    const I=chainInfo98();if(I.L<1)return;li.dataset.chain98='1';li.setAttribute('role','button');li.tabIndex=0;li.classList.add('a98');li.title='왜 나쁜 날인지 · 페널티 · 보상 · 바로 할 것';
    const sp=ic.nextElementSibling;if(sp)sp.textContent=`나쁜 날이 ${I.L}일째 이어져요. ${I.todayBad?'내일 깨끗하게 보내면 모레':'오늘 깨끗하게 보내면 내일'} '흐름 끊기' 보상 +${I.xp} XP › 눌러서 자세히`})}

/* ---- 3) D9 용기 고르기 ---- */
function bravePick98(){
  try{if(!$('pop').hidden)closeInfo()}catch(e){}
  const md=midKey68(),day=today(),ws=weekState(dateKey()),tk=[];
  Object.values(TASKS).forEach(t=>{if(!t||t.status!==0||t.rid||t.rstep||t.cb76||t.ml80||hid76(t))return;
    const a=t.aid&&C.actions.find(x=>x.id===t.aid),sz=t.brave?(C.courageSizes.find(z=>z.id===t.bsz71)||null):(a&&a.brave?braveSize(a):null);
    if(!t.brave&&!(a&&a.brave))return;
    const d=t.due||'',rank=!d?2:d<md?0:d===md?1:3;tk.push({t,rank,d,sz})});
  tk.sort((x,y)=>x.rank-y.rank||String(x.d).localeCompare(String(y.d)));
  const due=x=>x.rank===0?'지남':x.rank===1?'오늘':x.d?dayName68(x.d):'';
  const trows=tk.slice(0,8).map(x=>`<div class="c98r"><button type="button" class="c98k br" data-c98t="${esc(x.t.id)}" aria-label="${esc(x.t.title)} 했어요"></button><span class="c98t"><b>⚔️${x.sz?' <small>'+esc(x.sz.name)+'</small>':''} ${esc(x.t.title)}</b><small>${esc([due(x),x.t.aid?'🃏 카드 이은 할 일':''].filter(Boolean).join(' · '))}</small></span></div>`).join('');
  const cards=C.actions.filter(a=>a.type==='good'&&a.brave&&!a.doneAt).map(a=>({a,n:(day.entries||[]).filter(e=>e.kind==='act'&&e.aid===a.id).length}));
  cards.sort((x,y)=>(x.n?1:0)-(y.n?1:0));
  const crows=cards.slice(0,10).map(({a,n})=>{const z=braveSize(a);return `<div class="c98r"><button type="button" class="c98k br${n?' on':''}" data-c98a="${esc(a.id)}" aria-label="${esc(a.name)} 했어요 기록">${n?(n>1?n:'✓'):''}</button><span class="c98t"><b>⚔️${z?' <small>'+esc(z.name)+'</small>':''} ${esc(a.name)}</b><small>${esc((C.areas.find(x=>x.id===a.area)||{}).name||'')}${n?' · 오늘 '+n+'번':''}</small></span></div>`}).join('');
  const old=(C.courage||[]).map(k=>`<div class="c98r"><button type="button" class="c98k br" data-c98a="${esc(k.id)}" aria-label="${esc(k.name)} 기록"></button><span class="c98t"><b>⚡ ${esc(k.name)}</b><small>용기 버튼</small></span></div>`).join('');
  sheetCtx={c98:1};
  openSheet(`<div class="sh"><h3>⚔️ 용기 고르기</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <p class="small muted" style="margin:0">${ws.goal?`이번 주 ⚡ <b>${ws.brave}/${ws.goal}</b> · `:''}용기 표시(⚔️)가 붙은 것만 모았어요. 누르면 바로 기록돼요.</p>
    ${trows?`<div class="c76g">⚔️ 용기 붙은 할 일 <small class="muted">${tk.length}개</small></div>${trows}`:''}
    ${crows?`<div class="c76g">⚔️ 용기 카드 <small class="muted">${cards.length}개</small></div>${crows}`:''}
    ${old?`<div class="c76g">용기 버튼</div>${old}`:''}
    ${!trows&&!crows&&!old?'<div class="empty">용기 표시가 붙은 게 아직 없어요. 할 일 상세의 ⚔️ 칩이나 카드 편집의 ⚔ 칩으로 붙여요.</div>':''}
    <div class="row" style="margin-top:8px"><button type="button" class="btn ghost sm" data-c98go="1">기록하기의 ⚔️ 용기 칸 ›</button></div>`)}
function rec98(id){closeSheet();ui.off=0;
  if(String(id).startsWith('@t:')){const t=TASKS[String(id).slice(3)];if(t)completeTask(t);return}   // 추천이 할 일일 때
  const x=C.actions.find(y=>y.id===id),k=(C.courage||[]).find(y=>y.id===id);if(x)doAction(x);else if(k)doBrave(k)}
function deco98s(){document.querySelectorAll('#sugg [data-sugbrave] .go').forEach(el=>{el.textContent='용기 고르기'})}

/* ---- 4) D10 홈 '오늘 한 일' = 오늘 타임라인 ---- */
normDay=(function(prev){return function(k,raw){const d=prev.apply(this,arguments);try{if(raw&&Array.isArray(raw.ft98))d.ft98=clone(raw.ft98)}catch(e){}return d}})(normDay);
var LOGALL98=false,LOGCAP98=8;
function ft98Watch(id,date,before){setTimeout(()=>{try{
  const day=dayOf(date),diff=(+((day.food||{})[id]||0))-before;if(!diff)return;
  if(!Array.isArray(day.ft98))day.ft98=[];
  if(diff>0){for(let i=0;i<diff;i++)day.ft98.push({id:uid(),f:id,t:stamp()})}
  else{let n=-diff;for(let i=day.ft98.length-1;i>=0&&n>0;i--){if(day.ft98[i].f===id){day.ft98.splice(i,1);n--}}}
  save(date);homeLog98()}catch(e){console.error(e)}},0)}
function homeLog98(){
  const ul=$('homeLog');if(!ul||curView()!=='home')return;const day=curDay();
  const taps=(Array.isArray(day.ft98)?day.ft98:[]).filter(x=>x&&C.food.some(f=>f.id===x.f)),tapF=new Set(taps.map(x=>x.f)),items=[];
  (day.entries||[]).forEach((e,i)=>{
    if(e.kind==='quest'){const q=C.dailies.find(x=>x.id===e.qid);if(q&&String(q.action||'').startsWith('@food:')&&tapF.has(String(q.action).slice(6)))return}   // 식사 칸 일퀘 자동 줄은 횟수 줄로 대신 보임
    items.push({t:e.t||'',o:i,tap:0,h:logRow(day.date,e)})});
  const cnt={},seen={};taps.forEach(x=>{cnt[x.f]=(cnt[x.f]||0)+1});
  taps.forEach((x,i)=>{const f=C.food.find(y=>y.id===x.f),ar=C.areas.find(a=>a.id===f.area),neg=f.points<0;seen[x.f]=(seen[x.f]||0)+1;
    const nth=f.kind==='check'||cnt[x.f]<2?'':` <span class="tiny muted">${seen[x.f]}번째</span>`;
    items.push({t:x.t||'',o:i,tap:1,h:`<li class="ft98"><span class="num muted">${esc(x.t||'')}</span><span class="mk ${neg?'bad':'good'}">${neg?'▼':'🍽'}</span><span>${esc(f.name)}${nth}</span><span class="num muted tiny">${esc((ar?ar.name+' ':'')+(neg?'−':'+')+Math.abs(f.points))}</span><span class="tiny muted" style="text-align:center">식사</span></li>`})});
  if(!items.length)return;                                   // 비었을 땐 원래 안내 글 그대로
  items.sort((a,b)=>String(b.t).localeCompare(String(a.t))||(a.tap-b.tap)||(a.tap?b.o-a.o:a.o-b.o));   // 같은 분이면 기록 줄 먼저 · 같은 종류 안에선 최근 것이 위
  const show=LOGALL98?items:items.slice(0,LOGCAP98),more=items.length-LOGCAP98;
  ul.innerHTML=show.map(x=>x.h).join('')+(more>0?`<li class="more98"><button type="button" data-c98more="1">${LOGALL98?'접기':'＋ '+more+'개 더 보기'}</button></li>`:'')}
addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('[data-food]');if(!b)return;const d=curDay();ft98Watch(b.dataset.food,d.date,+((d.food||{})[b.dataset.food]||0))},true);
addEventListener('change',e=>{const b=e.target&&e.target.closest&&e.target.closest('[data-foodcheck]');if(!b)return;const d=curDay(),id=b.dataset.foodcheck;ft98Watch(id,d.date,+((d.food||{})[id]||0))},true);   // 바뀌기 전 값(기본 처리가 이 뒤에 값을 바꿈)

/* ---- 연결: 클릭 · 렌더 뒤 다듬기 ---- */
addEventListener('click',e=>{const T=e.target;if(!T||!T.closest)return;let b;
  if((b=T.closest('[data-chain98]'))){e.preventDefault();e.stopPropagation();chainSheet98();return}
  if((b=T.closest('[data-c98a]'))){e.preventDefault();e.stopPropagation();rec98(b.dataset.c98a);return}
  if((b=T.closest('[data-c98t]'))){e.preventDefault();e.stopPropagation();const t=TASKS[b.dataset.c98t];closeSheet();if(t)completeTask(t);return}
  if((b=T.closest('[data-c98brave]'))||(b=T.closest('[data-sugbrave]'))){e.preventDefault();e.stopPropagation();closeSheet();bravePick98();return}
  if((b=T.closest('[data-c98go]'))){e.preventDefault();e.stopPropagation();closeSheet();goBrave();return}
  if((b=T.closest('[data-c98more]'))){e.preventDefault();e.stopPropagation();LOGALL98=!LOGALL98;homeLog98();return}
},true);
addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target&&e.target.matches&&e.target.matches('li[data-chain98]')){e.preventDefault();chainSheet98()}},true);
render=(function(prev){return function(){try{purge98()}catch(e){console.error(e)}const r=prev.apply(this,arguments);
  try{if(purge98())setTimeout(render,0)}catch(e){console.error(e)}
  try{deco98a();deco98s();homeLog98()}catch(e){console.error(e)}return r}})(render);
F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['⛓ 나쁜 날 n일째 창','홈 경보판 ⛓ 줄을 눌러요','왜 나쁜 날인지(날짜별 나쁜 행동) · 지금 붙는 페널티 배수 · 흐름 끊기 보상 · 바로 기록할 것',()=>{chainSheet98()},'경보판 나쁜 날 연쇄 페널티 흐름 끊기 보상'],
  ['⚔️ 용기 고르기','홈 지금 하면 좋은 것 → 용기 고르기','⚔️ 용기 표시가 붙은 할 일·카드를 한 창에서 골라 바로 기록',()=>{bravePick98()},'용기 칸 용기 칩 용기 할 일 고르기'],
  ['🍽 오늘 타임라인','홈 오늘 한 일','식사 칸 횟수(채소 등)도 누른 시각대로 줄이 생기고, 8개 넘으면 ＋ 더 보기',()=>{location.hash='home'},'오늘 한 일 타임라인 식사 채소 두 번째']])}})(F67);
