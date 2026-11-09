# ---------- v7.2 (patch.py 안에서 exec): A 묶음 — 버그 바로잡기 ----------
rep('<b>β 베타 v7.1</b>','<b>β 베타 v7.2</b>')
rep('</style>\n\n<header','\n'+rd('v72.css')+'</style>\n\n<header')
# A1: 1일 보기에서 ‹ › 가 3일씩 움직이던 것
rep("else ui.calAnchor=addDays(ui.calAnchor,n*(m==='week'?7:3));renderCal();return}",
    "else ui.calAnchor=addDays(ui.calAnchor,n*(m==='week'?7:m==='3day'?3:1));renderCal();return}")
# 우클릭 '하루 보기'가 없는 보기 이름('day')을 쓰던 것
s=s.replace("C.ui.cal.mode='day';","C.ui.cal.mode='1day';")
# A10: '자꾸 미루게 돼요'에서 다른 날로 옮길 때 시각을 지우던 것
rep("t.due=to.dataset.av65to;delete t.time;saveTask(t);","t.due=to.dataset.av65to;saveTask(t);")
# A11: 상세 ☠ 줄에서 '사정상 옮긴 거예요'
rep("${t.skull}번 미뤘어요. 3번이면 삼진아웃: 쪼개거나, 가챠로 해치우거나, 버려요.</p>",
    "${t.skull}번 미뤘어요. 3번이면 삼진아웃: 쪼개거나, 가챠로 해치우거나, 버려요. <button type=\"button\" class=\"chipbtn\" data-sk72=\"${t.id}\">사정상 옮긴 거예요 ☠−1</button></p>")
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w72.js')+s[i:]
rep("    ${acc('card71',","""    ${acc('card72','🆕 v7.2 · 버그 바로잡기','지금 버전',`<ul><li><b>캘린더</b>: 1일 보기에서 ‹ ›가 하루씩 · 여러 날 일정을 끌면 통째로 옮겨져요(잡은 날 기준) · 날짜를 옮겨도 시각·소요·끝나는 날 그대로 · 캘린더 거르기로 숨은 일정이 있으면 제목 옆 <b>🙈 n개 숨김</b>, 할 일 상세엔 '보이게 하기'. 거르기를 정한 뒤에 생긴 목록은 이제 걸러지지 않아요.</li><li><b>☠ 미룸</b>: 방금(30분 안) 정한 날짜를 고친 건 미룸이 아니에요. 미룸으로 셌을 땐 알림에 '사정상 옮긴 거예요'(상세 ⋯ 기록에도).</li><li><b>타이머</b>: 다 못 했으면 '그만' → <b>📝 여기까지 한 만큼 기록</b>(한 시간 비율의 절반 점수, 할 일은 남아요).</li><li><b>🌙 늦게 잠</b>: 잠든 시각별 5단계. 아침에 누르면 '어제'가 골라져 있고, 늦게 적었다고 손해 없어요(✍ 보너스도).</li><li><b>🧹 겹친 기록</b>: 같은 기록이 두 번 들어간 게 있으면 알려 주고 하나 지우기. 다른 화면에서 이미 체크한 반복 할 일을 또 누르면 막아요.</li><li>고친 것: 기록하기 '📅 다른 날'(PC) · 체크한 루틴 단계가 목록에 남던 것 · 루틴 몸무게 단계에 입력칸이 없던 것(이제 단계 이름 바로 밑) · 폰 돌아보기 전 주/다음 주에서 화면이 튀던 것 · 상점에서 잘못 산 것 '↶ 취소'.</li></ul>`)}
    ${acc('card71',""")
