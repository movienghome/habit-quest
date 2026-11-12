# ---------- v7.9 (patch.py 안에서 exec): B 둘째 조각 + J10 ----------
rep('<b>β 베타 v7.8</b>','<b>β 베타 v7.9</b>')
rep('</style>\n\n<header','\n'+rd('v79.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w79.js')+s[i:]
