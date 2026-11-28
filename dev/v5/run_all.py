#!/usr/bin/env python3
"""릴리스 점검 한 번에: 기준 시험(t69) + 화면 순회(t180) + 최근 시험 N개를 병렬로 돌리고 표 한 장으로 보여 줌.

  python3 dev/v5/run_all.py              # 기본: t69 + t180 + 최근 24개
  python3 dev/v5/run_all.py --last 8     # 최근 8개만(빠르게)
  python3 dev/v5/run_all.py t175 t180    # 고른 것만
  HQURL=file:///.../beta/index.html      # 다른 빌드를 점검(기본: 저장소의 beta/index.html)

통과 기준: 각 시험이 `FAILS 0`으로 끝남. 떨어지거나 중간에 멈추면(예외·시간 초과) 그 시험 이름과 실패 줄을 보여 줌.
(t62·t64·t65·t67은 원래 중간에 멈추는 옛 시험이라 제외 — HANDOFF '테스트' 참고)
"""
import os,re,subprocess,sys,glob,time
from concurrent.futures import ThreadPoolExecutor
HERE=os.path.dirname(os.path.abspath(__file__))
ROOT=os.path.abspath(os.path.join(HERE,'..','..'))
env=dict(os.environ)
env.setdefault('HQURL','file://'+os.path.join(ROOT,'beta','index.html'))
env.setdefault('PLAYWRIGHT_BROWSERS_PATH','/opt/pw-browsers') if os.path.isdir('/opt/pw-browsers') else None
TIMEOUT=int(env.get('HQ_TIMEOUT','420'))
WORKERS=int(env.get('HQ_WORKERS','2'))
num=lambda p:int(re.search(r'(\d+)',os.path.basename(p)).group(1))
def pick(argv):
    last=24;names=[]
    i=0
    while i<len(argv):
        if argv[i]=='--last':last=int(argv[i+1]);i+=2
        else:names.append(argv[i].replace('.py',''));i+=1
    if names:return names
    allt=sorted((p for p in glob.glob(os.path.join(HERE,'t[0-9]*.py'))),key=num)
    base=['t69','t180']
    recent=[os.path.basename(p)[:-3] for p in allt][-last:]
    return list(dict.fromkeys(base+recent))
def one(n):
    t0=time.time()
    try:
        r=subprocess.run([sys.executable,n+'.py'],cwd=HERE,env=env,capture_output=True,text=True,timeout=TIMEOUT)
        out=r.stdout+r.stderr;rc=r.returncode
    except subprocess.TimeoutExpired as e:
        out=(e.stdout or b'').decode() if isinstance(e.stdout,bytes) else (e.stdout or '');rc=-9
        out+='\n(시간 초과 %ds)'%TIMEOUT
    m=re.findall(r'^FAILS\s+(\d+)',out,re.M)
    fails=[l for l in out.splitlines() if l.startswith('FAIL ')]
    status='통과' if (m and m[-1]=='0' and rc==0) else ('실패' if m else '멈춤')
    return n,status,fails,out,time.time()-t0
def main():
    names=pick(sys.argv[1:])
    print('점검 대상 %d개 · 빌드 %s · 동시 %d개\n'%(len(names),env['HQURL'],WORKERS),flush=True)
    res=[]
    with ThreadPoolExecutor(WORKERS) as ex:
        for r in ex.map(one,names):
            res.append(r);n,st,f,_,dt=r
            print('%-6s %-4s %4.0fs %s'%(n,st,dt,('— '+'; '.join(x[5:70] for x in f[:2])) if f else ''),flush=True)
    bad=[r for r in res if r[1]!='통과']
    print('\n=== %d/%d 통과'%(len(res)-len(bad),len(res)))
    for n,st,f,out,_ in bad:
        print('\n--- %s (%s)'%(n,st));print('\n'.join(f[:6]) or '\n'.join(out.strip().splitlines()[-6:]))
    sys.exit(1 if bad else 0)
if __name__=='__main__':main()
