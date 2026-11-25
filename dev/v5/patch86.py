# ---------- v13.4 (patch.py 안에서 exec): 할 일 오늘 순서·모두 내일로·⋯ 메뉴·🧽 입력 단추·경보도 끄기·기록 달력·관리 묶음 폴더·3일 하루씩·종일 칸 (w132.js·v132.css) ----------
rep('<b>β 베타 v13.3</b>','<b>β 베타 v13.4</b>')
rep('</style>\n\n<header','\n'+rd('v132.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w132.js')+s[i:]
