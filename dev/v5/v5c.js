/* ================= v5: 할 일 완료 · 화면 ================= */
function completeTask(t,ctx={}){
  if(!guard())return;
  if(t.status!==0&&!t.rep){toast('이미 끝낸 할 일이에요');return}
  if(!ctx.direct){
    const a=t.aid&&C.actions.find(x=>x.id===t.aid);
    if((a&&a.opts&&a.opts.length)||C.ui.sheet==='always'){openDoneSheet({t,a,...ctx});return}
  }
  const day=curDay(),date=day.date;let e;
  const a=t.aid&&C.actions.find(x=>x.id===t.aid);
  if(a){e=actEntry(a,{vid:ctx.vid||((pickVariant(a)||{}).id),n:ctx.n,amt:ctx.amt});if(t.title!==a.name)e.name=t.title+(e.vid?' · '+(a.opts.find(o=>o.id===e.vid)||{}).name:'')}
  else if(t.brave){const b=taskBase(t);let xp=b.xp;if(recoveryActive())xp=Math.round(xp*C.recovery.mult);
    e={kind:'courage',type:'good',cid:'free',name:t.title,pts:+b.brave.pts||1,xp,gold:b.gold,area:areaOfTask(t),cond:4,...marbleFromLink(b.brave.marble)}}
  else{const b=taskBase(t),n=Math.max(1,+ctx.n||1);let xp=b.xp;if(recoveryActive())xp=Math.round(xp*C.recovery.mult);
    e={kind:'task',type:'good',name:t.title,area:areaOfTask(t),xp:xp*n,gold:b.gold*n,cond:b.cond*n};if(n>1)e.n=n;
    const mk=t.marble||((listOfTask(t)||{}).marble);if(mk){Object.assign(e,marbleFromLink(mk));if(e.jar&&n>1)e.mn=n}
    if(t.due&&date<=t.due&&(C.taskXP||{}).onTime){e.xp+=+C.taskXP.onTime;e.ontime=1}}
  if(!e.area){delete e.area;e.cond=0}
  e.tid=t.id;e.prevDue=t.due||null;e.prevStatus=t.status;e.prevCnt=t.cnt||0;if(t.subs&&t.subs.length)e.prevSubs=clone(t.subs);if(t.wc)e.prevWc=clone(t.wc);if(t.skull)e.prevSkull=t.skull;
  finishCtx(e,ctx,{src:'task',id:t.id});
  if(e.jar)ui.newMarble=e.jar;
  // 할 일 상태 바꾸기
  t.cnt=(t.cnt||0)+1;t.last=date;delete t.skull;
  if(t.rep&&t.rep.f){
    if(t.rep.f==='x'){const ws=weekStart(date);t.wc=t.wc&&t.wc.w===ws?t.wc:{w:ws,n:0};t.wc.n++;
      if(t.wc.n>=(+t.rep.n||3)){t.due=addDays(ws,13);t.wc={w:addDays(ws,7),n:0}}else t.due=addDays(ws,6)}
    else{const base=t.rep.after?date:(t.due&&t.due>=date?t.due:(t.due||date));let nx=nextDue(t.rep,base);
      if(!t.rep.after)while(nx&&nx<=date&&t.due&&t.due<date)nx=nextDue(t.rep,nx);
      if(nx){t.due=nx;(t.subs||[]).forEach(s=>s.done=false)}else{t.status=2;t.doneAt=date}}
  }else{t.status=2;t.doneAt=date}
  commit(()=>applyEntry(day,e));saveTask(t);afterGacha(e);
  fxPop(`+${e.xp} XP${e.jar?' · 구슬':''}`,isBrave(e)?'var(--brave)':'var(--good)');buzz(isBrave(e)?30:15);snack(e,date);
}
function undoTaskFrom(e){
  const t=TASKS[e.tid];if(!t)return;
  t.due=e.prevDue||null;t.status=e.prevStatus===2?2:0;if(t.status===0)delete t.doneAt;t.cnt=e.prevCnt||0;
  if(e.prevSubs)t.subs=e.prevSubs;if(e.prevWc)t.wc=e.prevWc;else if(t.rep&&t.rep.f==='x')delete t.wc;if(e.prevSkull)t.skull=e.prevSkull;
  saveTask(t);
}
function postpone(t,to){
  const td=dateKey();if(t.due&&t.due<=td&&to>t.due)t.skull=(t.skull||0)+1;
  t.due=to;saveTask(t);render();
  if(t.skull>=3)toast(`☠☠☠ 삼진아웃! '${t.title}' 쪼개거나, 가챠로 해치우거나, 버려요`);else toast(`${dueLabel(to)}로 미뤘어요${t.skull?' · ☠'.repeat(1)+t.skull:''}`);
}
/* ---- 스마트 목록 ---- */
const SMART=[['today','📅 오늘'],['tomorrow','🌤 내일'],['week','🗓 다음 7일'],['inbox','📥 받은함'],['focus','🎯 집중'],['nodate','💭 날짜 없음'],['all','📋 전체'],['done','✅ 완료']];
function taskMatches(t,sel){
  const td=dateKey();
  if(sel==='today')return t.status===0&&((t.due&&t.due<=td)||(!t.due&&t.deadline&&t.deadline<=td)||(t.checks||[]).some(c=>c.d===td&&!c.ok));
  if(sel==='tomorrow')return t.status===0&&t.due===addDays(td,1);
  if(sel==='week')return t.status===0&&t.due&&t.due<=addDays(td,7);
  if(sel==='inbox')return t.status===0&&(!t.list||t.list==='inbox');
  if(sel==='nodate')return t.status===0&&!t.due;
  if(sel==='focus')return t.status===0&&(t.tags||[]).includes('집중');
  if(sel==='all')return t.status===0;
  if(sel==='done')return t.status===2;
  if(sel.startsWith('l:'))return t.status===0&&t.list===sel.slice(2);
  if(sel.startsWith('f:'))return t.status===0&&(listOfTask(t)||{}).folder===sel.slice(2);
  if(sel.startsWith('#'))return t.status===0&&(t.tags||[]).includes(sel.slice(1));
  return false;
}
function selTitle(sel){const s=SMART.find(x=>x[0]===sel);if(s)return s[1];if(sel.startsWith('l:'))return listName(sel.slice(2));if(sel.startsWith('f:'))return '📁 '+sel.slice(2);if(sel.startsWith('#'))return sel;return ''}
function taskSorter(by){
  const pr=t=>-(t.prio||0),du=t=>(t.due||'9999')+(t.time||'99:99');
  if(by==='prio')return (a,b)=>pr(a)-pr(b)||du(a).localeCompare(du(b));
  if(by==='title')return (a,b)=>a.title.localeCompare(b.title,'ko');
  if(by==='manual')return (a,b)=>(a.order||0)-(b.order||0);
  if(by==='created')return (a,b)=>(b.created||'').localeCompare(a.created||'');
  return (a,b)=>du(a).localeCompare(du(b))||pr(a)-pr(b)||(a.order||0)-(b.order||0);
}
function dateBucket(t){const td=dateKey();if(!t.due)return['9','날짜 없음'];if(t.due<td)return['0','지난 할 일'];if(t.due===td)return['1','오늘'];if(t.due===addDays(td,1))return['2','내일'];if(t.due<=addDays(td,7))return['3','다음 7일'];return['4','나중에']}
function taskRow(t,{showList=true,compact=false}={}){
  const td=dateKey(),late=t.status===0&&t.due&&t.due<td,b=taskBase(t);
  const sd=(t.subs||[]).length,sdn=(t.subs||[]).filter(s=>s.done).length;
  const meta=[];
  if(t.due)meta.push(`<span class="${late?'late':t.due===td?'tday':''}">${esc(dueLabel(t.due))}${t.time?' '+t.time:''}</span>`);
  if(t.dur)meta.push(`<span>⏱${durTxt(t.dur)}</span>`);
  if(t.rep)meta.push(`<span title="${esc(repLabel(t.rep))}">🔁${t.rep.f==='x'?` ${wkCnt91(t,weekStart(td))}/${t.rep.n||3}${slotTxt91(t,weekStart(td))}`:''}</span>`);
  if(sd)meta.push(`<span><span class="subbar"><i style="width:${sdn/sd*100}%"></i></span> ${sdn}/${sd}</span>`);
  if(showList&&t.list&&t.list!=='inbox')meta.push(`<span>${esc(listName(t.list))}</span>`);
  {const ar=C.areas.find(x=>x.id===areaOfTask(t));if(ar&&!compact)meta.push(`<span class="areac">${esc(ar.name)}</span>`)}
  (t.tags||[]).slice(0,3).forEach(x=>meta.push(x==='집중'?`<span class="tagc focus">🎯집중</span>`:`<span class="tagc">#${esc(x)}</span>`));
  if(t.deadline){const dd=diffDays(t.deadline,td);meta.push(`<span class="${dd<0?'late':dd<=2?'tday':''}" title="마감일">⏳마감 ${esc(dueLabel(t.deadline))}</span>`)}
  {const ck=(t.checks||[]).filter(c=>!c.ok).sort((a,b)=>a.d.localeCompare(b.d))[0];if(ck)meta.push(`<span class="${ck.d<=td?'tday':''}" title="중간 점검">◇점검 ${esc(dueLabel(ck.d))}${ck.n?' '+esc(ck.n):''}</span>`)}
  if(t.skull)meta.push(`<span class="skull" title="미룬 횟수">${'☠'.repeat(Math.min(3,t.skull))}</span>`);
  if(t.reframe)meta.push(`<button class="rfbtn" data-treframe="${t.id}" title="다르게 보기">💭</button>`);
  if(t.aid)meta.push(`<span title="습관과 연결">🔗</span>`);
  if(gachaMatch('task',t.id))meta.push(`<span style="color:var(--accent);font-weight:700">🎲 퀘스트</span>`);
  if(t.hist&&t.hist.n&&!compact)meta.push(`<span title="틱틱에서 완료한 횟수">틱틱 ${t.hist.n}번</span>`);
  return `<div class="trow p${t.prio||0} ${t.status===2?'done':''} ${t.brave?'brave':''} ${ui.msel&&ui.msel.has(t.id)?'msel':''}" data-task="${t.id}" data-drag="task:${t.id}" data-dragmode="hold">
    <button class="tchk" data-tdone="${t.id}" aria-label="${esc(t.title)} 완료">${t.status===2?'✓':''}</button>
    <span class="tb"><span class="tt">${pmark(t.prio)} ${t.brave?'⚡ ':''}${esc(t.title)}</span>${meta.length?`<span class="tm">${meta.join('')}</span>`:''}</span>
    <span class="tx">${t.status===2?'':(t.brave?'⚡':'')+'+'+b.xp+(b.gold?` <span class="g">🪙${b.gold}</span>`:'')}</span>
    ${t.status===0?`<button class="trun" data-trun="${t.id}" aria-label="${esc(t.title)} 타이머로 하기" title="타이머로 하기">⏱</button>`:'<span></span>'}
  </div>`;
}
function renderTasks(){
  if(curView()!=='tasks')return;
  const T=C.ui.tasks,sel=T.sel||'today',all=Object.values(TASKS);
  const cnt=s=>all.filter(t=>taskMatches(t,s)).length;
  const folders=[...new Set(C.lists.map(l=>l.folder).filter(Boolean))];
  const lb=l=>`<button data-tsel="l:${l.id}" aria-pressed="${sel==='l:'+l.id}" data-rowid="${l.id}" data-drag="row:${l.id}" data-dragmode="hold" data-drop="tolist:${l.id}" ${l.desc?`title="${esc(l.desc)}"`:''}>${esc(l.name)}<span class="c">${cnt('l:'+l.id)||''}</span></button>`;
  const SDROP={today:1,tomorrow:1,inbox:1,nodate:1,focus:1};let lh='';const seenF=new Set();
  C.lists.filter(l=>l.id!=='inbox').forEach(l=>{if(!l.folder){lh+=lb(l);return}if(seenF.has(l.folder))return;seenF.add(l.folder);lh+=`<div class="fold">📁 ${esc(l.folder)}</div>`+C.lists.filter(x=>x.folder===l.folder).map(lb).join('')});
  const tags={};openTasks().forEach(t=>(t.tags||[]).forEach(x=>tags[x]=(tags[x]||0)+1));
  const side=`<div data-drop="reorder:smart">`+smartList().map(([k,l])=>`<button data-tsel="${k}" aria-pressed="${sel===k}" data-rowid="${k}" data-drag="row:${k}" data-dragmode="hold" ${SDROP[k]?`data-drop="tosmart:${k}"`:''}>${l}<span class="c">${k==='done'?'':cnt(k)||''}</span></button>`).join('')+`</div>`
    +`<div class="fold">목록 <span class="tiny" style="font-weight:400">· 끌어서 순서</span></div><div data-drop="reorder:lists">`+lh+`</div>`
    +`<button data-tlistadd="1" style="color:var(--accent)">＋ 새 목록</button>`
    +(Object.keys(tags).length?`<div class="fold">태그</div>`+Object.entries(tags).sort((a,b)=>b[1]-a[1]).slice(0,14).map(([k,n])=>`<button data-tsel="#${esc(k)}" aria-pressed="${sel==='#'+k}">#${esc(k)}<span class="c">${n}</span></button>`).join(''):'');
  if(!DND.on&&$('tSide').innerHTML!==side)$('tSide').innerHTML=side;
  $('tChips').innerHTML=smartList().filter(x=>x[0]!=='done').map(([k,l])=>`<button class="chipbtn" data-tsel="${k}" aria-pressed="${sel===k}">${l} ${cnt(k)||''}</button>`).join('')
    +`<select id="tListSel" aria-label="목록 고르기" style="width:auto;flex:none;padding:4px 8px;font-size:13px;border-radius:999px"><option value="">📂 목록…</option>${C.lists.filter(l=>l.id!=='inbox').map(l=>`<option value="l:${l.id}" ${sel==='l:'+l.id?'selected':''}>${esc((l.folder?l.folder+' / ':'')+l.name)} (${cnt('l:'+l.id)})</option>`).join('')}<option value="done" ${sel==='done'?'selected':''}>✅ 완료</option></select>`;
  $('tTitle').textContent=selTitle(sel);
  $('tGroup').innerHTML=[['auto','묶기: 자동'],['date','날짜별'],['list','목록별'],['prio','중요도별'],['sec','칸(섹션)별'],['none','안 묶음']].map(([v,l])=>`<option value="${v}" ${T.group===v?'selected':''}>${l}</option>`).join('');
  $('tSort').innerHTML=[['due','정렬: 날짜'],['prio','중요도'],['manual','직접(끌기)'],['title','이름'],['created','최근 추가']].map(([v,l])=>`<option value="${v}" ${T.sort===v?'selected':''}>${l}</option>`).join('');
  let list=all.filter(t=>taskMatches(t,sel));
  if(sel==='done'){const ds=Object.values(DAYS).flatMap(d=>(d.entries||[]).filter(e=>e.tid).map(e=>({e,d:d.date}))).sort((a,b)=>(b.d+b.e.t).localeCompare(a.d+a.e.t)).slice(0,120);
    $('tCount').textContent=ds.length+'개';
    $('tList').innerHTML=ds.length?`<ul class="log">${ds.map(x=>logRow(x.d,x.e)).join('')}</ul><p class="small muted">완료한 할 일 기록이에요. 되돌리면 할 일이 다시 열려요.</p>`:'<div class="empty">아직 완료한 할 일이 없어요.</div>';return}
  list.sort(taskSorter(T.sort));
  $('tCount').textContent=list.length+'개'+(sel==='today'?todayFeedback():'');
  let grp=T.group;if(grp==='auto')grp=sel.startsWith('l:')&&list.some(t=>t.sec)?'sec':(T.sort==='manual'?'none':'date');
  let groups;
  if(grp==='date'){const m={};list.forEach(t=>{const[k,n]=dateBucket(t);(m[k]=m[k]||{key:'d'+k,name:n,list:[]}).list.push(t)});groups=Object.keys(m).sort().map(k=>m[k])}
  else if(grp==='list'){const m={};list.forEach(t=>{const k=t.list||'inbox';(m[k]=m[k]||{key:'l'+k,name:listName(k),list:[]}).list.push(t)});groups=Object.values(m)}
  else if(grp==='prio'){groups=[5,3,1,0].map(p=>({key:'p'+p,name:p?PRIOS.find(x=>x[0]===p)[2]+' '+PRIOS.find(x=>x[0]===p)[1]:'중요도 없음',list:list.filter(t=>(t.prio||0)===p)}))}
  else if(grp==='sec'){const m={};list.forEach(t=>{const k=t.sec||'—';(m[k]=m[k]||{key:'s'+k,name:t.sec||'칸 없음',list:[]}).list.push(t)});groups=Object.values(m)}
  else groups=[{key:'',name:'',list}];
  const showList=!sel.startsWith('l:');
  $('tList').innerHTML=list.length?groups.filter(g=>g.list.length).map(g=>{const shut=g.key&&C.ui.collapsed['tg'+g.key];
    return `<div class="tgroup">${g.name?`<button class="ghead ${shut?'shut':''}" data-tgcollapse="${esc(g.key)}">${ic('chev')}${esc(g.name)} <span class="c">${g.list.length}</span></button>`:''}${shut?'':`<div data-drop="reorder:tasks" data-grp="${esc(g.key)}">${g.list.map(t=>taskRow(t,{showList})).join('')}</div>`}</div>`}).join('')
    :`<div class="empty">${sel==='today'?'오늘 할 일이 없어요. 위에 적거나, 🎲 뽑기로 하나 골라요.':'비어 있어요. 위에 적어서 추가해요.'}</div>`;
  if(sel==='today')$('tList').insertAdjacentHTML('beforeend',todayHabitsHTML());
  if(sel.startsWith('l:'))$('tList').insertAdjacentHTML('afterbegin',listRoutinesHTML(sel.slice(2)));
  $('tList').insertAdjacentHTML('beforeend',completedHTML(sel)+wontHTML(sel));
  drawMsel();
}
function completedHTML(sel){
  const td=dateKey(),days=sel==='today'?[td]:lastNDates(7).reverse();const out=[];
  days.forEach(k=>((DAYS[k]&&DAYS[k].entries)||[]).forEach(e=>{if(!e.tid)return;const t=TASKS[e.tid];if(sel.startsWith('l:')&&(!t||t.list!==sel.slice(2)))return;if(sel.startsWith('#')&&(!t||!(t.tags||[]).includes(sel.slice(1))))return;if(['tomorrow','nodate'].includes(sel))return;out.push({k,e})}));
  if(!out.length)return '';const shut=C.ui.collapsed.tcompl!==false;
  return `<div class="tgroup tcomp"><div class="row" style="justify-content:space-between"><button class="ghead ${shut?'shut':''}" data-tcompl="1">${ic('chev')}완료 <span class="c">${out.length}</span></button><button class="btn ghost sm" data-undo="1" title="Ctrl+Z">↶ 방금 것 되돌리기</button></div>${shut?'':out.map(({k,e})=>`<div class="trow done" data-entry="${k}|${e.id}"><button class="tchk" data-rm="${e.id}" data-date="${k}" aria-label="${esc(e.name)} 되돌리기" title="눌러서 되돌리기">✓</button><span class="tb"><span class="tt">${esc(e.name)}</span><span class="tm"><span>${k===td?'오늘':fmtD(k)} ${esc(e.t)}</span></span></span><span class="tx">+${e.xp||0}</span><span></span></div>`).join('')}</div>`;
}
/* ---- 할 일 자세히 ---- */
function openTaskSheet(id){
  const t=TASKS[id];if(!t)return;sheetCtx={task:id};drawTaskSheet();
}
function drawTaskSheet(){
  const t=TASKS[sheetCtx&&sheetCtx.task];if(!t)return;const td=dateKey();
  const r=t.rep||{};const b=taskBase(t);
  const acts=C.actions.filter(a=>a.type==='good');
  const wdn=WDK[(r.f==='w'&&(r.wd||[]).length===1)?r.wd[0]:dowOf(t.due||td)],mdn=(r.f==='m'&&(r.md||[]).length===1)?(r.md[0]===-1?'말':r.md[0]):+(t.due||td).slice(8);
  const presets=[['','반복 안 함'],['d','매일'],['wd','평일 (월~금)'],['we','주말 (토·일)'],['w',`매주 ${wdn}요일`],['w2',`격주 ${wdn}요일`],['m',`매월 ${mdn}일`],['y','매년 이 날'],['x','한 주에 N번'],['after','끝내고 N일 뒤'],['custom','직접 입력…']];
  const curP=repPresetOf(t);
  const endV=t.time&&t.dur?hm(toMin(t.time)+(+t.dur)):'';
  let h=`<div class="sh"><h3>${t.status===2?'✓ ':''}할 일</h3><span class="row" style="gap:4px"><span class="chip up">+${b.xp} XP</span><button class="x" data-sheet="close" aria-label="닫기">×</button></span></div>
  <p class="tiny muted" style="margin:-4px 0 0">${rewardExplain(t)}</p>
  <input id="tsTitle" value="${esc(t.title)}" maxlength="160" style="font-size:17px;font-weight:700" aria-label="제목">
  <textarea id="tsNote" rows="${Math.min(8,Math.max(2,(t.note||'').split('\n').length))}" placeholder="메모" aria-label="메모">${esc(t.note||'')}</textarea>
  ${t.reframe||true?`<details ${t.reframe?'open':''}><summary class="small" style="cursor:pointer;color:var(--brave);font-weight:700">💭 하기 싫을 때 읽을 문구</summary><textarea id="tsReframe" rows="3" placeholder="예: 생각보다 금방 끝나. 끝나면 개운해." style="margin-top:6px">${esc(t.reframe||'')}</textarea></details>`:''}
  <div class="f2">
    <label class="f">날짜 (할 날)<span class="inx"><input id="tsDue" type="date" value="${t.due||''}">${t.due?'<button class="x" data-tsclr="due" title="날짜 지우기" aria-label="날짜 지우기">✕</button>':''}</span></label>
    <label class="f">⏳ 마감일<span class="inx"><input id="tsDl" type="date" value="${t.deadline||''}">${t.deadline?'<button class="x" data-tsclr="dl" aria-label="마감일 지우기">✕</button>':''}</span></label>
    <label class="f">목록<select id="tsList">${[{id:'inbox',name:'📥 받은함'},...C.lists.filter(l=>l.id!=='inbox')].map(l=>`<option value="${l.id}" ${(t.list||'inbox')===l.id?'selected':''}>${esc((l.folder?l.folder+' / ':'')+l.name)}</option>`).join('')}</select></label>
  </div>
  <div class="f"><span class="small muted">시간 <b class="tlabel">${t.time?esc(ampm(t.time)+(endV?' – '+ampm(endV):'')+(t.dur?` (${t.dur}분)`:'')):(t.dur?`종일 · ${t.dur}분 걸림`:'종일')}</b></span>
    <span class="trange"><input id="tsTime" type="time" value="${t.time||''}" aria-label="시작 시각"><span class="muted">–</span><input id="tsEnd" type="time" value="${endV}" aria-label="끝 시각" ${t.time?'':'disabled'}>${t.time?'<button class="x" data-tsclr="time" title="시간 지우기 (종일로)" aria-label="시간 지우기">✕</button>':`<label class="tiny muted durin">걸림<input id="tsDur" type="number" min="0" max="600" step="5" value="${t.dur||''}" aria-label="걸리는 시간(분)">분</label>`}</span></div>
  <div class="row" style="gap:6px"><span class="small muted">빠른 입력:</span>${[['오늘',td],['내일',addDays(td,1)],['주말',(()=>{let d=addDays(weekStart(td),5);return d<td?addDays(d,7):d})()],['다음 주',addDays(weekStart(td),7)],['날짜 없음','']].map(([l,k])=>`<button class="chipbtn" data-tsdue="${k}">${l}</button>`).join('')}</div>
  <div class="cks"><div class="small muted">◇ 중간 점검일 <span class="tiny">— 마감 전에 확인할 날을 원하는 만큼</span></div>${(t.checks||[]).map((c,i)=>`<div class="ckr"><input type="checkbox" data-ck="${i}" data-f="ok" ${c.ok?'checked':''} style="width:auto" aria-label="점검 완료"><input type="date" data-ck="${i}" data-f="d" value="${c.d}"><input data-ck="${i}" data-f="n" value="${esc(c.n||'')}" placeholder="무엇을 점검?"><button class="x" data-tsck="${i}" aria-label="점검일 지우기">×</button></div>`).join('')}<button class="btn ghost sm" data-tsck="add">＋ 중간 점검일</button></div>
  <div class="row" style="gap:10px;align-items:center"><span class="small muted">중요도</span><span class="flags">${[...PRIOS].reverse().map(([p,l,m])=>`<button class="flag p${p}" data-tsprio="${p}" aria-pressed="${(t.prio||0)===p}" data-tip="${l}" title="중요도 ${l}" aria-label="중요도 ${l}"><svg viewBox="0 0 24 24" class="ico"><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></svg><small>${m||'—'}</small></button>`).join('')}</span>
    <span class="small muted" style="margin-left:auto">반복</span><select id="tsRepSel" aria-label="반복" style="width:auto;max-width:190px">${presets.map(([k,l])=>`<option value="${k}" ${curP===k?'selected':''}>${esc(l)}</option>`).join('')}</select></div>
  <div><div class="small muted" style="margin-bottom:4px">크기 (보상)</div><div class="seg">${EFFORTS.map(([k,l,d])=>`<button data-tseff="${k}" aria-pressed="${effortOf(t)===k}">${l} <small class="muted">${d} · +${(+(C.taskXP||{})[k]||0)}</small></button>`).join('')}<button data-tsbrave="1" aria-pressed="${!!t.brave}" title="두렵거나 망설여지는 일">⚡ 용기</button></div></div>
  ${t.rep||curP==='custom'?`<div class="repbox">
      ${curP==='x'?`<label class="row tiny" style="gap:6px">한 주에<input id="tsRepN" type="number" min="1" max="14" value="${r.n||3}" style="width:64px">번</label>`:''}
      ${curP==='after'?`<label class="row tiny" style="gap:6px">끝내고<input id="tsRepI" type="number" min="1" max="99" value="${r.i||1}" style="width:64px">일 뒤에 다시</label>`:''}
      ${curP==='custom'?`<label class="f">직접 입력 <span class="tiny muted">— 예: 격주 토요일 · 매월 말일 · 3일마다 · 매주 월 수 금</span><input id="tsRepTxt" placeholder="말로 적고 Enter" enterkeyhint="done" autocomplete="off"></label>`:''}
      ${r.f==='w'&&(curP==='custom'||curP==='w'||curP==='w2')?`<div class="wdays">${[1,2,3,4,5,6,0].map(w=>`<button data-tswd="${w}" aria-pressed="${(r.wd||[]).includes(w)}">${WDK[w]}</button>`).join('')}</div>`:''}
      ${curP==='custom'&&r.f==='m'?`<label class="f">기준<select id="tsRepM"><option value="md" ${!r.nth?'selected':''}>날짜(${(r.md||[t.due?+t.due.slice(8):1]).join(',')}일)</option>${[1,2,3,4,-1].map(n=>[0,1,2,3,4,5,6].map(w=>`<option value="${n},${w}" ${r.nth&&r.nth[0]===n&&r.nth[1]===w?'selected':''}>${n===-1?'마지막':n+'째'} ${WDK[w]}요일</option>`).join('')).join('')}</select></label>`:''}
      ${curP==='custom'&&r.f==='m'&&!r.nth?`<label class="f">매월 며칠 (쉼표, 말일은 -1)<input id="tsRepMd" value="${(r.md||[]).join(',')}" placeholder="예: 10, 25"></label>`:''}
      ${curP==='custom'||r.until?`<label class="row tiny" style="gap:6px">끝나는 날<input id="tsRepUntil" type="date" value="${r.until||''}" style="width:auto"></label>`:''}
      ${t.rep?`<p class="tiny muted" style="margin:0">🔁 ${esc(repLabel(t.rep))}${t.due?` · 다음: ${esc(dueLabel(t.due))}`:''}${t.cnt?` · 지금까지 ${t.cnt}번`:''}</p>`:''}
  </div>`:''}
  <div><div class="small muted" style="margin-bottom:4px">하위 할 일 ${(t.subs||[]).length?`${(t.subs||[]).filter(s=>s.done).length}/${t.subs.length}`:''}</div><div class="subs">${(t.subs||[]).map((s,i)=>`<div class="sr ${s.done?'on':''}"><input type="checkbox" data-tssub="${i}" ${s.done?'checked':''} style="width:auto" aria-label="${esc(s.t)} 완료"><input type="text" data-tssubt="${i}" value="${esc(s.t)}" aria-label="하위 할 일"><button class="x" data-tssubdel="${i}" aria-label="지우기">×</button></div>`).join('')}
    <form class="sr" data-tssubadd="1"><span class="muted" style="text-align:center">＋</span><input type="text" id="tsSubNew" placeholder="하위 할 일 추가" enterkeyhint="done"><span></span></form></div></div>
  <details><summary class="small" style="cursor:pointer;font-weight:700">더 보기 · 습관 연결 · 태그 · 영역</summary><div class="f2" style="margin-top:8px">
    <label class="f">태그 (쉼표)<input id="tsTags" value="${esc((t.tags||[]).join(', '))}"></label>
    <label class="f">습관과 연결 ${t.aid?'':'<button class="btn ghost sm" data-tohabit="1" style="padding:1px 6px;font-size:11px">이 할 일로 습관 만들기</button>'}<select id="tsAid"><option value="">없음 (할 일 점수)</option>${acts.map(a=>`<option value="${a.id}" ${t.aid===a.id?'selected':''}>${esc(a.name)} · +${a.xp}</option>`).join('')}</select></label>
    <label class="f">컨디션 영역<select id="tsArea"><option value="">자동 (${esc((C.areas.find(x=>x.id===(tagArea(t)||((t.aid&&C.actions.find(x=>x.id===t.aid))||{}).area))||{}).name||'없음 · 컨디션 변화 없음')})</option>${C.areas.map(a=>`<option value="${a.id}" ${t.area===a.id?'selected':''}>${esc(a.name)}</option>`).join('')}</select></label>
    <label class="f">끝내면 넣을 구슬<select id="tsMarble">${jarSelOpts().map(([v,l])=>`<option value="${esc(v)}" ${(t.marble||'')===v?'selected':''}>${esc(l)}</option>`).join('')}</select></label>
    ${t.sec?`<label class="f">칸(섹션)<input id="tsSec" value="${esc(t.sec)}"></label>`:''}
  </div>${t.hist&&t.hist.n?`<p class="tiny muted">틱틱에서 ${t.hist.n}번 완료 · 마지막 ${esc(t.hist.last||'')}</p>`:''}${t.skull?`<p class="small" style="color:var(--bad)">${'☠'.repeat(Math.min(3,t.skull))} ${t.skull}번 미뤘어요. 3번이면 삼진아웃: 쪼개거나, 가챠로 해치우거나, 버려요.</p>`:''}</details>
  <div class="row" style="justify-content:space-between">
    <span class="row" style="gap:6px"><button class="btn ghost sm" data-tsact="del">지우기</button>${t.status===0?`<button class="btn ghost sm" data-tsact="drop">포기</button><button class="btn ghost sm" data-tsact="tomorrow">내일로 미루기</button>`:`<button class="btn ghost sm" data-tsact="reopen">다시 열기</button>`}</span>
    <span class="row" style="gap:6px">${t.status===0?`<button class="btn ghost" data-tsact="timer">⏱ 타이머</button><button class="btn ghost donebtn" data-tsact="done">☑ 할 일 끝냄</button>`:''}<button class="btn" data-tsdone2="1" title="Ctrl+Enter">편집 끝</button></span>
  </div>`;
  openSheet(h,()=>{});
}
function tsRead(){
  const t=TASKS[sheetCtx&&sheetCtx.task];if(!t)return null;const g=id=>$(id)?$(id).value:undefined;
  const ti=(g('tsTitle')||'').trim();if(ti)t.title=ti;t.note=g('tsNote')||'';
  if(g('tsReframe')!==undefined){const rf=g('tsReframe').trim();if(rf)t.reframe=rf;else delete t.reframe}
  const due=g('tsDue')||null;if(due!==t.due){if(t.due&&t.due<=dateKey()&&due&&due>t.due)t.skull=(t.skull||0)+1;t.due=due}
  t.time=g('tsTime')||null;if(t.time&&!t.due)t.due=dateKey();
  {const en=g('tsEnd');if(t.time&&en){let d=toMin(en)-toMin(t.time);if(d<=0)d+=1440;t.dur=d}else if(g('tsDur')!==undefined){const du=parseInt(g('tsDur'));t.dur=du>0?du:null}}
  if(g('tsDl')!==undefined){if(g('tsDl'))t.deadline=g('tsDl');else delete t.deadline}
  t.list=g('tsList')||'inbox';
  if(g('tsTags')!==undefined)t.tags=g('tsTags').split(/[,，]/).map(x=>x.trim().replace(/^#/,'')).filter(Boolean);
  if(g('tsAid')!==undefined){if(g('tsAid'))t.aid=g('tsAid');else delete t.aid}
  if(g('tsArea')!==undefined){if(g('tsArea'))t.area=g('tsArea');else delete t.area}
  if(g('tsMarble')!==undefined){if(g('tsMarble'))t.marble=g('tsMarble');else delete t.marble}
  if(g('tsSec')!==undefined){const s=g('tsSec').trim();if(s)t.sec=s;else delete t.sec}
  if(t.rep){const r=t.rep;
    if(g('tsRepI')!==undefined)r.i=Math.max(1,parseInt(g('tsRepI'))||1);
    if(g('tsRepN')!==undefined)r.n=Math.max(1,parseInt(g('tsRepN'))||3);
    if(g('tsRepAfter')!==undefined){if(g('tsRepAfter'))r.after=1;else delete r.after}
    if(g('tsRepUntil')!==undefined){if(g('tsRepUntil'))r.until=g('tsRepUntil');else delete r.until}
    if(g('tsRepM')!==undefined){const v=g('tsRepM');if(v==='md')delete r.nth;else r.nth=v.split(',').map(Number)}
    if(g('tsRepMd')!==undefined){const md=g('tsRepMd').split(/[,\s]+/).map(Number).filter(x=>x===-1||(x>=1&&x<=31));if(md.length)r.md=md;else delete r.md}
    (t.subs||[]).forEach((s,i)=>{const el=document.querySelector(`[data-tssubt="${i}"]`);if(el&&el.value.trim())s.t=el.value.trim()});
  }else (t.subs||[]).forEach((s,i)=>{const el=document.querySelector(`[data-tssubt="${i}"]`);if(el&&el.value.trim())s.t=el.value.trim()});
  return t;
}
function tsCommit(redraw=true,read=true){const t=read?tsRead():TASKS[sheetCtx&&sheetCtx.task];if(!t)return;saveTask(t);if(redraw){const y=$('sheetC').scrollTop;drawTaskSheet();$('sheetC').scrollTop=y}render()}
function setRepPreset(t,k){
  const td=t.due||dateKey(),wd=dowOf(td);
  if(!k){delete t.rep;delete t.wc;return}
  if(!t.due)t.due=dateKey();
  t.rep=k==='d'?{f:'d',i:1}:k==='wd'?{f:'w',i:1,wd:[1,2,3,4,5]}:k==='we'?{f:'w',i:1,wd:[6,0]}:k==='w'?{f:'w',i:1,wd:[wd]}:k==='w2'?{f:'w',i:2,wd:[wd]}:k==='m'?{f:'m',i:1,md:[+td.slice(8)]}:k==='y'?{f:'y',i:1}:k==='x'?{f:'x',n:3}:{f:'d',i:3,after:1};
  if(k==='x')t.due=addDays(weekStart(dateKey()),6);
}
