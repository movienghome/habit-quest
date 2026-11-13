# ---------- v9.2 (patch.py 안에서 exec): 쫄따구 HP 막대·보스 아래 배치 · 도전 보스 · 보스 HP 자동 조정 · 앱 이름 '씩씩' (w91.js · v91.css) ----------
rep('<b>β 베타 v9.1</b>','<b>β 베타 v9.2</b>')
rep('</style>\n\n<header','\n'+rd('v91.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w91.js')+s[i:]
# 앱 이름 (사용자 11/13 확정: 씩씩). 화면에 보이는 글자만 있음(식별자·키로 쓰는 곳 없음 — 13곳)
s=s.replace('해비티카틱','씩씩')
