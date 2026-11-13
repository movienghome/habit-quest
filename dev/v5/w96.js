/* ---- v9.7 (w96.js): D11 카드 화면 1·2·4 — 타일 격자 · ⏰ 지금 맞는 카드 먼저 · 점수를 글자 한 줄로 ----
   ④ 점수 글자: metaChips(맨 바깥 감쌈)가 알약 칩 대신 글자 한 줄을 냄 — 기록하기·편집 목록·편집 보드 모두 metaChips를 쓰므로 같이 바뀜.
      점수 = `.s96`(✨10 💰+4 🔋+6, 나쁜 카드는 − 부호), 그 밖(영역·🔗 연결·반복·⚔️·옵션·⏱·30일)은 `.g96` 작은 글자. 보일 칸 고르기(aeShow)는 그대로 따름.
   ① 타일: 기록하기의 행동/습관(#actGroups .acts)·용기(#braveActs)에 `.t96` → CSS 격자(v96.css). 마크업·이벤트는 그대로(□ = 기록, 나머지 = 설명·편집).
      타일에선 점수 글자와 겹치는 오른쪽 `+n`을 숨김. 목록/타일 바꾸기 = 도구 줄 끝 `[data-t96]`(C.tile96, C 최상위 — 0이면 목록).
   ② 지금 맞는 카드: 오늘(ui.off===0)·나쁜 거르기 아닐 때, 지금 목록에 보이는 카드 중
      '오늘 차례인 습관(이어진 반복 할 일이 오늘까지 열려 있음)' +5 · '최근 28일 지금 ±90분에 한 횟수' ×1 — 2점 이상, 오늘 아직 안 한 것만, 폰 4개·PC 6개.
      맨 위 묶음 `.now96`(접기 키 'now96' — 기존 data-gcollapse 그대로). 행은 아래 묶음의 행을 cloneNode로 복사(위임 이벤트라 그대로 먹음). 이유 글자 `.why96`. */
{
  /* ---- ④ 점수 글자 ---- */
  metaChips=function(a,st,show){
    show=show||aeShow();const ar=C.areas.find(x=>x.id===a.area),good=a.type==='good',has=k=>show.includes(k),out=[];
    const sg=v=>(v>0?'+':'−')+Math.abs(v);
    const g=(cls,txt,tip)=>{if(txt)out.push(`<span class="g96 ${cls}" title="${esc(tip)}">${txt}</span>`)};
    if(has('area')&&ar)g('ar',esc(ar.name),'영역');
    if(a.link)g('ln','🔗 자동','연결 카드 — '+linkName(a.link));
    else{const sc=[has('xp')&&good&&a.xp?`<b>✨${a.xp}</b>`:'',has('gold')&&a.gold?'💰'+sg(a.gold):'',has('cond')&&a.cond?`<span class="${a.cond<0?'neg96':''}">🔋${sg(a.cond)}</span>`:''].filter(Boolean);
      if(sc.length)out.unshift(`<span class="s96" title="✨ XP(성장) · 💰 골드(돈·자원) · 🔋 컨디션(몸과 마음)">${sc.join(' ')}</span>`)}
    if(has('rhythm')){const r=rhythmOf(a);if(r)g('rh',esc(r),'반복')}
    if(has('brave')&&a.brave)g('bv','⚔️','용기 표시');
    if(has('opts')&&a.opts&&a.opts.length)g('op','옵션 '+a.opts.length,'세부 옵션');
    if(has('dur')&&a.dur)g('du','⏱'+a.dur+'분','목표 시간');
    if(st&&has('n30'))g('n','30일 '+(st.n30||0)+'번','최근 30일에 한 횟수');
    return out.join('')};

  /* ---- ② 지금 맞는 카드 ---- */
  function nowPicks96(ids){
    const day=curDay(),done=new Set(day.entries.filter(e=>e.kind==='act').map(e=>e.aid));
    const nm=nowMinutes(),from=addDays(gk76(),-28),hit={};
    Object.keys(DAYS).forEach(k=>{if(k<from)return;(DAYS[k].entries||[]).forEach(e=>{if(e.kind!=='act'||!e.aid||!e.t)return;
      let d=Math.abs(toMin(e.t)-nm);d=Math.min(d,1440-d);if(d<=90)hit[e.aid]=(hit[e.aid]||0)+1})});
    const td=midKey68(),due=new Set(openTasks().filter(t=>t.aid&&t.rep&&t.due&&t.due<=td).map(t=>t.aid));
    return ids.map(id=>{const a=C.actions.find(x=>x.id===id);if(!a||a.type!=='good'||a.link||done.has(id))return null;
        const h=hit[id]||0,s=(due.has(id)?3:0)+(h>=2?h:0);if(s<2)return null;
        return {id,s,why:due.has(id)?'오늘 차례':'요즘 이 시간'+(h>2?' ×'+h:'')}})
      .filter(Boolean).sort((x,y)=>y.s-x.s).slice(0,innerWidth<760?4:6)}
  function now96(){
    const box=$('actGroups');if(!box)return;
    const old=box.querySelector(':scope > .now96w');if(old)old.remove();
    const LS=C.ui.list||{};if(ui.off||LS.filter==='bad')return;
    const rows=[...box.querySelectorAll('.acts .act[data-info^="act:"]')],seen=new Set(),ids=[];
    rows.forEach(r=>{const id=r.dataset.info.slice(4);if(!seen.has(id)){seen.add(id);ids.push(id)}});
    const pk=nowPicks96(ids);if(!pk.length)return;
    const shut=!!C.ui.collapsed.gnow96,w=document.createElement('div');w.className='now96w';
    w.innerHTML=`<button class="ghead ${shut?'shut':''}" data-gcollapse="now96">${ic('chev')}⏰ 지금 맞는 카드 <span class="c">${pk.length}</span></button>`;
    if(!shut){const g=document.createElement('div');g.className='acts now96';
      pk.forEach(p=>{const r=rows.find(x=>x.dataset.info==='act:'+p.id);if(!r)return;const c=r.cloneNode(true);
        const m=c.querySelector('.meta');if(m)m.insertAdjacentHTML('afterbegin',`<span class="why96">${esc(p.why)}</span>`);g.appendChild(c)});
      w.appendChild(g)}
    box.insertBefore(w,box.firstChild)}

  /* ---- ① 타일 + 바꾸기 단추 ---- */
  function tile96(){
    const on=C.tile96!==0;['actGroups','braveActs'].forEach(i=>{const e=$(i);if(e)e.classList.toggle('t96',on)});
    const tl=$('actTools');if(tl&&!tl.querySelector('[data-t96]'))tl.insertAdjacentHTML('beforeend',
      `<button type="button" class="chipbtn tg96" data-t96 title="${on?'목록으로 보기':'타일로 보기'}" aria-label="${on?'목록으로 보기':'타일로 보기'}">${on?'☰ 목록':'▦ 타일'}</button>`)}
  renderLog=(function(prev){return function(){const r=prev.apply(this,arguments);
    try{tile96();now96();if(typeof logChips==='function')logChips()}catch(e){console.error(e)}return r}})(renderLog);
  document.addEventListener('click',ev=>{const b=ev.target.closest&&ev.target.closest('[data-t96]');if(!b)return;
    ev.preventDefault();ev.stopImmediatePropagation();C.tile96=C.tile96===0?1:0;save('config');renderLog()},true);
}
