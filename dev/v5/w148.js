/* ================= v13.28 (w148): 생활 = 🧺 관리 상태 막대 (HP 밖) — 사용자 11/27 밤 선택 =================
   영역 종류 C.ak101에 네 번째 종류 'k'(🧺 관리)를 더함. 관리 영역은 HP에 안 들어가고(inHP101은 'c'만 셈),
   홈 영역 막대 줄에 '관리 상태' 막대로 나옴 — 값 = 제때 하고 있는 관리 할 일 비율(그날 점수가 아님).
   · 관리 할 일 = careAll76()(끝내지 않은 관리) 중 묶음 머리(isFold132)는 뺌. 밀림 = 차례 날짜(due)가 어제 이전 — 오늘 차례는 아직 제때.
   · 값 = round(100 × 제때 / 전체). 관리 할 일이 없으면 '—'. 지금 상태라 홈 날짜 칩(어제 등)과 관계없이 늘 지금 값.
   · 막대 누르기 = 영역 설명 창(data-info="area:id") 맨 위에 제때/밀림 수 · 밀린 것 목록 · 🧽 관리 창 열기.
   · 한 번짜리 C.f5mig148: v13.27에서 'p'(진척)로 바꾼 생활만 'k'로. 되돌리기 = 영역 막대 → 이 영역은 → 다른 종류.
   · 진척 칩(prog101, w102 것을 다시 선언)은 'k' 영역을 빼고 그림. */
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
  return `<div class="area k148" data-info="area:${esc(a.id)}" title="${esc(tip)}"><b>🧺 ${esc(a.name)}</b><div class="track"><div class="fill ${v!=null&&v<35?'low':''}" style="width:${v==null?0:v}%"></div></div><span class="num">${v==null?'—':v}</span></div>`}
renderHome=(function(prev){return function(day,av){const r=prev.apply(this,arguments);
  try{if(on101()){const el=$('areaBars');if(el&&!el.querySelector('.k148')){const ks=C.areas.filter(a=>akOf101(a.id)==='k');
    if(ks.length){const h=ks.map(barH).join(''),pg=el.querySelector('.pg101');if(pg)pg.insertAdjacentHTML('beforebegin',h);else el.insertAdjacentHTML('beforeend',h)}}}}catch(e){console.error(e)}
  return r}})(renderHome);
/* 진척 칩: 관리('k') 영역은 막대로 갔으니 칩에서 뺌 — w102 prog101을 그대로 옮기고 거르기만 바꿈 */
prog101=function(){
  const ps=C.areas.filter(a=>{const k=akOf101(a.id);return k!=='c'&&k!=='k'});if(!ps.length)return '';
  const W=areaWeek66(weekStart(gk76())),T=areaTotal66(),la=lastAct101(),td=gk76(),sn=stall101();
  return `<div class="pg101 pg102" role="group" aria-label="진척·경제 영역 (HP와 따로)">${ps.map(a=>{const k=akOf101(a.id),L=aLevel67(T[a.id]||0),wx=(W[a.id]||{}).xp||0,lk=la[a.id],gap=lk?diffDays(td,lk):null,st=gap!=null&&gap>=sn;
    return `<button type="button" class="pc101${st?' st101':''}" data-aj67="${esc(a.id)}" title="${esc(a.name)} · ${AK101[k][1]} · 영역 Lv.${L.lv} · 이번 주 ✨${wx} — HP에 안 들어가요. 누르면 영역 여정${lk?` · 마지막 ${fmtD(lk)}`:''}">${AK101[k][0]} <span class="nm102">${esc(a.name)}</span> <b class="num">Lv${L.lv}</b> <small class="num">${wx?'주✨'+wx:'주 —'}</small>${st?` <small class="st">⏸${gap}일</small>`:''}</button>`}).join('')}</div>`};
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
  ['🧺 관리 상태 막대(생활)','홈 전투 카드 영역 막대 줄 → 🧺 생활 막대 누르기','관리 영역(생활)은 HP에 안 들어가고, 제때 하고 있는 관리 할 일 비율로 막대가 오르내려요. 누르면 밀린 관리 목록과 🧽 관리 창 열기.',()=>{location.hash='#home'}]])}})(F67);
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-c148]');if(!b)return;e.preventDefault();
  try{closeInfo()}catch(_){}setTimeout(()=>careSheet76(),0)});
})();
