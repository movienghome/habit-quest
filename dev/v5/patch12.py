# ---------- v6.0 (patch.py 안에서 exec): 하나로 잇기(일퀘·습관·할 일·루틴) · 전투 기록 계산 · 정보창 · 도파민 필터 · 빠른 추가 창 · 보스·장비 상점 ----------
i=s.rindex('</script>\n<script type="module" src="backend.js"></script>')
s=s[:i]+rd('v5q.js')+'\n'+s[i:]
rep('<b>β 베타 v5.9</b>','<b>β 베타 v6.0</b>')
# 말 다듬기: 퀵 → 짧게 (⚡는 용기 표시라 겹쳤음), Errands → Personal
s=s.replace('#퀵 !!','#짧게 !!').replace('#퀵…','#짧게…').replace('^Errands','^Personal')
rep("['errands','⚙Errands','자잘한 볼일","['personal','⚙Personal','자잘한 볼일")
rep('<label>⚡ 퀵 XP<input data-rule="taskXP.quick"','<label>🍃 짧게 XP<input data-rule="taskXP.quick"')
rep('<label>🧱 무거움 XP<input data-rule="taskXP.heavy"','<label>🧱 길게 XP<input data-rule="taskXP.heavy"')
rep("name:'⚡ 퀵 3장'","name:'🍃 짧은 일 3장'")
# 게임 방법
rep("    ${acc('card59',","""    ${acc('card60','🆕 v6.0 · 하나로 잇기 · 장비 상점','지금 버전',`<ul><li><b>일퀘는 '매일 반복'에 붙는 ☑ 표시</b>예요. 행동 카드 습관뿐 아니라 <b>⏱ 루틴</b>·그냥 할 일도 일퀘로 둘 수 있어요. 루틴 일퀘는 완주하면 저절로 채워져요.</li><li><b>루틴 편집</b>: '📅 언제'에서 요일·매일을 고르면 할 일·캘린더에 떠요. 단계에 이은 카드가 ↻ 습관·☑ 일퀘면 그 단계를 끝낼 때 같이 체크돼요.</li><li><b>할 일 상세 🃏 칸</b>: 카드나 루틴 중 하나와 잇고, 매일이면 ☑ 일퀘. '이어진 곳' 칩을 누르면 거기로 가요. 카드 편집 창·이름 정보 창에도 같은 칩이 떠요.</li><li>행동 정보 창: 같은 안내 문구 대신 <b>그 행동의 한 줄 설명(📝 이 행동은)</b>과 💡 도움 되는 한 줄.</li><li>📜 전투 기록: <b>원점수 → 더한 것 → 받음</b>. 점수 0인 '일퀘:' 줄은 그 일퀘를 채운 행동 줄에 붙었어요.</li><li>할 일 크기 '⚡ 퀵' → <b>🍃 짧게</b> · '무거움' → <b>길게</b> (#짧게 태그도 돼요).</li><li>🍬 도파민 메뉴 편집에 스마트 거르기(👍 잘 맞았던·처음 해볼 것·10분 안…)·영역·보이는 칸.</li><li>⚔ 할 일 빠른 추가 창 (Ctrl+Shift+A). 앱 안에서도 같은 단축키.</li><li>홈 '배치 끝'을 누르면 <b>내 배치</b>로 기억해 두고, 배치 화면에서 '↺ 내 배치'로 되돌려요.</li><li><b>3단계 시작</b>: 상점 맨 위 🛡 아바타 장비(투구·갑옷·무기·방패·피부·배경). 보스 이름을 추상적인 적으로 바꿨고, ⚔ 용기는 보스에게 치명타, 쓰러뜨리면 전용 장비가 떨어져요.</li></ul>`)}
    ${acc('card59',""")
rep('</style>\n\n<header','''.conn60{display:flex;gap:4px;flex-wrap:wrap;align-items:center;margin:6px 0}
.conn60>.tiny{margin-right:2px}
.x60c{font-size:12px;padding:2px 8px}
.why60{margin:8px 0 4px;font-size:14px;line-height:1.5;border-left:3px solid var(--accent);padding-left:8px}
.tip60{margin:6px 0;font-size:12.5px;color:var(--muted)}
.when60{display:flex;gap:4px;flex-wrap:wrap;align-items:center;margin:8px 0 2px;padding:6px 8px;border:1px dashed var(--line);border-radius:10px;background:var(--panel2)}
.when60 .wd60{min-width:30px;padding:2px 6px}
.when60 [aria-pressed="true"]{border:2px solid var(--accent);font-weight:700}
.stp60{padding:0 4px 4px 8px;display:flex;gap:6px;align-items:center;flex-wrap:wrap}
.flash60{outline:3px solid var(--accent);outline-offset:2px;transition:outline-color .6s}
.ln60{display:flex;flex-direction:column;gap:6px;margin-top:8px;padding-top:8px;border-top:1px dashed var(--line)}
.calc59 .k60{font-weight:700;color:var(--text);font-size:11px;padding:0 4px;border-radius:4px;background:var(--panel2);margin-right:2px}
.calc59 .ar60{color:var(--muted)}
.calc59 .note60{display:inline-block;color:var(--bad);font-size:11px}
#qa60{display:none}
html.qa60 body>*:not(#qa60):not(#gate):not(#toast):not(.toast){display:none!important}
html.qa60 #qa60{display:flex;position:fixed;inset:0;align-items:flex-start;justify-content:center;padding:14px;background:var(--bg)}
.qa60box{width:100%;max-width:640px;display:flex;flex-direction:column;gap:8px}
.qa60in{display:flex;gap:6px}
.qa60in input{flex:1;font-size:17px;padding:10px 12px}
.qa60p{min-height:20px}
.qa60k{margin-top:2px}
#gear60 .gear60{display:grid;grid-template-columns:minmax(150px,220px) 1fr;gap:14px;align-items:start}
@media (max-width:640px){#gear60 .gear60{grid-template-columns:1fr}}
.gbig60{width:160px;max-width:100%;margin:0 auto;border:1px solid var(--line);border-radius:14px;background:var(--panel2);padding:6px}
.glist60{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:6px;margin-top:8px}
.gi60{display:flex;flex-direction:column;align-items:center;gap:2px;border:1px solid var(--line);border-radius:12px;background:var(--panel);padding:6px 4px;font:inherit;color:inherit;cursor:pointer;text-align:center}
.gi60 b{font-size:12px;line-height:1.25}
.gi60.on{border:2px solid var(--good)}
.gi60.try{border:2px solid var(--accent)}
.gp60{width:56px;display:block}
</style>

<header''')
