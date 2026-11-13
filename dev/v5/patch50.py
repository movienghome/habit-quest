# ---------- v9.8 (patch.py 안에서 exec): D11-3 기록하기에서 바로 정리 — 타일 끌어 영역·순서 · 영역 칸 순서 (w97.js · v97.css) ----------
rep('<b>β 베타 v9.7</b>','<b>β 베타 v9.8</b>')
rep('</style>\n\n<header','\n'+rd('v97.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w97.js')+s[i:]
