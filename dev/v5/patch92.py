# ---------- v13.10 (patch.py 안에서 exec): 시간표 블록 창에도 🍅 시작 (w138.js) ----------
rep('<b>β 베타 v13.9</b>','<b>β 베타 v13.10</b>')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w138.js')+s[i:]
