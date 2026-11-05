/* ================= v5.2: 자동 완성 · 단축키 · 되돌리기 · 홈 배치 · 도파민 편집 ================= */
/* ---- 스마트 목록 순서·숨기기 ---- */
function smartList(){
  const o=Array.isArray(C.ui.smart)?C.ui.smart:[];const all=SMART.map(x=>x[0]);
  const ord=[...o.filter(x=>all.includes(x[0])),...all.filter(k=>!o.some(x=>x[0]===k)).map(k=>[k,1])];
  return ord.filter(x=>x[1]).map(x=>SMART.find(s=>s[0]===x[0]));
}
function smartOrder(){const o=Array.isArray(C.ui.smart)?C.ui.smart:[];const all=SMART.map(x=>x[0]);return [...o.filter(x=>all.includes(x[0])),...all.filter(k=>!o.some(x=>x[0]===k)).map(k=>[k,1])]}
/* ---- 태그 → 영역 ---- */
function tagArea(t){const m=C.tagArea||{};for(const g of (t.tags||[])){if(m[g]&&C.areas.some(a=>a.id===m[g]))return m[g]}return null}
/* ---- 되돌리기 ---- */
const UNDO=[];
function pushUndo(date,id){UNDO.push({date,id});if(UNDO.length>30)UNDO.shift()}
function undoLast(){
  while(UNDO.length){const u=UNDO.pop();const d=DAYS[u.date];if(d&&d.entries.some(e=>e.id===u.id)){removeEntry(u.date,u.id);return true}}
  toast('되돌릴 기록이 없어요');return false;
}
/* ---- 자동 완성 (~ ^ # ! 와 자주 쓰는 이름) ---- */
const AC_IDS=['tAdd','htAdd','calAdd','qName'];
const AC={inp:null,items:[],sel:0,from:0,to:0,whole:false};
const normN=s=>String(s||'').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
function freqNames(kind){
  const m={};const add=(n,w=1)=>{n=String(n||'').trim();if(!n||n.length>60)return;m[n]=(m[n]||0)+w};
  if(kind==='q'){C.actions.forEach(a=>add(a.name,2));C.courage.forEach(k=>add(k.name,2));
    lastNDates(90).forEach(k=>((DAYS[k]&&DAYS[k].entries)||[]).forEach(e=>{if(e.kind==='free'||e.kind==='happy')add(String(e.name).replace(/^✨ /,''));if(e.kind==='act')add((C.actions.find(a=>a.id===e.aid)||{}).name)}))}
  else{Object.values(TASKS).forEach(t=>add(t.title,1+(t.cnt||0)+((t.hist&&t.hist.n)||0)/5));C.actions.filter(a=>a.type==='good').forEach(a=>add(a.name,1));(C.routines||[]).forEach(r=>add(r.name,1))}
  return Object.entries(m).sort((a,b)=>b[1]-a[1]).map(x=>x[0]);
}
function acCompute(inp){
  const v=inp.value,pos=inp.selectionStart??v.length,before=v.slice(0,pos);
  const m=inp.id!=='qName'&&before.match(/(^|\s)([~^#!])([^\s]*)$/);
  let items=[];
  if(m){const sym=m[2],q=normN(m[3]);AC.from=pos-m[3].length-1;AC.to=pos;AC.whole=false;
    if(sym==='~'||sym==='^')items=[{id:'inbox',name:'📥 받은함'},...C.lists.filter(l=>l.id!=='inbox')].filter(l=>!q||normN(l.name).includes(q)).map(l=>({label:'📂 '+l.name+(l.folder?' · '+l.folder:''),ins:'^'+(normN(l.name)||l.name)}));
    if(sym==='#'){const tg={};Object.values(TASKS).forEach(t=>(t.tags||[]).forEach(x=>tg[x]=(tg[x]||0)+1));items=Object.entries(tg).sort((a,b)=>b[1]-a[1]).map(x=>x[0]).filter(x=>!q||normN(x).includes(q)).map(x=>({label:'#'+x,ins:'#'+x}));if(m[3]&&!items.some(i=>i.ins==='#'+m[3]))items.push({label:`새 태그 #${m[3]}`,ins:'#'+m[3]})}
    if(sym==='!')items=[['!!!','높음'],['!!','중간'],['!','낮음']].map(([s,l])=>({label:`<span class="pmark p${s.length===3?5:s.length===2?3:1}">${s}</span> ${l}`,ins:s,html:1}));
  }else if(v.trim().length>=1&&!/[~^#!]/.test(v)){
    const q=normN(v);AC.whole=true;
    items=freqNames(inp.id==='qName'?'q':'t').filter(n=>normN(n).includes(q)&&n!==v.trim()).slice(0,7).map(n=>({label:n,ins:n}));
  }
  AC.items=items.slice(0,8);AC.sel=0;AC.inp=inp;acDraw();
}
function acDraw(){
  let box=$('acBox');if(!box){box=document.createElement('div');box.id='acBox';box.className='acbox';document.body.appendChild(box)}
  if(!AC.inp||!AC.items.length||document.activeElement!==AC.inp){box.hidden=true;return}
  const r=AC.inp.getBoundingClientRect();box.style.left=Math.max(8,r.left)+'px';box.style.top=(r.bottom+4)+'px';box.style.width=Math.min(r.width,innerWidth-16)+'px';
  box.innerHTML=AC.items.map((it,i)=>`<div class="aci ${i===AC.sel?'on':''}" data-aci="${i}">${it.html?it.label:esc(it.label)}</div>`).join('')+`<div class="achint">${AC.whole?'자주 쓴 이름 · Tab/Enter로 고르기':'↑↓ 고르고 Tab/Enter'}</div>`;
  box.hidden=false;
}
function acPick(i){
  const it=AC.items[i],inp=AC.inp;if(!it||!inp)return;
  if(AC.whole)inp.value=it.ins+' ';
  else{const v=inp.value;inp.value=v.slice(0,AC.from)+it.ins+' '+v.slice(AC.to).replace(/^\s+/,'');const p=AC.from+it.ins.length+1;try{inp.setSelectionRange(p,p)}catch(e){}}
  AC.items=[];acDraw();inp.focus();inp.dispatchEvent(new Event('input',{bubbles:true}));
}
document.addEventListener('input',e=>{if(AC_IDS.includes(e.target.id))acCompute(e.target)});
document.addEventListener('focusout',e=>{if(AC_IDS.includes(e.target.id))setTimeout(()=>{if(document.activeElement!==AC.inp){AC.items=[];acDraw()}},150)});
document.addEventListener('mousedown',e=>{const it=e.target.closest('[data-aci]');if(it){e.preventDefault();acPick(+it.dataset.aci)}},true);
document.addEventListener('keydown',e=>{
  const box=$('acBox');if(!box||box.hidden||!AC.items.length||e.target!==AC.inp)return;
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();AC.sel=(AC.sel+(e.key==='ArrowDown'?1:-1)+AC.items.length)%AC.items.length;acDraw()}
  else if(e.key==='Tab'||(e.key==='Enter'&&!AC.whole)){e.preventDefault();e.stopPropagation();acPick(AC.sel)}
  else if(e.key==='Escape'){AC.items=[];acDraw()}
},true);
/* ---- 단축키 ---- */
let hoverTask=null;
document.addEventListener('mouseover',e=>{const r=e.target.closest('[data-task],[data-ctask]');hoverTask=r?(r.dataset.task||r.dataset.ctask):null});
addEventListener('keydown',e=>{
  const tg=e.target,typing=tg&&tg.matches&&tg.matches('input,textarea,select,[contenteditable]');
  const k=e.key.toLowerCase();
  // 내일로 미루기: Ctrl+Shift+R(브라우저가 막으면 Alt+R)
  if(((e.ctrlKey||e.metaKey)&&e.shiftKey&&k==='r')||(e.altKey&&!e.ctrlKey&&k==='r')){
    const id=(sheetCtx&&sheetCtx.task)||hoverTask;const t=id&&TASKS[id];if(!t)return;e.preventDefault();postpone(t,addDays(dateKey(),1));if(sheetCtx&&sheetCtx.task===id)drawTaskSheet();return}
  if((e.ctrlKey||e.metaKey)&&e.key==='Enter'&&sheetCtx&&sheetCtx.task){e.preventDefault();tsCommit(false);closeSheet();return}
  if(typing)return;
  if((e.ctrlKey||e.metaKey)&&!e.shiftKey&&k==='z'){e.preventDefault();undoLast();return}
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  if(k==='n'||k==='q'){const v=curView();const id=k==='q'?'qName':v==='tasks'?'tAdd':v==='cal'?'calAdd':'htAdd';if(k==='q'&&v!=='home')location.hash='home';setTimeout(()=>{const el=$(id);if(el){el.focus();e.preventDefault()}},k==='q'&&v!=='home'?120:0);e.preventDefault();return}
  if(k==='t'&&curView()==='cal'){ui.calAnchor=dateKey();renderCal();return}
});
/* ---- 홈 배치 편집 (홈 화면에서 바로 끌기) ---- */
function homeEditOn(on){document.body.classList.toggle('homeedit',on);ui.homeEdit=on;applyHomeEdit();toast(on?'칸을 ⋮⋮로 끌어서 옮기고, 👁로 숨겨요. 다 하면 "배치 끝"':'배치를 저장했어요')}
function applyHomeEdit(){
  document.querySelectorAll('#homeGrid>.hblock').forEach(el=>{const id=el.dataset.hid;el.dataset.rowid=id;
    let h=el.querySelector(':scope>.hedit');if(ui.homeEdit){if(!h){h=document.createElement('div');h.className='hedit';el.prepend(h)}
      const on=(C.ui.home.find(x=>x[0]===id)||[0,1])[1];h.innerHTML=`<span class="hand" data-drag="row:${id}" data-dragmode="now" aria-label="끌어서 옮기기">⋮⋮</span><b>${esc(HOME_BLOCKS[id]||id)}</b><button class="x" data-hvis="${id}" aria-label="보이기·숨기기">${on?'👁':'🚫'}</button>`;el.hidden=false;el.classList.toggle('hoff',!on)}
    else{if(h)h.remove();el.classList.remove('hoff')}});
  $('homeGrid').dataset.drop=ui.homeEdit?'reorder:home':'';
  const hb=$('homeEditBtn');if(hb)hb.textContent=ui.homeEdit?'✓ 배치 끝':'✎ 홈 배치';
}
/* ---- 도파민 메뉴 편집 (끌어다 코스에 넣기) ---- */
function dopaEditHTML(){
  const q=normN(ui.dq||'');const pool=C.actions.filter(a=>a.type==='good'&&!a.dopa&&(!q||normN(a.name).includes(q)));
  const S=ui.dsel||(ui.dsel=new Set());
  const chip=a=>`<div class="dchip ${S.has(a.id)?'on':''}" data-drag="act:${a.id}" data-dragmode="hold" data-dselchip="${a.id}" role="button" tabindex="0" aria-pressed="${S.has(a.id)}"><span><span class="dck">${S.has(a.id)?'☑':'☐'}</span> ${esc(a.name)}</span><span class="row" style="gap:4px"><span class="tiny muted">${a.dur?a.dur+'분 · ':''}+${a.xp}</span><button class="x" data-aeditchip="${a.id}" title="편집" aria-label="${esc(a.name)} 편집">✎</button></span></div>`;
  const cs=dopaC();
  return `<p class="help">항목을 <b>눌러 여러 개 고른 뒤</b> 아래 막대에서 한꺼번에 옮기거나 빼요. 끌어도 돼요(폰은 꾹 눌러 끌기, 고른 게 있으면 같이 움직여요). ✎는 습관 편집. 코스 이름·설명은 바로 고쳐 써요.</p>
  ${S.size?`<div class="bulkbar dbar"><b>☑ ${S.size}개</b><select id="dselMove" aria-label="코스로 옮기기"><option value="">코스로 옮기기…</option>${cs.map(([k,l])=>`<option value="${k}">${esc(l)}</option>`).join('')}</select><button class="btn ghost sm" data-dselact="out">메뉴에서 빼기</button><button class="btn ghost sm" data-dselact="all">이 화면 모두</button><button class="btn ghost sm" data-dselact="clear">해제</button></div>`:''}
  <div class="dedit">${cs.map(([co,nm,ds])=>`<div class="dcol" data-drop="dopa:${co}"><div class="dh"><input class="dcoin" data-dco="${co}" data-f="name" value="${esc(nm)}" aria-label="코스 이름"><input class="dcoin tiny" data-dco="${co}" data-f="desc" value="${esc(ds)}" placeholder="설명" aria-label="코스 설명"></div>${C.actions.filter(a=>a.dopa===co).map(chip).join('')||'<span class="tiny muted">여기로 끌어 놓기</span>'}<div class="row" style="gap:4px;margin-top:auto"><button class="btn sm ghost" data-dopanew="${co}">＋ 새 항목</button><span style="flex:1"></span><button class="btn sm ghost" data-dcodel="${co}" title="코스 지우기 (항목은 습관 칸으로)">코스 지우기</button></div></div>`).join('')}
    <div class="dcol add"><button class="btn ghost" data-dcoadd="1" style="margin:auto">＋ 코스 추가</button></div>
    <div class="dcol pool" data-drop="dopa:"><div class="dh"><b>▲ 습관</b><span class="tiny muted">코스에 안 들어간 좋은 습관</span></div><input id="dopaQ" type="search" placeholder="찾기" value="${esc(ui.dq||'')}" autocomplete="off">${pool.map(chip).join('')}</div></div>`;
}
/* ---- 이벤트 ---- */
document.addEventListener('click',e=>{
  if(lpFired)return;const b=e.target.closest('button,[data-aeditchip]');if(!b)return;const d=b.dataset;
  if(d.hvis){const h=C.ui.home.find(x=>x[0]===d.hvis);if(h){h[1]=h[1]?0:1;save('config');applyHome();applyHomeEdit()}return}
  if(b.id==='homeEditBtn'){homeEditOn(!ui.homeEdit);return}
  if(d.aeditchip){openActionEditor(d.aeditchip);return}
  if(d.dopanew){const id='dp'+uid();C.actions.push({id,name:'새 도파민',type:'good',area:'mind',cond:3,gold:0,xp:2,marble:'',dur:10,dopa:d.dopanew,dopaOnly:1});save('config');openActionEditor(id);return}
  if(d.undo){undoLast();return}
  if(d.tcompl){C.ui.collapsed.tcompl=!C.ui.collapsed.tcompl;save('config');renderTasks();return}
  if(d.gclear){const g=G();if(g.pending){g.hist.unshift({d:dateKey(),name:'(취소) '+g.pending.cards.map(c=>c.name).join(' / '),rr:1});g.pending=null;save('config');render();toast('뽑은 카드를 치웠어요 (골드 안 들어요)')}return}
  if(d.trayt){C.ui.cal.tray=!C.ui.cal.tray;save('config');renderCal();return}
  if(d.alltog){ui.allOpen=!ui.allOpen;renderCal();return}
  if(d.tsclr){tsRead();const t=TASKS[sheetCtx.task];if(!t)return;if(d.tsclr==='time'){t.time=null;t.dur=null}else if(d.tsclr==='due'){t.due=null;t.time=null}else if(d.tsclr==='dl'){delete t.deadline}tsCommit(true,false);return}
  if(d.tsck!=null){tsRead();const t=TASKS[sheetCtx.task];if(!t)return;t.checks=t.checks||[];if(d.tsck==='add'){const base=t.deadline||t.due||dateKey();t.checks.push({d:addDays(dateKey(),Math.max(1,Math.round(diffDays(base,dateKey())/2))),n:''})}else t.checks.splice(+d.tsck,1);tsCommit(true,false);return}
  if(d.tsdone2){const t=TASKS[sheetCtx.task];tsCommit(false);closeSheet();toast('저장했어요');return}
  if(d.tohabit){tsRead();const t=TASKS[sheetCtx.task];if(!t)return;let a=C.actions.find(x=>x.name===t.title&&x.type==='good');if(!a){a=newAction(uid(),t.title,'good',areaOfTask(t),'');a.xp=taskBase(t).xp;if(t.reframe)a.reframe=t.reframe;if(t.dur)a.dur=t.dur;C.actions.push(a);save('config')}t.aid=a.id;tsCommit(true,false);toast(`'${a.name}' 습관으로 연결했어요`);return}
  if(d.aetask){const a=C.actions.find(x=>x.id===d.aetask);if(!a)return;const t=newTask({title:a.name,aid:a.id,due:dateKey(),rep:{f:'d',i:1},dur:a.dur||null,reframe:a.reframe||undefined});saveTask(t);closeSheet();openTaskSheet(t.id);toast('반복 할 일을 만들었어요. 반복 규칙을 골라요');return}
  if(d.aeroutine){const a=C.actions.find(x=>x.id===sheetCtx.aedit),r=(C.routines||[]).find(x=>x.id===$('aeRtSel').value);if(!a||!r)return;r.steps.push({id:uid(),name:a.name,min:a.dur||5,aid:a.id});save('config');openActionEditor(a.id);toast(`'${r.name}'에 넣었어요`);return}
});
document.addEventListener('input',e=>{if(e.target.id==='dopaQ'){ui.dq=e.target.value;clearTimeout(ui.dqT);ui.dqT=setTimeout(()=>rerenderEditKeep('dopaQ'),180)}});
document.addEventListener('change',e=>{const t=e.target,d=t.dataset;
  if(d.ck!=null&&sheetCtx&&sheetCtx.task){const tk=TASKS[sheetCtx.task];if(!tk||!tk.checks)return;const c=tk.checks[+d.ck];if(!c)return;if(d.f==='d')c.d=t.value;else if(d.f==='n')c.n=t.value.trim();else if(d.f==='ok')c.ok=t.checked;saveTask(tk);render();return}
  if(d.smart!=null){const o=smartOrder();const it=o.find(x=>x[0]===d.smart);if(it)it[1]=t.checked?1:0;C.ui.smart=o;save('config');render();return}
  if(d.tagarea!=null){C.tagArea=C.tagArea||{};if(t.value)C.tagArea[d.tagarea]=t.value;else delete C.tagArea[d.tagarea];save('config');render();toast('바꿨어요');return}
  if(t.id==='aeDopa'){const a=C.actions.find(x=>x.id===sheetCtx.aedit);if(!a)return;if(t.value){a.dopa=t.value}else{delete a.dopa;delete a.dopaOnly}save('config');return}
});
/* 종일 칸 높이 끌기 */
(()=>{let on=false,sy=0,sh=0;document.addEventListener('pointerdown',e=>{const h=e.target.closest('.allrz');if(!h)return;e.preventDefault();on=true;sy=e.clientY;const a=document.querySelector('.tgall');sh=a?a.getBoundingClientRect().height:60;document.body.classList.add('dragging')},true);
  document.addEventListener('pointermove',e=>{if(!on)return;const v=clamp(Math.round(sh+e.clientY-sy),28,400);document.documentElement.style.setProperty('--allh',v+'px');C.ui.cal.allH=v},true);
  document.addEventListener('pointerup',()=>{if(!on)return;on=false;document.body.classList.remove('dragging');ui.allOpen=false;save('config')},true)})();
