# ---------- v11.6 (patch.py 안에서 exec): N21 루틴 상황별 프리셋 일반/출근/외근 (w114.js·v114.css, 완주·체크 창 단계 목록 거름은 w71.js 안) ----------
rep('<b>β 베타 v11.5</b>','<b>β 베타 v11.6</b>')
rep('</style>\n\n<header','\n'+rd('v114.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w114.js')+s[i:]
