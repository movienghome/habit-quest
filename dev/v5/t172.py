# v13.30: F5-② 🔢 횟수 기준(o.cn) + 기록 창 이유 한 줄 + 편집 창 '기준' 칸 · 경제 칩 참음 → 이번 달 충동
from h61 import *
import json
F=[]
def ok(c,m,x=None):print(('PASS ' if c else 'FAIL ')+m+(' · '+str(x) if x is not None else ''));(None if c else F.append(m))
J=lambda pg,js:json.loads(pg.evaluate(js))
for W,H in((1400,900),(390,844)):
  print('=== ',W)
  with sync_playwright() as pw:
    b,pg=run(pw,W,H);pg.wait_for_timeout(500);closepops(pg)
    # ---------- 자동 선택: 주 2번까지 ○ · 3번째부터 ▼ ----------
    r=J(pg,"""()=>{C.actions.push({id:'c150',name:'외식',type:'bad',area:'body',cond:4,gold:5,xp:0,opts:[{id:'q1',name:'외식',tp:'mid'},{id:'q2',name:'외식 많이',tp:'bad',cn:{p:'w',n:2}}]});save('config');
      const a=C.actions.find(x=>x.id==='c150'),td=today().date,lw=addDays(weekStart(td),-1);
      const mk=k=>DAYS[k]||(DAYS[k]=normDay(k,{entries:[]}));
      for(let i=0;i<3;i++)applyEntry(mk(lw),actEntry(a,{date:lw}));   // 지난주 기록은 이번 주에 안 셈
      const v=[];for(let i=0;i<4;i++){const e=actEntry(a,{});v.push([e.vid,e.type,e.tp149]);applyEntry(today(),e)}
      return JSON.stringify({v,lw:DAYS[lw].entries.filter(e=>e.aid==='c150').map(e=>e.vid)})}""");print(r)
    ok([x[0] for x in r['v']]==['q1','q1','q2','q2'],'이번 주 1·2번째 ○, 3번째부터 ▼',r['v'])
    ok(r['v'][0][2]=='mid' and r['v'][2][1]=='bad','판정도 따라감',r['v'])
    ok(sorted(r['lw'])==['q1','q1','q2'],'지난주 안에서도 3번째는 ▼(그 주 기준)',r['lw'])
    w=J(pg,"()=>JSON.stringify(why150(C.actions.find(x=>x.id==='c150'),12))");ok(w['by']=='c' and w['k']==5,'why150: 이번 주 5번째 · 횟수 때문',w)
    # 하루 기준 · 시각이 먼저
    r=J(pg,"""()=>{C.actions.push({id:'d150',name:'커피',type:'good',area:'body',cond:2,gold:0,xp:3,opts:[{id:'k1',name:'한 잔'},{id:'k2',name:'세 잔째',tp:'bad',cn:{p:'d',n:2}},{id:'k3',name:'밤 커피',tp:'bad',from:22,to:26}]});save('config');
      const a=C.actions.find(x=>x.id==='d150');const o=[];for(let i=0;i<3;i++){const v=pickVariant(a,12);o.push(v&&v.id);applyEntry(today(),actEntry(a,{vid:v&&v.id}))}
      return JSON.stringify({o,night:(pickVariant(a,23)||{}).id})}""");print(r)
    ok(r['o']==['k1','k1','k2'],'하루 3번째부터 ▼',r['o'])
    ok(r['night']=='k3','⏰ 시각이 🔢보다 먼저',r['night'])
    # ---------- 기록 창: 실제 누르는 길 + 이유 한 줄 ----------
    pg.evaluate("()=>{location.hash='#home';render()}");pg.wait_for_timeout(400)
    pg.evaluate("()=>doAction(C.actions.find(a=>a.id==='c150'))");pg.wait_for_timeout(400)
    s=J(pg,"""()=>JSON.stringify({sel:(document.querySelector('#sheetC [data-sopt][aria-pressed="true"]')||{dataset:{}}).dataset.sopt,w:(document.querySelector('#sheetC .w70s')||{}).textContent,tag:(document.querySelector('#sheetC [data-sopt="q2"] .cn150')||{}).textContent,ok:document.querySelector('#sheetC [data-sheet="ok"]').textContent})""");print(s)
    ok(s['sel']=='q2' and '▼' in s['ok'],'창이 ▼ 옵션을 미리 고름',s)
    ok('🔢 이번 주 5번째라서' in (s['w'] or ''),'📅 언제? 줄에 이유',s['w'])
    ok(s['tag']=='🔢주3~','옵션 단추 꼬리표',s['tag'])
    hgt=pg.evaluate("()=>{const x=document.querySelector('#sheetC .w70s');return x.getBoundingClientRect().height}");print('w70s h',hgt)
    pg.click('#sheetC [data-w70="y1"]');pg.wait_for_timeout(300)   # 어제(같은 주일 수도 아닐 수도) → 다시 계산
    y=J(pg,"""()=>{const S=sheetCtx,a=S.a,w=why150(a,12,S.d69);return JSON.stringify({d:S.d69,sel:S.vid,w,txt:(document.querySelector('#sheetC .w70s')||{}).textContent})}""");print(y)
    ok((y['w']['o'] or {}).get('id','q1')==y['sel'] or (y['w']['o'] is None and y['sel']=='q1'),'날짜 바꾸면 그 날 기준으로 다시 고름',y)
    pg.click('#sheetC [data-sopt="q1"]');pg.wait_for_timeout(200)
    ok(pg.evaluate("()=>!document.querySelector('#sheetC .why150')"),'직접 고르면 이유 줄 없음')
    pg.click('#sheetC [data-sheet="ok"]');pg.wait_for_timeout(400);closepops(pg)
    e=J(pg,"()=>JSON.stringify(DAYS[addDays(today().date,-1)].entries.filter(e=>e.aid==='c150').slice(-1)[0]||null)");ok(e and e.get('vid')=='q1','직접 고른 옵션대로 기록',e and e.get('vid'))
    # 다음 ▼ 안내(아직 안 넘었을 때)
    pg.evaluate("""()=>{C.actions.push({id:'e150',name:'야식',type:'bad',area:'body',cond:4,gold:0,xp:0,opts:[{id:'z1',name:'조금',tp:'mid'},{id:'z2',name:'자주',tp:'bad',cn:{p:'m',n:3}}]});save('config');doAction(C.actions.find(a=>a.id==='e150'))}""");pg.wait_for_timeout(400)
    t=pg.evaluate("()=>(document.querySelector('#sheetC .w70s')||{}).textContent||''");ok("이번 달 1번째 · 4번째부터 '자주'" in t,'아직이면 몇 번째부터인지',t)
    pg.evaluate("()=>closeSheet()");pg.wait_for_timeout(200)
    # ---------- 편집 창: 기준 칸 ----------
    pg.evaluate("()=>{location.hash='edit';render()}");pg.wait_for_timeout(400);pg.evaluate("()=>openActionEditor('d150')");pg.wait_for_timeout(400)
    def vis(sel):
      if not pg.locator(sel).first.is_visible():
        pg.click('#sheetC [data-t95="opts"]');pg.wait_for_timeout(200)
    vis('#sheetC [data-cr150="0"]')
    L=pg.evaluate("()=>[...document.querySelectorAll('#sheetC [data-cr150]')].map(b=>b.textContent)");ok(L==['기준','🔢하루3~','⏰22–26'],'기준 칸 글자',L)
    ok(pg.evaluate("()=>[...document.querySelectorAll('#sheetC .cr150t .vrow [data-f=\"from\"]')].every(x=>!x.offsetParent)"),'옛 부터·까지 칸 숨김')
    ov=pg.evaluate("()=>[...document.querySelectorAll('#sheetC .cr150t .vrow')].every(r=>r.scrollWidth<=r.clientWidth+2)");ok(ov,'옵션 줄 가로 안 넘침')
    pg.click('#sheetC [data-cr150="0"]');pg.wait_for_timeout(200)
    ok(pg.locator('#sheetC [data-cr150p="0"]').is_visible(),'누르면 펼침')
    pg.click('#sheetC [data-cr150m="0:c"]');pg.wait_for_timeout(200)
    pg.select_option('#sheetC [data-cr150f="0:p"]','m');pg.wait_for_timeout(150)
    pg.fill('#sheetC [data-cr150f="0:n"]','4');pg.press('#sheetC [data-cr150f="0:n"]','Enter');pg.wait_for_timeout(250)
    c=J(pg,"()=>JSON.stringify(C.actions.find(a=>a.id==='d150').opts[0])");ok(c.get('cn')=={'p':'m','n':4},'🔢 저장 o.cn',c)
    ok(pg.evaluate("()=>document.querySelector('#sheetC [data-cr150=\"0\"]').textContent")=='🔢달5~','단추 글자 갱신')
    ok('5번째부터' in pg.evaluate("()=>document.querySelector('#sheetC [data-cr150p=\"0\"]').textContent"),'펼침 안 안내 갱신')
    pg.click('#sheetC [data-cr150m="0:t"]');pg.wait_for_timeout(200)
    pg.fill('#sheetC [data-cr150f="0:from"]','6');pg.press('#sheetC [data-cr150f="0:from"]','Tab');pg.wait_for_timeout(150)
    pg.fill('#sheetC [data-cr150f="0:to"]','9');pg.press('#sheetC [data-cr150f="0:to"]','Tab');pg.wait_for_timeout(250)
    c=J(pg,"()=>JSON.stringify(C.actions.find(a=>a.id==='d150').opts[0])");ok(c.get('from')==6 and c.get('to')==9 and 'cn' not in c,'⏰ 저장 · 🔢 지움',c)
    pg.click('#sheetC [data-cr150m="0:"]');pg.wait_for_timeout(200)
    c=J(pg,"()=>JSON.stringify(C.actions.find(a=>a.id==='d150').opts[0])");ok('from' not in c and 'cn' not in c,'직접 고름 = 기준 지움',c)
    ok(pg.evaluate("()=>document.querySelectorAll('#sheetC [data-tp149]').length")==3,'판정 단추(w149)와 같이 있음')
    pg.click('#sheetC [data-aedone]');pg.wait_for_timeout(300)
    # ---------- 경제 칩 '참음 n/m' → 이번 달 충동 ----------
    pg.evaluate("""()=>{const d=today();d.imp110=d.imp110||[];d.imp110.push({id:'v1',k:'f',n:'야식',t:'22:00',s:'p'},{id:'v2',k:'b',n:'옷',t:'13:00',s:'p'});save(d.date);hold110('v1');gave110('v2');location.hash='#home';render()}""");pg.wait_for_timeout(500)
    pg.click('#areaBars .ec148 .hd148');pg.wait_for_timeout(500)
    t=J(pg,"()=>JSON.stringify({h:location.hash,t:document.body.innerText.includes('이번 달 충동'),li:[...document.querySelectorAll('.ip150 .im150')].map(x=>x.textContent)})");print(t)
    ok(t['t'] and t['h']!='#shop','참음 누르면 충동 목록(상점으로 안 감)',t['h'])
    ok(any('야식' in x and '참음' in x for x in t['li']) and any('옷' in x and '참지 못함' in x for x in t['li']),'목록에 참음·참지 못함',t['li'])
    pg.evaluate("()=>closeInfo()");pg.wait_for_timeout(200)
    pg.click('#areaBars .ec148 .num');pg.wait_for_timeout(900)
    ok(pg.evaluate("()=>location.hash")=='#shop','칩 다른 곳은 그대로 골드 장부')
    print('\n'.join([x for x in errs if 'favicon' not in x][:8]));errs.clear()
    b.close()
print('FAILS',len(F),F)
