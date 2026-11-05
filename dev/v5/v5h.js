/* ================= v5.1: 3단 화면 · 전투 · 행복 · 도파민 · 사냥 고르기 ================= */
const DOPA0=[['app','🥗 애피타이저','짧고 쉬운 것 · 1~15분'],['side','🍟 사이드','집중을 이어가는 짧은 휴식'],['main','🍝 메인','30분 넘게 들이는 것'],['dessert','🍰 디저트','하루 한 스푼의 행복'],['special','🎉 스페셜','특별한 날엔 특별한 행복']];
const DOPA_SEED=[
  ['기지개 켜기','app',1,'body',2],['환기 시키기','app',1,'life',2],['이부자리 정리','app',1,'life',3],['방바닥 청소','app',5,'life',5],['책상 정리','app',5,'life',5],['폼롤러·스트레칭','app',10,'body',5],
  ['알람 맞추고 쉬기','side',3,'mind',2],['노래 틀고 발목운동','side',5,'body',3],['캠스터디','side',30,'make',8],['공간 바꾸기 (거실·도서관·카페)','side',10,'make',5],
  ['독서','main',30,'mind',10],['책상에 앉아 공부','main',30,'make',12],['필사','main',30,'make',10],['홈트','main',30,'body',12],['괄사','main',30,'body',6],['피부 관리','main',15,'body',5],['런데이','main',60,'body',15],['요리하기','main',60,'life',12],
  ['웹툰','dessert',20,'mind',2],['닌텐도','dessert',20,'mind',2],['유튜브 보고 싶은 거','dessert',30,'mind',2],['영화·드라마 한 편','dessert',120,'mind',3],
  ['마사지·세신','special',90,'body',5],['공연·전시·극장','special',120,'mind',6],['드라마 몰아보기','special',180,'mind',3]];
const DOPA_LINK=[[/샤워/,'app'],[/^명상/,'app'],[/스트레칭/,'app'],[/음악·독서로 쉬기/,'dessert']];
function seedDopa(c){
  const has=n=>c.actions.some(a=>a.name===n);
  c.actions.forEach(a=>{if(a.type!=='good'||a.dopa)return;const m=DOPA_LINK.find(([re])=>re.test(a.name));if(m)a.dopa=m[1]});
  const at=c.actions.findIndex(a=>a.type==='bad');let i=at<0?c.actions.length:at;
  DOPA_SEED.forEach(([n,co,min,area,xp],k)=>{if(has(n))return;const ar=c.areas.some(x=>x.id===area)?area:(c.areas[0]||{}).id;
    c.actions.splice(i++,0,{id:'dp'+k+uid().slice(0,3),name:n,type:'good',area:ar,cond:Math.max(2,Math.round(xp/3)),gold:co==='dessert'||co==='special'?0:Math.max(1,Math.round(xp/4)),xp,marble:'',dur:min,dopa:co,dopaOnly:1,effort:min<=10?'quick':min<=45?'mid':'heavy'})});
}
/* ---- 로딩 때 옛 화면 막기: 마지막 화면 사본 ---- */
const SNAPK='hq-snap'+(location.pathname.includes('/beta/')?'-b':'');
function snapLoad(){try{const s=JSON.parse(localStorage.getItem(SNAPK));if(s&&s.C){C=normConfig(s.C);P=normProgress(s.P);Object.entries(s.D||{}).forEach(([k,v])=>{DAYS[k]=normDay(k,v)});TASKS=s.T||{};return true}}catch(e){}return false}
let snapT=null;
function snapSave(){if(!ready||mode!=='db')return;clearTimeout(snapT);snapT=setTimeout(()=>{try{const D={};lastNDates(14).forEach(k=>{if(DAYS[k])D[k]=DAYS[k]});const T={};openTasks().forEach(t=>{T[t.id]=t});localStorage.setItem(SNAPK,JSON.stringify({C,P,D,T,at:Date.now()}))}catch(e){}},1500)}
/* ---- 3단 화면 ---- */
function splitOn(){return curView()==='tasks'&&innerWidth>=1200&&C.ui.split!==false}
function placeCal(){
  const pane=$('calPane');if(!pane)return;const on=splitOn();
  const want=on?$('tCalSlot'):document.querySelector('[data-view="cal"]');
  if(pane.parentElement!==want){want.appendChild(pane);ui.calKeepScroll=false}
  document.body.classList.toggle('split',on);document.body.classList.toggle('wideview',on||curView()==='cal');
  if(C.ui.listW)document.documentElement.style.setProperty('--listw',C.ui.listW+'px');
}
addEventListener('resize',()=>{clearTimeout(ui.rsT);ui.rsT=setTimeout(()=>{const was=document.body.classList.contains('split');if(was!==splitOn())render()},200)});
(()=>{let sx=0,sw=0,on=false;const el=$('tSplit');if(!el)return;
  el.addEventListener('pointerdown',e=>{on=true;sx=e.clientX;const li=document.querySelector('[data-view="tasks"] .tlayout>.stack');sw=li?li.getBoundingClientRect().width:420;el.setPointerCapture(e.pointerId);document.body.classList.add('dragging')});
  el.addEventListener('pointermove',e=>{if(!on)return;const w=clamp(Math.round(sw+e.clientX-sx),320,900);document.documentElement.style.setProperty('--listw',w+'px');C.ui.listW=w});
  el.addEventListener('pointerup',()=>{if(!on)return;on=false;document.body.classList.remove('dragging');save('config');ui.calKeepScroll=true;renderCal()});})();
/* ---- 전투: 아바타 vs 보스·쫄따구 ---- */
const MINI_COL=['#2e9a4a','#e07a10','#7a4fd0','#d14f92','#12938f','#c4513d'];
function minionSVG(color,dead){return `<svg viewBox="0 0 16 14" shape-rendering="crispEdges" aria-hidden="true"><g class="${dead?'':'boss-sp'}"><path d="M3 13h10v-1h1V8h-1V6h-1V5h-1V4H5v1H4v1H3v2H2v4h1z" fill="${color}"/><rect x="5" y="7" width="2" height="2" fill="#fff"/><rect x="9" y="7" width="2" height="2" fill="#fff"/><rect x="6" y="8" width="1" height="1" fill="#1d2130"/><rect x="10" y="8" width="1" height="1" fill="#1d2130"/></g>${dead?'<path d="M2 2L14 13M14 2L2 13" stroke="#d23c3c" stroke-width="1.5"/>':''}</svg>`}
function renderBattle(){
  const box=$('battleBox');if(!box)return;const td=dateKey(),day=today();
  const ws=weekState(td),bs=bossOf(td),L=levelOf(P.xp),mood=moodKey(overallOf(day));
  const open=openTasks().filter(t=>t.due&&t.due<=td),done=doneOn(td);
  const mins=[...open.map(t=>({id:t.id,n:t.title,dead:false})),...done.map(e=>({id:e.tid,n:e.name,dead:true}))].slice(0,12);
  $('btLbl').textContent=`쫄따구 ${open.length}마리 남음`;
  box.innerHTML=`<div class="arena2"><div class="hero2">${spriteSVG(C.avatar.kind,mood,C.avatar.outfit,{level:L.lv})}<span class="tiny">Lv.${L.lv}</span></div><div class="vs">VS</div>
    <div class="boss2 ${ws.dead?'dead':''}" data-info="boss">${bossSVG(bs.color,ws.dead)}<b class="small">${esc(bs.name)}</b><div class="track"><div class="fill" style="width:${Math.round(ws.left/ws.hp*100)}%;background:var(--bad)"></div></div><span class="tiny muted num">${ws.left}/${ws.hp}</span></div></div>
    <div class="minions">${mins.map((m,i)=>`<button class="mini ${m.dead?'dead':''}" ${m.id&&TASKS[m.id]?`data-ctask="${m.id}"`:''} title="${esc(m.n)}">${minionSVG(MINI_COL[i%MINI_COL.length],m.dead)}</button>`).join('')||'<span class="tiny muted">오늘 할 일이 쫄따구가 돼요. 하나씩 해치워요.</span>'}</div>
    <p class="tiny muted" style="margin:6px 0 0">할 일을 끝내면 쫄따구 처치, 얻은 XP는 그대로 보스 데미지. 나쁜 행동은 보스를 회복시켜요.</p>`;
}
let bfxT=null;
function battleFx(xp,{bad,kill,gold}={}){
  if(C.ui.fx===false)return;const el=$('bfx');if(!el)return;
  const mood=moodKey(overallOf(today()));
  el.innerHTML=`<div class="bfx-in ${bad?'bad':''}"><span class="bh">${spriteSVG(C.avatar.kind,mood,C.avatar.outfit,{fx:false})}</span><span class="slash">${bad?'💢':'⚔️'}</span><span class="bt2">${bad?minionSVG('#7a4fd0',false):kill?minionSVG(MINI_COL[Math.floor(Math.random()*6)],true):bossSVG(bossOf(dateKey()).color,false)}</span><span class="dmg">${bad?'보스 회복 +'+xp:(kill?'처치! ':'')+'−'+xp}</span>${gold>0?`<span class="gl">🪙+${gold}</span>`:''}</div>`;
  el.hidden=false;el.firstChild.classList.add('go');clearTimeout(bfxT);bfxT=setTimeout(()=>{el.hidden=true},1500);
}
/* ---- 행복 기록 ---- */
function doHappy(name,area){
  if(!guard())return;const H=C.happy||{xp:8,gold:3,cond:5};let xp=+H.xp||0;if(recoveryActive())xp=Math.round(xp*C.recovery.mult);
  const gj=C.jars.find(j=>j.id==='good');
  const e={kind:'happy',type:'good',name:'✨ '+name,area:area||'mind',cond:+H.cond||0,gold:+H.gold||0,xp,...(gj?{jar:'good',mt:gj.types[0].id}:{})};
  if(e.jar)ui.newMarble=e.jar;
  commit(()=>applyEntry(curDay(),e));fxPop(`✨ +${xp} XP`,'var(--gold)');buzz();snack(e,curDay().date);
}
/* ---- 사냥 고르기 ---- */
function openHuntPicker(){ui.hp=ui.hp||{tab:'sched',area:''};sheetCtx={hp:1};drawHuntPicker()}
function drawHuntPicker(){
  const H=ui.hp,td=dateKey();let items=[];
  if(H.tab==='sched')items=openTasks().filter(t=>t.due===td&&t.time).sort((a,b)=>a.time.localeCompare(b.time)).map(t=>({k:'task:'+t.id,n:t.title,m:`${t.time}${t.dur?' · '+durTxt(t.dur):''}`,xp:taskBase(t).xp}));
  if(H.tab==='todo')items=openTasks().filter(t=>t.due&&t.due<=td).sort(taskSorter('prio')).map(t=>({k:'task:'+t.id,n:t.title,m:dueLabel(t.due),xp:taskBase(t).xp}));
  if(H.tab==='habit')items=C.actions.filter(a=>a.type==='good'&&!a.dopaOnly&&(!H.area||a.area===H.area)).map(a=>({k:'act:'+a.id,n:a.name,m:(C.areas.find(x=>x.id===a.area)||{}).name+(a.dur?' · 목표 '+a.dur+'분':''),xp:+a.xp||0}));
  if(H.tab==='dopa')items=C.actions.filter(a=>a.dopa&&(!H.area||a.area===H.area)).map(a=>({k:'act:'+a.id,n:a.name,m:(dopaC().find(d=>d[0]===a.dopa)||['',''])[1]+(a.dur?' · '+a.dur+'분':''),xp:+a.xp||0}));
  if(H.tab==='routine')items=(C.routines||[]).map(r=>({k:'routine:'+r.id,n:r.name,m:r.steps.length+'단계',xp:+r.xp||0}));
  const tabs=[['sched','⏰ 오늘 시간표'],['todo','✅ 할 일'],['habit','▲ 습관'],['dopa','🍬 도파민'],['routine','⏱ 루틴']];
  openSheet(`<div class="sh"><h3>⚔ 무엇을 사냥할까요?</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <div class="seg">${tabs.map(([k,l])=>`<button data-hptab="${k}" aria-pressed="${H.tab===k}">${l}</button>`).join('')}</div>
    ${H.tab==='habit'||H.tab==='dopa'?`<div class="row" style="gap:4px"><button class="chipbtn" data-hparea="" aria-pressed="${!H.area}">모든 영역</button>${C.areas.map(a=>`<button class="chipbtn" data-hparea="${a.id}" aria-pressed="${H.area===a.id}">${esc(a.name)}</button>`).join('')}</div>`:''}
    <div class="stack" style="gap:6px">${items.map(x=>`<button class="sug" data-hpick="${x.k}" style="grid-template-columns:1fr auto"><span><b>${esc(x.n)}</b><span class="why">${esc(x.m||'')}</span></span><span class="go">+${x.xp} ▶</span></button>`).join('')||'<div class="empty">비어 있어요. 다른 탭을 골라요.</div>'}</div>
    <div class="row" style="justify-content:space-between"><button class="btn ghost sm" data-hprand="1">🎲 이 중에서 아무거나</button><button class="btn ghost sm" data-quick5="1">⏳ 딱 5분만</button></div>`);
}
function huntPick(k){const[kind,id]=k.split(':');closeSheet();
  if(kind==='task'&&TASKS[id])startRun({task:TASKS[id]});else if(kind==='act'){const a=C.actions.find(x=>x.id===id);if(a)startRun({act:a})}else if(kind==='routine'){const r=(C.routines||[]).find(x=>x.id===id);if(r)startRun({routine:r})}}
/* ---- 도파민 메뉴 ---- */
function renderDopa(){
  const box=$('gDopa');if(!box)return;
  box.innerHTML=`<div class="dopa">${dopaC().map(([co,nm,ds])=>{const its=C.actions.filter(a=>a.dopa===co);return `<div class="course"><b>${nm}</b><span class="tiny muted">${ds}</span><div class="dlist">${its.map(a=>`<button class="ditem" data-dopa="${a.id}"><span>${esc(a.name)}</span><span class="tiny muted">${a.dur?a.dur+'분':''}</span></button>`).join('')||'<span class="tiny muted">비어 있어요</span>'}</div></div>`}).join('')}</div>`;
}
function dopaSheet(id){const a=C.actions.find(x=>x.id===id);if(!a)return;sheetCtx={dopa:id};
  openSheet(`<div class="sh"><h3>🍬 ${esc(a.name)}</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>${a.reframe?`<div class="reframe"><b>💭 다르게 보기</b>${esc(a.reframe)}</div>`:''}<p class="small muted" style="margin:0">${a.dur?'목표 '+a.dur+'분 · ':''}XP +${a.xp}</p><div class="row" style="justify-content:flex-end"><button class="btn ghost" data-aedit="${a.id}">편집</button><button class="btn ghost" data-dopago="hunt">⏱ 사냥</button><button class="btn" data-dopago="done">✓ 했어요</button></div>`)}
/* ---- 이벤트 ---- */
document.addEventListener('click',e=>{
  if(lpFired)return;const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.hptab){ui.hp.tab=d.hptab;drawHuntPicker();return}
  if(d.hparea!=null){ui.hp.area=d.hparea;drawHuntPicker();return}
  if(d.hpick){huntPick(d.hpick);return}
  if(d.hprand){const bs=[...document.querySelectorAll('#sheetC [data-hpick]')];if(!bs.length)return;huntPick(bs[Math.floor(Math.random()*bs.length)].dataset.hpick);return}
  if(d.huntpick){openHuntPicker();return}
  if(d.dopa){dopaSheet(d.dopa);return}
  if(d.dopago){const a=C.actions.find(x=>x.id===sheetCtx.dopa);closeSheet();if(!a)return;if(d.dopago==='hunt')startRun({act:a});else{ui.off=0;doAction(a)}return}
  if(d.gquickdopa){const g=G();if(g.pending||g.quest){location.hash='gacha';toast(g.quest?'진행 중인 가챠 퀘스트부터 끝내요':'먼저 뽑은 카드를 골라요');return}g.f={src:['dopa'],effort:[],areas:[],lists:[],due:'all',n:3};gachaDraw();return}
  if(b.id==='calFilterBtn'){calFilterSheet();return}
  if(d.cff){const f=C.ui.cal.filter=C.ui.cal.filter||{lists:[],areas:[],tags:[]};const arr=f[d.cff]=f[d.cff]||[];f[d.cff]=arr.includes(d.v)?arr.filter(x=>x!==d.v):[...arr,d.v];save('config');calFilterSheet();ui.calKeepScroll=true;renderCal();return}
  if(d.cffclear){C.ui.cal.filter={lists:[],areas:[],tags:[]};save('config');calFilterSheet();renderCal();return}
  if(d.calfold){C.ui.cal.foldOn=C.ui.cal.foldOn===false;save('config');ui.calKeepScroll=false;renderCal();return}
});
function calFilterSheet(){
  const f=C.ui.cal.filter||{};const tags={};openTasks().forEach(t=>(t.tags||[]).forEach(x=>tags[x]=(tags[x]||0)+1));
  const ch=(k,v,l)=>`<button class="chipbtn" data-cff="${k}" data-v="${esc(v)}" aria-pressed="${(f[k]||[]).includes(v)}">${l}</button>`;
  sheetCtx={cff:1};
  openSheet(`<div class="sh"><h3>캘린더에 보일 것</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div><p class="help" style="margin:0">아무것도 안 고르면 전부 보여요. 고른 것만 캘린더에 나와요.</p>
    <div><div class="small muted">영역</div><div class="row" style="gap:4px">${C.areas.map(a=>ch('areas',a.id,esc(a.name))).join('')}</div></div>
    <div><div class="small muted">목록</div><div class="row" style="gap:4px">${[{id:'inbox',name:'📥 받은함'},...C.lists.filter(l=>l.id!=='inbox')].map(l=>ch('lists',l.id,esc(l.name))).join('')}</div></div>
    ${Object.keys(tags).length?`<div><div class="small muted">태그</div><div class="row" style="gap:4px">${Object.keys(tags).sort().map(t=>ch('tags',t,'#'+esc(t))).join('')}</div></div>`:''}
    <div class="row" style="justify-content:space-between"><button class="btn ghost sm" data-cffclear="1">모두 풀기</button><button class="btn" data-sheet="close">닫기</button></div>`);
}
function rewardExplain(t){
  const b=taskBase(t),X=C.taskXP||{},ef=effortOf(t);const ar=C.areas.find(x=>x.id===areaOfTask(t));
  const parts=[];
  if(t.aid){const a=C.actions.find(x=>x.id===t.aid);parts.push(`습관 '${a?a.name:''}' 점수 +${b.xp}`)}
  else if(t.rid)parts.push(`루틴 완주 +${b.xp}`);
  else if(t.brave)parts.push(`⚡ 용기 (${({quick:'작은',mid:'보통',heavy:'큰'})[ef]} 용기) +${b.xp}`);
  else{parts.push(`${(EFFORTS.find(x=>x[0]===ef)||[])[1]} +${+X[ef]||0}`);const pb=+((X.prio||{})[t.prio||0])||0;if(pb)parts.push(`중요도 +${pb}`)}
  if(t.due&&X.onTime&&!t.aid&&!t.brave)parts.push(`제때 끝내면 +${X.onTime}`);
  if(recoveryActive())parts.push(`복귀 보너스 ×${C.recovery.mult}`);
  if(gachaMatch('task',t.id))parts.push(`🎲 가챠 ×${C.gacha.mult||1.5}`);
  return `XP ${parts.join(' · ')} — ${gtx(b.gold)} · ${esc(ar?ar.name:'')} 컨디션 +${b.cond}. 타이머로 빨리 끝내면 스피드 보너스.`;
}
