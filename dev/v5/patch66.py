# ---------- v11.4 (patch.py 안에서 exec): 보상함 상한 — 물건별 주기 상한 · 한 달 전체 상한 · 사기 전 확인 (w112.js·v112.css) ----------
rep('<b>β 베타 v11.3</b>','<b>β 베타 v11.4</b>')
rep('</style>\n\n<header','\n'+rd('v112.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w112.js')+s[i:]
