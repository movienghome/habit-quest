# ---------- v12.9 (patch.py 안에서 exec): 내일 짜기 끌어놓기·목록 색 · 고른 것 보이기(합쳐서) · 폰 진입로 (w127.js·v127.css) ----------
rep('<b>β 베타 v12.8</b>','<b>β 베타 v12.9</b>')
rep('</style>\n\n<header','\n'+rd('v127.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w127.js')+s[i:]
