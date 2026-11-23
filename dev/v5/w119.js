/* ---- v12.1 (w119.js): 루틴 상황 줄을 카드·할 일 상세 맨 위로 · 실행(⏱) 화면에서도 프리셋 고르기 · 단계를 다 뺀 프리셋 = 쉬는 날(자동 건너뛰기) (사용자 11/23) ----
   · 상황 줄 `.pbar119` = 루틴 카드(rtCard61/62) 맨 위(이름 칸 앞). 할 일 상세(루틴 머리)에서는 drawTaskSheet 뒤에 머리줄(.sh) 바로 아래로 옮김(칩 줄 위).
     예전 blk114(w117)는 '오늘/내일' 줄 + 편집 접힘이었는데 **줄은 위로, 접힘 편집 칸만 `blk114`가 돌려줌**(w119에서 다시 선언 — 마지막 선언이 이김).
     프리셋이 하나뿐이면 줄 대신 작은 `🧭 상황 프리셋 ＋` 단추 하나(공간 아낌). ✎ 단추(`data-pe119`) = 편집 접힘을 펴고 그 자리로.
   · 실행 화면: 프리셋이 둘 이상인 루틴이면 단계 줄 위에 칩 한 줄 `.pbar119.run`(`data-hp119`). 누르면 `sw119` — 끝낸(건너뛴) 단계는 그대로 두고, 남은 단계를 새 프리셋 순서로 다시 짬
     (하던 단계가 새 프리셋에도 있으면 맨 앞에 두고 쓴 시간 이어서, 없으면 새 첫 단계부터 · 오늘만 넣은 단계(tmp75)는 뒤에 · 오늘 이미 한 단계는 제외). 고른 건 `r.pd117[오늘]`에도 저장.
     쉬는 날 프리셋을 고르면: 한 단계라도 끝냈으면 막고, 아니면 실행을 닫고 자동 건너뛰기.
   · **쉬는 날 프리셋 = 단계가 0개인 프리셋**(`z119` = 단계를 다 뺀 표시 — 새 단계가 생겨도 안 붙음, ensure117). 그 날이 되면(`rtSkip119`, render 앞) 머리 할 일을 `skipToday61`과 같은 방식(skip61에 그 날 적기 · 다음 차례로 · ☠ 지움)으로
     저절로 건너뜀 → 미룸(☠)으로 안 쌓이고, 일퀘도 그 날 skip61이라 안 깎임. **앞날(오늘 아닌 날)은 건드리지 않음**(그 날 프리셋을 도로 바꿀 수 있게 — 오늘 되면 그때 건너뜀).
     ⏱ 시작을 눌러도(`startRun` 맨 바깥 감쌈) 쉬는 날이면 알림만. 일정 상황(`t.rsit118`, w118)이 이름으로 쉬는 날 프리셋을 가리키면 그 일정 날들이 모두 자동 건너뜀.
   · 새 입구는 `data-pk117`(w117)만 쓰면 됨. 시험 t123. */
function isZ119(p){return !!p&&!(p.s||[]).length}
function barRow119(r,d,lab){const L=ensure117(r),on=pset117(r,d);
  return `<div class="pr119"><span class="pl119">${esc(lab)}</span><div class="pc119">${L.map(p=>`<button type="button" class="chipbtn pr114 pr117 c119" data-pk117="${r.id}|${d}|${p.id}" aria-pressed="${p===on}">${esc(preN117(p))}${isZ119(p)?' <small>쉬는 날</small>':''}${p===on?' ✓':''}</button>`).join('')}</div></div>`}
function bar119(r,o){o=o||{};if(!r)return '';const L=ensure117(r),td=gk76(),h=rtT(r),nx=h&&h.due&&h.due>td?h.due:null;
  if(L.length<2)return `<div class="pbar119 one" data-bar119="${r.id}"><button type="button" class="chipbtn g119" data-pe119="${r.id}" title="출근·외근·촬영처럼 상황별로 단계를 나눠요">🧭 상황 프리셋 ＋</button></div>`;
  return `<div class="pbar119${o.run?' run':''}" data-bar119="${r.id}" role="group" aria-label="루틴 상황">${barRow119(r,td,o.run?'상황':'오늘')}${nx&&!o.run?barRow119(r,nx,lbl117(nx)):''}${o.run?'':`<button type="button" class="ib e119" data-pe119="${r.id}" title="프리셋 편집·추가" aria-label="프리셋 편집·추가">✎</button>`}${typeof srcChip118==='function'&&!o.run?srcChip118(r,td):''}</div>`}
// 접힘 편집 칸만 (옛 blk114에서 오늘/내일 줄을 뺌)
function blk114(r){
  const L=ensure117(r),e=(O117[r.id]&&L.find(p=>p.id===O117[r.id]))||pset117(r),td=gk76(),dfl=r.pf117||L[0].id;
  const live=(r.steps||[]).filter(s=>TASKS[s.tid]),by={};live.forEach(s=>{by[s.id]=s});
  const inc=e.s.map(i=>by[i]).filter(Boolean),exc=live.filter(s=>e.s.indexOf(s.id)<0);
  const stRow=(s,i,on)=>`<div class="pe117r ${on?'':'off'}"><label><input type="checkbox" data-pcs117="${r.id}|${e.id}|${s.id}" ${on?'checked':''}> <span class="nm">${on?`<span class="no">${i+1}</span> `:''}${esc(stName61(s))}</span> ${on?`<label class="mn118" title="이 프리셋에서 이 단계에 쓰는 분 (비우면 공통 ${s.min||0}분)"><input type="number" min="0" max="240" inputmode="numeric" data-pmin118="${r.id}|${e.id}|${s.id}" value="${pmin118(e,s)}" class="${e.m&&e.m[s.id]!=null?'ov':''}" aria-label="${esc(stName61(s))} 분">분</label>`:`<span class="tiny muted">${s.min||0}분</span>`}</label>${on?`<span class="ops"><button type="button" class="ib" data-pm117="${r.id}|${e.id}|${s.id}|up" ${i?'':'disabled'} aria-label="위로">↑</button><button type="button" class="ib" data-pm117="${r.id}|${e.id}|${s.id}|dn" ${i<inc.length-1?'':'disabled'} aria-label="아래로">↓</button></span>`:''}</div>`;
  const sum=L.length>1?`${L.length}개 · 오늘은 ${preN117(pset117(r,td))}`:'지금은 하나(일반) — ＋로 출근·외근·촬영처럼 늘려요';
  return `<details class="pe117" data-r="${r.id}" ${O117['o'+r.id]?'open':''}><summary class="small"><b>🧭 상황 프리셋 편집·추가</b> <span class="tiny muted">${esc(sum)}</span></summary>
    <div class="row" style="gap:6px;flex-wrap:wrap;margin-top:6px">${L.map(p=>`<button type="button" class="chipbtn" data-pt117="${r.id}|${p.id}" aria-pressed="${p===e}">${esc(preN117(p))}${p===e?' ✎':''}${L.length>1&&p.id===dfl?' ·기본':''}</button>`).join('')}<button type="button" class="chipbtn" data-pn117="${r.id}|${e.id}">＋ 새 프리셋</button></div>
    <div class="row pe117h" style="gap:6px;flex-wrap:wrap;margin-top:8px"><input class="pe117i" data-pf117="${r.id}|${e.id}|ic" value="${esc(e.ic||'')}" maxlength="4" aria-label="아이콘" style="width:3.2em;text-align:center"><input class="pe117n" data-pf117="${r.id}|${e.id}|n" value="${esc(e.n)}" maxlength="12" aria-label="프리셋 이름" style="flex:1;min-width:6em">
      <button type="button" class="btn sm ghost" data-pdef117="${r.id}|${e.id}" ${L.length>1&&e.id!==dfl?'':'disabled'}>기본으로</button><button type="button" class="btn sm ghost" data-pdup117="${r.id}|${e.id}">복제</button><button type="button" class="btn sm ghost" data-pdel117="${r.id}|${e.id}" ${L.length>1?'':'disabled'}>삭제</button></div>
    <p class="tiny muted" style="margin:6px 0 2px"><b>${esc(preN117(e))}</b>에서 할 단계 · ${isZ119(e)?'없음 = 쉬는 날':`${inc.length}단계 ${sumMin117(inc.map(s=>({min:pmin118(e,s)})))}분`} <span>(체크 = 함, ↑↓ = 순서, 분 = 이 프리셋만)</span></p>
    <div class="pe117l">${inc.map((s,i)=>stRow(s,i,true)).join('')||'<span class="tiny muted">🛌 단계가 없어요 — 이 상황인 날은 쉬는 날이라 루틴을 자동으로 건너뛰어요(미룸 아님)</span>'}${exc.length?`<div class="tiny muted" style="margin:6px 0 2px">이 프리셋에서 안 하는 단계</div>${exc.map(s=>stRow(s,0,false)).join('')}`:''}</div>
    <p class="tiny muted" style="margin:4px 0 0">단계 이름·점수는 위 단계 목록에서 고쳐요(모든 프리셋 공통). 분은 여기서 프리셋마다 따로 정할 수 있고, 안 바꾼 단계는 공통 분이에요. 새로 넣은 단계는 쉬는 날이 아닌 모든 프리셋 맨 뒤에 붙어요. 단계를 다 빼면 쉬는 날(건너뜀)이 돼요. 아무것도 안 골랐으면 '기본' 프리셋으로 해요.</p></details>`}
// ---- 카드·상세 루틴 칸 맨 위에 상황 줄 ----
function top119(h,r){try{if(typeof h!=='string'||h.indexOf('pbar119')>=0)return h;const m='<div class="kv">',i=h.indexOf(m);if(i>=0)return h.slice(0,i)+bar119(r)+h.slice(i)}catch(e){console.error(e)}return h}
rtCard61=(function(prev){return function(r){return top119(prev.apply(this,arguments),r)}})(rtCard61);
rtCard62=(function(prev){return function(r){return top119(prev.apply(this,arguments),r)}})(rtCard62);
// 할 일 상세: 줄을 머리줄 아래(칩 줄 위)로 옮김
drawTaskSheet=(function(prev){return function(){const x=prev.apply(this,arguments);try{const sc=$('sheetC');if(sc&&$('tsTitle')){const b=sc.querySelector('.rt62p .pbar119');
  if(b){sc.querySelectorAll(':scope > .pbar119.mv').forEach(e=>e.remove());b.classList.add('mv');const hd=$('tsTitle').closest('.sh');(hd||$('tsTitle')).after(b)}}}catch(e){console.error(e)}return x}})(drawTaskSheet);
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-pe119]');if(!b)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  const r=(C.routines||[]).find(x=>x.id===b.dataset.pe119);if(!r)return;O117['o'+r.id]=1;ensure117(r);redraw117(r);
  setTimeout(()=>{const d=document.querySelector(`#sheetC details.pe117[data-r="${r.id}"]`);if(d){d.open=true;d.scrollIntoView({block:'center',behavior:'smooth'})}},60)},true);
// ---- 실행 화면: 프리셋 칩 ----
function rt119(){return RUN&&RUN.kind==='routine'?(C.routines||[]).find(x=>x.id===RUN.id)||null:null}
drawHunt=(function(prev){return function(full){const x=prev.apply(this,arguments);try{if(!full||!RUN||RUN.kind!=='routine')return x;const r=rt119();if(!r||ensure117(r).length<2)return x;
  const h=$('hunt'),sp=h&&h.querySelector('.steps');if(!sp||h.querySelector('.pbar119.run'))return x;
  const L=ensure117(r),td=gk76(),on=pset117(r,td);
  sp.insertAdjacentHTML('beforebegin',`<div class="pbar119 run" role="group" aria-label="루틴 상황"><span class="pl119">상황</span><div class="pc119">${L.map(p=>`<button type="button" class="chipbtn c119" data-hp119="${p.id}" aria-pressed="${p===on}">${esc(preN117(p))}${isZ119(p)?' <small>쉬는 날</small>':''}${p===on?' ✓':''}</button>`).join('')}</div></div>`)}catch(e){console.error(e)}return x}})(drawHunt);
function key119(s){return s.id||s.tid||('n:'+s.name)}
function sw119(pid){const r=rt119();if(!r||!RUN)return;const L=ensure117(r),p=L.find(x=>x.id===pid);if(!p)return;const td=gk76(),cur=pset117(r,td);if(cur===p)return;
  const prevPd=(r.pd117||{})[td];
  if(isZ119(p)){
    if(RUN.log.some(x=>!x.skip)){toast('이미 끝낸 단계가 있어서 쉬는 날로는 못 바꿔요 · 남은 단계를 줄이려면 다른 프리셋을 골라요');return}
    r.pd117=r.pd117||{};r.pd117[td]=pid;prune117(r);save('config');const nm=preN117(p);endRun(true);render();setTimeout(()=>toast(`${nm} · 오늘은 쉬는 날이라 루틴을 건너뛰었어요`),120);return}
  r.pd117=r.pd117||{};r.pd117[td]=pid;
  const back=()=>{if(prevPd)r.pd117[td]=prevPd;else delete r.pd117[td]};
  const done=RUN.steps.slice(0,RUN.si),used=new Set(done.map(key119)),old=new Set(RUN.steps.map(key119)),cur0=RUN.steps[RUN.si];
  const ok=s=>TASKS[s.tid]&&!used.has(key119(s))&&!stDone62(TASKS[s.tid]);
  const eff=effSteps117(r,td).filter(ok),seenG=new Set();
  const rest=eff.filter(s=>{if(s.g71){if(old.has(key119(s)))return true;const has=RUN.steps.some(z=>z.g71===s.g71)||eff.some(z=>z.g71===s.g71&&old.has(key119(z)));if(has||seenG.has(s.g71))return false;seenG.add(s.g71);return true}return true});
  const tmps=RUN.steps.slice(RUN.si).filter(s=>s.tmp75&&!rest.some(z=>key119(z)===key119(s)));
  if(!rest.length&&!tmps.length){
    if(!RUN.log.length){back();toast('이 프리셋은 남은 단계가 없어요');return}
    prune117(r);save('config');hPark75();RUN.steps=done;RUN.si=done.length;runSave();toast(`${preN117(p)} · 남은 단계가 없어서 마쳐요`);finishRoutine();return}
  prune117(r);save('config');
  hPark75();
  let keep=null;const k0=cur0&&key119(cur0);const m=k0&&rest.findIndex(s=>key119(s)===k0);
  let list=rest.slice();if(m!=null&&m>=0){keep=Object.assign(cur0,{min:list[m].min});list.splice(m,1)}
  RUN.steps=done.concat(keep?[keep]:[],list,tmps);RUN.si=done.length;
  if(!keep){RUN.steps[RUN.si]&&delete RUN.steps[RUN.si].el75}
  hSetCur75();toast(`${preN117(p)} · 남은 ${RUN.steps.length-RUN.si}단계`);try{render()}catch(e){console.error(e)}}
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-hp119]');if(!b||!RUN)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();sw119(b.dataset.hp119)},true);
// ---- 쉬는 날(단계 0개 프리셋) = 그 날 저절로 건너뜀 ----
function rtSkip119(){if(typeof ready72!=='function'||!ready72()||typeof tasksReady==='undefined'||!tasksReady)return;const td=midKey68();let dirty=0;
  (C.routines||[]).forEach(r=>{try{if(RUN&&RUN.kind==='routine'&&RUN.id===r.id)return;const L=ensure117(r);if(!L.some(isZ119))return;const h=rtT(r);if(!h||h.status!==0||!h.rep||!h.rep.f)return;
    let n=0;while(h.due&&h.due<=td&&n<14){const p=pset117(r,h.due);if(!isZ119(p))break;
      h.skip61=[...new Set([...(h.skip61||[]).filter(d=>d>=addDays(td,-14)),h.due])];let nx=nextDue(h.rep,h.due);while(nx&&nx<=h.due)nx=nextDue(h.rep,nx);if(!nx)break;h.due=nx;delete h.skull;n++}
    if(n){saveTask(h);dirty=1}}catch(e){console.error(e)}});
  if(dirty){try{syncDailies(C);save('config')}catch(e){console.error(e)}}}
render=(function(prev){return function(){try{rtSkip119()}catch(e){console.error(e)}return prev.apply(this,arguments)}})(render);
startRun=(function(prev){return function(o){try{const r=o&&o.routine&&(C.routines||[]).find(x=>x.id===o.routine.id);if(r&&isZ119(pset117(r,gk76()))){toast(`${preN117(pset117(r,gk76()))} · 쉬는 날이라 오늘은 건너뛰어요`);return}}catch(e){console.error(e)}return prev.apply(this,arguments)}})(startRun);
F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['🛌 쉬는 날 프리셋','루틴 카드·할 일 상세 맨 위 상황 줄 → ✎ → 프리셋에서 단계를 전부 빼기','단계를 다 뺀 프리셋(예: 일/일정)을 그 날의 상황으로 고르면 그 날 루틴은 미룸(☠) 없이 저절로 건너뛰어요. 며칠짜리 일정에 상황 이름을 걸어 두면 그 날들이 모두 쉬는 날이에요',()=>{location.hash='tasks'},'쉬는 날 건너뛰기 루틴 프리셋 일정 촬영 상황 단계 없음'],
  ['⏱ 실행 중 프리셋 바꾸기','루틴 ⏱ 실행 화면 단계 줄 위 상황 칩','하던 중에도 상황(프리셋)을 바꿔요. 끝낸 단계는 그대로, 남은 단계만 새 프리셋 순서로 다시 짜요(하던 단계가 새 프리셋에도 있으면 쓴 시간 이어서)',()=>{location.hash='tasks'},'루틴 실행 프리셋 상황 바꾸기 타이머 도중']])}})(F67);
/* ---- v12.1 ②: 며칠짜리 일정을 끝내도 월 막대가 그대로(전체 취소선 + ✓ + 점선) (사용자 11/23) ----
   예전: 끝내면 막대(.bar83)가 사라지고 끝낸 날 칸에 칩 하나(취소선)로 줄어듦. 이제: `doneSpans119()`(끝낸 며칠짜리 할 일)를 w83 `bars83` 목록에 넣어 **일정 전체 기간 막대**를 그대로 그리고,
   그 막대에 `.d119`(취소선·점선·✓ — 색만으로 구분 안 함). 월 칸 끝낸 칩(`month84`→`doneTasks84(k,1)`)에서는 며칠짜리를 뺌(막대와 겹침 방지). 1일·3일·주 보기 종일 칸(`allday84`)은 끝낸 뒤에도 **기간 날마다** 끝낸 칩.
   끝낸 막대도 눌러서 상세·꾹 눌러 끌기 그대로(`data-ctask`·`data-drag`). 보이기·숨기기(calPass)는 열린 막대와 같이 적용. */
function doneSpans119(){try{const keep=t=>typeof fOn77!=='function'||!fOn77()||calPass(t);
  return Object.values(TASKS).filter(t=>t&&t.status===2&&t.due&&span71(t)&&!t.cb76&&!t.ml80&&!isStep62(t)&&keep(t))}catch(e){console.error(e);return []}}
function barsDone119(){const m=$('calMain');if(!m)return;
  m.querySelectorAll('.bar83').forEach(b=>{const t=TASKS[b.dataset.ctask];if(!t||t.status!==2)return;
    b.classList.add('done','d119');b.classList.remove('late');b.title='✓ 끝냄 · '+b.title.replace(/^✓ 끝냄 · /,'');
    if(!b.querySelector('.ck119')){const mk=document.createElement('span');mk.className='ck119';mk.textContent='✓ ';const f=b.firstChild;
      if(f&&f.nodeType===3&&/^‹ /.test(f.nodeValue)){f.nodeValue=f.nodeValue.slice(2);b.insertBefore(mk,f);b.insertBefore(document.createTextNode('‹ '),mk)}
      else b.insertBefore(mk,b.firstChild)}});
  try{if(typeof place83==='function')place83()}catch(e){}}
renderCal=(function(prev){return function(){const x=prev.apply(this,arguments);try{if(calShown()&&(C.ui.cal||{}).mode==='month')barsDone119()}catch(e){console.error(e)}return x}})(renderCal);
/* ---- v12.1 ③: 끝낸 할 일도 날짜 바꾸기 (사용자 11/23) ----
   · 끝낸(status 2) 한 번짜리 할 일 상세의 날짜 칩 `📅 오늘`은 눌러도 마감일만 바뀌어 아무 일도 안 일어난 것처럼 보였음 → **`✓ 어제 끝냄`**(끝낸 날) 칩으로 바꾸고 누르면 기존 `mvSheet69`(오늘·어제·그저께·다른 날 고르기 —
     점수 합계는 그대로, 그날 기록 보너스(✍)만 빠지는 v6.9 기록 옮기기 `moveEntry69`)가 뜸. 기록이 없는 끝낸 일(체크리스트 승격 등)은 `t.doneAt`만 바꾸는 작은 창(`mvDone119`).
   · 캘린더: 1일·3일·주 보기에서 끝낸 칩(`done105`)을 **다른 날** 칸으로 끌면 같은 길(`moveEntry69`)로 옮기고 '되돌리기' 알림 — 예전엔 '그날 안에서만 옮겨요'로 막았음(w105). 오늘보다 뒤 날짜로는 못 옮김.
   · 반복 할 일의 한 회차 기록은 이 칩 대상이 아님(기록하기에서 기존 📅 날짜 바꾸기). */
function mvDone119(id){const t=TASKS[id];if(!t||t.status!==2)return;const k=t.doneAt||dateKey();try{tsRead()}catch(e){}
  const e=((DAYS[k]||{}).entries||[]).find(x=>x.tid===id);
  if(e){mvSheet69(k,e.id);return}
  sheetCtx={mv119:id};openSheet(`<div class="sh"><h3>📅 언제 끝낸 일인가요?</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <p class="small" style="margin:0 0 8px"><b>${esc(t.title)}</b> <span class="muted">· 지금 ${esc(d69lbl(k))}</span></p>
    <div class="row" style="gap:6px"><input type="date" id="mv119d" max="${esc(dateKey())}" value="${esc(k)}" aria-label="끝낸 날"><button type="button" class="btn sm" data-mv119go="${esc(id)}">옮기기</button></div>
    <p class="help" style="margin:8px 0 0">이 일은 점수 기록이 없어서 끝낸 날짜만 바뀌어요.</p>`)}
addEventListener('click',e=>{let b=e.target.closest&&e.target.closest('[data-mv119]');if(b){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();mvDone119(b.dataset.mv119);return}
  b=e.target.closest&&e.target.closest('[data-mv119go]');if(b){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();const t=TASKS[b.dataset.mv119go],v=($('mv119d')||{}).value;
    if(!t||!/^\d{4}-\d\d-\d\d$/.test(v||''))return;if(v>dateKey()){toast('끝낸 일은 오늘보다 뒤 날짜로 못 옮겨요');return}const from=t.doneAt;t.doneAt=v;saveTask(t);closeSheet();render();
    toastAct(`${t.title} · ${d69lbl(v)} 끝낸 걸로 옮겼어요`,'되돌리기',()=>{t.doneAt=from;saveTask(t);render()})}},true);
drawTaskSheet=(function(prev){return function(){const x=prev.apply(this,arguments);try{const sc=$('sheetC'),t=TASKS[(sheetCtx||{}).task];
  if(sc&&t&&$('tsTitle')&&t.status===2&&!(t.rep&&t.rep.f)&&t.doneAt){const ch=sc.querySelector('.tchips [data-x56panel="when"]');
    if(ch){ch.removeAttribute('data-x56panel');ch.removeAttribute('aria-expanded');ch.dataset.mv119=t.id;ch.title='언제 끝낸 일인지 바꾸기 (오늘·어제·그저께·다른 날)';ch.textContent=`✓ ${d69lbl(t.doneAt)} 끝냄`}}}catch(e){console.error(e)}return x}})(drawTaskSheet);
function crossDone119(id,k0,drop){const to=drop.date,t=TASKS[id];if(!t)return;
  if(to>midKey68()){toast('끝낸 일은 오늘보다 뒤 날짜로 못 옮겨요');return}
  const e=typeof entOf105==='function'?entOf105(k0,id):((DAYS[k0]||{}).entries||[]).find(x=>x.tid===id);
  if(!e){toast('이 일의 끝낸 기록을 찾지 못했어요 · 상세 → ✓ 끝낸 날 칩에서 바꿔요');return}
  const eid=e.id,nm=t.title;moveEntry69(k0,eid,to);
  try{if(drop.type==='time')setCt105(to,id,hm(drop.min));else if(drop.type==='allday')setCt105(to,id,'')}catch(_){}
  setTimeout(()=>toastAct(`${nm} · ${d69lbl(to)} 끝낸 걸로 옮겼어요`,'되돌리기',()=>{moveEntry69(to,eid,k0)}),80)}
dndEnd=(function(prev){return function(x,y){
  if(DND&&DND.kind==='done105'){const id=DND.id,drop=DND.drop,k0=typeof d105==='function'?d105(DND.el):null;
    if(drop&&k0&&drop.date&&drop.date!==k0&&TASKS[id]){dndAbort();crossDone119(id,k0,drop);return}}
  return prev.apply(this,arguments)}})(dndEnd);
