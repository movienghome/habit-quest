/* ================= v5.3: 오늘 하나로 · 습관 모음 · 여러 개 고르기 · 언제 했나요 ================= */
function ampm(hhmm){if(!hhmm)return '';const[h0,m]=hhmm.split(':').map(Number);const h=((h0%24)+24)%24;return `${h<12?'오전':'오후'} ${h%12||12}시${m?` ${m}분`:''}`}
function atHour(at){if(!at)return nowHour();const[h,m]=at.split(':').map(Number);let x=h+(m||0)/60;if(x<(C.dayStart||0))x+=24;return x}
function whenHTML(S){
  const k=S.atK||'now',a=S.a;
  const chips=[['now','방금'],['1h','1시간 전'],['am','아침에'],['pick','직접']];
  const v=a&&a.opts&&a.opts.length?pickVariant(a,atHour(S.at)):null;
  return `<div class="when"><span class="small muted">언제 했나요?</span>${k==='run'?`<button class="chipbtn" data-sat="run" aria-pressed="true">⏱ 시작 ${esc(S.at)}</button>`:''}${chips.map(([x,l])=>`<button class="chipbtn" data-sat="${x}" aria-pressed="${k===x}">${l}</button>`).join('')}${k==='pick'?`<input type="time" id="sxAt" value="${esc(S.at||stamp())}" style="width:auto" aria-label="한 시각">`:''}<span class="tiny muted">${S.at?esc(ampm(S.at))+'에 한 걸로':'지금 '+esc(ampm(stamp()))}${v&&!S.vidMan?` → '${esc(v.name)}' 골라 둠`:''}</span></div>`;
}
function setAt(k,val){const S=sheetCtx;if(!S)return;sheetRead();
  if(k==='run'){return}
  S.atK=k;
  if(k==='now')S.at=null;else if(k==='1h'){const d=new Date(Date.now()-3600e3);S.at=pad(d.getHours())+':'+pad(d.getMinutes())}else if(k==='am')S.at='08:00';else if(k==='pick')S.at=val||S.at||stamp();
  if(S.a&&!S.vidMan&&S.a.opts&&S.a.opts.length){const v=pickVariant(S.a,atHour(S.at));S.vid=v?v.id:S.vid}
  drawDoneSheet();
  if(k==='pick'&&!val)setTimeout(()=>{const i=$('sxAt');if(i)i.focus()},30)}
/* ---- 반복 프리셋 ---- */
function repPresetOf(t){const r=t.rep;if(ui.repCustom===t.id)return 'custom';if(!r)return '';const wd=(r.wd||[]).slice().sort().join(','),i=r.i||1;
  if(r.until)return 'custom';
  if(r.f==='d'&&r.after)return 'after';if(r.f==='d'&&i===1)return 'd';if(r.f==='x')return 'x';
  if(r.f==='w'&&i===1&&wd==='1,2,3,4,5')return 'wd';if(r.f==='w'&&i===1&&wd==='0,6')return 'we';
  if(r.f==='w'&&(r.wd||[]).length===1){if(i===1)return 'w';if(i===2)return 'w2'}
  if(r.f==='m'&&i===1&&!r.nth&&(r.md||[]).length<=1)return 'm';if(r.f==='y'&&i===1)return 'y';return 'custom'}
/* ---- v5.3 설정 옮기기 ---- */
const LIST_DEF=[['fixed','📌Fixed','고정 일정 · 정해진 시간에 하는 것'],['atelier','✒Atelier','작품 작업실 · 지금 만드는 내 다음 작품'],['project','🦚Project','오래 걸리는 일 · 여러 번에 나눠 하는 것'],['errands','⚙Errands','자잘한 볼일 · 장보기, 연락, 처리할 것'],['limen','🌓Limen','경계의 시간 · Eos(해 뜰 때)·Vesper(해 질 때) 나가기, Lethe(기기 끄고 잠들 준비)']];
const lnorm=s=>String(s||'').toLowerCase().replace(/[^a-z가-힣0-9]/g,'');
function mig53(c,raw){
  if(raw&&raw.v>=7)return;
  const mk=c.areas.find(a=>a.id==='make');if(mk&&mk.name==='창작')mk.name='작품';
  if(!c.areas.some(a=>a.id==='grow')){const i=c.areas.findIndex(a=>a.id==='make');c.areas.splice(i>=0?i+1:c.areas.length,0,{id:'grow',name:'성장'})}
  if(!c.areas.some(a=>a.id==='money'))c.areas.push({id:'money',name:'경제'});
  const ta=c.tagArea||(c.tagArea={});const old={'헌팅(Job)':'life','영상':'make','파라모프':'make','영어':'mind','일본어':'mind'};
  Object.entries({'재정관리':'money','헌팅(Job)':'grow','영상':'grow','파라모프':'grow','영어':'grow','일본어':'grow','집필':'make'}).forEach(([k,v])=>{if(!ta[k]||ta[k]===old[k])ta[k]=v});
  c.actions.forEach(a=>{if(/영어|일본어|외국어/.test(a.name)&&(a.area==='make'||a.area==='mind'))a.area='grow'});
  const ib=c.lists.find(l=>l.id==='inbox');if(ib&&/\ubc1b\uc740\ud568/.test(ib.name))ib.name='📥 기본함';
  LIST_DEF.forEach(([k,nm,ds])=>{let l=c.lists.find(x=>lnorm(x.name)===k);if(!l){l={id:'L'+k,name:nm,folder:''};c.lists.push(l)}if(!l.desc)l.desc=ds});
  if(c.lists.some(l=>lnorm(l.name)==='focus'))c.focusMig=1;
  c.limenMig=1;
  const limen=(c.lists.find(l=>lnorm(l.name)==='limen')||{}).id;const has=id=>c.actions.some(a=>a.id===id)?id:'';
  c.routines=c.routines||[];
  [{id:'r-eos',name:'🌅 Eos · 해 뜰 때 나가기',xp:25,gold:10,area:'body',steps:[{id:'s1',name:'옷 입고 문 밖으로',min:5,aid:''},{id:'s2',name:'해 보며 걷기',min:20,aid:has('g2')},{id:'s3',name:'돌아와 물 한 잔',min:2,aid:''}]},
   {id:'r-vesper',name:'🌇 Vesper · 해 질 때 나가기',xp:25,gold:10,area:'mind',steps:[{id:'s1',name:'문 밖으로',min:5,aid:''},{id:'s2',name:'노을 보며 걷기',min:25,aid:has('g2')},{id:'s3',name:'오늘 한 줄 정리',min:5,aid:''}]},
   {id:'r-lethe',name:'🌙 Lethe · 기기 끄고 잠들 준비',xp:35,gold:15,area:'mind',steps:[{id:'s1',name:'📵 기기 끄기 · 충전기에 꽂기',min:2,aid:''},{id:'s2',name:'🚿 샤워',min:15,aid:has('g20')},{id:'s3',name:'스트레칭',min:10,aid:has('g4')},{id:'s4',name:'📖 독서',min:20,aid:''},{id:'s5',name:'🎧 음악',min:10,aid:''},{id:'s6',name:'🧘 명상',min:5,aid:has('g6')},{id:'s7',name:'🛏 잠자리 준비',min:5,aid:''}]}
  ].forEach(r=>{if(!c.routines.some(x=>x.id===r.id)){if(limen)r.list=limen;c.routines.push(r)}});
  if(!Array.isArray(c.dopaCourses)||!c.dopaCourses.length)c.dopaCourses=DOPA0.map(([id,name,desc])=>({id,name,desc}));
  if(raw)c.v53news=1;
}
function mig53Tasks(){
  if(C.limenMig){delete C.limenMig;const RM={eos:'r-eos',vesper:'r-vesper',lethe:'r-lethe'};Object.values(TASKS).forEach(t=>{const k=RM[lnorm(t.title)];if(k&&!t.rid&&t.status===0&&(C.routines||[]).some(r=>r.id===k)){t.rid=k;saveTask(t)}})}
  const f=C.focusMig&&C.lists.find(l=>lnorm(l.name)==='focus');delete C.focusMig;
  if(f){let n=0;Object.values(TASKS).forEach(t=>{if(t.list!==f.id)return;t.list='inbox';t.tags=[...new Set([...(t.tags||[]),'집중'])];saveTask(t);n++});
    C.lists=C.lists.filter(l=>l!==f);if(C.ui.tasks&&C.ui.tasks.sel==='l:'+f.id)C.ui.tasks.sel='focus';
    if(n)later(()=>toast(`🔥Focus 목록의 할 일 ${n}개를 🎯집중 태그로 옮겼어요 (기본함)`))}
  save('config');
}
/* ---- 도파민 코스 ---- */
function dopaC(){const cs=C&&Array.isArray(C.dopaCourses)&&C.dopaCourses.length?C.dopaCourses:null;return cs?cs.map(c=>[c.id,c.name,c.desc||'']):DOPA0}
function reEdit(){const ae=document.activeElement;if(ae&&ae!==document.body&&ae.blur)ae.blur();renderEdit()}
function dopaMove(ids,co){{const ae=document.activeElement;if(ae&&ae.blur)ae.blur()}ids.forEach(id=>{const a=C.actions.find(x=>x.id===id);if(!a)return;if(co)a.dopa=co;else{delete a.dopa;delete a.dopaOnly}});save('config');if(ui.dsel)ui.dsel.clear();render();toast(co?`${ids.length}개 → ${(dopaC().find(d=>d[0]===co)||['',''])[1]}`:`${ids.length}개를 도파민 메뉴에서 뺐어요`)}
/* ---- 오늘: 습관 ---- */
function todayHabits(){
  const k=dateKey(),day=DAYS[k]||{date:k,entries:[]},dow=dowOf(k),out=[];
  const add=(a,why)=>{if(!a||a.type!=='good'||(a.once&&a.doneAt))return;const o=out.find(x=>x.a===a);if(o){if(!o.why.includes(why))o.why.push(why);return}out.push({a,why:[why]})};
  C.dailies.forEach(q=>{if(q.action&&!q.action.startsWith('@'))add(C.actions.find(x=>x.id===q.action),'☑ 일퀘')});
  C.watches.forEach(w=>{const a=C.actions.find(x=>x.id===w.action);if(!a||!w.days)return;const s=daysSince(w.action,addDays(k,-1))+1;if(s>=w.days)add(a,s>w.days?`⚠ ${s}일째 안 함`:`⏳ ${s}일째 · 오늘이 기한`)});
  C.actions.forEach(a=>{if((a.wd||[]).includes(dow))add(a,WDK[dow]+'요일');if(a.pin)add(a,'📌')});
  const ents=(day.entries||[]);
  return out.map(x=>{const es=ents.filter(e=>e.kind==='act'&&e.aid===x.a.id);return{...x,n:es.length,last:es[es.length-1]}});
}
function todayHabitsHTML(){
  const k=dateKey(),day=DAYS[k]||{entries:[]};const hs=todayHabits();
  const qs=C.dailies.filter(q=>!q.action||q.action.startsWith('@'));
  if(!hs.length&&!qs.length)return '';
  const shut=C.ui.collapsed.thab;
  hs.sort((a,b)=>(a.n?1:0)-(b.n?1:0));
  const doneN=hs.filter(x=>x.n).length+qs.filter(q=>questDone(day,q)).length,all=hs.length+qs.length;
  const row=x=>{const a=x.a,ar=C.areas.find(z=>z.id===a.area);
    return `<div class="trow hab ${x.n?'done':''}" data-hab="${a.id}" data-drag="act:${a.id}" data-dragmode="hold">
      ${x.n?`<button class="tchk" data-rm="${x.last.id}" data-date="${k}" aria-label="${esc(a.name)} 되돌리기" title="눌러서 되돌리기">✓</button>`:`<button class="tchk hb" data-act="${a.id}" aria-label="${esc(a.name)} 했어요"></button>`}
      <span class="tb"><span class="tt">🔁 ${esc(a.name)}${x.n>1?` <span class="tiny muted">×${x.n}</span>`:''}</span><span class="tm">${x.why.filter(w=>w!=='📌').map(w=>`<span class="${/⚠/.test(w)?'late':/⏳/.test(w)?'tday':''}">${esc(w)}</span>`).join('')}${ar?`<span class="areac">${esc(ar.name)}</span>`:''}${a.opts&&a.opts.length?`<span title="세부 옵션">◐ ${a.opts.length}</span>`:''}${a.pin?`<button class="rfbtn" data-pin="${a.id}" title="매일 고정 · 눌러서 풀기">📌 고정 ✕</button>`:''}</span></span>
      <span class="tx">+${a.xp||0}</span>${x.n?'<span></span>':`<button class="trun" data-aerun="${a.id}" aria-label="${esc(a.name)} 타이머로 하기" title="타이머로 하기">⏱</button>`}</div>`};
  const qrow=q=>{const d=questDone(day,q);const how=q.action==='@weigh'?'몸무게 적으면 자동':q.action&&q.action.startsWith('@food:')?'식사 칸에서 자동':'';
    return `<div class="trow hab ${d?'done':''}"><button class="tchk ${d?'':'hb'}" data-quest="${q.id}" aria-label="${esc(q.name)}">${d?'✓':''}</button><span class="tb"><span class="tt">☑ ${esc(q.name)}</span><span class="tm"><span>일퀘</span>${how?`<span>${how}</span>`:''}</span></span><span class="tx">+${q.xp||0}</span><span></span></div>`};
  return `<div class="tgroup habg"><div class="row" style="justify-content:space-between"><button class="ghead ${shut?'shut':''}" data-thab="1">${ic('chev')}🔁 오늘의 습관 <span class="c">${doneN}/${all}</span></button><a class="small" href="#log" style="color:var(--accent)">습관 모음 →</a></div>${shut?'':hs.map(row).join('')+qs.map(qrow).join('')}</div>`;
}
function todayFeedback(){const d=DAYS[dateKey()];if(!d)return '';let xp=0,g=0;(d.entries||[]).forEach(e=>{xp+=+e.xp||0;g+=+e.gold||0});return xp||g?` · 오늘 +${xp} XP${g?` · 🪙${g>0?'+':''}${g}`:''}`:''}
/* ---- 포기한 할 일 ---- */
function selLoose(t,sel){
  if(sel==='today'||sel==='all'||sel==='week')return true;
  if(sel==='inbox')return !t.list||t.list==='inbox';if(sel==='focus')return (t.tags||[]).includes('집중');
  if(sel.startsWith('l:'))return t.list===sel.slice(2);if(sel.startsWith('f:'))return (listOfTask(t)||{}).folder===sel.slice(2);if(sel.startsWith('#'))return (t.tags||[]).includes(sel.slice(1));return false}
function wontHTML(sel){
  if(['tomorrow','nodate','done'].includes(sel))return '';
  const td=dateKey(),from=sel==='today'?td:addDays(td,-14);
  const out=Object.values(TASKS).filter(t=>t.status===-1&&t.doneAt&&t.doneAt>=from&&selLoose(t,sel)).sort((a,b)=>b.doneAt.localeCompare(a.doneAt));
  if(!out.length)return '';const shut=C.ui.collapsed.twont!==false;
  return `<div class="tgroup tcomp twont"><button class="ghead ${shut?'shut':''}" data-twont="1">${ic('chev')}하지 않음 <span class="c">${out.length}</span></button>${shut?'':out.map(t=>`<div class="trow done wont" data-task="${t.id}"><button class="tchk" data-treopen="${t.id}" aria-label="${esc(t.title)} 다시 열기" title="눌러서 다시 열기">✕</button><span class="tb"><span class="tt">${esc(t.title)}</span><span class="tm"><span>${t.doneAt===td?'오늘':fmtD(t.doneAt)} 안 하기로</span>${t.list&&t.list!=='inbox'?`<span>${esc(listName(t.list))}</span>`:''}</span></span><span class="tx"></span><span></span></div>`).join('')}</div>`;
}
function listRoutinesHTML(lid){
  const rs=(C.routines||[]).filter(r=>r.list===lid);if(!rs.length)return '';
  return `<div class="lroutines"><span class="small muted">⏱ 이 목록의 루틴</span>${rs.map(r=>`<button class="btn ghost sm" data-rrun="${r.id}" title="${esc(r.steps.map(s=>s.name).join(' → '))}">${esc(r.name)} ▶</button>`).join('')}<a class="small" href="#edit" data-goedit="routines" style="color:var(--accent)">편집</a></div>`;
}
/* ---- 여러 개 고르기 ---- */
function mselIds(){return [...(ui.msel||new Set())].filter(id=>TASKS[id])}
function drawMsel(){
  const S=ui.msel||(ui.msel=new Set());
  document.querySelectorAll('#tList .trow[data-task]').forEach(r=>r.classList.toggle('msel',S.has(r.dataset.task)));
  const sb=$('tSelBtn');if(sb)sb.setAttribute('aria-pressed',!!ui.mselOn);
  let bar=$('mselBar');
  if(!S.size&&!ui.mselOn){if(bar)bar.remove();return}
  if(!bar){bar=document.createElement('div');bar.id='mselBar';bar.className="bulkbar"}
  if(bar.parentElement!==$('tList').parentElement)$('tList').after(bar);
  const n=S.size;
  bar.innerHTML=`<b>☑ ${n}개</b>${n?`<button class="btn ghost sm" data-mb="today">📅 오늘</button><button class="btn ghost sm" data-mb="tomorrow">🌤 내일</button><button class="btn ghost sm" data-mb="nodate">날짜 빼기</button>
    <select id="mbList" aria-label="목록 옮기기"><option value="">📂 목록…</option>${C.lists.map(l=>`<option value="${l.id}">${esc((l.folder?l.folder+' / ':'')+l.name)}</option>`).join('')}</select>
    <select id="mbPrio" aria-label="중요도"><option value="">⚑ 중요도…</option>${PRIOS.map(([p,l,m])=>`<option value="${p}">${m||'—'} ${l}</option>`).join('')}</select>
    <button class="btn ghost sm" data-mb="focus">🎯</button><button class="btn sm" data-mb="done">✓ 완료</button><button class="btn ghost sm" data-mb="wont">하지 않음</button><button class="btn ghost sm bad" data-mb="del">지우기</button>`:'<span class="small muted">할 일을 눌러 골라요 · Shift로 범위</span>'}
    <span style="flex:1"></span><button class="btn ghost sm" data-mb="all">모두</button><button class="btn ghost sm" data-mb="off">닫기</button>`;
}
function mselClear(){if(ui.msel)ui.msel.clear();ui.mselOn=false;ui.mselLast=null;drawMsel()}
function bulk(op,val){
  const ids=mselIds(),td=dateKey();
  if(op==='off'){mselClear();return}
  if(op==='all'){document.querySelectorAll('#tList .trow[data-task]').forEach(r=>{if(TASKS[r.dataset.task]&&TASKS[r.dataset.task].status===0)ui.msel.add(r.dataset.task)});drawMsel();return}
  if(!ids.length)return;
  if(op==='del'){if(!ui.delArm||Date.now()-ui.delArm>3000){ui.delArm=Date.now();toast(`${ids.length}개를 지울까요? 한 번 더 누르면 지워요`);return}ui.delArm=0;ids.forEach(id=>deleteTask(id));mselClear();render();toast(`${ids.length}개를 지웠어요`);return}
  if(op==='done'){ids.forEach(id=>{const t=TASKS[id];if(t&&t.status===0)completeTask(t,{direct:true})});mselClear();render();return}
  ids.forEach(id=>{const t=TASKS[id];if(!t)return;
    if(op==='today')t.due=td;else if(op==='tomorrow'){if(t.due&&t.due<=td)t.skull=(t.skull||0)+1;t.due=addDays(td,1)}else if(op==='nodate'){t.due=null;t.time=null}
    else if(op==='list')t.list=val;else if(op==='prio')t.prio=+val;else if(op==='focus')t.tags=[...new Set([...(t.tags||[]),'집중'])];
    else if(op==='wont'){t.status=-1;t.doneAt=td}
    saveTask(t)});
  const msg={today:'오늘로',tomorrow:'내일로',nodate:'날짜를 뺐어요',list:'→ '+(val?listName(val):''),prio:'중요도 바꿈',focus:'🎯집중 붙임',wont:'하지 않기로 했어요'}[op];
  if(op==='wont')mselClear();render();toast(`${ids.length}개 ${msg}`);
}
function bulkDrop(id,drop){
  const ids=(ui.msel&&ui.msel.has(id))?mselIds():[id];const td=dateKey();
  ids.forEach(i=>{const t=TASKS[i];if(!t)return;
    if(drop.type==='tolist')t.list=drop.id;
    else if(drop.k==='inbox')t.list='inbox';else if(drop.k==='focus')t.tags=[...new Set([...(t.tags||[]),'집중'])];
    else if(drop.k==='today')t.due=td;else if(drop.k==='tomorrow'){if(t.due&&t.due<=td)t.skull=(t.skull||0)+1;t.due=addDays(td,1)}
    else if(drop.k==='nodate'){t.due=null;t.time=null}
    saveTask(t)});
  render();toast(`${ids.length>1?ids.length+'개 ':''}→ ${drop.type==='tolist'?listName(drop.id):selTitle(drop.k)}`);
}
document.addEventListener('click',e=>{
  if(lpFired)return;
  const row=e.target.closest('#tList .trow[data-task]');if(!row||row.classList.contains('wont'))return;
  const multi=e.ctrlKey||e.metaKey||e.shiftKey||ui.mselOn;if(!multi)return;
  if(!ui.mselOn&&e.target.closest('button'))return;
  e.preventDefault();e.stopPropagation();
  const id=row.dataset.task,S=ui.msel||(ui.msel=new Set());
  if(e.shiftKey&&ui.mselLast){const ids=[...document.querySelectorAll('#tList .trow[data-task]')].map(r=>r.dataset.task);const a=ids.indexOf(ui.mselLast),b=ids.indexOf(id);if(a>=0&&b>=0){ids.slice(Math.min(a,b),Math.max(a,b)+1).forEach(x=>S.add(x))}}
  else if(S.has(id))S.delete(id);else S.add(id);
  ui.mselLast=id;getSelection&&getSelection().removeAllRanges();drawMsel();
},true);
/* ---- 이벤트 ---- */
document.addEventListener('click',e=>{
  if(lpFired)return;
  const ch=e.target.closest('[data-dselchip]');
  if(ch&&!e.target.closest('button')){const S=ui.dsel||(ui.dsel=new Set()),id=ch.dataset.dselchip;if(S.has(id))S.delete(id);else S.add(id);reEdit();return}
  const hr=e.target.closest('.trow[data-hab]');if(hr&&!e.target.closest('button')){openActionEditor(hr.dataset.hab);return}
  const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.sat){setAt(d.sat);return}
  if(d.pin){e.stopPropagation();const a=C.actions.find(x=>x.id===d.pin);if(!a)return;if(a.pin)delete a.pin;else a.pin=1;save('config');render();toast(a.pin?`📌 '${a.name}' 매일 '오늘'에 떠요`:`'${a.name}' 고정을 풀었어요`);return}
  if(d.aewd!=null){const a=C.actions.find(x=>x.id===(sheetCtx||{}).aedit);if(!a)return;const w=+d.aewd;a.wd=(a.wd||[]).includes(w)?a.wd.filter(x=>x!==w):[...(a.wd||[]),w];if(!a.wd.length)delete a.wd;save('config');const y=$('sheetC').scrollTop;openActionEditor(a.id);$('sheetC').scrollTop=y;return}
  if(d.aepin){const a=C.actions.find(x=>x.id===(sheetCtx||{}).aedit);if(!a)return;if(a.pin)delete a.pin;else a.pin=1;save('config');const y=$('sheetC').scrollTop;openActionEditor(a.id);$('sheetC').scrollTop=y;return}
  if(d.thab){C.ui.collapsed.thab=!C.ui.collapsed.thab;save('config');render();return}
  if(d.twont){C.ui.collapsed.twont=C.ui.collapsed.twont===false;save('config');render();return}
  if(d.treopen){const t=TASKS[d.treopen];if(!t)return;t.status=0;delete t.doneAt;saveTask(t);render();toast(`'${t.title}' 다시 열었어요`);return}
  if(b.id==='tSelBtn'){ui.mselOn=!ui.mselOn;if(!ui.mselOn&&ui.msel)ui.msel.clear();drawMsel();return}
  if(d.mb){bulk(d.mb);return}
  if(d.calhelp){$('calHelp').hidden=!$('calHelp').hidden;return}
  if(d.dselact){const S=ui.dsel||(ui.dsel=new Set());if(d.dselact==='clear')S.clear();else if(d.dselact==='out'){dopaMove([...S],'');return}else if(d.dselact==='all')document.querySelectorAll('[data-dselchip]').forEach(x=>S.add(x.dataset.dselchip));reEdit();return}
  if(d.dcoadd){C.dopaCourses=dopaC().map(([id,name,desc])=>({id,name,desc}));C.dopaCourses.push({id:'c'+uid().slice(0,6),name:'🍬 새 코스',desc:''});save('config');reEdit();return}
  if(d.dcodel){const co=d.dcodel;const n=C.actions.filter(a=>a.dopa===co).length;if(n&&(!ui.delArm||Date.now()-ui.delArm>3000)){ui.delArm=Date.now();toast(`항목 ${n}개는 습관 칸으로 가요. 한 번 더 누르면 지워요`);return}ui.delArm=0;
    C.dopaCourses=dopaC().filter(c=>c[0]!==co).map(([id,name,desc])=>({id,name,desc}));C.actions.forEach(a=>{if(a.dopa===co){delete a.dopa;delete a.dopaOnly}});save('config');reEdit();toast('코스를 지웠어요');return}
});
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.id==='sxAt'){e.stopPropagation();setAt('pick',t.value);return}
  if(t.id==='tsTime'){const tk=TASKS[(sheetCtx||{}).task];const en=$('tsEnd');if(tk&&en&&t.value){en.value=hm(toMin(t.value)+(+tk.dur||30));en.disabled=false}return}
  if(t.id==='tsRepSel'){e.stopPropagation();const tk=TASKS[(sheetCtx||{}).task];if(!tk)return;tsRead();
    if(t.value==='custom'){ui.repCustom=tk.id}else{ui.repCustom=null;setRepPreset(tk,t.value)}tsCommit(true,false);if(t.value==='custom')setTimeout(()=>{const i=$('tsRepTxt');if(i)i.focus()},30);return}
  if(t.id==='tsRepTxt'){e.stopPropagation();repFromText(t.value);return}
  if(t.id==='mbList'){if(t.value)bulk('list',t.value);return}
  if(t.id==='mbPrio'){if(t.value!=='')bulk('prio',t.value);return}
  if(t.id==='dselMove'){if(t.value)dopaMove([...(ui.dsel||[])],t.value);return}
  if(t.dataset.dco){const co=t.dataset.dco;C.dopaCourses=dopaC().map(([id,name,desc])=>({id,name,desc}));const c=C.dopaCourses.find(x=>x.id===co);if(!c)return;const v=t.value.trim();if(t.dataset.f==='name'&&!v)return;c[t.dataset.f]=v;save('config');t.blur();render();return}
},true);
function repFromText(txt){const tk=TASKS[(sheetCtx||{}).task];if(!tk||!txt.trim())return;
  const p=parseQuick('할일 '+txt.trim());if(!p.rep){toast('반복을 알아듣지 못했어요. 예: 격주 토요일 · 매월 10일 · 3일마다');return}
  tsRead();tk.rep=p.rep;if(p.due)tk.due=p.due;else if(!tk.due)tk.due=dateKey();if(tk.rep.f==='x')tk.due=addDays(weekStart(dateKey()),6);
  tsCommit(true,false);toast('🔁 '+repLabel(tk.rep))}
document.addEventListener('keydown',e=>{
  if(e.key==='Enter'&&e.target.id==='tsRepTxt'){e.preventDefault();e.stopPropagation();e.target.blur();return}
  if(e.key==='Escape'&&ui.msel&&(ui.msel.size||ui.mselOn)&&!document.querySelector('#sheet:not([hidden])')){mselClear();return}
},true);
