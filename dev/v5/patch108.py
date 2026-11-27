# ---------- v13.28 (patch.py 안에서 exec): w148 — 생활 = 🧺 관리 상태 막대(HP 밖) ----------
rep('<b>β 베타 v13.26</b>','<b>β 베타 v13.28</b>')
rep('</style>\n\n<header','\n'+rd('v148.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w148.js')+s[i:]
