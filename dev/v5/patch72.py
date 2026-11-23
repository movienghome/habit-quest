# ---------- v12.0 (patch.py 안에서 exec): 할 일 상세 루틴 칸에도 프리셋 · 일정에 루틴 상황 · 프리셋별 단계 분 (w118.js·v118.css, w117.js 일부 고침) ----------
rep('<b>β 베타 v11.9</b>','<b>β 베타 v12.0</b>')
rep('</style>\n\n<header','\n'+rd('v118.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w118.js')+s[i:]
