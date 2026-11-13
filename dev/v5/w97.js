/* ---- v9.8 (w97.js): D11-3 + D1 — 기록하기에서 바로 정리하기 (끌어서 영역 옮기기·칸 안 순서·영역 칸 순서) ----
   기록하기 '행동' 묶기가 '영역'일 때: 카드 타일을 끌어 다른 영역에 놓으면 영역이 바뀌고, 같은 영역 안에서 놓으면 순서가 바뀜(정렬이 '기본 순서'일 때).
   영역 머리(.ghead)를 끌면 영역 칸 순서(C.areas)가 바뀜. 편집 → 행동/습관 보드도 영역 이름(.dh)을 꾹 눌러 끌면 같은 일.
   · 끌기 길은 옛 보드의 것을 그대로 씀: 영역 바꾸기 = v5r dndEnd('dopa:@a:영역'), 칸 안 순서 = v5p dndMove/dndEnd(DND.drop.kb) → 여기서 drop.kb만 채워 줌.
   · 마우스(PC)는 늘 끌 수 있음(오른쪽 단추 메뉴는 그대로). 터치는 길게 누르면 메뉴가 떠야 하니 도구 줄 '↕ 옮기기'를 켠 때만 끌기(꾹 눌러 끌기).
   · 타일은 격자라 줄 긋는 대신 기준 타일/머리에 `.ins97b|a` 표시(줄 노드를 넣으면 격자 칸을 차지해 깜빡임). */
{
  const coarse97=()=>!!window.__coarse75||(window.matchMedia&&matchMedia('(pointer:coarse)').matches);
  const byArea97=()=>((C.ui&&C.ui.list)||{}).group==='area';
  const manual97=()=>{const s=((C.ui&&C.ui.list)||{}).sort;return !s||s==='manual'};
  const drag97=()=>byArea97()&&(!coarse97()||!!ui.mv97);
  const areaName97=id=>(C.areas.find(a=>a.id===id)||{}).name||'';

  /* ---- 기록하기: 타일·영역 머리에 끌기 표시 ---- */
  function deco97(){
    const box=$('actGroups');if(!box)return;
    const tl=$('actTools');
    if(tl){const had=tl.querySelector('[data-mv97]');
      if(coarse97()&&byArea97()){if(!had)tl.insertAdjacentHTML('beforeend',`<button type="button" class="chipbtn mv97" data-mv97 aria-pressed="${!!ui.mv97}" title="꾹 눌러 끌어서 영역·순서 바꾸기">↕ 옮기기</button>`);else had.setAttribute('aria-pressed',String(!!ui.mv97))}
      else if(had)had.remove()}
    box.classList.toggle('mv97',drag97());
    if(!byArea97())return;
    [...box.children].forEach(h=>{
      if(!h.matches||!h.matches('.ghead[data-gcollapse^="a:"]'))return;
      const id=h.dataset.gcollapse.slice(2),acts=h.nextElementSibling&&h.nextElementSibling.matches('.acts')?h.nextElementSibling:null;
      h.dataset.area97=id;h.dataset.drop='dopa:@a:'+id;
      if(drag97()){h.dataset.drag='area:'+id;h.dataset.dragmode='hold'}else{delete h.dataset.drag;delete h.dataset.dragmode}
      if(!acts)return;
      acts.dataset.area97=id;acts.dataset.drop='dopa:@a:'+id;if(manual97())acts.dataset.kb97='1';else delete acts.dataset.kb97;
      acts.querySelectorAll(':scope>.act[data-info^="act:"]').forEach(r=>{
        if(drag97()){r.dataset.drag='act:'+r.dataset.info.slice(4);r.dataset.dragmode='hold'}else{delete r.dataset.drag;delete r.dataset.dragmode}})});
    if(drag97()){const hp=$('actHelp');if(hp&&!/끌어/.test(hp.textContent))hp.textContent+=' 카드를 끌어 다른 영역에 놓으면 옮겨지고'+(manual97()?' 같은 영역 안에선 순서가 바뀌어요':'')+', 영역 이름을 끌면 칸 순서가 바뀌어요.'}
  }
  renderLog=(function(prev){return function(){const r=prev.apply(this,arguments);try{deco97()}catch(e){console.error(e)}return r}})(renderLog);
  document.addEventListener('click',ev=>{const b=ev.target.closest&&ev.target.closest('[data-mv97]');
    if(b){ev.preventDefault();ev.stopImmediatePropagation();ui.mv97=!ui.mv97;renderLog();return}
    // 영역 머리를 끌어다 제자리에 놓았을 때 접힘이 같이 바뀌지 않게
    const g=ev.target.closest&&ev.target.closest('[data-gcollapse]');if(g&&ui.dragAt97&&Date.now()-ui.dragAt97<350){ev.preventDefault();ev.stopImmediatePropagation()}},true);

  /* ---- 편집 보드: 영역 이름 끌기 표시 ---- */
  function board97(){
    const cols=document.querySelectorAll('#editBody .board57 .dcol[data-drop^="dopa:@a:"]');if(!cols.length)return;
    cols.forEach(c=>{const id=c.dataset.drop.slice(8),dh=c.querySelector(':scope>.dh');c.dataset.area97=id;
      if(dh){dh.dataset.drag='area:'+id;dh.dataset.dragmode='hold';dh.classList.add('dh97')}});
    const p=document.querySelector('#editBody .board57')&&document.querySelector('#editBody .board57').previousElementSibling;
    if(p&&p.matches('p.tiny')&&!/칸 순서/.test(p.textContent))p.textContent+=' 영역 이름을 꾹 눌러(PC는 끌어서) 옮기면 칸 순서가 바뀌어요.'}
  renderEdit=(function(prev){return function(){const r=prev.apply(this,arguments);try{board97()}catch(e){console.error(e)}return r}})(renderEdit);

  /* ---- 끌기: 타일 사이 순서(DND.drop.kb) · 영역 칸 순서 ---- */
  const mark97=()=>{const l=[];return {add(el,c){if(!el)return;el.classList.add(c);l.push([el,c])},remove(){l.forEach(([el,c])=>el.classList.remove(c));l.length=0}}};
  {const _dm=dndMove;dndMove=function(x,y,fs){_dm(x,y,fs);try{
    if(DND.kind==='area'){
      if(DND.ghost&&!DND.ghost.textContent)DND.ghost.textContent='↕ '+areaName97(DND.id);
      if(DND.ind&&DND.ind.remove&&DND.ind.__m97){DND.ind.remove();DND.ind=null}
      DND.drop=null;DND.ghost&&(DND.ghost.style.display='none');const under=document.elementFromPoint(x,y);DND.ghost&&(DND.ghost.style.display='');
      const t=under&&under.closest('[data-area97]');if(!t)return;
      const inLog=!!t.closest('#actGroups'),scope=inLog?$('actGroups'):document.querySelector('#editBody .board57');if(!scope)return;
      // 영역 칸 하나 = 기록하기: 머리+그 아래 타일 묶음 / 편집 보드: 칸
      const els=a=>[...scope.querySelectorAll(`[data-area97="${a}"]`)];
      const ids=[...new Set([...scope.querySelectorAll('[data-area97]')].map(e=>e.dataset.area97))];
      const box=a=>{const e=els(a);const rs=e.map(z=>z.getBoundingClientRect());return {l:Math.min(...rs.map(r=>r.left)),t:Math.min(...rs.map(r=>r.top)),r:Math.max(...rs.map(r=>r.right)),b:Math.max(...rs.map(r=>r.bottom))}};
      const sw=scope.getBoundingClientRect().width;let before=null,hit=null;
      for(const a of ids){if(a===DND.id)continue;const r=box(a);
        // 칸이 가로를 거의 다 차지하면(기록하기·폰 보드) 위아래로 쌓인 것 → 세로 기준, 아니면(PC 보드) 가로 기준
        const inRow=y>=r.t&&y<=r.b,stack=(r.r-r.l)>sw*0.8,mid=stack?(r.t+r.b)/2:(r.l+r.r)/2;
        if(y<r.t||(inRow&&(stack?y<mid:x<mid))){before=a;hit=a;break}}
      const m=mark97();
      if(before){const e=els(before);m.add(e[0],'ins97b')}
      else{const last=[...ids].reverse().find(a=>a!==DND.id);if(last){const e=els(last);m.add(e[e.length-1],'ins97a')}}
      m.__m97=1;DND.ind=m;DND.drop={type:'area97',id:DND.id,before};return}
    if(DND.kind!=='act'||!DND.drop||DND.drop.type!=='dopa')return;
    DND.ghost&&(DND.ghost.style.display='none');const under=document.elementFromPoint(x,y);DND.ghost&&(DND.ghost.style.display='');
    const col=under&&under.closest('.acts[data-kb97]');if(!col)return;
    const chips=[...col.querySelectorAll(':scope>.act[data-drag^="act:"]')].filter(c=>c.dataset.drag.slice(4)!==DND.id);
    let before=null;for(const c of chips){const r=c.getBoundingClientRect();if(y<r.top||(y<=r.bottom&&x<r.left+r.width/2)){before=c;break}}
    const m=mark97();if(before)m.add(before,'ins97b');else if(chips.length)m.add(chips[chips.length-1],'ins97a');else return;
    if(DND.ind&&DND.ind!==m&&DND.ind.remove)DND.ind.remove();m.__m97=1;DND.ind=m;
    DND.drop.kb={before:before?before.dataset.drag.slice(4):null,last:chips.length?chips[chips.length-1].dataset.drag.slice(4):null,ids:[DND.id]};
  }catch(e){console.error(e)}}}
  {const _de=dndEnd;dndEnd=function(x,y){const d=DND.drop,kind=DND.kind,id=DND.id;
    const r=_de(x,y);
    try{if(kind==='area'){ui.dragAt97=Date.now();
      if(d&&d.type==='area97'){const it=C.areas.find(a=>a.id===id);if(it){const rest=C.areas.filter(a=>a!==it);let i=d.before?rest.findIndex(a=>a.id===d.before):rest.length;if(i<0)i=rest.length;rest.splice(i,0,it);
        if(rest.some((a,k)=>a!==C.areas[k])){C.areas=rest;save('config');render();if(typeof reEdit==='function'&&curView()==='edit')reEdit();toast(`영역 순서를 바꿨어요 · ${it.name}`)}}}}
    }catch(e){console.error(e)}
    return r}}
}
