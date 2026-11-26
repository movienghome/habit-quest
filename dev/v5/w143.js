/* v13.17 (w143): 11/26 밤 2차 — 홈 배치 새로고침 되돌림 · 끝낸 식사 블록 시간표에 남기기
   ① 홈 배치: normConfig가 C.ui.home을 기본 목록(DEFAULT_CONFIG)에 있는 칸으로만 걸러 → 나중에 생긴 칸(🍽 식사 meal141 · 📌 빠른 기록 pin141)의 저장된 자리가 새로고침마다 지워졌음.
      → normConfig 뒤에 원래 저장된 목록에서 HOME_BLOCKS에 있는 칸을 그 자리(앞 칸 바로 뒤)에 다시 끼움.
   ② 끝낸 식사 블록: 식사 완료는 기록(entries)이 아니라 t.status=2·t.doneAt라서 doneBlk77(기록 기준)에 안 잡혀 시간표에서 사라졌음 → 끝낸 끼니도 ✓ 블록으로 */
{const _nc143=normConfig;normConfig=function(raw){const c=_nc143.apply(this,arguments);
  try{const rh=raw&&raw.ui&&Array.isArray(raw.ui.home)?raw.ui.home:null,H=c&&c.ui&&c.ui.home;
    if(rh&&Array.isArray(H)&&typeof HOME_BLOCKS!=='undefined'){
      const ent=x=>{const a=x&&x._na?x._na:x;return Array.isArray(a)?a:null};
      const have=new Set(H.map(h=>h&&h[0]));let prev=null;
      rh.forEach(x=>{const a=ent(x);if(!a||!a[0])return;
        if(have.has(a[0])){prev=a[0];return}
        if(!HOME_BLOCKS[a[0]])return;
        const item=[a[0],a[1]?1:0,a[2]==='R'?'R':'L'],i=prev?H.findIndex(h=>h&&h[0]===prev):-1;
        H.splice(i+1,0,item);have.add(a[0]);prev=a[0]})}}catch(e){console.error(e)}
  return c}}
doneBlk77=(function(prev){return function(k){const out=prev.apply(this,arguments);
  try{const seen=new Set(out.map(o=>o.t.id));
    Object.values(TASKS).forEach(t=>{if(!t||!t.ml80||t.status!==2||seen.has(t.id)||!t.time)return;
      if((t.doneAt||t.due)!==k&&!(!t.doneAt&&t.due===k))return;
      out.push({t:Object.assign({},t,{due:k}),e:{},once:true})})}catch(e){console.error(e)}
  return out}})(doneBlk77);
/* ---------- ③ 관리 창 묶음 머리 한 줄 — 누르면 하위가 펴지고 접힘(세션 동안만 기억) ---------- */
window.BX143=window.BX143||new Set();
function bx143(el){const id=el&&el.dataset.bx143;if(!id)return;const S=window.BX143;if(S.has(id))S.delete(id);else S.add(id);if(typeof window.deck128==='function')window.deck128()}
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-bx143]');if(!b)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();bx143(b)},true);
addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const b=e.target&&e.target.closest&&e.target.closest('[data-bx143]');if(!b||e.target!==b)return;e.preventDefault();bx143(b)},true);
