# ---------- v13.17 (patch.py 안에서 exec): 11/26 밤 2차 (w143.js) ----------
rep('<b>β 베타 v13.16</b>','<b>β 베타 v13.17</b>')
rep('</style>\n\n<header','\n'+rd('v143.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w143.js')+s[i:]
