# ---------- v13.33 (patch.py 안에서 exec): w153 — 같은 이름 카드 같이 합치기 · 수면 카드 두 장 바로잡기 · 모음 목록 겹침 · 술·걷기 📏 · 최근 숫자 칩 · X2-③ 올리려면 ----------
rep('<b>β 베타 v13.32</b>','<b>β 베타 v13.33</b>')
rep('</style>\n\n<header','\n'+rd('v153.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w153.js')+s[i:]
