# ---------- v13.38 (patch.py 안에서 exec): 새 스킨 넷(종이 노트·밤의 플럼·이끼 숲·노을 크림) — v157.css ----------
rep('<b>β 베타 v13.37</b>','<b>β 베타 v13.38</b>')
rep('</style>\n\n<header','\n'+rd('v157.css')+'</style>\n\n<header')
rep("['blue','파랑','#3550b8','#e2e9fb']];","['blue','파랑','#3550b8','#e2e9fb'],['paper','종이 노트','#b8532f','#f5eddc'],['plum','밤의 플럼','#f2b53c','#2a1f38'],['moss','이끼 숲','#2f6b45','#e4ebdb'],['dusk','노을 크림','#a63d5c','#ffe2b8']];")
