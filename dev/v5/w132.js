/* v13.4 (w132): 할 일 '오늘' 순서(밀린 위·관리/끝냄 아래)·모두 내일로 · 날짜 없음 칸(루틴 단계) 없앰 · 🧽 입력 단추 한 줄 · 할 일 머리줄 맞추기 + ⋯ 메뉴
   · 관리로 옮길 때 🔕 경보도 끄기 · ⚠ n일째 → 기록 달력 · 관리 묶음 머리 = 폴더 · 3일 보기 하루씩 · 🙈 숨김 칩 뺌 · 종일 칸 접기·끌기 */

/* ---------- ① 할 일 '오늘': [⏳ 밀린] → 오늘 → ☑ 일퀘 → (경보 칸) → [🧽 관리][📥 날짜 없음][✓ 끝냄] ---------- */
// w131 tcBuild131을 다시 선언(renderTasks 감쌈이 이름으로 부름). 밀린 칩은 맨 위 한 줄, 관리·끝냄은 맨 아래(끝냄이 마지막)
function tcBuild131(keep){const L=$('tList');if(!L)return;const c=TC131();
  const grp=k=>{const h=L.querySelector(`:scope>.tgroup>.ghead[data-tgcollapse="${k}"]`);return h?h.parentElement:null};
  const rows=g=>g?g.querySelectorAll('.trow[data-task]').length:0;
  const g0=grp('d0'),g1=grp('d1'),g9=grp('d9'),care=L.querySelector(':scope>.care76:not(.hint):not(.bar)'),
    comp=L.querySelector(':scope>.tgroup.tcomp:not(.twont)'),wont=L.querySelector(':scope>.tgroup.twont');
  const n0=rows(g0),n9=rows(g9),nd=comp?comp.querySelectorAll('.trow.done').length:0,nw=wont?wont.querySelectorAll('.trow').length:0;
  let nc=0;if(care){const b=care.querySelector('.c76h[data-c76open] b');nc=b?+b.textContent||0:0}
  // 일퀘 칩(☑)은 '오늘' 것 → 오늘 바로 밑 한 줄 .q131
  let qrow=null;if(care){const qs=[...care.querySelectorAll(':scope>.c76c.q')];if(qs.length){qrow=document.createElement('div');qrow.className='q131';
    qrow.innerHTML='<span class="c76h q131h" title="오늘의 일퀘">☑ 일퀘</span>';qs.forEach(x=>qrow.appendChild(x))}}
  const mkBar=(items,cls)=>{const bar=document.createElement('div');bar.className='tc131'+(cls?' '+cls:'');bar.setAttribute('role','group');bar.setAttribute('aria-label',cls?'밀린 할 일':'오늘 말고 나머지');
    bar.innerHTML=items.map(it=>`<button type="button" class="chipbtn tc131b${c[it.k]?' on':''}" data-tc131="${it.k}" aria-pressed="${!!c[it.k]}" aria-expanded="${!!c[it.k]}" title="${esc(it.t)} · 눌러서 ${c[it.k]?'접기':'펼치기'}">${it.l}<span class="ar131" aria-hidden="true">${c[it.k]?'▾':'▸'}</span></button>`).join('');return bar};
  const box=(it,at)=>{const b=document.createElement('div');b.className='tp131';b.dataset.tp131=it.k;it.els.forEach(el=>{el.remove();if(c[it.k])b.appendChild(el)});
    if(c[it.k]&&b.childNodes.length){at.after(b);return b}return at};
  // 위: 밀린 것 (≤3이면 칩 없이 펼친 채, 원래 접어 둔 사람은 접힌 채)
  let top=null;const inl=g0&&n0<=LATEMAX131;
  if(g0&&inl){L.prepend(g0);g0.classList.add('l132');if(keep.tgd0){const h=g0.querySelector(':scope>.ghead');h.classList.add('shut');[...g0.children].forEach(x=>{if(x!==h)x.remove()})}
    g0.querySelector(':scope>.ghead').insertAdjacentHTML('afterend',ltBtn132());top=g0}
  else if(g0){const it={k:'late',l:`⏳ 밀린 ${n0}`,t:'날짜가 지난 할 일',els:[g0]};const bar=mkBar([it],'top132');if(c.late)bar.insertAdjacentHTML('beforeend',ltBtn132());L.prepend(bar);top=box(it,bar)}
  // 오늘 + 일퀘 줄
  if(qrow){if(g1)g1.after(qrow);else if(top)top.after(qrow);else L.prepend(qrow)}
  // 아래: 관리 · 날짜 없음 · 끝냄(맨 끝)
  const items=[
    care&&{k:'care',l:`🧽 관리${nc?' '+nc:''}`,t:'때 되면 하는 관리 — 펼친 줄의 「🧽 관리」를 누르면 관리 창',els:[care]},
    g9&&n9&&{k:'nd',l:`📥 날짜 없음 ${n9}`,t:'날짜 없이 마감만 있는 할 일',els:[g9]},
    (nd||nw)&&{k:'done',l:`✓ 끝냄 ${nd}${nw?` <small>· ✕${nw}</small>`:''}`,t:'오늘 끝낸 할 일'+(nw?' · ✕ 하지 않기로 한 것':''),els:[comp,wont].filter(Boolean)}
  ].filter(Boolean);
  if(items.length){const bar=mkBar(items);L.append(bar);let at=bar;items.forEach(it=>{at=box(it,at)})}
  // 칩 속 묶음 머리 접기 단추는 숨김(칩이 대신) · 관리 줄 접기 ▾ 도
  L.querySelectorAll('.tp131 > .tgroup > .ghead[data-tgcollapse],.tp131 .c76h.f106').forEach(h=>h.classList.add('hid131'));
  L.querySelectorAll('.tp131 > .tgroup.tcomp .ghead[data-tcompl],.tp131 > .tgroup.twont .ghead[data-twont]').forEach(h=>h.classList.add('hid131'))}
function ltBtn132(){return `<button type="button" class="chipbtn lt132" data-lt132="1" title="밀린 할 일을 모두 내일로 옮겨요 — ☠ 미룸으로 안 셈 (알림에서 되돌리기)">📆 모두 내일로 <small>☠ 없이</small></button>`}
// 밀린 것 = 오늘 화면에서 '지난 할 일' 묶음에 드는 것(진행 중인 여러 날 일정·루틴 단계·관리 빼고)
function late132(){const td=midKey68();return Object.values(TASKS).filter(t=>t&&t.status===0&&t.due&&t.due<td&&!hid76(t)&&!isRtKid71(t)&&taskMatches(t,'today')&&dateBucket(t)[0]==='0')}
function allTmr132(){const ts=late132();if(!ts.length){toast('밀린 할 일이 없어요');return}
  const to=addDays(midKey68(),1),sn=ts.map(t=>[t.id,t.due]);
  ts.forEach(t=>{t.due=to;saveTask(t)});render();
  toastAct(`📆 밀린 ${ts.length}개 → 내일 · ☠ 안 셈`,'되돌리기',()=>{sn.forEach(([id,d])=>{const t=TASKS[id];if(t&&t.status===0){t.due=d;saveTask(t)}});render()},7000)}
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-lt132]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();allTmr132()},true);

/* ---------- ② 오늘 화면의 '날짜 없음 n' 빈 칸 = 루틴 단계 → 목록에서 셈하지 않음 ---------- */
// 루틴 단계(t.parent=루틴 머리)는 머리 줄 ▸ 안에서만 보임. w71이 '머리가 맞으면 단계도 맞음'으로 넣어서 날짜 없음 묶음(빈 머리)·개수에 섞였음
taskMatches=(function(prev){return function(t,sel){
  if(t&&isRtKid71(t)&&sel!=='routine'&&sel!=='done'&&!(ui.tq71&&ui.tq71.trim()&&curView()==='tasks'&&sel===(C.ui.tasks||{}).sel))return false;
  return prev.apply(this,arguments)}})(taskMatches);

/* ---------- ③ 할 일 머리줄: 좁아지면 덜 중요한 것부터 ⋯ 메뉴로 (캘린더를 침범하지 않게) + ⋯ 메뉴 ---------- */
function fit132(){const h=$('tTitle'),p=h&&h.parentElement,m=$('tMenu');if(!p||!m||!p.classList.contains('ptitle'))return;
  const L=['z1n132','z2n132','z3n132','z4n132'];p.classList.remove(...L);if(!p.getBoundingClientRect().width)return;
  const over=()=>m.getBoundingClientRect().right>p.getBoundingClientRect().right+0.5;
  for(const c of L){if(!over())break;p.classList.add(c)}
  // 입력 줄도: 좁으면 '자세히' 글자를 숨겨 🧽까지 한 줄에
  const f=document.querySelector('form.tadd[data-taddform="tasks"]');if(f){f.classList.remove('nr132');const i=f.querySelector('.in'),z=f.querySelector('.c106b');
    const ip=f.querySelector('input');if(i&&z&&(z.getBoundingClientRect().right>i.getBoundingClientRect().right+0.5||(ip&&ip.getBoundingClientRect().width<170)))f.classList.add('nr132')}}
{let q=0;const go=()=>{q=0;try{fit132()}catch(e){console.error(e)}},ask=()=>{if(!q)q=requestAnimationFrame(go)};
  addEventListener('resize',ask);
  try{const ro=new ResizeObserver(ask);let seen=null;
    renderTasks=(function(prev){return function(){const r=prev.apply(this,arguments);try{const p=$('tTitle')&&$('tTitle').parentElement;if(p&&p!==seen){seen=p;ro.observe(p)}ask()}catch(e){console.error(e)}return r}})(renderTasks)}catch(e){console.error(e)}}
function tm132(x,y){const g=$('tGroup'),s=$('tSort'),T=C.ui.tasks||{},sel=T.sel||'today';
  const chips=(el,k)=>el?`<div class="m61w m132">${[...el.options].map(o=>`<button type="button" class="chipbtn" data-m132="${k}|${esc(o.value)}" aria-pressed="${o.value===el.value}">${esc(o.text.replace(/^(정렬|묶기): /,''))}</button>`).join('')}</div>`:'';
  const items=[{html:`<div class="m61h">묶기</div>${chips(g,'g')}`,f:()=>{}},{html:`<div class="m61h">정렬</div>${chips(s,'s')}`,f:()=>{}},'-',
    {l:'☝ 오늘은 하나만 남기기…',f:()=>{const b=document.querySelector('.ptitle [data-open93]');if(b)b.click()}},
    {l:'☑ 여러 개 고르기',f:()=>{const b=$('tSelBtn');if(b)b.click()}}];
  if(sel.startsWith('l:')){const l=C.lists.find(z=>z.id===sel.slice(2));if(l)items.push('-',{l:`📂 '${esc(l.name)}' 목록 이름·색·순서…`,f:()=>setTimeout(()=>listMenu61(l,x,y),0)})}
  items.push({l:'＋ 새 목록',f:()=>{const b=document.querySelector('[data-tlistadd]');if(b)b.click()}});
  menu61(x,y,'⋯ 보기',items)}
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('#tMenu');if(!b)return;e.preventDefault();e.stopImmediatePropagation();const r=b.getBoundingClientRect();tm132(r.right-8,r.bottom+4)},true);
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-m132]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();
  const i=b.dataset.m132.indexOf('|'),k=b.dataset.m132.slice(0,i),v=b.dataset.m132.slice(i+1),el=$(k==='g'?'tGroup':'tSort');closeMenu61();
  if(el&&el.value!==v){el.value=v;el.dispatchEvent(new Event('change',{bubbles:true}))}},true);

/* ---------- ④ 관리로 옮길 때 알림에 🔕 경보도 끄기 (관리 차례가 대신 알려 주니까) ---------- */
function watch132(t){return t?(C.watches||[]).find(w=>w&&w.action&&(w.action===t.aid||w.action==='@t:'+t.id))||null:null}
function alarmBtn132(t){const w=watch132(t),to=$('toast');if(!w||!to||!to.classList.contains('on')||to.querySelector('.ab132'))return;
  const b=document.createElement('button');b.className='tbtn55 ab132';b.textContent='🔕 경보도 끄기';b.title='이 카드의 방치 경보를 꺼요 — 관리 차례가 대신 알려 줘요';
  b.onclick=e=>{e.stopPropagation();to.classList.remove('on');to.style.pointerEvents='';alarmOff132(w)};to.appendChild(b);
  clearTimeout(toast._t);toast._t=setTimeout(()=>{to.classList.remove('on');to.style.pointerEvents=''},9000)}
function alarmOff132(w){const i=(C.watches||[]).indexOf(w);if(i<0)return;C.watches.splice(i,1);save('config');render();
  toastAct('🔕 방치 경보를 껐어요 — 관리 차례가 대신 알려 줘요','되돌리기',()=>{if(!C.watches.includes(w))C.watches.splice(Math.min(i,C.watches.length),0,w);save('config');render()})}
toCare131=(function(prev){return function(aid){const before=new Set(Object.keys(TASKS));const r=prev.apply(this,arguments);
  try{const t=Object.values(TASKS).find(x=>!before.has(x.id)&&x.aid===aid&&x.care76);if(t)alarmBtn132(t)}catch(e){console.error(e)}return r}})(toCare131);
var PEND132=null;   // careToggle76은 반복이 없으면 주기 메뉴를 거쳐 나중에 알림을 띄움 → 알림이 뜰 때 붙임
careToggle76=(function(prev){return function(t){PEND132=t&&!t.care76?t:null;return prev.apply(this,arguments)}})(careToggle76);
toastAct=(function(prev){return function(m){const r=prev.apply(this,arguments);
  try{const t=PEND132;if(t&&/^🧽 /.test(String(m||''))&&String(m).includes(t.title)&&t.care76){PEND132=null;alarmBtn132(t)}}catch(e){console.error(e)}return r}})(toastAct);

/* ---------- ⑤ ⚠ n일째 꼬리표 → 그 카드를 언제 했는지 기록 달력 ---------- */
function key132(t){const w=watch132(t);return w?w.action:(t.aid||'@t:'+t.id)}
var RC132={id:null,m:null};
function recCal132(id,x,y,mk){const t=TASKS[id];if(!t)return;const key=key132(t),wt=typeof watchTarget==='function'?watchTarget(key):null,w=watch132(t);
  const did=k=>{const d=DAYS[k];if(!d)return false;try{if(wt&&wt.done(d))return true}catch(_){}return (d.entries||[]).some(e=>e.tid===t.id||(t.aid&&e.aid===t.aid))};
  const td=gk76();mk=mk||td.slice(0,7);RC132={id,m:mk,x,y};
  const first=mk+'-01',ws=weekStartD(first),nm=addDays(first,40).slice(0,7)+'-01';let cells='';
  for(let i=0;i<42;i++){const k=addDays(ws,i);if(i>=35&&k>=nm)break;const inm=k.slice(0,7)===mk,ok=did(k);
    cells+=`<span class="rc132d${inm?'':' o'}${ok?' ok':''}${k===td?' td':''}${k>td?' fu':''}" title="${esc(fmtD(k))}${ok?' · 했어요':''}">${+k.slice(8)}${ok?'<i>✓</i>':''}</span>`}
  let last=null;for(let i=0;i<=400;i++){const k=addDays(td,-i);if(did(k)){last=k;break}}
  let n=0;for(let i=0;i<30;i++)if(did(addDays(td,-i)))n++;
  const [yy,mm]=mk.split('-');
  const html=`<div class="rc132"><div class="rc132h"><button type="button" class="ib" data-rc132="-1" aria-label="이전 달">‹</button><b>${+yy}년 ${+mm}월</b><button type="button" class="ib" data-rc132="1" aria-label="다음 달"${mk>=td.slice(0,7)?' disabled':''}>›</button></div>
    <div class="rc132g">${WKH71().map(d=>`<span class="rc132w">${d}</span>`).join('')}${cells}</div>
    <div class="small muted rc132s">${last?`마지막: ${esc(fmtD(last))}${last===td?' (오늘)':` (${diffDays(td,last)}일 전)`}`:'아직 한 기록이 없어요'} · 최근 30일 ${n}번${w?` · 경보 ${+w.days}일`:''}</div></div>`;
  menu61(x,y,`📅 ${esc(t.title.length>20?t.title.slice(0,20)+'…':t.title)} · 언제 했나`,[{html,f:()=>{}},'-',{l:'✎ 할 일 열기',f:()=>openTaskSheet(id)}])}
addEventListener('click',e=>{const s=e.target.closest&&e.target.closest('.a131');if(!s)return;
  const h=s.closest('[data-task],[data-ctask]')||s.closest('.d128r')&&s.closest('.d128r').querySelector('[data-ctask]'),id=h&&(h.dataset.task||h.dataset.ctask);if(!id||!TASKS[id])return;
  e.preventDefault();e.stopImmediatePropagation();const r=s.getBoundingClientRect();recCal132(id,r.left,r.bottom+4)},true);
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-rc132]');if(!b||!RC132.id)return;e.preventDefault();e.stopImmediatePropagation();
  const [y,m]=RC132.m.split('-').map(Number),d=new Date(Date.UTC(y,m-1+(+b.dataset.rc132),1)),mk=d.toISOString().slice(0,7);recCal132(RC132.id,RC132.x,RC132.y,mk)},true);
// 꼬리표는 누를 수 있는 것처럼 (title에 안내)
{const _t=alTip131;alTip131=function(x){return _t.apply(this,arguments)+' · 눌러서 언제 했는지 달력 보기'}}

/* ---------- ⑥ 관리 묶음 머리(예: 집 청소) = 폴더: 자기 차례·밀림 없음, 안의 관리가 각자 차례 ---------- */
// 폴더 = 관리이면서 열린 관리 하위가 있는 묶음 머리. 관리 목록·차례·캘린더 관리 블록·내일 짜기·⚠ 꼬리표에서 빠지고(careAll76),
// 목록 줄엔 '📦 밀린 n · 오늘 n'만. ○는 끝내지 않고 안내. 데이터는 안 바꿈(하위를 다 빼면 원래 관리로 돌아옴)
function folds132(){const s=new Set();Object.values(TASKS).forEach(k=>{if(k&&k.status===0&&k.parent&&isCare76(k))s.add(k.parent)});return s}
function isFold132(t,S){return !!(t&&t.status===0&&isCare76(t)&&(S||folds132()).has(t.id))}
function foldKids132(t){return kidsOf(t.id).filter(k=>k.status===0&&isCare76(k))}
window.isFold132=isFold132;window.foldKids132=foldKids132;
careAll76=(function(prev){return function(){const a=prev.apply(this,arguments),S=folds132();return S.size?a.filter(t=>!S.has(t.id)):a}})(careAll76);
alOf131=(function(prev){return function(t){if(isFold132(t))return null;return prev.apply(this,arguments)}})(alOf131);
// 묶음 위치는 가장 이른 하위 차례를 따름(전체·목록 화면의 날짜 묶음)
dateBucket=(function(prev){return function(t){if(isFold132(t)){const ks=foldKids132(t).filter(k=>k.due).sort((a,b)=>a.due.localeCompare(b.due));if(ks.length)return prev.call(this,ks[0])}return prev.apply(this,arguments)}})(dateBucket);
taskRow=(function(prev){return function(t,o){let h=prev.apply(this,arguments);try{if(!isFold132(t))return h;
  const td=midKey68(),ks=foldKids132(t),late=ks.filter(k=>k.due&&k.due<td).length,now=ks.filter(k=>k.due===td).length;
  const sum=`<span class="kcount f132" title="관리 묶음 — 안의 관리가 각자 차례예요">📦 ${ks.length}개${late?` · <b>밀린 ${late}</b>`:''}${now?` · 오늘 ${now}`:''}</span>`;
  h=h.replace(/<span class="kcount"[^>]*>[^<]*<\/span>/,sum).replace(/<span class="(late|tday)">[^<]*<\/span>/,'').replace(/<span class="c77m"([^>]*)>🧽 관리<\/span>/,'<span class="c77m"$1>🧽 관리 묶음</span>');
  h=h.replace(/<button class="tchk" data-tdone="([^"]+)"/,'<button class="tchk f132" data-f132="$1"').replace('<span class="tx">+','<span class="tx f132x">+')}catch(e){console.error(e)}return h}})(taskRow);
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-f132]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();const t=TASKS[b.dataset.f132];if(!t)return;
  if(C.ui.tfold&&C.ui.tfold[t.id]){delete C.ui.tfold[t.id];save('config');render()}
  toast(`📦 '${t.title}'은 관리 묶음이에요 — 안의 관리를 하나씩 체크해요`)},true);
// 관리 창: 묶음 칩으로 하위 접기·펴기(C.care128.fh[머리 id]=1이면 접음) — w128 listOf·sheetH·rowH가 읽음
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-f132c]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();
  const c=window.C128(),id=b.dataset.f132c;c.fh=c.fh&&typeof c.fh==='object'?c.fh:{};if(c.fh[id])delete c.fh[id];else c.fh[id]=1;save('config');window.deck128()},true);

/* ---------- ⑦ 캘린더 3일 보기: ‹ › 는 하루씩 (수목금 → 목금토) ---------- */
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-calnav]');if(!b)return;const n=+b.dataset.calnav;if(!n||((C.ui.cal||{}).mode!=='3day'))return;
  e.preventDefault();e.stopImmediatePropagation();ui.calKeepScroll=true;ui.calAnchor=addDays(ui.calAnchor||dateKey(),n);renderCal()},true);

/* ---------- ⑧ 종일 칸: 접기·펴기 표시를 내용 기준으로 + 끌어서 높이 바꾸기 고침 ---------- */
// 원래 끌기(v5i)는 문서 전체의 --allh만 바꿈 → 한 번 바꾼 뒤엔 칸에 박힌 --allh가 이겨서 다시 끌어도 안 움직였음. 칸 자체에 값을 넣고, 놓으면 저장·다시 그림
{let D=null;
  addEventListener('pointerdown',e=>{const h=e.target.closest&&e.target.closest('.allrz');if(!h)return;const w=h.closest('.tgwrap'),a=w&&w.querySelector(':scope>.tgall');if(!a)return;
    e.preventDefault();e.stopImmediatePropagation();a.classList.remove('open');ui.allOpen=false;
    D={a,sy:e.clientY,sh:a.getBoundingClientRect().height,full:a.scrollHeight,v:0};try{h.setPointerCapture(e.pointerId)}catch(_){}document.body.classList.add('dragging')},true);
  addEventListener('pointermove',e=>{if(!D)return;e.preventDefault();e.stopImmediatePropagation();
    const v=clamp(Math.round(D.sh+e.clientY-D.sy),28,Math.max(60,Math.min(640,D.full+2)));D.v=v;D.a.style.setProperty('--allh',v+'px')},true);
  const end=e=>{if(!D)return;const v=D.v;D=null;document.body.classList.remove('dragging');if(e)e.stopImmediatePropagation();
    if(v){C.ui.cal.allH=v;save('config')}ui.calKeepScroll=true;try{renderCal()}catch(x){console.error(x)}};
  addEventListener('pointerup',end,true);addEventListener('pointercancel',end,true);
  addEventListener('dblclick',e=>{if(!(e.target.closest&&e.target.closest('.allrz')))return;e.preventDefault();delete C.ui.cal.allH;ui.allOpen=false;save('config');ui.calKeepScroll=true;renderCal()},true)}
function allTog132(){document.querySelectorAll('.tgwrap>.tgall').forEach(a=>{const tg=a.querySelector('.alltog');if(!tg)return;
  const open=a.classList.contains('open'),cap=+C.ui.cal.allH||118,need=open?a.scrollHeight>cap+2:a.scrollHeight>a.clientHeight+2;
  [...tg.childNodes].forEach(n=>{if(n.nodeType===3)n.textContent=n.textContent.replace(/\s*[▾▴]\s*/g,'')});
  if(need)tg.insertAdjacentHTML('beforeend',`<span class="ar132">${open?'▴':'▾'}</span>`);
  tg.title=need?(open?'눌러서 종일 칸 접기':'눌러서 종일 칸 다 펴기')+' · 아래 손잡이를 끌면 높이 조절(두 번 누르면 처음 높이)':'종일 칸 · 아래 손잡이를 끌면 높이 조절'})}
renderCal=(function(prev){return function(){const r=prev.apply(this,arguments);try{allTog132()}catch(e){console.error(e)}return r}})(renderCal);
// 종일 칸 왼쪽 빈 곳을 눌러도 접기·펴기
addEventListener('click',e=>{const c=e.target.closest&&e.target.closest('.tgall>div:first-child');if(!c||e.target.closest('.alltog'))return;const b=c.querySelector('.alltog');if(b&&b.querySelector('.ar132')){e.preventDefault();b.click()}},true);

/* ---------- F67 기능 지도 ---------- */
F67=(function(prev){return function(){return prev.apply(this,arguments).filter(x=>!/캘린더 숨김/.test(x[0])).concat([
  ['📆 밀린 것 모두 내일로','할 일 → 오늘 → 맨 위 ⏳ 밀린 칩 펼치기 → 📆 모두 내일로','밀린 할 일을 한 번에 내일로 옮겨요. ☠ 미룸으로 안 세고, 알림에서 되돌릴 수 있어요',()=>{location.hash='tasks'},'밀린 내일 한꺼번에 미루기'],
  ['📅 ⚠ n일째 → 언제 했나 달력','할 일·관리 줄의 ⚠ n일째(또는 ⏳ n일째) 꼬리표 누르기','그 카드를 언제 했는지 달 달력에 ✓로 보여 줘요(‹ › 로 지난 달). 마지막으로 한 날·최근 30일 횟수도',()=>{location.hash='tasks'},'방치 경보 기록 달력 언제'],
  ['📦 관리 묶음 = 폴더','관리 할 일을 다른 관리 밑에 묶으면(예: 집 청소)','묶음 머리는 자기 차례·밀림이 없고 안의 관리가 각자 차례예요. 줄에 📦 n개 · 밀린 n · 오늘 n. 관리 창 위 📦 칩으로 접고 펴요',()=>{location.hash='tasks'},'관리 묶음 폴더 집 청소'],
  ['⋯ 할 일 보기 메뉴','할 일 화면 제목 줄 맨 오른쪽 ⋯','묶기·정렬·하나만 남기기·여러 개 고르기·목록 관리. 화면이 좁으면 제목 줄 단추가 이 메뉴로 들어가요',()=>{location.hash='tasks'},'묶기 정렬 메뉴 점점점']])}})(F67);
