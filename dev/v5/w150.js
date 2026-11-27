/* ================= v13.30 (w150): F5-② 🔢 횟수 기준 + 기록 창 이유 한 줄 · 경제 칩 '참음 n/m' → 이번 달 충동 목록 (사용자 11/27 밤) =================
   설계안: 프로젝트 문서 notes/2026-11-27-F5-기준형카드-설계안.md 2절
   · 데이터: 옵션의 `o.cn={p:'d'|'w'|'m', n:N}` = "이 기간(오늘·이번 주·이번 달)에 N번 넘으면(=N+1번째부터) 이 옵션".
     ⏰ 시각(`o.from/o.to`)과 한 옵션에 같이 두지 않음(편집 창 '기준' 칸에서 하나만).
   · 자동 선택 순서(pickVariant 감쌈, w149 감쌈 위): ⏰ 시각 › 🔢 횟수(맞는 것 중 N이 가장 큰 것) › 기준형이면 🔢 없는 옵션 중 카드 종류와 같은 판정 › 그 밖엔 예전 그대로.
     횟수 = 그 기간 같은 카드 기록 수(`e.n` 포함, 고치는 기록은 뺌, F5-③ 대비 `a.mg`로 합친 옛 카드 기록도 셈). 주 = weekStart(C.wk71).
   · 기록 날짜: 기록 창이면 그 창 날짜(`S.d69`), actEntry({date})면 그 날, 아니면 curDay().
   · 기록 창 '📅 언제?' 줄의 `'옵션' 골라 둠` 뒤에 이유(새 줄 없음): `🔢 이번 주 3번째라서` / `🔢 이번 주 2번째 · 3번째부터 '회피'` / `⏰ 23~26시라서`.
   · 편집 창 세부 옵션 표: 부터·까지 두 칸 → `기준` 한 칸(누르면 아래에 ⏰/🔢 칸이 펼쳐짐 — 폰에서도 시각 기준을 고칠 수 있게 됨). 옛 입력칸은 숨겨 둠. */
(function(){
const P={d:['오늘','하루'],w:['이번 주','주'],m:['이번 달','달']};
const hasCn=o=>!!(o&&o.cn&&P[o.cn.p]&&+o.cn.n>=0);
const anyCn=window.anyCn150=a=>!!(a&&(a.opts||[]).some(hasCn));
const tmOk=(o,h)=>o.from!=null&&o.to!=null&&o.from!==''&&o.to!==''&&h>=+o.from&&h<+o.to;
let PKD=null;   // actEntry({date}) 동안의 날짜
function ctxOf(a){const S=sheetCtx;if(S&&S.a&&a&&S.a.id===a.id)return{date:S.d69||(S.e&&S.edit&&S.edit.date)||null,ex:S.e&&S.e.id,man:!!S.vidMan};return null}
function dateOf(a){if(PKD)return PKD;const c=ctxOf(a);return (c&&c.date)||curDay().date}
function keysOf(p,date){if(p==='d')return [date];
  if(p==='w'){const s=weekStart(date),o=[];for(let i=0;i<7;i++)o.push(addDays(s,i));return o}
  const m=String(date).slice(0,7);return Object.keys(DAYS).filter(k=>k.slice(0,7)===m)}
const cnt150=window.cnt150=function(a,p,date,exceptId){if(!a)return 0;
  const ids=new Set([a.id].concat((C.actions||[]).filter(x=>x&&x.mg===a.id).map(x=>x.id)));let n=0;
  keysOf(p,date).forEach(k=>{const d=DAYS[k];((d&&d.entries)||[]).forEach(e=>{if(e&&e.kind==='act'&&ids.has(e.aid)&&e.id!==exceptId)n+=Math.max(1,+e.n||1)})});return n};
/* 왜 이 옵션? — {o, by:'t'|'c'|'', k(이번이 몇 번째), p, next(다음 🔢 옵션)} */
const why150=window.why150=function(a,h,date,exceptId){const os=(a&&a.opts)||[];if(!os.length)return null;h=h==null?nowHour():h;
  const t=os.find(o=>!hasCn(o)&&tmOk(o,h));if(t)return{o:t,by:'t'};
  if(!anyCn(a))return null;date=date||dateOf(a);const c=ctxOf(a);if(exceptId==null&&c)exceptId=c.ex;
  const memo={},k=p=>memo[p]!=null?memo[p]:(memo[p]=cnt150(a,p,date,exceptId)+1);
  const hit=os.filter(o=>hasCn(o)&&k(o.cn.p)>+o.cn.n).sort((x,y)=>(+y.cn.n)-(+x.cn.n))[0];
  if(hit)return{o:hit,by:'c',k:k(hit.cn.p),p:hit.cn.p};
  const nx=os.filter(hasCn).sort((x,y)=>(+x.cn.n)-(+y.cn.n))[0];
  return{o:null,by:'',k:nx?k(nx.cn.p):0,p:nx&&nx.cn.p,next:nx}};

/* ---- 자동 선택 ---- */
pickVariant=(function(prev){return function(a,h){if(!anyCn(a))return prev.apply(this,arguments);
  try{const w=why150(a,h);if(w&&w.o)return w.o;
    if(window.mixed149&&mixed149(a)){const os=a.opts.filter(o=>!hasCn(o)),d=a.type==='bad'?'bad':'good';return os.find(o=>vt149(a,o)===d)||os[0]||null}
    return null}catch(e){console.error(e);return prev.apply(this,arguments)}}})(pickVariant);
actEntry=(function(prev){return function(a,o){if(!anyCn(a))return prev.apply(this,arguments);
  const keep=PKD;o=Object.assign({},o||{});PKD=o.date||null;
  try{const c=ctxOf(a);if(!o.vid&&!(c&&c.man)){const v=pickVariant(a,o.date?undefined:nowHour());if(v)o.vid=v.id}
    return prev.call(this,a,o)}finally{PKD=keep}}})(actEntry);

/* ---- 글자 ---- */
const tag=o=>hasCn(o)?`🔢${P[o.cn.p][1]}${+o.cn.n+1}~`:'';
const tagL=o=>hasCn(o)?`${P[o.cn.p][0]} ${+o.cn.n+1}번째부터`:'';
function reason(a,S){const dt=S.d69||curDay().date,w=why150(a,atHour(S.at),dt);if(!w)return '';
  if(w.by==='t'){const f=x=>{x=(+x)%24;const h=Math.floor(x);return h+'시'+(x>h?'반':'')};return `⏰ ${f(w.o.from)}~${f(w.o.to)}라서`}
  if(w.by==='c')return `🔢 ${P[w.p][0]} ${w.k}번째라서`;
  if(w.next)return `🔢 ${P[w.p][0]} ${w.k}번째 · ${+w.next.cn.n+1}번째부터 '${w.next.name}'`;return ''}
drawDoneSheet=(function(prev){return function(){const r=prev.apply(this,arguments);
  try{const S=sheetCtx,a=S&&S.a;if(!a||!(a.opts||[]).length)return r;const sc=$('sheetC');if(!sc)return r;
    sc.querySelectorAll('[data-sopt]').forEach(b=>{const o=a.opts.find(x=>x.id===b.dataset.sopt);if(!hasCn(o)||b.querySelector('.cn150'))return;
      (b.firstElementChild||b).insertAdjacentHTML('beforeend',` <small class="cn150" title="${esc(tagL(o))} 자동으로 골라요">${tag(o)}</small>`)});
    if(S.e||S.vidMan)return r;const s=sc.querySelector('.w70s');if(!s||s.querySelector('.why150'))return r;
    const y=reason(a,S);if(!y)return r;
    const tn=[...s.childNodes].find(n=>n.nodeType===3&&/골라 둠/.test(n.nodeValue));
    const sp=document.createElement('span');sp.className='why150';sp.textContent=' — '+y;
    if(tn){const i=tn.nodeValue.indexOf('골라 둠')+4,rest=tn.splitText(i);s.insertBefore(sp,rest)}else{const b=s.querySelector('b');if(b)b.after(sp)}}catch(e){console.error(e)}
  return r}})(drawDoneSheet);

/* ---- 카드 편집: 세부 옵션 '기준' 칸 ---- */
function crLbl(o){if(hasCn(o))return tag(o);if(o.from!=null&&o.from!==''&&o.to!=null&&o.to!=='')return `⏰${o.from}–${o.to}`;return '기준'}
function crTip(o){if(hasCn(o))return `🔢 ${P[o.cn.p][0]} ${o.cn.n}번 넘으면(${+o.cn.n+1}번째부터) 자동으로 이 옵션 — 누르면 바꿔요`;
  if(crLbl(o)!=='기준')return `⏰ ${o.from}~${o.to}시에 자동으로 이 옵션 — 누르면 바꿔요`;return '기준 없음(직접 고름) — 누르면 ⏰ 시각·🔢 횟수 기준'}
function crBtn(o,i){const on=crLbl(o)!=='기준';return `<button type="button" class="cr150b${on?' on':''}" data-cr150="${i}" title="${esc(crTip(o))}" aria-label="${esc(crTip(o))}">${esc(crLbl(o))}</button>`}
function crPanel(o,i){const m=hasCn(o)?'c':(crLbl(o)!=='기준'||o.cr150t)?'t':'';const n=hasCn(o)?+o.cn.n:2,p=hasCn(o)?o.cn.p:'w';
  const v=x=>x==null?'':esc(String(x));
  return `<div class="cr150p" data-cr150p="${i}"><span class="tiny muted">'${esc(o.name)}'을 자동으로 고를 때</span>
    <span class="seg150">${[['','직접 고름'],['t','⏰ 시각'],['c','🔢 횟수']].map(([k,l])=>`<button type="button" class="chipbtn" data-cr150m="${i}:${k}" aria-pressed="${m===k}">${l}</button>`).join('')}</span>
    ${m==='t'?`<span class="row150"><input type="number" min="0" max="30" step="0.5" data-cr150f="${i}:from" value="${v(o.from)}" aria-label="부터(시)">시부터 <input type="number" min="0" max="30" step="0.5" data-cr150f="${i}:to" value="${v(o.to)}" aria-label="까지(시)">시까지 <span class="tiny muted">자정 넘으면 24+(새벽 2시=26)</span></span>`:''}
    ${m==='c'?`<span class="row150"><select data-cr150f="${i}:p" aria-label="기간">${Object.keys(P).map(k=>`<option value="${k}" ${p===k?'selected':''}>${P[k][0]}</option>`).join('')}</select>에 <input type="number" min="0" max="99" data-cr150f="${i}:n" value="${n}" aria-label="몇 번">번 넘으면 → <b class="nx150">${n+1}번째부터</b> 이 옵션</span>
      <span class="tiny muted">그 전에는 🔢 없는 옵션을 골라요(예: 주 2번까지 ○ 중립 · 3번째부터 ▼ 나쁨).</span>`:''}</div>`}
function curA(){const S=sheetCtx;return S&&S.aedit&&C.actions.find(x=>x.id===S.aedit)}
function decoCr(){const a=curA();if(!a)return;const sc=$('sheetC');if(!sc)return;
  const tb=sc.querySelector('.vtable.tp149t')||(sc.querySelector('.vtable .vrow [data-aeo]')||{closest:()=>null}).closest('.vtable');if(!tb||tb.classList.contains('cr150t'))return;
  tb.classList.add('cr150t');
  [...tb.querySelectorAll(':scope > .vrow')].forEach(rw=>{const x=rw.querySelector(':scope > [data-aeodel]')||rw.lastElementChild;
    if(rw.classList.contains('head')){x&&x.insertAdjacentHTML('beforebegin','<span title="자동으로 고르는 기준(⏰ 시각·🔢 횟수)">기준</span>');return}
    const nm=rw.querySelector('[data-aeo][data-f="name"]');if(!nm)return;const i=+nm.dataset.aeo,o=(a.opts||[])[i];if(!o||!x)return;x.insertAdjacentHTML('beforebegin',crBtn(o,i))});
  const hp=tb.previousElementSibling;if(hp&&hp.classList.contains('help')&&!hp.querySelector('.h150')){
    hp.innerHTML=hp.innerHTML.replace(/시간대\(시\)를 적으면[^.]*\.\)?\s*/,'');
    hp.insertAdjacentHTML('beforeend',' <span class="h150"><b>기준</b>을 누르면 ⏰ 시각(예: 23시 이후) 또는 🔢 횟수(예: 이번 주 2번 넘으면)로 자동으로 골라요.</span>')}}
openActionEditor=(function(prev){return function(){const r=prev.apply(this,arguments);try{decoCr()}catch(e){console.error(e)}return r}})(openActionEditor);
function rowOf(i){const n=document.querySelector(`#sheetC .cr150t [data-aeo="${i}"][data-f="name"]`);return n&&n.closest('.vrow')}
function redraw(i,keepOpen){const a=curA(),o=a&&(a.opts||[])[i];if(!o)return;const rw=rowOf(i);if(!rw)return;
  const b=rw.querySelector('[data-cr150]');if(b)b.outerHTML=crBtn(o,i);
  const pn=document.querySelector(`#sheetC [data-cr150p="${i}"]`);if(pn)pn.remove();
  if(keepOpen)rw.insertAdjacentHTML('afterend',crPanel(o,i));
  const f=rw.querySelector('[data-f="from"]'),t=rw.querySelector('[data-f="to"]');if(f)f.value=o.from==null?'':o.from;if(t)t.value=o.to==null?'':o.to}
addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-cr150],[data-cr150m]');if(!t)return;e.preventDefault();e.stopPropagation();
  const a=curA();if(!a)return;
  if(t.dataset.cr150!=null){const i=+t.dataset.cr150;redraw(i,!document.querySelector(`#sheetC [data-cr150p="${i}"]`));return}
  const [is,m]=t.dataset.cr150m.split(':'),i=+is,o=(a.opts||[])[i];if(!o)return;
  if(m===''){delete o.cn;delete o.from;delete o.to;delete o.cr150t}
  else if(m==='t'){delete o.cn;o.cr150t=1}
  else if(m==='c'){delete o.from;delete o.to;delete o.cr150t;if(!hasCn(o))o.cn={p:'w',n:2}}
  save('config');redraw(i,true)},true);
addEventListener('change',e=>{const t=e.target;if(!t||!t.dataset||t.dataset.cr150f==null)return;e.stopPropagation();
  const a=curA();if(!a)return;const [is,f]=t.dataset.cr150f.split(':'),i=+is,o=(a.opts||[])[i];if(!o)return;
  if(f==='from'||f==='to'){const v=t.value===''?null:Math.abs(parseFloat(t.value));if(v==null||isNaN(v))delete o[f];else o[f]=Math.min(30,v);if(o.from!=null&&o.to!=null)delete o.cr150t}
  else{const c=hasCn(o)?o.cn:{p:'w',n:2};if(f==='p'&&P[t.value])c.p=t.value;if(f==='n'){const v=Math.round(Math.abs(+t.value));c.n=isNaN(v)?2:Math.min(99,v)}o.cn={p:c.p,n:c.n}}
  save('config');redraw(i,true);
  const fo=document.querySelector(`#sheetC [data-cr150f="${i}:${f}"]`);if(fo&&f!=='p')try{fo.focus()}catch(_){}},true);
addEventListener('keydown',e=>{const t=e.target;if(t&&t.dataset&&t.dataset.cr150f!=null&&e.key==='Enter'){e.preventDefault();t.blur()}},true);

/* ---- 경제 칩 '참음 n/m' → 이번 달 충동 목록 (지난 아이디어 ①) ---- */
const SL={h:'✓ 참음',w:'⇄ 바꿈(참음)',g:'✗ 참지 못함',p:'… 아직'};
function impBody(){const td=gk76(),m0=td.slice(0,7)+'-01',L=[];
  Object.keys(DAYS).filter(k=>k>=m0&&k<=td).sort().reverse().forEach(k=>{try{list110(k).forEach(x=>L.push({k,x,s:st110(x)}))}catch(_){}});
  const E=econ148();
  const li=L.map(({k,x,s})=>`<li class="im150 s-${s}"><span class="num tiny muted">${esc(k.slice(5).replace('-','/'))}</span> ${(IK110[x.k]||IK110.f)[0]} ${esc(x.n||'')}${x.a?` <span class="tiny muted">${Math.round(x.a).toLocaleString()}원</span>`:''} <b>${SL[s]||s}</b></li>`).join('');
  return `<p class="num"><b>참음 ${E.h}/${E.n}</b> <span class="tiny muted">— 확정한 충동 ${E.n}번 중 참은 ${E.h}번(🍰 ${E.hf} · 🛍 ${E.hb}${E.sw?` · 바꿈 ${E.sw}`:''}) · 참지 못함 ${E.g}번</span></p>
    ${li?`<ul class="small ul150">${li}</ul>`:'<p class="tiny muted">이번 달 적은 충동이 없어요.</p>'}
    <p class="row"><button type="button" class="chipbtn" data-im150="1">🍰 충동 적기 열기</button><button type="button" class="chipbtn" data-im150="g">📒 골드 장부</button></p>`}
infoFor=(function(prev){return function(k){if(k==='imp150')return{kind:'💰 경제',t:'이번 달 충동',b:`<div class="ip150">${impBody()}</div>`};return prev.apply(this,arguments)}})(infoFor);
addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('.ec148 .hd148');if(!t)return;e.preventDefault();e.stopPropagation();openInfo('imp150')},true);
addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-im150]');if(!t)return;e.preventDefault();e.stopPropagation();const g=t.dataset.im150==='g';try{closeInfo()}catch(_){}
  setTimeout(()=>{if(g){location.hash='#shop';setTimeout(()=>{const d=document.getElementById('gl145');if(d){d.open=true;d.scrollIntoView({block:'start'})}},250)}else{try{sheet110()}catch(err){console.error(err)}}},0)},true);

F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['🔢 횟수 기준(옵션 자동 선택)','편집 → 행동/습관 → 카드 이름 → 세부 옵션 → 옵션 줄 `기준` → 🔢 횟수','오늘·이번 주·이번 달에 n번 넘으면(n+1번째부터) 그 옵션을 자동으로 골라요(예: 외식 — 주 2번까지 ○ 중립 · 3번째부터 ▼ 나쁨). 기록 창 📅 언제? 줄에 `🔢 이번 주 3번째라서`처럼 이유가 떠요. ⏰ 시각 기준이 먼저예요.',()=>{location.hash='edit'},'횟수 기준 번째 넘으면 주 2번 자동 선택 옵션 기준형'],
  ['💰 이번 달 충동','홈 전투 카드 칩 줄 → 💰 경제 칩의 `참음 n/m` 글자 누르기','이번 달 적은 충동(🍰·🛍)이 날짜순으로 ✓ 참음 · ⇄ 바꿈 · ✗ 참지 못함과 함께 보여요.',()=>{location.hash='#home'},'충동 참음 참지 못함 목록']])}})(F67);
})();
