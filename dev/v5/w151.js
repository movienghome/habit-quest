/* ================= v13.31 (w151): F5-③ 카드 합치기·풀기 + 🔢 '다음 ▼' 꼬리표 · 자주 당기는 충동 + 🌙 잠든 시각 ▲ 옵션·오늘로 기록 (사용자 11/28) =================
   설계안: 프로젝트 문서 notes/2026-11-27-F5-기준형카드-설계안.md 4절
   ① 합치기: 카드 메뉴(기록하기 카드 빈 곳 · 편집 칩 우클릭/꾹) `⇄ 다른 카드와 합치기…` · 카드 편집 창 아래 `⇄ 합치기`
      → 고르기 창(맨 위 '합칠까요?' 짝 카드 · 찾기 · 영역별 칩) → 미리 보기(이름·영역·옵션·옮길 연결) → 합치기.
      결과: 새 카드 T(옵션 = 옛 카드들, 점수·판정은 옛 카드 그대로 `o.tp`) · 옛 카드는 숨김(`a.mg=T.id`·`a.doneAt`·옵션 지도 `a.mgo`) — 옛 기록은 안 바꿈.
      T.mg151 = {src:[옛 id], at, mv:[옮긴 연결]} — 풀기는 mv를 거꾸로 되돌리고 옛 카드를 되살림(T에 새 기록이 있으면 T는 숨김, 없으면 지움).
      옛 카드로 들어오는 기록(남은 연결·다른 기기)은 actEntry 감쌈이 T의 해당 옵션으로 돌림 → 기록은 늘 한 카드로.
      같이 셈: 📊(w147 ent)·누적 배수(w149)·🔢 횟수(cnt150, 이미)·방치(watchTarget 감쌈)·카드 메뉴 7일 횟수(st7_103).
   ② 🔢 '다음 ▼': 기록하기 카드 줄 이름 뒤 — 다음 기록이 🔢 횟수 기준으로 다른 옵션에 들어가면 `다음 ▼`(그 옵션 판정).
   ③ 이번 달 충동 창: `🔁 자주 당기는 것 · 야식 5번(참음 3)` 한 줄.
   ④ 🌙 늦게 잠 카드(sleepCard73): 옵션 ▲ `23시 전`(🔋+6 ✨5) · ▲ `자정 전`(🔋+2 ✨2) 앞에 더함(한 번짜리 C.mig151bt, 되돌리기 있음).
      어젯밤 창 자동 기록은 **일어난 날(k)** 로(`e.sl141='bt151'`) — 예전 어제(yk) 자동 기록('late')은 그 창을 다시 저장할 때 지우고 옮김.
      아침에 직접 적어도 어제로 가던 것(a.morn72)은 끔. 카드 표시 `a.bt151` — 이름을 바꿔도 찾음(sleepCard73·sep104 다시 선언).
      ⚠ w141은 IIFE 안이라 sleepSync141·lateOpt141은 w141을 직접 고침(다시 선언하면 클릭 길이 옛 것을 씀). */
(function(){
const VT=()=>window.VT149||{good:['▲','좋음'],mid:['○','중립'],bad:['▼','나쁨']};
const A=()=>C.actions||[];
const byId=id=>A().find(x=>x&&x.id===id)||null;
const srcOf=T=>T?A().filter(x=>x&&x.mg===T.id):[];
const mgIds=window.mgIds151=a=>{const s=new Set();if(!a)return s;s.add(a.id);srcOf(a).forEach(x=>s.add(x.id));return s};
/* 옛 기록 → 합친 카드의 옵션 id */
window.mgVid151=e=>{if(!e)return null;const s=byId(e.aid);if(s&&s.mg&&s.mgo){const m=s.mgo;return (e.vid&&m[e.vid])||m['']||e.vid||null}return e.vid||null};
const vt=(a,o)=>typeof vt149==='function'?vt149(a,o):(a&&a.type==='bad'?'bad':'good');
const sleepish=a=>!!(a&&(a.sl141g||a.sl141b||a.sl152||a.bt151||a.morn72||(typeof sleepCard73==='function'&&sleepCard73()===a)));
function why0(a){if(!a)return '없음';if(a.mg)return '이미 합침';if(a.doneAt)return '숨김';if(a.dopaOnly)return '도파민 메뉴 전용';if(sleepish(a))return '🛏 수면 자동 기록 카드';return ''}
window.why151=why0;
const ab=a=>Math.abs(+a||0);

/* ---------- 짝 카드 찾기 ---------- */
const TAIL=/(\s*(참음|참았다|참았음|참기|참은\s*날|못\s*참음|못\s*참았다|안\s*함|안\s*했다|안\s*하기|회피|미룸|미뤘다|미루기|바로\s*함|바로\s*했다|바로|했다|함|하기))+$/;
const nm=s=>String(s||'').replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE0F}]/gu,' ').replace(/[·\-_/()\[\],.!?~]/g,' ').replace(/\s+/g,' ').trim();
const stem=s=>nm(s).replace(TAIL,'').replace(/\s+/g,'');
const STOP=new Set(['하기','했다','이상','넘게','시간','오늘','처음','한번','조금','많이','바로','안함']);
/* v13.32: 같은 뜻 낱말 묶음 — '연락·마감 회피' ↔ '빠른 답장'처럼 낱말이 달라도 짝으로(사용자 11/28: 합칠까요?가 안 떴음) */
const SYN=[['연락','답장','회신','메시지','메세지','카톡','문자','전화','메일','이메일','디엠','dm'],['야식','폭식','과식','간식','군것질','배달음식'],
  ['충동구매','구매','쇼핑','소비','지름','결제'],['쇼츠','피드','릴스','유튜브','sns','스크롤','인스타'],['청소','정리','치우기'],['술','음주','맥주','소주','와인','과음','혼술'],['운동','헬스','근력']];
const canon=w=>{const l=w.toLowerCase();for(let i=0;i<SYN.length;i++)if(SYN[i].some(g=>l===g||(g.length>=2&&l.startsWith(g))))return '§'+i;return w};
const words=s=>nm(s).split(' ').map(w=>w.replace(/(을|를|이|가|은|는|에|로|으로|과|와)$/,'')).filter(w=>w.length>=2&&!STOP.has(w)).map(canon);
function pairScore(a,b){if(!a||!b||a.id===b.id)return 0;const sa=stem(a.name),sb=stem(b.name);
  if(sa&&sa.length>=2&&sa===sb)return 3;
  if(sa.length>=2&&sb.length>=2&&(sa.startsWith(sb)||sb.startsWith(sa))&&a.type!==b.type)return 2;
  if(a.type!==b.type&&a.area===b.area){const w=new Set(words(a.name));if(words(b.name).some(x=>w.has(x)))return 1}
  return 0}
/* v13.33: 같은 이름 카드(사용자 11/28 '빠른 답장' 셋 중 하나만 합쳐져 남은 둘이 그대로 보였음) — 합친 카드는 옵션 이름과 같은 카드도 짝 */
const sameNm=window.sameNm153=(a,tp)=>{if(!a)return [];const n=nm(a.name),t=tp||(a.type==='bad'?'bad':'good');return A().filter(b=>b&&b.id!==a.id&&!why0(b)&&!b.mg151&&nm(b.name)===n&&(b.type==='bad'?'bad':'good')===t&&!(b.opts||[]).filter(Boolean).length)};
const optTwins=T=>{const out=[];if(!T||!T.mg151)return out;(T.opts||[]).forEach(o=>{if(!o)return;const n=nm(o.name);A().forEach(b=>{if(b&&b.id!==T.id&&!why0(b)&&!b.mg151&&nm(b.name)===n&&(b.type==='bad'?'bad':'good')===(o.tp||'good')&&!(b.opts||[]).filter(Boolean).length&&!out.includes(b))out.push(b)})});return out};
window.optTwins153=optTwins;
const pairs151=window.pairs151=a=>{const tw=optTwins(a);return tw.concat(A().filter(b=>!why0(b)&&b.id!==a.id&&!tw.includes(b)).map(b=>[b,pairScore(a,b)]).filter(x=>x[1]>0).sort((x,y)=>y[1]-x[1]).map(x=>x[0])).slice(0,4)};
/* 고른 카드와 이름이 같은 카드(같이 합칠 후보) */
function dupsFor(op,sel){const add=!!(op&&op.mg151),srcs=(add?[]:[op]).concat(sel.map(byId).filter(Boolean)),S=new Set(srcs.map(x=>x.id).concat(op?[op.id]:[])),out=[];
  srcs.forEach(s=>sameNm(s).forEach(b=>{if(!S.has(b.id)&&!out.includes(b))out.push(b)}));
  if(add)optTwins(op).forEach(b=>{if(!S.has(b.id)&&!out.includes(b)&&sel.length===0)out.push(b)});
  return out}
/* 옵션이 없는 카드는 이름·판정이 같은 옵션이 이미 있으면 그 옵션으로(새 옵션을 안 만듦) */
function twinOpt(s,pool){if((s.opts||[]).filter(Boolean).length)return null;const n=nm(s.name),tp=s.type==='bad'?'bad':'good';
  return pool.find(o=>o&&nm(String(o.name||'').split(' · ')[0])===n&&nm(o.name)===n&&(o.tp||'good')===tp)||null}

/* ---------- 옵션 만들기 ---------- */
function optsOf(s){const os=(s.opts||[]).filter(Boolean),map={},out=[];
  const f=(o,k)=>(o&&o[k]!=null&&o[k]!=='')?ab(o[k]):ab(s[k]);
  if(!os.length){const id=uid();out.push({id,name:s.name,tp:s.type==='bad'?'bad':'good',xp:s.type==='good'?ab(s.xp):0,cond:ab(s.cond),gold:ab(s.gold)});map['']=id;return{out,map}}
  os.forEach(o=>{const id=uid(),tp=vt(s,o);const n={id,name:s.name+' · '+o.name,tp,xp:tp==='good'?f(o,'xp'):0,cond:f(o,'cond'),gold:f(o,'gold')};
    ['from','to','cn'].forEach(k=>{if(o[k]!=null&&o[k]!=='')n[k]=clone(o[k])});out.push(n);map[o.id]=id});
  const d=os.find(o=>vt(s,o)===(s.type==='bad'?'bad':'good'))||os[0];map['']=map[d.id];return{out,map}}
const ORD={good:0,mid:1,bad:2};

/* ---------- 옮길 연결 ---------- */
function linksOf(s){const L=[];
  Object.values(TASKS||{}).forEach(t=>{if(t&&t.aid===s.id&&!t.cb76)L.push(['t',t.id,(t.rid?'⏱ ':t.status===0?'↻ ':'✓ ')+t.title])});
  (C.routines||[]).forEach(r=>(r.steps||[]).forEach((st,i)=>{if(st&&st.aid===s.id)L.push(['s',r.id+':'+i,'⏱ '+r.name+' 단계'])}));
  if(Array.isArray(C.pin133)&&C.pin133.includes(s.id))L.push(['p',s.id,'📌 빠른 기록']);
  (C.watches||[]).forEach((w,i)=>{if(w.action===s.id)L.push(['w',i,'⚠ 방치 경보 '+w.days+'일'])});
  if(s.dopa)L.push(['d',s.id,'🍬 도파민 코스']);
  return L}
function moveLinks(s,T,optId,mv){
  Object.values(TASKS||{}).forEach(t=>{if(!t||t.aid!==s.id||t.cb76)return;mv.push({k:'t',id:t.id,a:s.id,av:t.av151||null});t.aid=T.id;t.av151=optId;saveTask(t)});
  (C.routines||[]).forEach(r=>(r.steps||[]).forEach((st,i)=>{if(st&&st.aid===s.id){mv.push({k:'s',r:r.id,i,tid:st.tid||null,a:s.id});st.aid=T.id;st.av151=optId}}));
  if(Array.isArray(C.pin133)){const i=C.pin133.indexOf(s.id);if(i>=0){mv.push({k:'p',a:s.id,i});if(C.pin133.includes(T.id))C.pin133.splice(i,1);else C.pin133[i]=T.id}}
  (C.watches||[]).slice().forEach(w=>{if(w.action!==s.id)return;
    if(C.watches.some(x=>x!==w&&x.action===T.id)){mv.push({k:'wd',w:clone(w)});C.watches=C.watches.filter(x=>x!==w)}
    else{mv.push({k:'w',a:s.id});w.action=T.id}})}
window.mvLinks151=(s,T,optId,mv)=>moveLinks(s,T,optId,mv);   // v13.32 F5-④ 수면 카드 합치기가 씀
function undoLinks(T,mv){
  (mv||[]).slice().reverse().forEach(m=>{try{
    if(m.k==='t'){const t=TASKS[m.id];if(t&&t.aid===T.id){t.aid=m.a;if(m.av)t.av151=m.av;else delete t.av151;saveTask(t)}}
    else if(m.k==='s'){const r=(C.routines||[]).find(x=>x.id===m.r);if(!r)return;const st=(m.tid&&(r.steps||[]).find(x=>x.tid===m.tid))||(r.steps||[])[m.i];if(st&&st.aid===T.id){st.aid=m.a;delete st.av151}}
    else if(m.k==='p'){const p=Array.isArray(C.pin133)?C.pin133:(C.pin133=[]);const j=p.indexOf(T.id);if(p.includes(m.a))return;if(j>=0&&m.i===j)p[j]=m.a;else p.splice(Math.min(m.i,p.length),0,m.a)}
    else if(m.k==='w'){const w=(C.watches||[]).find(x=>x.action===T.id);if(w)w.action=m.a}
    else if(m.k==='wd'){C.watches=C.watches||[];if(!C.watches.some(x=>x.action===m.w.action))C.watches.push(m.w)}}catch(e){console.error(e)}})}

/* ---------- 합치기 · 풀기 ---------- */
function doMerge(openId,selIds,name,area){
  const op=byId(openId);if(!op||!guard())return null;const add=!!op.mg151;
  const srcs=(add?[]:[op]).concat(selIds.map(byId).filter(x=>x&&!why0(x)&&x.id!==op.id));
  if(!srcs.length||(!add&&srcs.length<2)){toast('합칠 카드를 하나 이상 골라요');return null}
  const td=gk76();let T=op;
  if(!add){const g=srcs.find(s=>s.type==='good');
    T={id:uid(),name:(name||'').trim()||srcs.map(s=>s.name).join('/'),type:op.type==='bad'?'bad':'good',area:area||op.area,
      cond:ab(op.cond),gold:ab(op.gold),xp:op.type==='good'?ab(op.xp):0,marble:(g&&g.marble)||'',once:'',opts:[]};
    ['ar2','r2','desc','reframe','money','dur'].forEach(k=>{if(op[k]!=null&&op[k]!=='')T[k]=clone(op[k])});
    if(g&&g.brave)T.brave=g.brave;const dp=srcs.find(s=>s.dopa);if(dp)T.dopa=dp.dopa;
    T.mg151={src:[],at:td,mv:[]};const i=A().indexOf(op);C.actions.splice(i<0?C.actions.length:i,0,T)}
  else{if(name&&name.trim())T.name=name.trim();if(area)T.area=area}
  const all=[];
  srcs.forEach(s=>{let {out,map}=optsOf(s);const tw=twinOpt(s,(add?(T.opts||[]):[]).concat(all));if(tw){out=[];map={'':tw.id}}all.push(...out);
    s.mgo=map;s.mg=T.id;if(s.doneAt)s.mgDone151=s.doneAt;s.doneAt=td;T.mg151.src.push(s.id);
    moveLinks(s,T,map[''],T.mg151.mv)});
  if(add)T.opts=(T.opts||[]).concat(all);
  else T.opts=all.map((o,i)=>[o,i]).sort((x,y)=>(ORD[x[0].tp]-ORD[y[0].tp])||(x[1]-y[1])).map(x=>x[0]);
  save('config');try{syncDailies(C)}catch(e){}
  return T}
function restoreSrc(T){undoLinks(T,(T.mg151||{}).mv);
  srcOf(T).forEach(s=>{delete s.mg;delete s.mgo;if(s.mgDone151){s.doneAt=s.mgDone151;delete s.mgDone151}else delete s.doneAt})}
function unmerge(id,quiet){const T=byId(id);if(!T||!T.mg151)return;const ns=srcOf(T).map(s=>s.name);
  restoreSrc(T);delete T.mg151;
  let n=0;Object.keys(DAYS).forEach(k=>{((DAYS[k]||{}).entries||[]).forEach(e=>{if(e&&e.aid===T.id)n++})});
  const linked=Object.values(TASKS||{}).some(t=>t&&t.aid===T.id&&t.status===0);
  if(n||linked){T.doneAt=gk76();T.ung151=1}else{try{tombAdd98([[T.id,'']])}catch(e){}C.actions=A().filter(x=>x!==T)}
  save('config');try{syncDailies(C)}catch(e){}render();
  if(!quiet)toast(`⇄ 합치기를 풀었어요 · ${ns.join(' · ')} 되살림${n?` · '${T.name}' 기록 ${n}개는 그대로(카드는 숨김)`:''}`,5200)}
window.unmerge151=unmerge;
/* 합친 카드를 지우면 옛 카드부터 되살림(기록·연결 잃지 않게) */
{const _del=delActs;delActs=function(ids){try{(ids||[]).forEach(id=>{const T=byId(id);if(T&&T.mg151&&srcOf(T).length){restoreSrc(T);delete T.mg151;setTimeout(()=>toast('⇄ 합친 카드를 지워서 옛 카드들을 되살렸어요'),600)}})}catch(e){console.error(e)}
  return _del.apply(this,arguments)}}

/* ---------- 옛 카드로 들어오는 기록 → 합친 카드의 옵션 ---------- */
actEntry=(function(prev){return function(a,o){try{if(a&&a.mg){const T=byId(a.mg);if(T&&!T.doneAt){const m=a.mgo||{};o=Object.assign({},o||{});o.vid=(o.vid&&m[o.vid])||m['']||undefined;return prev.call(this,T,o)}}}catch(e){console.error(e)}
  return prev.apply(this,arguments)}})(actEntry);
/* 습관 할 일 · 루틴 단계가 옮겨 온 카드면 그 옵션을 미리 고름 */
openDoneSheet=(function(prev){return function(ctx){try{if(ctx&&!ctx.edit&&!ctx.vid&&ctx.t&&ctx.t.av151){const a=ctx.a||byId(ctx.t.aid);if(a&&(a.opts||[]).some(o=>o.id===ctx.t.av151))ctx=Object.assign({},ctx,{vid:ctx.t.av151})}}catch(e){}
  return prev.call(this,ctx)}})(openDoneSheet);
completeTask=(function(prev){return function(t,ctx){try{if(t&&t.av151&&ctx&&ctx.direct&&!ctx.vid){const a=byId(t.aid);if(a&&(a.opts||[]).some(o=>o.id===t.av151))ctx=Object.assign({},ctx,{vid:t.av151})}}catch(e){}
  return prev.call(this,t,ctx)}})(completeTask);
/* 🍰 충동 '먹었음·샀음' 카드 찾기(badCard144)는 w144 IIFE 안이라 w144를 직접 고침: 합쳐서 숨은 옛 카드도 찾음 → 위 actEntry 감쌈이 합친 카드로 돌림 */

/* ---------- 같이 세기 ---------- */
watchTarget=(function(prev){return function(id){const w=prev.apply(this,arguments);try{const a=byId(id);if(!w||!a||typeof w.done!=='function')return w;
  const old=srcOf(a);if(!old.length)return w;const S=new Set(old.map(x=>x.id));
  const okE=e=>e&&e.kind==='act'&&S.has(e.aid)&&(typeof etp149==='function'?etp149(e):e.type)!=='bad',badE=e=>e&&e.kind==='act'&&S.has(e.aid)&&e.type==='bad';
  const done=day=>!!day&&(w.done(day)||(day.entries||[]).some(okE));
  return Object.assign({},w,{done,bad149:day=>!!day&&!done(day)&&((typeof w.bad149==='function'&&w.bad149(day))||(day.entries||[]).some(badE))})}catch(e){console.error(e);return w}}})(watchTarget);
function st7_103(id){const td=gk76(),S=mgIds(byId(id)||{id});let w=0,all=0,last='';
  Object.keys(DAYS).forEach(k=>{const n=((DAYS[k]||{}).entries||[]).filter(e=>S.has(e.aid)).length;if(!n)return;all+=n;if(diffDays(td,k)<7)w+=n;if(k>last)last=k});return{w,all,last}}
window.st7_103=st7_103;

/* ---------- 고르기 · 미리 보기 창 ---------- */
const M={id:null,sel:[],q:'',step:'pick'};
const mk=a=>a.type==='bad'?'▼':'▲';
const an151=id=>((C.areas||[]).find(x=>x.id===id)||{}).name||id||'';
const sc=o=>[o.tp==='good'&&+o.xp?`✨${o.xp}`:'',+o.cond?`🔋${o.tp==='bad'?'−':o.tp==='mid'?'':'+'}${o.cond}`:'',+o.gold?`💰${o.tp==='bad'?'−':'+'}${o.gold}`:''].filter(Boolean).join(' ')||(o.tp==='mid'?'점수 0':'');
function chip(a,on){const y=why0(a);return `<button type="button" class="chipbtn mc151${a.type==='bad'?' bad':''}" data-mp151="${esc(a.id)}" aria-pressed="${!!on}"${y?` disabled title="${esc(y)}"`:''}>${mk(a)} ${esc(a.name)}${y?` <small class="muted">· ${esc(y.startsWith('🛏')?'🛏 자동':y)}</small>`:''}</button>`}
function pickH(){const op=byId(M.id);if(!op)return '';const add=!!op.mg151,q=normN?normN(M.q||''):String(M.q||'').toLowerCase();
  const sg=(add?optTwins(op):pairs151(op)).filter(b=>!M.sel.includes(b.id));
  const pool=A().filter(b=>b.id!==op.id&&!b.mg&&!b.doneAt&&!b.dopaOnly&&(!q||(normN?normN(b.name):b.name.toLowerCase()).includes(q)));
  const ars=[op.area].concat((C.areas||[]).map(x=>x.id).filter(x=>x!==op.area));
  const grp=ars.map(ar=>{const L=pool.filter(b=>b.area===ar);if(!L.length)return '';const an=(C.areas.find(x=>x.id===ar)||{}).name||ar;
    return `<div class="ag151"><span class="tiny muted">${esc(an)}</span>${L.map(b=>chip(b,M.sel.includes(b.id))).join('')}</div>`}).join('')+
    (()=>{const L=pool.filter(b=>!ars.includes(b.area));return L.length?`<div class="ag151"><span class="tiny muted">기타</span>${L.map(b=>chip(b,M.sel.includes(b.id))).join('')}</div>`:''})();
  const src=add?srcOf(op):[];
  return `<div class="sh"><h3>⇄ ${add?`'${esc(op.name)}'에 더 합치기`:`'${esc(op.name)}'와 합치기`}</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    ${add?`<p class="small mg151h">합친 카드 · 옛 카드 ${src.map(s=>`<b>${mk(s)} ${esc(s.name)}</b>`).join(' · ')} <button type="button" class="linkbtn" data-mgun151="${esc(op.id)}">⇄ 합치기 풀기</button></p>`:''}
    <p class="tiny muted" style="margin:2px 0 6px">고른 카드가 한 카드의 옵션이 돼요(점수·▲▼ 판정은 옛 카드 그대로). 옛 카드는 숨기고 옛 기록은 그대로 두되 통계·누적 배수·방치·🔢 횟수에 같이 세요 — 언제든 풀 수 있어요.</p>
    ${sg.length?`<div class="sg151"><b>합칠까요?</b> ${sg.map(b=>`<button type="button" class="chipbtn${b.type==='bad'?' bad':''}" data-mgsg151="${esc(b.id)}">${mk(b)} ${esc(b.name)} →</button>`).join('')}</div>`:''}
    <input type="search" class="mq151" data-mq151="1" placeholder="🔍 카드 찾기" value="${esc(M.q||'')}" aria-label="합칠 카드 찾기">
    <div class="pk151">${grp||'<p class="tiny muted">맞는 카드가 없어요.</p>'}</div>
    <div class="row mf151"><span class="small">${M.sel.length?`<b>${M.sel.length}</b>개 고름`:'카드를 눌러 골라요'}</span><span style="flex:1"></span><button type="button" class="btn" data-mgnext151="1"${M.sel.length?'':' disabled'}>미리 보기 →</button></div>`}
function selAll(){const op=byId(M.id);if(!op)return M.sel.slice();const d=M.dupOff?[]:dupsFor(op,M.sel).map(b=>b.id);return M.sel.concat(d.filter(id=>!M.sel.includes(id)))}
function prevH(){const op=byId(M.id);if(!op)return '';const add=!!op.mg151,dups=M.dupOff?[]:dupsFor(op,M.sel),dupAll=dupsFor(op,M.sel),sel=M.sel.map(byId).filter(Boolean).concat(dups),srcs=(add?[]:[op]).concat(sel);
  let opts=[];const tw={};srcs.forEach(s=>{const t=twinOpt(s,(add?(op.opts||[]):[]).concat(opts.map(x=>x[0])));if(t){tw[t.id]=(tw[t.id]||1)+1;return}optsOf(s).out.forEach(o=>opts.push([o,s]))});
  if(!add)opts=opts.map((x,i)=>[x,i]).sort((x,y)=>(ORD[x[0][0].tp]-ORD[y[0][0].tp])||(x[1]-y[1])).map(x=>x[0]);
  const keep=add?(op.opts||[]).map(o=>[o,null]):[];
  const L=[];srcs.forEach(s=>linksOf(s).forEach(l=>L.push([s,l])));
  let ne=0;const S=new Set(srcs.map(s=>s.id));Object.keys(DAYS).forEach(k=>((DAYS[k]||{}).entries||[]).forEach(e=>{if(e&&S.has(e.aid))ne++}));
  const nmV=add?op.name:srcs.map(s=>s.name).join('/');const area=add?op.area:op.area;const difA=new Set(srcs.map(s=>s.area)).size>1;
  const row=([o,s])=>`<li><b class="tb149" aria-label="${VT()[o.tp][1]}">${VT()[o.tp][0]}</b> ${esc(o.name)} <span class="tiny muted num">${sc(o)}</span>${tw[o.id]?` <span class="tiny tw153">같은 이름 ${tw[o.id]}장 → 한 옵션</span>`:''}${s&&srcs.length>1&&!o.name.startsWith(s.name)?` <span class="tiny muted">← ${esc(s.name)}</span>`:''}</li>`;
  return `<div class="sh"><h3>⇄ 합치기 미리 보기</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <div class="row mn151"><label class="grow">이름 <input data-mgn151="1" value="${esc(nmV)}" aria-label="합친 카드 이름"></label>
      <select data-mga151="1" aria-label="영역">${(C.areas||[]).map(x=>`<option value="${esc(x.id)}" ${x.id===area?'selected':''}>${esc(x.name)}</option>`).join('')}</select></div>
    ${difA?`<p class="tiny warn151">영역이 달라요(${[...new Set(srcs.map(s=>(C.areas.find(x=>x.id===s.area)||{}).name||s.area))].join('·')}) — 앞으로 기록은 고른 영역으로 들어가요.</p>`:''}
    <p class="tiny muted" style="margin:6px 0 2px">옵션 ${keep.length+opts.length}개${add?` (지금 ${keep.length} + 새로 ${opts.length})`:''} · 기록할 때 고르고, 판정대로 점수가 들어가요</p>
    <ul class="ol151">${keep.map(row).join('')}${opts.map(row).join('')}</ul>
    ${dupAll.length?`<p class="tiny dp153">${M.dupOff?'☐':'☑'} 같은 이름 카드 <b>${dupAll.length}</b>장도 같이 합쳐요 — ${dupAll.map(b=>`${mk(b)} ${esc(b.name)} <span class="muted">(${esc(an151(b.area))})</span>`).join(' · ')} <button type="button" class="linkbtn" data-mgdup153="1">${M.dupOff?'같이 합치기':'빼기'}</button></p>`:''}
    ${L.length?`<details class="lk151" open><summary class="small">🔗 옮길 연결 ${L.length}개</summary><ul class="tiny">${L.map(([s,l])=>`<li>${esc(l[2])} <span class="muted">(${esc(s.name)} → 합친 카드)</span></li>`).join('')}</ul></details>`:'<p class="tiny muted">옮길 연결 없음</p>'}
    <p class="tiny muted">옛 기록 ${ne}개는 고치지 않아요 — 📊 통계·누적 배수·방치 경보·🔢 횟수에 같이 셈. 옛 카드는 숨김(편집 → 카드 메뉴 ⇄ 합치기 풀기로 되돌림).</p>
    <div class="row" style="gap:6px;margin-top:8px"><button type="button" class="btn ghost" data-mgback151="1">← 다시 고르기</button><span style="flex:1"></span><button type="button" class="btn" data-mggo151="1">⇄ 합치기</button></div>`}
function draw(){const h=M.step==='prev'?prevH():pickH();sheetCtx={mg151:1};openSheet(h)}
const open151=window.mgSheet151=function(id,pre){const a=byId(id);if(!a)return;const y=why0(a);if(y&&!a.mg151){toast(`'${a.name}'은 합칠 수 없어요 — ${y}`);return}
  M.id=id;M.sel=pre?[pre]:[];M.q='';M.dupOff=false;M.step=pre?'prev':'pick';draw()};
addEventListener('click',e=>{const T=e.target;if(!T||!T.closest)return;let b;
  if((b=T.closest('[data-mg151]'))){e.preventDefault();e.stopPropagation();const id=b.dataset.mg151;try{closeSheet()}catch(_){}setTimeout(()=>open151(id),40);return}
  if((b=T.closest('[data-mgun151]'))){e.preventDefault();e.stopPropagation();const id=b.dataset.mgun151;try{closeSheet()}catch(_){}unmerge(id);return}
  if(!(sheetCtx&&sheetCtx.mg151))return;
  if((b=T.closest('[data-mp151]'))){e.preventDefault();e.stopPropagation();const id=b.dataset.mp151,i=M.sel.indexOf(id);if(i<0)M.sel.push(id);else M.sel.splice(i,1);
    b.setAttribute('aria-pressed',String(i<0));const f=document.querySelector('#sheetC .mf151');if(f){const t=document.createElement('div');t.innerHTML=pickH();const nf=t.querySelector('.mf151');if(nf)f.replaceWith(nf)}return}
  if((b=T.closest('[data-mgsg151]'))){e.preventDefault();e.stopPropagation();M.sel=[b.dataset.mgsg151];M.step='prev';draw();return}
  if(T.closest('[data-mgnext151]')){e.preventDefault();e.stopPropagation();if(!M.sel.length)return;M.step='prev';draw();return}
  if(T.closest('[data-mgdup153]')){e.preventDefault();e.stopPropagation();M.dupOff=!M.dupOff;draw();return}
  if(T.closest('[data-mgback151]')){e.preventDefault();e.stopPropagation();M.step='pick';draw();return}
  if(T.closest('[data-mggo151]')){e.preventDefault();e.stopPropagation();const sc2=$('sheetC'),n=(sc2.querySelector('[data-mgn151]')||{}).value,ar=(sc2.querySelector('[data-mga151]')||{}).value;
    const T2=doMerge(M.id,selAll(),n,ar);if(!T2)return;closeSheet();render();
    toastAct(`⇄ '${T2.name}' — 옵션 ${(T2.opts||[]).length}개로 합쳤어요 · 옛 카드 ${T2.mg151.src.length}개 숨김`,'되돌리기',()=>unmerge(T2.id),8000);return}
},true);
let QT=0;
addEventListener('input',e=>{const t=e.target;if(!t||!t.dataset||!t.dataset.mq151)return;e.stopPropagation();M.q=t.value;if(e.isComposing)return;
  clearTimeout(QT);QT=setTimeout(()=>{const p=document.querySelector('#sheetC .pk151');if(!p)return;const d=document.createElement('div');d.innerHTML=pickH();const np=d.querySelector('.pk151');if(np)p.replaceWith(np);
    const sg=document.querySelector('#sheetC .sg151'),ns=d.querySelector('.sg151');if(sg&&!ns)sg.remove()},150)},true);
addEventListener('compositionend',e=>{const t=e.target;if(t&&t.dataset&&t.dataset.mq151)t.dispatchEvent(new Event('input',{bubbles:true}))},true);
addEventListener('keydown',e=>{const t=e.target;if(t&&t.dataset&&(t.dataset.mq151||t.dataset.mgn151)&&e.key==='Enter'&&!e.isComposing){e.preventDefault()}},true);

/* ---------- 입구: 카드 메뉴 · 편집 창 ---------- */
var AM151=null;
actMenu61=(function(prev){return function(a){AM151=a;try{return prev.apply(this,arguments)}finally{AM151=null}}})(actMenu61);
menu61=(function(prev){return function(x,y,tt,items){try{const a=AM151;if(a&&a.id&&Array.isArray(items)){items=items.slice();
  const i=items.findIndex(z=>z&&typeof z.l==='string'&&z.l.indexOf('🗑')===0);const at=i<0?items.length:Math.max(0,i-1);
  const add=[];if(a.mg151)add.push({l:'⇄ 더 합치기…',f:()=>open151(a.id)},{l:'⇄ 합치기 풀기',f:()=>unmerge(a.id)});
  else if(!why0(a))add.push({l:'⇄ 다른 카드와 합치기…',f:()=>open151(a.id)});
  items.splice(at,0,...add)}}catch(e){console.error(e)}
  return prev.call(this,x,y,tt,items)}})(menu61);
openActionEditor=(function(prev){return function(id){const r=prev.apply(this,arguments);try{const a=byId(id),sc2=$('sheetC'),d=sc2&&sc2.querySelector(`[data-del="actions"][data-id="${CSS.escape(id)}"]`);
  if(a&&d&&!sc2.querySelector('[data-mg151]')&&(a.mg151||!why0(a)))d.insertAdjacentHTML('afterend',` <button type="button" class="btn ghost sm" data-mg151="${esc(a.id)}" title="${a.mg151?'더 합치기·풀기':'다른 카드를 이 카드의 옵션으로 합치기'}">⇄ 합치기${a.mg151?'·풀기':''}</button>`)}catch(e){console.error(e)}return r}})(openActionEditor);
metaChips=(function(prev){return function(a){const h=prev.apply(this,arguments);
  try{if(a&&a.mg151&&!(window.mixed149&&mixed149(a))){const s=srcOf(a);return `<span class="g96 tp149g" title="⇄ 합친 카드 — ${esc(s.map(x=>x.name).join(' · '))}">⇄</span>`+h}}catch(e){}
  return h}})(metaChips);

/* ================= ② 🔢 '다음 ▼' 꼬리표 (기록하기 카드 줄) ================= */
function nxTag(){if(typeof why150!=='function'||typeof anyCn150!=='function')return;
  document.querySelectorAll('.act[data-info^="act:"] .ab .n').forEach(n=>{const row=n.closest('.act'),a=byId(row.dataset.info.slice(4));
    const old=n.querySelector('.nx151');if(!a||!anyCn150(a)){if(old)old.remove();return}
    let t='',tip='';try{const w=why150(a,nowHour(),curDay().date);if(w&&w.by==='c'&&w.o){const tp=vt(a,w.o),dflt=a.type==='bad'?'bad':'good';
      if(tp!==dflt||tp==='bad'){t='다음 '+VT()[tp][0];tip=`다음 기록은 '${w.o.name}'(${VT()[tp][1]})로 들어가요 — 🔢 ${({d:'오늘',w:'이번 주',m:'이번 달'})[w.p]} ${w.k}번째`}}}catch(e){}
    if(!t){if(old)old.remove();return}
    if(old){if(old.textContent!==t){old.textContent=t;old.title=tip}return}
    n.insertAdjacentHTML('beforeend',` <small class="nx151" title="${esc(tip)}" aria-label="${esc(tip)}">${t}</small>`)})}
render=(function(prev){return function(){const r=prev.apply(this,arguments);try{nxTag()}catch(e){console.error(e)}return r}})(render);
if(typeof renderLog==='function')renderLog=(function(prev){return function(){const r=prev.apply(this,arguments);try{nxTag()}catch(e){}return r}})(renderLog);

/* ================= ③ 이번 달 충동: 자주 당기는 것 ================= */
infoFor=(function(prev){return function(k){const r=prev.apply(this,arguments);
  try{if(k==='imp150'&&r&&typeof r.b==='string'&&r.b.indexOf('fr151')<0){const td=gk76(),m0=td.slice(0,7)+'-01',G={};
    Object.keys(DAYS).filter(d=>d>=m0&&d<=td).forEach(d=>{try{list110(d).forEach(x=>{const nm2=String(x.n||'').trim();if(!nm2)return;const key=nm2.replace(/\s+/g,'');
      const g=G[key]||(G[key]={n:nm2,c:0,h:0,k:x.k});g.c++;const s=st110(x);if(s==='h'||s==='w')g.h++})}catch(_){}});
    const L=Object.values(G).filter(g=>g.c>=2).sort((a,b)=>b.c-a.c||b.h-a.h).slice(0,4);
    if(L.length)r.b=r.b.replace('</p>',`</p><p class="small fr151">🔁 <b>자주 당기는 것</b> ${L.map(g=>`${(IK110[g.k]||IK110.f)[0]} ${esc(g.n)} <span class="num">${g.c}번</span><span class="tiny muted">(참음 ${g.h})</span>`).join(' · ')}</p>`)}}catch(e){console.error(e)}
  return r}})(infoFor);

/* ================= ④ 🌙 잠든 시각: ▲ 23시 전 · ▲ 자정 전 + 일어난 날로 기록 ================= */
const BT=[{id:'e0',name:'23시 전',tp:'good',xp:5,cond:6,gold:0},{id:'e1',name:'자정 전',tp:'good',xp:2,cond:2,gold:0}];
const DESC='잠든 시각으로 골라요. 어젯밤 창에 잠든 시각을 적으면 일어난 날(오늘)로 자동으로 들어가요. 23시 전 ▲ · 자정 전 ▲(조금) · 자정 넘으면 ▼(늦을수록 더).';
function migBt(){/* 옛 늦게 잠 고침(mig72·73) 뒤에 */if(C.mig151bt||!C.mig73sleep||typeof ready72!=='function'||!ready72())return;C.mig151bt=1;const a=sleepCard73();if(!a){save('config');return}
  C.bak151bt=clone(a);a.opts=Array.isArray(a.opts)?a.opts:[];
  const add=BT.filter(o=>!a.opts.some(x=>x.id===o.id)).map(o=>Object.assign({},o));a.opts=add.concat(a.opts);a.bt151=1;delete a.morn72;
  if(!a.desc||/아침에 일어나서 적으면 어젯밤으로/.test(a.desc))a.desc=DESC;
  save('config');
  setTimeout(()=>{try{const k=gk76();if(DAYS[k]&&DAYS[k].sl102&&DAYS[k].sl102.b)sleepSync141(k)}catch(e){console.error(e)}},400);   // 오늘 어젯밤 창 기록을 오늘로 옮김
  setTimeout(()=>toastAct(`🌙 '${a.name}' 카드에 ▲ 23시 전 · ▲ 자정 전 옵션을 넣었어요 · 이제 일어난 날로 기록돼요`,'되돌리기',()=>{const i=A().findIndex(x=>x.id===a.id);if(i>=0&&C.bak151bt){C.actions[i]=C.bak151bt;delete C.bak151bt;save('config');render();toast('예전 카드로 되돌렸어요')}},9000),1500)}
render=(function(prev){return function(){const r=prev.apply(this,arguments);try{if(!C.mig151bt&&C.mig73sleep){migBt();if(C.mig151bt)setTimeout(()=>{try{render()}catch(_){}},0)}}catch(e){console.error(e)}return r}})(render);
})();

/* 함수 선언(마지막 선언이 이김) — IIFE 밖 */
function sleepCard73(){const all=(C.actions||[]);const f=all.find(a=>a&&a.bt151&&!a.mg);if(f)return f;const bad=all.filter(a=>a.type==='bad'&&!a.mg);
  return bad.find(a=>/늦게\s*(잠|자)/.test(a.name||''))||bad.find(a=>a.id==='b2')||bad.find(a=>/시\s*넘어\s*(잠|자)|새벽.*(잠|자)|밤샘/.test(a.name||'')&&!/늦잠/.test(a.name||''))}
function sep104(k){const r={dr:0,ln:0,sl:0},sc=typeof sleepCard73==='function'?sleepCard73():null;[addDays(k,-1),k].forEach(d=>{const y=DAYS[d];if(!y)return;
  (y.entries||[]).forEach(e=>{if(e.type!=='bad')return;const n=String(e.name||'')+' '+String(e.opt||'');
    if(e.aid==='b1'||/술|음주|과음|혼술|맥주|소주|와인/.test(n))r.dr=1;
    if(/야식|폭식|과식/.test(n)&&!/참/.test(n))r.ln=1;
    if(/늦게\s*잠|늦잠|밤샘|새벽\s*\d*시?\s*잠/.test(n)||(sc&&e.aid===sc.id))r.sl=1})});return r}
/* 어젯밤 창: '… 카드도 어제로 기록하기' → 오늘 기준 */
slSheet102=(function(prev){return function(){const r=prev.apply(this,arguments);
  try{const b=document.querySelector('#sheetC [data-sl102card]');const sc=sleepCard73();if(b&&sc){const k=SL102.k||gk76();
    if(((DAYS[k]||{}).entries||[]).some(e=>e.aid===sc.id)){const p=b.closest('p');if(p)p.remove()}
    else{b.textContent=`'${sc.name}' 카드도 기록하기`;const sm=b.nextElementSibling;if(sm)sm.textContent='(저장하면 잠든 시각으로 자동 · 23시 전 ▲ · 자정 넘으면 ▼)'}}}catch(e){console.error(e)}
  return r}})(slSheet102);

F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['⇄ 카드 합치기·풀기','기록하기 카드 빈 곳 누르기(편집 칩은 우클릭·꾹) → ⇄ 다른 카드와 합치기 · 카드 편집 창 아래 ⇄ 합치기','비슷한 카드 둘 이상을 한 카드의 옵션으로 합쳐요(예: 연락 회피 ▼ + 빠른 답장 ▲ = 연락/답장). 점수·판정은 옛 카드 그대로, 이어진 습관 할 일·루틴 단계·📌·방치 경보도 옮겨요. 옛 기록은 그대로 두고 통계·누적 배수·방치·🔢 횟수에 같이 셈. 고르기 창 맨 위 `합칠까요?`가 이름이 짝인 카드를 먼저 보여 줘요. ⇄ 합치기 풀기로 되돌림.',()=>{location.hash='edit'},'합치기 통합 카드 합치기 풀기 연락 답장 참음 짝 옵션 공간'],
  ['🌙 잠든 시각 ▲▼','홈 → 전투 카드 🛏 어젯밤 창 → 잠든 시각','23시 전 ▲ · 자정 전 ▲(조금) · 자정 넘으면 ▼(늦을수록 더). 일어난 날(오늘)로 기록돼요.',()=>{location.hash='home'},'늦게 잠 잠든 시각 23시 자정 일찍 잠']])}})(F67);
