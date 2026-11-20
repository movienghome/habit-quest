/* ---- v11.0 (w109.js): 11/20 캘린더·홈 묶음 — 일정 보기 끝낸 줄 · 홈 2단 굳음 방지 (+ w80.js 직접: 🥐 아침·🍪 간식 칸) ----
   N16 캘린더 끝낸 일 불투명: 1일·3일·주·월은 이미 목록 색·✓·취소선(v7.7·v8.4·v8.5). 빠져 있던 곳 = '일정'(목록) 보기의 오늘 끝낸 줄 —
       목록 이름·색이 없어 어떤 목록을 했는지 안 보였음 → 열린 줄처럼 목록 이름(+색 띠)·✓ 시각을 붙이고 누르면 할 일이 열림.
   N17 홈 2단이 때때로 1단: 700px 경계에서 스크롤바·여백이 폭을 조금만 줄여도 되돌아오지 않고 굳음 → 한번 2단이면 680px 밑으로 내려갈 때만 1단(되돌아올 땐 700px).
       (PC 헤드리스 폭에선 재현 안 됨 — 방어만. 어느 기기·폭에서 보였는지 사용자 확인 대기)
   N18 아침·간식 칸 = w80.js 직접(SL80·slOn80·ml80cfg·mealSheet80 ⚙) — 기본 꺼짐. */

// ---- N16: 일정 보기 오늘 끝낸 줄에 목록 이름·색 ----
function agendaDone109(){
  const p=$('calMain');if(!p||!calShown()||((C.ui.cal||{}).mode)!=='agenda')return;
  const rows=[...p.querySelectorAll('.agenda .trow.done')];if(!rows.length)return;
  const q=CAL77;CAL77=1;let es=[];try{es=doneOn(midKey68())}finally{CAL77=q}
  if(es.length!==rows.length)return;                       // 줄 수가 안 맞으면(그리는 쪽이 바뀌었으면) 건드리지 않음
  rows.forEach((r,i)=>{const e=es[i],t=e&&TASKS[e.tid];if(!t||r.classList.contains('d109'))return;
    const l=lcOf70(t),nm=listName(listOk(t.list)?t.list:'inbox');
    r.classList.add('d109');r.dataset.ctask=t.id;
    if(l){r.style.setProperty('--lc70',l.color);r.style.borderLeft='4px solid '+l.color;r.style.background='color-mix(in srgb,'+l.color+' 10%,var(--panel))'}
    const tb=r.querySelector('.tb');
    if(tb&&!tb.querySelector('.tm'))tb.insertAdjacentHTML('beforeend','<span class="tm"><span>'+esc(nm)+'</span><span>✓ '+(e.t?esc(e.t):'끝냄')+'</span></span>')})}
renderCal=(function(prev){return function(){const r=prev.apply(this,arguments);try{agendaDone109()}catch(e){console.error(e)}return r}})(renderCal);

// ---- N17: 홈 2단 — 경계(700px)에서 되돌아오지 않고 굳는 것 막기(히스테리시스) ----
var TL109=680;                                           // 2단이던 홈은 이 폭 밑으로 내려갈 때만 1단
function want109(w,was){return was?w>=TL109:w>=TW77}
function homeTwo(){const g=$('homeGrid');if(!g)return false;
  if(!RO77&&typeof ResizeObserver!=='undefined'){RO77=new ResizeObserver(es=>{try{const w=Math.round(es[es.length-1].contentRect.width);if(!w)return;HW77=w;
      const was=g.classList.contains('two');
      if(want109(w,was)!==was&&curView()==='home'){applyHome();if(ui.homeEdit)applyHomeEdit()}}catch(e){console.error(e)}});RO77.observe(g)}
  const was=g.classList.contains('two');
  if(HW77)return want109(HW77,was);
  const w=innerWidth>=960?Math.min(innerWidth,1340)-228:innerWidth-28;return want109(Math.min(w,1072),was)}
F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['🥐 아침·🍪 간식 칸','식단표 ⚙ (캘린더 줄 🍱 · 폰은 ⋯ 설정)','식단표 ⚙에서 🥐 아침·🍪 간식을 켜면 시간표(캘린더·내일 짜기)에 블록이 7일치 생겨요. 시간·길이·메뉴는 점심·저녁과 같고 점수 없음, 끄면 안 한 블록은 지워져요',()=>{mealSheet80(midKey68(),1)},'아침 간식 식단표 식사 블록 시간표 내일 짜기']])}})(F67);
