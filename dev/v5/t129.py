import os,json
os.environ.setdefault('HQURL','file:///home/claude/habit-quest/beta/index.html')
exec(open('/home/claude/habit-quest/dev/v5/h61.py').read())
ok=[]
def chk(n,c):
    ok.append(bool(c));print(('PASS ' if c else 'FAIL ')+n)
with sync_playwright() as pw:
    b,pg=run(pw,W=1400,H=900);closepops(pg)
    J=lambda x:pg.evaluate(x)
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    J("""(()=>{const a=newTask({title:'시나리오 쓰기'});a.rep={f:'x',n:5};a.min119=3;a.due=midKey68();a.dur=30;saveTask(a);window.__a=a.id;C.mig120=1;C.mig121=1;location.hash='cal';render()})()""");pg.wait_for_timeout(900)
    J("(()=>{C.ui.cal.mode='week';ui.calAnchor=midKey68();ui.calSel=midKey68();save('config');renderCal()})()");pg.wait_for_timeout(700)
    J("""(()=>{const t=TASKS[window.__a];const k=addDays(midKey68(),1);t.sl91={};t.sl91[k]='10:00';saveTask(t);window.__k=k;ui.calAnchor=k;ui.calSel=k;renderCal();render()})()""");pg.wait_for_timeout(800)
    J("daySheet120(window.__a,window.__k)");pg.wait_for_timeout(500)
    pg.locator('[data-d120="hg"]').click();pg.wait_for_timeout(900)
    hid=J("(()=>{const h=Object.values(TASKS).find(t=>t.hg119===window.__a);return h&&h.id})()")
    # ③ Fixed 목록
    r=json.loads(J("""(()=>{const h=TASKS['%s'];const l=C.lists.find(x=>x.id===h.list);return JSON.stringify({id:h.list,name:l&&l.name,ln:listName(h.list),inbox:taskMatches?!!taskMatches(h,'inbox'):null,fx:isFx122(h)})})()"""%hid))
    print(r)
    chk('하나 그리고 둘 일정이 실제 Fixed 목록에 있음(존재하는 목록 id)',r['name'] and 'Fixed' in r['name'] and r['id']!='fixed')
    chk('목록 이름이 기본함이 아님',r['ln']!='📥 기본함' and 'Fixed' in r['ln'])
    chk('기본함 거르기에 안 걸림',r['inbox'] is False)
    chk('정해진 일정으로 인식(isFx122)',r['fx'])
    # 옛 값 'fixed'로 만든 일정은 이주로 고쳐짐
    J("(()=>{const h=TASKS['%s'];h.list='fixed';FM122=0;render()})()"%hid);pg.wait_for_timeout(700)
    chk('옛 list:fixed 일정 이주',J("TASKS['%s'].list===fixId122()"%hid))
    # ② 점 모양: 만나기로 한 날 = s-hg, 만난 날 = s-hgd
    J("(()=>{C.ui.cal.mode='week';ui.calAnchor=window.__k;ui.calSel=window.__k;renderCal()})()");pg.wait_for_timeout(700)
    st=J("(()=>{const t=TASKS[window.__a];return [stOf121(t,window.__k,midKey68())]})()")
    chk('만나기로 한 날 상태 hg',st==['hg'])
    ds=J("(()=>{const w=document.querySelector('.wk91');if(!w)return null;return [...w.querySelectorAll('.d99')].map(e=>e.className.replace('d99 ','').trim())})()")
    print(ds)
    chk('주 칩 점에 hg(네모)가 하나 있음',ds and sum(1 for x in ds if x.startswith('s-hg'))==1)
    s=J("""(()=>{const w=document.querySelector('.wk91 .d99.s-hg');if(!w)return null;const c=getComputedStyle(w,'::before');return {r:c.borderRadius,bg:c.backgroundColor,bw:c.width}})()""")
    chk('네모 모양(둥근 모서리 작고 마름모 회전 없음)',s and not J("(()=>{const w=document.querySelector('.wk91 .d99.s-hg');return getComputedStyle(w,'::before').transform.indexOf('0.707')>=0})()"))
    J("completeTask(TASKS['%s'])"%hid);pg.wait_for_timeout(600)
    st=J("(()=>[stOf121(TASKS[window.__a],window.__k,addDays(window.__k,1))])()")
    chk('만난 날(끝냄) 상태 hgd',st==['hgd'])
    lab=J("DOT121.hgd+'|'+DOT121.hg")
    chk('점 이름 글자',lab=='하나 그리고 둘 만난 날|하나 그리고 둘 만나기로 한 날')
    # ① 끝낸 칩 점선 + 막대 희미
    J("""(()=>{C.ui.cal.mode='month';ui.calAnchor=midKey68();save('config');
      const a=newTask({title:'끝낸 하루짜리'});a.due=midKey68();saveTask(a);window.__d=a.id;
      const m=newTask({title:'며칠짜리 일정'});m.due=midKey68();m.end71=addDays(midKey68(),2);saveTask(m);window.__m=m.id;
      const u=newTask({title:'안 한 일정'});u.due=addDays(midKey68(),1);saveTask(u);
      renderCal();render()})()""");pg.wait_for_timeout(700)
    J("completeTask(TASKS[window.__d]);completeTask(TASKS[window.__m])");pg.wait_for_timeout(900);closepops(pg)
    J("renderCal()");pg.wait_for_timeout(700)
    r=J("""(()=>{const g=document.querySelector('.mgrid');const c=g&&g.querySelector('.cchip.done.d84');const bar=g&&g.querySelector('.bar83.d119');
      const f=e=>e?{os:getComputedStyle(e).outlineStyle,ow:getComputedStyle(e).outlineWidth,h:e.getBoundingClientRect().height,col:getComputedStyle(e).color,bg:getComputedStyle(e).backgroundColor}:null;
      const u=g&&[...g.querySelectorAll('.cchip:not(.done):not(.bar83)')].find(e=>e.getBoundingClientRect().height>4);
      return JSON.stringify({chip:f(c),bar:f(bar),undone:u?u.getBoundingClientRect().height:null,doneChipBg:c?getComputedStyle(c).backgroundColor:null,doneChipCol:c?getComputedStyle(c).color:null})})()""")
    r=json.loads(r);print(r)
    chk('끝낸 칩 점선',r['chip'] and r['chip']['os']=='dashed' and r['chip']['ow']=='1px')
    chk('끝낸 막대 점선',r['bar'] and r['bar']['os']=='dashed')
    import re
    def rgb(s):
        n=[float(x) for x in re.findall(r'[\d.]+',s)][:3]
        return [round(x*255) if 'srgb' in s else round(x) for x in n]
    chk('끝낸 막대 배경 = 끝낸 칩 배경(희미)',r['bar'] and r['chip'] and max(abs(a-b) for a,b in zip(rgb(r['bar']['bg']),rgb(r['chip']['bg'])))<=6)
    chk('끝낸 칩·막대 높이 = 안 한 칩',r['undone'] and abs(r['chip']['h']-r['undone'])<0.5 and abs(r['bar']['h']-r['undone'])<0.5)
    pg.screenshot(path='/tmp/t129.png')
    chk('페이지 오류 없음',not errs)
    b.close()
print('FAILS',ok.count(False))
