# ---------- v9.0 미니멀 2 (patch.py 안에서 exec): 홈 '나' 카드를 전투 카드에 합침 (w90.js · v90.css) ----------
rep('<b>β 베타 v9.0</b>','<b>β 베타 v9.1</b>')
rep('</style>\n\n<header','\n'+rd('v90.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w90.js')+s[i:]
