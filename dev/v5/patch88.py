# ---------- v13.6 (patch.py 안에서 exec): 루틴 단계 끌어서 순서 바꾸기 (w134.js·v134.css) ----------
rep('<b>β 베타 v13.5</b>','<b>β 베타 v13.6</b>')
rep('</style>\n\n<header','\n'+rd('v134.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w134.js')+s[i:]
