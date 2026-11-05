/* ================= v5.9: 되살아난 카드 정리 · 행동/습관 화면 배치 · 전투 기록 계산 · 할 일 직접 점수 · 돌아보기 · 보드 부품 · 자연어 ================= */
/* 주의: 맨 끝 모듈이라 최상위 값은 var/function. patch10 글자 치환은 이 모듈엔 안 걸림. */

/* ---- 1) 되살아난 기본 카드 정리 (옛 기기 사본이 지운 카드를 다시 써 넣었던 것) ---- */
function clean59List(){return C.actions.filter(a=>/^d[pq]/.test(a.id)&&a.dopaOnly&&!a.doneAt)}
function clean59HTML(){
  if(C.clean59)return '';const L=clean59List();if(!L.length)return '';
  const S=ui.cl59||(ui.cl59=new Set());
  return `<div class="cleanup59"><b>🧹 되살아난 카드 정리</b><p class="help" style="margin:4px 0 6px">오래 안 연 기기가 옛 사본을 서버에 다시 써서, 지웠던 기본 도파민 카드가 돌아왔을 수 있어요(원인은 v5.9에서 고쳤어요). 처음에 자동으로 들어갔던 카드 ${L.length}개예요. <b>지울 것만 골라요.</b> 기록은 지워지지 않아요.</p>
  <div style="max-height:260px;overflow:auto;columns:2 180px">${L.map(a=>`<label><input type="checkbox" data-cl59="${a.id}" ${S.has(a.id)?'checked':''}>${esc(a.name)} <span class="tiny muted">${esc((dopaC().find(c=>c[0]===a.dopa)||['',''])[1])}</span></label>`).join('')}</div>
  <div class="row" style="gap:6px;margin-top:8px"><button class="btn sm" data-cl59go="1" ${S.size?'':'disabled'}>고른 ${S.size}개 지우기</button><button class="btn ghost sm" data-cl59all="1">${S.size===L.length?'모두 풀기':'모두 고르기'}</button><span style="flex:1"></span><button class="btn ghost sm" data-cl59close="1">닫기 (남은 건 그대로 둘래요)</button></div></div>`;
}
{const _ae59=actionsEditHTML;actionsEditHTML=function(){return clean59HTML()+_ae59.apply(this,arguments)}}
document.addEventListener('change',e=>{const t=e.target;if(!t.dataset||t.dataset.cl59==null)return;e.stopPropagation();const S=ui.cl59||(ui.cl59=new Set());if(t.checked)S.add(t.dataset.cl59);else S.delete(t.dataset.cl59);reEdit()},true);
document.addEventListener('click',e=>{const b=e.target.closest('[data-cl59go],[data-cl59all],[data-cl59close]');if(!b)return;e.preventDefault();e.stopPropagation();const S=ui.cl59||(ui.cl59=new Set());
  if(b.dataset.cl59all){const L=clean59List();if(S.size===L.length)S.clear();else L.forEach(a=>S.add(a.id));reEdit();return}
  if(b.dataset.cl59close){C.clean59=1;save('config');reEdit();return}
  if(b.dataset.cl59go){const ids=[...S];S.clear();delActs(ids);reEdit();return}},true);

/* ---- 2) 행동/습관 화면: 칸 접기 · 순서 · 왼쪽/오른쪽 · 숨기기 (⚡ 용기는 처음엔 접힘) ---- */
var LAY59_NAME={brave:'⚡ 용기',acts:'행동/습관',food:'식사 · 몸무게',log:'오늘 한 일'};
function lay59(){
  let L=Array.isArray(C.logLay59)?C.logLay59.filter(x=>Array.isArray(x)&&LAY59_NAME[x[0]]):[];
  [['brave','L',1,0],['acts','L',0,0],['food','R',0,0],['log','R',0,0]].forEach(d=>{if(!L.some(x=>x[0]===d[0]))L.push([...d])});
  C.logLay59=L;return L;
}
function logPanels59(){const g=(id,f)=>{const el=$(id);return el?(f?el.closest('.panel'):el):null};
  const v=document.querySelector('[data-view="log"]');return {brave:g('bravePanel'),acts:g('actGroups',1),food:v&&v.querySelector('.panel.food'),log:g('log',1)}}
function applyLog59(){
  const v=document.querySelector('[data-view="log"]');if(!v||!C||!C.actions)return;const st=v.querySelectorAll(':scope>.grid2>.stack');if(st.length<2)return;
  const P=logPanels59(),L=lay59(),ed=!!ui.lay59;
  ['L','R'].forEach((col,ci)=>{const want=L.filter(x=>x[1]===col).map(x=>P[x[0]]).filter(Boolean);const have=[...st[ci].children].filter(c=>want.includes(c));
    if(want.length!==have.length||want.some((el,i)=>have[i]!==el))want.forEach(el=>st[ci].appendChild(el))});
  L.forEach(([id,col,fold,hide],i)=>{const el=P[id];if(!el)return;el.dataset.lid=id;el.hidden=!!hide&&!ed;el.classList.toggle('lhide59',!!hide&&ed);el.classList.toggle('lfold59',!!fold);
    const pt=el.querySelector(':scope>.ptitle');if(!pt)return;
    let fb=pt.querySelector('.lfb59');if(!fb){fb=document.createElement('button');fb.className='lfb59';fb.type='button';pt.appendChild(fb)}
    fb.dataset.lf59=id;fb.textContent=fold?'▸ 펴기':'▾';fb.setAttribute('aria-label',fold?'펴기':'접기');fb.title=fold?'펴기':'접기';
    let bar=el.querySelector(':scope>.lay59');
    if(ed){if(!bar){bar=document.createElement('div');bar.className='lay59';pt.after(bar)}
      bar.innerHTML=`<b>${esc(LAY59_NAME[id])}</b><span style="flex:1"></span><button class="chipbtn" data-ly59="up:${id}" aria-label="위로">↑ 위</button><button class="chipbtn" data-ly59="dn:${id}" aria-label="아래로">↓ 아래</button><button class="chipbtn" data-ly59="col:${id}" title="넓은 화면에서 왼쪽·오른쪽 칸 바꾸기">${col==='L'?'⇢ 오른쪽 칸으로':'⇠ 왼쪽 칸으로'}</button><button class="chipbtn" data-ly59="hide:${id}">${hide?'🚫 숨김 · 보이기':'👁 보임 · 숨기기'}</button>`}
    else if(bar)bar.remove()});
  const top=v.querySelector(':scope>.panel .spread');
  if(top&&!$('lay59Btn')){const b=document.createElement('button');b.id='lay59Btn';b.className='btn ghost sm';b.type='button';top.appendChild(b)}
  const lb=$('lay59Btn');if(lb)lb.textContent=ed?'✓ 배치 끝':'▦ 화면 배치';
  let hl=$('lay59Help');if(ed&&!hl&&top){hl=document.createElement('p');hl.id='lay59Help';hl.className='help';hl.style.margin='6px 0 0';hl.textContent='칸마다 위·아래로 순서를, ⇢⇠로 왼쪽·오른쪽 칸(넓은 화면)을, 👁로 숨기기를 정해요. 폰에서는 왼쪽 칸 다음에 오른쪽 칸이 이어져요. ▾를 누르면 그 칸을 접어요.';top.parentElement.appendChild(hl)}
  else if(!ed&&hl)hl.remove();
  // 몸 기록 바로 가기 (식사·몸무게 칸)
  if(P.food){const pt=P.food.querySelector(':scope>.ptitle');if(pt&&!pt.querySelector('.body59')){const a=document.createElement('a');a.className='small body59';a.href='#body';a.style.color='var(--accent)';a.style.marginLeft='8px';a.textContent='📈 몸 기록';const ed2=pt.querySelector('a');if(ed2)ed2.after(a);else pt.appendChild(a)}}
}
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-lf59],[data-ly59],#lay59Btn');
  const h2=!b&&!ui.lay59&&e.target.closest('[data-view="log"] .panel[data-lid]>.ptitle>h2');
  if(!b&&!h2)return;e.preventDefault();e.stopPropagation();const L=lay59();
  if(h2){const id=h2.closest('.panel').dataset.lid,it=L.find(x=>x[0]===id);if(it){it[2]=it[2]?0:1;save('config');applyLog59()}return}
  if(b.id==='lay59Btn'){ui.lay59=!ui.lay59;applyLog59();return}
  if(b.dataset.lf59){const it=L.find(x=>x[0]===b.dataset.lf59);if(it){it[2]=it[2]?0:1;save('config');applyLog59()}return}
  const [op,id]=b.dataset.ly59.split(':');const it=L.find(x=>x[0]===id);if(!it)return;
  if(op==='hide')it[3]=it[3]?0:1;
  else if(op==='col'){it[1]=it[1]==='L'?'R':'L';const rest=L.filter(x=>x!==it);rest.push(it);C.logLay59=rest}
  else{const same=L.filter(x=>x[1]===it[1]),i=same.indexOf(it),j=op==='up'?i-1:i+1;if(j<0||j>=same.length)return;const o=same[j],a=L.indexOf(it),c=L.indexOf(o);L[a]=o;L[c]=it}
  save('config');applyLog59()},true);

/* ---- 3) 📜 전투 기록: 줄마다 점수 계산 ---- */
function sc59(x,g,c){const s=(n,ic)=>{n=Math.round(+n||0);return n?`${ic}${n>0?'+':'−'}${Math.abs(n)}`:''};return [s(x,'⭐'),s(g,'💰'),s(c,'❤')].filter(Boolean).join(' ')||'0'}
function base59(x,g,c){return [x?'⭐'+x:'',g?'💰'+g:'',c?'❤'+c:''].filter(Boolean).join(' ')||'0점'}
function calc59(e){
  const out=[];let note='';
  if(e.kind==='act'){
    const a=C.actions.find(x=>x.id===e.aid);if(!a)return '카드가 지워져서 계산을 다시 보여줄 수 없어요 · 받은 점수는 그대로예요';
    const v=(a.opts||[]).find(o=>o.id===e.vid),pick=f=>(v&&v[f]!=null&&v[f]!=='')?Math.abs(+v[f]):Math.abs(+a[f]||0),n=e.n||1,good=a.type==='good';
    const bx=good?pick('xp'):0,bg=pick('gold'),bc=pick('cond');
    out.push(`카드${v?' · '+esc(v.name):''} <b>${good?base59(bx,bg,bc):[bc?'❤−'+bc:'',bg?'💰−'+bg:''].filter(Boolean).join(' ')||'0점'}</b>`);
    if(n>1)out.push(`× ${n}번`);
    if(good){const gm=+((C.gacha||{}).mult)||1.5,pre=e.gq?Math.round(e.xp/gm):e.xp,d=pre-bx*n;
      if(e.spd&&d)out.push(`+ ${esc(e.spd)} 보너스 ⭐${d}`);else if(d)out.push(`${d>0?'+':'−'} ⭐${Math.abs(d)} <span class="tiny">(회복 모드 배수였거나, 그 뒤 카드 점수가 바뀜)</span>`);
      if(e.gq)out.push(`× ${gm} 🎲 뽑기 퀘스트`);
      if(Math.abs(e.gold||0)!==bg*n||Math.abs(e.cond||0)!==bc*n)note=' · 카드 점수가 그 뒤 바뀌어서 지금 카드와 달라요';}
    else{if(e.mult)out.push(`× 누적 ${e.mult} <span class="tiny">(7일 안 같은 행동·나쁜 날 연속일수록 커져요)</span>`);
      const wg=Math.round(bg*n*(e.mult||1)),hg=Math.abs(e.gold||0);
      if(Math.abs(e.cond||0)!==Math.round(bc*n*(e.mult||1))||hg>wg)note=' · 카드 점수가 그 뒤 바뀌어서 지금 카드와 달라요';else if(hg<wg)note=` · 💰는 가진 골드(${hg})까지만 빠져요`;}
    if(e.brave)out.push(`⚔ 용기 +${e.pts||1}점`);
  }else if(e.kind==='task'){
    const t=e.tid&&TASKS[e.tid],X=C.taskXP||{};
    if(t&&t.px)out.push(`직접 정한 점수 <b>${base59(+t.px.xp||0,+t.px.gold||0,+t.px.cond||0)}</b>`);
    else if(t){const ef=effortOf(t),en={quick:'퀵',mid:'보통',heavy:'큰'}[ef]||ef,px=+((X.prio||{})[t.prio||0])||0;
      out.push(`크기 ${en} ⭐${+X[ef]||10}${px?` + 중요도 ⭐${px}`:''}`,'💰 = ⭐÷3',`❤ = 크기별(${en} ${ef==='quick'?2:ef==='heavy'?6:4})`)}
    else out.push('할 일 크기·중요도 점수 <span class="tiny">(할 일이 지워져 자세한 건 몰라요)</span>');
    if((e.n||1)>1)out.push(`× ${e.n}번`);
    if(e.ontime)out.push(`+ 제때 ⭐${+X.onTime||0}`);
    if(e.spd)out.push(`+ ${esc(e.spd)} 보너스`);if(e.gq)out.push('× 🎲 뽑기');
  }else if(e.kind==='courage'){
    const k=e.cid&&e.cid!=='free'&&(C.courage||[]).find(x=>x.id===e.cid);
    out.push(k?`⚡ 용기 버튼 '${esc(k.name)}' <b>${base59(+k.xp||0,+k.gold||0,Math.abs(+k.cond||0))}</b>`:`⚡ 용기 (크기별 점수)`,`용기 점수 +${e.pts||1}`);
  }else{
    const M={quest:'일퀘 자체 점수 (일퀘는 상자 보너스용이라 보통 0)',chest:`일퀘를 다 채운 날 상자 · 규칙 <b>${base59(+C.dailyBonus.xp||0,+C.dailyBonus.gold||0,0)}</b>`,boss:'주간 보스 처치 보너스',wbrave:'주간 용기 목표 달성 보너스',badge:'업적 보너스',
      weigh:`몸무게 기록 보너스 · 규칙 ⭐${+((C.weight||{}).xp)||0}`,routine:'루틴 완주 보너스 (단계마다 카드 점수는 따로 들어가요)',free:"'그냥 한 일' 프리셋 점수",happy:`✨ 행복 기록 · 규칙 <b>${base59(+C.happy.xp||0,+C.happy.gold||0,+C.happy.cond||0)}</b>`,
      chain:'나쁜 흐름 끊기 · 끊은 연쇄 일수 × 규칙 점수',buy:'상점·뽑기에서 쓴 골드',jar:'구슬만 넣음 (점수 없음)',food:'식사 기록 점수'};
    if(M[e.kind])out.push(M[e.kind]);
  }
  if(e.dur)out.push(`⏱ ${e.dur}분${e.st?` (${esc(e.st)} 시작)`:''}`);
  if(e.jar)out.push('구슬 '+((e.mn||1)>1?e.mn+'개':'1개'));
  if(!out.length)return '';
  return out.join(' → ')+` = <b>${sc59(e.xp,e.gold,e.cond)}</b>${note}`;
}
var BONUS59=['chest','boss','wbrave','badge','chain','quest'];
function blogHTML(){
  const B=ui.blog||(ui.blog={k:'all',r:7,n:10,calc:true});if(B.calc==null)B.calc=true;
  const keys=(B.r==='all'?Object.keys(DAYS):lastNDates(B.r)).filter(k=>DAYS[k]&&(DAYS[k].entries||[]).length).sort().reverse();
  let tx=0,tg=0,tc=0,tb=0,bx=0;const days=[];
  keys.forEach(k=>{const es=(DAYS[k].entries||[]).filter(e=>blogPass(e,B.k));if(!es.length)return;days.push([k,es]);es.forEach(e=>{tx+=e.xp||0;tg+=e.gold||0;tc+=e.cond||0;if(BONUS59.includes(e.kind)){tb++;bx+=e.xp||0}})});
  const row=(k,e)=>{let h=logRow(k,e).replace(/<button class="x" data-rm="[^"]*" data-date="[^"]*"[^>]*>×<\/button>/,'<span></span>').replace(/data-entry="[^"]*" style="cursor:pointer" title="눌러서 고치기"/,'');
    const c=B.calc?calc59(e):'';return c?h.replace(/<\/li>$/,`<span class="calc59">${c}</span></li>`):h};
  const sum=es=>{const x=es.reduce((s,e)=>s+(e.xp||0),0),g=es.reduce((s,e)=>s+(e.gold||0),0),c=es.reduce((s,e)=>s+(e.cond||0),0),bo=es.filter(e=>BONUS59.includes(e.kind)).reduce((s,e)=>s+(e.xp||0),0);return `${sc59(x,g,c)}${bo?` · 그중 보너스 ⭐${bo}`:''}`};
  return `<div class="toolbar"><span class="seg3">${BLOG_KIND.map(([v,l])=>`<button data-x58bk="${v}" aria-pressed="${B.k===v}">${l}</button>`).join('')}</span>
    <span class="seg3">${[[7,'7일'],[30,'30일'],['all','전체']].map(([v,l])=>`<button data-x58br="${v}" aria-pressed="${String(B.r)===String(v)}">${l}</button>`).join('')}</span>
    <button class="chipbtn" data-x59calc="1" aria-pressed="${!!B.calc}">${B.calc?'☑':'☐'} 계산 보기</button></div>
    <p class="small" style="margin:4px 0 2px"><b>합계</b> · ${sc59(tx,tg,tc)} · 보너스 ${tb}번(⭐${bx}) <span class="tiny muted">(${B.r==='all'?'불러온 기록 전체':'최근 '+B.r+'일'})</span></p>
    <p class="tiny muted" style="margin:0 0 8px">⭐ XP = 성장(레벨) · 💰 골드 = 현실의 돈·자원 · ❤ 컨디션 = 지금의 몸과 마음. 계산은 <b>지금 카드·규칙</b>으로 다시 풀어 쓴 거라, 그 뒤 점수를 바꿨으면 표시해 둬요.</p>
    ${days.slice(0,B.n).map(([k,es])=>`<div class="bday58"><div class="ptitle" style="margin:8px 0 2px"><b class="small">${esc(fmtD(k))} (${wdOf(k)})</b><span class="tiny muted num">${es.length}개 · ${sum(es)}</span></div><ul class="log">${es.slice().sort((a,b)=>(a.t||'').localeCompare(b.t||'')).map(e=>row(k,e)).join('')}</ul></div>`).join('')||'<div class="empty">이 조건에 맞는 기록이 없어요.</div>'}
    ${days.length>B.n?`<button class="btn ghost sm" data-x58bmore="1" style="margin-top:8px">더 보기 (${days.length-B.n}일 남음)</button>`:''}
    <p class="tiny muted" style="margin-top:8px">기록을 고치거나 지우는 건 '행동/습관' 화면(오늘·어제·그저께)에서 해요. 여기는 보기 전용이에요.</p>`;
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-x59calc]');if(!b)return;e.preventDefault();e.stopPropagation();const B=ui.blog||(ui.blog={k:'all',r:7,n:10});B.calc=!B.calc;renderBlog()},true);

/* ---- 4) 할 일 점수 직접 정하기 (카드와 연결 안 된 할 일) ---- */
{const _tb59=taskBase;taskBase=function(t){const b=_tb59(t);if(t&&t.px&&!t.aid&&!t.rid)return {...b,xp:Math.max(0,+t.px.xp||0),gold:Math.max(0,+t.px.gold||0),cond:Math.max(0,+t.px.cond||0)};return b}}
function px59Inject(){
  const t=sheetCtx&&sheetCtx.task&&TASKS[sheetCtx.task];if(!t)return;const btn=document.querySelector('#sheetC [data-tseff]');if(!btn)return;
  const seg=btn.closest('.seg')||btn.parentElement;if(!seg||seg.parentElement.querySelector('.px59'))return;
  const d=document.createElement('div');d.className='px59';
  if(t.aid){const a=C.actions.find(x=>x.id===t.aid);d.innerHTML=`<span class="tiny muted">🃏 '${esc(a?a.name:'카드')}' 카드와 연결돼 있어서 점수는 카드에서 정해요.</span>`}
  else{const save0=t.px;delete t.px;const auto=taskBase(t);if(save0)t.px=save0;
    d.innerHTML=t.px?`<b class="small">직접 정한 점수</b> <label>⭐<input type="number" min="0" max="999" data-px59="xp" value="${+t.px.xp||0}" aria-label="XP"></label><label>💰<input type="number" min="0" max="999" data-px59="gold" value="${+t.px.gold||0}" aria-label="골드"></label><label>❤<input type="number" min="0" max="99" data-px59="cond" value="${+t.px.cond||0}" aria-label="컨디션"></label><button class="chipbtn" data-px59off="1">자동으로 (크기·중요도)</button>`
      :`<span class="tiny muted">지금 점수: <b>${base59(auto.xp,auto.gold,auto.cond)}</b> (크기·중요도로 자동${t.due?' · 제때 하면 보너스':''})</span><button class="chipbtn" data-px59on="1">✎ 직접 정하기</button>`}
  seg.after(d);
}
{const _dts59=drawTaskSheet;drawTaskSheet=function(){const r=_dts59.apply(this,arguments);try{px59Inject()}catch(e){console.error(e)}return r}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-px59on],[data-px59off]');if(!b)return;e.preventDefault();e.stopPropagation();const t=sheetCtx&&TASKS[sheetCtx.task];if(!t)return;
  if(b.dataset.px59on){const a=taskBase(t);t.px={xp:a.xp,gold:a.gold,cond:a.cond}}else delete t.px;saveTask(t);drawTaskSheet()},true);
document.addEventListener('change',e=>{const i=e.target;if(!i.dataset||!i.dataset.px59)return;e.stopPropagation();const t=sheetCtx&&TASKS[sheetCtx.task];if(!t||!t.px)return;t.px[i.dataset.px59]=Math.max(0,Math.round(+i.value||0));saveTask(t)},true);

/* ---- 5) 돌아보기: 이번 주 · 통계 · 여정 · 몸 기록 (왼쪽 메뉴는 새 방식/예전 방식 고르기) ---- */
if(!VIEWS.includes('review'))VIEWS.push('review');
ICONS.review='<path d="M4 5h16v14H4zM4 9h16M8 3v4M16 3v4M8 13l2 2 4-4"/>';
{const i=NAV_ITEMS.findIndex(n=>n[0]==='stats');if(!NAV_ITEMS.some(n=>n[0]==='review'))NAV_ITEMS.splice(i<0?NAV_ITEMS.length:i,0,['review','돌아보기','이번 주 돌아보기·통계·여정·몸 기록'])}
var RV59_FAM=['review','stats','journey','body'],RV59_HIDE=['stats','journey','body','jars'];
function navNew59(){return C.nav59!=='old'}
{const _rn59=renderNav;renderNav=function(){_rn59();try{
  const sd=$('side');if(!sd||!navNew59())return;const cur=curView();
  RV59_HIDE.forEach(id=>{const a=sd.querySelector(`a[href="#${id}"]`);if(a)a.remove()});
  const r=sd.querySelector('a[href="#review"]');if(r&&RV59_FAM.includes(cur))r.setAttribute('aria-current','page');
}catch(e){console.error(e)}}}
function rvTabs59(){const cur=curView();return `<nav class="rvtabs59" aria-label="돌아보기">${[['review','📅 이번 주'],['stats','📊 통계'],['journey','🗺 여정 · 📜 전투 기록'],['body','⚖ 몸 기록']].map(([v,l])=>`<a href="#${v}" aria-current="${cur===v?'page':'false'}">${l}</a>`).join('')}</nav>`}
function placeTabs59(){RV59_FAM.forEach(v=>{const s=document.querySelector(`.view[data-view="${v}"]`);if(!s)return;let n=s.querySelector(':scope>.rvtabs59');const h=rvTabs59();if(!n){s.insertAdjacentHTML('afterbegin',h)}else if(n.outerHTML!==h)n.outerHTML=h})}
function habRows59(){return openTasks().filter(t=>t.hab&&t.aid&&t.rep&&t.rep.f).map(t=>[t,C.actions.find(a=>a.id===t.aid)]).filter(x=>x[1])}
function sched59(t,k){const r=t.rep;if(r.until&&k>r.until)return false;if(r.f==='d')return (+r.i||1)===1?true:((diffDays(k,t.created||k)%(+r.i||1))===0);if(r.f==='w')return (r.wd&&r.wd.length?r.wd:[dowOf(t.due||k)]).includes(dowOf(k));if(r.f==='m')return (r.md||[]).includes(+k.slice(8))||((r.md||[]).includes(-1)&&addDays(k,1).slice(8)==='01');if(r.f==='x')return false;return false}
function did59(t,a,k){const d=DAYS[k];if(!d)return false;if(a.link)return linkMet(a,d);return (d.entries||[]).some(e=>e.aid===a.id||e.tid===t.id)}
function wk59(ws){let xp=0,gold=0,cond=0,brave=0,bpts=0,bad=0,good=0,act=0;for(let i=0;i<7;i++){const d=DAYS[addDays(ws,i)];(d&&d.entries||[]).forEach(e=>{xp+=e.xp||0;if(e.kind!=='buy')gold+=e.gold||0;cond+=e.cond||0;if(isBrave(e)){brave++;bpts+=e.pts||0}if(e.kind==='act'&&e.type==='bad')bad++;if((e.kind==='act'&&e.type==='good')||e.kind==='task'||e.kind==='free')good++})}return {xp,gold,cond,brave,bpts,bad,good}}
function reviewHTML59(){
  const off=ui.rv59||0,td=dateKey(),ws=addDays(weekStart(td),-7*off),pw=addDays(ws,-7),W=wk59(ws),Pw=wk59(pw),days=[...Array(7)].map((_,i)=>addDays(ws,i));
  const cmp=(lbl,a,b,good=true,fmt=x=>x)=>{const d=a-b;return `<div><span class="tiny muted">${lbl}</span><b class="num">${fmt(a)}</b><span class="tiny ${d===0?'muted':''}">지난주 ${fmt(b)} · ${d===0?'같음':(d>0?'▲ ':'▼ ')+Math.abs(d)}${d&&(good?d>0:d<0)?' 👍':''}</span></div>`};
  const hr=habRows59();
  const habs=hr.length?`<div class="wk59"><span></span>${days.map(k=>`<span class="dh">${wdOf(k)}</span>`).join('')}<span class="dh">지킨 날</span>
    ${hr.map(([t,a])=>{let s=0,dn=0;const cells=days.map(k=>{const sc=sched59(t,k),dd=did59(t,a,k);if(sc&&k<=td)s++;if(dd)dn++;return k>td?'<span class="c"></span>':dd?'<span class="c y" title="함">✓</span>':sc?'<span class="c n" title="못 함">·</span>':'<span class="c"></span>'}).join('');
      return `<span class="nm" title="${esc(a.name)}">${esc(a.name)}</span>${cells}<span class="num small" style="text-align:right">${dn}/${s||'-'}</span>`}).join('')}</div>
    <p class="tiny muted" style="margin:6px 0 0">✓ 한 날 · '·' 할 날인데 못 한 날 · 빈칸은 쉬는 날. 반복이 '주 N회'인 습관은 한 날만 세요.</p>`:'<div class="empty">↻ 습관이 아직 없어요. 행동 카드 편집의 \'반복\'에서 매일·요일을 정하면 여기에 떠요.</div>';
  const fit={};Object.entries(C.dopaFit||{}).forEach(([aid,st])=>{const o=fit[aid]={g:0,n:0,b:0};Object.values(st||{}).forEach(f=>{o.g+=f.g||0;o.n+=f.n||0;o.b+=f.b||0})});
  const dtop=Object.entries(fit).map(([aid,o])=>[C.actions.find(a=>a.id===aid),o]).filter(x=>x[0]&&x[1].n).sort((a,b)=>b[1].g-a[1].g||b[1].n-a[1].n).slice(0,6);
  const braveCards=C.actions.filter(a=>a.brave&&!a.doneAt).length;
  const notes=C.wnote59||{};
  return `<div class="panel"><div class="ptitle"><h2>📅 ${off?off===1?'지난주':off+'주 전':'이번 주'} 돌아보기</h2><span class="row" style="gap:4px"><button class="chipbtn" data-rv59="1" aria-label="한 주 전">‹ 전 주</button><span class="tiny muted">${esc(fmtD(ws))}–${esc(fmtD(addDays(ws,6)))}</span>${off?'<button class="chipbtn" data-rv59="-1" aria-label="다음 주">다음 주 ›</button>':''}</span></div>
    <div class="cmp59">${cmp('⭐ XP',W.xp,Pw.xp)}${cmp('💰 골드',W.gold,Pw.gold)}${cmp('⚡ 용기',W.brave,Pw.brave)}${cmp('▲ 좋은 행동·할 일',W.good,Pw.good)}${cmp('▼ 나쁜 행동',W.bad,Pw.bad,false)}${cmp('❤ 컨디션 변화',W.cond,Pw.cond)}</div></div>
  <div class="grid2"><div class="stack">
    <div class="panel"><div class="ptitle"><h2>↻ 습관 지킨 날</h2><a class="small" href="#tasks" data-x59hab="1" style="color:var(--accent)">↻ 습관 목록</a></div>${habs}</div>
    <div class="panel"><div class="ptitle"><h2>✍ 이번 주 한 줄</h2></div><textarea id="wn59" data-wk="${ws}" rows="3" maxlength="400" placeholder="잘 된 것 하나, 다음 주에 바꿀 것 하나">${esc(notes[ws]||'')}</textarea>
      ${Object.keys(notes).filter(k=>k!==ws&&notes[k]).sort().reverse().slice(0,4).map(k=>`<p class="small" style="margin:6px 0 0"><span class="tiny muted">${esc(fmtD(k))} 주</span> ${esc(notes[k])}</p>`).join('')}</div>
  </div><div class="stack">
    <div class="panel"><div class="ptitle"><h2>🍬 해보니 좋았던 도파민</h2><span class="tiny muted">지금까지 👍 순</span></div>${dtop.length?`<div class="rank">${dtop.map(([a,o])=>`<div class="spread small" style="padding:3px 0"><span>${esc(a.name)}</span><span class="num muted">👍 ${o.g} · 👎 ${o.b} · 해본 ${o.n}번</span></div>`).join('')}</div>`:'<div class="empty">아직 👍😐👎 기록이 없어요. 🍬 지금 어때?에서 해본 뒤 눌러요.</div>'}</div>
    <div class="panel"><div class="ptitle"><h2>⚔ 용기</h2></div><p class="small" style="margin:0">이번 주 용기 ${W.brave}번 · 용기 점수 ${W.bpts}.${braveCards?` ⚔ 용기 카드 ${braveCards}개.`:` <b>⚔ 용기 카드가 아직 없어요.</b> 매주 하고 싶은 '무서운 일'을 카드로 만들어 두면 여기서 같이 세요.`}</p>${braveCards?'':'<a class="btn ghost sm" href="#edit" data-goedit="actions" style="margin-top:6px;display:inline-block">행동 카드에 ⚔ 붙이러 가기</a>'}</div>
  </div></div>
  <div class="panel"><div class="ptitle"><h2>왼쪽 메뉴</h2></div><div class="row" style="gap:6px;align-items:center"><button class="chipbtn" data-nav59="new" aria-pressed="${navNew59()}">${navNew59()?'● ':'○ '}돌아보기로 묶기</button><button class="chipbtn" data-nav59="old" aria-pressed="${!navNew59()}">${navNew59()?'○ ':'● '}예전처럼 따로</button></div>
    <p class="help" style="margin:6px 0 0">'돌아보기로 묶기'는 통계·여정·몸 기록을 이 화면 위 탭으로 모으고, 유리병은 홈의 작은 칸으로 보여줘요(유리병 화면은 홈 칸의 '열기'로). 기능은 하나도 안 지워요. '예전처럼'을 누르면 원래 메뉴로 돌아가요.</p></div>`;
}
function renderReview59(){placeTabs59();if(curView()!=='review')return;const b=$('review59');if(!b)return;if(b.contains(document.activeElement)&&document.activeElement.id==='wn59')return;b.innerHTML=reviewHTML59()}
function nav59Set(m){
  const h=C.ui.home.find(x=>x[0]==='jars');
  if(m==='new'){C.nav59='new';if(h&&!h[1]){C.nav59j=1;h[1]=1}}
  else{C.nav59='old';if(h&&C.nav59j){h[1]=0;delete C.nav59j}}
  save('config');render();renderReview59();toast(m==='new'?'통계·여정·몸 기록을 돌아보기로 묶었어요':'예전 메뉴로 돌렸어요')}
document.addEventListener('click',e=>{const b=e.target.closest('[data-rv59],[data-nav59],[data-x59hab]');if(!b)return;
  if(b.dataset.x59hab){const l=C.lists.find(x=>x.id===HAB_LIST);if(l){C.ui.tasks.sel='l:'+l.id;save('config')}return}
  e.preventDefault();e.stopPropagation();
  if(b.dataset.rv59){ui.rv59=Math.max(0,(ui.rv59||0)+(+b.dataset.rv59));renderReview59();return}
  if(b.dataset.nav59)nav59Set(b.dataset.nav59)},true);
document.addEventListener('input',e=>{if(e.target.id!=='wn59')return;const ws=e.target.dataset.wk;C.wnote59=C.wnote59||{};const v=e.target.value.trim();if(v)C.wnote59[ws]=v;else delete C.wnote59[ws];clearTimeout(ui.wn59T);ui.wn59T=setTimeout(()=>save('config'),600)});
function mig59(){if(!ready||C.mig59)return;C.mig59=1;if(C.nav59==null)nav59Set('new');else save('config')}

/* ---- 6) 보드 공용 부품: 행동/습관 보드와 도파민 메뉴 보드가 같은 칩 · 칸 안 순서 끌기 ---- */
function kbChip59(a,o){
  const st=o.st||{},show=o.show||aeShow().filter(k=>k!=='area'),on=o.sel&&o.sel.has(a.id);
  const drag=o.noDrag?'':`data-drag="act:${a.id}" data-dragmode="hold"`;
  const pick=o.dopa?`data-dselchip="${a.id}" aria-pressed="${!!on}"`:'';
  const box=o.dopa?`<span class="dck" aria-hidden="true">${on?'☑':'☐'}</span> `:(o.selOn?`<input type="checkbox" data-x55sel="${a.id}" ${on?'checked':''} style="width:auto;margin:0 4px 0 0" aria-label="${esc(a.name)} 고르기">`:'');
  const nm=o.dopa?`<button class="nm57" data-aeditchip="${a.id}" ${drag} title="편집 · 꾹 눌러 끌기">${esc(a.name)}</button>`:`<button class="nm57" ${o.selOn?`data-x55sel="${a.id}"`:`data-aedit="${a.id}" ${drag}`}>${esc(a.name)}</button>`;
  const extra=o.dopa&&a.dur?`<span class="mx" title="걸리는 시간">⏱ ${a.dur}분</span>`:'';
  return `<div class="dchip bchip ${a.type} ${on?'on58 on':''}" ${drag} ${pick} role="button" tabindex="0"><span class="erow3" data-rowid="${a.id}" hidden></span><span class="bn">${box}<b aria-label="${a.type==='good'?'좋은':'나쁜'}">${a.type==='good'?'▲':'▼'}</b> ${nm}</span><span class="mxs">${extra}${metaChips(a,st[a.id]||{},show)}</span></div>`;
}
function actBoardHTML(){
  const E=ui.ae||(ui.ae={q:'',type:'all',area:'',sort:'manual'});
  const okType=a=>E.type==='all'?true:E.type==='good'||E.type==='bad'?a.type===E.type:E.type==='habit'?isHabit(a):E.type==='brave'?!!a.brave:true;
  const q=(E.q||'').toLowerCase();const st=listStats();let pool=C.actions.filter(a=>!a.doneAt&&okType(a)&&(!q||a.name.toLowerCase().includes(q)));
  const manual=!E.sort||E.sort==='manual';if(!manual)pool=sortList(pool,st,E.sort);
  const selOn=!!E.selOn,sel=new Set(E.sel||[]),cols=C.areas.filter(ar=>!E.area||ar.id===E.area);
  return `<p class="tiny muted" style="margin:0 0 6px">${selOn?'카드를 눌러 고른 뒤 위에서 한꺼번에 바꿔요.':`카드를 꾹 눌러(PC는 끌어서) 다른 칸에 놓으면 영역이 바뀌어요.${manual?' 같은 칸 안에서 놓으면 순서가 바뀌어요.':' (정렬 중이라 칸 안 순서는 못 바꿔요 · 정렬을 \'기본 순서\'로)'}`} 이름을 누르면 편집. ▲ 좋은 · ▼ 나쁜.</p>
  <div class="dedit board57">${cols.map(ar=>{const its=pool.filter(a=>a.area===ar.id);return `<div class="dcol" data-drop="dopa:@a:${ar.id}" data-kb59="${manual?'act':''}"><div class="dh"><b>${esc(ar.name)}</b><span class="tiny muted">${its.length}개</span></div>${its.map(a=>kbChip59(a,{st,sel,selOn,noDrag:selOn})).join('')||'<span class="tiny muted">없어요</span>'}</div>`}).join('')}</div>`;
}
function dopaEditHTML(){
  const q=normN(ui.dq||''),S=ui.dsel||(ui.dsel=new Set()),st=listStats(),srt=ui.dsort59||'manual',manual=srt==='manual';
  const sorted=l=>manual?l:sortList(l,st,srt);const show=aeShow().filter(k=>k!=='area');
  const pool=sorted(C.actions.filter(a=>a.type==='good'&&!a.dopa&&!a.doneAt&&(!q||normN(a.name).includes(q))));
  const cs=dopaC(),inQ=a=>!q||normN(a.name).includes(q);
  return `<p class="help">행동/습관 보드와 같은 칩이에요. <b>눌러서 여러 개 고른 뒤</b> 아래 막대로 한꺼번에 옮기거나 빼요. 끌어도 돼요(폰은 꾹 눌러 끌기). ${manual?'같은 코스 안에서 놓으면 순서가 바뀌어요. ':''}이름을 누르면 편집, 코스 이름·설명은 바로 고쳐 써요.</p>
  <div class="toolbar" style="margin-bottom:6px"><input id="dopaQ" type="search" placeholder="🔍 찾기 (모든 칸)" value="${esc(ui.dq||'')}" autocomplete="off" style="max-width:220px">
    <select id="dsort59" aria-label="칸 안 정렬">${SORTS.map(([v,l])=>`<option value="${v}" ${srt===v?'selected':''}>${l}</option>`).join('')}</select></div>
  ${S.size?`<div class="bulkbar dbar"><b>☑ ${S.size}개</b><select id="dselMove" aria-label="코스로 옮기기"><option value="">코스로 옮기기…</option>${cs.map(([k,l])=>`<option value="${k}">${esc(l)}</option>`).join('')}</select><button class="btn ghost sm" data-dselact="out">메뉴에서 빼기</button><button class="btn ghost sm" data-dselact="all">이 화면 모두</button><button class="btn ghost sm" data-dselact="clear">해제</button></div>`:''}
  <div class="dedit board57">${cs.map(([co,nm,ds])=>{const its=sorted(C.actions.filter(a=>a.dopa===co&&inQ(a)));return `<div class="dcol" data-drop="dopa:${co}" data-kb59="${manual?'dopa':''}"><div class="dh"><input class="dcoin" data-dco="${co}" data-f="name" value="${esc(nm)}" aria-label="코스 이름"><input class="dcoin tiny" data-dco="${co}" data-f="desc" value="${esc(ds)}" placeholder="설명" aria-label="코스 설명"><span class="tiny muted">${its.length}개</span></div>${its.map(a=>kbChip59(a,{st,sel:S,dopa:true,show})).join('')||'<span class="tiny muted">여기로 끌어 놓기</span>'}<div class="row" style="gap:4px;margin-top:auto"><button class="btn sm ghost" data-dopanew="${co}">＋ 새 항목</button><span style="flex:1"></span><button class="btn sm ghost" data-dcodel="${co}" title="코스 지우기 (항목은 습관 칸으로)">코스 지우기</button></div></div>`}).join('')}
    <div class="dcol add"><button class="btn ghost" data-dcoadd="1" style="margin:auto">＋ 코스 추가</button></div>
    <div class="dcol pool" data-drop="dopa:"><div class="dh"><b>▲ 코스에 안 든 좋은 행동</b><span class="tiny muted">${pool.length}개</span></div>${pool.map(a=>kbChip59(a,{st,sel:S,dopa:true,show})).join('')}</div></div>`;
}
document.addEventListener('change',e=>{if(e.target.id!=='dsort59')return;e.stopPropagation();ui.dsort59=e.target.value;reEdit()},true);
// 칸 안 순서: 끌 때 칩 사이에 줄을 그리고, 놓으면 C.actions 순서를 바꿈 (그다음 원래 처리: 영역·코스 바꾸기)
{const _dm59=dndMove;dndMove=function(x,y,fs){_dm59(x,y,fs);try{
  if(DND.kind!=='act'||!DND.drop||DND.drop.type!=='dopa')return;
  DND.ghost&&(DND.ghost.style.display='none');const under=document.elementFromPoint(x,y);DND.ghost&&(DND.ghost.style.display='');
  const col=under&&under.closest('.dcol[data-kb59]');if(!col||!col.dataset.kb59)return;
  const moving=new Set(ui.dsel&&ui.dsel.has(DND.id)&&ui.dsel.size>1&&col.dataset.kb59==='dopa'?[...ui.dsel]:[DND.id]);
  const chips=[...col.querySelectorAll(':scope>[data-drag^="act:"]')].filter(c=>!moving.has(c.dataset.drag.slice(4)));
  let before=null;for(const c of chips){const r=c.getBoundingClientRect();if(y<r.top+r.height/2){before=c;break}}
  const ind=document.createElement('div');ind.className='insline';if(before)col.insertBefore(ind,before);else if(chips.length)chips[chips.length-1].after(ind);else return;
  if(DND.ind&&DND.ind!==ind)DND.ind.remove();DND.ind=ind;
  DND.drop.kb={before:before?before.dataset.drag.slice(4):null,last:chips.length?chips[chips.length-1].dataset.drag.slice(4):null,ids:[...moving]};
}catch(e){console.error(e)}}}
{const _de59=dndEnd;dndEnd=function(x,y){try{const d=DND.drop;if(DND.kind==='act'&&d&&d.type==='dopa'&&d.kb){const {before,last,ids}=d.kb;
  const mv=ids.map(id=>C.actions.find(a=>a.id===id)).filter(Boolean);if(mv.length){C.actions=C.actions.filter(a=>!mv.includes(a));
    let i=before?C.actions.findIndex(a=>a.id===before):(last?C.actions.findIndex(a=>a.id===last)+1:-1);if(i<0)i=C.actions.length;C.actions.splice(i,0,...mv);
    const r=_de59(x,y);save('config');render();if(typeof reEdit==='function')reEdit();return r}}}catch(e){console.error(e)}
  return _de59(x,y)}}

/* ---- 7) 자연어: '화목'·'월수금' 같은 요일 묶음, '월요일마다', 시간 범위+반복 같이 ---- */
{const _pq59=parseQuick;parseQuick=function(raw,opt){
  let s=' '+String(raw||'').replace(/\s+/g,' ')+' ',wdl=null;
  const repWord=/(^|\s)(매주|격주|반복|마다)(?=\s)|마다(?=\s)/.test(s);
  const m=s.match(/(\s)((?:[월화수목금토일][·,\/]?){2,7})(요일)?(마다)?(?=\s)/);
  const timeWord=/\d\s?시|\d:\d\d/.test(s);
  if(m&&!/^(금일|일일|월일)$/.test(m[2])){const ds=[...m[2].replace(/[·,\/]/g,'')];if(new Set(ds).size===ds.length&&(m[3]||m[4]||repWord||ds.length>=3||timeWord)){wdl=ds.map(c=>WDNAME[c]).sort((a,b)=>((a+6)%7)-((b+6)%7));s=s.replace(m[0],' ')}}
  if(!wdl){const m2=s.match(/(\s)([월화수목금토일])요일\s?마다(?=\s)/);if(m2){wdl=[WDNAME[m2[2]]];s=s.replace(m2[0],' ')}}
  const bi=/(^|\s)격주(?=\s)/.test(s);
  if(wdl)s=s.replace(/(^|\s)(매주|격주)(\s반복)?(?=\s)/g,' ').replace(/(^|\s)반복(?=\s)/g,' ');
  const p=_pq59(s.replace(/\s+/g,' ').trim(),opt);
  if(wdl){p.rep={f:'w',i:bi?2:1,wd:wdl};const base=(opt&&opt.baseDate)||dateKey();let k=p.due&&p.due>=base&&wdl.includes(dowOf(p.due))?p.due:null;if(!k)for(let i=0;i<7;i++){const c=addDays(base,i);if(wdl.includes(dowOf(c))){k=c;break}}p.due=k}
  if(p.rep&&p.title)p.title=p.title.replace(/(^|\s)(매주|매일|반복)(?=\s|$)/g,' ').replace(/\s+/g,' ').trim()||p.title;
  return p}}

/* ---- 그리기 ---- */
{const _r59=render;render=function(){_r59.apply(this,arguments);try{mig59();applyLog59();renderReview59()}catch(e){console.error(e)}}}
addEventListener('hashchange',()=>setTimeout(()=>{try{renderReview59();applyLog59()}catch(e){console.error(e)}},0));
if(location.hash==='#review')setTimeout(()=>{try{route();renderReview59()}catch(e){}},0);
