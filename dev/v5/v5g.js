/* ================= v5: 이벤트 ================= */
function rerenderEditKeep(id){const el=$(id);const pos=el?el.selectionStart:0;const ae=document.activeElement;if(ae&&ae.blur)ae.blur();renderEdit();const n=$(id);if(n){n.focus();try{n.setSelectionRange(pos,pos)}catch(e){}}}
function newListSheet(){sheetCtx={newlist:1};openSheet(`<div class="sh"><h3>새 목록</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div><form id="nlForm" class="stack" style="gap:10px"><label class="f">이름<input id="nlName" maxlength="40" placeholder="예: 🎬 단편 준비" required></label><div class="f2"><label class="f">폴더 (선택)<input id="nlFolder" maxlength="30" list="nlFolders"></label><label class="f">컨디션 영역<select id="nlArea">${C.areas.map(a=>`<option value="${a.id}">${esc(a.name)}</option>`).join('')}</select></label></div><datalist id="nlFolders">${[...new Set(C.lists.map(l=>l.folder).filter(Boolean))].map(f=>`<option value="${esc(f)}">`).join('')}</datalist><button class="btn" type="submit">만들기</button></form>`);setTimeout(()=>$('nlName')&&$('nlName').focus(),50)}
function reframeSheet(text,title){sheetCtx={rf:1};openSheet(`<div class="sh"><h3>💭 ${esc(title)}</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div><div class="reframe" style="font-size:17px">${esc(text)}</div><p class="small muted" style="margin:0">하기 싫은 마음도 괜찮아요. 딱 5분만 해볼까요?</p><div class="row" style="justify-content:flex-end"><button class="btn ghost" data-sheet="close">나중에</button><button class="btn" data-rfgo="1">⏱ 5분만 해보기</button></div>`)}
function quick5Sheet(){
  const td=dateKey(),ts=openTasks().filter(t=>t.due&&t.due<=td).sort(taskSorter('prio')).slice(0,6),hs=C.actions.filter(a=>a.type==='good').slice(0,4);
  sheetCtx={q5:1};openSheet(`<div class="sh"><h3>⏳ 딱 5분만</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div><p class="help" style="margin:0">끝낼 필요 없어요. 5분만 하고, 그다음에 계속할지 정해요. 시작이 제일 어려우니까.</p>
  <div class="stack" style="gap:6px">${ts.map(t=>`<button class="sug" data-q5task="${t.id}" style="grid-template-columns:1fr auto"><span><b>${pmark(t.prio)} ${esc(t.title)}</b><span class="why">${esc(dueLabel(t.due))}</span></span><span class="go">5분 ▶</span></button>`).join('')}${hs.map(a=>`<button class="sug" data-q5act="${a.id}" style="grid-template-columns:1fr auto"><span><b>${esc(a.name)}</b><span class="why">습관</span></span><span class="go">5분 ▶</span></button>`).join('')}</div>
  <form id="q5Form" class="row" style="flex-wrap:nowrap"><input id="q5Name" placeholder="아니면 직접 적기" maxlength="60"><button class="btn" type="submit">5분 ▶</button></form>`)}
function startFive(ref){RUN={kind:'five',ref,name:ref.name,target:5,start:Date.now(),paused:0,color:BOSSES[Math.floor(Math.random()*BOSSES.length)][1]};runSave();openHunt();requestWake()}
const _huntDo=huntDo;
huntDo=function(k){
  if(RUN&&RUN.kind==='five'&&k==='done'){const R=RUN,el=runElapsed();endRun(true);ui.off=0;sheetCtx={five:R,el};
    openSheet(`<div class="sh"><h3>⏳ ${mmss(el)} 했어요!</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div><p style="margin:0"><b>${esc(R.name)}</b> — 시작한 것만으로 이긴 거예요.</p><div class="stack" style="gap:8px">${R.ref.tid&&TASKS[R.ref.tid]?`<button class="btn" data-five="done">✓ 아예 끝냈어요</button>`:R.ref.aid?`<button class="btn" data-five="done">✓ 끝냈어요 (습관 기록)</button>`:''}<button class="btn ${R.ref.tid||R.ref.aid?'ghost':''}" data-five="start">5분 해낸 걸로 기록 (+5 XP)</button><button class="btn ghost" data-five="more">⏱ 이어서 사냥하기</button></div>`);return}
  _huntDo(k)};
document.addEventListener('click',e=>{
  if(lpFired)return;
  const T=e.target;
  // 기록 줄 누르면 고치기
  const li=T.closest('[data-entry]');if(li&&!T.closest('button')){const[date,id]=li.dataset.entry.split('|');openDoneSheet({edit:{date,id}});return}
  const b=T.closest('button,[data-ctask],[data-task],[data-calday]');if(!b)return;const d=b.dataset;
  // 시트
  if(d.sheet){const k=d.sheet;if(k==='close'){closeSheet();return}if(k==='ok'){sheetOK();return}if(k==='save'){sheetSave();return}
    if(k==='rm'){const S=sheetCtx;closeSheet();removeEntry(S.edit.date,S.edit.id);return}
    if(k==='timer'){const S=sheetCtx;closeSheet();if(S.t)startRun({task:S.t});else if(S.a)startRun({act:S.a});return}}
  if(d.sopt){sheetRead();sheetCtx.vid=d.sopt;sheetCtx.vidMan=1;drawDoneSheet();return}
  if(d.sn){sheetRead();sheetCtx.n=clamp((sheetCtx.n||1)+(+d.sn),1,20);drawDoneSheet();return}
  if(d.del&&sheetCtx&&sheetCtx.aedit){setTimeout(closeSheet,0);return}
  if(d.five){const S=sheetCtx;closeSheet();const R=S.five,ref=R.ref;
    if(d.five==='done'){if(ref.tid&&TASKS[ref.tid])completeTask(TASKS[ref.tid],{elapsed:S.el});else if(ref.aid){const a=C.actions.find(x=>x.id===ref.aid);if(a)doAction(a,{elapsed:S.el})}}
    else if(d.five==='start'){if(!guard())return;const e={kind:'free',type:'good',name:'5분 시작: '+R.name,area:ref.tid&&TASKS[ref.tid]?areaOfTask(TASKS[ref.tid]):'mind',xp:5,gold:1,cond:2,dur:Math.max(1,Math.round(S.el/60))};commit(()=>applyEntry(today(),e));fxPop('+5 XP','var(--good)')}
    else{if(ref.tid&&TASKS[ref.tid])startRun({task:TASKS[ref.tid]});else if(ref.aid)startRun({act:C.actions.find(x=>x.id===ref.aid)});else startFive(ref)}return}
  if(d.q5task){const t=TASKS[d.q5task];closeSheet();if(t)startFive({tid:t.id,name:t.title});return}
  if(d.q5act){const a=C.actions.find(x=>x.id===d.q5act);closeSheet();if(a)startFive({aid:a.id,name:a.name});return}
  if(d.rfgo){closeSheet();const q=ui.rfRef;if(q&&q.tid&&TASKS[q.tid])startFive({tid:q.tid,name:TASKS[q.tid].title});else if(q&&q.aid){const a=C.actions.find(x=>x.id===q.aid);if(a)startFive({aid:a.id,name:a.name})}return}
  // 할 일
  if(d.tdone){e.stopPropagation();const t=TASKS[d.tdone];if(!t)return;if(t.status===2){const ent=Object.values(DAYS).flatMap(dd=>(dd.entries||[]).filter(x=>x.tid===t.id).map(x=>({x,dd}))).sort((a,b)=>(b.dd.date+b.x.t).localeCompare(a.dd.date+a.x.t))[0];if(ent)removeEntry(ent.dd.date,ent.x.id);else{t.status=0;delete t.doneAt;saveTask(t);render()}return}ui.off=0;completeTask(t);return}
  if(d.trun){const t=TASKS[d.trun];const r=t&&t.rid&&(C.routines||[]).find(x=>x.id===t.rid);if(r)startRun({routine:r});else if(t)startRun({task:t});return}
  if(d.treframe){const t=TASKS[d.treframe];if(t){ui.rfRef={tid:t.id};reframeSheet(t.reframe,t.title)}return}
  if(d.tsel){C.ui.tasks.sel=d.tsel;save('config');if(curView()!=='tasks')location.hash='tasks';else renderTasks();return}
  if(d.tlistadd){newListSheet();return}
  if(d.tgcollapse!=null){const k='tg'+d.tgcollapse;C.ui.collapsed[k]=!C.ui.collapsed[k];save('config');renderTasks();return}
  if(d.htmore){ui.htMore=1;renderHomeV5();return}
  if(b.matches('.trow[data-task]')&&!T.closest('button')){openTaskSheet(d.task);return}
  if(d.ctask&&!T.closest('.rz')&&!b.matches('button')){openTaskSheet(d.ctask);return}
  // 할 일 자세히
  if(sheetCtx&&sheetCtx.task){const t=TASKS[sheetCtx.task];if(t){
    if(d.tsdue!=null){tsRead();const nd=d.tsdue||null;if(t.due&&t.due<=dateKey()&&nd&&nd>t.due)t.skull=(t.skull||0)+1;t.due=nd;if(!nd)t.time=null;tsCommit(true,false);return}
    if(d.tsprio!=null){tsRead();t.prio=+d.tsprio;tsCommit(true,false);return}
    if(d.tseff){tsRead();t.effort=d.tseff;tsCommit(true,false);return}
    if(d.tsbrave){tsRead();if(t.brave)delete t.brave;else t.brave=1;tsCommit(true,false);return}
    if(d.tsrep!=null){tsRead();setRepPreset(t,d.tsrep);tsCommit(true,false);return}
    if(d.tswd!=null){tsRead();const w=+d.tswd,r=t.rep;r.wd=r.wd||[];r.wd=r.wd.includes(w)?r.wd.filter(x=>x!==w):[...r.wd,w];if(!r.wd.length)r.wd=[w];tsCommit(true,false);return}
    if(d.tssubdel!=null){tsRead();t.subs.splice(+d.tssubdel,1);tsCommit(true,false);return}
    if(d.tsact){const k=d.tsact;tsRead();
      if(k==='done'){saveTask(t);closeSheet();ui.off=0;completeTask(t);return}
      if(k==='timer'){saveTask(t);closeSheet();startRun({task:t});return}
      if(k==='tomorrow'){closeSheet();postpone(t,addDays(dateKey(),1));return}
      if(k==='drop'){t.status=-1;t.doneAt=dateKey();saveTask(t);closeSheet();render();toast(`'${t.title}'은(는) 버렸어요. 버리는 것도 결정이에요`);return}
      if(k==='reopen'){t.status=0;delete t.doneAt;saveTask(t);closeSheet();render();return}
      if(k==='del'){if(!ui.delArm||Date.now()-ui.delArm>3000){ui.delArm=Date.now();toast('한 번 더 누르면 지워요');return}ui.delArm=0;closeSheet();deleteTask(t.id);render();toast('지웠어요');return}}}}
  // 캘린더
  if(d.calmode){C.ui.cal.mode=d.calmode;save('config');ui.calKeepScroll=false;renderCal();return}
  if(d.calnav!=null){const m=C.ui.cal.mode,n=+d.calnav;ui.calKeepScroll=true;if(!n){ui.calAnchor=dateKey();ui.calSel=dateKey();ui.calKeepScroll=false}else if(m==='month')ui.calAnchor=addMonths(monthKey(ui.calAnchor),n);else ui.calAnchor=addDays(ui.calAnchor,n*(m==='week'?7:3));renderCal();return}
  if(d.calday&&!T.closest('[data-ctask]')){ui.calSel=d.calday;ui.calAnchor=d.calday;if(C.ui.cal.mode!=='1day'){C.ui.cal.mode='1day';save('config')}ui.calKeepScroll=false;renderCal();return}
  if(d.traytab){ui.trayTab=d.traytab;renderTray();return}
  // 가챠
  if(d.gf){const g=G(),arr=g.f[d.gf]=g.f[d.gf]||[];const v=d.v;g.f[d.gf]=arr.includes(v)?arr.filter(x=>x!==v):[...arr,v];save('config');renderGacha();return}
  if(d.gdue){G().f.due=d.gdue;save('config');renderGacha();return}
  if(d.gn){G().f.n=+d.gn;save('config');renderGacha();return}
  if(d.gpre){const p=(G().presets||[]).find(x=>x.id===d.gpre);if(p){G().f=clone(p.f);save('config');renderGacha();toast(`'${p.name}' 필터`)}return}
  if(d.gpresave){const g=G();const nm=prompt('이 필터 이름','내 뽑기');if(!nm)return;g.presets=g.presets||[];g.presets.push({id:'p'+uid(),name:nm.slice(0,20),f:clone(g.f)});save('config');renderGacha();return}
  if(b.id==='gDraw'){gachaDraw();return}
  if(d.gquick){const g=G();g.f.n=+d.gquick;gachaDraw();return}
  if(d.gflip!=null){const g=G();if(!g.pending)return;const i=+d.gflip;g.pending.open=g.pending.open||[];if(!g.pending.open.includes(i)){g.pending.open.push(i);save('config');buzz(10);renderGacha();const c=g.pending.cards[i];if(rarOf(c)[0]==='SSR'||rarOf(c)[0]==='SR')fxPop(rarOf(c)[0]+'!','var(--brave)')}return}
  if(d.gflipall){const g=G();if(!g.pending)return;g.pending.open=g.pending.cards.map((_,i)=>i);save('config');renderGacha();return}
  if(d.greroll){gachaReroll();return}
  if(d.gpick!=null){gachaPick(+d.gpick);return}
  if(d.qgo){questGo(d.qgo);return}
  if(d.qreframe){const q=(C.gacha||{}).quest,tg=questTarget(q);if(tg&&tg.reframe){ui.rfRef=q.src==='task'?{tid:q.id}:{aid:q.id};reframeSheet(tg.reframe,q.name)}return}
  if(d.rrun){const r=(C.routines||[]).find(x=>x.id===d.rrun);if(r){closeSheet();startRun({routine:r})}return}
  if(d.quick5){quick5Sheet();return}
  // 편집: 행동
  if(d.aedit){openActionEditor(d.aedit);return}
  if(d.aetype){ui.ae.type=d.aetype;renderEdit();return}
  if(d.aeoadd){const a=C.actions.find(x=>x.id===sheetCtx.aedit);if(!a)return;a.opts=a.opts||[];a.opts.push({id:'v'+uid().slice(0,5),name:'새 옵션'});save('config');openActionEditor(a.id);return}
  if(d.aeodel!=null){const a=C.actions.find(x=>x.id===sheetCtx.aedit);if(!a)return;a.opts.splice(+d.aeodel,1);if(!a.opts.length)delete a.opts;save('config');openActionEditor(a.id);return}
  if(d.aerun){const a=C.actions.find(x=>x.id===d.aerun);closeSheet();if(a)startRun({act:a});return}
  // 편집: 루틴
  if(d.rtadd){C.routines.push({id:'r'+uid(),name:'새 루틴',xp:20,gold:10,area:'life',steps:[{id:uid(),name:'첫 단계',min:5,aid:''}]});save('config');renderEdit();return}
  if(d.rtdel){if(!ui.delArm||Date.now()-ui.delArm>3000){ui.delArm=Date.now();toast('한 번 더 누르면 루틴을 지워요');return}C.routines=C.routines.filter(r=>r.id!==d.rtdel);save('config');renderEdit();return}
  if(d.rsadd){const r=C.routines.find(x=>x.id===d.rsadd);r.steps.push({id:uid(),name:'새 단계',min:5,aid:''});save('config');renderEdit();return}
  if(d.rsdel){const r=C.routines.find(x=>x.id===d.rsdel);if(r.steps.length<=1){toast('단계는 하나 이상 있어야 해요');return}r.steps.splice(+d.i,1);save('config');renderEdit();return}
  if(d.rsmove){const r=C.routines.find(x=>x.id===d.rsmove),i=+d.i,j=i+(+d.d);[r.steps[i],r.steps[j]]=[r.steps[j],r.steps[i]];save('config');renderEdit();return}
  // 편집: 목록
  if(d.lsdel){const id=d.lsdel;const n=openTasks().filter(t=>t.list===id).length;if(n&&(!ui.delArm||Date.now()-ui.delArm>3000)){ui.delArm=Date.now();toast(`할 일 ${n}개가 받은함으로 가요. 한 번 더 누르면 지워요`);return}
    Object.values(TASKS).forEach(t=>{if(t.list===id){t.list='inbox';saveTask(t)}});C.lists=C.lists.filter(l=>l.id!==id);save('config');render();return}
  if(d.sheetmode){C.ui.sheet=d.sheetmode;save('config');renderEdit();return}
  // 가져오기
  if(b.id==='ttPick'){$('ttFile').click();return}
  if(b.id==='ttGo'){ttImport();return}
  if(b.id==='ttCancel'){ttPending=null;renderMore();return}
});
document.addEventListener('change',async e=>{
  const t=e.target,d=t.dataset;
  if(t.id==='tGroup'){C.ui.tasks.group=t.value;save('config');renderTasks();return}
  if(t.id==='tSort'){C.ui.tasks.sort=t.value;save('config');renderTasks();return}
  if(t.id==='tListSel'){if(t.value){C.ui.tasks.sel=t.value;save('config');renderTasks()}return}
  if(t.id==='calActual'){C.ui.cal.actual=t.checked;save('config');renderCal();return}
  if(t.id==='aeArea'){ui.ae.area=t.value;t.blur();renderEdit();return}
  if(t.id==='aeSort'){ui.ae.sort=t.value;t.blur();renderEdit();return}
  if(t.id==='sxMark'||t.id==='sxArea'||t.id==='sxAmt'){sheetRead();drawDoneSheet();return}
  if(sheetCtx&&sheetCtx.task&&t.closest('#sheetC')){
    if(d.tssub!=null){tsRead();const tk=TASKS[sheetCtx.task];tk.subs[+d.tssub].done=t.checked;tsCommit(true,false);const all=tk.subs.length&&tk.subs.every(s=>s.done);if(all&&t.checked)toast('하위 할 일을 다 했어요! 완료를 눌러요');return}
    if(['tsTitle','tsNote','tsReframe','tsTags','tsSec'].includes(t.id)||d.tssubt!=null){tsCommit(false);return}
    tsCommit();return}
  if(d.ae||d.aeo!=null){aeChange(t);return}
  if(d.rt){const r=C.routines.find(x=>x.id===d.rt);if(!r)return;let v=t.value;if(d.f==='xp'||d.f==='gold')v=Math.max(0,parseInt(v)||0);if(d.f==='name'&&!v.trim())return;r[d.f]=v;save('config');t.blur();renderEdit();toast('바꿨어요');return}
  if(d.rs){const r=C.routines.find(x=>x.id===d.rs);if(!r)return;const s=r.steps[+d.i];let v=t.value;if(d.f==='min')v=Math.max(0,parseInt(v)||0);if(d.f==='name'&&!v.trim())return;s[d.f]=v;if(d.f==='aid'&&v&&v!=='@weigh'&&(s.name==='새 단계'||s.name==='첫 단계')){const a=C.actions.find(x=>x.id===v);if(a){s.name=a.name;if(a.dur)s.min=a.dur}}save('config');t.blur();renderEdit();return}
  if(d.ls){const l=C.lists.find(x=>x.id===d.ls);if(!l)return;let v=t.value;if(d.f==='name'&&!v.trim())return;if(d.f==='folder'||d.f==='desc')v=v.trim();if(d.f==='marble'&&!v){delete l.marble}else l[d.f]=v;save('config');t.blur();render();toast('바꿨어요');return}
  if(t.id==='ttFile'){const f=t.files&&t.files[0];if(!f)return;try{ttPending=ttAnalyze(await f.text());renderMore()}catch(err){console.error(err);toast(err.message||'읽지 못했어요')}t.value='';return}
});
document.addEventListener('input',e=>{
  const t=e.target;
  const pv={htAdd:'htParse',tAdd:'tParse',calAdd:'calParse'}[t.id];
  if(pv){const v=t.value.trim();$(pv).innerHTML=v?parseChips(parseQuick(v,{baseDate:t.id==='calAdd'?ui.calSel:undefined})):'';return}
  if(t.id==='aeQ'){ui.ae.q=t.value;clearTimeout(ui.aeT);ui.aeT=setTimeout(()=>rerenderEditKeep('aeQ'),180);return}
  if(t.id==='trayQ'){ui.trayQ=t.value;renderTray();return}
});
document.addEventListener('submit',e=>{
  const f=e.target;
  if(f.dataset.taddform){e.preventDefault();const inp=f.querySelector('input');const v=inp.value.trim();if(!v){inp.focus();return}
    const k=f.dataset.taddform;const sel=C.ui.tasks.sel||'today';
    const opts=k==='home'?{due:dateKey()}:k==='cal'?{due:ui.calSel}:{list:sel.startsWith('l:')?sel.slice(2):undefined,due:sel==='today'?dateKey():sel==='tomorrow'?addDays(dateKey(),1):undefined};
    const p0=k==='cal'?parseQuick(v,{baseDate:ui.calSel}):null;
    if(p0&&!p0.due)opts.due=ui.calSel;
    if(sel.startsWith('#')&&k==='tasks')inp.value=v+' '+sel;
    addTaskFrom(k==='tasks'&&sel.startsWith('#')?v+' '+sel:v,opts);inp.value='';const pid={htAdd:'htParse',tAdd:'tParse',calAdd:'calParse'}[inp.id];if(pid)$(pid).innerHTML='';inp.focus();return}
  if(f.dataset.tssubadd!=null){e.preventDefault();const v=$('tsSubNew').value.trim();if(!v)return;tsRead();const t=TASKS[sheetCtx.task];t.subs=t.subs||[];t.subs.push({t:v,done:false});tsCommit(true,false);setTimeout(()=>$('tsSubNew')&&$('tsSubNew').focus(),30);return}
  if(f.id==='nlForm'){e.preventDefault();const n=$('nlName').value.trim();if(!n)return;const l={id:'l'+uid(),name:n,folder:$('nlFolder').value.trim(),area:$('nlArea').value};C.lists.push(l);save('config');closeSheet();C.ui.tasks.sel='l:'+l.id;render();toast(`'${n}' 목록을 만들었어요`);return}
  if(f.id==='q5Form'){e.preventDefault();const n=$('q5Name').value.trim();if(!n)return;closeSheet();startFive({name:n});return}
});
addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('sheet').hidden){closeSheet();e.stopPropagation()}}},true);
