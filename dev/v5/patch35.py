# ---------- v8.3 (patch.py 안에서 exec): C묶음 — 캘린더 ----------
rep('<b>β 베타 v8.2</b>','<b>β 베타 v8.3</b>')
rep('</style>\n\n<header','\n'+rd('v83.css')+'</style>\n\n<header')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w83.js')+s[i:]
rep("open.forEach(t=>{spanDays71(t).forEach(k=>(byDay[k]=byDay[k]||[]).push(t))});","open.forEach(t=>{(span71(t)?[]:spanDays71(t)).forEach(k=>(byDay[k]=byDay[k]||[]).push(t))});   // v8.3: 여러 날 일정은 w83이 막대로")
