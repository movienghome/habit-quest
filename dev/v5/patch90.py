# ---------- v13.8 (patch.py 안에서 exec): 뽀모도로 기기 간 동기화 (w136.js) ----------
rep('<b>β 베타 v13.7</b>','<b>β 베타 v13.8</b>')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w136.js')+s[i:]
