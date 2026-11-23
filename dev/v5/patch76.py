# ---------- v12.4 (patch.py 안에서 exec): 하나 그리고 둘 Fixed 목록 · 만난 날 점 네모 · 끝낸 칩·막대 점선 복구·막대 희미하게 (w122.js·v122.css) ----------
rep('<b>β 베타 v12.3</b>','<b>β 베타 v12.4</b>')
rep('</style>\n\n<header','\n'+rd('v122.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w122.js')+s[i:]
