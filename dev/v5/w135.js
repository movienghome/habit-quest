/* ---- v13.7 (w135.js): 루틴 프리셋 탭 하나로 합치기(V1) · 시나리오 쓰기 칩 하나 그리고 둘 🤝(V3) (사용자 11/25 오후) ----
   V1 루틴 카드(rtCard61/62 맨 바깥 감쌈 `pk135` — card124·drag134 뒤)에서 프리셋이 둘 이상일 때:
   · 프리셋 고르는 곳이 셋(위 오늘/내일 줄 `.pbar119` · 📅 언제 안 프리셋별 시각·요일 `.pwrap123` · '✎ 단계 편집' 탭 `.pt124`)이던 것을
     **폴더 탭 하나**(`.pk135` > `.tb135` 탭 줄 + `.pc135` 카드)로: 탭을 열면 그 프리셋의 ⏰ 시각 · 자동 요일 · 단계(⠿ 끌기·체크·분)가 한 카드 안에.
   · 열린 탭을 **한 번 더 누르면 그 자리에서 이름 칸**(`data-rn135` → 아이콘·이름 입력, Enter/바깥=저장, Esc=취소 — 저장은 w117 `data-pf117` change 그대로).
     기본으로·복제·삭제·이름 바꾸기는 탭 옆 ⋯(`.pm135`). 옛 `⋯ 이름·기본·복제·삭제` 접힘(.pm124)·안내 글(.ph124)은 뺌(설명은 title).
   · '오늘/내일 어떤 프리셋'(직접 고르기 `data-pk117`)은 탭 줄 오른쪽 `📌 오늘 🌿 일반 ▾`(`.once135`) 팝오버 안으로 — 요일 자동 고르기와 구분('이번만').
   · 시각·요일 입력은 w123 `data-ptm123`·`data-ptm123x`·`data-pwd123` 그대로(처리 코드 안 바꿈). 프리셋이 하나뿐이면 옛 모양 그대로.
   V3 주 N회 칩 요일 칸(`dots99`, w133 재선언): 하나 그리고 둘 만나기로 한 날·만난 날(`hgMet122`>0)은 요일 글자 대신 🤝(점선/채움/흐림은 상태 그대로).
      칩 끝 `🤝0`(이번 주 만남 횟수 — w105 `<i title="이번 주 하그둘 만남">`)은 숨김(v135.css). 횟수는 칩 상세 창에 그대로. 시험 t143. */

function e135(s){return typeof esc==='function'?esc(s):String(s==null?'':s)}

function pk135(h,r){
  try{
    if(typeof h!=='string'||!r||h.indexOf('pt124')<0||h.indexOf('pk135')>=0)return h;
    const L=ensure117(r);if(L.length<2)return h;
    const t=document.createElement('template');t.innerHTML=h;const root=t.content;
    const pt=root.querySelector('.pt124'),wrap=root.querySelector('.st62s');if(!pt||!wrap)return h;
    const e=(O117[r.id]&&L.find(p=>p.id===O117[r.id]))||pset117(r),dfl=r.pf117||L[0].id,td=gk76(),today=pset117(r,td);
    const nInc=wrap.querySelectorAll(':scope > .st62:not(.off124)').length;
    const mins=(e.s||[]).reduce((a,id)=>{const s=(r.steps||[]).find(z=>z.id===id);return a+(s&&TASKS[s.tid]?pmin118(e,s):0)},0);
    const btm=r.bt124||'';
    const tab=p=>{const on=p===e,tm=p.tm?`<small class="tm135">${e135(p.tm)}</small>`:'',df=p.id===dfl?`<small class="df135" title="기본 프리셋 — 요일·이번만으로 안 고른 날">기본</small>`:'';
      return on?`<button type="button" class="tab135 on" role="tab" aria-selected="true" data-rn135="${r.id}|${p.id}" title="한 번 더 누르면 이름 바꾸기">${e135(preN117(p))}${df}${tm}</button>`
        :`<button type="button" class="tab135" role="tab" aria-selected="false" data-pt117="${r.id}|${p.id}" title="${e135(p.n)} 프리셋 열기">${e135(preN117(p))}${df}${tm}</button>`};
    // 이번만(오늘/내일 직접 고르기) — 옛 프리셋 줄을 팝오버 안으로
    const bar=root.querySelector('.pbar119:not(.run):not(.one)');
    const pd=(r.pd117||{})[td];
    const once=document.createElement('details');once.className='once135';once.dataset.r=r.id;
    once.innerHTML=`<summary title="오늘·내일만 다른 프리셋으로 (요일 자동보다 먼저)" aria-label="오늘·내일 프리셋 이번만 바꾸기"><span class="tiny muted">📌 오늘</span> <b>${e135(preN117(today))}</b>${pd?'<small class="muted"> · 이번만</small>':''} <span class="cv135" aria-hidden="true">▾</span></summary><div class="pop135 on135"><div class="tiny muted hd135">이번만 바꾸기 <small>— 요일 자동보다 먼저예요</small></div></div>`;
    if(bar){bar.querySelectorAll('.e119').forEach(b=>b.remove());once.querySelector('.pop135').appendChild(bar)}
    // ⋯ 메뉴
    const menu=`<details class="pm135" data-r="${r.id}"><summary title="이름·기본·복제·삭제" aria-label="${e135(e.n)} 프리셋 메뉴">⋯</summary><div class="pop135 mn135" role="menu">
      <button type="button" role="menuitem" data-rn135="${r.id}|${e.id}">✎ 이름·아이콘 바꾸기</button>
      <button type="button" role="menuitem" data-pdef117="${r.id}|${e.id}" ${e.id===dfl?'disabled':''}>★ 기본 프리셋으로${e.id===dfl?' <small>(지금 기본)</small>':''}</button>
      <button type="button" role="menuitem" data-pdup117="${r.id}|${e.id}">⧉ 복제</button>
      <button type="button" role="menuitem" class="del135" data-pdel117="${r.id}|${e.id}">🗑 삭제</button></div></details>`;
    // 카드 머리: 이 프리셋의 시각·자동 요일·합계
    const wd=(WD123||[1,2,3,4,5,6,0]).map(w=>`<button type="button" class="wd135" data-pwd123="${r.id}|${e.id}|${w}" aria-pressed="${(e.wd||[]).indexOf(w)>=0}">${WDK[w]}</button>`).join('');
    const head=`<div class="ph135"><label class="tw135" title="이 프리셋인 날의 시각 (비우면 기본 시각${btm?' '+e135(btm):''})"><span aria-hidden="true">⏰</span><input type="time" data-ptm123="${r.id}|${e.id}" value="${e135(e.tm||'')}" aria-label="${e135(e.n)} 시각">${e.tm?`<button type="button" class="ib" data-ptm123x="${r.id}|${e.id}" aria-label="${e135(e.n)} 시각 지우기">✕</button>`:(btm?`<small class="muted">기본 ${e135(btm)}</small>`:'')}</label>
      <span class="wr135" role="group" aria-label="${e135(e.n)} 자동 요일" title="고른 요일엔 자동으로 이 프리셋 (한 요일은 한 프리셋만 · 이번만 바꾼 날이 먼저)"><small class="muted">자동</small>${wd}</span>
      <span class="sm135 tiny muted" title="체크=이 프리셋에서 함 · ⠿ 끌기=이 프리셋 순서 · 분=이 프리셋만">${nInc}단계 · ${mins}분</span></div>`;
    const box=document.createElement('div');box.className='pk135';box.dataset.r=r.id;
    box.innerHTML=`<div class="tb135"><div class="tl135" role="tablist" aria-label="프리셋">${L.map(tab).join('')}<button type="button" class="tab135 add135" data-pn117="${r.id}|${e.id}" title="새 프리셋 (지금 프리셋 단계로 시작)" aria-label="새 프리셋">＋</button></div>${menu}</div><div class="pc135" role="tabpanel">${head}</div>`;
    const wr=root.querySelector('.when124 .when123')||root.querySelector('.when124');   // 오늘·내일 = 📅 언제 상자 ⏰ 줄 안(날짜 이야기라서)
    const lb=wr&&wr.querySelector(':scope > .lb125');if(lb)wr.insertBefore(once,lb);else if(wr)wr.appendChild(once);else box.querySelector('.tb135').appendChild(once);
    const ex=wrap.querySelector(':scope > .ex124');if(ex)ex.textContent='안 하는 단계 · 체크하면 넣어요';
    pt.replaceWith(box);box.querySelector('.pc135').appendChild(wrap);
    const pw=root.querySelector('.pwrap123');if(pw)pw.remove();
    return t.innerHTML
  }catch(x){console.error(x)}return h}
rtCard62=(function(prev){return function(r){return pk135(prev.apply(this,arguments),r)}})(rtCard62);
rtCard61=(function(prev){return function(r){return pk135(prev.apply(this,arguments),r)}})(rtCard61);

/* 열린 탭 한 번 더 / ⋯ → 이름 바꾸기 그 자리에서 */
function rn135(key){
  const [rid,pid]=key.split('|'),r=rOf124(rid),p=r&&ensure117(r).find(z=>z.id===pid);if(!r||!p)return;
  document.querySelectorAll('.pm135[open]').forEach(d=>d.open=false);
  const tab=[...document.querySelectorAll(`.tab135.on[data-rn135="${rid}|${pid}"]`)].find(x=>x.offsetParent!==null);if(!tab)return;
  const sp=document.createElement('span');sp.className='tab135 on rn135';sp.dataset.r=rid;
  sp.innerHTML=`<input class="ic135" data-pf117="${rid}|${pid}|ic" value="${e135(p.ic||'')}" maxlength="4" aria-label="아이콘"><input class="nm135" data-pf117="${rid}|${pid}|n" value="${e135(p.n)}" maxlength="12" aria-label="프리셋 이름" enterkeyhint="done">`;
  tab.replaceWith(sp);const n=sp.querySelector('.nm135');n.focus();try{n.select()}catch(x){}}
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-rn135]');if(!b)return;e.preventDefault();e.stopPropagation();rn135(b.dataset.rn135)},true);
function esc135(){const a=document.activeElement,sp=a&&a.closest&&a.closest('.rn135');if(!sp)return false;
  sp.querySelectorAll('input').forEach(i=>{i.value=i.defaultValue});const r=rOf124(sp.dataset.r);sp.remove();if(r)redraw117(r);return true}
addEventListener('keydown',e=>{const i=e.target;if(!i||!i.closest||!i.closest('.rn135')||e.key!=='Escape')return;e.preventDefault();e.stopPropagation();esc135()},true);
/* 상세 창 안에서 Esc = 창 닫기(v5g, 먼저 등록된 capture) → 이름 칸에 있으면 창은 두고 이름만 취소 */
closeSheet=(function(prev){return function(){try{const ev=window.event;if(ev&&ev.type==='keydown'&&ev.key==='Escape'&&esc135())return}catch(x){}return prev.apply(this,arguments)}})(closeSheet);
addEventListener('focusout',e=>{const sp=e.target&&e.target.closest&&e.target.closest('.rn135');if(!sp||(e.relatedTarget&&sp.contains(e.relatedTarget)))return;
  setTimeout(()=>{if(sp.isConnected&&!sp.contains(document.activeElement)){const r=rOf124(sp.dataset.r);if(r)redraw117(r)}},60)},true);   // 안 바꾸고 나가면 탭으로 되돌림(바꿨으면 w117 change가 이미 다시 그림)

/* 팝오버: 하나만 열기 · 바깥 누르면 닫기 (다시 그리면 닫힘 — 고른 뒤 저절로 닫히게 열림은 기억 안 함) */
addEventListener('toggle',e=>{const d=e.target;if(!d||!d.classList||!d.open||!(d.classList.contains('once135')||d.classList.contains('pm135')))return;
  document.querySelectorAll('.once135[open],.pm135[open]').forEach(x=>{if(x!==d){x.open=false}})},true);
addEventListener('pointerdown',e=>{if(e.target.closest&&e.target.closest('.once135,.pm135'))return;
  document.querySelectorAll('.once135[open],.pm135[open]').forEach(d=>{d.open=false})},true);

/* ---- V3 시나리오 쓰기 칩: 하나 그리고 둘 날 = 🤝 ---- */
dots99=function(t,ws,td){let s='',lab=[];
  for(let i=0;i<7;i++){const k=addDays(ws,i),st=stOf121(t,k,td),w=wdOf(k);let hg=0;try{hg=hgMet122(t,k)}catch(x){}
    s+=`<i class="d99 w133 s-${st}${hg?' hg135':''}${k===td?' now':''}">${hg?'🤝':e135(w)}</i>`;lab.push(w+' '+(hg&&st!=='hg'&&st!=='hgd'?DOT121[st]+' · 하나 그리고 둘':DOT121[st]))}
  return `<span class="dd99 w133w" role="img" aria-label="${lab.join(', ')}" title="${lab.join(' · ')} — ${typeof LEG133==='string'?LEG133.replace('동그란 칸','🤝'):''}">${s}</span>`};

F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['🧭 루틴 프리셋 탭','설정(편집) → 루틴 탭 → 루틴 카드의 프리셋 탭 줄(또는 할 일 → 루틴 이름 누르기)','프리셋 탭을 누르면 그 프리셋의 ⏰ 시각·자동 요일·단계가 한 카드에 보여요. 열린 탭을 한 번 더 누르면 바로 이름을 바꿔요. 기본·복제·삭제는 탭 옆 ⋯, 오늘·내일만 바꾸려면 오른쪽 📌 오늘 ▾',()=>{goEdit('routines')},'프리셋 이름 바꾸기 복제 삭제 기본 이번만'],
  ['🤝 시나리오 쓰기 칩의 만남 날','캘린더 위 주 N회 칩 → 요일 칸','하나 그리고 둘로 만나기로 한 날은 요일 글자 대신 🤝(점선), 만나서 끝낸 날은 채운 🤝예요. 만남 날도 주 횟수에 들어가요',()=>{location.hash='calendar'},'하그둘 만남 하나 그리고 둘']])}})(F67);
/* 열린 탭이 가로 스크롤 밖이면 보이게 */
render=(function(prev){return function(){const x=prev.apply(this,arguments);try{requestAnimationFrame(()=>document.querySelectorAll('.tl135').forEach(l=>{const o=l.querySelector('.tab135.on');if(o&&(o.offsetLeft<l.scrollLeft||o.offsetLeft+o.offsetWidth>l.scrollLeft+l.clientWidth))l.scrollLeft=o.offsetLeft-8}))}catch(e){}return x}})(render);
