/* ================= v7.3: A′ 묶음 — v7.2 확인 결과 다시 고치기 (루틴 일부·몸무게 칸·겹친 기록·여기까지 기록·늦게 잠·한글 찾기) ================= */

/* ---- 1) 루틴: 단계 몇 개만 해도 루틴은 '오늘 함' (A′1) ----
   예전: 모든 단계를 해야(완주) 루틴 머리 할 일이 다음 날로 넘어가서, 8단계 중 4개를 하면 루틴과 남은 4단계가 목록에 그대로 남았어요.
   이제: 오늘 한 단계가 있으면 반복 루틴은 다음 회차로 넘어가요(h.pd73 = {d:그날, from:원래 날짜}). 남은 단계는 '안 한 것'.
   - 목록·홈에서 하나씩 체크할 땐 이어서 할 수 있게 마지막 체크(h.pt73) 뒤 20분 동안 그대로 두고, 스낵바 '🏁 여기까지'로 바로 넘길 수도.
   - 루틴 체크 창(✓ 체크한 것 기록)·몸무게 칸은 바로. 어제 일부만 하고 앱을 닫았어도 다음에 열면 넘어가요(☠·지난 것 아님).
   - 완주 보너스는 그대로 '다 했을 때만'. 오늘 한 단계를 다 되돌리면 루틴도 다시 오늘로. */
var RP73=new Set(),NOW73=new Set(),PT73=0,GR73=20*60e3;
function rtDoneN73(r,D,noW){const isD=stIsDone71(r,D);return (r.steps||[]).filter(s=>TASKS[s.tid]&&!(noW&&s.aid==='@weigh')).filter(isD).length}
// 넘길지 정할 땐 몸무게 단계는 빼고 셈: 몸무게는 기록하기 어디서 적어도 단계가 체크되니까(v6.3 wSync63), 몸무게만 적었다고 아침 루틴이 넘어가면 안 돼요.
// 루틴 체크 창에서 몸무게만 골라 기록한 때(NOW73)는 셈.
function rtGo73(r,D){return rtDoneN73(r,D,!NOW73.has(r.id))}
function rtPart73(){if(!ready72()||typeof tasksReady==='undefined'||!tasksReady)return;const D=dateKey();
  (C.routines||[]).forEach(r=>{try{if(RUN&&RUN.kind==='routine'&&RUN.id===r.id)return;const h=rtH62(r,false);if(!h||h.status!==0)return;
    if(h.pd73&&h.pd73.d===D){if(!rtDoneN73(r,D,true)&&h.pd73.from&&h.due!==h.pd73.from){h.due=h.pd73.from;delete h.pd73;saveTask(h)}return}
    if(!h.due||h.due>D||!(h.rep&&h.rep.f))return;
    let kk=null;for(let k=D,i=0;k>=h.due&&i<8;k=addDays(k,-1),i++)if(rtGo73(r,k)){kk=k;break}if(!kk)return;
    if(kk===D){if(rtNeed71(r,stIsDone71(r,D)).ok)return;   // 다 했으면 완주(보너스)가 처리해요
      const left=(+h.pt73||0)+GR73-Date.now();if(left>0&&!NOW73.has(r.id)){clearTimeout(PT73);PT73=setTimeout(()=>{try{render()}catch(e){}},Math.min(left+800,GR73+800));return}}
    NOW73.delete(r.id);let nx=nextDue(h.rep,h.due);while(nx&&nx<=kk)nx=nextDue(h.rep,nx);if(!nx)return;
    const n=rtDoneN73(r,kk),all=(r.steps||[]).filter(s=>TASKS[s.tid]).length;
    h.pd73={d:kk,from:h.due};h.due=nx;if(kk>=(h.last||''))h.last=kk;delete h.skull;delete h.pt73;saveTask(h);
    if(RP73.has(r.id)){RP73.delete(r.id);const rid=r.id;setTimeout(()=>toastAct(`✓ '${r.name}' 오늘 한 걸로 쳤어요 (${n}/${all}단계)`,'남은 단계',()=>{const rr=(C.routines||[]).find(x=>x.id===rid);if(rr)rtDone64(rr)},6500),350)}
  }catch(e){console.error(e)}})}
function stHead73(t){const h=t&&t.parent&&TASKS[t.parent];return h&&h.rid&&isStep62(t)?h:null}
completeTask=(function(prev){return function(t){const h=stHead73(t),p0=h&&h.pt73;if(h)h.pt73=Date.now();   // 먼저 찍어야 completeTask 안의 render가 바로 넘기지 않아요
  const r=prev.apply(this,arguments);try{if(h){if(stDone62(t)||(DAYS[dateKey()]&&(DAYS[dateKey()].entries||[]).some(e=>e.tid===t.id))){RP73.add(h.rid);saveTask(h)}else{if(p0)h.pt73=p0;else delete h.pt73}}}catch(e){}return r}})(completeTask);
rtDoneGo64=(function(prev){return function(r){try{if(r){RP73.add(r.id);NOW73.add(r.id)}}catch(e){}return prev.apply(this,arguments)}})(rtDoneGo64);
render=(function(prev){return function(){try{rtPart73()}catch(e){console.error(e)}return prev.apply(this,arguments)}})(render);
// 단계 체크 뒤 스낵바에 '🏁 여기까지' (누르면 바로 오늘 한 걸로)
snack=(function(prev){return function(e){const x=prev.apply(this,arguments);try{const t=e&&e.tid&&TASKS[e.tid],h=stHead73(t),r=h&&rtOfT62(h),s=$('snack');
  if(r&&s&&!s.querySelector('[data-snack73]')&&h.due&&h.due<=dateKey()&&!rtNeed71(r,stIsDone71(r,dateKey())).ok){const n=rtDoneN73(r,dateKey()),all=(r.steps||[]).filter(z=>TASKS[z.tid]).length;
    const b=document.createElement('button');b.dataset.snack73=r.id;b.textContent=`🏁 여기까지 (${n}/${all})`;b.title='루틴을 오늘 한 걸로 (남은 단계는 안 함) · 안 누르면 20분 뒤 저절로';
    const u=s.querySelector('[data-snack="undo"]');if(u)u.before(b);else s.appendChild(b)}}catch(z){console.error(z)}return x}})(snack);
addEventListener('click',e=>{const b=e.target.closest('#snack [data-snack73]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();$('snack').hidden=true;NOW73.add(b.dataset.snack73);RP73.add(b.dataset.snack73);render()},true);

/* ---- 2) 몸무게 단계: 단계가 보이는 곳마다 바로 적는 칸 (A′2) ----
   '⚖ 몸무게 칸에 적어요'는 루틴 편집 줄의 안내였는데 그 줄엔 칸이 없었어요. 이제 루틴 편집·할 일 상세의 루틴 단계 줄에 kg 칸,
   목록에서 몸무게 단계(또는 '몸무게 재기' 일퀘)를 체크하면 기록하기 화면으로 넘어가지 않고 그 자리에서 작은 창. */
function wStep73(t){if(!t)return false;const h=t.parent&&TASKS[t.parent],r=h&&rtOfT62(h);if(r&&(r.steps||[]).some(s=>s.tid===t.id&&s.aid==='@weigh'))return true;
  const a=t.aid&&C.actions.find(x=>x.id===t.aid);return !!(a&&a.link==='@weigh')}
function wGo73(v,tid){if(!wSave63(v))return false;const t=tid&&TASKS[tid];
  if(t&&isStep62(t)){const D=dateKey();if(D>=(t.last||''))t.last=D;t.cnt=(t.cnt||0)+1;saveTask(t);const h=TASKS[t.parent];if(h&&h.rid){RT71.add(h.rid);RP73.add(h.rid);h.pt73=Date.now();saveTask(h)}}
  return true}
function wIn73(tid){const w=today().weight;
  return w?`<span class="w73 ok">⚖ 오늘 <b>${w}kg</b></span>`:`<span class="w73"><input type="number" step="0.1" min="30" max="250" inputmode="decimal" placeholder="kg" data-w73="${tid||''}" aria-label="몸무게"><button type="button" class="chipbtn" data-w73go="1">기록</button></span>`}
stRow62=(function(prev){return function(r,s,i,o){let h=prev.apply(this,arguments);try{if(s&&s.aid==='@weigh'){
  if(h.includes('⚖ 몸무게 칸에 적어요'))h=h.replace('<span class="tiny muted">⚖ 몸무게 칸에 적어요</span>',wIn73(s.tid));
  else h=h.replace('<span class="pt62"',wIn73(s.tid)+'<span class="pt62"')}}catch(e){console.error(e)}return h}})(stRow62);
function wFrom73(el){const box=el.closest('.w73');const i=box&&box.querySelector('[data-w73]');if(!i)return;const v=i.value;if(!v){i.focus();return}
  if(wGo73(v,i.dataset.w73)){toast(`⚖ ${(+v).toFixed(1)}kg 기록했어요`);try{if(sheetCtx&&sheetCtx.task&&$('tsTitle'))tsRedraw()}catch(e){}try{if(curView()==='edit')reEdit()}catch(e){}try{rt62redraw()}catch(e){}render()}}
addEventListener('click',e=>{const b=e.target.closest('[data-w73go]');if(!b)return;e.preventDefault();e.stopPropagation();wFrom73(b)},true);
addEventListener('keydown',e=>{const i=e.target&&e.target.closest&&e.target.closest('[data-w73],#w73in');if(!i||e.key!=='Enter'||e.isComposing)return;e.preventDefault();e.stopPropagation();if(i.id==='w73in')wSheetGo73();else wFrom73(i)},true);
addEventListener('change',e=>{if(e.target&&e.target.closest&&e.target.closest('[data-w73],#w73in'))e.stopPropagation()},true);
var WS73=null;
function wSheet73(tid){WS73=tid||null;sheetCtx={w73:1};const w=today().weight;
  openSheet(`<div class="sh"><h3>⚖ 몸무게</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <div class="row" style="gap:8px;align-items:center"><input id="w73in" type="number" step="0.1" min="30" max="250" inputmode="decimal" placeholder="kg" value="${w||''}" style="max-width:140px;font-size:20px" aria-label="몸무게 kg"><span>kg</span><button type="button" class="btn go" data-w73s="1">기록</button></div>
    <p class="tiny muted" style="margin:8px 0 0">적으면 ☑ 일퀘·루틴 몸무게 단계가 같이 체크돼요${w?' · 오늘 이미 적었어요(고치면 바뀌어요)':''}.</p>`);
  setTimeout(()=>{const i=$('w73in');if(i){i.focus();i.select&&i.select()}},60)}
function wSheetGo73(){const i=$('w73in');if(!i||!i.value){i&&i.focus();return}const v=i.value;if(wGo73(v,WS73)){closeSheet();render();toast(`⚖ ${(+v).toFixed(1)}kg 기록했어요`)}}
addEventListener('click',e=>{const b=e.target.closest('[data-w73s]');if(!b)return;e.preventDefault();e.stopPropagation();wSheetGo73()},true);
// 목록 체크: 루틴 몸무게 단계는 v6.3 창(wAsk63)이 이미 띄워요 → 여기선 '몸무게 재기' 일퀘처럼 몸무게 카드에 이은 할 일만 (예전엔 기록하기 화면으로 넘어갔음)
addEventListener('click',e=>{const b=e.target.closest('[data-tdone]');if(!b)return;const t=TASKS[b.dataset.tdone];if(!t||t.status!==0||isStep62(t)||!wStep73(t))return;
  const row=b.closest('.trow');if(row&&row.classList.contains('done'))return;
  e.preventDefault();e.stopImmediatePropagation();wSheet73(t.id)},true);
toggleQuest=(function(prev){return function(q){if(q&&q.action==='@weigh'&&!questDone(curDay(),q)){wSheet73(null);return}return prev.apply(this,arguments)}})(toggleQuest);

/* ---- 3) 겹친 기록 하나 지우기 = 할 일은 '한 번 한' 상태로 (A′3) ----
   예전: 먼저 들어간 기록을 지워서 그 기록 전 상태(안 한 상태)로 되돌림 → 할 일이 다시 생겼어요.
   이제: 나중 기록을 지우고, 두 기록이 같은 상태에서 들어간 것(다른 기기·옛 화면)이면 할 일은 건드리지 않아요.
   나중 기록이 먼저 기록 뒤 상태에서 들어간 것이면 그 '먼저 기록 뒤' 상태로 돌아가요 = 한 번 한 상태. */
var DUP73=null;
undoTaskFrom=(function(prev){return function(e){if(DUP73&&DUP73.skip)return;return prev.apply(this,arguments)}})(undoTaskFrom);
unapplyEntry=(function(prev){return function(day,e){if(DUP73&&DUP73.skipH&&e&&e.htid62){const c={...e};delete c.htid62;if(DUP73.skip)delete c.tid;return prev.call(this,day,c)}
  if(DUP73&&DUP73.skip&&e&&e.tid){const c={...e};delete c.tid;return prev.call(this,day,c)}return prev.apply(this,arguments)}})(unapplyEntry);
function dupDel73(k,xid,yid){const d=DAYS[k],es=(d&&d.entries)||[],x=es.find(v=>v.id===xid),y=es.find(v=>v.id===yid);if(!x||!y)return;
  const ix=es.indexOf(x),iy=es.indexOf(y),a=ix<iy?x:y,b=ix<iy?y:x;   // a = 먼저, b = 나중 → b를 지워요
  const same=(u,v,ks)=>ks.every(q=>(u[q]==null?null:JSON.stringify(u[q]))===(v[q]==null?null:JSON.stringify(v[q])));
  DUP73={skip:!!(b.tid&&(!a.tid||same(a,b,['prevDue','prevStatus','prevCnt']))),skipH:!!(b.htid62&&(!a.htid62||same(a,b,['hprev62','hcnt62'])))};
  const tid=b.tid||b.htid62,t=tid&&TASKS[tid],keepLast=t&&t.last;
  try{removeEntry(k,b.id)}finally{DUP73=null}
  try{if(t&&isStep62(t)&&keepLast&&t.last!==keepLast){t.last=keepLast;saveTask(t)}}catch(e){}
  render();toast('겹친 기록 하나를 지웠어요 · 할 일은 한 번 한 그대로')}
dupSheet72=(function(prev){return function(){const r=prev.apply(this,arguments);try{
  const sc=$('sheetC');if(!sc)return r;const ds=dups72(60);sc.querySelectorAll('[data-dp72x]').forEach((b,i)=>{const d=ds[i];if(!d)return;b.removeAttribute('data-dp72x');b.dataset.dp73=`${d.k}|${d.x.id}|${d.y.id}`});
  const ro=reopen73();if(ro.length&&!sc.querySelector('.ro73'))sc.querySelector('.sh').insertAdjacentHTML('afterend',`<div class="ro73"><b class="small">↩ 지울 때 다시 열린 할 일</b><p class="tiny muted" style="margin:2px 0 6px">끝낸 기록은 남아 있는데 할 일이 다시 열려 있어요(v7.2에서 겹친 기록을 지울 때 생긴 문제).</p>${ro.map(o=>`<div class="dp72"><div><b>${esc(o.t.title)}</b><div class="tiny muted">${esc(fmtD(o.k))}에 끝냄 · 지금 ${o.t.due?esc(dueLabel(o.t.due)):'날짜 없음'}</div></div><button type="button" class="chipbtn" data-ro73="${o.t.id}|${o.k}">끝낸 상태로</button></div>`).join('')}</div>`);
  }catch(e){console.error(e)}return r}})(dupSheet72);
addEventListener('click',e=>{const b=e.target.closest('[data-dp73]');if(!b)return;e.preventDefault();e.stopPropagation();const [k,x,y]=b.dataset.dp73.split('|');dupDel73(k,x,y);dupSheet72()},true);
// v7.2 때 다시 열린 것 찾기: 끝낸 기록(할 일·카드 습관)이 있는데 그날 이전 날짜로 열려 있는 할 일 (최근 14일)
function reopen73(){const out=[],seen=new Set(),td=dateKey();
  for(let i=0;i<14;i++){const k=addDays(td,-i),d=DAYS[k];if(!d)continue;(d.entries||[]).forEach(e=>{const id=e.tid||e.htid62,t=id&&TASKS[id];if(!t||seen.has(id))return;seen.add(id);
    if(t.status!==0||isStep62(t)||t.rid)return;const rep=t.rep&&t.rep.f;if(rep?(!t.due||t.due>k):false)return;if((C.ro73ok||[]).includes(id+'|'+k))return;out.push({t,k})})}
  return out}
addEventListener('click',e=>{const b=e.target.closest('[data-ro73]');if(!b)return;e.preventDefault();e.stopPropagation();const [id,k]=b.dataset.ro73.split('|'),t=TASKS[id];if(!t)return;
  if(t.rep&&t.rep.f){let nx=nextDue(t.rep,k);while(nx&&nx<=k)nx=nextDue(t.rep,nx);if(nx)t.due=nx;else{t.status=2;t.doneAt=k}}else{t.status=2;t.doneAt=k}
  if(k>=(t.last||''))t.last=k;delete t.skull;saveTask(t);C.ro73ok=[...(C.ro73ok||[]),id+'|'+k].slice(-100);save('config');render();toast(`'${t.title}' 끝낸 상태로 돌렸어요`);dupSheet72()},true);
// 시작 알림: 겹친 기록이 없어도 다시 열린 할 일이 있으면 한 번
var RO73=0;
render=(function(prev){return function(){const r=prev.apply(this,arguments);try{if(!RO73&&ready72()&&tasksReady){RO73=1;setTimeout(()=>{if(dups72(21).length)return;const n=reopen73().filter(o=>(DAYS[o.k].entries||[]).some(e=>(e.tid||e.htid62)===o.t.id&&e.kind!=='weigh')).length;
  if(n&&!C.ro73seen){C.ro73seen=1;save('config');toastAct(`↩ 겹친 기록을 지울 때 다시 열린 할 일이 ${n}개 있을 수 있어요`,'보기',dupSheet72,9000)}},3200)}}catch(e){}return r}})(render);

/* ---- 4) 타이머 '그만' → 📝 여기까지 한 만큼 기록: 시간과 상관없이 늘 (A′4) ----
   v7.2는 30초 넘게 했을 때만 단추를 넣었어요(잠깐 켜 보고 그만 누르면 안 보였음). */
quitAsk62=(function(prev){return function(){const r=prev.apply(this,arguments);try{const q=document.querySelector('#hunt .q62 .stack');if(q&&RUN&&!q.querySelector('[data-q72]')){const isR=RUN.kind==='routine',el=isR?stepElapsed():runElapsed();
  const bq=q.querySelector('[data-q62="quit"]');const b=document.createElement('button');b.className='btn';b.dataset.q72='part';const m=el<60?'1분 미만':Math.round(el/60)+'분';
  b.textContent=`📝 ${isR?'지금 단계를 ':''}여기까지 한 만큼 기록 (${m})`;q.insertBefore(b,bq)}}catch(e){console.error(e)}return r}})(quitAsk62);

/* ---- 5) '늦게 잠' 카드 (A′5) ----
   v7.2는 이름이 '늦게 잠/늦게 자…'인 카드만 고쳤는데, 기본 카드 이름은 '새벽 3시 넘어 잠'(id b2)이라 안 바뀌었을 수 있어요.
   이번엔 id b2 이거나 '…시 넘어 잠'·'새벽 … 잠'·'밤샘'인 나쁜 카드도 찾고, 이름을 '🌙 늦게 잠'으로(되돌리기 있음). 늦잠(늦게 일어남)은 안 건드려요. */
function sleepCard73(){const bad=C.actions.filter(a=>a.type==='bad');
  return bad.find(a=>/늦게\s*(잠|자)/.test(a.name||''))||bad.find(a=>a.id==='b2')||bad.find(a=>/시\s*넘어\s*(잠|자)|새벽.*(잠|자)|밤샘/.test(a.name||'')&&!/늦잠/.test(a.name||''))}
function migSleep73(){if(C.mig73sleep||!ready72())return;C.mig73sleep=1;const a=sleepCard73();if(!a){save('config');return}
  const done72=a.morn72&&a.opts&&a.opts.length===5&&a.opts[0].id==='s0';
  if(done72&&/늦게\s*(잠|자)/.test(a.name||'')){save('config');return}
  C.bak73sleep=JSON.parse(JSON.stringify(a));const old=a.name;
  if(!done72){a.opts=SLEEP_OPTS72.map(o=>({...o}));a.cond=8;a.gold=0;a.xp=0;a.morn72=1;if(!a.area)a.area='body';a.desc=a.desc||'잠든 시각으로 골라요. 아침에 일어나서 적으면 어젯밤으로 들어가고, 늦게 적었다고 손해 보지 않아요.'}
  if(!/늦게\s*(잠|자)/.test(a.name||''))a.name='🌙 늦게 잠';
  save('config');
  setTimeout(()=>toastAct(`'${old}' 카드를 '${a.name}'(으)로 고쳤어요 · 잠든 시각별 5단계 · 아침에 적어도 손해 없음`,'되돌리기',()=>{const i=C.actions.findIndex(x=>x.id===a.id);if(i>=0&&C.bak73sleep){C.actions[i]=C.bak73sleep;delete C.bak73sleep;save('config');render();toast('예전 카드로 되돌렸어요')}},10000),2000)}
render=(function(prev){return function(){try{migSleep73()}catch(e){console.error(e)}return prev.apply(this,arguments)}})(render);

/* ---- 6) 한글 조합 중에 다시 그리지 않기 (A′6) ----
   편집 → 행동/습관 찾기(#aeQ)·도파민 찾기(#dopaQ)는 칠 때마다 0.18초 뒤 화면을 통째로 다시 그려서, 조합 중인 글자가 깨졌어요.
   조합 중이면 다시 그리기를 미루고, 조합이 끝나면 그때 한 번. */
var CMP73=null,RK73=0;
addEventListener('compositionstart',e=>{CMP73=e.target},true);
addEventListener('compositionend',e=>{const t=e.target;CMP73=null;if(!t||!t.id)return;
  if(t.id==='aeQ'){ui.ae.q=t.value;clearTimeout(ui.aeT)}else if(t.id==='dopaQ'){ui.dq=t.value;clearTimeout(ui.dqT)}else return;
  clearTimeout(RK73);const id=t.id;RK73=setTimeout(()=>rerenderEditKeep(id),150)},true);
rerenderEditKeep=(function(prev){return function(id){const el=$(id);if(el&&CMP73===el){clearTimeout(RK73);RK73=setTimeout(()=>rerenderEditKeep(id),250);return}return prev.apply(this,arguments)}})(rerenderEditKeep);

/* ---- 7) 안내 ---- */
F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['⏱ 루틴 일부만 해도 오늘 함','할 일 목록 · 스낵바 🏁 여기까지 · 루틴 체크 창','단계 몇 개만 해도 루틴은 오늘 한 걸로(마지막 체크 20분 뒤·🏁 여기까지·체크 창은 바로) · 완주 보너스는 다 했을 때만',()=>{location.hash='tasks'},'루틴 일부 부분 단계'],
  ['⚖ 몸무게 바로 적기','루틴 단계 줄 · 목록의 몸무게 단계·일퀘 체크','루틴 편집·할 일 상세의 몸무게 단계에 kg 칸 · 목록에서 체크하면 그 자리에서 작은 창',()=>wSheet73(null),'몸무게 체중 kg 단계']])}})(F67);
