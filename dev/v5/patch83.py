# ---------- v13.1 (patch.py 안에서 exec): 관리 = 일반 할 일처럼 · ○ 체크 고침 · 끝낸 자리 · 관리 창 띄우기·끌어 놓기 (w129.js·v129.css — w120·w105 안도 고침) ----------
rep('<b>β 베타 v13.0</b>','<b>β 베타 v13.1</b>')
rep('</style>\n\n<header','\n'+rd('v129.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w129.js')+s[i:]
