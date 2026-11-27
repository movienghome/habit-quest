/* ================= v13.19 (w144): 11/26 밤 요청 — 칩 보이기·숨기기 · 내일 목록에 놓은 칩 · 루틴 블록 매일 · '오늘 한 단계' 줄 빼기 · 홈 끝냄 칩 =================
   ① 캘린더 보이기·숨기기 '종류'에 🏷 칩(주 N회) 항목: 주 N회 할 일(칩 줄·날짜에 놓은 칩·기본 자리)은 **이 항목 하나로만** 보이고 숨음(목록·영역·태그 거르기를 안 탐).
      고른 것 보이기 모드에서 이 항목을 고르면 보임 · 고른 것 숨기기 모드에서 고르면 숨음 · 아무것도 안 고르면 보임.
      기존 '고른 것 보이기' 설정엔 한 번(`C.mig144`) 칩 항목을 넣어 지금처럼 칩이 보이게 둠. 내일 짜기(`nfOn93`) 동안엔 안 거름.
   ② 날짜에 놓은 칩이 안 보이던 원인: 운동·빨래처럼 습관·관리로 숨는 할 일(hid76)은 openTasks()에서 빠져 w86 슬롯이 안 그려졌음 → 여기서 TASKS 전체에서 다시 채움.
   ③ 할 일 '오늘'·'내일' 목록: 그날 놓은(sl91) 주 N회 칩도 보임(줄의 날짜·시각은 놓은 자리로).
   ④ 루틴(머리 할 일 t.rid, 매일·요일 반복)은 앞으로의 날에도 시간표 블록으로 보임(그날 한 것과 상관없이) — 미리 보기 블록(.gh144)은 끌기·○ 없음, 누르면 그 루틴 상세.
   ⑤ 루틴 밑 '✓ 오늘 한 단계' 줄은 목록·홈 모두 안 그림(사용자: 기록에서 보면 됨).
   ⑥ 홈 '오늘' 칸 '✓ 끝낸 것: …' 글줄 → 할 일 화면처럼 '✓ 끝냄 n' 작은 칩(누르면 펼침). */
(function(){
/* ---------- ① 칩 거르기 ---------- */
try{if(!KIND77.some(x=>x[0]==='wk'))KIND77.push(['wk','🏷 칩(주 N회)'])}catch(e){console.error(e)}
window.isWk144=function(t){if(!t)return false;try{if(t.hg119&&TASKS[t.hg119])t=TASKS[t.hg119]}catch(e){}return !!(t.status===0&&t.rep&&t.rep.f==='x')};
window.chipPass144=function(f){f=f||flt77();if(!fOn77(f))return true;const has=f.kinds.includes('wk');return f.inv?!has:has};
calPass=(function(prev){return function(t){
  try{if(window.nfOn93&&nfOn93())return prev.apply(this,arguments);
    const f=flt77();
    if(isWk144(t))return chipPass144(f);
    if(!f.kinds.includes('wk'))return prev.apply(this,arguments);
    const k=f.kinds;f.kinds=k.filter(x=>x!=='wk');
    try{if(!fOn77(f))return f.inv?true:false;return prev.apply(this,arguments)}finally{f.kinds=k}
  }catch(e){console.error(e);return prev.apply(this,arguments)}}})(calPass);
function mig144(){if(!ready||C.mig144)return;if(mode==='db'&&!SRV59.c)return;
  ['calf77','calf77t'].forEach(k=>{const f=C[k];if(!f||typeof f!=='object'||Array.isArray(f)||f.inv)return;if(!Array.isArray(f.kinds))f.kinds=[];
    const n=['lists','areas','tags','kinds'].reduce((a,x)=>a+((f[x]||[]).length),0);if(n&&!f.kinds.includes('wk'))f.kinds.push('wk')});
  C.mig144=1;save('config')}
function chipRow144(){try{document.body.classList.toggle('nochip144',!chipPass144())}catch(e){}}

/* ---------- ② 슬롯: 숨는 할 일(습관·관리)도 + ④ 루틴 미리 보기 ---------- */
const slotOn144=(t,k)=>!!(t&&t.status===0&&t.rep&&t.rep.f==='x'&&t.sl91&&t.sl91[k]!==undefined&&!slotDoneOn91(t,k)&&wkCnt91(t,weekStart(k))<(+t.rep.n||3));
window.slotOn144=slotOn144;
const ghostOK=()=>true;   // 월 칸은 그린 뒤 ghost144가 뺌(할 일 화면 옆 시간표와 캘린더 화면의 보기 모드가 따로라 여기서 못 가림)
tasksOn=(function(prev){return function(k){const a=prev.apply(this,arguments);
  try{const td=midKey68(),ids=new Set(a.map(t=>t.id));
    // ② w86은 openTasks()(숨는 할 일 빠짐)만 봄 → 빠진 슬롯을 채움
    if(k>=td)Object.values(TASKS).forEach(t=>{if(ids.has(t.id)||!slotOn144(t,k)||!calPass(t))return;
      const c=Object.assign({},t,{due:k,time:t.sl91[k]||null});if(t.sd119&&+t.sd119[k]>0)c.dur=+t.sd119[k];a.push(c);ids.add(t.id)});
    // ① 칩을 숨겼으면 슬롯 사본도 뺌(w86 사본은 calPass를 안 탐)
    for(let i=a.length-1;i>=0;i--)if(isWk144(a[i])&&!calPass(a[i]))a.splice(i,1);
    // ④ 루틴 머리: 앞으로의 날에도(그날 반복 차례면) 미리 보기 블록
    if(k>=td&&ghostOK())Object.values(TASKS).forEach(t=>{if(ids.has(t.id)||!t||t.status!==0||!t.rid||!t.rep||!t.rep.f||t.rep.f==='x'||!t.due||k<=t.due)return;
      if(typeof isStep62==='function'&&isStep62(t))return;if(typeof hid76==='function'&&hid76(t))return;
      try{if(!sched59(t,k)||!calPass(t))return}catch(e){return}
      let c=Object.assign({},t,{due:k,gh144:1});delete c.tx83;try{if(typeof view83==='function')c=Object.assign(view83(c,k),{gh144:1})}catch(e){}
      a.push(c);ids.add(t.id)});
  }catch(e){console.error(e)}return a}})(tasksOn);
// 미리 보기 블록: 끌기·길이·○ 없앰, 표시
function ghost144(){try{document.querySelectorAll('#calPane [data-ctask], #calMain [data-ctask], #tt84slot [data-ctask], #pl93 [data-ctask]').forEach(el=>{const t=TASKS[el.dataset.ctask];if(!t||!t.rid)return;
    const col=el.closest('[data-drop^="col:"],[data-drop^="allday:"],[data-drop^="day:"]');if(!col)return;const d=col.dataset.drop,k=d.slice(d.indexOf(':')+1);
    if(!k||k===t.due||k<=t.due)return;
    if(el.closest('.mgrid')){el.remove();return}
    el.classList.add('gh144');el.removeAttribute('data-drag');el.querySelectorAll('.rz,[data-tdone],.ck128').forEach(x=>x.remove());
    if(!el.title||!/미리 보기/.test(el.title))el.title=(t.title||'')+' · 반복 루틴 미리 보기(이 날 차례)'})}catch(e){console.error(e)}}

/* ---------- ③ 할 일 '오늘'·'내일' 목록에 놓은 칩 ---------- */
const selK=sel=>sel==='today'?dateKey():sel==='tomorrow'?addDays(dateKey(),1):null;
taskMatches=(function(prev){return function(t,sel){try{const k=selK(sel);if(k&&slotOn144(t,k)&&!(ui.tq71&&ui.tq71.trim()))return true}catch(e){}return prev.apply(this,arguments)}})(taskMatches);
const curSel=()=>{try{return curView()==='tasks'?((C.ui.tasks||{}).sel||'today'):null}catch(e){return null}};
const asSlot=t=>{try{const k=selK(curSel());if(k&&t&&t.due!==k&&slotOn144(t,k))return Object.assign({},t,{due:k,time:t.sl91[k]||null})}catch(e){}return t};
taskRow=(function(prev){return function(t){const a=[...arguments];a[0]=asSlot(t);return prev.apply(this,a)}})(taskRow);
dateBucket=(function(prev){return function(t){const a=[...arguments];a[0]=asSlot(t);return prev.apply(this,a)}})(dateBucket);

/* ---------- ⑤ '✓ 오늘 한 단계' 줄 없앰 ---------- */
dn75=function(){return ''};

/* ---------- ⑥ 홈 끝냄 칩 ---------- */
let HD144=false;
function homeDone144(){const L=$('htList');if(!L)return;const el=[...L.querySelectorAll(':scope > .tiny.muted')].find(x=>/^✓ 끝낸 것/.test(x.textContent.trim()));if(!el)return;
  const dn=doneOn(dateKey());if(!dn.length){el.remove();return}
  const d=document.createElement('details');d.className='hd144';if(HD144)d.open=true;
  d.innerHTML=`<summary title="오늘 끝낸 것">✓ 끝냄 ${dn.length}</summary><div class="hd144b">${dn.map(e=>`<span class="hd144i">${esc(e.name||'')}</span>`).join('')}</div>`;
  d.addEventListener('toggle',()=>{HD144=d.open});el.replaceWith(d)}

/* ---------- ⑦ 빠른 기록 묶기 (C.pg144: ''=안 묶음 · 'type'=좋음/나쁨 · 'area'=영역) — 끝의 작은 '묶기' 칩을 누를 때마다 바뀜 ---------- */
const PG144=[['','안 묶음'],['type','좋음·나쁨'],['area','영역별'],['both','좋음·나쁨 × 영역']];
function pinGroup144(){const pb=$('pin141');if(!pb||pb.querySelector('[data-g144]'))return;const box=pb.querySelector('.m141p');if(!box)return;
  const g=C.pg144||'',items=[...box.querySelectorAll(':scope > .pq141')];if(!items.length)return;
  const lab=(PG144.find(x=>x[0]===g)||PG144[0])[1];
  const btn=`<button type="button" class="g144b" data-g144="1" title="빠른 기록 묶는 방식 바꾸기 (안 묶음 → 좋음·나쁨 → 영역별 → 좋음·나쁨 × 영역)">⊞ ${esc(lab)}</button>`;
  if(!g){box.insertAdjacentHTML('beforeend',btn);return}
  const key=a=>{if(!a)return ['~','기타'];if(g==='type'){const t=a.type==='bad'?['2','✖ 나쁨']:a.type==='good'?['1','✚ 좋음']:['3','○ 그 밖'];return t}
    const ar=(C.areas||[]).find(x=>x.id===a.area);const i=(C.areas||[]).indexOf(ar);
    if(g==='both'){const t=a.type==='bad'?['2','✖']:a.type==='good'?['1','✚']:['3','○'];return [t[0]+String(i<0?999:i).padStart(3,'0'),t[1]+' '+(ar?ar.name:'영역 없음')]}
    return [String(i<0?999:i).padStart(3,'0'),ar?ar.name:'영역 없음']};
  const G=new Map();items.forEach(el=>{const a=C.actions.find(x=>x.id===el.dataset.rowid);const [k,l]=key(a);if(!G.has(k))G.set(k,{l,els:[]});G.get(k).els.push(el)});
  const wrap=document.createElement('div');wrap.className='g144w';
  [...G.keys()].sort().forEach(k=>{const {l,els}=G.get(k);const row=document.createElement('div');row.className='m141p g144';row.dataset.drop='reorder:pin141';
    row.innerHTML=`<span class="g144l">${esc(l)}</span>`;els.forEach(e=>row.appendChild(e));wrap.appendChild(row)});
  wrap.lastChild.insertAdjacentHTML('beforeend',btn);box.replaceWith(wrap)}
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-g144]');if(!b)return;e.preventDefault();e.stopPropagation();
  const i=PG144.findIndex(x=>x[0]===(C.pg144||''));const nx=PG144[(i+1)%PG144.length][0];if(nx)C.pg144=nx;else delete C.pg144;save('config');render()},true);
renderHome=(function(prev){return function(){const r=prev.apply(this,arguments);try{pinGroup144()}catch(e){console.error(e)}return r}})(renderHome);

/* ---------- ⑧ 관리·습관 통계: 할 일 하나 기준 (사용자 11/26 밤: 카드 기준 통계가 틀렸다) ----------
   같은 카드를 쓰는 다른 할 일이 있으면(예: 청소 카드를 여러 청소 할 일이 씀) ⚠ 경보·기록 달력을 **이 할 일의 기록만**으로 셈.
   다른 할 일이 없으면 예전처럼 카드 기록도 셈(카드를 기록하기에서 바로 누른 날). 관리 ⋯ 메뉴에 '📊 언제 했나 · 통계'. */
const others144=t=>t&&t.aid?Object.values(TASKS).filter(x=>x&&x.id!==t.id&&x.status===0&&x.aid===t.aid&&!x.rid&&!(typeof isStep62==='function'&&isStep62(x))):[];
const own144=(t,k)=>{const d=DAYS[k];return !!(d&&(d.entries||[]).some(e=>e.tid===t.id))};
function did144(t,k){if(own144(t,k))return true;if(others144(t).length)return false;const d=DAYS[k];if(!d)return false;
  try{const wt=typeof watchTarget==='function'?watchTarget(key132(t)):null;if(wt&&wt.done(d))return true}catch(e){}
  return (d.entries||[]).some(e=>t.aid&&e.aid===t.aid)}
window.did144=did144;
function lastOwn144(t,from){for(let i=0;i<=400;i++){const k=addDays(from,-i);if(did144(t,k))return k}return null}
alOf131=(function(prev){return function(t,m){const x=prev.apply(this,arguments);
  try{if(!x||!t||!t.aid||!m[t.aid]||!others144(t).length)return x;
    const w=watch132(t),d=+((w&&w.days)||x.d),y=addDays(gk76(),-1),last=lastOwn144(t,y),b=last||t.created||null;if(!b)return x;
    const s=diffDays(y,b)+1;if(s<d)return null;return Object.assign({},x,{s,over:s>d,last:last||null,own144:1})}catch(e){console.error(e);return x}}})(alOf131);
alTip131=(function(prev){return function(x){if(x&&x.own144)return x.last?`이 할 일을 마지막으로 한 날(${fmtD(x.last)})부터 ${x.s}일째예요 · 경보 기준 ${x.d}일 ${x.over?'초과':'도달'}. 눌러서 언제 했는지 보기`:`이 할 일을 ${x.s}일째 안 했어요 · 경보 기준 ${x.d}일`;return prev.apply(this,arguments)}})(alTip131);
recCal132=function(id,x,y,mk){const t=TASKS[id];if(!t)return;const w=watch132(t),oth=others144(t);
  const td=gk76(),dk=dateKey();mk=mk||td.slice(0,7);RC132={id,m:mk,x,y};
  const first=mk+'-01',ws=weekStartD(first),nm=addDays(first,40).slice(0,7)+'-01';let cells='';
  for(let i=0;i<42;i++){const k=addDays(ws,i);if(i>=35&&k>=nm)break;const inm=k.slice(0,7)===mk,ok=did144(t,k),can=!ok&&k<=dk;
    const cls=`rc132d${inm?'':' o'}${ok?' ok':''}${k===td?' td':''}${k>td?' fu':''}${can?' can133':''}`,inner=`${+k.slice(8)}${ok?'<i>✓</i>':''}`;
    cells+=can?`<button type="button" class="${cls}" data-rc133="${esc(id)}|${k}" title="${esc(fmtD(k))} · 눌러서 '그날 했어요'로 적기" aria-label="${esc(fmtD(k))} 그날 했어요로 적기">${inner}</button>`
      :`<span class="${cls}" title="${esc(fmtD(k))}${ok?' · 했어요':''}">${inner}</span>`}
  // 통계: 마지막 · 최근 30일 · 90일 평균 간격 · 올해
  const ds=[];for(let i=0;i<=365;i++){const k=addDays(td,-i);if(did144(t,k))ds.push(k)}
  const last=ds[0]||null,n30=ds.filter(k=>k>addDays(td,-30)).length,d90=ds.filter(k=>k>addDays(td,-90));
  let gap='';if(d90.length>=2){const g=[];for(let i=0;i<d90.length-1;i++)g.push(diffDays(d90[i],d90[i+1]));gap=` · 평균 ${Math.round(g.reduce((a,b)=>a+b,0)/g.length*10)/10}일마다`}
  const per=t.rep&&t.rep.f==='d'&&+t.rep.i>1?` (정한 주기 ${+t.rep.i}일)`:'';
  const [yy,mm]=mk.split('-');
  const al=w?(()=>{const dd=+w.days||0;if(!last)return `⚠ 방치 경보 ${dd}일 — 아직 한 기록이 없어요.`;const s=diffDays(td,last);return `⚠ 방치 경보 ${dd}일 — 이 할 일을 마지막으로 한 날부터 ${s}일(${s>dd?(s-dd)+'일 넘김':s===dd?'오늘이 기한':'여유 있음'}).`})():'';
  const html=`<div class="rc132"><div class="rc132h"><button type="button" class="ib" data-rc132="-1" aria-label="이전 달">‹</button><b>${+yy}년 ${+mm}월</b><button type="button" class="ib" data-rc132="1" aria-label="다음 달"${mk>=td.slice(0,7)?' disabled':''}>›</button></div>
    <div class="rc132g">${WKH71().map(d=>`<span class="rc132w">${d}</span>`).join('')}${cells}</div>
    <div class="small rc132s">${last?`마지막: <b>${esc(fmtD(last))}</b>${last===td?' (오늘)':` (${diffDays(td,last)}일 전)`}`:'아직 한 기록이 없어요'} · 최근 30일 <b>${n30}</b>번${gap}${per} · 1년 ${ds.length}번</div>
    ${al?`<div class="tiny rc132s">${esc(al)}</div>`:''}
    ${oth.length?`<div class="tiny muted rc132s">이 할 일 기록만 세요 — 같은 카드를 쓰는 ${esc(oth.slice(0,3).map(z=>z.title).join('·'))}${oth.length>3?' 외 '+(oth.length-3)+'개':''}로 한 날은 빼요.</div>`:''}
    <div class="tiny muted rc132s">✓ = 한 날 · 안 한 날(테두리 칸)을 누르면 <b>그날 했어요</b>로 적어요(되돌리기 있음)</div></div>`;
  menu61(x,y,`📊 ${esc(t.title.length>20?t.title.slice(0,20)+'…':t.title)} · 언제 했나`,[{html,f:()=>{}},'-',{l:'✎ 할 일 열기',f:()=>openTaskSheet(id)}])};
window.recCal132=recCal132;
careMenu76=(function(prev){return function(t,x,y){const m0=menu61;
  menu61=function(x2,y2,title,items){try{if(Array.isArray(items)&&t){items=items.slice();let i=items.lastIndexOf('-');if(i<0)i=items.length;
    items.splice(i,0,{l:'📊 언제 했나 · 통계 <small class="muted">기록 달력</small>',f:()=>setTimeout(()=>recCal132(t.id,x,y),40)})}}catch(e){}
    menu61=m0;return m0.call(this,x2,y2,title,items)};
  try{return prev.apply(this,arguments)}finally{menu61=m0}}})(careMenu76);
window.careMenu76=careMenu76;

/* ---------- ⑨ 충동 → 카드 자동 기록 (사용자 11/26 밤) ----------
   · '안 먹었어요/안 샀어요'(hold110)는 이미 '…참았다' 카드를 기록함 → 기록 메모에 상황·메모·금액·적은 시각을 같이 남김(나중에 적어도 따라감).
   · '먹었어요/샀어요'(gave110) → 이름에 충동·구매(또는 야식·폭식·과식)가 든 **나쁜 카드**가 있으면 그 카드를 기록(카드 점수 그대로 — 사용자 요청) + 같은 메모.
     되돌리기(undo110)·지우기(del110)·참음으로 바꾸기면 그 기록도 지움. 기록 id는 x.geid/x.ghk(normDay 보존). */
function badCard144(k){const re=k==='b'?/충동.*(구매|지출|소비)|(구매|지출|소비).*충동/:/(야식|폭식|과식)/;
  const id=((C.imp110||{}).bad144||{})[k];let a=id&&C.actions.find(x=>x.id===id&&x.type==='bad');
  return a||C.actions.find(x=>x.type==='bad'&&!x.doneAt&&re.test(x.name||'')&&!/참/.test(x.name||''))||C.actions.find(x=>x.type==='bad'&&x.mg&&re.test(x.name||'')&&!/참/.test(x.name||''))||null}   // v13.31: 합쳐서 숨은 옛 카드도(→ w151이 합친 카드로 돌림)
function note144(x){const K=IK110[x.k]||['',''];const b=[K[0]+' '+x.n];if(x.t)b.push('적은 때 '+x.t);if(x.a)b.push('약 '+cm110(x.a)+'원');
  if((x.sit||[]).length)b.push('상황 '+x.sit.join('·'));if(x.m)b.push('“'+x.m+'”');if(x.fl)b.push('대응 '+x.fl);return b.join(' · ').slice(0,200)}
normDay=(function(prev){return function(k,raw){const d=prev.apply(this,arguments);
  try{if(raw&&Array.isArray(raw.imp110)&&Array.isArray(d.imp110)){const m=new Map(raw.imp110.map(x=>[String(x&&x.id),x]));
    d.imp110.forEach(o=>{const x=m.get(o.id);if(x&&x.geid){o.geid=String(x.geid);o.ghk=String(x.ghk||k)}})}}catch(e){}return d}})(normDay);
window.badCard144=badCard144;
function gEntry144(x){const d=x.ghk&&DAYS[x.ghk];return d&&(d.entries||[]).find(e=>e.id===x.geid)}
function gDrop144(x){try{if(x.geid&&gEntry144(x))removeEntry(x.ghk,x.geid)}catch(e){console.error(e)}delete x.geid;delete x.ghk}
gave110=(function(prev){return function(id){const r=prev.apply(this,arguments);
  try{const f=find110(id);if(!f||f.x.s!=='g'||(f.x.geid&&gEntry144(f.x)))return r;const a=badCard144(f.x.k);if(!a||!guard())return r;
    const d=today(),e=actEntry(a,{});e.note=note144(f.x);e.n144=e.note;e.imp110=f.x.id;
    commit(()=>{applyEntry(d,e);f.x.geid=e.id;f.x.ghk=d.date},[f.k,d.date]);render();
    toast(`${IK110[f.x.k][0]} '${a.name}' 카드로도 기록했어요 — 상황·메모를 적으면 기록 메모에 따라가요`)}catch(e){console.error(e)}return r}})(gave110);
undo110=(function(prev){return function(id){try{const f=find110(id);if(f&&f.x.geid){gDrop144(f.x);save(f.k)}}catch(e){console.error(e)}return prev.apply(this,arguments)}})(undo110);
del110=(function(prev){return function(id){try{const f=find110(id);if(f&&f.x.geid)gDrop144(f.x)}catch(e){console.error(e)}return prev.apply(this,arguments)}})(del110);
hold110=(function(prev){return function(id){try{const f=find110(id);if(f&&f.x.geid){gDrop144(f.x);save(f.k)}}catch(e){console.error(e)}return prev.apply(this,arguments)}})(hold110);
// 메모 따라가기: 상황·메모를 나중에 적어도 기록 메모를 고침(참음 기록 eid · 못 참음 기록 geid)
function impNotes144(){try{const td=gk76();for(let i=0;i<3;i++){const k=addDays(td,-i);(list110(k)||[]).forEach(x=>{
    [[x.hk,x.eid],[x.ghk,x.geid]].forEach(([dk,eid])=>{if(!dk||!eid)return;const d=DAYS[dk];const e=d&&(d.entries||[]).find(z=>z.id===eid);if(!e||e.kind==='imp110')return;
      if(!e.n144||e.note!==e.n144)return;   // 이번 버전이 만든 메모만, 사용자가 고치지 않았을 때만(옛 기록·직접 고친 메모는 안 건드림)
      const n=note144(x);if(e.note!==n){e.note=n;e.n144=n;save(dk)}})})}}catch(e){console.error(e)}}
// 참음 기록: 새로 만들 때만 메모를 note144로(표시 e.n144)
hold110=(function(prev){return function(id){const r=prev.apply(this,arguments);try{const f=find110(id);if(!f||!f.x.eid)return r;const d=DAYS[f.x.hk],e=d&&(d.entries||[]).find(z=>z.id===f.x.eid);
  if(e&&e.kind!=='imp110'&&!e.n144){e.note=note144(f.x);e.n144=e.note;save(f.x.hk)}}catch(e){console.error(e)}return r}})(hold110);

/* ---------- ⑩ 식사 칸 채소 ↔ '채소 한 번 먹기' 할 일·카드 (사용자 11/26 밤) ----------
   식사 칸 '채소 먹은 횟수'가 1 이상이 되면, 이름이 채소…먹… 인 좋은 카드에 이어진 반복 할 일(오늘 차례)을 끝냄(✓).
   점수는 0 — 채소 횟수(+점수)·일퀘가 이미 셈(두 번 세지 않게). 이어진 할 일이 없으면 그 카드를 0점으로 한 번 기록(빠른 기록 ✓).
   횟수를 0으로 되돌리면 이 자동 기록만 지움(직접 누른 기록은 안 건드림). 자동 기록 표시 e.au144='veg'. */
const VEGN144='🥗 식사 칸 채소에서 자동';
function vegSync144(){if(!ready||mode==='db'&&!(SRV59.c&&tAll64()))return;if(VS144)return;
  const f=(C.food||[]).find(x=>x.id==='veg')||(C.food||[]).find(x=>/채소/.test(x.name||'')&&x.points>0);if(!f)return;
  const k=gk76(),d=DAYS[k],v=+((d&&d.food||{})[f.id]||0),td=midKey68();
  const cards=C.actions.filter(a=>a.type==='good'&&!a.doneAt&&/채소/.test(a.name||'')&&/먹/.test(a.name||''));if(!cards.length)return;
  const cid=new Set(cards.map(a=>a.id)),E=(d&&d.entries)||[],isAuto=e=>e.au144==='veg'||e.note===VEGN144;
  const T=Object.values(TASKS).filter(t=>t&&t.status===0&&cid.has(t.aid)&&t.rep&&t.rep.f&&t.rep.f!=='x'&&!t.rid&&!(typeof isStep62==='function'&&isStep62(t)));
  VS144=1;
  try{
    if(T.length){T.forEach(t=>{const mine=E.filter(e=>e.tid===t.id&&e.kind!=='quest'),auto=mine.find(isAuto);
      if(v>0&&!mine.length&&t.due&&t.due<=td){const before=new Set(E.map(e=>e.id));
        try{completeTask(t,{direct:true})}catch(e){console.error(e)}
        const dd=DAYS[k],ne=dd&&(dd.entries||[]).find(e=>!before.has(e.id)&&e.tid===t.id&&e.kind!=='quest');
        if(ne){ne.au144='veg';ne.note=VEGN144;if((+ne.xp||0)||(+ne.gold||0)||(+ne.cond||0))px75Apply(k,ne.id,{xp:0,gold:0,cond:0});save(k)}}
      else if(v<=0&&auto){removeEntry(k,auto.id)}})}
    else cards.forEach(a=>{const mine=E.filter(e=>e.aid===a.id&&e.kind==='act'),auto=mine.find(isAuto);
      if(v>0&&!mine.length){const dd=today();const e=actEntry(a,{});e.xp=0;e.gold=0;e.cond=0;e.au144='veg';e.note=VEGN144;commit(()=>applyEntry(dd,e),[dd.date])}
      else if(v<=0&&auto)removeEntry(k,auto.id)})
  }finally{VS144=0}}
var VS144=0;

/* ---------- F67 기능 지도 ---------- */
try{F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['🏷 칩 보이기·숨기기','캘린더 → 위 ⚲ 보이기·숨기기 → 종류 → 🏷 칩(주 N회)','주 N회 칩(위 칩 줄·날짜에 놓은 칩)은 이 항목 하나로만 보이고 숨어요(목록 거르기와 상관없음)',()=>{location.hash='cal'},'주 N회 칩 거르기 운동 시나리오'],
  ['◌ 루틴 미리 보기 블록','캘린더 시간표(주·3일·1일) → 앞으로의 날','매일·요일 반복 루틴은 앞날에도 점선 블록으로 보여요(오늘 했는지와 상관없이). 누르면 루틴 상세',()=>{location.hash='cal'},'루틴 블록 매일 Eos Vesper Lethe'],
  ['⊞ 빠른 기록 묶기','홈 → 📌 빠른 기록 끝의 ⊞ 칩','누를 때마다 안 묶음 → 좋음·나쁨 → 영역별',()=>{location.hash='home'},'빠른 기록 묶음 좋음 나쁨 영역'],
  ['📊 관리 통계','🧽 관리 창 → 줄의 ⋯ → 📊 언제 했나 · 통계','이 할 일을 한 날 달력·마지막·최근 30일·평균 간격. 같은 카드를 쓰는 다른 할 일 기록은 빼고 셈',()=>{try{careSheet76()}catch(e){}},'관리 통계 기록 달력 언제 했나'],
  ['🔗 자동 연동','충동 적기 확정 · 홈 🍽 식사 채소','안 먹었어요/안 샀어요 → 참았다 카드, 샀어요 → 충동구매 카드(메모에 상황·금액), 채소 +1 → 채소 한 번 먹기 할 일 ✓(0점)',()=>{location.hash='home'},'충동 참았다 충동구매 채소 자동']])}})(F67)}catch(e){console.error(e)}

render=(function(prev){return function(){try{mig144()}catch(e){console.error(e)}const r=prev.apply(this,arguments);try{chipRow144();ghost144();homeDone144()}catch(e){console.error(e)}try{impNotes144()}catch(e){console.error(e)}setTimeout(()=>{try{vegSync144()}catch(e){console.error(e)}},0);return r}})(render);
renderCal=(function(prev){return function(){const r=prev.apply(this,arguments);try{chipRow144();ghost144()}catch(e){console.error(e)}return r}})(renderCal);
renderHome=(function(prev){return function(){const r=prev.apply(this,arguments);try{homeDone144()}catch(e){console.error(e)}return r}})(renderHome);
})();
