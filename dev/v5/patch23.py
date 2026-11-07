# ---------- v7.1 (patch.py 안에서 exec): 써 보고 느낀 점 한 번에 ----------
rep('<b>β 베타 v7.0</b>','<b>β 베타 v7.1</b>')
rep('</style>\n\n<header','\n'+rd('v71.css')+'</style>\n\n<header')
# PC에서 할 일 상세를 옆에 띄운 채 고르기 창·메뉴를 누르면 상세가 닫히면서 고르기 창까지 닫히던 것 (카드 '찾아 고르기'가 안 되던 원인)
rep("if(e.target.closest('#tDetail,.trow,[data-task],[data-ctask],#toast,#pop,#sheet,#acBox,#levelup,#hunt,#huntPill,#searchBox,#search,dialog,.betabar,.ctxmenu,.menu'))return;",
    "if(e.target.closest('#tDetail,.trow,[data-task],[data-ctask],#toast,#pop,#sheet,#acBox,#levelup,#hunt,#huntPill,#searchBox,#search,dialog,.betabar,.ctxmenu,.menu,#pk61,#m61,#snack,.snack,#err69,#upd69'))return;")
# 한글 조합 중 Enter로 자동완성이 골라지던 것 (#집중 → #집 중)
rep("const box=$('acBox');if(!box||box.hidden||!AC.items.length||e.target!==AC.inp)return;",
    "if(e.isComposing||e.keyCode===229)return;const box=$('acBox');if(!box||box.hidden||!AC.items.length||e.target!==AC.inp)return;")
# 묶인 할 일 칸 안에서도 끌어서 순서
rep("(DND.kind==='task'&&dv==='reorder:tasks')","(DND.kind==='task'&&(dv==='reorder:tasks'||dv==='reorder:kids'))")
# 카드 편집 창 '⏱ 루틴': 루틴 단계(할 일)에 이어진 것도 보이게 + 몇 번째 단계로 넣을지 고르기
i=s.index("${(()=>{const rs=(C.routines||[]).filter(r=>r.steps.some(s=>s.aid===a.id));return good?")
j=s.index("})()}",i)+5
s=s[:i]+"${good?aeRt71(a):''}"+s[j:]
rep("const ts=openTasks().filter(t=>t.aid===a.id);return `<div class=\"small\">✅ 연결된 할 일","const ts=openTasks().filter(t=>t.aid===a.id&&!t.rstep);return `<div class=\"small\">✅ 연결된 할 일")
# 카드 타이머 방식: 🌊 몰입 · 타이머 안 씀
rep("<option value=\"speed\" ${a.tmode==='speed'?'selected':''}>⚡ 빠를수록 보너스</option></select>",
    "<option value=\"speed\" ${a.tmode==='speed'?'selected':''}>⚡ 빠를수록 보너스</option><option value=\"flow\" ${a.tmode==='flow'?'selected':''}>🌊 몰입 (최소 시간 · 넘겨도 보너스)</option><option value=\"none\" ${a.tmode==='none'?'selected':''}>⏹ 타이머 안 씀 (그냥 기록)</option></select>")
# 새 카드는 목록 맨 위
rep("C.actions.push(newAction(id,name,type,$('addActArea').value||C.areas[0].id,once))","C.actions.unshift(newAction(id,name,type,$('addActArea').value||C.areas[0].id,once))")
rep("if(col==='actions')C.actions.push({id,name:d.type==='good'?'새 좋은 행동':'새 나쁜 행동',type:d.type,area:C.areas[0].id,cond:d.type==='good'?5:-15,gold:d.type==='good'?2:0,","if(col==='actions')C.actions.unshift({id,name:d.type==='good'?'새 좋은 행동':'새 나쁜 행동',type:d.type,area:C.areas[0].id,cond:d.type==='good'?5:-15,gold:0,")
# 월 보기: 주 시작 요일 · 여러 날 일정
rep("let cells=['월','화','수','목','금','토','일'].map(","let cells=WKH71().map(")
rep("open.forEach(t=>{if(t.due)(byDay[t.due]=byDay[t.due]||[]).push(t)});","open.forEach(t=>{spanDays71(t).forEach(k=>(byDay[k]=byDay[k]||[]).push(t))});")
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w71.js')+s[i:]
rep("    ${acc('card70',","""    ${acc('card71','🆕 v7.1 · 찾기 · 🔀 루틴 골라 하기 · ↔ 여러 날 일정 · 🏷 태그','지금 버전',`<ul><li><b>🔍 할 일 찾기</b>: 할 일 화면 맨 위(Ctrl+F). 이름·메모·#태그·목록으로.</li><li><b>입력 더 똑똑하게</b>: '17~20일 촬영'·'3일부터 9일까지'(여러 날 일정) · '9일 마감' · '11시부터 2시간 동안' · '30분 미만' · '주에 3번' · '다음주 토요일부터' · *구슬 · @영역. 목록을 안 고르면 <b>기본 목록</b>(Personal)으로, 태그에 기본 목록을 정해 두면 그 목록으로. 추가하면 알림에 '되돌리기'.</li><li><b>⋯ 자세히</b>: 입력칸 옆 — 만들면서 바로 상세를 열어요. 방금 만든 건 상세 맨 위 '↶ 만들기 취소'.</li><li><b>할 일 상세</b>: 칸마다 구분선·이름표, 완료 단추는 아래에 붙어 있어요. 크기는 안 정하면 비어 있고(기본 점수), <b>⚔️ 용기는 크기와 따로</b>. 💰 골드는 경제 영역·직접 정한 것만. 카드에 이은 할 일은 <b>×1.5·×2·×3</b>로 더 줄 수 있어요. 🎯 집중·📄 복사, ↔ 끝나는 날.</li><li><b>루틴</b>: 단계 줄 🔀 = 앞 단계와 '하나만 골라 하기', ◌ = 건너뛰어도 완주. ⏰ 몇 시쯤을 정하면 목록·캘린더가 시간 순서로. 단계를 목록에서 하나씩 체크해도 다 되면 완주(일퀘도 체크).</li><li><b>🏷 태그</b>: '/'로 상위/하위, 태그마다 기본 영역·목록. 📁 폴더를 누르면 그 안의 목록을 한꺼번에.</li><li>여러 개 고르기 → 📅 날짜…(모레·주말·다음 주·직접), 상점 💰 정렬, 한 주 시작(월/일), 카드 보드가 기본·칸 어디를 눌러도 편집, 새 카드는 맨 위, 카드 '⏹ 타이머 안 씀', 🍬 코스 설명.</li><li>고친 것: PC에서 카드 '찾아 고르기'를 눌러도 안 되던 것 · 카드 편집에 '루틴 없음'으로 뜨던 것 · #집중이 '#집 중'으로 갈라지던 것 · 묶인 할 일 끌어서 순서 · 루틴 단계 줄 버튼 겹침 · 폰에서 입력할 때 화면이 튀던 것 · 밤 루틴이 낮에 '기다리기' 띠로 뜨던 것 · 날짜 없음에 루틴 단계가 쌓이던 것.</li></ul>`)}
    ${acc('card70',""")
