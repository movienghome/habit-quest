/* v13.10 🍅 시간표 블록(날짜 창)에도 🍅 시작 (w138) — 사용자 11/25 저녁 '둘 다 좋아'
   - ① `daySheet120`(시간표의 시나리오 쓰기 같은 주 N회 블록을 누르면 뜨는 '📌 이름 · 날짜' 창)에 `🍅 25분 시작`(`data-pm137` — w137 `go137`).
   - '25분 채우면 주 N회 횟수에 자동으로 한 번'은 v10.7 `pLink106`(w106)이 이미 함 — 종류 이름에 맞는 반복 할 일(주 N회 먼저)을 하루 한 번 '오늘 한 걸로' 기록하고 알림 되돌리기. 그래서 새로 만들지 않음(꺼짐 `C.pomo88.link106===0`, 종류별 고정 `k.tid106`). */
daySheet120=(function(prev){return function(id,k){const r=prev.apply(this,arguments);
  try{const t=TASKS[id],sc=$('sheetC');if(t&&t.status===0&&sc&&!sc.querySelector('[data-pm137]')){const o=sc.querySelector('[data-d120="open"]');
    if(o)o.insertAdjacentHTML('beforebegin',`<button type="button" class="btn go" data-pm137="${esc(id)}" title="지금 이 할 일로 뽀모도로를 시작해요(오늘 기록으로 들어가요)">🍅 ${pget88().w}분 시작</button>`)}}catch(e){console.error(e)}
  return r}})(daySheet120);
F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['🍅 시간표 블록에서 바로 시작','캘린더 시간표의 시나리오 쓰기 같은 주 N회 블록 → 창 `🍅 25분 시작`','블록을 눌러 뜨는 날짜 창에서 바로 뽀모도로를 시작해요. 25분을 채우면 그 이름의 주 N회 할 일이 오늘 한 번 셈에 들어가요(하루 한 번만, 알림 되돌리기로 뺄 수 있어요)',()=>{location.hash='calendar'},'뽀모도로 주 N회 횟수 자동 시나리오 쓰기 25분 채우면']])}})(F67);
