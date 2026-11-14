/* ---- v10.2 (w101.js): F1 조각 1 — 막대 구조 분리 + 아침 에너지 빼기 ----
   설계: TODO 'F 결정'의 F1·F1 보충(11/11·11/14). 영역·카드는 안 바꿈(마이그레이션 금지) — 위에 '종류' 층만 얹음.
   ① 영역 종류 C.ak101={영역id:'c'|'p'|'m'} — 🔋 컨디션(HP에 넣음) / 📈 진척 / 💰 경제(둘 다 HP에 안 넣음).
      처음 켜질 때 이름으로 짐작해 한 번 적어 둠(akGuess101). 나중에 생긴 영역은 짐작값.
   ② 카드 예외 a.hk101 = ''(영역 따라) | 'c'(HP에 넣기) | 'x'(HP에서 빼기). 카드 편집 칩 줄(.r95)·편집 → 컨디션 영역에서.
   ③ HP = 하루 시작값 C.hpb101(아침 에너지 대신, 기본 = 옛 '보통' 값) + HP에 넣는 컨디션 변화(inHP101) + 그 영역 식사·방치.
      ⚔ 용기 기록은 영역과 관계없이 넣음(C.bv101!==0) — 분리하다 용기 보상이 슬며시 줄지 않게.
   ④ 지난 날은 옛 규칙 그대로: C.f1from101(처음 켜진 게임 날) 앞의 날은 아침 에너지 + 모든 영역. C.f101off=1이면 옛 규칙으로.
      빌드(patch54)가 'C.energyBase[(x.energy||3)-1]??60' → hpBase101(x), 'ENERGY_LBL[(x.energy||3)-1]||'보통'' → hpLbl101(x)로 바꿈.
   ⑤ 홈: 영역 막대는 🔋 영역만, 📈·💰 영역은 한 줄 칩(영역 레벨 · 이번 주 ✨ · ⏸ n일 멈춤, 누르면 영역 여정). 아침 에너지 단추 숨김(body.f101).
   ⑥ HP 설명 창: 새 규칙 설명 + 최근 7일 '옛 규칙 → 새 규칙' 비교. 영역 설명 창: 종류 칩. */
let F101=0; // 0 보통 · 1 옛 규칙 강제 · 2 새 규칙 강제(비교용)
const AK101={c:['🔋','컨디션'],p:['📈','진척'],m:['💰','경제']};
function on101(){return !!(C&&C.f1from101)&&C.f101off!==1}
function new101(day){if(F101===1)return false;if(F101===2)return true;return on101()&&!!day&&String(day.date||'')>=C.f1from101}
function hpb101(){const v=C.hpb101;return (v!=null&&v!==''&&isFinite(+v))?clamp(Math.round(+v),0,100):((C.energyBase||[])[2]??60)}
function hpBase101(day){return new101(day)?hpb101():((C.energyBase||[])[((day&&day.energy)||3)-1]??60)}
function hpLbl101(day){return new101(day)?'하루 시작값':(ENERGY_LBL[((day&&day.energy)||3)-1]||'보통')}
function akGuess101(a){const id=a.id,n=a.name||'';
  if(id==='money'||/경제|돈|재정|금전|수입|지출/.test(n))return 'm';
  if(['body','mind','life'].includes(id)||/몸|마음|생활|건강|휴식|수면|관계|집|살림|돌봄/.test(n))return 'c';
  return 'p'}
function akOf101(id){const m=C.ak101||{};if(m[id]&&AK101[m[id]])return m[id];const a=C.areas.find(x=>x.id===id);return a?akGuess101(a):'c'}
function hkOf101(a){return a&&(a.hk101==='c'||a.hk101==='x')?a.hk101:''}
function brv101(e){return e&&(e.kind==='courage'||!!e.brave)}
function inHP101(e){
  if(!e||!e.cond||!e.area||!C.areas.some(a=>a.id===e.area))return false;
  if(C.bv101!==0&&brv101(e))return true;
  const a=e.aid&&C.actions.find(x=>x.id===e.aid),h=hkOf101(a);
  if(h==='c')return true;if(h==='x')return false;
  return akOf101(e.area)==='c'}
function hpParts101(day){ // 새 규칙으로 나눠 보기(설명 창·시험용)
  const base=hpb101();let inn=0,out=0;
  (day.entries||[]).forEach(e=>{if(!e.cond||!e.area)return;if(inHP101(e))inn+=e.cond;else if(C.areas.some(a=>a.id===e.area))out+=e.cond});
  return{base,inn,out}}
{
  const ov0=overallOf;
  overallOf=function(day){
    if(!new101(day))return ov0.apply(this,arguments);
    let v=hpb101();
    (day.entries||[]).forEach(e=>{if(inHP101(e))v+=e.cond});
    const fd=foodDelta(day);for(const k in fd)if(C.areas.some(a=>a.id===k)&&akOf101(k)==='c')v+=fd[k];
    neglectList(day.date).forEach(n=>{const ar=n.t&&n.t.area;if(ar&&C.areas.some(a=>a.id===ar)&&akOf101(ar)==='c')v-=n.pen});
    return clamp(Math.round(v),0,100)};
  window.ovOld101=d=>{const p=F101;F101=1;try{return overallOf(d)}finally{F101=p}};
  window.ovNew101=d=>{const p=F101;F101=2;try{return overallOf(d)}finally{F101=p}};
}
// 처음 켜기: 서버 설정이 온 뒤 한 번(게임 날 기준). 종류 짐작을 적어 둬서 영역 이름을 바꿔도 안 흔들리게.
function init101(){
  if(!ready72()||!C||C.f1from101)return;
  C.f1from101=gk76();C.ak101=Object.assign({},C.ak101||{});
  C.areas.forEach(a=>{if(!AK101[C.ak101[a.id]])C.ak101[a.id]=akGuess101(a)});
  if(C.hpb101==null)C.hpb101=(C.energyBase||[])[2]??60;
  save('config');
  const ps=C.areas.filter(a=>akOf101(a.id)!=='c').map(a=>a.name);
  setTimeout(()=>toast(`HP가 이제 🔋 컨디션 영역만 더해요${ps.length?` (${ps.join('·')}은 진척·경제로 따로)`:''}. 아침 에너지 대신 시작값 ${hpb101()} · 편집 → 컨디션 영역에서 바꿔요`,7000),1800)}
render=(function(prev){return function(){
  try{init101()}catch(e){console.error(e)}
  const r=prev.apply(this,arguments);
  try{document.body.classList.toggle('f101',on101())}catch(e){}
  return r}})(render);

/* ---- 홈: 🔋 영역만 막대, 📈·💰는 칩 한 줄 ---- */
function lastAct101(){const o={},ks=Object.keys(DAYS).sort().reverse(),want=new Set(C.areas.filter(a=>akOf101(a.id)!=='c').map(a=>a.id));
  for(const k of ks){if(!want.size)break;((DAYS[k]||{}).entries||[]).forEach(e=>{if(want.has(e.area)&&e.type!=='bad'&&(e.xp||0)>0){o[e.area]=k;want.delete(e.area)}})}
  return o}
function stall101(){const v=+C.stall101;return v>0?Math.round(v):7}
function prog101(){
  const ps=C.areas.filter(a=>akOf101(a.id)!=='c');if(!ps.length)return '';
  const W=areaWeek66(weekStart(gk76())),T=areaTotal66(),la=lastAct101(),td=gk76(),sn=stall101();
  return `<div class="pg101" role="group" aria-label="진척·경제 영역 (HP와 따로)">${ps.map(a=>{const k=akOf101(a.id),L=aLevel67(T[a.id]||0),wx=(W[a.id]||{}).xp||0,lk=la[a.id],gap=lk?diffDays(td,lk):null,st=gap!=null&&gap>=sn;
    return `<button type="button" class="pc101${st?' st101':''}" data-aj67="${esc(a.id)}" title="${esc(a.name)} · ${AK101[k][1]} — HP에 안 들어가요. 누르면 영역 여정${lk?` · 마지막 ${fmtD(lk)}`:''}">${AK101[k][0]} ${esc(a.name)} <b class="num">Lv.${L.lv}</b> <small class="num">${wx?'이번 주 ✨'+wx:'이번 주 —'}</small>${st?` <small class="st">⏸ ${gap}일째</small>`:''}</button>`}).join('')}</div>`}
renderHome=(function(prev){return function(day,av){const r=prev.apply(this,arguments);
  try{if(on101()){const el=$('areaBars');if(el){
    const base=hpBase101(day),neg=neglectList(day.date);
    el.innerHTML=C.areas.filter(a=>akOf101(a.id)==='c').map(a=>{const v=av[a.id],pen=neg.filter(n=>n.t.area===a.id).reduce((s,n)=>s+n.pen,0);return `<div class="area" data-info="area:${a.id}"><b>${esc(a.name)}</b><div class="track"><div class="fill ${v<35?'low':''}" style="width:${v}%"></div><div class="base" style="left:${base}%"></div></div><span class="num" title="${pen?'방치 페널티 −'+pen:''}">${v}${pen?'⚠':''}</span></div>`}).join('')+prog101()}}}catch(e){console.error(e)}
  return r}})(renderHome);

/* ---- 편집 → 컨디션 영역: 종류 · 카드 예외 · 시작값 ---- */
const O101={};
document.addEventListener('toggle',e=>{const d=e.target;if(d&&d.dataset&&d.dataset.cd101!=null)O101[d.dataset.cd101]=d.open},true);
function akPanel101(){
  const seg=a=>{const k=akOf101(a.id);return `<span class="sg101" role="group" aria-label="${esc(a.name)} 종류">${Object.keys(AK101).map(x=>`<button type="button" class="chipbtn" data-ak101="${esc(a.id)}:${x}" aria-pressed="${k===x}">${AK101[x][0]} ${AK101[x][1]}</button>`).join('')}</span>`};
  const cards=a=>{const k=akOf101(a.id),cs=C.actions.filter(x=>x.area===a.id&&+x.cond&&!x.link);
    const show=k==='c'?cs.filter(x=>hkOf101(x)==='x'):cs;if(!show.length)return '';
    const nin=show.filter(x=>hkOf101(x)==='c'||(hkOf101(x)===''&&k==='c')||(C.bv101!==0&&x.brave)).length;
    return `<details class="cd101" data-cd101="${esc(a.id)}"${O101[a.id]?' open':''}><summary class="tiny muted">${k==='c'?`HP에서 뺀 카드 ${show.length}개`:`컨디션 점수가 있는 카드 ${show.length}개 · HP에 넣은 것 ${nin}개`}</summary>${show.map(x=>{const h=hkOf101(x),inn=h==='c'||(h===''&&k==='c'),bv=C.bv101!==0&&x.brave;
      return `<button type="button" class="chipbtn" data-hk101="${esc(x.id)}" aria-pressed="${inn||bv}" ${bv?'disabled title="⚔ 용기 카드는 영역과 관계없이 HP에 들어가요"':''}>${inn||bv?'🔋 넣음':'○ 뺌'} · ${esc(x.name)} <small class="num">${x.cond>0?'+':'−'}${Math.abs(+x.cond)}</small>${bv?' ⚔':''}</button>`}).join('')}</details>`};
  return `<div class="ak101p">
    <h3>🔋 HP에 넣을 영역 <span class="tiny muted">(F1 · ${on101()?esc(fmtD(C.f1from101))+'부터 새 규칙':'옛 규칙 사용 중'})</span></h3>
    <p class="help">HP(컨디션)는 <b>🔋 컨디션 영역</b>(오늘 내 상태)만 더해요. <b>📈 진척</b>(쌓여 가는 것)·<b>💰 경제</b>(골드가 맡음)는 HP에 안 들어가고, 홈 막대 아래 칩으로 영역 레벨·이번 주 ✨·멈춘 날을 보여요. 영역 이름·카드 점수는 그대로예요. 지난 날 HP는 옛 규칙 그대로예요.</p>
    ${C.areas.map(a=>`<div class="ak101r"><b>${esc(a.name)}</b>${seg(a)}${cards(a)}</div>`).join('')}
    <div class="kv101">
      <label>🌅 하루 시작 HP <input type="number" min="0" max="100" data-f101="hpb101" value="${hpb101()}"></label>
      <label>⏸ 진척 멈춤 표시 <input type="number" min="1" max="60" data-f101="stall101" value="${stall101()}">일</label>
      <button type="button" class="chipbtn" data-bv101="1" aria-pressed="${C.bv101!==0}">${C.bv101!==0?'⚔ 용기 기록은 영역과 관계없이 HP에 넣음':'⚔ 용기 기록도 영역 따라'}</button>
    </div>
    <p class="tiny muted">아침 에너지 단추는 숨겼어요 — 몸 출발점(수면·야식·음주)은 다음 조각에서 시작값을 대신해요. <button type="button" class="linkbtn" data-f101off="1">${on101()?'옛 규칙(아침 에너지 + 모든 영역)으로 돌아가기':(C.f1from101?'새 규칙 다시 켜기':'')}</button></p>
  </div>`}
renderEdit=(function(prev){return function(){const r=prev.apply(this,arguments);
  try{if(ui.edit==='areas'){const b=$('editBody');if(b&&!b.querySelector('.ak101p')){const ae=document.activeElement;if(!(ae&&b.contains(ae)&&ae.matches('input,select,textarea')))b.insertAdjacentHTML('beforeend',akPanel101())}}}catch(e){console.error(e)}
  return r}})(renderEdit);
function reAk101(){render();if(ui.edit==='areas'){const b=$('editBody'),p=b&&b.querySelector('.ak101p');if(p){p.outerHTML=akPanel101()}}}
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-ak101],[data-hk101],[data-bv101],[data-f101off]');if(!t)return;
  e.preventDefault();e.stopPropagation();if(!ready)return;
  if(t.dataset.ak101){const [id,k]=t.dataset.ak101.split(':');if(!AK101[k])return;C.ak101=Object.assign({},C.ak101||{},{[id]:k});save('config');reAk101();
    const a=C.areas.find(x=>x.id===id);toast(`${a?a.name:''} → ${AK101[k][0]} ${AK101[k][1]}${k==='c'?' · HP에 넣어요':' · HP에 안 넣어요'}`);return}
  if(t.dataset.hk101){const a=C.actions.find(x=>x.id===t.dataset.hk101);if(!a)return;const k=akOf101(a.area),inn=hkOf101(a)==='c'||(hkOf101(a)===''&&k==='c');
    a.hk101=inn?(k==='c'?'x':''):(k==='c'?'':'c');save('config');reAk101();toast(`${a.name} · ${inn?'HP에서 뺌':'HP에 넣음'}`);return}
  if(t.dataset.bv101){C.bv101=C.bv101===0?1:0;save('config');reAk101();return}
  if(t.dataset.f101off){if(!C.f1from101)return;C.f101off=on101()?1:0;save('config');reAk101();toast(on101()?'새 규칙으로 HP를 셈':'옛 규칙(아침 에너지 + 모든 영역)으로 HP를 셈');return}
},true);
document.addEventListener('change',e=>{const t=e.target;if(!t||!t.dataset||!t.dataset.f101)return;e.stopPropagation();
  const k=t.dataset.f101,v=Math.round(+t.value);if(!isFinite(v))return;
  if(k==='hpb101')C.hpb101=clamp(v,0,100);else if(k==='stall101')C.stall101=clamp(v,1,60);else return;
  save('config');t.blur();reAk101()},true);

/* ---- 카드 편집 창: 칩 줄에 🔋 HP 칩 ---- */
openActionEditor=(function(prev){return function(id){const r=prev.apply(this,arguments);
  try{if(on101()){const sc=$('sheetC'),row=sc&&sc.querySelector('.r95'),a=C.actions.find(x=>x.id===id);
    if(row&&a&&!row.querySelector('[data-ae="hk101"]')){const dk=akOf101(a.area)==='c',s=document.createElement('select');
      s.dataset.ae='hk101';s.className='c95 hk101'+(hkOf101(a)?'':' def95');s.setAttribute('aria-label','HP(컨디션)에 넣을지');
      s.innerHTML=`<option value="">🔋 영역 따라 (${dk?'HP에 넣음':'HP에 안 넣음'})</option><option value="c">🔋 HP에 넣기</option><option value="x">○ HP에서 빼기</option>`;
      s.value=hkOf101(a);const ar=row.querySelector('[data-ae="area"]');if(ar)ar.after(s);else row.appendChild(s)}}}catch(e){console.error(e)}
  return r}})(openActionEditor);
document.addEventListener('change',e=>{const t=e.target;if(t&&t.matches&&t.matches('select.hk101'))t.classList.toggle('def95',!t.value)});

/* ---- 설명 창: HP(새 규칙 + 옛/새 비교) · 영역(종류 칩) ---- */
function cmp101(){const td=gk76(),rows=[];
  for(let i=0;i<7;i++){const k=addDays(td,-i),d=DAYS[k];if(!d||!hasData(d))continue;rows.push(`<span>${esc(wdOf(k))} ${esc(fmtD(k))}</span><span class="num">${ovOld101(d)}</span><span>→</span><b class="num">${ovNew101(d)}</b>`)}
  return rows.length?`<div class="cm101"><span class="tiny muted">날짜</span><span class="tiny muted">옛 규칙</span><span></span><span class="tiny muted">새 규칙</span>${rows.join('')}</div><p class="tiny muted" style="margin:4px 0 0">옛 규칙 = 그날 고른 아침 에너지 + 모든 영역 · 새 규칙 = 시작값 ${hpb101()} + 🔋 영역(+⚔ 용기)만. 지난 날 홈·통계에는 옛 값이 그대로 남아요 — 여기서만 비교해요.</p>`:''}
infoFor=(function(prev){return function(k){const r=prev.apply(this,arguments);
  try{if(r&&on101()&&k==='hp'){const day=curDay(),p=hpParts101(day),cs=C.areas.filter(a=>akOf101(a.id)==='c').map(a=>esc(a.name)).join('·'),ps=C.areas.filter(a=>akOf101(a.id)!=='c').map(a=>esc(a.name)).join('·');
      const top=`<p>오늘 몸·마음 상태(0~100). <b>새 규칙</b>: 하루 시작값 <b>${p.base}</b> + 🔋 컨디션 영역(${cs||'—'})의 컨디션 변화${C.bv101!==0?' + ⚔ 용기 기록':''} + 그 영역 식사·방치. ${ps?`<b>${ps}</b>은 HP에 안 들어가요(진척·경제).`:''}</p><p class="small">오늘: 시작 ${p.base} · 들어간 변화 ${p.inn>=0?'+':'−'}${Math.abs(p.inn)}${p.out?` · 안 들어간 변화 ${p.out>0?'+':'−'}${Math.abs(p.out)}`:''}</p>`;
      r.b=r.b.replace(/^<p>[\s\S]*?<\/p>/,top)+cmp101()+`<p class="tiny"><button type="button" class="linkbtn" data-goedit101="areas">영역 종류 바꾸기</button></p>`}
    if(r&&on101()&&k&&k.startsWith('area:')){const id=k.slice(5),a=C.areas.find(x=>x.id===id);if(a){const kk=akOf101(id);
      r.b+=`<div class="ak101i"><span class="tiny muted">이 영역은</span> ${Object.keys(AK101).map(x=>`<button type="button" class="chipbtn" data-ak101="${esc(id)}:${x}" aria-pressed="${kk===x}">${AK101[x][0]} ${AK101[x][1]}</button>`).join('')}<span class="tiny muted">${kk==='c'?'· HP에 들어가요':'· HP에 안 들어가요'}</span></div>`}}}catch(e){console.error(e)}
  return r}})(infoFor);
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-goedit101]');if(!b)return;e.preventDefault();e.stopPropagation();
  ui.edit=b.dataset.goedit101;try{closeSheet()}catch(x){}location.hash='edit';setTimeout(()=>{try{renderEdit()}catch(x){}},50)},true);

F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['🔋 HP에 넣을 영역(컨디션·진척·경제)','편집 → 컨디션 영역 · 영역 막대 누르기','HP는 🔋 컨디션 영역(몸·마음·생활 등)만 더해요. 📈 진척·💰 경제 영역은 HP와 따로, 홈 막대 아래 칩으로 영역 레벨·이번 주 ✨·멈춘 날을 보여요. 카드마다 예외(HP에 넣기/빼기)는 카드 편집 칩 줄의 🔋 칩. 아침 에너지 대신 하루 시작값을 써요.',()=>{ui.edit='areas';location.hash='edit'},'컨디션 영역 HP 진척 경제 아침 에너지 시작값 F1'],
  ['📈 진척 칩(멈춤 표시)','홈 전투 카드 영역 막대 아래','진척·경제 영역의 영역 레벨과 이번 주 ✨를 보여 주고, 정한 날(기본 7일) 넘게 안 하면 ⏸ n일째가 붙어요. 줄지 않아요 — HP를 깎지 않고 알려만 줘요.',()=>{location.hash='home'},'진척 멈춤 경보 원정 작품 성장']])}})(F67);
