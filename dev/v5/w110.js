/* ---- v11.1 (w110.js): F1 ⑤-1 충동 적기 → 확정 ----
   참기는 '안 한 일'이라 흔적이 없어 기록이 안 됨 → 당길 때 먼저 적고(작은 보상), 그날 밤 '안 먹음/안 샀음'으로 확정(큰 보상).
   · 데이터: DAYS[날].imp110=[{id,k:'f'(먹고 싶음)|'b'(사고 싶음),n:이름,t:'HH:MM',s:'p'열림|'h'참음|'g'먹음·샀음,rid:적기 기록 id,eid:확정 기록 id,hk:확정 기록 날,gt}] (normDay 감싸서 보존)
   · 적기 = kind 'imp110' 기록 XP `C.imp110.rx`(기본 1), 하루 `max`(기본 3)번까지만(많이 적어서 점수 얻기 막기).
   · 확정(참음) = 연결된 '참았다' 카드를 그대로 기록(카드 점수·보조 영역·통계가 같이 감) — 🍰 /(야식|폭식|과식).*참/ · 🛍 /충동.*(구매|지출|소비).*참/ (`C.imp110.card={f:id,b:id}`로 고정 가능).
     카드가 없으면 `C.imp110.hf|hb=[XP,골드,컨디션]`(기본 [6,0,3]·[8,20,2]).
   · 먹었음·샀음 = 기록만(점수 안 깎음 — 솔직한 기록이 불이익이 되지 않게). 돈 상태로도 안 깎음.
   · '참음' 상태는 확정 기록이 실제로 있을 때만 — 기록하기에서 그 기록을 지우면 저절로 열림(st110)으로 돌아옴.
   · 입구: 전투 카드 기분 줄 🍰 칩(.im110) · 🍬 지금 어때? '당김' 창 위 단추(.im110d). 이 칩은 renderBattle 맨 바깥 감싸개가 다시 넣음. */

var IK110={f:['🍰','먹고 싶음','안 먹음','먹었음'],b:['🛍','사고 싶음','안 샀음','샀음']};
var IM110={kind:'f'};
function cfg110(){const c=C.imp110||{};
  return{rx:c.rx!=null?Math.max(0,+c.rx||0):1,max:c.max!=null?Math.max(0,Math.round(+c.max)||0):3,hf:Array.isArray(c.hf)?c.hf:[6,0,3],hb:Array.isArray(c.hb)?c.hb:[8,20,2]}}
function cardRe110(k){return k==='f'?/(야식|폭식|과식).*참|참.*(야식|폭식|과식)/:/충동.*(구매|지출|소비).*참|참.*충동.*(구매|지출|소비)/}
function card110(k){const id=((C.imp110||{}).card||{})[k];let a=id&&C.actions.find(x=>x.id===id);
  if(!a)a=C.actions.find(x=>x.type==='good'&&cardRe110(k).test(x.name||''));return a||null}
function pv110(k){const a=card110(k),c=cfg110();
  if(a)return{xp:+a.xp||0,gold:Math.abs(+a.gold||0),cond:Math.abs(+a.cond||0),nm:a.name};
  const s=k==='f'?c.hf:c.hb;return{xp:+s[0]||0,gold:+s[1]||0,cond:+s[2]||0,nm:''}}
function pvTxt110(v){return '+'+v.xp+'XP'+(v.gold?' · '+v.gold+'G':'')+(v.cond?' · 컨디션 '+v.cond:'')}

function list110(k){const d=DAYS[k];return d&&Array.isArray(d.imp110)?d.imp110:[]}
function entryOf110(x){const d=x.hk&&DAYS[x.hk];return d&&(d.entries||[]).find(e=>e.id===x.eid)}
function st110(x){if(x.s==='h')return entryOf110(x)?'h':'p';return x.s==='g'?'g':'p'}
function recent110(){const td=gk76(),o=[];for(let i=0;i<3;i++){const k=addDays(td,-i);list110(k).forEach(x=>o.push({k,x,s:st110(x)}))}return o}
function find110(id){const r=recent110().find(z=>z.x.id===id);return r||null}

/* ---- 적기 · 확정 ---- */
function add110(kind,name){
  if(!guard())return null;name=String(name||'').trim().slice(0,30);
  if(!name){toast('무엇이 당기는지 적어요');return null}
  const d=today(),k=d.date,c=cfg110();d.imp110=d.imp110||[];
  const x={id:uid(),k:kind==='b'?'b':'f',n:name,t:stamp(),s:'p'};d.imp110.push(x);
  const given=d.imp110.filter(y=>y.rid).length;
  commit(()=>{if(c.rx>0&&given<c.max){const e={kind:'imp110',type:'good',name:IK110[x.k][0]+' 충동 적기: '+name,xp:c.rx,gold:0,cond:0,imp110:x.id};applyEntry(d,e);x.rid=e.id}},[k]);
  return x}
function hold110(id){
  const f=find110(id);if(!f||!guard())return;const x=f.x,a=card110(x.k),c=cfg110(),d=today();let e;
  if(a){e=actEntry(a,{});e.note=IK110[x.k][0]+' '+x.n}
  else{const s=x.k==='f'?c.hf:c.hb,ar=(C.areas.find(z=>/마음/.test(z.name))||C.areas[0]||{}).id;
    e={kind:'imp110',type:'good',name:IK110[x.k][0]+' '+IK110[x.k][2]+': '+x.n,xp:+s[0]||0,gold:+s[1]||0,cond:+s[2]||0};if(e.cond)e.area=ar}
  e.imp110=x.id;
  commit(()=>{applyEntry(d,e);x.s='h';x.eid=e.id;x.hk=d.date},[f.k,d.date]);
  fxPop('+'+e.xp+' XP','var(--good)');buzz();toast(IK110[x.k][0]+' '+IK110[x.k][2]+' ✓ '+x.n+' · 참았어요! +'+e.xp+'XP'+(e.gold?' · '+e.gold+'G':''))}
function gave110(id){const f=find110(id);if(!f)return;f.x.s='g';f.x.gt=stamp();delete f.x.eid;delete f.x.hk;save(f.k);render()}
function undo110(id){const f=find110(id);if(!f)return;const x=f.x;
  if(x.s==='h'&&entryOf110(x)){removeEntry(x.hk,x.eid)}
  x.s='p';delete x.eid;delete x.hk;delete x.gt;save(f.k);render()}
function del110(id){const f=find110(id);if(!f)return;const d=DAYS[f.k];d.imp110=d.imp110.filter(y=>y.id!==id);save(f.k);render()}

normDay=(function(prev){return function(k,raw){const d=prev.apply(this,arguments);
  try{if(raw&&Array.isArray(raw.imp110))d.imp110=raw.imp110.slice(0,60).map(x=>{const o={id:String(x.id||uid()),k:x.k==='b'?'b':'f',n:String(x.n||'').slice(0,30),t:String(x.t||''),s:x.s==='h'||x.s==='g'?x.s:'p'};
    if(x.rid)o.rid=String(x.rid);if(x.eid){o.eid=String(x.eid);o.hk=String(x.hk||k)}if(x.gt)o.gt=String(x.gt);return o})}catch(e){}return d}})(normDay);

/* ---- 칩 ---- */
function chip110(){const td=gk76(),p=recent110().filter(z=>z.s==='p'),n=p.length,night=nowHour()>=21&&p.some(z=>z.k===td);
  const tip=n?`참는 중 ${n}개 — 눌러서 '안 먹음·안 샀음'으로 확정${night?' (오늘 밤)':''}`:'당기는 걸 적어 두면 밤에 확정할 수 있어요 (참으면 보상)';
  return `<button type="button" class="im110${n?' on110':' no110'}" data-im110="1" title="${esc(tip)}" aria-label="${esc(tip)}">${n?`🍰 ${night?'오늘 밤 확정':'참는 중'} <span class="num">${n}</span>`:'🍰 충동'}</button>`}
renderBattle=(function(prev){return function(){const r=prev.apply(this,arguments);
  try{const box=$('battleBox'),mm=box&&box.querySelector('.mm90');
    if(mm){mm.querySelector('.im110')?.remove();mm.classList.add('mm102');mm.insertAdjacentHTML('beforeend',chip110())}}catch(e){console.error(e)}return r}})(renderBattle);

/* ---- 창 ---- */
function kinds110(){return `<span class="seg">${['f','b'].map(k=>`<button type="button" data-imk110="${k}" aria-pressed="${IM110.kind===k}">${IK110[k][0]} ${IK110[k][1]}</button>`).join('')}</span>`}
function names110(){const cnt={},td=gk76();
  for(let i=0;i<14;i++){list110(addDays(td,-i)).forEach(x=>{if(x.k===IM110.kind)cnt[x.n]=(cnt[x.n]||0)+1})}
  return Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a]).slice(0,5)}
function recipes110(){const ns=names110();return ns.length?ns.map(n=>`<button type="button" class="chipbtn" data-imn110="${esc(n)}">${esc(n)}</button>`).join(''):''}
function rows110(){
  const td=gk76(),it=recent110(),pend=it.filter(z=>z.s==='p'),done=it.filter(z=>z.s!=='p'&&z.k===td);
  const pf=pv110('f'),pb=pv110('b');let h='';
  if(pend.length){
    h+=`<h4 class="im110h">참는 중 <span class="num">${pend.length}</span> <small class="muted">참으면 ${IK110.f[0]} ${pvTxt110(pf)} · ${IK110.b[0]} ${pvTxt110(pb)}</small></h4>`;
    h+=pend.map(z=>{const x=z.x,K=IK110[x.k];return `<div class="im110r"><span class="nm">${K[0]} ${esc(x.n)} <small class="muted num">${esc(x.t||'')}${z.k!==td?' · 어제':''}</small></span>
      <button type="button" class="btn sm" data-imh110="${x.id}">✓ ${K[2]}</button><button type="button" class="btn ghost sm" data-img110="${x.id}">${K[3]}</button><button type="button" class="x" data-imd110="${x.id}" aria-label="지우기">×</button></div>`}).join('')}
  else h+=`<p class="tiny muted" style="margin:8px 0 0">아직 참는 중인 게 없어요. 당길 때 적어 두면 밤에 '안 먹음·안 샀음'만 누르면 돼요.</p>`;
  if(done.length){
    h+=`<h4 class="im110h">오늘 확정 <span class="num">${done.length}</span></h4>`;
    h+=done.map(z=>{const x=z.x,K=IK110[x.k],ok=z.s==='h',e=ok&&entryOf110(x);
      return `<div class="im110r done"><span class="nm">${ok?'✓':'·'} ${K[0]} ${esc(x.n)} <small class="muted">${ok?`${K[2]}${e&&e.xp?' · +'+e.xp+'XP':''}`:`${K[3]} · 기록만`}</small></span><button type="button" class="linkbtn" data-imu110="${x.id}">되돌리기</button></div>`}).join('')}
  return h}
function redraw110(){const L=$('imp110L');if(L)L.innerHTML=rows110();const R=$('imp110R');if(R)R.innerHTML=recipes110();
  document.querySelectorAll('#sheetC [data-imk110]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.imk110===IM110.kind));
  const i=$('imp110N');if(i)i.placeholder=IM110.kind==='f'?'예: 치킨 · 케이크':'예: 새 이어폰 · 옷'}
function sheet110(kind){
  if(kind)IM110.kind=kind==='b'?'b':'f';const c=cfg110(),af=card110('f'),ab=card110('b');
  sheetCtx={imp110:1};
  openSheet(`<div class="sh"><h3>🍰 충동 적기 <small class="muted">참으면 밤에 확정</small></h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <div class="row" style="gap:6px;margin-bottom:6px">${kinds110()}</div>
    <div class="row" style="flex-wrap:nowrap;gap:6px"><input id="imp110N" maxlength="30" autocomplete="off" placeholder=""><button type="button" class="btn" data-imadd110="1">적기</button></div>
    <div class="row" id="imp110R" style="gap:6px;margin-top:6px;flex-wrap:wrap"></div>
    <div id="imp110L"></div>
    <div class="row" style="gap:6px;margin-top:10px"><button type="button" class="btn ghost sm" data-imdopa110="1">🍬 대신할 것 보기</button></div>
    <details class="im110s" style="margin-top:10px"><summary class="small">⚙ 보상 수치</summary>
      <div class="kv" style="margin-top:6px"><label>적기 보상 XP<input type="number" min="0" max="10" data-imc110="rx" value="${c.rx}"></label><label>하루 몇 번까지 보상<input type="number" min="0" max="20" data-imc110="max" value="${c.max}"></label></div>
      <p class="tiny muted" style="margin:6px 0 0">확정 보상은 카드 점수 그대로예요 — ${IK110.f[0]} ${af?`<b>${esc(af.name)}</b> 카드`:`(야식·폭식 '참았다' 카드가 없어서 기본 ${pvTxt110(pv110('f'))})`} · ${IK110.b[0]} ${ab?`<b>${esc(ab.name)}</b> 카드`:`(충동구매 '참았다' 카드가 없어서 기본 ${pvTxt110(pv110('b'))})`}. 점수는 편집 → 행동에서 바꿔요. 먹었음·샀음은 점수를 깎지 않고 기록만 남아요.</p></details>`);
  redraw110()}

addEventListener('click',e=>{const T=e.target;if(!T||!T.closest)return;let b;
  if((b=T.closest('[data-im110]'))){e.preventDefault();e.stopPropagation();if(!ready)return;sheet110();return}
  if((b=T.closest('[data-imopen110]'))){e.preventDefault();e.stopPropagation();sheet110('f');return}
  if(!(sheetCtx&&sheetCtx.imp110))return;
  if((b=T.closest('[data-imk110]'))){e.preventDefault();e.stopPropagation();IM110.kind=b.dataset.imk110;redraw110();return}
  if((b=T.closest('[data-imn110]'))){e.preventDefault();e.stopPropagation();if(add110(IM110.kind,b.dataset.imn110))redraw110();return}
  if((b=T.closest('[data-imadd110]'))){e.preventDefault();e.stopPropagation();const i=$('imp110N');if(add110(IM110.kind,i&&i.value)){if(i){i.value='';i.focus()}redraw110()}return}
  if((b=T.closest('[data-imh110]'))){e.preventDefault();e.stopPropagation();hold110(b.dataset.imh110);redraw110();return}
  if((b=T.closest('[data-img110]'))){e.preventDefault();e.stopPropagation();gave110(b.dataset.img110);redraw110();return}
  if((b=T.closest('[data-imu110]'))){e.preventDefault();e.stopPropagation();undo110(b.dataset.imu110);redraw110();return}
  if((b=T.closest('[data-imd110]'))){e.preventDefault();e.stopPropagation();del110(b.dataset.imd110);redraw110();return}
  if((b=T.closest('[data-imdopa110]'))){e.preventDefault();e.stopPropagation();closeSheet();setTimeout(()=>{ui.dst='urge';openDopaNow('urge')},60);return}
},true);
// 입력: Enter로 적기(한글 조합 중 Enter는 무시) · 수치 칸은 시트를 다시 그리는 전역 change를 막고 바로 저장
addEventListener('keydown',e=>{const t=e.target;if(!t||t.id!=='imp110N'||e.key!=='Enter')return;
  if(e.isComposing||e.keyCode===229)return;e.preventDefault();e.stopPropagation();
  if(add110(IM110.kind,t.value)){t.value='';t.focus();redraw110()}},true);
addEventListener('change',e=>{const t=e.target;if(!t||!t.matches||!t.matches('[data-imc110]'))return;e.stopPropagation();
  const k=t.dataset.imc110,v=Math.max(0,Math.min(k==='rx'?10:20,Math.round(+t.value)||0));C.imp110=C.imp110||{};C.imp110[k]=v;t.value=v;save('config');toast('저장했어요')},true);

/* ---- 🍬 지금 어때? '당김' 창에서 바로 적기 ---- */
openDopaNow=(function(prev){return function(){const r=prev.apply(this,arguments);
  try{if(ui.dst==='urge'){const sc=$('sheetC'),st=sc&&sc.querySelector('.stack');
    if(st&&!sc.querySelector('.im110d'))st.insertAdjacentHTML('beforebegin',`<div class="im110d"><button type="button" class="btn sm" data-imopen110="1">🍰 당기는 걸 적어 두기 ›</button><span class="tiny muted"> 참으면 밤에 보상</span></div>`)}}catch(x){console.error(x)}return r}})(openDopaNow);

F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['🍰 충동 적기 → 확정','홈 → 전투 카드 기분 줄 🍰 칩 · 🍬 지금 어때? → 당김 → 🍰 당기는 걸 적어 두기','먹고 싶음·사고 싶음을 적어 두면 작은 보상, 밤에 안 먹음·안 샀음으로 확정하면 큰 보상(연결된 참았다 카드 점수). 먹었음·샀음은 기록만.',()=>{location.hash='home'},'충동 참기 야식 폭식 충동구매 참았다 적기 확정 당김 대기'],
])}})(F67);
