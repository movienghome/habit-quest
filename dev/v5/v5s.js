/* ================= v6.2: 루틴 = 할 일 묶음 · 사냥 화면 · 캘린더 꽉 차게 · 직접 그린 장비 · 이번 주 용기 한 가지 · 보스 대사 =================
   맨 끝 모듈(v5r 뒤, patch13 아이콘 바꾸기 뒤라 글자가 안 바뀌어요). 최상위 값은 var/function.
   다른 모듈이 감싼 함수는 '다시 대입'으로만 바꿔요. */

/* ---- 0) 공용 ---- */
function pts62(b,o){b=b||{};o=o||{};const x=[];if(+b.xp)x.push('✨'+(+b.xp));if(+b.gold)x.push('💰'+(+b.gold));if(+b.cond&&!o.noCond)x.push('🔋'+(+b.cond));return x.join(' ')||(o.zero||'점수 없음')}
function rtOfT62(t){return t&&t.rid&&(C.routines||[]).find(r=>r.id===t.rid)}
function isStep62(t){const h=t&&t.parent&&TASKS[t.parent];return !!(h&&h.rid&&rtOfT62(h))}
var RTL62='Lrt';
function rtList62(){if(!C.lists.some(l=>l.id===RTL62)){C.lists.push({id:RTL62,name:'⏱ 루틴',area:'',folder:''});save('config')}return RTL62}

/* ---- 1) 루틴 = '머리' 할 일 + 단계(묶인 할 일) ----
   단계는 모두 할 일이에요. 카드를 이으면 카드 점수, 아니면 할 일 크기·중요도 점수.
   단계는 루틴의 날짜를 따라요(자기 날짜·반복 없음). 반복 루틴이면 다음 날 단계가 다시 열려요. */
function rtH62(r,make){
  if(!r||!tasksReady)return null;let best=null;
  for(const k in TASKS){const t=TASKS[k];if(t&&t.rid===r.id&&t.status===0){if(t.rep&&t.rep.f)return t;if(!best)best=t}}
  if(best||!make||!ready)return best;
  const t=newTask({title:r.name,rid:r.id,list:r.list&&listOk(r.list)?r.list:rtList62()});saveTask(t);
  C.ui.tfold=C.ui.tfold||{};C.ui.tfold[t.id]=1;save('config');return t}
function join62(t,head){
  if(!t||!head||t.id===head.id||t.rid)return;
  if(t.parent!==head.id&&!t.pre62)t.pre62={parent:t.parent||null,due:t.due||null,rep:t.rep||null,time:t.time||null,list:t.list||'inbox',quest:t.quest||0};
  t.parent=head.id;t.list=head.list;t.due=null;t.rep=null;t.time=null;delete t.quest;delete t.skull;saveTask(t)}
function mkChild62(head,{title,aid,min}){
  const t=newTask({title:title||'새 단계',list:head.list,dur:min||null});t.parent=head.id;t.rstep=1;
  if(aid&&aid!=='@weigh'&&C.actions.find(a=>a.id===aid))t.aid=aid;
  t.order=Date.now()+Math.random();saveTask(t);return t}
function sync62(r){
  if(!r||!tasksReady||!ready||!C.mig62)return;
  const head=rtH62(r,true);if(!head)return;let ch=false;
  if(head.title&&head.title!==r.name){r.name=head.title;ch=true}
  r.steps=r.steps||[];
  r.steps.forEach(s=>{if(!s.tid||!TASKS[s.tid]){if(s.tid&&!TASKS[s.tid]&&s.rstep62){s.dead62=1;return}
      const a=s.aid&&s.aid!=='@weigh'&&C.actions.find(x=>x.id===s.aid);
      const k=mkChild62(head,{title:s.aid==='@weigh'?'⚖ 몸무게 기록':a?a.name:(s.name||'단계'),aid:a?a.id:null,min:s.min});
      s.tid=k.id;s.rstep62=1;if(s.aid!=='@weigh')delete s.aid;delete s.name;ch=true}});
  // 다시 이은 머리: 머리를 지워서 풀린 단계는 새 머리로
  r.steps.forEach(s=>{const t=TASKS[s.tid];if(t&&!t.parent&&t.rstep&&t.status!==-1){t.parent=head.id;t.list=head.list;saveTask(t)}});
  const before=r.steps.length;
  r.steps=r.steps.filter(s=>{const t=TASKS[s.tid];return !s.dead62&&(!t||(t.status!==-1&&t.parent===head.id))});
  if(r.steps.length!==before)ch=true;
  const have=new Set(r.steps.map(s=>s.tid));
  kidsOf(head.id).filter(k=>!have.has(k.id)).sort((a,b)=>(a.order||0)-(b.order||0)).forEach(k=>{if(k.due||k.rep)join62(k,head);k.rstep=1;saveTask(k);r.steps.push({id:uid(),tid:k.id,min:k.dur||5});ch=true});
  r.steps.forEach(s=>{const t=TASKS[s.tid];if(t&&t.dur&&+t.dur!==+s.min){s.min=+t.dur;ch=true}});
  if(ch)save('config')}
function sync62all(){if(!C.mig62||!tasksReady||!ready)return;(C.routines||[]).forEach(sync62)}
// 단계 다시 열기: 반복 루틴은 지난날 끝낸 것만, 아니면 모두
function reopen62(head,all){if(!head)return;const td=dateKey();kidsOf(head.id).forEach(k=>{if(k.status===2&&(all||!k.doneAt||k.doneAt<td)){k.status=0;delete k.doneAt;saveTask(k)}})}
function mig62(){
  if(C.mig62||!ready||!tasksReady)return;
  try{(C.routines||[]).forEach(r=>{const head=rtH62(r,true);if(!head)return;
      (r.steps||[]).forEach(s=>{const t=s.tid&&TASKS[s.tid];if(t&&!t.rid&&t.parent!==head.id){join62(t,head);t.rstep=1;saveTask(t)}})});
  }catch(e){console.error(e)}
  C.mig62=1;save('config');sync62all()}
// 단계 이름·종류·이어진 루틴은 할 일에서
stName61=function(s){if(s.aid==='@weigh')return '⚖ 몸무게 기록';const t=s.tid&&TASKS[s.tid];if(t)return t.title;const a=s.aid&&C.actions.find(x=>x.id===s.aid);if(a)return a.name;return s.name||'단계'};
stKind61=function(s){if(s.aid==='@weigh')return '⚖';const t=s.tid&&TASKS[s.tid];return t&&t.aid?'🃏':'📋'};
rtOf61=function(kind,id){const out=[];(C.routines||[]).forEach(r=>(r.steps||[]).forEach((s,i)=>{const t=s.tid&&TASKS[s.tid];if((kind==='a'&&(s.aid===id||(t&&t.aid===id)))||(kind==='t'&&s.tid===id))out.push({r,i})}));return out};
function stDone62(t){return !!t&&(t.status===2||t.last===dateKey())}
function stPts62(s){if(s.aid==='@weigh')return{xp:+((C.weight||{}).xp)||0,gold:0,cond:0};const t=s.tid&&TASKS[s.tid];if(t)return taskBase(t);const a=s.aid&&C.actions.find(x=>x.id===s.aid);return a?{xp:+a.xp||0,gold:Math.abs(+a.gold||0),cond:Math.abs(+a.cond||0)}:{xp:0,gold:0,cond:0}}
function rtSum62(r){const s={xp:0,gold:0,cond:0,min:0};(r.steps||[]).forEach(x=>{const p=stPts62(x);s.xp+=+p.xp||0;s.gold+=+p.gold||0;s.cond+=+p.cond||0;s.min+=+x.min||0});return s}
// 넣기: 할 일 → 단계로 옮김 · 카드 → 카드와 이은 새 단계 · 이름 → 새 단계
rtAdd61=(function(prev){return function(r,step,pos){
  if(!C.mig62||!tasksReady)return prev(r,step,pos);
  const head=rtH62(r,true);step={...step};
  if(head){
    if(step.tid){const t=TASKS[step.tid];if(t&&t.parent!==head.id)join62(t,head);if(t){t.rstep=1;saveTask(t)}}
    else{const a=step.aid&&step.aid!=='@weigh'&&C.actions.find(x=>x.id===step.aid);
      const k=mkChild62(head,{title:step.aid==='@weigh'?'⚖ 몸무게 기록':a?a.name:(step.name||'새 단계'),aid:a?a.id:null,min:step.min||(a&&a.dur)});
      step.tid=k.id;step.rstep62=1;if(step.aid!=='@weigh')delete step.aid;delete step.name}}
  return prev(r,step,pos)}})(rtAdd61);
rtNew61=(function(prev){return function(name,steps){const r=prev(name,steps);try{sync62(r)}catch(e){console.error(e)}return r}})(rtNew61);
// 반복(언제): 머리 할 일은 그대로 두고 반복만 바꿔요 (안 정함 = 날짜 없는 루틴)
setRt60=(function(prev){return function(r,wd,quest){
  if(!C.mig62||!tasksReady)return prev(r,wd,quest);
  const h=rtH62(r,true);if(!h)return prev(r,wd,quest);
  if(!wd.length){h.rep=null;h.due=null;delete h.quest;delete h.skull;saveTask(h);syncDailies(C);save('config');return null}
  h.rep=wd.length===7?{f:'d',i:1}:{f:'w',i:1,wd:wd.slice().sort()};
  const td=dateKey();let d=firstDue(h.rep,td);if(d===td&&tDone60(h.id,DAYS[td]))d=nextDue(h.rep,td)||d;h.due=d;delete h.skull;
  if(quest!==undefined){if(quest)h.quest=1;else delete h.quest}
  saveTask(h);syncDailies(C);save('config');return h}})(setRt60);
// 루틴에서 빼기: 루틴 안에서 만든 단계는 지우고, 원래 있던 할 일은 원래 자리로
function unstep62(r,i,quiet){
  const s=r.steps[i];if(!s)return null;const t=s.tid&&TASKS[s.tid],snapT=t?clone(t):null;
  r.steps.splice(i,1);
  if(t){if(t.pre62){const p=t.pre62;if(p.parent&&TASKS[p.parent])t.parent=p.parent;else delete t.parent;t.due=p.due;t.rep=p.rep;t.time=p.time;t.list=p.list||'inbox';if(p.quest)t.quest=1;delete t.pre62;delete t.rstep;saveTask(t)}else deleteTask(t.id)}
  save('config');
  const undo=()=>{if(snapT)saveTask(snapT);r.steps.splice(i,0,s);save('config');refresh61()};
  if(!quiet)toastAct(`'${snapT?snapT.title:stName61(s)}' 단계를 뺐어요${snapT&&snapT.pre62?' (원래 자리로)':''}`,'되돌리기',undo);
  return undo}
function rdel62(r){
  const snapR=clone(C.routines),head=rtH62(r,false),snapH=head?clone(head):null,kids=head?kidsOf(head.id).map(clone):[];
  C.routines=C.routines.filter(x=>x.id!==r.id);
  kids.forEach(k=>{const t=TASKS[k.id];if(!t)return;if(t.pre62)unstep62({steps:[{tid:t.id}]},0,true);else deleteTask(t.id)});
  if(head)deleteTask(head.id);
  save('config');syncDailies(C);if(sheetCtx&&sheetCtx.rt61)closeSheet();if(curView()==='edit')reEdit();render();
  toastAct(`'${r.name}' 루틴을 지웠어요 (단계 ${kids.length}개도)`,'되돌리기',()=>{C.routines=snapR;if(snapH)saveTask(snapH);kids.forEach(k=>saveTask(k));save('config');syncDailies(C);if(curView()==='edit')reEdit();render()})}
// 할 일 → 루틴 / 카드 → 루틴
promoteTask61=(function(prev){return function(t){
  if(!C.mig62)return prev(t);
  if(t.rid){openRt61(t.rid);return}
  const r={id:'r'+uid(),name:t.title,xp:15,gold:0,area:areaOfTask(t)||'life',steps:[]};(C.routines=C.routines||[]).push(r);
  t.rid=r.id;const card=t.aid;delete t.aid;delete t.parent;saveTask(t);
  if(card)r.steps.push({id:uid(),tid:mkChild62(t,{title:(C.actions.find(a=>a.id===card)||{}).name,aid:card}).id,min:5});
  kidsOf(t.id).filter(k=>k.status===0&&!r.steps.some(s=>s.tid===k.id)).sort((a,b)=>(a.order||0)-(b.order||0)).forEach(k=>{join62(k,t);k.rstep=1;saveTask(k);r.steps.push({id:uid(),tid:k.id,min:k.dur||5})});
  (t.checks||t.subs||[]).forEach(s=>{const n=(s&&(s.t||s.n||s.name))||'';if(n&&!s.done)r.steps.push({id:uid(),tid:mkChild62(t,{title:n,min:5}).id,min:5})});
  if(!r.steps.length)r.steps.push({id:uid(),tid:mkChild62(t,{title:'첫 단계',min:5}).id,min:5});
  save('config');sync62(r);syncDailies(C);render();openRt61(r.id);toast(`'${t.title}'가 루틴이 됐어요 · 이 할 일을 누르면 루틴이 시작돼요`,5000)}})(promoteTask61);

/* ---- 2) 루틴 편집 (편집 화면 · 루틴 창 · 할 일 상세 같은 줄) ---- */
function stRow62(r,s,i,o){
  o=o||{};const t=s.tid&&TASKS[s.tid],a=t&&t.aid&&C.actions.find(x=>x.id===t.aid),ht=a&&habT(a),weigh=s.aid==='@weigh';
  const done=stDone62(t),p=stPts62(s),n=(r.steps||[]).length;
  const card=weigh?'<span class="tiny muted">⚖ 몸무게 칸에 적어요</span>'
    :a?`<span class="cx61"><button type="button" class="chipbtn x60c" data-aedit="${a.id}" title="카드 열기">🃏 ${esc(a.name)}${ht?` · ${ht.quest?'☑':'↻'}`:''}</button><button type="button" class="cxx" data-r62op="uncard:${r.id}:${i}" title="카드 연결 끊기 (할 일 점수로)" aria-label="카드 연결 끊기">×</button></span>`
    :`<button type="button" class="chipbtn x60c" data-r62op="card:${r.id}:${i}" title="행동 카드와 이으면 카드 점수가 들어가고 ↻ 습관·☑ 일퀘도 같이 체크돼요">🃏 카드와 잇기</button>`;
  return `<div class="st62 ${done?'ok':''}"><span class="no">${done?'✓':i+1}</span>
    <button type="button" class="st62n" ${t?`data-x60task="${t.id}"`:''} title="할 일 열기">${weigh?'':a?'🃏 ':'📋 '}<b>${esc(stName61(s))}</b>${done?' <span class="tiny muted">오늘 함</span>':''}</button>
    <span class="pt62" title="이 단계를 끝내면 받는 점수">${pts62(p,{zero:'0'})}</span>
    ${o.edit?`<label class="mn"><input type="number" min="0" max="240" data-r62min="${r.id}:${i}" value="${s.min||0}" aria-label="분">분</label>
    <span class="ops"><button class="ib" data-r62op="up:${r.id}:${i}" ${i?'':'disabled'} aria-label="위로">↑</button><button class="ib" data-r62op="dn:${r.id}:${i}" ${i<n-1?'':'disabled'} aria-label="아래로">↓</button><button class="ib" data-r62op="del:${r.id}:${i}" title="루틴에서 빼기" aria-label="루틴에서 빼기">×</button></span>`:`<span class="tiny muted">${s.min||0}분</span>`}
    ${o.edit?`<span class="why">${card}</span>`:''}</div>`}
function rtCard62(r,inSheet){
  sync62(r);const head=rtH62(r,false),t=rtT(r),wd=rtWd60(t),odd=t&&!isDailyRep(t.rep)&&t.rep.f!=='w',S=rtSum62(r);
  return `<div class="jarcard rt61 rt62" id="rt60-${r.id}">
    <div class="kv"><label>루틴 이름<input data-r61f="${r.id}:name" value="${esc(r.name)}"></label><label>완주 보너스 ✨<input data-r61f="${r.id}:xp" type="number" min="0" value="${r.xp||0}"></label><label>완주 보너스 💰<input data-r61f="${r.id}:gold" type="number" min="0" value="${r.gold||0}"></label><label>영역<select data-r61f="${r.id}:area">${C.areas.map(a=>`<option value="${a.id}" ${(r.area||'life')===a.id?'selected':''}>${esc(a.name)}</option>`).join('')}</select></label></div>
    <div class="when60"><b class="small">📅 언제</b>${odd?`<span class="small">${esc(repLabel(t.rep))}</span><button class="chipbtn" data-x60task="${t.id}">할 일에서 바꾸기</button>`:
      `${[1,2,3,4,5,6,0].map(w=>`<button type="button" class="chipbtn wd60" data-x60rwd="${r.id}:${w}" aria-pressed="${wd.includes(w)}">${WDK[w]}</button>`).join('')}<button type="button" class="chipbtn" data-x60rwd="${r.id}:all" aria-pressed="${wd.length===7}">매일</button>${wd.length?`<button type="button" class="chipbtn" data-x60rwd="${r.id}:none">안 정함</button>`:''}`}
      <label class="row small" style="gap:4px;margin-left:6px"><input type="checkbox" data-x60rq="${r.id}" ${t&&t.quest?'checked':''} ${t?'':'disabled'} style="width:auto">☑ 일퀘${t?(isDailyRep(t.rep)?'':' (고른 요일에만)'):' (언제를 정하면)'}</label>
      ${head?`<button type="button" class="chipbtn" data-x60task="${head.id}" title="할 일 목록에 있는 이 루틴">📋 ${esc(listName(head.list||'inbox'))}${t?' · 다음 '+esc(dueLabel(t.due)):''}</button>`:''}</div>
    <div class="st62s">${(r.steps||[]).map((s,i)=>stRow62(r,s,i,{edit:1})).join('')||'<div class="empty">단계가 없어요</div>'}</div>
    <div class="st62add" data-r62add="${r.id}"><span class="no">＋</span><input placeholder="새 단계 (할 일로 생겨요 · 예: 물 한 잔 10분)" maxlength="60" enterkeyhint="done" autocomplete="off" aria-label="새 단계"><button class="btn sm" type="button" data-r62go="1">추가</button></div>
    <div class="sum62"><span>⏱ 총 <b>${S.min}분</b></span><span>단계 합 <b>${pts62(S,{zero:'0'})}</b></span><span>+ 완주 보너스 <b>${pts62({xp:r.xp,gold:r.gold},{zero:'0'})}</b></span></div>
    <div class="row" style="gap:6px;flex-wrap:wrap"><button class="btn sm ghost" data-r62op="pick:${r.id}:${(r.steps||[]).length}">＋ 카드·있는 할 일에서 넣기</button><span style="flex:1"></span><button class="btn sm" data-rrun="${r.id}">⏱ 시작</button>${inSheet?`<button class="btn ghost sm" data-r61all="1">모든 루틴</button>`:''}<button class="btn ghost sm" data-r62op="rdel:${r.id}:0">루틴 지우기</button></div>
    <p class="tiny muted" style="margin:6px 0 0">단계 = 할 일이에요. 할 일 목록에서 이 루틴을 펼치면 단계가 보이고, 거기서 고친 것도 여기 그대로예요. 카드와 이은 단계는 카드 점수(↻ 습관·☑ 일퀘도 체크), 아니면 할 일 크기·중요도 점수. 단계는 루틴 날짜를 따라요.</p></div>`}
rtCard61=rtCard62;
routinesEditHTML=function(){sync62all();const rs=C.routines||[];
  return `<p class="help">루틴 = <b>할 일 하나에 단계(할 일)를 순서대로 묶은 것</b>이에요. 할 일 목록의 '⏱ 루틴'에 있고, 누르면 사냥이 시작돼요. 단계를 끝낼 때마다 그 단계 점수가 들어가고, 다 끝내면 <b>완주 보너스</b>를 더 받아요.</p><div class="stack">`+rs.map(r=>rtCard62(r,false)).join('')+`</div><div class="row" style="margin-top:10px"><button class="btn sm" data-r61new="1">＋ 새 루틴</button></div>`};
function stepPick62(r,pos){
  const head=rtH62(r,true);
  const tasks=Object.values(TASKS).filter(t=>t.status===0&&!t.rid&&!t.hab&&(!head||t.parent!==head.id)&&!isStep62(t));
  openPicker61({title:`⏱ '${r.name}'에 단계 넣기`,multi:true,tabs:[
    {k:'card',label:'🃏 카드와 이은 단계',newLabel:'새 카드로',onNew:v=>{const a=newAction(uid(),v,'good',C.areas[0].id,'');const at=C.actions.findIndex(x=>x.type==='bad');C.actions.splice(at<0?C.actions.length:at,0,a);rtAdd61(r,{aid:a.id},pos);redrawRt61();toast(`'${v}' 카드와 단계를 만들었어요 · 점수는 카드에서`)},
      items:[{id:'@weigh',label:'⚖ 몸무게 기록',grp:'기록'},...C.actions.filter(a=>a.type==='good'&&!a.doneAt).map(a=>({id:a.id,label:a.name,sub:[a.xp?'✨'+a.xp:'',a.dur?a.dur+'분':'',isHabit(a)?'↻ 습관':''].filter(Boolean).join(' · '),grp:(C.areas.find(x=>x.id===a.area)||{}).name||'',score:stUse61(a.id)}))]},
    {k:'task',label:'📋 있는 할 일 옮기기',newLabel:'새 단계로',onNew:v=>{rtAdd61(r,{name:v},pos);redrawRt61();render()},
      items:tasks.map(t=>({id:t.id,label:t.title,sub:[t.due?dueLabel(t.due)+' → 루틴 날짜로':'',t.rep?'↻ '+repLabel(t.rep)+' → 루틴 날짜로':'',kidsOf(t.id).length?'📦 '+kidsOf(t.id).length:''].filter(Boolean).join(' · '),grp:'📂 '+listName(t.list||'inbox'),score:t.due&&t.due<=dateKey()?1:0}))}],
    onPick:sel=>{let p=pos;sel.forEach(({tab,id})=>{rtAdd61(r,tab==='card'?{aid:id}:{tid:id},p);if(p!=null)p++});redrawRt61();render();toast(`${sel.length}개를 단계로 넣었어요`)}})}
stepPick61=stepPick62;
function cardPick62(t,after){
  openPicker61({title:`🃏 '${t.title}'와 이을 카드`,tabs:[{k:'card',label:'행동 카드',newLabel:'새 카드로',onNew:v=>{const a=newAction(uid(),v,'good',C.areas[0].id,'');const at=C.actions.findIndex(x=>x.type==='bad');C.actions.splice(at<0?C.actions.length:at,0,a);save('config');t.aid=a.id;saveTask(t);after&&after()},
    items:C.actions.filter(a=>a.type==='good'&&!a.doneAt).map(a=>({id:a.id,label:a.name,sub:[a.xp?'✨'+a.xp:'',isHabit(a)?'↻ 습관':''].filter(Boolean).join(' · '),grp:(C.areas.find(x=>x.id===a.area)||{}).name||'',score:(a.name===t.title?50:0)+stUse61(a.id)}))}],
    onPick:([s])=>{t.aid=s.id;saveTask(t);after&&after();toast('카드와 이었어요 · 이 단계는 카드 점수로')}})}
function rt62redraw(){refresh61()}
addEventListener('click',e=>{const b=e.target.closest('[data-r62op]');if(!b)return;e.preventDefault();e.stopPropagation();
  const [op,rid,si]=b.dataset.r62op.split(':'),r=(C.routines||[]).find(x=>x.id===rid),i=+si;if(!r)return;const S=r.steps||[],s=S[i],t=s&&s.tid&&TASKS[s.tid];
  if(op==='pick'){lastPt={x:e.clientX,y:e.clientY};stepPick62(r,i);return}
  if(op==='rdel'){rdel62(r);return}
  if(op==='del'){if(S.length<=1){toast('단계는 하나 이상 있어야 해요 · 루틴을 지우려면 아래 버튼');return}unstep62(r,i);rt62redraw();return}
  if(op==='up'||op==='dn'){const j=op==='up'?i-1:i+1;if(j<0||j>=S.length)return;[S[i],S[j]]=[S[j],S[i]];save('config');rt62redraw();return}
  if(op==='card'&&t){cardPick62(t,rt62redraw);return}
  if(op==='uncard'&&t){const o=t.aid;delete t.aid;saveTask(t);rt62redraw();toastAct(`'${t.title}' 카드 연결을 끊었어요 · 이제 할 일 점수`,'되돌리기',()=>{t.aid=o;saveTask(t);rt62redraw()});return}
},true);
addEventListener('change',e=>{const i=e.target;if(!i.dataset||!i.dataset.r62min)return;e.stopPropagation();const [rid,si]=i.dataset.r62min.split(':'),r=(C.routines||[]).find(x=>x.id===rid),s=r&&r.steps[+si];if(!s)return;
  s.min=Math.max(0,parseInt(i.value)||0);const t=TASKS[s.tid];if(t){t.dur=s.min||null;saveTask(t)}save('config');rt62redraw()},true);
function stAddGo62(f){
  const r=(C.routines||[]).find(x=>x.id===f.dataset.r62add),inp=f.querySelector('input'),v=(inp.value||'').trim();if(!r||!v)return;
  const p=parseQuick(v),nm=p.title||v,a=C.actions.find(x=>x.name===nm&&x.type==='good');
  const st=rtAdd61(r,a?{aid:a.id,min:p.dur}:{name:nm,min:p.dur});const t=st&&TASKS[st.tid];if(t&&!a){if(p.tags&&p.tags.length)t.tags=p.tags;if(p.prio)t.prio=p.prio;if(p.dur){t.dur=p.dur;st.min=p.dur}saveTask(t);save('config')}
  inp.value='';rt62redraw();setTimeout(()=>{const n=document.querySelector(`[data-r62add="${r.id}"] input`);if(n)n.focus()},30);toast(a?`'${nm}' 카드와 이은 단계를 넣었어요`:`'${nm}' 단계를 넣었어요`)}
var STA62=0;addEventListener('keydown',e=>{if(e.key!=='Enter')return;const f=e.target.closest&&e.target.closest('[data-r62add]');if(!f)return;e.preventDefault();e.stopImmediatePropagation();if(Date.now()-STA62<350)return;STA62=Date.now();if(e.isComposing||e.keyCode===229)setTimeout(()=>stAddGo62(f),40);else stAddGo62(f)},true);
addEventListener('click',e=>{const b=e.target.closest('[data-r62go]');if(!b)return;e.preventDefault();e.stopPropagation();stAddGo62(b.closest('[data-r62add]'))},true);
addEventListener('change',e=>{if(e.target.closest&&e.target.closest('[data-r62add]'))e.stopPropagation()},true);
// 이어진 곳 칩의 '루틴에서 빼기' ×도 같은 규칙
{const w=f=>function(){const o=f.apply(this,arguments);return Array.isArray(o)?o.map(x=>typeof x==='string'?x.replace(/data-x61un="step:/g,'data-x62un="step:'):x):o};
  connCard60=w(connCard60);connRt60=w(connRt60);connTask61=w(connTask61)}
addEventListener('click',e=>{const b=e.target.closest('[data-x62un]');if(!b)return;e.preventDefault();e.stopPropagation();const [,rid,si]=b.dataset.x62un.split(':'),r=(C.routines||[]).find(x=>x.id===rid);if(!r)return;
  if((r.steps||[]).length<=1){toast('루틴에 단계가 하나뿐이에요 · 루틴을 지우려면 루틴 창에서');return}unstep62(r,+si);refresh61()},true);

/* ---- 3) 할 일 상세: 루틴이면 단계·시간·점수를 맨 위에 ---- */
function rtPanel62(h,r){
  sync62(r);const S=rtSum62(r),done=(r.steps||[]).filter(s=>stDone62(TASKS[s.tid])).length;
  return `<div class="rt62p"><div class="spread"><b>⏱ 루틴 · ${(r.steps||[]).length}단계 · ${S.min}분</b><span class="tiny muted">${done?`오늘 ${done}개 함`:''}</span></div>
    <div class="st62s">${(r.steps||[]).map((s,i)=>stRow62(r,s,i,{})).join('')}</div>
    <div class="st62add" data-r62add="${r.id}"><span class="no">＋</span><input placeholder="단계 추가 (할 일로 생겨요)" maxlength="60" enterkeyhint="done" autocomplete="off" aria-label="단계 추가"><button class="btn sm" type="button" data-r62go="1">추가</button></div>
    <div class="sum62"><span>단계 합 <b>${pts62(S,{zero:'0'})}</b></span><span>+ 완주 보너스 <b>${pts62({xp:r.xp,gold:r.gold},{zero:'0'})}</b></span></div>
    <div class="row" style="gap:6px"><button class="btn sm" data-rrun="${r.id}">⏱ 지금 시작</button><button class="btn ghost sm" data-x60rt="${r.id}">✎ 루틴 편집 (순서·분·카드)</button></div></div>`}
drawTaskSheet=(function(prev){return function(){const x=prev.apply(this,arguments);try{
  const t=sheetCtx&&sheetCtx.task&&TASKS[sheetCtx.task];const r=rtOfT62(t);
  if(t&&r&&C.mig62&&$('tsTitle')){const sc=$('sheetC');sc.querySelectorAll('.rt62p').forEach(e=>e.remove());
    sc.querySelectorAll('.kids56').forEach(e=>e.hidden=true);
    const d=document.createElement('div');d.innerHTML=rtPanel62(t,r);const el=d.firstElementChild;
    const c=$('tsTitle').nextElementSibling,p=c&&c.nextElementSibling;(p||$('tsTitle')).after(el)}
  else if(t&&isStep62(t)){const h=TASKS[t.parent],rr=rtOfT62(h),sc=$('sheetC');sc.querySelectorAll('.kids56').forEach(k=>{if(!k.querySelector('.st62in')){k.innerHTML=`<span class="small muted st62in">⏱ 루틴 단계</span> <button class="chipbtn" data-x60rt="${rr.id}">${esc(rr.name)} ${(rr.steps||[]).findIndex(s=>s.tid===t.id)+1}단계</button> <span class="tiny muted">날짜는 루틴을 따라요 · 점수 ${pts62(taskBase(t),{zero:'0'})}</span>`}})}
}catch(e){console.error(e)}return x}})(drawTaskSheet);

/* ---- 4) 사냥 ---- */
startRun=(function(prev){return function(o){
  try{if(o&&o.routine&&C.mig62){const r=(C.routines||[]).find(x=>x.id===o.routine.id)||o.routine;sync62(r);const h=rtH62(r,false),rep=!!(h&&h.rep&&h.rep.f);reopen62(h,!rep);
    let st=(r.steps||[]).filter(s=>TASKS[s.tid]);const left=rep?st.filter(s=>!stDone62(TASKS[s.tid])):st;
    if(rep&&!left.length){toast('오늘 단계를 다 했어요 · 다시 하려면 루틴 창에서 단계를 열어요');return}
    if(rep&&left.length<st.length)toast(`오늘 이미 한 ${st.length-left.length}단계는 건너뛰어요`);
    o={...o,routine:{...r,steps:left}}}}catch(e){console.error(e)}
  return prev(o)}})(startRun);
function routineStep62(k){
  const st=RUN.steps[RUN.si],el=stepElapsed(),t=st.tid&&TASKS[st.tid];
  const mon=$('huntMon');if(mon){mon.classList.remove('hit');void mon.offsetWidth;mon.classList.add('hit')}
  let got=null;
  if(k==='done'){
    if(st.aid==='@weigh'){const v=parseFloat(($('huntW')||{}).value);if(v>=30&&v<=250){commit(()=>{const day=today();day.weight=+v.toFixed(1);const w=day.entries.find(x=>x.kind==='weigh');if(w)w.name='몸무게 '+day.weight+'kg';else applyEntry(day,{kind:'weigh',type:'good',name:'몸무게 '+day.weight+'kg',xp:+C.weight.xp||0,gold:0})});got={xp:+C.weight.xp||0}}
      if(t){t.last=dateKey();t.cnt=(t.cnt||0)+1;saveTask(t)}}
    else if(t&&t.status===0){ui.off=0;got=taskBase(t);completeTask(t,{direct:true,elapsed:el});if(t.status===2){t.status=0;delete t.doneAt;saveTask(t)}}}
  RUN.log.push({name:st.name,sec:Math.round(el),target:(+st.min||5)*60,skip:k==='skip'?1:0,tid:st.tid});
  if(RUN.si<RUN.steps.length-1){RUN.si++;RUN.stepStart=Date.now();RUN.stepPaused=0;if(RUN.pauseAt)RUN.pauseAt=Date.now();delete RUN.beeped;runSave();buzz(25);
    fxPop(k==='skip'?'건너뜀':'✓ '+st.name+(got&&+got.xp?' ✨'+got.xp:''),'var(--good)');drawHunt(true);return}
  finishRoutine()}
finishRoutine=(function(prev){return function(){
  const R=RUN,h=R&&C.mig62&&(()=>{const r=(C.routines||[]).find(x=>x.id===R.id);return r&&rtH62(r,false)})();let d=null;
  if(h&&!(h.rep&&h.rep.f)&&h.due){d=h.due;h.due=null}
  const x=prev.apply(this,arguments);
  if(h&&d!==null){h.last=dateKey();saveTask(h)}return x}})(finishRoutine);
function quitAsk62(){
  const box=$('hunt');if(!box||!RUN)return;box.querySelectorAll('.q62').forEach(e=>e.remove());
  const isR=RUN.kind==='routine',did=isR?RUN.log.filter(x=>!x.skip).length:0;
  const d=document.createElement('div');d.className='q62';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');
  d.innerHTML=`<div class="q62b"><b>그만둘까요?</b><p class="small" style="margin:6px 0 10px">${isR?(did?`끝낸 ${did}단계는 이미 기록됐어요(지워지지 않아요).`:'아직 끝낸 단계가 없어요.')+' 완주 보너스는 없어요.':'타이머만 멈추고 기록은 안 해요.'}</p>
    <div class="stack" style="gap:6px"><button class="btn go" data-q62="stay">← 계속하기</button>${isR&&did?`<button class="btn ghost" data-q62="part">여기까지 하고 끝내기 (${did}/${RUN.steps.length})</button>`:''}${!isR?`<button class="btn ghost" data-q62="done">이미 끝냈어요 · 지금 기록</button>`:''}<button class="btn ghost bad62" data-q62="quit">기록 없이 그만두기</button></div></div>`;
  box.appendChild(d);setTimeout(()=>{const b=d.querySelector('[data-q62="stay"]');b&&b.focus()},30)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-q62]');if(!b)return;e.preventDefault();e.stopPropagation();const k=b.dataset.q62;
  const q=b.closest('.q62');if(q)q.remove();if(!RUN)return;
  if(k==='quit'){endRun();return}
  if(k==='part'){finishRoutine();return}
  if(k==='done'){huntDo('done');return}},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const q=document.querySelector('#hunt .q62');if(q){q.remove();e.stopPropagation()}}},true);
huntDo=(function(prev){return function(k){
  if(k==='quit'&&RUN){quitAsk62();return}
  if(RUN&&RUN.kind==='routine'&&(k==='done'||k==='skip')&&C.mig62){routineStep62(k);return}
  return prev(k)}})(huntDo);
// 사냥 화면: 단계마다 점수 · 다르게 보기는 접어서 · 버튼이 늘 보이게(css)
drawHunt=(function(prev){return function(full){const x=prev.apply(this,arguments);try{
  if(!full||!RUN)return x;const h=$('hunt');
  const rf=h.querySelector('.arena .reframe');if(rf&&!rf.classList.contains('rf62')){rf.classList.add('rf62');rf.tabIndex=0;rf.title='눌러서 펼치기·접기'}
  if(RUN.kind==='routine'){
    const r=(C.routines||[]).find(z=>z.id===RUN.id),sp=h.querySelector('.steps');
    if(sp)sp.innerHTML=RUN.steps.map((s,i)=>{const p=stPts62(s),lg=RUN.log[i];return `<span class="${i===RUN.si?'on':i<RUN.si?(lg&&lg.skip?'sk':'ok'):''}">${esc(s.name)}${+p.xp?` <small>✨${p.xp}</small>`:''}</span>`}).join('');
    const st=RUN.steps[RUN.si],p=st&&stPts62(st),tot=$('huntTot');
    if(tot&&p&&!h.querySelector('.stp62'))tot.insertAdjacentHTML('afterend',`<div class="stp62"><span>이 단계 <b>${pts62(p,{zero:'0'})}</b></span><span>완주하면 +<b>${pts62({xp:r&&r.xp,gold:r&&r.gold},{zero:'0'})}</b></span></div>`);
    const tip=h.querySelector('.arena > .small.muted:last-child');if(tip)tip.innerHTML=`${RUN.si+1}/${RUN.steps.length}단계 · 단계를 끝낼 때마다 그 점수가 바로 들어가요`}
}catch(e){console.error(e)}return x}})(drawHunt);
document.addEventListener('click',e=>{const r=e.target.closest('#hunt .rf62');if(r)r.classList.toggle('open')});

/* ---- 5) 카드와 이은 할 일을 끝내면 그 카드의 ↻ 습관도 같이 (루틴 단계·연결 할 일) ---- */
applyEntry=(function(prev){return function(day,e){const r=prev.apply(this,arguments);try{
  if(e&&e.kind==='act'&&e.type==='good'&&e.aid&&e.tid&&day&&day.date===dateKey()){const src=TASKS[e.tid];
    if(src&&!src.hab){const a=C.actions.find(x=>x.id===e.aid),ht=a&&habT(a);
      if(ht&&ht.id!==src.id&&ht.due&&ht.due<=day.date&&!(day.entries||[]).some(x=>x!==e&&x.tid===ht.id)){
        e.htid62=ht.id;e.hprev62=ht.due;e.hcnt62=ht.cnt||0;ht.cnt=(ht.cnt||0)+1;ht.last=day.date;let nx=nextDue(ht.rep,ht.due);while(nx&&nx<=day.date)nx=nextDue(ht.rep,nx);if(nx)ht.due=nx;saveTask(ht)}}}
}catch(x){console.error(x)}return r}})(applyEntry);
unapplyEntry=(function(prev){return function(day,e){prev.apply(this,arguments);try{if(e&&e.htid62){const ht=TASKS[e.htid62];if(ht){ht.due=e.hprev62;ht.cnt=e.hcnt62||0;saveTask(ht)}}}catch(x){console.error(x)}}})(unapplyEntry);

/* ---- 6) 캘린더: 폰에서 화면 가득 (틱틱처럼) ---- */
function calN62(){return document.body.classList.contains('cal62')?14:3}
function cal62on(){return curView()==='cal'&&innerWidth<760&&!splitOn()}
function cal62tog(){document.body.classList.toggle('cal62',cal62on())}
function cal62bar(){
  const bar=document.querySelector('#calPane .calbar2');if(!bar)return;
  if(!$('cal62v')){const m=$('calModes');const v=document.createElement('button');v.id='cal62v';v.className='ib wide cal62only';v.type='button';v.title='보기 바꾸기';m.before(v);
    const o=document.createElement('button');o.id='cal62m';o.className='ib cal62only';o.type='button';o.title='설정';o.setAttribute('aria-label','캘린더 설정');o.innerHTML='⋯';bar.appendChild(o)}
  const mode=(C.ui.cal||{}).mode||'month';$('cal62v').textContent=({'1day':'1일','3day':'3일',week:'주',month:'월',agenda:'일정'})[mode]+' ▾'}
function cal62fit(){
  if(!document.body.classList.contains('cal62'))return;const g=$('calMain')&&$('calMain').querySelector('.mgrid');if(!g)return;
  const nav=document.querySelector('.bnav'),nh=nav&&getComputedStyle(nav).display!=='none'?nav.getBoundingClientRect().height:0;
  const rows=Math.ceil((g.querySelectorAll('.mc').length)/7)||5,top=g.getBoundingClientRect().top;
  const H=Math.max(360,Math.floor(innerHeight-top-nh-6));g.style.height=H+'px';g.style.gridTemplateRows=`auto repeat(${rows},minmax(0,1fr))`;
  g.querySelectorAll('.mc').forEach(mc=>{const cap=mc.clientHeight,chips=[...mc.querySelectorAll('.cchip')],mr=mc.querySelector('.more');if(mc.dataset.b62==null)mc.dataset.b62=mr?(parseInt(mr.textContent.replace(/\D/g,''))||0):0;let base=+mc.dataset.b62,hid=0;
    chips.forEach(c=>{c.hidden=false});chips.forEach(c=>{if(c.offsetTop+c.offsetHeight>cap-14){c.hidden=true;hid++}});
    if(hid||base){let m=mr;if(!m){m=document.createElement('span');m.className='more';mc.appendChild(m)}m.textContent='+'+(hid+base)}else if(mr)mr.remove()})}
renderCal=(function(prev){return function(){cal62tog();const x=prev.apply(this,arguments);try{
  if(!calShown())return x;cal62bar();
  if(document.body.classList.contains('cal62')&&(C.ui.cal||{}).mode==='month'){const m=monthKey(ui.calAnchor),[y,mo]=m.split('-').map(Number);$('calTitle').textContent=(y===+dateKey().slice(0,4)?'':y+'년 ')+mo+'월'}
  // 목록 색을 '표시: 목록'에도
  if((C.ui.cal||{}).color==='list')document.querySelectorAll('#calPane [data-ctask]').forEach(el=>{const t=TASKS[el.dataset.ctask],l=t&&C.lists.find(z=>z.id===t.list);if(l&&l.color){el.style.borderLeft=`3px solid ${l.color}`;el.style.background=`color-mix(in srgb,${l.color} 16%,var(--panel))`}});
  requestAnimationFrame(cal62fit)}catch(e){console.error(e)}return x}})(renderCal);
addEventListener('resize',()=>{clearTimeout(window.__c62);window.__c62=setTimeout(()=>{try{const was=document.body.classList.contains('cal62');cal62tog();if(calShown()&&was!==document.body.classList.contains('cal62'))renderCal();else cal62fit()}catch(e){}},150)});
addEventListener('hashchange',()=>setTimeout(()=>{try{cal62tog();if(curView()==='cal')cal62fit()}catch(e){}},0));
addEventListener('click',e=>{const b=e.target.closest('#cal62v,#cal62m');if(!b)return;e.preventDefault();e.stopPropagation();const r=b.getBoundingClientRect(),x=r.left,y=r.bottom+4;
  const cs=C.ui.cal||{};
  if(b.id==='cal62v'){menu61(x,y,'보기',[['1day','1일'],['3day','3일'],['week','주'],['month','월'],['agenda','일정 목록']].map(([v,l])=>({l:(cs.mode===v?'● ':'○ ')+l,f:()=>{const m=document.querySelector(`[data-calmode="${v}"]`);m&&m.click()}})));return}
  const col=v=>()=>{const s=$('cal57Color');if(s){s.value=v;s.dispatchEvent(new Event('change',{bubbles:true}))}};
  menu61(x,y,'캘린더 설정',[{l:(!cs.color?'● ':'○ ')+'색: 중요도',f:col('')},{l:(cs.color==='area'?'● ':'○ ')+'색: 영역',f:col('area')},{l:(cs.color==='list'?'● ':'○ ')+'표시: 목록',f:col('list')},'-',
    {l:(cs.actual!==false?'☑':'☐')+' 한 일 기록 겹쳐 보기 (주·일)',f:()=>{const c=$('calActual');c.checked=!c.checked;c.dispatchEvent(new Event('change',{bubbles:true}))}},
    {l:'📥 서랍 (끌어 쓰기)',f:()=>$('calTrayBtn').click()},{l:'⚲ 거르기',f:()=>$('calFilterBtn').click()},{l:'? 도움말',f:()=>{const h=document.querySelector('[data-calhelp]');h&&h.click()}},'-',{l:'🏠 홈 (캐릭터)',f:()=>{location.hash='home'}}])},true);
// 폰 월 보기: 옆으로 밀어 달 넘기기
{let sx=0,sy=0,st=0;addEventListener('touchstart',e=>{if(!document.body.classList.contains('cal62')||!e.target.closest('#calMain .mgrid'))return;const t=e.touches[0];sx=t.clientX;sy=t.clientY;st=Date.now()},{passive:true});
  addEventListener('touchend',e=>{if(!st||!document.body.classList.contains('cal62'))return;const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;const ok=Date.now()-st<600&&Math.abs(dx)>60&&Math.abs(dy)<45;st=0;if(!ok||(typeof dragS!=='undefined'&&dragS))return;const b=document.querySelector(`[data-calnav="${dx<0?1:-1}"]`);b&&b.click()},{passive:true})}

/* ---- 7) 이번 주 용기 한 가지 (선택) ---- */
function wone62(){const ws=weekStart(dateKey()),id=(C.wone62||{})[ws],t=id&&TASKS[id];return{ws,t}}
function woneHTML62(){const {t}=wone62();
  if(!t)return `<div class="wone62"><button type="button" class="chipbtn" data-w62="set" title="하고 싶다면 하나만 · 안 정해도 괜찮아요">⚔️ 이번 주 용기 한 가지 정하기 <span class="tiny muted">(선택)</span></button></div>`;
  return `<div class="wone62 ${t.status===2?'ok':''}"><span class="tiny muted">⚔️ 이번 주 한 가지</span> <button type="button" class="chipbtn" data-x60task="${t.id}">${t.status===2?'✓ ':''}${esc(t.title)}</button>${t.status===2?' <span class="tiny">해냈어요</span>':` <button type="button" class="chipbtn" data-w62="change" title="바꾸기">✎</button>`}</div>`}
function woneSet62(){const {ws,t}=wone62(),end=addDays(ws,6);
  const cards=C.actions.filter(a=>a.brave&&a.type==='good'&&!a.doneAt),tasks=openTasks().filter(x=>(x.brave||((C.actions.find(a=>a.id===x.aid)||{}).brave))&&(!t||x.id!==t.id));
  openPicker61({title:'⚔️ 이번 주 용기 한 가지',tabs:[{k:'new',label:'✎ 새로 적기',newLabel:'이걸로',onNew:v=>pick({title:v}),items:[]},
      {k:'task',label:'⚔️ 용기 할 일',items:tasks.map(x=>({id:x.id,label:x.title,sub:x.due?dueLabel(x.due):'날짜 없음'}))},
      {k:'card',label:'⚔️ 용기 카드',items:cards.map(a=>({id:a.id,label:a.name,sub:'카드 점수로 기록'}))}],
    onPick:([s])=>{if(s.tab==='task'){const x=TASKS[s.id];if(x&&(!x.due||x.due>end)){x.due=end;saveTask(x)}set(x)}else{const a=C.actions.find(z=>z.id===s.id);if(a)pick({title:a.name,aid:a.id})}}});
  function pick(p){const x=newTask({title:p.title,aid:p.aid,brave:p.aid?undefined:1,due:end,list:'inbox'});saveTask(x);set(x)}
  function set(x){if(!x)return;C.wone62=C.wone62||{};Object.keys(C.wone62).forEach(k=>{if(k<addDays(ws,-63))delete C.wone62[k]});C.wone62[ws]=x.id;save('config');render();toast(`이번 주 한 가지: '${x.title}' · 일요일까지, 안 돼도 괜찮아요`,4500)}}
addEventListener('click',e=>{const b=e.target.closest('[data-w62]');if(!b)return;e.preventDefault();e.stopPropagation();woneSet62()},true);
reviewHTML59=(function(prev){return function(){const h=prev.apply(this,arguments);try{return h.replace(/(<h2>⚔️? 용기<\/h2><\/div>)/,'$1'+woneHTML62())}catch(e){return h}}})(reviewHTML59);

/* ---- 8) 보스 대사 ---- */
var BLINE62={
  '망설임의 안개':['조금만 더 생각해 보고 하자…','지금은 타이밍이 아니야.','내일의 네가 더 잘할 거야.'],
  '무기력 늪지기':['누워 있는 게 제일 편하지?','오늘은 쉬어도 돼… 계속.','움직이면 더 피곤해져.'],
  '미루기 괴물':['5분만 있다가.','마감은 아직 멀었잖아.','이거 먼저 하고 하자… 저것도.'],
  '완벽주의 골렘':['완벽하지 않으면 시작하지 마.','이 정도로는 부끄러워.','처음부터 다시 해.'],
  '불안 안개':['잘못되면 어떡해?','다들 너를 보고 있어.','확실해질 때까지 기다려.'],
  '회피 박쥐':['못 본 척하면 사라질 거야.','연락은 나중에 해도 돼.','그 얘기는 꺼내지 말자.']};
var BDEAD62=['…한 번 시작하니 막을 수가 없군.','다음 주에 다시 오겠다…','네가 이겼다. 이번엔.'];
function bossLine62(name,dead){const L=dead?BDEAD62:(BLINE62[name]||['…']);const n=Math.floor(toUTC(dateKey())/864e5);return L[((n%L.length)+L.length)%L.length]}
function bossSay62(){try{const box=$('weekBox');const b=box&&box.querySelector('.boss');if(!b||b.querySelector('.say62'))return;const nm=(b.querySelector('b')||{}).textContent||'';
  const dead=b.classList.contains('dead');const d=document.createElement('div');d.className='say62';d.textContent='「'+bossLine62(nm,dead)+'」';const t=b.querySelector('b');t&&t.after(d)}catch(e){}}

/* ---- 9) 직접 그린 장비 (꾸미기 전용 · 점수 효과 없음) ---- */
var GSZ62={head:{w:13,h:7,at:[2,-3],l:'🎩 머리'},body:{w:11,h:7,at:[3,10],l:'👕 몸'},weapon:{w:5,h:11,at:[12,2],l:'🗡 손'},shield:{w:6,h:7,at:[0,9],l:'🛡 방패'}};
var GPAL62=[['K','#1e1e24','검정'],['W','#f4f4f4','흰색'],['M','#9aa0aa','회색'],['R','#a3303c','빨강'],['O','#e07a10','주황'],['Y','#e6b422','노랑'],['G','#4f8a3c','초록'],['L','#8db35d','연두'],['N','#8a5a2b','갈색'],['T','#d9a441','황토'],['P','#b58ad0','보라'],['Q','#e889b0','분홍']];
function gpal62(){const o={};GPAL62.forEach(([k,c])=>o[k]=c);return o}
var GCOST62=30;
function gCustom62(){const g=gearSt60();g.custom=g.custom||[];return g.custom}
function gSync62(){try{if(!C||!C.gear60)return;for(let i=GEAR60.length-1;i>=0;i--)if(/^cg/.test(GEAR60[i].id))GEAR60.splice(i,1);
  gCustom62().forEach(c=>GEAR60.push({id:c.id,slot:c.slot,name:'✏ '+c.name,price:0,at:GSZ62[c.slot].at,rows:c.rows,pal:gpal62(),mine:1}))}catch(e){console.error(e)}}
var GD62=null;
function gdOpen62(id){gSync62();const c=id&&gCustom62().find(x=>x.id===id);const slot=c?c.slot:'head',z=GSZ62[slot];
  GD62={id:c?c.id:null,slot,name:c?c.name:'',pen:'K',rows:c?c.rows.slice():Array(z.h).fill('.'.repeat(z.w))};sheetCtx={gd62:1};gdDraw62()}
function gdItem62(){return {id:'cg-preview',slot:GD62.slot,name:'미리보기',price:0,at:GSZ62[GD62.slot].at,rows:GD62.rows,pal:gpal62()}}
function gdPrev62(){const i=GEAR60.findIndex(x=>x.id==='cg-preview');if(i>=0)GEAR60.splice(i,1);GEAR60.push(gdItem62());const eq={...((C.gear60||{}).eq||{})};eq[GD62.slot]='cg-preview';
  const av=C.avatar||{};return spriteSVG(av.kind||'director','happy',av.outfit||'#2e9a4a',{fx:false,gear:eq})}
function gdDraw62(){
  const z=GSZ62[GD62.slot],pal=gpal62(),mine=gCustom62();
  const grid=GD62.rows.map((row,y)=>[...row].map((ch,x)=>`<button type="button" class="gc62" data-gc="${x}:${y}" style="${ch!=='.'?`background:${pal[ch]}`:''}" aria-label="${x+1},${y+1} ${ch==='.'?'빈칸':(GPAL62.find(p=>p[0]===ch)||[])[2]}"></button>`).join('')).join('');
  openSheet(`<div class="sh"><h3>✏ 장비 직접 그리기</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
  <p class="help" style="margin:0">꾸미기 전용이에요(점수 효과 없음). 새 장비를 저장할 때 💰${GCOST62}, 고치는 건 무료.</p>
  <div class="row" style="gap:6px;flex-wrap:wrap">${Object.entries(GSZ62).map(([k,v])=>`<button type="button" class="chipbtn" data-gd="slot:${k}" aria-pressed="${GD62.slot===k}" ${GD62.id&&GD62.slot!==k?'disabled':''}>${v.l}</button>`).join('')}</div>
  <div class="gd62"><div class="gg62" style="grid-template-columns:repeat(${z.w},1fr)" id="gd62g">${grid}</div><div class="gp62">${gdPrev62()}<span class="tiny muted">입었을 때</span></div></div>
  <div class="gpal62">${GPAL62.map(([k,c,n])=>`<button type="button" data-gd="pen:${k}" aria-pressed="${GD62.pen===k}" title="${n}"><i style="background:${c}"></i><small>${n}</small></button>`).join('')}<button type="button" data-gd="pen:." aria-pressed="${GD62.pen==='.'}" title="지우개"><i class="er"></i><small>지우개</small></button></div>
  <div class="row" style="gap:6px;flex-wrap:wrap"><input id="gd62n" maxlength="20" placeholder="장비 이름 (예: 감독 모자)" value="${esc(GD62.name)}" style="flex:1;min-width:140px"><button class="btn ghost sm" data-gd="clear">모두 지우기</button><button class="btn" data-gd="save">${GD62.id?'저장':`저장하고 입기 (−💰${GCOST62})`}</button></div>
  ${mine.length?`<div class="tiny muted" style="margin-top:8px">내가 그린 장비</div><div class="row" style="gap:6px;flex-wrap:wrap">${mine.map(c=>`<span class="cx61"><button type="button" class="chipbtn x60c" data-gd="edit:${c.id}">${GSZ62[c.slot].l.split(' ')[0]} ${esc(c.name)}</button><button type="button" class="cxx" data-gd="del:${c.id}" aria-label="지우기">×</button></span>`).join('')}</div>`:''}`)}
function gdPaint62(x,y){const r=GD62.rows[y];if(!r)return;const cur=r[x];if(cur===GD62.pen)return;GD62.rows[y]=r.slice(0,x)+GD62.pen+r.slice(x+1);
  const b=document.querySelector(`#gd62g [data-gc="${x}:${y}"]`);if(b)b.style.background=GD62.pen==='.'?'':gpal62()[GD62.pen];const p=document.querySelector('.gp62');if(p)p.innerHTML=gdPrev62()+'<span class="tiny muted">입었을 때</span>'}
{let down=false;addEventListener('pointerdown',e=>{const c=e.target.closest('#gd62g [data-gc]');if(!c||!GD62)return;e.preventDefault();down=true;const [x,y]=c.dataset.gc.split(':').map(Number);gdPaint62(x,y)},true);
  addEventListener('pointermove',e=>{if(!down||!GD62)return;const el=document.elementFromPoint(e.clientX,e.clientY),c=el&&el.closest&&el.closest('#gd62g [data-gc]');if(c){const [x,y]=c.dataset.gc.split(':').map(Number);gdPaint62(x,y)}},true);
  addEventListener('pointerup',()=>{down=false},true);addEventListener('pointercancel',()=>{down=false},true)}
addEventListener('click',e=>{const b=e.target.closest('[data-gd],[data-gd62open]');if(!b)return;e.preventDefault();e.stopPropagation();
  if(b.dataset.gd62open!=null){gdOpen62(b.dataset.gd62open||null);return}
  const [k,v]=b.dataset.gd.split(':');if(!GD62&&k!=='edit')return;
  const nm=$('gd62n');if(nm&&GD62)GD62.name=nm.value.trim();
  if(k==='slot'){const z=GSZ62[v];GD62.slot=v;GD62.rows=Array(z.h).fill('.'.repeat(z.w));gdDraw62();return}
  if(k==='pen'){GD62.pen=v;document.querySelectorAll('.gpal62 [data-gd]').forEach(x=>x.setAttribute('aria-pressed',x.dataset.gd==='pen:'+v));return}
  if(k==='clear'){const z=GSZ62[GD62.slot];GD62.rows=Array(z.h).fill('.'.repeat(z.w));gdDraw62();return}
  if(k==='edit'){gdOpen62(v);return}
  if(k==='del'){const L=gCustom62(),i=L.findIndex(x=>x.id===v);if(i<0)return;const it=L.splice(i,1)[0],g=gearSt60();g.own=g.own.filter(x=>x!==v);if(g.eq[it.slot]===v)delete g.eq[it.slot];save('config');gSync62();gdOpen62(null);render();toast(`'${it.name}' 지웠어요`);return}
  if(k==='save'){if(!GD62.rows.some(r=>/[^.]/.test(r))){toast('한 칸이라도 그려요');return}if(!GD62.name){toast('이름을 적어요');$('gd62n')&&$('gd62n').focus();return}
    const g=gearSt60(),L=gCustom62();
    if(GD62.id){const c=L.find(x=>x.id===GD62.id);if(c){c.name=GD62.name;c.rows=GD62.rows.slice()}}
    else{if(!guard())return;if(P.gold<GCOST62){toast(`골드가 모자라요 (💰${GCOST62} 필요)`);return}const id='cg'+uid();L.push({id,slot:GD62.slot,name:GD62.name,rows:GD62.rows.slice()});g.own.push(id);GD62.id=id;
      ui.off=0;commit(()=>applyEntry(today(),{kind:'buy',type:'buy',name:'직접 그린 장비: '+GD62.name,gold:-GCOST62,xp:0}))}
    g.eq[GD62.slot]=GD62.id;save('config');gSync62();closeSheet();GD62=null;render();toast('저장하고 입었어요');return}
},true);
renderGear60=(function(prev){return function(){gSync62();const x=prev.apply(this,arguments);try{const b=$('gear60');if(b&&!b.querySelector('.gdo62')){const d=document.createElement('div');d.className='gdo62 row';
  d.innerHTML=`<button class="btn ghost sm" data-gd62open="">✏ 직접 그리기 (💰${GCOST62})</button><span class="tiny muted">장비는 꾸미기 전용이에요 · 점수 효과 없음</span>`;b.appendChild(d)}}catch(e){console.error(e)}return x}})(renderGear60);
closeSheet=(function(prev){return function(){if(GD62&&sheetCtx&&sheetCtx.gd62){GD62=null;const i=GEAR60.findIndex(x=>x.id==='cg-preview');if(i>=0)GEAR60.splice(i,1)}return prev.apply(this,arguments)}})(closeSheet);

/* ---- 10) 뒤처리: 렌더 앞뒤 ---- */
render=(function(prev){return function(){
  try{mig62();if(C.mig62&&tasksReady){sync62all();(C.routines||[]).forEach(r=>{const h=rtH62(r,false);if(h&&h.rep&&h.rep.f)reopen62(h,false)})}gSync62()}catch(e){console.error(e)}
  const x=prev.apply(this,arguments);
  try{cal62tog();const gb=$('weekBox')&&$('weekBox').querySelector('.goalbox');if(gb&&!gb.querySelector('.wone62'))gb.insertAdjacentHTML('beforeend',woneHTML62());bossSay62()}catch(e){console.error(e)}
  return x}})(render);

/* ---- 11) 단계 할 일을 지우면 루틴에서도 · 되돌리면 '오늘 함'도 ---- */
deleteTask=(function(prev){return function(id){const r=prev.apply(this,arguments);try{(C.routines||[]).forEach(rt=>{const n=(rt.steps||[]).length;rt.steps=(rt.steps||[]).filter(s=>s.tid!==id);if(rt.steps.length!==n)save('config')})}catch(e){console.error(e)}return r}})(deleteTask);
undoTaskFrom=(function(prev){return function(e){const r=prev.apply(this,arguments);try{const t=TASKS[e.tid];if(t&&isStep62(t)&&t.last===dateKey()){const more=Object.values(DAYS).some(d=>d.date===dateKey()&&(d.entries||[]).some(x=>x!==e&&x.tid===t.id));if(!more){t.last=null;saveTask(t)}}}catch(x){console.error(x)}return r}})(undoTaskFrom);
// 목록에서 단계 줄에 '오늘 함'
taskRow=(function(prev){return function(t,o){let h=prev.apply(this,arguments);try{if(t&&t.status===0&&isStep62(t)&&t.last===dateKey())h=h.replace(/(<span class="tt">)/,'$1<span class="sd62">✓ 오늘</span> ')}catch(e){}return h}})(taskRow);
function kidSort62(h){const r=rtOfT62(h);if(!r)return taskSorter('due');const ix={};(r.steps||[]).forEach((s,i)=>ix[s.tid]=i);return (a,b)=>(ix[a.id]??999)-(ix[b.id]??999)}
// 루틴 머리 줄: '📦 0/8' 대신 '⏱ 8단계 · 76분'
taskRow=(function(prev){return function(t,o){let h=prev.apply(this,arguments);try{const r=t&&t.status===0&&rtOfT62(t);if(r&&C.mig62){const S=rtSum62(r),dn=(r.steps||[]).filter(s=>stDone62(TASKS[s.tid])).length;h=h.replace(/📦 \d+\/\d+/,`⏱ ${(r.steps||[]).length}단계 · ${S.min}분${dn?` · 오늘 ${dn}개`:''}`)}}catch(e){}return h}})(taskRow);
