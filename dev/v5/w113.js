/* ---- v11.5 (w113.js): 상점 맨 위 '이번 달 n / 상한원' 한 줄 + 상한 넘겨 산 구매 돌아보기 (F1 ⑤ 아이디어 2개, 사용자 11/21 '둘 다 좋아') ----
   · 한 줄 `#mo112`: 보상 상점 패널의 안내 문장(.help) 바로 아래(= 대기기간 칸·물건 목록 위). 한 달 상한이 있으면 `이번 달 12,000 / 30,000원 · 40%`와 막대,
     상한은 없지만 이번 달 쓴 돈이 있으면 `이번 달 12,000원`만, 둘 다 없으면 안 그림(공간 아낌). 넘으면 `⚠ 넘었어요` 글자 + 줄무늬 막대(색만으로 구분 안 함).
   · 쓴 돈 = `spent112()`(이번 달 kind:'buy' 기록 골드 × C.imp110.won) — 한 달 상한 확인(w112)과 같은 값.
   · 돌아보기: 확인 창에서 '그래도 살게요'로 산 구매의 `e.ov112`('i' 물건별 · 'm' 한 달 · 'im')를 `ovList113()`가 최근 60일 모음 → `<details class="ov112d">`(기본 접힘).
     **기록만 — 점수·골드는 안 바뀜**(사용자 설계: 돈 상태로 점수 안 깎음, 솔직한 기록이 불이익이 되지 않게).
   · 기록 줄(logRow 감쌈): 그런 구매 줄 이름 뒤에 작은 `🧾 상한 넘김`. */
function f113(n){return cm110(n)||'0'}
function ovList113(days){days=days||60;const td=gk76(),from=addDays(td,-(days-1)),out=[];
  Object.keys(DAYS).forEach(k=>{if(k<from||k>td)return;((DAYS[k]&&DAYS[k].entries)||[]).forEach(e=>{if(e&&e.kind==='buy'&&e.ov112)out.push({k,e})})});
  out.sort((a,b)=>a.k<b.k?1:a.k>b.k?-1:0);return out}
function ovWhy113(c){c=String(c||'');return c.includes('i')&&c.includes('m')?'물건 상한·한 달 상한 둘 다':c.includes('m')?'한 달 상한':'물건 상한'}
function mo112html(){const sp=spent112(),m=cfgC112().m,L=ovList113(),td=gk76(),mon=td.slice(0,7),nm=L.filter(x=>x.k.slice(0,7)===mon).length;
  if(!(m>0)&&!(sp>0)&&!L.length)return'';
  const pct=m>0?Math.round(sp/m*100):0,over=m>0&&sp>m,won=cfg110().won;
  const line=m>0?`<b>🧾 이번 달 ${f113(sp)} / ${f113(m)}원</b> <span class="tiny">${pct}%${over?' · ⚠ 넘었어요':''}</span><div class="bar112" aria-hidden="true"><i style="width:${Math.min(100,pct)}%"></i></div>`
    :sp>0?`<b>🧾 이번 달 ${f113(sp)}원</b> <span class="tiny muted">한 달 상한은 아래 ⏳ 칸 맨 아래에서 정할 수 있어요</span>`:'';
  const det=L.length?`<details class="ov112d" id="ov112d"><summary class="tiny">🧾 상한 넘겨 산 구매 · 이번 달 ${nm}번 (최근 60일 ${L.length}번)</summary>
    <ul class="ov112l tiny">${L.slice(0,20).map(x=>`<li><span class="num">${md111(x.k)}</span> ${esc(String(x.e.name||'').replace(/ 구매$/,''))} · ${ovWhy113(x.e.ov112)} 넘김 · ${f113(Math.abs(+x.e.gold||0)*won)}원</li>`).join('')}</ul>
    <p class="tiny muted" style="margin:4px 0 0">돌아보기용 표시예요 — 점수·골드는 그대로였어요. 자주 보이면 상한을 올리거나 대기를 늘려 볼 수 있어요.</p></details>`:'';
  return `<div id="mo112" class="mo112${over?' over':''}" role="status">${line}${det}</div>`}
function shopTop113(){const L=$('shopList');if(!L)return;const pn=L.parentNode,help=pn&&pn.querySelector(':scope > .help');if(!help)return;
  const old=$('mo112'),open=!!(old&&old.querySelector('details')&&old.querySelector('details').open);if(old)old.remove();
  const h=mo112html();if(!h)return;help.insertAdjacentHTML('afterend',h);if(open){const d=$('ov112d');if(d)d.open=true}}
renderShop=(function(prev){return function(){const r=prev.apply(this,arguments);try{shopTop113()}catch(e){console.error(e)}return r}})(renderShop);

/* 기록 줄에 작은 표시 — 이름 칸이 끝나고 점수 칸이 시작하는 곳(`</span><span class="num muted tiny">`)에 끼움. 못 찾으면 안 건드림 */
logRow=(function(prev){return function(date,e){let h=prev.apply(this,arguments);
  try{if(e&&e.kind==='buy'&&e.ov112){const a='</span><span class="num muted tiny">',i=h.indexOf(a);if(i>0)h=h.slice(0,i)+` <span class="tiny muted ov112t" title="${esc(ovWhy113(e.ov112))}을 넘겨서 산 구매예요(점수는 그대로)">🧾 상한 넘김</span>`+h.slice(i)}}catch(x){console.error(x)}
  return h}})(logRow);

F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['🧾 이번 달 쓴 돈·상한 넘긴 구매','홈 → 더보기 → 🛍 상점 → 맨 위 한 줄(이번 달 n / 상한원) · 그 아래 접힘 칸(상한 넘겨 산 구매)','한 달 상한을 정해 두면 상점 맨 위에 이번 달 쓴 돈이 막대와 함께 보여요. 확인 창에서 \'그래도 살게요\'로 산 구매는 기록에 🧾 상한 넘김 표시가 남아 상점 맨 위 접힘 칸에서 최근 60일을 돌아볼 수 있어요. 점수·골드는 그대로예요.',()=>{location.hash='shop'},'상점 이번 달 쓴 돈 상한 넘김 돌아보기 한 달 막대 보상함'],
])}})(F67);
