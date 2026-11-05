# ---------- v5.5 (patch.py 안에서 exec): 1단계 마무리 ----------
# 모듈은 스크립트 맨 끝에 (같은 이름 함수는 뒤에 있는 게 이김)
i=s.rindex('</script>\n<script type="module" src="backend.js"></script>')
s=s[:i]+rd('v5l.js')+'\n'+s[i:]
rep('</style>\n\n<header','''.erow3{display:grid;grid-template-columns:22px auto minmax(0,1fr) auto;gap:8px;align-items:center;padding:7px 2px;border-bottom:1px solid var(--line);background:var(--panel)}
.erow3.on{background:color-mix(in srgb,var(--accent) 12%,var(--panel))}
.erow3 .hand{cursor:grab;touch-action:none;color:var(--muted);text-align:center;user-select:none}
.erow3 .nm{min-width:0;display:grid;gap:3px;border:0;background:none;text-align:left;font:inherit;color:inherit;cursor:pointer;padding:0}
.erow3 .nm b{font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.erow3.dragsrc{opacity:.35}
.erow3 .qa{display:flex;gap:4px;align-items:center}
.mcs{display:flex;flex-wrap:wrap;gap:4px;align-items:center}
.mx{font-size:11px;line-height:1.55;padding:0 7px;border-radius:999px;border:1px solid var(--line);white-space:nowrap;color:inherit}
.mx.ar{border-style:dashed;color:var(--muted)}
.mx.xp{background:color-mix(in srgb,#d9a21b 18%,transparent);border-color:color-mix(in srgb,#d9a21b 45%,transparent)}
.mx.gd{background:color-mix(in srgb,#b8862b 12%,transparent)}
.mx.cd{background:color-mix(in srgb,var(--good) 14%,transparent)}
.mx.cd.neg{background:color-mix(in srgb,var(--bad) 14%,transparent);border-style:dotted}
.mx.rh{font-weight:700;border-color:var(--good)}
.mx.bv{background:color-mix(in srgb,var(--brave) 18%,transparent);border-color:var(--brave);font-weight:700}
.mx.n,.mx.op,.mx.du{color:var(--muted)}
.ib{width:30px;height:30px;border-radius:8px;border:1px solid var(--line);background:none;cursor:pointer;font-size:14px;color:inherit;opacity:.55}
.ib:hover{opacity:1}
.ib[aria-pressed="true"]{opacity:1;background:color-mix(in srgb,var(--good) 20%,transparent);border-color:var(--good);font-weight:800}
.bulk55{position:sticky;top:0;z-index:3;display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding:8px;border:2px solid var(--accent);border-radius:10px;background:var(--panel);margin:6px 0}
.bulk55 select{width:auto}
.aeshow{position:relative}.aeshow>summary{list-style:none;cursor:pointer}.aeshow>summary::-webkit-details-marker{display:none}
.aeshow .pop55{position:absolute;right:0;top:110%;z-index:6;background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:8px 10px;display:grid;gap:4px;min-width:160px;box-shadow:0 6px 20px rgba(0,0,0,.18)}
.tbtn55{margin-left:8px;background:var(--panel);color:var(--ink);border:0;border-radius:8px;padding:3px 10px;font-weight:700;cursor:pointer}
@media (max-width:600px){.erow3 .hidem{display:none}.erow3 .ib{width:34px;height:34px}}
</style>

<header''')
# 베타 표시에 버전
rep('<b>β 베타</b>','<b>β 베타 v5.5</b>')
# 이름: 습관(행동) → 행동/습관, 습관 카드 → 행동 카드
s=s.replace('습관(행동)','행동/습관').replace('습관 카드','행동 카드')
# 행동 카드 편집: '완료'를 눌러야 저장 (× · 바깥 = 취소)
rep('<button class="btn" data-sheet="close">완료</button>','<span class="tiny muted" style="align-self:center">완료를 눌러야 저장돼요</span><button class="btn" data-aedone="1">완료</button>')
# 정보 창(이름 꾹/탭): 반쪽 편집칸 대신 칩 요약 + 편집 버튼 하나로
s,n=re.subn(r"\+qe\('actions',x,\[\['name','이름','text'\].*?\]:\[\]\),\]\)\+","+`<div class=\"mcs\" style=\"margin:8px 0\">${metaChips(x,null,aeShowAll().map(z=>z[0]))}</div>`+",s,count=1,flags=re.S)
if n!=1:raise SystemExit('info act qe')
rep("'바꾸면 바로 저장돼요. 구슬을 고르면 누를 때 병에도 들어가요.'","'점수·리듬(매일)·⚔ 용기·옵션은 ✎ 편집에서 한 번에 바꿔요.'")
rep('<button class="btn ghost sm" data-aedit="${x.id}">옵션·문구·전체 편집</button>','<button class="btn sm" data-aedit="${x.id}">✎ 편집</button>')
rep("d.goedit||d.guide||d.sugbrave","d.goedit||d.aedit||d.guide||d.sugbrave")
# 할 일 상세: 연결된 카드 보이기
rep("· +${a.xp}</option>`).join('')}</select></label>","· +${a.xp}</option>`).join('')}</select></label>${taskCardNote(t)}")
rep('<summary class="small" style="cursor:pointer;font-weight:700">더 보기 · 습관 연결 · 태그 · 영역</summary>','<summary class="small" style="cursor:pointer;font-weight:700">더 보기 · 행동 카드 연결 · 태그 · 영역</summary>')
# 오늘: 연결된 할 일이 오늘 있으면 습관 줄은 숨김 (같은 행동이 두 번 안 뜨게)
rep("  const add=(a,why)=>{if(!a||a.type!=='good'||a.link||(a.once&&a.doneAt))return;","  const tAids=todayTaskAids();\n  const add=(a,why)=>{if(!a||a.type!=='good'||a.link||tAids.has(a.id)||(a.once&&a.doneAt))return;")
# 루틴: 단계마다 카드 점수가 들어가니, 루틴 자체는 '완주 보너스'만
rep("let xp=Math.round((+(r&&r.xp)||20)*done/all);if(done===all)xp+=sp.bonus;","let xp=done===all?(+(r&&r.xp)||0)+sp.bonus:0;")
rep("cond:done===all?6:3","cond:0")
rep("<b>+${e.xp} XP</b>${done===all&&sp.bonus?","${e.xp?`<b>완주 보너스 +${e.xp} XP</b>`:'<span class=\"muted\">단계마다 카드 점수가 들어갔어요 · 완주 보너스는 다 끝냈을 때만</span>'}${done===all&&sp.bonus?")
rep('<label>완주 XP<input data-rt=','<label>완주 보너스 XP<input data-rt=')
# 스마트 목록 늘리기
rep("['focus','🎯 집중'],['nodate','💭 날짜 없음'],['all','📋 전체']","['focus','🎯 집중'],['overdue','⏰ 지난 것'],['soon','⏳ 마감 3일 안'],['brave','⚡ 용기'],['skull','☠ 미룬 것'],['habit','🔁 습관 연결'],['nodate','💭 날짜 없음'],['all','📋 전체']")
rep("if(sel==='all')return t.status===0;","""if(sel==='overdue')return t.status===0&&!!t.due&&t.due<td;
  if(sel==='soon')return t.status===0&&!!t.deadline&&t.deadline<=addDays(td,3);
  if(sel==='brave')return t.status===0&&(!!t.brave||!!(t.aid&&(C.actions.find(a=>a.id===t.aid)||{}).brave));
  if(sel==='skull')return t.status===0&&(t.skull||0)>0;
  if(sel==='habit')return t.status===0&&!!t.aid;
  if(sel==='all')return t.status===0;""")
# 검색: '용기' '습관' '매일'로 카드·할 일 찾기
rep("C.actions.forEach(a=>add(a.type==='good'?'좋은 행동':'나쁜 행동',a.name,'꾹 누르면 설명, 눌러서 바로 기록',()=>openInfo('act:'+a.id)));",
    "C.actions.forEach(a=>add(a.brave?'⚔ 용기 카드':isHabit(a)?'🔁 습관':a.type==='good'?'좋은 행동':'나쁜 행동',a.name,(rhythmOf(a)?rhythmOf(a)+' · ':'')+'눌러서 설명·편집',()=>openInfo('act:'+a.id),(a.brave?'용기 brave ⚔ ':'')+(isHabit(a)?'습관 리듬 매일 일퀘':'')));\n  add('할 일','⚡ 용기 할 일 목록','용기 표시가 붙은 할 일만',()=>{C.ui.tasks.sel='brave';location.hash='tasks';renderTasks()},'용기 brave');")
rep("()=>openTaskSheet(t.id),(t.tags||[]).join(' ')));","()=>openTaskSheet(t.id),(t.tags||[]).join(' ')+(t.brave?' 용기 ⚡':'')));")
# 게임 방법: 새로 바뀐 것을 맨 위로
m=re.search(r"    \$\{acc\('card54',.*?\n",s)
if not m:raise SystemExit('card54')
card54=m.group(0);s=s.replace(card54,'',1)
rep("    ${acc('flow',","""    ${acc('card55','🆕 v5.5 · 행동/습관 편집이 쉬워졌어요','지금 버전',`<ul><li>이름이 <b>행동 카드</b>로 바뀌었어요. 점수는 카드에만 있고, 그중 <b>리듬</b>(☑ 매일·요일·📌)이 있는 카드를 <b>🔁 습관</b>이라고 불러요.</li><li>편집 → 행동/습관: 줄마다 <b>☑</b>(매일 켜고 끄기)·<b>🗑</b>(지우기, 되돌리기 가능). <b>☐ 여러 개 고르기</b>로 한꺼번에 지우기·영역 바꾸기·매일 켜기.</li><li><b>👁 보이는 칸</b>에서 영역·XP·골드·컨디션·리듬·용기·30일 횟수를 켜고 꺼요. 점수는 아이콘이 붙은 칩으로 보여요.</li><li>행동 카드 편집은 <b>완료</b>를 눌러야 저장돼요. ×나 바깥을 누르면 취소 (알림의 '되살리기'로 살릴 수 있어요).</li><li>할 일 상세는 반대로 <b>자동 저장</b>. 바깥을 누르면 저장하고 닫혀요 (PC 오른쪽 상세도).</li><li>루틴: 단계마다 연결된 카드 점수가 들어가고, 루틴 자체는 <b>완주 보너스</b>만 줘요.</li><li>할 일 스마트 목록: ⏰ 지난 것 · ⏳ 마감 3일 안 · ⚡ 용기 · ☠ 미룬 것 · 🔁 습관 연결. 할 일 화면 왼쪽 목록을 끌어서 순서를 바꿔요.</li></ul>`)}
"""+card54+"    ${acc('flow',")
rep("goE('actions','전체 편집'))","goE('actions','목록에서 보기'))")
