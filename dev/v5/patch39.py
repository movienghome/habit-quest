# ---------- v8.7 (patch.py 안에서 exec): J8 주 N회 자리·카운터 (w86.js) + 폰 시간표 독 접기 ----------
rep('<b>β 베타 v8.6</b>','<b>β 베타 v8.7</b>')
rep('</style>\n\n<header','\n'+rd('v86.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w86.js')+s[i:]
