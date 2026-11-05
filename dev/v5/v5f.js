/* ================= v5: 홈 블록 ================= */
function renderHomeV5(){
  const td=dateKey(),open=openTasks();
  const list=open.filter(t=>t.due&&t.due<=td).sort((a,b)=>{const ta=a.time||'99',tb=b.time||'99';return (a.due<td?0:1)-(b.due<td?0:1)||ta.localeCompare(tb)||(b.prio||0)-(a.prio||0)});
  const dn=doneOn(td);
  $('htCount').textContent=list.length||dn.length?`${dn.length} / ${list.length+dn.length}`:'';
  $('hQuest').innerHTML=questBarHTML();
  const shown=list.slice(0,ui.htMore?99:8);
  $('htList').innerHTML=(shown.map(t=>taskRow(t,{compact:true})).join('')||`<div class="empty">${tasksReady||mode==='local'?'오늘 할 일이 없어요. 🎲 뽑기로 하나 골라도 좋아요.':'불러오는 중…'}</div>`)
    +(list.length>8&&!ui.htMore?`<button class="btn ghost sm" data-htmore="1" style="margin-top:6px">${list.length-8}개 더 보기</button>`:'')
    +(dn.length?`<div class="tiny muted" style="margin-top:6px">✓ 끝낸 것: ${dn.slice(0,6).map(e=>esc(e.name)).join(', ')}${dn.length>6?' 외 '+(dn.length-6):''}</div>`:'')+todayHabitsHTML();
  const g=C.gacha||{};const rs=(C.routines||[]).slice(0,2);
  $('hGacha').innerHTML=(g.quest?'':g.pending?`<a class="btn" href="#gacha">🎲 뽑은 카드 고르기</a>`:`<button class="btn" data-gquick="3">🎲 3장 뽑기</button><button class="btn ghost" data-gquick="5">🎲 5장</button>`)
    +rs.map(r=>`<button class="btn ghost" data-rrun="${r.id}">⏱ ${esc(r.name)}</button>`).join('')
    +`<button class="btn ghost" data-huntpick="1">⚔ 사냥 고르기</button><button class="btn ghost" data-gquickdopa="1">🍬 도파민</button><button class="btn ghost" data-quick5="1" title="딱 5분만 해보기">⏳ 딱 5분만</button>`;
}
/* ================= v5: 편집 탭 (행동 · 루틴 · 목록) ================= */
function actionsEditHTML(){
  const E=ui.ae||(ui.ae={q:'',type:'all',area:'',sort:'manual'});
  let list=C.actions.filter(a=>(E.type==='all'||a.type===E.type)&&(!E.area||a.area===E.area)&&(!E.q||a.name.toLowerCase().includes(E.q.toLowerCase())));
  const st=listStats();
  if(E.sort!=='manual')list=sortList(list,st,E.sort);
  const drag=E.sort==='manual'&&!E.q;
  return `<p class="help">반복하는 <b>습관</b> 목록이에요. 한 번 하고 끝나는 일은 '할 일'로 가요. 이름을 누르면 세부 옵션·관점 바꾸기 문구·목표 시간까지 다 고쳐요. ${drag?'왼쪽 ⋮⋮를 끌어서 순서를 바꿔요.':'순서를 바꾸려면 정렬을 "기본 순서", 검색을 비워요.'}</p>
    <div class="toolbar"><input id="aeQ" type="search" placeholder="🔍 행동 찾기" value="${esc(E.q)}" style="max-width:200px;padding:5px 10px;border-radius:999px;font-size:13px" autocomplete="off">
      <span class="seg3">${[['all','모두'],['good','▲ 좋은'],['bad','▼ 나쁜']].map(([v,l])=>`<button data-aetype="${v}" aria-pressed="${E.type===v}">${l}</button>`).join('')}</span>
      <select id="aeArea" aria-label="영역"><option value="">모든 영역</option>${C.areas.map(a=>`<option value="${a.id}" ${E.area===a.id?'selected':''}>${esc(a.name)}</option>`).join('')}</select>
      <select id="aeSort" aria-label="정렬">${SORTS.map(([v,l])=>`<option value="${v}" ${E.sort===v?'selected':''}>${l}</option>`).join('')}</select><span class="tiny muted">${list.length}개</span></div>
    <div class="elist" data-drop="reorder:actions">${list.map(a=>{const ar=C.areas.find(x=>x.id===a.area);const s=st[a.id]||{};
      return `<div class="erow2" data-rowid="${a.id}"><span class="hand" ${drag?`data-drag="row:${a.id}" data-dragmode="now"`:''} aria-label="끌어서 순서 바꾸기">${drag?'⋮⋮':''}</span><span class="mk ${a.type}">${a.type==='good'?'▲':'▼'}</span>
        <button class="nm" data-aedit="${a.id}" style="border:0;background:none;text-align:left;font:inherit;color:inherit;cursor:pointer;padding:0;min-width:0"><b>${esc(a.name)}</b><span>${esc(ar?ar.name:'')} · ${a.type==='good'?'XP +'+a.xp+' · 컨디션 +'+Math.abs(a.cond):'컨디션 −'+Math.abs(a.cond)+(a.gold?' · '+gtx(-Math.abs(a.gold)):'')}${a.opts&&a.opts.length?' · 옵션 '+a.opts.length:''}${a.dur?' · ⏱'+a.dur+'분':''}${a.reframe?' · 💭':''}${a.money?' · 💰':''} · 30일 ${s.n30||0}번</span></button>
        <button class="btn ghost sm" data-aedit="${a.id}">편집</button><span></span></div>`}).join('')||'<div class="empty">없어요.</div>'}</div>
    <div class="row" style="margin-top:10px"><button class="btn sm" data-addrow="actions" data-type="good">＋ 좋은 행동</button><button class="btn sm ghost" data-addrow="actions" data-type="bad">＋ 나쁜 행동</button></div>
    <h3 style="margin-top:18px">누적 페널티</h3><p class="help">나쁜 행동이 쌓이거나 이어지면 더 많이 깎여요. 그래서 흐름을 끊는 게 이득이에요.</p>
    <div class="kv"><label>같은 행동 7일 안에 한 번마다 +<input id="r-pensame" data-rule="penalty.same" type="number" step="0.05" min="0" max="2" value="${C.penalty.same}"></label><label>나쁜 날이 이어진 하루마다 +<input id="r-penchain" data-rule="penalty.chain" type="number" step="0.05" min="0" max="2" value="${C.penalty.chain}"></label><label>최대 배수<input id="r-penmax" data-rule="penalty.max" type="number" step="0.5" min="1" max="6" value="${C.penalty.max}"></label><label>흐름 끊기 보상 XP (연쇄 하루당)<input id="r-chxp" data-rule="chain.xp" type="number" min="0" value="${C.chain.xp}"></label><label>흐름 끊기 보상 골드 (하루당)<input id="r-chg" data-rule="chain.gold" type="number" min="0" value="${C.chain.gold}"></label></div>`;
}
function openActionEditor(id){
  const a=C.actions.find(x=>x.id===id);if(!a)return;sheetCtx={aedit:id};const good=a.type==='good';
  const v=(o,f)=>o[f]==null?'':o[f];
  const h=`<div class="sh"><h3>${good?'▲':'▼'} ${esc(a.name)}</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
  <div class="f2"><label class="f">이름<input data-ae="name" value="${esc(a.name)}" maxlength="60"></label>
    <label class="f">종류<select data-ae="type"><option value="good" ${good?'selected':''}>▲ 좋은</option><option value="bad" ${good?'':'selected'}>▼ 나쁜</option></select></label>
    <label class="f">영역<select data-ae="area">${C.areas.map(x=>`<option value="${x.id}" ${a.area===x.id?'selected':''}>${esc(x.name)}</option>`).join('')}</select></label>
    <label class="f">컨디션 ${good?'+':'−'}<input data-ae="cond" type="number" min="0" max="100" value="${Math.abs(a.cond||0)}"></label>
    <label class="f">골드 ${good?'+':'−'}<input data-ae="gold" type="number" min="0" value="${Math.abs(a.gold||0)}"></label>
    ${good?`<label class="f">XP<input data-ae="xp" type="number" min="0" value="${a.xp||0}"></label><label class="f">구슬<select data-ae="marble">${marbleOpts().map(([v2,l])=>`<option value="${esc(v2)}" ${(a.marble||'')===v2?'selected':''}>${esc(l)}</option>`).join('')}</select></label>
    <label class="f">목표 시간(분) · 타이머<input data-ae="dur" type="number" min="0" max="300" value="${a.dur||''}"></label>
    <label class="f">크기 (뽑기 필터)<select data-ae="effort"><option value="">자동</option>${EFFORTS.map(([k,l])=>`<option value="${k}" ${a.effort===k?'selected':''}>${l}</option>`).join('')}</select></label>`:''}
    <label class="f">금액 적기 (경제)<select data-ae="money"><option value="" ${a.money?'':'selected'}>안 적음</option><option value="1" ${a.money?'selected':''}>${good?'아낀':'쓴'} 돈 적기</option></select></label></div>
  <label class="f">💭 하기 싫을 때 읽을 문구 (관점 바꾸기)<textarea data-ae="reframe" rows="3" placeholder="예: 나는 물 맞는 걸 좋아해. 생각보다 금방 끝나!">${esc(a.reframe||'')}</textarea></label>
  <div><h3 style="font-size:15px;margin:0 0 4px">세부 옵션 <span class="tiny muted">${good?'(예: 기상 직후 샤워 / 자기 전 샤워)':'(예: 사교용 한 잔 / 혼술 / 과음)'}</span></h3>
    <p class="help" style="margin:0 0 6px">옵션마다 점수가 달라요. 빈칸은 위 기본값을 써요. 시간대(시)를 적으면 그 시간에 자동으로 골라져요 (자정 넘으면 24+, 예: 새벽 2시 = 26).</p>
    <div class="vtable"><div class="vrow head"><span>옵션 이름</span><span>${good?'XP':'—'}</span><span>컨디션</span><span>골드</span><span class="hr">부터(시)</span><span class="hr">까지(시)</span><span></span></div>
    ${(a.opts||[]).map((o,i)=>`<div class="vrow"><input data-aeo="${i}" data-f="name" value="${esc(o.name)}" aria-label="옵션 이름"><input data-aeo="${i}" data-f="xp" type="number" min="0" value="${v(o,'xp')}" ${good?'':'disabled'} aria-label="XP"><input data-aeo="${i}" data-f="cond" type="number" min="0" value="${v(o,'cond')}" aria-label="컨디션"><input data-aeo="${i}" data-f="gold" type="number" min="0" value="${v(o,'gold')}" aria-label="골드"><input class="hr" data-aeo="${i}" data-f="from" type="number" min="0" max="30" step="0.5" value="${v(o,'from')}" aria-label="부터"><input class="hr" data-aeo="${i}" data-f="to" type="number" min="0" max="30" step="0.5" value="${v(o,'to')}" aria-label="까지"><button class="x" data-aeodel="${i}" aria-label="옵션 지우기">×</button></div>`).join('')}</div>
    <button class="btn sm ghost" data-aeoadd="1" style="margin-top:6px">＋ 옵션 추가</button></div>
  ${good?`<div class="links"><h3 style="font-size:15px;margin:0 0 4px">📅 '오늘'에 띄우기</h3><p class="tiny muted" style="margin:0">일퀘·방치 경보에 걸리면 저절로 떠요. 그 밖에 띄울 요일을 고르거나 📌 고정해요.</p>
    <div class="row" style="gap:6px"><span class="wdays">${[1,2,3,4,5,6,0].map(w=>`<button data-aewd="${w}" aria-pressed="${(a.wd||[]).includes(w)}">${WDK[w]}</button>`).join('')}</span><button class="chipbtn" data-aepin="1" aria-pressed="${!!a.pin}">📌 매일 고정</button></div></div>`:''}
  <div class="links"><h3 style="font-size:15px;margin:0 0 4px">🔗 연결</h3>
    ${good?`<label class="f">🍬 도파민 코스<select id="aeDopa"><option value="">없음</option>${dopaC().map(([k,l])=>`<option value="${k}" ${a.dopa===k?'selected':''}>${l}</option>`).join('')}</select></label>`:''}
    ${(()=>{const ts=openTasks().filter(t=>t.aid===a.id);return `<div class="small">✅ 연결된 할 일 ${ts.length?ts.map(t=>`<span class="chipbtn" role="button" tabindex="0" data-ctask="${t.id}" style="cursor:pointer">${esc(t.title)}${t.rep?' 🔁':''}</span>`).join(' '):'<span class="muted">없음</span>'} ${good?`<button class="btn ghost sm" data-aetask="${a.id}">＋ 반복 할 일로 만들기</button>`:''}</div>`})()}
    ${(()=>{const rs=(C.routines||[]).filter(r=>r.steps.some(s=>s.aid===a.id));return good?`<div class="small row" style="gap:4px">⏱ 루틴 ${rs.map(r=>`<span class="tagc">${esc(r.name)}</span>`).join(' ')||'<span class="muted">없음</span>'} ${(C.routines||[]).length?`<select id="aeRtSel" style="width:auto">${C.routines.map(r=>`<option value="${r.id}">${esc(r.name)}</option>`).join('')}</select><button class="btn ghost sm" data-aeroutine="1">에 넣기</button>`:''}</div>`:''})()}
    ${(()=>{const ws=C.watches.filter(w=>w.action===a.id),qs=C.dailies.filter(q=>q.action===a.id);return `<div class="small muted">${ws.length?`⚠ 방치 경보: ${ws[0].days}일 넘으면 −${ws[0].penalty}/일 · `:''}${qs.length?`☑ 일퀘: ${qs.map(q=>esc(q.name)).join(', ')}`:''}</div>`})()}
  </div>
  <div class="row" style="justify-content:space-between"><button class="btn ghost sm" data-del="actions" data-id="${a.id}">지우기</button><span class="row" style="gap:6px"><button class="btn ghost" data-aerun="${a.id}">⏱ 타이머</button><button class="btn" data-sheet="close">완료</button></span></div>`;
  openSheet(h,()=>{render()});
}
function aeChange(t){
  const a=C.actions.find(x=>x.id===(sheetCtx||{}).aedit);if(!a)return;
  if(t.dataset.ae){const f=t.dataset.ae;let v=t.value;
    if(['cond','gold','xp','dur'].includes(f)){v=Math.abs(parseFloat(v)||0)}
    if(f==='cond'||f==='gold')v=a.type==='bad'?-v:v;
    if(f==='type'){a.cond=v==='bad'?-Math.abs(a.cond):Math.abs(a.cond);a.gold=v==='bad'?-Math.abs(a.gold):Math.abs(a.gold);if(v==='bad'){a.xp=0;a.marble=''}}
    if(f==='name'){v=v.trim();if(!v)return}
    if(f==='reframe'){v=v.trim();if(!v){delete a.reframe;save('config');return}}
    if((f==='dur'&&!v)||(f==='effort'&&!v)||(f==='money'&&!v)){delete a[f];save('config');return}
    a[f]=v;save('config');if(f==='type'||f==='name'){openActionEditor(a.id)}return}
  if(t.dataset.aeo!=null){const o=(a.opts||[])[+t.dataset.aeo];if(!o)return;const f=t.dataset.f;let v=t.value;
    if(f!=='name'){v=v===''?null:Math.abs(parseFloat(v));if(v!=null&&isNaN(v))return}else{v=v.trim();if(!v)return}
    if(v==null)delete o[f];else o[f]=v;save('config')}
}
function routinesEditHTML(){
  const rs=C.routines||[];
  return `<p class="help">루틴은 단계마다 목표 시간이 있는 '자동사냥'이에요. 단계에 습관을 연결하면 그 단계를 끝낼 때 그 습관도 같이 기록돼요. 빨리 끝내면 스피드 보너스.</p><div class="stack">`+
  rs.map(r=>`<div class="jarcard"><div class="kv"><label>루틴 이름<input data-rt="${r.id}" data-f="name" value="${esc(r.name)}"></label><label>완주 XP<input data-rt="${r.id}" data-f="xp" type="number" min="0" value="${r.xp||0}"></label><label>완주 골드<input data-rt="${r.id}" data-f="gold" type="number" min="0" value="${r.gold||0}"></label><label>영역<select data-rt="${r.id}" data-f="area">${C.areas.map(a=>`<option value="${a.id}" ${(r.area||'life')===a.id?'selected':''}>${esc(a.name)}</option>`).join('')}</select></label></div>
    <div class="vtable" style="margin-top:8px"><div class="vrow head" style="grid-template-columns:minmax(0,1.6fr) .5fr 1.2fr 26px 26px 26px"><span>단계</span><span>분</span><span>연결할 습관</span><span></span><span></span><span></span></div>
    ${r.steps.map((s,i)=>`<div class="vrow" style="grid-template-columns:minmax(0,1.6fr) .5fr 1.2fr 26px 26px 26px"><input data-rs="${r.id}" data-i="${i}" data-f="name" value="${esc(s.name)}" aria-label="단계 이름"><input data-rs="${r.id}" data-i="${i}" data-f="min" type="number" min="0" max="240" value="${s.min||0}" aria-label="분"><select data-rs="${r.id}" data-i="${i}" data-f="aid" aria-label="연결할 습관"><option value="">없음</option><option value="@weigh" ${s.aid==='@weigh'?'selected':''}>⚖ 몸무게 기록</option>${C.actions.filter(a=>a.type==='good').map(a=>`<option value="${a.id}" ${s.aid===a.id?'selected':''}>${esc(a.name)}</option>`).join('')}</select><button class="x" data-rsmove="${r.id}" data-i="${i}" data-d="-1" ${i?'':'disabled'} aria-label="위로">↑</button><button class="x" data-rsmove="${r.id}" data-i="${i}" data-d="1" ${i<r.steps.length-1?'':'disabled'} aria-label="아래로">↓</button><button class="x" data-rsdel="${r.id}" data-i="${i}" aria-label="단계 지우기">×</button></div>`).join('')}</div>
    <div class="row"><button class="btn sm ghost" data-rsadd="${r.id}">＋ 단계</button><span class="tiny muted">총 ${r.steps.reduce((s,x)=>s+(+x.min||0),0)}분</span><span style="flex:1"></span><button class="btn sm" data-rrun="${r.id}">⏱ 시작</button><button class="btn sm ghost" data-rtdel="${r.id}">루틴 지우기</button></div></div>`).join('')+
  `</div><div class="row" style="margin-top:10px"><button class="btn sm" data-rtadd="1">＋ 새 루틴</button></div>`;
}
function listsEditHTML(){
  const tg={};Object.values(TASKS).forEach(t=>(t.tags||[]).forEach(x=>tg[x]=(tg[x]||0)+1));
  return `<h3>왼쪽 목록 순서 · 보이기</h3><p class="help">⋮⋮를 끌어서 순서를 바꾸고, 체크를 끄면 숨겨요.</p>
  <div class="order" data-drop="reorder:smart">${smartOrder().map(([k,on])=>`<div class="or hrow" data-rowid="${k}"><span class="hand" data-drag="row:${k}" data-dragmode="now" aria-label="끌어서 순서 바꾸기">⋮⋮</span><input type="checkbox" data-smart="${k}" ${on?'checked':''} style="width:auto" aria-label="보이기"><span>${esc((SMART.find(s=>s[0]===k)||['',''])[1])}</span><span></span><span></span></div>`).join('')}</div>
  <h3 style="margin-top:18px">내 목록</h3><p class="help">목록은 '어디에 두나'만 정해요. 컨디션 영역은 목록이 아니라 <b>할 일 자체·태그·연결한 습관</b>에서 와요(셋 다 없으면 컨디션은 그대로, XP만). 설명은 왼쪽 목록에 마우스를 올리면 보여요. 폴더는 같은 이름끼리 묶여요. ⋮⋮로 순서를 바꿔요(할 일 화면 왼쪽 목록에서 바로 끌어도 돼요).</p>
  <div class="vtable" data-drop="reorder:lists"><div class="vrow head" style="grid-template-columns:16px minmax(0,1.2fr) .8fr minmax(0,1.8fr) 1fr 26px"><span></span><span>목록</span><span>폴더</span><span>설명</span><span>구슬</span><span></span></div>
  ${C.lists.map(l=>`<div class="vrow" data-rowid="${l.id}" style="grid-template-columns:16px minmax(0,1.2fr) .8fr minmax(0,1.8fr) 1fr 26px"><span class="hand" data-drag="row:${l.id}" data-dragmode="now" aria-label="끌어서 순서 바꾸기" style="cursor:grab;touch-action:none;color:var(--muted)">⋮⋮</span><input data-ls="${l.id}" data-f="name" value="${esc(l.name)}" ${l.id==='inbox'?'disabled':''} aria-label="목록 이름"><input data-ls="${l.id}" data-f="folder" value="${esc(l.folder||'')}" placeholder="—" ${l.id==='inbox'?'disabled':''} aria-label="폴더"><input data-ls="${l.id}" data-f="desc" value="${esc(l.desc||'')}" placeholder="어떤 목록?" aria-label="설명"><select data-ls="${l.id}" data-f="marble" aria-label="구슬">${jarSelOpts().map(([v,lb])=>`<option value="${esc(v)}" ${(l.marble||'')===v?'selected':''}>${esc(lb)}</option>`).join('')}</select><button class="x" data-lsdel="${l.id}" ${l.id==='inbox'?'disabled':''} aria-label="목록 지우기">×</button></div>`).join('')}</div>
  <div class="row" style="margin-top:10px"><button class="btn sm" data-tlistadd="1">＋ 새 목록</button></div>
  <h3 style="margin-top:18px">태그 → 영역</h3><p class="help">한 목록 안에 여러 갈래가 있을 때(예: Project 안의 #재정관리·#헌팅·#영상) 태그로 컨디션 영역을 정해요. 할 일에 직접 고른 영역이 가장 먼저예요.</p>
  ${Object.keys(tg).length?`<div class="kv">${Object.entries(tg).sort((a,b)=>b[1]-a[1]).slice(0,30).map(([x,n])=>`<label>#${esc(x)} <span class="tiny">(${n})</span><select data-tagarea="${esc(x)}"><option value="">영역 없음</option>${C.areas.map(a=>`<option value="${a.id}" ${(C.tagArea||{})[x]===a.id?'selected':''}>${esc(a.name)}</option>`).join('')}</select></label>`).join('')}</div>`:'<p class="tiny muted">아직 태그가 없어요.</p>'}
  <h3 style="margin-top:18px">할 일 보상</h3><div class="kv" style="margin-top:6px"><label>⚡ 퀵 XP<input data-rule="taskXP.quick" type="number" min="0" value="${C.taskXP.quick}"></label><label>🕓 보통 XP<input data-rule="taskXP.mid" type="number" min="0" value="${C.taskXP.mid}"></label><label>🧱 무거움 XP<input data-rule="taskXP.heavy" type="number" min="0" value="${C.taskXP.heavy}"></label><label>제때 끝내면 +XP<input data-rule="taskXP.onTime" type="number" min="0" value="${C.taskXP.onTime}"></label><label>중요도 ! 보너스<input data-rule="taskXP.prio.1" type="number" min="0" value="${C.taskXP.prio[1]}"></label><label>!! 보너스<input data-rule="taskXP.prio.3" type="number" min="0" value="${C.taskXP.prio[3]}"></label><label>!!! 보너스<input data-rule="taskXP.prio.5" type="number" min="0" value="${C.taskXP.prio[5]}"></label></div>
  <h3 style="margin-top:18px">완료할 때</h3><p class="help">체크하면 바로 기록되고, 아래에 ×2·구슬·편집 버튼이 잠깐 떠요. 세부 옵션이 있는 행동은 항상 창이 떠요.</p>
  <div class="seg3">${[['smart','필요할 때만 창'],['always','항상 창 열기']].map(([v,l])=>`<button data-sheetmode="${v}" aria-pressed="${(C.ui.sheet||'smart')===v}">${l}</button>`).join('')}</div>
  <h3 style="margin-top:18px">가챠</h3><div class="kv" style="margin-top:6px"><label>가챠 퀘스트 XP 배수<input data-rule="gacha.mult" type="number" step="0.1" min="1" max="3" value="${C.gacha.mult||1.5}"></label><label>다시 뽑기 기본 골드<input data-rule="gacha.rerollBase" type="number" min="0" value="${C.gacha.rerollBase||20}"></label><label>퀘스트 포기 골드<input data-rule="gacha.giveup" type="number" min="0" value="${C.gacha.giveup||30}"></label></div>`;
}
/* ================= v5: 틱틱 가져오기 ================= */
function parseCSV(text){
  const rows=[];let row=[],f='',q=false;
  for(let i=0;i<text.length;i++){const c=text[i];
    if(q){if(c==='"'){if(text[i+1]==='"'){f+='"';i++}else q=false}else f+=c}
    else if(c==='"')q=true;else if(c===','){row.push(f);f=''}else if(c==='\n'){row.push(f);rows.push(row);row=[];f=''}else if(c!=='\r')f+=c}
  if(f||row.length){row.push(f);rows.push(row)}return rows;
}
function ttLocal(iso,tz){if(!iso)return null;const d=new Date(iso.replace(/\+0000$/,'Z'));if(isNaN(d))return null;
  const p=new Intl.DateTimeFormat('en-CA',{timeZone:tz||'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(d);const g=k=>(p.find(x=>x.type===k)||{}).value;
  return{date:`${g('year')}-${g('month')}-${g('day')}`,time:`${g('hour')==='24'?'00':g('hour')}:${g('minute')}`,ms:d.getTime()}}
const LIST_AREA=[[/expense|💳|가계|돈|지출/i,'money'],[/atelier|project|focus|푸가|작업|시나리오|cinematheque|screening|upcoming|archive|on screen/i,'make'],[/book|music|podcast|youtube|exhibition|stroke|note/i,'mind'],[/limen|운동|health/i,'body']];
function ttAnalyze(text){
  const all=parseCSV(text.replace(/^﻿/,''));const hi=all.findIndex(r=>r[0]==='Folder Name');if(hi<0)throw new Error('틱틱 백업 CSV가 아니에요');
  const H=all[hi],rows=all.slice(hi+1).filter(r=>r.length>=H.length-2).map(r=>Object.fromEntries(H.map((h,i)=>[h,r[i]||''])));
  const hist={};rows.forEach(r=>{if(r.Status==='2'){const k=r.Title.trim();const c=(r['Completed Time']||'').slice(0,10);const o=hist[k]=hist[k]||{n:0,last:''};o.n++;if(c>o.last)o.last=c}});
  const lists={};rows.forEach(r=>{const k=r['List Name']||'Inbox';const o=lists[k]=lists[k]||{name:k,folder:r['Folder Name']||'',open:0,all:0};o.all++;if(r.Status==='0')o.open++});
  const open=rows.filter(r=>r.Status==='0');
  return{rows,open,lists:Object.values(lists).sort((a,b)=>b.open-a.open),hist,done:rows.filter(r=>r.Status==='2').length};
}
function ttConvert(A,pickLists){
  const have=new Set(Object.values(TASKS).map(t=>t.ttid).filter(Boolean));
  const byId={};A.rows.forEach(r=>byId[r.taskId]=r);
  const listMap={};const out=[];
  const ensureList=(name,folder)=>{if(name==='Inbox'||!name)return 'inbox';if(listMap[name])return listMap[name];
    let l=C.lists.find(x=>x.name===name)||(lnorm(name)?C.lists.find(x=>lnorm(x.name)===lnorm(name)):null);if(!l){const area=(LIST_AREA.find(([re])=>re.test(name+' '+folder))||[0,'life'])[1];l={id:'l'+uid(),name,folder:folder||'',area};C.lists.push(l)}
    return listMap[name]=l.id};
  const subsFrom=(content,kind)=>{const subs=[];let note=[];String(content||'').split('\n').forEach(line=>{let m=line.match(/^\s*[-*]\s\[( |x|X)\]\s?(.*)$/);if(m){if(m[2].trim())subs.push({t:m[2].trim(),done:m[1]!==' '});return}
      m=line.match(/^\s*([▫▪])(.*)$/);if(m&&kind==='CHECKLIST'){if(m[2].trim())subs.push({t:m[2].trim(),done:m[1]==='▪'});return}note.push(line)});
    return{subs,note:note.join('\n').replace(/\n{3,}/g,'\n\n').trim()}};
  A.open.forEach(r=>{
    if(!pickLists.has(r['List Name']||'Inbox'))return;if(have.has(r.taskId))return;
    if(r.parentId&&byId[r.parentId]&&byId[r.parentId].Status==='0')return; // 부모 안의 하위 할 일로
    const tz=r.Timezone||'Asia/Seoul',allDay=r['Is All Day']==='true';const sd=ttLocal(r['Start Date'],tz),dd=ttLocal(r['Due Date'],tz);
    const{subs,note}=subsFrom(r.Content,r.Kind);
    A.rows.filter(c=>c.parentId===r.taskId&&c.Status!=='-1').forEach(c=>subs.push({t:c.Title.trim(),done:c.Status==='2'}));
    const tags=(r.Tags||'').split(',').map(x=>x.trim()).filter(Boolean);
    const p={title:r.Title.trim()||'(제목 없음)',note,subs,tags,prio:+r.Priority||0,list:ensureList(r['List Name'],r['Folder Name']),ttid:r.taskId,rep:parseRRule(r.Repeat)};
    if(sd){p.due=sd.date;if(!allDay){p.time=sd.time;if(dd&&dd.ms>sd.ms)p.dur=Math.round((dd.ms-sd.ms)/60000)}}
    if(tags.some(x=>/중요/.test(x))&&!p.prio)p.prio=3;
    if(r['Column Name']&&!/^(Not Sectioned|Inbox)$/.test(r['Column Name']))p.sec=r['Column Name'];
    const h=A.hist[r.Title.trim()];if(h)p.hist=h;
    if(p.rep&&!p.due)p.due=dateKey();
    const t=newTask(p);t.created=(r['Created Time']||'').slice(0,10)||dateKey();t.order=+r.Order||Date.now();out.push(t);
  });
  return out;
}
let ttPending=null;
function importBoxHTML(){
  if(!ttPending)return `<p class="help">틱틱 → 설정 → 계정 → 백업 생성으로 받은 <b>CSV 파일</b>을 고르면, 아직 안 끝낸 할 일을 목록·태그·반복·하위 할 일·시간까지 그대로 가져와요. 끝낸 기록은 '틱틱에서 N번 완료'로만 붙어요(XP는 안 줘요). 여러 번 가져와도 같은 할 일은 겹치지 않아요.</p><div class="row"><button class="btn sm" id="ttPick">틱틱 CSV 고르기</button><input type="file" id="ttFile" accept=".csv,text/csv" hidden></div>`;
  const A=ttPending;
  return `<div class="imp"><div class="sum"><div class="tile"><span>열린 할 일</span><b class="num">${A.open.length}</b></div><div class="tile"><span>완료 기록</span><b class="num">${A.done}</b></div><div class="tile"><span>목록</span><b class="num">${A.lists.length}</b></div><div class="tile"><span>반복</span><b class="num">${A.open.filter(r=>r.Repeat).length}</b></div></div>
    <div class="small muted">가져올 목록 (열린 할 일이 있는 것만):</div>
    <div class="lists">${A.lists.filter(l=>l.open).map(l=>`<label><input type="checkbox" data-ttl="${esc(l.name)}" checked> ${esc(l.folder?l.folder+' / ':'')}${esc(l.name)} <b class="num">${l.open}</b></label>`).join('')}</div>
    <div class="row"><button class="btn sm" id="ttGo">가져오기</button><button class="btn ghost sm" id="ttCancel">취소</button></div></div>`;
}
async function ttImport(){
  const pick=new Set([...document.querySelectorAll('[data-ttl]:checked')].map(x=>x.dataset.ttl));
  const ts=ttConvert(ttPending,pick);
  ts.forEach(t=>{TASKS[t.id]=t});
  save('config');
  if(mode==='db'&&window.HQ_READY){try{const api=await window.HQ_READY;if(api.putTasks){await api.putTasks(ts)}else ts.forEach(t=>saveTask(t))}catch(e){console.error(e);ts.forEach(t=>saveTask(t))}}else{ts.forEach(t=>tDirty.add(t.id));save('local')}
  ttPending=null;renderMore();render();toast(`할 일 ${ts.length}개를 가져왔어요`);
  if(ts.length){C.ui.tasks.sel='today';location.hash='tasks'}
}
/* ================= v5: 알림 (앱이 열려 있을 때) ================= */
const notified=new Set();
function checkReminders(){
  const td=dateKey(),nm=nowMinutes();
  openTasks().forEach(t=>{if(t.due!==td||!t.time)return;const m=toMin(t.time);const key=t.id+td+t.time;if(notified.has(key))return;
    if(nm>=m&&nm<m+2){notified.add(key);toast(`⏰ ${t.time} ${t.title}`);buzz(300);
      try{if('Notification' in window&&Notification.permission==='granted')new Notification('⏰ '+t.title,{body:t.time+(t.dur?' · '+durTxt(t.dur):''),icon:'icons/icon-192.png',tag:t.id})}catch(e){}}});
}
setInterval(checkReminders,30000);
