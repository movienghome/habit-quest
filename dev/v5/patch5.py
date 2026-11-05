# ---------- v5.3 (patch.py 안에서 exec) ----------
# 설정 버전 7: 6영역 · 기본 목록 · 리멘 루틴 · 도파민 코스
rep("  c.v=6;\n  return c;","  mig53(c,raw);\n  c.v=7;\n  return c;")
rep("    if(rawCfgV!==null&&rawCfgV<6){save('config');}","    if(rawCfgV!==null&&rawCfgV<7){save('config');}")
rep("rawCfgV=6;rawProgHasMarbles=true;","rawCfgV=7;rawProgHasMarbles=true;")
rep("    if(C.v51news){","    if(C.v53news){delete C.v53news;save('config');later(()=>toast('v5.3 · 오늘 하나로 · 습관 모음 · 여러 개 고르기 · 영역 6개(작품·성장 나눔)',5200))}\n    if(C.v51news){")
rep("{id:'g12',name:'영어 공부',type:'good',area:'make',","{id:'g12',name:'영어 공부',type:'good',area:'grow',")
rep("function render(){\n  const day=today()","function render(){\n  if(tasksReady&&(C.focusMig||C.limenMig)&&Object.keys(TASKS).length)mig53Tasks();\n  const day=today()")
# 편집 화면: 체크박스에 초점이 남아도 다시 그림 (목록 순서 끌기 안 바뀌던 버그)
rep("  const ae=document.activeElement;if(ae&&$('editBody').contains(ae)&&ae.matches('input,select,textarea'))return;\n  $('editNav')",
    "  const ae=document.activeElement;if(ae&&$('editBody').contains(ae)&&ae.matches('input:not([type=checkbox]):not([type=radio]),select,textarea'))return;if(DND.on)return;\n  $('editNav')")
# 편집 표: 모든 표 끌어서 순서
rep("  const tpl=cols.map(c=>c.w+'fr').join(' ')+' 26px';\n  const head=`<div class=\"erow head\" style=\"grid-template-columns:${tpl}\">${cols",
    "  const dr=Array.isArray(C[col]);const tpl=(dr?'16px ':'')+cols.map(c=>c.w+'fr').join(' ')+' 26px';\n  const head=`<div class=\"erow head\" style=\"grid-template-columns:${tpl}\">${dr?'<span></span>':''}${cols")
rep("  const rows=list.map(it=>`<div class=\"erow\" style=\"grid-template-columns:${tpl}\">${cols.map(",
    "  const rows=list.map(it=>`<div class=\"erow\" data-rowid=\"${it.id}\" style=\"grid-template-columns:${tpl}\">${dr?`<span class=\"hand\" data-drag=\"row:${it.id}\" data-dragmode=\"now\" aria-label=\"끌어서 순서 바꾸기\">⋮⋮</span>`:''}${cols.map(")
rep("  return `<div class=\"etable\">${head}${rows","  return `<div class=\"etable\" ${dr?`data-drop=\"reorder:${col}\"`:''}>${head}${rows")
# 기록 → 습관 모음
rep("['log','기록','용기·습관·식사·몸무게']","['log','습관 모음','습관 꺼내 쓰기·편집 · 용기 · 식사·몸무게']")
rep('<div class="ptitle"><h2>행동</h2><a class="small" href="#edit" data-goedit="actions" style="color:var(--accent)">전체 편집</a></div>',
    '<div class="ptitle"><h2>🔁 습관 모음</h2><a class="small" href="#edit" data-goedit="actions" style="color:var(--accent)">전체 편집</a></div><p class="help" style="margin:0">자주 하는 습관을 모아 둔 곳이에요. ✓로 바로 기록, 📌로 \'오늘\' 목록에 매일 띄워요. 일퀘·방치 경보·요일에 걸린 습관은 \'오늘\'에 저절로 떠요.</p>')
rep("""<span class="ab"><span class="n">${LS.filter==='all'&&LS.group!=='type'?(x.type==='good'?'▲ ':'▼ '):''}${esc(x.name)}${x.once?' <span class="oncetag">한 번</span>':''}</span></span>""",
    """<span class="ab"><span class="n">${LS.filter==='all'&&LS.group!=='type'?(x.type==='good'?'▲ ':'▼ '):''}${esc(x.name)}${x.once?' <span class="oncetag">한 번</span>':''}</span></span>${x.type==='good'&&!x.once?`<button class="pinb ${x.pin?'on':''}" data-pin="${x.id}" title="${x.pin?'오늘에서 고정 풀기':'오늘에 매일 고정'}" aria-label="${esc(x.name)} 오늘에 고정" aria-pressed="${!!x.pin}">📌</button>`:''}""")
# 식사 항목 끌어서 순서
rep("""    if(f.kind==='check')return `<label class="togglebox">""","""    const fh=`<span class="hand fh" data-drag="row:${f.id}" data-dragmode="now" aria-label="끌어서 순서 바꾸기">⋮⋮</span>`;
    if(f.kind==='check')return `<div class="frow" data-rowid="${f.id}">${fh}<label class="togglebox">""")
rep("""<span><b>${esc(f.name)}</b><br>${eff}</span></label>`;""","""<span><b>${esc(f.name)}</b><br>${eff}</span></label></div>`;""")
rep("""    return `<div class="counter"><div><b>${esc(f.name)}</b>""","""    return `<div class="frow" data-rowid="${f.id}">${fh}<div class="counter"><div><b>${esc(f.name)}</b>""")
rep("""aria-label="${esc(f.name)} 늘리기">+</button></div></div>`}).join('')||'<div class="empty">식사 항목이 없어요.</div>';""",
    """aria-label="${esc(f.name)} 늘리기">+</button></div></div></div>`}).join('')||'<div class="empty">식사 항목이 없어요.</div>';""")
rep('<div id="foodList" class="food"></div>','<div id="foodList" class="food" data-drop="reorder:food"></div>')
rep("today:'오늘 할 일',","today:'오늘 (할 일·습관)',")
# CSS
rep("</style>\n\n<header","""
/* v5.3 */
body.wideview .shell,body.split .shell{max-width:none}
body.wideview .wrap,body.split .wrap{margin:0;width:auto;justify-self:stretch;min-width:0}
.calbar2{display:flex;align-items:center;gap:4px;flex-wrap:wrap;padding:2px 2px 0}
.calbar2 h2{font-size:17px;margin:0 6px;white-space:nowrap}
.calbar2 .ib{display:inline-flex;align-items:center;justify-content:center;gap:3px;min-width:30px;height:30px;padding:0 7px;border:1px solid var(--line);border-radius:9px;background:var(--panel);color:var(--ink);font:inherit;font-size:15px;cursor:pointer;position:relative}
.calbar2 .ib.wide{font-size:13px;font-weight:700}
.calbar2 .ib:hover{border-color:var(--accent)}
.calbar2 .ib[aria-pressed="true"]{border-color:var(--accent);color:var(--accent);background:color-mix(in srgb,var(--accent) 10%,var(--panel))}
.calbar2 .ib .ico{width:16px;height:16px}
.calbar2 .bdg{position:absolute;top:-5px;right:-5px;background:var(--accent);color:var(--panel);border-radius:999px;font-size:10px;min-width:15px;height:15px;line-height:15px;padding:0 3px;font-weight:800}
.seg3.sm button{padding:4px 9px;font-size:12.5px}
#calHelp{padding:6px 10px;border-radius:10px;background:var(--panel2);font-size:12.5px}
.trange{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.trange input[type=time]{width:auto;flex:none}
.trange .durin{display:inline-flex;align-items:center;gap:4px}
.trange .durin input{width:64px}
.tlabel{color:var(--ink);font-weight:700;margin-left:4px}
.flags{display:inline-flex;gap:2px}
.flag{display:inline-flex;flex-direction:column;align-items:center;border:1px solid transparent;background:none;border-radius:8px;padding:3px 6px 1px;cursor:pointer;color:var(--muted);line-height:1}
.flag .ico{width:18px;height:18px}
.flag small{font-size:9px;font-family:var(--mono);font-weight:800}
.flag.p5{color:#d23c3c}.flag.p3{color:#e07a10}.flag.p1{color:#8a8a2b}
.flag[aria-pressed="true"]{border-color:currentColor;background:color-mix(in srgb,currentColor 12%,var(--panel))}
.flag[aria-pressed="true"] .ico path{fill:currentColor}
.flag:hover{background:var(--panel2)}
.repbox{display:grid;gap:6px;padding:8px 10px;border:1px dashed var(--line);border-radius:10px}
.when{display:flex;align-items:center;gap:5px;flex-wrap:wrap}
.when input{flex:none}
.trow.msel{background:color-mix(in srgb,var(--accent) 16%,var(--panel));box-shadow:inset 4px 0 0 var(--accent)}
.trow.msel .tt::before{content:'☑ ';color:var(--accent)}
.bulkbar{position:sticky;bottom:calc(8px + env(safe-area-inset-bottom,0px));z-index:30;display:flex;flex-wrap:wrap;align-items:center;gap:5px;margin-top:10px;padding:8px 10px;border:2px solid var(--accent);border-radius:12px;background:var(--panel);box-shadow:0 6px 20px color-mix(in srgb,var(--ink) 18%,transparent)}
.bulkbar select{width:auto;padding:4px 8px;font-size:13px}
.bulkbar .bad{color:var(--bad)}
@media (max-width:959px){.bulkbar{bottom:calc(76px + env(safe-area-inset-bottom,0px))}}
#tSelBtn[aria-pressed="true"]{border-color:var(--accent);color:var(--accent);font-weight:800}
.tside .drop-hi{outline:2px dashed var(--accent);background:color-mix(in srgb,var(--accent) 14%,var(--panel))}
.tside [data-drag]{touch-action:pan-y}
.trow.hab .tt{font-weight:600}
.tchk.hb{border-style:dashed}
.habg{margin-top:6px}
.twont .tt{text-decoration:line-through;color:var(--muted)}
.twont .tchk{background:none!important;color:var(--muted)}
.tagc.focus{font-weight:700}
.lroutines{display:flex;flex-wrap:wrap;align-items:center;gap:6px;padding:6px 8px;margin-bottom:6px;border-radius:10px;background:var(--panel2)}
.pinb{border:0;background:none;cursor:pointer;opacity:.25;font-size:13px;padding:2px 4px;filter:grayscale(1)}
.pinb.on{opacity:1;filter:none}
.act:hover .pinb{opacity:.7}
.frow{display:grid;grid-template-columns:14px minmax(0,1fr);align-items:center;gap:4px}
.hand.fh,.erow .hand{cursor:grab;touch-action:none;color:var(--muted);font-size:12px;user-select:none}
.dchip.on{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 14%,var(--panel));font-weight:700}
.dchip .dck{color:var(--accent)}
.dchip .x{font-size:13px;padding:0 3px}
.dcoin{border:1px solid transparent;background:transparent;padding:2px 4px;font-weight:800;font-size:14px}
.dcoin.tiny{font-weight:400;font-size:11.5px;color:var(--muted)}
.dcoin:hover,.dcoin:focus{border-color:var(--line);background:var(--panel)}
.dcol.add{border-style:dashed;min-height:80px}
.dbar{position:static;margin:0 0 10px}
.act{grid-template-columns:auto minmax(0,1fr) auto auto}
body.wideview .hud-in,body.split .hud-in{max-width:none}
.dedit{grid-template-columns:repeat(auto-fill,minmax(220px,1fr))}
.dchip{align-items:center}
.dchip>span:first-child{min-width:0;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dchip>.row{flex:none;white-space:nowrap}
.dchip .x{opacity:.45}.dchip:hover .x{opacity:1}
</style>

<header""")
# 받은함 → 기본함 (화면 글자)
s=s.replace('받은함','기본함')
# 게임 방법: v5.3
rep("    ${acc('keys','⌨ 단축키'","""    ${acc('today53','📅 오늘 하나로 · 습관 모음','v5.3',`<ul><li><b>오늘</b> 목록 하나에 할 일·시간 일정·오늘 할 만한 습관이 다 모여요. 습관은 <b>일퀘</b>, <b>방치 경보</b>(기한 다 됨), <b>요일</b>을 정한 것, <b>📌 고정</b>한 것만 저절로 떠요.</li><li><b>습관 모음</b>(옛 '기록' 탭)은 습관을 꺼내 쓰고 고치는 곳이에요. 📌를 누르면 매일 '오늘'에 떠요. 습관 편집 창에서 띄울 요일도 골라요.</li><li><b>여러 개 고르기</b>: ☑ 버튼, 또는 Ctrl·⌘·Shift+클릭. 아래 막대로 날짜·목록·중요도를 한꺼번에 바꾸거나, 고른 것을 왼쪽 목록 위로 끌어 놓아요.</li><li><b>하지 않음</b>: 안 하기로 한 일은 지우지 않고 줄 그어 모아 둬요. ✕를 누르면 다시 열려요.</li><li><b>언제 했나요?</b> 나중에 체크해도 '아침에'·'1시간 전'·직접 시각을 고르면 그 시각으로 기록되고, 시간대 옵션(예: 기상 직후 샤워)도 그 시각에 맞춰 골라져요. 타이머로 한 건 시작한 시각을 써요.</li><li><b>영역 6개</b>: 몸·마음·작품(내 다음 작품)·성장(공부·언어·일 찾기)·생활·경제. 영역은 목록이 아니라 할 일 자체·태그·연결한 습관에서 와요.</li></ul>`)}
    ${acc('keys','⌨ 단축키'""")
rep("[['keys','단축키','틱틱 단축키, 목록 태그 중요도 입력, 미루기, 되돌리기'],","[['today53','오늘 하나로','오늘 목록, 습관 모음, 고정, 여러 개 고르기, 하지 않음, 언제 했나요, 영역 6개'],['keys','단축키','틱틱 단축키, 목록 태그 중요도 입력, 미루기, 되돌리기'],")
