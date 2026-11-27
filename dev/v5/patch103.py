# ---------- v13.21~22 (patch.py 안에서 exec): E5 상점 골드 장부 (w145.js·v145.css) ----------
rep('<b>β 베타 v13.20c</b>','<b>β 베타 v13.22</b>')
rep('</style>\n\n<header','\n'+rd('v145.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w145.js')+s[i:]
