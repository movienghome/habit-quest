# ---------- v10.5 (patch.py 안에서 exec): 11/14 사용자 답 — 빗금 진하게 · 폰 시간표 오조작 막기 · 잠·술 몸 시작에도 · 카드 잇기·보조 영역 정리 · 카드 지울 때 이어진 일 · 기록하기 하루 요약 (w104.js · v104.css) ----------
rep('<b>β 베타 v10.4</b>','<b>β 베타 v10.5</b>')
rep('</style>\n\n<header','\n'+rd('v104.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w104.js')+s[i:]
