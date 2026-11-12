/* ================= v5: 캘린더 ================= */
const PXM=0.8; // 1분 = 0.8px (1시간 48px)
function calState(){const c=C.ui.cal||(C.ui.cal={mode:'month',actual:true});if(!ui.calAnchor)ui.calAnchor=dateKey();if(!ui.calSel)ui.calSel=dateKey();return c}
function monthKey(k){return k.slice(0,7)+'-01'}
function addMonths(k,n){const[y,m]=k.split('-').map(Number);const mm0=m-1+n;const yy=y+Math.floor(mm0/12),mm=((mm0%12)+12)%12+1;return ymd(yy,mm,1)}
function calPass(t){const f=(C.ui.cal||{}).filter||{};if(f.lists&&f.lists.length&&!f.lists.includes(t.list||'inbox'))return false;if(f.areas&&f.areas.length&&!f.areas.includes(areaOfTask(t)))return false;if(f.tags&&f.tags.length&&!(t.tags||[]).some(x=>f.tags.includes(x)))return false;return true}
function calFilterN(){const f=(C.ui.cal||{}).filter||{};return (f.lists||[]).length+(f.areas||[]).length+(f.tags||[]).length}
function tasksOn(k){return openTasks().filter(t=>t.due===k&&calPass(t))}
// 시간 접기: 0~F시는 얇은 띠로
const FOLDB=26;
function foldH(){const c=C.ui.cal||{};return c.foldOn===false?0:(+c.fold||0)}
function yOf(m){const F=foldH()*60;if(!F)return m*PXM;return m<F?m/F*FOLDB:FOLDB+(m-F)*PXM}
function mOf(y){const F=foldH()*60;if(!F)return y/PXM;return y<FOLDB?y/FOLDB*F:F+(y-FOLDB)/PXM}
function gridH(){const F=foldH()*60;return F?FOLDB+(1440-F)*PXM:1440*PXM}
function calShown(){return curView()==='cal'||splitOn()}
function doneOn(k){const d=DAYS[k];return d?(d.entries||[]).filter(e=>e.tid):[]}
function marksOn(k){const out=[];openTasks().forEach(t=>{if(!calPass(t))return;if(t.deadline===k)out.push(`<div class="cchip dl" data-ctask="${t.id}" title="마감: ${esc(t.title)}">⏳ ${esc(t.title)}</div>`);(t.checks||[]).forEach(c=>{if(c.d===k&&!c.ok)out.push(`<div class="cchip ck" data-ctask="${t.id}" title="중간 점검: ${esc(t.title)}">◇ ${esc(c.n||t.title)}</div>`)})});return out}
function cchip(t,k){const late=t.due<dateKey();return `<div class="cchip p${t.prio||0} ${late?'late':''} ${t.brave?'brave':''}" data-drag="task:${t.id}" data-dragmode="hold" data-ctask="${t.id}" title="${esc(t.title)}">${t.time?`<b>${t.time}</b> `:''}${esc(t.title)}</div>`}
function renderCal(){
  if(!calShown())return;
  const cs=calState(),mode=cs.mode,A=ui.calAnchor,td=dateKey();
  $('calModes').innerHTML=[['1day','1일'],['3day','3일'],['week','주'],['month','월'],['agenda','일정']].map(([v,l])=>`<button data-calmode="${v}" aria-pressed="${mode===v}">${l}</button>`).join('');
  $('calActual').checked=cs.actual!==false;$('calActual').parentElement.hidden=!(mode==='week'||mode==='3day'||mode==='1day');
  {const fn=calFilterN();$('calFilterBtn').innerHTML='<svg class="ico" viewBox="0 0 24 24"><path d="M4 5h16l-6 8v6l-4-2v-4z"/></svg>'+(fn?`<span class="bdg">${fn}</span>`:'');$('calFilterBtn').setAttribute('aria-pressed',!!fn)}
  $('calTray').hidden=splitOn()||!C.ui.cal.tray;document.querySelector('#calPane .callay').classList.toggle('notray',$('calTray').hidden);$('calTrayBtn').hidden=splitOn();$('calTrayBtn').setAttribute('aria-pressed',!!C.ui.cal.tray);
  $('calHelp').textContent=matchMedia('(pointer:coarse)').matches?'할 일·습관을 꾹 누른 채로 끌어서 날짜나 시간에 놓아요. 시간 블록 아래 손잡이를 끌면 길이가 바뀌어요.':'할 일·습관을 끌어서 날짜나 시간에 놓아요. 블록 아래쪽을 끌면 길이가 바뀌어요. 오른쪽 서랍으로 끌면 날짜가 빠져요.';
  let main='';
  if(mode==='month'){
    const m0=monthKey(A),[y,mo]=m0.split('-').map(Number);$('calTitle').textContent=`${y}년 ${mo}월`;
    const start=weekStart(m0);let cells=['월','화','수','목','금','토','일'].map(w=>`<div class="wh">${w}</div>`).join('');
    const open=openTasks().filter(calPass);const byDay={};open.forEach(t=>{if(t.due)(byDay[t.due]=byDay[t.due]||[]).push(t)});
    for(let i=0;i<42;i++){const k=addDays(start,i);if(i>=35&&k.slice(0,7)!==m0.slice(0,7))break;
      const dd=DAYS[k],has=dd&&hasData(dd),v=has?overallOf(dd):0,brv=has&&dd.entries.some(isBrave);
      const ts=(byDay[k]||[]).sort(taskSorter('due'));const dn=doneOn(k);
      const mk=marksOn(k);const chips=mk.slice(0,2).join('')+ts.slice(0,Math.max(1,3-Math.min(2,mk.length))).map(t=>cchip(t,k)).join('')+dn.slice(0,Math.max(0,3-ts.length-mk.length)).map(e=>`<div class="cchip done" title="${esc(e.name)}">${esc(e.name)}</div>`).join('');
      const more=ts.length+dn.length+mk.length-3;
      cells+=`<div class="mc ${k.slice(0,7)!==m0.slice(0,7)?'other':''} ${k===td?'today':''} ${k===ui.calSel?'sel':''}" data-drop="day:${k}" data-calday="${k}"><div class="mch"><span class="dn">${+k.slice(8)}</span>${has&&k<=td?`<span class="hp ${brv?'brv':''}" style="opacity:${(.2+v/100*.8).toFixed(2)}" title="컨디션 ${v}${brv?' · 용기':''}"></span>`:''}</div>${chips}${more>0?`<span class="more">+${more}</span>`:''}</div>`}
    main=`<div class="mgrid">${cells}</div>`;
  }else if(mode==='week'||mode==='3day'||mode==='1day'){
    const n=mode==='week'?7:mode==='3day'?3:1,s0=mode==='week'?weekStart(A):A;const ks=[...Array(n)].map((_,i)=>addDays(s0,i));
    $('calTitle').textContent=`${fmtD(ks[0])} ~ ${fmtD(ks[n-1])}`;
    const head=`<div><button class="foldtog" data-calfold="1" title="${foldH()?'0~'+foldH()+'시 펼치기':'0~'+(+C.ui.cal.fold||6)+'시 접기'}">${foldH()?'⇣ 펴기':'⇡ 접기'}</button></div>`+ks.map(k=>`<div class="dh ${k===td?'today':''}" data-drop="day:${k}" data-calday="${k}">${wdOf(k)}<b>${+k.slice(8)}</b></div>`).join('');
    const allN=Math.max(0,...ks.map(k=>tasksOn(k).filter(t=>!t.time).length+marksOn(k).length));
    const allday=`<div><button class="alltog" data-alltog="1" title="종일 칸 펼치기·접기">종일${allN>3?` ${ui.allOpen?'▴':'▾'}`:''}</button></div>`+ks.map(k=>`<div data-drop="allday:${k}">${marksOn(k).join('')}${tasksOn(k).filter(t=>!t.time).map(t=>cchip(t,k)).join('')}</div>`).join('');
    const FH=foldH(),GH=gridH();
    const hours=[...Array(24)].map((_,h)=>h&&!(FH&&h<FH)?`<span style="top:${yOf(h*60)}px">${pad(h)}</span>`:'').join('')+(FH?`<span style="top:${FOLDB/2}px">0~${FH}</span>`:'');
    const hlines=[...Array(24)].map((_,h)=>FH&&h<FH?'':`<div class="hl ${h%6===0&&h?'thick':''}" style="top:${yOf(h*60)}px"></div>`).join('')+(FH?`<button class="foldband" data-calfold="1" style="height:${FOLDB}px" title="0~${FH}시 펼치기">▾</button>`:'');
    const cols=ks.map(k=>{
      const ts=tasksOn(k).filter(t=>t.time).map(t=>({t,s:toMin(t.time),e:toMin(t.time)+(t.dur||30)})).sort((a,b)=>a.s-b.s);
      // 겹치는 블록 나란히
      let lanes=[],cl=[],clEnd=-1;const out=[];const flush=()=>{const L=lanes.length||1;cl.forEach(x=>{x.L=L});cl=[];lanes=[]};
      ts.forEach(x=>{if(x.s>=clEnd&&cl.length)flush();let li=lanes.findIndex(end=>end<=x.s);if(li<0){li=lanes.length;lanes.push(x.e)}else lanes[li]=x.e;x.li=li;cl.push(x);out.push(x);clEnd=Math.max(clEnd,x.e)});flush();
      const doneT=doneOn(k).filter(e=>{const t=TASKS[e.tid];return t&&t.time&&t.status===2&&t.doneAt===k});
      const blocks=out.map(x=>{const w=(cs.actual!==false?82:100)/x.L;return `<div class="blk p${x.t.prio||0} ${x.t.brave?'brave':''}" style="top:${yOf(x.s)}px;height:${Math.max(14,yOf(x.e)-yOf(x.s)-2)}px;left:calc(${x.li*w}% + 1px);width:calc(${w}% - 3px)" data-drag="block:${x.t.id}" data-dragmode="hold" data-ctask="${x.t.id}"><span class="bt">${esc(x.t.title)}</span><span class="bm">${x.t.time}${x.t.dur?' · '+durTxt(x.t.dur):''}</span><span class="rz" data-drag="resize:${x.t.id}" data-dragmode="now" aria-label="길이 바꾸기"></span></div>`}).join('')
        +doneT.map(e=>{const t=TASKS[e.tid];const s=toMin(t.time);return `<div class="blk done" style="top:${yOf(s)}px;height:${Math.max(14,yOf(s+(t.dur||30))-yOf(s)-2)}px;left:1px;width:calc(${cs.actual!==false?82:100}% - 3px)"><span class="bt">${esc(t.title)}</span></div>`}).join('');
      let lane='';
      if(cs.actual!==false){const d=DAYS[k];lane=`<div class="act-lane" title="실제로 한 시간">${((d&&d.entries)||[]).filter(e=>e.t&&!['chest','boss','wbrave','badge','quest','chain'].includes(e.kind)).map(e=>{let em=toMin(e.t);if(em<(C.dayStart||0)*60)em+=0;const sm=e.st?toMin(e.st):null;const s0=sm!=null&&e.dur?sm:em-2,top=yOf(Math.max(0,s0)),hh=e.dur?Math.max(5,yOf(s0+e.dur)-top):5;return `<div class="amark ${e.type==='bad'?'bad':''} ${isBrave(e)?'brv':''} ${e.dur?'':'dot'}" style="top:${top}px;height:${hh}px" title="${esc(e.t+' '+e.name)}${e.dur?' · '+e.dur+'분':''}"></div>`}).join('')}</div>`}
      const nowl=k===td?`<div class="nowl" style="top:${yOf(nowMinutes())}px"></div>`:'';
      return `<div class="tgcol ${k===td?'today':''}" data-drop="col:${k}" style="height:${GH}px">${hlines}${blocks}${lane}${nowl}</div>`}).join('');
    main=`<div class="tgwrap" style="--cols:${n}"><div class="tghead">${head}</div><div class="tgall ${ui.allOpen?'open':''}" style="${C.ui.cal.allH&&!ui.allOpen?`--allh:${C.ui.cal.allH}px`:''}">${allday}</div><div class="allrz" title="끌어서 종일 칸 높이 바꾸기"></div><div class="tgscroll" id="tgScroll"><div class="tgbody"><div class="tghours" style="height:${GH}px">${hours}</div>${cols}</div></div></div>`;
  }else{
    $('calTitle').textContent='다가오는 일정';
    const open=openTasks().filter(t=>t.due&&calPass(t)).sort(taskSorter('due'));const late=open.filter(t=>t.due<td);
    let h='';if(late.length)h+=`<div class="ad" style="color:var(--bad)">지난 할 일 ${late.length}</div>`+late.map(t=>taskRow(t,{compact:true})).join('');
    for(let i=0;i<21;i++){const k=addDays(td,i);const ts=open.filter(t=>t.due===k);const dn=doneOn(k);if(!ts.length&&!(i===0&&dn.length))continue;
      h+=`<div class="ad ${i===0?'today':''}" data-drop="day:${k}">${dueLabel(k)} · ${fmtD(k)} (${wdOf(k)})</div><div data-drop="day:${k}">${ts.map(t=>taskRow(t,{compact:true})).join('')}${i===0?dn.map(e=>`<div class="trow done"><span class="tchk">✓</span><span class="tb"><span class="tt">${esc(e.name)}</span></span><span class="tx">+${e.xp||0}</span><span></span></div>`).join(''):''}</div>`}
    main=`<div class="panel agenda">${h||'<div class="empty">다가오는 일정이 없어요.</div>'}</div>`;
  }
  const keepY=$('tgScroll')?$('tgScroll').scrollTop:null;
  $('calMain').innerHTML=main;
  if($('tgScroll')){$('tgScroll').scrollTop=keepY!=null&&ui.calKeepScroll?keepY:Math.max(0,yOf(Math.max(0,Math.min(nowMinutes(),20*60)-90))-(foldH()?FOLDB:0));ui.calKeepScroll=true}
  // 고른 날
  if(mode==='month'){const k=ui.calSel;const ts=tasksOn(k).sort(taskSorter('due'));const dn=doneOn(k);
    $('calDay').innerHTML=`<div class="panel dayp"><div class="ptitle"><h2>${fmtD(k)} (${wdOf(k)}) · ${esc(dueLabel(k))}</h2><span class="small muted">${ts.length}개 남음${dn.length?' · '+dn.length+'개 끝':''}</span><button class="ib add83" type="button" data-add83="${k}" title="이 날에 할 일 추가 (팝업)">＋ 추가</button></div>
      <form class="tadd" data-taddform="cal"><div class="in"><input id="calAdd" maxlength="160" placeholder="${fmtD(k)}에 할 일 추가 (3시 30분 #퀵…)" enterkeyhint="done" autocomplete="off"><button class="btn sm" type="submit">추가</button></div><div class="parse" id="calParse"></div></form>
      <div data-drop="day:${k}">${ts.map(t=>taskRow(t,{compact:true})).join('')||''}${dn.map(e=>`<div class="trow done"><span class="tchk">✓</span><span class="tb"><span class="tt">${esc(e.name)}</span><span class="tm"><span>${esc(e.t)}</span></span></span><span class="tx">+${e.xp||0}</span><span></span></div>`).join('')}${!ts.length&&!dn.length?'<div class="empty">이 날은 비어 있어요. 오른쪽(아래) 서랍에서 끌어다 놓아도 돼요.</div>':''}</div></div>`}
  else $('calDay').innerHTML='';
  renderTray();
}
function nowMinutes(){const d=new Date();return d.getHours()*60+d.getMinutes()}
function renderTray(){
  const tab=ui.trayTab||'nodate',q=(ui.trayQ||'').toLowerCase();
  const tabs=[['nodate','날짜 없음'],['late','지난 것'],['habit','습관'],['routine','루틴']];
  let items=[];
  if(tab==='nodate')items=openTasks().filter(t=>!t.due).sort(taskSorter('prio')).map(t=>({k:'task:'+t.id,n:t.title,h:`${pmark(t.prio)}${t.list&&t.list!=='inbox'?' '+esc(listName(t.list)):''}`,id:t.id}));
  if(tab==='late')items=openTasks().filter(t=>t.due&&t.due<dateKey()).sort(taskSorter('due')).map(t=>({k:'task:'+t.id,n:t.title,h:esc(dueLabel(t.due)),id:t.id}));
  if(tab==='habit')items=C.actions.filter(a=>a.type==='good').map(a=>({k:'act:'+a.id,n:a.name,h:`${a.dur?'⏱'+a.dur+'분 ':''}+${a.xp}`}));
  if(tab==='routine')items=(C.routines||[]).map(r=>({k:'routine:'+r.id,n:r.name,h:`${r.steps.length}단계 · ${r.steps.reduce((s,x)=>s+(+x.min||0),0)}분`}));
  if(q)items=items.filter(x=>x.n.toLowerCase().includes(q));
  const h=`<div class="ptitle" style="margin:0"><h2>끌어다 놓기</h2><span class="tiny muted">여기로 끌면 날짜 빼기</span></div>
    <div class="row" style="gap:4px">${tabs.map(([k,l])=>`<button class="chipbtn" data-traytab="${k}" aria-pressed="${tab===k}">${l}</button>`).join('')}</div>
    <input id="trayQ" type="search" placeholder="찾기" value="${esc(ui.trayQ||'')}" autocomplete="off">
    <div class="trayl">${items.slice(0,150).map(x=>`<div class="titem" data-drag="${x.k}" data-dragmode="hold"${x.id?` data-ctask="${x.id}"`:''}><span class="n">${esc(x.n)}</span><span class="h">${x.h}</span></div>`).join('')||'<div class="empty tiny">비어 있어요.</div>'}</div>`;
  if(!$('calTray').contains(document.activeElement))$('calTray').innerHTML=h;
  else{const l=$('calTray').querySelector('.trayl');if(l){const tmp=document.createElement('div');tmp.innerHTML=h;l.innerHTML=tmp.querySelector('.trayl').innerHTML}}
}
/* ================= v5: 끌어다 놓기 엔진 ================= */
const DND={on:false,src:null,el:null,ghost:null,timer:null,sx:0,sy:0,pid:null,drop:null,ind:null,grabOff:0,scrollIv:null,lastX:0,lastY:0};
function dndCancel(){clearTimeout(DND.timer);DND.timer=null;DND.pending=false}
document.addEventListener('pointerdown',e=>{
  if(e.button>0)return;const el=e.target.closest('[data-drag]');if(!el)return;
  {const bt=e.target.closest('button,input,select,textarea,a');if(bt&&bt!==el&&!el.matches('.rz'))return}
  DND.src=el.dataset.drag;DND.el=el;DND.sx=e.clientX;DND.sy=e.clientY;DND.pid=e.pointerId;DND.pending=true;
  const r=el.getBoundingClientRect();DND.grabOff=e.clientY-r.top;
  const now=el.dataset.dragmode==='now'||(e.pointerType==='mouse'&&el.dataset.dragmode!=='handle');
  if(el.dataset.dragmode==='now'){e.preventDefault();dndStart(e)}
  else if(e.pointerType!=='mouse'){DND.timer=setTimeout(()=>{if(DND.pending)dndStart({clientX:DND.lastX||DND.sx,clientY:DND.lastY||DND.sy})},300)}
  DND.mouse=now;
},true);
document.addEventListener('pointermove',e=>{
  if(!DND.src)return;DND.lastX=e.clientX;DND.lastY=e.clientY;
  if(DND.pending&&!DND.on){const d=Math.hypot(e.clientX-DND.sx,e.clientY-DND.sy);
    if(DND.mouse&&d>6)dndStart(e);else if(!DND.mouse&&d>10){dndCancel();DND.src=null}return}
  if(DND.on){e.preventDefault();dndMove(e.clientX,e.clientY)}
},{capture:true,passive:false});
document.addEventListener('touchmove',e=>{if(DND.on)e.preventDefault()},{passive:false});
document.addEventListener('pointerup',e=>{if(DND.on){dndEnd(e.clientX,e.clientY)}dndCancel();DND.src=null},true);
document.addEventListener('pointercancel',()=>{if(DND.on)dndAbort();dndCancel();DND.src=null},true);
document.addEventListener('contextmenu',e=>{if(DND.on||e.target.closest('[data-dragmode="hold"]'))e.preventDefault()},true);
function dndStart(e){
  DND.pending=false;DND.on=true;lpFired=true;clearTimeout(lpTimer);
  const [kind,id]=DND.src.split(':');DND.kind=kind;DND.id=id;if(kind==='row')DND.el=DND.el.closest('[data-rowid]')||DND.el;
  if(kind==='resize'){const t=TASKS[id];DND.startDur=t&&t.dur||30;DND.sy=e.clientY;document.body.classList.add('dragging');buzz(8);return}
  const g=document.createElement('div');g.className='dndghost';
  g.textContent=kind==='task'||kind==='block'?(TASKS[id]||{}).title:kind==='act'?'🔗 '+(C.actions.find(a=>a.id===id)||{}).name:kind==='routine'?'⏱ '+((C.routines||[]).find(r=>r.id===id)||{}).name:kind==='row'?((DND.el.querySelector('b')||{}).textContent||(DND.el.querySelector('input')||{}).value||DND.el.textContent).trim().slice(0,40):'';
  if((kind==='task'||kind==='block')&&ui.msel&&ui.msel.has(id)&&ui.msel.size>1)g.textContent=`☑ ${ui.msel.size}개`;if(kind==='act'&&ui.dsel&&ui.dsel.has(id)&&ui.dsel.size>1)g.textContent=`☑ ${ui.dsel.size}개`;
  document.body.appendChild(g);DND.ghost=g;DND.el.classList.add('dragsrc');document.body.classList.add('dragging');buzz(12);
  dndMove(e.clientX,e.clientY);
  DND.scrollIv=setInterval(dndAutoScroll,30);
}
function dndAutoScroll(){
  if(!DND.on)return;const y=DND.lastY,H=innerHeight;const sc=$('tgScroll');
  if(sc){const r=sc.getBoundingClientRect();if(y>r.top&&y<r.top+40)sc.scrollTop-=12;else if(y<r.bottom&&y>r.bottom-40)sc.scrollTop+=12}
  if(y<90)scrollBy(0,-14);else if(y>H-90)scrollBy(0,14);
  if(DND.lastX)dndMove(DND.lastX,DND.lastY,true);
}
function clearHi(){document.querySelectorAll('.drop-hi').forEach(x=>x.classList.remove('drop-hi'));if(DND.ind){DND.ind.remove();DND.ind=null}}
function dndMove(x,y,fromScroll){
  DND.lastX=x;DND.lastY=y;
  if(DND.kind==='resize'){const t=TASKS[DND.id];if(!t)return;const nd=Math.max(15,Math.round((DND.startDur+(y-DND.sy)/PXM)/15)*15);DND.newDur=nd;const b=document.querySelector(`.blk[data-ctask="${DND.id}"]`);if(b){b.style.height=(yOf(toMin(t.time)+nd)-yOf(toMin(t.time))-2)+'px';const m=b.querySelector('.bm');if(m)m.textContent=t.time+' · '+durTxt(nd)}return}
  if(DND.ghost){DND.ghost.style.left=x+'px';DND.ghost.style.top=y+'px'}
  DND.ghost&&(DND.ghost.style.display='none');const under=document.elementFromPoint(x,y);DND.ghost&&(DND.ghost.style.display='');
  let tgt=under&&under.closest('[data-drop]');if(tgt&&/^to(list|smart):/.test(tgt.dataset.drop)&&DND.kind==='row')tgt=tgt.parentElement.closest('[data-drop]');
  if(tgt&&/^to(list|smart):/.test(tgt.dataset.drop)&&DND.kind!=='task'&&DND.kind!=='block')tgt=null;
  clearHi();DND.drop=null;if(!tgt)return;
  const dv=tgt.dataset.drop;
  if(dv.startsWith('reorder:')){
    if((DND.kind==='row'&&dv!=='reorder:tasks'&&(DND.el.parentElement===tgt||[...tgt.children].some(c=>c.dataset&&c.dataset.rowid===DND.id)))||(DND.kind==='task'&&dv==='reorder:tasks')){
      const sel=DND.kind==='row'?'[data-rowid]':'.trow';const kids=[...tgt.children].filter(c=>c!==DND.el&&c.matches(sel)&&!(DND.kind==='row'&&c.dataset.rowid===DND.id));
      let before=null;const hit=kids.find(c=>{const r=c.getBoundingClientRect();return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom});
      if(hit){const r=hit.getBoundingClientRect();before=y<r.top+r.height/2?hit:kids[kids.indexOf(hit)+1]||null}
      else for(const c of kids){const r=c.getBoundingClientRect();if(y<r.top+r.height/2&&x>=r.left-20&&x<=r.right+20){before=c;break}}
      const ind=document.createElement('div');ind.className='insline';if(before)tgt.insertBefore(ind,before);else tgt.appendChild(ind);DND.ind=ind;
      DND.drop={type:'reorder',col:dv.slice(8),before:before?(before.dataset.rowid||before.dataset.task):null,grp:tgt.dataset.grp}}
    return}
  if(DND.kind==='row')return;
  if(dv.startsWith('dopa:')&&DND.kind!=='act')return;
  if(dv.startsWith('col:')){const r=tgt.getBoundingClientRect();let m=mOf(y-r.top-(DND.kind==='block'?DND.grabOff:6));m=clamp(Math.round(m/15)*15,0,1440-15);
    const ind=document.createElement('div');ind.className='dropline';ind.style.top=yOf(m)+'px';ind.innerHTML=`<span>${hm(m)}</span>`;tgt.appendChild(ind);DND.ind=ind;DND.drop={type:'time',date:dv.slice(4),min:m};return}
  tgt.classList.add('drop-hi');
  if(dv.startsWith('day:'))DND.drop={type:'day',date:dv.slice(4)};
  else if(dv.startsWith('allday:'))DND.drop={type:'allday',date:dv.slice(7)};
  else if(dv.startsWith('dopa:')&&DND.kind==='act')DND.drop={type:'dopa',co:dv.slice(5)};
  else if(dv==='tray')DND.drop={type:'tray'};
  else if(dv.startsWith('tolist:'))DND.drop={type:'tolist',id:dv.slice(7)};
  else if(dv.startsWith('tosmart:'))DND.drop={type:'tosmart',k:dv.slice(8)};
}
function dndAbort(){clearHi();clearInterval(DND.scrollIv);if(DND.ghost)DND.ghost.remove();DND.ghost=null;if(DND.el)DND.el.classList.remove('dragsrc');document.body.classList.remove('dragging');DND.on=false;setTimeout(()=>{lpFired=false},50)}
function dndEnd(x,y){
  const kind=DND.kind,id=DND.id,drop=DND.drop;
  if(kind==='resize'){document.body.classList.remove('dragging');DND.on=false;const t=TASKS[id];if(t&&DND.newDur){t.dur=DND.newDur;saveTask(t);ui.calKeepScroll=true;render();toast(`${t.title} · ${durTxt(t.dur)}`)}DND.newDur=null;setTimeout(()=>{lpFired=false},50);return}
  dndAbort();if(!drop)return;
  {const ae=document.activeElement;if(ae&&ae!==document.body&&ae.blur&&!ae.matches('input[type=text],input:not([type]),textarea'))ae.blur()}
  if(drop.type==='reorder'){
    if(drop.col==='smart'){const o=smartOrder();const it=o.find(x=>x[0]===id);if(!it)return;const rest=o.filter(x=>x!==it);let i=drop.before?rest.findIndex(x=>x[0]===drop.before):rest.length;if(i<0)i=rest.length;rest.splice(i,0,it);C.ui.smart=rest;save('config');render();return}
    if(drop.col==='lists'){const it=C.lists.find(l=>l.id===id);if(!it)return;const rest=C.lists.filter(l=>l!==it);let i=drop.before?rest.findIndex(l=>l.id===drop.before):rest.length;if(i<0)i=rest.length;rest.splice(i,0,it);C.lists=rest;save('config');render();return}
    if(drop.col==='home'||drop.col==='nav'){const arr=drop.col==='home'?C.ui.home:C.ui.navAll;const it=arr.find(h=>(h[0]||h)===id);if(!it)return;const rest=arr.filter(h=>h!==it);let i=drop.before?rest.findIndex(h=>(h[0]||h)===drop.before):rest.length;if(i<0)i=rest.length;rest.splice(i,0,it);if(drop.col==='home')C.ui.home=rest;else{C.ui.navAll=rest}save('config');render();return}
    if(drop.col==='actions'){const it=C.actions.find(a=>a.id===id);if(!it)return;C.actions=C.actions.filter(a=>a!==it);let i=drop.before?C.actions.findIndex(a=>a.id===drop.before):C.actions.length;if(i<0)i=C.actions.length;C.actions.splice(i,0,it);save('config');render();toast('순서를 바꿨어요');return}
    if(Array.isArray(C[drop.col])&&!['tasks','home','nav'].includes(drop.col)){const arr=C[drop.col],it=arr.find(x=>x.id===id);if(!it)return;const rest=arr.filter(x=>x!==it);let i=drop.before?rest.findIndex(x=>x.id===drop.before):rest.length;if(i<0)i=rest.length;rest.splice(i,0,it);C[drop.col]=rest;save('config');render();return}
    if(drop.col==='tasks'){const t=TASKS[id];if(!t)return;const sib=[...document.querySelectorAll(`[data-drop="reorder:tasks"] .trow`)].map(r=>TASKS[r.dataset.task]).filter(x=>x&&x!==t);
      const bi=drop.before?sib.findIndex(x=>x.id===drop.before):sib.length;const prev=sib[bi-1],next=sib[bi];
      t.order=prev&&next?((prev.order||0)+(next.order||0))/2:prev?(prev.order||0)+1000:next?(next.order||0)-1000:Date.now();
      if(C.ui.tasks.sort!=='manual'){C.ui.tasks.sort='manual';save('config')}saveTask(t);render();return}
    return}
  const td=dateKey();
  if((kind==='task'||kind==='block')&&(drop.type==='tolist'||drop.type==='tosmart')){bulkDrop(id,drop);return}
  if(kind==='task'||kind==='block'){const t=TASKS[id];if(!t)return;const old=t.due;
    if(drop.type==='tray'){t.due=null;t.time=null;saveTask(t);render();toast('날짜를 뺐어요');return}
    const nd=drop.date;if(old&&old<=td&&nd>old)t.skull=(t.skull||0)+1;
    t.due=nd;if(drop.type==='time'){t.time=hm(drop.min);if(!t.dur)t.dur=30}else if(drop.type==='allday'){t.time=null}
    if(t.rep&&t.rep.f==='w'&&t.rep.wd&&t.rep.wd.length===1&&old!==nd)t.rep.wd=[dowOf(nd)];
    saveTask(t);ui.calSel=nd;ui.calKeepScroll=true;render();toast(`${t.title} → ${dueLabel(nd)}${t.time&&drop.type==='time'?' '+t.time:''}${t.skull&&old&&old<=td&&nd>old?' · ☠'+t.skull:''}`);return}
  if(kind==='act'&&drop.type==='dopa'&&ui.dsel&&ui.dsel.has(id)&&ui.dsel.size>1){dopaMove([...ui.dsel],drop.co);return}
  if(kind==='act'&&drop.type==='dopa'){const a=C.actions.find(x=>x.id===id);if(!a)return;if(drop.co){a.dopa=drop.co;toast(`'${a.name}' → ${(dopaC().find(d=>d[0]===drop.co)||['',''])[1]}`)}else{delete a.dopa;delete a.dopaOnly;toast(`'${a.name}'을(를) 도파민 메뉴에서 뺐어요`)}save('config');render();return}
  if(kind==='act'||kind==='routine'){if(drop.type==='tray'||drop.type==='dopa')return;
    const a=kind==='act'?C.actions.find(x=>x.id===id):null,r=kind==='routine'?(C.routines||[]).find(x=>x.id===id):null;if(!a&&!r)return;
    const t=newTask({title:a?a.name:r.name,aid:a?a.id:undefined,rid:r?r.id:undefined,due:drop.date,time:drop.type==='time'?hm(drop.min):null,dur:drop.type==='time'?(a?a.dur:r.steps.reduce((s,x)=>s+(+x.min||0),0))||30:null,list:'inbox',reframe:a&&a.reframe||undefined});
    saveTask(t);ui.calSel=drop.date;ui.calKeepScroll=true;render();toast(`${t.title}을(를) ${dueLabel(drop.date)}${t.time?' '+t.time:''}에 넣었어요`);return}
}
