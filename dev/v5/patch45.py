# ---------- v9.3 (patch.py 안에서 exec): 다시 씩씩해지기 — 오늘은 하나만 · 복귀 표시 · 다시 오르는 길 (w92.js · v92.css) ----------
rep('<b>β 베타 v9.2</b>','<b>β 베타 v9.3</b>')
rep('</style>\n\n<header','\n'+rd('v92.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w92.js')+s[i:]
