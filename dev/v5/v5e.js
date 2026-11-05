/* ================= v5: 가챠 ================= */
function G(){if(!C.gacha)C.gacha={};const g=C.gacha;g.f=g.f||{src:['task','habit'],effort:[],areas:[],lists:[],due:'today',n:3};g.hist=g.hist||[];return g}
function gachaMatch(src,id){const q=(C.gacha||{}).quest;return !!(q&&q.src===src&&q.id===id)}
function afterGacha(e){
  const q=(C.gacha||{}).quest;if(!q||!e.gq)return;
  const g=G();g.hist.unshift({d:dateKey(),name:q.name,ok:1});g.hist=g.hist.slice(0,30);g.quest=null;save('config');
  later(()=>popup('가챠 퀘스트 클리어','🎲',`<b>${esc(q.name)}</b><br>XP ×${g.mult||1.5} 보너스를 받았어요`,'클리어'));runLater();render();
}
function lastDoneOf(src,id){let best=null;Object.keys(DAYS).forEach(k=>{(DAYS[k].entries||[]).forEach(e=>{if((src==='task'&&e.tid===id)||(src==='habit'&&e.aid===id&&!e.tid)){if(!best||k>best)best=k}})});return best}
function gachaPool(f=G().f){
  const td=dateKey(),out=[];const src=f.src&&f.src.length?f.src:['task','habit','routine'];
  const okArea=a=>!f.areas||!f.areas.length||f.areas.includes(a);
  const okEff=e=>!f.effort||!f.effort.length||f.effort.includes(e);
  if(src.includes('task'))openTasks().forEach(t=>{
    if(f.due==='today'&&t.due&&t.due>td)return;if(f.due==='dated'&&(!t.due||t.due>td))return;
    if(f.lists&&f.lists.length&&!f.lists.includes(t.list||'inbox'))return;if(!okArea(areaOfTask(t))||!okEff(effortOf(t)))return;
    if(f.tags&&f.tags.length&&!(t.tags||[]).some(x=>f.tags.includes(x)))return;
    const b=taskBase(t);const stale=t.due&&t.due<td?Math.min(14,diffDays(td,t.due)):Math.min(14,diffDays(td,t.created||td)/3);
    out.push({src:'task',id:t.id,name:t.title,xp:b.xp,eff:effortOf(t),brave:!!t.brave,w:1+stale/4+(t.prio||0)/4+(t.skull||0)*.6,meta:(t.due?dueLabel(t.due)+' · ':'')+listName(t.list),reframe:t.reframe})});
  if(src.includes('dopa'))C.actions.filter(a=>a.dopa).forEach(a=>{if(!okArea(a.area))return;const ef=a.effort||(a.dur?(a.dur<=10?'quick':a.dur<=45?'mid':'heavy'):'mid');if(!okEff(ef))return;const ld=lastDoneOf('habit',a.id);if(ld===td)return;out.push({src:'habit',id:a.id,name:a.name,xp:+a.xp||0,eff:ef,w:1.3,meta:'🍬 '+((dopaC().find(d=>d[0]===a.dopa)||['',''])[1])+(a.dur?' · '+a.dur+'분':''),reframe:a.reframe})});
  if(src.includes('habit')&&!(f.lists&&f.lists.length))C.actions.filter(a=>a.type==='good'&&!a.dopaOnly).forEach(a=>{
    if(!okArea(a.area))return;const ef=a.effort||(a.dur?(a.dur<=10?'quick':a.dur<=45?'mid':'heavy'):'mid');if(!okEff(ef))return;
    if(f.tags&&f.tags.length)return;
    const ld=lastDoneOf('habit',a.id),gap=ld?diffDays(td,ld):10;if(ld===td)return;
    out.push({src:'habit',id:a.id,name:a.name,xp:+a.xp||0,eff:ef,w:1+Math.min(14,gap)/5,meta:(C.areas.find(x=>x.id===a.area)||{}).name+' · '+(ld?gap+'일 전':'아직 안 함'),reframe:a.reframe})});
  if(src.includes('routine')&&!(f.lists&&f.lists.length)&&!(f.tags&&f.tags.length))(C.routines||[]).forEach(r=>{const m=r.steps.reduce((s,x)=>s+(+x.min||0),0);const ef=m<=10?'quick':m<=45?'mid':'heavy';if(!okEff(ef))return;
    out.push({src:'routine',id:r.id,name:r.name,xp:+r.xp||0,eff:ef,w:1.2,meta:`루틴 · ${r.steps.length}단계 ${m}분`})});
  return out;
}
const RARITY=[['SSR',30,'★★★★'],['SR',15,'★★★'],['R',8,'★★'],['N',0,'★']];
const rarOf=c=>c.brave?RARITY[0]:RARITY.find(r=>c.xp>=r[1]);
function gachaDraw(){
  const g=G();if(g.pending&&g.pending.cards&&g.pending.cards.length){toast('먼저 나온 카드 중 하나를 골라요');return}
  if(g.quest){toast('진행 중인 가챠 퀘스트가 있어요. 끝내거나 포기하고 다시 뽑아요');return}
  const pool=gachaPool();const n=Math.min(+g.f.n||3,pool.length);if(!n){toast('조건에 맞는 후보가 없어요. 필터를 풀어봐요');return}
  const bag=[...pool],cards=[];
  for(let i=0;i<n;i++){const tot=bag.reduce((s,x)=>s+x.w,0);let r=Math.random()*tot,j=0;for(;j<bag.length-1;j++){r-=bag[j].w;if(r<=0)break}cards.push(bag.splice(j,1)[0])}
  g.pending={at:Date.now(),d:dateKey(),cards:cards.map(c=>({src:c.src,id:c.id,name:c.name,xp:c.xp,eff:c.eff,brave:c.brave,meta:c.meta})),open:[]};
  save('config');location.hash='gacha';render();buzz(20);
}
function gachaRerollCost(){const g=G();const n=g.rr&&g.rr.d===dateKey()?g.rr.n:0;return (+g.rerollBase||20)*(n+1)}
function gachaReroll(){const g=G();if(!g.pending)return;const cost=gachaRerollCost();if(P.gold<cost){toast(`다시 뽑으려면 ${gtx(cost)} 필요해요. 하나를 골라요!`);return}
  commit(()=>applyEntry(today(),{kind:'buy',type:'buy',name:'가챠 다시 뽑기',gold:-cost,xp:0}));
  g.rr={d:dateKey(),n:(g.rr&&g.rr.d===dateKey()?g.rr.n:0)+1};g.hist.unshift({d:dateKey(),name:g.pending.cards.map(c=>c.name).join(' / '),rr:1});g.pending=null;save('config');gachaDraw()}
function gachaPick(i){const g=G();const c=g.pending&&g.pending.cards[i];if(!c)return;
  g.quest={src:c.src==='habit'?'act':c.src,id:c.id,name:c.name,at:Date.now(),d:dateKey()};g.pending=null;save('config');render();
  popup('퀘스트 수락','🎲',`<b>${esc(c.name)}</b><br><span class="muted">끝내면 XP ×${g.mult||1.5}. 지금 바로 ⏱ 사냥을 시작해도 좋아요.</span>`,'GO');}
function gachaGiveUp(){const g=G();if(!g.quest)return;const cost=+g.giveup||30;const q=g.quest;
  if(P.gold>=cost)commit(()=>applyEntry(today(),{kind:'buy',type:'buy',name:'가챠 퀘스트 포기',gold:-cost,xp:0}));
  g.hist.unshift({d:dateKey(),name:q.name,gu:1});g.quest=null;save('config');render();toast('포기했어요. 다음엔 꼭!')}
function questTarget(q){if(!q)return null;if(q.src==='task')return TASKS[q.id];if(q.src==='act')return C.actions.find(a=>a.id===q.id);if(q.src==='routine')return (C.routines||[]).find(r=>r.id===q.id);return null}
function questBarHTML(){const g=C.gacha||{},q=g.quest;if(!q)return '';const tg=questTarget(q);
  return `<div class="questbar"><span class="qi">🎲</span><span><span class="tiny muted">가챠 퀘스트 · XP ×${g.mult||1.5}</span><b>${esc(q.name)}</b>${tg&&tg.reframe?`<button class="rfbtn" data-qreframe="1">💭 다르게 보기</button>`:''}</span><span class="row" style="gap:6px"><button class="btn sm" data-qgo="timer">⏱ 사냥</button><button class="btn sm ghost" data-qgo="done">✓</button><button class="x" data-qgo="giveup" title="포기 (${gtx(-(+g.giveup||30))})" aria-label="포기">✕</button></span></div>`}
function questGo(k){const q=(C.gacha||{}).quest;if(!q)return;const tg=questTarget(q);
  if(k==='giveup'){gachaGiveUp();return}
  if(!tg){toast('대상을 찾을 수 없어요');G().quest=null;save('config');render();return}
  if(k==='timer'){if(q.src==='routine')startRun({routine:tg});else if(q.src==='task')startRun({task:tg});else startRun({act:tg});return}
  if(q.src==='task')completeTask(tg);else if(q.src==='act')doAction(tg);else startRun({routine:tg})}
function renderGacha(){
  if(curView()!=='gacha')return;const g=G(),f=g.f;
  $('gMult').textContent=g.mult||1.5;$('gQuest').innerHTML=questBarHTML();
  const presets=g.presets||[];
  $('gPresets').innerHTML=presets.map(p=>`<button class="chipbtn" data-gpre="${p.id}">${esc(p.name)}</button>`).join('')+`<button class="chipbtn" data-gpresave="1" title="지금 필터를 저장">＋ 지금 필터 저장</button>`;
  const ch=(k,v,l,arr)=>`<button class="chipbtn" data-gf="${k}" data-v="${esc(v)}" aria-pressed="${(arr||[]).includes(v)}">${l}</button>`;
  const lists=C.lists.filter(l=>openTasks().some(t=>(t.list||'inbox')===l.id));
  $('gFilters').innerHTML=`<div class="fr"><span class="lbl">뭘</span>${ch('src','task','할 일',f.src)}${ch('src','habit','습관',f.src)}${ch('src','routine','루틴',f.src)}${ch('src','dopa','🍬 도파민',f.src)}</div>
    <div class="fr"><span class="lbl">크기</span>${EFFORTS.map(([k,l])=>ch('effort',k,l,f.effort)).join('')}</div>
    <div class="fr"><span class="lbl">영역</span>${C.areas.map(a=>ch('areas',a.id,esc(a.name),f.areas)).join('')}</div>
    <div class="fr"><span class="lbl">날짜</span><span class="seg3">${[['today','오늘까지+날짜 없음'],['dated','오늘까지만'],['all','전부']].map(([v,l])=>`<button data-gdue="${v}" aria-pressed="${(f.due||'today')===v}">${l}</button>`).join('')}</span></div>
    ${lists.length?`<details ${(f.lists||[]).length?'open':''}><summary>목록으로 좁히기${(f.lists||[]).length?` · ${f.lists.length}개 고름`:''}</summary><div class="fr" style="margin-top:6px">${lists.map(l=>ch('lists',l.id,esc(l.name),f.lists)).join('')}</div></details>`:''}
    <div class="fr"><span class="lbl">장수</span><span class="seg3">${[1,3,5,7].map(n=>`<button data-gn="${n}" aria-pressed="${(+f.n||3)===n}">${n}장</button>`).join('')}</span></div>`;
  const pool=gachaPool();$('gPool').textContent=`후보 ${pool.length}개`;
  $('gHint').textContent=pool.length?'오래 안 한 것·지난 것·중요한 것이 더 잘 나와요.':'필터를 풀면 후보가 생겨요.';
  $('gDraw').textContent=`🎲 ${Math.min(+f.n||3,pool.length)||''}장 뽑기`;$('gDraw').disabled=!pool.length||!!g.pending||!!g.quest;
  const P0=g.pending;
  if(P0&&P0.cards.length){const open=P0.open||[];const all=open.length>=P0.cards.length;
    $('gResTitle').textContent=all?'하나를 골라요':'카드를 뒤집어요';
    $('gResTools').innerHTML=`${all?'':`<button class="btn sm ghost" data-gflipall="1">모두 뒤집기</button>`}<button class="btn sm ghost" data-gclear="1" title="실수로 뽑았을 때 · 골드 안 들어요">치우기</button><button class="btn sm ghost" data-greroll="1" ${P.gold<gachaRerollCost()?'disabled':''}>다시 뽑기 ${gtx(-gachaRerollCost())}</button>`;
    $('gCards').innerHTML=P0.cards.map((c,i)=>{const r=rarOf(c),o=open.includes(i);return `<div><button class="gcard r-${r[0]} ${o?'open':''}" data-gflip="${i}" aria-label="${o?esc(c.name):'카드 '+(i+1)+' 뒤집기'}"><span class="face back">?</span><span class="face front"><span class="rar">${r[2]} ${r[0]}</span><span class="gt">${c.brave?'⚡ ':''}${esc(c.name)}</span><span class="gm">${c.src==='task'?'할 일':c.src==='habit'?'습관':'루틴'} · ${esc(c.meta||'')}<br><b>+${c.xp} XP</b> → <b style="color:var(--accent)">+${Math.round(c.xp*(g.mult||1.5))}</b></span></span></button>${o&&all?`<button class="btn sm gpick" data-gpick="${i}" style="width:100%">이걸로!</button>`:''}</div>`}).join('');
    $('gResHelp').textContent=all?'하기 싫은 게 나와도 하나는 해요. 정 안 되면 골드를 내고 다시 뽑을 수 있어요(오늘 할 때마다 비싸져요).':'카드를 눌러 뒤집어요.';
  }else{$('gResTitle').textContent='결과';$('gResTools').innerHTML='';$('gCards').innerHTML=`<div class="empty">${g.quest?'퀘스트를 끝내면 다시 뽑을 수 있어요.':'왼쪽에서 뽑아요.'}</div>`;$('gResHelp').textContent=''}
  $('gRoutines').innerHTML=(C.routines||[]).map(r=>{const m=r.steps.reduce((s,x)=>s+(+x.min||0),0);return `<div class="sug" style="grid-template-columns:auto 1fr auto"><span style="font-size:20px">⏱</span><span><b>${esc(r.name)}</b><span class="why">${r.steps.map(s=>esc(s.name)).join(' → ')}</span><span class="why">${r.steps.length}단계 · 목표 ${m}분 · 완주 +${r.xp} XP</span></span><button class="btn sm" data-rrun="${r.id}">시작</button></div>`}).join('')||'<div class="empty">편집 → 루틴에서 만들어요.</div>';
  $('gHist').innerHTML=(g.hist||[]).slice(0,12).map(h=>`<li><span class="num muted">${fmtD(h.d)}</span><span class="mk">${h.ok?'✓':h.gu?'✕':'↻'}</span><span>${esc(h.name)}</span><span class="tiny muted">${h.ok?'클리어':h.gu?'포기':'다시 뽑음'}</span><span></span></li>`).join('')||'<li class="empty" style="display:block;border:0">아직 없어요.</li>';
}
/* ================= v5: 사냥(타이머) · 루틴 ================= */
let RUN=null,runIv=null,wakeLock=null;
const RKEY='hq-run'+(location.pathname.includes('/beta/')?'-b':'');
function runSave(){try{if(RUN)localStorage.setItem(RKEY,JSON.stringify(RUN));else localStorage.removeItem(RKEY)}catch(e){}}
function runLoad(){try{const r=JSON.parse(localStorage.getItem(RKEY));if(r&&r.start)RUN=r}catch(e){}}
function runElapsed(){if(!RUN)return 0;const now=RUN.pauseAt||Date.now();return Math.max(0,(now-RUN.start-(RUN.paused||0))/1000)}
function stepElapsed(){if(!RUN)return 0;const now=RUN.pauseAt||Date.now();return Math.max(0,(now-(RUN.stepStart||RUN.start)-(RUN.stepPaused||0))/1000)}
function startRun({task,act,routine}){
  if(RUN&&!confirmSwap())return;
  const col=BOSSES[Math.floor(Math.random()*BOSSES.length)][1];
  if(routine){RUN={kind:'routine',id:routine.id,name:routine.name,steps:routine.steps.map(s=>({...s})),si:0,start:Date.now(),stepStart:Date.now(),paused:0,stepPaused:0,log:[],color:col,target:routine.steps.reduce((s,x)=>s+(+x.min||0),0)}}
  else{const t=task,a=act||(t&&t.aid&&C.actions.find(x=>x.id===t.aid));const target=(t&&t.dur)||(a&&a.dur)||({quick:10,mid:25,heavy:50})[t?effortOf(t):((a&&a.effort)||'mid')]||25;
    RUN={kind:t?'task':'act',id:t?t.id:a.id,name:t?t.title:a.name,target,start:Date.now(),paused:0,color:col}}
  runSave();openHunt();requestWake();
}
function confirmSwap(){if(ui.swapArm&&Date.now()-ui.swapArm<4000){ui.swapArm=0;RUN=null;return true}ui.swapArm=Date.now();toast('사냥 중인 게 있어요. 한 번 더 누르면 바꿔요');return false}
async function requestWake(){try{if('wakeLock' in navigator&&!wakeLock){wakeLock=await navigator.wakeLock.request('screen');wakeLock.addEventListener('release',()=>{wakeLock=null})}}catch(e){}}
function releaseWake(){try{wakeLock&&wakeLock.release()}catch(e){}wakeLock=null}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&RUN&&!$('hunt').hidden)requestWake()});
function openHunt(){$('hunt').hidden=false;$('huntPill').hidden=true;document.body.style.overflow='hidden';drawHunt(true);clearInterval(runIv);runIv=setInterval(()=>drawHunt(false),500)}
function minimizeHunt(){$('hunt').hidden=true;document.body.style.overflow='';releaseWake();clearInterval(runIv);runIv=setInterval(tickPill,1000);tickPill()}
function tickPill(){if(!RUN){$('huntPill').hidden=true;clearInterval(runIv);document.title=docTitle();return}const el=Math.floor(runElapsed());$('huntPill').hidden=false;$('huntPill').textContent=`⚔ ${RUN.kind==='routine'?(RUN.steps[RUN.si]||{}).name||RUN.name:RUN.name} ${mmss(el)}${RUN.pauseAt?' ⏸':''}`;document.title=`⚔ ${mmss(el)} · ${RUN.name}`}
const docTitle=()=>location.pathname.includes('/beta/')?'습관 퀘스트 β':'습관 퀘스트';
const mmss=s=>{s=Math.max(0,Math.floor(s));const h=Math.floor(s/3600),m=Math.floor(s%3600/60);return (h?h+':'+pad(m):m)+':'+pad(s%60)};
function speedOf(elapsed,targetMin,baseXP){const tgt=Math.max(1,targetMin)*60,r=elapsed/tgt;
  if(r<=.5)return{tier:'번개 처치',bonus:Math.max(2,Math.round(baseXP*.6)),r};if(r<=.8)return{tier:'빠른 처치',bonus:Math.max(1,Math.round(baseXP*.35)),r};if(r<=1)return{tier:'제시간 처치',bonus:Math.max(1,Math.round(baseXP*.15)),r};return{tier:'처치',bonus:0,r}}
function runBaseXP(){if(!RUN)return 0;if(RUN.kind==='task'){const t=TASKS[RUN.id];return t?taskBase(t).xp:10}if(RUN.kind==='act'){const a=C.actions.find(x=>x.id===RUN.id);return a?+a.xp||0:10}if(RUN.kind==='routine'){const r=(C.routines||[]).find(x=>x.id===RUN.id);return r?+r.xp||0:20}return 10}
function drawHunt(full){
  if(!RUN){$('hunt').hidden=true;return}
  const isR=RUN.kind==='routine',st=isR?RUN.steps[RUN.si]:null;
  const el=isR?stepElapsed():runElapsed(),tgt=(isR?(+st.min||5):RUN.target)*60;
  const frac=clamp(1-el/tgt,0,1),over=el>tgt;
  if(!full&&$('huntClock')){$('huntClock').textContent=mmss(el);$('huntHp').style.width=(frac*100)+'%';$('hunt').classList.toggle('over',over);$('huntSub').textContent=over?`목표 ${mmss(tgt)} 지남 · 그래도 처치하면 기본 보상`:`목표 ${mmss(tgt)} · 남은 ${mmss(tgt-el)}`;
    if(isR&&$('huntTot'))$('huntTot').textContent='전체 '+mmss(runElapsed());
    if(over&&!RUN.beeped){RUN.beeped=isR?RUN.si+1:1;runSave();beep();buzz(200)}
    document.title=`⚔ ${mmss(el)} · ${RUN.name}`;return}
  const sp=speedOf(el,tgt/60,runBaseXP());
  $('hunt').innerHTML=`<div class="ht"><button class="btn ghost sm" data-hunt="min">⌄ 내리기</button><b>${isR?'⏱ '+esc(RUN.name):'⚔ 사냥'}</b><button class="btn ghost sm" data-hunt="quit">그만</button></div>
    <div class="arena"><div class="tier" id="huntName">${esc(isR?st.name:RUN.name)}</div>
      <div class="mon" id="huntMon">${bossSVG(RUN.color,false)}</div>
      <div class="track lg mhp"><div class="fill" id="huntHp" style="width:${frac*100}%;background:var(--bad)"></div></div>
      <div class="clock" id="huntClock">${mmss(el)}</div><div class="sub" id="huntSub"></div>
      ${isR?`<div class="sub" id="huntTot">전체 ${mmss(runElapsed())}</div><div class="steps">${RUN.steps.map((s,i)=>`<span class="${i===RUN.si?'on':i<RUN.si?'ok':''}">${esc(s.name)}</span>`).join('')}</div>`:''}
      ${isR&&st.aid==='@weigh'?`<label class="row" style="justify-content:center">몸무게 <input id="huntW" type="number" step="0.1" inputmode="decimal" style="width:110px" value="${today().weight??''}"> kg</label>`:''}
      ${(()=>{const rf=isR?((C.actions.find(a=>a.id===st.aid)||{}).reframe):(RUN.kind==='task'?(TASKS[RUN.id]||{}).reframe||((C.actions.find(a=>a.id===(TASKS[RUN.id]||{}).aid)||{}).reframe):(C.actions.find(a=>a.id===RUN.id)||{}).reframe);return rf?`<div class="reframe" style="max-width:520px;text-align:left"><b>💭 다르게 보기</b>${esc(rf)}</div>`:''})()}
      <div class="small muted">빨리 끝낼수록 보상이 커요 · 지금 끝내면 <b>${esc(sp.tier)}${sp.bonus?' +'+sp.bonus+' XP':''}</b></div></div>
    <div class="ctl"><button class="btn ghost" data-hunt="pause">${RUN.pauseAt?'▶ 계속':'⏸ 잠깐'}</button>${isR?`<button class="btn ghost" data-hunt="skip">건너뛰기</button>`:''}<button class="btn go" data-hunt="done">${isR?(RUN.si<RUN.steps.length-1?'✓ 다음 단계':'✓ 완주!'):'✓ 끝! 처치'}</button></div>`;
  $('hunt').classList.toggle('over',over);drawHunt(false);
}
function beep(){try{const A=new (window.AudioContext||window.webkitAudioContext)();[0,.18,.36].forEach(t=>{const o=A.createOscillator(),g=A.createGain();o.frequency.value=880;o.connect(g);g.connect(A.destination);g.gain.setValueAtTime(.15,A.currentTime+t);g.gain.exponentialRampToValueAtTime(.001,A.currentTime+t+.15);o.start(A.currentTime+t);o.stop(A.currentTime+t+.16)})}catch(e){}}
function huntDo(k){
  if(!RUN)return;
  if(k==='min'){minimizeHunt();return}
  if(k==='pause'){if(RUN.pauseAt){const d=Date.now()-RUN.pauseAt;RUN.paused=(RUN.paused||0)+d;RUN.stepPaused=(RUN.stepPaused||0)+d;delete RUN.pauseAt}else RUN.pauseAt=Date.now();runSave();drawHunt(true);return}
  if(k==='quit'){if(!ui.quitArm||Date.now()-ui.quitArm>3000){ui.quitArm=Date.now();toast('한 번 더 누르면 기록 없이 그만둬요');return}endRun();return}
  const mon=$('huntMon');if(mon){mon.classList.remove('hit');void mon.offsetWidth;mon.classList.add('hit')}
  if(RUN.kind==='routine'){const st=RUN.steps[RUN.si],el=stepElapsed();
    if(k==='done'&&st.aid==='@weigh'){const v=parseFloat(($('huntW')||{}).value);if(v>=30&&v<=250){commit(()=>{const day=today();day.weight=+v.toFixed(1);const w=day.entries.find(x=>x.kind==='weigh');if(w)w.name='몸무게 '+day.weight+'kg';else applyEntry(day,{kind:'weigh',type:'good',name:'몸무게 '+day.weight+'kg',xp:+C.weight.xp||0,gold:0})})}}
    else if(k==='done'&&st.aid){const a=C.actions.find(x=>x.id===st.aid);if(a&&a.type==='good'){ui.off=0;const e=actEntry(a,{vid:(pickVariant(a)||{}).id});finishCtx(e,{elapsed:el},{src:'act',id:a.id});commit(()=>applyEntry(today(),e))}}
    RUN.log.push({name:st.name,sec:Math.round(el),target:(+st.min||5)*60,skip:k==='skip'?1:0});
    if(RUN.si<RUN.steps.length-1){RUN.si++;RUN.stepStart=Date.now();RUN.stepPaused=0;if(RUN.pauseAt){RUN.pauseAt=Date.now()}delete RUN.beeped;runSave();buzz(25);fxPop(k==='skip'?'건너뜀':'✓ '+st.name,'var(--good)');drawHunt(true);return}
    finishRoutine();return}
  if(k==='done')finishSingle();
}
function finishSingle(){
  const el=runElapsed(),R=RUN,base=runBaseXP()||10;endRun(true);ui.off=0;
  const sp=speedOf(el,R.target,base);
  if(R.kind==='task'){const t=TASKS[R.id];if(t){const a=t.aid&&C.actions.find(x=>x.id===t.aid);
      if(a&&a.opts&&a.opts.length){openDoneSheet({t,a,spd:sp,elapsed:el})}else completeTask(t,{direct:true,spd:sp,elapsed:el})}}
  else{const a=C.actions.find(x=>x.id===R.id);if(a){if(a.opts&&a.opts.length)openDoneSheet({a,spd:sp,elapsed:el});else doAction(a,{direct:true,spd:sp,elapsed:el})}}
  later(()=>popup(sp.tier,'⚔️',`<b>${esc(R.name)}</b><br>${mmss(el)} 걸렸어요 (목표 ${R.target}분)${sp.bonus?`<br><span style="color:var(--good)">스피드 보너스 +${sp.bonus} XP</span>`:''}`,sp.r<=1?'⚡':'✓'));runLater();
}
function finishRoutine(){
  const R=RUN,tot=runElapsed(),r=(C.routines||[]).find(x=>x.id===R.id);endRun(true);ui.off=0;
  const done=R.log.filter(x=>!x.skip).length,all=R.steps.length;const sp=speedOf(tot,R.target,+(r&&r.xp)||20);
  let xp=Math.round((+(r&&r.xp)||20)*done/all);if(done===all)xp+=sp.bonus;if(recoveryActive())xp=Math.round(xp*C.recovery.mult);
  const e={kind:'routine',type:'good',name:R.name+(done<all?` (${done}/${all})`:' 완주'),area:(r&&r.area)||'life',cond:done===all?6:3,xp,gold:done===all?+(r&&r.gold)||0:0,note:R.log.map(x=>`${x.skip?'✕':'✓'}${x.name} ${mmss(x.sec)}`).join(' · ')};
  if(done===all)e.spd=sp.tier;e.dur=Math.max(1,Math.round(tot/60));const st=new Date(Date.now()-tot*1000);e.st=pad(st.getHours())+':'+pad(st.getMinutes());
  if(gachaMatch('routine',R.id)){e.xp=Math.round(e.xp*(C.gacha.mult||1.5));e.gq=1}
  const rt=Object.values(TASKS).find(t=>t.status===0&&t.rid===R.id&&t.due&&t.due<=dateKey());
  commit(()=>applyEntry(today(),e));afterGacha(e);
  if(rt){if(rt.rep){rt.due=nextDue(rt.rep,dateKey())||rt.due}else{rt.status=2;rt.doneAt=dateKey()}rt.cnt=(rt.cnt||0)+1;saveTask(rt)}
  popup(done===all?'루틴 완주':'루틴 끝','🏁',`<b>${esc(R.name)}</b> ${done}/${all}단계 · ${mmss(tot)} (목표 ${R.target}분)<br><b>+${e.xp} XP</b>${done===all&&sp.bonus?` <span class="muted">(${esc(sp.tier)} +${sp.bonus})</span>`:''}`,done===all?sp.tier:'수고했어요');
}
function endRun(keep){RUN=null;runSave();clearInterval(runIv);$('hunt').hidden=true;$('huntPill').hidden=true;document.body.style.overflow='';document.title=docTitle();releaseWake();if(!keep)toast('그만뒀어요')}
$('hunt').addEventListener('click',e=>{const b=e.target.closest('[data-hunt]');if(b)huntDo(b.dataset.hunt)});
$('huntPill').addEventListener('click',openHunt);
