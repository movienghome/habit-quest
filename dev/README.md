# 해비티카틱 (옛 습관 퀘스트) — 이어서 작업하기 (v5.3 기준, 2026-11-05)

## 저장소·주소
- 저장소: github.com/movienghome/habit-quest (GitHub Pages + Firebase)
- 본 앱: https://movienghome.github.io/habit-quest/ → **v4.4 그대로** (아이콘만 바뀜)
- 베타: https://movienghome.github.io/habit-quest/beta/ → **v5.3** (데이터: habit-beta, 실제 기록과 분리)
- 작업 방식: 고친 건 베타에 먼저 → 사용자가 "반영해" 하면 본 앱에 옮김

## 사용자 요청 (항상)
- 한국어로 답하기. 파일 여러 개 보낼 땐 사용자가 할 일을 따로 정리.
- 파란색 싫어함, 색약 있음 → 색만으로 구분하지 말 것.
- 유료 서비스·Blaze 전환·외부 서비스 추가 금지(별도 승인 없으면). 개인 백업을 외부로 보내지 않기.

## 소스 구조 (중요)
- `beta/index.html`은 **생성 파일**. 직접 고치지 말고 `dev/v5/`의 모듈을 고친 뒤 빌드.
- 빌드: `cd dev/v5 && python3 patch.py` → 본 앱 `index.html`(v4.4)을 원본으로 읽어 `beta/index.html`을 만듦.
  - patch.py 안의 경로(SRC, DST, V, 스크래치 경로)는 이전 작업 환경 기준(/home/claude/...)이라 새 환경에 맞게 고쳐야 함.
  - 순서: patch.py → patch2.py(저장소·효과·JS 모듈 목록) → patch3(v5.1) → patch4(v5.2) → patch5(v5.3)
  - JS 모듈: v5a(할 일 핵심) b(완료 창·옵션) c(할 일 화면·상세) d(캘린더·끌기 엔진) e(가챠·사냥) f(홈·편집·틱틱 가져오기) g(이벤트) h(도파민·전투·분할) i(스마트 목록·되돌리기·자동완성) j(v5.3 신규)
  - HTML 조각: views.html, home_blocks.html, overlays.html / CSS: v5.css + 각 patch의 CSS 블록
- 릴리스 때 `beta/sw.js`의 VERSION 올리기 (지금 `2026-11-05-v53`).
- 테스트: Playwright + `dev/v5/mockdb.js`(가짜 Firestore). 저장소 루트에서 `python3 -m http.server 8765`, t*.py 실행(경로 수정 필요).

## v5.3에서 한 것
- '오늘' 하나로: 할 일 + 오늘 할 만한 습관(일퀘·방치 경보 기한·요일 지정·📌 고정)만 자동. 목록 위 "오늘 +XP · 🪙" 피드백.
- '기록' 탭 → '습관 모음'(📌 고정 버튼). 습관 편집에 띄울 요일·고정.
- 영역 6개: 몸·마음·작품(make)·성장(grow)·생활·경제(money). 목록엔 영역 없음 → 할 일·태그·연결 습관에서 영역(없으면 컨디션 변화 없음).
- 받은함→기본함, 기본 목록 Fixed·Atelier·Project·Errands·Limen(설명 포함), Focus → 🎯집중 태그(기본함으로 이동), 스마트 목록 '🎯 집중'.
- Limen 루틴 Eos·Vesper·Lethe, 같은 이름 할 일에 연결(⏱ 누르면 루틴).
- 목록 순서 끌기 버그 수정(끄는 중 다시 그리기 + 체크박스 초점), 왼쪽 목록에서 바로 순서 끌기.
- 여러 개 고르기(☑, Ctrl/Shift+클릭) + 일괄 막대 + 왼쪽 목록으로 끌기.
- '하지 않음' 칸(status -1, 줄긋기, ✕로 다시 열기).
- 상세 칸 압축: 시간 범위 한 줄, 중요도 깃발, 반복 선택 칸 + 직접 입력(말로).
- '언제 했나요?'(방금·1시간 전·아침에·직접) → 기록 시각·시간대 옵션 자동, 타이머는 시작 시각.
- 도파민 코스 편집(C.dopaCourses 추가·이름·삭제) + 여러 개 골라 옮기기.
- 편집 탭 모든 표·식사 항목 끌어서 순서. 캘린더 머리줄 아이콘 한 줄, 넓은 화면 전체 폭.
- 설정 버전 v7 (mig53 / mig53Tasks).

## 다음
- 사용자 추가 피드백 반영 → "반영해" 시 본 앱 승격(베타 index.html을 본 앱용으로: habit-beta → habit 경로, β 표시 제거 등 확인).
