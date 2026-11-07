/* ================= v6.9: 저장·동기화 바로잡기 · 기록 날짜 고르기 + ✍ 그날 기록 보너스 · 깜빡임·알림·한글 입력 =================
   맨 끝 모듈(v5y 뒤). 이 뒤에서 route();boot(); 를 불러요(예전엔 스크립트 중간에서 불러서 첫 화면이 옛 모양으로 그려졌다가 바뀌었어요).

   0) 진짜 원인: 설정(C)에 '배열 속 배열'(C.ui.home=[[id,켜짐,칸]], C.logLay59)이 있어 Firestore가 저장을 거절 → v4.1부터 설정이 서버에 한 번도 안 올라감.
      열 때마다 서버의 옛 설정 + 마이그레이션을 다시 돌려서: 지운 루틴 단계 되살아남 · '돌아보기로 묶었어요' 매번 · '이대로 둘게요' 안 먹음 · 기기끼리 다름.
      → backend.js가 enc/dec로 바꿔 담고(배열 속 배열 → {_na:[…]}), 여기서는:
   1) 쓰기 = 서버 것과 3방향 합치기(merge3, 트랜잭션). 마지막으로 본 서버 것(BASE69)을 기준으로 내가 바꾼 것만 얹어요 → 다른 기기 변경을 덮지 않음.
   2) 내가 쓴 것이 되돌아온 스냅샷·바뀐 게 없는 스냅샷은 다시 그리지 않음(깜빡임·'주기적 새로고침' 줄임).
   3) 저장이 계속 실패하면 화면 위에 빨간 띠(무엇이 왜 실패했는지). */
var BASE69={},ERR69={},BACK69={},SNAP69=null;
snapLoad=(function(prev){return function(){try{const x=JSON.parse(localStorage.getItem(SNAPK));SNAP69=x&&x.C?x.C:null}catch(e){SNAP69=null}return prev.apply(this,arguments)}})(snapLoad);
function isObj69(v){return !!v&&typeof v==='object'&&!Array.isArray(v)}
function deq69(a,b){
  if(a===b)return true;if(a==null||b==null)return a==b;
  if(typeof a!==typeof b)return false;
  if(Array.isArray(a)){if(!Array.isArray(b)||a.length!==b.length)return false;for(let i=0;i<a.length;i++)if(!deq69(a[i],b[i]))return false;return true}
  if(typeof a==='object'){if(Array.isArray(b))return false;const ka=Object.keys(a).filter(k=>a[k]!==undefined),kb=Object.keys(b).filter(k=>b[k]!==undefined);if(ka.length!==kb.length)return false;for(const k of ka)if(!(k in b)||!deq69(a[k],b[k]))return false;return true}
  return false}
function idArr69(a){if(!Array.isArray(a))return false;const s=new Set();for(const x of a){if(!isObj69(x)||typeof x.id!=='string'||!x.id||s.has(x.id))return false;s.add(x.id)}return true}
function prim69(a){return Array.isArray(a)&&a.every(x=>x==null||typeof x!=='object')}
// 3방향 합치기: b=마지막으로 본 서버 것, l=내 것, s=지금 서버 것. add=맨 위 숫자는 더하기(진행: XP·골드)
function merge3(b,l,s,add){
  if(deq69(l,b))return clone(s);if(deq69(s,b)||(!add&&deq69(l,s)))return clone(l);  // 더하기(진행)는 둘이 같아도 따로 더함
  if(isObj69(l)&&isObj69(s)){const bb=isObj69(b)?b:{},o={};const ks=new Set([...Object.keys(s),...Object.keys(l)]);
    ks.forEach(k=>{const hb=bb[k]!==undefined,hl=l[k]!==undefined,hs=s[k]!==undefined;
      if(hl&&hs)o[k]=merge3(bb[k],l[k],s[k],add&&typeof l[k]==='number');
      else if(hl){if(!hb||!deq69(l[k],bb[k]))o[k]=clone(l[k])}          // 서버에서 지웠고 나는 안 바꿈 → 지움
      else if(hs){if(!hb||!deq69(s[k],bb[k]))o[k]=clone(s[k])}});       // 내가 지웠고 서버는 안 바꿈 → 지움
    return o}
  if(Array.isArray(l)&&Array.isArray(s)){const ba=Array.isArray(b)?b:[];
    if(idArr69(l)&&idArr69(s)&&(!ba.length||idArr69(ba)))return mergeIds69(ba,l,s);
    if(prim69(l)&&prim69(s)&&prim69(ba)){ // 개수 합치기(구슬처럼): 서버 + (내 것 − 기준)
      const cnt=a=>{const m=new Map();a.forEach(x=>{const k=JSON.stringify(x);m.set(k,(m.get(k)||0)+1)});return m};
      const cb=cnt(ba),cl=cnt(l),cs=cnt(s),want=new Map();new Set([...cl.keys(),...cs.keys()]).forEach(k=>want.set(k,Math.max(0,(cs.get(k)||0)+(cl.get(k)||0)-(cb.get(k)||0))));
      const out=[];const take=a=>a.forEach(x=>{const k=JSON.stringify(x);if((want.get(k)||0)>0){out.push(x);want.set(k,want.get(k)-1)}});take(s);take(l);return out}
    return clone(l)}
  if(add&&typeof l==='number'&&typeof s==='number'&&(b==null||typeof b==='number'))return s+(l-(b||0));
  return clone(l)}
function mergeIds69(b,l,s){
  const B=new Map(b.map(x=>[x.id,x])),L=new Map(l.map(x=>[x.id,x])),S=new Map(s.map(x=>[x.id,x]));
  const ord=a=>a.map(x=>x.id);const inAll=(a,m)=>a.filter(id=>m.has(id));
  const sameOrder=(x,y)=>{const p=inAll(ord(x),new Map(y.map(z=>[z.id,1]))),q=inAll(ord(y),new Map(x.map(z=>[z.id,1])));return p.join('\u0001')===q.join('\u0001')};
  const prim=sameOrder(b,s)?l:s,other=prim===l?s:l;
  const item=id=>{const hb=B.has(id),hl=L.has(id),hs=S.has(id);
    if(hl&&hs)return merge3(B.get(id),L.get(id),S.get(id));
    if(hl){if(hb&&deq69(L.get(id),B.get(id)))return null;return clone(L.get(id))}
    if(hs){if(hb&&deq69(S.get(id),B.get(id)))return null;return clone(S.get(id))}return null};
  const out=[],seen=new Set();
  prim.forEach(x=>{seen.add(x.id);const v=item(x.id);if(v)out.push(v)});
  other.forEach((x,i)=>{if(seen.has(x.id))return;seen.add(x.id);const v=item(x.id);if(!v)return;
    let at=0;for(let j=i-1;j>=0;j--){const k=out.findIndex(y=>y.id===other[j].id);if(k>=0){at=k+1;break}}out.splice(at,0,v)});
  return out}
// 설정이 너무 크면(1MB 한도) 예전 정리 백업부터 덜어요
function slim69(){try{let n=JSON.stringify(C).length;if(n<700000)return;for(const k of ['bak64','scoreBak','lcolBak68','bak65']){if(C[k]!=null){delete C[k];n=JSON.stringify(C).length;if(n<700000)break}}if(n>950000)err69('config',{code:'too-big',message:Math.round(n/1024)+'KB'})}catch(e){}}
function adopt69(n,d){
  if(n==='config'){C=normConfig(d)}
  else if(n==='progress'){P=normProgress(d)}
  else if(n.startsWith('t:')){const id=n.slice(2);if(d==null){delete TASKS[id]}else{const t=clone(d);t.id=id;TASKS[id]=t}}
  else if(n!=='local'){DAYS[n]=normDay(n,d)}}
var ERRK69={'invalid-argument':'저장할 수 없는 모양의 기록','permission-denied':'저장 권한 없음(로그인 확인)','too-big':'설정이 너무 커요','resource-exhausted':'오늘 저장 한도에 닿았어요'};
function err69(n,e){ERR69[n]={code:(e&&e.code)||'?',msg:String((e&&e.message)||e||'').slice(0,160),at:Date.now()};errBar69()}
function errBar69(){let el=$('err69');const ks=Object.keys(ERR69);if(!ks.length){if(el)el.remove();return}
  if(!el){el=document.createElement('div');el.id='err69';el.setAttribute('role','alert');document.body.appendChild(el)}
  const e=ERR69[ks[0]];el.innerHTML=`<b>⚠ 저장 안 됨</b> <span>${esc(ERRK69[e.code]||e.code)} · ${esc(ks.map(k=>k==='config'?'설정':k==='progress'?'진행':k.startsWith('t:')?'할 일':k).filter((x,i,a)=>a.indexOf(x)===i).join(', '))}</span> <button type="button" data-err69="retry">다시 시도</button><button type="button" data-err69="x" aria-label="닫기">×</button><small>${esc(e.msg)}</small>`}
addEventListener('click',e=>{const b=e.target.closest('[data-err69]');if(!b)return;const k=b.dataset.err69;const ks=Object.keys(ERR69);ERR69={};errBar69();if(k==='retry')ks.forEach(n=>{BACK69[n]=0;save(n)})},true);
const TRANS69=['unavailable','aborted','deadline-exceeded','failed-precondition','cancelled','unknown','internal'];
async function flush(n){
  if(mode==='local'){dirty.delete(n);try{localStorage.setItem(LKEY,JSON.stringify({C,P,DAYS,TASKS}))}catch(e){}return}
  if(mode!=='db')return;
  if(n==='config'&&!SRV59.c){timers[n]=setTimeout(()=>flush(n),700);return}
  if(writing[n]){timers[n]=setTimeout(()=>flush(n),300);return}
  if(n==='config'){slim69();C.v69=1}
  const body=bodyOf(n);if(!body){dirty.delete(n);return}
  writing[n]=true;const r=rev[n],mine=clone(body),base=BASE69[n],isT=n.startsWith('t:');
  try{
    const ref=db.doc(docPath(n));let res;
    if(ref.merge&&navigator.onLine!==false){
      const out=await ref.merge(cur=>{if(cur==null)return (base!=null&&isT)?undefined:mine;const m=merge3(base===undefined?null:base,mine,cur,n==='progress');if(m&&Array.isArray(m.entries)){const q=new Set();m.entries=m.entries.filter(e=>{if(!e||e.kind!=='quest'||(+e.xp||0)||(+e.gold||0))return true;const k=e.qid;if(q.has(k))return false;q.add(k);return true})}return m/* 기준이 없으면(그 사이 다른 기기가 처음 만든 문서) 빈 것을 기준으로 합침 */});
      if(out&&out.skip){ // 다른 기기에서 지운 할 일 → 되살리지 않음
        BASE69[n]=null;if(rev[n]===r){dirty.delete(n);if(isT){delete TASKS[n.slice(2)];render()}}return}
      res=out?out.data:mine;
    }else{await ref.set(mine);res=mine}
    BASE69[n]=clone(res);delete ERR69[n];BACK69[n]=0;errBar69();
    if(!deq69(res,mine)){ // 그 사이 서버(다른 기기)에 바뀐 게 있었음 → 내 화면에도 합쳐 넣기
      const now=bodyOf(n);adopt69(n,now&&rev[n]!==r?merge3(mine,clone(now),res):res);render()}
    if(rev[n]===r)dirty.delete(n);else timers[n]=setTimeout(()=>flush(n),200);
    setSync('저장됨 · 모든 기기에서 같은 기록')}
  catch(e){const code=e&&e.code;
    if((!code||TRANS69.includes(code))&&(BACK69[n]||0)>=4000){ // 합치기가 두 번 넘게 안 되면(연결 불안정) 기기 사본에 쓰고 연결되면 올라가게 — 앱을 닫아도 안 사라져요
      try{await db.doc(docPath(n)).set(mine);BASE69[n]=clone(mine);BACK69[n]=0;if(rev[n]===r)dirty.delete(n);setSync('이 기기에 저장 · 연결되면 올라가요');return}catch(e2){}}
    if(!code||TRANS69.includes(code)){const w=BACK69[n]=Math.min(30000,(BACK69[n]||1000)*2);setSync('저장 대기 중 · 연결되면 올려요');timers[n]=setTimeout(()=>flush(n),w);if(w>=16000)err69(n,e)}
    else{console.error('저장 실패',n,e);err69(n,e);setSync('저장이 안 됐어요 · 위의 빨간 띠를 봐요')}}
  finally{writing[n]=false}
}
async function boot(){
  if(!snapLoad())document.body.classList.add('booting');
  render();
  let d=null;
  try{d=window.claude&&window.claude.use?await window.claude.use('db'):null}catch(e){d=null}
  const afterLoad=()=>{
    if(rawCfgV!==null&&rawCfgV<8){save('config');}
    if(C._pendingTasks){const ps=C._pendingTasks;delete C._pendingTasks;ps.forEach(p=>saveTask(newTask({...p,due:dateKey()})));save('config')}
    ['v54news','v53news','v51news','v5news'].forEach(k=>{if(C[k]){delete C[k];save('config')}});
    runLater();
    if(rawProgHasMarbles===false){save('progress');}
    rawCfgV=8;rawProgHasMarbles=true;
  };
  if(!d){
    mode='local';
    try{const s=JSON.parse(localStorage.getItem(LKEY));if(s){C=normConfig(s.C);P=normProgress(s.P);for(const k in (s.DAYS||{}))DAYS[k]=normDay(k,s.DAYS[k]);TASKS=s.TASKS||{}}}catch(e){}
    tasksReady=true;ready=true;setSync('이 기기에만 저장 중');afterLoad();render();return}
  db=d;mode='db';
  let rq=0;const rr=()=>{if(rq)return;rq=requestAnimationFrame(()=>{rq=0;render()})}; // 한 번에 여러 스냅샷이 와도 한 번만 그림
  const seen=new Set();const mark=(k,srv)=>{if(srv===false)return false;seen.add(k);if(seen.size>=3&&!ready){ready=true;setSync('저장됨 · 모든 기기에서 같은 기록');afterLoad();return true}return false};
  setTimeout(()=>{if(!ready){ready=true;setSync('연결이 느려요 · 기록은 저장돼요');afterLoad();render()}},8000);
  const same=(n,raw)=>BASE69[n]!==undefined&&deq69(raw,BASE69[n]);
  db.doc('game/config').onSnapshot(s=>{const srv=!(s.metadata&&s.metadata.fromCache);let ch=false;
    const raw=s.exists?s.data():null;
    if(srv&&!SRV59.c){SRV59.c=1;if(dirty.has('config')){dirty.delete('config');clearTimeout(timers.config);ch=true}
      // 처음 고친 버전으로 열 때: 서버엔 v4.1 전 옛 설정뿐이니, 이 기기에 남은 마지막 화면 사본(지난번 고친 것 포함)으로 시작
      if(SNAP69&&!(raw&&raw.v69)){const sc=SNAP69;SNAP69=null;BASE69.config=raw?clone(raw):null;if(rawCfgV===null||!SRV59.cv){rawCfgV=8;SRV59.cv=1}C=normConfig(sc);C.v69=1;save('config');
        later(()=>toast('설정 저장을 고쳤어요 · 이 기기의 마지막 설정으로 시작해요',4200));if(mark('c',srv)||1)rr();return}}
    SNAP69=null;
    if(rawCfgV===null||srv&&!SRV59.cv){rawCfgV=raw?(+raw.v||0):4;if(srv)SRV59.cv=1}
    if(!srv&&SNAP69&&!(raw&&raw.v69)){if(mark('c',srv))rr();return}  // 서버 확인 전 옛 기기 사본: 마지막 화면 사본을 그대로 둠
    if(!dirty.has('config')&&!writing.config&&(ch||!same('config',raw))){BASE69.config=raw?clone(raw):null;C=normConfig(raw);ch=true}
    if(mark('c',srv)||ch)rr()},()=>{SRV59.c=1;mark('c')},{meta:1});
  db.doc('game/progress').onSnapshot(s=>{const srv=!(s.metadata&&s.metadata.fromCache);let ch=false;const raw=s.exists?s.data():null;
    if(rawProgHasMarbles===null)rawProgHasMarbles=!raw||!!raw.marbles;
    if(!dirty.has('progress')&&!writing.progress&&!same('progress',raw)){BASE69.progress=raw?clone(raw):null;P=normProgress(raw);ch=true}
    if(mark('p',srv)||ch)rr()},()=>mark('p'),{meta:1});
  db.collection('days').orderBy('date','desc').limit(400).onSnapshot(s=>{let ch=false;
    s.docs.forEach(doc=>{const id=doc.id;if(dirty.has(id)||writing[id])return;const raw=doc.data();if(same(id,raw)&&DAYS[id])return;BASE69[id]=clone(raw);DAYS[id]=normDay(id,raw);ch=true});
    if(mark('d',!(s.metadata&&s.metadata.fromCache))||ch)rr()},()=>mark('d'),{meta:1});
  const tsnap=(kind,s)=>{const now=new Set();let ch=false;
    s.docs.forEach(doc=>{const id=doc.id;now.add(id);const n='t:'+id;if(dirty.has(n)||writing[n])return;const raw=doc.data();if(same(n,raw)&&TASKS[id])return;BASE69[n]=clone(raw);const t=clone(raw);t.id=id;TASKS[id]=t;ch=true});
    const other=kind==='open'?tSets.recent:tSets.open;tSets[kind].forEach(id=>{if(!now.has(id)&&!other.has(id)&&!dirty.has('t:'+id)){delete TASKS[id];ch=true}});tSets[kind]=now;
    if(kind==='open'&&!tasksReady){tasksReady=true;ch=true}
    if(ch)rr()};
  db.collection('tasks').where('status','==',0).onSnapshot(s=>{if(!(s.metadata&&s.metadata.fromCache)&&!TSRV64){TSRV64=true;rr()}tsnap('open',s)},e=>{console.error(e);tasksReady=true;render()},{meta:1});
  db.collection('tasks').where('doneAt','>=',addDays(dateKey(),-60)).onSnapshot(s=>{if(!(s.metadata&&s.metadata.fromCache)&&!TSRV64r){TSRV64r=true;rr()}tsnap('recent',s)},e=>{console.error(e);TSRV64r=true},{meta:1});
}
// 지운 할 일: 기준도 지움
deleteTask=(function(prev){return function(id){try{delete BASE69['t:'+id]}catch(e){}return prev.apply(this,arguments)}})(deleteTask);
// 처음 한 번 '돌아보기로 묶기'는 알림 없이 (예전엔 설정이 저장이 안 돼서 열 때마다 알림이 떴어요)
function mig59(){if(!ready||C.mig59)return;if(mode==='db'&&!SRV59.c)return;C.mig59=1;
  if(C.nav59==null){const h=C.ui.home.find(x=>x[0]==='jars');C.nav59='new';if(h&&!h[1]){C.nav59j=1;h[1]=1}}save('config')}
// 겹친 것 정리 안내: '이대로 둘게요'를 누른 날은 다시 안 띄움
{const kept=()=>C.heal69ok===dateKey();
 routinesEditHTML=(function(prev){return function(){if(kept()&&C.bak65){const b=C.bak65;delete C.bak65;try{return prev.apply(this,arguments)}finally{C.bak65=b}}return prev.apply(this,arguments)}})(routinesEditHTML);
 addEventListener('click',e=>{const b=e.target.closest('[data-x65heal="keep"],[data-x64undo="keep"]');if(!b)return;C.heal69ok=dateKey();save('config')},true);
 if(typeof heal65==='function'){heal65=(function(prev){return function(){if(kept())heal65.told=1;return prev.apply(this,arguments)}})(heal65);}}

/* ---- 4) 한글 입력: 글자를 조합하는 중에는 화면을 다시 그리지 않게 (ㄷㅗㄱㅅㅓ 되던 것) ----
   전역 막기는 스크립트 맨 앞(patch21)에 있어요. 고르기 창은 목록만 다시 그려서 입력칸을 그대로 둬요. */
drawPk61=(function(prev){return function(focus){const el=$('pk61'),old=el&&el.querySelector('#pk61q'),box=el&&el.querySelector('.pk61box');
  if(focus||!old||!box||document.activeElement!==old)return prev.apply(this,arguments);
  // 새로 그린 것을 따로 받아서, 입력칸만 빼고 바꿔 끼워요(조합 중인 글자가 안 깨지게)
  el.id='pk61live';const tmp=document.createElement('div');tmp.id='pk61';tmp.hidden=true;document.body.appendChild(tmp);
  try{prev.apply(this,arguments)}finally{tmp.remove();el.id='pk61'}
  const nb=tmp.querySelector('.pk61box');if(!nb)return;const oc=[...box.children],nc=[...nb.children];
  if(oc.length!==nc.length||oc.findIndex(c=>c===old)!==nc.findIndex(c=>c.id==='pk61q')){el.innerHTML='';el.appendChild(nb);const i=$('pk61q');if(i){i.focus();i.setSelectionRange(i.value.length,i.value.length)}return}
  nc.forEach((c,i)=>{if(oc[i]===old)return;oc[i].replaceWith(c)})}})(drawPk61);

/* ---- 5) 기록 날짜 고르기 ----
   어디서 기록하든(행동 창·할 일·루틴 체크·몸무게·스낵바) 날짜를 고를 수 있어요. 지난 날 기록은 그날 일에 들어가요.
   ✍ 그날 기록 보너스: 그날 한 걸 그날 적으면 ✨+2 (하루 최대 ✨20). 나쁜 행동도 그날 솔직하게 적으면 받아요. */
function otbCfg69(){const o=C.otb69||{};return{on:o.on!==false,xp:o.xp==null?2:+o.xp,max:o.max==null?20:+o.max}}
var OTBK69=['act','task','courage','routine','free','happy','weigh','jar','start65'];
applyEntry=(function(prev){return function(day,e){
  try{const o=otbCfg69();if(o.on&&o.xp>0&&e&&!e.id&&!e.otb69&&OTBK69.includes(e.kind)&&!e.an66&&day&&day.date===dateKey()&&!e.late){
    const used=(day.entries||[]).reduce((s,x)=>s+(+x.otb69||0),0),g=Math.min(o.xp,o.max-used);if(g>0){e.otb69=g;e.xp=(+e.xp||0)+g}}}catch(x){}
  return prev.apply(this,arguments)}})(applyEntry);
replaceEntry=(function(prev){return function(date,old,neu){try{if(old&&neu&&old.otb69&&!neu.otb69){neu.otb69=old.otb69;neu.xp=(+neu.xp||0)+old.otb69}}catch(e){}return prev.apply(this,arguments)}})(replaceEntry);
function d69lbl(k){const o=diffDays(dateKey(),k);return o===0?'오늘':o===1?'어제':o===2?'그저께':`${+k.slice(5,7)}/${+k.slice(8)}(${wdOf(k)})`}
function dayRow69(cur,attr){const td=dateKey();const ch=[0,1,2].map(o=>{const k=addDays(td,-o);return `<button type="button" class="chipbtn" data-${attr}="${k}" aria-pressed="${cur===k}">${o===0?'오늘':o===1?'어제':'그저께'}</button>`}).join('');
  const far=diffDays(td,cur)>2;
  return `<div class="d69"><span class="small muted">📅 언제?</span>${ch}<label class="chipbtn d69p" aria-pressed="${far}">📅 ${far?esc(d69lbl(cur)):'날짜'}<input type="date" data-${attr}in="1" max="${td}" value="${cur}" aria-label="날짜 고르기"></label>${cur===td?(otbCfg69().on?'<span class="tiny muted">✍ 오늘 적으면 ✨+'+otbCfg69().xp+'</span>':''):'<span class="tiny warn69">지난 날 기록 (그날 기록 보너스 없음)</span>'}</div>`}
// 완료 창(행동·할 일) · 기록 고치기 창
drawDoneSheet=(function(prev){return function(){const S=sheetCtx;const x=prev.apply(this,arguments);
  try{if(S&&(S.a||S.t||S.e)){if(!S.d69)S.d69=S.e?S.edit.date:curDay().date;const sh=$('sheetC').querySelector('.sh');if(sh){const w=document.createElement('div');w.innerHTML=dayRow69(S.d69,'d69');sh.after(w.firstChild)}}}catch(e){console.error(e)}
  return x}})(drawDoneSheet);
function d69Set(k){const S=sheetCtx;if(!S||!k)return;if(k>dateKey())k=dateKey();sheetRead();S.d69=k;drawDoneSheet()}
addEventListener('click',e=>{const b=e.target.closest('[data-d69]');if(!b)return;e.preventDefault();e.stopPropagation();d69Set(b.dataset.d69)},true);
addEventListener('change',e=>{const i=e.target;if(!i.dataset)return;if(i.dataset.d69in){e.stopPropagation();d69Set(i.value)}else if(i.dataset.rd69in){e.stopPropagation();rd69Set(i.value)}else if(i.dataset.mv69in){e.stopPropagation();mv69Go(i.value)}else if(i.id==='off69'){e.stopPropagation();const v=i.value;if(v&&v<=dateKey()){ui.off=Math.max(0,diffDays(dateKey(),v));render()}}},true);
function withDay69(k,fn){const keep=ui.off;ui.off=Math.max(0,diffDays(dateKey(),k||dateKey()));try{return fn()}finally{ui.off=keep}}
sheetOK=(function(prev){return function(){const S=sheetCtx;const k=S&&S.d69;if(!k||k===curDay().date)return prev.apply(this,arguments);
  const r=withDay69(k,()=>prev.apply(this,arguments));render();toast(`${d69lbl(k)} 기록으로 넣었어요`);return r}})(sheetOK);
sheetSave=(function(prev){return function(){const S=sheetCtx;const from=S&&S.edit&&S.edit.date,to=S&&S.d69,id=S&&S.edit&&S.edit.id;const r=prev.apply(this,arguments);
  if(from&&to&&to!==from)setTimeout(()=>moveEntry69(from,id,to),0);return r}})(sheetSave);
// 기록 옮기기 (점수 합계는 그대로, 그날 기록 보너스만 빠짐)
function moveEntry69(from,id,to){
  if(!from||!to||from===to)return;if(to>dateKey())to=dateKey();const d0=DAYS[from],e=d0&&d0.entries.find(x=>x.id===id);if(!e)return;
  withDay69(to,()=>commit(()=>{
    d0.entries=d0.entries.filter(x=>x!==e);
    if(e.otb69){P.xp=Math.max(0,P.xp-e.otb69);e.xp=(+e.xp||0)-e.otb69;delete e.otb69}
    const d1=dayOf(to);
    if(e.kind==='weigh'){const w=d0.weight;d0.weight=null;const old=d1.entries.find(x=>x.kind==='weigh');if(old)unapplyEntry(d1,old);d1.weight=w}
    if(to!==dateKey())e.late=true;else delete e.late;e.moved69=from;
    d1.entries.unshift(e);d1.entries.sort((a,b)=>String(b.t||'').localeCompare(String(a.t||'')));
    try{syncQuests(d0)}catch(x){}
    if(e.tid){const t=TASKS[e.tid];if(t){if(t.doneAt===from)t.doneAt=to;if(t.last===from&&!d0.entries.some(x=>x.tid===t.id))t.last=to>(t.last||'')?to:t.last;saveTask(t)}}
  },[from,to]));
  render();toast(`${d69lbl(to)} 기록으로 옮겼어요`)}
// 스낵바: 📅 날짜 바꾸기
snack=(function(prev){return function(e,date){const r=prev.apply(this,arguments);try{const s=$('snack');if(e&&e.otb69){const m=s.querySelector('.m');if(m)m.insertAdjacentHTML('beforeend',` <span class="otb69">✍+${e.otb69}</span>`)}
  const u=s.querySelector('[data-snack="undo"]');if(u&&!s.querySelector('[data-snack="d69"]'))u.insertAdjacentHTML('beforebegin','<button data-snack="d69" title="다른 날 한 걸로 옮겨요">📅 날짜</button>')}catch(x){}return r}})(snack);
addEventListener('click',e=>{const b=e.target.closest('#snack [data-snack="d69"]');if(!b||!snackRef)return;e.preventDefault();e.stopImmediatePropagation();$('snack').hidden=true;mvSheet69(snackRef.date,snackRef.id)},true);
var MV69=null;
function mvSheet69(date,id){const d=DAYS[date],e=d&&d.entries.find(x=>x.id===id);if(!e)return;MV69={date,id};sheetCtx={mv69:1};
  openSheet(`<div class="sh"><h3>📅 언제 한 일인가요?</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <p class="small" style="margin:0 0 8px"><b>${esc(e.name)}</b> <span class="muted">· 지금 ${esc(d69lbl(date))} 기록</span></p>${dayRow69(date,'mv69')}
    <p class="help" style="margin:8px 0 0">고르면 바로 그날 기록으로 옮겨요. 점수는 그대로고, 그날 기록 보너스(✍)만 빠져요.</p>`)}
function mv69Go(k){if(!MV69||!k)return;const{date,id}=MV69;MV69=null;closeSheet();moveEntry69(date,id,k)}
addEventListener('click',e=>{const b=e.target.closest('[data-mv69]');if(!b)return;e.preventDefault();e.stopPropagation();mv69Go(b.dataset.mv69)},true);
// 몸무게: 날짜 받기
function wSave63(v,k){
  v=parseFloat(v);if(!(v>=30&&v<=250)){toast('30~250 사이로 적어요');return false}if(!guard())return false;
  k=k||dateKey();withDay69(k,()=>commit(()=>{const day=curDay();day.weight=+v.toFixed(1);const w=day.entries.find(x=>x.kind==='weigh');if(w)w.name='몸무게 '+day.weight+'kg';else applyEntry(day,{kind:'weigh',type:'good',name:'몸무게 '+day.weight+'kg',xp:+C.weight.xp||0,gold:0})}));
  wSync63();return true}
// 루틴 체크 창: 날짜 고르기
var RD69=null;
function stOn69(t,k){if(!t)return false;if(k===dateKey())return stDone62(t);const d=DAYS[k];return !!(d&&(d.entries||[]).some(e=>e.tid===t.id))}
function rd69Set(k){if(!k)return;if(k>dateKey())k=dateKey();RD69=k;const r=(C.routines||[]).find(x=>x.id===(sheetCtx||{}).rt64);if(r)rtDone64(r,true)}
addEventListener('click',e=>{const b=e.target.closest('[data-rd69]');if(!b)return;e.preventDefault();e.stopPropagation();rd69Set(b.dataset.rd69)},true);
function rtDone64(r,keepDay){
  if(!r)return;if(!keepDay)RD69=curDay().date;const D=RD69||dateKey(),isT=D===dateKey(),lbl=isT?'오늘':d69lbl(D);
  sync62(r);const head=rtH62(r,false),day=DAYS[D];
  const st=(r.steps||[]).filter(s=>TASKS[s.tid]),full=day&&(day.entries||[]).some(e=>e.kind==='routine'&&e.rid===r.id&&e.full);
  sheetCtx={rt64:r.id};
  const row=(s,i)=>{const t=TASKS[s.tid],w=s.aid==='@weigh',dn=w?!!(day&&day.weight):stOn69(t,D),p=stPts62(s);
    return `<label class="d64r ${dn?'ok':''}"><input type="checkbox" data-d64="${s.tid}" ${dn?'checked disabled':'checked'}><span class="no">${dn?'✓':i+1}</span><span class="nm">${esc(stName61(s))}${dn?` <small class="muted">${esc(lbl)} 함</small>`:''}</span>
      ${w&&!dn?`<input class="w64" type="number" step="0.1" min="30" max="250" inputmode="decimal" placeholder="kg" value="${day&&day.weight?day.weight:''}" aria-label="몸무게">`:''}<span class="tiny muted pt">${pts62(p,{zero:''})}</span></label>`};
  openSheet(`<div class="sh"><h3>✓ ${esc(r.name)}</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>${dayRow69(D,'rd69')}
    <p class="help" style="margin:0 0 8px">타이머 없이 한 걸 체크해요. 체크한 단계 점수가 들어가고, <b>모든 단계를 하면 완주 보너스</b> ${pts62({xp:r.xp,gold:r.gold},{zero:'0'})}도 받아요.${full?` <b>${esc(lbl)}은 이미 완주했어요</b>(보너스는 하루 한 번).`:''}</p>
    <div class="row" style="gap:6px;margin-bottom:6px"><button type="button" class="chipbtn" data-d64all="1">모두 체크</button><button type="button" class="chipbtn" data-d64all="0">모두 해제</button><span style="flex:1"></span><span class="tiny muted">${st.filter(s=>s.aid==='@weigh'?!!(day&&day.weight):stOn69(TASKS[s.tid],D)).length}/${st.length} ${esc(lbl)} 함</span></div>
    <div class="d64s">${st.map(row).join('')||'<div class="empty">단계가 없어요</div>'}</div>
    <div class="row" style="gap:6px;margin-top:10px;flex-wrap:wrap"><button class="btn go" data-d64go="${r.id}">✓ 체크한 것 기록</button>${isT?`<button class="btn ghost" data-rrun="${r.id}">⏱ 타이머로 하기</button>`:''}<span style="flex:1"></span>${head?`<button class="btn ghost sm" data-x60task="${head.id}">✎ 루틴 열기</button>`:''}</div>`)}
function rtDoneGo64(r){
  if(!guard())return;const D=RD69||dateKey(),td=dateKey();const box=$('sheetC');let did=0,got={xp:0,gold:0};
  const sel=[...box.querySelectorAll('[data-d64]')].filter(c=>c.checked&&!c.disabled).map(c=>c.dataset.d64);
  const keep=ui.off;ui.off=Math.max(0,diffDays(td,D));
  try{
  sel.forEach(tid=>{const s=(r.steps||[]).find(x=>x.tid===tid),t=TASKS[tid];if(!s||!t)return;
    if(s.aid==='@weigh'){const v=(box.querySelector(`[data-d64="${tid}"]`).closest('.d64r').querySelector('.w64')||{}).value;if(v&&!wSave63(v,D))return;if(D>=(t.last||''))t.last=D;t.cnt=(t.cnt||0)+1;saveTask(t);did++;return}
    if(t.status!==0)return;const p=taskBase(t);got.xp+=+p.xp||0;got.gold+=+p.gold||0;const pl=t.last;
    completeTask(t,{direct:true});if(t.status===2){t.status=0;delete t.doneAt}t.last=pl&&pl>D?pl:D;saveTask(t);did++});
  const st=(r.steps||[]).filter(s=>TASKS[s.tid]),day=dayOf(D),all=st.length&&st.every(s=>s.aid==='@weigh'?!!day.weight:stOn69(TASKS[s.tid],D));
  const full=(day.entries||[]).some(e=>e.kind==='routine'&&e.rid===r.id&&e.full);
  let bonus=0;
  if(all&&!full){let xp=+r.xp||0;if(recoveryActive())xp=Math.round(xp*C.recovery.mult);
    const e={kind:'routine',type:'good',name:r.name+' 완주',area:r.area||'life',cond:0,xp,gold:+r.gold||0,rid:r.id,full:1,note:'타이머 없이 체크'};
    if(gachaMatch('routine',r.id)){e.xp=Math.round(e.xp*(C.gacha.mult||1.5));e.gq=1}
    commit(()=>applyEntry(day,e));try{afterGacha(e)}catch(x){}bonus=e.xp;
    const h=rtH62(r,false);if(h){if(h.rep&&h.rep.f){if(h.due&&h.due<=D){let nx=nextDue(h.rep,h.due);while(nx&&nx<=D)nx=nextDue(h.rep,nx);if(nx)h.due=nx}}else if(D===td)h.due=null;delete h.skull;if(D>=(h.last||''))h.last=D;h.cnt=(h.cnt||0)+1;saveTask(h)}}
  closeSheet();render();
  if(!did&&!bonus){toast('체크한 단계가 없어요');return}
  const lbl=D===td?'':d69lbl(D)+' · ';
  popup(all?'루틴 완주':'루틴 기록','✓',`<b>${esc(lbl+r.name)}</b> · ${did}단계 기록${got.xp?` · ✨${got.xp}`:''}${got.gold?` 💰${got.gold}`:''}<br>${bonus?`<b>완주 보너스 +${bonus} XP</b>`:all?'<span class="muted">이날 완주 보너스는 이미 받았어요</span>':`<span class="muted">남은 ${st.filter(s=>!stOn69(TASKS[s.tid],D)).length}단계를 마저 하면 완주 보너스</span>`}`,all?'완주':'수고했어요')
  }finally{ui.off=keep}}
// 기록하기 화면: 오늘·어제·그저께 + 📅 아무 날 · 지난 날이면 띠
render=(function(prev){return function(){const x=prev.apply(this,arguments);
  try{const dc=$('dayChips');if(dc&&!dc.querySelector('#off69')){const k=curDay().date,far=ui.off>2;
      dc.querySelector('.muted.num')?.insertAdjacentHTML('beforebegin',`<label class="chipbtn d69p" aria-pressed="${far}">📅 ${far?esc(d69lbl(k)):'다른 날'}<input type="date" id="off69" max="${dateKey()}" value="${k}" aria-label="기록할 날짜"></label>`)}
    if(ui.off>0){const lb=$('lateBar'),lt=$('logTitle'),k=curDay().date,l=d69lbl(k);if(lb)lb.innerHTML=`<div class="latebar">📅 <b>${esc(l)}</b>(${esc(k.slice(5).replace('-','/'))}) 기록을 적는 중이에요. 여기서 누르는 행동·식사·몸무게는 이날로 들어가요. <button class="chipbtn" data-off="0">오늘로</button></div>`;if(lt)lt.textContent=l+' 한 일'}}catch(e){}
  return x}})(render);

/* ---- 6) 새 버전: 쓰는 중에 갑자기 새로고침하지 않기 ----
   (예전엔 새 버전이 깔리면 바로 새로고침 → '앱이 주기적으로 새로고침되는 것'처럼 보였어요) 화면이 가려졌을 때나 버튼을 누를 때만. */
window.__swNew69=function(){if(document.hidden){location.reload();return}let b=$('upd69');if(!b){b=document.createElement('button');b.id='upd69';b.type='button';b.textContent='🆕 새 버전 · 눌러서 새로고침';b.onclick=()=>location.reload();document.body.appendChild(b)}
  const h=()=>{if(document.hidden){document.removeEventListener('visibilitychange',h);location.reload()}};document.addEventListener('visibilitychange',h)};

/* ---- 7) 안내·기능 지도 ---- */
F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['📅 지난 날 기록','기록하기 → 📅 다른 날 · 행동 창 · 루틴 체크 창 · 스낵바 📅','어제 한 일도 그날로 기록 · 그날 적으면 ✍ 보너스',()=>{location.hash='log'},'어제 날짜 지난 기록 늦게 그저께'],
  ['✍ 그날 기록 보너스','자동','그날 한 걸 그날 적으면 ✨+2 (하루 최대 ✨20) · 나쁜 행동도 솔직하게 적으면',()=>{location.hash='log'},'보너스 그날 기록 미루지']])}})(F67);

/* ---- 8) 빠르게: 한 번 그릴 때 같은 계산을 수백 번 하던 것 줄이기 ----
   (그리기 한 번 ≈ 87ms → 측정은 t69perf) 방치 경보(neglectList)가 날마다 400일을 거꾸로 훑었고, 통계 화면은 안 보여도 매번 다시 그렸어요. */
var NLC69=new Map(),DSC69=new Map();
function nlClear69(){NLC69.clear();DSC69.clear()}
function daysSince(id,date){
  const key=id+'|'+date;if(DSC69.has(key))return DSC69.get(key);
  const t=watchTarget(id);let r=0;
  if(t){let hit=-1;for(let i=0;i<=400;i++){const k=addDays(date,-i);if(DAYS[k]&&t.done(DAYS[k])){hit=i;break}}
    if(hit>=0)r=hit;else{const f=firstDataDate();r=(!f||f>date)?0:diffDays(date,f)}}
  DSC69.set(key,r);return r}
function neglectList(date){
  if(NLC69.has(date))return NLC69.get(date).map(x=>({...x}));
  const out=[];
  C.watches.forEach(w=>{const t=watchTarget(w.action);if(!t||!w.days)return;
    const s=daysSince(w.action,date);
    if(s>w.days){const over=s-w.days;out.push({w,t,since:s,pen:Math.round((+w.penalty||0)*Math.min(4,over))})}});
  out.sort((a,b)=>b.since-a.since);NLC69.set(date,out);return out.map(x=>({...x}))}
// 기록이 바뀌면 다시 계산
render=(function(prev){return function(){nlClear69();return prev.apply(this,arguments)}})(render);
applyEntry=(function(prev){return function(){nlClear69();return prev.apply(this,arguments)}})(applyEntry);
unapplyEntry=(function(prev){return function(){nlClear69();return prev.apply(this,arguments)}})(unapplyEntry);
commit=(function(prev){return function(){nlClear69();return prev.apply(this,arguments)}})(commit);
// 홈 두 칸 판단: 폭은 창 크기가 바뀔 때만 다시 잼 (매번 재면 화면 전체를 다시 계산해요)
var HT69=null;addEventListener('resize',()=>{HT69=null});addEventListener('hashchange',()=>{HT69=null});
function homeTwo(){const g=$('homeGrid');if(!g)return false;if(curView()!=='home')return HT69?HT69.r:(innerWidth>=960?innerWidth-260:innerWidth-32)>=760;if(HT69!=null&&HT69.v===innerWidth+'|'+document.body.className.includes('split'))return HT69.r;
  const w=g.clientWidth||(innerWidth>=960?innerWidth-260:innerWidth-32);if(g.clientWidth)HT69={v:innerWidth+'|'+document.body.className.includes('split'),r:w>=760};return w>=760}
// 테마: 바뀔 때만
var TH69='';
function applyTheme(){const r=document.documentElement,k=C.ui.skin+'|'+C.ui.mode;r.dataset.skin=C.ui.skin;if(C.ui.mode==='system')delete r.dataset.theme;else r.dataset.theme=C.ui.mode;
  if(k===TH69)return;TH69=k;const m=document.querySelector('meta[name="theme-color"]');if(m)m.content=getComputedStyle(r).getPropertyValue('--panel').trim()||'#ffffff'}
// 통계: 통계·여정 화면일 때만 그리고, 나중에 그 화면으로 가면 그때 그림
var ST69=true;
renderStats=(function(prev){return function(){const v=curView();if(v!=='stats'&&v!=='journey'&&ready){ST69=true;return}ST69=false;return prev.apply(this,arguments)}})(renderStats);
addEventListener('hashchange',()=>{const v=curView();if(ST69&&(v==='stats'||v==='journey'))try{renderStats()}catch(e){console.error(e)}});
