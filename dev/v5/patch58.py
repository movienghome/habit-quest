# ---------- v10.6 (patch.py 안에서 exec): 11/14 밤 피드백 묶음 — 내일 짜기 뒤로 가기·옵션 · 관리 되돌리기 · 지난 날 끝낸 일 · 주 N회 줄 다시 (w105.js · v105.css) ----------
rep('<b>β 베타 v10.5</b>','<b>β 베타 v10.6</b>')
rep('</style>\n\n<header','\n'+rd('v105.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w105.js')+s[i:]
