/* ---- v10.1 (w100.js): M1 복귀 모아 보기 + 용기 기록 모아 보기 — 돌아보기('📅 이번 주') 화면에 '🌱 다시 일어난 증거' 칸 하나 ----
   읽기만 함(새 저장 키 없음, 점수·HP 안 건드림). 자료 = C.back93={게임날짜:{n,from,e}}(w92, 쉬었다 돌아온 날) · 기록 e.brave / kind==='courage'(용기 기록, 사후 표시 e.bv82).
   ① 복귀: 모두 몇 번 · 이번 주(보고 있는 주) 몇 번 · 평균 며칠 쉬고 돌아왔나 · 마지막 복귀 · 최근 5번(어디서 돌아왔나: 쉼·힘든 날·비운 날).
   ② 용기: 보고 있는 주에 용기 낸 일 목록(날짜·이름·✨, 나중에 붙인 건 🕘) + 지금까지 총 몇 번. 12줄 넘으면 '…외 n번'.
   reviewHTML59를 맨 바깥에서 감싸 '왼쪽 메뉴' 칸 바로 앞에 끼움(그 칸이 없으면 맨 뒤). 색만으로 구분 안 함 — 아이콘·글자. */
const FROM100={rest:'😴 쉼',low:'🪫 힘든 날',gap:'📭 비운 날'};
function brv100(e){return !!(e&&e.type==='good'&&(e.kind==='courage'||e.brave))}
function ev100(ws){const out=[];for(let i=0;i<7;i++){const k=addDays(ws,i),d=DAYS[k];(d&&d.entries||[]).forEach(e=>{if(brv100(e))out.push([k,e])})}
  out.sort((a,b)=>a[0]===b[0]?String(b[1].t||'').localeCompare(String(a[1].t||'')):(a[0]<b[0]?1:-1));return out}
function brvAll100(){let n=0;for(const k in DAYS){const d=DAYS[k];(d&&d.entries||[]).forEach(e=>{if(brv100(e))n++})}return n}
function proof100(){
  const off=ui.rv59||0,td=dateKey(),ws=addDays(weekStart(td),-7*off),we=addDays(ws,6);
  const B=(C.back93&&typeof C.back93==='object')?C.back93:{},ks=Object.keys(B).filter(k=>B[k]).sort();
  const tot=ks.length,wk=ks.filter(k=>k>=ws&&k<=we).length;
  const avg=tot?Math.round(ks.reduce((s,k)=>s+(+B[k].n||1),0)/tot*10)/10:0;
  const lastK=tot?ks[tot-1]:'',last=lastK?B[lastK]:null;
  const rec=ks.slice(-5).reverse().map(k=>{const b=B[k];return `<li class="r100"><span class="num">${esc(fmtD(k))}</span><span>${+b.n>1?b.n+'일 만에':'하루 쉬고'} 돌아옴</span><span class="tiny muted">${FROM100[b.from]||''}</span></li>`}).join('');
  const cmpc=(l,v,sub)=>`<div><span class="tiny muted">${l}</span><b class="num">${v}</b><span class="tiny muted">${sub}</span></div>`;
  const rt=`<div class="cmp59">${cmpc('🌱 돌아온 횟수',tot+'번',`이 주 ${wk}번`)}${cmpc('⏳ 평균',tot?avg+'일':'-',tot?'쉬고 돌아오기까지':'아직 없어요')}${cmpc('🕘 마지막',last?esc(fmtD(lastK)):'-',last?(+last.n>1?last.n+'일 만에':'하루 쉬고'):'')}</div>
    ${rec?`<ul class="l100">${rec}</ul>`:'<p class="small muted" style="margin:6px 0 0">쉬거나 힘든 날 다음 날 첫 걸음을 떼면 여기에 쌓여요. 못 한 날이 있어도 다시 오는 게 기록이 돼요.</p>'}`;
  const ev=ev100(ws),all=brvAll100(),shown=ev.slice(0,12);
  const bl=ev.length?`<ul class="l100">${shown.map(([k,e])=>`<li class="r100"><span class="num">${esc(wdOf(k))} ${esc(fmtD(k))}</span><span>⚔ ${esc(e.name||'용기')}${e.bv82?' <span class="tiny muted" title="끝낸 뒤에 용기로 표시했어요">🕘 나중에 붙임</span>':''}</span><span class="tiny num">${(+e.xp)?'✨'+(+e.xp):''}</span></li>`).join('')}${ev.length>12?`<li class="tiny muted">…외 ${ev.length-12}번</li>`:''}</ul>`
    :'<p class="small muted" style="margin:6px 0 0">이 주에는 용기 기록이 아직 없어요. 할 일 상세의 ⚔️ 칩이나 끝낸 뒤 알림의 ⚔️로 붙일 수 있어요.</p>';
  return `<div class="panel pf100"><div class="ptitle"><h2>🌱 다시 일어난 증거</h2><span class="tiny muted">쌓이기만 하고 줄지 않아요</span></div>${rt}
    <h3 class="h100">⚔ ${off?off===1?'지난주':off+'주 전':'이번 주'} 용기 낸 일 · ${ev.length}번 <span class="tiny muted">(지금까지 ${all}번)</span></h3>${bl}</div>`;
}
reviewHTML59=(function(prev){return function(){const h=prev.apply(this,arguments);
  try{const p=proof100(),m='<div class="panel"><div class="ptitle"><h2>왼쪽 메뉴</h2>',i=h.lastIndexOf(m);return i>=0?h.slice(0,i)+p+h.slice(i):h+p}catch(e){console.error(e);return h}}})(reviewHTML59);
