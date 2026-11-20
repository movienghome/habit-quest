# ---------- v11.0 (patch.py 안에서 exec): 11/20 캘린더·홈 묶음 — 일정 보기 끝낸 줄 · 홈 2단 굳음 방지 (w109.js · v109.css · w80.js 아침·간식) ----------
rep('<b>β 베타 v10.9</b>','<b>β 베타 v11.0</b>')
rep('</style>\n\n<header','\n'+rd('v109.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w109.js')+s[i:]
