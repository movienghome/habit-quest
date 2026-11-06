# ---------- v6.2 (patch.py 안에서 exec): 루틴 = 할 일 묶음 · 사냥 화면 · 캘린더 꽉 차게 · 직접 그린 장비 · 이번 주 용기 한 가지 · 보스 대사 ----------
rep('<b>β 베타 v6.1</b>','<b>β 베타 v6.2</b>')
rep('</style>\n\n<header','\n'+rd('v62.css')+'</style>\n\n<header')
# 캘린더 월 칸: 폰에서는 칸에 들어가는 만큼 (나머지는 v5s가 재서 숨김)
rep("ts.slice(0,Math.max(1,3-Math.min(2,mk.length)))","ts.slice(0,Math.max(1,calN62()-Math.min(2,mk.length)))")
rep("dn.slice(0,Math.max(0,3-ts.length-mk.length))","dn.slice(0,Math.max(0,calN62()-ts.length-mk.length))")
rep("const more=ts.length+dn.length+mk.length-3;","const more=ts.length+dn.length+mk.length-calN62();")
i=s.rindex('</script>\n<script type="module" src="backend.js"></script>')
s=s[:i]+rd('v5s.js')+'\n'+s[i:]
# 게임 방법
rep("    ${acc('card61',","""    ${acc('card62','🆕 v6.2 · 루틴 단계 = 할 일 · 사냥 화면 · 캘린더 꽉 차게','지금 버전',`<ul><li><b>루틴은 할 일 하나에 단계(할 일)를 묶은 것</b>이에요. 할 일 목록 '⏱ 루틴'에 있고, 펼치면 단계가 보여요. 루틴을 누르면 단계·분·점수가 맨 위에 나와요.</li><li>새 단계를 적으면 할 일로 생겨요. 할 일 목록에서 '⏱ 루틴에 넣기'로 넣으면 그 할 일이 단계가 돼요(날짜는 루틴을 따라요). 빼면 원래 자리로 돌아가요.</li><li>단계를 <b>🃏 카드와 이으면 카드 점수</b>(↻ 습관·☑ 일퀘도 체크), 아니면 할 일 크기·중요도 점수. 사냥 화면에 단계마다 점수가 보여요.</li><li>사냥 화면 버튼이 늘 아래에 보여요. 💭 다르게 보기는 눌러서 펼쳐요. <b>그만</b>을 누르면 한 번 더 물어요(여기까지 하고 끝내기도 있어요).</li><li>폰 캘린더: 캐릭터 줄을 숨기고 화면 가득. 오른쪽 위 '월 ▾'로 보기, ⋯로 색·서랍·거르기. 옆으로 밀면 달이 넘어가요.</li><li>장비 상점의 <b>✏ 직접 그리기</b>(꾸미기 전용, 점수 효과 없음). 홈·돌아보기에 <b>이번 주 용기 한 가지</b>(선택).</li></ul>`)}
    ${acc('card61',""")
rep("kids.sort(taskSorter('due')).map(k=>taskRow(k,{...opt,nested:1}))","kids.sort(kidSort62(t)).map(k=>taskRow(k,{...opt,nested:1}))")
