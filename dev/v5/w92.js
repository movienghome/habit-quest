/* ---- v9.3 다시 씩씩해지기: ① 🫠 오늘은 하나만(할 일 하나만 남기고 나머지는 내일로, ☠ 없이) ② 🌱 복귀 표시(못 한 날 뒤 첫 걸음) ③ 다시 오르는 길(홈 경보판 맨 위 한 줄) ----
   저장: C.rest93={게임날짜:{keep,moved:[{id,from,sk,mv72,skip,sk61}],at,td,tom}} · C.back93={게임날짜:{n,from,e}} (둘 다 C 최상위 — normConfig가 보존)
   '내려간 날' = 쉬는 날(rest93) · 컨디션이 복귀 기준 아래(low, 기존 복귀 보너스와 같은 기준) · 기록이 빈 날(gap, 앞에 기록이 있을 때만). */
{
  const GD=()=>gk76(),TD=()=>midKey68();
  const R93=()=>(C.rest93=C.rest93&&typeof C.rest93==='object'?C.rest93:{});
  const B93=()=>(C.back93=C.back93&&typeof C.back93==='object'?C.back93:{});
  const THR93=()=>+((C.recovery||{}).threshold)||40;
  const GOODK93=['act','task','courage','routine','free','happy','five','director','counter','check'];

  /* ---- 내려간 날 ---- */
  function firstData93(){let f=null;for(const k in DAYS){if(hasData(DAYS[k])&&(!f||k<f))f=k}return f}
  function downOf93(k){
    if(R93()[k])return 'rest';
    const d=DAYS[k];
    if(d&&hasData(d))return overallOf(d)<THR93()?'low':null;
    const f=firstData93();return f&&f<k&&k<GD()?'gap':null;
  }
  function runLen93(y){let n=0;for(let i=0;i<14;i++){if(downOf93(addDays(y,-i)))n++;else break}return n}

  /* ---- ① 오늘은 하나만 ---- */
  function cand93(){
    const td=TD(),mv=[],fx=[];
    openTasks().filter(t=>t.status===0&&t.due&&t.due<=td&&!t.cb76&&!t.ml80&&!t.parent&&!t.rid).forEach(t=>{
      const rep=!!(t.rep&&t.rep.f);
      if(t.time||span71(t)||(rep&&t.rep.f==='x'))fx.push(t);else mv.push(t);
    });
    // 남길 후보 추천: 중요도 높은 것 → 마감 빠른 것 → 짧은 것
    mv.sort((a,b)=>(b.prio||0)-(a.prio||0)||(a.due<b.due?-1:a.due>b.due?1:0)||((+a.dur||999)-(+b.dur||999)));
    return {mv,fx};
  }
  function sheet93(){
    const {mv,fx}=cand93(),td=TD();
    const rows=mv.map((t,i)=>`<label class="r93"><input type="radio" name="k93" value="${t.id}"${i===0?' checked':''}><span><b>${esc(t.title)}</b><small>${i===0?' · 추천':''}${(t.prio||0)>=3?' · 중요':''}${t.dur?' · '+t.dur+'분':''}${t.due<td?' · 밀려 있어요':''}${t.rep&&t.rep.f?' · ↻ 반복':''}</small></span></label>`).join('');
    openSheet(`<div class="sh"><h3>🫠 오늘은 하나만</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
      <p class="small" style="margin:0">오늘 꼭 할 것 하나만 남기고 나머지는 내일로 옮겨요. 미룬 게 아니라서 ☠도 안 붙고, 언제든 되돌릴 수 있어요.</p>
      <div class="l93">${rows}<label class="r93"><input type="radio" name="k93" value=""${mv.length?'':' checked'}><span><b>하나도 안 남기기</b><small> · 오늘은 쉬어요</small></span></label></div>
      ${fx.length?`<p class="tiny muted" style="margin:0">시각이 있는 일정·루틴·주 N회 ${fx.length}개는 그대로 있어요: ${fx.slice(0,4).map(t=>esc(t.title)).join(' · ')}${fx.length>4?' …':''}</p>`:''}
      ${mv.length?'':'<p class="tiny muted" style="margin:0">옮길 할 일이 없어요. 쉬는 날로만 표시할게요.</p>'}
      <div class="row" style="gap:8px;flex-wrap:wrap"><button type="button" class="btn" data-go93="1">이대로 정하기</button><button type="button" class="btn ghost" data-sheet="close">그만두기</button></div>`);
    sheetCtx={b93:1};
  }
  function doRest93(keepId){
    const td=TD(),tom=addDays(td,1),g=GD(),{mv}=cand93(),rec={keep:keepId||null,moved:[],at:Date.now(),td,tom};
    mv.forEach(t=>{
      if(t.id===keepId)return;
      const m={id:t.id,from:t.due,sk:t.skull||0,mv72:t.moved72||0};
      if(t.rep&&t.rep.f){   // 반복 할 일 = 오늘은 건너뛰기(skipToday61과 같은 방식, ☠ 없이)
        m.skip=1;m.sk61=(t.skip61||[]).slice();
        t.skip61=[...new Set([...(t.skip61||[]).filter(d=>d>=addDays(td,-14)),td])];
        const nd=nextDue(t.rep,td);if(nd)t.due=nd;
        delete t.skull;
      }else{t.due=tom;t.moved72=(t.moved72||0)+1}   // 한 번짜리 = 내일로(사정상 옮김, ☠ 안 올림)
      saveTask(t);rec.moved.push(m);
    });
    const R=R93();R[g]=rec;
    Object.keys(R).sort().slice(0,-60).forEach(k=>delete R[k]);
    syncDailies(C);save('config');render();
    const k=keepId&&TASKS[keepId],n=rec.moved.length;
    toastAct(k?`오늘은 '${k.title}' 하나만 · 나머지 ${n}개는 내일로`:`오늘은 쉬어요${n?` · ${n}개는 내일로`:''}`,'되돌리기',()=>undoRest93(g),7000);
  }
  function undoRest93(date){
    const r=R93()[date];if(!r)return;
    r.moved.forEach(m=>{const t=TASKS[m.id];if(!t)return;
      if(m.skip){t.skip61=m.sk61||[];if(!t.skip61.length)delete t.skip61;t.due=m.from;if(m.sk)t.skull=m.sk;else delete t.skull}
      else if(t.due===r.tom){t.due=m.from;if(m.mv72)t.moved72=m.mv72;else delete t.moved72}   // 그새 다른 날로 옮겼으면 그대로 둠
      saveTask(t)});
    delete R93()[date];syncDailies(C);save('config');render();toast('되돌렸어요 · 할 일을 원래 날짜로');
  }

  /* ---- ② 복귀 표시: 내려간 날 다음 날, 오늘 처음 하는 좋은 기록 ---- */
  const qual93=e=>!!(e&&e.type==='good'&&GOODK93.includes(e.kind));
  applyEntry=(function(prev){return function(day,e){
    const r=prev.apply(this,arguments);
    try{
      if(day&&e&&day.date===GD()&&!e.late&&qual93(e)&&!B93()[day.date]){
        const y=addDays(day.date,-1),dn=downOf93(y);
        if(dn){const n=runLen93(y);B93()[day.date]={n,from:dn,e:e.id};const first=!e.back93;e.back93=n;save('config');
          if(first)setTimeout(()=>toast(`🌱 다시 씩씩해졌어요! ${n>1?n+'일 만의 ':''}첫 걸음이에요`),700)}
      }
    }catch(x){console.error(x)}
    return r}})(applyEntry);
  unapplyEntry=(function(prev){return function(day,e){
    const r=prev.apply(this,arguments);
    try{const b=e&&e.back93&&day&&B93()[day.date];if(b&&b.e===e.id){delete B93()[day.date];save('config')}}catch(x){console.error(x)}
    return r}})(unapplyEntry);
  // 쉬어 간 다음 날도 기존 복귀 보너스(컨디션이 낮았던 다음 날 경험치 ×배수)를 받음
  recoveryActive=(function(prev){return function(){
    if(prev.apply(this,arguments))return true;
    try{return !!(C.rest93&&C.rest93[dateKey(-ui.off-1)])}catch(x){return false}}})(recoveryActive);

  /* ---- ③ 다시 오르는 길: 홈 경보판 맨 위 한 줄(할 말이 있을 때만) ---- */
  function rowHTML93(){
    const g=GD(),y=addDays(g,-1),rr=R93()[g],bk=B93()[g],dn=downOf93(y);
    if(bk){const tot=Object.keys(B93()).length;
      return `<li class="info b93"><span class="ic">🌱</span><span><b>다시 씩씩해졌어요</b> · ${bk.n>1?bk.n+'일 만에 ':''}첫 걸음${rr?' · 오늘은 하나만 하는 날':''} <span class="tiny muted">복귀 ${tot}번째</span></span></li>`}
    if(!rr&&!dn)return '';
    const lab={rest:'쉬었어요',low:'힘든 날이었어요',gap:'기록이 없었어요'};
    const sh={rest:'쉼',low:'힘든 날',gap:'비운 날'};
    const path=dn?`<span class="p93" aria-label="다시 오르는 길"><i>✓ 어제 ${sh[dn]}</i><i>▸ 오늘 첫 걸음</i><i>🌱 복귀</i></span>`:'';
    const bonus=dn&&recoveryActive()?` · 복귀하면 경험치 ×${(C.recovery||{}).mult||1.5}`:'';
    if(rr){const k=rr.keep&&TASKS[rr.keep],n=rr.moved.length;
      return `<li class="info b93"><span class="ic">🫠</span><span>${k?`오늘은 <b>${esc(k.title)}</b> 하나만`:'<b>오늘은 쉬는 날</b>'}${n?` · 나머지 ${n}개는 내일로`:''} <button type="button" class="chipbtn" data-undo93="${g}">되돌리기</button>${path?'<br>'+path:''}</span></li>`}
    return `<li class="info b93"><span class="ic">🌱</span><span><b>다시 오르는 길</b> · 어제는 ${lab[dn]}. 오늘은 작은 걸음 하나면 돼요${bonus}<br>${path} <button type="button" class="chipbtn" data-open93="1">🫠 오늘은 하나만</button></span></li>`;
  }
  function row93(){
    const ul=document.getElementById('alerts');if(!ul)return;
    ul.querySelectorAll('.b93').forEach(x=>x.remove());
    if(typeof ready!=='undefined'&&!ready)return;
    const h=rowHTML93();if(!h)return;
    const only=ul.children.length===1&&/특별한 경보가 없어요/.test(ul.textContent);
    if(only)ul.innerHTML='';
    ul.insertAdjacentHTML('afterbegin',h);
  }
  render=(function(prev){return function(){const r=prev.apply(this,arguments);try{row93()}catch(x){console.error(x)}return r}})(render);

  /* ---- 🍬 지금 어때? 에서 '몸이 지쳤어요'·'심신이 지쳤어요'를 고르면 같은 단추 ---- */
  openDopaNow=(function(prev){return function(){
    const r=prev.apply(this,arguments);
    try{if(ui.dst==='both'||ui.dst==='body'){const sc=$('sheetC'),st=sc&&sc.querySelector('.stack');
      if(st&&!sc.querySelector('.b93d')){const g=GD(),rr=R93()[g];
        st.insertAdjacentHTML('beforebegin',rr?`<div class="b93d small">🫠 오늘은 하나만 하는 날이에요 <button type="button" class="chipbtn" data-undo93="${g}">되돌리기</button></div>`
          :`<div class="b93d"><button type="button" class="btn sm" data-open93="1">🫠 오늘은 하나만 남기기</button><span class="tiny muted"> 나머지는 내일로 (☠ 없이)</span></div>`)}}}catch(x){console.error(x)}
    return r}})(openDopaNow);

  addEventListener('click',e=>{
    const o=e.target.closest('[data-open93]');if(o){e.preventDefault();e.stopPropagation();sheet93();return}
    const g=e.target.closest('[data-go93]');if(g){e.preventDefault();e.stopPropagation();const r=document.querySelector('#sheetC input[name=k93]:checked');const id=r?r.value:'';closeSheet();doRest93(id);return}
    const u=e.target.closest('[data-undo93]');if(u){e.preventDefault();e.stopPropagation();undoRest93(u.dataset.undo93)}
  },true);
  addEventListener('change',e=>{if(e.target&&e.target.matches&&e.target.matches('input[name=k93]'))e.stopPropagation()},true);

  F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
    ['🌱 다시 씩씩해지기','🍬 지금 어때? · 홈 경보판','힘든 날엔 "🫠 오늘은 하나만 남기기"로 할 일 하나만 남기고 나머지를 내일로 옮겨요(☠ 없음, 되돌리기 가능, 시각 있는 일정·루틴은 그대로). 쉬거나 힘들었거나 기록이 빈 날 다음에 첫 걸음을 하면 🌱 복귀로 표시하고, 쉬어 간 다음 날도 복귀 보너스 경험치를 받아요.']])}})(F67);
}
