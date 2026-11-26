/* ---- v12.3 (w121.js): 경고는 '최소' 기준 · 주 N회마다 이상 목표+최소 · 🤝 하나 그리고 둘(이름·보이기 고침) · 칩 점 모양 · 칩 상세 화면 · 월 막대 크기 통일 (사용자 11/23 밤) ----
   ① **경고(⚠ 쉬는 날 없이 해야 채워요)는 최소 횟수 기준**: `t.min119`(0<최소<목표)가 있으면 `slack99`가 목표 대신 최소로 셈 → 최소를 채우면 경고 없음(목표까지는 그냥 '더 하면 좋아요').
      최소를 안 정한 주 N회 할 일은 예전처럼 목표 기준. 내일 짜기 경보(`alert99`)·캘린더 위 칩 ⚠·주 N회 창이 모두 같은 `slack99`를 씀.
   ② **이상 목표 + 최소를 어느 주 N회 할 일이든**: 할 일 상세 반복 칸 `한 주에 [N]번` 옆에 `최소 [ ]번`(`#tsRepMin`, tsRead 감쌈) · 주 N회 창(칩 누르기)에도 목표·최소 − ＋.
   ③ **🤝 하나 그리고 둘**: 하그둘 날로 바꾸면 이름이 '하나 그리고 둘'인 정해진 일정(`list:'fixed'`, `hg119`) — 예전 이름 '하그둘'은 한 번 이주(`C.mig121`).
      **사라지던 원인**: 캘린더 '보이기·숨기기'(`calPass`)가 새 한 번짜리 일정을 걸렀음(예: '반복 할 일만 보이기'면 한 번짜리가 숨음) → `hg119` 일정은 **원래 주 N회 할 일이 보이는지**로 판단(`calPass` 감쌈).
   ④ **칩 점 모양**: `dots99`를 다시 선언 — 글자(●◐○◇·) 대신 같은 크기 틀(`.d99` 11px)에 CSS 모양(꽉 찬 원 · 반쪽 원 · 빈 원 · 마름모 · 작은 점 7px) → 점이 마름모보다 작아 안 보이던 것.
   ⑤ **칩 상세 화면** `wkSheet121`(window.wkSheet105를 덮음): 큰 n/N + 막대(최소 표시) + 월~일 한 줄(모양+시각) + 한 줄 상태 + 목표·최소 − ＋ + 기록은 접힘.
   ⑥ **월 막대 크기**: 안 한 할 일 칩 높이·글자를 재서(`fit121`) 막대(`.bar83`, 끝낸 막대 포함)·끝낸 칩(`.cchip.done.d84`)이 똑같은 크기가 되게 · 줄 간격 `BL83`도 그 높이 + 2.
   시험 t128. */
const HGN121='하나 그리고 둘';
const isHg121=x=>/하그둘|하나 그리고 둘/.test((x&&x.title)||'');
/* ---- 0) 한 번짜리 이주: 예전 이름 '하그둘' → '하나 그리고 둘' ---- */
function mig121(){try{if(C.mig121||typeof ready72!=='function'||!ready72()||typeof tasksReady==='undefined'||!tasksReady||!tOK64())return;let n=0;
  Object.values(TASKS).forEach(t=>{if(t&&t.hg119&&String(t.title||'').trim()==='하그둘'){t.title=HGN121;saveTask(t);n++}});
  C.mig121=1;save('config');if(n)setTimeout(()=>{try{toast('🤝 하그둘 일정 이름을 \'하나 그리고 둘\'로 바꿨어요')}catch(e){}},700)}catch(e){console.error(e)}}
render=(function(prev){return function(){try{mig121()}catch(e){console.error(e)}return prev.apply(this,arguments)}})(render);
/* ---- ③ 캘린더 보이기·숨기기: 하나 그리고 둘은 원래 주 N회 할 일 따라감 ---- */
calPass=(function(prev){return function(t){try{if(t&&t.hg119){const o=TASKS[t.hg119];if(o)return prev.call(this,o)}}catch(e){}return prev.apply(this,arguments)}})(calPass);
/* 같은 카드 묶음에서 대표 이름: 하그둘·하나 그리고 둘은 뒤로 */
grp99=(function(prev){return function(){const out=prev.apply(this,arguments);
  out.forEach(g=>{try{if(g.ts.length>1&&g.ts.some(isHg121)&&g.ts.some(x=>!isHg121(x))){g.ts.sort((a,b)=>(isHg121(a)-isHg121(b))||((+b.rep.n||3)-(+a.rep.n||3)));g.t=g.ts[0];g.N=+g.t.rep.n||3}
    g.title=g.t.title}catch(e){}});return out}})(grp99);
hgMake120=function(id,k){const t=TASKS[id];if(!t||!wx91(t)||!t.sl91||t.sl91[k]===undefined)return;
  const tm=t.sl91[k]||'',len=lenOf120(t,k);
  const h=newTask({title:HGN121});h.list='fixed';h.due=k;h.time=tm||null;h.dur=len;h.hg119=t.id;h.dupok65=1;if(t.aid)h.aid=t.aid;if(t.prio)h.prio=t.prio;
  delete t.sl91[k];if(t.sd119)delete t.sd119[k];if(!Object.keys(t.sl91).length)delete t.sl91;t.hg99=1;
  saveTask(h);saveTask(t);try{closeSheet()}catch(e){}ui.calKeepScroll=true;ui.calSel=k;render();
  toastAct(`🤝 ${fmtD(k)}(${wdOf(k)}) ${tm||'종일'} — '${HGN121}'(정해진 일정)으로 바꿨어요`,'되돌리기',()=>{hgBack120(h.id)})};
openSheet=(function(prev){return function(){const r=prev.apply(this,arguments);
  try{if(sheetCtx&&sheetCtx.day120){const p=$('sheetC')&&$('sheetC').querySelector('p.help');if(p&&/하그둘/.test(p.textContent))p.innerHTML=`🤝 \'하나 그리고 둘\'로 바꾸면 이 날은 시나리오 쓰기 대신 <b>'${HGN121}'</b>이라는 정해진 일정(Fixed 목록)이 돼요(같은 시각·길이). 끝내면 주 횟수에 1번으로 세어져요.`}}catch(e){}
  return r}})(openSheet);
/* ---- ① 경고는 최소 기준 ---- */
function minOf121(t,N){const m=+(t&&t.min119)||0;return m>0&&m<N?m:0}
slack99=(function(prev){return function(t,from,Nov){const N=Nov||(t&&t.rep&&+t.rep.n)||3,m=t?minOf121(t,N):0;
  const r=prev.call(this,t,from,m||Nov);r.goal=N;r.min=m;return r}})(slack99);
alert99=function(k){
  const L=grp99(openTasks().filter(t=>wx91(t)&&!hid76(t))).map(g=>Object.assign({t:{title:g.title}},slack99(g.t,k,g.N))).filter(x=>x.need>0&&x.slack<=0);
  if(!L.length)return '';
  const lab=k===addDays(midKey68(),1)?'내일':dayName68(k);
  return `<div class="al99" role="status" title="알림만 해요 · 점수·HP는 안 깎여요, 목표를 못 채운 게 아니에요">${L.slice(0,2).map(x=>{const w=x.min?'최소까지 ':'';return x.slack===0
    ?`<div>⚠ <b>${esc(x.t.title)}</b> · ${w}${x.need}번 남음 · ${esc(lab)}부터 쉬는 날 없이 매일 한 번씩</div>`
    :`<div>⚠ <b>${esc(x.t.title)}</b> · ${w}${x.need}번 남음 · 남은 날 ${x.days}일 (하루 두 번 필요)</div>`}).join('')}</div>`};
strip91=(function(prev){return function(){prev.apply(this,arguments);try{const m=$('calMain'),w=m&&m.parentElement&&m.parentElement.querySelector(':scope > .wk91');if(!w)return;
  grp99(openTasks().filter(t=>wx91(t))).forEach(g=>{const c=w.querySelector('.c91.k105[data-wk105="'+g.t.id+'"]');if(!c)return;const mn=minOf121(g.t,g.N);
    const wi=c.querySelector('i.w99');if(wi)wi.title=mn?`최소 ${mn}회를 채우려면 쉬는 날 없이 해야 해요`:'쉬는 날 없이 해야 채워요'})}catch(e){console.error(e)}}})(strip91);
/* ---- ④ 점 모양 ---- */
function hgDay121(t,k){return Object.values(TASKS).some(x=>x&&x.hg119===t.id&&x.status===0&&x.due===k)}
const DOT121={done:'한 날',tr:'10분만 한 날',miss:'안 한 날',plan:'하기로 정한 날',fut:'앞으로'};
function stOf121(t,k,td){const c=dayCnt99(t,k);return c.n?'done':c.tr?'tr':k<td?'miss':((t.sl91&&t.sl91[k]!==undefined)||hgDay121(t,k))?'plan':'fut'}
dots99=function(t,ws,td){let s='',lab=[];
  for(let i=0;i<7;i++){const k=addDays(ws,i),st=stOf121(t,k,td);
    s+=`<i class="d99 s-${st}${k===td?' now':''}"></i>`;lab.push(wdOf(k)+' '+DOT121[st])}
  return `<span class="dd99" role="img" aria-label="${lab.join(', ')}" title="${lab.join(' · ')}">${s}</span>`};
/* ---- ② 할 일 상세 반복 칸: 이상 목표 + 최소 ---- */
function inj121(){const n=$('tsRepN');if(!n||$('tsRepMin'))return;const t=TASKS[(sheetCtx||{}).task];if(!t||!t.rep||t.rep.f!=='x')return;
  const lab=n.closest('label');if(!lab)return;
  if(lab.firstChild&&lab.firstChild.nodeType===3)lab.firstChild.nodeValue='이상 목표 · 한 주에';
  lab.insertAdjacentHTML('afterend',`<label class="row tiny" style="gap:6px;flex-wrap:wrap">최소<input id="tsRepMin" type="number" min="0" max="14" inputmode="numeric" value="${+t.min119>0?+t.min119:''}" placeholder="없음" style="width:64px" aria-label="최소 횟수">번<span class="muted">⚠ 경고는 최소 기준이에요 (비우면 목표 기준)</span></label>`)}
drawTaskSheet=(function(prev){return function(){const r=prev.apply(this,arguments);try{inj121()}catch(e){console.error(e)}return r}})(drawTaskSheet);
tsRead=(function(prev){return function(){const t=prev.apply(this,arguments);
  try{const el=$('tsRepMin');if(t&&t.rep&&t.rep.f==='x'&&el){const v=parseInt(el.value),N=Math.max(1,+t.rep.n||3);if(v>0&&v<N)t.min119=v;else if(v>=N&&N>1)t.min119=N-1;else delete t.min119}}catch(e){}
  return t}})(tsRead);
/* ---- ⑤ 칩 상세 화면 ---- */
function recs121(t,ws){const out=[];for(let i=0;i<7;i++){const k=addDays(ws,i),d=DAYS[k];if(!d)continue;
  (d.entries||[]).forEach(e=>{
    if(e.tid===t.id)out.push({k,e,why:'이 할 일'});
    else if(t.aid&&e.aid===t.aid&&e.tid!=null)out.push({k,e,why:'같은 카드로 이은 다른 할 일'+(TASKS[e.tid]?' ('+TASKS[e.tid].title+')':'')});
    else if(e.kind==='start65'&&e.t65){const x=TASKS[e.t65];if(e.t65===t.id||(t.aid&&x&&x.aid===t.aid))out.push({k,e,why:'🌱 10분만 (하루 1번으로 셈)'})}})}
  return out}
function card121(g,ws,td){const t=g.t,N=g.N,mn=minOf121(t,N),n=wkCnt91(t,ws),cur=ws===weekStart(td),R=recs121(t,ws),pct=x=>Math.max(0,Math.min(100,Math.round(x/N*100)));
  const hgN=g.ts.some(x=>x.hg99)||Object.values(TASKS).some(x=>x&&x.hg119===t.id);
  let tag,txt,warn=0;
  if(n>=N){tag='✓ 목표 달성';txt='이번 주 목표를 채웠어요'}
  else if(mn&&n>=mn){tag='✓ 최소 달성';txt=`최소 ${mn}회는 채웠어요 · 목표까지 ${N-n}번 더`}
  else if(cur){const s=slack99(t,from99(t,td),N),w=mn?'최소까지':'목표까지';
    if(s.slack>0){tag=`${s.need}번 남음`;txt=`${w} 남은 ${s.need}번 · 쉬어도 되는 날 ${s.slack}일`}
    else if(s.slack===0){tag='⚠ 매일';txt=`⚠ ${w} 남은 ${s.need}번 · 쉬는 날 없이 남은 날마다 한 번씩`;warn=1}
    else{tag='⚠ 하루 두 번';txt=`⚠ ${w} 남은 ${s.need}번 · 남은 날 ${s.days}일이라 하루 두 번이 필요해요`;warn=1}}
  else{tag=mn&&n<mn?'최소 못 채움':'지난 주';txt=`그 주에 ${n}번 했어요`}
  const days=[...Array(7)].map((_,i)=>{const k=addDays(ws,i),st=stOf121(t,k,td),c=dayCnt99(t,k),sl=t.sl91&&t.sl91[k],hp=Object.values(TASKS).find(x=>x&&x.hg119===t.id&&x.status===0&&x.due===k),hm=hgMet122(t,k);
    const sub=hm?'🤝'+(c.n||hm===2?'✓':(hp&&hp.time)||''):c.n?(c.n>1?'×'+c.n:'✓'):hp?'🤝'+(hp.time||''):sl!==undefined?(sl||'종일'):'';
    const inner=`<span class="dl121">${wdOf(k)}</span><i class="d99 s-${st}" aria-hidden="true"></i><small>${esc(sub)}</small>`;
    const lab=`${fmtD(k)}(${wdOf(k)}) ${DOT121[st]}${sub&&sub!=='✓'?' · '+sub:''}`;
    return sl!==undefined&&!c.n&&k>=td?`<button type="button" class="wd121${k===td?' now':''}" data-day120="${esc(t.id)}|${esc(k)}" title="눌러서 시각·길이 고치기" aria-label="${esc(lab)} · 눌러서 고치기">${inner}</button>`
      :`<div class="wd121${k===td?' now':''}" role="img" aria-label="${esc(lab)}" title="${esc(lab)}">${inner}</div>`}).join('');
  return `<div class="jarcard w105c w121c" data-g121="${esc(t.id)}">
    <div class="h121"><b class="t121">${esc(g.title)}</b><span class="r121">${esc(fmtD(ws))}(월) ~ ${esc(fmtD(addDays(ws,6)))}(일)</span></div>
    <div class="big121"><span class="n121">${n}</span><span class="of121">/ ${N}회</span><span class="tag121${warn?' warn':''}">${esc(tag)}</span></div>
    <div class="bar121" role="img" aria-label="이번 주 ${n}회${mn?' · 최소 '+mn+'회':''} · 목표 ${N}회"><i class="f121" style="width:${pct(n)}%"></i>${mn?`<i class="m121" style="left:${pct(mn)}%"></i>`:''}</div>
    <div class="lg121">${mn?`<span style="left:${pct(mn)}%">최소 ${mn}</span>`:''}<span style="left:100%;transform:translateX(-100%)">목표 ${N}</span></div>
    <div class="week121">${days}</div>
    <div class="st121">${esc(txt)}</div>
    ${hgN?`<div class="tiny muted">🤝 이번 주 ${HGN121} ${hgCnt99(t,ws)}번</div>`:''}
    <div class="set121 aug120"><span class="row" style="gap:6px;align-items:center">이상 목표<button type="button" class="ib" data-wk105n="${esc(t.id)}:-1" aria-label="이상 목표 줄이기">−</button><b>${N}</b><button type="button" class="ib" data-wk105n="${esc(t.id)}:1" aria-label="이상 목표 늘리기">＋</button>회</span>
      <span class="row" style="gap:6px;align-items:center">최소<button type="button" class="ib" data-min120="${esc(t.id)}:-1" aria-label="최소 줄이기">−</button><b>${mn||'없음'}</b><button type="button" class="ib" data-min120="${esc(t.id)}:1" aria-label="최소 늘리기">＋</button>회</span>
      <span class="tiny muted" style="flex-basis:100%">⚠ 경고는 ${mn?'최소':'목표'} 기준으로 떠요 · 최소는 '이만큼은 하자'는 줄이에요</span></div>
    <details class="rec121"><summary>셈에 들어간 기록 ${R.length}개</summary>${R.length?`<ul class="l105">${R.map(r=>`<li>${fmtD(r.k)}(${wdOf(r.k)}) ${esc(r.e.t||'')} · ${esc((r.e.name||'').slice(0,30))} <span class="muted">· ${esc(r.why)}</span></li>`).join('')}</ul>`:'<div class="tiny muted">아직 기록이 없어요</div>'}
      <div class="tiny muted">잘못 센 기록은 날짜를 보고 캘린더에서 체크 해제하세요. 한 주는 월요일부터예요.</div></details>
    <div class="row" style="gap:6px;margin-top:8px;flex-wrap:wrap">${g.ts.map(x=>{const meta=[listName(x.list||'inbox'),x.dur?x.dur+'분':'',x.care76?'🧽 관리':'',slotTxt91(x,ws).replace(/^ · /,'')].filter(Boolean).join(' · ');return `<button type="button" class="btn sm ghost" data-wk105open="${esc(x.id)}">✎ 할 일 열기${g.ts.length>1?' · '+esc(meta):''}</button>`}).join('')}</div>${g.ts.length>1?`<div class="tiny muted" style="margin-top:4px">⚠ 같은 카드를 쓰는 할 일 ${g.ts.length}개가 한 칩으로 묶였어요 — 횟수는 합치지 않고 날마다 큰 쪽만 세요. 같은 걸 두 번 만든 거라면 하나를 지우세요.</div>`:''}</div>`}
function wkSheet121(tid){const ws=wsNow120(),td=midKey68(),G=grp99(openTasks().filter(t=>wx91(t)));
  if(!G.length){closeSheet();toast('주 N회 할 일이 없어요');return}
  const one=tid&&tid!=='*'?G.filter(g=>g.ts.some(x=>x.id===tid)):G;
  sheetCtx={wk105:tid||'*'};
  openSheet(`<div class="sh"><h3>🔁 주 N회${one.length===1?' · '+esc(one[0].title):''}</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>${one.map(g=>card121(g,ws,td)).join('')}${one.length===1&&G.length>1?`<button type="button" class="btn sm ghost" data-wk105="*">🔁 전체 ${G.length}개 보기</button>`:''}`)}
window.wkSheet105=wkSheet121;
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-wk105]');if(!b)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();wkSheet121(b.dataset.wk105)},true);
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-wk105n]');if(!b)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  const [id,d]=b.dataset.wk105n.split(':'),t=TASKS[id];if(!t)return;t.rep.n=Math.max(1,Math.min(7,(+t.rep.n||3)+(+d)));
  if(+t.min119>=t.rep.n){if(t.rep.n>1)t.min119=t.rep.n-1;else delete t.min119}
  saveTask(t);render();wkSheet121(sheetCtx&&sheetCtx.wk105)},true);
/* ---- ⑥ 월 막대 크기: 안 한 할 일 칩 기준 ---- */
function fit121(){try{const g=$('calMain')&&$('calMain').querySelector('.mgrid');if(!g)return;
  let ref=[...g.querySelectorAll('.mc .cchip:not(.bar83):not(.done):not([hidden])')].find(c=>c.getBoundingClientRect().height>4),probe=null;
  if(!ref){const mc=g.querySelector('.mc');if(!mc)return;probe=document.createElement('div');probe.className='cchip p0';probe.textContent='가';probe.style.visibility='hidden';mc.prepend(probe);ref=probe}
  const r=ref.getBoundingClientRect(),cs=getComputedStyle(ref),h=r.height,pv=parseFloat(cs.paddingTop)||0,fs=cs.fontSize;if(probe)probe.remove();
  if(!(h>4))return;
  g.style.setProperty('--bh121',h+'px');g.style.setProperty('--bf121',fs);g.style.setProperty('--bp121',pv+'px');
  const bl=h+2;if(Math.abs(bl-BL83)>0.01){BL83=bl;g.querySelectorAll('.sp83').forEach(sp=>{const v=(+sp.dataset.n*BL83-2)+'px';if(sp.style.height!==v)sp.style.height=v})}}catch(e){console.error(e)}}
bars83=(function(prev){return function(){fit121();return prev.apply(this,arguments)}})(bars83);
place83=(function(prev){return function(){fit121();return prev.apply(this,arguments)}})(place83);
F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['🎯 이상 목표 + 최소','할 일 상세 → 반복 → 한 주에 N번 · 캘린더 위 주 N회 칩','주 N회 할 일마다 이상 목표(예: 5회)와 최소(예: 3회)를 정해요. ⚠ 쉬는 날 없이 해야 한다는 경고는 최소 기준으로 떠요',()=>{location.hash='cal'},'이상 목표 최소 횟수 경고 주 N회 쉬는 날']])}})(F67);
