# ---------- v11.9 (patch.py 안에서 exec): 루틴 상황 프리셋 n개 (w117.js·v117.css, w71·v5s·w73·w74 일부 고침) ----------
rep('<b>β 베타 v11.8</b>','<b>β 베타 v11.9</b>')
rep('</style>\n\n<header','\n'+rd('v117.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w117.js')+s[i:]
