# ---------- v5.1 수정 (patch.py 안에서 exec) ----------
# 기본값
rep("ui:{skin:'forest',mode:'system',sheet:'smart',cal:{mode:'month',actual:true},","ui:{skin:'forest',mode:'system',sheet:'smart',start:'tasks',hide:[],split:true,fx:true,listW:0,cal:{mode:'3day',actual:true,fold:6,foldOn:true,filter:{lists:[],areas:[],tags:[]}},")
rep("home:[['profile',1],['brave',1],['today',1],['gacha',1],['quick',1],","home:[['profile',1],['battle',1],['brave',1],['today',1],['gacha',1],['quick',1],")
rep("  penalty:{same:.5,chain:.25,max:3},","  penalty:{same:.5,chain:.25,max:3},\n  happy:{xp:8,gold:3,cond:5},")
rep("['avatar','recovery','dailyBonus','weekly','taskXP','penalty','chain','gacha'].forEach(","['avatar','recovery','dailyBonus','weekly','taskXP','penalty','chain','gacha','happy'].forEach(")
rep("sheet:['smart','always'].includes(u.sheet)?u.sheet:'smart',cal:{...du.cal,...(u.cal||{})},",
    "sheet:['smart','always'].includes(u.sheet)?u.sheet:'smart',start:VIEWS.includes(u.start)?u.start:du.start,hide:Array.isArray(u.hide)?u.hide:[],split:u.split!==false,fx:u.fx!==false,listW:+u.listW||0,cal:{...du.cal,...(u.cal||{})},")
rep("  du.home.forEach(d=>{if(!c.ui.home.some(h=>h[0]===d[0]))c.ui.home.push(clone(d))});\n  c.v=5;",
"""  if(!(raw&&raw.v>=6)){
    seedDopa(c);
    c.ui.start='tasks';c.ui.cal.mode='3day';c.ui.cal.fold=6;c.ui.cal.foldOn=true;
    if(!c.ui.home.some(h=>h[0]==='battle')){const i=c.ui.home.findIndex(h=>h[0]==='profile');c.ui.home.splice(i>=0?i+1:0,0,['battle',1])}
    if(raw)c.v51news=1;
  }
  du.home.forEach(d=>{if(!c.ui.home.some(h=>h[0]===d[0]))c.ui.home.push(clone(d))});
  c.v=6;""")
rep("    if(rawCfgV!==null&&rawCfgV<5){save('config');}","    if(rawCfgV!==null&&rawCfgV<6){save('config');}")
rep("rawCfgV=5;rawProgHasMarbles=true;","rawCfgV=6;rawProgHasMarbles=true;")
rep("    runLater();\"\"\")" if False else "    if(C.v5news){delete C.v5news;","    if(C.v51news){delete C.v51news;save('config');if(!C.v5news)void 0&&later(()=>popup('v5.1','🛡️','<b>틱틱처럼 3단 화면</b>(넓은 화면), 캘린더 시간 접기·필터, 🍬 도파민 메뉴, ⚔ 사냥 고르기, 보스·쫄따구 전투, ✨ 행복 기록이 생겼어요.','v5.1'))}\n    if(C.v5news){delete C.v5news;")
# 시작: 마지막 화면 사본 / 로딩 가리기
rep("async function boot(){\n  render();","async function boot(){\n  if(!snapLoad())document.body.classList.add('booting');\n  render();")
# 렌더
rep("  applyTheme();renderNav();applyHome();","  placeCal();applyTheme();renderNav();applyHome();\n  if(ready){document.body.classList.remove('booting');snapSave()}")
rep("  renderHomeV5();renderTasks();renderCal();renderGacha();","  renderHomeV5();renderBattle();renderTasks();renderCal();renderGacha();renderDopa();")
# 골드 누수 고치기: 되돌릴 때 0에서 멈추지 않게
rep("  P.gold=Math.max(0,P.gold-(e.gold||0));P.xp=Math.max(0,P.xp-(e.xp||0));\n  if(e.jar&&P.marbles[e.jar]){const arr=P.marbles[e.jar];for(let k=0;",
    "  P.gold-=e.gold||0;P.xp=Math.max(0,P.xp-(e.xp||0));\n  if(e.jar&&P.marbles[e.jar]){const arr=P.marbles[e.jar];for(let k=0;")
# 전투 연출: 새로 생긴 기록 보고
rep("function commit(fn,extraDays){\n  const before=levelOf(P.xp).lv,bt=braveTitle().name;\n  fn();",
    "function commit(fn,extraDays){\n  const before=levelOf(P.xp).lv,bt=braveTitle().name;\n  const _d0=curDay(),_ids=new Set(_d0.entries.map(x=>x.id));\n  fn();\n  {const ne=curDay().entries.filter(x=>!_ids.has(x.id)&&!['chest','boss','wbrave','badge','buy','quest'].includes(x.kind));const xp=ne.reduce((s,x)=>s+(x.xp||0),0),gd=ne.reduce((s,x)=>s+Math.max(0,x.gold||0),0),bad=ne.find(x=>x.type==='bad');\n   if(bad)setTimeout(()=>battleFx(Math.abs(bad.cond||0),{bad:true}),60);else if(xp>0)setTimeout(()=>battleFx(xp,{kill:ne.some(x=>x.tid),gold:gd}),60)}")
# 기록 탭 목록: 도파민 따로
rep("const pool=sortList(C.actions.filter(x=>!x.doneAt&&(LS.filter==='all'||x.type===LS.filter)),stat,LS.sort);",
    "const pool=sortList(C.actions.filter(x=>!x.doneAt&&(LS.filter==='all'?!x.dopaOnly:LS.filter==='dopa'?!!x.dopa:(x.type===LS.filter&&!x.dopaOnly))),stat,LS.sort);")
rep("[['good','▲ 좋은'],['bad','▼ 나쁜'],['all','모두']].map(([v,l])=>`<button data-lfilter=","[['good','▲ 좋은'],['bad','▼ 나쁜'],['dopa','🍬 도파민'],['all','모두']].map(([v,l])=>`<button data-lfilter=")
# 빠른 기록: 행복
rep('<option value="bad">▼ 나쁜</option></select><select id="qArea"','<option value="bad">▼ 나쁜</option><option value="happy">✨ 행복</option></select><select id="qArea"')
rep("   const ty=$('qType').value;qa.hidden=ty==='brave';$('qSize').hidden=ty!=='good';","   const ty=$('qType').value;qa.hidden=ty==='brave';$('qSize').hidden=ty!=='good';$('qHelp').textContent=ty==='happy'?`행복했던 순간을 적어요. 생산성이 아니어도 좋아요 · XP +${C.happy.xp}, 🪙${C.happy.gold}, '좋았다' 병에 구슬`:`습관 이름이면 그 습관으로, 아니면 '그냥 한 일'로 기록돼요(습관 목록에 안 쌓여요).`;")
rep("  if(how==='todo'){addTaskFrom((type==='brave'?'⚡':'')+name,{due:dateKey()})}","  if(type==='happy'&&how!=='todo'){doHappy(name,area)}\n  else if(how==='todo'){addTaskFrom((type==='brave'?'⚡':'')+name,{due:dateKey()})}")
rep("e.kind==='chain'?'⛓':e.type==='bad'?'▼':'▲';\n  const ar=","e.kind==='chain'?'⛓':e.kind==='happy'?'✨':e.type==='bad'?'▼':'▲';\n  const ar=")
rep("let good=0,bad=0,brave=0,marb=0,chest=0,clean=0,tdone=0,saved=0,spent=0;","let good=0,bad=0,brave=0,marb=0,chest=0,clean=0,tdone=0,saved=0,spent=0,happy=0;")
rep("days.forEach(d=>{(d.entries||[]).forEach(e=>{if(e.tid)tdone++;","days.forEach(d=>{(d.entries||[]).forEach(e=>{if(e.kind==='happy')happy++;if(e.tid)tdone++;")
rep("['✓ 끝낸 할 일',tdone+'개'],","['✓ 끝낸 할 일',tdone+'개'],['✨ 행복 기록',happy+'번'],")
rep("'avg','task','money'][i]","'avg','task','happy','money'][i]")
rep("task:['✓ 끝낸 할 일',","happy:['✨ 행복 기록','특별한 행동이 아니어도 좋았던 순간(시원한 바람, 예쁜 햇빛, 좋은 대화)을 적은 횟수예요.'],task:['✓ 끝낸 할 일',")
# 시작 화면
rep("function curView(){let v=location.hash.slice(1);if(v==='today')v='home';return VIEWS.includes(v)?v:'home'}",
    "function curView(){let v=location.hash.slice(1);if(v==='today')v='home';return VIEWS.includes(v)?v:((C.ui&&VIEWS.includes(C.ui.start))?C.ui.start:'home')}")
rep("const HQ={logout:async()=>(await window.HQ_READY).logout()};","const HQ={logout:async()=>{try{localStorage.removeItem('hq-snap'+(location.pathname.includes('/beta/')?'-b':''))}catch(e){}(await window.HQ_READY).logout()}};")
# 옆 메뉴 숨기기
rep("  const sd=NAV_ITEMS.map(([id,l])=>","  const sd=NAV_ITEMS.filter(([id])=>!(C.ui.hide||[]).includes(id)||id===cur).map(([id,l])=>")
rep("const hidden=NAV_ITEMS.filter(n=>!nav.includes(n[0]));","const hidden=NAV_ITEMS.filter(n=>!nav.includes(n[0])&&!(C.ui.hide||[]).includes(n[0]));")
# 화면 편집: 홈 끌기, 시작 화면, 3단, 연출, 옆 메뉴 숨기기
rep('<div class="order">${C.ui.home.map(([id,on],i)=>`<div class="or"><input',
    '<div class="order" data-drop="reorder:home">${C.ui.home.map(([id,on],i)=>`<div class="or hrow" data-rowid="${id}"><span class="hand" data-drag="row:${id}" data-dragmode="now" aria-label="끌어서 순서 바꾸기">⋮⋮</span><input')
rep('return `<div class="or"><input type="checkbox" id="nv-${id}"','return `<div class="or nrow"><input type="checkbox" id="nv-${id}"')
rep('<b>${ic(id)} ${l}</b> <span class="tiny muted">${d}</span></label>','<b>${ic(id)} ${l}</b> <span class="tiny muted">${d}</span></label><label class="tiny muted row" style="gap:3px;flex-wrap:nowrap" title="PC 왼쪽 메뉴·더보기에 보이기"><input type="checkbox" data-sidehide="${id}" ${(C.ui.hide||[]).includes(id)?\'\':\'checked\'} ${id===\'home\'||id===\'edit\'?\'disabled\':\'\'} style="width:auto">메뉴</label>')
rep('      <h3 style="margin-top:18px">홈 화면</h3>','''      <h3 style="margin-top:18px">시작 화면 · 레이아웃</h3><div class="kv" style="margin-top:6px"><label>앱을 열면<select data-uiset="start">${NAV_ITEMS.map(([id,l])=>`<option value="${id}" ${C.ui.start===id?'selected':''}>${l}</option>`).join('')}</select></label><label>넓은 화면(1200px↑) 할 일 탭<select data-uiset="split"><option value="1" ${C.ui.split!==false?'selected':''}>목록 + 캘린더 3단</option><option value="" ${C.ui.split===false?'selected':''}>목록만</option></select></label><label>캘린더 시간 접기<select data-uiset="fold">${[0,5,6,7,8].map(h=>`<option value="${h}" ${(+C.ui.cal.fold||0)===h?'selected':''}>${h?'0~'+h+'시 접기':'안 접기'}</option>`).join('')}</select></label><label>전투 연출<select data-uiset="fx"><option value="1" ${C.ui.fx!==false?'selected':''}>보이기</option><option value="" ${C.ui.fx===false?'selected':''}>끄기</option></select></label></div>
      <p class="help">아래 메뉴 칸의 '메뉴' 체크를 끄면 PC 왼쪽 메뉴와 더보기에서 숨겨져요(예: 사냥·뽑기를 안 쓸 때).</p>
      <h3 style="margin-top:18px">홈 화면</h3>''')
rep("<p class=\"help\">홈에 보일 칸과 순서를 정해요. 각 칸 제목 옆 ⌄ 버튼으로 접었다 펼 수도 있어요.","<p class=\"help\">홈에 보일 칸과 순서를 정해요. 왼쪽 ⋮⋮를 끌어서 순서를 바꿔요. 각 칸 제목 옆 ⌄ 버튼으로 접었다 펼 수도 있어요.")
rep("  if(d.hometoggle){","  if(d.sidehide){const h=C.ui.hide=C.ui.hide||[];C.ui.hide=t.checked?h.filter(x=>x!==d.sidehide):[...h,d.sidehide];t.blur();save('config');render();return}\n  if(d.uiset){const k=d.uiset,v=t.value;if(k==='start')C.ui.start=v;else if(k==='split')C.ui.split=!!v;else if(k==='fx')C.ui.fx=!!v;else if(k==='fold'){C.ui.cal.fold=+v;C.ui.cal.foldOn=!!+v}t.blur();save('config');render();toast('바꿨어요');return}\n  if(d.hometoggle){")
rep("const HOME_BLOCKS={profile:'캐릭터·컨디션',","const HOME_BLOCKS={profile:'캐릭터·컨디션',battle:'⚔ 전투 (보스·쫄따구)',")
# 검색
rep("[['gacha','뽑기(가챠)','필터 걸고 3·5장 뽑기'],","[['gacha','뽑기(가챠)','필터 걸고 3·5장 뽑기'],['gacha','도파민 메뉴','애피타이저·사이드·메인·디저트·스페셜'],")
rep("  (C.routines||[]).forEach(r=>add('루틴',","  add('기능','⚔ 사냥 고르기','시간표·할 일·습관·도파민에서 골라 타이머 시작',()=>openHuntPicker(),'hunt timer 타이머');\n  add('기능','✨ 행복 기록','홈 빠른 기록에서 종류를 ✨ 행복으로',()=>{location.hash='home';setTimeout(()=>{$('qType').value='happy';render();$('qName').focus()},80)},'happy');\n  (C.routines||[]).forEach(r=>add('루틴',")
# 서비스 워커: 새 버전이 들어오면 한 번 새로고침
rep("if('serviceWorker' in navigator&&location.protocol==='https:')window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));})();",
    "if('serviceWorker' in navigator&&location.protocol==='https:'){const had=!!navigator.serviceWorker.controller;let rl=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!had||rl)return;rl=true;location.reload()});window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').then(r=>r.update()).catch(()=>{}))}})();")
# 안내
rep("    ${acc('once','습관 · 할 일 · 그냥 한 일','어디에 적을까',",
"""    ${acc('happy','✨ 행복 기록 · 🍬 도파민 · ⚔ 전투','생산성만이 가치는 아니니까',`<ul><li><b>✨ 행복</b>: 자전거 타다 너무 시원했을 때, 햇빛이 예뻤을 때, 친구와 좋은 대화를 했을 때. 홈 빠른 기록에서 종류를 ✨ 행복으로 골라 적어요. 정해진 작은 보상(XP +${C.happy.xp})과 '좋았다' 병 구슬. 크게 주지 않는 건, 점수를 위해 행복을 짜내지 않게 하려는 거예요.</li><li><b>🍬 도파민 메뉴</b>: 시작부터 기분 좋아지는 것들을 애피타이저·사이드·메인·디저트·스페셜로 나눠요. 뽑기 탭에서 고르거나 🍬 3장 뽑기.</li><li><b>⚔ 전투</b>: 오늘 할 일이 쫄따구, 주간 보스는 그 주 XP로 쓰러뜨려요. 끝낼 때마다 아바타가 공격해요(편집 → 테마·화면에서 끌 수 있어요).</li><li><b>⚔ 사냥 고르기</b>: 오늘 시간표·할 일·습관(영역별)·도파민·루틴에서 골라 바로 타이머 시작.</li></ul>`)}
    ${acc('once','습관 · 할 일 · 그냥 한 일','어디에 적을까',""")
