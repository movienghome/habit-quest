/* ================= v5.4: 행동 카드 하나로 · 점수 다시 · 용기 표시 ================= */
// 점수 뜻 (편집 화면에 띄움)
const SCORE_MEANING='<b>XP</b> = 성장 (나를 키우는가 → 레벨) · <b>🪙 골드</b> = 현실의 돈·자원 (벌 가능성·아끼면 +, 낭비 −) · <b>컨디션</b> = 지금의 몸과 마음 (건강·수면·기분). 상관없는 칸은 0으로 둬요.';
// 빠른 입력용 프리셋 (크기만, 부호는 좋은/나쁜에 따라)
const PRESET0={
  good:[{id:'p-light',name:'가벼움',xp:3,gold:1,cond:2},{id:'p-mid',name:'보통',xp:8,gold:3,cond:3},{id:'p-hard',name:'힘듦',xp:18,gold:6,cond:4},
    {id:'p-work',name:'작품·일',xp:20,gold:12,cond:1},{id:'p-body',name:'몸 챙기기',xp:4,gold:3,cond:6},{id:'p-rest',name:'쉼·회복',xp:0,gold:0,cond:5}],
  bad:[{id:'p-slip',name:'작은 실수',xp:0,gold:2,cond:8},{id:'p-bad',name:'나쁨',xp:0,gold:5,cond:15},{id:'p-worst',name:'아주 나쁨',xp:0,gold:10,cond:30},{id:'p-waste',name:'돈 낭비',xp:0,gold:40,cond:6}]};
// 카드별 새 점수 [XP, 골드, 컨디션, {옵션 이름:[XP,골드,컨디션]}] · 나쁜 행동은 크기만 적음
const SCORE54={
  '운동':[10,4,6],'30분 이상 걷기':[4,1,5],'7시간 이상 잤다':[0,0,8],'스트레칭':[2,0,3],
  '일기쓰기':[8,0,4],'명상':[4,0,5],'브레인 덤핑':[4,0,4],'음악·독서로 쉬기':[3,0,5],
  '시나리오 25분 집필':[25,12,2],'작업일지 쓰기':[8,3,1],'영화 보고 메모':[12,4,2],'팟캐스트 작업':[18,10,1],
  '영어 공부':[12,5,0],'가계부 기록':[4,8,1],'어항 환수':[3,2,3],'집 정리 15분':[3,1,4],
  '샤워':[3,0,6,{'기상 직후':[5,0,9],'점심쯤':[4,0,7],'오후':[3,0,6],'저녁':[2,0,5],'자기 직전':[1,0,4]}],
  '충동구매 참았다':[8,20,2],'절약했다':[3,8,0],'무지출 데이':[6,15,1],'납부·이체 처리':[3,4,2],
  '잠들기 전 정리 5분':[3,0,3],
  // 나쁜 행동 [0, 골드−, 컨디션−]
  '술':[0,30,20,{'사교용 한 잔':[0,10,5],'혼술':[0,30,15],'과음':[0,50,30]}],'과음':[0,50,30],
  '새벽 3시 넘어 잠':[0,0,20],'아픈데 무리함':[0,5,15],'피드·쇼츠 1시간 넘게':[0,0,12],'밤에 걱정·뉴스 붙잡기':[0,0,10],
  '자료만 찾고 시작 안 함':[0,5,8],'충동구매':[0,80,8],'연락·마감 회피':[0,15,12],
  // 도파민 메뉴
  '기지개 켜기':[1,0,2],'환기 시키기':[1,0,2],'이부자리 정리':[2,0,3],'방바닥 청소':[2,1,3],'책상 정리':[2,1,2],'폼롤러·스트레칭':[2,0,4],
  '알람 맞추고 쉬기':[0,0,3],'노래 틀고 발목운동':[1,0,3],'캠스터디':[10,4,1],'공간 바꾸기 (거실·도서관·카페)':[3,0,2],
  '독서':[10,2,3],'책상에 앉아 공부':[12,5,0],'필사':[10,2,2],'홈트':[8,4,6],'괄사':[1,0,4],'피부 관리':[1,0,3],'런데이':[12,5,7],'요리하기':[5,6,4],
  '웹툰':[0,0,3],'닌텐도':[0,0,4],'유튜브 보고 싶은 거':[0,0,2],'영화·드라마 한 편':[4,0,4],
  '마사지·세신':[0,0,10],'공연·전시·극장':[8,0,6],'드라마 몰아보기':[0,0,3]
};
// 용기 버튼 [XP, 골드, 컨디션, 용기 점수]
const BRAVE54={'지원서·이력서를 냈다':[120,40,4,3],'일을 했다·일 제안에 답했다':[90,60,4,2],'운전을 시도했다':[90,20,4,2],'면허 학원·새 배움에 등록했다':[120,30,4,3],
  '미뤄 온 연락을 했다':[50,10,4,1],'거절당할 수 있는 부탁·제안':[70,15,4,2],'처음 가 보는 곳·처음 해 보는 일':[50,5,4,1]};
const RULES54={dailyBonus:{xp:20,gold:15},happy:{xp:3,gold:0,cond:5},chain:{xp:20,gold:10},
  taskXP:{quick:4,mid:10,heavy:20,onTime:2,prio:{0:0,1:1,3:3,5:6}},
  courageSizes:{s:[40,10],m:[70,20],l:[120,40]},weightXp:2,food:{veg:4,bad:-12,protein:3}};

function applyScore(a,s){
  const good=a.type==='good';
  if(good){a.xp=s[0];a.gold=s[1];a.cond=s[2]}else{a.xp=0;a.gold=-Math.abs(s[1]);a.cond=-Math.abs(s[2])}
  if(s[3]&&a.opts)a.opts.forEach(o=>{const v=s[3][o.name];if(!v)return;if(good)o.xp=v[0];else delete o.xp;o.gold=v[1];o.cond=v[2]});
}
function mig54(c,raw){
  if(!c.presets||!Array.isArray(c.presets.good)||!Array.isArray(c.presets.bad))c.presets=clone(PRESET0);
  if(raw&&raw.v>=8)return;
  // 1) 일퀘 → '매일' 습관 카드 (점수는 카드에만)
  (Array.isArray(c.dailies)?c.dailies:[]).forEach(q=>{
    const a=q.action&&c.actions.find(x=>x.id===q.action);
    if(a){a.daily=1;if(!a.qid)a.qid=q.id;return}
    const did='d'+q.id;if(c.actions.some(x=>x.id===did||x.qid===q.id))return;
    const link=q.action||'',k=link&&(c.courage||[]).find(x=>x.id===link);
    const fd=link.startsWith('@food:')&&(c.food||[]).find(f=>'@food:'+f.id===link);
    let area=link==='@weigh'?'body':fd?fd.area:k?k.area:'mind';if(!c.areas.some(x=>x.id===area))area=(c.areas[0]||{}).id;
    const card={id:did,name:q.name,type:'good',area,cond:link?0:3,gold:link?0:0,xp:link?0:3,marble:'',daily:1,qid:q.id};
    if(link&&(link.startsWith('@')||k))card.link=link;
    const at=c.actions.findIndex(x=>x.type==='bad');c.actions.splice(at<0?c.actions.length:at,0,card);
  });
  // 2) 점수 다시 맞추기 (예전 값은 보관 → 편집에서 되돌리기 가능)
  const bak={at:dateKey(),actions:{},courage:{},rules:{}};
  c.actions.forEach(a=>{const s=SCORE54[a.name];if(!s)return;bak.actions[a.id]={xp:a.xp,gold:a.gold,cond:a.cond,opts:a.opts?clone(a.opts):null};applyScore(a,s)});
  (c.courage||[]).forEach(k=>{const s=BRAVE54[k.name];if(!s)return;bak.courage[k.id]={xp:k.xp,gold:k.gold,cond:k.cond,pts:k.pts};k.xp=s[0];k.gold=s[1];k.cond=s[2];k.pts=s[3]});
  ['dailyBonus','happy','chain','taskXP'].forEach(key=>{bak.rules[key]=clone(c[key]);c[key]={...c[key],...clone(RULES54[key])}});
  bak.rules.courageSizes=clone(c.courageSizes);(c.courageSizes||[]).forEach(z=>{const v=RULES54.courageSizes[z.id];if(v){z.xp=v[0];z.gold=v[1]}});
  bak.rules.weight=clone(c.weight);c.weight.xp=RULES54.weightXp;
  bak.rules.food=clone(c.food);(c.food||[]).forEach(f=>{const v=RULES54.food[f.id];if(v!=null)f.points=v});
  if(raw){c.scoreBak=bak;c.v54news=1}
}
// 일퀘 = '매일' 표시가 붙은 습관 카드에서 저절로 만들어짐 (따로 점수 없음)
function syncDailies(c){
  c.dailies=(c.actions||[]).filter(a=>a.daily&&a.type==='good'&&!(a.once&&a.doneAt)).map(a=>({id:a.qid||('q'+a.id),name:a.name,action:a.link||a.id,xp:0,gold:0}));
}
function presetList(type){const P0=C.presets||PRESET0;return (type==='bad'?P0.bad:P0.good)||[]}
function presetOf(id,type){return presetList(type).find(p=>p.id===id)||null}
function applyPreset(a,p){const good=a.type==='good';a.xp=good?+p.xp||0:0;a.gold=(good?1:-1)*Math.abs(+p.gold||0);a.cond=(good?1:-1)*Math.abs(+p.cond||0)}
function braveSize(a){return a&&a.brave?(C.courageSizes.find(z=>z.id===a.brave)||C.courageSizes[1]||C.courageSizes[0]):null}
function linkName(link){if(!link)return '';if(link==='@weigh')return '⚖ 몸무게 기록하면 자동';if(link.startsWith('@food:')){const f=C.food.find(x=>'@food:'+x.id===link);return '🥗 '+(f?f.name:'식사')+' 기록하면 자동'}const k=C.courage.find(x=>x.id===link);return k?`⚡ '${k.name}' 하면 자동`:''}
function linkGo(a){const q=C.dailies.find(x=>x.action===a.link);if(q){toggleQuest(q);return}toast(linkName(a.link)||'연결된 기록에서 체크돼요')}

/* ---- 편집: 카드 맨 위 (프리셋 · 점수 뜻 · 용기) ---- */
function aeTopHTML(a){
  const good=a.type==='good';
  if(a.link)return `<div class="reframe" style="margin:0"><b>🔗 ${esc(linkName(a.link))}</b>이 카드는 몸무게·식사·용기 기록과 이어져 있어요. 점수는 그쪽 기록에서 나오고, 여기선 '매일'로 두면 일퀘가 돼요.</div>`;
  return `<p class="tiny muted" style="margin:0">${SCORE_MEANING}</p>
  <div class="row" style="gap:4px;flex-wrap:wrap"><span class="tiny muted">빠르게 채우기:</span>${presetList(a.type).map(p=>`<button class="chipbtn" data-aepre="${p.id}" title="XP ${good?p.xp:0} · 🪙${good?'+':'−'}${p.gold} · 컨디션 ${good?'+':'−'}${p.cond}">${esc(p.name)}</button>`).join('')}</div>`;
}
function aeBraveHTML(a){
  return `<label class="f">⚔ 용기 표시<select data-aebrave="1"><option value="">없음</option>${C.courageSizes.map(z=>`<option value="${z.id}" ${a.brave===z.id?'selected':''}>${esc(z.name)} · 용기 +${z.pts}</option>`).join('')}</select></label>`;
}
/* ---- 편집: 일퀘 탭 → 매일 습관 ---- */
function dailiesEditHTML(){
  const ds=C.actions.filter(a=>a.daily&&a.type==='good');
  const hows=[['','눌러서 체크 (그냥 습관)'],['@weigh','⚖ 몸무게 기록하면 자동'],...C.food.filter(f=>f.points>0).map(f=>['@food:'+f.id,'🥗 '+f.name+' 기록하면 자동']),...C.courage.map(k=>[k.id,`⚡ '${k.name}' 하면 자동`])];
  const others=C.actions.filter(a=>!a.daily&&a.type==='good'&&!a.link);
  return `<p class="help">일퀘는 따로 있는 게 아니라 <b>'매일'로 정한 습관 카드</b>예요. 점수도 그 카드 하나에서만 나와요. 다 끝낸 날엔 상자를 열어요. 3~5개가 적당해요.</p>
  <div class="elist">${ds.map(a=>{const ar=C.areas.find(x=>x.id===a.area);return `<div class="erow2"><span class="hand"></span><span class="mk good">☑</span><button class="nm" data-aedit="${a.id}" style="border:0;background:none;text-align:left;font:inherit;color:inherit;cursor:pointer;padding:0;min-width:0"><b>${esc(a.name)}</b><span>${a.link?esc(linkName(a.link)):`${esc(ar?ar.name:'')} · XP +${a.xp||0} · 🪙${a.gold||0} · 컨디션 +${Math.abs(a.cond||0)}`}${a.brave?' · ⚔':''}</span></button><button class="btn ghost sm" data-dlyoff="${a.id}">매일 해제</button><span></span></div>`}).join('')||'<div class="empty">아직 없어요. 아래에서 추가하거나 습관 카드에서 ☑ 매일을 눌러요.</div>'}</div>
  <div class="row" style="gap:6px;margin-top:10px;flex-wrap:wrap"><input id="dlyName" maxlength="40" placeholder="새 매일 습관 (예: 물 2L 마시기)" style="flex:1;min-width:160px"><select id="dlyHow" style="width:auto">${hows.map(([v,l])=>`<option value="${esc(v)}">${esc(l)}</option>`).join('')}</select><button class="btn sm" data-dlyadd="1">＋ 추가</button></div>
  ${others.length?`<div class="row" style="gap:6px;margin-top:8px"><span class="tiny muted">있는 습관을 매일로:</span><select id="dlyPick" style="width:auto">${others.map(a=>`<option value="${a.id}">${esc(a.name)}</option>`).join('')}</select><button class="btn sm ghost" data-dlyon="1">☑ 매일로</button></div>`:''}
  <div class="kv" style="margin-top:14px"><label>다 끝낸 날 상자: XP<input id="r-dbxp" data-rule="dailyBonus.xp" type="number" min="0" value="${C.dailyBonus.xp}"></label><label>다 끝낸 날 상자: 골드<input id="r-dbgold" data-rule="dailyBonus.gold" type="number" min="0" value="${C.dailyBonus.gold}"></label></div>`;
}
function braveCardsNote(){
  const bs=C.actions.filter(a=>a.brave);
  return `<p class="help">⚡ 용기 버튼은 그때그때 하는 용기 행동이에요. 습관 카드에도 <b>⚔ 용기 표시</b>를 붙일 수 있어요 — 하면 용기 점수·용기 구슬이 함께 쌓여요. 할 일은 상세에서 '⚡ 용기'를 눌러요.</p>${bs.length?`<div class="row" style="gap:4px;flex-wrap:wrap;margin-bottom:8px"><span class="tiny muted">⚔ 표시된 습관:</span>${bs.map(a=>`<button class="chipbtn" data-aedit="${a.id}">${esc(a.name)}</button>`).join('')}</div>`:''}`;
}
/* ---- 편집: 프리셋 · 점수 되돌리기 ---- */
function presetsEditHTML(){
  const row=(type,p,i)=>`<div class="vrow" style="grid-template-columns:1.6fr .6fr .6fr .6fr 28px"><input data-pre="${type}" data-i="${i}" data-f="name" value="${esc(p.name)}" aria-label="프리셋 이름"><input data-pre="${type}" data-i="${i}" data-f="xp" type="number" min="0" value="${p.xp||0}" ${type==='bad'?'disabled':''} aria-label="XP"><input data-pre="${type}" data-i="${i}" data-f="gold" type="number" min="0" value="${p.gold||0}" aria-label="골드"><input data-pre="${type}" data-i="${i}" data-f="cond" type="number" min="0" value="${p.cond||0}" aria-label="컨디션"><button class="x" data-predel="${type}:${i}" aria-label="지우기">×</button></div>`;
  const head=`<div class="vrow head" style="grid-template-columns:1.6fr .6fr .6fr .6fr 28px"><span>이름</span><span>XP</span><span>골드</span><span>컨디션</span><span></span></div>`;
  return `<h3 style="margin-top:18px">빠른 입력 프리셋</h3><p class="help">새 습관을 만들 때 고민하기 싫으면 이 중 하나를 눌러 점수를 채워요. 나쁜 행동은 숫자만큼 깎여요.</p>
  <div class="vtable">${head}<div class="tiny muted">▲ 좋은</div>${presetList('good').map((p,i)=>row('good',p,i)).join('')}<div class="tiny muted">▼ 나쁜</div>${presetList('bad').map((p,i)=>row('bad',p,i)).join('')}</div>
  <div class="row" style="gap:6px;margin-top:6px"><button class="btn sm ghost" data-preadd="good">＋ 좋은 프리셋</button><button class="btn sm ghost" data-preadd="bad">＋ 나쁜 프리셋</button></div>`;
}
function scoreBakHTML(){
  const b=C.scoreBak;if(!b)return '';
  return `<h3 style="margin-top:18px">v5.4 점수 다시 맞춤</h3><p class="help">${esc(b.at)}에 습관 ${Object.keys(b.actions).length}개, 용기 ${Object.keys(b.courage).length}개, 규칙 점수를 새 기준으로 바꿨어요. 예전 값이 그리우면 되돌릴 수 있어요.</p>
  <div class="row" style="gap:6px">${ui.confirm==='scorebak'?`<span class="small">예전 점수로 되돌릴까요?</span><button class="btn sm" data-scorebak="go">되돌리기</button><button class="btn ghost sm" data-cancel="1">취소</button>`:`<button class="btn ghost sm" data-scorebak="ask">예전 점수로 되돌리기</button><button class="btn ghost sm" data-scorebak="keep">이대로 쓸게요 (보관본 지우기)</button>`}</div>`;
}
function restoreScores(){
  const b=C.scoreBak;if(!b)return;
  C.actions.forEach(a=>{const o=b.actions[a.id];if(!o)return;a.xp=o.xp;a.gold=o.gold;a.cond=o.cond;if(o.opts)a.opts=o.opts});
  C.courage.forEach(k=>{const o=b.courage[k.id];if(o)Object.assign(k,o)});
  const r=b.rules||{};['dailyBonus','happy','chain','taskXP','courageSizes','weight','food'].forEach(key=>{if(r[key])C[key]=r[key]});
  delete C.scoreBak;save('config');
}
/* ---- 이벤트 ---- */
document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.aepre){const a=C.actions.find(x=>x.id===(sheetCtx||{}).aedit),p=a&&presetOf(d.aepre,a.type);if(!a||!p)return;applyPreset(a,p);save('config');openActionEditor(a.id);toast(`'${p.name}' 점수로 채웠어요`);return}
  if(d.aedaily){const a=C.actions.find(x=>x.id===(sheetCtx||{}).aedit);if(!a)return;if(a.daily)delete a.daily;else a.daily=1;syncDailies(C);save('config');b.setAttribute('aria-pressed',String(!!a.daily));toast(a.daily?'매일 하는 일퀘가 됐어요':'일퀘에서 뺐어요');return}
  if(d.dlyoff){const a=C.actions.find(x=>x.id===d.dlyoff);if(!a)return;delete a.daily;syncDailies(C);save('config');reEdit();return}
  if(d.dlyon){const a=C.actions.find(x=>x.id===$('dlyPick').value);if(!a)return;a.daily=1;syncDailies(C);save('config');reEdit();return}
  if(d.dlyadd){const nm=$('dlyName').value.trim();if(!nm){$('dlyName').focus();toast('이름을 먼저 적어주세요');return}
    const how=$('dlyHow').value,id=uid();let card;
    if(how){const k=C.courage.find(x=>x.id===how),fd=how.startsWith('@food:')&&C.food.find(f=>'@food:'+f.id===how);
      card={id,name:nm,type:'good',area:how==='@weigh'?'body':fd?fd.area:k?k.area:C.areas[0].id,cond:0,gold:0,xp:0,marble:'',link:how,daily:1}}
    else{card={...newAction(id,nm,'good',C.areas[0].id,''),daily:1}}
    const at=C.actions.findIndex(x=>x.type==='bad');C.actions.splice(at<0?C.actions.length:at,0,card);syncDailies(C);save('config');reEdit();toast(`'${nm}' 매일 습관을 만들었어요. 이름을 누르면 점수를 바꿔요`);return}
  if(d.preadd){const arr=C.presets[d.preadd];arr.push({id:'p'+uid().slice(0,5),name:'새 프리셋',xp:d.preadd==='good'?5:0,gold:2,cond:d.preadd==='good'?2:10});save('config');reEdit();return}
  if(d.predel){const[t,i]=d.predel.split(':');C.presets[t].splice(+i,1);save('config');reEdit();return}
  if(d.scorebak){if(d.scorebak==='ask'){ui.confirm='scorebak';reEdit();return}if(d.scorebak==='go'){ui.confirm=null;restoreScores();render();toast('예전 점수로 되돌렸어요');return}if(d.scorebak==='keep'){delete C.scoreBak;save('config');reEdit();toast('새 점수로 확정했어요');return}}
});
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.dataset.aebrave){const a=C.actions.find(x=>x.id===(sheetCtx||{}).aedit);if(!a)return;if(t.value)a.brave=t.value;else delete a.brave;save('config');return}
  if(t.dataset.pre){const p=(C.presets[t.dataset.pre]||[])[+t.dataset.i];if(!p)return;const f=t.dataset.f;if(f==='name'){const v=t.value.trim();if(v)p.name=v}else p[f]=Math.abs(parseFloat(t.value)||0);save('config');return}
});
