/* ================= v6.0: 하나로 잇기(일퀘·습관·할 일·루틴) · 전투 기록 계산 다듬기 · 정보창 · 도파민 필터 · 빠른 추가 창 · 3단계(보스·장비 상점) =================
   주의: 맨 끝 모듈. 최상위 값은 var/function. function 선언은 이 모듈 것이 이김(spriteSVG·calc59·blogHTML·dopaEditHTML·routinesEditHTML·habRows59·did59·sched59). */

/* ---- 0) 말 다듬기: '퀵' → '짧게' (⚡는 용기에만) ---- */
(function(){const L={quick:['🍃 짧게','10분 안'],mid:['🕓 보통','30분쯤'],heavy:['🧱 길게','1시간 넘게']};EFFORTS.forEach(e=>{const v=L[e[0]];if(v){e[1]=v[0];e[2]=v[1]}})})();
{const _eo60=effortOf;effortOf=function(t){if(!t.effort){const tg=(t.tags||[]).join(' ');if(/짧게|짧은/.test(tg))return 'quick';if(/길게|긴일/.test(tg))return 'heavy'}return _eo60(t)}}
function effName60(ef){const e=EFFORTS.find(x=>x[0]===ef);return e?e[1].replace(/^\S+\s/,''):ef}

/* ---- 1) 연결 지도: 어떤 카드·루틴·할 일이 어디에 이어져 있나 (어디서 열어도 같은 걸 보여줌) ---- */
function rtT(r){if(!r)return null;for(const k in TASKS){const t=TASKS[k];if(t&&t.rid===r.id&&t.status===0&&t.rep&&t.rep.f)return t}return null}
function isDailyRep(rep){return !!(rep&&rep.f==='d'&&(+rep.i||1)===1)}
function chip60(txt,attrs,tip){return `<button type="button" class="chipbtn x60c" ${attrs} ${tip?`title="${esc(tip)}"`:''}>${txt}</button>`}
function connCard60(a,skip){
  if(!a)return [];const out=[],ht=habT(a);
  if(ht&&skip!=='task:'+ht.id)out.push(chip60(`${ht.quest?'☑':'↻'} ${esc(rhythmText(ht).replace(/^\S+\s/,''))}`,`data-x60task="${ht.id}"`,'반복 할 일 열기 (언제 뜨는지·일퀘)'));
  else if(!ht&&a.type==='good'&&!a.link)out.push(chip60('＋ 반복 정하기',`data-x60rep="${a.id}"`,'매일·요일을 정하면 ↻ 습관이 돼요'));
  (C.routines||[]).forEach(r=>{const i=(r.steps||[]).findIndex(s=>s.aid===a.id);if(i>=0&&skip!=='rt:'+r.id)out.push(chip60(`⏱ ${esc(r.name.replace(/^\S+\s/,''))} ${i+1}단계`,`data-x60rt="${r.id}"`,'루틴 편집'))});
  if(a.dopa){const c=dopaC().find(x=>x[0]===a.dopa);if(c)out.push(chip60(`🍬 ${esc(c[1])}`,`data-goedit="dopa"`,'도파민 메뉴 편집'))}
  if(a.brave){const z=braveSize(a);out.push(chip60(`⚔ 용기${z?' '+esc(z.name):''}`,`data-aedit="${a.id}"`))}
  if(a.link)out.push(`<span class="mx">🔗 ${esc(linkName(a.link))}</span>`);
  Object.values(TASKS).filter(t=>t.status===0&&t.aid===a.id&&!t.hab&&skip!=='task:'+t.id).slice(0,3).forEach(t=>out.push(chip60(`📋 ${esc(t.title.length>14?t.title.slice(0,14)+'…':t.title)}${t.due?' · '+esc(dueLabel(t.due)):''}`,`data-x60task="${t.id}"`,'이 카드와 연결된 할 일')));
  return out;
}
function connRt60(r,skip){
  if(!r)return [];const out=[],t=rtT(r);
  if(t&&skip!=='task:'+t.id)out.push(chip60(`${t.quest?'☑ 매일 · 일퀘':'↻ '+esc(repLabel(t.rep))}`,`data-x60task="${t.id}"`,'이 루틴의 반복 할 일'));
  (r.steps||[]).forEach(s=>{const a=s.aid&&C.actions.find(x=>x.id===s.aid);if(!a)return;const ht=habT(a);if(ht)out.push(chip60(`${ht.quest?'☑':'↻'} ${esc(a.name)}`,`data-aedit="${a.id}"`,`'${s.name}' 단계를 끝내면 이 습관도 체크돼요`))});
  return out;
}
function connLine60(chips,lead){return chips.length?`<div class="conn60"><span class="tiny muted">${lead||'이어진 곳'}</span>${chips.join('')}</div>`:''}

/* ---- 2) 일퀘 = '매일 반복 할 일'에 붙는 ☑ (카드 습관뿐 아니라 루틴·그냥 할 일도) ---- */
{const _sd60=syncDailies;syncDailies=function(c){
  _sd60(c);if(!c||!c.mig57||!tasksReady)return;
  const have=new Set((c.dailies||[]).map(q=>q.tid).filter(Boolean));
  Object.values(TASKS).filter(t=>t.quest&&t.status===0&&isDailyRep(t.rep)&&!(t.hab&&t.aid)&&!have.has(t.id)).sort((x,y)=>(x.order||0)-(y.order||0)).forEach(t=>{
    const r=t.rid&&(c.routines||[]).find(x=>x.id===t.rid);
    (c.dailies=c.dailies||[]).push({id:t.qid||('q'+t.id),name:r?r.name:t.title,action:'@t:'+t.id,xp:0,gold:0,tid:t.id})})}}
function tDone60(tid,day){
  const t=TASKS[tid];if(!day)return false;
  return (day.entries||[]).some(e=>e.tid===tid||(t&&t.rid&&e.kind==='routine'&&e.rid===t.rid&&e.full!==false))}
{const _wt60=watchTarget;watchTarget=function(id){
  if(typeof id==='string'&&id.startsWith('@t:')){const t=TASKS[id.slice(3)];const r=t&&t.rid&&(C.routines||[]).find(x=>x.id===t.rid);
    return {name:r?r.name:(t?t.title:'할 일'),area:r?(r.area||'life'):(t?areaOfTask(t):'life'),done:day=>tDone60(id.slice(3),day)}}
  return _wt60(id)}}
{const _tq60=toggleQuest;toggleQuest=function(q){
  if(!q||!q.action||!q.action.startsWith('@t:'))return _tq60(q);
  if(!guard())return;const t=TASKS[q.action.slice(3)],day=curDay();if(!t){toast('연결된 할 일이 없어요');return}
  const e=(day.entries||[]).find(x=>x.tid===t.id||(t.rid&&x.kind==='routine'&&x.rid===t.rid));
  if(e){removeEntry(day.date,e.id);return}
  const r=t.rid&&(C.routines||[]).find(x=>x.id===t.rid);
  if(r){closeInfo&&closeInfo();startRun({routine:r});return}
  completeTask(t)}}
// 루틴 기록에 어떤 루틴인지(rid)·다 했는지(full) 남기기 → 루틴 일퀘가 저절로 채워짐
var FR60=null;
{const _fr60=finishRoutine;finishRoutine=function(){FR60=RUN&&RUN.id;try{return _fr60.apply(this,arguments)}finally{FR60=null}}}
{const _ae60=applyEntry;applyEntry=function(day,e){if(e&&e.kind==='routine'&&FR60&&!e.rid){e.rid=FR60;e.full=!/\(\d+\/\d+\)$/.test(e.name||'')}return _ae60(day,e)}}
// 놓친 날: 일퀘·루틴 반복 할 일도 쌓이지 않고 오늘로 (☠ 없이)
function rollQ60(){if(!C.mig57||!tasksReady)return;const td=dateKey();
  Object.values(TASKS).forEach(t=>{if(t.hab||!(t.quest||t.rid)||t.status!==0||!t.rep||!t.due||t.due>=td)return;const nd=firstDue(t.rep,td);if(nd&&nd!==t.due){t.due=nd;delete t.skull;saveTask(t)}})}

/* ---- 3) 루틴 편집: 언제(요일) · ☑ 일퀘 · 단계가 어떤 습관을 채우는지 ---- */
function setRt60(r,wd,quest){
  let t=rtT(r);const all=wd.length===7;
  if(!wd.length){if(t)deleteTask(t.id);syncDailies(C);save('config');return null}
  const rep=all?{f:'d',i:1}:{f:'w',i:1,wd:wd.slice().sort()};
  if(!t){t=newTask({title:r.name,rid:r.id,list:r.list||'inbox',rep})}else t.rep=rep;
  const td=dateKey();let d=firstDue(rep,td);if(d===td&&tDone60(t.id,DAYS[td]))d=nextDue(rep,td)||d;t.due=d;delete t.skull;
  if(quest!==undefined){if(quest)t.quest=1;else delete t.quest}
  saveTask(t);syncDailies(C);save('config');return t;
}
function rtWd60(t){if(!t||!t.rep)return [];if(isDailyRep(t.rep))return [0,1,2,3,4,5,6];return t.rep.f==='w'?(t.rep.wd||[]).slice():[]}
function routinesEditHTML(){
  const rs=C.routines||[];
  const stepOpts=s=>`<option value="">없음</option><option value="@weigh" ${s.aid==='@weigh'?'selected':''}>⚖ 몸무게 기록</option>${C.actions.filter(a=>a.type==='good'&&!a.doneAt).map(a=>`<option value="${a.id}" ${s.aid===a.id?'selected':''}>${esc(a.name)}${isHabit(a)?' ↻':''}</option>`).join('')}`;
  return `<p class="help">루틴 = 순서대로 하는 단계 묶음이에요. <b>단계에 행동 카드를 이으면</b> 그 단계를 끝낼 때 카드 점수가 들어가고, 그 카드의 ↻ 습관·☑ 일퀘도 같이 체크돼요. 루틴 자체는 <b>다 끝냈을 때 완주 보너스</b>만 줘요. 아래 '언제'를 정하면 할 일 목록·캘린더에 뜨고, 매일이면 ☑ 일퀘로도 둘 수 있어요.</p><div class="stack">`+
  rs.map(r=>{const t=rtT(r),wd=rtWd60(t),odd=t&&!isDailyRep(t.rep)&&t.rep.f!=='w';
    return `<div class="jarcard" id="rt60-${r.id}"><div class="kv"><label>루틴 이름<input data-rt="${r.id}" data-f="name" value="${esc(r.name)}"></label><label>완주 XP<input data-rt="${r.id}" data-f="xp" type="number" min="0" value="${r.xp||0}"></label><label>완주 골드<input data-rt="${r.id}" data-f="gold" type="number" min="0" value="${r.gold||0}"></label><label>영역<select data-rt="${r.id}" data-f="area">${C.areas.map(a=>`<option value="${a.id}" ${(r.area||'life')===a.id?'selected':''}>${esc(a.name)}</option>`).join('')}</select></label></div>
    <div class="when60"><b class="small">📅 언제</b>${odd?`<span class="small">${esc(repLabel(t.rep))}</span><button class="chipbtn" data-x60task="${t.id}">할 일에서 바꾸기</button>`:
      `${[1,2,3,4,5,6,0].map(w=>`<button type="button" class="chipbtn wd60" data-x60rwd="${r.id}:${w}" aria-pressed="${wd.includes(w)}">${WDK[w]}</button>`).join('')}<button type="button" class="chipbtn" data-x60rwd="${r.id}:all" aria-pressed="${wd.length===7}">매일</button>${wd.length?`<button type="button" class="chipbtn" data-x60rwd="${r.id}:none">안 정함</button>`:''}`}
      <label class="row small" style="gap:4px;margin-left:6px"><input type="checkbox" data-x60rq="${r.id}" ${t&&t.quest?'checked':''} ${t?'':'disabled'} style="width:auto">☑ 일퀘${t?(isDailyRep(t.rep)?'':' (고른 요일에만)'):' (언제를 정하면)'}</label>
      ${t?`<span class="tiny muted">다음: ${esc(dueLabel(t.due))} · 📂 ${esc(listName(t.list||'inbox'))}</span>`:'<span class="tiny muted">안 정하면 ⏱ 사냥·목록에서 직접 시작해요</span>'}</div>
    <div class="vtable" style="margin-top:8px"><div class="vrow head" style="grid-template-columns:minmax(0,1.6fr) .5fr 1.2fr 26px 26px 26px"><span>단계</span><span>분</span><span>이을 행동 카드</span><span></span><span></span><span></span></div>
    ${r.steps.map((s,i)=>{const a=s.aid&&C.actions.find(x=>x.id===s.aid),ht=a&&habT(a);
      return `<div class="vrow" style="grid-template-columns:minmax(0,1.6fr) .5fr 1.2fr 26px 26px 26px"><input data-rs="${r.id}" data-i="${i}" data-f="name" value="${esc(s.name)}" aria-label="단계 이름"><input data-rs="${r.id}" data-i="${i}" data-f="min" type="number" min="0" max="240" value="${s.min||0}" aria-label="분"><select data-rs="${r.id}" data-i="${i}" data-f="aid" aria-label="이을 행동 카드">${stepOpts(s)}</select><button class="x" data-rsmove="${r.id}" data-i="${i}" data-d="-1" ${i?'':'disabled'} aria-label="위로">↑</button><button class="x" data-rsmove="${r.id}" data-i="${i}" data-d="1" ${i<r.steps.length-1?'':'disabled'} aria-label="아래로">↓</button><button class="x" data-rsdel="${r.id}" data-i="${i}" aria-label="단계 지우기">×</button></div>
      ${a?`<div class="stp60 tiny muted">↳ 끝내면 '${esc(a.name)}' ${a.type==='good'?`⭐${a.xp||0}`:''} 기록${ht?` · ${ht.quest?'☑ 일퀘':'↻ 습관'}도 체크`:''} <button class="chipbtn" data-aedit="${a.id}">✎ 카드</button></div>`:''}`}).join('')}</div>
    <div class="row"><button class="btn sm ghost" data-rsadd="${r.id}">＋ 단계</button><span class="tiny muted">총 ${r.steps.reduce((s,x)=>s+(+x.min||0),0)}분</span><span style="flex:1"></span><button class="btn sm" data-rrun="${r.id}">⏱ 시작</button><button class="btn sm ghost" data-rtdel="${r.id}">루틴 지우기</button></div></div>`}).join('')+
  `</div><div class="row" style="margin-top:10px"><button class="btn sm" data-rtadd="1">＋ 새 루틴</button></div>`;
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-x60rwd]');if(!b)return;e.preventDefault();e.stopPropagation();
  const [rid,w]=b.dataset.x60rwd.split(':'),r=(C.routines||[]).find(x=>x.id===rid);if(!r)return;const t=rtT(r);let wd=rtWd60(t);
  if(w==='all')wd=[0,1,2,3,4,5,6];else if(w==='none')wd=[];else{const n=+w;wd=wd.includes(n)?wd.filter(x=>x!==n):[...wd,n]}
  setRt60(r,wd);reEdit();render();toast(wd.length?`'${r.name}' ${wd.length===7?'매일':wd.map(x=>WDK[x]).join('')} 할 일로 떠요`:`'${r.name}' 반복을 껐어요`)},true);
document.addEventListener('change',e=>{const i=e.target;if(!i.dataset||!i.dataset.x60rq)return;e.stopPropagation();const r=(C.routines||[]).find(x=>x.id===i.dataset.x60rq);if(!r)return;
  setRt60(r,rtWd60(rtT(r)),i.checked);reEdit();render();toast(i.checked?`☑ '${r.name}'이(가) 일퀘가 됐어요 · 완주하면 채워져요`:'일퀘에서 뺐어요')},true);
// 연결 칩 공통 동작
document.addEventListener('click',e=>{const b=e.target.closest('[data-x60task],[data-x60rt],[data-x60rep]');if(!b)return;e.preventDefault();e.stopPropagation();
  if(typeof closeInfo==='function'&&b.closest('#pop'))closeInfo();
  if(b.dataset.x60task){const t=TASKS[b.dataset.x60task];if(!t){toast('할 일을 찾지 못했어요');return}if(sheetCtx&&sheetCtx.aedit)closeSheet();openTaskSheet(t.id);return}
  if(b.dataset.x60rt){if(sheetCtx)closeSheet();goEdit('routines');setTimeout(()=>{const el=$('rt60-'+b.dataset.x60rt);if(el){el.scrollIntoView({block:'center'});el.classList.add('flash60');setTimeout(()=>el.classList.remove('flash60'),1600)}},80);return}
  if(b.dataset.x60rep){const a=C.actions.find(x=>x.id===b.dataset.x60rep);if(!a)return;const t=setRhythm(a,{f:'d',i:1});if(sheetCtx&&sheetCtx.aedit)closeSheet();render();if(t)openTaskSheet(t.id);toast(`'${a.name}' 매일 반복을 만들었어요 · 📅에서 요일로 바꿀 수 있어요`)}},true);

/* ---- 4) 할 일 상세: 🃏 칸 = 카드 또는 루틴 연결 + ☑ 일퀘(매일이면 무엇이든) + 이어진 곳 ---- */
function tsLink60(){
  const t=sheetCtx&&sheetCtx.task&&TASKS[sheetCtx.task];if(!t)return;const sc=$('sheetC');if(!sc)return;
  const r=t.rid&&(C.routines||[]).find(x=>x.id===t.rid),a=t.aid&&C.actions.find(x=>x.id===t.aid);
  const cb=sc.querySelector('[data-x56panel="card"].tch');
  if(cb)cb.innerHTML=r?`⏱ ${esc(r.name)}${t.quest?' · ☑ 일퀘':''}`:a?`🃏 ${esc(a.name)}${t.quest?' · ☑ 일퀘':''}`:`🃏 카드·루틴${t.quest?' · ☑ 일퀘':''}`;
  if(cb){cb.classList.toggle('off',!(r||a));cb.title='행동 카드나 루틴과 잇기 (점수가 거기서 나와요) · ☑ 일퀘'}
  const pan=sc.querySelector('.tpanel[data-p="card"]');if(!pan||pan.querySelector('.ln60'))return;
  const h=pan.querySelector('.tph b');if(h)h.textContent='🃏 카드 · ⏱ 루틴 연결';
  const box=document.createElement('div');box.className='ln60';
  const daily=!!(t.rep&&t.rep.f),qOK=daily&&!(t.hab&&t.aid);
  box.innerHTML=`<label class="f">⏱ 루틴과 잇기<select id="x60Rid" ${a?'disabled':''}><option value="">없음</option>${(C.routines||[]).map(x=>`<option value="${x.id}" ${t.rid===x.id?'selected':''}>${esc(x.name)} · 완주 +${x.xp||0}</option>`).join('')}</select></label>
    ${a?'<p class="tiny muted" style="margin:0">카드와 이어져 있어서 루틴은 못 골라요. 둘 중 하나만 잇어요.</p>':''}
    ${r?`<p class="tiny muted" style="margin:0">이 할 일을 누르면 루틴이 시작돼요. 완주하면 이 할 일도 끝나요.</p><div class="row" style="gap:6px"><button class="btn sm" data-rrun="${r.id}">⏱ 지금 시작</button><button class="btn ghost sm" data-x60rt="${r.id}">✎ 루틴 편집</button></div>`:''}
    ${qOK?`<label class="row small" style="gap:6px"><input type="checkbox" data-x60tq="${t.id}" ${t.quest?'checked':''} style="width:auto"> ☑ 일퀘로 (${isDailyRep(t.rep)?'매일':'반복하는 날에만'} · 그날 다 끝내면 상자)</label>`:(!t.hab&&!daily?'<p class="tiny muted" style="margin:0">📅에서 반복을 정하면 ☑ 일퀘로도 둘 수 있어요 (요일마다 다른 일퀘도 돼요).</p>':'')}
    ${connLine60(a?connCard60(a,'task:'+t.id):r?connRt60(r,'task:'+t.id):[])}`;
  pan.appendChild(box);
  // 카드를 고르면 루틴은 풀기 (하나만)
  const sel=$('tsAid');if(sel&&r)sel.disabled=true;
}
{const _dts60=drawTaskSheet;drawTaskSheet=function(){const x=_dts60.apply(this,arguments);try{tsLink60()}catch(e){console.error(e)}return x}}
document.addEventListener('change',e=>{const i=e.target;
  if(i.id==='x60Rid'){e.stopPropagation();const t=tsRead();if(!t)return;if(i.value){t.rid=i.value;delete t.aid}else delete t.rid;saveTask(t);syncDailies(C);save('config');tsRedraw();render();return}
  if(i.dataset&&i.dataset.x60tq){e.stopPropagation();const t=tsRead();if(!t)return;if(i.checked)t.quest=1;else delete t.quest;saveTask(t);syncDailies(C);save('config');tsRedraw();render();toast(t.quest?'☑ 일퀘가 됐어요':'일퀘에서 뺐어요')}},true);

/* ---- 5) 카드 편집 창: 한 줄 설명 + 이어진 곳 ---- */
{const _at60=aeTopHTML;aeTopHTML=function(a){
  return _at60(a)+`<label class="f">📝 이 행동은 <span class="tiny muted">(왜 하는지·어떻게 하는지 한 줄 · 이름을 누르면 보여요)</span><input data-x60why="1" maxlength="120" value="${esc(a.why||'')}" placeholder="${a.type==='good'?'예: 머리가 맑아져서 · 5분만 해도 됨':'예: 피곤할 때 당김 · 대신 🍬 찬물 세수'}"></label>${connLine60(connCard60(a))}`}}
document.addEventListener('input',e=>{const i=e.target;if(!i.dataset||!i.dataset.x60why)return;const a=C.actions.find(x=>x.id===(sheetCtx||{}).aedit);if(!a)return;const v=i.value.trim();if(v)a.why=v;else delete a.why},true);

/* ---- 6) 정보 창(이름 누르면): 같은 문구 대신 그 행동의 설명 · 이어진 곳 · 도움 되는 한 줄 ---- */
function streak60(aid){let n=0,k=dateKey();const has=d=>DAYS[d]&&(DAYS[d].entries||[]).some(e=>e.kind==='act'&&e.aid===aid);if(!has(k))k=addDays(k,-1);while(has(k)&&n<400){n++;k=addDays(k,-1)}return n}
function tip60(a){
  const w=countAct(e=>e.aid===a.id,7).c,all=countAct(e=>e.aid===a.id),ht=habT(a),done=doneToday(a);
  if(a.type==='bad'){if(!all.c)return '아직 한 번도 기록 안 했어요. 좋은 신호예요.';return w?`이번 7일 ${w}번. 당길 땐 🍬 '지금 어때?'에서 대신할 것부터 꺼내요. 기록만 해도 패턴이 보여요.`:`7일 동안 안 했어요 (마지막 ${all.last?ago(all.last):'—'}). 끊긴 흐름이 길어질수록 보너스가 커져요.`}
  const st=streak60(a.id);
  if(!all.c)return a.dur?`처음이에요. ⏱ ${a.dur}분만 해도 충분해요 — 타이머로 하면 빠를 때 보너스.`:'처음이에요. 아주 작게 한 번만 해봐요. 한 번이 제일 커요.';
  if(st>=2)return done?`${st}일 연속 했어요. 내일도 이어가요.`:`${st}일 연속 중 — 오늘 하면 ${st+1}일째.`;
  if(!ht&&w>=3)return `7일에 ${w}번이나 했어요. ↻ 반복을 정하면 습관으로 지켜보고 돌아보기에서 지킨 날을 세요.`;
  const gap=all.last?diffDays(dateKey(),all.last):0;
  if(gap>=14)return `마지막이 ${gap}일 전이에요. 루틴 단계나 반복 할 일에 넣어 두면 잊지 않아요.`;
  if(a.brave)return '⚔ 용기 행동이에요. 결과와 상관없이 한 것 자체로 용기 점수가 쌓여요. 보스에겐 치명타!';
  if(a.dur)return `⏱ ${a.dur}분짜리. 사냥(타이머)으로 하면 빨리 끝낼 때 보너스가 붙어요.`;
  return `지금까지 ${all.c}번 · 마지막 ${all.last?ago(all.last):'—'}.`;
}
{const _if60=infoFor;infoFor=function(key){const r=_if60(key);try{
  if(!r||typeof key!=='string')return r;const [k,id]=key.split(':');
  if(k==='act'){const a=C.actions.find(x=>x.id===id);if(!a)return r;
    const add=`${a.why?`<p class="why60">${esc(a.why)}</p>`:`<p class="tiny muted" style="margin:6px 0">✎ 편집에서 '📝 이 행동은'에 한 줄을 적어 두면 여기 보여요.</p>`}${connLine60(connCard60(a))}<p class="tip60">💡 ${tip60(a)}</p>`;
    r.b=r.b.replace(/<p class="tiny muted">[^<]*<\/p>/,add)}
  if(k==='quest'){const q=C.dailies.find(y=>y.id===id);if(q&&q.action&&q.action.startsWith('@t:')){const t=TASKS[q.action.slice(3)],rt=t&&t.rid&&(C.routines||[]).find(x=>x.id===t.rid);
    r.b=r.b.replace('<p class="small muted">점수는 행동 카드에서 정해요.</p>',`<p class="small muted">${rt?`⏱ 루틴 '${esc(rt.name)}'을(를) 완주하면 채워져요. 점수는 단계의 카드 + 완주 보너스.`:'이 할 일을 끝내면 채워져요. 점수는 할 일 크기·중요도에서.'}</p>${connLine60(rt?connRt60(rt):[chip60('📋 할 일 열기',`data-x60task="${t?t.id:''}"`)])}`)}}
  if(k==='boss'){r.b=r.b.replace('</p>',' <b>⚔ 용기 기록은 치명타</b> — 그 XP만큼 한 번 더 때려요. 쓰러뜨리면 그 보스 전용 장비가 떨어져요(상점에서 입기).</p>')}
}catch(e){console.error(e)}return r}}

/* ---- 7) 📜 전투 기록: 원점수 → 더한 것 → 받은 점수 ---- */
function pts60(x,g,c,sign){const p=[];x=Math.round(+x||0);g=Math.round(+g||0);c=Math.round(+c||0);
  const f=(n,ic,l)=>`${ic}${l} ${sign&&n>0?'+':''}${n<0?'−'+Math.abs(n):n}`;
  if(x)p.push(f(x,'⭐','XP'));if(g)p.push(f(g,'💰','골드'));if(c)p.push(f(c,'❤','컨디션'));return p.join(' · ')||'0점'}
var Q60=new Set();
function calc59(e){
  const add=[];let base=null,src='',note='';
  if(e.kind==='act'){
    const a=C.actions.find(x=>x.id===e.aid);if(!a)return '<span class="k60">카드가 지워져서 계산을 다시 못 보여줘요</span> · 받은 점수는 그대로예요';
    const v=(a.opts||[]).find(o=>o.id===e.vid),pick=f=>(v&&v[f]!=null&&v[f]!=='')?Math.abs(+v[f]):Math.abs(+a[f]||0),n=e.n||1,good=a.type==='good';
    const bx=good?pick('xp'):0,bg=pick('gold'),bc=pick('cond');base=good?[bx,bg,bc]:[0,-bg,-bc];src=`카드${v?' · '+esc(v.name):''}`;
    if(n>1)add.push(`${n}번 했음 ×${n}`);
    if(good){const gm=+((C.gacha||{}).mult)||1.5,pre=e.gq?Math.round(e.xp/gm):e.xp,d=pre-bx*n;
      if(e.spd&&d)add.push(`${esc(e.spd)} +⭐${d}`);else if(d)add.push(`${d>0?'+':'−'}⭐${Math.abs(d)} <span class="tiny">(복귀 배수였거나 그 뒤 카드 점수가 바뀜)</span>`);
      if(e.gq)add.push(`🎲 뽑기 ×${gm}`);
      if(Math.abs(e.gold||0)!==bg*n||Math.abs(e.cond||0)!==bc*n)note='그 뒤 카드 점수를 바꿔서 지금 카드와 달라요'}
    else{if(e.mult)add.push(`누적 ×${e.mult} <span class="tiny">(7일 안 같은 행동·나쁜 날 연속)</span>`);
      const wg=Math.round(bg*n*(e.mult||1)),hg=Math.abs(e.gold||0);
      if(Math.abs(e.cond||0)!==Math.round(bc*n*(e.mult||1))||hg>wg)note='그 뒤 카드 점수를 바꿔서 지금 카드와 달라요';else if(hg<wg)note=`골드는 가진 만큼(${hg})만 빠졌어요`}
    if(e.brave)add.push(`⚔ 용기 +${e.pts||1}점`);
    if(Q60.has(e.id))add.push('☑ 일퀘 칸 채움');
    if(e.tid&&TASKS[e.tid]&&TASKS[e.tid].hab)add.push('↻ 습관 체크');
  }else if(e.kind==='task'){
    const t=e.tid&&TASKS[e.tid],X=C.taskXP||{};
    if(t&&t.px){base=[+t.px.xp||0,+t.px.gold||0,+t.px.cond||0];src='직접 정한 점수'}
    else if(t&&t.rid){const r=(C.routines||[]).find(x=>x.id===t.rid);base=[+(r&&r.xp)||0,+(r&&r.gold)||0,4];src=`루틴 '${esc(r?r.name:'')}' 완주 점수`}
    else if(t){const ef=effortOf(t),pb=+((X.prio||{})[t.prio||0])||0,xp=(+X[ef]||10)+pb;base=[xp,Math.max(1,Math.round(xp/3)),ef==='quick'?2:ef==='heavy'?6:4];
      src=`크기 '${effName60(ef)}' ⭐${+X[ef]||10}${pb?` + 중요도 ${'!'.repeat(t.prio||0)} ⭐${pb}`:''}`;if(!e.area)base[2]=0}
    else src='할 일 크기·중요도 <span class="tiny">(할 일이 지워져 자세한 건 몰라요)</span>';
    if((e.n||1)>1)add.push(`${e.n}번 ×${e.n}`);
    if(e.ontime)add.push(`제때 끝냄 +⭐${+X.onTime||0}`);
    if(e.spd)add.push(`${esc(e.spd)} 보너스`);if(e.gq)add.push('🎲 뽑기 ×');
    if(Q60.has(e.id))add.push('☑ 일퀘 칸 채움');
  }else if(e.kind==='courage'){
    const k=e.cid&&e.cid!=='free'&&(C.courage||[]).find(x=>x.id===e.cid);
    if(k){base=[+k.xp||0,+k.gold||0,Math.abs(+k.cond||0)];src=`⚡ '${esc(k.name)}'`}else src='⚡ 용기 (크기별)';add.push(`용기 +${e.pts||1}점`);
  }else if(e.kind==='routine'){
    const r=(C.routines||[]).find(x=>x.id===e.rid||(e.name||'').startsWith(x.name));
    if(r&&e.full!==false&&(e.xp||0)>0){base=[+r.xp||0,+r.gold||0,0];src=`루틴 '${esc(r.name)}' 완주 보너스`;const gm=+((C.gacha||{}).mult)||1.5,pre=e.gq?Math.round(e.xp/gm):e.xp,d=pre-(+r.xp||0);if(d)add.push(`${e.spd?esc(e.spd):'속도·복귀'} +⭐${d}`);if(e.gq)add.push(`🎲 뽑기 ×${gm}`)}
    else src=`루틴${e.full===false||!(e.xp>0)?' (다 못 끝내서 완주 보너스 없음)':' 완주 보너스'}`;
    add.push('단계 카드 점수는 그 카드 줄에 따로');
  }else{
    const M={chest:`☑ 일퀘를 다 채운 날 상자 · 규칙 ${pts60(+C.dailyBonus.xp||0,+C.dailyBonus.gold||0,0)}`,boss:'주간 보스 처치 보너스',wbrave:'주간 용기 목표 달성',badge:'업적 보너스',
      weigh:`몸무게 기록 · 규칙 ⭐${+((C.weight||{}).xp)||0}`,free:"'그냥 한 일' 프리셋",happy:`✨ 행복 기록 · 규칙 ${pts60(+C.happy.xp||0,+C.happy.gold||0,+C.happy.cond||0)}`,
      chain:'나쁜 흐름 끊기 · 끊은 일수 × 규칙 점수',buy:'상점에서 쓴 골드',jar:'구슬만 넣음',food:'식사 기록 점수',quest:'일퀘 칸 (점수 없음 · 상자용)'};
    if(M[e.kind])src=M[e.kind];
  }
  const ext=[];if(e.dur)ext.push(`⏱ ${e.dur}분${e.st?` (${esc(e.st)} 시작)`:''}`);
  if(e.jar)ext.push('🔮 구슬 '+((e.mn||1)>1?e.mn+'개':'1개'));
  const parts=[];
  if(base)parts.push(`<span class="k60">원점수</span> ${pts60(base[0],base[1],base[2])} <span class="tiny">(${src})</span>`);else if(src)parts.push(`<span class="k60">${src}</span>`);
  if(add.length)parts.push(`<span class="k60">더한 것</span> ${add.join(' · ')}`);
  parts.push(`<span class="k60">받음</span> <b>${pts60(e.xp,e.gold,e.cond,1)}</b>`);
  return parts.join('<span class="ar60"> → </span>')+(ext.length?` <span class="tiny muted">· ${ext.join(' · ')}</span>`:'')+(note?` <span class="note60">${note}</span>`:'');
}
function blogHTML(){
  const B=ui.blog||(ui.blog={k:'all',r:7,n:10,calc:true});if(B.calc==null)B.calc=true;
  const keys=(B.r==='all'?Object.keys(DAYS):lastNDates(B.r)).filter(k=>DAYS[k]&&(DAYS[k].entries||[]).length).sort().reverse();
  let tx=0,tg=0,tc=0,tb=0,bx=0;const days=[];Q60=new Set();
  keys.forEach(k=>{const all=DAYS[k].entries||[];
    // 점수 0인 '일퀘:' 줄은 숨기고, 그 일퀘를 채운 행동 줄에 '☑ 일퀘 칸 채움'으로 붙여요
    const qn=new Set(all.filter(e=>e.kind==='quest').map(e=>String(e.name||'').replace(/^일퀘:\s*/,'')));
    all.forEach(e=>{if((e.kind==='act'||e.kind==='task')&&(qn.has(e.name)||(e.aid&&qn.has((C.actions.find(a=>a.id===e.aid)||{}).name))))Q60.add(e.id)});
    const es=all.filter(e=>blogPass(e,B.k)&&!(e.kind==='quest'&&!(e.xp||0)&&!(e.gold||0)));if(!es.length)return;days.push([k,es]);
    es.forEach(e=>{tx+=e.xp||0;tg+=e.gold||0;tc+=e.cond||0;if(BONUS59.includes(e.kind)){tb++;bx+=e.xp||0}})});
  const row=(k,e)=>{let h=logRow(k,e).replace(/<button class="x" data-rm="[^"]*" data-date="[^"]*"[^>]*>×<\/button>/,'<span></span>').replace(/data-entry="[^"]*" style="cursor:pointer" title="눌러서 고치기"/,'');
    const c=B.calc?calc59(e):'';return c?h.replace(/<\/li>$/,`<span class="calc59">${c}</span></li>`):h};
  const sum=es=>{const x=es.reduce((s,e)=>s+(e.xp||0),0),g=es.reduce((s,e)=>s+(e.gold||0),0),c=es.reduce((s,e)=>s+(e.cond||0),0),bo=es.filter(e=>BONUS59.includes(e.kind)).reduce((s,e)=>s+(e.xp||0),0);return `${sc59(x,g,c)}${bo?` · 그중 보너스 ⭐${bo}`:''}`};
  return `<div class="toolbar"><span class="seg3">${BLOG_KIND.map(([v,l])=>`<button data-x58bk="${v}" aria-pressed="${B.k===v}">${l}</button>`).join('')}</span>
    <span class="seg3">${[[7,'7일'],[30,'30일'],['all','전체']].map(([v,l])=>`<button data-x58br="${v}" aria-pressed="${String(B.r)===String(v)}">${l}</button>`).join('')}</span>
    <button class="chipbtn" data-x59calc="1" aria-pressed="${!!B.calc}">${B.calc?'☑':'☐'} 계산 보기</button></div>
    <p class="small" style="margin:4px 0 2px"><b>합계</b> · ${sc59(tx,tg,tc)} · 보너스 ${tb}번(⭐${bx}) <span class="tiny muted">(${B.r==='all'?'불러온 기록 전체':'최근 '+B.r+'일'})</span></p>
    <p class="tiny muted" style="margin:0 0 8px">계산은 <b>원점수</b>(카드·할 일 크기에서 정한 점수) <b>→ 더한 것</b>(제때·여러 번·속도·뽑기·일퀘) <b>→ 받음</b> 순서예요. 원점수는 지금 카드 기준이라, 그 뒤 점수를 바꿨으면 표시해 둬요.</p>
    ${days.slice(0,B.n).map(([k,es])=>`<div class="bday58"><div class="ptitle" style="margin:8px 0 2px"><b class="small">${esc(fmtD(k))} (${wdOf(k)})</b><span class="tiny muted num">${es.length}개 · ${sum(es)}</span></div><ul class="log">${es.slice().sort((a,b)=>(a.t||'').localeCompare(b.t||'')).map(e=>row(k,e)).join('')}</ul></div>`).join('')||'<div class="empty">이 조건에 맞는 기록이 없어요.</div>'}
    ${days.length>B.n?`<button class="btn ghost sm" data-x58bmore="1" style="margin-top:8px">더 보기 (${days.length-B.n}일 남음)</button>`:''}
    <p class="tiny muted" style="margin-top:8px">기록을 고치거나 지우는 건 '행동/습관' 화면(오늘·어제·그저께)에서 해요. 여기는 보기 전용이에요.</p>`;
}

/* ---- 8) 돌아보기 '지킨 날': 지금 있는 반복(↻ 습관·☑ 일퀘·⏱ 루틴)을, 만든 날부터만 세기 ---- */
function habRows59(){
  return openTasks().filter(t=>t.rep&&t.rep.f&&((t.hab&&t.aid)||t.rid||t.quest)).map(t=>{
    if(t.hab&&t.aid){const a=C.actions.find(x=>x.id===t.aid);return a?[t,a]:null}
    const r=t.rid&&(C.routines||[]).find(x=>x.id===t.rid);return [t,{id:'@t:'+t.id,name:(r?'⏱ '+r.name:t.title),_t:1}]}).filter(Boolean)
    .sort((x,y)=>(y[0].quest?1:0)-(x[0].quest?1:0));
}
function sched59(t,k){const r=t.rep;if(t.created&&k<String(t.created).slice(0,10))return false;if(r.until&&k>r.until)return false;
  if(r.f==='d')return (+r.i||1)===1?true:((diffDays(k,t.created||k)%(+r.i||1))===0);if(r.f==='w')return (r.wd&&r.wd.length?r.wd:[dowOf(t.due||k)]).includes(dowOf(k));
  if(r.f==='m')return (r.md||[]).includes(+k.slice(8))||((r.md||[]).includes(-1)&&addDays(k,1).slice(8)==='01');return false}
function did59(t,a,k){const d=DAYS[k];if(!d)return false;if(a._t)return tDone60(t.id,d);if(a.link)return linkMet(a,d);return (d.entries||[]).some(e=>e.aid===a.id||e.tid===t.id)}
{const _rv60=reviewHTML59;reviewHTML59=function(){return _rv60().replace(/<h2>↻ 습관 지킨 날<\/h2>/,'<h2>↻ 반복 지킨 날</h2>')
  .replace(/<p class="tiny muted" style="margin:6px 0 0">✓ 한 날[^<]*<\/p>/,`<p class="tiny muted" style="margin:6px 0 0">지금 켜져 있는 <b>↻ 습관(카드+반복)·⏱ 루틴 반복·☑ 일퀘</b>만 보여요(일퀘가 위). 만든 날 전은 빈칸이에요. ✓ 한 날 · '·' 할 날인데 못 한 날 · 빈칸은 쉬는 날. 반복을 끈 습관은 여기서 빠져요(기록은 통계·전투 기록에 남아요).</p>`)
  .replace(/<span class="nm" title="([^"]*)">/g,(m,n)=>{const t=openTasks().find(x=>x.quest&&((x.title===n)||(C.actions.find(a=>a.id===x.aid)||{}).name===n));return t?`<span class="nm" title="${n}">☑ `:m})}}

/* ---- 9) 도파민 메뉴 편집: 행동 보드처럼 찾기·스마트 필터·영역·정렬·보이는 칸 ---- */
var DF60=[['all','모두'],['fit','👍 잘 맞았던'],['new','처음 해볼 것'],['short','⏱ 10분 안'],['habit','↻ 습관'],['brave','⚔ 용기'],['stale','💤 30일 안 함']];
function dopaPass60(a,st){const f=ui.df60||'all',s=st[a.id]||{};
  if(ui.dar60&&a.area!==ui.dar60)return false;
  if(f==='fit'){const o=(C.dopaFit||{})[a.id]||{};return Object.values(o).some(x=>(x.g||0)>0)}
  if(f==='new')return !s.n;if(f==='short')return a.dur&&a.dur<=10;if(f==='habit')return isHabit(a);if(f==='brave')return !!a.brave;if(f==='stale')return !s.n30;return true}
function dopaEditHTML(){
  const q=normN(ui.dq||''),S=ui.dsel||(ui.dsel=new Set()),st=listStats(),srt=ui.dsort59||'manual',manual=srt==='manual';
  const sorted=l=>manual?l:sortList(l,st,srt);const show=aeShow().filter(k=>k!=='area');
  const ok=a=>(!q||normN(a.name).includes(q))&&dopaPass60(a,st);
  const pool=sorted(C.actions.filter(a=>a.type==='good'&&!a.dopa&&!a.doneAt&&ok(a)));
  const cs=dopaC(),filt=(ui.df60&&ui.df60!=='all')||ui.dar60||q;
  const total=C.actions.filter(a=>a.dopa&&!a.doneAt).length,shown=C.actions.filter(a=>a.dopa&&!a.doneAt&&ok(a)).length;
  return `<p class="help">행동/습관 보드와 같은 칩이에요. <b>눌러서 여러 개 고른 뒤</b> 아래 막대로 한꺼번에 옮기거나 빼요. 끌어도 돼요(폰은 꾹 눌러 끌기). ${manual?'같은 코스 안에서 놓으면 순서가 바뀌어요. ':''}이름을 누르면 편집, 코스 이름·설명은 바로 고쳐 써요.</p>
  <div class="toolbar" style="margin-bottom:6px;flex-wrap:wrap"><input id="dopaQ" type="search" placeholder="🔍 찾기 (모든 칸)" value="${esc(ui.dq||'')}" autocomplete="off" style="max-width:200px">
    <span class="seg3">${DF60.map(([v,l])=>`<button data-x60df="${v}" aria-pressed="${(ui.df60||'all')===v}">${l}</button>`).join('')}</span>
    <select id="x60Dar" aria-label="영역"><option value="">모든 영역</option>${C.areas.map(a=>`<option value="${a.id}" ${ui.dar60===a.id?'selected':''}>${esc(a.name)}</option>`).join('')}</select>
    <select id="dsort59" aria-label="칸 안 정렬">${SORTS.map(([v,l])=>`<option value="${v}" ${srt===v?'selected':''}>${l}</option>`).join('')}</select>
    <details class="aeshow"><summary class="chipbtn">👁 보이는 칸</summary><div class="pop55">${aeShowAll().map(([k,l])=>`<label class="row tiny" style="gap:6px;flex-wrap:nowrap"><input type="checkbox" data-x55show="${k}" ${aeShow().includes(k)?'checked':''} style="width:auto">${l}</label>`).join('')}</div></details>
    ${filt?`<span class="tiny muted">${shown}/${total}개 보임</span><button class="chipbtn" data-x60df="clear">✕ 모두 보이기</button>`:''}</div>
  ${S.size?`<div class="bulkbar dbar"><b>☑ ${S.size}개</b><select id="dselMove" aria-label="코스로 옮기기"><option value="">코스로 옮기기…</option>${cs.map(([k,l])=>`<option value="${k}">${esc(l)}</option>`).join('')}</select><button class="btn ghost sm" data-dselact="out">메뉴에서 빼기</button><button class="btn ghost sm" data-dselact="all">이 화면 모두</button><button class="btn ghost sm" data-dselact="clear">해제</button></div>`:''}
  <div class="dedit board57">${cs.map(([co,nm,ds])=>{const its=sorted(C.actions.filter(a=>a.dopa===co&&!a.doneAt&&ok(a)));return `<div class="dcol" data-drop="dopa:${co}" data-kb59="${manual&&!filt?'dopa':''}"><div class="dh"><input class="dcoin" data-dco="${co}" data-f="name" value="${esc(nm)}" aria-label="코스 이름"><input class="dcoin tiny" data-dco="${co}" data-f="desc" value="${esc(ds)}" placeholder="설명" aria-label="코스 설명"><span class="tiny muted">${its.length}개</span></div>${its.map(a=>kbChip59(a,{st,sel:S,dopa:true,show})).join('')||`<span class="tiny muted">${filt?'맞는 게 없어요':'여기로 끌어 놓기'}</span>`}<div class="row" style="gap:4px;margin-top:auto"><button class="btn sm ghost" data-dopanew="${co}">＋ 새 항목</button><span style="flex:1"></span><button class="btn sm ghost" data-dcodel="${co}" title="코스 지우기 (항목은 습관 칸으로)">코스 지우기</button></div></div>`}).join('')}
    <div class="dcol add"><button class="btn ghost" data-dcoadd="1" style="margin:auto">＋ 코스 추가</button></div>
    <div class="dcol pool" data-drop="dopa:"><div class="dh"><b>▲ 코스에 안 든 좋은 행동</b><span class="tiny muted">${pool.length}개</span></div>${pool.map(a=>kbChip59(a,{st,sel:S,dopa:true,show})).join('')}</div></div>`;
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-x60df]');if(!b)return;e.preventDefault();e.stopPropagation();const v=b.dataset.x60df;if(v==='clear'){ui.df60='all';ui.dar60='';ui.dq=''}else ui.df60=v;reEdit()},true);
document.addEventListener('change',e=>{if(e.target.id!=='x60Dar')return;e.stopPropagation();ui.dar60=e.target.value;reEdit()},true);

/* ---- 10) 할 일 빠른 추가 창 (?quick=1) · 앱 안에서는 Ctrl+Shift+A ---- */
var QA60=/[?&]quick=1/.test(location.search);
function qaHTML60(inApp){return `<form id="qa60f" autocomplete="off"><div class="qa60in"><input id="qa60i" maxlength="160" placeholder="할 일 빠르게 추가 · 예: 내일 3시 빨래 #짧게 !! ~Personal" aria-label="할 일 빠른 추가" enterkeyhint="done" autofocus><button class="btn" type="submit">추가</button></div><div id="qa60p" class="parse qa60p"></div>
  <div class="tiny muted qa60k">Enter = 추가${inApp?'':'하고 닫기 · Shift+Enter = 추가하고 계속'} · Esc = 닫기 · 날짜 없이 적으면 📥 기본함으로</div><div id="qa60s" class="small" role="status" aria-live="polite"></div></form>`}
var QAQ60=[];
function qaAdd60(v,stay){
  const go=()=>{const t=addTaskFrom(v,{});if(!t)return;
    const s=$('qa60s');if(s)s.innerHTML=`✓ <b>${esc(t.title)}</b> 추가${t.due?' · '+esc(dueLabel(t.due))+(t.time?' '+esc(ampm(t.time)):''):' · 📥 기본함'}`;
    if(QA60&&!stay)closeQA60(true)};
  if(ready&&tasksReady)go();else{QAQ60.push(go);const s=$('qa60s');if(s)s.textContent='불러오는 중… 끝나면 바로 넣어요'}
}
function closeQA60(afterSave){
  if(!QA60){closeSheet();return}
  let n=0;const tick=()=>{n++;const busy=(typeof dirty!=='undefined'&&[...dirty].some(k=>k.startsWith('t:')))||window.HQ_PENDING;if(busy&&n<40){setTimeout(tick,150);return}window.close();setTimeout(()=>{const s=$('qa60s');if(s)s.innerHTML+=' · 창을 닫아도 돼요'},300)};
  setTimeout(tick,afterSave?250:0)}
function qaPreview60(){const i=$('qa60i'),p=$('qa60p');if(!i||!p)return;const v=i.value.trim();p.innerHTML=v?parseChips(parseQuick(v)):''}
function setupQA60(){
  if(!QA60||$('qa60'))return;document.documentElement.classList.add('qa60');document.title='할 일 빠른 추가 · 해비티카틱';
  const d=document.createElement('div');d.id='qa60';d.innerHTML=`<div class="qa60box"><div class="spread"><b>⚔ 할 일 빠른 추가</b><button class="x" type="button" data-x60qaclose="1" aria-label="닫기">×</button></div>${qaHTML60(false)}</div>`;document.body.appendChild(d);
  setTimeout(()=>{const i=$('qa60i');if(i)i.focus()},30);
}
function openQAInApp60(){if(QA60)return;openSheet(`<div class="sh"><h3>⚔ 할 일 빠른 추가</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>${qaHTML60(true)}`);sheetCtx={qa60:1};setTimeout(()=>{const i=$('qa60i');if(i)i.focus()},40)}
document.addEventListener('submit',e=>{if(e.target.id!=='qa60f')return;e.preventDefault();e.stopPropagation();const i=$('qa60i'),v=i.value.trim();if(!v){i.focus();return}qaAdd60(v,!!ui.qaStay60);ui.qaStay60=false;i.value='';qaPreview60();i.focus()},true);
document.addEventListener('keydown',e=>{
  if(e.target&&e.target.id==='qa60i'){if(e.key==='Enter'&&e.shiftKey){ui.qaStay60=true}if(e.key==='Escape'&&QA60){e.preventDefault();e.stopPropagation();closeQA60(false)}return}
  if(QA60&&e.key==='Escape'){closeQA60(false);return}
  if((e.ctrlKey||e.metaKey)&&e.shiftKey&&(e.key==='A'||e.key==='a'||e.code==='KeyA')){e.preventDefault();e.stopPropagation();if(QA60){const i=$('qa60i');if(i)i.focus()}else openQAInApp60()}},true);
document.addEventListener('input',e=>{if(e.target.id==='qa60i')qaPreview60()});
document.addEventListener('click',e=>{if(e.target.closest('[data-x60qaclose]')){e.preventDefault();closeQA60(false)}},true);

/* ---- 11) 홈 배치: '배치 끝'을 누를 때 '내 배치'로 기억 → 언제든 한 번에 되돌리기 ---- */
var HE60=false;
{const _ahe60=applyHomeEdit;applyHomeEdit=function(){
  if(HE60&&!ui.homeEdit&&ready){C.homeMine60={at:dateKey(),h:clone(C.ui.home)};save('config')}HE60=!!ui.homeEdit;
  _ahe60.apply(this,arguments);
  const bar=$('homePresets');if(bar&&!bar.querySelector('[data-x60hmine]')){const b=document.createElement('button');b.className='chipbtn';b.dataset.x60hmine='1';bar.insertBefore(b,bar.querySelector('label'))}
  const b=bar&&bar.querySelector('[data-x60hmine]');if(b){b.hidden=!C.homeMine60;b.textContent=C.homeMine60?`↺ 내 배치 (${fmtD(C.homeMine60.at)})`:''}}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-x60hmine]');if(!b)return;e.preventDefault();e.stopPropagation();const m=C.homeMine60;if(!m)return;
  const ok=new Set(Object.keys(HOME_BLOCKS));const h=m.h.filter(x=>ok.has(x[0]));Object.keys(HOME_BLOCKS).forEach(id=>{if(!h.some(x=>x[0]===id))h.push([id,0,'R'])});
  C.ui.home=h;save('config');applyHome();applyHomeEdit();toast('내 배치로 돌렸어요')},true);

/* ================= 3단계 ① 보스 · 장비 상점 ================= */
/* ---- 12) 보스: 끊고 싶은 습관 이름 대신 추상적인 적 · 용기 = 치명타 · 처치하면 전용 장비 ---- */
var BOSS_OLD60={'무한 스크롤 슬라임':'망설임의 안개','야식 고블린':'무기력 늪지기'};
(function(){const R={'무한 스크롤 슬라임':['망설임의 안개','#8a7a9e'],'야식 고블린':['무기력 늪지기','#6b8e3a'],'불안 안개':['불안 안개','#a0623a']};BOSSES.forEach(b=>{const r=R[b[0]];if(r){b[0]=r[0];b[1]=r[1]}})})();
{const _ws60=weekState;weekState=function(k){const s=_ws60(k);try{let crit=0;weekEntries(k).forEach(({e})=>{if(isBrave(e)&&(e.xp||0)>0&&!['chest','boss','wbrave','badge','buy'].includes(e.kind))crit+=e.xp});
  if(crit){s.crit=crit;s.dmg+=crit;s.left=Math.max(0,s.hp-(s.dmg-s.heal));s.dead=s.dmg-s.heal>=s.hp}}catch(x){console.error(x)}return s}}

/* ---- 13) 장비 (투구·갑옷·무기·방패·피부·배경). 그림은 아바타와 같은 16칸 픽셀 ---- */
var GSLOT60=[['head','⛑ 투구'],['body','🛡 갑옷'],['weapon','🗡 무기'],['shield','🔰 방패'],['skin','🎨 피부'],['bg','🖼 배경']];
// at=[x,y]는 아바타 픽셀 기준 (머리 0~10줄, 몸 11~14줄, 오른손 13,13 · 왼손 3,13)
var GEAR60=[
  {id:'h-beret',slot:'head',name:'감독 베레모',price:40,at:[3,-1],rows:['....RRR....','..RRRRRRR..','.RRRRRRRRR.','RRRRRRRRRRR'],pal:{R:'#8e2f3c'}},
  {id:'h-flower',slot:'head',name:'들꽃 화관',price:60,at:[3,1],rows:['P.Y.P.Y.P.Y','GPGYGPGYGPG'],pal:{P:'#e889b0',Y:'#f2c230',G:'#4f8a3c'}},
  {id:'h-helm',slot:'head',name:'철 투구',price:90,at:[2,-1],rows:['....KKKKK....','..KKMMMMMKK..','.KMMMMMMMMMK.','KMMMMMMMMMMMK','KMMKKKKKKKMMK','KMK.......KMK','KMK.......KMK'],pal:{M:'#9aa0aa'}},
  {id:'h-crown',slot:'head',name:'작은 왕관',price:260,at:[4,-2],rows:['Y...Y...Y','YY.YRY.YY','YYYYYYYYY'],pal:{Y:'#e6b422',R:'#c2334a'}},
  {id:'b-leather',slot:'body',name:'가죽 갑옷',price:70,at:[4,11],rows:['NNNNYNNNN','NLNNYNNLN','..NNYNN..','..NNNNN..'],pal:{N:'#8a5a2b',L:'#a8733f',Y:'#d9a441'}},
  {id:'b-plate',slot:'body',name:'판금 갑옷',price:180,at:[4,11],rows:['MMMMYMMMM','MLMMYMMLM','..MMYMM..','..MMMMM..'],pal:{M:'#a7adb8',L:'#d6dae2',Y:'#e6b422'}},
  {id:'b-cape',slot:'body',name:'붉은 망토',price:120,at:[1,10],rows:['RR...........RR','R.............R','R.............R','RR...........RR','RR...........RR','.R...........R.'],pal:{R:'#a3303c'}},
  {id:'w-stick',slot:'weapon',name:'나무 막대',price:30,at:[13,7],rows:['.N','.N','.N','.N','.N','.N','NN'],pal:{N:'#8a5a2b'}},
  {id:'w-clap',slot:'weapon',name:'슬레이트 (클래퍼보드)',price:90,at:[12,8],rows:['KWKWK','KKKKK','KWWWK','KWKWK','KKKKK'],pal:{W:'#f4f4f4'}},
  {id:'w-sword',slot:'weapon',name:'용사의 검',price:110,at:[12,4],rows:['..L','.LG','.LG','.LG','.LG','.LG','YYYY','.R.','.R.'],pal:{L:'#eceff4',G:'#9aa3b2',Y:'#e6b422',R:'#6b3b1f'}},
  {id:'w-pen',slot:'weapon',name:'커다란 펜',price:140,at:[13,4],rows:['..Y','.YY','.KY','.KK','.KK','.KK','.KK','.GG','..G'],pal:{Y:'#e6b422',G:'#9aa3b2'}},
  {id:'s-wood',slot:'shield',name:'나무 방패',price:50,at:[0,10],rows:['.KKK.','KNNNK','KNYNK','KNNNK','.KNK.','..K..'],pal:{N:'#9a6a35',Y:'#d9a441'}},
  {id:'s-iron',slot:'shield',name:'철 방패',price:140,at:[0,10],rows:['.KKK.','KMMMK','KMRMK','KMMMK','.KMK.','..K..'],pal:{M:'#a7adb8',R:'#a3303c'}},
  {id:'s-reel',slot:'shield',name:'필름 릴 방패',price:160,at:[0,10],rows:['.KKK.','KGKGK','KKWKK','KGKGK','.KKK.'],pal:{G:'#6b6f7a',W:'#e6b422'}},
  {id:'sk-1',slot:'skin',name:'피부 · 밝은 살구',price:15,skin:'#f6d6b5'},
  {id:'sk-2',slot:'skin',name:'피부 · 구릿빛',price:15,skin:'#d79a6b'},
  {id:'sk-3',slot:'skin',name:'피부 · 짙은 갈색',price:15,skin:'#9a6440'},
  {id:'sk-4',slot:'skin',name:'피부 · 고블린 초록',price:60,skin:'#9cc47a'},
  {id:'bg-forest',slot:'bg',name:'숲속 공터',price:80,bg:'forest'},
  {id:'bg-sunset',slot:'bg',name:'노을 언덕',price:100,bg:'sunset'},
  {id:'bg-night',slot:'bg',name:'별밤',price:120,bg:'night'},
  {id:'bg-cinema',slot:'bg',name:'작은 영화관',price:150,bg:'cinema'},
  // 보스 전리품 (상점에서 안 팔아요)
  {id:'x-fogfeather',slot:'head',name:'안개를 걷은 깃털',drop:'망설임의 안개',at:[9,-3],rows:['..W','.WP','WP.','P..'],pal:{W:'#f4f4f4',P:'#b58ad0'}},
  {id:'x-giantbelt',slot:'body',name:'거인의 허리띠',drop:'미루기 괴물',at:[4,13],rows:['.NNNYNNN.'],pal:{N:'#5a3a22',Y:'#e6b422'}},
  {id:'x-golemfist',slot:'weapon',name:'골렘 주먹 망치',drop:'완벽주의 골렘',at:[12,5],rows:['MMMM','MMMM','.NN.','.N..','.N..','.N..','.N..'],pal:{M:'#7d8594',N:'#6b3b1f'}},
  {id:'x-swampshield',slot:'shield',name:'늪지기의 등껍질',drop:'무기력 늪지기',at:[0,10],rows:['.GGG.','GLGLG','GGLGG','GLGLG','.GGG.'],pal:{G:'#4f7a33',L:'#8db35d'}},
  {id:'x-calmcrown',slot:'head',name:'고요의 머리띠',drop:'불안 안개',at:[3,2],rows:['WWWWWWWWWWW'],pal:{W:'#e6b422'}},
  {id:'x-batcape',slot:'body',name:'박쥐 날개 망토',drop:'회피 박쥐',at:[0,10],rows:['KK.............KK','KPK...........KPK','KPPK.........KPPK','.KPK.........KPK.','..K...........K..'],pal:{P:'#7a4a8a'}}
];
function gearSt60(){const g=C.gear60||(C.gear60={own:[],eq:{},got:{}});g.own=g.own||[];g.eq=g.eq||{};g.got=g.got||{};return g}
function gear60(id){return GEAR60.find(x=>x.id===id)}
function bgSVG60(k){
  if(k==='forest')return `<rect width="24" height="26" fill="#d9e8c8"/><rect y="20" width="24" height="6" fill="#9cc47a"/>${[[1,9],[18,7],[21,11]].map(([x,y])=>`<path d="M${x+1.5} ${y} l2 4h-1l2 4h-6l2-4h-1z" fill="#4f7a33"/><rect x="${x+1}" y="${y+8}" width="1" height="2" fill="#6b3b1f"/>`).join('')}`;
  if(k==='sunset')return `<rect width="24" height="26" fill="#f6d39a"/><rect y="7" width="24" height="5" fill="#f2b27a"/><rect y="12" width="24" height="5" fill="#e48b6a"/><circle cx="18" cy="12" r="3" fill="#fbe7a1"/><rect y="19" width="24" height="7" fill="#9a6a8a"/>`;
  if(k==='night')return `<rect width="24" height="26" fill="#2e2742"/>${[[2,3],[7,1],[19,4],[22,9],[3,12],[16,2]].map(([x,y])=>`<rect x="${x}" y="${y}" width="1" height="1" fill="#f2c230"/>`).join('')}<circle cx="20" cy="5" r="2" fill="#f5edd0"/><rect y="21" width="24" height="5" fill="#3d3554"/>`;
  if(k==='cinema')return `<rect width="24" height="26" fill="#4a1f28"/><rect x="2" y="1" width="20" height="8" fill="#f4efe6"/><rect x="0" y="0" width="2" height="26" fill="#7a2a36"/><rect x="22" y="0" width="2" height="26" fill="#7a2a36"/>${[3,7,11,15,19].map(x=>`<rect x="${x}" y="22" width="3" height="2" fill="#7a2a36"/>`).join('')}`;
  return '';
}
function gearPx60(it,ox,oy){let s='';if(!it||!it.rows)return s;const pal={...BASEPAL,...(it.pal||{})};
  it.rows.forEach((row,y)=>{for(let x=0;x<row.length;x++){const ch=row[x];if(!ch||ch==='.')continue;s+=`<rect x="${x+it.at[0]+ox}" y="${y+it.at[1]+oy}" width="1.02" height="1.02" fill="${pal[ch]||'#888'}"/>`}});return s}
var GEAR_TRY60=null;
function spriteSVG(kind,mood,outfit,{level=1,fx=true,gear}={}){
  const sp=SPRITES[kind]||SPRITES.director,G=gear!==undefined?gear:((C&&C.gear60&&C.gear60.eq)||{});
  const eq={...G};if(GEAR_TRY60&&gear===undefined){const t=gear60(GEAR_TRY60);if(t)eq[t.slot]=t.id}
  const sk=eq.skin&&gear60(eq.skin),skin=sk&&['director','knight','warrior'].includes(kind)?{S:sk.skin}:{};
  const pal={...BASEPAL,...sp.pal,C:outfit,...skin};
  const ox=4,oy=3;let px='';
  sp.rows.forEach((row,y)=>{for(let x=0;x<16;x++){const ch=row[x];if(!ch||ch==='.')continue;px+=`<rect x="${x+ox}" y="${y+oy}" width="1.02" height="1.02" fill="${pal[ch]||'#888'}"/>`}});
  faceCells(mood,sp.eyes).forEach(([x,y,f])=>px+=`<rect x="${x+ox}" y="${y+oy}" width="1.02" height="1.02" fill="${f}"/>`);
  const gp=s=>gearPx60(eq[s]&&gear60(eq[s]),ox,oy);
  const cape=eq.body&&/cape$/.test(eq.body);
  px=(cape?gp('body'):'')+gp('shield')+px+(cape?'':gp('body'))+gp('head')+gp('weapon');
  const tier=Math.min(4,Math.floor((level-1)/5));
  let stage='';for(let i=0;i<tier;i++){const w=10+i*2;stage+=`<rect x="${12-w/2}" y="${24-tier+i}" width="${w}" height="1" fill="var(--glass)"/>`}
  let eff='';
  if(fx){
    if(mood==='happy')eff=[[2,5],[21,4],[20,13],[3,14]].map(([x,y],i)=>`<g class="tw" style="animation-delay:${i*.3}s"><rect x="${x}" y="${y-1}" width="1" height="3" fill="#f2c230"/><rect x="${x-1}" y="${y}" width="3" height="1" fill="#f2c230"/></g>`).join('');
    if(mood==='tired')eff=`<rect x="19" y="6" width="1" height="2" fill="#6f9dff"/><rect x="18.5" y="7" width="2" height="1" fill="#6f9dff"/>`;
    if(mood==='low')eff=`<g fill="#8b93a7"><rect x="6" y="0" width="12" height="1.5"/><rect x="5" y="1" width="14" height="1.5"/></g>`+[7,11,15].map((x,i)=>`<rect class="drop" style="animation-delay:${i*.35}s" x="${x}" y="2.6" width="1" height="1.5" fill="#6f9dff"/>`).join('');
  }
  const bg=eq.bg&&gear60(eq.bg);
  return `<svg viewBox="0 0 24 26" shape-rendering="crispEdges" role="img" aria-label="${esc(sp.name)} 아바타, ${MOOD_NAME[mood]}">${bg?bgSVG60(bg.bg):''}
    <ellipse cx="12" cy="${24.6-tier}" rx="7" ry=".8" fill="var(--track)"/>${eff}
    <g transform="translate(0 ${3-tier})"><g class="sp ${fx?mood:''}">${px}</g></g>${stage}</svg>`;
}
// 보스 전리품: 처치 기록이 있는 주마다 한 번
function bossDrops60(){
  if(!ready)return;const g=gearSt60();let got=null,ch=false;
  Object.keys(DAYS).forEach(k=>{(DAYS[k].entries||[]).forEach(e=>{if(e.kind!=='boss')return;const ws=weekStart(k);if(g.got[ws])return;
    let nm=String(e.name||'').replace(/^주간 보스 처치:\s*/,'');nm=BOSS_OLD60[nm]||nm;const it=GEAR60.find(x=>x.drop===nm);g.got[ws]=it?it.id:1;ch=true;
    if(it&&!g.own.includes(it.id)){g.own.push(it.id);got=it}})});
  if(ch)save('config');
  if(got)later(()=>popup('전리품','🎁',`보스를 쓰러뜨리고 <b>${esc(got.name)}</b>을(를) 얻었어요.<br><span class="muted">상점 → 아바타 장비에서 입어요.</span>`,'보스 전용 장비'));
}
function gearHTML60(){
  const g=gearSt60(),slot=ui.gs60||'head',tr=ui.gtry60&&gear60(ui.gtry60);
  GEAR_TRY60=tr?tr.id:null;
  const prev=spriteSVG(C.avatar.kind,'happy',C.avatar.outfit,{fx:false});GEAR_TRY60=null;
  const items=GEAR60.filter(x=>x.slot===slot&&(!x.drop||g.own.includes(x.id)));
  const locked=GEAR60.filter(x=>x.slot===slot&&x.drop&&!g.own.includes(x.id));
  const card=it=>{const own=g.own.includes(it.id),on=g.eq[it.slot]===it.id,eq={...g.eq,[it.slot]:it.id};
    return `<button class="gi60 ${on?'on':''} ${ui.gtry60===it.id?'try':''}" data-x60gtry="${it.id}" aria-pressed="${ui.gtry60===it.id}"><span class="gp60">${spriteSVG(C.avatar.kind,'ok',C.avatar.outfit,{fx:false,gear:eq})}</span><b>${esc(it.name)}</b><span class="tiny">${on?'✓ 입는 중':own?'가진 것':it.drop?'🎁 전리품':'💰'+it.price}</span></button>`};
  let act='';if(tr){const own=g.own.includes(tr.id),on=g.eq[tr.slot]===tr.id;
    act=on?`<button class="btn ghost sm" data-x60goff="${tr.slot}">벗기</button>`:own?`<button class="btn sm" data-x60gon="${tr.id}">입기</button>`:`<button class="btn sm" data-x60gbuy="${tr.id}" ${P.gold<tr.price||!ready?'disabled':''}>${P.gold<tr.price?'💰'+(tr.price-P.gold)+' 부족':'💰'+tr.price+'에 사서 입기'}</button>`}
  return `<div class="ptitle"><h2>🛡 아바타 장비</h2><span class="pill g num">💰${P.gold.toLocaleString()}</span></div>
  <div class="gear60"><div class="gprev60"><div class="gbig60">${prev}</div><div class="tiny muted" style="text-align:center">${tr?`입어보는 중: <b>${esc(tr.name)}</b>`:'아래에서 눌러 입어 보세요'}</div><div class="row" style="gap:6px;justify-content:center;margin-top:6px">${act}${tr?'<button class="btn ghost sm" data-x60gtry="">그만 입어보기</button>':''}</div>
    <div class="tiny muted" style="margin-top:8px">입은 것: ${GSLOT60.map(([s,l])=>{const it=g.eq[s]&&gear60(g.eq[s]);return it?`${l.split(' ')[0]} ${esc(it.name)}`:''}).filter(Boolean).join(' · ')||'아직 없어요'}</div></div>
  <div><div class="seg3" style="flex-wrap:wrap">${GSLOT60.map(([s,l])=>`<button data-x60gs="${s}" aria-pressed="${slot===s}">${l}</button>`).join('')}</div>
    <div class="glist60">${items.map(card).join('')||'<div class="empty">아직 없어요.</div>'}</div>
    ${locked.length?`<p class="tiny muted" style="margin:6px 0 0">🔒 보스 전리품 ${locked.length}개: ${locked.map(x=>`'${esc(x.drop)}'`).join(', ')}을(를) 쓰러뜨리면 떨어져요.</p>`:''}</div></div>
  <p class="help" style="margin-top:8px">골드는 현실 보상에도 쓰는 돈이에요. 장비는 한 번 사면 계속 갖고, 언제든 바꿔 입어요. ⚔ 용기 기록은 보스에게 치명타(XP만큼 한 번 더)예요. 직접 그린 장비는 다음 단계에서 만들 수 있게 할게요.</p>`;
}
function renderGear60(){const v=document.querySelector('.view[data-view="shop"]');if(!v)return;let b=$('gear60');if(!b){b=document.createElement('div');b.id='gear60';b.className='panel';v.insertBefore(b,v.firstChild)}b.innerHTML=gearHTML60()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-x60gtry],[data-x60gs],[data-x60gon],[data-x60goff],[data-x60gbuy]');if(!b)return;e.preventDefault();e.stopPropagation();const d=b.dataset,g=gearSt60();
  if(d.x60gs!=null){ui.gs60=d.x60gs;ui.gtry60=null}
  else if(d.x60gtry!=null)ui.gtry60=d.x60gtry||null;
  else if(d.x60goff){delete g.eq[d.x60goff];ui.gtry60=null;save('config');render()}
  else if(d.x60gon){const it=gear60(d.x60gon);if(it&&g.own.includes(it.id)){g.eq[it.slot]=it.id;ui.gtry60=null;save('config');render();toast(`'${it.name}' 입었어요`)}}
  else if(d.x60gbuy){if(!guard())return;const it=gear60(d.x60gbuy);if(!it||it.drop||g.own.includes(it.id)||P.gold<it.price)return;ui.off=0;
    commit(()=>applyEntry(today(),{kind:'buy',type:'buy',name:'장비: '+it.name,gold:-it.price,xp:0}));g.own.push(it.id);g.eq[it.slot]=it.id;ui.gtry60=null;save('config');render();popup('장비 획득','🛡',`<b>${esc(it.name)}</b>을(를) 샀어요.<br><span class="muted">바로 입었어요.</span>`,'−💰'+it.price)}
  renderGear60()},true);

/* ---- 그리기 ---- */
{const _r60=render;render=function(){try{rollQ60()}catch(e){console.error(e)}_r60.apply(this,arguments);try{if(QA60)setupQA60();if(ready&&tasksReady&&QAQ60.length){const q=QAQ60.splice(0);setTimeout(()=>q.forEach(f=>f()),0)}bossDrops60();if(curView()==='shop')renderGear60();
  if(ready&&C.gacha&&Array.isArray(C.gacha.presets)&&!C.eff60){C.eff60=1;C.gacha.presets.forEach(p=>{if(p.name==='⚡ 퀵 3장')p.name='🍃 짧은 일 3장'});save('config')}}catch(e){console.error(e)}}}
addEventListener('hashchange',()=>setTimeout(()=>{try{if(curView()==='shop')renderGear60()}catch(e){console.error(e)}},0));
if(QA60)setTimeout(()=>{try{setupQA60()}catch(e){console.error(e)}},0);
