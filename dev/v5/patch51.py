# ---------- v9.9 (patch.py 안에서 exec): 지운 카드 되살아남 막기(묘비) · D8 경보판 연쇄 창 · D9 용기 고르기 · D10 홈 오늘 타임라인 (w98.js · v98.css) ----------
rep('<b>β 베타 v9.8</b>','<b>β 베타 v9.9</b>')
rep('</style>\n\n<header','\n'+rd('v98.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w98.js')+s[i:]
