/* v13.15 (w141): 11/26 써 보고 요청 묶음
   ① 기록하기 → 행동/습관: 🔍 카드 찾기(제목줄 🔍 → 찾기 줄) — 칠 때 '좋은' 거르기·접힌 영역과 상관없이 전체에서 찾음 · 끝낸 '한 번' 카드도 함께(↩ 반복 카드로 되살리기)
   ② 영역마다 끝에 `＋ 새 카드` 타일 → 그 자리에서 이름·좋은/나쁜·반복/한 번만 고르고 추가(맨 아래까지 안 내려가도 됨)
   ③ '그냥 한 일'(홈 오늘 ✓ · 빠른 기록)은 카드를 안 만듦 → 알림에 `🃏 카드로 만들기` (옛 '한 번' 카드는 doneAt이 있으면 목록에서 빠져 있음 → ①의 찾기 줄에서 되살림)
   ④ 주 N회 칩을 날짜에 놓은 뒤 '오늘은 건너뛰기' → 오늘 자리(t.sl91[오늘])를 빼서 캘린더에서 사라짐(되돌리기 있음)
   ⑤ 🛏 어젯밤 창 저장 → '7시간 이상 잤다'(오늘, 일어난 시각) · '늦게 잠'(어제, 잠든 시각의 세부 옵션)을 자동 기록/고침/지움(e.sl141 표시 — 직접 적은 기록은 안 건드림)
   ⑥ 홈 `🍽 식사 · 자주 쓰는 것` 칸: 식사 항목(± / 체크)과 기록하기에서 📌 고정한 행동을 홈에서 바로 기록(C.pin133 그대로) */
(function(){
const NORM141=s=>String(s||'').toLowerCase().replace(/\s+/g,'');
const aq=()=>String(ui.aq141||'').trim();

/* ---------- ① 찾기 ---------- */
renderLog=(function(prev){return function(){
  const q=aq();let ov=null;
  if(q){ov={f:C.ui.list.filter,c:C.ui.collapsed};C.ui.list.filter='all';C.ui.collapsed={}}   // 찾는 동안만 전체·펼침으로 그림(저장 안 됨)
  let r;try{r=prev.apply(this,arguments)}finally{if(ov){C.ui.list.filter=ov.f;C.ui.collapsed=ov.c}}
  try{log141()}catch(e){console.error(e)}
  return r}})(renderLog);

function panel141(){const g=$('actGroups');return g&&g.closest('.panel')}
function ensureUi141(){
  const P=panel141();if(!P)return;
  const tt=P.querySelector('.ptitle');
  if(tt&&!tt.querySelector('#aqb141')){
    const b=document.createElement('button');b.type='button';b.id='aqb141';b.className='chipbtn aqb141';b.textContent='🔍';b.title='행동/습관 카드 찾기';b.setAttribute('aria-label','카드 찾기');
    const a=tt.querySelector('a[data-goedit]');if(a)a.before(b);else tt.appendChild(b)}
  if(!$('aq141')){
    const row=document.createElement('div');row.id='aq141';row.className='aq141';row.hidden=true;
    row.innerHTML='<input id="aq141i" type="search" placeholder="🔍 카드 찾기 (이름·영역·점수)" autocomplete="off" enterkeyhint="search" aria-label="행동 습관 카드 찾기"><span class="tiny muted" id="aq141n"></span><button type="button" class="chipbtn" id="aq141x" aria-label="찾기 닫기">닫기</button>';
    const tl=$('actTools');tl.parentNode.insertBefore(row,tl)}
  if(!$('aq141d')){const d=document.createElement('div');d.id='aq141d';d.className='aq141d';d.hidden=true;const g=$('actGroups');g.parentNode.insertBefore(d,g.nextSibling)}
}
function log141(){
  ensureUi141();
  const row=$('aq141'),inp=$('aq141i'),open=!!ui.aq141open||!!aq();
  if(!row)return;
  row.hidden=!open;
  const b=$('aqb141');if(b)b.setAttribute('aria-pressed',String(open));
  if(inp&&document.activeElement!==inp&&inp.value!==(ui.aq141||''))inp.value=ui.aq141||'';
  const G=$('actGroups'),q=NORM141(aq()),toks=aq().split(/\s+/).filter(Boolean).map(NORM141);
  // 찾기 적용: 안 맞는 줄·빈 묶음 숨김
  let shown=0,total=0;
  if(toks.length){
    const heads=new Map();G.querySelectorAll('.ghead').forEach(h=>{const n=h.nextElementSibling;if(n&&n.classList.contains('acts'))heads.set(n,NORM141(h.textContent))});
    G.querySelectorAll('.act[data-info^="act:"]').forEach(r=>{total++;
      const ac=r.closest('.acts'),gt=(ac&&heads.get(ac))||'',txt=NORM141(r.textContent)+gt;
      const ok=toks.every(t=>txt.includes(t));r.hidden=!ok;if(ok)shown++;else r.style.display='none'});
    const hideIf=(el,sel)=>{if(!el.querySelector(sel+':not([hidden])')){el.hidden=true;el.style.display='none'}};
    G.querySelectorAll('.acts').forEach(a=>{hideIf(a,'.act[data-info^="act:"]');const h=a.previousElementSibling;if(h&&h.classList.contains('ghead')&&a.hidden){h.hidden=true;h.style.display='none'}});
    G.querySelectorAll('.ghead').forEach(h=>{const n=h.nextElementSibling;if(!n||!n.classList.contains('acts')){if(!h.closest('.now96w')){h.hidden=true;h.style.display='none'}}});
    G.querySelectorAll('.now96w,.pin133').forEach(w=>hideIf(w,'.act[data-info^="act:"]'));
    G.querySelectorAll('.now96w').forEach(w=>{if(w.hidden)w.style.display='none'});
  }
  const nEl=$('aq141n');if(nEl)nEl.textContent=toks.length?`${shown}개 찾음`:'';
  // 끝낸 '한 번' 카드(목록에서 빠진 것): 찾기 줄이 열려 있을 때만
  const D=$('aq141d');
  if(D){const done=open?C.actions.filter(a=>a.once&&a.doneAt&&(!toks.length||toks.every(t=>NORM141(a.name+' '+((C.areas.find(z=>z.id===a.area)||{}).name||'')).includes(t)))):[];
    D.hidden=!done.length;
    D.innerHTML=done.length?`<div class="tiny muted">✓ 끝낸 '한 번' 카드 ${done.length}개 — 한 번 기록하면 목록에서 빠지는 카드예요. 누르면 반복 카드로 되살려요.</div><div class="aq141c">${done.slice(0,30).map(a=>`<button type="button" class="chipbtn" data-rev141="${esc(a.id)}">↩ ${esc(a.name)} <small class="muted">${esc(a.doneAt)}</small></button>`).join('')}</div>`:''}
  // ② 영역마다 ＋ 새 카드
  G.querySelectorAll('.add141').forEach(x=>x.remove());
  if(!toks.length&&(C.ui.list||{}).group==='area'){
    G.querySelectorAll('.ghead[data-gcollapse^="a:"]').forEach(h=>{const ac=h.nextElementSibling;if(!ac||!ac.classList.contains('acts'))return;
      const id=h.dataset.gcollapse.slice(2);
      if(ui.add141===id){
        const f=document.createElement('form');f.className='add141 add141f';f.dataset.area=id;
        const bad=(C.ui.list||{}).filter==='bad';
        f.innerHTML=`<input maxlength="40" placeholder="새 카드 이름" value="${esc(ui.add141v||'')}" autocomplete="off" enterkeyhint="done" aria-label="새 카드 이름"><select aria-label="좋은 나쁜"><option value="good"${bad?'':' selected'}>▲ 좋은</option><option value="bad"${bad?' selected':''}>▼ 나쁜</option></select><select aria-label="반복 한 번"><option value="">반복</option><option value="1">한 번</option></select><button type="submit" class="btn sm">추가</button><button type="button" class="chipbtn" data-x141="1" aria-label="닫기">×</button>`;
        ac.appendChild(f)}
      else{const t=document.createElement('button');t.type='button';t.className='add141 add141t';t.dataset.add141=id;t.setAttribute('aria-label',(h.textContent||'').trim().replace(/\s+\d+$/,'')+' 영역에 새 카드 추가');t.textContent='＋ 새 카드';ac.appendChild(t)}})}
}
addEventListener('click',e=>{const T=e.target;if(!T||!T.closest)return;let b;
  if((b=T.closest('#aqb141'))){e.preventDefault();e.stopPropagation();ui.aq141open=!(ui.aq141open||aq());if(!ui.aq141open)ui.aq141='';renderLog();if(ui.aq141open){const i=$('aq141i');i&&i.focus()}return}
  if((b=T.closest('#aq141x'))){e.preventDefault();e.stopPropagation();ui.aq141open=false;ui.aq141='';renderLog();return}
  if((b=T.closest('[data-rev141]'))){e.preventDefault();e.stopPropagation();const a=C.actions.find(x=>x.id===b.dataset.rev141);if(!a)return;delete a.once;delete a.doneAt;save('config');render();toast(`↩ '${a.name}' 카드를 반복 카드로 되살렸어요`);return}
  if((b=T.closest('[data-add141]'))){e.preventDefault();e.stopPropagation();ui.add141=b.dataset.add141;ui.add141v='';renderLog();const i=document.querySelector('.add141f input');i&&i.focus();return}
  if((b=T.closest('[data-x141]'))){e.preventDefault();e.stopPropagation();ui.add141=null;ui.add141v='';renderLog();return}
},true);
addEventListener('submit',e=>{const f=e.target&&e.target.closest&&e.target.closest('form.add141f');if(!f)return;e.preventDefault();e.stopPropagation();
  if(!ready)return;
  const inp=f.querySelector('input'),sel=f.querySelectorAll('select'),name=inp.value.trim();
  if(!name){inp.focus();toast('카드 이름을 먼저 적어주세요');return}
  const id=f.dataset.area,type=sel[0].value,once=sel[1].value;
  const a=newAction(uid(),name,type,id,once);
  let at=-1;C.actions.forEach((x,i)=>{if(x.area===id&&x.type===type)at=i});if(at<0)C.actions.forEach((x,i)=>{if(x.area===id)at=i});
  if(at>=0)C.actions.splice(at+1,0,a);else C.actions.push(a);
  ui.add141=null;ui.add141v='';save('config');render();
  toast(`'${name}' 추가했어요${once?' (한 번)':''}. 이름을 누르면 점수를 바꿔요`)},true);
addEventListener('input',e=>{const t=e.target;if(!t)return;
  if(t.id==='aq141i'){if(e.isComposing||t===CMP141)return;ui.aq141=t.value;aqRun141()}
  else if(t.closest&&t.closest('form.add141f')&&t.tagName==='INPUT'){ui.add141v=t.value}},true);
let CMP141=null;
addEventListener('compositionstart',e=>{if(e.target&&e.target.id==='aq141i')CMP141=e.target},true);
addEventListener('compositionend',e=>{const t=e.target;if(t&&t.id==='aq141i'){CMP141=null;ui.aq141=t.value;aqRun141()}},true);
addEventListener('keydown',e=>{const t=e.target;if(t&&t.id==='aq141i'&&e.key==='Escape'){ui.aq141open=false;ui.aq141='';renderLog()}},true);
let AQT=0;
function aqRun141(){clearTimeout(AQT);AQT=setTimeout(()=>{const i=$('aq141i'),pos=i?i.selectionStart:0;renderLog();const j=$('aq141i');if(j&&document.activeElement!==j){j.focus();try{j.setSelectionRange(pos,pos)}catch(x){}}},120)}

/* ---------- ③ 그냥 한 일 → 카드로 만들기 · '한 번' 카드 안내 ---------- */
function makeCard141(name,size,area){
  const sz=(typeof FREE_SIZES!=='undefined'&&FREE_SIZES.find(x=>x[0]===size))||['m','보통 일',10];
  const a=newAction(uid(),name,'good',area||C.areas[0].id,'');a.xp=sz[2];a.cond=Math.round(sz[2]/3);a.gold=Math.round(sz[2]/4);
  C.actions.push(a);save('config');render();toast(`🃏 '${name}' 카드가 생겼어요 · 기록하기 → 행동/습관에서 찾아요`)}
if(typeof doFree==='function'){doFree=(function(prev){return function(name,size,area){const r=prev.apply(this,arguments);
  try{if(name&&!C.actions.some(a=>a.name===name&&!a.doneAt))setTimeout(()=>toastAct(`'${name}' 그냥 한 일로 기록했어요 (카드는 안 만들어져요)`,'🃏 카드로 만들기',()=>makeCard141(name,size,area),8000),80)}catch(e){console.error(e)}return r}})(doFree)}

/* ---------- ④ 주 N회 칩 '오늘은 건너뛰기' ---------- */
skipToday61=(function(prev){return function(t){
  try{const k=midKey68();
    if(t&&typeof wx91==='function'&&wx91(t)&&t.sl91&&t.sl91[k]!==undefined){
      const had=t.sl91[k],hl=t.sd119&&t.sd119[k],oldSkip=(t.skip61||[]).slice();
      delete t.sl91[k];if(t.sd119)delete t.sd119[k];if(!Object.keys(t.sl91).length)delete t.sl91;
      t.skip61=[...new Set([...(t.skip61||[]).filter(d=>d>=addDays(k,-14)),k])];delete t.skull;
      saveTask(t);syncDailies(C);save('config');render();
      toastAct(`'${t.title}' 오늘 자리를 뺐어요 (☠ 없이 · 이번 주 다른 날에 해요)`,'되돌리기',()=>{t.sl91=t.sl91||{};t.sl91[k]=had;if(hl){t.sd119=t.sd119||{};t.sd119[k]=hl}if(oldSkip.length)t.skip61=oldSkip;else delete t.skip61;saveTask(t);syncDailies(C);save('config');render()});
      return}}catch(e){console.error(e)}
  return prev.apply(this,arguments)}})(skipToday61);

/* ---------- ⑤ 🛏 어젯밤 창 → 7시간 이상 잤다 · 늦게 잠 자동 ---------- */
function hh141(s){const m=/^(\d{1,2}):(\d{2})$/.exec(String(s||''));return m?(+m[1])+(+m[2])/60:null}
function lateOpt141(card,b){
  const h=hh141(b);if(h==null||h>=9||!card||!Array.isArray(card.opts)||!card.opts.length)return null;   // 자정 전·아침 잠은 '늦게 잠' 아님
  const i=h<1?0:h<2?1:h<3?2:h<4?3:4;
  if(card.opts.length===5)return card.opts[i].id;
  const byId=card.opts.find(o=>o.id==='s'+i);return byId?byId.id:null}
function log141a(day,a,o,key){
  const y=dayOf(day),seen=new Set((y.entries||[]).map(e=>e.id));
  try{withDay69(day,()=>doAction(a,{direct:true,at:o.at||null,vid:o.vid||undefined,note:o.note||''}))}catch(e){console.error(e);return false}
  const es=((DAYS[day]||{}).entries||[]).filter(x=>!seen.has(x.id));   // 기록은 시각순으로 끼어들 수 있어 '새로 생긴 것'을 id로 찾음
  const e=es.find(x=>x.kind==='act'&&x.aid===a.id)||es.find(x=>x.aid===a.id);
  if(e){e.sl141=key;save(day);return true}
  return false}
function sleepSync141(k){
  try{
    if(!k||!C||typeof ready72==='function'&&!ready72())return;
    const d=DAYS[k],s=d&&d.sl102,yk=addDays(k,-1);
    const m=s&&s.b&&s.w?slMin102(s):null;
    // 7시간 이상 잤다 — 일어난 날(k) 기록, 시각은 일어난 시각
    const c7=C.actions.find(a=>a.type==='good'&&/7\s*시간\s*이상/.test(a.name||'')&&!a.doneAt);
    if(c7){const es=dayOf(k).entries||[],mine=es.filter(e=>e.aid===c7.id&&e.sl141==='h7'),any=es.some(e=>e.aid===c7.id);
      const want=!!(m&&m>=420);
      if(want&&!any)log141a(k,c7,{at:s.w,note:`🛏 어젯밤 창: ${Math.floor(m/60)}시간 ${m%60}분 잠`},'h7');
      else if(!want)mine.forEach(e=>{try{removeEntry(k,e.id)}catch(x){console.error(x)}})}
    // 늦게 잠 — 어제(yk) 기록, 잠든 시각에 맞는 세부 옵션
    const cl=typeof sleepCard73==='function'?sleepCard73():null;
    if(cl){const es=dayOf(yk).entries||[],mine=es.filter(e=>e.aid===cl.id&&e.sl141==='late'),other=es.some(e=>e.aid===cl.id&&e.sl141!=='late');
      const opt=s&&s.b?lateOpt141(cl,s.b):null;
      if(opt&&!other){if(!(mine.length===1&&mine[0].vid===opt)){mine.forEach(e=>{try{removeEntry(yk,e.id)}catch(x){console.error(x)}});log141a(yk,cl,{at:s.b,vid:opt,note:'🛏 어젯밤 창: 잠든 시각으로 자동'},'late')}}
      else if(!opt)mine.forEach(e=>{try{removeEntry(yk,e.id)}catch(x){console.error(x)}})}
    render();
  }catch(e){console.error(e)}}
addEventListener('click',e=>{const T=e.target;if(!T||!T.closest)return;
  if(T.closest('[data-sl102ok],[data-sl102del]')&&typeof SL102!=='undefined'&&SL102.k){const k=SL102.k;setTimeout(()=>sleepSync141(k),90)}},true);
window.sleepSync141=sleepSync141;

/* ---------- ⑥ 홈 🍽 식사 · 자주 쓰는 것 ---------- */
HOME_BLOCKS.meal141='🍽 식사 · 자주 쓰는 것';
function fill141(){
  const box=$('meal141');if(!box)return;
  const day=today(),F=C.food||[],pins=(Array.isArray(C.pin133)?C.pin133:[]).map(id=>C.actions.find(a=>a.id===id&&!a.doneAt)).filter(Boolean);
  const meals=F.map(f=>{const v=+((day.food||{})[f.id]||0),neg=f.points<0;
    if(f.kind==='check')return `<label class="m141r m141c"><input type="checkbox" data-foodcheck="${esc(f.id)}" ${v?'checked':''}> <span class="m141n">${esc(f.name)}</span></label>`;
    return `<div class="m141r"><span class="m141n">${esc(f.name)}</span><span class="stepper"><button type="button" data-food="${esc(f.id)}" data-d="-1" aria-label="${esc(f.name)} 줄이기">−</button><span class="v num${neg&&v?' neg':''}">${v}</span><button type="button" data-food="${esc(f.id)}" data-d="1" aria-label="${esc(f.name)} 늘리기">+</button></span></div>`}).join('');
  const chips=pins.map(a=>{const n=(day.entries||[]).filter(e=>e.kind==='act'&&e.aid===a.id).length;
    return `<button type="button" class="chipbtn p141${n?' on':''}" data-p141="${esc(a.id)}" aria-label="${esc(a.name)} 했어요 기록${n?' · 오늘 '+n+'번':''}">${n?'✓':'○'} ${esc(a.name)}${n>1?' ×'+n:''}</button>`}).join('');
  box.innerHTML=`<div class="m141m">${meals||'<div class="tiny muted">식사 항목이 없어요 (편집 → 식사)</div>'}</div>`
    +(chips?`<div class="m141p"><span class="tiny muted">📌 자주 쓰는 것</span>${chips}</div>`:`<div class="tiny muted m141h">📌 기록하기 → 행동/습관에서 행동 이름을 눌러 고정하면 여기서 바로 기록해요.</div>`)}
renderHome=(function(prev){return function(){const r=prev.apply(this,arguments);try{fill141()}catch(e){console.error(e)}return r}})(renderHome);
addEventListener('click',e=>{const T=e.target;if(!T||!T.closest)return;const b=T.closest('#meal141 [data-p141]');
  if(!b){if(T.closest('#meal141 [data-food],#meal141 [data-foodcheck]'))ui.off=0;return}
  e.preventDefault();e.stopPropagation();if(!ready)return;ui.off=0;const a=C.actions.find(x=>x.id===b.dataset.p141);if(a)doAction(a)},true);
addEventListener('change',e=>{if(e.target&&e.target.closest&&e.target.closest('#meal141'))ui.off=0},true);
// 처음 한 번: '오늘' 칸 바로 밑에 켜 둠 (그 뒤 홈 배치에서 끄거나 옮기면 그대로)
render=(function(prev){return function(){
  try{if(ready&&!C.mig141h&&Array.isArray(C.ui.home)){C.mig141h=1;
    if(!C.ui.home.some(h=>h[0]==='meal141')){const i=C.ui.home.findIndex(h=>h[0]==='today'),at=i>=0?i+1:C.ui.home.length,col=(C.ui.home[i]||[])[2];
      C.ui.home.splice(at,0,col?['meal141',1,col]:['meal141',1])}
    save('config')}}catch(e){console.error(e)}
  return prev.apply(this,arguments)}})(render);
})();
