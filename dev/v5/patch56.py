# ---------- v10.4 (patch.py 안에서 exec): 11/14 피드백 — 😴 잠 칩 글자 · 몸 최대 설명 · HP 비교 이유 보강 · 체크 = 기록 창 · 카드 메뉴 · 보조 영역 · 영역 칸 테두리 (w103.js · v103.css) ----------
rep('<b>β 베타 v10.3</b>','<b>β 베타 v10.4</b>')
rep('</style>\n\n<header','\n'+rd('v103.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w103.js')+s[i:]
