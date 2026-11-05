/* ================= v5.8 (v5o) — 스크립트 맨 끝 =================
   · 할 일/습관/일퀘가 같은 '했나?'를 보게 (연결 카드: 몸무게·식사·용기)
   · 행동/습관 보드: 검색·필터·정렬·여러 개 고르기
   · 전투 기록(여정) · 캘린더: 창마다 따로 설정, 월 보기 날짜 누르기=추가 / 두 번=하루 보기, 목록=이모지
   · 목록별 묶기에서 기본함이 둘로 갈리던 것, '🔁 습관 연결' 스마트 목록 정리
   주의: 맨 끝 모듈이라 최상위 값은 var/function만. 행동 카드(C.actions) 내용은 건드리지 않음. */

/* ---- 목록: 없는 목록 id는 기본함으로 (기본함이 '기본함'·'📥 기본함' 둘로 갈리던 원인) ---- */
function listOk(id){return !!id&&C.lists.some(l=>l.id===id)}
function listName(id){const l=C.lists.find(x=>x.id===id)||C.lists.find(x=>x.id==='inbox');return l?l.name:'기본함'}
function listEmoji(id){const m=(listName(listOk(id)?id:'inbox')||'').match(/^\s*([^\p{L}\p{N}\s]+)/u);return m?m[1]:''}
{const i=SMART.findIndex(x=>x[0]==='habit');if(i>=0)SMART.splice(i,1)} // '🔁 습관 연결' → '↻ 습관' 목록이 같은 일을 함

/* ---- 연결 카드(몸무게·식사·용기)의 '오늘 했나?' — 일퀘·할 일·행동/습관이 모두 이걸 봄 ---- */
function linkMet(a,day){if(!a||!a.link)return false;day=day||DAYS[dateKey()];if(!day)return false;return !!questCondMet(day,{action:a.link})}
function doneToday(a){if(!a)return false;if(a.link)return linkMet(a);const d=DAYS[dateKey()];return !!(d&&(d.entries||[]).some(e=>e.kind==='act'&&e.aid===a.id))}
var HLS_BUSY=false;
function habLinkSync(){
  if(HLS_BUSY||!C.mig57||!ready||!tasksReady)return;HLS_BUSY=true;
  try{const td=dateKey(),day=DAYS[td];if(!day)return;
    Object.values(TASKS).forEach(t=>{
      if(!(t.hab&&t.status===0&&t.rep&&t.due&&t.due<=td))return;
      const a=C.actions.find(x=>x.id===t.aid);if(!a||!a.link||!linkMet(a,day))return;
      if((day.entries||[]).some(e=>e.tid===t.id))return;
      const qid=t.qid||('q'+t.id);
      const e=(day.entries||[]).find(x=>x.kind==='quest'&&x.qid===qid&&!x.tid)||(a.link==='@weigh'?(day.entries||[]).find(x=>x.kind==='weigh'&&!x.tid):null);
      if(e){e.tid=t.id;e.prevDue=t.due;e.prevStatus=0;e.prevCnt=t.cnt||0;save(td)}
      t.cnt=(t.cnt||0)+1;t.last=td;let nx=nextDue(t.rep,t.due);while(nx&&nx<=td)nx=nextDue(t.rep,nx);
      if(nx)t.due=nx;else{t.status=2;t.doneAt=td}saveTask(t);
    });
  }catch(x){console.error(x)}finally{HLS_BUSY=false}
}
{const _ue=unapplyEntry;unapplyEntry=function(day,e){_ue(day,e);try{if(e.kind==='weigh'&&e.tid)undoTaskFrom(e)}catch(x){console.error(x)}}}
// 행동/습관 화면: 연결 카드는 연결된 기록으로 체크 표시 · 누르면 그 기록으로
function logLinkMarks(){
  document.querySelectorAll('#actGroups .act[data-info^="act:"]').forEach(r=>{const a=C.actions.find(x=>x.id===r.dataset.info.slice(4));if(!a||!a.link)return;
    const b=r.querySelector('.chk');if(!b)return;const on=linkMet(a);b.classList.toggle('on',on);b.textContent=on?'✓':'';b.title=linkName(a.link);b.dataset.x58link=a.id});
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-x58link]');if(!b)return;e.preventDefault();e.stopPropagation();const a=C.actions.find(x=>x.id===b.dataset.x58link);if(a)linkGo(a)},true);

/* ---- 행동/습관 편집 보드: 목록과 같은 검색·필터·정렬·여러 개 고르기 ---- */
function actBoardHTML(){
  const E=ui.ae||(ui.ae={q:'',type:'all',area:'',sort:'manual'});
  const okType=a=>E.type==='all'?true:E.type==='good'||E.type==='bad'?a.type===E.type:E.type==='habit'?isHabit(a):E.type==='brave'?!!a.brave:true;
  const q=(E.q||'').toLowerCase();
  const st=listStats();let pool=C.actions.filter(a=>!a.doneAt&&okType(a)&&(!q||a.name.toLowerCase().includes(q)));
  if(E.sort&&E.sort!=='manual')pool=sortList(pool,st,E.sort);
  const selOn=!!E.selOn,sel=new Set(E.sel||[]);
  const show=aeShow().filter(k=>k!=='area');
  const chip=a=>{const on=sel.has(a.id);return `<div class="dchip bchip ${a.type} ${on?'on58':''}" ${selOn?'':`data-drag="act:${a.id}" data-dragmode="hold"`} role="button" tabindex="0"><span class="erow3" data-rowid="${a.id}" hidden></span>
    <span class="bn">${selOn?`<input type="checkbox" data-x55sel="${a.id}" ${on?'checked':''} style="width:auto;margin:0 4px 0 0" aria-label="${esc(a.name)} 고르기">`:''}<b aria-label="${a.type==='good'?'좋은':'나쁜'}">${a.type==='good'?'▲':'▼'}</b> <button class="nm57" ${selOn?`data-x55sel="${a.id}"`:`data-aedit="${a.id}"`}>${esc(a.name)}</button></span><span class="mxs">${metaChips(a,st[a.id]||{},show)}</span></div>`};
  const cols=C.areas.filter(ar=>!E.area||ar.id===E.area);
  return `<p class="tiny muted" style="margin:0 0 6px">${selOn?'카드를 눌러 고른 뒤 위에서 한꺼번에 바꿔요.':'카드를 꾹 눌러(PC는 끌어서) 다른 영역 칸에 놓으면 영역이 바뀌어요. 이름을 누르면 편집.'} ▲ 좋은 · ▼ 나쁜. 정렬은 칸 안에서 적용돼요.</p>
  <div class="dedit board57">${cols.map(ar=>{const its=pool.filter(a=>a.area===ar.id);return `<div class="dcol" data-drop="dopa:@a:${ar.id}"><div class="dh"><b>${esc(ar.name)}</b><span class="tiny muted">${its.length}개</span></div>${its.map(chip).join('')||'<span class="tiny muted">없어요</span>'}</div>`}).join('')}</div>`;
}
{const _aeh=actionsEditHTML;actionsEditHTML=function(){
  const on=!!ui.aeBoard;ui.aeBoard=false;let h;try{h=_aeh()}finally{ui.aeBoard=on}if(!on)return h;
  h=h.replace('data-x57board="" aria-pressed="true"','data-x57board="" aria-pressed="false"').replace('data-x57board="1" aria-pressed="false"','data-x57board="1" aria-pressed="true"');
  const i=h.indexOf('<div class="elist"'),j=h.indexOf('<div class="row" style="margin-top:10px"><button class="btn sm" data-addrow="actions"');
  if(i<0||j<0)return h;return h.slice(0,i)+actBoardHTML()+h.slice(j);
}}
// 보드에서도 '보이는 것 모두'
document.addEventListener('click',e=>{const b=e.target.closest('[data-x55="selall"]');if(!b||!ui.aeBoard)return;e.preventDefault();e.stopPropagation();const E=ui.ae||{};
  const vis=[...document.querySelectorAll('.board57 [data-rowid]')].map(r=>r.dataset.rowid);E.sel=(E.sel||[]).length===vis.length?[]:vis;reEdit()},true);

/* ---- 📜 전투 기록 (여정) ---- */
var BLOG_KIND=[['all','모두'],['act','▲▼ 행동'],['task','✓ 할 일'],['bonus','🎁 보너스·보상'],['bad','▼ 나쁜 것만']];
var BLOG_BONUS=['chest','boss','wbrave','badge','chain','quest','routine'];
function blogPass(e,k){if(k==='all')return true;if(k==='act')return e.kind==='act'||e.kind==='free'||isBrave(e);if(k==='task')return e.kind==='task'||!!e.tid;
  if(k==='bonus')return BLOG_BONUS.includes(e.kind)||!!(e.spd||e.mult||e.gq);if(k==='bad')return e.type==='bad';return true}
function blogBonusTxt(e){const o=[];if(e.kind==='chest')o.push('일퀘 상자');if(e.kind==='boss')o.push('보스 처치');if(e.kind==='wbrave')o.push('주간 용기 목표');if(e.kind==='badge')o.push('업적');if(e.kind==='chain')o.push('나쁜 흐름 끊기');
  if(e.kind==='routine')o.push('루틴 완주');if(e.spd)o.push('속도 '+e.spd);if(e.mult&&e.type==='bad')o.push('누적 페널티 ×'+e.mult);if(e.gq)o.push('뽑기 배수');if(isBrave(e))o.push('용기');return o}
function blogHTML(){
  const B=ui.blog||(ui.blog={k:'all',r:7,n:10});
  const keys=(B.r==='all'?Object.keys(DAYS):lastNDates(B.r)).filter(k=>DAYS[k]&&(DAYS[k].entries||[]).length).sort().reverse();
  let tx=0,tg=0,tc=0,tb=0;const days=[];
  keys.forEach(k=>{const es=(DAYS[k].entries||[]).filter(e=>blogPass(e,B.k));if(!es.length)return;days.push([k,es]);es.forEach(e=>{tx+=e.xp||0;tg+=e.gold||0;tc+=e.cond||0;if(blogBonusTxt(e).length)tb++})});
  const row=(k,e)=>{let h=logRow(k,e).replace(/<button class="x" data-rm="[^"]*" data-date="[^"]*"[^>]*>×<\/button>/,'<span></span>').replace(/data-entry="[^"]*" style="cursor:pointer" title="눌러서 고치기"/,'');
    const bt=blogBonusTxt(e);return bt.length?h.replace(/<\/li>$/,`<span class="b58">⤷ 보너스: ${esc(bt.join(' · '))}</span></li>`):h};
  const sum=es=>{const x=es.reduce((s,e)=>s+(e.xp||0),0),g=es.reduce((s,e)=>s+(e.gold||0),0);return `XP +${x}${g?' · '+gtx(g):''}`};
  return `<div class="toolbar"><span class="seg3">${BLOG_KIND.map(([v,l])=>`<button data-x58bk="${v}" aria-pressed="${B.k===v}">${l}</button>`).join('')}</span>
    <span class="seg3">${[[7,'7일'],[30,'30일'],['all','전체']].map(([v,l])=>`<button data-x58br="${v}" aria-pressed="${String(B.r)===String(v)}">${l}</button>`).join('')}</span></div>
    <p class="small" style="margin:4px 0 8px"><b>합계</b> · XP +${tx} · ${gtx(tg)} · 컨디션 ${tc>=0?'+':'−'}${Math.abs(tc)} · 보너스 붙은 기록 ${tb}개 <span class="tiny muted">(${B.r==='all'?'불러온 기록 전체':'최근 '+B.r+'일'})</span></p>
    ${days.slice(0,B.n).map(([k,es])=>`<div class="bday58"><div class="ptitle" style="margin:8px 0 2px"><b class="small">${esc(fmtD(k))} (${wdOf(k)})</b><span class="tiny muted num">${es.length}개 · ${sum(es)}</span></div><ul class="log">${es.slice().sort((a,b)=>(a.t||'').localeCompare(b.t||'')).map(e=>row(k,e)).join('')}</ul></div>`).join('')||'<div class="empty">이 조건에 맞는 기록이 없어요.</div>'}
    ${days.length>B.n?`<button class="btn ghost sm" data-x58bmore="1" style="margin-top:8px">더 보기 (${days.length-B.n}일 남음)</button>`:''}
    <p class="tiny muted" style="margin-top:8px">기록을 고치거나 지우는 건 '기록' 화면(오늘·어제·그저께)에서 해요. 여기는 보기 전용이에요.</p>`;
}
function renderBlog(){const b=$('blog58');if(!b||curView()!=='journey')return;b.innerHTML=blogHTML()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-x58bk],[data-x58br],[data-x58bmore]');if(!b)return;e.preventDefault();e.stopPropagation();const B=ui.blog||(ui.blog={k:'all',r:7,n:10});const d=b.dataset;
  if(d.x58bk)B.k=d.x58bk;if(d.x58br)B.r=d.x58br==='all'?'all':+d.x58br;if(d.x58br||d.x58bk)B.n=10;if(d.x58bmore)B.n+=10;renderBlog()},true);

/* ---- 캘린더: 할 일 창(3단 화면)과 캘린더 창의 보기 설정을 따로 ---- */
function calSplitInstall(){
  // C.ui.cal(저장됨) = 캘린더 창 설정, 그 안의 _t = 할 일 창 옆 캘린더 설정. normConfig가 ui 키를 걸러내서 cal 안에 둠.
  const u=C&&C.ui;if(!u)return;const d=Object.getOwnPropertyDescriptor(u,'cal');if(d&&d.get)return;
  const base=(d&&d.value)||{mode:'month',actual:true};
  if(!base._t||typeof base._t!=='object'){const t=JSON.parse(JSON.stringify(base));delete t._t;Object.defineProperty(base,'_t',{value:t,writable:true,configurable:true,enumerable:true})}
  delete u.cal;
  Object.defineProperty(u,'cal',{get(){return splitOn()?base._t:base},set(v){if(splitOn())base._t=v;else{const t=base._t;Object.keys(base).forEach(k=>delete base[k]);Object.assign(base,v);if(!base._t)base._t=t}},enumerable:false,configurable:true});
  Object.defineProperty(u,'toJSON',{value:function(){return {...this,cal:base}},enumerable:false,configurable:true});
}
// 목록 기준: 색 대신 목록 이모지 (이모지 없는 목록은 앞 두 글자)
{const _rc=renderCal;renderCal=function(){calSplitInstall();_rc();try{
  const sel=$('cal57Color');if(sel){const o=sel.querySelector('option[value="list"]');if(o)o.textContent='표시: 목록 이모지'}
  if((C.ui.cal||{}).color!=='list')return;
  document.querySelectorAll('#calPane [data-ctask]').forEach(el=>{const t=TASKS[el.dataset.ctask];if(!t)return;el.style.borderLeft='';el.style.background='';
    const em=listEmoji(t.list),s=el.querySelector('.ck57');const txt=em||listName(listOk(t.list)?t.list:'inbox').replace(/^[^\p{L}\p{N}]+/u,'').slice(0,2);
    if(s){s.textContent=txt;s.style.borderColor='';s.className='ck58'}else el.insertAdjacentHTML('afterbegin',`<span class="ck58">${esc(txt)}</span>`)});
}catch(e){console.error(e)}}}
// 월 보기: 날짜 한 번 = 그날 할 일 추가 · 두 번 = 하루 보기
var MC58=null;
document.addEventListener('click',e=>{
  const c=e.target.closest('.mc[data-calday]');if(!c||e.target.closest('[data-ctask],button,a,input'))return;
  e.preventDefault();e.stopPropagation();const k=c.dataset.calday;
  if(MC58&&MC58.k===k){clearTimeout(MC58.t);MC58=null;calGoDay(k);return}
  if(MC58)clearTimeout(MC58.t);
  ui.calSel=k;document.querySelectorAll('#calPane .mc.sel').forEach(x=>x.classList.remove('sel'));c.classList.add('sel');
  MC58={k,t:setTimeout(()=>{MC58=null;calAddDay(k)},280)};
},true);
function calGoDay(k){ui.calSel=k;ui.calAnchor=k;C.ui.cal.mode='1day';save('config');ui.calKeepScroll=false;closeSheet();renderCal()}
function calAddDay(k){
  sheetCtx={cal58:{k}};
  openSheet(`<div class="sh"><h3>📅 ${esc(fmtD(k))} (${wdOf(k)}) · 할 일 추가</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <form class="tadd" data-x58caladd="1"><div class="in"><input id="cal58Add" maxlength="160" placeholder="할 일 (3시, #태그, ~목록, !! 도 돼요)" enterkeyhint="done" autocomplete="off"><button class="btn sm" type="submit">추가</button></div></form>
    <div class="row small" style="gap:6px;margin-top:6px"><button class="btn ghost sm" data-x58day="${k}">이 날 하루 보기 →</button><span class="tiny muted">날짜를 두 번 눌러도 하루 보기로 가요.</span></div>`);
  setTimeout(()=>$('cal58Add')&&$('cal58Add').focus(),60);
}
document.addEventListener('submit',e=>{const f=e.target;if(!f.dataset||!f.dataset.x58caladd)return;e.preventDefault();e.stopPropagation();
  const c=(sheetCtx||{}).cal58;const v=$('cal58Add').value.trim();if(!c||!v){$('cal58Add').focus();return}
  const p=parseQuick(v,{baseDate:c.k});if(!p.title)return;if(!p.due)p.due=c.k;if(!p.list)p.list='inbox';
  const a=C.actions.find(x=>x.name===p.title&&x.type==='good');if(a)p.aid=a.id;
  const t=newTask(p);saveTask(t);$('cal58Add').value='';render();toast(`'${t.title}' · ${dueLabel(t.due)}${t.time?' '+t.time:''} 추가 · 계속 적어도 돼요`)},true);
document.addEventListener('click',e=>{const b=e.target.closest('[data-x58day]');if(!b)return;e.preventDefault();e.stopPropagation();calGoDay(b.dataset.x58day)},true);

/* ---- 첫 실행 정리: '🔁 습관' 목록 이름 (윈도에서 파란 네모로 보이던 이모지) ---- */
function mig58(){if(C.mig58||!ready)return;const l=C.lists.find(x=>x.id===HAB_LIST);if(l&&l.name==='\u{1F501} 습관')l.name='\u21BB 습관';C.mig58=1;save('config')}

{const _r=render;render=function(){
  try{calSplitInstall();mig58();habLinkSync()}catch(e){console.error(e)}
  _r();
  try{logLinkMarks();renderBlog()}catch(e){console.error(e)}
}}
addEventListener('hashchange',()=>setTimeout(()=>{try{renderBlog()}catch(e){console.error(e)}},0));
