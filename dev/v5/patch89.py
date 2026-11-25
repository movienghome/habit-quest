# ---------- v13.7 (patch.py 안에서 exec): 루틴 프리셋 폴더 탭·이름 바로 바꾸기·이번만 팝오버 · 하나 그리고 둘 🤝 (w135.js·v135.css) ----------
rep('<b>β 베타 v13.6</b>','<b>β 베타 v13.7</b>')
rep('</style>\n\n<header','\n'+rd('v135.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w135.js')+s[i:]
