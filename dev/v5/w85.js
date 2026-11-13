/* ---- v8.5+ (w85.js): B9 묶인 할 일은 머리의 영역을 따라감 ----
   areaOfTask(t) = 따로 정한 영역(t.area) > 태그 영역 > 카드 영역 > (묶인 할 일이면) 머리의 영역.
   루틴 단계(t.rstep)는 루틴 규칙이 따로 있어 건드리지 않음. 머리 사슬은 최대 5단(순환 방지).
   areaOfTask는 function 선언이라 뒤에 선언한 이 함수가 v5a의 것을 덮음(앞 모듈에서 부르는 곳도 같은 이름을 찾음). */
function areaOfTask(t){
  let cur=t,n=0;
  while(cur&&n++<5){
    const a=cur.aid&&C.actions.find(x=>x.id===cur.aid);
    const own=cur.area||tagArea(cur)||(a&&a.area)||null;
    if(own)return own;
    if(cur.rstep||!cur.parent)return null;
    cur=(typeof TASKS!=='undefined')&&TASKS[cur.parent];
  }
  return null;
}
