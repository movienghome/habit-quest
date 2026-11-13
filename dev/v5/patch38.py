# ---------- v8.6 (patch.py 안에서 exec): B9 묶인 할 일 영역 따라가기 ----------
rep('<b>β 베타 v8.5</b>','<b>β 베타 v8.6</b>')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w85.js')+s[i:]
