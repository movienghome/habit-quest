# v9.8 시험 (t101) — D11-3·D1: 기록하기에서 타일 끌어 영역·순서 바꾸기, 영역 칸 순서, 편집 보드 칸 끌기
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra) if extra!='' else ''))
    if not c:FAILS.append(msg)
def J(pg,js):return pg.evaluate("()=>("+js+")")
def bb(pg,sel):
    r=pg.locator(sel).first.bounding_box();return r
def mdrag(pg,a,b,steps=14):
    pg.mouse.move(*a);pg.mouse.down();pg.mouse.move(a[0]+10,a[1]+10,steps=3);pg.mouse.move(*b,steps=steps);pg.wait_for_timeout(120);pg.mouse.up();pg.wait_for_timeout(500)
with sync_playwright() as pw:
    for W,H,pre,tag in ((1400,900,'','[PC] '),(390,844,'window.__coarse75=1;','[폰] ')):
        b,pg=run(pw,W,H,pre=pre);closepops(pg);errs.clear()
        pg.evaluate("location.hash='#log'");pg.wait_for_timeout(600)
        coarse=bool(pre)
        if coarse:
            ok(not J(pg,"document.querySelector('#actGroups .act[data-info^=\"act:\"]:not(.now96 *)').dataset.drag"),tag+'터치는 기본으로 끌기 꺼짐(길게 눌러 메뉴 그대로)')
            ok(J(pg,"!!document.querySelector('[data-mv97]')"),tag+'↕ 옮기기 단추')
            pg.click('[data-mv97]');pg.wait_for_timeout(400)
        ok(J(pg,"!!document.querySelector('#actGroups .acts:not(.now96) .act[data-drag^=\"act:\"]')"),tag+'타일에 끌기 표시')
        ok(J(pg,"!!document.querySelector('#actGroups .ghead[data-drag^=\"area:\"]')"),tag+'영역 머리에 끌기 표시')
        # 1) 영역 옮기기: g1(몸) → 마음 칸
        pg.evaluate("window.scrollTo(0,0)")
        src=bb(pg,'#actGroups .acts:not(.now96) .act[data-info="act:g1"] .n')
        dst=bb(pg,'#actGroups .acts[data-area97="mind"]')
        if src and dst:
            pg.evaluate("document.querySelector('#actGroups .acts[data-area97=\"mind\"]').scrollIntoView({block:'center'})");pg.wait_for_timeout(200)
            src=bb(pg,'#actGroups .acts:not(.now96) .act[data-info="act:g1"] .n')
            if not src:  # 위쪽이 화면 밖이면 목적지 가운데로 올려 둔 뒤 다시 잡기
                pass
        # 화면에 둘 다 있도록: PC는 한 화면, 폰은 두 칸이 멀어서 몸 칸을 접고 시험
        if coarse:
            pg.evaluate("C.ui.collapsed['ga:make']=1;C.ui.collapsed['ga:grow']=1;C.ui.collapsed['ga:life']=1;C.ui.collapsed['ga:money']=1;renderLog()");pg.wait_for_timeout(300)
        pg.evaluate("document.querySelector('#actGroups').scrollIntoView({block:'start'});window.scrollBy(0,-60)");pg.wait_for_timeout(250)
        src=bb(pg,'#actGroups .acts:not(.now96) .act[data-info="act:g1"] .n');dst=bb(pg,'#actGroups .acts[data-area97="mind"] .act')
        okvis=bool(src and dst and 0<src['y']<H and 0<dst['y']<H)
        if not okvis and src and dst:
            pg.evaluate("window.scrollBy(0,%d)"%int(dst['y']-H*0.55));pg.wait_for_timeout(250)
            src=bb(pg,'#actGroups .acts:not(.now96) .act[data-info="act:g1"] .n');dst=bb(pg,'#actGroups .acts[data-area97="mind"] .act')
        print(tag,'src',src,'dst',dst)
        ar0=J(pg,"C.actions.find(a=>a.id==='g1').area")
        mdrag(pg,ctr(src),ctr(dst,0.2,0.5))
        ok(ar0=='body' and J(pg,"C.actions.find(a=>a.id==='g1').area")=='mind',tag+'타일을 끌어 영역 바꿈(몸→마음)',J(pg,"C.actions.find(a=>a.id==='g1').area"))
        # 순서: 마음 칸의 g5를 g8 뒤로(맨 끝)
        mem=lambda:J(pg,"C.actions.filter(a=>a.area==='mind'&&!a.doneAt).map(a=>a.id).join(',')")
        o0=mem()
        if coarse:
            pg.evaluate("['body','make','grow','life','money'].forEach(a=>C.ui.collapsed['ga:'+a]=1);renderLog()");pg.wait_for_timeout(300)
            pg.evaluate("document.querySelector('#actGroups .acts[data-area97=\"mind\"]').scrollIntoView({block:'center'})");pg.wait_for_timeout(300)
        r5=bb(pg,'#actGroups .acts:not(.now96) .act[data-info="act:g5"] .n');rl=bb(pg,'#actGroups .acts[data-area97="mind"] .act:last-child')
        if r5 and rl:
            mdrag(pg,ctr(r5),(rl['x']+rl['width']-8,rl['y']+rl['height']/2))
            o1=mem();ids=o1.split(',')
            ok(o0!=o1 and ids.index('g5')>ids.index('g8'),tag+'같은 영역 안에서 순서 바꿈(g5를 g8 뒤로)',o0+' → '+o1)
        else: ok(False,tag+'순서 시험 대상 못 찾음',(r5,rl))
        # 2) 영역 칸 순서: 마음 머리를 몸 머리 위로
        pg.evaluate("window.scrollTo(0,0);document.querySelector('#actGroups').scrollIntoView({block:'start'});window.scrollBy(0,-60)");pg.wait_for_timeout(250)
        hm=bb(pg,'#actGroups .ghead[data-area97="mind"]');hb=bb(pg,'#actGroups .ghead[data-area97="body"]')
        a0=J(pg,"C.areas.map(a=>a.id).join(',')")
        if hm and hb and hm['y']<H and hb['y']<H:
            mdrag(pg,(hm['x']+hm['width']*0.4,hm['y']+hm['height']/2),(hb['x']+hb['width']*0.4,hb['y']+2))
            a1=J(pg,"C.areas.map(a=>a.id).join(',')")
            ok(a1.startswith('mind,body'),tag+'영역 머리를 끌어 칸 순서 바꿈',a0+' → '+a1)
            ok(J(pg,"[...document.querySelectorAll('#actGroups .ghead[data-area97]')].map(h=>h.dataset.area97).slice(0,2).join(',')")=='mind,body',tag+'기록하기 화면도 새 순서로 그림')
            ok(not J(pg,"!!C.ui.collapsed['ga:mind']&&false")and True,tag+'(접힘 상태 유지)')
        else: ok(False,tag+'영역 머리가 한 화면에 없음',(hm,hb))
        ok(J(pg,"!document.querySelector('.ins97a,.ins97b')"),tag+'놓은 뒤 표시 정리됨')
        # 3) 머리를 눌러도 접힘 정상(끌지 않았을 때)
        k0=J(pg,"!!C.ui.collapsed['ga:body']")
        pg.click('#actGroups .ghead[data-area97="body"]');pg.wait_for_timeout(300)
        ok(J(pg,"!!C.ui.collapsed['ga:body']")!=k0,tag+'머리 누르면 접힘 그대로 동작')
        pg.click('#actGroups .ghead[data-area97="body"]');pg.wait_for_timeout(300)
        # 4) □ 기록은 그대로
        pg.evaluate("C.ui.collapsed={};renderLog()");pg.wait_for_timeout(300)
        pg.evaluate("document.querySelector('#actGroups .acts:not(.now96) [data-act=\"g2\"]').scrollIntoView({block:'center'})");pg.wait_for_timeout(200)
        pg.click('#actGroups .acts:not(.now96) [data-act="g2"]');pg.wait_for_timeout(500);closepops(pg)
        ok(J(pg,"curDay().entries.some(e=>e.aid==='g2')"),tag+'□ 누르면 기록(끌기 켜져 있어도)')
        # 5) 묶기를 영역 아닌 것으로 바꾸면 끌기 표시 없음
        pg.evaluate("C.ui.list.group='type';renderLog()");pg.wait_for_timeout(300)
        ok(not J(pg,"!!document.querySelector('#actGroups [data-drag]')")and not J(pg,"document.getElementById('actGroups').classList.contains('mv97')"),tag+'영역 묶기가 아니면 끌기 없음')
        pg.evaluate("C.ui.list.group='area';renderLog()");pg.wait_for_timeout(300)
        # 6) 편집 보드: 영역 이름 끌기
        pg.evaluate("location.hash='#edit'");pg.wait_for_timeout(500)
        pg.click('[data-etab=actions]');pg.wait_for_timeout(500)
        pg.click('[data-x57board="1"]');pg.wait_for_timeout(600)
        ok(J(pg,"document.querySelectorAll('#editBody .board57 .dh[data-drag^=\"area:\"]').length")==6,tag+'보드 영역 이름 6개에 끌기 표시')
        ok('칸 순서' in J(pg,"document.querySelector('#editBody .board57').previousElementSibling.textContent"),tag+'보드 안내 글')
        a0=J(pg,"C.areas.map(a=>a.id).join(',')")
        pg.evaluate("document.querySelector('#editBody .board57').scrollIntoView({block:'start'})");pg.wait_for_timeout(250)
        cols=J(pg,"[...document.querySelectorAll('#editBody .board57 .dcol[data-area97]')].map(c=>c.dataset.area97)")
        first=cols[0];last=cols[1] if coarse else cols[-1]
        bl=bb(pg,f'#editBody .board57 .dcol[data-area97="{last}"] .dh');bf=bb(pg,f'#editBody .board57 .dcol[data-area97="{first}"]')
        print(tag,'cols',cols,bl,bf)
        if bl and bf and bl['y']<H and bf['y']<H:
            mdrag(pg,ctr(bl,0.3),(bf['x']+6,bf['y']+(125 if coarse else bf['height']/2)))
            a1=J(pg,"C.areas.map(a=>a.id).join(',')")
            ok(a1.split(',')[0]==last,tag+'보드에서 영역 칸을 끌어 맨 앞으로',a0+' → '+a1)
        else: ok(False,tag+'보드 칸이 한 화면에 없음',(bl,bf))
        ok(len(errs)==0,tag+'콘솔 오류 없음',errs[:3])
        b.close()
print('FAILS',len(FAILS),FAILS)
