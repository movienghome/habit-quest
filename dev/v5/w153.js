/* ================= v13.33 (w153): 합친 카드 바로잡기 · 술·걷기 📏 · 겹친 목록 정리 (사용자 11/28) =================
   ① 같은 이름 카드 같이 합치기는 w151(직접 고침: sameNm153·optTwins153·twinOpt) — 사용자 '빠른 답장'이 세 장이라 하나만 합쳐져 둘이 남았음.
   ② 🛏 '수면 시간' 카드가 두 장(두 기기가 한 번짜리 이주 C.mig152sl을 거의 같이 돌림 → uid가 달라 둘 다 남음, 오늘 수면 점수도 두 번 들어감)
      → healSl153: 옛 카드(8시간 이상·6시간 미만)가 가리키는 쪽을 남기고, 다른 장의 자동 기록(e.sl141='q152')은 지움.
      손으로 적은 기록이 없으면 카드를 지우고, 있으면 남긴 카드로 합쳐 숨김(a.mg·a.dup153). 앞으로는 정해진 id 'sl152q'(w152).
   ③ 📌 빠른 기록 목록(C.pin133) 등 '모음' 목록이 두 기기 합치기에서 개수 합치기(구슬 방식)로 섞여 같은 칸이 두 번씩 → normConfig 뒤 겹친 것 지움.
   ④ 술(잔)·걷기(분)에 📏 양 기준(사용자 11/28 '알아서 잘') — 한 번짜리 `C.mig153q`, 알림 되돌리기. */
(function(){
const A=()=>C.actions||[];
const byId=id=>A().find(x=>x&&x.id===id)||null;
const ab=v=>Math.abs(+v||0);

/* ---------- ③ 모음 목록 겹침 지우기 ---------- */
const SETS=[['pin133'],['sgx152'],['wko130'],['calf77','known'],['calf77t','known'],['gear60','own']];
function uniq(a){const s=new Set(),o=[];a.forEach(x=>{const k=typeof x+':'+x;if(s.has(k))return;s.add(k);o.push(x)});return o}
function dedupe153(c){if(!c)return c;SETS.forEach(p=>{let o=c;for(let i=0;i<p.length-1;i++){o=o&&o[p[i]];if(!o||typeof o!=='object')return}
  const k=p[p.length-1],a=o[k];if(Array.isArray(a)&&a.every(x=>x==null||typeof x!=='object')){const u=uniq(a);if(u.length!==a.length)o[k]=u}});return c}
window.dedupe153=dedupe153;
{const _nc=normConfig;normConfig=function(){return dedupe153(_nc.apply(this,arguments))}}

/* ---------- ② 수면 시간 카드 두 장 → 한 장 ---------- */
function healSl153(){
  if(typeof ready72!=='function'||!ready72())return false;
  const vis=A().filter(a=>a&&a.sl152&&!a.doneAt&&!a.mg);if(vis.length<2)return false;
  const nsrc=a=>A().filter(x=>x&&x.mg===a.id).length;
  const keep=vis.slice().sort((x,y)=>(nsrc(y)-nsrc(x))||((y.id==='sl152q')-(x.id==='sl152q'))||(x.id<y.id?-1:1))[0];
  const td=gk76();let gone=0;
  vis.filter(a=>a!==keep).forEach(d=>{
    // 자동 기록 지우기(남긴 카드로 다시 들어감)
    let manual=0;Object.keys(DAYS).forEach(k=>{const es=((DAYS[k]||{}).entries||[]).filter(e=>e&&e.aid===d.id);
      es.forEach(e=>{if(e.sl141==='q152'){try{removeEntry(k,e.id)}catch(x){console.error(x)}}else manual++})});
    // 이 장을 가리키던 옛 카드 → 남긴 카드
    A().filter(x=>x&&x.mg===d.id).forEach(x=>{x.mg=keep.id;keep.mg151=keep.mg151||{src:[],at:td,mv:[]};if(!keep.mg151.src.includes(x.id))keep.mg151.src.push(x.id)});
    if(keep.mg151&&d.mg151)keep.mg151.src=keep.mg151.src.filter(id=>byId(id)&&byId(id).mg===keep.id);
    if(Array.isArray(C.pin133))C.pin133=uniq(C.pin133.map(id=>id===d.id?keep.id:id));
    (C.watches||[]).forEach(w=>{if(w.action===d.id)w.action=keep.id});
    Object.values(TASKS||{}).forEach(t=>{if(t&&t.aid===d.id){t.aid=keep.id;saveTask(t)}});
    if(!manual){C.actions=A().filter(x=>x!==d)}
    else{const m={'':'q6'};(d.opts||[]).forEach(o=>{if(o&&(keep.opts||[]).some(z=>z.id===o.id))m[o.id]=o.id});d.mgo=m;d.mg=keep.id;d.doneAt=td;d.dup153=1;delete d.mg151;delete d.sl152}
    gone++});
  save('config');
  setTimeout(()=>{try{if(DAYS[td]&&DAYS[td].sl102)sleepSync141(td);render()}catch(e){console.error(e)}},300);
  setTimeout(()=>toast(`🛏 '수면 시간' 카드가 ${gone+1}장 생겨 있어서 한 장으로 모았어요 (오늘 수면 점수가 두 번 들어가던 것도 바로잡음)`),1800);
  return true}
window.healSl153=healSl153;

/* ---------- ④ 술·걷기 📏 ---------- */
const hasQ=a=>(a.opts||[]).some(o=>o&&o.q);
function drinkCard(){return A().find(a=>a&&a.type==='bad'&&!a.doneAt&&!a.mg&&!hasQ(a)&&/^\s*(🍺|🍶|🍷)?\s*(술|음주)\s*$/.test(a.name||'')&&(a.opts||[]).length)||null}
function walkCard(){return A().find(a=>a&&a.type==='good'&&!a.doneAt&&!a.mg&&!a.mg151&&!hasQ(a)&&!(a.opts||[]).filter(Boolean).length&&/걷기/.test(a.name||''))||null}
const DQ=[[/한\s*잔/,{lo:null,hi:2}],[/본격/,{lo:2,hi:5}],[/과음/,{lo:5,hi:null}]];
function walkOpts(a){const c=ab(a.cond),x=ab(a.xp),g=ab(a.gold),sl=v=>v?Math.max(1,Math.round(v*0.4)):0,up=v=>v?Math.round(v*1.5):0;
  return [{id:'w0',name:'10분 미만',tp:'mid',cond:0,xp:0,gold:0,q:{lo:null,hi:10}},
    {id:'w1',name:'10~30분 (약간 좋음)',tp:'good',cond:sl(c),xp:sl(x),gold:sl(g),q:{lo:10,hi:30}},
    {id:'w2',name:'30분~1시간',tp:'good',cond:c,xp:x,gold:g,q:{lo:30,hi:60}},
    {id:'w3',name:'1시간 이상 (아주 좋음)',tp:'good',cond:up(c),xp:up(x),gold:up(g),q:{lo:60,hi:null}}]}
function migQ153(){
  if(C.mig153q||typeof ready72!=='function'||!ready72()||!Array.isArray(C.actions)||!C.actions.length)return false;
  C.mig153q=1;const done=[],snap=[];
  const d=drinkCard();
  if(d){const s0=clone(d);let hit=0;(d.opts||[]).forEach(o=>{if(!o)return;const m=DQ.find(([re])=>re.test(o.name||''));if(m){o.q=clone(m[1]);hit++}});
    if(hit){d.unit152='잔';snap.push(s0);done.push(`'${d.name}' 잔`)}}
  const w=walkCard();
  if(w){snap.push(clone(w));w.opts=walkOpts(w);w.unit152='분';done.push(`'${w.name}' 분`)}
  save('config');
  if(done.length)setTimeout(()=>toastAct(`📏 ${done.join(' · ')}에 양 기준을 넣었어요 — 기록 창 📏 칸에 숫자를 적으면 옵션이 골라져요`,'되돌리기',()=>{
    snap.forEach(s=>{const i=A().findIndex(x=>x.id===s.id);if(i>=0)C.actions[i]=s});save('config');render();toast('📏 술·걷기 양 기준을 뺐어요')},10000),2600);
  return true}
window.migQ153=migQ153;

render=(function(prev){return function(){const r=prev.apply(this,arguments);
  try{let ch=false;if(A().filter(a=>a&&a.sl152&&!a.doneAt&&!a.mg).length>1)ch=healSl153()||ch;if(!C.mig153q)ch=migQ153()||ch;
    if(ch)setTimeout(()=>{try{render()}catch(_){}},0)}catch(e){console.error(e)}return r}})(render);

F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['⇄ 같은 이름 카드 같이 합치기','편집 → 행동/습관 → 카드 메뉴 ⇄ 합치기 → 미리 보기','고른 카드와 이름이 같은 카드가 더 있으면 같이 합쳐서 한 옵션으로 모아요(빼기 가능). 합친 카드에도 같은 이름 카드가 남아 있으면 `합칠까요?`에 떠요.',()=>{location.hash='edit'},'합치기 같은 이름 중복 카드'],
  ['📏 최근 숫자','기록하기 → 📏 양 카드 □ → 기록 창 📏 얼마나? 칸 옆','최근에 적은 숫자 3개가 칩으로 보여요 — 누르면 채워지고 옵션이 골라져요. 분 단위 카드는 1:20처럼 적어도 80분.',()=>{location.hash='log'},'양 최근 숫자 칩 걷기 술 잔 분']])}})(F67);
})();
