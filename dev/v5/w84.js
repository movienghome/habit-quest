/* ---- v8.4 (w84.js): 캘린더 끝낸 일 · 막대 색·이모지 · 폰 할 일 화면 시간표 ----
   1) 끝낸 일 보이기: ① 1일·3일·주 보기 '종일 칸'에 시각 없는 끝낸 일(✓ + 목록 색·이모지) ② 월 보기 끝낸 칩을 할 일 기준으로 다시 그림
      (목록 색·이모지·✓ · 눌러서 상세) + 날짜 머리 ✓n(칩이 칸에 안 들어가도 개수는 보임). 거르기(보이기·숨기기)는 doneOn이 CAL77 안에서 그대로 적용.
   2) 월 막대(.bar83): w83이 renderCal 맨 끝에서 막대를 만들어 w70·v5o의 '목록 색·이모지 입히기'가 닿지 않았음 → 맨 바깥 감싸개 bars84가 같은 규칙으로 입힘.
   3) 폰 할 일 화면 시간표(독): C.tt84(켜짐)·C.tt84h(높이 px) — 둘 다 C 최상위 키. #calPane을 #tt84slot(아래 고정)으로 옮기고
      설정은 C.ui.cal._p84(1일)로 따로(PC 3단의 _t와 안 섞임). splitOn()은 그대로(PC 3단 전용) — 독은 tt84On()·calShown·placeCal·C.ui.cal 접근자만 손봄. */
var FORCEOFF84=0;
function tt84On(){return curView()==='tasks'&&innerWidth<760&&!!C.tt84}
function calShown(){return curView()==='cal'||splitOn()||tt84On()}
function splitOn(){return !FORCEOFF84&&curView()==='tasks'&&innerWidth>=1200&&C.ui.split!==false}

/* ---- 1) 끝낸 일 ---- */
function doneTasks84(k){const p=CAL77;CAL77=1;let es=[];try{es=doneOn(k)}finally{CAL77=p}
  const seen=new Set(),out=[];
  es.forEach(e=>{const t=TASKS[e.tid];if(!t||seen.has(t.id)||t.cb76||t.ml80||isStep62(t))return;
    const once=t.status===2&&t.doneAt===k,rep=t.status===0&&t.rep&&t.rep.f&&t.due!==k;if(!once&&!rep)return;seen.add(t.id);out.push({t,e,once})});
  return {list:out,raw:es.length}}
function chip84(t,once,cls){const cs=C.ui.cal||{},byList=cs.color==='list',l=byList?lcOf70(t):null;
  const em=byList?(listEmoji(t.list)||listName(listOk(t.list)?t.list:'inbox').replace(/^[^\p{L}\p{N}]+/u,'').slice(0,2)):'';
  return `<div class="cchip done d84 ${cls||''}${l?' lc70':''}" style="${l?`--lc70:${l.color};border-left:3px solid ${l.color};background:color-mix(in srgb,${l.color} 13%,var(--panel))`:''}" data-ctask="${t.id}" title="✓ 끝냄 · ${esc(t.title)}${l?' · '+esc(l.name||''):''}">${em?`<span class="ck58">${esc(em)}</span>`:''}✓ ${esc(t.title)}</div>`}
function allday84(){const pane=$('calPane');if(!pane||!calShown())return;
  let most=0;
  pane.querySelectorAll('.tgall [data-drop^="allday:"]').forEach(c=>{const k=c.dataset.drop.slice(7);c.querySelectorAll('.dd84').forEach(x=>x.remove());
    const ds=doneTasks84(k).list.filter(({t})=>!t.time);
    if(ds.length)c.insertAdjacentHTML('beforeend',ds.map(({t,once})=>chip84(t,once,'dd84')).join(''));
    most=Math.max(most,c.querySelectorAll('.cchip').length)});
  const tg=pane.querySelector('.alltog');if(tg&&most>3&&!/[▾▴]/.test(tg.textContent))tg.textContent='종일 '+(ui.allOpen?'▴':'▾')}
function month84(){const g=$('calMain')&&$('calMain').querySelector('.mgrid');if(!g)return;
  g.querySelectorAll('.mc[data-calday]').forEach(mc=>{const k=mc.dataset.calday;
    mc.querySelectorAll('.dc84').forEach(x=>x.remove());
    const old=[...mc.querySelectorAll('.cchip.done:not(.d84)')],{list,raw}=doneTasks84(k);
    if(!old.length&&!list.length)return;
    // 칸 +n 기준 값에서 '아직 안 그려진 끝낸 일' 만큼 빼고, 끝낸 일은 전부 다시 그려 칸 맞춤(cal62fit)이 넘치는 것을 세게 함
    const mr=mc.querySelector('.more');let base=mc.dataset.b62!=null?+mc.dataset.b62:(mr?(parseInt(mr.textContent.replace(/\D/g,''))||0):0);
    base=Math.max(0,base-Math.max(0,raw-old.length));mc.dataset.b62=base;if(mr)mr.remove();
    old.forEach(x=>x.remove());
    if(list.length){const h=list.map(({t,once})=>chip84(t,once,'dc84')).join('');const first=mc.querySelector('.sp83~.cchip,.cchip');
      mc.insertAdjacentHTML('beforeend',h)}
    const hd=mc.querySelector('.mch');if(hd&&list.length&&!hd.querySelector('.dn84'))hd.insertAdjacentHTML('beforeend',`<span class="dn84" title="끝낸 일 ${list.length}개">✓${list.length}</span>`)})}
function bars84(){const m=$('calMain');if(!m)return;const cs=C.ui.cal||{};if(cs.color!=='list')return;
  m.querySelectorAll('.bar83').forEach(b=>{const t=TASKS[b.dataset.ctask];if(!t)return;const l=lcOf70(t),cl=b.classList.contains('cl83'),cr=b.classList.contains('cr83');
    if(l){b.classList.add('lc70');b.style.setProperty('--lc70',l.color);if(!cl)b.style.borderLeft=`3px solid ${l.color}`;else b.style.borderTopColor=b.style.borderBottomColor=l.color;
      b.style.background=`color-mix(in srgb,${l.color} 34%,var(--panel))`}
    if(!b.querySelector('.ck58')){const txt=listEmoji(t.list)||listName(listOk(t.list)?t.list:'inbox').replace(/^[^\p{L}\p{N}]+/u,'').slice(0,2);
      b.innerHTML=`${cl?'‹ ':''}<span class="ck58">${esc(txt)}</span>${esc(t.title)}${cr?' ›':''}`}});
  try{place83()}catch(e){}}
renderCal=(function(prev){return function(){const x=prev.apply(this,arguments);
  try{if(calShown()){const md=(C.ui.cal||{}).mode;if(md==='month'){month84();bars84()}else if(md==='1day'||md==='3day'||md==='week')allday84()}}catch(e){console.error(e)}return x}})(renderCal);

/* ---- 3) 폰 할 일 화면 시간표(독) ---- */
function pdock84(base){if(!base._p84||typeof base._p84!=='object'){const c={};Object.keys(base).forEach(k=>{if(k[0]!=='_'&&k!=='filter')c[k]=base[k]});base._p84=Object.assign(c,{mode:'1day',actual:true,tray:false})}return base._p84}
function cal84Install(){const u=C&&C.ui;if(!u)return;const d=Object.getOwnPropertyDescriptor(u,'cal');if(!d||!d.get||d.get.m84)return;
  FORCEOFF84=1;let base;try{base=d.get.call(u)}finally{FORCEOFF84=0}if(!base||typeof base!=='object')return;
  const get=function(){return splitOn()?base._t:tt84On()?pdock84(base):base};get.m84=1;
  Object.defineProperty(u,'cal',{get,set(v){if(splitOn())base._t=v;
    else if(tt84On()){const t=pdock84(base);Object.keys(t).forEach(k=>delete t[k]);Object.assign(t,v)}
    else{const t=base._t,p=base._p84;Object.keys(base).forEach(k=>delete base[k]);Object.assign(base,v);if(!base._t&&t)base._t=t;if(!base._p84&&p)base._p84=p}},enumerable:false,configurable:true})}
calSplitInstall=(function(prev){return function(){prev.apply(this,arguments);try{cal84Install()}catch(e){console.error(e)}}})(calSplitInstall);
function slot84(){let s=$('tt84slot');if(!s){s=document.createElement('div');s.id='tt84slot';
  s.innerHTML='<div class="h84" id="tt84h"><span class="g84" aria-hidden="true"></span><b>🕒 시간표</b><span class="hint84">할 일을 꾹 눌러 끌어다 놓아요</span><button type="button" class="ib" data-tt84="x" aria-label="시간표 닫기">×</button></div>';
  (document.querySelector('[data-view="tasks"]')||document.body).appendChild(s)}return s}
function placeCal(){const pane=$('calPane');if(!pane)return;const on=splitOn(),dk=tt84On();
  const want=on?$('tCalSlot'):dk?slot84():document.querySelector('[data-view="cal"]');
  if(want&&pane.parentElement!==want){want.appendChild(pane);ui.calKeepScroll=false}
  const B=document.body.classList;B.toggle('split',on);B.toggle('wideview',on||curView()==='cal');B.toggle('tt84',dk);
  if(C.ui.listW)document.documentElement.style.setProperty('--listw',C.ui.listW+'px');
  const nav=document.querySelector('.bnav'),nh=nav&&getComputedStyle(nav).display!=='none'?Math.round(nav.getBoundingClientRect().height):0;
  const h=Math.min(Math.round(innerHeight*.75),Math.max(180,+C.tt84h||Math.round(innerHeight*.42)));
  document.documentElement.style.setProperty('--tt84h',h+'px');document.documentElement.style.setProperty('--bnavh',nh+'px')}
// 할 일 칩 줄: 📅 캘린더 옆에 🕒 시간표
function chip84btn(){const old=$('t84tt');if(innerWidth>=760||curView()!=='tasks'){if(old)old.remove();return}
  const ch=$('tChips');if(!ch)return;let b=old;if(!b){b=document.createElement('button');b.type='button';b.className='chipbtn';b.id='t84tt';b.textContent='🕒 시간표';b.title='아래에 시간표를 띄워 할 일을 끌어다 놓기';
    const cal=$('t76cal');if(cal)cal.after(b);else ch.insertAdjacentHTML('afterbegin','')||ch.prepend(b)}
  b.setAttribute('aria-pressed',!!C.tt84);b.classList.toggle('on',!!C.tt84)}
render=(function(prev){return function(){const x=prev.apply(this,arguments);try{chip84btn()}catch(e){console.error(e)}return x}})(render);
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('#t84tt,[data-tt84]');if(!b)return;e.preventDefault();e.stopPropagation();
  C.tt84=b.id==='t84tt'?!C.tt84:false;save('config');ui.calKeepScroll=false;render();
  if(C.tt84)toast('🕒 아래 시간표에 할 일을 꾹 눌러 끌어 놓으면 시각이 정해져요 · ◀ ▶로 날짜 넘기기')},true);
// 손잡이를 끌어 높이 바꾸기
{let on=false,sy=0,sh=0;
  addEventListener('pointerdown',e=>{const h=e.target.closest&&e.target.closest('#tt84h');if(!h||e.target.closest('button'))return;on=true;sy=e.clientY;sh=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tt84h'))||300;h.setPointerCapture&&h.setPointerCapture(e.pointerId);document.body.classList.add('dragging')});
  addEventListener('pointermove',e=>{if(!on)return;const v=Math.round(Math.min(innerHeight*.75,Math.max(180,sh+sy-e.clientY)));document.documentElement.style.setProperty('--tt84h',v+'px');C.tt84h=v});
  const end=()=>{if(!on)return;on=false;document.body.classList.remove('dragging');save('config');ui.calKeepScroll=true;try{renderCal()}catch(e){}};
  addEventListener('pointerup',end);addEventListener('pointercancel',end)}
addEventListener('resize',()=>{try{placeCal();chip84btn()}catch(e){}});
addEventListener('hashchange',()=>setTimeout(()=>{try{placeCal();chip84btn();if(tt84On())renderCal()}catch(e){}},0));

F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['✓ 끝낸 일 보이기','캘린더 (월·1일·3일·주)','끝낸 일이 목록 색·이모지와 ✓로 남아요 — 시각 없는 끝낸 일은 종일 칸에, 월 보기는 날짜 옆 ✓n으로 개수까지.'],
  ['🕒 폰 시간표','할 일 화면 칩 줄 🕒 시간표','할 일 목록 아래에 오늘 시간표가 떠요. 할 일을 꾹 눌러 끌어 시간에 놓으면 시각이 정해져요. 위 손잡이를 끌면 높이가 바뀌고 ×로 닫아요.']])}})(F67);
