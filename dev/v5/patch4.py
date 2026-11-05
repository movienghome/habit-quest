# ---------- v5.2 수정 (patch.py 안에서 exec) ----------
# 이름: 해비티카틱
s=s.replace('습관 퀘스트','해비티카틱').replace('습관퀘스트','해비티카틱')
# 흐름 끊기 알림은 창 대신 토스트
rep("  later(()=>popup('흐름을 끊었어요','⛓️‍💥',","  later(()=>toast(`⛓ 어제 나쁜 흐름을 끊었어요 · +${(+ch.xp||0)*k} XP`));void 0&&later(()=>popup('흐름을 끊었어요','⛓️‍💥',")
# 편집 탭: 도파민
rep("['lists','할 일 목록·보상'],['routines','⏱ 루틴'],","['lists','할 일 목록·보상'],['routines','⏱ 루틴'],['dopa','🍬 도파민 메뉴'],")
rep("  }else if(ui.edit==='routines'){h=routinesEditHTML();","  }else if(ui.edit==='routines'){h=routinesEditHTML();\n  }else if(ui.edit==='dopa'){h=dopaEditHTML();")
# 홈 배치 편집 버튼
rep('    <div class="homegrid" id="homeGrid">','    <div class="row homebar"><span class="tiny muted" id="homeEditHint"></span><span style="flex:1"></span><button class="btn ghost sm" id="homeEditBtn">✎ 홈 배치</button></div>\n    <div class="homegrid" id="homeGrid">')
rep("  placeCal();applyTheme();renderNav();applyHome();","  placeCal();applyTheme();renderNav();applyHome();if(ui.homeEdit)applyHomeEdit();")
# 옆 메뉴: 이름·설명 풍선
rep("  const sd=NAV_ITEMS.filter(([id])=>!(C.ui.hide||[]).includes(id)||id===cur).map(([id,l])=>`<a href=\"#${id}\" aria-current=\"${cur===id?'page':'false'}\">${ic(id)}${l}</a>`)",
    "  const sd=NAV_ITEMS.filter(([id])=>!(C.ui.hide||[]).includes(id)||id===cur).map(([id,l,dd])=>`<a href=\"#${id}\" aria-current=\"${cur===id?'page':'false'}\" title=\"${l} · ${dd}\" data-tip=\"${l}\" data-tipd=\"${dd}\">${ic(id)}${l}</a>`)")
# 단축키 안내
rep("    ${acc('happy','✨ 행복 기록 · 🍬 도파민 · ⚔ 전투'",
"""    ${acc('keys','⌨ 단축키','틱틱처럼',`<ul><li>할 일 입력칸에서 <b>~</b> 또는 <b>^</b> = 목록 고르기, <b>#</b> = 태그, <b>!</b> = 중요도. 위아래 화살표로 고르고 Tab/Enter.</li><li>그냥 적기 시작하면 <b>자주 쓴 이름</b>이 떠요(빠른 기록도).</li><li><b>Ctrl+Shift+R</b> (브라우저가 막으면 <b>Alt+R</b>) = 마우스를 올린 할 일, 또는 열린 할 일을 내일로 미루기.</li><li><b>Ctrl+Z</b> = 방금 기록 되돌리기 · <b>Ctrl+Enter</b> = 할 일 편집 끝 · <b>Ctrl+K</b> = 검색</li><li><b>N</b> = 할 일 추가칸으로 · <b>Q</b> = 빠른 기록으로 · 캘린더에서 <b>T</b> = 오늘</li></ul>`)}
    ${acc('happy','✨ 행복 기록 · 🍬 도파민 · ⚔ 전투'""")
rep("[['tasks','할 일 · 캘린더','틱틱, 반복, 하위 할 일, 삼진아웃'],","[['keys','단축키','틱틱 단축키, 목록 태그 중요도 입력, 미루기, 되돌리기'],['tasks','할 일 · 캘린더','틱틱, 반복, 하위 할 일, 삼진아웃'],")
# 기본값
rep("cal:{mode:'3day',actual:true,fold:6,foldOn:true,","cal:{mode:'3day',actual:true,fold:6,foldOn:true,tray:false,allH:0,")
# 다크·라이트 공통 CSS 추가
rep("</style>\n\n<header","""
/* v5.2 */
body.wideview .wrap{max-width:none}
.callay.notray{grid-template-columns:minmax(0,1fr)!important}
#calTrayBtn[aria-pressed="true"]{border-color:var(--accent);color:var(--accent);font-weight:700}
.tgall{max-height:var(--allh,74px);overflow:auto}
.tgall.open{max-height:none}
.allrz{height:7px;cursor:ns-resize;touch-action:none;border-bottom:1px solid var(--line);background:linear-gradient(var(--panel2),var(--panel2)) center/34px 3px no-repeat}
.allrz:hover{background:linear-gradient(var(--accent),var(--accent)) center/34px 3px no-repeat}
.alltog,.foldtog{border:0;background:none;color:var(--muted);font:inherit;font-size:10.5px;cursor:pointer;padding:2px 0;width:100%}
.alltog:hover,.foldtog:hover{color:var(--accent)}
.cchip.dl{background:var(--bad-soft);border-left-color:var(--bad);font-weight:700}
.cchip.ck{background:var(--gold-soft);border-left-color:var(--gold)}
.inx{display:flex;gap:2px;align-items:center}
.inx input{flex:1;min-width:0;width:100%}
.sc .f2{grid-template-columns:repeat(auto-fit,minmax(150px,1fr))}
.sc input[type=date],.sc input[type=time]{min-width:0;max-width:100%}
.cks{display:grid;gap:5px}
.ckr{display:grid;grid-template-columns:auto 150px minmax(0,1fr) 26px;gap:6px;align-items:center}
@media (max-width:520px){.ckr{grid-template-columns:auto 130px minmax(0,1fr) 26px}}
.donebtn{border-style:dashed}
.trow.sel{background:color-mix(in srgb,var(--accent) 10%,var(--panel));box-shadow:inset 3px 0 0 var(--accent)}
.tcomp .trow .tchk{background:var(--muted);border-color:var(--muted)}
.tcomp .trow .tchk:hover{background:var(--bad);border-color:var(--bad)}
.tdetail{display:none}
body.split.docked .tlayout{grid-template-columns:200px var(--listw,minmax(320px,1fr)) 10px minmax(330px,380px) minmax(420px,1.3fr)}
body.split.docked .tdetail{display:block;position:sticky;top:72px;align-self:start;max-height:calc(100vh - 84px);overflow:auto;background:var(--panel);border:2px solid var(--edge);border-radius:14px;box-shadow:0 3px 0 var(--edge)}
body.split.docked .tdetail .sc{max-height:none;border:0;border-radius:0;animation:none;width:auto;padding:12px 14px 16px}
.acbox{position:fixed;z-index:95;background:var(--panel);border:2px solid var(--accent);border-radius:12px;box-shadow:0 10px 26px color-mix(in srgb,var(--ink) 25%,transparent);padding:4px;max-height:280px;overflow:auto}
.aci{padding:7px 10px;border-radius:8px;cursor:pointer;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.aci.on,.aci:hover{background:color-mix(in srgb,var(--accent) 14%,var(--panel))}
.achint{font-size:11px;color:var(--muted);padding:3px 10px 2px;border-top:1px solid var(--line);margin-top:3px}
.homebar{margin:-4px 0 -6px}
body.homeedit #homeGrid .hblock{outline:2px dashed var(--accent);outline-offset:3px;border-radius:14px}
body.homeedit #homeGrid .hblock.hoff{opacity:.38}
body.homeedit #homeGrid .hblock>.panel,body.homeedit #homeGrid .hblock>button{pointer-events:none}
.hedit{display:flex;gap:8px;align-items:center;padding:6px 10px;margin-bottom:6px;border-radius:10px;background:var(--accent);color:var(--panel);font-size:13px}
.hedit .hand{cursor:grab;touch-action:none;font-weight:800;padding:0 4px}
.hedit b{flex:1}
.hedit .x{color:var(--panel)}
.dedit{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}
.dcol{border:2px solid var(--line);border-radius:12px;padding:8px;display:flex;flex-direction:column;gap:5px;min-height:120px;background:var(--panel2)}
.dcol.pool{border-style:dashed}
.dcol .dh{display:grid;margin-bottom:2px}
.dchip{display:flex;justify-content:space-between;gap:6px;padding:6px 9px;border-radius:9px;background:var(--panel);border:1px solid var(--line);font-size:13px;cursor:grab;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}
.dchip:hover{border-color:var(--accent)}
.links{border:1px solid var(--line);border-radius:12px;padding:10px 12px;display:grid;gap:6px;background:var(--panel2)}
body.split .side a{position:relative}
body.split .side a:hover::after{content:attr(data-tip) " · " attr(data-tipd);position:absolute;left:54px;top:50%;transform:translateY(-50%);background:var(--ink);color:var(--panel);font-size:12.5px;font-weight:600;padding:6px 10px;border-radius:8px;white-space:nowrap;z-index:50;box-shadow:0 4px 14px color-mix(in srgb,var(--ink) 30%,transparent)}
body.split .side{overflow:visible}
</style>

<header""")

rep("  happy:{xp:8,gold:3,cond:5},","  happy:{xp:8,gold:3,cond:5},\n  tagArea:{'재정관리':'money','헌팅(Job)':'grow','영상':'grow','파라모프':'grow','영어':'grow','일본어':'grow','집필':'make'},")
