/* ---- v11.7 (w115.js): 점수 칸 정리 (v11.8: 머리줄 '오늘 상황' 칸 .sit115는 공간을 차지해 뺌 — 상황은 루틴 카드·시작 전에서 고름, w116.js) (사용자 11/22: 상황 고르는 곳이 안 보임 · 점수 칸 정렬·2단 쌓임이 지저분함) ----
   · 루틴 머리줄(오늘 차례) 맨 아래에 한 줄 `.sit115`: [🌿 일반][🚗 출근][🎬 외근] + ⚙ — 한 번 누르면 바로 바뀜(기존 `data-pk114` 클릭 처리 그대로 재사용).
     선택된 칸 = 굵은 테두리 + 진한 바탕 + ` ✓`(색만으로 구분 안 함). ⚙ = 루틴 카드 🧭 상황별을 펴서 엶(상황마다 쉬는 단계 정하기).
   · 예전 목록 루틴 줄 아래 칩 줄(`dn75` 감쌈, w114)은 없앰 — 이쪽이 대신함. 체크 창(`rtDone64`)·루틴 카드 칸은 그대로.
   · 점수 칸(`.trow>.tx`)은 한 줄·오른쪽 정렬(숫자 맞춤). 점수(+n)는 늘 오른쪽 끝에 두고 골드는 그 왼쪽에 둠(줄마다 +n 자리가 같음). 루틴 머리는 두 줄: `💰 Σ+단계합` / `💰 완주 +보너스`(예전엔 폭 때문에 💰와 숫자가 따로 줄바꿈됨). */
taskRow=(function(prev){return function(t,o){let h=prev.apply(this,arguments);try{
  const r=t&&t.status===0&&C.mig62&&rtOfT62(t);
  if(r&&typeof h==='string'){
    const S=rtSum62(r),re=/<span class="tx tx65"[^>]*>[\s\S]*?<\/small><\/span>/;
    if(re.test(h))h=h.replace(re,()=>`<span class="tx tx65 s115" title="단계 점수 합 · 다 하면 완주 보너스"><span class="a115"><span>Σ+${S.xp}</span>${S.gold?`<span class="g">💰${S.gold}</span>`:''}</span><span class="b115"><span>완주 +${+r.xp||0}</span>${+r.gold?`<span class="g">💰${+r.gold}</span>`:''}</span></span>`);
    if(t.due&&t.due<=dateKey())h=h.replace('class="trow ','class="trow rt115 ')}
}catch(e){console.error(e)}return h}})(taskRow);
