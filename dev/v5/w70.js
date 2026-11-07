/* ================= v7.0: '언제?' 하나로 · 알림 겹침 · 목록 색 선명하게 · 🌊 몰입 타이머 · 할 일 화면 목록 편집 · 규칙 바로 고치기 ================= */

/* ---- 1) '언제?' 하나로 (날짜 줄 + '언제 했나요?' 줄 → 한 줄) ----
   방금 · 1시간 전 · 아침에 = 오늘, 어제 · 그저께, 📅 직접 = 날짜 + 시각. 기록고치기 창은 '📅 날짜' + 시각 칸 그대로. */
function whenHTML(S){
  const td=dateKey();if(!S.d69)S.d69=S.e?S.edit.date:curDay().date;if(S.d69>td)S.d69=td;
  const D=S.d69,off=diffDays(td,D);
  const k=S.w70||(S.atK==='run'&&off===0?'run':off===0?(S.atK==='pick'?'pick':(S.atK||'now')):off===1&&!S.at?'y1':off===2&&!S.at?'y2':'pick');
  const a=S.a,v=a&&a.opts&&a.opts.length?pickVariant(a,atHour(S.at)):null;
  const ch=[...(S.atK==='run'&&off===0?[['run','⏱ 시작 '+(S.at||'')]]:[]),['now','방금'],['1h','1시간 전'],['am','아침에'],['y1','어제'],['y2','그저께'],['pick','📅 직접']];
  const when=(D===td?'오늘':d69lbl(D))+(S.at?' '+ampm(S.at):D===td?' 지금('+ampm(stamp())+')':'');
  const bonus=D===td?(otbCfg69().on&&otbCfg69().xp>0?`<span class="tiny muted">✍ 그날 적어서 ✨+${otbCfg69().xp}</span>`:''):'<span class="tiny warn69">지난 날 기록 · 그날 기록 보너스(✍) 없음</span>';
  return `<div class="when w70"><span class="small muted">📅 언제?</span>${ch.map(([x,l])=>`<button type="button" class="chipbtn" data-w70="${x}" aria-pressed="${k===x}">${esc(l)}</button>`).join('')}
    ${k==='pick'?`<span class="w70p"><input type="date" data-w70d="1" max="${td}" value="${D}" aria-label="날짜"><input type="time" data-w70t="1" value="${esc(S.at||'')}" aria-label="시각 (비우면 지금 시각)"></span>`:''}
    <span class="w70s small"><b>${esc(when)}</b>에 한 걸로${v&&!S.vidMan?` · '${esc(v.name)}' 골라 둠`:''} ${bonus}</span></div>`}
function set70(k){const S=sheetCtx;if(!S)return;sheetRead();const td=dateKey();
  if(k==='run'){S.w70='run';S.d69=td}
  else if(k==='now'){S.w70='now';S.d69=td;S.atK='now';S.at=null}
  else if(k==='1h'){const d=new Date(Date.now()-3600e3);S.w70='1h';S.d69=td;S.atK='1h';S.at=pad(d.getHours())+':'+pad(d.getMinutes())}
  else if(k==='am'){S.w70='am';S.d69=td;S.atK='am';S.at='08:00'}
  else if(k==='y1'||k==='y2'){S.w70=k;S.d69=addDays(td,k==='y1'?-1:-2);S.atK='pick';S.at=null}
  else if(k==='pick'){S.w70='pick';S.atK='pick'}
  if(S.a&&!S.vidMan&&S.a.opts&&S.a.opts.length){const v=pickVariant(S.a,atHour(S.at));S.vid=v?v.id:S.vid}
  drawDoneSheet()}
addEventListener('click',e=>{const b=e.target.closest('[data-w70]');if(!b)return;e.preventDefault();e.stopPropagation();set70(b.dataset.w70)},true);
addEventListener('change',e=>{const i=e.target,S=sheetCtx;if(!i||!i.dataset||!S)return;
  if(i.dataset.w70d){e.stopPropagation();sheetRead();let v=i.value||dateKey();if(v>dateKey())v=dateKey();S.d69=v;S.w70='pick';S.atK='pick';drawDoneSheet();return}
  if(i.dataset.w70t){e.stopPropagation();sheetRead();S.at=i.value||null;S.w70='pick';S.atK='pick';if(S.a&&!S.vidMan&&S.a.opts&&S.a.opts.length){const v=pickVariant(S.a,atHour(S.at));S.vid=v?v.id:S.vid}drawDoneSheet()}},true);
drawDoneSheet=(function(prev){return function(){const S=sheetCtx;const x=prev.apply(this,arguments);
  try{const c=$('sheetC');if(S&&!S.e&&c.querySelector('.w70'))c.querySelectorAll('.d69').forEach(el=>el.remove());   // v6.9 날짜 줄은 빼고 '언제?' 하나로
    if(S&&S.e){const l=c.querySelector('.d69 .small.muted');if(l)l.textContent='📅 날짜'}}catch(e){console.error(e)}
  return x}})(drawDoneSheet);

/* ---- 2) 알림이 아래 기록 알림(스낵바)과 겹치지 않게 ---- */
function lift70(){const t=$('toast'),s=$('snack');if(!t)return;if(s&&!s.hidden){const r=s.getBoundingClientRect();if(r.height)t.style.bottom=Math.round(innerHeight-r.top+8)+'px'}else t.style.bottom=''}
toast=(function(prev){return function(){const r=prev.apply(this,arguments);try{lift70()}catch(e){}return r}})(toast);
var DOPA70=/^기록했어요\. 다음에 당길 땐/;
toastAct=(function(prev){return function(m,label,fn){
  try{const s=$('snack');if(DOPA70.test(String(m||''))&&s&&!s.hidden&&!s.querySelector('[data-snack70]')){   // 나쁜 행동 뒤 '대신할 것' = 스낵바 안 버튼으로
    const u=s.querySelector('[data-snack="undo"]');const b=document.createElement('button');b.dataset.snack70='dopa';b.textContent='🍬 대신할 것';b.title='다음에 당길 땐 대신할 것부터';
    if(u)u.before(b);else s.appendChild(b);clearTimeout(snackT);snackT=setTimeout(()=>{s.hidden=true},9000);return}}catch(e){}
  const r=prev.apply(this,arguments);try{lift70()}catch(e){}return r}})(toastAct);
snack=(function(prev){return function(){const r=prev.apply(this,arguments);try{const t=$('toast');if(t&&t.classList.contains('on'))lift70()}catch(e){}return r}})(snack);
addEventListener('click',e=>{const b=e.target.closest('#snack [data-snack70]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();$('snack').hidden=true;try{openDopaNow('urge')}catch(x){console.error(x)}},true);

/* ---- 3) 목록 색: 서로 더 다르게 (밝기 차이를 크게 · 파랑 없음) + 진하게 칠하기 ---- */
var LCOL70=[['','색 없음'],['#e03131','빨강'],['#f76707','주황'],['#fab005','노랑'],['#82c91e','연두'],['#2b8a3e','초록'],['#9c36b5','보라'],['#e64980','분홍'],['#8d5524','갈색'],['#343a40','먹색'],['#adb5bd','회색']];
(function(){try{LCOL61.length=0;LCOL70.forEach(c=>LCOL61.push(c))}catch(e){}})();
var LMAP70={'#d64545':'#e03131','#e07a10':'#f76707','#c9a227':'#fab005','#3f9a4a':'#2b8a3e','#8a5cc7':'#9c36b5','#d14f92':'#e64980','#8a6a4a':'#343a40','#7d8594':'#adb5bd','#7aa83a':'#82c91e','#e8956b':'#f76707','#9b3a6e':'#e64980','#8d8a3a':'#8d5524'};
function lcolPlan68(){const R=[[/fixed|고정|일정|약속/,'#e03131'],[/atelier|작품|작업|창작|시나리오|영화/,'#fab005'],[/project|프로젝트/,'#9c36b5'],[/personal|개인|볼일|errand|잡무/,'#343a40'],[/limen|경계|eos|vesper|lethe/,'#f76707'],
    [/습관|habit/,'#2b8a3e'],[/루틴|routine/,'#e64980'],[/inbox|기본/,'#adb5bd'],[/공부|독서|책|성장|study/,'#82c91e'],[/돈|경제|가계|money/,'#8d5524']];
  const PAL=LCOL70.map(x=>x[0]).filter(Boolean),used=new Set(),out={};
  const ls=C.lists.slice().sort((a,b)=>(a.id==='Lhabit'||a.id==='Lrt')-(b.id==='Lhabit'||b.id==='Lrt'));
  const want=l=>{if(l.id==='Lhabit')return '#2b8a3e';if(l.id==='Lrt')return '#e64980';const n=lnorm(l.name)+' '+String(l.id||'').toLowerCase();const m=R.find(([re])=>re.test(n));return m?m[1]:null};
  ls.forEach(l=>{const w=want(l);if(w&&!used.has(w)){out[l.id]=w;used.add(w)}});
  ls.forEach(l=>{if(out[l.id])return;const c=PAL.find(p=>!used.has(p))||PAL[Object.keys(out).length%PAL.length];out[l.id]=c;used.add(c)});return out}
// 한 번: 예전 자동 색(또는 예전 팔레트 색)이면 새 색으로. 직접 고른 다른 색은 그대로.
function lcolMig70(){if(C.mig70col||!C.lists||!C.lists.length||!C.mig68col)return;const plan=lcolPlan68();C.lcolBak70={at:Date.now(),c:Object.fromEntries(C.lists.map(l=>[l.id,l.color||'']))};let n=0;
  C.lists.forEach(l=>{if(!l.color)return;if(LMAP70[l.color]){l.color=plan[l.id]||LMAP70[l.color];n++}});C.mig70col=1;save('config');
  if(n)later(()=>toastAct('🎨 목록 색을 더 잘 구별되게 바꿨어요','예전 색으로',()=>{const B=C.lcolBak70;if(!B)return;C.lists.forEach(l=>{if(l.id in B.c){if(B.c[l.id])l.color=B.c[l.id];else delete l.color}});save('config');render();toast('예전 색으로 돌렸어요')},9000))}
function lcOf70(t){const l=t&&C.lists.find(z=>z.id===(t.list||'inbox'));return l&&l.color?l:null}
renderCal=(function(prev){return function(){const x=prev.apply(this,arguments);try{
  if((C.ui.cal||{}).color==='list')document.querySelectorAll('#calPane [data-ctask]').forEach(el=>{const l=lcOf70(TASKS[el.dataset.ctask]);if(!l)return;const c=l.color;
    el.classList.add('lc70');el.style.setProperty('--lc70',c);el.style.borderLeft=`4px solid ${c}`;el.style.background=`color-mix(in srgb,${c} 34%,var(--panel))`;if(!el.title)el.title='목록: '+(l.name||'')})}catch(e){console.error(e)}return x}})(renderCal);
function rowCols68(){const sel=((C.ui.tasks||{}).sel)||'';const one=/^l:/.test(sel);
  document.querySelectorAll('.trow[data-task]').forEach(el=>{const t=TASKS[el.dataset.task],l=t&&C.lists.find(z=>z.id===(t.list||'inbox'));const c=l&&l.color;
    el.classList.toggle('lc68',!!c&&!(one&&el.closest('#tList')));if(c)el.style.setProperty('--lc68',c);else el.style.removeProperty('--lc68');if(c&&!el.title)el.title='목록: '+(l.name||'');
    if(c){const nm=listName(t.list||'inbox');el.querySelectorAll('.tm > span').forEach(s=>{if(!s.classList.contains('lt70')&&s.textContent===nm){s.classList.add('lt70')}})}})}

/* ---- 4) 🌊 몰입 타이머: 목표 = 최소 시간. 넘겨도 괜찮고, 넘긴 만큼 조금씩 보너스 ----
   tmode 'flow' (할 일 t.tmode · 카드 a.tmode · 루틴 단계 = 그 단계 할 일의 tmode). 최소 시간을 채우면 부드러운 소리 한 번,
   그 뒤 10분마다 몰입 보너스(50분까지). 루틴 완주 '빠르기'는 넘긴 시간을 빼고 셈. */
var LM70=null,FX70=0,FS70=null;
speedOf=(function(prev){return function(el,tgtMin,base,mode){
  if(!mode){if(typeof RUN!=='undefined'&&RUN&&RUN.kind!=='routine'&&RUN.mode)mode=RUN.mode;else if(LM70)mode=LM70}   // 끝낼 때 방식이 안 넘어가서 '⚡ 빠를수록'이 안 먹던 것도 고침
  if(FX70)el=Math.max(0,el-FX70);
  if(mode==='flow'){const tgt=Math.max(1,tgtMin)*60;if(el<tgt)return{tier:'처치',bonus:0,r:el/tgt};
    const ex=Math.min(5,Math.floor((el-tgt)/600)),u=Math.max(1,Math.round((+base||10)*.1));
    return{tier:ex?`🌊 몰입 처치 (+${ex*10}분)`:'🌊 최소 시간 채움',bonus:Math.max(1,Math.round((+base||10)*.25))+ex*u,r:1,flow:1}}
  return prev.call(this,el,tgtMin,base,mode)}})(speedOf);
endRun=(function(prev){return function(){try{if(RUN&&RUN.kind!=='routine'){LM70=RUN.mode||null;setTimeout(()=>{LM70=null},0)}}catch(e){}return prev.apply(this,arguments)}})(endRun);
function stepTask70(){if(!RUN||RUN.kind!=='routine')return null;const st=RUN.steps[RUN.si];return st&&st.tid&&TASKS[st.tid]||null}
function flowOn70(){if(!RUN)return false;if(RUN.kind==='routine'){const st=RUN.steps[RUN.si],t=stepTask70(),a=st&&((st.aid&&st.aid[0]!=='@'&&C.actions.find(x=>x.id===st.aid))||(t&&t.aid&&C.actions.find(x=>x.id===t.aid)));return !!((t&&t.tmode==='flow')||(a&&a.tmode==='flow'))}return RUN.mode==='flow'}
function chime70(){try{const A=new (window.AudioContext||window.webkitAudioContext)();[[523,0],[784,.22]].forEach(([f,t])=>{const o=A.createOscillator(),g=A.createGain();o.type='sine';o.frequency.value=f;o.connect(g);g.connect(A.destination);g.gain.setValueAtTime(.0001,A.currentTime+t);g.gain.exponentialRampToValueAtTime(.09,A.currentTime+t+.04);g.gain.exponentialRampToValueAtTime(.0001,A.currentTime+t+.9);o.start(A.currentTime+t);o.stop(A.currentTime+t+.95)})}catch(e){}}
drawHunt=(function(prev){return function(full){
  const fl=flowOn70();let key=0;
  if(fl&&RUN){key=RUN.kind==='routine'?RUN.si+1:1;if(!RUN.beeped)RUN.beeped=key}   // 삐삐 경고음 대신 아래 부드러운 소리
  const x=prev.apply(this,arguments);
  try{const h=$('hunt');if(!h)return x;h.classList.toggle('flow70',!!(fl&&RUN));if(!fl||!RUN)return x;
    const isR=RUN.kind==='routine',st=isR?RUN.steps[RUN.si]:null,el=isR?stepElapsed():runElapsed(),tgt=(isR?(+st.min||5):RUN.target)*60;
    h.classList.remove('over');
    const sub=$('huntSub');if(sub)sub.textContent=el<tgt?`🌊 최소 ${mmss(tgt)} · ${mmss(tgt-el)} 남음 · 넘겨도 괜찮아요`:`🌊 최소 시간 채움 · ${mmss(el-tgt)} 더 하는 중 · 재밌으면 계속`;
    if(el>=tgt&&RUN.chime70!==key){RUN.chime70=key;runSave();chime70();buzz(40);toast('🌊 최소 시간 채웠어요 · 더 하고 싶으면 계속해요')}
    if(full){const m=h.querySelector('.arena > .small.muted');const t=isR?stepTask70():null;const base=isR?(t?taskBase(t).xp:10):(runBaseXP()||10);
      if(m){const u=Math.max(1,Math.round(base*.1)),b0=Math.max(1,Math.round(base*.25));m.innerHTML=`🌊 <b>몰입</b> · 최소 시간을 채우면 ✨+${b0}, 그 뒤 10분마다 ✨+${u} (50분까지) · 일찍 끝내도 기본 보상은 그대로`}}
  }catch(e){console.error(e)}
  return x}})(drawHunt);
routineStep62=(function(prev){return function(k){
  try{if(k==='done'&&RUN&&RUN.kind==='routine'&&flowOn70()){const st=RUN.steps[RUN.si],el=stepElapsed(),t=stepTask70(),tgt=(+st.min||5)*60;
    if(t)FS70=speedOf(el,+st.min||5,taskBase(t).xp,'flow');RUN.flowX70=(RUN.flowX70||0)+Math.max(0,el-tgt);runSave()}}catch(e){console.error(e)}
  try{return prev.apply(this,arguments)}finally{FS70=null}}})(routineStep62);
completeTask=(function(prev){return function(t,ctx){if(FS70&&FS70.bonus&&ctx&&!ctx.spd)ctx.spd=FS70;return prev.apply(this,arguments)}})(completeTask);
finishRoutine=(function(prev){return function(){FX70=(RUN&&+RUN.flowX70)||0;try{return prev.apply(this,arguments)}finally{FX70=0}}})(finishRoutine);
// 사냥 화면 방식 고르기에 🌊 몰입
drawHunt=(function(prev){return function(full){const x=prev.apply(this,arguments);try{const box=$('huntSet');if(box&&RUN&&RUN.kind!=='routine'){
  const seg=box.querySelector('.seg');if(seg&&!seg.querySelector('[data-x56rmode="flow"]')){seg.insertAdjacentHTML('beforeend',`<button data-x56rmode="flow" aria-pressed="${RUN.mode==='flow'}" title="목표 = 최소 시간 · 넘겨도 괜찮아요">🌊 몰입</button>`);
    if(RUN.mode==='flow')seg.querySelectorAll('[data-x56rmode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.x56rmode==='flow')))}
  const tx=box.querySelector('span.tiny');if(tx&&RUN.mode==='flow'&&/목표 \d+분 ·/.test(tx.textContent))tx.textContent=`최소 ${RUN.target}분 · 🌊 몰입 (넘기면 보너스)`}}catch(e){}return x}})(drawHunt);
// 할 일 상세 타이머 칸에 🌊 몰입
drawTaskSheet=(function(prev){return function(){const x=prev.apply(this,arguments);try{const c=$('sheetC'),sp=c.querySelector('[data-x56tmode="speed"]'),t=sheetCtx&&sheetCtx.task&&TASKS[sheetCtx.task];
  if(sp&&!c.querySelector('[data-x56tmode="flow"]')){sp.insertAdjacentHTML('afterend',`<button data-x56tmode="flow" aria-pressed="${!!(t&&t.tmode==='flow')}" title="목표 = 최소 시간. 넘겨도 괜찮고 넘긴 만큼 보너스 (독서처럼 재밌으면 더 하는 일)">🌊 몰입</button>`);
    if(t&&t.tmode==='flow'){const lb=sp.closest('.row')&&sp.closest('.row').querySelector('label');if(lb&&lb.firstChild&&lb.firstChild.nodeType===3)lb.firstChild.textContent='최소'}}
  const ch=c.querySelector('[data-x56panel="timer"]');if(ch&&t&&t.tmode==='flow')ch.innerHTML=ch.innerHTML.replace(/· (시간 안에|빠를수록)/,'· 🌊 몰입')}catch(e){console.error(e)}return x}})(drawTaskSheet);
// 루틴 단계 줄에 🌊 (단계마다 켜고 끄기)
stRow62=(function(prev){return function(r,s,i,o){let h=prev.apply(this,arguments);try{const t=s&&s.tid&&TASKS[s.tid];if(!t||s.aid==='@weigh')return h;const on=t.tmode==='flow';
  const btn=`<button type="button" class="ib fl70" data-fl70="${t.id}" aria-pressed="${on}" title="${on?'🌊 몰입: 이 시간은 최소, 넘겨도 괜찮아요 (누르면 끔)':'🌊 몰입으로: 이 시간을 최소로 (재밌으면 더 해도 돼요)'}">🌊</button>`;
  if(/분<\/label>/.test(h))h=h.replace(/분<\/label>/,'분</label>'+btn);else h=h.replace(new RegExp(`(<span class="tiny muted">${+s.min||0}분)(</span>)`),`$1${on?'↑ 🌊':''}$2`)}catch(e){}return h}})(stRow62);
addEventListener('click',e=>{const b=e.target.closest('[data-fl70]');if(!b)return;e.preventDefault();e.stopPropagation();const t=TASKS[b.dataset.fl70];if(!t)return;
  if(t.tmode==='flow')delete t.tmode;else t.tmode='flow';saveTask(t);try{rt62redraw()}catch(x){render()}toast(t.tmode==='flow'?`🌊 '${t.title}' — 최소 시간만 채우면 돼요, 넘겨도 보너스`:`'${t.title}' 몰입 끔 (보통 타이머)`)},true);
// 한 번: 루틴의 '독서' 단계는 몰입으로 (사용자 요청: 독서는 30분 안에 끝낼 일이 아님)
function flowMig70(){if(C.mig70flow||!C.mig62||!tAll64())return;let n=[];
  (C.routines||[]).forEach(r=>(r.steps||[]).forEach(s=>{const t=s.tid&&TASKS[s.tid];if(t&&/독서|책\s*읽|읽기/.test(t.title||'')&&!t.tmode){t.tmode='flow';saveTask(t);n.push(t)}}));
  C.mig70flow=1;save('config');if(n.length)later(()=>toastAct(`🌊 루틴의 '${n[0].title}'${n.length>1?` 외 ${n.length-1}개`:''} 단계를 몰입 타이머로 바꿨어요`,'되돌리기',()=>{n.forEach(t=>{delete t.tmode;saveTask(t)});render()},9000))}

/* ---- 5) 할 일 화면에서 목록 편집 (폰에서도) ---- */
var SYS70=['inbox','Lhabit','Lrt'];
function ls70HTML(){const cnt=id=>Object.values(TASKS).filter(t=>t.status===0&&(t.list||'inbox')===id).length;
  return `<div class="ls70">${C.lists.map((l,i)=>{const sys=SYS70.includes(l.id),op=ui.ls70c===l.id;
    return `<div class="ls70r ${op?'on':''}"><button type="button" class="ls70d" data-ls70c="${l.id}" style="--c:${l.color||'transparent'}" aria-label="색 바꾸기" title="색 바꾸기">${l.color?'':'∅'}</button>
      <input data-ls70n="${l.id}" value="${esc(l.name)}" maxlength="40" ${l.id==='inbox'?'disabled':''} aria-label="목록 이름">
      <span class="tiny muted num">${cnt(l.id)}</span>
      <button type="button" class="ib" data-ls70op="open:${l.id}" title="이 목록 보기" aria-label="이 목록 보기">↗</button>
      <button type="button" class="ib" data-ls70op="up:${l.id}" ${i?'':'disabled'} aria-label="위로">↑</button><button type="button" class="ib" data-ls70op="dn:${l.id}" ${i<C.lists.length-1?'':'disabled'} aria-label="아래로">↓</button>
      <button type="button" class="ib" data-ls70op="del:${l.id}" ${sys?'disabled title="기본 목록은 못 지워요"':'title="지우기 (할 일은 기본함으로)"'} aria-label="지우기">🗑</button>
      ${op?`<div class="ls70c">${LCOL70.map(([c,n])=>`<button type="button" class="chipbtn lc61" data-ls70col="${l.id}|${c}" aria-pressed="${(l.color||'')===c}"><i style="background:${c||'transparent'}"></i>${n}</button>`).join('')}
        <label class="small row" style="gap:6px;flex-basis:100%">📁 폴더<input data-ls70f="${l.id}" value="${esc(l.folder||'')}" placeholder="없음" maxlength="30" style="flex:1"></label></div>`:''}</div>`}).join('')}
    <form class="ls70add" data-ls70add="1"><input id="ls70New" placeholder="＋ 새 목록 이름 (앞에 이모지를 넣으면 캘린더에 그 이모지)" maxlength="40" enterkeyhint="done" autocomplete="off"><button class="btn sm" type="submit">추가</button></form>
    <p class="help" style="margin:8px 0 0">색 점을 누르면 색·폴더를 바꿔요. 색은 이름과 함께 보여서 색이 비슷해 보여도 구별돼요. 이름 앞 이모지가 캘린더 칸 앞에 붙어요.</p></div>`}
function listSheet70(){sheetCtx={ls70:1};openSheet(`<div class="sh"><h3>📂 목록 편집</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div><div id="ls70box">${ls70HTML()}</div>`)}
function ls70redraw(){const b=$('ls70box');if(b){const y=$('sheetC').scrollTop;b.innerHTML=ls70HTML();$('sheetC').scrollTop=y}renderTasks()}
addEventListener('click',e=>{const b=e.target.closest('[data-ls70c],[data-ls70op],[data-ls70col],[data-ls70open]');if(!b)return;e.preventDefault();e.stopPropagation();const d=b.dataset;
  if(d.ls70open){listSheet70();return}
  if(d.ls70c){ui.ls70c=ui.ls70c===d.ls70c?'':d.ls70c;ls70redraw();return}
  if(d.ls70col){const[id,c]=d.ls70col.split('|'),l=C.lists.find(x=>x.id===id);if(!l)return;if(c)l.color=c;else delete l.color;save('config');ls70redraw();return}
  const[op,id]=d.ls70op.split(':'),i=C.lists.findIndex(x=>x.id===id),l=C.lists[i];if(!l)return;
  if(op==='open'){C.ui.tasks.sel='l:'+id;save('config');closeSheet();location.hash='tasks';render();return}
  if(op==='up'||op==='dn'){const j=op==='up'?i-1:i+1;if(j<0||j>=C.lists.length)return;[C.lists[i],C.lists[j]]=[C.lists[j],C.lists[i]];save('config');ls70redraw();return}
  if(op==='del'&&!SYS70.includes(id)){const snap=clone(C.lists),moved=Object.values(TASKS).filter(t=>t.list===id);moved.forEach(t=>{t.list='inbox';saveTask(t)});C.lists=C.lists.filter(x=>x!==l);
    if((C.ui.tasks||{}).sel==='l:'+id)C.ui.tasks.sel='today';save('config');ls70redraw();toastAct(`'${l.name}' 목록을 지웠어요${moved.length?` (할 일 ${moved.length}개는 기본함으로)`:''}`,'되돌리기',()=>{C.lists=snap;moved.forEach(t=>{t.list=id;saveTask(t)});save('config');ls70redraw();render()})}},true);
addEventListener('change',e=>{const i=e.target;if(!i||!i.dataset)return;
  if(i.dataset.ls70n){e.stopPropagation();const l=C.lists.find(x=>x.id===i.dataset.ls70n),v=i.value.trim();if(l&&v&&v!==l.name){l.name=v;save('config');renderTasks();toast('이름을 바꿨어요')}return}
  if(i.dataset.ls70f){e.stopPropagation();const l=C.lists.find(x=>x.id===i.dataset.ls70f);if(l){l.folder=i.value.trim();save('config');renderTasks()}return}
  if(i.id==='ls70New')e.stopPropagation()},true);
addEventListener('keydown',e=>{if(e.key!=='Enter'||!e.target||!e.target.dataset)return;if(e.target.dataset.ls70n||e.target.dataset.ls70f){e.preventDefault();e.target.blur()}},true);
addEventListener('submit',e=>{const f=e.target.closest&&e.target.closest('[data-ls70add]');if(!f)return;e.preventDefault();e.stopPropagation();const inp=$('ls70New'),n=(inp.value||'').trim();if(!n)return;
  const used=new Set(C.lists.map(l=>l.color).filter(Boolean)),c=LCOL70.map(x=>x[0]).filter(Boolean).find(x=>!used.has(x));
  const l={id:'l'+uid(),name:n,folder:'',area:'life'};if(c)l.color=c;C.lists.push(l);C.lcolSeen68=[...new Set([...(C.lcolSeen68||[]),l.id])];save('config');ls70redraw();toast(`'${n}' 목록을 만들었어요`);setTimeout(()=>{const x=$('ls70New');if(x)x.focus()},30)},true);
// 들어가는 곳: 할 일 화면 목록 고르기 옆 ✎ 버튼 · 고르기 맨 아래 '목록 편집…'
renderTasks=(function(prev){return function(){const x=prev.apply(this,arguments);try{const s=$('tListSel');if(s){
  if(!s.querySelector('option[value="__ls70"]'))s.insertAdjacentHTML('beforeend','<option value="__ls70">✎ 목록 편집…</option>');
  const cur=((C.ui.tasks||{}).sel||'').match(/^l:(.+)/),l=cur&&C.lists.find(z=>z.id===cur[1]);if(l&&l.color){s.style.boxShadow=`inset 4px 0 0 ${l.color}`}else s.style.boxShadow='';
  if(!s.nextElementSibling||!s.nextElementSibling.dataset||!s.nextElementSibling.dataset.ls70open)s.insertAdjacentHTML('afterend','<button type="button" class="chipbtn ls70b" data-ls70open="1" title="목록 편집 (이름·색·순서·추가·지우기)" aria-label="목록 편집">✎</button>')}}catch(e){console.error(e)}return x}})(renderTasks);
addEventListener('change',e=>{const s=e.target;if(!s||s.id!=='tListSel'||s.value!=='__ls70')return;e.stopPropagation();e.preventDefault();s.value='';listSheet70()},true);

/* ---- 6) 우클릭(폰 꾹) 더: 루틴 단계 줄 · 유리병 ---- */
function stepAt70(tid){for(const r of (C.routines||[])){const i=(r.steps||[]).findIndex(s=>s.tid===tid);if(i>=0)return{r,i}}return null}
function r62op70(v){const b=document.createElement('button');b.dataset.r62op=v;b.hidden=true;document.body.appendChild(b);try{b.click()}finally{b.remove()}}
addEventListener('contextmenu',e=>{const row=e.target.closest('.st62');if(row&&!e.target.closest('input,textarea,select')){const nb=row.querySelector('[data-x60task]'),tid=nb&&nb.dataset.x60task,f=tid&&stepAt70(tid);if(!f)return;
    e.preventDefault();e.stopPropagation();const{r,i}=f,t=TASKS[tid],n=r.steps.length,x=e.clientX,y=e.clientY;
    menu61(x,y,`⏱ ${esc(r.name)} · ${i+1}단계`,[
      {l:'✎ 이 단계 할 일 열기',f:()=>openTaskSheet(tid)},
      {l:t&&t.tmode==='flow'?'🌊 몰입 끄기 (보통 타이머)':'🌊 몰입으로 (최소 시간, 넘겨도 보너스)',dis:!t,f:()=>{if(t.tmode==='flow')delete t.tmode;else t.tmode='flow';saveTask(t);try{rt62redraw()}catch(x){render()}}},
      '-',{l:'↑ 위로',dis:i===0,f:()=>r62op70(`up:${r.id}:${i}`)},{l:'↓ 아래로',dis:i>=n-1,f:()=>r62op70(`dn:${r.id}:${i}`)},
      {l:'🃏 카드와 잇기',dis:!t||!!t.aid,f:()=>r62op70(`card:${r.id}:${i}`)},
      '-',{l:'× 루틴에서 빼기',bad:1,dis:n<=1,f:()=>r62op70(`del:${r.id}:${i}`)}]);return}
  const jc=e.target.closest('[data-viewjar]');if(jc){const j=C.jars.find(z=>z.id===jc.dataset.viewjar);if(!j)return;e.preventDefault();e.stopPropagation();
    menu61(e.clientX,e.clientY,`🔮 ${esc(j.name)}`,[
      {l:'👁 이 병 보기',f:()=>{ui.jarView=j.id;render()}},
      {l:'🎨 꾸미기',f:()=>{const b=document.querySelector('[data-deco66],[data-jdeco66]');if(b)b.click();else editSheet70('jars','🔮 유리병·구슬')}},
      {l:'↕ 순서 · 구슬 개수',f:()=>{const b=document.querySelector('[data-ro67open]');if(b)b.click()}},
      {l:'⚙ 병 규칙 바꾸기',f:()=>editSheet70('jars','🔮 유리병·구슬 규칙')}])}},true);

/* ---- 7) 편집 화면에 안 가고 규칙 바꾸기 (그 탭을 창으로) + ✍ 보너스·할 일 날짜 바뀌는 시각 ---- */
var ES70=null;
function editSheet70(tab,title){try{const eb=$('editBody');if(!eb)return;if(ES70)closeSheet();
  sheetCtx={es70:tab};openSheet(`<div class="sh"><h3>${esc(title||'규칙')}</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div><div id="es70"></div><p class="help" style="margin-top:8px">바꾼 건 바로 저장돼요. 전체 편집은 메뉴 → 편집.</p>`);
  ES70={eb,home:eb.parentNode,next:eb.nextSibling,keep:ui.edit};$('es70').appendChild(eb);ui.edit=tab;renderEdit();
  sheetCtx.onClose=()=>{const s=ES70;ES70=null;if(!s)return;try{s.home.insertBefore(s.eb,s.next&&s.next.parentNode===s.home?s.next:null)}catch(x){s.home.appendChild(s.eb)}ui.edit=s.keep||ui.edit;if(curView()==='edit')renderEdit()}}catch(e){console.error(e)}}
function rules70HTML(){const o=otbCfg69();
  return `<div class="r70"><h3 style="margin-top:16px">기록 · 날짜</h3><div class="kv" style="margin-top:6px">
    <label>✍ 그날 기록 보너스<select data-r70="otb.on"><option value="1" ${o.on?'selected':''}>켜기</option><option value="" ${o.on?'':'selected'}>끄기</option></select></label>
    <label>✍ 보너스 XP (기록 하나에)<input type="number" min="0" max="20" data-r70="otb.xp" value="${o.xp}"></label>
    <label>✍ 하루 최대 XP<input type="number" min="0" max="200" data-r70="otb.max" value="${o.max}"></label>
    <label>할 일·캘린더 '오늘'이 바뀌는 때<select data-r70="mid"><option value="1" ${mid68On()?'selected':''}>자정 (점수·HP는 ${C.dayStart||0}시)</option><option value="" ${mid68On()?'':'selected'}>점수와 같이 ${C.dayStart||0}시</option></select></label></div></div>`}
renderEdit=(function(prev){return function(){const x=prev.apply(this,arguments);try{if(ui.edit==='rules'){const eb=$('editBody');if(eb&&!eb.querySelector('.r70')){const hs=[...eb.querySelectorAll('h3')].find(h=>/초기화/.test(h.textContent));const w=document.createElement('div');w.innerHTML=rules70HTML();if(hs)hs.before(w.firstChild);else eb.appendChild(w.firstChild)}}}catch(e){console.error(e)}return x}})(renderEdit);
addEventListener('change',e=>{const i=e.target;if(!i||!i.dataset||!i.dataset.r70)return;e.stopPropagation();const k=i.dataset.r70,v=i.value;
  if(k.startsWith('otb.')){const o=C.otb69=C.otb69||{};const f=k.slice(4);if(f==='on')o.on=!!v;else o[f]=Math.max(0,Math.round(+v||0))}
  else if(k==='mid'){if(v)delete C.taskMid68;else C.taskMid68=false}
  save('config');render();toast('바꿨어요')},true);
// 들어가는 곳: 레벨·HP 정보 창 · 유리병 화면
infoFor=(function(prev){return function(k){const r=prev.apply(this,arguments);try{if(r&&(k==='lv'||k==='xp')&&typeof r==='object'&&'b' in r&&!/data-es70/.test(r.b))r.b+=`<div class="row" style="margin-top:8px;gap:6px;flex-wrap:wrap"><button class="btn ghost sm" data-es70="rules">⚙ 레벨·하루·기록 규칙</button><button class="btn ghost sm" data-es70="road">🗺 레벨 보상</button></div>`}catch(e){}return r}})(infoFor);
addEventListener('click',e=>{const b=e.target.closest('[data-es70]');if(!b)return;e.preventDefault();e.stopPropagation();const k=b.dataset.es70;editSheet70(k,k==='rules'?'⚙ 규칙':k==='road'?'🗺 레벨 보상':k==='jars'?'🔮 유리병·구슬 규칙':'편집')},true);
renderJars=(function(prev){return function(){const r=prev.apply(this,arguments);try{const bar=document.querySelector('.jbar66 .row');if(bar&&!bar.querySelector('[data-es70]'))bar.insertAdjacentHTML('beforeend','<button type="button" class="chipbtn" data-es70="jars">⚙ 병 규칙</button>')}catch(e){}return r}})(renderJars);

/* ---- 한 번만 하는 것들: 준비된 뒤 ---- */
render=(function(prev){return function(){try{if(ready&&C&&C.lists&&!(mode==='db'&&typeof SRV59!=='undefined'&&!SRV59.c)){lcolMig70();if(typeof tAll64==='function'&&tAll64())flowMig70()}}catch(e){console.error(e)}return prev.apply(this,arguments)}})(render);

F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['📅 언제? 하나로','행동 기록 창 맨 위','방금·1시간 전·아침에·어제·그저께·📅 직접(날짜+시각) 한 줄',()=>{location.hash='log'},'언제 날짜 시각 어제'],
  ['🌊 몰입 타이머','할 일 상세 ⏱ 칸 · 루틴 단계 🌊 · 사냥 화면','목표 = 최소 시간 · 넘겨도 괜찮고 10분마다 보너스',()=>{location.hash='tasks'},'몰입 독서 최소 타이머 넘겨도'],
  ['📂 목록 편집','할 일 화면 목록 고르기 옆 ✎','이름·색·순서·폴더·추가·지우기 (폰에서도)',()=>{location.hash='tasks';setTimeout(listSheet70,200)},'목록 리스트 편집 색 이름'],
  ['⚙ 규칙 바로 고치기','레벨 정보 창 · 유리병 ⚙ 병 규칙','편집 화면 안 가고 창에서',()=>editSheet70('rules','⚙ 규칙'),'규칙 레벨 곡선 병 보너스']])}})(F67);
