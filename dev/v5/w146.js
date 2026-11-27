/* ================= v13.23 (w146): X2-① '왜 이 상태?' — 무엇이 HP를 깎았나 (C안: 홈 한 줄 펼침 + HP 설명 창, 같은 부품) =================
   읽기만 함(데이터·점수 안 바뀜). 같은 부품 `body146(D)`를 두 곳에 씀:
   · A 홈 → 오늘 한 일 카드 날짜 칩 밑 한 줄(`details.wy146`, 접힘 기본): `HP 5 · 늦게 잠 −18 · 야식 −14` — 누르면 펼침
   · B 홈 → 전투 카드 HP 숫자(또는 막대) → HP 설명 창 맨 위(아래엔 기존 설명·날짜별 비교 그대로)
   내용: 시작 → 지금(±) · ▼ 가장 큰 감점 3개 · ▼ 그 밖에 n건 합계(눌러서 전부) · 🔒 몸 최대 이유 · ▲ 오른 것 · 합이 안 맞으면 '보정' 한 줄
   옛 규칙 날(new101 아님)은 이유 목록 없음. 펼침 상태는 이 화면 동안만(저장 안 함). */
(function(){
const WY=window.WY146={open:false,more:false};
const sg=v=>(v>0?'+':v<0?'−':'±')+Math.abs(Math.round(v));
function data146(day){
  if(!day||!hasData(day)||!new101(day))return null;
  const d=spDay103(day),S=new102(d)?st102(d):null,start=S?S.start:hpb101(),now=overallOf(day);
  const ids=new Set(C.areas.map(a=>a.id)),g={};
  (d.entries||[]).forEach(e=>{if(!e||!e.cond||!ids.has(e.area)||!inHP101(e))return;
    const k=String(e.name||'기록'),o=g[k]||(g[k]={n:k,v:0,c:0});o.v+=e.cond;o.c++});
  const L=Object.keys(g).map(k=>g[k]);
  const fd=foodDelta(d);let fS=0;for(const k in fd)if(ids.has(k)&&akOf101(k)==='c'&&fd[k])fS+=fd[k];
  let nS=0;neglectList(d.date).forEach(n=>{const ar=n.t&&n.t.area;if(ar&&ids.has(ar)&&akOf101(ar)==='c')nS+=n.pen});
  if(fS)L.push({n:'🍽 식사 칸',v:fS,c:1});
  if(nS)L.push({n:'⚠ 방치 경보',v:-nS,c:1});
  const b=bodyA102(),cut=S&&b?Math.max(0,S.start+bodyDelta102(d,true)-S.cap):0;
  return{start,now,S,cut,
    downs:L.filter(x=>x.v<0).sort((a,b)=>a.v-b.v),
    ups:L.filter(x=>x.v>0).sort((a,b)=>b.v-a.v)}}
const lbl=x=>esc(x.n)+(x.c>1?' ×'+x.c:'')+' '+sg(x.v);
function body146(D){
  const dn=D.downs,top=dn.slice(0,3),rest=dn.slice(3),rs=rest.reduce((t,x)=>t+x.v,0),ups=D.ups;
  const net=D.now-D.start,sum=dn.reduce((t,x)=>t+x.v,0)+ups.reduce((t,x)=>t+x.v,0),res=Math.round(net-sum);
  const S=D.S,cap=S&&(S.cap<100||D.cut)?`<div>🔒 몸 최대 <b class="num">${S.cap}</b>${S.why&&S.why.length?' ('+S.why.map(w=>esc(w[1])+' −'+Math.abs(w[2])).join(' · ')+')':''}${D.cut?` · 최대에 걸려 덜 오른 몸 변화 −${D.cut}`:''}</div>`:'';
  return `<div class="wb146"><div>시작 <b class="num">${D.start}</b> → 지금 <b class="num">${D.now}</b> <span class="num">(${net?sg(net):'±0'})</span></div>`
    +(top.length?`<div>▼ ${top.map(lbl).join(' · ')}</div>`:'<div class="muted">▼ 깎인 기록 없음</div>')
    +(rest.length?`<details class="wm146"${WY.more?' open':''}><summary>▼ 그 밖에 ${rest.length}건 ${sg(rs)}</summary><div>${rest.map(lbl).join(' · ')}</div></details>`:'')
    +cap
    +(ups.length?`<div>▲ ${ups.slice(0,5).map(lbl).join(' · ')}${ups.length>5?` 외 ${ups.length-5}개`:''}</div>`:'')
    +(Math.abs(res)>=1?`<div class="tiny muted">보정 ${sg(res)} (시작값 차이·0~100 한계)</div>`:'')+'</div>'}
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
