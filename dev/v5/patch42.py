# ---------- v9.0 (patch.py 안에서 exec): 미니멀 1 — 맨 위 머리줄(아바타 영역) 얇게 (v89.css) ----------
rep('<b>β 베타 v8.9</b>','<b>β 베타 v9.0</b>')
rep('</style>\n\n<header','\n'+rd('v89.css')+'</style>\n\n<header')
