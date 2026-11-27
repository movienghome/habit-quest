/* ================= v13.22 (w145): E5 상점 💰 골드 장부 — 언제·얼마·무엇, 기간·정렬·이름별·카테고리별 =================
   보상 상점 칸(#shopList) 바로 밑에 접힌 `📒 골드 장부`. 기록(DAYS[날].entries)의 gold가 0이 아닌 것을 읽기만 함(데이터·점수 안 바뀜).
   · 접힘 기본(공간 아낌) — 머리글에 이번 달 번 것(▲)·쓴 것(▼)
   · 기간: 이번 주 / 이번 달 / 최근 30일 / 전체 / 📅 직접(시작·끝 날짜를 자유롭게) · 기본 이번 달
   · 보기: 📜 내역 / 🧮 이름별 합계 / 🗂 카테고리별 합계 · 거르기: 전부 / ▲ 번 것 / ▼ 쓴 것 · 정렬: 최신 / 큰 금액 / 작은 금액
   · 카테고리(자동): 번 것=영역(몸·마음…) · 쓴 것=🛡 장비 / 🎲 가챠 / 🛒 상점 구매 / ▼ 그 밖의 감점
   · 색만으로 구분 안 함(▲ + / ▼ −) · 보기 상태는 이 화면 동안만(저장 안 함) */
(function(){
const GL=window.GL145={f:'all',s:'new',n:30,p:'month',v:'list',from:'',to:''};
function rows145(){const out=[];
  Object.keys(DAYS).forEach(k=>{const d=DAYS[k];((d&&d.entries)||[]).forEach((e,i)=>{if(e&&+e.gold)out.push({k,e,i})})});return out}
function range145(){const td=gk76();
  if(GL.p==='week')return [weekStart(td),td];
  if(GL.p==='month')return [td.slice(0,7)+'-01',td];
  if(GL.p==='d30')return [addDays(td,-29),td];
  if(GL.p==='custom'){let a=GL.from||td.slice(0,7)+'-01',b=GL.to||td;if(a>b)[a,b]=[b,a];return [a,b]}
  return ['0000-00-00','9999-99-99']}
function cat145(e){
  if(e.gold<0){const n=String(e.name||'');
    if(e.kind==='buy'){if(/장비/.test(n))return '🛡 장비';if(/가챠/.test(n))return '🎲 가챠';return '🛒 상점 구매'}
    return '▼ 깎인 것(감점)'}
  let id=e.area;if(!id&&e.aid){const a=(C.actions||[]).find(x=>x.id===e.aid);id=a&&a.area}
  const ar=id&&(C.areas||[]).find(x=>x.id===id);return ar?'▲ '+ar.name:'▲ 영역 없음'}
const sgn=g=>(g>0?'▲ +':'▼ −')+Math.abs(Math.round(g)).toLocaleString();
function month145(all){const mk=gk76().slice(0,7);let inn=0,out=0,buy=0;
  all.forEach(({k,e})=>{if(k.slice(0,7)!==mk)return;if(e.gold>0)inn+=e.gold;else{out-=e.gold;if(e.kind==='buy')buy-=e.gold}});return {inn,out,buy,cut:out-buy}}
function group145(L,keyf){const m=new Map();
  L.forEach(({k,e})=>{const g=keyf(e),r=m.get(g)||{g,n:0,sum:0,last:''};r.n++;r.sum+=e.gold;if(k>r.last)r.last=k;m.set(g,r)});
  const cmp={new:(a,b)=>a.last<b.last?1:a.last>b.last?-1:0,big:(a,b)=>Math.abs(b.sum)-Math.abs(a.sum),small:(a,b)=>Math.abs(a.sum)-Math.abs(b.sum)}[GL.s];
  return [...m.values()].sort(cmp)}
function body145(all){
  const [a,b]=range145();
  let L=all.filter(({k,e})=>k>=a&&k<=b&&(GL.f==='all'||(GL.f==='in'?e.gold>0:GL.f==='buy'?(e.gold<0&&e.kind==='buy'):GL.f==='cut'?(e.gold<0&&e.kind!=='buy'):e.gold<0)));
  const byDate=(x,y)=>x.k<y.k?1:x.k>y.k?-1:x.i-y.i;
  const cmp={new:byDate,big:(x,y)=>Math.abs(y.e.gold)-Math.abs(x.e.gold)||byDate(x,y),small:(x,y)=>Math.abs(x.e.gold)-Math.abs(y.e.gold)||byDate(x,y)}[GL.s]||byDate;
  const chip=(grp,k,l)=>`<button type="button" class="chipbtn" data-gl145="${grp}:${k}" aria-pressed="${GL[grp]===k}">${l}</button>`;
  let inn=0,out=0,buy=0;L.forEach(({e})=>{if(e.gold>0)inn+=e.gold;else{out-=e.gold;if(e.kind==='buy')buy-=e.gold}});const net=inn-out,cut=out-buy;
  const dates=GL.p==='custom'?`<div class="row" style="gap:6px;margin-top:6px"><input type="date" data-gl145d="from" value="${esc(a)}" aria-label="시작 날짜"><span class="tiny muted">~</span><input type="date" data-gl145d="to" value="${esc(b)}" aria-label="끝 날짜"></div>`:'';
  const head=`<div class="gh145"><div class="row" style="gap:6px">${chip('p','week','이번 주')}${chip('p','month','이번 달')}${chip('p','d30','최근 30일')}${chip('p','all','전체')}${chip('p','custom','📅 직접')}</div>${dates}
    <div class="row" style="gap:6px">${chip('v','list','📜 내역')}${chip('v','name','🧮 이름별')}${chip('v','cat','🗂 카테고리별')}</div>
    <div class="row" style="gap:6px">${chip('f','all','전부')}${chip('f','in','▲ 번 것')}${chip('f','buy','🛒 쓴 것')}${chip('f','cut','▼ 깎인 것')}</div>
    <div class="row" style="gap:6px">${chip('s','new','📅 최신')}${chip('s','big','큰 금액')}${chip('s','small','작은 금액')}</div></div>
    <p class="tiny muted" style="margin:6px 0 4px">${GL.p==='all'?'전체':esc(fmtD(a))+' ~ '+esc(fmtD(b))} · ▲ 번 것 +${inn.toLocaleString()} · 🛒 쓴 것 −${buy.toLocaleString()} · ▼ 깎인 것 −${cut.toLocaleString()} · 합계 ${net>=0?'+':'−'}${Math.abs(net).toLocaleString()} · ${L.length}건</p>`;
  if(!L.length)return head+'<p class="tiny muted">이 기간엔 해당하는 골드 기록이 없어요.</p>';
  let items,rowH;
  if(GL.v==='list'){items=L.slice().sort(cmp);
    rowH=({k,e})=>`<div class="gr145"><span class="gd145 tiny muted num">${esc(fmtD(k))} ${esc(wdOf(k))}${e.t?' '+esc(e.t):''}</span><span class="gn145">${e.kind==='buy'?'🛒 ':''}${esc(e.name||e.title||'(이름 없음)')}${e.late?' <small class="muted">· 늦게 기록</small>':''}</span><b class="gv145 num">${sgn(e.gold)}</b></div>`}
  else{items=group145(L,GL.v==='name'?(e=>String(e.name||e.title||'(이름 없음)')):cat145);
    rowH=r=>`<div class="gr145"><span class="gd145 tiny muted num">${r.n}번</span><span class="gn145">${esc(r.g)}</span><b class="gv145 num">${sgn(r.sum)}</b></div>`}
  const shown=items.slice(0,GL.n);
  const more=items.length>shown.length?`<button type="button" class="chipbtn" data-gl145="more:1">더 보기 (${shown.length}/${items.length})</button>`:`<span class="tiny muted">${items.length}${GL.v==='list'?'건':'개'} · 불러온 날짜 안의 기록만 보여요</span>`;
  return head+`<div class="gl145rows">${shown.map(rowH).join('')}</div><div style="margin-top:6px">${more}</div>`}
function fill145(){const d=document.getElementById('gl145'),b=document.getElementById('gl145b');if(!d||!b)return;
  const all=rows145();const s=d.querySelector('summary small');if(s){const m=month145(all);s.textContent=`이번 달 ▲ +${m.inn.toLocaleString()} · 🛒 −${m.buy.toLocaleString()} · ▼ −${m.cut.toLocaleString()}`}
  if(d.open)b.innerHTML=body145(all)}
function ensure145(){if(typeof curView==='function'&&curView()!=='shop')return;const L=document.getElementById('shopList');if(!L)return;
  if(!document.getElementById('gl145'))L.insertAdjacentHTML('afterend','<details class="gl145" id="gl145"><summary>📒 골드 장부 <small class="tiny muted"></small></summary><div id="gl145b"></div></details>');
  fill145()}
renderShop=(function(prev){return function(){const r=prev.apply(this,arguments);try{ensure145()}catch(e){console.error(e)}return r}})(renderShop);
document.addEventListener('toggle',e=>{if(e.target&&e.target.id==='gl145')try{GL.n=30;fill145()}catch(x){console.error(x)}},true);
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-gl145]');if(!b)return;e.preventDefault();e.stopPropagation();
  const [g,k]=b.dataset.gl145.split(':');
  if(g==='more')GL.n+=30;
  else{if(g==='p'&&k==='custom'&&GL.p!=='custom'){const r=range145();GL.from=r[0]>'0000'?r[0]:gk76().slice(0,7)+'-01';GL.to=r[1]<'9999'?r[1]:gk76()}
    GL[g]=k;GL.n=30}
  try{fill145()}catch(x){console.error(x)}},true);
addEventListener('change',e=>{const i=e.target.closest&&e.target.closest('[data-gl145d]');if(!i)return;e.stopPropagation();
  if(/^\d{4}-\d{2}-\d{2}$/.test(i.value)){GL[i.dataset.gl145d]=i.value;GL.n=30;try{fill145()}catch(x){console.error(x)}}},true);
try{F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['📒 골드 장부','상점 → 보상 상점 아래 📒 골드 장부(눌러 펼침)','언제·얼마·무엇으로 골드가 늘고 줄었는지. 기간(이번 주·달·최근 30일·전체·직접 날짜) · 📜 내역/🧮 이름별/🗂 카테고리별 합계 · 전부/▲ 번 것/🛒 쓴 것/▼ 깎인 것 · 최신/큰/작은 금액 정렬',()=>{location.hash='shop'},'골드 장부 가계부 지출 번 것 쓴 것 정렬 기간 이름별 카테고리']])}})(F67)}catch(e){console.error(e)}
addEventListener('hashchange',()=>setTimeout(()=>{try{ensure145()}catch(e){}},80));
})();
