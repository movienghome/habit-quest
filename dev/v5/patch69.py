# ---------- v11.7 (patch.py 안에서 exec): 루틴 머리줄 오늘 상황 칸 + 점수 칸 정리 (w115.js·v115.css, 예전 dn75 칩 줄은 w114.js에서 뺌) ----------
rep('<b>β 베타 v11.6</b>','<b>β 베타 v11.7</b>')
rep('</style>\n\n<header','\n'+rd('v115.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w115.js')+s[i:]
