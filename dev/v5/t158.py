# v13.20: 더보기 → 계정·백업 읽기 계량기에 '다시 열 때마다 ≈N' · 진단 복사에 듣는 칸 크기
from h61 import *
F=[]
def ok(c,m):print(('PASS ' if c else 'FAIL ')+m);(None if c else F.append(m))
with sync_playwright() as pw:
    b,pg=run(pw,pre="window.__hqSizes=()=>({'days>date#400':400,'tasks?status==':900,'doc:config':1});window.__hqReads=()=>3210;window.__hqRlog=()=>({log:['11/27 03:12 잠들었다 깸 41분 · 다시 읽기로 셈 203 (숨김)'],hour:{'11/27 03시':812}});")
    pg.evaluate("location.hash='#more'");pg.wait_for_timeout(600)
    t=pg.inner_text('#reads141')
    ok('3,210' in t and '≈1,301' in t,'계량기 문구: '+t.replace('\n',' '))
    d=pg.evaluate("window.diagText141()")
    ok('듣는 칸 크기' in d and 'tasks?status==' in d,'진단 복사에 듣는 칸 크기')
    ok('11/27 03시 812' in d and '잠들었다 깸 41분' in d,'진단 복사에 시간별 읽기·연결 기록')
    b2,p2=run(pw,W=390,H=800,pre="window.__hqSizes=()=>({'days>date#400':400,'tasks?status==':900});window.__hqReads=()=>3210;")
    p2.evaluate("location.hash='#more'");p2.wait_for_timeout(600)
    bb=p2.locator('#reads141').bounding_box();ok(bb and bb['x']+bb['width']<=392,'폰 폭 안: '+str(bb))
    p2.locator('#reads141').scroll_into_view_if_needed();p2.locator('#reads141').screenshot(path='/tmp/t158.png')
print('ERRS',[e for e in errs if 'vibrate' not in e][:3]);print('FAILS',len(F))
