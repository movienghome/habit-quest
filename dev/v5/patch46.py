# ---------- v9.4 (patch.py 안에서 exec): K1 내일 짜기 (w93.js · v93.css) ----------
rep('<b>β 베타 v9.3</b>','<b>β 베타 v9.4</b>')
rep('</style>\n\n<header','\n'+rd('v93.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w93.js')+s[i:]
