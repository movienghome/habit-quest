/* ---- v11.1 (w110.js): F1 ⑤-1 충동 적기 → 확정 ----
   참기는 '안 한 일'이라 흔적이 없어 기록이 안 됨 → 당길 때 먼저 적고(작은 보상), 그날 밤 '안 먹음/안 샀음'으로 확정(큰 보상).
   · 데이터: DAYS[날].imp110=[{id,k:'f'(먹고 싶음)|'b'(사고 싶음),n:이름,t:'HH:MM',s:'p'열림|'h'참음|'g'먹음·샀음,rid:적기 기록 id,eid:확정 기록 id,hk:확정 기록 날,gt}] (normDay 감싸서 보존)
   · 적기 = kind 'imp110' 기록 XP `C.imp110.rx`(기본 1), 하루 `max`(기본 3)번까지만(많이 적어서 점수 얻기 막기).
   · 확정(참음) = 연결된 '참았다' 카드를 그대로 기록(카드 점수·보조 영역·통계가 같이 감) — 🍰 /(야식|폭식|과식).*참/ · 🛍 /충동.*(구매|지출|소비).*참/ (`C.imp110.card={f:id,b:id}`로 고정 가능).
     카드가 없으면 `C.imp110.hf|hb=[XP,골드,컨디션]`(기본 [6,0,3]·[8,20,2]).
   · 먹었음·샀음 = 기록만(점수 안 깎음 — 솔직한 기록이 불이익이 되지 않게). 돈 상태로도 안 깎음.
   · '참음' 상태는 확정 기록이 실제로 있을 때만 — 기록하기에서 그 기록을 지우면 저절로 열림(st110)으로 돌아옴.
   · 입구: 전투 카드 기분 줄 🍰 칩(.im110) · 🍬 지금 어때? '당김' 창 위 단추(.im110d). 이 칩은 renderBattle 맨 바깥 감싸개가 다시 넣음. */

var IK110={f:['🍰','먹고 싶음','안 먹었어요','먹었어요'],b:['🛍','사고 싶음','안 샀어요','샀어요']};
var IM110={kind:'f',plan:null};
function cfg110(){const c=C.imp110||{};
  const al=c.alts||{},nn=(v,lo,hi,d)=>v!=null&&v!==''?Math.max(lo,Math.min(hi,Math.round(+v)||0)):d;
  return{rx:c.rx!=null?Math.max(0,+c.rx||0):1,max:c.max!=null?Math.max(0,Math.round(+c.max)||0):3,hf:Array.isArray(c.hf)?c.hf:[6,0,3],hb:Array.isArray(c.hb)?c.hb:[8,20,2],
    fill:Array.isArray(c.fill)&&c.fill.length?c.fill.slice(0,8).map(x=>String(x).slice(0,14)):['두유','삶은 달걀','닭가슴살'],
    wait:nn(c.wait,5,60,20),sw:nn(c.sw,0,10,3),swmax:nn(c.swmax,0,10,2),gr:nn(c.gr,0,5000,300),
    won:nn(c.won,1,100000,100),budget:nn(c.budget,0,1e9,0),units:units110(c),
    alts:{f:Array.isArray(al.f)?al.f:[{n:'라면 하나',c:0},{n:'더 저렴한 배달',c:0},{n:'편의점 간단한 것',c:0}],
          b:Array.isArray(al.b)?al.b:[{n:'보상함에 적고 오늘은 끝',c:0},{n:'더 저렴한 것으로',c:0}]}}}
var UN110=[{n:'콜드브루 한 잔',c:5000},{n:'국밥 한 그릇',c:10000},{n:'영화 한 편',c:12000},{n:'책 한 권',c:20000},{n:'옷 한 벌',c:40000},{n:'구두 한 켤레',c:100000}];
function units110(c){let u=Array.isArray(c.units)?c.units.filter(z=>z&&z.n&&z.c>0).map(z=>({n:String(z.n).slice(0,20),c:Math.min(1e7,Math.round(+z.c))})):null;
  if(!u||!u.length){u=UN110.map(z=>({...z}));const o=c.unit;if(o&&o.n&&o.c>0&&o.n!=='순대국 한 그릇')u.push({n:String(o.n).slice(0,20),c:Math.round(+o.c)})}
  return u.sort((a,b)=>a.c-b.c).slice(0,10)}
function num110(v){return +String(v==null?'':v).replace(/[^\d]/g,'')||0}
function cm110(n){n=Math.round(+n||0);return n>0?n.toLocaleString('ko-KR'):''}
function fn110(x){return x>=10?String(Math.round(x)):String(Math.round(x*10)/10)}
function eq110(amt,max){const c=cfg110();if(!(amt>0))return '';const f=c.units.filter(u=>u.c<=amt*1.05).slice(-(max||2)).reverse();
  return f.map(u=>`${u.n} ×${fn110(amt/u.c)}`).join(' · ')}
/* 보상함(상점·보상함의 C.shop) 기준: 골드 1G = won원. 이 돈을 n번 아끼면 살 수 있는 것 */
function goal110(amt){const c=cfg110();if(!(amt>0))return null;
  const its=(C.shop||[]).filter(s=>s&&s.price>0).map(s=>({n:s.name,g:s.price,w:s.price*c.won}));if(!its.length)return null;
  const near=its.filter(s=>s.w>amt).sort((a,b)=>a.w-b.w)[0],far=its.filter(s=>s.w>amt&&Math.ceil(s.w/amt)<=30).sort((a,b)=>b.w-a.w)[0],aff=its.filter(s=>s.w<=amt).sort((a,b)=>b.w-a.w)[0];
  return{near,far:far&&far!==near?far:null,aff}}
function goalTxt110(amt){const g=goal110(amt);if(!g)return [];const L=[];
  if(g.aff)L.push(`이 돈 한 번이면 🎁 ${g.aff.n}(${g.aff.g}G) 값이에요`);
  [g.near,g.far].forEach(s=>{if(s)L.push(`이 돈을 ${Math.ceil(s.w/amt)}번 아끼면 🎁 ${s.n}(${s.g}G)을 살 수 있어요`)});return L.slice(0,2)}
function won110(n){n=Math.round(+n||0);return n>=10000?(Math.round(n/1000)/10)+'만 원':n.toLocaleString('ko-KR')+'원'}
function altTxt110(a){return (a||[]).map(z=>z.n+(z.c?' '+cm110(z.c):'')).join('\n')}
function altParse110(t){return String(t||'').split('\n').map(l=>l.trim()).filter(Boolean).slice(0,8).map(l=>{const m=l.match(/^(.*?)[\s:]+(\d[\d,]*)\s*원?$/);return m?{n:m[1].slice(0,20),c:Math.min(1e7,+m[2].replace(/,/g,'')||0)}:{n:l.slice(0,20),c:0}})}
function cardRe110(k){return k==='f'?/(야식|폭식|과식).*참|참.*(야식|폭식|과식)/:/충동.*(구매|지출|소비).*참|참.*충동.*(구매|지출|소비)/}
function card110(k){const id=((C.imp110||{}).card||{})[k];let a=id&&C.actions.find(x=>x.id===id);
  if(!a)a=C.actions.find(x=>x.type==='good'&&cardRe110(k).test(x.name||''));return a||null}
function pv110(k){const a=card110(k),c=cfg110();
  if(a)return{xp:+a.xp||0,gold:Math.abs(+a.gold||0),cond:Math.abs(+a.cond||0),nm:a.name};
  const s=k==='f'?c.hf:c.hb;return{xp:+s[0]||0,gold:+s[1]||0,cond:+s[2]||0,nm:''}}
function pvTxt110(v){return '+'+v.xp+'XP'+(v.gold?' · '+v.gold+'G':'')+(v.cond?' · 컨디션 '+v.cond:'')}

function list110(k){const d=DAYS[k];return d&&Array.isArray(d.imp110)?d.imp110:[]}
function entryOf110(x){const d=x.hk&&DAYS[x.hk];return d&&(d.entries||[]).find(e=>e.id===x.eid)}
function st110(x){if(x.s==='h'||x.s==='w')return entryOf110(x)?x.s:'p';return x.s==='g'?'g':'p'}
function recent110(){const td=gk76(),o=[];for(let i=0;i<3;i++){const k=addDays(td,-i);list110(k).forEach(x=>o.push({k,x,s:st110(x)}))}return o}
function find110(id){const r=recent110().find(z=>z.x.id===id);if(r)return r;const td=gk76();for(let i=3;i<35;i++){const k=addDays(td,-i),x=list110(k).find(y=>y.id===id);if(x)return{k,x,s:st110(x)}}return null}

/* ---- 적기 · 확정 ---- */
function add110(kind,name,amt){
  if(!guard())return null;name=String(name||'').trim().slice(0,30);
  if(!name){toast('무엇이 당기는지 적어요');return null}
  const d=today(),k=d.date,c=cfg110();d.imp110=d.imp110||[];
  const x={id:uid(),k:kind==='b'?'b':'f',n:name,t:stamp(),s:'p'};if(amt>0)x.a=Math.min(1e7,Math.round(amt));d.imp110.push(x);
  const given=d.imp110.filter(y=>y.rid).length;
  commit(()=>{if(c.rx>0&&given<c.max){const e={kind:'imp110',type:'good',name:IK110[x.k][0]+' 충동 적기: '+name,xp:c.rx,gold:0,cond:0,imp110:x.id};applyEntry(d,e);x.rid=e.id}},[k]);
  return x}
function hold110(id){
  const f=find110(id);if(!f||!guard())return;const x=f.x,a=card110(x.k),c=cfg110(),d=today();let e;
  if(a){e=actEntry(a,{});e.note=IK110[x.k][0]+' '+x.n}
  else{const s=x.k==='f'?c.hf:c.hb,ar=(C.areas.find(z=>/마음/.test(z.name))||C.areas[0]||{}).id;
    e={kind:'imp110',type:'good',name:IK110[x.k][0]+' '+IK110[x.k][2]+': '+x.n,xp:+s[0]||0,gold:+s[1]||0,cond:+s[2]||0};if(e.cond)e.area=ar}
  e.imp110=x.id;const bonus=c.gr&&x.a?Math.min(50,Math.floor(x.a/c.gr)):0;if(bonus)e.gold=(+e.gold||0)+bonus;
  commit(()=>{applyEntry(d,e);x.s='h';x.eid=e.id;x.hk=d.date},[f.k,d.date]);
  fxPop('+'+e.xp+' XP','var(--good)');buzz();toast(IK110[x.k][0]+' '+IK110[x.k][2]+' ✓ '+x.n+' · 참았어요! +'+e.xp+'XP'+(e.gold?' · '+e.gold+'G':'')+(x.a?' · 아낀 약 '+won110(x.a):''))}
/* 대응: 든든한 것 먼저 → n분 기다리기 → 그래도 당기면 덜 나쁜 걸로 끝내기(대신 하기) */
function fill110(id,i){const f=find110(id);if(!f)return;const nm=cfg110().fill[i];if(!nm)return;f.x.fl=nm;f.x.w=Date.now()+cfg110().wait*60000;save(f.k);render()}
var TG110='그냥 꾹 참기';
function tough110(id){const f=find110(id);if(!f)return;f.x.fl=TG110;f.x.w=Date.now()+cfg110().wait*60000;save(f.k);render()}
function skip110(id){const f=find110(id);if(!f)return;f.x.w=Date.now()-1;save(f.k);render()}
function swap110(id,i){const f=find110(id);if(!f||!guard())return;const x=f.x,c=cfg110(),alt=c.alts[x.k][i];if(!alt)return;
  if(/보상함/.test(alt.n)){C.shop=C.shop||[];if(!C.shop.some(z=>z.name===x.n))C.shop.push({id:uid(),name:x.n,price:0});save('config');hold110(id);toast('📥 보상함에 적어 뒀어요 — 갖고 싶으면 가격을 정해 모아요');return}
  const d=today(),given=(d.entries||[]).filter(e=>e.kind==='imp110'&&/^🔁/.test(e.name||'')).length,xp=given<c.swmax?c.sw:0;
  const sv=x.a&&alt.c>0&&x.a>alt.c?x.a-alt.c:0,bonus=c.gr&&sv?Math.min(50,Math.floor(sv/c.gr)):0;
  const e={kind:'imp110',type:'good',name:'🔁 대신 '+alt.n+': '+x.n,xp,gold:bonus,cond:0,imp110:x.id};
  commit(()=>{applyEntry(d,e);x.s='w';x.alt=alt.n;x.ac=alt.c||0;x.eid=e.id;x.hk=d.date;x.gt=stamp()},[f.k,d.date]);
  buzz();toast('🔁 '+alt.n+'로 끝내요'+(xp?' · +'+xp+'XP':'')+(sv?' · 아낀 약 '+won110(sv):'')+' — 잘 골랐어요')}
function amt110(id,v){const f=find110(id);if(!f)return;v=num110(v);if(v>0)f.x.a=Math.min(1e7,v);else delete f.x.a;save(f.k)}
function conv110(name,amt){const c=cfg110();if(!(amt>0))return [];const td=gk76();let n=1;
  for(let i=0;i<28;i++)list110(addDays(td,-i)).forEach(x=>{if(name&&x.n===name)n++});
  const y=amt*n*30/28*12,L=[`최근 4주 ${n}번 속도면 한 달 약 ${won110(amt*n*30/28)} · 1년 약 ${won110(y)}`];
  const e=eq110(amt,2);if(e)L.push('이 한 번 = '+e);const e2=eq110(y,1);if(e2&&n>1)L.push('1년이면 '+e2);
  goalTxt110(amt).forEach(t=>L.push(t));return L}
function sum110(){const td=gk76(),c=cfg110();let hold=0,sw=0,sp=0,sn=0,ss=0,hn=0,wn=0;
  for(let i=0;i<7;i++)list110(addDays(td,-i)).forEach(x=>{const s=st110(x);
    if(s==='h'){hn++;hold+=x.a||0}else if(s==='w'){wn++;sw+=x.a&&x.ac&&x.a>x.ac?x.a-x.ac:0}
    else if(s==='g'&&x.a){sp+=x.a;if(x.a<10000){sn++;ss+=x.a}}});
  const u=n=>{const e=eq110(n,1);return e?' ≈ '+e:''};const L=[];
  if(hn)L.push(`참아서 ${hn}번${hold?' · 아낀 약 '+won110(hold)+u(hold):''}`);
  if(wn)L.push(`대신해서 ${wn}번${sw?' · 아낀 약 '+won110(sw):''}`);
  if(sp){L.push(`먹고·사서 쓴 약 ${won110(sp)}${u(sp)}`+(sn>1?` — 그중 만 원 미만 ${sn}건이 ${won110(ss)}`:''));
    const g=goal110(sp);if(g){if(g.aff)L.push(`그 돈이면 🎁 ${g.aff.n}(${g.aff.g}G) 값이에요`);else if(g.near)L.push(`그 돈은 🎁 ${g.near.n}(${g.near.g}G)의 ${Math.round(sp/g.near.w*100)}%예요`)}}
  return L}
function gave110(id){const f=find110(id);if(!f)return;f.x.s='g';f.x.gt=stamp();delete f.x.eid;delete f.x.hk;IM110.ed=id;save(f.k);render()}
/* ---- 못 참았던 때 기록 · 돌아보기 ---- */
var SIT110=['배고픔','스트레스','심심함','외로움','피곤','술자리','보상심리','습관적으로'];
function fails110(days){const td=gk76(),o=[];for(let i=0;i<days;i++){const k=addDays(td,-i);list110(k).forEach(x=>{if(st110(x)==='g')o.push({k,x})})}return o}
function hr110(x){const m=String(x.gt||x.t||'').match(/^(\d{1,2}):/);return m?+m[1]:null}
function band110(h){return h<5?'새벽(0~5시)':h<11?'아침(5~11시)':h<14?'점심(11~14시)':h<18?'오후(14~18시)':h<21?'저녁(18~21시)':'밤(21~24시)'}
function top110(map,n){return Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0,n)}
function pat110(F){const b={},s={},w={};let tried=0;const WD=['일','월','화','수','목','금','토'];
  F.forEach(({k,x})=>{const h=hr110(x);if(h!=null)b[band110(h)]=(b[band110(h)]||0)+1;(x.sit||[]).forEach(z=>s[z]=(s[z]||0)+1);
    const d=new Date(k+'T12:00:00');w[WD[d.getDay()]]=(w[WD[d.getDay()]]||0)+1;if(x.fl||x.w)tried++});
  const L=[],tb=top110(b,1)[0],ts=top110(s,3).filter(z=>z[1]>=1),tw=top110(w,1)[0];
  if(tb&&F.length>1)L.push(`가장 잦은 때: ${tb[0]} ${tb[1]}건${tw&&tw[1]>1?' · '+tw[0]+'요일이 많아요':''}`);
  if(ts.length)L.push(`자주 같이 있던 상황: ${ts.map(z=>z[0]+' '+z[1]).join(' · ')}`);
  L.push(`먹기 전에 든든한 것·기다리기를 해 본 건 ${tried}/${F.length}건`);return L}
function last110(x){const F=fails110(28).filter(z=>z.x.id!==x.id&&z.x.k===x.k&&(z.x.n===x.n||(z.x.sit&&z.x.sit.length)||z.x.m));
  const same=F.find(z=>z.x.n===x.n);return same||F[0]||null}
function hint110(x){const L=[],z=last110(x);
  if(z){const y=z.x,sit=(y.sit||[]).join('·');L.push(`💡 지난번(${z.k.slice(5).replace('-','/')} ${y.gt||y.t||''})엔 ${y.n}${sit?' — '+sit:''}${y.m?' · “'+y.m+'”':''}${y.fl||y.w?'':' · 대응 없이 바로 먹었어요'}. 이번엔 먼저 든든한 것부터요.`)}
  const h=nowHour(),near=fails110(28).filter(q=>q.x.k===x.k&&hr110(q.x)!=null&&Math.min(Math.abs(hr110(q.x)-h),24-Math.abs(hr110(q.x)-h))<=1).length;
  if(near>=2)L.push(`⏰ 지금 시간대(${h}시 전후)에 못 참은 적이 최근 4주에 ${near}번 있어요.`);return L}
function fdet110(x){const sit=x.sit||[];
  return `<div class="im110e"><div class="tiny muted">그때 어땠어요? 다음에 더 잘 참으려면 알아 두면 좋아요 (골라도 안 골라도 돼요)</div>
    <div class="row" style="gap:4px;flex-wrap:wrap;margin-top:4px">${SIT110.map(z=>`<button type="button" class="chipbtn" data-imsit110="${x.id}:${esc(z)}" aria-pressed="${sit.includes(z)}">${sit.includes(z)?'✓ ':''}${z}</button>`).join('')}</div>
    <div class="row" style="gap:6px;margin-top:4px;flex-wrap:nowrap"><input type="time" class="imt110" data-imtm110="${x.id}" value="${esc(x.gt||'')}" aria-label="몇 시쯤이었는지"><input type="text" class="imm110" data-imm110="${x.id}" maxlength="100" autocomplete="off" placeholder="그때 상황·내가 한 행동 (예: 야근 후 배달앱을 열었다)" value="${esc(x.m||'')}"></div>
    <button type="button" class="linkbtn tiny" data-imed110="${x.id}">접기</button></div>`}
function ftxt110(x){const bits=[];if((x.sit||[]).length)bits.push('🏷 '+x.sit.join('·'));if(x.m)bits.push('“'+x.m+'”');if(x.fl===TG110)bits.push('대응: 💪 '+TG110);else if(x.fl)bits.push('든든한 것: '+x.fl);else if(x.w)bits.push('기다리기 해 봄');return bits.length?`<div class="tiny muted">${bits.map(esc).join(' · ')}</div>`:''}
function hist110(){const td=gk76(),F=fails110(28);if(!F.length)return '';const old=F.filter(z=>z.k!==td),tot=F.reduce((a,z)=>a+(z.x.a||0),0);
  return `<details class="im110hs"${IM110.hs?' open':''}><summary class="small">🔎 못 참았던 때 돌아보기 · 최근 4주 ${F.length}건${tot?' · 약 '+won110(tot):''}</summary>
    <ul class="im110sum">${pat110(F).map(l=>`<li class="tiny">${esc(l)}</li>`).join('')}</ul>
    ${old.map(z=>{const x=z.x,K=IK110[x.k];return `<div class="im110r"><span class="nm">${K[0]} ${esc(x.n)} <small class="muted num">${z.k.slice(5).replace('-','/')} ${esc(x.gt||x.t||'')}${x.a?' · 약 '+won110(x.a):''}</small>${ftxt110(x)}</span><button type="button" class="linkbtn" data-imed110="${x.id}">✎ 상황 적기</button>${IM110.ed===x.id?fdet110(x):''}</div>`}).join('')||'<p class="tiny muted" style="margin:4px 0 0">오늘 것은 위 \'오늘 결과\'에서 적어요.</p>'}</details>`}
function undo110(id){const f=find110(id);if(!f)return;const x=f.x;
  if((x.s==='h'||x.s==='w')&&entryOf110(x)){removeEntry(x.hk,x.eid)}
  x.s='p';delete x.eid;delete x.hk;delete x.gt;delete x.alt;delete x.ac;delete x.w;delete x.fl;save(f.k);render()}
function del110(id){const f=find110(id);if(!f)return;const d=DAYS[f.k];d.imp110=d.imp110.filter(y=>y.id!==id);save(f.k);render()}

normDay=(function(prev){return function(k,raw){const d=prev.apply(this,arguments);
  try{if(raw&&Array.isArray(raw.imp110))d.imp110=raw.imp110.slice(0,60).map(x=>{const o={id:String(x.id||uid()),k:x.k==='b'?'b':'f',n:String(x.n||'').slice(0,30),t:String(x.t||''),s:x.s==='h'||x.s==='g'||x.s==='w'?x.s:'p'};
    if(x.a>0)o.a=Math.min(1e7,Math.round(+x.a));if(x.w>0)o.w=+x.w;if(x.fl)o.fl=String(x.fl).slice(0,14);if(x.alt)o.alt=String(x.alt).slice(0,20);if(x.ac>0)o.ac=Math.round(+x.ac);
    if(Array.isArray(x.sit))o.sit=x.sit.slice(0,8).map(z=>String(z).slice(0,10));if(x.m)o.m=String(x.m).slice(0,100);
    if(x.rid)o.rid=String(x.rid);if(x.eid){o.eid=String(x.eid);o.hk=String(x.hk||k)}if(x.gt)o.gt=String(x.gt);return o})}catch(e){}return d}})(normDay);

/* ---- 칩 ---- */
function chip110(){const td=gk76(),p=recent110().filter(z=>z.s==='p'),n=p.length,night=nowHour()>=21&&p.some(z=>z.k===td),now=Date.now();
  const wt=p.filter(z=>z.x.w&&z.x.w>now),rm=wt.length?Math.max(...wt.map(z=>Math.ceil((z.x.w-now)/60000))):0,due=p.some(z=>z.x.w&&z.x.w<=now);
  const lab=!n?'🍰 충동':rm?`🍰 ⏳ ${rm}분 <span class="num">${n}</span>`:due?`🍰 지금은? <span class="num">${n}</span>`:night?`🌙 결과 정하기 <span class="num">${n}</span>`:`🍰 참는 중 <span class="num">${n}</span>`;
  const tip=n?`참는 중 ${n}개 — 눌러서 대응하거나 '안 먹었어요·안 샀어요'로 결과를 정해요${night?' (오늘 밤)':''}`:'당기는 걸 적어 두면 대응 순서를 알려 주고, 참으면 보상이 있어요';
  return `<button type="button" class="im110${n?' on110':' no110'}" data-im110="1" title="${esc(tip)}" aria-label="${esc(tip)}">${lab}</button>`}
renderBattle=(function(prev){return function(){const r=prev.apply(this,arguments);
  try{const box=$('battleBox'),mm=box&&box.querySelector('.mm90');
    if(mm){mm.querySelector('.im110')?.remove();mm.classList.add('mm102');mm.insertAdjacentHTML('beforeend',chip110())}}catch(e){console.error(e)}return r}})(renderBattle);

/* ---- 창 ---- */
function kinds110(){return `<span class="seg">${['f','b'].map(k=>`<button type="button" data-imk110="${k}" aria-pressed="${IM110.kind===k}">${IK110[k][0]} ${IK110[k][1]}</button>`).join('')}</span>`}
function names110(){const cnt={},td=gk76();
  for(let i=0;i<14;i++){list110(addDays(td,-i)).forEach(x=>{if(x.k===IM110.kind)cnt[x.n]=(cnt[x.n]||0)+1})}
  return Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a]).slice(0,5)}
function recipes110(){const ns=names110();return ns.length?ns.map(n=>`<button type="button" class="chipbtn" data-imn110="${esc(n)}">${esc(n)}</button>`).join(''):''}
function plan110(x,c){const K=IK110[x.k],r=x.w?Math.ceil((x.w-Date.now())/60000):null;
  const hn=hint110(x).map(l=>`<div class="tiny im110hint">${esc(l)}</div>`).join('');
  const alts=`<div class="row" style="gap:6px;flex-wrap:wrap;margin-top:4px">${c.alts[x.k].map((a,i)=>`<button type="button" class="chipbtn" data-imal110="${x.id}:${i}">${esc(a.n)}${a.c?' · '+won110(a.c):''}</button>`).join('')}</div>`;
  let h=hn;
  if(x.k==='b')return `${hn}<div class="tiny"><b>🧭 물건은 오늘 사지 않는 게 먼저예요.</b> 정말 갖고 싶다면 보상함에 적어 두고 며칠 뒤에 다시 봐요.</div>${alts}`;
  if(!x.w){
    h+=`<div class="tiny"><b>🧭 ① 먼저 든든하게</b> — 집에 도착하면 바로, 포만감 있는 걸 하나 먹어요. 배고프고 지친 상태가 충동을 가장 키워요.</div>
      <div class="row" style="gap:6px;flex-wrap:wrap;margin-top:4px">${c.fill.map((n,i)=>`<button type="button" class="chipbtn" data-imfl110="${x.id}:${i}">${esc(n)} 먹었어요</button>`).join('')}<button type="button" class="chipbtn" data-imtg110="${x.id}" title="먼저 든든하게 먹을 수 없을 때(밖에 있을 때 등) — 참는 것도 대응이에요">💪 ${TG110}</button></div>
      <div class="tiny muted" style="margin-top:4px">누르면 ${c.wait}분 기다리기가 시작돼요 → 그래도 당기면 덜 나쁜 걸로 끝내요. <button type="button" class="linkbtn" data-imsk110="${x.id}">바로 정할래요</button></div>`}
  else if(r>0){
    h+=`<div class="tiny"><b>⏳ ② 기다리는 중 — 약 ${r}분 남음</b>${x.fl===TG110?` · 💪 ${TG110}`:x.fl?` · ${esc(x.fl)} 먹었어요`:''}<br><span class="muted">물 한 잔을 마시거나 잠깐 씻고 오면 시간이 더 빨리 가요.</span> <button type="button" class="linkbtn" data-imsk110="${x.id}">바로 정할래요</button></div>`}
  else{
    h+=`<div class="tiny"><b>③ 지금 당김은?</b> 사라졌으면 위 <b>✓ ${K[2]}</b>을 눌러요. 줄었어도 그대로여도, 먹겠다면 덜 나쁜 걸로 끝내요:</div>${alts}`}
  return h}
function rows110(){
  const td=gk76(),it=recent110(),pend=it.filter(z=>z.s==='p'),done=it.filter(z=>z.s!=='p'&&z.k===td),c=cfg110();
  const pf=pv110('f'),pb=pv110('b');let h='';
  if(pend.length){
    h+=`<h4 class="im110h">참는 중 <span class="num">${pend.length}</span> <small class="muted">참으면 ${IK110.f[0]} ${pvTxt110(pf)} · ${IK110.b[0]} ${pvTxt110(pb)}</small></h4>`;
    h+=pend.map(z=>{const x=z.x,K=IK110[x.k];return `<div class="im110r"><span class="nm">${K[0]} ${esc(x.n)} <small class="muted num">${esc(x.t||'')}${z.k!==td?' · 어제':''}${x.a?' · 약 '+won110(x.a):''}</small></span>
      <input type="text" inputmode="numeric" data-cm111="1" class="ima110" data-imam110="${x.id}" placeholder="얼마쯤? 원" value="${cm110(x.a)}" aria-label="대략 얼마인지(원)">
      <button type="button" class="btn sm" data-imh110="${x.id}">✓ ${K[2]}</button><button type="button" class="btn ghost sm" data-img110="${x.id}">${K[3]}</button><button type="button" class="btn ghost sm" data-impl110="${x.id}" aria-pressed="${IM110.plan===x.id}">🧭 대응</button><button type="button" class="x" data-imd110="${x.id}" aria-label="지우기">×</button>
      ${IM110.plan===x.id?`<div class="im110p">${plan110(x,c)}</div>`:''}</div>`}).join('')}
  else h+=`<p class="tiny muted" style="margin:8px 0 0">아직 참는 중인 게 없어요. 당길 때 적어 두면 대응 순서를 알려 드려요. 밤엔 '참았어요'만 누르면 돼요.</p>`;
  if(done.length){
    h+=`<h4 class="im110h">오늘 결과 <span class="num">${done.length}</span></h4>`;
    h+=done.map(z=>{const x=z.x,K=IK110[x.k],ok=z.s==='h',sw=z.s==='w',e=(ok||sw)&&entryOf110(x);
      return `<div class="im110r done"><span class="nm">${ok?'✓':sw?'🔁':'·'} ${K[0]} ${esc(x.n)} <small class="muted">${ok?`${K[2]}${e&&e.xp?' · +'+e.xp+'XP':''}`:sw?`${esc(x.alt||'')}로 대신${e&&e.xp?' · +'+e.xp+'XP':''}`:`${K[3]} · 기록만`}${x.a?' · 약 '+won110(x.a):''}</small></span>
      ${z.s==='g'?`<input type="text" inputmode="numeric" data-cm111="1" class="ima110" data-imam110="${x.id}" placeholder="얼마였어요? 원" value="${cm110(x.a)}" aria-label="얼마 썼는지(원)"><button type="button" class="linkbtn" data-imed110="${x.id}">✎ 상황 적기</button>`:''}<button type="button" class="linkbtn" data-imu110="${x.id}">되돌리기</button>
      ${z.s==='g'?ftxt110(x)+(IM110.ed===x.id?fdet110(x):''):''}</div>`}).join('')}
  h+=hist110();
  const S=sum110();if(S.length)h+=`<h4 class="im110h">이번 주 한눈에</h4><ul class="im110sum">${S.map(l=>`<li class="tiny">${esc(l)}</li>`).join('')}</ul>`;
  return h}
function redraw110(){const L=$('imp110L');if(L)L.innerHTML=rows110();upd110();const R=$('imp110R');if(R)R.innerHTML=recipes110();
  document.querySelectorAll('#sheetC [data-imk110]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.imk110===IM110.kind));
  const i=$('imp110N');if(i)i.placeholder=IM110.kind==='f'?'예: 치킨 · 케이크':'예: 새 이어폰 · 옷'}
function upd110(){const n=$('imp110N'),a=$('imp110A'),o=$('imp110C');if(o)o.innerHTML=conv110(n&&n.value.trim(),a&&num110(a.value)).map(l=>`<div>${esc(l)}</div>`).join('')}
function sheet110(kind){
  if(kind)IM110.kind=kind==='b'?'b':'f';const c=cfg110(),af=card110('f'),ab=card110('b');
  sheetCtx={imp110:1};
  openSheet(`<div class="sh"><h3>🍰 충동 적기 <small class="muted">참으면 밤에 확정</small></h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <div class="row" style="gap:6px;margin-bottom:6px">${kinds110()}</div>
    <div class="row" style="flex-wrap:nowrap;gap:6px"><input id="imp110N" maxlength="30" autocomplete="off" placeholder=""><input id="imp110A" type="text" inputmode="numeric" data-cm111="1" autocomplete="off" placeholder="얼마쯤? 원(선택)" style="max-width:130px"><button type="button" class="btn" data-imadd110="1">적기</button></div>
    <div id="imp110C" class="tiny muted" style="margin-top:4px"></div>
    <div class="row" id="imp110R" style="gap:6px;margin-top:6px;flex-wrap:wrap"></div>
    <div id="imp110L"></div>
    <div class="row" style="gap:6px;margin-top:10px"><button type="button" class="btn ghost sm" data-imdopa110="1">🍬 대신할 것 보기</button></div>
    <details class="im110s" style="margin-top:10px"><summary class="small">⚙ 보상 수치</summary>
      <div class="kv" style="margin-top:6px"><label>적기 보상 XP<input type="number" min="0" max="10" data-imc110="rx" value="${c.rx}"></label><label>하루 몇 번까지 보상<input type="number" min="0" max="20" data-imc110="max" value="${c.max}"></label>
        <label>기다리는 시간(분)<input type="number" min="5" max="60" data-imc110="wait" value="${c.wait}"></label><label>대신하기 보상 XP<input type="number" min="0" max="10" data-imc110="sw" value="${c.sw}"></label>
        <label>대신하기 하루 몇 번까지 XP<input type="number" min="0" max="10" data-imc110="swmax" value="${c.swmax}"></label><label>아낀 돈 → 골드(몇 원마다 1G, 0=끔)<input type="number" min="0" max="5000" data-imc110="gr" value="${c.gr}"></label></div>
      <label class="tiny" style="display:block;margin-top:6px">든든하게 먹을 것(쉼표로 나눠요)<input type="text" data-imt110="fill" value="${esc(c.fill.join(', '))}" maxlength="80"></label>
      <label class="tiny" style="display:block;margin-top:6px">🍰 먹고 싶을 때 대신할 것(한 줄에 하나, 뒤에 금액을 적으면 아낀 돈을 셈해요 예: 라면 하나 3000)<textarea rows="3" data-imt110="altf">${esc(altTxt110(c.alts.f))}</textarea></label>
      <label class="tiny" style="display:block;margin-top:6px">🛍 사고 싶을 때 대신할 것('보상함'이 들어가면 보상함에 적어 줘요)<textarea rows="2" data-imt110="altb">${esc(altTxt110(c.alts.b))}</textarea></label>
      <label class="tiny" style="display:block;margin-top:6px">내 기준(한 줄에 하나 · 이름 뒤에 금액) — 쓴 돈이 이것의 몇 개 값인지 보여 줘요<textarea rows="6" data-imt110="units">${esc(altTxt110(c.units))}</textarea></label>
      <div class="kv" style="margin-top:6px"><label>골드 1G = 몇 원(보상함 환산)<input type="text" inputmode="numeric" data-cm111="1" data-imc110="won" value="${cm110(c.won)}"></label></div>
      <p class="tiny muted" style="margin:6px 0 0">확정 보상은 카드 점수 그대로예요 — ${IK110.f[0]} ${af?`<b>${esc(af.name)}</b> 카드`:`(야식·폭식 '참았다' 카드가 없어서 기본 ${pvTxt110(pv110('f'))})`} · ${IK110.b[0]} ${ab?`<b>${esc(ab.name)}</b> 카드`:`(충동구매 '참았다' 카드가 없어서 기본 ${pvTxt110(pv110('b'))})`}. 점수는 편집 → 행동에서 바꿔요. 먹었어요·샀어요는 점수를 깎지 않고 기록만 남아요.</p></details>`);
  redraw110()}

addEventListener('click',e=>{const T=e.target;if(!T||!T.closest)return;let b;
  if((b=T.closest('[data-im110]'))){e.preventDefault();e.stopPropagation();if(!ready)return;sheet110();return}
  if((b=T.closest('[data-imopen110]'))){e.preventDefault();e.stopPropagation();sheet110('f');return}
  if(!(sheetCtx&&sheetCtx.imp110))return;
  if((b=T.closest('[data-imk110]'))){e.preventDefault();e.stopPropagation();IM110.kind=b.dataset.imk110;redraw110();return}
  if((b=T.closest('[data-imn110]'))){e.preventDefault();e.stopPropagation();const a=$('imp110A'),x=add110(IM110.kind,b.dataset.imn110,a&&num110(a.value));if(x){IM110.plan=x.id;if(a)a.value='';redraw110()}return}
  if((b=T.closest('[data-imadd110]'))){e.preventDefault();e.stopPropagation();const i=$('imp110N'),a=$('imp110A'),x=add110(IM110.kind,i&&i.value,a&&num110(a.value));if(x){IM110.plan=x.id;if(i){i.value='';i.focus()}if(a)a.value='';redraw110()}return}
  if((b=T.closest('[data-impl110]'))){e.preventDefault();e.stopPropagation();IM110.plan=IM110.plan===b.dataset.impl110?null:b.dataset.impl110;redraw110();return}
  if((b=T.closest('[data-imfl110]'))){e.preventDefault();e.stopPropagation();const q=b.dataset.imfl110.split(':');fill110(q[0],+q[1]);redraw110();return}
  if((b=T.closest('[data-imtg110]'))){e.preventDefault();e.stopPropagation();tough110(b.dataset.imtg110);redraw110();return}
  if((b=T.closest('[data-imsk110]'))){e.preventDefault();e.stopPropagation();skip110(b.dataset.imsk110);redraw110();return}
  if((b=T.closest('[data-imal110]'))){e.preventDefault();e.stopPropagation();const q=b.dataset.imal110.split(':');swap110(q[0],+q[1]);redraw110();return}
  if((b=T.closest('[data-imh110]'))){e.preventDefault();e.stopPropagation();hold110(b.dataset.imh110);redraw110();return}
  if((b=T.closest('[data-img110]'))){e.preventDefault();e.stopPropagation();gave110(b.dataset.img110);redraw110();return}
  if((b=T.closest('[data-imu110]'))){e.preventDefault();e.stopPropagation();undo110(b.dataset.imu110);redraw110();return}
  if((b=T.closest('[data-imd110]'))){e.preventDefault();e.stopPropagation();del110(b.dataset.imd110);redraw110();return}
  if((b=T.closest('[data-imdopa110]'))){e.preventDefault();e.stopPropagation();const st=IM110.kind==='b'?'urge':'binge';closeSheet();setTimeout(()=>{ui.dst=st;openDopaNow(st)},60);return}
  if((b=T.closest('[data-imed110]'))){e.preventDefault();e.stopPropagation();const id=b.dataset.imed110;IM110.ed=IM110.ed===id?null:id;redraw110();return}
  if((b=T.closest('[data-imsit110]'))){e.preventDefault();e.stopPropagation();const q=b.dataset.imsit110,i=q.indexOf(':'),f=find110(q.slice(0,i));
    if(f){const v=q.slice(i+1),a=f.x.sit=f.x.sit||[],j=a.indexOf(v);if(j>=0)a.splice(j,1);else if(a.length<4)a.push(v);if(!a.length)delete f.x.sit;save(f.k)}redraw110();return}
},true);
// 입력: Enter로 적기(한글 조합 중 Enter는 무시) · 수치 칸은 시트를 다시 그리는 전역 change를 막고 바로 저장
addEventListener('keydown',e=>{const t=e.target;if(!t||t.id!=='imp110N'||e.key!=='Enter')return;
  if(e.isComposing||e.keyCode===229)return;e.preventDefault();e.stopPropagation();
  const a=$('imp110A'),x=add110(IM110.kind,t.value,a&&num110(a.value));if(x){IM110.plan=x.id;t.value='';if(a)a.value='';t.focus();redraw110()}},true);
addEventListener('input',e=>{const t=e.target;if(t&&(t.id==='imp110N'||t.id==='imp110A')&&!e.isComposing)upd110()},true);
addEventListener('input',e=>{const t=e.target;if(t&&t.matches&&t.matches('[data-imm110]')&&!e.isComposing){const f=find110(t.dataset.imm110);if(f){if(t.value)f.x.m=t.value.slice(0,100);else delete f.x.m}}},true);
addEventListener('toggle',e=>{const t=e.target;if(t&&t.classList&&t.classList.contains('im110hs'))IM110.hs=t.open},true);
addEventListener('change',e=>{const t=e.target;if(!t||!t.matches)return;
  if(t.matches('[data-imm110]')){e.stopPropagation();const f=find110(t.dataset.imm110);if(f){if(t.value.trim())f.x.m=t.value.trim().slice(0,100);else delete f.x.m;save(f.k);toast('적어 뒀어요')}return}
  if(t.matches('[data-imtm110]')){e.stopPropagation();const f=find110(t.dataset.imtm110);if(f&&/^\d{1,2}:\d{2}$/.test(t.value)){f.x.gt=t.value;save(f.k);toast('시각을 고쳤어요');setTimeout(redraw110,0)}return}
  if(t.matches('[data-imam110]')){e.stopPropagation();amt110(t.dataset.imam110,t.value);toast('금액을 적었어요');setTimeout(redraw110,0);return}
  if(t.matches('[data-imt110]')){e.stopPropagation();C.imp110=C.imp110||{};const k=t.dataset.imt110,v=t.value;
    if(k==='fill')C.imp110.fill=v.split(/[,\n]/).map(z=>z.trim()).filter(Boolean).slice(0,8);
    else if(k==='altf'||k==='altb'){C.imp110.alts=C.imp110.alts||{};C.imp110.alts[k==='altf'?'f':'b']=altParse110(v)}
    else if(k==='units'){const u=altParse110(v).filter(z=>z.c>0);C.imp110.units=u.length?u:UN110.map(z=>({...z}))}
    save('config');toast('저장했어요');return}
  if(!t.matches('[data-imc110]'))return;e.stopPropagation();
  const k=t.dataset.imc110,R={rx:[0,10],max:[0,20],wait:[5,60],sw:[0,10],swmax:[0,10],gr:[0,5000],won:[1,100000]}[k]||[0,20];
  const v=Math.max(R[0],Math.min(R[1],num110(t.value)));C.imp110=C.imp110||{};
  C.imp110[k]=v;t.value=k==='won'?cm110(v):v;save('config');toast('저장했어요')},true);

setInterval(()=>{try{if(!(sheetCtx&&sheetCtx.imp110)||!$('imp110L'))return;const a=document.activeElement;if(a&&a.closest&&a.closest('#imp110L'))return;
  if(recent110().some(z=>z.s==='p'&&z.x.w))redraw110()}catch(e){}},20000);

/* ---- 🍬 지금 어때? '당김' 창에서 바로 적기 ---- */
openDopaNow=(function(prev){return function(){const r=prev.apply(this,arguments);
  try{if(ui.dst==='urge'||ui.dst==='binge'){const sc=$('sheetC'),st=sc&&sc.querySelector('.stack');
    if(st&&!sc.querySelector('.im110d'))st.insertAdjacentHTML('beforebegin',`<div class="im110d"><button type="button" class="btn sm" data-imopen110="1">🍰 당기는 걸 적어 두기 ›</button><span class="tiny muted"> 참으면 밤에 보상</span></div>`)}}catch(x){console.error(x)}return r}})(openDopaNow);

F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['🍰 충동 적기 → 확정','홈 → 전투 카드 기분 줄 🍰 칩 · 🍬 지금 어때? → 당김 → 🍰 당기는 걸 적어 두기','먹고 싶음·사고 싶음을 적어 두면 🧭 대응 순서(든든한 것 먼저 → 기다리기 → 덜 나쁜 걸로 끝내기)와 작은 보상, 밤에 안 먹었어요·안 샀어요로 결과를 정하면 큰 보상. 금액을 적으면 아낀 돈·월·연 환산이 보여요. 먹었어요·샀어요는 기록만.',()=>{location.hash='home'},'충동 참기 야식 폭식 충동구매 참았다 적기 확정 당김 대기'],
])}})(F67);
