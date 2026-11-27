/* ================= v13.21 (w145): E5 상점 💰 골드 장부 — 언제·얼마·무엇, 정렬 =================
   보상 상점 칸(#shopList) 바로 밑에 접힌 `📒 골드 장부`. 기록(DAYS[날].entries)의 gold가 0이 아닌 것을 읽기만 함(데이터·점수 안 바뀜).
   · 접힘 기본(공간 아낌) — 머리글에 이번 달 번 것(▲)·쓴 것(▼)
   · 거르기: 전부 / ▲ 번 것 / ▼ 쓴 것 · 정렬: 📅 최신 / 큰 금액 / 작은 금액 · 30개씩 더 보기
   · 색만으로 구분 안 함(▲ + / ▼ −) · 보기 상태는 이 화면 동안만(저장 안 함) */
(function(){
const GL=window.GL145={f:'all',s:'new',n:30};
function rows145(){const out=[];
  Object.keys(DAYS).forEach(k=>{const d=DAYS[k];((d&&d.entries)||[]).forEach((e,i)=>{if(e&&+e.gold)out.push({k,e,i})})});return out}
function month145(all){const mk=gk76().slice(0,7);let inn=0,out=0;
  all.forEach(({k,e})=>{if(k.slice(0,7)!==mk)return;if(e.gold>0)inn+=e.gold;else out-=e.gold});return {inn,out}}
const sgn=g=>(g>0?'▲ +':'▼ −')+Math.abs(Math.round(g)).toLocaleString();
function body145(all){
  let L=all.filter(({e})=>GL.f==='all'||(GL.f==='in'?e.gold>0:e.gold<0));
  const byDate=(a,b)=>a.k<b.k?1:a.k>b.k?-1:a.i-b.i;
  const cmp={new:byDate,big:(a,b)=>Math.abs(b.e.gold)-Math.abs(a.e.gold)||byDate(a,b),small:(a,b)=>Math.abs(a.e.gold)-Math.abs(b.e.gold)||byDate(a,b)}[GL.s]||byDate;
  L=L.slice().sort(cmp);
  const chip=(grp,k,l)=>`<button type="button" class="chipbtn" data-gl145="${grp}:${k}" aria-pressed="${GL[grp]===k}">${l}</button>`;
  const m=month145(all),net=m.inn-m.out;
  const head=`<div class="gh145"><div class="row" style="gap:6px">${chip('f','all','전부')}${chip('f','in','▲ 번 것')}${chip('f','out','▼ 쓴 것')}</div>
    <div class="row" style="gap:6px">${chip('s','new','📅 최신')}${chip('s','big','큰 금액')}${chip('s','small','작은 금액')}</div></div>
    <p class="tiny muted" style="margin:6px 0 4px">이번 달 ▲ +${m.inn.toLocaleString()} · ▼ −${m.out.toLocaleString()} · 합계 ${net>=0?'+':'−'}${Math.abs(net).toLocaleString()}</p>`;
  if(!L.length)return head+'<p class="tiny muted">해당하는 골드 기록이 없어요.</p>';
  const shown=L.slice(0,GL.n);
  const rows=shown.map(({k,e})=>`<div class="gr145"><span class="gd145 tiny muted num">${esc(fmtD(k))} ${esc(wdOf(k))}${e.t?' '+esc(e.t):''}</span><span class="gn145">${e.kind==='buy'?'🛒 ':''}${esc(e.name||e.title||'(이름 없음)')}${e.late?' <small class="muted">· 늦게 기록</small>':''}</span><b class="gv145 num">${sgn(e.gold)}</b></div>`).join('');
  const more=L.length>shown.length?`<button type="button" class="chipbtn" data-gl145="more:1">더 보기 (${shown.length}/${L.length})</button>`:`<span class="tiny muted">${L.length}건 · 불러온 날짜 안의 기록만 보여요</span>`;
  return head+`<div class="gl145rows">${rows}</div><div style="margin-top:6px">${more}</div>`}
function fill145(){const d=document.getElementById('gl145'),b=document.getElementById('gl145b');if(!d||!b)return;
  const all=rows145();const s=d.querySelector('summary small');if(s){const m=month145(all);s.textContent=`이번 달 ▲ +${m.inn.toLocaleString()} · ▼ −${m.out.toLocaleString()}`}
  if(d.open)b.innerHTML=body145(all)}
function ensure145(){if(typeof curView==='function'&&curView()!=='shop')return;const L=document.getElementById('shopList');if(!L)return;
  if(!document.getElementById('gl145'))L.insertAdjacentHTML('afterend','<details class="gl145" id="gl145"><summary>📒 골드 장부 <small class="tiny muted"></small></summary><div id="gl145b"></div></details>');
  fill145()}
renderShop=(function(prev){return function(){const r=prev.apply(this,arguments);try{ensure145()}catch(e){console.error(e)}return r}})(renderShop);
document.addEventListener('toggle',e=>{if(e.target&&e.target.id==='gl145')try{GL.n=30;fill145()}catch(x){console.error(x)}},true);
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-gl145]');if(!b)return;e.preventDefault();e.stopPropagation();
  const [g,k]=b.dataset.gl145.split(':');if(g==='more')GL.n+=30;else{GL[g]=k;GL.n=30}
  try{fill145()}catch(x){console.error(x)}},true);
try{F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['📒 골드 장부','상점 → 보상 상점 아래 📒 골드 장부(눌러 펼침)','언제·얼마·무엇으로 골드가 늘고 줄었는지 한 줄씩. 전부/▲ 번 것/▼ 쓴 것 거르기 · 최신/큰 금액/작은 금액 정렬 · 머리글에 이번 달 합계',()=>{location.hash='shop'},'골드 장부 가계부 지출 번 것 쓴 것 정렬']])}})(F67)}catch(e){console.error(e)}
addEventListener('hashchange',()=>setTimeout(()=>{try{ensure145()}catch(e){}},80));
})();
