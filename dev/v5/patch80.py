# ---------- v12.8 (patch.py 안에서 exec): 단계 제목 펼치기 · 홈 이번 주 용기 한 줄 합치기(S1) · 🧽 관리 하나씩 놓기 (w126.js·v126.css) ----------
rep('<b>β 베타 v12.7</b>','<b>β 베타 v12.8</b>')
rep('</style>\n\n<header','\n'+rd('v126.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w126.js')+s[i:]
