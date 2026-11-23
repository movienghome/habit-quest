# ---------- v12.2 (patch.py 안에서 exec): 끝낸 칩 끌기 · 주 N회 날마다 시각·길이 · 하그둘 날 · 주 5회+최소 3회 · 끝낸 막대 크기 (w120.js·v120.css, v119.css·w86·w93 안도 고침) ----------
rep('<b>β 베타 v12.1</b>','<b>β 베타 v12.2</b>')
rep('</style>\n\n<header','\n'+rd('v120.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w120.js')+s[i:]
