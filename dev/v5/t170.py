# v13.28b: 💰 경제 칩 = 이번 달 골드 ▲·▼ + 참음 n번(실제 돈 안 보임) · 누르면 골드 장부
from h61 import *
import json
F=[]
def ok(c,m,x=None):print(('PASS ' if c else 'FAIL ')+m+(' · '+str(x) if x is not None else ''));(None if c else F.append(m))
for W,H in((1400,900),(390,844)):
  with sync_playwright() as pw:
    b,pg=run(pw,W,H);pg.wait_for_timeout(500)
    pg.evaluate("""()=>{location.hash='#home';render()}""");pg.wait_for_timeout(300)
    e0=json.loads(pg.evaluate("()=>JSON.stringify(econ148())"))
    pg.evaluate("""()=>{const d=today();applyEntry(d,{kind:'act',type:'good',aid:'x',name:'일',xp:5,gold:120,cond:0});applyEntry(d,{kind:'buy',type:'bad',name:'상점 구매: 테무',xp:0,gold:-40,cond:0});
      const last=DAYS[addDays(d.date.slice(0,7)+'-01',-1)]||(DAYS[addDays(d.date.slice(0,7)+'-01',-1)]=normDay({date:addDays(d.date.slice(0,7)+'-01',-1),entries:[]}));
      d.imp110=d.imp110||[];d.imp110.push({id:'u1',k:'f',n:'야식',t:'22:00',s:'p'},{id:'u2',k:'b',n:'옷',t:'13:00',s:'p'},{id:'u3',k:'b',n:'잡화',t:'14:00',s:'p'});save(d.date);
      hold110('u1');hold110('u2');render()}""");pg.wait_for_timeout(400)
    e1=json.loads(pg.evaluate("()=>JSON.stringify(econ148())"))
    print(e0,e1)
    gi=e1['inn']-e0['inn'];go=e1['out']-e0['out']
    ok(gi>=120 and go==40,'골드 ▲ +120(참음 보너스 포함 가능) · ▼ 40',(gi,go));ok(e1['h']-e0['h']==2 and e1['hf']-e0['hf']==1 and e1['hb']-e0['hb']==1,'참음 2번(🍰1·🛍1), 열린 것은 안 셈',e1)
    c=json.loads(pg.evaluate("""()=>{const x=document.querySelectorAll('#areaBars .pc101.ec148'),m=document.querySelector('#areaBars .pc101[data-aj67="money"]');return JSON.stringify({n:x.length,t:x[0]&&x[0].textContent,tt:x[0]&&x[0].title,old:!!m,ow:$('areaBars').scrollWidth<=$('areaBars').clientWidth+1})}"""))
    print(c)
    ok(c['n']==1 and not c['old'],'경제 칩 하나(옛 레벨 칩 대신)',c);ok('참음 '+str(e1['h']) in c['t'] and '▲' in c['t'] and '▼' in c['t'],'칩에 ▲ ▼ 참음',c['t'])
    ok('원' not in c['t'] and '원' not in c['tt'].replace('실제 돈은 안 보여요',''),'실제 돈(원) 안 보임',c['tt']);ok(c['ow'],'가로 안 넘침')
    pg.click('#areaBars .ec148');pg.wait_for_timeout(900)
    r=json.loads(pg.evaluate("()=>{const d=document.getElementById('gl145');return JSON.stringify({h:location.hash,open:!!(d&&d.open)})}"))
    ok(r['h']=='#shop' and r['open'],'누르면 상점 골드 장부 펼침',r)
    b.close()
print('FAILS',len(F),F)
