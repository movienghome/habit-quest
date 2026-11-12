/* ---- v8.3 (w83.js): C묶음 — 캘린더 ----
   C1) 월 보기: 여러 날 일정(t.due~t.end71)은 칸마다 칩 대신 한 줄 막대로 쭉 이어짐.
       주(줄)마다 막대 조각을 그리고, 이어지는 쪽엔 ‹ › 표시(색만으로 구분하지 않음).
       막대 아래 칸 칩은 칸 안 spacer(.sp83)가 밀어 줌. 막대 자리는 칸 레인(NL개)까지, 넘치면 시작 칸 '+n'.
       막대는 .mgrid 안 absolute(.bar83, .cchip 같은 속성: 눌러서 열기·꾹 눌러 끌기) — 끄는 동안(body.dragging)은 pointer-events 없음.
       잡은 날은 pointerdown에서 data-k72로 정함(w72 dndEnd가 그만큼 통째로 옮김). */
var BL83=15;
function bars83(){
  const g=$('calMain')&&$('calMain').querySelector('.mgrid');if(!g)return;
  g.querySelectorAll('.sp83,.bar83').forEach(x=>x.remove());
  const mcs=[...g.querySelectorAll('.mc[data-calday]')];if(!mcs.length)return;
  const first=mcs[0].dataset.calday,last=mcs[mcs.length-1].dataset.calday,td=dateKey();
  const list=openTasks().filter(t=>t.due&&span71(t)&&calPass(t)&&t.due<=last&&t.end71>=first)
    .sort((a,b)=>a.due<b.due?-1:a.due>b.due?1:(diffDays(b.end71,b.due)-diffDays(a.end71,a.due))||String(a.id).localeCompare(String(b.id)));
  if(!list.length)return;
  const NL=innerWidth<760?2:3,rows=Math.ceil(mcs.length/7),need=mcs.map(()=>0),segs=[],over=[];
  for(let w=0;w<rows;w++){const lo=w*7,hi=Math.min(mcs.length-1,lo+6),lanes=[];
    list.forEach(t=>{const ts=diffDays(t.due,first),te=diffDays(t.end71,first);if(te<lo||ts>hi)return;
      const c0=Math.max(ts,lo)-lo,c1=Math.min(te,hi)-lo;let li=lanes.findIndex(e=>e<c0);if(li<0){li=lanes.length;lanes.push(c1)}else lanes[li]=c1;
      if(li>=NL){over.push(lo+c0);return}
      segs.push({t,lo,c0,c1,li,l:ts<lo,r:te>hi});for(let c=c0;c<=c1;c++)need[lo+c]=Math.max(need[lo+c],li+1)})}
  need.forEach((n,i)=>{if(!n)return;const h=mcs[i].querySelector('.mch');const sp=document.createElement('div');sp.className='sp83';sp.style.height=(n*BL83-2)+'px';sp.dataset.n=n;if(h)h.after(sp);else mcs[i].prepend(sp)});
  over.forEach(i=>{const m=mcs[i];m.dataset.b62=(+m.dataset.b62||0)+1});
  const frag=document.createDocumentFragment();
  segs.forEach(s=>{const t=s.t,b=document.createElement('div');
    b.className=`cchip bar83 p${t.prio||0}${t.end71<td?' late':''}${t.brave?' brave':''}${s.l?' cl83':''}${s.r?' cr83':''}`;
    b.setAttribute('data-drag','task:'+t.id);b.setAttribute('data-dragmode','hold');b.setAttribute('data-ctask',t.id);
    b.dataset.c83=(s.lo+s.c0)+'-'+(s.lo+s.c1);b.dataset.l83=s.li;
    b.title=`${t.title} · ${fmtD(t.due)}~${fmtD(t.end71)}`;
    b.textContent=(s.l?'‹ ':'')+t.title+(s.r?' ›':'');frag.appendChild(b)});
  g.appendChild(frag);
  try{if(typeof cal62fit==='function')cal62fit()}catch(e){}
  place83()}
function place83(){
  const g=$('calMain')&&$('calMain').querySelector('.mgrid');if(!g)return;const bs=[...g.querySelectorAll('.bar83')];if(!bs.length)return;
  const mcs=[...g.querySelectorAll('.mc[data-calday]')],gr=g.getBoundingClientRect();
  bs.forEach(b=>{const [a,z]=b.dataset.c83.split('-').map(Number),A=mcs[a],Z=mcs[z];if(!A||!Z)return;
    const ra=A.getBoundingClientRect(),rz=Z.getBoundingClientRect(),sp=A.querySelector('.sp83');if(!sp){b.hidden=true;return}
    b.hidden=false;const rs=sp.getBoundingClientRect();
    b.style.left=(ra.left-gr.left+1)+'px';b.style.width=(rz.right-ra.left-2)+'px';b.style.top=(rs.top-gr.top+(+b.dataset.l83)*BL83)+'px'})}
var RO83=null,MO83=null,PQ83=0;
function q83(){if(PQ83)return;PQ83=requestAnimationFrame(()=>{PQ83=0;try{place83()}catch(e){}})}
function watch83(){
  const g=$('calMain')&&$('calMain').querySelector('.mgrid');if(!g)return;
  if(RO83)RO83.disconnect();if(MO83)MO83.disconnect();
  if(typeof ResizeObserver==='function'){RO83=new ResizeObserver(q83);RO83.observe(g);g.querySelectorAll('.mc').forEach(c=>RO83.observe(c))}
  MO83=new MutationObserver(m=>{if(m.some(r=>[...r.addedNodes,...r.removedNodes].some(n=>n.nodeType===1&&(n.classList.contains('dp63')||n.classList.contains('mc')))))q83()});
  MO83.observe(g,{childList:true})}
renderCal=(function(prev){return function(){const x=prev.apply(this,arguments);
  try{if(calShown()&&calState().mode==='month'){bars83();watch83()}}catch(e){console.error(e)}return x}})(renderCal);
addEventListener('resize',q83);
addEventListener('pointerdown',e=>{const b=e.target&&e.target.closest&&e.target.closest('.bar83');if(!b)return;
  const cells=[...b.parentElement.querySelectorAll('.mc[data-calday]')],[a,z]=b.dataset.c83.split('-').map(Number);let k=null;
  for(let i=a;i<=z&&cells[i];i++){const r=cells[i].getBoundingClientRect();if(e.clientX>=r.left&&e.clientX<r.right){k=cells[i].dataset.calday;break}}
  b.dataset.k72=k||(cells[a]&&cells[a].dataset.calday)||''},true);

/* ---- C2) 1일·3일 보기: 가로 휠(Shift+휠·트랙패드 옆으로)·폰 옆으로 밀기 = 하루씩 이동 ----
   ◀ ▶ 단추는 그대로(1일 보기 하루씩·3일 보기 3일씩, patch24). */
var W83={acc:0,t:0,lock:0};
function calStep83(n){const m=(C.ui.cal||{}).mode;if(m!=='1day'&&m!=='3day')return false;ui.calAnchor=addDays(ui.calAnchor||dateKey(),n);ui.calKeepScroll=true;renderCal();return true}
function inGrid83(el){return !!(el&&el.closest&&el.closest('#calMain .tgwrap'))}
addEventListener('wheel',e=>{const m=(C.ui.cal||{}).mode;if((m!=='1day'&&m!=='3day')||!inGrid83(e.target)||curView()!=='cal')return;
  const dx=e.deltaX||(e.shiftKey?e.deltaY:0);if(!dx||(!e.shiftKey&&Math.abs(e.deltaX)<Math.abs(e.deltaY)))return;
  e.preventDefault();const now=Date.now();if(now-W83.t>350)W83.acc=0;W83.t=now;
  if(now<W83.lock)return;W83.acc+=dx;if(Math.abs(W83.acc)>=40){const s=W83.acc>0?1:-1;W83.acc=0;W83.lock=now+220;calStep83(s)}},{passive:false});
{let sx=0,sy=0,st=0;
  addEventListener('touchstart',e=>{st=0;const m=(C.ui.cal||{}).mode;if((m!=='1day'&&m!=='3day')||!inGrid83(e.target)||e.touches.length!==1)return;
    if(e.target.closest('.rz,.rz75,.allrz,.foldband'))return;const t=e.touches[0];sx=t.clientX;sy=t.clientY;st=Date.now()},{passive:true});
  addEventListener('touchend',e=>{if(!st)return;const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy,ok=Date.now()-st<500&&Math.abs(dx)>50&&Math.abs(dy)<40&&Math.abs(dx)>Math.abs(dy)*1.6;st=0;
    if(!ok||(typeof DND!=='undefined'&&DND&&(DND.on||DND.pending)))return;calStep83(dx<0?1:-1)},{passive:true})}
