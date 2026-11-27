# ---------- v13.26 (patch.py 안에서 exec): w147 — 방치 묶음 머리·빠른 기록 합친 묶기·카드 통계·사라진 것 찾기 ----------
rep('<b>β 베타 v13.25</b>','<b>β 베타 v13.26</b>')
rep('</style>\n\n<header','\n'+rd('v147.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w147.js')+s[i:]
