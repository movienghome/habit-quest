/* ---- v9.4 (w93.js): K1 내일 짜기 — 전날 밤 한 화면에서 내일 시간표 짜기 ----
   순서(기본, C.tm93ord로 바꿈): 📌 정해진 일정 → 🔁 주 N회 자리 → 🗓 종일 칸 일 → 🧽 관리 → 마무리(놓은 시간/하루 예산 한 줄 · '내일 짜기 끝').
   · 정해진 일정 = 'fixed' 목록 전부(사용자 확정 11/13). 시각 없는 것은 시각부터 정하게 맨 먼저 보여 줌(하그둘 만남도 이 목록).
   · 열기: 밤에 정해 둔 시각(C.tm93at, 기본 21:00)이 지나면 홈 오늘 칸에 한 줄 + 캘린더 줄 🌙 / ⋯ 설정 메뉴. 끝내면 C.tm93done[날짜]=1 → 그날 밤 다시 안 뜸.
   · v9.5: 모든 단계에 같은 **내일 시간표**(블록으로 보임)를 붙임 — 일을 눌러 고르고(트레이·블록) → 시간표 빈 곳을 눌러 놓기/옮기기, 길이 ±15분·시각 입력은 선택 줄에서. 이미 정해진 일정도 같은 방식으로 시각을 바꿈. 마우스는 블록 끌기·올려 보기 지원. 되돌리기 한 단계.
   · 저장: C.tm93at · C.tm93ord · C.tm93done (모두 C 최상위 — normConfig가 보존). 예전 시간표 짜기 창(planSheet80)은 인자 없이 부르면 이 화면으로 감, 인자(날짜)가 있으면 그대로. */
{
  const KEY=()=>addDays(midKey68(),1);
  const ALL=[['fx','📌 정해진 일정'],['wk','🔁 주 N회'],['ad','🗓 종일 칸'],['care','🧽 관리']];
  let W=null;
  const done93=()=>{if(!C.tm93done||typeof C.tm93done!=='object'||Array.isArray(C.tm93done))C.tm93done={};return C.tm93done};
  const at93=()=>hm80(C.tm93at)!=null?C.tm93at:'21:00';
  const ord93=()=>{const o=Array.isArray(C.tm93ord)?C.tm93ord.filter(x=>ALL.some(a=>a[0]===x)):[];ALL.forEach(a=>{if(!o.includes(a[0]))o.push(a[0])});return o};
  const byTime=(a,b)=>hm80(a.time)-hm80(b.time);

  /* ---- 단계별 내용 ---- */
  function fx93(k){
    const open=Object.values(TASKS).filter(t=>t.status===0&&!t.cb76&&!t.ml80&&!t.rstep&&t.due===k&&!t.end71&&!hid76(t));
    const nt=open.filter(t=>t.list==='fixed'&&!t.time);
    const timed=tasksOn(k).filter(t=>t.status===0&&t.time&&hm80(t.time)!=null&&!t.cb76).sort(byTime);
    return {nt,timed};
  }
  function wk93(k){
    const ws=weekStart(k);
    return openTasks().filter(t=>wx91(t)&&calPass(t)&&!hid76(t)).map(t=>({t,n:wkCnt91(t,ws),N:+t.rep.n||3,ks:slotKeys91(t,ws),on:!!(t.sl91&&t.sl91[k]!==undefined)}))
      .filter(x=>x.n<x.N||x.on).sort((a,b)=>(b.t.prio||0)-(a.t.prio||0));
  }
  function ad93(k){
    return tasksOn(k).filter(t=>t.status===0&&!t.time&&!t.cb76&&!t.ml80&&!t.rstep&&!hid76(t)&&!wx91(t)&&!t.rid)
      .sort((a,b)=>(b.prio||0)-(a.prio||0)||(a.order||0)-(b.order||0));
  }
  const care93=k=>(typeof careDue76==='function'?careDue76(k):[]);
  const cnt93=(id,k)=>id==='fx'?(fx93(k).nt.length+fx93(k).timed.length):id==='wk'?wk93(k).length:id==='ad'?ad93(k).length:care93(k).length;

  /* ---- 빈 시간 찾기(주 N회 자리·종일 칸 일도 피함) ---- */
  function busy93(k,skipIds){const sk=new Set(skipIds||[]);return tasksOn(k).filter(t=>!sk.has(t.id)&&t.status===0&&t.time&&hm80(t.time)!=null).map(t=>{const s=hm80(t.time);return [s,s+(+t.dur||30)]})}
  function free93(k,d,busy){
    const p=pcfg80();let pos=Math.ceil(hm80(p.s)/5)*5;const e=hm80(p.e);
    if(k===midKey68()){const n=new Date(),nm=Math.ceil((n.getHours()*60+n.getMinutes())/15)*15;if(nm>pos)pos=nm}
    while(pos+d<=e){const hit=busy.find(b=>b[0]<pos+d&&b[1]>pos);if(!hit)return pos;pos=Math.ceil(hit[1]/5)*5}
    return null;
  }
  const durOpt=t=>{const v=+t.dur||0,o=[10,15,20,30,45,60,90,120,180];if(v&&!o.includes(v))o.push(v);o.sort((a,b)=>a-b);
    return `<select data-w93d="${t.id}" aria-label="${esc(t.title)} 길이">${v?'':'<option value="" selected>길이?</option>'}${o.map(m=>`<option value="${m}"${m===v?' selected':''}>${m>=60&&m%60===0?m/60+'시간':m+'분'}</option>`).join('')}</select>`};
  const nm93=t=>`<span class="w93n" data-w93t="${t.id}" role="button" tabindex="0">${(t.prio||0)>=3?'<b>!</b> ':''}${esc(t.title)}</span>`;


  /* ---- 시간표(v9.5): 1분 = 1px, 15분 단위로 놓기 ---- */
  const PX93=1;
  const isWk=t=>!!(t&&typeof wx91==='function'&&wx91(t));
  const mvOk93=t=>!!t&&!t.cb76&&!t.rstep;   // v10.6: 루틴 머리(이 날만)·끼니도 옮김
  const tm93=(t,k)=>t.rid?((t.tx83&&t.tx83.d===k&&t.due===k)?t.tx83.m:t.time):t.time;   // 루틴은 '이 날만'(tx83) 시각이 먼저
  const rtDay93=(t,k)=>!!(t&&t.rid&&t.due===k);
  const mem93=k=>({fx:new Set(fx93(k).nt.map(t=>t.id).concat(tasksOn(k).filter(t=>t.list==='fixed'&&t.status===0&&t.time).map(t=>t.id))),
    wk:new Set(wk93(k).map(x=>x.t.id)),ad:new Set(ad93(k).map(t=>t.id)),care:new Set(care93(k).map(t=>t.id))});
  function bl93(k){   // 내일 시간표에 그릴 블록(시각 있는 일 + 주 N회 자리)
    const by={};
    tasksOn(k).forEach(x=>{if(x.status!==0||!x.time||hm80(x.time)==null)return;by[x.id]={id:x.id,t:TASKS[x.id]||x,s:hm80(x.time),d:Math.max(10,+x.dur||30)}});
    wk93(k).forEach(x=>{const sl=x.on&&x.t.sl91[k];if(sl&&hm80(sl)!=null)by[x.t.id]={id:x.t.id,t:x.t,s:hm80(sl),d:Math.max(10,+x.t.dur||30)}});
    return Object.values(by);
  }
  function lane93(L){   // 겹치는 블록은 나란히
    L.sort((a,b)=>a.s-b.s||b.d-a.d);let cl=[],ends=[],cend=-1;
    const fin=()=>{cl.forEach(b=>b.n=Math.max(1,ends.length));cl=[];ends=[];cend=-1};
    L.forEach(b=>{if(cl.length&&b.s>=cend)fin();const e=b.s+Math.max(b.d,20);let i=ends.findIndex(x=>x<=b.s);if(i<0){i=ends.length;ends.push(0)}ends[i]=e;b.l=i;cl.push(b);cend=Math.max(cend,e)});
    fin();return L}
  function tt93(k){
    const p=pcfg80();let s0=Math.floor(hm80(p.s)/60)*60,e0=Math.ceil(hm80(p.e)/60)*60;
    const L=bl93(k);L.forEach(b=>{s0=Math.min(s0,Math.floor(b.s/60)*60);e0=Math.max(e0,Math.ceil((b.s+b.d)/60)*60)});
    e0=Math.min(Math.max(e0,s0+120),24*60);W.s0=s0;W.e0=e0;
    const cur=(W.mem&&W.mem[W.step])||new Set();lane93(L);
    let h='';for(let m=s0;m<e0;m+=60)h+=`<div class="hl93" style="top:${(m-s0)*PX93}px"><span>${String(Math.floor(m/60)).padStart(2,'0')}</span></div><div class="hl93 half" style="top:${(m-s0+30)*PX93}px"></div>`;
    const bs=L.map(b=>{const t=b.t,mv=mvOk93(t),isC=cur.has(b.id),sel=W.sel===b.id;
      return `<div class="b93${isC?' cur':''}${sel?' sel':''}${mv?' mv':''}" data-w93b="${b.id}" role="button" tabindex="0" aria-pressed="${sel}" title="${esc(t.title)} ${fmt80(b.s)}–${fmt80(b.s+b.d)}" style="top:${(b.s-s0)*PX93}px;height:${Math.max(20,b.d*PX93)-2}px;left:calc(${b.l/b.n*100}% + 1px);width:calc(${100/b.n}% - 3px)"><b>${fmt80(b.s)}</b> ${t.ml80?'🍱 ':''}${esc(t.title)}${t.rep&&t.rep.f&&!isWk(t)?' ↻':''}</div>`}).join('');
    return `<div class="tt93s" data-w93sc="1"><div class="tt93g" data-w93g="1" data-s0="${s0}" style="height:${(e0-s0)*PX93}px">${h}${bs}</div></div>`;
  }
  function sel93(k){
    const t=W.sel&&TASKS[W.sel];if(!t)return '';
    const wk=isWk(t),sl=wk?(t.sl91&&t.sl91[k]):tm93(t,k),placed=!!sl&&hm80(sl)!=null,rt=!!t.rid,ml=!!t.ml80,d=rt?(view83(t,k).dur||+t.dur||30):(+t.dur||30),rep=t.rep&&t.rep.f&&!wk&&!(rt&&rtDay93(t,k));
    const tm=placed?`<input type="time" data-w93seltm="1" aria-label="시각" value="${esc(fmt80(hm80(sl)))}">`:'';
    return `<div class="sel93"><div class="s1"><b>${esc(t.title)}</b> <span class="tiny muted">${placed?fmt80(hm80(sl))+'–'+fmt80(hm80(sl)+d):'아직 시간 안 정함 — 아래 시간표를 눌러 놓아요'}</span></div>
      <div class="s2">${rt||ml?'':durOpt(t)}${placed?`${rt||ml?'':'<button type="button" class="chipbtn" data-w93len="-15" aria-label="15분 줄이기">−15분</button><button type="button" class="chipbtn" data-w93len="15" aria-label="15분 늘리기">＋15분</button>'}${tm}${rt||ml?'':`<button type="button" class="chipbtn" data-w93off="1">${wk?'종일 칸으로':'시간 빼기'}</button>`}`:`<button type="button" class="chipbtn" data-w93q="1">빈 시간에 놓기</button>`}${wk&&t.sl91&&t.sl91[k]!==undefined?'<button type="button" class="chipbtn" data-w93del="1">날 정함 빼기</button>':''}${ml?'':'<button type="button" class="chipbtn" data-w93opt="1" aria-haspopup="menu">⋯ 옵션</button>'}<button type="button" class="chipbtn" data-w93det="1">상세</button><button type="button" class="ib" data-w93desel="1" aria-label="선택 끝">×</button></div>
      ${W.dp===t.id?`<div class="row dp93" style="gap:6px;margin-top:6px"><input type="date" data-w93dpv="1" value="${esc(k)}" min="${esc(midKey68())}" aria-label="새 날짜"><button type="button" class="btn sm" data-w93dpok="1">이 날로 옮기기</button><button type="button" class="btn ghost sm" data-w93dpx="1">취소</button></div>`:''}
      ${rt&&rtDay93(t,k)?'<div class="tiny muted">⏱ 루틴 — 이 날만 옮겨요 (평소 ⏰ 몇 시쯤은 그대로)</div>':''}
      ${ml?'<div class="tiny muted">🍱 끼니 — 그날만 바뀌어요</div>':''}
      ${rep?'<div class="tiny muted">↻ 반복 할 일이라 시각을 바꾸면 앞으로의 시각도 바뀌어요</div>':''}</div>`;
  }
  function tray93(id,k){
    let L=[];
    if(id==='fx')L=fx93(k).nt;
    else if(id==='wk')L=wk93(k).filter(x=>!(x.on&&hm80(x.t.sl91[k])!=null)).map(x=>x.t);
    else if(id==='ad')L=ad93(k);
    const lab={fx:'시각을 정해야 해요',wk:'이번 주 남은 횟수',ad:'시각 안 정한 일'}[id];
    const chip=t=>{const on=W.sel===t.id,x=id==='wk'?wk93(k).find(z=>z.t.id===t.id):null;
      return `<button type="button" class="chipbtn t93${on?' on':''}" data-w93s="${t.id}" aria-pressed="${on}">${(t.prio||0)>=3?'<b>!</b> ':''}${esc(t.title)}${x?` <small>${x.n}/${x.N}${x.on?' · 종일':''}</small>`:''}${t.dur?` <small>${t.dur}분</small>`:''}${t.rep&&t.rep.f&&id!=='wk'?' ↻':''}</button>`};
    const auto=L.filter(autoOk80).length;
    return `<div class="p80g">${lab} <small>${L.length}</small></div>`+(L.length?`<div class="tray93">${L.map(chip).join('')}</div>`:'<p class="help" style="margin:2px 0">시각을 정할 일이 없어요.</p>')
      +(W.sel?'':`<p class="help" style="margin:2px 0 4px">일을 누르고 → 시간표 빈 곳을 눌러 놓아요. 놓인 일도 눌러서 옮겨요.</p>`)
      +(id==='ad'?`<div class="row" style="gap:8px;margin-bottom:4px"><button type="button" class="btn sm" data-w93auto="1"${auto?'':' disabled'}>빈 시간에 알아서 넣기 (${auto}개)</button></div>`:'');
  }
  const snapS93=t=>({time:t.time===undefined?null:t.time,dur:t.dur,sl:t.sl91?JSON.parse(JSON.stringify(t.sl91)):undefined,tx:t.tx83?JSON.parse(JSON.stringify(t.tx83)):undefined});
  function restore93(t,s){t.time=s.time;if(s.dur===undefined)delete t.dur;else t.dur=s.dur;if(s.sl===undefined)delete t.sl91;else t.sl91=s.sl;if(s.tx===undefined)delete t.tx83;else t.tx83=s.tx;saveTask(t)}
  function mut93(t,label,fn){const b=snapS93(t);fn();saveTask(t);W.undo={l:label,fn:()=>restore93(t,b)};redo93()}
  function put93(t,m){   // m=분(null이면 시간 빼기)
    const k=W.k;mut93(t,`'${t.title}' ${m==null?'시간 뺌':'옮김'}`,()=>{
      if(isWk(t)){t.sl91=t.sl91||{};t.sl91[k]=m==null?'':fmt80(m)}
      else if(rtDay93(t,k)&&m!=null){t.tx83={d:k,m:fmt80(m)}}   // 루틴: 이 날만(평소 ⏰ 몇 시쯤은 그대로)
      else t.time=m==null?null:fmt80(m);
      if(m!=null&&!t.dur&&!t.rid)t.dur=30})}
  const placed93=(t,k)=>{const v=isWk(t)?(t.sl91&&t.sl91[k]):tm93(t,k);return !!v&&hm80(v)!=null};
  const min93=(g,y)=>{const r=g.getBoundingClientRect();return Math.max(0,Math.min(24*60-5,(+g.dataset.s0)+Math.floor((y-r.top)/PX93/15)*15))};

  /* ---- 화면 ---- */
  function seq93(k){return ord93().filter(id=>cnt93(id,k)>0)}
  function body93(id,k){
    if(id==='care'){const L=care93(k),m=L.reduce((s,t)=>s+(+t.dur||0),0);
      return `<div class="p80g">관리 차례 <small>${L.length}${m?' · '+hmK76(m):''}</small></div><p class="help" style="margin:0 0 4px">미뤄도 괜찮은 일이라 마지막에, 남는 틈에 해요.</p>`+L.slice(0,8).map(t=>`<div class="r93w">${nm93(t)}<small class="muted">${esc(when76(t,k))}</small></div>`).join('')+(L.length>8?`<div class="tiny muted">…외 ${L.length-8}개</div>`:'')+
        `<div class="row" style="margin-top:6px"><button type="button" class="btn ghost sm" data-w93care="1">🧽 차례 정하기 열기</button></div>`}
    return tray93(id,k);
  }
  function wiz93(){
    const k=W.k,td=midKey68(),seq=W.seq,steps=seq.concat(['end']);
    if(W.i>=steps.length)W.i=steps.length-1;if(W.i<0)W.i=0;
    const cur=steps[W.i];W.step=cur;const lab=k===addDays(td,1)?'내일':dayName68(k);
    const m=placed76(k),B=budOf76(k)*60,over=m>B;
    const dots=steps.map((id,i)=>{const nmx=id==='end'?'✓ 마무리':ALL.find(a=>a[0]===id)[1],sh={fx:'📌 일정',wk:'🔁 주N회',ad:'🗓 종일',care:'🧽 관리',end:'✓ 마무리'}[id];return `<button type="button" class="w93d${i===W.i?' on':''}${i<W.i?' pass':''}" data-w93go="${i}" aria-current="${i===W.i}" aria-label="${nmx}" title="${nmx}">${i<W.i?'✓ ':''}${sh}</button>`}).join('');
    const line=`<div class="p80b${over?' over':''}">${over?'⚠ ':''}놓은 시간 ${hmK76(m)} / 하루 예산 ${hmK76(B)}${over?' — '+hmK76(m-B)+' 넘쳐요':''}</div>`;
    const und=W.undo?`<div class="row" style="margin-top:6px"><button type="button" class="btn ghost sm" data-w93u="1">↶ ${esc(W.undo.l)} 되돌리기</button></div>`:'';
    let main;
    if(cur==='end'){
      const n=tasksOn(k).filter(t=>t.status===0&&!t.cb76&&!t.ml80).length,untimed=ad93(k).length,fxn=fx93(k).nt.length;
      main=`${sel93(k)}${tt93(k)}${line}${und}<p class="small" style="margin:6px 0">${esc(lab)} 할 일 ${n}개${fxn?` · ⚠ 시각 안 정한 정해진 일정 ${fxn}개`:''}${untimed?` · 종일 칸 ${untimed}개`:''}</p>
        <div class="row" style="gap:8px;flex-wrap:wrap">${done93()[k]?'<span class="small">✓ 내일 짜기 끝냈어요</span>':'<button type="button" class="btn" data-w93fin="1">내일 짜기 끝</button>'}<button type="button" class="btn ghost" data-sheet="close">닫기</button></div>`}
    else main=body93(cur,k)+sel93(k)+tt93(k)+line+und;
    const nav=`<div class="row w93nav" style="gap:8px;margin-top:8px">${W.i>0?'<button type="button" class="btn ghost sm" data-w93nav="-1">‹ 이전</button>':''}${cur==='end'?'':`<button type="button" class="btn sm" data-w93nav="1">${W.i===steps.length-2?'마무리 ›':'다음 ›'}</button>`}</div>`;
    const ord=ord93();
    sheetCtx={w93:k};
    openSheet(`<div class="sh"><h3>🌙 내일 짜기 · ${esc(dayName68(k))}</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
      <div class="w93dots" role="group" aria-label="단계">${dots}</div>
      ${steps.length===1?'<div class="empty small">내일 짤 일정이 아직 없어요 — 할 일을 내일로 정하거나 캘린더에서 놓아요</div>':''}
      ${main}${cur==='end'?'':nav}
      <details class="m80s"><summary>⚙ 설정</summary>
        <div class="row small" style="gap:6px;flex-wrap:wrap">밤에 알려 줄 시각 <input type="time" data-w93at="1" value="${esc(at93())}"></div>
        <div class="small" style="margin-top:6px">단계 순서 <small class="muted">(위가 먼저)</small></div>
        ${ord.map((id,i)=>`<div class="row small" style="gap:6px"><span style="flex:1">${ALL.find(a=>a[0]===id)[1]}</span><button type="button" class="ib" data-w93o="${id}:-1"${i===0?' disabled':''} aria-label="위로">▲</button><button type="button" class="ib" data-w93o="${id}:1"${i===ord.length-1?' disabled':''} aria-label="아래로">▼</button></div>`).join('')}
        <div style="margin-top:6px"><button type="button" class="linkbtn" data-w93old="1">예전 시간표 짜기 화면 열기</button></div></details>`);
    const sc=document.querySelector('#sheetC .tt93s');
    if(sc){if(W.scTop==null){const c=W.mem&&W.mem[cur],L=bl93(k).filter(b=>c&&c.has(b.id)).map(b=>b.s),f=L.length?Math.min(...L):hm80(pcfg80().s);sc.scrollTop=Math.max(0,f-(W.s0||0)-60);W.scTop=sc.scrollTop}else sc.scrollTop=W.scTop}
    if(W.y!=null){const e=$('sheetC');if(e)e.scrollTop=W.y;W.y=null}
  }
  /* ---- v10.6: 상세·끼니 창을 열었다가 '← 뒤로'로 내일 짜기에 돌아오기 (NAV61 = 기존 뒤로 가기 길 재사용) ---- */
  function go93(id){PRE61={c:{k:'w93',id:'w93',n:'🌙 내일 짜기'},at:Date.now()};closeSheet();openTaskSheet(id)}
  window.back93=function(){if(!W)return false;W.dp=null;W.y=null;render();wiz93();return true};
  /* ---- v10.6: 선택한 할 일 옵션 — 날짜 다시 정하기 · 미루기 · 이번엔 건너뛰기 · 안 하기 (되돌리기는 화면 안 단추 W.undo) ---- */
  function snapT93(t){return clone(t)}
  function undoT93(snap,cfg){return()=>{const t=TASKS[snap.id];if(t){Object.keys(t).forEach(x=>delete t[x]);Object.assign(t,clone(snap));saveTask(t)}else saveTask(clone(snap));if(cfg){try{syncDailies(C);save('config')}catch(e){}}}}
  function act93(t,label,fn,cfg){const snap=snapT93(t);fn();saveTask(t);if(cfg){try{syncDailies(C);save('config')}catch(e){}}W.undo={l:label,fn:undoT93(snap,cfg)};W.sel=null;W.dp=null;redo93()}
  function moveTo93(t,nd){const k=W.k;
    act93(t,`'${t.title}' ${fmtD(nd)}로 옮김`,()=>{
      if(isWk(t)){t.sl91=t.sl91||{};const had=t.sl91[k]!==undefined,v=had?t.sl91[k]:'';delete t.sl91[k];t.sl91[nd]=v}
      else{if(t.rid&&t.tx83)delete t.tx83;t.due=nd}})}
  function skip93(t){const k=W.k,td=midKey68();
    act93(t,`'${t.title}' 이번엔 건너뜀`,()=>{
      t.skip61=[...new Set([...(t.skip61||[]).filter(d=>d>=addDays(td,-14)),k])];
      if(t.due&&t.due<=k){const nd=nextDue(t.rep,k);if(nd)t.due=nd}
      delete t.skull;if(t.rid)delete t.tx83},true)}
  function drop93(t){const k=W.k,td=midKey68();
    act93(t,`'${t.title}' ${t.rep&&t.rep.f?'반복 그만둠':'안 하기'}`,()=>{t.status=-1;t.doneAt=td},true)}
  function opt93(t,x,y){const k=W.k,wk=isWk(t),rep=!!(t.rep&&t.rep.f)&&!wk,nx=addDays(k,1),mon=addDays(weekStart(k),7);
    menu61(x,y,`📋 ${esc(t.title.length>20?t.title.slice(0,20)+'…':t.title)}`,[
      {l:'📅 날짜 다시 정하기…',f:()=>{W.dp=t.id;redo93()}},
      {l:`⏩ 하루 뒤로 (${fmtD(nx)})`,f:()=>moveTo93(t,nx)},
      {l:`⏩ 다음 주 월요일로 (${fmtD(mon)})`,dis:wk,f:()=>moveTo93(t,mon)},
      '-',
      {l:'⏭ 이번엔 건너뛰기 (☠ 없이 다음 차례로)',dis:!rep,f:()=>skip93(t)},
      {l:rep?'🚫 반복 그만두기':'🚫 안 하기',f:()=>drop93(t)},
      '-',
      {l:'✎ 상세 열기',f:()=>go93(t.id)}])}
  function open93(k){const nk=k||KEY();W={k:nk,i:0,undo:null,seq:seq93(nk),mem:mem93(nk),sel:null,scTop:null,step:null};wiz93()}   // 단계 목록은 열 때 한 번만 정함(알아서 넣기로 비어도 단계가 사라져 화면이 밀리지 않게)
  const redo93=()=>{const e=$('sheetC');W.y=e?e.scrollTop:null;render();wiz93()};

  /* ---- 동작 ---- */
  addEventListener('click',e=>{const T=e.target;if(!T||!T.closest)return;
    const o=T.closest('[data-w93open]');if(o){e.preventDefault();e.stopPropagation();open93();return}
    const x=T.closest('[data-w93x]');if(x){e.preventDefault();e.stopPropagation();ui.n93x=midKey68();line93();return}
    if(!(sheetCtx&&sheetCtx.w93&&W))return;let b;
    const stop=()=>{e.preventDefault();e.stopPropagation()};
    if((b=T.closest('[data-w93go]'))){stop();W.i=+b.dataset.w93go;W.sel=null;W.scTop=null;wiz93();return}
    if((b=T.closest('[data-w93nav]'))){stop();W.i+=+b.dataset.w93nav;W.sel=null;W.scTop=null;wiz93();return}
    if((b=T.closest('[data-w93t]'))){stop();go93(b.dataset.w93t);return}
    if((b=T.closest('[data-w93s]'))){stop();const id=b.dataset.w93s;W.sel=W.sel===id?null:id;wiz93();return}
    if((b=T.closest('[data-w93b]'))){stop();if(Date.now()-(W.drg||0)<350)return;const id=b.dataset.w93b,t=TASKS[id];if(!t)return;
      const sl=W.sel&&TASKS[W.sel];   // 아직 시간 없는 일을 골라 둔 채 블록 위를 누르면 그 자리에 놓기(겹쳐도 됨 — 나란히 그려짐)
      if(sl&&sl.id!==id&&!placed93(sl,W.k)){const g=T.closest('[data-w93g]');if(g){put93(sl,min93(g,e.clientY));return}}
      if(!mvOk93(t)){go93(id);return}
      W.sel=W.sel===id?null:id;wiz93();return}
    if((b=T.closest('[data-w93g]'))&&W.sel&&TASKS[W.sel]){stop();if(Date.now()-(W.drg||0)<350)return;put93(TASKS[W.sel],min93(b,e.clientY));return}
    if((b=T.closest('[data-w93len]'))){stop();const t=TASKS[W.sel];if(t)mut93(t,`'${t.title}' 길이`,()=>{t.dur=Math.max(10,(+t.dur||30)+(+b.dataset.w93len))});return}
    if((b=T.closest('[data-w93off]'))){stop();const t=TASKS[W.sel];if(t)put93(t,null);return}
    if((b=T.closest('[data-w93del]'))){stop();const t=TASKS[W.sel];if(!t||!t.sl91)return;mut93(t,`'${t.title}' 날 정함 뺌`,()=>{delete t.sl91[W.k];if(!Object.keys(t.sl91).length)delete t.sl91});W.sel=null;return}
    if((b=T.closest('[data-w93det]'))){stop();const id=W.sel;if(id)go93(id);return}
    if((b=T.closest('[data-w93desel]'))){stop();W.sel=null;W.dp=null;wiz93();return}
    if((b=T.closest('[data-w93opt]'))){stop();const t=TASKS[W.sel];if(!t)return;const r=b.getBoundingClientRect();opt93(t,r.left,r.bottom+4);return}
    if((b=T.closest('[data-w93dpx]'))){stop();W.dp=null;redo93();return}
    if((b=T.closest('[data-w93dpok]'))){stop();const t=TASKS[W.sel],v=($('sheetC').querySelector('[data-w93dpv]')||{}).value;W.dp=null;if(!t||!v){redo93();return}if(v===W.k){toast('같은 날이에요');redo93();return}moveTo93(t,v);return}
    if((b=T.closest('[data-w93q]'))){stop();const t=TASKS[W.sel];if(!t)return;const p=free93(W.k,+t.dur||30,busy93(W.k,[t.id]));if(p==null){toast('빈 시간이 없어요 — 시간표를 눌러 직접 놓아요');return}put93(t,p);return}
    if((b=T.closest('[data-w93auto]'))){stop();const k=W.k,items=ad93(k).filter(autoOk80),busy=busy93(k),prev=[];let n=0,miss=0;
      items.forEach(t=>{const d=Math.max(10,+t.dur||30),p=free93(k,d,busy);if(p==null){miss++;return}
        prev.push({id:t.id,time:t.time||null,dur:t.dur||null});t.time=fmt80(p);t.dur=d;saveTask(t);busy.push([p,p+d+5]);n++});
      W.undo=n?{l:`방금 넣은 ${n}개`,fn:()=>{prev.forEach(p=>{const t=TASKS[p.id];if(t){t.time=p.time;t.dur=p.dur;saveTask(t)}})}}:null;
      redo93();toast(n?`🌙 ${n}개를 빈 시간에 넣었어요${miss?` · ${miss}개는 빈 시간이 없어요`:''}`:'넣을 빈 시간이 없어요 — 길이를 줄이거나 하루 끝 시각을 늦춰요');return}
    if((b=T.closest('[data-w93u]'))){stop();const u=W.undo;W.undo=null;if(u)u.fn();redo93();return}
    if((b=T.closest('[data-w93care]'))){stop();const k=W.k;closeSheet();careSheet76(k);return}
    if((b=T.closest('[data-w93fin]'))){stop();const k=W.k;done93()[k]=1;Object.keys(C.tm93done).sort().slice(0,-30).forEach(d=>delete C.tm93done[d]);save('config');closeSheet();render();toast('🌙 내일 짜기 끝! 푹 쉬어요');return}
    if((b=T.closest('[data-w93old]'))){stop();const k=W.k;closeSheet();planSheet80(k);return}
    if((b=T.closest('[data-w93o]'))){stop();const [id,dv]=b.dataset.w93o.split(':'),o=ord93(),i=o.indexOf(id),j=i+(+dv);if(i<0||j<0||j>=o.length)return;
      [o[i],o[j]]=[o[j],o[i]];C.tm93ord=o;save('config');wiz93();return}
  },true);
  addEventListener('change',e=>{const T=e.target;if(!T||!T.matches||!(sheetCtx&&sheetCtx.w93&&W))return;
    if(T.matches('[data-w93seltm]')){e.stopPropagation();const t=TASKS[W.sel];if(t&&hm80(T.value)!=null)put93(t,hm80(T.value));return}
    if(T.matches('[data-w93d]')){e.stopPropagation();const t=TASKS[T.dataset.w93d],v=+T.value;if(t&&v){t.dur=v;saveTask(t)}redo93();return}
    if(T.matches('[data-w93at]')){e.stopPropagation();if(hm80(T.value)!=null){C.tm93at=T.value;save('config');line93()}return}
  },true);
  addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target&&e.target.matches&&e.target.matches('.w93n')){e.preventDefault();go93(e.target.dataset.w93t)}
    else if((e.key==='Enter'||e.key===' ')&&e.target&&e.target.matches&&e.target.matches('.b93')&&W&&sheetCtx&&sheetCtx.w93){e.preventDefault();e.target.click()}});

  /* ---- 시간표 위 마우스: 올려 보기(고른 일이 놓일 자리) · 블록 끌기 ---- */
  let G=null;
  const inW=()=>!!(W&&sheetCtx&&sheetCtx.w93);
  function ghost93(g,m,d,txt){let h=g.querySelector('.gh93');if(!h){h=document.createElement('div');h.className='gh93';g.appendChild(h)}
    h.style.top=(m-(+g.dataset.s0))*PX93+'px';h.style.height=Math.max(20,d*PX93)-2+'px';h.textContent=fmt80(m)+' '+txt}
  const noGhost93=()=>document.querySelectorAll('.gh93').forEach(x=>x.remove());
  addEventListener('pointerdown',e=>{if(!inW()||e.pointerType!=='mouse'||e.button!==0)return;const b=e.target.closest&&e.target.closest('.b93.mv');if(!b)return;
    G={id:b.dataset.w93b,x:e.clientX,y:e.clientY,on:false}},true);
  addEventListener('pointermove',e=>{if(!inW()||e.pointerType!=='mouse')return;
    const g=document.querySelector('#sheetC [data-w93g]');if(!g)return;
    if(G){const t=TASKS[G.id];if(!t){G=null;return}
      if(!G.on&&Math.hypot(e.clientX-G.x,e.clientY-G.y)>6)G.on=true;
      if(G.on){e.preventDefault();const r=g.getBoundingClientRect();if(e.clientX>=r.left&&e.clientX<=r.right)ghost93(g,min93(g,e.clientY),+t.dur||30,t.title);else noGhost93()}return}
    if(W.sel&&TASKS[W.sel]&&e.target.closest&&e.target.closest('[data-w93g]')&&!e.target.closest('.b93')){const t=TASKS[W.sel];ghost93(g,min93(g,e.clientY),+t.dur||30,t.title)}
    else noGhost93()},true);
  addEventListener('pointerup',e=>{if(!G)return;const d=G;G=null;noGhost93();if(!d.on||!inW())return;
    W.drg=Date.now();const g=document.querySelector('#sheetC [data-w93g]'),t=TASKS[d.id];if(!g||!t)return;
    const r=g.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)return;
    W.sel=d.id;put93(t,min93(g,e.clientY))},true);

  /* ---- 홈 오늘 칸 한 줄 (밤 시각 이후 · 내일 짜기를 안 끝냈을 때만 · 오늘 밤은 × 로 닫기) ---- */
  function line93(){
    document.querySelectorAll('.n93').forEach(x=>x.remove());
    if(typeof ready!=='undefined'&&!ready)return;
    const n=new Date();if(n.getHours()*60+n.getMinutes()<hm80(at93()))return;
    if(ui.n93x===midKey68())return;
    const k=KEY();if(done93()[k])return;
    const p=document.querySelector('.htoday');if(!p)return;
    const c=tasksOn(k).filter(t=>t.status===0&&!t.cb76&&!t.ml80).length;
    p.insertAdjacentHTML('beforeend',`<div class="n93"><button type="button" class="chipbtn" data-w93open="1">🌙 내일 짜기</button><span class="tiny muted"> 내일 할 일 ${c}개</span><button type="button" class="ib" data-w93x="1" aria-label="오늘 밤은 닫기" title="오늘 밤은 닫기">×</button></div>`);
  }
  render=(function(prev){return function(){const r=prev.apply(this,arguments);try{line93()}catch(e){console.error(e)}return r}})(render);
  setInterval(()=>{try{if(!document.hidden)line93()}catch(e){}},60000);

  /* ---- 입구: 인자 없는 planSheet80()(🌙 단추·⋯ 설정 메뉴)을 이 화면으로. 날짜를 주면 예전 화면 그대로 ---- */
  planSheet80=(function(prev){return function(k){if(k===undefined)return open93();return prev.apply(this,arguments)}})(planSheet80);
  menu61=(function(prev){return function(x,y,title,items){try{if(title==='캘린더 설정'&&Array.isArray(items)&&!items.some(it=>it&&/^🌙 시간표 짜기/.test(it.l||''))){
      const i=items.findIndex(it=>it&&typeof it.l==='string'&&/^🍱 식단표/.test(it.l));
      items.splice(i<0?items.length:i,0,{l:'🌙 시간표 짜기 · 내일 짜기',f:()=>{open93()}})}}catch(e){console.error(e)}
    return prev.call(this,x,y,title,items)}})(menu61);
  renderCal=(function(prev){return function(){const r=prev.apply(this,arguments);try{const b=$('calPlanBtn');if(b){b.title='내일 짜기 (시간표 짜기)';b.setAttribute('aria-label','내일 짜기')}}catch(e){console.error(e)}return r}})(renderCal);

  F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
    ['🌙 내일 짜기','홈 오늘 칸(밤) · 캘린더 줄 🌙 (폰은 ⋯ 설정)','전날 밤 한 화면에서 내일 시간표를 짜요: 📌 정해진 일정(시각 먼저) → 🔁 주 N회 → 🗓 종일 칸 일 → 🧽 관리. 모든 단계에 내일 시간표가 같이 보여요 — 일을 누르고 시간표 빈 곳을 눌러 놓고, 놓인 일(이미 정해진 일정도)을 눌러 옮기고, 길이는 ±15분. 마지막 줄에 놓은 시간/하루 예산. "내일 짜기 끝"을 누르면 그날 밤엔 다시 안 떠요. 뜨는 시각과 단계 순서는 ⚙ 설정에서 바꿔요.',()=>{open93()},'내일 짜기 시간표 전날 밤 정해진 일정 주 N회 종일 칸 관리 하루 예산']])}})(F67);
  /* ---- v10.6: 뒤로 가기 — 상세·끼니 창에서 '← 뒤로'(위) / 닫은 뒤 '← 내일 짜기로 돌아가기'(알약)로 내일 짜기 복귀 ---- */
  cur61=(function(prev){return function(){try{if(typeof sheetOpen61==='function'&&sheetOpen61()&&sheetCtx&&sheetCtx.w93&&W)return{k:'w93',id:'w93',n:'🌙 내일 짜기'}}catch(e){}return prev.apply(this,arguments)}})(cur61);
  goBack61=(function(prev){return function(){const top=NAV61[NAV61.length-1];
    if(top&&top.k==='w93'){NAV61.pop();NAVGO61=1;try{if(sheetOpen61())closeSheet();if(!window.back93())toast('내일 짜기를 다시 열어요 — 🌙 내일 짜기')}finally{NAVGO61=0}hidePill61();return}
    return prev.apply(this,arguments)}})(goBack61);
  backBtn61=(function(prev){return function(){const r=prev.apply(this,arguments);
    try{const sc=$('sheetC'),top=NAV61[NAV61.length-1];if(!sc||!top||!sheetCtx||!sheetCtx.m80i||sc.querySelector(':scope>.back61'))return r;
      const b=document.createElement('button');b.type='button';b.className='back61';b.dataset.back61='1';b.innerHTML=`← 뒤로 <span class="tiny muted">${esc(String(top.n||'').slice(0,26))}</span>`;const g=sc.querySelector(':scope>.grab');if(g)g.after(b);else sc.prepend(b)}catch(e){console.error(e)}
    return r}})(backBtn61);
}
