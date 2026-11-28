/* ===== v13.35 (w155): 기록하기 '모두'·'↻ 습관'·'⚔ 용기' 보기에서 숨은 카드가 다시 보이던 것 =====
   원인: flt61(v5r)은 '▲ 좋은'·'▼ 나쁜'·'🍬'만 `!a.doneAt`을 봄 → 거르기가 '모두'이면 합쳐서 숨은 옛 카드(a.mg+a.doneAt)·끝낸 '한 번' 카드가
   기록하기 목록에 그대로 나옴(사용자 11/28 '빠른 답장 등 카드가 여전히 남아 있음 — 공간이 전혀 안 줄었음'). 옛 v5k 원본은 '모두'도 숨긴 카드를 뺐음.
   고침: 어느 보기든 숨긴 카드(doneAt)는 뺌 — 마지막 선언이 이김. 개수 칩(fltBar61)도 같이 맞음. */
function flt61(a,k){
  if(!a||a.doneAt)return false;
  if(k==='good')return a.type==='good'&&!a.dopaOnly;
  if(k==='bad')return a.type==='bad';
  if(k==='dopa')return !!a.dopa;
  if(k==='habit')return isHabit(a);
  if(k==='brave')return !!a.brave;
  return true}
