# ---------- v13.30 (patch.py 안에서 exec): w150 — F5-② 🔢 횟수 기준 + 기록 창 이유 한 줄 · 경제 칩 참음 → 이번 달 충동 목록 ----------
rep('<b>β 베타 v13.29</b>','<b>β 베타 v13.30</b>')
rep('</style>\n\n<header','\n'+rd('v150.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w150.js')+s[i:]
