# ---------- v11.3 (patch.py 안에서 exec): 루틴 바로 넘기기 · 충동 칩(내 기준 여러 단위·보상함 환산·못 참은 기록·폭식/폭음·콤마) · 보상함 대기기간 (w111.js·v111.css + w110.js 안) ----------
rep('<b>β 베타 v11.2</b>','<b>β 베타 v11.3</b>')
rep('</style>\n\n<header','\n'+rd('v111.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w111.js')+s[i:]
