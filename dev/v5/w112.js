/* ---- v11.4 (w112.js): 보상함 상한 — 물건별 주기 상한 + 한 달 전체 상한, 사기 전에 한 번 더 확인 (F1 ⑤-2) ----
   · 물건별 상한 `it.lm={n,p:'w'|'m'}`(주 n번·월 n번). 주는 월요일부터(weekStart — 사용자 확인 11/21), 월은 게임 날짜의 달.
   · 한 달 전체 상한 `C.cap112={m:원, pm:{v,from}}` — 이번 달 'buy' 기록의 골드×C.imp110.won원 합계(0이면 없음).
   · 사기 단추를 눌렀을 때 상한을 넘게 되면 창(`capSheet112`)으로 한 번 더 물음 — **점수·골드는 안 깎음, 막지도 않음**(사용자 확인 11/21: 확인만).
     대기기간(w111)이 먼저 막고, 그다음 이 확인. 확인에서 '그래도 살게요'를 누르면 원래 사기 처리(base44 data-buy)를 그대로 부름.
   · **변경 규칙**: 상한을 낮추거나 새로 정하는 건(엄하게) 바로, 높이거나 없애는 건(느슨하게) 다음 날부터(`it.lw`·`C.cap112.pm`, `ens112`가 적용).
     항목 상한 엄격도는 '한 달 환산 횟수'(`rate112`: 주 n번 = n×30/7, 월 n번 = n, 없음 = ∞)로 비교. 상한 = 쓸 수 있는 최대라서 '높임 = 느슨'(사용자 확인).
   · 횟수는 `kind:'buy'` 기록을 셈 — 새 기록엔 `e.sid112`(물건 id, applyEntry 감싸개), 옛 기록은 이름(`이름+' 구매'`)으로 맞춤. 구매 취소(removeEntry)하면 횟수도 줄어듦. */
function cfgC112(){const c=C.cap112=C.cap112&&typeof C.cap112==='object'?C.cap112:{};c.m=Math.max(0,Math.round(+c.m)||0);return c}
function lm112(it){const l=it&&it.lm;return l&&l.n>0&&(l.p==='w'||l.p==='m')?l:null}
function rate112(l){return l?(l.p==='w'?l.n*30/7:l.n):Infinity}
function ens112(){if(!ready||!Array.isArray(C.shop))return;let ch=0;const td=gk76();
  C.shop.forEach(it=>{if(it&&it.lw&&td>=it.lw.from){if(it.lw.v)it.lm=it.lw.v;else delete it.lm;delete it.lw;ch=1}});
  const c=C.cap112;if(c&&c.pm&&td>=c.pm.from){c.m=Math.max(0,Math.round(+c.pm.v)||0);delete c.pm;ch=1}
  if(ch)save('config')}
function eachBuy112(from,to,f){Object.keys(DAYS).forEach(k=>{if(k<from||k>to)return;((DAYS[k]&&DAYS[k].entries)||[]).forEach(e=>{if(e&&e.kind==='buy')f(e,k)})})}
function range112(it,td){return it.lm.p==='w'?[weekStart(td),addDays(weekStart(td),6)]:[td.slice(0,7)+'-01',td.slice(0,7)+'-31']}
function used112(it,td){td=td||gk76();const l=lm112(it);if(!l)return 0;const r=range112(it,td);let n=0;
  eachBuy112(r[0],r[1],e=>{if(e.sid112?e.sid112===it.id:e.name===it.name+' 구매')n++});return n}
function spent112(td){td=td||gk76();let g=0;eachBuy112(td.slice(0,7)+'-01',td.slice(0,7)+'-31',e=>{g+=Math.abs(+e.gold||0)});return g*cfg110().won}
function over112(it){ens112();const o=[],l=lm112(it),won=cfg110().won;
  if(l){const u=used112(it);if(u+1>l.n)o.push(`${l.p==='w'?'이번 주':'이번 달'} ${esc(it.name)} 이미 ${u}번 샀어요 — 상한은 ${l.p==='w'?'주':'월'} ${l.n}번`)}
  const m=cfgC112().m;if(m>0){const sp=spent112(),add=(+it.price||0)*won;if(sp+add>m)o.push(`이번 달 상점에서 이미 ${cm110(sp)||0}원 썼어요 — 이걸 사면 ${cm110(sp+add)}원 (상한 ${cm110(m)}원)`)}
  return o}
function capSheet112(it,o){sheetCtx={cap112:it.id};
  openSheet(`<div class="sh"><h3>🧾 한 번 더 확인</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <p style="margin:0 0 6px"><b>${esc(it.name)}</b> · ${it.price}G ≈ ${cm110(it.price*cfg110().won)}원</p>
    ${o.map(x=>`<p class="tiny cp112o" style="margin:0 0 4px">⚠ ${x}</p>`).join('')}
    <p class="tiny muted" style="margin:6px 0">상한을 넘겨도 점수·골드가 깎이지는 않아요. 정한 상한이 있어서 한 번 더 물어보는 거예요.</p>
    <div class="row" style="gap:6px"><button type="button" class="btn" data-cap112go="${esc(it.id)}">그래도 살게요</button><button type="button" class="btn ghost" data-sheet="close">안 살래요</button></div>`)}
function capItem112(id){ens112();const it=(C.shop||[]).find(z=>z.id===id);if(!it)return;const l=lm112(it);sheetCtx={cp112:id};
  openSheet(`<div class="sh"><h3>🧾 ${esc(it.name)} 상한</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <p class="tiny" style="margin:0 0 6px">예: '배달 음식 주 1번'. 넘기게 되면 사기 전에 한 번 더 물어봐요. 주는 월요일부터 세요. 점수·골드는 안 깎여요.</p>
    <div class="row" style="gap:6px;align-items:center"><select id="cp112P" aria-label="상한 주기"><option value="" ${l?'':'selected'}>상한 없음</option><option value="w" ${l&&l.p==='w'?'selected':''}>주</option><option value="m" ${l&&l.p==='m'?'selected':''}>월</option></select>
      <input type="number" id="cp112N" min="1" max="99" value="${l?l.n:1}" style="width:72px" aria-label="상한 횟수"><span class="tiny">번까지</span></div>
    ${it.lw?`<p class="tiny" style="margin:6px 0 0"><b>${md111(it.lw.from)}부터 ${it.lw.v?(it.lw.v.p==='w'?'주 ':'월 ')+it.lw.v.n+'번':'상한 없음'}으로 바뀔 예정</b></p>`:''}
    <p class="tiny muted" style="margin:6px 0">상한을 낮추거나 새로 정하는 건 바로, 높이거나 없애는 건 다음 날부터 적용돼요 — 충동이 올 때 풀지 못하게요.</p>
    <div class="row" style="gap:6px"><button type="button" class="btn" data-cp112s="${esc(it.id)}">저장</button><button type="button" class="btn ghost" data-sheet="close">닫기</button></div>`)}
function panelM112(){const c=cfgC112(),sp=spent112();
  return `<div class="cp112m" style="margin-top:8px;padding-top:6px;border-top:1px dashed var(--line)">
    <label class="tiny" style="display:block">🧾 한 달 상점 쓰기 상한(원, 선택) — 넘기게 되면 사기 전에 한 번 더 물어요<input type="text" inputmode="numeric" data-cm111="1" data-cpm112="1" value="${cm110(c.m)}">${c.pm?`<small class="muted"> → ${c.pm.v?cm110(c.pm.v)+'원':'상한 없음'} (${md111(c.pm.from)}부터)</small>`:''}</label>
    <p class="tiny muted" style="margin:6px 0 0">이번 달 상점에서 쓴 돈 ${cm110(sp)||0}원${c.m>0?` / ${cm110(c.m)}원`:''}. 물건별 상한은 아래 물건 줄의 '상한 설정'에서 정해요(주는 월요일부터). 상한을 넘겨도 점수·골드는 안 깎여요. <b>낮추거나 새로 정하는 건 바로</b>, <b>높이거나 없애는 건 다음 날부터</b> 적용돼요.</p></div>`}
function shopCap112(){ens112();const L=$('shopList');if(!L)return;
  L.querySelectorAll('.item[data-info^="shop:"]').forEach(row=>{const id=row.dataset.info.slice(5),it=(C.shop||[]).find(z=>z.id===id);if(!it)return;
    const sm=row.querySelector('.wt111');if(!sm)return;sm.querySelector('.cp112')?.remove();const l=lm112(it),u=l?used112(it):0;
    sm.insertAdjacentHTML('beforeend',`<span class="cp112">${l?` · 🧾 ${l.p==='w'?'이번 주':'이번 달'} ${u}/${l.n}${u>=l.n?' (다 찼어요)':''}`:''}${it.lw?` → ${md111(it.lw.from)}부터 ${it.lw.v?(it.lw.v.p==='w'?'주 ':'월 ')+it.lw.v.n+'번':'상한 없음'}`:''} <button type="button" class="linkbtn" data-cp112="${esc(it.id)}">상한 설정</button></span>`)});
  const p=$('wt111p');if(p&&!p.querySelector('.cp112m')){const sm=p.querySelector('summary');if(sm)sm.textContent='⏳ 대기기간 · 🧾 상한 기준 — 비쌀수록 오래 기다리고, 넘기면 한 번 더 물어요';p.insertAdjacentHTML('beforeend',panelM112())}}
renderShop=(function(prev){return function(){const r=prev.apply(this,arguments);try{shopCap112()}catch(e){console.error(e)}return r}})(renderShop);

/* 사기 → 상한 확인. LAST112 = 이번 구매의 물건 id(applyEntry 감싸개가 기록에 e.sid112로 남김) */
var BYP112=0,LAST112=null;
applyEntry=(function(prev){return function(day,e){try{if(e&&e.kind==='buy'&&LAST112){const it=(C.shop||[]).find(z=>z.id===LAST112);if(it&&e.name===it.name+' 구매')e.sid112=it.id}}catch(x){console.error(x)}LAST112=null;return prev.apply(this,arguments)}})(applyEntry);
addEventListener('click',e=>{const T=e.target;if(!T||!T.closest)return;let b;
  if((b=T.closest('[data-buy]'))){LAST112=b.dataset.buy;setTimeout(()=>{LAST112=null},0);if(BYP112||b.disabled)return;
    const it=(C.shop||[]).find(z=>z.id===b.dataset.buy);if(!it)return;const o=over112(it);if(!o.length)return;
    e.preventDefault();e.stopImmediatePropagation();LAST112=null;capSheet112(it,o);return}
  if((b=T.closest('[data-cap112go]'))){e.preventDefault();e.stopPropagation();const id=b.dataset.cap112go;closeSheet();
    let bb=document.querySelector('#shopList [data-buy="'+id+'"]');let tmp=0;if(!bb||bb.disabled){bb=document.createElement('button');bb.dataset.buy=id;bb.hidden=true;document.body.appendChild(bb);tmp=1}
    BYP112=1;try{bb.click()}finally{BYP112=0;if(tmp)bb.remove()}return}
  if((b=T.closest('[data-cp112]'))){e.preventDefault();e.stopPropagation();capItem112(b.dataset.cp112);return}
  if((b=T.closest('[data-cp112s]'))){e.preventDefault();e.stopPropagation();ens112();const it=(C.shop||[]).find(z=>z.id===b.dataset.cp112s);if(!it)return;
    const P=$('cp112P'),N=$('cp112N'),p=P&&P.value,nv=p?{n:Math.max(1,Math.min(99,Math.round(+(N&&N.value))||1)),p}:null,cur=lm112(it);
    if(rate112(nv)<=rate112(cur)){if(nv)it.lm=nv;else delete it.lm;delete it.lw;toast(nv?(cur&&rate112(nv)<rate112(cur)?'상한을 낮췄어요 — 바로 적용돼요':'저장했어요'):'저장했어요')}
    else{it.lw={v:nv,from:addDays(gk76(),1)};toast('상한을 높이거나 없애는 건 내일부터 적용돼요')}
    save('config');closeSheet();render();return}
},true);
addEventListener('change',e=>{const t=e.target;if(!t||!t.matches)return;
  if(t.matches('[data-cpm112]')){e.stopPropagation();ens112();const c=cfgC112(),v=Math.min(1e9,num110(t.value)),cur=c.m;
    if((v>0?v:Infinity)<=(cur>0?cur:Infinity)){c.m=v;delete c.pm;toast(v>0&&cur>0&&v<cur?'상한을 낮췄어요 — 바로 적용돼요':'저장했어요')}
    else{c.pm={v,from:addDays(gk76(),1)};toast('상한을 높이거나 없애는 건 내일부터 적용돼요')}
    t.value=cm110(c.m);save('config');render()}
},true);

F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['🧾 보상함 상한','홈 → 더보기 → 🛍 상점 → 물건 줄의 상한 설정 · 위 ⏳ 대기기간·🧾 상한 기준 칸의 한 달 상한','물건마다 \'주 1번\'·\'월 2번\'처럼, 또는 한 달 전체 쓸 돈 상한을 정해 두면 넘기게 될 때 사기 전에 한 번 더 물어봐요. 점수·골드는 안 깎여요. 주는 월요일부터 세고, 상한을 낮추는 건 바로·높이는 건 다음 날부터 적용돼요.',()=>{location.hash='shop'},'상한 한도 주 월 횟수 보상함 상점 충동구매 확인 한 달'],
])}})(F67);
