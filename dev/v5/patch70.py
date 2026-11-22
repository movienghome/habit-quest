# ---------- v11.8 (patch.py 안에서 exec): 루틴 상황 고르기를 목록 줄에서 빼고 상세 맨 위 줄 + 시작 전 창으로 (w116.js·v116.css, w115·w114 일부 고침) ----------
rep('<b>β 베타 v11.7</b>','<b>β 베타 v11.8</b>')
rep('</style>\n\n<header','\n'+rd('v116.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w116.js')+s[i:]
