/* ================= v5.7: 홈 숨김·위아래 · 할 일 상세 다듬기 · 행동/습관 이름 · 목록 칩 ================= */

/* ---- 홈: 숨김이 '배치 끝'에서 바로 반영되게 + ↑↓ 한 칸씩 ---- */
function homeEditOn(on){document.body.classList.toggle('homeedit',on);ui.homeEdit=on;applyHome();applyHomeEdit();toast(on?'⋮⋮로 끌거나 ↑↓·⇠⇢로 옮기고, 👁로 숨겨요. 다 하면 "배치 끝"':'배치를 저장했어요')}
function applyHomeEdit(){
  const two=homeTwo();
  document.querySelectorAll('#homeGrid .hblock').forEach(el=>{const id=el.dataset.hid;el.dataset.rowid=id;
    let h=el.querySelector(':scope>.hedit');
    if(ui.homeEdit){if(!h){h=document.createElement('div');h.className='hedit';el.prepend(h)}
      const it=C.ui.home.find(x=>x[0]===id)||[0,1,'L'];const on=it[1];
      const sib=C.ui.home.filter(x=>!two||x[2]===it[2]),k=sib.indexOf(it);
      h.innerHTML=`<span class="hand" data-drag="row:${id}" data-dragmode="now" aria-label="끌어서 옮기기">⋮⋮</span><b>${esc(HOME_BLOCKS[id]||id)}</b>
        <button class="x" data-x57hmv="${id}" data-d="-1" ${k<=0?'disabled':''} title="한 칸 위로" aria-label="한 칸 위로">↑</button><button class="x" data-x57hmv="${id}" data-d="1" ${k>=sib.length-1?'disabled':''} title="한 칸 아래로" aria-label="한 칸 아래로">↓</button>
        ${two?`<button class="x" data-x56hcol="${id}" title="${it[2]==='R'?'왼쪽 단으로':'오른쪽 단으로'}" aria-label="다른 단으로">${it[2]==='R'?'⇠':'⇢'}</button>`:''}
        <button class="x hvis57" data-hvis="${id}" aria-pressed="${!on}" aria-label="${on?'숨기기':'보이기'}" title="${on?'숨기기':'다시 보이기'}">${on?'👁 보임':'🚫 숨김'}</button>`;
      el.hidden=false;el.classList.toggle('hoff',!on)}
    else{if(h)h.remove();el.classList.remove('hoff')}});
  ['hcolL','hcolR'].forEach(k=>{const c=$(k);if(c)c.dataset.drop=ui.homeEdit&&two?'reorder:home':''});
  const g=$('homeGrid');if(g)g.dataset.drop=ui.homeEdit&&!two?'reorder:home':'';
  const hb=$('homeEditBtn');if(hb)hb.textContent=ui.homeEdit?'✓ 배치 끝':'✎ 홈 배치';
  const hp=$('homePresets');if(hp)hp.hidden=!ui.homeEdit;
}
function homeMove(id,d){
  const two=homeTwo(),arr=C.ui.home,it=arr.find(x=>x[0]===id);if(!it)return;
  const sib=arr.filter(x=>!two||x[2]===it[2]),k=sib.indexOf(it),o=sib[k+d];if(!o)return;
  const i=arr.indexOf(it),j=arr.indexOf(o);[arr[i],arr[j]]=[arr[j],arr[i]];save('config');applyHome();applyHomeEdit();
  const el=document.querySelector(`#homeGrid [data-hid="${id}"]`);if(el&&el.scrollIntoView)el.scrollIntoView({block:'nearest'});
}

/* ---- 이름: 습관 모음 → 행동/습관 ---- */
(function(){const n=NAV_ITEMS.find(x=>x[0]==='log');if(n){n[1]='행동/습관';n[2]='행동 기록·🔁 습관·용기 · 식사·몸무게'}})();

/* ---- 할 일 상세: 칩 (💭 문구 칩 따로, ⋯는 필요할 때만) ---- */
var TS_PANEL_NAME={when:'📅 날짜 · 시간 · 반복',card:'🃏 행동 카드',tags:'# 태그',area:'🧭 영역 · 구슬',list:'📂 목록',prio:'⚑ 중요도',size:'크기(보상) · 용기',timer:'⏱ 타이머',rf:'💭 하기 싫을 때 읽을 문구',more:'⋯ 칸 · 기록'};
function tsChipsHTML(t){
  const P=ui.tsPanel||'',ar=C.areas.find(x=>x.id===areaOfTask(t)),card=t.aid&&C.actions.find(x=>x.id===t.aid);
  const pr=PRIOS.find(x=>x[0]===(t.prio||0))||PRIOS[0],ef=EFFORTS.find(x=>x[0]===effortOf(t))||EFFORTS[1];
  const ch=(k,txt,on,tip)=>`<button class="tch ${on?'':'off'}" data-x56panel="${k}" aria-pressed="${P===k}" aria-expanded="${P===k}" title="${esc(tip)}">${txt}</button>`;
  const rf=(t.reframe||'').trim();
  return `<div class="tchips">
    ${ch('when',`📅 ${t.due?esc(dueLabel(t.due)):'날짜'}${t.time?' '+esc(ampm(t.time)):''}${t.rep?' · 🔁 '+esc(repLabel(t.rep)):''}${t.deadline?' · ⏳ '+esc(dueLabel(t.deadline)):''}`,t.due||t.rep||t.deadline,'날짜 · 마감 · 시간 · 반복 · 점검일')}
    ${ch('card',`🃏 ${card?esc(card.name):'행동 카드'}${t.hab&&t.quest?' · ☑ 일퀘':''}`,card,'행동 카드 연결 (점수가 카드에서 나와요)')}
    ${ch('tags',(t.tags||[]).length?t.tags.map(x=>'#'+esc(x)).join(' '):'# 태그',(t.tags||[]).length,'태그')}
    ${ch('area',`🧭 ${ar?esc(ar.name):'영역'}${t.area?'':' <small>(자동)</small>'}`,ar,'컨디션 영역 · 구슬')}
    ${ch('list',`📂 ${esc(listName(t.list||'inbox'))}`,t.list&&t.list!=='inbox','목록')}
    ${ch('prio',`⚑ ${pr[2]||'중요도'}`,t.prio,'중요도')}
    ${ch('size',`${esc(ef[1])}${t.brave?' · ⚡ 용기':''}`,true,'크기(보상) · 용기')}
    ${ch('timer',`⏱ ${t.dur?durTxt(t.dur):'타이머'} · ${t.tmode==='speed'?'빠를수록':'시간 안에'}`,t.dur,'타이머 목표·방식')}
    ${ch('rf',rf?`💭 ${esc(rf.length>16?rf.slice(0,16)+'…':rf)}`:'💭 문구',rf,'하기 싫을 때 읽을 문구')}
    ${(t.sec||(t.hist&&t.hist.n)||t.skull)?ch('more','⋯ 기록',true,'칸 · 틱틱 기록 · 미룬 횟수'):''}
  </div><div class="tpanels"></div>`;
}
{const _rs=tsRestyle;tsRestyle=function(){_rs();try{tsPolish()}catch(e){console.error(e)}}}
function tsPolish(){
  const sc=$('sheetC'),t=TASKS[sheetCtx&&sheetCtx.task];if(!t||!$('tsTitle'))return;
  const pan=sc.querySelector('.tpanels');if(!pan)return;const P=ui.tsPanel||'';
  const panel=k=>pan.querySelector(`.tpanel[data-p="${k}"]`);
  // 💭 문구: details 껍데기 빼고 따로 칸으로
  const rfa=$('tsReframe');
  if(rfa){let d=panel('rf');if(!d){d=document.createElement('div');d.className='tpanel';d.dataset.p='rf';const m=panel('more');m?pan.insertBefore(d,m):pan.appendChild(d)}
    const det=rfa.closest('details');rfa.rows=3;d.appendChild(rfa);if(det)det.remove();
    d.insertAdjacentHTML('beforeend','<p class="tiny muted" style="margin:0">하기 싫을 때 목록의 💭를 누르면 보여요. 미래의 나에게 남기는 한 마디.</p>')}
  // 날짜·마감 한 줄, '날짜 없음' 빼기 (날짜 옆 ✕로 지워요)
  const w=panel('when');
  if(w){const a=$('tsDue')&&$('tsDue').closest('label'),b=$('tsDl')&&$('tsDl').closest('label');
    if(a&&b){const row=document.createElement('div');row.className='duedl';a.before(row);row.appendChild(a);row.appendChild(b);a.firstChild&&a.firstChild.nodeType===3&&(a.firstChild.textContent='📅 날짜 ');}
    const nd=w.querySelector('[data-tsdue=""]');if(nd)nd.remove()}
  // ⋯ 칸: 비면 숨기기
  const m=panel('more');if(m&&!m.querySelector('input,textarea,p'))m.remove();
  // 칸 머리 (어느 칩이 펼쳐졌는지 글자로도)
  pan.querySelectorAll('.tpanel').forEach(d=>{const k=d.dataset.p;d.hidden=P!==k;if(d.querySelector(':scope>.tph'))return;
    d.insertAdjacentHTML('afterbegin',`<div class="tph"><b>${TS_PANEL_NAME[k]||''}</b><button class="x" data-x56panel="${k}" aria-label="접기" title="접기">▴ 접기</button></div>`)});
  // 행동 카드 칸: 리듬(반복 할 일)인지 보이기
  const cp=panel('card');if(cp&&t.aid){const a=C.actions.find(x=>x.id===t.aid);if(a)cp.insertAdjacentHTML('beforeend',habInfoHTML(t,a))}
  // 체크리스트: '+' 눌러도 추가
  const sf=sc.querySelector('form[data-tssubadd]');if(sf){const last=sf.lastElementChild;if(last&&last.tagName==='SPAN'){const bt=document.createElement('button');bt.type='submit';bt.className='x';bt.textContent='추가';bt.setAttribute('aria-label','체크리스트에 추가');last.replaceWith(bt)}
    const inp=$('tsSubNew');if(inp)inp.placeholder='체크리스트 추가 (Enter)'}
  // 아래 버튼: 삭제 · 안 하기 · 미루기(날짜 고르기)
  const del=sc.querySelector('[data-tsact="del"]');if(del)del.textContent='🗑 삭제';
  const dr=sc.querySelector('[data-tsact="drop"]');if(dr){dr.textContent='안 하기';dr.title='할 일을 그만둬요 (목록의 \'하지 않음\'에 남아요)'}
  const tm=sc.querySelector('[data-tsact="tomorrow"]');
  if(tm){tm.textContent='미루기 ▾';tm.removeAttribute('data-tsact');tm.dataset.x57pp='open';tm.setAttribute('aria-expanded',String(!!ui.ppOpen));
    const bar=tm.closest('.row').parentElement;const td=dateKey(),base=t.due&&t.due>td?t.due:td;
    const wkend=(()=>{let d=addDays(weekStart(td),5);return d<=td?addDays(d,7):d})();
    const opts=[['내일',addDays(td,1)],['모레',addDays(td,2)],['주말',wkend],['다음 주',addDays(weekStart(td),7)],['+1주',addDays(base,7)]];
    const box=document.createElement('div');box.className='pp57';box.hidden=!ui.ppOpen;
    box.innerHTML=`<span class="small muted">언제로 미룰까요?</span>${opts.map(([l,k])=>`<button class="chipbtn" data-x57pp="${k}" title="${esc(fmtD(k))}">${l} <small class="muted">${esc(fmtD(k))}</small></button>`).join('')}<input type="date" id="x57PpDate" min="${addDays(td,1)}" aria-label="날짜 골라 미루기">${t.skull?`<span class="tiny" style="color:var(--bad)">${'☠'.repeat(Math.min(3,t.skull))} 지금까지 ${t.skull}번 미룸</span>`:''}`;
    bar.appendChild(box)}
}
function habInfoHTML(t,a){
  if(!t.hab||!t.rep)return `<p class="tiny muted" style="margin:0">점수는 '${esc(a.name)}' 카드에서 나와요.${t.rep?' 이 반복 할 일을 카드의 🔁 리듬으로 삼으려면 아래를 눌러요.':''}</p>${t.rep&&!habT(a)?`<button class="btn ghost sm" data-x57mkhab="${t.id}">🔁 '${esc(a.name)}' 카드의 리듬으로</button>`:''}`;
  const daily=t.rep.f==='d'&&(+t.rep.i||1)===1;
  return `<div class="habinfo"><span class="small">🔁 <b>'${esc(a.name)}' 카드의 리듬</b>이에요. 반복은 여기(📅 칩)에서만 정해요.</span>
    <label class="row small" style="gap:6px"><input type="checkbox" data-x57quest="${t.id}" ${t.quest?'checked':''} style="width:auto"> ☑ 일퀘로 (그날 일퀘를 다 끝내면 상자)${daily?'':' — 반복하는 날에만 일퀘로 떠요'}</label></div>`;
}

/* ---- 행동/습관 목록에도 칩 요약 ---- */
function logChips(){
  const box=$('actGroups');if(!box)return;const show=aeShow().filter(k=>k!=='n30'&&!((C.ui.list||{}).group==='area'&&k==='area'));
  box.querySelectorAll('.act[data-info^="act:"]').forEach(r=>{const a=C.actions.find(x=>x.id===r.dataset.info.slice(4));const ab=r.querySelector('.ab');if(!a||!ab||ab.querySelector('.mxs'))return;
    const h=metaChips(a,null,show);if(h)ab.insertAdjacentHTML('beforeend',`<span class="mxs">${h}</span>`);
    const pb=r.querySelector('.pinb');if(pb&&C.mig57){const on=!!habT(a);pb.textContent='🔁';pb.classList.add('rh57b');pb.classList.toggle('on',on);pb.setAttribute('aria-pressed',String(on));pb.title=on?'리듬 풀기 (오늘에 안 뜸)':"매일 '오늘'에 띄우기 (리듬)";pb.setAttribute('aria-label',a.name+(on?' 리듬 풀기':' 매일 리듬으로'))}});
}

/* ---- 이벤트 ---- */
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-x57hmv],[data-x57pp],[data-x57quest],[data-x57mkhab]');if(!b)return;const d=b.dataset;
  if(d.x57hmv){e.preventDefault();e.stopPropagation();homeMove(d.x57hmv,+d.d);return}
  if(d.x57pp){e.preventDefault();e.stopPropagation();
    if(d.x57pp==='open'){ui.ppOpen=!ui.ppOpen;const bx=document.querySelector('#sheetC .pp57');if(bx)bx.hidden=!ui.ppOpen;b.setAttribute('aria-expanded',String(ui.ppOpen));return}
    const t=tsRead();if(!t)return;ui.ppOpen=false;closeSheet();postpone(t,d.x57pp);return}
  if(d.x57mkhab){e.preventDefault();e.stopPropagation();const t=tsRead();if(!t)return;const a=C.actions.find(x=>x.id===t.aid);if(!a)return;t.hab=1;saveTask(t);tsRedraw();render();toast(`'${a.name}' 카드의 🔁 리듬이 됐어요`);return}
},true);
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.id==='tsSubNew'){e.stopPropagation();return} // Enter 전에 시트가 다시 그려져 입력이 사라지던 문제
  if(t.id==='x57PpDate'){e.stopPropagation();if(!t.value)return;const k=tsRead();if(!k)return;ui.ppOpen=false;closeSheet();postpone(k,t.value);return}
  if(t.dataset&&t.dataset.x57quest){e.stopPropagation();const k=tsRead();if(!k)return;if(t.checked)k.quest=1;else delete k.quest;saveTask(k);syncDailies(C);save('config');tsRedraw();render();toast(k.quest?'☑ 일퀘가 됐어요':'일퀘에서 뺐어요');return}
},true);
{const _ot=openTaskSheet;openTaskSheet=function(...r){ui.ppOpen=false;return _ot(...r)}}

/* ================= 반복과 리듬 하나로: 반복(언제 뜨나)은 할 일에만, 카드는 점수만 =================
   카드의 🔁 리듬 = 그 카드에 연결된 반복 할 일 하나(t.hab). 일퀘 = 매일 반복 + t.quest.
   카드를 직접 기록해도 그날의 리듬 할 일이 같이 끝나요(중복 없음). 놓친 날은 쌓이지 않고 오늘로 넘어와요. */
var HAB_LIST='Lhabit';
function habT(a){if(!a)return null;for(const k in TASKS){const t=TASKS[k];if(t&&t.hab&&t.aid===a.id&&t.status===0&&t.rep&&t.rep.f)return t}return null}
function habList(){if(!C.lists.some(l=>l.id===HAB_LIST)){C.lists.push({id:HAB_LIST,name:'🔁 습관',area:'',folder:''});save('config')}return HAB_LIST}
function doneToday(a){const d=DAYS[dateKey()];return !!(d&&(d.entries||[]).some(e=>e.kind==='act'&&e.aid===a.id))}
function habDue(a,rep){const td=dateKey();let d=firstDue(rep,td);if(d===td&&doneToday(a))d=nextDue(rep,td)||d;return d}
function setRhythm(a,rep,opt={}){
  let t=habT(a);
  if(!rep){if(t){deleteTask(t.id)}syncDailies(C);save('config');return null}
  if(!t){t=newTask({title:a.name,aid:a.id,list:habList(),rep});t.hab=1;if(a.qid)t.qid=a.qid}
  else t.rep=rep;
  t.due=habDue(a,rep);delete t.skull;
  if(opt.quest!==undefined){if(opt.quest)t.quest=1;else delete t.quest}
  saveTask(t);syncDailies(C);save('config');return t;
}
function rhythmText(t){if(!t)return '';const r=t.rep;if(r.f==='d'&&(+r.i||1)===1)return t.quest?'☑ 매일 · 일퀘':'🔁 매일';if(r.f==='w'&&(+r.i||1)===1&&(r.wd||[]).length)return '🔁 '+[1,2,3,4,5,6,0].filter(w=>r.wd.includes(w)).map(w=>WDK[w]).join('');return '🔁 '+repLabel(r)}
function isHabit(a){if(!a)return false;if(!C.mig57)return !!(a.daily||(a.wd||[]).length||a.pin);return !!habT(a)}
function rhythmOf(a){if(!C.mig57){if(a.daily)return '☑ 매일';if((a.wd||[]).length)return '📅 '+[1,2,3,4,5,6,0].filter(w=>a.wd.includes(w)).map(w=>WDK[w]).join('');if(a.pin)return '📌 고정';return ''}return rhythmText(habT(a))}
// 옛 화면 코드가 읽는 a.daily·a.wd·a.pin은 할 일에서 비춰만 줌(저장 안 됨)
function habMirror(){
  if(!C.mig57||!tasksReady)return;
  C.actions.forEach(a=>{
    const leg=['daily','wd','pin'].some(k=>{const d=Object.getOwnPropertyDescriptor(a,k);return d&&d.enumerable});
    if(leg){habMigCard(a);['daily','wd','pin'].forEach(k=>delete a[k]);save('config')}
    const t=habT(a),r=t&&t.rep,daily=r&&r.f==='d'&&(+r.i||1)===1;
    const def=(k,v)=>Object.defineProperty(a,k,{value:v,writable:true,configurable:true,enumerable:false});
    def('daily',daily&&t.quest?1:undefined);def('pin',daily&&!t.quest?1:undefined);def('wd',r&&r.f==='w'?(r.wd||[]).slice():undefined);
  });
}
function habMigCard(a){
  if(a.type!=='good'||(a.once&&a.doneAt)||habT(a))return false;
  const wd=(a.wd||[]).filter(x=>x>=0&&x<=6);let rep=null,quest=false;
  if(a.daily){rep={f:'d',i:1};quest=true}else if(a.pin)rep={f:'d',i:1};else if(wd.length)rep={f:'w',i:1,wd};
  if(!rep)return false;
  const t=newTask({title:a.name,aid:a.id,list:habList(),rep});t.hab=1;t.qid=a.qid||('q'+a.id);if(quest)t.quest=1;t.due=habDue(a,rep);saveTask(t);return true;
}
function mig57(){
  if(C.mig57||!ready||!tasksReady)return;
  let n=0;C.actions.forEach(a=>{if(habMigCard(a))n++;delete a.daily;delete a.pin;delete a.wd});
  C.mig57=1;save('config');syncDailies(C);
  later(()=>toast(n?`v5.7 · 리듬 있던 카드 ${n}개를 '🔁 습관' 목록의 반복 할 일로 옮겼어요`:'v5.7 · 반복은 이제 할 일에서만 정해요',6000));
}
{const _sd=syncDailies;syncDailies=function(c){
  if(!c||!c.mig57)return _sd(c);
  if(!tasksReady)return;
  const out=[];Object.values(TASKS).filter(t=>t.hab&&t.quest&&t.status===0&&t.rep&&t.rep.f==='d').sort((x,y)=>(x.order||0)-(y.order||0)).forEach(t=>{
    const a=(c.actions||[]).find(x=>x.id===t.aid);if(!a||a.type!=='good'||(a.once&&a.doneAt))return;
    out.push({id:t.qid||('q'+t.id),name:a.name,action:a.link||a.id,xp:0,gold:0,tid:t.id})});
  c.dailies=out}}
// 놓친 날은 쌓지 않고 다음 날로 (미룬 횟수 ☠도 안 붙음)
function habRoll(){
  if(!C.mig57||!tasksReady)return;const td=dateKey();
  Object.values(TASKS).forEach(t=>{if(!(t.hab&&t.status===0&&t.rep&&t.due&&t.due<td))return;const a=C.actions.find(x=>x.id===t.aid);
    const nd=a?habDue(a,t.rep):firstDue(t.rep,td);if(nd&&nd!==t.due){t.due=nd;delete t.skull;saveTask(t)}});
}
// 카드를 그냥 기록해도 그날 리듬 할 일이 끝나요 (되돌리면 다시 열림)
function habAuto(day,e){
  if(!C.mig57||e.tid||!day||day.date!==dateKey())return;
  let t=null;
  if(e.kind==='act'&&e.aid&&e.type==='good'){const a=C.actions.find(x=>x.id===e.aid);t=a&&habT(a)}
  else if(e.kind==='quest'&&e.qid){t=Object.values(TASKS).find(x=>x.hab&&x.status===0&&x.rep&&(x.qid||('q'+x.id))===e.qid&&((C.actions.find(y=>y.id===x.aid)||{}).link))}
  if(!t||!t.due||t.due>day.date)return;
  e.tid=t.id;e.prevDue=t.due;e.prevStatus=0;e.prevCnt=t.cnt||0;
  t.cnt=(t.cnt||0)+1;t.last=day.date;let nx=nextDue(t.rep,t.due);while(nx&&nx<=day.date)nx=nextDue(t.rep,nx);
  if(nx)t.due=nx;else{t.status=2;t.doneAt=day.date}saveTask(t);
}
{const _ae=applyEntry;applyEntry=function(day,e){const r=_ae(day,e);try{habAuto(day,e)}catch(x){console.error(x)}return r}}
{const _ue=unapplyEntry;unapplyEntry=function(day,e){_ue(day,e);try{if(e.kind==='quest'&&e.tid)undoTaskFrom(e)}catch(x){console.error(x)}}}
// 오늘: '습관' 줄은 방치 경보만 (리듬은 할 일로 떠요)
{const _th=todayHabits;todayHabits=function(){
  if(!C.mig57)return _th();
  const k=dateKey(),day=DAYS[k]||{entries:[]},out=[],skip=todayTaskAids();
  C.watches.forEach(w=>{const a=C.actions.find(x=>x.id===w.action);if(!a||!w.days||a.type!=='good'||skip.has(a.id))return;const s=daysSince(w.action,addDays(k,-1))+1;if(s>=w.days&&!out.some(x=>x.a===a))out.push({a,why:[s>w.days?`⚠ ${s}일째 안 함`:`⏳ ${s}일째 · 오늘이 기한`]})});
  return out.map(x=>{const es=(day.entries||[]).filter(e=>e.kind==='act'&&e.aid===x.a.id);return{...x,n:es.length,last:es[es.length-1]}});
}}
{const _thh=todayHabitsHTML;todayHabitsHTML=function(){
  if(!C.mig57)return _thh();
  const keep=C.dailies;C.dailies=[];let h='';try{h=_thh()}finally{C.dailies=keep}
  return h.replace('🔁 오늘의 습관','⚠ 오래 안 한 행동').replace('습관 모음 →','행동/습관 →');
}}
// 할 일 줄: 리듬 할 일 표시 · 연결 카드(몸무게·식사)는 그 기록으로
{const _tr=taskRow;taskRow=function(t,o={}){let h=_tr(t,o);
  if(t.hab&&t.rep&&C.mig57){const tag=t.quest?'<span class="qtag" title="일퀘 · 다 끝내면 상자">☑ 일퀘</span>':'';const a=C.actions.find(x=>x.id===t.aid);
    const ln=a&&a.link?`<span class="tiny">${esc(linkName(a.link))}</span>`:'';
    if(tag||ln)h=h.replace(/(<span class="tm">)/,`$1${tag}${ln}`);h=h.replace(`<span>${esc(listName(HAB_LIST))}</span>`,'')}
  return h}}
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-tdone]');if(!b||!C.mig57)return;const t=TASKS[b.dataset.tdone];if(!t||!t.hab||t.status!==0)return;
  const a=C.actions.find(x=>x.id===t.aid);if(!a||!a.link)return;e.preventDefault();e.stopPropagation();linkGo(a);
},true);

/* ---- 카드 편집: 리듬 칸 = 연결된 반복 할 일 창구 ---- */
function rhythmEditHTML(a){
  const t=habT(a),r=t&&t.rep,kind=!r?'':r.f==='d'&&(+r.i||1)===1?'d':r.f==='w'&&(+r.i||1)===1?'w':'x';
  return `<h3 style="font-size:15px;margin:0 0 4px">🔁 리듬 · 언제 '오늘'에 뜨나</h3>
  <p class="tiny muted" style="margin:0">리듬은 이 카드에 이어진 <b>반복 할 일</b> 하나로 저장돼요. 오늘 목록엔 그 할 일만 떠요(두 번 뜨지 않아요). 하루 여러 번 하는 건 리듬 없이 그때그때 기록해요. 리듬은 바로 저장돼요.</p>
  <div class="seg" style="margin-top:6px">${[['','없음'],['d','매일'],['w','요일 고르기'],['x','다른 반복…']].map(([k,l])=>`<button data-x57rh="${k}" aria-pressed="${kind===k}">${l}</button>`).join('')}</div>
  ${kind==='w'?`<div class="wdays" style="margin-top:6px">${[1,2,3,4,5,6,0].map(w=>`<button data-x57wd="${w}" aria-pressed="${(r.wd||[]).includes(w)}">${WDK[w]}</button>`).join('')}</div>`:''}
  ${kind?`<label class="row small" style="gap:6px;margin-top:6px"><input type="checkbox" data-x57aq="1" ${t.quest?'checked':''} style="width:auto"> ☑ 일퀘로 (${kind==='d'?'매일':'반복하는 날에만'} · 그날 일퀘를 다 끝내면 상자)</label>`:''}
  ${t?`<div class="row small" style="gap:6px;margin-top:6px"><span class="muted">${esc(rhythmText(t))} · 다음 ${esc(dueLabel(t.due))}${t.cnt?` · 지금까지 ${t.cnt}번`:''}</span><button class="btn ghost sm" data-x56open="${t.id}">할 일 열기 ↗</button></div>`:''}`;
}
{const _oae=openActionEditor;openActionEditor=function(id){_oae(id);try{
  if(!C.mig57)return;const a=C.actions.find(x=>x.id===id);const old=document.querySelector('#sheetC [data-aedaily]');
  const box=old&&old.closest('.links');if(a&&box){box.innerHTML=rhythmEditHTML(a);box.classList.add('rh57')}}catch(e){console.error(e)}}}
function aeRe(){const y=$('sheetC').scrollTop;openActionEditor(sheetCtx.aedit);$('sheetC').scrollTop=y;render()}
document.addEventListener('click',e=>{
  if(!C.mig57)return;
  const b=e.target.closest('[data-x57rh],[data-x57wd],[data-x55daily],[data-aedaily],[data-aewd],[data-aepin],[data-pin],[data-dlyon],[data-dlyoff],[data-dlyadd],[data-x55="daily1"],[data-x55="daily0"]');if(!b)return;
  const d=b.dataset,stop=()=>{e.preventDefault();e.stopPropagation()};
  const cur=()=>C.actions.find(x=>x.id===(sheetCtx||{}).aedit);
  if(d.x57rh!=null){stop();const a=cur();if(!a)return;const t=habT(a),td=dateKey();
    if(d.x57rh==='')setRhythm(a,null);
    else if(d.x57rh==='d')setRhythm(a,{f:'d',i:1});
    else if(d.x57rh==='w')setRhythm(a,{f:'w',i:1,wd:t&&t.rep.f==='w'&&(t.rep.wd||[]).length?t.rep.wd:[dowOf(td)]});
    else{const k=t||setRhythm(a,{f:'d',i:1});ui.tsPanel='when';openTaskSheet(k.id);return}
    aeRe();toast(d.x57rh===''?'리듬을 없앴어요 (연결된 반복 할 일을 지웠어요)':'리듬을 정했어요 · 🔁 습관 목록에 반복 할 일로 있어요');return}
  if(d.x57wd!=null){stop();const a=cur(),t=a&&habT(a);if(!t)return;const w=+d.x57wd;let wd=(t.rep.wd||[]).slice();wd=wd.includes(w)?wd.filter(x=>x!==w):[...wd,w];if(!wd.length)wd=[w];setRhythm(a,{...t.rep,wd});aeRe();return}
  if(d.x55daily){stop();const a=C.actions.find(x=>x.id===d.x55daily);if(!a)return;const t=habT(a);
    if(t&&t.quest){setRhythm(a,null);toast(`'${a.name}' 매일(일퀘)을 껐어요`)}else{setRhythm(a,{f:'d',i:1},{quest:1});toast(`'${a.name}' 매일 · ☑ 일퀘로 켰어요`)}reEdit();render();return}
  if(d.aedaily){stop();const a=cur();if(!a)return;const t=habT(a);if(t&&t.quest)setRhythm(a,null);else setRhythm(a,{f:'d',i:1},{quest:1});aeRe();return}
  if(d.aewd!=null||d.aepin){stop();return}
  if(d.pin){stop();const a=C.actions.find(x=>x.id===d.pin);if(!a)return;const t=habT(a);
    if(t){setRhythm(a,null);toast(`'${a.name}' 리듬을 풀었어요`)}else{setRhythm(a,{f:'d',i:1});toast(`🔁 '${a.name}' 매일 '오늘'에 떠요 (🔁 습관 목록)`)}render();return}
  if(d.dlyoff){stop();const a=C.actions.find(x=>x.id===d.dlyoff);if(!a)return;const t=habT(a);if(t){delete t.quest;saveTask(t);syncDailies(C);save('config')}reEdit();return}
  if(d.dlyon){stop();const a=C.actions.find(x=>x.id===$('dlyPick').value);if(!a)return;setRhythm(a,{f:'d',i:1},{quest:1});reEdit();return}
  if(d.dlyadd){stop();const nm=$('dlyName').value.trim();if(!nm){$('dlyName').focus();toast('이름을 먼저 적어주세요');return}
    const how=$('dlyHow').value,id=uid();let card;
    if(how){const k=C.courage.find(x=>x.id===how),fd=how.startsWith('@food:')&&C.food.find(f=>'@food:'+f.id===how);
      card={id,name:nm,type:'good',area:how==='@weigh'?'body':fd?fd.area:k?k.area:C.areas[0].id,cond:0,gold:0,xp:0,marble:'',link:how}}
    else card=newAction(id,nm,'good',C.areas[0].id,'');
    const at=C.actions.findIndex(x=>x.type==='bad');C.actions.splice(at<0?C.actions.length:at,0,card);setRhythm(card,{f:'d',i:1},{quest:1});reEdit();toast(`'${nm}' 매일 일퀘를 만들었어요`);return}
  if(d.x55==='daily1'||d.x55==='daily0'){stop();const E=ui.ae||{};let n=0;
    C.actions.forEach(a=>{if(!(E.sel||[]).includes(a.id))return;const t=habT(a);if(d.x55==='daily1'){if(a.type==='good'&&!a.once&&!(t&&t.quest)){setRhythm(a,{f:'d',i:1},{quest:1});n++}}else if(t){setRhythm(a,null);n++}});
    reEdit();render();toast(d.x55==='daily1'?`${n}개를 매일 · 일퀘로 켰어요`:`${n}개 리듬을 껐어요`);return}
},true);
document.addEventListener('change',e=>{
  const t=e.target;if(!t.dataset||!t.dataset.x57aq||!C.mig57)return;e.stopPropagation();
  const a=C.actions.find(x=>x.id===(sheetCtx||{}).aedit),k=a&&habT(a);if(!k)return;if(t.checked)k.quest=1;else delete k.quest;saveTask(k);syncDailies(C);save('config');aeRe();
},true);
// 일퀘 편집 탭: 리듬 할 일 기준으로
{const _de=dailiesEditHTML;dailiesEditHTML=function(){
  const h=_de();if(!C.mig57)return h;
  return h.replace(/<p class="help">일퀘는[\s\S]*?<\/p>/,`<p class="help">일퀘는 <b>매일 반복하는 리듬 할 일 중 ☑ 일퀘 표시를 한 것</b>이에요. 점수는 연결된 행동 카드에서만 나와요. 오늘 일퀘를 다 끝내면 상자를 열어요. 3~5개가 적당해요. 할 일 상세의 🃏 칩에서도 켜고 꺼요.</p>`).replace(/>매일 해제</g,'>일퀘 해제<');
}}

// 오늘의 일퀘 칸의 '일퀘 추가' → 매일 리듬 할 일 + 카드
document.addEventListener('submit',e=>{const f=e.target;if(!C.mig57||!f.dataset||f.dataset.addform!=='quest')return;e.preventDefault();e.stopPropagation();
  const inp=f.querySelector('input'),nm=inp.value.trim();if(!nm){inp.focus();toast('이름을 먼저 적어주세요');return}
  let a=C.actions.find(x=>x.name===nm&&x.type==='good');if(!a){a=newAction(uid(),nm,'good',C.areas[0].id,'');const at=C.actions.findIndex(x=>x.type==='bad');C.actions.splice(at<0?C.actions.length:at,0,a)}
  setRhythm(a,{f:'d',i:1},{quest:1});inp.value='';render();toast(`'${nm}' 매일 일퀘로 만들었어요 · 점수는 카드에서 정해요`)},true);

/* ---- render 앞뒤 ---- */
{const _r=render;render=function(){
  try{mig57();habMirror();habRoll();if(ready)dopaMig()}catch(e){console.error(e)}
  _r();
  try{logChips();renderDopaHome()}catch(e){console.error(e)}
}}

/* ================= 도파민 메뉴 새로: '지금 어때?'에서 시작 =================
   ADHD 도파민 메뉴의 핵심은 '목록'이 아니라 '그 순간에 꺼내기'. 상태를 먼저 고르면 3개만 보여주고(고를 게 많으면 못 고름),
   해본 뒤 '도움 됐나'를 모아 나에게 맞는 것을 위로 올려요. 디저트는 끝 시간을 정해서(시간 안에 멈추면 보너스). */
var DSTATE=[
  ['low','🪫 멍하고 처져요','몸을 깨우는 짧은 것 하나 · 5분 안',['app'],'처질 땐 생각보다 몸·감각(움직이기·찬물·햇빛·음악)이 각성을 더 빨리 올려요.'],
  ['stuck','🧱 시작이 안 돼요','할 일에 곁들일 것 + 딱 5분만',['side'],'지루해서 안 될 땐 일을 바꾸지 말고 자극을 곁들여요. 첫 5분만 약속하면 시작 문턱이 낮아져요.'],
  ['urge','📱 폰·쇼츠가 당겨요','대신할 것 하나 · 그래도 원하면 타이머 걸고',['app','dessert'],'충동은 파도처럼 10~20분이면 지나가요. 손과 몸을 다른 데 쓰면 넘기기 쉬워요. 디저트를 고르면 끝 시간을 정해요.'],
  ['over','😵 머리가 꽉 찼어요','자극을 줄이는 쉼표 · 화면 없이',['rest'],'과부하일 때 쇼츠는 쉬는 것 같아도 자극을 더해서 더 지치게 해요. 눈·귀를 쉬게 해요.'],
  ['ok','🔋 여유 있어요','오래 몰입할 메인 하나',['main'],'에너지가 있을 때 깊은 걸 해두면 내일의 나에게 좋아요.'],
  ['done','🏆 끝냈어요 · 보상','디저트·스페셜 · 끝 시간 정하고',['dessert','special'],'보상은 일 끝난 뒤, 양을 정해서 먹을 때 진짜 보상이 돼요.']];
var DOPA_NEW=[['찬물 세수','app',1,'body',3],['노래 한 곡 틀고 몸 흔들기','app',4,'body',4],['햇빛 보러 베란다·창가','app',3,'body',3],['물 한 컵','app',1,'body',2],
  ['좋아하는 플레이리스트 틀기','side',1,'mind',2],['팟캐스트 들으며 하기','side',1,'mind',2],['캠스터디 켜고 같이 하기','side',30,'make',8],['타이머 15분 걸고 하기','side',15,'make',4],
  ['눈 감고 5분 누워 있기','rest',5,'mind',3],['폰 두고 동네 한 바퀴','rest',15,'body',6],['따뜻한 차 한 잔','rest',5,'mind',2],['소리 끄고 창밖 보기','rest',5,'mind',2]];
function dopaMig(){
  if(C.dopa57)return;C.dopa57=1;
  const cs=C.dopaCourses=dopaC().map(([id,name,desc])=>({id,name,desc}));
  const fix={side:['집중을 이어가는 짧은 휴식','지루한 일에 곁들이기 · 음악·장소·같이 하기'],dessert:['하루 한 스푼의 행복','맛있지만 끝이 없는 것 · 끝 시간 정하고'],app:['짧고 쉬운 것 · 1~15분','바로 기분 올리기 · 5분 안'],main:['30분 넘게 들이는 것','깊이 몰입 · 30분 넘게']};
  cs.forEach(c=>{const f=fix[c.id];if(f&&c.desc===f[0])c.desc=f[1]});
  if(!cs.some(c=>c.id==='rest'))cs.splice(Math.max(0,cs.findIndex(c=>c.id==='dessert')),0,{id:'rest',name:'🛋 쉼표',desc:'머리가 꽉 찼을 때 · 자극 줄이기'});
  C.actions.forEach(a=>{if(a.dopa==='side'&&/알람 맞추고 쉬기/.test(a.name))a.dopa='rest'});
  const has=n=>C.actions.some(a=>a.name===n),at=C.actions.findIndex(a=>a.type==='bad');let i=at<0?C.actions.length:at;
  DOPA_NEW.forEach(([n,co,min,area,xp])=>{if(has(n))return;const ar=C.areas.some(x=>x.id===area)?area:(C.areas[0]||{}).id;
    C.actions.splice(i++,0,{id:'dq'+uid().slice(0,6),name:n,type:'good',area:ar,cond:Math.max(2,Math.round(xp/3)),gold:co==='rest'?0:Math.max(1,Math.round(xp/4)),xp,marble:'',dur:min,dopa:co,dopaOnly:1,effort:'quick'})});
  if(!C.ui.home.some(h=>h[0]==='dopa')){const k=C.ui.home.findIndex(h=>h[0]==='brave');const col=(C.ui.home[k]||[])[2]||'L';C.ui.home.splice(k<0?1:k+1,0,['dopa',1,col])}
  else{const it=C.ui.home.find(h=>h[0]==='dopa'),k=C.ui.home.findIndex(h=>h[0]==='brave');if(it&&k>=0){C.ui.home=C.ui.home.filter(h=>h!==it);C.ui.home.splice(C.ui.home.findIndex(h=>h[0]==='brave')+1,0,[...it.slice(0,2),C.ui.home.find(h=>h[0]==='brave')[2]||'L'])}}
  save('config');
}
HOME_BLOCKS.dopa='🍬 지금 어때? (도파민 메뉴)';
function dopaFit(a,st){const f=((C.dopaFit||{})[a.id]||{})[st];return f?f:{g:0,n:0}}
function dopaScore(a,st){const f=dopaFit(a,st);return (f.g+1)/(f.n+2)-(f.b||0)*0.15}
function dopaPicks(st,shift){
  const S=DSTATE.find(x=>x[0]===st);if(!S)return [];const recent=new Set();const d=DAYS[dateKey()];
  (d&&d.entries||[]).forEach(e=>{if(e.kind==='act'&&e.aid&&e.t&&toMin(stamp())-toMin(e.t)<90)recent.add(e.aid)});
  const pool=C.actions.filter(a=>a.type==='good'&&!a.doneAt&&S[3].includes(a.dopa)&&!recent.has(a.id));
  // 점수 높은 순 + 같은 점수는 날마다 다르게
  const seed=dateKey()+st;const h=x=>{let v=0;for(const c of x+seed)v=(v*31+c.charCodeAt(0))|0;return (v>>>0)%1000/1000};
  const sorted=pool.sort((x,y)=>(dopaScore(y,st)+h(y.id)*.08)-(dopaScore(x,st)+h(x.id)*.08));
  if(!sorted.length)return [];const n=Math.min(3,sorted.length),k=((shift||0)*n)%sorted.length;
  const out=[...sorted.slice(k),...sorted.slice(0,k)].slice(0,n);return out.sort((x,y)=>(x.dopa==='dessert'||x.dopa==='special'?1:0)-(y.dopa==='dessert'||y.dopa==='special'?1:0));
}
function dopaNowHTML(compact){
  const st=ui.dst||'';
  return `<div class="dnow"><div class="dstates">${DSTATE.map(([k,l])=>`<button class="dst" data-x57dst="${k}" aria-pressed="${st===k}">${l}</button>`).join('')}</div></div>`;
}
function openDopaNow(st){
  if(st)ui.dst=st;ui.dshift=ui.dst===st?ui.dshift||0:0;const S=DSTATE.find(x=>x[0]===ui.dst);
  const pend=C.dopaPend&&C.actions.find(a=>a.id===C.dopaPend.aid)&&(Date.now()-C.dopaPend.at<36e5*12)?C.dopaPend:null;
  const ask=pend?`<div class="dask"><span class="small">아까 <b>${esc(C.actions.find(a=>a.id===pend.aid).name)}</b> 해보니 어땠어요?</span>${dopaRateBtns()}</div>`:'';
  let body='';
  if(S){const ps=dopaPicks(S[0],ui.dshift);
    body=`<p class="small" style="margin:0"><b>${S[1]}</b> → ${esc(S[2])}</p><p class="tiny muted" style="margin:0">${esc(S[4])}</p>
    <div class="stack" style="gap:6px">${ps.map(a=>{const f=dopaFit(a,S[0]),des=a.dopa==='dessert'||a.dopa==='special';return `<div class="dpick"><span><b>${esc(a.name)}</b><span class="tiny muted"> ${a.dur?a.dur+'분':''}${f.n?` · 👍 ${f.g}/${f.n}`:''}${des?' · 끝 시간 정하고':''}</span></span><span class="row" style="gap:4px"><button class="btn ghost sm" data-x57drun="${a.id}" title="${des?'끝 시간 알림과 함께':'타이머로'}">▶ ${des?'시간 정해':'시작'}</button><button class="btn sm" data-x57ddo="${a.id}">✓ 했어요</button></span></div>`}).join('')||`<div class="empty">이 상태에 맞는 게 아직 없어요. 편집 → 도파민에서 '${esc(S[3].map(c=>(dopaC().find(d=>d[0]===c)||['',c])[1]).join('·'))}' 코스에 넣어요.</div>`}</div>
    <div class="row" style="gap:6px;flex-wrap:wrap"><button class="btn ghost sm" data-x57dmore="1">🎲 다른 거</button>${S[0]==='stuck'?'<button class="btn ghost sm" data-quick5="1">⏳ 할 일 하나 딱 5분만</button>':''}${S[0]==='urge'?'<button class="btn ghost sm" data-x57surf="1">🌊 10분만 버텨보기</button>':''}</div>`}
  openSheet(`<div class="sh"><h3>🍬 지금 어때?</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>${ask}${dopaNowHTML()}${body}
    <details class="small"><summary style="cursor:pointer">전체 메뉴 · 코스별로 보기</summary><div id="dAll" style="margin-top:6px"></div></details>
    <p class="tiny muted" style="margin:0">해본 뒤 👍/👎를 남기면 그 상태에서 잘 듣는 게 위로 올라와요. <a href="#edit" data-goedit="dopa" style="color:var(--accent)">메뉴 편집</a></p>`);
  sheetCtx={dnow:1};
  const all=$('dAll');if(all)all.innerHTML=`<div class="dopa">${dopaC().map(([co,nm,ds])=>{const its=C.actions.filter(a=>a.dopa===co);return `<div class="course"><b>${nm}</b><span class="tiny muted">${esc(ds)}</span><div class="dlist">${its.map(a=>`<button class="ditem" data-x57ddo="${a.id}"><span>${esc(a.name)}</span><span class="tiny muted">${a.dur?a.dur+'분':''}</span></button>`).join('')||'<span class="tiny muted">비어 있어요</span>'}</div></div>`}).join('')}</div>`;
}
function dopaRateBtns(){return `<span class="row" style="gap:4px"><button class="btn ghost sm" data-x57drate="g">👍 나아졌어요</button><button class="btn ghost sm" data-x57drate="m">😐 그대로</button><button class="btn ghost sm" data-x57drate="b">👎 더 나빠짐</button></span>`}
function dopaRate(v){const p=C.dopaPend;if(!p)return;C.dopaFit=C.dopaFit||{};const r=C.dopaFit[p.aid]=C.dopaFit[p.aid]||{};const f=r[p.st]=r[p.st]||{g:0,n:0};f.n++;if(v==='g')f.g++;if(v==='b')f.b=(f.b||0)+1;delete C.dopaPend;save('config');
  toast(v==='g'?'좋아요. 다음에도 위에 올려둘게요':v==='b'?'알겠어요. 이 상태에선 뒤로 뺄게요':'기록했어요')}
function dopaDid(a,run){
  const st=ui.dst||'';C.dopaPend={aid:a.id,st:st||'any',at:Date.now()};save('config');closeSheet();
  if(run){startRun({act:a});if(RUN){RUN.mode='within';if(a.dopa==='dessert'||a.dopa==='special')toast(`⏱ ${RUN.target}분 뒤가 끝 시간이에요. 시간 안에 멈추면 보너스`,4500);runSave();drawHunt(true)}return}
  ui.off=0;doAction(a);
  setTimeout(()=>{openSheet(`<div class="sh"><h3>🍬 ${esc(a.name)}</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div><p class="small" style="margin:0">기분이 좀 어때요? (지금 몰라도 괜찮아요. 다음에 '지금 어때?'를 열면 다시 물어요)</p>${dopaRateBtns()}`);sheetCtx={dnow:1}},350);
}
// 홈 칸
function renderDopaHome(){const b=$('dopaHome');if(!b)return;b.innerHTML=`<div class="ptitle"><h2>🍬 지금 어때?</h2><span class="tiny muted">고르면 3개만 골라줘요</span></div>${dopaNowHTML(true)}`}
{const _rd=renderDopa;renderDopa=function(){_rd();const box=$('gDopa');if(!box)return;box.insertAdjacentHTML('afterbegin',`<div class="small" style="margin-bottom:6px"><b>지금 어때?</b> 상태를 고르면 맞는 것 3개만 보여줘요.</div>${dopaNowHTML(true)}<div class="tiny muted" style="margin:8px 0 4px">전체 메뉴</div>`)}}
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-x57dst],[data-x57drun],[data-x57ddo],[data-x57dmore],[data-x57drate],[data-x57surf],[data-gquickdopa]');if(!b)return;const d=b.dataset;e.preventDefault();e.stopPropagation();
  if(d.gquickdopa){openDopaNow(ui.dst||'');return}
  if(d.x57dst){if(ui.dst!==d.x57dst)ui.dshift=0;ui.dst=d.x57dst;openDopaNow(d.x57dst);return}
  if(d.x57dmore){ui.dshift=(ui.dshift||0)+1;const y=$('sheetC').scrollTop;openDopaNow(ui.dst);$('sheetC').scrollTop=y;return}
  if(d.x57drun||d.x57ddo){const a=C.actions.find(x=>x.id===(d.x57drun||d.x57ddo));if(a)dopaDid(a,!!d.x57drun);return}
  if(d.x57drate){dopaRate(d.x57drate);if(sheetCtx&&sheetCtx.dnow&&!$('sheetC').querySelector('.dstates'))closeSheet();else if(sheetCtx&&sheetCtx.dnow)openDopaNow(ui.dst);return}
  if(d.x57surf){closeSheet();surfStart();return}
},true);
// 🌊 충동 파도 타기: 10분 동안 버티면 작은 보상 (기록만, 점수 0 → 용기는 아님)
function surfStart(){ui.surf=Date.now();toast('🌊 10분만 버텨봐요. 폰은 다른 방에. 끝나면 알려줄게요',5000);clearTimeout(ui.surfT);ui.surfT=setTimeout(()=>{if(!ui.surf)return;ui.surf=0;popup('파도 넘김','🌊','10분 버텼어요. 충동은 지나가요.<br>지금도 원하면 타이머 걸고 디저트, 아니면 하던 일로.','도파민')},600000)}

/* ================= 2단계: 자연어 입력 강화 (시간 범위 · '매주 반복' · ~까지=마감) ================= */
function nlHour(ap,h,m,half){h=+h;m=half?30:(+m||0);if(/오후|저녁|밤/.test(ap||'')&&h<12)h+=12;else if(!ap&&h>=1&&h<=7)h+=12;if(/오전|아침|새벽/.test(ap||'')&&h===12)h=0;return h*60+m}
{const _pq=parseQuick;parseQuick=function(raw,opt){
  let s=String(raw||''),rng=null,dl=null;
  const AP='(오전|오후|아침|저녁|밤|새벽)?\\s*';
  const T='(\\d{1,2})(?:시(?:\\s*(\\d{1,2})분|\\s*(반))?|:(\\d{2}))';
  const re=new RegExp(AP+T+'\\s*(?:부터|~|–|-)\\s*'+AP+T+'(?:\\s*까지)?');
  const m=s.match(re);
  if(m){const a=nlHour(m[1],m[2],m[3]||m[5],m[4]);let ap2=m[6]||'';let b=nlHour(ap2||m[1],m[7],m[8]||m[10],m[9]);if(b<=a&&!ap2)b+=720;if(b<=a)b+=1440;rng=[a,b-a];s=s.replace(m[0],' ').replace(/\s+/g,' ')}
  const dm=s.match(/((?:이번\s*주|다음\s*주|다음주|이번주)?\s*(?:[월화수목금토일]요일|오늘|내일|모레|글피|\d{1,2}월\s*\d{1,2}일|\d{1,2}\/\d{1,2}))\s*까지/);
  if(dm){const q=_pq(dm[1],opt);if(q&&q.due){dl=q.due;s=s.replace(dm[0],' ').replace(/\s+/g,' ')}}
  const p=_pq(s.trim(),opt);
  if(rng){p.time=hm(rng[0]);p.dur=rng[1];if(!p.due)p.due=(opt&&opt.baseDate)||dateKey()}
  if(dl)p.deadline=dl;
  if(p.rep&&p.rep.f==='w'&&!(p.rep.wd||[]).length)p.rep.wd=[dowOf(p.due||dateKey())];
  if(p.title)p.title=p.title.replace(/(^|\s)반복(\s|$)/g,' ').replace(/\s+/g,' ').trim()||p.title;
  return p}}
{const _pc=parseChips;parseChips=function(p){let h=_pc(p);if(p.deadline&&!/마감/.test(h))h+=`<span class="pc">⏳ 마감 ${esc(dueLabel(p.deadline))}</span>`;return h}}

/* ================= 2단계: 할 일 입력 때 행동 카드에서 꺼내오기 · 태그 자동완성 ================= */
['tsTags','cal57Add'].forEach(k=>{if(!AC_IDS.includes(k))AC_IDS.push(k)});
{const _ac=acCompute;acCompute=function(inp){
  if(inp.id==='tsTags'){const v=inp.value,pos=inp.selectionStart??v.length,st=v.lastIndexOf(',',pos-1)+1,seg=v.slice(st,pos).trim().replace(/^#/,''),q=normN(seg);
    const have=v.split(/[,，]/).map(x=>x.trim().replace(/^#/,''));const tg={};Object.values(TASKS).forEach(t=>(t.tags||[]).forEach(x=>tg[x]=(tg[x]||0)+1));
    AC.items=Object.entries(tg).sort((a,b)=>b[1]-a[1]).map(x=>x[0]).filter(x=>!have.includes(x)&&(!q||normN(x).includes(q))).slice(0,8).map(x=>({label:'#'+x,ins:x+','}));
    AC.from=st+(v.slice(st,pos).match(/^\s*/)[0].length);AC.to=pos;AC.whole=false;AC.sel=0;AC.inp=inp;acDraw();return}
  _ac(inp);
  if(!AC.whole||!['tAdd','htAdd','calAdd','cal57Add'].includes(inp.id))return;
  const q=normN(inp.value.trim());if(!q)return;
  const cards=C.actions.filter(a=>a.type==='good'&&!a.doneAt&&normN(a.name).includes(q)).slice(0,4).map(a=>({label:`🃏 ${a.name} · 행동 카드 (점수 ⭐${a.xp||0})`,ins:a.name}));
  const seen=new Set(cards.map(c=>c.ins));AC.items=[...cards,...AC.items.filter(i=>!seen.has(i.ins))].slice(0,8);AC.sel=0;acDraw();
}}
{const _pc2=parseChips;parseChips=function(p){let h=_pc2(p);const a=p.title&&C.actions.find(x=>x.name===p.title&&x.type==='good');if(a)h+=`<span class="pc">🃏 '${esc(a.name)}' 카드와 연결 · 점수는 카드에서</span>`;return h}}

/* ================= 2단계: 캘린더 — 빈 시간 칸 누르기·끌기로 할 일 추가, 트레이의 '지난 것' 빼기 ================= */
var CAL57=null;
document.addEventListener('pointerdown',e=>{
  const col=e.target.closest('.tgcol[data-drop^="col:"]');if(!col||e.button>0||e.target.closest('.blk,.cchip,button,a,input'))return;
  if(DND.on)return;
  const r=col.getBoundingClientRect(),m0=clamp(Math.floor(mOf(e.clientY-r.top)/15)*15,0,1425);
  const S=CAL57={col,k:col.dataset.drop.slice(4),m0,m1:m0+30,y0:e.clientY,moved:false,ghost:null,id:e.pointerId,touch:e.pointerType!=='mouse'};
  // 폰: 꾹 누르면(0.35초) 범위 끌기 시작 · 그냥 움직이면 스크롤
  if(S.touch)S.tm=setTimeout(()=>{if(CAL57!==S||S.moved)return;S.armed=true;S.moved=true;S.a=S.m0;S.b=S.m0+30;buzz(10);
    S.ghost=document.createElement('div');S.ghost.className='cal57g';S.col.appendChild(S.ghost);S.ghost.style.top=yOf(S.a)+'px';S.ghost.style.height=(yOf(S.b)-yOf(S.a))+'px';S.ghost.textContent=`${hm(S.a)}–${hm(S.b)} · 끌어서 늘리기`},350);
});
document.addEventListener('touchmove',e=>{if(CAL57&&CAL57.armed)e.preventDefault()},{passive:false});
document.addEventListener('pointercancel',()=>{const S=CAL57;if(S){clearTimeout(S.tm);if(S.ghost)S.ghost.remove();CAL57=null}});
document.addEventListener('pointermove',e=>{
  const S=CAL57;if(!S||e.pointerId!==S.id)return;if(Math.abs(e.clientY-S.y0)<6&&!S.moved)return;
  if(S.touch&&!S.armed){clearTimeout(S.tm);CAL57=null;return} // 폰: 꾹 누르기 전에 움직이면 스크롤
  S.moved=true;e.preventDefault();const r=S.col.getBoundingClientRect();const m=clamp(Math.round(mOf(e.clientY-r.top)/15)*15,0,1440);
  const a=Math.min(S.m0,m),b=Math.max(S.m0+15,m);S.a=a;S.b=b;
  if(!S.ghost){S.ghost=document.createElement('div');S.ghost.className='cal57g';S.col.appendChild(S.ghost)}
  S.ghost.style.top=yOf(a)+'px';S.ghost.style.height=Math.max(10,yOf(b)-yOf(a))+'px';S.ghost.textContent=`${hm(a)}–${hm(b)}`;
},{passive:false});
document.addEventListener('pointerup',e=>{
  const S=CAL57;CAL57=null;if(!S||e.pointerId!==S.id)return;clearTimeout(S.tm);if(S.ghost)S.ghost.remove();
  if(!S.moved&&Math.abs(e.clientY-S.y0)>=6)return;
  if(S.armed){lpFired=true;setTimeout(()=>{lpFired=false},60)}
  const a=S.moved?S.a:S.m0,b=S.moved?S.b:S.m0+(+((C.ui.cal||{}).slot)||30);
  calAddSheet(S.k,a,b-a);
});
function calAddSheet(k,m,dur){
  sheetCtx={cal57:{k,m,dur}};
  openSheet(`<div class="sh"><h3>📅 ${esc(fmtD(k))} · ${hm(m)}–${hm(m+dur)}</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <form class="tadd" data-x57caladd="1"><div class="in"><input id="cal57Add" maxlength="160" placeholder="할 일 (#태그 ~목록 !! 도 돼요)" enterkeyhint="done" autocomplete="off"><button class="btn sm" type="submit">추가</button></div></form>
    <div class="row small" style="gap:6px">걸리는 시간 ${[15,30,60,90,120].map(n=>`<button class="chipbtn" data-x57cdur="${n}" aria-pressed="${dur===n}">${durTxt(n)}</button>`).join('')}</div>`);
  setTimeout(()=>$('cal57Add')&&$('cal57Add').focus(),60);
}
document.addEventListener('submit',e=>{const f=e.target;if(!f.dataset||!f.dataset.x57caladd)return;e.preventDefault();e.stopPropagation();
  const c=(sheetCtx||{}).cal57;const v=$('cal57Add').value.trim();if(!c||!v){$('cal57Add').focus();return}
  const p=parseQuick(v,{baseDate:c.k});if(!p.title)return;if(!p.time){p.time=hm(c.m);p.dur=p.dur||c.dur}if(!p.due)p.due=c.k;if(!p.list)p.list='inbox';
  const a=C.actions.find(x=>x.name===p.title&&x.type==='good');if(a)p.aid=a.id;
  const t=newTask(p);saveTask(t);closeSheet();render();toast(`'${t.title}' · ${dueLabel(t.due)} ${t.time} 추가`)},true);
document.addEventListener('click',e=>{const b=e.target.closest('[data-x57cdur]');if(!b)return;e.preventDefault();e.stopPropagation();const c=(sheetCtx||{}).cal57;if(!c)return;const v=$('cal57Add').value;calAddSheet(c.k,c.m,+b.dataset.x57cdur);$('cal57Add').value=v},true);
{const _rt=renderTray;renderTray=function(){if(ui.trayTab==='late')ui.trayTab='nodate';_rt()}}
// 캘린더 색 기준: 중요도(기본) · 영역 · 목록 — 파랑 빼고, 글자 표시도 같이 (색만으로 구분 안 함)
var CAL_PAL=['--c3','--c9','--c6','--c2','--c5','--c8','--c10','--c4','--c7'];
function calKey(t){const by=(C.ui.cal||{}).color;if(by==='area'){const i=C.areas.findIndex(a=>a.id===areaOfTask(t));return i<0?null:[i,(C.areas[i].name||'').slice(0,2)]}
  if(by==='list'){const ls=[{id:'inbox',name:'기본함'},...C.lists.filter(l=>l.id!=='inbox')];const i=ls.findIndex(l=>l.id===(t.list||'inbox'));return i<0?null:[i,(ls[i].name||'').replace(/^[^\p{L}\p{N}]+/u,'').slice(0,3)]}return null}
{const _rc=renderCal;renderCal=function(){_rc();try{
  const m=$('calModes');if(m&&!$('cal57Color')){m.insertAdjacentHTML('afterend',`<select id="cal57Color" aria-label="일정 색 기준" title="일정 색 기준" style="width:auto;font-size:12px;padding:2px 4px"><option value="">색: 중요도</option><option value="area">색: 영역</option><option value="list">색: 목록</option></select>`)}
  const sel=$('cal57Color');if(sel)sel.value=(C.ui.cal||{}).color||'';
  if(!(C.ui.cal||{}).color)return;
  document.querySelectorAll('#calPane [data-ctask]').forEach(el=>{const t=TASKS[el.dataset.ctask];if(!t)return;const k=calKey(t);if(!k)return;const v=`var(${CAL_PAL[k[0]%CAL_PAL.length]})`;
    el.style.borderLeft=`4px solid ${v}`;el.style.background=`color-mix(in srgb,${v} 16%,var(--panel))`;
    if(!el.querySelector('.ck57')){const s=document.createElement('span');s.className='ck57';s.textContent=k[1];s.style.borderColor=v;el.prepend(s)}});
}catch(e){console.error(e)}}}
document.addEventListener('change',e=>{if(e.target.id!=='cal57Color')return;e.stopPropagation();C.ui.cal.color=e.target.value;save('config');renderCal()},true);

/* ================= 2단계: 행동/습관 칸반 보드 (영역 칸 · 끌어서 영역 바꾸기) ================= */
function actBoardHTML(){
  const q=(ui.ae&&ui.ae.q||'').toLowerCase(),ty=(ui.ae&&ui.ae.type)||'all';
  const ok=a=>(!q||a.name.toLowerCase().includes(q))&&(ty==='all'||ty==='habit'?(ty!=='habit'||isHabit(a)):ty==='brave'?!!a.brave:a.type===ty)&&!a.doneAt;
  const show=aeShow().filter(k=>k!=='area'&&k!=='n30');
  const chip=a=>`<div class="dchip bchip ${a.type}" data-drag="act:${a.id}" data-dragmode="hold" role="button" tabindex="0"><span class="bn"><b>${a.type==='good'?'▲':'▼'}</b> <button class="nm57" data-aedit="${a.id}">${esc(a.name)}</button></span><span class="mxs">${metaChips(a,null,show)}</span></div>`;
  return `<p class="tiny muted" style="margin:0 0 6px">카드를 꾹 눌러(PC는 끌어서) 다른 영역 칸에 놓으면 영역이 바뀌어요. 이름을 누르면 편집. ▲ 좋은 · ▼ 나쁜.</p>
  <div class="dedit board57">${C.areas.map(ar=>{const its=C.actions.filter(a=>a.area===ar.id&&ok(a));return `<div class="dcol" data-drop="dopa:@a:${ar.id}"><div class="dh"><b>${esc(ar.name)}</b><span class="tiny muted">${its.length}개</span></div>${its.map(chip).join('')||'<span class="tiny muted">비어 있어요</span>'}</div>`}).join('')}</div>`;
}
{const _aeh=actionsEditHTML;actionsEditHTML=function(){
  const tog=`<div class="row" style="gap:6px;margin-bottom:6px"><span class="seg"><button data-x57board="" aria-pressed="${!ui.aeBoard}">▤ 목록</button><button data-x57board="1" aria-pressed="${!!ui.aeBoard}">▦ 보드 (영역 칸)</button></span></div>`;
  const h=_aeh();if(!ui.aeBoard)return tog+h;
  return tog+actBoardHTML();
}}
{const _de=dndEnd;dndEnd=function(x,y){const d=DND.drop,kind=DND.kind,id=DND.id;
  if(kind==='act'&&d&&d.type==='dopa'&&String(d.co).startsWith('@a:')){DND.drop=null;_de(x,y);const a=C.actions.find(z=>z.id===id),ar=d.co.slice(3);if(a&&a.area!==ar){a.area=ar;save('config');render();if(typeof reEdit==='function')reEdit();toast(`'${a.name}' → ${(C.areas.find(z=>z.id===ar)||{}).name||''}`)}return}
  return _de(x,y)}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-x57board]');if(!b)return;e.preventDefault();e.stopPropagation();ui.aeBoard=!!b.dataset.x57board;reEdit()},true);

/* ================= 2단계: 홈 배치 프리셋 · 작게 보기(전체 지도) ================= */
var HOME_PRE=[['default','기본',null],
  ['todo','📋 할 일 먼저',[['today','quests','dopa','quick','brave'],['profile','alerts','todaylog','week','tip']]],
  ['game','⚔ 게임',[['profile','battle','brave','today','gacha'],['week','quests','dopa','alerts','todaylog','journey','jars']]],
  ['calm','🌿 간단히',[['today','dopa'],['profile','quests']]]];
function homePreset(k){
  const p=HOME_PRE.find(x=>x[0]===k);if(!p)return;
  if(!p[2]){C.ui.home=clone(DEFAULT_CONFIG.ui.home).map((h,i,a)=>[h[0],h[1],i<Math.ceil(a.length/2)?'L':'R'])}
  else{const [L,R]=p[2],ids=Object.keys(HOME_BLOCKS);C.ui.home=[...L.map(id=>[id,1,'L']),...R.map(id=>[id,1,'R']),...ids.filter(id=>!L.includes(id)&&!R.includes(id)).map((id,i)=>[id,0,i%2?'R':'L'])]}
  save('config');applyHome();applyHomeEdit();toast(`'${p[1]}' 배치로 바꿨어요 · 👁로 더 켜고 끌 수 있어요`);
}
function homePresetsBar(){
  const bar=document.querySelector('.homebar');if(!bar||$('homePresets'))return;
  bar.insertAdjacentHTML('afterend',`<div id="homePresets" class="row" hidden style="gap:6px;flex-wrap:wrap;margin:6px 0"><span class="small muted">빠른 배치:</span>${HOME_PRE.map(([k,l])=>`<button class="chipbtn" data-x57hpre="${k}">${l}</button>`).join('')}<label class="row small" style="gap:4px;margin-left:auto"><input type="checkbox" id="x57HMini" style="width:auto"> 작게 보기 (전체 지도)</label></div>`);
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-x57hpre]');if(!b)return;e.preventDefault();e.stopPropagation();homePreset(b.dataset.x57hpre)},true);
document.addEventListener('change',e=>{if(e.target.id!=='x57HMini')return;e.stopPropagation();document.body.classList.toggle('hmini',e.target.checked)},true);
{const _ah=applyHomeEdit;applyHomeEdit=function(){homePresetsBar();_ah();if(!ui.homeEdit){document.body.classList.remove('hmini');const c=$('x57HMini');if(c)c.checked=false}}}
// 나쁜 행동을 기록하면: 다음엔 그 순간에 꺼낼 대신할 것 (벌만 주고 끝내지 않기)
{const _da=doAction;doAction=function(a,ctx={}){_da(a,ctx);try{if(a&&a.type==='bad'&&!a.link)setTimeout(()=>toastAct(`기록했어요. 다음에 당길 땐 대신할 것부터 볼까요?`,'🍬 지금 어때?',()=>openDopaNow('urge'),6000),900)}catch(e){console.error(e)}}}
