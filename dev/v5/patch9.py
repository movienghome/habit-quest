# ---------- v5.7 (patch.py 안에서 exec): 리듬=반복 할 일 하나로 · 상세 다듬기 · 홈 ↑↓ · 도파민 새로 · 2단계 ----------
i=s.rindex('</script>\n<script type="module" src="backend.js"></script>')
s=s[:i]+rd('v5n.js')+'\n'+s[i:]
rep('<b>β 베타 v5.6</b>','<b>β 베타 v5.7</b>')
rep('</style>\n\n<header','''.tpanel{background:var(--panel2);border:2px solid var(--accent);border-radius:12px;box-shadow:0 2px 0 var(--line)}
.tph{display:flex;justify-content:space-between;align-items:center;margin:-2px 0 2px;padding-bottom:4px;border-bottom:1px dashed var(--line)}
.tph .x{font-size:12px;width:auto;padding:0 6px}
.tch[aria-pressed="true"]{background:var(--panel2);border:2px solid var(--accent);font-weight:700;position:relative}
.tch[aria-pressed="true"]::after{content:"▾";margin-left:4px;font-size:10px}
.duedl{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.duedl .f{min-width:0}
.pp57{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:8px;padding:8px;border:2px solid var(--accent);border-radius:12px;background:var(--panel2)}
.pp57[hidden]{display:none}
.pp57 input[type=date]{width:auto}
.habinfo{display:grid;gap:4px;padding:8px;border:1px dashed var(--line);border-radius:10px}
.mxs{display:flex;flex-wrap:wrap;gap:3px;margin-top:2px}
.mxs .mx{font-size:11px}
.qtag{font-weight:700}
.hedit .x[disabled]{opacity:.3}
.hvis57{width:auto!important;padding:0 6px;font-size:12px}
.hvis57[aria-pressed="true"]{border:1px dashed var(--muted);border-radius:8px}
</style>

<header''')
rep("    ${acc('card56',","""    ${acc('card57','🆕 v5.7 · 반복은 할 일에서만 · 도파민 메뉴 새로','지금 버전',`<ul><li><b>리듬 = 반복 할 일</b>: 카드의 🔁 리듬(매일·요일)은 이제 그 카드에 이어진 <b>반복 할 일</b> 하나예요('🔁 습관' 목록). 오늘 목록엔 할 일만 떠서 같은 행동이 두 번 뜨지 않아요. 카드를 그냥 기록해도 그날 리듬 할 일이 같이 끝나요.</li><li><b>일퀘</b> = 매일 반복 리듬 할 일 중 ☑ 일퀘 표시. 할 일 상세 🃏 칩이나 카드 편집에서 켜요.</li><li>놓친 날은 쌓이지 않고 다음 날로 넘어와요(☠ 안 붙음). 오래 안 한 건 '⚠ 오래 안 한 행동'에 떠요.</li><li><b>할 일 상세</b>: 펼친 칩 칸은 테두리·배경·머리글로 구분, 날짜·마감 한 줄, 💭 문구 칩, 🗑 삭제 · 안 하기 · 미루기(날짜 고르기).</li><li><b>홈 배치</b>: ↑↓로 한 칸씩, 숨김은 '배치 끝'에서 바로 적용.</li></ul>`)}
    ${acc('card56',""")
rep("""      <div class="hblock" data-hid="tip">""","""      <div class="hblock" data-hid="dopa"><div class="panel" id="dopaHome"></div></div>
      <div class="hblock" data-hid="tip">""")
rep("['brave',1],","['brave',1],['dopa',1],")
rep('</style>\n\n<header','''.dstates{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px}
.dst{border:1px solid var(--line);background:var(--panel);color:inherit;border-radius:12px;padding:8px 10px;font:inherit;font-size:13.5px;text-align:left;cursor:pointer}
.dst[aria-pressed="true"]{border:2px solid var(--accent);background:var(--panel2);font-weight:700}
.dpick{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 10px;border:1px solid var(--line);border-radius:12px;flex-wrap:wrap}
.dask{display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding:8px;border:2px dashed var(--accent);border-radius:12px}
</style>

<header''')
rep("<h2>🔁 습관 모음</h2>","<h2>행동/습관</h2>")
rep("자주 하는 습관을 모아 둔 곳이에요. ✓로 바로 기록, 📌로 '오늘' 목록에 매일 띄워요. 일퀘·방치 경보·요일에 걸린 습관은 '오늘'에 저절로 떠요.","행동 카드를 모아 둔 곳이에요. 네모로 바로 기록하고, 🔁를 누르면 매일 '오늘'에 뜨는 습관이 돼요(🔁 습관 목록의 반복 할 일). 요일·일퀘는 이름 → 편집의 '리듬'에서.")
rep('</style>\n\n<header','''.subs .sr{grid-template-columns:24px minmax(0,1fr) auto auto!important}
.subs form.sr button[type=submit]{white-space:nowrap;width:auto;padding:0 6px}
.duedl input{min-width:0;width:100%}
.pinb.rh57b{font-size:13px}
</style>

<header''')
rep("const tabs=[['nodate','날짜 없음'],['late','지난 것'],['habit','습관'],['routine','루틴']];","const tabs=[['nodate','날짜 없음'],['habit','행동 카드'],['routine','루틴']];")
rep('</style>\n\n<header','''.cal57g{position:absolute;left:2px;right:2px;border:2px dashed var(--accent);background:color-mix(in srgb,var(--accent) 12%,transparent);border-radius:6px;z-index:4;font-size:11px;padding:2px 4px;pointer-events:none}
.tgcol{cursor:cell}
</style>

<header''')
rep('</style>\n\n<header','''.ck57{display:inline-block;font-size:9.5px;line-height:1.2;border:1px solid;border-radius:4px;padding:0 2px;margin-right:3px;font-weight:700;vertical-align:1px}
</style>

<header''')
rep('</style>\n\n<header','''.board57{grid-template-columns:repeat(auto-fill,minmax(200px,1fr))!important}
.bchip{flex-direction:column;align-items:flex-start!important;gap:3px}
.bchip.bad{border-style:dashed}
.nm57{border:0;background:none;font:inherit;color:inherit;padding:0;cursor:pointer;text-align:left}
</style>

<header''')
rep('</style>\n\n<header','''body.homeedit.hmini #homeGrid .hblock>:not(.hedit){display:none}
body.homeedit.hmini #homeGrid .hblock{min-height:0}
body.homeedit.hmini .hcol{padding-bottom:10px}
</style>

<header''')
rep('</style>\n\n<header','''[data-view="body"] .panel{min-width:0}
[data-view="body"] .chart{max-width:100%;overflow-x:auto}
.wrap>.view{min-width:0}
[data-view="body"] .chart svg{max-width:100%;height:auto}
[data-view="body"] .ptitle{flex-wrap:wrap}
</style>

<header''')
