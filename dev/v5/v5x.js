/* ================= v6.7: 모든 화면 배치 · 하루 시작 5시 · HP 요즘 지표 · 영역 레벨(곡선·칭호·마일스톤 보상) · HP 흐름 종합/영역/₩
   · 몸 종합 기록 · 유리병 순서·점수만큼 구슬 · '기록하기' 이름 · 기록 n개 풀이 · 용기 버튼 → ⚔️ 용기 카드로 합침
   · 한 줄 일기 새로(빈칸 없음) · 기능 지도·검색 · 🤖 AI에게 물어보기 =================
   맨 끝 모듈(v5w 뒤). 최상위 값은 var/function. 첫 render가 이 모듈보다 먼저 돌아서 상수는 K67() 안에. */
function K67(){return K67.c||(K67.c={
  AMS:[3,5,10,15,20,25,30,40,50],            // 영역 마일스톤 레벨
  TIER:[1,3,5,10,15,20],                     // 칭호가 바뀌는 레벨
  TITLES:{body:['걸음마','산책자','단련하는 사람','체력가','강철 몸','철인'],mind:['숨 고르는 사람','다독이는 사람','고요한 사람','단단한 마음','깊은 마음','평정의 고수'],
    make:['메모하는 사람','초고 쓰는 사람','고쳐 쓰는 사람','완성하는 사람','작가','거장'],grow:['배우는 사람','탐구자','연구자','깊이 아는 사람','전문가','스승'],
    life:['정리 초보','살림꾼','생활 장인','집을 돌보는 사람','생활 달인','생활의 고수'],money:['지갑 지킴이','가계부 쓰는 사람','알뜰한 사람','돈을 다루는 사람','설계자','재정의 고수']},
  GEN:['첫걸음','익숙한 사람','꾸준한 사람','숙련자','고수','달인'],
  VIEWS:{review:'#review59',jars:null,stats:null,journey:null,body:null,shop:null,gacha:null,more:null},
  VNAME:{review:'📅 이번 주',jars:'🔮 유리병',stats:'📊 통계',journey:'🗺 여정',body:'⚖ 몸 기록',shop:'🛍 상점',gacha:'🎲 뽑기',more:'계정·백업'},
  KIND:{act:'행동',task:'할 일',courage:'용기',jar:'구슬',quest:'일퀘 칸',chest:'일퀘 상자',routine:'루틴 완주',weigh:'몸무게',buy:'상점 구매',boss:'보스 처치',wbrave:'주간 용기',badge:'업적',chain:'흐름 보너스',free:'그냥 한 일',happy:'행복',start65:'10분만',amile67:'영역 마일스톤'}
})}

/* ---- 0) 한 번만 하는 정리: 하루 시작 5시 · 용기 버튼 → ⚔️ 용기 카드 · 구슬 개수 = 점수 ---- */
var T67=0;
function mig67(){
  if(!ready||!C||!C.actions)return;if(typeof mode!=='undefined'&&mode==='db'&&typeof SRV59!=='undefined'&&!SRV59.c)return;
  let ch=false;
  if(!C.mig67ds){C.mig67ds=1;if(+C.dayStart!==5){C.dayStart=5;ch=true;try{curDK=dateKey()}catch(e){}}ch=true}
  if(!C.mig67k){C.mig67k=1;ch=true;const sz=p=>p>=3?'l':p<=1?'s':'m';
    (C.courage||[]).forEach(k=>{if(k.doneAt||k.m67||k.id==='free')return;
      const ex=C.actions.find(a=>a.name===k.name&&a.brave);if(ex){k.m67=ex.id;return}
      const id='kc'+k.id;if(C.actions.some(a=>a.id===id)){k.m67=id;return}
      const a={id,name:k.name,type:'good',area:C.areas.some(x=>x.id===k.area)?k.area:(C.areas.find(x=>x.id==='life')||C.areas[0]).id,
        xp:Math.max(0,+k.xp||0),gold:Math.max(0,+k.gold||0),cond:Math.abs(+k.cond||0),marble:k.marble||'',once:k.once?'1':'',brave:sz(+k.pts||2),k67:k.id};
      C.actions.push(a);k.m67=id})}
  if(C.jarMn67==null){C.jarMn67='score';ch=true}
  if(ch)save('config');
}

/* ---- 1) 이름: 행동/습관 화면 → '기록하기' ---- */
function nav67(){try{const n=NAV_ITEMS.find(x=>x[0]==='log');if(n&&n[1]!=='기록하기'){n[1]='기록하기';n[2]='용기·행동/습관·식사·몸무게·구슬·오늘 한 일 — 기록하는 곳'}}catch(e){}}
nav67();
renderNav=(function(prev){return function(){nav67();return prev.apply(this,arguments)}})(renderNav);

/* ---- 2) '그날 컨디션 · 기록 n개' 풀어 보기 ---- */
function dayCount67(day){const K=K67().KIND,o={};(day.entries||[]).forEach(e=>{const k=e.kind==='jar'&&e.an66?'jar':e.kind;o[k]=(o[k]||0)+1});
  const food=C.food.reduce((s,f)=>s+(+((day.food||{})[f.id]||0)>0?1:0),0);
  return {o,food,list:Object.entries(o).sort((a,b)=>b[1]-a[1]).map(([k,n])=>[K[k]||k,n])}}
function daySum67(){const el=$('logDaySum');if(!el)return;const day=curDay(),c=dayCount67(day),n=(day.entries||[]).length,hp=overallOf(day);
  el.innerHTML=`<button type="button" class="linkbtn ds67" data-ds67="1" title="무엇을 셌는지 보기">HP ${hp} · 기록 ${n}개${c.food?` · 식사 칸 ${c.food}`:''} ⓘ</button>`}
function daySheet67(){const day=curDay(),c=dayCount67(day),hp=overallOf(day),base=C.energyBase[(day.energy||3)-1]??60;sheetCtx={ds67:1};
  openSheet(`<div class="sh"><h3>${ui.off?'그날':'오늘'} 숫자 풀이</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
  <p class="small" style="margin:0"><b>HP ${hp}</b> = 아침 시작점 ${base}(${ENERGY_LBL[(day.energy||3)-1]||'보통'}) + 오늘 컨디션 변화의 합. 영역 평균이 아니에요.</p>
  <p class="small" style="margin:10px 0 4px"><b>기록 ${(day.entries||[]).length}개</b> = '오늘 한 일'에 적힌 줄 수예요. 종류별로:</p>
  <div class="brk">${c.list.map(([k,n])=>`<span>${esc(k)}</span><span>${n}</span>`).join('')||'<span>아직 없어요</span><span></span>'}</div>
  <p class="tiny muted" style="margin:8px 0 0">일퀘 상자·보스 처치·흐름 보너스 같은 보너스 줄도 하나로 세요. 식사 칸(채소·나쁜 식사 등)은 줄이 아니라 칸의 숫자라서 따로 셌어요${c.food?`(오늘 ${c.food}칸)`:''}. 몸무게는 줄 하나예요.</p>`)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-ds67]');if(!b)return;e.preventDefault();e.stopPropagation();daySheet67()},true);

/* ---- 3) 용기: 버튼 목록과 ⚔️ 용기 카드를 하나로 ---- */
function braveCards67(){return C.actions.filter(a=>a.brave&&a.type==='good'&&!a.dopaOnly)}
function braveActs67(){const el=$('braveActs');if(!el||!C.mig67k)return;const day=curDay();
  const list=braveCards67(),sz=a=>({s:'작은',m:'보통',l:'큰'})[a.brave]||'';
  const h=list.map(a=>{const n=day.entries.filter(e=>e.kind==='act'&&e.aid===a.id).length;
    return `<div class="act brave" data-info="act:${a.id}" tabindex="0" role="button" aria-label="${esc(a.name)} 설명·편집"><button class="chk ${n?'on':''}" data-act="${a.id}" aria-label="${esc(a.name)} 했어요 기록">${n?(n>1?n:'✓'):''}</button><span class="ab"><span class="n">${esc(a.name)}${a.once?' <span class="oncetag">한 번</span>':''}</span><span class="tiny muted">⚔️ ${sz(a)} 용기</span></span><span class="meta"><span class="xp">+${a.xp}</span></span></div>`}).join('')
    ||'<div class="empty">⚔️ 용기 카드가 없어요. 아래에 하고 싶은 무서운 일을 적어 보세요.</div>';
  el.innerHTML=h;
  const tl=$('braveTools');if(tl&&!tl.querySelector('.k67'))tl.innerHTML=`<span class="tiny muted k67">⚔️ 표시가 붙은 행동 카드예요 · 카드 편집에서 ⚔️를 붙이면 여기 같이 떠요</span>`;
  const inp=$('addCourage');if(inp)inp.placeholder='⚔️ 용기 카드 추가 (예: 먼저 연락하기)'}
// 용기 추가 = ⚔️ 용기 카드 만들기
window.addEventListener('submit',e=>{const f=e.target&&e.target.closest&&e.target.closest('[data-addform="courage"]');if(!f||!C.mig67k)return;
  const once=$('addCourageOnce')&&$('addCourageOnce').value;if(once)return; // '한 번' = 오늘 할 일(원래대로)
  e.preventDefault();e.stopImmediatePropagation();const inp=f.querySelector('input'),name=(inp.value||'').trim();if(!name){inp.focus();return}
  const a=newAction(uid(),name,'good',(C.areas.find(x=>x.id==='life')||C.areas[0]).id,'');a.brave='m';const z=braveSize(a);if(z){a.xp=+z.xp||a.xp;a.gold=+z.gold||a.gold;a.marble=a.marble||z.marble||''}
  C.actions.push(a);inp.value='';inp.blur();save('config');render();toast(`⚔️ 용기 카드 '${name}'를 만들었어요`)},true);
function braveCardsNote(){if(!C.mig67k)return '';const bs=braveCards67(),sz={s:'작은',m:'보통',l:'큰'};
  return `<div id="k67note" class="k67n"><p class="help" style="margin:0"><b>용기 버튼 목록은 ⚔️ 용기 카드로 합쳤어요.</b> 이제 용기도 다른 행동처럼 <b>행동 카드</b>예요 — 카드에 ⚔️(작은·보통·큰)를 붙이면 기록할 때 용기 점수·용기 구슬이 같이 쌓이고, 기록하기 화면의 ⚔️ 용기 칸·⚔️ 용기 거르기에 같이 보여요. XP·골드·영역은 카드 편집에서 바꿔요.</p>
    <div class="row" style="gap:4px;flex-wrap:wrap;margin:8px 0">${bs.map(a=>`<button class="chipbtn" data-aedit="${a.id}">⚔️ ${esc(a.name)} <small class="muted">${sz[a.brave]||''} · ✨${a.xp}</small></button>`).join('')||'<span class="tiny muted">아직 없어요</span>'}</div>
    <p class="tiny muted" style="margin:0">예전 기록(용기 버튼으로 적은 것)은 그대로 남아 있어요. 새 용기는 기록하기 → ⚔️ 용기 칸 아래 입력칸에서 만들어요.</p></div>`}
renderEdit=(function(prev){return function(){const r=prev.apply(this,arguments);
  try{if(ui.edit==='courage'&&C.mig67k){const n=$('k67note');if(n){const pv=n.previousElementSibling;if(pv&&pv.matches('p.help'))pv.remove();
      let x=n.nextElementSibling;while(x){const nx=x.nextElementSibling,stop=x.querySelector&&x.querySelector('[data-addrow="courage"]');x.remove();if(stop)break;x=nx}}}}catch(e){console.error(e)}
  return r}})(renderEdit);
goBrave=(function(prev){return function(){try{const L=lay59(),it=L.find(x=>x[0]==='brave');if(it&&it[2]){it[2]=0;save('config')}}catch(e){}return prev.apply(this,arguments)}})(goBrave);

/* ---- 4) 영역 레벨: 따로 곡선 · 칭호 · 마일스톤 골드 ---- */
function aNeed67(lv){return 60+30*(lv-1)}
function aLevel67(xp){let lv=1,rem=Math.max(0,xp||0);while(rem>=aNeed67(lv)&&lv<999){rem-=aNeed67(lv);lv++}return {lv,rem,need:aNeed67(lv)}}
function aCum67(lv){let s=0;for(let l=1;l<lv;l++)s+=aNeed67(l);return s}
function aTitle67(id,lv){const T=K67().TITLES[id]||K67().GEN,i=K67().TIER.reduce((k,t,j)=>lv>=t?j:k,0);return T[i]||T[T.length-1]}
function aGold67(lv){return lv*10}
function aMile67(){
  if(!ready||!C||!C.areas)return;if(typeof mode!=='undefined'&&mode==='db'&&typeof SRV59!=='undefined'&&!SRV59.c)return;
  if(!T67)T67=Date.now();if(Date.now()-T67<6000)return; // 기록이 다 올라온 뒤에
  if(aMile67.t&&Date.now()-aMile67.t<20000)return;aMile67.t=Date.now();
  const T=areaTotal66();let first=!C.amile67;if(first)C.amile67={};let ch=first;
  C.areas.forEach(a=>{const L=aLevel67(T[a.id]||0),got=+C.amile67[a.id]||0;
    if(first||got===0&&!(a.id in C.amile67)){C.amile67[a.id]=L.lv;ch=true;return}  // 처음엔 지금 레벨을 기준점으로(보상 없이)
    const hit=K67().AMS.filter(m=>m>got&&m<=L.lv);
    if(L.lv>got){C.amile67[a.id]=L.lv;ch=true}
    hit.forEach(m=>{const g=aGold67(m),e={kind:'amile67',type:'good',name:`🧭 ${a.name} Lv.${m} · ${aTitle67(a.id,m)}`,area:'',xp:0,gold:g,cond:0,lv67:m,ar67:a.id};
      commit(()=>applyEntry(today(),e));later(()=>popup('영역 마일스톤','🧭',`<b>${esc(a.name)} Lv.${m}</b><br>칭호: <b>${esc(aTitle67(a.id,m))}</b><br><span style="color:var(--gold)">+💰${g}</span>`,'Lv.'+m))})});
  if(ch)save('config')}
function aJourney67(id){const a=C.areas.find(x=>x.id===id);if(!a)return;const T=areaTotal66(),xp=T[id]||0,L=aLevel67(xp);sheetCtx={aj67:id};
  const W=areaWeek66(weekStart(dateKey()));let pace=0;{let s=0,n=0;lastNDates(28).forEach(k=>{const d=DAYS[k];if(!d||!hasData(d))return;n++;(d.entries||[]).forEach(e=>{if(e.area===id&&e.type!=='bad'&&(e.xp||0)>0)s+=e.xp})});pace=n?s/n:0}
  const rows=K67().AMS.map(m=>{const need=Math.max(0,aCum67(m)-xp),done=L.lv>=m,days=!done&&pace>0?Math.ceil(need/pace):null;
    return `<li class="${done?'ok':''}"><span class="num">Lv.${m}</span><span>${esc(aTitle67(id,m))}${K67().TIER.includes(m)?' <small class="muted">새 칭호</small>':''}</span><span class="num small">💰${aGold67(m)}</span><span class="tiny muted">${done?'✓ 지남':`✨${need} 남음${days?` · 지금 속도로 약 ${days}일`:''}`}</span></li>`}).join('');
  openSheet(`<div class="sh"><h3>🧭 ${esc(a.name)} 영역 여정</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
  <div class="aj67top"><b style="font-size:22px">Lv.${L.lv}</b> <span>${esc(aTitle67(id,L.lv))}</span><div class="track" style="margin-top:6px"><div class="fill" style="width:${Math.round(L.rem/L.need*100)}%"></div></div>
  <div class="tiny muted" style="margin-top:4px">다음 레벨까지 ✨${L.need-L.rem} · 이 영역에 쌓인 XP ✨${xp} · 이번 주 ✨${W[id]?W[id].xp:0} · 최근 4주 하루 평균 ✨${Math.round(pace)}</div></div>
  <ol class="aj67">${rows}</ol>
  <p class="tiny muted" style="margin:8px 0 0">영역 레벨은 <b>그 영역 카드·할 일로 받은 XP</b>로 올라요(XP를 따로 더 주지 않아요 — 같은 XP를 영역별로 나눠 보는 거예요). 영역마다 쌓이는 속도가 달라서 전체 레벨보다 완만한 곡선을 써요: Lv.1→2 ✨60, 그다음부터 레벨마다 ✨30씩 더. 마일스톤에 닿으면 골드(레벨×10)를 받고, 3·5·10·15·20레벨에 칭호가 바뀌어요.${a.id==='money'?' 경제는 컨디션보다 ₩ 아낀 돈·쓴 돈이 중요해서, 돌아보기 → 🧭 영역의 흐름에서 ₩ 막대로 따로 보여요.':''}</p>`)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-aj67]');if(!b)return;e.preventDefault();e.stopPropagation();aJourney67(b.dataset.aj67)},true);

/* ---- 5) HP '요즘 지표' (최근 날들의 하루 끝 HP를 최근일수록 무겁게) ---- */
function trend67(end,area){let s=0,w=0,n=0;for(let i=0;i<14;i++){const k=addDays(end,-i),d=DAYS[k];if(!d||!hasData(d))continue;const v=area?(areaValues(d)[area]):overallOf(d);if(v==null)continue;const wt=Math.pow(.75,i);s+=v*wt;w+=wt;n++}
  return n>=2?Math.round(s/w):null}
function trendLine67(area){const td=dateKey(),a=trend67(td,area),b=trend67(addDays(td,-7),area);if(a==null)return '';
  const d=b==null?null:a-b;return `📈 요즘 지표 <b class="num">${a}</b>${d==null?'':` <span class="tiny muted">(일주일 전 ${b} · ${d===0?'같음':(d>0?'▲':'▼')+Math.abs(d)})</span>`}`}
infoFor=(function(prev){return function(k){const r=prev.apply(this,arguments);
  try{if(r&&k==='hp'){const t=trendLine67();r.b+=`<div class="tr67">${t||'📈 요즘 지표는 이틀 넘게 기록하면 보여요.'}<p class="tiny muted" style="margin:4px 0 0">오늘 HP는 매일 아침 새로 시작해요. <b>요즘 지표</b>는 최근 2주의 '하루 끝 HP'를 최근일수록 무겁게 평균 낸 값이라 천천히 움직여요 — 요 며칠 선택이 쌓인 대략적인 몸·마음 상태예요. 영역마다 따로 보려면 돌아보기 → 🧭 영역.</p></div>`}
    if(r&&k&&k.startsWith('area:')){const id=k.slice(5),T=areaTotal66(),L=aLevel67(T[id]||0),t=trendLine67(id);r.b+=`<div class="tr67">${t?t+'<br>':''}🧭 영역 레벨 <b>Lv.${L.lv} ${esc(aTitle67(id,L.lv))}</b> <button type="button" class="linkbtn" data-aj67="${id}">영역 여정 보기</button></div>`}
    if(r&&k==='lv'){r.b+=pace67()}}catch(e){console.error(e)}
  return r}})(infoFor);
function pace67(){const ds=lastNDates(14).map(k=>DAYS[k]).filter(d=>d&&hasData(d));if(ds.length<3)return '<p class="tiny muted">기록이 3일 넘게 쌓이면 지금 속도로 다음 레벨까지 며칠인지 알려줘요.</p>';
  const avg=ds.reduce((s,d)=>s+(d.entries||[]).reduce((a,e)=>a+Math.max(0,e.xp||0),0),0)/ds.length,L=levelOf(P.xp),nx=nextStage(L.lv);
  const dl=avg>0?Math.ceil((L.need-L.rem)/avg):null,dn=nx&&avg>0?Math.ceil(xpTo(nx.lv)/avg):null;
  return `<div class="tr67">⏱ 최근 기록한 날 평균 <b>✨${Math.round(avg)}</b>/일 → 다음 레벨 약 <b>${dl}일</b>${dn?` · 다음 여정(${esc(nx.name)}) 약 ${dn}일`:''}<p class="tiny muted" style="margin:4px 0 0">레벨 곡선: Lv.1→2 ✨100, 그다음부터 레벨마다 ✨${C.xpStep}씩 더 필요해요. 한 레벨 걸리는 날이 천천히 늘어나요(편집 → 규칙에서 바꿀 수 있어요).</p></div>`}

/* ---- 6) 🧭 영역 칸 새로: 영역 레벨·칭호 · HP 흐름(종합/영역/₩) · 요즘 지표 ---- */
function areasHTML66(ws){const W=areaWeek66(ws),Pw=areaWeek66(addDays(ws,-7)),T=areaTotal66(),mx=Math.max(1,...C.areas.map(a=>W[a.id].xp));
  const low=C.areas.filter(a=>a.id!=='money').slice().sort((a,b)=>W[a.id].xp-W[b.id].xp)[0];
  const td=dateKey(),days=[...Array(7)].map((_,i)=>addDays(ws,i)),sel=ui.hp67||'all',selA=C.areas.find(a=>a.id===sel);
  const isMoney=sel==='₩';
  const bar=k=>{const d=DAYS[k];const lb=`<span class="tiny muted">${wdOf(k)}</span>`;
    if(k>td||!d||!hasData(d))return `<div class="hp66">${lb}<i style="--h:0"></i><span class="tiny muted">${k>td?'·':'-'}</span></div>`;
    if(isMoney){let sv=0,sp=0;(d.entries||[]).forEach(e=>{if(e.amt){if(e.type==='bad')sp+=+e.amt;else sv+=+e.amt}});const net=sv-sp,M=Math.max(1,...days.map(x=>{let a=0,b=0;((DAYS[x]||{}).entries||[]).forEach(e=>{if(e.amt){if(e.type==='bad')b+=+e.amt;else a+=+e.amt}});return Math.max(a,b)}));
      return `<div class="hp66 m67" title="아낌 ₩${sv.toLocaleString()} · 씀 ₩${sp.toLocaleString()}">${lb}<i class="mm67"><b class="sv" style="--h:${Math.round(sv/M*100)}"></b><b class="sp" style="--h:${Math.round(sp/M*100)}"></b></i><span class="tiny num">${net===0?'0':(net>0?'+':'−')+Math.abs(Math.round(net/1000))+'k'}</span></div>`}
    const b=C.energyBase[(d.energy||3)-1]??60,v=selA?areaValues(d)[selA.id]:overallOf(d);
    return `<div class="hp66" title="시작 ${b} → 끝 ${v}">${lb}<i style="--h:${v}"><b style="--h:${b}"></b></i><span class="tiny num">${v}</span></div>`};
  const tabs=`<div class="row hp67t" style="gap:4px;flex-wrap:wrap">${[['all','종합']].concat(C.areas.filter(a=>a.id!=='money').map(a=>[a.id,a.name])).concat([['₩','₩ 경제']]).map(([k,l])=>`<button type="button" class="chipbtn" data-hp67="${k}" aria-pressed="${sel===k}">${esc(l)}</button>`).join('')}</div>`;
  const tl=isMoney?'':trendLine67(selA?selA.id:null);
  const ex=isMoney?'경제는 컨디션과 잘 안 맞아서 ₩로 봐요: 위 막대 = 아낀 돈, 아래 막대 = 쓴 돈(행동 기록에 적은 금액). 숫자 = 그날 아낀 것 − 쓴 것(천 원).'
    :selA?`${esc(selA.name)} 막대 = 아침 시작점 + <b>${esc(selA.name)} 영역</b> 컨디션 변화만 더한 값이에요(영역 하나만 보는 눈).`
    :'종합 막대 = 아침 시작점 + <b>모든</b> 컨디션 변화의 합(평균이 아니에요). 이게 홈의 HP예요.';
  return `<div class="panel"><div class="ptitle"><h2>🧭 영역</h2><span class="tiny muted">이번 주 XP · 영역 레벨(이름을 누르면 여정)</span></div>
    <div class="ar66">${C.areas.map(a=>{const w=W[a.id],p=Pw[a.id],L=aLevel67(T[a.id]||0),d=w.xp-p.xp;
      return `<div class="arr66"><span class="nm"><button type="button" class="linkbtn" data-aj67="${a.id}">${esc(a.name)}</button> <span class="muted">Lv.${L.lv}</span><span class="t67">${esc(aTitle67(a.id,L.lv))}</span></span><span class="bar66"><i style="width:${Math.round(w.xp/mx*100)}%"></i></span><span class="num small">✨${w.xp}</span><span class="tiny muted">${w.n}번 · ${d===0?'지난주와 같음':(d>0?'▲':'▼')+Math.abs(d)}${a.id==='money'?` · ₩ 아낌 ${w.sv.toLocaleString()} / 씀 ${w.sp.toLocaleString()}`:''}</span></div>`}).join('')}</div>
    ${low?`<p class="small" style="margin:8px 0 0">이번 주 가장 덜 돌본 영역: <b>${esc(low.name)}</b> <a class="linkbtn" href="#log">기록하기에서 하나 하기</a></p>`:''}
    <h3 class="small" style="margin:14px 0 6px">🔋 하루하루 흐름 <span class="tiny muted">${isMoney?'₩ 아낌/씀':'막대 = 하루 끝, 가는 선 = 아침 시작점'}</span></h3>${tabs}
    <div class="hps66" style="margin-top:8px">${days.map(bar).join('')}</div>
    ${tl?`<p class="small" style="margin:8px 0 0">${tl}</p>`:''}
    <p class="tiny muted" style="margin:6px 0 0">${ex} 요즘 지표 = 최근 2주 하루 끝 값을 최근일수록 무겁게 평균(천천히 움직이는 대략적인 상태). 어제 HP가 ${C.recovery.threshold} 아래였으면 오늘 XP ×${C.recovery.mult}(복귀 보너스).</p></div>`}
document.addEventListener('click',e=>{const b=e.target.closest('[data-hp67]');if(!b)return;e.preventDefault();e.stopPropagation();ui.hp67=b.dataset.hp67;try{renderReview59()}catch(x){}},true);

/* ---- 7) 몸 기록: 식사·몸무게·HP 종합 ---- */
function bodyAll67(){const n=ui.bd67||30,ks=lastNDates(n),days=ks.map(k=>DAYS[k]).filter(d=>d&&hasData(d));
  const food=C.food.map(f=>{let tot=0,dd=0,run=0,best=0;ks.forEach(k=>{const v=+(((DAYS[k]||{}).food||{})[f.id]||0);tot+=v;if(v>0){dd++;run++;best=Math.max(best,run)}else run=0});return {f,tot,dd,best}});
  const ws=ks.map(k=>[k,(DAYS[k]||{}).weight]).filter(x=>x[1]);
  const w0=ws[0],w1=ws[ws.length-1],wmin=ws.length?Math.min(...ws.map(x=>x[1])):null,wmax=ws.length?Math.max(...ws.map(x=>x[1])):null;
  const hp=days.length?Math.round(days.reduce((s,d)=>s+overallOf(d),0)/days.length):null;
  const cards=food.map(({f,tot,dd,best})=>{const neg=(+f.points||0)<0;return `<div class="bf67 ${neg?'neg':''}"><b>${neg?'▼':'▲'} ${esc(f.name)}</b><span class="num">${f.kind==='check'?dd+'일':tot+'번'}</span><span class="tiny muted">${dd}일 기록 · ${Math.round(dd/n*100)}%${f.kind!=='check'&&dd?` · 기록한 날 평균 ${(tot/dd).toFixed(1)}`:''}${!neg&&best>1?` · 연속 최고 ${best}일`:''}${neg&&dd<n?` · 없던 날 ${n-dd}일`:''}</span></div>`}).join('');
  const rows=ks.slice().reverse().filter(k=>{const d=DAYS[k];return d&&(d.weight||C.food.some(f=>+((d.food||{})[f.id]||0)>0)||hasData(d))}).slice(0,n).map(k=>{const d=DAYS[k];
    const fs=C.food.map(f=>{const v=+((d.food||{})[f.id]||0);if(!v)return '';const neg=(+f.points||0)<0;return `<span class="fc67 ${neg?'neg':''}">${neg?'▼':'▲'}${esc(f.name.replace(/ ?(횟수|챙겨 먹음|먹음)$/,''))}${f.kind==='check'?'':' ×'+v}</span>`}).join('');
    return `<div class="br67"><span class="num small">${fmtD(k)} <span class="muted">${wdOf(k)}</span></span><span class="num small">${d.weight?d.weight+'kg':'<span class="muted">-</span>'}</span><span class="fcs67">${fs||'<span class="tiny muted">식사 기록 없음</span>'}</span><span class="num tiny" title="그날 HP">🔋${overallOf(d)}</span></div>`}).join('');
  return `<div class="panel" id="body67"><div class="ptitle"><h2>🍽 몸 종합 기록</h2><span class="row" style="gap:4px">${[7,30,90].map(x=>`<button type="button" class="chipbtn" data-bd67="${x}" aria-pressed="${n===x}">${x}일</button>`).join('')}</span></div>
    <div class="bs67"><div><span class="tiny muted">몸무게</span><b class="num">${w1?w1[1]+'kg':'-'}</b><span class="tiny muted">${w0&&w1&&w0!==w1?`${n}일 동안 ${(w1[1]-w0[1]>0?'+':'')}${(w1[1]-w0[1]).toFixed(1)}kg · 최저 ${wmin} · 최고 ${wmax}`:'기록 '+ws.length+'번'}</span></div>
      <div><span class="tiny muted">잰 날</span><b class="num">${ws.length}일</b><span class="tiny muted">${n}일 중</span></div>
      <div><span class="tiny muted">평균 HP</span><b class="num">${hp==null?'-':hp}</b><span class="tiny muted">${trendLine67()?'요즘 지표 '+(trend67(dateKey())??'-'):'기록한 날 기준'}</span></div></div>
    <div class="bfs67">${cards}</div>
    <h3 class="small" style="margin:12px 0 4px">날짜별 <span class="tiny muted">몸무게 · 식사 칸 · 그날 HP</span></h3><div class="brs67">${rows||'<div class="empty">아직 기록이 없어요.</div>'}</div></div>`}
function renderBody67(){const v=document.querySelector('[data-view="body"]');if(!v||curView()!=='body')return;let el=$('body67');const h=bodyAll67();
  if(!el){const first=v.querySelector(':scope>.panel');if(first)first.insertAdjacentHTML('afterend',h);else v.insertAdjacentHTML('beforeend',h)}
  else if(el.dataset.h67!==h){const t=document.createElement('div');t.innerHTML=h;el.innerHTML=t.firstElementChild.innerHTML}
  el=$('body67');if(el)el.dataset.h67=h}
document.addEventListener('click',e=>{const b=e.target.closest('[data-bd67]');if(!b)return;e.preventDefault();e.stopPropagation();ui.bd67=+b.dataset.bd67;renderBody67()},true);

/* ---- 8) 유리병: 순서 바꾸기(끌기) · 연결된 구슬은 점수만큼 ---- */
applyEntry=(function(prev){return function(day,e){
  try{if(e&&e.jar&&!e.an66&&e.type!=='bad'&&['act','task','courage','routine','free','happy'].includes(e.kind)&&C.jarMn67==='score'&&!e.mn67){const u=Math.max(1,+C.jarUnit67||10),mx=Math.max(1,+C.jarMax67||5);
    const k=clamp(Math.round((+e.xp||0)/u),1,mx);if(k>(+e.mn||1)){e.mn=k}e.mn67=1}}catch(x){}
  return prev.apply(this,arguments)}})(applyEntry);
function roSheet67(){sheetCtx={ro67:1};const y=$('sheetC')?$('sheetC').scrollTop:0;const cnt={};
  Object.values(DAYS).forEach(d=>(d.entries||[]).forEach(e=>{if(e.jar&&e.type!=='bad'){const k=e.jar+'|'+(e.mt||'');cnt[k]=(cnt[k]||0)+(+e.mn||1);cnt[e.jar]=(cnt[e.jar]||0)+(+e.mn||1)}}));
  const u=Math.max(1,+C.jarUnit67||10),mx=Math.max(1,+C.jarMax67||5);
  openSheet(`<div class="sh"><h3>↕ 병·구슬 순서</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
  <p class="tiny muted" style="margin:0 0 8px">⋮⋮를 끌거나 ↑↓로 순서를 바꿔요. 병 순서 = 화면에 놓이는 순서, 구슬 순서 = 고르는 단추 순서예요.</p>
  <div class="ro67" data-ro67l="jars">${C.jars.map((j,i)=>`<div class="ro67r" data-ro67="jars|${j.id}"><span class="hand">⋮⋮</span><span class="minijar sm67">${jarSVG(j,false)}</span><b>${esc(j.name)}</b><span class="tiny muted">${cnt[j.id]||0}개</span><span style="flex:1"></span><button class="ib" data-ro67m="jars|${j.id}|-1" aria-label="위로">↑</button><button class="ib" data-ro67m="jars|${j.id}|1" aria-label="아래로">↓</button></div>
    <div class="ro67 sub" data-ro67l="t:${j.id}">${j.types.map(t=>`<div class="ro67r" data-ro67="t:${j.id}|${t.id}"><span class="hand">⋮⋮</span><span>${mGlyph(t)} ${esc(t.name)}</span><span class="tiny muted">${cnt[j.id+'|'+t.id]||0}개</span><span style="flex:1"></span><button class="ib" data-ro67m="t:${j.id}|${t.id}|-1" aria-label="위로">↑</button><button class="ib" data-ro67m="t:${j.id}|${t.id}|1" aria-label="아래로">↓</button></div>`).join('')}
    <button type="button" class="linkbtn tiny" data-ro67s="${j.id}">많이 넣은 순으로</button></div>`).join('')}</div>
  <h3 class="small" style="margin:14px 0 4px">행동·할 일에 이어진 구슬은 몇 개?</h3>
  <div class="row" style="gap:4px;flex-wrap:wrap"><button type="button" class="chipbtn" data-mn67="score" aria-pressed="${C.jarMn67==='score'}">점수만큼 (✨${u}마다 1개, 최대 ${mx}개)</button><button type="button" class="chipbtn" data-mn67="one" aria-pressed="${C.jarMn67!=='score'}">늘 1개</button></div>
  <p class="tiny muted" style="margin:6px 0 0">이어진 구슬은 <b>XP를 따로 주지 않아요</b> — 행동·할 일 점수에 구슬이 '얹혀서' 들어가요. 그래서 점수만큼 넣어도 두 번 받는 게 아니에요. 예: 설거지 ✨10 → 구슬 1개, 대청소 ✨30 → 구슬 3개. 직접 넣는 구슬(구슬 넣기)만 병 XP를 받아요.</p>`);try{$('sheetC').scrollTop=y}catch(x){}}
function roMove67(list,id,to){let arr,setter;if(list==='jars'){arr=C.jars}else{const j=C.jars.find(x=>x.id===list.slice(2));if(!j)return;arr=j.types}
  const i=arr.findIndex(x=>x.id===id);if(i<0)return;const [it]=arr.splice(i,1);arr.splice(clamp(to,0,arr.length),0,it);save('config');roSheet67();try{render();renderJars()}catch(e){}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-ro67m],[data-ro67s],[data-mn67],[data-ro67open]');if(!b)return;e.preventDefault();e.stopPropagation();
  if(b.dataset.ro67open){roSheet67();return}
  if(b.dataset.mn67){C.jarMn67=b.dataset.mn67;save('config');roSheet67();return}
  if(b.dataset.ro67s){const j=C.jars.find(x=>x.id===b.dataset.ro67s);if(!j)return;const c={};Object.values(DAYS).forEach(d=>(d.entries||[]).forEach(e=>{if(e.jar===j.id)c[e.mt]=(c[e.mt]||0)+(+e.mn||1)}));j.types.sort((a,b)=>(c[b.id]||0)-(c[a.id]||0));save('config');roSheet67();try{render();renderJars()}catch(x){}return}
  const [l,id,d]=b.dataset.ro67m.split('|');const arr=l==='jars'?C.jars:(C.jars.find(x=>x.id===l.slice(2))||{}).types||[];const i=arr.findIndex(x=>x.id===id);roMove67(l,id,i+(+d))},true);
(function(){let dr=null;
  document.addEventListener('pointerdown',e=>{const h=e.target.closest('.ro67r>.hand');if(!h||e.button>0)return;const r=h.parentElement;dr={r,y:e.clientY,on:false,list:r.parentElement.dataset.ro67l,id:r.dataset.ro67.split('|')[1]};e.preventDefault()},true);
  document.addEventListener('pointermove',e=>{if(!dr)return;if(!dr.on){if(Math.abs(e.clientY-dr.y)<5)return;dr.on=true;dr.r.classList.add('drag61')}e.preventDefault();dr.r.style.transform=`translateY(${e.clientY-dr.y}px)`},{passive:false});
  document.addEventListener('pointerup',e=>{if(!dr)return;const d=dr;dr=null;d.r.style.transform='';d.r.classList.remove('drag61');if(!d.on)return;
    const sibs=[...d.r.parentElement.querySelectorAll(':scope>.ro67r')];let to=0;sibs.forEach((s,i)=>{if(s===d.r)return;const b=s.getBoundingClientRect();if(e.clientY>b.top+b.height/2)to=i+1});
    const from=sibs.indexOf(d.r);if(to>from)to--;if(to!==from)roMove67(d.list,d.id,to)});
})();

renderJars=(function(prev){return function(){const r=prev.apply(this,arguments);try{const bar=document.querySelector('.jbar66 .row');if(bar&&!bar.querySelector('[data-ro67open]'))bar.insertAdjacentHTML('beforeend','<button type="button" class="chipbtn" data-ro67open="1">↕ 순서 · 구슬 개수</button>')}catch(e){}return r}})(renderJars);
/* ---- 9) 한 줄 일기: 빈칸 없이, 적고 싶을 때만 ---- */
normDay=(function(prev){return function(k,raw){const d=prev.apply(this,arguments);try{if(raw&&Array.isArray(raw.j67))d.j67=clone(raw.j67)}catch(e){}return d}})(normDay);
function jRow65(){return ''}
function jAll67(k){const d=DAYS[k]||{},out=[];Object.entries(d.j65||{}).forEach(([s,v])=>{if(v&&(v.txt||v.m))out.push({id:'s:'+s,t:v.t||((J65.find(x=>x[0]===s)||[])[2]||''),m:v.m||'',txt:v.txt||'',old:1})});
  (d.j67||[]).forEach(v=>out.push(v));return out.sort((a,b)=>String(a.t).localeCompare(String(b.t)))}
function jForm67(){const m=ui.jm67||'';return `<form class="j67f" id="j67F"><input id="j67T" maxlength="200" placeholder="💬 한 줄 남기기 — 적고 싶을 때만 (Enter)" autocomplete="off" enterkeyhint="done"><span class="j67m">${JM65.map(([k,ic,n])=>`<button type="button" data-jm67="${k}" aria-pressed="${m===k}" title="${n}" aria-label="기분 ${n}">${ic}</button>`).join('')}</span><button class="btn sm" type="submit">남기기</button></form>`}
function jSave67(){const i=$('j67T'),txt=((i&&i.value)||'').trim(),m=ui.jm67||'';if(!txt&&!m){i&&i.focus();return}if(!guard())return;
  commit(()=>{const d=today();d.j67=Array.isArray(d.j67)?d.j67:[];d.j67.push({id:uid(),t:stamp(),m,txt})});ui.jm67='';if(i)i.value='';toast('💬 남겼어요');try{render();renderReview59()}catch(e){}}
function jDel67(k,id){const d=DAYS[k];if(!d)return;if(id.startsWith('s:')){const s=id.slice(2);if(d.j65)delete d.j65[s]}else d.j67=(d.j67||[]).filter(x=>x.id!==id);save(k);try{render();renderReview59()}catch(e){}toast('지웠어요')}
document.addEventListener('submit',e=>{if(!e.target||e.target.id!=='j67F')return;e.preventDefault();e.stopImmediatePropagation();jSave67()},true);
document.addEventListener('click',e=>{const m=e.target.closest('[data-jm67]');if(m){e.preventDefault();e.stopPropagation();ui.jm67=ui.jm67===m.dataset.jm67?'':m.dataset.jm67;document.querySelectorAll('[data-jm67]').forEach(x=>x.setAttribute('aria-pressed',x.dataset.jm67===ui.jm67));return}
  const d=e.target.closest('[data-jd67]');if(d){e.preventDefault();e.stopPropagation();const [k,id]=d.dataset.jd67.split('|');if(confirm('이 한 줄을 지울까요?'))jDel67(k,id)}},true);
function jWeek66(ws){const td=dateKey(),days=[...Array(7)].map((_,i)=>addDays(ws,i)),mood=m=>JM65.find(x=>x[0]===m)||[];
  const all=days.map(k=>[k,k>td?[]:jAll67(k)]),any=all.some(x=>x[1].length);
  const strip=any?`<div class="j67s" aria-label="이번 주 기분">${all.map(([k,L])=>`<div><span class="tiny muted">${wdOf(k)}</span><span class="j67d">${L.filter(v=>v.m).map(v=>`<span title="${esc(v.t+' '+(mood(v.m)[2]||''))}">${mood(v.m)[1]}</span>`).join('')||'<span class="muted">·</span>'}</span></div>`).join('')}</div>`:'';
  const list=all.slice().reverse().filter(x=>x[1].length).map(([k,L])=>`<article class="j67day"><header><b>${esc(fmtD(k))}</b> <span class="muted">${wdOf(k)}${k===td?' · 오늘':''}</span></header>${L.map(v=>`<p><span class="num tiny muted">${esc(v.t||'')}</span> ${v.m?mood(v.m)[1]+' ':''}${esc(v.txt||'')}<button type="button" class="ib" data-jd67="${k}|${v.id}" aria-label="지우기" title="지우기">×</button></p>`).join('')}</article>`).join('');
  const isNow=days.includes(td);
  return `<div class="panel jw66"><div class="ptitle"><h2>💬 한 줄</h2><span class="tiny muted">안 써도 되는 곳 · 빈칸을 채우는 숙제가 아니에요</span></div>
    ${isNow?jForm67():''}${strip}<div class="j67list">${list||`<p class="tiny muted" style="margin:6px 0 0">이 주에 남긴 한 줄이 없어요. 생각났을 때 한 줄이면 충분해요.</p>`}</div></div>`}
function jLog67(){const p=$('log')&&$('log').closest('.panel');if(!p)return;let f=$('j67L');if(f)f.hidden=!!ui.off;if(ui.off)return;
  if(!f){const pt=p.querySelector(':scope>.ptitle');if(!pt)return;pt.insertAdjacentHTML('afterend',`<div id="j67L"></div>`);f=$('j67L')}
  if(f.contains(document.activeElement))return;const L=jAll67(dateKey()),mood=m=>(JM65.find(x=>x[0]===m)||[])[1]||'';
  const h=jForm67()+(L.length?`<div class="j67today">${L.map(v=>`<span class="tiny"><span class="muted num">${esc(v.t||'')}</span> ${mood(v.m)} ${esc(v.txt||'')}</span>`).join('')}</div>`:'');if(f.dataset.h67!==h){f.innerHTML=h;f.dataset.h67=h}}

/* ---- 10) 모든 화면 배치 (홈·기록하기는 원래 것 · 할 일·캘린더·편집·게임 방법은 칸이 아닌 화면) ---- */
function lroot67(v){const s=document.querySelector(`.view[data-view="${v}"]`);if(!s)return null;const q=K67().VIEWS[v];return q?s.querySelector(q):s}
function lkey67(p,i){if(p.dataset.lk67)return p.dataset.lk67;let k=p.id;if(!k){const h=p.querySelector('h2');k=h?(h.id||h.textContent.replace(/[0-9▾▸]/g,'').replace(/\s+/g,' ').trim().slice(0,24)):''}if(!k)k='b'+i;return k}
function lblocks67(R){const out=[];let g=0;const add=(el,col,grp)=>{if(el.matches('.panel,.card')&&!el.matches('.rvtabs59,.l67bar'))out.push([el,col,grp])};
  [...R.children].forEach(c=>{if(c.classList.contains('l67')){c.querySelectorAll(':scope>.l67row').forEach(r=>{g++;r.querySelectorAll(':scope>.l67c>*,:scope>.l67w>*').forEach(x=>add(x,x.parentElement.dataset.c,g))})}
    else if(c.classList.contains('grid2')){g++;const st=c.querySelectorAll(':scope>.stack');if(st.length){st.forEach((s,i)=>[...s.children].forEach(x=>add(x,i?'R':'L',g)))}else [...c.children].forEach((x,i)=>add(x,i%2?'R':'L',g))}
    else{g++;add(c,'W',g)}});return out}
function lay67(v){C.lay67=C.lay67&&typeof C.lay67==='object'&&!Array.isArray(C.lay67)?C.lay67:{};return Array.isArray(C.lay67[v])?C.lay67[v]:null}
function apply67(v){v=v||curView();if(!(v in K67().VIEWS))return;const R=lroot67(v);if(!R)return;
  const bl=lblocks67(R);if(!bl.length)return;const seen={};const items=bl.map(([el,col,grp],i)=>{let k=lkey67(el,i);if(seen[k])k=k+'_'+(++seen[k]);else seen[k]=1;el.dataset.lk67=k;return {k,el,col,brk:i>0&&grp!==bl[i-1][2]?1:0}});
  ui.def67=ui.def67||{};if(!ui.def67[v]||items.some(x=>!ui.def67[v].some(y=>y[0]===x.k)))ui.def67[v]=items.map(x=>[x.k,x.col,0,0,x.brk]).concat((ui.def67[v]||[]).filter(y=>!items.some(x=>x.k===y[0])));
  ui.nm67=ui.nm67||{};items.forEach(x=>{const h=x.el.querySelector('h2');ui.nm67[v+'|'+x.k]=h?h.textContent.replace(/[▾▸]/g,'').trim().slice(0,30):x.k});
  let L=lay67(v);const saved=!!L;L=(L||ui.def67[v]).filter(x=>Array.isArray(x));
  items.forEach(x=>{if(!L.some(y=>y[0]===x.k)){const d=ui.def67[v].findIndex(y=>y[0]===x.k),prevK=d>0?ui.def67[v][d-1][0]:null,at=prevK?L.findIndex(y=>y[0]===prevK):-1;L.splice(at+1,0,[x.k,x.col,0,0])}});
  const ed=ui.lay67ed===v;const by={};items.forEach(x=>by[x.k]=x.el);
  // 줄(넓게) / 두 칸 묶음으로
  let wrap=R.querySelector(':scope>.l67');if(!wrap){wrap=document.createElement('div');wrap.className='l67';const f=bl[0][0];const top=f.closest('.grid2')&&f.closest('.grid2').parentElement===R?f.closest('.grid2'):(f.parentElement===R?f:f);R.insertBefore(wrap,top.parentElement===R?top:null)}
  const rows=[];let cur=null;L.forEach(it=>{const el=by[it[0]];if(!el)return;if(it[1]==='W'){rows.push({w:it});cur=null}else{if(!cur||it[4]&&(cur.L.length||cur.R.length)){cur={L:[],R:[]};rows.push(cur)}cur[it[1]==='R'?'R':'L'].push(it)}});
  const frag=document.createDocumentFragment();
  rows.forEach(r=>{const row=document.createElement('div');row.className='l67row';
    if(r.w){const c=document.createElement('div');c.className='l67w';c.dataset.c='W';c.appendChild(by[r.w[0]]);row.appendChild(c)}
    else{['L','R'].forEach(s=>{const c=document.createElement('div');c.className='l67c';c.dataset.c=s;r[s].forEach(it=>c.appendChild(by[it[0]]));row.appendChild(c)});if(!r.R.length||!r.L.length)row.classList.add('one')}
    frag.appendChild(row)});
  wrap.innerHTML='';wrap.appendChild(frag);
  R.querySelectorAll(':scope>.grid2').forEach(g=>{if(!g.querySelector('.panel,.card'))g.hidden=true});
  L.forEach(([k,col,fold,hide])=>{const el=by[k];if(!el)return;if(hide){el.hidden=true;el.dataset.hid67=1}else if(el.dataset.hid67){el.hidden=false;delete el.dataset.hid67}el.classList.toggle('lfold67',!!fold);
    const h=el.querySelector(':scope>.ptitle,:scope>h2');if(!h)return;let fb=el.querySelector('.lfb67');if(!fb){fb=document.createElement('button');fb.type='button';fb.className='lfb59 lfb67';(h.matches('h2')?h:h).appendChild(fb)}
    fb.dataset.lf67=v+'|'+k;fb.textContent=fold?'▸':'▾';fb.title=fold?'펴기':'접기';fb.setAttribute('aria-label',fold?'펴기':'접기')});
  if(!saved)ui.cur67=ui.cur67||{};ui.cur67=ui.cur67||{};ui.cur67[v]=L;
  // 배치 단추
  const sec=document.querySelector(`.view[data-view="${v}"]`);
  if(!sec.querySelector(`[data-l67open="${v}"]`)){const btn=`<button type="button" class="btn ghost sm" data-l67open="${v}">▦ 화면 배치</button>`;const ab=sec.querySelector('.ai67bar');
    if(ab)ab.insertAdjacentHTML('beforeend',btn);else{const bar=document.createElement('div');bar.className='l67bar';bar.innerHTML=btn;const tabs=sec.querySelector(':scope>.rvtabs59');if(tabs)tabs.after(bar);else sec.insertBefore(bar,sec.firstChild)}}
}
function L67(v){return (lay67(v)||ui.cur67&&ui.cur67[v]||ui.def67&&ui.def67[v]||[]).map(x=>[...x])}
function set67(v,L){C.lay67=C.lay67&&typeof C.lay67==='object'&&!Array.isArray(C.lay67)?C.lay67:{};C.lay67[v]=L;save('config');apply67(v);if(sheetCtx&&sheetCtx.l67===v)map67(v)}
function map67(v){sheetCtx={l67:v};const L=L67(v),nm=k=>(ui.nm67||{})[v+'|'+k]||k,w=innerWidth>=900;const y=$('sheetC')?$('sheetC').scrollTop:0;
  const blk=x=>`<div class="lm61b ${x[3]?'off':''}" data-lm67="${esc(x[0])}"><span class="hand" aria-hidden="true">⋮⋮</span><b>${esc(nm(x[0]))}</b>${x[2]?'<span class="tiny muted">접힘</span>':''}<span style="flex:1"></span>
    <button class="ib" data-lm67op="up|${esc(x[0])}" aria-label="위로">↑</button><button class="ib" data-lm67op="dn|${esc(x[0])}" aria-label="아래로">↓</button>${w?`<button class="ib" data-lm67op="col|${esc(x[0])}" title="왼쪽 → 오른쪽 → 넓게" aria-label="칸 바꾸기">${x[1]==='L'?'⇢':x[1]==='R'?'⇔':'⇠'}</button>`:''}<button class="ib" data-lm67op="fold|${esc(x[0])}" aria-label="접기">${x[2]?'▸':'▾'}</button><button class="ib" data-lm67op="hide|${esc(x[0])}" aria-label="숨기기" title="${x[3]?'숨김 · 누르면 보이기':'보임 · 누르면 숨기기'}">${x[3]?'🚫':'👁'}</button></div>`;
  openSheet(`<div class="sh"><h3>▦ ${esc(K67().VNAME[v]||v)} 화면 배치</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
  <div class="row" style="gap:6px;flex-wrap:wrap"><button class="chipbtn" data-lm67p="def">처음대로</button><button class="chipbtn" data-lm67p="open">모두 펴기</button><button class="chipbtn" data-lm67p="one">한 줄로</button><button class="chipbtn" data-lm67p="fold">모두 접기</button></div>
  <p class="tiny muted" style="margin:6px 0">${w?'칸을 끌어서 순서·왼쪽/오른쪽/넓게를 바꿔요. 바로 적용돼요.':'폰에서는 한 줄이에요. 끌거나 ↑↓로 순서를 바꿔요.'} 👁 숨기기 · ▾ 접기.</p>
  ${w?`<div class="lm67 three">${[['L','왼쪽 칸'],['R','오른쪽 칸'],['W','넓게(한 줄 전체)']].map(([c,l])=>`<div class="lm61c" data-lm67col="${c}"><span class="tiny muted">${l}</span>${L.filter(x=>x[1]===c).map(blk).join('')}</div>`).join('')}</div>`:`<div class="lm61c" data-lm67col="*">${L.map(blk).join('')}</div>`}
  <p class="tiny muted" style="margin:8px 0 0">홈은 ✎ 홈 배치, 기록하기는 ▦ 화면 배치(그 화면 위)에서 따로 바꿔요. 할 일·캘린더는 칸이 아니라 목록·달력 자체라 배치 대신 보기 설정(정렬·묶기·월/주)으로 바꿔요.</p>
  <div class="row" style="margin-top:10px"><span style="flex:1"></span><button class="btn sm" data-sheet="close">다 했어요</button></div>`);try{$('sheetC').scrollTop=y}catch(x){}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-l67open],[data-lm67op],[data-lm67p],[data-lf67]');if(!b)return;e.preventDefault();e.stopPropagation();
  if(b.dataset.l67open){apply67(b.dataset.l67open);map67(b.dataset.l67open);return}
  if(b.dataset.lf67){const [v,k]=b.dataset.lf67.split('|');const L=L67(v),it=L.find(x=>x[0]===k);if(it){it[2]=it[2]?0:1;set67(v,L)}return}
  const v=sheetCtx&&sheetCtx.l67;if(!v)return;let L=L67(v);
  if(b.dataset.lm67p){const p=b.dataset.lm67p;if(p==='def'){C.lay67=C.lay67||{};delete C.lay67[v];save('config');apply67(v);map67(v);return}
    if(p==='open')L.forEach(x=>{x[2]=0;x[3]=0});if(p==='fold')L.forEach(x=>x[2]=1);if(p==='one')L.forEach(x=>x[1]='W');set67(v,L);return}
  const [op,k]=b.dataset.lm67op.split('|');const it=L.find(x=>x[0]===k);if(!it)return;if(op!=='hide'&&op!=='fold')it[4]=0;
  if(op==='hide')it[3]=it[3]?0:1;else if(op==='fold')it[2]=it[2]?0:1;
  else if(op==='col'){it[1]=it[1]==='L'?'R':it[1]==='R'?'W':'L'}
  else{const w=innerWidth>=900,same=w?L.filter(x=>x[1]===it[1]):L,i=same.indexOf(it),j=op==='up'?i-1:i+1;if(j<0||j>=same.length)return;const o=same[j],a=L.indexOf(it),c=L.indexOf(o);L[a]=o;L[c]=it}
  set67(v,L)},true);
(function(){let d=null;
  document.addEventListener('pointerdown',e=>{const h=e.target.closest('.lm61b[data-lm67]');if(!h||e.target.closest('button')||e.button>0)return;d={k:h.dataset.lm67,el:h,x:e.clientX,y:e.clientY,on:false}},true);
  document.addEventListener('pointermove',e=>{if(!d)return;if(!d.on){if(Math.hypot(e.clientX-d.x,e.clientY-d.y)<6)return;d.on=true;d.el.classList.add('drag61')}e.preventDefault();d.el.style.transform=`translate(${e.clientX-d.x}px,${e.clientY-d.y}px)`},{passive:false});
  document.addEventListener('pointerup',e=>{if(!d)return;const x=d;d=null;if(!x.on)return;x.el.style.transform='';x.el.classList.remove('drag61');x.el.style.pointerEvents='none';const u=document.elementFromPoint(e.clientX,e.clientY);x.el.style.pointerEvents='';
    const v=sheetCtx&&sheetCtx.l67;if(!v)return;const tb=u&&u.closest('.lm61b[data-lm67]'),tc=u&&u.closest('[data-lm67col]');if(!tb&&!tc)return;
    const col=(tb?tb.closest('[data-lm67col]'):tc).dataset.lm67col;const L=L67(v),it=L.find(y=>y[0]===x.k);if(!it)return;let rest=L.filter(y=>y!==it);if(col!=='*')it[1]=col;it[4]=0;
    let i=-1;if(tb&&tb!==x.el){const r=tb.getBoundingClientRect(),bk=e.clientY<r.top+r.height/2?tb.dataset.lm67:null;i=rest.findIndex(y=>y[0]===tb.dataset.lm67);if(!bk)i++}
    if(i<0){if(col!=='*'){let j=-1;rest.forEach((y,n)=>{if(y[1]===col)j=n});i=j+1}else i=rest.length}rest.splice(i,0,it);set67(v,rest)});
})();

/* ---- 11) 기능 지도 · 검색에 새 기능 ---- */
function F67(){return [
  ['🧭 영역 레벨·여정','돌아보기 → 이번 주 → 🧭 영역 → 영역 이름','영역마다 레벨·칭호·마일스톤 골드',()=>aJourney67((C.areas[0]||{}).id),'영역 레벨 칭호 마일스톤'],
  ['🔋 HP 흐름 종합/영역/₩','돌아보기 → 이번 주 → 🧭 영역 아래','종합·영역별·경제 ₩ 막대',()=>{location.hash='review'},'hp 컨디션 흐름 막대 경제 돈'],
  ['📈 요즘 지표','홈 HP 이름 누르기 · 돌아보기 🧭 영역','최근 2주 하루 끝 HP를 최근일수록 무겁게',()=>openInfo('hp'),'지표 추세 몸 마음'],
  ['🍽 몸 종합 기록','돌아보기 → ⚖ 몸 기록','식사 칸·몸무게·HP를 날짜별로',()=>{location.hash='body'},'식사 몸무게 채소 단백질'],
  ['▦ 화면 배치','돌아보기·유리병·통계·여정·몸 기록·상점·뽑기 맨 위','칸 순서·왼쪽/오른쪽·접기·숨기기',()=>{location.hash='review'},'배치 레이아웃 순서'],
  ['↕ 병·구슬 순서','유리병 → 🔮 위 줄 ↕ 순서','끌어서 병·구슬 종류 순서, 많이 넣은 순',()=>roSheet67(),'구슬 정렬 순서'],
  ['🔮 점수만큼 구슬','유리병 → ↕ 순서 창 아래','행동·할 일 점수 ✨10마다 구슬 1개',()=>roSheet67(),'구슬 개수 점수'],
  ['💬 한 줄','기록하기 → 오늘 한 일 맨 위 · 돌아보기 → 이번 주','적고 싶을 때만 한 줄',()=>{location.hash='log'},'일기 한줄 메모 기분'],
  ['⚔️ 용기 카드','기록하기 → ⚔️ 용기 칸','용기 버튼이 행동 카드로 합쳐짐',()=>goBrave(),'용기 버튼 카드'],
  ['🤖 AI에게 물어보기','돌아보기 → 이번 주 맨 위 · 검색','고른 기록을 정리해서 Claude에게',()=>ai67(),'ai 피드백 조언 claude'],
  ['ⓘ 기록 n개 풀이','기록하기 맨 위 숫자','HP와 기록 개수가 무엇인지',()=>{location.hash='log';setTimeout(daySheet67,120)},'기록 개수 컨디션'],
  ['🗂 캘린더 서랍','캘린더 → 도구줄 \'서랍\'(폰은 ⋯ 안)','날짜 없는 할 일·모든 할 일·카드·루틴을 끌어 놓기, 정렬·묶기·거르기',()=>{location.hash='cal'},'서랍 트레이 모든 할 일'],
  ['⚖ 점수 점검','돌아보기 → 이번 주 → 🧭 영역 옆','보스 HP·할 일 컨디션·루틴 단계 점수 고치기',()=>{location.hash='review'},'점수 밸런스'],
  ['🔮 유리병 꾸미기','유리병 → 🎨 꾸미기','병 모양·크기·뚜껑·유리 빛깔·구슬 색',()=>{location.hash='jars'},'병 꾸미기'],
  ['📥 아날로그 병 옮기기','유리병 → 📥','실제 병 구슬 개수 옮기기',()=>{location.hash='jars'},'아날로그'],
  ['💡 팁 모음','홈 → 오늘의 팁 → 💡 팁 더 보기','행동 조언·앱 꿀팁·숨은 것',()=>{location.hash='home'},'팁'],
  ['🧹 전투 기록 골라 지우기','돌아보기 → 여정 → 📜 전투 기록','시험 기록 체크해서 점수까지 되돌리기',()=>{location.hash='journey'},'지우기 정리 시험'],
  ['🎲 뽑기 칸 버튼 고르기','홈 → 🎲 뽑기·사냥 칸 ✎','홈에 보일 뽑기 버튼',()=>{location.hash='home'},'뽑기 버튼'],
  ['🌱 10분만 해보기','할 일 우클릭/꾹 · 쫄따구 누르기','10분 타이머로 시작만',()=>{location.hash='tasks'},'10분 시작'],
  ['😶 피하고 있어요','할 일 우클릭/꾹 · 할 일 상세 아래','피하는 할 일 다루기 3단계',()=>{location.hash='tasks'},'회피 미룸'],
  ['☠ 삼진아웃','같은 할 일을 3번 넘게 미루면','쪼개기·10분만·내려놓기',()=>{location.hash='tasks'},'미루기'],
  ['⏱ 루틴 체크로 기록','루틴 머리 할 일 ○ · 일퀘','타이머 없이 단계 체크',()=>{location.hash='tasks'},'루틴 체크'],
  ['📖 보스·쫄따구 도감','홈 → 👾 전투 → 📖','보스 설명·처치 횟수·전리품',()=>{location.hash='home'},'도감 보스'],
  ['🛡 장비 상점·직접 그리기','상점 맨 위','아바타 장비, ✏ 직접 그리기',()=>{location.hash='shop'},'장비 아바타 그리기'],
  ['➕ 빠른 추가 창','Ctrl+Shift+A · ?quick=1','입력칸만 뜨는 창',()=>{},'빠른 추가 단축키']]}
searchIndex=(function(prev){return function(){const R=prev.apply(this,arguments);
  try{const merged=new Set((C.courage||[]).filter(k=>k.m67).map(k=>k.name));for(let i=R.length-1;i>=0;i--)if(R[i].cat==='용기'&&merged.has(R[i].t))R.splice(i,1);
    F67().forEach(([t,w,d,go,kw])=>R.unshift({cat:'🆕 기능',t,d:w+' · '+d,go,kw:(t+' '+w+' '+d+' '+(kw||'')+' 기능 새 어디').toLowerCase()}));
    R.unshift({cat:'🆕 기능',t:'🗺 기능 지도 (전체 목록)',d:'새로 생긴 기능이 어디 있는지 한눈에',go:()=>fmap67(),kw:'기능 지도 새 기능 어디 설명서 업데이트 도움말 help'});
    R.unshift({cat:'🆕 기능',t:'🤖 AI에게 물어보기',d:'고른 기록을 정리해서 Claude에게 피드백·조언 받기',go:()=>ai67(),kw:'ai 피드백 조언 claude 분석'})}catch(e){console.error(e)}
  return R}})(searchIndex);
function fmap67(){sheetCtx={fm67:1};openSheet(`<div class="sh"><h3>🗺 기능 지도</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
  <p class="tiny muted" style="margin:0 0 8px">최근에 생긴 기능과 있는 곳이에요. 줄을 누르면 그리로 가요. 오른쪽 위 🔍 검색에서도 이름으로 찾을 수 있어요.</p>
  <div class="fm67">${F67().map(([t,w,d],i)=>`<button type="button" data-fm67="${i}"><b>${esc(t)}</b><span class="small">${esc(d)}</span><span class="tiny muted">📍 ${esc(w)}</span></button>`).join('')}</div>`)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-fm67],[data-fm67open]');if(!b)return;e.preventDefault();e.stopPropagation();if(b.dataset.fm67open){fmap67();return}const f=F67()[+b.dataset.fm67];closeSheet();if(f)setTimeout(f[3],60)},true);

/* ---- 12) 🤖 AI에게 물어보기: 고른 기록을 글로 정리 → 복사 / Claude에서 열기 (자동으로 보내지 않아요) ---- */
function aiOpt67(){return ui.ai67||(ui.ai67={n:7,k:{act:1,task:1,brave:1,food:1,weight:1,hp:1,jar:0,diary:1,bad:1},q:''})}
function aiText67(){const o=aiOpt67(),ks=o.n==='all'?Object.keys(DAYS).sort():lastNDates(o.n),K=o.k,ln=[];
  const ar=id=>(C.areas.find(a=>a.id===id)||{}).name||'';
  ln.push(`# 내 생활 기록 (${ks[0]||''} ~ ${ks[ks.length-1]||''}, ${ks.length}일)`);
  ln.push(`앱 규칙: XP=성장, 골드=현실의 돈·자원, HP(컨디션 0~100)=아침 시작점(그날 몸 느낌) + 그날 컨디션 변화의 합. 하루는 ${C.dayStart}시에 바뀜. ⚔️=용기(내게 무서운 일). ▼=끊고 싶은 행동.`);
  if(K.hp){const ds=ks.filter(k=>DAYS[k]&&hasData(DAYS[k]));ln.push(`요즘 지표(최근 2주 가중 평균 HP): ${trend67(dateKey())??'-'} · 기록한 날 ${ds.length}일`)}
  ks.forEach(k=>{const d=DAYS[k];if(!d||!hasData(d)&&!(d.j67||[]).length)return;const p=[];
    if(K.hp)p.push(`HP ${C.energyBase[(d.energy||3)-1]??60}→${overallOf(d)} (아침: ${ENERGY_LBL[(d.energy||3)-1]||'보통'})`);
    if(K.weight&&d.weight)p.push(`몸무게 ${d.weight}kg`);
    if(K.food){const f=C.food.map(f=>{const v=+((d.food||{})[f.id]||0);return v?`${f.name} ${f.kind==='check'?'✓':v}`:''}).filter(Boolean);if(f.length)p.push('식사: '+f.join(', '))}
    const es=(d.entries||[]).filter(e=>{if(isBrave(e))return K.brave;if(e.type==='bad')return K.bad;if(e.kind==='act'||e.kind==='free'||e.kind==='happy')return K.act;if(e.kind==='task'||e.kind==='routine')return K.task;if(e.kind==='jar')return K.jar;return false});
    if(es.length)p.push('한 일: '+es.map(e=>`${e.t?e.t+' ':''}${isBrave(e)?'⚔️':e.type==='bad'?'▼':''}${e.name}${e.n>1?' ×'+e.n:''}${e.area?' ['+ar(e.area)+']':''}${e.note?' ('+String(e.note).slice(0,60)+')':''}`).join('; '));
    if(K.diary){const j=jAll67(k).filter(v=>v.txt||v.m).map(v=>`${v.t||''} ${(JM65.find(x=>x[0]===v.m)||[])[2]||''} ${v.txt||''}`.trim());if(j.length)p.push('한 줄: '+j.join(' / '))}
    if(p.length)ln.push(`\n## ${k} (${wdOf(k)})\n- `+p.join('\n- '))});
  return ln.join('\n')}
function aiPrompt67(){const o=aiOpt67();return `아래는 내가 습관 RPG 앱에 남긴 기록이야. 실시간 감시가 아니라 내가 직접 골라서 보여주는 거야.
${o.q?'특히 궁금한 것: '+o.q+'\n':''}부탁: (1) 기록에서 보이는 흐름 3가지(좋은 것·걱정되는 것) (2) 몸·마음 상태를 대략 어떻게 읽을 수 있는지 (3) 다음 일주일에 해볼 작은 행동 2~3개를 구체적으로. 숫자를 근거로 말해 주고, 기록만으로는 알 수 없는 건 모른다고 해 줘. 진단이나 단정은 하지 말고, 칭찬만 하지 말고 솔직하게.

${aiText67()}`}
function ai67(){sheetCtx={ai67:1};const o=aiOpt67(),y=$('sheetC')?$('sheetC').scrollTop:0;const txt=aiPrompt67();
  const K=[['act','행동·습관'],['task','할 일·루틴'],['brave','⚔️ 용기'],['bad','▼ 나쁜 행동'],['food','식사 칸'],['weight','몸무게'],['hp','HP·아침 에너지'],['diary','💬 한 줄'],['jar','구슬']];
  openSheet(`<div class="sh"><h3>🤖 AI에게 물어보기</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
  <p class="help" style="margin:0">고른 기록을 글로 정리해요. <b>앱이 알아서 보내지 않아요</b> — 복사해서 Claude 대화창에 붙이거나, 'Claude에서 열기'로 새 대화를 열어요(지금 쓰는 Claude 계정 그대로, 추가 비용 없음).</p>
  <div class="small muted" style="margin-top:10px">기간</div><div class="row" style="gap:4px;flex-wrap:wrap">${[[7,'7일'],[14,'14일'],[30,'30일'],[90,'90일'],['all','전체']].map(([v,l])=>`<button type="button" class="chipbtn" data-ai67n="${v}" aria-pressed="${String(o.n)===String(v)}">${l}</button>`).join('')}</div>
  <div class="small muted" style="margin-top:10px">넣을 기록</div><div class="row" style="gap:4px;flex-wrap:wrap">${K.map(([k,l])=>`<button type="button" class="chipbtn" data-ai67k="${k}" aria-pressed="${!!o.k[k]}">${o.k[k]?'☑':'☐'} ${l}</button>`).join('')}<button type="button" class="linkbtn tiny" data-ai67k="*">전부</button></div>
  <label class="small muted" style="display:block;margin-top:10px">특히 궁금한 것 (선택)<input id="ai67q" maxlength="200" value="${esc(o.q||'')}" placeholder="예: 요즘 왜 밤에 무너지는지, 용기를 더 내려면" style="width:100%"></label>
  <div class="small muted" style="margin-top:10px">미리 보기 <span class="tiny">(${txt.length.toLocaleString()}자)</span></div><textarea id="ai67t" rows="9" readonly style="width:100%;font-size:12px">${esc(txt)}</textarea>
  <div class="row" style="gap:6px;margin-top:8px;flex-wrap:wrap"><span style="flex:1"></span><button type="button" class="btn ghost sm" data-ai67go="copy">📋 복사</button><button type="button" class="btn sm" data-ai67go="open">Claude에서 열기 ↗</button></div>
  <p class="tiny muted" style="margin:6px 0 0">글이 길면(${(6000).toLocaleString()}자 넘게) 링크에 다 못 담아서, 복사한 뒤 빈 대화를 열어 줘요 — 붙여 넣기(Ctrl+V)만 하면 돼요.</p>`);try{$('sheetC').scrollTop=y}catch(x){}}
function copy67(t){try{if(navigator.clipboard&&navigator.clipboard.writeText)return navigator.clipboard.writeText(t)}catch(e){}const a=$('ai67t');if(a){a.removeAttribute('readonly');a.select();document.execCommand('copy');a.setAttribute('readonly','')}return Promise.resolve()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-ai67n],[data-ai67k],[data-ai67go],[data-ai67open]');if(!b)return;e.preventDefault();e.stopPropagation();const o=aiOpt67();
  const q=$('ai67q');if(q)o.q=q.value.trim();
  if(b.dataset.ai67open){ai67();return}
  if(b.dataset.ai67n){o.n=b.dataset.ai67n==='all'?'all':+b.dataset.ai67n;ai67();return}
  if(b.dataset.ai67k){const k=b.dataset.ai67k;if(k==='*')Object.keys(o.k).forEach(x=>o.k[x]=1);else o.k[k]=o.k[k]?0:1;ai67();return}
  const t=aiPrompt67();
  if(b.dataset.ai67go==='copy'){copy67(t).then(()=>toast('복사했어요. Claude 대화창에 붙여 넣어요'));return}
  if(b.dataset.ai67go==='open'){if(t.length<=6000){window.open('https://claude.ai/new?q='+encodeURIComponent(t),'_blank','noopener')}else{copy67(t).then(()=>toast('복사했어요 — 열린 창에 붙여 넣어요'));window.open('https://claude.ai/new','_blank','noopener')}}},true);
document.addEventListener('change',e=>{if(e.target&&e.target.id==='ai67q'){aiOpt67().q=e.target.value.trim();ai67()}},true);

/* ---- 13) 돌아보기 맨 위: 🤖 · 🗺 기능 지도 ---- */
reviewHTML59=(function(prev){return function(){const h=prev.apply(this,arguments);
  return `<div class="ai67bar"><button type="button" class="btn ghost sm" data-ai67open="1">🤖 AI에게 물어보기</button><button type="button" class="btn ghost sm" data-fm67open="1">🗺 기능 지도</button></div>`+h}})(reviewHTML59);

/* ---- 14) 렌더 뒤 ---- */
renderReview59=(function(prev){return function(){const r=prev.apply(this,arguments);try{if(curView()==='review')apply67('review')}catch(e){console.error(e)}return r}})(renderReview59);
render=(function(prev){return function(){
  try{mig67()}catch(e){console.error(e)}
  const x=prev.apply(this,arguments);
  try{aMile67()}catch(e){console.error(e)}
  try{const v=curView();if(v==='log'){daySum67();braveActs67();jLog67()}if(v==='body')renderBody67();if(v in K67().VIEWS)apply67(v)}catch(e){console.error(e)}
  return x}})(render);
addEventListener('hashchange',()=>setTimeout(()=>{try{const v=curView();if(v==='log'){daySum67();braveActs67();jLog67()}if(v==='body')renderBody67();if(v in K67().VIEWS)apply67(v)}catch(e){console.error(e)}},30));
