/* ---- v12.7 (w125.js): 루틴 상세 군더더기 걷어내기(R5) + 🛏 어젯밤 창 '야식·술' → 어제 기록 (사용자 11/23 밤) ----
   ① 루틴 머리 할 일 상세: 맨 위 칩 줄의 📅 날짜·반복(when) · 📂 목록(list) · ⏱ 루틴/☑ 일퀘(card) · 🕓 크기(size)는 **바로 아래 루틴 카드가 이미 하는 일**
      (📅 언제 상자의 요일·일퀘·목록·시각, 머리의 ✨·영역, 단계마다 점수) → `.dup125`로 숨김(`dup125()`, drawTaskSheet 감쌈). 🧭 영역·⚑ 중요도·＋더는 그대로.
   ② 루틴 카드(rtCard61/62 감쌈 `slim125`): 완성된 HTML을 DOM으로 한 번 더 정리.
      · 단계 한 줄: `번호 · 이름 · 분 · ↑ ↓ · ⋯`. 점수(✨🔋)·🌊 몰입·🔀 묶기·◌ 선택·× 빼기·🃏 카드 잇기는 `⋯`(.mo125)를 눌러 펴는 `.x125` 줄로(행마다 열림, 다시 그리면 닫힘).
      · 📅 언제 상자: 목록 단추(📋 …)를 ⏰ 시각 줄로 옮기고, 긴 안내 글은 ⏰ 글자의 title로.
      · 맨 아래: 긴 설명·`모든 루틴`·`루틴 지우기`는 `⋯ 더 보기`(details.more125) 안으로. 합계 줄의 '+ 완주 보너스'는 머리 칩과 겹쳐 뺌.
   ③ 🛏 어젯밤 창(w102)에서 `🍺 술 마심`·`🌙 늦은 야식`을 켜고 저장하면 **어제 기록에 그 나쁜 행동 카드를 넣음**(`sync125`). 어제에 이미 같은 종류가 있으면 안 넣고,
      끄고 저장하면 **이 창이 넣은 것(e.sl125)만** 지움(사용자가 직접 넣은 건 그대로). 카드가 없으면 조용히 건너뜀. 카드 점수는 w104 규칙대로 몸 최대 깎기를 대신함(두 번 안 깎임).
   시험 t132. */

/* ---- ① 루틴 머리 상세: 중복 칩 숨김 ---- */
function dup125(){const sc=$('sheetC');if(!sc||!sc.querySelector('.rt62p'))return;const ch=sc.querySelector('.tchips');if(!ch)return;
  ['when','list','card','size'].forEach(k=>{const b=ch.querySelector(`:scope > [data-k79="${k}"]`);if(b)b.classList.add('dup125')})}
drawTaskSheet=(function(prev){return function(){const x=prev.apply(this,arguments);try{dup125()}catch(e){console.error(e)}return x}})(drawTaskSheet);

/* ---- ② 루틴 카드 정리 ---- */
function stepRow125(row){
  const ctl=row.querySelector(':scope > .ctl71');if(!ctl||row.classList.contains('c125'))return;
  const x=document.createElement('div');x.className='x125';
  const put=n=>{if(n)x.appendChild(n)};
  put(row.querySelector(':scope > .pt62'));
  put(ctl.querySelector('.fl70'));
  ctl.querySelectorAll('.ops .t71').forEach(put);
  put(ctl.querySelector('.ops [data-r62op^="del:"]'));
  put(row.querySelector(':scope > .why'));
  const mo=document.createElement('button');mo.type='button';mo.className='ib mo125';mo.setAttribute('data-mo125','1');mo.setAttribute('aria-expanded','false');
  mo.setAttribute('aria-label','단계 더 보기');mo.title='점수 · 🌊 몰입 · 🔀 묶기 · ◌ 선택 단계 · 카드 잇기 · 루틴에서 빼기';mo.textContent='⋯';
  ctl.insertAdjacentElement('afterend',mo);row.appendChild(x);row.classList.add('c125')}
function slim125(h,r){
  try{
    if(typeof h!=='string'||h.indexOf('class="jarcard')<0||h.indexOf('slim125')>=0)return h;
    const t=document.createElement('template');t.innerHTML=h;const root=t.content;const card=root.querySelector('.jarcard');if(!card)return h;
    card.classList.add('slim125');
    // 단계 한 줄
    root.querySelectorAll('.st62s > .st62').forEach(row=>{try{stepRow125(row)}catch(e){console.error(e)}});
    // 📅 언제 상자: 목록 단추를 시각 줄로 · 안내 글은 title로
    const w=root.querySelector('.when60'),tm=root.querySelector('.when123')||root.querySelector('.when71');
    if(w&&tm){
      const lb=w.querySelector(':scope > [data-x60task]');if(lb){lb.classList.add('lb125');tm.appendChild(lb)}
      const hint=tm.querySelector(':scope > .tiny.muted');if(hint){const b=tm.querySelector('b.small');if(b)b.title=hint.textContent.trim();hint.remove()}}
    // 합계 줄: 완주 보너스는 머리 칩과 겹침
    root.querySelectorAll('.sum62 > span').forEach(s=>{if(/^\s*\+\s*완주 보너스/.test(s.textContent))s.remove()});
    // 맨 아래: 설명·모든 루틴·루틴 지우기를 접힘으로
    const expl=[...card.children].find(p=>p.tagName==='P'&&/^\s*단계 = 할 일이에요/.test(p.textContent));
    const all=card.querySelector('[data-r61all]'),del=card.querySelector('[data-r62op^="rdel:"]');
    if(expl||all||del){
      const d=document.createElement('details');d.className='more125';
      const s=document.createElement('summary');s.textContent='⋯ 더 보기';d.appendChild(s);
      if(all||del){const row=document.createElement('div');row.className='row more125r';if(all)row.appendChild(all);if(del)row.appendChild(del);d.appendChild(row)}
      if(expl){expl.removeAttribute('style');d.appendChild(expl)}
      card.appendChild(d)}
    return t.innerHTML
  }catch(e){console.error(e)}return h}
rtCard62=(function(prev){return function(r){return slim125(prev.apply(this,arguments),r)}})(rtCard62);
rtCard61=(function(prev){return function(r){return slim125(prev.apply(this,arguments),r)}})(rtCard61);
addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('[data-mo125]');if(!b)return;
  e.preventDefault();e.stopPropagation();const row=b.closest('.st62');if(!row)return;const on=row.classList.toggle('open125');b.setAttribute('aria-expanded',String(on))},true);

/* ---- ③ 🛏 어젯밤 창 → 어제 기록 ---- */
const K125={
  ln:{re:/야식|폭식|과식/,pick:()=>C.actions.find(a=>a.type==='bad'&&/야식/.test(a.name||'')&&!/참/.test(a.name||'')),label:'야식'},
  dr:{re:/술|음주|과음|혼술|맥주|소주|와인/,pick:()=>C.actions.find(a=>a.type==='bad'&&(a.id==='b1'||/술|음주/.test(a.name||''))&&!/참/.test(a.name||'')),label:'술'}};
function has125(y,k){const R=K125[k].re;return (y.entries||[]).filter(e=>{if(e.type!=='bad')return false;const n=String(e.name||'')+' '+String(e.opt||'');
  if(k==='ln')return R.test(n)&&!/참/.test(n);return e.aid==='b1'||R.test(n)})}
function log125(yk,a,key){
  const y=dayOf(yk),before=(y.entries||[]).length;
  try{withDay69(yk,()=>doAction(a,{direct:true,at:'23:30',vid:(pickVariant(a,23.5)||{}).id,note:'🛏 어젯밤 창에서 체크'}))}catch(e){console.error(e);return false}
  const y2=DAYS[yk],es=(y2&&y2.entries)||[];
  if(es.length>before){const e=es[es.length-1];e.sl125=key;save(yk);return true}
  return false}
function sync125(k){
  try{
    if(!k||!ready72()||!C)return;
    const d=DAYS[k],s=(d&&d.sl102)||{},yk=addDays(k,-1);let y=DAYS[yk];
    ['ln','dr'].forEach(key=>{
      const want=!!s[key],have=has125(dayOf(yk),key);y=DAYS[yk];
      if(want&&!have.length){const a=K125[key].pick();if(a)log125(yk,a,key)}
      else if(!want){const mine=have.filter(e=>e.sl125===key);
        mine.forEach(e=>{try{removeEntry(yk,e.id)}catch(x){console.error(x)}})}});
    render()
  }catch(e){console.error(e)}}
addEventListener('click',e=>{const T=e.target;if(!T||!T.closest)return;
  if(T.closest('[data-sl102ok],[data-sl102del]')&&typeof SL102!=='undefined'&&SL102.k){const k=SL102.k;setTimeout(()=>sync125(k),30)}},true);
