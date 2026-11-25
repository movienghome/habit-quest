/* v13.8 🍅 뽀모도로 기기 간 동기화 (w136)
   돌고 있는 타이머(PM88)를 설정 문서 최상위 키 C.pomoRun88(JSON 문자열 하나)로도 저장 → 다른 기기가 이어받음.
   - 문자열 하나인 이유: merge3가 객체를 필드별로 섞어 두 기기 값이 뒤섞이는 걸 막고, 둘이 동시에 바꾸면 내 것(마지막 쓴 쪽)이 통째로 남게.
   - 상태가 바뀔 때만 씀(시작·일시정지·재개·끝·그만두기 = pSave88). 타이머는 Date.now() 기준이라 매초 쓰지 않음.
   - 새로 쓴 쪽이 이김: 상태마다 at(쓴 시각)·dev(시작한 기기). 그만두면 {off:1,at}.
   - 알람은 화면이 켜진 기기에서만(숨은 기기는 시작한 기기일 때만 — 기기가 하나뿐이면 예전처럼 울림).
   - 끝 처리(기록·구슬)는 먼저 hold를 쓴 기기 하나만: pComplete88 앞에서 늘 원격 상태부터 받아 옴. */
const DEV136=(()=>{try{let d=localStorage.getItem('hq_dev136');if(!d){d='d'+Math.random().toString(36).slice(2,8);localStorage.setItem('hq_dev136',d)}return d}catch(e){return 'd0'}})();
let SEEN136=null,AT136=(PM88&&PM88.at)||0;
const SAVE136=pSave88,RING136=pRing88;
function push136(){
  const s=JSON.stringify(PM88?Object.assign({},PM88):{off:1,at:AT136,dev:DEV136});
  if(s===SEEN136)return;SEEN136=s;C.pomoRun88=s;save('config')}
pSave88=function(){
  AT136=Date.now();if(PM88){PM88.at=AT136;if(!PM88.dev)PM88.dev=DEV136}
  SAVE136.apply(this,arguments);try{push136()}catch(e){console.error(e)}};
pRing88=function(t,b){
  if(document.visibilityState==='visible'||(PM88&&PM88.dev===DEV136))return RING136(t,b)};
function adopt136(){
  const s=C&&C.pomoRun88;if(typeof s!=='string'||!s||s===SEEN136)return false;
  let r;try{r=JSON.parse(s)}catch(e){SEEN136=s;return false}
  if(!r||typeof r!=='object'){SEEN136=s;return false}
  if((r.at||0)<AT136){ // 이 기기 것이 더 새로움(오프라인에서 바꾼 것 등) → 올림
    SEEN136=null;if(PM88||AT136)try{push136()}catch(e){console.error(e)}return false}
  const prev=PM88;SEEN136=s;AT136=r.at||0;
  if(r.off)PM88=null;else{PM88=r;delete PM88.off}
  PSTOP88=0;SAVE136();
  const fin=!!PM88&&(prev?(PM88.hold&&(prev.hold!==PM88.hold||prev.phase!==PM88.phase||prev.n!==PM88.n)||((PM88.n||0)>(prev.n||0))):!!PM88.hold);
  try{pBtn88();pTitle88();pDraw88();pPop88(fin)}catch(e){console.error(e)}
  if(fin&&document.visibilityState==='visible'){const g=pget88(),w=PM88.phase==='work'||(PM88.n||0)>(prev&&prev.n||0);
    RING136(w?'🍅 '+g.w+'분 끝!':'☕ 쉬는 시간 끝',PM88.kind)}
  return true}
{const _c=pComplete88;pComplete88=function(){adopt136();if(!PM88||PM88.hold)return;return _c.apply(this,arguments)}}
setInterval(adopt136,1000);
addEventListener('visibilitychange',()=>{if(!document.hidden)adopt136()});
