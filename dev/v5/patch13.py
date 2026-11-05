# ---------- v6.1 (patch.py 안에서 exec): 루틴 단계=카드·할 일 · 요일별 일퀘 · 우클릭 메뉴 · 뒤로 가기 · 같은 거르기 · 화면 배치 · 도감 · 아이콘 ----------
import re
rep('<b>β 베타 v6.0</b>','<b>β 베타 v6.1</b>')

# 행동/습관: 기록 화면과 편집 화면이 같은 거르기
rep("""<span class="seg3">${[['good','▲ 좋은'],['bad','▼ 나쁜'],['dopa','🍬 도파민'],['all','모두']].map(([v,l])=>`<button data-lfilter="${v}" aria-pressed="${LS.filter===v}">${l}</button>`).join('')}</span>""","""${fltBar61('lfilter',LS.filter)}""")
rep("C.actions.filter(x=>!x.doneAt&&(LS.filter==='all'?!x.dopaOnly:LS.filter==='dopa'?!!x.dopa:(x.type===LS.filter&&!x.dopaOnly)))","C.actions.filter(x=>flt61(x,LS.filter))")
s,n=re.subn(r"""<span class="seg3">\$\{\[\['all','모두'\],[^`]*?`<button data-aetype="\$\{v\}" aria-pressed="\$\{E\.type===v\}">\$\{l\}</button>`\)\.join\(''\)\}</span>""","${fltBar61('aetype',E.type)}",s)
assert n>=1,('aetype chips',n)
s,n=re.subn(r"const okType=a=>E\.type==='all'\?true:[^;]*;","const okType=a=>flt61(a,E.type);",s)
assert n>=3,('okType',n)

# ---- 아이콘: ✨ XP · 🔋 컨디션 · ⚔ 용기 · ⚡ 번개(짧은 일·빠를수록) · 🌸 행복 · 🏹 사냥 · 👾 전투 ----
# 1) 원래 ⚔를 쓰던 사냥·전투 자리를 먼저 비켜 두고
for a,b in [("'⚔ 사냥","'🏹 사냥"),(">⚔ 사냥",">🏹 사냥"),("⚔ 사냥 고르기","🏹 사냥 고르기"),("⚔ 전투","👾 전투"),("textContent=`⚔ ${RUN.kind","textContent=`🏹 ${RUN.kind"),("document.title=`⚔ ${mmss","document.title=`🏹 ${mmss"),
  ("⚔ 할 일 빠른 추가","➕ 할 일 빠른 추가"),("<span class=\"slash\">${bad?'💢':'⚔️'}</span>","<span class=\"slash\">${bad?'💢':'💥'}</span>"),("popup(sp.tier,'⚔️'","popup(sp.tier,'🏹'"),
  ("e.kind==='boss'?'⚔️'","e.kind==='boss'?'👾'"),("t:'⚔️ '+esc(bs.name)","t:'👾 '+esc(bs.name)"),("popup('보스 처치','⚔️'","popup('보스 처치','👾'"),("e.spd?'⚔ '+e.spd","e.spd?'⏱ '+e.spd")]:
  s=s.replace(a,b)
# 2) 행복 ✨ → 🌸 (옛 기록 이름의 ✨도 지우게)
s=s.replace('✨','🌸')
s=s.replace("replace(/^🌸 /,'')","replace(/^(🌸|\\u2728) /,'')")
# 3) XP ⭐ → ✨
s=s.replace('⭐','✨')
# 4) 컨디션 ❤ → 🔋
s=s.replace('❤️','🔋').replace('❤','🔋')
# 5) 용기 ⚡ → ⚔ (그다음 번개 자리만 되돌림)
s=s.replace('⚡','⚔')
for a,b in [("⚔ 빠를수록","⚡ 빠를수록"),("sp.r<=1?'⚔':'✓'","sp.r<=1?'⚡':'✓'"),("🍃 짧게 XP","⚡ 번개 XP"),("🍃 짧은 일","⚡ 번개"),("'🍃 짧게'","'⚡ 번개'"),("#짧게 !!","#번개 !!"),("#짧게…","#번개…"),
  ("크기(⚔퀵","크기(⚡번개"),("할 일 크기 '⚔ 퀵' → <b>🍃 짧게</b>","할 일 크기 '퀵' → <b>짧게</b>")]:
  s=s.replace(a,b)
assert '⚡ 번개 XP' in s
s=s.replace("['⚔️',","['👾',")
# ⚔는 윈도에서 글자 모양으로 작게 나와서 그림 글자 표시(FE0F)를 붙여요
s=re.sub('⚔(?!\ufe0f)','⚔\ufe0f',s)
s=s.replace('cut(/(^|\\s)⚔\ufe0f\\s*/)','cut(/(^|\\s)⚔\\ufe0f?\\s*/)')
s=s.replace('일퀘 (매일)','일퀘')
# v6.1 모듈은 아이콘 바꾸기 뒤에 넣어요 (안의 ✨·⚡가 바뀌지 않게)
i=s.rindex('</script>\n<script type="module" src="backend.js"></script>')
s=s[:i]+rd('v5r.js')+'\n'+s[i:]

# 게임 방법
rep("    ${acc('card60',","""    ${acc('card61','🆕 v6.1 · 루틴은 카드·할 일을 줄 세운 것 · 요일별 일퀘 · 우클릭','지금 버전',`<ul><li><b>루틴 단계 = 행동 카드나 할 일 그대로</b>예요. 따로 만드는 '단계'가 없어요. ＋ 단계에서 카드·할 일을 찾아 넣고(여러 개 한 번에), 이름만 있는 단계는 🃏로 카드가 될 수 있어요. 반대로 카드 편집·할 일 상세에서 <b>⏱ 루틴에 넣기</b>로 몇 번째 단계인지 정해요.</li><li>할 일 상세 🃏 칸의 <b>⏱ 이 할 일을 루틴으로</b>: 📦 묶인 할 일·체크리스트가 단계가 되고, 그 할 일을 누르면 루틴이 시작돼요.</li><li><b>일퀘는 요일마다 달라요</b>: 반복하는 일에 ☑를 붙이면 그 일이 뜨는 날에만 일퀘. 편집 → 일퀘에서 요일 칸을 눌러 바꿔요.</li><li><b>우클릭</b>(폰은 꾹): 목록(이름·색·폴더·순서), 할 일(오늘로·미루기·건너뛰기·루틴에·묶음에), 오늘의 일퀘(건너뛰기·일퀘 빼기), 행동(기록·반복·일퀘·루틴·용기·도파민 코스).</li><li>이어진 곳 칩의 <b>×</b>로 그 자리에서 연결을 끊어요(되돌리기 있음). ⏱ 루틴 칩은 루틴 창이 바로 떠요.</li><li>창에서 다른 창으로 넘어가면 <b>← 뒤로</b>가 생겨요.</li><li>행동/습관 화면과 편집 화면이 <b>같은 거르기·같은 개수</b>를 써요. 🍬 도파민 전용 카드는 🍬에서만 보여요.</li><li>행동/습관 화면 <b>▦ 화면 배치</b>: 작은 지도에서 끌어서. 폰은 한 줄 순서.</li><li>새로고침하면 되돌아가던 것 고침: 스마트 목록 순서, 접어 둔 묶음, 보이는 칸.</li><li>아이콘: ✨ XP · 🔋 컨디션 · ⚔ 용기 · ⚡ 번개(10분 안) · 🌸 행복 · 🏹 사냥 · 👾 전투. 👾 전투 칸의 📖 도감.</li></ul>`)}
    ${acc('card60',""")

rep('</style>\n\n<header','''.flt61 small{opacity:.75;font-weight:400;margin-left:2px}
.flt61n{margin-left:6px}
.qw61{display:flex;flex-direction:column;gap:2px;margin-top:8px;overflow-x:auto}
.qw61r{display:grid;grid-template-columns:minmax(120px,1fr) repeat(7,34px) 26px;gap:3px;align-items:center;min-width:420px}
.qw61r.head span{font-size:12px;color:var(--muted)}
.qw61r .nm{border:0;background:none;text-align:left;font:inherit;color:inherit;cursor:pointer;padding:4px 0;min-width:0;display:flex;flex-direction:column}
.qw61r .nm b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.qw61c{height:30px;border:1px solid var(--line);border-radius:8px;background:var(--panel);color:var(--muted);font:inherit;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-direction:column;line-height:1}
.qw61c.on{border:2px solid var(--good);color:var(--text);font-weight:700}
.qw61c.h{border:0;background:none;cursor:default}
.qw61c.h small{font-size:10px}
.qw61c.td{font-weight:800;color:var(--text);text-decoration:underline}
.qw61c.x{cursor:default;border-style:dashed}
.lm61{display:grid;gap:10px}
.lm61.two{grid-template-columns:1fr 1fr}
.lm61c{display:flex;flex-direction:column;gap:6px;padding:8px;border:1px dashed var(--line);border-radius:12px;min-height:80px;background:var(--panel2)}
.lm61c.tgt{border:2px solid var(--accent)}
.lm61b{display:flex;align-items:center;gap:4px;padding:8px;border:1px solid var(--line);border-radius:10px;background:var(--panel);touch-action:none;cursor:grab;user-select:none}
.lm61b.off{opacity:.55;border-style:dashed}
.lm61b.tgt{outline:2px solid var(--accent)}
.lm61b.drag61{opacity:.85;box-shadow:0 6px 18px rgba(0,0,0,.2);z-index:5;position:relative}
.lm61b .hand{color:var(--muted)}
.lm61b .ib,.st61 .ib{min-width:28px;height:28px;border:1px solid var(--line);border-radius:8px;background:var(--panel2);color:inherit;font:inherit;cursor:pointer;padding:0 4px}
#pk61{position:fixed;inset:0;z-index:9000;background:rgba(0,0,0,.35);display:flex;align-items:flex-start;justify-content:center;padding:6vh 12px 12px}
#pk61[hidden]{display:none}
.pk61box{width:100%;max-width:560px;max-height:84vh;display:flex;flex-direction:column;gap:8px;background:var(--bg);border:1px solid var(--line);border-radius:16px;padding:12px;box-shadow:0 12px 40px rgba(0,0,0,.25)}
.pk61box input[type=search]{font-size:16px;padding:8px 12px}
.pk61t{flex-wrap:wrap}
.pk61l{overflow:auto;flex:1;display:flex;flex-direction:column;gap:2px;min-height:120px}
.pk61g{font-size:12px;color:var(--muted);font-weight:700;margin:8px 0 2px;position:sticky;top:0;background:var(--bg);padding:2px 0}
.pk61i{display:flex;gap:8px;align-items:center;text-align:left;border:1px solid transparent;border-radius:10px;background:none;color:inherit;font:inherit;padding:7px 8px;cursor:pointer}
.pk61i:hover{background:var(--panel2)}
.pk61i.on{border-color:var(--good);background:var(--panel2)}
.pk61i .tx{display:flex;flex-direction:column;min-width:0}
.pk61i small{color:var(--muted);font-size:12px}
.pk61i .ck{font-size:17px}
.pk61f{gap:6px;align-items:center}
.st61s{display:flex;flex-direction:column;gap:6px;margin:8px 0}
.st61{display:grid;grid-template-columns:22px minmax(0,1fr) auto auto;gap:4px 6px;align-items:center;padding:6px 8px;border:1px solid var(--line);border-radius:10px;background:var(--panel)}
.st61.dead{opacity:.6;border-style:dashed}
.st61 .no{font-weight:800;color:var(--muted);text-align:center}
.st61n{display:flex;gap:6px;align-items:center;min-width:0;border:0;background:none;font:inherit;color:inherit;text-align:left;cursor:pointer;padding:0}
.st61n b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
span.st61n{cursor:default}
.st61n input{min-width:0;flex:1}
.st61 .mn{display:flex;align-items:center;gap:2px;font-size:12px}
.st61 .mn input{width:56px}
.st61 .ops{display:flex;gap:3px}
.st61 .why{grid-column:2/-1}
@media (max-width:560px){.st61{grid-template-columns:22px minmax(0,1fr) auto}.st61 .ops{grid-column:2/-1}}
.rj61{display:flex;flex-direction:column;gap:6px}
.cx61{display:inline-flex;align-items:center}
.cx61 .x60c{border-top-right-radius:0;border-bottom-right-radius:0}
.cx61 .cxx{border:1px solid var(--line);border-left:0;background:var(--panel2);color:var(--muted);font:inherit;font-size:12px;padding:2px 6px;border-radius:0 999px 999px 0;cursor:pointer;align-self:stretch}
.cx61 .cxx:hover{color:var(--bad)}
#m61{position:fixed;z-index:9100;min-width:200px;max-width:min(320px,94vw);max-height:80vh;overflow:auto;background:var(--bg);border:1px solid var(--line);border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.22);padding:6px;display:flex;flex-direction:column;gap:1px}
#m61[hidden]{display:none}
#m61>button{text-align:left;border:0;background:none;color:inherit;font:inherit;font-size:14px;padding:7px 10px;border-radius:8px;cursor:pointer}
#m61>button:hover:not(:disabled){background:var(--panel2)}
#m61>button:disabled{opacity:.4;cursor:default}
#m61>button.bad{color:var(--bad)}
#m61 hr{border:0;border-top:1px solid var(--line);margin:4px 0}
.m61h{font-size:12px;color:var(--muted);font-weight:700;padding:4px 10px}
.m61w{display:flex;flex-wrap:wrap;gap:4px;padding:2px 8px 6px}
.m61f{display:flex;gap:4px;padding:4px 8px}
.m61f input{flex:1;min-width:0}
.lc61 i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:4px;border:1px solid var(--line);vertical-align:middle}
.back61{display:inline-flex;gap:6px;align-items:center;border:1px solid var(--line);background:var(--panel2);color:inherit;font:inherit;font-size:13px;border-radius:999px;padding:4px 12px;margin:0 0 6px;cursor:pointer}
#back61p{position:fixed;left:50%;transform:translateX(-50%);bottom:84px;z-index:8000;border:1px solid var(--line);background:var(--bg);color:inherit;font:inherit;border-radius:999px;padding:8px 16px;box-shadow:0 6px 20px rgba(0,0,0,.2);cursor:pointer}
#back61p[hidden]{display:none}
.dex61{display:flex;flex-direction:column;gap:8px}
.dx61{display:grid;grid-template-columns:64px 1fr;gap:10px;align-items:start;padding:8px;border:1px solid var(--line);border-radius:12px;background:var(--panel)}
.dx61.now{border:2px solid var(--bad)}
.dx61 .pic{position:relative;width:64px}
.dx61 .pic svg{width:64px;height:64px;display:block}
.mb61{position:absolute;right:-4px;bottom:-4px;font-size:13px;background:var(--bg);border:1px solid var(--line);border-radius:999px;padding:0 3px;line-height:1.3}
.mini{position:relative}
</style>

<header''')

s=re.sub('⚔(?!\ufe0f)','⚔\ufe0f',s)
