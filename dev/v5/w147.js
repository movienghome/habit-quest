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

/* ================= ② HP 규칙 B(사용자 11/27 '추천대로 B') — 방치 경보 하루 상한 + 누적 배수 상한 낮추기 =================
   · 방치 경보: 하루에 깎는 합이 `C.nlcap147`(기본 20)을 넘으면 큰 것부터 채우고 나머지는 0(경보판·⚠ 표시는 그대로 — 점수만 줄임).
   · 누적 배수: 새로 기록하는 나쁜 행동의 배수 최대를 `C.mcap147`(기본 2)로(설정의 penalty.max가 더 낮으면 그대로). 이미 기록된 건 안 바뀜.
   · 새 규칙은 `C.f3from147`(처음 켜진 게임 날)부터 — 지난 날 HP는 옛 규칙 그대로. 계산식·설명은 HP 설명 창에 `how147`로 표시. */
(function(){
const on=date=>!!C.f3from147&&String(date)>=C.f3from147;
const nlCap=()=>Math.max(1,+C.nlcap147||20),mCap=()=>Math.max(1,+C.mcap147||2);
function init(){if(!ready72()||!C||C.f3from147)return;C.f3from147=gk76();save('config')}
render=(function(prev){return function(){const r=prev.apply(this,arguments);try{init()}catch(e){console.error(e)}return r}})(render);
neglectList=(function(prev){return function(date){const L=prev.apply(this,arguments);
  L.forEach(n=>{n.raw147=n.pen});
  if(!on(date))return L;
  let left=nlCap();[...L].sort((a,b)=>b.pen-a.pen).forEach(n=>{const u=Math.min(n.pen,left);n.pen=u;left-=u});
  return L}})(neglectList);
badMult=(function(prev){return function(a,date){const r=prev.apply(this,arguments);
  if(r&&on(date||curDay().date)&&r.mult>mCap())r.mult=mCap();return r}})(badMult);
window.how147=function(){const d=curDay(),k=d.date,P=C.penalty||{};
  let raw=0,app=0,items=0;try{neglectList(k).forEach(n=>{raw+=n.raw147!=null?n.raw147:n.pen;app+=n.pen;items++})}catch(e){}
  const mx=Math.min(+P.max||3,on(k)?mCap():99);
  const isOn=on(k);
  const row=(h,t)=>`<div><b>${h}</b><span>${t}</span></div>`;
  return `<div class="how146 how147"><p class="h146">점수 상한 · 누적 데미지${isOn?'':' (이 날은 옛 규칙)'}</p>`
   +row('🛡 방치 하루 상한',isOn?`방치 경보가 여러 개여도 하루에 최대 <b class="num">−${nlCap()}</b>까지만 깎아요(큰 것부터). 오늘 방치 ${items}건 <b class="num">${raw?'−'+raw:'0'}</b>${raw>app?` → 상한 적용 <b class="num">−${app}</b>`:' (상한 안쪽)'}. 경보 표시(⚠)는 그대로예요.`:`상한 없음 — 경보 점수를 전부 더했어요(오늘 <b class="num">−${raw}</b>).`)
   +row('🔥 누적 데미지',`나쁜 행동은 같은 행동을 <b>7일 안에 한 번 더 할 때마다 +${(+P.same||0)}배</b>, <b>어제까지 나쁜 날이 이어진 날마다 +${(+P.chain||0)}배</b>가 붙어요. 최대 <b class="num">×${mx}</b>${isOn?` (전에는 ×${+P.max||3})`:''}. 예) 기본 −12 행동이 ×${mx}이면 <b class="num">−${Math.round(12*mx)}</b>까지.`)
   +row('📅 적용 시점',C.f3from147?`${esc(fmtD(C.f3from147))}부터 새로 기록하는 나쁜 행동·그날 이후의 방치에 적용 — 이미 기록한 점수와 지난 날 HP는 안 바뀌어요.`:'곧 켜져요.')
   +row('✅ 좋은 행동',`누적 배수가 없어요. +점수 그대로 쌓여요.`)
   +`</div>`}
infoFor=(function(prev){return function(k){const r=prev.apply(this,arguments);
  try{if(r&&k==='hp'&&typeof r.b==='string'&&r.b.indexOf('how147')<0){
    r.b=r.b.replace(/(<div class="how146">[\s\S]*?<\/div><\/div>)/,'$1'+window.how147())}}catch(e){console.error(e)}
  return r}})(infoFor);
})();
