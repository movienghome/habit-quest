# ---------- v11.5 (patch.py 안에서 exec): 상점 맨 위 이번 달 한 줄 + 상한 넘겨 산 구매 돌아보기 (w113.js·v113.css, 기록 표시는 w112.js 안) ----------
rep('<b>β 베타 v11.4</b>','<b>β 베타 v11.5</b>')
rep('</style>\n\n<header','\n'+rd('v113.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w113.js')+s[i:]
