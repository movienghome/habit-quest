/* ================= v6.3: 루틴 접힘 · 캘린더 PC도 가득 + 날짜 펼침 목록 · 일퀘 칸 = 상자 진행 · 이번 주 = 용기 · 추천 점수 · 몸무게 단계 =================
   맨 끝 모듈(v5s 뒤). 최상위 값은 var/function. 함수 선언(cal62tog·cal62fit·calN62)은 여기 것이 이겨요. */

/* ---- 1) 할 일 목록: 루틴은 기본 접힘 (펼친 것만 C.ui.tfold[id]='o') ---- */
function tShut63(t){const f=C.ui.tfold||{};if(t&&C.mig62&&rtOfT62(t))return f[t.id]!=='o';return !!f[t.id]}
addEventListener('click',e=>{const b=e.target.closest('[data-x56fold]');if(!b)return;const t=TASKS[b.dataset.x56fold];if(!t||!C.mig62||!rtOfT62(t))return;
  e.preventDefault();e.stopPropagation();C.ui.tfold=C.ui.tfold||{};if(C.ui.tfold[t.id]==='o')delete C.ui.tfold[t.id];else C.ui.tfold[t.id]='o';save('config');render()},true);
taskRow=(function(prev){return function(t,o){let h=prev.apply(this,arguments);try{
  if(t&&t.status===0&&C.mig62&&rtOfT62(t)){h=h.replace(/(data-x56fold="[^"]*"[^>]*>)([^<]*)(<\/button>)📦 /,(m,a,ar,c)=>a+(tShut63(t)?'▸':'▾')+c+'⏱ ').replace(/aria-label="묶음 (펴기|접기)" title="묶음 (펴기|접기)"/,()=>tShut63(t)?'aria-label="루틴 단계 펴기" title="루틴 단계 펴기"':'aria-label="루틴 단계 접기" title="루틴 단계 접기"')}
  if(t&&t.status===0&&wStep63(t))h=h.replace(/(<span class="tm">)/,'$1<span class="tiny" title="체크하면 몸무게 입력 칸이 열려요">⚖ 누르면 입력</span>')
}catch(e){}return h}})(taskRow);

/* ---- 2) 루틴 단계의 카드 연결은 '선택' ---- */
stRow62=(function(prev){return function(){let h=prev.apply(this,arguments);try{
  h=h.replace(/title="행동 카드와 이으면[^"]*">🃏 카드와 잇기<\/button>/,'title="선택 · 루틴 밖에서도 하는 행동이면 카드와 이어요. 기록·↻ 습관·통계가 한곳에 모여요">🃏 <small>카드와 잇기 (선택)</small></button>').replace('class="chipbtn x60c" data-r62op="card:','class="chipbtn x60c cl63" data-r62op="card:')}catch(e){}return h}})(stRow62);
rtCard62=(function(prev){return function(){let h=prev.apply(this,arguments);try{
  h=h.replace(/카드와 이은 단계는 카드 점수\(↻ 습관·☑ 일퀘도 체크\), 아니면 할 일 크기·중요도 점수\./,'점수는 할 일 크기·중요도로 들어가요. <b>카드 연결은 선택</b> — 샤워·스트레칭처럼 루틴 밖에서도 하는 행동일 때만 이으면, 어디서 하든 기록·↻ 습관·통계가 한 카드로 모여요.')}catch(e){}return h}})(rtCard62);
rtCard61=rtCard62;

/* ---- 3) 몸무게 단계: 체크 = 몸무게 입력 (사냥과 같은 점수) ---- */
function wStep63(t){return !!t&&(C.routines||[]).some(r=>(r.steps||[]).some(s=>s.tid===t.id&&s.aid==='@weigh'))}
function wSave63(v){
  v=parseFloat(v);if(!(v>=30&&v<=250)){toast('30~250 사이로 적어요');return false}if(!guard())return false;
  ui.off=0;commit(()=>{const day=today();day.weight=+v.toFixed(1);const w=day.entries.find(x=>x.kind==='weigh');if(w)w.name='몸무게 '+day.weight+'kg';else applyEntry(day,{kind:'weigh',type:'good',name:'몸무게 '+day.weight+'kg',xp:+C.weight.xp||0,gold:0})});
  wSync63();return true}
function wSync63(){const d=DAYS[dateKey()];if(!d||!d.weight||!tasksReady)return;(C.routines||[]).forEach(r=>(r.steps||[]).forEach(s=>{if(s.aid!=='@weigh')return;const t=TASKS[s.tid];if(t&&t.status===0&&t.last!==dateKey()){t.last=dateKey();t.cnt=(t.cnt||0)+1;saveTask(t)}}))}
function wAsk63(t){
  const d=DAYS[dateKey()];
  openSheet(`<div class="sh"><h3>⚖ 몸무게 기록</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <p class="help" style="margin:0 0 8px">루틴 단계 '${esc(t.title)}'는 몸무게를 적으면 끝나요 (✨${+C.weight.xp||0}, 사냥에서와 같아요).${d&&d.weight?` 오늘 이미 ${d.weight}kg 적었어요 — 고치려면 새로 적어요.`:''}</p>
    <form class="tadd" data-w63="1"><div class="in"><input id="w63In" type="number" step="0.1" min="30" max="250" inputmode="decimal" placeholder="kg" value="${d&&d.weight?d.weight:''}"><button class="btn sm" type="submit">기록</button></div></form>`);
  setTimeout(()=>{const i=$('w63In');i&&i.focus()},60)}
addEventListener('click',e=>{const b=e.target.closest('[data-tdone]');if(!b)return;const t=TASKS[b.dataset.tdone];if(!t||t.status!==0||!wStep63(t))return;e.preventDefault();e.stopImmediatePropagation();lastPt={x:e.clientX,y:e.clientY};wAsk63(t)},true);
document.addEventListener('submit',e=>{const f=e.target;if(!f.dataset||!f.dataset.w63)return;e.preventDefault();e.stopPropagation();if(wSave63($('w63In').value)){closeSheet();render();toast('몸무게를 적었어요 · 루틴 단계도 끝')}},true);

/* ---- 4) 지금 하면 좋은 것: 일퀘 줄에 카드 점수 ---- */
suggestions=(function(prev){return function(){const out=prev.apply(this,arguments);try{out.forEach(s=>{if(/^일퀘 · \+/.test(s.why||'')&&s.act){const a=C.actions.find(x=>x.id===s.act);
  s.why='일퀘 · '+(a?pts62({xp:a.xp,gold:Math.abs(+a.gold||0),cond:Math.abs(+a.cond||0)},{zero:'카드 점수 0'}):'상자 칸 채우기')}})}catch(e){console.error(e)}return out}})(suggestions);

/* ---- 5) 홈: 일퀘 칸 = 상자 진행만 (누르면 자세히) · 이번 주 칸 = 용기 목표만 (보스는 전투 칸) ---- */
function qSheet63(){
  const day=today(),n=C.dailies.length,dn=C.dailies.filter(q=>questDone(day,q)).length;
  sheetCtx={q63:1};
  openSheet(`<div class="sh"><h3>☑ 오늘의 일퀘 · ${dn}/${n}</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <div class="row" style="margin-bottom:8px"><div class="track" style="flex:1;min-width:100px"><div class="fill gold" style="width:${n?dn/n*100:0}%"></div></div>${chestDone(day)?'<span class="chest">🎁 상자 열림</span>':`<span class="tiny muted">다 하면 🎁 +💰${C.dailyBonus.gold}</span>`}</div>
    <div class="quests">${($('quests')||{}).innerHTML||'<div class="empty">편집 → 일퀘에서 만들어요.</div>'}</div>
    <p class="help" style="margin:8px 0">일퀘는 반복 할 일에 ☑를 붙인 거예요. 그날 뜨는 것만 나와요. 다 채우면 상자가 열려요(일퀘 자체 점수는 없고, 점수는 그 행동·할 일에서 받아요).</p>
    <div class="row" style="gap:6px"><button class="btn ghost sm" data-goedit="dailies">✎ 일퀘 편집 (요일 표)</button><button class="btn ghost sm" data-guide="quest">? 규칙</button></div>`)}
function qHome63(){try{
  const b=document.querySelector('.hblock[data-hid="quests"] .panel');if(!b)return;b.classList.add('q63');
  if(!b.querySelector('.q63go')){const r=b.querySelector('#questFill');const row=r&&r.closest('.row');if(row){row.classList.add('q63row');row.setAttribute('role','button');row.tabIndex=0;row.setAttribute('aria-label','오늘의 일퀘 자세히');row.insertAdjacentHTML('beforeend','<span class="q63go" aria-hidden="true">자세히 ›</span>')}}
  const day=today(),left=C.dailies.filter(q=>!questDone(day,q));let s=b.querySelector('.q63left');if(!s){s=document.createElement('div');s.className='q63left tiny muted';b.appendChild(s)}
  s.textContent=!C.dailies.length?'일퀘가 없어요 · 눌러서 만들기':left.length?`남은 것 ${left.length}개`:'오늘 일퀘를 다 했어요';
  if(sheetCtx&&sheetCtx.q63&&!$('sheet').hidden)qSheet63()}catch(e){console.error(e)}}
addEventListener('click',e=>{const p=e.target.closest('.hblock[data-hid="quests"] .panel.q63');if(!p||e.target.closest('.colbtn,.qbtn,[data-sheet]'))return;e.preventDefault();e.stopPropagation();lastPt={x:e.clientX,y:e.clientY};qSheet63()},true);
addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.closest&&e.target.closest('.q63row')){e.preventDefault();qSheet63()}});
closeSheet=(function(prev){return function(){if(sheetCtx&&sheetCtx.q63)sheetCtx=null;return prev.apply(this,arguments)}})(closeSheet);
function bossSay63(){try{const b=document.querySelector('#battleBox .boss2');if(!b||b.querySelector('.say62'))return;const nm=(b.querySelector('b')||{}).textContent||'';const d=document.createElement('div');d.className='say62';d.textContent='「'+bossLine62(nm,b.classList.contains('dead'))+'」';const t=b.querySelector('b');t&&t.after(d)}catch(e){}}

/* ---- 6) 캘린더: 월 보기는 PC도 화면 가득 · 날짜 누르면 그 아래에 그날 목록 ---- */
function calFill63(){return curView()==='cal'&&!splitOn()&&((C.ui.cal||{}).mode||'month')==='month'}
function cal62on(){return curView()==='cal'&&innerWidth<760&&!splitOn()}
function cal62tog(){const b=document.body;b.classList.toggle('cal62',cal62on());b.classList.toggle('calfill63',calFill63());b.classList.toggle('calview63',curView()==='cal'&&!splitOn())}
function calN62(){return document.body.classList.contains('calfill63')?14:3}
function cal62fit(){
  const g=$('calMain')&&$('calMain').querySelector('.mgrid');if(!g)return;
  if(!document.body.classList.contains('calfill63')){g.style.height='';g.style.gridTemplateRows='';return}
  const mcs=[...g.querySelectorAll('.mc')],rows=Math.ceil(mcs.length/7)||5,phone=innerWidth<760;
  const nav=document.querySelector('.bnav'),nh=nav&&getComputedStyle(nav).display!=='none'?nav.getBoundingClientRect().height:0;
  const H=Math.max(phone?360:480,Math.floor(innerHeight-g.getBoundingClientRect().top-nh-(phone?6:16)));
  const dp=g.querySelector('.dp63'),dw=dp?+dp.dataset.w:-1,tr=['auto'];
  for(let w=0;w<rows;w++){tr.push(dw<0||w===dw?'minmax(0,1fr)':'minmax(0,.7fr)');if(w===dw)tr.push(`minmax(${phone?240:240}px,${phone?5:3}fr)`)}
  g.style.height=H+'px';g.style.gridTemplateRows=tr.join(' ');
  mcs.forEach(mc=>{const cap=mc.clientHeight,chips=[...mc.querySelectorAll('.cchip')],mr=mc.querySelector('.more');if(mc.dataset.b62==null)mc.dataset.b62=mr?(parseInt(mr.textContent.replace(/\D/g,''))||0):0;let base=+mc.dataset.b62,hid=0;
    chips.forEach(c=>{c.hidden=false});chips.forEach(c=>{if(c.offsetTop+c.offsetHeight>cap-13){c.hidden=true;hid++}});
    if(hid||base){let m=mr;if(!m){m=document.createElement('span');m.className='more';mc.appendChild(m)}m.textContent='+'+(hid+base);m.title='눌러서 이 날 전체 보기'}else if(mr)mr.remove()})}
function dp63(){
  const g=$('calMain')&&$('calMain').querySelector('.mgrid'),cd=$('calDay');if(!g||!cd)return;
  g.querySelectorAll('.dp63').forEach(x=>x.remove());
  if(!document.body.classList.contains('calfill63')){cd.hidden=false;return}
  cd.hidden=true;if(!ui.cal63)return;
  const mcs=[...g.querySelectorAll('.mc')],i=mcs.findIndex(m=>m.dataset.calday===ui.calSel);if(i<0)return;
  const p=cd.querySelector('.dayp');if(!p)return;
  mcs[i].classList.add('open63');const w=Math.floor(i/7),after=mcs[Math.min(mcs.length-1,w*7+6)];
  const box=document.createElement('div');box.className='dp63';box.dataset.w=w;box.style.gridColumn='1/-1';
  const k=ui.calSel,pt=p.querySelector('.ptitle');
  if(pt)pt.insertAdjacentHTML('beforeend',`<span class="row dp63b" style="gap:4px"><button class="btn ghost sm" type="button" data-x58day="${k}">하루 보기 →</button><button class="x" type="button" data-dp63x="1" aria-label="닫기" title="닫기">×</button></span>`);
  box.appendChild(p);after.after(box)}
renderCal=(function(prev){return function(){cal62tog();const x=prev.apply(this,arguments);try{if(calShown()&&(C.ui.cal||{}).mode==='month')dp63();else if($('calDay'))$('calDay').hidden=false;
  if(document.body.classList.contains('calfill63')&&!document.body.classList.contains('cal62')){const m=monthKey(ui.calAnchor),[y,mo]=m.split('-').map(Number);$('calTitle').textContent=(y===+dateKey().slice(0,4)?'':y+'년 ')+mo+'월'}
  cal63add();requestAnimationFrame(cal62fit)}catch(e){console.error(e)}return x}})(renderCal);
// 날짜 한 번 = 그 아래 목록 펼치기/접기 · 빨리 두 번 = 하루 보기 (할 일 추가는 목록 안 입력칸과 ＋ 버튼)
var MC63=null;
addEventListener('click',e=>{
  const c=e.target.closest('#calMain .mc[data-calday]');if(!c)return;const more=e.target.closest('.more');if(!more&&e.target.closest('[data-ctask],button,a,input'))return;
  e.preventDefault();e.stopImmediatePropagation();const k=c.dataset.calday,now=Date.now();
  if(more){MC63=null;ui.calSel=k;ui.cal63=true;ui.calKeepScroll=true;renderCal();return}
  if(MC63&&MC63.k===k&&now-MC63.t<320){MC63=null;ui.cal63=false;calGoDay(k);return}
  MC63={k,t:now};
  if(ui.cal63&&ui.calSel===k)ui.cal63=false;else{ui.calSel=k;ui.cal63=true}
  ui.calKeepScroll=true;renderCal();
  if(ui.cal63)requestAnimationFrame(()=>{const b=document.querySelector('#calMain .dp63');if(b&&!document.body.classList.contains('calfill63'))b.scrollIntoView({block:'nearest'})})},true);
addEventListener('click',e=>{const b=e.target.closest('[data-dp63x]');if(!b)return;e.preventDefault();e.stopPropagation();ui.cal63=false;renderCal()},true);
addEventListener('keydown',e=>{if(e.key==='Escape'&&ui.cal63&&curView()==='cal'&&$('sheet').hidden){ui.cal63=false;renderCal()}});
// ＋ 할 일 추가: 폰은 오른쪽 아래 둥근 버튼, PC는 도구줄
function cal63add(){
  const bar=document.querySelector('#calPane .calbar2');if(bar&&!$('cal63add')){const b=document.createElement('button');b.id='cal63add';b.type='button';b.className='btn sm';b.textContent='＋ 할 일';b.title='할 일 추가 (고른 날짜에)';const ref=$('calModes');ref?ref.before(b):bar.appendChild(b)}
  if(!$('cal63fab')){const f=document.createElement('button');f.id='cal63fab';f.type='button';f.className='fab63';f.setAttribute('aria-label','할 일 추가');f.title='할 일 추가';f.textContent='＋';document.body.appendChild(f)}}
addEventListener('click',e=>{const b=e.target.closest('#cal63add,#cal63fab');if(!b)return;e.preventDefault();e.stopPropagation();lastPt={x:e.clientX,y:e.clientY};calAddDay(ui.cal63&&ui.calSel?ui.calSel:(ui.calSel||dateKey()))},true);

/* ---- 7) 렌더 뒤처리 ---- */
render=(function(prev){return function(){
  try{if(C.mig62&&tasksReady)wSync63()}catch(e){console.error(e)}
  const x=prev.apply(this,arguments);
  try{cal62tog();qHome63();bossSay63()}catch(e){console.error(e)}
  return x}})(render);
renderBattle=(function(prev){return function(){const x=prev.apply(this,arguments);bossSay63();return x}})(renderBattle);
addEventListener('hashchange',()=>setTimeout(()=>{try{cal62tog()}catch(e){}},0));
