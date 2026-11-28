#!/usr/bin/env python3
"""릴리스 전 정적 점검(몇 초, 브라우저 없음) — 사람이 일일이 보던 '빠뜨리기 쉬운 것'을 한 번에.

  python3 dev/v5/check_release.py

보는 것: ① beta/index.html이 소스(dev/v5)를 지금 빌드한 것과 같은가(직접 고쳤거나 빌드를 빠뜨렸는지)
        ② 본 앱(루트)과 베타 파일이 같은가(index·backend·sw — 승격 빠뜨림) ③ 인라인 스크립트 문법
        ④ patch 파일이 전부 patch.py에 이어졌는가 ⑤ sw.js 버전·베타 띠 버전·HANDOFF 버전이 같은 릴리스인가
        ⑥ HANDOFF.md가 갑자기 줄지 않았는가(통째 덮어쓰기 사고) ⑦ 새 이모지(Emoji 13 이상)가 섞이지 않았는가
출력 끝 `FAILS n` — 0이면 통과. 승격(루트에 복사) 전엔 ②가 실패하는 게 정상이라 `--before-promote`로 건너뜀.
"""
import os,re,subprocess,sys,tempfile,glob
HERE=os.path.dirname(os.path.abspath(__file__));ROOT=os.path.abspath(os.path.join(HERE,'..','..'))
F=[]
def ok(c,m,x=None):
    print(('PASS ' if c else 'FAIL ')+m+((' · '+str(x)) if x is not None else ''));(None if c else F.append(m))
rd=lambda p:open(os.path.join(ROOT,p),encoding='utf-8').read()
beta=rd('beta/index.html')
# ① 빌드 재현: patch.py를 임시 파일로 돌려 beta/index.html과 비교
src=rd('dev/v5/patch.py')
tmp=tempfile.mkdtemp();out=os.path.join(tmp,'index.html')
src2=src.replace("DST='/home/claude/habit-quest/beta/index.html'","DST=%r"%out)
V='/home/claude/v5/'
if not os.path.isdir(V):
    try:os.symlink(os.path.join(ROOT,'dev','v5'),V.rstrip('/'))
    except Exception as e:print('(빌드 폴더 링크 못 만듦: %s)'%e)
r=subprocess.run([sys.executable,'-c',src2],cwd=os.path.join(ROOT,'dev','v5'),capture_output=True,text=True)
if r.returncode==0 and os.path.exists(out):
    ok(open(out,encoding='utf-8').read()==beta,'① beta/index.html이 소스를 지금 빌드한 것과 같음')
else:ok(False,'① 빌드가 돌아감',(r.stderr or r.stdout)[-200:])
# ② 승격 점검
if '--before-promote' not in sys.argv:
    for f in('index.html','backend.js','sw.js'):ok(rd(f)==rd('beta/'+f),'② 본 앱 %s = 베타 %s'%(f,f))
# ③ 문법
if subprocess.run(['which','node'],capture_output=True).returncode==0:
    for i,sc in enumerate(re.findall(r'<script(?![^>]*src)[^>]*>(.*?)</script>',beta,re.S)):
        p=os.path.join(tmp,'s%d.js'%i);open(p,'w',encoding='utf-8').write(sc)
        rr=subprocess.run(['node','--check',p],capture_output=True,text=True);ok(rr.returncode==0,'③ 인라인 스크립트 %d 문법'%i,rr.stderr[:200] if rr.returncode else None)
# ④ patch 연결
nums=sorted(int(re.search(r'patch(\d+)\.py',p).group(1)) for p in glob.glob(os.path.join(ROOT,'dev/v5/patch[0-9]*.py')))
miss=[n for n in nums if "patch%d.py'"%n not in src]
ok(not miss,'④ patch 파일이 전부 patch.py에 이어짐(마지막 patch%d)'%nums[-1],miss or None)
# ⑤ 버전
sw=rd('beta/sw.js');ver=re.search(r"PRE \+ '([^']+)'",sw).group(1)
band=re.search(r'β 베타 v([\d.]+)',beta).group(1)
ho=rd('dev/HANDOFF.md');hv=re.search(r'베타 v([\d.]+) · 본 앱 v([\d.]+)',ho)
ok(hv and hv.group(1)==band==hv.group(2),'⑤ 베타 띠·HANDOFF 맨 위 버전이 같음',(band,hv.groups() if hv else None))
ok(ver.replace('-','')[-5:-1].replace('v','')==band.replace('.','') or ('v'+band.replace('.','')) in ver,'⑤ sw.js 버전이 베타 띠와 같은 릴리스',(ver,band))
ok(("'"+ver+"'") in sw and (ver in ho),'⑤ HANDOFF에 현재 sw 버전이 적혀 있음',ver)
# ⑥ HANDOFF 크기
n=len(ho.splitlines());ok(n>=200,'⑥ HANDOFF.md 줄 수 정상(>=200)',n)
# ⑦ 새 이모지(Emoji 13+ — 사용자 기기에서 네모). 대표적인 것만
risky=['🫠','🪫','🫥','🫤','🥹','🫶','🫰','🫡','🪩','🫧','🪭','🫨','🫎','🫏','🪿','🫚','🫛','🪻','🪼','🪇','🪈']
found=[c for c in risky if c in beta];ok(not found,'⑦ 새 이모지 없음',found or None)
print('FAILS',len(F));[print(' -',m) for m in F]
sys.exit(1 if F else 0)
