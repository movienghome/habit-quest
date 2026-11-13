# ---------- v9.7 (patch.py 안에서 exec): D11 카드 화면 — 타일 격자·지금 맞는 카드·점수 글자 (w96.js · v96.css) ----------
rep('<b>β 베타 v9.6</b>','<b>β 베타 v9.7</b>')
rep('</style>\n\n<header','\n'+rd('v96.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w96.js')+s[i:]
