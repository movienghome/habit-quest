/* ---- v12.4 (w122.js): 🤝 하나 그리고 둘 일정이 진짜 Fixed 목록으로 · 칩 점에서 만난 날은 네모 · (CSS: 끝낸 칩·막대 점선 복구 + 며칠짜리 막대도 희미하게) (사용자 11/23 밤) ----
   ① **원인**: `hgMake120`(w120·w121)이 일정을 `list:'fixed'`로 만들었는데 앱의 Fixed 목록 id는 `Lfixed`(또는 사용자가 만든 이름 'Fixed' 목록)라 '없는 목록' → 기본함으로 보였음.
      `fixId122()` = 이름이 fixed인 목록 id(없으면 'fixed'), `isFx122(t)` = 그 목록이거나 예전 값 'fixed'. 내일 짜기(w93)·하그둘 자동 표시(w99)의 `list==='fixed'` 비교도 `isFx122`로 바꿈.
      이미 만들어진 하그둘 일정(`hg119`)의 목록은 `fixMig122`가 한 번 고쳐 줌.
   ② 칩 점: 하나 그리고 둘 만난 날(끝낸 날 = ■ 꽉 찬 네모 · 만나기로 한 날 = □ 빈 네모)은 마름모와 다른 모양(`hgMet122`, `.s-hgd`·`.s-hg`).
   ③ CSS(v122.css): 끝낸 칩(.cchip.done.d84)·며칠짜리 막대(.bar83.d119)에 점선을 `outline`으로 되살림(테두리는 0 그대로라 크기 안 변함) + 막대 색·글자도 끝낸 칩처럼 희미하게.
   시험 t129. */
function fixId122(){try{const l=(C.lists||[]).find(x=>lnorm(x.name)==='fixed');return l?l.id:'fixed'}catch(e){return 'fixed'}}
function isFx122(t){if(!t)return false;const f=fixId122();return t.list==='fixed'||t.list===f}
hgMake120=function(id,k){const t=TASKS[id];if(!t||!wx91(t)||!t.sl91||t.sl91[k]===undefined)return;
  const tm=t.sl91[k]||'',len=lenOf120(t,k);
  const h=newTask({title:HGN121});h.list=fixId122();h.due=k;h.time=tm||null;h.dur=len;h.hg119=t.id;h.dupok65=1;if(t.aid)h.aid=t.aid;if(t.prio)h.prio=t.prio;
  delete t.sl91[k];if(t.sd119)delete t.sd119[k];if(!Object.keys(t.sl91).length)delete t.sl91;t.hg99=1;
  saveTask(h);saveTask(t);try{closeSheet()}catch(e){}ui.calKeepScroll=true;ui.calSel=k;render();
  toastAct(`🤝 ${fmtD(k)}(${wdOf(k)}) ${tm||'종일'} — '${HGN121}'(정해진 일정)으로 바꿨어요`,'되돌리기',()=>{hgBack120(h.id)})};
let FM122=0;
function fixMig122(){try{if(FM122||typeof ready72!=='function'||!ready72()||typeof tasksReady==='undefined'||!tasksReady||!tOK64())return;FM122=1;
  const f=fixId122();if(f==='fixed')return;
  Object.values(TASKS).forEach(t=>{if(t&&t.hg119&&t.list==='fixed'){t.list=f;saveTask(t)}})}catch(e){console.error(e)}}
render=(function(prev){return function(){try{fixMig122()}catch(e){console.error(e)}return prev.apply(this,arguments)}})(render);
/* ---- ② 만난 날 점: 0 아님 · 1 = 만나기로 한 날(열린 일정) · 2 = 만난 날(끝낸 일정 또는 만남 기록) ---- */
function hgMet122(t,k){try{
  const hs=Object.values(TASKS).filter(x=>x&&x.hg119===t.id&&x.due===k);
  if(hs.some(x=>x.status!==0))return 2;
  const d=DAYS[k];if(d&&(d.entries||[]).some(e=>e.hg99&&(e.tid===t.id||(t.aid&&e.aid===t.aid)||hs.some(x=>x.id===e.tid))))return 2;
  if(hs.some(x=>x.status===0))return 1}catch(e){}return 0}
DOT121.hgd='하나 그리고 둘 만난 날';DOT121.hg='하나 그리고 둘 만나기로 한 날';
stOf121=function(t,k,td){const hm=hgMet122(t,k);if(hm===2)return 'hgd';const c=dayCnt99(t,k);
  return c.n?'done':c.tr?'tr':k<td?'miss':hm===1?'hg':((t.sl91&&t.sl91[k]!==undefined))?'plan':'fut'};
F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['🤝 하나 그리고 둘 점 모양','캘린더 위 주 N회 칩 · 점 7개','시나리오 쓰기 칩의 점에서 하나 그리고 둘 만난 날은 ■(꽉 찬 네모), 만나기로 한 날은 □(빈 네모)로 보여요. 하나 그리고 둘 일정은 📌Fixed 목록에 들어가요.',()=>{location.hash='cal'},'하나 그리고 둘 하그둘 만남 점 네모 마름모 Fixed']])}})(F67);
