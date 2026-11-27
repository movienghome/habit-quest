/* ---- v10.8 (w107.js): N20 — 홈 전투 카드에 마음 막대가 없던 것 ----
   원인: 영역 종류 C.ak101(w101)에 '마음'이 💰 경제(m)로 저장돼 있었음 → 홈 막대는 🔋 컨디션 영역만 그려서 마음이 칩(마음 Lv5)으로만 보였음.
   (처음 켜질 때의 이름 짐작이나 종류 칩을 잘못 눌러서 생긴 것으로 보임 — 어느 쪽인지는 데이터를 못 봐서 모름)
   고침: 한 번(C.mig107)만, 이름이 정확히 몸·마음·생활인 영역이 🔋가 아니면 🔋로 되돌림(F1 결정: 몸·마음·생활 = 컨디션).
   이후 사용자가 종류 칩으로 다시 바꾸면 그대로 둠(한 번짜리). 영역 이름·카드·점수·순서는 안 건드림. */
function mig107(){
  if(C.mig107||!ready72()||!C||!C.f1from101||!Array.isArray(C.areas))return;
  const fix=[];
  C.ak101=Object.assign({},C.ak101||{});
  C.areas.forEach(a=>{const k=C.ak101[a.id];
    if(/^(몸|마음)$/.test(String(a.name||'').trim())&&k&&k!=='c'){C.ak101[a.id]='c';fix.push(a.name)}});
  C.mig107={at:gk76(),fix};
  save('config');
  if(fix.length)setTimeout(()=>toast(`${fix.join('·')} 막대를 홈에 되살렸어요 (영역 종류가 🔋 컨디션이 아니었어요) · 편집 → 컨디션 영역에서 바꿀 수 있어요`,7000),1800)}
render=(function(prev){return function(){try{mig107()}catch(e){console.error(e)}return prev.apply(this,arguments)}})(render);
