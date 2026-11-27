/* ================= v13.29 (w149): F5-① 기준형 카드 — 옵션마다 ▲좋음·○중립·▼나쁨 (사용자 11/27 밤) =================
   설계안: 프로젝트 문서 notes/2026-11-27-F5-기준형카드-설계안.md
   · 데이터는 옵션의 판정 칸 `o.tp`('good'|'mid'|'bad') 하나. 없으면 지금처럼 카드 종류(a.type)를 따름 → 옛 카드·기록은 그대로.
   · 옵션 판정이 섞인 카드 = 기준형 카드(mixed149) — 카드 목록에 ⇄.
   · 기록(actEntry 감쌈): ▲ = 좋은 카드처럼(XP·컨디션·골드·구슬) · ○ = 점수 0 기록(type 'good') · ▼ = 나쁜 카드처럼(누적 배수 포함).
     옵션 판정이 있는 기록엔 `e.tp149`(판정)를 남김 — 📊·방치가 이걸 봄.
   · 기준형 카드인데 옵션을 안 고르면: 시간대 옵션 > 카드 종류와 같은 판정의 첫 옵션 > 첫 옵션(pickVariant 감쌈).
   · 누적 배수(badMult 감쌈): 판정 칸이 있는 카드는 같은 카드의 '나쁨' 기록만 셈(좋음·중립 기록을 반복으로 세지 않게). w147 상한 그대로.
   · 방치(가, watchTarget·neglectList 감쌈): ▼ 나쁨 기록만 있는 날은 '안 한 날'(n일째 이어짐) — 그날 방치 감점은 0(표시만). */
(function(){
const VT={good:['▲','좋음'],mid:['○','중립'],bad:['▼','나쁨']};
window.VT149=VT;
const vt149=window.vt149=(a,o)=>(o&&VT[o.tp])?o.tp:(a&&a.type==='bad'?'bad':'good');
const hasTp=window.hasTp149=a=>!!(a&&(a.opts||[]).some(o=>o&&VT[o.tp]));
const mixed=window.mixed149=a=>{if(!a||!(a.opts||[]).length||!hasTp(a))return false;return new Set(a.opts.map(o=>vt149(a,o))).size>1};
window.etp149=e=>e&&VT[e.tp149]?e.tp149:(e&&e.type==='bad'?'bad':'good');
function defOpt(a){const os=a.opts||[];return os.find(o=>vt149(a,o)===(a.type==='bad'?'bad':'good'))||os[0]||null}

/* ---- 자동 선택 ---- */
pickVariant=(function(prev){return function(a){const r=prev.apply(this,arguments);if(r||!mixed(a))return r;return defOpt(a)}})(pickVariant);

/* ---- 점수 ---- */
actEntry=(function(prev){return function(a,o){o=o||{};
  if(!a||!hasTp(a))return prev.apply(this,arguments);
  let vid=o.vid;if(!vid&&mixed(a)){const p=pickVariant(a,o.date?undefined:nowHour());if(p)vid=p.id}
  const v=(a.opts||[]).find(x=>x.id===vid)||null,tp=v&&VT[v.tp]?v.tp:null;
  const o2=Object.assign({},o,{vid});
  if(!tp)return prev.call(this,a,o2);
  if(tp==='mid'){const n=Math.max(1,Math.min(20,Math.round(+o.n||1)));
    const e={kind:'act',aid:a.id,type:'good',name:a.name+' · '+v.name,area:a.area,cond:0,gold:0,xp:0,vid:v.id,tp149:'mid'};
    if(n>1)e.n=n;if(o.amt)e.amt=Math.round(+o.amt);return e}
  const a2=tp===a.type?a:Object.assign({},a,{type:tp},tp==='bad'?{marble:''}:{});
  const e=prev.call(this,a2,o2);e.tp149=tp;return e}})(actEntry);

/* ---- 누적 배수: 판정 칸이 있는 카드는 같은 카드의 나쁨 기록만 ---- */
badMult=(function(prev){return function(a,date,exceptId){const r=prev.apply(this,arguments);
  try{if(!r||!a||!hasTp(C.actions.find(x=>x.id===a.id)||a))return r;
    const P0=C.penalty||{},dt=date||curDay().date;let same=0;
    for(let i=0;i<7;i++){const d=DAYS[addDays(dt,-i)];if(!d)continue;(d.entries||[]).forEach(e=>{if(e.kind==='act'&&e.aid===a.id&&e.id!==exceptId&&e.type==='bad')same+=1})}
    let mult=Math.min(+P0.max||3,1+(+P0.same||0)*same+(+P0.chain||0)*(r.chain||0));
    if(C.f3from147&&String(dt)>=C.f3from147)mult=Math.min(mult,Math.max(1,+C.mcap147||2));   // w147 상한 그대로
    return {mult,same,chain:r.chain}}catch(e){console.error(e);return r}}})(badMult);

/* ---- 방치(가): ▼만 적은 날은 '안 한 날', 그날 감점은 0 ---- */
const isBadOpt=e=>e&&e.tp149==='bad';
watchTarget=(function(prev){return function(id){const w=prev.apply(this,arguments);if(!w||typeof w.done!=='function')return w;
  const d0=w.done;
  const strip=day=>{const L=(day&&day.entries)||[];return L.some(isBadOpt)?Object.assign({},day,{entries:L.filter(e=>!isBadOpt(e))}):day};
  return Object.assign({},w,{done:day=>!!day&&!!d0(strip(day)),bad149:day=>!!day&&(day.entries||[]).some(isBadOpt)&&!!d0(day)&&!d0(strip(day))})}})(watchTarget);
neglectList=(function(prev){return function(date){const L=prev.apply(this,arguments);let hit=false;
  try{const d=DAYS[date];if(d&&(d.entries||[]).some(isBadOpt)){
    L.forEach(n=>{if(n.t&&typeof n.t.bad149==='function'&&n.t.bad149(d)){n.bad149=1;if(n.pen){n.pen=0;hit=true}}});
    if(hit&&C.f3from147&&String(date)>=C.f3from147){   // w147 하루 상한을 비운 몫까지 다시 나눔
      let left=Math.max(1,+C.nlcap147||20);const hpIn=n=>{const ar=n.t&&n.t.area;return !ar||akOf101(ar)==='c'};
      L.filter(n=>hpIn(n)&&!n.bad149).sort((a,b)=>(b.raw147||0)-(a.raw147||0)).forEach(n=>{const raw=n.raw147!=null?n.raw147:n.pen,u=Math.min(raw,left);n.pen=u;left-=u})}}}catch(e){console.error(e)}
  return L}})(neglectList);
{const _t=alTip131;alTip131=function(x){const s=_t.apply(this,arguments);
  try{const nl=neglectList(gk76()).find(n=>n.bad149&&n.t&&x&&n.t.name===x.name);if(nl)return s+' · 오늘은 ▼ 나쁨으로 적어서 안 한 날로 셌지만 방치 감점은 빼요(솔직하게 적은 게 손해가 안 되게)'}catch(e){}
  return s}}

/* ---- 기록할 때 뜨는 글자: ○ 중립 ---- */
{const _d=doAction;doAction=function(a,ctx){ctx=ctx||{};let mid=false;
  try{if(hasTp(a)&&(ctx.direct||!needsSheet(a))){const v=(a.opts||[]).find(o=>o.id===ctx.vid)||(mixed(a)?pickVariant(a):null);mid=!!(v&&v.tp==='mid')}}catch(e){}
  if(!mid)return _d.apply(this,arguments);
  const _f=fxPop;fxPop=function(t,c){return _f.call(this,/^\+0 XP/.test(String(t))?'○ 중립 기록':t,'var(--muted)')};
  try{return _d.apply(this,arguments)}finally{fxPop=_f}}}

/* ---- 기록 창: 옵션마다 판정 · 점수 글자 · 기록 단추 ---- */
drawDoneSheet=(function(prev){return function(){const r=prev.apply(this,arguments);
  try{const S=sheetCtx,a=S&&S.a;if(!a||!hasTp(a)||(S.e&&S.e.kind!=='act'))return r;const sc=$('sheetC');if(!sc)return r;
    const dt=S.e?S.edit.date:curDay().date,an=(C.areas.find(z=>z.id===a.area)||{}).name||'';
    sc.querySelectorAll('[data-sopt]').forEach(b=>{const o=(a.opts||[]).find(x=>x.id===b.dataset.sopt);if(!o)return;const tp=vt149(a,o);
      b.classList.toggle('bad',tp==='bad');b.classList.add('tp149','t-'+tp);
      if(!b.querySelector('.tb149')&&b.firstElementChild)b.firstElementChild.insertAdjacentHTML('afterbegin',`<b class="tb149" title="${VT[tp][1]}" aria-label="${VT[tp][1]}">${VT[tp][0]}</b> `);
      const x=actEntry(a,{vid:o.id,n:1,date:dt,exceptId:S.e&&S.e.id}),s2=b.querySelector('.sc2');
      if(s2)s2.textContent=tp==='good'?`+${x.xp} XP${x.cond?' · 🔋+'+x.cond:''}`:tp==='mid'?'점수 0 · 기록만':`${x.cond} ${an}${x.gold?' · '+gtx(x.gold):''}`});
    const v=(a.opts||[]).find(x=>x.id===S.vid),tp=v?vt149(a,v):(a.type==='bad'?'bad':'good');
    const ok=sc.querySelector('[data-sheet="ok"]');if(ok){ok.classList.toggle('bad',tp==='bad');ok.textContent=tp==='good'?'✓ 했어요':tp==='mid'?'○ 기록':'▼ 기록'}
    const sg=sc.querySelector('.seg'),hd=sg&&sg.previousElementSibling;if(hd&&mixed(a)&&!hd.querySelector('.hp149'))hd.insertAdjacentHTML('beforeend',' <span class="tiny hp149" title="▲ 좋음 = 좋은 행동처럼 점수 · ○ 중립 = 점수 0, 기록만 · ▼ 나쁨 = 나쁜 행동처럼 감점">⇄ 고른 옵션의 판정대로 들어가요</span>')}catch(e){console.error(e)}
  return r}})(drawDoneSheet);

/* ---- 카드 편집: 옵션 줄 맨 앞에 판정 단추(누를 때마다 기본 → ▲ → ○ → ▼ → 기본) ---- */
const CYC=[undefined,'good','mid','bad'];
function tpBtn(a,o,i){const tp=VT[o.tp]?o.tp:null,d=a.type==='bad'?'bad':'good';
  const lb=tp?VT[tp][0]:VT[d][0],tip=tp?`판정: ${VT[tp][1]} — 누르면 바꿔요`:`판정: 카드 기본(${VT[d][1]}) — 누르면 ▲ 좋음·○ 중립·▼ 나쁨`;
  return `<button type="button" class="tp149b${tp?' on':''}" data-tp149="${i}" title="${esc(tip)}" aria-label="${esc(tip)}">${lb}</button>`}
function decoEd(){const S=sheetCtx,a=S&&S.aedit&&C.actions.find(x=>x.id===S.aedit);if(!a)return;const sc=$('sheetC');if(!sc)return;
  const rows=[...sc.querySelectorAll('.vtable .vrow')];if(!rows.length)return;const tb=rows[0].closest('.vtable');if(!tb||tb.classList.contains('tp149t'))return;
  tb.classList.add('tp149t');
  rows.forEach(rw=>{if(rw.classList.contains('head')){rw.insertAdjacentHTML('afterbegin','<span title="옵션 판정">판정</span>');return}
    const nm=rw.querySelector('[data-aeo][data-f="name"]');if(!nm)return;const i=+nm.dataset.aeo,o=(a.opts||[])[i];if(!o)return;
    nm.insertAdjacentHTML('beforebegin',tpBtn(a,o,i));const xp=rw.querySelector('[data-aeo][data-f="xp"]');if(xp)xp.disabled=!(a.type==='good'||o.tp==='good')});
  const hp=tb.previousElementSibling;if(hp&&hp.classList.contains('help')&&!hp.querySelector('.h149'))hp.insertAdjacentHTML('beforeend',' <span class="h149">맨 앞 <b>판정</b>(▲ 좋음·○ 중립·▼ 나쁨)을 누르면 옵션마다 따로 정해요 — 섞이면 ⇄ 기준형 카드(예: 빠른 답장 ▲ · 회피 ▼).</span>')}
openActionEditor=(function(prev){return function(){const r=prev.apply(this,arguments);try{decoEd()}catch(e){console.error(e)}return r}})(openActionEditor);
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-tp149]');if(!b)return;e.preventDefault();e.stopPropagation();
  const S=sheetCtx,a=S&&S.aedit&&C.actions.find(x=>x.id===S.aedit);if(!a)return;const i=+b.dataset.tp149,o=(a.opts||[])[i];if(!o)return;
  const nx=CYC[(CYC.indexOf(VT[o.tp]?o.tp:undefined)+1)%CYC.length];if(nx)o.tp=nx;else delete o.tp;save('config');
  b.outerHTML=tpBtn(a,o,i);const rw=sc149row(i);if(rw){const xp=rw.querySelector('[data-aeo][data-f="xp"]');if(xp)xp.disabled=!(a.type==='good'||o.tp==='good')}
  toast(mixed(a)?`⇄ 기준형 카드 — ${a.opts.map(x=>VT[vt149(a,x)][0]+' '+x.name).join(' · ')}`:`옵션 판정: ${o.name} ${VT[vt149(a,o)][0]} ${VT[vt149(a,o)][1]}`)},true);
function sc149row(i){const n=document.querySelector(`#sheetC [data-aeo="${i}"][data-f="name"]`);return n&&n.closest('.vrow')}

/* ---- 카드 목록: ⇄ ---- */
metaChips=(function(prev){return function(a){const h=prev.apply(this,arguments);
  try{if(mixed(a))return `<span class="g96 tp149g" title="⇄ 기준형 카드 — 옵션마다 ${esc(a.opts.map(o=>VT[vt149(a,o)][0]+' '+o.name).join(' · '))}">⇄</span>`+h}catch(e){}
  return h}})(metaChips);

F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['⇄ 기준형 카드(옵션 판정)','편집 → 행동/습관 → 카드 이름 → 세부 옵션 → 옵션 줄 맨 앞 판정 단추','한 카드 안에서 옵션마다 ▲ 좋음 · ○ 중립(점수 0, 기록만) · ▼ 나쁨을 정해요(예: 연락/답장 — 빠른 답장 ▲ · 하루 안에 ○ · 회피 ▼). 누적 배수는 나쁨 기록만 세고, 방치 경보는 ▼만 적은 날을 안 한 날로 세되 그날 방치 감점은 빼요. 카드 ℹ 📊에 ▲○▼ 횟수.',()=>{location.hash='edit'},'기준형 카드 판정 좋음 중립 나쁨 옵션 통합 참으면 못 참으면']])}})(F67);
})();
