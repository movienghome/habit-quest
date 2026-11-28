/* ================= v13.34 (w154): 합쳐서 숨은 카드의 📌 정리 (사용자 11/28 '알아서 합쳐 줘') =================
   ① 📌 빠른 기록(C.pin133)에 합쳐서 숨은 옛 카드(a.mg+a.doneAt) id가 남아 있었음 — 합칠 땐 moveLinks가 바꿨지만,
      다른 기기의 옛 목록이 merge3로 다시 섞여 들어옴('빠른 답장' k87j06c). → normConfig 뒤 숨은 옛 카드 id를 합친 카드 id로 바꾸고 겹침 지움.
   ② 옵션 이름 앞의 합친 카드 이름 빼기·그 이름으로도 같은 이름 짝 찾기는 w151(직접 고침: onm·twinOpt·doMerge). */
(function(){
function pinFix154(c){try{if(!c||!Array.isArray(c.pin133)||!Array.isArray(c.actions))return c;const m={};
  c.actions.forEach(a=>{if(a&&a.mg&&a.doneAt&&a.mg!==a.id)m[a.id]=a.mg});if(!Object.keys(m).length)return c;
  const s=new Set(),o=[];c.pin133.forEach(id=>{const k=m[id]||id;if(s.has(k))return;s.add(k);o.push(k)});
  if(o.length!==c.pin133.length||o.some((x,i)=>x!==c.pin133[i]))c.pin133=o}catch(e){console.error(e)}return c}
window.pinFix154=pinFix154;
{const _nc=normConfig;normConfig=function(){return pinFix154(_nc.apply(this,arguments))}}
})();
