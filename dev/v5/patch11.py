# ---------- v5.9 (patch.py 안에서 exec): 지운 카드가 되살아나던 문제 · 행동/습관 화면 배치 · 전투 기록 계산 · 돌아보기 · 보드 순서 끌기 ----------
i=s.rindex('</script>\n<script type="module" src="backend.js"></script>')
s=s[:i]+rd('v5p.js')+'\n'+s[i:]
rep('<b>β 베타 v5.8</b>','<b>β 베타 v5.9</b>')
# 지운 카드가 되살아나던 원인: 기기에 남은 옛 사본(Firestore 기기 캐시)으로 먼저 그린 뒤 그 사본을 서버에 다시 써 버림
# → 서버에서 확인된 기록이 올 때까지 '준비됨'을 미루고, 설정은 서버 확인 전에는 쓰지 않음 (서버가 오면 서버 것을 씀)
rep("const dirty=new Set(), timers={}, writing={}, rev={};","const dirty=new Set(), timers={}, writing={}, rev={}, SRV59={};")
rep("  if(mode!=='db')return;\n  if(writing[n])","  if(mode!=='db')return;\n  if(n==='config'&&!SRV59.c){timers[n]=setTimeout(()=>flush(n),700);return}\n  if(writing[n])")
rep("const seen=new Set();const mark=k=>{seen.add(k);","const seen=new Set();const mark=(k,srv)=>{if(srv===false)return;seen.add(k);")
rep("db.doc('game/config').onSnapshot(s=>{if(!dirty.has('config')){const raw=s.exists?s.data():null;if(rawCfgV===null)rawCfgV=raw?(+raw.v||0):4;C=normConfig(raw)}mark('c');render()},()=>mark('c'));",
    "db.doc('game/config').onSnapshot(s=>{const srv=!(s.metadata&&s.metadata.fromCache);if(srv&&!SRV59.c){SRV59.c=1;if(dirty.has('config')){dirty.delete('config');clearTimeout(timers.config)}}if(!dirty.has('config')){const raw=s.exists?s.data():null;if(rawCfgV===null||srv&&!SRV59.cv){rawCfgV=raw?(+raw.v||0):4;if(srv)SRV59.cv=1}C=normConfig(raw)}mark('c',srv);render()},()=>{SRV59.c=1;mark('c')},{meta:1});")
rep("db.doc('game/progress').onSnapshot(s=>{if(!dirty.has('progress')){const raw=s.exists?s.data():null;if(rawProgHasMarbles===null)rawProgHasMarbles=!raw||!!raw.marbles;P=normProgress(raw)}mark('p');render()},()=>mark('p'));",
    "db.doc('game/progress').onSnapshot(s=>{const srv=!(s.metadata&&s.metadata.fromCache);if(!dirty.has('progress')){const raw=s.exists?s.data():null;if(rawProgHasMarbles===null)rawProgHasMarbles=!raw||!!raw.marbles;P=normProgress(raw)}mark('p',srv);render()},()=>mark('p'),{meta:1});")
rep("      mark('d');render();\n    },()=>mark('d'));","      mark('d',!(s.metadata&&s.metadata.fromCache));render();\n    },()=>mark('d'),{meta:1});")
# 게임 방법
rep("    ${acc('card58',","""    ${acc('card59','🆕 v5.9 · 돌아보기 · 화면 배치 · 전투 기록 계산','지금 버전',`<ul><li><b>지운 카드가 되살아나던 문제</b>를 고쳤어요. 오래 안 연 기기가 옛 사본을 서버에 다시 쓰던 게 원인이었어요. 이제 서버에서 최신 기록을 받은 뒤에야 저장해요.</li><li><b>행동/습관 화면</b>: 칸마다 ▾ 접기, '▦ 배치'로 순서·왼쪽/오른쪽·숨기기. ⚡ 용기 칸은 처음엔 접혀 있어요.</li><li><b>📜 전투 기록</b>: 줄마다 점수 계산(카드 점수 × 횟수 × 배수 + 보너스)이 보여요.</li><li><b>할 일 점수</b>: 행동 카드와 연결 안 된 할 일은 크기·중요도로 점수가 들어가요. 상세의 크기 칸에서 '직접 정하기'로 바꿀 수 있어요.</li><li><b>돌아보기</b>(왼쪽 메뉴): 이번 주 돌아보기 · 통계 · 여정 · 몸 기록을 한곳에. 예전 메뉴로도 바꿀 수 있어요.</li><li>보드에서 칸 안 순서도 끌어서 바꿔요. 도파민 메뉴 편집도 같은 보드 모양.</li></ul>`)}
    ${acc('card58',""")
rep('</style>\n\n<header','''.lfold59>*:not(.ptitle):not(.lay59){display:none!important}
.lfold59 .ptitle{margin-bottom:0}
.lay59{display:flex;gap:4px;align-items:center;flex-wrap:wrap;padding:4px 6px;margin:-4px -4px 8px;border:1px dashed var(--line);border-radius:10px;background:var(--panel2);font-size:12px}
.lhide59{opacity:.45}
.lfb59{border:0;background:none;color:var(--muted);font-size:13px;padding:0 4px;cursor:pointer;min-width:24px}
.calc59{display:block;grid-column:1/-1;font-size:11.5px;color:var(--muted);padding-left:28px;line-height:1.5}
.calc59 b{color:var(--text);font-weight:600}
.rvtabs59{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}
.rvtabs59 a{padding:6px 12px;border:1px solid var(--line);border-radius:999px;text-decoration:none;color:var(--text);font-size:13px;background:var(--panel)}
.rvtabs59 a[aria-current="page"]{border:2px solid var(--accent);font-weight:700}
.wk59{display:grid;grid-template-columns:minmax(90px,1fr) repeat(7,26px) 52px;gap:3px 4px;align-items:center;font-size:12.5px}
.wk59 .dh{font-size:11px;color:var(--muted);text-align:center}
.wk59 .c{text-align:center;font-size:13px;line-height:22px;border-radius:6px}
.wk59 .c.y{background:color-mix(in srgb,var(--good) 22%,var(--panel));font-weight:700}
.wk59 .c.n{background:var(--panel2);color:var(--muted)}
.wk59 .nm{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cmp59{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px}
.cmp59>div{border:1px solid var(--line);border-radius:12px;padding:8px 10px;background:var(--panel)}
.cmp59 b{font-size:18px;display:block}
.px59{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-top:6px;font-size:12.5px}
.px59 input{width:64px}
.board57 .dchip .bn{display:flex;gap:3px;align-items:baseline}
.board57 .nm57{flex:1;min-width:0;text-align:left}
.cleanup59{border:2px solid var(--accent);border-radius:12px;padding:10px;margin-bottom:12px;background:var(--panel2)}
.cleanup59 label{display:flex;gap:6px;align-items:center;font-size:13px;padding:2px 0}
.cleanup59 label input{width:auto}
</style>

<header''')
# 돌아보기 화면
rep('  <section class="view" data-view="body" hidden>','  <section class="view" data-view="review" hidden><div id="review59"></div></section>\n\n  <section class="view" data-view="body" hidden>')
