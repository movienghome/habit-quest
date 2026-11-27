/* ================= v13.26 (w147): 11/27 저녁 사용자 요청 묶음 =================
   ① 방치 경보: 묶음 머리(예: 집 청소)는 껍데기 — 그 아래 관리 할 일을 하나라도 한 날이면 머리도 한 걸로 셈(HP 방치 벌점·경보판·⚠ 모두 watchTarget 한 길)
   ② 빠른 기록 묶기에 '좋음·나쁨 × 영역별' 합친 모드(C.pg144='both')
   ③ 카드 ℹ 창 📊 기록(달력·월 넘기기·통계)  ④ 🛟 사라진 것 찾기(카드·뽀모도로)
   모두 읽기 위주 — 점수 규칙은 안 바꿈. */
(function(){
/* ---------- ① 묶음 머리 방치 ---------- */
function desc147(id){const out=[],seen=new Set([id]),q=[id];
  while(q.length){const p=q.shift();Object.values(TASKS).forEach(k=>{if(k&&k.parent===p&&k.status!==-1&&!seen.has(k.id)){seen.add(k.id);out.push(k.id);q.push(k.id)}})}
  return out}
watchTarget=(function(prev){return function(id){const w=prev.apply(this,arguments);
  if(!w||typeof id!=='string'||id.slice(0,3)!=='@t:')return w;
  const ids=desc147(id.slice(3));if(!ids.length)return w;
  const d0=w.done;return Object.assign({},w,{done:day=>!!d0(day)||ids.some(k=>tDone60(k,day))})}})(watchTarget);
window.desc147=desc147;
})();
