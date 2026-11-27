/* ================= v13.23~25 (w146): X2 '왜 이 상태?' — 무엇이 HP를 깎았나 (C안: 홈 한 줄 펼침 + HP 설명 창, 같은 부품) =================
   읽기만 함(데이터·점수 안 바뀜). 같은 부품 `body146(D,pop)`를 두 곳에 씀:
   · A 홈 → 오늘 한 일 카드 날짜 칩 밑 한 줄(`details.wy146`, 접힘 기본): `HP 5 · 늦게 잠 −18 · 야식 −14` — 누르면 펼침
   · B 홈 → 전투 카드 HP 숫자(또는 막대) → HP 설명 창 맨 위(`pop`=true: 막대 눌러 날짜 바꾸기는 홈에서만)
   v13.25 모양(글 줄줄이 → 표): ① 계산식 칩 `시작 53 ＋ 몸 −8 ＋ 마음 −17 ＋ 생활 −22 ＝ HP 6`(HP는 영역 평균이 아니라 변화의 합) ② 영역 막대 한 줄
   ③ ▼ 깎인 것 표(이름·영역·점수, 누적 ×n, (n일째), 방치 경보는 항목별 하위 줄) · 그 밖에 n건 ④ ▲ 오른 것 표 ⑤ 🔒 몸 최대 ⑥ ▸ 최근 7일 흐름(접힘, 막대 누르면 그 날로)
   계산식이 안 맞는 몫은 칩으로: 0 아래는 없음/100 넘는 건 잘림/기타. 옛 규칙 날(new101 아님)은 이유 목록 없음. 펼침 상태는 이 화면 동안만(저장 안 함).
   + 점수 점검 글(`scoreDiag146`)을 📋 진단 복사 맨 끝에 붙임(w141). */
(function(){
const WY=window.WY146={open:false,more:false,upm:false,flow:false};
const sg=v=>(v>0?'+':v<0?'−':'±')+Math.abs(Math.round(v));
const an=id=>{const a=C.areas.find(x=>x.id===id);return a?a.name:String(id||'')};
/* HP에 들어간 기록을 이름별로 합침(그날 `d`는 spDay103 거친 것). adl=영역별 변화 합을 모을 곳 */
function grp146(d,adl){const ids=new Set(C.areas.map(a=>a.id)),g={};
  (d.entries||[]).forEach(e=>{if(!e||!e.cond||!ids.has(e.area)||!inHP101(e))return;
    const k=String(e.name||'기록'),o=g[k]||(g[k]={n:k,v:0,c:0,e:1,a:e.area,m:0});o.v+=e.cond;o.c++;if(+e.mult>o.m)o.m=+e.mult;
    if(adl)adl[e.area]=(adl[e.area]||0)+e.cond});
  return g}
/* 같은 이름 감점이 며칠째 이어졌나(그날 포함, 앞날은 새 규칙·기록 있는 날만, 최대 30일) */
function streak146(date,name){let n=1;
  for(let i=1;i<30;i++){const p=DAYS[addDays(date,-i)];if(!p||!hasData(p)||!new101(p))break;
    const o=grp146(spDay103(p))[name];if(!o||o.v>=0)break;n++}
  return n}
/* 최근 7일 HP(보는 날 포함, 기록 없는 날은 null) + 한마디 */
function flow146(date,now){const pts=[];
  for(let i=6;i>=0;i--){const k=addDays(date,-i),d=DAYS[k];let hp=null;
    if(i===0)hp=now;else if(d&&hasData(d)){try{hp=overallOf(d)}catch(e){}}
    pts.push({k,hp})}
  const has=pts.filter(p=>p.hp!=null),n=has.length;if(n<2)return null;
  const avg=a=>a.reduce((t,p)=>t+p.hp,0)/a.length;
  let trend;
  if(n>=4){const r=has.slice(-3),b=has.slice(0,-3),df=Math.round(avg(r)-avg(b));
    trend=df>=5?'▲ 좋아지는 중':df<=-5?'▼ 나빠지는 중':'＝ 비슷해요'}
  else trend='기록이 더 쌓이면 보여요';
  const y=pts[5].hp;
  return{pts,trend,avg:Math.round(avg(has)),dy:y!=null?now-y:null}}
function data146(day){
  if(!day||!hasData(day)||!new101(day))return null;
  const d=spDay103(day),S=new102(d)?st102(d):null,start=S?S.start:hpb101(),now=overallOf(day);
  const ids=new Set(C.areas.map(a=>a.id)),adl={},g=grp146(d,adl);
  const L=Object.keys(g).map(k=>g[k]);
  const fd=foodDelta(d);for(const k in fd)if(ids.has(k)&&akOf101(k)==='c'&&fd[k]){L.push({n:'🍽 식사 칸',v:fd[k],c:1,a:k});adl[k]=(adl[k]||0)+fd[k]}
  const nl=[];neglectList(d.date).forEach(n=>{const ar=n.t&&n.t.area;if(ar&&ids.has(ar)&&akOf101(ar)==='c'&&n.pen)nl.push({n:n.t.name,a:ar,since:n.since,days:n.w.days,pen:n.pen})});
  let nS=0;nl.forEach(x=>{nS+=x.pen;adl[x.a]=(adl[x.a]||0)-x.pen});
  if(nS)L.push({n:'⚠ 방치 경보',v:-nS,c:nl.length,as:[...new Set(nl.map(x=>x.a))],nl});
  const b=bodyA102(),cut=S&&b?Math.max(0,S.start+bodyDelta102(d,true)-S.cap):0;
  let av={};try{av=areaValues(day)||{}}catch(e){}
  /* 영역별 변화(몸은 몸 최대에 걸려 덜 오른 몫을 뺀 값) — HP = 시작 + 이 값들의 합 */
  const ar=C.areas.filter(a=>akOf101(a.id)==='c'||adl[a.id]).map(a=>({id:a.id,n:a.name,bar:av[a.id],raw:adl[a.id]||0,
    v:(adl[a.id]||0)-(S&&a.id===b?cut:0)}));
  const downs=L.filter(x=>x.v<0).sort((a,b)=>a.v-b.v);
  downs.forEach(x=>{if(x.e&&day.date)x.s=streak146(day.date,x.n)});
  return{start,now,S,cut,downs,ar,flow:day.date?flow146(day.date,now):null,
    ups:L.filter(x=>x.v>0).sort((a,b)=>b.v-a.v)}}
const aTag=x=>{const t=x.as?x.as.map(an).join('·'):(x.a?an(x.a):'');return t?`<span class="ar146">${esc(t)}</span>`:'<span></span>'};
const row=x=>`<div class="r146"><span class="n146">${esc(x.n)}${x.c>1&&!x.nl?` <span class="mu146">×${x.c}</span>`:''}${x.m>1?` <span class="mu146">누적 ×${+(+x.m).toFixed(2)}</span>`:''}${x.s>1?` <span class="st146">(${x.s}일째)</span>`:''}</span>${aTag(x)}<b class="v146 num">${sg(x.v)}</b></div>`
  +(x.nl?x.nl.map(w=>`<div class="r146 sub146"><span class="n146">└ ${esc(w.n)} · ${w.since}일째 안 함 <span class="mu146">(기준 ${w.days}일)</span></span><span class="ar146">${esc(an(w.a))}</span><b class="v146 num">${sg(-w.pen)}</b></div>`).join(''):'');
function flowH146(F,pop){if(!F)return '';
  const cols=F.pts.map((p,i)=>{const last=i===6,wd=esc(wdOf(p.k));
    if(p.hp==null)return `<span class="fc146"><i class="no"></i><b class="num">·</b><small>${wd}</small></span>`;
    const inner=`<i style="height:${Math.max(3,Math.round(p.hp/100*56))}px"></i><b class="num">${p.hp}</b><small>${wd}</small>`;
    return pop?`<span class="fc146${last?' on':''}">${inner}</span>`
      :`<button type="button" class="fc146${last?' on':''}" data-fk146="${esc(p.k)}" aria-label="${esc(fmtD(p.k))} ${p.hp}, 눌러서 그 날 이유 보기">${inner}</button>`}).join('');
  const lab='최근 7일 HP '+F.pts.map(p=>(wdOf(p.k))+' '+(p.hp==null?'기록 없음':p.hp)).join(', ');
  return `<details class="fw146"${WY.flow?' open':''}><summary>최근 7일 · ${esc(F.trend)}${F.dy!=null?` · 전날보다 <b class="num">${F.dy?sg(F.dy):'±0'}</b>`:''} · 평균 <b class="num">${F.avg}</b></summary>`
    +`<div class="fl146" role="img" aria-label="${esc(lab)}">${cols}</div>${pop?'':'<div class="tiny muted">막대를 누르면 그 날 이유를 봐요</div>'}</details>`}
function body146(D,pop){
  const dn=D.downs,top=dn.slice(0,3),rest=dn.slice(3),rs=rest.reduce((t,x)=>t+x.v,0),ups=D.ups,upT=ups.slice(0,5),upR=ups.slice(5);
  const dS=dn.reduce((t,x)=>t+x.v,0),uS=ups.reduce((t,x)=>t+x.v,0),net=D.now-D.start;
  /* 계산식: 시작 + 영역별 변화 = 지금. 안 맞는 몫(0~100 한계·반올림)은 칩으로 */
  const eff=D.ar.reduce((t,a)=>t+a.v,0),raw=D.start+eff,clampV=D.now-Math.round(raw),restV=Math.round(net-eff-clampV);
  const chips=[`<span class="q146">시작 <b class="num">${D.start}</b></span>`];
  D.ar.filter(a=>Math.round(a.v)).forEach(a=>chips.push(`<span class="op146">＋</span><span class="q146">${esc(a.n)} <b class="num">${sg(a.v)}</b></span>`));
  if(clampV)chips.push(`<span class="op146">＋</span><span class="q146 fx146">${raw<0?'0 아래는 없음':'100 넘는 건 잘림'} <b class="num">${sg(clampV)}</b></span>`);
  if(restV)chips.push(`<span class="op146">＋</span><span class="q146 fx146">반올림·기타 <b class="num">${sg(restV)}</b></span>`);
  chips.push(`<span class="op146">＝</span><span class="q146 hp146">HP <b class="num">${D.now}</b></span>`);
  const bars=D.ar.filter(a=>a.bar!=null).map(a=>`${esc(a.n)} <b class="num">${a.bar}</b>`).join(' · ');
  const S=D.S,cap=S&&(S.cap<100||D.cut)?`<div class="cap146">🔒 몸 최대 <b class="num">${S.cap}</b>${S.why&&S.why.length?' ('+S.why.map(w=>esc(w[1])+' −'+Math.abs(w[2])).join(' · ')+')':''}${D.cut?` · 최대에 걸려 덜 오른 몸 변화 −${D.cut}`:''}</div>`:'';
  return `<div class="wb146"><div class="eq146">${chips.join('')}</div>`
    +(bars?`<div class="tiny muted">영역 막대 ${bars} — HP는 막대 평균이 아니라 영역별 변화를 <b>모두 더한</b> 값이에요</div>`:'')
    +(dn.length?`<div class="sh146"><b>▼ 깎인 것 ${dn.length}건</b><b class="num">${sg(dS)}</b></div>${top.map(row).join('')}`
      +(rest.length?`<details class="wm146"${WY.more?' open':''}><summary>그 밖에 ${rest.length}건 ${sg(rs)}</summary>${rest.map(row).join('')}</details>`:'')
      :'<div class="sh146 muted"><b>▼ 깎인 기록 없음</b></div>')
    +(ups.length?`<div class="sh146"><b>▲ 오른 것 ${ups.length}건</b><b class="num">${sg(uS)}</b></div>${upT.map(row).join('')}`
      +(upR.length?`<details class="wu146"${WY.upm?' open':''}><summary>그 밖에 ${upR.length}건 ${sg(upR.reduce((t,x)=>t+x.v,0))}</summary>${upR.map(row).join('')}</details>`:''):'')
    +cap+flowH146(D.flow,pop)+'</div>'}
function sum146(D){const t=D.downs.slice(0,2);
  return `HP ${D.now}`+(t.length?t.map(x=>' · '+esc(x.n)+' '+sg(x.v)).join(''):' · 깎인 기록 없음')}
/* HP 설명 창: 옛 글 줄줄이를 '들어가요/안 들어가요/계산' 세 줄로 */
function how146(){let p={};try{p=hpParts101(curDay())}catch(e){}
  const cs=C.areas.filter(a=>akOf101(a.id)==='c').map(a=>esc(a.name)).join('·'),ps=C.areas.filter(a=>akOf101(a.id)!=='c').map(a=>esc(a.name)).join('·');
  return `<div class="how146"><div><b>🔋 들어가요</b><span>${cs||'—'}의 컨디션 점수${C.bv101!==0?' · ⚔ 용기 기록':''} · 그 영역의 식사 칸·방치 경보</span></div>`
    +(ps?`<div><b>⏸ 안 들어가요</b><span>${ps} — 진척·경제는 따로 쌓여요${p.out?` (오늘 ${sg(p.out)})`:''}</span></div>`:'')
    +`<div><b>🧮 계산</b><span>시작값에 위 변화를 전부 더해요(평균 아님) · 0~100에서 멈춰요</span></div></div>`}

/* A: 홈 오늘 한 일 카드 */
function home146(){
  const ul=$('homeLog'),p=ul&&ul.closest('.panel');if(!p)return;
  const n=Math.max(0,+ui.hl142||0);let day;const o=ui.off;ui.off=n;try{day=curDay()}finally{ui.off=o}
  const D=data146(day);let el=p.querySelector(':scope>.wy146');
  if(!D){if(el)el.remove();return}
  const html=`<summary>${sum146(D)}</summary>${body146(D,false)}`,sig=html;
  if(!el){el=document.createElement('details');el.className='wy146'}
  if(el.nextElementSibling!==ul)ul.before(el);
  if(el.dataset.sig!==sig){el.dataset.sig=sig;el.innerHTML=html}
  if(el.open!==WY.open)el.open=WY.open}
homeLog98=(function(prev){return function(){const r=prev.apply(this,arguments);
  try{if(curView()==='home')home146()}catch(e){console.error(e)}return r}})(homeLog98);

/* B: HP 설명 창 맨 위 + 옛 글 정리 */
infoFor=(function(prev){return function(k){const r=prev.apply(this,arguments);
  try{if(r&&k==='hp'&&typeof r.b==='string'&&r.b.indexOf('wb146')<0){const D=data146(curDay());
    if(D){const b=r.b.replace(/^<p>오늘 몸·마음 상태[\s\S]*?<\/p>/,'').replace(/<p class="small">오늘: 시작[\s\S]*?<\/p>/,'');
      r.b=`<div class="wy146 pop146"><p class="h146">왜 이 상태?</p>${body146(D,true)}</div>`+how146()+b}}}catch(e){console.error(e)}
  return r}})(infoFor);

document.addEventListener('toggle',e=>{const t=e.target;if(!t||!t.classList)return;
  if(t.classList.contains('wm146'))WY.more=t.open;
  else if(t.classList.contains('wu146'))WY.upm=t.open;
  else if(t.classList.contains('fw146'))WY.flow=t.open;
  else if(t.classList.contains('wy146')&&t.tagName==='DETAILS')WY.open=t.open},true);
/* 막대 한 칸을 누르면 홈 날짜 칩이 그 날로(보기 전용 ui.hl142) */
addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('button[data-fk146]');if(!b)return;
  e.preventDefault();e.stopPropagation();const k=b.dataset.fk146;if(!k)return;
  ui.hl142=Math.max(0,diffDays(dateKey(),k));homeLog98()},true);

/* 📋 진단 복사 끝에 붙는 '점수 점검' 글 — 최근 21일: HP·영역별 변화·방치·누적 배수·큰 감점, 위 요약 */
window.scoreDiag146=function(){
  const td=gk76(),out=[],S={hp:[],nl:[],mu:[],bad:0,badM:0,nlShare:[]};
  const W=(C.watches||[]).map(w=>{const t=typeof watchTarget==='function'?watchTarget(w.action):null;return (t?t.name:w.action)+' '+w.days+'일/'+w.penalty}).join(' · ');
  out.push('점수 점검(최근 21일 — 오래된 날부터)');
  out.push('설정: 누적 배수 '+JSON.stringify(C.penalty||{})+' · 연속(chain) '+JSON.stringify(C.chain||{})+' · 방치 경보(이름 기준일/점수) '+W+' · 하루 시작값 '+hpb101());
  for(let i=20;i>=0;i--){const k=addDays(td,-i),day=DAYS[k];if(!day||!hasData(day))continue;
    let D=null;try{D=data146(day)}catch(e){}
    if(!D){out.push(k.slice(5)+' 옛 규칙 HP '+(()=>{try{return overallOf(day)}catch(e){return '?'}})());continue}
    const nl=D.downs.find(x=>x.nl),nlS=nl?-nl.v:0,dS=-D.downs.reduce((t,x)=>t+x.v,0);
    const mults=[];(day.entries||[]).forEach(e=>{if(e&&e.type==='bad'&&e.kind==='act'){S.bad++;if(+e.mult>1){S.badM++;mults.push(+e.mult)}}});
    S.hp.push(D.now);S.nl.push(nlS);if(mults.length)S.mu.push(Math.max(...mults));if(dS)S.nlShare.push(nlS/dS);
    out.push(k.slice(5)+' HP '+D.now+' (시작 '+D.start+') · 영역 '+D.ar.filter(a=>Math.round(a.v)).map(a=>a.n+' '+sg(a.v)).join(' ')
      +' · 방치 '+(nlS?'−'+nlS+'('+nl.nl.map(w=>w.n+' '+w.since+'일째/기준 '+w.days+'/'+sg(-w.pen)).join(', ')+')':'0')
      +' · 큰 감점 '+D.downs.filter(x=>!x.nl).slice(0,3).map(x=>x.n+' '+sg(x.v)+(x.m>1?' ×'+(+(+x.m).toFixed(2)):'')+(x.s>1?' '+x.s+'일째':'')).join(', '))}
  const n=S.hp.length,avg=a=>a.length?Math.round(a.reduce((t,v)=>t+v,0)/a.length*10)/10:0;
  out.splice(2,0,'요약: 새 규칙 '+n+'일 · HP 평균 '+avg(S.hp)+' · 10 이하 '+S.hp.filter(v=>v<=10).length+'일 · 30 이하 '+S.hp.filter(v=>v<=30).length+'일 · 방치 합 하루 평균 −'+avg(S.nl)+'(최대 −'+(S.nl.length?Math.max(...S.nl):0)+') · 감점 중 방치 몫 평균 '+Math.round(avg(S.nlShare)*100)+'% · 누적 배수 붙은 나쁜 기록 '+S.badM+'/'+S.bad+'건(하루 최대 배수 평균 ×'+(avg(S.mu)||1)+')');
  return out};
})();
