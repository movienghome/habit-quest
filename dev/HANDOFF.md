# 해비티카틱 (옛 습관 퀘스트) — 이어서 작업하기 (v7.1 본 앱·베타 같음, 2026-11-07)

> **새 채팅에서 할 일 (Claude에게)**: 먼저 `add_repo`로 `movienghome/habit-quest`를 붙이고 `git clone --depth 1`. 이 파일은 저장소의 `dev/HANDOFF.md`에도 있음 — 저장소 쪽이 최신이면 그걸 따름. 릴리스할 때마다 이 파일도 같이 고쳐서 커밋.

## 저장소·주소
- 저장소: github.com/movienghome/habit-quest (GitHub Pages + Firebase)
- 본 앱: https://movienghome.github.io/habit-quest/ → **v7.1** (2026-11-07. 데이터: habit)
- 베타: https://movienghome.github.io/habit-quest/beta/ → **v7.1** (데이터: habit-beta. 시험용)
- 작업 방식: 고친 건 베타에 먼저 → 사용자가 "반영해" 하면 본 앱에 옮김. (v7.1: 사용자가 '안정성 문제 없으면 본 앱에 바로'라고 함 → 시험 통과하면 바로 승격)
- **승격 방법(v6.8부터)**: 빌드는 베타와 같은 파일. `cp beta/index.html beta/backend.js beta/sw.js .` (index.html·backend.js·sw.js가 경로 `/beta/`로 베타/본 앱을 스스로 구분 — β 띠·데이터 폴더·캐시 이름). manifest만 따로(이름).
- **빌드 원본**: patch.py의 SRC = `dev/v5/base44.html`(옛 본 앱 v4.4). 루트 index.html은 이제 빌드 결과라 원본으로 쓰면 안 됨.

## 사용자 요청 (항상)
- 한국어로 답하기. 파일 여러 개 보낼 땐 사용자가 할 일을 따로 정리.
- 파란색 싫어함, 색약 있음 → 색만으로 구분하지 말 것(아이콘·글자 같이).
- 유료 서비스·Blaze 전환·외부 서비스 추가 금지(별도 승인 없으면). 개인 백업을 외부로 보내지 않기.
- **행동/습관 목록(C.actions)은 사용자가 직접 손봤음 → 사용자가 요청하기 전엔 이름·점수·영역·순서를 바꾸는 마이그레이션 금지.**
- 매 답변마다 같이 고민: 요구가 틀렸으면 말하고, 더 나은 방법 제안. 근본 재설계가 낫다면 그렇게 말하기.

## 소스 구조 (중요)
- `beta/index.html`은 **생성 파일**. 직접 고치지 말고 `dev/v5/`의 모듈을 고친 뒤 빌드.
- 빌드: `ln -sfn <저장소>/dev/v5 /home/claude/v5` 후 `cd dev/v5 && python3 patch.py`
  (patch.py의 SRC/DST/V는 /home/claude/habit-quest, /home/claude/v5 기준. 중간 파일은 임시 폴더에 씀)
  - 순서: patch.py → patch2 → patch3(v5.1) → patch4(v5.2) → patch5(v5.3) → patch6(v5.4) → patch7(v5.5) → patch8(v5.6) → patch9(v5.7) → patch10(v5.8) → patch11(v5.9) → patch12(v6.0) → patch13(v6.1) → patch14(v6.2) → patch15(v6.3) → patch16(v6.4) → patch17(v6.5) → patch18(v6.6) → patch19(v6.7) → patch20(v6.8) → patch21(v6.9) → patch22(v7.0) → **patch23(v7.1)**
  - JS 모듈: v5a~v5j + v5k(v5.4: 카드 통일·점수·용기·프리셋) + v5l(v5.5) + v5m(v5.6) + v5n(v5.7) + v5o(v5.8) + v5p(v5.9) + v5q(v6.0) + v5r(v6.1) + v5s(v6.2, CSS는 v62.css) + v5t(v6.3, CSS는 v63.css) + v5u(v6.4, CSS는 v64.css) + v5v(v6.5, CSS는 v65.css) + v5w(v6.6, CSS는 v66.css) + v5x(v6.7, CSS는 v67.css) + v5y(v6.8, v68.css) + v5z(v6.9, v69.css) + w70.js(v7.0, v70.css) + **w71.js(v7.1, v71.css — 다음은 w72.js·v72.css)** — v5k는 mig53 앞, **v5l·v5m은 스크립트 맨 끝**(같은 이름 함수를 덮어씀: actionsEditHTML). openActionEditor·openTaskSheet·closeSheet는 v5l에서 감싸서 다시 대입.
  - 주의: **첫 render는 스크립트 중간(route())에서 돌아서 맨 끝 모듈의 const/let은 물론 var도 아직 비어 있음.** 함수 선언(호이스팅)이 첫 render에서 쓰는 상수는 함수 안에(v5w의 `K66()` 식).
  - 클래스 이름 `.mc`는 월 캘린더 칸이 씀 → 칩은 `.mx`.
- 릴리스 때 `beta/sw.js`의 VERSION 올리기 (지금 `2026-11-07-v71`). 베타 띠에 버전 표시(`β 베타 v7.1`) — 같이 올리기.
- **v6.9부터 `route();boot();`는 스크립트 맨 끝에서 불러요(patch22·23은 w70.js·w71.js를 그 바로 앞에 넣음 — 다음 모듈도 `\nroute();boot();\n` 앞에).** 첫 render 때 모든 모듈·감싸기가 준비돼 있음. (위 '첫 render는 스크립트 중간' 주의는 이제 옛 얘기)
- **patch10은 빌드 결과 전체에서 글자 치환을 함**: `💰`→`₩`, `🪙`→`💰`, `🔁`→`↻`, `리듬`→`반복`. 그러니 **v5o 이후 모듈에서 🪙·🔁·'리듬'을 비교 문자열로 쓰면 바뀌어 버림** → `\u{1F501}`처럼 이스케이프로 쓰기.
- `normConfig`는 `C.ui`의 정해진 키만 남김(새 키는 사라짐) → 새 ui 설정은 기존 키 안(예: `C.ui.cal._t`)이나 `C` 최상위에.
- `route()`는 journey 같은 화면 전환 때 render를 안 부름 → 새 화면 내용은 hashchange에서 따로 그림(renderBlog).
- 함수 덮어쓰기: v5n은 맨 끝이라 `{const _f=f;f=function(){...}}` 식으로 감쌈(render·taskRow·applyEntry·parseQuick·acCompute·renderCal·dndEnd·doAction 등). function 선언(applyHomeEdit·homeEditOn·tsChipsHTML·isHabit·rhythmOf)은 뒤에 있는 게 이김.
- **저장 안전장치(v5.9)**: `beta/backend.js`(생성 파일 아님, 직접 고침) onSnapshot 셋째 인자 `{meta:1}` → includeMetadataChanges. 설정·진행·날짜 스냅샷이 `fromCache:false`(서버 확인)일 때만 ready. `SRV59.c` 전에는 config를 서버에 안 씀(flush 미룸), 서버가 처음 오면 그 전 로컬 config 변경은 버리고 서버 것을 씀. 원인: 기기 캐시(persistentLocalCache)의 옛 config로 그린 뒤 자동 저장이 서버를 덮어써서 지운 카드가 되살아났음. **본 앱(루트 backend.js·index.html)에도 같은 문제가 있음 → 승격 때 같이 반영.**
- 함수 선언 덮어쓰기(v5p): actBoardHTML·dopaEditHTML·blogHTML은 v5p의 function 선언이 이김. render·renderNav·taskBase·drawTaskSheet·parseQuick·dndMove·dndEnd·actionsEditHTML은 감쌈.
- 함수 선언 덮어쓰기(v5q): spriteSVG·calc59·blogHTML·dopaEditHTML·routinesEditHTML·habRows59·did59·sched59는 v5q 선언이 이김. syncDailies·watchTarget·toggleQuest·finishRoutine·applyEntry·effortOf·drawTaskSheet·aeTopHTML·infoFor·reviewHTML59·applyHomeEdit·weekState·render는 감쌈.
- 테스트 하네스(v6.0): backend.js를 `window.__hqResolve(window.__mockApi)`로, config.js·sw.js는 빈 응답으로 가로채고 init script에 mockdb.js. `window.claude`는 index.html이 만드니 건드리지 말 것. 시드: `window.__seed({'game/config':cfg})`.
- **patch13(v6.1)은 아이콘을 빌드 전체에서 바꿔요**: 원래 ⚔(사냥·전투) → 🏹·👾, `✨`→`🌸`(행복), `⭐`→`✨`(XP), `❤`→`🔋`(컨디션), `⚡`→`⚔️`(용기, FE0F 붙임), 그다음 번개 자리만 `⚡`로 되돌림. **v5r은 아이콘 바꾸기 뒤에 넣어요**(그래서 v5r 안의 글자는 그대로). v5r보다 앞 모듈에서 ⚡를 쓰면 ⚔️가 돼요 → 번개는 `\u26A1`.
- v6.1 테스트 하네스: `dev/v5/h61.py`(목업·경로 가로채기) + `t61.py`(루틴·고르기·메뉴·뒤로·배치·일퀘). 서버: 저장소 루트 `python3 -m http.server 8765`.
- 테스트: Playwright + `dev/v5/mockdb.js`. 저장소 루트에서 `python3 -m http.server 8765`. 옛 t*.py는 경로 수정 필요. v5.4 테스트는 v7 설정(일퀘·용기·샤워/술 옵션)을 넣고 마이그레이션·완료 흐름 확인하는 식.

## 핵심 설계 (v5.4에서 정함)
- **점수는 습관(행동) 카드에만.** 일퀘·도파민 메뉴·할 일 연결·루틴은 카드를 보여주는 방법.
- **일퀘 = `a.daily` 붙은 습관 카드.** `C.dailies`는 저장하지만 `syncDailies()`가 render 때마다 카드에서 다시 만듦(일퀘 자체 XP·골드 0, 상자 보너스만).
  - 몸무게·식사·용기와 이어진 일퀘는 **연결 카드**(`a.link`='@weigh'|'@food:id'|용기 id, 점수 0). 누르면 그 기록으로.
  - 옛 일퀘 id는 `a.qid`로 보존(그날 기록과 맞물림).
- **도파민 메뉴** = 카드의 `a.dopa`(코스). 이미 카드 통일돼 있었음.
- **루틴** = 카드 묶음(steps[].aid). 루틴 완주 보너스는 routine.xp/gold.
- **용기**: 습관 카드에 `a.brave`='s'|'m'|'l'(⚔ 표시) → 기록 시 e.brave·e.pts, 용기 구슬. `C.courage`(⚡ 용기 버튼 목록)는 그대로 유지. 할 일은 `t.brave`.
- **점수 뜻**: XP=성장(레벨) · 골드=현실의 돈·자원 · 컨디션=지금의 몸과 마음. 해당 없으면 0.
- **프리셋** `C.presets{good,bad}`: 편집 창 '빠르게 채우기', 새 습관 기본값, 빠른 기록 '그냥 한 일'(가벼움·보통·힘듦).
- **HP(컨디션)** = 아침 기준값 + 모든 컨디션 변화의 합(영역 평균 아님). 영역 막대는 균형 보기용.
- 유지되는 것: 세부 옵션별 점수, 나쁜 행동 누적 배수(C.penalty), 흐름 끊기 보너스(C.chain), 방치 경보.
- 점수 재설정은 이름 기준(SCORE54·BRAVE54·RULES54, v5k.js). 예전 값은 `C.scoreBak` → 습관 탭 맨 아래에서 되돌리기/확정.
- 설정 버전 v8 (mig54). v5.5는 설정 변경 없음(C.ui.aeShow만 새로).

## v5.5에서 한 것
- 이름: '습관(행동)' → **행동/습관**, '습관 카드' → **행동 카드**. **🔁 습관 = 리듬(매일·요일·📌)이 있는 행동 카드**(isHabit).
- 편집 → 행동/습관: 줄마다 ☑(매일 토글)·🗑(지우기+되돌리기 알림), '☐ 여러 개 고르기'(지우기·영역 바꾸기·매일 켜기/끄기), 필터 모두/좋은/나쁜/🔁 습관/⚔ 용기, '👁 보이는 칸'(C.ui.aeShow) + 점수를 아이콘 칩으로(metaChips).
- 정보 창(이름 꾹/탭): 반쪽 편집칸 제거 → 칩 요약 + '✎ 편집'(전체 편집 창). ← 사용자가 '빠르게 채우기가 안 보인다'고 한 원인.
- 저장 방식: **행동 카드 편집 = 완료를 눌러야 저장**(×·바깥 = 취소, 알림 '되살리기'). **할 일 상세 = 자동 저장**, 바깥 누르면 저장하고 닫힘(PC 오른쪽 도킹도).
- 루틴: 단계 aid → 그 카드로 기록(이미 됐었음). 루틴 자체는 **완주 보너스만**(부분 완료 0, 컨디션 0).
- 오늘: 연결된 할 일이 오늘 있으면 그 카드의 습관 줄은 숨김(todayTaskAids).
- 할 일 상세 '더 보기'에 연결된 카드 칩 + 카드 편집.
- 스마트 목록: ⏰ 지난 것 · ⏳ 마감 3일 안 · ⚡ 용기(할 일 또는 연결 카드 ⚔) · ☠ 미룬 것 · 🔁 습관 연결. 검색에서 '용기'·'습관'·'매일'로 찾기.
- 게임 방법: 새 버전 항목을 '자세한 규칙' 맨 위로.

## v5.6에서 한 것
- 홈: `C.ui.home` 항목 = [id, 켜짐, 'L'|'R']. 넓은 화면은 #hcolL/#hcolR 두 칸(homeTwo: 폭 760↑), 칸 사이 끌기(homeDrop, drop.grp) + ⇢/⇠ 버튼. 폰은 한 줄·순서만. 옛 CSS columns 흐름 제거.
- 📦 할 일 묶음: `t.parent`(한 단계만). 목록에서 머리 밑에 접고 펴기(C.ui.tfold, nestRows). 묶여도 각자 따로 점수. 상세의 '묶인 할 일'(새로 추가·있는 것 넣기·빼기), 여러 개 고르기 → '📦 묶기'(머리 고르기/새 묶음), 체크리스트 항목 ↗ → 묶인 할 일. 머리를 지우면 자식은 풀림. 옛 subs는 '체크리스트(점수 없음)'로 이름만 바뀜.
- 타이머: `tmode` (카드 a.tmode·할 일 t.tmode, 없음=시간 안에). speedOf(…, mode): 시간 안에 = 목표 안이면 기본 XP×0.25, 빠를수록 = 번개/빠른/제시간. 사냥 화면에서 시작 2분 안에만 목표 분(±5)·방식 바꾸기(HUNT_LOCK).
- 할 일 상세: drawTaskSheet를 감싸서 tsRestyle가 DOM을 재배치 — 제목 밑 칩 한 줄(📅·🃏·#·🧭·📂·⚑·크기·⏱·⋯), 누르면 그 칸만 펼침(ui.tsPanel). 입력칸 id는 그대로라 tsRead 그대로 씀. 태그 칸에 있는 태그 칩. '편집 끝' → '닫기'.
- 주의: 할 일 상세 안 input의 change는 전역 핸들러가 시트를 다시 그림 → Enter로 제출하는 칸은 change를 막아야 함(x56KNew).

## v5.7에서 한 것 (반복과 리듬 하나로 · 도파민 새로 · 2단계 시작)
- **리듬 = 연결된 반복 할 일(t.hab=1) 하나.** 카드엔 반복 필드 없음. mig57(C.mig57): a.daily/a.pin → 매일 반복 할 일, a.wd → 매주 요일 할 일, '🔁 습관' 목록(Lhabit), daily는 t.quest=1, 옛 a.qid → t.qid(그날 일퀘 기록과 맞물림).
  - 옛 화면 코드가 읽는 a.daily/a.wd/a.pin은 habMirror()가 render마다 **열거 안 되는 속성**으로 비춰줌(저장 안 됨). 옛 쓰기 핸들러(aedaily·x55daily·dly*·pin·aewd·aepin·daily1/0·addform quest)는 v5n capture 핸들러가 먼저 가로채 setRhythm()으로.
  - syncDailies: mig57 뒤엔 t.hab&&t.quest&&rep.f==='d' 할 일에서 만듦(tasksReady 전엔 그대로 둠 → 상자 잘못 회수 방지).
  - habAuto(applyEntry 감쌈): 카드를 직접 기록하거나 연결 카드(몸무게·식사) 일퀘가 채워지면 그날 리듬 할 일을 완료 처리(e.tid·prevDue → 되돌리면 다시 열림). habRoll: 놓친 리듬 할 일은 ☠ 없이 오늘/다음 날로.
  - 오늘의 '습관' 줄 → 방치 경보만('⚠ 오래 안 한 행동'). 연결 카드 할 일의 체크 = linkGo.
  - 카드 편집 '리듬' 칸 = 없음/매일/요일/다른 반복…(할 일 열기), ☑ 일퀘. 할 일 상세 🃏 칸에 리듬 표시 + ☑ 일퀘.
- **도파민 메뉴 = '🍬 지금 어때?'** (홈 칸 dopa, 뽑기 화면, 🍬 버튼, 나쁜 행동 기록 뒤 알림). 상태 6개(DSTATE: 처짐→app, 시작 안 됨→side+5분, 폰 당김→app+dessert·🌊10분, 과부하→rest, 여유→main, 보상→dessert/special) → 3개만. 해본 뒤 👍😐👎 → C.dopaFit[aid][state] 점수로 정렬, C.dopaPend로 다음에 다시 물음. 디저트는 '시간 정해' = 타이머(시간 안에 멈추면 보너스). dopaMig(C.dopa57): 코스 설명 정정, 🛋 쉼표(rest) 코스 추가, 새 항목 12개.
- 할 일 상세: 펼친 칩 칸 테두리·배경·머리글(▴ 접기), 날짜·마감 한 줄, '날짜 없음' 버튼 제거, 💭 문구 칩, ⋯는 기록 있을 때만, 체크리스트 추가 버그(Enter 전 change로 시트 다시 그려짐) 수정, 🗑 삭제 · 안 하기 · 미루기 ▾(내일·모레·주말·다음 주·+1주·날짜).
- 홈: '배치 끝'에서 applyHome 안 불러 숨김이 안 먹던 버그 수정, ↑↓ 한 칸, 빠른 배치 프리셋 4개, '작게 보기(전체 지도)'.
- 이름: 메뉴 '습관 모음' → **행동/습관**. 행동/습관 목록에도 칩 요약, 📌 → 🔁(매일 리듬 켜고 끄기).
- 2단계: 편집 → 행동/습관 **▦ 보드**(영역 칸, 끌어서 영역 바꾸기; drop 'dopa:@a:영역' → dndEnd 감쌈) · 자연어(시간 범위 '7시부터 8시까지'·'3시~4시 반', '매주 반복'=그 요일, 'X까지'=마감) · 할 일 입력 자동완성에 🃏 행동 카드, 이름이 카드면 연결 칩 · 상세 태그 칸 자동완성 · 캘린더 빈 시간 칸 누르기/끌기로 할 일 추가(폰은 누르기만), 색 기준(중요도/영역/목록, 파랑 빼고 글자 표시), 트레이 '지난 것' 탭 제거 · 몸 기록 화면 폰 가로 넘침 수정.

## v5.8에서 한 것 (v5o.js · patch10.py)
- **개념 정리(사용자에게 설명함)**: 행동 카드 = 무엇을 하면 몇 점(점수는 여기만) · 할 일 = 언제 할지(한 번/반복) · **습관 = 카드 + 그 카드에 이어진 반복 할 일**('↻ 습관' 목록) · 일퀘 = 매일 습관 중 ☑. 화면 말 '리듬' → '반복'.
- **연결 카드 '했나?' 하나로**: `linkMet(a,day)`(= questCondMet). `doneToday`가 link를 봄. `habLinkSync()`(render 앞): 연결 카드의 반복 할 일이 오늘 몫인데 기록이 이미 있으면 완료 처리(quest 엔트리 또는 weigh 엔트리에 tid 붙임 → 되돌리면 다시 열림; weigh 되돌리기도 undoTaskFrom). 원인: 몸무게를 mig57 전에 적었거나 일퀘 아닌 연결 습관이면 할 일이 안 끝났음. 행동/습관 화면 체크도 linkMet로(logLinkMarks), 누르면 linkGo.
- 아이콘: 🪙(윈도10에서 네모로 깨짐) → 💰, 🔁(윈도에서 파란 네모) → ↻ 글자. 원래 💰(돈 기록 표시)는 ₩로. mig58: '🔁 습관' 목록 이름 → '↻ 습관'.
- 스낵바 ×2·×3 → '2번 했음'·'3번'(방금 기록을 2·3번 한 걸로, 점수 배수).
- 할 일 묶기: '칸(섹션)별'은 칸 있는 할 일이 있을 때만 보임. 없는 목록 id 할 일은 기본함으로(목록별 묶기에서 '기본함'·'📥 기본함' 둘로 갈리던 버그; `listOk`, listName 덮어씀). 스마트 목록 '🔁 습관 연결' 뺌('↻ 습관' 목록과 겹침).
- 📜 **전투 기록**: 여정 맨 위(#blog58). 종류(모두/행동/할 일/보너스/나쁜 것)·기간(7/30/전체) · 날짜별 합계 · '⤷ 보너스' 줄. 보기 전용(logRow에서 × 지움).
- 캘린더: **할 일 창 옆 캘린더와 캘린더 창 설정 따로** — `C.ui.cal`에 getter(splitOn()이면 `cal._t`), `C.ui.toJSON`으로 저장. 월 보기 날짜 한 번 = 할 일 추가 창(calAddDay), 두 번(280ms 안) = 하루 보기. '색: 목록' → '표시: 목록 이모지'(색 칠 안 하고 목록 앞 이모지, 없으면 앞 두 글자).
- 편집 → 행동/습관 **보드에도 목록과 같은 도구줄**(검색·모두/좋은/나쁜/습관/용기·영역·정렬(점수 큰 순·자주 한 순 등, 칸 안에서)·여러 개 고르기·보이는 칸). actionsEditHTML을 board 꺼서 부른 뒤 elist 자리에 보드를 끼움.

## v5.9에서 한 것 (v5p.js · patch11.py)
- **지운 카드 되살아남 고침**(위 '저장 안전장치'). 편집 → 행동/습관 맨 위 '🧹 되살아난 카드 정리'(id dp*/dq* + dopaOnly 카드 체크해서 delActs, '닫기'=C.clean59).
- **행동/습관 화면 배치**: `C.logLay59`=[[id,'L'|'R',fold,hide]] (brave·acts·food·log). ⚡ 용기 기본 접힘. 칸 제목/▾로 접기, '▦ 화면 배치'로 ↑↓·⇢⇠·👁. 식사·몸무게 칸에 '📈 몸 기록' 링크.
- **전투 기록 계산**: 줄마다 calc59(카드 점수 × 횟수 × 누적배수 + 속도 보너스 × 뽑기 = 결과, 할 일은 크기+중요도+제때). '☑ 계산 보기' 토글. 지금 카드 기준으로 풀어 써서 다르면 표시('가진 골드까지만 빠짐' 포함).
- **할 일 점수**: 카드 연결 없는 할 일은 원래부터 크기·중요도 점수(C.taskXP)가 있었음 → 크기 칸에 '✎ 직접 정하기'(`t.px={xp,gold,cond}`, taskBase 감쌈).
- **돌아보기**(#review, NAV_ITEMS에 'review'): 이번 주(지난주 비교·↻ 습관 지킨 날 표·🍬 👍 순위·⚔ 용기·한 줄 메모 `C.wnote59[주시작]`). review/stats/journey/body 위에 탭 줄. `C.nav59`='new'(기본)면 왼쪽 메뉴에서 통계·여정·몸 기록·유리병을 빼고 홈 '유리병' 칸을 켬(`C.nav59j`로 되돌림). '예전처럼 따로' 버튼으로 원래 메뉴.
- **보드 공용 칩**(kbChip59): 행동 보드와 도파민 편집이 같은 칩·metaChips. 도파민에 칸 안 정렬 select. **칸 안 순서 끌기**(정렬 '기본 순서'일 때; dndMove/dndEnd 감싸 C.actions 순서 바꿈, 이름 버튼에도 data-drag).
- **캘린더 폰**: 빈 시간 칸 0.35초 꾹 → 끌어서 범위(v5n 수정). 그냥 움직이면 스크롤.
- **자연어**: 요일 묶음 '화목'·'월수금'·'화·목'(반복 말·시간·3개 이상일 때만, '금일' 제외), '월요일마다', 제목에 남던 '매주' 제거, 범위 시간 1~7시는 오후(한 시각 규칙과 같게). '수영'의 '수'를 수요일로 읽던 버그 없어짐.

## v6.0에서 한 것 (v5q.js · patch12.py) — 하나로 잇기 · 3단계 ①
- **일퀘 = '매일 반복 할 일'의 ☑ 표시**(카드 습관만이 아니라 루틴·그냥 할 일도). syncDailies 감싸 `t.quest&&isDailyRep&&!(t.hab&&t.aid)` 할 일을 `action:'@t:'+tid`로 추가. watchTarget이 '@t:'를 알아서 questCondMet·syncQuests가 저절로 채움(할 일 완료 엔트리 e.tid, 또는 루틴 완주 엔트리 e.rid·e.full). toggleQuest: 루틴이면 startRun, 아니면 completeTask, 했으면 엔트리 지우기.
- 루틴 기록에 `e.rid`·`e.full`(finishRoutine 감싸 FR60 → applyEntry에서 붙임). rollQ60: 놓친 일퀘·루틴 반복 할 일은 ☠ 없이 오늘로.
- **루틴 편집**(routinesEditHTML 새로): '📅 언제' 요일 칩·매일·안 정함 → 루틴 반복 할 일(`t.rid`, 목록=r.list) 만들기/고치기/지우기(setRt60), ☑ 일퀘(매일일 때). 단계 밑에 '↳ 끝내면 카드 ⭐ 기록 · ↻/☑도 체크 · ✎ 카드'.
- **연결 지도 칩**(connCard60/connRt60): 카드 편집 창·행동 정보 창·할 일 상세·루틴 일퀘 정보 창에 같은 칩(↻/☑ 반복 할 일 열기 · ⏱ 루틴 n단계 · 🍬 코스 · ⚔ · 📋 연결된 할 일 · '＋ 반복 정하기'). data-x60task / data-x60rt / data-x60rep.
- **할 일 상세 🃏 칸** = '카드 · 루틴 연결': `#x60Rid`(루틴 고르면 aid 지움, 카드 있으면 루틴 못 고름), ☑ 일퀘(매일 반복이면 무엇이든; 카드 습관은 기존 habInfoHTML), 이어진 곳 칩, 루틴이면 ⏱ 지금 시작·✎ 루틴 편집.
- 카드에 `a.why`(📝 이 행동은 한 줄) — 편집 창 맨 위. 정보 창: 같은 안내 문구 대신 a.why + 이어진 곳 + 💡 tip60(연속·처음·오래 안 함·자주 하는데 반복 없음 등).
- 📜 전투 기록 calc59 새로: **원점수 → 더한 것 → 받음**(XP·골드·컨디션 글자로). 점수 0인 '일퀘:' 줄은 숨기고 그 일퀘를 채운 행동/할 일 줄에 '☑ 일퀘 칸 채움'(Q60). 루틴 줄은 완주 보너스 원점수 + 속도.
- '⚡ 퀵' → '🍃 짧게', '무거움' → '길게'(EFFORTS 라벨, #짧게·#길게 태그도 인식, 뽑기 프리셋 이름 C.eff60). ⚡는 용기에만.
- Errands → Personal(입력칸 예시·LIST_DEF 기본 이름만. 사용자 목록 이름은 사용자가 이미 바꿈).
- 도파민 편집: 스마트 거르기(DF60: 모두·👍 잘 맞았던·처음 해볼 것·⏱10분 안·↻ 습관·⚔ 용기·💤 30일 안 함) · 영역 · 보이는 칸 · n/전체 보임 · 거르기 풀기. 거르는 중엔 칸 안 순서 끌기 끔.
- 돌아보기 '↻ 반복 지킨 날': 행 = 지금 열린 ↻ 습관(카드+반복)·⏱ 루틴 반복·☑ 일퀘(위로). **만든 날(t.created) 전은 빈칸.** 반복을 끄면 행이 빠짐(기록은 남음).
- **빠른 추가 창** `?quick=1`: html.qa60이면 앱 화면 숨기고 입력칸만(로그인 화면은 보임). Enter=추가하고 닫기(저장 대기 후 window.close), Shift+Enter=추가하고 계속, Esc=닫기. 불러오기 전 입력은 줄 세웠다가(QAQ60) ready·tasksReady 뒤 render에서 넣음. 앱 안에서도 Ctrl+Shift+A = 빠른 추가 시트. 바탕화면 단축키는 `tools/quickadd-setup.ps1`(시작 메뉴 바로 가기 + Hotkey CTRL+SHIFT+A, chrome/edge --app).
- 홈: '배치 끝' 때 `C.homeMine60={at,h}` 저장, 배치 화면에 '↺ 내 배치' 버튼. (업데이트가 홈을 되돌리는 코드는 없음 — 시험함. 원인은 v5.9에서 고친 옛 기기 사본 덮어쓰기로 봄.)
- **3단계 ①**: BOSSES 이름 바꿈(무한 스크롤 슬라임→망설임의 안개, 야식 고블린→무기력 늪지기, 불안 안개 색만). weekState 감싸 ⚔ 용기 XP = 치명타(한 번 더 데미지, s.crit). **장비 상점**(상점 맨 위 #gear60): GEAR60(투구·갑옷·무기·방패·피부·배경, at=[x,y] 아바타 픽셀 좌표), `C.gear60={own,eq,got}`, 사기 = buy 엔트리. spriteSVG 새로(배경 → 그림자 → 방패·몸·갑옷·투구·무기, 피부는 사람형 S만). 보스 전리품: 처치 기록 있는 주마다 BOSS 이름의 drop 장비(옛 이름은 BOSS_OLD60로).

## v6.1에서 한 것 (v5r.js · patch13.py)
- **고친 버그**: normConfig가 `C.ui`의 smart(스마트 목록 순서)·tfold(묶음 접힘)·navAll·aeShow를 버려서 새로고침하면 되돌아갔음 → normConfig 감싸 UIKEEP61 키를 지킴. **새 ui 키를 쓰면 UIKEEP61에 넣을 것.**
- **루틴 단계 = 카드(aid)·할 일(tid)·이름만(name)**. 단계 이름은 stName61로 카드·할 일에서 읽음(따로 저장 안 함). 편집 UI rtCard61(편집 화면·루틴 창 같음, data-r61*). ＋ 단계 = 고르기 창(카드/할 일/이름만, 여러 개, 새 카드·새 할 일 바로 만들기). 이름만 단계는 🃏로 카드 만들기. 사냥: startRun 감싸 끝났거나 지워진 할 일 단계는 건너뜀, huntDo 감싸 할 일 단계 끝내면 completeTask(direct).
- 반대 방향: 카드·할 일에서 **⏱ 루틴에 넣기**(rtJoin61 → 루틴 고르기 → 몇 번째) · **루틴으로 만들기**(promoteTask61: 묶인 할 일→tid 단계, 체크리스트→이름 단계, 카드→첫 단계, 그 할 일은 t.rid로 루틴 시작 버튼이 됨 / promoteCard61).
- 루틴 칩(data-x60rt)은 편집 화면으로 가지 않고 **루틴 창**(openRt61, sheetCtx.rt61).
- **일퀘 = 반복 할 일의 ☑, 그 일이 뜨는 날만**(qOn61: 매일/요일/그 외는 due·last 날). syncDailies 새로. t.skip61=[날짜] = 오늘 건너뛰기. 편집 → 일퀘 = 요일 표(qToggleWd61, 칸 = 요일 켜고 끄기) + ＋ 일퀘 추가(고르기 창). ☑는 매일이 아니어도 켤 수 있게(v5n·v5q 소스 고침).
- **같은 거르기**: flt61/fltBar61(모두·좋은·나쁜·🍬 도파민·↻ 습관·⚔ 용기 + 개수). 편집 화면 ui.ae.type은 C.ui.list.filter를 가리키는 getter(둘이 같이 바뀜). patch13이 기록 화면 pool·칩과 편집 화면 okType·칩을 바꿈. 좋은 = good&&!dopaOnly (도파민 전용은 🍬에서만) — 개수가 달랐던 이유.
- **행동/습관 화면 배치**: '▦ 화면 배치' = 시트(layMap61) 작은 지도 끌기 + ↑↓⇄▾👁 + 프리셋 4개. 폰(<900px)은 한 줄 전역 순서(applyLog59 감쌈). 예전엔 폰에서 오른쪽 칸 것을 위로 못 올렸음.
- **고르기 창** openPicker61({title,tabs:[{k,label,items:[{id,label,sub,grp,score}],newLabel,onNew}],multi,onPick}) — 찾기·탭·묶음·⭐ 자주 쓰는 것. 📦 '있는 할 일 넣기'도 이걸로(kidPick61).
- **우클릭(폰 꾹) 메뉴** menu61: 목록(이름·색 LCOL61·폴더·설명·순서·지우기, 색은 l.color → 사이드바 왼쪽 띠), 할 일·캘린더 블록·쫄따구(열기·끝내기·오늘로·미루기/건너뛰기·안 하기·일퀘·루틴에·루틴으로·묶음에·지우기), 오늘의 일퀘(체크·열기·건너뛰기·일퀘 빼기·요일), 행동(기록·편집·설명·반복·일퀘·루틴·용기·도파민 코스·지우기), 연결 칩(열기·끊기). 터치에서 끌기용 꾹(data-dragmode=hold)과 겹치는 건 메뉴 안 띄움.
- **이어진 곳 칩 ×**(cx61, data-x61un): 반복 끄기·루틴에서 빼기·도파민 빼기·용기 끄기·할 일-카드 연결 끊기, 모두 되돌리기 알림. connRt60은 단계마다 칩. 할 일 상세 🃏 칸에 '⏱ 루틴 단계' 줄.
- **뒤로 가기**: NAV61 스택(창에서 다른 창 열면 push). 시트 맨 위 '← 뒤로', 시트를 닫고 다른 화면으로 가면 아래 '← … 돌아가기' 알약(9초). 창 밖에서 새로 열면 스택 비움.
- **📖 보스·쫄따구 도감**(openDex61, 전투 칸 버튼·보스 정보 창): 보스 설명·약점 글(LORE61, 점수 효과 없음)·처치 횟수·전리품·차례. 쫄따구 종류 MOB61(📋↻☠⏰⚔📦⏱, mobKind61) — 전투 칸 쫄따구에 작은 표시.
- 아이콘: ✨ XP · 🔋 컨디션 · ⚔️ 용기 · ⚡ 번개(할 일 크기 '짧게'→'번개', #번개·#퀵 태그) · 🌸 행복 · 🏹 사냥 · 👾 전투 · ➕ 빠른 추가. mig61: 뽑기 프리셋 이름.

## v6.2에서 한 것 (v5s.js · v62.css · patch14.py)
- **루틴 = 머리 할 일(t.rid) + 단계 = 묶인 할 일(t.parent=머리, t.rstep=1)**. 사용자 요청: 단계는 무조건 할 일. mig62(C.mig62): 루틴마다 머리 할 일(rtH62, 없으면 '⏱ 루틴' 목록 Lrt에 날짜 없이 만들고 접어 둠), 카드·이름 단계 → 자식 할 일(카드는 t.aid로), 원래 있던 할 일 단계는 join62(머리 밑으로, 날짜·반복 지움, 원래 값은 t.pre62).
  - r.steps는 **순서표**({id,tid,min}, 몸무게는 aid:'@weigh'도). sync62(r)가 render마다 맞춤: tid 없는 단계 → 자식 만들기, 머리 밑에서 빠졌거나 -1인 할 일 → 단계에서 빼기(TASKS에 잠깐 없을 땐 그대로), 머리 밑 새 자식 → 단계 끝에 추가(날짜 있으면 join62), 머리 이름 = 루틴 이름, 할 일 dur = 단계 분.
  - **단계 할 일은 늘 status 0**(완료 후 바로 되돌림) → 60일 지난 완료 할 일이 안 불러와져 사라지는 문제 피함. '오늘 함' = t.last===오늘(stDone62). 반복 루틴은 오늘 한 단계를 사냥에서 건너뜀. 목록에서 직접 체크해 status 2가 된 건 reopen62가 다시 엶.
  - 점수: 단계 = taskBase(카드면 카드 점수, 아니면 크기·중요도), 루틴 = 완주 보너스만. 사냥에서 단계 끝 = completeTask(direct) (routineStep62, v5r/v5e 루틴 처리 안 탐).
  - setRt60 감쌈: '안 정함'이면 머리를 지우지 않고 반복만 지움. finishRoutine 감쌈: 반복 없는 머리는 완료 처리 안 됨(날짜만 지움). unstep62: 루틴에서 만든 단계는 지우고 pre62 있는 건 원래 자리로. rdel62: 머리·단계까지 지우고 되돌리기. deleteTask 감쌈: 지운 할 일은 단계에서도 빠짐.
  - 편집 UI: rtCard62(=rtCard61), stRow62(data-r62op·data-r62min), 새 단계 입력(div.st62add — **할 일 상세는 form 안이라 form 중첩 금지**, Enter는 keydown에서, 한글 조합 중 Enter는 40ms 뒤). 카드와 잇기/끊기(cardPick62). 이어진 곳 칩의 단계 ×는 data-x62un으로 바꿔 unstep62로.
  - 할 일 상세: 루틴 머리면 맨 위 rt62p(단계·분·점수·합계·완주 보너스·▶ 시작·＋ 단계), .kids56 숨김. 단계 할 일이면 '⏱ 루틴 n단계' 줄. 목록: 머리 줄 '⏱ n단계 · m분', 자식은 단계 순서(kidSort62, patch14가 nestRows 정렬 바꿈), 단계 줄 '✓ 오늘'.
  - 카드와 이은 할 일(단계 포함)을 끝내면 그 카드의 ↻ 습관 할 일도 같이 넘김(applyEntry 감쌈, e.htid62·hprev62 → unapplyEntry가 되돌림). 원래 habAuto는 e.tid가 있으면 건너뛰었음.
- **사냥 화면**: 높이 100dvh, arena만 스크롤 → 버튼 줄 늘 보임(원인: arena 내용이 길면 1fr 줄이 넘쳐 버튼이 화면 밖). 💭 다르게 보기는 접힘(.rf62, 눌러서 펼침). 단계 칩마다 ✨점수, '이 단계 · 완주하면' 줄. **그만 = 확인 창(.q62)**: 계속 · 여기까지 하고 끝내기(루틴) · 이미 끝냈어요(단일) · 기록 없이 그만두기.
- **캘린더 폰(<760px, 분할 아님)**: body.cal62 → HUD·베타 띠 숨김, 도구줄 한 줄(‹ 오늘 › '11월' · '월 ▾'(#cal62v 보기 메뉴) · 거르기 · 서랍 · ⋯(#cal62m: 색·기록 겹쳐 보기·서랍·거르기·도움말·홈)). 월 칸이 화면 높이를 채우고(cal62fit) 칩을 칸에 들어가는 만큼(calN62=14 렌더 후 넘치는 건 숨기고 +n). 옆으로 밀면 달 넘김. '표시: 목록'에 목록 색(l.color) 씀.
- 장비 점수 효과 **없음으로 확정**(사용자). 상점에 '꾸미기 전용' 문구. **✏ 직접 그리기**(GSZ62 부위별 칸 크기, GPAL62 12색 + 이름, 파랑 없음): C.gear60.custom=[{id:'cg…',slot,name,rows}] → gSync62가 GEAR60에 넣음. 새로 저장 💰30(buy 엔트리), 고치기 무료.
- **이번 주 용기 한 가지(선택)**: C.wone62[주시작]=tid. 홈 이번 주 용기 목표 칸·돌아보기 ⚔️ 용기 칸. 새로 적기/용기 할 일/용기 카드에서 고름 → 일요일까지 날짜. 비어 있어도 실패 표시 없음.
- 보스 대사(BLINE62, 날마다 바뀜, 처치하면 BDEAD62) — 홈 이번 주 보스 밑.
- 테스트: `dev/v5/t62.py`(루틴·사냥·그만·캘린더·빼기/넣기·장비·용기) · t62b(점수) · t62c(폰 월 보기) · t62d(화면 점검 스샷).

## v6.3에서 한 것 (v5t.js · v63.css · patch15.py)
- **루틴 머리는 할 일 목록에서 늘 접힘**: tShut63(t) — 루틴 머리면 C.ui.tfold[id]==='o'일 때만 펼침, 그 외 묶음은 예전대로(truthy=접힘). patch15가 nestRows·taskRow의 `(C.ui.tfold||{})[t.id]` 2곳을 바꿈. 루틴 머리 줄 아이콘 📦 → ⏱.
- **캘린더 월 보기 화면 가득 = PC도**: body.calfill63(캘린더 화면·분할 아님·월). cal62tog·cal62fit·calN62는 v5t 함수 선언이 이김. 폰 전용(cal62) 도구줄은 그대로.
- **날짜 누르면 그 주 밑에 그날 목록**(dp63): 원래 #calDay의 .dayp를 그 주 마지막 칸 뒤로 옮겨 grid-column 1/-1 줄로(입력칸 calAdd 그대로). ui.cal63=펼침 여부, ui.calSel=날짜. 같은 날 다시/× /Esc = 접기, 320ms 안 두 번 = 하루 보기, +n = 펼치기. 펼친 주 1fr·나머지 .7fr·목록 폰 5fr/PC 3fr. 클릭은 window capture(v5o의 MC58 document capture보다 먼저) → 날짜 한 번 = 할 일 추가 창은 없어짐. 할 일 추가 = 폰 오른쪽 아래 ＋(#cal63fab) · PC 도구줄 '＋ 할 일'(#cal63add) → calAddDay. PC에서 '월 ▾'(cal62only)가 보이던 버그 고침.
- **홈 오늘의 일퀘 칸 = 상자 진행만**(목록·추가칸 CSS로 숨김) + '남은 것 n개' · 누르면 qSheet63(목록=#quests 내용 복사, render마다 다시 그림). **이번 주 칸 = 용기 목표만**(#weekBox>.boss 숨김), 보스 대사는 전투 칸 boss2 밑(bossSay63).
- 지금 하면 좋은 것: 일퀘 줄 '+0 XP' → 카드 점수(suggestions 감쌈).
- **몸무게 단계**: wStep63(t). 목록·캘린더에서 체크 = 몸무게 입력 창(wAsk63, 사냥과 같은 C.weight.xp, 할 일 점수 안 들어감). 오늘 몸무게가 있으면 render 때 단계 t.last=오늘(wSync63). 줄에 '⚖ 누르면 입력'.
- 루틴 단계 '🃏 카드와 잇기'는 '(선택)'으로 작게, 설명 문구 바꿈(카드 연결은 루틴 밖에서도 하는 행동일 때만).
- 테스트: `dev/v5/t63.py`.

## v6.4에서 한 것 (v5u.js · v64.css · patch16.py)
- **루틴 단계 자가증식 고침 (중요)**: 원인 = 할 일 onSnapshot 첫 응답이 기기 캐시(옛 사본). 다른 기기에서 만든 단계 할 일이 캐시에 없으면 sync62가 새로 만들고, 서버 것이 오면 옛 것도 kidsOf로 단계에 다시 붙음 → 새로고침·기기 바꿀 때마다 두 배. 머리 할 일·습관 반복 할 일도 같은 이유로 겹침.
  - patch16: 할 일 두 쿼리에 `{meta:1}`, 서버 확인되면 `TSRV64`(open)·`TSRV64r`(recent). `tOK64()`/`tAll64()`.
  - 할 일을 **만드는** 자동 처리는 tOK64 뒤에만: rtH62(make)·sync62·mig62·mig57·habMigCard·habMirror를 감쌈. **새 자동 생성 코드를 쓰면 꼭 tOK64로 막을 것.**
  - sync62 새로: tid 있는 단계는 절대 새로 만들지 않음(옛 형식 tid 없는 단계만). 할 일이 안 보이면 기다리고, tAll64 뒤에도 없으면 뺌. 같은 tid 두 번이면 하나만.
  - 테스트 `dev/v5/t64dup.py`: mockdb에 `window.__staleT={hide:[ids],ms}`(첫 tasks 스냅샷을 fromCache로, 일부 숨김). h61.run(pre=…) 추가.
  - **fix64 (C.mig64, 한 번)**: 루틴마다 머리 여러 개 → 하나(자식 옮김), 단계 = 제목+aid 같은 것 하나만(많이 한 것·먼저 만든 것 남김, 원래 순서), 같은 카드의 습관 반복 할 일 여러 개 → 하나(☑ 우선). 백업 `C.bak64={at,routines,tasks,del}` → 알림 '되돌리기', 편집 → 루틴 맨 위 안내(14일)·'정리 전으로'(undo64)·'이대로 둘게요'. 테스트 t64fix.py.
- **루틴 체크로 기록(타이머 없이)**: 루틴 머리 ○(목록·캘린더·홈, data-tdone capture)·일퀘(toggleQuest 감쌈)·루틴 칸 '✓ 체크로 기록'·우클릭 메뉴 → rtDone64 창(단계 체크, 몸무게 단계는 kg 칸). rtDoneGo64: 단계 completeTask(direct)→status 0으로 되돌림·t.last, 전부 오늘 했으면 완주 엔트리 {kind:'routine',rid,full:1}(하루 한 번)·머리 due 넘김.
- **⏱ 루틴 스마트 목록**(SMART 'routine', taskMatches 감쌈). 그 목록 위 입력칸 = 새 루틴(addTaskFrom 감쌈, #tAdd 포커스일 때), placeholder도 바뀜.
- 할 일 상세 루틴 패널 = rtCard62 전체(언제·보너스·단계 분·순서·빼기·카드), .rt64p로 좁은 칸 배치(이름 칸 숨김, id 뺌).
- **캘린더**: body.calview63이면 PC도 #hud·.betabar 숨김. 날짜 펼침 = dp63 새로(카드 .dp64: 머리·간단한 줄 .d64(체크 data-tdone, 열기 data-ctask, 시간 오른쪽, 목록 색 왼쪽 띠)·끝낸 것·아래 입력칸 #calAdd). #calDay는 비움(id 겹침 방지). cal62fit 새로: 카드 높이 = 내용(화면 55%까지), 고른 주 1.25fr·나머지 .6fr.
- **보스·쫄따구 모양**: bossSVG(color,dead,name) — BOSS64(monster·ghost·golem·bat·swamp·spiky·slime), bossKind64(이름으로). minionSVG(color,dead,kind) — MOB64(task 꼬마도깨비·rep 달팽이·skull 해골·late 유령·brave 고슴도치·pack 미믹 상자·rt 애벌레), mobOf64(t)=mobKind61. patch16이 호출부에 이름·종류를 넘김.
- 메뉴 아이콘(ICONS): 뽑기 = 캡슐 뽑기 기계, 행동/습관 = 체크한 카드, 돌아보기 = 막대 그래프.
- 홈 '지금 하면 좋은 것'에서 오늘 목록에 이미 있는 일퀘 뺌. 일퀘 창(qSheet63)에서 '✎ 요일 표' = 그 자리에서 dailiesEditHTML(ui.q64ed), reEdit 감싸 창 다시 그림.
- 테스트: t64.py(체크 기록·목록·상세·일퀘 표·도감·캘린더 PC/폰). t61.py는 v6.1 선택자라 지금은 안 맞음(옛 것).

## v6.5에서 한 것 (v5v.js · v65.css · patch17.py · beta/sw.js)
- **루틴 단계가 늘었다 줄었다 한 진짜 원인**: 머리 할 일(t.rid)이 둘 이상이면 rtH62가 `for k in TASKS` 순서로 '첫 번째'를 골라서 기기마다 머리가 달랐음 → A 기기는 A 머리의 단계로, B 기기는 B 머리의 단계로 r.steps를 저장해 서로 덮어씀(줄었다 늘었다 · 창 깜빡임). 옛 버전이 돌던 기기(sw.js가 index.html을 stale-while-revalidate로 줘서 업데이트 뒤 첫 실행은 옛 버전)는 단계를 또 만들었고, fix64는 한 번뿐이었음.
  - rtH62 = headsOf65(r)[0] (headRank65: 반복 있는 것 → created → order → id, **모든 기기 같은 답**).
  - **heal65()** (render 앞, SRV59.c·ready·tAll64 뒤): 머리 여럿 → 하나(자식 옮김, 반복·일퀘 넘김), 단계 = dupKey64(제목+aid) 같은 것 하나(rank65: cnt → last → order → id, 결정적), 같은 카드 습관 반복 할 일 하나(☑ 먼저). 백업 `C.bak65={at,tasks,routines}`(그날 것, 400개까지) · 알림 '되돌리기' → undo65는 `C.noHeal65=날짜`(자동 정리 끔) · 편집 → 루틴 맨 위 안내(되돌리기/이대로/다시 켜기).
  - 사람이 일부러 같은 단계를 넣으면(rtAdd61 안, USR65) mkChild62가 `t.dupok65=1` → 정리 안 함.
  - **sw.js: 화면(navigate)은 네트워크 먼저(3.5초 넘으면 기기 사본)**, index.html·backend.js도 네트워크 먼저 → 업데이트 뒤 옛 버전이 한 번 더 도는 일 없음. 앱이 다시 보이면(visibilitychange, 3분 간격) SW update 확인.
  - 테스트 `dev/v5/t65.py`(머리 둘+단계 3배+습관 겹침 → 정리 → 3번 다시 열어도 그대로, 머리 고르기가 TASKS 순서와 무관, 되돌리기·다시 켜기·dupok).
- 캘린더: 캘린더 화면에 들어올 때마다 월 보기(calMonth65, save('config')까지 — **저장 안 하면 config 스냅샷이 와서 옛 mode로 되돌아감**). 날짜 카드: 줄·테두리 없앰(목록 색은 inset 3px), 다시 그릴 때 등장 움직임 반복 안 함(.still65 — 깜빡임 원인), renderCal 감싸 #calAdd 글자·커서 지킴(제출 직후 800ms는 안 되살림).
- 홈 전투: 쫄따구 종류 이모지(.mb61) 숨김 · 쫄따구 38×34. 쫄따구 누르면 mobSheet65(모양 크게·종류 설명·처치/사냥/10분만/열기/피하고 있어요/도감), 보스 누르면 bossSheet65(HP·약점·치명타·도감). window capture라 data-ctask·data-info보다 먼저.
- 루틴 머리 줄 점수(.tx65) = `Σ+단계합 💰 · 완주+보너스`.
- 메모(옵시디언 '낙서장')에서 고른 것:
  - **🌱 10분만 해보기**(taste65): RUN.taste65=1·target 10. 10분 지나면 사냥 화면 #taste65 → 계속(taste65=2) / 여기까지 = 엔트리 `{kind:'start65',xp:5,t65:id}`, t.taste65 횟수.
  - **☠ 삼진아웃**(strike65): postpone 감쌈 — skull이 3을 넘는 순간 창. ✂ 쪼개기(split65: 오늘 날짜 10분 묶인 할 일, skull 0으로) · 10분만 · 다시 정하기 · 🕊 내려놓기(status -1, 되돌리기).
  - **😶 피하고 있어요**(avoid65, ui.av65): 1 알아차리기(이유 칩 AVR65 → 나를 편드는 한 줄, 🌬 3초 들이쉬고 7초 내쉬기 ×3) → 2 꼭 해야 하나(해야 함 = 한 줄 → t.reframe(비었으면)/t.why65, 미뤄도 됨 = ☠ 없이 날짜 옮김) → 3 10분만 / 첫 조각 / 그냥 시작 + ⚔️ 용기 표시(t.brave). t.av65 횟수. 들어가는 곳: 할 일 우클릭(menu61 감쌈, MT65), 할 일 상세 아래 .av65row, 쫄따구 창.
  - **📝 한 줄 일기**(J65 슬롯 m·a·e·n = 5~11·11~15·15~19·19~5시): `DAYS[날짜].j65[슬롯]={m,txt,t}`. **normDay 감싸서 j65 지킴**(normDay는 모르는 키를 버림). 홈 #sugg 아래 줄, 돌아보기 맨 아래 최근 7일.
  - **⏳ 대기 모드 깨기**(wait65): 오늘 1시간 넘게 남은 시간 할 일이 있고 다른 할 일이 있으면 #sugg 맨 위 띠 → 사냥 고르기. × = 오늘 안 보기(ui.w65x).
  - 걸러낸 것: 아침 폰 안 보기(루틴으로 이미 가능, 카드 목록은 손대지 않음), 포스트잇 우선순위·보상 시스템(유리병·상점으로 있음), 줌인/줌아웃·DMN(도파민 메뉴 쉼표 코스와 겹침).

## v6.6에서 한 것 (v5w.js · v66.css · patch18.py)
- **점수 고침**: 가챠 배수 ×1.5가 '×6' 기록 전체에 붙던 것 → 한 번 몫만(finishCtx 감쌈, e.gq66). 시나리오 25분 ×6: 228 → 163.
- **⚖ 점수 점검**(돌아보기 이번 주 아래, scoreCheck66): 보스 HP(지난 4주 처치 요일·평균 데미지) · 카드 없는 할 일이 컨디션을 많이 올리는지 → `C.taskCond66={quick,mid,heavy}` · 카드 없는 루틴 단계 → `C.step66='min'`(5분에 ✨1, 골드 0, 컨디션 1) · 일퀘 상자 비율 · 골드/상점 일수 · 뽑기 배수 안내. 버튼으로 바꾸고 '예전대로'(taskBase 감쌈). 기본값은 예전 그대로.
- **🧭 영역**: 이번 주 영역별 XP·횟수·지난주 비교, 누적 XP로 영역 Lv(levelOf), 경제는 ₩ 아낌/씀(e.amt), 가장 덜 돌본 영역, 하루 HP 막대(끝 값 + 아침 시작점 선).
- HP 설명 바로잡음(게임 방법: '영역 평균' → '아침 시작점 + 변화의 합'). HP 계산 자체는 안 바꿈(매일 새로 시작, 복귀 보너스).
- **🔮 유리병**: 돌아보기 탭(RV59_FAM·rvTabs59 덮어씀). 구슬 XP = 병 XP × 크기(작은 ½·보통 1·큰 2, mxp66). 병이 가득 차서 새 병을 열면 보너스 `C.jarFull66`(기본 ✨20 💰50, 그 구슬 기록에 붙음 e.jf66 → 되돌리면 같이 빠짐). 병마다 `j.look66`(classic·mason·round·tall)·`j.cap66`(20/40/60/100)·`j.lid66`·`j.tint66`, 구슬 색(파랑 계열 빼고) — 🎨 꾸미기 창. jarSVG·jarLayout 새로(모양별 반폭 함수로 쌓기, 크기 맞춰 구슬 크기 조절). **📥 아날로그 병 옮기기**: 종류별 개수 → `{kind:'jar',an66:1,mn:n,xp:0,gold:0}` 엔트리(오늘 날짜), '모두 빼기'.
- 행동/습관 화면 **🔮 구슬 넣기 칸**(LAY59_NAME.jar, lay59·logPanels59 덮어씀, #jar66P, 식사 칸 다음에 들어감).
- **📝 한 줄 일기 화면**: 돌아보기 주(ui.rv59)에 맞춰 7일×4칸 기분 흐름 + 하루 카드(타임라인, 오늘은 '＋ 적기'). v5v의 옛 카드는 지움.
- **캘린더 서랍**(renderTray 덮어씀): 탭 날짜 없음/모든 할 일/행동 카드/루틴, 정렬·묶기·⚲ 거르기(목록·크기·영역, 카드는 도파민 전용 포함 스위치). `C.tray66={s,g,f,open,dopa}`.
- **홈 뽑기·사냥 칸 ✎**: `C.hg66`=보일 버튼 순서(g3·g5·p:필터·r:루틴·hunt·dopa·q5). 없으면 예전 기본. 긴 이름 말줄임.
- **💡 팁 모음**(tips66, 홈 '오늘의 팁'의 '💡 팁 더 보기'): 행동 조언·보상·즐기는 법·일정·앱 꿀팁·숨은 것. 이스터에그: 전투 칸 캐릭터(.hero2) 7번 → 빙글 + 한마디, 11:11에 기록하면 🌠 알림(점수 없음).
- **📜 전투 기록 🧹 골라 지우기**: 체크 → 확인 창 → removeEntry(점수·구슬·할 일 되돌림). 베타 테스트 기록 정리용.
- 테스트: `dev/v5/t66.py`. (t65의 'review False'는 옛 일기 카드를 찾는 검사라 이제 맞지 않음)

## v6.7에서 한 것 (v5x.js · v67.css · patch19.py)
- **mig67** (render 앞, ready·SRV59.c 뒤): `C.mig67ds` 하루 시작 → **5시**(사용자 요청: HP 리셋 5시. dateKey 하나라 할 일·캘린더 '오늘'도 5시에 바뀜 — 캘린더 시각 표시는 그대로 24시. 따로 자정으로 나누려면 dateKey 176곳 손봐야 함 → 사용자에게 물어봄) · `C.mig67k` **용기 버튼(C.courage) → ⚔️ 용기 카드**(id 'kc'+원래 id, a.brave = pts 1/2/3 → s/m/l, a.k67=원래 id, k.m67=카드 id. doneAt 항목은 그대로). C.courage는 지우지 않음(옛 기록·kbrave 정보 창용). 기록하기 ⚔️ 칸(braveActs67) = ⚔️ 카드, 용기 추가 입력 = ⚔️ 카드 만들기, 편집 → ⚔️ 용기 탭은 표 대신 안내(braveCardsNote 덮어씀 + renderEdit 감싸 표 지움), 검색에서 합쳐진 용기 버튼 뺌 · `C.jarMn67='score'`.
- 메뉴 '행동/습관' → **기록하기**(nav67, renderNav 감쌈). 위 숫자 'HP n · 기록 n개 ⓘ' → daySheet67(종류별 개수, 식사 칸은 따로).
- **영역 레벨** 따로 곡선 aNeed67 = 60+30(lv−1), 칭호 K67().TITLES(3·5·10·15·20), 마일스톤 AMS(3,5,10,15,20,25,30,40,50) 골드 = lv×10 → 엔트리 `{kind:'amile67',gold,xp:0,area:''}`. `C.amile67[area]`=마지막 확인 레벨. **처음 실행 땐 지금 레벨을 기준점으로(보상 없이)**. 기록 다 올라온 뒤(T67 6초)·20초 간격. 영역 XP는 DAYS(최근 400일 limit) 합 — 400일 넘으면 누적 저장 필요.
- 영역 여정 창 aJourney67(data-aj67): 남은 XP·지금 속도 며칠. infoFor 감쌈: hp(📈 요즘 지표) · area:(영역 레벨) · lv(최근 평균 XP/일·다음 레벨 며칠).
- **📈 요즘 지표** trend67(end, area): 최근 14일 하루 끝 HP를 0.75^i 가중 평균(2일 이상). HP 계산 자체는 안 바꿈.
- **areasHTML66 덮어씀**: 영역 이름 = 여정 링크 + 칭호, 하루하루 흐름 탭(ui.hp67: 종합/영역별 areaValues/₩ 경제 = 아낌·씀 막대).
- **🍽 몸 종합 기록**(#body67, 몸 기록 첫 칸 뒤): 7/30/90일(ui.bd67), 식사 칸별 합·기록한 날·연속, 몸무게 변화, 평균 HP, 날짜별 줄.
- **유리병**: ↕ 순서 창 roSheet67(병·구슬 종류 끌기/↑↓, 많이 넣은 순) — renderJars 감싸 .jbar66에 버튼. 이어진 구슬 개수: applyEntry 감싸 act/task/courage/routine/free/happy에 e.mn = clamp(round(xp/✨10),1,5) (`C.jarUnit67`·`C.jarMax67`, e.mn67). XP는 안 더함(원래 구슬은 엔트리에 얹힘).
- **💬 한 줄**: 슬롯 대신 `DAYS[날짜].j67=[{id,t,m,txt}]`(normDay 감쌈). 홈 #sugg의 jRow65 → ''. 기록하기 '오늘 한 일' 위 입력(#j67L), 돌아보기 jWeek66 덮어씀(빈칸 없음, 옛 j65도 같이 보여줌, × 지우기).
- **모든 화면 배치 lay67**: review(#review59)·jars·stats·journey·body·shop·gacha·more. 칸 = 그 뿌리의 .panel/.card(grid2>stack 안 포함). `C.lay67[view]=[[key,'L'|'R'|'W',fold,hide,brk]]`, key = id 또는 h2 글자(숫자 뺌). DOM을 `.l67>.l67row>.l67c|.l67w`로 옮기고 빈 grid2는 hidden. brk = 원래 grid가 바뀌는 곳에서 줄 나눔. 숨김은 내가 숨긴 것만(data-hid67). 창 map67(끌기·↑↓·⇢⇔⇠·접기·숨기기·프리셋 처음대로/모두 펴기/한 줄로/모두 접기). render·renderReview59 뒤·hashchange에 apply67. 할 일·캘린더·편집·게임 방법은 칸이 아니라 제외(홈·기록하기는 원래 것).
- **🗺 기능 지도**(fmap67, F67 목록) + searchIndex 감싸 '🆕 기능' 항목. **새 기능을 만들면 F67에 꼭 추가.** 게임 방법 card67·area67.
- **🤖 AI에게 물어보기**(ai67, 돌아보기 맨 위 .ai67bar): 기간·종류 고르기 → 글 정리 → 복사 / claude.ai/new?q= (6000자 넘으면 복사 후 빈 대화). 외부로 자동 전송 없음.
- 테스트: `dev/v5/t67.py`.

## v6.8에서 한 것 (v5y.js · v68.css · patch20.py · backend.js) — 본 앱 승격
- **할 일·캘린더 '오늘' = 자정** (점수·HP·일퀘·DAYS = 그대로 C.dayStart 5시). `dateKey()`를 v5y에서 새로 선언(마지막 선언이 이김): `MODE68==='mid'`면 오프셋 0. 할 일 쪽 함수(taskMatches·dateBucket·taskRow·cchip·postpone·newTask·dueLabel·parseQuick·renderCal·renderTray·renderTasks·dndEnd·drawTaskSheet 등, 목록은 v5y 맨 위 T 배열)를 wT68로 감쌈: 할 일을 받으면 그 할 일 기준(gameT68 = hab·quest·rid·rstep·qid면 'game' 5시), 안 받으면 바깥에서 정한 게 없을 때 'mid'. **새 할 일·캘린더 함수를 만들면 T 배열에 넣을 것.** `C.taskMid68===false`면 예전처럼(UI 없음). 새벽(0시~5시) 기록은 logRow에 🌙(e.t로 판단, 저장 안 함), 할 일 화면 위 안내 띠(#dawn68, ×=그날 안 보기), 새벽에 처음 끝낸 할 일 뒤 알림. 30초마다 자정 지났으면 render.
- **목록 색**: mig68col(한 번) 이름 규칙으로 색(lcolPlan68: Fixed 빨강·Atelier 주황·Project 보라·Personal 갈색·Limen 노랑·습관 초록·루틴 분홍·기본함 회색, 나머지 남은 색), 예전 색 `C.lcolBak68` → 알림 '예전 색으로'. 나중에 생긴 목록은 lcolNew68가 한 번 색(`C.lcolSeen68`). LCOL61에 연두·살구·자주·올리브 추가(파랑 없음). 캘린더 '색 기준'은 할 일 옆 캘린더(_t)와 캘린더 창이 **같은 값**(calColSync68, 바꾸면 둘 다). v5n의 색 칠하기 선택자를 `#calPane [data-ctask]`로(할 일 옆 캘린더에서 안 먹던 원인). 할 일 줄 `.trow.lc68`(왼쪽 3px, 한 목록만 보는 화면에선 안 칠함).
- 기록 n개 풀이(daySheet67): 종류·개수를 칩으로(띄어쓰기 없이 붙던 것, .brk에 CSS가 없었음).
- **영역 마일스톤 = 전용 장비**: Lv.3 방패·5 머리띠·10 망토·15 지팡이·20 배경(그 영역 색, amItems68 → GEAR60에 am68 항목, drop='🧭 영역 Lv.n'이라 상점에서 안 팔림), 25·30·40·50은 골드. aMile67을 v5y에서 새로 선언. 이미 지난 레벨 장비는 처음 한 번(C.am68r) 주고 알림. 배경은 bgSVG60 감싸 'am:#색'.
- **보스 약점 효과** WEAK68(weekState 감쌈 → s.weak·s.weakN, 데미지에 더함): 미루기 괴물=할 일 +50% · 망설임의 안개=타이머로 시작(e.st)·10분만 +50% · 완벽주의 골렘=끝낸 행동·할 일마다 +3 · 무기력 늪지기=몸 영역 +50% · 불안 안개=마음 영역 +50% · 회피 박쥐=☠ 미뤘던 할 일 +100%. LORE61 글에 '실제 효과' 붙임. 보스 창에 🎯 약점 공격 + ⚙ 보스 규칙(bossHp·bossXp·bossGold 바로 바꾸기, 지난 4주 평균 데미지 안내).
- **처치 연출** killFx68: popup('보스 처치')를 감싸 흔들림→쓰러짐→불꽃(줄인 움직임 설정이면 간단히) 뒤 원래 창 + 전리품 이름.
- **우클릭 더**(window bubble contextmenu, v5r capture 다음): 홈 칸(접기·↑↓·숨기기·홈 배치) · 캘린더 월 날짜(.mc[data-calday]) · 빈 시간(.tgcol, 마우스만) · 보스.
- **편집 덜 가기**: 🍬 지금 어때? 항목 ⋯(actMenu61) · '전체 메뉴' 코스마다 바로 추가(id 'dn'+uid, dopaOnly) · 할 일 상세 `#aidPk68` 카드 고르기 창 · 보스 규칙.
- **본 앱 승격**: backend.js promote68() — 본 앱(경로에 /beta/ 없음)에서 로그인 직후, 본 앱 config가 옛 것(mig67ds·mig62·mig57 없음, keepOld68 없음)이고 베타 config가 있으면 고르기 화면: '베타 기록으로 옮기기(권장)' = 본 앱 기록을 `habit-bak68`(이미 있으면 habit-bak68-시각, 첫 백업은 안 덮음)에 통째로 + meta → habit-beta를 habit으로(지우고 씀) → config.moved68 / '옛 기록 그대로' = config.keepOld68(그다음 v6 마이그레이션이 돎). 최근 45일 중 본 앱에만 있는 기록(entry id)이 있는 날을 보여 줌. 계정·백업 화면 #bak68 '옛 기록으로 되돌리기'(restoreBak68: 지금 것은 habit-bak68b로). Node 가짜 Firestore로 시험(/tmp, 저장 안 함).
- **v6.8.1 (2026-11-07) 옮기기 화면이 열 때마다 다시 뜨던 문제**: promote68이 `getDoc(...).catch(()=>null)`이라 서버를 못 읽으면(앱 켤 때 흔함) '본 앱 config 없음'으로 여겨 다시 물었고, 그때 옮기기를 누르면 백업 없이 본 앱을 베타 사본으로 덮었음(그 사이 본 앱에 적은 기록 사라질 수 있음). 고침: 끝남 표시 = **따로 문서 `habit/game/promo68`**({done,hist[]}: beta/old/restore/already, 앱은 이 문서를 안 씀) 먼저 확인 · 확인은 getDocFromServer, **읽기 실패면 아무것도 안 함** · readNS 실패는 throw(빈 것으로 안 봄) · isNew에 moved68·keepOld68·v>=8 · writeNS 150개씩, config는 맨 끝, 지울 때 새로 쓸 문서는 안 지움. 계정·백업 #bak68에 옮기기 이력. 시험: Node 가짜 Firestore(서버 실패 전/후, 다시 열기, 표시 없는 옛 v6.8.0 상태).
- 테스트: `dev/v5/t68.py`(새벽 1:30 clock · 목록 색 · 숫자 풀이 · 장비 · 보스 · 처치 · 우클릭 · 도파민 · 카드 고르기). t66은 날짜에 따라 업적 창이 클릭을 막아서 원래부터 실패(v6.7 빌드도 같음).

## v6.9에서 한 것 (v5z.js · v69.css · patch21.py · beta/backend.js · mockdb.js) — 저장 바로잡기
- **진짜 원인(중요)**: 설정 C에 '배열 속 배열'(C.ui.home=[[id,켜짐,칸]], C.logLay59)이 있어 **Firestore가 setDoc을 바로 거절**(Nested arrays are not supported) → v4.1(11/2)부터 **설정이 서버에 한 번도 안 올라감**. flush가 실패해도 dirty만 남아서 그 세션은 멀쩡해 보였고, 열 때마다 서버의 옛(v4) 설정 + 모든 마이그레이션을 다시 돌렸음. v5.9 '되살아난 카드', v6.4·6.5 '루틴 단계 불어남', v6.8.1 '옮기기 화면 매번', '돌아보기로 묶었어요' 매번 알림 전부 이것. 할 일·날짜·진행 문서는 배열 속 배열이 없어 저장됐음. Node + firebase 10.12.2로 확인(setDoc이 동기 throw). **옛 mockdb는 아무거나 받아줘서 못 잡았음 → mockdb가 이제 진짜처럼 거절함.**
- backend.js: `enc`/`dec`(배열 속 배열 → `{_na:[…]}`, 빈 칸 이름 → `_e0_`, `__x__` → `_x__x__`, 멱등). 모든 쓰기(set·update·importAll·putTasks·writeNS) enc, 모든 읽기(wrap.data·exportAll) dec. `doc.merge(fn)` = runTransaction(서버 것 읽고 fn(cur) → 쓰기, undefined면 안 씀, 12초 제한). **본 앱 승격 때 루트 backend.js도 같이 바꿔야 함**(같은 파일 복사).
- v5z 저장: `flush` 새로 — `merge3(기준 BASE69[n], 내 것, 서버 것)` 3방향 합치기(객체: 키별 · id 배열: id별 합치기/순서 · 값 배열: 개수 합치기(구슬) · 진행(progress) 맨 위 숫자는 더하기 s+(l−b)). 기준 없으면 null 기준(그 사이 다른 기기가 처음 만든 문서 = 합침). 다른 기기에서 지운 할 일은 되살리지 않음(skip). 합친 결과가 내 것과 다르면 adopt69로 화면에도 넣음. 같은 qid 일퀘(xp 0) 중복은 합칠 때 하나로. 실패: 일시 오류는 2·4·8…초 재시도, 두 번 넘게 실패하면 그냥 set(기기 사본 큐, 앱 닫아도 남음). 그 밖의 오류는 **빨간 띠 #err69**(무엇이 왜). 설정이 700KB 넘으면 bak64·scoreBak·lcolBak68·bak65부터 뺌(slim69).
- v5z `boot` 새로: 스냅샷이 BASE69와 같으면(내가 쓴 게 돌아온 것·메타데이터만 바뀐 것) 안 그림, 여러 스냅샷은 requestAnimationFrame 한 번에(rr). **처음 고친 버전으로 열 때**: 서버 설정에 `v69`가 없으면 이 기기의 hq-snap(지난 세션 마지막 C)으로 시작해 저장(SNAP69) → 먼저 연 기기의 마지막 설정이 이김. 그 뒤로 `C.v69=1`.
- mig59 알림 없이 한 번만. 겹친 것 정리 '이대로 둘게요' → `C.heal69ok=날짜`(그날 다시 안 띄움).
- **새로고침**: 새 SW가 깔리면(controllerchange) 바로 reload하던 것 → 화면이 가려졌을 때만, 보이는 중엔 '🆕 새 버전' 버튼(#upd69). (사용자가 말한 '주기적 새로고침'의 원인 중 하나 — 배포할 때마다)
- **한글 조합**: 메인 스크립트 맨 앞에 input 막기(조합 중 input은 다른 리스너에 안 보냄, compositionend 뒤 한 번 보냄). 고르기 창(pk61q)은 조합 중에도 목록만 다시 그림(drawPk61 감쌈 — 입력칸 노드를 안 바꿈). '독서' 입력이 ㄷㅗㄱㅅㅓ 되던 것.
- **📅 기록 날짜**: 완료 창·기록 고치기 창 맨 위 '언제?'(오늘·어제·그저께·📅 date input, S.d69) → sheetOK를 그날 ui.off로(withDay69). 고치기에서 날짜 바꾸면 moveEntry69. 스낵바 '📅 날짜' → mvSheet69 → moveEntry69(점수 합계 그대로, otb69만 빠짐, 몸무게면 day.weight도, 할 일이면 t.doneAt·last). 기록하기 화면 '📅 다른 날'(#off69, ui.off 아무 날) + 띠. 루틴 체크 창(rtDone64·rtDoneGo64 새로) 날짜 칩(RD69) — 단계 '그날 함' = 그날 tid 기록(stOn69). wSave63(v,날짜).
- **✍ 그날 기록 보너스** `C.otb69={on,xp:2,max:20}`(기본값, UI 없음): applyEntry 감싸 OTBK69 종류이고 그날(dateKey) 새 기록이면 e.otb69·xp+. 나쁜 행동도(솔직하게 적기). 지난 날/옮긴 기록엔 없음. replaceEntry에서 유지.
- **빠르게**: daysSince·neglectList 기억(그리기마다·기록마다 비움), toUTC·addDays 기억(patch21이 const 정의를 바꿈), homeTwo는 홈일 때만 폭 잼, applyTheme은 바뀔 때만 getComputedStyle, renderStats는 통계·여정 화면일 때만(나중에 hashchange에서). 120일·할 일 200개로 그리기 87ms → 25~40ms.
- 테스트: `dev/v5/t69.py` — Python이 '서버'(CAS)인 두 기기 시험(설정 저장·다시 열기·카드 지우기/더하기 동시·같은 날 기록 동시·XP 더하기·지운 할 일 안 되살아남·렌더 횟수) + 날짜·보너스·옮기기·루틴 어제·몸무게·한글 조합·처음 고친 버전 복구. 기준 비교는 `git worktree`로 옛 빌드를 8766에서 돌려 t64~t68 출력 diff(차이 = 보너스 점수만).

## v7.0에서 한 것 (w70.js · v70.css · patch22.py) — 본 앱 승격(v6.9 저장 고침 포함)
- **📅 언제? 하나로**: whenHTML 새로 선언(마지막 선언이 이김). 칩 = (⏱ 시작) 방금·1시간 전·아침에·어제·그저께·📅 직접(date+time 칸). S.d69(날짜)·S.at(시각)·S.w70(고른 칩). drawDoneSheet 감싸 v6.9 `.d69` 날짜 줄은 새 기록 창에서 지움(기록 고치기 창은 '📅 날짜' 줄 + 시각 칸 그대로). data-w70 / data-w70d / data-w70t. t69.py 선택자도 바꿈(FAILS 0).
- **알림 겹침**: toast·toastAct 감싸 lift70(스낵바 보이면 그 위로). 나쁜 행동 뒤 '다음에 당길 땐 대신할 것' toastAct(v5n)은 스낵바 안 `🍬 대신할 것`(data-snack70) 버튼으로 바꿔 넣음. 폰(≤640px)에서 스낵바 = 글 한 줄 + 버튼 줄(꽉 찬 폭).
- **목록 색**: LCOL61 내용을 LCOL70으로 바꿈(빨강·주황·노랑·연두·초록·보라·분홍·갈색·먹색·회색, 파랑 없음, 밝기 차이 크게). lcolPlan68 새로 선언(Fixed 빨강·Atelier 노랑·Project 보라·Personal 먹색·Limen 주황·습관 초록·루틴 분홍·기본함 회색). mig70col(한 번): 예전 팔레트 색(LMAP70)인 목록만 새 색, 백업 `C.lcolBak70` → 알림 '예전 색으로'. 캘린더 '표시: 목록' = 34% 칠 + 4px 띠 + 이모지(v5o). 할 일 줄 5px 띠 + 목록 이름 칩(.lt70). rowCols68 새로 선언.
- **🌊 몰입 타이머** tmode 'flow': 목표 = 최소 시간. speedOf 감쌈(flow: 채우면 ✨base×.25, 그 뒤 10분마다 base×.1, 50분까지). **고친 버그: finishSingle이 speedOf에 mode를 안 넘겨서 '⚡ 빠를수록'이 끝낼 때 안 먹었음** → endRun 감싸 LM70로 넘김. 사냥 화면: 삐삐 대신 chime70 한 번 + toast, over(빨강) 없음. 루틴 단계: routineStep62 감싸 FS70 → completeTask ctx.spd, 넘긴 시간 RUN.flowX70은 루틴 완주 빠르기에서 뺌(FX70). 켜는 곳: 할 일 상세 ⏱ 칸 🌊 버튼, 루틴 단계 줄 🌊(data-fl70, stRow62 감쌈), 사냥 화면 방식 칩, 단계 우클릭. flowMig70(한 번, C.mig70flow): 루틴 단계 중 '독서·책 읽·읽기' 할 일 → flow(되돌리기 알림). 카드(a.tmode) 편집 UI는 아직 없음.
- **📂 목록 편집 창** listSheet70: 할 일 화면 #tListSel 옆 ✎(data-ls70open) · 고르기 맨 아래 '✎ 목록 편집…'. 이름(바로 저장)·색(이름 같이 보임)·폴더·↗ 열기·↑↓·🗑(기본함·습관·루틴 목록은 못 지움, 할 일은 기본함으로, 되돌리기)·새 목록(남은 색 자동).
- **규칙 바로 고치기** editSheet70(tab,title): #editBody를 창으로 잠깐 옮겨 renderEdit, 닫으면 제자리. 들어가는 곳: LV·XP 정보 창(⚙ 레벨·하루·기록 규칙 / 🗺 레벨 보상), 유리병 '⚙ 병 규칙', 병 우클릭. 규칙 탭에 '기록 · 날짜' 칸(rules70HTML): ✍ 보너스 켜기·XP·하루 최대(C.otb69), 할 일 '오늘' 바뀌는 때(자정/점수와 같이 = C.taskMid68).
- 우클릭 더: 루틴 단계 줄(.st62: 열기·🌊·↑↓·카드·빼기, r62op70이 숨은 버튼 클릭으로 기존 핸들러 씀) · 유리병([data-viewjar]).
- 테스트: t70.py(언제·스낵바·색·목록 편집) · t70b.py(몰입 단일/루틴·빠를수록 고침·규칙 창·단계 우클릭). t64·t67은 v6.9 빌드에서도 같은 곳에서 멈춤(옛 선택자, 이번 변경과 무관).

## v7.1에서 한 것 (w71.js · v71.css · patch23.py) — 써 보고 느낀 점 한 번에 · 본 앱 바로 승격
- **고친 버그**: PC에서 할 일 상세를 옆에 띄운 채(docked) 고르기 창(#pk61)·메뉴(#m61)를 누르면 pointerdown '바깥 누르면 닫기'가 closeSheet → closeSheet 감싸개가 PK61부터 닫아서 **카드 '찾아 고르기'·있는 할 일 넣기 등 고르기 창이 다 안 먹었음**(patch23이 그 선택자에 #pk61,#m61,#snack,#err69,#upd69 추가) · 자동완성 keydown이 한글 조합 중 Enter로 골라 '#집중'→'#집 중'(isComposing 막음) · 카드 편집 '⏱ 루틴 없음'(옛 s.aid만 봄 → aeRt71: rtOf61로 단계 번호까지, '＋ 루틴에 넣기…' = rtJoin61 몇 번째 고르기) · '✅ 연결된 할 일'에 루틴 단계 빼기 · 묶인 할 일 끌기(.tkids = data-drop="reorder:kids", dndEnd 감싸 order/루틴이면 r.steps) · 루틴 단계 줄 단추 겹침(stRow62 감싸 .mn·.fl70·.ops를 span.ctl71로 묶고 grid-area) · 폰 입력 중 튕김(applyLog59 감싸 키보드로 높이만 바뀔 땐 안 함, kbOnly71) · wait65는 루틴·습관·반복 빼고 4시간 안의 약속만 · 추천에서 90분 넘게 남은 시각의 일 빼기.
- **할 일**: taskSorter 새로(날짜 → 시각 있는 것 먼저·이른 순 → 중요도 → order). 🔍 찾기 #tq71(ui.tq71, taskMatches 감쌈 — 현재 sel일 때만, Ctrl+F). 루틴 단계(isRtKid71)는 머리가 그 목록에 맞을 때만(날짜 없음에 안 쌓임). 📁 폴더 = 버튼(f:폴더). 태그 상위/하위 '/' — '#상위' 고르면 하위까지, 옆 목록 들여쓰기(side71). ☠ 미룬 것·🎯 집중·날짜 없음 머리 안내(h71, ×=C.ui.collapsed). 여러 개 고르기 '📅 날짜…'(#mb71d: 모레·주말·다음 주·+1주·직접) · '🎯 집중' 이름. 우클릭 🎯 집중 넣기/빼기·📄 복사(copyTask71, 묶인 할 일까지). 줄 색 띠 4px + padding-left, .tfold 30px(터치 38px).
- **↔ 여러 날 일정** `t.end71`: spanDays71 — 월 보기 byDay(patch23)·tasksOn·오늘/내일·dateBucket·overdue 아님. 상세 📅 칸 '끝나는 날'. 반복이 있으면 end71 대신 rep.until.
- **자연어**(pre71 → 원래 parseQuick): 기간 'A부터 B까지'·'17~20일'(D71: 어제·오늘·N일·M월N일·M/N·(이번|다음|다다음)주 X요일) · 'A 마감' · 'N일 동안' · 'N시부터 K시간(M분) 동안' · 'N분 미만/안에/쯤' · '주에 N번'→'주N회' · 꼬리 '부터' 정리 · `*구슬`(jarSelOpts 이름) · `@영역`. 미리보기 칩도.
- **기본 목록** `C.defList71`(없으면 이름에 Personal) · 태그 → 목록 `C.tagList71`(상위 태그도 봄) · 태그 → 영역은 원래 `C.tagArea`. 🏷 태그 관리 창 tagSheet71(이름 바꾸기=하위까지·영역·목록·지우기·새 태그). 추가 뒤 toastAct '되돌리기'. 입력칸 '⋯ 자세히'(ADD71 → 만들고 상세 열기, sheetNew71이면 상세 맨 위 '↶ 만들기 취소').
- **할 일 상세**(drawTaskSheet 감싸 DOM 손봄): 맨 위 🎯·📄, 칩 크기는 effort·dur 없으면 '📏 크기'(비어 보임, 점수는 기본 mid), **⚔️ 용기 칩 따로**(t.bsz71 s/m/l — taskBase가 effort 대신 씀; 크기 칸의 ⚔️ 단추는 지움), 영역 칩에 🔮 구슬, 타이머 칩 🌊. 크기 칸에 '지금 받는 점수'·골드 안내·'크기 비우기'. 카드 칸 맨 위 **카드 점수 배수** `t.mul71`(1·1.5·2·3 — taskBase와 applyEntry(e.tid&&e.aid → e.mul71) 둘 다). 태그 칸 칩(×)·Enter 저장·🏷 관리. 메모·묶인 할 일·체크리스트는 이름표(.sec71)·상자(.box71)·끝 줄 구분선(.foot71).
- **점수**: 카드 없는 할 일 골드 = 경제 영역이거나 t.px일 때만(`C.tg71='all'`이면 예전처럼). 편집 → 규칙 '기록 · 날짜'에 💰 선택·📅 한 주 시작·📂 기본 목록(rules70HTML 감쌈).
- **한 주 시작** `C.wk71`(0=일, 기본 월): weekStart 새로 선언, 월 보기 머리 WKH71()(patch23). 주 키(C.wone62·C.wnote59 등)는 시작일 기준이라 바꾸면 그 주 메모가 안 보일 수 있음.
- **루틴**: 단계 `s.g71`(같은 값 = 🔀 하나만 골라 하기) · `s.opt71`(◌ 선택). 완주 = rtNeed71(필수 다 + 묶음마다 하나). rtDone64·rtDoneGo64 새로 선언(묶음 상자, 묶음 안 체크는 하나만). 타이머 시작(startRun 감쌈)은 rtPickSheet71로 오늘 할 것 고른 뒤 걸러진 steps로(p71). **단계를 목록에서 하나씩 체크해도 다 되면 완주**: completeTask 감싸 RT71(이 기기에서 방금 한 루틴만) → render 앞 rtAuto71 → rtFull71(하루 한 번, 사냥 중인 루틴은 건너뜀). 루틴 ⏰ 몇 시쯤 = 머리 할 일 t.time(rtCard62 감쌈).
- **카드**: 편집 → 행동 보드가 기본(ui.aeBoard ← `C.aeBoard71`, 토글 기억) · 보드 칸(.bchip) 어디 눌러도 편집 · 새 카드 맨 위(addrow·addform unshift, 새 좋은 카드 골드 0) · 타이머 방식에 🌊 몰입·⏹ 안 씀(a.tmode 'none' → speedOf 보너스 0) · 🍬 코스 설명(#aeDopa 밑 .dd71one + 접는 설명). 나쁜 행동은 늘 창(📅 언제?) — needsSheet 새로 선언.
- 상점 정렬 `C.shop71`(asc/desc, renderShop 감쌈 + render·hashchange). 게임 방법 card71, F67 7개.
- 테스트: `dev/v5/t71.py`(자연어·정렬·찾기·PC 카드 고르기·배수·루틴 골라 하기·자동 완주·일퀘·기간·주 시작·여러 개 날짜·상점) · `t71b.py`(보드·카드 칸 클릭·타이머 안 씀·코스 설명·새 카드 위·묶음 끌기·하위 태그·폴더·태그 관리·자세히/취소·복사·집중). t69 FAILS 0, t70·t70b 그대로. t62·t65는 v7.0에서도 같은 곳에서 멈춤(옛 선택자).

## 사용자가 거듭 말하는 것 (매번 확인)
- **연결·통합이 매끄러운가**: 같은 것이 화면마다 다르게 보이면(개수·거르기·이름) 바로 맞출 것. 어디서 연 것이든 거기서 고치고 돌아올 수 있게(칩·우클릭·뒤로).
- 목록이 '텍스트만 쭉'이면 막막해함 → 찾기·묶음·자주 쓰는 것 먼저(고르기 창).
- 새로고침·업데이트 뒤 되돌아가는 설정 → 저장 경로(normConfig 키) 먼저 의심.
- 화면 배치는 홈처럼 지도 끌기로.

## 아직 안 한 요청 (사용자 요청 기준, 매 릴리스마다 갱신해서 답변에 붙이기)
- 사용자 확인 받기(v7.1): PC에서 할 일 상세 → 🃏 → 🔍 카드 찾아 고르기 · 카드 편집의 ⏱ 루틴(단계 번호) · 레테 등 루틴 ⏰ 몇 시쯤 정하기 → 할 일 순서 · 🔀/◌ 단계 · 아침 루틴 일퀘 · 입력 '17~20일 촬영' · 기본 목록 Personal · 🏷 태그 관리 · 할 일 골드 규칙(경제만)이 마음에 드는지(아니면 편집 → 규칙에서 예전처럼).
- v7.0 확인 항목도 그대로(본 앱 첫 실행 기기 · 빨간 띠 · 🌊 독서 · 📂 목록 편집).
- **도파민 디저트 골드 스위치: 2026-11-20쯤 판단**(사용자가 '2주 뒤'로 정함. 기본 꺼짐 스위치로, 디저트 기록 2주치 보고).
- 제안만 하고 안 한 것: 집안일 '청소 보드'(사용자에게 묶음+각자 반복으로 권함 — 원하면 영역/목록 템플릿) · 밥 먹을 때 보는 것(🍽 식사 친구 목록 아이디어) · HP '어제 이월' · 레벨 30 이후 여정 · 설정 문서 쪼개기 · 루틴 단계 묶음을 사냥 화면에서 그때 고르기(지금은 시작 전에 고름).
- 우클릭 후보 남은 것: 도파민 코스 칸 머리.
- 베타는 시험용. 본 앱과 기록이 갈라짐 → 베타를 본 앱 기록으로 맞추려면 베타 띠 '실제 기록 다시 복사'.

## 1단계 마무리 (v5.7에서 끝남 — 기록용)
- ~~루틴 통일~~ (v5.5 완료) 메모:: finishRoutine은 루틴 덩어리 XP 하나만 주고, aid로 이어진 단계(예: Lethe의 샤워)를 해도 그 습관 카드가 기록되지 않음 → 일퀘·방치 경보·통계에 안 잡힘. 단계 체크 시 연결 카드로 기록(카드 점수), 루틴 점수는 '완주 보너스'만 작게. aid 없는 단계는 점수 없는 체크 항목으로 두거나 카드로 만들기 버튼.
- **할 일 상세에 리듬 표시** → '결정 대기' 답에 따라 달라짐. 원래 메모:: 습관이 연결된 할 일이면 그 카드의 리듬(☑ 매일·요일·📌)을 상세에서 보이고 바로 켜고 끄게. 할 일의 '반복'(캘린더에 언제 뜨나)과 습관 '리듬'(오늘 습관 줄에 뜨나)이 둘 다 있으면 오늘 목록에 같은 행동이 두 번 뜰 수 있음 → 연결된 할 일이 오늘 있으면 습관 줄은 숨기는 규칙 필요.
- ~~할 일 상세의 용기~~ (v5.5: 연결 카드 칩으로 ⚔ 보임): '⚡ 용기' 버튼은 '크기(보상)' 줄에 이미 있음(습관 연결 없는 할 일용). 습관이 연결된 할 일이면 그 카드의 ⚔ 표시를 상세에 보여주기.
- ~~⚔ 용기 찾기~~ (v5.5 완료): 습관 탭 필터(모두/좋은/나쁜)에 '⚔ 용기' 추가, 검색에서 '용기'로 ⚔ 카드·용기 버튼·⚡ 할 일 찾기, 할 일 스마트 목록에 '⚡ 용기'. (지금 ⚔ 붙은 카드가 없는 건 기본 습관 중 용기형이 없어서 — 마이그레이션은 아무 카드에도 ⚔를 안 붙임.)
- 릴리스마다 답변 끝에 **"확인할 곳" 체크리스트**를 줄 것.

## 사용자가 원한 것 — 남은 단계
- **2단계**: 습관·도파민 **칸반 보드**(영역 칸/코스 칸, 끌어 옮기기, 칸 안 정렬·그룹 — 도파민 편집 화면처럼, 공용 부품으로) · **태그**(왼쪽 메뉴 태그 섹션, 상세에서 기존 태그 칩 고르기+자동완성, 빠른 입력 `#태그`) · **할 일 상세 정리**(습관 연결·태그·영역을 칩 한 줄로) · **캘린더**(시간 칸 클릭으로 할 일 추가 + 끌어서 범위, 색 기준 영역/목록 둘 다 만들고 설정에서 선택(파랑 제외·아이콘 병기), 끌어다 놓기의 '지난 것' 옵션 제거) · **홈 배치 편집**(네이버 블로그 레이아웃 설정처럼: 위에 프리셋, 아래 축소 지도에서 블록 끌기. 폰은 순서만) · **자연어 입력 강화**(예: "일요일 7시부터 8시까지 빨래하기 매주 반복" → 날짜·시간 범위·반복·#태그·~목록·!중요도) · 할 일 입력 시 **습관에서 꺼내오기**.
- **3단계**: 아바타 꾸미기 상점(투구·갑옷·무기·방패·피부·배경 부위별, 직접 그린 그림, 골드 소모처) · 보스 확장. **보스는 끊고 싶은 나쁜 습관 이름으로 만들지 말 것**(사용자 우려: 그 행동에 인지가 쏠림) → '망설임의 안개', '미루기 거인' 같은 추상적인 적. 현재 BOSSES 목록에 '야식 고블린'·'무한 스크롤 슬라임' 같은 습관형 이름이 있으니 3단계 때 바꿀 것. 용기 행동 = 치명타, 처치 보상 = 전용 장비.
- 도파민 '디저트' 골드 소모: 지금은 안 함(기록만 쌓고 2주쯤 뒤 판단). 3단계 때 설정 스위치(기본 꺼짐)로.
- "반영해" 시 본 앱 승격(베타 index.html을 본 앱용으로: habit-beta → habit 경로, β 표시 제거 등 확인).
