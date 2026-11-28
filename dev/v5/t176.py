# v13.34: 합친 카드 이름 앞 옵션 이름 빼기 · 뺀 이름으로도 같은 이름 짝 · 숨은 옛 카드 📌 정리
from h61 import *
import json
F=[]
def ok(c,m,x=None):print(('PASS ' if c else 'FAIL ')+m+(' · '+str(x) if x is not None else ''));(None if c else F.append(m))
J=lambda pg,js:json.loads(pg.evaluate(js))
for W,H in((1400,900),(390,844)):
  print('=== ',W)
  with sync_playwright() as pw:
    b,pg=run(pw,W,H);pg.wait_for_timeout(600);closepops(pg)
    pg.evaluate("""()=>{[['pr1','프로젝트 리허설'],['pr2','프로젝트 미팅'],['pr3','프로젝트 미팅']].forEach(([id,name])=>C.actions.push({id,name,type:'good',area:'grow',cond:3,gold:1,xp:5,marble:''}));
      C.actions.push({id:'sw1',name:'샤워실',type:'good',area:'mind',cond:3,gold:0,xp:2,marble:'',opts:[{id:'o1',name:'아침'},{id:'o2',name:'저녁'}]});
      C.actions.push({id:'sw2',name:'샤워실 청소',type:'good',area:'mind',cond:3,gold:0,xp:2,marble:''});save('config');render()}""")
    # ① 이름 앞 빼기 (옵션 없는 카드)
    pg.evaluate("()=>mgSheet151('pr1','pr2')");pg.wait_for_timeout(400)
    ok('같은 이름 카드 1장도 같이' in pg.inner_text('#sheetC'),'미리 보기: 같은 이름 1장도 같이')
    pg.fill('#sheetC [data-mgn151]','프로젝트');pg.click('#sheetC [data-mggo151]');pg.wait_for_timeout(500)
    r=J(pg,"()=>{const T=C.actions.find(a=>a.mg151&&a.mg151.src.includes('pr1'));return JSON.stringify({id:T.id,name:T.name,opts:T.opts.map(o=>o.name),pr3:C.actions.find(a=>a.id==='pr3').mg})}")
    print(r);ok(r['opts']==['리허설','미팅'],'옵션 이름: 리허설·미팅',r['opts']);ok(r['pr3']==r['id'],'같은 이름 미팅 카드도 같이')
    T=r['id']
    # ② 뺀 이름으로도 짝: 새 '프로젝트 미팅' 카드 → 합칠까요? · 더 합치기는 같은 옵션으로
    pg.evaluate("()=>{C.actions.push({id:'pr4',name:'프로젝트 미팅',type:'good',area:'grow',cond:3,gold:1,xp:5,marble:''});save('config');render()}")
    pg.evaluate("()=>mgSheet151('%s')"%T);pg.wait_for_timeout(400)
    ok(pg.locator('#sheetC .sg151 [data-mgsg151="pr4"]').count()==1,'합칠까요?에 프로젝트 미팅(옵션 이름 미팅)')
    pg.click('#sheetC .sg151 [data-mgsg151="pr4"]');pg.wait_for_timeout(300)
    ok('같은 이름 2장 → 한 옵션' in pg.inner_text('#sheetC'),'미리 보기: 같은 이름 → 한 옵션')
    pg.click('#sheetC [data-mggo151]');pg.wait_for_timeout(500)
    r=J(pg,"()=>{const T=C.actions.find(a=>a.id==='%s'),g=C.actions.find(a=>a.id==='pr4');return JSON.stringify([T.opts.length,g.mg,(T.opts.find(o=>o.id===g.mgo[''])||{}).name])}"%T)
    ok(r==[2,T,'미팅'],'더 합치기: 새 옵션 없이 미팅 옵션',r)
    pg.evaluate("()=>{const t=document.getElementById('toast');t&&t.classList.remove('on');closeSheet()}")
    # ③ 옵션 있는 카드: '샤워실 · 아침' → '아침', 다른 이름(샤워실 청소)은 '청소'
    pg.evaluate("()=>mgSheet151('sw1','sw2')");pg.wait_for_timeout(400)
    pg.fill('#sheetC [data-mgn151]','샤워실');pg.click('#sheetC [data-mggo151]');pg.wait_for_timeout(500)
    r=J(pg,"()=>{const T=C.actions.find(a=>a.mg151&&a.mg151.src.includes('sw1'));return JSON.stringify(T.opts.map(o=>o.name))}")
    ok(r==['아침','저녁','청소'],'샤워실 옵션: 아침·저녁·청소',r)
    # 기본 이름(A/B)이면 그대로
    pg.evaluate("()=>{C.actions.push({id:'k1',name:'가나',type:'good',area:'mind',cond:1,gold:0,xp:1,marble:''},{id:'k2',name:'다라',type:'bad',area:'mind',cond:1,gold:0,xp:0,marble:''});save('config');render()}")
    pg.evaluate("()=>mgSheet151('k1','k2')");pg.wait_for_timeout(400);pg.click('#sheetC [data-mggo151]');pg.wait_for_timeout(500)
    r=J(pg,"()=>{const T=C.actions.find(a=>a.mg151&&a.mg151.src.includes('k1'));return JSON.stringify([T.name,T.opts.map(o=>o.name)])}")
    ok(r==['가나/다라',['가나','다라']],'기본 이름이면 옵션 이름 그대로',r)
    # 풀기 → 옛 카드 돌아옴
    pg.evaluate("()=>unmerge151('%s',true)"%T);pg.wait_for_timeout(300)
    r=J(pg,"()=>JSON.stringify(['pr1','pr2','pr3','pr4'].map(id=>{const a=C.actions.find(x=>x.id===id);return !!(a&&!a.mg&&!a.doneAt)}))")
    ok(r==[True]*4,'풀기: 네 장 다 되살림',r)
    # ④ 📌에 숨은 옛 카드 → 합친 카드로·겹침 지움
    r=J(pg,"""()=>{const T=C.actions.find(a=>a.mg151&&a.mg151.src.includes('sw1'));const c=JSON.parse(JSON.stringify(C));c.pin133=['sw2',T.id,'k9','sw1'];
      const n=normConfig(c);return JSON.stringify([n.pin133,T.id])}""")
    ok(r[0]==[r[1],'k9'],'📌 숨은 옛 카드 → 합친 카드·겹침 지움',r)
    errs=pg.evaluate("()=>window.__errs||[]");ok(not errs,'오류 없음',errs)
    b.close()
print('FAILS',len(F),F)
