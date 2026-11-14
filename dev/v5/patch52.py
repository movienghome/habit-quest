# ---------- v10.0 (patch.py 안에서 exec): K2 시나리오 주간 — 여유 일수·점 7개·10분만도 1회·하그둘 꼬리표 (w99.js · v99.css) ----------
rep('<b>β 베타 v9.9</b>','<b>β 베타 v10.0</b>')
rep('</style>\n\n<header','\n'+rd('v99.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w99.js')+s[i:]
