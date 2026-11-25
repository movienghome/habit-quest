/* v13.12 관리를 끝냈는데 다음 차례가 '오늘'로 남는 어긋남 바로잡기 (w139) — 사용자 11/25 저녁 '책상 위 먼지 제거 했는데 오늘로 남아 있어'
   - 실제 데이터(읽기만): 7일마다 관리 둘(책상 위 먼지 제거·수납장 정리)이 끝낸 기록(오늘)·t.last=오늘·cnt+1인데 due만 오늘 그대로(분리배출·방바닥 닦기는 정상). 끝낼 때 due 계산은 시험으로 128가지 상태(밀림·놓음·미리 함·주기 종류)에서 모두 맞아서,
     끝낸 직후 다른 길(옛 값 덮어쓰기·되돌림)이 due만 옛 값으로 돌린 걸로 보임. v13.7b `habLinkSync`가 습관 할 일에만 같은 어긋남을 고쳐 둔 것과 같은 모양.
   - 그래서 원인이 어디든 결과를 바로잡음: 관리(`isCare76`)이고, 오늘 끝낸 기록(e.tid)과 t.last=오늘이 있는데 due가 아직 오늘 이전이면 → '한 날'부터 다음 차례(w76 규칙: n일마다=오늘+n일, 요일·달 반복은 `nextDue`).
   - 일부러 오늘로 둔 것은 건드리지 않음: 이번 차례를 시간표에 놓은 것(`plOn126`). 같은 할 일을 한 세션에 3번 넘게 고치진 않음(`HC139`, 다른 기기와 서로 덮어쓰는 싸움 방지). */
var HC139={};
function heal139(){
  if(typeof ready72!=='function'||!ready72()||typeof tasksReady==='undefined'||!tasksReady||!tOK64())return 0;
  const g=gk76(),td=midKey68(),day=DAYS[g],es=(day&&day.entries)||[];if(!es.length)return 0;
  let n=0;
  Object.values(TASKS).forEach(t=>{
    if(!t||t.status!==0||!isCare76(t)||!t.rep||!t.rep.f||t.rep.f==='x'||!t.due||t.due>td||t.last!==g)return;
    if(!es.some(e=>e.tid===t.id&&e.kind==='task'))return;
    if(typeof plOn126==='function'&&plOn126(t))return;
    if((HC139[t.id]||0)>=3)return;
    let nd=null;
    if(t.rep.f==='d')nd=addDays(td,Math.max(1,+t.rep.i||1));
    else{nd=t.due;let k=0;while(nd&&nd<=td&&k++<60)nd=nextDue(t.rep,nd)}
    if(!nd||nd<=td||(t.rep.until&&nd>t.rep.until))return;
    HC139[t.id]=(HC139[t.id]||0)+1;t.due=nd;saveTask(t);n++});
  return n}
render=(function(prev){return function(){try{heal139()}catch(e){console.error(e)}return prev.apply(this,arguments)}})(render);
