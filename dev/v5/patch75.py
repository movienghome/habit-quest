# ---------- v12.3 (patch.py 안에서 exec): 경고 최소 기준 · 주 N회 이상 목표+최소 · 하나 그리고 둘(보이기 고침) · 점 모양 · 칩 상세 화면 · 월 막대 크기 통일 (w121.js·v121.css) ----------
rep('<b>β 베타 v12.2</b>','<b>β 베타 v12.3</b>')
rep('</style>\n\n<header','\n'+rd('v121.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w121.js')+s[i:]
