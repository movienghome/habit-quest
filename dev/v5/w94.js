/* ---- v9.5 (w94.js): D2 카드 편집 창 새로 · D3 점수 큰 순에서 ✨XP·💰골드·🔋컨디션 고르기 ----
   D3: SORTS의 '점수 큰 순'(xp) 한 칸을 셋으로 나눔(xp·gold·cond). 정렬 고르는 select가 한 곳이라 단계가 늘지 않음.
       기존 저장값 'xp'는 그대로 ✨XP 큰 순. 나쁜 카드는 XP가 없어서 ✨XP 순에선 맨 뒤(원래 순서 유지).
   D2: openActionEditor를 맨 바깥에서 감싸 **그린 뒤 DOM을 옮김**(ts78과 같은 방식 — 이벤트는 모두 data-속성 위임이라 옮겨도 그대로 먹음).
       위 → 아래: 이름(머리줄) · 종류·영역 · 점수 큰 칸 셋 · 빠르게 채우기 · (접힘) 더 설정 / 세부 옵션 / 설명·문구 / 반복 / 이어진 곳 · 아래 고정 단추 줄.
       펼침 상태는 O94(카드가 바뀌면 초기화, 저장 안 함). */
{
  /* ---- D3 ---- */
  {const i=SORTS.findIndex(s=>s[0]==='xp');
   if(i>=0&&!SORTS.some(s=>s[0]==='gold'))SORTS.splice(i,1,['xp','✨ XP 큰 순'],['gold','💰 골드 큰 순'],['cond','🔋 컨디션 큰 순'])}
  sortList=(function(prev){return function(list,st,by){
    if(by==='xp'||by==='gold'||by==='cond'){
      const sc=x=>by==='xp'?(x.type==='bad'?-1:(+x.xp||0)):by==='gold'?Math.abs(+x.gold||0):Math.abs(+x.cond||0);
      return [...list].sort((x,y)=>sc(y)-sc(x))}
    return prev.apply(this,arguments)}})(sortList);

  /* ---- D2 ---- */
  const O94={id:null,o:{}};
  const q1=(r,s)=>r.querySelector(s);
  const lbOf=(r,s)=>{const e=q1(r,s);return e?e.closest('label'):null};
  const setLbl=(lb,txt)=>{if(lb&&lb.firstChild&&lb.firstChild.nodeType===3)lb.firstChild.nodeValue=txt};
  function det94(key,sum,nodes,openDef){
    const d=document.createElement('details');d.className='ae94d';d.dataset.k94=key;
    const s=document.createElement('summary');s.innerHTML=sum;d.appendChild(s);
    const b=document.createElement('div');b.className='ae94b';nodes.filter(Boolean).forEach(n=>b.appendChild(n));d.appendChild(b);
    const o=O94.o[key];d.open=o==null?!!openDef:!!o;return d}
  function ae94(id){
    const sc=$('sheetC');if(!sc||!(sheetCtx&&sheetCtx.aedit===id)||q1(sc,'.ae94id'))return;
    const a=C.actions.find(x=>x.id===id);if(!a)return;
    if(O94.id!==id){O94.id=id;O94.o={}}
    const good=a.type==='good',sh=q1(sc,'.sh'),h3=sh&&q1(sh,'h3'),nameIn=q1(sc,'[data-ae="name"]');
    if(!sh||!nameIn)return;
    // 위쪽에서 모을 조각(옮기기 전에 먼저 찾아 둠)
    const typeLb=lbOf(sc,'[data-ae="type"]'),areaLb=lbOf(sc,'[data-ae="area"]'),nameLb=nameIn.closest('label'),
      condLb=lbOf(sc,'[data-ae="cond"]'),goldLb=lbOf(sc,'[data-ae="gold"]'),xpLb=lbOf(sc,'[data-ae="xp"]'),
      braveLb=lbOf(sc,'[data-aebrave]'),marbleLb=lbOf(sc,'[data-ae="marble"]'),durLb=lbOf(sc,'[data-ae="dur"]'),tmodeLb=lbOf(sc,'[data-ae="tmode"]'),
      effLb=lbOf(sc,'[data-ae="effort"]'),monLb=lbOf(sc,'[data-ae="money"]'),
      preRow=(q1(sc,'[data-aepre]')||{}).parentElement,whyLb=lbOf(sc,'[data-x60why]'),reLb=lbOf(sc,'[data-ae="reframe"]'),
      info=[...sc.children].find(c=>c.tagName==='P'&&/골드/.test(c.textContent)&&/컨디션/.test(c.textContent)),
      conn=q1(sc,':scope > .conn60'),optBox=(q1(sc,'[data-aeoadd]')||{}).parentElement,
      rh=q1(sc,':scope > .links.rh57'),links=[...sc.querySelectorAll(':scope > .links')].find(x=>!x.classList.contains('rh57')),
      foot=[...sc.children].find(c=>q1(c,'[data-aedone]'));
    const f2=q1(sc,':scope > .f2');
    // 머리줄 = 이름 입력(제목 h3 자리)
    nameIn.classList.add('ae94n');nameIn.setAttribute('aria-label','이름');nameIn.placeholder='행동 이름';
    sh.insertBefore(nameIn,h3||sh.firstChild);if(h3)h3.remove();if(nameLb&&!nameLb.querySelector('input,select,textarea'))nameLb.remove();
    sh.classList.add('ae94sh');
    // 종류·영역
    const idr=document.createElement('div');idr.className='ae94id';[typeLb,areaLb].forEach(n=>n&&idr.appendChild(n));
    // 점수 큰 칸 셋
    const trio=document.createElement('div');trio.className='ae94sc';
    setLbl(xpLb,'✨ XP');setLbl(condLb,'🔋 컨디션 '+(good?'+':'−'));setLbl(goldLb,'💰 골드 '+(good?'+':'−'));
    [xpLb,condLb,goldLb].forEach(n=>{if(n){n.classList.add('s94');trio.appendChild(n)}});
    if(preRow)preRow.classList.add('ae94pre');
    const infoD=info?(()=>{const d=document.createElement('details');d.className='ae94i';const s=document.createElement('summary');s.textContent='ⓘ 점수가 뭐예요?';d.appendChild(s);d.appendChild(info);return d})():null;
    // 접힘 칸들
    const more=document.createElement('div');more.className='f2';[braveLb,marbleLb,durLb,tmodeLb,effLb,monLb].forEach(n=>n&&more.appendChild(n));
    const chips=[a.brave?'⚔ 용기':'',a.dur?'⏱ '+a.dur+'분':'',a.marble?'🔮 구슬':'',a.money?'💰 금액':'',a.effort?'크기':''].filter(Boolean);
    const dMore=more.children.length?det94('more','⚙ 더 설정'+(chips.length?` <small class="muted">${chips.join(' · ')}</small>`:''),[more],false):null;
    if(optBox){const t=q1(optBox,':scope > h3');if(t)t.remove()}
    const nOpt=(a.opts||[]).length;
    const dOpt=optBox?det94('opts','세부 옵션'+(nOpt?` <small>${nOpt}</small>`:' <small class="muted">＋ 추가</small>'),[optBox],false):null;
    const whyV=whyLb&&q1(whyLb,'input')?q1(whyLb,'input').value.trim():'';
    const dTxt=(whyLb||reLb)?det94('txt','📝 설명·문구'+((a.reframe||whyV)?' <small>있음</small>':''),[whyLb,reLb],false):null;
    let dRep=null;
    if(rh){const t=q1(rh,':scope > h3');if(t)t.remove();const on=q1(rh,'[data-x57rh][aria-pressed="true"]');
      dRep=det94('rep','↻ 반복 <small class="muted">'+esc(on?on.textContent.trim():'없음')+'</small>',[rh],false)}
    const nConn=conn?conn.querySelectorAll('.x60c').length:0;
    if(links){const t=q1(links,':scope > h3');if(t)t.remove()}
    const dLink=(conn||links)?det94('link','🔗 이어진 곳'+(nConn?` <small>${nConn}</small>`:''),[conn,links],false):null;
    // 다시 쌓기: .sh 다음부터 새 순서로
    [...sc.children].forEach(c=>{if(c!==sh&&!c.classList.contains('grab')&&c!==foot&&c!==f2)c.remove()});
    if(f2)f2.remove();
    const frag=document.createDocumentFragment();
    [idr,trio,preRow,infoD,dMore,dOpt,dTxt,dRep,dLink].filter(Boolean).forEach(n=>frag.appendChild(n));
    sc.insertBefore(frag,foot||null);
    if(foot)foot.classList.add('ae94f');
    sc.classList.add('ae94');
  }
  openActionEditor=(function(prev){return function(id){const r=prev.apply(this,arguments);try{ae94(id)}catch(e){console.error(e)}return r}})(openActionEditor);
  // 펼침 상태 기억(toggle은 버블링 안 함 → 캡처)
  document.addEventListener('toggle',e=>{const d=e.target;if(d&&d.matches&&d.matches('details.ae94d')&&d.dataset.k94)O94.o[d.dataset.k94]=d.open},true);
  // 점수 칸을 누르면 숫자 전체 선택(폰에서 지우고 다시 치는 수고 줄이기)
  document.addEventListener('focusin',e=>{const t=e.target;if(t&&t.matches&&t.matches('.ae94sc input')){try{t.select()}catch(x){}}});
}
