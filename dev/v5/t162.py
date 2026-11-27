# v13.24: X2-② 최근 흐름 + n일째 꼬리표 + 보정 원인별
from h61 import *
F=[]
def ok(c,m,x=None):print(('PASS ' if c else 'FAIL ')+m+(' · '+str(x) if x is not None else ''));(None if c else F.append(m))
SEED="""(()=>{const d=today(),dk=d.date;C.f1from101=addDays(dk,-10);C.f2from102=addDays(dk,-10);const k=n=>withDay69(addDays(dk,-n),()=>curDay());
  const bad=(dd,n,c)=>applyEntry(dd,{kind:'act',type:'bad',name:n,cond:c,xp:0,area:'body'});
  const good=(dd,n,c)=>applyEntry(dd,{kind:'act',type:'good',name:n,cond:c,xp:3,area:'body'});
  bad(d,'야식',-8);bad(d,'야식',-6);bad(d,'늦게 잠',-18);bad(d,'폭음',-9);bad(d,'짜증',-7);good(d,'산책',6);
  bad(k(1),'야식',-8);bad(k(1),'짜증',-4);good(k(1),'운동',10);
  bad(k(2),'야식',-8);
  good(k(4),'운동',10);
  location.hash='#home';render();return JSON.stringify({n101:new101(d),hp:[0,1,2,3,4,5,6].map(n=>{const x=DAYS[addDays(dk,-n)];return x&&hasData(x)?overallOf(x):null})})})()"""
# 0~100 한계: 아주 큰 감점
SEED2="""(()=>{const d=today();
  for(let i=0;i<8;i++)applyEntry(d,{kind:'act',type:'bad',name:'폭식'+i,cond:-20,xp:0,area:'body'});
  location.hash='#home';render();return JSON.stringify({hp:overallOf(d)})})()"""
with sync_playwright() as pw:
    for W,H in ((1400,900),(390,844)):
        b,pg=run(pw,W=W,H=H);tag=f'[{W}] '
        info=pg.evaluate("()=>"+SEED);pg.wait_for_timeout(600);print(tag,info)
        C_=lambda sel:pg.locator(sel).count()
        pg.click('details.wy146>summary');pg.wait_for_timeout(300)
        t=pg.inner_text('details.wy146 .wb146').replace('\n',' | ');print(tag,t)
        ok(C_('details.wy146 .fl146')==1 and C_('details.wy146 .fc146')==7,tag+'7일 흐름 막대 7칸')
        ok(C_('details.wy146 .fc146 i.no')>=3,tag+'기록 없는 날은 점선 ·',C_('details.wy146 .fc146 i.no'))
        ok(pg.evaluate("()=>document.querySelectorAll('details.wy146 .fc146.on').length")==1,tag+'보는 날(오늘) 한 칸만 굵게')
        ok('흐름' in t and '7일 평균' in t and '전날보다' in t,tag+'한마디(흐름·전날보다·7일 평균)')
        ok('야식 ×2 −14 (3일째)' in t,tag+'야식 3일째 꼬리표',t)
        ok('늦게 잠 −18 (' not in t and '폭음 −9 (' not in t,tag+'하루짜리 감점엔 꼬리표 없음')
        ok(pg.evaluate("()=>document.documentElement.scrollWidth<=innerWidth+1"),tag+'가로로 안 넘침')
        h=pg.evaluate("()=>document.querySelector('details.wy146>summary').getBoundingClientRect().height");ok(h<30,tag+'접힌 줄은 그대로 한 줄 높이',h)
        # 어제 칩: 어제 기준으로 7일(어제 끝) + 야식 2일째
        pg.click('[data-hl142="1"]');pg.wait_for_timeout(300)
        if C_('details.wy146')==1:
            if not pg.evaluate("()=>document.querySelector('details.wy146').open"):pg.click('details.wy146>summary');pg.wait_for_timeout(200)
            t1=pg.inner_text('details.wy146 .wb146').replace('\n',' | ');print(tag,'어제:',t1)
            ok('야식 −8 (2일째)' in t1,tag+'어제 기준 야식 2일째',t1)
        else:ok(False,tag+'어제 줄 있어야 함')
        pg.click('[data-hl142="0"]');pg.wait_for_timeout(300)
        # HP 설명 창에도 같은 부품
        pg.evaluate("()=>{lastPt={x:200,y:300};openInfo('hp')}");pg.wait_for_timeout(300)
        pt=pg.inner_text('#pop')
        ok(C_('#pop .pop146 .fl146')==1 and '3일째' in pt,tag+'HP 설명 창 같은 부품(흐름·꼬리표)')
        pg.evaluate("()=>closeInfo()");pg.wait_for_timeout(200)
        # 보정: 합이 맞는 날엔 보정 줄이 없거나 원인이 적혀 있음
        fx=pg.evaluate("()=>{const e=document.querySelector('details.wy146 .wb146 .tiny.muted');return e?e.textContent:''}")
        ok(fx=='' or '—' in fx,tag+'보정 줄은 없거나 원인이 적힘',fx)
        # 0~100 한계
        pg.evaluate("()=>"+SEED2);pg.wait_for_timeout(500)
        pg.evaluate("()=>{WY146.open=true;render()}");pg.wait_for_timeout(400)
        fx=pg.evaluate("()=>[...document.querySelectorAll('details.wy146 .wb146 .tiny.muted')].map(e=>e.textContent).join(' / ')");print(tag,'보정:',fx)
        ok('0 밑으로는 안 내려가요' in fx and '보정' in fx,tag+'0 밑 한계가 원인으로 적힘',fx)
        b.close()
print('FAILS',len(F),F)
