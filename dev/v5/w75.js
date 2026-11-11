/* ================= v7.5 — H 묶음: 루틴 실행 중 되돌리기·단계 고치기 · 미니 창 = 단계 시간 · 일부만 해도 일퀘 · 이번 기록 점수 직접 · 폰 캘린더 길이 손잡이 =================
   1) 루틴 실행 화면: ↶ 이전 단계(시간 이어서) · 단계 이름을 누르면 되돌리기/먼저 하기/오늘은 건너뛰기/분/루틴에서 빼기 · ＋ 단계 넣기(오늘만/앞으로도)
   2) 내린 미니 창·탭 제목 = 지금 단계 시간(예전엔 전체 시간)
   3) 목록: 루틴 머리 밑에 '✓ 오늘 한 단계' 칩 — 누르면 그 단계 되돌리기(체크한 단계는 목록에서 사라져서 되돌릴 길이 안 보였음)
   4) 루틴을 일부만 해도 그 루틴 일퀘는 한 걸로
   5) 기록 창 '✎ 점수 고치기' = 연결(카드·용기)은 그대로, 이번 기록 점수만 / 카드와 이은 할 일도 '직접 정하기'
   6) 폰 캘린더: 블록 길이 손잡이를 크게(블록 아래로 삐져나오게) */

/* ---- 1) 루틴 실행 화면 ---- */
function rt75(){return RUN&&RUN.kind==='routine'?(C.routines||[]).find(x=>x.id===RUN.id)||null:null}
function hTgt75(){RUN.target=RUN.steps.reduce((a,x)=>a+(+x.min||0),0)}
// 지금 단계의 시계를 맞춤: 하다 만 단계(s.el75초)면 거기서 이어서
function hSetCur75(){if(!RUN)return;const s=RUN.steps[RUN.si];if(!s)return;const el=+s.el75||0;delete s.el75;
  RUN.stepStart=Date.now()-el*1000;RUN.stepPaused=0;if(RUN.pauseAt)RUN.pauseAt=Date.now();delete RUN.beeped;delete RUN.chime70;hTgt75();runSave();drawHunt(true)}
function hPark75(){const c=RUN&&RUN.steps[RUN.si];if(c)c.el75=Math.round(stepElapsed())}
function rsOf75(r,s){return r&&s?(r.steps||[]).findIndex(x=>x.id===s.id||(s.tid&&x.tid===s.tid)):-1}
// 끝낸(건너뛴) 단계 j를 다시: 기록을 되돌리고 그 단계로 돌아감. 하던 단계는 바로 다음 차례로(쓴 시간 그대로).
function hRedo75(j){if(!RUN||RUN.kind!=='routine')return;const lg=RUN.log[j],s=RUN.steps[j];if(!lg||!s||j>=RUN.si)return;
  if(!lg.skip&&s.tid){try{stUndo74(RUN.id,s.tid,dateKey())}catch(e){console.error(e)}}
  if(!RUN||RUN.kind!=='routine')return;
  hPark75();RUN.steps.splice(j,1);RUN.log.splice(j,1);RUN.si--;RUN.steps.splice(RUN.si,0,s);s.el75=lg.skip?0:(+lg.sec||0);delete s.skip75;hSetCur75();
  setTimeout(()=>toast(lg.skip?`'${s.name}' 지금 해요`:`↶ '${s.name}' 체크를 되돌렸어요 · 시간은 이어서`),60)}
// 아직 안 한 단계 j를 지금 먼저
function hFirst75(j){if(!RUN||j<=RUN.si||!RUN.steps[j])return;hPark75();const s=RUN.steps.splice(j,1)[0];delete s.skip75;RUN.steps.splice(RUN.si,0,s);hSetCur75()}
function hSkip75(j){const s=RUN&&RUN.steps[j];if(!s||j<=RUN.si)return;if(s.skip75)delete s.skip75;else s.skip75=1;runSave();drawHunt(true)}
function hMin75(j,v){const s=RUN&&RUN.steps[j];if(!s)return;v=Math.max(1,Math.min(240,Math.round(v)||1));s.min=v;
  const r=rt75(),i=rsOf75(r,s);if(i>=0){const rs=r.steps[i];rs.min=v;const t=TASKS[rs.tid];if(t){t.dur=v;saveTask(t)}save('config')}
  hTgt75();runSave();drawHunt(true)}
// 실행 목록에서만 뺌(RUN). 지금 단계면 다음 단계로, 마지막이었으면 끝냄.
function hDrop75(j){if(!RUN||!RUN.steps[j]||j<RUN.si)return;RUN.steps.splice(j,1);
  if(j===RUN.si){if(RUN.steps[RUN.si]){hSetCur75();hAfter75(true);return}
    if(RUN.log.length){finishRoutine();return}endRun();return}
  hTgt75();runSave();drawHunt(true)}
// 루틴에서 빼기(앞으로도) — 루틴 편집의 '빼기'와 같은 길(unstep62), 되돌리기 알림
function hDel75(j){const r=rt75(),s=RUN&&RUN.steps[j];if(!s)return;const i=rsOf75(r,s);
  if(s.tmp75||i<0){hDrop75(j);return}
  if(r.steps.length<=1){toast('단계는 하나 이상 있어야 해요');return}
  const nm=s.name,rid=r.id,keep={...s};const undo=unstep62(r,i,true);hDrop75(j);
  setTimeout(()=>toastAct(`'${nm}' 단계를 루틴에서 뺐어요 (앞으로도)`,'되돌리기',()=>{try{undo&&undo()}catch(e){console.error(e)}
    if(RUN&&RUN.kind==='routine'&&RUN.id===rid){RUN.steps.splice(Math.min(RUN.si+1,RUN.steps.length),0,keep);hTgt75();runSave();drawHunt(true)}},7000),80)}
// 단계 넣기: 지금 단계 바로 다음. keep = 루틴에도 넣기(할 일로 생김), 아니면 오늘만(점수 없는 체크)
function hAdd75(v,keep){const r=rt75();v=(v||'').trim();if(!v||!RUN||RUN.kind!=='routine')return false;
  let p={};try{p=parseQuick(v)||{}}catch(e){}const nm=(p.title||v).trim()||v,min=Math.max(1,+p.dur||5);let st=null;
  if(keep&&r){const cur=RUN.steps[RUN.si],ci=rsOf75(r,cur),a=C.actions.find(x=>x.name===nm&&x.type==='good');
    const s=rtAdd61(r,a?{aid:a.id,min:p.dur}:{name:nm,min},ci<0?null:ci+1);try{sync62(r)}catch(e){console.error(e)}
    const t=s&&TASKS[s.tid];if(t&&!a){t.dur=min;s.min=min;saveTask(t);save('config')}
    if(s)st={...s,name:stName61(s)}}
  if(!st)st={id:uid(),name:nm,min,tmp75:1};
  RUN.steps.splice(RUN.si+1,0,st);hTgt75();runSave();drawHunt(true);
  setTimeout(()=>toast(st.tmp75?`'${st.name}' 오늘만 넣었어요 (다음 단계)`:`'${st.name}' 단계를 루틴에 넣었어요 (다음 단계)`),60);return true}
// 단계를 넘긴 뒤: 미리 '오늘은 건너뛰기'로 표시한 단계는 넘기고, 다시 하러 온 단계는 시간 이어서
function hAfter75(quiet){let g=0,moved=false;
  while(RUN&&RUN.kind==='routine'&&RUN.steps[RUN.si]&&RUN.steps[RUN.si].skip75&&g++<60){const st=RUN.steps[RUN.si];
    RUN.log.push({name:st.name,sec:0,target:(+st.min||5)*60,skip:1,tid:st.tid});moved=true;
    if(RUN.si<RUN.steps.length-1)RUN.si++;else{finishRoutine();return}}
  if(!RUN||RUN.kind!=='routine')return;const s=RUN.steps[RUN.si];
  if(moved||(s&&s.el75))hSetCur75();else if(!quiet){/* 그대로 */}}
huntDo=(function(prev){return function(k){const R0=RUN,si0=RUN&&RUN.si;const x=prev.apply(this,arguments);
  try{if(RUN&&RUN===R0&&RUN.kind==='routine'&&(k==='done'||k==='skip')&&RUN.si!==si0)hAfter75()}catch(e){console.error(e)}return x}})(huntDo);

function hMenu75(j){const box=$('hunt');if(!box||!RUN||RUN.kind!=='routine')return;box.querySelectorAll('.m75').forEach(e=>e.remove());
  const d=document.createElement('div');d.className='q62 m75';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');let h='';
  if(j==='+'){h=`<b>＋ 단계 넣기</b><p class="small muted" style="margin:4px 0 8px">지금 단계 바로 다음에 들어가요</p>
    <input id="hAdd75" placeholder="예: 물 한 잔 3분" maxlength="60" enterkeyhint="done" autocomplete="off" aria-label="새 단계 이름">
    <label class="row small" style="gap:6px;margin:8px 0"><input type="checkbox" id="hKeep75" checked> 앞으로도 (루틴에 넣기) <span class="muted tiny">끄면 오늘만</span></label>
    <div class="row" style="gap:6px;justify-content:flex-end"><button class="btn ghost" data-m75="x">닫기</button><button class="btn go" data-m75="add">넣기</button></div>`}
  else{j=+j;const s=RUN.steps[j],lg=RUN.log[j];if(!s)return;const past=j<RUN.si,cur=j===RUN.si,r=rt75(),inRt=rsOf75(r,s)>=0;
    h=`<b>${esc(s.name)}</b><p class="small muted" style="margin:4px 0 8px">${past?(lg&&lg.skip?'건너뛴 단계':'끝낸 단계'):cur?'지금 하는 단계':'아직 안 한 단계'}${s.tmp75?' · 오늘만':''}</p><div class="stack" style="gap:6px">`;
    if(past)h+=`<button class="btn go" data-m75="redo:${j}">${lg&&lg.skip?'▶ 지금 이 단계 하기':'↶ 체크 되돌리고 다시 하기'}</button>`;
    else{
      h+=`<div class="mn75"><span>⏱</span><button class="btn ghost sm" data-m75="min:${j}:-5" aria-label="5분 줄이기">−5</button><button class="btn ghost sm" data-m75="min:${j}:-1" aria-label="1분 줄이기">−1</button><b>${+s.min||5}분</b><button class="btn ghost sm" data-m75="min:${j}:1" aria-label="1분 늘리기">+1</button><button class="btn ghost sm" data-m75="min:${j}:5" aria-label="5분 늘리기">+5</button></div>`;
      if(!cur)h+=`<button class="btn go" data-m75="first:${j}">▶ 지금 이 단계 먼저</button><button class="btn ghost" data-m75="skip:${j}">${s.skip75?'건너뛰기 취소':'오늘은 건너뛰기'}</button>`;
      h+=`<button class="btn ghost bad62" data-m75="del:${j}">${inRt&&!s.tmp75?'× 루틴에서 빼기 (앞으로도)':'× 빼기'}</button>`}
    h+=`<button class="btn ghost" data-m75="x">닫기</button></div>${!past&&inRt?'<p class="tiny muted" style="margin:8px 0 0">분을 바꾸면 루틴에도 저장돼요</p>':''}`}
  d.innerHTML=`<div class="q62b">${h}</div>`;box.appendChild(d);
  setTimeout(()=>{const f=d.querySelector('#hAdd75')||d.querySelector('button');f&&f.focus()},30)}
function hAddGo75(){const i=$('hAdd75');if(!i)return;const v=i.value.trim();if(!v){i.focus();return}const keep=!!($('hKeep75')||{}).checked;
  document.querySelectorAll('#hunt .m75').forEach(e=>e.remove());hAdd75(v,keep)}
document.addEventListener('click',e=>{
  const m=e.target.closest('#hunt .m75');
  if(m){const b=e.target.closest('[data-m75]');if(!b){if(e.target===m)m.remove();return}
    e.preventDefault();e.stopPropagation();const [op,a,c]=b.dataset.m75.split(':');
    if(op==='add'){hAddGo75();return}
    m.remove();if(!RUN||RUN.kind!=='routine')return;
    if(op==='redo')hRedo75(+a);else if(op==='first')hFirst75(+a);else if(op==='skip')hSkip75(+a);else if(op==='del')hDel75(+a);
    else if(op==='min'){const s=RUN.steps[+a];if(s){hMin75(+a,(+s.min||5)+(+c));hMenu75(+a)}}
    return}
  const hb=e.target.closest('#hunt [data-h75]');if(hb){e.preventDefault();e.stopPropagation();if(RUN&&RUN.kind==='routine'&&RUN.log.length)hRedo75(RUN.log.length-1);return}
  const c=e.target.closest('#hunt .steps [data-hs75]');if(c){e.preventDefault();e.stopPropagation();hMenu75(c.dataset.hs75)}},true);
document.addEventListener('keydown',e=>{
  if(e.key==='Enter'&&e.target&&e.target.id==='hAdd75'){if(e.isComposing||e.keyCode===229)return;e.preventDefault();e.stopPropagation();hAddGo75();return}
  if((e.key==='Enter'||e.key===' ')&&e.target&&e.target.dataset&&e.target.dataset.hs75!=null&&e.target.closest('#hunt')){e.preventDefault();hMenu75(e.target.dataset.hs75);return}
  if(e.key==='Escape'){const m=document.querySelector('#hunt .m75');if(m){m.remove();e.stopPropagation()}}},true);
drawHunt=(function(prev){return function(full){const x=prev.apply(this,arguments);try{
  if(!full||!RUN||RUN.kind!=='routine')return x;const h=$('hunt');if(!h)return x;
  const sp=h.querySelector('.steps');
  if(sp&&!sp.querySelector('.add75')){[...sp.children].forEach((c,i)=>{c.dataset.hs75=i;c.tabIndex=0;c.setAttribute('role','button');const s=RUN.steps[i];
      if(s&&s.skip75&&i>RUN.si)c.classList.add('sk');
      c.title=i<RUN.si?'눌러서 되돌리기':i===RUN.si?'눌러서 분 바꾸기·빼기':'눌러서 먼저 하기·건너뛰기·빼기'});
    sp.insertAdjacentHTML('beforeend','<span class="add75" data-hs75="+" role="button" tabindex="0" title="단계 넣기 (오늘만 / 앞으로도)" aria-label="단계 넣기">＋</span>')}
  const ctl=h.querySelector('.ctl');
  if(ctl&&RUN.log.length&&!ctl.querySelector('[data-h75]')){const lg=RUN.log[RUN.log.length-1];
    ctl.insertAdjacentHTML('afterbegin',`<button class="btn ghost b75" data-h75="back" title="이전 단계로 · ${esc(lg.name)}${lg.skip?'':' 체크를 되돌려요'} (시간 이어서)" aria-label="이전 단계로">↶<small>이전</small></button>`);ctl.classList.add('c75')}
  const tip=h.querySelector('.arena > .small.muted:last-child');if(tip)tip.innerHTML=`${RUN.si+1}/${RUN.steps.length}단계 · <b>단계 이름을 누르면</b> 되돌리기·먼저 하기·빼기 · ＋ 넣기`;
}catch(e){console.error(e)}return x}})(drawHunt);

/* ---- 2) 내린 미니 창·탭 제목 = 지금 단계 시간 ---- */
function tickPill(){if(!RUN){$('huntPill').hidden=true;clearInterval(runIv);document.title=docTitle();return}
  const isR=RUN.kind==='routine',st=isR?RUN.steps[RUN.si]:null,el=Math.floor(isR?stepElapsed():runElapsed()),p=$('huntPill');
  const tg=isR&&st?(+st.min||5)*60:(+RUN.target||0)*60,nm=isR&&st?st.name||RUN.name:RUN.name;p.hidden=false;
  p.textContent=`🏹 ${mmss(el)}${tg?' / '+mmss(tg):''}${RUN.pauseAt?' ⏸':''} · ${nm}${isR?` (${RUN.si+1}/${RUN.steps.length})`:''}`;
  p.classList.toggle('over75',!!tg&&el>tg&&!(typeof flowOn70==='function'&&flowOn70()));
  document.title=`🏹 ${mmss(el)} · ${nm}`}

/* ---- 3) 목록: 루틴 머리 밑 '✓ 오늘 한 단계' 칩 (누르면 되돌리기) ----
   체크한 단계는 목록에서 빠져서(v7.2) 되돌릴 길이 머리의 작은 '오늘 n개 ↶'뿐이었어요. nestRows를 다시 선언(w72 것 + 칩 줄). */
function dn75(t){try{const r=t&&t.status===0&&C.mig62&&rtOfT62(t);if(!r)return '';const D=dateKey();
  const st=(r.steps||[]).filter(s=>{const k=TASKS[s.tid];return k&&k.status!==-1&&k.last===D&&stDone62(k)});if(!st.length)return '';
  return `<div class="dn75" role="group" aria-label="오늘 한 단계"><span class="lb">✓ 오늘 한 단계 <small>누르면 되돌려요</small></span>${st.map(s=>`<button type="button" class="chipbtn" data-u74s="${s.tid}" data-u74r="${r.id}" title="'${esc(stName61(s))}' 체크 되돌리기">${esc(stName61(s))} ↶</button>`).join('')}</div>`}catch(e){return ''}}
function nestRows(arr,opt,whole){
  const inList=new Set((whole||arr).map(t=>t.id));
  return arr.filter(t=>!(t.parent&&inList.has(t.parent)&&TASKS[t.parent]&&TASKS[t.parent].status===0)).filter(t=>!stDoneHide72(t)).map(t=>{
    const kids=kidsOf(t.id).filter(k=>k.status===0&&!stDoneHide72(k));let h=taskRow(t,opt)+dn75(t);
    if(!kids.length||t.status!==0)return h;
    const shut=tShut63(t);
    return h+(shut?'':`<div class="tkids" data-drop="reorder:kids" data-grp="${t.id}">${kids.sort(kidSort71(t)).map(k=>taskRow(k,{...opt,nested:1})).join('')}</div>`);
  }).join('')}

/* ---- 4) 루틴을 일부만 해도 그 루틴 일퀘는 한 걸로 ----
   예전: 루틴 일퀘는 완주(또는 머리 할 일 기록)여야 ☑. 이제 그날 단계를 하나라도 했으면 ☑(몸무게만 적은 건 빼고 — 몸무게는 기록하기에서 적어도 단계가 체크되니까). */
tDone60=(function(prev){return function(tid,day){if(prev.apply(this,arguments))return true;
  try{const t=TASKS[tid],r=t&&t.rid&&(C.routines||[]).find(x=>x.id===t.rid);if(!r||!day)return false;const D=day.date;
    if((day.entries||[]).some(e=>{if(e.kind!=='routine'||e.rid!==r.id)return false;const m=/\((\d+)\/\d+\)$/.exec(e.name||'');return !!m&&+m[1]>0}))return true;
    return (r.steps||[]).some(s=>s.aid!=='@weigh'&&TASKS[s.tid]&&stOn69(TASKS[s.tid],D))}catch(e){return false}}})(tDone60);

/* ---- 5) 이번 기록 점수 직접 고치기 ----
   기록 창(새 기록·고치기) 미리보기 줄의 '✎ 점수 고치기' → ✨💰🔋 직접. 카드·용기 연결, 습관·일퀘 체크는 그대로이고 점수만 바뀜(e.px75).
   카드와 이은 할 일도 상세에서 '직접 정하기'(t.px) — 그 할 일만 다른 점수. */
function px75Apply(date,id,px){const day=DAYS[date],e=day&&(day.entries||[]).find(x=>x.id===id);if(!e||!px)return false;
  const neu=clone(e);neu.xp=Math.max(0,Math.round(+px.xp||0));neu.gold=Math.max(0,Math.round(+px.gold||0));neu.cond=Math.max(0,Math.round(+px.cond||0));
  if(neu.cond&&!neu.area)neu.area=(C.areas.find(a=>a.id==='life')||C.areas[0]||{}).id;neu.px75=1;
  replaceEntry(date,e,neu);
  try{const s=$('snack'),m=s&&!s.hidden&&snackRef&&snackRef.id===id&&s.querySelector('.m');if(m)m.textContent=`✓ ${neu.name} · +${neu.xp}XP ✎`}catch(x){}
  return true}
function px75Draw(){const S=sheetCtx,pv=$('sxPrev');if(!S||!pv||pv.querySelector('.px75'))return;
  const good=S.e?S.e.type!=='bad':(S.a?S.a.type==='good':true);if(!good)return;
  if(S.e&&!['act','task','courage','free'].includes(S.e.kind))return;
  if(S.px75){const v=S.px75;pv.innerHTML=`<span class="px75"><b>✎ 이번 기록 점수</b><label>✨<input type="number" inputmode="numeric" min="0" max="9999" data-px75="xp" value="${+v.xp||0}" aria-label="XP"></label><label>💰<input type="number" inputmode="numeric" min="0" max="9999" data-px75="gold" value="${+v.gold||0}" aria-label="골드"></label><label>🔋<input type="number" inputmode="numeric" min="0" max="99" data-px75="cond" value="${+v.cond||0}" aria-label="컨디션"></label><button type="button" class="chipbtn" data-px75off="1" title="원래 계산대로">자동으로</button></span>`}
  else pv.insertAdjacentHTML('beforeend',`<button type="button" class="chipbtn px75" data-px75on="1" title="카드·용기 연결은 그대로 두고, 이번 기록의 점수만 직접 정해요">✎ 점수 고치기</button>`)}
drawDoneSheet=(function(prev){return function(){const S=sheetCtx;
  try{if(S&&S.px75===undefined){if(S.e&&S.e.px75)S.px75={xp:+S.e.xp||0,gold:+S.e.gold||0,cond:+S.e.cond||0};
    else if(!S.e&&S.t&&S.t.px&&S.t.aid){const n=Math.max(1,+S.n||1);S.px75={xp:(+S.t.px.xp||0)*n,gold:(+S.t.px.gold||0)*n,cond:(+S.t.px.cond||0)*n};S.pxT75=1}}}catch(e){}
  const x=prev.apply(this,arguments);try{px75Draw()}catch(e){console.error(e)}return x}})(drawDoneSheet);
document.addEventListener('click',e=>{const b=e.target.closest('[data-px75on],[data-px75off]');if(!b)return;e.preventDefault();e.stopPropagation();const S=sheetCtx;if(!S)return;
  try{sheetRead()}catch(x){}
  if(b.dataset.px75on){const e0=S.e,same=e0&&(+S.n||1)===(+e0.n||1)&&(S.vid||null)===(e0.vid||null);const p=(same?e0:sheetPreview())||{};S.px75={xp:Math.max(0,+p.xp||0),gold:Math.max(0,+p.gold||0),cond:Math.max(0,+p.cond||0)}}else S.px75=null;
  drawDoneSheet();if(S.px75)setTimeout(()=>{const i=document.querySelector('#sxPrev [data-px75="xp"]');if(i){i.focus();i.select()}},30)},true);
['input','change'].forEach(ev=>document.addEventListener(ev,e=>{const i=e.target;if(!i||!i.dataset||!i.dataset.px75)return;e.stopPropagation();const S=sheetCtx;if(!S||!S.px75)return;
  S.px75[i.dataset.px75]=Math.max(0,Math.round(+i.value||0))},true));
sheetOK=(function(prev){return function(){const S=sheetCtx,px=S&&S.px75?{...S.px75}:null,ref0=snackRef;const r=prev.apply(this,arguments);
  try{if(px&&snackRef&&snackRef!==ref0)px75Apply(snackRef.date,snackRef.id,px)}catch(e){console.error(e)}return r}})(sheetOK);
sheetSave=(function(prev){return function(){const S=sheetCtx,px=S&&S.px75?{...S.px75}:null,id=S&&S.edit&&S.edit.id,d0=S&&S.edit&&S.edit.date,d1=S&&S.d69;const r=prev.apply(this,arguments);
  try{if(px&&id){const date=[d1,d0].find(k=>k&&DAYS[k]&&(DAYS[k].entries||[]).some(x=>x.id===id));if(date)px75Apply(date,id,px)}}catch(e){console.error(e)}return r}})(sheetSave);
// 오늘 한 일 줄: 직접 고친 점수 표시
logRow=(function(prev){return function(date,e){let h=prev.apply(this,arguments);
  try{if(e&&e.px75)h=h.replace('</span><span class="num muted tiny">',' <span class="px75m" title="점수를 직접 고친 기록">✎</span></span><span class="num muted tiny">')}catch(x){}return h}})(logRow);
// 카드와 이은 할 일도 '직접 정하기'(t.px): 보이는 점수 = 직접 정한 값, 기록은 카드 기록 그대로(습관·일퀘·통계) + 점수만 그 차이만큼
function pxOn75(t){return !!(t&&t.px&&t.aid&&!t.rid)}
taskBase=(function(prev){return function(t){const b=prev.apply(this,arguments);if(!b||!pxOn75(t))return b;
  return {...b,xp:Math.max(0,+t.px.xp||0),gold:Math.max(0,+t.px.gold||0),cond:Math.max(0,+t.px.cond||0)}}})(taskBase);
function base0_75(t){const s=t.px;delete t.px;try{return taskBase(t)}finally{t.px=s}}
completeTask=(function(prev){return function(t,ctx){let px=null,b0=null,day=null,ids=null;
  try{if(pxOn75(t)){px={...t.px};b0=base0_75(t);day=curDay();ids=new Set((day.entries||[]).map(e=>e.id))}}catch(e){px=null}
  const r=prev.apply(this,arguments);
  try{if(px&&b0&&day){const e=(day.entries||[]).find(x=>x.tid===t.id&&!ids.has(x.id)&&x.kind==='act');
    if(e&&!e.px75){const n=Math.max(1,+e.n||1);px75Apply(day.date,e.id,{xp:(+e.xp||0)+((+px.xp||0)-(+b0.xp||0))*n,gold:(+e.gold||0)+((+px.gold||0)-(+b0.gold||0))*n,cond:(+e.cond||0)+((+px.cond||0)-(+b0.cond||0))*n})}}}catch(e){console.error(e)}
  return r}})(completeTask);
drawTaskSheet=(function(prev){return function(){const x=prev.apply(this,arguments);try{
  const t=sheetCtx&&sheetCtx.task&&TASKS[sheetCtx.task],d=document.querySelector('#sheetC .px59');
  if(t&&t.aid&&!t.rid&&d&&!d.dataset.p75){d.dataset.p75=1;const a=C.actions.find(z=>z.id===t.aid),b0=base0_75(t);
    d.innerHTML=t.px?`<b class="small">이 할 일만 직접 정한 점수</b> <label>✨<input type="number" min="0" max="999" data-px59="xp" value="${+t.px.xp||0}" aria-label="XP"></label><label>💰<input type="number" min="0" max="999" data-px59="gold" value="${+t.px.gold||0}" aria-label="골드"></label><label>🔋<input type="number" min="0" max="99" data-px59="cond" value="${+t.px.cond||0}" aria-label="컨디션"></label><button class="chipbtn" data-px59off="1">카드 점수로 (${base59(b0.xp,b0.gold,b0.cond)})</button>`
      :`<span class="tiny muted">🃏 '${esc(a?a.name:'카드')}' 카드 점수 <b>${base59(b0.xp,b0.gold,b0.cond)}</b></span><button class="chipbtn" data-px59on="1" title="카드 연결(습관·일퀘·통계)은 그대로 두고 이 할 일만 다른 점수로">✎ 이 할 일만 직접 정하기</button>`}
}catch(e){console.error(e)}return x}})(drawTaskSheet);

/* ---- 6) 폰 캘린더: 블록 길이 손잡이 크게 ----
   손잡이가 블록 안 맨 아래 9px라 손가락으로 못 잡고 빈 곳을 누르게 됐어요. 터치 화면에선 손잡이를 블록 밖(아래로 14px)까지 걸치게 따로 놓음. */
function coarse75(){try{return !!window.__coarse75||matchMedia('(pointer:coarse)').matches}catch(e){return false}}
function rz75(){if(!coarse75())return;document.querySelectorAll('.blk > .rz').forEach(z=>{const b=z.parentElement;if(!b||!b.parentElement)return;
  const top=parseFloat(b.style.top)||0,ht=parseFloat(b.style.height)||b.offsetHeight||14,ins=Math.min(10,Math.round(ht*.35));
  const g=document.createElement('span');g.className='rz75';g.dataset.drag=z.dataset.drag;g.dataset.dragmode='now';g.setAttribute('aria-label','길이 바꾸기');
  g.style.top=(top+ht-ins)+'px';g.style.height=(ins+14)+'px';g.style.left=b.style.left;g.style.width=b.style.width;g.style.setProperty('--g75',ins+'px');
  b.after(g);z.remove()})}
renderCal=(function(prev){return function(){const x=prev.apply(this,arguments);try{rz75()}catch(e){console.error(e)}return x}})(renderCal);

/* ---- 7) 안내 ---- */
F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['↶ 루틴 실행 중 되돌리기·단계 고치기','루틴 실행 화면: ↶ 이전 · 단계 이름 누르기 · ＋','잘못 넘긴 단계로 돌아가요(시간 이어서). 단계 이름을 누르면 되돌리기·먼저 하기·오늘은 건너뛰기·분 바꾸기·루틴에서 빼기, ＋로 단계 넣기(오늘만/앞으로도)',()=>{location.hash='tasks'},'루틴 실행 이전 단계 되돌리기 단계 편집 추가 빼기 타이머'],
  ['✓ 오늘 한 단계 칩','할 일 목록: 루틴 머리 바로 밑','체크한 루틴 단계가 칩으로 남아요. 누르면 그 단계 체크를 되돌려요',()=>{location.hash='tasks'},'루틴 단계 되돌리기 취소 잘못 체크 오늘 한'],
  ['☑ 루틴 일부만 해도 일퀘','홈 일퀘','루틴 단계를 하나라도 하면 그 루틴 일퀘는 한 걸로(완주 보너스는 다 했을 때만)',()=>{location.hash='home'},'일퀘 루틴 일부 부분'],
  ['✎ 이번 기록 점수 고치기','기록 창(알림의 구슬·편집 / 오늘 한 일 줄) 미리보기 줄 · 할 일 상세 크기 칸','카드·용기 연결은 그대로 두고 이번 기록의 ✨💰🔋만 직접 정해요. 카드와 이은 할 일도 "이 할 일만 직접 정하기"',()=>{location.hash='log'},'점수 직접 수정 고치기 용기 카드 연결']])}})(F67);

/* ---- 8) 알림: 단추 있는 알림(toastAct) 뒤에 그냥 알림이 오면 안 보이는 알림이 화면 아래 누르기를 가로막던 것 ----
   toastAct가 pointer-events를 켜고 자기 타이머로 끄는데, 그 사이 toast()가 타이머를 지워서 계속 켜진 채 남았음. */
toast=(function(prev){return function(){try{const t=$('toast');if(t)t.style.pointerEvents=''}catch(e){}return prev.apply(this,arguments)}})(toast);
