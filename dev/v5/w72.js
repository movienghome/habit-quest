/* ================= v7.2: A 묶음 — 버그 바로잡기 (캘린더·기록·루틴·폰) ================= */

/* ---- 0) 작은 도구 ---- */
function ready72(){return typeof ready!=='undefined'&&ready&&(typeof SRV59==='undefined'||!SRV59||SRV59.c)}
function hr72(){return new Date().getHours()}

/* ---- 1) 캘린더 거르기: 숨긴 일정 알려 주기 · 새 목록은 거르기에 안 걸리게 (A2) ----
   '고른 것만 보이기' 거르기를 켜 둔 뒤에 생긴 목록(예: 기본 목록 Personal)이나 영역 없는 할 일은 캘린더에서 통째로 사라졌어요.
   f.known72 = 거르기를 바꿀 때 있던 목록들. 그 뒤에 생긴 목록은 거르지 않아요. */
function calPass(t){const f=(C.ui.cal||{}).filter||{},L=t.list||'inbox';
  if(f.lists&&f.lists.length&&!f.lists.includes(L)&&!(f.known72&&!f.known72.includes(L)))return false;
  if(f.areas&&f.areas.length&&!f.areas.includes(areaOfTask(t)))return false;
  if(f.tags&&f.tags.length&&!(t.tags||[]).some(x=>f.tags.includes(x)))return false;return true}
addEventListener('click',e=>{const b=e.target.closest('[data-cff]');if(!b||!b.dataset||b.dataset.cff!=='lists')return;try{const f=C.ui.cal.filter;if(f){f.known72=['inbox',...C.lists.map(l=>l.id)];save('config')}}catch(x){}});
function calBases72(){let b=null;try{b=calBase68()}catch(e){}if(!b)b=(C.ui||{}).cal;return b?[b,b._t].filter(x=>x&&typeof x==='object'):[]}
function passWith72(cfg,t){const f=(cfg||{}).filter||{},L=t.list||'inbox';
  if(f.lists&&f.lists.length&&!f.lists.includes(L)&&!(f.known72&&!f.known72.includes(L)))return false;
  if(f.areas&&f.areas.length&&!f.areas.includes(areaOfTask(t)))return false;
  if(f.tags&&f.tags.length&&!(t.tags||[]).some(x=>f.tags.includes(x)))return false;return true}
function calUnhide72(t){let n=0;calBases72().forEach(c=>{const f=c.filter;if(!f||passWith72(c,t))return;const L=t.list||'inbox',ar=areaOfTask(t);
    if(f.lists&&f.lists.length&&!f.lists.includes(L)){f.lists.push(L);n++}
    if(f.areas&&f.areas.length&&!f.areas.includes(ar)){if(ar)f.areas.push(ar);else f.areas=[];n++}
    if(f.tags&&f.tags.length&&!(t.tags||[]).some(x=>f.tags.includes(x))){f.tags=[];n++}});
  save('config');return n}
renderCal=(function(prev){return function(){const r=prev.apply(this,arguments);try{
  const m=$('calMain');if(!m)return r;
  // 끌 때 '어느 날 칩을 잡았는지' (여러 날 일정은 그 날만큼 옮겨요)
  m.querySelectorAll('[data-calday]').forEach(c=>{const k=c.dataset.calday;c.querySelectorAll('.cchip[data-ctask]').forEach(x=>x.dataset.k72=k)});
  m.querySelectorAll('[data-drop^="allday:"],[data-drop^="col:"]').forEach(c=>{const k=c.dataset.drop.split(':')[1];c.querySelectorAll('[data-ctask]').forEach(x=>x.dataset.k72=k)});
  // 거르기로 숨긴 일정
  const ks=new Set([...m.querySelectorAll('[data-calday]')].map(x=>x.dataset.calday));const hid=[];
  if(ks.size)openTasks().forEach(t=>{if(!t.due||calPass(t))return;if(spanDays71(t).some(k=>ks.has(k)))hid.push(t)});
  const bar=document.querySelector('#calPane .calbar2');if(bar){let b=bar.querySelector('.h72');
    if(!hid.length){if(b)b.remove()}else{if(!b){b=document.createElement('button');b.type='button';b.className='chipbtn h72';$('calTitle').insertAdjacentElement('afterend',b)}
      b.textContent=`🙈 ${hid.length}개 숨김`;b.title='캘린더 거르기 때문에 안 보이는 일정: '+hid.slice(0,8).map(t=>t.title).join(', ')+(hid.length>8?' …':'')+' · 눌러서 거르기 보기'}}
  }catch(e){console.error(e)}return r}})(renderCal);
addEventListener('click',e=>{const b=e.target.closest('.h72');if(!b)return;e.preventDefault();e.stopPropagation();calFilterSheet()},true);
// 할 일 상세: 캘린더에 안 보이면 왜 그런지 + 바로 보이게
drawTaskSheet=(function(prev){return function(){const r=prev.apply(this,arguments);try{
  const sc=$('sheetC'),t=TASKS[(sheetCtx||{}).task];if(!sc||!t||!$('tsTitle')||sc.querySelector('.cf72'))return r;
  if(t.due&&t.status===0&&calBases72().some(c=>!passWith72(c,t))){const ch=sc.querySelector('.tchips');if(ch)ch.insertAdjacentHTML('afterend',`<div class="cf72 small">🙈 캘린더 거르기 때문에 캘린더에 안 보여요 <button type="button" class="chipbtn" data-cf72="${t.id}">보이게 하기</button></div>`)}
  }catch(e){console.error(e)}return r}})(drawTaskSheet);
addEventListener('click',e=>{const b=e.target.closest('[data-cf72]');if(!b)return;e.preventDefault();e.stopPropagation();const t=TASKS[b.dataset.cf72];if(!t)return;calUnhide72(t);b.closest('.cf72').remove();ui.calKeepScroll=true;render();toast('캘린더 거르기를 고쳐서 이제 보여요')},true);

/* ---- 2) 날짜를 옮겨도 시각·소요·여러 날 길이 그대로 (A3·A10) · 고친 날짜는 ☠ 아님 (A11) ----
   saveTask 직전 값(SN72)과 비교: 시작일이 바뀌고 끝나는 날은 그대로면 끝나는 날도 같이 옮겨요. */
var SN72=new Map(),KT72=null;
function snap72(t){if(t&&t.id)SN72.set(t.id,{due:t.due||null,end:t.end71||null,sk:t.skull||0})}
render=(function(prev){return function(){try{Object.values(TASKS).forEach(snap72)}catch(e){}return prev.apply(this,arguments)}})(render);
saveTask=(function(prev){return function(t){try{const p=t&&SN72.get(t.id);
  if(p&&t.due!==p.due){
    if(t.due&&p.due&&p.end&&p.end>p.due&&t.end71===p.end&&!(t.rep&&t.rep.f))t.end71=addDays(p.end,diffDays(t.due,p.due));
    const sk=t.skull||0;
    if(sk>p.sk&&t.due&&p.due){const born=(+t.order>1e12&&t.created===dateKey())?+t.order:0,fresh=Date.now()-Math.max(+t.dset72||0,born)<30*60e3;
      if(span71(t)||fresh){if(p.sk)t.skull=p.sk;else delete t.skull}   // 여러 날 일정이거나 방금 정한 날짜를 고친 거면 미룸 아님
      else{const id=t.id;setTimeout(()=>{const x=TASKS[id];if(!x||(x.skull||0)<1)return;toastAct(`'${x.title}' ☠ 미룬 것으로 셌어요 (${x.skull})`,'사정상 옮긴 거예요',()=>unskull72(x.id),6500)},80)}}
    t.dset72=Date.now()}
  }catch(e){console.error(e)}
  const r=prev.apply(this,arguments);try{snap72(t)}catch(e){}return r}})(saveTask);
function unskull72(id){const x=TASKS[id];if(!x)return;x.skull=Math.max(0,(x.skull||0)-1);if(!x.skull)delete x.skull;x.moved72=(x.moved72||0)+1;saveTask(x);render();if(sheetCtx&&sheetCtx.task===id&&$('tsTitle'))tsRedraw();toast('☠ 뺐어요 · 사정상 옮긴 걸로')}
addEventListener('click',e=>{const b=e.target.closest('[data-sk72]');if(!b)return;e.preventDefault();e.stopPropagation();unskull72(b.dataset.sk72)},true);
dndEnd=(function(prev){return function(x,y){KT72=null;try{const kind=DND.kind,id=DND.id,drop=DND.drop,el=DND.el,t=TASKS[id];
    if((kind==='task'||kind==='block')&&drop&&drop.date&&t){const gk=el&&el.dataset&&el.dataset.k72;
      if(span71(t)&&gk&&gk!==t.due&&gk>=t.due&&gk<=t.end71)drop.date=addDays(drop.date,-diffDays(gk,t.due));   // 잡은 날이 놓은 날에 오게 통째로
      if(drop.type==='allday'&&t.time&&drop.date!==t.due)KT72={id,time:t.time,dur:t.dur}}   // 다른 날 종일 칸으로 옮겨도 시각은 그대로
  }catch(e){console.error(e)}
  const r=prev.apply(this,arguments);
  try{if(KT72){const t=TASKS[KT72.id];if(t&&!t.time){t.time=KT72.time;if(KT72.dur)t.dur=KT72.dur;saveTask(t);ui.calKeepScroll=true;render()}}}catch(e){}KT72=null;return r}})(dndEnd);

/* ---- 3) 기록하기 '📅 다른 날' (A4): 숨은 날짜 칸을 눌러도 PC에서 달력이 안 열렸어요 → showPicker ---- */
addEventListener('click',e=>{const i=e.target;if(!i||i.tagName!=='INPUT'||i.type!=='date')return;const l=i.closest('.d69p,label.chipbtn');if(!l)return;try{if(i.showPicker)i.showPicker()}catch(x){}},true);

/* ---- 4) 같은 기록 두 번 (A5) ----
   ① 다른 기기에서 이미 체크한 반복 할 일을, 아직 안 바뀐 화면에서 또 누르면 '다음 회차'까지 끝내 버렸어요 → 막고 물어봐요.
   ② 겹친 기록 찾기: 같은 할 일이 같은 날 두 번, 또는 같은 카드가 3분 안에 두 번. */
addEventListener('click',e=>{const b=e.target.closest('[data-tdone]');if(!b)return;const t=TASKS[b.dataset.tdone];if(!t)return;const td=dateKey(),row=b.closest('.trow');
  if(t.status===2&&row&&!row.classList.contains('done')&&!b.textContent.includes('✓')){e.preventDefault();e.stopPropagation();render();toast('이미 끝낸 할 일이에요 (다른 화면에서 체크됨)');return}
  if(t.status===0&&t.rep&&t.rep.f&&t.due&&t.due>td&&((DAYS[td]||{}).entries||[]).some(x=>x.tid===t.id)&&!b.dataset.ok72){e.preventDefault();e.stopPropagation();render();
    toastAct(`'${t.title}' 오늘 이미 체크했어요`,'한 번 더 기록',()=>{ui.off=0;completeTask(t)},5200)}},true);
function dups72(days){const out=[],ok=new Set(C.dup72ok||[]),td=dateKey();
  for(let i=0;i<(days||21);i++){const k=addDays(td,-i),d=DAYS[k];if(!d||!d.entries)continue;const es=d.entries;
    for(let a=0;a<es.length;a++)for(let b=a+1;b<es.length;b++){const x=es[a],y=es[b];let same=false;
      if(x.tid&&x.tid===y.tid&&!x.rid&&!y.rid)same=true;
      else if(x.kind==='act'&&y.kind==='act'&&x.aid&&x.aid===y.aid&&x.t&&y.t&&Math.abs(toMin(x.t)-toMin(y.t))<=3)same=true;
      if(!same)continue;const key=k+'|'+[x.id,y.id].sort().join('|');if(!ok.has(key))out.push({k,x,y,key})}}
  return out}
function dupSheet72(){const ds=dups72(60);
  openSheet(`<div class="sh"><h3>🧹 겹친 기록</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <p class="help" style="margin:0 0 8px">같은 할 일이 같은 날 두 번, 또는 같은 카드가 3분 안에 두 번 들어간 것이에요. 하나를 지우면 점수도 같이 돌아가요.</p>
    ${ds.length?ds.map(d=>`<div class="dp72"><div><b>${esc(fmtD(d.k))}</b> ${esc(d.y.name)}<div class="tiny muted">${esc(d.y.t||'')} · ${esc(d.x.t||'')} · ✨${d.y.xp||0}</div></div><span class="row" style="gap:4px"><button type="button" class="chipbtn" data-dp72x="${d.k}|${d.x.id}">✕ 하나 지우기</button><button type="button" class="chipbtn" data-dp72ok="${esc(d.key)}">둘 다 맞아요</button></span></div>`).join(''):'<div class="empty">겹친 기록이 없어요.</div>'}`)}
addEventListener('click',e=>{const b=e.target.closest('[data-dp72x],[data-dp72ok]');if(!b)return;e.preventDefault();e.stopPropagation();
  if(b.dataset.dp72ok){C.dup72ok=[...(C.dup72ok||[]),b.dataset.dp72ok].slice(-200);save('config')}
  else{const [k,id]=b.dataset.dp72x.split('|');removeEntry(k,id)}
  dupSheet72()},true);
var DUPT72=0;
render=(function(prev){return function(){const r=prev.apply(this,arguments);try{if(!DUPT72&&ready72()){DUPT72=1;setTimeout(()=>{const n=dups72(21).length;if(n)toastAct(`🧹 같은 기록이 두 번 들어간 게 ${n}건 있어요`,'보기',dupSheet72,8000)},2500)}}catch(e){}return r}})(render);

/* ---- 5) 루틴 단계: 오늘 한 단계는 할 일 목록에서 빼기 (A6) ----
   루틴 체크 창·일퀘·홈에서 체크하면 t.last만 바뀌고(status 0) 목록엔 그대로 남아 있었어요. */
function stDoneHide72(k){return !!(k&&isRtKid71(k)&&k.status===0&&k.last===dateKey())}
function nestRows(arr,opt,whole){
  const inList=new Set((whole||arr).map(t=>t.id));
  return arr.filter(t=>!(t.parent&&inList.has(t.parent)&&TASKS[t.parent]&&TASKS[t.parent].status===0)).filter(t=>!stDoneHide72(t)).map(t=>{
    const kids=kidsOf(t.id).filter(k=>k.status===0&&!stDoneHide72(k));let h=taskRow(t,opt);
    if(!kids.length||t.status!==0)return h;
    const shut=tShut63(t);
    return h+(shut?'':`<div class="tkids" data-drop="reorder:kids" data-grp="${t.id}">${kids.sort(kidSort71(t)).map(k=>taskRow(k,{...opt,nested:1})).join('')}</div>`);
  }).join('');
}
taskMatches=(function(prev){return function(t,sel){if(stDoneHide72(t)&&sel!=='routine'&&sel!=='done')return false;return prev.apply(this,arguments)}})(taskMatches);

/* ---- 6) 몸무게 단계 (A7) ----
   단계가 '몸무게 재기' 할 일·몸무게 카드로 이어져 있으면 ⚖ 단계로 알아보게(입력칸이 안 나왔던 원인). 입력칸은 단계 이름 바로 밑으로. */
function isW72(s){if(!s||s.aid==='@weigh'||!s.tid)return false;const t=TASKS[s.tid];if(!t)return false;const a=t.aid&&C.actions.find(x=>x.id===t.aid);return !!((a&&a.link==='@weigh')||/몸무게|체중/.test(t.title||''))}
function healW72(){if(!ready72())return;let ch=false;(C.routines||[]).forEach(r=>(r.steps||[]).forEach(s=>{if(isW72(s)){s.aid='@weigh';ch=true}}));if(ch)save('config')}
render=(function(prev){return function(){try{healW72()}catch(e){}return prev.apply(this,arguments)}})(render);
startRun=(function(prev){return function(o){try{if(o&&o.routine&&o.routine.steps)o={...o,routine:{...o.routine,steps:o.routine.steps.map(s=>isW72(s)?{...s,aid:'@weigh'}:s)}}}catch(e){}return prev.call(this,o)}})(startRun);
drawHunt=(function(prev){return function(full){const r=prev.apply(this,arguments);try{const w=$('huntW'),n=$('huntName');if(w&&n){const l=w.closest('label');if(l&&l.previousElementSibling!==n){l.classList.add('w72');n.insertAdjacentElement('afterend',l)}}}catch(e){}return r}})(drawHunt);

/* ---- 7) 돌아보기 전 주·다음 주: 화면이 튀지 않게 (A8) — 다시 그리는 동안 높이를 잠깐 붙잡고 스크롤 위치를 되돌려요 ---- */
var RV72=0;
renderReview59=(function(prev){return function(){const se=document.scrollingElement,b=$('review59'),y=se?se.scrollTop:0,mn=document.querySelector('main'),my=mn?mn.scrollTop:0,h=b?b.offsetHeight:0;
  if(b&&h)b.style.minHeight=h+'px';const r=prev.apply(this,arguments);
  const back=()=>{if(se)se.scrollTop=y;if(mn)mn.scrollTop=my};back();requestAnimationFrame(back);clearTimeout(RV72);RV72=setTimeout(()=>{if(b)b.style.minHeight=''},700);return r}})(renderReview59);

/* ---- 8) 상점: 잘못 산 것 바로 취소 (A9) ---- */
addEventListener('click',e=>{const b=e.target.closest('[data-buy]');if(!b)return;const before=new Set((today().entries||[]).map(x=>x.id));
  setTimeout(()=>{const e2=(today().entries||[]).find(x=>x.kind==='buy'&&!before.has(x.id));const tx=$('luTxt');if(!e2||!tx||$('levelup').hidden||tx.querySelector('[data-buy72]'))return;
    tx.insertAdjacentHTML('beforeend',`<div style="margin-top:10px"><button type="button" class="btn ghost sm" data-buy72="${e2.id}">↶ 잘못 눌렀어요 · 취소 (💰${Math.abs(e2.gold||0)} 돌려받기)</button></div>`)},0)},true);
addEventListener('click',e=>{const b=e.target.closest('[data-buy72]');if(!b)return;e.preventDefault();e.stopPropagation();$('levelup').hidden=true;removeEntry(dateKey(),b.dataset.buy72);toast('구매를 취소했어요 · 골드를 돌려받았어요')},true);

/* ---- 9) 타이머: 다 못 했어도 '여기까지 한 만큼' 기록 (A12) ----
   점수 = 기본 점수 × (한 시간 / 목표 시간, 최대 1) × ½ · 할 일은 안 끝난 채로 남고, 시도한 분은 t.tried72에 쌓여요. */
function part72(){if(!RUN)return;const R=RUN,isR=R.kind==='routine',st=isR?R.steps[R.si]:null;const el=isR?stepElapsed():runElapsed(),min=Math.max(1,Math.round(el/60));
  let base=0,cond=0,area='mind',name='',tid=null,aid=null;
  if(isR){const t=st&&st.tid&&TASKS[st.tid],a=(t&&t.aid&&C.actions.find(x=>x.id===t.aid))||(st&&st.aid&&C.actions.find(x=>x.id===st.aid));
    if(t){const b=taskBase(t);base=b.xp;cond=b.cond||0;area=areaOfTask(t)||area;tid=t.id}else if(a){base=+a.xp||0;cond=Math.abs(+a.cond||0);area=a.area||area;aid=a.id}name=stName61(st)}
  else if(R.kind==='task'){const t=TASKS[R.id];if(t){const b=taskBase(t);base=b.xp;cond=b.cond||0;area=areaOfTask(t)||area;tid=t.id}name=R.name}
  else{const a=C.actions.find(x=>x.id===R.id);if(a){base=+a.xp||0;cond=Math.abs(+a.cond||0);area=a.area||area;aid=a.id}name=R.name}
  const tgt=isR?(+st.min||5):(+R.target||25),f=Math.min(1,el/60/tgt)*.5;
  const e={kind:'free',type:'good',name:`${name} · 여기까지 ${min}분`,area,xp:Math.max(1,Math.round(base*f)),gold:0,cond:Math.round(cond*f),dur:min,part72:1};
  const s0=new Date(Date.now()-el*1000);e.st=pad(s0.getHours())+':'+pad(s0.getMinutes());if(tid)e.ptid72=tid;if(aid)e.paid72=aid;
  ui.off=0;commit(()=>applyEntry(today(),e));if(tid){const t=TASKS[tid];t.tried72=(t.tried72||0)+min;saveTask(t)}
  if(isR){R.log.push({name:st.name,sec:Math.round(el),target:(+st.min||5)*60,skip:1});finishRoutine();setTimeout(()=>toast(`📝 ${name} ${min}분 · ✨${e.xp} 기록했어요`),400)}
  else{endRun(true);popup('여기까지','📝',`<b>${esc(name)}</b><br>${min}분 한 만큼 기록했어요 · ✨${e.xp}${e.cond?` · 컨디션 +${e.cond}`:''}<br><span class="muted">${tid?'할 일은 그대로 남아 있어요. 다음에 이어서 해요.':'끝까지 하면 원래 점수를 받아요.'}</span>`,'✨'+e.xp)}}
quitAsk62=(function(prev){return function(){const r=prev.apply(this,arguments);try{const q=document.querySelector('#hunt .q62 .stack');if(q&&RUN){const isR=RUN.kind==='routine',el=isR?stepElapsed():runElapsed();
  if(el>=30){const bq=q.querySelector('[data-q62="quit"]');const b=document.createElement('button');b.className='btn';b.dataset.q72='part';b.textContent=`📝 ${isR?'지금 단계를 ':''}여기까지 한 만큼 기록 (${Math.max(1,Math.round(el/60))}분)`;q.insertBefore(b,bq)}}}catch(e){console.error(e)}return r}})(quitAsk62);
addEventListener('click',e=>{const b=e.target.closest('[data-q72]');if(!b)return;e.preventDefault();e.stopPropagation();const q=b.closest('.q62');if(q)q.remove();part72()},true);

/* ---- 10) '늦게 잠' 카드 (A13, 사용자 요청: 이 카드만) ----
   a.morn72 = 다음 날 아침에 적는 카드: 오후 2시 전에 누르면 '어제'가 골라져 있고, 그렇게 적어도 지난 날 기록(늦게 적음)이 아니라 그날 기록으로 쳐요(✍ 보너스도). */
function sleepCard72(){return C.actions.find(a=>a.type==='bad'&&/늦게\s*잠|늦게\s*자/.test(a.name||''))}
var SLEEP_OPTS72=[{id:'s0',name:'자정~1시',cond:4,gold:0},{id:'s1',name:'1~2시',cond:8,gold:0},{id:'s2',name:'2~3시',cond:13,gold:0},{id:'s3',name:'3~4시',cond:18,gold:0},{id:'s4',name:'4시 넘어·밤샘',cond:25,gold:0}];
function migSleep72(){if(C.mig72sleep||!ready72())return;const a=sleepCard72();C.mig72sleep=1;if(!a){save('config');return}
  C.bak72sleep=JSON.parse(JSON.stringify(a));a.opts=SLEEP_OPTS72.map(o=>({...o}));a.cond=8;a.gold=0;a.xp=0;a.morn72=1;if(!a.area)a.area='body';
  a.desc=a.desc||'잠든 시각으로 골라요. 아침에 일어나서 적으면 어젯밤으로 들어가고, 늦게 적었다고 손해 보지 않아요.';save('config');
  setTimeout(()=>toastAct(`'${a.name}' 카드를 고쳤어요 · 잠든 시각별 5단계 · 아침에 적어도 손해 없음`,'되돌리기',()=>{const i=C.actions.findIndex(x=>x.id===a.id);if(i>=0&&C.bak72sleep){C.actions[i]=C.bak72sleep;delete C.bak72sleep;save('config');render();toast('예전 카드로 되돌렸어요')}},9000),1800)}
render=(function(prev){return function(){try{migSleep72()}catch(e){console.error(e)}return prev.apply(this,arguments)}})(render);
function mornOK72(a){const h=hr72();return !!(a&&a.morn72&&h>=(+C.dayStart||0)&&h<14)}
drawDoneSheet=(function(prev){return function(){const S=sheetCtx;try{if(S&&S.a&&!S.e&&!S.m72){S.m72=1;if(mornOK72(S.a)&&!S.w70){S.w70='y1';S.d69=addDays(dateKey(),-1);S.atK='pick';S.at=null}}}catch(e){}
  const x=prev.apply(this,arguments);
  try{if(S&&S.a&&!S.e&&mornOK72(S.a)&&S.d69===addDays(dateKey(),-1)){const w=document.querySelector('#sheetC .w70 .warn69');if(w){w.className='tiny muted';w.textContent=`🌙 아침에 적어도 그날 기록 · ✍ ✨+${otbCfg69().xp}`}}}catch(e){}
  return x}})(drawDoneSheet);
applyEntry=(function(prev){return function(day,e){let fix=false;
  try{const a=e&&e.aid&&C.actions.find(x=>x.id===e.aid);if(a&&mornOK72(a)&&day&&day.date===addDays(dateKey(),-1)&&!e.id){fix=true;const o=otbCfg69();
    if(o.on&&o.xp>0&&!e.otb69){const used=(day.entries||[]).reduce((s,x)=>s+(+x.otb69||0),0),g=Math.min(o.xp,o.max-used);if(g>0){e.otb69=g;e.xp=(+e.xp||0)+g}}}}catch(x){}
  const r=prev.apply(this,arguments);if(fix&&e){delete e.late;e.morn72=1}return r}})(applyEntry);

/* ---- 11) 안내 ---- */
F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['🧹 겹친 기록 찾기','기능 지도 · (겹친 게 있으면 시작할 때 알림)','같은 할 일이 같은 날 두 번 · 같은 카드가 3분 안에 두 번 → 하나 지우기',()=>dupSheet72(),'중복 두번 겹침 기록 정리'],
  ['📝 여기까지 기록','타이머 → 그만 → 여기까지 한 만큼 기록','다 못 했어도 한 시간만큼 점수(절반 비율) · 할 일은 남아요',()=>{},'타이머 부분 중간 그만'],
  ['🙈 캘린더 숨김','캘린더 제목 옆 🙈 · 할 일 상세','캘린더 거르기 때문에 안 보이는 일정 알려 주기 · 바로 보이게',()=>{location.hash='cal'},'캘린더 안보임 거르기 필터']])}})(F67);
