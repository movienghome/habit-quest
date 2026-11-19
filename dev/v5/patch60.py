# ---------- v10.8 (patch.py 안에서 exec): N20 마음 막대 되살리기 (w107.js) ----------
rep('<b>β 베타 v10.7</b>','<b>β 베타 v10.8</b>')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w107.js')+s[i:]
