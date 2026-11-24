/* ---- v13.2 (w130.js): 관리 창 하나로(U1 — 본체는 w128 deck128) · 날짜 고르기 한 부품(dayMenu130) · 관리 ⋯ 메뉴(건너뛰기·다른 날짜로)
   · 할 일 우클릭(폰 꾹) '⏩ 미루기…' · 캘린더 위 주 N회 칩 끌어 순서 바꾸기(C.wko130) · 내일 짜기 관리 단계 정렬 ----
   · dayMenu130(x,y,{title,base,onPick}) — 내일·모레·주말·다음 주·+1주·날짜 고르기. 관리 '다른 날짜로 지정하기'와 할 일 '미루기'가 같은 부품.
   · 관리 ⋯(careMenu76 다시 선언): 📅 시간표에 놓기 · ✕ 놓은 자리 빼기 · ⏭ 이번 차례 건너뛰기(앞날 차례도) · 📆 다른 날짜로 · ✎ 열기 · ↻ 주기 · 관리에서 빼기.
   · 캘린더에서 관리 블록을 우클릭해도 같은 관리 메뉴(taskMenu61 → careMenu76). */
{
const td130=()=>midKey68();
/* ---------- 날짜 고르기 한 부품 ---------- */
function dayOpts130(base){const td=td130(),b=base&&base>td?base:td;
  const wkend=(()=>{let d=addDays(weekStart(td),5);return d<=td?addDays(d,7):d})();
  const o=[['내일',addDays(td,1)],['모레',addDays(td,2)],['주말',wkend],['다음 주',addDays(weekStart(td),7)],['+1주',addDays(b,7)]];
  const seen=new Set();return o.filter(([,k])=>{if(seen.has(k))return false;seen.add(k);return true})}
function dayMenu130(x,y,o){o=o||{};const td=td130(),opts=dayOpts130(o.base),pick=k=>{closeMenu61();try{o.onPick(k)}catch(e){console.error(e)}};
  const items=opts.map(([l,k])=>({l:`${l} <small class="muted">${esc(fmtD(k))}(${esc(wdOf(k))})</small>`,dis:o.cur===k,f:()=>pick(k)}));
  const i=items.length+1;
  items.push('-',{html:`<div class="m61f dm130"><input type="date" id="dm130" min="${esc(addDays(td,o.min0?0:1))}" value="${esc(o.base&&o.base>td?o.base:addDays(td,1))}" aria-label="날짜 고르기"><button type="button" class="btn sm" data-m61="${i}">이 날로</button></div>`,keep:1,
    f:()=>{const v=($('dm130')||{}).value;if(!/^\d{4}-\d\d-\d\d$/.test(v||'')||v<td){toast('날짜를 골라요');return}pick(v)}});
  menu61(x,y,o.title||'📆 언제로?',items)}
window.dayMenu130=dayMenu130;
addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target&&e.target.id==='dm130'){e.preventDefault();e.stopPropagation();const b=document.querySelector('#m61 .dm130 [data-m61]');if(b)b.click()}},true);

/* ---------- 관리: 이번 차례 건너뛰기 · 다른 날짜로 ---------- */
function back130(t,s){Object.keys(t).forEach(x=>delete t[x]);Object.assign(t,clone(s));saveTask(t);try{syncDailies(C);save('config')}catch(e){}render()}
function skipNext130(t){const td=td130(),base=t.due&&t.due>td?t.due:td;return nextDue(t.rep,base)}
function skip130(t){if(!t||!t.rep||!t.rep.f)return;const td=td130(),s=clone(t),old=t.due,nd=skipNext130(t);
  if(!nd||nd===old){toast('다음 차례를 못 정했어요');return}
  if(old&&old<=td){const dk=dateKey();t.skip61=[...new Set([...(t.skip61||[]).filter(d=>d>=addDays(dk,-14)),dk])]}
  delete t.cs126;delete t.skull;t.due=nd;saveTask(t);try{syncDailies(C);save('config')}catch(e){}render();
  toastAct(`⏭ '${t.title}' 이번 차례${old?'('+fmtD(old)+')':''} 건너뜀 · 다음 ${dueLabel(nd)}`,'되돌리기',()=>back130(t,s))}
function move130(t,k){if(!t||!k)return;const s=clone(t),old=t.due;if(old===k){toast('같은 날이에요');return}
  delete t.cs126;t.due=k;t.dset72=Date.now();if(t.rep&&t.rep.f==='x')t.keep105=k;saveTask(t);render();
  toastAct(`📆 '${t.title}' 이번 차례 → ${dueLabel(k)} (주기는 그대로)`,'되돌리기',()=>back130(t,s))}
window.skip130=skip130;window.move130=move130;
function careMenu130(t,x,y){const on=plOn126(t),bk=sheetCtx&&sheetCtx.c76,nd=skipNext130(t);
  menu61(x,y,`🧽 ${esc(t.title.length>22?t.title.slice(0,22)+'…':t.title)}`,[
    {l:on?`📅 놓은 자리 바꾸기 <small class="muted">${esc(fmtD(t.cs126.d))}${t.cs126.m?' '+esc(t.cs126.m):''}</small>`:'📅 시간표에 놓기… <small class="muted">이 차례만</small>',f:()=>plSheet126(t.id,bk?{back:'care',bk}:{})},
    {l:'✕ 놓은 자리 빼기 <small class="muted">원래 차례로</small>',dis:!on,f:()=>{const s=snap126(t);unplace126(t);render();toastAct(`🧽 ${t.title} · 원래 차례로 돌렸어요`,'되돌리기',()=>{restore126(t,s);render()})}},
    '-',
    {l:`⏭ 이번 차례 건너뛰기 <small class="muted">${nd?'다음 '+esc(fmtD(nd)):''}</small>`,dis:!nd,f:()=>skip130(t)},
    {l:'📆 다른 날짜로 지정하기… <small class="muted">이 차례만</small>',keep:1,f:()=>{const r=($('m61')||document.body).getBoundingClientRect();closeMenu61();dayMenu130(r.left,r.top,{title:`📆 '${esc(t.title.slice(0,16))}' 이번 차례`,base:t.due,cur:t.due,min0:1,onPick:k=>move130(t,k)})}},
    '-',
    {l:'✎ 열기 (반복·점수 고치기)',f:()=>openTaskSheet(t.id)},
    {l:`↻ 주기 바꾸기 <small class="muted">지금 ${esc(repLabel(t.rep))}</small>`,f:()=>cycleMenu77(t,x,y,n=>{t.rep=(n&&typeof n==='object')?clone(n):{f:'d',i:n};saveTask(t);render();toast(`'${t.title}' ${repLabel(t.rep)}`)})},
    '-',{l:'🧽 관리에서 빼기 (할 일 목록으로)',f:()=>careToggle76(t)}])}
careMenu76=careMenu130;window.careMenu76=careMenu130;

/* ---------- 할 일 우클릭(폰 꾹): ⏩ 미루기… (같은 날짜 부품) · 관리는 관리 메뉴 ---------- */
let MT130=null;
taskMenu61=(function(prev){return function(t,x,y){if(t&&isCare76(t)&&t.status===0){careMenu130(t,x,y);return}MT130={t,x,y};try{return prev.apply(this,arguments)}finally{MT130=null}}})(taskMenu61);
menu61=(function(prev){return function(x,y,title,items){
  try{const m=MT130;if(m&&Array.isArray(items)){const t=m.t,rep=!!(t.rep&&t.rep.f),open=t.status===0,td=td130();
    const pp={k130:1,l:`⏩ ${rep?'이번 차례 ':''}미루기… <small class="muted">내일·다음 주·날짜</small>`,dis:!open,keep:1,
      f:()=>{const r=($('m61')||document.body).getBoundingClientRect();closeMenu61();dayMenu130(r.left,r.top,{title:`⏩ '${esc(t.title.slice(0,16))}' 언제로?`,base:t.due,cur:t.due,onPick:k=>postpone(t,k)})}};
    const L=it=>it&&typeof it==='object'&&String(it.l||'');
    let at=items.findIndex(it=>/^⏩ 내일로 미루기/.test(L(it)));
    if(at>=0)items=items.slice(0,at).concat([pp],items.slice(at+1));
    const wi=items.findIndex(it=>/^⏩ 다음 주 월요일로/.test(L(it)));
    if(wi>=0){if(at>=0)items=items.filter((_,i)=>i!==wi);else items=items.slice(0,wi).concat([pp],items.slice(wi+1))}
    else if(at<0&&!items.some(it=>it&&it.k130)){const si=items.findIndex(it=>/^⏭ 오늘은 건너뛰기/.test(L(it)));if(si>=0)items=items.slice(0,si+1).concat([pp],items.slice(si+1))}}
  }catch(e){console.error(e)}
  return prev.call(this,x,y,title,items)}})(menu61);

/* ---------- 캘린더 위 주 N회 칩: 끌어서 순서 바꾸기 (C.wko130 = [대표 할 일 id…]) ---------- */
const wkOrd=()=>Array.isArray(C.wko130)?C.wko130:[];
function wkSort130(){const m=$('calMain'),w=m&&m.parentElement&&m.parentElement.querySelector(':scope > .wk91');if(!w)return;const o=wkOrd();
  w.querySelectorAll(':scope > .c91[data-wk105]').forEach(c=>{if(c.dataset.wk105!=='*'){c.setAttribute('data-wko130',c.dataset.wk105)}});
  if(!o.length)return;
  const cs=[...w.querySelectorAll(':scope > .c91[data-wko130]')];if(cs.length<2)return;
  const rank=id=>{const i=o.indexOf(id);return i<0?1e6+cs.findIndex(c=>c.dataset.wko130===id):i};
  const tail=[...w.children].filter(c=>!c.matches('.c91[data-wko130]')&&!c.matches('.c91[data-wk105="*"]'));
  cs.sort((a,b)=>rank(a.dataset.wko130)-rank(b.dataset.wko130)).forEach(c=>w.appendChild(c));tail.forEach(c=>w.appendChild(c))}
strip91=(function(prev){return function(){prev.apply(this,arguments);try{wkSort130()}catch(e){console.error(e)}}})(strip91);
window.wkSort130=wkSort130;
const fromWk=()=>!!(DND.on&&DND.kind==='task'&&DND.el&&DND.el.closest&&DND.el.closest('.wk91'));
dndMove=(function(prev){return function(x,y){prev.apply(this,arguments);
  try{if(!fromWk())return;const w=DND.el.closest('.wk91'),r=w.getBoundingClientRect();if(y<r.top-6||y>r.bottom+6||x<r.left||x>r.right)return;
    clearHi();const kids=[...w.querySelectorAll(':scope > .c91[data-wko130]')].filter(c=>c!==DND.el);
    let before=null;for(const c of kids){const b=c.getBoundingClientRect();if(x<b.left+b.width/2){before=c;break}}
    const ind=document.createElement('i');ind.className='ins130';ind.setAttribute('aria-hidden','true');if(before)w.insertBefore(ind,before);else{const last=kids[kids.length-1];if(last)last.after(ind);else w.appendChild(ind)}DND.ind=ind;
    DND.drop={type:'wk130',id:DND.el.dataset.wko130||DND.id,before:before?before.dataset.wko130:null}}catch(e){console.error(e)}}})(dndMove);
dndEnd=(function(prev){return function(x,y){const d=DND.drop;
  if(d&&d.type==='wk130'){dndAbort();try{const m=$('calMain'),w=m&&m.parentElement&&m.parentElement.querySelector(':scope > .wk91');
      const cur=w?[...w.querySelectorAll(':scope > .c91[data-wko130]')].map(c=>c.dataset.wko130):[];
      const rest=cur.filter(id=>id!==d.id);let i=d.before?rest.indexOf(d.before):rest.length;if(i<0)i=rest.length;rest.splice(i,0,d.id);
      const keep=wkOrd().filter(id=>!rest.includes(id)&&TASKS[id]);C.wko130=rest.concat(keep).slice(0,60);save('config');
      ui.calKeepScroll=true;render();toast('🔁 주 N회 순서를 바꿨어요')}catch(e){console.error(e)}return}
  return prev.apply(this,arguments)}})(dndEnd);

/* ---------- F67 기능 지도 ---------- */
F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['🧽 관리 창 하나로','홈·할 일 🧽 관리 줄 · 캘린더 위 🧽 관리 단추 · 캘린더 🧽 관리 블록 · 내일 짜기 관리 단계','관리 창이 하나예요: 맨 위 ↕ 정렬(차례 빠른·오래 밀린·짧은·긴·이름·목록별)·거르기·찾기, 줄마다 ○ 했어요 · 오늘/내일/📅 놓기 · ⋯(건너뛰기·다른 날짜로), ☑ 여러 개로 한꺼번에 놓기. 아래에 ✓ 오늘 한 관리·일퀘·🔁 주 N회·⚙',()=>{careSheet76()},'관리 창 합치기 정렬 오래 밀린 순 건너뛰기 다른 날짜 놓기 여러 개'],
  ['⏩ 미루기 (날짜 고르기)','할 일 줄·캘린더 블록 우클릭(폰은 꾹) → ⏩ 미루기…','내일·모레·주말·다음 주·+1주·날짜 고르기 중에서 골라요. 관리의 ⋯ → 📆 다른 날짜로 지정하기도 같은 창이에요',()=>{location.hash='tasks'},'미루기 날짜 고르기 다음 주 우클릭'],
  ['↔ 주 N회 칩 순서','캘린더 위 🔁 칩 줄 → 칩을 꾹 눌러(PC는 그냥) 옆 칩 사이로 끌기','칩 줄 안에서 놓으면 순서가 바뀌고, 시간표·종일 칸에 놓으면 그 날을 정해요',()=>{location.hash='cal'},'주 N회 칩 순서 끌기 정렬']])}})(F67);
}
