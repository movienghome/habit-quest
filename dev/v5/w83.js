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

/* ---- C3) 캘린더 아래 큰 입력칸 → 작은 '＋ 추가' (팝업) · 빈 곳에 ＋ 힌트 ----
   날짜 패널(월 보기 아래·dp64)의 입력 줄(form[data-taddform=cal])은 CSS로 접고, 제목 줄 '＋ 추가'가 날짜 추가 팝업(calAddDay)을 엶.
   시간표 빈 칸·월 칸 누르기는 그대로 팝업(v5n·v5o). 마우스를 올리면 빈 곳에 ＋ 힌트(시간표: 30분 칸, 월: 칸 모서리).
   N 키(캘린더 화면)도 팝업. 입력칸 #calAdd는 DOM에 남김(저장/복원·옛 코드 호환). */
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-add83]');if(!b)return;
  e.preventDefault();e.stopPropagation();lastPt={x:e.clientX,y:e.clientY};calAddDay(b.dataset.add83||ui.calSel||dateKey())},true);
addEventListener('keydown',e=>{if(e.key.toLowerCase()!=='n'||e.ctrlKey||e.metaKey||e.altKey||e.shiftKey||curView()!=='cal')return;
  const t=e.target,typing=t&&(/^(input|textarea|select)$/i.test(t.tagName)||t.isContentEditable);if(typing)return;
  if(document.getElementById('sheet')&&!document.getElementById('sheet').hidden&&sheetCtx)return;
  setTimeout(()=>{if(!document.getElementById('cal58Add'))calAddDay(ui.calSel||dateKey())},10)});
// 시간표 빈 곳 ＋ 힌트(마우스만)
var PL83=null;
addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;
  const col=e.target.closest&&e.target.closest('.tgcol[data-drop^="col:"]');
  if(!col||e.target.closest('.blk,.cchip,button,a,input')||(typeof DND!=='undefined'&&DND.on)||CAL57){if(PL83)PL83.hidden=true;return}
  const r=col.getBoundingClientRect(),m=clamp(Math.floor(mOf(e.clientY-r.top)/30)*30,0,1410);
  if(!PL83||!PL83.isConnected){PL83=document.createElement('div');PL83.className='plus83';PL83.setAttribute('aria-hidden','true')}
  if(PL83.parentElement!==col)col.appendChild(PL83);PL83.hidden=false;PL83.style.top=yOf(m)+'px';PL83.style.height=Math.max(14,yOf(m+30)-yOf(m)-2)+'px';PL83.textContent='＋ '+hm(m)},{passive:true});
document.addEventListener('pointerleave',()=>{if(PL83)PL83.hidden=true},true);

/* ---- C4) 루틴 = 단계 시간 합만큼의 블록 · 시간표에서 옮기면 '이 날만 / 앞으로' 묻기 ----
   루틴 머리 할 일(t.rid)은 캘린더에서 단계 분(r.steps[].min 합, 🔀 묶음은 가장 긴 것 하나)만큼 길게 그림(tasksOn 결과의 사본 — 할 일 자체의 dur은 안 바꿈).
   시간표에서 시각을 옮겨 놓으면(dndEnd) 바로 안 바꾸고 창을 띄움: 이 날만(= t.tx83 {d:날짜,m:시각}, 그 날 블록만 옮겨 그림, 루틴 ⏰ 몇 시쯤은 그대로)
   · 앞으로 이 시간(= 머리 t.time 바꿈 = 루틴 편집의 ⏰와 같은 값) · 취소. tx83은 t.due가 다른 날이 되면 저절로 안 쓰임.
   루틴 블록의 길이 손잡이(.rz)는 뺌(길이 = 단계 합. 바꾸려면 루틴 편집). */
function rtMin83(r){if(!r||!r.steps)return 0;const g={};let n=0;
  r.steps.forEach(s=>{const m=+s.min||0;if(s.g71)g[s.g71]=Math.max(g[s.g71]||0,m);else n+=m});
  return n+Object.values(g).reduce((a,b)=>a+b,0)}
function view83(t,k){if(!t||!t.rid)return t;const r=(C.routines||[]).find(x=>x.id===t.rid),tot=rtMin83(r),x=t.tx83&&t.tx83.d===k&&t.due===k?t.tx83.m:null;
  if(!tot&&!x)return t;if(t.dur===tot&&!x)return t;const c=Object.assign({},t);if(tot)c.dur=tot;if(x)c.time=x;return c}
tasksOn=(function(prev){return function(k){return prev.apply(this,arguments).map(t=>view83(t,k))}})(tasksOn);
function rtMove83(t,date,min){
  sheetCtx={rm83:{id:t.id,date,min}};const tm=hm(min),cur=(t.tx83&&t.tx83.d===t.due?t.tx83.m:t.time)||'',same=date===t.due;
  openSheet(`<div class="sh"><h3>⏱ ${esc(t.title)} 옮기기</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <p class="small" style="margin:4px 0 8px">${esc(fmtD(date))} (${wdOf(date)}) <b>${tm}</b> 으로 옮길까요?${cur?` <span class="muted">(지금 ${esc(cur)})</span>`:''}</p>
    <div class="col" style="gap:6px"><button class="btn" type="button" data-m83="day">이 날만 <small class="muted">· 루틴 ⏰ 몇 시쯤은 그대로</small></button>
    <button class="btn ghost" type="button" data-m83="fwd">앞으로 이 시간 <small class="muted">· 루틴 ⏰ 몇 시쯤도 ${tm}으로</small></button>
    <button class="btn ghost" type="button" data-sheet="close">취소</button></div>`)}
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-m83]');if(!b)return;e.preventDefault();e.stopPropagation();
  const c=(sheetCtx||{}).rm83,t=c&&TASKS[c.id];if(!t){closeSheet();return}const td=dateKey(),old=t.due,tm=hm(c.min);
  if(old&&old<=td&&c.date>old)t.skull=(t.skull||0)+1;
  t.due=c.date;if(!t.dur)t.dur=30;
  if(b.dataset.m83==='day'){t.tx83={d:c.date,m:tm}}else{t.time=tm;delete t.tx83}
  if(t.rep&&t.rep.f==='w'&&t.rep.wd&&t.rep.wd.length===1&&old!==c.date)t.rep.wd=[dowOf(c.date)];
  saveTask(t);closeSheet();ui.calSel=c.date;ui.calKeepScroll=true;render();
  toast(b.dataset.m83==='day'?`${t.title} · ${dueLabel(c.date)} ${tm} (이 날만)`:`${t.title} · 앞으로 ${tm}`)},true);
dndEnd=(function(prev){return function(x,y){
  try{const kind=DND.kind,id=DND.id,drop=DND.drop,t=TASKS[id];
    if(kind==='resize'&&t&&t.rid){DND.newDur=null}
    else if((kind==='block'||kind==='task')&&t&&t.rid&&t.rep&&drop&&drop.type==='time'&&!(ui.msel&&ui.msel.size>1)){
      const cur=(t.tx83&&t.tx83.d===t.due?t.tx83.m:t.time)||'';
      if(!(drop.date===t.due&&hm(drop.min)===cur)){DND.drop=null;const r=prev.apply(this,arguments);rtMove83(t,drop.date,drop.min);return r}}}catch(e){console.error(e)}
  return prev.apply(this,arguments)}})(dndEnd);
renderCal=(function(prev){return function(){const x=prev.apply(this,arguments);
  try{const m=$('calMain');if(m)m.querySelectorAll('.blk[data-ctask]').forEach(b=>{const t=TASKS[b.dataset.ctask];if(t&&t.rid){b.querySelectorAll('.rz,.rz75').forEach(z=>z.remove());b.classList.add('rt83');const bt=b.querySelector('.bt');if(bt&&!bt.dataset.i83){bt.dataset.i83=1;bt.textContent='⏱ '+bt.textContent}}})}catch(e){console.error(e)}return x}})(renderCal);

F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['📆 월 보기 여러 날 막대','캘린더 월 보기','여러 날 일정은 칸마다 칩이 아니라 한 줄 막대로 이어져요(‹ › = 앞뒤로 이어짐, 눌러서 열기, 끌면 길이 그대로 통째로 옮김).'],
  ['↔ 1일·3일 보기 하루씩','캘린더 1일·3일 보기','옆으로 휠·Shift+휠·폰 옆으로 밀기로 하루씩 넘어가요.'],
  ['＋ 날짜에 추가','캘린더 날짜 패널 ＋ 추가 · N 키','큰 입력칸 대신 작은 ＋ 추가가 팝업을 띄워요. 시간표 빈 곳·월 칸 빈 곳 누르기도 같아요.'],
  ['⏱ 루틴 블록','캘린더 시간표','루틴은 단계 시간 합만큼 길게 보이고, 시각을 옮기면 이 날만/앞으로를 물어요.']])}})(F67);
