# ---------- v13.15 (patch.py 안에서 exec): 11/26 요청 묶음 — 카드 찾기·영역별 새 카드·건너뛰기·수면 동기화·홈 식사 칸 · 저장 보관·한도 대응 (w141.js·v141.css, v5z.js·backend.js 직접 고침) ----------
rep('<b>β 베타 v13.14</b>','<b>β 베타 v13.15</b>')
rep('</style>\n\n<header','\n'+rd('v141.css')+'</style>\n\n<header')
rep('      <div class="hblock" data-hid="sugg">','      <div class="hblock" data-hid="meal141"><div class="panel"><div class="ptitle"><h2>\U0001F37D 식사 · 자주 쓰는 것</h2><span class="row" style="gap:2px"><a class="small" href="#log" style="color:var(--accent)">기록하기</a><button class="colbtn" data-collapse="meal141" aria-label="접기·펴기"><svg class="ico" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></button></span></div><div id="meal141"></div></div></div>\n      <div class="hblock" data-hid="sugg">')
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w141.js')+s[i:]
