# ---------- v5.6 (patch.py 안에서 exec): 홈 좌우 배치 · 할 일 묶음 · 타이머 방식 · 상세 화면 ----------
i=s.rindex('</script>\n<script type="module" src="backend.js"></script>')
s=s[:i]+rd('v5m.js')+'\n'+s[i:]
rep('<b>β 베타 v5.5</b>','<b>β 베타 v5.6</b>')
rep('</style>\n\n<header','''.homegrid{columns:auto!important}
.homegrid.two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px;align-items:start}
.hcol{display:flex;flex-direction:column;min-width:0;min-height:80px}
body.homeedit .hcol{outline:1px dashed var(--line);border-radius:14px;padding-bottom:40px}
.trow.tparent .tt{font-weight:700}
.tfold{border:0;background:none;color:var(--muted);cursor:pointer;padding:0 4px 0 0;font:inherit}
.tkids{margin-left:22px;border-left:2px solid var(--line);padding-left:6px}
.tkids .trow{padding-top:5px;padding-bottom:5px}
.kcount,.kpar{color:var(--muted)}
.ts56.sc,#sheetC.ts56{gap:8px}
.ts56 #tsTitle{border:0;padding:4px 2px;background:none}
.ts56 #tsNote{min-height:0}
.tchips{display:flex;flex-wrap:wrap;gap:5px}
.tch{border:1px solid var(--line);background:var(--panel);color:inherit;border-radius:999px;padding:3px 10px;font:inherit;font-size:12.5px;cursor:pointer;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tch.off{color:var(--muted);border-style:dashed}
.tch[aria-pressed="true"]{border:2px solid var(--accent);font-weight:700}
.tpanel{display:grid;gap:8px;padding:10px;border:1px solid var(--line);border-radius:12px}
.tpanel[hidden]{display:none}
.kids56{display:grid;gap:4px}
.krow{display:grid;grid-template-columns:28px minmax(0,1fr) auto auto;gap:6px;align-items:center}
.krow.on .kt{text-decoration:line-through;color:var(--muted)}
.krow .kt{border:0;background:none;text-align:left;font:inherit;color:inherit;cursor:pointer;padding:4px 0;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.krow .tchk{width:22px;height:22px}
.col56{display:grid;gap:6px}
.huntset{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;align-items:center;margin:4px 0 8px}
</style>

<header''')
# 할 일 목록: 묶음으로 보여주기
rep("${g.list.map(t=>taskRow(t,{showList})).join('')}","${nestRows(g.list,{showList},list)}")
rep("(shown.map(t=>taskRow(t,{compact:true})).join('')||","(nestRows(shown,{compact:true})||")
# 홈: 왼쪽·오른쪽 칸 사이로 끌기
rep("if((DND.kind==='row'&&dv!=='reorder:tasks'&&(DND.el.parentElement===tgt","if((DND.kind==='row'&&dv==='reorder:home')||(DND.kind==='row'&&dv!=='reorder:tasks'&&(DND.el.parentElement===tgt")
rep("    if(drop.col==='home'||drop.col==='nav'){","    if(drop.col==='home'&&homeDrop(id,drop))return;\n    if(drop.col==='home'||drop.col==='nav'){")
# 타이머 방식
rep("speedOf(el,tgt/60,runBaseXP())","speedOf(el,tgt/60,runBaseXP(),RUN.mode)")
rep("speedOf(el,R.target,base)","speedOf(el,R.target,base,R.mode)")
rep("speedOf(tot,R.target,+(r&&r.xp)||20)","speedOf(tot,R.target,+(r&&r.xp)||20,R.mode)")
rep("스피드 보너스 +${sp.bonus} XP","${R.mode==='speed'?'스피드':'시간 안에'} 보너스 +${sp.bonus} XP")
rep('<label class="f">목표 시간(분) · 타이머<input data-ae="dur" type="number" min="0" max="300" value="${a.dur||\'\'}"></label>',
    '<label class="f">목표 시간(분) · 타이머<input data-ae="dur" type="number" min="0" max="300" value="${a.dur||\'\'}"></label><label class="f">타이머 방식<select data-ae="tmode"><option value="">⏱ 시간 안에 끝내면 보너스</option><option value="speed" ${a.tmode===\'speed\'?\'selected\':\'\'}>⚡ 빠를수록 보너스</option></select></label>')
# 게임 방법
rep("    ${acc('card55',","""    ${acc('card56','🆕 v5.6 · 홈 좌우 배치 · 할 일 묶음 · 타이머 방식','지금 버전',`<ul><li><b>홈 배치</b>: ✎ 홈 배치에서 칸을 왼쪽·오른쪽 단 어디든 끌어 놓거나 ⇢/⇠로 옮겨요. 한쪽이 길어도 다른 쪽으로 넘어가지 않아요. 폰은 한 줄이라 순서만.</li><li><b>📦 할 일 묶음</b>: 할 일 상세의 '묶인 할 일'에 추가하거나, 여러 개 고른 뒤 '📦 묶기'. 묶여도 각자 따로인 할 일이라 하나만 끝내도 그 점수를 받아요. 목록에서 ▾로 접고 펴요.</li><li>체크리스트(점수 없는 작은 단계)는 그대로 있고, ↗로 묶인 할 일로 바꿀 수 있어요.</li><li><b>할 일 상세</b>: 위에 칩 한 줄(📅 날짜 · 🃏 카드 · # 태그 · 🧭 영역 · 📂 목록 · ⚑ · 크기 · ⏱). 눌러야 그 칸이 펼쳐져요.</li><li><b>타이머 방식</b>: ⏱ 시간 안에 = 목표 안에 끝내면 보너스(샤워처럼 서두를 필요 없는 것). ⚡ 빠를수록 = 빨리 끝낼수록 보너스가 커요(설거지·청소·답장 몰아 하기처럼 해치우고 싶은 것). 카드·할 일에 정해두고, 시작하고 2분 안에는 목표 분과 방식을 그때그때 바꿔요.</li></ul>`)}
    ${acc('card55',""")
rep("<label class=\"f\">습관과 연결 ${t.aid","<label class=\"f\">행동 카드 연결 ${t.aid")
rep(">이 할 일로 습관 만들기</button>",">이 할 일로 행동 카드 만들기</button>")
rep('<option value="">없음 (할 일 점수)</option>','<option value="">없음 (할 일 크기 점수)</option>')
