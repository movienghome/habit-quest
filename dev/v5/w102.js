/* ---- v10.3 (w102.js): F1 조각 2 — 몸 출발점(어젯밤 잠·술·야식 → 몸 최대, 어제 몸 끝값 일부 이월) + HP 비교 이유 + 전투 카드 다듬기 ----
   설계: TODO 'F 결정' F1·F1 쪼개기 ②. 사용자(11/14): 몸 상한은 몸 막대에만.
   ① 입력 = 그날(게임 날) day.sl102={b:'HH:MM'(잠든),w:'HH:MM'(일어난),dr:0|1(술),ln:0|1(늦은 야식)}. 아침에 묻는 창은 없음 —
      전투 카드 기분 줄 옆 🛏 칩(안 적었으면 점선)을 누르면 작은 창. 술·야식은 어제 기록(▼ 카드·식사 칸)에서 찾아 미리 켜 둠.
   ② 몸 최대(cap) = 100 − 잠 모자란 시간×cut − 술 dr − 야식 ln (아래 floor). **몸 막대에만** 걸고, HP에는 '몸 몫'이 그만큼까지만 들어감
      (몸 막대가 84에서 멈추면 HP도 몸 쪽으로는 더 안 오름 — 둘이 어긋나지 않게).
   ③ 몸 시작 = 하루 시작값 + (어제 몸 끝값 − 시작값) × carry%. 어제 끝값은 어제 이월을 빼고 셈(나쁜 날이 줄줄이 끌어내리지 않게, 재귀 없음).
      다른 🔋 영역(마음·생활)은 하루 시작값 그대로. HP 시작 = 몸 시작(이월만큼 움직임).
   ④ 지난 날 고정: C.f2from102(처음 켜진 게임 날) 앞은 조각 1 규칙 그대로. C.bs102off=1이면 끔. 기준값 C.bs102={need,cut,dr,ln,carry,floor}.
   ⑤ hpBase101(day,aid)는 여기서 다시 선언 — aid(영역)를 주면 그 영역 시작값, 안 주면 HP 시작값(=몸 시작). patch55가 영역 칸 두 곳에 aid를 넣음.
   ⑥ HP 창 '최근 7일 옛→새'는 줄마다 펼쳐서 이유(시작값 차이·빠진 기록·식사·몸 최대로 잘린 것)를 봄 — cmp101 다시 선언.
   ⑦ 전투 카드: 📖 도감 단추를 쫄따구 줄 끝 빈자리로 · 📈/💰 칩을 짧게 해 한 줄로(prog101 다시 선언). */
const BS102D={need:7,cut:6,dr:15,ln:5,carry:30,floor:50};
function bs102(){const o=Object.assign({},BS102D,C.bs102||{});for(const k in BS102D){const v=+o[k];o[k]=isFinite(v)?v:BS102D[k]}return o}
function on102(){return on101()&&!!C.f2from102&&C.bs102off!==1}
function new102(day){return on102()&&new101(day)&&!!day&&String(day.date||'')>=C.f2from102}
function bodyA102(){const cs=C.areas.filter(a=>akOf101(a.id)==='c');
  const p=(C.bodyA102&&cs.find(a=>a.id===C.bodyA102))||cs.find(a=>a.id==='body')||cs.find(a=>/몸|건강|신체/.test(a.name||''));return p?p.id:''}
const tm102=s=>{const m=/^(\d{1,2}):(\d{2})$/.exec(s||'');return m?(+m[1])*60+(+m[2]):null};
function slMin102(s){if(!s)return null;const b=tm102(s.b),w=tm102(s.w);if(b==null||w==null)return null;const m=(w-b+1440)%1440;return m||null}
const hm102=m=>m==null?'—':`${Math.floor(m/60)}시간${m%60?' '+(m%60)+'분':''}`;
const hmS102=m=>m==null?'—':`${Math.floor(m/60)}h${m%60?pad(m%60):''}`;
function cap102(day){const s=day&&day.sl102,o=bs102(),why=[];let c=100;
  const m=slMin102(s);if(m!=null){const p=Math.round(Math.max(0,o.need*60-m)/60*o.cut);if(p>0){c-=p;why.push(['🛏',`잠 ${hm102(m)}(목표 ${o.need}시간)`,-p])}}
  if(s&&s.dr&&o.dr){c-=o.dr;why.push(['🍺','어젯밤 술',-o.dr])}
  if(s&&s.ln&&o.ln){c-=o.ln;why.push(['🌙','늦은 야식',-o.ln])}
  return{cap:clamp(Math.round(Math.max(o.floor,c)),0,100),why}}
function bodyDelta102(day,onlyHP){const b=bodyA102();let v=0;if(!b||!day)return 0;
  (day.entries||[]).forEach(e=>{if(e.cond&&e.area===b&&(!onlyHP||inHP101(e)))v+=e.cond});
  const fd=foodDelta(day);if(fd[b])v+=fd[b];
  neglectList(day.date).forEach(n=>{if(n.t&&n.t.area===b)v-=n.pen});return v}
function yEnd102(day){const y=DAYS[addDays(day.date,-1)];if(!y||!hasData(y)||!bodyA102())return null;   // 어제 몸 끝값(어제 이월은 뺌)
  return clamp(Math.min(hpb101()+bodyDelta102(y,false),cap102(y).cap),0,100)}
function st102(day){const o=bs102(),hb=hpb101(),ye=yEnd102(day),cr=ye==null?0:Math.round((ye-hb)*o.carry/100),K=cap102(day);
  return{start:clamp(Math.min(hb+cr,K.cap),0,100),carry:cr,ye,cap:K.cap,why:K.why,hb}}
// 시작값: aid를 주면 그 영역, 안 주면 HP(=몸 시작). 옛 규칙·조각 1 날은 그대로.
function hpBase101(day,aid){
  if(new102(day)){const S=st102(day),b=bodyA102();return (aid&&aid!==b)?S.hb:S.start}
  return new101(day)?hpb101():((C.energyBase||[])[((day&&day.energy)||3)-1]??60)}
{
  const av0=areaValues;
  areaValues=function(day){
    if(!new102(day))return av0.apply(this,arguments);
    const S=st102(day),b=bodyA102(),out={};
    C.areas.forEach(a=>out[a.id]=a.id===b?S.start:S.hb);
    (day.entries||[]).forEach(e=>{if(e.cond&&out[e.area]!=null)out[e.area]+=e.cond});
    const fd=foodDelta(day);for(const k in fd)if(out[k]!=null)out[k]+=fd[k];
    neglectList(day.date).forEach(n=>{if(n.t&&out[n.t.area]!=null)out[n.t.area]-=n.pen});
    for(const k in out){let v=out[k];if(k===b)v=Math.min(v,S.cap);out[k]=clamp(Math.round(v),0,100)}
    return out};
  const ov1=overallOf;
  overallOf=function(day){
    if(!new102(day))return ov1.apply(this,arguments);
    const S=st102(day),b=bodyA102();let o=0;
    (day.entries||[]).forEach(e=>{if(inHP101(e)&&e.area!==b)o+=e.cond});
    const fd=foodDelta(day);for(const k in fd)if(k!==b&&C.areas.some(a=>a.id===k)&&akOf101(k)==='c')o+=fd[k];
    neglectList(day.date).forEach(n=>{const ar=n.t&&n.t.area;if(ar&&ar!==b&&C.areas.some(a=>a.id===ar)&&akOf101(ar)==='c')o-=n.pen});
    const bd=b?Math.min(S.start+bodyDelta102(day,true),S.cap):S.hb;
    return clamp(Math.round(bd+o),0,100)};
}
function hpParts101(day){ // 설명 창: 시작 · 들어간 변화 · 안 들어간 변화 · 몸 최대로 잘린 것
  const n2=new102(day),S=n2?st102(day):null,base=S?S.start:hpb101(),b=bodyA102();let inn=0,out=0;
  (day.entries||[]).forEach(e=>{if(!e.cond||!e.area)return;if(inHP101(e))inn+=e.cond;else if(C.areas.some(a=>a.id===e.area))out+=e.cond});
  const cut=S&&b?Math.max(0,S.start+bodyDelta102(day,true)-S.cap):0;
  return{base,inn,out,cut,S}}
normDay=(function(prev){return function(k,raw){const d=prev.apply(this,arguments);
  try{const s=raw&&raw.sl102;if(s&&typeof s==='object')d.sl102={b:String(s.b||''),w:String(s.w||''),dr:s.dr?1:0,ln:s.ln?1:0}}catch(e){}return d}})(normDay);

/* ---- 처음 켜기 ---- */
function init102(){if(!ready72()||!C||!on101()||C.f2from102)return;
  C.f2from102=gk76();save('config');
  setTimeout(()=>toast('🛏 몸 출발점 시작 — 전투 카드의 🛏 칩에 어젯밤 잠을 적으면 오늘 몸 최대가 정해져요(안 적으면 그대로)',7000),2600)}
render=(function(prev){return function(){try{init102()}catch(e){console.error(e)}const r=prev.apply(this,arguments);   // 조각 1(init101)이 같은 렌더 안에서 켜지므로 뒤에도 한 번
  if(!C.f2from102)try{init102();if(C.f2from102)setTimeout(render,0)}catch(e){console.error(e)}return r}})(render);

/* ---- 어제 기록에서 술·야식 찾기 ---- */
function yHint102(k){const y=DAYS[addDays(k,-1)],r={dr:0,ln:0};if(!y)return r;
  (y.entries||[]).forEach(e=>{if(e.type!=='bad')return;const n=String(e.name||'')+' '+String(e.opt||'');
    if(e.aid==='b1'||/술|음주|과음|혼술|맥주|소주|와인/.test(n))r.dr=1;
    if(/야식|폭식|과식/.test(n)&&!/참/.test(n))r.ln=1});
  (C.food||[]).forEach(f=>{if(+((y.food||{})[f.id]||0)>0&&(+f.points||0)<0&&/야식|늦게\s*먹/.test(f.name||''))r.ln=1});
  return r}
function lastSl102(k){const ks=Object.keys(DAYS).filter(x=>x<k).sort().reverse();for(const x of ks){const s=DAYS[x]&&DAYS[x].sl102;if(s&&s.b&&s.w)return s}return null}

/* ---- 🛏 칩(전투 카드 기분 줄) ---- */
function slChip102(){const day=today();if(!new102(day))return '';const s=day.sl102,m=slMin102(s),S=st102(day);
  const has=!!(s&&(m!=null||s.dr||s.ln));
  const tip=has?`어젯밤 ${m!=null?hm102(m):'잠 —'}${s.dr?' · 술':''}${s.ln?' · 야식':''} → 몸 최대 ${S.cap} · 몸 시작 ${S.start}. 눌러서 고치기`:'어젯밤 몇 시에 자고 일어났는지 적으면 오늘 몸 최대가 정해져요(안 적어도 돼요)';
  return `<button type="button" class="sl102${has?'':' no102'}" data-sl102="1" title="${esc(tip)}" aria-label="${esc(tip)}">🛏 ${has?`<span class="num">${m!=null?hmS102(m):'—'}</span>${s.dr?' 🍺':''}${s.ln?' 🌙':''}${S.cap<100?` <small class="num">몸≤${S.cap}</small>`:''}`:'<small>어젯밤?</small>'}</button>`}

/* ---- 🛏 창 ---- */
const SL102={};
function slPrev102(){const sc=$('sheetC'),k=SL102.k;if(!sc||!k)return;const d=dayOf(k);
  const tmp={date:k,entries:d.entries,food:d.food,sl102:slRead102(),energy:d.energy};
  const S=st102(tmp),m=slMin102(tmp.sl102),o=bs102();
  const h=sc.querySelector('.hm102');if(h)h.textContent=m!=null?`→ ${hm102(m)}`:'';
  const r=sc.querySelector('.rs102');if(!r)return;
  const why=S.why.map(w=>`${w[0]} ${esc(w[1])} <b class="num">−${Math.abs(w[2])}</b>`).join(' · ');
  r.innerHTML=`<div>몸 최대 <b class="num">${S.cap}</b>${why?` <span class="tiny muted">= 100 ${why}${S.cap===o.floor&&S.why.reduce((s,w)=>s+w[2],100)<o.floor?` (아래로는 ${o.floor}까지만)`:''}</span>`:' <span class="tiny muted">(깎인 것 없음)</span>'}</div>
    <div>몸 시작 <b class="num">${S.start}</b> <span class="tiny muted">${S.ye==null?'= 하루 시작값 (어제 기록 없음)':`= ${S.hb} ${S.carry>=0?'+':'−'} ${Math.abs(S.carry)} (어제 몸 끝 ${S.ye}의 ${o.carry}% 이월)`}${S.start<S.hb+S.carry?` · 몸 최대까지만`:''}</span></div>`}
function slRead102(){const sc=$('sheetC'),g=s=>sc&&sc.querySelector(s);
  return{b:(g('[data-sl102b]')||{}).value||'',w:(g('[data-sl102w]')||{}).value||'',dr:g('[data-sl102t="dr"]')&&g('[data-sl102t="dr"]').getAttribute('aria-pressed')==='true'?1:0,ln:g('[data-sl102t="ln"]')&&g('[data-sl102t="ln"]').getAttribute('aria-pressed')==='true'?1:0}}
function slSheet102(k){k=k||gk76();SL102.k=k;const d=dayOf(k),s=d.sl102||{},hint=yHint102(k),last=lastSl102(k),o=bs102();
  const v={b:s.b||(last&&last.b)||'',w:s.w||(last&&last.w)||'',dr:d.sl102?s.dr:hint.dr,ln:d.sl102?s.ln:hint.ln};
  const sc=typeof sleepCard73==='function'&&sleepCard73(),yk=addDays(k,-1),yHas=sc&&((DAYS[yk]||{}).entries||[]).some(e=>e.aid===sc.id);
  const tg=(id,ic,l,on,h)=>`<button type="button" class="chipbtn" data-sl102t="${id}" aria-pressed="${!!on}">${ic} ${l}${h?' <small class="muted">· 어제 기록에서</small>':''}</button>`;
  sheetCtx={sl102:1};
  openSheet(`<div class="sh"><h3>🛏 어젯밤 <small class="muted num">${esc(fmtD(yk))} → ${esc(fmtD(k))}</small></h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <div class="sl102f"><label>잠든 시각 <input type="time" data-sl102b="1" value="${esc(v.b)}"></label><label>일어난 시각 <input type="time" data-sl102w="1" value="${esc(v.w)}"></label><span class="hm102 num small"></span></div>
    ${!d.sl102&&last?'<p class="tiny muted" style="margin:2px 0 0">지난번 시각을 넣어 뒀어요 — 다르면 고쳐요.</p>':''}
    <div class="row" style="gap:6px;margin-top:8px;flex-wrap:wrap">${tg('dr','🍺','술 마심',v.dr,!d.sl102&&hint.dr)}${tg('ln','🌙','늦은 야식',v.ln,!d.sl102&&hint.ln)}</div>
    <div class="rs102"></div>
    <p class="tiny muted" style="margin:6px 0 0">몸 최대는 <b>몸 막대</b>에만 걸려요 — 몸 카드를 많이 해도 오늘은 그 위로 안 올라가고, HP도 몸 쪽으로는 그만큼까지만. 잠 ${o.need}시간에서 1시간 모자랄 때마다 −${o.cut} · 술 −${o.dr} · 야식 −${o.ln}. <button type="button" class="linkbtn" data-goedit101="areas">기준 바꾸기</button></p>
    ${sc&&!yHas?`<p class="tiny" style="margin:6px 0 0"><button type="button" class="linkbtn" data-sl102card="1">'${esc(sc.name)}' 카드도 어제로 기록하기</button> <span class="muted">(잠든 시각별 점수는 그 카드가 따로 매겨요)</span></p>`:''}
    <div class="row" style="gap:6px;margin-top:10px"><button type="button" class="btn" data-sl102ok="1">저장</button>${d.sl102?'<button type="button" class="btn ghost sm" data-sl102del="1">지우기</button>':''}</div>`);
  slPrev102()}
addEventListener('click',e=>{const T=e.target;if(!T||!T.closest)return;let b;
  if((b=T.closest('[data-sl102]'))){e.preventDefault();e.stopPropagation();if(!ready)return;slSheet102();return}
  if(!(sheetCtx&&sheetCtx.sl102))return;
  if((b=T.closest('[data-sl102t]'))){e.preventDefault();e.stopPropagation();b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')==='true'?'false':'true');slPrev102();return}
  if((b=T.closest('[data-sl102ok]'))){e.preventDefault();e.stopPropagation();const k=SL102.k,v=slRead102();if((v.b&&!v.w)||(!v.b&&v.w)){toast('잠든 시각과 일어난 시각을 둘 다 적어요');return}
    const d=dayOf(k);d.sl102=v;save(k);closeSheet();render();const S=st102(d);toast(`🛏 저장 · 몸 최대 ${S.cap} · 몸 시작 ${S.start}`);return}
  if((b=T.closest('[data-sl102del]'))){e.preventDefault();e.stopPropagation();const k=SL102.k,d=DAYS[k];if(d){delete d.sl102;save(k)}closeSheet();render();toast('어젯밤 기록을 지웠어요 · 몸 최대 100');return}
  if((b=T.closest('[data-sl102card]'))){e.preventDefault();e.stopPropagation();const a=typeof sleepCard73==='function'&&sleepCard73();closeSheet();if(a)setTimeout(()=>openDoneSheet({a}),60);return}
},true);
addEventListener('input',e=>{const t=e.target;if(t&&t.dataset&&(t.dataset.sl102b||t.dataset.sl102w)){e.stopPropagation();slPrev102()}},true);
addEventListener('change',e=>{const t=e.target;if(t&&t.dataset&&(t.dataset.sl102b||t.dataset.sl102w)){e.stopPropagation();slPrev102()}},true);

/* ---- 홈: 몸 막대에 최대선(빗금) · 영역마다 시작 표시 ---- */
renderHome=(function(prev){return function(day){const r=prev.apply(this,arguments);
  try{if(new102(day)){const el=$('areaBars'),b=bodyA102();if(el&&b){const S=st102(day),row=el.querySelector(`.area[data-info="area:${b}"]`),tr=row&&row.querySelector('.track');
    el.querySelectorAll('.area .track .base').forEach(x=>{const a=x.closest('.area'),id=a&&(a.dataset.info||'').slice(5);x.style.left=(id===b?S.start:S.hb)+'%'});
    if(tr){tr.querySelector('.cap102')?.remove();if(S.cap<100){tr.insertAdjacentHTML('beforeend',`<div class="cap102" style="left:${S.cap}%" title="오늘 몸 최대 ${S.cap}"></div>`);const n=row.querySelector('.num');if(n){n.title=`몸 최대 ${S.cap}${n.title?' · '+n.title:''}`}}
      row.title=`몸 시작 ${S.start}${S.carry?` (어제 이월 ${S.carry>0?'+':'−'}${Math.abs(S.carry)})`:''} · 최대 ${S.cap}`}}}}catch(e){console.error(e)}
  return r}})(renderHome);

/* ---- 진척 칩: 짧게(한 줄) ---- */
function prog101(){
  const ps=C.areas.filter(a=>akOf101(a.id)!=='c');if(!ps.length)return '';
  const W=areaWeek66(weekStart(gk76())),T=areaTotal66(),la=lastAct101(),td=gk76(),sn=stall101();
  return `<div class="pg101 pg102" role="group" aria-label="진척·경제 영역 (HP와 따로)">${ps.map(a=>{const k=akOf101(a.id),L=aLevel67(T[a.id]||0),wx=(W[a.id]||{}).xp||0,lk=la[a.id],gap=lk?diffDays(td,lk):null,st=gap!=null&&gap>=sn;
    return `<button type="button" class="pc101${st?' st101':''}" data-aj67="${esc(a.id)}" title="${esc(a.name)} · ${AK101[k][1]} · 영역 Lv.${L.lv} · 이번 주 ✨${wx} — HP에 안 들어가요. 누르면 영역 여정${lk?` · 마지막 ${fmtD(lk)}`:''}">${AK101[k][0]} <span class="nm102">${esc(a.name)}</span> <b class="num">Lv${L.lv}</b> <small class="num">${wx?'주✨'+wx:'주 —'}</small>${st?` <small class="st">⏸${gap}일</small>`:''}</button>`}).join('')}</div>`}

/* ---- 전투 카드: 🛏 칩 · 📖 도감을 쫄따구 줄 끝으로 ---- */
renderBattle=(function(prev){return function(){const r=prev.apply(this,arguments);
  try{const box=$('battleBox');if(box){
    const mm=box.querySelector('.mm90');if(mm){mm.querySelector('.sl102')?.remove();const h=slChip102();if(h){mm.classList.add('mm102');mm.insertAdjacentHTML('beforeend',h)}}
    const mn=box.querySelector('.minions'),dx=[...box.querySelectorAll('[data-x61dex]')].find(x=>!x.closest('.minions')&&!x.closest('#pop'));
    if(mn&&dx&&!mn.querySelector('[data-x61dex]')){dx.className='dx102';dx.removeAttribute('style');dx.textContent='📖 도감';dx.title='보스·쫄따구 도감';dx.setAttribute('aria-label','보스·쫄따구 도감');mn.appendChild(dx)}
  }}catch(e){console.error(e)}
  return r}})(renderBattle);

/* ---- HP 창: 몸 출발점 줄 + 7일 비교에 이유 ---- */
function why102(d){
  const ob=(C.energyBase||[])[((d.energy)||3)-1]??60,ol=ENERGY_LBL[((d.energy)||3)-1]||'보통',n2=new102(d),S=n2?st102(d):null,nb=S?S.start:hpb101();
  const ex={},ids=new Set(C.areas.map(a=>a.id));let exS=0;
  (d.entries||[]).forEach(e=>{if(!e.cond||!ids.has(e.area)||inHP101(e))return;(ex[e.area]=ex[e.area]||[]).push(e);exS+=e.cond});
  const fd=foodDelta(d);let fS=0;const fx=[];for(const k in fd)if(ids.has(k)&&akOf101(k)!=='c'&&fd[k]){fS+=fd[k];fx.push([k,fd[k]])}
  let nS=0;neglectList(d.date).forEach(n=>{const ar=n.t&&n.t.area;if(ar&&ids.has(ar)&&akOf101(ar)!=='c')nS+=n.pen});
  const b=bodyA102(),cut=S&&b?Math.max(0,S.start+bodyDelta102(d,true)-S.cap):0;
  const sg=v=>`<b class="num">${v>0?'+':v<0?'−':'±'}${Math.abs(v)}</b>`,an=id=>{const a=C.areas.find(x=>x.id===id);return a?a.name:id};
  const L=[];
  if(nb!==ob)L.push(`<li>🌅 시작: 옛 = 아침 에너지 '${esc(ol)}' ${ob} → 새 = ${S&&S.carry?`하루 시작값 ${S.hb} ${S.carry>0?'+':'−'} 어제 몸 이월 ${Math.abs(S.carry)} = ${nb}`:`하루 시작값 ${nb}`} ${sg(nb-ob)}</li>`);
  else L.push(`<li class="muted">🌅 시작: 둘 다 ${nb}${d.energy?` (옛 아침 에너지 '${esc(ol)}')`:''}</li>`);
  Object.keys(ex).forEach(id=>{const es=ex[id],s=es.reduce((t,e)=>t+e.cond,0),k=akOf101(id),nm=es.slice(0,4).map(e=>`${esc(e.name||'')} ${e.cond>0?'+':'−'}${Math.abs(e.cond)}`).join(', ');
    L.push(`<li>${k==='c'?'○':AK101[k][0]} ${esc(an(id))} 기록 ${es.length}개는 HP에서 뺌 ${sg(-s)} <span class="tiny muted">— ${nm}${es.length>4?` 외 ${es.length-4}개`:''}${k==='c'?' (카드에서 HP 빼기)':''}</span></li>`)});
  if(fS)L.push(`<li>🍽 진척·경제 영역 식사 칸 ${sg(-fS)} <span class="tiny muted">— ${fx.map(x=>esc(an(x[0]))).join('·')}</span></li>`);
  if(nS)L.push(`<li>⚠ 진척·경제 영역 방치 페널티는 HP에서 안 깎음 ${sg(nS)}</li>`);
  if(cut)L.push(`<li>🛏 몸 최대 ${S.cap}에 걸려 덜 오름 ${sg(-cut)} <span class="tiny muted">— ${S.why.map(w=>esc(w[1])).join(' · ')}</span></li>`);
  const old=ovOld101(d),nw=ovNew101(d),exp=(nb-ob)-exS-fS+nS-cut;
  if(Object.keys(ex).length===0&&!fS&&!nS&&!cut&&nb===ob)L.push('<li class="muted">달라진 것 없음 — 이날 기록은 모두 🔋 영역이었어요</li>');
  if(exp!==nw-old)L.push(`<li class="tiny muted">HP는 0~100에서 잘려서 위 합(${exp>0?'+':''}${exp})과 실제 차이(${nw-old>0?'+':''}${nw-old})가 다를 수 있어요</li>`);
  return `<ul class="wl102">${L.join('')}</ul>`}
function cmp101(){const td=gk76(),rows=[];
  for(let i=0;i<7;i++){const k=addDays(td,-i),d=DAYS[k];if(!d||!hasData(d))continue;const o=ovOld101(d),n=ovNew101(d),df=n-o;
    rows.push(`<details class="cw102"><summary><span>${esc(wdOf(k))} ${esc(fmtD(k))}</span><span class="num">${o}</span><span aria-hidden="true">→</span><b class="num">${n}</b><small class="num">${df?(df>0?'+':'−')+Math.abs(df):'같음'}</small></summary>${why102(d)}</details>`)}
  return rows.length?`<div class="cm102"><div class="cw102h tiny muted"><span>날짜</span><span>옛</span><span></span><span>새</span><span>차이 · 눌러서 이유</span></div>${rows.join('')}</div><p class="tiny muted" style="margin:4px 0 0">옛 규칙 = 그날 고른 아침 에너지 + 모든 영역 · 새 규칙 = 하루 시작값 ${hpb101()}${on102()?'(+ 어제 몸 이월, 몸 최대)':''} + 🔋 영역${C.bv101!==0?'(+⚔ 용기)':''}만. 지난 날 홈·통계는 그날 규칙 그대로예요 — 여기서만 비교해요.</p>`:''}
infoFor=(function(prev){return function(k){const r=prev.apply(this,arguments);
  try{if(r&&k==='hp'&&new102(today())){const day=today(),p=hpParts101(day),S=p.S;
    const ln=`<p class="small">🛏 몸 출발점: 몸 시작 <b>${S.start}</b>${S.ye==null?' (어제 기록 없음 → 하루 시작값)':` (어제 몸 끝 ${S.ye}의 ${bs102().carry}% 이월 ${S.carry>=0?'+':'−'}${Math.abs(S.carry)})`} · 몸 최대 <b>${S.cap}</b>${S.why.length?' ('+S.why.map(w=>esc(w[1])+' −'+Math.abs(w[2])).join(' · ')+')':''}${p.cut?` · 최대에 걸려 HP에 안 들어간 몸 변화 −${p.cut}`:''} <button type="button" class="linkbtn" data-sl102="1">${(today().sl102)?'고치기':'어젯밤 적기'}</button></p>`;
    const i=r.b.indexOf('</p>',r.b.indexOf('</p>')+4);r.b=i>0?r.b.slice(0,i+4)+ln+r.b.slice(i+4):r.b+ln}}catch(e){console.error(e)}
  return r}})(infoFor);

/* ---- 편집 → 컨디션 영역: 몸 출발점 기준 ---- */
function bsPanel102(){const o=bs102(),cs=C.areas.filter(a=>akOf101(a.id)==='c'),b=bodyA102();
  const n=(k,l,u,mn,mx)=>`<label>${l} <input type="number" min="${mn}" max="${mx}" data-f102="${k}" value="${o[k]}">${u}</label>`;
  return `<div class="kv102"><b>🛏 몸 출발점</b>${C.f2from102?` <span class="tiny muted">(${esc(fmtD(C.f2from102))}부터)</span>`:''}
    <label>몸 영역 <select data-f102="body">${cs.map(a=>`<option value="${esc(a.id)}"${a.id===b?' selected':''}>${esc(a.name)}</option>`).join('')}</select></label>
    ${n('need','목표 잠','시간',3,12)}${n('cut','1시간 모자라면 몸 최대 −','',0,30)}${n('dr','술 −','',0,50)}${n('ln','야식 −','',0,50)}${n('carry','어제 몸 이월','%',0,100)}${n('floor','몸 최대 바닥','',0,100)}
    <button type="button" class="linkbtn" data-bs102off="1">${on102()?'몸 출발점 끄기':'몸 출발점 켜기'}</button></div>`}
renderEdit=(function(prev){return function(){const r=prev.apply(this,arguments);
  try{if(ui.edit==='areas'&&on101()){const p=$('editBody')&&$('editBody').querySelector('.ak101p');if(p&&!p.querySelector('.kv102')){const kv=p.querySelector('.kv101');(kv||p).insertAdjacentHTML(kv?'afterend':'beforeend',bsPanel102())}}}catch(e){console.error(e)}
  return r}})(renderEdit);
function reBs102(){render();const p=$('editBody')&&$('editBody').querySelector('.ak101p');if(p){p.querySelector('.kv102')?.remove();const kv=p.querySelector('.kv101');(kv||p).insertAdjacentHTML(kv?'afterend':'beforeend',bsPanel102())}}
addEventListener('change',e=>{const t=e.target;if(!t||!t.dataset||!t.dataset.f102)return;e.stopPropagation();const k=t.dataset.f102;
  if(k==='body'){C.bodyA102=t.value;save('config');reBs102();return}
  const v=Math.round(+t.value);if(!isFinite(v)||!(k in BS102D))return;const lim={need:[3,12],cut:[0,30],dr:[0,50],ln:[0,50],carry:[0,100],floor:[0,100]}[k];
  C.bs102=Object.assign({},C.bs102||{},{[k]:clamp(v,lim[0],lim[1])});save('config');t.blur();reBs102()},true);
addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('[data-bs102off]');if(!b)return;e.preventDefault();e.stopPropagation();if(!ready)return;
  if(!C.f2from102){C.f2from102=gk76()}C.bs102off=on102()?1:0;save('config');reBs102();toast(on102()?'🛏 몸 출발점 켬':'🛏 몸 출발점 끔 — 몸 최대·이월 없이')},true);

F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['🛏 몸 출발점(어젯밤 잠·술·야식)','홈 전투 카드 기분 줄 옆 🛏 칩','어젯밤 잠든·일어난 시각과 술·늦은 야식을 적으면 오늘 몸 막대의 최대가 정해져요(몸 막대에만 — HP도 몸 쪽으로는 그만큼까지만). 몸 시작은 어제 몸 끝값의 일부(기본 30%)를 이어받아요. 기준은 편집 → 컨디션 영역.',()=>{location.hash='home'},'수면 잠 기상 취침 술 야식 몸 상한 최대 출발점 이월 F1 F6'],
  ['📊 HP 옛·새 규칙 비교 이유','HP 누르기 → 최근 7일','줄을 누르면 그날 시작값 차이·HP에서 뺀 기록(영역별)·식사·몸 최대로 잘린 것이 보여요.',()=>{location.hash='home'},'HP 비교 이유 옛 규칙 새 규칙']])}})(F67);
