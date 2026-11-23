# ---------- v12.1 (patch.py 안에서 exec): 루틴 상황 줄 맨 위 · 실행 화면 프리셋 · 쉬는 날 프리셋 (w119.js·v119.css, w117.js 일부 고침) ----------
rep('<b>β 베타 v12.0</b>','<b>β 베타 v12.1</b>')
rep('</style>\n\n<header','\n'+rd('v119.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w119.js')+s[i:]
