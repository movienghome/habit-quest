# ---------- v6.4 (patch.py 안에서 exec): 루틴 단계 자가증식 고침 · 루틴 체크로 기록 · ⏱ 루틴 목록 · 캘린더 날짜 카드 · PC 캘린더 넓게 · 보스·쫄따구 모양 · 메뉴 아이콘 ----------
rep('<b>β 베타 v6.3</b>','<b>β 베타 v6.4</b>')
rep('</style>\n\n<header','\n'+rd('v64.css')+'</style>\n\n<header')
# 할 일이 서버에서 확인됐는지 (캐시의 옛 사본만 보고 단계를 새로 만들던 원인)
rep("let tasksReady=false;","let tasksReady=false;var TSRV64=false,TSRV64r=false;")
rep("db.collection('tasks').where('status','==',0).onSnapshot(s=>tsnap('open',s),e=>{console.error(e);tasksReady=true;render()});",
    "db.collection('tasks').where('status','==',0).onSnapshot(s=>{if(!(s.metadata&&s.metadata.fromCache))TSRV64=true;tsnap('open',s)},e=>{console.error(e);tasksReady=true;render()},{meta:1});")
rep("db.collection('tasks').where('doneAt','>=',addDays(dateKey(),-60)).onSnapshot(s=>tsnap('recent',s),e=>console.error(e));",
    "db.collection('tasks').where('doneAt','>=',addDays(dateKey(),-60)).onSnapshot(s=>{if(!(s.metadata&&s.metadata.fromCache))TSRV64r=true;tsnap('recent',s)},e=>{console.error(e);TSRV64r=true},{meta:1});")
# 보스·쫄따구 모양: 이름·종류를 같이 넘김
rep("bossSVG(bs.color,ws.dead)","bossSVG(bs.color,ws.dead,bs.name)",2)
rep("bossSVG(bossOf(dateKey()).color,false)","bossSVG(bossOf(dateKey()).color,false,bossOf(dateKey()).name)")
rep("<div class=\"pic\">${bossSVG(c,false)}","<div class=\"pic\">${bossSVG(c,false,n)}")
rep("minionSVG(MINI_COL[i%MINI_COL.length],m.dead)","minionSVG(MINI_COL[i%MINI_COL.length],m.dead,m.id&&TASKS[m.id]?mobOf64(TASKS[m.id]):'task')")
rep("minionSVG(MINI_COL[i%MINI_COL.length],false)","minionSVG(MINI_COL[i%MINI_COL.length],false,MOBK64[k]||'task')")
i=s.rindex('</script>\n<script type="module" src="backend.js"></script>')
s=s[:i]+rd('v5u.js')+'\n'+s[i:]
# 게임 방법
rep("    ${acc('card63',","""    ${acc('card64','🆕 v6.4 · 루틴 체크로 기록 · ⏱ 루틴 목록 · 캘린더 날짜 카드','지금 버전',`<ul><li><b>루틴 단계가 새로고침할 때마다 늘어나던 오류</b>를 고쳤어요. 이미 늘어난 단계는 하나씩만 남기고 정리했어요(편집 → 루틴 맨 위에서 되돌릴 수 있어요).</li><li><b>루틴을 타이머 없이 기록</b>: 루틴 할 일의 ○를 누르면 단계 목록이 떠요. 한 걸 체크하고 '기록'. 다 하면 완주 보너스도 받아요. 타이머는 같은 창의 '⏱ 타이머로 하기'.</li><li>할 일 왼쪽 목록에 <b>⏱ 루틴</b>: 모든 루틴이 한곳에. 루틴을 열면 그 자리에서 언제·순서·분·보너스를 다 고쳐요.</li><li>캘린더: PC에서도 캐릭터 칸을 숨겨 넓게. <b>날짜를 누르면 그 주 아래에 카드</b>로 그날 목록이 펼쳐져요. 다시 누르거나 ×로 접어요.</li><li>보스와 쫄따구 모양이 종류마다 달라요(📖 도감).</li><li>홈 '오늘의 일퀘' 창에서 바로 요일 표를 고칠 수 있어요.</li></ul>`)}
    ${acc('card63',""")
