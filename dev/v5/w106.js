/* ---- v10.7 (w106.js): 11/20 아침 피드백 — 관리·주 N회 연동 묶음 ----
   ① 관리로 옮기기: 일퀘 할 일도 고를 수 있게(변기청소·집 청소가 빠지던 원인 = 일퀘 제외) · 폴더·태그 목록에서도 관리 할 일이 보임(own77) ·
      주기 메뉴에 요일·주 N회 같은 반복 옵션 · '요일·날짜로 정하기'가 이미 열린 상세에선 안 열리던 것 · 입력칸 옆 🧽 단추(% 붙이기)
   ② 할 일 상세 '이어진 곳': 그 카드에 이어진 다른 할 일·루틴을 한 줄 접힘으로(내가 안 이은 게 섞여 보이던 것)
   ③ 주 N회 횟수: 같은 날 같은 카드로 이은 다른 할 일 기록은 1번으로(dayCnt99 다시 선언, max(이 할 일, 다른 할 일)) · 창 '셈에 들어간 기록'에 중복 표시
   ④ 뽀모도로 ↔ 할 일: 꽉 채운 25분이 같은 이름의 반복 할 일을 오늘 한 걸로(하루 한 번, 되돌리기) · 쉬는 시간 자동 시작(C.pomo88.ab106===0이면 끔)
   ⑤ 캘린더: 주 N회 자리를 끝내면 그 시각에 ✓ 블록으로 남음(doneBlk77·doneTasks84·allday84 다시 선언)
   ⑥ 홈·할 일 화면: 관리 줄 접기(▾/▸, C.care76.fold) · 오늘 한 반복 할 일 ✓ 오늘 함 · '✓ 오늘 한 단계' 줄 기본 접힘
   새 저장 키: C.care76.fold · C.pomo88.ab106·link106 · kinds[].tid106 · 기록(pomo log).tid. */

/* ---- ① 관리로 옮기기 ---- */
function own77(sel){sel=sel||'';return /^(l:|f:|#)/.test(sel)||sel==='inbox'||sel==='all'}   // 목록·폴더·태그·받은함·전체에서는 관리 할 일도 보임
function carePick76(){
  const ok=t=>t.status===0&&!t.care76&&!t.rid&&!t.cb76&&!t.ml80&&!isStep62(t);
  const c=Object.values(TASKS).filter(ok);if(!c.length){toast('옮길 할 일이 없어요');return}
  const ord=(typeof listOrder74==='function'?listOrder74():[]),li=t=>{const i=ord.indexOf(t.list||'inbox');return i<0?999:i};
  openPicker61({title:'🧽 관리로 옮길 것 (집안일·몸 돌봄처럼 때 되면 하는 것)',multi:true,tabs:[{k:'task',label:'📋 할 일',
    items:c.sort((a,b)=>li(a)-li(b)||(!!(b.rep&&b.rep.f)-!!(a.rep&&a.rep.f))||String(a.title).localeCompare(String(b.title),'ko')).map(t=>({id:t.id,label:t.title,
      sub:((t.quest&&t.rep&&t.rep.f)?'☑ 일퀘 · ':'')+((t.rep&&t.rep.f)?repLabel(t.rep):`반복 없음 → ${guess77(t.title)}일마다로 (옮긴 뒤 바꿔요)`),grp:listName(t.list||'inbox')}))}],
    onPick:sel=>{let n=0,g=0;sel.forEach(({id})=>{const t=TASKS[id];if(!t||!ok(t))return;if(!(t.rep&&t.rep.f))g++;careOn77(t,0);n++});save('config');render();
      if(n)toastAct(`🧽 ${n}개를 관리로 옮겼어요${g?` · 반복이 없던 ${g}개는 주기를 어림으로 정했어요`:''} · 원래 목록에도 그대로 있어요`,g?'주기 보기':'관리 창',()=>careSheet76(),7000)}})}
// 반복 규칙을 통째로(주 N회·평일·요일…) 넘길 수 있게
careOn77=(function(prev){return function(t,n){if(n&&typeof n==='object'){if(t)t.rep=clone(n);return prev.call(this,t,0)}return prev.call(this,t,n)}})(careOn77);
function repOpts106(){const td=midKey68(),wd=dowOf(td),md=+td.slice(8);
  return [[{f:'w',i:1,wd:[1,2,3,4,5]},'평일마다'],[{f:'w',i:1,wd:[6,0]},'주말마다'],[{f:'w',i:1,wd:[wd]},`매주 ${WDK[wd]}요일`],
    [{f:'x',n:1},'주 1회'],[{f:'x',n:2},'주 2회'],[{f:'x',n:3},'주 3회'],[{f:'m',i:1,md:[md]},`매월 ${md}일`]]}
function detail106(t){ // 상세에서 요일·날짜로 정하기. 이미 열려 있는 상세 위에서도 반복 칸이 펼쳐지게
  if(!t.care76)careOn77(t,0);
  const open=()=>{try{if(sheetCtx&&sheetCtx.task===t.id&&!$('sheet').hidden){tsRedraw()}else openTaskSheet(t.id)}catch(e){openTaskSheet(t.id)}
    setTimeout(()=>{const b=document.querySelector('#sheetC [data-p78="rep"],#sheetC [data-x56panel="rep"],#sheetC [data-x56panel="when"]');if(b)b.click()},60)};
  save('config');render();toast('🧽 관리로 옮겼어요 · 아래 반복 칸에서 요일·날짜를 정해요');setTimeout(open,30)}
function cycleMenu77(t,x,y,after){const cur=t.rep&&t.rep.f==='d'?(+t.rep.i||1):0,g=guess77(t.title);
  const opts=[[1,'매일'],[2,'2일마다'],[3,'3일마다'],[7,'7일마다 (매주)'],[10,'10일마다'],[14,'14일마다 (2주)'],[30,'30일마다 (한 달)']];
  const curL=t.rep&&t.rep.f?repLabel(t.rep):'';
  menu61(x,y,`↻ '${esc(t.title.length>16?t.title.slice(0,16)+'…':t.title)}' 얼마마다?`,[...opts.map(([n,l])=>({l:(cur===n?'● ':'○ ')+l+(!cur&&n===g?' ← 어림':''),f:()=>after(n)})),'-',
    ...repOpts106().map(([r,l])=>({l:(curL===repLabel(r)?'● ':'○ ')+l,f:()=>after(r)})),'-',
    {l:'✎ 요일·날짜로 자세히 정하기',f:()=>detail106(t)}])}
function careToggle76(t){if(!t)return;const on=!t.care76,pt=(typeof lastPt==='object'&&lastPt)||{x:innerWidth/2,y:innerHeight/2};
  const go=n=>{const bak=on?{rep:t.rep?clone(t.rep):null,due:t.due||null}:null;
    if(on)careOn77(t,n);else setCare76(t,false);save('config');render();
    toastAct(on?`🧽 '${t.title}' 관리로 (${repLabel(t.rep)}) · 오늘 목록·캘린더 종일 칸에서 빠지고 관리 줄에 떠요 · 원래 목록에도 그대로 있어요`:`'${t.title}' 관리에서 뺐어요 · 다시 할 일 목록에`,'되돌리기',()=>{if(on){setCare76(t,false);t.rep=bak.rep;t.due=bak.due;saveTask(t)}else setCare76(t,true);render()})};
  if(on&&!(t.rep&&t.rep.f)){cycleMenu77(t,pt.x,pt.y,go);return}
  go(0)}
function careMenu76(t,x,y){menu61(x,y,`🧽 ${esc(t.title.length>22?t.title.slice(0,22)+'…':t.title)}`,[
  {l:'✎ 열기 (반복·점수 고치기)',f:()=>openTaskSheet(t.id)},
  {l:`↻ 주기 바꾸기 (지금 ${esc(repLabel(t.rep))})`,f:()=>cycleMenu77(t,x,y,n=>{t.rep=(n&&typeof n==='object')?clone(n):{f:'d',i:n};saveTask(t);render();toast(`'${t.title}' ${repLabel(t.rep)}`)})},
  {l:'⏭ 이번엔 건너뛰기 (다음 차례로)',dis:!(t.due&&t.due<=midKey68()),f:()=>skipToday61(t)},
  '-',{l:'🧽 관리에서 빼기 (할 일 목록으로)',f:()=>careToggle76(t)}])}
// 입력칸 옆 🧽: 누르면 입력에 ' %'를 붙여 관리로 등록(미리보기 칩에 '🧽 관리'가 뜸). 새 줄을 늘리지 않고 같은 줄에 작게.
function addBtn106(){if(curView()!=='tasks')return;const f=document.querySelector('form[data-taddform="tasks"]');if(!f||f.querySelector('.c106b'))return;
  const row=f.querySelector('.in')||f;const b=document.createElement('button');b.type='button';b.className='c106b';b.textContent='🧽';b.title='관리로 등록 — 집안일·몸 돌봄처럼 때 되면 하는 것 (입력에 % 붙이기. 입력 중에 직접 %7 처럼 적어도 돼요)';b.setAttribute('aria-label','관리로 등록');
  row.appendChild(b)}
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('.c106b');if(!b)return;e.preventDefault();e.stopPropagation();
  const i=document.getElementById('tAdd');if(!i)return;const on=/(^|\s)%\d{0,3}(\s|$)/.test(i.value);
  i.value=on?i.value.replace(/(^|\s)%\d{0,3}(?=\s|$)/,'$1').replace(/\s+$/,''):(i.value.replace(/\s+$/,'')+' %').trim();
  i.dispatchEvent(new Event('input',{bubbles:true}));i.focus();b.setAttribute('aria-pressed',String(!on))},true);

/* ---- 오늘 한 반복 할 일: 목록에 ✓ 오늘 함 ---- */
function doneMark106(){if(curView()!=='tasks')return;const L=$('tList');if(!L)return;const g=gk76();
  L.querySelectorAll('.trow[data-task]').forEach(el=>{const t=TASKS[el.dataset.task];if(!t||t.status!==0||!(t.rep&&t.rep.f))return;
    const did=t.last===g||(t.pd73&&t.pd73.d===g);if(!did||el.classList.contains('dtd106'))return;el.classList.add('dtd106');
    const m=el.querySelector('.tm')||el.querySelector('.tb');if(m&&!el.querySelector('.c106ok'))m.insertAdjacentHTML('beforeend','<span class="c106ok" title="오늘 이미 했어요 · 줄에 보이는 날짜는 다음 차례예요">✓ 오늘 함</span>')})}
renderTasks=(function(prev){return function(){const x=prev.apply(this,arguments);try{doneMark106();addBtn106()}catch(e){console.error(e)}return x}})(renderTasks);

/* ---- 관리 줄 접기 (홈 오늘·할 일 오늘) ---- */
careRow76=(function(prev){return function(){const h=prev.apply(this,arguments);if(!h||h.indexOf('<div class="care76">')!==0)return h;
  try{const f=!!cfg76().fold,tp=document.createElement('template');tp.innerHTML=h;const box=tp.content.firstElementChild;if(!box)return h;
    const head=box.querySelector('.c76h');if(f)[...box.children].forEach(x=>{if(x!==head)x.remove()});
    box.insertAdjacentHTML('afterbegin',`<button type="button" class="c76h f106" data-c106f="1" aria-expanded="${!f}" title="${f?'관리 줄 펴기':'관리 줄 접기'}">${f?'▸':'▾'}</button>`);
    return box.outerHTML}catch(e){return h}}})(careRow76);
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-c106f]');if(!b)return;e.preventDefault();e.stopPropagation();
  const c=cfg76();c.fold=c.fold?0:1;save('config');render()},true);

/* ---- ② 상세 '이어진 곳' 접기 ---- */
drawTaskSheet=(function(prev){return function(){const r=prev.apply(this,arguments);try{
  const sc=$('sheetC'),t=TASKS[(sheetCtx||{}).task],c=sc&&sc.querySelector('.ln60 .conn60');
  if(c&&t&&!c.dataset.d106){c.dataset.d106=1;const a=t.aid&&C.actions.find(x=>x.id===t.aid),lab=c.querySelector(':scope > span.tiny'),n=c.querySelectorAll('.chipbtn,.cx61,.mx').length;
    if(a&&n){const d=document.createElement('details');d.className='conn106';
      d.innerHTML=`<summary class="tiny muted">🃏 '${esc(a.name)}' 카드에 이어진 다른 것 ${n}개 <small>(이 할 일 말고 카드에 붙은 것들)</small></summary>`;
      [...c.childNodes].forEach(x=>{if(x!==lab)d.appendChild(x)});c.innerHTML='';c.appendChild(d)}}
  }catch(e){console.error(e)}return r}})(drawTaskSheet);

/* ---- ③ 주 N회 횟수: 같은 날 같은 카드 중복은 1번 ---- */
function dayCnt99(t,k){const d=DAYS[k];let own=0,oth=0,tr=0;if(!d||!t)return{n:0,tr:0};
  (d.entries||[]).forEach(e=>{
    if(e.tid===t.id)own++;
    else if(t.aid&&e.aid===t.aid&&e.tid!=null)oth++;
    else if(e.kind==='start65'&&e.t65){const x=TASKS[e.t65];if(e.t65===t.id||(t.aid&&x&&x.aid===t.aid))tr=1}});
  return{n:Math.max(own,oth),tr}}
function ann106(){try{document.querySelectorAll('#sheetC .w105c').forEach(card=>{const lis=[...card.querySelectorAll('ul.l105 li')];if(!lis.length)return;
  const day=li=>(li.textContent.match(/^\s*\S+/)||[''])[0],by={};lis.forEach(li=>{(by[day(li)]=by[day(li)]||[]).push(li)});let dup=0;
  Object.values(by).forEach(g=>{const own=g.filter(li=>/이 할 일/.test(li.textContent)&&!/같은 카드/.test(li.textContent)),oth=g.filter(li=>/같은 카드로 이은 다른 할 일/.test(li.textContent));
    if(own.length&&oth.length){const skip=oth.length-Math.max(0,oth.length-own.length);   // 이 할 일 기록 수만큼은 같은 일로 보고 뺌
      oth.slice(0,Math.min(oth.length,own.length)).forEach(li=>{li.classList.add('dup106');li.insertAdjacentHTML('beforeend',' <b>↩ 같은 날 같은 일이라 1번으로 셈</b>');dup++})}});
  const lb=[...card.querySelectorAll('.tiny.muted')].find(x=>/셈에 들어간 기록/.test(x.textContent));
  if(lb&&dup)lb.innerHTML=lb.innerHTML.replace(/셈에 들어간 기록 \d+개/,`셈에 들어간 기록 ${lis.length-dup}개 <b>(같은 날 겹친 ${dup}개는 1번으로 빼고)</b>`)})}catch(e){console.error(e)}}
openSheet=(function(prev){return function(){const r=prev.apply(this,arguments);try{if(sheetCtx&&sheetCtx.wk105)ann106()}catch(e){}return r}})(openSheet);

/* ---- ④ 뽀모도로 ↔ 할 일 ---- */
function pKey106(name){return String(name||'').replace(/[^\p{L}\p{N}]/gu,'').slice(0,3)}
function pTask106(kindName){const g=pget88(),k=g.kinds.find(z=>z.name===kindName);if(k&&k.tid106==='-')return null;
  if(k&&k.tid106&&TASKS[k.tid106]&&TASKS[k.tid106].status===0)return TASKS[k.tid106];
  const key=pKey106(kindName);if(key.length<2)return null;
  const c=Object.values(TASKS).filter(t=>t.status===0&&t.rep&&t.rep.f&&!t.rid&&!t.cb76&&!t.ml80&&!isStep62(t)&&String(t.title).replace(/[^\p{L}\p{N}]/gu,'').includes(key));
  c.sort((a,b)=>(b.rep.f==='x')-(a.rep.f==='x')||String(a.title).length-String(b.title).length);return c[0]||null}
function didToday106(t){const g=gk76(),d=DAYS[g];return t.last===g||!!(d&&(d.entries||[]).some(e=>e.tid===t.id||(t.aid&&e.aid===t.aid&&e.tid!=null)))}
function pLink106(row){const c=C.pomo88||{};if(c.link106===0)return;const t=pTask106(row.k);if(!t||didToday106(t))return;
  const day=curDay(),date=day.date,n0=(day.entries||[]).length;
  try{completeTask(t,{direct:1})}catch(e){console.error(e);return}
  const d2=DAYS[date]||day,es=(d2.entries||[]),e=es.slice(n0).reverse().find(x=>x.tid===t.id);if(!e)return;row.tid=t.id;save('config');
  toastAct(`✓ '${t.title}'도 오늘 한 걸로 기록했어요 · 🍅 ${row.k}`,'되돌리기',()=>{try{removeEntry(date,e.id)}catch(x){console.error(x)}},7000)}
pLog88=(function(prev){return function(row){const r=prev.apply(this,arguments);try{if(row&&row.f===1&&row.k)pLink106(row)}catch(e){console.error(e)}return r}})(pLog88);
pComplete88=(function(prev){return function(){const ph=PM88&&PM88.phase;const r=prev.apply(this,arguments);
  try{if(ph==='work'&&PM88&&PM88.hold==='workdone'&&(C.pomo88||{}).ab106!==0&&pget88().b>0){pAct88('brk');toast('🍅 '+pget88().w+'분 끝! 쉬는 '+pget88().b+'분을 시작했어요')}}catch(e){console.error(e)}return r}})(pComplete88);
// 뽀모도로 창(시작 전)에 할 일 연결 칸
pOpen88=(function(prev){return function(){const r=prev.apply(this,arguments);try{
  const jar=document.querySelector('#sheetC .p88jar');if(!jar||document.querySelector('#sheetC .p106'))return r;
  const g=pget88(),kid=(sheetCtx&&sheetCtx.p88k)||g.kinds[0].id,k=g.kinds.find(z=>z.id===kid)||g.kinds[0],auto=pTask106(k.name);
  const reps=Object.values(TASKS).filter(t=>t.status===0&&t.rep&&t.rep.f&&!t.rid&&!t.cb76&&!t.ml80&&!isStep62(t)).sort((a,b)=>String(a.title).localeCompare(String(b.title),'ko'));
  const sel=k.tid106==null?'':k.tid106;
  jar.insertAdjacentHTML('afterend',`<label class="small p88jar p106">✓ 같이 기록할 할 일 <select data-p106="${k.id}"><option value="" ${sel===''?'selected':''}>자동 ${auto?'· '+esc(auto.title):'(비슷한 이름이 없어요)'}</option><option value="-" ${sel==='-'?'selected':''}>연결 안 함</option>${reps.map(t=>`<option value="${t.id}" ${sel===t.id?'selected':''}>${esc(t.title)}</option>`).join('')}</select></label>
    <p class="tiny muted" style="margin:0">${g.w}분을 꽉 채우면 이 할 일도 오늘 한 걸로 기록돼요(하루 한 번 · 되돌리기 가능). 쉬는 ${g.b}분은 저절로 시작해요.</p>`)
  }catch(e){console.error(e)}return r}})(pOpen88);
addEventListener('change',e=>{const s=e.target;if(!s||!s.dataset||s.dataset.p106==null)return;e.stopPropagation();
  const c=pset88(),k=c.kinds.find(z=>z.id===s.dataset.p106);if(!k)return;if(s.value==='')delete k.tid106;else k.tid106=s.value;save('config');pOpen88(true)},true);

/* ---- ⑤ 캘린더: 주 N회 자리를 끝내면 그 시각에 ✓ 블록 ---- */
function tm106(t,k){return t.time||(t.sl91&&t.sl91[k])||''}
function repDone106(t,k){return t.status===0&&t.rep&&t.rep.f&&(t.due!==k||t.rep.f==='x')}
function doneBlk77(k){const out=[],seen=new Set(),p=CAL77;CAL77=1;let es=[];try{es=doneOn(k)}finally{CAL77=p}
  es.forEach(e=>{const t=TASKS[e.tid];if(!t||seen.has(t.id)||t.cb76||isStep62(t))return;const tm=tm106(t,k);if(!tm)return;
    const once=t.status===2&&t.doneAt===k,rep=repDone106(t,k);if(!once&&!rep)return;seen.add(t.id);out.push({t:tm===t.time?t:Object.assign({},t,{time:tm}),e,once})});
  return out}
function doneTasks84(k){const p=CAL77;CAL77=1;let es=[];try{es=doneOn(k)}finally{CAL77=p}
  const seen=new Set(),out=[];
  es.forEach(e=>{const t=TASKS[e.tid];if(!t||seen.has(t.id)||t.cb76||t.ml80||isStep62(t))return;
    const once=t.status===2&&t.doneAt===k,rep=repDone106(t,k);if(!once&&!rep)return;seen.add(t.id);out.push({t,e,once})});
  return {list:out,raw:es.length}}
function allday84(){const pane=$('calPane');if(!pane||!calShown())return;
  let most=0;
  pane.querySelectorAll('.tgall [data-drop^="allday:"]').forEach(c=>{const k=c.dataset.drop.slice(7);c.querySelectorAll('.dd84').forEach(x=>x.remove());
    const ds=doneTasks84(k).list.filter(({t})=>!tm106(t,k));
    if(ds.length)c.insertAdjacentHTML('beforeend',ds.map(({t,once})=>chip84(t,once,'dd84')).join(''));
    most=Math.max(most,c.querySelectorAll('.cchip').length)});
  const tg=pane.querySelector('.alltog');if(tg&&most>3&&!/[▾▴]/.test(tg.textContent))tg.textContent='종일 '+(ui.allOpen?'▴':'▾')}

/* ---- ⑥ '✓ 오늘 한 단계' 줄: 기본 접힘(궁금할 때만 펴기) ---- */
var DN106=new Set();
function dn75(t){try{const r=t&&t.status===0&&C.mig62&&rtOfT62(t);if(!r)return '';const D=dateKey();
  const st=(r.steps||[]).filter(s=>{const k=TASKS[s.tid];return k&&k.status!==-1&&k.last===D&&stDone62(k)});if(!st.length)return '';
  const open=DN106.has(r.id);
  return `<details class="dn75 d106" data-r106="${r.id}"${open?' open':''}><summary class="lb">✓ 오늘 한 단계 <b>${st.length}</b>${open?' <small>누르면 되돌려요</small>':''}</summary><div class="d106b">${st.map(s=>`<button type="button" class="chipbtn" data-u74s="${s.tid}" data-u74r="${r.id}" title="'${esc(stName61(s))}' 체크 되돌리기">${esc(stName61(s))} ↶</button>`).join('')}</div></details>`}catch(e){return ''}}
document.addEventListener('toggle',e=>{const d=e.target;if(d&&d.classList&&d.classList.contains('d106')&&d.dataset.r106){d.open?DN106.add(d.dataset.r106):DN106.delete(d.dataset.r106)}},true);
