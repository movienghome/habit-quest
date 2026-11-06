/* ================= v6.5: 루틴 단계 불어남 근본 수정 · 캘린더 월 기본·카드 깔끔 · 쫄따구 얼굴·설명 · 루틴 줄 점수 · 🌱 10분만 · ☠ 삼진아웃 정리 · 😶 피하고 있어요 · 📝 나눠 쓰는 일기 · ⏳ 대기 모드 깨기 =================
   맨 끝 모듈(v5u 뒤). 최상위 값은 var/function. 앞 모듈 함수는 '다시 대입'으로 바꿔요. */

/* ---- 0) 루틴 단계 불어남 ----
   v6.4까지: 머리 할 일이 둘 이상이면 기기마다 '첫 번째'가 달라서(할 일 목록 순서), A 기기는 A 머리의 단계로, B 기기는 B 머리의 단계로
   순서표를 저장하며 서로 덮어썼어요(줄었다 늘었다 · 창 깜빡임). 옛 버전이 남은 기기는 단계를 또 만들었고, v6.4 정리는 한 번뿐이었어요.
   이제: ① 머리는 모든 기기에서 같은 규칙으로 하나만 고름 ② 서버 확인 뒤 겹친 머리·단계·습관 반복은 늘 정리(되돌리기·끄기 있음)
   ③ 사람이 일부러 같은 단계를 또 넣으면(dupok65) 정리하지 않음. */
var USR65=0,HEALTOLD65=0;
function rank65(a,b){ // 남길 것: 많이 한 것 → 최근에 한 것 → 먼저 만든 것 → id (기기마다 같은 답)
  return ((b.cnt||0)-(a.cnt||0))||String(b.last||'').localeCompare(String(a.last||''))||((+a.order||0)-(+b.order||0))||String(a.id).localeCompare(String(b.id))}
function headRank65(a,b){return ((b.rep&&b.rep.f?1:0)-(a.rep&&a.rep.f?1:0))||String(a.created||'').localeCompare(String(b.created||''))||((+a.order||0)-(+b.order||0))||String(a.id).localeCompare(String(b.id))}
function headsOf65(r){const o=[];for(const k in TASKS){const t=TASKS[k];if(t&&t.rid===r.id&&t.status===0)o.push(t)}return o.sort(headRank65)}
rtH62=(function(prev){return function(r,make){if(!r||!tasksReady)return null;const hs=headsOf65(r);if(hs.length)return hs[0];return prev(r,make)}})(rtH62);
// 사람이 직접 단계를 넣을 때는 같은 이름이어도 일부러 넣은 것
rtAdd61=(function(prev){return function(){USR65++;try{return prev.apply(this,arguments)}finally{USR65--}}})(rtAdd61);
mkChild62=(function(prev){return function(head){const t=prev.apply(this,arguments);try{if(USR65&&t&&kidsOf(head.id).some(k=>k.id!==t.id&&dupKey64(k)===dupKey64(t))){t.dupok65=1;saveTask(t)}}catch(e){}return t}})(mkChild62);
function bk65(t){const td=dateKey();if(!C.bak65||C.bak65.at!==td)C.bak65={at:td,tasks:[],routines:clone(C.routines||[])};const b=C.bak65;if(b.tasks.length<400&&!b.tasks.some(x=>x.id===t.id))b.tasks.push(clone(t))}
function heal65(){
  if(mode==='db'&&!SRV59.c)return;
  if(!ready||!tAll64()||!C.mig62||C.noHeal65)return;
  const del=new Set();let nH=0,nS=0,nB=0,ch=false;
  (C.routines||[]).forEach(r=>{
    const hs=headsOf65(r);if(!hs.length)return;const head=hs[0];
    hs.slice(1).forEach(h=>{bk65(h);kidsOf(h.id).forEach(k=>{bk65(k);k.parent=head.id;k.list=head.list;k.rstep=1;saveTask(k)});
      if(!(head.rep&&head.rep.f)&&h.rep&&h.rep.f){bk65(head);head.rep=h.rep;head.due=h.due;if(h.quest)head.quest=1;saveTask(head)}
      del.add(h.id);nH++});
    const grp={},map={};kidsOf(head.id).forEach(k=>{if(k.dupok65||del.has(k.id))return;const key=dupKey64(k);(grp[key]=grp[key]||[]).push(k)});
    Object.values(grp).forEach(g=>{if(g.length<2)return;g.sort(rank65);const keep=g[0];
      g.slice(1).forEach(k=>{bk65(k);if(k.last&&String(k.last)>String(keep.last||'')){keep.last=k.last;saveTask(keep)}map[k.id]=keep.id;del.add(k.id);nS++})});
    if(nH||Object.keys(map).length){const seen=new Set(),before=JSON.stringify(r.steps||[]);
      r.steps=(r.steps||[]).map(s=>map[s.tid]?{...s,tid:map[s.tid]}:s).filter(s=>{if(!s.tid)return true;if(del.has(s.tid)||seen.has(s.tid))return false;seen.add(s.tid);return true});
      if(JSON.stringify(r.steps)!==before)ch=true}});
  // 같은 카드에 붙은 습관 반복 할 일 여럿 → 하나(☑ 일퀘 먼저)
  const hg={};for(const k in TASKS){const t=TASKS[k];if(t&&t.status===0&&t.hab&&t.aid&&t.rep&&t.rep.f&&!del.has(t.id))(hg[t.aid]=hg[t.aid]||[]).push(t)}
  Object.values(hg).forEach(g=>{if(g.length<2)return;g.sort((a,b)=>((b.quest?1:0)-(a.quest?1:0))||rank65(a,b));g.slice(1).forEach(t=>{bk65(t);del.add(t.id);nB++})});
  if(!del.size&&!ch)return;
  del.forEach(id=>deleteTask(id));
  save('config');try{syncDailies(C)}catch(e){}
  HEALTOLD65+=del.size;
  if(del.size&&!heal65.told){heal65.told=1;later(()=>toastAct(`겹친 것을 정리했어요: ${nS?`루틴 단계 ${nS}개 `:''}${nH?`루틴 머리 ${nH}개 `:''}${nB?`습관 반복 ${nB}개`:''}`.trim(),'되돌리기',undo65,9000))}}
function undo65(){const b=C.bak65;if(!b)return;b.tasks.forEach(t=>saveTask(clone(t)));C.routines=clone(b.routines);delete C.bak65;C.noHeal65=dateKey();save('config');syncDailies(C);if(curView()==='edit')reEdit();render();toast('정리 전으로 되돌렸어요 · 자동 정리는 꺼 뒀어요 (편집 → 루틴에서 다시 켜요)')}
addEventListener('click',e=>{const b=e.target.closest('[data-x65heal]');if(!b)return;e.preventDefault();e.stopPropagation();const k=b.dataset.x65heal;
  if(k==='on'){delete C.noHeal65;save('config');heal65.told=0;render();toast('겹친 단계 자동 정리를 다시 켰어요')}else if(k==='undo')undo65();else if(k==='keep'){delete C.bak65;save('config');render();toast('정리한 그대로 둘게요')}
  if(curView()==='edit')reEdit()},true);
routinesEditHTML=(function(prev){return function(){const h=prev.apply(this,arguments);
  if(C.noHeal65)return `<div class="note64"><b>⏸ 겹친 단계 자동 정리가 꺼져 있어요</b><div class="tiny">같은 단계가 둘 이상이면 하나만 남기는 정리예요. 일부러 같은 단계를 두 번 넣었다면 단계 추가 칸으로 다시 넣어요(그건 정리하지 않아요).</div><div class="row" style="gap:6px;margin-top:6px"><button class="btn sm ghost" data-x65heal="on">다시 켜기</button></div></div>`+h;
  const b=C.bak65;if(b&&b.at===dateKey()&&b.tasks.length)return `<div class="note64"><b>🧹 오늘 겹친 것 ${b.tasks.length}개를 정리했어요</b><div class="tiny">기기마다 '첫 루틴 할 일'을 다르게 골라 서로 덮어쓰던 오류로 생긴 것들이에요.</div><div class="row" style="gap:6px;margin-top:6px"><button class="btn sm ghost" data-x65heal="undo">↺ 정리 전으로 (자동 정리 끔)</button><button class="btn sm ghost" data-x65heal="keep">이대로 둘게요</button></div></div>`+h;
  return h}})(routinesEditHTML);
// 앱이 다시 보일 때 새 버전이 있는지 확인 (옛 버전이 오래 떠 있지 않게)
document.addEventListener('visibilitychange',()=>{try{if(document.hidden||!navigator.serviceWorker)return;const n=Date.now();if(n-(window.__swc65||0)<3*60e3)return;window.__swc65=n;navigator.serviceWorker.getRegistration().then(r=>r&&r.update()).catch(()=>{})}catch(e){}});

/* ---- 1) 캘린더: 캘린더 화면은 늘 월 보기로 열려요 (할 일 옆 캘린더는 그대로) ---- */
var LV65='';
function calMonth65(){const v=curView();let ch=false;try{if(v==='cal'&&LV65!=='cal'&&!splitOn()){const c=calState();if(c.mode!=='month'){c.mode='month';ch=true;save('config')}}}catch(e){}LV65=v;return ch}
addEventListener('hashchange',()=>{if(calMonth65())try{renderCal()}catch(e){}});
// 날짜 카드: 다시 그릴 때 매번 '나타나기' 움직임이 반복돼 깜빡이던 것 → 처음 열 때만. 적던 글자·커서도 지켜요.
var CA65=null,CAS65=0;
addEventListener('submit',e=>{const f=e.target;if(f&&f.dataset&&f.dataset.taddform==='cal')CAS65=Date.now()},true);
renderCal=(function(prev){return function(){const a=$('calAdd');CA65=a?{v:a.value,f:document.activeElement===a,s:a.selectionStart}:null;
  const x=prev.apply(this,arguments);
  try{const b=$('calAdd');if(b&&CA65&&(CA65.v||CA65.f)){if(CA65.v&&!b.value&&Date.now()-CAS65>800)b.value=CA65.v;if(CA65.f){b.focus();try{b.setSelectionRange(CA65.s,CA65.s)}catch(e){}}}}catch(e){}
  return x}})(renderCal);
dp63=(function(prev){return function(){const x=prev.apply(this,arguments);
  try{const c=document.querySelector('.dp64c');if(!c){ui.dp65k='';return x}const k=ui.calSel;if(ui.dp65k===k)c.classList.add('still65');ui.dp65k=k}catch(e){}
  return x}})(dp63);

/* ---- 2) 쫄따구·보스: 얼굴이 보이게, 누르면 설명 ---- */
function mobCol65(el){const box=$('battleBox'),all=box?[...box.querySelectorAll('.mini')]:[],i=Math.max(0,all.indexOf(el));return MINI_COL[i%MINI_COL.length]}
function mobSheet65(id,col){const t=TASKS[id];if(!t)return;const k=mobKind61(t),M=MOB61.find(x=>x[0]===k)||MOB61[0],kind=MOBK64[k]||'task',open=t.status===0,r=rtOfT62(t);
  const b=taskBase(t),pts=r?`단계 합 ${pts62(rtSum62(r),{noCond:1})} · 완주 +${(+r.xp||0)} XP`:`처치하면 ✨${b.xp}${b.gold?` 💰${b.gold}`:''}`;
  sheetCtx={mob65:id};
  openSheet(`<div class="sh"><h3>${M[1]} ${esc(M[2])}</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
  <div class="mob65"><div class="pic">${minionSVG(col||MINI_COL[0],!open,kind)}</div><div>
    <p class="small" style="margin:0 0 6px">${esc(M[3])}</p>
    <p style="margin:0"><b>${r?'⏱ ':''}${esc(t.title)}</b></p>
    <p class="tiny muted" style="margin:2px 0 0">${open?`${t.due?esc(dueLabel(t.due))+(t.time?' '+esc(t.time):'')+' · ':''}${pts}`:'오늘 처치했어요 ✓'}${t.skull?` · ${'☠'.repeat(Math.min(3,t.skull))} ${t.skull}번 미룸`:''}</p></div></div>
  ${open?`<div class="row" style="gap:6px;flex-wrap:wrap;margin-top:12px">
    <button class="btn go sm" data-m65="done">${r?'✓ 체크로 기록':'✓ 처치 (끝내기)'}</button>
    <button class="btn ghost sm" data-m65="hunt">🏹 ${r?'타이머로':'사냥'}</button>
    ${r?'':'<button class="btn ghost sm" data-m65="taste">🌱 10분만</button>'}
    <button class="btn ghost sm" data-m65="open">✎ 할 일 열기</button>
    ${r?'':'<button class="btn ghost sm" data-m65="avoid">😶 피하고 있어요</button>'}</div>`:''}
  <p style="margin:12px 0 0"><button class="btn ghost sm" data-x61dex="1">📖 도감에서 다른 쫄따구 보기</button></p>`)}
function bossSheet65(){const td=dateKey(),bs=bossOf(td),ws=weekState(td),L=LORE61[bs.name]||['',''],ln=(typeof BLINE62!=='undefined'&&BLINE62[bs.name])||null;
  sheetCtx={boss65:1};
  openSheet(`<div class="sh"><h3>👾 이번 주 보스</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
  <div class="mob65 boss"><div class="pic">${bossSVG(bs.color,ws.dead,bs.name)}</div><div>
    <p style="margin:0"><b>${esc(bs.name)}</b> ${ws.dead?'<span class="qtag">처치!</span>':''}</p>
    <div class="track" style="margin:6px 0 2px"><div class="fill" style="width:${Math.round(ws.left/ws.hp*100)}%;background:var(--bad)"></div></div>
    <span class="tiny muted num">HP ${ws.left}/${ws.hp}${ws.crit?` · ⚔️ 치명타 ${ws.crit}번`:''}</span>
    ${L[0]?`<p class="small" style="margin:8px 0 2px">${esc(L[0])}</p>`:''}${L[1]?`<p class="tiny" style="margin:0">💡 약점: ${esc(L[1])}</p>`:''}</div></div>
  <p class="tiny muted" style="margin:10px 0 0">이번 주에 얻은 XP가 데미지예요. 나쁜 행동은 보스를 회복시키고, ⚔️ 용기는 치명타(한 번 더). 쓰러뜨리면 이 보스의 장비가 떨어져요.</p>
  <p style="margin:10px 0 0"><button class="btn ghost sm" data-x61dex="1">📖 도감 보기</button></p>`)}
addEventListener('click',e=>{
  const m=e.target.closest('#battleBox .mini');if(m){e.preventDefault();e.stopPropagation();const id=m.dataset.ctask||m.dataset.m65id;if(id&&TASKS[id])mobSheet65(id,mobCol65(m));else openDex61();return}
  const bo=e.target.closest('#battleBox .boss2');if(bo){e.preventDefault();e.stopPropagation();bossSheet65();return}
  const b=e.target.closest('[data-m65]');if(!b)return;e.preventDefault();e.stopPropagation();const id=(sheetCtx||{}).mob65,t=TASKS[id];if(!t)return;const k=b.dataset.m65,r=rtOfT62(t);
  closeSheet();
  if(k==='done'){if(r)rtDone64(r);else completeTask(t)}
  else if(k==='hunt'){if(r)startRun({routine:r});else startRun({task:t})}
  else if(k==='taste')taste65(t);else if(k==='open')openTaskSheet(t.id);else if(k==='avoid')avoid65(t.id)},true);

/* ---- 3) 루틴 줄의 점수: 머리 할 일 자체 점수 대신 '단계 합 · 완주 보너스' ---- */
taskRow=(function(prev){return function(t,o){let h=prev.apply(this,arguments);try{
  const r=t&&t.status===0&&C.mig62&&rtOfT62(t);
  if(r){const S=rtSum62(r);h=h.replace(/<span class="tx">(?:[^<]|<span class="g">[^<]*<\/span>)*<\/span>/,`<span class="tx tx65" title="단계 점수 합 · 다 하면 완주 보너스">Σ+${S.xp}${S.gold?` <span class="g">💰${S.gold}</span>`:''}<small class="muted"> 완주+${+r.xp||0}${+r.gold?` 💰${+r.gold}`:''}</small></span>`)}
}catch(e){}return h}})(taskRow);

/* ---- 4) 🌱 10분만 해보기: '일단 시작'이 동기를 만든다 ----
   10분이 지나면 멈춰도 돼요(시작 보너스 +5 XP). 계속하면 원래 사냥 그대로. */
var TASTE65_XP=5;
function taste65(t){if(!t||t.status!==0)return;startRun({task:t});if(RUN&&RUN.kind==='task'&&RUN.id===t.id){RUN.target=10;RUN.taste65=1;RUN.mode='within';runSave();drawHunt(true);toast('🌱 10분만 해요. 10분 지나면 멈춰도 돼요')}}
drawHunt=(function(prev){return function(full){const x=prev.apply(this,arguments);try{
  if(!RUN||!RUN.taste65||RUN.kind!=='task'||$('hunt').hidden)return x;
  const ar=$('hunt').querySelector('.arena');if(!ar)return x;
  let bx=$('taste65');if(!bx){bx=document.createElement('div');bx.id='taste65';bx.className='taste65';ar.prepend(bx)}
  const done=runElapsed()>=600,st=RUN.taste65===2?'':done?'d':'w';
  if(bx.dataset.st!==st){bx.dataset.st=st;bx.hidden=!st;
    bx.innerHTML=st==='d'?`<b>🌱 10분 했어요!</b> <span class="small">시작이 제일 어려운 부분이었어요.</span><div class="row" style="gap:6px;justify-content:center;margin-top:6px"><button class="btn go sm" data-t65="keep">계속하기</button><button class="btn ghost sm" data-t65="stop">여기까지 (+${TASTE65_XP} XP)</button></div>`
      :st==='w'?`<span class="small">🌱 10분만 해보기 · 10분이 지나면 멈춰도 돼요</span>`:''}
}catch(e){console.error(e)}return x}})(drawHunt);
addEventListener('click',e=>{const b=e.target.closest('[data-t65]');if(!b||!RUN)return;e.preventDefault();e.stopPropagation();const t=TASKS[RUN.id];
  if(b.dataset.t65==='keep'){RUN.taste65=2;RUN.target=Math.max(15,(t&&+t.dur)||25);runSave();drawHunt(true);toast('좋아요, 계속 가요');return}
  const nm=RUN.name,id=RUN.id;endRun(true);
  commit(()=>applyEntry(today(),{kind:'start65',type:'good',name:'🌱 10분 시작: '+nm,xp:TASTE65_XP,gold:0,t65:id}));
  if(t){t.taste65=(t.taste65||0)+1;saveTask(t)}render();
  later(()=>popup('시작했어요','🌱',`<b>${esc(nm)}</b><br>10분 해냈어요 · +${TASTE65_XP} XP<br><span class="muted">조금이라도 한 게, 안 한 것보다 훨씬 나아요. 다음엔 여기서부터.</span>`,'🌱'));runLater()},true);

/* ---- 5) ☠ 삼진아웃: 세 번 미루면 '고치거나 내려놓기' 창 ---- */
postpone=(function(prev){return function(t,to){const b=(t&&t.skull)||0;const x=prev.apply(this,arguments);try{if(t&&b<3&&(t.skull||0)>=3&&!t.rid&&!isStep62(t))setTimeout(()=>strike65(t.id),380)}catch(e){}return x}})(postpone);
function strike65(id){const t=TASKS[id];if(!t||t.status!==0)return;sheetCtx={st65:id};
  openSheet(`<div class="sh"><h3>☠☠☠ 삼진아웃</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
  <p style="margin:0 0 4px"><b>${esc(t.title)}</b> <span class="tiny muted">${t.skull}번 미뤘어요</span></p>
  <p class="small muted" style="margin:0 0 12px">세 번 미뤘다면 내 탓보다 <b>계획이 너무 크거나 방향이 어긋났다</b>는 신호일 때가 많아요. 이 일을 고치거나, 내려놓아요.</p>
  <div class="st65">
    <button class="st65b" data-s65="split"><b>✂ 쪼개기</b><span class="tiny muted">10분 안에 끝낼 첫 조각 하나만 오늘로</span></button>
    <div class="st65sp" hidden><input id="s65in" maxlength="60" placeholder="첫 조각 (예: 파일만 열어두기)" enterkeyhint="done" autocomplete="off"><button class="btn go sm" data-s65="mk">만들기</button></div>
    <button class="st65b" data-s65="taste"><b>🌱 지금 10분만</b><span class="tiny muted">끝까지 말고, 10분만. 지나면 멈춰도 돼요</span></button>
    <button class="st65b" data-s65="edit"><b>📝 다시 정하기</b><span class="tiny muted">크기·날짜·내용을 현실에 맞게</span></button>
    <button class="st65b" data-s65="drop"><b>🕊 내려놓기</b><span class="tiny muted">선택과 집중도 실력이에요 · 벌점 없음</span></button>
  </div>
  <p style="margin:10px 0 0;text-align:right"><button class="btn ghost sm" data-sheet="close">그냥 둘게요</button></p>`)}
function split65(t,v){if(!t||!v)return;const k=newTask({title:v,list:t.list,due:dateKey(),dur:10,effort:'quick'});k.parent=t.id;saveTask(k);if(t.skull){t.skull=0;saveTask(t)}closeSheet();render();toastAct(`✂ '${v}' 오늘로 · '${t.title}' 묶음에 넣었어요`,'열기',()=>openTaskSheet(k.id))}
addEventListener('click',e=>{const b=e.target.closest('[data-s65]');if(!b)return;e.preventDefault();e.stopPropagation();const t=TASKS[(sheetCtx||{}).st65];if(!t)return;const k=b.dataset.s65;
  if(k==='split'){const sp=document.querySelector('.st65sp');if(sp){sp.hidden=false;const i=$('s65in');i&&i.focus()}return}
  if(k==='mk'){split65(t,(($('s65in')||{}).value||'').trim());return}
  closeSheet();
  if(k==='taste')taste65(t);else if(k==='edit')openTaskSheet(t.id);
  else if(k==='drop'){const snap=clone(t);t.status=-1;t.doneAt=dateKey();saveTask(t);render();toastAct(`🕊 '${t.title}' 내려놓았어요`,'되돌리기',()=>{saveTask(snap);render()})}},true);
addEventListener('keydown',e=>{if(e.key!=='Enter'||!e.target||e.target.id!=='s65in'||e.isComposing)return;e.preventDefault();e.stopPropagation();const v=e.target.value.trim(),t=TASKS[(sheetCtx||{}).st65];setTimeout(()=>split65(t,(($('s65in')||{}).value||v).trim()),40)},true);

/* ---- 6) 😶 피하고 있어요: 알아차리기 → 꼭 해야 하나? → 작게 행동 ---- */
var AVR65=[['fear','잘 못할까 봐','완벽하게 못 할까 봐 무서운 거예요. 대충 → 빨리 → 잘. 지금은 \'대충\' 차례예요.'],
  ['big','너무 크고 막막해','어디서 시작할지 몰라서 그래요. 제일 작은 첫 조각 하나면 충분해요.'],
  ['bore','지루해','재미없는 건 당연해요. 10분만 하고, 끝나면 나한테 보상을 줘요.'],
  ['tired','지쳤어','요즘 힘들었잖아요. 그 와중에 이 일을 떠올린 것만도 잘한 거예요.'],
  ['unclear','뭘 할지 모르겠어','다음 행동 하나만 적으면 풀려요. \'무엇을\' 말고 \'처음 손이 가는 것\'.'],
  ['dunno','그냥 / 모르겠어','이유를 몰라도 괜찮아요. 숨부터 한 번 고르고 가요.']];
function avoid65(id){const t=TASKS[id];if(!t)return;ui.av65={id,step:1,why:'',brave:!t.brave};sheetCtx={av65:id};openSheet(avHTML65())}
function avHTML65(){const A=ui.av65||{},t=TASKS[A.id];if(!t)return '';const R=AVR65.find(x=>x[0]===A.why);
  const head=`<div class="sh"><h3>😶 피하고 있어요</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div><div class="av65s">${[1,2,3].map(i=>`<span class="${A.step===i?'on':A.step>i?'ok':''}">${i}. ${['알아차리기','꼭 해야 하나','작게 하기'][i-1]}</span>`).join('')}</div><p style="margin:6px 0 10px"><b>${esc(t.title)}</b></p>`;
  if(A.step===1)return head+`<p class="small" style="margin:0 0 8px">'나 지금 피하고 있네.' 평가하지 말고 그냥 알아차려요. 자연스러운 반응이에요.<br>왜 그런 것 같아요?</p>
    <div class="row" style="gap:6px;flex-wrap:wrap">${AVR65.map(([k,l])=>`<button class="chipbtn ${A.why===k?'on':''}" data-av65why="${k}" aria-pressed="${A.why===k}">${l}</button>`).join('')}</div>
    ${R?`<div class="av65kind">💛 ${esc(R[2])}</div>`:''}
    <div class="br65" id="br65"><div class="ball"></div><span class="small" id="br65t">🌬 숨 고르기: 3초 들이쉬고 7초 내쉬기</span><button class="btn ghost sm" data-av65="breathe">시작</button></div>
    <p style="margin:12px 0 0;text-align:right"><button class="btn go sm" data-av65="next">다음 →</button></p>`;
  if(A.step===2)return head+`<p class="small" style="margin:0 0 10px">마음이 좀 가라앉았으면, 이 일을 지금 꼭 해야 하는지 봐요.</p>
    <div class="st65"><button class="st65b" data-av65="must"><b>해야 해요</b><span class="tiny muted">왜 해야 하는지 한 줄로 나를 설득해요</span></button>
    <div class="st65sp" ${A.must?'':'hidden'}><input id="av65why" maxlength="80" placeholder="예: 미루면 계속 스트레스 · 빨리 하고 쉬자" value="${esc(t.reframe||'')}" autocomplete="off"><button class="btn go sm" data-av65="next">다음 →</button></div>
    <button class="st65b" data-av65="later"><b>미뤄도 돼요</b><span class="tiny muted">그럼 당당하게 미뤄요(☠ 없이). 누가 기다리면 먼저 알려요</span></button>
    <div class="st65sp" ${A.later?'':'hidden'}>${[['내일',addDays(dateKey(),1)],['주말',(()=>{let d=dateKey();while(new Date(d+'T00:00').getDay()!==6)d=addDays(d,1);return d===dateKey()?addDays(d,7):d})()],['다음 주',addDays(weekStart(dateKey()),7)]].map(([l,k])=>`<button class="chipbtn" data-av65to="${k}">${l} <small class="muted">${esc(fmtD(k))}</small></button>`).join('')}</div></div>`;
  return head+`<p class="small" style="margin:0 0 10px">엉망이어도, 10분이어도, 안 하는 것보단 나아요. 하나만 골라요.</p>
    <div class="st65"><button class="st65b" data-av65="taste"><b>🌱 10분만</b><span class="tiny muted">지나면 멈춰도 돼요 · +${TASTE65_XP} XP</span></button>
    <button class="st65b" data-av65="split"><b>✂ 첫 조각만</b><span class="tiny muted">10분 안에 끝낼 것 하나만 오늘로</span></button>
    <div class="st65sp" hidden><input id="s65in" maxlength="60" placeholder="첫 조각 (예: 제목만 쓰기)" autocomplete="off"><button class="btn go sm" data-av65="mk">만들기</button></div>
    <button class="st65b" data-av65="go"><b>🏹 그냥 시작</b><span class="tiny muted">감정은 두고 몸부터. 시작하면 동기가 따라와요</span></button></div>
    <label class="row small" style="gap:6px;margin-top:10px"><input type="checkbox" id="av65brave" ${A.brave||t.brave?'checked':''} ${t.brave?'disabled':''}> ⚔️ 피하던 일에 맞서는 거니까 <b>용기</b>로 표시 (끝내면 치명타)</label>`}
function avRedraw65(){const sc=$('sheetC');if(sc&&sheetCtx&&sheetCtx.av65)sc.innerHTML=avHTML65()}
function avBrave65(t){const c=$('av65brave');if(c&&c.checked&&!t.brave){t.brave=1;saveTask(t)}}
function breathe65(){const box=$('br65');if(!box||box.dataset.on)return;box.dataset.on=1;let n=0;const tx=$('br65t'),ball=box.querySelector('.ball');
  const step=()=>{if(!document.body.contains(box))return;if(n>=3){tx.textContent='좋아요. 조금 가라앉았나요?';ball.style.transform='scale(1)';delete box.dataset.on;return}
    tx.textContent=`들이쉬기… (${n+1}/3)`;ball.style.transition='transform 3s ease-in-out';ball.style.transform='scale(1.9)';
    setTimeout(()=>{if(!document.body.contains(box))return;tx.textContent=`내쉬기……… (${n+1}/3)`;ball.style.transition='transform 7s ease-in-out';ball.style.transform='scale(1)';n++;setTimeout(step,7000)},3000)};step()}
addEventListener('click',e=>{
  const w=e.target.closest('[data-av65why]');if(w&&ui.av65){e.preventDefault();e.stopPropagation();ui.av65.why=w.dataset.av65why;avRedraw65();return}
  const to=e.target.closest('[data-av65to]');if(to&&ui.av65){e.preventDefault();e.stopPropagation();const t=TASKS[ui.av65.id];if(!t)return;t.due=to.dataset.av65to;delete t.time;saveTask(t);closeSheet();render();toast(`${dueLabel(t.due)}로 옮겼어요 (☠ 없이) · 기다리는 사람이 있으면 먼저 알려요`);return}
  const b=e.target.closest('[data-av65]');if(!b||!ui.av65)return;e.preventDefault();e.stopPropagation();const A=ui.av65,t=TASKS[A.id];if(!t)return;const k=b.dataset.av65;
  if(k==='breathe'){breathe65();return}
  if(k==='must'){A.must=1;A.later=0;avRedraw65();setTimeout(()=>{const i=$('av65why');i&&i.focus()},30);return}
  if(k==='later'){A.later=1;A.must=0;avRedraw65();return}
  if(k==='next'){if(A.step===2){const v=(($('av65why')||{}).value||'').trim();if(v&&v!==t.reframe){if(!t.reframe)t.reframe=v;else t.why65=v;saveTask(t)}}A.step=Math.min(3,A.step+1);avRedraw65();return}
  if(k==='split'){const sp=b.nextElementSibling;if(sp){sp.hidden=false;const i=$('s65in');i&&i.focus()}return}
  avBrave65(t);t.av65=(t.av65||0)+1;saveTask(t);
  if(k==='mk'){const v=(($('s65in')||{}).value||'').trim();if(!v){toast('첫 조각을 적어주세요');return}split65(t,v);return}
  closeSheet();if(k==='taste')taste65(t);else if(k==='go')startRun({task:t})},true);
// 들어가는 곳: 할 일 우클릭 메뉴 · 할 일 상세 아래 · 쫄따구 창
var MT65=null;
taskMenu61=(function(prev){return function(t){MT65=t;try{return prev.apply(this,arguments)}finally{MT65=null}}})(taskMenu61);
menu61=(function(prev){return function(x,y,title,items){try{const t=MT65;if(t&&t.status===0&&!t.rid&&!isStep62(t)&&Array.isArray(items)){const i=items.findIndex(it=>it&&it.l==='✎ 열기');
  items=items.slice();items.splice(i+1,0,{l:'🌱 10분만 해보기',f:()=>taste65(t)},{l:'😶 피하고 있어요…',f:()=>avoid65(t.id)});if((t.skull||0)>=3)items.splice(i+3,0,{l:'☠ 삼진아웃 정리…',f:()=>strike65(t.id)})}}catch(e){}return prev.call(this,x,y,title,items)}})(menu61);
drawTaskSheet=(function(prev){return function(){const x=prev.apply(this,arguments);try{
  const t=TASKS[(sheetCtx||{}).task],sc=$('sheetC');if(!t||!sc||t.status!==0||t.rid||isStep62(t)||sc.querySelector('.av65row'))return x;
  const del=sc.querySelector('[data-tsact="del"]');if(!del)return x;const row=del.closest('.row,.spread')||del.parentElement;
  row.insertAdjacentHTML('beforebegin',`<div class="row av65row" style="gap:6px;flex-wrap:wrap;margin:6px 0">${(t.skull||0)>=3?`<button type="button" class="chipbtn" data-x65t="strike">☠ 삼진아웃 정리</button>`:''}<button type="button" class="chipbtn" data-x65t="taste">🌱 10분만 해보기</button><button type="button" class="chipbtn" data-x65t="avoid">😶 자꾸 피하게 돼요</button></div>`)
}catch(e){console.error(e)}return x}})(drawTaskSheet);
addEventListener('click',e=>{const b=e.target.closest('[data-x65t]');if(!b)return;e.preventDefault();e.stopPropagation();const id=(sheetCtx||{}).task,t=TASKS[id];if(!t)return;const k=b.dataset.x65t;
  try{tsRead()}catch(e){}closeSheet();if(k==='taste')taste65(t);else if(k==='avoid')avoid65(id);else strike65(id)},true);

/* ---- 7) 📝 하루를 나눠 쓰는 한 줄 일기 (아침·이른 오후·늦은 오후·밤) ----
   다 마무리하는 일기가 아니라, 지금 기분 · 하려던 것 · 안 했다면 왜 — 막힌 방 창문 열듯이. */
var J65=[['m','🌅','아침',5,11],['a','☀','이른 오후',11,15],['e','🌇','늦은 오후',15,19],['n','🌙','밤',19,29]];
var JM65=[['g','😊','좋음'],['o','🙂','괜찮음'],['s','😐','그냥'],['t','😮‍💨','지침'],['h','😣','힘듦']];
function jSlot65(){const h=new Date().getHours(),x=h<5?h+24:h;return (J65.find(s=>x>=s[3]&&x<s[4])||J65[0])[0]}
normDay=(function(prev){return function(k,raw){const d=prev.apply(this,arguments);try{if(raw&&raw.j65&&typeof raw.j65==='object')d.j65=clone(raw.j65)}catch(e){}return d}})(normDay);
function jRow65(){const d=DAYS[dateKey()]||{},j=d.j65||{},cur=jSlot65();
  return `<div class="j65"><span class="tiny muted">📝 한 줄 일기</span>${J65.map(([k,ic,n])=>{const v=j[k];return `<button type="button" class="j65b ${k===cur?'now':''} ${v?'ok':''}" data-j65="${k}" title="${n}${v?' · '+esc(v.txt||''):''}">${ic} ${n}${v?` ${(JM65.find(m=>m[0]===v.m)||[])[1]||'✓'}`:''}</button>`}).join('')}</div>`}
function jSheet65(slot){slot=slot||jSlot65();const td=dateKey(),d=DAYS[td]||{},j=d.j65||{},v=j[slot]||{},S=J65.find(s=>s[0]===slot);ui.j65={slot,m:v.m||''};sheetCtx={j65:slot};
  openSheet(`<div class="sh"><h3>${S[1]} ${S[2]} 한 줄</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
  ${J65.filter(s=>s[0]!==slot&&j[s[0]]).map(s=>`<p class="tiny muted" style="margin:0 0 4px">${s[1]} ${s[2]} ${(JM65.find(m=>m[0]===j[s[0]].m)||[])[1]||''} · ${esc(j[s[0]].txt||'')}</p>`).join('')}
  <p class="small" style="margin:6px 0">지금 기분은?</p>
  <div class="row" style="gap:6px;flex-wrap:wrap">${JM65.map(([k,ic,n])=>`<button type="button" class="chipbtn ${ui.j65.m===k?'on':''}" data-j65m="${k}" aria-pressed="${ui.j65.m===k}">${ic} ${n}</button>`).join('')}</div>
  <textarea id="j65txt" rows="3" maxlength="300" style="width:100%;margin-top:10px" placeholder="하려던 것 · 한 것 · 안 했다면 왜 (평가 말고 그냥 적기)">${esc(v.txt||'')}</textarea>
  <p class="tiny muted" style="margin:4px 0 0">마무리 말고 지금 그대로. 할 일에 대한 무거운 마음이 조금 환기돼요.</p>
  <p style="margin:10px 0 0;text-align:right"><button class="btn go sm" data-j65save="1">적기</button></p>`);setTimeout(()=>{const a=$('j65txt');a&&a.focus()},40)}
function jSave65(){const s=ui.j65;if(!s)return;const txt=(($('j65txt')||{}).value||'').trim();if(!txt&&!s.m){closeSheet();return}
  commit(()=>{const d=today();d.j65=d.j65||{};d.j65[s.slot]={m:s.m||'',txt,t:stamp()}});closeSheet();render();toast('📝 적었어요')}
addEventListener('click',e=>{const b=e.target.closest('[data-j65]');if(b){e.preventDefault();e.stopPropagation();jSheet65(b.dataset.j65);return}
  const m=e.target.closest('[data-j65m]');if(m&&ui.j65){e.preventDefault();e.stopPropagation();ui.j65.m=ui.j65.m===m.dataset.j65m?'':m.dataset.j65m;document.querySelectorAll('[data-j65m]').forEach(x=>{const on=x.dataset.j65m===ui.j65.m;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on)});return}
  if(e.target.closest('[data-j65save]')){e.preventDefault();e.stopPropagation();jSave65()}},true);
addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)&&e.target&&e.target.id==='j65txt'){e.preventDefault();jSave65()}},true);
reviewHTML59=(function(prev){return function(){const h=prev.apply(this,arguments);try{const td=dateKey(),days=[];for(let i=6;i>=0;i--){const k=addDays(td,-i),j=(DAYS[k]||{}).j65;if(j&&Object.keys(j).length)days.push([k,j])}
  if(!days.length)return h;
  return h+`<div class="card"><h2>📝 나눠 쓴 한 줄 일기 <span class="tiny muted">최근 7일</span></h2>${days.map(([k,j])=>`<div class="j65d"><b class="small">${esc(fmtD(k))} (${wdOf(k)})</b>${J65.filter(s=>j[s[0]]).map(s=>`<div class="small">${s[1]} ${(JM65.find(m=>m[0]===j[s[0]].m)||[])[1]||''} ${esc(j[s[0]].txt||'')}</div>`).join('')}</div>`).join('')}</div>`}catch(e){console.error(e);return h}}})(reviewHTML59);

/* ---- 8) ⏳ 대기 모드 깨기: 나중에 약속이 있으면 그 전까지 아무것도 못 하는 함정 ---- */
function wait65(){const td=dateKey(),nm=nowMinutes();if(ui.w65x===td)return '';
  const nx=openTasks().filter(t=>t.due===td&&t.time&&toMin(t.time)>nm+60).sort((a,b)=>a.time.localeCompare(b.time))[0];if(!nx)return '';
  const gap=toMin(nx.time)-nm,others=openTasks().filter(t=>t.id!==nx.id&&t.due&&t.due<=td&&!t.time).length;if(!others)return '';
  return `<div class="w65"><span>⏳ <b>${esc(nx.time)}</b> '${esc(nx.title)}'까지 ${gap>=60?Math.floor(gap/60)+'시간 ':''}${gap%60?gap%60+'분':''} · 기다리기만 하면 아까워요</span><span class="row" style="gap:4px"><button type="button" class="btn sm ghost" data-w65="pick">⚡ 짧은 것 하나</button><button type="button" class="ib" data-w65="x" aria-label="오늘은 그만 보기" title="오늘은 그만 보기">×</button></span></div>`}
addEventListener('click',e=>{const b=e.target.closest('[data-w65]');if(!b)return;e.preventDefault();e.stopPropagation();if(b.dataset.w65==='x'){ui.w65x=dateKey();render();return}openHuntPicker()},true);

/* ---- 9) 렌더 앞뒤 ---- */
render=(function(prev){return function(){
  try{heal65()}catch(e){console.error(e)}
  try{calMonth65()}catch(e){}
  const x=prev.apply(this,arguments);
  try{const sg=$('sugg');if(sg){sg.querySelectorAll('.w65,.j65').forEach(z=>z.remove());const w=wait65();if(w)sg.insertAdjacentHTML('afterbegin',w);sg.insertAdjacentHTML('beforeend',jRow65())}}catch(e){console.error(e)}
  try{if(sheetCtx&&sheetCtx.mob65&&!$('sheet').hidden&&!TASKS[sheetCtx.mob65])closeSheet()}catch(e){}
  return x}})(render);
