/* v13.16 (w142): 11/26 밤 요청 묶음
   ① 식사 블록(t.ml80)은 자동으로 personal 목록에 넣음(기존 블록도 한 번 옮김 — 사용자가 목록을 바꾼 뒤엔 `t.pl142`로 다시 안 건드림)
   ② 식사 블록에도 시간표 ○ 체크 단추(ckAll이 t.ml80을 빼고 있었음) — 누르면 completeTask(ml80 분기)가 '먹었어요'로
   ③ 홈 배치: 화면에 있는데 C.ui.home 목록에 없는 칸은 ⇢·끌기가 조용히 아무것도 안 했음 → 배치 편집을 열 때(applyHomeEdit)·옮기기 직전(homeDrop) 목록에 등록
   ④ 홈 '오늘 한 일': [오늘][어제][그저께][📅] 날짜 고르기(보기 전용 `ui.hl142` — 홈 빠른 기록이 지난 날로 들어가지 않게 `ui.off`와 따로)
   ⑤ 기록 줄에 커서를 올리면(폰은 길게 누르기) 무슨 기록이고 점수·보너스가 왜 붙었는지 설명(`explain142`)
   ⑥ 행동/습관 카드 찾기: 줄 대신 제목 줄 🔍 단추(누르면 펼침·Esc/다시 누르면 닫고 지움) · 영역 끝 입력 줄은 접힌 `＋ 추가` 칩(누르면 펼침, 비면 다시 접힘)·펼치면 색 띠로 카드와 구분
*/
(function(){
/* ---------- ① personal 목록 ---------- */
function persList142(){try{const p=(C.lists||[]).find(x=>/personal|개인/i.test(x.name||''));return p?p.id:null}catch(e){return null}}
mealEnsure80=(function(prev){return function(){
  const r=prev.apply(this,arguments);
  try{const pid=persList142();if(pid&&typeof tOK64==='function'&&tOK64()){
    Object.values(TASKS).forEach(t=>{if(!t||!t.ml80||t.pl142||t.list===pid)return;t.list=pid;t.pl142=1;AUTO80=1;try{saveTask(t)}finally{AUTO80=0}})}}catch(e){console.error(e)}
  return r}})(mealEnsure80);

/* ---------- ② 식사 블록 ○ ---------- */
// w129 ckAll은 `t.ml80`이면 건너뜀 → 식사만 따로 ○를 붙임(열린 끼니만. 끝낸 끼니는 식사 창 '↶ 안 먹었어요')
function mealCk142(){
  document.querySelectorAll('#calPane [data-ctask], #tt84slot [data-ctask]').forEach(el=>{
    if(el.classList.contains('bar83')||el.closest('.mgrid')||el.querySelector(':scope > .ck128'))return;
    if(!el.matches('.blk,.cchip'))return;
    const t=TASKS[el.dataset.ctask];if(!t||!t.ml80||t.status!==0)return;
    if(el.offsetWidth&&el.offsetWidth<54)return;
    const b=document.createElement('button');b.type='button';b.className='ck128';b.setAttribute('data-tdone',t.id);b.textContent='○';
    b.setAttribute('aria-label',(t.title||'')+' 먹었어요 (체크)');b.title='먹었어요';
    el.classList.add('has128');el.appendChild(b)})}
render=(function(prev){return function(){const r=prev.apply(this,arguments);try{mealCk142()}catch(e){console.error(e)}return r}})(render);
renderCal=(function(prev){return function(){const r=prev.apply(this,arguments);try{mealCk142()}catch(e){console.error(e)}return r}})(renderCal);

/* ---------- ③ 홈 배치: 목록에 없는 칸 등록 ---------- */
function ensureHome142(){try{const H=C.ui&&C.ui.home;if(!Array.isArray(H)||typeof HOME_BLOCKS==='undefined')return false;let ch=false;
  document.querySelectorAll('.hblock[data-hid]').forEach(b=>{const id=b.dataset.hid;if(!id||!HOME_BLOCKS[id]||H.some(h=>h&&h[0]===id)||!b.offsetParent)return;
    const col=b.parentElement&&/R$/.test(b.parentElement.id||'')?'R':'L';H.push([id,1,col]);ch=true});
  if(ch)save('config');return ch}catch(e){console.error(e);return false}}
applyHomeEdit=(function(prev){return function(){try{if(ui.homeEdit)ensureHome142()}catch(e){}return prev.apply(this,arguments)}})(applyHomeEdit);
homeDrop=(function(prev){return function(id,drop){try{const H=C.ui&&C.ui.home;if(Array.isArray(H)&&!H.some(h=>h&&h[0]===id)){ensureHome142();if(!H.some(h=>h&&h[0]===id)&&HOME_BLOCKS[id])H.push([id,1,(drop&&drop.grp)||'L'])}}catch(e){console.error(e)}return prev.apply(this,arguments)}})(homeDrop);
// ⇢ 단추 클릭: v5m 처리기는 목록에 없으면 그냥 return → 그 전에 등록(캡처 단계)
document.addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('[data-x56hcol]');if(b)ensureHome142()},true);

/* ---------- ④ 홈 오늘 한 일 날짜 고르기 ---------- */
function hlDate142(n){const o=ui.off;ui.off=n;try{return curDay().date}finally{ui.off=o}}
function hlBar142(n){const ul=$('homeLog'),p=ul&&ul.closest('.panel');if(!p)return;
  const date=hlDate142(n),td=dateKey(),far=n>2;
  let bar=p.querySelector(':scope>.dc142');if(!bar){bar=document.createElement('div');bar.className='dc142 daychips';const h=p.querySelector(':scope>.ptitle');if(h)h.after(bar);else p.prepend(bar)}
  const sig=n+'|'+date+'|'+td;if(bar.dataset.sig!==sig){bar.dataset.sig=sig;
    bar.innerHTML=[0,1,2].map(o=>`<button type="button" class="chipbtn" data-hl142="${o}" aria-pressed="${n===o}">${['오늘','어제','그저께'][o]}</button>`).join('')
      +`<label class="chipbtn d69p" aria-pressed="${far}">📅 ${far?esc(d69lbl(date)):'날짜'}<input type="date" id="hl142d" max="${td}" value="${date}" aria-label="기록 볼 날짜 고르기"></label>`}
  const h2=p.querySelector(':scope>.ptitle h2');if(h2)h2.textContent=n===0?'오늘 한 일':(n===1?'어제':n===2?'그저께':d69lbl(date))+(n>2?' 한 일':' 한 일')}
let HLPREV142=0;
homeLog98=(function(prev){return function(){
  const n=Math.max(0,+ui.hl142||0),ul=$('homeLog');
  if(ul&&curView()==='home'&&(n||HLPREV142))ul.innerHTML=`<li class="empty tiny muted" style="list-style:none;padding:6px 2px">${n===0?'오늘':n===1?'어제':n===2?'그저께':'그 날'} 기록이 없어요</li>`;
  HLPREV142=n;
  if(n&&curView()==='home'){const o=ui.off;ui.off=n;try{prev.apply(this,arguments)}finally{ui.off=o}}
  else prev.apply(this,arguments);
  try{if(curView()==='home')hlBar142(n)}catch(e){console.error(e)}}})(homeLog98);
addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('[data-hl142]');if(b){e.preventDefault();e.stopPropagation();ui.hl142=+b.dataset.hl142||0;homeLog98();return}
  if(e.target&&e.target.id==='hl142d'){try{e.target.showPicker&&e.target.showPicker()}catch(_){}}},true);
addEventListener('change',e=>{const i=e.target;if(!i||i.id!=='hl142d')return;e.stopPropagation();const v=i.value;if(v&&v<=dateKey()){ui.hl142=Math.max(0,diffDays(dateKey(),v));homeLog98()}},true);

/* ---------- ⑤ 기록 줄 설명(커서를 올리면) ---------- */
function explain142(date,e){
  const ar=C.areas.find(a=>a.id===e.area),an=ar?ar.name:'',L=[];
  const KIND={act:e.type==='bad'?'나쁜 행동 기록 — 컨디션·골드가 깎여요':'행동 카드 기록 — 카드에 정해 둔 점수가 들어가요',
    task:'할 일을 끝냄 — 이어진 행동 카드가 있으면 그 점수, 없으면 할 일 크기·중요도 점수예요',
    quest:'오늘의 일퀘 달성 보상 — 그 일이 뜨는 날 체크하면 정해진 XP·골드가 들어가요',
    routine:e.full?'루틴 완주 보너스 — 단계마다 점수가 따로 있고, 끝까지 하면 완주 보너스가 더해져요':'루틴 일부만 한 기록 — 끝낸 단계만큼만 점수가 들어가요',
    chain:'흐름 끊기 보상 — 나쁜 날이 이어지다 어제 깨끗하게 끊어서 받은 보상이에요(이어진 날수만큼 커져요)',
    chest:'일퀘 상자 — 오늘의 일퀘를 모두 해서 받은 보상이에요',
    wbrave:'이번 주 용기 목표 보너스 — 정한 횟수만큼 용기를 내서 받은 보상이에요',
    boss:'보스 처치 보상',badge:'뱃지를 받았어요',
    free:'카드 없이 그냥 한 일 — 일 크기에 따른 기본 점수가 들어가요',
    happy:'기분 좋은 일 기록',weigh:'몸무게 기록 — 재기만 해도 XP가 들어가요',
    buy:'골드를 쓴 구매 — 점수는 안 깎아요',jar:'구슬 기록'};
  L.push(KIND[e.kind]||'기록');
  if(typeof isBrave==='function'&&isBrave(e))L.push('⚔️ 용기 기록 — 용기 크기만큼 XP가 붙고, 보스에겐 치명타예요');
  const pt=[];if(e.cond)pt.push(`${an?an+' 컨디션 ':'컨디션 '}${e.cond>0?'+':'−'}${Math.abs(e.cond)}`);if(e.gold)pt.push(`골드 ${e.gold>0?'+':'−'}${Math.abs(e.gold)}`);if(e.xp)pt.push(`XP +${e.xp}`);
  if(pt.length)L.push('점수: '+pt.join(' · '));else if(!['buy','jar','badge'].includes(e.kind))L.push('점수 없음(기록만 남아요)');
  if(e.mult)L.push(`누적 ×${e.mult} — 같은 나쁜 행동을 이어서 해서 페널티가 ${e.mult}배로 커졌어요`);
  if(e.n>1)L.push(`×${e.n}번 묶어서 기록했어요`);
  if(e.gq)L.push('🎲 가챠로 뽑은 일이라 가챠 보너스가 붙었어요');
  if(e.px75)L.push('✎ 점수를 직접 고친 기록이에요');
  if(e.late)L.push('그 날이 지난 뒤에 적은 기록이에요');
  if(e.part72)L.push('끝까지 못 하고 한 만큼만 기록(여기까지)');
  if(e.dur)L.push(`⏱ ${e.dur}분 했어요`);
  if(e.sl125)L.push('🛏 어젯밤 창에서 자동으로 들어간 기록이에요');
  if(e.sl141)L.push('🛏 수면 시간으로 자동 기록됐어요');
  if(e.note)L.push('메모: '+String(e.note).slice(0,60));
  return L.join('\n')}
logRow=(function(prev){return function(date,e){let h=prev.apply(this,arguments);
  try{if(e&&typeof h==='string'&&!/data-b66li/.test(h)){const tip=esc(explain142(date,e)+(/data-entry=/.test(h)?'\n(눌러서 고치기)':''));
    h=h.replace(/^<li([^>]*?)(\s+title="[^"]*")?(\s*)>/,(m,a,t,sp)=>`<li${a} title="${tip}"${sp}>`)}}catch(x){console.error(x)}return h}})(logRow);

/* ---------- ⑥ 카드 찾기 🔍 · 영역 추가 접기 ---------- */
function aqUi142(){const row=$('aq141');if(!row)return;const P=row.closest('.panel'),q=String(ui.aq141||'').trim(),open=!!q||!!ui.aqOpen142;
  row.hidden=!open;row.style.display=open?'':'none';
  let b=$('aq142b');
  if(!b){b=document.createElement('button');b.type='button';b.id='aq142b';b.className='chipbtn aq142b';b.textContent='🔍';b.setAttribute('aria-label','카드 찾기');b.title='카드 찾기';
    const tt=P&&P.querySelector(':scope>.ptitle');if(tt){const h=tt.querySelector(':scope>.row')||tt;h.insertBefore(b,h.firstChild)}}
  if(b)b.setAttribute('aria-pressed',open)}
function addUi142(){const O=ui.addOpen142||{};
  document.querySelectorAll('#actGroups .add141f').forEach(f=>{const id=f.dataset.area,inp=f.querySelector('input'),on=!!O[id]||!!(inp&&inp.value);f.classList.toggle('open142',on)})}
renderLog=(function(prev){return function(){const r=prev.apply(this,arguments);try{aqUi142();addUi142()}catch(e){console.error(e)}return r}})(renderLog);
addEventListener('click',e=>{const T=e.target;if(!T||!T.closest)return;let b;
  if((b=T.closest('#aq142b'))){e.preventDefault();e.stopPropagation();
    if(ui.aqOpen142||String(ui.aq141||'').trim()){ui.aqOpen142=0;ui.aq141='';renderLog()}
    else{ui.aqOpen142=1;aqUi142();const i=$('aq141i');if(i)i.focus()}return}
  if((b=T.closest('form.add141f .plus'))){const f=b.closest('form');if(!f.classList.contains('open142')){e.preventDefault();e.stopPropagation();
    (ui.addOpen142=ui.addOpen142||{})[f.dataset.area]=1;f.classList.add('open142');const i=f.querySelector('input');if(i)i.focus()}}
},true);
addEventListener('keydown',e=>{const t=e.target;if(!t||e.key!=='Escape'||!t.closest)return;
  if(t.id==='aq141i'){ui.aqOpen142=0;ui.aq141='';t.blur();renderLog()}
  else if(t.closest('form.add141f')){const f=t.closest('form');if(!t.value){(ui.addOpen142=ui.addOpen142||{})[f.dataset.area]=0;f.classList.remove('open142');t.blur()}}},true);
addEventListener('focusout',e=>{const f=e.target&&e.target.closest&&e.target.closest('form.add141f');if(!f)return;
  setTimeout(()=>{if(!f.isConnected||f.contains(document.activeElement))return;const i=f.querySelector('input');if(i&&!i.value){(ui.addOpen142=ui.addOpen142||{})[f.dataset.area]=0;f.classList.remove('open142')}},120)},true);
})();
