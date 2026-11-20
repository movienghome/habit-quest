# ---------- v11.1 (patch.py 안에서 exec): F1 ⑤-1 충동 적기 → 확정 (w110.js · v110.css) ----------
rep('<b>β 베타 v11.0</b>','<b>β 베타 v11.1</b>')
rep('</style>\n\n<header','\n'+rd('v110.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w110.js')+s[i:]
