# ---------- v13.19 (patch.py 안에서 exec): 11/26 밤 3차 요청 (w144.js·v144.css · w93.js nfOn93 한 줄) ----------
rep('<b>β 베타 v13.18</b>','<b>β 베타 v13.19</b>')
rep('</style>\n\n<header','\n'+rd('v144.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w144.js')+s[i:]
