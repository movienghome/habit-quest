/* ================= v6.4: 루틴 단계 자가증식 고침 · 루틴 타이머 없이 체크 · ⏱ 루틴 목록 · 루틴 바로 편집 · 캘린더 날짜 펼침(틱틱처럼) · PC 캘린더 넓게 · 보스·쫄따구 모양 · 메뉴 아이콘 =================
   맨 끝 모듈(v5t 뒤). 최상위 값은 var/function. 앞 모듈의 함수 선언은 '다시 대입'으로 바꿔요. */

/* ---- 0) 할 일이 서버에서 확인됐나 ----
   원인: 새로고침하면 할 일이 먼저 기기 캐시(옛 사본)에서 와요. 다른 기기에서 만든 단계 할 일이 캐시에 없으면
   '단계 할 일이 없네' 하고 새로 만들고, 곧 서버 것이 오면 옛 것도 단계로 다시 붙어서 단계가 두 배가 됐어요.
   그래서 할 일을 '만드는' 자동 처리(루틴 단계·머리, 습관 반복 할 일)는 서버 확인 뒤에만 해요. */
function tOK64(){return mode!=='db'||(tasksReady&&TSRV64)}
function tAll64(){return mode!=='db'||(tasksReady&&TSRV64&&TSRV64r)}
rtH62=(function(prev){return function(r,make){return prev(r,!!make&&tOK64())}})(rtH62);
mig62=(function(prev){return function(){if(!tOK64())return;return prev.apply(this,arguments)}})(mig62);
mig57=(function(prev){return function(){if(!tOK64())return;return prev.apply(this,arguments)}})(mig57);
habMigCard=(function(prev){return function(a){if(!tOK64())return false;return prev.apply(this,arguments)}})(habMigCard);
habMirror=(function(prev){return function(){if(!tOK64())return;return prev.apply(this,arguments)}})(habMirror);
// 단계 맞추기: 순서표에 있는데 할 일이 안 보이면 새로 만들지 않고 기다려요. 서버에서 확인된 뒤에도 없으면 그때 빼요.
sync62=function(r){
  if(!r||!tOK64()||!ready||!C.mig62)return;
  const head=rtH62(r,true);if(!head)return;let ch=false;
  if(head.title&&head.title!==r.name){r.name=head.title;ch=true}
  r.steps=r.steps||[];
  // 옛 형식(할 일 없는 카드·이름 단계)만 할 일로 만들어요
  r.steps.forEach(s=>{if(s.tid)return;
    const a=s.aid&&s.aid!=='@weigh'&&C.actions.find(x=>x.id===s.aid);
    const k=mkChild62(head,{title:s.aid==='@weigh'?'⚖ 몸무게 기록':a?a.name:(s.name||'단계'),aid:a?a.id:null,min:s.min});
    s.tid=k.id;if(s.aid!=='@weigh')delete s.aid;delete s.name;ch=true});
  r.steps.forEach(s=>{const t=TASKS[s.tid];if(t&&!t.parent&&t.rstep&&t.status!==-1){t.parent=head.id;t.list=head.list;saveTask(t)}});
  const all=tAll64(),before=r.steps.length,seen=new Set();
  r.steps=r.steps.filter(s=>{if(seen.has(s.tid))return false;seen.add(s.tid);const t=TASKS[s.tid];if(!t)return !all;return t.status!==-1&&t.parent===head.id});
  if(r.steps.length!==before)ch=true;
  const have=new Set(r.steps.map(s=>s.tid));
  kidsOf(head.id).filter(k=>!have.has(k.id)).sort((a,b)=>(a.order||0)-(b.order||0)).forEach(k=>{if(k.due||k.rep)join62(k,head);k.rstep=1;saveTask(k);r.steps.push({id:uid(),tid:k.id,min:k.dur||5});ch=true});
  r.steps.forEach(s=>{const t=TASKS[s.tid];if(t&&t.dur&&+t.dur!==+s.min){s.min=+t.dur;ch=true}});
  if(ch)save('config')};
// 아직 안 보이는 단계는 그리지 않아요
{const live=r=>({...r,steps:(r.steps||[]).filter(s=>!s.tid||TASKS[s.tid])});
  rtSum62=(function(prev){return function(r){return prev(live(r))}})(rtSum62);}

/* ---- 1) 한 번만: 이미 불어난 단계·머리·습관 반복 할 일 정리 (되돌리기 있음) ---- */
function dupKey64(t){return (t.title||'').trim()+'|'+(t.aid||'')+'|'+(t.rstep?'s':'')}
function better64(a,b){ // 남길 것: 많이 한 것 → 먼저 만든 것
  return ((b.cnt||0)-(a.cnt||0))||String(a.created||a.order||a.id).localeCompare(String(b.created||b.order||b.id))}
function fix64(){
  if(C.mig64||!ready||!tAll64()||!C.mig62)return;
  const bak={at:dateKey(),routines:clone(C.routines||[]),tasks:[],del:[]},keepT=t=>{if(!bak.tasks.some(x=>x.id===t.id))bak.tasks.push(clone(t))};
  let nStep=0,nHead=0,nHab=0;
  try{
    (C.routines||[]).forEach(r=>{
      const heads=Object.values(TASKS).filter(t=>t.rid===r.id&&t.status===0);if(!heads.length)return;
      const head=rtH62(r,false)||heads[0];
      heads.filter(h=>h.id!==head.id).forEach(h=>{kidsOf(h.id).forEach(k=>{keepT(k);k.parent=head.id;saveTask(k)});keepT(h);bak.del.push(h.id);deleteTask(h.id);nHead++});
      const kids=kidsOf(head.id),grp={};kids.forEach(k=>{(grp[dupKey64(k)]=grp[dupKey64(k)]||[]).push(k)});
      const map={};
      Object.values(grp).forEach(g=>{g.sort(better64);g.forEach(k=>map[k.id]=g[0].id);g.slice(1).forEach(k=>{keepT(k);bak.del.push(k.id);deleteTask(k.id);nStep++})});
      if(Object.values(grp).some(g=>g.length>1)||nHead){
        const out=[],used=new Set();
        (r.steps||[]).forEach(s=>{const id=map[s.tid]||s.tid;if(!id||used.has(id)||!TASKS[id])return;used.add(id);out.push({...s,tid:id})});
        kidsOf(head.id).filter(k=>!used.has(k.id)).forEach(k=>{used.add(k.id);out.push({id:uid(),tid:k.id,min:k.dur||5})});
        r.steps=out}});
    const hg={};Object.values(TASKS).filter(t=>t.status===0&&t.hab&&t.aid&&t.rep&&t.rep.f).forEach(t=>{(hg[t.aid]=hg[t.aid]||[]).push(t)});
    Object.values(hg).forEach(g=>{if(g.length<2)return;g.sort((a,b)=>((b.quest?1:0)-(a.quest?1:0))||better64(a,b));g.slice(1).forEach(t=>{keepT(t);bak.del.push(t.id);deleteTask(t.id);nHab++})});
  }catch(e){console.error(e)}
  C.mig64=1;
  if(nStep||nHead||nHab){C.bak64=bak;syncDailies(C);
    later(()=>toastAct(`v6.4 · 저절로 불어난 것을 정리했어요: 루틴 단계 ${nStep}개${nHead?` · 루틴 머리 ${nHead}개`:''}${nHab?` · 겹친 습관 반복 ${nHab}개`:''}`,'되돌리기',undo64),12000)}
  save('config')}
function undo64(){const b=C.bak64;if(!b)return;
  b.tasks.forEach(t=>saveTask(clone(t)));C.routines=clone(b.routines);delete C.bak64;C.mig64=1;save('config');syncDailies(C);if(curView()==='edit')reEdit();render();toast('정리 전으로 되돌렸어요')}
addEventListener('click',e=>{const b=e.target.closest('[data-x64undo]');if(!b)return;e.preventDefault();e.stopPropagation();if(b.dataset.x64undo==='keep'){delete C.bak64;save('config');reEdit();render();toast('정리한 그대로 둘게요');return}undo64()},true);
routinesEditHTML=(function(prev){return function(){const h=prev.apply(this,arguments);const b=C.bak64;if(!b||b.at<addDays(dateKey(),-14))return h;
  return `<div class="note64"><b>🧹 v6.4에서 겹친 단계를 정리했어요</b> <span class="tiny muted">(${esc(b.at)})</span><div class="tiny">새로고침할 때마다 단계가 불어나던 오류로 생긴 것들을 하나씩만 남겼어요. 원래 같은 단계를 일부러 두 번 넣었다면 되돌려요.</div><div class="row" style="gap:6px;margin-top:6px"><button class="btn sm ghost" data-x64undo="1">↺ 정리 전으로</button><button class="btn sm ghost" data-x64undo="keep">이대로 둘게요</button></div></div>`+h}})(routinesEditHTML);

/* ---- 2) 루틴: 타이머 없이 체크 ----
   루틴 머리 할 일의 ○를 누르면(목록·캘린더·홈·일퀘) 고르는 창: 한 단계에 체크 → 기록. 다 하면 완주 보너스. */
function rtDone64(r){
  if(!r)return;sync62(r);const head=rtH62(r,false),td=dateKey(),day=DAYS[td];
  const st=(r.steps||[]).filter(s=>TASKS[s.tid]),full=day&&(day.entries||[]).some(e=>e.kind==='routine'&&e.rid===r.id&&e.full);
  sheetCtx={rt64:r.id};
  const row=(s,i)=>{const t=TASKS[s.tid],dn=stDone62(t),w=s.aid==='@weigh',p=stPts62(s);
    return `<label class="d64r ${dn?'ok':''}"><input type="checkbox" data-d64="${s.tid}" ${dn?'checked disabled':'checked'}><span class="no">${dn?'✓':i+1}</span><span class="nm">${esc(stName61(s))}${dn?' <small class="muted">오늘 함</small>':''}</span>
      ${w&&!dn?`<input class="w64" type="number" step="0.1" min="30" max="250" inputmode="decimal" placeholder="kg" value="${day&&day.weight?day.weight:''}" aria-label="몸무게">`:''}<span class="tiny muted pt">${pts62(p,{zero:''})}</span></label>`};
  openSheet(`<div class="sh"><h3>✓ ${esc(r.name)}</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <p class="help" style="margin:0 0 8px">타이머 없이 한 걸 체크해요. 체크한 단계 점수가 들어가고, <b>모든 단계를 하면 완주 보너스</b> ${pts62({xp:r.xp,gold:r.gold},{zero:'0'})}도 받아요.${full?' <b>오늘은 이미 완주했어요</b>(보너스는 하루 한 번).':''}</p>
    <div class="row" style="gap:6px;margin-bottom:6px"><button type="button" class="chipbtn" data-d64all="1">모두 체크</button><button type="button" class="chipbtn" data-d64all="0">모두 해제</button><span style="flex:1"></span><span class="tiny muted">${st.filter(s=>stDone62(TASKS[s.tid])).length}/${st.length} 오늘 함</span></div>
    <div class="d64s">${st.map(row).join('')||'<div class="empty">단계가 없어요</div>'}</div>
    <div class="row" style="gap:6px;margin-top:10px;flex-wrap:wrap"><button class="btn go" data-d64go="${r.id}">✓ 체크한 것 기록</button><button class="btn ghost" data-rrun="${r.id}">⏱ 타이머로 하기</button><span style="flex:1"></span>${head?`<button class="btn ghost sm" data-x60task="${head.id}">✎ 루틴 열기</button>`:''}</div>`)}
function rtDoneGo64(r){
  if(!guard())return;const td=dateKey();const box=$('sheetC');let did=0,got={xp:0,gold:0};
  const sel=[...box.querySelectorAll('[data-d64]')].filter(c=>c.checked&&!c.disabled).map(c=>c.dataset.d64);
  ui.off=0;
  sel.forEach(tid=>{const s=(r.steps||[]).find(x=>x.tid===tid),t=TASKS[tid];if(!s||!t)return;
    if(s.aid==='@weigh'){const v=(box.querySelector(`[data-d64="${tid}"]`).closest('.d64r').querySelector('.w64')||{}).value;if(v&&!wSave63(v))return;t.last=td;t.cnt=(t.cnt||0)+1;saveTask(t);did++;return}
    if(t.status!==0)return;const p=taskBase(t);got.xp+=+p.xp||0;got.gold+=+p.gold||0;
    completeTask(t,{direct:true});if(t.status===2){t.status=0;delete t.doneAt}t.last=td;saveTask(t);did++});
  const st=(r.steps||[]).filter(s=>TASKS[s.tid]),all=st.length&&st.every(s=>stDone62(TASKS[s.tid]));
  const day=today(),full=(day.entries||[]).some(e=>e.kind==='routine'&&e.rid===r.id&&e.full);
  let bonus=0;
  if(all&&!full){let xp=+r.xp||0;if(recoveryActive())xp=Math.round(xp*C.recovery.mult);
    const e={kind:'routine',type:'good',name:r.name+' 완주',area:r.area||'life',cond:0,xp,gold:+r.gold||0,rid:r.id,full:1,note:'타이머 없이 체크'};
    if(gachaMatch('routine',r.id)){e.xp=Math.round(e.xp*(C.gacha.mult||1.5));e.gq=1}
    commit(()=>applyEntry(today(),e));try{afterGacha(e)}catch(x){}bonus=e.xp;
    const h=rtH62(r,false);if(h){if(h.rep&&h.rep.f){if(h.due&&h.due<=td){let nx=nextDue(h.rep,h.due);while(nx&&nx<=td)nx=nextDue(h.rep,nx);if(nx)h.due=nx}}else h.due=null;delete h.skull;h.last=td;h.cnt=(h.cnt||0)+1;saveTask(h)}}
  closeSheet();render();
  if(!did&&!bonus){toast('체크한 단계가 없어요');return}
  popup(all?'루틴 완주':'루틴 기록','✓',`<b>${esc(r.name)}</b> · ${did}단계 기록${got.xp?` · ✨${got.xp}`:''}${got.gold?` 💰${got.gold}`:''}<br>${bonus?`<b>완주 보너스 +${bonus} XP</b>`:all?'<span class="muted">오늘 완주 보너스는 이미 받았어요</span>':`<span class="muted">남은 ${st.filter(s=>!stDone62(TASKS[s.tid])).length}단계를 마저 하면 완주 보너스</span>`}`,all?'완주':'수고했어요')}
addEventListener('click',e=>{const b=e.target.closest('[data-d64all],[data-d64go],[data-rt64done]');if(!b)return;e.preventDefault();e.stopPropagation();
  if(b.dataset.d64all!=null){$('sheetC').querySelectorAll('[data-d64]:not(:disabled)').forEach(c=>c.checked=b.dataset.d64all==='1');return}
  const r=(C.routines||[]).find(x=>x.id===(b.dataset.d64go||b.dataset.rt64done));if(!r)return;
  if(b.dataset.d64go){rtDoneGo64(r);return}lastPt={x:e.clientX,y:e.clientY};rtDone64(r)},true);
// 루틴 머리의 ○ = 고르는 창 (끝낸 걸 되돌리는 건 그대로)
addEventListener('click',e=>{const b=e.target.closest('[data-tdone]');if(!b)return;const t=TASKS[b.dataset.tdone];if(!t||t.status!==0||!C.mig62)return;const r=rtOfT62(t);if(!r)return;
  e.preventDefault();e.stopImmediatePropagation();lastPt={x:e.clientX,y:e.clientY};rtDone64(r)},true);
// 일퀘의 루틴도 같은 창
toggleQuest=(function(prev){return function(q){try{if(q&&q.action&&q.action.startsWith('@t:')){const t=TASKS[q.action.slice(3)],r=t&&rtOfT62(t),day=curDay();
  if(r&&!(day.entries||[]).some(x=>x.kind==='routine'&&x.rid===r.id)){if(!guard())return;closeInfo&&closeInfo();rtDone64(r);return}}}catch(e){console.error(e)}return prev.apply(this,arguments)}})(toggleQuest);
// 메뉴·루틴 칸에도 '타이머 없이'
rtCard62=(function(prev){return function(r){let h=prev.apply(this,arguments);try{h=h.replace(`<button class="btn sm" data-rrun="${r.id}">⏱ 시작</button>`,`<button class="btn sm ghost" data-rt64done="${r.id}" title="타이머 없이 한 단계를 체크해서 기록">✓ 체크로 기록</button><button class="btn sm" data-rrun="${r.id}">⏱ 시작</button>`)}catch(e){}return h}})(rtCard62);
rtCard61=rtCard62;
menu61=(function(prev){return function(x,y,title,items){try{if(Array.isArray(items)){const i=items.findIndex(it=>it&&it.l==='⏱ 루틴 시작');if(i>=0){const f=items[i].f;const t=Object.values(TASKS).find(z=>z.status===0&&z.rid&&title&&title.includes(z.title));const r=t&&rtOfT62(t);if(r)items.splice(i,0,{l:'✓ 체크로 기록 (타이머 없이)',f:()=>rtDone64(r)})}}}catch(e){}return prev.apply(this,arguments)}})(menu61);

/* ---- 3) 할 일 상세: 루틴이면 그 자리에서 다 고쳐요 (언제·순서·분·카드·보너스) ---- */
rtPanel62=function(h,r){sync62(r);const S=rtSum62(r),st=(r.steps||[]).filter(s=>TASKS[s.tid]),dn=st.filter(s=>stDone62(TASKS[s.tid])).length;
  return `<div class="rt62p rt64p"><div class="spread" style="margin-bottom:6px"><b>⏱ 루틴 · ${st.length}단계 · ${S.min}분</b><span class="tiny muted">${dn?`오늘 ${dn}/${st.length} 함`:'여기서 바로 고쳐요'}</span></div>${rtCard62(r,true).replace(` id="rt60-${r.id}"`,'')}</div>`};

/* ---- 4) ⏱ 루틴 스마트 목록 (모든 루틴 머리를 한곳에) ---- */
if(!SMART.some(x=>x[0]==='routine')){const i=SMART.findIndex(x=>x[0]==='nodate');SMART.splice(i<0?SMART.length:i,0,['routine','⏱ 루틴'])}
taskMatches=(function(prev){return function(t,sel){if(sel==='routine')return t.status===0&&!!t.rid&&!!rtOfT62(t);return prev.apply(this,arguments)}})(taskMatches);

// ⏱ 루틴 목록에서 위 입력칸에 적으면 = 새 루틴
addTaskFrom=(function(prev){return function(raw,o){try{const ae=document.activeElement;
  if(C.mig62&&tOK64()&&curView()==='tasks'&&(C.ui.tasks||{}).sel==='routine'&&ae&&ae.id==='tAdd'){const p=parseQuick(raw);if(!p.title){toast('루틴 이름을 적어주세요');return null}
    const r=rtNew61(p.title);sync62(r);const h=rtH62(r,true);render();if(h){C.ui.tfold=C.ui.tfold||{};C.ui.tfold[h.id]='o';save('config');setTimeout(()=>openTaskSheet(h.id),60)}
    toast(`⏱ '${p.title}' 루틴을 만들었어요 · 단계를 적어요`);return h}}catch(e){console.error(e)}return prev.apply(this,arguments)}})(addTaskFrom);

/* ---- 5) 캘린더 ----
   PC도 캘린더 화면에선 위의 캐릭터 칸·베타 띠를 숨겨 넓게(css). 날짜를 누르면 그 주 아래에 카드처럼 그날 목록 (틱틱처럼). */
function dItems64(k){
  const ts=tasksOn(k).sort((a,b)=>(a.time||'99').localeCompare(b.time||'99')||(b.prio||0)-(a.prio||0)),dn=doneOn(k);
  const lc=t=>{const l=C.lists.find(z=>z.id===(t.list||'inbox'));return l&&l.color};
  const row=t=>{const r=rtOfT62(t),n=r?(r.steps||[]).filter(s=>TASKS[s.tid]).length:0,c=lc(t);
    return `<div class="d64 p${t.prio||0}" data-ctask="${t.id}" ${c?`style="--lc:${c}"`:''}><button type="button" class="ck" data-tdone="${t.id}" aria-label="'${esc(t.title)}' ${r?'체크로 기록':'끝내기'}"></button>
      <span class="tt">${r?'⏱ ':''}${esc(t.title)}${r?` <small>${n}단계</small>`:''}${t.quest?' <small title="일퀘">☑</small>':''}${t.rep?' <small title="반복">↻</small>':''}${t.brave?' <small title="용기">⚔️</small>':''}</span>
      <span class="tm">${t.time?esc(t.time):''}</span></div>`};
  return {n:ts.length,dn:dn.length,html:ts.map(row).join('')+dn.map(e=>`<div class="d64 done"><span class="ck">✓</span><span class="tt">${esc(e.name)}</span><span class="tm">${esc(e.t||'')}</span></div>`).join('')}}
dp63=function(){
  const g=$('calMain')&&$('calMain').querySelector('.mgrid'),cd=$('calDay');if(!g||!cd)return;
  g.querySelectorAll('.dp63').forEach(x=>x.remove());
  if(!document.body.classList.contains('calfill63')){cd.hidden=false;return}
  cd.hidden=true;if(!ui.cal63)return;
  const mcs=[...g.querySelectorAll('.mc')],i=mcs.findIndex(m=>m.dataset.calday===ui.calSel);if(i<0)return;
  cd.innerHTML='';// 같은 입력칸 id가 두 개가 되지 않게
  const k=ui.calSel;mcs[i].classList.add('open63');const w=Math.floor(i/7),after=mcs[Math.min(mcs.length-1,w*7+6)];
  const it=dItems64(k);
  const box=document.createElement('div');box.className='dp63 dp64';box.dataset.w=w;box.style.gridColumn='1/-1';box.style.setProperty('--col',i%7);
  box.innerHTML=`<div class="dp64c" data-drop="day:${k}"><div class="dp64h"><b>${+k.slice(5,7)}월 ${+k.slice(8)}일 ${wdOf(k)}</b><span class="tiny muted">${esc(dueLabel(k))}${it.n?` · ${it.n}개`:''}${it.dn?` · ${it.dn}개 끝`:''}</span><span style="flex:1"></span>
      <button class="ib add83" type="button" data-add83="${k}" title="이 날에 할 일 추가 (팝업)">＋ 추가</button><button class="ib" type="button" data-x58day="${k}" title="하루 보기">하루 보기 ›</button><button class="ib x64" type="button" data-dp63x="1" aria-label="닫기" title="닫기">×</button></div>
    <div class="dp64l">${it.html||'<div class="d64e">비어 있어요 · 아래에 적어서 추가해요</div>'}</div>
    <form class="tadd d64add" data-taddform="cal"><div class="in"><input id="calAdd" maxlength="160" placeholder="＋ 이 날에 추가 (3시 30분 #번개…)" enterkeyhint="done" autocomplete="off"></div><div class="parse" id="calParse"></div></form></div>`;
  after.after(box)};
cal62fit=function(){
  const g=$('calMain')&&$('calMain').querySelector('.mgrid');if(!g)return;
  if(!document.body.classList.contains('calfill63')){g.style.height='';g.style.gridTemplateRows='';return}
  const mcs=[...g.querySelectorAll('.mc')],rows=Math.ceil(mcs.length/7)||5,phone=innerWidth<760;
  const nav=document.querySelector('.bnav'),nh=nav&&getComputedStyle(nav).display!=='none'?nav.getBoundingClientRect().height:0;
  const H=Math.max(phone?360:420,Math.floor(innerHeight-g.getBoundingClientRect().top-nh-(phone?4:10)));
  const dp=g.querySelector('.dp64'),dw=dp?+dp.dataset.w:-1,tr=['auto'];
  let ph=0;if(dp){const q=x=>dp.querySelector(x),need=(q('.dp64h')||{}).offsetHeight+(q('.dp64l')||{}).scrollHeight+(q('.d64add')||{}).offsetHeight+16;ph=Math.min(Math.round(H*(phone?.55:.55)),Math.max(150,need))}
  for(let w=0;w<rows;w++){tr.push(dw<0?'minmax(0,1fr)':w===dw?'minmax(0,1.25fr)':'minmax(0,.6fr)');if(w===dw)tr.push(ph+'px')}
  g.style.height=H+'px';g.style.gridTemplateRows=tr.join(' ');
  mcs.forEach(mc=>{const cap=mc.clientHeight,chips=[...mc.querySelectorAll('.cchip')],mr=mc.querySelector('.more');if(mc.dataset.b62==null)mc.dataset.b62=mr?(parseInt(mr.textContent.replace(/\D/g,''))||0):0;let base=+mc.dataset.b62,hid=0;
    chips.forEach(c=>{c.hidden=false});chips.forEach(c=>{if(c.offsetTop+c.offsetHeight>cap-12){c.hidden=true;hid++}});
    if(hid||base){let m=mr;if(!m){m=document.createElement('span');m.className='more';mc.appendChild(m)}m.textContent='+'+(hid+base);m.title='눌러서 이 날 전체 보기'}else if(mr)mr.remove()});
  if(dp)requestAnimationFrame(()=>{const r=dp.getBoundingClientRect();if(r.bottom>innerHeight-nh)dp.scrollIntoView({block:'nearest',behavior:'smooth'})})};

/* ---- 6) 보스·쫄따구 모양 (슬라임만 아니게) ---- */
function sh64(hex,f){const m=/^#?([0-9a-f]{6})$/i.exec(hex||'');if(!m)return hex;const n=parseInt(m[1],16);let r=n>>16,g=n>>8&255,b=n&255;const t=f<0?0:255,p=Math.abs(f);r=Math.round(r+(t-r)*p);g=Math.round(g+(t-g)*p);b=Math.round(b+(t-b)*p);return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}
function px64(rows,color,W,H,ox,oy){const pal={K:'#1d2130',C:color,D:sh64(color,-.32),L:sh64(color,.38),W:'#fff',R:'#d23c3c',Y:'#f2c94c',G:'#4caf50',B:'#8a5a2b'};let s='';
  rows.forEach((r,y)=>{for(let x=0;x<r.length;x++){const ch=r[x];if(ch==='.'||!pal[ch])continue;s+=`<rect x="${x+ox}" y="${y+oy}" width="1.02" height="1.02" fill="${pal[ch]}"/>`}});return s}
var BOSS64={
  monster:['.K............K.','.KK..........KK.','..KKKKKKKKKKKK..','.KCLLCCCCCCCCCK.','KCCWWWCCCCWWWCCK','KCCWKWCCCCWKWCCK','KCCCCCCCCCCCCCCK','KCKKKKKKKKKKKKCK','KCKWRWRWRWRWRKCK','KCKRRRRRRRRRRKCK','KCCKKKKKKKKKKCCK','.KCCCCCCCCCCCCK.','.KCCK.KCCK.KCCK.','.KKKK.KKKK.KKKK.'],
  ghost:['....KKKKKKKK....','..KKLLCCCCCCKK..','.KLLCCCCCCCCCCK.','.KCCCCCCCCCCCCK.','KCCCKKCCCCKKCCCK','KCCCWKCCCCWKCCCK','KCCCCCCCCCCCCCCK','KCCCCCCKKCCCCCCK','KCCCCCKCCKCCCCCK','KCCCCCCKKCCCCCCK','KCCCCCCCCCCCCCCK','KCCKCCCKKCCCKCCK','KCK.KCK..KCK.KCK','KK...K....K...KK'],
  golem:['....KKKKKKKK....','....KDCCCCDK....','....KCRKKRCK....','....KCCCCCCK....','....KDKKKKDK....','.KKKKKKKKKKKKKK.','KCCKDCCCCCCDKCCK','KCCKCCCDDCCCKCCK','KCCKCCDCCDCCKCCK','KDDKCCCCCCCCKDDK','KKKKKCCCCCCKKKKK','...KCCCKKCCCK...','...KCCK..KCCK...','...KKKK..KKKK...'],
  bat:['K..............K','KK....K..K....KK','KCK...KKKK...KCK','KCCK.KCCCCK.KCCK','KCCCKCRCCRCKCCCK','KCCCCCCCCCCCCCCK','KCDCCCCKKCCCCDCK','.KDK.KCWWCK.KDK.','..K..KCCCCK..K..','......KCCK......','.......KK.......'],
  swamp:['......K..K......','.....KGKKGK.....','......KGGK......','...KKKKKKKKKK...','.KKCCCCCCCCCCKK.','KCCCCCCCCCCCCCCK','KCCKKKKCCKKKKCCK','KCCWWKWCCWKWWCCK','KCCCCCCCCCCCCCCK','KCDCCCCKKKCCCDCK','KCCCCCCCCCCCCCCK','KDCCDCCCCDCCDCCK','.KDK.KDDK.KDK.K.','..K...KK...K....'],
  spiky:['..K....KK....K..','.KCK..KCCK..KCK.','.KCCKKCCCCKKCCK.','KCCWWCCCCCCWWCCK','KCCWKCCWWCCWKCCK','KCCCCCCWKCCCCCCK','KCCCCCCCCCCCCCCK','.KCCCKKKKKKCCCK.','KCCCKCKCKCKCCCCK','.KCCCCCCCCCCCCK.','..KKCCK..KCCKK..','....KK....KK....'],
  slime:['....KKKKKKKK....','..KKCCCCCCCCKK..','.KCCCCCCCCCCCCK.','KCCWWKCCCCWWKCCK','KCCWKKCCCCWKKCCK','KCCCCCCCCCCCCCCK','KCCCKWKWKWKCCCCK','KCCCCKKKKKKCCCCK','.KCCCCCCCCCCCCK.','..KCCK.KK.KCCK..','...KK......KK...']};
function bossKind64(n){n=n||'';if(/골렘|거인|돌/.test(n))return 'golem';if(/박쥐/.test(n))return 'bat';if(/늪|무기력/.test(n))return 'swamp';if(/불안/.test(n))return 'spiky';if(/안개|망설임|유령/.test(n))return 'ghost';if(/괴물|미루기/.test(n))return 'monster';if(/슬라임/.test(n))return 'slime';
  const ks=['monster','ghost','golem','bat','swamp','spiky'];let h=0;for(const c of n)h=(h*31+c.charCodeAt(0))>>>0;return n?ks[h%ks.length]:'slime'}
bossSVG=function(color,dead,name){const g=BOSS64[bossKind64(name)]||BOSS64.slime,h=g.length;let s=px64(g,color,16,h,4,Math.floor((24-h)/2)+1);
  if(dead)s+=`<path d="M6 9 L18 21 M18 9 L6 21" stroke="#d23c3c" stroke-width="1.4"/>`;
  return `<svg viewBox="0 0 24 24" shape-rendering="crispEdges" aria-hidden="true"><g class="${dead?'':'boss-sp'}">${s}</g></svg>`};
var MOB64={
  task:['K..........K','KK.KKKKKK.KK','.KKCCCCCCKK.','.KCCCCCCCCK.','KCCWKCCWKCCK','KCCCCCCCCCCK','KCCCKKKKCCCK','.KCCCCCCCCK.','..KCK..KCK..','..KK....KK..'],
  rep:['......KKKK..','.....KLCCCK.','K...KCKKKCCK','KK..KCKCKCCK','KWK.KCKKCCCK','KCCKKCCCCCK.','KCCCCKKKKKKK','KDDDDDDDDDDK','.KKKKKKKKKK.'],
  skull:['..KKKKKKKK..','.KWWWWWWWWK.','KWWWWWWWWWWK','KWKKWWWWKKWK','KWKKWWWWKKWK','KWWWWKKWWWWK','.KWWWWWWWWK.','..KWKWKWKK..','..KKKKKKKK..'],
  late:['...KKKKKK...','..KCCCCCCK..','.KCCCCCCCCK.','.KCWKCCWKCK.','KCCWWCCWWCCK','KCCCCKKCCCCK','KCCCCCCCCCCK','KCKCCKKCCKCK','KK.KK..KK.KK'],
  brave:['K.K.K.K.K...','.KKKKKKKKK..','KCDCDCDCDCK.','KDCDCDCDCCCK','KCDCDCDCWKCK','KDCDCDCCCCCK','KCDCDCCCCKKK','.KCCCCCCCK..','..KK...KK...'],
  pack:['KKKKKKKKKKKK','KYBBBBBBBBYK','KBBBBBBBBBBK','KKKKKKKKKKKK','KWKWKWKWKWKK','KRRRRRRRRRRK','KKWKWKWKWKWK','KBBBBYYBBBBK','KBBBBYYBBBBK','KKKKKKKKKKKK'],
  rt:['.........K.K','........KKKK','.KK.KK.KCCCK','KCCKCCKCCWKK','KCCKCCKCCCCK','KCCKCCKCCKKK','.KK.KK.KK...','..K..K..K...']};
minionSVG=function(color,dead,kind){const g=MOB64[kind]||MOB64.task,h=g.length;let s=px64(g,color,12,h,2,14-h);
  if(dead)s+=`<path d="M3 3 L13 13 M13 3 L3 13" stroke="#d23c3c" stroke-width="1.2"/>`;
  return `<svg viewBox="0 0 16 14" shape-rendering="crispEdges" aria-hidden="true"><g class="${dead?'':'boss-sp'}">${s}</g></svg>`};
var MOBK64={task:'task',rep:'rep',hab:'rep',skull:'skull',late:'late',brave:'brave',pack:'pack',rt:'rt'};
function mobOf64(t){try{const k=mobKind61(t);return MOBK64[k]||'task'}catch(e){return 'task'}}

/* ---- 7) 메뉴 아이콘: 뽑기 = 캡슐 뽑기 기계 · 행동/습관 = 체크한 카드 · 돌아보기 = 막대 그래프 ---- */
ICONS.gacha='<circle cx="12" cy="9" r="6"/><path d="M6.5 13.5h11l-1 7.5h-9z"/><path d="M10.5 17.5h3"/><circle cx="10" cy="8" r="1.4"/><circle cx="14" cy="10.2" r="1.4"/>';
ICONS.log='<rect x="7" y="3" width="13" height="17" rx="2"/><path d="M4 7v12a2 2 0 0 0 2 2h9"/><path d="M10.5 11.5l2 2 4-4"/>';
ICONS.review='<path d="M4 20h16"/><rect x="5" y="12" width="3" height="6" rx=".5"/><rect x="10.5" y="6" width="3" height="12" rx=".5"/><rect x="16" y="9" width="3" height="9" rx=".5"/>';

/* ---- 8) 홈: '지금 하면 좋은 것'에서 오늘 목록에 이미 있는 일퀘는 빼요 ---- */
suggestions=(function(prev){return function(){const out=prev.apply(this,arguments);try{const td=dateKey();
  return out.filter(s=>{if(!/^일퀘/.test(s.why||'')||!s.act)return true;const a=C.actions.find(x=>x.id===s.act),t=a&&habT(a);return !(t&&t.due&&t.due<=td)})}catch(e){console.error(e);return out}}})(suggestions);

/* ---- 9) 일퀘 창에서 바로 요일 표 고치기 (편집 화면에 안 가도 돼요) ---- */
qSheet63=(function(prev){return function(){prev.apply(this,arguments);try{
  const sc=$('sheetC'),b=sc&&sc.querySelector('[data-goedit="dailies"]');if(!b)return;
  b.removeAttribute('data-goedit');b.dataset.q64ed='1';b.textContent=ui.q64ed?'▴ 요일 표 접기':'✎ 요일 표 (여기서 고치기)';
  if(ui.q64ed){const d=document.createElement('div');d.className='q64ed';d.innerHTML=dailiesEditHTML();b.closest('.row').before(d)}
}catch(e){console.error(e)}}})(qSheet63);
addEventListener('click',e=>{const b=e.target.closest('[data-q64ed]');if(!b)return;e.preventDefault();e.stopPropagation();ui.q64ed=!ui.q64ed;qSheet63()},true);
reEdit=(function(prev){return function(){const x=prev.apply(this,arguments);try{if(curView()!=='edit'&&sheetCtx&&sheetCtx.q63&&!$('sheet').hidden)qSheet63()}catch(e){}return x}})(reEdit);

/* ---- 10) 렌더 앞뒤 ---- */
render=(function(prev){return function(){
  try{fix64()}catch(e){console.error(e)}
  const x=prev.apply(this,arguments);
  try{cal62tog();const ta=$('tAdd');if(ta){const rt=curView()==='tasks'&&(C.ui.tasks||{}).sel==='routine';if(rt&&!ta.dataset.ph64){ta.dataset.ph64=ta.placeholder;ta.placeholder='⏱ 새 루틴 이름 (예: 출근 준비) · Enter로 만들기'}else if(!rt&&ta.dataset.ph64){ta.placeholder=ta.dataset.ph64;delete ta.dataset.ph64}}}catch(e){}
  return x}})(render);
