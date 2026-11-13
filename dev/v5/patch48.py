# ---------- v9.6 (patch.py 안에서 exec): 카드 편집 창 더 줄이기 (w95.js · v95.css) ----------
rep('<b>β 베타 v9.5</b>','<b>β 베타 v9.6</b>')
rep('</style>\n\n<header','\n'+rd('v95.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w95.js')+s[i:]
