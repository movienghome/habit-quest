/* v13.5 (w133): 오늘 칩 미니멀 · 모두 내일로 길게 누르기(주말·다음 주) · 관리 묶음은 가장 오래 밀린 1~2개만 칩에 · ⚠ 기록 달력 '그날 했어요'
   · 할 일 줄 왼쪽 스와이프(미루기·날짜 바꾸기) · 기록하기 행동 📌 위 고정 · 오늘 한 일 칸 날짜 고르기 · 주 N회 칩 날짜 = 요일 글자 칸 */

/* ---------- ① 오늘 화면 칩: 글자만 있는 작은 칩(펼쳐도 검정으로 안 채움) · 📆 모두 내일로는 길게 누르면 날짜 고르기 ---------- */
function ltBtn132(){return `<button type="button" class="chipbtn lt132" data-lt132="1" title="밀린 할 일을 모두 내일로 옮겨요 — ☠ 미룸으로 안 셈 · 길게 누르면(우클릭) 모레·주말·다음 주·날짜 고르기">📆 모두 내일로</button>`}
var LP133={t:0,fired:0,x:0,y:0};
// w132 클릭 처리가 allTmr132()를 부름 → 길게 눌러 메뉴를 연 뒤의 click은 건너뜀. 날짜(to)를 받으면 그 날로
function allTmr132(to){if(LP133.fired){LP133.fired=0;return}
  const ts=late132();if(!ts.length){toast('밀린 할 일이 없어요');return}
  const tm=addDays(midKey68(),1);if(typeof to!=='string')to=tm;
  const sn=ts.map(t=>[t.id,t.due]);
  ts.forEach(t=>{t.due=to;saveTask(t)});render();
  const lb=to===tm?'내일':`${fmtD(to)}(${wdOf(to)})`;
  toastAct(`📆 밀린 ${ts.length}개 → ${lb} · ☠ 안 셈`,'되돌리기',()=>{sn.forEach(([id,d])=>{const t=TASKS[id];if(t&&t.status===0){t.due=d;saveTask(t)}});render()},7000)}
function ltMenu133(x,y){const n=late132().length;if(!n){toast('밀린 할 일이 없어요');return}
  dayMenu130(x,y,{title:`📆 밀린 ${n}개 모두 어디로? <small class="muted">☠ 안 셈</small>`,onPick:k=>{LP133.fired=0;allTmr132(k)}});
  // 손가락을 떼는 순간 메뉴 항목이 눌리지 않게 잠깐 눌림을 막음(폰에서 메뉴가 손가락 밑에 뜰 수 있음)
  const m=$('m61');if(m){m.style.pointerEvents='none';setTimeout(()=>{m.style.pointerEvents=''},650)}}
addEventListener('pointerdown',e=>{const b=e.target.closest&&e.target.closest('[data-lt132]');if(!b||e.button>0)return;LP133.fired=0;clearTimeout(LP133.t);
  LP133.x=e.clientX;LP133.y=e.clientY;LP133.t=setTimeout(()=>{LP133.fired=1;const r=b.getBoundingClientRect();ltMenu133(r.left,r.bottom+4)},480)},true);
['pointerup','pointercancel'].forEach(n=>addEventListener(n,()=>{clearTimeout(LP133.t)},true));
addEventListener('pointermove',e=>{if(LP133.t&&(Math.abs(e.clientX-LP133.x)>8||Math.abs(e.clientY-LP133.y)>8))clearTimeout(LP133.t)},true);
addEventListener('contextmenu',e=>{const b=e.target.closest&&e.target.closest('[data-lt132]');if(!b)return;e.preventDefault();clearTimeout(LP133.t);LP133.fired=1;const r=b.getBoundingClientRect();ltMenu133(r.left,r.bottom+4)},true);

/* ---------- ② 관리 묶음(집 청소처럼 쪼갠 관리)은 오늘 차례 중 가장 오래 밀린 1~2개만 관리 칩 줄에 · 나머지는 📦 +n ---------- */
var FOLDMAX133=2,CR133=0,HID133=0;
careDue76=(function(prev){return function(){const a=prev.apply(this,arguments);if(!CR133)return a;
  try{const S=folds132();if(!S.size)return a;const seen={};return a.filter(t=>{if(!t.parent||!S.has(t.parent))return true;seen[t.parent]=(seen[t.parent]||0)+1;if(seen[t.parent]>FOLDMAX133){HID133++;return false}return true})}catch(e){return a}}})(careDue76);
careRow76=(function(prev){return function(){CR133=1;HID133=0;let h;try{h=prev.apply(this,arguments)}finally{CR133=0}
  try{if(h&&HID133&&h.indexOf('<div class="care76">')===0){const n=HID133;HID133=0;
    h=h.replace(/<\/div>$/,`<button type="button" class="c76h f133" data-c76open="1" title="관리 묶음에서 오래 밀린 순으로 ${FOLDMAX133}개만 올렸어요 — 나머지 ${n}개는 관리 창에서">📦 +${n}</button></div>`)}}catch(e){console.error(e)}
  return h}})(careRow76);

/* ---------- ③ ⚠ n일째 기록 달력: 지난 날(안 한 날)을 눌러 '그날 했어요' 바로 적기 ---------- */
function recCal132(id,x,y,mk){const t=TASKS[id];if(!t)return;const key=key132(t),wt=typeof watchTarget==='function'?watchTarget(key):null,w=watch132(t);
  const did=k=>{const d=DAYS[k];if(!d)return false;try{if(wt&&wt.done(d))return true}catch(_){}return (d.entries||[]).some(e=>e.tid===t.id||(t.aid&&e.aid===t.aid))};
  const own=k=>{const d=DAYS[k];return !!(d&&(d.entries||[]).some(e=>e.tid===t.id))};
  const others=t.aid?Object.values(TASKS).filter(x=>x&&x.id!==t.id&&x.status===0&&x.aid===t.aid&&!x.rid&&!isStep62(x)):[];
  const td=gk76(),dk=dateKey();mk=mk||td.slice(0,7);RC132={id,m:mk,x,y};
  const first=mk+'-01',ws=weekStartD(first),nm=addDays(first,40).slice(0,7)+'-01';let cells='';
  for(let i=0;i<42;i++){const k=addDays(ws,i);if(i>=35&&k>=nm)break;const inm=k.slice(0,7)===mk,ok=did(k),can=!ok&&k<=dk;
    const sh=ok&&others.length&&!own(k);   // 이 할 일이 아니라 같은 카드의 다른 할 일로 '한 날'이 된 칸
    const cls=`rc132d${inm?'':' o'}${ok?' ok':''}${sh?' sh143':''}${k===td?' td':''}${k>td?' fu':''}${can?' can133':''}`,inner=`${+k.slice(8)}${ok?`<i>${sh?'↗':'✓'}</i>`:''}`;
    cells+=can?`<button type="button" class="${cls}" data-rc133="${esc(id)}|${k}" title="${esc(fmtD(k))} · 눌러서 '그날 했어요'로 적기" aria-label="${esc(fmtD(k))} 그날 했어요로 적기">${inner}</button>`
      :`<span class="${cls}" title="${esc(fmtD(k))}${ok?' · 했어요':''}">${inner}</span>`}
  let last=null;for(let i=0;i<=400;i++){const k=addDays(td,-i);if(did(k)){last=k;break}}
  let n=0;for(let i=0;i<30;i++)if(did(addDays(td,-i)))n++;
  const [yy,mm]=mk.split('-');
  const html=`<div class="rc132"><div class="rc132h"><button type="button" class="ib" data-rc132="-1" aria-label="이전 달">‹</button><b>${+yy}년 ${+mm}월</b><button type="button" class="ib" data-rc132="1" aria-label="다음 달"${mk>=td.slice(0,7)?' disabled':''}>›</button></div>
    <div class="rc132g">${WKH71().map(d=>`<span class="rc132w">${d}</span>`).join('')}${cells}</div>
    <div class="small muted rc132s">${last?`마지막: ${esc(fmtD(last))}${last===td?' (오늘)':` (${diffDays(td,last)}일 전)`}`:'아직 한 기록이 없어요'} · 최근 30일 ${n}번</div>
    ${w?`<div class="tiny rc132s al143">${esc(alExplain143(w,last,td,t))}</div>`:''}
    ${others.length?`<div class="tiny muted rc132s">↗ = 이 할 일이 아니라 <b>같은 카드를 쓰는 다른 할 일</b>(${esc(others.slice(0,3).map(x=>x.title).join('·'))}${others.length>3?' 외 '+(others.length-3)+'개':''})로 한 날이에요. 경보·✓는 카드 기준이라 이런 날도 '한 날'로 쳐요.</div>`:''}
    <div class="tiny muted rc132s">✓ = 한 날 · 안 한 날(테두리 칸)을 누르면 <b>그날 했어요</b>로 적어요(되돌리기 있음)</div></div>`;
  menu61(x,y,`📅 ${esc(t.title.length>20?t.title.slice(0,20)+'…':t.title)} · 언제 했나`,[{html,f:()=>{}},'-',{l:'✎ 할 일 열기',f:()=>openTaskSheet(id)}])}
function didDay133(id,k){const t=TASKS[id];if(!t||!guard())return;if(k>dateKey()){toast('앞으로의 날은 적을 수 없어요');return}
  const pt=RC132;closeMenu61();const day=dayOf(k),before=new Set((day.entries||[]).map(e=>e.id)),pl=t.last;
  try{withDay69(k,()=>completeTask(t,{direct:true}))}catch(e){console.error(e)}
  try{if(pl&&pl>k)t.last=pl;else if(!pl||k>pl)t.last=k;saveTask(t)}catch(e){}
  const e=((DAYS[k]||{}).entries||[]).find(x=>!before.has(x.id)&&x.tid===t.id);render();
  if(!e){toast(`📅 ${fmtD(k)}(${wdOf(k)}) 했어요로 적으려 했는데 새 기록이 안 생겼어요 — 이미 끝낸 할 일일 수 있어요`);return}
  toastAct(`📅 ${fmtD(k)}(${wdOf(k)}) '${t.title}' 했어요로 적었어요`,'되돌리기',()=>{removeEntry(k,e.id)},7000);
  if(pt&&pt.id===id)setTimeout(()=>{try{recCal132(id,pt.x,pt.y,pt.m)}catch(x){}},60)}
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-rc133]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();
  const i=b.dataset.rc133.lastIndexOf('|');didDay133(b.dataset.rc133.slice(0,i),b.dataset.rc133.slice(i+1))},true);

/* ---------- ④ 할 일 줄 왼쪽 스와이프(폰·터치): 미루기 · 날짜 바꾸기 · 열기 — 홈 '오늘' 칸과 할 일 화면 ---------- */
function swMenu133(t,x,y){if(!t||t.status!==0)return;
  if(isCare76(t)||t.rid||isRtKid71(t)){taskMenu61(t,x,y);return}
  const td=midKey68(),tm=addDays(td,1);
  menu61(x,y,`⏩ ${esc(t.title.length>18?t.title.slice(0,18)+'…':t.title)}`,[
    {l:`⏩ 내일로 미루기 <small class="muted">${esc(fmtD(tm))}(${esc(wdOf(tm))})</small>`,dis:t.due===tm,f:()=>postpone(t,tm)},
    {l:'📅 날짜 바꾸기… <small class="muted">모레·주말·다음 주·직접</small>',keep:1,f:()=>{const r=($('m61')||document.body).getBoundingClientRect();closeMenu61();
      dayMenu130(r.left,r.top,{title:`📅 '${esc(t.title.slice(0,16))}' 언제로?`,base:t.due,cur:t.due,onPick:k=>postpone(t,k)})}},
    '-',
    {l:'✎ 열기',f:()=>openTaskSheet(t.id)},
    {l:'⋯ 더 보기…',keep:1,f:()=>{closeMenu61();setTimeout(()=>taskMenu61(t,x,y),0)}}])}
{let S=null,last=0;const SEL='#htList .trow[data-task],#tList .trow[data-task]';
  const reset=r=>{if(!r)return;r.style.transition='transform .18s';r.style.transform='';r.classList.remove('sw133');setTimeout(()=>{r.style.transition=''},220)};
  addEventListener('touchstart',e=>{S=null;if(e.touches.length!==1)return;const r=e.target.closest&&e.target.closest(SEL);if(!r)return;
    if(e.target.closest('button,input,select,textarea,a')||document.body.classList.contains('dragging'))return;
    const t=TASKS[r.dataset.task];if(!t||t.status!==0)return;const p=e.touches[0];S={r,t,x:p.clientX,y:p.clientY,m:0,dx:0}},{passive:true,capture:true});
  addEventListener('touchmove',e=>{if(!S||e.touches.length!==1)return;const p=e.touches[0],dx=p.clientX-S.x,dy=p.clientY-S.y;
    if(!S.m){if(Math.abs(dy)>10&&Math.abs(dy)>Math.abs(dx)){S=null;return}if(Math.abs(dx)>12&&Math.abs(dx)>Math.abs(dy)*1.6&&dx<0){S.m=1;S.r.classList.add('sw133')}else return}
    e.preventDefault();S.dx=Math.max(-130,Math.min(0,dx));S.r.style.transform=`translateX(${S.dx}px)`;S.r.classList.toggle('go133',S.dx<=-64)},{passive:false,capture:true});
  const end=e=>{if(!S)return;const s=S;S=null;if(!s.m)return;const hit=s.dx<=-64;reset(s.r);s.r.classList.remove('go133');last=Date.now();
    if(hit){const rc=s.r.getBoundingClientRect();setTimeout(()=>swMenu133(s.t,Math.max(8,rc.right-24),rc.bottom),30)}};
  addEventListener('touchend',end,{capture:true});addEventListener('touchcancel',end,{capture:true});
  addEventListener('click',e=>{if(Date.now()-last<450&&e.target.closest&&e.target.closest(SEL)){e.preventDefault();e.stopImmediatePropagation()}},true)}

/* ---------- ⑤ 기록하기 → 행동/습관: 자주 쓰는 것 📌 위에 고정 (C.pin133 = 카드 id 목록) ---------- */
const pin133=()=>Array.isArray(C.pin133)?C.pin133:(C.pin133=[]);
function pinToggle133(id){const p=pin133(),i=p.indexOf(id);if(i<0)p.push(id);else p.splice(i,1);save('config');render();
  toast(i<0?'📌 기록하기 맨 위에 고정했어요':'📌 고정을 풀었어요')}
var AM133=null;
actMenu61=(function(prev){return function(a){AM133=a;try{return prev.apply(this,arguments)}finally{AM133=null}}})(actMenu61);
menu61=(function(prev){return function(x,y,tt,items){try{if(AM133&&Array.isArray(items)&&AM133.id){const a=AM133,on=pin133().includes(a.id);items=items.slice();
  const i=items.findIndex(z=>z&&typeof z.l==='string'&&z.l.indexOf('기록하기')>=0&&z.l.indexOf('✓')===0);
  items.splice(i<0?1:i+1,0,{l:on?'📌 위 고정 풀기':'📌 기록하기 맨 위에 고정',f:()=>pinToggle133(a.id)})}}catch(e){console.error(e)}
  return prev.call(this,x,y,tt,items)}})(menu61);
function pinApply133(){const G=$('actGroups');if(!G)return;G.querySelectorAll(':scope>.pin133').forEach(x=>x.remove());
  const ids=pin133().filter(id=>C.actions.some(a=>a.id===id&&!a.doneAt));if(!ids.length)return;
  const day=curDay(),box=document.createElement('div');box.className='pin133';
  box.innerHTML=`<div class="ph133">📌 자주 쓰는 <span class="c">${ids.length}</span></div><div class="acts"></div>`;const L=box.querySelector('.acts');
  ids.forEach(id=>{let r=G.querySelector(`.act[data-info="act:${CSS.escape(id)}"]`);
    if(r){const g=r.parentElement;L.appendChild(r);if(g&&g.classList.contains('acts')){const h=g.previousElementSibling,c=h&&h.matches('.ghead')&&h.querySelector('.c');if(c)c.textContent=g.children.length;if(!g.children.length){g.hidden=true;if(h&&h.matches('.ghead'))h.hidden=true}}}
    else{const a=C.actions.find(z=>z.id===id),n=day.entries.filter(e=>e.kind==='act'&&e.aid===a.id).length,ar=C.areas.find(z=>z.id===a.area);
      L.insertAdjacentHTML('beforeend',`<div class="act ${a.type}" data-info="act:${a.id}" tabindex="0" role="button" aria-label="${esc(a.name)} 설명·편집"><button class="chk ${n?'on':''}" data-act="${a.id}" aria-label="${esc(a.name)} 했어요 기록">${n?(n>1?n:'✓'):''}</button><span class="ab"><span class="n">${esc(a.name)}</span></span><span class="xp">${a.type==='good'?'+'+a.xp:(ar?esc(ar.name):'')+' −'+Math.abs(a.cond||0)}</span></div>`)}});
  G.prepend(box)}
renderLog=(function(prev){return function(){const r=prev.apply(this,arguments);try{pinApply133()}catch(e){console.error(e)}return r}})(renderLog);

/* ---------- ⑥ 기록하기 '오늘 한 일' 칸에서 바로 날짜 고르기: 오늘·어제·그저께·📅 다른 날 (위 날짜 줄과 같은 기능) ---------- */
function dcApply133(){const l=$('log'),p=l&&l.closest('.panel');if(!p)return;const td=dateKey(),cur=curDay().date,off=ui.off|0,far=off>2;
  let bar=p.querySelector(':scope>.dc133');if(!bar){bar=document.createElement('div');bar.className='dc133 daychips';const h=p.querySelector(':scope>.ptitle');if(h)h.after(bar);else p.prepend(bar)}
  const sig=off+'|'+cur+'|'+td;if(bar.dataset.sig===sig)return;bar.dataset.sig=sig;
  bar.innerHTML=[0,1,2].map(o=>`<button type="button" class="chipbtn" data-off="${o}" aria-pressed="${off===o}">${['오늘','어제','그저께'][o]}</button>`).join('')
    +`<label class="chipbtn d69p" aria-pressed="${far}">📅 ${far?esc(d69lbl(cur)):'날짜 고르기'}<input type="date" id="off133" max="${td}" value="${cur}" aria-label="기록 날짜 고르기"></label>`}
renderLog=(function(prev){return function(){const r=prev.apply(this,arguments);try{dcApply133()}catch(e){console.error(e)}return r}})(renderLog);
addEventListener('change',e=>{const i=e.target;if(!i||i.id!=='off133')return;e.stopPropagation();const v=i.value;if(v&&v<=dateKey()){ui.off=Math.max(0,diffDays(dateKey(),v));render()}},true);
addEventListener('click',e=>{const i=e.target;if(i&&i.id==='off133'){try{i.showPicker&&i.showPicker()}catch(_){}}},true);

/* ---------- ⑦ 주 N회 칩 날짜 = 요일 글자 칸 (월 화 수 …): 채움 = 한 날 · 점선 = 하기로 정한 날 · 흐림+줄 = 안 한 날 ---------- */
const LEG133='채움=한 날 · 반쪽 채움=10분만 · 점선=하기로 정한 날 · 흐림=안 한 날 · 동그란 칸=하나 그리고 둘';
dots99=function(t,ws,td){let s='',lab=[];
  for(let i=0;i<7;i++){const k=addDays(ws,i),st=stOf121(t,k,td),w=wdOf(k);
    s+=`<i class="d99 w133 s-${st}${k===td?' now':''}">${esc(w)}</i>`;lab.push(w+' '+DOT121[st])}
  return `<span class="dd99 w133w" role="img" aria-label="${lab.join(', ')}" title="${lab.join(' · ')} — ${LEG133}">${s}</span>`};
// 칩 상세 창의 한 주 줄도 같은 칸으로(요일 글자 + 모양 → 글자 칸 하나)
card121=(function(prev){return function(){const h=prev.apply(this,arguments);try{return String(h).replace(/<span class="dl121">([^<]*)<\/span><i class="d99 (s-[a-z]+)" aria-hidden="true"><\/i>/g,'<i class="d99 w133 big133 $2" aria-hidden="true">$1</i>').replace('<div class="week121">','<div class="week121" title="'+LEG133+'">')}catch(e){return h}}})(card121);

/* ---------- F67 기능 지도 ---------- */
F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['↔ 할 일 줄 스와이프','홈 → 오늘 칸 또는 할 일 화면의 줄을 왼쪽으로 밀기(폰)','미루기(내일로)·날짜 바꾸기(모레·주말·다음 주·직접)·열기·더 보기 메뉴가 떠요. 관리·루틴은 원래 메뉴',()=>{location.hash='home'},'스와이프 미루기 날짜 변경'],
  ['📌 자주 쓰는 행동 고정','기록하기 → 행동/습관 칸에서 행동 이름 누르기 → 📌 기록하기 맨 위에 고정','샤워·설거지처럼 자주 누르는 행동을 행동 칸 맨 위 📌 칸에 모아 둬요. 같은 메뉴에서 풀어요',()=>{location.hash='log'},'즐겨찾기 고정 상단 자주'],
  ['📅 오늘 한 일 날짜 고르기','기록하기 → 오늘 한 일 칸 위 [오늘][어제][그저께][📅 날짜 고르기]','위 날짜 줄과 같아요 — 고르면 행동·식사·몸무게가 그 날로 들어가요',()=>{location.hash='log'},'어제 그저께 날짜 선택 늦게 기록'],
  ['📆 모두 내일로 길게 누르기','할 일 → 오늘 → ⏳ 밀린 칩 펼치기 → 📆 모두 내일로를 길게 누르기(PC는 우클릭)','내일·모레·주말·다음 주·날짜 중 골라 한꺼번에 옮겨요(☠ 안 셈)',()=>{location.hash='tasks'},'밀린 주말로 다음 주로'],
  ['📅 ⚠ 달력에서 그날 했어요','할 일·관리 줄의 ⚠ n일째 누르기 → 안 한 날(테두리 칸) 누르기','늦게 한 걸 그 날짜로 바로 적어요(경보 날수가 맞춰져요). 알림에서 되돌릴 수 있어요',()=>{location.hash='tasks'},'지난 날 그날 했어요 경보']])}})(F67);
