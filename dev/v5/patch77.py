# ---------- v12.5 (patch.py 안에서 exec): 루틴 상세 프리셋 '언제' 위 · 프리셋별 시각·요일 · 실행 화면 순서·이름(N13) · 체크리스트 끌어서 순서(N14) (w123.js·v123.css) ----------
rep('<b>β 베타 v12.4</b>','<b>β 베타 v12.5</b>')
rep('</style>\n\n<header','\n'+rd('v123.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w123.js')+s[i:]
