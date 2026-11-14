# ---------- v10.2 (patch.py 안에서 exec): F1 조각 1 — 막대 구조 분리 + 아침 에너지 빼기 (w101.js · v101.css) ----------
import re as _re54
rep('<b>β 베타 v10.1</b>','<b>β 베타 v10.2</b>')
rep('</style>\n\n<header','\n'+rd('v101.css')+'</style>\n\n<header')
# 시작점 = hpBase101(날) — 지난 날(새 규칙 전)은 아침 에너지 그대로, 새 규칙 날은 하루 시작값
_n0=s.count('C.energyBase[(')
s,_n1=_re54.subn(r"C\.energyBase\[\((d|day)\.energy\|\|3\)-1\]\?\?60",lambda m:'hpBase101('+m.group(1)+')',s)
s,_n2=_re54.subn(r"ENERGY_LBL\[\((d|day)\.energy\|\|3\)-1\]\|\|'보통'",lambda m:'hpLbl101('+m.group(1)+')',s)
if _n1<7 or _n2<2:raise SystemExit(f'patch54 energy {_n1} {_n2}')
rep("아침 에너지(지금 ${C.energyBase.join(' / ')})가 모든 영역의 시작점이에요.</li>","${on101()?`HP는 하루 시작값(${hpb101()})에서 시작해 🔋 컨디션 영역의 변화만 더해요(📈 진척·💰 경제는 따로). 지난 날은 아침 에너지(${C.energyBase.join(' / ')})가 시작점이었어요.`:`아침 에너지(지금 ${C.energyBase.join(' / ')})가 모든 영역의 시작점이에요.`}</li>")
i=s.rindex('\nroute();boot();\n')
s=s[:i]+'\n'+rd('w101.js')+s[i:]
