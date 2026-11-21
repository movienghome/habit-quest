/* ---- v11.3 (w111.js): 루틴 바로 넘기기 · 폭식/폭음 상태 · 금액 콤마 · 보상함 대기기간 ----
   · 루틴: 단계 일부만 체크해도 GR73(예전 20분)만큼 기다리지 않고 바로 '오늘 한 걸로' 넘김. 1.5초는 completeTask 안의 render가
     알림('남은 단계' 되돌리기)을 건너뛰지 않게 하는 최소한(w73 rtPart73 주석 참고). 알림의 '남은 단계'로 이어서 할 수 있음.
   · 🍬 지금 어때?: 'binge'(🍽 폭식·폭음하고 싶어요) 상태를 'urge'(폰·쇼츠) 바로 뒤에. 충동 적기 창의 '대신할 것 보기'가 🍰는 이쪽으로 감.
   · 금액 입력: `input[data-cm111]`은 치는 대로 3자리마다 콤마(캐럿 유지). 값을 읽을 땐 num110(v)로(콤마 떼기).
   · 보상함 대기기간: 상점 물건마다 '보상함에 넣은 날(it.at)부터 n일 뒤'에 살 수 있음. n = 가격(골드×C.imp110.won원) 구간 기본값
     `C.wt111.d`=[1만 미만, 3만 미만, 10만 미만, 그 이상] 일수(기본 0·1·3·7) → 물건마다 직접 `it.wd` / 꼭 필요 `it.nd`(1일 이하).
     **변경 규칙(F1 ⑤ 설계)**: 대기를 늘리는 건 바로, 줄이는 건 다음 날부터(`it.wp`·`C.wt111.pd`) — 충동의 순간에 안전장치를 못 풂.
     처음 한 번(`C.mig111`) 이미 있던 물건은 대기 없이(it.at='2000-01-01'), 새로 생긴 물건은 처음 보인 날부터 셈. 대기 중엔 '사기' 단추가 ⏳ n일 뒤로 막힘. */
GR73=1500;

(function(){try{if(!DSTATE.some(x=>x[0]==='binge')){const i=DSTATE.findIndex(x=>x[0]==='urge');
  DSTATE.splice(i<0?DSTATE.length:i+1,0,['binge','🍽 폭식·폭음하고 싶어요','먼저 든든하게·물 · 20분 넘기고 · 그래도면 양을 정하고',['app','rest','side'],
    '폭식·폭음은 배고픔·피곤·스트레스가 겹칠 때 가장 세져요. 먼저 든든한 것이나 물을 먹고, 손과 몸을 다른 데 쓰면서 20분만 넘겨요. 그래도 먹겠다면 양과 끝 시간을 정하고 먹어요.',
    a=>/물 한 컵|차 한 잔|양치|샤워|산책|한 바퀴|세수|스트레칭|따뜻한|눕/.test(a.name||'')?.3:0])}}catch(e){console.error(e)}})();

/* ---- 금액 콤마 ---- */
function cmFmt111(el){const raw=el.value,pos=el.selectionStart==null?raw.length:el.selectionStart;
  const before=raw.slice(0,pos).replace(/\D/g,'').length,d=raw.replace(/\D/g,'').slice(0,10),v=d?(+d).toLocaleString('ko-KR'):'';
  if(v===raw)return;el.value=v;let n=0,i=0;for(;i<v.length&&n<before;i++)if(/\d/.test(v[i]))n++;try{el.setSelectionRange(i,i)}catch(e){}}
addEventListener('input',e=>{const t=e.target;if(t&&t.matches&&t.matches('input[data-cm111]')&&!e.isComposing)cmFmt111(t)},true);

/* ---- 보상함 대기기간 ---- */
var WTH111=[10000,30000,100000],WTL111=['1만 원 미만','1만~3만 원 미만','3만~10만 원 미만','10만 원 이상'];
function wcfg111(){const w=C.wt111=C.wt111&&typeof C.wt111==='object'?C.wt111:{};
  if(!Array.isArray(w.d)||w.d.length!==4)w.d=[0,1,3,7];w.d=w.d.map(v=>Math.max(0,Math.min(60,Math.round(+v)||0)));if(!w.pd||typeof w.pd!=='object')w.pd={};return w}
function dd111(a,b){return Math.round((new Date(b+'T12:00:00')-new Date(a+'T12:00:00'))/864e5)}
function md111(k){return k.slice(5).replace('-','/')}
function tier111(it){const w=(+it.price||0)*cfg110().won;return w<WTH111[0]?0:w<WTH111[1]?1:w<WTH111[2]?2:3}
function itemDays111(it,o){o=o||it;const base=o.wd!=null?+o.wd:wcfg111().d[tier111(it)];return o.nd?Math.min(base,1):base}
function readyOn111(it){return addDays(it.at||'2000-01-01',itemDays111(it))}
function left111(it){if(!(it&&it.price>0))return 0;return Math.max(0,dd111(gk76(),readyOn111(it)))}
function ensure111(){if(!ready||!Array.isArray(C.shop))return;let ch=0;const td=gk76();
  if(!C.mig111){C.mig111=1;C.shop.forEach(it=>{if(it&&!it.at)it.at='2000-01-01'});ch=1}
  C.shop.forEach(it=>{if(!it)return;if(!it.at){it.at=td;ch=1}
    if(it.wp&&td>=it.wp.from){if(it.wp.wd==null)delete it.wd;else it.wd=it.wp.wd;if(it.wp.nd)it.nd=1;else delete it.nd;delete it.wp;ch=1}});
  const w=C.wt111;if(w&&w.pd)Object.keys(w.pd).forEach(i=>{const p=w.pd[i];if(p&&td>=p.from){wcfg111().d[i]=p.v;delete w.pd[i];ch=1}});
  if(ch)save('config')}
function panel111(){const w=wcfg111(),c=cfg110();
  return `<details id="wt111p" class="wt111p"><summary class="small">⏳ 대기기간 기준 — 비쌀수록 오래 기다려요</summary>
    <div class="kv" style="margin-top:6px">${WTL111.map((l,i)=>`<label>${l}(일)<input type="number" min="0" max="60" data-wt111d="${i}" value="${w.d[i]}">${w.pd[i]?`<small class="muted"> → ${w.pd[i].v}일 (${md111(w.pd[i].from)}부터)</small>`:''}</label>`).join('')}</div>
    <label class="tiny" style="display:block;margin-top:6px">이번 달 쓸 수 있는 돈(원, 선택) — 적으면 물건마다 그 몇 %인지 보여요<input type="text" inputmode="numeric" data-cm111="1" data-wtb111="1" value="${cm110(c.budget)}"></label>
    <p class="tiny muted" style="margin:6px 0 0">기다리는 날은 보상함에 넣은 날부터 세요. 대기를 <b>늘리는 건 바로</b>, <b>줄이는 건 다음 날부터</b> 적용돼요 — 충동이 올 때 안전장치를 풀지 못하게요. 골드 1G = ${cm110(c.won)}원으로 계산해요(🍰 충동 적기 창 ⚙에서 바꿔요).</p></details>`}
function shopWait111(){ensure111();const L=$('shopList');if(!L)return;const c=cfg110();
  L.querySelectorAll('.item[data-info^="shop:"]').forEach(row=>{const id=row.dataset.info.slice(5),it=(C.shop||[]).find(z=>z.id===id);if(!it)return;
    const n=left111(it),d=itemDays111(it),b=row.querySelector('[data-buy]'),nm=row.querySelector('span');
    if(n>0&&b){b.disabled=true;b.textContent='⏳ '+n+'일 뒤';b.title=md111(readyOn111(it))+'부터 살 수 있어요'}
    if(nm){nm.querySelector('.wt111')?.remove();const pct=c.budget>0?` · 이번 달 쓸 돈의 ${Math.round(it.price*c.won/c.budget*100)}%`:'';
      nm.insertAdjacentHTML('beforeend',`<small class="wt111 tiny muted" style="display:block">${n>0?`⏳ ${d}일 대기 · ${md111(readyOn111(it))}부터`:d>0?`✓ ${d}일 대기 끝`:'바로 살 수 있어요'}${it.nd?' · 꼭 필요':''}${pct} <button type="button" class="linkbtn" data-wt111="${esc(it.id)}">대기 설정</button></small>`)}});
  const old=$('wt111p');if(old&&old.contains(document.activeElement))return;
  const o=old&&old.open;if(old)old.remove();L.insertAdjacentHTML('beforebegin',panel111());if(o)$('wt111p').open=true}
renderShop=(function(prev){return function(){const r=prev.apply(this,arguments);try{shopWait111()}catch(e){console.error(e)}return r}})(renderShop);
function itemSheet111(id){const it=(C.shop||[]).find(z=>z.id===id);if(!it)return;const base=wcfg111().d[tier111(it)],c=cfg110();
  sheetCtx={wt111:id};
  openSheet(`<div class="sh"><h3>⏳ ${esc(it.name)} 대기</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <p class="tiny" style="margin:0 0 6px">${it.price>0?`${it.price}G ≈ ${cm110(it.price*c.won)}원 · 가격 기준 ${base}일`:'가격을 정하면 기준 대기가 정해져요'} · 보상함에 넣은 날 ${it.at&&it.at>'2001'?md111(it.at):'(처음부터 있던 것)'}${it.wp?` · <b>${md111(it.wp.from)}부터 ${it.wp.nd?'꼭 필요':''} ${it.wp.wd==null?'기준대로':it.wp.wd+'일'}로 바뀔 예정</b>`:''}</p>
    <label class="tiny" style="display:block">직접 정할 대기(일) — 비우면 가격 기준대로<input type="number" id="wt111D" min="0" max="60" value="${it.wd!=null?it.wd:''}"></label>
    <label class="tiny" style="display:flex;gap:6px;align-items:center;margin-top:6px"><input type="checkbox" id="wt111N" ${it.nd?'checked':''}> 꼭 필요한 것이에요 (대기가 1일 이하로 줄어요)</label>
    <p class="tiny muted" style="margin:6px 0">대기를 늘리면 바로, 줄이면 다음 날부터 바뀌어요.</p>
    <div class="row" style="gap:6px"><button type="button" class="btn" data-wt111s="${esc(it.id)}">저장</button><button type="button" class="btn ghost" data-sheet="close">닫기</button></div>`)}
addEventListener('click',e=>{const T=e.target;if(!T||!T.closest)return;let b;
  if((b=T.closest('[data-buy]'))){const it=(C.shop||[]).find(z=>z.id===b.dataset.buy),n=left111(it);if(n>0){e.preventDefault();e.stopImmediatePropagation();toast(`⏳ ${n}일 더 기다려요 (${md111(readyOn111(it))}부터) — 갖고 싶은 마음이 그대로면 그때 사요`);return}}
  if((b=T.closest('[data-wt111]'))){e.preventDefault();e.stopPropagation();itemSheet111(b.dataset.wt111);return}
  if((b=T.closest('[data-wt111s]'))){e.preventDefault();e.stopPropagation();const it=(C.shop||[]).find(z=>z.id===b.dataset.wt111s);if(!it)return;
    const D=$('wt111D'),N=$('wt111N'),raw=D&&D.value.trim(),nw={wd:raw===''?null:Math.max(0,Math.min(60,Math.round(+raw)||0)),nd:!!(N&&N.checked)};
    const cur=itemDays111(it),nx=itemDays111(it,{wd:nw.wd,nd:nw.nd});
    if(nx>=cur){if(nw.wd==null)delete it.wd;else it.wd=nw.wd;if(nw.nd)it.nd=1;else delete it.nd;delete it.wp;toast(nx>cur?'대기를 늘렸어요 — 바로 적용돼요':'저장했어요')}
    else{it.wp={wd:nw.wd,nd:nw.nd,from:addDays(gk76(),1)};toast('대기를 줄이는 건 내일부터 적용돼요')}
    save('config');closeSheet();render();return}
},true);
addEventListener('change',e=>{const t=e.target;if(!t||!t.matches)return;
  if(t.matches('[data-wt111d]')){e.stopPropagation();const w=wcfg111(),i=+t.dataset.wt111d,v=Math.max(0,Math.min(60,Math.round(+t.value)||0));
    if(v>=w.d[i]){const up=v>w.d[i];w.d[i]=v;delete w.pd[i];toast(up?'대기를 늘렸어요 — 바로 적용돼요':'저장했어요')}else{w.pd[i]={v,from:addDays(gk76(),1)};toast('대기를 줄이는 건 내일부터 적용돼요')}
    save('config');t.value=w.d[i];render();return}
  if(t.matches('[data-wtb111]')){e.stopPropagation();C.imp110=C.imp110||{};C.imp110.budget=Math.min(1e9,num110(t.value));t.value=cm110(C.imp110.budget);save('config');toast('저장했어요');render()}
},true);

F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['⏳ 보상함 대기기간','홈 → 더보기 → 🛍 상점 → 위 ⏳ 대기기간 기준 · 물건 줄의 대기 설정','보상함에 넣은 날부터 가격에 따라 n일 기다려야 살 수 있어요(기본 1만 미만 당일·3만 미만 1일·10만 미만 3일·그 이상 7일). 물건마다 직접 정하거나 꼭 필요로 줄일 수 있고, 대기를 늘리는 건 바로·줄이는 건 다음 날부터예요.',()=>{location.hash='shop'},'대기 기간 보상함 상점 충동구매 기다리기 물건'],
])}})(F67);
