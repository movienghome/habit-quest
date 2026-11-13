# ---------- v9.5 (patch.py 안에서 exec): D2 카드 편집 창 · D3 점수 큰 순 고르기 (w94.js · v94.css) ----------
rep('<b>β 베타 v9.4</b>','<b>β 베타 v9.5</b>')
rep('</style>\n\n<header','\n'+rd('v94.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w94.js')+s[i:]
