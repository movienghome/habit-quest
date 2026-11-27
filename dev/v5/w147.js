/* ================= v13.26 (w147): 11/27 저녁 사용자 요청 묶음 =================
   ① 방치 경보: 묶음 머리(예: 집 청소)는 껍데기 — 그 아래 관리 할 일을 하나라도 한 날이면 머리도 한 걸로 셈(HP 방치 벌점·경보판·⚠ 모두 watchTarget 한 길)
   ② 빠른 기록 묶기에 '좋음·나쁨 × 영역별' 합친 모드(C.pg144='both')
   ③ 카드 ℹ 창 📊 기록(달력·월 넘기기·통계)  ④ 🛟 사라진 것 찾기(카드·뽀모도로)
   모두 읽기 위주 — 점수 규칙은 안 바꿈. */
(function(){
/* ---------- ① 묶음 머리 방치 ---------- */
function desc147(id){const out=[],seen=new Set([id]),q=[id];
  while(q.length){const p=q.shift();Object.values(TASKS).forEach(k=>{if(k&&k.parent===p&&k.status!==-1&&!seen.has(k.id)){seen.add(k.id);out.push(k.id);q.push(k.id)}})}
  return out}
watchTarget=(function(prev){return function(id){const w=prev.apply(this,arguments);
  if(!w||typeof id!=='string'||id.slice(0,3)!=='@t:')return w;
  const ids=desc147(id.slice(3));if(!ids.length)return w;
  const d0=w.done;return Object.assign({},w,{done:day=>!!d0(day)||ids.some(k=>tDone60(k,day))})}})(watchTarget);
window.desc147=desc147;
})();

/* ================= ② HP 규칙 B(사용자 11/27 '추천대로 B') — 방치 경보 하루 상한 + 누적 배수 상한 낮추기 =================
   · 방치 경보: 하루에 깎는 합이 `C.nlcap147`(기본 20)을 넘으면 큰 것부터 채우고 나머지는 0(경보판·⚠ 표시는 그대로 — 점수만 줄임).
   · 누적 배수: 새로 기록하는 나쁜 행동의 배수 최대를 `C.mcap147`(기본 2)로(설정의 penalty.max가 더 낮으면 그대로). 이미 기록된 건 안 바뀜.
   · 새 규칙은 `C.f3from147`(처음 켜진 게임 날)부터 — 지난 날 HP는 옛 규칙 그대로. 계산식·설명은 HP 설명 창에 `how147`로 표시. */
(function(){
const on=date=>!!C.f3from147&&String(date)>=C.f3from147;
const nlCap=()=>Math.max(1,+C.nlcap147||20),mCap=()=>Math.max(1,+C.mcap147||2);
function init(){if(!ready72()||!C||C.f3from147)return;C.f3from147=gk76();save('config')}
render=(function(prev){return function(){const r=prev.apply(this,arguments);try{init()}catch(e){console.error(e)}return r}})(render);
neglectList=(function(prev){return function(date){const L=prev.apply(this,arguments);
  L.forEach(n=>{n.raw147=n.pen});
  if(!on(date))return L;
  let left=nlCap();[...L].sort((a,b)=>b.pen-a.pen).forEach(n=>{const u=Math.min(n.pen,left);n.pen=u;left-=u});
  return L}})(neglectList);
badMult=(function(prev){return function(a,date){const r=prev.apply(this,arguments);
  if(r&&on(date||curDay().date)&&r.mult>mCap())r.mult=mCap();return r}})(badMult);
window.how147=function(){const d=curDay(),k=d.date,P=C.penalty||{};
  let raw=0,app=0,items=0;try{neglectList(k).forEach(n=>{raw+=n.raw147!=null?n.raw147:n.pen;app+=n.pen;items++})}catch(e){}
  const mx=Math.min(+P.max||3,on(k)?mCap():99);
  const isOn=on(k);
  const row=(h,t)=>`<div><b>${h}</b><span>${t}</span></div>`;
  return `<div class="how146 how147"><p class="h146">점수 상한 · 누적 데미지${isOn?'':' (이 날은 옛 규칙)'}</p>`
   +row('🛡 방치 하루 상한',isOn?`방치 경보가 여러 개여도 하루에 최대 <b class="num">−${nlCap()}</b>까지만 깎아요(큰 것부터). 오늘 방치 ${items}건 <b class="num">${raw?'−'+raw:'0'}</b>${raw>app?` → 상한 적용 <b class="num">−${app}</b>`:' (상한 안쪽)'}. 경보 표시(⚠)는 그대로예요.`:`상한 없음 — 경보 점수를 전부 더했어요(오늘 <b class="num">−${raw}</b>).`)
   +row('🔥 누적 데미지',`나쁜 행동은 같은 행동을 <b>7일 안에 한 번 더 할 때마다 +${(+P.same||0)}배</b>, <b>어제까지 나쁜 날이 이어진 날마다 +${(+P.chain||0)}배</b>가 붙어요. 최대 <b class="num">×${mx}</b>${isOn?` (전에는 ×${+P.max||3})`:''}. 예) 기본 −12 행동이 ×${mx}이면 <b class="num">−${Math.round(12*mx)}</b>까지.`)
   +row('📅 적용 시점',C.f3from147?`${esc(fmtD(C.f3from147))}부터 새로 기록하는 나쁜 행동·그날 이후의 방치에 적용 — 이미 기록한 점수와 지난 날 HP는 안 바뀌어요.`:'곧 켜져요.')
   +row('✅ 좋은 행동',`누적 배수가 없어요. +점수 그대로 쌓여요.`)
   +`</div>`}
infoFor=(function(prev){return function(k){const r=prev.apply(this,arguments);
  try{if(r&&k==='hp'&&typeof r.b==='string'&&r.b.indexOf('how147')<0){
    r.b=r.b.replace(/(<div class="how146">[\s\S]*?<\/div><\/div>)/,'$1'+window.how147())}}catch(e){console.error(e)}
  return r}})(infoFor);
})();

/* ================= ③ 카드 ℹ 창 📊 기록·통계 (달력 · 달 넘기기 · 수치) — 읽기만, 새 데이터 없음 =================
   입구는 기존 그대로: 기록하기 행동 줄 ⋯ → ℹ 설명·통계(`openInfo('act:id')`) 맨 아래. 기록=`DAYS[날].entries` 중 `e.aid===카드`. */
(function(){
const AC={id:null,m:null};
const sg=v=>(v>0?'+':v<0?'−':'±')+Math.abs(Math.round(v));
const ent=(a,k)=>{const d=DAYS[k];return d?(d.entries||[]).filter(e=>e&&e.kind==='act'&&e.aid===a.id):[]};
function sum(a,keys){const o={n:0,days:0,cond:0,xp:0,gold:0,opt:{}};
  keys.forEach(k=>{const L=ent(a,k);if(!L.length)return;o.days++;L.forEach(e=>{const c=e.n||1;o.n+=c;o.cond+=e.cond||0;o.xp+=e.xp||0;o.gold+=e.gold||0;
    if(e.vid){const v=(a.opts||[]).find(x=>x.id===e.vid);const nm=v?v.name:'옵션';o.opt[nm]=(o.opt[nm]||0)+c}})});
  return o}
function monthKeys(mk){const out=[],first=mk+'-01';for(let i=0;i<31;i++){const k=addDays(first,i);if(k.slice(0,7)!==mk)break;out.push(k)}return out}
function prevM(mk){return addDays(mk+'-01',-1).slice(0,7)}
function nextM(mk){return addDays(mk+'-01',33).slice(0,7)}
function html(a,mk){
  const td=gk76(),keys=monthKeys(mk),S=sum(a,keys),P=sum(a,monthKeys(prevM(mk)));
  const first=mk+'-01',ws=weekStartD(first),nm=nextM(mk)+'-01';let cells='';
  for(let i=0;i<42;i++){const k=addDays(ws,i);if(i>=35&&k>=nm)break;const inm=k.slice(0,7)===mk,L=inm?ent(a,k):[];
    const c=L.reduce((t,e)=>t+(e.n||1),0),cd=L.reduce((t,e)=>t+(e.cond||0),0);
    const t=L.length?`${fmtD(k)} · ${c}번 · 컨디션 ${sg(cd)}`:fmtD(k);
    cells+=`<span class="rc132d${inm?'':' o'}${c?' ok':''}${k===td?' td':''}${k>td?' fu':''}" title="${esc(t)}">${+k.slice(8)}${c?`<i>${c>1?c:'✓'}</i>`:''}</span>`}
  let last=null,n=0,days=[];for(let i=0;i<400;i++){const k=addDays(td,-i);if(ent(a,k).length){if(!last)last=k;days.push(k)}}
  const gap=days.length>1?Math.round((diffDays(days[0],days[days.length-1]))/(days.length-1)*10)/10:null;
  const [yy,mm]=mk.split('-');const bad=a.type==='bad';
  const row=(l,v)=>`<div class="r146"><span class="n146">${l}</span><span></span><b class="v146 num">${v}</b></div>`;
  const opts=Object.keys(S.opt).map(k=>`${esc(k)} ${S.opt[k]}번`).join(' · ');
  return `<div class="rc132h"><button type="button" class="ib" data-ac147="-1" aria-label="이전 달">‹</button><b>${+yy}년 ${+mm}월</b><button type="button" class="ib" data-ac147="1" aria-label="다음 달"${mk>=td.slice(0,7)?' disabled':''}>›</button></div>
   <div class="rc132g">${WKH71().map(d=>`<span class="rc132w">${d}</span>`).join('')}${cells}</div>
   <div class="wb146">
   ${row('이번 달 한 횟수',S.n+'번 ('+S.days+'일)')}${row('지난 달',P.n+'번 ('+P.days+'일)')}
   ${row('이 달 컨디션',sg(S.cond))}${row('이 달 점수 합',`✨${sg(S.xp)} · 💰${sg(S.gold)}`)}
   ${row('마지막',last?fmtD(last)+' ('+diffDays(td,last)+'일 전)':'기록 없음')}${row('평균 간격(최근 400일)',gap==null?'—':gap+'일')}
   ${opts?`<div class="tiny muted">옵션별 ${opts}</div>`:''}
   <div class="tiny muted">${bad?'나쁜 행동은 누적 배수가 붙은 점수예요. ':''}기록 줄 눌러서 보는 건 홈·기록하기에서 해요.</div></div>`}
function build(id){const a=(C.actions||[]).find(x=>x.id===id);if(!a)return '';
  if(AC.id!==id){AC.id=id;AC.m=gk76().slice(0,7)}
  return `<details class="ac147" open><summary>📊 기록 · 통계</summary><div class="ac147b rc132" data-aid147="${esc(id)}">${html(a,AC.m)}</div></details>`}
infoFor=(function(prev){return function(k){const r=prev.apply(this,arguments);
  try{if(r&&typeof k==='string'&&k.slice(0,4)==='act:'&&typeof r.b==='string'&&r.b.indexOf('ac147')<0){AC.id=null;r.b+=build(k.slice(4))}}catch(e){console.error(e)}
  return r}})(infoFor);
addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('[data-ac147]');if(!b)return;
  e.preventDefault();e.stopPropagation();const box=b.closest('.ac147b');if(!box)return;
  const a=(C.actions||[]).find(x=>x.id===box.dataset.aid147);if(!a)return;
  const nx=+b.dataset.ac147>0?nextM(AC.m):prevM(AC.m);if(nx>gk76().slice(0,7))return;AC.m=nx;box.innerHTML=html(a,AC.m)},true);
})();

/* ================= ④ 🛟 사라진 것 찾기 — 더보기 → 계정·백업 아래 '📋 진단 복사' 줄에 단추 하나 =================
   기록(DAYS)에는 남았는데 카드·뽀모도로 줄·루틴 프리셋이 없는 것만 찾아 보여 주고, 누를 때만 되살려요(자동 아님).
   지운 카드 묘비(C.delA, tombHas98)에 있는 건 일부러 지운 것이라 건드리지 않아요. */
(function(){
const PRE=[
 {id:'r-eos',name:'🌅 Eos · 해 뜰 때 나가기',xp:25,gold:10,area:'body',steps:[['s1','옷 입고 문 밖으로',5,''],['s2','해 보며 걷기',20,'g2'],['s3','돌아와 물 한 잔',2,'']]},
 {id:'r-vesper',name:'🌇 Vesper · 해 질 때 나가기',xp:25,gold:10,area:'mind',steps:[['s1','문 밖으로',5,''],['s2','노을 보며 걷기',25,'g2'],['s3','오늘 한 줄 정리',5,'']]}];
const POM=/^🍅\s*(.+?)\s+(\d+)분$/;
function scan(){
  const have=new Set((C.actions||[]).map(a=>a.id)),cards={},pom={};
  Object.keys(DAYS||{}).sort().forEach(k=>{(DAYS[k].entries||[]).forEach(e=>{if(!e)return;
    if(e.kind==='act'&&e.aid&&!have.has(e.aid)&&!tombHas98(e.aid,e.name)){const c=cards[e.aid]=cards[e.aid]||{id:e.aid,n:0,last:k};c.n++;c.last=k;c.name=e.name;c.type=e.type||'good';c.area=e.area||'';c.xp=Math.abs(e.xp||0);c.gold=Math.abs(e.gold||0);c.cond=Math.abs(e.cond||0)}
    if(e.kind==='jar'&&typeof e.note==='string'){const m=POM.exec(e.note);if(m){const key=k+'|'+m[1];(pom[key]=pom[key]||{d:k,k:m[1],min:+m[2],n:0}).n++}}})});
  const log=(C.pomo88&&C.pomo88.log)||[],lim=addDays(gk76(),-400),P=[];
  Object.values(pom).forEach(p=>{if(p.d<lim)return;const h=log.filter(r=>r.d===p.d&&r.k===p.k&&r.f===1).length;if(p.n>h)P.push({d:p.d,k:p.k,min:p.min,miss:p.n-h})});
  const R=PRE.filter(r=>!(C.routines||[]).some(x=>x.id===r.id));
  return {cards:Object.values(cards),pom:P.sort((a,b)=>a.d<b.d?-1:1),routines:R}}
function body(){
  const S=scan(),aName=id=>((C.areas||[]).find(a=>a.id===id)||{}).name||id;let h='';
  const sec=(t,rows)=>rows?`<div class="r147"><b>${t}</b>${rows}</div>`:'';
  const row=(txt,attr)=>`<div class="rr147"><span>${txt}</span><button type="button" class="chipbtn" ${attr}>되살리기</button></div>`;
  h+=sec('🃏 기록은 있는데 카드가 없는 것',S.cards.map(c=>row(`${esc(c.name)} · ${esc(aName(c.area))} · ✨${c.xp} 💰${c.gold} 컨디션 ${c.cond} <span class="tiny muted">(기록 ${c.n}번, 마지막 ${fmtD(c.last)} 값으로 짐작)</span>`,`data-rs147="card" data-id="${esc(c.id)}"`)).join(''));
  h+=sec('🍅 구슬은 있는데 뽀모도로 줄이 없는 것',S.pom.length?S.pom.map(p=>row(`${fmtD(p.d)} · ${esc(p.k)} ${p.min}분 × ${p.miss}`,`data-rs147="pom" data-d="${esc(p.d)}" data-k="${esc(p.k)}" data-min="${p.min}" data-n="${p.miss}"`)).join(''):'');
  h+=sec('🌅 없어진 루틴 프리셋',S.routines.map(r=>row(esc(r.name),`data-rs147="routine" data-id="${r.id}"`)).join(''));
  if(!h)h='<p>✓ 찾을 게 없어요. 기록에 남은 카드·뽀모도로·프리셋이 모두 제자리에 있어요.</p>';
  return h+'<p class="tiny muted">누른 것만 되살려요(자동 아님). 일부러 지운 카드는 찾지 않아요. 이 기기가 불러온 날의 기록만 살펴봐요.</p>'}
infoFor=(function(prev){return function(k){if(k==='rescue147')return {kind:'🛟 도구',t:'사라진 것 찾기',b:`<div class="rs147">${body()}</div>`};return prev.apply(this,arguments)}})(infoFor);
function again(){const p=lastPt;openInfo('rescue147');lastPt=p}
addEventListener('click',e=>{const t=e.target&&e.target.closest&&e.target.closest('#rs147,[data-rs147]');if(!t)return;e.preventDefault();e.stopPropagation();
  if(t.id==='rs147'){lastPt={x:innerWidth/2,y:innerHeight/2};openInfo('rescue147');return}
  const w=t.dataset.rs147;
  if(w==='card'){const c=scan().cards.find(x=>x.id===t.dataset.id);if(!c)return;
    C.actions.push({id:c.id,name:c.name,type:c.type,area:c.area,cond:c.type==='bad'?-c.cond:c.cond,gold:c.type==='bad'?-c.gold:c.gold,xp:c.type==='bad'?-c.xp:c.xp,marble:''});toast('🃏 '+c.name+' 되살렸어요')}
  else if(w==='pom'){const c=pset88(),n=+t.dataset.n||1;for(let i=0;i<n;i++)c.log.push({id:'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),d:t.dataset.d,k:t.dataset.k,s:(+t.dataset.min||25)*60,f:1,m:1});toast('🍅 뽀모도로 줄 '+n+'개 되살렸어요')}
  else if(w==='routine'){const r=PRE.find(x=>x.id===t.dataset.id);if(!r)return;C.routines=C.routines||[];
    const has=id=>(C.actions||[]).some(a=>a.id===id)?id:'',limen=((C.lists||[]).find(l=>/limen/i.test(String(l.name||'')))||{}).id;
    const o={id:r.id,name:r.name,xp:r.xp,gold:r.gold,area:r.area,steps:r.steps.map(([id,name,min,aid])=>({id,name,min,aid:aid?has(aid):''}))};if(limen)o.list=limen;
    C.routines.push(o);toast('🌅 '+r.name.slice(0,12)+' 되살렸어요')}
  save('config');try{render()}catch(er){console.error(er)}again()},true);
render=(function(prev){return function(){const r=prev.apply(this,arguments);
  try{const d=document.getElementById('diag141');if(d&&!document.getElementById('rs147')){const b=document.createElement('button');b.type='button';b.id='rs147';b.className='chipbtn';b.textContent='🛟 사라진 것 찾기';b.setAttribute('aria-label','사라진 카드·뽀모도로·루틴 프리셋 찾기');d.after(b)}}catch(e){console.error(e)}
  return r}})(render);
})();
