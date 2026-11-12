/* ================= v6.6: 점수 점검 · 영역 · 유리병(돌아보기 탭·구슬 크기 XP·가득 보너스·아날로그 옮기기·병 꾸미기) · 행동/습관 '구슬 넣기' 칸
   · 한 줄 일기 화면 · 캘린더 서랍 정렬·묶기·거르기 · 뽑기·사냥 칸 고르기 · 💡 팁 모음 · 전투 기록 골라 지우기 · 가챠 배수 ×N 고침 =================
   맨 끝 모듈(v5v 뒤). 최상위 값은 var/function. 앞 모듈 함수는 '다시 대입'으로 바꿔요. */

/* 첫 render가 이 모듈보다 먼저 돌아서, 상수는 함수 안에 (var는 아직 비어 있음) */
function K66(){return K66.c||(K66.c={SZX:{s:.5,m:1,l:2},LOOK:[['classic','둥근 어깨'],['mason','메이슨 병'],['round','동그란 어항'],['tall','길쭉한 병']],CAP:[[20,'작은 병'],[40,'보통'],[60,'큰 병'],[100,'아주 큰 병']],NOBLUE:['c2','c3','c4','c6','c8','c9','c10','c12'],TINT:[['','맑은 유리','var(--ink)'],['amber','호박색','#c98a1a'],['green','초록 유리','#3c9a52'],['rose','분홍 유리','#d0688f'],['violet','보라 유리','#8a63d2']],TS:{task:[['prio','중요도'],['due','날짜'],['new','새로 만든 순'],['old','오래된 순'],['short','짧은 것부터'],['name','이름순']],act:SORTS.map(x=>[x[0],x[1]]),routine:[['manual','기본 순서'],['name','이름순'],['short','짧은 것부터']]},TG:{task:[['none','안 묶음'],['list','목록'],['area','영역'],['prio','중요도'],['eff','크기']],act:[['none','안 묶음'],['area','영역'],['dopa','도파민 코스']],routine:[['none','안 묶음']]},EFF:[['quick','⚡ 번개'],['mid','🕓 보통'],['heavy','🧱 길게']],TIPC:[['all','모두'],['act','행동 조언'],['score','보상·고득점'],['fun','즐기는 법'],['plan','일정·습관'],['app','앱 꿀팁'],['egg','숨은 것']]})}
/* ---- 0) 점수 고침: 가챠 배수는 '한 번' 몫에만 (×6 기록이면 배수가 6번 붙던 것) ---- */
finishCtx=(function(prev){return function(e,ctx,src){const r=prev.apply(this,arguments);
  try{const n=+e.n||1;if(e.gq&&n>1&&e.xp>0&&!e.gq66){const m=+((C.gacha||{}).mult)||1.5,raw=e.xp/m;e.xp=Math.round(raw+raw/n*(m-1));e.gq66=1}}catch(x){console.error(x)}return r}})(finishCtx);

/* 할 일 컨디션(크기별)·카드 없는 루틴 단계 점수 — 점수 점검에서 바꿀 수 있어요(기본은 예전 그대로) */
taskBase=(function(prev){return function(t){const b=prev.apply(this,arguments);
  try{if(t&&!t.aid&&!t.rid&&!t.brave&&!t.px){
    if(t.rstep&&C.step66==='min'){const m=Math.max(1,+t.dur||5);return {...b,xp:Math.max(1,Math.round(m/5)),gold:0,cond:1}}
    const tc=C.taskCond66;if(tc){const ef=effortOf(t);if(tc[ef]!=null)return {...b,cond:Math.max(0,+tc[ef]||0)}}}}catch(x){}
  return b}})(taskBase);

/* ---- 1) 유리병 ---- */
function jf66(){const f=C.jarFull66||{};return {gold:f.gold!=null?Math.max(0,+f.gold||0):50,xp:f.xp!=null?Math.max(0,+f.xp||0):20}}
function mxp66(j,t){return Math.max(0,Math.round((+j.xp||0)*(K66().SZX[(t||{}).size]||1)))}
function jcap66(j){return Math.max(5,+(j&&j.cap66)||+C.jarCap||40)}
function jarLayout(j){
  const list=marblesOf(j.id),cap=jcap66(j);let acc=0,start=0,full=0;
  list.forEach((tid,i)=>{const w=SZW[typeOf(j,tid).size]||1;if(acc+w>cap+1e-9&&acc>0){full++;acc=0;start=i}acc+=w});
  return{cur:list.slice(start),acc,full,cap,total:list.length};
}
function jShape66(look){
  // hw(y) = 그 높이에서 안쪽 반폭 (가운데 x=60), top = 구슬을 쌓을 수 있는 맨 위, bot = 바닥
  if(look==='mason')return{bot:190,top:40,hw:y=>y>182?40-(y-182)*.6:42,
    body:'M18 34 L102 34 L102 182 Q102 194 90 194 L30 194 Q18 194 18 182 Z',
    lid:'<rect x="14" y="12" width="92" height="22" rx="4" fill="LID" stroke="GLS" stroke-width="2"/><path d="M18 19 H102 M18 26 H102" stroke="GLS" stroke-width="1.4" opacity=".55"/>',hl:'M26 50 L26 172'};
  if(look==='round')return{bot:178,top:74,hw:y=>{const d=y-122;return Math.max(0,Math.sqrt(Math.max(0,56*56-d*d))-3)},
    body:'M44 30 L44 70 A56 56 0 1 0 76 70 L76 30',
    lid:'<rect x="38" y="16" width="44" height="14" rx="4" fill="LID" stroke="GLS" stroke-width="2"/>',hl:'M24 110 Q24 86 38 74'};
  if(look==='tall')return{bot:190,top:58,hw:y=>y<76?Math.max(10,10+(y-46)*.66):(y>184?26-(y-184)*.8:28),
    body:'M48 18 L48 40 Q30 52 30 76 L30 182 Q30 194 42 194 L78 194 Q90 194 90 182 L90 76 Q90 52 72 40 L72 18',
    lid:'<rect x="44" y="6" width="32" height="13" rx="3" fill="LID" stroke="GLS" stroke-width="2"/>',hl:'M38 84 L38 172'};
  return{bot:190,top:46,hw:y=>y<62?Math.max(16,16+(y-30)*.9):(y>182?44-(y-182)*.7:44),
    body:'M42 18 L42 30 Q14 38 14 62 L14 180 Q14 194 28 194 L92 194 Q106 194 106 180 L106 62 Q106 38 78 30 L78 18',
    lid:'<rect x="38" y="6" width="44" height="12" rx="3" fill="LID" stroke="GLS" stroke-width="2"/>',hl:'M22 70 L22 170'};
}
function jarSVG(j,anim,lookOver){
  const L=jarLayout(j),S=jShape66(lookOver||j.look66),tint=(K66().TINT.find(t=>t[0]===(j.tint66||''))||K66().TINT[0])[2];
  const gls=`color-mix(in srgb,${tint} ${j.tint66?55:30}%,var(--panel))`,lid=j.lid66?`var(--${j.lid66})`:'var(--track)';
  // 구슬 크기: 병 넓이에 맞춰 '가득 = 85% 높이' 정도가 되게
  let area=0;for(let y=S.top;y<S.bot;y+=2)area+=S.hw(y)*2*2;
  const mArea=Math.PI*6.2*6.2,sc=Math.max(.55,Math.min(1.7,Math.sqrt(area*.6/(L.cap*mArea))));
  let m='',rowB=S.bot,x=null,rowH=0;
  L.cur.forEach((tid,i)=>{
    const t=typeOf(j,tid),r=(SZR[t.size]||6.2)*sc,d=r*2+.8;
    let cy=rowB-r,lw=S.hw(cy);
    if(x===null)x=60-lw+((i*7)%4)*.4;
    if(x+d>60+lw+.5){rowB-=Math.max(rowH,d)*.86;rowH=0;cy=rowB-r;lw=S.hw(cy);x=60-lw+((i*5)%4)*.5}
    if(cy<S.top||lw<r)return;
    const cx=x+r;x+=d;rowH=Math.max(rowH,d);
    const isNew=anim&&ui.newMarble===j.id&&i===L.cur.length-1;
    m+=`<g class="${isNew?'newm':''}" fill="var(--${t.color})" stroke="var(--panel)" stroke-width="1">${shapePath(t.shape,cx.toFixed(1),(cy-((i*13)%4)*.3).toFixed(1),r)}</g>`;
  });
  const pct=Math.round(L.acc/L.cap*100);
  return `<svg viewBox="0 0 120 200" aria-hidden="true">
    ${S.lid.replace(/LID/g,lid).replace(/GLS/g,gls)}
    <path d="${S.body}" fill="color-mix(in srgb,${tint} ${j.tint66?14:6}%,transparent)" stroke="${gls}" stroke-width="3" stroke-linejoin="round"/>
    <g>${m}</g>
    <path d="${S.hl}" stroke="var(--panel)" stroke-width="3.2" stroke-linecap="round" fill="none" opacity=".6"/>
    ${L.full>0?`<g><rect x="80" y="${S.top-4}" width="30" height="15" rx="7.5" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="1"/><text x="95" y="${S.top+6.5}" text-anchor="middle" font-size="9.5" fill="var(--gold)" font-family="IBM Plex Mono,monospace" font-weight="700">×${L.full}</text></g>`:''}
    ${anim?`<text x="60" y="${S.bot+0}" text-anchor="middle" font-size="0" aria-hidden="true">${pct}</text>`:''}
  </svg>`;
}
function addMarble66(jid,mt,note){
  if(!guard())return;const j=C.jars.find(x=>x.id===jid);if(!j)return;const tt=typeOf(j,mt);
  ui.newMarble=j.id;ui.jarView=j.id;const xp=mxp66(j,tt);
  commit(()=>applyEntry(curDay(),{kind:'jar',type:'good',jar:j.id,mt:tt.id,name:j.name+' · '+tt.name,note:note||'',xp,gold:0}));
  fxPop(`+${xp} XP · 구슬`,'var(--good)');toast(`${j.name} 병에 ${tt.name} 구슬 하나`);buzz();
}
// 병이 가득 차면(다음 병을 열면) 보너스 — 그 구슬 기록에 붙여서 되돌리면 같이 빠져요
applyEntry=(function(prev){return function(day,e){
  let j=null,f0=0;try{if(e&&e.jar&&!e.an66&&e.type!=='bad'){j=C.jars.find(x=>x.id===e.jar);if(j)f0=jarLayout(j).full}}catch(x){}
  const r=prev.apply(this,arguments);
  try{if(j){const f1=jarLayout(j).full;if(f1>f0){const B=jf66();if(B.gold||B.xp){e.gold=(e.gold||0)+B.gold;e.xp=(e.xp||0)+B.xp;P.gold+=B.gold;P.xp+=B.xp;e.jf66=1}
      later(()=>popup('병 가득','🔮',`<b>${esc(j.name)}</b> 병이 가득 찼어요. 선반에 올리고 새 병을 열어요.${B.gold||B.xp?`<br><span style="color:var(--gold)">보너스 ${B.xp?'✨'+B.xp+' ':''}${B.gold?'💰'+B.gold:''}</span>`:''}`,'×'+f1))}}}catch(x){console.error(x)}
  try{if(e&&e.t==='11:11'&&!['chest','boss','wbrave','badge','buy','quest'].includes(e.kind)&&ui.egg1111!==dateKey()){ui.egg1111=dateKey();setTimeout(()=>toast('🌠 11:11 — 소원 하나 빌어요. (점수는 없어요)'),900)}}catch(x){}
  return r}})(applyEntry);
// 원래 '구슬 넣기' 폼도 크기별 XP로
document.addEventListener('submit',e=>{if(!e.target||e.target.id!=='jarForm')return;e.preventDefault();e.stopImmediatePropagation();
  const n=$('jarNote');addMarble66(ui.jar,ui.mt,(n&&n.value||'').trim());if(n)n.value=''},true);
renderJars=(function(prev){return function(){prev.apply(this,arguments);
  try{const pj=C.jars.find(j=>j.id===ui.jar);
    document.querySelectorAll('#jarPick [data-pickjar] .tiny').forEach(s=>{const j=C.jars.find(x=>x.id===s.closest('[data-pickjar]').dataset.pickjar);if(j)s.textContent=`✨${j.xp} 기준`});
    if(pj)document.querySelectorAll('#mtPick [data-mt]').forEach(b=>{if(!b.querySelector('.x66')){const t=typeOf(pj,b.dataset.mt);b.insertAdjacentHTML('beforeend',` <small class="x66 muted">✨${mxp66(pj,t)}</small>`)}});
    const big=$('jarsBig');if(big){big.querySelectorAll('[data-viewjar]').forEach(b=>{const j=C.jars.find(x=>x.id===b.dataset.viewjar);if(j)b.style.setProperty('--jz',jcap66(j)<=20?.82:jcap66(j)>=100?1.18:jcap66(j)>=60?1.08:1)})}
    const pn=big&&big.closest('.panel');if(pn){let bar=pn.querySelector('.jbar66');if(!bar){bar=document.createElement('div');bar.className='jbar66';big.before(bar)}bar.innerHTML=jarBar66()}
    const lbl=$('jarCapLbl');if(lbl)lbl.textContent='크기는 병마다 · 🎨 꾸미기에서';
  }catch(x){console.error(x)}}})(renderJars);
function wkMarbles66(ws){let n=0;for(let i=0;i<7;i++){const d=DAYS[addDays(ws,i)];(d&&d.entries||[]).forEach(e=>{if(e.jar&&!e.an66)n+=(+e.mn||1)})}return n}
function jarBar66(){const ws=weekStart(dateKey()),a=wkMarbles66(ws),b=wkMarbles66(addDays(ws,-7)),B=jf66(),jv=C.jars.find(j=>j.id===ui.jarView);
  return `<div class="row" style="gap:6px;flex-wrap:wrap;align-items:center"><span class="small">이번 주 구슬 <b class="num">${a}</b> <span class="tiny muted">지난주 ${b}${a>b?' · ▲':a<b?' · ▼':''}</span></span><span style="flex:1"></span>
    ${jv?`<button type="button" class="chipbtn" data-dec66="${jv.id}">🎨 ${esc(jv.name)} 꾸미기</button>`:''}<button type="button" class="chipbtn" data-an66open="1">📥 아날로그 병 옮기기</button></div>
    <p class="tiny muted" style="margin:6px 0 0">구슬 XP는 크기에 따라 달라요(작은 ½ · 보통 1 · 큰 2배). 병이 가득 차서 새 병을 열면 보너스 ${B.xp?'✨'+B.xp+' ':''}${B.gold?'💰'+B.gold:''}${!B.xp&&!B.gold?'없음':''} <button type="button" class="linkbtn" data-jf66="1">바꾸기</button></p>`}
/* 병 꾸미기 창 */
function decSheet66(jid){const j=C.jars.find(x=>x.id===jid);if(!j)return;sheetCtx={dec66:jid};const y=$('sheetC')?$('sheetC').scrollTop:0;
  const cnt={};marblesOf(j.id).forEach(t=>cnt[t]=(cnt[t]||0)+1);
  openSheet(`<div class="sh"><h3>🎨 ${esc(j.name)} 꾸미기</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
  <div class="dec66"><div class="dprev66">${jarSVG(j,false)}<div class="tiny muted" style="text-align:center">${jarLayout(j).total}개 · ${Math.round(jarLayout(j).acc/jarLayout(j).cap*100)}%</div></div><div class="stack" style="gap:12px">
    <div><div class="small muted">모양</div><div class="dlooks66">${K66().LOOK.map(([k,n])=>`<button type="button" data-d66="look:${k}" aria-pressed="${(j.look66||'classic')===k}">${jarSVG({...j},false,k)}<span>${n}</span></button>`).join('')}</div></div>
    <div><div class="small muted">크기 (보통 구슬 몇 개면 가득)</div><div class="row" style="gap:4px;flex-wrap:wrap">${K66().CAP.map(([v,n])=>`<button type="button" class="chipbtn" data-d66="cap:${v}" aria-pressed="${jcap66(j)===v}">${n} · ${v}</button>`).join('')}</div></div>
    <div><div class="small muted">뚜껑 색</div><div class="row" style="gap:4px;flex-wrap:wrap"><button type="button" class="chipbtn" data-d66="lid:" aria-pressed="${!j.lid66}">기본</button>${K66().NOBLUE.map(c=>`<button type="button" class="sw66" data-d66="lid:${c}" aria-pressed="${j.lid66===c}" style="--sw:var(--${c})" title="${esc((COLORS.find(x=>x[0]===c)||[])[1]||c)}"><span></span>${esc((COLORS.find(x=>x[0]===c)||[])[1]||'')}</button>`).join('')}</div></div>
    <div><div class="small muted">유리 빛깔</div><div class="row" style="gap:4px;flex-wrap:wrap">${K66().TINT.map(([k,n])=>`<button type="button" class="chipbtn" data-d66="tint:${k}" aria-pressed="${(j.tint66||'')===k}">${n}</button>`).join('')}</div></div>
    <div><div class="small muted">구슬 색 <span class="tiny">(파랑 계열 빼고)</span></div>${j.types.map(t=>`<div class="mrow66"><span>${mGlyph(t)} ${esc(t.name)} <span class="tiny muted">${cnt[t.id]||0}개 · ✨${mxp66(j,t)}</span></span><span class="row" style="gap:3px;flex-wrap:wrap">${K66().NOBLUE.map(c=>`<button type="button" class="sw66 sm" data-d66="mc:${t.id}:${c}" aria-pressed="${t.color===c}" style="--sw:var(--${c})" title="${esc((COLORS.find(x=>x[0]===c)||[])[1]||c)}"><span></span></button>`).join('')}</span></div>`).join('')}
      <p class="tiny muted" style="margin:4px 0 0">이름·모양·크기(작은·보통·큰)·자동으로 들어오는 행동은 <a href="#edit" data-goedit="jars" data-sheet="close">병 편집</a>에서.</p></div>
  </div></div>`);try{$('sheetC').scrollTop=y}catch(x){}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-dec66],[data-d66],[data-an66open],[data-an66go],[data-jf66],[data-an66undo]');if(!b)return;e.preventDefault();e.stopPropagation();
  if(b.dataset.dec66){decSheet66(b.dataset.dec66);return}
  if(b.dataset.an66open){anSheet66();return}
  if(b.dataset.an66go){anGo66();return}
  if(b.dataset.an66undo){anUndo66(b.dataset.an66undo);return}
  if(b.dataset.jf66){const B=jf66(),g=prompt('병이 가득 차면 받을 골드 (0이면 없음)',B.gold);if(g==null)return;const x=prompt('같이 받을 XP (0이면 없음)',B.xp);if(x==null)return;C.jarFull66={gold:Math.max(0,Math.round(+g||0)),xp:Math.max(0,Math.round(+x||0))};save('config');render();try{renderJars()}catch(z){}return}
  const j=sheetCtx&&C.jars.find(x=>x.id===sheetCtx.dec66);if(!j)return;const [k,v,w]=b.dataset.d66.split(':');
  if(k==='look'){if(v==='classic')delete j.look66;else j.look66=v}
  if(k==='cap'){if(+v===+C.jarCap)delete j.cap66;else j.cap66=+v}
  if(k==='lid'){if(v)j.lid66=v;else delete j.lid66}
  if(k==='tint'){if(v)j.tint66=v;else delete j.tint66}
  if(k==='mc'){const t=j.types.find(x=>x.id===v);if(t)t.color=w}
  save('config');decSheet66(j.id);render();try{renderJars()}catch(z){}},true);
/* 아날로그 병 옮기기: 지금 손에 있는 병의 구슬 개수만 (XP·골드 없음) */
function anSheet66(){sheetCtx={an66:1};const prev=[];Object.values(DAYS).forEach(d=>(d.entries||[]).forEach(e=>{if(e.an66)prev.push([d.date,e])}));
  openSheet(`<div class="sh"><h3>📥 아날로그 병 옮기기</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
  <p class="help" style="margin:0">지금 실제 유리병에 있는 구슬 개수만 적어요. 내용은 안 적어도 돼요. <b>XP·골드는 안 붙고</b>, 병만 그만큼 차요(병 가득 보너스도 없음). 종류를 모르겠으면 아무 칸에 몰아서 적어도 돼요.</p>
  ${prev.length?`<p class="small" style="margin:8px 0 0">이미 옮긴 것: ${prev.map(([k,e])=>`${esc(e.name.split(' · ')[0])} ${e.mn||1}개`).join(', ')} <button type="button" class="linkbtn" data-an66undo="all">모두 빼기</button></p>`:''}
  <div class="an66">${C.jars.map(j=>`<div class="anj66"><div class="minijar">${jarSVG(j,false)}</div><div><b class="small">${esc(j.name)}</b>${j.types.map(t=>`<label class="anr66"><span>${mGlyph(t)} ${esc(t.name)}</span><input type="number" min="0" max="500" inputmode="numeric" data-an66="${j.id}|${t.id}" placeholder="0"></label>`).join('')}</div></div>`).join('')}</div>
  <p style="margin:10px 0 0;text-align:right"><button type="button" class="btn go sm" data-an66go="1">옮기기</button></p>`)}
function anGo66(){const rows=[...document.querySelectorAll('[data-an66]')].map(i=>[i.dataset.an66.split('|'),Math.max(0,Math.min(500,Math.round(+i.value||0)))]).filter(x=>x[1]>0);
  if(!rows.length){toast('개수를 적어 주세요');return}if(!guard())return;const ids=[];
  const keep=ui.off;ui.off=0;
  commit(()=>{const d=today();rows.forEach(([[jid,tid],n])=>{const j=C.jars.find(x=>x.id===jid);if(!j)return;const t=typeOf(j,tid);const e={kind:'jar',type:'good',jar:j.id,mt:t.id,mn:n,an66:1,name:j.name+' · '+t.name+' (아날로그)',note:'아날로그 병에서 옮김',xp:0,gold:0};applyEntry(d,e);ids.push(e.id)})});
  ui.off=keep;closeSheet();ui.an66last=ids;toast(`구슬 ${rows.reduce((s,x)=>s+x[1],0)}개를 옮겼어요`);try{renderJars()}catch(x){}}
function anUndo66(){const list=[];Object.values(DAYS).forEach(d=>(d.entries||[]).forEach(e=>{if(e.an66)list.push([d.date,e.id])}));if(!list.length)return;if(!confirm(`아날로그에서 옮긴 구슬 기록 ${list.length}개를 빼요`))return;list.forEach(([k,id])=>removeEntry(k,id));closeSheet();toast('옮긴 구슬을 뺐어요')}

/* 돌아보기 탭에 🔮 유리병 */
RV59_FAM=['review','stats','journey','body','jars'];
function rvTabs59(){const cur=curView();return `<nav class="rvtabs59" aria-label="돌아보기">${[['review','📅 이번 주'],['jars','🔮 유리병'],['stats','📊 통계'],['journey','🗺 여정 · 📜 전투 기록'],['body','⚖ 몸 기록']].map(([v,l])=>`<a href="#${v}" aria-current="${cur===v?'page':'false'}">${l}</a>`).join('')}</nav>`}

/* ---- 2) 행동/습관 화면: 🔮 구슬 넣기 칸 ---- */
LAY59_NAME.jar='🔮 구슬 넣기';
function lay59(){
  let L=Array.isArray(C.logLay59)?C.logLay59.filter(x=>Array.isArray(x)&&(x[0]==='jar'||LAY59_NAME[x[0]])):[];
  [['brave','L',1,0],['acts','L',0,0],['food','R',0,0],['log','R',0,0]].forEach(d=>{if(!L.some(x=>x[0]===d[0]))L.push([...d])});
  if(!L.some(x=>x[0]==='jar')){const i=L.findIndex(x=>x[0]==='food');L.splice(i<0?L.length:i+1,0,['jar',(L[i]||['','R'])[1]||'R',0,0])}
  C.logLay59=L;return L;
}
function logPanels59(){const g=(id,f)=>{const el=$(id);return el?(f?el.closest('.panel'):el):null};
  const v=document.querySelector('[data-view="log"]');let jp=$('jar66P');
  if(!jp&&v){const st=v.querySelector(':scope>.grid2>.stack');if(st){st.insertAdjacentHTML('beforeend',`<div class="panel" id="jar66P"><div class="ptitle"><h2>🔮 구슬 넣기</h2><a class="small" href="#jars" style="color:var(--accent)">병 보기</a></div><div id="j66B"></div><form class="row j66f" id="j66F" style="flex-wrap:nowrap;margin-top:8px"><input id="j66N" maxlength="120" placeholder="한 줄로 (안 적어도 돼요)" autocomplete="off"><button class="btn" type="submit">넣기</button></form></div>`);jp=$('jar66P')}}
  return {brave:g('bravePanel'),acts:g('actGroups',1),food:v&&v.querySelector('.panel.food'),log:g('log',1),jar:jp}}
function jarLogHTML66(){if(!C.jars.find(j=>j.id===ui.j66j))ui.j66j=(C.jars[0]||{}).id;const j=C.jars.find(x=>x.id===ui.j66j);if(!j)return '<div class="empty">병이 없어요.</div>';
  if(!j.types.find(t=>t.id===ui.j66t))ui.j66t=j.types[0].id;const td=curDay(),got=(td.entries||[]).filter(e=>e.jar&&!e.an66).reduce((s,e)=>s+(+e.mn||1),0);
  return `<div class="j66jars">${C.jars.map(x=>{const L=jarLayout(x);return `<button type="button" data-j66j="${x.id}" aria-pressed="${x.id===j.id}"><span class="minijar">${jarSVG(x,false)}</span><span class="tiny">${esc(x.name)}</span><span class="tiny muted num">${Math.round(L.acc/L.cap*100)}%</span></button>`}).join('')}</div>
    <div class="row" style="gap:4px;flex-wrap:wrap;margin-top:6px">${j.types.map(t=>`<button type="button" class="mtype" data-j66t="${t.id}" aria-pressed="${t.id===ui.j66t}">${mGlyph(t)} ${esc(t.name)} <small class="muted">✨${mxp66(j,t)}</small></button>`).join('')}</div>
    <p class="tiny muted" style="margin:6px 0 0">${esc(j.hint||'')}${got?` · 오늘 구슬 ${got}개`:''}</p>`}
function renderJarLog66(){const b=$('j66B');if(!b)return;b.innerHTML=jarLogHTML66()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-j66j],[data-j66t]');if(!b)return;e.preventDefault();e.stopPropagation();if(b.dataset.j66j){ui.j66j=b.dataset.j66j;ui.j66t=null}else ui.j66t=b.dataset.j66t;renderJarLog66()},true);
document.addEventListener('submit',e=>{if(!e.target||e.target.id!=='j66F')return;e.preventDefault();e.stopImmediatePropagation();const n=$('j66N');addMarble66(ui.j66j,ui.j66t,(n&&n.value||'').trim());if(n)n.value=''},true);

/* ---- 3) 돌아보기: 📝 한 줄 일기 · ⚖ 영역 · 점수 점검 ---- */
function jWeek66(ws){const td=dateKey(),days=[...Array(7)].map((_,i)=>addDays(ws,i));
  const any=days.some(k=>{const j=(DAYS[k]||{}).j65;return j&&Object.keys(j).length});
  const mood=v=>(JM65.find(m=>m[0]===(v||{}).m)||[]);
  const strip=days.map(k=>{const j=(DAYS[k]||{}).j65||{};return `<div class="jd66s"><span class="tiny muted">${wdOf(k)}</span>${J65.map(s=>{const v=j[s[0]],mm=mood(v);return `<span class="jdot66 ${v?'m-'+(v.m||'x'):''}" title="${esc(s[2])}${v?' · '+(mm[2]||'')+' '+esc(v.txt||''):''}">${v?(mm[1]||'✎'):''}</span>`}).join('')}</div>`}).join('');
  const cards=days.slice().reverse().map(k=>{const j=(DAYS[k]||{}).j65||{},isT=k===td;if(k>td)return '';const has=J65.some(s=>j[s[0]]);if(!has&&!isT)return '';
    return `<article class="jday66 ${isT?'today':''}"><header><b>${esc(fmtD(k))}</b> <span class="muted">${wdOf(k)}${isT?' · 오늘':''}</span></header><ol>${J65.map(s=>{const v=j[s[0]],mm=mood(v);
      if(!v)return isT?`<li class="empty66"><span class="sl66">${s[1]} ${s[2]}</span><button type="button" class="linkbtn" data-j65="${s[0]}">＋ 적기</button></li>`:'';
      return `<li class="m-${v.m||'x'}"><span class="sl66">${s[1]} ${s[2]}${v.t?` <span class="num">${esc(v.t)}</span>`:''}</span><span class="mo66" title="${esc(mm[2]||'')}">${mm[1]||''}<small>${esc(mm[2]||'')}</small></span><p>${esc(v.txt||'')}</p>${isT?`<button type="button" class="ib" data-j65="${s[0]}" aria-label="고치기">✎</button>`:''}</li>`}).join('')}</ol></article>`}).join('');
  return `<div class="panel jw66"><div class="ptitle"><h2>📝 한 줄 일기</h2><span class="tiny muted">하루를 넷으로 나눠 쓴 것</span></div>
    ${any?`<div class="jstrip66" aria-label="이번 주 기분 흐름"><div class="jd66s lbl"><span class="tiny muted"> </span>${J65.map(s=>`<span class="tiny muted" title="${esc(s[2])}">${s[1]}</span>`).join('')}</div>${strip}</div>`:''}
    <div class="jcards66">${cards||'<div class="empty">이 주에는 적은 일기가 없어요. 홈 \'지금 하면 좋은 것\' 아래 📝에서 적어요.</div>'}</div></div>`}
function areaWeek66(ws){const o={};C.areas.forEach(a=>o[a.id]={xp:0,n:0,c:0,sv:0,sp:0});for(let i=0;i<7;i++){const d=DAYS[addDays(ws,i)];(d&&d.entries||[]).forEach(e=>{const x=o[e.area];if(!x)return;if(e.type!=='bad'&&(e.xp||0)>0){x.xp+=e.xp;x.n++}x.c+=e.cond||0;if(e.amt){if(e.type==='bad')x.sp+=+e.amt;else x.sv+=+e.amt}})}return o}
function areaTotal66(){const o={};Object.values(DAYS).forEach(d=>(d.entries||[]).forEach(e=>{if(e.area&&e.type!=='bad'&&(e.xp||0)>0)o[e.area]=(o[e.area]||0)+e.xp}));return o}
function areasHTML66(ws){const W=areaWeek66(ws),Pw=areaWeek66(addDays(ws,-7)),T=areaTotal66(),mx=Math.max(1,...C.areas.map(a=>W[a.id].xp));
  const low=C.areas.filter(a=>a.id!=='money').slice().sort((a,b)=>W[a.id].xp-W[b.id].xp)[0];
  const td=dateKey(),days=[...Array(7)].map((_,i)=>addDays(ws,i));
  const hp=days.map(k=>{const d=DAYS[k];if(k>td)return `<div class="hp66"><span class="tiny muted">${wdOf(k)}</span><i style="--h:0"></i><span class="tiny muted">·</span></div>`;if(!d||!hasData(d))return `<div class="hp66"><span class="tiny muted">${wdOf(k)}</span><i style="--h:0"></i><span class="tiny muted">-</span></div>`;
    const b=C.energyBase[(d.energy||3)-1]??60,v=overallOf(d);return `<div class="hp66" title="시작 ${b} → 끝 ${v}"><span class="tiny muted">${wdOf(k)}</span><i style="--h:${v}"><b style="--h:${b}"></b></i><span class="tiny num">${v}</span></div>`}).join('');
  return `<div class="panel"><div class="ptitle"><h2>🧭 영역</h2><span class="tiny muted">이번 주 XP · 지금까지 쌓은 영역 레벨</span></div>
    <div class="ar66">${C.areas.map(a=>{const w=W[a.id],p=Pw[a.id],L=levelOf(T[a.id]||0),d=w.xp-p.xp;
      return `<div class="arr66"><span class="nm">${esc(a.name)} <span class="tiny muted">Lv.${L.lv}</span></span><span class="bar66"><i style="width:${Math.round(w.xp/mx*100)}%"></i></span><span class="num small">✨${w.xp}</span><span class="tiny muted">${w.n}번 · ${d===0?'지난주와 같음':(d>0?'▲':'▼')+Math.abs(d)}${a.id==='money'&&(w.sv||w.sp)?` · ₩ 아낌 ${w.sv.toLocaleString()} / 씀 ${w.sp.toLocaleString()}`:''}</span></div>`}).join('')}</div>
    ${low?`<p class="small" style="margin:8px 0 0">이번 주 가장 덜 돌본 영역: <b>${esc(low.name)}</b> <a class="linkbtn" href="#log">행동/습관에서 하나 하기</a></p>`:''}
    <h3 class="small" style="margin:14px 0 4px">🔋 컨디션(HP) 흐름 <span class="tiny muted">막대 = 하루 끝, 가는 선 = 아침 시작점</span></h3><div class="hps66">${hp}</div>
    <p class="tiny muted" style="margin:6px 0 0">HP는 매일 아침 고른 시작점(바닥~쌩쌩)에서 새로 시작해서, 그날 컨디션 변화를 모두 더해요. 어제의 선택은 '아침에 느끼는 몸'으로 들어와요. 어제 HP가 ${C.recovery.threshold} 아래였으면 오늘 XP ×${C.recovery.mult}(복귀 보너스).</p></div>`}
/* 점수 점검: 실제 기록을 보고, 고칠 만한 곳과 한 번에 바꾸기 */
function scoreCheck66(){const td=dateKey(),out=[];
  // 주간 보스: 지난 4주 중 무슨 요일에 쓰러졌나
  const ws=weekStart(td),wk=[1,2,3,4].map(i=>addDays(ws,-7*i)).map(w=>{const S=weekState(w),dd=[...Array(7)].map((_,i)=>addDays(w,i)).filter(k=>DAYS[k]&&hasData(DAYS[k])).length;let die=-1;for(let i=0;i<7;i++){if((DAYS[addDays(w,i)]&&DAYS[addDays(w,i)].entries||[]).some(e=>e.kind==='boss')){die=i;break}}return {w,dmg:S.dmg-S.heal,dd,die}}).filter(x=>x.dd>=4);
  const hp=+C.weekly.bossHp||400;
  if(wk.length>=2){const avg=Math.round(wk.reduce((s,x)=>s+x.dmg,0)/wk.length),early=wk.filter(x=>x.die>=0&&x.die<=2).length,none=wk.filter(x=>x.die<0).length;
    const want=Math.max(150,Math.round(avg*.8/50)*50);
    if(early>=Math.ceil(wk.length/2)&&want>hp)out.push({k:'boss',ic:'👾',t:'주간 보스가 너무 빨리 쓰러져요',b:`최근 ${wk.length}주 평균 데미지 ${avg} · 보스 HP ${hp}. 수요일 안에 쓰러진 주가 ${early}번이에요. 주말까지 긴장이 남게 HP ${want} 정도를 권해요.`,v:want,lbl:`보스 HP ${want}로`});
    else if(none>=Math.ceil(wk.length/2)&&want<hp)out.push({k:'boss',ic:'👾',t:'주간 보스를 거의 못 쓰러뜨려요',b:`최근 ${wk.length}주 평균 데미지 ${avg} · 보스 HP ${hp}. 질 게 뻔한 싸움은 재미가 없어요. HP ${want} 정도를 권해요.`,v:want,lbl:`보스 HP ${want}로`});
    else out.push({k:'',ic:'👾',t:'주간 보스 HP는 알맞아요',b:`최근 ${wk.length}주 평균 데미지 ${avg} · 보스 HP ${hp}.`,ok:1})}
  else out.push({k:'',ic:'👾',t:'주간 보스는 기록이 더 쌓이면 볼게요',b:'4일 넘게 기록한 주가 2주 이상 필요해요.',ok:1});
  // 할 일이 컨디션을 얼마나 올리나
  let tc=0,ac=0;lastNDates(14).forEach(k=>{(DAYS[k]&&DAYS[k].entries||[]).forEach(e=>{if((e.cond||0)<=0)return;if(e.kind==='task'&&!e.aid)tc+=e.cond;else if(e.kind==='act')ac+=e.cond})});
  if(!C.taskCond66&&tc>0&&tc>=ac*.5)out.push({k:'tcond',ic:'🔋',t:'그냥 할 일이 컨디션을 많이 올려요',b:`최근 14일 컨디션 + 중 카드 없는 할 일이 ${tc}, 행동 카드가 ${ac}. 할 일을 많이 하면 지쳐도 HP가 오르는 셈이에요. 할 일 컨디션을 번개 1 · 보통 2 · 길게 2로 줄이길 권해요(XP·골드는 그대로).`,lbl:'번개1·보통2·길게2로'});
  else out.push({k:C.taskCond66?'tcond':'',ic:'🔋',t:C.taskCond66?'할 일 컨디션을 줄여 뒀어요':'할 일 컨디션은 괜찮아요',b:C.taskCond66?`지금 번개 ${C.taskCond66.quick} · 보통 ${C.taskCond66.mid} · 길게 ${C.taskCond66.heavy}.`:`최근 14일 할 일 ${tc} · 행동 카드 ${ac}.`,ok:1,undo:!!C.taskCond66});
  // 카드 없는 루틴 단계
  const st=Object.values(TASKS).filter(t=>t.status===0&&t.rstep&&!t.aid&&!t.px);
  if(st.length&&C.step66!=='min'){const ex=st.slice(0,4).map(t=>`${t.title} ${t.dur||'?'}분 → ✨${taskBase(t).xp}`).join(' · ');
    out.push({k:'step',ic:'⏱',t:`카드 없는 루틴 단계 ${st.length}개가 할 일 크기로 점수를 받아요`,b:`예: ${ex}. 그래서 '산책 15분' 단계가 '30분 이상 걷기' 카드(✨${(C.actions.find(a=>a.name==='30분 이상 걷기')||{xp:4}).xp})보다 커질 수 있어요. 루틴의 몫은 완주 보너스에 두고, 단계는 '5분에 ✨1'로 작게 하길 권해요. (자주 하는 단계는 🃏 카드와 이으면 카드 점수로 받아요.)`,lbl:'단계는 5분에 ✨1로'});}
  else if(C.step66==='min')out.push({k:'step',ic:'⏱',t:'카드 없는 루틴 단계는 5분에 ✨1',b:'루틴 점수는 대부분 완주 보너스에서 와요.',ok:1,undo:1});
  // 일퀘 상자
  const days14=lastNDates(14).map(k=>DAYS[k]).filter(d=>d&&hasData(d)),avgX=days14.length?Math.round(days14.reduce((s,d)=>s+(d.entries||[]).reduce((a,e)=>a+Math.max(0,e.xp||0),0),0)/days14.length):0;
  const db=C.dailyBonus||{xp:0,gold:0},cd=days14.filter(chestDone).length;
  out.push({k:'',ic:'🎁',t:'일퀘',b:`일퀘 하나하나는 0점이고(행동 카드 점수로 이미 받으니까), 다 채우면 상자 ✨${db.xp} 💰${db.gold}. 하루 평균 ✨${avgX}의 ${avgX?Math.round(db.xp/avgX*100):0}% 정도라 '마무리 한 방'으로 알맞아요. 최근 14일 상자 연 날 ${cd}일.`,ok:1});
  // 골드와 상점
  let g=0;lastNDates(14).forEach(k=>{(DAYS[k]&&DAYS[k].entries||[]).forEach(e=>{if(e.kind!=='buy'&&(e.gold||0)>0)g+=e.gold})});const gd=Math.round(g/14);
  if(gd>0)out.push({k:'',ic:'💰',t:'골드와 상점',b:`하루 평균 💰${gd}. ${(C.shop||[]).slice(0,4).map(s=>`${s.name} ${Math.max(1,Math.round(s.price/gd*10)/10)}일`).join(' · ')}. 작은 보상이 2~4일, 큰 보상이 1~3주면 알맞아요.`,ok:1});
  out.push({k:'',ic:'🎲',t:'뽑기 배수',b:`이제 ×${(C.gacha||{}).mult||1.5}는 '한 번' 몫에만 붙어요. 예전엔 '×6'처럼 여러 번 기록하면 배수가 6번 다 붙었어요(시나리오 25분 ×6 → ✨228). 이번 버전부터는 ✨163.`,ok:1});
  return out}
function scoreHTML66(){const L=scoreCheck66();
  return `<div class="panel"><div class="ptitle"><h2>⚖ 점수 점검</h2><span class="tiny muted">최근 기록으로 봐요 · 바꿔도 되돌릴 수 있어요</span></div><ul class="sc66">${L.map(x=>`<li class="${x.ok?'ok':'warn'}"><span class="ic">${x.ic}</span><span><b>${esc(x.t)}</b><br><span class="small">${esc(x.b)}</span>${x.k&&!x.ok?`<br><button type="button" class="btn sm" data-sc66="${x.k}" data-v="${x.v||''}">${esc(x.lbl)}</button>`:''}${x.undo?` <button type="button" class="linkbtn" data-sc66u="${x.k}">예전대로</button>`:''}</span></li>`).join('')}</ul></div>`}
document.addEventListener('click',e=>{const b=e.target.closest('[data-sc66],[data-sc66u]');if(!b)return;e.preventDefault();e.stopPropagation();C.sc66b=C.sc66b||{};
  const k=b.dataset.sc66||b.dataset.sc66u,undo=!!b.dataset.sc66u;
  if(k==='boss'){if(undo)return;C.sc66b.boss=C.weekly.bossHp;C.weekly.bossHp=+b.dataset.v;toast(`보스 HP ${b.dataset.v} (다음 주부터 알맞게, 이번 주도 바로 바뀌어요)`)}
  if(k==='tcond'){if(undo)delete C.taskCond66;else C.taskCond66={quick:1,mid:2,heavy:2};toast(undo?'할 일 컨디션을 예전대로':'할 일 컨디션을 줄였어요')}
  if(k==='step'){if(undo)delete C.step66;else C.step66='min';toast(undo?'루틴 단계 점수를 예전대로':'카드 없는 루틴 단계는 5분에 ✨1')}
  save('config');render();renderReview59()},true);
reviewHTML59=(function(prev){return function(){let h=prev.apply(this,arguments);
  try{h=h.replace(/<div class="card"><h2>📝 나눠 쓴 한 줄 일기[\s\S]*$/,'');
    const off=ui.rv59||0,ws=addDays(weekStart(dateKey()),-7*off);const add=jWeek66(ws)+`<div class="grid2 rv66">${areasHTML66(ws)}${scoreHTML66()}</div>`;
    const i=h.indexOf('<div class="panel"><div class="ptitle"><h2>왼쪽 메뉴</h2>');h=i>=0?h.slice(0,i)+add+h.slice(i):h+add}catch(x){console.error(x)}
  return h}})(reviewHTML59);

/* ---- 4) 캘린더 서랍: 정렬 · 묶기 · 거르기 ---- */
function T66(){const T=C.tray66||(C.tray66={});T.s=T.s||{};T.g=T.g||{};T.f=T.f||{};['lists','areas','eff'].forEach(k=>{if(!Array.isArray(T.f[k]))T.f[k]=[]});return T}
function renderTray(){
  const el=$('calTray');if(!el)return;let tab=ui.trayTab||'nodate';if(tab==='late')tab=ui.trayTab='nodate';const q=(ui.trayQ||'').toLowerCase(),T=T66();
  const kind=tab==='habit'?'act':tab==='routine'?'routine':'task',srt=T.s[kind]||K66().TS[kind][0][0],grp=T.g[kind]||'none',F=T.f;
  const tabs=[['nodate','날짜 없음'],['open','모든 할 일'],['habit','행동 카드'],['routine','루틴']];
  let items=[];const pn=['','!','','!!','','!!!'];
  if(kind==='task'){let L=openTasks().filter(t=>!t.rstep&&(tab==='open'||!t.due));
    if(F.lists.length)L=L.filter(t=>F.lists.includes(t.list||'inbox'));if(F.areas.length)L=L.filter(t=>F.areas.includes(areaOfTask(t)||''));if(F.eff.length)L=L.filter(t=>F.eff.includes(effortOf(t)));
    const cmp={prio:(a,b)=>(b.prio||0)-(a.prio||0)||String(a.due||'9').localeCompare(String(b.due||'9')),due:(a,b)=>String(a.due||'9999').localeCompare(String(b.due||'9999'))||(b.prio||0)-(a.prio||0),new:(a,b)=>String(b.created||'').localeCompare(String(a.created||'')),old:(a,b)=>String(a.created||'').localeCompare(String(b.created||'')),short:(a,b)=>(+a.dur||999)-(+b.dur||999),name:(a,b)=>String(a.title).localeCompare(String(b.title),'ko')}[srt]||(()=>0);
    L.sort(cmp);items=L.map(t=>({k:'task:'+t.id,n:t.title,id:t.id,h:`${pmark(t.prio)}${t.dur?' ⏱'+t.dur+'분':''}${tab==='open'&&t.due?' '+esc(dueLabel(t.due)):''}${t.list&&t.list!=='inbox'&&grp!=='list'?' '+esc(listName(t.list)):''}`,
      g:grp==='list'?listName(t.list||'inbox'):grp==='area'?((C.areas.find(a=>a.id===areaOfTask(t))||{}).name||'영역 없음'):grp==='prio'?(['중요도 없음','! 낮음','','!! 보통','','!!! 높음'][t.prio||0]||'중요도 없음'):grp==='eff'?((K66().EFF.find(x=>x[0]===effortOf(t))||[])[1]||''):''}))}
  if(kind==='act'){let L=C.actions.filter(a=>a.type==='good'&&!a.link&&(T.dopa||!a.dopaOnly));if(F.areas.length)L=L.filter(a=>F.areas.includes(a.area));
    L=sortList(L,listStats(),srt);const DN={app:'애피타이저',side:'사이드',main:'메인',dessert:'디저트',special:'스페셜',rest:'쉼표'};
    items=L.map(a=>({k:'act:'+a.id,n:a.name,h:`${a.dur?'⏱'+a.dur+'분 ':''}✨${a.xp||0}`,g:grp==='area'?((C.areas.find(x=>x.id===a.area)||{}).name||'영역 없음'):grp==='dopa'?(a.dopa?'🍬 '+(DN[a.dopa]||a.dopa):'코스 없음'):''}))}
  if(kind==='routine'){let L=(C.routines||[]).slice();if(srt==='name')L.sort((a,b)=>a.name.localeCompare(b.name,'ko'));if(srt==='short')L.sort((a,b)=>a.steps.reduce((s,x)=>s+(+x.min||0),0)-b.steps.reduce((s,x)=>s+(+x.min||0),0));
    items=L.map(r=>({k:'routine:'+r.id,n:r.name,h:`${r.steps.length}단계 · ${r.steps.reduce((s,x)=>s+(+x.min||0),0)}분`,g:''}))}
  if(q)items=items.filter(x=>x.n.toLowerCase().includes(q));
  const nf=(kind==='task'?F.lists.length+F.eff.length:0)+(kind!=='routine'?F.areas.length:0);
  const row=x=>`<div class="titem" data-drag="${x.k}" data-dragmode="hold"${x.id?` data-ctask="${x.id}"`:''}><span class="n">${esc(x.n)}</span><span class="h">${x.h}</span></div>`;
  let list='';if(grp!=='none'){const gs=[];items.slice(0,200).forEach(x=>{let g=gs.find(y=>y[0]===x.g);if(!g)gs.push(g=[x.g,[]]);g[1].push(x)});
    list=gs.map(([g,xs])=>`<div class="tgh66"><span>${esc(g||'기타')}</span><span class="tiny muted">${xs.length}</span></div>${xs.map(row).join('')}`).join('')}
  else list=items.slice(0,150).map(row).join('');
  const chip=(k,v,l)=>`<button type="button" class="chipbtn" data-t66f="${k}:${v}" aria-pressed="${F[k].includes(v)}">${esc(l)}</button>`;
  const fl=T.open?`<div class="tf66">${kind==='task'?`<div class="tiny muted">목록</div><div class="row">${[{id:'inbox',name:'기본함'},...C.lists.filter(l=>l.id!=='inbox')].map(l=>chip('lists',l.id,l.name)).join('')}</div><div class="tiny muted">크기</div><div class="row">${K66().EFF.map(([k,l])=>chip('eff',k,l)).join('')}</div>`:''}${kind!=='routine'?`<div class="tiny muted">영역</div><div class="row">${C.areas.map(a=>chip('areas',a.id,a.name)).join('')}</div>`:''}${kind==='act'?`<label class="tiny"><input type="checkbox" data-t66dopa="1" ${T.dopa?'checked':''} style="width:auto"> 도파민 전용 카드도</label>`:''}${nf?'<button type="button" class="linkbtn" data-t66clear="1">거르기 풀기</button>':''}</div>`:'';
  const h=`<div class="ptitle" style="margin:0"><h2>끌어다 놓기</h2><span class="tiny muted">여기로 끌면 날짜 빼기</span></div>
    <div class="row" style="gap:4px">${tabs.map(([k,l])=>`<button class="chipbtn" data-traytab="${k}" aria-pressed="${tab===k}">${l}</button>`).join('')}</div>
    <input id="trayQ" type="search" placeholder="찾기" value="${esc(ui.trayQ||'')}" autocomplete="off">
    <div class="tctl66"><select data-t66s="${kind}" aria-label="정렬">${K66().TS[kind].map(([v,l])=>`<option value="${v}" ${srt===v?'selected':''}>${l}</option>`).join('')}</select>${K66().TG[kind].length>1?`<select data-t66g="${kind}" aria-label="묶기">${K66().TG[kind].map(([v,l])=>`<option value="${v}" ${grp===v?'selected':''}>${v==='none'?l:'묶기: '+l}</option>`).join('')}</select>`:''}${kind!=='routine'?`<button type="button" class="chipbtn" data-t66open="1" aria-pressed="${!!T.open}">⚲ 거르기${nf?' '+nf:''}</button>`:''}</div>
    ${fl}<div class="tiny muted">${items.length}개</div>
    <div class="trayl">${list||'<div class="empty tiny">비어 있어요.</div>'}</div>`;
  if(!document.activeElement||document.activeElement.id!=='trayQ'||!el.contains(document.activeElement))el.innerHTML=h;
  else{const l=el.querySelector('.trayl');if(l){const tmp=document.createElement('div');tmp.innerHTML=h;l.innerHTML=tmp.querySelector('.trayl').innerHTML}}
}
document.addEventListener('change',e=>{const s=e.target;if(!s||!s.dataset)return;if(!s.dataset.t66s&&!s.dataset.t66g&&!s.dataset.t66dopa)return;e.stopPropagation();const T=T66();
  if(s.dataset.t66s)T.s[s.dataset.t66s]=s.value;if(s.dataset.t66g)T.g[s.dataset.t66g]=s.value;if(s.dataset.t66dopa)T.dopa=s.checked?1:0;save('config');renderTray()},true);
document.addEventListener('click',e=>{const b=e.target.closest('[data-t66f],[data-t66open],[data-t66clear]');if(!b)return;e.preventDefault();e.stopPropagation();const T=T66();
  if(b.dataset.t66open)T.open=T.open?0:1;
  if(b.dataset.t66clear){T.f={lists:[],areas:[],eff:[]}}
  if(b.dataset.t66f){const [k,v]=b.dataset.t66f.split(':');T.f[k]=T.f[k].includes(v)?T.f[k].filter(x=>x!==v):[...T.f[k],v]}
  save('config');renderTray()},true);

/* ---- 5) 홈 '뽑기 · 사냥' 칸: 보일 버튼 고르기 ---- */
function hgAll66(){const g=C.gacha||{};return [['g3','🎲 3장 뽑기'],['g5','🎲 5장'],...(g.presets||[]).map(p=>['p:'+p.id,'🎲 '+p.name]),...(C.routines||[]).map(r=>['r:'+r.id,'⏱ '+r.name]),['hunt','🏹 사냥 고르기'],['dopa','🍬 도파민'],['q5','⏳ 딱 5분만']]}
function hgOn66(){if(Array.isArray(C.hg66))return C.hg66.filter(k=>hgAll66().some(x=>x[0]===k));return ['g3','g5',...(C.routines||[]).slice(0,2).map(r=>'r:'+r.id),'hunt','dopa','q5']}
function hgHTML66(){const g=C.gacha||{},A=hgAll66();let first=true;
  return hgOn66().map(k=>{const it=A.find(x=>x[0]===k);if(!it)return '';const cls=()=>{const c=first?'btn':'btn ghost';first=false;return c};
    if(k==='g3'||k==='g5'){if(g.quest)return '';if(g.pending){if(k==='g5')return '';return `<a class="${cls()}" href="#gacha">🎲 뽑은 카드 고르기</a>`}return `<button class="${cls()}" data-gquick="${k.slice(1)}">${esc(it[1])}</button>`}
    if(k.startsWith('p:'))return `<button class="${cls()}" data-hg66p="${esc(k.slice(2))}" title="${esc(it[1])}">${esc(it[1])}</button>`;
    if(k.startsWith('r:'))return `<button class="${cls()}" data-rrun="${esc(k.slice(2))}" title="${esc(it[1])}">${esc(it[1])}</button>`;
    if(k==='hunt')return `<button class="${cls()}" data-huntpick="1">🏹 사냥 고르기</button>`;
    if(k==='dopa')return `<button class="${cls()}" data-gquickdopa="1">🍬 도파민</button>`;
    if(k==='q5')return `<button class="${cls()}" data-quick5="1" title="딱 5분만 해보기">⏳ 딱 5분만</button>`;return ''}).join('')||'<span class="tiny muted">보일 버튼이 없어요. ✎를 눌러 골라요.</span>'}
function hgSheet66(){sheetCtx={hg66:1};const on=hgOn66(),A=hgAll66();const y=$('sheetC')?$('sheetC').scrollTop:0;
  openSheet(`<div class="sh"><h3>✎ 뽑기 · 사냥 칸</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
  <p class="help" style="margin:0">홈에 보일 버튼만 켜고, 순서를 정해요. 뽑기 필터(뽑기 화면에서 저장한 것)와 루틴도 하나하나 고를 수 있어요.</p>
  <div class="hg66">${[...on.map(k=>A.find(x=>x[0]===k)).filter(Boolean),...A.filter(x=>!on.includes(x[0]))].map(([k,l])=>{const o=on.includes(k);return `<div class="hgr66 ${o?'on':''}"><button type="button" class="chipbtn" data-hg66t="${esc(k)}" aria-pressed="${o}">${o?'☑':'☐'}</button><span>${esc(l)}</span>${o?`<button type="button" class="ib" data-hg66m="${esc(k)}|-1" aria-label="위로">↑</button><button type="button" class="ib" data-hg66m="${esc(k)}|1" aria-label="아래로">↓</button>`:''}</div>`}).join('')}</div>
  <p style="margin:10px 0 0;display:flex;justify-content:space-between"><button type="button" class="linkbtn" data-hg66r="1">처음 모양으로</button><button type="button" class="btn sm" data-sheet="close">닫기</button></p>`);try{$('sheetC').scrollTop=y}catch(x){}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-hg66e],[data-hg66t],[data-hg66m],[data-hg66r],[data-hg66p]');if(!b)return;e.preventDefault();e.stopPropagation();
  if(b.dataset.hg66p){const g=G();if(g.pending||g.quest){location.hash='gacha';toast(g.quest?'진행 중인 가챠 퀘스트부터 끝내요':'먼저 뽑은 카드를 골라요');return}const p=(g.presets||[]).find(x=>x.id===b.dataset.hg66p);if(p){g.f=clone(p.f);gachaDraw()}return}
  if(b.dataset.hg66e){hgSheet66();return}
  let on=hgOn66();
  if(b.dataset.hg66r){delete C.hg66;save('config');render();hgSheet66();return}
  if(b.dataset.hg66t){const k=b.dataset.hg66t;on=on.includes(k)?on.filter(x=>x!==k):[...on,k]}
  if(b.dataset.hg66m){const [k,d]=b.dataset.hg66m.split('|'),i=on.indexOf(k),j=i+(+d);if(i>=0&&j>=0&&j<on.length){[on[i],on[j]]=[on[j],on[i]]}}
  C.hg66=on;save('config');render();hgSheet66()},true);
function hgPaint66(){const el=$('hGacha');if(!el)return;el.innerHTML=hgHTML66();
  const pt=el.closest('.panel')&&el.closest('.panel').querySelector('.ptitle .row');if(pt&&!pt.querySelector('[data-hg66e]'))pt.insertAdjacentHTML('afterbegin','<button type="button" class="ib" data-hg66e="1" title="보일 버튼 고르기" aria-label="보일 버튼 고르기">✎</button>')}

/* ---- 6) 💡 팁 모음 ---- */
function tips66(){const c=C||{},tx=c.taskXP||{},g=c.gacha||{},db=c.dailyBonus||{},rc=c.recovery||{},w=c.weekly||{},B=jf66(),ks=(c.courageSizes||[]);
  return [
  ['act','🌱','하기 싫은 일은 "10분만"으로 시작해요. 10분 지나면 그만둬도 시작 보너스를 받아요. 시작이 제일 큰 산이에요.'],
  ['act','✂','같은 일을 세 번 미뤘다면 일이 너무 큰 거예요. ☠ 삼진아웃 창에서 쪼개면 첫 조각만 오늘 할 일이 돼요.'],
  ['act','😶','피하고 있는 일은 우클릭(폰은 꾹) → 😶 피하고 있어요. 이유를 알아차리기만 해도 무게가 줄어요.'],
  ['act','⚔️','두려운 일은 결과와 상관없이 시도만으로 용기예요. 거절당해도 기록해요.'],
  ['act','🌙','밤에 걱정이 올라오면 해결하지 말고 브레인 덤핑으로 종이에 옮겨요. 내일의 할 일로 만들면 머리가 쉬어요.'],
  ['act','🚿','아침 루틴의 첫 단계는 1분짜리로 두세요. 몸무게 재기처럼 "실패할 수 없는 것"이 좋아요.'],
  ['act','🍬','폰이 당길 때는 참는 것보다 바꾸는 게 쉬워요. 🍬 지금 어때? → 폰 당김을 눌러요.'],
  ['score','✨',`가장 빨리 크는 길은 ⚔️ 용기예요. 작은 용기 하나가 ✨${(ks[0]||{}).xp||40}. 이번 주 용기 XP는 보스에게 치명타로 한 번 더 들어가요.`],
  ['score','🎁',`일퀘 하나하나는 0점이지만 다 채우면 상자 ✨${db.xp||0} 💰${db.gold||0}. 연속으로 열면 업적도 받아요.`],
  ['score','🎲',`뽑기에서 고른 건 끝내면 XP ×${g.mult||1.5}. 하기 싫은 일을 뽑기에 넣어 두면 보상이 커져요.`],
  ['score','⏱','사냥 타이머로 하면 목표 시간 안에 끝냈을 때 속도 보너스가 붙어요. "빠를수록" 방식은 절반 안이면 번개 처치.'],
  ['score','🌱',`컨디션이 ${rc.threshold||40} 아래였던 다음 날은 복귀 보너스 XP ×${rc.mult||1.5}. 무너진 다음 날이 가장 크게 오르는 날이에요.`],
  ['score','🔮',`구슬은 크기만큼 XP가 달라요(작은 ½ · 큰 2배). 병이 가득 차면 ${B.xp?'✨'+B.xp+' ':''}${B.gold?'💰'+B.gold:''} 보너스.`],
  ['score','🔗','흐름 끊기 보너스: 나쁜 행동 다음에 바로 좋은 행동을 하면 보너스를 받아요. 무너진 순간이 기회예요.'],
  ['score','📦',`할 일은 크기(번개 ✨${tx.quick||0} · 보통 ✨${tx.mid||0} · 길게 ✨${tx.heavy||0})와 중요도로 점수가 정해져요. 마감 전에 끝내면 +${tx.onTime||0}.`],
  ['fun','👾',`보스 HP는 ${w.bossHp||400}. 이번 주 XP가 그대로 데미지예요. 보스를 누르면 약점과 남은 HP가 보여요.`],
  ['fun','🎨','상점 → 장비에서 ✏ 직접 그리기로 나만의 투구·망토를 그릴 수 있어요. 점수 효과는 없고 꾸미기 전용이에요.'],
  ['fun','📖','전투 칸의 📖 도감에서 지금까지 쓰러뜨린 보스와 쫄따구 종류를 볼 수 있어요.'],
  ['fun','🎯','이번 주 용기 한 가지를 정해 두면 홈과 돌아보기에 따라다녀요. 비워 둬도 실패 표시는 없어요.'],
  ['fun','🏆','레벨마다 여정(영화 만들기 단계)이 열려요. 현실 보상을 적어 두면 레벨 업 때 같이 떠요.'],
  ['plan','🗓','반복 할 일은 "완료한 날부터 N일마다"도 돼요. 어항 환수처럼 날짜보다 간격이 중요한 일에 좋아요.'],
  ['plan','🧭','할 일 입력에 말하듯 적어요: "일요일 7시부터 8시까지 빨래하기 매주 반복 #집 !!" → 날짜·시간·반복·태그·중요도.'],
  ['plan','📥','캘린더 서랍에서 날짜 없는 할 일을 끌어다 놓으면 일정이 돼요. 서랍은 정렬·묶기·보이기/숨기기가 돼요.'],
  ['plan','↻','습관 = 행동 카드 + 반복 할 일. 카드 편집의 "반복"에서 매일·요일을 정하면 ↻ 습관 목록에 생겨요.'],
  ['plan','⏳','저녁 약속이 있는 날은 "그때까지 아무것도 못 하는" 대기 모드에 빠지기 쉬워요. 홈 위에 뜨는 띠에서 짧은 것 하나를 골라요.'],
  ['plan','📝','한 줄 일기는 평가 말고 그냥 적어요. 아침·이른 오후·늦은 오후·밤 넷으로 나눠 쓰면 하루가 덩어리로 기억돼요.'],
  ['app','⌨','PC에서 Ctrl+Shift+A = 빠른 추가. 바탕화면 단축키도 만들 수 있어요(tools/quickadd-setup.ps1).'],
  ['app','🖱','대부분의 줄은 우클릭(폰은 꾹)으로 메뉴가 떠요: 미루기·10분만·루틴에 넣기·일퀘 켜기.'],
  ['app','🕓','어제 깜빡한 기록은 행동/습관 화면 위 "어제"를 눌러 적어요. 나중에 적은 표시만 붙고 점수는 같아요.'],
  ['app','▦','홈·행동/습관 화면은 "화면 배치"에서 칸을 끌어 옮기고 숨길 수 있어요. 뽑기 칸은 ✎로 버튼을 골라요.'],
  ['app','📜','돌아보기 → 여정의 📜 전투 기록에서 점수가 어떻게 계산됐는지 줄마다 볼 수 있어요. 🧹 골라 지우기도 거기서.'],
  ['app','⚖','돌아보기 → 이번 주 아래 ⚖ 점수 점검이 실제 기록을 보고 고칠 곳을 알려줘요.'],
  ['egg','🧙','전투 칸에 서 있는 내 캐릭터를 빠르게 여러 번 눌러 보면…'],
  ['egg','🌠','어떤 시각에 기록하면 작은 일이 생겨요. 하루에 두 번 오는 시각이에요.'],
  ['egg','🐌','쫄따구마다 모양이 달라요. 달팽이는 반복 할 일, 해골은 미루고 미룬 일. 고슴도치는?']]}
function tipSheet66(){const c=ui.tip66c||'all',L=tips66(),sh=c==='all'?L:L.filter(x=>x[0]===c);const r=ui.tip66r!=null&&L[ui.tip66r]?L[ui.tip66r]:null;sheetCtx={tip66:1};
  openSheet(`<div class="sh"><h3>💡 팁 모음</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
  ${r?`<div class="tip66big"><span>${r[1]}</span><p>${esc(r[2])}</p></div>`:''}
  <div class="row" style="gap:4px;flex-wrap:wrap">${K66().TIPC.map(([k,l])=>`<button type="button" class="chipbtn" data-tip66c="${k}" aria-pressed="${c===k}">${l}</button>`).join('')}<button type="button" class="chipbtn" data-tip66r="1">🎲 아무거나</button></div>
  <ul class="tip66">${sh.map(x=>`<li><span class="ic">${x[1]}</span><span class="small">${esc(x[2])}</span></li>`).join('')}</ul>`)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-tip66],[data-tip66c],[data-tip66r]');if(!b)return;e.preventDefault();e.stopPropagation();
  if(b.dataset.tip66c){ui.tip66c=b.dataset.tip66c;ui.tip66r=null}
  if(b.dataset.tip66r){const L=tips66();let i;do{i=Math.floor(Math.random()*L.length)}while(L.length>1&&i===ui.tip66r);ui.tip66r=i}
  tipSheet66()},true);
// 캐릭터 7번 누르기
var EGG66={n:0,t:0};
document.addEventListener('click',e=>{const a=e.target.closest('.hero2');if(!a)return;const now=Date.now();if(now-EGG66.t>1600)EGG66.n=0;EGG66.t=now;EGG66.n++;
  if(EGG66.n>=7){EGG66.n=0;a.classList.remove('spin66');void a.offsetWidth;a.classList.add('spin66');const L=['빙글빙글! 어지러워요.','오늘도 와 줘서 고마워요.','용기는 무섭지 않은 게 아니라, 무서워도 하는 거래요.','쉿, 이건 비밀 춤이에요.','레벨 업 연습 중!','다음 장면, 액션!'];toast('🧙 '+L[Math.floor(Math.random()*L.length)])}},true);

/* ---- 7) 📜 전투 기록: 골라 지우기 (베타에서 시험 삼아 적은 것 정리용) ---- */
blogHTML=(function(prev){return function(){
  const on=!!ui.b66,S=ui.b66s||(ui.b66s=new Set());ui.b66rows={};
  if(!on){const h=prev.apply(this,arguments);return h.replace(/(<button class="chipbtn" data-x59calc="1"[^>]*>[^<]*<\/button>)/,'$1<button class="chipbtn" data-b66m="1">🧹 골라 지우기</button>')}
  const _lr=logRow;let h='';
  logRow=function(k,e){const r=_lr.apply(this,arguments);(ui.b66rows[k]=ui.b66rows[k]||[]).push(e.id);return r.replace(/^<li([^>]*)>/,`<li$1 data-b66li="1"><input type="checkbox" class="b66c" data-b66c="${k}|${e.id}" ${S.has(k+'|'+e.id)?'checked':''} aria-label="고르기">`)};
  try{h=prev.apply(this,arguments)}finally{logRow=_lr}
  return `<div class="b66bar"><b>🧹 골라 지우기</b><span class="small">${S.size}개 고름</span><span style="flex:1"></span><button type="button" class="chipbtn" data-b66all="1">보이는 것 모두</button><button type="button" class="chipbtn" data-b66none="1">고른 것 풀기</button><button type="button" class="btn sm bad66" data-b66del="1" ${S.size?'':'disabled'}>지우기</button><button type="button" class="btn ghost sm" data-b66m="0">그만</button></div>
    <p class="tiny muted" style="margin:0 0 6px">시험 삼아 적은 기록을 골라 지워요. 지우면 그 기록의 XP·골드·구슬·할 일 완료도 같이 되돌려요.</p>`+h.replace(/(<button class="chipbtn" data-x59calc="1"[^>]*>[^<]*<\/button>)/,'$1')}})(blogHTML);
document.addEventListener('click',e=>{const b=e.target.closest('[data-b66m],[data-b66all],[data-b66none],[data-b66del],[data-b66go]');if(!b)return;e.preventDefault();e.stopPropagation();const S=ui.b66s||(ui.b66s=new Set());
  if(b.dataset.b66m!=null){ui.b66=b.dataset.b66m==='1';S.clear();renderBlog();return}
  if(b.dataset.b66all){Object.entries(ui.b66rows||{}).forEach(([k,ids])=>ids.forEach(id=>S.add(k+'|'+id)));renderBlog();return}
  if(b.dataset.b66none){S.clear();renderBlog();return}
  if(b.dataset.b66del){if(!S.size)return;const L=[...S].map(x=>x.split('|')).map(([k,id])=>[k,((DAYS[k]||{}).entries||[]).find(e=>e.id===id)]).filter(x=>x[1]);sheetCtx={b66:1};
    openSheet(`<div class="sh"><h3>🧹 ${L.length}개 지우기</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div><p class="help" style="margin:0">이 기록들과 그 점수(XP·골드·구슬)·할 일 완료를 되돌려요. <b>지운 뒤엔 되돌릴 수 없어요.</b> 걱정되면 먼저 '계정·백업'에서 백업을 받아 두세요.</p>
      <ul class="small" style="max-height:40vh;overflow:auto;margin:8px 0;padding-left:18px">${L.map(([k,e])=>`<li>${esc(fmtD(k))} ${esc(e.t||'')} · ${esc(e.name||'')} <span class="muted">${e.xp?'✨'+e.xp:''}${e.gold?' 💰'+e.gold:''}</span></li>`).join('')}</ul>
      <p style="text-align:right;margin:0"><button type="button" class="btn ghost sm" data-sheet="close">그만</button> <button type="button" class="btn sm bad66" data-b66go="1">지우기</button></p>`);return}
  if(b.dataset.b66go){const L=[...S].map(x=>x.split('|'));let n=0;L.forEach(([k,id])=>{if(((DAYS[k]||{}).entries||[]).some(e=>e.id===id)){try{removeEntry(k,id);n++}catch(x){console.error(x)}}});S.clear();closeSheet();renderBlog();toast(`${n}개를 지웠어요`)}},true);
document.addEventListener('change',e=>{const c=e.target;if(!c||!c.dataset||!c.dataset.b66c)return;e.stopPropagation();const S=ui.b66s||(ui.b66s=new Set());if(c.checked)S.add(c.dataset.b66c);else S.delete(c.dataset.b66c);
  const bar=document.querySelector('.b66bar');if(bar){bar.querySelector('.small').textContent=S.size+'개 고름';const d=bar.querySelector('[data-b66del]');if(d)d.disabled=!S.size}},true);

/* ---- 8) 렌더 뒤 ---- */
render=(function(prev){return function(){const x=prev.apply(this,arguments);
  try{hgPaint66()}catch(e){console.error(e)}
  try{const tb=$('tipBox');if(tb&&!tb.querySelector('.tipb66'))tb.insertAdjacentHTML('beforeend','<span class="tipb66"><button type="button" class="chipbtn" data-tip66r="1">💡 팁 더 보기</button></span>')}catch(e){}
  try{if(curView()==='log'){logPanels59();const jp=$('jar66P');if(jp&&!jp.contains(document.activeElement))renderJarLog66();else if(jp&&document.activeElement&&document.activeElement.id==='j66N')renderJarLog66()}}catch(e){console.error(e)}
  return x}})(render);
addEventListener('hashchange',()=>setTimeout(()=>{try{if(curView()==='log'){logPanels59();applyLog59();renderJarLog66()}}catch(e){}},0));
