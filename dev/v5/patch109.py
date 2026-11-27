# ---------- v13.29 (patch.py 안에서 exec): w149 — F5-① 기준형 카드(옵션 판정 ▲○▼) · 경제 칩 쓴 것/깎인 것 나눔(w148·w145 직접) ----------
rep('<b>β 베타 v13.28</b>','<b>β 베타 v13.29</b>')
rep('</style>\n\n<header','\n'+rd('v149.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w149.js')+s[i:]
