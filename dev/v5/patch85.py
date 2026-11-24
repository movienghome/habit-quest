# ---------- v13.3 (patch.py 안에서 exec): U3 방치 경보 정리 · U4 할 일 오늘 칩 한 줄 · U5 ⏩ 미루기 ☠ 칸 · U6 보이기·숨기기 둘로 (w131.js·v131.css) ----------
rep('<b>β 베타 v13.2</b>','<b>β 베타 v13.3</b>')
rep('</style>\n\n<header','\n'+rd('v131.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w131.js')+s[i:]
