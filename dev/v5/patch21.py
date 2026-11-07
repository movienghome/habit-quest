# ---------- v6.9 (patch.py 안에서 exec): 저장·동기화 바로잡기 · 기록 날짜 고르기·그날 기록 보너스 · 첫 화면 깜빡임 · 한글 입력 · 새 버전 새로고침 ----------
rep('<b>β 베타 v6.8</b>','<b>β 베타 v6.9</b>')
rep('</style>\n\n<header','\n'+rd('v69.css')+'</style>\n\n<header')
# 1) 새 버전이 깔려도 쓰는 중엔 새로고침하지 않음 (v5z의 __swNew69)
rep("navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!had||rl)return;rl=true;location.reload()});",
    "navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!had||rl)return;rl=true;if(window.__swNew69)window.__swNew69();else if(document.hidden)location.reload()});")
# 2) 한글 조합 중에는 입력 이벤트로 화면을 다시 그리지 않게 (스크립트 맨 앞 = 다른 모든 input 리스너보다 먼저)
rep("<script>\n/* ================= 기본값 ================= */","""<script>
/* v6.9: 한글 조합 막기 — 조합 중 input 은 다른 리스너에 안 보내고, 조합이 끝나면 한 번 보내요 (ㄷㅗㄱㅅㅓ 되던 것) */
addEventListener('input',e=>{const t=e.target;if(!t||!t.matches||!t.matches('input,textarea'))return;
  if(t.id==='pk61q'&&typeof PK61!=='undefined'&&PK61){e.stopImmediatePropagation();PK61.q=t.value;drawPk61();return}  // 고르기 창은 입력칸을 그대로 두고 목록만 바꿔서 조합 중에도 돼요
  if(e.isComposing){e.stopImmediatePropagation();t.__ime69=1;return}},true);
addEventListener('compositionend',e=>{const t=e.target;if(!t||!t.__ime69)return;t.__ime69=0;setTimeout(()=>{if(t.isConnected)t.dispatchEvent(new Event('input',{bubbles:true}))},0)},true);
/* ================= 기본값 ================= */""")
# 3) 첫 화면: 모든 모듈이 준비된 뒤에 그리기 (예전엔 중간에서 그려서 루틴이 펼쳐졌다가 접혔어요)
rep("$('backBtn').innerHTML=ic('back');$('searchBtn').innerHTML=ic('search');$('menuBtn').innerHTML=ic('menu');\nroute();boot();",
    "$('backBtn').innerHTML=ic('back');$('searchBtn').innerHTML=ic('search');$('menuBtn').innerHTML=ic('menu');")
i=s.rindex('</script>\n<script type="module" src="backend.js"></script>')
s=s[:i]+rd('v5z.js')+'\nroute();boot();\n'+s[i:]
# 4) 게임 방법
rep("    ${acc('card68',","""    ${acc('card69','🆕 v6.9 · 💾 저장 바로잡음 · 📅 지난 날 기록 · ✍ 그날 기록 보너스','지금 버전',`<ul><li><b>💾 설정이 이제 진짜로 저장돼요.</b> 그동안 카드·루틴·화면 배치 같은 설정이 서버에 못 올라가서, 열 때마다 옛 설정으로 돌아가고 기기끼리 달랐어요(지운 루틴 단계가 다시 생기던 것도 이것). 이제 저장할 때 다른 기기에서 바꾼 것과 합쳐서 올려요. 저장이 안 되면 화면 위에 <b>빨간 띠</b>가 떠요.</li><li><b>📅 지난 날 기록</b>: 행동 창·기록 고치기·루틴 체크 창 맨 위에 '언제?'(오늘·어제·그저께·📅 날짜). 방금 기록한 것도 아래 알림의 <b>📅 날짜</b>로 다른 날로 옮겨요. 기록하기 화면은 <b>📅 다른 날</b>로 아무 날이나.</li><li><b>✍ 그날 기록 보너스</b>: 그날 한 걸 그날 적으면 ✨+${otbCfg69().xp} (하루 최대 ✨${otbCfg69().max}). 나쁜 행동도 그날 솔직하게 적으면 받아요. 지난 날로 적거나 옮긴 기록엔 없어요.</li><li>한글 입력(찾기 칸 등)에서 글자가 ㄷㅗㄱ처럼 풀리던 것, 새 버전이 깔리면 쓰는 중에 갑자기 새로고침되던 것, 열 때 루틴이 펼쳐졌다 접히던 것을 고쳤어요.</li></ul>`)}
    ${acc('card68',""")

# 5) 날짜 계산 기억하기 (같은 날짜 계산을 그리기 한 번에 수만 번 했어요)
rep("const toUTC=k=>{const[y,m,d]=k.split('-').map(Number);return Date.UTC(y,m-1,d)};","const UTC69=new Map(),AD69=new Map();\nconst toUTC=k=>{let v=UTC69.get(k);if(v===undefined){const[y,m,d]=String(k).split('-').map(Number);v=Date.UTC(y,m-1,d);if(UTC69.size>5000)UTC69.clear();UTC69.set(k,v)}return v};")
rep("const addDays=(k,n)=>{const d=new Date(toUTC(k)+n*864e5);return d.getUTCFullYear()+'-'+pad(d.getUTCMonth()+1)+'-'+pad(d.getUTCDate())};","const addDays=(k,n)=>{const key=k+'|'+n;let v=AD69.get(key);if(v===undefined){const d=new Date(toUTC(k)+n*864e5);v=d.getUTCFullYear()+'-'+pad(d.getUTCMonth()+1)+'-'+pad(d.getUTCDate());if(AD69.size>20000)AD69.clear();AD69.set(key,v)}return v};")
