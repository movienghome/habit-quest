/* ================= v7.1: 써 보고 느낀 점 한 번에 — 할 일 화면·입력·상세 · 카드 잇기 · 루틴(골라 하기·시각) · 기간 일정 · 태그 · 주 시작 요일 ================= */

/* ---- 0) 작은 도구 ---- */
function wkS71(){return (typeof C!=='undefined'&&C&&C.wk71===0)?0:1}
// 주 시작 요일 (월/일) — 선언이 뒤에 있는 게 이겨요
function weekStart(k){const d=new Date(toUTC(k)).getUTCDay(),s=wkS71();return addDays(k,-((d-s+7)%7))}
function WKH71(){return wkS71()===0?['일','월','화','수','목','금','토']:['월','화','수','목','금','토','일']}
function isRtKid71(t){return !!(t&&t.parent&&TASKS[t.parent]&&(t.rstep||TASKS[t.parent].rid))}

/* ---- 1) 정렬: 날짜 → 시간 있는 것 먼저(이른 시간부터) → 중요도 → 직접 순서 ---- */
function taskSorter(by){
  const pr=t=>-(t.prio||0),dd=t=>t.due||'9999',tm=t=>t.time||'99:99';
  if(by==='prio')return (a,b)=>pr(a)-pr(b)||(dd(a)+tm(a)).localeCompare(dd(b)+tm(b));
  if(by==='title')return (a,b)=>a.title.localeCompare(b.title,'ko');
  if(by==='manual')return (a,b)=>(a.order||0)-(b.order||0);
  if(by==='created')return (a,b)=>(b.created||'').localeCompare(a.created||'')||(b.order||0)-(a.order||0);
  return (a,b)=>dd(a).localeCompare(dd(b))||tm(a).localeCompare(tm(b))||pr(a)-pr(b)||(a.order||0)-(b.order||0);
}

/* ---- 2) 묶인 할 일: 끌어서 순서 (루틴이면 단계 순서) ---- */
function kidSort71(h){const r=h.rid&&(C.routines||[]).find(x=>x.id===h.rid);if(r)return kidSort62(h);return (a,b)=>(a.order||0)-(b.order||0)}
function nestRows(arr,opt,whole){
  const inList=new Set((whole||arr).map(t=>t.id));
  return arr.filter(t=>!(t.parent&&inList.has(t.parent)&&TASKS[t.parent]&&TASKS[t.parent].status===0)).map(t=>{
    const kids=kidsOf(t.id).filter(k=>k.status===0);let h=taskRow(t,opt);
    if(!kids.length||t.status!==0)return h;
    const shut=tShut63(t);
    return h+(shut?'':`<div class="tkids" data-drop="reorder:kids" data-grp="${t.id}">${kids.sort(kidSort71(t)).map(k=>taskRow(k,{...opt,nested:1})).join('')}</div>`);
  }).join('');
}
dndEnd=(function(prev){return function(){
  try{const drop=DND&&DND.drop,id=DND&&DND.id;
    if(drop&&drop.type==='reorder'&&drop.col==='kids'&&DND.kind==='task'){const head=TASKS[drop.grp],t=TASKS[id];dndAbort();
      if(!head||!t)return;
      if(t.parent!==head.id){if(head.rid){toast('루틴 단계는 루틴 창에서 넣어요');return}nestUnder(head,[t.id]);render();toast(`'${head.title}' 묶음에 넣었어요`);return}
      const r=head.rid&&(C.routines||[]).find(x=>x.id===head.rid);
      if(r){const st=r.steps||[],me=st.find(s=>s.tid===t.id);if(!me)return;const rest=st.filter(s=>s!==me);let i=drop.before?rest.findIndex(s=>s.tid===drop.before):rest.length;if(i<0)i=rest.length;rest.splice(i,0,me);r.steps=rest;save('config');render();return}
      const ks=kidsOf(head.id).filter(k=>k.status===0).sort((a,b)=>(a.order||0)-(b.order||0)),rest=ks.filter(k=>k!==t);let i=drop.before?rest.findIndex(k=>k.id===drop.before):rest.length;if(i<0)i=rest.length;rest.splice(i,0,t);
      const base=Math.min(...ks.map(k=>k.order||0));rest.forEach((k,j)=>{const o=base+j;if(k.order!==o){k.order=o;saveTask(k)}});render();return}}catch(e){console.error(e)}
  return prev.apply(this,arguments)}})(dndEnd);

/* ---- 3) 찾기 · 날짜 없음에서 루틴 단계 빼기 · 기간 일정 · 미룬 것/집중 안내 ---- */
function span71(t){return !!(t&&t.end71&&t.due&&t.end71>t.due)}
function spanOn71(t,k){return span71(t)&&t.due<=k&&k<=t.end71}
function spanDays71(t){if(!t.due)return [];if(!span71(t))return [t.due];const o=[];let k=t.due;for(let i=0;i<62&&k<=t.end71;i++){o.push(k);k=addDays(k,1)}return o}
function q71Match(t,q){const n=normN(q);if(!n)return true;const hay=normN([t.title,t.note,(t.tags||[]).map(x=>'#'+x).join(' '),listName(t.list||'inbox'),(t.subs||[]).map(s=>s.t||s.n||'').join(' ')].join(' '));return n.split(/\s+/).every(w=>hay.includes(w))||hay.includes(n)}
taskMatches=(function(prev){return function(t,sel){
  if(ui.tq71&&ui.tq71.trim()&&curView()==='tasks'&&sel===(C.ui.tasks||{}).sel)return t.status!==-1&&q71Match(t,ui.tq71);
  if(t&&isRtKid71(t)&&sel!=='routine'&&sel!=='done'){const h=TASKS[t.parent];return h.status===0&&prev.call(this,h,sel)}
  if(t&&t.status===0&&span71(t)){const td=dateKey();
    if(sel==='today'&&spanOn71(t,td))return true;
    if(sel==='overdue'&&t.due<td&&t.end71>=td)return false;
    if(sel==='tomorrow'&&spanOn71(t,addDays(td,1)))return true}
  if(typeof sel==='string'&&sel.startsWith('#')&&t&&t.status===0){const g=sel.slice(1);if((t.tags||[]).some(x=>x===g||x.startsWith(g+'/')))return true}
  return prev.call(this,t,sel)}})(taskMatches);
selTitle=(function(prev){return function(sel){if(ui.tq71&&ui.tq71.trim()&&curView()==='tasks')return `🔍 '${ui.tq71.trim()}'`;return prev.apply(this,arguments)}})(selTitle);
dateBucket=(function(prev){return function(t){const td=dateKey();if(t&&t.status===0&&spanOn71(t,td))return ['1','오늘'];return prev.apply(this,arguments)}})(dateBucket);
tasksOn=(function(prev){return function(k){const a=prev.apply(this,arguments),ids=new Set(a.map(t=>t.id));openTasks().forEach(t=>{if(!ids.has(t.id)&&spanOn71(t,k)&&calPass(t))a.push(t)});return a}})(tasksOn);
taskRow=(function(prev){return function(t,o){let h=prev.apply(this,arguments);try{
  if(span71(t)){const td=dateKey(),on=spanOn71(t,td);h=h.replace(/<span class="(late|tday|)">([^<]*)<\/span>/,(m,c,txt)=>`<span class="${on?'tday':c}">${esc(fmtD(t.due))}~${esc(fmtD(t.end71))}${on?' · 진행 중':''}</span>`)}
  if(t.tags&&t.tags.includes('집중')&&!/class="f71"/.test(h))h=h.replace('<span class="tt">','<span class="tt"><span class="f71" title="집중">🎯</span>');
  if(t.bsz71&&t.brave)h=h.replace(/⚔️ /,`⚔️${({s:'',m:'²',l:'³'})[t.bsz71]||''} `);
  if(t.mul71&&t.aid)h=h.replace('<span class="tx">',`<span class="tx" title="카드 점수 ×${t.mul71}">`);
  }catch(e){}return h}})(taskRow);
function tsHelp71(sel){
  if(sel==='skull')return '☠ <b>미룬 것</b> = 날짜가 지났거나 오늘인 걸 더 뒤로 미룬 할 일이에요(미룬 횟수만큼 ☠). 3번이 넘으면 삼진아웃 창이 떠서 쪼개기·10분만·내려놓기를 권해요. 오늘 끝내면 ☠는 사라져요.';
  if(sel==='focus')return '🎯 <b>집중</b> = <b>#집중</b> 태그가 붙은 할 일이에요. 넣는 법: 할 일 우클릭(폰은 꾹) → 🎯 집중에 넣기 · 할 일 상세 맨 위 🎯 · 여러 개 고르기 → 🎯 집중 · 입력할 때 #집중.';
  if(sel==='nodate')return '날짜 없는 할 일이에요. 루틴 단계는 루틴을 따라 움직여서 여기엔 안 보여요(⏱ 루틴 목록에서 펼쳐 봐요).';
  return ''}
renderTasks=(function(prev){return function(){const r=prev.apply(this,arguments);try{if(curView()!=='tasks')return r;
  const pan=$('tList')&&$('tList').parentElement;if(!pan)return r;
  let box=$('ts71');if(!box){box=document.createElement('div');box.id='ts71';box.className='tq71b';box.innerHTML=`<input id="tq71" type="search" placeholder="🔍 할 일 찾기 (이름·메모·#태그·목록)" autocomplete="off" aria-label="할 일 찾기"><button type="button" class="ib" data-tq71x="1" aria-label="찾기 지우기" title="지우기">×</button>`;const f=pan.querySelector('form.tadd');(f||$('tList')).before(box)}
  const i=$('tq71');if(i&&document.activeElement!==i&&i.value!==(ui.tq71||''))i.value=ui.tq71||'';box.classList.toggle('on',!!(ui.tq71&&ui.tq71.trim()));
  const sel=(C.ui.tasks||{}).sel||'today',hp=ui.tq71&&ui.tq71.trim()?'':tsHelp71(sel);
  if(hp&&!C.ui.collapsed['h71'+sel])$('tList').insertAdjacentHTML('afterbegin',`<p class="help h71">${hp} <button type="button" class="ib" data-h71x="${sel}" aria-label="안내 닫기" title="안내 닫기">×</button></p>`);
  }catch(e){console.error(e)}return r}})(renderTasks);
addEventListener('input',e=>{if(e.target&&e.target.id==='tq71'){ui.tq71=e.target.value;clearTimeout(ui.tq71T);ui.tq71T=setTimeout(()=>{renderTasks();const i=$('tq71');if(i&&document.activeElement!==i){i.focus();i.setSelectionRange(i.value.length,i.value.length)}},120)}});
addEventListener('keydown',e=>{if(e.target&&e.target.id==='tq71'&&e.key==='Escape'){ui.tq71='';e.target.value='';renderTasks()}});
addEventListener('click',e=>{const b=e.target.closest('[data-tq71x],[data-h71x]');if(!b)return;e.preventDefault();e.stopPropagation();
  if(b.dataset.tq71x){ui.tq71='';const i=$('tq71');if(i)i.value='';renderTasks();return}
  C.ui.collapsed['h71'+b.dataset.h71x]=1;save('config');renderTasks()},true);
// 할 일 화면에서 Ctrl+F = 찾기
addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='f'&&curView()==='tasks'&&$('tq71')){e.preventDefault();$('tq71').focus()}});

/* ---- 4) 여러 개 고르기: 날짜 더 (모레·주말·다음 주·직접) · 🎯 이름 ---- */
drawMsel=(function(prev){return function(){const r=prev.apply(this,arguments);try{const bar=$('mselBar');if(!bar||bar.querySelector('#mb71d'))return r;
  const nd=bar.querySelector('[data-mb="nodate"]');if(nd){const s=document.createElement('select');s.id='mb71d';s.setAttribute('aria-label','날짜 정하기');
    s.innerHTML=`<option value="">📅 날짜…</option><option value="d2">모레</option><option value="we">이번 주말</option><option value="nw">다음 주 월요일</option><option value="w1">일주일 뒤</option><option value="pick">직접 고르기…</option>`;nd.before(s)}
  const f=bar.querySelector('[data-mb="focus"]');if(f){f.textContent='🎯 집중';f.title='#집중 태그 붙이기'}}catch(e){}return r}})(drawMsel);
function mbDate71(v){const td=dateKey();if(v==='d2')return addDays(td,2);if(v==='we'){let d=addDays(weekStart(td),wkS71()===0?6:5);if(d<td)d=addDays(d,7);return d}if(v==='nw')return addDays(weekStart(addDays(td,7)),wkS71()===0?1:0);if(v==='w1')return addDays(td,7);return null}
function mbApply71(d){const ids=mselIds().filter(id=>TASKS[id]&&TASKS[id].status===0);if(!ids.length||!d)return;const bak=ids.map(id=>[id,TASKS[id].due,TASKS[id].skull]);const td=dateKey();
  ids.forEach(id=>{const t=TASKS[id];if(t.due&&t.due<=td&&d>t.due)t.skull=(t.skull||0)+1;if(span71(t)){const n=diffDays(t.end71,t.due);t.end71=addDays(d,n)}t.due=d;saveTask(t)});render();
  toastAct(`${ids.length}개 → ${dueLabel(d)}`,'되돌리기',()=>{bak.forEach(([id,du,sk])=>{const t=TASKS[id];if(!t)return;t.due=du;if(sk)t.skull=sk;else delete t.skull;saveTask(t)});render()})}
addEventListener('change',e=>{const s=e.target;if(!s||s.id!=='mb71d')return;e.stopPropagation();const v=s.value;s.value='';if(!v)return;
  if(v==='pick'){const r=s.getBoundingClientRect();menu61At(r.left,r.bottom+4,`<div class="m61h">📅 날짜 고르기</div><div class="m61f"><input type="date" id="mb71p" value="${dateKey()}"><button class="btn sm" data-mb71go="1">정하기</button></div>`);return}
  mbApply71(mbDate71(v))},true);
addEventListener('click',e=>{const b=e.target.closest('[data-mb71go]');if(!b)return;e.preventDefault();e.stopPropagation();const v=($('mb71p')||{}).value;closeMenu61();if(v)mbApply71(v)},true);

/* ---- 5) 🎯 집중 · 📄 복사 · 우클릭 ---- */
function focusToggle71(t){const on=(t.tags||[]).includes('집중');t.tags=on?(t.tags||[]).filter(x=>x!=='집중'):[...(t.tags||[]),'집중'];saveTask(t);render();toast(on?'🎯 집중에서 뺐어요':'🎯 집중에 넣었어요');if(sheetCtx&&sheetCtx.task===t.id&&$('tsTitle'))tsRedraw()}
function copyTask71(t,open){const c=clone(t);c.id='t'+uid()+uid().slice(0,3);c.title=t.title+' (복사)';c.status=0;c.created=dateKey();c.order=Date.now();
  ['cnt','last','doneAt','skull','hist','ttid','wc','qid','taste65','av65','pre62','dupok65','skip61'].forEach(k=>delete c[k]);
  if(c.rid){delete c.rid}if(c.rstep){delete c.rstep;delete c.parent}if(c.hab){delete c.hab;delete c.quest}
  (c.subs||[]).forEach(s=>s.done=false);saveTask(c);
  kidsOf(t.id).filter(k=>k.status===0&&!k.rstep).forEach(k=>{const kc=clone(k);kc.id='t'+uid()+uid().slice(0,3);kc.parent=c.id;kc.status=0;kc.created=dateKey();['cnt','last','doneAt','skull','hist','ttid'].forEach(x=>delete kc[x]);saveTask(kc)});
  render();toastAct(`'${c.title}' 만들었어요`,'되돌리기',()=>{kidsOf(c.id).forEach(k=>deleteTask(k.id));deleteTask(c.id);render()});if(open)setTimeout(()=>openTaskSheet(c.id),30);return c}
menu61=(function(prev){return function(x,y,title,items){try{const t=MT65;if(t&&Array.isArray(items)){items=items.slice();const i=Math.max(0,items.findIndex(it=>it&&it.l==='✎ 열기'));
  const add=[{l:'📄 복사해서 새로',f:()=>copyTask71(t,true)}];if(t.status===0&&!t.rstep)add.unshift({l:(t.tags||[]).includes('집중')?'🎯 집중에서 빼기':'🎯 집중에 넣기',f:()=>focusToggle71(t)});
  items.splice(i+1,0,...add)}}catch(e){}return prev.call(this,x,y,title,items)}})(menu61);

/* ---- 6) 자연어 더: 기간(17~20일·3일부터 9일까지) · 마감 · 'N시부터 K시간 동안' · 'N분 미만' · '주에 N번' · '다음주 토요일부터' · *구슬 · @영역 ---- */
function dtok71(tok,td,ref){tok=String(tok||'').replace(/\s+/g,'');let m;
  if(m=tok.match(/^(그저께|어제|오늘|내일|모레|글피)$/))return addDays(td,{'그저께':-2,'어제':-1,'오늘':0,'내일':1,'모레':2,'글피':3}[m[1]]);
  if(m=tok.match(/^(\d{1,2})월(\d{1,2})일?$/)||tok.match(/^(\d{1,2})\/(\d{1,2})$/)){const y=+td.slice(0,4);let c=ymd(y,+m[1],+m[2]);if(c<td&&!ref)c=ymd(y+1,+m[1],+m[2]);return c}
  if(m=tok.match(/^(\d{1,2})일?$/)){const b=ref||td;const[y,mo]=b.split('-').map(Number);let c=ymd(y,mo,+m[1]);if(c<b){const n=mo===12?[y+1,1]:[y,mo+1];c=ymd(n[0],n[1],+m[1])}return c}
  if(m=tok.match(/^(이번주|다음주|담주|다다음주)?([월화수목금토일])요일$/)){const wd=WDNAME[m[2]],ws=weekStart(td),off=(wd-wkS71()+7)%7;
    if(m[1]==='다다음주')return addDays(ws,14+off);if(m[1]&&/다음|담/.test(m[1]))return addDays(ws,7+off);let d=addDays(ws,off);if(!m[1]&&d<td)d=addDays(d,7);return d}
  return null}
const D71='(?:\\d{1,2}\\s?월\\s?\\d{1,2}\\s?일|\\d{1,2}\\/\\d{1,2}|\\d{1,2}\\s?일|그저께|어제|오늘|내일|모레|글피|(?:이번\\s?주|다음\\s?주|담주|다다음\\s?주)?\\s?[월화수목금토일]요일)';
function pre71(raw,td){
  let s=' '+String(raw).replace(/[,，.。]\s/g,' ').replace(/[,，]/g,' ')+' ';const x={};let m;
  const cut=re=>{const mm=s.match(re);if(mm){s=s.replace(mm[0],' ');return mm}return null};
  // 기간: A부터 B까지 / A~B / A-B일
  if(m=cut(new RegExp('(^|\\s)('+D71+')\\s?(?:부터|에서|~|-|–)\\s?('+D71+'|\\d{1,2})\\s?(?:까지)?(?=\\s)'))){const a=dtok71(m[2],td),b=a&&dtok71(m[3],td,a);if(a&&b&&b>=a){x.due=a;if(b>a)x.end71=b}}
  else if(m=cut(/(^|\s)(\d{1,2})\s?[~\-–]\s?(\d{1,2})\s?일(?:\s?까지)?(?=\s)/)){const a=dtok71(m[2]+'일',td),b=a&&dtok71(m[3]+'일',td,a);if(a&&b&&b>=a){x.due=a;if(b>a)x.end71=b}}
  // 마감: 'A 마감' / '마감 A'
  if(m=cut(new RegExp('(^|\\s)('+D71+')\\s?마감(?:일)?(?=\\s)'))||cut(new RegExp('(^|\\s)마감(?:일)?\\s?('+D71+')(?=\\s)'))){const d=dtok71(m[2],td);if(d)x.deadline=d}
  // N일 동안 / N일간 (시작일과 함께)
  if(m=cut(/(^|\s)(\d{1,2})\s?일\s?(?:동안|간)(?=\s)/))x.ndays=+m[2];
  // 시각부터 K시간(M분) 동안
  {const re=/(^|\s)(오전|오후|아침|낮|저녁|밤|새벽)?\s?(\d{1,2})\s?시\s?(반|(\d{1,2})\s?분)?\s?부터\s?(?:(\d+(?:\.\d)?)\s?시간)?\s?(?:(\d+)\s?분)?\s?(?:동안|간)?(?=\s)/;const mm=s.match(re);
   if(mm&&(mm[6]||mm[7])){s=s.replace(mm[0],' ');let h=+mm[3];const mi=mm[4]==='반'?30:(mm[5]?+mm[5]:0),ap=mm[2]||'';if(/오후|저녁|밤/.test(ap)&&h<12)h+=12;else if(/낮/.test(ap)&&h<7)h+=12;else if(!ap&&h>=1&&h<=7)h+=12;else if(/오전|새벽|아침/.test(ap)&&h===12)h=0;
     x.time=pad(h%24)+':'+pad(mi);x.dur=Math.round((mm[6]?+mm[6]*60:0)+(mm[7]?+mm[7]:0))}}
  // N분 미만·안에·이내·정도·쯤
  if(m=cut(/(^|\s)(\d+)\s?분\s?(미만|이내|안에|안|정도|쯤|내외)(?=\s)/)){x.dur=+m[2];if(+m[2]<=10)x.effort='quick'}
  // 주에 N번 / 일주일에 N번 → 원래 해석기 말로
  s=s.replace(/(^|\s)(?:일주일에|주에|매주)\s?(\d)\s?(번|회)(?=\s)/,' 주$2회 ');
  // '부터'·'까지' 꼬리 정리 (기간이 아닌 것): 다음주 토요일부터 → 다음주 토요일
  s=s.replace(/((?:요일|일|오늘|내일|모레|글피))부터(?=\s)/g,'$1');
  // *구슬 · @영역
  if(m=cut(/(^|\s)\*([^\s]+)/)){const q=normN(m[2]);const o=jarSelOpts().find(([v,l])=>v&&normN(l).includes(q));if(o)x.marble=o[0];else x.tagBack='*'+m[2]}
  if(m=cut(/(^|\s)@([^\s]+)/)){const q=normN(m[2]);const a=C.areas.find(z=>normN(z.name).includes(q)||normN(z.id)===q);if(a)x.area=a.id}
  return {s,x}}
parseQuick=(function(prev){return function(raw,o){
  const td=(o&&o.baseDate)||dateKey();let P;try{P=pre71(raw,td)}catch(e){console.error(e);return prev.apply(this,arguments)}
  const out=prev.call(this,P.s.trim(),o),x=P.x;
  if(x.due){out.due=x.due;if(x.end71)out.end71=x.end71}
  if(x.ndays&&x.ndays>1){out.due=out.due||td;out.end71=addDays(out.due,x.ndays-1)}
  if(x.deadline){out.deadline=x.deadline;if(!out.due&&!x.due){}}
  if(x.time){out.time=x.time;if(!out.due)out.due=td}
  if(x.dur)out.dur=x.dur;if(x.effort)out.effort=x.effort;if(x.marble)out.marble=x.marble;if(x.area)out.area=x.area;
  if(out.rep&&out.end71){out.rep={...out.rep,until:out.end71};if(out.rep.f==='x')out.due=addDays(weekStart(out.due||td),6);delete out.end71}
  out.title=String(out.title||'').replace(/\s+(마감|부터|까지|동안|간)$/,'').replace(/^(부터|까지)\s+/,'').replace(/\s{2,}/g,' ').trim();
  return out}})(parseQuick);
parseChips=(function(prev){return function(p){let h=prev.apply(this,arguments);try{
  const ex=[];if(p.end71)ex.push('↔ '+fmtD(p.due)+'~'+fmtD(p.end71));if(p.deadline)ex.push('⏳ 마감 '+dueLabel(p.deadline));if(p.marble){const o=jarSelOpts().find(z=>z[0]===p.marble);if(o)ex.push('🔮 '+o[1])}if(p.area){const a=C.areas.find(z=>z.id===p.area);if(a)ex.push('🧭 '+a.name)}
  const tl=defListFor71(p);if(!p.list&&!p.listName&&tl)ex.push('📂 '+listName(tl));
  h+=ex.map(z=>`<span>${esc(z)}</span>`).join('')}catch(e){}return h}})(parseChips);
newTask=(function(prev){return function(p){const t=prev.apply(this,arguments);['end71','bsz71','mul71','px'].forEach(k=>{if(p&&p[k]!=null&&p[k]!=='')t[k]=p[k]});return t}})(newTask);

/* ---- 7) 기본 목록 · 태그 → 목록/영역 · 추가 뒤 되돌리기 · 자세히 열어서 추가 ---- */
function defList71(){const l=C.defList71&&C.lists.find(x=>x.id===C.defList71);if(l)return l.id;if(C.defList71==='inbox')return 'inbox';const p=C.lists.find(x=>/personal/i.test(x.name));return p?p.id:'inbox'}
function tagList71(tags){const m=C.tagList71||{};for(const g of tags||[]){let k=g;while(k){if(m[k]&&C.lists.some(l=>l.id===m[k]))return m[k];const i=k.lastIndexOf('/');k=i>0?k.slice(0,i):''}}return null}
function defListFor71(p){return tagList71(p&&p.tags)||defList71()}
var ADD71=null;
addTaskFrom=(function(prev){return function(raw,o){o=o||{};let list=o.list;
  try{if(!list&&!/(^|\s)[\^~]\S/.test(raw)){const pq=parseQuick(raw);list=tagList71(pq.tags)||defList71()}}catch(e){}
  const t=prev.call(this,raw,{...o,list});
  if(t){try{if(ADD71&&ADD71.open){ADD71=null;setTimeout(()=>openTaskSheet(t.id),40);sheetNew71=t.id}
    toastAct(`'${t.title}' 추가${t.due?' · '+dueLabel(t.due)+(t.time?' '+ampm(t.time):''):''}${t.end71?'~'+fmtD(t.end71):''} · 📂 ${listName(t.list)}`,'되돌리기',()=>{deleteTask(t.id);render();toast('추가를 취소했어요')})}catch(e){}}
  return t}})(addTaskFrom);
var sheetNew71=null;
// 입력칸 옆 '⋯ 자세히' = 지금 적은 걸로 만들고 바로 상세 열기
function tadd71(){document.querySelectorAll('form.tadd .in').forEach(w=>{if(w.querySelector('[data-tadd71]'))return;const b=document.createElement('button');b.type='button';b.className='btn ghost sm';b.dataset.tadd71='1';b.title='추가하면서 자세히 정하기 (날짜·카드·점수…)';b.innerHTML='⋯<span class="l71">자세히</span>';b.setAttribute('aria-label','추가하면서 자세히');const sub=w.querySelector('button[type=submit]');(sub||w.lastChild).before(b)})}
addEventListener('click',e=>{const b=e.target.closest('[data-tadd71]');if(!b)return;e.preventDefault();e.stopPropagation();const f=b.closest('form');const i=f&&f.querySelector('input');
  if(!i||!i.value.trim()){ADD71=null;const t=addTaskFrom('새 할 일',{});if(t){sheetNew71=t.id;setTimeout(()=>{openTaskSheet(t.id);setTimeout(()=>{const x=$('tsTitle');if(x){x.focus();x.select()}},80)},40)}return}
  ADD71={open:1};f.requestSubmit?f.requestSubmit():f.dispatchEvent(new Event('submit',{cancelable:true,bubbles:true}));setTimeout(()=>{ADD71=null},400)},true);
// 상세에서 '만들기 취소' (방금 만든 것)
function tsCancel71(){const id=sheetNew71;if(!id||!TASKS[id])return;sheetNew71=null;closeSheet();deleteTask(id);render();toast('만들기를 취소했어요')}

/* ---- 8) 점수: 골드는 돈·자원일 때만 · 용기는 크기와 따로 · 카드 이은 할 일은 ×배수 ---- */
taskBase=(function(prev){return function(t){const b0=prev.apply(this,arguments);if(!t||!b0)return b0;const b={...b0};
  try{if(t.brave&&!t.aid&&!t.rid&&t.bsz71&&!t.px){const s=C.courageSizes.find(x=>x.id===t.bsz71);if(s){b.xp=+s.xp||0;b.gold=+s.gold||0;b.brave=s}}
    if(!t.aid&&!t.rid&&!t.brave&&!t.px&&C.tg71!=='all'&&areaOfTask(t)!=='money')b.gold=0;
    const m=+t.mul71||1;if(t.aid&&m!==1){b.xp=Math.round((+b.xp||0)*m);b.gold=Math.round((+b.gold||0)*m);b.cond=Math.round((+b.cond||0)*m)}}catch(e){}
  return b}})(taskBase);
applyEntry=(function(prev){return function(day,e){try{if(e&&e.tid&&e.aid&&!e.mul71){const t=TASKS[e.tid],m=t&&+t.mul71;if(m&&m!==1){e.xp=Math.round((+e.xp||0)*m);e.gold=Math.round((+e.gold||0)*m);e.cond=Math.round((+e.cond||0)*m);e.mul71=m}}}catch(x){}
  return prev.apply(this,arguments)}})(applyEntry);
function effSet71(t){return !!(t.effort||t.dur)}

/* ---- 9) 할 일 상세: 칩 정리(크기 비어 있게 · ⚔️ 용기 따로 · 🔮 구슬) · 칸 나누기 · 🎯·📄·만들기 취소 · 기간 · 카드 편집·배수 · 태그 ---- */
function tsTop71(t){
  const foc=(t.tags||[]).includes('집중');
  return `<div class="ts71top">${sheetNew71===t.id?`<button type="button" class="btn ghost sm bad" data-t71="cancel" title="방금 만든 이 할 일을 지워요">↶ 만들기 취소</button>`:''}<button type="button" class="chipbtn" data-t71="focus" aria-pressed="${foc}" title="#집중 태그">🎯 집중${foc?' ✓':''}</button><button type="button" class="chipbtn" data-t71="copy" title="같은 내용으로 새 할 일">📄 복사</button></div>`}
drawTaskSheet=(function(prev){return function(){const r=prev.apply(this,arguments);try{
  const sc=$('sheetC'),t=TASKS[(sheetCtx||{}).task];if(!sc||!t||!$('tsTitle'))return r;
  sc.classList.add('ts71');
  if(!sc.querySelector('.ts71top')){const ch=sc.querySelector('.tchips');if(ch)ch.insertAdjacentHTML('beforebegin',tsTop71(t))}
  // 칩: 크기
  const sz=sc.querySelector('.tchips [data-x56panel="size"]');
  if(sz&&!t.aid&&!t.rid){const ef=EFFORTS.find(x=>x[0]===effortOf(t))||EFFORTS[1],b=taskBase(t);
    sz.innerHTML=t.px?'✎ 직접 정한 점수':effSet71(t)?esc(ef[1]):'📏 크기';sz.classList.toggle('off',!effSet71(t)&&!t.px);sz.title='크기 = 점수(✨XP·🔋컨디션). 안 정하면 기본 점수 ✨'+b.xp}
  else if(sz&&t.aid){sz.innerHTML=`✨ 카드 점수${(+t.mul71||1)!==1?' ×'+t.mul71:''}`;sz.title='카드 점수 · 이 할 일만 배수로 더 줄 수 있어요'}
  // 칩: 용기 따로
  if(!sc.querySelector('[data-t71="brave"]')&&!t.aid&&!t.rid&&sz){const z=t.brave?(C.courageSizes.find(x=>x.id===(t.bsz71||({quick:'s',mid:'m',heavy:'l'})[effortOf(t)]))||C.courageSizes[1]):null;
    sz.insertAdjacentHTML('afterend',`<button type="button" class="tch ${t.brave?'':'off'}" data-t71="brave" title="용기가 드는 일이면 용기 점수 (크기와 따로)">⚔️ ${t.brave?esc((z&&z.name)||'용기'):'용기'}</button>`)}
  // v8.1: 카드로 이어진 할 일은 용기가 카드(a.brave)에 있음 → 칩이 없어서 어떤 할 일엔 보이고 어떤 건 안 보이던 것. 읽기 칩(누르면 카드 편집)
  if(!sc.querySelector('[data-k79="brave"],[data-t71="brave"]')&&t.aid&&sz){const ca=C.actions.find(x=>x.id===t.aid);if(ca&&ca.brave){const z=(typeof braveSize==='function')?braveSize(ca):null;
    sz.insertAdjacentHTML('afterend',`<button type="button" class="tch" data-k79="brave" data-aedit="${ca.id}" title="카드에서 정한 용기예요 · 누르면 카드 편집">⚔️ ${esc((z&&z.name)||'용기')}</button>`)}}
  // 칩: 영역 + 구슬
  const ar=sc.querySelector('.tchips [data-x56panel="area"]');if(ar&&t.marble&&!/🔮/.test(ar.innerHTML)){const o=jarSelOpts().find(z=>z[0]===t.marble);if(o)ar.insertAdjacentHTML('beforeend',` · 🔮 ${esc(String(o[1]).split('·').pop().trim())}`)}
  else if(ar&&!/구슬/.test(ar.title))ar.title='영역 · 🔮 끝내면 넣을 구슬';
  // 칩: 타이머 방식 이름
  const tm=sc.querySelector('.tchips [data-x56panel="timer"]');if(tm&&t.tmode==='flow')tm.innerHTML=tm.innerHTML.replace('시간 안에','🌊 몰입');
  // 크기 칸: 용기 버튼은 칩으로 옮겼어요 · 골드 안내
  const sp=sc.querySelector('.tpanel[data-p="size"]');if(sp&&!sp.querySelector('.g71')){sp.querySelectorAll('[data-tsbrave]').forEach(b=>b.remove());
    const b=taskBase(t);sp.insertAdjacentHTML('beforeend',`<p class="tiny muted g71">지금 받는 점수: <b>✨${b.xp}${b.gold?' 💰'+b.gold:''}${b.cond?' 🔋'+b.cond:''}</b> · 💰 골드는 <b>경제 영역</b> 할 일이나 ✎ 직접 정했을 때만 받아요(돈·자원과 상관있을 때만).${effSet71(t)?` <button type="button" class="chipbtn" data-t71="noeff">크기 비우기</button>`:''}</p>`)}
  // 날짜 칸: 끝나는 날(여러 날 일정)
  const wp=sc.querySelector('.tpanel[data-p="when"]');if(wp&&!wp.querySelector('[data-t71end]')){const dl=wp.querySelector('.duedl')||wp.firstElementChild;
    const h=`<label class="f e71">↔ 끝나는 날 <small class="muted">여러 날 이어지는 일정(촬영·여행) · 그 사이 날마다 캘린더에 떠요</small><span class="row" style="gap:6px"><input type="date" data-t71end="1" value="${esc(t.end71||'')}" ${t.due?`min="${t.due}"`:''}>${t.end71?`<button type="button" class="ib" data-t71="noend" aria-label="끝나는 날 지우기">✕</button>`:''}</span></label>`;
    if(dl)dl.insertAdjacentHTML('afterend',h);else wp.insertAdjacentHTML('afterbegin',h)}
  // 카드 칸: 카드 편집 · 배수
  const cp=sc.querySelector('.tpanel[data-p="card"]');if(cp&&t.aid&&!cp.querySelector('.m71')){const a=C.actions.find(x=>x.id===t.aid);const m=+t.mul71||1;
    if(a){const hd=cp.querySelector('.tph');(hd||cp).insertAdjacentHTML(hd?'afterend':'afterbegin',`<div class="m71">
      <div class="row" style="gap:6px;flex-wrap:wrap"><span class="small">🃏 ${esc(a.name)} 점수를 이 할 일에선</span><span class="seg">${[[1,'카드 그대로'],[1.5,'×1.5'],[2,'×2'],[3,'×3']].map(([v,l])=>`<button type="button" data-t71mul="${v}" aria-pressed="${m===v}">${l}</button>`).join('')}</span></div>
      <p class="tiny muted" style="margin:4px 0 0">같은 카드에 이은 할 일이라도 더 힘들거나 더 미루고 싶은 일이면 배수를 올려요 (예: 강의 듣기 ×1 · 배운 걸 만들어 보기 ×2). 기록은 카드에 쌓여요.</p></div>`)}}
  // 태그 칸: 붙은 태그를 칩으로 · Enter로 추가 · 관리
  const tp=sc.querySelector('.tpanel[data-p="tags"]');if(tp&&!tp.querySelector('.tg71')){const i=$('tsTags');if(i){i.placeholder='태그 적고 Enter (예: 집안일/청소)';const L=i.closest('label');if(L&&L.firstChild&&L.firstChild.nodeType===3)L.firstChild.textContent='태그 더하기 ';}
    {const hd=tp.querySelector('.tph');(hd||tp).insertAdjacentHTML(hd?'afterend':'afterbegin',`<div class="tg71"><div class="row" style="gap:4px;flex-wrap:wrap">${(t.tags||[]).map(g=>`<span class="tagx71">#${esc(g)}<button type="button" data-t71tagx="${esc(g)}" aria-label="#${esc(g)} 빼기">×</button></span>`).join('')||'<span class="tiny muted">아직 태그가 없어요</span>'}<span style="flex:1"></span><button type="button" class="btn ghost sm" data-t71="tagm">🏷 태그 관리</button></div><p class="tiny muted" style="margin:4px 0 0">아래 자주 쓰는 태그를 눌러도 붙어요. <b>상위/하위</b>는 '/'로 (예: 집안일/청소 → #집안일로도 찾아져요).</p></div>`)}}
  // 칸 이름표 (어디가 어디인지)
  const lab=(el,txt)=>{if(el&&!el.previousElementSibling?.classList?.contains('sec71'))el.insertAdjacentHTML('beforebegin',`<div class="sec71">${txt}</div>`)};
  const note=$('tsNote');if(note){note.placeholder='메모';lab(note,'📝 메모')}
  const kids=sc.querySelector('.kids56');if(kids)kids.classList.add('box71');
  const ck=[...sc.children].find(c=>/체크리스트/.test(c.textContent||'')&&!c.classList.contains('kids56')&&c.tagName==='DIV'&&!c.classList.contains('tpanels'));if(ck)ck.classList.add('box71','ck71');
  const last=sc.lastElementChild;if(last&&last.classList.contains('row'))last.classList.add('foot71');
  }catch(e){console.error(e)}return r}})(drawTaskSheet);
function bravePick71(t,x,y){menu61At(x,y,`<div class="m61h">⚔️ 용기가 드는 일인가요? <small class="muted">크기(시간)와 따로</small></div>${[['','용기 아님'],...C.courageSizes.map(z=>[z.id,`${z.name} · ✨${z.xp}${z.gold?' 💰'+z.gold:''}`])].map(([k,l])=>`<button type="button" role="menuitem" data-t71bz="${k}" aria-pressed="${(t.brave?(t.bsz71||'m'):'')===k}">${esc(l)}</button>`).join('')}`)}
addEventListener('click',e=>{const b=e.target.closest('[data-t71],[data-t71bz],[data-t71mul],[data-t71tagx]');if(!b)return;if(b.dataset.t71==='tagm'){e.preventDefault();e.stopPropagation();tagSheet71();return}const t=TASKS[(sheetCtx||{}).task]||TASKS[(MB71||{}).id];if(!t)return;e.preventDefault();e.stopPropagation();const d=b.dataset;
  try{if(typeof tsRead==='function'&&$('tsTitle'))tsRead()}catch(x){}
  if(d.t71bz!=null){closeMenu61();if(d.t71bz){t.brave=1;t.bsz71=d.t71bz}else{delete t.brave;delete t.bsz71}saveTask(t);tsRedraw();render();return}
  if(d.t71mul){const v=+d.t71mul;if(v===1)delete t.mul71;else t.mul71=v;saveTask(t);tsRedraw();render();return}
  if(d.t71tagx){t.tags=(t.tags||[]).filter(x=>x!==d.t71tagx);saveTask(t);tsRedraw();render();return}
  const k=d.t71;
  if(k==='brave'){const r=b.getBoundingClientRect();MB71={id:t.id};bravePick71(t,r.left,r.bottom+4);return}
  if(k==='focus'){focusToggle71(t);return}
  if(k==='copy'){copyTask71(t,true);return}
  if(k==='cancel'){tsCancel71();return}
  if(k==='noend'){delete t.end71;saveTask(t);tsRedraw();render();return}
  if(k==='noeff'){delete t.effort;t.dur=null;saveTask(t);tsRedraw();render();return}
  if(k==='tagm'){tagSheet71();return}},true);
var MB71=null;
addEventListener('change',e=>{const i=e.target;if(!i||!i.dataset||!i.dataset.t71end)return;const t=TASKS[(sheetCtx||{}).task];if(!t)return;e.stopPropagation();
  const v=i.value;if(!v||!t.due||v<=t.due){if(v&&!t.due){t.due=v}delete t.end71}else t.end71=v;saveTask(t);tsRedraw();render()},true);
// 태그 칸 Enter = 저장 (한글 조합 중엔 기다림)
addEventListener('keydown',e=>{if(e.target&&e.target.id==='tsTags'&&e.key==='Enter'&&!e.isComposing&&e.keyCode!==229){const box=$('acBox');if(box&&!box.hidden&&AC.items.length)return;e.preventDefault();try{tsRead();tsCommit(true,false)}catch(x){}}},true);

/* ---- 10) 루틴: 하나만 골라 하는 단계(🔀) · 건너뛰어도 되는 단계(◌) · 몇 시쯤(⏰) · 단계만 체크해도 완주 · 카드 쪽 '루틴 없음' 고침 ----
   s.g71 = 묶음 이름(같은 값끼리 '하나만'), s.opt71 = 선택. 완주 = 필수 단계 다 + 묶음마다 하나 이상. */
function stIsDone71(r,D){const day=DAYS[D];return s=>s.aid==='@weigh'?!!(day&&day.weight):stOn69(TASKS[s.tid],D)}
function rtNeed71(r,isDone){const st=(r.steps||[]).filter(s=>TASKS[s.tid]);let ok=true,miss=0;const G={};
  st.forEach(s=>{if(s.g71){(G[s.g71]=G[s.g71]||[]).push(s);return}if(s.opt71)return;if(!isDone(s)){ok=false;miss++}});
  Object.values(G).forEach(g=>{if(!g.some(isDone)){ok=false;miss++}});return{ok:st.length>0&&ok,miss,st,G}}
function rtHasPick71(r){return (r.steps||[]).some(s=>s.g71||s.opt71)}
function rtFull71(r,D,e0){const day=dayOf(D);if((day.entries||[]).some(e=>e.kind==='routine'&&e.rid===r.id&&e.full))return 0;
  let xp=+r.xp||0;if(recoveryActive())xp=Math.round(xp*C.recovery.mult);
  const e={kind:'routine',type:'good',name:r.name+' 완주',area:r.area||'life',cond:0,xp,gold:+r.gold||0,rid:r.id,full:1,note:e0||'타이머 없이 체크'};
  if(gachaMatch('routine',r.id)){e.xp=Math.round(e.xp*(C.gacha.mult||1.5));e.gq=1}
  commit(()=>applyEntry(day,e));try{afterGacha(e)}catch(x){}
  const td=dateKey(),h=rtH62(r,false);if(h){if(h.rep&&h.rep.f){if(h.due&&h.due<=D){let nx=nextDue(h.rep,h.due);while(nx&&nx<=D)nx=nextDue(h.rep,nx);if(nx)h.due=nx}}else if(D===td)h.due=null;delete h.skull;if(D>=(h.last||''))h.last=D;h.cnt=(h.cnt||0)+1;saveTask(h)}
  return e.xp}
function rtDone64(r,keepDay){
  if(!r)return;if(!keepDay)RD69=curDay().date;const D=RD69||dateKey(),isT=D===dateKey(),lbl=isT?'오늘':d69lbl(D);
  sync62(r);const head=rtH62(r,false),day=DAYS[D],isD=stIsDone71(r,D);
  const st=(r.steps||[]).filter(s=>TASKS[s.tid]),full=day&&(day.entries||[]).some(e=>e.kind==='routine'&&e.rid===r.id&&e.full);
  sheetCtx={rt64:r.id};
  const row=(s,i)=>{const t=TASKS[s.tid],w=s.aid==='@weigh',dn=isD(s),p=stPts62(s),pick=s.g71||s.opt71;
    return `<label class="d64r ${dn?'ok':''}"><input type="${s.g71?'checkbox':'checkbox'}" data-d64="${s.tid}" ${s.g71?`data-g71="${esc(s.g71)}"`:''} ${dn?'checked disabled':pick?'':'checked'}><span class="no">${dn?'✓':i+1}</span><span class="nm">${esc(stName61(s))}${s.opt71?' <small class="muted">◌ 선택</small>':''}${dn?` <small class="muted">${esc(lbl)} 함</small>`:''}</span>
      ${w&&!dn?`<input class="w64" type="number" step="0.1" min="30" max="250" inputmode="decimal" placeholder="kg" value="${day&&day.weight?day.weight:''}" aria-label="몸무게">`:''}<span class="tiny muted pt">${pts62(p,{zero:''})}</span></label>`};
  let rows='',i=0;while(i<st.length){const s=st[i];if(s.g71){const g=[];let j=i;while(j<st.length&&st[j].g71===s.g71){g.push([st[j],j]);j++}
      rows+=`<div class="g71box"><div class="g71h">🔀 하나만 골라요 <small class="muted">그날 컨디션대로</small></div>${g.map(([x,k])=>row(x,k)).join('')}</div>`;i=j}else{rows+=row(s,i);i++}}
  const need=rtNeed71(r,isD);
  openSheet(`<div class="sh"><h3>✓ ${esc(r.name)}</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>${dayRow69(D,'rd69')}
    <p class="help" style="margin:0 0 8px">한 걸 체크해요. 체크한 단계 점수가 들어가고, <b>${rtHasPick71(r)?'필수 단계를 다 하고 🔀 묶음에서 하나씩 하면':'모든 단계를 하면'} 완주 보너스</b> ${pts62({xp:r.xp,gold:r.gold},{zero:'0'})}도 받아요.${full?` <b>${esc(lbl)}은 이미 완주했어요</b>(보너스는 하루 한 번).`:''}</p>
    <div class="row" style="gap:6px;margin-bottom:6px"><button type="button" class="chipbtn" data-d64all="1">모두 체크</button><button type="button" class="chipbtn" data-d64all="0">모두 해제</button><span style="flex:1"></span><span class="tiny muted">${st.filter(isD).length}/${st.length} ${esc(lbl)} 함${need.ok?'':` · 완주까지 ${need.miss}개`}</span></div>
    <div class="d64s">${rows||'<div class="empty">단계가 없어요</div>'}</div>
    <div class="row" style="gap:6px;margin-top:10px;flex-wrap:wrap"><button class="btn go" data-d64go="${r.id}">✓ 체크한 것 기록</button>${isT?`<button class="btn ghost" data-rrun="${r.id}">⏱ 타이머로 하기</button>`:''}<span style="flex:1"></span>${head?`<button class="btn ghost sm" data-x60task="${head.id}">✎ 루틴 열기</button>`:''}</div>`)}
// 🔀 묶음 안에선 하나만 체크 (다시 누르면 풀림)
addEventListener('change',e=>{const c=e.target;if(!c||!c.dataset||!c.dataset.g71||!c.checked)return;document.querySelectorAll(`#sheetC [data-g71="${CSS.escape(c.dataset.g71)}"]`).forEach(x=>{if(x!==c&&!x.disabled)x.checked=false})},true);
function rtDoneGo64(r){
  if(!guard())return;const D=RD69||dateKey(),td=dateKey();const box=$('sheetC');let did=0,got={xp:0,gold:0};
  const sel=[...box.querySelectorAll('[data-d64]')].filter(c=>c.checked&&!c.disabled).map(c=>c.dataset.d64);
  const keep=ui.off;ui.off=Math.max(0,diffDays(td,D));
  try{
  sel.forEach(tid=>{const s=(r.steps||[]).find(x=>x.tid===tid),t=TASKS[tid];if(!s||!t)return;
    if(s.aid==='@weigh'){const v=(box.querySelector(`[data-d64="${tid}"]`).closest('.d64r').querySelector('.w64')||{}).value;if(v&&!wSave63(v,D))return;if(D>=(t.last||''))t.last=D;t.cnt=(t.cnt||0)+1;saveTask(t);did++;return}
    if(t.status!==0)return;const p=taskBase(t);got.xp+=+p.xp||0;got.gold+=+p.gold||0;const pl=t.last;
    completeTask(t,{direct:true});if(t.status===2){t.status=0;delete t.doneAt}t.last=pl&&pl>D?pl:D;saveTask(t);did++});
  const need=rtNeed71(r,stIsDone71(r,D)),all=need.ok;
  const full=(dayOf(D).entries||[]).some(e=>e.kind==='routine'&&e.rid===r.id&&e.full);
  let bonus=0;if(all&&!full)bonus=rtFull71(r,D);
  closeSheet();render();
  if(!did&&!bonus){toast('체크한 단계가 없어요');return}
  const lbl=D===td?'':d69lbl(D)+' · ';
  popup(all?'루틴 완주':'루틴 기록','✓',`<b>${esc(lbl+r.name)}</b> · ${did}단계 기록${got.xp?` · ✨${got.xp}`:''}${got.gold?` 💰${got.gold}`:''}<br>${bonus?`<b>완주 보너스 +${bonus} XP</b>`:all?'<span class="muted">이날 완주 보너스는 이미 받았어요</span>':`<span class="muted">${need.miss}개 더 하면 완주 보너스</span>`}`,all?'완주':'수고했어요')
  }finally{ui.off=keep}}
// 단계를 목록에서 하나씩 체크해도 다 되면 완주 (이 기기에서 방금 한 것만 — 두 기기가 같이 주지 않게)
var RT71=new Set();
completeTask=(function(prev){return function(t){const r=prev.apply(this,arguments);try{if(t&&t.parent&&isStep62(t)){const h=TASKS[t.parent];if(h&&h.rid)RT71.add(h.rid)}}catch(e){}return r}})(completeTask);
function rtAuto71(){if(!RT71.size||!ready||!tasksReady||(typeof SRV59!=='undefined'&&!SRV59.c))return;const D=dateKey();
  [...RT71].forEach(rid=>{if(RUN&&RUN.kind==='routine'&&RUN.id===rid)return;RT71.delete(rid);const r=(C.routines||[]).find(x=>x.id===rid);if(!r)return;if(rtNeed71(r,stIsDone71(r,D)).ok){const xp=rtFull71(r,D,'단계를 다 체크');if(xp)later(()=>toast(`🏁 '${r.name}' 완주 · 보너스 +${xp} XP`))}})}
render=(function(prev){return function(){try{rtAuto71()}catch(e){console.error(e)}try{if(!ui.aeB71&&ready){ui.aeB71=1;if(ui.aeBoard==null||ui.aeBoard===false)ui.aeBoard=C.aeBoard71!==false}}catch(e){}
  const x=prev.apply(this,arguments);try{tadd71();side71();if(curView()==='shop')shop71()}catch(e){console.error(e)}return x}})(render);
// 타이머로 시작할 때: 🔀 묶음에서 하나 고르고 ◌ 선택 단계는 할지 정하기
startRun=(function(prev){return function(o){
  try{const r=o&&o.routine&&(C.routines||[]).find(x=>x.id===o.routine.id);if(r&&!o.p71&&rtHasPick71(r)){rtPickSheet71(r,o);return}}catch(e){console.error(e)}
  return prev.apply(this,arguments)}})(startRun);
var RP71=null;
function rtPickSheet71(r,o){RP71={r,o};const st=(o.routine.steps||r.steps||[]).filter(s=>TASKS[s.tid]),seen=new Set();
  const blocks=st.map(s=>{if(s.g71){if(seen.has(s.g71))return '';seen.add(s.g71);const g=st.filter(x=>x.g71===s.g71);
      return `<div class="g71box"><div class="g71h">🔀 오늘은 어떤 걸?</div><div class="row" style="gap:6px;flex-wrap:wrap">${g.map((x,i)=>`<button type="button" class="chipbtn" data-rp71g="${esc(s.g71)}|${x.id}" aria-pressed="${i===0}">${esc(stName61(x))}</button>`).join('')}</div></div>`}
    if(s.opt71)return `<label class="d64r"><input type="checkbox" data-rp71o="${s.id}" checked><span class="nm">◌ ${esc(stName61(s))} <small class="muted">선택 · 빼도 완주</small></span></label>`;
    return `<div class="d64r ok71"><span class="nm">${esc(stName61(s))}</span><span class="tiny muted">${s.min||0}분</span></div>`}).join('');
  openSheet(`<div class="sh"><h3>⏱ ${esc(r.name)}</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div><p class="help" style="margin:0 0 8px">오늘 할 것만 골라서 시작해요. 고른 것만 하면 완주예요.</p><div class="d64s">${blocks}</div><div class="row" style="margin-top:10px"><button class="btn go" data-rp71go="1">▶ 시작</button></div>`)}
addEventListener('click',e=>{const b=e.target.closest('[data-rp71g],[data-rp71go]');if(!b||!RP71)return;e.preventDefault();e.stopPropagation();
  if(b.dataset.rp71g){const [g]=b.dataset.rp71g.split('|');document.querySelectorAll('#sheetC [data-rp71g]').forEach(x=>{if(x.dataset.rp71g.split('|')[0]===g)x.setAttribute('aria-pressed',x===b)});return}
  const {r,o}=RP71,pick=new Set([...document.querySelectorAll('#sheetC [data-rp71g][aria-pressed="true"]')].map(x=>x.dataset.rp71g.split('|')[1])),drop=new Set([...document.querySelectorAll('#sheetC [data-rp71o]')].filter(x=>!x.checked).map(x=>x.dataset.rp71o));
  const steps=(o.routine.steps||r.steps).filter(s=>s.g71?pick.has(s.id):!drop.has(s.id));RP71=null;closeSheet();startRun({...o,routine:{...o.routine,steps},p71:1})},true);
// 단계 줄: 🔀 앞 단계와 '하나만' 묶기 · ◌ 선택
stRow62=(function(prev){return function(r,s,i,o){let h=prev.apply(this,arguments);try{if(!(o&&o.edit))return h;const st=r.steps||[],pv=st[i-1];
  const g=s.g71&&pv&&pv.g71===s.g71;
  const tg=`<button class="ib t71" data-r71op="g:${r.id}:${i}" aria-pressed="${!!g}" ${i?'':'disabled'} title="앞 단계와 '하나만 골라 하기'로 묶기 (예: 피부관리 또는 음악 또는 스트레칭)">🔀</button><button class="ib t71" data-r71op="o:${r.id}:${i}" aria-pressed="${!!s.opt71}" title="건너뛰어도 완주 (선택 단계)">◌</button>`;
  h=h.replace('<span class="ops">','<span class="ops">'+tg);
  if(s.g71)h=h.replace('class="st62','class="st62 g71'+(g?' g71n':''));
  if(s.opt71)h=h.replace('<b>','<b><small class="o71">◌</small> ');
  const T=document.createElement('template');T.innerHTML=h;const row=T.content.querySelector('.st62');if(row){const c=document.createElement('span');c.className='ctl71';row.querySelectorAll(':scope>.mn,:scope>.fl70,:scope>.ops').forEach(x=>c.appendChild(x));const w=row.querySelector(':scope>.why');w?row.insertBefore(c,w):row.appendChild(c);h=T.innerHTML}
  }catch(e){}return h}})(stRow62);
addEventListener('click',e=>{const b=e.target.closest('[data-r71op]');if(!b)return;e.preventDefault();e.stopPropagation();const [k,rid,ii]=b.dataset.r71op.split(':'),r=(C.routines||[]).find(x=>x.id===rid),i=+ii;if(!r)return;const st=r.steps||[],s=st[i];if(!s)return;
  if(k==='o'){if(s.opt71)delete s.opt71;else{s.opt71=1;delete s.g71}}
  if(k==='g'){const pv=st[i-1];if(!pv)return;if(s.g71&&pv.g71===s.g71){delete s.g71;const rest=st.filter(x=>x.g71===pv.g71);if(rest.length<2)rest.forEach(x=>delete x.g71)}else{const g=pv.g71||('g'+uid().slice(0,5));pv.g71=g;s.g71=g;delete s.opt71;delete pv.opt71}}
  save('config');refresh61()},true);
// 루틴 몇 시쯤 (머리 할 일의 시각) → 목록·캘린더 순서, 홈 추천
rtCard62=(function(prev){return function(r){let h=prev.apply(this,arguments);try{const head=rtH62(r,false);if(head){
  const w=`<div class="when71"><b class="small">⏰ 몇 시쯤</b><input type="time" data-r71time="${r.id}" value="${esc(head.time||'')}" aria-label="루틴 시각">${head.time?`<button type="button" class="ib" data-r71notime="${r.id}" aria-label="시각 지우기">✕</button>`:''}<span class="tiny muted">정하면 할 일 목록·캘린더에서 시간 순서로 서고, 홈 추천은 그 시각 가까이에만 떠요</span></div>`;
  h=h.replace('<div class="st62s">',w+'<div class="st62s">')}}catch(e){}return h}})(rtCard62);
addEventListener('change',e=>{const i=e.target;if(!i||!i.dataset||!i.dataset.r71time)return;e.stopPropagation();const r=(C.routines||[]).find(x=>x.id===i.dataset.r71time),h=r&&rtH62(r,false);if(!h)return;h.time=i.value||null;saveTask(h);render();refresh61()},true);
addEventListener('click',e=>{const b=e.target.closest('[data-r71notime]');if(!b)return;e.preventDefault();e.stopPropagation();const r=(C.routines||[]).find(x=>x.id===b.dataset.r71notime),h=r&&rtH62(r,false);if(!h)return;h.time=null;saveTask(h);render();refresh61()},true);
// 카드 편집 창의 '⏱ 루틴': 들어가 있는 루틴을 단계 번호와 함께 · 넣기는 몇 번째인지 고르게
function aeRt71(a){const rs=rtOf61('a',a.id);return `<div class="small row ae71rt" style="gap:4px;flex-wrap:wrap">⏱ 루틴 ${rs.map(({r,i})=>`<button type="button" class="chipbtn" data-x60rt="${r.id}">${esc(r.name)} · ${i+1}단계</button>`).join(' ')||'<span class="muted">아직 없어요</span>'} ${(C.routines||[]).length?`<button type="button" class="btn ghost sm" data-x61join="a:${a.id}">＋ 루틴에 넣기…</button>`:''}</div>`}

/* ---- 11) 설정: 주 시작 요일 · 새 할 일 기본 목록 · 할 일 골드 ---- */
rules70HTML=(function(prev){return function(){const h=prev.apply(this,arguments),i=h.lastIndexOf('</div></div>');if(i<0)return h;
  const add=`<label>📅 한 주의 시작<select data-r71="wk"><option value="1" ${wkS71()===1?'selected':''}>월요일</option><option value="0" ${wkS71()===0?'selected':''}>일요일</option></select></label>
    <label>📂 새 할 일 기본 목록<select data-r71="defl">${C.lists.map(l=>`<option value="${l.id}" ${defList71()===l.id?'selected':''}>${esc(l.name)}</option>`).join('')}</select></label>
    <label>💰 카드 없는 할 일의 골드<select data-r71="tg"><option value="" ${C.tg71!=='all'?'selected':''}>경제 영역·직접 정한 것만 (권장)</option><option value="all" ${C.tg71==='all'?'selected':''}>모든 할 일 (예전처럼 XP의 ⅓)</option></select></label>`;
  return h.slice(0,i)+add+h.slice(i)}})(rules70HTML);
addEventListener('change',e=>{const i=e.target;if(!i||!i.dataset||!i.dataset.r71)return;e.stopPropagation();const k=i.dataset.r71,v=i.value;
  if(k==='wk'){C.wk71=+v;toast(`한 주를 ${+v===0?'일요일':'월요일'}부터 세요 · 주간 보스·돌아보기·캘린더가 따라 바뀌어요`)}
  if(k==='defl'){C.defList71=v;toast(`새 할 일은 '${listName(v)}'로 (목록을 고르고 적으면 그 목록)`)}
  if(k==='tg'){if(v)C.tg71=v;else delete C.tg71;toast(v?'할 일 골드: 예전처럼':'할 일 골드: 경제 영역·직접 정한 것만')}
  save('config');render();if(curView()==='edit')renderEdit()},true);
ls70HTML=(function(prev){return function(){const h=prev.apply(this,arguments);return `<div class="row dl71" style="gap:6px;margin:0 0 8px"><span class="small">📥 새 할 일 기본 목록</span><select data-r71="defl" style="width:auto">${C.lists.map(l=>`<option value="${l.id}" ${defList71()===l.id?'selected':''}>${esc(l.name)}</option>`).join('')}</select><span class="tiny muted">목록 안 고르고 적으면 여기로 · 📁 폴더 = 상위 목록(눌러서 한꺼번에 보기)</span></div>`+h}})(ls70HTML);

/* ---- 12) 상점 정렬 · 옆 목록(📁 폴더 = 상위 목록, 태그 = 상위/하위) ---- */
renderShop=(function(prev){return function(){const r=prev.apply(this,arguments);try{shop71()}catch(e){console.error(e)}return r}})(renderShop);
function shop71(){const L=$('shopList');if(!L)return;const so=C.shop71||'';
  if(so){const its=[...L.querySelectorAll('.item')];const pr=x=>+((x.querySelector('.price')||{}).textContent||'').replace(/[^\d]/g,'')||0;its.sort((a,b)=>so==='asc'?pr(a)-pr(b):pr(b)-pr(a)).forEach(x=>L.appendChild(x))}
  if(!$('shop71')){L.insertAdjacentHTML('beforebegin',`<div class="row" id="shop71" style="gap:6px;margin:0 0 6px"><span class="small muted">정렬</span><span class="seg">${[['','기본'],['asc','💰 싼 것부터'],['desc','💰 비싼 것부터']].map(([k,l])=>`<button type="button" data-shop71="${k}" aria-pressed="${so===k}">${l}</button>`).join('')}</span></div>`)}
  else $('shop71').querySelectorAll('[data-shop71]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.shop71===so))}
addEventListener('click',e=>{const b=e.target.closest('[data-shop71]');if(!b)return;e.preventDefault();const v=b.dataset.shop71;if(v)C.shop71=v;else delete C.shop71;save('config');render()});
function tagTree71(){const n={};openTasks().forEach(t=>(t.tags||[]).forEach(g=>{n[g]=(n[g]||0)+1;let k=g;while(k.includes('/')){k=k.slice(0,k.lastIndexOf('/'));n[k]=n[k]||0}}));return n}
function side71(){if(curView()!=='tasks')return;const S=$('tSide');if(!S||DND.on)return;const sel=(C.ui.tasks||{}).sel||'';
  S.querySelectorAll('div.fold').forEach(f=>{const m=f.textContent.match(/^📁\s(.+)$/);if(m&&!f.dataset.tsel){const b=document.createElement('button');b.className='fold f71';b.dataset.tsel='f:'+m[1];b.setAttribute('aria-pressed',sel==='f:'+m[1]);b.title='이 폴더 목록 한꺼번에 보기';b.textContent='📁 '+m[1];f.replaceWith(b)}});
  const tf=[...S.querySelectorAll('div.fold')].find(f=>f.textContent.trim()==='태그');
  if(tf&&!S.querySelector('.tg71s')){let x=tf.nextElementSibling;while(x&&x.matches('button[data-tsel^="#"]')){const n=x.nextElementSibling;x.remove();x=n}
    const n=tagTree71(),keys=Object.keys(n).sort((a,b)=>a.localeCompare(b,'ko')),cnt=k=>openTasks().filter(t=>(t.tags||[]).some(g=>g===k||g.startsWith(k+'/'))).length;
    const shown=keys.filter(k=>!k.includes('/')).sort((a,b)=>cnt(b)-cnt(a)).slice(0,16);
    const rows=[];shown.forEach(k=>{rows.push([k,0]);keys.filter(c=>c.startsWith(k+'/')).forEach(c=>rows.push([c,c.split('/').length-1]))});
    tf.innerHTML='태그 <button type="button" class="ib" data-t71="tagm" title="태그 관리 (이름·상위·영역·목록)" style="font-size:12px">🏷 관리</button>';
    tf.insertAdjacentHTML('afterend',`<div class="tg71s">${rows.map(([k,d])=>`<button data-tsel="#${esc(k)}" aria-pressed="${sel==='#'+k}" style="padding-left:${10+d*14}px">${d?'└ ':''}#${esc(d?k.split('/').pop():k)}<span class="c">${cnt(k)||''}</span></button>`).join('')}</div>`)}}

/* ---- 13) 🏷 태그 관리: 이름 바꾸기(상위/하위는 '/') · 기본 영역 · 기본 목록 · 지우기 ---- */
function tagSheet71(){sheetCtx={tg71:1};openSheet(`<div class="sh"><h3>🏷 태그 관리</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div><div id="tg71box">${tg71HTML()}</div>`)}
function tg71HTML(){const n=tagTree71(),all={};Object.values(TASKS).forEach(t=>(t.tags||[]).forEach(g=>{all[g]=1;let k=g;while(k.includes('/')){k=k.slice(0,k.lastIndexOf('/'));all[k]=1}}));Object.keys(C.tagArea||{}).forEach(g=>all[g]=1);Object.keys(C.tagList71||{}).forEach(g=>all[g]=1);
  const keys=Object.keys(all).sort((a,b)=>a.localeCompare(b,'ko'));
  return `<p class="help" style="margin:0 0 8px">태그마다 <b>기본 영역</b>(컨디션·영역 레벨이 쌓이는 곳)과 <b>기본 목록</b>(입력할 때 목록을 안 고르면 그 목록으로)을 정해요. 비워 두면 아무 데도 안 묶여요. 이름에 '/'를 넣으면 하위 태그예요 (예: 집안일/청소 — #집안일을 누르면 하위까지 보여요).</p>
  ${keys.map(g=>{const d=g.split('/').length-1;return `<div class="tg71r" style="margin-left:${d*16}px"><input data-tg71n="${esc(g)}" value="${esc(g)}" aria-label="태그 이름"><select data-tg71a="${esc(g)}" aria-label="기본 영역"><option value="">영역 —</option>${C.areas.map(a=>`<option value="${a.id}" ${(C.tagArea||{})[g]===a.id?'selected':''}>🧭 ${esc(a.name)}</option>`).join('')}</select><select data-tg71l="${esc(g)}" aria-label="기본 목록"><option value="">목록 —</option>${C.lists.map(l=>`<option value="${l.id}" ${(C.tagList71||{})[g]===l.id?'selected':''}>📂 ${esc(l.name)}</option>`).join('')}</select><span class="tiny muted">${n[g]||0}</span><button type="button" class="ib" data-tg71x="${esc(g)}" aria-label="#${esc(g)} 지우기" title="모든 할 일에서 이 태그 빼기">🗑</button></div>`}).join('')||'<div class="empty">아직 태그가 없어요</div>'}
  <form class="row" data-tg71new="1" style="gap:6px;margin-top:10px"><input id="tg71New" placeholder="새 태그 (예: 잡헌팅)" autocomplete="off"><button class="btn sm">만들기</button></form>`}
function tg71Redraw(){const b=$('tg71box');if(b){const y=$('sheetC').scrollTop;b.innerHTML=tg71HTML();$('sheetC').scrollTop=y}render()}
function tg71Rename(a,b){b=b.trim().replace(/^#/,'').replace(/\s+/g,'_');if(!b||a===b)return;let n=0;Object.values(TASKS).forEach(t=>{if(!(t.tags||[]).some(g=>g===a||g.startsWith(a+'/')))return;t.tags=[...new Set(t.tags.map(g=>g===a?b:g.startsWith(a+'/')?b+g.slice(a.length):g))];saveTask(t);n++});
  ['tagArea','tagList71'].forEach(k=>{const m=C[k];if(!m)return;Object.keys(m).forEach(g=>{if(g===a||g.startsWith(a+'/')){const nn=g===a?b:b+g.slice(a.length);m[nn]=m[g];delete m[g]}})});save('config');toast(`#${a} → #${b} (할 일 ${n}개)`)}
addEventListener('change',e=>{const i=e.target;if(!i||!i.dataset)return;const d=i.dataset;
  if(d.tg71n!=null){e.stopPropagation();tg71Rename(d.tg71n,i.value);tg71Redraw();return}
  if(d.tg71a!=null){e.stopPropagation();C.tagArea=C.tagArea||{};if(i.value)C.tagArea[d.tg71a]=i.value;else delete C.tagArea[d.tg71a];save('config');render();return}
  if(d.tg71l!=null){e.stopPropagation();C.tagList71=C.tagList71||{};if(i.value)C.tagList71[d.tg71l]=i.value;else delete C.tagList71[d.tg71l];save('config');toast(i.value?`#${d.tg71l} 할 일은 기본으로 '${listName(i.value)}'에`:'기본 목록 없음');return}},true);
addEventListener('click',e=>{const b=e.target.closest('[data-tg71x]');if(!b)return;e.preventDefault();e.stopPropagation();const g=b.dataset.tg71x;const bak=[];
  Object.values(TASKS).forEach(t=>{if((t.tags||[]).includes(g)){bak.push([t.id,t.tags.slice()]);t.tags=t.tags.filter(x=>x!==g);saveTask(t)}});if(C.tagArea)delete C.tagArea[g];if(C.tagList71)delete C.tagList71[g];save('config');tg71Redraw();
  toastAct(`#${g} 뺐어요 (${bak.length}개)`,'되돌리기',()=>{bak.forEach(([id,tg])=>{const t=TASKS[id];if(t){t.tags=tg;saveTask(t)}});tg71Redraw()})},true);
addEventListener('submit',e=>{const f=e.target;if(!f||!f.dataset||!f.dataset.tg71new)return;e.preventDefault();e.stopPropagation();const v=(($('tg71New')||{}).value||'').trim().replace(/^#/,'').replace(/\s+/g,'_');if(!v)return;C.tagList71=C.tagList71||{};if(!(v in C.tagList71))C.tagList71[v]='';save('config');tg71Redraw();toast(`#${v} 만들었어요 · 기본 영역·목록을 정해요`)},true);

/* ---- 14) 카드: 보드가 기본 · 카드 칸 눌러 편집 · 새 카드는 맨 위 · 타이머 안 씀 · 🍬 코스 설명 ---- */
addEventListener('click',e=>{const b=e.target.closest('[data-x57board]');if(!b)return;setTimeout(()=>{C.aeBoard71=!!ui.aeBoard;save('config')},0)});
addEventListener('click',e=>{const c=e.target.closest('.bchip');if(!c||c.closest('#pk61')||e.target.closest('button,input,select,a,[data-dselchip],.dck')||lpFired||DND.on)return;
  if(c.matches('[data-dselchip]'))return;const nb=c.querySelector('[data-aedit]');if(!nb)return;e.preventDefault();openActionEditor(nb.dataset.aedit)});
function dopaDesc71(){const out=dopaC().map(([k,n,d])=>`<div class="dd71r"><b>${esc(n)}</b> <span class="muted">${esc(d||'')}</span></div>`).join('');return `<details class="dd71"><summary class="tiny">🍬 코스가 뭐예요?</summary>${out}<p class="tiny muted" style="margin:4px 0 0">'지금 어때?'에서 그때 기분에 맞는 코스의 카드를 골라 줘요.</p></details>`}
function dopaOne71(sel){const c=dopaC().find(x=>x[0]===sel.value);return c?`${c[1]} — ${c[2]||''}`:'도파민 메뉴에 안 넣어요'}
openSheet=(function(prev){return function(){const r=prev.apply(this,arguments);try{const s=$('aeDopa');if(s&&!s.parentElement.querySelector('.dd71one')){s.insertAdjacentHTML('afterend',`<span class="tiny muted dd71one">${esc(dopaOne71(s))}</span>${dopaDesc71()}`)}}catch(e){}return r}})(openSheet);
addEventListener('change',e=>{if(e.target&&e.target.id==='aeDopa'){const o=e.target.parentElement.querySelector('.dd71one');if(o)o.textContent=dopaOne71(e.target)}});
speedOf=(function(prev){return function(sec,target,base,mode){if(mode==='none')return{tier:'기록',bonus:0,r:0};return prev.apply(this,arguments)}})(speedOf);

/* ---- 15) 홈: 기다리기 띠는 약속(가까운 시간 일)에만 · 추천에서 아직 먼 시간의 일 빼기 ---- */
function wait65(){const td=dateKey(),nm=nowMinutes();if(ui.w65x===td)return '';
  const nx=openTasks().filter(t=>t.due===td&&t.time&&!t.rid&&!t.rstep&&!t.hab&&!t.quest&&!t.rep&&toMin(t.time)>nm+60&&toMin(t.time)<=nm+240).sort((a,b)=>a.time.localeCompare(b.time))[0];if(!nx)return '';
  const gap=toMin(nx.time)-nm,others=openTasks().filter(t=>t.id!==nx.id&&t.due&&t.due<=td&&!t.time&&!t.rid).length;if(!others)return '';
  return `<div class="w65"><span>⏳ <b>${esc(ampm(nx.time))}</b> '${esc(nx.title)}' 전까지 ${gap>=60?Math.floor(gap/60)+'시간 ':''}${gap%60?gap%60+'분':''} 남았어요 · 그 사이에 하나 해치울까요?</span><span class="row" style="gap:4px"><button type="button" class="btn sm ghost" data-w65="pick">⚡ 짧은 것 하나</button><button type="button" class="ib" data-w65="x" aria-label="오늘은 그만 보기" title="오늘은 그만 보기">×</button></span></div>`}
suggestions=(function(prev){return function(){const out=prev.apply(this,arguments);try{const nm=nowMinutes(),td=dateKey();
  const far=t=>t&&t.time&&t.due===td&&toMin(t.time)>nm+90;
  return out.filter(o=>{const t=o.task&&TASKS[o.task];if(far(t))return false;const q=o.act&&String(o.act).startsWith('@t:')&&TASKS[String(o.act).slice(3)];if(far(q))return false;return true})}catch(e){return out}}})(suggestions);

/* ---- 16) 폰: 키보드가 올라와 높이만 바뀔 땐 화면 배치를 다시 하지 않기 (입력하다 튕기던 것) ---- */
var VW71=innerWidth;
function kbOnly71(){const ae=document.activeElement,typing=ae&&/^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName);const same=innerWidth===VW71;VW71=innerWidth;return typing&&same}
applyLog59=(function(prev){return function(){if(kbOnly71())return;return prev.apply(this,arguments)}})(applyLog59);

/* ---- 17) 기능 지도 ---- */
F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['🔍 할 일 찾기','할 일 화면 맨 위 찾기 칸 (Ctrl+F)','이름·메모·#태그·목록으로 찾기',()=>{location.hash='tasks';setTimeout(()=>{const i=$('tq71');if(i)i.focus()},200)},'검색 찾기 할일'],
  ['🎯 집중 목록','할 일 우클릭·상세 🎯·여러 개 고르기 🎯','#집중 태그가 붙은 할 일',()=>{C.ui.tasks.sel='focus';location.hash='tasks';render()},'집중 포커스'],
  ['☠ 미룬 것','할 일 → ☠ 미룬 것','지난(또는 오늘) 할 일을 더 뒤로 미룬 횟수만큼 ☠ · 3번 넘으면 삼진아웃',()=>{C.ui.tasks.sel='skull';location.hash='tasks';render()},'미룬 것 미루기 해골 삼진'],
  ['↔ 여러 날 일정','할 일 상세 📅 → 끝나는 날 · 입력 "17~20일 촬영"','그 사이 날마다 캘린더·오늘에 떠요',()=>{location.hash='tasks'},'기간 일정 여러 날 촬영 여행'],
  ['🔀 루틴 골라 하기','루틴 편집 단계 줄 🔀·◌','묶음에서 하나만 해도·선택 단계는 빼도 완주',()=>{location.hash='edit'},'루틴 선택 단계 골라'],
  ['🏷 태그 관리','할 일 왼쪽 태그 옆 🏷 · 상세 태그 칸','상위/하위 태그(/), 태그별 기본 영역·목록',()=>tagSheet71(),'태그 하위 상위 영역 목록'],
  ['📅 한 주의 시작','편집 → 규칙 → 기록·날짜','월요일 또는 일요일',()=>{location.hash='edit'},'주 시작 일요일 월요일']])}})(F67);
addEventListener('hashchange',()=>setTimeout(()=>{try{if(curView()==='shop')shop71()}catch(e){}},60));
// 나쁜 행동은 늦게 적는 일이 많아서 늘 창(📅 언제?)을 띄워요 · 좋은 행동은 바로 기록, 날짜는 아래 알림 '📅 날짜'
function needsSheet(a){return (a.opts&&a.opts.length)||C.ui.sheet==='always'||(a.money&&C.ui.sheet!=='never')||(a.type==='bad'&&C.ui.sheet!=='never')}
