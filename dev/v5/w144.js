/* ================= v13.19 (w144): 11/26 밤 요청 — 칩 보이기·숨기기 · 내일 목록에 놓은 칩 · 루틴 블록 매일 · '오늘 한 단계' 줄 빼기 · 홈 끝냄 칩 =================
   ① 캘린더 보이기·숨기기 '종류'에 🏷 칩(주 N회) 항목: 주 N회 할 일(칩 줄·날짜에 놓은 칩·기본 자리)은 **이 항목 하나로만** 보이고 숨음(목록·영역·태그 거르기를 안 탐).
      고른 것 보이기 모드에서 이 항목을 고르면 보임 · 고른 것 숨기기 모드에서 고르면 숨음 · 아무것도 안 고르면 보임.
      기존 '고른 것 보이기' 설정엔 한 번(`C.mig144`) 칩 항목을 넣어 지금처럼 칩이 보이게 둠. 내일 짜기(`nfOn93`) 동안엔 안 거름.
   ② 날짜에 놓은 칩이 안 보이던 원인: 운동·빨래처럼 습관·관리로 숨는 할 일(hid76)은 openTasks()에서 빠져 w86 슬롯이 안 그려졌음 → 여기서 TASKS 전체에서 다시 채움.
   ③ 할 일 '오늘'·'내일' 목록: 그날 놓은(sl91) 주 N회 칩도 보임(줄의 날짜·시각은 놓은 자리로).
   ④ 루틴(머리 할 일 t.rid, 매일·요일 반복)은 앞으로의 날에도 시간표 블록으로 보임(그날 한 것과 상관없이) — 미리 보기 블록(.gh144)은 끌기·○ 없음, 누르면 그 루틴 상세.
   ⑤ 루틴 밑 '✓ 오늘 한 단계' 줄은 목록·홈 모두 안 그림(사용자: 기록에서 보면 됨).
   ⑥ 홈 '오늘' 칸 '✓ 끝낸 것: …' 글줄 → 할 일 화면처럼 '✓ 끝냄 n' 작은 칩(누르면 펼침). */
(function(){
/* ---------- ① 칩 거르기 ---------- */
try{if(!KIND77.some(x=>x[0]==='wk'))KIND77.push(['wk','🏷 칩(주 N회)'])}catch(e){console.error(e)}
window.isWk144=function(t){if(!t)return false;try{if(t.hg119&&TASKS[t.hg119])t=TASKS[t.hg119]}catch(e){}return !!(t.status===0&&t.rep&&t.rep.f==='x')};
window.chipPass144=function(f){f=f||flt77();if(!fOn77(f))return true;const has=f.kinds.includes('wk');return f.inv?!has:has};
calPass=(function(prev){return function(t){
  try{if(window.nfOn93&&nfOn93())return prev.apply(this,arguments);
    const f=flt77();
    if(isWk144(t))return chipPass144(f);
    if(!f.kinds.includes('wk'))return prev.apply(this,arguments);
    const k=f.kinds;f.kinds=k.filter(x=>x!=='wk');
    try{if(!fOn77(f))return f.inv?true:false;return prev.apply(this,arguments)}finally{f.kinds=k}
  }catch(e){console.error(e);return prev.apply(this,arguments)}}})(calPass);
function mig144(){if(!ready||C.mig144)return;if(mode==='db'&&!SRV59.c)return;
  ['calf77','calf77t'].forEach(k=>{const f=C[k];if(!f||typeof f!=='object'||Array.isArray(f)||f.inv)return;if(!Array.isArray(f.kinds))f.kinds=[];
    const n=['lists','areas','tags','kinds'].reduce((a,x)=>a+((f[x]||[]).length),0);if(n&&!f.kinds.includes('wk'))f.kinds.push('wk')});
  C.mig144=1;save('config')}
function chipRow144(){try{document.body.classList.toggle('nochip144',!chipPass144())}catch(e){}}

/* ---------- ② 슬롯: 숨는 할 일(습관·관리)도 + ④ 루틴 미리 보기 ---------- */
const slotOn144=(t,k)=>!!(t&&t.status===0&&t.rep&&t.rep.f==='x'&&t.sl91&&t.sl91[k]!==undefined&&!slotDoneOn91(t,k)&&wkCnt91(t,weekStart(k))<(+t.rep.n||3));
window.slotOn144=slotOn144;
const ghostOK=()=>{try{return (window.nfOn93&&nfOn93())||((C.ui.cal||{}).mode!=='month')}catch(e){return true}};
tasksOn=(function(prev){return function(k){const a=prev.apply(this,arguments);
  try{const td=midKey68(),ids=new Set(a.map(t=>t.id));
    // ② w86은 openTasks()(숨는 할 일 빠짐)만 봄 → 빠진 슬롯을 채움
    if(k>=td)Object.values(TASKS).forEach(t=>{if(ids.has(t.id)||!slotOn144(t,k)||!calPass(t))return;
      const c=Object.assign({},t,{due:k,time:t.sl91[k]||null});if(t.sd119&&+t.sd119[k]>0)c.dur=+t.sd119[k];a.push(c);ids.add(t.id)});
    // ① 칩을 숨겼으면 슬롯 사본도 뺌(w86 사본은 calPass를 안 탐)
    for(let i=a.length-1;i>=0;i--)if(isWk144(a[i])&&!calPass(a[i]))a.splice(i,1);
    // ④ 루틴 머리: 앞으로의 날에도(그날 반복 차례면) 미리 보기 블록
    if(k>=td&&ghostOK())Object.values(TASKS).forEach(t=>{if(ids.has(t.id)||!t||t.status!==0||!t.rid||!t.rep||!t.rep.f||t.rep.f==='x'||!t.due||k<=t.due)return;
      if(typeof isStep62==='function'&&isStep62(t))return;if(typeof hid76==='function'&&hid76(t))return;
      try{if(!sched59(t,k)||!calPass(t))return}catch(e){return}
      let c=Object.assign({},t,{due:k,gh144:1});delete c.tx83;try{if(typeof view83==='function')c=Object.assign(view83(c,k),{gh144:1})}catch(e){}
      a.push(c);ids.add(t.id)});
  }catch(e){console.error(e)}return a}})(tasksOn);
// 미리 보기 블록: 끌기·길이·○ 없앰, 표시
function ghost144(){try{document.querySelectorAll('#calPane [data-ctask], #tt84slot [data-ctask], #pl93 [data-ctask]').forEach(el=>{const t=TASKS[el.dataset.ctask];if(!t||!t.rid)return;
    const col=el.closest('[data-drop^="col:"],[data-drop^="allday:"],[data-drop^="day:"]');if(!col)return;const d=col.dataset.drop,k=d.slice(d.indexOf(':')+1);
    if(!k||k===t.due||k<=t.due)return;
    el.classList.add('gh144');el.removeAttribute('data-drag');el.querySelectorAll('.rz,[data-tdone],.ck128').forEach(x=>x.remove());
    if(!el.title||!/미리 보기/.test(el.title))el.title=(t.title||'')+' · 반복 루틴 미리 보기(이 날 차례)'})}catch(e){console.error(e)}}

/* ---------- ③ 할 일 '오늘'·'내일' 목록에 놓은 칩 ---------- */
const selK=sel=>sel==='today'?dateKey():sel==='tomorrow'?addDays(dateKey(),1):null;
taskMatches=(function(prev){return function(t,sel){try{const k=selK(sel);if(k&&slotOn144(t,k)&&!(ui.tq71&&ui.tq71.trim()))return true}catch(e){}return prev.apply(this,arguments)}})(taskMatches);
const curSel=()=>{try{return curView()==='tasks'?((C.ui.tasks||{}).sel||'today'):null}catch(e){return null}};
const asSlot=t=>{try{const k=selK(curSel());if(k&&t&&t.due!==k&&slotOn144(t,k))return Object.assign({},t,{due:k,time:t.sl91[k]||null})}catch(e){}return t};
taskRow=(function(prev){return function(t){const a=[...arguments];a[0]=asSlot(t);return prev.apply(this,a)}})(taskRow);
dateBucket=(function(prev){return function(t){const a=[...arguments];a[0]=asSlot(t);return prev.apply(this,a)}})(dateBucket);

/* ---------- ⑤ '✓ 오늘 한 단계' 줄 없앰 ---------- */
dn75=function(){return ''};

/* ---------- ⑥ 홈 끝냄 칩 ---------- */
let HD144=false;
function homeDone144(){const L=$('htList');if(!L)return;const el=[...L.querySelectorAll(':scope > .tiny.muted')].find(x=>/^✓ 끝낸 것/.test(x.textContent.trim()));if(!el)return;
  const dn=doneOn(dateKey());if(!dn.length){el.remove();return}
  const d=document.createElement('details');d.className='hd144';if(HD144)d.open=true;
  d.innerHTML=`<summary title="오늘 끝낸 것">✓ 끝냄 ${dn.length}</summary><div class="hd144b">${dn.map(e=>`<span class="hd144i">${esc(e.name||'')}</span>`).join('')}</div>`;
  d.addEventListener('toggle',()=>{HD144=d.open});el.replaceWith(d)}

render=(function(prev){return function(){try{mig144()}catch(e){console.error(e)}const r=prev.apply(this,arguments);try{chipRow144();ghost144();homeDone144()}catch(e){console.error(e)}return r}})(render);
renderCal=(function(prev){return function(){const r=prev.apply(this,arguments);try{chipRow144();ghost144()}catch(e){console.error(e)}return r}})(renderCal);
renderHome=(function(prev){return function(){const r=prev.apply(this,arguments);try{homeDone144()}catch(e){console.error(e)}return r}})(renderHome);
})();
