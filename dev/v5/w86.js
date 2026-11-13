/* ---- v8.7 (w86.js): J8/F3 주 N회 할 일을 날마다 다른 시각으로 놓기 + 이번 주 n/N 카운터 ----
   t.sl91 = {날짜:'HH:MM' 또는 ''} — 주 N회(rep.f==='x') 할 일의 '이 날 하기로 한 자리'. 한 주 안에 여러 날·날마다 다른 시각 가능(''=종일 칸).
   · 슬롯이 있는 주는 기본 자리(그 주 일요일)에서 빠지고 슬롯 날에만 그려짐(tasksOn 맨 바깥 감싸개). 슬롯을 놓은 날이 안 지켜져도 미룸(☠) 아님.
   · 시간표·종일 칸·월 칸에 끌어 놓으면 '날짜를 옮김'이 아니라 슬롯 추가(dndEnd 감싸개). 슬롯 블록을 서랍(tray)으로 끌면 그 슬롯만 빠짐.
   · 이번 주 횟수 wkCnt91 = 그 주 기록 중 이 할 일(tid) 또는 같은 카드(aid)로 한 것 → 같은 카드로 이은 '하나 그리고 둘' 기록도 시나리오 5회에 포함.
   · 카운터: 목록 줄 🔁 n/N(v5c) · 캘린더 위 줄 .wk91. 월 칸은 슬롯 안 그림(기본 자리 그대로). */
function wx91(t){return !!(t&&t.status===0&&t.rep&&t.rep.f==='x')}
function wkCnt91(t,ws){let n=0;if(!t||!ws)return 0;for(let i=0;i<7;i++){const d=DAYS[addDays(ws,i)];if(!d)continue;
  (d.entries||[]).forEach(e=>{if(e.tid===t.id||(t.aid&&e.aid===t.aid&&e.tid!=null))n++})}
  return n}
function slotKeys91(t,ws){return Object.keys(t.sl91||{}).filter(k=>weekStart(k)===ws).sort()}
function slotTxt91(t,ws){const ks=slotKeys91(t,ws);return ks.length?' · '+ks.map(k=>wdOf(k)).join('')+(ks.some(k=>t.sl91[k])?'':'') :''}
function slotDoneOn91(t,k){const d=DAYS[k];return !!(d&&(d.entries||[]).some(e=>e.tid===t.id))}
tasksOn=(function(prev){return function(k){
  const a=prev.apply(this,arguments);
  try{const ws=weekStart(k),td=midKey68();
    const base=a.filter(t=>!(wx91(t)&&t.sl91&&slotKeys91(t,ws).length));
    openTasks().forEach(t=>{if(!wx91(t)||!t.sl91||t.sl91[k]===undefined||!calPass(t))return;
      if(k<td||slotDoneOn91(t,k)||wkCnt91(t,ws)>=(+t.rep.n||3))return;
      const c=Object.assign({},t,{due:k,time:t.sl91[k]||null});base.push(c)});
    return base}catch(e){console.error(e);return a}}})(tasksOn);

function srcDate91(el){const q=el&&el.closest&&el.closest('[data-drop^="col:"],[data-drop^="allday:"],[data-drop^="day:"]');
  if(!q)return null;const d=q.dataset.drop;return d.slice(d.indexOf(':')+1)}
dndEnd=(function(prev){return function(x,y){
  try{const kind=DND.kind,id=DND.id,drop=DND.drop,t=TASKS[id];
    if((kind==='task'||kind==='block')&&wx91(t)&&drop&&['time','allday','day','tray'].includes(drop.type)&&!(ui.msel&&ui.msel.size>1)){
      const sd=srcDate91(DND.el),has=!!(sd&&t.sl91&&t.sl91[sd]!==undefined);
      if(drop.type==='tray'&&!has)return prev.apply(this,arguments);
      DND.drop=null;const r=prev.apply(this,arguments);
      t.sl91=t.sl91||{};
      if(drop.type==='tray'){delete t.sl91[sd];toast(`${t.title} · ${fmtD(sd)} 자리를 뺐어요`)}
      else{const nd=drop.date,tm=drop.type==='time'?hm(drop.min):'';
        if(has&&sd!==nd)delete t.sl91[sd];
        t.sl91[nd]=tm;if(tm&&!t.dur)t.dur=30;
        const lim=addDays(weekStart(midKey68()),-14);Object.keys(t.sl91).forEach(k=>{if(k<lim)delete t.sl91[k]});
        const ws=weekStart(nd),n=slotKeys91(t,ws).length;
        toast(`${t.title} → ${dueLabel(nd)}${tm?' '+tm:''} · 이번 주 자리 ${n}/${t.rep.n||3}`);ui.calSel=nd}
      if(!Object.keys(t.sl91).length)delete t.sl91;
      saveTask(t);ui.calKeepScroll=true;render();return r}}catch(e){console.error(e)}
  return prev.apply(this,arguments)}})(dndEnd);

/* 캘린더 위 '이번 주 n/N' 줄 */
function strip91(){const m=$('calMain');if(!m||!m.parentElement)return;
  const old=m.parentElement.querySelector(':scope > .wk91');if(old)old.remove();
  const md=(C.ui.cal||{}).mode,td=midKey68();
  const ws=weekStart(md==='month'||md==='agenda'?td:(ui.calAnchor||td)),L=openTasks().filter(t=>wx91(t)&&calPass(t));if(!L.length)return;
  const chips=L.slice(0,4).map(t=>{const n=wkCnt91(t,ws),N=+t.rep.n||3,ks=slotKeys91(t,ws);
    return `<span class="c91${n>=N?' ok':''}" title="이번 주 ${n}/${N}회${ks.length?' · 정해 둔 날 '+ks.map(k=>fmtD(k)+(t.sl91[k]?' '+t.sl91[k]:'')).join(', '):''}">${n>=N?'✓':'🔁'} ${esc(t.title)} <b>${n}/${N}</b>${ks.length?`<i>자리 ${ks.length}</i>`:''}</span>`}).join('');
  const d=document.createElement('div');d.className='wk91';d.innerHTML=chips+(L.length>4?`<span class="c91">+${L.length-4}</span>`:'');
  m.parentElement.insertBefore(d,m)}
renderCal=(function(prev){return function(){const x=prev.apply(this,arguments);try{if(calShown())strip91()}catch(e){console.error(e)}return x}})(renderCal);

F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['🔁 주 N회 자리','캘린더 시간표·할 일 목록','주 N회 할 일을 시간표나 종일 칸에 끌어 놓으면 그 날(시각)이 이번 주 자리로 남아요. 날마다 시각이 달라도 되고, 안 지켜도 미룸이 아니에요. 캘린더 위 줄과 목록 줄에 이번 주 n/N이 보여요.']])}})(F67);
