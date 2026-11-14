# v9.7 시험 (t100) — D11 카드 화면: 타일 격자 · 지금 맞는 카드 · 점수 글자 한 줄
exec(open('h61.py').read())
URL=os.environ.get('HQURL',URL)
FAILS=[]
def ok(c,msg,extra=''):
    print(('PASS ' if c else 'FAIL ')+msg+(' · '+str(extra) if extra!='' else ''))
    if not c:FAILS.append(msg)
def J(pg,js):return pg.evaluate("()=>("+js+")")
SEED="""()=>{const t=new Date();const hm=String(t.getHours()).padStart(2,'0')+':'+String(t.getMinutes()).padStart(2,'0');
  for(let i=1;i<=4;i++){const k=addDays(gk76(),-i);if(!DAYS[k])DAYS[k]={date:k,entries:[]};DAYS[k].entries=DAYS[k].entries||[];
    DAYS[k].entries.push({id:'x'+i,kind:'act',aid:'g4',t:hm,name:'스트레칭',type:'good'})}
  render()}"""
with sync_playwright() as pw:
    for W,H in ((390,844),(1400,900)):
        b,pg=run(pw,W,H);closepops(pg);errs.clear();tag=f'[{W}] '
        pg.evaluate("location.hash='#log'");pg.wait_for_timeout(600)
        # ④ 점수 글자
        ok(J(pg,"document.querySelectorAll('#actGroups .mxs .s96').length")>5,tag+'점수 글자 줄(.s96)')
        ok(J(pg,"document.querySelectorAll('#actGroups .mxs .mx').length")==0,tag+'알약 칩(.mx) 없음')
        ok(J(pg,"/✨10/.test(document.querySelector('#actGroups .act[data-info=\"act:g1\"] .s96').textContent)"),tag+'운동 ✨10 글자')
        # ① 타일
        ok(J(pg,"document.getElementById('actGroups').classList.contains('t96')"),tag+'기본 타일')
        cols=J(pg,"getComputedStyle(document.querySelector('#actGroups .acts')).gridTemplateColumns.split(' ').length")
        ok(cols>=2,tag+'타일 2열 이상',cols)
        ok(not J(pg,"document.querySelector('#actGroups .act[data-info=\"act:g1\"] .meta .xp').offsetWidth"),tag+'타일에선 +n 숨김')
        # □ 누르면 기록 (실제 클릭)
        n0=J(pg,"curDay().entries.length")
        pg.click('#actGroups .acts:not(.now96) [data-act="g1"]');pg.wait_for_timeout(500)
        if not J(pg,"document.getElementById('sheet').hidden"):pg.click('#sheetC [data-sheet=ok]');pg.wait_for_timeout(400)   # v10.4: □ = 기록 창 → 했어요
        closepops(pg)
        ok(J(pg,"curDay().entries.filter(e=>e.aid==='g1').length")==1,tag+'타일 □ 클릭 = 기록')
        # 이름 누르면 설명·편집
        pg.click('#actGroups .acts:not(.now96) .act[data-info="act:g3"] .n');pg.wait_for_timeout(500)
        pg.click('#m61 button:has-text("설명")');pg.wait_for_timeout(500)   # v10.4: 카드 누르면 메뉴 → ℹ 설명·통계
        ok(J(pg,"!!document.querySelector('#pop [data-act=\"g3\"]')&&document.getElementById('pop').offsetWidth>0"),tag+'타일 이름 클릭 → 메뉴 → 설명 창 열림')
        pg.click('#scrim',position={'x':5,'y':5});pg.wait_for_timeout(300)
        ok(not J(pg,"document.getElementById('pop').offsetWidth>0&&document.getElementById('scrim').offsetWidth>0"),tag+'설명 창 닫힘')
        # ② 지금 맞는 카드
        pg.evaluate(SEED);pg.wait_for_timeout(500)
        ok(J(pg,"!!document.querySelector('#actGroups > .now96w')"),tag+'지금 맞는 카드 묶음 생김')
        ids=J(pg,"[...document.querySelectorAll('.now96 .act')].map(x=>x.dataset.info)")
        ok('act:g4' in ids,tag+'이 시간에 자주 한 스트레칭이 들어감',ids)
        ok('act:g1' not in ids,tag+'오늘 이미 한 운동은 빠짐')
        ok(not any(J(pg,f"!!(C.actions.find(a=>a.id==='{i[4:]}')||{{}}).link") for i in ids),tag+'🔗 자동 카드 빠짐')
        ok(len(ids)<=(4 if W<760 else 6),tag+'개수 제한',len(ids))
        ok(J(pg,"document.querySelector('.now96 .act[data-info=\"act:g4\"] .why96').textContent").startswith('요즘 이 시간'),tag+'이유 글자')
        pg.click('.now96 [data-act="g4"]');pg.wait_for_timeout(500)
        if not J(pg,"document.getElementById('sheet').hidden"):pg.click('#sheetC [data-sheet=ok]');pg.wait_for_timeout(400)   # v10.4: □ = 기록 창
        closepops(pg)
        ok(J(pg,"curDay().entries.some(e=>e.aid==='g4')"),tag+'지금 맞는 카드 □ = 기록')
        ok(J(pg,"![...document.querySelectorAll('.now96 .act')].some(x=>x.dataset.info==='act:g4')"),tag+'기록하면 위 묶음에서 빠짐')
        # 접기
        if J(pg,"!!document.querySelector('.now96w')"):
            pg.click('.now96w .ghead');pg.wait_for_timeout(300)
            ok(J(pg,"!document.querySelector('.now96')&&!!C.ui.collapsed.gnow96"),tag+'접기 저장')
            pg.click('.now96w .ghead');pg.wait_for_timeout(300)
        # 어제 보기·나쁜 거르기에선 없음
        pg.click('[data-off="1"]');pg.wait_for_timeout(400)
        ok(not J(pg,"!!document.querySelector('.now96w')"),tag+'어제 기록 중엔 안 보임')
        pg.click('[data-off="0"]');pg.wait_for_timeout(400)
        # 목록/타일 바꾸기
        pg.click('[data-t96]');pg.wait_for_timeout(400)
        ok(J(pg,"C.tile96===0&&!document.getElementById('actGroups').classList.contains('t96')"),tag+'목록으로 바꾸기')
        ok(J(pg,"document.querySelector('#actGroups .acts').getBoundingClientRect().width>0&&getComputedStyle(document.querySelector('#actGroups .acts')).gridTemplateColumns.split(' ').length")==1,tag+'목록은 1열')
        pg.click('[data-t96]');pg.wait_for_timeout(400)
        ok(J(pg,"C.tile96===1"),tag+'다시 타일')
        # 편집 목록도 점수 글자
        pg.evaluate("location.hash='#edit'");pg.wait_for_timeout(400)
        pg.click('[data-etab=actions]');pg.wait_for_timeout(500)
        ok(J(pg,"document.querySelectorAll('#editBody .mxs .s96').length")>5,tag+'편집 목록도 점수 글자')
        ok(J(pg,"document.querySelectorAll('#editBody .mxs .mx').length")==0,tag+'편집 목록 알약 칩 없음')
        ok(len(errs)==0,tag+'콘솔 오류 없음',errs[:3])
        b.close()
print('FAILS',len(FAILS),FAILS)
