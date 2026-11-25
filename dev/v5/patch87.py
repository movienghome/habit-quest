# ---------- v13.5 (patch.py 안에서 exec): 칩 미니멀·모두 내일로 길게·관리 묶음 1~2개·그날 했어요·스와이프·행동 고정·오늘 한 일 날짜·주 N회 요일 칸 (w133.js·v133.css) ----------
rep('<b>β 베타 v13.4</b>','<b>β 베타 v13.5</b>')
rep('</style>\n\n<header','\n'+rd('v133.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w133.js')+s[i:]
