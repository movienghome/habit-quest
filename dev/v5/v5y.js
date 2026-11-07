/* ================= v6.8: 목록 색 · 할 일/캘린더 '오늘'은 자정 · 영역 마일스톤 = 전용 장비 · 보스 약점 효과 · 처치 연출
   · 우클릭 메뉴 더(홈 칸·캘린더 날짜·빈 시간·보스) · 편집 화면 덜 가기(도파민·보스 규칙·카드 고르기) =================
   맨 끝 모듈(v5x 뒤). 최상위 값은 var/function. 첫 render가 이 모듈보다 먼저 돌 수 있어서 상수는 함수 안에. */

/* ---- 1) 할 일·캘린더의 '오늘'은 자정에 바뀜 (점수·HP·일퀘·기록 날짜는 그대로 새벽 5시) ----
   dateKey()를 부르는 쪽이 '할 일 쪽'이면 자정 기준. 습관·일퀘·루틴에 이어진 할 일은 점수 날짜(5시)를 따라요(그래야 일퀘·습관 칸과 어긋나지 않음). */
var MODE68=null;
function mid68On(){return !(typeof C!=='undefined'&&C&&C.taskMid68===false)}
function dateKey(off=0){const h=(MODE68==='mid'&&mid68On())?0:((typeof C!=='undefined'&&C&&C.dayStart)||0);const d=new Date(Date.now()-h*3600e3+off*864e5);return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())}
function midKey68(){const p=MODE68;MODE68='mid';try{return dateKey()}finally{MODE68=p}}
function gameT68(t){return !!(t&&(t.hab||t.quest||t.rid||t.rstep||t.qid))}
function dawn68(){if(!mid68On())return false;const h=new Date().getHours();return h<((C&&C.dayStart)||0)}
// 할 일을 받는 함수: 그 할 일에 따라 / 안 받는 함수: 바깥에서 정한 게 없으면 자정
function wT68(fn,pick){if(typeof fn!=='function'||fn.__w68)return fn;const w=function(){const p=MODE68;let t=null;try{t=pick?pick.apply(this,arguments):arguments[0]}catch(e){}
  if(t&&typeof t==='object'&&('title' in t||'hab' in t||'rid' in t||'due' in t))MODE68=gameT68(t)?'game':'mid';else if(!p)MODE68='mid';
  try{return fn.apply(this,arguments)}finally{MODE68=p}};w.__w68=1;return w}
(function(){const T=['taskMatches','dateBucket','taskRow','cchip','postpone','skipToday61','taskMenu61','mobKind61','split65','setRepPreset','newTask',
    'dueLabel','parseQuick','tsRead','renderCal','calState','renderTray','dndEnd','renderTasks','completedHTML','repFromText','bulk','bulkDrop','gachaPool','calAddDay','wait65','cal63add','dp63','calAddSheet','tsPolish'];
  T.forEach(n=>{try{const f=eval(n);if(typeof f!=='function')return;const w=n==='tsRead'||n==='tsPolish'?wT68(f,()=>TASKS[(sheetCtx||{}).task]):wT68(f);eval(n+'=w')}catch(e){}});
  try{drawTaskSheet=wT68(drawTaskSheet,()=>TASKS[(sheetCtx||{}).task])}catch(e){}})();
// 자정이 지나면 할 일·캘린더 다시 그림
var MK68=null;setInterval(()=>{try{if(!ready)return;const k=midKey68();if(MK68&&k!==MK68){ui.calAnchor=k;render()}MK68=k;const b=$('dawn68');if(b||dawn68())dawnBar68()}catch(e){}},30000);
// 새벽(0시~하루 시작)에 적은 기록 = 🌙 표시
function dawnE68(e){if(!e||!e.t)return false;const h=+String(e.t).split(':')[0];return h<((C&&C.dayStart)||0)}
logRow=(function(prev){return function(date,e){let r=prev.apply(this,arguments);try{if(dawnE68(e)&&e.kind!=='jar')r=r.replace(/(<span class="num muted">[^<]*)(<\/span>)/,`$1<span class="dawn68" title="새벽에 적음 — 하루는 ${C.dayStart}시에 바뀌어서 전날 몫이에요"> 🌙</span>$2`)}catch(x){}return r}})(logRow);
function dayName68(k){const d=new Date(k+'T12:00:00');return `${d.getMonth()+1}/${d.getDate()}(${'일월화수목금토'[d.getDay()]})`}
function dawnBar68(){const v=document.querySelector('.view[data-view="tasks"]');if(!v)return;let b=$('dawn68');
  if(!dawn68()||ui.dawnX68===dateKey()){if(b)b.remove();return}
  if(!b){b=document.createElement('div');b.id='dawn68';b.className='dawn68b';const L=$('tList');if(L&&L.parentElement)L.parentElement.insertBefore(b,L);else v.prepend(b)}
  const gk=dateKey(),mk=midKey68();
  b.innerHTML=`<span>🌙 <b>새벽이에요.</b> 할 일 '오늘'은 <b>${dayName68(mk)}</b>, 점수·HP·기록은 아직 <b>${dayName68(gk)}</b> 몫이에요(${C.dayStart}시에 넘어가요). 지금 끝낸 건 ${dayName68(gk)} '오늘 한 일'에 🌙 표시로 들어가요.</span><button class="x" data-dawn68x="1" aria-label="오늘은 그만 보기">×</button>`}
addEventListener('click',e=>{const b=e.target.closest('[data-dawn68x]');if(!b)return;e.preventDefault();e.stopPropagation();ui.dawnX68=dateKey();dawnBar68()},true);
completeTask=(function(prev){return function(t){const r=prev.apply(this,arguments);try{if(dawn68()&&t&&!gameT68(t)&&ui.dawnT68!==dateKey()){ui.dawnT68=dateKey();setTimeout(()=>toast(`🌙 새벽이라 ${dayName68(dateKey())} 기록으로 들어갔어요 (하루는 ${C.dayStart}시에 바뀌어요)`),1600)}}catch(x){}return r}})(completeTask);

/* ---- 2) 목록 색: 캘린더 창과 할 일 옆 캘린더가 같은 '색 기준'을 씀 + 할 일 줄에도 목록 색 ---- */
function calBase68(){try{return C.ui.toJSON?C.ui.toJSON().cal:C.ui.cal}catch(e){return null}}
function calColSync68(){const b=calBase68();if(b&&b._t&&b._t.color!==b.color)b._t.color=b.color}
addEventListener('change',e=>{if(!e.target||e.target.id!=='cal57Color')return;const b=calBase68();if(b){b.color=e.target.value;if(b._t)b._t.color=b.color}},true);
renderCal=(function(prev){return function(){try{calColSync68()}catch(e){}const x=prev.apply(this,arguments);try{
  if((C.ui.cal||{}).color==='list')document.querySelectorAll('#calPane [data-ctask]').forEach(el=>{const t=TASKS[el.dataset.ctask],l=t&&C.lists.find(z=>z.id===(t.list||'inbox'));if(!l||!l.color)return;el.style.borderLeft=`3px solid ${l.color}`;el.style.background=`color-mix(in srgb,${l.color} 16%,var(--panel))`;const s=el.querySelector('.ck57');if(s)s.style.borderColor=l.color})}catch(e){console.error(e)}return x}})(renderCal);
function rowCols68(){const sel=((C.ui.tasks||{}).sel)||'';const one=/^l:/.test(sel);
  document.querySelectorAll('.trow[data-task]').forEach(el=>{const t=TASKS[el.dataset.task],l=t&&C.lists.find(z=>z.id===(t.list||'inbox'));const c=l&&l.color;
    el.classList.toggle('lc68',!!c&&!(one&&el.closest('#tList')));if(c)el.style.setProperty('--lc68',c);else el.style.removeProperty('--lc68');if(c&&!el.title)el.title='목록: '+(l.name||'')})}
// 고를 수 있는 목록 색 더하기 (파랑 없음)
(function(){try{[['#7aa83a','연두'],['#e8956b','살구'],['#9b3a6e','자주'],['#8d8a3a','올리브']].forEach(c=>{if(!LCOL61.some(x=>x[0]===c[0]))LCOL61.push(c)})}catch(e){}})();
// 목록마다 색 정하기 (한 번). 이름으로 어울리는 색, 겹치면 다음 색. 예전 색은 C.lcolBak68에 두고 되돌리기.
function lcolPlan68(){const R=[[/fixed|고정|일정|약속/,'#d64545'],[/atelier|작품|작업|창작|시나리오|영화/,'#e07a10'],[/project|프로젝트/,'#8a5cc7'],[/personal|개인|볼일|errand|잡무/,'#8a6a4a'],[/limen|경계|eos|vesper|lethe/,'#c9a227'],
    [/습관|habit/,'#3f9a4a'],[/루틴|routine/,'#d14f92'],[/inbox|기본/,'#7d8594'],[/공부|독서|책|성장|study/,'#7aa83a'],[/집|생활|살림|home/,'#e8956b'],[/돈|경제|가계|money/,'#8d8a3a'],[/사람|모임|관계|친구/,'#9b3a6e']];
  const PAL=LCOL61.map(x=>x[0]).filter(Boolean),used=new Set(),out={};
  const ls=C.lists.slice().sort((a,b)=>(a.id==='Lhabit'||a.id==='Lrt')-(b.id==='Lhabit'||b.id==='Lrt'));
  const want=l=>{if(l.id==='Lhabit')return '#3f9a4a';if(l.id==='Lrt')return '#d14f92';const n=lnorm(l.name)+' '+String(l.id||'').toLowerCase();const m=R.find(([re])=>re.test(n));return m?m[1]:null};
  ls.forEach(l=>{const w=want(l);if(w&&!used.has(w)){out[l.id]=w;used.add(w)}});
  ls.forEach(l=>{if(out[l.id])return;const c=PAL.find(p=>!used.has(p))||PAL[Object.keys(out).length%PAL.length];out[l.id]=c;used.add(c)});return out}
function lcolMig68(){if(C.mig68col||!C.lists||!C.lists.length)return;const plan=lcolPlan68();C.lcolBak68={at:Date.now(),c:Object.fromEntries(C.lists.map(l=>[l.id,l.color||'']))};
  C.lists.forEach(l=>{if(plan[l.id])l.color=plan[l.id]});C.mig68col=1;const b=calBase68();if(b&&!b.color){b.color='list';if(b._t)b._t.color='list'}save('config');
  C.lcolSeen68=C.lists.map(l=>l.id);
  later(()=>toastAct('📂 목록마다 색을 정했어요 (캘린더·할 일 줄에 같이 보여요)','예전 색으로',lcolUndo68,9000))}
// 나중에 생긴 목록(⏱ 루틴·↻ 습관 등)도 처음 한 번은 색을 받음. '색 없음'으로 바꾸면 그대로 둠.
function lcolNew68(){if(!C.mig68col||!C.lists)return;const seen=new Set(C.lcolSeen68||[]),fresh=C.lists.filter(l=>!seen.has(l.id));if(!fresh.length)return;
  const plan=lcolPlan68(),used=new Set(C.lists.filter(l=>seen.has(l.id)).map(l=>l.color).filter(Boolean));
  fresh.forEach(l=>{if(!l.color){let c=plan[l.id];if(!c||used.has(c))c=LCOL61.map(x=>x[0]).filter(Boolean).find(p=>!used.has(p))||c;if(c){l.color=c;used.add(c)}}seen.add(l.id)});C.lcolSeen68=[...seen];save('config')}
function lcolUndo68(){const B=C.lcolBak68;if(!B)return;C.lists.forEach(l=>{if(l.id in B.c){if(B.c[l.id])l.color=B.c[l.id];else delete l.color}});save('config');render();toast('예전 색으로 돌렸어요')}

/* ---- 3) 영역 마일스톤 보상 = 그 영역 전용 장비 (Lv.3 방패·5 머리띠·10 망토·15 지팡이·20 배경, 25부터는 골드) ---- */
function amCol68(id,i){const M={body:'#d6584f',mind:'#9a6ad0',make:'#e0892e',grow:'#c9a227',life:'#5d9a4a',money:'#a8823c'};return M[id]||['#d14f92','#8a6a4a','#7aa83a','#e8956b','#9b3a6e','#8d8a3a'][i%6]}
function amLight68(hex,f){const n=parseInt(hex.slice(1),16),r=n>>16,g=n>>8&255,b=n&255,m=c=>Math.round(c+(255-c)*f);return '#'+[m(r),m(g),m(b)].map(v=>v.toString(16).padStart(2,'0')).join('')}
function amDefs68(){return [[3,'shield','문장 방패'],[5,'head','머리띠'],[10,'body','망토'],[15,'weapon','지팡이'],[20,'bg','들판']]}
function amItems68(){const out=[];(C.areas||[]).forEach((a,i)=>{const A=amCol68(a.id,i),W=amLight68(A,.75),nm=a.name||a.id;
  amDefs68().forEach(([lv,slot,kind])=>{const it={id:`am68-${a.id}-${lv}`,slot,name:`${nm}의 ${kind}`,drop:`🧭 ${nm} Lv.${lv}`,am68:a.id,lv68:lv,pal:{A,W,N:'#7a4f2a'}};
    if(slot==='shield'){it.at=[0,10];it.rows=['.KKK.','KAAAK','KAWAK','KAAAK','.KAK.','..K..']}
    if(slot==='head'){it.at=[3,2];it.rows=['AAAAAWAAAAA']}
    if(slot==='body'){it.at=[1,10];it.rows=['AA...........AA','A.............A','A.............A','AA...........AA','AW...........WA','.A...........A.']}
    if(slot==='weapon'){it.at=[12,3];it.rows=['.W.','WAW','.W.','.N.','.N.','.N.','.N.','.N.','.N.','.N.']}
    if(slot==='bg'){it.bg=`am:${A}`;delete it.pal}
    out.push(it)})});return out}
function amSync68(){try{if(typeof GEAR60==='undefined'||!C||!C.areas)return;for(let i=GEAR60.length-1;i>=0;i--)if(GEAR60[i].am68)GEAR60.splice(i,1);GEAR60.push(...amItems68())}catch(e){console.error(e)}}
bgSVG60=(function(prev){return function(k){if(typeof k==='string'&&k.startsWith('am:')){const A=k.slice(3),L=amLight68(A,.82),M=amLight68(A,.55);
  return `<rect width="24" height="26" fill="${L}"/><rect y="17" width="24" height="9" fill="${M}"/><rect y="21" width="24" height="5" fill="${A}"/>${[[3,15],[9,14],[17,15],[21,13]].map(([x,y])=>`<rect x="${x}" y="${y}" width="1" height="3" fill="${A}"/><rect x="${x-1}" y="${y}" width="3" height="1" fill="${A}"/>`).join('')}<circle cx="19" cy="5" r="2" fill="#fbe7a1"/>`}
  return prev.apply(this,arguments)}})(bgSVG60);
function amGear68(area,lv){return (typeof GEAR60!=='undefined'?GEAR60:[]).find(x=>x.am68===area&&x.lv68===lv)}
function amGive68(it){const g=gearSt60();if(!g.own.includes(it.id)){g.own.push(it.id);return true}return false}
function amPrev68(it){try{const eq={...gearSt60().eq};eq[it.slot]=it.id;return `<span class="am68p">${spriteSVG(C.avatar.kind,'ok',C.avatar.outfit,{fx:false,gear:eq})}</span>`}catch(e){return ''}}
// aMile67을 새로: 장비가 있는 레벨은 장비, 없는 레벨은 골드
function aMile67(){
  if(!ready||!C||!C.areas)return;if(typeof mode!=='undefined'&&mode==='db'&&typeof SRV59!=='undefined'&&!SRV59.c)return;
  if(!T67)T67=Date.now();if(Date.now()-T67<6000)return;
  if(aMile67.t&&Date.now()-aMile67.t<20000)return;aMile67.t=Date.now();amSync68();
  const T=areaTotal66();let first=!C.amile67;if(first)C.amile67={};let ch=first;
  C.areas.forEach(a=>{const L=aLevel67(T[a.id]||0),got=+C.amile67[a.id]||0;
    if(first||got===0&&!(a.id in C.amile67)){C.amile67[a.id]=L.lv;ch=true;return}
    const hit=K67().AMS.filter(m=>m>got&&m<=L.lv);
    if(L.lv>got){C.amile67[a.id]=L.lv;ch=true}
    hit.forEach(m=>{const it=amGear68(a.id,m),g=it?0:aGold67(m);
      const e={kind:'amile67',type:'good',name:`🧭 ${a.name} Lv.${m} · ${aTitle67(a.id,m)}${it?` · 🎁 ${it.name}`:''}`,area:'',xp:0,gold:g,cond:0,lv67:m,ar67:a.id};if(it){e.gear68=it.id;amGive68(it);ch=true}
      commit(()=>applyEntry(today(),e));
      later(()=>popup('영역 마일스톤','🧭',`<b>${esc(a.name)} Lv.${m}</b><br>칭호: <b>${esc(aTitle67(a.id,m))}</b><br>${it?`${amPrev68(it)}<span style="color:var(--gold)">🎁 전용 장비 <b>${esc(it.name)}</b></span><br><span class="tiny muted">상점 → 장비에서 입어요</span>`:`<span style="color:var(--gold)">+💰${g}</span>`}`,'Lv.'+m))})});
  // 이미 지난 마일스톤 장비는 한 번에 (처음 한 번)
  if(!C.am68r){C.am68r=1;ch=true;const got=[];C.areas.forEach(a=>{const lv=+C.amile67[a.id]||0;amDefs68().forEach(([m])=>{const it=amGear68(a.id,m);if(it&&m<=lv&&amGive68(it))got.push(it)})});
    if(got.length)setTimeout(()=>toastAct(`🎁 지금까지 닿은 영역 마일스톤 장비 ${got.length}개를 받았어요 (${got.slice(0,3).map(x=>x.name).join(' · ')}${got.length>3?' …':''})`,'상점에서 보기',()=>{location.hash='shop'},12000),9500)}
  if(ch)save('config')}
aJourney67=(function(prev){return function(id){const r=prev.apply(this,arguments);try{amSync68();const a=C.areas.find(x=>x.id===id),L=aLevel67(areaTotal66()[id]||0);
  document.querySelectorAll('#sheetC ol.aj67 li').forEach((li,i)=>{const m=K67().AMS[i],it=amGear68(id,m);if(!it)return;const s=li.querySelector('.num.small');if(s){s.textContent='🎁 '+it.name.replace(/^.*의 /,'');s.title=it.name}});
  const p=[...document.querySelectorAll('#sheetC p.tiny')].pop();if(p)p.innerHTML=p.innerHTML.replace('마일스톤에 닿으면 골드(레벨×10)를 받고','마일스톤에 닿으면 그 영역 전용 장비(Lv.3 방패 · 5 머리띠 · 10 망토 · 15 지팡이 · 20 배경)를 받고, 25레벨부터는 골드(레벨×10)를 받고')}catch(e){console.error(e)}return r}})(aJourney67);
gearHTML60=(function(prev){return function(){amSync68();let h=prev.apply(this,arguments);try{
  h=h.replace(/<p class="tiny muted" style="margin:6px 0 0">🔒 보스 전리품 (\d+)개: (.*?)을\(를\) 쓰러뜨리면 떨어져요\.<\/p>/,(all,n,list)=>{const ns=[...list.matchAll(/'([^']*)'/g)].map(x=>x[1]);const bo=ns.filter(x=>!x.startsWith('🧭')),am=ns.filter(x=>x.startsWith('🧭'));
    return `<p class="tiny muted" style="margin:6px 0 0">${bo.length?`🔒 보스 전리품 ${bo.length}개: ${bo.map(x=>`'${x}'`).join(', ')}을(를) 쓰러뜨리면 떨어져요.`:''}${bo.length&&am.length?'<br>':''}${am.length?`🧭 영역 장비 ${am.length}개: ${am.map(x=>x.slice(3)).join(', ')} 마일스톤에 닿으면 받아요.`:''}</p>`});
  h=h.replace(/(<span class="tiny">)🎁 전리품(<\/span>)/g,'$1🎁 전리품$2')}catch(e){}return h}})(gearHTML60);

/* ---- 4) 보스 약점 = 실제 효과 (그 약점에 맞는 기록은 데미지 더) ---- */
function WEAK68(){return {
  '미루기 괴물':['오늘 끝낸 할 일 데미지 +50%',e=>e.kind==='task'?.5:0],
  '망설임의 안개':['타이머로 시작한 기록·🌱 10분만 데미지 +50%',e=>(e.st||e.kind==='start65')?.5:0],
  '완벽주의 골렘':['끝낸 행동·할 일마다 +3 (점수 크기 상관없이)',e=>(e.kind==='act'||e.kind==='task')?{flat:3}:0],
  '무기력 늪지기':['몸 영역 기록 데미지 +50%',e=>e.area==='body'?.5:0],
  '불안 안개':['마음 영역 기록 데미지 +50%',e=>e.area==='mind'?.5:0],
  '회피 박쥐':['미뤘던(☠) 할 일을 끝내면 데미지 +100%',e=>e.prevSkull?1:0]}}
weekState=(function(prev){return function(k){const s=prev.apply(this,arguments);try{const W=WEAK68()[bossOf(k).name];if(!W)return s;let add=0,n=0;
  weekEntries(k).forEach(({e})=>{if(['chest','boss','wbrave','badge','buy','amile67'].includes(e.kind)||e.type==='bad'||(e.xp||0)<=0)return;const m=W[1](e);if(!m)return;n++;add+=typeof m==='object'?m.flat:Math.round((e.xp||0)*m)});
  if(add){s.weak=add;s.weakN=n;s.dmg+=add;s.left=Math.max(0,s.hp-(s.dmg-s.heal));s.dead=s.dmg-s.heal>=s.hp}}catch(x){console.error(x)}return s}})(weekState);
(function(){try{const W=WEAK68();Object.keys(W).forEach(n=>{if(LORE61[n]&&!/실제 효과/.test(LORE61[n][1]||''))LORE61[n][1]=(LORE61[n][1]||'')+` → 실제 효과: ${W[n][0]}.`})}catch(e){}})();
bossSheet65=(function(prev){return function(){const r=prev.apply(this,arguments);try{const td=dateKey(),bs=bossOf(td),ws=weekState(td),W=WEAK68()[bs.name],box=document.querySelector('#sheetC .mob65.boss>div:last-child');
  if(box&&W)box.insertAdjacentHTML('beforeend',`<p class="tiny weak68" style="margin:6px 0 0">🎯 이번 주 약점 공격 <b>${ws.weak?'+'+ws.weak+' 데미지':'아직 없어요'}</b>${ws.weakN?` (${ws.weakN}번)`:''}</p>`);
  const sc=$('sheetC');if(sc)sc.insertAdjacentHTML('beforeend',`<details class="small br68"><summary>⚙ 보스 규칙 (여기서 바로 바꿔요)</summary><div class="kv" style="margin-top:6px">
    <label>보스 HP <input type="number" min="50" max="5000" step="10" data-br68="bossHp" value="${+C.weekly.bossHp||400}"></label>
    <label>처치 ✨XP <input type="number" min="0" max="500" data-br68="bossXp" value="${+C.weekly.bossXp||0}"></label>
    <label>처치 💰골드 <input type="number" min="0" max="1000" data-br68="bossGold" value="${+C.weekly.bossGold||0}"></label></div>
    <p class="tiny muted" style="margin:4px 0 0">${scoreHint68()}</p></details>`)}catch(e){console.error(e)}return r}})(bossSheet65);
function scoreHint68(){try{let s=0,n=0;for(let w=1;w<=4;w++){const k=addDays(weekStart(dateKey()),-7*w);const x=weekState(k);if(x.dmg){s+=x.dmg-x.heal;n++}}return n?`지난 ${n}주 평균 데미지 ${Math.round(s/n)} — HP를 이보다 조금 낮게 두면 대개 주 후반에 쓰러져요.`:'지난 주 기록이 쌓이면 평균 데미지를 알려 줄게요.'}catch(e){return ''}}
addEventListener('change',e=>{const i=e.target.closest&&e.target.closest('[data-br68]');if(!i)return;e.stopPropagation();const k=i.dataset.br68,v=Math.round(+i.value);if(!isFinite(v))return;
  C.weekly[k]=k==='bossHp'?clamp(v,50,5000):clamp(v,0,k==='bossXp'?500:1000);save('config');render();toast('보스 규칙을 바꿨어요')},true);

/* ---- 5) 보스 처치 연출 ---- */
popup=(function(prev){return function(kind,ic,html,big){if(kind!=='보스 처치'||ui.kill68)return prev.apply(this,arguments);
  const a=arguments,self=this;try{const bs=bossOf(dateKey()),it=(typeof GEAR60!=='undefined'?GEAR60:[]).find(x=>x.drop===bs.name);if(it)a[2]=html+`<br><span class="small">🎁 전리품 <b>${esc(it.name)}</b> · 상점 → 장비</span>`;
    killFx68(bs,()=>prev.apply(self,a))}catch(e){console.error(e);prev.apply(this,arguments)}}})(popup);
function killFx68(bs,done){ui.kill68=1;const red=matchMedia('(prefers-reduced-motion: reduce)').matches;const d=document.createElement('div');d.className='kill68';
  d.innerHTML=`<div class="k68b">${bossSVG(bs.color,false,bs.name)}</div><div class="k68t">${esc(bs.name)}</div>${red?'':`<div class="k68s">${Array.from({length:14},(_,i)=>`<i style="--a:${i*360/14}deg;--d:${60+(i%3)*30}px"></i>`).join('')}</div>`}`;
  document.body.appendChild(d);buzz(30);const fin=()=>{d.remove();ui.kill68=0;done()};
  if(red){setTimeout(()=>{d.querySelector('.k68b').innerHTML=bossSVG(bs.color,true,bs.name);d.classList.add('dead')},300);setTimeout(fin,1100);return}
  setTimeout(()=>{d.classList.add('hit')},60);setTimeout(()=>{d.querySelector('.k68b').innerHTML=bossSVG(bs.color,true,bs.name);d.classList.add('dead');buzz(60)},900);setTimeout(fin,2300);
  d.addEventListener('click',fin,{once:true})}

/* ---- 6) 우클릭(폰 꾹) 메뉴 더: 홈 칸 · 캘린더 날짜 · 캘린더 빈 시간 · 보스 ---- */
addEventListener('contextmenu',e=>{if(e.target.closest('input,textarea,select,#pk61,.trow,[data-ctask],.act,.quest,.x60c,.ditem'))return;
  const x=e.clientX,y=e.clientY,touch=typeof lastPT61!=='undefined'&&lastPT61==='touch';const go=f=>{e.preventDefault();e.stopPropagation();lastPt={x,y};f()};
  const md=e.target.closest('.mc[data-calday]');if(md){go(()=>dayMenu68(md.dataset.calday,x,y));return}
  const col=e.target.closest('.tgcol[data-drop^="col:"]');if(col&&!touch&&!e.target.closest('.blk')){const r=col.getBoundingClientRect(),m=clamp(Math.floor(mOf(y-r.top)/15)*15,0,1425);go(()=>slotMenu68(col.dataset.drop.slice(4),m,x,y));return}
  const bo=e.target.closest('#battleBox .boss2');if(bo){go(()=>menu61(x,y,'👾 이번 주 보스',[{l:'👾 보스 보기 · 약점',f:()=>bossSheet65()},{l:'📖 도감',f:()=>openDex61()},{l:'⚙ 보스 HP·보상 바꾸기',f:()=>{bossSheet65();setTimeout(()=>{const d=document.querySelector('#sheetC .br68');if(d)d.open=true},30)}}]));return}
  const hb=e.target.closest('.hblock[data-hid]');if(hb&&curView()==='home'&&!document.body.classList.contains('homeedit')){const id=hb.dataset.hid;if(!touch||!e.target.closest('[data-dragmode]'))go(()=>homeMenu68(hb,id,x,y));return}
},false);
function dayMenu68(k,x,y){menu61(x,y,`📅 ${dayName68(k)}`,[
  {l:'＋ 이 날 할 일',f:()=>calAddDay(k)},
  {l:'📋 이 날 목록 펼치기',f:()=>{ui.calSel=k;ui.cal63=1;renderCal()}},
  {l:'🗓 하루 보기',f:()=>{ui.calAnchor=k;C.ui.cal.mode='day';save('config');renderCal()}},
  {l:'📍 오늘로',dis:k===midKey68(),f:()=>{ui.calAnchor=midKey68();ui.calSel=midKey68();renderCal()}}])}
function slotMenu68(k,m,x,y){menu61(x,y,`🕒 ${dayName68(k)} ${hm(m)}`,[
  {l:`＋ ${hm(m)}에 할 일 (30분)`,f:()=>calAddSheet(k,m,30)},{l:`＋ ${hm(m)}에 할 일 (1시간)`,f:()=>calAddSheet(k,m,60)},
  {l:'🗓 이 날 하루 보기',f:()=>{ui.calAnchor=k;C.ui.cal.mode='day';save('config');renderCal()}}])}
function homeMenu68(hb,id,x,y){const nm=(HOME_BLOCKS&&HOME_BLOCKS[id])||id,col=hb.querySelector('[data-collapse]');const H=C.ui.home||[],i=H.findIndex(z=>z[0]===id);
  menu61(x,y,`🏠 ${esc(String(nm))}`,[
    {l:col?(hb.classList.contains('collapsed')?'▾ 펴기':'▴ 접기'):'▴ 접기',dis:!col,f:()=>col&&col.click()},
    {l:'↑ 위로',dis:i<=0,f:()=>{[H[i-1],H[i]]=[H[i],H[i-1]];save('config');render()}},
    {l:'↓ 아래로',dis:i<0||i>=H.length-1,f:()=>{[H[i+1],H[i]]=[H[i],H[i+1]];save('config');render()}},
    {l:'👁 이 칸 숨기기',dis:i<0,f:()=>{H[i][1]=false;save('config');render();toastAct(`'${nm}' 칸을 숨겼어요`,'되돌리기',()=>{H[i][1]=true;save('config');render()})}},
    '-',{l:'▦ 홈 배치 편집',f:()=>homeEditOn(true)}])}

/* ---- 7) 편집 화면 덜 가기: 🍬 도파민(⋯ 메뉴·코스에 바로 추가) · 할 일 상세 카드 고르기 창 ---- */
openDopaNow=(function(prev){return function(){const r=prev.apply(this,arguments);try{
  document.querySelectorAll('#sheetC .dpick').forEach(p=>{const b=p.querySelector('[data-x57ddo]');if(!b||p.querySelector('.dm68'))return;p.querySelector('.row').insertAdjacentHTML('beforeend',`<button class="btn ghost sm dm68" data-dm68="${b.dataset.x57ddo}" aria-label="코스·편집 메뉴">⋯</button>`)});
  document.querySelectorAll('#dAll .course').forEach((c,i)=>{const co=(dopaC()[i]||[])[0];if(!co||c.querySelector('.dadd68'))return;c.insertAdjacentHTML('beforeend',`<div class="dadd68"><input data-dadd68="${co}" maxlength="40" placeholder="＋ 이 코스에 추가 (Enter)" enterkeyhint="done" autocomplete="off"></div>`)});
  const p=[...document.querySelectorAll('#sheetC p.tiny')].pop();if(p&&!p.querySelector('.dh68'))p.insertAdjacentHTML('beforeend',' <span class="dh68">· 항목 ⋯ 또는 우클릭(폰은 꾹)으로 코스 바꾸기·편집</span>')}catch(e){console.error(e)}return r}})(openDopaNow);
addEventListener('click',e=>{const b=e.target.closest('[data-dm68]');if(!b)return;e.preventDefault();e.stopPropagation();const a=C.actions.find(x=>x.id===b.dataset.dm68);const r=b.getBoundingClientRect();if(a)actMenu61(a,r.left,r.bottom+4)},true);
addEventListener('keydown',e=>{const i=e.target&&e.target.closest&&e.target.closest('[data-dadd68]');if(!i||e.key!=='Enter')return;e.preventDefault();e.stopPropagation();if(e.isComposing){setTimeout(()=>add68(i),40);return}add68(i)},true);
function add68(i){const nm=(i.value||'').trim();if(!nm)return;const co=i.dataset.dadd68,quick=co==='app'||co==='side';
  C.actions.push({id:'dn'+uid(),name:nm,type:'good',area:'mind',cond:3,gold:0,xp:2,marble:'',dur:quick?5:co==='rest'?10:20,dopa:co,dopaOnly:1,effort:'quick'});save('config');
  i.value='';toast(`🍬 '${nm}'를 넣었어요 · 점수는 ⋯ → 편집`);const y=($('sheetC')||{}).scrollTop;openDopaNow();const sc=$('sheetC');if(sc)sc.scrollTop=y;const d=document.querySelector('#sheetC details');if(d)d.open=true;const n=document.querySelector(`[data-dadd68="${co}"]`);if(n)n.focus()}
drawTaskSheet=(function(prev){return function(){const r=prev.apply(this,arguments);try{const s=$('tsAid');if(s&&!s.disabled&&!$('aidPk68'))s.insertAdjacentHTML('afterend',`<button type="button" class="btn ghost sm" id="aidPk68" style="margin-top:4px">🔍 카드 찾아 고르기</button>`)}catch(e){}return r}})(drawTaskSheet);
addEventListener('click',e=>{if(!e.target.closest('#aidPk68'))return;e.preventDefault();e.stopPropagation();const s=$('tsAid');if(!s)return;
  openPicker61({title:'🃏 이을 행동 카드',tabs:[{k:'card',label:'🃏 행동 카드',items:C.actions.filter(a=>a.type==='good'&&!a.doneAt).map(a=>({id:a.id,label:a.name,sub:`✨${a.xp} 💰${a.gold}${a.brave?' · ⚔️':''}${a.dopa?' · 🍬':''}`,grp:(C.areas.find(x=>x.id===a.area)||{}).name||'',score:typeof stUse61==='function'?stUse61(a.id):0}))}],
    onPick:([it])=>{if(!it)return;if(![...s.options].some(o=>o.value===it.id)){const o=document.createElement('option');o.value=it.id;o.textContent=(C.actions.find(a=>a.id===it.id)||{}).name||it.id;s.appendChild(o)}s.value=it.id;s.dispatchEvent(new Event('change',{bubbles:true}))}})},true);

/* ---- 8) 기능 지도 · 렌더 뒤 ---- */
F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['🌙 할 일 오늘은 자정','할 일·캘린더','할 일·캘린더의 오늘은 자정에, 점수·HP는 새벽 5시에. 새벽 기록은 🌙',()=>{location.hash='tasks'},'자정 새벽 오늘 날짜'],
  ['📂 목록 색','할 일 왼쪽 목록 우클릭(폰 꾹) → 색','캘린더·할 일 줄에 목록 색',()=>{location.hash='tasks'},'목록 색깔 리스트'],
  ['🎁 영역 장비','상점 → 장비','영역 마일스톤 Lv.3·5·10·15·20 전용 장비',()=>{location.hash='shop'},'영역 장비 마일스톤 보상'],
  ['🎯 보스 약점','홈 전투 칸 보스 누르기','약점에 맞는 기록은 데미지 더 · 보스 규칙도 거기서',()=>bossSheet65(),'보스 약점 데미지 규칙 hp'],
  ['🖱 우클릭 메뉴','홈 칸·캘린더 날짜·빈 시간·보스·도파민 항목','폰은 꾹 누르기',()=>{location.hash='cal'},'우클릭 메뉴 꾹']])}})(F67);
render=(function(prev){return function(){
  try{if(ready&&C&&C.lists&&!(typeof mode!=='undefined'&&mode==='db'&&typeof SRV59!=='undefined'&&!SRV59.c)){lcolMig68();lcolNew68()}}catch(e){console.error(e)}
  try{amSync68()}catch(e){}
  const x=prev.apply(this,arguments);
  try{if(curView()==='tasks'){rowCols68();dawnBar68()}else rowCols68()}catch(e){console.error(e)}
  return x}})(render);
renderTasks=(function(prev){return function(){const x=prev.apply(this,arguments);try{rowCols68();dawnBar68()}catch(e){}return x}})(renderTasks);

/* ---- 9) 본 앱: 옮기기 전 기록 되돌리기 (계정·백업 화면) ---- */
var BAK68=undefined;
function bak68Box(){if(location.pathname.includes('/beta/'))return;const v=document.querySelector('.view[data-view="more"]');if(!v||curView()!=='more')return;
  if(BAK68===undefined){BAK68=null;if(window.HQ_READY)window.HQ_READY.then(api=>api&&api.bak68Info?api.bak68Info():null).then(m=>{BAK68=m||false;bak68Box()}).catch(()=>{BAK68=false});return}
  let b=$('bak68');if(!BAK68){if(b)b.remove();return}
  if(!b){b=document.createElement('div');b.id='bak68';b.className='panel';v.appendChild(b)}
  b.innerHTML=`<div class="ptitle"><h2>↩ 옮기기 전 본 앱 기록</h2></div><p class="small" style="margin:0">v6.8에서 베타 기록을 본 앱으로 옮길 때 그 전 본 앱 기록(날짜 ${BAK68.days||0}일)을 같은 계정 안에 백업해 뒀어요 (${esc(String(BAK68.at||'').slice(0,10))}).</p>
    <p class="tiny muted" style="margin:6px 0">되돌리면 지금 기록은 또 다른 백업 칸에 남기고, 옛 기록으로 바꾼 뒤 새로고침해요.</p><button class="btn ghost sm" data-bak68="1">옛 기록으로 되돌리기…</button>${((BAK68.promo||{}).hist||[]).length?`<details class="tiny" style="margin-top:8px"><summary>옮기기 이력 ${BAK68.promo.hist.length}번</summary><ul style="margin:4px 0 0;padding-left:18px">${BAK68.promo.hist.map(h=>`<li>${esc(new Date(h.at).toLocaleString('ko-KR'))} · ${({beta:'베타 기록으로 옮김',old:'옛 기록 그대로',restore:'옛 기록으로 되돌림',already:'(예전에 옮긴 것 확인)'})[h.choice]||esc(h.choice)}${h.bak?` · 백업 ${esc(h.bak)}`:''}</li>`).join('')}</ul></details>`:''}`}
addEventListener('click',async e=>{const b=e.target.closest('[data-bak68]');if(!b)return;e.preventDefault();e.stopPropagation();
  if(!confirm('옮기기 전 본 앱 기록으로 되돌릴까요? 지금 기록은 따로 백업해 둬요.'))return;b.disabled=true;b.textContent='되돌리는 중…';
  try{const api=await window.HQ_READY;await api.restoreBak68();location.reload()}catch(x){console.error(x);b.disabled=false;b.textContent='옛 기록으로 되돌리기…';toast('되돌리지 못했어요: '+(x.message||x))}},true);
addEventListener('hashchange',()=>setTimeout(()=>{try{bak68Box()}catch(e){}},60));
