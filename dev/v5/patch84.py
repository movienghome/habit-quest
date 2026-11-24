# ---------- v13.2 (patch.py 안에서 exec): 관리 창 하나로(w128 deck128 = careSheet76) · 날짜 고르기 한 부품 · 관리 ⋯ 건너뛰기·다른 날짜로 · 할 일 미루기 · 주 N회 칩 순서 · ○ 크기 (w130.js·v130.css — w128·w93 안도 고침) ----------
rep('<b>β 베타 v13.1</b>','<b>β 베타 v13.2</b>')
rep('</style>\n\n<header','\n'+rd('v130.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w130.js')+s[i:]
