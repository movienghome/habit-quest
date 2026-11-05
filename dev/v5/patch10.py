# ---------- v5.8 (patch.py 안에서 exec): 글자 아이콘 · 전투 기록 · 캘린더 · 보드 필터 · 연결 카드 '했나?' 하나로 ----------
i=s.rindex('</script>\n<script type="module" src="backend.js"></script>')
s=s[:i]+rd('v5o.js')+'\n'+s[i:]
rep('<b>β 베타 v5.7</b>','<b>β 베타 v5.8</b>')
# 윈도에서 네모로 깨지거나 파란 네모로 뜨는 이모지 → 바꿈 (💰는 원래 '돈 기록' 표시 → ₩로 비켜줌)
s=s.replace('💰','₩')
s=s.replace('🪙','💰')
s=s.replace('🔁','↻')
# 용어: 리듬 → 반복 (카드에 이어진 반복 할 일 = 습관)
s=s.replace('리듬','반복')
# 스낵바 ×2 ×3 → 무슨 뜻인지 보이게
rep('<button data-snack="n2">×2</button><button data-snack="n3">×3</button>','<button data-snack="n2" title="방금 한 걸 2번 한 걸로 고쳐요 (점수 2배)">2번 했음</button><button data-snack="n3" title="3번 한 걸로 고쳐요 (점수 3배)">3번</button>')
rep("체크하면 바로 기록되고, 아래에 ×2·구슬·편집 버튼이 잠깐 떠요.","체크하면 바로 기록되고, 아래에 '2번 했음·3번·구슬·편집·되돌리기' 버튼이 잠깐 떠요.")
# 칸(섹션)별 묶기: 칸이 있는 할 일이 있을 때만 보임
rep("['prio','중요도별'],['sec','칸(섹션)별'],['none','안 묶음']","['prio','중요도별'],...(Object.values(TASKS).some(t=>t.sec&&t.status===0)?[['sec','칸(섹션)별']]:[]),['none','안 묶음']")
# 목록별 묶기·기본함: 없는 목록 id는 기본함으로
rep("else if(grp==='list'){const m={};list.forEach(t=>{const k=t.list||'inbox';","else if(grp==='list'){const m={};list.forEach(t=>{const k=listOk(t.list)?t.list:'inbox';")
rep("if(sel==='inbox')return !t.list||t.list==='inbox';","if(sel==='inbox')return !listOk(t.list)||t.list==='inbox';")
# 여정: 전투 기록
rep('''  <section class="view" data-view="journey" hidden>
    <div class="grid2">''','''  <section class="view" data-view="journey" hidden>
    <div class="panel" style="margin-bottom:14px"><div class="ptitle"><h2>📜 전투 기록</h2><span class="tiny muted">언제 무엇을 해서 몇 점·어떤 보너스를 받았나</span></div><div id="blog58"></div></div>
    <div class="grid2">''')
rep("['journey','여정','레벨 로드맵·업적·아이디어']","['journey','여정','📜 전투 기록·레벨 로드맵·업적']")
rep('</style>\n\n<header','''.b58{display:block;grid-column:1/-1;font-size:11.5px;color:var(--muted);padding-left:28px}
.bday58+.bday58{border-top:1px dashed var(--line);margin-top:6px}
.ck58{display:inline-block;font-size:11px;line-height:1.2;margin-right:3px;vertical-align:0}
.bchip.on58{border:2px solid var(--accent);background:var(--panel2)}
</style>

<header''')
# 게임 방법
rep("    ${acc('card57',","""    ${acc('card58','🆕 v5.8 · 행동 카드 · 할 일 · 습관 정리','지금 버전',`<ul><li><b>행동 카드</b> = 무엇을 하면 몇 점(⭐ XP · 💰 골드 · ❤ 컨디션). 점수는 여기에만 있어요.</li><li><b>할 일</b> = 언제 할지. 한 번짜리도, 반복도 있어요.</li><li><b>습관</b> = 행동 카드 + 반복 할 일. 카드 편집의 '반복'에서 정하면 '↻ 습관' 목록에 반복 할 일이 생겨요. 둘 중 어디서 체크해도 같이 끝나요.</li><li><b>일퀘</b> = 매일 반복하는 습관 중 ☑ 표시한 것. 다 끝내면 상자.</li><li>몸무게·식사처럼 <b>연결 카드</b>는 그 기록을 하면 일퀘·할 일·행동/습관에서 모두 '했음'이 돼요.</li><li><b>📜 전투 기록</b>: 여정 화면 맨 위. 언제 무엇으로 몇 점·어떤 보너스를 받았나.</li><li>캘린더: 월 보기 날짜를 한 번 누르면 할 일 추가, 두 번 누르면 하루 보기. 할 일 화면 옆 캘린더와 캘린더 화면은 보기 설정이 따로예요.</li></ul>`)}
    ${acc('card57',""")
