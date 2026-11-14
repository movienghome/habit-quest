/* ---- v10.4 (w103.js): 11/14 사용자 피드백 묶음 — 잠 칩 글자 · 몸 최대 설명 · HP 비교에 들어간 기록 · 체크 = 기록 창 · 카드 누르면 메뉴 · 보조 영역 · 영역 칸 테두리 ----
   ① 😴 칩: 🛏만으로는 뜻을 몰라서 글자로('😴 어젯밤 잠?' / '😴 잠 5h20 · 🍺술 · 몸 최대 75'). slChip102 다시 선언.
   ② 몸 최대 설명: 몸 막대(빗금 포함)를 누르면 영역 창 맨 위에 '왜 · 몇 점 · 지금 얼마 · 어떻게 벗어나나'. 빗금에 마우스를 올려도 같은 요약.
   ③ HP 7일 비교(why102 다시 선언): 들어간 기록(술·늦게 잠 등)도 이름과 함께 · 옛 규칙은 진척·경제 기록까지 더해 감점이 묻혔다(100에서 잘림)는 설명
      · 점수 0인 기록(카드 안 이은 할 일·루틴 단계, 이은 카드가 지워진 것)을 이름으로 — 눌러서 할 일 열기. 
   ④ 카드 체크박스(.chk[data-act])·설명 창 '지금 기록' → 바로 기록 대신 기록 창(📅 언제?)을 엶. C.sh103===0이면 예전처럼 바로.
      편집 → 규칙 '완료할 때'에 켜고 끄는 칩. 할 일 목록의 습관 줄(.tchk)은 그대로 바로 체크.
   ⑤ 기록하기 타일의 빈 곳(체크박스·↻ 밖)을 누르면 카드 메뉴(actMenu61 다시 선언): 머리에 영역·점수·7일/전체 횟수·마지막,
      ✓ 기록하기(창) · ℹ 설명·통계 · ✎ 편집 · 📋 편집 목록에서 보기 · … · 🗑 지우기. 길게 누르기·우클릭도 같은 메뉴.
   ⑥ 보조 영역: 카드 a.ar2(영역 id)·a.r2(보조 몫 %, 기본 50). 기록할 때 applyEntry 감싸개가 e.ar2·e.r2를 찍음(그 뒤 카드를 바꿔도 지난 기록은 그대로).
      계산은 기록을 두 조각(주 영역 cond−c2 / 보조 영역 c2)으로 나눈 '나눈 날'(spDay103)로 — areaValues·overallOf·bodyDelta102·hpParts101을 감쌈.
      HP 합은 같고(둘 다 🔋이면), 영역 막대·몸 최대만 나뉘어 반영. 카드 편집 칩 줄에 ＋보조 영역·몫 칩.
   ⑦ 기록하기 영역 칸 테두리(CSS만, v103.css). */

/* ---- ① 😴 칩 ---- */
function slChip102(){const day=today();if(!new102(day))return '';const s=day.sl102,m=slMin102(s),S=st102(day);
  const has=!!(s&&(m!=null||s.dr||s.ln));
  const tip=has?`어젯밤 잠 ${m!=null?hm102(m):'—'}${s.dr?' · 술':''}${s.ln?' · 늦은 야식':''} → 오늘 몸 최대 ${S.cap} · 몸 시작 ${S.start}. 눌러서 고치기`:'어젯밤 몇 시에 자고 일어났는지 적으면 오늘 몸 최대가 정해져요(안 적어도 돼요)';
  return `<button type="button" class="sl102${has?'':' no102'}" data-sl102="1" title="${esc(tip)}" aria-label="${esc(tip)}">😴 ${has?`잠 <span class="num">${m!=null?hmS102(m):'—'}</span>${s.dr?' · 🍺술':''}${s.ln?' · 🌙야식':''}${S.cap<100?` · <small>몸 최대 <b class="num">${S.cap}</b></small>`:''}`:'<small>어젯밤 잠?</small>'}</button>`}

/* ---- ⑥ 보조 영역: 기록에 찍기 · 나눈 날 ---- */
function r2Of103(a){const v=Math.round(+((a&&a.r2)||50));return clamp(isFinite(v)?v:50,10,90)}
function ar2Of103(a){return a&&a.ar2&&a.ar2!==a.area&&C.areas.some(x=>x.id===a.ar2)?a.ar2:''}
function st103(e){if(!e||e.ar2!==undefined||!e.aid||!e.cond)return;const a=C.actions.find(x=>x.id===e.aid),s=ar2Of103(a);
  if(!s||s===e.area)return;e.ar2=s;e.r2=r2Of103(a)}
function sp103(e){return e&&e.ar2&&e.cond&&e.ar2!==e.area?Math.round(e.cond*clamp(+e.r2||50,10,90)/100):0}
function spDay103(day){if(!day||!Array.isArray(day.entries)||!day.entries.some(e=>sp103(e)))return day;
  const es=[];day.entries.forEach(e=>{const c2=sp103(e);if(!c2||!C.areas.some(a=>a.id===e.ar2)){es.push(e);return}
    es.push(Object.assign({},e,{cond:e.cond-c2,ar2:undefined,sp103:1}));
    es.push(Object.assign({},e,{id:e.id+'~2',area:e.ar2,cond:c2,ar2:undefined,sp103:2,xp:0,gold:0}))});
  return Object.assign({},day,{entries:es})}
applyEntry=(function(prev){return function(day,e){try{st103(e)}catch(x){console.error(x)}return prev.apply(this,arguments)}})(applyEntry);
areaValues=(function(prev){return function(day){return prev.call(this,spDay103(day))}})(areaValues);
overallOf=(function(prev){return function(day){return prev.call(this,spDay103(day))}})(overallOf);
bodyDelta102=(function(prev){return function(day,onlyHP){return prev.call(this,spDay103(day),onlyHP)}})(bodyDelta102);
hpParts101=(function(prev){return function(day){return prev.call(this,spDay103(day))}})(hpParts101);

/* ---- ② 몸 최대 설명 ---- */
function capTxt103(day){const S=st102(day),b=bodyA102(),v=areaValues(day)[b],o=bs102(),cut=hpParts101(day).cut||0;
  return{S,v,o,cut,why:S.why.map(w=>`${w[1]} −${Math.abs(w[2])}`).join(' · ')}}
function capHTML103(day){const {S,v,o,cut,why}=capTxt103(day),has=!!day.sl102;
  if(S.cap>=100)return `<div class="cp103"><b>😴 오늘 몸 최대 100</b> <span class="tiny muted">— 깎인 것 없음${has?'':' (어젯밤 잠을 안 적음)'}</span> <button type="button" class="linkbtn" data-sl102="1">${has?'어젯밤 고치기':'어젯밤 잠 적기'}</button></div>`;
  const left=S.cap-v;
  return `<div class="cp103"><b>🔒 오늘 몸 최대 <span class="num">${S.cap}</span></b> <span class="tiny muted">— 빗금 칸은 오늘 몸 막대가 못 올라가는 자리</span>
    <ul>
    <li><b>왜</b>: ${esc(why)||'—'}${S.cap===o.floor?` <span class="tiny muted">(아무리 깎여도 ${o.floor}까지만)</span>`:''}</li>
    <li><b>지금</b>: 몸 <span class="num">${v}</span> / 최대 <span class="num">${S.cap}</span> → ${left>0?`아직 <b class="num">${left}</b> 더 오를 수 있어요`:`최대에 닿았어요${cut?` — 그 위 몸 변화 <b class="num">+${cut}</b>는 막대·HP에 안 들어갔어요`:''}`}</li>
    <li><b>벗어나기</b>: 오늘 안에는 안 풀려요(하루 단위). 내일 아침 새로 정해져요 — 오늘 밤 <b>${o.need}시간</b> 넘게 자고 술·늦은 야식 없이 지내면 내일 최대 100. 그동안 마음·생활 카드는 그대로 HP에 들어가요.</li>
    </ul>
    <span class="tiny"><button type="button" class="linkbtn" data-sl102="1">어젯밤 기록 고치기</button> · <button type="button" class="linkbtn" data-goedit101="areas">기준 바꾸기</button></span></div>`}
infoFor=(function(prev){return function(k){const r=prev.apply(this,arguments);
  try{const day=curDay();if(r&&k==='area:'+bodyA102()&&new102(day))r.b=capHTML103(day)+r.b}catch(e){console.error(e)}
  return r}})(infoFor);
renderHome=(function(prev){return function(day){const r=prev.apply(this,arguments);
  try{if(new102(day)){const c=document.querySelector('#areaBars .cap102');if(c){const {S,v,why}=capTxt103(day);
    c.title=`🔒 오늘 몸 최대 ${S.cap} (지금 ${v})\n왜: ${why}\n벗어나기: 내일 아침 새로 정해져요 — 오늘 밤 잘 자고 술·야식 없이\n누르면 자세히`}}}catch(e){console.error(e)}
  return r}})(renderHome);

/* ---- ③ HP 7일 비교: 들어간 것·0점인 것까지 ---- */
const Z103=new Set(['task','act','free','start65']);
function zeroWhy103(e){const t=e.tid&&TASKS[e.tid];const aid=(t&&t.aid)||e.aid;
  if(aid&&aid[0]!=='@'&&!C.actions.some(a=>a.id===aid))return '이은 카드가 지워짐';
  if(t&&!t.aid)return t.rstep||t.parent?'루틴 단계 · 카드 없음':'카드 없음';
  return e.aid?'카드에 컨디션 점수 없음':'카드 없음'}
function why102(d0){
  const d=spDay103(d0),ob=(C.energyBase||[])[((d.energy)||3)-1]??60,ol=ENERGY_LBL[((d.energy)||3)-1]||'보통',n2=new102(d),S=n2?st102(d):null,nb=S?S.start:hpb101();
  const ids=new Set(C.areas.map(a=>a.id)),ex={},inn=[],zero=[];let exS=0,inS=0;
  (d.entries||[]).forEach(e=>{if(!e)return;
    if(!e.cond){if(e.type!=='bad'&&!e.sp103&&(Z103.has(e.kind)&&e.kind!=='act'||(e.aid&&e.aid[0]!=='@'&&!C.actions.some(a=>a.id===e.aid))))zero.push(e);return}
    if(!ids.has(e.area))return;
    if(inHP101(e)){inn.push(e);inS+=e.cond;return}
    (ex[e.area]=ex[e.area]||[]).push(e);exS+=e.cond});
  const fd=foodDelta(d);let fS=0;const fx=[];for(const k in fd)if(ids.has(k)&&akOf101(k)!=='c'&&fd[k]){fS+=fd[k];fx.push([k,fd[k]])}
  let nS=0;neglectList(d.date).forEach(n=>{const ar=n.t&&n.t.area;if(ar&&ids.has(ar)&&akOf101(ar)!=='c')nS+=n.pen});
  const b=bodyA102(),cut=S&&b?Math.max(0,S.start+bodyDelta102(d,true)-S.cap):0;
  const sg=v=>`<b class="num">${v>0?'+':v<0?'−':'±'}${Math.abs(v)}</b>`,an=id=>{const a=C.areas.find(x=>x.id===id);return a?a.name:id};
  const nm=e=>`${esc(e.name||'')}${e.sp103?`<small class="muted">(${esc(an(e.area))})</small>`:''} ${e.cond>0?'+':'−'}${Math.abs(e.cond)}`;
  const L=[],old=ovOld101(d0),nw=ovNew101(d0);
  if(nb!==ob)L.push(`<li>🌅 시작: 옛 = 아침 에너지 '${esc(ol)}' ${ob} → 새 = ${S&&S.carry?`하루 시작값 ${S.hb} ${S.carry>0?'+':'−'} 어제 몸 이월 ${Math.abs(S.carry)} = ${nb}`:`하루 시작값 ${nb}`} ${sg(nb-ob)}</li>`);
  else L.push(`<li class="muted">🌅 시작: 둘 다 ${nb}</li>`);
  if(inn.length){const bad=inn.filter(e=>e.cond<0).sort((x,y)=>x.cond-y.cond),good=inn.filter(e=>e.cond>0).sort((x,y)=>y.cond-x.cond);
    L.push(`<li>🔋 HP에 들어간 기록 ${inn.length}개 ${sg(inS)}<div class="tiny">${bad.length?`<span class="bad">▼ ${bad.slice(0,6).map(nm).join(', ')}${bad.length>6?` 외 ${bad.length-6}개`:''}</span>`:''}${bad.length&&good.length?'<br>':''}${good.length?`▲ ${good.slice(0,6).map(nm).join(', ')}${good.length>6?` 외 ${good.length-6}개`:''}`:''}</div></li>`)}
  Object.keys(ex).forEach(id=>{const es=ex[id],s=es.reduce((t,e)=>t+e.cond,0),k=akOf101(id);
    L.push(`<li>${k==='c'?'○':AK101[k][0]} ${esc(an(id))} 기록 ${es.length}개는 HP에서 뺌 ${sg(-s)} <span class="tiny muted">— ${es.slice(0,4).map(nm).join(', ')}${es.length>4?` 외 ${es.length-4}개`:''}${k==='c'?' (카드에서 HP 빼기)':''}</span></li>`)});
  if(fS)L.push(`<li>🍽 진척·경제 영역 식사 칸 ${sg(-fS)} <span class="tiny muted">— ${fx.map(x=>esc(an(x[0]))).join('·')}</span></li>`);
  if(nS)L.push(`<li>⚠ 진척·경제 영역 방치 페널티는 HP에서 안 깎음 ${sg(nS)}</li>`);
  if(cut)L.push(`<li>🔒 몸 최대 ${S.cap}에 걸려 덜 오름 ${sg(-cut)} <span class="tiny muted">— ${S.why.map(w=>esc(w[1])).join(' · ')}</span></li>`);
  if(zero.length){const seen=new Set(),zs=zero.filter(e=>{const k=(e.tid||'')+'|'+e.name;if(seen.has(k))return false;seen.add(k);return true});
    L.push(`<li>○ 점수 0인 기록 ${zs.length}개 <span class="tiny muted">— 카드가 안 이어져 있으면 HP·영역에 안 들어가요(눌러서 할 일 열고 🃏 카드 잇기)</span><div class="z103">${zs.slice(0,10).map(e=>{const t=e.tid&&TASKS[e.tid];return t?`<button type="button" class="chipbtn" data-z103="${esc(t.id)}" title="${esc(zeroWhy103(e))}">${esc(e.name||t.title||'')} <small class="muted">${esc(zeroWhy103(e))}</small></button>`:`<span class="chipbtn" title="${esc(zeroWhy103(e))}">${esc(e.name||'')} <small class="muted">${esc(zeroWhy103(e))}</small></span>`}).join('')}${zs.length>10?` <span class="tiny muted">외 ${zs.length-10}개</span>`:''}</div></li>`)}
  if(old!==nw&&exS)L.push(`<li class="tiny muted">옛 규칙은 <b>모든 영역</b> 기록을 더했어요 — 위 진척·경제 기록(${exS>0?'+':''}${exS})이 술·늦게 잠 같은 감점을 덮었${old>=100?'고, 100을 넘는 건 잘렸':''}어요. 새 규칙은 🔋 영역만 더해서 감점이 그대로 보여요.</li>`);
  return `<ul class="wl102">${L.join('')}</ul>`}
function cmp101(){const td=gk76(),rows=[];
  for(let i=0;i<7;i++){const k=addDays(td,-i),d=DAYS[k];if(!d||!hasData(d))continue;const o=ovOld101(d),n=ovNew101(d),df=n-o;
    rows.push(`<details class="cw102"><summary><span>${esc(wdOf(k))} ${esc(fmtD(k))}</span><span class="num">${o}</span><span aria-hidden="true">→</span><b class="num">${n}</b><small class="num">${df?(df>0?'+':'−')+Math.abs(df):'같음'}</small></summary>${why102(d)}</details>`)}
  return rows.length?`<div class="cm102"><div class="cw102h tiny muted"><span>날짜</span><span>옛</span><span></span><span>새</span><span>차이 · 눌러서 이유</span></div>${rows.join('')}</div><p class="tiny muted" style="margin:4px 0 0">옛 규칙 = 그날 고른 아침 에너지 + 모든 영역 기록 · 새 규칙 = 하루 시작값 ${hpb101()}${on102()?'(+ 어제 몸 이월, 몸 최대)':''} + 🔋 영역 기록만${C.bv101!==0?'(+⚔ 용기)':''}. 지난 날 홈·통계는 그날 규칙 그대로예요 — 여기서만 비교해요.</p>`:''}
addEventListener('click',e=>{const p=e.target.closest&&e.target.closest('#pop [data-sl102],#pop [data-goedit101]');if(p)try{closeInfo()}catch(x){}},true);
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-z103]');if(!b)return;e.preventDefault();e.stopPropagation();const t=TASKS[b.dataset.z103];if(!t)return;
  try{closeInfo()}catch(x){}setTimeout(()=>openTaskSheet(t.id),30)},true);

/* ---- ④ 카드 체크 = 기록 창 ---- */
function sh103(){return C.sh103!==0}
addEventListener('click',e=>{const T=e.target;if(!T||!T.closest||!sh103())return;
  const b=T.closest('.chk[data-act],#pop [data-act]');if(!b||b.closest('#sheetC'))return;
  if(typeof lpFired!=='undefined'&&lpFired)return;
  const a=C.actions.find(x=>x.id===b.dataset.act);if(!a||a.doneAt)return;
  e.preventDefault();e.stopImmediatePropagation();if(b.closest('#pop'))try{closeInfo()}catch(x){}
  if(!guard())return;openDoneSheet({a})},true);
renderEdit=(function(prev){return function(){const r=prev.apply(this,arguments);
  try{const s=document.querySelector('#editBody [data-sheetmode]');if(s&&!document.querySelector('#editBody [data-sh103]')){const p=s.parentElement;
    p.insertAdjacentHTML('afterend',`<p class="row" style="gap:6px;margin-top:6px"><button type="button" class="chipbtn" data-sh103="1" aria-pressed="${sh103()}">${sh103()?'☑ 카드 체크박스 → 기록 창(📅 언제?) 열기':'☐ 카드 체크박스 → 바로 기록'}</button><span class="tiny muted">기록하기·홈 카드의 □</span></p>`)}}catch(e){console.error(e)}
  return r}})(renderEdit);
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-sh103]');if(!b)return;e.preventDefault();e.stopPropagation();if(!ready)return;
  C.sh103=sh103()?0:1;save('config');renderEdit();toast(sh103()?'카드 □를 누르면 기록 창이 떠요(날짜·옵션 확인)':'카드 □를 누르면 바로 기록돼요(날짜는 아래 알림에서)')},true);

/* ---- ⑤ 카드 빈 곳 → 메뉴 ---- */
function st7_103(id){const td=gk76();let w=0,all=0,last='';
  Object.keys(DAYS).forEach(k=>{const n=((DAYS[k]||{}).entries||[]).filter(e=>e.aid===id).length;if(!n)return;all+=n;if(diffDays(td,k)<7)w+=n;if(k>last)last=k});return{w,all,last}}
function actMenu61(a,x,y){
  const ht=habT(a),good=a.type==='good',ar=C.areas.find(z=>z.id===a.area),a2=C.areas.find(z=>z.id===ar2Of103(a)),s=st7_103(a.id);
  const sc=[good&&+a.xp?`✨${a.xp}`:'',+a.gold?`💰${a.gold>0?'+':''}${a.gold}`:'',+a.cond?`🔋${a.cond>0?'+':''}${a.cond}`:''].filter(Boolean).join(' ');
  menu61(x,y,`${good?'▲':'▼'} ${esc(a.name)}`,[
    {html:`<div class="m103d">${ar?esc(ar.name):''}${a2?` + ${esc(a2.name)} ${r2Of103(a)}%`:''}${sc?' · '+sc:''}<br>7일 ${s.w}번 · 전체 ${s.all}번${s.last?' · 마지막 '+esc(fmtD(s.last)):''}${a.reframe?`<br><span class="muted">💭 ${esc(a.reframe)}</span>`:''}</div>`,f:()=>{}},
    {l:'✓ 기록하기… <small class="muted">(📅 언제?)</small>',dis:!!a.doneAt,f:()=>{if(guard())openDoneSheet({a})}},
    {l:'ℹ 설명·통계',f:()=>{lastPt={x,y};openInfo('act:'+a.id)}},
    {l:'✎ 편집',f:()=>openActionEditor(a.id)},
    {l:'📋 편집 목록에서 보기',f:()=>goList103(a.id)},
    '-',
    {l:ht?'↻ 반복 할 일 열기':'↻ 매일 반복으로',dis:!good,f:()=>{if(ht)openTaskSheet(ht.id);else{const t=setRhythm(a,{f:'d',i:1});render();if(t)openTaskSheet(t.id)}}},
    {l:ht&&ht.quest?'☑ 일퀘 끄기':'☑ 일퀘로',dis:!good,f:()=>{if(ht){if(ht.quest)delete ht.quest;else ht.quest=1;saveTask(ht);syncDailies(C);save('config')}else setRhythm(a,{f:'d',i:1},{quest:1});render();toast(habT(a)&&habT(a).quest?'☑ 일퀘가 됐어요':'일퀘를 껐어요')}},
    {l:'⏱ 루틴에 넣기…',dis:!good,f:()=>{lastPt={x,y};rtJoin61('a',a.id)}},
    {l:a.brave?'⚔ 용기 표시 끄기':'⚔ 용기 표시 (보통)',dis:!good,f:()=>{if(a.brave)delete a.brave;else a.brave='m';save('config');render();toast(a.brave?'⚔ 용기 카드가 됐어요 · 보스에게 치명타':'용기 표시를 껐어요')}},
    {html:good?`<div class="m61h">🍬 도파민 코스</div><div class="m61w">${dopaC().map(c=>`<button type="button" class="chipbtn" data-m61dopa="${a.id}:${c[0]}" aria-pressed="${a.dopa===c[0]}">${esc(c[1])}</button>`).join('')}${a.dopa?`<button type="button" class="chipbtn" data-m61dopa="${a.id}:">빼기</button>`:''}</div>`:'',f:()=>{}},
    '-',
    {l:'🗑 지우기',bad:1,f:()=>delActs([a.id])}])}
function goList103(id){ui.edit='actions';try{closeSheet()}catch(x){}location.hash='edit';
  setTimeout(()=>{try{renderEdit()}catch(x){}const r=document.querySelector(`#editBody [data-rowid="${CSS.escape(id)}"]`);const el=r&&(r.hidden?r.closest('.dchip')||r.parentElement:r);
    if(el){el.scrollIntoView({block:'center'});el.classList.add('fl103');setTimeout(()=>el.classList.remove('fl103'),2200)}else toast('목록에서 안 보여요 — 찾기·거르기를 확인해요')},120)}
addEventListener('click',e=>{const T=e.target;if(!T||!T.closest)return;
  const row=T.closest('#actGroups .act[data-info^="act:"],#braveActs .act[data-info^="act:"]');if(!row)return;
  if(T.closest('button,a,input,select,textarea,label'))return;
  if(typeof lpFired!=='undefined'&&lpFired)return;if(typeof DND!=='undefined'&&DND.on)return;
  const a=C.actions.find(z=>z.id===row.dataset.info.slice(4));if(!a)return;
  e.preventDefault();e.stopImmediatePropagation();lastPt={x:e.clientX,y:e.clientY};actMenu61(a,e.clientX,e.clientY)},true);

/* ---- ⑥ 보조 영역: 카드 편집 칩 · 기록 창 미리보기 · 카드 글자 ---- */
openActionEditor=(function(prev){return function(id){const r=prev.apply(this,arguments);
  try{const sc=$('sheetC'),row=sc&&sc.querySelector('.r95'),a=C.actions.find(x=>x.id===id);
    if(row&&a&&!row.querySelector('[data-ae="ar2"]')){const cur=ar2Of103(a);
      const s1=document.createElement('select');s1.dataset.ae='ar2';s1.className='c95 ar103'+(cur?'':' def95');s1.setAttribute('aria-label','보조 영역(컨디션을 나눠 받을 영역)');
      s1.innerHTML=`<option value="">＋ 보조 영역</option>`+C.areas.filter(x=>x.id!==a.area).map(x=>`<option value="${esc(x.id)}">＋ ${esc(x.name)}에도</option>`).join('');s1.value=cur;
      const s2=document.createElement('select');s2.dataset.ae='r2';s2.className='c95 r103'+(cur?'':' hid78');s2.setAttribute('aria-label','보조 영역 몫');
      s2.innerHTML=[30,50,70].map(v=>`<option value="${v}">보조 ${v}%</option>`).join('');s2.value=String(r2Of103(a));
      const ar=row.querySelector('[data-ae="hk101"]')||row.querySelector('[data-ae="area"]');if(ar){ar.after(s1);s1.after(s2)}else{row.appendChild(s1);row.appendChild(s2)}}}catch(e){console.error(e)}
  return r}})(openActionEditor);
addEventListener('change',e=>{const t=e.target;if(!t||!t.matches||!t.matches('select.ar103,select.r103'))return;
  t.classList.toggle('def95',t.matches('.ar103')&&!t.value);
  if(t.matches('.ar103')){const r=t.parentElement&&t.parentElement.querySelector('select.r103');if(r)r.classList.toggle('hid78',!t.value)}});
drawDoneSheet=(function(prev){return function(){const x=prev.apply(this,arguments);
  try{const S=sheetCtx,a=S&&S.a,p=$('sxPrev');if(a&&p&&ar2Of103(a)&&(!S.e||S.e.kind==='act')){const pv=sheetPreview()||{},c2=sp103({ar2:ar2Of103(a),r2:r2Of103(a),cond:pv.cond,area:S.area||pv.area});
    if(c2){const an=id=>(C.areas.find(z=>z.id===id)||{}).name||'';p.insertAdjacentHTML('beforeend',`<span class="tiny muted sp103">→ ${esc(an(S.area||pv.area))} ${pv.cond-c2>0?'+':''}${pv.cond-c2} · ${esc(an(ar2Of103(a)))} ${c2>0?'+':''}${c2}</span>`)}}}catch(e){console.error(e)}
  return x}})(drawDoneSheet);
metaChips=(function(prev){return function(a){const h=prev.apply(this,arguments);
  try{const s=ar2Of103(a);if(s&&+a.cond){const n=(C.areas.find(z=>z.id===s)||{}).name||'';return h+`<span class="g96 ar103g" title="컨디션을 ${esc(n)}에도 ${r2Of103(a)}% 나눠 줘요">＋${esc(n)}</span>`}}catch(e){}
  return h}})(metaChips);

F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['🔒 몸 최대 설명','홈 몸 막대(빗금) 누르기','왜 깎였는지·몇 점인지·지금 얼마인지·어떻게 벗어나는지(내일 아침 새로 정해짐)를 보여 줘요.',()=>{location.hash='home'},'몸 최대 상한 빗금 잠 술 야식'],
  ['☑ 카드 체크 = 기록 창','기록하기·홈 카드의 □ · 편집 → 규칙 → 완료할 때','□를 누르면 📅 언제?·옵션·메모가 있는 기록 창이 떠요. 끄면 예전처럼 바로 기록.',()=>{location.hash='log'},'체크 체크박스 기록 창 날짜 언제'],
  ['📋 카드 메뉴','기록하기 카드의 빈 곳 누르기','기록하기·설명·편집·편집 목록에서 보기·반복·일퀘·루틴·용기·지우기.',()=>{location.hash='log'},'카드 메뉴 설명 편집 지우기 목록'],
  ['＋ 보조 영역(몸·마음 같이)','카드 편집 칩 줄 ＋ 보조 영역','명상·샤워·외출·운동처럼 두 영역에 걸친 카드: 컨디션을 보조 영역에 30·50·70% 나눠 줘요(HP 합은 같음).',()=>{location.hash='log'},'보조 영역 몸 마음 같이 나누기 샤워 명상 운동 외출']])}})(F67);
