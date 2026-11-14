# ---------- v10.3 (patch.py 안에서 exec): F1 조각 2 — 몸 출발점 + HP 비교 이유 + 전투 카드 다듬기 (w102.js · v102.css) ----------
rep('<b>β 베타 v10.2</b>','<b>β 베타 v10.3</b>')
rep('</style>\n\n<header','\n'+rd('v102.css')+'</style>\n\n<header')
# 영역 칸의 시작값은 그 영역 것(몸만 이월·최대가 걸림) — hpBase101(day, 영역id)
rep("case 'area':{const ar=C.areas.find(x=>x.id===a);if(!ar)return null;const base=hpBase101(day);","case 'area':{const ar=C.areas.find(x=>x.id===a);if(!ar)return null;const base=hpBase101(day,a);")
rep("const b=hpBase101(d),v=selA?areaValues(d)[selA.id]:overallOf(d);","const b=hpBase101(d,selA&&selA.id),v=selA?areaValues(d)[selA.id]:overallOf(d);")
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w102.js')+s[i:]
