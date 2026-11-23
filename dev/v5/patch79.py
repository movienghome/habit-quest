# ---------- v12.7 (patch.py 안에서 exec): 루틴 상세 군더더기 걷어내기(R5) · 🛏 어젯밤 창 야식·술 → 어제 기록 (w125.js·v125.css) ----------
rep('<b>β 베타 v12.6</b>','<b>β 베타 v12.7</b>')
rep('</style>\n\n<header','\n'+rd('v125.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w125.js')+s[i:]
