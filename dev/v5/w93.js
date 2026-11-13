/* ---- v9.4 (w93.js): K1 내일 짜기 — 전날 밤 한 화면에서 내일 시간표 짜기 ----
   순서(기본, C.tm93ord로 바꿈): 📌 정해진 일정 → 🔁 주 N회 자리 → 🗓 종일 칸 일 → 🧽 관리 → 마무리(놓은 시간/하루 예산 한 줄 · '내일 짜기 끝').
   · 정해진 일정 = 'fixed' 목록 전부(사용자 확정 11/13). 시각 없는 것은 시각부터 정하게 맨 먼저 보여 줌(하그둘 만남도 이 목록).
   · 열기: 밤에 정해 둔 시각(C.tm93at, 기본 21:00)이 지나면 홈 오늘 칸에 한 줄 + 캘린더 줄 🌙 / ⋯ 설정 메뉴. 끝내면 C.tm93done[날짜]=1 → 그날 밤 다시 안 뜸.
   · 저장: C.tm93at · C.tm93ord · C.tm93done (모두 C 최상위 — normConfig가 보존). 예전 시간표 짜기 창(planSheet80)은 인자 없이 부르면 이 화면으로 감, 인자(날짜)가 있으면 그대로. */
{
  const KEY=()=>addDays(midKey68(),1);
  const ALL=[['fx','📌 정해진 일정'],['wk','🔁 주 N회'],['ad','🗓 종일 칸'],['care','🧽 관리']];
  let W=null;
  const done93=()=>{if(!C.tm93done||typeof C.tm93done!=='object'||Array.isArray(C.tm93done))C.tm93done={};return C.tm93done};
  const at93=()=>hm80(C.tm93at)!=null?C.tm93at:'21:00';
  const ord93=()=>{const o=Array.isArray(C.tm93ord)?C.tm93ord.filter(x=>ALL.some(a=>a[0]===x)):[];ALL.forEach(a=>{if(!o.includes(a[0]))o.push(a[0])});return o};
  const byTime=(a,b)=>hm80(a.time)-hm80(b.time);

  /* ---- 단계별 내용 ---- */
  function fx93(k){
    const open=Object.values(TASKS).filter(t=>t.status===0&&!t.cb76&&!t.ml80&&!t.rstep&&t.due===k&&!t.end71&&!hid76(t));
    const nt=open.filter(t=>t.list==='fixed'&&!t.time);
    const timed=tasksOn(k).filter(t=>t.status===0&&t.time&&hm80(t.time)!=null&&!t.cb76).sort(byTime);
    return {nt,timed};
  }
  function wk93(k){
    const ws=weekStart(k);
    return openTasks().filter(t=>wx91(t)&&calPass(t)&&!hid76(t)).map(t=>({t,n:wkCnt91(t,ws),N:+t.rep.n||3,ks:slotKeys91(t,ws),on:!!(t.sl91&&t.sl91[k]!==undefined)}))
      .filter(x=>x.n<x.N||x.on).sort((a,b)=>(b.t.prio||0)-(a.t.prio||0));
  }
  function ad93(k){
    return tasksOn(k).filter(t=>t.status===0&&!t.time&&!t.cb76&&!t.ml80&&!t.rstep&&!hid76(t)&&!wx91(t)&&!t.rid)
      .sort((a,b)=>(b.prio||0)-(a.prio||0)||(a.order||0)-(b.order||0));
  }
  const care93=k=>(typeof careDue76==='function'?careDue76(k):[]);
  const cnt93=(id,k)=>id==='fx'?(fx93(k).nt.length+fx93(k).timed.length):id==='wk'?wk93(k).length:id==='ad'?ad93(k).length:care93(k).length;

  /* ---- 빈 시간 찾기(주 N회 자리·종일 칸 일도 피함) ---- */
  function busy93(k,skipIds){const sk=new Set(skipIds||[]);return tasksOn(k).filter(t=>!sk.has(t.id)&&t.status===0&&t.time&&hm80(t.time)!=null).map(t=>{const s=hm80(t.time);return [s,s+(+t.dur||30)]})}
  function free93(k,d,busy){
    const p=pcfg80();let pos=Math.ceil(hm80(p.s)/5)*5;const e=hm80(p.e);
    if(k===midKey68()){const n=new Date(),nm=Math.ceil((n.getHours()*60+n.getMinutes())/15)*15;if(nm>pos)pos=nm}
    while(pos+d<=e){const hit=busy.find(b=>b[0]<pos+d&&b[1]>pos);if(!hit)return pos;pos=Math.ceil(hit[1]/5)*5}
    return null;
  }
  const durOpt=t=>{const v=+t.dur||0,o=[10,15,20,30,45,60,90,120,180];if(v&&!o.includes(v))o.push(v);o.sort((a,b)=>a-b);
    return `<select data-w93d="${t.id}" aria-label="${esc(t.title)} 길이">${v?'':'<option value="" selected>길이?</option>'}${o.map(m=>`<option value="${m}"${m===v?' selected':''}>${m>=60&&m%60===0?m/60+'시간':m+'분'}</option>`).join('')}</select>`};
  const nm93=t=>`<span class="w93n" data-w93t="${t.id}" role="button" tabindex="0">${(t.prio||0)>=3?'<b>!</b> ':''}${esc(t.title)}</span>`;

  /* ---- 화면 ---- */
  function seq93(k){return ord93().filter(id=>cnt93(id,k)>0)}
  function body93(id,k){
    if(id==='fx'){const {nt,timed}=fx93(k);
      const a=nt.map(t=>`<div class="r93w">${nm93(t)}${t.rep&&t.rep.f?`<button type="button" class="chipbtn" data-w93t="${t.id}" title="반복 할 일은 시각을 바꾸면 앞으로 전부 바뀌어서 상세에서 정해요">↻ 상세에서</button>`:`<input type="time" data-w93tm="${t.id}" aria-label="${esc(t.title)} 시각" value=""> ${durOpt(t)}`}</div>`).join('');
      const b=timed.map(t=>{const s=hm80(t.time),d=+t.dur||30;return `<div class="r93w tm" data-w93t="${t.id}" role="button" tabindex="0"><b>${fmt80(s)}–${fmt80(s+d)}</b><span>${esc(t.title)}${t.ml80?' 🍱':''}</span></div>`}).join('');
      return (nt.length?`<div class="p80g">시각을 정해야 해요 <small>${nt.length}</small></div>${a}`:'')+(timed.length?`<div class="p80g">이미 깔린 일정 <small>${timed.length}</small></div>${b}`:'')}
    if(id==='wk'){const L=wk93(k);
      return `<div class="p80g">이번 주 남은 횟수 <small>${L.length}</small></div>`+L.map(x=>{const {t}=x,sl=x.on?t.sl91[k]:null;
        return `<div class="r93w">${nm93(t)}<small class="muted">${x.n}/${x.N}${x.ks.length?' · 자리 '+x.ks.map(d=>wdOf(d)).join(''):''}</small>${x.on?`<input type="time" data-w93st="${t.id}" aria-label="${esc(t.title)} 내일 시각" value="${esc(sl||'')}">${durOpt(t)}<button type="button" class="ib" data-w93del="${t.id}" title="내일 자리 빼기" aria-label="${esc(t.title)} 내일 자리 빼기">×</button>`:`<button type="button" class="chipbtn" data-w93add="${t.id}">＋ 내일 놓기</button>`}</div>`}).join('')}
    if(id==='ad'){const L=ad93(k),auto=L.filter(autoOk80).length;
      return `<div class="p80g">시각 안 정한 일 <small>${L.length}</small></div>`+L.map(t=>`<div class="r93w">${nm93(t)}${t.rep&&t.rep.f?'<small class="muted">↻</small>':`<input type="time" data-w93tm="${t.id}" aria-label="${esc(t.title)} 시각" value="">`} ${durOpt(t)}</div>`).join('')+
        `<div class="row" style="gap:8px;margin-top:6px"><button type="button" class="btn sm" data-w93auto="1"${auto?'':' disabled'}>빈 시간에 알아서 넣기 (${auto}개)</button>${W.undo?`<button type="button" class="btn ghost sm" data-w93u="1">↶ ${esc(W.undo.l)} 되돌리기</button>`:''}</div><p class="help" style="margin:4px 0 0">반복·묶음 할 일은 자동으로 안 넣어요(앞으로 전부 바뀌어서). 시각 칸에 직접 적거나 캘린더에서 끌어요.</p>`}
    if(id==='care'){const L=care93(k),m=L.reduce((s,t)=>s+(+t.dur||0),0);
      return `<div class="p80g">관리 차례 <small>${L.length}${m?' · '+hmK76(m):''}</small></div><p class="help" style="margin:0 0 4px">미뤄도 괜찮은 일이라 마지막에, 남는 틈에 해요.</p>`+L.slice(0,8).map(t=>`<div class="r93w">${nm93(t)}<small class="muted">${esc(when76(t,k))}</small></div>`).join('')+(L.length>8?`<div class="tiny muted">…외 ${L.length-8}개</div>`:'')+
        `<div class="row" style="margin-top:6px"><button type="button" class="btn ghost sm" data-w93care="1">🧽 차례 정하기 열기</button></div>`}
    return '';
  }
  function wiz93(){
    const k=W.k,td=midKey68(),seq=W.seq,steps=seq.concat(['end']);
    if(W.i>=steps.length)W.i=steps.length-1;if(W.i<0)W.i=0;
    const cur=steps[W.i],lab=k===addDays(td,1)?'내일':dayName68(k);
    const m=placed76(k),B=budOf76(k)*60,over=m>B;
    const dots=steps.map((id,i)=>{const nmx=id==='end'?'✓ 마무리':ALL.find(a=>a[0]===id)[1];return `<button type="button" class="w93d${i===W.i?' on':''}${i<W.i?' pass':''}" data-w93go="${i}" aria-current="${i===W.i}" aria-label="${nmx}">${i<W.i?'✓ ':''}${nmx}</button>`}).join('');
    const line=`<div class="p80b${over?' over':''}">${over?'⚠ ':''}놓은 시간 ${hmK76(m)} / 하루 예산 ${hmK76(B)}${over?' — '+hmK76(m-B)+' 넘쳐요':''}</div>`;
    let main;
    if(cur==='end'){
      const n=tasksOn(k).filter(t=>t.status===0&&!t.cb76&&!t.ml80).length,untimed=ad93(k).length,fxn=fx93(k).nt.length;
      main=`${line}<p class="small" style="margin:6px 0">${esc(lab)} 할 일 ${n}개${fxn?` · ⚠ 시각 안 정한 정해진 일정 ${fxn}개`:''}${untimed?` · 종일 칸 ${untimed}개`:''}</p>
        <div class="row" style="gap:8px;flex-wrap:wrap">${done93()[k]?'<span class="small">✓ 내일 짜기 끝냈어요</span>':'<button type="button" class="btn" data-w93fin="1">내일 짜기 끝</button>'}<button type="button" class="btn ghost" data-sheet="close">닫기</button></div>`}
    else main=body93(cur,k)+line;
    const nav=`<div class="row w93nav" style="gap:8px;margin-top:8px">${W.i>0?'<button type="button" class="btn ghost sm" data-w93nav="-1">‹ 이전</button>':''}${cur==='end'?'':`<button type="button" class="btn sm" data-w93nav="1">${W.i===steps.length-2?'마무리 ›':'다음 ›'}</button>`}</div>`;
    const ord=ord93();
    sheetCtx={w93:k};
    openSheet(`<div class="sh"><h3>🌙 내일 짜기 · ${esc(dayName68(k))}</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
      <div class="w93dots" role="group" aria-label="단계">${dots}</div>
      ${steps.length===1?'<div class="empty small">내일 짤 일정이 아직 없어요 — 할 일을 내일로 정하거나 캘린더에서 놓아요</div>':''}
      ${main}${cur==='end'?'':nav}
      <details class="m80s"><summary>⚙ 설정</summary>
        <div class="row small" style="gap:6px;flex-wrap:wrap">밤에 알려 줄 시각 <input type="time" data-w93at="1" value="${esc(at93())}"></div>
        <div class="small" style="margin-top:6px">단계 순서 <small class="muted">(위가 먼저)</small></div>
        ${ord.map((id,i)=>`<div class="row small" style="gap:6px"><span style="flex:1">${ALL.find(a=>a[0]===id)[1]}</span><button type="button" class="ib" data-w93o="${id}:-1"${i===0?' disabled':''} aria-label="위로">▲</button><button type="button" class="ib" data-w93o="${id}:1"${i===ord.length-1?' disabled':''} aria-label="아래로">▼</button></div>`).join('')}
        <div style="margin-top:6px"><button type="button" class="linkbtn" data-w93old="1">예전 시간표 짜기 화면 열기</button></div></details>`);
  }
  function open93(k){const nk=k||KEY();W={k:nk,i:0,undo:null,seq:seq93(nk)};wiz93()}   // 단계 목록은 열 때 한 번만 정함(알아서 넣기로 비어도 단계가 사라져 화면이 밀리지 않게)
  const redo93=()=>{render();wiz93()};

  /* ---- 동작 ---- */
  addEventListener('click',e=>{const T=e.target;if(!T||!T.closest)return;
    const o=T.closest('[data-w93open]');if(o){e.preventDefault();e.stopPropagation();open93();return}
    const x=T.closest('[data-w93x]');if(x){e.preventDefault();e.stopPropagation();ui.n93x=midKey68();line93();return}
    if(!(sheetCtx&&sheetCtx.w93&&W))return;let b;
    const stop=()=>{e.preventDefault();e.stopPropagation()};
    if((b=T.closest('[data-w93go]'))){stop();W.i=+b.dataset.w93go;wiz93();return}
    if((b=T.closest('[data-w93nav]'))){stop();W.i+=+b.dataset.w93nav;wiz93();return}
    if((b=T.closest('[data-w93t]'))){stop();const id=b.dataset.w93t;closeSheet();openTaskSheet(id);return}
    if((b=T.closest('[data-w93add]'))){stop();const t=TASKS[b.dataset.w93add];if(!t)return;const k=W.k,d=+t.dur||30,p=free93(k,d,busy93(k,[t.id]));
      t.sl91=t.sl91||{};t.sl91[k]=p==null?'':fmt80(p);if(!t.dur)t.dur=d;saveTask(t);redo93();
      toast(p==null?`${t.title} → 종일 칸에 놓았어요 (빈 시간이 없어요)`:`${t.title} → ${fmt80(p)}에 놓았어요`);return}
    if((b=T.closest('[data-w93del]'))){stop();const t=TASKS[b.dataset.w93del];if(!t||!t.sl91)return;delete t.sl91[W.k];if(!Object.keys(t.sl91).length)delete t.sl91;saveTask(t);redo93();return}
    if((b=T.closest('[data-w93auto]'))){stop();const k=W.k,items=ad93(k).filter(autoOk80),busy=busy93(k),prev=[];let n=0,miss=0;
      items.forEach(t=>{const d=Math.max(10,+t.dur||30),p=free93(k,d,busy);if(p==null){miss++;return}
        prev.push({id:t.id,time:t.time||null,dur:t.dur||null});t.time=fmt80(p);t.dur=d;saveTask(t);busy.push([p,p+d+5]);n++});
      W.undo=n?{l:`방금 넣은 ${n}개`,fn:()=>{prev.forEach(p=>{const t=TASKS[p.id];if(t){t.time=p.time;t.dur=p.dur;saveTask(t)}})}}:null;
      redo93();toast(n?`🌙 ${n}개를 빈 시간에 넣었어요${miss?` · ${miss}개는 자리가 없어요`:''}`:'넣을 빈 시간이 없어요 — 길이를 줄이거나 하루 끝 시각을 늦춰요');return}
    if((b=T.closest('[data-w93u]'))){stop();const u=W.undo;W.undo=null;if(u)u.fn();redo93();return}
    if((b=T.closest('[data-w93care]'))){stop();const k=W.k;closeSheet();careSheet76(k);return}
    if((b=T.closest('[data-w93fin]'))){stop();const k=W.k;done93()[k]=1;Object.keys(C.tm93done).sort().slice(0,-30).forEach(d=>delete C.tm93done[d]);save('config');closeSheet();render();toast('🌙 내일 짜기 끝! 푹 쉬어요');return}
    if((b=T.closest('[data-w93old]'))){stop();const k=W.k;closeSheet();planSheet80(k);return}
    if((b=T.closest('[data-w93o]'))){stop();const [id,dv]=b.dataset.w93o.split(':'),o=ord93(),i=o.indexOf(id),j=i+(+dv);if(i<0||j<0||j>=o.length)return;
      [o[i],o[j]]=[o[j],o[i]];C.tm93ord=o;save('config');wiz93();return}
  },true);
  addEventListener('change',e=>{const T=e.target;if(!T||!T.matches||!(sheetCtx&&sheetCtx.w93&&W))return;
    if(T.matches('[data-w93tm]')){e.stopPropagation();const t=TASKS[T.dataset.w93tm];if(t&&hm80(T.value)!=null){t.time=T.value;if(!t.dur)t.dur=30;saveTask(t)}redo93();return}
    if(T.matches('[data-w93st]')){e.stopPropagation();const t=TASKS[T.dataset.w93st];if(t&&t.sl91){t.sl91[W.k]=hm80(T.value)!=null?T.value:'';if(!t.dur)t.dur=30;saveTask(t)}redo93();return}
    if(T.matches('[data-w93d]')){e.stopPropagation();const t=TASKS[T.dataset.w93d],v=+T.value;if(t&&v){t.dur=v;saveTask(t)}redo93();return}
    if(T.matches('[data-w93at]')){e.stopPropagation();if(hm80(T.value)!=null){C.tm93at=T.value;save('config');line93()}return}
  },true);
  addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target&&e.target.matches&&e.target.matches('.w93n,.r93w.tm')){e.preventDefault();const id=e.target.dataset.w93t;closeSheet();openTaskSheet(id)}});

  /* ---- 홈 오늘 칸 한 줄 (밤 시각 이후 · 내일 짜기를 안 끝냈을 때만 · 오늘 밤은 × 로 닫기) ---- */
  function line93(){
    document.querySelectorAll('.n93').forEach(x=>x.remove());
    if(typeof ready!=='undefined'&&!ready)return;
    const n=new Date();if(n.getHours()*60+n.getMinutes()<hm80(at93()))return;
    if(ui.n93x===midKey68())return;
    const k=KEY();if(done93()[k])return;
    const p=document.querySelector('.htoday');if(!p)return;
    const c=tasksOn(k).filter(t=>t.status===0&&!t.cb76&&!t.ml80).length;
    p.insertAdjacentHTML('beforeend',`<div class="n93"><button type="button" class="chipbtn" data-w93open="1">🌙 내일 짜기</button><span class="tiny muted"> 내일 할 일 ${c}개</span><button type="button" class="ib" data-w93x="1" aria-label="오늘 밤은 닫기" title="오늘 밤은 닫기">×</button></div>`);
  }
  render=(function(prev){return function(){const r=prev.apply(this,arguments);try{line93()}catch(e){console.error(e)}return r}})(render);
  setInterval(()=>{try{if(!document.hidden)line93()}catch(e){}},60000);

  /* ---- 입구: 인자 없는 planSheet80()(🌙 단추·⋯ 설정 메뉴)을 이 화면으로. 날짜를 주면 예전 화면 그대로 ---- */
  planSheet80=(function(prev){return function(k){if(k===undefined)return open93();return prev.apply(this,arguments)}})(planSheet80);
  menu61=(function(prev){return function(x,y,title,items){try{if(title==='캘린더 설정'&&Array.isArray(items)&&!items.some(it=>it&&/^🌙 시간표 짜기/.test(it.l||''))){
      const i=items.findIndex(it=>it&&typeof it.l==='string'&&/^🍱 식단표/.test(it.l));
      items.splice(i<0?items.length:i,0,{l:'🌙 시간표 짜기 · 내일 짜기',f:()=>{open93()}})}}catch(e){console.error(e)}
    return prev.call(this,x,y,title,items)}})(menu61);
  renderCal=(function(prev){return function(){const r=prev.apply(this,arguments);try{const b=$('calPlanBtn');if(b){b.title='내일 짜기 (시간표 짜기)';b.setAttribute('aria-label','내일 짜기')}}catch(e){console.error(e)}return r}})(renderCal);

  F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
    ['🌙 내일 짜기','홈 오늘 칸(밤) · 캘린더 줄 🌙 (폰은 ⋯ 설정)','전날 밤 한 화면에서 내일 시간표를 짜요: 📌 정해진 일정(시각 먼저) → 🔁 주 N회 자리 → 🗓 종일 칸 일(빈 시간에 넣기) → 🧽 관리 → 마지막 줄에 놓은 시간/하루 예산. "내일 짜기 끝"을 누르면 그날 밤엔 다시 안 떠요. 뜨는 시각과 단계 순서는 ⚙ 설정에서 바꿔요.',()=>{open93()},'내일 짜기 시간표 전날 밤 정해진 일정 주 N회 종일 칸 관리 하루 예산']])}})(F67);
}
