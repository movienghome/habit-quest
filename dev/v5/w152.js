/* ================= v13.32 (w152): F5-④ 📏 양 기준 + 🛏 수면 시간 카드 하나로 · 편집 ⇄ 합칠 만한 카드 n쌍 · 🛏 이번 주 23시 전/자정 넘김 (사용자 11/28) =================
   설계안: 프로젝트 문서 notes/2026-11-27-F5-기준형카드-설계안.md 2절 📏(= X1 B안 단위 칸)
   ① 📏 양 기준: 옵션 `o.q={lo,hi}`(lo 이상 ~ hi 미만, 빈 칸 = 끝없음) · 단위 `a.unit152`(카드 전체, 예 시간·분·잔).
      편집: 세부 옵션 표 `기준` 칸 → 📏 양(w150 crPanel을 직접 고침). 기록 창: 옵션 위 `📏 얼마나? [  ] 단위` 한 줄 — 적으면 범위에 맞는 옵션을 골라 둠.
      기록엔 `e.q152`(숫자). 📊 기록·통계에 `이 달 양 📏 평균·합`(w147 직접). 양 카드는 숫자 없이 옵션을 미리 고르지 않음(아무것도 안 고르면 '기록' 때 물음).
   ② 🛏 수면 시간(사용자 11/28 선택 '시간 둘만 합침'): '8시간 이상 잤다' ▲ + '6시간 미만 잤다' ▼ → 한 카드 `수면 시간`(a.sl152, 📏 시간)
      판정(사용자 11/28): 4 미만 ▼ · 4~5 ▼ · 5~6 ▼ · 6~6.5 ▼ 약간 나쁨 · 6.5~7 ○ · 7~7.5 ▲ 약간 좋음 · 7.5~8 ▲ 좋음 · 8 이상 ▲ 약간 좋음.
      점수: 좋음 = 옛 8시간 이상 옵션 값 · 약간 좋음 = 그 40% · 5~6·4~5·4 미만 = 옛 나쁜 카드 옵션 그대로 · 약간 나쁨 = 5~6의 절반.
      F5-③ 합치기와 같은 모양(T.mg151·옛 카드 a.mg/a.mgo/a.doneAt) — 한 번짜리 `C.mig152sl`, 알림 되돌리기 = 합치기 풀기. 🌙 잠든 시각은 따로 둠.
      자동 기록은 w141 sleepSync141(직접 고침): 일어난 날 한 줄 `e.sl141='q152'` + `e.q152`(시간).
   ③ 편집 → 행동/습관 맨 위 `⇄ 합칠 만한 카드 n쌍`(접힘) — 누르면 그 짝으로 미리 보기, ×는 그 짝 안 보기(`C.sgx152`).
   ④ 🛏 어젯밤 창: 시각 칸 밑 `🌙 이번 주 23시 전 n일 · 자정 넘김 n일`. */
(function(){
const A=()=>C.actions||[];
const byId=id=>A().find(x=>x&&x.id===id)||null;
const ab=v=>Math.abs(+v||0);
const hasQ=o=>!!(o&&o.q&&typeof o.q==='object');
const anyQ=window.anyQ152=a=>!!(a&&(a.opts||[]).some(hasQ));
const emp=x=>x==null||x==='';
const inR=(o,v)=>(emp(o.q.lo)||v>=+o.q.lo)&&(emp(o.q.hi)||v<+o.q.hi);
const qPick=window.qPick152=(a,v)=>{if(v==null||v===''||isNaN(+v))return null;v=+v;return ((a&&a.opts)||[]).find(o=>hasQ(o)&&inR(o,v))||null};
const unit=a=>(a&&a.unit152)||'';
const r2=v=>String(Math.round(v*100)/100);
const qTxt=o=>(emp(o.q.lo)?'':r2(+o.q.lo))+'~'+(emp(o.q.hi)?'':r2(+o.q.hi));
const VT=()=>window.VT149||{good:['▲','좋음'],mid:['○','중립'],bad:['▼','나쁨']};
const vt=(a,o)=>typeof vt149==='function'?vt149(a,o):(a&&a.type==='bad'?'bad':'good');
/* '7.5' · '7,5' · '7:30' · '7시 30' → 숫자 */
function parseQ(s){s=String(s==null?'':s).trim();if(!s)return null;let m=/^(\d+)\s*[:시]\s*(\d{1,2})\s*분?$/.exec(s);if(m)return (+m[1])+(+m[2])/60;
  m=/^(\d+(?:[.,]\d+)?)/.exec(s);if(!m)return null;const v=parseFloat(m[1].replace(',','.'));return isNaN(v)?null:Math.max(0,v)}
window.parseQ152=parseQ;
let QV=null;   // 기록 창을 닫고 doAction이 도는 동안의 양
const qOf=a=>{if(!a)return null;if(QV&&QV.id===a.id)return QV.v;const S=sheetCtx;if(S&&S.a&&S.a.id===a.id&&S.q152!=null)return S.q152;return null};

/* ---------- 자동 선택 · 기록 ---------- */
pickVariant=(function(prev){return function(a,h){if(!anyQ(a))return prev.apply(this,arguments);
  try{const q=qOf(a);if(q!=null)return qPick(a,q);const r=prev.apply(this,arguments);return r&&!hasQ(r)?r:null}catch(e){console.error(e);return null}}})(pickVariant);
actEntry=(function(prev){return function(a,o){if(!anyQ(a))return prev.apply(this,arguments);
  o=Object.assign({},o||{});let q=o.q152!=null?+o.q152:qOf(a);if(q!=null&&isNaN(+q))q=null;
  if(q!=null&&!o.vid){const v=qPick(a,q);if(v)o.vid=v.id}
  const e=prev.call(this,a,o);try{if(e&&q!=null)e.q152=Math.round(+q*100)/100}catch(_){}return e}})(actEntry);
sheetOK=(function(prev){return function(){const S=sheetCtx;
  try{if(S&&S.a&&anyQ(S.a)){const inp=document.querySelector('#sheetC [data-q152]');if(inp){S.q152=parseQ(inp.value);S.q152raw=inp.value;if(S.q152!=null&&!S.vidMan){const o=qPick(S.a,S.q152);if(o)S.vid=o.id}}
    if(!S.vid){toast(`📏 얼마나 했는지(${unit(S.a)||'숫자'}) 적거나 옵션을 하나 골라요`);if(inp)try{inp.focus()}catch(_){}return}
    QV={id:S.a.id,v:S.q152}}}catch(e){console.error(e)}
  try{return prev.apply(this,arguments)}finally{QV=null}}})(sheetOK);
sheetSave=(function(prev){return function(){const S=sheetCtx;
  try{if(S&&S.a&&anyQ(S.a)){const inp=document.querySelector('#sheetC [data-q152]');if(inp){S.q152=parseQ(inp.value);S.q152raw=inp.value}QV={id:S.a.id,v:S.q152}}}catch(e){console.error(e)}
  try{return prev.apply(this,arguments)}finally{QV=null}}})(sheetSave);

/* ---------- 기록 창: 📏 얼마나? 한 줄 ---------- */
drawDoneSheet=(function(prev){return function(){const S=sheetCtx;
  try{if(S&&S.e&&S.q152===undefined){S.q152=S.e.q152!=null?+S.e.q152:null;S.q152raw=S.q152!=null?r2(S.q152):''}}catch(_){}
  const r=prev.apply(this,arguments);
  try{const a=S&&S.a;if(!a||!anyQ(a)||(S.e&&S.e.kind!=='act'))return r;const sc=$('sheetC');if(!sc||sc.querySelector('.q152r'))return r;
    const b0=sc.querySelector('.seg [data-sopt]'),seg=b0&&b0.closest('.seg'),box=seg&&seg.parentElement;if(!box)return r;
    const v=S.q152,hit=v!=null?qPick(a,v):null,u=unit(a);
    const hint=v!=null?(hit?`→ ${VT()[vt(a,hit)][0]} ${esc(hit.name)}`:'맞는 범위가 없어요 — 옵션을 직접 골라요'):'적으면 범위에 맞는 옵션을 골라요';
    const raw=S.q152raw!=null?S.q152raw:(v!=null?r2(v):'');
    box.insertAdjacentHTML('beforebegin',`<div class="q152r"><label>📏 얼마나? <input data-q152="1" inputmode="decimal" autocomplete="off" value="${esc(raw)}" placeholder="${u==='시간'?'예 7.5 · 7:30':'숫자'}" aria-label="얼마나${u?'('+esc(u)+')':''}"> ${esc(u)}</label> <span class="tiny muted q152h">${hint}</span></div>`);
    sc.querySelectorAll('[data-sopt]').forEach(b=>{const o=(a.opts||[]).find(x=>x.id===b.dataset.sopt);if(!hasQ(o)||/\d/.test(o.name)||b.querySelector('.q152t'))return;
      (b.firstElementChild||b).insertAdjacentHTML('beforeend',` <small class="q152t">📏${esc(qTxt(o))}${esc(u)}</small>`)});
    if(!S.e&&hit&&S.vid===hit.id){const s=sc.querySelector('.w70s');if(s&&!s.querySelector('.why152')){const sp=document.createElement('span');sp.className='why152';sp.textContent=` — 📏 ${raw||r2(v)}${u}라서`;
      const tn=[...s.childNodes].find(n=>n.nodeType===3&&/골라 둠/.test(n.nodeValue));const old=s.querySelector('.why150');if(old)old.remove();
      if(tn){const i=tn.nodeValue.indexOf('골라 둠')+4,rest=tn.splitText(i);s.insertBefore(sp,rest)}else{const bb=s.querySelector('b');if(bb)bb.after(sp)}}}}catch(e){console.error(e)}
  return r}})(drawDoneSheet);
let QT=0;
function applyQ(val,live){const S=sheetCtx;if(!S||!S.a||!anyQ(S.a))return;const v=parseQ(val);
  if(String(S.q152raw||'')===String(val||'')&&S.q152===v&&live)return;
  S.q152=v;S.q152raw=val;if(v!=null){const o=qPick(S.a,v);if(o){S.vid=o.id;S.vidMan=false}}
  try{sheetRead()}catch(_){}drawDoneSheet();
  const i=document.querySelector('#sheetC [data-q152]');if(i&&live){try{i.focus();const n=i.value.length;i.setSelectionRange(n,n)}catch(_){}}}
addEventListener('input',e=>{const t=e.target;if(!t||!t.dataset||!t.dataset.q152)return;e.stopPropagation();if(e.isComposing)return;
  clearTimeout(QT);const v=t.value;QT=setTimeout(()=>applyQ(v,true),450)},true);
addEventListener('change',e=>{const t=e.target;if(!t||!t.dataset||!t.dataset.q152)return;e.stopPropagation();clearTimeout(QT);applyQ(t.value,false)},true);
addEventListener('keydown',e=>{const t=e.target;if(t&&t.dataset&&t.dataset.q152&&e.key==='Enter'&&!e.isComposing){e.preventDefault();clearTimeout(QT);applyQ(t.value,true)}},true);

/* ---------- 🛏 수면 시간: 두 카드 → 한 카드 (한 번짜리) ---------- */
const SDESC='잔 시간으로 골라요. 🛏 어젯밤 창에 잠든·일어난 시각을 적으면 일어난 날(오늘)로 자동으로 들어가요. 4 미만 ▼ · 4~5 ▼ · 5~6 ▼ · 6~6.5 ▼ 약간 · 6.5~7 ○ · 7~7.5 ▲ 약간 · 7.5~8 ▲ · 8 이상 ▲ 약간. 판정·점수는 편집 → 세부 옵션에서 바꿔요.';
const sGood=()=>A().find(a=>a&&a.type==='good'&&!a.doneAt&&!a.mg&&!a.sl152&&(a.sl141g||/[78]\s*시간\s*이상\s*잤/.test(a.name||'')))||null;
const sBad=()=>A().find(a=>a&&a.type==='bad'&&!a.doneAt&&!a.mg&&a.sl141b)||null;
const fv=(o,a,f)=>(o&&!emp(o[f]))?ab(o[f]):ab(a&&a[f]);
function buildSleep(g,b){
  const go=g&&(g.opts||[]).find(o=>o.id==='h3'),top={cond:g?fv(go,g,'cond'):8,xp:g?fv(go,g,'xp'):0,gold:g?fv(go,g,'gold'):0};
  const sl=x=>Math.round(x*0.4);
  const bo=id=>b&&(b.opts||[]).find(o=>o.id===id),bd={b0:8,b1:14,b2:20};
  const bv=id=>({cond:b?fv(bo(id),b,'cond'):bd[id],gold:b?fv(bo(id),b,'gold'):0,xp:0});
  const B0=bv('b0');
  const O=[['q0','4시간 미만','bad',bv('b2'),null,4],['q1','4~5시간','bad',bv('b1'),4,5],['q2','5~6시간','bad',B0,5,6],
    ['q3','6~6.5시간 (약간 나쁨)','bad',{cond:Math.max(1,Math.round(B0.cond/2)),gold:Math.round(B0.gold/2),xp:0},6,6.5],
    ['q4','6.5~7시간','mid',{cond:0,gold:0,xp:0},6.5,7],
    ['q5','7~7.5시간 (약간 좋음)','good',{cond:sl(top.cond),xp:sl(top.xp),gold:sl(top.gold)},7,7.5],
    ['q6','7.5~8시간','good',top,7.5,8],
    ['q7','8시간 이상 (약간 좋음)','good',{cond:sl(top.cond),xp:sl(top.xp),gold:sl(top.gold)},8,null]];
  return O.map(([id,name,tp,p,lo,hi])=>({id,name,tp,cond:p.cond,xp:tp==='good'?p.xp:0,gold:p.gold,q:{lo,hi}}))}
const MAPG={h1:'q4',h2:'q5',h3:'q7','':'q5'},MAPB={b0:'q2',b1:'q1',b2:'q0','':'q2'};
function migSleep(){
  if(C.mig152sl||!C.mig141t||typeof ready72!=='function'||!ready72())return false;
  C.mig152sl=1;const g=sGood(),b=sBad();if(!g&&!b){save('config');return true}
  const td=gk76(),base=g||b;
  const T={id:uid(),name:'수면 시간',type:'good',area:base.area,cond:0,gold:0,xp:0,marble:(g&&g.marble)||'',once:'',unit152:'시간',sl152:1,desc:SDESC,opts:buildSleep(g,b)};
  const t6=T.opts.find(o=>o.id==='q6');T.cond=t6.cond;T.xp=t6.xp;T.gold=t6.gold;
  if(g&&g.ar2){T.ar2=clone(g.ar2);if(g.r2!=null)T.r2=clone(g.r2)}
  T.mg151={src:[],at:td,mv:[]};const i=A().indexOf(base);C.actions.splice(i<0?C.actions.length:i,0,T);
  [[g,MAPG],[b,MAPB]].forEach(([s,M])=>{if(!s)return;const map=Object.assign({},M);(s.opts||[]).forEach(o=>{if(!map[o.id])map[o.id]=M['']});
    s.mgo=map;s.mg=T.id;if(s.doneAt)s.mgDone151=s.doneAt;s.doneAt=td;T.mg151.src.push(s.id);
    try{if(typeof mvLinks151==='function')mvLinks151(s,T,map[''],T.mg151.mv)}catch(e){console.error(e)}});
  save('config');try{syncDailies(C)}catch(e){}
  setTimeout(()=>{try{const k=gk76();if(DAYS[k]&&DAYS[k].sl102)sleepSync141(k)}catch(e){console.error(e)}},400);
  setTimeout(()=>toastAct(`🛏 '${[g,b].filter(Boolean).map(x=>x.name).join("' + '")}' → '수면 시간' 한 카드로 합쳤어요(📏 잔 시간으로 자동 · 6.5~7 ○ 중립)`,'되돌리기',()=>{try{unmerge151(T.id,true);const k=gk76();if(DAYS[k]&&DAYS[k].sl102)sleepSync141(k);toast('예전 수면 카드 둘로 되돌렸어요')}catch(e){console.error(e)}},10000),1600);
  return true}
render=(function(prev){return function(){const r=prev.apply(this,arguments);try{if(!C.mig152sl&&C.mig141t&&migSleep())setTimeout(()=>{try{render()}catch(_){}},0)}catch(e){console.error(e)}return r}})(render);
window.sleepQ152=()=>A().find(a=>a&&a.sl152&&!a.doneAt&&!a.mg)||null;

/* ---------- ③ 편집 → 행동/습관: 합칠 만한 카드 n쌍 ---------- */
const SG={open:false};
const mk=a=>a.type==='bad'?'▼':'▲';
function pairsAll(){const why=window.why151||(()=>''),seen=new Set(),P=[],x=new Set(Array.isArray(C.sgx152)?C.sgx152:[]);if(typeof pairs151!=='function')return P;
  A().forEach(a=>{if(!a||why(a))return;pairs151(a).forEach(b=>{const k=[a.id,b.id].sort().join('|');if(seen.has(k))return;seen.add(k);if(!x.has(k))P.push([a,b,k])})});return P}
function sgH(P){return `<details class="sg152"${SG.open?' open':''}><summary>⇄ 합칠 만한 카드 <b class="num">${P.length}</b>쌍</summary>
  <div class="sg152b">${P.slice(0,12).map(([a,b,k])=>`<span class="sg152p"><button type="button" class="chipbtn" data-mgp152="${esc(a.id)}|${esc(b.id)}">${mk(a)} ${esc(a.name)} <b>+</b> ${mk(b)} ${esc(b.name)} →</button><button type="button" class="ib sg152x" data-mgx152="${esc(k)}" aria-label="이 짝 안 보기" title="이 짝 안 보기">×</button></span>`).join('')}</div>
  <p class="tiny muted" style="margin:4px 0 0">누르면 그 짝으로 합치기 미리 보기 · × 누른 짝은 다시 안 떠요.</p></details>`}
function sgDeco(){if(typeof ui==='undefined'||ui.edit!=='actions')return;const eb=$('editBody');if(!eb||eb.querySelector(':scope > .sg152'))return;
  const P=pairsAll();if(P.length)eb.insertAdjacentHTML('afterbegin',sgH(P))}
renderEdit=(function(prev){return function(){const r=prev.apply(this,arguments);try{sgDeco()}catch(e){console.error(e)}return r}})(renderEdit);
addEventListener('toggle',e=>{const t=e.target;if(t&&t.classList&&t.classList.contains('sg152'))SG.open=t.open},true);
addEventListener('click',e=>{const T=e.target;if(!T||!T.closest)return;let b;
  if((b=T.closest('[data-mgp152]'))){e.preventDefault();e.stopPropagation();const [x,y]=b.dataset.mgp152.split('|');if(typeof mgSheet151==='function')mgSheet151(x,y);return}
  if((b=T.closest('[data-mgx152]'))){e.preventDefault();e.stopPropagation();const k=b.dataset.mgx152;C.sgx152=(Array.isArray(C.sgx152)?C.sgx152:[]).filter(z=>z!==k).concat([k]).slice(-200);save('config');
    const d=b.closest('.sg152'),p=b.closest('.sg152p');if(p)p.remove();const n=d&&d.querySelectorAll('.sg152p').length;
    if(d&&!n){const P=pairsAll();if(P.length){d.outerHTML=sgH(P)}else d.remove()}else if(d){const c=d.querySelector('summary .num');if(c)c.textContent=pairsAll().length}
    toast('이 짝은 다시 안 띄울게요');return}},true);

/* ---------- ④ 🛏 어젯밤 창: 이번 주 23시 전 · 자정 넘김 ---------- */
const hh=s=>{const m=/^(\d{1,2}):(\d{2})$/.exec(String(s||''));return m?(+m[1])+(+m[2])/60:null};
window.bedWeek152=function(k){k=k||gk76();const s0=weekStart(k);let e=0,l=0,n=0;
  for(let i=0;i<7;i++){const d=addDays(s0,i);if(d>k)break;const h=hh(((DAYS[d]||{}).sl102||{}).b);if(h==null)continue;n++;if(h>=18&&h<23)e++;else if(h<9)l++}
  return{e,l,n}};
slSheet102=(function(prev){return function(){const r=prev.apply(this,arguments);
  try{const sc=$('sheetC'),f=sc&&sc.querySelector('.sl102f');if(f&&!sc.querySelector('.bw152')){const w=bedWeek152(SL102.k||gk76());
    if(w.n)f.insertAdjacentHTML('afterend',`<p class="tiny bw152 num">🌙 이번 주 <b>23시 전 ${w.e}일</b> · <b>자정 넘김 ${w.l}일</b> <span class="muted">(적은 날 ${w.n}일)</span></p>`)}}catch(e){console.error(e)}
  return r}})(slSheet102);

F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['📏 양 기준(옵션 자동 선택)','편집 → 행동/습관 → 카드 이름 → 세부 옵션 → 옵션 줄 `기준` → 📏 양','옵션마다 범위(예: 6 이상 ~ 7 미만)와 카드 단위(시간·분·잔)를 정하면, 기록 창 `📏 얼마나?` 칸에 숫자를 적을 때 맞는 옵션을 골라요. 적은 숫자는 기록에 남아 📊 기록·통계에 이 달 평균·합으로 보여요.',()=>{location.hash='edit'},'양 단위 범위 시간 분 잔 숫자 기준'],
  ['🛏 수면 시간','홈 → 전투 카드 🛏 어젯밤 창 → 잠든·일어난 시각 저장','잔 시간으로 한 카드에 자동 기록(일어난 날): 4 미만·4~5·5~6 ▼ · 6~6.5 ▼ 약간 · 6.5~7 ○ · 7~7.5 ▲ 약간 · 7.5~8 ▲ · 8 이상 ▲ 약간. 🌙 잠든 시각은 따로. 어젯밤 창에 이번 주 23시 전·자정 넘김 날 수.',()=>{location.hash='home'},'수면 잠 8시간 6시간 수면 시간 합치기'],
  ['⇄ 합칠 만한 카드','편집 → 행동/습관 맨 위 `⇄ 합칠 만한 카드 n쌍`','이름이 짝인 카드(참음/못 참음, 회피/바로 함, 연락/답장처럼 같은 뜻 낱말)를 모아 보여 줘요. 누르면 합치기 미리 보기, ×는 그 짝 안 보기.',()=>{location.hash='edit'},'합치기 짝 제안 합칠까요']])}})(F67);
})();
