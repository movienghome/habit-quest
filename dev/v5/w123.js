/* ---- v12.5 (w123.js): 루틴 상세 '언제' 위에 프리셋 · 프리셋마다 시각·요일 · 실행 화면 단계 순서·이름 · 체크리스트 끌어서 순서 (사용자 11/23 밤: N13·N14) ----
   · 프리셋 줄(`.pbar119`)은 루틴 카드·할 일 상세 루틴 칸에서 **`📅 언제`(.when60) 바로 위**. `top119`를 다시 선언해 카드 맨 위(이름 칸 앞) 대신 .when60 앞에 끼움.
     할 일 상세에서 w119가 줄을 머리줄 밑으로 옮기던 것(drawTaskSheet)은 여기서 다시 `.when60` 앞으로 되돌림(`mvBack123`).
   · 프리셋마다 시각·요일: 프리셋 `p.tm`('HH:MM', 없으면 루틴 ⏰ 몇 시쯤=머리 할 일 시각) · `p.wd=[0~6]`(그 요일엔 직접 안 골라도 그 프리셋 — 요일이 겹치면 목록 앞쪽).
     프리셋이 둘 이상이면 `.when71`(⏰ 몇 시쯤) 줄 대신 `.when123`(기본 시각 + 프리셋별 줄: 시각 칸·요일 칩).
     읽기: **`pset117`을 다시 선언** — 우선순위 직접 고른 `r.pd117[날짜]` > 일정 상황(t.rsit118) > **요일 `p.wd`(w123)** > 기본 `r.pf117` > 첫째. **`view83`도 다시 선언** — 캘린더 블록 시각 = 이 날만 옮긴 `t.tx83` > 그날 프리셋 `p.tm` > 머리 `t.time`.
     (목록 정렬·홈 추천·알림은 아직 머리 `t.time`만 읽음 — 프리셋 시각까지 넓히려면 `ptime123(r,날짜)`를 쓸 것.)
   · 실행 화면(N13): 아직 안 한 단계 이름을 누르면 나오는 창(`hMenu75`)에 `↑ 한 칸 앞`·`↓ 한 칸 뒤`(오늘만, 창은 그대로 열려 있어 여러 번 눌러도 됨)·`✎ 이름 고치기`(카드 연결 단계는 카드에서, 할 일 단계는 할 일 제목, 이름만 있는 단계는 루틴에도 저장) 추가. 지금 단계도 이름 고치기 가능.
   · 체크리스트(N14): 할 일 상세 ☑ 체크리스트 각 줄 왼쪽 손잡이 `⠿`(`.dg123`) — 끌어서 놓기(포인터, 터치 OK) 또는 손잡이에 포커스 후 ↑↓ 키. 놓으면 `t.subs` 순서를 바꾸고 `tsCommit`.
   시험 t130. */

/* ---- 1) 프리셋 읽기: 요일 + 시각 ---- */
function dow123(d){try{return new Date(+d.slice(0,4),+d.slice(5,7)-1,+d.slice(8,10)).getDay()}catch(e){return -1}}
function pset117(r,d){const L=ensure117(r);if(!L.length)return null;d=d||gk76();const id=(r.pd117||{})[d];
  const pick=L.find(p=>p.id===id)||schedP117(d,L);if(pick)return pick;
  const w=dow123(d),byW=w>=0?L.find(p=>Array.isArray(p.wd)&&p.wd.indexOf(w)>=0):null;if(byW)return byW;
  return L.find(p=>p.id===r.pf117)||L[0]}
function ptime123(r,d){const p=pset117(r,d),h=rtT(r)||rtH62(r,false);return (p&&p.tm)||(h&&h.time)||''}
function view83(t,k){if(!t||!t.rid)return t;const r=(C.routines||[]).find(x=>x.id===t.rid),tot=rtMin83(r,k),x=t.tx83&&t.tx83.d===k&&t.due===k?t.tx83.m:null;
  let pt=null;try{const p=r&&pset117(r,k);if(p&&p.tm&&!x)pt=p.tm}catch(e){}
  if(!tot&&!x&&!pt)return t;if(t.dur===tot&&!x&&(!pt||t.time===pt))return t;const c=Object.assign({},t);if(tot)c.dur=tot;if(x)c.time=x;else if(pt)c.time=pt;return c}

/* ---- 2) 카드: 프리셋 줄 = '📅 언제' 위, 프리셋마다 시각·요일 ---- */
function top119(h,r){try{if(typeof h!=='string'||h.indexOf('pbar119')>=0)return h;const m='<div class="when60">',i=h.indexOf(m);
  if(i>=0)return h.slice(0,i)+bar119(r)+h.slice(i);const m2='<div class="kv">',j=h.indexOf(m2);if(j>=0)return h.slice(0,j)+bar119(r)+h.slice(j)}catch(e){console.error(e)}return h}
var WD123=[1,2,3,4,5,6,0];
function when123(r,head){const L=ensure117(r);
  const base=`<div class="when71 when123"><b class="small">⏰ 몇 시쯤${L.length>1?' <small class="muted">기본</small>':''}</b><input type="time" data-r71time="${r.id}" value="${esc(head.time||'')}" aria-label="루틴 기본 시각">${head.time?`<button type="button" class="ib" data-r71notime="${r.id}" aria-label="시각 지우기">✕</button>`:''}<span class="tiny muted">${L.length>1?'프리셋마다 따로 정하면 그 프리셋인 날은 그 시각이에요':'정하면 할 일 목록·캘린더에서 시간 순서로 서고, 홈 추천은 그 시각 가까이에만 떠요'}</span></div>`;
  if(L.length<2)return base;
  const rows=L.map(p=>`<div class="pw123" data-pw123="${r.id}|${p.id}"><span class="pn123">${esc(preN117(p))}</span><input type="time" data-ptm123="${r.id}|${p.id}" value="${esc(p.tm||'')}" aria-label="${esc(p.n)} 시각" ${head.time?`placeholder="${esc(head.time)}"`:''}>${p.tm?`<button type="button" class="ib" data-ptm123x="${r.id}|${p.id}" aria-label="${esc(p.n)} 시각 지우기">✕</button>`:''}<span class="wd123" role="group" aria-label="${esc(p.n)} 자동 요일">${WD123.map(w=>`<button type="button" class="chipbtn wd123b" data-pwd123="${r.id}|${p.id}|${w}" aria-pressed="${(p.wd||[]).indexOf(w)>=0}">${WDK[w]}</button>`).join('')}</span></div>`).join('');
  return base+`<div class="pwrap123"><div class="tiny muted pwh123">프리셋마다 · 시각(비우면 기본) · 요일을 고르면 그 요일엔 자동으로 그 프리셋 <small>(직접 고른 날이 먼저)</small></div>${rows}</div>`}
function fix123(h,r){try{const head=rtH62(r,false);
  if(head&&typeof h==='string'&&h.indexOf('when123')<0){const re=/<div class="when71">[\s\S]*?<\/div>(?=<div class="st62s">)/;if(re.test(h))h=h.replace(re,()=>when123(r,head));else if(h.indexOf('<div class="st62s">')>=0)h=h.replace('<div class="st62s">',()=>when123(r,head)+'<div class="st62s">')}}catch(e){console.error(e)}return h}
rtCard62=(function(prev){return function(r){return fix123(prev.apply(this,arguments),r)}})(rtCard62);
rtCard61=(function(prev){return function(r){return fix123(prev.apply(this,arguments),r)}})(rtCard61);
function redo123(r){try{if(sheetCtx&&sheetCtx.rt64===r.id)rtDone64(r,true);else if(sheetCtx&&sheetCtx.rt61===r.id)redrawRt61();else if(sheetCtx&&sheetCtx.task&&$('tsTitle'))tsRedraw();else if(curView()==='edit')reEdit()}catch(e){console.error(e)}}
function pw123(s){const [rid,pid,...x]=s.split('|'),r=(C.routines||[]).find(z=>z.id===rid);return {r,p:r&&ensure117(r).find(z=>z.id===pid),x}}
addEventListener('change',e=>{const i=e.target;if(!i||!i.dataset||!i.dataset.ptm123)return;e.stopPropagation();e.stopImmediatePropagation();const {r,p}=pw123(i.dataset.ptm123);if(!r||!p)return;
  if(i.value)p.tm=i.value;else delete p.tm;save('config');render();redo123(r)},true);
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-ptm123x],[data-pwd123]');if(!b)return;e.preventDefault();e.stopPropagation();
  if(b.dataset.ptm123x){const {r,p}=pw123(b.dataset.ptm123x);if(!r||!p)return;delete p.tm;save('config');render();redo123(r);return}
  const {r,p,x}=pw123(b.dataset.pwd123);if(!r||!p)return;const w=+x[0];p.wd=Array.isArray(p.wd)?p.wd.slice():[];
  const k=p.wd.indexOf(w);if(k>=0)p.wd.splice(k,1);else{p.wd.push(w);ensure117(r).forEach(q=>{if(q!==p&&Array.isArray(q.wd)){q.wd=q.wd.filter(z=>z!==w);if(!q.wd.length)delete q.wd}})}   // 한 요일은 한 프리셋에만
  if(!p.wd.length)delete p.wd;save('config');render();redo123(r);
  if(k<0)toast(`${WDK[w]}요일은 ${preN117(p)}로 자동 · 직접 고른 날이 먼저예요`)},true);
// 할 일 상세: 루틴 칸의 프리셋 줄을 w119가 머리줄 밑으로 옮기던 걸 되돌려 '언제' 위에 둠
function mvBack123(){const sc=$('sheetC');if(!sc||!$('tsTitle'))return;const mv=[...sc.querySelectorAll(':scope > .pbar119.mv')];if(!mv.length)return;
  const inCard=sc.querySelector('.rt62p .pbar119:not(.mv)');mv.forEach(e=>e.remove());
  if(!inCard){const w=sc.querySelector('.rt62p .when60'),rt=sc.querySelector('.rt62p'),tt=$('tsTitle');let r=null;try{const t=TASKS[(sheetCtx||{}).task];r=t&&t.rid?(C.routines||[]).find(x=>x.id===t.rid):null}catch(x){}
    if(w&&r)w.insertAdjacentHTML('beforebegin',bar119(r))}}
drawTaskSheet=(function(prev){return function(){const x=prev.apply(this,arguments);try{mvBack123()}catch(e){console.error(e)}return x}})(drawTaskSheet);

/* ---- 3) 실행 화면: 단계 순서(오늘만) · 이름 고치기 (N13) ---- */
function hMove123(j,dir){if(!RUN||RUN.kind!=='routine')return;j=+j;const k=j+dir;if(j<=RUN.si||k<=RUN.si||k>=RUN.steps.length)return;
  const a=RUN.steps[j];RUN.steps[j]=RUN.steps[k];RUN.steps[k]=a;hTgt75();runSave();drawHunt(true);hMenu75(k)}
function hRename123(j,v){const s=RUN&&RUN.steps[j];v=(v||'').trim();if(!s||!v)return false;const r=rt75(),i=rsOf75(r,s);
  if(s.aid&&s.aid!=='@weigh'&&!s.tmp75){toast('카드로 이은 단계는 카드 이름이에요 · 카드 편집에서 바꿔요');return false}
  s.name=v;
  if(r&&i>=0&&!s.tmp75){const rs=r.steps[i];if(rs.tid&&TASKS[rs.tid]){TASKS[rs.tid].title=v;saveTask(TASKS[rs.tid])}else if(!rs.aid)rs.name=v;save('config')}
  runSave();drawHunt(true);toast(`이름을 '${v}'(으)로 바꿨어요${s.tmp75?' (오늘만)':''}`);return true}
hMenu75=(function(prev){return function(j){const x=prev.apply(this,arguments);try{
  if(j==='+')return x;const box=$('hunt'),m=box&&box.querySelector('.m75 .stack');if(!m||!RUN||RUN.kind!=='routine'||m.querySelector('[data-m123]'))return x;
  const n=+j,s=RUN.steps[n];if(!s)return x;const past=n<RUN.si,cur=n===RUN.si;let h='';
  if(!past&&!cur)h+=`<div class="mv123"><button type="button" class="btn ghost sm" data-m123="up:${n}" ${n-1>RUN.si?'':'disabled'} aria-label="한 칸 앞으로">↑ 한 칸 앞</button><button type="button" class="btn ghost sm" data-m123="dn:${n}" ${n<RUN.steps.length-1?'':'disabled'} aria-label="한 칸 뒤로">↓ 한 칸 뒤</button><span class="tiny muted">오늘만</span></div>`;
  if(!past)h+=`<button type="button" class="btn ghost sm" data-m123="rn:${n}">✎ 이름 고치기</button>`;
  if(h){const first=m.querySelector('.mn75');first?first.insertAdjacentHTML('afterend',h):m.insertAdjacentHTML('afterbegin',h)}
}catch(e){console.error(e)}return x}})(hMenu75);
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('#hunt [data-m123]');if(!b)return;e.preventDefault();e.stopPropagation();const [op,a]=b.dataset.m123.split(':');
  if(op==='up')hMove123(+a,-1);else if(op==='dn')hMove123(+a,1);
  else if(op==='rn'){const s=RUN&&RUN.steps[+a];if(!s)return;const st=b.closest('.m75 .stack');if(!st)return;
    st.innerHTML=`<b>✎ 이름 고치기</b><input id="hRn123" value="${esc(s.name||'')}" maxlength="60" enterkeyhint="done" autocomplete="off" aria-label="단계 이름" data-n123="${a}"><div class="row" style="gap:6px;justify-content:flex-end"><button class="btn ghost" type="button" data-m123="rx:${a}">닫기</button><button class="btn go" type="button" data-m123="rs:${a}">바꾸기</button></div>`;
    setTimeout(()=>{const i=$('hRn123');i&&(i.focus(),i.select())},30)}
  else if(op==='rs'){const i=$('hRn123');if(i&&hRename123(+a,i.value))document.querySelectorAll('#hunt .m75').forEach(z=>z.remove());else if(i&&!i.value.trim())i.focus()}
  else if(op==='rx')document.querySelectorAll('#hunt .m75').forEach(z=>z.remove())},true);
addEventListener('keydown',e=>{const i=e.target;if(!i||i.id!=='hRn123'||e.key!=='Enter'||e.isComposing||e.keyCode===229)return;e.preventDefault();e.stopPropagation();
  if(hRename123(+i.dataset.n123,i.value))document.querySelectorAll('#hunt .m75').forEach(z=>z.remove())},true);

/* ---- 4) 체크리스트 끌어서 순서 (N14) ---- */
var DG123=null;
function dgRows123(){return [...document.querySelectorAll('#sheetC .subs > .sr')].filter(r=>r.querySelector('input[data-tssub]'))}   // 맨 아래 추가 입력 줄(form.sr)은 빼기
function dgAdd123(){const sc=$('sheetC');if(!sc||!$('tsTitle'))return;
  dgRows123().forEach((row,i)=>{if(row.querySelector('.dg123'))return;const ck=row.querySelector('input[data-tssub]');if(!ck)return;
    const b=document.createElement('button');b.type='button';b.className='dg123';b.textContent='⠿';b.dataset.dg123=i;b.setAttribute('aria-label','순서 바꾸기 (끌거나 ↑↓ 키)');b.title='끌어서 순서 바꾸기';row.insertBefore(b,row.firstChild)});
  dgRows123().forEach((row,i)=>{const b=row.querySelector('.dg123');if(b)b.dataset.dg123=i})}
drawTaskSheet=(function(prev){return function(){const x=prev.apply(this,arguments);try{dgAdd123()}catch(e){console.error(e)}return x}})(drawTaskSheet);
function dgMove123(from,to){const t=TASKS[(sheetCtx||{}).task];if(!t||!t.subs||from===to||from<0||to<0||from>=t.subs.length||to>=t.subs.length)return false;
  try{tsRead()}catch(e){}const it=t.subs.splice(from,1)[0];t.subs.splice(to,0,it);const sc=$('sheetC'),y=sc?sc.scrollTop:0;tsCommit(true,false);if(sc)sc.scrollTop=y;return true}
function dgClear123(){dgRows123().forEach(r=>r.classList.remove('dgb123','dga123','dgs123'))}
addEventListener('pointerdown',e=>{const h=e.target.closest&&e.target.closest('.dg123');if(!h)return;e.preventDefault();e.stopPropagation();
  const rows=dgRows123(),from=rows.indexOf(h.closest('.sr'));if(from<0)return;DG123={from,to:from,id:e.pointerId,h};
  rows[from].classList.add('dgs123');try{h.setPointerCapture(e.pointerId)}catch(x){}},true);
addEventListener('pointermove',e=>{if(!DG123||e.pointerId!==DG123.id)return;e.preventDefault();const rows=dgRows123();let to=rows.length-1;
  for(let i=0;i<rows.length;i++){const b=rows[i].getBoundingClientRect();if(e.clientY<b.top+b.height/2){to=i;break}}
  DG123.to=to;rows.forEach((r,i)=>{r.classList.toggle('dgb123',i===to&&to<DG123.from);r.classList.toggle('dga123',i===to&&to>DG123.from)})},true);
function dgEnd123(e,cancel){if(!DG123||e.pointerId!==DG123.id)return;const {from,to,h}=DG123;DG123=null;try{h.releasePointerCapture(e.pointerId)}catch(x){}dgClear123();if(!cancel&&to!==from)dgMove123(from,to)}
addEventListener('pointerup',e=>dgEnd123(e,false),true);addEventListener('pointercancel',e=>dgEnd123(e,true),true);
addEventListener('keydown',e=>{const h=e.target&&e.target.classList&&e.target.classList.contains('dg123')?e.target:null;if(!h||(e.key!=='ArrowUp'&&e.key!=='ArrowDown'))return;e.preventDefault();e.stopPropagation();
  const i=+h.dataset.dg123,to=i+(e.key==='ArrowUp'?-1:1);if(dgMove123(i,to))setTimeout(()=>{const nb=dgRows123()[to];nb&&nb.querySelector('.dg123')&&nb.querySelector('.dg123').focus()},30)},true);
// 손잡이 누르다 시트가 다시 그려지는 일 방지: 손잡이 클릭은 삼킴
addEventListener('click',e=>{if(e.target.closest&&e.target.closest('.dg123')){e.preventDefault();e.stopPropagation()}},true);

F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['↕ 순서 바꾸기 (루틴 실행·체크리스트)','루틴 ⏱ 실행 화면 → 아직 안 한 단계 이름 누르기 → ↑ 한 칸 앞·↓ 한 칸 뒤·✎ 이름 고치기 · 할 일 상세 → ☑ 체크리스트 줄 왼쪽 ⠿ 끌기','실행 중엔 오늘만 순서가 바뀌고(앞으로의 순서는 루틴 프리셋 편집), 체크리스트는 손잡이를 끌거나 키보드 ↑↓로 순서를 바꿔요.'],
  ['🧭 프리셋마다 시각·요일','할 일 → 루틴 이름 누르기 → 📅 언제 위 프리셋 줄 · 아래 ⏰ 몇 시쯤','프리셋마다 시작 시각과 자동으로 쓸 요일을 정해요. 직접 고른 날이 먼저, 그다음 일정 상황, 그다음 요일이에요.']
])}})(F67);
