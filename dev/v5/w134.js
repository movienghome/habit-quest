/* ---- v13.6 (w134.js): 루틴 단계 끌어서 순서 바꾸기 (사용자 11/25: "편집 - 루틴 화면에서 단계 드래그로 끌어서 순서 바꾸는 것도 해줘") ----
   · 루틴 카드(rtCard61/62 맨 바깥 감쌈 `drag134`)의 단계 줄(.st62) 맨 앞에 ⠿ 손잡이(.dg134)를 붙임. 손잡이만 끌림(touch-action:none) → 폰에서 스크롤과 안 부딪힘.
     끌면 놓을 자리(손가락 아래 줄)에 선이 뜨고, 놓으면 `move134`. 키보드는 손잡이에 포커스 + ↑↓. 손잡이를 누르다 카드가 다시 그려지지 않게 click은 삼킴.
   · 저장 위치: 프리셋이 둘 이상이면 **편집 중인 프리셋의 순서 `p.s`**(체크된 줄만 끌림 — 안 하는 단계 줄은 손잡이 없음) · 하나뿐이면 단계 풀 `r.steps` 순서 + 그 하나뿐인 프리셋 `p.s`도 같은 순서로.
     (⚠ 옛 ↑↓는 하나뿐일 때 `r.steps`만 바꿔서 화면만 바뀌고 실제 실행 순서 `effSteps117`(=p.s)은 그대로였음 → 옛 ↑↓ 클릭 뒤에도 p.s를 맞춤 `sync134`.)
   · ↑↓ 단추는 손잡이가 있는 카드에서 숨김(공간 — 줄 맨 앞 ⠿ + 키보드 ↑↓로 대신). DOM엔 남아 있어 옛 시험·코드는 그대로 `.click()` 됨.
   · '단계 편집' 안내 글의 `↑↓=이 프리셋 순서`를 `⠿ 끌기=이 프리셋 순서`로.
   · 시간표 블록 커서: 마우스에서 ✋→화살표+올리면 테두리, 길이 손잡이(.rz) 작은 블록에서 1/3 이하·올리면 표시, 길이 바꾸는 중엔 ↕ 유지(`body.rs134`, v134.css 아래쪽). 시험 t141·t142. */

var DG134=null;
function sid134(row,r){
  const ck=row.querySelector('[data-pcs117]');
  if(ck){const x=ck.dataset.pcs117.split('|');return {pid:x[1],sid:x[2]}}
  const m=row.querySelector('[data-r62min]');
  if(m){const i=+m.dataset.r62min.split(':')[1],s=(r.steps||[])[i];return s?{pid:'',sid:s.id}:null}
  return null}
function rows134(w){return w?[...w.querySelectorAll(':scope > .st62')].filter(x=>x.querySelector(':scope > .dg134')):[]}
function clr134(w){rows134(w).forEach(x=>x.classList.remove('dgb134','dga134','dgs134'))}

/* ---- 카드에 손잡이 붙이기 ---- */
function drag134(h,r){
  try{
    if(typeof h!=='string'||!r||h.indexOf('st62s')<0||h.indexOf('dg134')>=0)return h;
    const L=ensure117(r),t=document.createElement('template');t.innerHTML=h;const root=t.content;let any=false;
    root.querySelectorAll('.st62s').forEach(w=>{
      const rows=[...w.children].filter(c=>c.classList&&c.classList.contains('st62')&&!c.classList.contains('off124'));
      if(rows.length<2||!rows.every(x=>x.querySelector('[data-r62min],[data-pmin118]')))return;   // 편집 줄(분 칸 있는 것)만 — 읽기 전용 목록은 제외
      const ids=rows.map(x=>sid134(x,r));if(ids.some(x=>!x))return;
      if(L.length>1&&ids.some(x=>!x.pid))return;          // 프리셋 둘 이상인데 옛 모양 그대로면(steps124가 못 이은 경우) 건드리지 않음
      rows.forEach(row=>{const b=document.createElement('button');b.type='button';b.className='dg134';b.textContent='⠿';b.dataset.dg134=r.id;
        b.setAttribute('aria-label','순서 바꾸기 (끌거나 ↑↓ 키)');b.title='끌어서 순서 바꾸기';row.insertBefore(b,row.firstChild)});
      w.classList.add('dgon134');any=true});
    if(!any)return h;
    root.querySelectorAll('.ph124 > span').forEach(s=>{if(/↑↓=이 프리셋 순서/.test(s.textContent))s.textContent=s.textContent.replace('↑↓=이 프리셋 순서','⠿ 끌기=이 프리셋 순서')});
    return t.innerHTML
  }catch(e){console.error(e)}return h}
rtCard62=(function(prev){return function(r){return drag134(prev.apply(this,arguments),r)}})(rtCard62);
rtCard61=(function(prev){return function(r){return drag134(prev.apply(this,arguments),r)}})(rtCard61);

/* ---- 순서 바꾸기 ---- */
function move134(rid,w,from,to){
  const r=rOf124(rid);if(!r||!w||from===to)return false;
  const rows=rows134(w),ids=rows.map(x=>sid134(x,r));
  if(from<0||to<0||from>=rows.length||to>=rows.length||ids.some(x=>!x))return false;
  const order=ids.map(x=>x.sid),it=order.splice(from,1)[0];order.splice(to,0,it);
  const L=ensure117(r);
  if(L.length>1){
    const p=L.find(z=>z.id===ids[0].pid);if(!p||!Array.isArray(p.s))return false;
    const live=new Set(order);let k=0;p.s=p.s.map(id=>live.has(id)?order[k++]:id)}      // 체크된 단계 자리에 새 순서를 차례로(없는 단계 id는 제자리)
  else{
    const by={};(r.steps||[]).forEach(s=>{by[s.id]=s});
    const rest=(r.steps||[]).filter(s=>order.indexOf(s.id)<0),next=order.map(id=>by[id]).filter(Boolean).concat(rest);
    r.steps.splice(0,r.steps.length,...next);sync134(r)}
  save('config');redraw117(r);render();return true}
/* 프리셋이 하나뿐이면 그 프리셋의 순서도 단계 풀 순서와 같게(실제 실행 순서는 p.s) */
function sync134(r){const L=ensure117(r);if(!r||L.length!==1)return;const p=L[0];if(!p||!Array.isArray(p.s))return;
  const pos=(r.steps||[]).map(s=>s.id),known=pos.filter(id=>p.s.indexOf(id)>=0),left=p.s.filter(id=>pos.indexOf(id)<0);p.s=known.concat(left)}
addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('[data-r62op^="up:"],[data-r62op^="dn:"]');if(!b)return;
  const r=rOf124(b.dataset.r62op.split(':')[1]);if(!r||ensure117(r).length!==1)return;
  setTimeout(()=>{try{sync134(r);save('config');render()}catch(x){console.error(x)}},0)},true);   // v5s 쪽 처리(r.steps 맞바꿈)가 끝난 뒤

/* ---- 끌기 ---- */
function scr134(el){for(let n=el;n&&n!==document.body;n=n.parentElement){const o=getComputedStyle(n).overflowY;if((o==='auto'||o==='scroll')&&n.scrollHeight>n.clientHeight+2)return n}return null}
addEventListener('pointerdown',e=>{const h=e.target.closest&&e.target.closest('.dg134');if(!h)return;e.preventDefault();e.stopPropagation();
  const w=h.closest('.st62s'),rows=rows134(w),from=rows.indexOf(h.closest('.st62'));if(from<0)return;
  DG134={from,to:from,id:e.pointerId,h,w,rid:h.dataset.dg134,sc:scr134(w)};rows[from].classList.add('dgs134');try{h.setPointerCapture(e.pointerId)}catch(x){}},true);
addEventListener('pointermove',e=>{if(!DG134||e.pointerId!==DG134.id)return;e.preventDefault();
  const rows=rows134(DG134.w);if(!rows.length)return;
  const sc=DG134.sc;if(sc){const b=sc.getBoundingClientRect();if(e.clientY<b.top+36)sc.scrollTop-=12;else if(e.clientY>b.bottom-36)sc.scrollTop+=12}
  let to=0,best=1e9;rows.forEach((r,i)=>{const b=r.getBoundingClientRect(),d=Math.abs(e.clientY-(b.top+b.height/2));if(d<best){best=d;to=i}});
  DG134.to=to;rows.forEach((r,i)=>{r.classList.toggle('dgb134',i===to&&to<DG134.from);r.classList.toggle('dga134',i===to&&to>DG134.from)})},true);
function dgEnd134(e,cancel){if(!DG134||e.pointerId!==DG134.id)return;const {from,to,h,w,rid}=DG134;DG134=null;try{h.releasePointerCapture(e.pointerId)}catch(x){}clr134(w);
  if(!cancel&&to!==from)move134(rid,w,from,to)}
addEventListener('pointerup',e=>dgEnd134(e,false),true);addEventListener('pointercancel',e=>dgEnd134(e,true),true);
addEventListener('keydown',e=>{const h=e.target&&e.target.classList&&e.target.classList.contains('dg134')?e.target:null;if(!h||(e.key!=='ArrowUp'&&e.key!=='ArrowDown'))return;e.preventDefault();e.stopPropagation();
  const w=h.closest('.st62s'),rows=rows134(w),i=rows.indexOf(h.closest('.st62')),to=i+(e.key==='ArrowUp'?-1:1),rid=h.dataset.dg134;
  if(i>=0&&move134(rid,w,i,to))setTimeout(()=>{const hs=document.querySelectorAll(`.st62s .dg134[data-dg134="${rid}"]`);const nb=hs[to];nb&&nb.focus()},30)},true);
addEventListener('click',e=>{if(e.target.closest&&e.target.closest('.dg134')){e.preventDefault();e.stopPropagation()}},true);

F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['↕ 루틴 단계 끌어서 순서 바꾸기','설정(편집) → 루틴 탭(또는 할 일 → 루틴 이름 누르기) → 단계 줄 맨 왼쪽 ⠿ 끌기','루틴 단계 줄 맨 앞 ⠿를 끌어 놓으면 순서가 바뀌어요(프리셋이 둘 이상이면 지금 편집 중인 프리셋의 순서). ⠿에 포커스를 두고 키보드 ↑↓로도 돼요.']
])}})(F67);

/* ---- 길이 바꾸는 동안 커서 ↕ 유지(옛 body.dragging은 ✋ grabbing으로 바꿔 버림) ---- */
dndStart=(function(prev){return function(e){const r=prev.apply(this,arguments);try{document.body.classList.toggle('rs134',DND.kind==='resize')}catch(x){}return r}})(dndStart);
['pointerup','pointercancel'].forEach(ev=>document.addEventListener(ev,()=>document.body.classList.remove('rs134'),true));
