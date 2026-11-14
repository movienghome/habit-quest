# ---------- v10.1 (patch.py 안에서 exec): M1 복귀 모아 보기 + 용기 기록 모아 보기 — 돌아보기 '🌱 다시 일어난 증거' (w100.js · v100.css) ----------
rep('<b>β 베타 v10.0</b>','<b>β 베타 v10.1</b>')
rep('</style>\n\n<header','\n'+rd('v100.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w100.js')+s[i:]
