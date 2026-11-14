/* ---- v10.0 (w99.js): K2 시나리오 주간 — 여유 일수 · 이번 주 점 7개 · 10분만도 1회 · 하그둘 꼬리표 ----
   대상 = 주 N회(rep.f==='x') 할 일 전부(시나리오 쓰기 25분 × 5가 대표). 새 저장 키는 둘뿐: 할 일 t.hg99(하그둘 꼬리표 켬) · 기록 e.hg99(그 기록이 하그둘 만남).
   ① 횟수: wkCnt91을 다시 선언(w86 것을 덮음) — 날마다 max(정식 기록 수, 🌱 10분만 기록이 있으면 1). 정식 기록 = tid 또는 같은 카드(aid) 기록(전과 같음),
      10분만 = kind 'start65'(e.t65 = 할 일 id, v5v). 그날 정식 기록이 있으면 10분만은 따로 안 셈(두 번 세지 않음).
   ② 여유 일수 = 남은 날 − 남은 횟수. 남은 날 = 오늘(오늘 이미 했으면 내일)부터 그 주 끝까지. 0 이하가 되면 내일 짜기 맨 위 줄에 알리기만(점수·HP 안 깎음).
   ③ 캘린더 위 줄 .wk91: strip91을 다시 선언 — 이번 주 점 7개(● 한 날 · ◐ 10분만 · ○ 안 한 지난 날 · ◇ 정해 둔 자리 · · 앞으로) + 여유 일수 + 🤝 n회.
   ④ 하그둘: 상세 ⋯ → '🤝 하그둘 꼬리표 켜기'(주 N회 할 일만). 켠 할 일을 끝내면 아래 알림에 🤝 단추 → 그 기록만 만남으로 표시(다시 누르면 뺌).
      같은 카드로 이은 '정해진 일정(fixed)' 할 일(하그둘 만남)을 끝내면 저절로 만남 표시. 인증 꼬리표는 따로 안 만듦(사용자 11/13). */
function dayCnt99(t,k){const d=DAYS[k];let n=0,tr=0;if(!d||!t)return{n:0,tr:0};
  (d.entries||[]).forEach(e=>{
    if(e.tid===t.id||(t.aid&&e.aid===t.aid&&e.tid!=null))n++;
    else if(e.kind==='start65'&&e.t65){const x=TASKS[e.t65];if(e.t65===t.id||(t.aid&&x&&x.aid===t.aid))tr=1}});
  return{n,tr}}
function wkCnt91(t,ws){let n=0;if(!t||!ws)return 0;for(let i=0;i<7;i++){const c=dayCnt99(t,addDays(ws,i));n+=c.n||c.tr}return n}
function hgCnt99(t,ws){let n=0;if(!t||!ws)return 0;for(let i=0;i<7;i++){const d=DAYS[addDays(ws,i)];if(!d)continue;
  (d.entries||[]).forEach(e=>{if(e.hg99&&(e.tid===t.id||(t.aid&&e.aid===t.aid)))n++})}return n}
function slack99(t,from){const ws=weekStart(from),we=addDays(ws,6),N=+t.rep.n||3,n=wkCnt91(t,ws);
  let days=0;for(let k=from,g=0;k<=we&&g<8;k=addDays(k,1),g++)days++;
  const need=Math.max(0,N-n);return{n,N,need,days,slack:days-need,ws}}
function from99(t,td){const c=dayCnt99(t,td);return(c.n||c.tr)?addDays(td,1):td}
const DOT99={'●':'한 날','◐':'10분만 한 날','○':'안 한 날','◇':'하기로 정한 날','·':'앞으로'};
function dots99(t,ws,td){let s='',lab=[];
  for(let i=0;i<7;i++){const k=addDays(ws,i),c=dayCnt99(t,k);
    const ch=c.n?'●':c.tr?'◐':k<td?'○':(t.sl91&&t.sl91[k]!==undefined)?'◇':'·';
    s+=`<i class="d99${k===td?' now':''}">${ch}</i>`;lab.push(wdOf(k)+' '+DOT99[ch])}
  return `<span class="dd99" role="img" aria-label="${lab.join(', ')}" title="${lab.join(' · ')}">${s}</span>`}

/* ③ 캘린더 위 줄(w86 strip91을 덮음) */
function strip91(){const m=$('calMain');if(!m||!m.parentElement)return;
  const old=m.parentElement.querySelector(':scope > .wk91');if(old)old.remove();
  const md=(C.ui.cal||{}).mode,td=midKey68();
  const ws=weekStart(md==='month'||md==='agenda'?td:(ui.calAnchor||td)),L=openTasks().filter(t=>wx91(t)&&calPass(t));if(!L.length)return;
  const cur=ws===weekStart(td);
  const chips=L.slice(0,4).map(t=>{const n=wkCnt91(t,ws),N=+t.rep.n||3,ks=slotKeys91(t,ws),fin=n>=N;
    let sl='';if(cur&&!fin){const s=slack99(t,from99(t,td));
      sl=s.slack>0?`<i title="이번 주 ${s.need}번 더 하면 돼요. 남은 날 ${s.days}일 중 ${s.slack}일은 쉬어도 목표를 채울 수 있어요">${s.need}번 남음 · 쉬어도 되는 날 ${s.slack}일</i>`
        :s.slack===0?`<i class="w99" title="목표를 채울 수 있어요. 다만 쉬는 날 없이 남은 날마다 한 번씩 해야 해요 (점수는 안 깎여요)">⚠ ${s.need}번 남음 · 매일 해야 채워요</i>`
        :`<i class="w99" title="남은 날 ${s.days}일에 ${s.need}번이라 하루에 두 번 하는 날이 있어야 해요 (점수는 안 깎여요)">⚠ ${s.need}번 남음 · 하루 두 번 필요</i>`}
    const hg=t.hg99?`<i title="이번 주 하그둘 만남">🤝 ${hgCnt99(t,ws)}회</i>`:'';
    return `<span class="c91 k99${fin?' ok':''}" title="이번 주 ${n}/${N}회${ks.length?' · 정해 둔 날 '+ks.map(k=>fmtD(k)+(t.sl91[k]?' '+t.sl91[k]:'')).join(', '):''}">${fin?'✓':'🔁'} ${esc(t.title)} <b>${n}/${N}</b>${dots99(t,ws,td)}${sl}${hg}${ks.length?`<i>정한 날 ${ks.length}</i>`:''}</span>`}).join('');
  const d=document.createElement('div');d.className='wk91';d.innerHTML=chips+(L.length>4?`<span class="c91">+${L.length-4}</span>`:'');
  m.parentElement.insertBefore(d,m)}

/* ② 내일 짜기 맨 위 줄 — 알리기만 */
function alert99(k){
  const L=openTasks().filter(t=>wx91(t)&&calPass(t)&&!hid76(t)).map(t=>Object.assign({t},slack99(t,k))).filter(x=>x.need>0&&x.slack<=0);
  if(!L.length)return '';
  const lab=k===addDays(midKey68(),1)?'내일':dayName68(k);
  return `<div class="al99" role="status">${L.slice(0,3).map(x=>x.slack===0
    ?`<div>⚠ <b>${esc(x.t.title)}</b> · 이번 주 ${x.need}번 남았고 남은 날도 ${x.days}일이에요. 쉬는 날 없이 ${esc(lab)}부터 매일 한 번씩 하면 목표를 채울 수 있어요.</div>`
    :`<div>⚠ <b>${esc(x.t.title)}</b> · ${x.need}번 남았는데 남은 날은 ${x.days}일뿐이에요. 하루에 두 번 하는 날이 있어야 채워요. 이번 주 목표를 줄여도 괜찮아요.</div>`).join('')}<small class="muted">알림만 해요 · 점수·HP는 안 깎여요</small></div>`}
openSheet=(function(prev){return function(){const r=prev.apply(this,arguments);
  try{if(sheetCtx&&sheetCtx.w93){const sc=$('sheetC'),sh=sc&&sc.querySelector('.sh');
    if(sh&&!sc.querySelector('.al99')){const h=alert99(sheetCtx.w93);if(h)sh.insertAdjacentHTML('afterend',h)}}}catch(e){console.error(e)}
  return r}})(openSheet);

/* ④ 하그둘 꼬리표 */
menu61=(function(prev){return function(x,y,title,items){
  try{const t=sheetCtx&&sheetCtx.task&&TASKS[sheetCtx.task];
    if(t&&t.status===0&&t.rep&&t.rep.f==='x'&&Array.isArray(items)&&items.some(i=>i&&i.keep&&i.l==='🗑 삭제')&&!items.some(i=>i&&/하그둘 꼬리표/.test(i.l||''))){
      items=[{l:t.hg99?'🤝 하그둘 꼬리표 끄기':'🤝 하그둘 꼬리표 켜기 <small class="muted">끝낼 때 만남이면 표시</small>',
        f:()=>{try{tsRead()}catch(z){}const u=TASKS[t.id]||t;if(u.hg99)delete u.hg99;else u.hg99=1;saveTask(u);
          toast(u.hg99?'🤝 끝낼 때 아래 알림에서 "하그둘 만남"을 표시할 수 있어요':'🤝 꼬리표를 껐어요');render()}},'-'].concat(items)}}catch(e){console.error(e)}
  return prev.call(this,x,y,title,items)}})(menu61);
function hgOn99(e){try{if(!e||e.tid==null)return false;const t=TASKS[e.tid];return !!(t&&t.hg99&&t.rep&&t.rep.f==='x')}catch(x){return false}}
snack=(function(prev){return function(e,date){const r=prev.apply(this,arguments);
  try{const s=$('snack');if(s&&e&&hgOn99(e)&&!s.querySelector('[data-snack99]')){
    const u=s.querySelector('[data-snack="undo"]'),h=`<button data-snack99="1" aria-pressed="${!!e.hg99}" title="이 기록이 하그둘 만남이었다면">${e.hg99?'🤝✓':'🤝'}</button>`;
    if(u)u.insertAdjacentHTML('beforebegin',h);else s.insertAdjacentHTML('beforeend',h)}}catch(x){console.error(x)}
  return r}})(snack);
addEventListener('click',ev=>{const T=ev.target;if(!T||!T.closest)return;const b=T.closest('[data-snack99]');if(!b)return;
  ev.preventDefault();ev.stopPropagation();if(!snackRef)return;const{date,id}=snackRef,e=((DAYS[date]||{}).entries||[]).find(x=>x.id===id);if(!e)return;
  const n=clone(e);if(n.hg99)delete n.hg99;else n.hg99=1;replaceEntry(date,e,n);
  toast(n.hg99?'🤝 하그둘 만남으로 표시했어요':'🤝 만남 표시를 뺐어요');$('snack').hidden=true},true);
completeTask=(function(prev){return function(t,ctx){
  let day=null,before=null;try{day=curDay();before=new Set(day.entries||[])}catch(x){}
  const r=prev.apply(this,arguments);
  try{if(day&&t&&t.list==='fixed'&&t.aid){const e=(day.entries||[]).find(z=>!before.has(z)&&z.tid===t.id);
    if(e&&!e.hg99&&Object.values(TASKS).some(x=>x.hg99&&x.rep&&x.rep.f==='x'&&x.aid===t.aid)){const n=clone(e);n.hg99=1;replaceEntry(day.date,e,n)}}}catch(x){console.error(x)}
  return r}})(completeTask);

F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['🔁 이번 주 점 7개·여유 일수','캘린더 위 줄 · 🌙 내일 짜기 맨 위','주 N회 할 일(시나리오 쓰기 등)이 이번 주 월~일 어느 날 했는지 점으로 보여요(● 한 날 · ◐ 10분만 · ○ 안 한 날 · ◇ 하기로 정한 날). 남은 횟수와 남은 날이 같아지면(쉬는 날이 없어지면) 내일 짜기 맨 위에서 알려요(점수는 안 깎여요, 목표를 못 채운 게 아니에요). 🌱 10분만 한 날도 1번으로 세요.',()=>{location.hash='tasks'},'주 N회 시나리오 여유 일수 점 10분만'],
  ['🤝 하그둘 꼬리표','할 일 상세 ⋯ · 끝낸 뒤 아래 알림','주 N회 할 일 ⋯ 메뉴에서 켜면, 끝낸 뒤 아래 알림의 🤝로 "이번 기록은 하그둘 만남"을 표시해요. 같은 카드로 이은 정해진 일정(하그둘 만남)을 끝내면 저절로 표시돼요. 캘린더 위 줄에 🤝 n회로 보여요.',()=>{location.hash='tasks'},'하그둘 만남 꼬리표 시나리오']])}})(F67);
