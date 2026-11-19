# ---------- v10.7 (patch.py 안에서 exec): 11/20 아침 피드백 — 관리·주 N회 연동 묶음 (w106.js · v106.css) ----------
rep('<b>β 베타 v10.6</b>','<b>β 베타 v10.7</b>')
rep('</style>\n\n<header','\n'+rd('v106.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w106.js')+s[i:]
