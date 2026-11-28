# ---------- v13.32 (patch.py 안에서 exec): w152 — F5-④ 📏 양 기준 · 🛏 수면 시간 카드 하나로 · ⇄ 합칠 만한 카드 n쌍 · 🛏 이번 주 23시 전/자정 넘김 ----------
rep('<b>β 베타 v13.31</b>','<b>β 베타 v13.32</b>')
rep('</style>\n\n<header','\n'+rd('v152.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w152.js')+s[i:]
