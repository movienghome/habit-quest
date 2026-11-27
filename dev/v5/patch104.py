# ---------- v13.23 (patch.py 안에서 exec): X2-① 왜 이 상태? (w146.js·v146.css) ----------
rep('<b>β 베타 v13.22</b>','<b>β 베타 v13.23</b>')
rep('</style>\n\n<header','\n'+rd('v146.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w146.js')+s[i:]
