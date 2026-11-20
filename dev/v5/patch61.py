# ---------- v10.9 (patch.py 안에서 exec): 루틴 '오늘은 건너뛰기' 폰에서 바로 (w108.js) ----------
rep('<b>β 베타 v10.8</b>','<b>β 베타 v10.9</b>')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w108.js')+s[i:]
