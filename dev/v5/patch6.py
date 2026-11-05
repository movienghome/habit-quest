# ---------- v5.4 (patch.py 안에서 exec): 행동 카드 하나로 · 점수 다시 · 용기 표시 ----------
# 모듈 붙이기 (v5j 뒤)
i=s.index('/* ================= v5.4')if '/* ================= v5.4' in s else -1
if i<0:
    rep("function mig53(c,raw){",rd('v5k.js')+"\nfunction mig53(c,raw){")
# 설정 버전 8
rep("  mig53(c,raw);\n  c.v=7;\n  return c;","  mig53(c,raw);\n  mig54(c,raw);syncDailies(c);\n  c.v=8;\n  return c;")
rep("    if(rawCfgV!==null&&rawCfgV<7){save('config');}","    if(rawCfgV!==null&&rawCfgV<8){save('config');}")
rep("rawCfgV=7;rawProgHasMarbles=true;","rawCfgV=8;rawProgHasMarbles=true;")
rep("    if(C.v53news){","    if(C.v54news){delete C.v54news;save('config');later(()=>toast('v5.4 · 일퀘는 \\'매일\\' 습관 카드로 · 점수 새로 맞춤 · ⚔ 용기 표시',5200))}\n    if(C.v53news){")
rep("function render(){\n  if(tasksReady","function render(){\n  syncDailies(C);\n  if(tasksReady")
# 컨디션 = 평균이 아니라 모두 더한 값 (점수 낼 기회가 적은 영역이 끌어내리지 않게)
rep("function overallOf(day){const v=Object.values(areaValues(day));return v.length?Math.round(v.reduce((a,b)=>a+b,0)/v.length):0}",
"""function overallOf(day){
  const base=C.energyBase[(day.energy||3)-1]??60;let v=base;const ids=new Set(C.areas.map(a=>a.id));
  (day.entries||[]).forEach(e=>{if(e.cond&&ids.has(e.area))v+=e.cond});
  const fd=foodDelta(day);for(const k in fd)if(ids.has(k))v+=fd[k];
  neglectList(day.date).forEach(n=>{if(ids.has(n.t.area))v-=n.pen});
  return clamp(Math.round(v),0,100);
}""")
rep("영역(${C.areas.map(x=>esc(x.name)).join('·')})의 평균이에요.","좋은·나쁜 행동의 컨디션 점수를 모두 더해요. 영역(${C.areas.map(x=>esc(x.name)).join('·')})은 평균 내지 않고 균형만 보여줘요 — 점수 낼 일이 적은 영역이 깎아먹지 않아요.")
# 용기 표시 붙은 습관 → 용기 점수·용기 구슬
rep("const isBrave=e=>e.kind==='courage';","const isBrave=e=>e.kind==='courage'||!!e.brave;")
rep("  if(good){Object.assign(e,marbleFromLink(a.marble));if(e.jar&&n>1)e.mn=n}\n  if(amt)e.amt=Math.round(+amt);",
    "  if(good){Object.assign(e,marbleFromLink(a.marble));if(e.jar&&n>1)e.mn=n}\n  {const bz=good&&braveSize(a);if(bz){e.brave=1;e.pts=(+bz.pts||1)*n;if(!e.jar)Object.assign(e,marbleFromLink(bz.marble))}}\n  if(amt)e.amt=Math.round(+amt);")
# 연결 카드(몸무게·식사·용기) 누르면 그 기록으로
rep("function doAction(a,ctx={}){\n  if(!guard())return;","function doAction(a,ctx={}){\n  if(!guard())return;\n  if(a.link){linkGo(a);return}")
# 오늘의 습관: 연결 카드는 일퀘 줄로
rep("  const add=(a,why)=>{if(!a||a.type!=='good'||(a.once&&a.doneAt))return;","  const add=(a,why)=>{if(!a||a.type!=='good'||a.link||(a.once&&a.doneAt))return;")
rep("  const qs=C.dailies.filter(q=>!q.action||q.action.startsWith('@'));","  const qs=C.dailies.filter(q=>!C.actions.some(x=>x.id===q.action&&!x.link));")
# 일퀘 편집 탭 → 매일 습관
s,n=re.subn(r"  \}else if\(ui\.edit==='dailies'\)\{\n.*?\n  \}else if\(ui\.edit==='watches'\)\{","  }else if(ui.edit==='dailies'){h=dailiesEditHTML();\n  }else if(ui.edit==='watches'){",s,count=1,flags=re.S)
if n!=1:raise SystemExit('dailies tab')
rep("['dailies','일퀘']","['dailies','☑ 일퀘 (매일)']")
# 일퀘 정보창: 카드 편집으로
rep("""+qe('dailies',q,[['name','이름','text'],['xp','XP','num','min="0"'],['gold','골드','num','min="0"']])+btns(""","""+`<p class="small muted">점수는 습관 카드에서 정해요.</p>`+btns(((c0)=>c0?`<button class="btn ghost sm" data-aedit="${c0.id}">카드 편집</button>`:'')(C.actions.find(x=>x.daily&&(x.qid||'q'+x.id)===q.id)),""")
# 홈 일퀘 추가 → 매일 습관 카드
rep("  if(k==='quest'){C.dailies.push({id,name,action:'',xp:5,gold:5});","  if(k==='quest'){{const na={...newAction(id,name,'good',C.areas[0].id,''),daily:1},at=C.actions.findIndex(x=>x.type==='bad');C.actions.splice(at<0?C.actions.length:at,0,na);syncDailies(C)}")
# 새 습관 기본 점수 = 프리셋
rep("function newAction(id,name,type,area,once){return{id,name,type,area,cond:type==='good'?5:-15,gold:type==='good'?2:0,xp:type==='good'?10:0,marble:'',once:once?'1':''}}",
    "function newAction(id,name,type,area,once){const a={id,name,type,area,cond:0,gold:0,xp:0,marble:'',once:once?'1':''};const p=presetOf(type==='bad'?'p-bad':'p-mid',type)||presetList(type)[0];if(p)applyPreset(a,p);else{a.cond=type==='good'?3:-15;a.xp=type==='good'?8:0;a.gold=type==='good'?3:-5}return a}")
# 빠른 기록 '그냥 한 일' = 프리셋
rep("""  if(!guard())return;const sz=FREE_SIZES.find(x=>x[0]===size)||FREE_SIZES[1];
  let xp=sz[2];if(recoveryActive())xp=Math.round(xp*C.recovery.mult);
  const e={kind:'free',type:'good',name,area,cond:Math.round(sz[2]/3),gold:Math.round(sz[2]/4),xp};""",
"""  if(!guard())return;const sz=FREE_SIZES.find(x=>x[0]===size)||FREE_SIZES[1];
  const pr=presetOf(({s:'p-light',m:'p-mid',l:'p-hard'})[sz[0]],'good')||{xp:sz[2],gold:Math.round(sz[2]/4),cond:Math.round(sz[2]/3)};
  let xp=+pr.xp||0;if(recoveryActive())xp=Math.round(xp*C.recovery.mult);
  const e={kind:'free',type:'good',name,area,cond:Math.abs(+pr.cond||0),gold:Math.abs(+pr.gold||0),xp};""")
rep('<option value="s">작은 일 +5</option><option value="m" selected>보통 일 +10</option><option value="l">큰 일 +20</option>','<option value="s">가벼운 일</option><option value="m" selected>보통 일</option><option value="l">힘든 일</option>')
# 빠른 기록 용기: ⚔ 습관 카드도 찾기
rep("  else if(type==='brave'){const k=C.courage.find(x=>x.name===name);if(k)doBrave(k);",
    "  else if(type==='brave'){const k=C.courage.find(x=>x.name===name),ka=C.actions.find(x=>x.brave&&x.name===name);if(ka)doAction(ka);else if(k)doBrave(k);")
# 습관 편집 창: 맨 위 프리셋·점수 뜻, 용기 표시, 매일(일퀘)
rep("""  <div class="f2"><label class="f">이름<input data-ae="name" value="${esc(a.name)}" maxlength="60"></label>""",
    """  ${aeTopHTML(a)}
  <div class="f2"><label class="f">이름<input data-ae="name" value="${esc(a.name)}" maxlength="60"></label>""")
rep("""    ${good?`<label class="f">XP<input data-ae="xp" type="number" min="0" value="${a.xp||0}"></label>""",
    """    ${good?`<label class="f">XP<input data-ae="xp" type="number" min="0" value="${a.xp||0}"></label>${aeBraveHTML(a)}""")
rep("""📅 '오늘'에 띄우기</h3><p class="tiny muted" style="margin:0">일퀘·방치 경보에 걸리면 저절로 떠요. 그 밖에 띄울 요일을 고르거나 📌 고정해요.</p>
    <div class="row" style="gap:6px"><span class="wdays">""",
    """📅 리듬 · '오늘'에 띄우기</h3><p class="tiny muted" style="margin:0">☑ 매일로 두면 일퀘가 돼요 (오늘에 매일 뜨고, 일퀘를 다 하면 상자). 아니면 띄울 요일만 고르거나 📌 고정해요. 방치 경보에 걸려도 저절로 떠요.</p>
    <div class="row" style="gap:6px;flex-wrap:wrap"><button class="chipbtn" data-aedaily="1" aria-pressed="${!!a.daily}">☑ 매일 (일퀘)</button><span class="wdays">""")
# 습관 탭 도움말에 점수 뜻 · 맨 아래 프리셋 · 되돌리기
rep("""  return `<p class="help">반복하는 <b>습관</b> 목록이에요.""","""  return `<p class="help" style="border-left:3px solid var(--accent);padding-left:8px">${SCORE_MEANING}</p><p class="help">반복하는 <b>습관</b> 목록이에요. ☑ 매일로 두면 일퀘, ⚔ 표시는 용기예요.""")
rep('value="${C.chain.gold}"></label></div>`;','value="${C.chain.gold}"></label></div>`+presetsEditHTML()+scoreBakHTML();')
rep("""${a.money?' · 💰':''} · 30일""","""${a.money?' · 💰':''}${a.daily?' · ☑ 매일':''}${a.brave?' · ⚔':''}${a.link?' · 🔗':''} · 30일""")
# 용기 탭: ⚔ 습관 안내
rep("table('courage',[","braveCardsNote()+table('courage',[")
rep("""<span class="tx">+${q.xp||0}</span><span></span></div>`};""","""<span class="tx">${q.xp?'+'+q.xp:''}</span><span></span></div>`};""")
# 게임 방법: v5.4 설명
rep("    ${acc('today53',","""    ${acc('card54','🃏 행동 카드 하나로 · 점수 뜻 · ⚔ 용기','v5.4',`<ul><li>점수는 <b>습관 카드</b>에만 있어요. 일퀘·도파민 메뉴·할 일 연결·루틴은 그 카드를 보여주는 방법일 뿐이에요.</li><li><b>일퀘</b> = '☑ 매일'로 둔 습관 카드. 따로 점수가 없고, 다 하면 상자를 열어요. 몸무게·채소처럼 다른 기록과 이어진 카드(🔗)도 있어요.</li><li><b>XP</b> = 성장(레벨) · <b>골드</b> = 현실의 돈·자원 · <b>컨디션</b> = 지금의 몸과 마음. 상관없는 칸은 0이에요.</li><li>새 습관은 <b>프리셋</b>(가벼움·보통·힘듦·작품·일…)을 눌러 바로 채워요. 프리셋 숫자는 습관 탭 맨 아래에서 바꿔요.</li><li>습관 카드에 <b>⚔ 용기 표시</b>를 붙이면 할 때마다 용기 점수·용기 구슬이 함께 쌓여요.</li><li>HP(컨디션)는 영역 평균이 아니라 <b>모두 더한 값</b>이에요. 점수 낼 일이 적은 영역(경제 등)이 깎아먹지 않아요.</li></ul>`)}
    ${acc('today53',""")
