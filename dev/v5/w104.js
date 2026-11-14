/* ---- v10.5 (w104.js): 11/14 사용자 답 반영 묶음 ----
   ① 폰 시간표 오조작 막기: 캘린더·폰 시간표 독(#calPane 안)에서 터치로 블록을 옮기려면 0.48초 꾹(전엔 0.3초), 6px만 움직여도 취소(전엔 10px).
      블록 길이 손잡이(.rz75)는 손가락이 닿자마자 길이가 바뀌던 것('now') → 0.38초 꾹 눌러야(hold) 바뀌고, 그 자리에서 시작한 밀기는 그냥 스크롤.
      끌기가 시작되면 짧게 진동. (마우스는 그대로)
   ② 잠·술을 몸 시작값에도(사용자 OK): 몸 최대에서 깎인 양의 C.bs102.sp%(기본 50)를 몸 시작(=HP 시작)에서도 뺌.
      어제·오늘 술 카드(또는 야식·늦게 잠 카드)를 따로 기록했으면 그 몫은 시작값에서 빼지 않음(두 번 깎이지 않게). st102 다시 선언.
   ③ 한 번짜리 정리 C.mig104(사용자 OK): 🌌 Lethe 명상 단계 → 명상 카드(g6), 지워진 스트레칭 카드(g4)에 이어진 할 일 → 폼롤러·스트레칭(dp5eh8).
      보조 영역이 비어 있는 관련 카드에 보조 영역을 넣음(이미 정한 카드는 안 건드림). 새 기록부터 나뉨(지난 기록은 그대로).
   ④ 카드를 지울 때 이어진 할 일·루틴 단계가 있으면 먼저 창: 다른 카드로 옮기고 지우기 / 연결 풀고 지우기 / 취소. delActs 감쌈.
   ⑤ 기록하기 '오늘·어제·그저께 한 일' 칸 맨 위에 그날 요약(아바타·기분·HP·✨XP·💰골드·⚡용기·기록 수·🔋영역·📈진척·😴잠). renderLog 감쌈. */

/* ---- ① 터치 끌기 보호 ---- */
const HOLD104=480,RZH104=380;
function calTouch104(el){return !!(el&&el.closest&&el.closest('#calPane'))}
document.addEventListener('pointerdown',e=>{DND.t104=0;
  if(e.pointerType==='mouse'||!DND.pending||DND.on||!calTouch104(DND.el))return;
  DND.lastX=0;DND.lastY=0;clearTimeout(DND.timer);DND.t104=1;const ms=DND.el.classList.contains('rz75')?RZH104:HOLD104;
  DND.timer=setTimeout(()=>{if(DND.pending&&DND.t104){buzz(12);dndStart({clientX:DND.lastX||DND.sx,clientY:DND.lastY||DND.sy})}},ms)},true);
document.addEventListener('pointermove',e=>{if(!DND.t104||!DND.pending||DND.on||!DND.src)return;
  if(Math.hypot(e.clientX-DND.sx,e.clientY-DND.sy)>6){dndCancel();DND.src=null;DND.t104=0}},{capture:true,passive:true});
function rz104(){if(!coarse75())return;document.querySelectorAll('.rz75').forEach(g=>{g.dataset.dragmode='hold';g.classList.add('h104')})}
renderCal=(function(prev){return function(){const x=prev.apply(this,arguments);try{rz104()}catch(e){console.error(e)}return x}})(renderCal);

/* ---- ② 잠·술 → 몸 시작에도 ---- */
const SPD104=50;
function spPct104(){const v=+((C.bs102||{}).sp);return isFinite(v)&&(C.bs102||{}).sp!=null?clamp(Math.round(v),0,100):SPD104}
// 그날(또는 어제) 따로 기록한 카드: 술·야식·늦게 잠 — 그 몫은 시작값에서 안 뺌
function sep104(k){const r={dr:0,ln:0,sl:0};[addDays(k,-1),k].forEach(d=>{const y=DAYS[d];if(!y)return;
  (y.entries||[]).forEach(e=>{if(e.type!=='bad')return;const n=String(e.name||'')+' '+String(e.opt||'');
    if(e.aid==='b1'||/술|음주|과음|혼술|맥주|소주|와인/.test(n))r.dr=1;
    if(/야식|폭식|과식/.test(n)&&!/참/.test(n))r.ln=1;
    if(/늦게\s*잠|늦잠|밤샘|새벽\s*\d*시?\s*잠/.test(n))r.sl=1})});return r}
function spPen104(day,K){const p=spPct104(),why=[];if(!p||!day||!K||!K.why.length)return{pen:0,why};const s=sep104(day.date);
  K.why.forEach(w=>{const sk=(w[0]==='🍺'&&s.dr)||(w[0]==='🌙'&&s.ln)||(w[0]==='🛏'&&s.sl);
    const v=Math.round(Math.abs(w[2])*p/100);if(v)why.push([w[0],w[1],sk?0:-v,sk])});
  return{pen:why.reduce((a,w)=>a-w[2],0),why,pct:p}}
function st102(day){const o=bs102(),hb=hpb101(),ye=yEnd102(day),cr=ye==null?0:Math.round((ye-hb)*o.carry/100),K=cap102(day),P=spPen104(day,K);
  return{start:clamp(Math.min(hb+cr-P.pen,K.cap),0,100),carry:cr,ye,cap:K.cap,why:K.why,hb,sp:P.pen,spw:P.why}}
function spTxt104(S){if(!S||!S.spw||!S.spw.length)return '';
  const on=S.spw.filter(w=>!w[3]),off=S.spw.filter(w=>w[3]);
  return (on.length?`몸 시작도 −${S.sp} (깎인 양의 ${spPct104()}%: ${on.map(w=>w[0]+' −'+Math.abs(w[2])).join(' · ')})`:'')+
    (off.length?`${on.length?' · ':''}${off.map(w=>w[0]).join('')} 카드를 따로 기록해서 시작값에선 안 뺌`:'')}
slPrev102=(function(prev){return function(){const r=prev.apply(this,arguments);try{const sc=$('sheetC'),k=SL102.k;if(!sc||!k)return r;const d=dayOf(k);
  const S=st102({date:k,entries:d.entries,food:d.food,sl102:slRead102(),energy:d.energy}),t=spTxt104(S),box=sc.querySelector('.rs102');
  if(box&&t)box.insertAdjacentHTML('beforeend',`<div class="tiny muted">${esc(t)}</div>`)}catch(e){console.error(e)}return r}})(slPrev102);
capHTML103=(function(prev){return function(day){let h=prev.apply(this,arguments);try{const t=spTxt104(st102(day));
  if(t)h=h.replace('</ul>',`<li><b>시작값</b>: ${esc(t)}</li></ul>`)}catch(e){console.error(e)}return h}})(capHTML103);
infoFor=(function(prev){return function(k){const r=prev.apply(this,arguments);
  try{if(r&&k==='hp'&&new102(today())){const t=spTxt104(st102(today()));if(t)r.b=r.b.replace(/(🛏 몸 출발점:[\s\S]*?)(<button)/,(m,a,b)=>`${a}· ${esc(t)} ${b}`)}}catch(e){console.error(e)}
  return r}})(infoFor);
{const _bp=bsPanel102;bsPanel102=function(){const h=_bp.apply(this,arguments);
  return h.replace('<button type="button" class="linkbtn" data-bs102off',`<label>잠·술을 몸 시작에도 <input type="number" min="0" max="100" data-f104="sp" value="${spPct104()}">%</label><button type="button" class="linkbtn" data-bs102off`)}}
addEventListener('change',e=>{const t=e.target;if(!t||!t.dataset||t.dataset.f104!=='sp')return;e.stopPropagation();const v=Math.round(+t.value);if(!isFinite(v))return;
  C.bs102=Object.assign({},C.bs102||{},{sp:clamp(v,0,100)});save('config');t.blur();reBs102()},true);

/* ---- ③ 한 번짜리 정리(사용자 OK, 11/14) ---- */
// [할 일 id, 이을 카드 id, 이 카드일 때만(지워진 카드)] — 이미 다른 살아 있는 카드에 이어져 있으면 안 건드림
const LINK104=[['tyf41846k5l','g6'],['tlmyoxvtki6','dp5eh8'],['thhdi4c91vb','dp5eh8']];
// [카드 id, 보조 영역, 몫%] — 사용자가 이미 보조 영역을 정한 카드(ar2 키가 있음)는 안 건드림
const AR104=[['9oi9xl7','body',50],['g6','body',30],['g20','body',50],['dp5eh8','mind',30],['dp22fz4','mind',50],['dp155a1','mind',30],
  ['939vyek','mind',30],['taphz8p','body',30],['dp9a43','body',30],['dp23phv','body',30],['dqelkwfe','body',30],['g15','mind',30],
  ['kck6','life',30],['g13','mind',30],['g25','mind',30],['g22','mind',30]];
function mig104(){if(C.mig104||!ready72()||!tOK64()||!Array.isArray(C.actions))return null;
  const has=id=>C.actions.some(a=>a.id===id),out={links:[],ar:[]};
  if(!LINK104.some(([tid])=>TASKS[tid])){C.mig104={at:gk76(),n:0,skip:1};save('config');return out}   // 이 사용자(와 그 베타 복사본) 기록에만
  LINK104.forEach(([tid,aid])=>{const t=TASKS[tid];if(!t||!has(aid)||(t.aid&&has(t.aid)))return;t.aid=aid;saveTask(t);out.links.push([t.title,(C.actions.find(a=>a.id===aid)||{}).name])});
  AR104.forEach(([id,ar,r])=>{const a=C.actions.find(x=>x.id===id);if(!a||'ar2' in a||!C.areas.some(x=>x.id===ar)||a.area===ar)return;a.ar2=ar;a.r2=r;out.ar.push(a.name+' +'+((C.areas.find(x=>x.id===ar)||{}).name||ar)+' '+r+'%')});
  C.mig104={at:gk76(),n:out.links.length+out.ar.length};save('config');
  if(out.links.length||out.ar.length)setTimeout(()=>{try{toast(`🃏 카드 잇기 ${out.links.length}개 · 보조 영역 ${out.ar.length}개 넣었어요 — 편집 → 행동에서 빼면 돼요`)}catch(e){}},1200);
  return out}
render=(function(prev){return function(){try{mig104()}catch(e){console.error(e)}return prev.apply(this,arguments)}})(render);

/* ---- ④ 카드 지울 때 이어진 할 일 먼저 ---- */
function rtOf104(t){const r=(C.routines||[]).find(r=>(r.steps||[]).some(s=>s.tid===t.id));return r?r.name:''}
function linked104(ids){const S=new Set(ids);return Object.values(TASKS).filter(t=>t&&t.aid&&S.has(t.aid)&&!t.cb76&&!t.ml80)}
const DEL104={ids:null,ok:0};
{const _del=delActs;delActs=function(ids){ids=[...new Set(ids||[])];if(!ids.length)return;
  if(DEL104.ok){DEL104.ok=0;return _del.call(this,ids)}
  const L=linked104(ids).filter(t=>t.status!==-1);if(!L.length)return _del.call(this,ids);
  DEL104.ids=ids;const S=new Set(ids),gone=C.actions.filter(a=>S.has(a.id)),g0=gone[0]||{};
  const pool=C.actions.filter(a=>!S.has(a.id)&&!a.doneAt&&a.type===(g0.type||'good')).sort((x,y)=>(y.area===g0.area)-(x.area===g0.area)||String(x.name).localeCompare(String(y.name),'ko'));
  const ar=id=>(C.areas.find(x=>x.id===id)||{}).name||'';
  const rows=L.slice(0,12).map(t=>{const rn=rtOf104(t);return `<li>${rn?`<b>${esc(rn)}</b> › `:''}${esc(t.title)}${t.rep?' <span class="tiny muted">↻</span>':''}${ids.length>1?` <span class="tiny muted">(${esc((C.actions.find(a=>a.id===t.aid)||{}).name||'')})</span>`:''}</li>`}).join('');
  sheetCtx={d104:1};
  openSheet(`<div class="sh"><h3>🗑 ${gone.length===1?`'${esc(g0.name)}'`:gone.length+'개 카드'} 지우기 전에</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <p class="small" style="margin:0 0 4px">이 카드에 이어진 할 일${L.some(t=>rtOf104(t))?'·루틴 단계':''}가 <b>${L.length}개</b> 있어요. 그냥 지우면 이 일들은 끝내도 <b>컨디션 0점</b>이 돼요.</p>
    <ul class="d104l">${rows}${L.length>12?`<li class="tiny muted">… 외 ${L.length-12}개</li>`:''}</ul>
    <label class="small d104s">이어진 일을 옮길 카드 <select data-d104sel="1"><option value="">— 카드 없이(연결 풀기)</option>${pool.map(a=>`<option value="${esc(a.id)}">${esc(a.name)}${a.area!==g0.area?' · '+esc(ar(a.area)):''}</option>`).join('')}</select></label>
    <div class="row" style="margin-top:10px;gap:6px;flex-wrap:wrap"><button type="button" class="btn sm" data-d104="go">연결 풀고 지우기</button><button type="button" class="btn ghost sm" data-d104="cancel">취소</button></div>`)}}
addEventListener('change',e=>{const s=e.target;if(!s||!s.dataset||!s.dataset.d104sel)return;e.stopPropagation();const b=document.querySelector('[data-d104="go"]');
  if(b)b.textContent=s.value?`'${(C.actions.find(a=>a.id===s.value)||{}).name||''}'로 옮기고 지우기`:'연결 풀고 지우기'},true);
addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('[data-d104]');if(!b)return;e.preventDefault();e.stopPropagation();
  const ids=DEL104.ids;if(b.dataset.d104==='cancel'||!ids){DEL104.ids=null;closeSheet();return}
  const sel=document.querySelector('[data-d104sel]'),to=sel&&sel.value||'',L=linked104(ids);
  L.forEach(t=>{if(to)t.aid=to;else delete t.aid;saveTask(t)});
  DEL104.ids=null;closeSheet();DEL104.ok=1;delActs(ids);
  setTimeout(()=>{try{toast(to?`이어진 일 ${L.length}개를 '${(C.actions.find(a=>a.id===to)||{}).name}'로 옮기고 지웠어요`:`이어진 일 ${L.length}개의 카드 연결을 풀고 지웠어요`)}catch(x){}},400)},true);

/* ---- ⑤ 기록하기 '…한 일' 칸 맨 위 하루 요약 ---- */
function daySum104(day){if(!day)return '';const es=day.entries||[];
  const hp=overallOf(day),mood=moodKey(hp),av=areaValues(day);let xp=0,gold=0,brave=0,good=0,bad=0;const px={};
  es.forEach(e=>{xp+=+e.xp||0;gold+=+e.gold||0;if(e.type==='bad')bad++;else if(e.type==='good')good++;
    try{if(typeof brv100==='function'?brv100(e):isBrave(e))brave++}catch(x){}
    const k=e.area&&typeof akOf101==='function'?akOf101(e.area):'';if(k&&k!=='c'&&e.xp)px[e.area]=(px[e.area]||0)+(+e.xp||0)});
  const nm=id=>esc((C.areas.find(a=>a.id===id)||{}).name||id);
  const cs=C.areas.filter(a=>typeof akOf101!=='function'||akOf101(a.id)==='c').map(a=>`${esc(a.name)} <b class="num">${Math.round(av[a.id]??0)}</b>`).join(' · ');
  const ps=Object.keys(px).map(id=>`${nm(id)} ✨<b class="num">${px[id]>0?'+':''}${px[id]}</b>`).join(' · ');
  let sl='';try{if(typeof new102==='function'&&new102(day)){const S=st102(day),m=slMin102(day.sl102);sl=`😴 ${day.sl102?(m!=null?hmS102(m):'—')+(day.sl102.dr?' 🍺':''):'잠 안 적음'} · 몸 최대 <b class="num">${S.cap}</b>`}}catch(x){}
  const L=levelOf(P.xp),sg=v=>(v>0?'+':v<0?'−':'')+Math.abs(v);
  return `<div class="ds104"><span class="av104" aria-hidden="true">${spriteSVG(C.avatar.kind,mood,C.avatar.outfit,{level:L.lv,fx:false})}</span>
    <div class="dt104"><div><b>${esc(MOOD_NAME[mood])}</b> · ❤ HP <b class="num">${hp}</b> · ✨ <b class="num">${sg(xp)}</b> XP · 💰 <b class="num">${sg(gold)}</b> · ⚡ 용기 <b class="num">${brave}</b></div>
    <div class="tiny">기록 ${es.length}개 (▲${good} ▼${bad})${cs?' · 🔋 '+cs:''}</div>
    ${ps||sl?`<div class="tiny">${[ps?'📈 '+ps:'',sl].filter(Boolean).join(' · ')}</div>`:''}</div></div>`}
renderLog=(function(prev){return function(){const r=prev.apply(this,arguments);
  try{const ul=$('log');if(ul&&ul.parentElement){let b=ul.parentElement.querySelector('.ds104w');if(!b){b=document.createElement('div');b.className='ds104w';const h=ul.parentElement.querySelector('.help');(h||ul).insertAdjacentElement(h?'afterend':'beforebegin',b)}
    b.innerHTML=daySum104(curDay())}}catch(e){console.error(e)}return r}})(renderLog);

/* ---- 안내 ---- */
F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['📋 그날 요약','기록하기 → 오늘·어제·그저께 한 일 칸 맨 위','그날 아바타·기분·HP·얻은 XP·골드·용기·기록 수·영역 값을 한눈에',()=>{location.hash='log'},'하루 요약 정리 오늘 어제 그저께 HP XP 골드 용기'],
  ['🗑 카드 지울 때 이어진 일','카드 메뉴·편집 → 지우기','카드에 할 일·루틴 단계가 이어져 있으면 먼저 다른 카드로 옮길지 물어봐요(그냥 지우면 0점이 돼서)',()=>{location.hash='log'},'카드 삭제 지우기 이어진 할 일 루틴 단계 0점'],
  ['😴 잠·술 → 몸 시작에도','편집 → 컨디션 영역 맨 아래 몸 출발점','어젯밤 잠·술로 깎인 몸 최대의 일부(기본 50%)를 몸 시작(HP 시작)에서도 빼요. 술 카드를 따로 기록한 날은 그 몫은 안 빼요',()=>{location.hash='edit'},'잠 술 몸 시작 HP 시작 수면 부족'],
  ['✋ 폰 시간표 꾹 눌러 옮기기','캘린더·할 일 화면 시간표(폰)','스크롤하다 잘못 옮기지 않게: 블록 옮기기·길이 바꾸기는 꾹(약 0.5초) 누른 뒤 끌어요. 진동이 오면 끌기 시작',()=>{location.hash='cal'},'폰 터치 스크롤 실수 블록 옮김 길이 손잡이 꾹']])}})(F67);
