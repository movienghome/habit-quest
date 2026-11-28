# ---------- v13.36 (patch.py 안에서 exec): w156 — 관리 미리 함·묶음 머리 경보·오늘 한 일 펼치기·첫 화면·🛟 단계 사본·주 N회 옵션·피드 📏 ----------
rep('<b>β 베타 v13.35</b>','<b>β 베타 v13.36</b>')
rep('</style>\n\n<header','\n'+rd('v156.css')+'</style>\n\n<header')
# 첫 그리기 전 기본 마크업(옛 화면)이 보이지 않게 — render가 끝나면 html.ok156(w156), 스크립트가 멈춰도 6초 뒤엔 보임
import re as _re156
_sw156=open('/home/claude/habit-quest/beta/sw.js',encoding='utf-8').read()
_ver156=_re156.search(r"PRE \+ '([^']+)'",_sw156).group(1)
rep('</head><body>','<style>html:not(.ok156) body>*{visibility:hidden}html:not(.ok156) body::before{content:"불러오는 중…";position:fixed;left:50%;top:45%;transform:translate(-50%,-50%);color:#888;font-size:14px}</style><script>window.__ver156='+repr(_ver156)+';setTimeout(function(){document.documentElement.classList.add("ok156")},6000)</script></head><body>')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w156.js')+s[i:]
