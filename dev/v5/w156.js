/* ================= v13.36 (w156) — 사용자 11/28 밤 요청 묶음 =================
   ① 관리를 차례보다 먼저 끝내면 다음 차례가 바로 다음 날로 잡히던 것(베개 빨래: 토요일 차례를 금요일에 했는데 토요일이 또 '오늘 차례')
   ② 관리 묶음 머리에 이어진 카드(집 청소)의 방치 경보 빼기 — 머리는 묶음일 뿐, 하위 관리가 제 차례로 알려 줌
   ③ 홈 '오늘 한 일': '전체 보기'(기록하기 화면으로 옮김) 대신 그 자리에서 펼치기
   ④ 처음 열 때 옛 화면(빌드 전 기본 마크업)이 잠깐 보였다가 바뀌던 것 · 이미 새 버전인데 '새 버전' 알림·새로고침
   ⑤ 🛟 사라진 것 찾기가 이미 있는 루틴(🌅 Eos)의 옛 프리셋을 또 내밀던 것 · 루틴 단계가 지워질 때 기기에 사본을 남겨 🛟에서 되살리기
   ⑥ 주 N회 횟수: 같은 카드의 다른 할 일은 같은 옵션(`t.av151`)일 때만 셈(빨래 주 2회는 옷 빨래만 — 이불·베개 빨래는 안 셈)
   ⑦ 피드·쇼츠 카드 📏 시간 옵션(한 번짜리 `C.mig156f`) */
(function(){
const A=()=>C.actions||[];
const byId=id=>A().find(a=>a&&a.id===id);

/* ---------- ① 관리 미리 끝냄 → 이번 차례로 셈 ---------- */
// 요일·달 반복 관리는 '한 날'부터 주기의 절반은 지나야 다음 차례(그 안의 차례는 방금 한 것으로 셈).
function half156(rep){const i=Math.max(1,+rep.i||1);
  if(rep.f==='w'){const n=(rep.wd&&rep.wd.length)||1;return Math.max(1,Math.ceil(7*i/n/2))}
  if(rep.f==='m'){const n=(rep.md&&rep.md.length)||1;return Math.max(1,Math.ceil(30*i/n/2))}
  return 0}
function push156(t,base){if(!t||!t.rep||(t.rep.f!=='w'&&t.rep.f!=='m')||!t.due||!base)return false;
  const th=addDays(base,half156(t.rep));if(t.due>=th)return false;
  let nd=t.due,g=0;while(nd&&nd<th&&g++<60)nd=nextDue(t.rep,nd);
  if(!nd||nd===t.due||(t.rep.until&&nd>t.rep.until))return false;t.due=nd;return true}
window.push156=push156;
completeTask=(function(prev){return function(t){const fl=!!(t&&t.status===0&&isCare76(t));
  const r=prev.apply(this,arguments);
  try{if(fl&&t.status===0&&t.last){const base=t.last===gk76()?midKey68():t.last;if(push156(t,base))saveTask(t)}}catch(e){console.error(e)}
  return r}})(completeTask);
// 이미 어긋난 것(끝낸 날 바로 뒤가 다음 차례) 한 번만 바로잡기
function fixCare156(){if(C.mig156c||typeof ready72!=='function'||!ready72()||!tasksReady||!tOK64())return false;
  C.mig156c=1;const done=[];
  Object.values(TASKS).forEach(t=>{if(!t||t.status!==0||!isCare76(t)||!t.last||!t.due||t.due<=t.last)return;
    if(typeof plOn126==='function'&&plOn126(t))return;const o=t.due;if(push156(t,t.last)){saveTask(t);done.push([t,o])}});
  save('config');
  if(done.length)setTimeout(()=>toastAct(`🧽 미리 끝낸 관리 ${done.length}개의 다음 차례를 바로잡았어요(${done.map(([t])=>"'"+t.title+"' → "+fmtD(t.due)).join(' · ')})`,'되돌리기',()=>{done.forEach(([t,o])=>{t.due=o;saveTask(t)});render()},9000),2200);
  return true}

/* ---------- ② 관리 묶음 머리 카드는 방치 경보 없음 ---------- */
let FC156={at:0,s:null};
function foldCards156(){const n=Date.now();if(FC156.s&&n-FC156.at<400)return FC156.s;const s=new Set();
  try{const F=folds132();Object.values(TASKS).forEach(t=>{if(t&&t.aid&&t.status===0&&F.has(t.id)&&isCare76(t))s.add(t.aid)})}catch(e){}
  FC156={at:n,s};return s}
window.foldCards156=foldCards156;
neglectList=(function(prev){return function(){const L=prev.apply(this,arguments);try{const s=foldCards156();if(!s.size)return L;return L.filter(x=>!(x&&x.w&&s.has(x.w.action)))}catch(e){console.error(e);return L}}})(neglectList);
todayHabits=(function(prev){return function(){const L=prev.apply(this,arguments);try{const s=foldCards156();if(!s.size||!Array.isArray(L))return L;return L.filter(x=>!(x&&x.a&&s.has(x.a.id)))}catch(e){return L}}})(todayHabits);

/* ---------- ③ 홈 오늘 한 일: 그 자리에서 펼치기 ---------- */
// '전체 보기' 글자 연결은 CSS로 숨김(v156.css) · 목록 끝 '＋ n개 더 보기'/'접기'가 펼침(LOGALL98)

/* ---------- ④ 처음 열 때: 첫 그리기가 끝난 뒤에 보이기 · 이미 새 버전이면 새로고침 안내 안 함 ---------- */
render=(function(prev){return function(){const r=prev.apply(this,arguments);try{document.documentElement.classList.add('ok156')}catch(e){}return r}})(render);
{const _n=window.__swNew69;if(typeof _n==='function')window.__swNew69=function(){const me=window.__ver156;
  if(!me||!window.caches){return _n.apply(this,arguments)}
  const args=arguments,self=this;
  caches.keys().then(ks=>{const pre=location.pathname.includes('/beta/')?'hqb-':'hq-';if(ks.includes(pre+me))return;_n.apply(self,args)}).catch(()=>_n.apply(self,args))}}

/* ---------- ⑤ 🛟: 이미 있는 루틴의 옛 프리셋은 안 내밀기 · 지운 루틴 단계 사본 ---------- */
const GK156='hq-gone156'+(location.pathname.includes('/beta/')?'-b':'');
let UI156=0;['pointerdown','keydown'].forEach(k=>addEventListener(k,()=>{UI156=Date.now()},true));
function gone156(){try{return JSON.parse(localStorage.getItem(GK156)||'[]')||[]}catch(e){return []}}
function goneSet156(L){try{localStorage.setItem(GK156,JSON.stringify(L.slice(-40)))}catch(e){}}
deleteTask=(function(prev){return function(id){try{const t=TASKS[id];
    if(t&&(t.rstep||t.rid)&&t.status===0){const h=t.parent&&TASKS[t.parent],L=gone156();
      L.push({at:Date.now(),u:Date.now()-UI156<2500?1:0,rid:t.rid||(h&&h.rid)||'',rn:(h&&h.title)||'',t:clone(t)});goneSet156(L)}}catch(e){console.error(e)}
  return prev.apply(this,arguments)}})(deleteTask);
const base156=n=>String(n||'').split(' · ')[0].trim();
infoFor=(function(prev){return function(k){const r=prev.apply(this,arguments);if(k!=='rescue147'||!r||typeof r.b!=='string')return r;
  try{const tp=document.createElement('template');tp.innerHTML=r.b;
    const have=(C.routines||[]).map(x=>base156(x.name)).filter(Boolean);
    tp.content.querySelectorAll('[data-rs147="routine"]').forEach(b=>{const row=b.closest('.rr147'),nm=row&&row.querySelector('span');const bn=base156(nm&&nm.textContent);
      if(bn&&have.some(h=>h===bn||h.startsWith(bn)||bn.startsWith(h)))row.remove()});
    tp.content.querySelectorAll('.r147').forEach(s=>{if(!s.querySelector('.rr147'))s.remove()});
    const now=new Set(Object.keys(TASKS||{}));
    const G=gone156().map((g,i)=>[g,i]).filter(([g])=>g&&g.t&&!now.has(g.t.id)).slice(-12).reverse();
    const box=tp.content.querySelector('.rs147')||tp.content;
    if(G.length){const s=document.createElement('div');s.className='r147';
      s.innerHTML='<b>🧩 지워진 루틴 단계·머리 (이 기기에서)</b>'+G.map(([g,i])=>`<div class="rr147"><span>${esc(g.t.title||'단계')} · ${esc(g.rn||g.rid||'')} <span class="tiny muted">(${new Date(g.at).toLocaleString('ko-KR',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})} · ${g.u?'누른 직후':'저절로'})</span></span><button type="button" class="chipbtn" data-rs156="${i}">되살리기</button></div>`).join('');
      const first=tp.content.querySelector('.r147');if(first)first.before(s);else tp.content.prepend(s)}
    if(!tp.content.querySelector('.rr147')&&!/찾을 게 없어요/.test(tp.innerHTML)){const p=document.createElement('p');p.textContent='✓ 찾을 게 없어요. 기록에 남은 카드·뽀모도로·루틴이 모두 제자리에 있어요.';tp.content.prepend(p)}
    r.b=tp.innerHTML}catch(e){console.error(e)}
  return r}})(infoFor);
addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('[data-rs156]');if(!b)return;e.preventDefault();e.stopPropagation();
  const L=gone156(),g=L[+b.dataset.rs156];if(!g||!g.t)return;if(TASKS[g.t.id]){toast('이미 있어요');return}
  const t=clone(g.t);if(t.parent&&!TASKS[t.parent]){const r=(C.routines||[]).find(x=>x.id===g.rid);const h=r&&rtH62(r,false);if(h)t.parent=h.id}
  saveTask(t);try{if(g.rid){const r=(C.routines||[]).find(x=>x.id===g.rid);if(r)sync62(r)}}catch(er){}
  render();toast(`🧩 '${t.title}' 되살렸어요`);try{const p=lastPt;openInfo('rescue147');lastPt=p}catch(er){}},true);

/* ---------- ⑥ 주 N회: 같은 카드 다른 할 일은 같은 옵션일 때만 ---------- */
dayCnt99=(function(prev){return function(t,k){const r=prev.apply(this,arguments);
  try{if(!t||!t.av151||!t.aid||!r)return r;const d=DAYS[k];if(!d)return r;let own=0,oth=0,h=0;
    (d.entries||[]).forEach(e=>{if(!e)return;const x=e.tid!=null&&TASKS[e.tid];
      if(e.tid===t.id)own++;
      else if(e.aid===t.aid&&e.tid!=null){const v=(typeof mgVid151==='function'?mgVid151(e):e.vid)||(x&&x.av151)||null;if(!v||v===t.av151)oth++}
      if(x&&x.hg119===t.id)h++});
    return Object.assign({},r,{n:Math.max(own,oth,h)})}catch(e){console.error(e);return r}}})(dayCnt99);

/* ---------- ⑦ 피드·쇼츠 📏 시간 옵션 ---------- */
function feedCard(){return A().find(a=>a&&a.type==='bad'&&!a.doneAt&&!a.mg&&!(a.opts||[]).filter(Boolean).length&&/피드/.test(a.name||'')&&/쇼츠/.test(a.name||''))||null}
function migFeed156(){if(C.mig156f||typeof ready72!=='function'||!ready72()||!A().length)return false;C.mig156f=1;
  const a=feedCard();if(!a){save('config');return true}
  const s0=clone(a),c=Math.abs(+a.cond||0),x=Math.abs(+a.xp||0),g=Math.abs(+a.gold||0),m=(v,k)=>v?Math.max(1,Math.round(v*k)):0,o=(id,name,k,lo,hi)=>({id,name,cond:m(c,k),xp:m(x,k),gold:m(g,k),q:{lo,hi}});
  a.opts=[o('f0','30분 미만',0.3,null,30),o('f1','30분~1시간',0.6,30,60),o('f2','1~2시간',1,60,120),o('f3','2~3시간',1.5,120,180),o('f4','3시간 넘게',2,180,null)];
  a.unit152='분';if(/1\s*시간\s*넘게/.test(a.name||''))a.name=a.name.replace(/\s*1\s*시간\s*넘게\s*/,'').trim()||'피드·쇼츠';
  save('config');
  setTimeout(()=>toastAct(`📏 '${a.name}'에 시간 옵션(30분 미만 · 30분~1시간 · 1~2시간 · 2~3시간 · 3시간 넘게)을 넣었어요 — 기록 창 📏 칸에 분을 적으면 골라져요`,'되돌리기',()=>{const i=A().findIndex(z=>z.id===s0.id);if(i>=0)C.actions[i]=s0;save('config');render();toast('📏 피드·쇼츠 시간 옵션을 뺐어요')},10000),3000);
  return true}

render=(function(prev){return function(){let ch=false;
  try{if(!C.mig156c)ch=fixCare156()||ch;if(!C.mig156f)ch=migFeed156()||ch}catch(e){console.error(e)}
  const r=prev.apply(this,arguments);if(ch)setTimeout(()=>{try{render()}catch(_){}},0);return r}})(render);

F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['🧽 관리 미리 하기','할 일 → 🧽 관리 · 홈 관리 칩','요일·달 반복 관리를 차례보다 며칠 먼저 끝내도 이번 차례로 셈 — 다음 차례는 그다음 주(달)로',()=>{location.hash='tasks'},'관리 미리 일찍 차례 주간 요일 반복 다음 차례'],
  ['🏠 오늘 한 일 펼치기','홈 → 오늘 한 일 카드 맨 아래 ＋ n개 더 보기','8개가 넘으면 그 자리에서 펼치고 접어요(기록하기 화면으로 안 옮김)',()=>{location.hash='home'},'오늘 한 일 전체 보기 펼치기 접기'],
  ['🧩 지워진 루틴 단계 되살리기','더보기 → 계정·백업 → 🛟 사라진 것 찾기','이 기기에서 지워진 루틴 단계·머리를 언제·어떻게(누른 직후/저절로) 지워졌는지와 함께 보여 주고 눌러서 되살려요',()=>{location.hash='more'},'루틴 단계 사라짐 지워짐 되살리기 복구']])}})(F67);
})();
