# ---------- JS 수정 (patch.py 안에서 exec) ----------
# normConfig
rep("  ['avatar','recovery','dailyBonus','weekly'].forEach(k=>c[k]={...DEFAULT_CONFIG[k],...(c[k]||{})});",
    "  ['avatar','recovery','dailyBonus','weekly','taskXP','penalty','chain','gacha'].forEach(k=>c[k]={...DEFAULT_CONFIG[k],...(c[k]||{})});\n  c.taskXP.prio={...DEFAULT_CONFIG.taskXP.prio,...(c.taskXP.prio||{})};")
rep("['actions','areas','dailies','watches','shop','food','energyBase','courage','courageSizes','jars','roadmap','braveQuotes'].forEach(",
    "['actions','areas','dailies','watches','shop','food','energyBase','courage','courageSizes','jars','roadmap','braveQuotes','lists','routines'].forEach(")
rep("  c.jars.forEach((j,i)=>{delete j.color;delete j.shape;","""  if(raw&&!(raw.v>=5)){
    // v5: 경제 영역, 샤워·술 세부 옵션, 경제 행동, 한 번짜리 → 할 일
    if(!c.areas.some(a=>a.id==='money'||a.name==='경제'))c.areas.push({id:'money',name:'경제'});
    const mid=(c.areas.find(a=>a.id==='money'||a.name==='경제')||{}).id;
    const b7=c.actions.find(a=>a.id==='b7'&&/충동구매/.test(a.name));if(b7){b7.area=mid;b7.money='1'}
    const g13=c.actions.find(a=>a.id==='g13'&&/가계부/.test(a.name));if(g13)g13.area=mid;
    const b1=c.actions.find(a=>a.id==='b1'&&a.name==='과음');if(b1&&!b1.opts){b1.name='술';b1.opts=clone(DRINK_OPTS)}
    const firstBad=()=>{const i=c.actions.findIndex(a=>a.type==='bad');return i<0?c.actions.length:i};
    const sh=c.actions.find(a=>/샤워/.test(a.name)&&a.type==='good');
    if(!sh)c.actions.splice(firstBad(),0,clone(SHOWER));else{if(!sh.opts)sh.opts=clone(SHOWER.opts);if(!sh.reframe)sh.reframe=SHOWER.reframe;if(!sh.dur)sh.dur=15}
    MONEY_ACTS.forEach(m=>{if(!c.actions.some(a=>a.id===m.id||a.name===m.name)){const x=clone(m);x.area=mid;if(x.marble&&!c.jars.some(j=>j.id===x.marble.split(':')[0]))x.marble='';c.actions.splice(firstBad(),0,x)}});
    const g16=c.actions.find(a=>a.id==='g16');if(g16&&!g16.dur)g16.dur=15;
    const pend=[];
    c.actions=c.actions.filter(a=>{if(!a.once)return true;if(!a.doneAt&&a.type==='good')pend.push({title:a.name,area:a.area,list:'inbox'});return a.type==='bad'&&!a.doneAt?(delete a.once,true):false});
    c.courage=c.courage.filter(k=>{if(!k.once)return true;if(!k.doneAt)pend.push({title:k.name,brave:1,area:k.area,list:'inbox'});return false});
    c._pendingTasks=pend;c._navV5=true;c.v5news=1;
  }
  if(!c.lists.some(l=>l.id==='inbox'))c.lists.unshift({id:'inbox',name:'📥 받은함',area:'life',folder:''});
  c.jars.forEach((j,i)=>{delete j.color;delete j.shape;""")
rep("collapsed:u.collapsed&&typeof u.collapsed==='object'?u.collapsed:{}};",
    "collapsed:u.collapsed&&typeof u.collapsed==='object'?u.collapsed:{},sheet:['smart','always'].includes(u.sheet)?u.sheet:'smart',cal:{...du.cal,...(u.cal||{})},tasks:{...du.tasks,...(u.tasks||{})}};")
rep("  du.home.forEach(d=>{if(!c.ui.home.some(h=>h[0]===d[0]))c.ui.home.push(clone(d))});\n  c.v=4;",
"""  if(c._navV5){delete c._navV5;const n=c.ui.nav.filter(x=>!['home','tasks','cal'].includes(x));c.ui.nav=['home','tasks','cal',...n].slice(0,4);
    ['today','gacha'].forEach(id=>{const k=c.ui.home.findIndex(h=>h[0]===id);if(k>=0)c.ui.home.splice(k,1)});const hi=c.ui.home.findIndex(h=>h[0]==='brave');c.ui.home.splice(hi>=0?hi+1:1,0,['today',1],['gacha',1])}
  du.home.forEach(d=>{if(!c.ui.home.some(h=>h[0]===d[0]))c.ui.home.push(clone(d))});
  c.v=5;""")
# 저장: 할 일 문서
rep("function docPath(n){return n==='config'?'game/config':n==='progress'?'game/progress':'days/'+n}",
    "function docPath(n){return n==='config'?'game/config':n==='progress'?'game/progress':n.startsWith('t:')?'tasks/'+n.slice(2):'days/'+n}")
rep("function bodyOf(n){return n==='config'?C:n==='progress'?P:DAYS[n]}",
    "function bodyOf(n){return n==='config'?C:n==='progress'?P:n.startsWith('t:')?TASKS[n.slice(2)]:n==='local'?null:DAYS[n]}")
rep("try{localStorage.setItem(LKEY,JSON.stringify({C,P,DAYS}))}catch(e){}","try{localStorage.setItem(LKEY,JSON.stringify({C,P,DAYS,TASKS}))}catch(e){}")
rep("    if(rawCfgV!==null&&rawCfgV<4){save('config');}",
"""    if(rawCfgV!==null&&rawCfgV<5){save('config');}
    if(C._pendingTasks){const ps=C._pendingTasks;delete C._pendingTasks;ps.forEach(p=>saveTask(newTask({...p,due:dateKey()})));save('config');if(ps.length)void 0&&later(()=>popup('할 일로 옮겼어요','✅',`한 번짜리 행동·용기 ${ps.length}개를 '할 일'로 옮겼어요.<br><span class="muted">습관 목록에는 이제 반복하는 것만 남아요.</span>`,'v5'))}
    if(C.v5news){delete C.v5news;save('config');void 0&&later(()=>popup('새 버전','🛡️','<b>할 일 · 캘린더 · 🎲 뽑기 · ⏱ 사냥</b>이 생겼어요.<br><span class="muted">틱틱 기록은 더보기 → 틱틱에서 가져오기. 처음 안내에서 한눈에 볼 수 있어요.</span>','v5'))}
    runLater();""")
rep("rawCfgV=4;rawProgHasMarbles=true;","rawCfgV=5;rawProgHasMarbles=true;")
rep("""      mark('d');render();
    },()=>mark('d'));""","""      mark('d');render();
    },()=>mark('d'));
    const tsnap=(kind,s)=>{const now=new Set();s.docs.forEach(doc=>{now.add(doc.id);if(!dirty.has('t:'+doc.id)){const d=doc.data();d.id=doc.id;TASKS[doc.id]=d}});
      const other=kind==='open'?tSets.recent:tSets.open;tSets[kind].forEach(id=>{if(!now.has(id)&&!other.has(id)&&!dirty.has('t:'+id))delete TASKS[id]});tSets[kind]=now;if(kind==='open')tasksReady=true;render()};
    db.collection('tasks').where('status','==',0).onSnapshot(s=>tsnap('open',s),e=>{console.error(e);tasksReady=true;render()});
    db.collection('tasks').where('doneAt','>=',addDays(dateKey(),-60)).onSnapshot(s=>tsnap('recent',s),e=>console.error(e));""")
rep("for(const k in (s.DAYS||{}))DAYS[k]=normDay(k,s.DAYS[k])}}catch(e){}","for(const k in (s.DAYS||{}))DAYS[k]=normDay(k,s.DAYS[k]);TASKS=s.TASKS||{}}}catch(e){}\n    tasksReady=true;")
# 효과 적용 분리
i=s.index('function applyEntry(day,e){');j=s.index('function syncQuests(day){')
s=s[:i]+"""function effApply(e){
  if((e.gold||0)<0)e.gold=-Math.min(P.gold,-e.gold);
  P.gold+=e.gold||0;P.xp+=e.xp||0;
  if(e.jar){const arr=(P.marbles[e.jar]=P.marbles[e.jar]||[]);for(let i=0;i<(e.mn||1);i++)arr.push(e.mt||fallbackType(e.jar))}
  if(isBrave(e))P.courage+=e.pts||1;
}
function effRemove(e){
  P.gold=Math.max(0,P.gold-(e.gold||0));P.xp=Math.max(0,P.xp-(e.xp||0));
  if(e.jar&&P.marbles[e.jar]){const arr=P.marbles[e.jar];for(let k=0;k<(e.mn||1)&&arr.length;k++){const i=arr.lastIndexOf(e.mt||fallbackType(e.jar));arr.splice(i>=0?i:arr.length-1,1)}}
  if(isBrave(e))P.courage=Math.max(0,P.courage-(e.pts||1));
}
function applyEntry(day,e){
  e.id=e.id||uid();e.t=e.t||stamp();if(ui.off&&day.date!==dateKey())e.late=true;
  effApply(e);day.entries.unshift(e);return e;
}
function unapplyEntry(day,e){
  effRemove(e);if(e.kind==='weigh')day.weight=null;
  day.entries=day.entries.filter(x=>x.id!==e.id);
}
"""+s[j:]
# 예전 doAction 지우기 (v5에서 새로 정의)
i=s.index('function doAction(a){');j=s.index('function doBrave(k,note){')
s=s[:i]+s[j:]
rep("  syncQuests(day);syncWeek(day,touched);","  syncChain(day);syncQuests(day);syncWeek(day,touched);")
rep("  render();toast(src&&src.once?'되돌렸어요. 할 일 목록에 다시 생겼어요':'되돌렸어요');",
    "  if(e.tid)undoTaskFrom(e);render();toast(e.tid?'되돌렸어요. 할 일이 다시 열렸어요':src&&src.once?'되돌렸어요. 할 일 목록에 다시 생겼어요':'되돌렸어요');")
# 렌더
rep("$('hudGold').textContent=P.gold.toLocaleString()+'G';","$('hudGold').textContent='🪙'+P.gold.toLocaleString();")
rep("  renderLog();renderJars();renderStats();","  renderHomeV5();renderTasks();renderCal();renderGacha();\n  if(ready&&ui.chainDay!==dateKey()){ui.chainDay=dateKey();const y=addDays(dateKey(),-1);if(DAYS[y]&&isClean(DAYS[y])&&badDay(addDays(y,-1))&&!today().entries.some(e=>e.kind==='chain'))setTimeout(()=>{const k=ui.off;ui.off=0;commit(()=>{});ui.off=k},0)}\n  renderLog();renderJars();renderStats();")
resub(r"(?s)  // 빠른 기록·할 일\n  \{const qa=\$\('qArea'\);.*?남은 할 일이 없어요\.</div>'\}\n",
"""  {const qa=$('qArea');if(document.activeElement!==qa){const v=qa.value;qa.innerHTML=C.areas.map(a=>`<option value="${a.id}">${esc(a.name)}</option>`).join('');if(v)qa.value=v}
   const ty=$('qType').value;qa.hidden=ty==='brave';$('qSize').hidden=ty!=='good';
   const dl=(ty==='brave'?C.courage:C.actions.filter(a=>a.type===(ty==='bad'?'bad':'good'))).map(a=>`<option value="${esc(a.name)}">`).join('');if($('qNames').innerHTML!==dl)$('qNames').innerHTML=dl}
""",1)
# 추천에 할 일
rep("  const out=[],seen=new Set(),day=today(),add=(o)=>{if(seen.has(o.key)||out.length>=3)return;seen.add(o.key);out.push(o)};",
"""  const out=[],seen=new Set(),day=today(),add=(o)=>{if(seen.has(o.key)||out.length>=3)return;seen.add(o.key);out.push(o)};
  {const tdK=dateKey(),nm=nowMinutes();openTasks().filter(x=>x.due===tdK&&x.time&&toMin(x.time)>=nm-30&&toMin(x.time)<=nm+120).sort((a,b)=>a.time.localeCompare(b.time)).slice(0,1).forEach(x=>add({key:'t'+x.id,ic:'⏰',label:x.title,why:`${x.time} 예정 · +${taskBase(x).xp} XP`,task:x.id}));
   const gq=(C.gacha||{}).quest;if(gq&&gq.src==='task'&&TASKS[gq.id])add({key:'gq',ic:'🎲',label:gq.name,why:`가챠 퀘스트 · XP ×${C.gacha.mult||1.5}`,task:gq.id});}""")
rep("""  $('sugg').innerHTML=sg.length?sg.map(s=>{if(!s.act)return""","""  $('sugg').innerHTML=sg.length?sg.map(s=>{if(s.task)return `<div class="sug" data-ctask="${s.task}" tabindex="0" role="button"><button class="tchk" data-tdone="${s.task}" aria-label="${esc(s.label)} 완료"></button><span><b>${s.ic} ${esc(s.label)}</b><span class="why">${esc(s.why)}</span></span><span class="go">자세히</span></div>`;if(!s.act)return""")
# 경보
rep("  const order={warn:0,brave:1,good:2,info:3};out.sort((a,b)=>order[a[0]]-order[b[0]]);",
"""  {const lateN=openTasks().filter(x=>x.due&&x.due<t).length;if(lateN)out.push(['warn','⏰',`지난 할 일 ${lateN}개. 캘린더에서 오늘로 끌어오거나, 🎲 뽑기로 하나 해치워요.`]);
   openTasks().filter(x=>(x.skull||0)>=3).slice(0,2).forEach(x=>out.push(['warn','☠',`'${x.title}' 삼진아웃(3번 미룸). 쪼개거나, 버리거나, 오늘 해치워요.`]));
   const bc=badChainNow();if(bc>=2)out.push(['warn','⛓',`나쁜 날이 ${bc}일째 이어져요. 페널티가 점점 커져요. 오늘 하루 깨끗하면 내일 '흐름 끊기' 보상!`]);}
  const order={warn:0,brave:1,good:2,info:3};out.sort((a,b)=>order[a[0]]-order[b[0]]);""")
# 기록 줄
i=s.index('function logRow(date,e){');j=s.index('function renderLog(){')
s=s[:i]+r"""function logRow(date,e){
  const j=e.jar?C.jars.find(x=>x.id===e.jar):null,t=j?typeOf(j,e.mt):null;
  const cls=e.kind==='buy'?'buy':isBrave(e)?'brave':(e.type==='bad'?'bad':'good');
  const mk=isBrave(e)?'⚡':e.kind==='jar'?mGlyph(t):e.kind==='buy'?'◇':e.kind==='quest'?'☑':e.kind==='chest'?'🎁':e.kind==='boss'?'⚔️':e.kind==='wbrave'?'🔥':e.kind==='badge'?'🏅':e.kind==='weigh'?'⚖':e.kind==='task'?'✓':e.kind==='free'?'•':e.kind==='routine'?'⏱':e.kind==='chain'?'⛓':e.type==='bad'?'▼':'▲';
  const ar=C.areas.find(a=>a.id===e.area);
  const fx=[e.cond?(ar?ar.name:'')+' '+(e.cond>0?'+':'−')+Math.abs(e.cond):'',e.gold?gtx(e.gold):'',e.xp?'XP +'+e.xp:''].filter(Boolean).join(' ');
  const q=e.kind==='quest'?C.dailies.find(x=>x.id===e.qid):null;
  const auto=['chest','boss','wbrave','badge','chain'].includes(e.kind)||(q&&q.action);
  const tg=[e.n>1?'×'+e.n:'',e.mult?'누적 ×'+e.mult:'',e.spd?'⚔ '+e.spd:'',e.gq?'🎲 가챠':'',e.dur?'⏱'+e.dur+'분':'',e.amt?'₩'+(+e.amt).toLocaleString():''].filter(Boolean);
  const extra=(e.kind!=='jar'&&t?' '+mGlyph(t)+((e.mn||1)>1?'×'+e.mn:''):'')+(tg.length?` <span class="tiny muted">${esc(tg.join(' · '))}</span>`:'')+(e.late?' <span class="tiny muted">(나중에 적음)</span>':'');
  const editable=!auto&&e.kind!=='buy'&&e.kind!=='weigh';
  return `<li ${editable?`data-entry="${date}|${e.id}" style="cursor:pointer" title="눌러서 고치기"`:''}><span class="num muted">${esc(e.t)}</span><span class="mk ${cls}">${mk}</span><span>${esc(e.name)}${extra}${e.note?`<span class="note">${esc(e.note)}</span>`:''}</span><span class="num muted tiny">${fx}</span>${auto?'<span title="연결된 기록을 지우면 같이 빠져요" class="tiny muted" style="text-align:center">자동</span>':`<button class="x" data-rm="${e.id}" data-date="${date}" aria-label="${esc(e.name)} 되돌리기">×</button>`}</li>`;
}
"""+s[j:]
rep("<p class=\"help\">누른 행동, 용기, 구슬, 일퀘, 구매가 시간순으로 모여요. × 누르면 효과까지 되돌려요.</p>","<p class=\"help\">누른 행동, 할 일, 용기, 구슬, 일퀘, 구매가 시간순으로 모여요. <b>줄을 누르면 고쳐요</b>(횟수·세부 옵션·구슬·메모·시각). × 누르면 효과까지 되돌려요.</p>")
# 통계 타일
rep("""  let good=0,bad=0,brave=0,marb=0,chest=0,clean=0;const withData=days.filter(hasData);
  days.forEach(d=>{(d.entries||[]).forEach(e=>{if(e.kind==='act'&&e.type==='good')good++;""","""  let good=0,bad=0,brave=0,marb=0,chest=0,clean=0,tdone=0,saved=0,spent=0;const withData=days.filter(hasData);
  days.forEach(d=>{(d.entries||[]).forEach(e=>{if(e.tid)tdone++;if(e.amt){if(e.type==='bad')spent+=+e.amt;else saved+=+e.amt}if(e.kind==='act'&&e.type==='good')good++;""")
rep("""['🎁 일퀘 상자',chest+'개'],['평균 컨디션',avgC]].map(([k,v],i)=>`<div class="tile" data-info="stat:${['days','brave','good','bad','clean','marble','chest','avg'][i]}">""","""['🎁 일퀘 상자',chest+'개'],['평균 컨디션',avgC],['✓ 끝낸 할 일',tdone+'개'],['💰 아낀 돈 / 쓴 돈','₩'+saved.toLocaleString()+' / '+spent.toLocaleString()]].map(([k,v],i)=>`<div class="tile" data-info="stat:${['days','brave','good','bad','clean','marble','chest','avg','task','money'][i]}">""")
rep("avg:['평균 컨디션',","task:['✓ 끝낸 할 일','할 일을 끝낸 횟수예요. 반복 할 일은 끝낼 때마다 하나씩 세요.'],money:['💰 아낀 돈 / 쓴 돈','경제 행동에 금액을 적은 것만 모여요. 충동구매 참았다·절약했다는 아낀 돈, 충동구매는 쓴 돈이에요.'],avg:['평균 컨디션',")
# 편집 탭
resub(r"(?s)  \}else if\(ui\.edit==='actions'\)\{.*?\n  \}else if\(ui\.edit==='courage'\)\{",
"  }else if(ui.edit==='actions'){h=actionsEditHTML();\n  }else if(ui.edit==='routines'){h=routinesEditHTML();\n  }else if(ui.edit==='lists'){h=listsEditHTML();\n  }else if(ui.edit==='courage'){",1)
rep("    save('config');render();\n    const f=document.getElementById(`e-${col}-${id}-name`)","    save('config');render();\n    if(col==='actions'){openActionEditor(id);return}\n    const f=document.getElementById(`e-${col}-${id}-name`)")
# 행동 설명 창
rep(""",['once','반복','sel',[['1','한 번'],['','반복']]]])+`<p class="tiny muted">${x.once?'한 번짜리: 체크하면 기록되고 목록에서 빠져요.':'반복: 체크해도 목록에 남아서 계속 기록할 수 있어요.'}</p>`+btns(x.doneAt?'':`<button class="btn sm" data-act="${x.id}">지금 기록</button>`,""",
""",])+(x.reframe?`<div class="reframe" style="font-size:13.5px"><b>💭 다르게 보기</b>${esc(x.reframe)}</div>`:'')+(x.opts&&x.opts.length?`<p class="tiny muted">세부 옵션: ${esc(x.opts.map(o=>o.name).join(' / '))}</p>`:'')+btns(x.doneAt?'':`<button class="btn sm" data-act="${x.id}">지금 기록</button>`,`<button class="btn ghost sm" data-aedit="${x.id}">옵션·문구·전체 편집</button>`,""")
# 빠른 기록 제출
i=s.index("$('quickForm').addEventListener('submit',e=>{");j=s.index("$('wishForm')")
s=s[:i]+"""$('quickForm').addEventListener('submit',e=>{e.preventDefault();if(!guard())return;
  const name=$('qName').value.trim();if(!name){$('qName').focus();toast('무엇을 했는지 적어주세요');return}
  const how=(e.submitter&&e.submitter.value)||'done',type=$('qType').value,area=$('qArea').value||C.areas[0].id;
  ui.off=0;
  if(how==='todo'){addTaskFrom((type==='brave'?'⚡':'')+name,{due:dateKey()})}
  else if(type==='brave'){const k=C.courage.find(x=>x.name===name);if(k)doBrave(k);else{const s=C.courageSizes.find(x=>x.id==='m')||C.courageSizes[0];doBrave({id:'free',name:s.name,xp:s.xp,gold:s.gold,pts:s.pts,area:'mind',cond:4,marble:s.marble},name)}}
  else{const a=C.actions.find(x=>x.type===type&&x.name===name);if(a)doAction(a);
    else if(type==='bad'){const na=newAction(uid(),name,'bad',area,'');C.actions.push(na);save('config');doAction(na);toast('나쁜 행동 목록에 추가했어요. 점수는 편집에서 바꿔요')}
    else doFree(name,$('qSize').value,area)}
  $('qName').value='';$('qName').blur();
});
"""+s[j:]
rep("  if(t.id==='qType'){$('qArea').hidden=t.value==='brave';return}","  if(t.id==='qType'){render();return}")
# 기록 탭 추가 폼: 한 번이면 할 일로
rep('<select id="addActOnce" aria-label="반복"><option value="1">한 번</option><option value="">반복</option></select>','<select id="addActOnce" aria-label="반복"><option value="">반복 (습관)</option><option value="1">한 번 → 할 일</option></select>')
rep('<select id="addCourageOnce" aria-label="반복"><option value="1">한 번</option><option value="">반복</option></select>','<select id="addCourageOnce" aria-label="반복"><option value="">반복</option><option value="1">한 번 → 할 일</option></select>')
rep("  if(k==='act'){const filt=C.ui.list.filter,","  if(k==='act'&&$('addActOnce').value){addTaskFrom(name,{due:dateKey()});inp.value='';inp.blur();return}\n  if(k==='courage'&&$('addCourageOnce').value){addTaskFrom('⚡'+name,{due:dateKey()});inp.value='';inp.blur();return}\n  if(k==='act'){const filt=C.ui.list.filter,")
# 더보기
rep("  if(!$('acctBox').contains(document.activeElement))$('acctBox').innerHTML=acctBoxHTML();","  if(!$('acctBox').contains(document.activeElement))$('acctBox').innerHTML=acctBoxHTML();\n  if(!$('ttBox').contains(document.activeElement))$('ttBox').innerHTML=importBoxHTML();")
rep("$('shopList').innerHTML","$('gold2').textContent='🪙'+P.gold.toLocaleString();$('shopList').innerHTML")
rep("$('gold2').textContent=P.gold.toLocaleString()+' G';","")
# 검색
rep("  C.shop.forEach(x=>add(x.price>0?'상점':'보상함',","  openTasks().forEach(t=>add('할 일',t.title,(t.due?dueLabel(t.due)+(t.time?' '+t.time:''):'날짜 없음')+' · '+listName(t.list),()=>openTaskSheet(t.id),(t.tags||[]).join(' ')));\n  (C.routines||[]).forEach(r=>add('루틴',r.name,r.steps.length+'단계 · 누르면 시작',()=>startRun({routine:r})));\n  [['gacha','뽑기(가챠)','필터 걸고 3·5장 뽑기'],['cal','캘린더','끌어다 놓기'],['tasks','할 일','틱틱처럼']].forEach(([id,t,d])=>add('화면',t,d,()=>location.hash=id,'가챠 todo ticktick'));\n  C.shop.forEach(x=>add(x.price>0?'상점':'보상함',")
rep("[['once','한 번 · 반복','할 일, 일회성, 반복 설정, 빠른 기록'],","[['tasks','할 일 · 캘린더','틱틱, 반복, 하위 할 일, 삼진아웃'],['gacha','뽑기 · 사냥 · 루틴','가챠, 타이머, 스피드 보너스, 5분만'],['penalty','세부 옵션 · 누적 페널티','샤워 시간대, 술, 흐름 끊기, 경제'],['once','습관 · 할 일 · 그냥 한 일','일회성, 반복, 빠른 기록'],")
# 안내
rep("    ${acc('once','한 번 · 반복','할 일과 습관',","""    ${acc('tasks','✅ 할 일 · 캘린더','틱틱 대신',`<ul><li><b>할 일</b> 탭은 틱틱처럼 써요: 목록·폴더·태그·중요도(!·!!·!!!)·반복·하위 할 일·메모.</li><li>빠른 추가에 그냥 말하듯 적어요: <b>내일 3시 씨네스트 30분 #퀵 !! ^Errands 매주 화</b> → 날짜·시각·걸리는 시간·태그·중요도·목록·반복이 알아서 들어가요. <b>⚡</b>를 앞에 붙이면 용기 할 일.</li><li>끝내면 크기(⚡퀵 +${C.taskXP.quick} · 🕓보통 +${C.taskXP.mid} · 🧱무거움 +${C.taskXP.heavy})와 중요도만큼 XP. 제때 끝내면 +${C.taskXP.onTime}. 습관과 연결된 할 일은 그 습관 점수로.</li><li><b>반복</b>: 매일·평일·매주 요일·격주·매월 날짜/몇째 주 요일·매년·<b>주 N회</b>(요일 상관없이 한 주에 N번)·완료한 날부터 N일마다.</li><li><b>☠ 삼진아웃</b>: 오늘이거나 지난 할 일을 더 뒤로 미루면 해골이 하나씩. 3개면 쪼개거나, 버리거나, 가챠로 해치워요.</li><li><b>캘린더</b>: 월·주·3일·일정 보기. 할 일·습관·루틴을 날짜나 시간에 끌어다 놓아요(폰은 꾹 누른 채로). 블록 아래를 끌면 길이가 바뀌어요. 주 보기 오른쪽 얇은 줄은 <b>실제로 한 시간</b>이라 계획과 비교돼요.</li><li>틱틱 기록은 더보기 → 틱틱에서 가져오기.</li></ul>`)}
    ${acc('gacha','🎲 뽑기 · ⏱ 사냥','뭘 할지 모를 때',`<ul><li>필터(할 일/습관/루틴, 크기, 영역, 목록)를 걸고 1·3·5·7장을 뽑아요. 오래 안 한 것·지난 것·중요한 게 더 잘 나와요.</li><li><b>나온 것 중 하나는 반드시</b> 골라요. 고른 건 가챠 퀘스트가 되고 끝내면 XP ×${C.gacha.mult||1.5}. 정 싫으면 골드를 내고 다시 뽑아요(오늘 할 때마다 비싸져요).</li><li><b>⏱ 사냥</b>: 할 일·습관을 타이머로 해요. 목표 시간의 절반 안에 끝내면 번개 처치, 80% 안이면 빠른 처치, 시간 안이면 제시간 처치 보너스. 늦어도 기본 보상은 그대로.</li><li><b>루틴</b>: 단계마다 목표 시간이 있는 연속 사냥(아침 루틴 등). 단계에 습관을 연결하면 같이 기록돼요.</li><li><b>⏳ 딱 5분만</b>: 시작이 제일 어려우니까. 5분 하고 끝내도 +5 XP.</li></ul>`)}
    ${acc('penalty','세부 옵션 · 누적 페널티 · 경제','같은 일도 어떻게 했는지에 따라',`<ul><li>행동마다 <b>세부 옵션</b>을 둘 수 있어요. 예: 샤워(기상 직후 +14 … 자기 직전 +3), 술(사교용 한 잔 … 과음). 시간대를 정해두면 그 시간에 자동으로 골라져요. 늦었어도 최소한의 점수는 챙겨요.</li><li><b>몇 번</b>: 어항 세 개를 다 청소했으면 ×3. 구슬도 세 개.</li><li><b>누적 페널티</b>: 같은 나쁜 행동이 7일 안에 또 나오면 +${C.penalty.same}배, 나쁜 날이 이어진 하루마다 +${C.penalty.chain}배(최대 ×${C.penalty.max}).</li><li><b>흐름 끊기</b>: 나쁜 날이 이어지다 하루를 깨끗하게 보내면 다음 날 연쇄 길이만큼 보상.</li><li><b>경제 영역</b>: 가계부 확인, 충동구매 참음, 절약, 무지출 데이, 납부 처리. 금액을 적으면 통계에 아낀 돈·쓴 돈이 쌓여요.</li><li><b>💭 다르게 보기</b>: 하기 싫을 때 읽을 문구를 행동·할 일마다 적어두세요. 💭를 누르면 크게 보이고 바로 5분 타이머로 이어져요.</li></ul>`)}
    ${acc('once','습관 · 할 일 · 그냥 한 일','어디에 적을까',""")
rep("`<ul><li><b>한 번</b>: 어항 정리, 면접 보기처럼 한 번 하고 끝나는 일. 체크하면 기록되고 목록에서 빠져요. 되돌리면 다시 생겨요.</li><li><b>반복</b>: 운동, 일기처럼 계속하는 습관. 체크해도 목록에 남아요.</li><li>홈의 <b>빠른 기록</b>에 적고 Enter를 누르면 바로 '했어요'로 기록돼요. 나중에 할 일이면 '할 일로'를 눌러요.</li><li>행동·용기 이름을 누르면 언제든 한 번 ↔ 반복을 바꿀 수 있어요.</li></ul>`",
    "`<ul><li><b>습관(행동)</b>: 운동·일기·샤워처럼 계속하는 것. 기록 탭에 늘 있어요.</li><li><b>할 일</b>: 날짜가 있거나 끝나면 사라지는 일. 할 일 탭·캘린더에 있어요.</li><li><b>그냥 한 일</b>: 어쩌다 한 좋은 일. 홈 '빠른 기록'에 적고 Enter → 크기(작은·보통·큰)만큼 XP, 목록엔 안 쌓여요.</li><li>잘못 기록했으면 '오늘 한 일'에서 줄을 눌러 고쳐요. 끝낸 직후 아래에 뜨는 ×2·구슬 버튼으로 바로 바꿔도 돼요.</li></ul>`")
rep("  ['⚡','용기가 가장 커요',","  ['✅','할 일 · 캘린더 · 뽑기','틱틱처럼 할 일을 적고 캘린더로 끌어다 놓아요. 끝내면 XP. 뭘 할지 모르겠으면 <b>🎲 뽑기</b>, 시작이 어려우면 <b>⏳ 딱 5분만</b>.'],\n  ['⚡','용기가 가장 커요',")
# 라우트
rep("  renderNav();\n  if(v!=='log'&&ui.off){ui.off=0;render()}","  renderNav();\n  if(v!=='log'&&ui.off){ui.off=0;render()}\n  else if(['tasks','cal','gacha'].includes(v)){ui.calKeepScroll=false;render()}\n  closeSheet();")
# 골드 표시
s=s.replace("'+'+b.gold+'G'","'+🪙'+b.gold").replace("(it.price-P.gold)+'G 부족'","'🪙'+(it.price-P.gold)+' 부족'").replace("'🪙 골드 '+P.gold+'G'","'🪙 골드 '+P.gold").replace("x.price>0?x.price+'G'","x.price>0?'🪙'+x.price").replace("'-'+it.price+'G'","'−🪙'+it.price")
s=re.sub(r"\+\$\{([^{}]+)\}G(?![A-Za-z])",r"+🪙${\1}",s)
s=re.sub(r"\$\{([^{}]+)\}G(?![A-Za-z])",r"🪙${\1}",s)
# v5 모듈 넣기
js=''.join(rd(f) for f in ['v5a.js','v5b.js','v5c.js','v5d.js','v5e.js','v5f.js','v5g.js','v5h.js','v5i.js','v5j.js'])
rep("/* ================= 탭 ================= */",js+"\n/* ================= 탭 ================= */")
rep("$('backBtn').innerHTML=ic('back');","runLoad();if(RUN)setTimeout(()=>minimizeHunt(),400);\nsetInterval(()=>{if(curView()==='cal'&&!DND.on&&$('sheet').hidden){ui.calKeepScroll=true;renderCal()}},120000);\n$('backBtn').innerHTML=ic('back');")
