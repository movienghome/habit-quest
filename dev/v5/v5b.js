/* ================= v5: 완료 · 세부 옵션 · 횟수 · 누적 페널티 ================= */
function pickVariant(a,h=nowHour()){
  const os=a&&a.opts||[];if(!os.length)return null;
  return os.find(o=>o.from!=null&&o.to!=null&&o.from!==''&&o.to!==''&&h>=+o.from&&h<+o.to)||null;
}
function badDay(k){const d=DAYS[k];return !!(d&&(d.entries||[]).some(e=>e.kind==='act'&&e.type==='bad'))}
function badMult(a,date,exceptId){
  const P0=C.penalty||{};let same=0;
  for(let i=0;i<7;i++){const d=DAYS[addDays(date,-i)];if(!d)continue;(d.entries||[]).forEach(e=>{if(e.kind==='act'&&e.aid===a.id&&e.id!==exceptId)same++})}
  let chain=0;for(let i=1;i<=14;i++){if(badDay(addDays(date,-i)))chain++;else break}
  const mult=Math.min(+P0.max||3,1+(+P0.same||0)*same+(+P0.chain||0)*chain);
  return{mult,same,chain};
}
// 행동 하나를 기록할 때의 효과 (세부 옵션·횟수·누적 배수까지)
function actEntry(a,{vid,n=1,amt,date,exceptId,mult:forced}={}){
  const good=a.type==='good',v=(a.opts||[]).find(o=>o.id===vid)||null;
  const pick=f=>(v&&v[f]!=null&&v[f]!=='')?Math.abs(+v[f]):Math.abs(+a[f]||0);
  n=Math.max(1,Math.min(20,Math.round(+n||1)));
  let xp=good?pick('xp'):0,cond=pick('cond'),gold=pick('gold');
  const pm=good?{mult:1}:(forced?{mult:forced}:badMult(a,date||curDay().date,exceptId));
  if(good&&recoveryActive())xp=Math.round(xp*C.recovery.mult);
  const e={kind:'act',aid:a.id,type:a.type,name:a.name+(v?' · '+v.name:''),area:a.area,
    cond:good?cond*n:-Math.round(cond*n*pm.mult),gold:good?gold*n:-Math.round(gold*n*pm.mult),xp:xp*n};
  if(v)e.vid=v.id;if(n>1)e.n=n;if(pm.mult>1)e.mult=+pm.mult.toFixed(2);
  if(good){Object.assign(e,marbleFromLink(a.marble));if(e.jar&&n>1)e.mn=n}
  if(amt)e.amt=Math.round(+amt);
  return e;
}
function needsSheet(a){return (a.opts&&a.opts.length)||C.ui.sheet==='always'||(a.money&&C.ui.sheet!=='never')}
function doAction(a,ctx={}){
  if(!guard())return;
  if(!ctx.direct&&needsSheet(a)){openDoneSheet({a,...ctx});return}
  const e=actEntry(a,{vid:ctx.vid,n:ctx.n,amt:ctx.amt});
  finishCtx(e,ctx,{src:'act',id:a.id});
  if(e.jar)ui.newMarble=e.jar;
  commit(()=>{applyEntry(curDay(),e)});
  afterGacha(e);
  fxPop(e.type==='good'?`+${e.xp} XP${e.jar?' · 구슬':''}`:`${e.cond} ${C.areas.find(x=>x.id===a.area)?.name||''}${e.mult?' ×'+e.mult:''}`,e.type==='good'?'var(--good)':'var(--bad)');
  buzz();snack(e,curDay().date);
}
// 타이머·가챠·메모 같은 공통 덧붙임
function finishCtx(e,ctx,src){
  if(ctx.note)e.note=ctx.note;
  if(ctx.at&&/^\d\d:\d\d$/.test(ctx.at))e.t=ctx.at;
  if(ctx.jar!==undefined){if(ctx.jar){e.jar=ctx.jar;e.mt=ctx.mt||fallbackType(ctx.jar);if((e.n||1)>1)e.mn=e.n}else{delete e.jar;delete e.mt;delete e.mn}}
  if(ctx.area&&e.cond)e.area=ctx.area;
  if(ctx.elapsed){e.dur=Math.max(1,Math.round(ctx.elapsed/60));const st=new Date(Date.now()-ctx.elapsed*1000);e.st=pad(st.getHours())+':'+pad(st.getMinutes())}
  if(ctx.spd&&e.xp>0){e.spd=ctx.spd.tier;e.xp+=ctx.spd.bonus}
  if(e.xp>0&&gachaMatch(src.src,src.id)){const m=+((C.gacha||{}).mult)||1.5;e.xp=Math.round(e.xp*m);e.gq=1}
}
/* ---- 완료 창 ---- */
let sheetCtx=null;
function openSheet(html,onClose){sheetCtx=sheetCtx||{};const sc=$('sheetC'),dock=splitOn()&&!!sheetCtx.task;
  const y=dock&&sc.parentElement===$('tDetail')?sc.scrollTop:0;
  sc.innerHTML=(dock?'':`<div class="grab"></div>`)+html;
  if(dock){if(sc.parentElement!==$('tDetail'))$('tDetail').appendChild(sc);$('sheet').hidden=true;document.body.classList.add('docked');document.body.style.overflow='';sc.scrollTop=y}
  else{if(sc.parentElement!==$('sheet'))$('sheet').appendChild(sc);document.body.classList.remove('docked');$('sheet').hidden=false;document.body.style.overflow='hidden'}
  sheetCtx.onClose=onClose;
  document.querySelectorAll('.trow.sel').forEach(x=>x.classList.remove('sel'));if(sheetCtx.task){const r=document.querySelector(`.trow[data-task="${sheetCtx.task}"]`);if(r)r.classList.add('sel')}}
function closeSheet(){const docked=document.body.classList.contains('docked');if($('sheet').hidden&&!docked)return;const f=sheetCtx&&sheetCtx.onClose;
  $('sheet').hidden=true;document.body.style.overflow='';if(docked){document.body.classList.remove('docked');$('sheet').appendChild($('sheetC'))}
  document.querySelectorAll('.trow.sel').forEach(x=>x.classList.remove('sel'));sheetCtx=null;if(f)f()}
$('sheet').addEventListener('click',e=>{if(e.target.id==='sheet')closeSheet()});
const jarSelOpts=()=>[['','구슬 없음'],...C.jars.flatMap(j=>j.types.map(t=>[j.id+':'+t.id,`${j.name} · ${SYM[t.shape]} ${t.name}`]))];
function openDoneSheet(ctx){
  // ctx: {a} 행동, {t} 할 일, {edit:{date,id}} 기록 고치기
  sheetCtx={...ctx};const S=sheetCtx;
  if(S.edit){const d=DAYS[S.edit.date],e=d&&d.entries.find(x=>x.id===S.edit.id);if(!e)return;S.e=e;
    if(e.aid)S.a=C.actions.find(x=>x.id===e.aid);if(e.tid)S.t=TASKS[e.tid];
    S.vid=e.vid;S.n=e.n||1;S.mark=e.jar?e.jar+':'+(e.mt||fallbackType(e.jar)):'';S.note=e.note||'';S.area=e.area||'';S.amt=e.amt||'';S.time=e.t;S.name=e.name}
  else{const a=S.a;if(S.elapsed&&!S.at){const st=new Date(Date.now()-S.elapsed*1000);S.at=pad(st.getHours())+':'+pad(st.getMinutes());S.atK='run'}
    S.vid=S.vid||(a&&(pickVariant(a,atHour(S.at))||{}).id)||null;S.n=S.n||1;
    S.mark=a?(a.type==='good'?(a.marble||''):''):(S.t?(S.t.marble||((listOfTask(S.t)||{}).marble)||''):'');S.note=S.note||'';S.area='';S.amt=''}
  drawDoneSheet();
}
function sheetPreview(){
  const S=sheetCtx;if(!S)return null;
  if(S.a&&(!S.e||S.e.kind==='act')){const e=actEntry(S.a,{vid:S.vid,n:S.n,amt:S.amt,date:S.e?S.edit.date:curDay().date,exceptId:S.e&&S.e.id});
    if(S.e&&S.e.spd&&e.xp>0)e.xp+=Math.max(0,(S.e.xp||0)-(actEntry(S.a,{vid:S.e.vid,n:S.e.n||1,exceptId:S.e.id}).xp||0));
    return e}
  if(S.e){const e=clone(S.e);const k=S.n/(S.e.n||1);if(k!==1){e.xp=Math.round((e.xp||0)*k);e.gold=Math.round((e.gold||0)*k);e.cond=Math.round((e.cond||0)*k)}e.n=S.n>1?S.n:undefined;return e}
  if(S.t){const b=taskBase(S.t);return{xp:b.xp*S.n,gold:b.gold*S.n,cond:b.cond*S.n,type:'good',area:areaOfTask(S.t)}}
  return null;
}
function drawDoneSheet(){
  const S=sheetCtx;if(!S)return;const a=S.a,t=S.t,e0=S.e;const good=a?a.type==='good':true;
  const title=e0?'기록 고치기':(a?a.name:t?t.title:'');
  const pv=sheetPreview()||{};const ar=C.areas.find(x=>x.id===(S.area||pv.area));
  const h=atHour(S.at);
  let html=`<div class="sh"><h3>${e0?'✎ ':''}${esc(title)}</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>`;
  const rf=(a&&a.reframe)||(t&&t.reframe);
  if(rf&&!e0)html+=`<div class="reframe"><b>💭 다르게 보기</b>${esc(rf)}</div>`;
  if(e0)html+=`<div class="f2"><label class="f">이름<input id="sxName" value="${esc(S.name)}" maxlength="80"></label><label class="f">시각<input id="sxTime" type="time" value="${esc(S.time||'')}"></label></div>`;
  if(!e0&&(a||t))html+=whenHTML(S);
  if(a&&a.opts&&a.opts.length&&(!e0||e0.kind==='act')){
    html+=`<div><div class="small muted" style="margin-bottom:4px">어떻게 했나요? <span class="tiny">(점수가 달라요${good?'':' · 덜 나쁜 쪽도 기록해 두면 흐름이 보여요'})</span></div><div class="seg">${a.opts.map(o=>{const x=actEntry(a,{vid:o.id,n:1,date:e0?S.edit.date:curDay().date,exceptId:e0&&e0.id});const isNow=o.from!=null&&o.from!==''&&h>=+o.from&&h<+o.to;
      return `<button class="optbtn ${good?'':'bad'} ${isNow&&!e0?'now':''}" data-sopt="${o.id}" aria-pressed="${S.vid===o.id}"><span>${esc(o.name)}</span><span class="sc2">${good?'+'+x.xp+' XP':x.cond+' '+(C.areas.find(z=>z.id===a.area)?.name||'')}</span>${o.from!=null&&o.from!==''?`<small>${hm(+o.from*60)}~${hm(+o.to*60)}</small>`:''}</button>`}).join('')}${good?'':''}</div></div>`;
  }
  const showN=!e0||['act','task','free','jar'].includes(e0.kind);
  html+=`<div class="f2">${showN?`<label class="f">몇 번 / 몇 개<div class="stepper sm"><button data-sn="-1" aria-label="줄이기">−</button><span class="v num">${S.n}</span><button data-sn="1" aria-label="늘리기">+</button></div></label>`:''}`;
  if(good)html+=`<label class="f">구슬<select id="sxMark">${jarSelOpts().map(([v,l])=>`<option value="${esc(v)}" ${v===S.mark?'selected':''}>${esc(l)}</option>`).join('')}</select></label>`;
  if(pv.cond||(!e0&&!a))html+=`<label class="f">컨디션 영역<select id="sxArea">${C.areas.map(x=>`<option value="${x.id}" ${x.id===(S.area||pv.area)?'selected':''}>${esc(x.name)}</option>`).join('')}</select></label>`;
  if((a&&a.money)||S.amt)html+=`<label class="f">${good?'아낀':'쓴'} 금액(원)<input id="sxAmt" type="number" inputmode="numeric" min="0" step="100" value="${esc(S.amt||'')}" placeholder="선택"></label>`;
  html+=`</div><label class="f">메모<input id="sxNote" maxlength="140" value="${esc(S.note)}" placeholder="한 줄 (선택)"></label>`;
  const pts=[];if(pv.xp)pts.push(`<span class="good">XP +${pv.xp}</span>`);if(pv.cond)pts.push(`<span class="${pv.cond>0?'good':'bad'}">${esc(ar?ar.name:'')} ${pv.cond>0?'+':'−'}${Math.abs(pv.cond)}</span>`);if(pv.gold)pts.push(`<span class="${pv.gold>0?'good':'bad'}">${gtx(pv.gold)}</span>`);
  if(S.mark&&good){const [j,tid]=S.mark.split(':');const jj=C.jars.find(x=>x.id===j);if(jj)pts.push(`<span>${mGlyph(typeOf(jj,tid))}${S.n>1?' ×'+S.n:''}</span>`)}
  if(pv.mult)pts.push(`<span class="warn">⚠ 누적 페널티 ×${pv.mult} · 최근 7일 같은 행동·나쁜 날이 이어져서 더 깎여요. 오늘 끊으면 내일 보상!</span>`);
  if(gachaMatch(t?'task':'act',t?t.id:a&&a.id)&&!e0)pts.push(`<span class="good">🎲 가챠 ×${(C.gacha||{}).mult||1.5}</span>`);
  html+=`<div class="prev" id="sxPrev">${pts.join('')||'<span class="muted">효과 없음</span>'}</div>`;
  html+=`<div class="row" style="justify-content:flex-end">`;
  if(e0)html+=`<button class="btn ghost sm" data-sheet="rm">되돌리기(지우기)</button><span style="flex:1"></span><button class="btn" data-sheet="save">저장</button>`;
  else{if(good)html+=`<button class="btn ghost" data-sheet="timer">⏱ 타이머로 하기</button>`;html+=`<button class="btn ${good?'':'bad'}" data-sheet="ok">${good?'✓ 했어요':'▼ 기록'}</button>`}
  html+=`</div>`;
  openSheet(html);
}
function sheetRead(){const S=sheetCtx;if(!S)return;
  const g=id=>{const el=$(id);return el?el.value:undefined};
  if(g('sxMark')!==undefined)S.mark=g('sxMark');if(g('sxArea')!==undefined)S.area=g('sxArea');if(g('sxNote')!==undefined)S.note=g('sxNote').trim();
  if(g('sxAmt')!==undefined)S.amt=g('sxAmt');if(g('sxName')!==undefined)S.name=g('sxName').trim();if(g('sxTime')!==undefined)S.time=g('sxTime')}
function sheetOK(){
  const S=sheetCtx;sheetRead();const [jar,mt]=(S.mark||'').split(':');
  const ctx={vid:S.vid,n:S.n,note:S.note,jar:jar||'',mt,area:S.area,amt:S.amt,direct:true,spd:S.spd,elapsed:S.elapsed,at:S.atK==='run'?null:(S.at||null)};
  closeSheet();
  if(S.a&&!S.t)doAction(S.a,ctx);else if(S.t)completeTask(S.t,ctx);
}
function sheetSave(){
  const S=sheetCtx;sheetRead();const day=DAYS[S.edit.date],old=S.e;if(!day)return;
  let neu;
  if(S.a&&old.kind==='act'){neu=actEntry(S.a,{vid:S.vid,n:S.n,amt:S.amt,date:day.date,exceptId:old.id});
    ['tid','spd','dur','st','gq','prevDue','prevStatus','prevCnt','prevSubs','late'].forEach(k=>{if(old[k]!=null)neu[k]=old[k]});
    if(old.spd||old.gq){const base=actEntry(S.a,{vid:old.vid,n:old.n||1,date:day.date,exceptId:old.id}).xp||0;const extra=(old.xp||0)-base;if(extra>0)neu.xp+=Math.round(extra*(neu.xp/(base||1)))}}
  else{neu=clone(old);const k=S.n/(old.n||1);if(k!==1&&old.kind!=='courage'){neu.xp=Math.round((old.xp||0)*k);neu.gold=Math.round((old.gold||0)*k);neu.cond=Math.round((old.cond||0)*k)}
    if(S.n>1)neu.n=S.n;else delete neu.n;if(S.amt)neu.amt=Math.round(+S.amt);else delete neu.amt}
  neu.id=old.id;neu.t=S.time||old.t;if(S.name&&!(S.a&&old.kind==='act'&&S.name===old.name))neu.name=S.name;
  if(S.note)neu.note=S.note;else delete neu.note;
  if(S.area&&neu.cond)neu.area=S.area;
  const[jar,mt]=(S.mark||'').split(':');if(neu.type!=='bad'&&old.kind!=='courage'||old.kind==='courage'){if(jar){neu.jar=jar;neu.mt=mt||fallbackType(jar);if((neu.n||1)>1)neu.mn=neu.n;else delete neu.mn}else{delete neu.jar;delete neu.mt;delete neu.mn}}
  closeSheet();replaceEntry(S.edit.date,old,neu);toast('기록을 고쳤어요');
}
function replaceEntry(date,old,neu){
  const day=DAYS[date];if(!day)return;const keep=ui.off;ui.off=Math.max(0,diffDays(dateKey(),date));
  commit(()=>{const i=day.entries.indexOf(old);effRemove(old);effApply(neu);if(i>=0)day.entries[i]=neu;else day.entries.unshift(neu)},[date]);
  ui.off=keep;render();
}
/* ---- 빠른 조정 스낵바 ---- */
let snackT=null,snackRef=null;
function snack(e,date){
  snackRef={date,id:e.id};pushUndo(date,e.id);const s=$('snack');
  const isAct=e.kind==='act'||e.kind==='task'||e.kind==='free';
  s.innerHTML=`<span class="m">✓ ${esc(e.name)}${e.xp?' · +'+e.xp+'XP':e.cond<0?' · '+e.cond:''}</span>${isAct?`<button data-snack="n2">×2</button><button data-snack="n3">×3</button>`:''}<button data-snack="edit">${e.type==='bad'?'고치기':'구슬·편집'}</button><button data-snack="undo">되돌리기</button>`;
  s.hidden=false;clearTimeout(snackT);snackT=setTimeout(()=>{s.hidden=true},6500);
}
$('snack').addEventListener('click',ev=>{const b=ev.target.closest('[data-snack]');if(!b||!snackRef)return;const{date,id}=snackRef;const day=DAYS[date],e=day&&day.entries.find(x=>x.id===id);$('snack').hidden=true;if(!e)return;
  const k=b.dataset.snack;
  if(k==='undo'){removeEntry(date,id);return}
  if(k==='edit'){openDoneSheet({edit:{date,id}});return}
  if(k==='n2'||k==='n3'){const n=k==='n2'?2:3;sheetCtx=null;openDoneSheet({edit:{date,id}});sheetCtx.n=n;sheetSave();toast(`${n}번으로 기록했어요`)}
});
/* ---- 그냥 한 일 (목록에 안 남기는 기록) ---- */
const FREE_SIZES=[['s','작은 일',5],['m','보통 일',10],['l','큰 일',20]];
function doFree(name,size,area){
  if(!guard())return;const sz=FREE_SIZES.find(x=>x[0]===size)||FREE_SIZES[1];
  let xp=sz[2];if(recoveryActive())xp=Math.round(xp*C.recovery.mult);
  const e={kind:'free',type:'good',name,area,cond:Math.round(sz[2]/3),gold:Math.round(sz[2]/4),xp};
  commit(()=>applyEntry(curDay(),e));fxPop(`+${xp} XP`,'var(--good)');buzz();snack(e,curDay().date);
}
/* ---- 나쁜 흐름 끊기 보상 ---- */
function syncChain(day){
  if(day.date!==dateKey())return;
  const y=addDays(day.date,-1);if(!DAYS[y]||!isClean(DAYS[y])||!badDay(addDays(y,-1)))return;
  if((day.entries||[]).some(e=>e.kind==='chain'))return;
  let L=0;for(let i=1;i<=14;i++){if(badDay(addDays(y,-i)))L++;else break}
  const k=Math.min(L,7),ch=C.chain||{xp:15,gold:10};
  const wj=C.jars.find(j=>j.id==='win');
  applyEntry(day,{kind:'chain',type:'good',name:`흐름 끊기: 나쁜 날 ${L}일 연쇄를 어제 끊었어요`,xp:(+ch.xp||0)*k,gold:(+ch.gold||0)*k,...(wj?{jar:'win',mt:wj.types[0].id}:{})});
  later(()=>popup('흐름을 끊었어요','⛓️‍💥',`나쁜 날 ${L}일 연쇄를 어제 끊었어요<br><b>+${(+ch.xp||0)*k} XP · ${gtx((+ch.gold||0)*k)}</b>${wj?'<br><span class="muted">이겨냈다 병에 구슬 하나</span>':''}`,'연쇄 끊기'));
}
function badChainNow(){let L=0;for(let i=0;i<=14;i++){if(badDay(addDays(dateKey(),-i)))L++;else if(i>0)break;else continue}return L}
