/* ================= v8.0: 식단표(H6) + 내일 짜기 =================
   맨 끝 모듈(w79 뒤, route();boot(); 앞).
   1) 식단표: 주간 표(점심·저녁 메뉴) → 시간표에 🍱 식사 블록이 오늘부터 7일치 자동. 블록은 날마다 끌어 옮길 수 있음.
      · 설정 C.meal80={on,l:{t,m},d:{t,m},menu:{날짜:{l,d}},no:[건너뛴 id]} (C 최상위 키라 normConfig가 보존)
      · 블록 = 진짜 할 일, id `ml80_날짜_l|d`, t.ml80=1·t.ms80(l|d)·t.md80(원래 날짜)·t.mt80(자동 시각)·dupok65
      · 목록·홈·서랍에는 안 보임(캘린더 tasksOn 안에서만). 점수 없음(completeTask 감쌈). 하루 예산(placed76·loose76)에서 빠짐.
      · 만들기·지우기는 mealEnsure80(render 앞, tOK64 뒤)만. 사용자가 블록을 지우면 C.meal80.no에 id를 넣어 다시 안 만듦. */

var AUTO80=0;
var SL80=[['l','점심'],['d','저녁']];
function ml80cfg(){let m=C.meal80;if(!m||typeof m!=='object'||Array.isArray(m))m=C.meal80={};
  if(!m.l||typeof m.l!=='object')m.l={t:'12:30',m:40};
  if(!m.d||typeof m.d!=='object')m.d={t:'18:30',m:50};
  if(!/^\d{1,2}:\d{2}$/.test(m.l.t||''))m.l.t='12:30';if(!/^\d{1,2}:\d{2}$/.test(m.d.t||''))m.d.t='18:30';
  if(!(+m.l.m>0))m.l.m=40;if(!(+m.d.m>0))m.d.m=50;
  if(!m.menu||typeof m.menu!=='object'||Array.isArray(m.menu))m.menu={};
  if(!Array.isArray(m.no))m.no=[];
  return m}
function id80(k,s){return 'ml80_'+k+'_'+s}
function menuOf80(k,s){return ((ml80cfg().menu[k]||{})[s])||''}
function title80(s,k){const m=menuOf80(k,s);return '🍱 '+(s==='l'?'점심':'저녁')+(m?' · '+m:'')}
function setMenu80(k,s,v){const c=ml80cfg();v=String(v||'').replace(/\s+/g,' ').trim().slice(0,60);
  if(v){c.menu[k]=c.menu[k]||{};c.menu[k][s]=v}else if(c.menu[k]){delete c.menu[k][s];if(!c.menu[k].l&&!c.menu[k].d)delete c.menu[k]}
  save('config')}
function hm80(s){const m=/^(\d{1,2}):(\d{2})$/.exec(s||'');return m?(+m[1])*60+(+m[2]):null}

/* ---- 블록 만들기·맞추기·지우기 ---- */
function mealEnsure80(){if(!C.meal80||typeof ready==='undefined'||!ready||!ready72()||typeof tasksReady==='undefined'||!tasksReady||!tOK64())return false;
  const c=ml80cfg(),td=midKey68(),old=addDays(td,-3);let ch=false;AUTO80=1;
  try{
    Object.values(TASKS).forEach(t=>{if(!t.ml80)return;
      // 끔 · 지난 날에 안 한 것 · 사흘 지난 것은 치움
      if(!c.on||(t.status===0&&t.due&&t.due<td)||(t.due&&t.due<old)){deleteTask(t.id);ch=true;return}
      if(t.status===0&&t.ms80&&t.md80){const want=title80(t.ms80,t.md80);if(t.title!==want){t.title=want;saveTask(t);ch=true}}
    });
    if(!c.on)return ch;
    const n=new Date(),nm=n.getHours()*60+n.getMinutes();
    for(let i=0;i<7;i++){const k=addDays(td,i);SL80.forEach(([s])=>{const id=id80(k,s);if(TASKS[id]||c.no.includes(id))return;
      const st=hm80(c[s].t);if(i===0&&st!=null&&st+(+c[s].m||40)<=nm)return;   // 오늘 그 끼니 시간이 이미 지났으면 안 만듦
      const t=newTask({title:title80(s,k),due:k,time:c[s].t,dur:+c[s].m||40});t.id=id;t.ml80=1;t.ms80=s;t.md80=k;t.mt80=c[s].t;t.dupok65=1;saveTask(t);ch=true})}
    if(c.no.some(x=>String(x).split('_')[1]<old)){c.no=c.no.filter(x=>String(x).split('_')[1]>=old);save('config')}
  }finally{AUTO80=0}
  return ch}
render=(function(prev){return function(){try{mealEnsure80()}catch(e){console.error(e)}return prev.apply(this,arguments)}})(render);
// 사용자가 블록을 지우면 그 끼니는 다시 안 만듦
deleteTask=(function(prev){return function(id){try{const t=TASKS[id];if(t&&t.ml80&&!AUTO80){const c=ml80cfg();if(!c.no.includes(id)){c.no.push(id);save('config')}}}catch(e){}return prev.apply(this,arguments)}})(deleteTask);

/* ---- 보이는 곳: 캘린더만. 점수 없음. 하루 예산에서 뺌 ---- */
taskMatches=(function(prev){return function(t,sel){if(t&&t.ml80)return false;return prev.apply(this,arguments)}})(taskMatches);
openTasks=(function(prev){return function(){const a=prev.apply(this,arguments);return CB76?a:a.filter(t=>!t.ml80)}})(openTasks);
function placed76(k){let m=0;tasksOn(k).forEach(t=>{if(t.time&&t.status===0&&!t.ml80)m+=(+t.dur||30)});return m}
function loose76(k){const a=tasksOn(k).filter(t=>!t.time&&t.status===0&&!t.cb76&&!t.ml80);return {n:a.length,m:a.reduce((s,t)=>s+(+t.dur||0),0),nd:a.filter(t=>!t.dur).length}}
completeTask=(function(prev){return function(t,ctx){
  if(t&&t.ml80){if(t.status===0){t.status=2;t.doneAt=gk76();saveTask(t);toast('🍱 '+(t.ms80==='l'?'점심':'저녁')+' 먹었어요 (점수는 없어요)')}
    else{t.status=0;delete t.doneAt;saveTask(t);toast('↶ 안 먹은 걸로 되돌렸어요')}
    render();return}
  return prev.apply(this,arguments)}})(completeTask);
openTaskSheet=(function(prev){return function(id){const t=TASKS[id];if(t&&t.ml80){mealItem80(t);return}return prev.apply(this,arguments)}})(openTaskSheet);

/* ---- 끼니 하나 창 (캘린더에서 블록을 누르면) ---- */
function mealItem80(t){const s=t.ms80||'l',k=t.md80||t.due;sheetCtx={m80i:t.id};
  openSheet(`<div class="sh"><h3>🍱 ${s==='l'?'점심':'저녁'} · ${dayName68(t.due||k)}</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <label class="small m80l">메뉴<input type="text" id="m80mi" data-m80i="menu" value="${esc(menuOf80(k,s))}" maxlength="60" placeholder="예: 김치볶음밥 · 달걀국" autocomplete="off" enterkeyhint="done"></label>
    <div class="row m80t"><label class="small">시작 <input type="time" data-m80i="time" value="${esc(t.time||'')}"></label><label class="small">길이 <input type="number" data-m80i="dur" min="10" max="240" step="5" value="${+t.dur||40}"> 분</label></div>
    <div class="row"><button type="button" class="btn" data-m80i="done">${t.status===2?'↶ 안 먹었어요':'✓ 먹었어요'}</button><button type="button" class="btn ghost" data-m80i="skip">이 끼니 건너뛰기</button><button type="button" class="btn ghost" data-m80open="${esc(k)}">🍱 식단표</button></div>
    <p class="help" style="margin:6px 0 0">끼니는 점수가 없어요. 시간표에서 끌어 옮기면 그날만 바뀌고, 평소 시간은 식단표의 ⚙에서 바꿔요.</p>`)}

/* ---- 주간 식단표 창 ---- */
function mealSheet80(k0){const c=ml80cfg();if(c.on==null){c.on=1;save('config')}
  const td=midKey68(),ws=weekStart(k0||td),days=[...Array(7)].map((_,i)=>addDays(ws,i));sheetCtx={m80:ws};
  const thisWk=weekStart(td)===ws,rows=days.map(k=>`<div class="m80r${k<td?' past':''}${k===td?' today':''}"><b class="m80d">${dayName68(k)}${k===td?'<small> 오늘</small>':''}</b>${SL80.map(([s,n])=>`<input type="text" data-m80="${k}|${s}" value="${esc(menuOf80(k,s))}" maxlength="60" placeholder="${n}" aria-label="${dayName68(k)} ${n} 메뉴" autocomplete="off" enterkeyhint="next">`).join('')}</div>`).join('');
  openSheet(`<div class="sh"><h3>🍱 식단표</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <div class="row m80n"><button type="button" class="btn ghost sm" data-m80w="-7" aria-label="지난 주">‹</button><span class="m80wk">${dayName68(ws)} ~ ${dayName68(days[6])}${thisWk?' · 이번 주':''}</span><button type="button" class="btn ghost sm" data-m80w="7" aria-label="다음 주">›</button></div>
    <div class="m80g">${rows}</div>
    <div class="row m80b"><button type="button" class="btn ghost sm" data-m80copy="1" title="지난주 같은 요일 메뉴를 빈 칸에 채워요">지난주 메뉴 가져오기</button><button type="button" class="btn ghost sm" data-m80clr="1">이 주 비우기</button></div>
    <details class="m80s"${c.on?'':' open'}><summary>⚙ 켜고 끄기 · 시간 · 길이</summary>
      <label class="row small"><input type="checkbox" data-m80c="on" ${c.on?'checked':''} style="width:auto"> 시간표에 식사 블록 자동으로 만들기 <span class="muted">(오늘부터 7일치)</span></label>
      ${SL80.map(([s,n])=>`<div class="row small m80t">${n} <input type="time" data-m80c="${s}t" value="${esc(c[s].t.padStart(5,'0'))}"> <input type="number" data-m80c="${s}m" min="10" max="240" step="5" value="${+c[s].m}"> 분</div>`).join('')}
    </details>
    <p class="help" style="margin:6px 0 0">칸에 메뉴를 적으면 시간표 🍱 블록 이름에 붙어요. 블록은 캘린더에서 끌어 옮기거나 눌러서 고치고, 지우면 그 끼니는 다시 안 만들어요. 점수 없음 · 하루 예산에서 빠져요.</p>`)}

/* ---- 입력·단추 (캡처 단계에서 가로채 시트가 다시 그려지지 않게) ---- */
addEventListener('change',e=>{const T=e.target;if(!T||!T.matches)return;
  if(T.matches('[data-m80]')){e.stopPropagation();const [k,s]=T.dataset.m80.split('|');setMenu80(k,s,T.value);mealEnsure80();render();return}
  if(T.matches('[data-m80i]')){e.stopPropagation();const t=TASKS[(sheetCtx||{}).m80i];if(!t)return;const w=T.dataset.m80i;
    if(w==='menu'){setMenu80(t.md80||t.due,t.ms80||'l',T.value);mealEnsure80()}
    else if(w==='time'){if(hm80(T.value)!=null){t.time=T.value;saveTask(t)}}
    else if(w==='dur'){const v=Math.max(10,Math.min(240,Math.round(+T.value||0)));if(v){t.dur=v;saveTask(t)}}
    render();return}
  if(T.matches('[data-m80c]')){e.stopPropagation();const c=ml80cfg(),w=T.dataset.m80c;
    if(w==='on'){c.on=T.checked?1:0;save('config');if(c.on)toast('🍱 시간표에 식사 블록을 만들어요 (오늘부터 7일)');else{mealEnsure80();toast('🍱 식사 블록을 껐어요 — 만든 블록은 지웠어요')}}
    else{const s=w[0],f=w[1];if(f==='t'){if(hm80(T.value)==null)return;const o=c[s].t;c[s].t=T.value;
        Object.values(TASKS).forEach(t=>{if(t.ml80&&t.ms80===s&&t.status===0&&t.time===t.mt80){t.time=T.value;t.mt80=T.value;saveTask(t)}else if(t.ml80&&t.ms80===s)t.mt80=T.value})}
      else{const v=Math.max(10,Math.min(240,Math.round(+T.value||0)));if(!v)return;const o=+c[s].m;c[s].m=v;
        Object.values(TASKS).forEach(t=>{if(t.ml80&&t.ms80===s&&t.status===0&&(+t.dur||0)===o){t.dur=v;saveTask(t)}})}   // 날마다 따로 바꾼 길이는 그대로
      save('config')}
    mealEnsure80();render();return}
},true);
addEventListener('keydown',e=>{const T=e.target;if(e.key!=='Enter'||e.isComposing||!T||!T.matches||!T.matches('[data-m80],[data-m80i="menu"]'))return;
  e.preventDefault();e.stopPropagation();
  const all=[...document.querySelectorAll('#sheetC [data-m80]')],i=all.indexOf(T);if(i>=0&&i<all.length-1){all[i+1].focus()}else T.blur()},true);
addEventListener('click',e=>{const T=e.target;if(!T||!T.closest)return;let b;
  if((b=T.closest('[data-m80open]'))){e.preventDefault();e.stopPropagation();closeSheet();mealSheet80(b.dataset.m80open||undefined);return}
  if((b=T.closest('[data-m80w]'))){e.preventDefault();e.stopPropagation();const ws=(sheetCtx||{}).m80;if(ws)mealSheet80(addDays(ws,+b.dataset.m80w));return}
  if((b=T.closest('[data-m80copy]'))){e.preventDefault();e.stopPropagation();const ws=(sheetCtx||{}).m80;if(!ws)return;let n=0;
    for(let i=0;i<7;i++){const k=addDays(ws,i),p=addDays(k,-7);SL80.forEach(([s])=>{if(!menuOf80(k,s)&&menuOf80(p,s)){setMenu80(k,s,menuOf80(p,s));n++}})}
    mealEnsure80();mealSheet80(ws);render();toast(n?`🍱 지난주 메뉴 ${n}칸을 가져왔어요`:'가져올 메뉴가 없어요 (지난주가 비었거나 이미 다 찼어요)');return}
  if((b=T.closest('[data-m80clr]'))){e.preventDefault();e.stopPropagation();const ws=(sheetCtx||{}).m80;if(!ws)return;
    if(!b.dataset.arm){b.dataset.arm='1';b.textContent='한 번 더 누르면 비워요';setTimeout(()=>{try{delete b.dataset.arm;b.textContent='이 주 비우기'}catch(e){}},3500);return}
    const c=ml80cfg();for(let i=0;i<7;i++)delete c.menu[addDays(ws,i)];save('config');mealEnsure80();mealSheet80(ws);render();return}
  if((b=T.closest('[data-m80i]'))&&b.tagName==='BUTTON'){e.preventDefault();e.stopPropagation();const t=TASKS[(sheetCtx||{}).m80i];if(!t)return;
    if(b.dataset.m80i==='done'){completeTask(t);closeSheet()}
    else if(b.dataset.m80i==='skip'){closeSheet();deleteTask(t.id);render();toast('🍱 이 끼니는 건너뛰었어요 (다시 만들지 않아요)')}
    return}
},true);
// 캘린더 ⋯ 설정 메뉴에 🍱 식단표
menu61=(function(prev){return function(x,y,title,items){try{if(title==='캘린더 설정'&&Array.isArray(items)&&!items.some(it=>it&&it.l==='🍱 식단표')){
    const i=items.findIndex(it=>it&&typeof it.l==='string'&&/^\? 도움말/.test(it.l));
    items.splice(i<0?items.length:i,0,{l:'🍱 식단표 (점심·저녁 블록)',f:()=>{mealSheet80((ui&&ui.calSel)||midKey68())}})}}catch(e){console.error(e)}
  return prev.call(this,x,y,title,items)}})(menu61);
// 밀프렙 할 일 상세에서 식단표 열기
drawTaskSheet=(function(prev){return function(){const r=prev.apply(this,arguments);try{
  const sc=$('sheetC'),t=TASKS[(sheetCtx||{}).task],h=$('tsTitle');
  if(sc&&t&&h&&/밀프렙|밀 프렙|식단/.test(t.title||'')&&!sc.querySelector('.m80b2')){
    h.insertAdjacentHTML('afterend',`<button type="button" class="linkbtn m80b2" data-m80open="${esc(t.due||'')}" title="주간 식단표 열기">🍱 식단표</button>`)}
}catch(e){console.error(e)}return r}})(drawTaskSheet);
// 데스크톱 캘린더 줄에 🍱 단추 (폰은 ⋯ 설정 메뉴에 있어서 숨김)
renderCal=(function(prev){return function(){const r=prev.apply(this,arguments);try{
  const bar=document.querySelector('.calbar2'),tr=$('calTrayBtn');
  if(bar&&tr){let b=$('calMealBtn');if(!b){tr.insertAdjacentHTML('afterend','<button type="button" class="ib" id="calMealBtn" title="식단표 (점심·저녁 블록)" aria-label="식단표">🍱</button>');b=$('calMealBtn')}
    const ph=$('cal62m')&&$('cal62m').offsetParent;b.hidden=!!ph}
}catch(e){console.error(e)}return r}})(renderCal);
addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('#calMealBtn');if(!b)return;e.preventDefault();e.stopPropagation();mealSheet80((ui&&ui.calSel)||midKey68())},true);

/* ================= 2) 내일 짜기 — 한 화면에서 그날 시간표 짜기 =================
   정해진 것(시각 있는 일정·🍱) 보기 → 시각 안 정한 일에 길이 적기 → '빈 시간에 넣어 보기'(미리보기) → '이대로 넣기'(되돌리기 있음).
   · 하루 시작·끝 C.plan80={s,e}(기본 09:00~22:00, C 최상위 키). 오늘이면 지금 이후부터.
   · 자동으로 넣는 건 '한 번짜리 · 시각 없음 · 관리·일퀘·루틴·루틴 단계 아님'만(반복 할 일에 시각을 넣으면 앞으로 전부 바뀌어서 제외). */
var P80=null;
function pcfg80(){let p=C.plan80;if(!p||typeof p!=='object'||Array.isArray(p))p=C.plan80={};if(hm80(p.s)==null)p.s='09:00';if(hm80(p.e)==null)p.e='22:00';return p}
function fmt80(m){return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0')}
function dayOpen80(k){return Object.values(TASKS).filter(t=>t.status===0&&!t.cb76&&t.due===k&&!t.end71&&!t.rstep)}
function fixed80(k){return dayOpen80(k).filter(t=>t.time&&hm80(t.time)!=null).sort((a,b)=>hm80(a.time)-hm80(b.time))}
function loose80(k){return dayOpen80(k).filter(t=>!t.time&&!t.ml80&&!hid76(t)).sort((a,b)=>(b.prio||0)-(a.prio||0)||(a.order||0)-(b.order||0))}
function autoOk80(t){return !t.rep&&!t.rid&&!t.parent}
function busy80(k){return fixed80(k).map(t=>{const s=hm80(t.time);return [s,s+(+t.dur||30)]})}
function fit80(k,items){const p=pcfg80();let s=hm80(p.s),e=hm80(p.e);
  if(k===midKey68()){const n=new Date(),nm=Math.ceil((n.getHours()*60+n.getMinutes())/15)*15;if(nm>s)s=nm}
  const busy=busy80(k),out=[],miss=[];
  items.forEach(t=>{const d=Math.max(10,+t.dur||30);let pos=Math.ceil(s/5)*5,placed=null;
    while(pos+d<=e){const hit=busy.find(b=>b[0]<pos+d&&b[1]>pos);if(!hit){placed=pos;break}pos=Math.ceil(hit[1]/5)*5}
    if(placed==null){miss.push(t.id);return}
    busy.push([placed,placed+d+5]);out.push({id:t.id,time:placed,dur:d})});
  out.sort((a,b)=>a.time-b.time);return {items:out,miss}}
function planSheet80(k){const td=midKey68();k=k||addDays(td,1);if(!P80||P80.k!==k)P80={k,plan:null,exc:new Set()};
  sheetCtx={p80:k};
  const fx=fixed80(k),ls=loose80(k),pl=P80.plan,pm={};if(pl)pl.items.forEach(x=>{pm[x.id]=x});
  const B=budOf76(k)*60,pm0=placed76(k),lm=ls.reduce((s,t)=>s+(+t.dur||30),0),over=pm0+lm>B;
  const lab=k===td?'오늘':k===addDays(td,1)?'내일':k===addDays(td,2)?'모레':dayName68(k);
  const cn=(typeof careDue76==='function')?careDue76(k).length:0;
  const durSel=t=>{const v=+t.dur||0,o=[10,15,20,30,45,60,90,120,180];if(v&&!o.includes(v))o.push(v);o.sort((a,b)=>a-b);return `<select data-p80d="${t.id}" aria-label="${esc(t.title)} 길이">${v?'':'<option value="" selected>길이?</option>'}${o.map(m=>`<option value="${m}"${m===v?' selected':''}>${m>=60&&m%60===0?m/60+'시간':m+'분'}</option>`).join('')}</select>`};
  const fxRows=fx.map(t=>{const s=hm80(t.time),d=+t.dur||30;return `<div class="p80f${t.ml80?' ml':''}" data-p80t="${t.id}" role="button" tabindex="0"><b>${fmt80(s)}–${fmt80(s+d)}</b><span>${esc(t.title)}</span></div>`}).join('');
  const lsRows=ls.map(t=>{const ok=autoOk80(t),x=pm[t.id],ex=P80.exc.has(t.id);
    return `<div class="p80l${x?' pv':''}${ex?' ex':''}">${ok?`<input type="checkbox" data-p80c="${t.id}" ${ex?'':'checked'} aria-label="${esc(t.title)} 자동으로 넣기" style="width:auto">`:`<span class="p80n" title="반복·묶음 할 일은 직접 놓아요">↻</span>`}<span class="p80t" data-p80t="${t.id}" role="button" tabindex="0">${(t.prio||0)>=3?'<b>!</b> ':''}${esc(t.title)}</span>${x?`<b class="p80at">→ ${fmt80(x.time)}</b>`:''}${durSel(t)}<button type="button" class="ib" data-p80mv="${t.id}" title="${dayName68(addDays(k,1))}로 옮기기" aria-label="${esc(t.title)} 다음 날로">⇥</button></div>`}).join('');
  const miss=pl?pl.miss.map(id=>TASKS[id]).filter(Boolean):[];
  openSheet(`<div class="sh"><h3>🌙 시간표 짜기 · ${esc(lab)}</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <div class="row m80n"><button type="button" class="btn ghost sm" data-p80nav="-1" aria-label="전날">‹</button><span class="m80wk">${dayName68(k)}</span><button type="button" class="btn ghost sm" data-p80nav="1" aria-label="다음 날">›</button></div>
    <div class="p80b${over?' over':''}">${over?'⚠ ':''}정해진 것 ${hmK76(pm0)} + 안 정한 것 ${hmK76(lm)} / 쓸 수 있는 시간 ${hmK76(B)}${over?' — 다 하기엔 많아요':''}</div>
    <div class="p80g">정해진 것 <small>${fx.length}</small>${C.meal80&&C.meal80.on?'':' <button type="button" class="linkbtn" data-m80open="'+esc(k)+'">🍱 식단표 켜기</button>'}</div>
    ${fxRows||'<div class="empty small">시각 있는 일정이 아직 없어요</div>'}
    <div class="p80g">시간 안 정한 일 <small>${ls.length}</small></div>
    ${lsRows||'<div class="empty small">시각 안 정한 할 일이 없어요 ✓</div>'}
    ${miss.length?`<div class="p80b over">⚠ 시간이 모자라 못 넣은 것 ${miss.length}개 — ${miss.map(t=>esc(t.title)).join(' · ')}<br><small>길이를 줄이거나 ⇥로 다음 날로 보내거나 하루 끝 시각을 늦춰요</small></div>`:''}
    <div class="row p80a">${pl?`<button type="button" class="btn" data-p80go="1">이대로 넣기 (${pl.items.length}개)</button><button type="button" class="btn ghost" data-p80x="1">취소</button>`:`<button type="button" class="btn" data-p80pv="1"${ls.some(autoOk80)?'':' disabled'}>빈 시간에 넣어 보기</button>`}</div>
    ${cn?`<div class="p80g">🧽 관리 <small>${cn}</small> <button type="button" class="linkbtn" data-p80care="${esc(k)}">차례 보기</button></div>`:''}
    <details class="m80s"><summary>⚙ 하루 시작·끝</summary><div class="row small m80t">${esc(k===td?'오늘은 지금 이후부터 · ':'')}시작 <input type="time" data-p80s="s" value="${esc(pcfg80().s)}"> 끝 <input type="time" data-p80s="e" value="${esc(pcfg80().e)}"></div></details>
    <p class="help" style="margin:6px 0 0">길이를 적어 두면 빈 시간에 중요도 순으로 차례로 넣어 봐요(5분 쉼). 미리보기에서 마음에 들면 '이대로 넣기' — 되돌리기 있어요. 반복·묶음 할 일은 시간표에서 직접 놓아요.</p>`)}
addEventListener('click',e=>{const T=e.target;if(!T||!T.closest||!(sheetCtx&&sheetCtx.p80))return;let b;
  const stop=()=>{e.preventDefault();e.stopPropagation()};
  if((b=T.closest('[data-p80nav]'))){stop();planSheet80(addDays(P80.k,+b.dataset.p80nav));return}
  if((b=T.closest('[data-p80pv]'))){stop();const items=loose80(P80.k).filter(t=>autoOk80(t)&&!P80.exc.has(t.id));P80.plan=fit80(P80.k,items);planSheet80(P80.k);return}
  if((b=T.closest('[data-p80x]'))){stop();P80.plan=null;planSheet80(P80.k);return}
  if((b=T.closest('[data-p80go]'))){stop();applyPlan80();return}
  if((b=T.closest('[data-p80mv]'))){stop();const t=TASKS[b.dataset.p80mv];if(!t)return;const k=P80.k,nd=addDays(k,1),id=t.id,od=t.due;t.due=nd;saveTask(t);P80.plan=null;render();planSheet80(k);
    toastAct(`'${t.title}' → ${dayName68(nd)}`,'되돌리기',()=>{const u=TASKS[id];if(u){u.due=od;saveTask(u);render()}},8000);return}
  if((b=T.closest('[data-p80t]'))){stop();const id=b.dataset.p80t;closeSheet();openTaskSheet(id);return}
  if((b=T.closest('[data-p80care]'))){stop();closeSheet();careSheet76(b.dataset.p80care);return}
},true);
addEventListener('change',e=>{const T=e.target;if(!T||!T.matches||!(sheetCtx&&sheetCtx.p80))return;
  if(T.matches('[data-p80c]')){e.stopPropagation();const id=T.dataset.p80c;if(T.checked)P80.exc.delete(id);else P80.exc.add(id);P80.plan=null;planSheet80(P80.k);return}
  if(T.matches('[data-p80d]')){e.stopPropagation();const t=TASKS[T.dataset.p80d],v=+T.value;if(t&&v){t.dur=v;saveTask(t)}P80.plan=null;render();planSheet80(P80.k);return}
  if(T.matches('[data-p80s]')){e.stopPropagation();if(hm80(T.value)==null)return;const p=pcfg80();p[T.dataset.p80s]=T.value;if(hm80(p.e)<=hm80(p.s)){p.s='09:00';p.e='22:00';toast('시작이 끝보다 늦어서 기본(09:00~22:00)으로 돌렸어요')}save('config');P80.plan=null;planSheet80(P80.k);return}
},true);
function applyPlan80(){const pl=P80&&P80.plan;if(!pl||!pl.items.length)return;const k=P80.k,prev=[];
  pl.items.forEach(x=>{const t=TASKS[x.id];if(!t)return;prev.push({id:t.id,time:t.time||null,dur:t.dur||null});t.time=fmt80(x.time);t.dur=x.dur;saveTask(t)});
  P80.plan=null;render();planSheet80(k);
  toastAct(`🌙 ${prev.length}개를 ${dayName68(k)} 시간표에 넣었어요`,'되돌리기',()=>{prev.forEach(p=>{const t=TASKS[p.id];if(t){t.time=p.time;t.dur=p.dur;saveTask(t)}});render();if(sheetCtx&&sheetCtx.p80)planSheet80(k)},10000)}
// 진입: 폰은 캘린더 ⋯ 설정 메뉴, 데스크톱은 캘린더 줄 🌙 단추
menu61=(function(prev){return function(x,y,title,items){try{if(title==='캘린더 설정'&&Array.isArray(items)&&!items.some(it=>it&&/^🌙 시간표 짜기/.test(it.l||''))){
    const i=items.findIndex(it=>it&&typeof it.l==='string'&&/^🍱 식단표/.test(it.l));
    items.splice(i<0?items.length:i,0,{l:'🌙 시간표 짜기 (내일)',f:()=>{planSheet80()}})}}catch(e){console.error(e)}
  return prev.call(this,x,y,title,items)}})(menu61);
renderCal=(function(prev){return function(){const r=prev.apply(this,arguments);try{
  const m=$('calMealBtn');if(m){let b=$('calPlanBtn');if(!b){m.insertAdjacentHTML('afterend','<button type="button" class="ib" id="calPlanBtn" title="시간표 짜기 (내일)" aria-label="시간표 짜기">🌙</button>');b=$('calPlanBtn')}b.hidden=m.hidden}
}catch(e){console.error(e)}return r}})(renderCal);
addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('#calPlanBtn');if(!b)return;e.preventDefault();e.stopPropagation();planSheet80()},true);
addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target&&e.target.matches&&e.target.matches('.p80f,.p80t')){e.preventDefault();const id=e.target.dataset.p80t;closeSheet();openTaskSheet(id)}});
// 기능 지도
F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['🍱 식단표','캘린더 줄 🍱 (폰은 ⋯ 설정) · 밀프렙 할 일 상세','주간 표에 점심·저녁 메뉴를 적으면 시간표에 식사 블록이 7일치 자동으로 생겨요. 끌어 옮기면 그날만 바뀌고, 점수 없음 · 하루 예산에서 빠져요',()=>{mealSheet80(midKey68())},'식단표 점심 저녁 메뉴 식사 블록 밀프렙'],
  ['🌙 시간표 짜기','캘린더 줄 🌙 (폰은 ⋯ 설정)','내일(또는 다른 날)의 정해진 것·시간 안 정한 일을 한 화면에 모아, 길이만 적으면 빈 시간에 차례로 넣어 봐요(미리보기 → 이대로 넣기 · 되돌리기)',()=>{planSheet80()},'내일 짜기 시간표 짜기 자동 배치 빈 시간 하루 예산']])}})(F67);
