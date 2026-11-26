# ---------- v13.16 (patch.py 안에서 exec): 11/26 밤 요청 묶음 (w142.js·v142.css) ----------
rep('<b>β 베타 v13.15</b>','<b>β 베타 v13.16</b>')
rep('</style>\n\n<header','\n'+rd('v142.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w142.js')+s[i:]
