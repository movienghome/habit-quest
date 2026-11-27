/* ================= v13.23~24 (w146): X2-① '왜 이 상태?' + ② 최근 흐름(v13.24) — 무엇이 HP를 깎았나 (C안: 홈 한 줄 펼침 + HP 설명 창, 같은 부품) =================
   읽기만 함(데이터·점수 안 바뀜). 같은 부품 `body146(D)`를 두 곳에 씀:
   · A 홈 → 오늘 한 일 카드 날짜 칩 밑 한 줄(`details.wy146`, 접힘 기본): `HP 5 · 늦게 잠 −18 · 야식 −14` — 누르면 펼침
   · B 홈 → 전투 카드 HP 숫자(또는 막대) → HP 설명 창 맨 위(아래엔 기존 설명·날짜별 비교 그대로)
   내용: 시작 → 지금(±) · ▼ 가장 큰 감점 3개 · ▼ 그 밖에 n건 합계(눌러서 전부) · 🔒 몸 최대 이유 · ▲ 오른 것 · 합이 안 맞으면 '보정' 한 줄
   v13.24: ▼ 감점 이름 뒤 (n일째)=같은 이름이 앞날부터 이어진 날 수(2일 이상일 때만) · ▲ 밑 7일 HP 막대 흐름(막대+숫자+요일, 기록 없는 날은 점선 ·)과 한마디(▲좋아지는 중/▼나빠지는 중/＝비슷, 어제보다, 7일 평균) · 보정 줄은 원인별(0~100 한계·반올림·기타; 몸 최대는 🔒 줄)
   옛 규칙 날(new101 아님)은 이유 목록 없음. 펼침 상태는 이 화면 동안만(저장 안 함). */
(function(){
const WY=window.WY146={open:false,more:false};
const sg=v=>(v>0?'+':v<0?'−':'±')+Math.abs(Math.round(v));
/* HP에 들어간 기록을 이름별로 합침(그날 `d`는 spDay103 거친 것) */
function grp146(d){const ids=new Set(C.areas.map(a=>a.id)),g={};
  (d.entries||[]).forEach(e=>{if(!e||!e.cond||!ids.has(e.area)||!inHP101(e))return;
    const k=String(e.name||'기록'),o=g[k]||(g[k]={n:k,v:0,c:0,e:1});o.v+=e.cond;o.c++});
  return g}
/* v13.24 아이디어 ①: 같은 이름 감점이 며칠째 이어졌나(그날 포함, 앞날은 새 규칙·기록 있는 날만, 최대 30일) */
function streak146(date,name){let n=1;
  for(let i=1;i<30;i++){const p=DAYS[addDays(date,-i)];if(!p||!hasData(p)||!new101(p))break;
    const o=grp146(spDay103(p))[name];if(!o||o.v>=0)break;n++}
  return n}
/* v13.24 X2-②: 최근 7일 HP(보는 날 포함, 기록 없는 날은 null) + 한마디 */
function flow146(date,now){const pts=[];
  for(let i=6;i>=0;i--){const k=addDays(date,-i),d=DAYS[k];let hp=null;
    if(i===0)hp=now;else if(d&&hasData(d)){try{hp=overallOf(d)}catch(e){}}
    pts.push({k,hp})}
  const has=pts.filter(p=>p.hp!=null),n=has.length;if(n<2)return null;
  const avg=a=>a.reduce((t,p)=>t+p.hp,0)/a.length;
  let trend='＝ 비슷해요';
  if(n>=4){const r=has.slice(-3),b=has.slice(0,-3),df=Math.round(avg(r)-avg(b));
    trend=df>=5?'▲ 좋아지는 중':df<=-5?'▼ 나빠지는 중':'＝ 비슷해요'}
  else trend='기록이 더 쌓이면 보여요';
  const y=pts[5].hp;
  return{pts,trend,avg:Math.round(avg(has)),dy:y!=null?now-y:null}}
function data146(day){
  if(!day||!hasData(day)||!new101(day))return null;
  const d=spDay103(day),S=new102(d)?st102(d):null,start=S?S.start:hpb101(),now=overallOf(day);
  const ids=new Set(C.areas.map(a=>a.id)),g=grp146(d);
  const L=Object.keys(g).map(k=>g[k]);
  const fd=foodDelta(d);let fS=0;for(const k in fd)if(ids.has(k)&&akOf101(k)==='c'&&fd[k])fS+=fd[k];
  let nS=0;neglectList(d.date).forEach(n=>{const ar=n.t&&n.t.area;if(ar&&ids.has(ar)&&akOf101(ar)==='c')nS+=n.pen});
  if(fS)L.push({n:'🍽 식사 칸',v:fS,c:1});
  if(nS)L.push({n:'⚠ 방치 경보',v:-nS,c:1});
  const b=bodyA102(),cut=S&&b?Math.max(0,S.start+bodyDelta102(d,true)-S.cap):0;
  const downs=L.filter(x=>x.v<0).sort((a,b)=>a.v-b.v);
  downs.forEach(x=>{if(x.e&&day.date)x.s=streak146(day.date,x.n)});
  return{start,now,S,cut,downs,flow:day.date?flow146(day.date,now):null,
    ups:L.filter(x=>x.v>0).sort((a,b)=>b.v-a.v)}}
const lbl=x=>esc(x.n)+(x.c>1?' ×'+x.c:'')+' '+sg(x.v)+(x.s>1?` <span class="st146">(${x.s}일째)</span>`:'');
function flowH146(F){if(!F)return '';
  const mx=100,cols=F.pts.map((p,i)=>{const last=i===6,wd=esc(wdOf(p.k));
    return p.hp==null?`<span class="fc146"><i class="no"></i><b class="num">·</b><small>${wd}</small></span>`
      :`<span class="fc146${last?' on':''}"><i style="height:${Math.max(3,Math.round(p.hp/mx*28))}px"></i><b class="num">${p.hp}</b><small>${wd}</small></span>`}).join('');
  const lab='최근 7일 HP '+F.pts.map(p=>(wdOf(p.k))+' '+(p.hp==null?'기록 없음':p.hp)).join(', ');
  return `<div class="fl146" role="img" aria-label="${esc(lab)}">${cols}</div>`
    +`<div class="tiny">흐름 ${esc(F.trend)}${F.dy!=null?` · 전날보다 <b class="num">${F.dy?sg(F.dy):'±0'}</b>`:''} · 7일 평균 <b class="num">${F.avg}</b></div>`}
function body146(D){
  const dn=D.downs,top=dn.slice(0,3),rest=dn.slice(3),rs=rest.reduce((t,x)=>t+x.v,0),ups=D.ups;
  const net=D.now-D.start,sum=dn.reduce((t,x)=>t+x.v,0)+ups.reduce((t,x)=>t+x.v,0);
  /* 보정 = 합이 안 맞는 몫을 원인별로: 🔒 몸 최대(위 줄에 이미 있음) · 0~100 한계 · 반올림·기타 */
  const raw=D.start+sum-(D.cut||0),clampV=D.now-Math.round(raw),restV=Math.round(net-sum+(D.cut||0)-clampV);
  const fix=[];if(clampV)fix.push(raw<0?`0 밑으로는 안 내려가요 ${sg(clampV)}`:`100을 넘는 건 잘려요 ${sg(clampV)}`);
  if(restV)fix.push(`반올림·기타 ${sg(restV)}`);
  const S=D.S,cap=S&&(S.cap<100||D.cut)?`<div>🔒 몸 최대 <b class="num">${S.cap}</b>${S.why&&S.why.length?' ('+S.why.map(w=>esc(w[1])+' −'+Math.abs(w[2])).join(' · ')+')':''}${D.cut?` · 최대에 걸려 덜 오른 몸 변화 −${D.cut}`:''}</div>`:'';
  return `<div class="wb146"><div>시작 <b class="num">${D.start}</b> → 지금 <b class="num">${D.now}</b> <span class="num">(${net?sg(net):'±0'})</span></div>`
    +(top.length?`<div>▼ ${top.map(lbl).join(' · ')}</div>`:'<div class="muted">▼ 깎인 기록 없음</div>')
    +(rest.length?`<details class="wm146"${WY.more?' open':''}><summary>▼ 그 밖에 ${rest.length}건 ${sg(rs)}</summary><div>${rest.map(lbl).join(' · ')}</div></details>`:'')
    +cap
    +(ups.length?`<div>▲ ${ups.slice(0,5).map(lbl).join(' · ')}${ups.length>5?` 외 ${ups.length-5}개`:''}</div>`:'')
    +flowH146(D.flow)
    +(fix.length?`<div class="tiny muted">보정 ${sg(clampV+restV)} — ${fix.join(' · ')}</div>`:'')+'</div>'}
function sum146(D){const t=D.downs.slice(0,2);
  return `HP ${D.now}`+(t.length?t.map(x=>' · '+esc(x.n)+' '+sg(x.v)).join(''):' · 깎인 기록 없음')}

/* A: 홈 오늘 한 일 카드 */
function home146(){
  const ul=$('homeLog'),p=ul&&ul.closest('.panel');if(!p)return;
  const n=Math.max(0,+ui.hl142||0);let day;const o=ui.off;ui.off=n;try{day=curDay()}finally{ui.off=o}
  const D=data146(day);let el=p.querySelector(':scope>.wy146');
  if(!D){if(el)el.remove();return}
  const html=`<summary>${sum146(D)}</summary>${body146(D)}`,sig=html+'|'+WY.more;
  if(!el){el=document.createElement('details');el.className='wy146'}
  if(el.nextElementSibling!==ul)ul.before(el);
  if(el.dataset.sig!==sig){el.dataset.sig=sig;el.innerHTML=html}
  if(el.open!==WY.open)el.open=WY.open}
homeLog98=(function(prev){return function(){const r=prev.apply(this,arguments);
  try{if(curView()==='home')home146()}catch(e){console.error(e)}return r}})(homeLog98);

/* B: HP 설명 창 맨 위 */
infoFor=(function(prev){return function(k){const r=prev.apply(this,arguments);
  try{if(r&&k==='hp'&&typeof r.b==='string'&&r.b.indexOf('wb146')<0){const D=data146(curDay());
    if(D)r.b=`<div class="wy146 pop146"><p class="h146">왜 이 상태?</p>${body146(D)}</div>`+r.b}}catch(e){console.error(e)}
  return r}})(infoFor);

document.addEventListener('toggle',e=>{const t=e.target;if(!t||!t.classList)return;
  if(t.classList.contains('wm146'))WY.more=t.open;
  else if(t.classList.contains('wy146')&&t.tagName==='DETAILS')WY.open=t.open},true);
})();
