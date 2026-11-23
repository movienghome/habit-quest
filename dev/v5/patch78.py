# ---------- v12.6 (patch.py 안에서 exec): 루틴 카드 통합·미니멀 R1~R4 · 끝낸 며칠짜리 막대 목록 색 (w124.js·v124.css) ----------
rep('<b>β 베타 v12.5</b>','<b>β 베타 v12.6</b>')
rep('</style>\n\n<header','\n'+rd('v124.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w124.js')+s[i:]
