/* ================= v13.28 (w148): 생활 = 🧺 관리 상태 막대 (HP 밖) — 사용자 11/27 밤 선택 =================
   영역 종류 C.ak101에 네 번째 종류 'k'(🧺 관리)를 더함. 관리 영역은 HP에 안 들어가고(inHP101은 'c'만 셈),
   홈 영역 막대 줄에 '관리 상태' 막대로 나옴 — 값 = 제때 하고 있는 관리 할 일 비율(그날 점수가 아님).
   · 관리 할 일 = careAll76()(끝내지 않은 관리) 중 묶음 머리(isFold132)는 뺌. 밀림 = 차례 날짜(due)가 어제 이전 — 오늘 차례는 아직 제때.
   · 값 = round(100 × 제때 / 전체). 관리 할 일이 없으면 '—'. 지금 상태라 홈 날짜 칩(어제 등)과 관계없이 늘 지금 값.
   · 막대 누르기 = 영역 설명 창(data-info="area:id") 맨 위에 제때/밀림 수 · 밀린 것 목록 · 🧽 관리 창 열기.
   · 한 번짜리 C.f5mig148: v13.27에서 'p'(진척)로 바꾼 생활만 'k'로. 되돌리기 = 영역 막대 → 이 영역은 → 다른 종류.
   · 진척 칩(prog101, w102 것을 다시 선언)은 'k' 영역을 빼고 그림. 경제('m')는 v13.28b부터 💰 골드·참음 칩 하나(econH). */
(function(){
AK101.k=['🧺','관리'];
function late148(t,k){return !!(t&&t.due&&t.due<k)}
window.care148=function(){const k=midKey68();let all=[];try{all=careAll76().filter(t=>!(typeof isFold132==='function'&&isFold132(t)))}catch(e){}
  const late=all.filter(t=>late148(t,k)).sort((a,b)=>String(a.due).localeCompare(String(b.due)));
  return {n:all.length,ok:all.length-late.length,late,v:all.length?Math.round(100*(all.length-late.length)/all.length):null,k}};
function mig(){if(!C||!ready72()||C.f5mig148||!C.f4mig147||!C.ak101)return;
  const a=(C.areas||[]).find(x=>x.id==='life'||x.name==='생활');
  const ch=!!(a&&C.ak101[a.id]==='p');if(ch)C.ak101=Object.assign({},C.ak101,{[a.id]:'k'});
  C.f5mig148=1;save('config');return ch}
render=(function(prev){return function(){let ch=false;try{ch=mig()}catch(e){console.error(e)}const r=prev.apply(this,arguments);
  try{if(!ch&&!C.f5mig148&&mig())setTimeout(()=>render(),0)}catch(e){console.error(e)}return r}})(render);   // w147 f4mig147가 이번 렌더에서 막 켜졌으면 뒤에서 한 번 더
function barH(a){const c=care148(),v=c.v;
  const tip=`${a.name} · 🧺 관리 상태 — HP에 안 들어가요. ${c.n?`제때 ${c.ok}/${c.n}${c.late.length?` · 밀린 것 ${c.late.length}`:''}`:'관리 할 일 없음'} · 누르면 밀린 것`;
  return `<div class="area k148" data-info="area:${esc(a.id)}" title="${esc(tip)}"><b>${esc(a.name)}</b><div class="track"><div class="fill ${v!=null&&v<35?'low':''}" style="width:${v==null?0:v}%"></div></div><span class="num">${v==null?'—':v}</span></div>`}
renderHome=(function(prev){return function(day,av){const r=prev.apply(this,arguments);
  try{if(on101()){const el=$('areaBars');if(el&&!el.querySelector('.k148')){const ks=C.areas.filter(a=>akOf101(a.id)==='k');
    if(ks.length){const h=ks.map(barH).join(''),pg=el.querySelector('.pg101');if(pg)pg.insertAdjacentHTML('beforebegin',h);else el.insertAdjacentHTML('beforeend',h);el.classList.add('k3148')}}}}catch(e){console.error(e)}
  return r}})(renderHome);
/* 진척 칩: 관리('k') 영역은 막대로 갔으니 칩에서 뺌 — w102 prog101을 그대로 옮기고 거르기만 바꿈 */
prog101=function(){
  const ps=C.areas.filter(a=>{const k=akOf101(a.id);return k!=='c'&&k!=='k'});if(!ps.length)return '';
  const W=areaWeek66(weekStart(gk76())),T=areaTotal66(),la=lastAct101(),td=gk76(),sn=stall101();
  let em=0;
  return `<div class="pg101 pg102" role="group" aria-label="진척·경제 영역 (HP와 따로)">${ps.map(a=>{const k=akOf101(a.id);if(k==='m'){if(em++)return '';try{return econH(a)}catch(e){console.error(e)}}
    const L=aLevel67(T[a.id]||0),wx=(W[a.id]||{}).xp||0,lk=la[a.id],gap=lk?diffDays(td,lk):null,st=gap!=null&&gap>=sn;
    return `<button type="button" class="pc101${st?' st101':''}" data-aj67="${esc(a.id)}" title="${esc(a.name)} · ${AK101[k][1]} · 영역 Lv.${L.lv} · 이번 주 ✨${wx} — HP에 안 들어가요. 누르면 영역 여정${lk?` · 마지막 ${fmtD(lk)}`:''}">${AK101[k][0]} <span class="nm102">${esc(a.name)}</span> <b class="num">Lv${L.lv}</b> <small class="num">${wx?'주✨'+wx:'주 —'}</small>${st?` <small class="st">⏸${gap}일</small>`:''}</button>`}).join('')}</div>`};
/* v13.28b: 💰 경제 칩 = 이번 달 골드 ▲번 것 ▼쓴 것 + 참음 n번(금액 없이) — 실제 돈(원)은 안 보임(사용자: 가계부도 쓰는데 앱에서까지 돈을 보면 부담).
   골드는 기록(DAYS[날].entries)의 gold 합(골드 장부와 같은 셈). 참음 = 이번 달 충동 적기(imp110) 중 참음 확정(st110==='h')인 것 — 🍰·🛍 합.
   누르면 상점 → 📒 골드 장부를 펼침. 경제 종류('m') 영역이 여럿이어도 칩은 하나(골드는 하나라서). */
window.econ148=function(){const td=gk76(),m0=td.slice(0,7)+'-01';let inn=0,out=0,hf=0,hb=0;
  Object.keys(DAYS).forEach(k=>{if(k<m0||k>td)return;const d=DAYS[k];
    ((d&&d.entries)||[]).forEach(e=>{const g=+(e&&e.gold)||0;if(g>0)inn+=g;else if(g<0)out-=g});
    try{list110(k).forEach(x=>{if(st110(x)==='h'){if(x.k==='b')hb++;else hf++}})}catch(_){}});
  return {inn,out,hf,hb,h:hf+hb}};
function econH(a){const E=econ148(),n=v=>Math.round(v).toLocaleString();
  const tip=`${a.name} · 이번 달 골드 ▲ 번 것 ${n(E.inn)} · ▼ 쓴 것 ${n(E.out)}${E.h?` · 참음 ${E.h}번(🍰 ${E.hf} · 🛍 ${E.hb})`:''} — HP에 안 들어가요. 실제 돈은 안 보여요. 누르면 골드 장부`;
  return `<button type="button" class="pc101 ec148" data-ec148="1" title="${esc(tip)}">💰 <span class="nm102">${esc(a.name)}</span> <b class="num">▲${n(E.inn)}</b> <small class="num">▼${n(E.out)}</small>${E.h?` <small class="hd148">참음 ${E.h}</small>`:''}</button>`}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-ec148]');if(!b)return;e.preventDefault();e.stopPropagation();
  location.hash='#shop';setTimeout(()=>{try{const d=document.getElementById('gl145');if(d){d.open=true;d.scrollIntoView({block:'start',behavior:'smooth'})}}catch(_){}},250)},true);
/* 영역 설명 창: 관리 영역이면 맨 위에 관리 상태 */
infoFor=(function(prev){return function(k){const r=prev.apply(this,arguments);
  try{if(r&&k&&k.startsWith('area:')&&akOf101(k.slice(5))==='k'){const c=care148(),td=c.k;
    const li=c.late.slice(0,8).map(t=>`<li>${esc(t.title||'')} <span class="tiny muted">· ${diffDays(td,t.due)}일 밀림</span></li>`).join('');
    r.b=`<div class="cs148"><p><b>🧺 관리 상태 ${c.v==null?'—':c.v}</b> <span class="tiny muted">— 제때 하고 있는 관리 할 일 비율(HP에 안 들어가요)</span></p>
      <p class="num">${c.n?`✓ 제때 ${c.ok} · ⏳ 밀림 ${c.late.length} · 전체 ${c.n}`:'아직 관리 할 일이 없어요'}</p>
      ${li?`<ul class="small">${li}${c.late.length>8?`<li class="tiny muted">그 밖에 ${c.late.length-8}개</li>`:''}</ul>`:''}
      <p class="tiny muted">하나씩 하면 조금씩 오르고, 차례가 지나면 내려가요. 오늘 차례는 아직 제때로 셉니다. 묶음 머리(집 청소 등)는 빼고 하위 할 일로 셉니다.</p>
      <button type="button" class="chipbtn" data-c148="1">🧽 관리 창 열기</button></div>`+(r.b||'')}}catch(e){console.error(e)}
  return r}})(infoFor);
F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['💰 경제 칩(골드·참음)','홈 전투 카드 영역 막대 밑 칩 줄 → 💰 경제 칩','이번 달 골드 ▲번 것·▼쓴 것과 충동을 참은 횟수(금액 없이)를 보여 줘요. 실제 돈은 안 보여요. 누르면 상점 → 📒 골드 장부.',()=>{location.hash='#home'}],
  ['🧺 관리 상태 막대(생활)','홈 전투 카드 영역 막대 줄 → 🧺 생활 막대 누르기','관리 영역(생활)은 HP에 안 들어가고, 제때 하고 있는 관리 할 일 비율로 막대가 오르내려요. 누르면 밀린 관리 목록과 🧽 관리 창 열기.',()=>{location.hash='#home'}]])}})(F67);
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-c148]');if(!b)return;e.preventDefault();
  try{closeInfo()}catch(_){}setTimeout(()=>careSheet76(),0)});
})();
