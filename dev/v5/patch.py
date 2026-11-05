import re,sys
SRC='/home/claude/habit-quest/index.html'
DST='/home/claude/habit-quest/beta/index.html'
s=open(SRC,encoding='utf-8').read()
V='/home/claude/v5/'
rd=lambda f:open(V+f,encoding='utf-8').read()
def rep(old,new,count=1):
    global s
    n=s.count(old)
    if n!=count: raise SystemExit(f'expected {count} got {n}: {old[:90]!r}')
    s=s.replace(old,new)
def resub(pat,new,count=None):
    global s
    s2,n=re.subn(pat,new,s)
    if count is not None and n!=count: raise SystemExit(f'regex expected {count} got {n}: {pat}')
    s=s2
# ---------- head / css / html ----------
rep('<link rel="icon" type="image/png" href="icons/icon-192.png">','<link rel="icon" href="icons/favicon.ico" sizes="any"><link rel="icon" type="image/png" href="icons/icon-192.png">')
rep('</style>\n\n<header','\n'+rd('v5.css')+'</style>\n\n<header')
# 빠른 기록 블록 다시
i=s.index('      <div class="hblock" data-hid="quick">');j=s.index('      <div class="hblock" data-hid="sugg">')
quick='''      <div class="hblock" data-hid="quick"><div class="panel"><div class="ptitle"><h2>빠른 기록</h2><span class="row" style="gap:2px"><button class="qbtn" data-guide="once" aria-label="설명">?</button><button class="colbtn" data-collapse="quick" aria-label="접기·펴기"><svg class="ico" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></button></span></div>
        <form class="quick" id="quickForm"><input id="qName" maxlength="60" placeholder="방금 한 일 (예: 어항 청소, 친구 이사 도와줌)" enterkeyhint="done" aria-label="빠른 기록" list="qNames" autocomplete="off"><datalist id="qNames"></datalist>
          <div class="row"><select id="qType" aria-label="종류"><option value="good">▲ 좋은</option><option value="brave">⚡ 용기</option><option value="bad">▼ 나쁜</option></select><select id="qArea" aria-label="영역"></select><select id="qSize" aria-label="크기"><option value="s">작은 일 +5</option><option value="m" selected>보통 일 +10</option><option value="l">큰 일 +20</option></select>
          <span style="flex:1"></span><button type="submit" class="btn sm" name="how" value="done">✓ 했어요</button><button type="submit" class="btn sm ghost" name="how" value="todo">할 일로</button></div></form>
        <p class="tiny muted" style="margin:6px 0 0" id="qHelp">습관 이름이면 그 습관으로, 아니면 '그냥 한 일'로 기록돼요(습관 목록에 안 쌓여요).</p></div></div>
'''
s=s[:i]+quick+s[j:]
rep('      <div class="hblock" data-hid="sugg">',rd('home_blocks.html')+'      <div class="hblock" data-hid="sugg">')
rep('  <section class="view" data-view="edit" hidden>',rd('views.html')+'\n  <section class="view" data-view="edit" hidden>')
rep('<div class="toast" id="toast" role="status" aria-live="polite"></div>','<div class="toast" id="toast" role="status" aria-live="polite"></div>\n'+rd('overlays.html'))
rep('<span class="pill g num" id="hudGold" data-info="gold">0G</span>','<span class="pill g num" id="hudGold" data-info="gold">🪙0</span>')
rep('<span class="pill g num" id="gold2">0 G</span>','<span class="pill g num" id="gold2">🪙0</span>')
# 더보기: 틱틱 가져오기
rep('''    <div class="panel"><div class="ptitle"><h2>계정 · 백업</h2></div>''','''    <div class="panel"><div class="ptitle"><h2>✅ 틱틱에서 가져오기</h2></div><div id="ttBox"></div></div>
    <div class="panel"><div class="ptitle"><h2>계정 · 백업</h2></div>''')
# ---------- 기본값 ----------
rep("areas:[{id:'body',name:'몸'},{id:'mind',name:'마음'},{id:'make',name:'창작'},{id:'life',name:'생활'}],","areas:[{id:'body',name:'몸'},{id:'mind',name:'마음'},{id:'make',name:'작품'},{id:'grow',name:'성장'},{id:'life',name:'생활'},{id:'money',name:'경제'}],")
rep("{id:'g13',name:'가계부 기록',type:'good',area:'life',cond:4,gold:5,xp:6,marble:''},","{id:'g13',name:'가계부 기록',type:'good',area:'money',cond:4,gold:5,xp:6,marble:''},")
rep("{id:'g16',name:'집 정리 15분',type:'good',area:'life',cond:4,gold:2,xp:5,marble:'done:house'},","{id:'g16',name:'집 정리 15분',type:'good',area:'life',cond:4,gold:2,xp:5,marble:'done:house',dur:15},\n    SHOWER,\n    ...MONEY_ACTS,")
rep("{id:'b1',name:'과음',type:'bad',area:'body',cond:-30,gold:-40,xp:0},","{id:'b1',name:'술',type:'bad',area:'body',cond:-30,gold:-40,xp:0,opts:DRINK_OPTS},")
rep("{id:'b7',name:'충동구매',type:'bad',area:'life',cond:-10,gold:-60,xp:0},","{id:'b7',name:'충동구매',type:'bad',area:'money',cond:-10,gold:-60,xp:0,money:'1'},")
rep("const DEFAULT_CONFIG={\n  v:4,",'''const SHOWER={id:'g20',name:'샤워',type:'good',area:'body',cond:6,gold:2,xp:10,marble:'',dur:15,
  opts:[{id:'v1',name:'기상 직후',xp:14,cond:9,from:5,to:10},{id:'v2',name:'점심쯤',xp:10,cond:6,from:10,to:14},{id:'v3',name:'오후',xp:7,cond:5,from:14,to:18},{id:'v4',name:'저녁',xp:5,cond:4,from:18,to:22},{id:'v5',name:'자기 직전',xp:3,cond:3,from:22,to:30}],
  reframe:'샤워가 정신 건강에 좋은 건 알지만 귀찮지. 그런데 생각해 보면 나는 물 맞는 걸 좋아해. 씻은 뒤의 개운함과 향기도 좋고, 추운 겨울 따뜻한 물로 몸 지지는 것도 좋아. 그리고 샤워는 생각보다 금방 끝나! 하면 행복해져.'};
const DRINK_OPTS=[{id:'v1',name:'사교용 한 잔',cond:6,gold:5},{id:'v2',name:'혼술',cond:18,gold:20},{id:'v3',name:'과음',cond:30,gold:40}];
const MONEY_ACTS=[{id:'g22',name:'충동구매 참았다',type:'good',area:'money',cond:5,gold:10,xp:12,marble:'win:base',money:'1'},{id:'g23',name:'절약했다',type:'good',area:'money',cond:3,gold:5,xp:6,marble:'',money:'1'},{id:'g24',name:'무지출 데이',type:'good',area:'money',cond:6,gold:15,xp:12,marble:''},{id:'g25',name:'납부·이체 처리',type:'good',area:'money',cond:3,gold:3,xp:5,marble:''}];
const MORNING={id:'r-morning',name:'🌅 아침 루틴',xp:30,gold:20,area:'body',steps:[{id:'s1',name:'📉 체중 기록',min:1,aid:'@weigh'},{id:'s2',name:'🛏 침구 정리 · 향수 · 환기',min:5,aid:''},{id:'s3',name:'🏃 운동',min:20,aid:'g1'},{id:'s4',name:'스트레칭',min:5,aid:'g4'},{id:'s5',name:'산책',min:15,aid:''},{id:'s6',name:'🚿 샤워 & 빨래',min:15,aid:'g20'},{id:'s7',name:'✍ 일기',min:10,aid:'g5'},{id:'s8',name:'🧘 명상',min:5,aid:'g6'}]};
const DEFAULT_CONFIG={
  v:5,''')
rep("  ideas:''\n};","""  ideas:'',
  lists:[{id:'inbox',name:'📥 받은함',area:'life',folder:''}],
  routines:[MORNING],
  taskXP:{quick:5,mid:12,heavy:25,onTime:3,prio:{0:0,1:2,3:5,5:10}},
  penalty:{same:.5,chain:.25,max:3},
  chain:{xp:15,gold:10},
  gacha:{mult:1.5,rerollBase:20,giveup:30,f:{src:['task','habit'],effort:[],areas:[],lists:[],due:'today',n:3},presets:[{id:'p1',name:'⚡ 퀵 3장',f:{src:['task','habit'],effort:['quick'],areas:[],lists:[],due:'today',n:3}},{id:'p2',name:'🎲 아무거나 5장',f:{src:['task','habit','routine'],effort:[],areas:[],lists:[],due:'today',n:5}},{id:'p3',name:'🧱 큰 거 3장',f:{src:['task'],effort:['heavy'],areas:[],lists:[],due:'all',n:3}},{id:'p4',name:'💰 경제',f:{src:['task','habit'],effort:[],areas:['money'],lists:[],due:'today',n:3}}],pending:null,quest:null,hist:[]}
};""")
rep("ui:{skin:'forest',mode:'system',list:{filter:'good',group:'area',sort:'manual'},nav:['home','log','jars','stats'],home:[['profile',1],['brave',1],['quick',1],","ui:{skin:'forest',mode:'system',sheet:'smart',cal:{mode:'month',actual:true},tasks:{sel:'today',group:'auto',sort:'due'},list:{filter:'good',group:'area',sort:'manual'},nav:['home','tasks','cal','log'],home:[['profile',1],['brave',1],['today',1],['gacha',1],['quick',1],")
rep("avatar:{kind:'director',outfit:'#3f6fdc',name:'walkinglikeozu'},","avatar:{kind:'director',outfit:'#2e9a4a',name:'walkinglikeozu'},")
# 내비·아이콘
rep("const NAV_ITEMS=[['home','홈','오늘 한눈에'],['log','기록','용기·행동·식사·몸무게'],","const NAV_ITEMS=[['home','홈','오늘 한눈에'],['tasks','할 일','틱틱처럼 목록·반복·하위 할 일'],['cal','캘린더','월·주 보기, 끌어다 놓기'],['gacha','뽑기','가챠로 할 일 정하기·루틴 사냥'],['log','기록','용기·습관·식사·몸무게'],")
rep("  more:'<circle cx=\"5\" cy=\"12\" r=\"1.4\"/>","  tasks:'<path d=\"M9 6h11M9 12h11M9 18h11\"/><path d=\"M3.5 6l1.5 1.5L7.5 4.5M3.5 12l1.5 1.5 2.5-3\"/><circle cx=\"5\" cy=\"18\" r=\"1.3\"/>',\n  cal:'<rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M3 10h18M8 3v4M16 3v4\"/><rect x=\"7\" y=\"13\" width=\"3\" height=\"3\" rx=\".5\"/>',\n  gacha:'<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"3\"/><circle cx=\"9\" cy=\"9\" r=\"1.3\"/><circle cx=\"15\" cy=\"15\" r=\"1.3\"/><circle cx=\"15\" cy=\"9\" r=\"1.3\"/><circle cx=\"9\" cy=\"15\" r=\"1.3\"/>',\n  routines:'<circle cx=\"12\" cy=\"13\" r=\"8\"/><path d=\"M12 9v4l3 2M9 2h6\"/>',\n  lists:'<path d=\"M4 6h16M4 12h16M4 18h10\"/>',\n  more:'<circle cx=\"5\" cy=\"12\" r=\"1.4\"/>")
rep("const HOME_BLOCKS={profile:'캐릭터·컨디션',brave:'⚡ 용기 버튼',quick:'빠른 기록 · 할 일',","const HOME_BLOCKS={profile:'캐릭터·컨디션',brave:'⚡ 용기 버튼',today:'오늘 할 일',gacha:'🎲 뽑기 · ⏱ 사냥',quick:'빠른 기록',")
rep("const EDIT_TABS=[['screen','테마·화면'],['actions','행동'],","const EDIT_TABS=[['screen','테마·화면'],['actions','습관(행동)'],['lists','할 일 목록·보상'],['routines','⏱ 루틴'],")
rep("const VIEWS=['home','log','jars','stats','more','journey','shop','body','edit','guide'];","const VIEWS=['home','tasks','cal','gacha','log','jars','stats','more','journey','shop','body','edit','guide'];")
# 용사 아바타
rep("  ghost:{name:'유령',","  warrior:{name:'용사',eyes:[6,10],rows:['......KKKK......','....KKMMMMKK....','...KMMMMMMMMK...','..KMMMMMMMMMMK..','..KKKKKMMKKKKK..','..KHSSSMMSSSHK.M','..KHSSSSSSSSHKKM','..KHWSSSSSSWHKKM','.KKHWWWWWWWWHKKM','KRRKKWWWWWWKKSSK','KRYRKCWWWWCCKSSK','KYYYKCCWWCCCCKK.','KRYRKCCCCCCCK...','.KRRKCYYYYCCK...','..KKKCCCCCCK....','.....KDDKDDK....','.....KDDKDDK....','....KKKK.KKKK...'],pal:{H:'#c0622b',W:'#e9ecf2',R:'#8a5a2b'}},\n  ghost:{name:'유령',")
import os,tempfile
open(os.path.join(tempfile.gettempdir(),'hq-stage1.html'),'w',encoding='utf-8').write(s)
exec(open(V+'patch2.py',encoding='utf-8').read())
exec(open(V+'patch3.py',encoding='utf-8').read())
exec(open(V+'patch4.py',encoding='utf-8').read())
exec(open(V+'patch5.py',encoding='utf-8').read())
exec(open(V+'patch6.py',encoding='utf-8').read())
open(DST,'w',encoding='utf-8').write(s)
print('ok',len(s))
