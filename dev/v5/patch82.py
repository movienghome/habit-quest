# ---------- v13.0 (patch.py 안에서 exec): 관리 블록 ✓ · 🧽 관리 놓기 시트 강화 · 이번 주 용기 여러 개 (w128.js·v128.css) ----------
rep('<b>β 베타 v12.9</b>','<b>β 베타 v13.0</b>')
rep('</style>\n\n<header','\n'+rd('v128.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w128.js')+s[i:]
