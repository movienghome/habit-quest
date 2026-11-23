/* ---- v12.2 (w120.js): 끝낸 일 끌어 날짜 바꾸기(월·주 칸) · 주 N회 날마다 다른 시각·길이 · 하그둘 = 그 날을 고정 일정으로 · 주 5회(목표)+최소 3회 · 칩 제목 (사용자 11/23 저녁) ----
   ① **끝낸 칩 끌기**: v12.1은 시간표 블록·종일 칸 칩에만 끌기(`data-drag="done105:id"`)를 붙여서, **월 칸·주 칸(날짜 칸)에 그려진 끝낸 칩(`.cchip.done.d84`)은 끌어도 안 움직였음**.
      renderCal 뒤 `drag120()`이 아직 끌기가 없는 끝낸 칩에 같은 `done105` 끌기를 붙임 → 놓은 날로 w119 `crossDone119`(기록 옮기기 `moveEntry69` + 되돌리기)가 처리.
   ② **칩 제목**: 같은 카드로 이은 주 N회 할 일 묶음(grp99)이 `시나리오 쓰기 + 하그둘`처럼 이름을 이어 붙이던 것 → **대표 할 일 이름 하나만**(대표 = 목표 횟수가 가장 큰 것, 제목에 '하그둘'이 든 건 뒤로).
   ③ **날마다 다른 시각·길이**: 시간표·종일·월 칸에 놓은 주 N회 칸(날 정함 `t.sl91[날짜]`)을 **누르면 그 날 창 `daySheet120`**(시작 시각 · 길이 · 종일 칸으로 · 🤝 하그둘로 · 이 날 빼기 · 할 일 열기).
      길이는 `t.sd119={날짜:분}`(없으면 할 일 공통 길이 t.dur) — w86 tasksOn이 그 날 복사본 dur에 넣고 w93(내일 짜기)도 읽음. 슬롯이 아닌 칸(기본 자리)·끝낸 칸은 예전처럼 할 일 상세가 열림.
      주 N회 창(칩 누르기)의 '📌 정한 날' 줄에서도 같은 창으로 들어감(`aug120`, openSheet 감쌈).
   ④ **하그둘**: 그 날을 🤝 하그둘로 바꾸면 날 정함을 빼고 **새 한 번짜리 할 일 '하그둘'(`t.list='fixed'` 정해진 일정, 같은 시각·길이, `h.hg119`=원래 주 N회 id, 같은 카드(aid)면 그대로 잇기)**을 만듦
      → 캘린더·목록에서 제목이 '하그둘'로 보이고 고정 목록으로 감. 끝내면 주 N회 횟수에 1번으로 셈(`dayCnt99` 감쌈 — 같은 날 시나리오와 둘 다 해도 1번) + 기록 `e.hg99`(만남) 자동.
      되돌리기: 만든 알림의 '되돌리기' · 그 하그둘 상세 ⋯ → '↩ 시나리오 쓰기 날로 되돌리기'(`hgBack120`). 주 N회 상세 ⋯의 옛 '하그둘 꼬리표 켜기'(아무 표시도 안 보였음)는 **'🤝 하그둘 만남 날 정하기'**(`hgPick120`)로 바뀜.
   ⑤ **주 5회(목표) + 최소 3회**: 할 일 `t.min119`(최소 횟수, 없으면 안 씀). 캘린더 위 칩 `n/5` 옆 `최소3`(채우면 `최소3✓`), 주 N회 창 '목표' 줄 아래에 `최소 − n ＋`. **한 번짜리 이주 `C.mig120`**: 제목이 '시나리오 쓰기'인 주 N회 할 일을 목표 5회·최소 3회로 맞춤(사용자 11/23).
   시험 t127. */
/* ---- 0) 한 번짜리 이주 ---- */
function mig120(){try{if(C.mig120||typeof ready72!=='function'||!ready72()||typeof tasksReady==='undefined'||!tasksReady||!tOK64())return;let n=0;
  Object.values(TASKS).forEach(t=>{if(!t||!wx91(t)||String(t.title||'').trim()!=='시나리오 쓰기')return;let ch=0;
    if((+t.rep.n||3)<5){t.rep.n=5;ch=1}if(!(+t.min119>0)){t.min119=3;ch=1}if(ch){saveTask(t);n++}});
  C.mig120=1;save('config');if(n)setTimeout(()=>{try{toast('🎯 시나리오 쓰기를 주 5회(목표) · 최소 3회로 맞췄어요')}catch(e){}},700)}catch(e){console.error(e)}}
render=(function(prev){return function(){try{mig120()}catch(e){console.error(e)}return prev.apply(this,arguments)}})(render);
/* ---- ① 끝낸 칩 끌기(월·주 날짜 칸) ---- */
function drag120(){try{document.querySelectorAll('.cchip.done.d84[data-ctask]:not([data-drag])').forEach(c=>{
  if(c.classList.contains('bar83'))return;c.setAttribute('data-drag','done105:'+c.dataset.ctask);c.setAttribute('data-dragmode','hold');
  if(!/끌어서/.test(c.title||''))c.title=(c.title||'')+' · 끌어서 다른 날로 옮길 수 있어요'})}catch(e){console.error(e)}}
renderCal=(function(prev){return function(){const x=prev.apply(this,arguments);try{if(calShown())drag120()}catch(e){console.error(e)}return x}})(renderCal);
/* ---- ② 칩 제목: 대표 할 일 이름 하나만 ---- */
grp99=(function(prev){return function(){const out=prev.apply(this,arguments);
  out.forEach(g=>{try{const hg=x=>/하그둘/.test(x.title||'');if(g.ts.length>1&&g.ts.some(hg)&&g.ts.some(x=>!hg(x))){g.ts.sort((a,b)=>(hg(a)-hg(b))||((+b.rep.n||3)-(+a.rep.n||3)));g.t=g.ts[0];g.N=+g.t.rep.n||3}
    g.title=g.t.title}catch(e){}});return out}})(grp99);
/* ---- 횟수: 하그둘(hg119) 한 번짜리도 그 주 N회에 셈 ---- */
dayCnt99=(function(prev){return function(t,k){const r=prev.apply(this,arguments);try{const d=DAYS[k];if(t&&r&&d){let h=0;(d.entries||[]).forEach(e=>{const x=e.tid!=null&&TASKS[e.tid];if(x&&x.hg119===t.id)h++});if(h>r.n)r.n=h}}catch(e){}return r}})(dayCnt99);
hgCnt99=(function(prev){return function(t,ws){let n=prev.apply(this,arguments);try{if(t&&ws)for(let i=0;i<7;i++){const d=DAYS[addDays(ws,i)];if(!d)continue;
  (d.entries||[]).forEach(e=>{const x=e.tid!=null&&TASKS[e.tid];if(x&&x.hg119===t.id&&!e.hg99)n++})}}catch(e){}return n}})(hgCnt99);
completeTask=(function(prev){return function(t,ctx){let day=null,before=null;try{day=curDay();before=new Set(day.entries||[])}catch(x){}
  const r=prev.apply(this,arguments);
  try{if(day&&t&&t.hg119){const e=(day.entries||[]).find(z=>!before.has(z)&&z.tid===t.id);if(e&&!e.hg99){const n=clone(e);n.hg99=1;replaceEntry(day.date,e,n)}}}catch(x){console.error(x)}
  return r}})(completeTask);
/* ---- ⑤ 최소 횟수 표시: 캘린더 위 칩 ---- */
function wsNow120(){const md=(C.ui.cal||{}).mode,td=midKey68();return weekStart(md==='month'||md==='agenda'?td:(ui.calAnchor||td))}
function hgPend120(t,ws){return Object.values(TASKS).filter(x=>x&&x.hg119===t.id&&x.status===0&&x.due&&weekStart(x.due)===ws).length}
strip91=(function(prev){return function(){prev.apply(this,arguments);try{const m=$('calMain'),w=m&&m.parentElement&&m.parentElement.querySelector(':scope > .wk91');if(!w)return;const ws=wsNow120();
  w.querySelectorAll('.c91.k105[data-wk105]').forEach(c=>{const t=TASKS[c.dataset.wk105];if(!t||t.id==='*')return;
    const b=c.querySelector('b'),n=wkCnt91(t,ws),N=+t.rep.n||3,mn=Math.min(+t.min119||0,N);
    if(b&&mn>0&&mn<N){b.insertAdjacentHTML('afterend',`<i class="mn120" title="최소 ${mn}회는 하자 · 이번 주 ${n}회">최소${mn}${n>=mn?'✓':''}</i>`);c.classList.toggle('min120',n>=mn&&n<N)}
    const hp=hgPend120(t,ws);if(hp){const ks=Object.keys(t.sl91||{}).filter(k=>weekStart(k)===ws).length+hp,p=c.querySelector('.pl119');
      if(p){p.textContent='📌'+ks}else if(b){b.insertAdjacentHTML('afterend',`<i class="pl119">📌${ks}</i>`)}}})}catch(e){console.error(e)}}})(strip91);
/* ---- ③ 그 날 창 ---- */
function lenOf120(t,k){return +(t.sd119&&t.sd119[k])||+t.dur||30}
function saveSlot120(t,k,tm,len){t.sl91=t.sl91||{};t.sl91[k]=tm||'';
  if(tm&&!t.dur)t.dur=30;
  t.sd119=t.sd119||{};if(len&&len!==(+t.dur||30))t.sd119[k]=len;else delete t.sd119[k];
  const lim=addDays(weekStart(midKey68()),-14);Object.keys(t.sd119).forEach(d=>{if(d<lim||t.sl91[d]===undefined)delete t.sd119[d]});if(!Object.keys(t.sd119).length)delete t.sd119;
  saveTask(t);ui.calKeepScroll=true;render()}
function daySheet120(id,k){const t=TASKS[id];if(!t||!wx91(t)||!t.sl91||t.sl91[k]===undefined)return;try{tsRead()}catch(e){}
  const tm=t.sl91[k]||'',len=lenOf120(t,k),others=Object.keys(t.sl91).filter(d=>d!==k&&weekStart(d)===weekStart(k)).sort();
  sheetCtx={day120:{id,k}};
  openSheet(`<div class="sh" data-d120sheet="1"><h3>📌 ${esc(t.title)} · ${esc(fmtD(k))}(${wdOf(k)})</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <p class="small muted" style="margin:0 0 8px">이 날만 시각·길이를 따로 정해요. 다른 날은 그대로예요.</p>
    <div class="row" style="gap:10px;flex-wrap:wrap;align-items:center" data-d120sheet="1"><label class="small">시작 <input type="time" id="d120t" value="${esc(tm)}" aria-label="시작 시각"></label>
      <label class="small">길이 <input type="number" id="d120l" min="5" max="600" step="5" inputmode="numeric" value="${len}" style="width:4.6em" aria-label="길이(분)">분</label></div>
    <div class="row" style="gap:6px;flex-wrap:wrap;margin:8px 0" data-d120sheet="1">${[15,30,45,60,90,120,180].map(m=>`<button type="button" class="chipbtn" data-len120="${m}" aria-pressed="${m===len}">${m>=60&&m%60===0?(m/60)+'시간':m+'분'}</button>`).join('')}</div>
    <div class="row" style="gap:6px;flex-wrap:wrap"><button type="button" class="btn" data-d120="save">저장</button><button type="button" class="btn ghost" data-d120="allday">종일 칸으로</button><button type="button" class="btn ghost" data-d120="rm">이 날 빼기</button></div>
    <div class="row" style="gap:6px;flex-wrap:wrap;margin-top:8px"><button type="button" class="btn ghost" data-d120="hg">🤝 이 날은 하그둘 만남으로</button><button type="button" class="btn ghost" data-d120="open">✎ 할 일 열기</button></div>
    ${others.length?`<div class="tiny muted" style="margin-top:10px">같은 주 다른 날: ${others.map(d=>`<button type="button" class="chipbtn" data-day120="${esc(id)}|${esc(d)}">${esc(fmtD(d))}(${wdOf(d)}) ${t.sl91[d]?esc(t.sl91[d]):'종일'}</button>`).join(' ')}</div>`:''}
    <p class="help" style="margin:10px 0 0">🤝 하그둘로 바꾸면 이 날은 시나리오 쓰기 대신 <b>'하그둘'</b>이라는 정해진 일정이 돼요(같은 시각·길이). 끝내면 시나리오 쓰기 주 횟수에 1번으로 세어져요.</p>`)}
addEventListener('click',e=>{const el=e.target.closest&&e.target.closest('.blk[data-ctask]:not(.done),.cchip[data-ctask]:not(.done)');if(!el||el.classList.contains('bar83'))return;
  if(typeof lpFired!=='undefined'&&lpFired)return;if(typeof DND!=='undefined'&&DND.on)return;
  const t=TASKS[el.dataset.ctask];if(!t||!wx91(t))return;const k=srcDate91(el);if(!k||!t.sl91||t.sl91[k]===undefined)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();daySheet120(t.id,k)},true);
document.addEventListener('change',e=>{if(e.target&&e.target.closest&&e.target.closest('[data-d120sheet]')&&/^d120[tl]$/.test(e.target.id||'')){e.stopPropagation()}},true);
document.addEventListener('click',e=>{let b=e.target.closest&&e.target.closest('[data-len120]');
  if(b){e.preventDefault();e.stopPropagation();const i=$('d120l');if(i)i.value=b.dataset.len120;document.querySelectorAll('[data-len120]').forEach(x=>x.setAttribute('aria-pressed',x===b));return}
  b=e.target.closest&&e.target.closest('[data-day120]');
  if(b){e.preventDefault();e.stopPropagation();const [id,k]=b.dataset.day120.split('|');daySheet120(id,k);return}
  b=e.target.closest&&e.target.closest('[data-d120]');if(!b)return;e.preventDefault();e.stopPropagation();
  const c=(sheetCtx||{}).day120;if(!c)return;const t=TASKS[c.id];if(!t){closeSheet();return}const act=b.dataset.d120;
  if(act==='save'||act==='allday'){let tm=act==='allday'?'':(($('d120t')||{}).value||'');const len=Math.max(5,Math.min(600,Math.round(+($('d120l')||{}).value||lenOf120(t,c.k))));
    if(tm&&hm80(tm)==null){toast('시각을 다시 골라 주세요');return}
    saveSlot120(t,c.k,tm,tm?len:0);closeSheet();toast(`${t.title} · ${fmtD(c.k)} ${tm?tm+' · '+len+'분':'종일'}`);return}
  if(act==='rm'){const had=t.sl91[c.k],hl=t.sd119&&t.sd119[c.k];delete t.sl91[c.k];if(t.sd119)delete t.sd119[c.k];if(!Object.keys(t.sl91).length)delete t.sl91;saveTask(t);closeSheet();ui.calKeepScroll=true;render();
    toastAct(`${t.title} · ${fmtD(c.k)} 날 정함을 뺐어요`,'되돌리기',()=>{t.sl91=t.sl91||{};t.sl91[c.k]=had;if(hl){t.sd119=t.sd119||{};t.sd119[c.k]=hl}saveTask(t);render()});return}
  if(act==='hg'){hgMake120(t.id,c.k);return}
  if(act==='open'){closeSheet();openTaskSheet(t.id)}},true);
/* ---- ④ 하그둘 ---- */
function hgMake120(id,k){const t=TASKS[id];if(!t||!wx91(t)||!t.sl91||t.sl91[k]===undefined)return;
  const tm=t.sl91[k]||'',len=lenOf120(t,k);
  const h=newTask({title:'하그둘'});h.list='fixed';h.due=k;h.time=tm||null;h.dur=len;h.hg119=t.id;h.dupok65=1;if(t.aid)h.aid=t.aid;if(t.prio)h.prio=t.prio;
  const had=t.sl91[k],hl=t.sd119&&t.sd119[k],hadFlag=t.hg99;
  delete t.sl91[k];if(t.sd119)delete t.sd119[k];if(!Object.keys(t.sl91).length)delete t.sl91;t.hg99=1;
  saveTask(h);saveTask(t);try{closeSheet()}catch(e){}ui.calKeepScroll=true;ui.calSel=k;render();
  toastAct(`🤝 ${fmtD(k)}(${wdOf(k)}) ${tm||'종일'} — 하그둘 정해진 일정으로 바꿨어요`,'되돌리기',()=>{hgBack120(h.id)})}
function hgBack120(hid){const h=TASKS[hid];if(!h||!h.hg119)return;const t=TASKS[h.hg119];if(!t){toast('원래 주 N회 할 일을 찾지 못했어요');return}
  if(h.status!==0){toast('이미 끝낸 하그둘은 되돌릴 수 없어요');return}
  const k=h.due,tm=h.time||'',len=+h.dur||30;t.sl91=t.sl91||{};t.sl91[k]=tm;
  if(len!==(+t.dur||30)){t.sd119=t.sd119||{};t.sd119[k]=len}
  try{deleteTask(hid)}catch(e){console.error(e);try{deleteTask(h)}catch(z){console.error(z)}}
  if(!Object.values(TASKS).some(x=>x&&x.id!==hid&&x.hg119===t.id)&&!(t.hg99&&0)){/* 꼬리표는 그대로 둠(옛 방식 호환) */}
  saveTask(t);try{closeSheet()}catch(e){}ui.calKeepScroll=true;render();toast(`${t.title} · ${fmtD(k)} 날 정함으로 되돌렸어요`)}
function hgPick120(id){const t=TASKS[id];if(!t)return;try{tsRead()}catch(e){}const td=midKey68(),ks=Object.keys(t.sl91||{}).filter(k=>k>=td).sort();
  sheetCtx={hgp120:id};
  openSheet(`<div class="sh"><h3>🤝 하그둘 만남 날 정하기</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <p class="small" style="margin:0 0 8px"><b>${esc(t.title)}</b>에서 하그둘을 만나는 날을 고르면, 그 날은 <b>'하그둘'</b> 정해진 일정이 돼요(같은 시각·길이).</p>
    ${ks.length?`<div class="row" style="gap:6px;flex-wrap:wrap">${ks.map(k=>`<button type="button" class="btn ghost" data-hgp120="${esc(id)}|${esc(k)}">${esc(fmtD(k))}(${wdOf(k)}) ${t.sl91[k]?esc(t.sl91[k]):'종일'}</button>`).join('')}</div>`
      :`<p class="help">아직 정해 둔 날이 없어요. 캘린더 시간표에 <b>${esc(t.title)}</b>를 끌어 놓은 뒤, 그 칸을 눌러 <b>🤝 이 날은 하그둘 만남으로</b>를 눌러도 돼요.</p>`}`)}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-hgp120]');if(!b)return;e.preventDefault();e.stopPropagation();const [id,k]=b.dataset.hgp120.split('|');hgMake120(id,k)},true);
menu61=(function(prev){return function(x,y,title,items){
  try{const t=sheetCtx&&sheetCtx.task&&TASKS[sheetCtx.task];
    if(t&&Array.isArray(items)){
      if(t.status===0&&t.rep&&t.rep.f==='x'){
        items=items.map(i=>i&&/하그둘 꼬리표/.test(i.l||'')?{l:'🤝 하그둘 만남 날 정하기 <small class="muted">그 날을 하그둘 일정으로</small>',f:()=>hgPick120(t.id)}:i);
        if(!items.some(i=>i&&/정한 날·시간/.test(i.l||'')))items=[{l:'📌 정한 날·시간 고치기',f:()=>{try{tsRead()}catch(z){}closeSheet();wkSheet105(t.id)}}].concat(items)}
      if(t.status===0&&t.hg119&&TASKS[t.hg119]&&!items.some(i=>i&&/시나리오 쓰기 날로/.test(i.l||'')))
        items=[{l:`↩ ${esc(TASKS[t.hg119].title)} 날로 되돌리기`+' <small class="muted">시나리오 쓰기 날로 되돌리기</small>',f:()=>hgBack120(t.id)},'-'].concat(items)}}catch(e){console.error(e)}
  return prev.call(this,x,y,title,items)}})(menu61);
/* ---- ⑤ 주 N회 창: 최소 횟수·정한 날 줄 ---- */
function aug120(){try{const sc=$('sheetC');if(!sc)return;const ws=wsNow120();
  sc.querySelectorAll('.w105c').forEach(card=>{if(card.querySelector('.aug120'))return;const ob=card.querySelector('[data-wk105open]');if(!ob)return;const t=TASKS[ob.dataset.wk105open];if(!t||!wx91(t))return;
    const N=+t.rep.n||3,mn=Math.min(+t.min119||0,N),ks=slotKeys91(t,ws);
    const row=`<div class="aug120 small" style="margin:6px 0"><div class="row" style="gap:6px;align-items:center;flex-wrap:wrap"><span>최소(권장)</span><button type="button" class="ib" data-min120="${t.id}:-1" aria-label="최소 줄이기">−</button><b>${mn||'없음'}</b><button type="button" class="ib" data-min120="${t.id}:1" aria-label="최소 늘리기">＋</button><span>회/주</span><span class="tiny muted">목표 ${N}회 · 최소는 '이만큼은 하자'는 줄이에요</span></div>
      ${ks.length?`<div class="row" style="gap:6px;flex-wrap:wrap;margin-top:6px"><span class="tiny muted">📌 정한 날 — 눌러서 시각·길이 고치기</span>${ks.map(k=>`<button type="button" class="chipbtn" data-day120="${esc(t.id)}|${esc(k)}">${esc(fmtD(k))}(${wdOf(k)}) ${t.sl91[k]?esc(t.sl91[k])+' · '+lenOf120(t,k)+'분':'종일'}</button>`).join('')}</div>`:''}</div>`;
    const anchor=card.querySelector('.row[style*="margin-top:6px"]');if(anchor)anchor.insertAdjacentHTML('beforebegin',row);else card.insertAdjacentHTML('beforeend',row)})}catch(e){console.error(e)}}
openSheet=(function(prev){return function(){const r=prev.apply(this,arguments);try{if(sheetCtx&&sheetCtx.wk105)aug120()}catch(e){}return r}})(openSheet);
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-min120]');if(!b)return;e.preventDefault();e.stopPropagation();
  const [id,d]=b.dataset.min120.split(':'),t=TASKS[id];if(!t)return;const N=+t.rep.n||3;const v=Math.max(0,Math.min(N,(+t.min119||0)+(+d)));
  if(v)t.min119=v;else delete t.min119;saveTask(t);render();const c=sheetCtx&&sheetCtx.wk105;if(typeof wkSheet105==='function')wkSheet105(c||'*')},true);
F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['📌 주 N회 날마다 시각·길이','캘린더에 놓은 주 N회 칸 누르기','시간표에 놓은 주 N회 할 일(예: 편집녀 강의)을 누르면 그 날만 시작 시각·길이를 따로 정해요. 캘린더 위 칩 → 정한 날에서도 열려요',()=>{location.hash='cal'},'주 N회 날 시각 길이 다르게 편집녀 강의 시나리오 정한 날'],
  ['🤝 하그둘 날','주 N회 칸을 눌러 🤝 이 날은 하그둘 만남으로','그 날이 시나리오 쓰기 대신 "하그둘" 정해진 일정(고정 목록)이 돼요. 끝내면 시나리오 쓰기 주 횟수에 1번으로 세어져요',()=>{location.hash='cal'},'하그둘 꼬리표 정해진 일정 고정 시나리오 만남'],
  ['🎯 주 목표 + 최소','캘린더 위 주 N회 칩 → 최소 − ＋','목표(예: 5회)와 별도로 "최소 이만큼은"(예: 3회)을 정해요. 칩에 최소3✓처럼 보여요',()=>{location.hash='cal'},'최소 횟수 권장 목표 시나리오 주 5회']])}})(F67);
