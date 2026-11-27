/* v13.15 (w141): 11/26 써 보고 요청 묶음
   ① 기록하기 → 행동/습관: 제목 바로 아래 🔍 찾기 줄(늘 보임) — 칠 때 '좋은' 거르기·접힌 영역과 상관없이 전체에서 찾음 · 끝낸 '한 번' 카드도 함께(↩ 반복 카드로 되살리기)
   ② 영역마다 끝에 기존 `＋ 할 일·행동 추가 | 반복(습관)/한 번 | 추가` 입력 줄(영역은 그 영역으로 정해짐 — 맨 아래까지 안 내려가도 됨). 영역별로 묶어 볼 때 맨 아래 공용 줄은 숨김
   ③ '그냥 한 일'(홈 오늘 ✓ · 빠른 기록)은 카드를 안 만듦 → 알림에 `🃏 카드로 만들기` (옛 '한 번' 카드는 doneAt이 있으면 목록에서 빠져 있음 → ①의 찾기 줄에서 되살림)
   ④ 주 N회 칩을 날짜에 놓은 뒤 '오늘은 건너뛰기' → 오늘 자리(t.sl91[오늘])를 빼서 캘린더에서 사라짐(되돌리기 있음)
   ⑤ 🛏 어젯밤 창 저장 → '8시간 이상 잤다'(옛 '7시간 이상 잤다' 이름·옵션 바꿈: 6시간 미만 0점 · 6~7 35% · 7~8 70% · 8+ 100%)(오늘, 일어난 시각) · '늦게 잠'(어제, 잠든 시각의 세부 옵션)을 자동 기록/고침/지움(e.sl141 표시 — 직접 적은 기록은 안 건드림)
   ⑥ 홈 `🍽 식사 · 몸무게` 칸(식사 ± / 체크 + 몸무게 kg 기록 — 기존 #wForm 저장을 그대로 씀) · 따로 `📌 자주 쓰는 것` 칸(기록하기에서 📌 고정한 행동, C.pin133) */
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
  if(!$('aq141')){
    const row=document.createElement('div');row.id='aq141';row.className='aq141';
    row.innerHTML='<input id="aq141i" type="search" placeholder="🔍 카드 찾기 (이름·영역)" autocomplete="off" enterkeyhint="search" aria-label="행동 습관 카드 찾기"><span class="tiny muted" id="aq141n"></span><button type="button" class="chipbtn" id="aq141x" aria-label="찾기 지우기" hidden>지우기</button>';
    if(tt)tt.after(row);else P.prepend(row)}
  if(!$('aq141d')){const d=document.createElement('div');d.id='aq141d';d.className='aq141d';d.hidden=true;const g=$('actGroups');g.parentNode.insertBefore(d,g.nextSibling)}
}
function braveMini141(){   // 용기 칸 '목록에 없는 용기' 입력을 더 단출하게: 제목 줄 없앰 · 칩 글자 줄임 · 입력 한 줄
  const sz=$('braveSizes');if(!sz)return;
  sz.querySelectorAll('[data-bsize]').forEach(b=>{const t=b.textContent.replace(' · XP +',' +');if(b.textContent!==t)b.textContent=t});
  const n=$('braveNote');if(n&&!n.dataset.m141){n.dataset.m141=1;n.placeholder='목록에 없는 용기 · 한 줄 적고 크기 고르기';n.setAttribute('aria-label','목록에 없는 용기 기록');
    const f=$('braveForm');if(f){const bt=f.querySelector('button');if(bt)bt.classList.add('sm');const w=f.parentNode;if(w)w.classList.add('bmini141')}}}
function log141(){
  try{braveMini141()}catch(e){console.error(e)}
  ensureUi141();
  const row=$('aq141'),inp=$('aq141i'),open=!!aq();
  if(!row)return;
  const xb=$('aq141x');if(xb)xb.hidden=!open;
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
  // ② 영역마다 입력 줄 (영역별로 묶어 볼 때는 맨 아래 공용 줄을 숨김)
  {const gf=document.querySelector('form[data-addform="act"]');if(gf)gf.style.display=(C.ui.list||{}).group==='area'&&!toks.length?'none':''}
  G.querySelectorAll('.add141').forEach(x=>x.remove());
  if(!toks.length&&(C.ui.list||{}).group==='area'){
    G.querySelectorAll('.ghead[data-gcollapse^="a:"]').forEach(h=>{const ac=h.nextElementSibling;if(!ac||!ac.classList.contains('acts'))return;
      const id=h.dataset.gcollapse.slice(2);
      const f=document.createElement('form');f.className='addrow add141 add141f';f.dataset.area=id;
      const nm=esc((h.textContent||'').trim().replace(/\s+\d+$/,''));
      f.innerHTML=`<button type="submit" class="plus" aria-label="${nm} 영역에 추가">＋</button><input maxlength="40" placeholder="할 일·행동 추가" autocomplete="off" enterkeyhint="done" aria-label="${nm} 영역에 추가" value="${esc((ui.add141||{})[id]||'')}"><select aria-label="반복 한 번"><option value="">반복 (습관)</option><option value="1">한 번 → 할 일</option></select><button type="submit" class="btn sm ghost">추가</button>`;
      ac.appendChild(f)})}
}
addEventListener('click',e=>{const T=e.target;if(!T||!T.closest)return;let b;
  if((b=T.closest('#aq141x'))){e.preventDefault();e.stopPropagation();ui.aq141='';renderLog();const i=$('aq141i');i&&i.focus();return}
  if((b=T.closest('[data-rev141]'))){e.preventDefault();e.stopPropagation();const a=C.actions.find(x=>x.id===b.dataset.rev141);if(!a)return;delete a.once;delete a.doneAt;save('config');render();toast(`↩ '${a.name}' 카드를 반복 카드로 되살렸어요`);return}
},true);
addEventListener('submit',e=>{const f=e.target&&e.target.closest&&e.target.closest('form.add141f');if(!f)return;e.preventDefault();e.stopPropagation();
  if(!ready)return;
  const inp=f.querySelector('input'),once=f.querySelector('select').value,name=inp.value.trim();
  if(!name){inp.focus();toast('이름을 먼저 적어주세요');return}
  const id=f.dataset.area;
  if(once){addTaskFrom(name,{due:dateKey()});inp.value='';inp.blur();return}   // 기존 입력 줄과 똑같이: '한 번'은 할 일로
  const type=(C.ui.list||{}).filter==='bad'?'bad':'good';
  const a=newAction(uid(),name,type,id,'');
  let at=-1;C.actions.forEach((x,i)=>{if(x.area===id&&x.type===type)at=i});if(at<0)C.actions.forEach((x,i)=>{if(x.area===id)at=i});
  if(at>=0)C.actions.splice(at+1,0,a);else C.actions.push(a);
  if(ui.add141)delete ui.add141[id];save('config');render();
  toast(`'${name}' 추가했어요. 이름을 누르면 점수를 바꿔요`)},true);
addEventListener('input',e=>{const t=e.target;if(!t)return;
  if(t.id==='aq141i'){if(e.isComposing||t===CMP141)return;ui.aq141=t.value;aqRun141()}
  else if(t.closest&&t.closest('form.add141f')&&t.tagName==='INPUT'){const f=t.closest('form');(ui.add141=ui.add141||{})[f.dataset.area]=t.value}},true);
let CMP141=null;
addEventListener('compositionstart',e=>{if(e.target&&e.target.id==='aq141i')CMP141=e.target},true);
addEventListener('compositionend',e=>{const t=e.target;if(t&&t.id==='aq141i'){CMP141=null;ui.aq141=t.value;aqRun141()}},true);
addEventListener('keydown',e=>{const t=e.target;if(t&&t.id==='aq141i'&&e.key==='Escape'){ui.aq141='';renderLog()}},true);
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
/* 수면 시간: 좋음/중립 = '8시간 이상 잤다' 카드(옵션 6~7 중립 · 7~8 좋음 · 8+ 최고) · 나쁨 = '6시간 미만 잤다' 나쁜 카드(옵션 5~6 · 4~5 · 4시간 미만, 컨디션 ↓) — 사용자 11/26 요청 */
const SLEEPG141=[['h1','6~7시간',.35],['h2','7~8시간',.7],['h3','8시간 이상',1]];
const SLEEPB141=[['b0','5~6시간',8],['b1','4~5시간',14],['b2','4시간 미만',20]];
function sleepGood141(){return (C.actions||[]).find(a=>a.type==='good'&&!a.doneAt&&(a.sl141g||/[78]\s*시간\s*이상\s*잤/.test(a.name||'')))||null}
function sleepBad141(){return (C.actions||[]).find(a=>a.type==='bad'&&!a.doneAt&&a.sl141b)||null}
function migSleepGood141(){
  if(!ready)return;let ch=false;
  if(!C.mig141s){C.mig141s=1;ch=true;
    const a=sleepGood141();
    if(a){C.bak141sleepg=JSON.parse(JSON.stringify(a));
      if(/^7\s*시간\s*이상\s*잤다$/.test((a.name||'').trim()))a.name='8시간 이상 잤다';
      if(!(a.opts||[]).length){const c=+a.cond||0,g=+a.gold||0,x=+a.xp||0;
        a.opts=SLEEPG141.map(([id,nm,r])=>({id,name:nm,cond:Math.round(c*r),gold:Math.round(g*r),xp:Math.round(x*r)}))}
      a.sl141g=1;if(!a.desc)a.desc='잔 시간으로 골라요. 어젯밤 창에 자고 일어난 시각을 적으면 자동으로 들어가요. 8시간 이상이 최고점이에요.'}}
  if(!C.mig141t){C.mig141t=1;ch=true;
    const a=sleepGood141();if(a&&(a.opts||[]).some(o=>o.id==='h0'))a.opts=a.opts.filter(o=>o.id!=='h0');   // 6시간 미만은 이제 나쁜 카드로
    if(!sleepBad141()){const n=newAction(uid(),'6시간 미만 잤다','bad',(a&&a.area)||'body','');
      n.cond=8;n.gold=0;n.xp=0;n.sl141b=1;n.opts=SLEEPB141.map(([id,nm,c])=>({id,name:nm,cond:c,gold:0}));
      n.desc='잔 시간으로 골라요. 어젯밤 창에 자고 일어난 시각을 적으면 6시간 미만일 때 자동으로 들어가요.';
      C.actions.push(n)}}
  if(ch)save('config')}
function hOpt141(c,m){
  if(m<360)return null;   // 6시간 미만 → 좋은 카드엔 기록 안 함(나쁜 카드로)
  const id=m<420?'h1':m<480?'h2':'h3';
  if((c.opts||[]).some(o=>o.id===id))return id;
  return m>=420?'':null}   // 옵션이 없는 옛 카드: 7시간 넘으면 그냥 기록
function bOpt141(c,m){if(m>=360)return null;const id=m<240?'b2':m<300?'b1':'b0';return (c.opts||[]).some(o=>o.id===id)?id:''}
const verdict141=m=>m<360?'나쁨':m<420?'중립':'좋음';
function sleepSync141(k){
  try{
    if(!k||!C||typeof ready72==='function'&&!ready72())return;
    const d=DAYS[k],s=d&&d.sl102,yk=addDays(k,-1);
    const m=s&&s.b&&s.w?slMin102(s):null;
    // 8시간 이상 잤다(옛 이름 '7시간 이상 잤다') — 일어난 날(k) 기록, 시각은 일어난 시각, 잔 시간으로 세부 옵션
    const c7=sleepGood141();
    if(c7){const es=dayOf(k).entries||[],mine=es.filter(e=>e.aid===c7.id&&e.sl141==='h7'),other=es.some(e=>e.aid===c7.id&&e.sl141!=='h7');
      const vid=m?hOpt141(c7,m):null;
      if(vid!==null&&!other){if(!(mine.length===1&&(mine[0].vid||'')===vid)){mine.forEach(e=>{try{removeEntry(k,e.id)}catch(x){console.error(x)}});
        log141a(k,c7,{at:s.w,vid:vid||undefined,note:`🛏 어젯밤 창: ${Math.floor(m/60)}시간 ${m%60}분 잠 · ${verdict141(m)}`},'h7')}}
      else if(vid===null)mine.forEach(e=>{try{removeEntry(k,e.id)}catch(x){console.error(x)}})}
    // 6시간 미만 잤다(나쁨) — 일어난 날(k), 컨디션이 내려감
    const cb=sleepBad141();
    if(cb){const es=dayOf(k).entries||[],mine=es.filter(e=>e.aid===cb.id&&e.sl141==='h6'),other=es.some(e=>e.aid===cb.id&&e.sl141!=='h6');
      const vid=m?bOpt141(cb,m):null;
      if(vid!==null&&!other){if(!(mine.length===1&&(mine[0].vid||'')===vid)){mine.forEach(e=>{try{removeEntry(k,e.id)}catch(x){console.error(x)}});
        log141a(k,cb,{at:s.w,vid:vid||undefined,note:`🛏 어젯밤 창: ${Math.floor(m/60)}시간 ${m%60}분 잠 · ${verdict141(m)}`},'h6')}}
      else if(vid===null)mine.forEach(e=>{try{removeEntry(k,e.id)}catch(x){console.error(x)}})}
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
HOME_BLOCKS.meal141='🍽 식사 · 몸무게';HOME_BLOCKS.pin141='📌 빠른 기록';
function foodHtml141(day){
  return (C.food||[]).map(f=>{const v=+((day.food||{})[f.id]||0),ar=C.areas.find(a=>a.id===f.area),neg=f.points<0;
    const eff=`<span class="tiny muted">${esc(ar?ar.name:'')} ${neg?'−':'+'}${Math.abs(f.points)}${f.kind==='counter'?' / 회':''}${!neg&&f.kind==='counter'&&f.max?` (최대 ${f.max}회)`:''}</span>`;
    const fh=`<span class="hand fh" data-drag="row:${f.id}" data-dragmode="now" aria-label="끌어서 순서 바꾸기">⋮⋮</span>`;
    if(f.kind==='check')return `<div class="frow" data-rowid="${f.id}">${fh}<label class="togglebox"><input type="checkbox" data-foodcheck="${f.id}" ${v?'checked':''}> <span><b>${esc(f.name)}</b><br>${eff}</span></label></div>`;
    const dots=Array.from({length:Math.max(neg?3:(+f.max||3),v)},(_,i)=>`<i class="${i<v?'on':''}"></i>`).join('');
    return `<div class="frow" data-rowid="${f.id}">${fh}<div class="counter"><div><b>${esc(f.name)}</b> ${eff}<div class="dots ${neg?'neg':''}">${dots}</div></div><div class="stepper"><button data-food="${f.id}" data-d="-1" aria-label="${esc(f.name)} 줄이기">−</button><span class="v num">${v}</span><button data-food="${f.id}" data-d="1" aria-label="${esc(f.name)} 늘리기">+</button></div></div></div>`}).join('')||'<div class="empty">식사 항목이 없어요.</div>'}
function fill141(){
  const box=$('meal141');if(!box)return;
  const day=today(),pins=(Array.isArray(C.pin133)?C.pin133:[]).map(id=>C.actions.find(a=>a.id===id&&!a.doneAt)).filter(Boolean);
  const wOn=C.weight&&C.weight.on!==false;
  if(!(document.activeElement&&document.activeElement.id==='w141i'))
    box.innerHTML=`<div class="food" data-drop="reorder:food">${foodHtml141(day)}</div>`
      +(wOn?`<form class="weightform" id="w141f"><label>몸무게 (kg)<input id="w141i" type="number" step="0.1" min="30" max="250" inputmode="decimal" value="${day.weight??''}"></label><button class="btn" type="submit">기록</button><span class="small muted">${day.weight?'기록됨 · 고치려면 다시 기록':`재기만 해도 XP +${(C.weight||{}).xp||0}`}</span></form>`:'');
  const pb=$('pin141');
  if(pb){const chips=pins.map(a=>{const n=(day.entries||[]).filter(e=>e.kind==='act'&&e.aid===a.id).length;
      return `<span class="pq141" data-rowid="${esc(a.id)}"><span class="hand fh" data-drag="row:${esc(a.id)}" data-dragmode="now" aria-label="${esc(a.name)} 끌어서 순서 바꾸기">⋮⋮</span><button type="button" class="chipbtn p141${n?' on':''}" data-p141="${esc(a.id)}" aria-label="${esc(a.name)} 했어요 기록${n?' · 오늘 '+n+'번':''}">${n?'✓':'○'} ${esc(a.name)}${n>1?' ×'+n:''}</button></span>`}).join('');
    pb.innerHTML=chips?`<div class="m141p" data-drop="reorder:pin141">${chips}</div>`:'<div class="tiny muted">기록하기 → 행동/습관에서 행동 이름을 눌러 📌 고정하면 여기서 바로 기록해요.</div>'}}
// 빠른 기록(📌) 순서: 끌어서 바꾸기 — C.pin133(카드 id 목록)을 그대로 다시 배열
dndEnd=(function(prev){return function(x,y){
  const d=DND&&DND.drop;
  if(d&&d.type==='reorder'&&d.col==='pin141'){const id=DND.id;dndAbort();
    const arr=Array.isArray(C.pin133)?C.pin133:[],i0=arr.indexOf(id);if(i0<0)return;
    const rest=arr.filter(z=>z!==id);let i=d.before?rest.indexOf(d.before):rest.length;if(i<0)i=rest.length;rest.splice(i,0,id);
    C.pin133=rest;save('config');render();return}
  return prev.apply(this,arguments)}})(dndEnd);
addEventListener('submit',e=>{const f=e.target;if(!f||f.id!=='w141f')return;e.preventDefault();e.stopPropagation();
  const i=$('w141i'),v=parseFloat(i.value);if(!(v>=30&&v<=250)){toast('몸무게를 kg로 적어주세요');return}
  ui.off=0;$('wInput').value=v;const w=$('wForm');if(w.requestSubmit)w.requestSubmit();else w.dispatchEvent(new Event('submit',{cancelable:true,bubbles:true}))},true);
renderHome=(function(prev){return function(){const r=prev.apply(this,arguments);try{fill141()}catch(e){console.error(e)}return r}})(renderHome);
addEventListener('click',e=>{const T=e.target;if(!T||!T.closest)return;const b=T.closest('#pin141 [data-p141]');
  if(!b){if(T.closest('#meal141 [data-food],#meal141 [data-foodcheck]'))ui.off=0;return}
  e.preventDefault();e.stopPropagation();if(!ready)return;ui.off=0;const a=C.actions.find(x=>x.id===b.dataset.p141);if(a)doAction(a)},true);
addEventListener('change',e=>{if(e.target&&e.target.closest&&e.target.closest('#meal141'))ui.off=0},true);
// 처음 한 번: '오늘' 칸 바로 밑에 식사·몸무게, 그 밑에 자주 쓰는 것
render=(function(prev){return function(){
  try{migSleepGood141()}catch(e){console.error(e)}
  try{if(ready&&!C.mig141q&&Array.isArray(C.ui.home)){C.mig141q=1;C.mig141h=1;
    const H=C.ui.home;let i=H.findIndex(h=>h[0]==='meal141');
    if(i<0){const t=H.findIndex(h=>h[0]==='today'),at=t>=0?t+1:H.length,col=(H[t]||[])[2];H.splice(at,0,col?['meal141',1,col]:['meal141',1]);i=at}
    if(!H.some(h=>h[0]==='pin141')){const col=H[i][2];H.splice(i+1,0,col?['pin141',1,col]:['pin141',1])}
    save('config')}}catch(e){console.error(e)}
  return prev.apply(this,arguments)}})(render);

/* ---------- ⑦ 더보기 → 계정·백업 아래: 이 브라우저가 오늘 읽은 문서 수 · 📋 진단 복사 ---------- */
function reads141(){
  const box=$('acctBox');if(!box)return;
  let r=$('reads141');
  if(!r){r=document.createElement('div');r.id='reads141';r.className='reads141';box.after(r);
    r.innerHTML='<span class="rt141"></span><button type="button" class="chipbtn" id="diag141" aria-label="진단 내용 복사">📋 진단 복사</button>'}
  const n=typeof window.__hqReads==='function'?window.__hqReads():0,pct=Math.min(100,Math.round(n/500));
  const t=r.querySelector('.rt141');
  const sz=typeof window.__hqSizes==='function'?Object.values(window.__hqSizes()).reduce((x,y)=>x+(+y||0),0):0;
  t.innerHTML=`<span class="small" title="이 기기 추정치 · 5만은 모든 기기·같은 Firebase를 쓰는 앱이 함께 쓰는 한도(한국시간 오후 5시 리셋)">📖 오늘 읽은 문서(이 기기) <b class="num">${n.toLocaleString()}</b> / 50,000${sz?` · 다시 열 때마다 ≈${sz.toLocaleString()}`:''}</span><span class="rbar141" role="img" aria-label="무료 읽기 한도의 ${pct}%"><i style="width:${pct}%"></i></span>${n>=40000?'<span class="small rwarn141">⚠ 한도 가까움 — 이 기기에서 많이 읽었어요</span>':''}`;
  if(n>=40000&&!ui.rw141){ui.rw141=1;toast('📖 오늘 읽은 문서가 4만을 넘었어요(한도 5만). 앱을 자주 껐다 켜지 마세요')}}
function diagText141(){
  const dg=typeof window.__hqDiag==='function'?window.__hqDiag():{};
  const L=[`해비티카틱 진단 ${new Date().toLocaleString('ko-KR')}`,
    `화면: ${(document.querySelector('.banner b,#bannerVer')||{}).textContent||''} · ${location.pathname.includes('/beta/')?'베타':'본 앱'}`,
    `오늘 읽은 문서(이 브라우저): ${typeof window.__hqReads==='function'?window.__hqReads():'?'} / 50000`,
    `듣는 칸 크기(30분 넘게 끊겼다 다시 열 때 이만큼 읽음): ${typeof window.__hqSizes==='function'?JSON.stringify(window.__hqSizes()):'?'}`,
    `저장 상태: ${($('syncState')||{}).textContent||'?'} · 온라인 ${navigator.onLine}`,
    `저장 대기: ${(dg.dirty||[]).join(',')||'없음'} · 이 기기에 보관 중: ${(dg.pend||[]).join(',')||'없음'}`,
    `최근 오류: ${Object.entries(dg.err||{}).map(([k,v])=>`${k} ${v.code} ${v.msg}`).join(' | ')||'없음'}`,
    `재시도 대기(ms): ${JSON.stringify(dg.back||{})}`,
    `기기: ${navigator.userAgent.slice(0,120)}`];
  return L.join('\n')}
window.diagText141=diagText141;
addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('#diag141');if(!b)return;e.preventDefault();
  const t=diagText141();
  (navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast('📋 진단 내용을 복사했어요. 채팅에 붙여 넣어 주세요'),()=>{const ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');toast('📋 진단 내용을 복사했어요')}catch(x){toast('복사하지 못했어요')}ta.remove()})},true);
render=(function(prev){return function(){const r=prev.apply(this,arguments);try{reads141()}catch(e){console.error(e)}return r}})(render);
})();
