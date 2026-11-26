# t153 (v13.16): 홈 배치(목록에 없는 칸) · 오늘 한 일 날짜 고르기 · 툴팁 · 카드 찾기 돋보기 · 추가창
import os,json
os.environ.setdefault('HQURL','file:///home/claude/habit-quest/beta/index.html')
exec(open('/home/claude/habit-quest/dev/v5/h61.py').read())
URL=os.environ.get('HQURL',URL)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra)[:300] if extra!='' else ''))
    if not c:FAILS.append(msg)
J=lambda pg,x:pg.evaluate(x)
with sync_playwright() as pw:
    b0,pg=run(pw,W=1500,H=900);closepops(pg)
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)[:160]))
    J(pg,"()=>{C.ui.home=C.ui.home.filter(x=>!['meal141','pin141','battle'].includes(x[0]));save('config');render()}");pg.wait_for_timeout(400)
    J(pg,"location.hash='home'");pg.wait_for_timeout(800)
    pg.click('#homeEditBtn');pg.wait_for_timeout(500)
    for hid in ('meal141','battle'):
        c0=J(pg,"(h)=>{const b=document.querySelector('.hblock[data-hid='+h+']');return b?b.parentElement.id:null}") if False else pg.evaluate("(h)=>{const b=document.querySelector('.hblock[data-hid='+h+']');return b&&b.offsetParent?b.parentElement.id:null}",hid)
        if not c0: print('skip',hid);continue
        pg.click('.hblock[data-hid=%s] [data-x56hcol]'%hid);pg.wait_for_timeout(400)
        c1=pg.evaluate("(h)=>{const b=document.querySelector('.hblock[data-hid='+h+']');return b?b.parentElement.id:null}",hid)
        ok(c0!=c1,'목록에 없던 칸 %s ⇢ 누르면 단이 바뀜'%hid,(c0,c1))
        ok(J(pg,"(h)=>C.ui.home.some(x=>x[0]===h)") if False else pg.evaluate("(h)=>C.ui.home.some(x=>x[0]===h)",hid),'%s 배치 목록에 등록됨'%hid)

    # 홈 오늘 한 일: 날짜 고르기 · 설명
    J(pg,"homeEditOn(false)")
    J(pg,"""()=>{const y=dayOf(dateKey(-1)),t=dayOf(dateKey(0));applyEntry(y,{kind:'free',type:'good',name:'어제일 153',area:'mind',xp:5,gold:1,cond:2,t:'10:00',id:uid()});applyEntry(t,{kind:'free',type:'good',name:'오늘일 153',area:'mind',xp:5,gold:1,cond:2,t:'11:00',id:uid(),mult:2});save(y.date);save(t.date);render()}""");pg.wait_for_timeout(500)
    J(pg,"location.hash='home'");pg.wait_for_timeout(700)
    txt=lambda:pg.evaluate("document.getElementById('homeLog').innerText")
    ok('오늘일 153' in txt() and '어제일 153' not in txt(),'홈 오늘 한 일 기본=오늘',txt())
    ok(J(pg,"!!document.querySelector('.dc142 [data-hl142]')"),'홈 오늘 한 일에 날짜 칩')
    pg.click('.dc142 [data-hl142="1"]');pg.wait_for_timeout(400)
    ok('어제일 153' in txt() and '오늘일 153' not in txt(),'어제 누르면 어제 기록',txt())
    ok(J(pg,"document.querySelector('.hblock[data-hid=todaylog] h2').textContent")=='어제 한 일','제목이 어제 한 일')
    ok(J(pg,"ui.off")==0,'ui.off(기록 쓰는 날)는 그대로 오늘')
    pg.click('.dc142 [data-hl142="2"]');pg.wait_for_timeout(300)
    ok('기록이 없어요' in txt(),'그저께는 빈 안내',txt())
    pg.evaluate("()=>{const i=document.getElementById('hl142d');i.value=dateKey(-1);i.dispatchEvent(new Event('change',{bubbles:true}))}");pg.wait_for_timeout(300)
    ok('어제일 153' in txt(),'날짜 입력으로 어제')
    pg.click('.dc142 [data-hl142="0"]');pg.wait_for_timeout(300)
    tip=J(pg,"[...document.querySelectorAll('#homeLog li')].map(l=>l.title).join('||')")
    ok('누적 ×2' in tip and '점수:' in tip,'기록 줄 설명(누적 배수·점수)',tip)

    # 카드 찾기 🔍 · 영역 추가 접기
    for W2,H2,nm in ((1200,900,'PC'),(390,800,'폰')):
        b1,p2=run(pw,W=W2,H=H2);closepops(p2)
        J(p2,"location.hash='log'");p2.wait_for_timeout(700)
        ok(not J(p2,"document.getElementById('aq141').offsetParent"),nm+' 찾기 줄은 기본 숨김(공간 0)')
        ok(J(p2,"!!document.getElementById('aq142b')"),nm+' 제목 줄에 🔍 단추')
        p2.click('#aq142b');p2.wait_for_timeout(200)
        ok(bool(J(p2,"document.getElementById('aq141').offsetParent")),nm+' 🔍 누르면 펼침')
        ok(J(p2,"document.activeElement.id")=='aq141i',nm+' 입력칸에 포커스')
        p2.keyboard.type('걷');p2.wait_for_timeout(500)
        ok(J(p2,"[...document.querySelectorAll('#actGroups .act[data-info^=\"act:\"]')].filter(r=>r.offsetParent).length")>=1,nm+' 찾으면 결과')
        p2.keyboard.press('Escape');p2.wait_for_timeout(300)
        ok(not J(p2,"document.getElementById('aq141').offsetParent") and J(p2,"ui.aq141")=='',nm+' Esc로 닫고 지움')
        f=p2.locator('#actGroups .add141f').nth(1)
        hb=f.evaluate("e=>e.getBoundingClientRect().height")
        ok(hb<34,nm+' 접힌 추가 줄이 한 줄 칩 높이',hb)
        ok(f.evaluate("e=>!e.classList.contains('open142')"),nm+' 기본 접힘')
        f.locator('.plus').click();p2.wait_for_timeout(200)
        ok(f.evaluate("e=>e.classList.contains('open142')"),nm+' ＋ 누르면 펼침')
        ok(J(p2,"document.activeElement.closest('form.add141f')!==null"),nm+' 펼치면 입력칸 포커스')
        p2.keyboard.type('추가시험 153');p2.keyboard.press('Enter');p2.wait_for_timeout(500)
        ok(J(p2,"C.actions.some(a=>a.name==='추가시험 153')"),nm+' 펼친 줄에서 카드 추가')
        b1.close() if hasattr(b1,'close') else None
    ok(not errs,'오류 없음',errs[:3])
    print('FAILS',len(FAILS),FAILS)
